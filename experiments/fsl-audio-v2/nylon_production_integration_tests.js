const assert = require("assert");
const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..", "..");
const ENGINE_PATH = path.join(ROOT, "outputs", "audio-engine.js");
const CALIBRATION_PATH = path.join(__dirname, "nylon-level-audit", "calibration_manifest.json");
const MAPPING_PATH = path.join(__dirname, "nylon-level-audit", "production_mapping.json");
const AUDIO_ROOT = path.join(ROOT, "outputs", "assets", "audio");
const ENGINE_SOURCE = fs.readFileSync(ENGINE_PATH, "utf8");
const CALIBRATION = JSON.parse(fs.readFileSync(CALIBRATION_PATH, "utf8"));
const MAPPING = JSON.parse(fs.readFileSync(MAPPING_PATH, "utf8"));
const VELOCITY = 0.7;
const MAKEUP_DB = 0.5;
const MAKEUP_GAIN = 10 ** (MAKEUP_DB / 20);
const MASTER_GAIN = 0.78;
const COMPRESSOR = Object.freeze({ threshold: -8, knee: 24, ratio: 3 });

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function snapshotAudioAssets() {
  const files = [];
  const visit = (directory) => fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const resolved = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(resolved);
    else files.push(resolved);
  });
  visit(AUDIO_ROOT);
  return Object.fromEntries(files.sort().map((file) => [
    path.relative(ROOT, file).replaceAll(path.sep, "/"),
    sha256(fs.readFileSync(file))
  ]));
}

function scientificPitch(midi) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

