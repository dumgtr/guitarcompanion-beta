// Run: node reports/fsl-audio-calibration-measure.mjs --write
//
// Offline development-time measurement only. This script adds no production
// dependency or network behavior. It measures the exact local audio assets with
// ffmpeg and writes the reproducible Step 2 calibration dataset/report.

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPORTS_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(REPORTS_DIR, "..");
const OUTPUTS_ROOT = path.join(REPO_ROOT, "outputs");
const RESULT_JSON = path.join(REPORTS_DIR, "fsl-audio-calibration-v1.json");
const RESULT_MD = path.join(REPORTS_DIR, "FSL_AUDIO_CALIBRATION_V1.md");

const MIDI_MIN = 40;
const MIDI_MAX = 76;
const ANALYSIS_WINDOW_SECONDS = 0.24;
const NYLON_TEST_VELOCITY = 0.8;
const ELECTRIC_ROUTE_GAIN = 0.25;
const SYNTH_ROUTE_GAIN = 1.0;
const LEGACY_NYLON_MAKEUP_DB = 0.5;
const CORRECTION_LIMIT_DB = 3.0;
const CORRECTION_STEP_DB = 0.25;
const PEAK_CEILING_DBFS = -1.0;
const UPSTREAM_REVISION = "622c2f1c32c8cfce4158ddc3eb26e518ddef37e5";

const NYLON_ANCHORS = Object.freeze([
  { note: "F#2", midi: 42, path: "assets/audio/nylon-guitar/Fs2.ogg" },
  { note: "A2", midi: 45, path: "assets/audio/nylon-guitar/A2.ogg" },
  { note: "C#3", midi: 49, path: "assets/audio/nylon-guitar/Cs3.ogg" },
  { note: "E3", midi: 52, path: "assets/audio/nylon-guitar/E3.ogg" },
  { note: "A3", midi: 57, path: "assets/audio/nylon-guitar/A3.ogg" },
  { note: "C#4", midi: 61, path: "assets/audio/nylon-guitar/Cs4.ogg" },
  { note: "E4", midi: 64, path: "assets/audio/nylon-guitar/E4.ogg" },
  { note: "G#4", midi: 68, path: "assets/audio/nylon-guitar/Gs4.ogg" },
  { note: "A4", midi: 69, path: "assets/audio/nylon-guitar/A4.ogg" },
  { note: "C#5", midi: 73, path: "assets/audio/nylon-guitar/Cs5.ogg" },
  { note: "E5", midi: 76, path: "assets/audio/nylon-guitar/E5.ogg" }
]);

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8"));
}

function dbForGain(gain) {
  return 20 * Math.log10(gain);
}

function gainForDb(db) {
  return 10 ** (db / 20);
}

function round(value, digits = 6) {
  return Number(value.toFixed(digits));
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}

