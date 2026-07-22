const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "../../..");
const ENGINE_PATH = path.join(ROOT, "outputs", "audio-engine.js");
const APP_PATH = path.join(ROOT, "outputs", "app.js");
const OUTPUT_DIR = __dirname;

const POLICY = Object.freeze({
  schemaVersion: "nylon-level-audit-policy/1",
  policyVersion: "v2.5a-1",
  algorithmVersion: "production-map-rendered-pcm-median-v1",
  measurementMode: "rendered-production-mapping",
  renderSampleRate: 44100,
  productionReferenceVelocity: 0.7,
  attackWindowSeconds: Object.freeze([0, 0.1]),
  bodyWindowSeconds: Object.freeze([0.25, 0.75]),
  correctionBoundsDb: Object.freeze([-4, 4]),
  minimumPredictedPeakHeadroomDb: 1,
  objectiveAdjacentDifferenceDb: 1.5,
  objectiveWithinAnchorDifferenceDb: 1,
  postCalibrationToleranceDb: 1.5,
  smoothing: Object.freeze({
    kernel: Object.freeze([0.25, 0.5, 0.25]),
    passes: 2,
    maxAdjacentStepDb: 1
  }),
  auditoryAcceptance: "pending-product-owner"
});

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function round(value, places = 6) {
  return Number(value.toFixed(places));
}

function linearToDb(value) {
  return value > 0 ? 20 * Math.log10(value) : Number.NEGATIVE_INFINITY;
}

function dbToLinear(value) {
  return 10 ** (value / 20);
}

function midiToPitch(midi) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

function extractFrozenArray(source, constantName) {
  const pattern = new RegExp(`const\\s+${constantName}\\s*=\\s*Object\\.freeze\\((\\[[\\s\\S]*?\\])\\);`);
  const match = source.match(pattern);
  if (!match) throw new Error(`Unable to extract ${constantName} from production source`);
  return vm.runInNewContext(match[1], Object.create(null));
}

function readProductionPolicy() {
  const engineBytes = fs.readFileSync(ENGINE_PATH);
  const appBytes = fs.readFileSync(APP_PATH);
  const engineSource = engineBytes.toString("utf8");
  const appSource = appBytes.toString("utf8");
  const anchors = extractFrozenArray(engineSource, "APPROVED_SOUNDLAB_SAMPLES").map((anchor) => ({
    note: anchor.note,
    sourceMidi: anchor.midi,
    sourcePath: `outputs/${anchor.url}`
  }));
  const openStrings = Array.from(extractFrozenArray(appSource, "FSL_OPEN_STRING_MIDI"));
  if (anchors.length !== 7 || openStrings.length !== 6) throw new Error("Unexpected production Nylon policy shape");
  return {
    anchors,
    openStrings,
    engineSha256: sha256(engineBytes),
    appSha256: sha256(appBytes)
  };
}

function resolveMapping(targetMidi, anchors) {
  const anchor = anchors.reduce((nearest, candidate) => {
    if (!nearest) return candidate;
    return Math.abs(candidate.sourceMidi - targetMidi) < Math.abs(nearest.sourceMidi - targetMidi)
      ? candidate
      : nearest;
  }, null);
  return {
    targetMidi,
    scientificPitch: midiToPitch(targetMidi),
    sourceMidi: anchor.sourceMidi,
    sourceNote: anchor.note,
    sourcePath: anchor.sourcePath,
    playbackRate: 2 ** ((targetMidi - anchor.sourceMidi) / 12),
    runtimeVoiceGain: POLICY.productionReferenceVelocity,
    runtimeChannelGain: 1,
    effectiveCurrentGain: POLICY.productionReferenceVelocity
  };
}

