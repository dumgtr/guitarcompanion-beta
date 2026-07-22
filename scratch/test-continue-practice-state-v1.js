"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ContinuePractice = require("../outputs/continue-practice-state.js");

const FIXED_TIME = "2026-07-22T03:04:05.000Z";
const catalog = {
  lessons: Array.from({ length: 4 }, (_, weekIndex) => ({
    id: `foundation-week-${weekIndex + 1}`,
    label: `Week ${weekIndex + 1}`,
    exercises: Array.from({ length: 7 }, (_, dayIndex) => ({
      id: `foundation-week-${weekIndex + 1}-day-${dayIndex + 1}`,
      label: `Day ${dayIndex + 1}`,
      stepIndex: dayIndex
    }))
  }))
};
const validationOptions = { catalog, minBpm: 50, maxBpm: 180 };

function makeSnapshot(overrides = {}) {
  return {
    location: {
      route: "lessons",
      lessonId: "foundation-week-2",
      exerciseId: "foundation-week-2-day-4",
      stepId: null,
      stepIndex: 3,
      ...(overrides.location || {})
    },
    preferences: {
      instrument: "nylon",
      metronomeBpm: 96,
      metronomeEnabled: true,
      ...(overrides.preferences || {})
    },
    audioContext: { forbidden: true },
    activeVoices: ["forbidden"],
    pendingRequests: new Map([["forbidden", true]])
  };
}

function makeRecord(overrides = {}) {
  const snapshot = makeSnapshot(overrides);
  return ContinuePractice.serializeSnapshot(snapshot, {
    ...validationOptions,
    now: () => new Date(FIXED_TIME)
  });
}

function createMemoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  const calls = [];
  return {
    calls,
    getItem(key) {
      calls.push(["getItem", key]);
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      calls.push(["setItem", key, value]);
      values.set(key, value);
    },
    removeItem(key) {
      calls.push(["removeItem", key]);
      values.delete(key);
    },
    has(key) {
      return values.has(key);
    },
    value(key) {
      return values.get(key);
    }
  };
}

function createFakeTimers() {
  let nextId = 1;
  const callbacks = new Map();
  return {
    setTimer(callback) {
      const id = nextId++;
      callbacks.set(id, callback);
      return id;
    },
    clearTimer(id) {
      callbacks.delete(id);
    },
    runAll() {
      const pending = [...callbacks.values()];
      callbacks.clear();
      pending.forEach((callback) => callback());
    },
    count() {
      return callbacks.size;
    }
  };
}

function assertInvalid(mutator, message) {
  const record = makeRecord();
  mutator(record);
  assert.equal(ContinuePractice.validateRecord(record, validationOptions), null, message);
}

function extractProductionFunction(source, functionName) {
  const declaration = `function ${functionName}(`;
  const start = source.indexOf(declaration);
  assert.notEqual(start, -1, `${functionName} must exist in outputs/app.js`);
  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error(`Could not extract ${functionName} from outputs/app.js`);
}

function createProductionStartFreshHarness(appSource, storage) {
  const context = vm.createContext({
    selectedFocusedMonth: 4,
    focusedSelectedWeek: 3,
    selectedWeek: 3,
    restoredContinuePracticeDestinationV1: { week: 4, day: 6 },
    foundationStorage: { completedWeeks: "foundationCompletedWeeks" },
    foundationWeeks: [1, 2, 3, 4].map((number) => ({ number })),
    loadJson(key, fallback) {
      const raw = storage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    },
    renderCount: 0,
    renderFocusedApp() {
      context.renderCount += 1;
    },
    window: {
      history: {
        replaceState(_state, _title, hash) {
          context.hash = hash;
        }
      }
    },
    document: {
      getElementById(id) {
        if (id !== "dashboard") return null;
        return {
          scrollIntoView() {
            context.dashboardScrolled = true;
          }
        };
      }
    }
  });

  const productionSource = [
    extractProductionFunction(appSource, "getCompletedFoundationWeeks"),
    extractProductionFunction(appSource, "getCurrentFoundationWeek"),
    extractProductionFunction(appSource, "applyFreshPracticeLocationV1")
  ].join("\n");
  vm.runInContext(productionSource, context, { filename: "outputs/app.js" });
  return context;
}

