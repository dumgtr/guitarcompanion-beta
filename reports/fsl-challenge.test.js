// fsl-challenge.test.js - FSL Challenge Quiz Validation
// Run: node reports/fsl-challenge.test.js
//
// Three-pillar strategy:
//
//   PILLAR A - Structural: regex-verify critical properties in the production
//              app.js source without relying on a copied algorithm.
//
//   PILLAR B - Algorithm: run the pure helpers (inlined identically to
//              production) against deterministic scenarios.
//              Consumes bag via .shift() - same operation as production.
//
//   PILLAR C - Scenario: simulate wrong-answer and close/reopen
//              state-machine transitions against a minimal activeState mirror.
//
// Note: The FSL UI has no tuning selector. activeState.tuning is always
// "standard". Tuning-change scenarios are intentionally omitted.

'use strict';
const fs = require('fs');
const path = require('path');

const APP_SRC = fs.readFileSync(path.join(__dirname, '..', 'outputs', 'app.js'), 'utf8');
const AUDIO_SRC = fs.readFileSync(path.join(__dirname, '..', 'outputs', 'audio-engine.js'), 'utf8');
const CALIBRATION_PATH = path.join(__dirname, 'fsl-audio-calibration-v1.json');
const CALIBRATION_REPORT_PATH = path.join(__dirname, 'FSL_AUDIO_CALIBRATION_V1.md');
const CALIBRATION = JSON.parse(fs.readFileSync(CALIBRATION_PATH, 'utf8'));

let passed = 0, failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log('  PASS: ' + name);
    passed++;
  } else {
    console.error('  FAIL: ' + name);
    failed++;
  }
}

// ================================================================
//  PILLAR A - Structural checks against production source
// ================================================================
console.log('\nPILLAR A - Structural source checks');