function run(command, args) {
  return execFileSync(command, args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function getFfmpegVersion() {
  return run("ffmpeg", ["-version"]).split(/\r?\n/, 1)[0].trim();
}

function getSampleRate(filePath) {
  return Number(run("ffprobe", [
    "-v", "error",
    "-select_streams", "a:0",
    "-show_entries", "stream=sample_rate",
    "-of", "default=nw=1:nk=1",
    filePath
  ]).trim());
}

function lastMetric(log, label) {
  const expression = new RegExp(`${label}:\\s*(-?(?:\\d+(?:\\.\\d+)?|inf))`, "g");
  const matches = [...log.matchAll(expression)];
  if (!matches.length || !Number.isFinite(Number(matches.at(-1)[1]))) {
    throw new Error(`ffmpeg did not return a finite ${label}.`);
  }
  return Number(matches.at(-1)[1]);
}

const measurementCache = new Map();

function measureSample(relativePath, playbackRate) {
  const cacheKey = `${relativePath}@${playbackRate.toFixed(12)}`;
  if (measurementCache.has(cacheKey)) return measurementCache.get(cacheKey);

  const filePath = path.join(OUTPUTS_ROOT, relativePath);
  if (!fs.existsSync(filePath)) throw new Error(`Missing calibration sample: ${relativePath}`);

  const sampleRate = getSampleRate(filePath);
  const adjustedRate = sampleRate * playbackRate;
  const filter = [
    `asetrate=${adjustedRate}`,
    `aresample=${sampleRate}`,
    `atrim=start=0:end=${ANALYSIS_WINDOW_SECONDS}`,
    "asetpts=N/SR/TB",
    "astats=metadata=1:reset=0"
  ].join(",");

  const measurementRun = spawnSync("ffmpeg", [
    "-nostdin",
    "-hide_banner",
    "-nostats",
    "-i", filePath,
    "-af", filter,
    "-f", "null",
    "NUL"
  ], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"]
  });
  const stderr = String(measurementRun.stderr || "");
  if (measurementRun.status !== 0) {
    throw new Error(`ffmpeg failed for ${relativePath}: ${stderr.trim()}`);
  }

  const measurement = Object.freeze({
    peakDbfs: round(lastMetric(stderr, "Peak level dB")),
    rmsDbfs: round(lastMetric(stderr, "RMS level dB"))
  });
  measurementCache.set(cacheKey, measurement);
  return measurement;
}

function nearestNylonAnchor(midi) {
  return [...NYLON_ANCHORS].sort((left, right) => {
    const distanceDelta = Math.abs(left.midi - midi) - Math.abs(right.midi - midi);
    return distanceDelta || left.midi - right.midi;
  })[0];
}

function quantizeCorrection(requiredDb, peakLimitDb) {
  const clamped = clamp(
    Math.min(requiredDb, peakLimitDb),
    -CORRECTION_LIMIT_DB,
    CORRECTION_LIMIT_DB
  );
  const quantized = Math.round(clamped / CORRECTION_STEP_DB) * CORRECTION_STEP_DB;
  return round(clamp(
    Math.min(quantized, peakLimitDb),
    -CORRECTION_LIMIT_DB,
    CORRECTION_LIMIT_DB
  ), 3);
}

function summarize(values) {
  return {
    min: round(Math.min(...values), 3),
    median: round(median(values), 3),
    max: round(Math.max(...values), 3)
  };
}

function buildResult() {
  const synthMap = readJson("outputs/assets/audio/fsl-synth/APPROVED_SAMPLE_MAP.json");
  const electricMap = readJson("outputs/assets/audio/electric/APPROVED_SAMPLE_MAP.json");
  const rows = [];

  for (let midi = MIDI_MIN; midi <= MIDI_MAX; midi += 1) {
    const synthEntry = synthMap.notes[String(midi)];
    const electricEntry = electricMap.notes[String(midi)];
    const nylonAnchor = nearestNylonAnchor(midi);
    if (!synthEntry || !electricEntry || !nylonAnchor) {
      throw new Error(`Incomplete calibration mapping for MIDI ${midi}.`);
    }

    const synthRate = Number(synthEntry.playbackRate || 1);
    const electricRate = 2 ** ((midi - Number(electricEntry.sourceMidi)) / 12);
    const nylonRate = 2 ** ((midi - nylonAnchor.midi) / 12);
    const synthRaw = measureSample(synthEntry.path, synthRate);
    const electricRaw = measureSample(electricEntry.path, electricRate);
    const nylonRaw = measureSample(nylonAnchor.path, nylonRate);

    const synthOutputRmsDbfs = synthRaw.rmsDbfs + dbForGain(SYNTH_ROUTE_GAIN);
    const electricOutputRmsDbfs = electricRaw.rmsDbfs + dbForGain(ELECTRIC_ROUTE_GAIN);
    const nylonBaseRmsDbfs = nylonRaw.rmsDbfs + dbForGain(NYLON_TEST_VELOCITY);
    const nylonBasePeakDbfs = nylonRaw.peakDbfs + dbForGain(NYLON_TEST_VELOCITY);
    const referenceRmsDbfs = median([
      synthOutputRmsDbfs,
      electricOutputRmsDbfs,
      nylonBaseRmsDbfs
    ]);
    const requiredCorrectionDb = referenceRmsDbfs - nylonBaseRmsDbfs;
    const peakLimitDb = PEAK_CEILING_DBFS - nylonBasePeakDbfs;
    const totalCorrectionDb = quantizeCorrection(requiredCorrectionDb, peakLimitDb);
    const perMidiCorrectionDb = totalCorrectionDb - LEGACY_NYLON_MAKEUP_DB;

    rows.push({
      midi,
      synth: {
        sourceMidi: Number(synthEntry.sourceMidi),
        path: synthEntry.path,
        playbackRate: round(synthRate, 12),
        rawPeakDbfs: synthRaw.peakDbfs,
        rawRmsDbfs: synthRaw.rmsDbfs,
        routedRmsDbfs: round(synthOutputRmsDbfs, 3)
      },
      nylon: {
        sourceMidi: nylonAnchor.midi,
        sourceNote: nylonAnchor.note,
        path: nylonAnchor.path,
        anchorDistanceSemitones: Math.abs(midi - nylonAnchor.midi),
        playbackRate: round(nylonRate, 12),
        rawPeakDbfs: nylonRaw.peakDbfs,
        rawRmsDbfs: nylonRaw.rmsDbfs,
        basePeakDbfs: round(nylonBasePeakDbfs, 3),
        baseRmsDbfs: round(nylonBaseRmsDbfs, 3),
        referenceRmsDbfs: round(referenceRmsDbfs, 3),
        requiredCorrectionDb: round(requiredCorrectionDb, 3),
        totalCorrectionDb,
        perMidiCorrectionDb: round(perMidiCorrectionDb, 3),
        perMidiGain: round(gainForDb(perMidiCorrectionDb), 12),
        calibratedPeakDbfs: round(nylonBasePeakDbfs + totalCorrectionDb, 3),
        calibratedRmsDbfs: round(nylonBaseRmsDbfs + totalCorrectionDb, 3)
      },
      electric: {
        sourceMidi: Number(electricEntry.sourceMidi),
        path: electricEntry.path,
        playbackRate: round(electricRate, 12),
        rawPeakDbfs: electricRaw.peakDbfs,
        rawRmsDbfs: electricRaw.rmsDbfs,
        routedRmsDbfs: round(electricOutputRmsDbfs, 3)
      }
    });
  }

  const maxAnchorDistance = Math.max(...rows.map((row) => row.nylon.anchorDistanceSemitones));
  if (maxAnchorDistance > 3) {
    throw new Error(`Nylon pitch-shift policy failed: ${maxAnchorDistance} semitones.`);
  }

  const absoluteErrorsBefore = rows.map((row) =>
    Math.abs(row.nylon.baseRmsDbfs - row.nylon.referenceRmsDbfs));
  const absoluteErrorsAfter = rows.map((row) =>
    Math.abs(row.nylon.calibratedRmsDbfs - row.nylon.referenceRmsDbfs));

  return {
    schemaVersion: 1,
    scope: {
      midiMin: MIDI_MIN,
      midiMax: MIDI_MAX,
      noteCount: MIDI_MAX - MIDI_MIN + 1,
      instruments: ["synth", "nylon", "electric"]
    },
    method: {
      ffmpegVersion: getFfmpegVersion(),
      analysisWindowSeconds: ANALYSIS_WINDOW_SECONDS,
      playbackRateEmulation: "asetrate + aresample",
      measurement: "ffmpeg astats Overall peak and RMS",
      reference: "per-MIDI median of routed Synth, base Nylon, and routed Electric RMS",
      synthRouteGain: SYNTH_ROUTE_GAIN,
      electricRouteGain: ELECTRIC_ROUTE_GAIN,
      nylonTestVelocity: NYLON_TEST_VELOCITY,
      nylonLegacyMakeupDb: LEGACY_NYLON_MAKEUP_DB,
      totalCorrectionLimitDb: CORRECTION_LIMIT_DB,
      correctionStepDb: CORRECTION_STEP_DB,
      peakCeilingDbfs: PEAK_CEILING_DBFS
    },
    provenance: {
      family: "tonejs-instruments guitar-nylon",
      originalAuthor: "quartertone",
      license: "CC BY 3.0",
      upstreamRevision: UPSTREAM_REVISION,
      anchors: NYLON_ANCHORS
    },
    summary: {
      maxNylonAnchorDistanceSemitones: maxAnchorDistance,
      synthRoutedRmsDbfs: summarize(rows.map((row) => row.synth.routedRmsDbfs)),
      nylonBaseRmsDbfs: summarize(rows.map((row) => row.nylon.baseRmsDbfs)),
      nylonCalibratedRmsDbfs: summarize(rows.map((row) => row.nylon.calibratedRmsDbfs)),
      electricRoutedRmsDbfs: summarize(rows.map((row) => row.electric.routedRmsDbfs)),
      medianAbsoluteReferenceErrorBeforeDb: round(median(absoluteErrorsBefore), 3),
      medianAbsoluteReferenceErrorAfterDb: round(median(absoluteErrorsAfter), 3),
      totalCorrectionDb: summarize(rows.map((row) => row.nylon.totalCorrectionDb))
    },
    rows
  };
}

function renderMarkdown(result) {
  const summary = result.summary;
  return `# FSL Audio Calibration V1

## Scope

- Instruments: Synth, Nylon, Electric
- MIDI range: ${result.scope.midiMin}–${result.scope.midiMax} (${result.scope.noteCount} notes)
- Analysis window: ${result.method.analysisWindowSeconds * 1000} ms from each rendered note attack
- Pitch-shift emulation: ${result.method.playbackRateEmulation}
- Meter: ${result.method.measurement}

## Nylon provenance and coverage

- Source family: tonejs-instruments \`guitar-nylon\`
- Original author: quartertone
- License: CC BY 3.0
- Upstream revision: \`${result.provenance.upstreamRevision}\`
- Approved anchors: ${result.provenance.anchors.map((anchor) => `${anchor.note} (${anchor.midi})`).join(", ")}
- Maximum anchor distance: ${summary.maxNylonAnchorDistanceSemitones} semitones (policy: ≤ 3)

## Calibration method

The script renders the exact local sample selected for each MIDI target using
the production playback rate, then measures Overall peak and RMS with ffmpeg
\`astats\`. Routed Synth (gain ${result.method.synthRouteGain}), base Nylon
(velocity ${result.method.nylonTestVelocity}), and routed Electric (gain
${result.method.electricRouteGain}) form a per-MIDI three-bank set. The median
RMS is the robust cross-bank reference. Nylon correction is derived only from
that measured reference, limited to ±${result.method.totalCorrectionLimitDb} dB,
quantized to ${result.method.correctionStepDb} dB, and constrained below
${result.method.peakCeilingDbfs} dBFS before the shared master gain.

The existing +${result.method.nylonLegacyMakeupDb} dB Nylon makeup is retained;
each production per-MIDI gain is the measured total correction minus that fixed
makeup, so the combined runtime correction equals the measured value.

## Before / after summary

| Metric | Before | After |
|---|---:|---:|
| Nylon RMS range (dBFS) | ${summary.nylonBaseRmsDbfs.min} to ${summary.nylonBaseRmsDbfs.max} | ${summary.nylonCalibratedRmsDbfs.min} to ${summary.nylonCalibratedRmsDbfs.max} |
| Nylon median RMS (dBFS) | ${summary.nylonBaseRmsDbfs.median} | ${summary.nylonCalibratedRmsDbfs.median} |
| Median absolute error to cross-bank reference | ${summary.medianAbsoluteReferenceErrorBeforeDb} dB | ${summary.medianAbsoluteReferenceErrorAfterDb} dB |
| Applied total correction range | — | ${summary.totalCorrectionDb.min} to ${summary.totalCorrectionDb.max} dB |

The correction is deliberately capped and quantized; it reduces measured
cross-bank mismatch without flattening the natural instrument dynamics.

## Reproduce

\`\`\`powershell
node reports/fsl-audio-calibration-measure.mjs --write
\`\`\`

Full per-MIDI peak/RMS measurements and derived gains are stored in
\`reports/fsl-audio-calibration-v1.json\`.
`;
}

const result = buildResult();
const shouldWrite = process.argv.includes("--write");

if (shouldWrite) {
  fs.writeFileSync(RESULT_JSON, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  fs.writeFileSync(RESULT_MD, renderMarkdown(result), "utf8");
}

console.log(`FSL calibration notes: ${result.scope.noteCount}`);
console.log(`Nylon max anchor distance: ${result.summary.maxNylonAnchorDistanceSemitones}`);
console.log(`Median reference error: ${result.summary.medianAbsoluteReferenceErrorBeforeDb} dB -> ${result.summary.medianAbsoluteReferenceErrorAfterDb} dB`);
console.log(`Correction range: ${result.summary.totalCorrectionDb.min} to ${result.summary.totalCorrectionDb.max} dB`);
console.log(shouldWrite ? "Calibration reports written." : "Dry run only; pass --write to update reports.");