function createProductionHarness() {
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
      this.startCalls = [];
      this.stopCalls = [];
      this.buffer = null;
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

  const audioContext = new AudioContext();
  const fetchMock = async (url) => ({
    ok: true,
    async arrayBuffer() {
      return { sourceUrl: String(url), slice() { return this; } };
    }
  });
  const window = {
    AudioContext: function AudioContextCtor() { return audioContext; },
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
  vm.runInContext(ENGINE_SOURCE, context, { filename: "outputs/audio-engine.js" });
  return { engine: window.AudioEngine, sources };
}

function initialVoiceGain(source) {
  assert.ok(source, "Nylon playback must create a source");
  assert.strictEqual(source.connections.length, 1, "Nylon source must connect to one voice gain");
  const voiceGain = source.connections[0];
  assert.ok(voiceGain.gain, "Nylon source destination must be a gain node");
  return voiceGain.gain.events.find((event) => event.type === "set").value;
}

async function verifyProductionGainRouting() {
  const harness = createProductionHarness();
  const fslGains = new Map();
  const soundLabGains = new Map();
  await harness.engine.unlock();
  assert.strictEqual(await harness.engine.prepareSoundLabSampler(), "ready");

  for (let midi = 40; midi <= 76; midi += 1) {
    const candidate = CALIBRATION.notes[String(midi)];
    assert.ok(candidate, `Approved candidate must contain MIDI ${midi}`);
    const expected = VELOCITY * candidate.calibrationGain * MAKEUP_GAIN;
    const beforeFsl = harness.sources.length;
    assert.strictEqual(await harness.engine.playNote({
      channel: "fsl",
      profile: "fsl-fretboard-position",
      instrument: "nylon",
      note: scientificPitch(midi),
      velocity: VELOCITY
    }), true);
    const fslGain = initialVoiceGain(harness.sources[beforeFsl]);
    assert.ok(Math.abs(fslGain - expected) < 1e-12, `FSL MIDI ${midi} effective gain`);
    fslGains.set(midi, fslGain);

    if (midi >= 48) {
      const beforeSoundLab = harness.sources.length;
      assert.strictEqual(await harness.engine.playNote({
        channel: "soundlab",
        profile: "soundlab-guide-tone",
        instrument: "nylon",
        note: scientificPitch(midi),
        velocity: VELOCITY
      }), true);
      const soundLabGain = initialVoiceGain(harness.sources[beforeSoundLab]);
      assert.ok(Math.abs(soundLabGain - expected) < 1e-12, `Sound Lab MIDI ${midi} effective gain`);
      assert.strictEqual(soundLabGain, fslGain, `FSL and Sound Lab MIDI ${midi} gain must match exactly`);
      soundLabGains.set(midi, soundLabGain);
    }

    const beforeLesson = harness.sources.length;
    assert.strictEqual(await harness.engine.playNote({
      channel: "lessons",
      profile: "lessons-profile",
      instrument: "nylon",
      note: scientificPitch(midi),
      velocity: VELOCITY
    }), true);
    assert.strictEqual(initialVoiceGain(harness.sources[beforeLesson]), VELOCITY, `Lesson MIDI ${midi} must remain uncalibrated`);
  }

  const status = harness.engine.getStatus();
  assert.strictEqual(status.nylonCalibrationNoteCount, 37);
  assert.strictEqual(status.nylonGlobalMakeupDb, MAKEUP_DB);
  return { fslGains, soundLabGains };
}

function decodeMappedPcm(midi) {
  const mapping = MAPPING.targets.find((entry) => entry.targetMidi === midi);
  assert.ok(mapping, `Production mapping must contain MIDI ${midi}`);
  const result = childProcess.spawnSync("ffmpeg", [
    "-v", "error",
    "-i", path.join(ROOT, mapping.sourcePath),
    "-af", `asetrate=44100*${mapping.playbackRate},aresample=44100`,
    "-ac", "1",
    "-f", "f32le",
    "pipe:1"
  ], { maxBuffer: 128 * 1024 * 1024 });
  assert.strictEqual(result.status, 0, result.stderr.toString("utf8"));
  const samples = new Float32Array(
    result.stdout.buffer,
    result.stdout.byteOffset,
    Math.floor(result.stdout.byteLength / Float32Array.BYTES_PER_ELEMENT)
  );
  return { mapping, samples };
}

function compressorStaticOutput(sample) {
  const magnitude = Math.abs(sample);
  if (magnitude < 1e-12) return 0;
  const inputDb = 20 * Math.log10(magnitude);
  const { threshold, knee, ratio } = COMPRESSOR;
  let outputDb;
  if (inputDb < threshold - (knee / 2)) {
    outputDb = inputDb;
  } else if (inputDb > threshold + (knee / 2)) {
    outputDb = threshold + ((inputDb - threshold) / ratio);
  } else {
    const kneePosition = inputDb - threshold + (knee / 2);
    outputDb = inputDb + ((1 / ratio) - 1) * (kneePosition ** 2) / (2 * knee);
  }
  return Math.sign(sample) * (10 ** (outputDb / 20));
}

function verifySummedHeadroom(label, midis) {
  const tracks = midis.map((midi) => {
    const candidate = CALIBRATION.notes[String(midi)];
    const decoded = decodeMappedPcm(midi);
    return {
      samples: decoded.samples,
      gain: VELOCITY * candidate.calibrationGain * MAKEUP_GAIN
    };
  });
  const sampleCount = Math.min(...tracks.map((track) => track.samples.length));
  let destinationPeak = 0;
  let clippedSampleCount = 0;
  for (let index = 0; index < sampleCount; index += 1) {
    const voiceSum = tracks.reduce((sum, track) => sum + (track.samples[index] * track.gain), 0);
    const destinationSample = compressorStaticOutput(voiceSum * MASTER_GAIN);
    destinationPeak = Math.max(destinationPeak, Math.abs(destinationSample));
    if (Math.abs(destinationSample) >= 1) clippedSampleCount += 1;
  }
  const peakDbfs = 20 * Math.log10(destinationPeak);
  assert.strictEqual(clippedSampleCount, 0, `${label} must have no destination clipping`);
  assert.ok(destinationPeak < 1, `${label} must retain positive destination headroom`);
  return { label, voiceCount: midis.length, peakDbfs, headroomDb: -peakDbfs, clippedSampleCount };
}

async function run() {
  const assetsBefore = snapshotAudioAssets();
  assert.strictEqual(Object.keys(CALIBRATION.notes).length, 37);
  assert.strictEqual(MAKEUP_DB, 0.5);
  assert.strictEqual((ENGINE_SOURCE.match(/createDynamicsCompressor\(\)/g) || []).length, 1, "No compressor may be added");
  assert.strictEqual(ENGINE_SOURCE.includes("createWaveShaper"), false, "No saturation/waveshaper may be added");
  assert.strictEqual(ENGINE_SOURCE.includes("perStringGain"), false);
  assert.strictEqual(ENGINE_SOURCE.includes("perFretGain"), false);
  assert.ok(ENGINE_SOURCE.includes("masterGain.gain.setValueAtTime(0.78"));
  assert.ok(ENGINE_SOURCE.includes("compressor.threshold.value = -8"));
  assert.ok(ENGINE_SOURCE.includes("compressor.knee.value = 24"));
  assert.ok(ENGINE_SOURCE.includes("compressor.ratio.value = 3"));

  await verifyProductionGainRouting();
  const triad = verifySummedHeadroom("C Major triad", [60, 64, 67]);
  const chord = verifySummedHeadroom("six-string G chord", [43, 50, 55, 59, 62, 67]);
  assert.deepStrictEqual(snapshotAudioAssets(), assetsBefore, "Audio asset bytes must remain unchanged");

  process.stdout.write(`Nylon production integration PASS: 37 MIDI gains, +${MAKEUP_DB.toFixed(1)} dB once, FSL/Sound Lab exact match.\n`);
  process.stdout.write(`${triad.label}: ${triad.peakDbfs.toFixed(3)} dBFS, ${triad.clippedSampleCount} clipped samples.\n`);
  process.stdout.write(`${chord.label}: ${chord.peakDbfs.toFixed(3)} dBFS, ${chord.clippedSampleCount} clipped samples.\n`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
