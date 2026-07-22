const assert = require("assert");
const fs = require("fs");
const http = require("http");
const path = require("path");
const vm = require("vm");
const {
  APP_PATH,
  ENGINE_PATH,
  POLICY,
  ROOT,
  buildArtifacts,
  sha256
} = require("./nylon-audit");

const AUDIT_DIR = __dirname;
const EXPECTED_ARTIFACTS = [
  "audit_policy.json",
  "audit_report.json",
  "calibration_manifest.json",
  "gain_curve.csv",
  "production_mapping.json",
  "rendered_measurements.json"
];

function snapshotAssetHashes() {
  const assetRoot = path.join(ROOT, "outputs", "assets", "audio");
  const files = [];
  const visit = (directory) => {
    fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
      const resolved = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(resolved);
      else files.push(resolved);
    });
  };
  visit(assetRoot);
  return Object.fromEntries(files.sort().map((file) => [path.relative(ROOT, file).replaceAll(path.sep, "/"), sha256(fs.readFileSync(file))]));
}

function verifyElectricTranspositionMap() {
  const mapPath = path.join(ROOT, "outputs", "assets", "audio", "electric", "APPROVED_SAMPLE_MAP.json");
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  assert.strictEqual(map.schemaVersion, 2);
  assert.strictEqual(map.midi_range.low, 40);
  assert.strictEqual(map.midi_range.high, 76);
  assert.deepStrictEqual(Object.keys(map.notes).map(Number), Array.from({ length: 37 }, (_, index) => 40 + index));
  Object.entries(map.notes).forEach(([targetMidi, entry]) => {
    const expectedRate = 2 ** ((Number(targetMidi) - entry.sourceMidi) / 12);
    assert.ok(Number.isFinite(expectedRate) && expectedRate > 0);
    assert.ok(entry.path.startsWith("assets/audio/electric/"));
  });
}

function createProductionHarness() {
  const engineSource = fs.readFileSync(ENGINE_PATH, "utf8");
  const sources = [];

  class Param {
    constructor() {
      this.value = 1;
      this.events = [];
    }
    setValueAtTime(value, time) {
      this.value = value;
      this.events.push({ type: "set", value, time });
    }
    linearRampToValueAtTime(value, time) { this.events.push({ type: "linear", value, time }); }
    exponentialRampToValueAtTime(value, time) { this.events.push({ type: "exponential", value, time }); }
  }

  class Node {
    constructor() { this.connections = []; }
    connect(destination) { this.connections.push(destination); return destination; }
    disconnect() {}
  }

  class Source extends Node {
    constructor() {
      super();
      this.playbackRate = new Param();
      this.buffer = null;
      this.startCalls = [];
      this.stopCalls = [];
      sources.push(this);
    }
    start(time) { this.startCalls.push(time); }
    stop(time) { this.stopCalls.push(time); }
  }

  class AudioContext {
    constructor() {
      this.currentTime = 0;
      this.state = "running";
      this.destination = new Node();
    }
    createGain() {
      const node = new Node();
      node.gain = new Param();
      return node;
    }
    createDynamicsCompressor() {
      const node = new Node();
      ["threshold", "knee", "ratio", "attack", "release"].forEach((key) => { node[key] = { value: 0 }; });
      return node;
    }
    createBufferSource() { return new Source(); }
    createOscillator() {
      const node = new Source();
      node.frequency = new Param();
      node.detune = new Param();
      return node;
    }
    createBiquadFilter() {
      const node = new Node();
      node.frequency = new Param();
      node.Q = new Param();
      return node;
    }
    async resume() {}
    async decodeAudioData(encoded) { return { duration: 3.125, sourceUrl: encoded.sourceUrl }; }
  }

  const fetchMock = async (url) => ({
    ok: true,
    async arrayBuffer() {
      return { sourceUrl: String(url), slice() { return this; } };
    }
  });
  const mockContext = new AudioContext();
  const window = {
    AudioContext: function AudioContextCtor() { return mockContext; },
    setTimeout() { return 1; },
    clearTimeout() {}
  };
  const context = vm.createContext({
    window,
    fetch: fetchMock,
    console: { warn() {} },
    Map,
    Set,
    Math,
    Number,
    Object,
    Promise,
    String
  });
  vm.runInContext(engineSource, context, { filename: "outputs/audio-engine.js" });
  return { engine: window.AudioEngine, sources };
}

function scientificPitch(midi) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

