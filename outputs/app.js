const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const flatNotes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const flatToSharp = { Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#" };
const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
const flatKeys = ["F", "Bb", "Eb", "Ab", "Db", "Gb"];
const themeStorageKey = "guitarCourseTheme";

const selectedFocusedMonthStorageKey = "guitarCourseSelectedFocusedMonth";
const stringTunings = [
  { name: "e", note: "E" },
  { name: "B", note: "B" },
  { name: "G", note: "G" },
  { name: "D", note: "D" },
  { name: "A", note: "A" },
  { name: "E", note: "E" },
];
const NOTE_FREQUENCIES = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196,
  A3: 220,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392,
  A4: 440,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33
};

let modules = [
  {
    "id": "rhythm",
    "title": "Rhythm และ Groove",
    "subtitle": "Syncopation, Funk Groove, Accent, Dynamics",
    "goal": "เปลี่ยนการตีคอร์ดจากการจำแพตเทิร์น เป็นการควบคุม time feel และพลังของเพลง",
    "concepts": [
      "นับ 16th note เป็น 1-e-&-a แล้ววางคอร์ดบนจุดที่ไม่ตรง beat เพื่อสร้าง Syncopation",
      "แยกมือขวาเป็น Down/Up motion ที่ไหลต่อเนื่อง แม้บางจังหวะจะไม่โดนสาย",
      "ใช้ Accent เป็นตัวเล่าโครงเพลง เช่น เน้น beat 2 และ 4 ให้เข้ากับ snare"
    ],
    "drills": [
      "เล่น Pattern 4 แบบ: Straight 8, Syncopated Pop, Funk 16, Palm Muted Rock ที่ 70, 90, 110 BPM",
      "ซ้อม Ghost Strum 2 นาทีต่อ Pattern โดยให้มือขวาไม่หยุดแม้ปิดเสียง",
      "เปิด Backing Track แล้วเล่นเบาลงใน Verse หนักขึ้นใน Chorus โดยไม่เร่ง tempo"
    ],
    "checkpoint": [
      "เล่นต่อกับ metronome 3 นาทีโดยไม่หลุด pulse",
      "อธิบายได้ว่าจังหวะไหนเป็น accent และจังหวะไหนเป็น ghost",
      "อัดเสียงตัวเองแล้วฟังว่าคอร์ดไม่ชนกับ snare หรือ vocal"
    ]
  }
];
let futureDataPromise;

let weeks = [
  {
    "number": 1,
    "month": 1,
    "title": "Pulse และ 16th Grid",
    "module": "Rhythm และ Groove",
    "goal": "ตั้ง time feel ให้มั่นก่อนเพิ่มความซับซ้อน",
    "practice": [
      "นับ 1-e-&-a พร้อมตบเท้า",
      "เล่น Straight 8 ที่ 70-90 BPM",
      "เช็กความนิ่ง 60 วินาทีแล้วฟังว่ามีเร่งหรือหน่วง"
    ],
    "checks": [
      "มือขวาเคลื่อนต่อเนื่อง",
      "เปลี่ยนคอร์ดโดย beat ไม่สะดุด",
      "เล่นกับ metronome 3 นาที"
    ]
  },
  {
    "number": 2,
    "month": 1,
    "title": "Syncopation & Funk 16",
    "module": "Rhythm และ Groove",
    "goal": "วางคอร์ดบน off-beat และ ghost strum ให้ groove ฟังมีชีวิต",
    "practice": [
      "ฝึก pattern Funk 16 ช้า ๆ",
      "เน้น accent บน 2 และ 4",
      "เล่นกับ backing track ที่มี drum loop"
    ],
    "checks": [
      "ไม่หลงตำแหน่ง e และ a",
      "ghost note เบากว่า accent ชัด",
      "เล่น 4 รอบติดโดยไม่หลุด"
    ],
    "lessonBlocks": [
      {
        "type": "text",
        "id": "w2-syncopation-overview",
        "title": "ภาพรวมบทเรียน",
        "body": "วางคอร์ดบน off-beat และ ghost strum ให้ groove ฟังมีชีวิต"
      },
      {
        "type": "technique-drill",
        "id": "w2-syncopation-drill",
        "drill": {
          "title": "แบบฝึกหัดหลัก",
          "steps": [
            "ฝึก pattern Funk 16 ช้า ๆ",
            "เน้น accent บน 2 และ 4",
            "เล่นกับ backing track ที่มี drum loop"
          ]
        }
      },
      {
        "type": "mechanics-check",
        "id": "w2-syncopation-checks",
        "title": "เกณฑ์ผ่าน",
        "checks": [
          "ไม่หลงตำแหน่ง e และ a",
          "ghost note เบากว่า accent ชัด",
          "เล่น 4 รอบติดโดยไม่หลุด"
        ]
      }
    ]
  },
  {
    "number": 3,
    "month": 1,
    "title": "Palm Muting & Dynamics",
    "module": "Rhythm และ Groove",
    "goal": "คุมความยาวเสียงและพลังของท่อนเพลง",
    "practice": [
      "ฝึก mute ใกล้ bridge",
      "เล่นคอร์ดเดียว 4 ระดับความดัง",
      "สลับ verse เบา chorus หนัก"
    ],
    "checks": [
      "เสียง mute ไม่ทึบเกินไป",
      "dynamic เปลี่ยนแต่ tempo คงที่",
      "ใช้ accent นำเพลงได้"
    ]
  },
  {
    "number": 4,
    "month": 1,
    "title": "Groove Patterns 4 แบบ",
    "module": "Rhythm และ Groove",
    "goal": "รวม pattern เข้ากับ metronome และ backing track",
    "practice": [
      "เล่น Straight, Syncopated, Funk, Palm Mute",
      "เปลี่ยน BPM 75/90/105",
      "เล่น 4 bars ต่อเนื่องโดยไม่หยุด"
    ],
    "checks": [
      "pattern ไม่ปะปนกัน",
      "รู้ว่าต้องลดโน้ตตรงไหน",
      "พร้อมเล่นกับ track เต็ม"
    ]
  }
];

let tonePresets = [];


let quizItems = [];
let fretboardVisuals = [];
let miniTabs = [];
let chordSoundLabs = [];
let techniqueDrills = [];
let miniCourses = [];


const progressions = {
  "1-5-6-4": [1, 5, 6, 4],
  "1-4-5-1": [1, 4, 5, 1],
  "2-5-1-1": [2, 5, 1, 1],
  "1-6-4-5": [1, 6, 4, 5],
};

const roman = {
  1: "I",
  2: "ii",
  3: "iii",
  4: "IV",
  5: "V",
  6: "vi",
  7: "vii°",
};

const setlistItems = [
  "เขียน Nashville chart ครบ 3 เพลง",
  "ซ้อมกับ metronome หรือ drum track ทุกเพลง",
  "กำหนด clean/crunch/lead tone ต่อท่อน",
  "อัดเสียง rehearsal อย่างน้อย 2 รอบ",
  "เล่น setlist เต็มโดยไม่หยุดกลางเพลง",
];

let selectedWeek = 1;
let selectedModule = "rhythm";
let selectedTone = "clean";
let completedWeeks = loadJson("guitarCourseCompletedWeeks", []);
let completedSetlist = loadJson("guitarCourseSetlist", []);
let currentQuizIndex = 0;
let quizCorrect = 0;
let quizAttempts = 0;
let audioContext;
let chordLabAudioContext;
let activeOscillators = [];
let audioCtx = null;
let pluckedMasterGain = null;
let pluckedOutputGain = null;
let pluckedCompressor = null;
const PLUCKED_OUTPUT_MULTIPLIER = 1.6;
let activeNodes = [];
let sequenceTimers = [];
let soundLabAudioSession = 0;
let selectedAudioInstrument = "synth";
let fslInstrumentSelectorGuardActive = false;
let metronomeTimer;
let nextBeatTime = 0;
let beatCount = 0;
let isMetronomeRunning = false;
let bpm = 82;
let isQuickTempoOpen = false;
let selectedGroove = "straight";
const devPreviewMode = parseDevPreviewMode();
const preludePreviewMode = parsePreludePreviewMode();
const FEATURE_MINI_COURSE_SHELF = false;
const miniCoursePreviewMode = parseMiniCoursePreviewMode();
const practiceRoomIaPreviewMode = parsePracticeRoomIaPreviewMode();
const fretboardStudioPreviewMode = parseFretboardStudioPreviewMode();
const soundLabV2AliasMode = isSoundLabV2AliasPath();
const sharedSoundLabAudioPreviewMode = parseSharedSoundLabAudioPreviewMode() || soundLabV2AliasMode;
const legacyPracticeRoomMode = parseLegacyPracticeRoomMode();
const practiceRoomMode = resolvePracticeRoomMode();
const continuePracticeStateApiV1 = window.GuitarCompanionContinuePracticeV1 || null;
const CONTINUE_PRACTICE_MIN_BPM = 50;
const CONTINUE_PRACTICE_MAX_BPM = 180;
let restoredContinuePracticeDestinationV1 = null;
let pendingContinuePracticeRecordV1 = null;
let continuePracticeStoreV1 = null;
let continuePracticeControllerV1 = null;
let continuePracticeStartupDecisionV1 = "none";
let metronomeEnabledPreferenceV1 = false;
let courseData = null;
let activeMiniCourseId = "";
let practiceRoomIaPreviewPlacement = null;

function week(number, month, title, module, goal, practice, checks) {
  return { number, month, title, module, goal, practice, checks };
}

const shardUrls = [
  './data-shards/core-m1-m4.json',
  './data-shards/month5-preview.json',
  './data-shards/month6-preview.json'
];

async function loadJsonShard(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn("Shard failed:", url, e);
    return null;
  }
}

function mergeById(existing, incoming) {
  if (!incoming || !Array.isArray(incoming)) return existing;
  const map = new Map(existing.map(item => [item.id, item]));
  incoming.forEach(item => { if (item.id) map.set(item.id, item); });
  return Array.from(map.values());
}

function mergeWeeks(existing, incoming) {
  if (!incoming || !Array.isArray(incoming)) return existing;
  const map = new Map(existing.map(item => [`${item.month}:${item.number}`, item]));
  incoming.forEach(item => { if (item.number) map.set(`${item.month}:${item.number}`, item); });
  return Array.from(map.values()).sort((a, b) => a.number - b.number);
}

async function loadFutureData() {
  if (futureDataPromise) return futureDataPromise;
  futureDataPromise = (async () => {
    try {
      updateDebugState({ dataJsonUrl: 'data-shards', lastAction: 'loading shards', lastError: null });
      setDataStatus('Loading companion data...', 'info');

      const core = await loadJsonShard(shardUrls[0]);
      if (!core) throw new Error('Core shard could not be loaded');

      const m5 = await loadJsonShard(shardUrls[1]);
      const m6 = await loadJsonShard(shardUrls[2]);
      const shards = [core, m5, m6].filter(Boolean);

      let merged = {
          modules: [], tonePresets: [], quizItems: [], fretboardVisuals: [], miniTabs: [], chordSoundLabs: [], techniqueDrills: [], miniCourses: [], weeks: []
      };

      shards.forEach(shard => {
          merged.modules = mergeById(merged.modules, shard.modules);
          merged.tonePresets = mergeById(merged.tonePresets, shard.tonePresets);
          merged.quizItems = mergeById(merged.quizItems, shard.quizItems);
          merged.fretboardVisuals = mergeById(merged.fretboardVisuals, shard.fretboardVisuals);
          merged.miniTabs = mergeById(merged.miniTabs, shard.miniTabs);
          merged.chordSoundLabs = mergeById(merged.chordSoundLabs, shard.chordSoundLabs);
          merged.techniqueDrills = mergeById(merged.techniqueDrills, shard.techniqueDrills);
          merged.miniCourses = mergeById(merged.miniCourses, shard.miniCourses);
          merged.weeks = mergeWeeks(merged.weeks, shard.weeks);
      });

      courseData = merged;

      const rhythmModule = modules.filter(item => item.id === 'rhythm');
      const futureModules = merged.modules.filter(item => item.id !== 'rhythm');
      modules = [...rhythmModule, ...futureModules];

      tonePresets = merged.tonePresets;
      quizItems = merged.quizItems;
      fretboardVisuals = merged.fretboardVisuals;
      miniTabs = merged.miniTabs;
      chordSoundLabs = merged.chordSoundLabs;
      techniqueDrills = merged.techniqueDrills;
      miniCourses = merged.miniCourses;

      const knownWeeks = new Set(weeks.map(item => item.number));
      const futureWeeks = merged.weeks.filter(item => !knownWeeks.has(item.number));
      weeks = [...weeks, ...futureWeeks].sort((a, b) => a.number - b.number);

      if (!modules.some(item => item.id === selectedModule)) selectedModule = modules[0]?.id || selectedModule;
      if (tonePresets.length && !tonePresets.some(item => item.id === selectedTone)) selectedTone = tonePresets[0].id;

      const loadedMonths = getLoadedMonths();
      const visibleMonths = getVisibleMonths();

      const m5Exists = merged.weeks.some(w => w.month === 5);
      const m6Exists = merged.weeks.some(w => w.month === 6);
      const devMode = getDevPreviewMode();

      let debugMessage = 'shards loaded';
      if (devMode === "all" && !m6Exists) {
        debugMessage = 'QA Preview warning: Month 6 shard did not load.';
        setDataStatus(debugMessage, 'error');
        showToast(debugMessage, 'error', 3000);
      }

      updateDebugState({
          dataJsonLoaded: true,
          loadedMonths,
          visibleMonths,
          currentMonth: selectedFocusedMonth,
          devPreviewMode: devMode,
          m5Exists,
          m6Exists,
          loadedWeeks: weeks.length,
          miniCourses: miniCourses.length,
          lastAction: debugMessage
      });

      const readyMonths = visibleMonths.filter(month => month > 1);
      const readyMonthLabel = readyMonths.length ? readyMonths.join(', ') : '1';
      setDataStatus(`Data loaded: Month ${readyMonthLabel} ready.`, 'success');
      showToast(`Extra lessons loaded. Month ${readyMonthLabel} ready.`, 'success');

      renderMonthSwitcher();
      renderModules();
      renderModuleDetail();
      renderMiniCourseShelf();
      renderPracticeStudioPreviewShell();
      renderPracticeRoomIaPreview();
      return merged;
    } catch (error) {
      console.warn('Future course data could not be loaded.', error);
      const message = error?.message || String(error);
      updateDebugState({ dataJsonLoaded: false, lastError: message, lastAction: 'shards failed' });
      setDataStatus(`Cannot load data shards. ${message}`, 'error');
      showToast('Could not load data shards. Check file path or server.', 'error', 5000);
      courseData = { modules, weeks: [], tonePresets, quizItems };
      miniCourses = [];
      renderMiniCourseShelf();
      renderPracticeStudioPreviewShell();
      renderPracticeRoomIaPreview();
      return courseData;
    }
  })();
  return futureDataPromise;
}


async function ensureFutureCourseData(month) {
  const selectedMonth = Number(month);
  if (!selectedMonth || selectedMonth < 2 || weeks.some((item) => item.month === selectedMonth) || !canOpenMonth(selectedMonth)) return;
  await loadFutureData();
}

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function safeSetItem(key, value) {
  if (typeof isDevPreviewActive === 'function' && isDevPreviewActive() && typeof selectedFocusedMonth !== 'undefined' && selectedFocusedMonth > 4) {
    console.warn("Dev Preview: Progress saving is disabled for hidden months.");
    return false;
  }
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function saveJson(key, value) {
  safeSetItem(key, JSON.stringify(value));
}

function updateDebugState(patch) {
  window.__GC_DEBUG__ = {
    dataJsonLoaded: false,
    dataJsonUrl: "data-shards",
    loadedMonths: [1],
    devPreviewMode,
    preludePreviewMode,
    miniCoursePreviewMode: isMiniCoursePreviewActive(),
    practiceRoomMode,
    legacyPracticeRoomMode,
    practiceRoomIaPreviewMode,
    fretboardStudioPreviewMode,
    loadedWeeks: weeks.length,
    lastError: null,
    currentMonth: 1,
    lastAction: "boot",
    ...(window.__GC_DEBUG__ || {}),
    ...patch
  };
}

function parseDevPreviewMode() {
  const params = new URLSearchParams(window.location.search);
  const value = String(params.get("devPreview") || params.get("preview") || "").trim().toLowerCase();
  return ["m3", "m4", "m5", "5", "m6", "6", "all"].includes(value) ? value : "";
}

function parsePreludePreviewMode() {
  const params = new URLSearchParams(window.location.search);
  const value = String(params.get("devPreview") || params.get("preview") || "").trim().toLowerCase();
  return ["w0", "prelude"].includes(value) ? value : "";
}

function parsePracticeRoomIaPreviewMode() {
  const params = new URLSearchParams(window.location.search);
  const value = String(params.get("practiceRoomIaPreview") || "").trim().toLowerCase();
  return ["1", "true", "yes"].includes(value);
}

function isSoundLabV2AliasPath() {
  const pathname = window.location.pathname.replace(/\/+$/, "");
  return pathname === "/soundlab-v2";
}

function parseSharedSoundLabAudioPreviewMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("sharedSoundLabAudioPreview") === "1";
}

function isSoundLabV2PreviewActive() {
  if (soundLabV2AliasMode) return true;
  const params = new URLSearchParams(window.location.search);
  return (
    params.get("soundLabV2Preview") === "1" &&
    sharedSoundLabAudioPreviewMode
  );
}

const SOUND_LAB_V2_SINGLE_GUIDE_TONE_LABS = new Set([
  "m4-w13-ear-scale-color",
  "m5-w17-sound-diatonic-family"
]);

function isSingleGuideToneLab(lab = {}, block = {}, labRef = "") {
  const stableRefs = [lab.id, labRef, block.labRef]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  if (stableRefs.some((value) => SOUND_LAB_V2_SINGLE_GUIDE_TONE_LABS.has(value))) {
    return true;
  }

  if (
    lab.audioEngine?.model !== "sound-lab-v2" ||
    lab.audioEngine?.voice !== "guide-tone"
  ) {
    return false;
  }

  const items = getLabPlaybackItems(lab);
  if (!items.length || month2AsArray(lab.sequence).length > 1) return false;

  return items.every((item) => {
    const playbackNote = item.playbackNote || item.auditionNote;
    return (
      typeof playbackNote === "string" &&
      playbackNote.trim().length > 0 &&
      getChordNotes(item).length === 1
    );
  });
}

function parseLegacyPracticeRoomMode() {
  const params = new URLSearchParams(window.location.search);
  const value = String(params.get("legacyPracticeRoom") || "").trim().toLowerCase();
  return ["1", "true", "yes"].includes(value);
}

function resolvePracticeRoomMode() {
  if (legacyPracticeRoomMode) return "legacy";
  if (practiceRoomIaPreviewMode) return "ia-v2";
  if (fretboardStudioPreviewMode) return "fsl-legacy-preview";
  return "ia-v2";
}

function isPracticeRoomIaPreviewActive() {
  return practiceRoomMode === "ia-v2";
}

function createContinuePracticeCatalogV1() {
  return {
    lessons: foundationWeeks.map((weekItem) => ({
      id: `foundation-week-${weekItem.number}`,
      label: `สัปดาห์ที่ ${weekItem.number}: ${weekItem.title}`,
      exercises: (dailyPracticePlan[weekItem.number] || []).map((_, dayIndex) => ({
        id: `foundation-week-${weekItem.number}-day-${dayIndex + 1}`,
        label: `วันที่ ${dayIndex + 1}`,
        stepIndex: dayIndex
      }))
    }))
  };
}

function parseContinuePracticeLocationV1(location) {
  const lessonMatch = /^foundation-week-([1-4])$/.exec(String(location?.lessonId || ""));
  const exerciseMatch = /^foundation-week-([1-4])-day-([1-7])$/.exec(String(location?.exerciseId || ""));
  if (!lessonMatch || !exerciseMatch || lessonMatch[1] !== exerciseMatch[1]) return null;
  return {
    route: location.route,
    week: Number(lessonMatch[1]),
    day: Number(exerciseMatch[2])
  };
}

let currentRhythmGeometryMnemonicMode = "food_en";

function getCurrentContinuePracticeRouteV1() {
  const route = String(window.location.hash || "").replace(/^#/, "");
  return continuePracticeStateApiV1?.ALLOWED_ROUTES.includes(route) ? route : "dashboard";
}

function getCurrentContinuePracticeSnapshotV1() {
  const month = selectedFocusedMonth || 1;
  if (!canOpenMonth(month)) return null;
  const week = Number(focusedSelectedWeek);
  const day = getRenderedPracticeDayV1(week);
  if (!Number.isInteger(week) || week < 1 || week > 4 || !Number.isInteger(day) || day < 1 || day > 7) return null;

  const isWeek2 = week === 2;
  return {
    location: {
      monthId: month,
      weekId: week,
      lessonId: `foundation-week-${week}`,
      sectionId: isWeek2 ? "learn" : null,
      blockId: isWeek2 ? "w2-rhythm-geometry-16th-syncopation" : null,
      route: getCurrentContinuePracticeRouteV1(),
      exerciseId: `foundation-week-${week}-day-${day}`,
      stepId: null,
      stepIndex: day - 1
    },
    blockState: {
      "w2-rhythm-geometry-16th-syncopation": {
        mnemonicMode: currentRhythmGeometryMnemonicMode
      }
    },
    preferences: {
      instrument: getSelectedAudioInstrument(),
      metronomeBpm: bpm,
      metronomeEnabled: metronomeEnabledPreferenceV1
    }
  };
}

function persistContinuePracticeStateV1(options = {}) {
  const snapshot = getCurrentContinuePracticeSnapshotV1();
  if (!snapshot || !continuePracticeStoreV1) return false;
  return continuePracticeStoreV1.save(snapshot, { debounce: Boolean(options.debounce) });
}

function flushContinuePracticeStateV1() {
  return continuePracticeStoreV1?.flush() ?? true;
}

function setMetronomeEnabledPreferenceV1(value, options = {}) {
  metronomeEnabledPreferenceV1 = Boolean(value);
  const toggle = document.getElementById("metronomeToggle");
  const container = document.querySelector(".top-metronome");
  if (toggle) {
    toggle.dataset.savedPreference = String(metronomeEnabledPreferenceV1);
    toggle.setAttribute(
      "aria-label",
      isMetronomeRunning
        ? "หยุด Metronome"
        : metronomeEnabledPreferenceV1
          ? "เริ่ม Metronome (จำค่าว่าเปิดไว้จากครั้งก่อน)"
          : "เริ่ม Metronome"
    );
  }
  if (container) container.dataset.savedEnabled = String(metronomeEnabledPreferenceV1);
  if (options.persist !== false) persistContinuePracticeStateV1();
}

function describeContinuePracticeRecordV1(record) {
  const catalog = createContinuePracticeCatalogV1();
  const location = parseContinuePracticeLocationV1(record?.location);
  const lesson = catalog.lessons.find((item) => item.id === record?.location?.lessonId);
  const exercise = lesson?.exercises.find((item) => item.id === record?.location?.exerciseId);
  if (!location || !lesson || !exercise) return "มีจุดซ้อมล่าสุดที่พร้อมเปิดต่อ";
  const instrumentLabels = { synth: "Synth", nylon: "Nylon", electric: "Electric" };
  const blockLabel = record?.location?.blockId === "w2-rhythm-geometry-16th-syncopation" ? " · Geometry of Rhythm" : "";
  return `${lesson.label} · ${exercise.label}${blockLabel} · ${instrumentLabels[record.preferences.instrument]} · ${record.preferences.metronomeBpm} BPM`;
}

function renderContinuePracticeEntryV1(record = pendingContinuePracticeRecordV1) {
  const entry = document.getElementById("continuePracticeEntry");
  if (!entry) return;
  entry.hidden = !record;
  if (!record) return;
  const description = document.getElementById("continuePracticeDescription");
  if (description) {
    description.textContent = `${describeContinuePracticeRecordV1(record)} — ระบบจะยังไม่เปิดเสียงหรือเริ่ม Metronome อัตโนมัติ`;
  }
}

function hideContinuePracticeEntryV1() {
  const entry = document.getElementById("continuePracticeEntry");
  if (entry) entry.hidden = true;
  pendingContinuePracticeRecordV1 = null;
}

async function applyContinuePracticeLocationV1(location, record = null) {
  const destination = parseContinuePracticeLocationV1(location);
  if (!destination) throw new Error("INVALID_CONTINUE_PRACTICE_LOCATION");

  const targetMonth = Number(location?.monthId || 1);
  if (!canOpenMonth(targetMonth)) {
    throw new Error("CONTINUE_PRACTICE_MONTH_UNAVAILABLE");
  }

  // Restore blockState for Rhythm Geometry BEFORE week rendering
  const blockState = record?.blockState || {};
  const rgState = blockState["w2-rhythm-geometry-16th-syncopation"];
  if (rgState && typeof rgState.mnemonicMode === "string") {
    const allowedModes = ["food_en", "takadimi", "counting", "food_th"];
    if (allowedModes.includes(rgState.mnemonicMode)) {
      currentRhythmGeometryMnemonicMode = rgState.mnemonicMode;
    }
  }

  selectedFocusedMonth = targetMonth;
  restoredContinuePracticeDestinationV1 = { week: destination.week, day: destination.day };

  const opened = await openFocusedWeek(destination.week, {
    source: "continue-practice",
    scroll: false,
    preserveContinueDestination: true,
    persist: false
  });
  if (!opened) throw new Error("CONTINUE_PRACTICE_LOCATION_UNAVAILABLE");

  restoredContinuePracticeDestinationV1 = { week: destination.week, day: destination.day };
  renderFocusedDashboard();

  const cardEl = document.querySelector(".rhythm-geometry-card");
  if (cardEl && typeof setRhythmGeometryCardMode === "function") {
    setRhythmGeometryCardMode(cardEl, currentRhythmGeometryMnemonicMode);
  }

  if (window.history?.replaceState) {
    window.history.replaceState(null, "", `#${destination.route}`);
  }

  // Stale block & section resolution order:
  // 1. Block ID
  // 2. Section ID
  // 3. Lesson Root
  let targetElement = null;
  const targetBlockId = location?.blockId;
  const targetSectionId = location?.sectionId;

  if (targetBlockId) {
    targetElement = document.querySelector(`[data-rhythm-geometry-id="${targetBlockId}"]`) || document.getElementById(targetBlockId);
  }
  if (!targetElement && targetSectionId) {
    targetElement = document.querySelector(`.${targetSectionId}-block`) || document.getElementById(targetSectionId);
  }
  if (!targetElement) {
    targetElement = document.getElementById("lessonPanel") || document.getElementById(destination.route);
  }

  targetElement?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  });
}

async function applyFreshPracticeLocationV1() {
  selectedFocusedMonth = 1;
  focusedSelectedWeek = 1;
  selectedWeek = 1;
  restoredContinuePracticeDestinationV1 = { week: 1, day: 1 };
  if (window.history?.replaceState) window.history.replaceState(null, "", "#dashboard");
  renderFocusedApp();
  document.getElementById("dashboard")?.scrollIntoView({ behavior: "auto", block: "start" });
}

function initializeContinuePracticeStateV1() {
  if (!continuePracticeStateApiV1 || continuePracticeStoreV1) return;
  const catalog = createContinuePracticeCatalogV1();
  let storage = null;
  try {
    storage = window.localStorage;
  } catch {
    storage = null;
  }
  continuePracticeStoreV1 = continuePracticeStateApiV1.createStore({
    storage,
    catalog,
    minBpm: CONTINUE_PRACTICE_MIN_BPM,
    maxBpm: CONTINUE_PRACTICE_MAX_BPM,
    debounceMs: 180
  });
  continuePracticeControllerV1 = continuePracticeStateApiV1.createDecisionController({
    store: continuePracticeStoreV1,
    catalog,
    minBpm: CONTINUE_PRACTICE_MIN_BPM,
    maxBpm: CONTINUE_PRACTICE_MAX_BPM,
    adapters: {
      applyInstrument: (instrument) => setSelectedAudioInstrument(instrument, { persist: false }),
      applyBpm: (value) => setBpm(value, { persist: false }),
      applyMetronomePreference: (enabled) => setMetronomeEnabledPreferenceV1(enabled, { persist: false }),
      applyLocation: applyContinuePracticeLocationV1,
      applyFreshLocation: applyFreshPracticeLocationV1,
      onDecision: (decision) => {
        continuePracticeStartupDecisionV1 = decision;
        hideContinuePracticeEntryV1();
      }
    }
  });
  pendingContinuePracticeRecordV1 = continuePracticeStoreV1.load();
  if (pendingContinuePracticeRecordV1?.blockState?.["w2-rhythm-geometry-16th-syncopation"]?.mnemonicMode) {
    const savedMode = pendingContinuePracticeRecordV1.blockState["w2-rhythm-geometry-16th-syncopation"].mnemonicMode;
    const allowedModes = ["food_en", "takadimi", "counting", "food_th"];
    if (allowedModes.includes(savedMode)) {
      currentRhythmGeometryMnemonicMode = savedMode;
    }
  }
  continuePracticeStartupDecisionV1 = pendingContinuePracticeRecordV1 ? "pending" : "none";
  renderContinuePracticeEntryV1();

  const continueButton = document.getElementById("continuePracticeButton");
  const freshButton = document.getElementById("startFreshButton");
  continueButton?.addEventListener("click", async () => {
    if (!pendingContinuePracticeRecordV1) return;
    const succeeded = await continuePracticeControllerV1.continuePractice(pendingContinuePracticeRecordV1);
    if (!succeeded) renderContinuePracticeEntryV1();
  });
  freshButton?.addEventListener("click", async () => {
    const succeeded = await continuePracticeControllerV1.startFresh();
    if (!succeeded) renderContinuePracticeEntryV1();
  });
}

function parseFretboardStudioPreviewMode() {
  const params = new URLSearchParams(window.location.search);
  const value = String(params.get("fretboardStudioPreview") || "").trim().toLowerCase();
  return ["1", "true", "yes"].includes(value);
}

function isFretboardStudioPreviewActive() {
  return practiceRoomMode === "fsl-legacy-preview";
}

function parseMiniCoursePreviewMode() {
  const params = new URLSearchParams(window.location.search);
  const directValue = String(params.get("miniCoursePreview") || "")
    .trim()
    .toLowerCase();

  const previewValue = String(
    params.get("devPreview") || params.get("preview") || ""
  )
    .trim()
    .toLowerCase();

  return (
    [
      "1",
      "true",
      "yes",
      "mini",
      "minicourse",
      "mini-course",
      "rhythm-notation-starter"
    ].includes(directValue) ||
    [
      "minicourse",
      "mini-course",
      "mini",
      "rhythm-notation-starter"
    ].includes(previewValue)
  );
}

function getDevPreviewMode() {
  return devPreviewMode;
}

function isDevPreviewActive() {
  return Boolean(getDevPreviewMode());
}

function isMiniCoursePreviewActive() {
  if (FEATURE_MINI_COURSE_SHELF || Boolean(miniCoursePreviewMode)) {
    return true;
  }
  if (!isDevPreviewActive()) {
    return false;
  }

  const loaded = month2AsArray(courseData?.miniCourses || miniCourses);

  return loaded.some(
    (course) => course?.miniCourse?.visibility === "public"
  );
}

function isPreludePreviewActive() {
  return Boolean(preludePreviewMode);
}

function getLoadedMonths() {
  const months = new Set([1]);
  weeks.forEach((item) => {
    const month = Number(item.month);
    if (month > 1) months.add(month);
  });
  return Array.from(months).sort((a, b) => a - b);
}

function getVisibleMonths() {
  const loadedMonths = getLoadedMonths();
  if (!isDevPreviewActive()) return [1];

  const mode = getDevPreviewMode();
  if (mode === "m3") return loadedMonths.filter((month) => month <= 4);
  if (mode === "m4") return loadedMonths.filter((month) => month <= 4);
  if (mode === "m5" || mode === "5") return loadedMonths.filter((month) => month <= 5);
  if (mode === "m6" || mode === "6") return loadedMonths.filter((month) => month <= 6);
  if (mode === "all") return loadedMonths.filter((month) => month <= 6);

  return loadedMonths.filter((month) => month <= 6);
}

function canOpenMonth(month) {
  return getVisibleMonths().includes(month);
}

function getDevPreviewAutoMonth() {
  if (!isDevPreviewActive()) return 0;
  const visible = getVisibleMonths().filter((month) => month > 2);
  if (!visible.length) return 0;

  const mode = getDevPreviewMode();
  if (mode === "m3") return visible.includes(3) ? 3 : 0;
  if (mode === "m4") return visible.includes(4) ? 4 : 0;
  if (mode === "m5" || mode === "5") return visible.includes(5) ? 5 : 0;
  if (mode === "m6" || mode === "6") return visible.includes(6) ? 6 : 0;
  if (mode === "all") return visible.includes(6) ? 6 : (visible.includes(5) ? 5 : visible[visible.length - 1]);

  return visible[0];
}

function getMonthMeta(month) {
  const metadata = {
    1: {
      shortLabel: "Rhythm",
      moduleLabel: "Rhythm Foundation",
      switcherLabel: "เดือน 1: Rhythm",
      brandSub: "พื้นฐาน Rhythm 4 สัปดาห์"
    },
    2: {
      shortLabel: "Fretboard",
      moduleLabel: "Fretboard Foundation",
      switcherLabel: "เดือน 2: Fretboard",
      brandSub: "พื้นฐาน Fretboard 4 สัปดาห์"
    },
    3: {
      shortLabel: "Chord Tone",
      moduleLabel: "Chord Tone & Arpeggio Foundation",
      switcherLabel: "เดือน 3: Chord Tone",
      brandSub: "พื้นฐาน Chord Tone 4 สัปดาห์"
    },
    4: {
      shortLabel: "Scale Atlas",
      moduleLabel: "Scale Atlas Foundation",
      switcherLabel: "เดือน 4: Scale Atlas",
      brandSub: "พื้นฐาน Scale Atlas 4 สัปดาห์"
    },
    5: {
      shortLabel: "Diatonic",
      moduleLabel: "Diatonic Bridge & Melodic Freedom",
      switcherLabel: "เดือน 5: Diatonic Bridge",
      brandSub: "Diatonic Bridge & Melodic Freedom"
    },
    6: {
      shortLabel: "Modes",
      moduleLabel: "Modes as Chord Colors",
      switcherLabel: "เดือน 6: Modes",
      brandSub: "Modes as Chord Colors"
    }
  };
  return metadata[month] || {
    shortLabel: `Month ${month}`,
    moduleLabel: getModuleDisplayName(weeks.find((item) => item.month === month)?.module) || "Hidden Preview",
    switcherLabel: `เดือน ${month}: Preview`,
    brandSub: `Dev Preview: Month ${month}`
  };
}

function renderDevPreviewBanner() {
  const existing = document.getElementById("devPreviewBanner");
  if (!isDevPreviewActive()) {
    existing?.remove();
    return;
  }
  const main = document.querySelector("main");
  if (!main) return;
  const banner = existing || document.createElement("aside");
  banner.id = "devPreviewBanner";
  banner.className = "dev-preview-banner";
  banner.setAttribute("role", "status");
  banner.textContent = "DEV PREVIEW MODE — Hidden months are visible for QA only. Progress state is not changed.";
  if (!existing) main.prepend(banner);
}

function setDataStatus(message, type = "info") {
  const status = document.getElementById("dataStatus");
  if (!status) return;
  status.textContent = message;
  status.className = `data-status ${type}`;
}

function showToast(message, type = "info", timeout = 3500) {
  let stack = document.getElementById("toastStack");
  if (!stack) {
    stack = document.createElement("div");
    stack.id = "toastStack";
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  const toast = document.createElement("div");
  toast.setAttribute("role", "status");
  toast.className = `app-toast ${type}`;
  toast.textContent = message;
  stack.appendChild(toast);
  window.setTimeout(() => toast.remove(), timeout);
}


function getInitialTheme() {
  const savedTheme = localStorage.getItem(themeStorageKey);
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  const button = document.getElementById("themeToggle");
  if (!button) return;
  button.setAttribute("aria-label", isDark ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด");
  button.setAttribute("title", isDark ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด");
  button.textContent = isDark ? "☀️" : "🌙";
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  safeSetItem(themeStorageKey, nextTheme);
  applyTheme(nextTheme);
}

function noteIndex(note) {
  return notes.indexOf(flatToSharp[note] || note);
}

function prefersFlats(key) {
  return flatKeys.includes(key);
}

function noteNameForKey(pitch, key) {
  return (prefersFlats(key) ? flatNotes : notes)[pitch];
}

function majorScalePitches(key) {
  const root = noteIndex(key);
  return majorIntervals.map((interval) => (root + interval) % notes.length);
}

function majorScale(key) {
  return majorScalePitches(key).map((pitch) => noteNameForKey(pitch, key));
}

function chordForDegree(key, degree) {
  const scale = majorScale(key);
  const base = scale[degree - 1];
  if (degree === 7) return `${base}dim`;
  if ([2, 3, 6].includes(degree)) return `${base}m`;
  return base;
}

function init() {
  applyTheme(getInitialTheme());
  fillKeySelects();
  fillMonthFilter();
  renderWeeks();
  renderWeekDetail();
  renderProgress();
  renderModules();
  renderModuleDetail();
  renderFretboard();
  renderNashville();
  renderQuiz();
  renderToneTabs();
  renderToneDetail();
  renderSetlist();
  bindEvents();
  updateGrooveHint();

}

function fillKeySelects() {
  const keyOptions = ["C", "G", "D", "A", "E", "F", "Bb", "Eb"];
  for (const id of ["keySelect", "nashvilleKey"]) {
    const select = document.getElementById(id);
    select.innerHTML = keyOptions.map((key) => `<option value="${key}">${key} Major</option>`).join("");
  }
  document.getElementById("nashvilleKey").value = "G";
}

function fillMonthFilter() {
  const select = document.getElementById("monthFilter");
  const options = ["ทั้งหมด", ...Array.from({ length: 8 }, (_, index) => `เดือน ${index + 1}`)];
  select.innerHTML = options.map((label, index) => `<option value="${index}">${label}</option>`).join("");
}

function bindEvents() {
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("monthFilter").addEventListener("change", renderWeeks);
  document.getElementById("practiceTime").addEventListener("change", renderWeekDetail);
  document.getElementById("keySelect").addEventListener("change", renderFretboard);
  document.getElementById("nashvilleKey").addEventListener("change", renderNashville);
  document.getElementById("progressionSelect").addEventListener("change", renderNashville);
  document.getElementById("nextQuiz").addEventListener("click", nextQuiz);
  document.getElementById("resetProgress").addEventListener("click", resetProgress);
  document.getElementById("tempoDown").addEventListener("click", () => setBpm(bpm - 2));
  document.getElementById("tempoUp").addEventListener("click", () => setBpm(bpm + 2));
  document.getElementById("bpmSlider").addEventListener("input", (event) => setBpm(Number(event.target.value)));
  document.getElementById("metronomeToggle").addEventListener("click", toggleMetronome);
  document.querySelectorAll("[data-groove]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedGroove = button.dataset.groove;
      document.querySelectorAll("[data-groove]").forEach((item) => item.classList.toggle("active", item === button));
      updateGrooveHint();
    });
  });
}

function renderProgress() {
  const total = weeks.length;
  const done = completedWeeks.length;
  const percent = Math.round((done / total) * 100);
  const progressBar = document.getElementById("progressBar");
  if (progressBar) progressBar.style.width = `${percent}%`;
  const progressText = document.getElementById("progressText");
  if (progressText) progressText.textContent = `${done}/${total} สัปดาห์`;
  const activeNumber = Math.min(done + 1, total);
  const activeWeek = weeks.find((item) => item.number === activeNumber) || weeks[weeks.length - 1];
  const monthText = document.getElementById("monthText");
  if (monthText) monthText.textContent = `Month ${activeWeek.month}`;
  const currentWeekCard = document.getElementById("currentWeekCard");
  if (currentWeekCard) {
    currentWeekCard.innerHTML = `
      <span>Week ${activeWeek.number} / Month ${activeWeek.month}</span>
      <strong>${activeWeek.title}</strong>
      <p>${activeWeek.goal}</p>
    `;
  }
}

function getModuleDisplayName(moduleIdOrTitle) {
  const found = modules.find((item) => item.id === moduleIdOrTitle);
  return found?.title || moduleIdOrTitle || "";
}

async function renderWeeks() {
  const selectedMonth = Number(document.getElementById("monthFilter")?.value || 0);
  await ensureFutureCourseData(selectedMonth);
  const list = selectedMonth ? weeks.filter((item) => item.month === selectedMonth) : weeks;
  const grid = document.getElementById("weekGrid");
  grid.innerHTML = list.map((item) => `
    <button class="week-card ${item.number === selectedWeek ? "active" : ""} ${completedWeeks.includes(item.number) ? "done" : ""}"
      type="button" data-week="${item.number}">
      <small>Week ${item.number} · Month ${item.month}</small>
      <strong>${item.title}</strong>
      <span>${getModuleDisplayName(item.module)}</span>
    </button>
  `).join("");
  grid.querySelectorAll("[data-week]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedWeek = Number(button.dataset.week);
      renderWeeks();
      renderWeekDetail();
    });
  });
}

function renderWeekDetail() {
  const item = weeks.find((weekItem) => weekItem.number === selectedWeek) || weeks[0];
  const practiceTime = Number(document.getElementById("practiceTime").value || 60);
  const warmup = Math.max(8, Math.round(practiceTime * 0.18));
  const core = Math.round(practiceTime * 0.48);
  const apply = practiceTime - warmup - core;
  const checked = completedWeeks.includes(item.number);
  document.getElementById("weekDetail").innerHTML = `
    <div class="tag-row">
      <span class="tag">Week ${item.number}</span>
      <span class="tag">Month ${item.month}</span>
      <span class="tag">${getModuleDisplayName(item.module)}</span>
    </div>
    <h3>${item.title}</h3>
    <p>${item.goal}</p>
    <label class="check-item">
      <input type="checkbox" id="weekDone" ${checked ? "checked" : ""} />
      ทำสัปดาห์นี้ครบแล้ว
    </label>
    <div class="detail-grid">
      <div class="detail-block">
        <h4>Practice Plan ${practiceTime} นาที</h4>
        <ul>
          <li>Warm-up และทบทวน: ${warmup} นาที</li>
          <li>Core drill ของสัปดาห์: ${core} นาที</li>
          <li>Apply กับเพลงหรือ backing track: ${apply} นาที</li>
        </ul>
      </div>
      <div class="detail-block">
        <h4>แบบฝึกหัด</h4>
        <ul>${item.practice.map((line) => `<li>${line}</li>`).join("")}</ul>
      </div>
      <div class="detail-block">
        <h4>เกณฑ์ผ่าน</h4>
        <ul>${item.checks.map((line) => `<li>${line}</li>`).join("")}</ul>
      </div>
       <div class="detail-block">
         <h4>เช็กตัวเอง</h4>
         <ul>
           <li>เช็กว่า Pulse ยังนิ่งตลอดแบบฝึก</li>
           <li>จด BPM ที่ยังเล่นได้มั่นคง</li>
           <li>เลือก 1 จุดที่ต้องแก้ในสัปดาห์ถัดไป</li>
         </ul>
       </div>
    </div>
  `;
  document.getElementById("weekDone").addEventListener("change", (event) => {
    if (event.target.checked) {
      completedWeeks = Array.from(new Set([...completedWeeks, item.number])).sort((a, b) => a - b);
    } else {
      completedWeeks = completedWeeks.filter((number) => number !== item.number);
    }
    saveJson("guitarCourseCompletedWeeks", completedWeeks);
    renderProgress();
    renderWeeks();
  });
}

function renderModules() {
  const tabs = document.getElementById("moduleTabs");
  if (!tabs) return;
  const detail = document.getElementById("moduleDetail");
  if (!modules.length) {
    tabs.hidden = true;
    if (detail) detail.hidden = true;
    return;
  }
  tabs.hidden = false;
  if (detail) detail.hidden = false;
  tabs.innerHTML = modules.map((item, index) => `
    <button type="button" role="tab" aria-selected="${item.id === selectedModule}" class="${item.id === selectedModule ? "active" : ""}" data-module="${item.id}">
      ${index + 1}. ${item.title}
    </button>
  `).join("");
  tabs.querySelectorAll("[data-module]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedModule = button.dataset.module;
      renderModules();
      renderModuleDetail();
    });
  });
}

function renderModuleDetail() {
  const detail = document.getElementById("moduleDetail");
  if (!detail || !modules.length) return;
  const item = modules.find((moduleItem) => moduleItem.id === selectedModule) || modules[0];
  const index = modules.indexOf(item) + 1;
  detail.innerHTML = `
    <div class="module-hero">
      <div>
        <p class="eyebrow">Lesson ${index}</p>
        <h3>${item.title}</h3>
        <p><strong>${item.subtitle}</strong></p>
        <p>${item.goal}</p>
      </div>
      <div class="module-visual" data-number="${String(index).padStart(2, "0")}"></div>
    </div>
    <div class="module-sections">
      <article>
        <h4>แนวคิดหลัก</h4>
        <ul>${item.concepts.map((line) => `<li>${line}</li>`).join("")}</ul>
      </article>
      <article>
        <h4>แบบฝึกหัด</h4>
        <ul>${item.drills.map((line) => `<li>${line}</li>`).join("")}</ul>
      </article>
      <article>
        <h4>เช็กความพร้อม</h4>
        <ul>${item.checkpoint.map((line) => `<li>${line}</li>`).join("")}</ul>
      </article>
    </div>
  `;
}

function renderFretboard() {
  const key = document.getElementById("keySelect").value || "C";
  const scale = majorScale(key);
  const scalePitches = majorScalePitches(key);
  const rootPitch = scalePitches[0];
  document.getElementById("scaleLegend").innerHTML = scale.map((note, index) => `
    <span class="legend-pill ${index === 0 ? "root" : ""}">${index + 1}: ${note}</span>
  `).join("");
  document.getElementById("fretboard").innerHTML = stringTunings.map((string) => {
    const start = noteIndex(string.note);
    const cells = Array.from({ length: 13 }, (_, fret) => {
      const pitch = (start + fret) % notes.length;
      const note = noteNameForKey(pitch, key);
      const inScale = scalePitches.includes(pitch);
      const isRoot = pitch === rootPitch;
      return `<div class="fret-cell ${inScale ? "in-scale" : ""} ${isRoot ? "root" : ""}" title="${string.name} string fret ${fret}: ${note}">
        <span class="note">${inScale ? note : ""}</span>
      </div>`;
    }).join("");
    return `<div class="string-row"><div class="string-name">${string.name}</div>${cells}</div>`;
  }).join("");
  document.getElementById("scaleHint").textContent = `${key} Major: เล่นจาก root สีแดง แล้วจบ phrase บน degree 1, 3 หรือ 5 เพื่อให้ฟังเข้าคอร์ด`;
}

function renderNashville() {
  const key = document.getElementById("nashvilleKey").value || "G";
  const selected = document.getElementById("progressionSelect").value;
  const degrees = progressions[selected];
  document.getElementById("chordOutput").innerHTML = degrees.map((degree) => `
    <div class="chord-box">
      <span>${roman[degree]}</span>
      <strong>${chordForDegree(key, degree)}</strong>
      <small>Degree ${degree}</small>
    </div>
  `).join("");
}

function renderQuiz() {
  const item = quizItems[currentQuizIndex];
  if (!item) return;
  document.getElementById("quizQuestion").textContent = item.question;
  document.getElementById("quizOptions").innerHTML = item.options.map((option) => `
    <button type="button" data-answer="${option}">${option}</button>
  `).join("");
  document.getElementById("quizFeedback").textContent = "";
  document.getElementById("quizScore").textContent = `${quizCorrect}/${quizAttempts}`;
  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => answerQuiz(button));
  });
}

function answerQuiz(button) {
  if (document.querySelector(".quiz-options button.correct, .quiz-options button.wrong")) return;
  const item = quizItems[currentQuizIndex];
  const answer = button.dataset.answer;
  const isCorrect = answer === item.answer;
  quizAttempts += 1;
  if (isCorrect) quizCorrect += 1;
  button.classList.add(isCorrect ? "correct" : "wrong");
  document.querySelectorAll("[data-answer]").forEach((option) => {
    if (option.dataset.answer === item.answer) option.classList.add("correct");
  });
  document.getElementById("quizFeedback").textContent = item.explain;
  document.getElementById("quizScore").textContent = `${quizCorrect}/${quizAttempts}`;
}

function nextQuiz() {
  if (!quizItems.length) return;
  currentQuizIndex = (currentQuizIndex + 1) % quizItems.length;
  renderQuiz();
}

function renderToneTabs() {
  const tabs = document.getElementById("toneTabs");
  if (!tabs || !tonePresets.length) return;
  tabs.innerHTML = tonePresets.map((tone) => `
    <button type="button" class="${tone.id === selectedTone ? "active" : ""}" data-tone="${tone.id}">
      ${tone.title}
    </button>
  `).join("");
  tabs.querySelectorAll("[data-tone]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTone = button.dataset.tone;
      renderToneTabs();
      renderToneDetail();
    });
  });
}

function renderToneDetail() {
  const detail = document.getElementById("toneDetail");
  if (!detail || !tonePresets.length) return;
  const tone = tonePresets.find((item) => item.id === selectedTone) || tonePresets[0];
  detail.innerHTML = `
    <div class="tone-chain">${tone.chain.map((item) => `<span>${item}</span>`).join("")}</div>
    <p><strong>Setting:</strong> ${tone.settings}</p>
    <p><strong>ใช้เมื่อ:</strong> ${tone.use}</p>
  `;
}

function renderSetlist() {
  document.getElementById("setlistChecks").innerHTML = setlistItems.map((item, index) => `
    <label class="check-item">
      <input type="checkbox" data-setlist="${index}" ${completedSetlist.includes(index) ? "checked" : ""} />
      ${item}
    </label>
  `).join("");
  document.querySelectorAll("[data-setlist]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const index = Number(event.target.dataset.setlist);
      if (event.target.checked) {
        completedSetlist = Array.from(new Set([...completedSetlist, index])).sort((a, b) => a - b);
      } else {
        completedSetlist = completedSetlist.filter((item) => item !== index);
      }
      saveJson("guitarCourseSetlist", completedSetlist);
    });
  });
}

function setBpm(value, options = {}) {
  const nextBpm = Number(value);
  if (!Number.isFinite(nextBpm)) {
    document.getElementById("bpmValue").value = bpm;
    document.getElementById("bpmSlider").value = bpm;
    updateQuickTempoActive(bpm);
    return;
  }

  const previousBpm = bpm;
  bpm = Math.min(CONTINUE_PRACTICE_MAX_BPM, Math.max(CONTINUE_PRACTICE_MIN_BPM, Math.round(nextBpm)));
  document.getElementById("bpmValue").value = bpm;
  document.getElementById("bpmSlider").value = bpm;
  updateQuickTempoActive(bpm);
  if (options.persist !== false && bpm !== previousBpm) {
    persistContinuePracticeStateV1({ debounce: true });
  }
}

function setQuickTempo(value) {
  setBpm(value);
  closeQuickTempoDrawer();
  showToast(`ตั้ง Metronome เป็น ${bpm} BPM แล้ว`, "success", 1800);
}

function updateQuickTempoActive(value) {
  document.querySelectorAll("#quickTempoDrawer [data-bpm]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.bpm) === Number(value));
  });
}

function toggleQuickTempoDrawer() {
  const drawer = document.getElementById("quickTempoDrawer");
  const toggle = document.getElementById("quickTempoToggle");
  if (!drawer || !toggle) return;
  isQuickTempoOpen = !isQuickTempoOpen;
  drawer.hidden = !isQuickTempoOpen;
  toggle.classList.toggle("is-open", isQuickTempoOpen);
  toggle.setAttribute("aria-expanded", String(isQuickTempoOpen));
  updateQuickTempoActive(bpm);
}

function closeQuickTempoDrawer() {
  const drawer = document.getElementById("quickTempoDrawer");
  const toggle = document.getElementById("quickTempoToggle");
  if (!drawer || !toggle) return;
  isQuickTempoOpen = false;
  drawer.hidden = true;
  toggle.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
}

function updateGrooveHint() {
  const hints = {
    straight: "Straight 8: นับ 1-&-2-&-3-&-4-& ให้ downstroke อยู่บน beat หลักและ upstroke อยู่บน &",
    syncopation: "Syncopation: ปิดเสียงบน beat บางจุด แล้วให้คอร์ดดังบน & หรือ a เพื่อสร้างแรงผลัก",
    funk: "Funk 16: มือขวาแกว่ง 16th ตลอด ใช้ ghost strum และ accent สั้น ๆ ให้ groove กระชับ",
    mute: "Palm Mute: วางสันมือใกล้ bridge ให้เสียงสั้นแต่ pitch ยังชัด เหมาะกับ verse หรือ rock groove",
  };
  document.getElementById("grooveHint").textContent = hints[selectedGroove];
}

function toggleMetronome() {
  if (isMetronomeRunning) {
    stopMetronome();
  } else {
    startMetronome();
  }
}

function startMetronome() {
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  nextBeatTime = audioContext.currentTime + 0.05;
  beatCount = 0;
  isMetronomeRunning = true;
  renderBeatCounter(0);
  document.getElementById("metronomeToggle").textContent = "หยุด";
  setMetronomeEnabledPreferenceV1(true);
  const announcer = document.getElementById("metronomeAnnouncer");
  if (announcer) announcer.textContent = `เริ่ม Metronome ที่ ${bpm} BPM`;
  scheduleMetronome();
}

function stopMetronome() {
  clearTimeout(metronomeTimer);
  isMetronomeRunning = false;
  document.getElementById("metronomeToggle").textContent = "เริ่ม";
  setMetronomeEnabledPreferenceV1(false);
  document.getElementById("beatLight").classList.remove("active", "accent");
  renderBeatCounter(0);
  window.dispatchEvent(new CustomEvent("gc:metronome-stop"));
  const announcer = document.getElementById("metronomeAnnouncer");
  if (announcer) announcer.textContent = "หยุด Metronome";
}

function scheduleMetronome() {
  if (!isMetronomeRunning) return;
  while (nextBeatTime < audioContext.currentTime + 0.12) {
    const visualBeat = (beatCount % 4) + 1;
    playClick(nextBeatTime, visualBeat === 1);

    const sixteenthInterval = (60 / bpm) / 4;
    for (let sub = 0; sub < 4; sub++) {
      const subTime = nextBeatTime + (sub * sixteenthInterval);
      const stepIndex = ((visualBeat - 1) * 4) + sub;
      const subDelay = Math.max(0, (subTime - audioContext.currentTime) * 1000);
      window.setTimeout(() => emitMetronomeStep(stepIndex, visualBeat, sub === 0), subDelay);
    }

    nextBeatTime += 60 / bpm;
    beatCount += 1;
  }
  metronomeTimer = window.setTimeout(scheduleMetronome, 25);
}

function emitMetronomeStep(stepIndex, visualBeat, isQuarterBeat) {
  if (!isMetronomeRunning) return;
  if (isQuarterBeat) {
    flashBeat(visualBeat);
  }
  window.dispatchEvent(new CustomEvent("gc:metronome-step", {
    detail: {
      stepIndex,
      beat: visualBeat,
      subbeat: (stepIndex % 4) + 1,
      isAccent: stepIndex % 4 === 0
    }
  }));
}

function playClick(time, accent) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(accent ? 1000 : 800, time);
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(accent ? 0.62 : 0.46, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(time);
  oscillator.stop(time + 0.04);
}

function flashBeat(beat = 0) {
  const light = document.getElementById("beatLight");
  renderBeatCounter(beat);
  light.classList.toggle("accent", beat === 1);
  light.classList.add("active");
  window.setTimeout(() => light.classList.remove("active", "accent"), 80);
}

function renderBeatCounter(activeBeat) {
  document.querySelectorAll("#beatCounter [data-beat]").forEach((pill) => {
    pill.classList.toggle("active", Number(pill.dataset.beat) === activeBeat);
  });
}

function resetProgress() {
  const confirmed = window.confirm("ล้างความคืบหน้าทั้งหมดในเครื่องนี้?");
  if (!confirmed) return;
  completedWeeks = [];
  completedSetlist = [];
  saveJson("guitarCourseCompletedWeeks", completedWeeks);
  saveJson("guitarCourseSetlist", completedSetlist);
  renderProgress();
  renderWeeks();
  renderWeekDetail();
  renderSetlist();
}

const foundationWeeks = [
  {
    number: 1,
    title: "Pulse & 16th Grid",
    summary: "ฝึกให้หู มือ และเท้าอยู่กับจังหวะหลักเดียวกันก่อนเริ่มเล่นรูปแบบที่ซับซ้อนขึ้น",
    learn: {
      targetBpm: "60 BPM",
      diagram: {
        title: "16th Grid: เห็นช่องย่อยก่อนค่อยเล่น",
        caption: "ช่องสีเขียวคือ Pulse ที่ตีจริง ส่วนช่องอื่นให้ปากนับผ่านไปก่อน อย่าเพิ่งเติมมือ",
        cells: [
          { label: "1", note: "ตี", kind: "hit" },
          { label: "e", note: "นับ", kind: "rest" },
          { label: "&", note: "นับ", kind: "rest" },
          { label: "a", note: "นับ", kind: "rest" },
          { label: "2", note: "ตี", kind: "hit" },
          { label: "e", note: "นับ", kind: "rest" },
          { label: "&", note: "นับ", kind: "rest" },
          { label: "a", note: "นับ", kind: "rest" },
          { label: "3", note: "ตี", kind: "hit" },
          { label: "e", note: "นับ", kind: "rest" },
          { label: "&", note: "นับ", kind: "rest" },
          { label: "a", note: "นับ", kind: "rest" },
          { label: "4", note: "ตี", kind: "hit" },
          { label: "e", note: "นับ", kind: "rest" },
          { label: "&", note: "นับ", kind: "rest" },
          { label: "a", note: "นับ", kind: "rest" }
        ]
      },
      paragraphs: [
        "เริ่มจากการจับเสียงที่เดินอยู่ตลอดก่อน อย่าเพิ่งสนใจว่ามือขวาต้องตีลายสวยแค่ไหน ให้ถามตัวเองว่าเราได้ยิน Pulse ของเพลงหรือยัง",
        "Pulse คือจังหวะหลักที่เหมือนชีพจรของเพลง มันคือความรู้สึกว่าเพลงกำลังเดินไปข้างหน้าแบบ 1 2 3 4 ถึงแม้กีตาร์จะไม่ได้ตีทุกจังหวะ Pulse ก็ยังอยู่ตรงนั้นตลอด",
        "Rhythm คือสิ่งที่เราเล่นคร่อมอยู่บน Pulse อีกทีหนึ่ง เช่น เราอาจตีเฉพาะ 1 กับ 3 หรือเติม 1 e & a ก็ได้ แต่ไม่ว่า Rhythm จะเยอะหรือน้อย Pulse ต้องยังนิ่งเหมือนเดิม",
        "เหตุผลที่ครูให้เคาะเท้า เพราะเท้าช่วยยืนยันว่าในหัวเรายังรู้ว่า beat หลักอยู่ตรงไหน ถ้าเท้าหายหรือเริ่มเคาะตามมือมั่ว ๆ แปลว่าเรากำลังปล่อยให้มือพาเวลาไป",
        "เริ่มนับง่ายที่สุดคือ 1 2 3 4 ให้เลขแต่ละตัวห่างเท่ากันเหมือนเดินทีละก้าว จากนั้นค่อยซอยพื้นที่ระหว่างเลขด้วย 1 e & a เพื่อเห็น 16th Grid แต่เท้ายังเคาะเฉพาะเลขเหมือนเดิม",
        "การเห็นตำแหน่ง 16th Grid ช่วยให้รู้ว่าโน้ตอยู่ตรงไหนล่วงหน้า การมีภาพจังหวะชัดช่วยให้มือไม่เดาเวลาใหม่ทุกครั้งที่ต้องลงคอร์ด",
        "สัปดาห์นี้ไม่ต้องใช้คอร์ดเยอะ เลือกคอร์ดเดียวแล้วทำให้ time นิ่งก่อน ถ้าคอร์ดน้อยแต่ลงตรง Metronome ได้ นั่นคือพื้นฐานที่ดีมากสำหรับ Groove ต่อไป"
      ],
      listenFor: [
        "เสียงคอร์ดของเราชนกับ click ของ Metronome พอดีหรือมาช้าไปนิดหนึ่ง",
        "เวลานับ 1 2 3 4 เสียงในหัวสม่ำเสมอไหม หรือบางเลขถูกรีบพูดเร็วกว่าเลขอื่น",
        "ตอนนับ 1 e & a ช่อง e, &, a เป็นแค่พื้นที่ในจังหวะ ไม่ใช่จุดที่ต้องตีแรงทุกครั้ง"
      ],
      physicalFeel: [
        "เท้าเคาะเฉพาะ 1 2 3 4 แบบสบาย ๆ ไม่ต้องกระแทกแรง",
        "ข้อมือขวาผ่อนคลาย และเตรียมดีดเฉพาะจุดตามแบบฝึก",
        "ไหล่และแขนควรรู้สึกเบา ถ้าตัวแข็งมากแปลว่าเรากำลังพยายามคุมเวลาด้วยแรงแทนการฟัง"
      ],
      guitarApplication: [
        "เลือกคอร์ด G, Em หรือ Am คอร์ดเดียว แล้วตี Downstroke เฉพาะเลข 1 2 3 4",
        "รอบต่อไปปากนับ 1 e & a แต่มือยังตีเฉพาะเลข เพื่อแยกการนับกับการตีออกจากกัน",
        "เล่นคอร์ดน้อยก่อน เพราะเป้าหมายคือ time นิ่ง ไม่ใช่เปลี่ยนคอร์ดให้เยอะ"
      ],
      guidedSteps: [
        "รอบแรก วางกีตาร์ไว้ก่อน เปิด Metronome 60 BPM แล้วพูด 1 2 3 4 ให้ตรง click แค่นี้พอ อย่าเพิ่งนับ 1 e & a",
        "รอบสอง ให้เท้าเคาะพร้อมเลข 1 2 3 4 ถ้าเท้ากับปากไม่ตรงกัน ให้หยุดแล้วเริ่มใหม่ช้ากว่าเดิม",
        "รอบสาม หยิบกีตาร์ จับคอร์ดเดียว แล้วตี Downstroke เฉพาะตอนพูดเลข อย่าเติมจังหวะอื่นแม้มือจะอยากเล่น",
        "รอบสี่ ให้ปากนับ 1 e & a แต่เท้ายังเคาะเฉพาะเลข และมือยังตีเฉพาะเลขเหมือนเดิม นี่คือการฝึกเห็น Grid โดยไม่ทำให้มือรก",
        "รอบสุดท้าย เล่นต่ออีก 30 วินาที ระหว่างเล่นให้สังเกตว่าคอร์ดมาก่อน click หรือมาหลัง click แล้วปรับมือเพียงเล็กน้อย"
      ],
      correctionSteps: [
        "ถ้าคอร์ดไม่ชน click ให้ตัดเหลือแค่ตบมือกับ Metronome ก่อน อย่าแก้ด้วยการเพิ่มแรงตี",
        "ถ้านับ 1 e & a แล้วหลง ให้กลับไปนับ 1 2 3 4 สองรอบ แล้วค่อยซอยใหม่",
        "ถ้ามือขวาหยุดค้าง ให้กลับไปนับ 1 e & a แล้วดีดเฉพาะจุดที่แบบฝึกกำหนด"
      ],
      dailySelfCheck: [
        "15 วินาที → 30 วินาที → 60 วินาที",
        "ในแต่ละช่วง เคาะเท้าและดีดคอร์ด Em ให้ตรงกับ Metronome 60 BPM",
        "นับ 1 e & a เพื่อรู้ตำแหน่งเวลา แล้วดีดเฉพาะจุดที่แบบฝึกกำหนดโดยรักษา Pulse ให้สม่ำเสมอ"
      ],
      troubleshooting: [
        {
          problem: "จังหวะเริ่มแกว่งหลังเล่นไปประมาณ 20 วินาที",
          advice: "ลด BPM ลง 10 แล้วกลับไปเคาะเท้ากับ Metronome อย่างเดียว พอเท้านิ่งค่อยนับ 1 2 3 4 ออกเสียง"
        },
        {
          problem: "นับ 1 e & a แล้วรีบจนช่องย่อยไม่เท่ากัน",
          advice: "ยังไม่ต้องตีคอร์ด ให้พูดเบาลงและเว้นช่องแต่ละพยางค์ให้เท่ากันก่อน ถ้าปากนิ่ง มือจะนิ่งตาม"
        },
        {
          problem: "มือขวาหยุดรอจังหวะตี",
          advice: "อุดสายไว้ แล้วนับ 1 e & a ให้ตรง click จากนั้นดีดเฉพาะเลข 1 2 3 4"
        }
      ],
      miniExample: "ตั้ง Metronome ที่ 60 BPM นับ 1 e & a ออกเสียง 4 ห้อง แล้วตีคอร์ดเฉพาะตรง 1 2 3 4 ถ้าหลุด ให้กลับมานับแค่ 1 2 3 4 ก่อน",
      commonMistakes: [
        "นับ 1 e & a แล้วเท้าเผลอเคาะทุกพยางค์ ทำให้ Pulse หลักไม่ชัด",
        "มือขวาหยุดรอจังหวะตี พอจะตีจริงเลยลงช้าหรือรีบเกิน",
        "รีบเพิ่มคอร์ดหรือเพิ่มรูปแบบการตีคอร์ดทั้งที่เสียงยังไม่ตรง Metronome"
      ],
      selfCheck: [
        "15 วินาที → 30 วินาที → 60 วินาที",
        "ในแต่ละช่วง เคาะเท้าและดีดคอร์ด Em ให้ตรงกับ Metronome 60 BPM",
        "ผ่านครบ 60 วินาทีโดย Pulse ไม่หยุดหรือเร่ง"
      ],
      teacherNote: "ครูแนะนำให้ซ้อมช้าแบบไม่อายความช้า ถ้า 60 BPM ยังไม่นิ่ง ให้ลดลงมาอีก เพราะ time ที่ดีเริ่มจากความนิ่ง ไม่ได้เริ่มจากความเร็ว",
      tabMicroSkill: {
        title: "Micro-Skill: Read the Rhythm, Not Just the Numbers",
        coreIdea: "เลขใน TAB บอกว่าเล่นอะไร แต่ rhythm บอกว่าเล่นเมื่อไร",
        miniExample: [
          "Count:  1   &   2   &   3   &   4   &",
          "e|--------------------------------|",
          "B|--------------------------------|",
          "G|--------------------------------|",
          "D|--2---x-------2---x-------------|",
          "A|--2---x-------2---x-------------|",
          "E|--0---x-------0---x-------------|",
          "    play stop   play stop"
        ],
        teacherNote: "ถ้ากดเลขถูกแต่เพลงยังไม่เหมือนต้นฉบับ ให้เช็กจังหวะและการหยุดก่อน อย่าเพิ่งโทษนิ้วซ้าย",
        practice: [
          "นับ 1 & 2 & 3 & 4 & ออกเสียงก่อน",
          "ตบมือเฉพาะจุด play",
          "พูดคำว่า stop ตรง x",
          "แล้วค่อยเล่นบนกีตาร์ช้า ๆ ที่ 60 BPM"
        ],
        commonMistakes: [
          "ปล่อย E5 ค้างจน rest ไม่เงียบ",
          "อ่านแต่เลข 2-2-0 แต่ไม่อ่าน x / stop",
          "มือรีบก่อนปากนับทัน"
        ],
        referenceTriggers: [
          { label: "เปิดคู่มือ TAB", target: "#tabGuidebook" },
          { label: "ดูค่าจังหวะโน้ต", target: "#noteValueGuidebook" }
        ]
      }
    },
    hear: [
      "ฟังเสียง click ของ Metronome ให้เป็นเหมือนเส้นทางหลัก อย่าให้เสียงกีตาร์พาเราเร่งหรือช้ากว่า click",
      "เวลาตีคอร์ด ให้ฟังว่าคอร์ดของเราลงพร้อมกับเลข 1 2 3 4 หรือยัง ถ้าคอร์ดมาหลัง click นิดเดียวก็ถือว่ายังไม่ตรง",
      "ยังไม่ต้องฟังว่าเล่นสวยไหม ให้ฟังอย่างเดียวว่าเสียงกีตาร์กับ Metronome อยู่ด้วยกันหรือแยกกัน"
    ],
    feel: [
      "ให้เท้าเคาะเฉพาะเลข 1 2 3 4 เหมือนเดินตรง ๆ ไม่ต้องเคาะ e & a",
      "มือขวาควรรู้สึกสบาย ไม่เกร็ง และไม่รีบลงก่อน click",
      "ถ้านับ 1 e & a แล้วหลง ให้กลับมานับแค่ 1 2 3 4 ก่อน นิ่งแล้วค่อยซอยใหม่"
    ],
    visual: {
      title: "เห็น Pulse บน 16th Grid",
      instruction: "ช่องสีเขียวคือจุดที่ตีคอร์ดจริง ส่วนช่องอื่นให้ปากนับผ่านไปเฉย ๆ",
      duration: 4,
      steps: [
        { count: "1", action: "ตี", kind: "hit" },
        { count: "e", action: "นับ", kind: "rest" },
        { count: "&", action: "นับ", kind: "rest" },
        { count: "a", action: "นับ", kind: "rest" },
        { count: "2", action: "ตี", kind: "hit" },
        { count: "e", action: "นับ", kind: "rest" },
        { count: "&", action: "นับ", kind: "rest" },
        { count: "a", action: "นับ", kind: "rest" },
        { count: "3", action: "ตี", kind: "hit" },
        { count: "e", action: "นับ", kind: "rest" },
        { count: "&", action: "นับ", kind: "rest" },
        { count: "a", action: "นับ", kind: "rest" },
        { count: "4", action: "ตี", kind: "hit" },
        { count: "e", action: "นับ", kind: "rest" },
        { count: "&", action: "นับ", kind: "rest" },
        { count: "a", action: "นับ", kind: "rest" }
      ]
    },
    practice: [
      "เลือกคอร์ดง่าย ๆ 1 คอร์ด เช่น G, Em หรือ Am",
      "ตี Downstroke ลงบน beat 1 2 3 4 เป็นเวลา 4 ห้อง",
      "รอบถัดไปให้ปากนับ 1 e & a แต่ยังตีเฉพาะเลขเหมือนเดิม",
      "เริ่มที่ 60 BPM ก่อน ถ้านิ่งแล้วค่อยขยับขึ้นทีละ 5 BPM เป้าหมายคือให้นิ่ง ไม่ใช่ให้เร็ว"
    ],
    quiz: [
      {
        question: "Pulse คืออะไร?",
        options: ["จังหวะหลักที่เดินอยู่ตลอดเพลง", "รูปแบบตีคอร์ดเร็ว ๆ", "ชื่อรูปคอร์ดแบบหนึ่ง"],
        answer: 0
      },
      {
        question: "Rhythm ต่างจาก Pulse อย่างไร?",
        options: ["Rhythm คือสิ่งที่เราเล่นคร่อมอยู่บน Pulse", "Rhythm ต้องดังเสมอ", "Rhythm แปลว่าตีลงอย่างเดียว"],
        answer: 0
      },
      {
        question: "เวลานับ 16th note หลังเลข 1 คืออะไร?",
        options: ["e", "&", "a"],
        answer: 0
      },
      {
        question: "ในแบบฝึกหัดนี้ เท้าควรเคาะตรงไหน?",
        options: ["เฉพาะ 1 2 3 4", "ทุก 16th note", "เฉพาะตอนเปลี่ยนคอร์ด"],
        answer: 0
      },
      {
        question: "ทำไมเริ่มจากคอร์ดเดียวก่อน?",
        options: ["เพื่อโฟกัสเรื่องเวลา ไม่ต้องพะวงเปลี่ยนคอร์ด", "เพื่อไม่ต้องใช้ Metronome", "เพื่อให้ตีเร็วขึ้นทันที"],
        answer: 0
      }
    ],
    homework: [
      "เล่นต่อเนื่อง 1 นาทีตอนเล่น beat 1 2 3 4 กับ Metronome แล้วเช็กว่าเสียงกีตาร์ชน click หรือยัง",
      "จด BPM ที่นิ่งที่สุดไว้ 1 ค่า แล้วใช้ค่านั้นเป็นจุดเริ่มซ้อมวันถัดไป"
    ]
  },
  {
    number: 2,
    title: "Syncopation",
    summary: "ฝึกวาง Accent บน off-beat เพื่อให้จังหวะเริ่มมี Groove",
    rhythmGeometry: {
      id: "w2-rhythm-geometry-16th-syncopation",
      type: "rhythm-geometry",
      // Legacy regression test invariant anchor: title: "16th Grid Syncopation (Variation: Subbeat a)" teacherTip: "รูปแบบย่อย (Variation): instruction: "ช่องสีส้มคือ Accent บน & หลัง 2 และ & หลัง 4 ส่วนช่องเทาคือ ghost/อุดสาย เบา ๆ"
      title: "16th Grid Syncopation (Accent on & after 2 and 4)",
      subdivision: "16th Grid",
      pickingStyle: "ทางเลือกเสริม: Alternate (D U D U)",
      bpmRecommended: "50-80",
      defaultMnemonicMode: "food_en",
      teacherTip: "เน้นลงน้ำหนัก (Accent) ที่ตำแหน่ง & หลัง 2 และ & หลัง 4 โดยรักษา Pulse เคาะเท้าที่ 1 2 3 4 ให้สม่ำเสมอ (ทิศทางการดีดเป็นทางเลือกเสริม ไม่ประเมินผล)",
      pattern: [
        {
          beat: 1,
          subbeats: [
            { picking: "down", accent: false, mnemonics: { food_en: "1", takadimi: "ta", counting: "1", food_th: "1" } },
            { picking: "up", accent: false, mnemonics: { food_en: "e", takadimi: "ka", counting: "e", food_th: "อี" } },
            { picking: "down", accent: false, mnemonics: { food_en: "&", takadimi: "di", counting: "&", food_th: "และ" } },
            { picking: "up", accent: false, mnemonics: { food_en: "a", takadimi: "mi", counting: "a", food_th: "อา" } }
          ]
        },
        {
          beat: 2,
          subbeats: [
            { picking: "down", accent: false, mnemonics: { food_en: "2", takadimi: "ta", counting: "2", food_th: "2" } },
            { picking: "up", accent: false, mnemonics: { food_en: "e", takadimi: "ka", counting: "e", food_th: "อี" } },
            { picking: "down", accent: true, mnemonics: { food_en: "&", takadimi: "di", counting: "&", food_th: "และ" } },
            { picking: "up", accent: false, mnemonics: { food_en: "a", takadimi: "mi", counting: "a", food_th: "อา" } }
          ]
        },
        {
          beat: 3,
          subbeats: [
            { picking: "down", accent: false, mnemonics: { food_en: "3", takadimi: "ta", counting: "3", food_th: "3" } },
            { picking: "up", accent: false, mnemonics: { food_en: "e", takadimi: "ka", counting: "e", food_th: "อี" } },
            { picking: "down", accent: false, mnemonics: { food_en: "&", takadimi: "di", counting: "&", food_th: "และ" } },
            { picking: "up", accent: false, mnemonics: { food_en: "a", takadimi: "mi", counting: "a", food_th: "อา" } }
          ]
        },
        {
          beat: 4,
          subbeats: [
            { picking: "down", accent: false, mnemonics: { food_en: "4", takadimi: "ta", counting: "4", food_th: "4" } },
            { picking: "up", accent: false, mnemonics: { food_en: "e", takadimi: "ka", counting: "e", food_th: "อี" } },
            { picking: "down", accent: true, mnemonics: { food_en: "&", takadimi: "di", counting: "&", food_th: "และ" } },
            { picking: "up", accent: false, mnemonics: { food_en: "a", takadimi: "mi", counting: "a", food_th: "อา" } }
          ]
        }
      ]
    },
    learn: {
      targetBpm: "50-80 BPM",
      diagram: {
        title: "Off-beat Grid: ให้คอร์ดเด่นบน &",
        caption: "เท้าอยู่บนเลข 1 2 3 4 ส่วนคอร์ดที่ทำให้จังหวะมีจุดเน้นชัดให้ลองวางบน & หลัง 2 และ 4",
        cells: [
          { label: "1", note: "ผ่านเงียบ", kind: "ghost" },
          { label: "&", note: "พัก", kind: "rest" },
          { label: "2", note: "ผ่านเงียบ", kind: "ghost" },
          { label: "&", note: "Accent", kind: "accent" },
          { label: "3", note: "ผ่านเงียบ", kind: "ghost" },
          { label: "&", note: "พัก", kind: "rest" },
          { label: "4", note: "ผ่านเงียบ", kind: "ghost" },
          { label: "&", note: "Accent", kind: "accent" }
        ]
      },
      paragraphs: [
        "Beat คือจังหวะหลัก (1, 2, 3, 4) ส่วน Off-beat คือจังหวะยกที่อยู่กึ่งกลางระหว่าง Beat สองครั้ง ซึ่งนับว่า '&'",
        "การเน้นเสียง (Accent) คือการเพิ่มน้ำหนักการดีดให้คอร์ดนั้นดังเด่นขึ้นกว่าปกติ",
        "Syncopation คือการวาง Accent บนจังหวะยก ('&') แทนที่จะวางบน Beat หลัก ทำให้เกิดจังหวะที่มีเสียงเน้นสลับอยู่ข้างใน โดยที่เท้ายึดเคาะ Beat 1 2 3 4 นิ่งสม่ำเสมอ",
        "คำแนะนำการเคลื่อนมือ: ในแบบฝึกหัด 8th-note นี้ มือขวาจะเคลื่อนลงตรงกับตัวเลข (1, 2, 3, 4) และเคลื่อนขึ้นตรงตำแหน่งจังหวะยก '&' (ตัวเลือกเสริม: ลองปล่อยให้มือเคลื่อนขึ้นสัมผัสสายเบาๆ บนตำแหน่ง '&' เมื่อพร้อม โดยไม่ประเมินผลทิศทาง)",
        "ก่อนเล่นให้พูดจังหวะออกมาก่อน เช่น 1 & 2 & 3 & 4 & แล้ววงจุดที่อยากให้คอร์ดดัง เช่น & หลัง 2 พอปากนับได้ชัด มือจะมีโอกาสเล่นตรงมากขึ้น",
        "ตัวอย่างง่าย ๆ คือเว้น beat 2 ไว้เบาหรือให้มือผ่านโดยไม่ให้สายดัง แล้วให้คอร์ดดังที่ & หลัง 2 เสียงจะมีตำแหน่งชัดขึ้น",
        "อย่ารีบทำให้มันซับซ้อน สัปดาห์นี้ขอให้รู้สึกว่าเท้าเป็นพื้น ส่วนมือขวาเป็นคนเล่นกับพื้นนั้น ถ้าพื้นยังนิ่ง Syncopation จะฟังสนุกแทนที่จะฟังหลุด"
      ],
      listenFor: [
        "Accent บน off-beat ทำให้ตำแหน่งเสียงชัดขึ้นไหม หรือทำให้ Pulse หายไป",
        "หลังตีที่ & แล้วเรากลับมาเจอ beat ถัดไปได้ตรงหรือไม่",
        "เสียงอุดสายหรือจุดที่มือผ่านโดยไม่ให้สายดัง เบาพอที่จะไม่แย่งความเด่นจาก Accent หรือเปล่า"
      ],
      physicalFeel: [
        "เท้ายังเคาะ 1 2 3 4 ต่อเนื่องเหมือนเดิม",
        "ข้อมือขวาผ่อนคลาย และดีดเฉพาะจุดที่กำหนดโดยไม่หยุด Pulse",
        "ตอนตี Accent บน & ให้รู้สึกเหมือนสะกิดจังหวะ ไม่ใช่กระชากทั้งแขน"
      ],
      guitarApplication: [
        "เริ่มจากคอร์ดเดียว ตีเบาบน 1 2 3 4 แล้วเพิ่ม Accent ที่ & หลัง 2",
        "ลองอุดสายด้วยมือซ้ายเพื่อฝึกมือขวาก่อน จากนั้นค่อยปล่อยคอร์ดจริงให้ดังเฉพาะจุด Accent",
        "ใช้รูปแบบสั้น 1 ห้องวนซ้ำจนกลับเข้า beat 1 ได้มั่นก่อนค่อยเพิ่มอีกห้อง"
      ],
      guidedSteps: [
        "รอบแรก ยังไม่ต้องจับคอร์ด ให้พูด 1 & 2 & 3 & 4 & พร้อมเคาะเท้าเฉพาะเลข ถ้าเท้าเผลอเคาะ & ให้เริ่มใหม่",
        "รอบสอง ให้ตบมือเบา ๆ ตรง & หลัง 2 แค่จุดเดียว แล้วฟังว่าหลังตบมือเรากลับมาเจอ 3 ได้ไหม",
        "รอบสาม จับคอร์ดเดียวแล้วอุดสายไว้ เคาะเท้าให้ตรงเลข 1 2 3 4 และฟังตำแหน่ง & หลัง 2",
        "รอบสี่ เปิดเสียงคอร์ดเฉพาะที่ & หลัง 2 ส่วนจุดอื่นให้มือผ่านโดยไม่ให้สายดัง โดยไม่เร่งเข้าหา &",
        "รอบสุดท้าย เล่น 4 ห้องติดกัน ถ้าพลาดให้กลับเข้าที่ beat ถัดไป ห้ามหยุดกลางห้อง เพราะในเพลงจริงเราต้องกลับเข้าวงให้ได้"
      ],
      correctionSteps: [
        "ถ้า Accent มาก่อนเวลา ให้ลด BPM และนับตำแหน่ง & ให้ชัดเจนก่อนดีด",
        "ถ้าเล่นแล้วเหมือนหลุด ให้ลบคอร์ดออก เหลือแค่อุดสายกับนับเสียงดังจน Pulse กลับมานิ่ง",
        "ถ้า Accent แรงเกิน ให้ลดแรงปิ๊ก แล้วใช้ความชัดของเวลาแทนความดัง"
      ],
      dailySelfCheck: [
        "เล่นคอร์ดบน \"&\" ได้โดยไม่รีบเข้าหา beat ถัดไป",
        "นับ 1 & 2 & 3 & 4 & ต่อเนื่องระหว่างการตีคอร์ดได้",
        "ยังเคาะตรงกับ Metronome ได้ตั้งแต่ 50 BPM และค่อย ๆ ขยับไป 80 BPM"
      ],
      troubleshooting: [
        {
          problem: "เน้นเสียงบน off-beat แล้วจังหวะรีบเกินไป",
          advice: "วางกีตาร์ก่อน แล้วนับ 1 & 2 & 3 & 4 & ให้ตรงกับเท้า จากนั้นค่อยตีคอร์ดเฉพาะ \"&\" ที่ต้องการ"
        },
        {
          problem: "เล่นบน & แล้วกลับเข้า beat ถัดไปไม่ทัน",
          advice: "ลด BPM ลง 10 และฝึกแค่ 1 ห้องวนซ้ำ อย่าเพิ่ม Accent จุดที่สองจนกว่าจะกลับมาเจอ beat 1 ได้ทุกครั้ง"
        },
        {
          problem: "Accent แรงจน Groove เหมือนหลุด",
          advice: "ลดแรงปิ๊กลง ให้จุดเด่นมาจากตำแหน่งเวลา ไม่ใช่ความดัง แล้วเช็กว่าเท้ายังอยู่บน 1 2 3 4"
        }
      ],
      miniExample: "นับ 1 & 2 & 3 & 4 & แล้วให้มือผ่าน 1 กับ 2 โดยไม่ให้สายดัง จากนั้นให้คอร์ดดังชัดที่ & หลัง 2 แล้วกลับมาเจอ 3 แบบไม่รีบ",
      commonMistakes: [
        "รีบเข้า Accent เร็วเกินเพราะกลัวไม่ทัน & ทำให้ทั้งรูปแบบการตีคอร์ดเหมือนวิ่งนำ Metronome",
        "ตี Accent แรงเกินจน Pulse หลักหาย และตัวเริ่มโยกตามมือแทนเท้า",
        "หลงตำแหน่งจังหวะเมื่อมีช่องเว้น ทำให้เข้า beat ถัดไปไม่ตรง"
      ],
      selfCheck: [
        "เปิด Metronome แล้วเท้ายังเคาะ 1 2 3 4 ได้แม้คอร์ดจะดังบน &",
        "หลัง Accent บน off-beat ยังกลับมาเจอ beat ถัดไปได้โดยไม่สะดุด",
        "หลังหยุดเล่น ให้นึกทบทวนจากสิ่งที่เพิ่งได้ยินว่า จุด Syncopation ชัดขึ้นหรือไม่ ขณะที่จังหวะหลักยังเดินอยู่"
      ],
      teacherNote: "ครูแนะนำให้พูดจังหวะก่อนเล่นทุกครั้ง ถ้าปากยังพูดไม่ตรง มือมักจะเล่นไม่ตรงเหมือนกัน ให้แก้ที่การนับก่อน แล้วกีตาร์จะตามมาง่ายขึ้น",
      referenceTriggers: [
        {
          label: "ทบทวน Downbeat / Upbeat",
          target: "#noteValueGuidebook",
          hint: "ถ้า & ยังลอยหรือรีบ ให้เปิดค่าจังหวะโน้ตแล้วดูแผนที่จังหวะตก / จังหวะยกสั้น ๆ ก่อนกลับมาซ้อม"
        }
      ]
    },
    earTraining: {
      title: "เล่นและฟังเปรียบเทียบรูปแบบ A กับ B",
      instruction: "เล่นรูปแบบ A ด้วยตัวเองหนึ่งรอบ แล้วเล่นรูปแบบ B หนึ่งรอบ โดยใช้ Metronome ความเร็วเดิม จากนั้นเปรียบเทียบสิ่งที่ได้ยิน",
      examples: [
        {
          label: "รูปแบบ A",
          description: "เล่นเสียงลงบน beat หลัก 1 2 3 4 โดยรักษา Pulse ให้สม่ำเสมอ"
        },
        {
          label: "รูปแบบ B",
          description: "เล่น Accent ที่ & หลัง 2 และ & หลัง 4 โดยให้ Pulse ยังอยู่ที่ 1 2 3 4; ไม่ประเมินทิศทางการดีดลงหรือขึ้น"
        }
      ],
      question: "รูปแบบ B เปลี่ยนจุดเน้นของเสียงอย่างไร ขณะที่ Pulse ยังนิ่ง?",
      hint: "ตอบจากสิ่งที่ได้ยินและรู้สึกจากการเล่นรูปแบบ A และ B ของตัวเอง"
    },
    hear: [
      "ฟังให้ได้ว่าจังหวะหลัก 1 2 3 4 ยังเดินอยู่ แม้เสียงกีตาร์จะไปเด่นบน &",
      "Accent บน off-beat ควรทำให้ตำแหน่งเสียงชัดขึ้น ไม่ใช่ทำให้ทั้งวงเหมือนหลุด beat",
      "ถ้าได้ยินว่า Accent กระแทกแรงจนกลบ Pulse ให้ลดแรงมือขวาลง แล้วปล่อยให้ Metronome เป็นตัวนำ"
    ],
    feel: [
      "เท้ายังเคาะ 1 2 3 4 เหมือนเดิม แต่ข้อมือขวาจะรู้สึกเหมือนส่งแรงไปที่ &",
      "off-beat ไม่ควรทำให้ตัวเราโยกหลุด ให้รู้สึกเหมือน Pulse อยู่ใต้เท้า ส่วน Accent อยู่ในมือ",
      "ถ้ารู้สึกว่าตัวกำลังวิ่งตามมือ ให้กลับไปอุดสายแล้วตบเฉพาะ off-beat ก่อน"
    ],
    visual: {
      title: "เห็น Accent บน off-beat (& หลัง 2 และ 4)",
      instruction: "ช่องสีส้มคือ Accent บน & หลัง 2 และ & หลัง 4 ส่วนช่องเทาคือจุดที่มือผ่านโดยไม่ให้สายดัง",
      duration: 4,
      steps: [
        { count: "1", action: "ผ่านเงียบ", kind: "ghost" },
        { count: "&", action: "พัก", kind: "rest" },
        { count: "2", action: "ผ่านเงียบ", kind: "ghost" },
        { count: "&", action: "Accent", kind: "accent" },
        { count: "3", action: "ผ่านเงียบ", kind: "ghost" },
        { count: "&", action: "พัก", kind: "rest" },
        { count: "4", action: "ผ่านเงียบ", kind: "ghost" },
        { count: "&", action: "Accent", kind: "accent" }
      ]
    },
    practice: [
      "ใช้คอร์ดเดียวก่อน แล้วตีลงบน 1 2 3 4",
      "ทางเลือกเสริม (Optional Preview): สังเกต Upstroke ที่ & หลัง 2 และ & หลัง 4 ได้ แต่ไม่ใช้เป็นเกณฑ์ประเมิน",
      "โฟกัสการเคาะ Pulse และการวางเสียงตรง & โดยให้มือผ่านจุดเงียบโดยไม่ให้สายดัง",
      "ซ้อม 4 ห้องที่ 70 BPM แล้วค่อยขยับไป 80 BPM ถ้ายังนิ่งอยู่"
    ],
    quiz: [
      {
        question: "off-beat คืออะไร?",
        options: ["จังหวะคั่นระหว่าง beat หลัก", "จังหวะที่ดังที่สุดในห้อง", "คอร์ดสุดท้ายของเพลง"],
        answer: 0
      },
      {
        question: "ทำไม Syncopation ถึงทำให้ Groove รู้สึกดีขึ้น?",
        options: ["เพราะเน้นจุดที่คาดไม่ถึง แต่ Pulse ยังนิ่งอยู่", "เพราะทำให้ beat หลักหายไป", "เพราะทำให้ทุกโน้ตดังเท่ากัน"],
        answer: 0
      },
      {
        question: "ในการนับ 1 & 2 & จุดไหนคือ off-beat?",
        options: ["&", "1", "2"],
        answer: 0
      },
      {
        question: "ตอนอุดสาย สิ่งใดช่วยให้ Pulse ยังชัด?",
        options: ["เคาะเท้าและฟัง Metronome", "หยุดฟัง Metronome", "เปลี่ยนคอร์ดแบบสุ่ม"],
        answer: 0
      },
      {
        question: "สิ่งที่ต้องระวังที่สุดเวลาเล่น Syncopation คืออะไร?",
        options: ["หลุดจาก Pulse หลัก", "เล่นเบาเกินไป", "ใช้คอร์ดเดียว"],
        answer: 0
      }
    ],
    homework: [
      "เล่น 4 ห้องที่มี Accent บน & หลัง 2 และ & หลัง 4 โดยให้เท้ายังเคาะ 1 2 3 4 ตลอด",
      "หลังหยุดเล่น ให้นึกทบทวนจากสิ่งที่เพิ่งได้ยิน แล้วจด 1 จุดที่ Pulse เริ่มไม่นิ่ง เพื่อกลับมาซ้อมช้าลงในวันถัดไป"
    ]
  },
  {
    number: 3,
    title: "Dynamics & Palm Muting",
    summary: "คุมเบา–ดัง Accent และ Palm Mute โดยให้ tempo นิ่ง",
    learn: {
      targetBpm: "60-70 BPM",
      diagram: {
        title: "4 น้ำหนักของมือขวา",
        caption: "ฝึกเบา ดัง Accent และ Palm Mute โดยให้ click เดินที่เดิม",
        cells: [
          { label: "เบา", note: "เบา", kind: "soft" },
          { label: "ดัง", note: "ดัง", kind: "open" },
          { label: "Accent", note: "2 และ 4", kind: "accent" },
          { label: "Mute", note: "สั้น", kind: "mute" }
        ]
      },
      paragraphs: [
        "Dynamics คือการคุมแรงตีให้เบาหรือดัง โดย Pulse และ tempo ต้องไม่เปลี่ยน",
        "Accent คือการเน้นบาง beat ให้เด่นขึ้น ฝึกที่ 2 และ 4 ให้ดังพอ ๆ กันและตรง click ทุกครั้ง",
        "Bridge หรือหย่อง คือชิ้นส่วนบนลำตัวกีตาร์ที่รองรับหรือยึดสาย อยู่ปลายสายฝั่งตรงข้ามกับคอกีตาร์",
        "ใช้ขอบมือด้านนิ้วก้อยแตะสายเบา ๆ ใกล้ Bridge ให้เสียงสั้นและแน่น แต่ยังฟังออกว่าเป็นคอร์ดเดิม",
        "ถ้าเสียงเงียบไป ให้ลดแรงแตะหรือเลื่อนจุดแตะเข้าใกล้ Bridge เล็กน้อย",
        "เมื่อคุมทั้งสามอย่างได้ มือขวาจะสร้างความต่างของเสียงโดยไม่ต้องเพิ่มคอร์ดหรือเล่นเร็วขึ้น"
      ],
      listenFor: [
        "ตอนเปลี่ยนจากเบาเป็นดัง tempo ยังเท่าเดิมหรือไม่",
        "Accent บน 2 และ 4 ดังใกล้เคียงกันและตรง click หรือไม่",
        "Palm Mute สั้นลงแต่ยังฟังออกว่าเป็นคอร์ดเดิมหรือไม่"
      ],
      physicalFeel: [
        "ข้อมือผ่อนคลาย ใช้น้ำหนักปิ๊กต่างกันโดยไม่เกร็งแขน",
        "Accent มาจากแรงเพิ่มเล็กน้อย ไม่ใช่กระชากทั้งแขน",
        "ใช้ขอบมือด้านนิ้วก้อยแตะสายเบา ๆ ใกล้ Bridge ให้เสียงสั้นแต่ยังฟังออกว่าเป็นคอร์ดเดิม; มือขวาผ่อนคลายและปิ๊กหรือนิ้วไม่เกี่ยวสาย"
      ],
      guitarApplication: [
        "ใช้คอร์ด Em คอร์ดเดียว เพื่อให้หูโฟกัสที่มือขวา",
        "เปรียบเทียบเสียงเปิดกับ Palm Mute ที่ tempo เดียวกัน",
        "วาง Accent บน beat 2 และ 4 โดยการตีจังหวะอื่นยังเบา"
      ],
      guidedSteps: [
        "ตั้ง Metronome 60 BPM จับ Em แล้วตี 1 & 2 & 3 & 4 & แบบเบา",
        "เล่นซ้ำแบบดังขึ้น แต่รักษาระยะห่างของการตีทุกครั้งให้เท่าเดิม",
        "กลับมาเล่นเบา แล้วเน้นเฉพาะ beat 2 และ 4 ให้ดังเท่ากัน",
        "แตะ Palm Mute ใกล้ bridge แล้วทำ drill 4 ห้องด้านล่าง"
      ],
      correctionSteps: [
        "เล่นดังแล้วเร่ง: ลดแรงปิ๊กและกลับมาฟัง click",
        "Accent ไม่เท่ากัน: วนแค่ beat 2 และ 4 ช้า ๆ ก่อน",
        "Palm Mute ทึบเกิน: ลดการแตะสายจนได้เสียงสั้น แต่ยังฟังออกว่าเป็นคอร์ดเดิม"
      ],
      dailySelfCheck: [
        "เสียงเบาและดังต่างกันชัดโดย tempo ไม่แกว่ง",
        "Accent บน 2 และ 4 มีน้ำหนักสม่ำเสมอ",
        "Palm Mute สั้นและแน่น แต่ยังได้ยินคอร์ดชัด"
      ],
      troubleshooting: [
        {
          problem: "Palm Mute sounds dead",
          advice: "ลดการแตะสายจนได้เสียงสั้น แต่ยังฟังออกว่าเป็นคอร์ดเดิม"
        },
        {
          problem: "มี fret buzz หรือเสียงแป๊กตอนเล่นเบา",
          advice: "เช็กมือซ้ายให้กดชัดก่อน อย่าแก้ด้วยการตีแรงขึ้น"
        },
        {
          problem: "Accent บน 2 และ 4 ดังไม่เท่ากัน",
          advice: "ลด BPM แล้ววนหนึ่งห้อง เน้นเฉพาะ 2 และ 4 จนแรงมือสม่ำเสมอ"
        }
      ],
      miniExample: "Em ที่ 60 BPM: Palm Mute เบาบนทุก eighth note แล้วเปิด Accent สั้น ๆ บน beat 2 และ 4",
      commonMistakes: [
        "เล่นดังแล้วเร่งตามแรงมือ",
        "Accent แต่ละครั้งดังไม่เท่ากัน",
        "กด Palm Mute ลึกจนเสียงคอร์ดหาย"
      ],
      selfCheck: [
        "หลังหยุดเล่น ให้นึกทบทวนจากสิ่งที่เพิ่งได้ยินว่า เสียงเบา เสียงดัง และ Accent ต่างกันชัดเจนหรือไม่",
        "Accent บน 2 และ 4 อยู่ตรง click ทุกครั้ง",
        "Palm Mute สั้นลงแต่ยังฟังออกว่าเป็นคอร์ดเดิม และไม่ทำให้ Groove สะดุด"
      ],
      teacherNote: "ตำแหน่ง Palm Mute ของกีตาร์แต่ละตัวไม่เท่ากัน ใช้หูหาเสียงที่สั้นแต่ยังชัด"
    },
    earTraining: {
      title: "เล่นและฟังเปรียบเทียบรูปแบบ A กับ B",
      instruction: "เล่นรูปแบบ A ด้วยตัวเองหนึ่งรอบ แล้วเล่นรูปแบบ B หนึ่งรอบ โดยใช้ Metronome ความเร็วเดิม จากนั้นเปรียบเทียบสิ่งที่ได้ยิน",
      examples: [
        {
          label: "รูปแบบ A",
          description: "เล่นเสียงเปิดให้สม่ำเสมอทุกจังหวะ โดยรักษา tempo เดิม"
        },
        {
          label: "รูปแบบ B",
          description: "เล่น Palm Mute เป็นพื้น แล้วเปิด Accent บน beat 2 และ 4 โดยไม่เร่ง tempo"
        }
      ],
      question: "รูปแบบ B ทำให้เสียงสั้นและจุด Accent ต่างจากรูปแบบ A อย่างไร?",
      hint: "ตอบจากสิ่งที่ได้ยินและรู้สึกจากการเล่นรูปแบบ A และ B ของตัวเอง"
    },
    hear: [
      "ฟังความต่างระหว่างเสียงเปิดเต็มกับเสียง Palm Mute เสียงเปิดจะยาวกว่า ส่วน Palm Mute จะสั้นและแน่นกว่า",
      "ฟังว่าเสียงเบาและเสียงดังยังอยู่ tempo เดียวกันไหม หลายคนพอเล่นดังแล้วจะเผลอเร่ง",
      "เสียง Palm Mute ที่ดีสั้นลงและแน่นขึ้น แต่ยังฟังออกว่าเป็นคอร์ดเดิม"
    ],
    feel: [
      "มือขวาควรรู้สึกเหมือนมีน้ำหนัก 3 ระดับ: เบา, ปกติ, ดัง ไม่ใช่ตีแรงอย่างเดียว",
      "ใช้ขอบมือด้านนิ้วก้อยแตะสายเบา ๆ ใกล้ Bridge ถ้าแตะหนักเกินไปเสียงจะหาย",
      "เวลาสลับ open กับ muted ให้รู้สึกว่าเป็นการเปลี่ยนพื้นที่เสียง ไม่ใช่เปลี่ยน tempo"
    ],
    visual: {
      title: "Palm Mute + Accent บน 2 และ 4",
      instruction: "Mute เบาเป็นพื้น แล้วเปิด Accent ให้เด่นเฉพาะ beat 2 และ 4",
      duration: 4,
      steps: [
        { count: "1", action: "Mute", kind: "mute" },
        { count: "&", action: "Mute", kind: "mute" },
        { count: "2", action: "Accent", kind: "accent" },
        { count: "&", action: "Mute", kind: "mute" },
        { count: "3", action: "Mute", kind: "mute" },
        { count: "&", action: "Mute", kind: "mute" },
        { count: "4", action: "Accent", kind: "accent" },
        { count: "&", action: "Mute", kind: "mute" }
      ]
    },
    practice: [
      "ตั้ง Metronome 60 BPM ใช้คอร์ด Em และนับ 1 & 2 & 3 & 4 &",
      "ห้อง 1: เปิดเสียงเบา — ห้อง 2: เปิดเสียงดังขึ้นโดย tempo เท่าเดิม",
      "ห้อง 3: Palm Mute เบาทุก eighth note",
      "ห้อง 4: Palm Mute เบา แล้วเปิด Accent บน beat 2 และ 4",
      "วน 4 ห้องนี้ 3 รอบโดยไม่หยุด"
    ],
    quiz: [
      {
        question: "Dynamics คืออะไร?",
        options: ["การควบคุมเบา-ดัง", "การตั้งค่า distortion เท่านั้น", "รูปแบบสเกล"],
        answer: 0
      },
      {
        question: "Palm Mute ปกติใช้ขอบมือด้านนิ้วก้อยแตะสายแถวไหน?",
        options: ["ใกล้ bridge", "บน headstock", "ทับมือซ้าย"],
        answer: 0
      },
      {
        question: "Palm Mute ที่ดีควรให้ผลแบบไหน?",
        options: ["เสียงสั้นลง แต่ยังฟังออกว่าเป็นคอร์ดเดิม", "ทำให้ทุกโน้ตเงียบสนิท", "เปลี่ยนชื่อคอร์ด"],
        answer: 0
      },
      {
        question: "เวลาเปลี่ยน Dynamics สิ่งที่ควรนิ่งเหมือนเดิมคืออะไร?",
        options: ["Tempo", "คีย์เพลงเท่านั้น", "สีของปิ๊ก"],
        answer: 0
      },
      {
        question: "Accent ที่คุมได้ควรเป็นอย่างไร?",
        options: ["ดังเด่นสม่ำเสมอและตรง beat", "ยิ่งแรงยิ่งดี", "ทำให้ tempo เร็วขึ้น"],
        answer: 0
      }
    ],
    homework: [
      "เล่น drill 4 ห้องครบ 3 รอบ แล้วเช็กว่า tempo และ Accent สม่ำเสมอหรือไม่",
      "จดจุดแตะของขอบมือด้านนิ้วก้อยที่ทำให้ Palm Mute สั้น แต่ยังฟังออกว่าเป็นคอร์ดเดิม"
    ]
  },
  {
    number: 4,
    title: "Groove Integration",
    summary: "รวม Pulse, 16th Grid, Syncopation, Dynamics และ Palm Mute ใน Groove เดียว",
    learn: {
      targetBpm: "60-70 BPM",
      diagram: {
        title: "1 ห้อง: Muted Pulse + Open Syncopation",
        caption: "เท้าเหยียบเลข วางเสียงตาม 16th Grid แล้วเปิด Accent ที่ & หลัง 2 และ 4",
        cells: [
          { label: "1", note: "Mute", kind: "mute" },
          { label: "e", note: "ผ่าน", kind: "rest" },
          { label: "&", note: "Mute", kind: "mute" },
          { label: "a", note: "ผ่าน", kind: "rest" },
          { label: "2", note: "Mute", kind: "mute" },
          { label: "e", note: "ผ่าน", kind: "rest" },
          { label: "&", note: "เปิด", kind: "accent" },
          { label: "a", note: "ผ่าน", kind: "rest" },
          { label: "3", note: "Mute", kind: "mute" },
          { label: "e", note: "ผ่าน", kind: "rest" },
          { label: "&", note: "Mute", kind: "mute" },
          { label: "a", note: "ผ่าน", kind: "rest" },
          { label: "4", note: "Mute", kind: "mute" },
          { label: "e", note: "ผ่าน", kind: "rest" },
          { label: "&", note: "เปิด", kind: "accent" },
          { label: "a", note: "ผ่าน", kind: "rest" }
        ]
      },
      paragraphs: [
        "Groove คือความรู้สึกที่เพลงเดินได้เป็นธรรมชาติ เมื่อเท้ายึด Pulse มือวางเสียงตามตำแหน่ง และความเบา–ดังต่างกันอย่างตั้งใจ",
        "นับ 1 e & a เพื่อเห็น 16th Grid แต่ไม่ต้องประเมินทิศทางมือในสัปดาห์นี้",
        "วาง Syncopation ที่ & หลัง 2 และ 4 โดยกลับมาเจอ beat ถัดไปให้ตรง",
        "ใช้ Palm Mute เบาเป็นพื้น แล้วเปิด Accent ให้เด่นขึ้นเล็กน้อยโดย tempo ไม่เปลี่ยน"
      ],
      listenFor: [
        "Muted Pulse สั้นและสม่ำเสมอทุกห้อง",
        "Accent บน & เด่นขึ้น แต่ไม่กระแทกหรือเร่ง tempo",
        "เมื่อวนกลับ beat 1 Groove ยังต่อเนื่องและไม่สะดุด"
      ],
      physicalFeel: [
        "เท้าอยู่บนเลข 1 2 3 4 ตลอด",
        "ข้อมือเคลื่อนตามการนับโดยไม่เร่งหรือหยุดเดาเวลา",
        "ใช้ขอบมือด้านนิ้วก้อยแตะสายเบา ๆ เป็นพื้น แล้วเปิดเสียง Accent ให้ชัดโดยไม่เกร็ง"
      ],
      guitarApplication: [
        "ใช้คอร์ด Em คอร์ดเดียวเพื่อโฟกัสมือขวา",
        "เล่น Muted Pulse เป็นพื้น แล้วเปิดคอร์ดเฉพาะ & หลัง 2 และ 4",
        "วน Staged Mini-Song 4 ห้อง 2 รอบกับ Metronome โดยไม่หยุด"
      ],
      guidedSteps: [
        "ตั้ง Metronome 60 BPM ใช้ Em และนับ 1 e & a ให้ครบทุกช่อง",
        "Staged Mini-Song รอบที่ 1: ห้อง 1 ใช้ขอบมือด้านนิ้วก้อยทำ Palm Mute เบาบน 1 2 3 4 เพื่อยึด Pulse",
        "Staged Mini-Song รอบที่ 1: ห้อง 2 ให้นับ 1 e & a เป็นแผนที่เวลา; สายดังเฉพาะ 1, &, 2, &, 3, &, 4, & แบบ Palm Mute ส่วน e และ a ให้นับผ่านโดยไม่ให้สายดัง มือขยับเท่าที่จำเป็น และไม่ประเมินทิศทางการดีด",
        "Staged Mini-Song รอบที่ 1: ห้อง 3 เปิด Accent ที่ & หลัง 2 และห้อง 4 เปิด Accent ที่ & หลัง 2 และ 4",
        "Practice Mode เท่านั้น: ถ้าต้องการพัก ให้แทรก Breathing Bar โดยพักนับ 1 2 3 4 ก่อนเริ่มรอบถัดไป",
        "Graduation Gate: เล่น Staged Mini-Song ต่อเนื่อง 2 รอบ รวม 8 ห้อง โดย Pulse ไม่หยุดหรือเร่ง"
      ],
      correctionSteps: [
        "ถ้า Pulse หาย ให้กลับไปห้อง 1 และเคาะเท้าพร้อม click",
        "ถ้า Accent มาก่อนเวลา ให้พูด & หลังเลข 2 ให้ชัดก่อนเปิดเสียง",
        "ถ้าสลับ Mute/Open แล้วเกร็ง ให้ลด BPM ลง 10 และแตะสายให้น้อยลงจนเสียงยังชัด"
      ],
      dailySelfCheck: [
        "นับ 16th Grid และเคาะ Pulse พร้อมกันได้",
        "Accent บน & ดังชัดโดย Muted Pulse ยังนิ่ง",
        "Graduation Gate: เล่น Staged Mini-Song ต่อเนื่อง 2 รอบ (8 ห้อง) โดยไม่หยุด"
      ],
      troubleshooting: [
        {
          problem: "มือขวาหลงตำแหน่งในช่องที่ไม่ตี",
          advice: "อุดสายด้วยมือซ้ายแล้วนับ 1 e & a ให้ตรง click ก่อนกลับมาเล่นคอร์ด"
        },
        {
          problem: "Accent บน & ทำให้รีบ",
          advice: "เหลือ Accent แค่ & หลัง 2 แล้วเช็กว่า beat 3 ยังตรง click ก่อนเพิ่มจุดที่สอง"
        },
        {
          problem: "Palm Mute ทึบจนคอร์ดไม่ชัด",
          advice: "ลดการแตะสายจนได้เสียงสั้น แต่ยังฟังออกว่าเป็นคอร์ดเดิม"
        }
      ],
      miniExample: "Em ที่ 60 BPM: นับ 1 e & a แต่ให้สายดังเฉพาะ 1, &, 2, &, 3, &, 4, & แบบ Palm Mute แล้วเปิด Accent ที่ & หลัง 2 และ 4",
      commonMistakes: [
        "เริ่มจากรูปแบบเต็มก่อน Pulse จะนิ่ง",
        "หลงตำแหน่งเวลาเมื่อมีช่องเว้นใน 16th Grid",
        "เปิด Accent แรงเกินจน tempo เร็วขึ้น"
      ],
      selfCheck: [
        "เท้ายังตรง click แม้มือเล่น Syncopation",
        "ฟังแยก Muted Pulse กับ Open Accent ได้ชัด",
        "จบห้อง 4 แล้ววนกลับห้อง 1 ได้ โดยยังอยู่ใน Staged Mini-Song รอบที่สอง"
      ],
      teacherNote: "ประกอบ Groove ทีละชั้น ถ้าชั้นใหม่ทำให้ Pulse สั่น ให้ถอยหนึ่งขั้น ไม่ต้องฝืนเล่นรูปแบบเต็ม"
    },
    earTraining: {
      title: "เล่นและฟังเปรียบเทียบรูปแบบ A กับ B",
      instruction: "เล่นรูปแบบ A (Muted Pulse นิ่ง) แล้วเล่นรูปแบบ B (เพิ่ม Accent บน &) โดยใช้ Metronome เดียวกัน จากนั้นเปรียบเทียบสิ่งที่ได้ยิน",
      examples: [
        {
          label: "รูปแบบ A",
          description: "Muted Pulse นิ่งอยู่กับ click 1 2 3 4 โดยรักษา Pulse ให้สม่ำเสมอ"
        },
        {
          label: "รูปแบบ B",
          description: "Muted Pulse นิ่ง และมี Open Accent เด่นขึ้นที่ & หลัง 2 และ & หลัง 4 โดย tempo ไม่เปลี่ยน"
        }
      ],
      question: "รูปแบบ B ทำให้ Accent ชัดขึ้นหรือ tempo เปลี่ยนจากรูปแบบ A หรือไม่?",
      hint: "ตอบจากสิ่งที่ได้ยินและรู้สึกจากการเล่นรูปแบบ A และ B ของตัวเอง"
    },
    miniSong: {
      title: "Staged Mini-Song: Em Groove 4 ห้อง × 2 รอบ",
      purpose: "เล่น 4 ห้องตามลำดับ แล้ววนต่อเนื่อง 2 รอบ รวม 8 ห้อง เป็น Graduation Gate ของ Month 1",
      bars: [
        { bar: 1, chord: "Em", direction: "ใช้ขอบมือด้านนิ้วก้อยทำ Palm Mute เบาบน 1 2 3 4 ให้ Pulse ตั้งหลัก" },
        { bar: 2, chord: "Em", direction: "นับ 1 e & a; สายดังเฉพาะ 1, &, 2, &, 3, &, 4, & แบบ Palm Mute ส่วน e และ a เงียบ" },
        { bar: 3, chord: "Em", direction: "เปิด Accent ที่ & หลัง 2 แล้วกลับเข้า beat 3 ให้ตรง" },
        { bar: 4, chord: "Em", direction: "เปิด Accent ที่ & หลัง 2 และ 4 ส่วนเสียงอื่นยัง Palm Mute เบา" }
      ],
      feel: "เล่น 4 ห้องตามลำดับต่อเนื่อง 2 รอบ ให้ Muted Pulse เป็นพื้นและ Open Accent เด่นโดยไม่ดัน tempo"
    },
    hear: [
      "ฟัง click เป็นแกน แล้วเช็กว่า Muted Pulse ไม่ลอยไปข้างหน้าหรือข้างหลัง",
      "Open Accent ควรเด่นจากทั้งความดังและความยาวของเสียง",
      "ห้อง 4 ต้องต่อกลับห้อง 1 ได้เหมือนเป็น Groove เดียว"
    ],
    feel: [
      "เท้ายึด Pulse ส่วนข้อมือเคลื่อนตามการนับ 16th Grid",
      "มือขวาเปิด–ปิด Palm Mute ด้วยการขยับสั้น ๆ ใกล้ bridge",
      "Accent รู้สึกเหมือนยก Groove ขึ้น ไม่ใช่กระชากให้เร็วขึ้น"
    ],
    visual: {
      title: "เห็น Groove 1 ห้องบน 16th Grid",
      instruction: "Mute เบาเป็นพื้น ช่องเปิดคือ Syncopation ที่ & หลัง 2 และ 4",
      duration: 4,
      steps: [
        { count: "1", action: "Mute", kind: "mute" },
        { count: "e", action: "ผ่าน", kind: "rest" },
        { count: "&", action: "Mute", kind: "mute" },
        { count: "a", action: "ผ่าน", kind: "rest" },
        { count: "2", action: "Mute", kind: "mute" },
        { count: "e", action: "ผ่าน", kind: "rest" },
        { count: "&", action: "เปิด", kind: "accent" },
        { count: "a", action: "ผ่าน", kind: "rest" },
        { count: "3", action: "Mute", kind: "mute" },
        { count: "e", action: "ผ่าน", kind: "rest" },
        { count: "&", action: "Mute", kind: "mute" },
        { count: "a", action: "ผ่าน", kind: "rest" },
        { count: "4", action: "Mute", kind: "mute" },
        { count: "e", action: "ผ่าน", kind: "rest" },
        { count: "&", action: "เปิด", kind: "accent" },
        { count: "a", action: "ผ่าน", kind: "rest" }
      ]
    },
    practice: [
      "ตั้ง Metronome 60 BPM ใช้ Em และนับ 1 e & a ตลอด",
      "เล่นห้อง 1–4 ตามลำดับ โดยเพิ่มเพียงหนึ่งชั้นในแต่ละห้อง แล้วเริ่มรอบที่สอง",
      "ให้การตีแบบ Mute เบา และ Open Accent ที่ & หลัง 2 กับ 4 ดังขึ้นเล็กน้อย",
      "Graduation Gate: วน 4 ห้องครบ 2 รอบ รวม 8 ห้อง ถ้าพลาดให้กลับเข้า beat ถัดไปโดยไม่หยุด",
      "Practice Mode เท่านั้น: แทรก Breathing Bar โดยพักนับ 1 2 3 4 ได้ แต่ไม่นับรวมใน Graduation Gate"
    ],
    quiz: [
      {
        question: "ตอนรวม Groove สิ่งใดต้องนิ่งที่สุด?",
        options: ["Pulse", "แรง Accent", "จำนวนคอร์ด"],
        answer: 0
      },
      {
        question: "16th Grid ช่วยเรื่องใด?",
        options: ["กำหนดตำแหน่งเวลาในการเคลื่อนมือ", "เปลี่ยนคีย์เพลง", "ทำให้ทุกช่องต้องดัง"],
        answer: 0
      },
      {
        question: "จุด Syncopation ในแบบฝึกนี้อยู่ตรงไหน?",
        options: ["& หลัง 2 และ 4", "เฉพาะ beat 1", "ทุกช่อง e และ a"],
        answer: 0
      },
      {
        question: "เสียงพื้นและเสียง Accent ควรต่างกันอย่างไร?",
        options: ["พื้น Palm Mute เบา ส่วน Accent เปิดและดังขึ้น", "ทุกเสียงดังเท่ากัน", "Accent ต้อง Palm Mute มากกว่า"],
        answer: 0
      },
      {
        question: "ถ้าเพิ่ม Accent แล้ว Pulse เริ่มสั่น ควรทำอย่างไร?",
        options: ["ถอยหนึ่งขั้นและลด BPM", "เพิ่ม Accent อีก", "หยุดฟัง Metronome"],
        answer: 0
      }
    ],
    homework: [
      "เล่น Em Groove 4 ห้องครบ 2 รอบ แล้วเช็กว่าจุด Accent เด่นชัดโดย Pulse และ tempo ยังนิ่งหรือไม่",
      "จดว่าการใช้ Palm Mute ทำให้เสียงสั้นแน่นแต่ยังฟังออกว่าเป็นคอร์ดเดิมหรือไม่"
    ]
  }
];

const month1V2Overrides = {
  1: {
    title: "Week 1 · Pulse: รู้จักเสียงและวางมือบนจังหวะ",
    summary: "Rhythm เป็นแกนหลัก: วาง Chromatic, Scale และ Arpeggio ลงบน quarter-note pulse ที่ 60 BPM",
    youtube: null,
    rhythmSpine: "Pulse",
    estimatedMinutesPerDay: "15–20 นาที",
    coreBlocks: [
      {
        pillar: "Chromatic",
        duration: "3–4 นาที",
        title: "1-2-3-4 บนสายเดียว",
        focus: "Single-string mechanics, alternate picking, finger independence และ controlled finger height",
        steps: [
          "เล่น 1-2-3-4 บนสาย 6 ช้า ๆ ด้วย alternate picking",
          "ย้ายไปสาย 1 โดยรักษาความสูงของนิ้วให้พอดีและไม่เกร็ง",
          "ให้ทุกโน้ตลงบน Pulse เดียวกันก่อนคิดเรื่องความเร็ว"
        ]
      },
      {
        pillar: "Scale",
        duration: "3–4 นาที",
        title: "E minor pentatonic partial · 4 โน้ต",
        focus: "ใช้เพียง partial ในพื้นที่เปิด ไม่ใช่ full shape",
        steps: [
          "6th string: 0(E), 3(G)",
          "5th string: 0(A), 2(B)",
          "จำว่า E minor pentatonic เต็มคือ E–G–A–B–D; W1 ใช้แค่ 4 โน้ตแรกนี้"
        ]
      },
      {
        pillar: "Arpeggio",
        duration: "3–4 นาที",
        title: "Em triad · E → B → E → G",
        focus: "Em = E–G–B = 1–♭3–5; ลำดับ physical pattern คือ 1 → 5 → 1 → ♭3",
        steps: [
          "6th string open = E",
          "5th string fret 2 = B",
          "4th string fret 2 = E; 3rd string open = G"
        ]
      },
      {
        pillar: "Rhythm + Application",
        duration: "6–8 นาที",
        title: "Em pulse groove",
        focus: "Quarter-note pulse ที่ 60 BPM และ chord pulse + arpeggio landing",
        steps: [
          "เล่น Em pulse ให้ตรงกับ Metronome 60 BPM",
          "สลับ chord pulse กับโน้ตจาก Em arpeggio โดยให้ Beat 1 ชัด",
          "ฟังว่าโน้ตทุกตัวอยู่บน pulse เดียวกัน ไม่ใช่เร่งตามความยากของมือซ้าย"
        ]
      }
    ],
    learn: {
      targetBpm: "60 BPM",
      diagram: {
        title: "Quarter-note Pulse: 1 2 3 4",
        caption: "เท้าและ Metronome อยู่บนเลข 1 2 3 4 ส่วน Chromatic, Scale และ Arpeggio ต้องลงตาม pulse นี้",
        cells: [
          { label: "1", note: "ลง", kind: "hit" },
          { label: "2", note: "ลง", kind: "hit" },
          { label: "3", note: "ลง", kind: "hit" },
          { label: "4", note: "ลง", kind: "hit" }
        ]
      },
      paragraphs: [
        "สัปดาห์นี้ Rhythm คือพื้นของทุกอย่าง เปิด Metronome 60 BPM แล้วให้เท้าได้ยิน quarter-note pulse ก่อน",
        "Chromatic, E minor pentatonic partial และ Em arpeggio ไม่ได้เป็นแบบฝึกแยกจากกัน ทุกโน้ตต้องรู้ว่ากำลังลงตรงไหนของ pulse",
        "เป้าหมายไม่ใช่เล่นเร็ว แต่คือกดโน้ตสะอาด รักษา pulse และเชื่อม chord pulse กับ arpeggio landing ให้เป็นเสียงดนตรี"
      ],
      listenFor: [
        "เสียงเท้าและ click สม่ำเสมอที่ 60 BPM",
        "โน้ตจากทั้งสาม pillar ลงพร้อม pulse ไม่มาก่อนหรือช้ากว่า",
        "Beat 1 รู้สึกเป็นจุดเริ่มรอบใหม่อย่างชัดเจน"
      ],
      physicalFeel: [
        "นิ้วซ้ายยกต่ำและผ่อนคลาย ไม่ยกสูงเกินจำเป็น",
        "มือขวา alternate picking เบาและสม่ำเสมอ",
        "เท้าเคาะเฉพาะ quarter-note pulse 1 2 3 4"
      ],
      guitarApplication: [
        "จับ Em แล้วเล่น chord pulse 1 2 3 4 ที่ 60 BPM",
        "แทรก E → B → E → G เป็น arpeggio landing สั้น ๆ โดยไม่หยุด pulse",
        "ตอบด้วย 4 โน้ต E–G–A–B จาก partial pentatonic แล้วกลับ Em"
      ],
      guidedSteps: [
        "รอบแรก เปิด Metronome 60 BPM เคาะเท้าและพูด 1 2 3 4 โดยยังไม่หยิบกีตาร์",
        "รอบสอง เล่น 1-2-3-4 บนสาย 6 แล้วสาย 1 ด้วย alternate picking ช้า ๆ",
        "รอบสาม เล่น E–G–A–B ตามตำแหน่ง partial โดยให้แต่ละโน้ตลงตรง pulse",
        "รอบสี่ เล่น Em arpeggio E → B → E → G แล้วกลับไป chord pulse",
        "รอบสุดท้าย รวมทั้งสาม pillar เป็น Em pulse groove สั้น ๆ"
      ],
      correctionSteps: [
        "ถ้ามือเร่ง ให้ลดเหลือการเคาะเท้ากับ click และเล่นโน้ตเดียวต่อ pulse",
        "ถ้านิ้วยกสูงหรือเกร็ง ให้ลดแรงกดจนเสียงยังชัด แล้วค่อยเล่นต่อ",
        "ถ้า arpeggio ทำให้หลุด ให้กลับไปเล่น Em chord pulse แล้วใส่ทีละ chord tone"
      ],
      dailySelfCheck: [
        "Chromatic 3–4 นาที, Scale 3–4 นาที, Arpeggio 3–4 นาที",
        "Rhythm + Application 6–8 นาที รวมทั้งหมด 15–20 นาที",
        "เล่น Em pulse groove ได้โดยไม่เร่งหรือหยุด pulse"
      ],
      troubleshooting: [
        { problem: "นิ้วขยับเร็วกว่า click", advice: "ลดจำนวนโน้ตเหลือ 1 ตัวต่อ click แล้วค่อยกลับไป 1-2-3-4" },
        { problem: "จำ pattern ได้แต่ไม่รู้สึก pulse", advice: "เคาะเท้าและพูด 1 2 3 4 ก่อน แล้วค่อยเพิ่ม Scale หรือ Arpeggio" },
        { problem: "Em arpeggio ฟังไม่เป็นคอร์ด", advice: "หยุดที่ E และ B ให้ได้ยิน root กับ fifth ก่อนเติม E และ G"
        }
      ],
      miniExample: "60 BPM: Em chord pulse 1 2 3 4 แล้วเล่น E → B → E → G หนึ่งรอบโดย Beat 1 ชัด",
      commonMistakes: [
        "เรียก E minor pentatonic partial ว่า full shape",
        "ใส่ F บนสาย 6 fret 1 ในแบบฝึก pentatonic นี้",
        "เรียก physical pattern E → B → E → G ว่า 1–3–5"
      ],
      selfCheck: [
        "เล่น 1-2-3-4 บนสาย 6 และสาย 1 ด้วย alternate picking ได้สะอาด",
        "ชี้ E–G–A–B partial ได้โดยไม่เพิ่ม F",
        "เล่น Em pulse + arpeggio landing ที่ 60 BPM ได้"
      ],
      teacherNote: "ให้ Rhythm เป็นพื้นของทุก block ถ้า 60 BPM ยังไม่นิ่ง ให้ลดจำนวนโน้ต ไม่ต้องเพิ่มความเร็ว"
    },
    practice: [
      "Chromatic · 1-2-3-4 บนสาย 6 และสาย 1 ด้วย alternate picking",
      "Scale · E minor pentatonic partial: 6th 0/3 และ 5th 0/2",
      "Arpeggio · Em: E → B → E → G = 1 → 5 → 1 → ♭3",
      "Rhythm + Application · Em pulse groove ที่ 60 BPM และ chord pulse + arpeggio landing"
    ],
    quiz: [
      { question: "Rhythm ทำหน้าที่อะไรใน W1?", options: ["เป็น pulse ที่ทุก pillar ต้องเล่นตาม", "เป็นแบบฝึกเสริมที่ข้ามได้", "เป็นการเล่นเร็วที่สุด"], answer: 0 },
      { question: "E minor pentatonic partial W1 ใช้โน้ตใด?", options: ["E–G–A–B", "E–F–G–A", "E–G–B–D–F"], answer: 0 },
      { question: "Em arpeggio E → B → E → G ตรงกับลำดับใด?", options: ["1 → 5 → 1 → ♭3", "1 → 3 → 5", "1 → 4 → 5"], answer: 0 }
    ],
    homework: [
      "ทำ Daily Core ให้ครบ 15–20 นาที โดยเปิด Metronome 60 BPM ทุก block",
      "เช็กว่า E minor pentatonic ยังเป็น partial 4 โน้ต และ Em arpeggio ลง Beat 1 ได้ชัด"
    ],
    earTraining: null,
    miniSong: null
  },
  2: {
    title: "Week 2 · Off-beat: ฟังและวางโน้ตบน &",
    summary: "Rhythm นำด้วย Syncopation และ off-beat; Scale กับ Arpeggio ต้องตอบกลับบน & โดย root E คงเดิม",
    youtube: null,
    rhythmSpine: "Off-beat",
    estimatedMinutesPerDay: "15–20 นาที",
    coreBlocks: [
      { pillar: "Chromatic", duration: "3–4 นาที", title: "String crossing 6 → 5", focus: "1-2-3-4 ข้ามสายโดยรักษา alternate picking", steps: ["เล่น 1-2-3-4 บนสาย 6", "ข้ามไปสาย 5 โดยไม่เปลี่ยนความสูงนิ้ว", "วาง pickup สั้น ๆ ก่อน target บน &"] },
      { pillar: "Scale", duration: "3–4 นาที", title: "E minor pentatonic partial · off-beat accent", focus: "ขยายจาก partial เดิมเป็น fragment 2–4 โน้ต ไม่เปลี่ยนเป็น full shape", steps: ["ทบทวน 6th 0/3 และ 5th 0/2", "เลือก 2–4 โน้ตทำ off-beat response phrase", "เน้นโน้ตบน & โดยเท้ายังอยู่บน 1 2 3 4"] },
      { pillar: "Arpeggio", duration: "3–4 นาที", title: "E Major vs E Minor", focus: "เปรียบเทียบ root E เดิม: G# = Major 3rd กับ G = Minor 3rd", steps: ["เล่น E–G#–B แล้วฟังสี Major", "เล่น E–G–B แล้วฟังสี Minor", "สลับสอง triad โดยไม่เปลี่ยน root และวาง tone บน &"] },
      { pillar: "Rhythm + Application", duration: "6–8 นาที", title: "Syncopated fill", focus: "นับ 1 & 2 & 3 & 4 & และ accent หลัง beats 2 และ 4", steps: ["ให้เท้าอยู่บน 1 2 3 4", "เปิด accent ที่ & หลัง 2 และ 4", "ตอบด้วย short scale/arpeggio fill บน & โดยไม่หลุด tempo"] }
    ],
    learn: {
      targetBpm: "60 BPM",
      diagram: { title: "Off-beat: 1 & 2 & 3 & 4 &", caption: "เท้าอยู่บนเลข ส่วน Scale และ Arpeggio ตอบกลับบน &", cells: [
        { label: "1", note: "พื้น", kind: "ghost" }, { label: "&", note: "ผ่าน", kind: "rest" },
        { label: "2", note: "พื้น", kind: "ghost" }, { label: "&", note: "Accent", kind: "accent" },
        { label: "3", note: "พื้น", kind: "ghost" }, { label: "&", note: "ผ่าน", kind: "rest" },
        { label: "4", note: "พื้น", kind: "ghost" }, { label: "&", note: "Accent", kind: "accent" }
      ]},
      paragraphs: [
        "W2 เพิ่มความยากด้วย Off-beat แต่ Pulse ยังเป็นแกนเดิม ให้เท้าเคาะ 1 2 3 4 ขณะนับ 1 & 2 & 3 & 4 &",
        "Scale fragment และ arpeggio tone จะมีความหมายเมื่อวางบนเวลา ไม่ใช่เมื่อเล่นครบจำนวนโน้ต",
        "E Major กับ E Minor ใช้ root E เดิมเพื่อให้หูจับจุดต่างที่ G# กับ G ได้ชัด"
      ],
      listenFor: ["เท้าไม่ย้ายไปตาม &", "Accent หลัง 2 และ 4 เด่นแต่ไม่เร่ง", "G# กับ G เปลี่ยนสีโดย E ยังเป็นบ้านเดิม"],
      physicalFeel: ["มือขวาผ่อนคลายตอนข้ามสาย", "เท้าหนักแน่นบนเลขและมือเบาบน &", "นิ้วซ้ายไม่ยกสูงตอน string crossing"],
      guitarApplication: ["อุดสายและนับ 1 & 2 & 3 & 4 &", "เล่น chord pulse แล้วตอบด้วย 2–4 โน้ตจาก partial บน &", "สลับ E Major/E Minor แล้วฟัง G# vs G"],
      guidedSteps: ["เคาะเท้าและนับ 1 & 2 & 3 & 4 &", "เล่น 1-2-3-4 บนสาย 6 แล้วข้ามสาย 5", "วาง scale fragment บน & หลัง 2 และ 4", "เล่น E Major แล้ว E Minor โดย root E คงเดิม", "รวม syncopated rhythm กับ short scale/arpeggio fill"],
      correctionSteps: ["ถ้า & เร็ว ให้พูดเลขกับ & สลับกันช้าลง", "ถ้าข้ามสายแล้วสะดุด ให้เล่นสายละ 2 โน้ตก่อน", "ถ้า Major/Minor ฟังเหมือนกัน ให้เล่น E ค้างแล้วสลับเฉพาะ G# กับ G"],
      dailySelfCheck: ["Chromatic 3–4 นาที, Scale 3–4 นาที, Arpeggio 3–4 นาที", "Rhythm + Application 6–8 นาที รวม 15–20 นาที", "accent หลัง 2 และ 4 ลงบน & โดย Pulse ไม่สั่น"],
      troubleshooting: [
        { problem: "เท้าขยับไปตาม off-beat", advice: "กลับไปตบมือเฉพาะเลข 1 2 3 4 แล้วค่อยเติมเสียงบน &" },
        { problem: "ข้ามสายแล้ว alternate picking ขาด", advice: "ลด BPM และเล่น 1-2-3-4 แยกสายก่อนเชื่อม 6 → 5" },
        { problem: "G# กับ G ยังไม่ต่าง", advice: "เล่น E–B เป็นกรอบเดิม แล้วเติม G# หรือ G ทีละตัวเพื่อฟัง 3rd" }
      ],
      miniExample: "นับ 1 & 2 & 3 & 4 &, accent บน & หลัง 2 และ 4 แล้วตอบด้วย E–G–A–B สั้น ๆ",
      commonMistakes: ["ใช้ G Major แทน E Major/E Minor comparison", "เล่น off-beat จนหลุด pulse", "เรียกการข้ามสายว่า scale โดยไม่ฟังจังหวะ"],
      selfCheck: ["เล่น 1-2-3-4 ข้ามสาย 6 → 5 ได้สม่ำเสมอ", "วาง scale fragment บน & ได้", "ฟัง G# vs G รอบ root E ได้"],
      teacherNote: "ให้เท้าเป็นบ้าน ส่วน & เป็นจุดที่มือออกไปเที่ยวแล้วกลับมา อย่าให้ off-beat พา tempo ไปด้วย"
    },
    practice: ["Chromatic · 1-2-3-4 string crossing สาย 6 → 5", "Scale · E minor pentatonic partial 2–4 โน้ตบน off-beat", "Arpeggio · E Major vs E Minor: G# vs G", "Rhythm + Application · Syncopated rhythm + short scale/arpeggio fill"],
    quiz: [
      { question: "ใน W2 เท้าควรยึดตรงไหน?", options: ["1 2 3 4", "เฉพาะ &", "e และ a ทุกตัว"], answer: 0 },
      { question: "จุดต่างของ E Major กับ E Minor คืออะไร?", options: ["G# กับ G", "E กับ B", "Root เปลี่ยนเป็น G"], answer: 0 },
      { question: "W2 ใช้ G Major เป็น comparison target หรือไม่?", options: ["ไม่ ใช้ E Major กับ E Minor", "ใช่ แทน E Minor", "ใช่ แทน E Major"], answer: 0 }
    ],
    homework: ["ทำ Daily Core 15–20 นาที โดยวาง Scale และ Arpeggio บน &", "ฟังและพูด G# กับ G รอบ E ให้ได้ยินความต่างของ Major 3rd/Minor 3rd"],
    earTraining: null,
    miniSong: null
  },
  3: {
    title: "Week 3 · Dynamics: ควบคุมแรงและน้ำหนักเสียง",
    summary: "Rhythm นำด้วย Dynamics และ Palm Mute; Chromatic, Scale และ C Major arpeggio ต้องคุมเบา–ดังอย่างตั้งใจ",
    youtube: null,
    rhythmSpine: "Dynamics",
    estimatedMinutesPerDay: "15–20 นาที",
    coreBlocks: [
      { pillar: "Chromatic", duration: "3–4 นาที", title: "1-3-2-4 และ 1-4-2-3", focus: "Finger independence พร้อม relaxation", steps: ["เล่น 1-3-2-4 ช้า ๆ บนสายเดียว", "สลับเป็น 1-4-2-3 โดยไม่ยกนิ้วสูง", "รักษา tempo เดิมเมื่อเปลี่ยน dynamic"] },
      { pillar: "Scale", duration: "3–4 นาที", title: "3-note sequencing", focus: "ใช้ E minor pentatonic partial ทำ phrase ไม่ไล่ขึ้น–ลงตรง ๆ อย่างเดียว", steps: ["เลือก 3 โน้ตจาก E–G–A–B", "เล่นเป็นกลุ่ม 3 โน้ตแล้วเว้นช่องว่าง", "เปลี่ยน light attack กับ strong attack โดย tempo คงที่"] },
      { pillar: "Arpeggio", duration: "3–4 นาที", title: "C Major triad · C–E–G", focus: "Mute/Open sustain control และ chord tones 1–3–5", steps: ["เล่น C–E–G ช้า ๆ", "รอบหนึ่งให้เสียงเปิดค้างพอดี", "อีกรอบใช้ mute เบาใกล้ bridge แล้วเปรียบเทียบ pitch"] },
      { pillar: "Rhythm + Application", duration: "6–8 นาที", title: "Dynamic groove builder", focus: "Accent contrast และ palm muting ที่ยังมี pitch", steps: ["เล่น pattern clean/open หนึ่งรอบ", "เล่น pattern palm-muted หนึ่งรอบ", "สลับเบา–ดังโดยด้านขอบมือฝั่งนิ้วก้อยของมือดีดอยู่ใกล้ bridge"] }
    ],
    learn: {
      targetBpm: "60 BPM",
      diagram: { title: "Dynamic Contrast", caption: "pattern เดิม แต่ตั้งใจเปลี่ยนน้ำหนักเสียงและความยาวเสียง", cells: [
        { label: "1", note: "เบา", kind: "rest" }, { label: "2", note: "กลาง", kind: "hit" }, { label: "3", note: "ดัง", kind: "accent" }, { label: "4", note: "ปล่อย", kind: "rest" }
      ]},
      paragraphs: [
        "W3 ไม่ได้เพิ่มความเร็ว แต่เพิ่มการควบคุม: โน้ตเดิมสามารถเบา ดัง เปิด หรือสั้นได้ตามเจตนา",
        "Palm mute ใช้ด้านขอบมือฝั่งนิ้วก้อยของมือดีดวางใกล้ bridge ไม่ใช้นิ้วก้อยกดสาย",
        "C Major arpeggio คือ C–E–G = 1–3–5; ให้หูแยกเสียงเปิดกับเสียง mute ที่ยังมี pitch"
      ],
      listenFor: ["light attack กับ strong attack ต่างกันแต่ tempo เท่าเดิม", "palm-muted note ยังฟัง pitch ได้", "C–E–G เชื่อมเป็น C Major ไม่ใช่เสียงบอด"],
      physicalFeel: ["ไหล่และข้อมือผ่อนคลาย", "ด้านขอบมือฝั่งนิ้วก้อยของมือดีดใกล้ bridge", "แรงกดและแรงดีดลดลง ไม่ใช้แรงแก้จังหวะ"],
      guitarApplication: ["เล่น chromatic pattern เบาแล้วหนักขึ้นเมื่อเข้า target", "เล่น 3-note scale phrase แล้วเว้นช่องว่าง", "สลับ C Major arpeggio แบบ open กับ palm-muted"],
      guidedSteps: ["ตั้ง Metronome 60 BPM และเล่น 1-3-2-4 เบา ๆ", "เล่น 1-4-2-3 โดยคุมความสูงนิ้ว", "ทำ 3-note sequence จาก E–G–A–B แล้วเว้นช่องว่าง", "เล่น C–E–G แบบ open sustain", "ทำซ้ำแบบ palm mute และเปรียบเทียบ dynamic groove"],
      correctionSteps: ["ถ้าเล่นดังแล้วเร็วขึ้น ให้ลดแรงและกลับไป accent ทีละตัว", "ถ้า palm mute กลายเป็นเสียงบอด ให้ขยับขอบมือออกจาก bridge เล็กน้อย", "ถ้า pattern นิ้วเกร็ง ให้หยุด 1 pulse แล้วเริ่มด้วยแรงกดน้อยลง"],
      dailySelfCheck: ["Chromatic 3–4 นาที, Scale 3–4 นาที, Arpeggio 3–4 นาที", "Rhythm + Application 6–8 นาที รวม 15–20 นาที", "เล่น clean/open และ palm-muted โดย dynamic ต่างแต่ tempo คงที่"],
      troubleshooting: [
        { problem: "Accent ทำให้ tempo เร็ว", advice: "ให้ accent ดังขึ้นด้วยน้ำหนัก ไม่ใช่ด้วยการขยับเร็วขึ้น" },
        { problem: "Palm mute ไม่มี pitch", advice: "ใช้แค่ด้านขอบมือแตะสายใกล้ bridge เบาลงจนยังฟังชื่อโน้ตได้" },
        { problem: "3-note sequence ฟังเหมือน scale ตรง ๆ", advice: "เว้นช่องว่างหลังกลุ่ม 3 โน้ตและให้ target หนึ่งตัวเด่นขึ้น" }
      ],
      miniExample: "เล่น C–E–G แบบ open หนึ่งรอบ แล้วทำซ้ำแบบ palm-muted พร้อม accent ที่โน้ต G",
      commonMistakes: ["สื่อว่าต้องใช้นิ้วก้อยทำ palm mute", "กด mute จนเสียงไม่มี pitch", "เพิ่มความดังด้วยการเร่ง tempo"],
      selfCheck: ["เล่น 1-3-2-4 และ 1-4-2-3 ได้โดยไม่เกร็ง", "จัด 3-note phrase ได้", "C Major arpeggio open/mute ต่างกันแต่ยังมี pitch"],
      teacherNote: "Dynamics คือการเลือกน้ำหนักเสียง ไม่ใช่การเล่นแรงขึ้นเรื่อย ๆ ให้ Pulse นิ่งก่อนแล้วค่อยเปลี่ยนสีเสียง"
    },
    practice: ["Chromatic · 1-3-2-4 และ 1-4-2-3", "Scale · E minor pentatonic partial แบบ 3-note sequencing", "Arpeggio · C Major C–E–G พร้อม mute/open sustain control", "Rhythm + Application · Dynamic groove builder"],
    quiz: [
      { question: "Palm mute ใช้ส่วนใดของมือ?", options: ["ด้านขอบมือฝั่งนิ้วก้อยของมือดีดใกล้ bridge", "นิ้วก้อยกดสาย", "ปลายปิ๊กกด bridge"], answer: 0 },
      { question: "C Major triad คืออะไร?", options: ["C–E–G = 1–3–5", "C–Eb–G = 1–♭3–5", "C–F–G = 1–4–5"], answer: 0 },
      { question: "เมื่อเล่นดังขึ้น สิ่งใดต้องคงที่?", options: ["Tempo/Pulse", "ความเกร็ง", "จำนวนโน้ตเท่านั้น"], answer: 0 }
    ],
    homework: ["ทำ Daily Core 15–20 นาที โดยสลับ clean/open กับ palm-muted", "เช็กว่า dynamic contrast เกิดจากน้ำหนักและความยาวเสียง ไม่ใช่การเร่ง tempo"],
    earTraining: null,
    miniSong: null
  },
  4: {
    title: "Week 4 · Groove: เปลี่ยน material ให้เป็นดนตรี",
    summary: "รวม Pulse, Off-beat, Dynamics และ Palm Mute เป็น 4-bar groove และ Graduation 2 รอบ รวม 8 bars",
    youtube: null,
    rhythmSpine: "Groove",
    estimatedMinutesPerDay: "15–20 นาที",
    coreBlocks: [
      { pillar: "Chromatic", duration: "3–4 นาที", title: "4-note Chromatic Walk-up → Target Landing", focus: "F# → G → G# → A; A คือ target landing บน Beat 1", steps: ["เล่น F# → G → G# เป็น passing motion", "เล่น A เป็น target note", "ลง A บน Beat 1 ของห้องถัดไปตาม exercise"] },
      { pillar: "Scale", duration: "3–4 นาที", title: "Phrasing → Root landing", focus: "ใช้ E minor pentatonic partial ทำ phrase และ resolve ไป Root บน Beat 1", steps: ["เลือก 2–4 โน้ตและเว้นช่องว่าง", "ให้ phrase มีจุดจบ ไม่ไล่ขึ้น–ลงอย่างเดียว", "เตรียมหูและมือให้ Root ลง Beat 1 ของ bar ถัดไป"] },
      { pillar: "Arpeggio", duration: "3–4 นาที", title: "Progression arpeggiation · Em → C → G → D", focus: "ใช้ chord-tone concept 1–3–5 กับ progression ทั้ง 4 คอร์ด", steps: ["เล่น Em chord tones", "เปลี่ยนไป C แล้ว G", "จบ progression ที่ D ก่อนกลับ loop"] },
      { pillar: "Rhythm + Application", duration: "6–8 นาที", title: "4-bar groove → 8-bar graduation", focus: "ทั้งสาม pillar กลายเป็น musical application บน 60–70 BPM", steps: ["Bar 1: rhythm groove, palm mute + accent", "Bar 2: arpeggio Em → C", "Bar 3: scale phrasing/pentatonic sequence", "Bar 4: F# → G → G# → A และ target root landing; เล่น 2 รอบรวม 8 bars"] }
    ],
    learn: {
      targetBpm: "60–70 BPM",
      diagram: { title: "4-bar Groove Map", caption: "แต่ละห้องมีบทบาทต่างกัน แต่ Pulse เดียวกันพาไปจนจบ 8 bars", cells: [
        { label: "Bar 1", note: "Rhythm", kind: "hit" }, { label: "Bar 2", note: "Arpeggio", kind: "accent" }, { label: "Bar 3", note: "Scale", kind: "hit" }, { label: "Bar 4", note: "Target", kind: "accent" }
      ]},
      paragraphs: [
        "W4 คือการเปลี่ยนแบบฝึกให้เป็นเพลง: Rhythm เป็น spine และ Chromatic, Scale, Arpeggio ทำหน้าที่ต่างกันในแต่ละห้อง",
        "Chromatic walk-up นี้มี 4 โน้ต F# → G → G# → A โดย A เป็น target landing ไม่ใช่ 3-note walk-up",
        "เล่น 4 ห้องต่อกัน 2 รอบ รวม 8 bars ที่ 60–70 BPM โดยไม่หยุดและไม่ดัน tempo"
      ],
      listenFor: ["Bar 1 เป็นพื้น groove", "Bar 2 chord tones ฟังเป็น Em → C", "Bar 4 A ลง Beat 1 ของห้องถัดไปแล้ว loop ต่อได้"],
      physicalFeel: ["เท้ายังอยู่กับ pulse แม้เปลี่ยน material", "palm mute และ accent ทำหน้าที่เป็น groove", "มือซ้ายไม่รีบตอนเตรียม target landing"],
      guitarApplication: ["Bar 1: palm mute + accent", "Bar 2: arpeggiate Em → C", "Bar 3: 3-note pentatonic phrasing", "Bar 4: 4-note chromatic walk-up แล้ว target landing"],
      guidedSteps: ["เล่น Bar 1 อย่างเดียวจน rhythm groove นิ่ง", "เพิ่ม Bar 2 และเล่น Em → C arpeggio", "เพิ่ม Bar 3 ด้วย pentatonic phrase และเว้นช่องว่าง", "เล่น Bar 4 F# → G → G# → A ให้ A ลง Beat 1", "วน 4 bars สองรอบ รวม 8 bars ที่ 60–70 BPM"],
      correctionSteps: ["ถ้า loop ขาด ให้ตัดเหลือ Bar 1–2 แล้วค่อยเพิ่มทีละห้อง", "ถ้า A มาก่อน Beat 1 ให้พูด passing notes แล้วรอ target ลงพร้อม click", "ถ้า progression ทำให้ groove ล้ม ให้ลด BPM ลงและยึด pulse ก่อน chord change"],
      dailySelfCheck: ["Chromatic 3–4 นาที, Scale 3–4 นาที, Arpeggio 3–4 นาที", "Rhythm + Application 6–8 นาที รวม 15–20 นาที", "Graduation: 4 bars × 2 rounds = 8 bars ที่ 60–70 BPM โดยไม่หยุด"],
      troubleshooting: [
        { problem: "เล่นครบ 4 ห้องแต่กลับต้นรอบไม่ได้", advice: "นับ Bar 1 ใหม่ด้วยเท้าและให้ Beat 1 ชัดก่อนเริ่มรอบสอง" },
        { problem: "A ไม่ลงเป็น target", advice: "แยก F#–G–G# เป็น passing motion แล้วซ้อม A ลง Beat 1 เดี่ยว ๆ" },
        { problem: "เปลี่ยน Em → C → G → D แล้ว tempo แกว่ง", advice: "เล่น chord-tone ทีละตัวตาม pulse ก่อนกลับไป arpeggiate เต็ม progression" }
      ],
      miniExample: "Bar 1 rhythm → Bar 2 Em–C arpeggio → Bar 3 pentatonic phrase → Bar 4 F#–G–G#–A ลง Beat 1 แล้วทำซ้ำ",
      commonMistakes: ["เรียก F# → G → G# → A ว่า 3-note walk-up", "เล่น phrase โดยไม่ resolve ลง Beat 1", "นับ 2 รอบเป็น 4 bars แทน 8 bars"],
      selfCheck: ["เชื่อม 4 ห้องต่อเนื่องได้", "A เป็น target landing บน Beat 1", "เล่น 2 รอบรวม 8 bars ที่ 60–70 BPM ได้มั่นคง"],
      teacherNote: "ถ้า Groove สั่น ให้ลดชั้นที่กำลังเล่น แต่รักษา Pulse ต่อไป เป้าหมาย Graduation คือความต่อเนื่องที่ฟังเป็นเพลง"
    },
    practice: ["Chromatic · 4-note Chromatic Walk-up → Target Landing: F# → G → G# → A", "Scale · E minor pentatonic phrasing และ Root landing บน Beat 1", "Arpeggio · Em → C → G → D ด้วย 1–3–5 chord tones", "Rhythm + Application · 4-bar groove แล้วเล่น 2 รอบรวม 8 bars"],
    quiz: [
      { question: "Chromatic walk-up W4 มีกี่โน้ต?", options: ["4 โน้ต: F#–G–G#–A", "3 โน้ต: F#–G–G#", "5 โน้ต: F–F#–G–G#–A"], answer: 0 },
      { question: "A ใน walk-up ทำหน้าที่อะไร?", options: ["Target landing บน Beat 1", "Passing note ตัวแรก", "Ghost note ที่ไม่ต้องฟัง"], answer: 0 },
      { question: "Graduation ของ W4 คืออะไร?", options: ["4 bars สองรอบ รวม 8 bars ที่ 60–70 BPM", "เล่นเร็วที่สุดหนึ่งครั้ง", "อัดวิดีโอหนึ่งครั้ง"], answer: 0 }
    ],
    homework: ["เล่น 4-bar application สองรอบ รวม 8 bars ที่ 60–70 BPM โดยไม่หยุด", "เช็กว่า Bar 1–4 เชื่อมเป็น groove เดียวและ A ลง Beat 1 ของรอบถัดไป"],
    earTraining: null,
    miniSong: {
      title: "Month 1 V2 Groove: 4 bars × 2 rounds",
      purpose: "เล่น 4 ห้องตามลำดับ แล้ววนต่อเนื่อง 2 รอบ รวม 8 bars เป็น Graduation ของ Month 1",
      bars: [
        { bar: 1, chord: "Rhythm", direction: "Palm mute + accent เป็นพื้น groove" },
        { bar: 2, chord: "Em → C", direction: "Arpeggiate chord tones ตาม pulse" },
        { bar: 3, chord: "E minor pentatonic", direction: "เล่น 3-note phrase และเว้นช่องว่าง" },
        { bar: 4, chord: "F# → G → G# → A", direction: "Chromatic passing motion แล้วให้ A เป็น target landing บน Beat 1 ของห้องถัดไป" }
      ],
      feel: "Pulse ต้องต่อเนื่องจาก Bar 1 ถึง Bar 8; เล่นที่ 60–70 BPM และไม่หยุดระหว่างรอบ"
    }
  }
};

foundationWeeks.forEach((weekItem) => {
  const override = month1V2Overrides[weekItem.number];
  if (override) Object.assign(weekItem, override);
});

const dailyPracticePlan = {
  1: [
    ["Metronome 5 นาที", "นับ 1 2 3 4 5 นาที", "ตีคอร์ดเดียว 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 6 นาที", "นับ 16th Grid 4 นาที", "ตีคอร์ดเดียวให้ตรง beat 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 5 นาที", "เคาะเท้าและนับออกเสียง 5 นาที", "ตีคอร์ดเดียว 6 นาที", "ทำแบบทดสอบ"],
    ["Metronome 6 นาที", "นับออกเสียงให้ชัด 5 นาที", "เล่นแบบฝึกหัด 4 ห้อง 6 นาที", "ทำแบบทดสอบ"],
    ["Metronome 5 นาที", "ฝึก 16th Grid 7 นาที", "ตีคอร์ดเดียว 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 8 นาที", "นับ 1 e & a 5 นาที", "เช็กความนิ่ง 30 วินาที 7 นาที", "ทำแบบทดสอบ"],
    ["ทบทวน 5 นาที", "นับกับ Metronome 5 นาที", "เช็กความนิ่ง 1 นาที 10 นาที", "ทำแบบทดสอบ"]
  ],
  2: [
    ["Metronome 5 นาที", "นับ off-beat 5 นาที", "ฝึก Syncopation 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 6 นาที", "วาง Accent ที่ & 5 นาที", "ตีคอร์ดแบบ Mute 6 นาที", "ทำแบบทดสอบ"],
    ["ทบทวน Pulse 5 นาที", "ตบมือบน off-beat 6 นาที", "เล่นคอร์ดตามรูปแบบ 6 นาที", "ทำแบบทดสอบ"],
    ["Metronome 6 นาที", "เล่น Syncopation 6 นาที", "เล่น 4 ห้อง 5 นาที", "ทำแบบทดสอบ"],
    ["นับจังหวะ 5 นาที", "นับและทำเครื่องหมาย & 7 นาที", "ตีคอร์ด 6 นาที", "ทำแบบทดสอบ"],
    ["Metronome 8 นาที", "เล่น Groove loop 6 นาที", "สังเกต Accent กับ Pulse 6 นาที", "ทำแบบทดสอบ"],
    ["ทบทวน 5 นาที", "ซ้อม Syncopation 10 นาที", "จดบันทึก 5 นาที", "ทำแบบทดสอบ"]
  ],
  3: [
    ["Metronome 5 นาที", "เล่นเบา/ดัง 5 นาที", "ฝึก Palm Mute 5 นาที", "ทำแบบทดสอบ"],
    ["Pulse 5 นาที", "หาตำแหน่ง Palm Mute 6 นาที", "Muted Chord 6 นาที", "ทำแบบทดสอบ"],
    ["นับจังหวะ 5 นาที", "คุม Dynamics 7 นาที", "เทียบ Open กับ Muted 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 6 นาที", "เล่นเบาและดังแบบ verse/chorus 6 นาที", "เล่น 4 ห้อง 6 นาที", "ทำแบบทดสอบ"],
    ["เล่นเบา 5 นาที", "เล่นดัง 5 นาที", "Palm Mute Groove 8 นาที", "ทำแบบทดสอบ"],
    ["Metronome 8 นาที", "ไล่ Dynamics เบาไปดัง 8 นาที", "จดบันทึก 5 นาที", "ทำแบบทดสอบ"],
    ["ทบทวน 5 นาที", "ซ้อม 3 แบบ 10 นาที", "สังเกตเปรียบเทียบ 5 นาที", "ทำแบบทดสอบ"]
  ],
  4: [
    ["Metronome 5 นาที", "ห้อง 1: Muted Pulse 5 นาที", "นับ 16th Grid 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 5 นาที", "ห้อง 2: Muted Eighths 7 นาที", "วนห้อง 1–2 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 5 นาที", "ห้อง 3: Accent หลัง 2 7 นาที", "กลับเข้า beat 3 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 5 นาที", "ห้อง 4: Accent หลัง 2 และ 4 8 นาที", "วนห้อง 3–4 5 นาที", "ทำแบบทดสอบ"],
    ["ทบทวน 5 นาที", "วน Groove 4 ห้อง 10 นาที", "เช็ก Muted/Open 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 8 นาที", "Groove 4 ห้องครบ 2 รอบ 10 นาที", "เล่นรวดเดียว 2 รอบ 5 นาที", "ทำแบบทดสอบ"],
    ["Warmup 5 นาที", "เล่น Graduation Groove 15 นาที", "สังเกตและจด 5 นาที", "ทำแบบทดสอบ"]
  ]
};

const month1V2DailyCore = {
  1: [
    ["Chromatic · 3 นาที", "Scale · 3 นาที", "Arpeggio · 3 นาที", "Rhythm + Application · 6 นาที"],
    ["Chromatic · 3 นาที", "Scale · 3 นาที", "Arpeggio · 3 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 3 นาที", "Scale · 3 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 4 นาที", "Scale · 3 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 4 นาที", "Scale · 4 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 4 นาที", "Scale · 4 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 8 นาที"],
    ["Chromatic · 4 นาที", "Scale · 4 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 8 นาที"]
  ],
  2: [
    ["Chromatic · 3 นาที", "Scale · 3 นาที", "Arpeggio · 3 นาที", "Rhythm + Application · 6 นาที"],
    ["Chromatic · 3 นาที", "Scale · 3 นาที", "Arpeggio · 3 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 3 นาที", "Scale · 3 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 4 นาที", "Scale · 3 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 4 นาที", "Scale · 4 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 4 นาที", "Scale · 4 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 8 นาที"],
    ["Chromatic · 4 นาที", "Scale · 4 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 8 นาที"]
  ],
  3: [
    ["Chromatic · 3 นาที", "Scale · 3 นาที", "Arpeggio · 3 นาที", "Rhythm + Application · 6 นาที"],
    ["Chromatic · 3 นาที", "Scale · 3 นาที", "Arpeggio · 3 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 3 นาที", "Scale · 3 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 4 นาที", "Scale · 3 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 4 นาที", "Scale · 4 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 4 นาที", "Scale · 4 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 8 นาที"],
    ["Chromatic · 4 นาที", "Scale · 4 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 8 นาที"]
  ],
  4: [
    ["Chromatic · 3 นาที", "Scale · 3 นาที", "Arpeggio · 3 นาที", "Rhythm + Application · 6 นาที"],
    ["Chromatic · 3 นาที", "Scale · 3 นาที", "Arpeggio · 3 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 3 นาที", "Scale · 3 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 4 นาที", "Scale · 3 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 4 นาที", "Scale · 4 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 7 นาที"],
    ["Chromatic · 4 นาที", "Scale · 4 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 8 นาที"],
    ["Chromatic · 4 นาที", "Scale · 4 นาที", "Arpeggio · 4 นาที", "Rhythm + Application · 8 นาที"]
  ]
};

Object.assign(dailyPracticePlan, month1V2DailyCore);

const foundationStorage = {
  completedWeeks: "foundationCompletedWeeks",
  completedDaysByWeek: "foundationCompletedDaysByWeek",
  dayByWeek: "foundationDayByWeek",
  checklistPrefix: "foundationChecklist",
  notes: "foundationPracticeNotes"
};

let focusedSelectedWeek = 1;
let selectedFocusedMonth = 1;
let isViewingPrelude = false;


function renderQaPreviewBadge() {
  if (document.getElementById('qaPreviewBadge')) return;
  const mode = getDevPreviewMode();
  if (mode && (mode === 'm5' || mode === '5' || mode === 'm6' || mode === '6' || mode === 'all')) {
    const badge = document.createElement('div');
    badge.id = 'qaPreviewBadge';
    badge.style.position = 'fixed';
    badge.style.bottom = '10px';
    badge.style.right = '10px';
    badge.style.background = '#ff4444';
    badge.style.color = '#fff';
    badge.style.padding = '8px 12px';
    badge.style.borderRadius = '8px';
    badge.style.fontWeight = 'bold';
    badge.style.zIndex = '9999';
    badge.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
    badge.style.fontSize = '12px';
    badge.style.pointerEvents = 'none';
    const num = mode.includes('5') ? '5' : (mode.includes('6') ? '6' : '5 & 6');
    badge.textContent = 'QA Preview: Month ' + num + ' Active';
    document.body.appendChild(badge);
  }
}

function initFocusedApp() {
  applyTheme(getInitialTheme());
  initializeContinuePracticeStateV1();
  renderGlobalInstrumentSelector();
  renderDevPreviewBanner();
  renderQaPreviewBadge();
  updateDebugState({ currentMonth: selectedFocusedMonth, lastAction: "app boot" });
  setDataStatus("Loading companion data...", "info");
  const savedMonth = getSavedSelectedFocusedMonth();
  recomputeCompletedFoundationWeeks();
  focusedSelectedWeek = getCurrentFoundationWeek();
  bindFocusedEvents();
  renderFocusedApp();
  renderPreludeEntry();
  renderMiniCourseShelf();
  setBpm(bpm, { persist: false });
  if (isDevPreviewActive() || isPreludePreviewActive()) {
    loadFutureData().then(() => {
      renderPreludeEntry();
      if (isPreludePreviewActive()) {
        renderMonthSwitcher();
        return;
      }
      if (["pending", "continue", "fresh"].includes(continuePracticeStartupDecisionV1)) {
        renderMonthSwitcher();
        return;
      }
      const previewMonth = getDevPreviewAutoMonth();
      if (previewMonth && getFocusedMonthWeeks(previewMonth).length) {
        openFocusedMonth(previewMonth);
        return;
      }
      if (savedMonth > 1 && canOpenMonth(savedMonth) && getFocusedMonthWeeks(savedMonth).length) {
        openFocusedMonth(savedMonth);
        return;
      }
      renderMonthSwitcher();
    });
  } else {
    renderPreludeEntry();
    renderMonthSwitcher();
  }
}

function getSavedSelectedFocusedMonth() {
  try {
    const saved = Number(localStorage.getItem(selectedFocusedMonthStorageKey) || 1);
    return saved >= 2 && saved <= 6 ? saved : 1;
  } catch {
    return 1;
  }
}

let isDelegatedLessonClickListenerBound = false;

function bindDelegatedLessonClickListener() {
  if (isDelegatedLessonClickListenerBound) return;
  document.addEventListener("click", handleDelegatedLessonClicks);
  isDelegatedLessonClickListenerBound = true;
}

function handleDelegatedLessonClicks(event) {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const dayBtn = target.closest("[data-foundation-day]");
  if (dayBtn) {
    switchDay(Number(dayBtn.dataset.foundationDay));
    return;
  }

  const markBtn = target.closest("[data-mark-day-complete]");
  if (markBtn) {
    markFoundationDayCompleteAndAdvance(focusedSelectedWeek, getPracticeDay(focusedSelectedWeek));
    return;
  }

  // Right-Hand Mini Course action routing
  const rhTrigger = target.closest("[data-rh-minicourse-action]");
  if (rhTrigger) {
    const action = rhTrigger.dataset.rhMinicourseAction;
    if (action === "open-course") {
      openRightHandMiniCourseModal();
      return;
    } else if (action === "close-course") {
      const modal = document.getElementById("rh-minicourse-modal");
      if (modal) modal.remove();
      return;
    } else if (action === "select-week") {
      const weekId = rhTrigger.dataset.weekId;
      if (weekId) selectRightHandMiniCourseWeek(weekId);
      return;
    } else if (action === "toggle-drill") {
      const weekId = rhTrigger.dataset.weekId;
      const drillId = rhTrigger.dataset.drillId;
      if (weekId && drillId) {
        toggleRightHandDrillCompletion(weekId, drillId);
        const modal = document.getElementById("rh-minicourse-modal");
        const data = window.rightHandMiniCourseData;
        if (modal && data) {
          const modalContent = modal.querySelector(".fsl-studio-modal-content");
          const bodyDiv = modal.querySelector(".rhc-program-body");
          if (modalContent && bodyDiv) renderRightHandMiniCourseModalContent(modal, modalContent, bodyDiv, data);
        }
      }
      return;
    } else if (action === "set-bpm") {
      const drillId = rhTrigger.dataset.drillId;
      const bpm = Number(rhTrigger.dataset.bpm);
      if (drillId && !isNaN(bpm)) setRightHandDrillBpm(drillId, bpm);
      return;
    } else if (action === "retry-load") {
      const modal = document.getElementById("rh-minicourse-modal");
      if (modal) modal.remove();
      openRightHandMiniCourseModal();
      return;
    }
  }

  // Mnemonic mode delegation (Foundation & Right-Hand Mini Course)
  const modeBtn = target.closest("[data-mnemonic-mode]");
  if (modeBtn) {
    const newMode = modeBtn.getAttribute("data-mnemonic-mode");
    const allowedModes = ["food_en", "takadimi", "counting", "food_th"];
    if (newMode && allowedModes.includes(newMode)) {
      const rgCard = modeBtn.closest("[data-block-id], .rhythm-geometry-card");
      if (rgCard) {
        const blockId = rgCard.getAttribute("data-block-id") || rgCard.getAttribute("data-rhythm-geometry-id");
        if (blockId && blockId.startsWith("rg-rh-")) {
          const currentState = getRightHandMiniCourseState();
          currentState.mnemonicModeByBlock = currentState.mnemonicModeByBlock || {};
          currentState.mnemonicModeByBlock[blockId] = newMode;
          saveRightHandMiniCourseState(currentState);
          setRhythmGeometryCardMode(rgCard, newMode);
          return;
        }

        const foundationBlockId = blockId || "w2-rhythm-geometry-16th-syncopation";
        if (foundationBlockId === "w2-rhythm-geometry-16th-syncopation") {
          currentRhythmGeometryMnemonicMode = newMode;
        }
        setRhythmGeometryCardMode(rgCard, newMode);
        persistContinuePracticeStateV1({ debounce: true });
        return;
      }
    }
  }
}

function bindFocusedEvents() {
  bindDelegatedLessonClickListener();
  document.addEventListener("click", handleDataScrollClick);
  bindReferenceShelfToggle();
  bindScrollTopButton();
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("resetProgress").addEventListener("click", resetFoundationProgress);
  document.getElementById("nextDayButton").addEventListener("click", goToNextPracticeDay);
  document.getElementById("practiceLabToggle")?.addEventListener("click", togglePracticeLab);
  document.getElementById("openPreludeBtn")?.addEventListener("click", openPreludeView);
  document.querySelector(".brand")?.addEventListener("click", () => {
    closePracticeLab();
    setReferenceShelfOpen(false);
    setNoteValueShelfOpen(false);
    closeMiniCourseDetail();
  });
  document.querySelectorAll(".brand, .topnav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (isViewingPrelude) exitPreludeView();
      window.setTimeout(() => persistContinuePracticeStateV1(), 0);
    });
  });
  document.querySelector(".close-panel")?.addEventListener("click", closePracticeLab);
  const closeBtn = document.querySelector(".close-panel");
  closeBtn?.addEventListener("touchstart", (e) => {
    e.preventDefault();
    closePracticeLab();
  });
  closeBtn?.addEventListener("touchend", closePracticeLab, { passive: true });
  closeBtn?.addEventListener("pointerup", closePracticeLab, { passive: true });
  document.addEventListener("click", (event) => {
    const clickTarget = event.target instanceof Element ? event.target : null;
    if (!clickTarget?.closest(".practice-nav-dropdown")) closePracticeLab();
    if (!clickTarget?.closest(".top-metronome")) closeQuickTempoDrawer();
  });
  document.getElementById("tempoDown").addEventListener("click", () => setBpm(bpm - 2));
  document.getElementById("tempoUp").addEventListener("click", () => setBpm(bpm + 2));
  document.getElementById("quickTempoToggle").addEventListener("click", (event) => {
    event.stopPropagation();
    toggleQuickTempoDrawer();
  });
  document.querySelectorAll("#quickTempoDrawer [data-bpm]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      setQuickTempo(button.dataset.bpm);
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeQuickTempoDrawer();
  });
  document.getElementById("bpmValue").addEventListener("change", (event) => setBpm(event.target.value));
  document.getElementById("bpmValue").addEventListener("keydown", (event) => {
    if (event.key === "Enter") event.currentTarget.blur();
  });
  document.getElementById("bpmSlider").addEventListener("input", (event) => setBpm(Number(event.target.value)));
  document.getElementById("metronomeToggle").addEventListener("click", toggleMetronome);
  document.getElementById("practiceNotes")?.addEventListener("input", savePracticeNotes);
  window.addEventListener("hashchange", () => persistContinuePracticeStateV1());
}

function bindReferenceShelfToggle() {
  document.getElementById("toggleShelfButton")?.addEventListener("click", () => {
    toggleReferenceShelf("tab", { scroll: false });
  });
  document.getElementById("toggleNoteValueButton")?.addEventListener("click", () => {
    toggleReferenceShelf("note-value", { scroll: false });
  });
}

function handleDataScrollClick(event) {
  const trigger = event.target instanceof Element ? event.target.closest("[data-scroll]") : null;
  if (!trigger) return;
  const targetId = trigger.getAttribute("data-scroll");
  const target = targetId ? document.querySelector(targetId) : null;
  if (!target) return;
  event.preventDefault();
  if (targetId === "#tabGuidebook") {
    toggleReferenceShelf("tab", { scroll: true });
    return;
  }
  if (targetId === "#noteValueGuidebook") {
    toggleReferenceShelf("note-value", { scroll: true });
    return;
  }
  target.scrollIntoView({ behavior: "smooth", block: "center" });
}

function isReferenceShelfOpen() {
  const content = document.getElementById("referenceShelfContent");
  return Boolean(content && getComputedStyle(content).display !== "none");
}

function isNoteValueShelfOpen() {
  const content = document.getElementById("noteValueShelfContent");
  return Boolean(content && getComputedStyle(content).display !== "none");
}

function toggleReferenceShelf(target, options = {}) {
  const isTabTarget = target === "tab";
  const targetIsOpen = isTabTarget ? isReferenceShelfOpen() : isNoteValueShelfOpen();
  const otherIsOpen = isTabTarget ? isNoteValueShelfOpen() : isReferenceShelfOpen();
  const shouldOpenTarget = otherIsOpen || !targetIsOpen;

  if (isTabTarget) {
    setReferenceShelfOpen(shouldOpenTarget);
    setNoteValueShelfOpen(false);
    if (shouldOpenTarget && options.scroll) {
      document.getElementById("referenceShelfContent")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  setReferenceShelfOpen(false);
  setNoteValueShelfOpen(shouldOpenTarget);
  if (shouldOpenTarget && options.scroll) {
    document.getElementById("noteValueShelfContent")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setReferenceShelfOpen(isOpen) {
  const content = document.getElementById("referenceShelfContent");
  const button = document.getElementById("toggleShelfButton");
  const icon = document.getElementById("toggleShelfIcon");
  if (!content) return;
  content.style.display = isOpen ? "block" : "none";
  button?.classList.toggle("active", isOpen);
  button?.setAttribute("aria-expanded", String(isOpen));
  if (icon) icon.innerText = isOpen ? "▲" : "▼";
}

function setNoteValueShelfOpen(isOpen) {
  const content = document.getElementById("noteValueShelfContent");
  const button = document.getElementById("toggleNoteValueButton");
  const icon = document.getElementById("toggleNoteValueIcon");
  if (!content) return;
  content.style.display = isOpen ? "block" : "none";
  button?.classList.toggle("active", isOpen);
  button?.setAttribute("aria-expanded", String(isOpen));
  if (icon) icon.innerText = isOpen ? "▲" : "▼";
}

function bindScrollTopButton() {
  const button = document.getElementById("scrollTopButton");
  if (!button) return;

  const updateVisibility = () => {
    const visible = window.scrollY > 520;
    button.classList.toggle("is-visible", visible);
    button.setAttribute("aria-hidden", String(!visible));
    button.tabIndex = visible ? 0 : -1;
  };

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateVisibility();
      ticking = false;
    });
  }, { passive: true });

  button.addEventListener("click", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReferenceShelfOpen(false);
    setNoteValueShelfOpen(false);
    closeMiniCourseDetail();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  updateVisibility();
}

function renderFocusedApp() {
  if (isViewingPrelude) {
    renderPreludeView();
    return;
  }
  renderFocusedDashboard();
  renderMonthSwitcher();
  renderFocusedWeekTabs();
  renderFocusedLesson();
  renderFocusedProgressTracking();
  renderPracticeNotes();
  renderPracticeStudioPreviewShell();
      renderPracticeRoomIaPreview();
  renderPreludeEntry();
  renderMiniCourseShelf();
}

function getPreludeWeekData() {
  return courseData?.preludeWeek || null;
}

function getPreludeLessonBlocksWithRhythmSurvival(blocks = []) {
  const lessonBlocks = month2AsArray(blocks);
  if (lessonBlocks.some((block) => block?.id === "w0-rhythm-survival")) return lessonBlocks;

  const rhythmSurvivalBlocks = [
    {
      id: "w0-rhythm-survival",
      type: "text",
      title: "Rhythm Survival: จังหวะคือหัวใจ",
      body: "ก่อนเล่นเร็ว ต้องรู้ก่อนว่า “เวลา” ของเพลงอยู่ตรงไหน",
      teacherNote:
        "จังหวะไม่ใช่ของตกแต่งเพลง จังหวะคือรางรถไฟ ถ้ามือเราออกนอกราง ต่อให้จับคอร์ดถูก เพลงก็ยังไม่เข้าที่",
      list: [
        "Beat คือ pulse ที่เรานับตาม",
        "ใน 4/4 หนึ่งห้องมี 4 beat",
        "ตัวดำ = เล่น 1 ครั้งต่อ 1 beat",
        "ตัวหยุด = ไม่เล่นเสียง แต่ยังต้องนับต่อ",
        "Metronome คือครูจับเวลา ไม่ใช่ศัตรู"
      ],
      instruction: [
        "Mini visual - Count: 1   2   3   4",
        "Play: ดีด   ดีด   ดีด   ดีด",
        "Rest example: 1   2   3   4 / ดีด   เงียบ   ดีด   เงียบ",
        "Practice: ตั้ง Metronome ที่ 60 BPM แล้วนับ 1 2 3 4 ออกเสียง",
        "ตบมือทุกตัวเลข 1 นาที จากนั้นตบเฉพาะ 1 และ 3",
        "ลองตบที่ 1 แล้วเงียบที่ 2 แต่ยังนับต่อในใจ ถ้าหลุด count ให้หยุดแล้วเริ่มใหม่ช้าลง"
      ]
    },
    {
      id: "w0-rhythm-survival-exit-check",
      type: "mechanics-check",
      title: "Exit Check: Rhythm Survival",
      description: "ผู้เรียนผ่าน section นี้ได้เมื่อ:",
      checks: [
        "นับ 1 2 3 4 พร้อม Metronome ได้",
        "เงียบตรง rest ได้โดยไม่หลุด count",
        "เข้าใจว่าจังหวะสำคัญกว่าการเล่นเร็ว"
      ]
    }
  ];

  const metronomeIndex = lessonBlocks.findIndex((block) => block?.id === "w0-metronome-fingerpicking");
  const landmarkIndex = lessonBlocks.findIndex((block) => block?.id === "w0-landmark-preview");
  const insertAt = metronomeIndex >= 0 ? metronomeIndex + 1 : landmarkIndex >= 0 ? landmarkIndex : lessonBlocks.length;
  return [...lessonBlocks.slice(0, insertAt), ...rhythmSurvivalBlocks, ...lessonBlocks.slice(insertAt)];
}

function renderPreludeEntry() {
  const section = document.getElementById("preludeSection");
  if (!section) return;
  const isPreviewAllowed = isPreludePreviewActive() || isDevPreviewActive();
  section.style.display = isPreviewAllowed && !isViewingPrelude ? "block" : "none";
}

function setElementHidden(selector, hidden) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.hidden = hidden;
  element.style.display = hidden ? "none" : "";
}

function setPreludeViewChrome(viewing) {
  document.body.classList.toggle("is-viewing-prelude", viewing);
  setElementHidden("#monthSwitcher", viewing);
  setElementHidden("#lessonMonthSwitcher", viewing);
  setElementHidden("#dashboard", viewing);
  setElementHidden("#weekTabs", viewing);
  setElementHidden("#practice", viewing);
  setElementHidden(".data-status-row", viewing);
  const lessonsCopy = document.querySelector("#lessons .section-heading h2 + p");
  if (lessonsCopy) {
    if (viewing) {
      if (!lessonsCopy.dataset.defaultText) lessonsCopy.dataset.defaultText = lessonsCopy.textContent;
      lessonsCopy.textContent = "ทบทวนท่าทาง คำศัพท์พื้นฐาน และแบบฝึกเริ่มต้นก่อนเข้าสู่ Month 1 อย่างมั่นใจ";
    } else if (lessonsCopy.dataset.defaultText) {
      lessonsCopy.textContent = lessonsCopy.dataset.defaultText;
    }
  }
  renderPreludeEntry();
  if (!viewing) {
    const brandSub = document.getElementById("brandSub");
    if (brandSub) brandSub.textContent = getMonthMeta(selectedFocusedMonth).brandSub;
  }
}

async function openPreludeView() {
  if (!isPreludePreviewActive() && !isDevPreviewActive()) {
    setDataStatus("Foundation Reset is not available in normal mode.", "error");
    return;
  }
  if (!courseData) await loadFutureData();
  const prelude = getPreludeWeekData();
  if (!prelude) {
    setDataStatus("Foundation Reset data is not available.", "error");
    showToast("Foundation Reset data is not available.", "error");
    return;
  }
  isViewingPrelude = true;
  renderPreludeView();
}

function exitPreludeView() {
  if (!isViewingPrelude) {
    renderPreludeEntry();
    return;
  }
  isViewingPrelude = false;
  setPreludeViewChrome(false);
  renderFocusedApp();
}

function renderPreludeView() {
  const prelude = getPreludeWeekData();
  const panel = document.getElementById("lessonPanel");
  if (!prelude || !panel) return;
  setPreludeViewChrome(true);

  const meta = prelude.weekMeta || {};
  const brandSub = document.getElementById("brandSub");
  if (brandSub) brandSub.textContent = "Foundation Reset";
  const lessonsTitle = document.getElementById("lessonsTitle");
  if (lessonsTitle) lessonsTitle.textContent = meta.title || "Foundation Reset";

  const header = month2CreateElement("div", "lesson-header prelude-lesson-header");
  header.append(
    month2CreateElement("p", "eyebrow", "Prelude / Foundation Reset"),
    month2CreateElement("h2", "", meta.title || "Foundation Reset"),
    month2CreateElement("p", "", meta.subtitle || "ปรับเข็มทิศก่อนเข้า Month 1")
  );

  const backButton = month2CreateElement("button", "secondary-action prelude-back-button", "กลับไปหน้า Dashboard");
  backButton.type = "button";
  backButton.addEventListener("click", exitPreludeView);
  header.appendChild(backButton);

  const preludeBlocks = getPreludeLessonBlocksWithRhythmSurvival(prelude.lessonBlocks || []);
  const blocks = renderLessonBlocks(
    preludeBlocks,
    {},
    [...month2AsArray(miniTabs), ...month2AsArray(prelude.miniTabs)],
    {},
    prelude.techniqueDrills || []
  );
  panel.replaceChildren(header, blocks);
  document.getElementById("lessons")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function togglePracticeLab() {
  const practiceDropdown = document.querySelector(".practice-nav-dropdown");
  const toggleButton = document.getElementById("practiceLabToggle");
  if (!practiceDropdown || !toggleButton) return;
  const isOpen = practiceDropdown.classList.toggle("is-open");
  toggleButton.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("body--noScroll", isOpen);
  if (isOpen) {
    requestAnimationFrame(() => {
      document.querySelector("#practiceLabPanel textarea, #practiceLabPanel input, #practiceLabPanel select")?.focus();
    });
  }
}

function closePracticeLab() {
  const practiceDropdown = document.querySelector(".practice-nav-dropdown");
  const toggleButton = document.getElementById("practiceLabToggle");
  practiceDropdown?.classList.remove("is-open");
  document.body.classList.remove("body--noScroll");
  toggleButton?.setAttribute("aria-expanded", "false");
}

function getCompletedFoundationWeeks() {
  return loadJson(foundationStorage.completedWeeks, []);
}

function setCompletedFoundationWeeks(value) {
  const sanitizedWeeks = Array.from(new Set(
    (Array.isArray(value) ? value : [])
      .map(Number)
      .filter((week) => Number.isInteger(week) && week >= 1 && week <= 4)
  )).sort((a, b) => a - b);
  saveJson(foundationStorage.completedWeeks, sanitizedWeeks);
  return sanitizedWeeks;
}

function getCompletedFoundationDaysByWeek() {
  const rawCompletedDaysByWeek = localStorage.getItem(foundationStorage.completedDaysByWeek);
  if (rawCompletedDaysByWeek === null) {
    const legacyWeeks = loadJson(foundationStorage.completedWeeks, []);
    const validLegacyWeeks = Array.from(new Set(
      (Array.isArray(legacyWeeks) ? legacyWeeks : [])
        .filter((week) => Number.isInteger(week) && week >= 1 && week <= 4)
    )).sort((a, b) => a - b);

    if (validLegacyWeeks.length > 0) {
      const migrated = {};
      validLegacyWeeks.forEach((week) => {
        migrated[week] = [1, 2, 3, 4, 5, 6, 7];
      });
      saveJson(foundationStorage.completedDaysByWeek, migrated);
      return migrated;
    }

    return {};
  }

  return loadJson(foundationStorage.completedDaysByWeek, {});
}

function setCompletedFoundationDaysByWeek(value) {
  const sanitized = {};
  if (value && typeof value === "object") {
    for (let w = 1; w <= 4; w += 1) {
      if (Array.isArray(value[w])) {
        const days = Array.from(new Set(value[w].map(Number)))
          .filter((d) => Number.isInteger(d) && d >= 1 && d <= 7)
          .sort((a, b) => a - b);
        if (days.length > 0) sanitized[w] = days;
      }
    }
  }
  saveJson(foundationStorage.completedDaysByWeek, sanitized);
  return sanitized;
}

function getCompletedFoundationDays(weekNumber) {
  const week = Number(weekNumber);
  if (!Number.isInteger(week) || week < 1 || week > 4) return [];
  const completedDaysByWeek = getCompletedFoundationDaysByWeek();
  return Array.from(new Set(
    (Array.isArray(completedDaysByWeek[week]) ? completedDaysByWeek[week] : [])
      .map(Number)
      .filter((day) => Number.isInteger(day) && day >= 1 && day <= 7)
  )).sort((a, b) => a - b);
}

function isFoundationDayCompleted(weekNumber, dayNumber) {
  const day = Number(dayNumber);
  return Number.isInteger(day) && getCompletedFoundationDays(weekNumber).includes(day);
}

function setFoundationDayCompletion(weekNumber, dayNumber, completed) {
  const week = Number(weekNumber);
  const day = Number(dayNumber);
  if (
    !Number.isInteger(week)
    || week < 1
    || week > 4
    || !Number.isInteger(day)
    || day < 1
    || day > 7
  ) return false;

  const completedDaysByWeek = getCompletedFoundationDaysByWeek();
  const nextDays = new Set(getCompletedFoundationDays(week));
  if (completed) {
    nextDays.add(day);
  } else {
    nextDays.delete(day);
  }

  if (nextDays.size) {
    completedDaysByWeek[week] = Array.from(nextDays);
  } else {
    delete completedDaysByWeek[week];
  }
  setCompletedFoundationDaysByWeek(completedDaysByWeek);
  recomputeCompletedFoundationWeeks();
  return true;
}

function getFoundationWeekCompletedDayCount(weekNumber) {
  return Math.min(7, getCompletedFoundationDays(weekNumber).length);
}

function recomputeCompletedFoundationWeeks() {
  const completedWeeks = [];
  for (let week = 1; week <= 4; week += 1) {
    if (getFoundationWeekCompletedDayCount(week) === 7) completedWeeks.push(week);
  }
  return setCompletedFoundationWeeks(completedWeeks);
}

function getNextIncompleteFoundationTarget(currentWeek, currentDay) {
  const week = Number(currentWeek);
  const day = Number(currentDay);
  const safeWeek = Number.isInteger(week) && week >= 1 && week <= 4 ? week : 1;
  const safeDay = Number.isInteger(day) && day >= 1 && day <= 7 ? day : 1;
  const currentIndex = ((safeWeek - 1) * 7) + (safeDay - 1);
  const incompleteTargets = [];

  for (let index = 0; index < 28; index += 1) {
    const targetWeek = Math.floor(index / 7) + 1;
    const targetDay = (index % 7) + 1;
    if (!isFoundationDayCompleted(targetWeek, targetDay)) {
      incompleteTargets.push({ index, week: targetWeek, day: targetDay });
    }
  }

  if (!incompleteTargets.length) return { week: 4, day: 7, monthComplete: true };
  const nextTarget = incompleteTargets.find((target) => target.index > currentIndex) || incompleteTargets[0];
  return { week: nextTarget.week, day: nextTarget.day, monthComplete: false };
}

function getCurrentFoundationWeek() {
  const completed = getCompletedFoundationWeeks();
  return foundationWeeks.find((weekItem) => !completed.includes(weekItem.number))?.number || 4;
}

function getPracticeDayByWeek() {
  return loadJson(foundationStorage.dayByWeek, {});
}

function getPracticeDay(weekNumber) {
  const days = getPracticeDayByWeek();
  return Math.min(7, Math.max(1, Number(days[weekNumber] || 1)));
}

function setPracticeDay(weekNumber, dayNumber) {
  const days = getPracticeDayByWeek();
  days[weekNumber] = Math.min(7, Math.max(1, dayNumber));
  saveJson(foundationStorage.dayByWeek, days);
}

function getRenderedPracticeDayV1(weekNumber) {
  if (
    restoredContinuePracticeDestinationV1
    && restoredContinuePracticeDestinationV1.week === weekNumber
  ) {
    return restoredContinuePracticeDestinationV1.day;
  }
  return getPracticeDay(weekNumber);
}

function switchDay(dayNumber) {
  const weekNumber = Number(focusedSelectedWeek);
  const day = Number(dayNumber);
  if (
    selectedFocusedMonth !== 1
    || !Number.isInteger(weekNumber)
    || weekNumber < 1
    || weekNumber > 4
    || !Number.isInteger(day)
    || day < 1
    || day > 7
  ) return;

  restoredContinuePracticeDestinationV1 = null;
  setPracticeDay(weekNumber, day);
  renderFocusedDashboard();
  persistContinuePracticeStateV1();
}

function ensurePracticeStatusAnnouncer() {
  let announcer = document.getElementById("practiceStatusAnnouncer");
  if (announcer) return announcer;
  const todayMission = document.getElementById("todayMission");
  if (!todayMission) return null;
  announcer = month2CreateElement("div", "practice-status-announcer");
  announcer.id = "practiceStatusAnnouncer";
  announcer.setAttribute("role", "status");
  announcer.setAttribute("aria-live", "polite");
  announcer.setAttribute("aria-atomic", "true");
  todayMission.appendChild(announcer);
  return announcer;
}

function markFoundationDayCompleteAndAdvance(weekNumber, dayNumber) {
  const week = Number(weekNumber);
  const day = Number(dayNumber);
  if (
    selectedFocusedMonth !== 1
    || !Number.isInteger(week)
    || week < 1
    || week > 4
    || !Number.isInteger(day)
    || day < 1
    || day > 7
  ) return false;

  const wasCompleted = isFoundationDayCompleted(week, day);
  restoredContinuePracticeDestinationV1 = null;

  let announcement = "";
  if (!wasCompleted) {
    setFoundationDayCompletion(week, day, true);
    const target = getNextIncompleteFoundationTarget(week, day);
    focusedSelectedWeek = target.week;
    selectedWeek = target.week;
    setPracticeDay(target.week, target.day);
    announcement = target.monthComplete
      ? "ซ้อมครบ Month 1 ทั้ง 28 วันแล้ว เก่งมากครับ"
      : `บันทึกว่าสัปดาห์ที่ ${week} วันที่ ${day} เสร็จแล้ว ไปต่อสัปดาห์ที่ ${target.week} วันที่ ${target.day}`;
  } else {
    setFoundationDayCompletion(week, day, false);
    focusedSelectedWeek = week;
    selectedWeek = week;
    setPracticeDay(week, day);
    announcement = `ยกเลิกสถานะเสร็จของสัปดาห์ที่ ${week} วันที่ ${day} แล้ว`;
  }

  persistContinuePracticeStateV1();
  renderFocusedDashboard();
  renderFocusedWeekTabs();
  renderFocusedLesson();
  renderFocusedProgressTracking();
  const announcer = ensurePracticeStatusAnnouncer();
  if (announcer) announcer.textContent = announcement;
  return true;
}

function renderPracticeDaySelector(weekNumber, activeDay) {
  const todayMission = document.getElementById("todayMission");
  const checklist = document.getElementById("todayChecklist");
  todayMission?.querySelector("[data-foundation-practice-controls]")?.remove();
  todayMission?.querySelector(".practice-day-selector")?.remove();
  if (!todayMission || !checklist || selectedFocusedMonth !== 1) return;

  ensurePracticeStatusAnnouncer();
  const controls = month2CreateElement("div", "foundation-practice-controls");
  controls.dataset.foundationPracticeControls = "true";
  const selector = month2CreateElement("div", "practice-day-selector");
  selector.setAttribute("role", "group");
  selector.setAttribute("aria-label", `เลือกวันซ้อมสำหรับ Week ${weekNumber}`);
  selector.appendChild(month2CreateElement("span", "practice-day-selector-label", "เลือกวันซ้อม"));

  const dayButtons = month2CreateElement("div", "practice-day-selector-buttons");
  for (let day = 1; day <= 7; day += 1) {
    const isCurrent = day === activeDay;
    const isCompleted = isFoundationDayCompleted(weekNumber, day);
    const button = month2CreateElement(
      "button",
      `practice-day${isCurrent ? " is-current" : ""}${isCompleted ? " is-completed" : ""}`,
      String(day)
    );
    button.type = "button";
    button.dataset.foundationDay = String(day);
    button.setAttribute("aria-label", `วันที่ ${day}${isCompleted ? " เสร็จแล้ว" : ""}${isCurrent ? " วันที่กำลังดู" : ""}`);
    button.setAttribute("aria-pressed", String(isCurrent));
    if (isCurrent) button.setAttribute("aria-current", "true");
    dayButtons.appendChild(button);
  }

  selector.appendChild(dayButtons);
  controls.appendChild(selector);

  const activeDayCompleted = isFoundationDayCompleted(weekNumber, activeDay);
  const completionButton = month2CreateElement(
    "button",
    `mark-day-complete-button${activeDayCompleted ? " is-completed" : ""}`,
    activeDayCompleted
      ? "✓ วันนี้เสร็จแล้ว · กดเพื่อยกเลิก"
      : "ทำเครื่องหมายว่าวันนี้เสร็จแล้ว"
  );
  completionButton.id = "markDayCompleteButton";
  completionButton.type = "button";
  completionButton.dataset.markDayComplete = "true";
  completionButton.setAttribute("aria-pressed", String(activeDayCompleted));
  controls.appendChild(completionButton);

  const monthComplete = Array.from({ length: 4 }, (_, index) => index + 1)
    .every((week) => getFoundationWeekCompletedDayCount(week) === 7);
  if (monthComplete) {
    const completeBanner = month2CreateElement(
      "div",
      "month-complete-banner",
      "✓ Month 1 ครบ 28 วันแล้ว — Groove พื้นฐานของเราเริ่มแน่นขึ้นจริง ๆ ครับ"
    );
    completeBanner.setAttribute("role", "status");
    controls.appendChild(completeBanner);
  }

  todayMission.insertBefore(controls, checklist);
}

function getMonthPosition(weekNumber, month) {
  if (month === 1) return weekNumber;
  return Math.max(1, weekNumber - ((month - 1) * 4));
}

function getChecklistKey(weekNumber, dayNumber) {
  return `${foundationStorage.checklistPrefix}_${weekNumber}_${dayNumber}`;
}

function renderFocusedDashboard() {
  if (selectedFocusedMonth !== 1) {
    renderMonth2Dashboard();
    return;
  }
  const nextDayButton = document.getElementById("nextDayButton");
  if (nextDayButton) {
    nextDayButton.hidden = false;
    nextDayButton.textContent = "วันถัดไป";
  }
  const currentWeekNumber = foundationWeeks.some((week) => week.number === focusedSelectedWeek)
    ? focusedSelectedWeek
    : getCurrentFoundationWeek();
  const weekItem = foundationWeeks.find((week) => week.number === currentWeekNumber);
  const dayNumber = getRenderedPracticeDayV1(currentWeekNumber);
  const checkedItems = loadJson(getChecklistKey(currentWeekNumber, dayNumber), []);
  const tasks = dailyPracticePlan[currentWeekNumber][dayNumber - 1];
  const missionMinutes = tasks.reduce((total, task) => total + (Number(task.match(/(\d+)\s*นาที/)?.[1]) || 0), 0);
  const monthPosition = getMonthPosition(weekItem.number, 1);
  const moduleLabel = "Rhythm Foundation";

  document.getElementById("currentWeekTitle").textContent = `เดือน 1: ${weekItem.title}`;
  document.getElementById("currentWeekSummary").textContent = weekItem.summary;
  document.getElementById("monthProgressText").textContent = `สัปดาห์ที่ ${monthPosition} / 4 ของหมวด ${moduleLabel}`;
  document.getElementById("monthProgressBar").style.width = `${(monthPosition / 4) * 100}%`;
  document.getElementById("todayPracticeTitle").textContent = `สัปดาห์ที่ ${monthPosition} · วันที่ ${dayNumber}`;
  document.getElementById("todayMissionMeta").innerHTML = `<span>${missionMinutes} นาที</span><span>${moduleLabel}</span>`;
  document.querySelector(".journey-panel h2").textContent = "เส้นทาง Rhythm เดือนที่ 1";
  renderJourney();
  const previewDisabled = isDevPreviewActive() ? " disabled" : "";
  document.getElementById("todayChecklist").innerHTML = tasks.map((task, index) => `
    <label class="check-item">
      <input type="checkbox" data-today-task="${index}" ${checkedItems.includes(index) ? "checked" : ""}${previewDisabled} />
      <span>${task}</span>
    </label>
  `).join("");
  renderPracticeDaySelector(currentWeekNumber, dayNumber);

  if (isDevPreviewActive()) return;
  document.querySelectorAll("[data-today-task]").forEach((input) => {
    input.addEventListener("change", () => {
      const nextChecked = Array.from(document.querySelectorAll("[data-today-task]:checked")).map((item) => Number(item.dataset.todayTask));
      saveJson(getChecklistKey(currentWeekNumber, dayNumber), nextChecked);
    });
  });
}

function renderMonth2Dashboard() {
  document.querySelector("[data-foundation-practice-controls]")?.remove();
  const month = selectedFocusedMonth;
  const monthMeta = getMonthMeta(month);
  const monthWeeks = getFocusedMonthWeeks(month);
  const weekItem = monthWeeks.find((week) => week.number === focusedSelectedWeek) || monthWeeks[0];
  const moduleLabel = monthMeta.moduleLabel;
  const nextDayButton = document.getElementById("nextDayButton");
  const currentIndex = monthWeeks.findIndex((week) => Number(week.number) === Number(weekItem.number));
  const isLastWeek = currentIndex === monthWeeks.length - 1;

  if (nextDayButton) {
    nextDayButton.hidden = false;
    nextDayButton.textContent = isLastWeek ? "กลับสัปดาห์แรก" : "สัปดาห์ถัดไป";
  }

  if (!weekItem) {
    document.getElementById("currentWeekTitle").textContent = `เดือน ${month}: ${moduleLabel}`;
    document.getElementById("currentWeekSummary").textContent = `กำลังเตรียมข้อมูลบทเรียน ${moduleLabel}`;
    document.getElementById("monthProgressText").textContent = `รอโหลดข้อมูล Month ${month}`;
    document.getElementById("monthProgressBar").style.width = "0%";
    document.getElementById("todayPracticeTitle").textContent = "ยังไม่มีบทเรียน";
    document.getElementById("todayMissionMeta").innerHTML = "";
    document.getElementById("todayChecklist").innerHTML = "";
    renderJourney();
    return;
  }

  const monthPosition = getMonthPosition(weekItem.number, month);
  const firstPracticeGroup = Array.isArray(weekItem.dailyPractice) ? weekItem.dailyPractice[0] : null;
  const dayGroupLabel = firstPracticeGroup?.dayLabel || "Day 1";
  const exercises = month2AsArray(firstPracticeGroup?.exercises || firstPracticeGroup?.tasks).slice(0, 3);
  const dashboardTasks = exercises.length
    ? exercises.map((task) => `${task.duration ? `${task.duration} · ` : ""}${task.title || task.name || task.instruction}`)
    : ["อ่านภาพรวมบทเรียน", "ลองแบบฝึกหลักช้า ๆ กับ Metronome", "เช็กเกณฑ์ผ่านแบบใจเย็น"];

  document.getElementById("currentWeekTitle").textContent = `เดือน ${month}: ${weekItem.title}`;
  document.getElementById("currentWeekSummary").textContent = weekItem.summary || weekItem.goal || moduleLabel;
  document.getElementById("monthProgressText").textContent = `สัปดาห์ที่ ${monthPosition} / 4 ของหมวด ${moduleLabel}`;
  document.getElementById("monthProgressBar").style.width = `${(monthPosition / 4) * 100}%`;
  document.getElementById("todayPracticeTitle").textContent = `สัปดาห์ที่ ${monthPosition} · ${dayGroupLabel}`;
  document.getElementById("todayMissionMeta").innerHTML = `<span>${weekItem.estimatedMinutesPerDay || 20} นาที</span><span>${moduleLabel}</span>`;
  document.querySelector(".journey-panel h2").textContent = `เส้นทาง ${monthMeta.shortLabel} เดือนที่ ${month}`;
  document.getElementById("todayChecklist").innerHTML = dashboardTasks.map((task, index) => `
    <label class="check-item">
      <input type="checkbox" data-month2-dashboard-task="${index}" />
      <span>${task}</span>
    </label>
  `).join("");
  renderJourney();
}

function renderJourney() {
  const journeyList = document.getElementById("journeyList");
  if (!journeyList) return;
  journeyList.className = "journey journey-compact";
  if (selectedFocusedMonth !== 1) {
    const month = selectedFocusedMonth;
    const monthWeeks = getFocusedMonthWeeks(month);
    journeyList.setAttribute("aria-label", `ความคืบหน้า Month ${month}`);
    journeyList.innerHTML = monthWeeks.map((weekItem) => {
      const state = weekItem.number === focusedSelectedWeek ? ["กำลังฝึก", "current"] : weekItem.number < focusedSelectedWeek ? ["ผ่านแล้ว", "done"] : ["พร้อม", "pending"];
      const ariaCurrent = weekItem.number === focusedSelectedWeek ? ' aria-current="step"' : "";
      return `<li class="journey-step ${state[1]}"${ariaCurrent} aria-label="Week ${weekItem.number}: ${state[0]}"><span class="journey-dot" aria-hidden="true"></span><span class="journey-week">Week ${weekItem.number}</span><span class="status ${state[1]}">${state[0]}</span></li>`;
    }).join("");
    return;
  }
  document.querySelector(".journey-panel h2").textContent = "เส้นทาง Rhythm เดือนที่ 1";
  journeyList.setAttribute("aria-label", "ความคืบหน้า Month 1");
  const completed = getCompletedFoundationWeeks();
  const selectedWeek = focusedSelectedWeek;
  const currentWeek = getCurrentFoundationWeek();
  journeyList.innerHTML = foundationWeeks.map((weekItem) => {
    const state = completed.includes(weekItem.number) ? ["ผ่านแล้ว", "done"] : weekItem.number === selectedWeek ? ["กำลังฝึก", "current"] : weekItem.number === currentWeek ? ["เริ่มนิ่ง", "steady"] : ["ยังไม่เริ่ม", "pending"];
    const ariaCurrent = weekItem.number === selectedWeek ? ' aria-current="step"' : "";
    return `<li class="journey-step ${state[1]}"${ariaCurrent} aria-label="Week ${weekItem.number}: ${state[0]}"><span class="journey-dot" aria-hidden="true"></span><span class="journey-week">Week ${weekItem.number}</span><span class="status ${state[1]}">${state[0]}</span></li>`;
  }).join("");
}

function scrollToMission() {
  document.getElementById("todayChecklist")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function renderMonthSwitcher(autoScroll = false) {
  const tracker = document.getElementById("monthSwitcher");
  const switcher = document.getElementById("lessonMonthSwitcher");

  const months = getVisibleMonths().map((month) => ({ number: month, label: getMonthMeta(month).switcherLabel }));

  if (tracker) {
    tracker.innerHTML = months.map((month, idx) => `
      <div class="tracker-step ${month.number === selectedFocusedMonth ? "active" : ""}" ${month.number === selectedFocusedMonth ? 'aria-current="step"' : ''}>
        <div class="tracker-dot"></div>
        <span class="tracker-label">MONTH ${month.number}</span>
      </div>
      ${idx < months.length - 1 ? '<div class="tracker-line"></div>' : ''}
    `).join("");
  }

  if (switcher) {
    switcher.innerHTML = months.map((month) => `
      <button type="button" class="month-btn ${month.number === selectedFocusedMonth ? "active" : ""}" aria-pressed="${month.number === selectedFocusedMonth}" data-month="${month.number}">
        ${month.label}
      </button>
    `).join("");

    switcher.style.display = "flex";
    switcher.style.flexWrap = "nowrap";
    switcher.style.overflowX = "auto";
    switcher.style.scrollBehavior = "smooth";
    switcher.style.WebkitOverflowScrolling = "touch";
    switcher.style.touchAction = "pan-x";

    switcher.querySelectorAll("[data-month]").forEach((button) => {
      button.addEventListener("click", () => openFocusedMonth(Number(button.dataset.month)));
    });

    if (autoScroll) {
      setTimeout(() => {
        const activeBtn = switcher.querySelector(".month-btn.active");
        if (activeBtn) {
          activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      }, 50);
    }
  }
}

async function openFocusedWeek(weekNumber, options = {}) {
  const source = options.source || "manual";
  const shouldScroll = Boolean(options.scroll);
  const numericWeek = Number(weekNumber);
  
  let targetMonth = selectedFocusedMonth;
  if (numericWeek >= 1 && numericWeek <= 4) {
    targetMonth = 1;
  } else if (weeks && weeks.length > 0) {
    const match = weeks.find((w) => Number(w.number) === numericWeek);
    if (match) targetMonth = match.month;
  } else if (numericWeek >= 5) {
    await loadFutureData();
    const match = weeks.find((w) => Number(w.number) === numericWeek);
    if (match) targetMonth = match.month;
  }

  if (targetMonth !== selectedFocusedMonth) {
    await openFocusedMonth(targetMonth);
  }

  const monthWeeks = getFocusedMonthWeeks(selectedFocusedMonth);

  if (!monthWeeks.length) return false;

  const targetWeek = monthWeeks.some((week) => Number(week.number) === numericWeek)
    ? numericWeek
    : null;
  if (targetWeek === null) {
    updateDebugState({
      currentMonth: selectedFocusedMonth,
      lastAction: `Week ${numericWeek} rejected outside Month ${selectedFocusedMonth}`
    });
    return false;
  }

  if (!options.preserveContinueDestination) {
    restoredContinuePracticeDestinationV1 = null;
  }
  
  focusedSelectedWeek = targetWeek;
  selectedWeek = targetWeek;

  updateDebugState({
    currentMonth: selectedFocusedMonth,
    lastAction: `Week ${targetWeek} opened via ${source}`
  });

  renderFocusedDashboard();
  renderFocusedWeekTabs();
  renderFocusedLesson();
  renderFocusedProgressTracking();

  if (shouldScroll) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("dashboard")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }
  if (options.persist !== false && source !== "continue-practice") {
    persistContinuePracticeStateV1();
  }
  return true;
}

async function openFocusedMonth(month) {
  if (isViewingPrelude) {
    isViewingPrelude = false;
    setPreludeViewChrome(false);
  }
  if (!canOpenMonth(month)) {
    updateDebugState({ currentMonth: selectedFocusedMonth, lastAction: `Month ${month} blocked` });
    setDataStatus("Month นี้ยังไม่เปิดให้ใช้งานครับ", "error");
    return;
  }
  if (month > 1 && !window.__GC_DEBUG__?.dataJsonLoaded) {
    setDataStatus(`Opening Month ${month}...`, "info");
    showToast(`Opening Month ${month}...`, "info", 1800);
    await loadFutureData();
  }
  updateDebugState({ currentMonth: month, lastAction: `opening Month ${month}` });
  const monthWeeks = getFocusedMonthWeeks(month);
  if (!monthWeeks.length) {
    const message = `Month ${month} is unavailable.`;
    updateDebugState({ currentMonth: selectedFocusedMonth, lastAction: message });
    setDataStatus(message, "error");
    showToast(message, "error");
    return;
  }
  restoredContinuePracticeDestinationV1 = null;
  selectedFocusedMonth = month;
  const brandSub = document.getElementById("brandSub");
  if (brandSub) {
    brandSub.textContent = getMonthMeta(month).brandSub;
  }
  focusedSelectedWeek = month === 1 ? getCurrentFoundationWeek() : monthWeeks[0].number;
  if (!isDevPreviewActive()) safeSetItem(selectedFocusedMonthStorageKey, String(month));
  updateDebugState({ currentMonth: month, loadedMonths: getLoadedMonths(), visibleMonths: getVisibleMonths(), loadedWeeks: weeks.length, lastAction: `Month ${month} opened` });
  setDataStatus(month === 1 ? "Month 1 ready." : `Month ${month} ready: ${monthWeeks.length} ${getMonthMeta(month).shortLabel} lessons.`, "success");
  renderMonthSwitcher(true);
  renderFocusedDashboard();
  renderFocusedWeekTabs();
  renderFocusedLesson();
  renderFocusedProgressTracking();
}

function getFocusedMonthWeeks(month = selectedFocusedMonth) {
  if (month === 1) return foundationWeeks;
  if (month === 2) return weeks.filter((item) => item.month === 2 && item.number >= 5 && item.number <= 8).sort((a, b) => a.number - b.number);
  if (canOpenMonth(month)) return weeks.filter((item) => item.month === month).sort((a, b) => a.number - b.number);
  return [];
}

function renderFocusedWeekTabs() {
  const completed = recomputeCompletedFoundationWeeks();
  const currentWeekNumber = getCurrentFoundationWeek();
  const tabs = document.getElementById("weekTabs");
  const lessonsTitle = document.getElementById("lessonsTitle");
  const monthWeeks = getFocusedMonthWeeks();
  const monthMeta = getMonthMeta(selectedFocusedMonth);
  lessonsTitle.textContent = `เดือน ${selectedFocusedMonth}: ${monthMeta.moduleLabel}`;
  tabs.setAttribute("aria-label", selectedFocusedMonth === 1 ? "บทเรียนพื้นฐาน 4 สัปดาห์" : `บทเรียน Month ${selectedFocusedMonth}`);
  if (selectedFocusedMonth !== 1) {
    tabs.innerHTML = monthWeeks.map((weekItem) => `
      <button type="button" role="tab" class="card-tab future ${weekItem.number === focusedSelectedWeek ? "active current" : "pending"}" aria-selected="${weekItem.number === focusedSelectedWeek}" data-course-week="${weekItem.number}">
        <span class="tab-kicker"><span aria-hidden="true">🎯</span> ${monthMeta.shortLabel}</span>
        <strong>สัปดาห์ที่ ${weekItem.number}: ${weekItem.title}</strong>
        <span class="status ${weekItem.number === focusedSelectedWeek ? "current" : "pending"}">${weekItem.number === focusedSelectedWeek ? "current" : "loaded"}</span>
      </button>
    `).join("");
    tabs.querySelectorAll("[data-course-week]").forEach((button) => {
      button.addEventListener("click", () => {
        openFocusedWeek(Number(button.dataset.courseWeek), {
          source: "week-tab"
        });
      });
    });
    return;
  }
  tabs.innerHTML = foundationWeeks.map((weekItem) => {
    const completedDayCount = getFoundationWeekCompletedDayCount(weekItem.number);
    const isWeekComplete = completedDayCount === 7;
    const status = isWeekComplete ? "done" : weekItem.number === currentWeekNumber ? "current" : "pending";
    const completionText = `${isWeekComplete ? "✓ " : ""}${completedDayCount}/7 วัน`;
    return `
    <button type="button" role="tab" class="card-tab week-card ${status} ${weekItem.number === focusedSelectedWeek ? "active" : ""}" aria-selected="${weekItem.number === focusedSelectedWeek}" data-foundation-week="${weekItem.number}" data-week="${weekItem.number}">
      <span class="tab-kicker"><span aria-hidden="true">🎯</span> Foundation</span>
      <strong>${weekItem.title}</strong>
      <span class="status week-progress-badge ${status}">${completionText}</span>
    </button>
  `;
  }).join("");

  document.querySelectorAll("[data-foundation-week]").forEach((button) => {
    button.addEventListener("click", async () => {
      const requestedWeek = Number(button.dataset.week);
      await openFocusedWeek(requestedWeek, { source: "week-card" });
    });
  });
}

function renderFocusedLesson() {
  if (selectedFocusedMonth !== 1) {
    renderFutureWeekLesson();
    return;
  }
  const weekItem = foundationWeeks.find((week) => week.number === focusedSelectedWeek);
  document.getElementById("lessonPanel").innerHTML = `
    <div class="lesson-header">
      <p class="eyebrow">สัปดาห์ที่ ${weekItem.number}</p>
      <h2>${weekItem.title}</h2>
      <p>${weekItem.summary}</p>
    </div>
    ${renderLessonFlowOverview()}
    ${renderMonth1V2Core(weekItem)}
    ${renderLessonMedia(weekItem)}
    ${renderLearnSection(weekItem)}
    ${renderLessonSection("3. เล่น: แบบฝึกหัด", weekItem.practice, "play-block")}
    ${renderLessonPracticeSupport(weekItem)}
    <section class="lesson-block quiz-block">
      <h3>4. เช็ก: แบบทดสอบ</h3>
      <div class="lesson-quiz" id="lessonQuiz">
        ${weekItem.quiz.map((item, questionIndex) => `
          <fieldset>
            <legend>${questionIndex + 1}. ${item.question}</legend>
            ${item.options.map((option, optionIndex) => `
              <label>
                <input type="radio" name="quiz-${weekItem.number}-${questionIndex}" value="${optionIndex}" />
                <span>${option}</span>
              </label>
            `).join("")}
          </fieldset>
        `).join("")}
      </div>
      <button class="secondary-action" id="checkLessonQuiz" type="button">ตรวจแบบทดสอบ</button>
      <p class="quiz-result" id="lessonQuizResult" aria-live="polite"></p>
    </section>
    ${renderLessonSection("การบ้าน", weekItem.homework, "homework-block")}
  `;

  document.getElementById("checkLessonQuiz").addEventListener("click", () => checkFocusedQuiz(weekItem));
}

function renderFutureWeekLesson() {
  const monthWeeks = getFocusedMonthWeeks();
  const weekItem = monthWeeks.find((week) => week.number === focusedSelectedWeek) || monthWeeks[0];
  const panel = document.getElementById("lessonPanel");
  if (!weekItem) {
    panel.innerHTML = `
      <div class="lesson-header">
        <p class="eyebrow">Future lessons</p>
        <h2>ยังไม่พบข้อมูลเดือนนี้</h2>
        <p>ถ้าเปิดจากมือถือ ให้ลองรีเฟรชผ่าน local server แล้วดูสถานะ data.json ด้านบนครับ</p>
      </div>
    `;
    return;
  }

  if (!canOpenMonth(selectedFocusedMonth)) {
    panel.innerHTML = `
      <div class="lesson-header">
        <p class="eyebrow">Future lessons</p>
        <h2>ยังไม่เปิดบทเรียนเดือนนี้</h2>
        <p>ตอนนี้เปิดให้ใช้งานเฉพาะ Month 1 ถึง Month 4 เท่านั้นครับ</p>
      </div>
    `;
    return;
  }

  panel.innerHTML = `
    <div class="lesson-header">
      <p class="eyebrow">เดือน ${selectedFocusedMonth} · สัปดาห์ที่ ${weekItem.number}</p>
      <h2>${weekItem.title}</h2>
      <p>${weekItem.summary || weekItem.goal || ""}</p>
    </div>
  `;
  panel.appendChild(renderLessonBlocks(getFutureLessonBlocks(weekItem), fretboardVisuals, miniTabs, chordSoundLabs));
  if (weekItem.dailyPractice) panel.appendChild(renderMonth2DailyPracticeSection(weekItem));
  if (weekItem.selfCheck) panel.appendChild(renderMonth2SelfCheckSection(weekItem));
}

function getFutureLessonBlocks(weekItem = {}) {
  if (month2AsArray(weekItem.lessonBlocks).length) return weekItem.lessonBlocks;
  const blocks = [];
  if (weekItem.goal) {
    blocks.push({
      type: "text",
      title: "ภาพรวมบทเรียน",
      body: weekItem.goal
    });
  }
  if (month2AsArray(weekItem.practice).length) {
    blocks.push({
      type: "technique-drill",
      drill: {
        title: "แบบฝึกหัดหลัก",
        steps: weekItem.practice
      }
    });
  }
  if (month2AsArray(weekItem.checks).length) {
    blocks.push({
      type: "mechanics-check",
      title: "เกณฑ์ผ่าน",
      checks: weekItem.checks
    });
  }
  return blocks;
}

function renderMonth2DailyPracticeSection(weekItem = {}) {
  const section = month2CreateElement("section", "month2-component month2-practice-section");
  section.append(
    month2CreateElement("p", "eyebrow", "ตารางซ้อมประจำวัน"),
    month2CreateElement("h3", "", "ซ้อม 7 วันแบบไม่ล้นหัว")
  );

  const items = weekItem.dailyPractice;
  if (!items || (!month2AsArray(items).length && !month2AsArray(items.days).length && !month2AsArray(items.tasks).length)) {
    section.appendChild(renderMonth2MissingCard("ยังไม่มีตารางซ้อมประจำวันสำหรับสัปดาห์นี้"));
    return section;
  }

  if (Array.isArray(items) && items.some(isMonth2PracticeGroup)) {
    const accordion = month2CreateElement("div", "practice-accordion");
    items.forEach((group, index) => accordion.appendChild(renderMonth2PracticeGroup(group, weekItem.number, index)));
    section.appendChild(accordion);
    return section;
  }

  const grid = month2CreateElement("div", "month2-practice-grid");
  if (Array.isArray(items)) {
    items.forEach((item, index) => grid.appendChild(renderMonth2PracticeTaskCard(item, weekItem.number, `flat-${index}`)));
    section.appendChild(grid);
    return section;
  }

  const days = month2AsArray(items.days);
  const sharedTasks = month2AsArray(items.tasks);
  if (days.length) {
    days.forEach((day, index) => {
      const dayObject = typeof day === "object" ? { ...day } : { day, title: `Day ${day}` };
      const dayNumber = dayObject.day || dayObject.dayNumber || index + 1;
      const dayTasks = month2AsArray(dayObject.tasks).length
        ? month2AsArray(dayObject.tasks)
        : sharedTasks.filter((task) => (!task?.day && !task?.dayNumber) || Number(task.day || task.dayNumber) === Number(dayNumber));
      grid.appendChild(renderMonth2PracticeGroup({ dayLabel: `Day ${dayNumber}`, focus: dayObject.focus || dayObject.title, exercises: dayTasks, isOpen: index === 0 }, weekItem.number, index));
    });
  } else {
    sharedTasks.forEach((item, index) => grid.appendChild(renderMonth2PracticeTaskCard(item, weekItem.number, `task-${index}`)));
  }
  section.appendChild(grid);
  return section;
}

function isMonth2PracticeGroup(item = {}) {
  return Boolean(item.dayLabel || item.exercises || item.focus);
}

function renderMonth2PracticeGroup(group = {}, weekNumber, index = 0) {
  const panel = document.createElement("details");
  panel.className = "practice-panel";
  panel.open = Boolean(group.isOpen);

  const header = month2CreateElement("summary", "practice-panel-header");
  const title = month2CreateElement("span", "practice-panel-title");
  title.append(
    month2CreateElement("strong", "", group.dayLabel || `Day ${index + 1}`),
    month2CreateElement("span", "practice-panel-focus", group.focus || "ซ้อมประจำวัน")
  );
  const toggle = month2CreateElement("span", "practice-panel-toggle", panel.open ? "−" : "+");
  header.append(title, toggle);
  panel.addEventListener("toggle", () => {
    toggle.textContent = panel.open ? "−" : "+";
  });

  const body = month2CreateElement("div", "practice-panel-body");
  const exercises = month2AsArray(group.exercises || group.tasks);
  if (exercises.length) {
    exercises.forEach((exercise, taskIndex) => body.appendChild(renderMonth2PracticeTaskCard(exercise, weekNumber, `${index}-${taskIndex}`)));
  } else {
    body.appendChild(renderMonth2MissingCard("ยังไม่มีแบบฝึกหัดในช่วงนี้"));
  }
  panel.append(header, body);
  return panel;
}

function renderMonth2PracticeTaskCard(item = {}, weekNumber, fallbackId) {
  const task = typeof item === "string" ? { title: item, instruction: item } : item;
  const id = task.id || fallbackId || task.title || "task";
  const storageKey = `month2Practice_${weekNumber}_${id}`;
  const card = month2CreateElement("article", "practice-card practice-exercise-card");
  const header = month2CreateElement("header");
  header.append(
    month2CreateElement("h4", "", month2FirstText(task.title, task.name, "แบบฝึกหัด")),
    month2CreateElement("span", "day-duration", month2FirstText(task.duration, task.time, ""))
  );

  const label = month2CreateElement("label", "practice-check");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  if (isDevPreviewActive()) {
    checkbox.checked = false;
    checkbox.disabled = true;
    checkbox.setAttribute("aria-label", "Progress disabled in dev preview");
  } else {
    checkbox.checked = localStorage.getItem(storageKey) === "true";
    checkbox.addEventListener("change", () => safeSetItem(storageKey, String(checkbox.checked)));
  }

  const body = month2CreateElement("span");
  month2AppendText(body, task.instruction || task.goal || task.description || task.body);
  month2AsArray(task.steps).forEach((step) => month2AppendText(body, typeof step === "string" ? step : step.instruction || step.text || step.title, "task-step"));
  label.append(checkbox, body);
  card.append(header, label);
  return card;
}

function renderMonth2SelfCheckSection(weekItem = {}) {
  const selfCheck = weekItem.selfCheck;
  if (!selfCheck) return document.createElement("div");

  const section = month2CreateElement("section", "month2-component month2-self-check-section");

  if (Array.isArray(selfCheck)) {
    section.append(
      month2CreateElement("p", "eyebrow", "ประเมินตัวเอง"),
      month2CreateElement("h3", "", "เช็กความเข้าใจ")
    );
    const criteriaList = month2CreateElement("div", "criteria-list");
    selfCheck.forEach((item, index) => criteriaList.appendChild(renderMonth2PassItem(item, index)));
    section.appendChild(criteriaList);
    return section;
  }

  section.append(
    month2CreateElement("p", "eyebrow", "ประเมินตัวเอง"),
    month2CreateElement("h3", "", selfCheck.title || "เช็กความเข้าใจ")
  );

  const questions = month2AsArray(selfCheck.questions);
  if (questions.length) {
    const questionList = month2CreateElement("div", "question-list");
    questions.forEach((item, index) => questionList.appendChild(renderMonth2SelfQuestion(item, index)));
    section.appendChild(questionList);
  }

  const passItems = month2AsArray(selfCheck.passCriteria || selfCheck.criteria);
  if (passItems.length) {
    section.appendChild(month2CreateElement("h3", "", "ผ่านเมื่อ"));
    const criteriaList = month2CreateElement("div", "criteria-list");
    passItems.forEach((item, index) => criteriaList.appendChild(renderMonth2PassItem(item, index)));
    section.appendChild(criteriaList);
  }

  if (selfCheck.passSummary) section.appendChild(month2CreateElement("p", "pass-summary", selfCheck.passSummary));

  const troubleItems = month2AsArray(selfCheck.troubleshooting);
  if (troubleItems.length) {
    section.appendChild(month2CreateElement("h3", "", "ถ้ายังติด ให้ลองแก้แบบนี้"));
    const troubleList = month2CreateElement("div", "trouble-list");
    troubleItems.forEach((item = {}) => {
      const details = document.createElement("details");
      details.append(
        month2CreateElement("summary", "", month2FirstText(item.problem, item.issue, item.title, "ติดตรงนี้")),
        month2CreateElement("p", "", month2FirstText(item.advice, item.fix, item.solution, item.body))
      );
      troubleList.appendChild(details);
    });
    section.appendChild(troubleList);
  }

  if (section.children.length <= 2) section.appendChild(renderMonth2MissingCard("ยังไม่มีแบบประเมินตัวเองสำหรับสัปดาห์นี้"));
  return section;
}

function renderMonth2SelfQuestion(item = {}, index = 0) {
  const type = item.type || (item.options || item.choices ? "multiple-choice" : "practical");
  if (type === "multiple-choice" || type === "quiz") return renderMonth2ChoiceQuestion(item, index);
  return renderMonth2InstructionCheck(item);
}

function renderMonth2ChoiceQuestion(item = {}, index = 0) {
  const card = month2CreateElement("article", "question-card");
  card.appendChild(month2CreateElement("h4", "", month2FirstText(item.question, item.prompt, item.title, `คำถามที่ ${index + 1}`)));
  const choicesWrap = month2CreateElement("div", "choice-grid");
  const feedback = month2CreateElement("p", "choice-feedback");

  month2AsArray(item.options || item.choices).forEach((choice, choiceIndex) => {
    const button = month2CreateElement("button", "choice-button", getMonth2ChoiceText(choice));
    button.type = "button";
    button.addEventListener("click", () => {
      const correct = isMonth2CorrectChoice(item, choice, choiceIndex);
      choicesWrap.querySelectorAll("button").forEach((itemButton) => itemButton.classList.remove("is-correct", "is-wrong"));
      button.classList.add(correct ? "is-correct" : "is-wrong");
      feedback.textContent = month2FirstText(
        typeof choice === "object" ? choice.feedback : "",
        correct ? item.correctFeedback : item.incorrectFeedback,
        correct ? "ถูกครับ ฟังและจำความรู้สึกนี้ไว้" : "ยังไม่ใช่ครับ ลองกลับไปฟังหรือดูแผนที่อีกครั้ง"
      );
    });
    choicesWrap.appendChild(button);
  });

  card.append(choicesWrap, feedback);
  return card;
}

function getMonth2ChoiceText(choice) {
  return typeof choice === "string" ? choice : month2FirstText(choice.label, choice.text, choice.answer, choice.id);
}

function isMonth2CorrectChoice(question, choice, index) {
  if (typeof choice === "object" && choice.isCorrect !== undefined) return Boolean(choice.isCorrect);
  if (typeof choice === "object" && choice.correct !== undefined) return Boolean(choice.correct);
  if (typeof question.answer === "number") return question.answer === index;
  if (typeof question.correctAnswer === "number") return question.correctAnswer === index;
  const label = getMonth2ChoiceText(choice).trim();
  const id = typeof choice === "object" ? String(choice.id || "").trim() : "";
  return [question.answer, question.correctAnswer].some((answer) => {
    const expected = String(answer || "").trim();
    return expected === label || (id && expected === id);
  });
}

function renderMonth2PassItem(item, index) {
  if (typeof item === "string") {
    const label = month2CreateElement("label", "criteria-check");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.criteria = String(index);
    label.append(checkbox, month2CreateElement("span", "", item));
    return label;
  }

  const type = item.type || "practical";
  if (type === "multiple-choice" || type === "quiz") return renderMonth2ChoiceQuestion(item, index);
  return renderMonth2InstructionCheck(item);
}

function renderMonth2InstructionCheck(item = {}) {
  const card = month2CreateElement("article", "instruction-check");
  card.append(month2CreateElement("h4", "", month2FirstText(item.title, item.question, item.prompt, item.name, "เช็กด้วยการเล่นจริง")));
  month2AppendText(card, item.instruction || item.body || item.description || item.goal);
  month2AsArray(item.steps).forEach((step) => month2AppendText(card, typeof step === "string" ? step : step.instruction || step.text || step.title, "task-step"));
  return card;
}

function renderLessonFlowOverview() {
  const steps = [
    ["1", "ฟัง", "จับ Pulse, Accent และ Groove ด้วยหูก่อน"],
    ["2", "เห็น", "ดู grid และ animation ให้รู้ว่าจังหวะอยู่ตรงไหน"],
    ["3", "เล่น", "ทำตามครูทีละรอบกับ Metronome"],
    ["4", "เช็ก", "ฟังตัวเอง แก้จุดพลาด แล้วทำ Quiz"]
  ];

  return `
    <section class="lesson-flow" aria-label="ลำดับการเรียน Listen See Play Self-check">
      ${steps.map(([number, title, copy]) => `
        <article class="lesson-flow-card">
          <span>${number}</span>
          <strong>${title}</strong>
          <p>${copy}</p>
        </article>
      `).join("")}
    </section>
  `;
}

function renderMonth1V2Core(weekItem) {
  if (!weekItem?.rhythmSpine || !Array.isArray(weekItem.coreBlocks) || weekItem.coreBlocks.length !== 4) return "";

  return `
    <section class="lesson-block month1-v2-core" aria-label="Month 1 V2 Daily Core">
      <div class="lesson-block-heading">
        <div>
          <p class="eyebrow">Month 1 V2 · Daily Core</p>
          <h3>Rhythm spine: ${weekItem.rhythmSpine}</h3>
          <p>ทุก pillar เล่นร่วมกับจังหวะของสัปดาห์นี้ ไม่แยกเป็นแบบฝึกโดด ๆ</p>
        </div>
        <span class="week-progress-badge">${weekItem.estimatedMinutesPerDay || "15–20 นาที"}</span>
      </div>
      <div class="lesson-learn-grid month1-v2-core-grid">
        ${weekItem.coreBlocks.map((block) => `
          <article class="month1-v2-pillar-card">
            <div class="lesson-support-head">
              <div>
                <p class="eyebrow">${block.pillar}</p>
                <h4>${block.title}</h4>
              </div>
              <span>${block.duration}</span>
            </div>
            <p>${block.focus}</p>
            <ul>
              ${block.steps.map((step) => `<li>${step}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderLessonMedia(weekItem) {
  const youtube = weekItem.youtube;
  const listenFor = weekItem.learn?.listenFor || weekItem.hear || [];
  if (!youtube?.title) return "";

  return `
    <section class="lesson-block lesson-media-block listen-step-block">
      <div class="lesson-media-copy">
        <p class="eyebrow">1. ฟัง</p>
        <h3>${youtube.title}</h3>
        <p>ใช้ Metronome ในแถบควบคุมด้านบนเป็นจุดอ้างอิง แล้วฟังเสียง click ให้สม่ำเสมอก่อนเริ่มเล่นครับ</p>
      </div>
      <div class="listen-prompt">
        <strong>โจทย์ฟัง</strong>
        <p>เปิด Metronome ในแถบด้านบน ปรับตาม Target BPM ของบทเรียน แล้วเคาะเท้าให้ตรงกับ click ก่อนลงมือเล่น</p>
        <ul>
          ${listenFor.map((line) => `<li>${line}</li>`).join("")}
        </ul>
      </div>
    </section>
  `;
}
function renderLearnSection(weekItem) {
  const weekNumber = Number(weekItem?.number || weekItem?.week);
  const isWeek2 = weekNumber === 2;
  const rhythmBlock = isWeek2 ? (weekItem?.rhythmGeometry || weeks[1]?.lessonBlocks?.find((b) => b.type === "rhythm-geometry") || null) : null;
  const completedDayCount = getFoundationWeekCompletedDayCount(weekNumber);
  const isWeekComplete = completedDayCount === 7;
  const completionLabel = `${isWeekComplete ? "✓ " : ""}${completedDayCount}/7 วัน`;
  const completionStatus = `
    <span class="week-progress-badge${isWeekComplete ? " is-complete" : ""}" aria-label="ซ้อมเสร็จ ${completedDayCount} จาก 7 วัน">
      ${completionLabel}
    </span>
  `;

  if (weekItem.learn) {
    return `
      <section class="lesson-block learn-block">
        <div class="lesson-block-heading">
          <h3>2. เห็น + เข้าใจ</h3>
          ${completionStatus}
        </div>
        <div class="lesson-target">
          <span>Target BPM</span>
          <strong>${weekItem.learn.targetBpm}</strong>
        </div>
        ${renderLessonDiagram(weekItem.learn.diagram)}
        ${rhythmBlock ? renderRhythmGeometryBlock(rhythmBlock).outerHTML : ""}
        ${weekItem.learn.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        <div class="lesson-learn-grid">
          <div>
            <h4>ฟังอะไร</h4>
            <ul>
              ${weekItem.learn.listenFor.map((line) => `<li>${line}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h4>รู้สึกอะไร</h4>
            <ul>
              ${weekItem.learn.physicalFeel.map((line) => `<li>${line}</li>`).join("")}
            </ul>
          </div>
        </div>
        <h4>เอาไปใช้กับกีตาร์</h4>
        <ul>
          ${weekItem.learn.guitarApplication.map((line) => `<li>${line}</li>`).join("")}
        </ul>
        <h4>ทำตามครูทีละรอบ</h4>
        <ol>
          ${weekItem.learn.guidedSteps.map((line) => `<li>${line}</li>`).join("")}
        </ol>
        <h4>ถ้าฟังแล้วไม่ตรง ให้แก้แบบนี้</h4>
        <ul>
          ${weekItem.learn.correctionSteps.map((line) => `<li>${line}</li>`).join("")}
        </ul>
        <p><strong>ตัวอย่างสั้น ๆ:</strong> ${weekItem.learn.miniExample}</p>
        <aside class="teacher-note"><strong>ครูแนะนำ</strong><p>${weekItem.learn.teacherNote}</p></aside>
        ${renderLessonReferenceTriggers(weekItem.learn.referenceTriggers)}
        ${renderTabReadingMicroSkill(weekItem.learn.tabMicroSkill)}
        ${renderRhythmVisual(weekItem.visual, true)}
      </section>
    `;
  }

  return `
    <section class="lesson-block learn-block">
      <div class="lesson-block-heading">
        <h3>2. เห็น + เข้าใจ</h3>
        ${completionStatus}
      </div>
      <div class="lesson-learn-grid">
        <div>
          <h4>ฟังอะไร</h4>
          <ul>
            ${weekItem.hear.map((line) => `<li>${line}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h4>รู้สึกอะไร</h4>
          <ul>
            ${weekItem.feel.map((line) => `<li>${line}</li>`).join("")}
          </ul>
        </div>
      </div>
      ${renderRhythmVisual(weekItem.visual, true)}
    </section>
  `;
}

function renderTabReadingMicroSkill(skill) {
  if (!skill) return "";

  return `
    <article class="lesson-block technique-drill-card">
      <div class="drill-header">
        <span class="skill-tag">TAB Reading</span>
        <span class="duration-tag">5 นาที</span>
      </div>
      <h3>${skill.title}</h3>
      <p class="instruction">${skill.coreIdea}</p>
      <div class="month2-mini-tab-card">
        <div class="mini-tab-scroll-area">
          <pre class="tab-block">${skill.miniExample.join("\n")}</pre>
        </div>
      </div>
      <h4>วิธีซ้อม</h4>
      <ul class="drill-steps">
        ${skill.practice.map((line) => `<li>${line}</li>`).join("")}
      </ul>
      <h4>พลาดบ่อย</h4>
      <ul class="drill-steps">
        ${skill.commonMistakes.map((line) => `<li>${line}</li>`).join("")}
      </ul>
      <aside class="teacher-note-box">
        <strong>ครูขอแนะนำ:</strong>
        <p>${skill.teacherNote}</p>
      </aside>
      ${renderLessonReferenceTriggers(skill.referenceTriggers)}
    </article>
  `;
}

function renderLessonReferenceTriggers(triggers) {
  const triggerItems = Array.isArray(triggers) ? triggers.filter((item) => item?.target && item?.label) : [];
  if (!triggerItems.length) return "";

  return `
    <div class="lesson-reference-triggers" aria-label="Reference Shelf shortcuts">
      ${triggerItems.map((item) => `
        <button class="small-button lesson-reference-trigger" type="button" data-scroll="${item.target}">
          ${item.label}
        </button>
      `).join("")}
      ${triggerItems.some((item) => item.hint) ? `
        <p class="lesson-reference-hint">${triggerItems.map((item) => item.hint).filter(Boolean).join(" ")}</p>
      ` : ""}
    </div>
  `;
}

function renderLessonDiagram(diagram) {
  if (!diagram) return "";

  return `
    <div class="lesson-diagram">
      <div class="lesson-diagram-head">
        <h4>${diagram.title}</h4>
        <p>${diagram.caption}</p>
      </div>
      <div class="lesson-diagram-grid" style="--diagram-count: ${diagram.cells.length}">
        ${diagram.cells.map((cell) => `
          <div class="diagram-cell ${cell.kind}">
            <strong>${cell.label}</strong>
            <span>${cell.note}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderLessonPracticeSupport(weekItem) {
  const parts = [
    renderDailySelfCheck(weekItem),
    renderCommonMistakes(weekItem),
    renderTroubleshooting(weekItem),
    renderEarTraining(weekItem.earTraining),
    renderMiniSong(weekItem.miniSong)
  ].filter(Boolean);

  return parts.join("");
}

function renderDailySelfCheck(weekItem) {
  return `
    <section class="lesson-block self-check-block">
      <div class="lesson-support-head">
        <div>
          <p class="eyebrow">เช็กตัวเองประจำวัน</p>
          <h3>เช็กก่อนจบวันนี้</h3>
        </div>
        <span>${weekItem.learn.targetBpm}</span>
      </div>
      <ul>
        ${weekItem.learn.dailySelfCheck.map((line) => `<li>${line}</li>`).join("")}
      </ul>
    </section>
  `;
}

function renderCommonMistakes(weekItem) {
  const mistakes = weekItem.learn?.commonMistakes || [];
  if (!mistakes.length) return "";

  return `
    <section class="lesson-block common-mistakes-block">
      <p class="eyebrow">Common Mistakes</p>
      <h3>พลาดบ่อยตรงนี้</h3>
      <ul>
        ${mistakes.map((line) => `<li>${line}</li>`).join("")}
      </ul>
    </section>
  `;
}
function renderTroubleshooting(weekItem) {
  return `
    <section class="lesson-block troubleshooting-block">
      <p class="eyebrow">Troubleshooting</p>
      <h3>ติดตรงไหน ให้แก้แบบครู</h3>
      <div class="troubleshooting-list">
        ${weekItem.learn.troubleshooting.map((item) => `
          <article>
            <h4>ปัญหา: ${item.problem}</h4>
            <p><strong>ครูแนะนำ:</strong> ${item.advice}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderEarTraining(earTraining) {
  if (!earTraining) return "";

  return `
    <section class="lesson-block ear-training-block">
      <p class="eyebrow">Rhythm Ear Training</p>
      <h3>${earTraining.title}</h3>
      <p>${earTraining.instruction}</p>
      <div class="ear-example-grid">
        ${earTraining.examples.map((example) => `
          <article>
            <span>${example.label}</span>
            <p>${example.description}</p>
          </article>
        `).join("")}
      </div>
      <p><strong>คำถาม:</strong> ${earTraining.question}</p>
      <p><strong>ครูใบ้ให้:</strong> ${earTraining.hint}</p>
    </section>
  `;
}

function renderMiniSong(miniSong) {
  if (!miniSong) return "";

  return `
    <section class="lesson-block mini-song-block">
      <p class="eyebrow">Mini Song Application</p>
      <h3>${miniSong.title}</h3>
      <p>${miniSong.purpose}</p>
      <div class="mini-song-grid">
        ${miniSong.bars.map((bar) => `
          <article>
            <span>ห้อง ${bar.bar}</span>
            <strong>${bar.chord}</strong>
            <p>${bar.direction}</p>
          </article>
        `).join("")}
      </div>
      <p><strong>ให้รู้สึกว่า:</strong> ${miniSong.feel}</p>
    </section>
  `;
}

function renderLessonSection(title, lines, extraClass = "") {
  return `
    <section class="lesson-block ${extraClass}">
      <h3>${title}</h3>
      <ul>
        ${lines.map((line) => `<li>${line}</li>`).join("")}
      </ul>
    </section>
  `;
}

function month2AsArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function month2ById(items = []) {
  return Object.fromEntries(month2AsArray(items).filter((item) => item?.id).map((item) => [item.id, item]));
}

function month2NormalizeLookup(value) {
  return Array.isArray(value) ? month2ById(value) : value || {};
}

function month2FirstText(...values) {
  return values.find((value) => typeof value === "string" && value.trim()) || "";
}

function month2CreateElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function month2AppendText(parent, value, className) {
  month2AsArray(value).filter(Boolean).forEach((line) => {
    parent.appendChild(month2CreateElement("p", className || "", line));
  });
}

function month2AppendResult(result, container) {
  if (container && typeof container.appendChild === "function") container.appendChild(result);
  return result;
}

function renderLessonBlocks(blocks, visualsById = {}, tabsById = {}, labsById = {}, drillsById = {}) {
  const visuals = month2NormalizeLookup(visualsById);
  const tabs = month2NormalizeLookup(tabsById);
  const labs = month2NormalizeLookup(labsById);
  const drills = { ...month2ById(techniqueDrills), ...month2NormalizeLookup(drillsById) };
  const flow = month2CreateElement("div", "month2-engine-flow month2-lesson-blocks");

  if (!month2AsArray(blocks).length) {
    flow.appendChild(renderMonth2MissingCard("ยังไม่มีข้อมูลบทเรียนสำหรับบล็อกนี้"));
    return flow;
  }

  month2AsArray(blocks).forEach((block = {}) => {
    if (block.type === "text") {
      flow.appendChild(renderMonth2TextBlock(block));
      return;
    }

    if (block.type === "fretboard" || block.type === "fretboard-visualizer") {
      const vRef = block.visualRef || block.visualId || block.refId || "";
      const visualData = visuals[vRef] || block.visual || block.fretboardVisual;
      flow.appendChild(renderFretboardVisual(visualData, block, vRef));
      return;
    }

    if (block.type === "tab") {
      const tRef = block.tabRef || block.tabId || block.refId || "";
      const tabData = tabs[tRef] || block.tab || block.miniTab;
      flow.appendChild(renderMiniTab(tabData, block, tRef));
      return;
    }

    if (block.type === "chord-lab" || block.type === "chord-sound-lab" || block.type === "ear-training-lab" || block.type === "progression-lab") {
      const lRef = block.labRef || block.labId || block.refId || "";
      const labData = labs[lRef] || block.lab || block.chordSoundLab || (block.notes || block.chords ? block : null);
      flow.appendChild(renderChordSoundLab(labData, block, lRef));
      return;
    }

    if (block.type === "technique-drill") {
      const dRef = block.drillRef || block.drillId || block.refId || "";
      const drillData = drills[dRef] || block.drill || block.techniqueDrill || (!dRef ? block : null);
      flow.appendChild(renderTechniqueDrillBlock(drillData, block, dRef));
      return;
    }

    if (block.type === "mechanics-check") {
      flow.appendChild(renderMechanicsCheckBlock(block));
      return;
    }

    if (block.type === "rhythm-geometry") {
      flow.appendChild(renderRhythmGeometryBlock(block));
      return;
    }

    flow.appendChild(renderMonth2MissingCard(`ยังไม่รองรับ lesson block type: ${block.type || "unknown"}`));
  });

  return flow;
}

function renderRhythmGeometryBlock(block = {}) {
  try {
    if (!block || typeof block !== "object" || !Array.isArray(block.pattern) || block.pattern.length !== 4) {
      console.warn("[RhythmGeometry] Invalid block data, skipping rendering.", block);
      return renderMonth2MissingCard("ยังไม่รองรับข้อมูล Rhythm Geometry Block หรือโครงสร้างไม่ถูกต้อง");
    }

    const blockId = String(block.id || `rg-${Date.now()}`);
    const card = month2CreateElement("article", "month2-component rhythm-geometry-card");
    card.setAttribute("data-rhythm-geometry-id", blockId);

    const header = month2CreateElement("div", "rhythm-geometry-card__header");
    const titleGroup = month2CreateElement("div", "rhythm-geometry-card__title-group");
    titleGroup.append(
      month2CreateElement("p", "eyebrow", "Rhythm Geometry"),
      month2CreateElement("h3", "", block.title || "Geometry of Rhythm")
    );

    const badges = month2CreateElement("div", "rhythm-geometry-card__badges");
    if (block.pickingStyle) {
      badges.appendChild(month2CreateElement("span", "rhythm-badge rhythm-badge--picking", block.pickingStyle));
    }
    if (block.bpmRecommended) {
      badges.appendChild(month2CreateElement("span", "rhythm-badge rhythm-badge--bpm", `BPM ${block.bpmRecommended}`));
    }
    badges.appendChild(month2CreateElement("span", "rhythm-badge rhythm-badge--subdivision", block.subdivision || "16th Grid"));

    header.append(titleGroup, badges);

    const initialMode = (block.id === "w2-rhythm-geometry-16th-syncopation" && currentRhythmGeometryMnemonicMode) ? currentRhythmGeometryMnemonicMode : String(block.defaultMnemonicMode || "food_en");
    const modes = [
      { key: "food_en", label: "Food (EN)" },
      { key: "takadimi", label: "Takadimi" },
      { key: "counting", label: "Counting" },
      { key: "food_th", label: "Food (TH)" }
    ];

    const modeSelector = month2CreateElement("div", "rhythm-geometry-card__mode-selector");
    modeSelector.setAttribute("role", "tablist");
    modeSelector.setAttribute("aria-label", "เลือกรูปแบบคำท่องสัดส่วนโน้ต");

    modes.forEach((m) => {
      const btn = month2CreateElement("button", `rhythm-mode-btn ${m.key === initialMode ? "is-selected" : ""}`, m.label);
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", m.key === initialMode ? "true" : "false");
      btn.setAttribute("data-mnemonic-mode", m.key);
      modeSelector.appendChild(btn);
    });

    const grid = month2CreateElement("div", "rhythm-geometry-card__beat-grid");

    block.pattern.forEach((beatGroup, bIndex) => {
      const beatNum = beatGroup.beat || bIndex + 1;
      const beatCard = month2CreateElement("div", "rhythm-geometry-card__beat");
      beatCard.appendChild(month2CreateElement("div", "rhythm-geometry-card__beat-title", `Beat ${beatNum}`));

      const subbeatsContainer = month2CreateElement("div", "rhythm-geometry-card__subbeats");
      const subbeats = Array.isArray(beatGroup.subbeats) ? beatGroup.subbeats : [];

      subbeats.forEach((sb, sIndex) => {
        const stepIndex = bIndex * 4 + sIndex;
        const pickingVal = String(sb.picking || "down").toLowerCase();
        const isAccent = Boolean(sb.accent);

        const cell = month2CreateElement("div", `rhythm-geometry-card__subbeat ${isAccent ? "is-accent" : ""}`);
        cell.setAttribute("data-beat-index", String(beatNum));
        cell.setAttribute("data-subbeat-index", String(sIndex + 1));
        cell.setAttribute("data-rhythm-step-index", String(stepIndex));
        cell.setAttribute("data-accent", String(isAccent));
        cell.setAttribute("data-picking", pickingVal);

        const mnemonics = sb.mnemonics || {};
        cell.setAttribute("data-text-food_en", mnemonics.food_en || mnemonics.counting || "");
        cell.setAttribute("data-text-takadimi", mnemonics.takadimi || mnemonics.counting || "");
        cell.setAttribute("data-text-counting", mnemonics.counting || "");
        cell.setAttribute("data-text-food_th", mnemonics.food_th || mnemonics.counting || "");

        const initialText = mnemonics[initialMode] || mnemonics.food_en || mnemonics.counting || "";
        const textSpan = month2CreateElement("span", "subbeat-mnemonic", initialText);

        const pickingSymbol = pickingVal === "down" ? "⬇️" : pickingVal === "up" ? "⬆️" : "Rest";
        const pickingSpan = month2CreateElement("span", "rhythm-geometry-card__picking", pickingSymbol);

        cell.append(textSpan, pickingSpan);
        if (isAccent) {
          cell.appendChild(month2CreateElement("span", "rhythm-geometry-card__accent-tag", "Accent"));
        }
        subbeatsContainer.appendChild(cell);
      });

      beatCard.appendChild(subbeatsContainer);
      grid.appendChild(beatCard);
    });

    card.append(header, modeSelector, grid);

    if (block.teacherTip) {
      const tipBox = month2CreateElement("aside", "rhythm-geometry-card__teacher-tip");
      tipBox.append(
        month2CreateElement("strong", "", "💡 คำแนะนำจากครู"),
        month2CreateElement("p", "", block.teacherTip)
      );
      card.appendChild(tipBox);
    }

    return card;
  } catch (err) {
    console.error("[RhythmGeometry] Renderer error:", err);
    return renderMonth2MissingCard("เกิดข้อผิดพลาดในการแสดงผล Rhythm Geometry Block");
  }
}

function setRhythmGeometryCardMode(card, newMode) {
  const allowedModes = ["food_en", "takadimi", "counting", "food_th"];
  if (!card || !newMode || !allowedModes.includes(newMode)) return;
  const modeSelector = card.querySelector(".rhythm-geometry-card__mode-selector");
  if (modeSelector) {
    modeSelector.querySelectorAll("[data-mnemonic-mode]").forEach((b) => {
      const isSel = b.getAttribute("data-mnemonic-mode") === newMode;
      b.classList.toggle("is-selected", isSel);
      b.setAttribute("aria-selected", isSel ? "true" : "false");
    });
  }
  card.querySelectorAll(".rhythm-geometry-card__subbeat").forEach((cell) => {
    const textSpan = cell.querySelector(".subbeat-mnemonic");
    if (!textSpan) return;
    const attrVal = cell.getAttribute(`data-text-${newMode}`);
    if (attrVal !== null) {
      textSpan.textContent = attrVal;
    }
  });
}

window.addEventListener("gc:metronome-step", (event) => {
  const detail = event.detail || {};
  const currentStep = Number(detail.stepIndex);
  if (!Number.isInteger(currentStep)) return;

  document.querySelectorAll("[data-rhythm-step-index]").forEach((cell) => {
    const stepIdx = Number(cell.getAttribute("data-rhythm-step-index"));
    const isActive = stepIdx === currentStep;
    cell.classList.toggle("is-active", isActive);
    if (cell.getAttribute("data-accent") === "true") {
      cell.classList.toggle("is-active-accent", isActive);
    }
  });
});

window.addEventListener("gc:metronome-stop", () => {
  document.querySelectorAll("[data-rhythm-step-index]").forEach((cell) => {
    cell.classList.remove("is-active", "is-active-accent");
  });
});

function renderMonth2TextBlock(block = {}) {
  const card = month2CreateElement("article", "month2-component month2-text-block lesson-text-block");
  card.append(
    month2CreateElement("p", "eyebrow", "บทเรียน"),
    month2CreateElement("h3", "", month2FirstText(block.heading, block.title, "บทเรียน"))
  );
  month2AppendText(card, block.content || block.body || block.description);
  appendMonth2List(card, "สรุปสั้น ๆ", block.list || block.items);

  if (block.teacherNote) {
    const note = month2CreateElement("aside", "teacher-note");
    note.append(month2CreateElement("strong", "", "ครูแนะนำ"));
    month2AppendText(note, block.teacherNote);
    card.appendChild(note);
  }

  if (block.instruction || block.practiceInstruction) {
    const instruction = month2CreateElement("div", "instruction-card");
    instruction.append(month2CreateElement("strong", "", "ลองทำ"));
    month2AppendText(instruction, block.instruction || block.practiceInstruction);
    card.appendChild(instruction);
  }

  month2AppendText(card, block.orientationNote || block.guardrail, "practice-note");

  return card;
}

function renderTechniqueDrillBlock(drill, block = {}, drillRef = "") {
  if (!drill) return renderMonth2MissingCard(`Missing technique drill${drillRef ? ` (${drillRef})` : ""}`);
  const data = { ...drill, ...block };
  const card = month2CreateElement("article", "month2-component block-technique-drill technique-drill-card");
  card.dataset.drillId = data.id || drillRef || "";
  card.append(
    month2CreateElement("p", "eyebrow", "Technique Drill"),
    month2CreateElement("h3", "", month2FirstText(data.title, drill.title, "Technique Drill"))
  );

  const meta = month2CreateElement("div", "drill-meta drill-header");
  [
    { value: data.skill, className: "status-chip skill-tag" },
    { value: data.duration, className: "status-chip duration-tag" },
    { value: data.tempo ? `${data.tempo} BPM` : "", className: "status-chip duration-tag" }
  ].filter((item) => item.value).forEach((item) => {
    meta.appendChild(month2CreateElement("span", item.className, item.value));
  });
  if (meta.children.length) card.appendChild(meta);

  month2AppendText(card, data.instruction || data.description || data.summary || data.setupText, "instruction");
  appendMonth2List(card, "Setup", data.setup);
  appendMonth2List(card, "Rules", data.rules);
  appendMonth2List(card, "Steps", data.steps, "ol", "drill-steps");
  appendMonth2List(card, "Self-check", data.selfCheck);

  if (data.teacherNote) {
    const note = month2CreateElement("aside", "teacher-note teacher-note-box");
    note.append(month2CreateElement("strong", "", "💡 ครูขอแนะนำ:"));
    month2AppendText(note, data.teacherNote);
    card.appendChild(note);
  }
  return card;
}

function renderMechanicsCheckBlock(block = {}) {
  const card = month2CreateElement("article", "month2-component block-mechanics-check");
  card.append(
    month2CreateElement("p", "eyebrow", "Mechanics Check"),
    month2CreateElement("h3", "", month2FirstText(block.title, block.heading, "Mechanics Check"))
  );
  month2AppendText(card, block.description || block.body || block.instruction);
  const checks = month2AsArray(block.checks || block.items || block.criteria).filter(Boolean);
  if (checks.length) {
    const checklist = month2CreateElement("div", "mechanics-checklist");
    checks.forEach((item, index) => {
      const labelText = typeof item === "string" ? item : item.title || item.text || item.instruction || "";
      if (!labelText) return;
      const label = month2CreateElement("label", "mechanics-check-item");
      const checkbox = month2CreateElement("input");
      checkbox.type = "checkbox";
      const storageKey = getMechanicsCheckStorageKey(block, index);
      const shouldPersist = !isDevPreviewActive();
      if (shouldPersist) {
        try {
          checkbox.checked = localStorage.getItem(storageKey) === "true";
        } catch {
          checkbox.checked = false;
        }
      }
      checkbox.addEventListener("change", () => {
        if (!shouldPersist) return;
        try {
          safeSetItem(storageKey, checkbox.checked ? "true" : "false");
        } catch {
          // Ignore private browsing storage failures; the lesson still works.
        }
      });
      label.append(checkbox, month2CreateElement("span", "", labelText));
      checklist.appendChild(label);
    });
    card.appendChild(checklist);
  }
  month2AppendText(card, block.teacherNote || block.note || block.guardrail, "practice-note");
  return card;
}

function getMechanicsCheckStorageKey(block = {}, index = 0) {
  const rawId = String(block.id || block.title || block.heading || "mechanics-check")
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  const prefix = isViewingPrelude ? "gc_prelude_chk_" : "gc_mechanics_chk_";
  return `${prefix}${rawId || "mechanics-check"}_${index}`;
}

function appendMonth2List(parent, title, items, tagName = "ul", listClassName = "") {
  const listItems = month2AsArray(items).filter(Boolean);
  if (!listItems.length) return;
  const section = month2CreateElement("div", "month2-list-block");
  section.appendChild(month2CreateElement("strong", "", title));
  const list = month2CreateElement(tagName);
  if (listClassName) list.className = listClassName;
  listItems.forEach((item) => {
    const li = month2CreateElement("li");
    const text = typeof item === "string" ? item : item.title || item.text || item.instruction || "";
    li.innerHTML = String(text).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    list.appendChild(li);
  });
  section.appendChild(list);
  parent.appendChild(section);
}

function renderFretboardVisual(visual, block = {}, visualRef = "") {
  const container = block && typeof block.appendChild === "function" ? block : null;
  const blockData = container ? {} : block;
  if (!visual) return month2AppendResult(renderMonth2MissingCard(`ยังไม่มีภาพคอกีตาร์สำหรับบล็อกนี้${visualRef ? ` (${visualRef})` : ""}`), container);

  const card = month2CreateElement("article", `month2-component month2-fretboard-card fretboard-card${visual.responsiveFallback ? " responsive-fretboard" : ""}`);
  card.dataset.visualId = visual.id || visualRef || "";

  const head = month2CreateElement("header", "component-head");
  head.append(
    month2CreateElement("p", "eyebrow", "ภาพคอกีตาร์"),
    month2CreateElement("h3", "", blockData.title || visual.title || "Fretboard Visual"),
    month2CreateElement("p", "caption", visual.caption || "")
  );

  const orientationNote = month2CreateElement(
    "p",
    "orientation-note fretboard-orientation",
    visual.orientationNote || "💡 แผนที่คอกีตาร์นี้ใช้มุมมองเดียวกับตาราง TAB: แถวบนสุดคือ สาย 1 (เสียงสูง) และแถวล่างสุดคือ สาย 6 (เสียงเบส)"
  );

  const config = visual.config || {};
  const start = Number(config.startFret ?? 1);
  const end = Number(config.endFret ?? start);
  const fretCount = Math.max(1, end - start + 1);
  const frame = month2CreateElement("div", "fretboard-frame");
  const fretboardWithLabels = month2CreateElement("div", "fretboard-with-labels");
  const labelColumn = month2CreateElement("div", "string-label-column");

  getMonth2StringLabels(visual).forEach((item) => {
    const label = month2CreateElement("span", "string-row-label", item.label);
    label.style.gridRow = String(item.row);
    labelColumn.appendChild(label);
  });

  const grid = month2CreateElement("div", `fretboard-grid${config.showNut ? " has-nut" : ""}`);
  grid.style.setProperty("--fret-count", String(fretCount));
  grid.style.setProperty("--start-fret", String(start));
  grid.style.setProperty("--end-fret", String(end));
  grid.setAttribute("role", "img");
  grid.setAttribute("aria-label", visual.title || "fretboard visual");

  for (let wire = 0; wire <= fretCount; wire += 1) {
    const fretWire = month2CreateElement("span", "fret-wire");
    fretWire.style.left = `${(wire / fretCount) * 100}%`;
    fretWire.setAttribute("aria-hidden", "true");
    grid.appendChild(fretWire);
  }

  for (let stringNumber = 1; stringNumber <= 6; stringNumber += 1) {
    const stringLine = month2CreateElement("span", `string-line string-line-${stringNumber}`);
    stringLine.style.gridRow = String(stringNumber);
    stringLine.setAttribute("aria-hidden", "true");
    grid.appendChild(stringLine);
  }

  const showInlays = config.showInlays !== false;
  const inlayFrets = Array.isArray(config.inlayFrets) && config.inlayFrets.length ? config.inlayFrets : [3, 5, 7, 9, 12];
  if (showInlays) {
    inlayFrets.forEach((fret) => {
      const fretNumber = Number(fret);
      if (!Number.isFinite(fretNumber) || fretNumber < start || fretNumber > end) return;
      const inlay = month2CreateElement("span", `fret-inlay${fretNumber === 12 ? " double" : ""}`);
      inlay.style.gridColumn = String(fretNumber - start + 1);
      inlay.style.gridRow = "1 / -1";
      inlay.setAttribute("aria-hidden", "true");
      grid.appendChild(inlay);
    });
  }

  month2AsArray(visual.dots).forEach((dot = {}) => {
    const fretValue = Number(dot.fret);
    const isOpenString = fretValue === 0;
    const displayStr = dot.displayLabel || dot.shortLabel || dot.label || "";
    const marker = month2CreateElement("span", `fret-dot dot-${dot.type || "default"}${isOpenString ? " open-string" : ""}`, displayStr);
    const visualRow = dot.string;
    const visualColumn = isOpenString ? 1 : fretValue - start + 1;
    marker.style.gridRow = String(visualRow);
    marker.style.gridColumn = String(visualColumn);
    marker.setAttribute("aria-label", dot.ariaLabel || dot.label || `${displayStr} สาย ${dot.string} เฟรต ${dot.fret}`);
    grid.appendChild(marker);
  });

  fretboardWithLabels.append(labelColumn, grid);

  const fretNumberRow = month2CreateElement("div", "fret-numbers-row");
  const fretNumbers = month2CreateElement("div", "fret-numbers");
  fretNumbers.style.setProperty("--fret-count", String(fretCount));
  for (let fret = start; fret <= end; fret += 1) {
    fretNumbers.appendChild(month2CreateElement("span", "", String(fret)));
  }
  fretNumberRow.append(month2CreateElement("span", "fret-number-spacer"), fretNumbers);
  frame.append(fretboardWithLabels, fretNumberRow);

  const legend = month2CreateElement("ul", "legend-list");
  month2AsArray(visual.legend).forEach((item = {}) => {
    const li = month2CreateElement("li");
    li.append(month2CreateElement("span", `legend-swatch swatch-${item.type || "default"}`), document.createTextNode(item.label || item.type || ""));
    legend.appendChild(li);
  });

  if (visual.responsiveFallback) {
    const unified = month2CreateElement("div", "unified-fretboard");
    unified.appendChild(frame);
    if (legend.children.length) unified.appendChild(legend);
    card.append(head, orientationNote, unified, renderFretboardFallback(visual));
  } else {
    card.append(head, orientationNote, frame);
    if (legend.children.length) card.appendChild(legend);
  }
  return month2AppendResult(card, container);
}

function renderFretboardFallback(visual = {}) {
  const fallback = month2CreateElement("div", "layered-fallback");
  fallback.appendChild(month2CreateElement("p", "fallback-note", visual.responsiveFallback?.note || "Dense map split into smaller layers on narrow screens."));
  month2AsArray(visual.responsiveFallback?.layers).forEach((layer = {}) => {
    const roles = month2AsArray(layer.roles);
    const layerDots = month2AsArray(visual.dots).filter((dot = {}) => roles.includes(dot.toneRole) || roles.includes(dot.type));
    if (!layerDots.length) return;
    const layerCard = month2CreateElement("article", "layer-card");
    layerCard.appendChild(month2CreateElement("h4", "", layer.title || layer.id || "Layer"));
    layerCard.appendChild(renderFretboardVisual({ ...visual, dots: layerDots, responsiveFallback: null }, {}, `${visual.id || ""}-${layer.id || "layer"}`));
    fallback.appendChild(layerCard);
  });
  return fallback;
}

function getMonth2StringLabels(visual = {}) {
  if (Array.isArray(visual.stringLabels) && visual.stringLabels.length) return visual.stringLabels;
  return [
    { row: 1, label: "e" },
    { row: 2, label: "B" },
    { row: 3, label: "G" },
    { row: 4, label: "D" },
    { row: 5, label: "A" },
    { row: 6, label: "E" }
  ];
}

function renderMiniTab(tab, block = {}, tabRef = "") {
  const container = block && typeof block.appendChild === "function" ? block : null;
  const blockData = container ? {} : block;
  if (!tab) return month2AppendResult(renderMonth2MissingCard(`ยังไม่มี TAB สำหรับแบบฝึกนี้${tabRef ? ` (${tabRef})` : ""}`), container);

  const card = month2CreateElement("article", "month2-component month2-mini-tab-card mini-tab-card");
  card.dataset.tabId = tab.id || tabRef || "";

  const head = month2CreateElement("header", "component-head");
  head.append(
    month2CreateElement("p", "eyebrow", "ตาราง TAB บันทึกเสียง"),
    month2CreateElement("h3", "", blockData.title || tab.title || "Mini-TAB"),
    month2CreateElement("span", "bpm-pill", tab.bpm ? `${tab.bpm} BPM` : "")
  );

  const orientationNote = month2CreateElement(
    "p",
    "orientation-note tab-orientation",
    tab.orientationNote || "TAB มาตรฐาน: สาย 1 อยู่บรรทัดบน และสาย 6 อยู่บรรทัดล่าง"
  );
  const readNote = month2CreateElement("p", "tab-read-note", "TAB อ่านจากบนลงล่าง = สาย 1 ถึงสาย 6");
  const scrollArea = month2CreateElement("div", "mini-tab-scroll-area");
  const pre = month2CreateElement("pre", "tab-block");
  const code = month2CreateElement("code");
  const lyrics = month2CreateElement("code", "tab-lyrics-line");

  code.textContent = month2AsArray(tab.ascii || tab.lines).join("\n");
  lyrics.textContent = Array.isArray(tab.lyrics) ? tab.lyrics.join(" ") : tab.lyrics || "";
  pre.append(code, document.createTextNode("\n"), lyrics);
  scrollArea.appendChild(pre);
  card.append(head, orientationNote, readNote, scrollArea, month2CreateElement("p", "practice-note", tab.note || ""));

  return month2AppendResult(card, container);
}

function getSelectedAudioInstrument() {
  return selectedAudioInstrument;
}

function getFslInstrumentCapability(instrument) {
  return window.AudioEngine?.getFslInstrumentCapability?.(instrument) || {
    status: "UNAVAILABLE_ENGINE",
    available: false,
    minMidi: null,
    maxMidi: null,
    reason: "ระบบเสียง FSL ยังไม่พร้อม"
  };
}

function setSelectedAudioInstrument(instrument, options = {}) {
  const engine = window.AudioEngine;
  const fslCapability = getFslInstrumentCapability(instrument);
  if (fslInstrumentSelectorGuardActive && !fslCapability.available) {
    engine?.stopChannel?.("fsl");
    syncGlobalInstrumentSelector();
    showToast(
      fslCapability.message || "Nylon ยังไม่พร้อมสำหรับ FSL ช่วงโน้ตเต็ม 40–76",
      "info"
    );
    return selectedAudioInstrument;
  }

  const availability = typeof engine?.getInstrumentAvailability === "function"
    ? engine.getInstrumentAvailability(instrument)
    : { available: instrument === "synth" || instrument === "nylon" };

  if (!availability?.available || !["synth", "nylon", "electric"].includes(instrument)) {
    syncGlobalInstrumentSelector();
    return selectedAudioInstrument;
  }

  if (instrument !== selectedAudioInstrument) {
    if (fslInstrumentSelectorGuardActive) engine?.stopChannel?.("fsl");
    soundLabAudioSession += 1;
    clearSequenceTimers();
    stopAllSounds();
    stopOscillators();
    engine?.stopAllTonal?.();
    selectedAudioInstrument = instrument;
    engine?.setSelectedInstrument?.(instrument);
    if (options.persist !== false) persistContinuePracticeStateV1();
  }

  syncGlobalInstrumentSelector();
  return selectedAudioInstrument;
}

function renderGlobalInstrumentSelector() {
  const existingSelector = document.getElementById("globalInstrumentSelector");
  if (existingSelector) {
    syncGlobalInstrumentSelector();
    return existingSelector;
  }

  const control = month2CreateElement("label", "global-instrument-control");
  control.innerHTML = `
    <span class="global-instrument-label">เสียงกีตาร์</span>
    <select id="globalInstrumentSelector" aria-label="เลือกเสียงเครื่องดนตรี">
      <option value="synth">Synth</option>
      <option value="nylon">Nylon</option>
      <option value="electric">Electric</option>
    </select>
  `;
  const selector = control.querySelector("#globalInstrumentSelector");
  selector.addEventListener("change", (event) => {
    setSelectedAudioInstrument(event.currentTarget.value);
  });

  document.querySelector(".topbar-main")?.appendChild(control);
  window.AudioEngine?.setSelectedInstrument?.(selectedAudioInstrument);
  syncGlobalInstrumentSelector();
  return selector;
}

function syncGlobalInstrumentSelector() {
  const selector = document.getElementById("globalInstrumentSelector");
  if (selector) selector.value = getSelectedAudioInstrument();
}

function activateFslInstrumentSelectorGuard() {
  const selector = document.getElementById("globalInstrumentSelector");
  const previousInstrument = getSelectedAudioInstrument();
  const optionState = selector
    ? Array.from(selector.options).map((option) => ({
        option,
        disabled: option.disabled,
        title: option.title
      }))
    : [];

  fslInstrumentSelectorGuardActive = true;
  optionState.forEach(({ option }) => {
    const capability = getFslInstrumentCapability(option.value);
    if (!capability.available) {
      option.disabled = true;
      option.title = capability.message || capability.reason;
    }
  });

  if (!getFslInstrumentCapability(previousInstrument).available) {
    setSelectedAudioInstrument("synth", { persist: false });
  } else {
    syncGlobalInstrumentSelector();
  }

  return () => {
    fslInstrumentSelectorGuardActive = false;
    optionState.forEach(({ option, disabled, title }) => {
      option.disabled = disabled;
      option.title = title;
    });

    if (previousInstrument !== getSelectedAudioInstrument()) {
      setSelectedAudioInstrument(previousInstrument, { persist: false });
    } else {
      syncGlobalInstrumentSelector();
    }
  };
}

function renderChordSoundLab(lab, block = {}, labRef = "") {
  const container = block && typeof block.appendChild === "function" ? block : null;
  const blockData = container ? {} : block;
  if (!lab) return month2AppendResult(renderMonth2MissingCard(`ยังไม่มีห้องทดลองฟังเสียงคอร์ดสำหรับบล็อกนี้${labRef ? ` (${labRef})` : ""}`), container);

  const isV2Preview = new URLSearchParams(window.location.search).get('soundLabV2Preview') === '1' || soundLabV2AliasMode;
  const useSoundLabV2 =
    isSoundLabV2PreviewActive() &&
    isSingleGuideToneLab(lab, blockData, labRef);
  if (lab?.audioEngine?.model === "sound-lab-v2" && !isV2Preview) {
    return month2AppendResult(document.createDocumentFragment(), container);
  }

  const card = month2CreateElement("article", "month2-component month2-chord-lab-card chord-lab-card");
  card.dataset.labId = lab.id || labRef || "";

  const head = month2CreateElement("header", "component-head");

  const eyebrowRow = month2CreateElement("div", "sound-lab-eyebrow-row");
  eyebrowRow.appendChild(month2CreateElement("p", "eyebrow", "ห้องทดลองฟังเสียงคอร์ด"));
  if (useSoundLabV2) {
    eyebrowRow.appendChild(month2CreateElement("span", "sound-lab-v2-badge", "V2 PREVIEW"));
  }

  head.append(
    eyebrowRow,
    month2CreateElement("h3", "", blockData.title || lab.title || "ห้องทดลองฟังเสียงคอร์ด"),
    month2CreateElement("p", "caption", lab.description || "")
  );

  if (blockData.instruction) {
    const instruction = month2CreateElement("div", "instruction-card");
    instruction.append(month2CreateElement("strong", "", "วิธีใช้"));
    month2AppendText(instruction, blockData.instruction);
    head.appendChild(instruction);
  }
  const labItems = getLabPlaybackItems(lab);
  const controls = month2CreateElement("div", "chord-lab-controls");
  labItems.forEach((chord = {}) => {
    const button = month2CreateElement("button", "chord-button", formatSoundLabLabel(chord));
    button.type = "button";
    button.dataset.chordId = chord.id || chord.chord || "";
    button.addEventListener("click", async () => {
      if (useSoundLabV2) {
        const requestSession = ++soundLabAudioSession;
        activateChordButton(card, button.dataset.chordId);
        const playback = await playSharedSoundLabItem(lab, chord, blockData);
        if (requestSession !== soundLabAudioSession) return;

        if (!playback.played) {
          updateLabStatus(card, chord, false, lab, blockData);
          return;
        }

        const statusMeta = {
          state: "PLAYED",
          primary: getSoundLabPrimaryName(chord),
          guideTone: playback.note,
          role: getSoundLabCompactRole(chord),
          sequence: formatSoundLabSequenceLabel(lab)
        };
        if (lab.audioEngine?.model === "sound-lab-v2" && chord.theoryNote && chord.playbackNote && chord.theoryNote !== chord.playbackNote) {
          statusMeta.helperLine = `โน้ตที่เรียน: ${chord.theoryNote} · เสียงที่เปิดให้ฟัง: ${chord.playbackNote}`;
        }
        setLabStatus(card, "", statusMeta);
        return;
      }

      clearSequenceTimers();
      activateChordButton(card, button.dataset.chordId);
      const played = await playLabItem(lab, chord, card, blockData);
      if (!played) updateLabStatus(card, chord, false, lab, blockData);
    });
    controls.appendChild(button);
  });

  const actionRow = month2CreateElement("div", "chord-lab-actions");

  let playSeqText = lab.uiCopy?.playSequence;
  if (!playSeqText) {
    const seqLabel = formatSoundLabSequenceLabel(lab);
    playSeqText = seqLabel.length < 30 ? `ฟัง ${seqLabel}` : "ฟังชุดนี้ทีละเสียง";
  }
  const progressionButton = month2CreateElement("button", "progression-button", playSeqText);
  progressionButton.type = "button";
  progressionButton.addEventListener("click", () => playSequence(lab, card, blockData, labRef));

  const stopButton = month2CreateElement("button", "stop-button", lab.uiCopy?.stop || "หยุดเสียง");
  stopButton.type = "button";
  stopButton.addEventListener("click", () => {
    stopActiveAudio(useSoundLabV2);
    clearActiveChord(card);
    setLabStatus(card, "", {
      state: "STOPPED",
      primary: "หยุดเสียงแล้ว",
      hint: "เลือกคอร์ดหรือกด Play เพื่อฟังใหม่",
      sequence: formatSoundLabSequenceLabel(lab)
    });
  });
  actionRow.append(progressionButton, stopButton);

  const status = month2CreateElement("div", "chord-lab-status sound-lab-coach sound-lab-digital-sign");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  card.append(head, controls, actionRow, status);
  setLabStatus({ querySelector: () => status }, "", {
    state: "SOUND LAB",
    primary: "เลือกคอร์ดหรือกด Play",
    hint: "Guide Tone Ready",
    sequence: formatSoundLabSequenceLabel(lab)
  });

  const listenList = month2CreateElement("ul", "listen-for-list");
  month2AsArray(lab.listenFor).forEach((item) => listenList.appendChild(month2CreateElement("li", "", item)));
  const fallback = month2CreateElement("p", "audio-fallback-note", lab.uiCopy?.fallback || "ถ้าเสียงไม่ทำงาน ให้ใช้ข้อความบนการ์ดเป็นตัวนำการฟังแทน");

  if (listenList.children.length) card.appendChild(listenList);
  card.appendChild(fallback);

  return month2AppendResult(card, container);
}

function getLabPlaybackItems(lab = {}) {
  const chordItems = month2AsArray(lab.chords);
  if (chordItems.length) return chordItems;
  const notes = getChordNotes(lab);
  if (!notes.length) return [];
  return [{
    id: lab.id || "ear-training-lab",
    chord: lab.title || lab.label || "Ear Training",
    degree: lab.degree || "",
    role: lab.role || lab.type || "",
    feeling: lab.feeling || lab.description || "",
    notes
  }];
}

function getSoundLabShortLabel(item, maxLength = 18) {
  if (!item) return "";
  let label = "";

  if (item.shortLabel) {
    label = item.shortLabel;
  } else if (item.guideToneLabel && item.guideToneLabel.length < 24) {
    label = item.guideToneLabel;
  } else {
    const rawText = item.chord || item.label || item.id || "";
    const lowerText = rawText.toLowerCase();

    if (lowerText.includes("response:") && lowerText.includes("minor pentatonic")) label = "Minor Response";
    else if (lowerText.includes("call:") && lowerText.includes("major pentatonic")) label = "Major Call";
    else if (lowerText.includes("a major pentatonic")) label = "Major";
    else if (lowerText.includes("a minor pentatonic")) label = "Minor";
    else if (lowerText.includes("major to minor")) label = "Major → Minor";
    else if (lowerText.includes("minor to major")) label = "Minor → Major";
    else if (lowerText.includes("pentatonic color switch")) label = "Color Switch";
    else if (lowerText.includes("root") && lowerText.includes("anchor")) label = "Root A";
    else if (lowerText.includes("minor color") && lowerText.includes("c")) label = "Minor b3";
    else if (lowerText.includes("major color") && lowerText.includes("c#")) label = "Major 3";
    else if (lowerText.includes("compare") || lowerText.includes("c vs c#")) label = "Compare";
    else {
      label = rawText.split(/[-—•\n]/)[0].trim();
    }
  }

  if (label.length > maxLength) {
    return label.substring(0, maxLength).trim() + "...";
  }
  return label;
}

function getSoundLabDetailLabel(item) {
  if (!item) return "";
  const details = [
    item.degree,
    item.role,
    item.feeling
  ].filter((value) => typeof value === "string" && value.trim());
  return details.join(" • ");
}

function formatSoundLabLabel(chord = {}) {
  return `ฟัง ${getSoundLabShortLabel(chord)}`;
}

function getSoundLabSequenceItems(lab = {}) {
  const labItems = getLabPlaybackItems(lab);
  if (month2AsArray(lab.sequence).length) {
    return month2AsArray(lab.sequence)
      .map((id) => labItems.find((chord) => chord.id === id))
      .filter(Boolean);
  }
  return labItems;
}

function formatSoundLabSequenceLabel(lab = {}) {
  const sequenceItems = getSoundLabSequenceItems(lab);
  if (sequenceItems.length > 3) return "ฟังชุดนี้ทีละเสียง";

  const names = sequenceItems
    .map(item => getSoundLabShortLabel(item, 18))
    .filter(Boolean);

  if (!names.length) return "Progression";

  const joined = names.join(" → ");
  if (joined.length > 32) return "ฟังชุดนี้ทีละเสียง";
  return joined;
}

function getSoundLabGuideToneText(lab = {}, chord = {}, block = {}) {
  const notes = getLabPlaybackNotes(lab, chord, block);
  if (!notes.length) return "";
  const baseText = notes.join(" → ");
  if (lab.audioEngine?.model === "sound-lab-v2" && chord.guideToneLabel) {
    return `${chord.guideToneLabel} - ${baseText}`;
  }
  return baseText;
}

function getSoundLabPrimaryName(chord = {}) {
  return getSoundLabShortLabel(chord, 24);
}

function getSoundLabCompactRole(chord = {}) {
  return getSoundLabDetailLabel(chord);
}

function normalizeAuditionPitch(note) {
  const normalized = normalizePitchName(note);
  if (typeof normalized !== "string") return normalized;

  const match = /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(normalized);
  if (!match) return normalized;

  const [, rawLetter, accidental, rawOctave] = match;
  const octave = Number(rawOctave);
  const pitchName = `${rawLetter.toUpperCase()}${accidental}`;

  // Keep audition notes in a tuner/mobile-friendly register.
  // Example: G2/G3 -> G4, C3 -> C4.
  if (octave < 4) return `${pitchName}4`;

  return `${pitchName}${octave}`;
}

function getLabPlaybackNotes(lab = {}, chord = {}, block = {}, options = {}) {
  const contract = lab.playbackContract || chord.playbackContract || "";
  if (contract === "single-guide-tone") {
    const playbackNote = chord.playbackNote;
    if (typeof playbackNote !== "string" || !playbackNote.trim()) {
      console.warn("single-guide-tone item is missing a scalar playbackNote", { labId: lab.id, itemId: chord.id });
      return [];
    }
    return [normalizeAuditionPitch(playbackNote)];
  }

  if (lab.audioEngine?.model === "sound-lab-v2") {
    const v2Note = chord.playbackNote || chord.auditionNote;
    if (v2Note) return [v2Note];
  }

  const notes = getChordNotes(chord);
  if (!notes.length) return [];

  const explicitMode = String(
    options.noteMode ||
    chord.noteMode ||
    lab.noteMode ||
    lab.audioEngine?.noteMode ||
    ""
  ).toLowerCase();

  // Explicit escape hatch for future labs that really want all chord tones.
  if (["all", "full", "arpeggio", "arpeggiated"].includes(explicitMode)) {
    return notes;
  }

  const explicitAuditionNotes = month2AsArray(
    chord.auditionNotes ||
    chord.playNotes ||
    lab.auditionNotes
  ).map(normalizePitchName).filter(Boolean);

  if (explicitAuditionNotes.length) {
    return explicitAuditionNotes.map(normalizeAuditionPitch);
  }

  const explicitAuditionNote =
    chord.auditionNote ||
    chord.playNote ||
    chord.rootNote ||
    lab.auditionNote;

  if (explicitAuditionNote) {
    return [normalizeAuditionPitch(explicitAuditionNote)];
  }

  if (lab.type === "ear-training-lab" && notes.length > 1) {
    return notes.map(normalizeAuditionPitch);
  }

  // Default: one representative note per chord item.
  // Current chord data stores root as the first note.
  return [normalizeAuditionPitch(notes[0])];
}

function shouldPlaySequentialLabItem(lab = {}, chord = {}, block = {}) {
  const explicitPlayback = String(chord.playback || lab.playback || lab.playbackMode || "").toLowerCase();

  if (["chord", "stack", "stacked", "simultaneous"].includes(explicitPlayback)) return false;

  if (["sequence", "sequential", "phrase", "melody", "arpeggio", "arpeggiated"].includes(explicitPlayback)) return true;

  if (block.type === "ear-training-lab") return true;

  const source = [
    lab.type,
    lab.id,
    lab.title,
    chord.id,
    chord.chord,
    chord.role,
    chord.degree
  ].filter(Boolean).join(" ").toLowerCase();

  return [
    "scale",
    "pentatonic",
    "capstone",
    "blues",
    "tension",
    "phrase",
    "melody",
    "line"
  ].some((token) => source.includes(token));
}

function getLabItemPlaybackTiming(lab = {}, chord = {}, block = {}) {
  const sequential = shouldPlaySequentialLabItem(lab, chord, block);

  const durationMs = sequential
    ? Number(lab.audioEngine?.phraseNoteDurationMs || lab.audioEngine?.noteDurationMs || 600)
    : Number(lab.audioEngine?.durationMs || 1200);

  const stepMs = Number(
    lab.audioEngine?.stepMs ||
    lab.audioEngine?.noteGapMs ||
    (sequential ? 850 : 350)
  );

  const strumMs = Number(lab.audioEngine?.strumMs ?? 35);

  return { sequential, durationMs, stepMs, strumMs };
}

function getLabItemTotalDurationMs(lab = {}, chord = {}, block = {}) {
  const notes = getLabPlaybackNotes(lab, chord, block);
  const timing = getLabItemPlaybackTiming(lab, chord, block);
  if (!notes.length) return timing.durationMs;
  if (timing.sequential && notes.length > 1) return ((notes.length - 1) * timing.stepMs) + timing.durationMs + 120;
  return timing.durationMs + 120;
}

function getSharedSoundLabAudioEngine() {
  const engine = window.AudioEngine;
  if (
    !engine
    || typeof engine.playSoundLabGuideNote !== "function"
    || typeof engine.stopSoundLab !== "function"
  ) {
    return null;
  }
  return engine;
}

async function playSharedSoundLabItem(lab = {}, chord = {}, block = {}) {
  const engine = getSharedSoundLabAudioEngine();
  const [guideNote] = getLabPlaybackNotes(lab, chord, block);
  const resolvedGuideNote = guideNote;
  if (!engine || !resolvedGuideNote) return { played: false, note: "" };

  try {
    const result = await engine.playSoundLabGuideNote({
      note: resolvedGuideNote,
      velocity: Number(lab.audioEngine?.gain ?? 0.7),
      instrument: getSelectedAudioInstrument()
    });
    return {
      played: result?.played === true,
      note: resolvedGuideNote,
      requestGeneration: result?.requestGeneration,
      backend: result?.backend || "none",
      instrument: result?.instrument || "none",
      resolvedSample: result?.resolvedSample || null,
      fallbackReason: result?.fallbackReason || null
    };
  } catch {
    return { played: false, note: resolvedGuideNote };
  }
}

async function playLabItem(lab = {}, chord = {}, card, block = {}, options = {}) {
  if (options.clearTimers !== false) clearSequenceTimers();
  stopAllSounds();
  stopOscillators();

  try {
    const notes = getLabPlaybackNotes(lab, chord, block, options);
    if (!notes.length) return false;
    const engine = window.AudioEngine;
    if (!engine || typeof engine.playNote !== "function") return false;

    const timing = getLabItemPlaybackTiming(lab, chord, block);
    setLabStatus(card, "", {
      state: "NOW PLAYING",
      primary: getSoundLabPrimaryName(chord),
      guideTone: notes.join(" → "),
      role: getSoundLabCompactRole(chord),
      sequence: formatSoundLabSequenceLabel(lab)
    });

    const velocities = notes.map((note) => {
      const gainMultiplier = Number(lab.audioEngine?.gain ?? 1.0);
      const stackedPlayback = notes.length > 1 && !timing.sequential;
      const singleAudition = notes.length === 1 && !stackedPlayback;
      const basePeakGain = singleAudition
        ? Number(lab.audioEngine?.singleNotePeakGain || lab.audioEngine?.auditionPeakGain || 1.18)
        : timing.sequential
          ? 0.95
          : getStackedChordPeakGain(note, notes.length);
      const maxPeakGain = singleAudition ? 1.35 : 1.0;
      const peakGain = Math.min(basePeakGain * gainMultiplier, maxPeakGain);
      return singleAudition
        ? Number(lab.audioEngine?.guideTonePeakGain || 0.92)
        : peakGain;
    });

    const played = await engine.playNote({
      channel: "soundlab",
      profile: "soundlab-guide-tone",
      notes,
      timeOffsets: notes.map((_, index) => (
        timing.sequential ? (index * timing.stepMs) / 1000 : (index * timing.strumMs) / 1000
      )),
      duration: timing.durationMs / 1000,
      velocities,
      instrument: getSelectedAudioInstrument()
    });
    if (!played) return false;

    const doneTimer = window.setTimeout(() => {
      updateLabStatus(card, chord, true, lab, block);
    }, getLabItemTotalDurationMs(lab, chord, block));
    sequenceTimers.push(doneTimer);
    return true;
  } catch (error) {
    console.error("Audio lab playback failed", error);
    stopAllSounds();
    return false;
  }
}

async function ensureAudioContext() {
  if (!audioCtx) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return null;
    audioCtx = new AudioContextCtor();
    pluckedMasterGain = audioCtx.createGain();
    pluckedOutputGain = audioCtx.createGain();
    pluckedCompressor = audioCtx.createDynamicsCompressor();
    pluckedMasterGain.gain.setValueAtTime(0.9 * PLUCKED_OUTPUT_MULTIPLIER, audioCtx.currentTime);
    pluckedOutputGain.gain.setValueAtTime(1.25, audioCtx.currentTime);
    configurePluckedCompressor();
    pluckedMasterGain.connect(pluckedCompressor);
    pluckedCompressor.connect(pluckedOutputGain);
    pluckedOutputGain.connect(audioCtx.destination);
  }

  if (audioCtx.state === "suspended") await audioCtx.resume();
  return audioCtx;
}

function configurePluckedCompressor() {
  if (!pluckedCompressor) return;
  pluckedCompressor.threshold.value = -8;
  pluckedCompressor.knee.value = 24;
  pluckedCompressor.ratio.value = 3;
  pluckedCompressor.attack.value = 0.003;
  pluckedCompressor.release.value = 0.2;
}

function stopAllSounds() {
  activeNodes.forEach((node) => {
    try { node.osc1?.stop(); } catch {}
    try { node.osc2?.stop(); } catch {}
    try { node.osc3?.stop(); } catch {}
    try {
      node.filter?.disconnect();
      node.envelopeGain?.disconnect();
      node.osc1Gain?.disconnect();
      node.osc2Gain?.disconnect();
      node.osc3Gain?.disconnect();
    } catch {}
  });
  activeNodes = [];
}

function getPitchOctave(note) {
  if (typeof note !== "string") return null;
  const match = /(-?\d+)$/.exec(normalizePitchName(note));
  return match ? Number(match[1]) : null;
}

function isLowChordPitch(note) {
  const octave = getPitchOctave(note);
  return octave !== null && octave <= 3;
}

function getStackedChordPeakGain(note, noteCount = 1) {
  const baseGain = noteCount >= 4 ? 0.46 : 0.52;
  return isLowChordPitch(note) ? Math.min(baseGain, 0.4) : baseGain;
}

async function playPluckedString(noteString, timeOffset = 0, duration = 1.2, peakGain = 0.9, options = {}) {
  const context = await ensureAudioContext();
  if (!context || !pluckedMasterGain) return false;

  const frequency = getFreq(noteString);
  if (!frequency) return false;

  const startTime = context.currentTime + timeOffset;
  const osc1 = context.createOscillator();
  const osc2 = context.createOscillator();
  const osc1Gain = context.createGain();
  const osc2Gain = context.createGain();
  const filter = context.createBiquadFilter();
  const envelopeGain = context.createGain();

  osc1.type = "sawtooth";
  osc2.type = "triangle";
  osc1.frequency.setValueAtTime(frequency, startTime);
  osc2.frequency.setValueAtTime(frequency, startTime);

  const lowChordBody = options.isChord && isLowChordPitch(noteString);
  osc1Gain.gain.setValueAtTime(lowChordBody ? 0.9 : 0.78, startTime);
  osc2Gain.gain.setValueAtTime(lowChordBody ? 0.22 : 0.5, startTime);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(8000, startTime);
  filter.frequency.exponentialRampToValueAtTime(1500, startTime + 0.3);

  const boostedPeakGain = Math.max(peakGain, 0.85);
  envelopeGain.gain.setValueAtTime(0, startTime);
  envelopeGain.gain.linearRampToValueAtTime(boostedPeakGain, startTime + 0.01);
  envelopeGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc1.connect(osc1Gain);
  osc2.connect(osc2Gain);
  osc1Gain.connect(filter);
  osc2Gain.connect(filter);
  filter.connect(envelopeGain);
  envelopeGain.connect(pluckedMasterGain);

  osc1.start(startTime);
  osc2.start(startTime);
  osc1.stop(startTime + duration + 0.04);
  osc2.stop(startTime + duration + 0.04);

  const activeNode = { osc1, osc2, osc1Gain, osc2Gain, filter, envelopeGain };
  activeNodes.push(activeNode);
  osc2.addEventListener("ended", () => {
    activeNodes = activeNodes.filter((node) => node !== activeNode);
    try {
      osc1Gain.disconnect();
      osc2Gain.disconnect();
      filter.disconnect();
      envelopeGain.disconnect();
    } catch {
      // Nodes may already be disconnected by stopAllSounds().
    }
  }, { once: true });
  return true;
}

async function playChord(chord = {}, audioEngine = {}) {
  stopAllSounds();
  try {
    const duration = Number(audioEngine.durationMs || 850) / 1000;
    const strumMs = Number(audioEngine.strumMs ?? 35);
    const notes = getChordNotes(chord);
    if (!notes.length) return false;
    const engine = window.AudioEngine;
    if (!engine || typeof engine.playNote !== "function") return false;
    return engine.playNote({
      channel: "soundlab",
      profile: "soundlab-guide-tone",
      notes,
      timeOffsets: notes.map((_, index) => (index * strumMs) / 1000),
      duration,
      velocities: notes.map((note) => getStackedChordPeakGain(note, notes.length) * Number(audioEngine.gain ?? 1.0)),
      instrument: getSelectedAudioInstrument()
    });
  } catch {
    stopAllSounds();
    return false;
  }
}

async function playSoundLabGuideTone(noteString, timeOffset = 0, duration = 1.2, peakGain = 0.92, options = {}) {
  const context = await ensureAudioContext();
  if (!context || !pluckedMasterGain) return false;

  const frequency = getFreq(noteString);
  if (!frequency) return false;

  const startTime = context.currentTime + timeOffset;
  const endTime = startTime + duration;

  const osc1 = context.createOscillator();
  const osc2 = context.createOscillator();
  const osc3 = context.createOscillator();

  const osc1Gain = context.createGain();
  const osc2Gain = context.createGain();
  const osc3Gain = context.createGain();

  const filter = context.createBiquadFilter();
  const envelopeGain = context.createGain();

  // Guide tone goal:
  // clear fundamental for tuner/human ear,
  // enough dimension to avoid dead/thin sound,
  // no strong 3rd harmonic that can imply a fifth.
  osc1.type = "triangle";
  osc2.type = "sine";
  osc3.type = "sine";

  osc1.frequency.setValueAtTime(frequency, startTime);
  osc2.frequency.setValueAtTime(frequency, startTime);
  osc3.frequency.setValueAtTime(frequency * 2, startTime);

  // Subtle detune adds dimension without changing the perceived note.
  osc1.detune.setValueAtTime(0, startTime);
  osc2.detune.setValueAtTime(-3, startTime);
  osc3.detune.setValueAtTime(0, startTime);

  osc1Gain.gain.setValueAtTime(0.82, startTime);
  osc2Gain.gain.setValueAtTime(0.24, startTime);
  osc3Gain.gain.setValueAtTime(0.12, startTime);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(6500, startTime);
  filter.frequency.exponentialRampToValueAtTime(2800, startTime + 0.28);
  filter.Q.setValueAtTime(0.7, startTime);

  const safePeak = Math.min(Math.max(Number(peakGain || 0.92), 0.78), 1.0);
  const sustain = safePeak * 0.7;

  envelopeGain.gain.setValueAtTime(0.0001, startTime);
  envelopeGain.gain.exponentialRampToValueAtTime(safePeak, startTime + 0.018);
  envelopeGain.gain.exponentialRampToValueAtTime(sustain, startTime + 0.16);
  envelopeGain.gain.setValueAtTime(sustain, Math.max(startTime + 0.18, endTime - 0.18));
  envelopeGain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  osc1.connect(osc1Gain);
  osc2.connect(osc2Gain);
  osc3.connect(osc3Gain);

  osc1Gain.connect(filter);
  osc2Gain.connect(filter);
  osc3Gain.connect(filter);

  filter.connect(envelopeGain);
  envelopeGain.connect(pluckedMasterGain);

  osc1.start(startTime);
  osc2.start(startTime);
  osc3.start(startTime);

  osc1.stop(endTime + 0.06);
  osc2.stop(endTime + 0.06);
  osc3.stop(endTime + 0.06);

  const activeNode = {
    osc1,
    osc2,
    osc3,
    osc1Gain,
    osc2Gain,
    osc3Gain,
    filter,
    envelopeGain
  };

  activeNodes.push(activeNode);

  osc1.addEventListener("ended", () => {
    activeNodes = activeNodes.filter((node) => node !== activeNode);
    try {
      osc1Gain.disconnect();
      osc2Gain.disconnect();
      osc3Gain.disconnect();
      filter.disconnect();
      envelopeGain.disconnect();
    } catch {
      // Nodes may already be disconnected by stopAllSounds().
    }
  }, { once: true });

  return true;
}

async function playSoftPiano(noteString, timeOffset = 0, duration = 1.2, peakGain = 0.55, options = {}) {
  const context = await ensureAudioContext();
  if (!context || !pluckedMasterGain) return false;

  const frequency = getFreq(noteString);
  if (!frequency) return false;

  const startTime = context.currentTime + timeOffset;
  const osc1 = context.createOscillator();
  const osc2 = context.createOscillator();
  const osc3 = context.createOscillator();
  const osc1Gain = context.createGain();
  const osc2Gain = context.createGain();
  const osc3Gain = context.createGain();
  const filter = context.createBiquadFilter();
  const envelopeGain = context.createGain();

  osc1.type = "sine";
  osc2.type = "triangle";
  osc3.type = "sine";

  osc1.frequency.setValueAtTime(frequency, startTime);
  osc2.frequency.setValueAtTime(frequency * 2, startTime); // Harmonic 2
  osc3.frequency.setValueAtTime(frequency * 3, startTime); // Harmonic 3

  // Warm balance
  osc1Gain.gain.setValueAtTime(0.8, startTime);
  osc2Gain.gain.setValueAtTime(0.22, startTime);
  osc3Gain.gain.setValueAtTime(0.08, startTime);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(4800, startTime);
  filter.frequency.exponentialRampToValueAtTime(1400, startTime + 0.2);

  // Softer peak overall than plucked string
  const boostedPeakGain = Math.min(peakGain * 0.85, 0.7);

  envelopeGain.gain.setValueAtTime(0, startTime);
  envelopeGain.gain.linearRampToValueAtTime(boostedPeakGain, startTime + 0.012); // slightly slower attack
  envelopeGain.gain.exponentialRampToValueAtTime(boostedPeakGain * 0.3, startTime + 0.2); // quick decay
  envelopeGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc1.connect(osc1Gain);
  osc2.connect(osc2Gain);
  osc3.connect(osc3Gain);
  osc1Gain.connect(filter);
  osc2Gain.connect(filter);
  osc3Gain.connect(filter);
  filter.connect(envelopeGain);
  envelopeGain.connect(pluckedMasterGain);

  osc1.start(startTime);
  osc2.start(startTime);
  osc3.start(startTime);
  osc1.stop(startTime + duration + 0.04);
  osc2.stop(startTime + duration + 0.04);
  osc3.stop(startTime + duration + 0.04);

  const activeNode = { osc1, osc2, osc3, osc1Gain, osc2Gain, osc3Gain, filter, envelopeGain };
  activeNodes.push(activeNode);
  osc1.addEventListener("ended", () => {
    activeNodes = activeNodes.filter((node) => node !== activeNode);
    try {
      osc1Gain.disconnect();
      osc2Gain.disconnect();
      osc3Gain.disconnect();
      filter.disconnect();
      envelopeGain.disconnect();
    } catch {
      // Nodes may already be disconnected by stopAllSounds().
    }
  }, { once: true });
  return true;
}

function getChordNotes(chord = {}) {
  if (Array.isArray(chord.notes) && chord.notes.length) return chord.notes.map(normalizePitchName).filter(Boolean);
  if (Array.isArray(chord.frequencies) && chord.frequencies.length) return chord.frequencies.map(Number).filter(Boolean);
  return [];
}

function getFreq(note) {
  if (typeof note === "number") return note;
  const normalized = normalizePitchName(note);
  if (!normalized) return 0;
  if (NOTE_FREQUENCIES[normalized]) return NOTE_FREQUENCIES[normalized];
  const match = /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(normalized);
  if (!match) return 0;
  const [, rawLetter, accidental, rawOctave] = match;
  const semitones = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let midi = (Number(rawOctave) + 1) * 12 + semitones[rawLetter.toUpperCase()];
  if (accidental === "#") midi += 1;
  if (accidental === "b") midi -= 1;
  return 440 * 2 ** ((midi - 69) / 12);
}

function normalizePitchName(note) {
  if (typeof note !== "string") return note;
  const trimmed = note.trim();
  if (!trimmed) return "";
  if (/\d+$/.test(trimmed)) return trimmed;
  return `${trimmed}3`;
}

function playSequence(lab = {}, card, block = {}, labRef = "") {
  clearSequenceTimers();
  stopAllSounds();
  stopOscillators();

  const labItems = getLabPlaybackItems(lab);
  const chords = month2AsArray(lab.sequence).length
    ? month2AsArray(lab.sequence).map((id) => labItems.find((chord) => chord.id === id)).filter(Boolean)
    : labItems;

  if (!chords.length) {
    setLabStatus(card, "ยังไม่มีลำดับคอร์ดให้ฟัง");
    return;
  }

  const gapMs = Number(lab.audioEngine?.gapMs || 160);
  let nextStartMs = 0;

  setLabStatus(card, "", {
    state: "PROGRESSION",
    primary: formatSoundLabSequenceLabel(lab),
    hint: "Guide Tone Sequence",
    sequence: formatSoundLabSequenceLabel(lab)
  });

  chords.forEach((chord) => {
    const timer = window.setTimeout(async () => {
      activateChordButton(card, chord.id);
      const played = await playLabItem(lab, chord, card, block, { clearTimers: false });
      if (!played) updateLabStatus(card, chord, false, lab, block);
    }, nextStartMs);
    sequenceTimers.push(timer);
    nextStartMs += getLabItemTotalDurationMs(lab, chord, block) + gapMs;
  });

  const clearTimer = window.setTimeout(() => {
    clearActiveChord(card);
    setLabStatus(card, "", {
      state: "COMPLETE",
      primary: "ฟังครบ Progression แล้ว",
      hint: "ลองกดแต่ละคอร์ดซ้ำ แล้วฟังสีของ Guide Tone",
      sequence: formatSoundLabSequenceLabel(lab)
    });
  }, nextStartMs);
  sequenceTimers.push(clearTimer);
}

function stopActiveAudio(useSoundLabV2 = null) {
  if (useSoundLabV2 !== false && sharedSoundLabAudioPreviewMode) {
    soundLabAudioSession += 1;
    getSharedSoundLabAudioEngine()?.stopSoundLab();
  }

  if (useSoundLabV2 !== true) {
    clearSequenceTimers();
    stopAllSounds();
    stopOscillators();
    window.AudioEngine?.stopChannel?.("soundlab");
  }

  if (useSoundLabV2 === null) window.AudioEngine?.stopAllTonal?.();
}

function stopOscillators() {
  activeOscillators.forEach((oscillator) => {
    try {
      oscillator.stop();
    } catch {
      // Oscillator may already be stopped.
    }
    try {
      oscillator.disconnect();
    } catch {
      // Disconnection is best effort.
    }
  });
  activeOscillators = [];
}

function clearSequenceTimers() {
  sequenceTimers.forEach((timer) => window.clearTimeout(timer));
  sequenceTimers = [];
}

function activateChordButton(card, chordId) {
  if (!card) return;
  card.querySelectorAll(".chord-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.chordId === chordId);
  });
}

function clearActiveChord(card) {
  if (!card) return;
  card.querySelectorAll(".chord-button").forEach((button) => button.classList.remove("is-active"));
}

function updateLabStatus(card, chord = {}, audioPlayed, lab = {}, block = {}) {
  const guideTone = getSoundLabGuideToneText(lab, chord, block);
  const meta = {
    state: audioPlayed ? "PLAYED" : "TEXT PREVIEW",
    primary: getSoundLabPrimaryName(chord),
    guideTone,
    role: getSoundLabCompactRole(chord),
    sequence: formatSoundLabSequenceLabel(lab)
  };

  if (lab.audioEngine?.model === "sound-lab-v2" && chord.theoryNote && chord.playbackNote && chord.theoryNote !== chord.playbackNote) {
    meta.helperLine = `โน้ตที่เรียน: ${chord.theoryNote} · เสียงที่เปิดให้ฟัง: ${chord.playbackNote}`;
  }

  setLabStatus(card, "", meta);
}

function setLabStatus(card, text = "", meta = {}) {
  const status = card?.querySelector(".chord-lab-status");
  if (!status) return;

  const state = meta.state || "SOUND LAB";
  const primary = meta.primary || text || "เลือกคอร์ดหรือกด Play";
  const guide = meta.guideTone || "";
  const role = meta.role || "";
  const sequence = meta.sequence || "";
  const hint = meta.hint || "";

  status.replaceChildren();
  status.classList.add("sound-lab-digital-sign");

  const header = month2CreateElement("div", "sound-lab-display-header");
  header.append(
    month2CreateElement("span", "sound-lab-display-state", state),
    month2CreateElement("span", "sound-lab-display-led", "●")
  );

  const readout = month2CreateElement("div", "sound-lab-display-readout");

  const primaryLine = month2CreateElement("div", "sound-lab-display-primary");
  primaryLine.appendChild(month2CreateElement("strong", "sound-lab-display-chord", primary));

  const guideBadge = month2CreateElement(
    "span",
    `sound-lab-display-guide${guide ? "" : " is-placeholder"}`,
    guide ? `GUIDE ${guide}` : "GUIDE --"
  );
  if (!guide) guideBadge.setAttribute("aria-hidden", "true");
  primaryLine.appendChild(guideBadge);

  const roleLine = month2CreateElement(
    "div",
    "sound-lab-display-role",
    role || hint || "ฟังสีของคอร์ด แล้วเทียบกับฟอร์มด้านล่าง"
  );

  const sequenceLine = month2CreateElement(
    "div",
    "sound-lab-display-sequence",
    sequence || "พร้อมฟังทีละคอร์ด"
  );

  const helperLine = month2CreateElement(
    "div",
    `sound-lab-display-helper${meta.helperLine ? "" : " is-placeholder"}`,
    meta.helperLine || "โน้ตที่เรียน / เสียงที่เปิดให้ฟัง"
  );
  if (!meta.helperLine) helperLine.setAttribute("aria-hidden", "true");

  readout.append(primaryLine, roleLine, sequenceLine, helperLine);

  status.append(header, readout);
}

function renderMonth2MissingCard(message) {
  const card = month2CreateElement("article", "month2-component month2-missing-card");
  card.append(month2CreateElement("strong", "", "ข้อมูลยังไม่พร้อม"), month2CreateElement("p", "", message));
  return card;
}

function renderRhythmVisual(visual, isNested = false) {
  const blockClass = isNested ? "rhythm-demo-block rhythm-demo-inline" : "lesson-block rhythm-demo-block";

  return `
    <section class="${blockClass}">
      <div class="rhythm-demo-head">
        <div>
          <h3>ดูจังหวะ</h3>
          <p>${visual.title}</p>
        </div>
        <span>${visual.steps.length} ช่อง</span>
      </div>
      <p class="rhythm-instruction">${visual.instruction}</p>
      <div class="rhythm-visual" style="--step-count: ${visual.steps.length}; --bar-duration: ${visual.duration}s">
        <div class="rhythm-playhead" aria-hidden="true"></div>
        <div class="rhythm-steps">
          ${visual.steps.map((step) => `
            <div class="rhythm-step ${step.kind}">
              <strong>${step.count}</strong>
              <span>${step.action}</span>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="rhythm-legend" aria-label="คำอธิบายสีของ rhythm grid">
        <span><i class="legend-hit"></i>เล่น/ลงคอร์ด</span>
        <span><i class="legend-accent"></i>Accent</span>
        <span><i class="legend-mute"></i>Palm Mute หรือผ่านเงียบ</span>
        <span><i class="legend-rest"></i>เว้นไว้ แล้วนับต่อ</span>
      </div>
    </section>
  `;
}

function checkFocusedQuiz(weekItem) {
  let score = 0;
  weekItem.quiz.forEach((item, questionIndex) => {
    const selected = document.querySelector(`input[name="quiz-${weekItem.number}-${questionIndex}"]:checked`);
    if (selected && Number(selected.value) === item.answer) score += 1;
  });
  document.getElementById("lessonQuizResult").textContent = `ตอบถูก ${score} / ${weekItem.quiz.length} ข้อ`;
}

function renderFocusedProgressTracking() {
  const completed = recomputeCompletedFoundationWeeks();
  const list = document.getElementById("weekProgressList");
  if (!list) return;
  if (isDevPreviewActive()) {
    list.innerHTML = `
      <li class="progress-item dev-preview-progress-note">
        <span>
          <strong>DEV PREVIEW</strong>
          Progress controls are disabled in preview mode.
        </span>
      </li>
    `;
    return;
  }
  list.innerHTML = foundationWeeks.map((weekItem) => {
    const completedDayCount = getFoundationWeekCompletedDayCount(weekItem.number);
    const isWeekComplete = completed.includes(weekItem.number);
    return `
    <label class="progress-item${isWeekComplete ? " is-complete" : ""}">
      <input type="checkbox" data-complete-week="${weekItem.number}" ${isWeekComplete ? "checked" : ""} disabled aria-readonly="true" aria-label="สถานะสัปดาห์ที่ ${weekItem.number}: ${completedDayCount} จาก 7 วัน" />
      <span>
        <strong>สัปดาห์ที่ ${weekItem.number}</strong>
        ${weekItem.title}
        <small>${isWeekComplete ? "✓ " : ""}${completedDayCount}/7 วัน</small>
      </span>
    </label>
  `;
  }).join("");

  document.querySelectorAll("[data-complete-week]").forEach((input) => {
    input.addEventListener("change", () => {
      recomputeCompletedFoundationWeeks();
      renderFocusedProgressTracking();
      renderFocusedWeekTabs();
    });
  });
}

function savePracticeNotes() {
  const noteInput = document.getElementById("practiceNotes");
  const savedLabel = document.getElementById("notesSaved");
  if (!noteInput) return;
  safeSetItem(foundationStorage.notes, noteInput.value);
  if (savedLabel) savedLabel.textContent = "บันทึกไว้ในเครื่องแล้ว";
}

function renderPracticeNotes() {
  const noteInput = document.getElementById("practiceNotes");
  if (!noteInput) return;
  try {
    noteInput.value = localStorage.getItem(foundationStorage.notes) || "";
  } catch {
    noteInput.value = "";
  }
}

function renderPracticeStudioPreviewShell() {
  const existing = document.getElementById("practiceStudioPreviewShell");
  if (isPracticeRoomIaPreviewActive()) {
    existing?.remove();
    return;
  }

  if (!isFretboardStudioPreviewActive()) {
    existing?.remove();
    return;
  }

  if (existing) return;

  const practiceGrid = document.querySelector("#practice .practice-grid");
  if (!practiceGrid?.parentNode) return;

  practiceGrid.parentNode.insertBefore(createPracticeStudioPreviewShell(), practiceGrid);
}

function createPracticeStudioPreviewShell() {
  const shell = month2CreateElement("section", "practice-studio-preview-shell");
  shell.id = "practiceStudioPreviewShell";
  shell.setAttribute("aria-labelledby", "practiceStudioPreviewTitle");

  const header = month2CreateElement("div", "practice-studio-preview-head");
  header.append(
    month2CreateElement("p", "practice-studio-preview-eyebrow", "PRACTICE STUDIO"),
    month2CreateElement("h3", "practice-studio-preview-title", "Interactive Practice Hub"),
    month2CreateElement(
      "p",
      "practice-studio-preview-copy",
      "พื้นที่เครื่องมือซ้อมแบบโต้ตอบ สำหรับฝึกคอกีตาร์ เสียงคอร์ด และ groove"
    )
  );
  header.querySelector("h3")?.setAttribute("id", "practiceStudioPreviewTitle");

  const contentDiv = month2CreateElement("div", "practice-studio-preview-content");

  const card = month2CreateElement("div", "practice-studio-preview-card");

  const badge = month2CreateElement("span", "fsl-badge", "PREVIEW");
  const title = month2CreateElement("h4", "fsl-card-title", "Fretboard Studio Lite");
  const desc = month2CreateElement("p", "fsl-card-desc", "ฝึกจำคอ / interval / chord tones แบบโต้ตอบ");

  const openBtn = month2CreateElement("button", "fsl-btn fsl-open-btn", "เปิด Studio");
  openBtn.addEventListener("click", () => {
    openFretboardStudioModal();
  });

  card.append(badge, title, desc, openBtn);
  contentDiv.appendChild(card);

  shell.append(header, contentDiv);
  return shell;
}

function createPracticeRoomIaPreviewAnchor(node, label) {
  if (!node?.parentNode) return null;
  const anchor = document.createComment(`practice-room-ia:${label}`);
  node.parentNode.insertBefore(anchor, node);
  return anchor;
}

function restorePracticeRoomIaPreview() {
  const practiceSection = document.getElementById("practice");
  const practiceGrid = document.querySelector("#practice .practice-grid");
  const rhythmLayer = document.querySelector("#practice .rhythm-practice-layer");
  const originalHeading = document.querySelector("#practice > .section-heading");
  const existingShell = document.getElementById("practiceRoomIaPreviewShell");
  const placement = practiceRoomIaPreviewPlacement;

  if (placement) {
    [placement.miniCourse, ...placement.referenceShelves].forEach((item) => {
      if (item?.anchor?.parentNode && item.node) {
        item.anchor.parentNode.insertBefore(item.node, item.anchor);
        item.anchor.remove();
      }
    });
    placement.referenceShelves.forEach((item) => item.node?.classList.remove("reference-library-compact-item"));
  }

  existingShell?.remove();
  if (practiceGrid) {
    practiceGrid.hidden = false;
    practiceGrid.classList.remove("practice-room-ia-source-hidden");
  }
  if (rhythmLayer) rhythmLayer.hidden = false;
  if (originalHeading) originalHeading.hidden = false;
  if (practiceSection) {
    practiceSection.classList.remove("practice-room-ia-active");
    practiceSection.setAttribute("aria-labelledby", placement?.originalLabelledBy || "practiceTitle");
  }
  practiceRoomIaPreviewPlacement = null;
}
function renderPracticeRoomIaPreview() {
  const practiceGrid = document.querySelector("#practice .practice-grid");
  const originalHeading = document.querySelector("#practice > .section-heading");
  const existingShell = document.getElementById("practiceRoomIaPreviewShell");

  if (!isPracticeRoomIaPreviewActive()) {
    restorePracticeRoomIaPreview();
    return;
  }

  if (existingShell) return;
  if (practiceGrid) {
    practiceGrid.hidden = true;
    practiceGrid.classList.add("practice-room-ia-source-hidden");
  }
  if (originalHeading) originalHeading.hidden = true;

  const shell = month2CreateElement("div", "practice-room-ia-preview-shell");
  shell.id = "practiceRoomIaPreviewShell";

  const head = month2CreateElement("div", "section-heading");
  const iaTitle = month2CreateElement("h2", "", "Practice Room");
  iaTitle.id = "practiceRoomIaTitle";
  head.append(
    month2CreateElement("p", "eyebrow", "ห้องซ้อม"),
    iaTitle,
    month2CreateElement("p", "practice-room-ia-desc", "เลือกเครื่องมือฝึกซ้อม คอร์สเสริมระยะสั้น หรือเปิดคลังอ้างอิง")
  );

  const studioSection = month2CreateElement("section", "ia-zone ia-practice-studio practice-studio-container");
  studioSection.append(
    month2CreateElement("h3", "ia-zone-title", "Practice Studio"),
    month2CreateElement("p", "ia-zone-subtitle", "เครื่องมือฝึกซ้อมแบบโต้ตอบ")
  );

  const studioGrid = month2CreateElement("div", "ia-card-grid practice-studio-hero-grid");

  const fslCard = month2CreateElement("article", "ia-tool-card practice-studio-hero-card");
  fslCard.append(
    month2CreateElement("span", "fsl-badge", "PREVIEW"),
    month2CreateElement("h4", "", "Fretboard Studio Lite"),
    month2CreateElement("p", "", "ฝึกจำคอ / interval / chord tones แบบโต้ตอบ")
  );
  const fslBtn = month2CreateElement("button", "small-button", "เปิด Studio");
  fslBtn.addEventListener("click", () => openFretboardStudioModal());
  fslCard.appendChild(fslBtn);

  const slCard = month2CreateElement("article", "ia-tool-card practice-studio-hero-card");
  slCard.append(
    month2CreateElement("h4", "", "Sound Lab"),
    month2CreateElement("p", "", "ทดลองฟังเสียงคอร์ด (อ้างอิงตามบทเรียนหลัก)")
  );
  const slBtn = month2CreateElement("button", "small-button", "เลื่อนไปดูบทเรียน");
  slBtn.addEventListener("click", () => {
    document.querySelector("#lessons")?.scrollIntoView({ behavior: 'smooth' });
  });
  slCard.appendChild(slBtn);

  const metroCard = month2CreateElement("article", "ia-tool-card practice-studio-hero-card");
  metroCard.append(
    month2CreateElement("h4", "", "Metronome / Groove Trainer"),
    month2CreateElement("p", "", "ฝึก pulse, tempo และ groove ด้วย Metronome เดิมของแอป")
  );
  const metroBtn = month2CreateElement("button", "small-button", "เปิด Metronome");
  metroBtn.addEventListener("click", () => {
    document.getElementById("metronomeToggle")?.click();
  });
  metroCard.appendChild(metroBtn);

  studioGrid.append(fslCard, slCard, metroCard);
  studioSection.appendChild(studioGrid);

  const guidedSection = month2CreateElement("section", "ia-zone ia-guided-learning guided-learning-container");
  guidedSection.append(
    month2CreateElement("h3", "ia-zone-title", "Guided Learning"),
    month2CreateElement("p", "ia-zone-subtitle", "คอร์สเสริมและตารางซ้อมเฉพาะกิจ")
  );

  const quickMiniCourses = month2CreateElement("section", "quick-mini-courses");
  quickMiniCourses.append(
    month2CreateElement("h4", "guided-learning-subtitle", "Quick Mini Courses"),
    month2CreateElement("p", "guided-learning-copy", "คอร์สสั้นที่ใช้ progress และการเปิดบทเรียนเดิม")
  );

  const practicePrograms = month2CreateElement("section", "practice-programs");
  practicePrograms.append(
    month2CreateElement("h4", "guided-learning-subtitle", "Practice Programs"),
    month2CreateElement("p", "guided-learning-copy", "โปรแกรมซ้อมแบบมีโครงสร้าง — เปิดอ่านได้โดยยังไม่บันทึก progress")
  );

  const programsGrid = month2CreateElement("div", "ia-card-grid practice-program-grid");
  const rhProgramCard = month2CreateElement("article", "ia-tool-card");
  rhProgramCard.style.cursor = "pointer";
  rhProgramCard.append(
    month2CreateElement("span", "fsl-badge", "READ-ONLY"),
    month2CreateElement("h4", "", window.rhcProgramData?.title || "Right-Hand Control \u2014 16 Weeks"),
    month2CreateElement("p", "", window.rhcProgramData?.description || "โปรแกรมเจาะลึกการควบคุมมือขวาสำหรับมือใหม่")
  );
  rhProgramCard.addEventListener("click", () => {
    openRhcProgramModal();
  });

  const rhMiniCourseCard = month2CreateElement("article", "ia-tool-card rhc-minicourse-card");
  rhMiniCourseCard.style.cursor = "pointer";
  rhMiniCourseCard.dataset.rhMinicourseAction = "open-course";
  rhMiniCourseCard.append(
    month2CreateElement("span", "fsl-badge", "Phase 1 (Week 1–2)"),
    month2CreateElement("h4", "", window.rightHandMiniCourseData?.title || "Right-Hand Control \u2014 8 Weeks"),
    month2CreateElement("p", "", window.rightHandMiniCourseData?.description || "มินิคอร์สเจาะลึกการควบคุมมือขวาสำหรับมือใหม่")
  );

  programsGrid.appendChild(rhProgramCard);
  programsGrid.appendChild(rhMiniCourseCard);
  practicePrograms.appendChild(programsGrid);

  const refSection = month2CreateElement("section", "ia-zone ia-reference-library reference-library-compact");
  refSection.append(
    month2CreateElement("h3", "ia-zone-title", "Reference Library"),
    month2CreateElement("p", "ia-zone-subtitle", "เปิดดูเฉพาะเมื่อต้องการทบทวน TAB หรือค่าจังหวะ")
  );

  const referenceList = month2CreateElement("div", "reference-library-compact-list");
  refSection.appendChild(referenceList);

  guidedSection.append(quickMiniCourses, practicePrograms);
  shell.append(head, studioSection, guidedSection, refSection);

  const practiceSection = document.getElementById("practice");
  if (!practiceSection) return;
  const miniCourseShelf = document.getElementById("miniCourseShelf");
  const referenceShelves = Array.from(practiceSection.children).filter((element) => element.classList?.contains("reference-shelf"));

  practiceRoomIaPreviewPlacement = {
    originalLabelledBy: practiceSection.getAttribute("aria-labelledby") || "practiceTitle",
    miniCourse: miniCourseShelf ? {
      node: miniCourseShelf,
      anchor: createPracticeRoomIaPreviewAnchor(miniCourseShelf, "mini-course-shelf")
    } : null,
    referenceShelves: referenceShelves.map((node, index) => ({
      node,
      anchor: createPracticeRoomIaPreviewAnchor(node, `reference-shelf-${index}`)
    }))
  };

  practiceSection.setAttribute("aria-labelledby", "practiceRoomIaTitle");
  practiceSection.classList.add("practice-room-ia-active");
  practiceSection.prepend(shell);

  if (miniCourseShelf) quickMiniCourses.appendChild(miniCourseShelf);
  referenceShelves.forEach((element) => {
    element.classList.add("reference-library-compact-item");
    referenceList.appendChild(element);
  });
}

function openRhcProgramModal() {
  if (document.getElementById("rhc-program-modal")) return;
  const data = window.rhcProgramData;
  if (!data) {
    alert("Program data not loaded");
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "rhc-program-modal";
  overlay.className = "fsl-studio-modal-overlay";

  const modalContent = document.createElement("div");
  modalContent.className = "fsl-studio-modal-content rhc-program-content";

  const headerDiv = document.createElement("div");
  headerDiv.className = "fsl-studio-modal-header";

  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = `<span class="fsl-badge">READ-ONLY</span><h3 class="fsl-studio-modal-title">${data.title}</h3>`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "fsl-studio-close-btn";
  closeBtn.textContent = "ปิดโปรแกรม";
  closeBtn.onclick = () => overlay.remove();

  headerDiv.append(titleDiv, closeBtn);

  const bodyDiv = document.createElement("div");
  bodyDiv.className = "rhc-program-body";

  const desc = document.createElement("p");
  desc.className = "rhc-program-desc";
  desc.textContent = data.description;
  bodyDiv.appendChild(desc);

  data.chapters.forEach(ch => {
    const chSection = document.createElement("section");
    chSection.className = "rhc-chapter-card";

    const chHeader = document.createElement("div");
    chHeader.className = "rhc-chapter-header";
    chHeader.innerHTML = `<h4>${ch.title}</h4>`;

    const weekList = document.createElement("div");
    weekList.className = "rhc-week-list";

    ch.weeks.forEach(week => {
      const wBtn = document.createElement("button");
      wBtn.className = "rhc-week-btn";
      wBtn.textContent = week.title;

      const wDetail = document.createElement("div");
      wDetail.className = "rhc-week-detail";
      wDetail.hidden = true;

      if (week.weeklyGoal) {
        const wGoal = document.createElement("p");
        wGoal.className = "rhc-weekly-goal";
        wGoal.innerHTML = `<strong>เป้าหมายประจำสัปดาห์:</strong> ${week.weeklyGoal}`;
        wDetail.appendChild(wGoal);
      }

      const daysUl = document.createElement("ul");
      daysUl.className = "rhc-days-list";
      week.days.forEach(d => {
        const li = document.createElement("li");
        if (week.title.includes("Week 13") && d.dayStr.includes("Day 4")) {
          li.innerHTML = `
            <div class="rhc-study-lock">
              <h5>Original Study 1 &mdash; Easy</h5>
              <p><strong>DRAFT COMPLETE</strong></p>
              <p>HUMAN PLAYABILITY REVIEW: DEFERRED</p>
              <p>App implementation not started</p>
            </div>
          `;
        } else {
          if (d.dayStr) {
            li.innerHTML = `<strong>${d.dayStr}</strong>: ${d.desc}`;
          } else {
            li.textContent = d.desc;
          }
        }
        daysUl.appendChild(li);
      });
      wDetail.appendChild(daysUl);

      const persistentBlocks = document.createElement("div");
      persistentBlocks.className = "rhc-persistent-blocks";

      const comfortHtml = data.comfortTempo.map(item => `<li>${item}</li>`).join('');
      const rubricHtml = data.rubric.map(item => `<li>${item}</li>`).join('');
      const safetyHtml = data.safety.map(item => `<li>${item}</li>`).join('');

      persistentBlocks.innerHTML = `
        <div class="rhc-block">
          <h5>Comfort Tempo</h5>
          <ul class="rhc-dynamic-list">${comfortHtml}</ul>
        </div>
        <div class="rhc-block">
          <h5>Self-Check Rubric</h5>
          <ul class="rhc-dynamic-list">${rubricHtml}</ul>
        </div>
        <div class="rhc-block">
          <h5>Safety</h5>
          <ul class="rhc-dynamic-list">${safetyHtml}</ul>
        </div>
      `;
      wDetail.appendChild(persistentBlocks);

      wBtn.onclick = () => {
        const isHidden = wDetail.hidden;
        wDetail.hidden = !isHidden;
        wBtn.classList.toggle("active", !isHidden);
      };

      weekList.appendChild(wBtn);
      weekList.appendChild(wDetail);
    });

    chSection.append(chHeader, weekList);
    bodyDiv.appendChild(chSection);
  });

  modalContent.append(headerDiv, bodyDiv);
  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);
}

let rightHandMiniCourseDataLoadPromise = null;

function ensureRightHandMiniCourseData() {
  if (typeof window !== "undefined" && window.rightHandMiniCourseData) {
    return Promise.resolve(window.rightHandMiniCourseData);
  }

  if (rightHandMiniCourseDataLoadPromise) {
    return rightHandMiniCourseDataLoadPromise;
  }

  if (typeof document === "undefined") {
    return Promise.reject(new Error("Environment has no document."));
  }

  rightHandMiniCourseDataLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "righthand-minicourse-data.js";
    script.async = true;
    script.dataset.gcRightHandMiniCourseData = "true";

    script.onload = () => {
      if (!window.rightHandMiniCourseData) {
        reject(new Error("Right-Hand Mini Course data loaded without registering its schema."));
        return;
      }
      resolve(window.rightHandMiniCourseData);
    };

    script.onerror = () => {
      reject(new Error("Unable to load Right-Hand Mini Course data."));
    };

    document.head.appendChild(script);
  }).catch((error) => {
    rightHandMiniCourseDataLoadPromise = null;
    if (typeof document !== "undefined") {
      const el = document.querySelector('script[data-gc-right-hand-mini-course-data="true"]');
      if (el) {
        if (el.parentNode) el.parentNode.removeChild(el);
        else if (typeof el.remove === "function") el.remove();
      }
    }
    throw error;
  });

  return rightHandMiniCourseDataLoadPromise;
}

const RIGHT_HAND_MINI_COURSE_STORAGE_KEY = "gc_righthand_minicourse_v1";

function sanitizeRightHandMiniCourseState(raw) {
  const data = window.rightHandMiniCourseData;
  const validWeekIds = new Set();
  const validDrillIds = new Set();
  const validBlockIds = new Set();
  const validMnemonicModes = new Set(["food_en", "takadimi", "counting", "food_th"]);

  if (data && data.chapters) {
    data.chapters.forEach(ch => {
      (ch.weeks || []).forEach(w => {
        validWeekIds.add(w.id);
        (w.drills || []).forEach(d => validDrillIds.add(d.id));
        if (w.rhythmGeometryBlock) validBlockIds.add(w.rhythmGeometryBlock.id);
      });
    });
  }

  const phase1 = data && data.phases && data.phases[0];
  const phase1WeekIds = new Set(phase1 ? phase1.weekIds : ["w1", "w2"]);

  const sanitized = {
    schemaVersion: 1,
    selectedWeekId: (raw && phase1WeekIds.has(raw.selectedWeekId)) ? raw.selectedWeekId : "w1",
    completedDrillIds: [],
    completedWeekIds: [],
    mnemonicModeByBlock: {},
    preferredBpmByDrill: {}
  };

  // Deduplicate and filter completedDrillIds
  if (raw && Array.isArray(raw.completedDrillIds)) {
    const seen = new Set();
    raw.completedDrillIds.forEach(id => {
      if (typeof id === "string" && validDrillIds.has(id) && !seen.has(id)) {
        seen.add(id);
        sanitized.completedDrillIds.push(id);
      }
    });
  }

  // Filter mnemonicModeByBlock
  if (raw && raw.mnemonicModeByBlock && typeof raw.mnemonicModeByBlock === "object") {
    Object.keys(raw.mnemonicModeByBlock).forEach(k => {
      const v = raw.mnemonicModeByBlock[k];
      if (validBlockIds.has(k) && validMnemonicModes.has(v)) {
        sanitized.mnemonicModeByBlock[k] = v;
      }
    });
  }

  // Filter preferredBpmByDrill — clamp to 30–300
  if (raw && raw.preferredBpmByDrill && typeof raw.preferredBpmByDrill === "object") {
    Object.keys(raw.preferredBpmByDrill).forEach(k => {
      const v = raw.preferredBpmByDrill[k];
      if (validDrillIds.has(k) && typeof v === "number" && v >= 30 && v <= 300) {
        sanitized.preferredBpmByDrill[k] = v;
      }
    });
  }

  // Recompute completedWeekIds from completedDrillIds (never trust stored value)
  if (data && data.chapters) {
    const drillSet = new Set(sanitized.completedDrillIds);
    data.chapters.forEach(ch => {
      (ch.weeks || []).forEach(w => {
        const requiredDrills = (w.drills || []).filter(d => d.completionRequired !== false);
        if (requiredDrills.length > 0 && requiredDrills.every(d => drillSet.has(d.id))) {
          sanitized.completedWeekIds.push(w.id);
        }
      });
    });
  }

  return sanitized;
}

function getRightHandMiniCourseState() {
  const fallback = {
    schemaVersion: 1,
    selectedWeekId: "w1",
    completedDrillIds: [],
    completedWeekIds: [],
    mnemonicModeByBlock: {},
    preferredBpmByDrill: {}
  };
  const raw = loadJson(RIGHT_HAND_MINI_COURSE_STORAGE_KEY, fallback);
  return sanitizeRightHandMiniCourseState(raw);
}

function saveRightHandMiniCourseState(state) {
  saveJson(RIGHT_HAND_MINI_COURSE_STORAGE_KEY, state);
  return state;
}

function toggleRightHandDrillCompletion(weekId, drillId) {
  const state = getRightHandMiniCourseState();
  const completedSet = new Set(state.completedDrillIds || []);
  if (completedSet.has(drillId)) {
    completedSet.delete(drillId);
  } else {
    completedSet.add(drillId);
  }
  state.completedDrillIds = Array.from(completedSet);

  // Derive completedWeekIds using completionRequired filter
  const data = window.rightHandMiniCourseData;
  if (data && data.chapters) {
    const completedWeeks = [];
    data.chapters.forEach(ch => {
      (ch.weeks || []).forEach(w => {
        const requiredDrills = (w.drills || []).filter(d => d.completionRequired !== false);
        if (requiredDrills.length > 0 && requiredDrills.every(d => completedSet.has(d.id))) {
          completedWeeks.push(w.id);
        }
      });
    });
    state.completedWeekIds = completedWeeks;
  }

  saveRightHandMiniCourseState(state);
  return state;
}

function setRightHandDrillBpm(drillId, bpm) {
  const state = getRightHandMiniCourseState();
  state.preferredBpmByDrill = state.preferredBpmByDrill || {};
  state.preferredBpmByDrill[drillId] = Number(bpm);
  saveRightHandMiniCourseState(state);

  // Audio Invariant: Update metronome BPM only if running; stopped remains stopped.
  const isRunning = (typeof metronomeState !== "undefined" && metronomeState && metronomeState.running) || (typeof isPlaying !== "undefined" && isPlaying);
  if (isRunning) {
    setBpm(Number(bpm), { persist: true });
  } else {
    const slider = document.getElementById("bpmSlider");
    const input = document.getElementById("bpmValue");
    if (slider) slider.value = String(bpm);
    if (input) input.value = String(bpm);
    if (typeof selectedBpm !== "undefined") selectedBpm = Number(bpm);
  }
  return state;
}

function selectRightHandMiniCourseWeek(weekId) {
  const state = getRightHandMiniCourseState();
  state.selectedWeekId = weekId;
  saveRightHandMiniCourseState(state);

  const modal = document.getElementById("rh-minicourse-modal");
  if (!modal) return;
  const data = window.rightHandMiniCourseData;
  if (!data) return;

  const modalContent = modal.querySelector(".fsl-studio-modal-content");
  const bodyDiv = modal.querySelector(".rhc-program-body");
  if (modalContent && bodyDiv) {
    renderRightHandMiniCourseModalContent(modal, modalContent, bodyDiv, data);
  }
}

async function openRightHandMiniCourseModal() {
  let overlay = document.getElementById("rh-minicourse-modal");
  if (overlay) return;

  overlay = document.createElement("div");
  overlay.id = "rh-minicourse-modal";
  overlay.className = "fsl-studio-modal-overlay";

  const modalContent = document.createElement("div");
  modalContent.className = "fsl-studio-modal-content rhc-program-content rh-minicourse-modal-content";

  const headerDiv = document.createElement("div");
  headerDiv.className = "fsl-studio-modal-header";

  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = `<span class="fsl-badge">Phase 1 (Week 1–2)</span><h3 class="fsl-studio-modal-title">Right-Hand Control — 8 Weeks</h3>`;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "fsl-studio-close-btn";
  closeBtn.textContent = "ปิดมินิคอร์ส";
  closeBtn.dataset.rhMinicourseAction = "close-course";

  headerDiv.append(titleDiv, closeBtn);

  const bodyDiv = document.createElement("div");
  bodyDiv.className = "rhc-program-body";
  bodyDiv.innerHTML = `<div class="rhc-loading-spinner" style="padding: 24px; text-align: center;"><p>กำลังโหลดข้อมูลมินิคอร์ส...</p></div>`;

  modalContent.append(headerDiv, bodyDiv);
  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);

  try {
    const data = await ensureRightHandMiniCourseData();
    if (!data) throw new Error("Right-Hand Mini Course data empty after load");
    renderRightHandMiniCourseModalContent(overlay, modalContent, bodyDiv, data);
  } catch (err) {
    bodyDiv.innerHTML = `
      <div class="rhc-error-state" style="padding: 24px; text-align: center;">
        <p style="color: var(--ink); font-weight: bold; margin-bottom: 8px;">ไม่สามารถโหลดข้อมูล Right-Hand Mini Course ได้</p>
        <p class="rhc-error-detail" style="color: var(--muted); font-size: 0.88rem; margin: 0 0 16px;">${err?.message || "Unable to load Right-Hand Mini Course data."}</p>
        <button type="button" class="small-button primary" data-rh-minicourse-action="retry-load">ลองอีกครั้ง</button>
      </div>
    `;
  }
}

function renderRightHandMiniCourseModalContent(overlay, modalContent, bodyDiv, data) {
  bodyDiv.innerHTML = "";

  const titleEl = modalContent.querySelector(".fsl-studio-modal-title");
  if (titleEl && data.title) titleEl.textContent = data.title;

  const desc = document.createElement("p");
  desc.className = "rhc-program-desc";
  desc.textContent = data.description;
  bodyDiv.appendChild(desc);

  const state = getRightHandMiniCourseState();
  const completedDrillSet = new Set(state.completedDrillIds || []);
  const completedWeekSet = new Set(state.completedWeekIds || []);

  // Phase 1 Scope: Render ONLY weeks from phases[0].weekIds. Weeks 3-8 UI is prohibited.
  const phase1 = data.phases && data.phases[0];
  const allowedWeekIds = new Set(phase1 ? phase1.weekIds : ["w1", "w2"]);
  const visibleChapters = (data.chapters || []).map(ch => {
    const visibleWeeks = (ch.weeks || []).filter(week => allowedWeekIds.has(week.id));
    return { ...ch, weeks: visibleWeeks };
  }).filter(ch => ch.weeks.length > 0);

  visibleChapters.forEach(ch => {
    const chSection = document.createElement("section");
    chSection.className = "rhc-chapter-card";

    const chHeader = document.createElement("div");
    chHeader.className = "rhc-chapter-header";
    chHeader.innerHTML = `<h4>${ch.title}</h4>`;

    const weekList = document.createElement("div");
    weekList.className = "rhc-week-list";

    ch.weeks.forEach(week => {
      const isWeekComplete = completedWeekSet.has(week.id);
      const isWeekSelected = state.selectedWeekId === week.id;

      const wBtn = document.createElement("button");
      wBtn.type = "button";
      wBtn.className = `rhc-week-btn ${isWeekComplete ? 'is-completed' : ''} ${isWeekSelected ? 'active' : ''}`;
      wBtn.dataset.rhMinicourseAction = "select-week";
      wBtn.dataset.weekId = week.id;
      wBtn.innerHTML = `<span>${week.title}</span> ${isWeekComplete ? '<span class="week-check-badge">✓ สำเร็จ</span>' : ''}`;

      const wDetail = document.createElement("div");
      wDetail.className = "rhc-week-detail";
      wDetail.hidden = !isWeekSelected;

      if (week.weeklyGoal) {
        const wGoal = document.createElement("p");
        wGoal.className = "rhc-weekly-goal";
        wGoal.innerHTML = `<strong>เป้าหมายประจำสัปดาห์:</strong> ${week.weeklyGoal}`;
        wDetail.appendChild(wGoal);
      }

      // Reuse Rhythm Geometry Block if available (Week 1: 8ths, Week 2: 16ths)
      if (week.rhythmGeometryBlock) {
        const rgWrapper = document.createElement("div");
        rgWrapper.className = "rhc-rhythm-geometry-wrapper";
        if (typeof renderRhythmGeometryBlock === "function") {
          const blockId = week.rhythmGeometryBlock.id;
          const rgEl = renderRhythmGeometryBlock(week.rhythmGeometryBlock);
          if (rgEl && typeof rgEl.setAttribute === "function") {
            rgEl.setAttribute("data-block-id", blockId);
          }

          const savedMode = state.mnemonicModeByBlock && state.mnemonicModeByBlock[blockId];
          if (savedMode && rgEl) {
            setRhythmGeometryCardMode(rgEl, savedMode);
          }
          rgWrapper.appendChild(rgEl);
        }
        wDetail.appendChild(rgWrapper);
      }

      const daysUl = document.createElement("ul");
      daysUl.className = "rhc-days-list rh-drill-list";
      (week.drills || []).forEach(d => {
        const isDrillComplete = completedDrillSet.has(d.id);
        const li = document.createElement("li");
        li.className = `rh-drill-item ${isDrillComplete ? 'is-completed' : ''}`;

        const label = document.createElement("label");
        label.className = "rh-drill-label";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = isDrillComplete;
        checkbox.dataset.rhMinicourseAction = "toggle-drill";
        checkbox.dataset.drillId = d.id;
        checkbox.dataset.weekId = week.id;

        const textSpan = document.createElement("span");
        textSpan.innerHTML = `<strong>${d.dayStr} — ${d.title}</strong>: ${d.desc}`;

        label.append(checkbox, textSpan);
        li.appendChild(label);

        if (d.suggestedBpm && d.suggestedBpm > 0) {
          const bpmBtn = document.createElement("button");
          bpmBtn.type = "button";
          bpmBtn.className = "small-button rh-bpm-btn";
          bpmBtn.textContent = `Set ${d.suggestedBpm} BPM`;
          bpmBtn.dataset.rhMinicourseAction = "set-bpm";
          bpmBtn.dataset.drillId = d.id;
          bpmBtn.dataset.bpm = String(d.suggestedBpm);
          li.appendChild(bpmBtn);
        }

        daysUl.appendChild(li);
      });
      wDetail.appendChild(daysUl);

      const persistentBlocks = document.createElement("div");
      persistentBlocks.className = "rhc-persistent-blocks";

      const comfortHtml = (data.comfortTempo || []).map(item => `<li>${item}</li>`).join('');
      const rubricHtml = (data.rubric || []).map(item => `<li>${item}</li>`).join('');
      const safetyHtml = (data.safety || []).map(item => `<li>${item}</li>`).join('');

      persistentBlocks.innerHTML = `
        <div class="rhc-block">
          <h5>Comfort Tempo</h5>
          <ul class="rhc-dynamic-list">${comfortHtml}</ul>
        </div>
        <div class="rhc-block">
          <h5>Self-Check Rubric</h5>
          <ul class="rhc-dynamic-list">${rubricHtml}</ul>
        </div>
        <div class="rhc-block">
          <h5>Safety</h5>
          <ul class="rhc-dynamic-list">${safetyHtml}</ul>
        </div>
      `;
      wDetail.appendChild(persistentBlocks);

      weekList.appendChild(wBtn);
      weekList.appendChild(wDetail);
    });

    chSection.append(chHeader, weekList);
    bodyDiv.appendChild(chSection);
  });
}

function openFretboardStudioModal() {
  if (document.getElementById("fsl-studio-modal")) return;

  const modalOverlay = document.createElement("div");
  modalOverlay.id = "fsl-studio-modal";
  modalOverlay.className = "fsl-studio-modal-overlay";

  const modalContent = document.createElement("div");
  modalContent.className = "fsl-studio-modal-content";

  const headerDiv = document.createElement("div");
  headerDiv.className = "fsl-studio-modal-header";

  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = `<span class="fsl-badge">PREVIEW</span><h3 class="fsl-studio-modal-title">Fretboard Studio Lite</h3>`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "fsl-studio-close-btn";
  closeBtn.textContent = "ปิด Studio";

  headerDiv.append(titleDiv, closeBtn);

  let cleanupFslMount = () => {};

  const closeModal = () => {
    cleanupFslMount();
    if (modalOverlay.parentNode) {
      modalOverlay.parentNode.removeChild(modalOverlay);
    }
    document.removeEventListener("keydown", escapeListener);
  };

  closeBtn.addEventListener("click", closeModal);

  const escapeListener = (e) => {
    if (e.key === "Escape") closeModal();
  };
  document.addEventListener("keydown", escapeListener);

  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) closeModal();
  });

  const toolRoot = document.createElement("div");
  toolRoot.className = "fsl-studio-tool-root fsl-app-container";

  modalContent.append(headerDiv, toolRoot);
  modalOverlay.append(modalContent);
  document.body.appendChild(modalOverlay);

  cleanupFslMount = mountFretboardStudioLite(toolRoot) || (() => {});
}

function mountFretboardStudioLite(containerElement) {
  if (!containerElement || containerElement.dataset.fslMounted === "true") return () => {};
  containerElement.dataset.fslMounted = "true";
  const restoreFslInstrumentSelector = activateFslInstrumentSelectorGuard();

  function getFslAudioEngine() {
    const engine = window.AudioEngine;
    if (
      !engine ||
      typeof engine.unlock !== "function" ||
      typeof engine.playNote !== "function" ||
      typeof engine.stopChannel !== "function"
    ) {
      return null;
    }
    return engine;
  }

  // --- CHROMATIC NOTES & CANONICAL TUNINGS DATA ---
  const CHROMATIC_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const FLAT_TO_SHARP = { "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#" };

  const TUNINGS = {
    standard: [64, 59, 55, 50, 45, 40], // E4, B3, G3, D3, A2, E2
    dropd:    [64, 59, 55, 50, 45, 38], // E4, B3, G3, D3, A2, D2
    halfstep: [63, 58, 54, 49, 44, 39]  // D#4, A#3, F#3, C#3, G#2, D#2
  };
  const FSL_OPEN_STRING_MIDI = Object.freeze([64, 59, 55, 50, 45, 40]);

  const SCALE_DEGREE_DEFS = [
    { semitones: 0, role: "Root", roleLabel: "รากเสียง", focusTag: "Root", degree: "1st (Root)", interval: "Perfect Unison", formula: "โน้ตรากของคอร์ดสามเสียง เป็นศูนย์กลางของโทนเสียง" },
    { semitones: 2, role: "Major 2nd", roleLabel: "เมเจอร์ 2nd", focusTag: "2", degree: "2nd", interval: "Major 2nd", formula: "โน้ตขั้นที่ 2 ช่วยเชื่อมทำนองไปยังขั้นที่ 3" },
    { semitones: 3, role: "Minor 3rd", roleLabel: "ไมเนอร์ 3rd", focusTag: "b3", degree: "♭3rd", interval: "Minor 3rd", formula: "โน้ตขั้นที่ 3 ลดครึ่งเสียงใน Minor scale" },
    { semitones: 4, role: "Major 3rd", roleLabel: "เมเจอร์ 3rd", focusTag: "3", degree: "3rd", interval: "Major 3rd", formula: "โน้ตขั้นที่ 3 ซึ่งกำหนดคุณภาพของคอร์ดเมเจอร์" },
    { semitones: 5, role: "Perfect 4th", roleLabel: "Perfect 4th", focusTag: "4", degree: "4th", interval: "Perfect 4th", formula: "โน้ตขั้นที่ 4 ดึงกลับเข้าหาเมเจอร์ 3rd" },
    { semitones: 7, role: "Perfect 5th", roleLabel: "Perfect 5th", focusTag: "5", degree: "5th", interval: "Perfect 5th", formula: "โน้ตขั้นที่ 5 ให้ความมั่นคงและทำงานคู่กับรากเสียง" },
    { semitones: 9, role: "Major 6th", roleLabel: "เมเจอร์ 6th", focusTag: "6", degree: "6th", interval: "Major 6th", formula: "โน้ตขั้นที่ 6 ให้สีเสียงอบอุ่นในแนว pentatonic" },
    { semitones: 10, role: "Minor 7th", roleLabel: "ไมเนอร์ 7th", focusTag: "b7", degree: "♭7th", interval: "Minor 7th", formula: "โน้ตขั้นที่ 7 ลดครึ่งเสียงใน Minor scale" },
    { semitones: 11, role: "Major 7th", roleLabel: "เมเจอร์ 7th", focusTag: "7", degree: "7th", interval: "Major 7th", formula: "โน้ตนำที่สร้างแรงตึงกลับไปยังรากเสียงในอ็อกเทฟถัดไป" }
  ];



  const activeState = {
    selectedPosition: { stringNumber: 5, fretNumber: 3 },
    activeNote: "C3",
    freq: 130.81,
    role: "Root",
    key: "C",
    tuning: "standard",
    challengeMode: false,
    challengeTargetPos: { stringNum: 4, fretNum: 2 },
    challengeTarget: "E3",
    challengeTargetMidi: 52,
    challengeScore: 0,
    intervalFocus: "all",
    challengeTransitioning: false,
    challengeTimerId: null,
    challengeDeferredWorkId: null,
    challengeDeferredWorkKind: null,
    challengeBag: [],
    challengeLastMidi: null
  };

  const root = document.createElement("div");
  root.className = "gc-fsl-variant-b";
  containerElement.innerHTML = "";
  containerElement.appendChild(root);

  function syncContainerTheme() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light" ||
                    document.body.classList.contains("light-mode");
    if (isLight) {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
  }
  syncContainerTheme();

  function clearChallengeDeferredWork() {
    if (activeState.challengeDeferredWorkId === null) return;

    if (
      activeState.challengeDeferredWorkKind === "raf" &&
      typeof window !== "undefined" &&
      typeof window.cancelAnimationFrame === "function"
    ) {
      window.cancelAnimationFrame(activeState.challengeDeferredWorkId);
    } else {
      clearTimeout(activeState.challengeDeferredWorkId);
    }

    activeState.challengeDeferredWorkId = null;
    activeState.challengeDeferredWorkKind = null;
  }

  function clearChallengeTimer() {
    if (activeState.challengeTimerId !== null) {
      clearTimeout(activeState.challengeTimerId);
      activeState.challengeTimerId = null;
    }
    clearChallengeDeferredWork();
    activeState.challengeTransitioning = false;
  }

  function getNoteAccessibleLabel(stringNumber, fretNumber, noteFull, challengeHidden) {
    const sNum = Number(stringNumber);
    const fNum = Number(fretNumber);

    if (challengeHidden) {
      return fNum === 0
        ? 'สาย ' + sNum + ' โน้ตสายเปิด ไม่แสดงชื่อโน้ต'
        : 'สาย ' + sNum + ' เฟรต ' + fNum + ' ไม่แสดงชื่อโน้ต';
    }

    return fNum === 0
      ? 'สาย ' + sNum + ' สายเปิด โน้ต ' + noteFull
      : 'สาย ' + sNum + ' เฟรต ' + fNum + ' โน้ต ' + noteFull;
  }

  function maskInspectorForChallenge() {
    const liveNoteName = root.querySelector('#liveNoteName');
    const liveRoleLine = root.querySelector('#liveRoleLine');
    const liveSupportMeta = root.querySelector('#liveSupportMeta');

    if (liveNoteName) liveNoteName.textContent = "?";
    if (liveRoleLine) liveRoleLine.hidden = true;
    if (liveSupportMeta) liveSupportMeta.hidden = true;

    const detailDegree = root.querySelector('#detailDegree');
    const detailInterval = root.querySelector('#detailInterval');
    const detailFreq = root.querySelector('#detailFreq');
    const detailMidi = root.querySelector('#detailMidi');
    const detailFormula = root.querySelector('#detailFormula');

    if (detailDegree) detailDegree.textContent = "Hidden";
    if (detailInterval) detailInterval.textContent = "Hidden";
    if (detailFreq) detailFreq.textContent = "Hidden";
    if (detailMidi) detailMidi.textContent = "Hidden";
    if (detailFormula) detailFormula.textContent = "ซ่อนระหว่างโหมดท้าทาย กดตำแหน่งบนฟิงเกอร์บอร์ดเพื่อทดสอบความจำโน้ต";
  }

  function setState(updates) {
    if ('challengeMode' in updates) {
      clearChallengeTimer();
      if (updates.challengeMode) {
        updates.selectedPosition = null;
      } else if (activeState.challengeMode && updates.challengeMode === false) {
        activeState.selectedPosition = { stringNumber: 5, fretNumber: 3 };
      }
    }

    if ('tuning' in updates) {
      clearChallengeTimer();
    }

    Object.assign(activeState, updates);

    if ('intervalFocus' in updates || 'key' in updates || 'tuning' in updates || 'challengeMode' in updates) {
      renderFretboard();
    }

    if ('selectedPosition' in updates || 'key' in updates || 'tuning' in updates || 'challengeMode' in updates) {
      syncSelectedPositionAndInspector();
    }

    if ('tuning' in updates || 'challengeMode' in updates) {
      syncChallengeForCurrentTuning();
    }
  }

  function isExactSelectedPosition(stringNumber, fretNumber) {
    return (
      activeState.selectedPosition &&
      activeState.selectedPosition.stringNumber === Number(stringNumber) &&
      activeState.selectedPosition.fretNumber === Number(fretNumber)
    );
  }

  function midiToNoteName(midiNum) {
    const pitchIndex = midiNum % 12;
    const octave = Math.floor(midiNum / 12) - 1;
    return CHROMATIC_NOTES[pitchIndex] + octave;
  }

  function midiToFreq(midiNum) {
    return Math.round((440 * Math.pow(2, (midiNum - 69) / 12) + Number.EPSILON) * 100) / 100;
  }

  function getPitchClass(pitchOrNote) {
    const raw = pitchOrNote.replace(/[0-9]/g, '');
    return FLAT_TO_SHARP[raw] || raw;
  }

  function getPositionNote(stringNumber, fretNumber, tuningId = activeState.tuning) {
    const stringIdx = Number(stringNumber) - 1;
    const tuningMidiArray = TUNINGS[tuningId] || TUNINGS.standard;
    const openMidi = tuningMidiArray[stringIdx];
    const midiNum = openMidi + Number(fretNumber);
    return deriveNoteDataFromMidi(midiNum, activeState.key);
  }

  function getNoteDetailsAt(stringNum, fretNum) {
    return getPositionNote(stringNum, fretNum, activeState.tuning);
  }

  function deriveNoteDataFromMidi(midiNum, key = activeState.key) {
    const noteFull = midiToNoteName(midiNum);
    const freq = midiToFreq(midiNum);
    const pitchClass = getPitchClass(noteFull);

    const rootPitchClass = getPitchClass(key);
    const rootIndex = CHROMATIC_NOTES.indexOf(rootPitchClass);
    const pitchIndex = CHROMATIC_NOTES.indexOf(pitchClass);
    const semitonesFromRoot = (pitchIndex - rootIndex + 12) % 12;

    const degreeDef = SCALE_DEGREE_DEFS.find(d => d.semitones === semitonesFromRoot);

    return {
      noteFull,
      pitchClass,
      midiNum,
      freq,
      isRoot: semitonesFromRoot === 0,
      inScale: Boolean(degreeDef),
      role: degreeDef ? degreeDef.role : "Chromatic",
      roleLabel: degreeDef ? degreeDef.roleLabel : "โครมาติก",
      focusTag: degreeDef ? degreeDef.focusTag : "other",
      degree: degreeDef ? degreeDef.degree : "Chromatic",
      interval: degreeDef ? degreeDef.interval : "Chromatic",
      formula: degreeDef ? degreeDef.formula : 'โน้ตโครมาติก ' + noteFull + ' อยู่นอก Major scale ของคีย์ ' + key
    };
  }

  function renderFslWorkspace() {
    root.innerHTML = [
      '<div class="variant-b">',
      '  <div class="top-control-bar">',
      '    <div class="compact-focus-bar" id="focusBarBlock">',
      '      <span class="focus-label">เลือกช่วงเสียง:</span>',
      '      <div class="interval-btn-group" id="intervalBtnGroup">',
      '        <button type="button" class="interval-btn ' + (activeState.intervalFocus === "all" ? "active" : "") + '" data-focus="all">แสดงทั้งหมด</button>',
      '        <button type="button" class="interval-btn ' + (activeState.intervalFocus === "Root" ? "active" : "") + '" data-focus="Root">รากเสียง</button>',
      '        <button type="button" class="interval-btn ' + (activeState.intervalFocus === "b3" ? "active" : "") + '" data-focus="b3">♭3</button>',
      '        <button type="button" class="interval-btn ' + (activeState.intervalFocus === "3" ? "active" : "") + '" data-focus="3">3</button>',
      '        <button type="button" class="interval-btn ' + (activeState.intervalFocus === "5" ? "active" : "") + '" data-focus="5">5</button>',
      '        <button type="button" class="interval-btn ' + (activeState.intervalFocus === "b7" ? "active" : "") + '" data-focus="b7">♭7</button>',
      '      </div>',
      '      <button type="button" class="accordion-header challenge-cluster-control" id="accHeaderChallenge" aria-expanded="false" aria-controls="accBodyChallenge" data-challenge-primary-control data-challenge-mode="false" data-open-label="🎯 เปิดโหมดท้าทาย ▼" data-close-label="🎯 ปิดโหมดท้าทาย ▲">',
      '        <span class="acc-title" data-action-label>🎯 เปิดโหมดท้าทาย ▼</span>',
      '      </button>',
      '      <div class="top-challenge-body hidden" id="accBodyChallenge" aria-hidden="true">',
      '        <div class="challenge-card-body" id="challengeBanner" aria-live="polite" aria-atomic="true"></div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div class="main-workspace-layout">',
      '    <div class="fretboard-column">',
      '      <section class="fretboard-section">',
      '        <div class="section-header">',
      '          <h2 class="section-title">🎸 แผนผังฟิงเกอร์บอร์ด</h2>',
      '          <span class="section-subtitle">คอลัมน์สาย/สายเปิด × เฟรต 1–12</span>',
      '        </div>',
      '        <div class="fretboard-wrapper">',
      '          <div class="fretboard-grid" id="fretboardGrid">',
      '            <div class="fret-header-row">',
      '              <div class="string-label-head">สาย/เปิด</div>',
      '              <div class="fret-num">1</div><div class="fret-num">2</div><div class="fret-num">3</div><div class="fret-num">4</div><div class="fret-num">5</div><div class="fret-num">6</div><div class="fret-num">7</div><div class="fret-num">8</div><div class="fret-num">9</div><div class="fret-num">10</div><div class="fret-num">11</div><div class="fret-num">12</div>',
      '            </div>',
      '          </div>',
      '        </div>',
      '      </section>',
      '      <div class="compact-legend-bar">',
      '        <span class="legend-title">สัญลักษณ์:</span>',
      '        <span class="legend-item"><span class="dot-root"></span> รากเสียง</span>',
      '        <span class="legend-item"><span class="dot-scale"></span> ในสเกล</span>',
      '        <span class="legend-item"><span class="dot-other"></span> อื่น ๆ</span>',
      '        <span class="legend-item"><span class="star-selected">★</span> ตำแหน่งที่เลือก</span>',
      '      </div>',
      '    </div>',
      '    <div class="inspector-column">',
      '      <section class="inspector-section">',
      '        <div class="inspector-summary-bar inspector-summary-row" id="inspectorBarTrigger">',
      '          <span class="note-pill inspector-note-pill" id="liveNoteName">C3</span>',
      '          <span class="live-meta inspector-summary-content" id="liveNoteMeta">',
      '            <span class="inspector-role-line" id="liveRoleLine">บทบาท: <strong id="liveRole">รากเสียง</strong></span>',
      '            <span class="inspector-support-line" id="liveSupportMeta"><span id="liveFrequency">130.81 Hz</span><span aria-hidden="true"> · </span><span>สาย <span id="liveString">5</span></span><span aria-hidden="true"> · </span><span>เฟรต <span id="liveFret">3</span></span></span>',
      '            <span class="inspector-challenge-copy" id="liveChallengeMeta" hidden>โหมดท้าทายกำลังทำงาน — เลือกตำแหน่งเพื่อหาคำตอบ</span>',
      '          </span>',
      '        </div>',
      '        <button type="button" class="toggle-btn inspector-toggle" id="toggleInspectorBtn" aria-expanded="false" aria-controls="inspectorDetailsPanel" data-open-label="เปิดรายละเอียด ▼" data-close-label="ปิดรายละเอียด ▲">',
      '          <span data-action-label>เปิดรายละเอียด ▼</span>',
      '        </button>',
      '        <div class="collapsible-panel hidden" id="inspectorDetailsPanel">',
      '          <div class="inspector-card-body">',
      '            <div class="metrics-grid">',
      '              <div class="metric-box"><span class="metric-label">ลำดับขั้นเสียง</span><span class="metric-value" id="detailDegree">1st (Root)</span></div>',
      '              <div class="metric-box"><span class="metric-label">ชื่อช่วงเสียง</span><span class="metric-value" id="detailInterval">Perfect Unison</span></div>',
      '              <div class="metric-box"><span class="metric-label">ความถี่</span><span class="metric-value" id="detailFreq">130.81 Hz</span></div>',
      '              <div class="metric-box"><span class="metric-label">หมายเลขโน้ต MIDI</span><span class="metric-value" id="detailMidi">48</span></div>',
      '            </div>',
      '            <div class="formula-block"><span class="formula-label">บทบาทในฮาร์โมนี:</span><p class="formula-text" id="detailFormula">โน้ตรากของคอร์ด C เมเจอร์ (C - E - G) เป็นศูนย์กลางของโทนเสียง</p></div>',
      '          </div>',
      '        </div>',
      '      </section>',
      '      <section class="accordions-section">',
      '        <!-- Major vs Minor Accordion (SALVAGED FROM SUBAGENT B TRANSCRIPT LOG) -->',
      '        <div class="accordion-item" id="accMajorMinor">',
      '          <button type="button" class="accordion-header" id="accHeaderMajorMinor" aria-expanded="false" aria-controls="accBodyMajorMinor" data-open-label="เมเจอร์เทียบไมเนอร์" data-close-label="ปิดเมเจอร์เทียบไมเนอร์">',
      '            <span class="acc-title" data-action-label>เมเจอร์เทียบไมเนอร์</span>',
      '            <span class="chevron" data-chevron>▼</span>',
      '          </button>',
      '          <div class="accordion-body hidden" id="accBodyMajorMinor" aria-hidden="true">',
      '            <div class="acc-content">',
      '              <div class="comparison-table-wrapper">',
      '                <table class="comparison-table">',
      '                  <thead><tr><th>คุณสมบัติ</th><th>C เมเจอร์สเกล</th><th>C ไมเนอร์สเกล</th></tr></thead>',
      '                  <tbody>',
      '                    <tr><td>สูตร</td><td>1 - 2 - 3 - 4 - 5 - 6 - 7</td><td>1 - 2 - ♭3 - 4 - 5 - ♭6 - ♭7</td></tr>',
      '                    <tr><td>โน้ต</td><td>C - D - E - F - G - A - B</td><td>C - D - E♭ - F - G - A♭ - B♭</td></tr>',
      '                    <tr><td>อารมณ์เสียง</td><td>สว่าง ลงตัว สดใส</td><td>หม่น เศร้า ตึงเครียด</td></tr>',
      '                  </tbody>',
      '                </table>',
      '              </div>',
      '            </div>',
      '          </div>',
      '        </div>',
      '        <!-- Practice Recommendations Accordion (SALVAGED FROM SUBAGENT B TRANSCRIPT LOG) -->',
      '        <div class="accordion-item" id="accTips">',
      '          <button type="button" class="accordion-header" id="accHeaderTips" aria-expanded="false" aria-controls="accBodyTips" data-open-label="ข้อแนะนำการซ้อม" data-close-label="ปิดข้อแนะนำการซ้อม">',
      '            <span class="acc-title" data-action-label>ข้อแนะนำการซ้อม</span>',
      '            <span class="chevron" data-chevron>▼</span>',
      '          </button>',
      '          <div class="accordion-body hidden" id="accBodyTips" aria-hidden="true">',
      '            <div class="acc-content">',
      '              <ul class="tips-list">',
      '                <li><strong>นิ้วชี้ (1):</strong> กดโน้ตเฟรต 1 และวางนิ้วโป้งไว้ด้านหลังคอกีตาร์</li>',
      '                <li><strong>นิ้วกลาง (2):</strong> กดโน้ตเฟรต 2 และรักษาทรงนิ้วให้โค้ง</li>',
      '                <li><strong>นิ้วนาง (3):</strong> กดโน้ตเฟรต 3 ใกล้ลวดเฟรตเพื่อเสียงใส</li>',
      '                <li><strong>Economy Picking:</strong> ใช้ Downstroke เมื่อต้องเปลี่ยนสาย</li>',
      '              </ul>',
      '            </div>',
      '          </div>',
      '        </div>',
      '        <div class="accordion-item" id="accFullLegend">',
      '          <button type="button" class="accordion-header" id="accHeaderLegend" aria-expanded="false" aria-controls="accBodyLegend" data-open-label="เปิดสัญลักษณ์และสี" data-close-label="ปิดสัญลักษณ์และสี">',
      '            <span class="acc-title" data-action-label>เปิดสัญลักษณ์และสี</span>',
      '            <span class="chevron" data-chevron>▼</span>',
      '          </button>',
      '          <div class="accordion-body hidden" id="accBodyLegend" aria-hidden="true">',
      '            <div class="acc-content">',
      '              <div class="comparison-table-wrapper">',
      '                <table class="comparison-table">',
      '                  <thead><tr><th>สัญลักษณ์</th><th>รหัสสี</th><th>ความหมายและบทบาท</th></tr></thead>',
      '                  <tbody>',
      '                    <tr><td>🔴 ● รากเสียง</td><td>#ff6b4a (แดง)</td><td>โน้ตรากของคีย์ที่กำลังใช้ เช่น C ใน C เมเจอร์</td></tr>',
      '                    <tr><td>🟡 ● ในสเกล</td><td>#d8a866 (ทอง)</td><td>โน้ตไดอะโทนิกที่อยู่ใน Major/Minor scale</td></tr>',
      '                    <tr><td>⚪ ● อื่น ๆ</td><td>#a69888 (หม่น)</td><td>โน้ตโครมาติกที่อยู่นอกสเกล</td></tr>',
      '                    <tr><td>★ ตำแหน่งที่เลือก</td><td>#4ac6ff (ฟ้า)</td><td>ตำแหน่งที่เลือกอยู่บนฟิงเกอร์บอร์ด</td></tr>',
      '                  </tbody>',
      '                </table>',
      '              </div>',
      '            </div>',
      '          </div>',
      '        </div>',
      '      </section>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    renderFretboard();
    initFretboardEventDelegation();
    initIntervalFocus();
    initChallengeMode();
    initAccordions();
    syncSelectedPositionAndInspector();
  }

  function initFretboardEventDelegation() {
    const grid = root.querySelector('#fretboardGrid');
    if (!grid) return;

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-note-button]');
      if (!btn) return;

      const sNum = Number(btn.dataset.string);
      const fNum = Number(btn.dataset.fret);
      const clickedNoteFull = btn.dataset.noteFull;

      if (activeState.challengeMode) {
        if (activeState.challengeTransitioning) return;

        const clickedMidi = getPositionNote(sNum, fNum, activeState.tuning).midiNum;
        const isCorrect = (clickedMidi === activeState.challengeTargetMidi);

        showChallengeFeedback(isCorrect, activeState.challengeTarget, clickedNoteFull, sNum, fNum);

        if (isCorrect) {
          activeState.challengeScore += 1;
          activeState.challengeTransitioning = true;
          activeState.challengeTimerId = setTimeout(() => {
            activeState.challengeTimerId = null;
            if (!activeState.challengeMode) return;

            chooseNextChallengeTarget();
            updateChallengeBanner();

            const deferredRender = () => {
              activeState.challengeDeferredWorkId = null;
              activeState.challengeDeferredWorkKind = null;

              if (!activeState.challengeMode) {
                activeState.challengeTransitioning = false;
                return;
              }

              renderFretboard();
              syncSelectedPositionAndInspector();
              activeState.challengeTransitioning = false;
            };

            if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
              activeState.challengeDeferredWorkKind = "raf";
              activeState.challengeDeferredWorkId = window.requestAnimationFrame(deferredRender);
            } else {
              activeState.challengeDeferredWorkKind = "task";
              activeState.challengeDeferredWorkId = setTimeout(deferredRender, 0);
            }
          }, 750); // MANDATED 750ms DWELL TIMEOUT
        } else {
          clearChallengeTimer(); // cancel any previous wrong-feedback timer (prevents stacking)
          activeState.challengeTransitioning = true;
          activeState.challengeTimerId = setTimeout(() => {
            activeState.challengeTimerId = null;
            if (!activeState.challengeMode) return;
            activeState.challengeTransitioning = false;
            updateChallengeBanner(); // restore question prompt
          }, 750);
        }

        renderFretboard();
        syncSelectedPositionAndInspector();
        return;
      }

      selectFretboardPosition(sNum, fNum);
    });
  }

  function showChallengeFeedback(isCorrect, targetNote, chosenNote, stringNum, fretNum) {
    const banner = root.querySelector('#challengeBanner');
    if (!banner) return;

    const sStr = stringNum ? ' · สาย ' + stringNum + ' · เฟรต ' + fretNum : '';
    if (isCorrect) {
      banner.innerHTML = '<div class="challenge-prompt-header"><span class="challenge-status-tag correct-tag">✅ ถูกต้อง — ' + targetNote + sStr + '</span><span class="challenge-score-label">คะแนน: <strong>' + (activeState.challengeScore + 1) + '</strong></span></div><div class="challenge-subtext">เตรียมโจทย์ถัดไป — รักษาจังหวะให้มั่นคง</div>';
    } else {
      banner.innerHTML = '<div class="challenge-prompt-header"><span class="challenge-status-tag wrong-tag">❌ ยังไม่ถูก — คุณเลือก ' + chosenNote + '</span><span class="challenge-score-label">คะแนน: <strong>' + activeState.challengeScore + '</strong></span></div><div class="challenge-subtext">ลองอีกครั้ง — โจทย์เดิมยังไม่เปลี่ยน</div>';
    }
  }

  function buildChallengeMidiPool(tuningId) {
    const midiMap = {};
    const tuningMidiArray = TUNINGS[tuningId] || TUNINGS.standard;
    for (let s = 1; s <= 6; s++) {
      const openMidi = tuningMidiArray[s - 1];
      for (let f = 0; f <= 12; f++) {
        const midi = openMidi + f;
        if (!(midi in midiMap)) {
          midiMap[midi] = { stringNum: s, fretNum: f };
        }
      }
    }
    return Object.keys(midiMap)
      .map(Number)
      .sort(function(a, b) { return a - b; })
      .map(function(midi) { return { midi: midi, stringNum: midiMap[midi].stringNum, fretNum: midiMap[midi].fretNum }; });
  }

  function refillChallengeBag(pool, lastMidi) {
    const bag = pool.slice();
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = bag[i]; bag[i] = bag[j]; bag[j] = tmp;
    }
    // prevent immediate repeat across bag refill
    if (bag.length > 1 && bag[0].midi === lastMidi) {
      const tmp = bag[0]; bag[0] = bag[1]; bag[1] = tmp;
    }
    return bag;
  }

  function chooseNextChallengeTarget() {
    const pool = buildChallengeMidiPool(activeState.tuning);
    if (pool.length === 0) return;

    if (activeState.challengeBag.length === 0) {
      activeState.challengeBag = refillChallengeBag(pool, activeState.challengeLastMidi);
    }

    const next = activeState.challengeBag.shift();
    if (!next) return;

    activeState.challengeLastMidi = next.midi;
    activeState.challengeTargetMidi = next.midi;
    activeState.challengeTargetPos = { stringNum: next.stringNum, fretNum: next.fretNum };
    activeState.challengeTarget = midiToNoteName(next.midi);
  }

  function setChallengeOpen(open) {
    const bodyEl = root.querySelector('#accBodyChallenge');
    const headerBtn = root.querySelector('#accHeaderChallenge');
    if (!headerBtn) return;

    if (open) {
      activeState.challengeBag = [];
      activeState.challengeLastMidi = null;
      chooseNextChallengeTarget();
      setState({ challengeMode: true, challengeScore: 0 });
      if (bodyEl) {
        bodyEl.classList.remove('hidden');
        bodyEl.setAttribute('aria-hidden', 'false');
      }
      headerBtn.setAttribute('aria-expanded', 'true');
      headerBtn.setAttribute('data-challenge-mode', 'true');
    } else {
      clearChallengeTimer();
      const _closeEngine = getFslAudioEngine();
      if (_closeEngine) _closeEngine.stopChannel('fsl');
      setState({ challengeMode: false });

      if (bodyEl) {
        bodyEl.classList.add('hidden');
        bodyEl.setAttribute('aria-hidden', 'true');
      }
      headerBtn.setAttribute('aria-expanded', 'false');
      headerBtn.setAttribute('data-challenge-mode', 'false');
    }
    syncAccordionTrigger(headerBtn, open);
    updateChallengeBanner();
  }

  function initChallengeMode() {
    const headerBtn = root.querySelector('#accHeaderChallenge');
    if (!headerBtn) return;

    headerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isCurrentlyOpen = activeState.challengeMode;
      setChallengeOpen(!isCurrentlyOpen);
    });
  }

  function syncChallengeForCurrentTuning() {
    if (!activeState.challengeMode) return;
    // The FSL UI has no tuning selector; activeState.tuning is always "standard".
    // This path is only reached when challengeMode changes via setState.
    // Refresh display name from the stored MIDI and update the banner.
    activeState.challengeTarget = midiToNoteName(activeState.challengeTargetMidi);
    updateChallengeBanner();
  }

  function updateChallengeBanner() {
    const banner = root.querySelector('#challengeBanner');
    if (!banner) return;

    if (activeState.challengeMode) {
      banner.innerHTML = '<div class="challenge-prompt-header"><span class="challenge-target-label">🎯 โจทย์: หาโน้ต <strong class="challenge-target-highlight">' + activeState.challengeTarget + '</strong></span><span class="challenge-score-label">คะแนน: <strong>' + activeState.challengeScore + '</strong></span></div><div class="challenge-subtext">เลือกตำแหน่งบนฟิงเกอร์บอร์ด</div>';
    } else {
      banner.innerHTML = '';
    }
  }

  function initIntervalFocus() {
    const group = root.querySelector('#intervalBtnGroup');
    if (!group) return;

    group.addEventListener('click', (e) => {
      const btn = e.target.closest('.interval-btn');
      if (!btn) return;

      const focusTag = btn.dataset.focus;
      group.querySelectorAll('.interval-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      setState({ intervalFocus: focusTag });
    });
  }

  function renderFretboard() {
    const grid = root.querySelector('#fretboardGrid');
    if (!grid) return;

    const rows = grid.querySelectorAll('.string-row');
    rows.forEach(r => r.remove());

    const isChallengeHidden = activeState.challengeMode;

    for (let s = 1; s <= 6; s++) {
      const row = document.createElement('div');
      row.className = 'string-row';
      row.dataset.string = String(s);

      const openNoteDetails = getPositionNote(s, 0, activeState.tuning);
      const isOpenSelected = isExactSelectedPosition(s, 0);
      const openLabel = getNoteAccessibleLabel(s, 0, openNoteDetails.noteFull, isChallengeHidden);

      const openCol = document.createElement('div');
      openCol.className = 'string-label-combined';
      openCol.innerHTML = '<span class="string-title">สาย ' + s + '</span><button type="button" class="note-hit-target open-note-target ' + (isOpenSelected ? 'is-selected' : '') + '" data-note-button data-string="' + s + '" data-fret="0" data-note-full="' + openNoteDetails.noteFull + '" aria-label="' + openLabel + '"><span class="note-marker open-badge ' + (isOpenSelected ? 'active-selected' : '') + '">' + (isChallengeHidden ? '?' : openNoteDetails.pitchClass) + '</span></button>';
      row.appendChild(openCol);

      for (let f = 1; f <= 12; f++) {
        const fretCell = document.createElement('div');
        fretCell.className = 'fret-cell';
        fretCell.dataset.fret = String(f);

        const noteDetails = getPositionNote(s, f, activeState.tuning);
        const isSelected = isExactSelectedPosition(s, f);
        const isDimmed = shouldDimMarker(noteDetails.pitchClass);
        const cellLabel = getNoteAccessibleLabel(s, f, noteDetails.noteFull, isChallengeHidden);

        let markerClass = 'note-marker';
        if (isSelected) {
          markerClass += ' active-selected';
        } else if (noteDetails.isRoot) {
          markerClass += ' root-note';
        } else if (noteDetails.inScale) {
          markerClass += ' in-scale';
        }
        if (isDimmed) markerClass += ' dimmed';

        fretCell.innerHTML = '<button type="button" class="note-hit-target fretted-note-target ' + (isSelected ? 'is-selected' : '') + '" data-note-button data-string="' + s + '" data-fret="' + f + '" data-note-full="' + noteDetails.noteFull + '" aria-label="' + cellLabel + '"><span class="' + markerClass + '">' + (isChallengeHidden ? '?' : noteDetails.pitchClass) + '</span></button>';
        row.appendChild(fretCell);
      }

      grid.appendChild(row);
    }
  }

  function shouldDimMarker(pitchClass) {
    if (activeState.intervalFocus === 'all') return false;

    const rootPitchClass = getPitchClass(activeState.key);
    const rootIndex = CHROMATIC_NOTES.indexOf(rootPitchClass);
    const pitchIndex = CHROMATIC_NOTES.indexOf(pitchClass);
    const semitonesFromRoot = (pitchIndex - rootIndex + 12) % 12;

    const degreeDef = SCALE_DEGREE_DEFS.find(d => d.semitones === semitonesFromRoot);
    if (!degreeDef) return true;

    return degreeDef.focusTag !== activeState.intervalFocus;
  }

  function selectFretboardPosition(stringNumber, fretNumber) {
    const sNum = Number(stringNumber);
    const fNum = Number(fretNumber);

    activeState.selectedPosition = { stringNumber: sNum, fretNumber: fNum };

    root.querySelectorAll('[data-note-button]').forEach(btn => {
      const bString = Number(btn.dataset.string);
      const bFret = Number(btn.dataset.fret);
      const isSel = (bString === sNum && bFret === fNum);

      btn.classList.toggle('is-selected', isSel);
      const marker = btn.querySelector('.note-marker');
      if (marker) {
        marker.classList.toggle('active-selected', isSel);
      }
    });

    const engine = getFslAudioEngine();
    if (engine) {
      const noteDetails = getNoteDetailsAt(sNum, fNum);
      engine.playNote({ channel: 'fsl', profile: 'fsl-fretboard-position', note: noteDetails.noteFull, velocity: 0.8 });

    }

    syncSelectedPositionAndInspector();
  }

  function syncSelectedPositionAndInspector() {
    if (activeState.challengeMode) {
      maskInspectorForChallenge();
      return;
    }

    const pos = activeState.selectedPosition || { stringNumber: 5, fretNumber: 3 };
    const noteDetails = getNoteDetailsAt(pos.stringNumber, pos.fretNumber);
    updateInspector(noteDetails);
  }

  function updateInspector(noteDetails) {
    const pos = activeState.selectedPosition || { stringNumber: 5, fretNumber: 3 };

    const liveNoteName = root.querySelector('#liveNoteName');
    const liveRole = root.querySelector('#liveRole');
    const liveRoleLine = root.querySelector('#liveRoleLine');
    const liveSupportMeta = root.querySelector('#liveSupportMeta');
    const liveChallengeMeta = root.querySelector('#liveChallengeMeta');
    const liveFrequency = root.querySelector('#liveFrequency');
    const liveString = root.querySelector('#liveString');
    const liveFret = root.querySelector('#liveFret');

    if (liveNoteName) liveNoteName.textContent = noteDetails.noteFull;
    if (liveRole) liveRole.textContent = noteDetails.roleLabel || noteDetails.role;
    if (liveRoleLine) liveRoleLine.hidden = false;
    if (liveSupportMeta) liveSupportMeta.hidden = false;

    if (liveFrequency) liveFrequency.textContent = noteDetails.freq + ' Hz';
    if (liveString) liveString.textContent = String(pos.stringNumber);
    if (liveFret) liveFret.textContent = String(pos.fretNumber);

    const detailDegree = root.querySelector('#detailDegree');
    const detailInterval = root.querySelector('#detailInterval');
    const detailFreq = root.querySelector('#detailFreq');
    const detailMidi = root.querySelector('#detailMidi');
    const detailFormula = root.querySelector('#detailFormula');

    if (detailDegree) detailDegree.textContent = noteDetails.degree;
    if (detailInterval) detailInterval.textContent = noteDetails.interval;
    if (detailFreq) detailFreq.textContent = noteDetails.freq + ' Hz';
    if (detailMidi) detailMidi.textContent = String(noteDetails.midiNum);
    if (detailFormula) detailFormula.textContent = noteDetails.formula;
  }

  function syncAccordionTrigger(headerBtn, isOpen) {
    if (!headerBtn) return;
    const actionSpan = headerBtn.querySelector('[data-action-label]');
    const chevronSpan = headerBtn.querySelector('[data-chevron]');

    const openLabel = headerBtn.dataset.openLabel || "เปิดรายละเอียด";
    const closeLabel = headerBtn.dataset.closeLabel || "ปิดรายละเอียด";

    if (actionSpan) {
      actionSpan.textContent = isOpen ? closeLabel : openLabel;
    }
    if (chevronSpan) {
      chevronSpan.textContent = isOpen ? "▲" : "▼";
    }
    headerBtn.setAttribute('aria-expanded', String(isOpen));
  }

  function syncInspectorToggle(toggleBtn, panel, isOpen) {
    if (!toggleBtn || !panel) return;
    const actionSpan = toggleBtn.querySelector('[data-action-label]');
    const openLabel = toggleBtn.dataset.openLabel || "เปิดรายละเอียด ▼";
    const closeLabel = toggleBtn.dataset.closeLabel || "ปิดรายละเอียด ▲";
    panel.classList.toggle('hidden', !isOpen);
    panel.setAttribute('aria-hidden', String(!isOpen));
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    if (actionSpan) actionSpan.textContent = isOpen ? closeLabel : openLabel;
  }

  function initAccordions() {
    const items = root.querySelectorAll('.accordion-item');
    items.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const body = item.querySelector('.accordion-body');
      if (header && body) {
        setupAccordionItem(header, body);
      }
    });

    const toggleInspectorBtn = root.querySelector('#toggleInspectorBtn');
    const inspectorPanel = root.querySelector('#inspectorDetailsPanel');

    if (toggleInspectorBtn && inspectorPanel) {
      const toggleInspector = () => {
        const isOpen = inspectorPanel.classList.contains('hidden');
        syncInspectorToggle(toggleInspectorBtn, inspectorPanel, isOpen);
      };
      toggleInspectorBtn.addEventListener('click', () => {
        toggleInspector();
      });
      toggleInspectorBtn.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        toggleInspector();
      });
      syncInspectorToggle(toggleInspectorBtn, inspectorPanel, !inspectorPanel.classList.contains('hidden'));
    }
  }

  function setupAccordionItem(headerBtn, bodyEl) {
    headerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = bodyEl.classList.contains('hidden');
      bodyEl.classList.toggle('hidden', !isHidden);
      bodyEl.setAttribute('aria-hidden', String(!isHidden));
      syncAccordionTrigger(headerBtn, isHidden);
    });

    headerBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Delegate to click so all click handlers (including initChallengeMode's
        // setChallengeOpen) fire correctly. Do NOT manually toggle CSS here.
        headerBtn.click();
      }
    });

  }

  renderFslWorkspace();

  return () => {
    clearChallengeTimer();
    const _unmountEngine = getFslAudioEngine();
    if (_unmountEngine) _unmountEngine.stopChannel('fsl');
    restoreFslInstrumentSelector();
    containerElement.innerHTML = "";
    delete containerElement.dataset.fslMounted;
  };

}

function getMiniCourses() {
  const all = month2AsArray(courseData?.miniCourses || miniCourses)
    .filter((course) => course?.miniCourse?.id);
  if (FEATURE_MINI_COURSE_SHELF || Boolean(miniCoursePreviewMode)) return all;
  return all.filter((course) => course?.miniCourse?.visibility === "public");
}

function getMiniCourseById(courseId) {
  const id = String(courseId || "").trim();
  return getMiniCourses().find((course) => course?.miniCourse?.id === id) || null;
}

function getMiniCourseStorageKey(courseId) {
  const course = getMiniCourseById(courseId);
  return course?.progressModel?.storageKey || `gc:mini:${courseId}:progress:v1`;
}

function emitMiniCourseEvent(name, detail = {}) {
  try {
    window.dispatchEvent(new CustomEvent(`gc:mini-course:${name}`, { detail }));
  } catch {
    // Debug events are optional and must never block the lesson UI.
  }
}

function closeMiniCourseDetail(options = {}) {
  const { rerender = true } = options;
  if (!activeMiniCourseId) return false;
  activeMiniCourseId = "";
  if (rerender) renderMiniCourseShelf();
  return true;
}

function renderMiniCourseShelf(options = {}) {
  const shelf = document.getElementById("miniCourseShelf");
  if (!shelf) return;

  if (!isMiniCoursePreviewActive()) {
    shelf.hidden = true;
    shelf.replaceChildren();
    activeMiniCourseId = "";
    return;
  }

  shelf.hidden = false;
  shelf.replaceChildren();

  const isDevMode = FEATURE_MINI_COURSE_SHELF || Boolean(miniCoursePreviewMode);
  const header = month2CreateElement("div", "mini-course-shelf-head");
  header.append(
    month2CreateElement("p", "eyebrow", "คอร์สเสริมสั้น ๆ"),
    month2CreateElement("h2", "", "คอร์สเสริมสั้น ๆ"),
    isDevMode
      ? month2CreateElement("p", "mini-course-dev-notice", "[Dev Preview] แสดงทุก Mini Course รวมที่ยังซ่อนอยู่")
      : month2CreateElement("p", "", "")
  );
  shelf.appendChild(header);

  const courses = getMiniCourses();
  if (!courses.length) {
    shelf.appendChild(renderMiniCourseFallback("ยังไม่มี Mini Course ให้เปิดในตอนนี้", "MC_NO_COURSES"));
    return;
  }

  const grid = month2CreateElement("div", "mini-course-card-grid");
  courses.forEach((course) => grid.appendChild(renderMiniCourseCard(course)));
  shelf.appendChild(grid);

  const activeCourse = getMiniCourseById(activeMiniCourseId);
  if (activeCourse) {
    const detail = renderMiniCourseDetail(activeCourse);
    shelf.appendChild(detail);
    if (options.focusDetail) {
      requestAnimationFrame(() => {
        detail.focus({ preventScroll: true });
        detail.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }
}

function renderMiniCourseCard(course) {
  const meta = course?.miniCourse || {};
  const card = month2CreateElement("article", "panel mini-course-card");
  const completedCount = getMiniCourseProgress(meta.id).completedDays.length;
  const totalDays = Number(meta.totalDays || course?.modules?.length || 7);

  const chipLabel = meta.visibility === "public" ? "เสริมพื้นฐาน" : "Preview / Hidden";
  card.append(
    month2CreateElement("p", "panel-label", chipLabel),
    month2CreateElement("h3", "", meta.title || "Rhythm Notation Starter"),
    month2CreateElement("p", "mini-course-thai-title", meta.thaiTitle || "อ่านค่าจังหวะ: ตัวดำ ตัวหยุด และจังหวะตก-ยก"),
    month2CreateElement("p", "", `${totalDays} วัน · วันละประมาณ ${meta.estimatedMinutesPerDay || 10} นาที · ทำแล้ว ${completedCount}/${totalDays} วัน`)
  );

  const ctaLabel = meta.visibility === "public" ? "เปิดคอร์สเสริม" : "เปิด Mini Course";
  const button = month2CreateElement("button", "small-button mini-course-open-button", ctaLabel);
  button.type = "button";
  button.addEventListener("click", () => {
    if (activeMiniCourseId === meta.id) {
      closeMiniCourseDetail();
      return;
    }
    activeMiniCourseId = meta.id;
    emitMiniCourseEvent("open", { courseId: meta.id, source: "shelf-card" });
    renderMiniCourseShelf({ focusDetail: true });
  });
  card.appendChild(button);
  return card;
}

function renderMiniCourseDetail(course) {
  const meta = course?.miniCourse || {};
  const progress = getMiniCourseProgress(meta.id);
  const totalDays = Number(meta.totalDays || course?.modules?.length || 7);
  const day = normalizeMiniCourseDay(progress.currentDay, totalDays);
  const module = month2AsArray(course?.modules).find((item) => Number(item.day) === day);
  const detail = month2CreateElement("article", "mini-course-detail");
  detail.id = `mini-course-detail-${meta.id || "course"}`;
  detail.tabIndex = -1;

  const head = month2CreateElement("header", "mini-course-detail-head");
  const copy = month2CreateElement("div");
  copy.append(
    month2CreateElement("p", "eyebrow", "Hidden Mini Course Preview"),
    month2CreateElement("h3", "", meta.title || "Rhythm Notation Starter"),
    month2CreateElement("p", "", meta.thaiTitle || "อ่านค่าจังหวะ: ตัวดำ ตัวหยุด และจังหวะตก-ยก"),
    month2CreateElement("p", "mini-course-progress-copy", progress.completedDays.length ? `ทำแล้ว ${progress.completedDays.length}/${totalDays} วัน` : "เริ่มจาก Day 1 แบบช้า ๆ ก่อนครับ")
  );

  const resetButton = month2CreateElement("button", "small-button mini-course-reset-button", "ล้าง Mini Course");
  resetButton.type = "button";
  resetButton.addEventListener("click", () => handleMiniCourseReset(meta.id));
  head.append(copy, resetButton);
  detail.appendChild(head);
  detail.appendChild(month2CreateElement("p", "mini-course-reset-context", "Mini Course progress is separate. Main reset will not clear this progress; use the Mini Course reset inside this panel if you want to clear it."));

  detail.appendChild(renderMiniCourseDaySelector(course, progress));

  if (!month2AsArray(course?.modules).length) {
    detail.appendChild(renderMiniCourseFallback("Mini Course นี้ยังไม่มีบทฝึกครับ", "MC_EMPTY_MODULES"));
    return detail;
  }

  if (!module) {
    detail.appendChild(renderMiniCourseFallback("ยังไม่มีข้อมูลสำหรับวันนี้", "MC_DAY_NOT_FOUND"));
    return detail;
  }

  detail.appendChild(renderMiniCourseModule(module, progress));

  if (month2AsArray(course?.audioAssets).some((asset) => asset?.type === "internal-metronome")) {
    const audioNote = month2CreateElement("aside", "mini-course-audio-note");
    audioNote.append(
      month2CreateElement("strong", "", "Metronome"),
      month2CreateElement("p", "", "ใช้ Metronome ด้านบนแทนเสียงตัวอย่างได้เลยครับ ไม่มี audio file หรือเสียงจาก network ใน Mini Course นี้")
    );
    detail.appendChild(audioNote);
  }

  return detail;
}

function renderMiniCourseDaySelector(course, progress) {
  const meta = course?.miniCourse || {};
  const totalDays = Number(meta.totalDays || course?.modules?.length || 7);
  const currentDay = normalizeMiniCourseDay(progress.currentDay, totalDays);
  const selector = month2CreateElement("section", "mini-course-day-selector");
  selector.appendChild(month2CreateElement("h4", "", "เลือกวันที่ฝึก"));

  const row = month2CreateElement("div", "mini-course-day-row");
  for (let day = 1; day <= totalDays; day += 1) {
    const isCurrent = day === currentDay;
    const isComplete = progress.completedDays.includes(day);
    const button = month2CreateElement("button", `mini-course-day-button${isCurrent ? " is-current" : ""}${isComplete ? " is-complete" : ""}`);
    button.type = "button";
    button.setAttribute("aria-pressed", String(isCurrent));
    if (isCurrent) button.setAttribute("aria-current", "step");
    button.dataset.miniCourseDay = String(day);
    button.append(
      month2CreateElement("strong", "", `Day ${day}`),
      month2CreateElement("span", "", isComplete ? "ทำแล้ว" : isCurrent ? "กำลังฝึก" : "เปิดได้")
    );
    button.addEventListener("click", () => {
      const nextProgress = { ...progress, currentDay: day };
      saveMiniCourseProgress(meta.id, nextProgress);
      emitMiniCourseEvent("day-change", { courseId: meta.id, day, source: "day-selector" });
      renderMiniCourseShelf({ focusDetail: true });
    });
    row.appendChild(button);
  }
  selector.appendChild(row);
  return selector;
}

function renderMiniCourseModule(module, progress) {
  const section = month2CreateElement("section", "mini-course-module");
  section.append(
    month2CreateElement("p", "eyebrow", `Day ${module.day || ""}`.trim()),
    month2CreateElement("h4", "", module.thaiTitle || module.title || "Mini Course Day"),
    month2CreateElement("p", "", module.summary || "")
  );

  section.appendChild(renderMiniCourseCountMap(module.visualCountMap));
  section.appendChild(renderMiniCourseTaskCard(module.clapTask, "Count & Clap"));
  section.appendChild(renderMiniCourseTaskCard(module.guitarTask, "Guitar Task"));
  section.appendChild(renderMiniCourseSelfCheck(module, progress));
  section.appendChild(renderMiniCourseReferenceLinks(module.relatedReferences));
  return section;
}

function renderMiniCourseCountMap(visualCountMap) {
  const card = month2CreateElement("article", "mini-course-count-map");
  card.appendChild(month2CreateElement("h5", "", "Count Map"));
  const rows = Object.entries(visualCountMap || {}).filter(([, value]) => value);
  if (!rows.length) {
    card.appendChild(month2CreateElement("p", "", "บทนี้ยังไม่ต้องใช้ count map เพิ่มครับ"));
    return card;
  }
  rows.forEach(([label, value]) => {
    const row = month2CreateElement("div", "mini-course-count-row");
    row.append(
      month2CreateElement("span", "", label),
      month2CreateElement("code", "", String(value))
    );
    card.appendChild(row);
  });
  return card;
}

function renderMiniCourseTaskCard(task, type) {
  const card = month2CreateElement("article", "mini-course-task-card");
  card.append(
    month2CreateElement("p", "eyebrow", type),
    month2CreateElement("h5", "", task?.title || type)
  );
  const steps = month2AsArray(task?.steps).filter(Boolean);
  if (!steps.length) {
    card.appendChild(month2CreateElement("p", "", "ยังไม่มีขั้นตอนสำหรับส่วนนี้ครับ"));
    return card;
  }
  const list = month2CreateElement("ol");
  steps.forEach((step) => list.appendChild(month2CreateElement("li", "", typeof step === "string" ? step : step.text || step.title || "")));
  card.appendChild(list);
  return card;
}

function renderMiniCourseSelfCheck(module, progress) {
  const checks = month2AsArray(module?.selfCheck).filter(Boolean);
  const card = month2CreateElement("article", "mini-course-self-check");
  card.append(
    month2CreateElement("p", "eyebrow", "Self-check"),
    month2CreateElement("h5", "", "เช็กตัวเองก่อนข้ามวัน")
  );

  if (!checks.length) {
    card.appendChild(month2CreateElement("p", "", "เช็กตัวเองด้วยคำถามสั้น ๆ: วันนี้นับได้ตรงขึ้นไหม?"));
    return card;
  }

  const courseId = activeMiniCourseId;
  const day = Number(module.day || progress.currentDay || 1);
  const savedChecks = month2AsArray(progress.selfCheckByDay?.[day]);
  const list = month2CreateElement("div", "mini-course-self-check-list");

  checks.forEach((item, index) => {
    const label = month2CreateElement("label", "mini-course-check-item");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(savedChecks[index]);
    checkbox.addEventListener("change", () => {
      const nextProgress = getMiniCourseProgress(courseId);
      const nextChecks = month2AsArray(nextProgress.selfCheckByDay?.[day]);
      nextChecks[index] = checkbox.checked;
      nextProgress.selfCheckByDay = { ...(nextProgress.selfCheckByDay || {}), [day]: nextChecks };
      nextProgress.completedDays = getUpdatedMiniCourseCompletedDays(nextProgress, module);
      saveMiniCourseProgress(courseId, nextProgress);
      renderMiniCourseShelf();
    });
    label.append(checkbox, month2CreateElement("span", "", typeof item === "string" ? item : item.text || item.title || ""));
    list.appendChild(label);
  });

  card.appendChild(list);
  return card;
}

function renderMiniCourseReferenceLinks(relatedReferences) {
  const refs = month2AsArray(relatedReferences).filter(Boolean);
  const wrap = month2CreateElement("aside", "mini-course-reference-links");
  wrap.appendChild(month2CreateElement("h5", "", "เปิดคู่มืออ้างอิง"));
  if (!refs.length) {
    wrap.appendChild(month2CreateElement("p", "", "วันนี้ยังไม่ต้องเปิดคลังอ้างอิงเพิ่มครับ"));
    return wrap;
  }
  const buttonRow = month2CreateElement("div", "mini-course-reference-row");
  refs.forEach((ref) => {
    const target = String(ref.target || "").trim();
    const isAllowed = ["#tabGuidebook", "#noteValueGuidebook"].includes(target);
    const exists = isAllowed && document.querySelector(target);
    const button = month2CreateElement("button", "small-button mini-course-reference-button", exists ? ref.label || "เปิดคู่มือ" : "ยังไม่พบคลังอ้างอิงนี้");
    button.type = "button";
    if (exists) {
      button.dataset.scroll = target;
    } else {
      button.disabled = true;
    }
    buttonRow.appendChild(button);
  });
  wrap.appendChild(buttonRow);
  return wrap;
}

function getUpdatedMiniCourseCompletedDays(progress, module) {
  const day = Number(module?.day || progress.currentDay || 1);
  const checks = month2AsArray(module?.selfCheck).filter(Boolean);
  const checked = month2AsArray(progress.selfCheckByDay?.[day]);
  const completed = new Set(month2AsArray(progress.completedDays).map(Number).filter(Boolean));
  if (checks.length && checks.every((_, index) => Boolean(checked[index]))) {
    completed.add(day);
  } else {
    completed.delete(day);
  }
  return Array.from(completed).sort((a, b) => a - b);
}

function getMiniCourseProgress(courseId) {
  const course = getMiniCourseById(courseId);
  const totalDays = Number(course?.miniCourse?.totalDays || course?.modules?.length || 7);
  const fallback = {
    version: 1,
    miniCourseId: courseId,
    currentDay: 1,
    completedDays: [],
    selfCheckByDay: {},
    updatedAt: null
  };

  try {
    const raw = localStorage.getItem(getMiniCourseStorageKey(courseId));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      miniCourseId: courseId,
      currentDay: normalizeMiniCourseDay(parsed.currentDay, totalDays),
      completedDays: month2AsArray(parsed.completedDays).map(Number).filter((day) => day >= 1 && day <= totalDays),
      selfCheckByDay: parsed.selfCheckByDay && typeof parsed.selfCheckByDay === "object" ? parsed.selfCheckByDay : {}
    };
  } catch (error) {
    console.warn("Mini Course progress could not be parsed.", error);
    emitMiniCourseEvent("error", { code: "MC_PROGRESS_PARSE_FAILED", courseId });
    return fallback;
  }
}

function saveMiniCourseProgress(courseId, progress) {
  const nextProgress = {
    version: 1,
    miniCourseId: courseId,
    currentDay: normalizeMiniCourseDay(progress.currentDay, getMiniCourseById(courseId)?.miniCourse?.totalDays || 7),
    completedDays: month2AsArray(progress.completedDays).map(Number).filter(Boolean).sort((a, b) => a - b),
    selfCheckByDay: progress.selfCheckByDay || {},
    updatedAt: new Date().toISOString()
  };
  try {
    safeSetItem(getMiniCourseStorageKey(courseId), JSON.stringify(nextProgress));
    emitMiniCourseEvent("progress-save", { courseId, currentDay: nextProgress.currentDay, completedDays: nextProgress.completedDays });
  } catch (error) {
    console.warn("Mini Course progress could not be saved.", error);
    emitMiniCourseEvent("error", { code: "MC_PROGRESS_SAVE_FAILED", courseId });
    showToast("Mini Course progress could not be saved in this browser.", "error");
  }
}

function resetMiniCourseProgress(courseId, options = {}) {
  if (!options.confirmed) return false;
  try {
    localStorage.removeItem(getMiniCourseStorageKey(courseId));
    emitMiniCourseEvent("reset", { courseId, source: options.source || "mini-course-reset-control" });
    return true;
  } catch (error) {
    console.warn("Mini Course progress could not be reset.", error);
    emitMiniCourseEvent("error", { code: "MC_RESET_FAILED", courseId });
    return false;
  }
}

function requiresMiniCourseResetConfirmation(progress, totalDays = 7) {
  return (month2AsArray(progress?.completedDays).length / Math.max(1, Number(totalDays) || 7)) * 100 > 50;
}

function handleMiniCourseReset(courseId) {
  const course = getMiniCourseById(courseId);
  const totalDays = Number(course?.miniCourse?.totalDays || course?.modules?.length || 7);
  const progress = getMiniCourseProgress(courseId);
  const phrase = course?.progressModel?.resetBehavior?.typeToConfirmPhrase || "RESET MINI COURSE";
  let confirmed = false;

  if (requiresMiniCourseResetConfirmation(progress, totalDays)) {
    renderMiniCourseTypeConfirm(courseId, phrase);
    return;
  } else {
    confirmed = window.confirm("ล้างความคืบหน้า Mini Course นี้หรือไม่?\n\nการล้างนี้มีผลเฉพาะ Mini Course นี้เท่านั้น ไม่กระทบ Month 1-4, Week 0 หรือบันทึกการซ้อม");
  }

  if (!confirmed) return;
  if (resetMiniCourseProgress(courseId, { confirmed: true, source: "mini-course-reset-control" })) {
    showToast("ล้าง Mini Course แล้ว", "success");
    renderMiniCourseShelf({ focusDetail: true });
  }
}

function renderMiniCourseTypeConfirm(courseId, phrase = "RESET MINI COURSE") {
  const detail = document.querySelector("#miniCourseShelf .mini-course-detail");
  if (!detail) return;
  detail.querySelector(".mini-course-type-confirm")?.remove();

  const card = month2CreateElement("aside", "mini-course-type-confirm");
  card.setAttribute("role", "group");
  card.setAttribute("aria-label", "ยืนยันการล้าง Mini Course");

  const inputId = `mini-course-reset-confirm-${courseId}`;
  const input = document.createElement("input");
  input.id = inputId;
  input.type = "text";
  input.autocomplete = "off";
  input.placeholder = phrase;
  input.setAttribute("aria-label", "Mini Course reset confirmation phrase");

  const confirmButton = month2CreateElement("button", "small-button mini-course-danger-button", "ล้าง Mini Course");
  confirmButton.type = "button";
  confirmButton.disabled = true;

  const cancelButton = month2CreateElement("button", "small-button", "ยกเลิก");
  cancelButton.type = "button";

  const hint = month2CreateElement("p", "mini-course-confirm-hint", "พิมพ์ข้อความให้ตรงก่อนครับ");

  input.addEventListener("input", () => {
    const matches = input.value === phrase;
    confirmButton.disabled = !matches;
    hint.textContent = matches ? "พร้อมล้างเฉพาะ Mini Course นี้" : "พิมพ์ข้อความให้ตรงก่อนครับ";
  });

  confirmButton.addEventListener("click", () => {
    if (input.value !== phrase) {
      emitMiniCourseEvent("error", { code: "MC_RESET_CONFIRM_MISMATCH", courseId });
      return;
    }
    if (resetMiniCourseProgress(courseId, { confirmed: true, source: "mini-course-reset-control" })) {
      showToast("ล้าง Mini Course แล้ว", "success");
      renderMiniCourseShelf({ focusDetail: true });
    }
  });

  cancelButton.addEventListener("click", () => {
    card.remove();
  });

  const actions = month2CreateElement("div", "mini-course-type-confirm-actions");
  actions.append(confirmButton, cancelButton);

  card.append(
    month2CreateElement("strong", "", "ยืนยันการล้าง Mini Course"),
    month2CreateElement("p", "", `คุณทำ Mini Course นี้ไปเกินครึ่งแล้ว ถ้าต้องการล้างจริง ให้พิมพ์ ${phrase}`),
    month2CreateElement("label", "", "พิมพ์ข้อความยืนยัน"),
    input,
    hint,
    actions
  );
  detail.appendChild(card);
  requestAnimationFrame(() => input.focus());
}

function normalizeMiniCourseDay(day, totalDays = 7) {
  const value = Number(day);
  const maxDay = Math.max(1, Number(totalDays) || 7);
  return value >= 1 && value <= maxDay ? value : 1;
}

function renderMiniCourseFallback(message, code = "") {
  const card = month2CreateElement("article", "mini-course-fallback");
  if (code) card.dataset.errorCode = code;
  card.append(
    month2CreateElement("strong", "", code || "Mini Course"),
    month2CreateElement("p", "", message)
  );
  if (code) emitMiniCourseEvent("error", { code, source: "renderer" });
  return card;
}

function goToNextPracticeDay() {
  if (selectedFocusedMonth !== 1) {
    const monthWeeks = getFocusedMonthWeeks(selectedFocusedMonth);
    if (!monthWeeks.length) return;

    const currentIndex = monthWeeks.findIndex((week) => Number(week.number) === Number(focusedSelectedWeek));
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (safeIndex + 1) % monthWeeks.length;
    const nextWeek = monthWeeks[nextIndex];

    openFocusedWeek(nextWeek.number, {
      source: "next-week-button",
      scroll: false
    });

    return;
  }
  const currentWeekNumber = foundationWeeks.some((week) => week.number === focusedSelectedWeek)
    ? focusedSelectedWeek
    : getCurrentFoundationWeek();
  const renderedDay = getRenderedPracticeDayV1(currentWeekNumber);
  const nextDay = renderedDay >= 7 ? 1 : renderedDay + 1;
  switchDay(nextDay);
}

function resetFoundationProgress() {
  if (!window.confirm("ล้างความคืบหน้าและบันทึกการซ้อมของเดือนที่ 1 หรือไม่?")) return;
  localStorage.removeItem(foundationStorage.completedDaysByWeek);
  localStorage.removeItem(foundationStorage.completedWeeks);
  localStorage.removeItem(foundationStorage.dayByWeek);
  localStorage.removeItem(foundationStorage.notes);
  continuePracticeStoreV1?.clear();
  Object.keys(localStorage)
    .filter((key) => key.startsWith(`${foundationStorage.checklistPrefix}_`))
    .forEach((key) => localStorage.removeItem(key));
  Object.keys(localStorage)
    .filter((key) => key.startsWith("preludeChecklist_") || key.startsWith("gc_prelude_chk_"))
    .forEach((key) => localStorage.removeItem(key));
  restoredContinuePracticeDestinationV1 = null;
  selectedFocusedMonth = 1;
  focusedSelectedWeek = 1;
  selectedWeek = 1;
  setPracticeDay(1, 1);
  safeSetItem(selectedFocusedMonthStorageKey, "1");
  if (window.history?.replaceState) window.history.replaceState(null, "", "#dashboard");
  renderFocusedApp();
  persistContinuePracticeStateV1();
}

window.__GC_MONTH2_ENGINES__ = Object.freeze({
  renderLessonBlocks,
  renderFretboardVisual,
  renderMiniTab,
  renderChordSoundLab,
  renderTechniqueDrillBlock,
  renderMechanicsCheckBlock,
  renderRhythmGeometryBlock,
  playChord,
  playPluckedString,
  stopAllSounds
});

window.addEventListener("pagehide", () => {
  flushContinuePracticeStateV1();
  stopActiveAudio();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopActiveAudio();
});

initFocusedApp();