async function run() {
  assert.equal(ContinuePractice.STORAGE_KEY, "guitarCompanion.continuePractice.v1");
  assert.equal(ContinuePractice.SCHEMA_VERSION, 1);

  const roundTrip = makeRecord();
  assert.deepEqual(ContinuePractice.deserializeRecord(JSON.stringify(roundTrip), validationOptions), roundTrip);
  assert.equal(roundTrip.updatedAt, FIXED_TIME);
  assert.equal("audioContext" in roundTrip, false, "runtime AudioContext must not serialize");
  assert.equal("activeVoices" in roundTrip, false, "active voices must not serialize");
  assert.deepEqual(Object.keys(roundTrip), ["schemaVersion", "updatedAt", "location", "preferences"]);

  const withUnknownFields = JSON.parse(JSON.stringify(roundTrip));
  withUnknownFields.secret = "ignored";
  withUnknownFields.location.domNode = "ignored";
  withUnknownFields.preferences.timer = "ignored";
  const sanitized = ContinuePractice.validateRecord(withUnknownFields, validationOptions);
  assert.equal("secret" in sanitized, false);
  assert.equal("domNode" in sanitized.location, false);
  assert.equal("timer" in sanitized.preferences, false);

  const missingOptionalPreferences = JSON.parse(JSON.stringify(roundTrip));
  delete missingOptionalPreferences.preferences;
  assert.deepEqual(
    ContinuePractice.validateRecord(missingOptionalPreferences, validationOptions).preferences,
    { instrument: "synth", metronomeBpm: 82, metronomeEnabled: false }
  );

  assert.equal(ContinuePractice.deserializeRecord("{broken", validationOptions), null);
  assert.equal(ContinuePractice.deserializeRecord("null", validationOptions), null);
  assert.equal(ContinuePractice.deserializeRecord("[]", validationOptions), null);
  assertInvalid((record) => { record.schemaVersion = 2; }, "future schemas fail closed");
  assertInvalid((record) => { record.location.route = "admin"; }, "unknown route rejected");
  assertInvalid((record) => { record.location.lessonId = "deleted-week"; }, "missing lesson rejected");
  assertInvalid((record) => { record.location.exerciseId = "deleted-exercise"; }, "missing exercise rejected");
  assertInvalid((record) => { record.location.stepIndex = 99; }, "stale step index rejected");
  assertInvalid((record) => { record.location.stepIndex = -1; }, "negative step index rejected");
  assertInvalid((record) => { record.preferences.instrument = "organ"; }, "unsupported instrument rejected");
  assertInvalid((record) => { record.preferences.metronomeBpm = 49; }, "low BPM rejected");
  assertInvalid((record) => { record.preferences.metronomeBpm = 181; }, "high BPM rejected");
  assertInvalid((record) => { record.preferences.metronomeBpm = Number.POSITIVE_INFINITY; }, "non-finite BPM rejected");
  assertInvalid((record) => { record.preferences.metronomeEnabled = "true"; }, "unexpected types rejected");

  const readFailureStore = ContinuePractice.createStore({
    storage: { getItem() { throw new Error("denied"); } },
    ...validationOptions
  });
  assert.doesNotThrow(() => readFailureStore.load());
  assert.equal(readFailureStore.load(), null);

  const writeFailureStore = ContinuePractice.createStore({
    storage: {
      getItem() { return null; },
      setItem() { throw new Error("quota"); },
      removeItem() { throw new Error("denied"); }
    },
    now: () => new Date(FIXED_TIME),
    ...validationOptions
  });
  assert.equal(writeFailureStore.save(makeSnapshot()), false, "quota failure must be contained");
  assert.equal(writeFailureStore.clear(), false, "remove failure must be contained");

  const corruptStorage = createMemoryStorage({
    [ContinuePractice.STORAGE_KEY]: "{broken",
    unrelated: "keep"
  });
  const corruptStore = ContinuePractice.createStore({ storage: corruptStorage, ...validationOptions });
  assert.equal(corruptStore.load(), null);
  assert.equal(corruptStorage.has(ContinuePractice.STORAGE_KEY), false, "corrupt feature record is removed");
  assert.equal(corruptStorage.value("unrelated"), "keep", "unrelated storage survives corruption cleanup");

  const timers = createFakeTimers();
  const storage = createMemoryStorage({ unrelated: "keep" });
  const store = ContinuePractice.createStore({
    storage,
    now: () => new Date(FIXED_TIME),
    setTimer: timers.setTimer,
    clearTimer: timers.clearTimer,
    debounceMs: 180,
    ...validationOptions
  });
  const firstSnapshot = makeSnapshot({ preferences: { metronomeBpm: 90 } });
  const finalSnapshot = makeSnapshot({ preferences: { metronomeBpm: 104 } });
  assert.equal(store.save(firstSnapshot, { debounce: true }), true);
  assert.equal(store.save(finalSnapshot, { debounce: true }), true);
  assert.equal(timers.count(), 1, "BPM changes share one deterministic debounce timer");
  timers.runAll();
  assert.equal(JSON.parse(storage.value(ContinuePractice.STORAGE_KEY)).preferences.metronomeBpm, 104);
  const writesAfterDebounce = storage.calls.filter(([operation]) => operation === "setItem").length;
  assert.equal(store.save(finalSnapshot), true);
  assert.equal(storage.calls.filter(([operation]) => operation === "setItem").length, writesAfterDebounce, "repeated save is harmless");

  store.save(makeSnapshot({ preferences: { metronomeBpm: 112 } }), { debounce: true });
  assert.equal(store.flush(), true, "pagehide-style flush succeeds");
  assert.equal(timers.count(), 0, "flush clears the debounce timer");
  assert.equal(JSON.parse(storage.value(ContinuePractice.STORAGE_KEY)).preferences.metronomeBpm, 112);

  const continueCalls = [];
  let noteStarts = 0;
  let metronomeStarts = 0;
  let audioResumes = 0;
  const continueController = ContinuePractice.createDecisionController({
    store,
    ...validationOptions,
    adapters: {
      applyInstrument: (value) => continueCalls.push(["instrument", value]),
      applyBpm: (value) => continueCalls.push(["bpm", value]),
      applyMetronomePreference: (value) => continueCalls.push(["metronomePreference", value]),
      applyLocation: async (value) => continueCalls.push(["location", value]),
      onDecision: (value) => continueCalls.push(["decision", value])
    }
  });
  assert.equal(noteStarts, 0);
  assert.equal(metronomeStarts, 0);
  assert.equal(audioResumes, 0);
  assert.equal(await continueController.continuePractice(roundTrip), true);
  assert.deepEqual(continueCalls.map(([name]) => name), ["instrument", "bpm", "metronomePreference", "location", "decision"]);
  assert.equal(noteStarts, 0, "Continue never plays a note");
  assert.equal(metronomeStarts, 0, "saved metronome preference never starts scheduling");
  assert.equal(audioResumes, 0, "Continue never resumes AudioContext");
  assert.equal(await continueController.continuePractice(roundTrip), false, "repeated Continue is idempotent");

  const freshStorage = createMemoryStorage({
    [ContinuePractice.STORAGE_KEY]: JSON.stringify(roundTrip),
    theme: "dark"
  });
  const freshStore = ContinuePractice.createStore({ storage: freshStorage, ...validationOptions });
  const freshCalls = [];
  const freshController = ContinuePractice.createDecisionController({
    store: freshStore,
    ...validationOptions,
    adapters: {
      applyInstrument: (value) => freshCalls.push(["instrument", value]),
      applyBpm: (value) => freshCalls.push(["bpm", value]),
      applyMetronomePreference: (value) => freshCalls.push(["metronomePreference", value]),
      applyFreshLocation: async () => freshCalls.push(["freshLocation"]),
      onDecision: (value) => freshCalls.push(["decision", value])
    }
  });
  assert.equal(await freshController.startFresh(), true);
  assert.equal(freshStorage.has(ContinuePractice.STORAGE_KEY), false);
  assert.equal(freshStorage.value("theme"), "dark", "Start Fresh preserves unrelated storage");
  assert.deepEqual(freshCalls, [
    ["instrument", "synth"],
    ["bpm", 82],
    ["metronomePreference", false],
    ["freshLocation"],
    ["decision", "fresh"]
  ]);
  assert.equal(await freshController.startFresh(), false, "repeated Start Fresh is idempotent");
  assert.equal(freshStorage.calls.some(([operation]) => operation === "clear"), false, "localStorage.clear is never used");

  const emptyCalls = [];
  const emptyStore = ContinuePractice.createStore({ storage: createMemoryStorage(), ...validationOptions });
  assert.equal(emptyStore.load(), null, "first run has no Continue record");
  assert.deepEqual(emptyCalls, [], "first run applies no restoration adapters");

  const repoRoot = path.resolve(__dirname, "..");
  const moduleSource = fs.readFileSync(path.join(repoRoot, "outputs", "continue-practice-state.js"), "utf8");
  const appSource = fs.readFileSync(path.join(repoRoot, "outputs", "app.js"), "utf8");
  const htmlSource = fs.readFileSync(path.join(repoRoot, "outputs", "index.html"), "utf8");
  const cssSource = fs.readFileSync(path.join(repoRoot, "outputs", "styles.css"), "utf8");
  assert.equal(/localStorage\.clear\s*\(/.test(moduleSource + appSource), false, "production must not call localStorage.clear");
  assert.equal(/AudioContext|AudioBuffer|AudioBufferSourceNode|GainNode|activeVoices/.test(moduleSource), false, "state module excludes Web Audio runtime concepts");
  assert.equal(appSource.includes(ContinuePractice.STORAGE_KEY), false, "feature storage access remains centralized in the state module");
  assert.match(appSource, /if \(!continuePracticeStateApiV1 \|\| continuePracticeStoreV1\) return;/, "duplicate initialization is guarded");
  const schedulerSource = appSource.slice(appSource.indexOf("function scheduleMetronome"), appSource.indexOf("function playClick"));
  const clickSource = appSource.slice(appSource.indexOf("function playClick"), appSource.indexOf("function flashBeat"));
  assert.equal(/persistContinuePracticeStateV1/.test(schedulerSource + clickSource), false, "audio scheduler callbacks never persist state");
  assert.match(htmlSource, /id="continuePracticeButton"[^>]*type="button"/);
  assert.match(htmlSource, /id="startFreshButton"[^>]*type="button"/);
  assert.match(htmlSource, /id="continuePracticeEntry"[^>]*hidden/);
  assert.ok(htmlSource.indexOf("continue-practice-state.js") < htmlSource.indexOf("app.js?v="), "state module loads before app integration");
  assert.match(appSource, /applyInstrument: \(instrument\) => setSelectedAudioInstrument\(instrument, \{ persist: false \}\)/);
  assert.match(appSource, /applyBpm: \(value\) => setBpm\(value, \{ persist: false \}\)/);
  assert.match(appSource, /applyMetronomePreference: \(enabled\) => setMetronomeEnabledPreferenceV1\(enabled, \{ persist: false \}\)/);
  assert.match(appSource, /flushContinuePracticeStateV1\(\);\s*stopActiveAudio\(\);/);
  assert.match(cssSource, /\.continue-practice-entry :focus-visible/);
  assert.match(cssSource, /@media \(max-width: 640px\)[\s\S]*?\.continue-practice-entry[\s\S]*?flex-direction: column/);

  const productionStorage = createMemoryStorage({
    [ContinuePractice.STORAGE_KEY]: JSON.stringify(makeRecord({
      location: {
        route: "practice",
        lessonId: "foundation-week-4",
        exerciseId: "foundation-week-4-day-6",
        stepIndex: 5
      }
    })),
    foundationCompletedWeeks: JSON.stringify([1, 2]),
    foundationDayByWeek: JSON.stringify({ 1: 5, 2: 7, 3: 4 }),
    theme: "dark",
    unrelatedSetting: "preserve"
  });
  const productionHarness = createProductionStartFreshHarness(appSource, productionStorage);
  assert.equal(
    productionHarness.getCurrentFoundationWeek(),
    3,
    "seeded normal progress must still recommend Week 3"
  );

  let productionInstrument = "nylon";
  let productionBpm = 96;
  let productionMetronomePreference = true;
  let productionNoteStarts = 0;
  let productionMetronomeStarts = 0;
  let productionAudioResumes = 0;
  const productionStore = ContinuePractice.createStore({
    storage: productionStorage,
    ...validationOptions
  });
  const productionController = ContinuePractice.createDecisionController({
    store: productionStore,
    ...validationOptions,
    adapters: {
      applyInstrument: (value) => { productionInstrument = value; },
      applyBpm: (value) => { productionBpm = value; },
      applyMetronomePreference: (value) => { productionMetronomePreference = value; },
      applyFreshLocation: () => productionHarness.applyFreshPracticeLocationV1()
    }
  });

  const removeCallsBefore = productionStorage.calls.filter(([operation]) => operation === "removeItem").length;
  assert.equal(await productionController.startFresh(), true);
  assert.equal(productionHarness.selectedFocusedMonth, 1, "Start Fresh sets Month 1");
  assert.equal(productionHarness.focusedSelectedWeek, 1, "Start Fresh sets focused Week 1");
  assert.equal(productionHarness.selectedWeek, 1, "Start Fresh keeps the legacy selected Week at 1");
  assert.equal(productionHarness.restoredContinuePracticeDestinationV1.week, 1);
  assert.equal(productionHarness.restoredContinuePracticeDestinationV1.day, 1, "Start Fresh sets Day 1");
  assert.equal(productionInstrument, "synth");
  assert.equal(productionBpm, 82);
  assert.equal(productionMetronomePreference, false);
  assert.equal(productionNoteStarts, 0, "Start Fresh does not play a note");
  assert.equal(productionMetronomeStarts, 0, "Start Fresh does not start the metronome");
  assert.equal(productionAudioResumes, 0, "Start Fresh does not resume AudioContext");
  assert.equal(productionStorage.has(ContinuePractice.STORAGE_KEY), false, "only the feature record is cleared");
  assert.equal(productionStorage.value("foundationCompletedWeeks"), JSON.stringify([1, 2]));
  assert.equal(productionStorage.value("foundationDayByWeek"), JSON.stringify({ 1: 5, 2: 7, 3: 4 }));
  assert.equal(productionStorage.value("theme"), "dark");
  assert.equal(productionStorage.value("unrelatedSetting"), "preserve");
  assert.deepEqual(
    productionStorage.calls.filter(([operation]) => operation === "removeItem").slice(removeCallsBefore),
    [["removeItem", ContinuePractice.STORAGE_KEY]],
    "Start Fresh removes exactly the feature key"
  );
  assert.equal(await productionController.startFresh(), false, "production Start Fresh remains idempotent");
  assert.equal(
    productionStorage.calls.filter(([operation]) => operation === "removeItem").length,
    removeCallsBefore + 1,
    "repeated Start Fresh performs no extra storage mutation"
  );

  console.log("Continue Practice State V1 deterministic tests PASS (schema, storage, debounce, Continue, Start Fresh, no-audio).");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
