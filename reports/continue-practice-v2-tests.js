/**
 * Continue Practice V2 Regression Test Suite
 * Tests safe resume, state migration (V1 -> V2), block-level recovery,
 * Rhythm Geometry mnemonic persistence, stale target fallback, and failure injection.
 */

const fs = require('fs');
const path = require('path');

function runContinuePracticeV2Tests() {
  console.log('=== CONTINUE PRACTICE V2 REGRESSION TESTS ===\n');

  const isInjectedFailure = process.env.GC_CONTINUE_V2_SELF_TEST_FAILURE === '1';
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, message, details = {}) {
    if (isInjectedFailure && message.includes('CASE 1')) {
      condition = false; // Inject fault for self-test
    }

    if (condition) {
      console.log(`  [PASS] ${message}`);
      passedCount++;
    } else {
      console.log(`  [FAIL] ${message}`);
      if (Object.keys(details).length > 0) {
        console.log(`         Details: ${JSON.stringify(details)}`);
      }
      failedCount++;
    }
  }

  // Load continue-practice-state.js API
  const cpModulePath = path.join(__dirname, '../outputs/continue-practice-state.js');
  const cpApi = require(cpModulePath);

  // Mock catalog
  const mockCatalog = {
    lessons: [
      {
        id: 'foundation-week-1',
        label: 'สัปดาห์ที่ 1: Pulse & 16th Grid',
        exercises: [{ id: 'foundation-week-1-day-1', label: 'วันที่ 1', stepIndex: 0 }]
      },
      {
        id: 'foundation-week-2',
        label: 'สัปดาห์ที่ 2: Syncopation',
        exercises: [{ id: 'foundation-week-2-day-1', label: 'วันที่ 1', stepIndex: 0 }]
      }
    ]
  };

  const validationOptions = {
    catalog: mockCatalog,
    minBpm: 50,
    maxBpm: 180
  };

  // --- CASE 1: V1 Migration ---
  const v1Record = {
    schemaVersion: 1,
    updatedAt: '2026-07-24T18:00:00.000Z',
    location: {
      route: 'dashboard',
      lessonId: 'foundation-week-2',
      exerciseId: 'foundation-week-2-day-1',
      stepId: null,
      stepIndex: 0
    },
    preferences: {
      instrument: 'nylon',
      metronomeBpm: 90,
      metronomeEnabled: true
    }
  };

  const migratedRecord = cpApi.validateRecord(v1Record, validationOptions);
  assert(
    migratedRecord !== null &&
    migratedRecord.schemaVersion === 2 &&
    migratedRecord.location.lessonId === 'foundation-week-2' &&
    migratedRecord.location.monthId === 1 &&
    migratedRecord.preferences.instrument === 'nylon',
    'CASE 1 — V1 state migrates to V2 preserving lesson target and preferences'
  );

  // --- CASE 2: Malformed JSON ---
  const malformedRaw = '{"schemaVersion": 2, "updatedAt": INVALID_JSON';
  const malformedDeserialized = cpApi.deserializeRecord(malformedRaw, validationOptions);
  assert(
    malformedDeserialized === null,
    'CASE 2 — Malformed JSON fails gracefully without throwing uncaught exceptions'
  );

  // --- CASE 3: Unknown Future Version ---
  const futureRecord = {
    schemaVersion: 99,
    updatedAt: new Date().toISOString(),
    location: { route: 'dashboard', lessonId: 'foundation-week-1' },
    preferences: { instrument: 'synth', metronomeBpm: 80, metronomeEnabled: false }
  };
  const futureDeserialized = cpApi.validateRecord(futureRecord, validationOptions);
  assert(
    futureDeserialized === null,
    'CASE 3 — Unknown future version is safely ignored and not parsed as valid state'
  );

  // --- CASE 4: localStorage Unavailable ---
  const nullStorageStore = cpApi.createStore({ storage: null, catalog: mockCatalog, minBpm: 50, maxBpm: 180 });
  const loadResult = nullStorageStore.load();
  const writeResult = nullStorageStore.save({
    location: { route: 'dashboard', lessonId: 'foundation-week-1', exerciseId: 'foundation-week-1-day-1', stepIndex: 0 },
    preferences: { instrument: 'synth', metronomeBpm: 80, metronomeEnabled: false }
  });
  assert(
    loadResult === null && writeResult === false,
    'CASE 4 — Unavailable storage operates safely in session-only mode without crashing'
  );

  // --- CASE 5: Visible Exact Target ---
  const validV2Record = {
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
    location: {
      monthId: 1,
      weekId: 2,
      lessonId: 'foundation-week-2',
      sectionId: 'learn',
      blockId: 'w2-rhythm-geometry-16th-syncopation',
      route: 'dashboard',
      exerciseId: 'foundation-week-2-day-1',
      stepIndex: 0
    },
    blockState: {
      'w2-rhythm-geometry-16th-syncopation': { mnemonicMode: 'food_th' }
    },
    preferences: { instrument: 'electric', metronomeBpm: 100, metronomeEnabled: false }
  };
  const validatedV2 = cpApi.validateRecord(validV2Record, validationOptions);
  assert(
    validatedV2 !== null &&
    validatedV2.location.blockId === 'w2-rhythm-geometry-16th-syncopation' &&
    validatedV2.blockState['w2-rhythm-geometry-16th-syncopation']?.mnemonicMode === 'food_th',
    'CASE 5 — Valid V2 record with month, week, section, block, and blockState parses correctly'
  );

  // --- CASE 6: Stale Block Fallback ---
  const staleBlockRecord = {
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
    location: {
      monthId: 1,
      weekId: 2,
      lessonId: 'foundation-week-2',
      sectionId: 'learn',
      blockId: 'nonexistent-deleted-block-id',
      route: 'dashboard',
      exerciseId: 'foundation-week-2-day-1',
      stepIndex: 0
    },
    preferences: { instrument: 'synth', metronomeBpm: 82, metronomeEnabled: false }
  };
  const validatedStaleBlock = cpApi.validateRecord(staleBlockRecord, validationOptions);
  assert(
    validatedStaleBlock !== null && validatedStaleBlock.location.lessonId === 'foundation-week-2',
    'CASE 6 — Stale block ID preserves valid lesson target'
  );

  // --- CASE 7: Stale Section Fallback ---
  const staleSectionRecord = {
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
    location: {
      monthId: 1,
      weekId: 2,
      lessonId: 'foundation-week-2',
      sectionId: 'invalid-section-xyz',
      blockId: null,
      route: 'dashboard',
      exerciseId: 'foundation-week-2-day-1',
      stepIndex: 0
    },
    preferences: { instrument: 'synth', metronomeBpm: 82, metronomeEnabled: false }
  };
  const validatedStaleSection = cpApi.validateRecord(staleSectionRecord, validationOptions);
  assert(
    validatedStaleSection !== null && validatedStaleSection.location.lessonId === 'foundation-week-2',
    'CASE 7 — Stale section ID preserves valid lesson target'
  );

  // --- CASE 8: Stale Lesson Fallback ---
  const staleLessonRecord = {
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
    location: {
      monthId: 1,
      weekId: 99,
      lessonId: 'nonexistent-lesson-99',
      route: 'dashboard'
    },
    preferences: { instrument: 'synth', metronomeBpm: 82, metronomeEnabled: false }
  };
  const validatedStaleLesson = cpApi.validateRecord(staleLessonRecord, validationOptions);
  assert(
    validatedStaleLesson === null,
    'CASE 8 — Nonexistent lesson target is rejected by catalog validator'
  );

  // --- CASE 9: Hidden Target Injection Guard ---
  const hiddenTargetRecord = {
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
    location: {
      monthId: 6,
      weekId: 24,
      lessonId: 'month-6-week-24-hidden',
      route: 'dashboard'
    },
    preferences: { instrument: 'synth', metronomeBpm: 82, metronomeEnabled: false }
  };
  const validatedHidden = cpApi.validateRecord(hiddenTargetRecord, validationOptions);
  assert(
    validatedHidden === null,
    'CASE 9 — Hidden target injection is blocked by catalog and month guards'
  );

  // --- CASE 10: Rhythm Geometry Mode Sanitization ---
  const maliciousBlockState = {
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
    location: {
      monthId: 1,
      weekId: 2,
      lessonId: 'foundation-week-2',
      exerciseId: 'foundation-week-2-day-1',
      stepIndex: 0,
      route: 'dashboard'
    },
    blockState: {
      'w2-rhythm-geometry-16th-syncopation': { mnemonicMode: '<script>alert(1)</script>' }
    },
    preferences: { instrument: 'synth', metronomeBpm: 82, metronomeEnabled: false }
  };
  const validatedMaliciousMode = cpApi.validateRecord(maliciousBlockState, validationOptions);
  assert(
    validatedMaliciousMode !== null &&
    Object.keys(validatedMaliciousMode.blockState).length === 0,
    'CASE 10 — Invalid or malicious mnemonicMode is sanitized and stripped out'
  );

  // --- CASE 11: Start Over Action ---
  const mockStorage = {};
  const inMemoryStorage = {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, val) => { mockStorage[key] = val; },
    removeItem: (key) => { delete mockStorage[key]; }
  };

  const store = cpApi.createStore({ storage: inMemoryStorage, catalog: mockCatalog, minBpm: 50, maxBpm: 180 });
  store.save(validV2Record);
  const controller = cpApi.createDecisionController({
    store,
    catalog: mockCatalog,
    minBpm: 50,
    maxBpm: 180,
    adapters: {
      applyFreshLocation: async () => true
    }
  });

  controller.startFresh();

  assert(
    mockStorage['guitarCompanion.continuePractice.v1'] === undefined,
    'CASE 11 — Start Over clears stored continue practice location'
  );

  // --- CASE 12: Write Deduplication ---
  let writeCount = 0;
  const countingStorage = {
    getItem: () => null,
    setItem: () => { writeCount++; },
    removeItem: () => {}
  };
  const dedupStore = cpApi.createStore({ storage: countingStorage, catalog: mockCatalog, minBpm: 50, maxBpm: 180 });
  dedupStore.save(validV2Record);
  dedupStore.save(validV2Record); // Duplicate write
  assert(
    writeCount === 1,
    'CASE 12 — Identical state snapshots are deduplicated and do not trigger extra writes'
  );

  // --- CASE 13: Listener Lifecycle Guard ---
  const appJsContent = fs.readFileSync(path.join(__dirname, '../outputs/app.js'), 'utf-8');
  const initMatches = appJsContent.match(/function initializeContinuePracticeStateV1\(\)/g) || [];
  assert(
    initMatches.length === 1,
    'CASE 13 — initializeContinuePracticeStateV1 is a single top-level entry point'
  );

  // --- CASE 14: AudioEngine Intact ---
  const audioEngineContent = fs.readFileSync(path.join(__dirname, '../outputs/audio-engine.js'), 'utf-8');
  assert(
    audioEngineContent.length > 0 && !audioEngineContent.includes('continuePractice'),
    'CASE 14 — outputs/audio-engine.js remains untouched and decoupled from Continue Practice'
  );

  // Summary
  console.log(`\n=== SUMMARY ===`);
  console.log(`TOTAL_ASSERTIONS: ${passedCount + failedCount}`);
  console.log(`PASSED_ASSERTIONS: ${passedCount}`);
  console.log(`FAILED_ASSERTIONS: ${failedCount}`);
  console.log(`FINAL_RESULT: ${failedCount === 0 ? 'PASS' : 'FAIL'}\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

try {
  runContinuePracticeV2Tests();
} catch (err) {
  console.error('Test Suite Crash:', err);
  process.exit(1);
}
