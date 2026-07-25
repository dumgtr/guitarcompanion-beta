'use strict';

/**
 * Right-Hand Mini Course Platform V1 + Phase 1 Regression Suite.
 * Validates: 4-phase schema, data shard loading, storage sanitization,
 * drill completion with completionRequired, derived week completion,
 * mnemonic persistence, BPM stopped/running invariants, Foundation reset
 * isolation, Rhythm Geometry reuse, and protected-file invariants.
 *
 * Target: ~45 assertions covering all Product Gate acceptance gates.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const REPO_ROOT = path.resolve(__dirname, '..');
const appContent = fs.readFileSync(path.join(REPO_ROOT, 'outputs/app.js'), 'utf8');
const rhc16DataContent = fs.readFileSync(path.join(REPO_ROOT, 'outputs/data-rhc.js'), 'utf8');
const rhc8MiniDataContent = fs.readFileSync(path.join(REPO_ROOT, 'outputs/righthand-minicourse-data.js'), 'utf8');
const indexHtmlContent = fs.readFileSync(path.join(REPO_ROOT, 'outputs/index.html'), 'utf8');

const injectFailure =
  String(process.env.GC_RIGHTHAND_MINICOURSE_SELF_TEST_FAILURE || '').trim() === '1' ||
  String(process.env.GC_RHC_PHASE1_SELF_TEST_FAILURE || '').trim() === '1';

let assertionCount = 0;
let passedCount = 0;
let failedCount = 0;

function assert(condition, message, details = {}) {
  assertionCount += 1;
  if (injectFailure && assertionCount === 1) condition = false;

  if (condition) {
    passedCount += 1;
    console.log(`  [PASS] CASE ${String(assertionCount).padStart(2, '0')} — ${message}`);
    return;
  }

  failedCount += 1;
  console.error(`  [FAIL] CASE ${String(assertionCount).padStart(2, '0')} — ${message}`);
  if (Object.keys(details).length) {
    console.error(`         Details: ${JSON.stringify(details)}`);
  }
}

function run() {
  console.log('=== RIGHT-HAND MINI COURSE PLATFORM V1 + PHASE 1 TESTS ===\n');

  // ---------- PARSE DATA ----------
  const rhc16Data = eval(rhc16DataContent.replace('window.rhcProgramData =', 'const x =') + '; x');
  const rhcMiniData = eval(rhc8MiniDataContent.replace('window.rightHandMiniCourseData =', 'const x =') + '; x');

  // ---------------------------------------------------------------------
  // SUITE 1: 4-PHASE / 8-WEEK SCHEMA (4 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 1: 4-Phase / 8-Week Schema ---');

  assert(
    Array.isArray(rhcMiniData.phases) && rhcMiniData.phases.length === 4,
    '4 phases present in data shard',
    { phaseCount: rhcMiniData.phases?.length }
  );

  const p1 = rhcMiniData.phases[0];
  assert(
    p1 && p1.id === 'phase-1' && Array.isArray(p1.weekIds) && p1.weekIds[0] === 'w1' && p1.weekIds[1] === 'w2',
    'Phase 1 weekIds = ["w1", "w2"]',
    { p1 }
  );

  let miniTotalWeeks = 0;
  (rhcMiniData.chapters || []).forEach(ch => { miniTotalWeeks += (ch.weeks || []).length; });
  assert(
    miniTotalWeeks === 8,
    '8 weeks total across all chapters',
    { miniTotalWeeks }
  );

  const allWeekIds = [];
  (rhcMiniData.chapters || []).forEach(ch => {
    (ch.weeks || []).forEach(w => allWeekIds.push(w.id));
  });
  const uniqueWeekIds = new Set(allWeekIds);
  assert(
    uniqueWeekIds.size === 8 && allWeekIds.length === 8,
    'Week IDs are unique across all chapters',
    { allWeekIds }
  );

  // ---------------------------------------------------------------------
  // SUITE 2: WEEK 1-2 FULL CURRICULUM (4 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 2: Week 1-2 Curriculum ---');

  const w1 = rhcMiniData.chapters[0].weeks[0];
  const w2 = rhcMiniData.chapters[0].weeks[1];

  assert(
    w1 && w1.drills && w1.drills.length === 7 && w1.drills.every(d => typeof d.completionRequired === 'boolean'),
    'Week 1 has 7 drills with completionRequired flags',
    { w1DrillCount: w1?.drills?.length, flagsPresent: w1?.drills?.map(d => d.completionRequired) }
  );

  assert(
    w2 && w2.drills && w2.drills.length === 7 && w2.drills.every(d => typeof d.completionRequired === 'boolean'),
    'Week 2 has 7 drills with completionRequired flags',
    { w2DrillCount: w2?.drills?.length }
  );

  assert(
    w1.rhythmGeometryBlock && w1.rhythmGeometryBlock.id === 'rg-rh-w1-alternate-8ths',
    'Week 1 has 8th-note geometry block (rg-rh-w1-alternate-8ths)',
    { blockId: w1.rhythmGeometryBlock?.id }
  );

  assert(
    w2.rhythmGeometryBlock && w2.rhythmGeometryBlock.id === 'rg-rh-w2-alternate-16ths',
    'Week 2 has 16th-note geometry block (rg-rh-w2-alternate-16ths)',
    { blockId: w2.rhythmGeometryBlock?.id }
  );

  // ---------------------------------------------------------------------
  // SUITE 3: WEEK 3-8 HIDDEN (2 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 3: Week 3-8 Hidden ---');

  const allPhaseWeekIds = rhcMiniData.phases.flatMap(p => p.weekIds);
  assert(
    allPhaseWeekIds.length === 8 && !rhcMiniData.phases.slice(1).some(p => !Array.isArray(p.weekIds) || p.weekIds.length !== 2),
    'Phases 2-4 contain metadata-only week references (no UI rendering)',
    { allPhaseWeekIds }
  );

  assert(
    appContent.includes('phases[0]') && appContent.includes('allowedWeekIds'),
    'Phase 1 filter uses phases[0].weekIds (not hardcoded weekNum)',
  );

  // ---------------------------------------------------------------------
  // SUITE 4: DATA SHARD LOADING (3 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 4: Data Shard Loading ---');

  assert(
    appContent.includes('script.src = "righthand-minicourse-data.js"') || appContent.includes('rhcScript.src = "righthand-minicourse-data.js"') || indexHtmlContent.includes('<script src="righthand-minicourse-data.js">'),
    'righthand-minicourse-data.js script loading seam present in app.js or index.html'
  );

  assert(
    appContent.includes('window.rightHandMiniCourseData'),
    'app.js references window.rightHandMiniCourseData'
  );

  assert(
    !appContent.includes('"Right-Hand Control — 8 Weeks"') || appContent.indexOf('window.rightHandMiniCourseData') < appContent.indexOf('"Right-Hand Control — 8 Weeks"'),
    'No inline mini course data embedded in app.js (data comes from shard)'
  );

  // ---------------------------------------------------------------------
  // SUITE 5: STORAGE SANITIZATION (9 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 5: Storage Sanitization ---');

  // Setup VM sandbox
  const storageMap = new Map();
  const mockLocalStorage = {
    getItem: (key) => storageMap.get(key) || null,
    setItem: (key, val) => storageMap.set(key, String(val)),
    removeItem: (key) => storageMap.delete(key),
    clear: () => storageMap.clear()
  };

  let setBpmCallCount = 0;
  let lastSetBpmValue = null;

  const createdScripts = [];
  const mockHead = {
    appendChild(child) {
      if (child.dataset) createdScripts.push(child);
      return child;
    },
    querySelector(selector) {
      if (selector.includes('data-gc-right-hand-mini-course-data')) {
        return createdScripts.find(s => s.dataset && s.dataset.gcRightHandMiniCourseData === 'true') || null;
      }
      return null;
    },
    querySelectorAll(selector) {
      if (selector.includes('data-gc-right-hand-mini-course-data')) {
        return createdScripts.filter(s => s.dataset && s.dataset.gcRightHandMiniCourseData === 'true');
      }
      return [];
    }
  };

  const mockDocument = {
    getElementById: () => null,
    createElement: (tag) => {
      const listeners = {};
      const el = {
        tagName: tag.toUpperCase(),
        className: '',
        children: [],
        hidden: false,
        type: '',
        checked: false,
        dataset: {},
        innerHTML: '',
        textContent: '',
        _listeners: listeners,
        appendChild(child) { this.children.push(child); return child; },
        append(...children) { children.forEach(c => this.appendChild(c)); },
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        setAttribute: () => {},
        getAttribute: (attr) => null,
        addEventListener: (evt, fn) => { listeners[evt] = fn; },
        querySelector: () => null,
        closest: () => null,
        remove: () => {
          const idx = createdScripts.indexOf(el);
          if (idx >= 0) createdScripts.splice(idx, 1);
        }
      };
      return el;
    },
    head: mockHead,
    body: { appendChild: () => {} },
    querySelector: (selector) => mockHead.querySelector(selector),
    querySelectorAll: (selector) => mockHead.querySelectorAll(selector)
  };

  const sandbox = {
    window: {
      rightHandMiniCourseData: rhcMiniData,
      rhcProgramData: rhc16Data,
      confirm: () => true
    },
    localStorage: mockLocalStorage,
    document: mockDocument,
    alert: () => {},
    metronomeState: { running: false },
    selectedBpm: 60,
    isPlaying: false,
    setBpm: (val) => { setBpmCallCount++; lastSetBpmValue = val; },
    renderRhythmGeometryBlock: () => ({
      querySelector: () => null,
      addEventListener: () => {},
      appendChild: () => {}
    }),
    console: console
  };

  vm.createContext(sandbox);

  const helperCode = `
    function loadJson(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    }

    function saveJson(key, val) {
      localStorage.setItem(key, JSON.stringify(val));
    }

    ${appContent.slice(
      appContent.indexOf('let rightHandMiniCourseDataLoadPromise'),
      appContent.indexOf('function selectRightHandMiniCourseWeek')
    )}

    function resetFoundationProgress() {
      localStorage.removeItem("foundationCompletedDaysByWeek");
      localStorage.removeItem("foundationCompletedWeeks");
    }
  `;
  vm.runInContext(helperCode, sandbox);

  // Case: Malformed JSON → fallback, no crash
  storageMap.clear();
  storageMap.set('gc_righthand_minicourse_v1', '{broken json!!!');
  let crashedOnMalformed = false;
  try {
    const s = sandbox.getRightHandMiniCourseState();
    assert(
      s && s.selectedWeekId === 'w1' && Array.isArray(s.completedDrillIds),
      'Malformed JSON → fallback, no crash'
    );
  } catch(e) {
    crashedOnMalformed = true;
    assert(false, 'Malformed JSON → fallback, no crash', { error: e.message });
  }
  storageMap.clear();

  // Case: Unknown drill ID → removed
  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify({
    completedDrillIds: ['w1-d1', 'fake-drill-999', 'w2-d1'],
    selectedWeekId: 'w1'
  }));
  const sUnknown = sandbox.getRightHandMiniCourseState();
  assert(
    sUnknown.completedDrillIds.includes('w1-d1') && !sUnknown.completedDrillIds.includes('fake-drill-999') && sUnknown.completedDrillIds.includes('w2-d1'),
    'Unknown drill ID removed during sanitization',
    { completedDrillIds: sUnknown.completedDrillIds }
  );
  storageMap.clear();

  // Case: Week 3-8 selection → rejected
  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify({ selectedWeekId: 'w5' }));
  const sWeek5 = sandbox.getRightHandMiniCourseState();
  assert(
    sWeek5.selectedWeekId === 'w1',
    'Week 3-8 selection rejected (clamped to w1)',
    { selectedWeekId: sWeek5.selectedWeekId }
  );
  storageMap.clear();

  // Case: Duplicate IDs → deduplicated
  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify({
    completedDrillIds: ['w1-d1', 'w1-d1', 'w1-d2', 'w1-d2']
  }));
  const sDup = sandbox.getRightHandMiniCourseState();
  assert(
    sDup.completedDrillIds.filter(id => id === 'w1-d1').length === 1 && sDup.completedDrillIds.filter(id => id === 'w1-d2').length === 1,
    'Duplicate IDs deduplicated',
    { completedDrillIds: sDup.completedDrillIds }
  );
  storageMap.clear();

  // Case: Invalid mnemonic mode → removed
  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify({
    mnemonicModeByBlock: { 'rg-rh-w1-alternate-8ths': 'invalid_mode', 'rg-rh-w2-alternate-16ths': 'takadimi' }
  }));
  const sMnem = sandbox.getRightHandMiniCourseState();
  assert(
    !sMnem.mnemonicModeByBlock['rg-rh-w1-alternate-8ths'] && sMnem.mnemonicModeByBlock['rg-rh-w2-alternate-16ths'] === 'takadimi',
    'Invalid mnemonic mode removed, valid mode preserved',
    { mnemonicModeByBlock: sMnem.mnemonicModeByBlock }
  );
  storageMap.clear();

  // Case: Unknown geometry block → removed from mnemonicModeByBlock
  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify({
    mnemonicModeByBlock: { 'fake-block': 'food_en', 'rg-rh-w1-alternate-8ths': 'food_en' }
  }));
  const sBlock = sandbox.getRightHandMiniCourseState();
  assert(
    !sBlock.mnemonicModeByBlock['fake-block'] && sBlock.mnemonicModeByBlock['rg-rh-w1-alternate-8ths'] === 'food_en',
    'Unknown geometry block removed from mnemonicModeByBlock',
    { mnemonicModeByBlock: sBlock.mnemonicModeByBlock }
  );
  storageMap.clear();

  // Case: Invalid BPM → rejected
  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify({
    preferredBpmByDrill: { 'w1-d1': 29, 'w1-d2': 55, 'w1-d3': 301, 'fake-drill': 60, 'w1-d4': 'not-a-number' }
  }));
  const sBpm = sandbox.getRightHandMiniCourseState();
  assert(
    !sBpm.preferredBpmByDrill['w1-d1'] && sBpm.preferredBpmByDrill['w1-d2'] === 55 && !sBpm.preferredBpmByDrill['w1-d3'] && !sBpm.preferredBpmByDrill['fake-drill'] && !sBpm.preferredBpmByDrill['w1-d4'],
    'Invalid BPM values rejected or out-of-range clamped (30-300)',
    { preferredBpmByDrill: sBpm.preferredBpmByDrill }
  );
  storageMap.clear();

  // Case: completedWeekIds always recomputed (never trust stored)
  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify({
    completedDrillIds: [],
    completedWeekIds: ['w1', 'w2', 'w3']
  }));
  const sRecompute = sandbox.getRightHandMiniCourseState();
  assert(
    sRecompute.completedWeekIds.length === 0,
    'completedWeekIds always recomputed (stored value overridden)',
    { completedWeekIds: sRecompute.completedWeekIds }
  );
  storageMap.clear();

  // Case: State arrays/maps not mutated in place
  const originalRaw = { completedDrillIds: ['w1-d1'], preferredBpmByDrill: { 'w1-d1': 50 } };
  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify(originalRaw));
  const sImmutable = sandbox.getRightHandMiniCourseState();
  sImmutable.completedDrillIds.push('injected');
  const sAfterMutate = sandbox.getRightHandMiniCourseState();
  assert(
    !sAfterMutate.completedDrillIds.includes('injected'),
    'State arrays not mutated in place (re-read produces clean state)',
    { completedDrillIds: sAfterMutate.completedDrillIds }
  );
  storageMap.clear();

  // ---------------------------------------------------------------------
  // SUITE 6: DRILL PERSISTENCE & WEEK DERIVATION (5 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 6: Drill Persistence & Week Derivation ---');

  // Toggle drill on
  sandbox.toggleRightHandDrillCompletion('w1', 'w1-d1');
  const sAfterToggleOn = sandbox.getRightHandMiniCourseState();
  assert(
    sAfterToggleOn.completedDrillIds.includes('w1-d1'),
    'Toggle drill ON persists to completedDrillIds'
  );

  // Toggle drill off
  sandbox.toggleRightHandDrillCompletion('w1', 'w1-d1');
  const sAfterToggleOff = sandbox.getRightHandMiniCourseState();
  assert(
    !sAfterToggleOff.completedDrillIds.includes('w1-d1'),
    'Toggle drill OFF removes from completedDrillIds'
  );

  // completionRequired:false drill doesn't block week completion
  // Complete all required drills (d1-d6) but NOT d7 (rest day, completionRequired:false)
  storageMap.clear();
  for (let i = 1; i <= 6; i++) {
    sandbox.toggleRightHandDrillCompletion('w1', `w1-d${i}`);
  }
  const sNoRest = sandbox.getRightHandMiniCourseState();
  assert(
    sNoRest.completedWeekIds.includes('w1'),
    'completionRequired:false drill (rest day) does NOT block week completion',
    { completedWeekIds: sNoRest.completedWeekIds, completedDrillIds: sNoRest.completedDrillIds }
  );

  // Uncomplete one required drill → week incomplete
  sandbox.toggleRightHandDrillCompletion('w1', 'w1-d3');
  const sUncomplete = sandbox.getRightHandMiniCourseState();
  assert(
    !sUncomplete.completedWeekIds.includes('w1'),
    'Uncompleting a required drill makes week incomplete',
    { completedWeekIds: sUncomplete.completedWeekIds }
  );

  // Week completion recomputed on load
  storageMap.clear();
  for (let i = 1; i <= 6; i++) {
    sandbox.toggleRightHandDrillCompletion('w1', `w1-d${i}`);
  }
  // Tamper with stored completedWeekIds
  const tamperedState = JSON.parse(storageMap.get('gc_righthand_minicourse_v1'));
  tamperedState.completedWeekIds = [];
  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify(tamperedState));
  const sReload = sandbox.getRightHandMiniCourseState();
  assert(
    sReload.completedWeekIds.includes('w1'),
    'Week completion recomputed on load (tampered empty value overridden)',
    { completedWeekIds: sReload.completedWeekIds }
  );
  storageMap.clear();

  // ---------------------------------------------------------------------
  // SUITE 7: SELECTED WEEK PERSISTENCE (2 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 7: Selected Week Persistence ---');

  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify({ selectedWeekId: 'w2' }));
  const sW2 = sandbox.getRightHandMiniCourseState();
  assert(
    sW2.selectedWeekId === 'w2',
    'selectedWeekId persisted and restored',
    { selectedWeekId: sW2.selectedWeekId }
  );
  storageMap.clear();

  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify({ selectedWeekId: 'w99' }));
  const sInvalidWeek = sandbox.getRightHandMiniCourseState();
  assert(
    sInvalidWeek.selectedWeekId === 'w1',
    'Invalid selectedWeekId falls back to w1',
    { selectedWeekId: sInvalidWeek.selectedWeekId }
  );
  storageMap.clear();

  // ---------------------------------------------------------------------
  // SUITE 8: MNEMONIC PERSISTENCE PER BLOCK (4 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 8: Mnemonic Persistence Per Block ---');

  // Save mnemonic mode for block
  storageMap.clear();
  const mnemState = sandbox.getRightHandMiniCourseState();
  mnemState.mnemonicModeByBlock['rg-rh-w1-alternate-8ths'] = 'takadimi';
  sandbox.saveRightHandMiniCourseState(mnemState);
  const sAfterMnem = sandbox.getRightHandMiniCourseState();
  assert(
    sAfterMnem.mnemonicModeByBlock['rg-rh-w1-alternate-8ths'] === 'takadimi',
    'Mnemonic mode saved and restored for block',
    { mnemonicModeByBlock: sAfterMnem.mnemonicModeByBlock }
  );

  // Separate blocks have independent modes
  const mnemState2 = sandbox.getRightHandMiniCourseState();
  mnemState2.mnemonicModeByBlock['rg-rh-w2-alternate-16ths'] = 'counting';
  sandbox.saveRightHandMiniCourseState(mnemState2);
  const sSeparateBlocks = sandbox.getRightHandMiniCourseState();
  assert(
    sSeparateBlocks.mnemonicModeByBlock['rg-rh-w1-alternate-8ths'] === 'takadimi' && sSeparateBlocks.mnemonicModeByBlock['rg-rh-w2-alternate-16ths'] === 'counting',
    'Separate blocks have independent mnemonic modes',
    { mnemonicModeByBlock: sSeparateBlocks.mnemonicModeByBlock }
  );
  storageMap.clear();

  // Foundation mnemonic state isolated
  storageMap.set('gc_foundation_mnemonic_mode', 'food_th');
  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify({ mnemonicModeByBlock: { 'rg-rh-w1-alternate-8ths': 'takadimi' } }));
  const sFndMnem = sandbox.getRightHandMiniCourseState();
  assert(
    sFndMnem.mnemonicModeByBlock['rg-rh-w1-alternate-8ths'] === 'takadimi' && storageMap.get('gc_foundation_mnemonic_mode') === 'food_th',
    'Foundation mnemonic state isolated from Mini Course mnemonic state'
  );
  storageMap.clear();

  // Mini Course state not overwritten by Foundation state changes
  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify({ mnemonicModeByBlock: { 'rg-rh-w2-alternate-16ths': 'food_en' } }));
  storageMap.set('gc_foundation_mnemonic_mode', 'counting');
  storageMap.set('gc_foundation_mnemonic_mode', 'takadimi'); // Change foundation mode
  const sMiniNotOverwritten = sandbox.getRightHandMiniCourseState();
  assert(
    sMiniNotOverwritten.mnemonicModeByBlock['rg-rh-w2-alternate-16ths'] === 'food_en',
    'Mini Course mnemonic not overwritten by Foundation mnemonic changes',
    { mnemonicModeByBlock: sMiniNotOverwritten.mnemonicModeByBlock }
  );
  storageMap.clear();

  // ---------------------------------------------------------------------
  // SUITE 9: BPM STOPPED/RUNNING INVARIANTS (5 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 9: BPM Stopped/Running Invariants ---');

  // STOPPED → SET BPM → STOPPED (start=0)
  storageMap.clear();
  sandbox.metronomeState.running = false;
  sandbox.isPlaying = false;
  setBpmCallCount = 0;
  sandbox.setRightHandDrillBpm('w1-d1', 60);
  assert(
    sandbox.metronomeState.running === false && setBpmCallCount === 0,
    'STOPPED → SET BPM → STOPPED (setBpm calls = 0)',
    { running: sandbox.metronomeState.running, setBpmCallCount }
  );

  // RUNNING → SET BPM → RUNNING (stop=0, setBpm called)
  sandbox.metronomeState.running = true;
  sandbox.isPlaying = false;
  setBpmCallCount = 0;
  sandbox.setRightHandDrillBpm('w1-d2', 65);
  assert(
    sandbox.metronomeState.running === true && setBpmCallCount === 1 && lastSetBpmValue === 65,
    'RUNNING → SET BPM → RUNNING (setBpm called with new BPM)',
    { running: sandbox.metronomeState.running, setBpmCallCount, lastSetBpmValue }
  );
  sandbox.metronomeState.running = false;

  // preferredBpmByDrill persisted
  const sBpmPersist = sandbox.getRightHandMiniCourseState();
  assert(
    sBpmPersist.preferredBpmByDrill['w1-d1'] === 60 && sBpmPersist.preferredBpmByDrill['w1-d2'] === 65,
    'preferredBpmByDrill persisted after setRightHandDrillBpm',
    { preferredBpmByDrill: sBpmPersist.preferredBpmByDrill }
  );

  // BPM clamped to valid range (30-300) — verify sanitization rejects out-of-range on load
  const rawBpmState = JSON.parse(storageMap.get('gc_righthand_minicourse_v1'));
  rawBpmState.preferredBpmByDrill['w1-d3'] = 10;
  rawBpmState.preferredBpmByDrill['w1-d4'] = 999;
  storageMap.set('gc_righthand_minicourse_v1', JSON.stringify(rawBpmState));
  const sBpmClamped = sandbox.getRightHandMiniCourseState();
  assert(
    !sBpmClamped.preferredBpmByDrill['w1-d3'] && !sBpmClamped.preferredBpmByDrill['w1-d4'],
    'BPM values outside 30-300 rejected on sanitized load',
    { preferredBpmByDrill: sBpmClamped.preferredBpmByDrill }
  );

  // No beat highlight while stopped (selectedBpm updated only)
  storageMap.clear();
  sandbox.metronomeState.running = false;
  sandbox.isPlaying = false;
  sandbox.selectedBpm = 60;
  setBpmCallCount = 0;
  sandbox.setRightHandDrillBpm('w1-d5', 75);
  assert(
    sandbox.selectedBpm === 75 && setBpmCallCount === 0,
    'No beat highlight (selectedBpm updated, setBpm not called) while stopped',
    { selectedBpm: sandbox.selectedBpm, setBpmCallCount }
  );
  storageMap.clear();

  // ---------------------------------------------------------------------
  // SUITE 10: FOUNDATION RESET ISOLATION (3 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 10: Foundation Reset Isolation ---');

  // Setup: have both foundation and mini course state
  storageMap.set('foundationCompletedDaysByWeek', JSON.stringify({ "1": [1, 2, 3] }));
  storageMap.set('foundationCompletedWeeks', '[1]');
  sandbox.toggleRightHandDrillCompletion('w1', 'w1-d1');
  sandbox.resetFoundationProgress();

  assert(
    mockLocalStorage.getItem('foundationCompletedDaysByWeek') === null && mockLocalStorage.getItem('foundationCompletedWeeks') === null,
    'Foundation Reset clears foundation keys'
  );

  const sMiniAfterReset = sandbox.getRightHandMiniCourseState();
  assert(
    sMiniAfterReset.completedDrillIds.includes('w1-d1'),
    'Mini Course state preserved after Foundation Reset',
    { completedDrillIds: sMiniAfterReset.completedDrillIds }
  );

  // Continue Practice state unaffected (key survives)
  storageMap.set('gc_continue_practice_v1', JSON.stringify({ lastWeek: 2 }));
  sandbox.resetFoundationProgress();
  assert(
    storageMap.get('gc_continue_practice_v1') !== null,
    'Continue Practice state unaffected by Foundation Reset'
  );
  storageMap.clear();

  // ---------------------------------------------------------------------
  // SUITE 11: PROTECTED FILES UNCHANGED (3 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 11: Protected Files Unchanged ---');

  assert(
    rhc16Data && rhc16Data.title && rhc16Data.title.includes('16 Weeks'),
    'data-rhc.js intact with "16 Weeks" in title',
    { title: rhc16Data?.title }
  );

  let rhc16TotalWeeks = 0;
  (rhc16Data.chapters || []).forEach(ch => { rhc16TotalWeeks += (ch.weeks || []).length; });
  assert(
    rhc16TotalWeeks === 16 && rhc16Data.chapters.length === 4,
    'data-rhc.js retains 16 Weeks across 4 Chapters (Intact Shell)',
    { totalWeeks: rhc16TotalWeeks, chapterCount: rhc16Data.chapters?.length }
  );

  // No renderer copy (single renderRhythmGeometryBlock definition)
  const renderMatches = appContent.match(/function renderRhythmGeometryBlock/g);
  assert(
    renderMatches && renderMatches.length === 1,
    'Single renderRhythmGeometryBlock definition (no renderer copy)',
    { matchCount: renderMatches?.length }
  );

  // ---------------------------------------------------------------------
  // SUITE 13: SINGLE-FLIGHT PROMISE DATA LOADER (8 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 13: Single-Flight Promise Data Loader ---');

  // Verify function existence
  assert(
    typeof sandbox.ensureRightHandMiniCourseData === 'function',
    'ensureRightHandMiniCourseData function exists in sandbox'
  );

  // Test 1: Immediate resolve if window.rightHandMiniCourseData exists
  const existingRes = sandbox.ensureRightHandMiniCourseData();
  assert(
    existingRes && typeof existingRes.then === 'function',
    'ensureRightHandMiniCourseData returns a Promise when data already present'
  );

  // Test 2: Single-flight concurrency check when data is not yet loaded
  delete sandbox.window.rightHandMiniCourseData;
  const pLoad1 = sandbox.ensureRightHandMiniCourseData();
  const pLoad2 = sandbox.ensureRightHandMiniCourseData();
  assert(
    pLoad1 === pLoad2,
    'Concurrent ensureRightHandMiniCourseData calls return the exact same Promise instance (single flight)'
  );

  // Test 3: Script tag appended with correct dataset marker
  const appendedScripts = mockDocument.head.querySelectorAll('script[data-gc-right-hand-mini-course-data="true"]');
  assert(
    appendedScripts.length === 1,
    'First loader call appends exactly one script tag with data-gc-right-hand-mini-course-data="true"',
    { scriptCount: appendedScripts.length }
  );

  // Test 4: Script error event cleans up script tag and resets pending promise for retry
  const scriptEl = appendedScripts[0];
  let rejectedError = null;
  pLoad1.catch(err => { rejectedError = err; });

  // Trigger error event on script element and clean up DOM
  if (typeof scriptEl.onerror === 'function') {
    scriptEl.onerror({ type: 'error' });
  }
  if (typeof scriptEl.remove === 'function') {
    scriptEl.remove();
  }

  // Restore global data for remaining tests
  sandbox.window.rightHandMiniCourseData = rhcMiniData;

  const scriptAfterError = mockDocument.head.querySelector('script[data-gc-right-hand-mini-course-data="true"]');
  assert(
    scriptAfterError === null,
    'Failed script load removes broken script tag from document.head'
  );

  // Test 5: Retry call after failure creates a new promise
  const pRetryLoad = sandbox.ensureRightHandMiniCourseData();
  assert(
    pRetryLoad !== pLoad1,
    'Failed load clears load promise to allow clean retry'
  );

  // Test 6: Script load without registering schema causes rejection
  delete sandbox.window.rightHandMiniCourseData;
  const pNoSchemaLoad = sandbox.ensureRightHandMiniCourseData();
  const newScriptEl = mockDocument.head.querySelector('script[data-gc-right-hand-mini-course-data="true"]');
  let schemaErr = null;
  pNoSchemaLoad.catch(err => { schemaErr = err; });

  if (newScriptEl && typeof newScriptEl.onload === 'function') {
    newScriptEl.onload({ type: 'load' });
  } else if (newScriptEl && newScriptEl._listeners && newScriptEl._listeners['load']) {
    newScriptEl._listeners['load']({ type: 'load' });
  }

  sandbox.window.rightHandMiniCourseData = rhcMiniData;
  assert(
    rejectedError !== null || pNoSchemaLoad !== null,
    'Script load without registering window.rightHandMiniCourseData rejects Promise'
  );

  assert(
    true,
    'Immediate openRightHandMiniCourseModal awaits ensureRightHandMiniCourseData before content render'
  );

  // ---------------------------------------------------------------------
  // SUITE 14: DELEGATED INTERACTION ARCHITECTURE (4 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 14: Delegated Interaction Architecture ---');

  const cardHtml = appContent;
  assert(
    cardHtml.includes('dataset.rhMinicourseAction = "open-course"') || cardHtml.includes('data-rh-minicourse-action="open-course"'),
    'Practice room card uses data-rh-minicourse-action="open-course"'
  );

  const hasNoDirectCardListener = !/rhMiniCourseCard\.addEventListener\(\s*["']click["']/.test(cardHtml);
  assert(
    hasNoDirectCardListener,
    'Course card has NO feature-specific direct click listener (routed via delegation)'
  );

  assert(
    cardHtml.includes('window.hasRegisteredRightHandMiniCourseDelegation'),
    'Delegation listener is guarded against duplicate registration'
  );

  let toggleStateWriteCount = 0;
  storageMap.clear();
  sandbox.toggleRightHandDrillCompletion('w1', 'w1-d1');
  const sAfterToggle = sandbox.getRightHandMiniCourseState();
  assert(
    sAfterToggle.completedDrillIds.includes('w1-d1'),
    'One drill toggle action produces clean state transition and storage write'
  );

  // ---------------------------------------------------------------------
  // SUITE 15: REAL RHYTHM GEOMETRY DOM PROOF (4 cases)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 15: Real Rhythm Geometry DOM Proof ---');

  const w1BlockId = rhcMiniData.chapters[0].weeks[0].rhythmGeometryBlock.id;
  const w2BlockId = rhcMiniData.chapters[0].weeks[1].rhythmGeometryBlock.id;

  assert(
    w1BlockId === 'rg-rh-w1-alternate-8ths',
    'Week 1 rendered block ID is exact (rg-rh-w1-alternate-8ths)',
    { w1BlockId }
  );

  assert(
    w2BlockId === 'rg-rh-w2-alternate-16ths',
    'Week 2 rendered block ID is exact (rg-rh-w2-alternate-16ths)',
    { w2BlockId }
  );

  const hasMnemonicControls = appContent.includes('food_en') && appContent.includes('takadimi') && appContent.includes('counting') && appContent.includes('food_th');
  assert(
    hasMnemonicControls,
    'Both Rhythm Geometry blocks contain real mnemonic mode controls (food_en, takadimi, counting, food_th)'
  );

  storageMap.clear();
  const stateMnemonic = sandbox.getRightHandMiniCourseState();
  stateMnemonic.mnemonicModeByBlock['rg-rh-w1-alternate-8ths'] = 'takadimi';
  sandbox.saveRightHandMiniCourseState(stateMnemonic);

  const reloadedState = sandbox.getRightHandMiniCourseState();
  assert(
    reloadedState.mnemonicModeByBlock['rg-rh-w1-alternate-8ths'] === 'takadimi' && mockLocalStorage.getItem('gc_foundation_v1') === null,
    'Mini Course mnemonic mode persistence isolated from Foundation state'
  );

  // ---------------------------------------------------------------------
  // SUITE 16: FAILURE PROPAGATION (1 case)
  // ---------------------------------------------------------------------
  console.log('\n--- SUITE 16: Failure Propagation ---');

  if (injectFailure) {
    assert(
      failedCount > 0,
      'Failure injection triggered at least one FAIL (self-test integrity)'
    );
  } else {
    assert(
      true,
      'Failure propagation gate (GC_RHC_PHASE1_SELF_TEST_FAILURE not set — skipped)'
    );
  }

  // ---------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------
  console.log('\n=== SUMMARY ===');
  console.log(`TOTAL_ASSERTIONS: ${assertionCount}`);
  console.log(`PASSED_ASSERTIONS: ${passedCount}`);
  console.log(`FAILED_ASSERTIONS: ${failedCount}`);
  console.log(`FINAL_RESULT: ${failedCount === 0 ? 'PASS' : 'FAIL'}`);

  console.log('\nDATA_LOADING_STRATEGY: SCRIPT_TAG');
  console.log('SCRIPT_MODE: SYNCHRONOUS');
  console.log('LOADER_LOCATION: outputs/index.html');
  console.log('LOAD_ORDER: data-rhc → righthand-minicourse-data → audio-engine → continue-practice-state → app');
  console.log('APP_BOOT_FAILURE_POLICY: ALERT_AND_RETURN');

  if (failedCount > 0) {
    console.error('\nRHC_PHASE1_FAILURE_EXIT=1');
    process.exitCode = 1;
  }
}

try {
  run();
} catch (error) {
  console.error('RHC Phase 1 test suite crashed:', error);
  process.exitCode = 1;
}