async function verifyProductionExecution(mapping, calibration) {
  const harness = createProductionHarness();
  const makeupGain = 10 ** (0.5 / 20);
  await harness.engine.unlock();
  await harness.engine.prepareSoundLabSampler();
  for (const target of mapping.targets) {
    const expectedGain = 0.7 * calibration.notes[String(target.targetMidi)].calibrationGain * makeupGain;
    const beforeFsl = harness.sources.length;
    assert.strictEqual(await harness.engine.playNote({
      channel: "fsl",
      profile: "fsl-fretboard-position",
      instrument: "nylon",
      note: scientificPitch(target.targetMidi),
      velocity: 0.7
    }), true);
    const fslSource = harness.sources[beforeFsl];
    const expectedUrl = target.sourcePath.replace(/^outputs\//, "");
    assert.strictEqual(fslSource.buffer.sourceUrl, expectedUrl);
    assert.ok(Math.abs(fslSource.playbackRate.events[0].value - target.playbackRate) < 1e-12);
    assert.ok(Math.abs(fslSource.connections[0].gain.events[0].value - expectedGain) < 1e-12);

    const beforeSoundLab = harness.sources.length;
    assert.strictEqual(await harness.engine.playNote({
      channel: "soundlab",
      profile: "soundlab-guide-tone",
      instrument: "nylon",
      note: scientificPitch(target.targetMidi),
      velocity: 0.7
    }), target.targetMidi >= 48);
    if (target.targetMidi >= 48) {
      const soundLabSource = harness.sources[beforeSoundLab];
      assert.strictEqual(soundLabSource.buffer.sourceUrl, expectedUrl);
      assert.ok(Math.abs(soundLabSource.playbackRate.events[0].value - target.playbackRate) < 1e-12);
      assert.ok(Math.abs(soundLabSource.connections[0].gain.events[0].value - expectedGain) < 1e-12);
    }
  }

  const beforeLesson = harness.sources.length;
  assert.strictEqual(await harness.engine.playNote({
    channel: "lessons",
    profile: "lessons-profile",
    instrument: "nylon",
    note: "E4",
    velocity: 0.7
  }), true);
  assert.strictEqual(harness.sources[beforeLesson].connections[0].gain.events[0].value, 0.7);
  const status = harness.engine.getStatus();
  assert.strictEqual(status.nylonCalibrationNoteCount, 37);
  assert.strictEqual(status.nylonGlobalMakeupDb, 0.5);
}

function assertEquivalentPositions(positions, first, second) {
  const left = positions.find((position) => position.string === first[0] && position.fret === first[1]);
  const right = positions.find((position) => position.string === second[0] && position.fret === second[1]);
  assert.strictEqual(left.targetMidi, right.targetMidi);
  assert.strictEqual(left.sourcePath, right.sourcePath);
  assert.strictEqual(left.sourceMidi, right.sourceMidi);
  assert.strictEqual(left.playbackRate, right.playbackRate);
  assert.strictEqual(left.gain, right.gain);
}

async function httpSmoke() {
  const server = http.createServer((request, response) => {
    const requestPath = request.url === "/" ? "/experiments/fsl-audio-v2/nylon-level-audit/audition.html" : request.url;
    const resolved = path.resolve(ROOT, requestPath.replace(/^\//, ""));
    if (!resolved.startsWith(`${ROOT}${path.sep}`) || !fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      response.writeHead(404);
      response.end("Not Found");
      return;
    }
    response.writeHead(200);
    response.end(fs.readFileSync(resolved));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  const request = (pathname) => new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}${pathname}`, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve({ status: response.statusCode, body: Buffer.concat(chunks) }));
    }).on("error", reject);
  });
  try {
    const page = await request("/experiments/fsl-audio-v2/nylon-level-audit/audition.html");
    const calibration = await request("/experiments/fsl-audio-v2/nylon-level-audit/calibration_manifest.json");
    const sample = await request("/outputs/assets/audio/nylon-guitar/A3.ogg");
    assert.strictEqual(page.status, 200);
    assert.ok(page.body.toString("utf8").includes("Nylon Level Consistency"));
    assert.strictEqual(calibration.status, 200);
    assert.strictEqual(Object.keys(JSON.parse(calibration.body.toString("utf8")).notes).length, 37);
    assert.strictEqual(sample.status, 200);
    assert.ok(sample.body.length > 0);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function run() {
  const assetsBefore = snapshotAssetHashes();
  const engineBefore = sha256(fs.readFileSync(ENGINE_PATH));
  const appBefore = sha256(fs.readFileSync(APP_PATH));
  const first = buildArtifacts();
  const second = buildArtifacts();
  assert.deepStrictEqual(Object.keys(first).sort(), EXPECTED_ARTIFACTS);
  EXPECTED_ARTIFACTS.forEach((filename) => {
    assert.strictEqual(first[filename], second[filename], `${filename} must regenerate byte-identically`);
  });

  const mapping = JSON.parse(first["production_mapping.json"]);
  const measurements = JSON.parse(first["rendered_measurements.json"]);
  const regeneratedCalibration = JSON.parse(first["calibration_manifest.json"]);
  const calibration = JSON.parse(fs.readFileSync(path.join(AUDIT_DIR, "calibration_manifest.json"), "utf8"));
  const report = JSON.parse(first["audit_report.json"]);
  assert.deepStrictEqual(
    regeneratedCalibration.notes,
    calibration.notes,
    "Production integration must preserve every approved per-MIDI calibration value"
  );
  assert.strictEqual(mapping.targets.length, 37);
  assert.strictEqual(mapping.positions.length, 78);
  assert.deepStrictEqual(mapping.targets.map((entry) => entry.targetMidi), Array.from({ length: 37 }, (_, index) => 40 + index));
  assert.strictEqual(measurements.notes.length, 37);
  assert.strictEqual(Object.keys(calibration.notes).length, 37);
  assert.strictEqual(report.positionEquivalenceStatus, "PASS");
  assert.ok(report.classifications.includes("SOURCE_ANCHOR_LEVEL_MISMATCH"));
  assert.ok(!report.classifications.includes("POSITION_ROUTING_BUG"));
  assert.ok(!report.classifications.includes("OVERLAP_OR_LIFECYCLE_ACCUMULATION"));

  assertEquivalentPositions(mapping.positions, [1, 0], [2, 5]);
  assertEquivalentPositions(mapping.positions, [2, 0], [3, 4]);
  assertEquivalentPositions(mapping.positions, [3, 0], [4, 5]);
  assertEquivalentPositions(mapping.positions, [4, 0], [5, 5]);
  assertEquivalentPositions(mapping.positions, [5, 0], [6, 5]);

  await verifyProductionExecution(mapping, calibration);
  verifyElectricTranspositionMap();
  measurements.notes.forEach((measurement) => {
    assert.ok(Number.isFinite(measurement.playbackRate) && measurement.playbackRate > 0);
    assert.ok(Number.isFinite(measurement.peakDbfs));
    assert.ok(Number.isFinite(measurement.attackRmsDbfs));
    assert.ok(Number.isFinite(measurement.bodyRmsDbfs));
    assert.ok(Number.isFinite(measurement.durationSeconds));
    assert.ok(Number.isFinite(measurement.dcOffset));
    assert.strictEqual(measurement.clippingSampleCount, 0);
    assert.strictEqual(measurement.sourceSha256, assetsBefore[measurement.sourcePath]);
  });
  Object.values(calibration.notes).forEach((entry) => {
    assert.ok(Number.isFinite(entry.calibrationGain) && entry.calibrationGain > 0);
    assert.ok(entry.boundedFinalGainDb >= POLICY.correctionBoundsDb[0] - 1e-9);
    assert.ok(entry.boundedFinalGainDb <= POLICY.correctionBoundsDb[1] + 1e-9);
    assert.ok(entry.predictedPeakDbfs < -1 + 1e-9);
    assert.strictEqual(Object.hasOwn(entry, "string"), false);
    assert.strictEqual(Object.hasOwn(entry, "fret"), false);
    assert.strictEqual(Object.hasOwn(entry, "perStringGain"), false);
    assert.strictEqual(Object.hasOwn(entry, "perFretGain"), false);
  });

  const audition = fs.readFileSync(path.join(AUDIT_DIR, "audition.html"), "utf8");
  assert.strictEqual((audition.match(/function playMappedNote\(/g) || []).length, 1);
  assert.strictEqual((audition.match(/function releaseVoice\(/g) || []).length, 1);
  assert.ok(audition.includes("const adjustment = selectedGain(targetMidi);"));
  assert.ok(audition.includes("source.playbackRate.setValueAtTime(mapping.playbackRate"));
  assert.ok(audition.includes("PRODUCTION_VELOCITY * adjustment.multiplier"));
  assert.ok(!audition.includes("perStringGain"));
  assert.ok(!audition.includes("perFretGain"));

  await httpSmoke();
  assert.deepStrictEqual(snapshotAssetHashes(), assetsBefore, "Nylon, Synth, and Electric audio assets must remain byte-identical");
  assert.strictEqual(sha256(fs.readFileSync(ENGINE_PATH)), engineBefore);
  assert.strictEqual(sha256(fs.readFileSync(APP_PATH)), appBefore);
  process.stdout.write("Nylon audit tests passed: 37 targets, 78 positions, production execution, calibration, assets, HTTP.\n");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