function buildPositionMap(openStrings, targetMappings) {
  const byMidi = new Map(targetMappings.map((mapping) => [mapping.targetMidi, mapping]));
  const positions = [];
  openStrings.forEach((openMidi, stringIndex) => {
    for (let fret = 0; fret <= 12; fret += 1) {
      const targetMidi = openMidi + fret;
      const mapping = byMidi.get(targetMidi);
      positions.push({
        string: stringIndex + 1,
        fret,
        targetMidi,
        scientificPitch: midiToPitch(targetMidi),
        sourcePath: mapping.sourcePath,
        sourceMidi: mapping.sourceMidi,
        playbackRate: mapping.playbackRate,
        gain: mapping.effectiveCurrentGain
      });
    }
  });
  return positions;
}

function assertPositionEquivalence(positions) {
  const byMidi = new Map();
  positions.forEach((position) => {
    const comparable = {
      sourcePath: position.sourcePath,
      sourceMidi: position.sourceMidi,
      playbackRate: position.playbackRate,
      gain: position.gain
    };
    if (!byMidi.has(position.targetMidi)) {
      byMidi.set(position.targetMidi, comparable);
      return;
    }
    const expected = byMidi.get(position.targetMidi);
    if (
      expected.sourcePath !== comparable.sourcePath
      || expected.sourceMidi !== comparable.sourceMidi
      || Math.abs(expected.playbackRate - comparable.playbackRate) > 1e-12
      || expected.gain !== comparable.gain
    ) {
      throw new Error(`NYLON_POSITION_ROUTING_BUG at MIDI ${position.targetMidi}`);
    }
  });
}

function decodeRenderedTarget(mapping) {
  const sourceFile = path.join(ROOT, mapping.sourcePath);
  const adjustedRate = POLICY.renderSampleRate * mapping.playbackRate;
  const result = childProcess.spawnSync("ffmpeg", [
    "-v", "error",
    "-i", sourceFile,
    "-af", `asetrate=${adjustedRate},aresample=${POLICY.renderSampleRate}`,
    "-ac", "1",
    "-f", "f32le",
    "pipe:1"
  ], { encoding: null, maxBuffer: 128 * 1024 * 1024 });
  if (result.status !== 0) {
    throw new Error(`ffmpeg render failed for MIDI ${mapping.targetMidi}: ${result.stderr.toString("utf8")}`);
  }
  if (result.stdout.length % 4 !== 0) throw new Error(`Malformed float PCM for MIDI ${mapping.targetMidi}`);

  const samples = new Float64Array(result.stdout.length / 4);
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = result.stdout.readFloatLE(index * 4) * mapping.effectiveCurrentGain;
  }
  return { samples, sourceSha256: sha256(fs.readFileSync(sourceFile)) };
}

function rms(samples, startIndex, endIndex) {
  let sumSquares = 0;
  for (let index = startIndex; index < endIndex; index += 1) sumSquares += samples[index] ** 2;
  return Math.sqrt(sumSquares / (endIndex - startIndex));
}

function measureRenderedTarget(mapping) {
  const { samples, sourceSha256 } = decodeRenderedTarget(mapping);
  const attackStart = Math.floor(POLICY.attackWindowSeconds[0] * POLICY.renderSampleRate);
  const attackEnd = Math.floor(POLICY.attackWindowSeconds[1] * POLICY.renderSampleRate);
  const bodyStart = Math.floor(POLICY.bodyWindowSeconds[0] * POLICY.renderSampleRate);
  const bodyEnd = Math.floor(POLICY.bodyWindowSeconds[1] * POLICY.renderSampleRate);
  if (samples.length < bodyEnd) throw new Error(`Rendered MIDI ${mapping.targetMidi} is shorter than the common body window`);

  let peak = 0;
  let sum = 0;
  let clippingSampleCount = 0;
  for (const sample of samples) {
    peak = Math.max(peak, Math.abs(sample));
    sum += sample;
    if (Math.abs(sample) >= 1) clippingSampleCount += 1;
  }
  const attackRms = rms(samples, attackStart, attackEnd);
  const bodyRms = rms(samples, bodyStart, bodyEnd);
  return {
    ...mapping,
    sourceSha256,
    renderedSampleRate: POLICY.renderSampleRate,
    renderedSampleCount: samples.length,
    durationSeconds: round(samples.length / POLICY.renderSampleRate),
    peak: round(peak, 12),
    peakDbfs: round(linearToDb(peak)),
    attackRms: round(attackRms, 12),
    attackRmsDbfs: round(linearToDb(attackRms)),
    bodyRms: round(bodyRms, 12),
    bodyRmsDbfs: round(linearToDb(bodyRms)),
    dcOffset: round(sum / samples.length, 12),
    clippingSampleCount
  };
}

