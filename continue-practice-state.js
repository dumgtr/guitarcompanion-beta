(function attachContinuePracticeStateV2(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) {
    root.GuitarCompanionContinuePracticeV2 = api;
    root.GuitarCompanionContinuePracticeV1 = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createContinuePracticeStateV2() {
  "use strict";

  const STORAGE_KEY = "guitarCompanion.continuePractice.v1";
  const SCHEMA_VERSION = 2;
  const DEFAULT_PREFERENCES = Object.freeze({
    instrument: "synth",
    metronomeBpm: 82,
    metronomeEnabled: false
  });
  const ALLOWED_ROUTES = Object.freeze(["dashboard", "lessons", "practice"]);
  const ALLOWED_INSTRUMENTS = Object.freeze(["synth", "nylon", "electric"]);
  const ALLOWED_MNEMONIC_MODES = Object.freeze(["food_en", "takadimi", "counting", "food_th"]);

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function sanitizeBlockState(candidate) {
    if (!isPlainObject(candidate)) return {};
    const sanitized = {};
    for (const [blockId, state] of Object.entries(candidate)) {
      if (typeof blockId !== "string" || !blockId || !isPlainObject(state)) continue;
      if (blockId === "w2-rhythm-geometry-16th-syncopation") {
        const mode = typeof state.mnemonicMode === "string" ? state.mnemonicMode.trim() : "";
        if (ALLOWED_MNEMONIC_MODES.includes(mode)) {
          sanitized[blockId] = { mnemonicMode: mode };
        }
      }
    }
    return sanitized;
  }

  function normalizeCatalog(catalog) {
    if (!isPlainObject(catalog) || !Array.isArray(catalog.lessons)) return null;
    const lessons = new Map();

    for (const lesson of catalog.lessons) {
      if (!isPlainObject(lesson) || typeof lesson.id !== "string" || !lesson.id) return null;
      const exercises = new Map();
      for (const exercise of Array.isArray(lesson.exercises) ? lesson.exercises : []) {
        if (
          !isPlainObject(exercise)
          || typeof exercise.id !== "string"
          || !exercise.id
          || !Number.isInteger(exercise.stepIndex)
          || exercise.stepIndex < 0
        ) return null;
        exercises.set(exercise.id, {
          id: exercise.id,
          label: typeof exercise.label === "string" ? exercise.label : "",
          stepIndex: exercise.stepIndex
        });
      }
      lessons.set(lesson.id, {
        id: lesson.id,
        label: typeof lesson.label === "string" ? lesson.label : "",
        exercises
      });
    }

    return lessons.size ? lessons : null;
  }

  function isValidIsoTimestamp(value) {
    if (typeof value !== "string" || !value) return false;
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) && new Date(timestamp).toISOString() === value;
  }

  function migrateV1Record(candidate) {
    if (!isPlainObject(candidate) || candidate.schemaVersion !== 1) return candidate;
    const lessonMatch = /^foundation-week-([1-4])$/.exec(String(candidate?.location?.lessonId || ""));
    const weekNum = lessonMatch ? Number(lessonMatch[1]) : 1;
    return {
      schemaVersion: 2,
      updatedAt: candidate.updatedAt || new Date().toISOString(),
      location: {
        monthId: 1,
        weekId: weekNum,
        lessonId: candidate.location?.lessonId || `foundation-week-${weekNum}`,
        sectionId: null,
        blockId: null,
        route: candidate.location?.route || "dashboard",
        exerciseId: candidate.location?.exerciseId ?? null,
        stepId: candidate.location?.stepId ?? null,
        stepIndex: candidate.location?.stepIndex ?? null
      },
      blockState: {},
      preferences: {
        instrument: candidate.preferences?.instrument || DEFAULT_PREFERENCES.instrument,
        metronomeBpm: candidate.preferences?.metronomeBpm || DEFAULT_PREFERENCES.metronomeBpm,
        metronomeEnabled: Boolean(candidate.preferences?.metronomeEnabled)
      }
    };
  }

  function validateRecord(candidateRaw, options = {}) {
    const candidate = candidateRaw?.schemaVersion === 1 ? migrateV1Record(candidateRaw) : candidateRaw;
    const catalog = normalizeCatalog(options.catalog);
    const minBpm = Number(options.minBpm);
    const maxBpm = Number(options.maxBpm);
    if (!catalog || !Number.isFinite(minBpm) || !Number.isFinite(maxBpm) || minBpm > maxBpm) return null;
    if (!isPlainObject(candidate) || candidate.schemaVersion !== SCHEMA_VERSION) return null;
    if (!isValidIsoTimestamp(candidate.updatedAt) || !isPlainObject(candidate.location)) return null;

    const route = candidate.location.route;
    const lessonId = candidate.location.lessonId;
    const exerciseId = candidate.location.exerciseId ?? null;
    const stepId = candidate.location.stepId ?? null;
    const stepIndex = candidate.location.stepIndex ?? null;
    const monthId = Number.isInteger(candidate.location.monthId) && candidate.location.monthId >= 1 ? candidate.location.monthId : 1;
    const weekId = Number.isInteger(candidate.location.weekId) && candidate.location.weekId >= 1 ? candidate.location.weekId : 1;
    const sectionId = typeof candidate.location.sectionId === "string" && candidate.location.sectionId ? candidate.location.sectionId : null;
    const blockId = typeof candidate.location.blockId === "string" && candidate.location.blockId ? candidate.location.blockId : null;

    if (!ALLOWED_ROUTES.includes(route) || typeof lessonId !== "string") return null;

    const lesson = catalog.get(lessonId);
    if (!lesson) return null;
    if (exerciseId !== null && typeof exerciseId !== "string") return null;
    if (stepId !== null && typeof stepId !== "string") return null;
    if (stepIndex !== null && (!Number.isInteger(stepIndex) || stepIndex < 0)) return null;

    if (exerciseId === null) {
      if (stepIndex !== null || stepId !== null) return null;
    } else {
      const exercise = lesson.exercises.get(exerciseId);
      if (!exercise || exercise.stepIndex !== stepIndex || stepId !== null) return null;
    }

    const rawPreferences = candidate.preferences === undefined ? {} : candidate.preferences;
    if (!isPlainObject(rawPreferences)) return null;
    const instrument = rawPreferences.instrument ?? DEFAULT_PREFERENCES.instrument;
    const metronomeBpm = rawPreferences.metronomeBpm ?? DEFAULT_PREFERENCES.metronomeBpm;
    const metronomeEnabled = rawPreferences.metronomeEnabled ?? DEFAULT_PREFERENCES.metronomeEnabled;
    if (!ALLOWED_INSTRUMENTS.includes(instrument)) return null;
    if (!Number.isFinite(metronomeBpm) || metronomeBpm < minBpm || metronomeBpm > maxBpm) return null;
    if (typeof metronomeEnabled !== "boolean") return null;

    const blockState = sanitizeBlockState(candidate.blockState);

    return {
      schemaVersion: SCHEMA_VERSION,
      updatedAt: candidate.updatedAt,
      location: {
        monthId,
        weekId,
        lessonId,
        sectionId,
        blockId,
        route,
        exerciseId,
        stepId,
        stepIndex
      },
      blockState,
      preferences: {
        instrument,
        metronomeBpm,
        metronomeEnabled
      }
    };
  }

  function deserializeRecord(raw, options = {}) {
    try {
      const candidate = typeof raw === "string" ? JSON.parse(raw) : raw;
      return validateRecord(candidate, options);
    } catch {
      return null;
    }
  }

  function serializeSnapshot(snapshot, options = {}) {
    if (!isPlainObject(snapshot) || !isPlainObject(snapshot.location) || !isPlainObject(snapshot.preferences)) return null;
    const now = typeof options.now === "function" ? options.now : () => new Date();
    let updatedAt;
    try {
      const date = now();
      updatedAt = (date instanceof Date ? date : new Date(date)).toISOString();
    } catch {
      return null;
    }

    return validateRecord({
      schemaVersion: SCHEMA_VERSION,
      updatedAt,
      location: {
        monthId: snapshot.location.monthId ?? 1,
        weekId: snapshot.location.weekId ?? 1,
        lessonId: snapshot.location.lessonId,
        sectionId: snapshot.location.sectionId ?? null,
        blockId: snapshot.location.blockId ?? null,
        route: snapshot.location.route,
        exerciseId: snapshot.location.exerciseId ?? null,
        stepId: snapshot.location.stepId ?? null,
        stepIndex: snapshot.location.stepIndex ?? null
      },
      blockState: snapshot.blockState || {},
      preferences: {
        instrument: snapshot.preferences.instrument,
        metronomeBpm: snapshot.preferences.metronomeBpm,
        metronomeEnabled: snapshot.preferences.metronomeEnabled
      }
    }, options);
  }

  function recordSignature(record) {
    if (!record) return "";
    return JSON.stringify({ location: record.location, blockState: record.blockState, preferences: record.preferences });
  }

  function createStore(options = {}) {
    const storage = options.storage;
    const key = options.key || STORAGE_KEY;
    const debounceMs = Number.isFinite(options.debounceMs) ? Math.max(0, options.debounceMs) : 180;
    const setTimer = options.setTimer || ((callback, delay) => setTimeout(callback, delay));
    const clearTimer = options.clearTimer || ((timer) => clearTimeout(timer));
    const validationOptions = {
      catalog: options.catalog,
      minBpm: options.minBpm,
      maxBpm: options.maxBpm,
      now: options.now
    };
    let timer = null;
    let pendingSnapshot = null;
    let lastSignature = "";

    function removeExactKey() {
      try {
        if (!storage || typeof storage.removeItem !== "function") return false;
        storage.removeItem(key);
        lastSignature = "";
        return true;
      } catch {
        return false;
      }
    }

    function load() {
      let raw;
      try {
        if (!storage || typeof storage.getItem !== "function") return null;
        raw = storage.getItem(key);
      } catch {
        return null;
      }
      if (raw === null || raw === undefined || raw === "") return null;
      const record = deserializeRecord(raw, validationOptions);
      if (!record) {
        removeExactKey();
        return null;
      }
      lastSignature = recordSignature(record);
      return record;
    }

    function write(snapshot) {
      const record = serializeSnapshot(snapshot, validationOptions);
      if (!record) return false;
      const signature = recordSignature(record);
      if (signature === lastSignature) return true;
      try {
        if (!storage || typeof storage.setItem !== "function") return false;
        storage.setItem(key, JSON.stringify(record));
        lastSignature = signature;
        return true;
      } catch {
        return false;
      }
    }

    function flush() {
      if (timer !== null) {
        clearTimer(timer);
        timer = null;
      }
      if (!pendingSnapshot) return true;
      const snapshot = pendingSnapshot;
      pendingSnapshot = null;
      return write(snapshot);
    }

    function save(snapshot, saveOptions = {}) {
      if (!saveOptions.debounce) return write(snapshot);
      pendingSnapshot = snapshot;
      if (timer !== null) clearTimer(timer);
      timer = setTimer(() => {
        timer = null;
        const latest = pendingSnapshot;
        pendingSnapshot = null;
        if (latest) write(latest);
      }, debounceMs);
      return true;
    }

    function clear() {
      if (timer !== null) clearTimer(timer);
      timer = null;
      pendingSnapshot = null;
      return removeExactKey();
    }

    return Object.freeze({ key, load, save, flush, clear });
  }

  function createDecisionController(options = {}) {
    const store = options.store;
    const adapters = options.adapters || {};
    const validationOptions = {
      catalog: options.catalog,
      minBpm: options.minBpm,
      maxBpm: options.maxBpm
    };
    let decisionPending = false;
    let decisionComplete = false;

    async function continuePractice(record) {
      if (decisionPending || decisionComplete) return false;
      const validated = validateRecord(record, validationOptions);
      if (!validated) return false;
      decisionPending = true;
      try {
        adapters.applyInstrument?.(validated.preferences.instrument);
        adapters.applyBpm?.(validated.preferences.metronomeBpm);
        adapters.applyMetronomePreference?.(validated.preferences.metronomeEnabled);
        await adapters.applyLocation?.(validated.location);
        decisionComplete = true;
        adapters.onDecision?.("continue", validated);
        return true;
      } catch {
        return false;
      } finally {
        decisionPending = false;
      }
    }

    async function startFresh() {
      if (decisionPending || decisionComplete) return false;
      decisionPending = true;
      try {
        store?.clear?.();
        adapters.applyInstrument?.(DEFAULT_PREFERENCES.instrument);
        adapters.applyBpm?.(DEFAULT_PREFERENCES.metronomeBpm);
        adapters.applyMetronomePreference?.(DEFAULT_PREFERENCES.metronomeEnabled);
        await adapters.applyFreshLocation?.();
        decisionComplete = true;
        adapters.onDecision?.("fresh", null);
        return true;
      } catch {
        return false;
      } finally {
        decisionPending = false;
      }
    }

    return Object.freeze({ continuePractice, startFresh });
  }

  return Object.freeze({
    STORAGE_KEY,
    SCHEMA_VERSION,
    DEFAULT_PREFERENCES,
    ALLOWED_ROUTES,
    ALLOWED_INSTRUMENTS,
    validateRecord,
    deserializeRecord,
    serializeSnapshot,
    createStore,
    createDecisionController
  });
});
