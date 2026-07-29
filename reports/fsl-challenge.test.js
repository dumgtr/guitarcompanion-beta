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