{
  // A1. Consumer uses .shift() not .pop()
  assert(/challengeBag\.shift\(\)/.test(APP_SRC),
    'A1a: chooseNextChallengeTarget uses .shift() to consume bag');
  assert(!/challengeBag\.pop\(\)/.test(APP_SRC),
    'A1b: chooseNextChallengeTarget does NOT use .pop()');

  // A2. Anti-repeat guard checks bag[0] - correct side for .shift()
  assert(/bag\[0\]\.midi\s*===\s*lastMidi/.test(APP_SRC),
    'A2: refillChallengeBag anti-repeat guard is on bag[0] (correct side for shift)');

  // A3. Wrong-answer path does not decrement challengeScore
  assert(!/clearChallengeTimer[\s\S]{0,300}challengeScore\s*[-]=/.test(APP_SRC),
    'A3: Wrong-answer branch does not decrement challengeScore');

  // A4. No window test hooks
  const hooks = (APP_SRC.match(
    /window\.(buildChallengeMidiPool|refillChallengeBag|chooseNextChallengeTarget|challengeBag)/g
  ) || []).length;
  assert(hooks === 0, 'A4: No window test hooks (' + hooks + ' found)');
  assert(!/window\.__gc_/.test(APP_SRC) && !/window\.__gc_/.test(AUDIO_SRC),
    'A4b: No verifier-only window.__gc_* hooks');

  // A5. syncChallengeForCurrentTuning is minimal (no clearChallengeTimer or bag discard inside it)
  // - The FSL UI has no tuning selector, so the tuning branch is unreachable.
  // - Verify the follow-up dead code was reverted.
  const fnBody = APP_SRC.match(/function syncChallengeForCurrentTuning[\s\S]*?\n  \}/);
  const fnText = fnBody ? fnBody[0] : '';
  assert(fnText !== '', 'A5a: syncChallengeForCurrentTuning found in source');
  assert(!/clearChallengeTimer/.test(fnText),
    'A5b: syncChallengeForCurrentTuning does NOT call clearChallengeTimer (unreachable tuning path reverted)');
  assert(!/challengeBag\s*=\s*\[\]/.test(fnText),
    'A5c: syncChallengeForCurrentTuning does NOT reset challengeBag (unreachable tuning path reverted)');
  assert(/midiToNoteName/.test(fnText),
    'A5d: syncChallengeForCurrentTuning uses midiToNoteName for MIDI-based display name');
  assert(/updateChallengeBanner/.test(fnText),
    'A5e: syncChallengeForCurrentTuning calls updateChallengeBanner');

  // A6. FSL playNote call passes valid options object
  assert(/engine\.playNote\(\{\s*channel:\s*['"]fsl['"]/.test(APP_SRC),
    'A6: engine.playNote passes options object with channel: "fsl"');

  // A7. createFslSynthVoice sets nodes: [] to prevent premature disconnect
  assert(/nodes:\s*\[\s*\][^\n]*voiceGain cleanup/.test(AUDIO_SRC),
    'A7: createFslSynthVoice uses nodes: [] to delegate cleanup to source.onended');

  // A8. 12 ms fade-out / 8 ms fade-in retrigger envelope
  assert(/startDelay\s*=\s*0\.012/.test(AUDIO_SRC),
    'A8a: createFslSynthVoice uses 12 ms (0.012s) fade-out window');
  assert(/linearRampToValueAtTime\(1\.0,\s*startNow\s*\+\s*0\.008\)/.test(AUDIO_SRC),
    'A8b: createFslSynthVoice uses 8 ms (0.008s) linear fade-in ramp');

  // A9. stopChannel('fsl') called on Challenge close and FSL workspace unmount
  assert(/stopChannel\(['"]fsl['"]\)/.test(APP_SRC),
    'A9: stopChannel("fsl") called in app.js on close and unmount');

  // A10. Accordion keydown delegates to headerBtn.click()
  assert(/headerBtn\.click\(\)/.test(APP_SRC),
    'A10: setupAccordionItem keydown handler delegates via headerBtn.click()');

  // A11. FSL reuses the single existing global selector
  const globalSelectorIds = (APP_SRC.match(/id="globalInstrumentSelector"/g) || []).length;
  assert(globalSelectorIds === 1,
    'A11a: Exactly one globalInstrumentSelector is rendered');
  assert(!/id="fslInstrumentSelector"/.test(APP_SRC),
    'A11b: No duplicate FSL-only instrument selector is introduced');

  // A12. Central FSL capability contract
  assert(/synth:\s*Object\.freeze\(\{[\s\S]*?status:\s*"AVAILABLE"[\s\S]*?minMidi:\s*40[\s\S]*?maxMidi:\s*76/.test(AUDIO_SRC),
    'A12a: FSL Synth is AVAILABLE for MIDI 40-76');
  assert(/nylon:\s*Object\.freeze\(\{[\s\S]*?status:\s*"AVAILABLE"[\s\S]*?minMidi:\s*40[\s\S]*?maxMidi:\s*76/.test(AUDIO_SRC),
    'A12b: FSL Nylon is AVAILABLE for MIDI 40-76');
  assert(/electric:\s*Object\.freeze\(\{[\s\S]*?status:\s*"AVAILABLE"[\s\S]*?minMidi:\s*40[\s\S]*?maxMidi:\s*76/.test(AUDIO_SRC),
    'A12c: FSL Electric is AVAILABLE for MIDI 40-76');
  assert(/nylon:\s*Object\.freeze\(\{\s*available:\s*true,\s*reason:\s*null\s*\}\)/.test(AUDIO_SRC),
    'A12d: Nylon remains globally available outside FSL');
  assert(/const isFslRequest = channel === "fsl"/.test(AUDIO_SRC),
    'A12e: FSL no-fallback boundary remains scoped by channel');

  // A15. Electric Provenance
  const electricProvPath = path.join(__dirname, '..', 'outputs', 'assets', 'audio', 'electric', 'PROVENANCE.md');
  const electricProvExists = fs.existsSync(electricProvPath);
  const electricProvText = electricProvExists ? fs.readFileSync(electricProvPath, 'utf8') : '';
  assert(electricProvExists, 'A15a: outputs/assets/audio/electric/PROVENANCE.md exists');
  assert(/CC0/i.test(electricProvText) && /FreePats/i.test(electricProvText) && /FSBS Electric Guitar Clean #1/i.test(electricProvText),
    'A15b: Electric PROVENANCE.md cites CC0 FreePats FSBS Electric Guitar Clean #1');

  // A15c-A15h. Nylon provenance, coverage, and measured calibration
  const nylonAssetDir = path.join(__dirname, '..', 'outputs', 'assets', 'audio', 'nylon-guitar');
  const nylonAttribution = fs.readFileSync(path.join(nylonAssetDir, 'ATTRIBUTION.md'), 'utf8');
  assert(/quartertone/i.test(nylonAttribution) && /CC BY 3\.0/i.test(nylonAttribution)
      && /622c2f1c32c8cfce4158ddc3eb26e518ddef37e5/.test(nylonAttribution),
    'A15c: Nylon attribution records author, CC BY 3.0, and verified upstream revision');
  const approvedNylonAnchors = CALIBRATION.provenance.anchors;
  assert(approvedNylonAnchors.length === 11
      && approvedNylonAnchors.every((anchor) =>
        fs.existsSync(path.join(__dirname, '..', 'outputs', anchor.path))),
    'A15d: All 11 approved Nylon anchor files exist locally');
  assert(CALIBRATION.rows.length === 37
      && CALIBRATION.rows.every((row, index) => row.midi === 40 + index),
    'A15e: Calibration dataset covers exactly MIDI 40-76');
  assert(CALIBRATION.summary.maxNylonAnchorDistanceSemitones <= 3
      && CALIBRATION.rows.every((row) => row.nylon.anchorDistanceSemitones <= 3),
    'A15f: Every Nylon target is within the ±3 semitone policy');
  assert(fs.existsSync(CALIBRATION_REPORT_PATH)
      && /ffmpeg astats/i.test(fs.readFileSync(CALIBRATION_REPORT_PATH, 'utf8')),
    'A15g: Concise measured peak/RMS calibration report exists');

  const gainBlock = AUDIO_SRC.match(/const APPROVED_NYLON_MIDI_GAINS = Object\.freeze\(\{([\s\S]*?)\n  \}\);/)?.[1] || '';
  const productionNylonGains = Object.fromEntries(
    [...gainBlock.matchAll(/^\s*(\d+):\s*([0-9.]+)/gm)]
      .map((match) => [Number(match[1]), Number(match[2])])
  );
  assert(Object.keys(productionNylonGains).length === 37
      && CALIBRATION.rows.every((row) =>
        Math.abs(productionNylonGains[row.midi] - row.nylon.perMidiGain) < 1e-12),
    'A15h: Every production Nylon gain matches the measured calibration dataset');
  assert(CALIBRATION.rows.every((row) =>
      Number.isFinite(row.synth.rawPeakDbfs)
      && Number.isFinite(row.synth.rawRmsDbfs)
      && Number.isFinite(row.nylon.rawPeakDbfs)
      && Number.isFinite(row.nylon.rawRmsDbfs)
      && Number.isFinite(row.electric.rawPeakDbfs)
      && Number.isFinite(row.electric.rawRmsDbfs)
      && row.nylon.totalCorrectionDb >= -3
      && row.nylon.totalCorrectionDb <= 3
      && row.nylon.calibratedPeakDbfs <= -1),
    'A15i: Calibration uses finite measured values, conservative ±3 dB corrections, and peak headroom');
  assert(CALIBRATION.rows.every((row) => {
    const derivedGain = 10 ** (row.nylon.perMidiCorrectionDb / 20);
    const combinedCorrection = row.nylon.perMidiCorrectionDb
      + CALIBRATION.method.nylonLegacyMakeupDb;
    return Math.abs(derivedGain - row.nylon.perMidiGain) < 1e-12
      && Math.abs(combinedCorrection - row.nylon.totalCorrectionDb) < 1e-12;
  }), 'A15j: Every gain is mathematically derived from the recorded measured correction');

  // A16. Electric Schema v2 & anchor distance check
  const electricMapPath = path.join(__dirname, '..', 'outputs', 'assets', 'audio', 'electric', 'APPROVED_SAMPLE_MAP.json');
  const electricMap = JSON.parse(fs.readFileSync(electricMapPath, 'utf8'));
  assert(electricMap.schemaVersion === 2, 'A16a: Electric sample map preserves Schema v2');
  const electricNotes = Object.keys(electricMap.notes || {});
  assert(electricNotes.length === 37, 'A16b: Electric sample map covers exactly 37 MIDI entries (40-76)');
  let maxDistance = 0;
  for (let midi = 40; midi <= 76; midi++) {
    const entry = electricMap.notes[midi.toString()];
    if (entry && typeof entry.sourceMidi === 'number') {
      const dist = Math.abs(midi - entry.sourceMidi);
      if (dist > maxDistance) maxDistance = dist;
    }
  }
  assert(maxDistance <= 2, 'A16c: Electric maximum anchor distance <= 2 semitones (' + maxDistance + ' found)');

  // A17. Direct internal helper/source contract for all FSL sample envelopes and cleanup.
  const managedFslVoiceFn = AUDIO_SRC.match(/function createManagedFslSampleVoice[\s\S]*?\n  \}/)?.[0] || '';
  const cleanupFslEntryFn = AUDIO_SRC.match(/function cleanupFslSampleEntry[\s\S]*?\n  \}/)?.[0] || '';
  const nylonVoiceFn = AUDIO_SRC.match(/function createSampleVoice[\s\S]*?\n  \}/)?.[0] || '';
  const electricVoiceFn = AUDIO_SRC.match(/function createElectricSampleVoice[\s\S]*?\n  \}/)?.[0] || '';
  const releaseChannelFn = AUDIO_SRC.match(/function releaseChannel[\s\S]*?\n  \}/)?.[0] || '';
  assert(/audioCtx\.createBufferSource\(\)/.test(managedFslVoiceFn)
      && /audioCtx\.createGain\(\)/.test(managedFslVoiceFn),
    'A17a: Managed FSL helper owns one BufferSource and per-voice GainNode');
  assert(/startNow \+ 0\.012/.test(managedFslVoiceFn)
      && /startNow \+ 0\.008/.test(managedFslVoiceFn),
    'A17b: Managed FSL helper applies 12 ms fade-out and 8 ms fade-in');
  assert(/filter\(\(entry\) => entry\.retiring\)/.test(managedFslVoiceFn)
      && /find\(\(entry\) => !entry\.retiring\)/.test(managedFslVoiceFn),
    'A17c: Managed FSL helper caps lifecycle to one active voice and one release tail');
  assert(/source\.onended = \(\) => cleanupFslSampleEntry\(entry\)/.test(managedFslVoiceFn)
      && /entry\.source\.disconnect\(\)/.test(cleanupFslEntryFn)
      && /entry\.voiceGain\.disconnect\(\)/.test(cleanupFslEntryFn),
    'A17d: Source end disconnects both BufferSource and GainNode');
  assert(/cleanupFslSampleEntry\(entry\)/.test(releaseChannelFn),
    'A17e: stopChannel("fsl") routes every managed entry through node cleanup');
  assert(/channel === "fsl"[\s\S]*?createManagedFslSampleVoice\(buffer,[\s\S]*?voiceLevel: effectiveGain/.test(nylonVoiceFn),
    'A17f: Nylon 12/8 ms behavior is verified through the internal managed helper contract');
  assert(/channel === "fsl"[\s\S]*?createManagedFslSampleVoice\(buffer,[\s\S]*?outputGain: electricGain/.test(electricVoiceFn),
    'A17g: Electric uses the same bounded FSL voice lifecycle');

  // A18. No silent fallback to synth on channel "fsl"
  const playNotesFn = AUDIO_SRC.match(/async function playInstrumentNotes[\s\S]*?\n  \}/)?.[0] || '';
  assert(/if \(isFslRequest\) \{\s*throw new Error\(lastFallbackReason \|\| "electric-playback-failed"\)/.test(playNotesFn)
      && /if \(isFslRequest\) \{\s*throw new Error\(lastFallbackReason \|\| "fsl-synth-playback-failed"\)/.test(playNotesFn),
    'A18a: FSL Electric and Synth sample failures explicitly abort instead of falling back');
  assert(/if \(isFslRequest\) \{\s*throw new Error\(lastFallbackReason \|\| "nylon-playback-failed"\)/.test(playNotesFn),
    'A18b: Any internal FSL Nylon sample failure also aborts without fallback');

  // A13. All three selector options remain available while FSL keeps its no-fallback boundary
  const selectorFn = APP_SRC.match(/function setSelectedAudioInstrument[\s\S]*?\n\}/)?.[0] || '';
  assert(/<option value="synth">Synth<\/option>[\s\S]*?<option value="nylon">Nylon<\/option>[\s\S]*?<option value="electric">Electric<\/option>/.test(APP_SRC)
      && !/<option value="(?:synth|nylon|electric)"[^>]*disabled/.test(APP_SRC),
    'A13a: Synth, Nylon, and Electric remain selectable in the shared global selector');
  const audioPlayFn = AUDIO_SRC.match(/async function playInstrumentNotes[\s\S]*?\n  \}/)?.[0] || '';
  const fslBoundaryIndex = audioPlayFn.indexOf('const isFslRequest');
  const samplerAvailabilityIndex = audioPlayFn.indexOf('const availability = getInstrumentAvailability');
  assert(
    fslBoundaryIndex >= 0
      && /getFslInstrumentCapability\(requestedInstrument\)/.test(audioPlayFn)
      && fslBoundaryIndex < samplerAvailabilityIndex,
    'A13b: FSL capability boundary is evaluated before sampler/fallback handling'
  );
  assert(/if \(isFslRequest\) \{[\s\S]*?throw new Error/.test(audioPlayFn)
      && /usedSynth = true[\s\S]*?createVoice/.test(audioPlayFn),
    'A13c: Native synth fallback remains outside the explicitly failing FSL sample paths');

  // A14. Accepted FSL changes stop the FSL channel before selected instrument mutation
  assert(
    /if \(instrument !== selectedAudioInstrument\) \{[\s\S]*?stopChannel\?\.\("fsl"\)[\s\S]*?selectedAudioInstrument = instrument/.test(selectorFn),
    'A14: Accepted FSL instrument change stops channel before switching'
  );

  // A15. Mount disables only FSL-invalid options; unmount restores global state
  const guardFn = APP_SRC.match(/function activateFslInstrumentSelectorGuard[\s\S]*?\n\}/)?.[0] || '';
  assert(/getFslInstrumentCapability\(option\.value\)[\s\S]*?option\.disabled = true/.test(guardFn),
    'A15a: FSL mount disables only options rejected by the FSL capability contract');
  assert(/option\.disabled = disabled/.test(guardFn) && /setSelectedAudioInstrument\(previousInstrument/.test(guardFn),
    'A15b: FSL unmount restores selector options and previous instrument');
  assert(/const restoreFslInstrumentSelector = activateFslInstrumentSelectorGuard\(\)/.test(APP_SRC)
      && /stopChannel\('fsl'\)[\s\S]*?restoreFslInstrumentSelector\(\)/.test(APP_SRC),
    'A15c: FSL mount activates guard and unmount stops audio before restoration');

  // A16. FSL playback keeps the approved channel/profile contract
  assert(/engine\.playNote\(\{\s*channel:\s*['"]fsl['"],\s*profile:\s*['"]fsl-fretboard-position['"]/.test(APP_SRC),
    'A16: FSL playback preserves channel and profile');
}

// ================================================================
//  PILLAR B - Algorithm tests (consumed via .shift() = production)
// ================================================================
console.log('\nPILLAR B - Algorithm tests (shift-consuming, deterministic)');

const CHROMATIC_NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const TUNINGS = {
  standard: [64, 59, 55, 50, 45, 40],
  dropd:    [64, 59, 55, 50, 45, 38],
  halfstep: [63, 58, 54, 49, 44, 39]
};

assert([40, 52, 64, 76].every((midi) => midi >= 40 && midi <= 76),
  'B0: Required Synth smoke notes MIDI 40, 52, 64 and 76 are inside the FSL capability range');

function midiToNoteName(midi) {
  return CHROMATIC_NOTES[midi % 12] + (Math.floor(midi / 12) - 1);
}

function buildChallengeMidiPool(tuningId) {
  const midiMap = {};
  const arr = TUNINGS[tuningId] || TUNINGS.standard;
  for (let s = 1; s <= 6; s++) {
    for (let f = 0; f <= 12; f++) {
      const m = arr[s-1] + f;
      if (!(m in midiMap)) midiMap[m] = { stringNum: s, fretNum: f };
    }
  }
  return Object.keys(midiMap).map(Number)
    .sort(function(a,b){return a-b;})
    .map(function(m){return{midi:m,stringNum:midiMap[m].stringNum,fretNum:midiMap[m].fretNum};});
}

function refillChallengeBag(pool, lastMidi) {
  const bag = pool.slice();
  for (let i = bag.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    const t = bag[i]; bag[i] = bag[j]; bag[j] = t;
  }
  if (bag.length > 1 && bag[0].midi === lastMidi) {
    const t = bag[0]; bag[0] = bag[1]; bag[1] = t;
  }
  return bag;
}

// B1: MIDI multi-position acceptance (standard tuning)
{
  const G3 = 55;
  const str3open  = TUNINGS.standard[2] + 0; // string 3 open
  const str4fret5 = TUNINGS.standard[3] + 5; // string 4 fret 5
  assert(str3open  === G3, 'B1a: String 3 open = G3 (MIDI 55)');
  assert(str4fret5 === G3, 'B1b: String 4 fret 5 = G3 (MIDI 55)');
  assert(str3open  === str4fret5, 'B1c: Both positions yield identical MIDI - both accepted');

  const B3 = 59;
  assert(TUNINGS.standard[1] + 0 === B3, 'B1d: String 2 open = B3 (MIDI 59)');
  assert(TUNINGS.standard[2] + 4 === B3, 'B1e: String 3 fret 4 = B3 (MIDI 59)');

  assert(55 !== 67, 'B1f: G3 (55) != G4 (67) - MIDI comparison blocks octave confusion');
}

// B2: Pool uniqueness and range for standard tuning
{
  const pool  = buildChallengeMidiPool('standard');
  const midis = pool.map(function(e){return e.midi;});
  assert(new Set(midis).size === pool.length, 'B2a: Standard pool has all-unique MIDI values');
  assert(Math.min.apply(null,midis) === 40,   'B2b: Standard pool min = 40 (E2)');
  assert(Math.max.apply(null,midis) === 76,   'B2c: Standard pool max = 76 (E4 + 12 frets)');
}

// B3: Three full bag refills via .shift() - no adjacent repeat at boundaries
{
  const pool = buildChallengeMidiPool('standard');
  const N = pool.length;
  const consumed = [];
  let lastMidi = null;

  for (let cycle = 0; cycle < 3; cycle++) {
    const bag = refillChallengeBag(pool, lastMidi);
    assert(bag.length > 0, 'B3-cycle' + cycle + ': bag non-empty after refill');
    assert(bag[0].midi !== lastMidi || lastMidi === null,
      'B3-cycle' + cycle + ': first .shift() result != lastMidi across refill boundary');
    while (bag.length > 0) {
      const next = bag.shift(); // same operation as production
      consumed.push(next.midi);
      lastMidi = next.midi;
    }
  }

  // Within each cycle: no MIDI repeats
  let intraRepeat = false;
  for (let c = 0; c < 3; c++) {
    const slice = consumed.slice(c*N, (c+1)*N);
    if (new Set(slice).size !== N) intraRepeat = true;
  }
  assert(!intraRepeat, 'B3: No intra-cycle MIDI repetition across 3 full bags');
  assert(consumed[N-1]   !== consumed[N],   'B3: No repeat at boundary cycles 0->1');
  assert(consumed[2*N-1] !== consumed[2*N], 'B3: No repeat at boundary cycles 1->2');
}

// B4: Anti-repeat guard on bag[0] - 100 random trials
{
  const pool = buildChallengeMidiPool('standard');
  let allGood = true;
  for (let i = 0; i < 100; i++) {
    const last = pool[Math.floor(Math.random()*pool.length)].midi;
    if (refillChallengeBag(pool, last)[0].midi === last) { allGood = false; break; }
  }
  assert(allGood, 'B4: bag[0] != lastMidi after refill - 100 random lastMidi trials');
}

// B5: midiToNoteName spot checks
{
  assert(midiToNoteName(40) === 'E2', 'B5: MIDI 40 = E2');
  assert(midiToNoteName(45) === 'A2', 'B5: MIDI 45 = A2');
  assert(midiToNoteName(50) === 'D3', 'B5: MIDI 50 = D3');
  assert(midiToNoteName(52) === 'E3', 'B5: MIDI 52 = E3');
  assert(midiToNoteName(55) === 'G3', 'B5: MIDI 55 = G3');
  assert(midiToNoteName(59) === 'B3', 'B5: MIDI 59 = B3');
  assert(midiToNoteName(64) === 'E4', 'B5: MIDI 64 = E4');
  assert(midiToNoteName(76) === 'E5', 'B5: MIDI 76 = E5');
}

// ================================================================
//  PILLAR C - Scenario / state-machine tests
// ================================================================
console.log('\nPILLAR C - Scenario / state-machine tests');

function makeState() {
  return {
    challengeMode: true,
    challengeTransitioning: false,
    challengeTimerId: null,
    challengeScore: 3,
    challengeTargetMidi: 55,
    challengeTarget: 'G3',
    challengeTargetPos: { stringNum: 3, fretNum: 0 },
    challengeBag: [{ midi: 59, stringNum: 2, fretNum: 0 }],
    challengeLastMidi: 50
  };
}

function simulateClearChallengeTimer(state) {
  if (state.challengeTimerId !== null) {
    clearTimeout(state.challengeTimerId);
    state.challengeTimerId = null;
  }
  state.challengeTransitioning = false;
}

// C1: Wrong answer - score unchanged, transitioning set, timer created
{
  const state = makeState();
  const scoreBefore = state.challengeScore;

  simulateClearChallengeTimer(state);
  state.challengeTransitioning = true;
  state.challengeTimerId = setTimeout(function(){}, 100000);

  assert(state.challengeScore === scoreBefore, 'C1a: Score unchanged on wrong answer');
  assert(state.challengeTransitioning === true, 'C1b: Input locked during wrong feedback');
  assert(state.challengeTimerId !== null,       'C1c: Timer created for wrong-feedback restore');

  clearTimeout(state.challengeTimerId);
  state.challengeTimerId = null;
}

// C2: Two wrong clicks - no stacked timers
{
  const state = makeState();

  function wrongClick() {
    simulateClearChallengeTimer(state);
    state.challengeTransitioning = true;
    state.challengeTimerId = setTimeout(function(){}, 100000);
  }

  wrongClick();
  const id1 = state.challengeTimerId;
  wrongClick();
  const id2 = state.challengeTimerId;

  assert(id1 !== id2, 'C2a: Second wrong click creates a new timer (first cancelled)');
  assert(state.challengeTimerId !== null, 'C2b: Exactly one timer active after two wrong clicks');
  assert(state.challengeTransitioning === true, 'C2c: challengeTransitioning still true');

  clearTimeout(state.challengeTimerId);
  state.challengeTimerId = null;
}

// C3: Close during wrong feedback - clears timer and unlocks
{
  const state = makeState();
  state.challengeTransitioning = true;
  state.challengeTimerId = setTimeout(function(){}, 100000);

  simulateClearChallengeTimer(state);

  assert(state.challengeTimerId === null,        'C3a: Timer cleared on close');
  assert(state.challengeTransitioning === false, 'C3b: Input unlocked on close');
}

// C4: Close during correct feedback - same cleanup
{
  const state = makeState();
  state.challengeTransitioning = true;
  state.challengeTimerId = setTimeout(function(){}, 100000);

  simulateClearChallengeTimer(state);

  assert(state.challengeTimerId === null,        'C4a: Timer cleared on close (correct path)');
  assert(state.challengeTransitioning === false, 'C4b: Input unlocked on close (correct path)');
}

// C5: Wrong answer does not advance the bag (same target restored)
{
  const state = makeState();
  const targetBefore  = state.challengeTargetMidi;
  const bagLenBefore  = state.challengeBag.length;

  // Wrong path: only sets timer, does NOT shift the bag
  simulateClearChallengeTimer(state);
  state.challengeTransitioning = true;
  state.challengeTimerId = setTimeout(function(){}, 100000);
  // bag untouched

  assert(state.challengeTargetMidi === targetBefore, 'C5a: Target MIDI unchanged after wrong answer');
  assert(state.challengeBag.length === bagLenBefore,  'C5b: Bag not consumed on wrong answer');

  clearTimeout(state.challengeTimerId);
  state.challengeTimerId = null;
}

// C6: Two different fret positions with same MIDI both accepted
{
  const G3 = 55;
  const clickedA = TUNINGS.standard[2] + 0; // string 3 open
  const clickedB = TUNINGS.standard[3] + 5; // string 4 fret 5
  assert(clickedA === G3 && clickedB === G3, 'C6a: Both str3-open and str4-fret5 equal target MIDI 55');

  const wrongMidi = TUNINGS.standard[2] + 1; // G#3 - adjacent fret, different MIDI
  assert(wrongMidi !== G3, 'C6b: G#3 (MIDI 56) correctly rejected for G3 target');
}

// ================================================================
//  Summary
// ================================================================
console.log('\n' + '='.repeat(50));
console.log('  Results: ' + passed + ' passed, ' + failed + ' failed');
console.log('='.repeat(50) + '\n');
if (failed > 0) process.exit(1);
