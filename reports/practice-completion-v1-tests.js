'use strict';

/**
 * Month 1 Practice Completion V1 regression suite.
 * This suite intentionally contains exactly 35 assertions.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO_ROOT = path.resolve(__dirname, '..');
const appContent = fs.readFileSync(path.join(REPO_ROOT, 'outputs/app.js'), 'utf8');
const stylesContent = fs.readFileSync(path.join(REPO_ROOT, 'outputs/styles.css'), 'utf8');
const regressionContent = fs.readFileSync(path.join(REPO_ROOT, 'reports/main-app-regression-tests.js'), 'utf8');
const injectFailure = String(process.env.GC_PRACTICE_COMPLETION_SELF_TEST_FAILURE || '').trim() === '1';

let assertionCount = 0;
let passedCount = 0;
let failedCount = 0;

function assert(condition, message, details = {}) {
  assertionCount += 1;
  if (injectFailure && assertionCount === 1) condition = false;

  if (condition) {
    passedCount += 1;
    console.log(`  [PASS] ${message}`);
    return;
  }

  failedCount += 1;
  console.error(`  [FAIL] ${message}`);
  if (Object.keys(details).length) {
    console.error(`         Details: ${JSON.stringify(details)}`);
  }
}

function jsonEqual(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function createBehaviorHarness() {
  const start = appContent.indexOf('function setCompletedFoundationWeeks');
  const end = appContent.indexOf('function getCurrentFoundationWeek', start);
  if (start < 0 || end < 0) {
    throw new Error('Practice completion helper block was not found in outputs/app.js');
  }

  const storage = {};
  const context = {
    foundationStorage: {
      completedWeeks: 'foundationCompletedWeeks',
      completedDaysByWeek: 'foundationCompletedDaysByWeek'
    },
    localStorage: {
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
      }
    },
    loadJson(key, fallback) {
      if (!Object.prototype.hasOwnProperty.call(storage, key)) return fallback;
      return JSON.parse(storage[key]);
    },
    saveJson(key, value) {
      storage[key] = JSON.stringify(value);
    }
  };

  vm.createContext(context);
  vm.runInContext(`
    ${appContent.slice(start, end)}
    this.practiceCompletionApi = {
      getCompletedFoundationDaysByWeek,
      setCompletedFoundationDaysByWeek,
      getCompletedFoundationDays,
      isFoundationDayCompleted,
      setFoundationDayCompletion,
      getFoundationWeekCompletedDayCount,
      recomputeCompletedFoundationWeeks,
      getNextIncompleteFoundationTarget
    };
  `, context);

  return {
    api: context.practiceCompletionApi,
    storage,
    read(key, fallback) {
      return Object.prototype.hasOwnProperty.call(storage, key)
        ? JSON.parse(storage[key])
        : fallback;
    },
    clear() {
      Object.keys(storage).forEach((key) => delete storage[key]);
    }
  };
}

function getFunctionSource(name) {
  const start = appContent.indexOf(`function ${name}`);
  if (start < 0) return '';
  const nextFunction = appContent.indexOf('\nfunction ', start + 10);
  return appContent.slice(start, nextFunction < 0 ? appContent.length : nextFunction);
}

function run() {
  console.log('=== MONTH 1 PRACTICE COMPLETION V1 TESTS ===\n');

  const harness = createBehaviorHarness();
  const { api, storage } = harness;

  // Storage and sanitation
  assert(
    appContent.includes('completedDaysByWeek: "foundationCompletedDaysByWeek"'),
    'CASE 01 — Foundation completion storage key is registered'
  );
  assert(
    jsonEqual(api.getCompletedFoundationDaysByWeek(), {}),
    'CASE 02 — Missing completion storage loads as an empty object'
  );

  const legacyMigrationHarness = createBehaviorHarness();
  legacyMigrationHarness.storage.foundationCompletedWeeks = JSON.stringify([2]);
  const migratedLegacyDays = legacyMigrationHarness.api.getCompletedFoundationDaysByWeek();
  assert(
    jsonEqual(migratedLegacyDays, { 2: [1, 2, 3, 4, 5, 6, 7] })
      && jsonEqual(legacyMigrationHarness.read('foundationCompletedDaysByWeek'), migratedLegacyDays),
    'Legacy completed Week migrates to seven completed Days when new key is missing.'
  );

  const precedenceHarness = createBehaviorHarness();
  precedenceHarness.storage.foundationCompletedWeeks = JSON.stringify([1, 2]);
  precedenceHarness.storage.foundationCompletedDaysByWeek = JSON.stringify({ 1: [3] });
  assert(
    jsonEqual(precedenceHarness.api.getCompletedFoundationDaysByWeek(), { 1: [3] })
      && jsonEqual(precedenceHarness.read('foundationCompletedDaysByWeek'), { 1: [3] }),
    'Existing completedDaysByWeek takes precedence over legacy Weeks.'
  );

  const idempotentMigrationHarness = createBehaviorHarness();
  idempotentMigrationHarness.storage.foundationCompletedWeeks = JSON.stringify([3]);
  const firstMigration = idempotentMigrationHarness.api.getCompletedFoundationDaysByWeek();
  const persistedAfterFirstMigration = idempotentMigrationHarness.storage.foundationCompletedDaysByWeek;
  idempotentMigrationHarness.storage.foundationCompletedWeeks = JSON.stringify([1, 2, 4]);
  const secondMigration = idempotentMigrationHarness.api.getCompletedFoundationDaysByWeek();
  assert(
    jsonEqual(firstMigration, { 3: [1, 2, 3, 4, 5, 6, 7] })
      && jsonEqual(secondMigration, firstMigration)
      && idempotentMigrationHarness.storage.foundationCompletedDaysByWeek === persistedAfterFirstMigration,
    'Legacy migration runs idempotently without duplicating or corrupting state.'
  );

  api.setCompletedFoundationDaysByWeek({ 1: [1] });
  assert(
    Object.prototype.hasOwnProperty.call(storage, 'foundationCompletedDaysByWeek'),
    'CASE 03 — Completion setter writes through the dedicated storage key'
  );

  api.setCompletedFoundationDaysByWeek({ 1: [7, '2', 2, 1] });
  assert(
    jsonEqual(harness.read('foundationCompletedDaysByWeek'), { 1: [1, 2, 7] }),
    'CASE 04 — Day values are numeric, unique, and sorted'
  );

  api.setCompletedFoundationDaysByWeek({ 1: [-1, 0, 1.5, 1, 8, 99, 'nope'] });
  assert(
    jsonEqual(harness.read('foundationCompletedDaysByWeek'), { 1: [1] }),
    'CASE 05 — Invalid and out-of-range day values are discarded'
  );

  api.setCompletedFoundationDaysByWeek({ 0: [1], 1: [2], 5: [3], bad: [4] });
  assert(
    jsonEqual(harness.read('foundationCompletedDaysByWeek'), { 1: [2] }),
    'CASE 06 — Only Month 1 Weeks 1–4 are accepted'
  );

  api.setCompletedFoundationDaysByWeek({ 1: [], 2: ['bad'], 3: [4] });
  assert(
    jsonEqual(harness.read('foundationCompletedDaysByWeek'), { 3: [4] }),
    'CASE 07 — Empty week arrays are omitted from persisted state'
  );

  assert(
    jsonEqual(api.getCompletedFoundationDays(3), [4]),
    'CASE 08 — Completed days can be read for a valid week'
  );
  assert(
    jsonEqual(api.getCompletedFoundationDays(2), []),
    'CASE 09 — A week with no completions returns an empty array'
  );
  assert(
    api.isFoundationDayCompleted(3, '4') === true,
    'CASE 10 — Completion lookup accepts a numeric day value'
  );
  assert(
    api.isFoundationDayCompleted(3, 5) === false,
    'CASE 11 — Completion lookup rejects an incomplete day'
  );
  assert(
    api.getFoundationWeekCompletedDayCount(3) === 1,
    'CASE 12 — Weekly completed-day count reflects stored days'
  );

  // Toggle behavior and derived week completion
  harness.clear();
  api.setFoundationDayCompletion(2, 3, true);
  assert(
    jsonEqual(api.getCompletedFoundationDays(2), [3]),
    'CASE 13 — Marking a day complete adds it to its week'
  );
  api.setFoundationDayCompletion(2, 3, true);
  assert(
    jsonEqual(api.getCompletedFoundationDays(2), [3]),
    'CASE 14 — Re-marking a completed day does not create duplicates'
  );
  api.setFoundationDayCompletion(2, 3, false);
  assert(
    jsonEqual(api.getCompletedFoundationDays(2), []),
    'CASE 15 — Unmarking a day removes it from its week'
  );

  const stateBeforeInvalidWeek = storage.foundationCompletedDaysByWeek;
  assert(
    api.setFoundationDayCompletion(5, 1, true) === false
      && storage.foundationCompletedDaysByWeek === stateBeforeInvalidWeek,
    'CASE 16 — Invalid week input is ignored without changing storage'
  );
  assert(
    api.setFoundationDayCompletion(1, 8, true) === false
      && storage.foundationCompletedDaysByWeek === stateBeforeInvalidWeek,
    'CASE 17 — Invalid day input is ignored without changing storage'
  );

  api.setCompletedFoundationDaysByWeek({ 1: [1, 2, 3, 4, 5, 6, 7], 2: [1, 2, 3] });
  api.recomputeCompletedFoundationWeeks();
  assert(
    jsonEqual(harness.read('foundationCompletedWeeks'), [1]),
    'CASE 18 — A 7/7 week is derived as complete'
  );
  assert(
    !harness.read('foundationCompletedWeeks').includes(2),
    'CASE 19 — A partial week is not derived as complete'
  );
  api.setFoundationDayCompletion(1, 7, false);
  assert(
    jsonEqual(harness.read('foundationCompletedWeeks'), []),
    'CASE 20 — Removing a day immediately removes derived week completion'
  );

  // Advance selection
  api.setCompletedFoundationDaysByWeek({ 1: [1, 2] });
  assert(
    jsonEqual(api.getNextIncompleteFoundationTarget(1, 2), { week: 1, day: 3, monthComplete: false }),
    'CASE 21 — Advance selects the next incomplete day in the same week'
  );

  api.setCompletedFoundationDaysByWeek({ 1: [1, 2, 3, 4, 5, 6, 7] });
  assert(
    jsonEqual(api.getNextIncompleteFoundationTarget(1, 7), { week: 2, day: 1, monthComplete: false }),
    'CASE 22 — Advance crosses into the next week chronologically'
  );

  api.setCompletedFoundationDaysByWeek({
    1: [2, 3, 4, 5, 6, 7],
    2: [1, 2, 3, 4, 5, 6, 7],
    3: [1, 2, 3, 4, 5, 6, 7],
    4: [1, 2, 3, 4, 5, 6, 7]
  });
  assert(
    jsonEqual(api.getNextIncompleteFoundationTarget(4, 7), { week: 1, day: 1, monthComplete: false }),
    'CASE 23 — Advance wraps to the earliest gap after the current day'
  );

  api.setCompletedFoundationDaysByWeek({
    1: [1, 2, 3, 4, 5, 6, 7],
    2: [1, 2, 3, 4, 5, 6, 7],
    3: [1, 2, 3, 4, 5, 6, 7],
    4: [1, 2, 3, 4, 5, 6, 7]
  });
  assert(
    jsonEqual(api.getNextIncompleteFoundationTarget(4, 7), { week: 4, day: 7, monthComplete: true }),
    'CASE 24 — All 28 completed days return the month-complete target'
  );

  // Rendering, delegation, reset, and regression integration
  const selectorSource = getFunctionSource('renderPracticeDaySelector');
  assert(
    selectorSource.includes('" is-current"') && selectorSource.includes('aria-current'),
    'CASE 25 — Active day selector uses the is-current state'
  );
  assert(
    selectorSource.includes('" is-completed"') && selectorSource.includes('button.dataset.foundationDay'),
    'CASE 26 — Completed day selector uses is-completed and data-foundation-day'
  );
  assert(
    selectorSource.includes('markDayCompleteButton')
      && selectorSource.includes('dataset.markDayComplete')
      && selectorSource.includes('✓ วันนี้เสร็จแล้ว · กดเพื่อยกเลิก')
      && selectorSource.includes('ทำเครื่องหมายว่าวันนี้เสร็จแล้ว')
      && selectorSource.includes('aria-pressed'),
    'CASE 27 — Completion CTA exposes the required id, data hook, copy, and pressed state'
  );

  const delegationSource = getFunctionSource('handleDelegatedLessonClicks');
  assert(
    delegationSource.includes('target.closest("[data-foundation-day]")')
      && delegationSource.includes('switchDay(Number(dayBtn.dataset.foundationDay))')
      && delegationSource.includes('target.closest("[data-mark-day-complete]")')
      && delegationSource.includes('markFoundationDayCompleteAndAdvance(focusedSelectedWeek, getPracticeDay(focusedSelectedWeek))'),
    'CASE 28 — Day selection and completion CTA use delegated click handlers'
  );

  const weekTabsSource = getFunctionSource('renderFocusedWeekTabs');
  assert(
    weekTabsSource.includes('getFoundationWeekCompletedDayCount(weekItem.number)')
      && weekTabsSource.includes('week-progress-badge')
      && weekTabsSource.includes('${isWeekComplete ? "✓ " : ""}${completedDayCount}/7 วัน'),
    'CASE 29 — Week tabs show x/7 days and a checkmark at 7/7'
  );

  const learnSource = getFunctionSource('renderLearnSection');
  assert(
    learnSource.includes('getFoundationWeekCompletedDayCount(weekNumber)')
      && learnSource.includes('week-progress-badge')
      && learnSource.includes('${isWeekComplete ? "✓ " : ""}${completedDayCount}/7 วัน'),
    'CASE 30 — Learn section shows x/7 days and a checkmark at 7/7'
  );

  const resetSource = getFunctionSource('resetFoundationProgress');
  assert(
    resetSource.includes('removeItem(foundationStorage.completedDaysByWeek)')
      && resetSource.includes('selectedFocusedMonth = 1')
      && resetSource.includes('focusedSelectedWeek = 1')
      && resetSource.includes('setPracticeDay(1, 1)')
      && resetSource.includes('persistContinuePracticeStateV1()')
      && !/bpm\s*=|selectedAudioInstrument\s*=|metronomeEnabledPreferenceV1\s*=/.test(resetSource),
    'CASE 31 — Reset clears day completion, restores Month 1 Week 1 Day 1, and preserves preferences'
  );

  const requiredSelectors = [
    '.practice-day.is-completed',
    '.practice-day.is-current',
    '#markDayCompleteButton',
    '.week-progress-badge',
    '.month-complete-banner'
  ];
  assert(
    requiredSelectors.every((selector) => stylesContent.includes(selector))
      && regressionContent.includes('reports/practice-completion-v1-tests.js'),
    'CASE 32 — Required completion styles exist and the suite is integrated into the main regression harness'
  );

  console.log('\n=== SUMMARY ===');
  console.log(`TOTAL_ASSERTIONS: ${assertionCount}`);
  console.log(`PASSED_ASSERTIONS: ${passedCount}`);
  console.log(`FAILED_ASSERTIONS: ${failedCount}`);
  console.log(`FINAL_RESULT: ${failedCount === 0 ? 'PASS' : 'FAIL'}\n`);

  if (assertionCount !== 35) {
    console.error(`Expected exactly 35 assertions, received ${assertionCount}.`);
    process.exitCode = 1;
  } else if (failedCount > 0) {
    process.exitCode = 1;
  }
}

try {
  run();
} catch (error) {
  console.error('Practice completion test suite crashed:', error);
  process.exitCode = 1;
}