function median(values) {
  const sorted = values.slice().sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

function smooth(values) {
  let output = values.slice();
  for (let pass = 0; pass < POLICY.smoothing.passes; pass += 1) {
    output = output.map((value, index, current) => (
      (current[Math.max(0, index - 1)] * 0.25)
      + (value * 0.5)
      + (current[Math.min(current.length - 1, index + 1)] * 0.25)
    ));
  }
  return output;
}

function constrainAdjacent(values) {
  const output = values.slice();
  const limit = POLICY.smoothing.maxAdjacentStepDb;
  for (let index = 1; index < output.length; index += 1) {
    output[index] = Math.max(output[index - 1] - limit, Math.min(output[index - 1] + limit, output[index]));
  }
  for (let index = output.length - 2; index >= 0; index -= 1) {
    output[index] = Math.max(output[index + 1] - limit, Math.min(output[index + 1] + limit, output[index]));
  }
  return output;
}

function calculateCalibration(measurements) {
  const referenceBodyDbfs = median(measurements.map((measurement) => measurement.bodyRmsDbfs));
  const rawCorrections = measurements.map((measurement) => referenceBodyDbfs - measurement.bodyRmsDbfs);
  const smoothedCorrections = constrainAdjacent(smooth(rawCorrections));
  return measurements.map((measurement, index) => {
    const correctionBoundedDb = Math.max(
      POLICY.correctionBoundsDb[0],
      Math.min(POLICY.correctionBoundsDb[1], smoothedCorrections[index])
    );
    const headroomLimitDb = -POLICY.minimumPredictedPeakHeadroomDb - measurement.peakDbfs;
    const finalGainDb = Math.min(correctionBoundedDb, headroomLimitDb);
    const calibratedBodyDbfs = measurement.bodyRmsDbfs + finalGainDb;
    return {
      targetMidi: measurement.targetMidi,
      scientificPitch: measurement.scientificPitch,
      sourcePath: measurement.sourcePath,
      sourceMidi: measurement.sourceMidi,
      playbackRate: round(measurement.playbackRate, 12),
      referenceBodyDbfs: round(referenceBodyDbfs),
      rawCalculatedGainDb: round(rawCorrections[index]),
      smoothedGainDb: round(smoothedCorrections[index]),
      boundedFinalGainDb: round(finalGainDb),
      calibrationGain: round(dbToLinear(finalGainDb), 12),
      predictedPeakDbfs: round(measurement.peakDbfs + finalGainDb),
      calibratedBodyDbfs: round(calibratedBodyDbfs),
      limitedByCorrectionBound: Math.abs(correctionBoundedDb - smoothedCorrections[index]) > 1e-9,
      limitedByHeadroom: finalGainDb < correctionBoundedDb - 1e-9,
      remainsOutsideTolerance: Math.abs(calibratedBodyDbfs - referenceBodyDbfs) > POLICY.postCalibrationToleranceDb
    };
  });
}

function addAdjacentAnalysis(measurements) {
  return measurements.map((measurement, index) => {
    if (index === 0) return { ...measurement, adjacentBodyDifferenceDb: null, sourceAnchorBoundary: false };
    const previous = measurements[index - 1];
    return {
      ...measurement,
      adjacentBodyDifferenceDb: round(measurement.bodyRmsDbfs - previous.bodyRmsDbfs),
      sourceAnchorBoundary: measurement.sourcePath !== previous.sourcePath
    };
  });
}

function classify(measurements) {
  const classifications = [];
  const boundaryJumps = measurements.filter(
    (measurement) => measurement.sourceAnchorBoundary
      && Math.abs(measurement.adjacentBodyDifferenceDb) > POLICY.objectiveAdjacentDifferenceDb
  );
  const withinAnchorJumps = measurements.filter(
    (measurement) => !measurement.sourceAnchorBoundary
      && measurement.adjacentBodyDifferenceDb !== null
      && Math.abs(measurement.adjacentBodyDifferenceDb) > POLICY.objectiveWithinAnchorDifferenceDb
  );
  if (boundaryJumps.length) classifications.push("SOURCE_ANCHOR_LEVEL_MISMATCH");
  if (withinAnchorJumps.length) classifications.push("TRANSPOSITION_LEVEL_DRIFT");
  if (!classifications.length) classifications.push("NO_OBJECTIVE_LEVEL_PROBLEM_FOUND");
  return { classifications, boundaryJumps, withinAnchorJumps };
}

function buildArtifacts() {
  const production = readProductionPolicy();
  const mappings = Array.from({ length: 37 }, (_, index) => resolveMapping(40 + index, production.anchors));
  const positions = buildPositionMap(production.openStrings, mappings);
  assertPositionEquivalence(positions);
  const measurements = addAdjacentAnalysis(mappings.map(measureRenderedTarget));
  const classification = classify(measurements);
  const objectiveProblem = classification.classifications[0] !== "NO_OBJECTIVE_LEVEL_PROBLEM_FOUND";
  const calibration = objectiveProblem ? calculateCalibration(measurements) : [];
  const sourceBoundaries = measurements.filter((measurement) => measurement.sourceAnchorBoundary);
  const largestAdjacent = measurements.slice(1).reduce((largest, current) => (
    Math.abs(current.adjacentBodyDifferenceDb) > Math.abs(largest.adjacentBodyDifferenceDb) ? current : largest
  ));
  const sourceHashes = Object.fromEntries(production.anchors.map((anchor) => [
    anchor.sourcePath,
    sha256(fs.readFileSync(path.join(ROOT, anchor.sourcePath)))
  ]));

  const mappingArtifact = {
    schemaVersion: "nylon-production-mapping-audit/1",
    productionEngineSha256: production.engineSha256,
    productionAppSha256: production.appSha256,
    extractionMethod: "APPROVED_SOUNDLAB_SAMPLES and FSL_OPEN_STRING_MIDI parsed from production source",
    mappingPolicy: "nearest source MIDI; ties retain the earlier production anchor",
    runtimeGainPolicy: {
      voiceGain: "caller velocity; FSL production reference is 0.7",
      fslChannelGain: 1,
      soundLabChannelGain: 1,
      sharedResolverAndVoicePath: true
    },
    activeVoiceLifecycle: "active channel group is stopped and disconnected before replacement; no Nylon overlap path",
    anchors: production.anchors,
    sourceHashes,
    targets: mappings,
    positions
  };
  const measurementArtifact = {
    schemaVersion: "nylon-rendered-target-measurements/1",
    policyVersion: POLICY.policyVersion,
    algorithmVersion: POLICY.algorithmVersion,
    measurementMode: POLICY.measurementMode,
    measurementPolicy: POLICY,
    notes: measurements
  };
  const calibrationArtifact = {
    schemaVersion: "nylon-isolated-calibration-candidate/1",
    policyVersion: POLICY.policyVersion,
    algorithmVersion: POLICY.algorithmVersion,
    measurementMode: POLICY.measurementMode,
    auditoryAcceptance: "pending-product-owner",
    productionIntegration: "not-authorized",
    notes: Object.fromEntries(calibration.map((entry) => [String(entry.targetMidi), entry]))
  };
  const reportArtifact = {
    schemaVersion: "nylon-level-audit-report/1",
    positionEquivalenceStatus: "PASS",
    measurementStatus: "PASS",
    classifications: classification.classifications,
    objectiveCalibrationJustified: objectiveProblem,
    summary: {
      targetCount: mappings.length,
      positionCount: positions.length,
      bodyLevelRangeDbfs: [
        Math.min(...measurements.map((measurement) => measurement.bodyRmsDbfs)),
        Math.max(...measurements.map((measurement) => measurement.bodyRmsDbfs))
      ],
      maximumBodySpreadDb: round(
        Math.max(...measurements.map((measurement) => measurement.bodyRmsDbfs))
          - Math.min(...measurements.map((measurement) => measurement.bodyRmsDbfs))
      ),
      largestAdjacentJump: {
        fromMidi: largestAdjacent.targetMidi - 1,
        toMidi: largestAdjacent.targetMidi,
        differenceDb: largestAdjacent.adjacentBodyDifferenceDb,
        sourceAnchorBoundary: largestAdjacent.sourceAnchorBoundary
      },
      sourceAnchorBoundaries: sourceBoundaries.map((measurement) => ({
        fromMidi: measurement.targetMidi - 1,
        toMidi: measurement.targetMidi,
        differenceDb: measurement.adjacentBodyDifferenceDb
      })),
      boundaryMismatchMidis: classification.boundaryJumps.map((measurement) => measurement.targetMidi),
      transpositionDriftMidis: classification.withinAnchorJumps.map((measurement) => measurement.targetMidi),
      correctionRangeDb: calibration.length ? [
        Math.min(...calibration.map((entry) => entry.boundedFinalGainDb)),
        Math.max(...calibration.map((entry) => entry.boundedFinalGainDb))
      ] : null,
      minimumPredictedHeadroomDb: calibration.length
        ? round(Math.min(...calibration.map((entry) => -entry.predictedPeakDbfs)))
        : null,
      notesRemainingOutsideTolerance: calibration.filter((entry) => entry.remainsOutsideTolerance).map((entry) => entry.targetMidi),
      renderedClippingSampleCount: measurements.reduce((sum, measurement) => sum + measurement.clippingSampleCount, 0)
    }
  };
  const csv = [
    "targetMidi,scientificPitch,sourceMidi,sourcePath,playbackRate,peakDbfs,attackRmsDbfs,bodyRmsDbfs,durationSeconds,dcOffset,clippingSampleCount,adjacentBodyDifferenceDb,sourceAnchorBoundary,calibrationGain,boundedFinalGainDb,predictedPeakDbfs",
    ...measurements.map((measurement, index) => {
      const gain = calibration[index] || {};
      return [
        measurement.targetMidi,
        measurement.scientificPitch,
        measurement.sourceMidi,
        measurement.sourcePath,
        round(measurement.playbackRate, 12),
        measurement.peakDbfs,
        measurement.attackRmsDbfs,
        measurement.bodyRmsDbfs,
        measurement.durationSeconds,
        measurement.dcOffset,
        measurement.clippingSampleCount,
        measurement.adjacentBodyDifferenceDb ?? "",
        measurement.sourceAnchorBoundary,
        gain.calibrationGain ?? 1,
        gain.boundedFinalGainDb ?? 0,
        gain.predictedPeakDbfs ?? measurement.peakDbfs
      ].join(",");
    })
  ].join("\n") + "\n";

  return {
    "audit_policy.json": stableJson(POLICY),
    "production_mapping.json": stableJson(mappingArtifact),
    "rendered_measurements.json": stableJson(measurementArtifact),
    "calibration_manifest.json": stableJson(calibrationArtifact),
    "audit_report.json": stableJson(reportArtifact),
    "gain_curve.csv": csv
  };
}

function writeArtifacts(artifacts = buildArtifacts()) {
  Object.entries(artifacts).forEach(([filename, content]) => {
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), content);
  });
  return artifacts;
}

if (require.main === module) {
  writeArtifacts();
  process.stdout.write("Generated Nylon production-mapping audit and isolated calibration candidate.\n");
}

module.exports = {
  APP_PATH,
  ENGINE_PATH,
  POLICY,
  ROOT,
  assertPositionEquivalence,
  buildArtifacts,
  readProductionPolicy,
  resolveMapping,
  sha256,
  writeArtifacts
};
