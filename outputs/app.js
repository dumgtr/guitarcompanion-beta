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
    "title": "Rhythm à¹à¸¥à¸° Groove",
    "subtitle": "Syncopation, Funk Groove, Accent, Dynamics",
    "goal": "à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸à¸²à¸£à¸•à¸µà¸„à¸­à¸£à¹Œà¸”à¸ˆà¸²à¸à¸à¸²à¸£à¸ˆà¸³à¹à¸žà¸•à¹€à¸—à¸´à¸£à¹Œà¸™ à¹€à¸›à¹‡à¸™à¸à¸²à¸£à¸„à¸§à¸šà¸„à¸¸à¸¡ time feel à¹à¸¥à¸°à¸žà¸¥à¸±à¸‡à¸‚à¸­à¸‡à¹€à¸žà¸¥à¸‡",
    "concepts": [
      "à¸™à¸±à¸š 16th note à¹€à¸›à¹‡à¸™ 1-e-&-a à¹à¸¥à¹‰à¸§à¸§à¸²à¸‡à¸„à¸­à¸£à¹Œà¸”à¸šà¸™à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¹„à¸¡à¹ˆà¸•à¸£à¸‡ beat à¹€à¸žà¸·à¹ˆà¸­à¸ªà¸£à¹‰à¸²à¸‡ Syncopation",
      "à¹à¸¢à¸à¸¡à¸·à¸­à¸‚à¸§à¸²à¹€à¸›à¹‡à¸™ Down/Up motion à¸—à¸µà¹ˆà¹„à¸«à¸¥à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡ à¹à¸¡à¹‰à¸šà¸²à¸‡à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸ˆà¸°à¹„à¸¡à¹ˆà¹‚à¸”à¸™à¸ªà¸²à¸¢",
      "à¹ƒà¸Šà¹‰ Accent à¹€à¸›à¹‡à¸™à¸•à¸±à¸§à¹€à¸¥à¹ˆà¸²à¹‚à¸„à¸£à¸‡à¹€à¸žà¸¥à¸‡ à¹€à¸Šà¹ˆà¸™ à¹€à¸™à¹‰à¸™ beat 2 à¹à¸¥à¸° 4 à¹ƒà¸«à¹‰à¹€à¸‚à¹‰à¸²à¸à¸±à¸š snare"
    ],
    "drills": [
      "à¹€à¸¥à¹ˆà¸™ Pattern 4 à¹à¸šà¸š: Straight 8, Syncopated Pop, Funk 16, Palm Muted Rock à¸—à¸µà¹ˆ 70, 90, 110 BPM",
      "à¸‹à¹‰à¸­à¸¡ Ghost Strum 2 à¸™à¸²à¸—à¸µà¸•à¹ˆà¸­ Pattern à¹‚à¸”à¸¢à¹ƒà¸«à¹‰à¸¡à¸·à¸­à¸‚à¸§à¸²à¹„à¸¡à¹ˆà¸«à¸¢à¸¸à¸”à¹à¸¡à¹‰à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡",
      "à¹€à¸›à¸´à¸” Backing Track à¹à¸¥à¹‰à¸§à¹€à¸¥à¹ˆà¸™à¹€à¸šà¸²à¸¥à¸‡à¹ƒà¸™ Verse à¸«à¸™à¸±à¸à¸‚à¸¶à¹‰à¸™à¹ƒà¸™ Chorus à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¹€à¸£à¹ˆà¸‡ tempo"
    ],
    "checkpoint": [
      "à¹€à¸¥à¹ˆà¸™à¸•à¹ˆà¸­à¸à¸±à¸š metronome 3 à¸™à¸²à¸—à¸µà¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸«à¸¥à¸¸à¸” pulse",
      "à¸­à¸˜à¸´à¸šà¸²à¸¢à¹„à¸”à¹‰à¸§à¹ˆà¸²à¸ˆà¸±à¸‡à¸«à¸§à¸°à¹„à¸«à¸™à¹€à¸›à¹‡à¸™ accent à¹à¸¥à¸°à¸ˆà¸±à¸‡à¸«à¸§à¸°à¹„à¸«à¸™à¹€à¸›à¹‡à¸™ ghost",
      "à¸­à¸±à¸”à¹€à¸ªà¸µà¸¢à¸‡à¸•à¸±à¸§à¹€à¸­à¸‡à¹à¸¥à¹‰à¸§à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¸„à¸­à¸£à¹Œà¸”à¹„à¸¡à¹ˆà¸Šà¸™à¸à¸±à¸š snare à¸«à¸£à¸·à¸­ vocal"
    ]
  }
];
let futureDataPromise;

let weeks = [
  {
    "number": 1,
    "month": 1,
    "title": "Pulse à¹à¸¥à¸° 16th Grid",
    "module": "Rhythm à¹à¸¥à¸° Groove",
    "goal": "à¸•à¸±à¹‰à¸‡ time feel à¹ƒà¸«à¹‰à¸¡à¸±à¹ˆà¸™à¸à¹ˆà¸­à¸™à¹€à¸žà¸´à¹ˆà¸¡à¸„à¸§à¸²à¸¡à¸‹à¸±à¸šà¸‹à¹‰à¸­à¸™",
    "practice": [
      "à¸™à¸±à¸š 1-e-&-a à¸žà¸£à¹‰à¸­à¸¡à¸•à¸šà¹€à¸—à¹‰à¸²",
      "à¹€à¸¥à¹ˆà¸™ Straight 8 à¸—à¸µà¹ˆ 70-90 BPM",
      "à¸­à¸±à¸”à¹€à¸ªà¸µà¸¢à¸‡ 2 à¸™à¸²à¸—à¸µà¹à¸¥à¹‰à¸§à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¸¡à¸µà¹€à¸£à¹ˆà¸‡à¸«à¸£à¸·à¸­à¸«à¸™à¹ˆà¸§à¸‡"
    ],
    "checks": [
      "à¸¡à¸·à¸­à¸‚à¸§à¸²à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡",
      "à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸„à¸­à¸£à¹Œà¸”à¹‚à¸”à¸¢ beat à¹„à¸¡à¹ˆà¸ªà¸°à¸”à¸¸à¸”",
      "à¹€à¸¥à¹ˆà¸™à¸à¸±à¸š metronome 3 à¸™à¸²à¸—à¸µ"
    ]
  },
  {
    "number": 2,
    "month": 1,
    "title": "Syncopation & Funk 16",
    "module": "Rhythm à¹à¸¥à¸° Groove",
    "goal": "à¸§à¸²à¸‡à¸„à¸­à¸£à¹Œà¸”à¸šà¸™ off-beat à¹à¸¥à¸° ghost strum à¹ƒà¸«à¹‰ groove à¸Ÿà¸±à¸‡à¸¡à¸µà¸Šà¸µà¸§à¸´à¸•",
    "practice": [
      "à¸à¸¶à¸ pattern Funk 16 à¸Šà¹‰à¸² à¹†",
      "à¹€à¸™à¹‰à¸™ accent à¸šà¸™ 2 à¹à¸¥à¸° 4",
      "à¹€à¸¥à¹ˆà¸™à¸à¸±à¸š backing track à¸—à¸µà¹ˆà¸¡à¸µ drum loop"
    ],
    "checks": [
      "à¹„à¸¡à¹ˆà¸«à¸¥à¸‡à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡ e à¹à¸¥à¸° a",
      "ghost note à¹€à¸šà¸²à¸à¸§à¹ˆà¸² accent à¸Šà¸±à¸”",
      "à¹€à¸¥à¹ˆà¸™ 4 à¸£à¸­à¸šà¸•à¸´à¸”à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸«à¸¥à¸¸à¸”"
    ]
  },
  {
    "number": 3,
    "month": 1,
    "title": "Palm Muting & Dynamics",
    "module": "Rhythm à¹à¸¥à¸° Groove",
    "goal": "à¸„à¸¸à¸¡à¸„à¸§à¸²à¸¡à¸¢à¸²à¸§à¹€à¸ªà¸µà¸¢à¸‡à¹à¸¥à¸°à¸žà¸¥à¸±à¸‡à¸‚à¸­à¸‡à¸—à¹ˆà¸­à¸™à¹€à¸žà¸¥à¸‡",
    "practice": [
      "à¸à¸¶à¸ mute à¹ƒà¸à¸¥à¹‰ bridge",
      "à¹€à¸¥à¹ˆà¸™à¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§ 4 à¸£à¸°à¸”à¸±à¸šà¸„à¸§à¸²à¸¡à¸”à¸±à¸‡",
      "à¸ªà¸¥à¸±à¸š verse à¹€à¸šà¸² chorus à¸«à¸™à¸±à¸"
    ],
    "checks": [
      "à¹€à¸ªà¸µà¸¢à¸‡ mute à¹„à¸¡à¹ˆà¸—à¸¶à¸šà¹€à¸à¸´à¸™à¹„à¸›",
      "dynamic à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¹à¸•à¹ˆ tempo à¸„à¸‡à¸—à¸µà¹ˆ",
      "à¹ƒà¸Šà¹‰ accent à¸™à¸³à¹€à¸žà¸¥à¸‡à¹„à¸”à¹‰"
    ]
  },
  {
    "number": 4,
    "month": 1,
    "title": "Groove Patterns 4 à¹à¸šà¸š",
    "module": "Rhythm à¹à¸¥à¸° Groove",
    "goal": "à¸£à¸§à¸¡ pattern à¹€à¸‚à¹‰à¸²à¸à¸±à¸š metronome à¹à¸¥à¸° backing track",
    "practice": [
      "à¹€à¸¥à¹ˆà¸™ Straight, Syncopated, Funk, Palm Mute",
      "à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™ BPM 75/90/105",
      "à¸šà¸±à¸™à¸—à¸¶à¸à¸§à¸´à¸”à¸µà¹‚à¸­à¸¡à¸·à¸­à¸‚à¸§à¸²"
    ],
    "checks": [
      "pattern à¹„à¸¡à¹ˆà¸›à¸°à¸›à¸™à¸à¸±à¸™",
      "à¸£à¸¹à¹‰à¸§à¹ˆà¸²à¸•à¹‰à¸­à¸‡à¸¥à¸”à¹‚à¸™à¹‰à¸•à¸•à¸£à¸‡à¹„à¸«à¸™",
      "à¸žà¸£à¹‰à¸­à¸¡à¹€à¸¥à¹ˆà¸™à¸à¸±à¸š track à¹€à¸•à¹‡à¸¡"
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
  7: "viiÂ°",
};

const setlistItems = [
  "à¹€à¸‚à¸µà¸¢à¸™ Nashville chart à¸„à¸£à¸š 3 à¹€à¸žà¸¥à¸‡",
  "à¸‹à¹‰à¸­à¸¡à¸à¸±à¸š metronome à¸«à¸£à¸·à¸­ drum track à¸—à¸¸à¸à¹€à¸žà¸¥à¸‡",
  "à¸à¸³à¸«à¸™à¸” clean/crunch/lead tone à¸•à¹ˆà¸­à¸—à¹ˆà¸­à¸™",
  "à¸­à¸±à¸”à¹€à¸ªà¸µà¸¢à¸‡ rehearsal à¸­à¸¢à¹ˆà¸²à¸‡à¸™à¹‰à¸­à¸¢ 2 à¸£à¸­à¸š",
  "à¹€à¸¥à¹ˆà¸™ setlist à¹€à¸•à¹‡à¸¡à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸«à¸¢à¸¸à¸”à¸à¸¥à¸²à¸‡à¹€à¸žà¸¥à¸‡",
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
const fretboardStudioPreviewMode = parseFretboardStudioPreviewMode();
let courseData = null;
let activeMiniCourseId = "";

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
    console.warn(`Shard failed: ${url}`, e);
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
      return courseData;
    }
  })();
  return futureDataPromise;
}


async function ensureFutureCourseData(month) {
  const selectedMonth = Number(month);
  if (!selectedMonth || selectedMonth < 2 || weeks.some((item) => item.month === selectedMonth)) return;
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
    return;
  }
  localStorage.setItem(key, value);
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
    fretboardStudioPreviewMode: isFretboardStudioPreviewActive(),
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

function parseMiniCoursePreviewMode() {
  const params = new URLSearchParams(window.location.search);
  const directValue = String(params.get("miniCoursePreview") || "").trim().toLowerCase();
  const previewValue = String(params.get("devPreview") || params.get("preview") || "").trim().toLowerCase();
  return ["1", "true", "yes", "mini", "minicourse", "mini-course", "rhythm-notation-starter"].includes(directValue) ||
    ["minicourse", "mini-course", "mini", "rhythm-notation-starter"].includes(previewValue);
}

function parseFretboardStudioPreviewMode() {
  const params = new URLSearchParams(window.location.search);
  const value = String(params.get("fretboardStudioPreview") || "").trim().toLowerCase();
  return ["1", "true", "yes"].includes(value);
}

function getDevPreviewMode() {
  return devPreviewMode;
}

function isDevPreviewActive() {
  return Boolean(getDevPreviewMode());
}

function isMiniCoursePreviewActive() {
  if (FEATURE_MINI_COURSE_SHELF || Boolean(miniCoursePreviewMode)) return true;
  const loaded = month2AsArray(courseData?.miniCourses || miniCourses);
  return loaded.some((c) => c?.miniCourse?.visibility === "public");
}

function isFretboardStudioPreviewActive() {
  return Boolean(fretboardStudioPreviewMode);
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
  if (!isDevPreviewActive()) return loadedMonths.filter((month) => month <= 6);

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
      switcherLabel: "à¹€à¸”à¸·à¸­à¸™ 1: Rhythm",
      brandSub: "à¸žà¸·à¹‰à¸™à¸à¸²à¸™ Rhythm 4 à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œ"
    },
    2: {
      shortLabel: "Fretboard",
      moduleLabel: "Fretboard Foundation",
      switcherLabel: "à¹€à¸”à¸·à¸­à¸™ 2: Fretboard",
      brandSub: "à¸žà¸·à¹‰à¸™à¸à¸²à¸™ Fretboard 4 à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œ"
    },
    3: {
      shortLabel: "Chord Tone",
      moduleLabel: "Chord Tone & Arpeggio Foundation",
      switcherLabel: "à¹€à¸”à¸·à¸­à¸™ 3: Chord Tone",
      brandSub: "à¸žà¸·à¹‰à¸™à¸à¸²à¸™ Chord Tone 4 à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œ"
    },
    4: {
      shortLabel: "Scale Atlas",
      moduleLabel: "Scale Atlas Foundation",
      switcherLabel: "à¹€à¸”à¸·à¸­à¸™ 4: Scale Atlas",
      brandSub: "à¸žà¸·à¹‰à¸™à¸à¸²à¸™ Scale Atlas 4 à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œ"
    },
    5: {
      shortLabel: "Diatonic",
      moduleLabel: "Diatonic Bridge & Melodic Freedom",
      switcherLabel: "à¹€à¸”à¸·à¸­à¸™ 5: Diatonic Bridge",
      brandSub: "Diatonic Bridge & Melodic Freedom"
    },
    6: {
      shortLabel: "Modes",
      moduleLabel: "Modes as Chord Colors",
      switcherLabel: "à¹€à¸”à¸·à¸­à¸™ 6: Modes",
      brandSub: "Modes as Chord Colors"
    }
  };
  return metadata[month] || {
    shortLabel: `Month ${month}`,
    moduleLabel: getModuleDisplayName(weeks.find((item) => item.month === month)?.module) || "Hidden Preview",
    switcherLabel: `à¹€à¸”à¸·à¸­à¸™ ${month}: Preview`,
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
  banner.textContent = "DEV PREVIEW MODE â€” Hidden months are visible for QA only. Progress state is not changed.";
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
  button.setAttribute("aria-label", isDark ? "à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¹€à¸›à¹‡à¸™à¹‚à¸«à¸¡à¸”à¸ªà¸§à¹ˆà¸²à¸‡" : "à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¹€à¸›à¹‡à¸™à¹‚à¸«à¸¡à¸”à¸¡à¸·à¸”");
  button.setAttribute("title", isDark ? "à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¹€à¸›à¹‡à¸™à¹‚à¸«à¸¡à¸”à¸ªà¸§à¹ˆà¸²à¸‡" : "à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¹€à¸›à¹‡à¸™à¹‚à¸«à¸¡à¸”à¸¡à¸·à¸”");
  button.textContent = isDark ? "â˜€ï¸" : "ðŸŒ™";
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
  const options = ["à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”", ...Array.from({ length: 8 }, (_, index) => `à¹€à¸”à¸·à¸­à¸™ ${index + 1}`)];
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
  document.getElementById("progressBar").style.width = `${percent}%`;
  document.getElementById("progressText").textContent = `${done}/${total} à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œ`;
  const activeNumber = Math.min(done + 1, total);
  const activeWeek = weeks.find((item) => item.number === activeNumber) || weeks[weeks.length - 1];
  document.getElementById("monthText").textContent = `Month ${activeWeek.month}`;
  document.getElementById("currentWeekCard").innerHTML = `
    <span>Week ${activeWeek.number} / Month ${activeWeek.month}</span>
    <strong>${activeWeek.title}</strong>
    <p>${activeWeek.goal}</p>
  `;
}

function getModuleDisplayName(moduleIdOrTitle) {
  const found = modules.find((item) => item.id === moduleIdOrTitle);
  return found?.title || moduleIdOrTitle || "";
}

async function renderWeeks() {
  const selectedMonth = Number(document.getElementById("monthFilter").value || 0);
  await ensureFutureCourseData(selectedMonth);
  const list = selectedMonth ? weeks.filter((item) => item.month === selectedMonth) : weeks;
  const grid = document.getElementById("weekGrid");
  grid.innerHTML = list.map((item) => `
    <button class="week-card ${item.number === selectedWeek ? "active" : ""} ${completedWeeks.includes(item.number) ? "done" : ""}"
      type="button" data-week="${item.number}">
      <small>Week ${item.number} Â· Month ${item.month}</small>
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
      à¸—à¸³à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸™à¸µà¹‰à¸„à¸£à¸šà¹à¸¥à¹‰à¸§
    </label>
    <div class="detail-grid">
      <div class="detail-block">
        <h4>Practice Plan ${practiceTime} à¸™à¸²à¸—à¸µ</h4>
        <ul>
          <li>Warm-up à¹à¸¥à¸°à¸—à¸šà¸—à¸§à¸™: ${warmup} à¸™à¸²à¸—à¸µ</li>
          <li>Core drill à¸‚à¸­à¸‡à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œ: ${core} à¸™à¸²à¸—à¸µ</li>
          <li>Apply à¸à¸±à¸šà¹€à¸žà¸¥à¸‡à¸«à¸£à¸·à¸­ backing track: ${apply} à¸™à¸²à¸—à¸µ</li>
        </ul>
      </div>
      <div class="detail-block">
        <h4>à¹à¸šà¸šà¸à¸¶à¸à¸«à¸±à¸”</h4>
        <ul>${item.practice.map((line) => `<li>${line}</li>`).join("")}</ul>
      </div>
      <div class="detail-block">
        <h4>à¹€à¸à¸“à¸‘à¹Œà¸œà¹ˆà¸²à¸™</h4>
        <ul>${item.checks.map((line) => `<li>${line}</li>`).join("")}</ul>
      </div>
      <div class="detail-block">
        <h4>à¸šà¸±à¸™à¸—à¸¶à¸à¸‹à¹‰à¸­à¸¡</h4>
        <ul>
          <li>à¸­à¸±à¸”à¹€à¸ªà¸µà¸¢à¸‡à¸«à¸£à¸·à¸­à¸§à¸´à¸”à¸µà¹‚à¸­à¸­à¸¢à¹ˆà¸²à¸‡à¸™à¹‰à¸­à¸¢ 1 take</li>
          <li>à¸ˆà¸” BPM à¸ªà¸¹à¸‡à¸ªà¸¸à¸”à¸—à¸µà¹ˆà¸¢à¸±à¸‡à¸™à¸´à¹ˆà¸‡</li>
          <li>à¹€à¸‚à¸µà¸¢à¸™ 1 à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¹à¸à¹‰à¹ƒà¸™à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸–à¸±à¸”à¹„à¸›</li>
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
        <h4>à¹à¸™à¸§à¸„à¸´à¸”à¸«à¸¥à¸±à¸</h4>
        <ul>${item.concepts.map((line) => `<li>${line}</li>`).join("")}</ul>
      </article>
      <article>
        <h4>à¹à¸šà¸šà¸à¸¶à¸à¸«à¸±à¸”</h4>
        <ul>${item.drills.map((line) => `<li>${line}</li>`).join("")}</ul>
      </article>
      <article>
        <h4>à¹€à¸Šà¹‡à¸à¸„à¸§à¸²à¸¡à¸žà¸£à¹‰à¸­à¸¡</h4>
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
  document.getElementById("scaleHint").textContent = `${key} Major: à¹€à¸¥à¹ˆà¸™à¸ˆà¸²à¸ root à¸ªà¸µà¹à¸”à¸‡ à¹à¸¥à¹‰à¸§à¸ˆà¸š phrase à¸šà¸™ degree 1, 3 à¸«à¸£à¸·à¸­ 5 à¹€à¸žà¸·à¹ˆà¸­à¹ƒà¸«à¹‰à¸Ÿà¸±à¸‡à¹€à¸‚à¹‰à¸²à¸„à¸­à¸£à¹Œà¸”`;
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
    <p><strong>à¹ƒà¸Šà¹‰à¹€à¸¡à¸·à¹ˆà¸­:</strong> ${tone.use}</p>
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

function setBpm(value) {
  const nextBpm = Number(value);
  if (!Number.isFinite(nextBpm)) {
    document.getElementById("bpmValue").value = bpm;
    document.getElementById("bpmSlider").value = bpm;
    updateQuickTempoActive(bpm);
    return;
  }

  bpm = Math.min(180, Math.max(50, Math.round(nextBpm)));
  document.getElementById("bpmValue").value = bpm;
  document.getElementById("bpmSlider").value = bpm;
  updateQuickTempoActive(bpm);
}

function setQuickTempo(value) {
  setBpm(value);
  closeQuickTempoDrawer();
  showToast(`à¸•à¸±à¹‰à¸‡ Metronome à¹€à¸›à¹‡à¸™ ${bpm} BPM à¹à¸¥à¹‰à¸§`, "success", 1800);
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
    straight: "Straight 8: à¸™à¸±à¸š 1-&-2-&-3-&-4-& à¹ƒà¸«à¹‰ downstroke à¸­à¸¢à¸¹à¹ˆà¸šà¸™ beat à¸«à¸¥à¸±à¸à¹à¸¥à¸° upstroke à¸­à¸¢à¸¹à¹ˆà¸šà¸™ &",
    syncopation: "Syncopation: à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¸šà¸™ beat à¸šà¸²à¸‡à¸ˆà¸¸à¸” à¹à¸¥à¹‰à¸§à¹ƒà¸«à¹‰à¸„à¸­à¸£à¹Œà¸”à¸”à¸±à¸‡à¸šà¸™ & à¸«à¸£à¸·à¸­ a à¹€à¸žà¸·à¹ˆà¸­à¸ªà¸£à¹‰à¸²à¸‡à¹à¸£à¸‡à¸œà¸¥à¸±à¸",
    funk: "Funk 16: à¸¡à¸·à¸­à¸‚à¸§à¸²à¹à¸à¸§à¹ˆà¸‡ 16th à¸•à¸¥à¸­à¸” à¹ƒà¸Šà¹‰ ghost strum à¹à¸¥à¸° accent à¸ªà¸±à¹‰à¸™ à¹† à¹ƒà¸«à¹‰ groove à¸à¸£à¸°à¸Šà¸±à¸š",
    mute: "Palm Mute: à¸§à¸²à¸‡à¸ªà¸±à¸™à¸¡à¸·à¸­à¹ƒà¸à¸¥à¹‰ bridge à¹ƒà¸«à¹‰à¹€à¸ªà¸µà¸¢à¸‡à¸ªà¸±à¹‰à¸™à¹à¸•à¹ˆ pitch à¸¢à¸±à¸‡à¸Šà¸±à¸” à¹€à¸«à¸¡à¸²à¸°à¸à¸±à¸š verse à¸«à¸£à¸·à¸­ rock groove",
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
  document.getElementById("metronomeToggle").textContent = "à¸«à¸¢à¸¸à¸”";
  const announcer = document.getElementById("metronomeAnnouncer");
  if (announcer) announcer.textContent = `à¹€à¸£à¸´à¹ˆà¸¡ Metronome à¸—à¸µà¹ˆ ${bpm} BPM`;
  scheduleMetronome();
}

function stopMetronome() {
  clearTimeout(metronomeTimer);
  isMetronomeRunning = false;
  document.getElementById("metronomeToggle").textContent = "à¹€à¸£à¸´à¹ˆà¸¡";
  document.getElementById("beatLight").classList.remove("active", "accent");
  renderBeatCounter(0);
  const announcer = document.getElementById("metronomeAnnouncer");
  if (announcer) announcer.textContent = "à¸«à¸¢à¸¸à¸” Metronome";
}

function scheduleMetronome() {
  if (!isMetronomeRunning) return;
  while (nextBeatTime < audioContext.currentTime + 0.12) {
    const visualBeat = (beatCount % 4) + 1;
    playClick(nextBeatTime, visualBeat === 1);
    const beatDelay = Math.max(0, (nextBeatTime - audioContext.currentTime) * 1000);
    window.setTimeout(() => flashBeat(visualBeat), beatDelay);
    nextBeatTime += 60 / bpm;
    beatCount += 1;
  }
  metronomeTimer = window.setTimeout(scheduleMetronome, 25);
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
  const confirmed = window.confirm("à¸¥à¹‰à¸²à¸‡à¸„à¸§à¸²à¸¡à¸„à¸·à¸šà¸«à¸™à¹‰à¸²à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”à¹ƒà¸™à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸™à¸µà¹‰?");
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
    summary: "à¸à¸¶à¸à¹ƒà¸«à¹‰à¸«à¸¹ à¸¡à¸·à¸­ à¹à¸¥à¸°à¹€à¸—à¹‰à¸²à¸­à¸¢à¸¹à¹ˆà¸à¸±à¸šà¸ˆà¸±à¸‡à¸«à¸§à¸°à¸«à¸¥à¸±à¸à¹€à¸”à¸µà¸¢à¸§à¸à¸±à¸™à¸à¹ˆà¸­à¸™à¹€à¸£à¸´à¹ˆà¸¡à¹€à¸¥à¹ˆà¸™ Pattern à¸—à¸µà¹ˆà¸‹à¸±à¸šà¸‹à¹‰à¸­à¸™à¸‚à¸¶à¹‰à¸™",
    youtube: {
      title: "à¸Ÿà¸±à¸‡à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡ Pulse à¹à¸¥à¸° 16th Grid à¸à¹ˆà¸­à¸™à¹€à¸£à¸´à¹ˆà¸¡à¸­à¹ˆà¸²à¸™",
      embedUrl: "https://www.youtube.com/embed?listType=search&list=guitar%20rhythm%2016th%20note%20pulse"
    },
    learn: {
      targetBpm: "60 BPM",
      diagram: {
        title: "16th Grid: à¹€à¸«à¹‡à¸™à¸Šà¹ˆà¸­à¸‡à¸¢à¹ˆà¸­à¸¢à¸à¹ˆà¸­à¸™à¸„à¹ˆà¸­à¸¢à¹€à¸¥à¹ˆà¸™",
        caption: "à¸Šà¹ˆà¸­à¸‡à¸ªà¸µà¹€à¸‚à¸µà¸¢à¸§à¸„à¸·à¸­ Pulse à¸—à¸µà¹ˆà¸•à¸µà¸ˆà¸£à¸´à¸‡ à¸ªà¹ˆà¸§à¸™à¸Šà¹ˆà¸­à¸‡à¸­à¸·à¹ˆà¸™à¹ƒà¸«à¹‰à¸›à¸²à¸à¸™à¸±à¸šà¸œà¹ˆà¸²à¸™à¹„à¸›à¸à¹ˆà¸­à¸™ à¸­à¸¢à¹ˆà¸²à¹€à¸žà¸´à¹ˆà¸‡à¹€à¸•à¸´à¸¡à¸¡à¸·à¸­",
        cells: [
          { label: "1", note: "à¸•à¸µ", kind: "hit" },
          { label: "e", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "&", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "a", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "2", note: "à¸•à¸µ", kind: "hit" },
          { label: "e", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "&", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "a", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "3", note: "à¸•à¸µ", kind: "hit" },
          { label: "e", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "&", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "a", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "4", note: "à¸•à¸µ", kind: "hit" },
          { label: "e", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "&", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "a", note: "à¸™à¸±à¸š", kind: "rest" }
        ]
      },
      paragraphs: [
        "à¸«à¸¥à¸±à¸‡à¸”à¸¹à¸§à¸´à¸”à¸µà¹‚à¸­ à¹ƒà¸«à¹‰à¹€à¸£à¸´à¹ˆà¸¡à¸ˆà¸²à¸à¸à¸²à¸£à¸ˆà¸±à¸šà¹€à¸ªà¸µà¸¢à¸‡à¸—à¸µà¹ˆà¹€à¸”à¸´à¸™à¸­à¸¢à¸¹à¹ˆà¸•à¸¥à¸­à¸”à¸à¹ˆà¸­à¸™ à¸­à¸¢à¹ˆà¸²à¹€à¸žà¸´à¹ˆà¸‡à¸ªà¸™à¹ƒà¸ˆà¸§à¹ˆà¸²à¸¡à¸·à¸­à¸‚à¸§à¸²à¸•à¹‰à¸­à¸‡à¸•à¸µà¸¥à¸²à¸¢à¸ªà¸§à¸¢à¹à¸„à¹ˆà¹„à¸«à¸™ à¹ƒà¸«à¹‰à¸–à¸²à¸¡à¸•à¸±à¸§à¹€à¸­à¸‡à¸à¹ˆà¸­à¸™à¸§à¹ˆà¸²à¹€à¸£à¸²à¹„à¸”à¹‰à¸¢à¸´à¸™ Pulse à¸‚à¸­à¸‡à¹€à¸žà¸¥à¸‡à¸«à¸£à¸·à¸­à¸¢à¸±à¸‡",
        "Pulse à¸„à¸·à¸­à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸«à¸¥à¸±à¸à¸—à¸µà¹ˆà¹€à¸«à¸¡à¸·à¸­à¸™à¸Šà¸µà¸žà¸ˆà¸£à¸‚à¸­à¸‡à¹€à¸žà¸¥à¸‡ à¸¡à¸±à¸™à¸„à¸·à¸­à¸„à¸§à¸²à¸¡à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸§à¹ˆà¸²à¹€à¸žà¸¥à¸‡à¸à¸³à¸¥à¸±à¸‡à¹€à¸”à¸´à¸™à¹„à¸›à¸‚à¹‰à¸²à¸‡à¸«à¸™à¹‰à¸²à¹à¸šà¸š 1 2 3 4 à¸–à¸¶à¸‡à¹à¸¡à¹‰à¸à¸µà¸•à¸²à¸£à¹Œà¸ˆà¸°à¹„à¸¡à¹ˆà¹„à¸”à¹‰à¸•à¸µà¸—à¸¸à¸à¸ˆà¸±à¸‡à¸«à¸§à¸° Pulse à¸à¹‡à¸¢à¸±à¸‡à¸­à¸¢à¸¹à¹ˆà¸•à¸£à¸‡à¸™à¸±à¹‰à¸™à¸•à¸¥à¸­à¸”",
        "Rhythm à¸„à¸·à¸­à¸ªà¸´à¹ˆà¸‡à¸—à¸µà¹ˆà¹€à¸£à¸²à¹€à¸¥à¹ˆà¸™à¸„à¸£à¹ˆà¸­à¸¡à¸­à¸¢à¸¹à¹ˆà¸šà¸™ Pulse à¸­à¸µà¸à¸—à¸µà¸«à¸™à¸¶à¹ˆà¸‡ à¹€à¸Šà¹ˆà¸™ à¹€à¸£à¸²à¸­à¸²à¸ˆà¸•à¸µà¹€à¸‰à¸žà¸²à¸° 1 à¸à¸±à¸š 3 à¸«à¸£à¸·à¸­à¹€à¸•à¸´à¸¡ 1 e & a à¸à¹‡à¹„à¸”à¹‰ à¹à¸•à¹ˆà¹„à¸¡à¹ˆà¸§à¹ˆà¸² Rhythm à¸ˆà¸°à¹€à¸¢à¸­à¸°à¸«à¸£à¸·à¸­à¸™à¹‰à¸­à¸¢ Pulse à¸•à¹‰à¸­à¸‡à¸¢à¸±à¸‡à¸™à¸´à¹ˆà¸‡à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸”à¸´à¸¡",
        "à¹€à¸«à¸•à¸¸à¸œà¸¥à¸—à¸µà¹ˆà¸„à¸£à¸¹à¹ƒà¸«à¹‰à¹€à¸„à¸²à¸°à¹€à¸—à¹‰à¸² à¹€à¸žà¸£à¸²à¸°à¹€à¸—à¹‰à¸²à¸Šà¹ˆà¸§à¸¢à¸¢à¸·à¸™à¸¢à¸±à¸™à¸§à¹ˆà¸²à¹ƒà¸™à¸«à¸±à¸§à¹€à¸£à¸²à¸¢à¸±à¸‡à¸£à¸¹à¹‰à¸§à¹ˆà¸² beat à¸«à¸¥à¸±à¸à¸­à¸¢à¸¹à¹ˆà¸•à¸£à¸‡à¹„à¸«à¸™ à¸–à¹‰à¸²à¹€à¸—à¹‰à¸²à¸«à¸²à¸¢à¸«à¸£à¸·à¸­à¹€à¸£à¸´à¹ˆà¸¡à¹€à¸„à¸²à¸°à¸•à¸²à¸¡à¸¡à¸·à¸­à¸¡à¸±à¹ˆà¸§ à¹† à¹à¸›à¸¥à¸§à¹ˆà¸²à¹€à¸£à¸²à¸à¸³à¸¥à¸±à¸‡à¸›à¸¥à¹ˆà¸­à¸¢à¹ƒà¸«à¹‰à¸¡à¸·à¸­à¸žà¸²à¹€à¸§à¸¥à¸²à¹„à¸›",
        "à¹€à¸£à¸´à¹ˆà¸¡à¸™à¸±à¸šà¸‡à¹ˆà¸²à¸¢à¸—à¸µà¹ˆà¸ªà¸¸à¸”à¸„à¸·à¸­ 1 2 3 4 à¹ƒà¸«à¹‰à¹€à¸¥à¸‚à¹à¸•à¹ˆà¸¥à¸°à¸•à¸±à¸§à¸«à¹ˆà¸²à¸‡à¹€à¸—à¹ˆà¸²à¸à¸±à¸™à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸”à¸´à¸™à¸—à¸µà¸¥à¸°à¸à¹‰à¸²à¸§ à¸ˆà¸²à¸à¸™à¸±à¹‰à¸™à¸„à¹ˆà¸­à¸¢à¸‹à¸­à¸¢à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¸£à¸°à¸«à¸§à¹ˆà¸²à¸‡à¹€à¸¥à¸‚à¸”à¹‰à¸§à¸¢ 1 e & a à¹€à¸žà¸·à¹ˆà¸­à¹€à¸«à¹‡à¸™ 16th Grid à¹à¸•à¹ˆà¹€à¸—à¹‰à¸²à¸¢à¸±à¸‡à¹€à¸„à¸²à¸°à¹€à¸‰à¸žà¸²à¸°à¹€à¸¥à¸‚à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸”à¸´à¸¡",
        "à¸•à¸­à¸™à¹€à¸¥à¹ˆà¸™à¸à¸µà¸•à¸²à¸£à¹Œ à¸¡à¸·à¸­à¸‚à¸§à¸²à¸„à¸§à¸£à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡à¹€à¸«à¸¡à¸·à¸­à¸™ pendulum à¹à¸¡à¹‰à¸šà¸²à¸‡à¸Šà¹ˆà¸­à¸‡à¹ƒà¸™ 16th Grid à¸ˆà¸°à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¸µà¸ˆà¸£à¸´à¸‡ à¸à¸²à¸£à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡à¸Šà¹ˆà¸§à¸¢à¹ƒà¸«à¹‰à¸¡à¸·à¸­à¹„à¸¡à¹ˆà¹€à¸”à¸²à¹€à¸§à¸¥à¸²à¹ƒà¸«à¸¡à¹ˆà¸—à¸¸à¸à¸„à¸£à¸±à¹‰à¸‡à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¸¥à¸‡à¸„à¸­à¸£à¹Œà¸”",
        "à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸™à¸µà¹‰à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¹ƒà¸Šà¹‰à¸„à¸­à¸£à¹Œà¸”à¹€à¸¢à¸­à¸° à¹€à¸¥à¸·à¸­à¸à¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§à¹à¸¥à¹‰à¸§à¸—à¸³à¹ƒà¸«à¹‰ time à¸™à¸´à¹ˆà¸‡à¸à¹ˆà¸­à¸™ à¸–à¹‰à¸²à¸„à¸­à¸£à¹Œà¸”à¸™à¹‰à¸­à¸¢à¹à¸•à¹ˆà¸¥à¸‡à¸•à¸£à¸‡ Metronome à¹„à¸”à¹‰ à¸™à¸±à¹ˆà¸™à¸„à¸·à¸­à¸žà¸·à¹‰à¸™à¸à¸²à¸™à¸—à¸µà¹ˆà¸”à¸µà¸¡à¸²à¸à¸ªà¸³à¸«à¸£à¸±à¸š Groove à¸•à¹ˆà¸­à¹„à¸›"
      ],
      listenFor: [
        "à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”à¸‚à¸­à¸‡à¹€à¸£à¸²à¸Šà¸™à¸à¸±à¸š click à¸‚à¸­à¸‡ Metronome à¸žà¸­à¸”à¸µà¸«à¸£à¸·à¸­à¸¡à¸²à¸Šà¹‰à¸²à¹„à¸›à¸™à¸´à¸”à¸«à¸™à¸¶à¹ˆà¸‡",
        "à¹€à¸§à¸¥à¸²à¸™à¸±à¸š 1 2 3 4 à¹€à¸ªà¸µà¸¢à¸‡à¹ƒà¸™à¸«à¸±à¸§à¸ªà¸¡à¹ˆà¸³à¹€à¸ªà¸¡à¸­à¹„à¸«à¸¡ à¸«à¸£à¸·à¸­à¸šà¸²à¸‡à¹€à¸¥à¸‚à¸–à¸¹à¸à¸£à¸µà¸šà¸žà¸¹à¸”à¹€à¸£à¹‡à¸§à¸à¸§à¹ˆà¸²à¹€à¸¥à¸‚à¸­à¸·à¹ˆà¸™",
        "à¸•à¸­à¸™à¸™à¸±à¸š 1 e & a à¸Šà¹ˆà¸­à¸‡ e, &, a à¹€à¸›à¹‡à¸™à¹à¸„à¹ˆà¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¹ƒà¸™à¸ˆà¸±à¸‡à¸«à¸§à¸° à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¸•à¸µà¹à¸£à¸‡à¸—à¸¸à¸à¸„à¸£à¸±à¹‰à¸‡"
      ],
      physicalFeel: [
        "à¹€à¸—à¹‰à¸²à¹€à¸„à¸²à¸°à¹€à¸‰à¸žà¸²à¸° 1 2 3 4 à¹à¸šà¸šà¸ªà¸šà¸²à¸¢ à¹† à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸à¸£à¸°à¹à¸—à¸à¹à¸£à¸‡",
        "à¸‚à¹‰à¸­à¸¡à¸·à¸­à¸‚à¸§à¸²à¹à¸à¸§à¹ˆà¸‡à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡ à¹„à¸¡à¹ˆà¹€à¸à¸£à¹‡à¸‡ à¹à¸¥à¸°à¹„à¸¡à¹ˆà¸«à¸¢à¸¸à¸”à¸£à¸­à¸ˆà¸™à¸–à¸¶à¸‡à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸•à¸µ",
        "à¹„à¸«à¸¥à¹ˆà¹à¸¥à¸°à¹à¸‚à¸™à¸„à¸§à¸£à¸£à¸¹à¹‰à¸ªà¸¶à¸à¹€à¸šà¸² à¸–à¹‰à¸²à¸•à¸±à¸§à¹à¸‚à¹‡à¸‡à¸¡à¸²à¸à¹à¸›à¸¥à¸§à¹ˆà¸²à¹€à¸£à¸²à¸à¸³à¸¥à¸±à¸‡à¸žà¸¢à¸²à¸¢à¸²à¸¡à¸„à¸¸à¸¡à¹€à¸§à¸¥à¸²à¸”à¹‰à¸§à¸¢à¹à¸£à¸‡à¹à¸—à¸™à¸à¸²à¸£à¸Ÿà¸±à¸‡"
      ],
      guitarApplication: [
        "à¹€à¸¥à¸·à¸­à¸à¸„à¸­à¸£à¹Œà¸” G, Em à¸«à¸£à¸·à¸­ Am à¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§ à¹à¸¥à¹‰à¸§à¸•à¸µ Downstroke à¹€à¸‰à¸žà¸²à¸°à¹€à¸¥à¸‚ 1 2 3 4",
        "à¸£à¸­à¸šà¸•à¹ˆà¸­à¹„à¸›à¸›à¸²à¸à¸™à¸±à¸š 1 e & a à¹à¸•à¹ˆà¸¡à¸·à¸­à¸¢à¸±à¸‡à¸•à¸µà¹€à¸‰à¸žà¸²à¸°à¹€à¸¥à¸‚ à¹€à¸žà¸·à¹ˆà¸­à¹à¸¢à¸à¸à¸²à¸£à¸™à¸±à¸šà¸à¸±à¸šà¸à¸²à¸£à¸•à¸µà¸­à¸­à¸à¸ˆà¸²à¸à¸à¸±à¸™",
        "à¹€à¸¥à¹ˆà¸™à¸„à¸­à¸£à¹Œà¸”à¸™à¹‰à¸­à¸¢à¸à¹ˆà¸­à¸™ à¹€à¸žà¸£à¸²à¸°à¹€à¸›à¹‰à¸²à¸«à¸¡à¸²à¸¢à¸„à¸·à¸­ time à¸™à¸´à¹ˆà¸‡ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸„à¸­à¸£à¹Œà¸”à¹ƒà¸«à¹‰à¹€à¸¢à¸­à¸°"
      ],
      guidedSteps: [
        "à¸£à¸­à¸šà¹à¸£à¸ à¸§à¸²à¸‡à¸à¸µà¸•à¸²à¸£à¹Œà¹„à¸§à¹‰à¸à¹ˆà¸­à¸™ à¹€à¸›à¸´à¸” Metronome 60 BPM à¹à¸¥à¹‰à¸§à¸žà¸¹à¸” 1 2 3 4 à¹ƒà¸«à¹‰à¸•à¸£à¸‡ click à¹à¸„à¹ˆà¸™à¸µà¹‰à¸žà¸­ à¸­à¸¢à¹ˆà¸²à¹€à¸žà¸´à¹ˆà¸‡à¸™à¸±à¸š 1 e & a",
        "à¸£à¸­à¸šà¸ªà¸­à¸‡ à¹ƒà¸«à¹‰à¹€à¸—à¹‰à¸²à¹€à¸„à¸²à¸°à¸žà¸£à¹‰à¸­à¸¡à¹€à¸¥à¸‚ 1 2 3 4 à¸–à¹‰à¸²à¹€à¸—à¹‰à¸²à¸à¸±à¸šà¸›à¸²à¸à¹„à¸¡à¹ˆà¸•à¸£à¸‡à¸à¸±à¸™ à¹ƒà¸«à¹‰à¸«à¸¢à¸¸à¸”à¹à¸¥à¹‰à¸§à¹€à¸£à¸´à¹ˆà¸¡à¹ƒà¸«à¸¡à¹ˆà¸Šà¹‰à¸²à¸à¸§à¹ˆà¸²à¹€à¸”à¸´à¸¡",
        "à¸£à¸­à¸šà¸ªà¸²à¸¡ à¸«à¸¢à¸´à¸šà¸à¸µà¸•à¸²à¸£à¹Œ à¸ˆà¸±à¸šà¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§ à¹à¸¥à¹‰à¸§à¸•à¸µ Downstroke à¹€à¸‰à¸žà¸²à¸°à¸•à¸­à¸™à¸žà¸¹à¸”à¹€à¸¥à¸‚ à¸­à¸¢à¹ˆà¸²à¹€à¸•à¸´à¸¡à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸­à¸·à¹ˆà¸™à¹à¸¡à¹‰à¸¡à¸·à¸­à¸ˆà¸°à¸­à¸¢à¸²à¸à¹€à¸¥à¹ˆà¸™",
        "à¸£à¸­à¸šà¸ªà¸µà¹ˆ à¹ƒà¸«à¹‰à¸›à¸²à¸à¸™à¸±à¸š 1 e & a à¹à¸•à¹ˆà¹€à¸—à¹‰à¸²à¸¢à¸±à¸‡à¹€à¸„à¸²à¸°à¹€à¸‰à¸žà¸²à¸°à¹€à¸¥à¸‚ à¹à¸¥à¸°à¸¡à¸·à¸­à¸¢à¸±à¸‡à¸•à¸µà¹€à¸‰à¸žà¸²à¸°à¹€à¸¥à¸‚à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸”à¸´à¸¡ à¸™à¸µà¹ˆà¸„à¸·à¸­à¸à¸²à¸£à¸à¸¶à¸à¹€à¸«à¹‡à¸™ Grid à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸—à¸³à¹ƒà¸«à¹‰à¸¡à¸·à¸­à¸£à¸",
        "à¸£à¸­à¸šà¸ªà¸¸à¸”à¸—à¹‰à¸²à¸¢ à¸­à¸±à¸”à¹€à¸ªà¸µà¸¢à¸‡ 30 à¸§à¸´à¸™à¸²à¸—à¸µ à¹à¸¥à¹‰à¸§à¸Ÿà¸±à¸‡à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸›à¹‡à¸™à¸„à¸£à¸¹à¸‚à¸­à¸‡à¸•à¸±à¸§à¹€à¸­à¸‡ à¸–à¹‰à¸²à¸„à¸­à¸£à¹Œà¸”à¸¡à¸²à¸à¹ˆà¸­à¸™ click à¹ƒà¸«à¹‰à¸œà¹ˆà¸­à¸™à¹ƒà¸ˆ à¸–à¹‰à¸²à¸„à¸­à¸£à¹Œà¸”à¸¡à¸²à¸«à¸¥à¸±à¸‡ click à¹ƒà¸«à¹‰à¹€à¸•à¸£à¸µà¸¢à¸¡à¸¡à¸·à¸­à¹€à¸£à¹‡à¸§à¸‚à¸¶à¹‰à¸™à¸™à¸´à¸”à¹€à¸”à¸µà¸¢à¸§"
      ],
      correctionSteps: [
        "à¸–à¹‰à¸²à¸„à¸­à¸£à¹Œà¸”à¹„à¸¡à¹ˆà¸Šà¸™ click à¹ƒà¸«à¹‰à¸•à¸±à¸”à¹€à¸«à¸¥à¸·à¸­à¹à¸„à¹ˆà¸•à¸šà¸¡à¸·à¸­à¸à¸±à¸š Metronome à¸à¹ˆà¸­à¸™ à¸­à¸¢à¹ˆà¸²à¹à¸à¹‰à¸”à¹‰à¸§à¸¢à¸à¸²à¸£à¹€à¸žà¸´à¹ˆà¸¡à¹à¸£à¸‡à¸•à¸µ",
        "à¸–à¹‰à¸²à¸™à¸±à¸š 1 e & a à¹à¸¥à¹‰à¸§à¸«à¸¥à¸‡ à¹ƒà¸«à¹‰à¸à¸¥à¸±à¸šà¹„à¸›à¸™à¸±à¸š 1 2 3 4 à¸ªà¸­à¸‡à¸£à¸­à¸š à¹à¸¥à¹‰à¸§à¸„à¹ˆà¸­à¸¢à¸‹à¸­à¸¢à¹ƒà¸«à¸¡à¹ˆ",
        "à¸–à¹‰à¸²à¸¡à¸·à¸­à¸‚à¸§à¸²à¸«à¸¢à¸¸à¸”à¸„à¹‰à¸²à¸‡ à¹ƒà¸«à¹‰à¸‹à¹‰à¸­à¸¡à¹à¸à¸§à¹ˆà¸‡à¸¡à¸·à¸­à¸¥à¸‡-à¸‚à¸¶à¹‰à¸™à¸šà¸™à¸ªà¸²à¸¢à¸—à¸µà¹ˆ mute à¹„à¸§à¹‰à¸à¹ˆà¸­à¸™ à¹à¸¥à¹‰à¸§à¸„à¹ˆà¸­à¸¢à¸›à¸¥à¹ˆà¸­à¸¢à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”à¸ˆà¸£à¸´à¸‡"
      ],
      dailySelfCheck: [
        "à¹€à¸„à¸²à¸°à¹€à¸—à¹‰à¸²à¸à¸±à¸š Metronome 60 BPM à¹„à¸”à¹‰ 2 à¸™à¸²à¸—à¸µà¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸«à¸¥à¸¸à¸” Pulse",
        "à¸™à¸±à¸š 1 2 3 4 à¸­à¸­à¸à¹€à¸ªà¸µà¸¢à¸‡à¹„à¸”à¹‰à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸£à¸µà¸šà¸«à¸£à¸·à¸­à¸Šà¹‰à¸²à¸¥à¸‡",
        "à¸¡à¸·à¸­à¸‚à¸§à¸²à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡ à¹à¸¡à¹‰à¸šà¸²à¸‡à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¸µà¸„à¸­à¸£à¹Œà¸”à¸ˆà¸£à¸´à¸‡"
      ],
      troubleshooting: [
        {
          problem: "Timing à¹€à¸£à¸´à¹ˆà¸¡ drift à¸«à¸¥à¸±à¸‡à¸›à¸£à¸°à¸¡à¸²à¸“ 20 à¸§à¸´à¸™à¸²à¸—à¸µ",
          advice: "à¸¥à¸” BPM à¸¥à¸‡ 10 à¸à¹ˆà¸­à¸™ à¹à¸¥à¹‰à¸§à¸à¸¥à¸±à¸šà¹„à¸›à¹€à¸„à¸²à¸°à¹€à¸—à¹‰à¸²à¸à¸±à¸š Metronome à¸­à¸¢à¹ˆà¸²à¸‡à¹€à¸”à¸µà¸¢à¸§ à¸žà¸­à¹€à¸—à¹‰à¸²à¸™à¸´à¹ˆà¸‡à¸„à¹ˆà¸­à¸¢à¸™à¸±à¸š 1 2 3 4 à¸­à¸­à¸à¹€à¸ªà¸µà¸¢à¸‡"
        },
        {
          problem: "à¸™à¸±à¸š 1 e & a à¹à¸¥à¹‰à¸§à¸£à¸µà¸šà¸ˆà¸™à¸Šà¹ˆà¸­à¸‡à¸¢à¹ˆà¸­à¸¢à¹„à¸¡à¹ˆà¹€à¸—à¹ˆà¸²à¸à¸±à¸™",
          advice: "à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸•à¸µà¸„à¸­à¸£à¹Œà¸” à¹ƒà¸«à¹‰à¸žà¸¹à¸”à¹€à¸šà¸²à¸¥à¸‡à¹à¸¥à¸°à¹€à¸§à¹‰à¸™à¸Šà¹ˆà¸­à¸‡à¹à¸•à¹ˆà¸¥à¸°à¸žà¸¢à¸²à¸‡à¸„à¹Œà¹ƒà¸«à¹‰à¹€à¸—à¹ˆà¸²à¸à¸±à¸™à¸à¹ˆà¸­à¸™ à¸–à¹‰à¸²à¸›à¸²à¸à¸™à¸´à¹ˆà¸‡ à¸¡à¸·à¸­à¸ˆà¸°à¸™à¸´à¹ˆà¸‡à¸•à¸²à¸¡"
        },
        {
          problem: "à¸¡à¸·à¸­à¸‚à¸§à¸²à¸«à¸¢à¸¸à¸”à¸£à¸­à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸•à¸µ",
          advice: "mute à¸ªà¸²à¸¢à¹„à¸§à¹‰ à¹à¸¥à¹‰à¸§à¹à¸à¸§à¹ˆà¸‡à¸¡à¸·à¸­à¸¥à¸‡-à¸‚à¸¶à¹‰à¸™à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡ 30 à¸§à¸´à¸™à¸²à¸—à¸µ à¸ˆà¸²à¸à¸™à¸±à¹‰à¸™à¸„à¹ˆà¸­à¸¢à¸›à¸¥à¹ˆà¸­à¸¢à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”à¹€à¸‰à¸žà¸²à¸°à¹€à¸¥à¸‚ 1 2 3 4"
        }
      ],
      miniExample: "à¸•à¸±à¹‰à¸‡ Metronome à¸—à¸µà¹ˆ 60 BPM à¸™à¸±à¸š 1 e & a à¸­à¸­à¸à¹€à¸ªà¸µà¸¢à¸‡ 4 à¸«à¹‰à¸­à¸‡ à¹à¸¥à¹‰à¸§à¸•à¸µà¸„à¸­à¸£à¹Œà¸”à¹€à¸‰à¸žà¸²à¸°à¸•à¸£à¸‡ 1 2 3 4 à¸–à¹‰à¸²à¸«à¸¥à¸¸à¸” à¹ƒà¸«à¹‰à¸à¸¥à¸±à¸šà¸¡à¸²à¸™à¸±à¸šà¹à¸„à¹ˆ 1 2 3 4 à¸à¹ˆà¸­à¸™",
      commonMistakes: [
        "à¸™à¸±à¸š 1 e & a à¹à¸¥à¹‰à¸§à¹€à¸—à¹‰à¸²à¹€à¸œà¸¥à¸­à¹€à¸„à¸²à¸°à¸—à¸¸à¸à¸žà¸¢à¸²à¸‡à¸„à¹Œ à¸—à¸³à¹ƒà¸«à¹‰ Pulse à¸«à¸¥à¸±à¸à¹„à¸¡à¹ˆà¸Šà¸±à¸”",
        "à¸¡à¸·à¸­à¸‚à¸§à¸²à¸«à¸¢à¸¸à¸”à¸£à¸­à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸•à¸µ à¸žà¸­à¸ˆà¸°à¸•à¸µà¸ˆà¸£à¸´à¸‡à¹€à¸¥à¸¢à¸¥à¸‡à¸Šà¹‰à¸²à¸«à¸£à¸·à¸­à¸£à¸µà¸šà¹€à¸à¸´à¸™",
        "à¸£à¸µà¸šà¹€à¸žà¸´à¹ˆà¸¡à¸„à¸­à¸£à¹Œà¸”à¸«à¸£à¸·à¸­à¹€à¸žà¸´à¹ˆà¸¡ Pattern à¸—à¸±à¹‰à¸‡à¸—à¸µà¹ˆà¹€à¸ªà¸µà¸¢à¸‡à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¸£à¸‡ Metronome"
      ],
      selfCheck: [
        "à¸­à¸±à¸”à¹€à¸ªà¸µà¸¢à¸‡à¹à¸¥à¹‰à¸§à¸Ÿà¸±à¸‡à¸§à¹ˆà¸² click à¸à¸±à¸šà¸„à¸­à¸£à¹Œà¸”à¹€à¸«à¸¡à¸·à¸­à¸™à¸­à¸¢à¸¹à¹ˆà¸ˆà¸¸à¸”à¹€à¸”à¸µà¸¢à¸§à¸à¸±à¸™à¸«à¸£à¸·à¸­à¸¢à¸±à¸‡",
        "à¸¥à¸­à¸‡à¸«à¸¢à¸¸à¸”à¸•à¸µà¸„à¸­à¸£à¹Œà¸” 1 à¸«à¹‰à¸­à¸‡à¹à¸•à¹ˆà¹€à¸—à¹‰à¸²à¸¢à¸±à¸‡à¹€à¸„à¸²à¸°à¸•à¹ˆà¸­à¹„à¸”à¹‰ à¹à¸›à¸¥à¸§à¹ˆà¸² Pulse à¹ƒà¸™à¸•à¸±à¸§à¹€à¸£à¸´à¹ˆà¸¡à¸™à¸´à¹ˆà¸‡",
        "à¸™à¸±à¸š 1 e & a à¹„à¸”à¹‰à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸—à¸³à¹ƒà¸«à¹‰ Downstroke à¸šà¸™à¹€à¸¥à¸‚ 1 2 3 4 à¸ªà¸±à¹ˆà¸™"
      ],
      teacherNote: "à¸„à¸£à¸¹à¹à¸™à¸°à¸™à¸³à¹ƒà¸«à¹‰à¸‹à¹‰à¸­à¸¡à¸Šà¹‰à¸²à¹à¸šà¸šà¹„à¸¡à¹ˆà¸­à¸²à¸¢à¸„à¸§à¸²à¸¡à¸Šà¹‰à¸² à¸–à¹‰à¸² 60 BPM à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸™à¸´à¹ˆà¸‡ à¹ƒà¸«à¹‰à¸¥à¸”à¸¥à¸‡à¸¡à¸²à¸­à¸µà¸ à¹€à¸žà¸£à¸²à¸° time à¸—à¸µà¹ˆà¸”à¸µà¹€à¸£à¸´à¹ˆà¸¡à¸ˆà¸²à¸à¸„à¸§à¸²à¸¡à¸™à¸´à¹ˆà¸‡ à¹„à¸¡à¹ˆà¹„à¸”à¹‰à¹€à¸£à¸´à¹ˆà¸¡à¸ˆà¸²à¸à¸„à¸§à¸²à¸¡à¹€à¸£à¹‡à¸§",
      tabMicroSkill: {
        title: "Micro-Skill: Read the Rhythm, Not Just the Numbers",
        coreIdea: "à¹€à¸¥à¸‚à¹ƒà¸™ TAB à¸šà¸­à¸à¸§à¹ˆà¸²à¹€à¸¥à¹ˆà¸™à¸­à¸°à¹„à¸£ à¹à¸•à¹ˆ rhythm à¸šà¸­à¸à¸§à¹ˆà¸²à¹€à¸¥à¹ˆà¸™à¹€à¸¡à¸·à¹ˆà¸­à¹„à¸£",
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
        teacherNote: "à¸–à¹‰à¸²à¸à¸”à¹€à¸¥à¸‚à¸–à¸¹à¸à¹à¸•à¹ˆà¹€à¸žà¸¥à¸‡à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹€à¸«à¸¡à¸·à¸­à¸™à¸•à¹‰à¸™à¸‰à¸šà¸±à¸š à¹ƒà¸«à¹‰à¹€à¸Šà¹‡à¸à¸ˆà¸±à¸‡à¸«à¸§à¸°à¹à¸¥à¸°à¸à¸²à¸£à¸«à¸¢à¸¸à¸”à¸à¹ˆà¸­à¸™ à¸­à¸¢à¹ˆà¸²à¹€à¸žà¸´à¹ˆà¸‡à¹‚à¸—à¸©à¸™à¸´à¹‰à¸§à¸‹à¹‰à¸²à¸¢",
        practice: [
          "à¸™à¸±à¸š 1 & 2 & 3 & 4 & à¸­à¸­à¸à¹€à¸ªà¸µà¸¢à¸‡à¸à¹ˆà¸­à¸™",
          "à¸•à¸šà¸¡à¸·à¸­à¹€à¸‰à¸žà¸²à¸°à¸ˆà¸¸à¸” play",
          "à¸žà¸¹à¸”à¸„à¸³à¸§à¹ˆà¸² stop à¸•à¸£à¸‡ x",
          "à¹à¸¥à¹‰à¸§à¸„à¹ˆà¸­à¸¢à¹€à¸¥à¹ˆà¸™à¸šà¸™à¸à¸µà¸•à¸²à¸£à¹Œà¸Šà¹‰à¸² à¹† à¸—à¸µà¹ˆ 60 BPM"
        ],
        commonMistakes: [
          "à¸›à¸¥à¹ˆà¸­à¸¢ E5 à¸„à¹‰à¸²à¸‡à¸ˆà¸™ rest à¹„à¸¡à¹ˆà¹€à¸‡à¸µà¸¢à¸š",
          "à¸­à¹ˆà¸²à¸™à¹à¸•à¹ˆà¹€à¸¥à¸‚ 2-2-0 à¹à¸•à¹ˆà¹„à¸¡à¹ˆà¸­à¹ˆà¸²à¸™ x / stop",
          "à¸¡à¸·à¸­à¸£à¸µà¸šà¸à¹ˆà¸­à¸™à¸›à¸²à¸à¸™à¸±à¸šà¸—à¸±à¸™"
        ],
        referenceTriggers: [
          { label: "à¹€à¸›à¸´à¸”à¸„à¸¹à¹ˆà¸¡à¸·à¸­ TAB", target: "#tabGuidebook" },
          { label: "à¸”à¸¹à¸„à¹ˆà¸²à¸ˆà¸±à¸‡à¸«à¸§à¸°à¹‚à¸™à¹‰à¸•", target: "#noteValueGuidebook" }
        ]
      }
    },
    hear: [
      "à¸Ÿà¸±à¸‡à¹€à¸ªà¸µà¸¢à¸‡ click à¸‚à¸­à¸‡ Metronome à¹ƒà¸«à¹‰à¹€à¸›à¹‡à¸™à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸ªà¹‰à¸™à¸—à¸²à¸‡à¸«à¸¥à¸±à¸ à¸­à¸¢à¹ˆà¸²à¹ƒà¸«à¹‰à¹€à¸ªà¸µà¸¢à¸‡à¸à¸µà¸•à¸²à¸£à¹Œà¸žà¸²à¹€à¸£à¸²à¹€à¸£à¹ˆà¸‡à¸«à¸£à¸·à¸­à¸Šà¹‰à¸²à¸à¸§à¹ˆà¸² click",
      "à¹€à¸§à¸¥à¸²à¸•à¸µà¸„à¸­à¸£à¹Œà¸” à¹ƒà¸«à¹‰à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¸„à¸­à¸£à¹Œà¸”à¸‚à¸­à¸‡à¹€à¸£à¸²à¸¥à¸‡à¸žà¸£à¹‰à¸­à¸¡à¸à¸±à¸šà¹€à¸¥à¸‚ 1 2 3 4 à¸«à¸£à¸·à¸­à¸¢à¸±à¸‡ à¸–à¹‰à¸²à¸„à¸­à¸£à¹Œà¸”à¸¡à¸²à¸«à¸¥à¸±à¸‡ click à¸™à¸´à¸”à¹€à¸”à¸µà¸¢à¸§à¸à¹‡à¸–à¸·à¸­à¸§à¹ˆà¸²à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¸£à¸‡",
      "à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¹€à¸¥à¹ˆà¸™à¸ªà¸§à¸¢à¹„à¸«à¸¡ à¹ƒà¸«à¹‰à¸Ÿà¸±à¸‡à¸­à¸¢à¹ˆà¸²à¸‡à¹€à¸”à¸µà¸¢à¸§à¸§à¹ˆà¸²à¹€à¸ªà¸µà¸¢à¸‡à¸à¸µà¸•à¸²à¸£à¹Œà¸à¸±à¸š Metronome à¸­à¸¢à¸¹à¹ˆà¸”à¹‰à¸§à¸¢à¸à¸±à¸™à¸«à¸£à¸·à¸­à¹à¸¢à¸à¸à¸±à¸™"
    ],
    feel: [
      "à¹ƒà¸«à¹‰à¹€à¸—à¹‰à¸²à¹€à¸„à¸²à¸°à¹€à¸‰à¸žà¸²à¸°à¹€à¸¥à¸‚ 1 2 3 4 à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸”à¸´à¸™à¸•à¸£à¸‡ à¹† à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¹€à¸„à¸²à¸° e & a",
      "à¸¡à¸·à¸­à¸‚à¸§à¸²à¸„à¸§à¸£à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸ªà¸šà¸²à¸¢ à¹„à¸¡à¹ˆà¹€à¸à¸£à¹‡à¸‡ à¹à¸¥à¸°à¹„à¸¡à¹ˆà¸£à¸µà¸šà¸¥à¸‡à¸à¹ˆà¸­à¸™ click",
      "à¸–à¹‰à¸²à¸™à¸±à¸š 1 e & a à¹à¸¥à¹‰à¸§à¸«à¸¥à¸‡ à¹ƒà¸«à¹‰à¸à¸¥à¸±à¸šà¸¡à¸²à¸™à¸±à¸šà¹à¸„à¹ˆ 1 2 3 4 à¸à¹ˆà¸­à¸™ à¸™à¸´à¹ˆà¸‡à¹à¸¥à¹‰à¸§à¸„à¹ˆà¸­à¸¢à¸‹à¸­à¸¢à¹ƒà¸«à¸¡à¹ˆ"
    ],
    visual: {
      title: "à¹€à¸«à¹‡à¸™ Pulse à¸šà¸™ 16th Grid",
      instruction: "à¸Šà¹ˆà¸­à¸‡à¸ªà¸µà¹€à¸‚à¸µà¸¢à¸§à¸„à¸·à¸­à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸•à¸µà¸„à¸­à¸£à¹Œà¸”à¸ˆà¸£à¸´à¸‡ à¸ªà¹ˆà¸§à¸™à¸Šà¹ˆà¸­à¸‡à¸­à¸·à¹ˆà¸™à¹ƒà¸«à¹‰à¸›à¸²à¸à¸™à¸±à¸šà¸œà¹ˆà¸²à¸™à¹„à¸›à¹€à¸‰à¸¢ à¹†",
      duration: 4,
      steps: [
        { count: "1", action: "à¸•à¸µ", kind: "hit" },
        { count: "e", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "&", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "a", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "2", action: "à¸•à¸µ", kind: "hit" },
        { count: "e", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "&", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "a", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "3", action: "à¸•à¸µ", kind: "hit" },
        { count: "e", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "&", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "a", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "4", action: "à¸•à¸µ", kind: "hit" },
        { count: "e", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "&", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "a", action: "à¸™à¸±à¸š", kind: "rest" }
      ]
    },
    practice: [
      "à¹€à¸¥à¸·à¸­à¸à¸„à¸­à¸£à¹Œà¸”à¸‡à¹ˆà¸²à¸¢ à¹† 1 à¸„à¸­à¸£à¹Œà¸” à¹€à¸Šà¹ˆà¸™ G, Em à¸«à¸£à¸·à¸­ Am",
      "à¸•à¸µ Downstroke à¸¥à¸‡à¸šà¸™ beat 1 2 3 4 à¹€à¸›à¹‡à¸™à¹€à¸§à¸¥à¸² 4 à¸«à¹‰à¸­à¸‡",
      "à¸£à¸­à¸šà¸–à¸±à¸”à¹„à¸›à¹ƒà¸«à¹‰à¸›à¸²à¸à¸™à¸±à¸š 1 e & a à¹à¸•à¹ˆà¸¢à¸±à¸‡à¸•à¸µà¹€à¸‰à¸žà¸²à¸°à¹€à¸¥à¸‚à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸”à¸´à¸¡",
      "à¹€à¸£à¸´à¹ˆà¸¡à¸—à¸µà¹ˆ 60 BPM à¸à¹ˆà¸­à¸™ à¸–à¹‰à¸²à¸™à¸´à¹ˆà¸‡à¹à¸¥à¹‰à¸§à¸„à¹ˆà¸­à¸¢à¸‚à¸¢à¸±à¸šà¸‚à¸¶à¹‰à¸™à¸—à¸µà¸¥à¸° 5 BPM à¹€à¸›à¹‰à¸²à¸«à¸¡à¸²à¸¢à¸„à¸·à¸­à¹ƒà¸«à¹‰à¸™à¸´à¹ˆà¸‡ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹ƒà¸«à¹‰à¹€à¸£à¹‡à¸§"
    ],
    quiz: [
      {
        question: "Pulse à¸„à¸·à¸­à¸­à¸°à¹„à¸£?",
        options: ["à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸«à¸¥à¸±à¸à¸—à¸µà¹ˆà¹€à¸”à¸´à¸™à¸­à¸¢à¸¹à¹ˆà¸•à¸¥à¸­à¸”à¹€à¸žà¸¥à¸‡", "Pattern à¸•à¸µà¸„à¸­à¸£à¹Œà¸”à¹€à¸£à¹‡à¸§ à¹†", "à¸Šà¸·à¹ˆà¸­à¸£à¸¹à¸›à¸„à¸­à¸£à¹Œà¸”à¹à¸šà¸šà¸«à¸™à¸¶à¹ˆà¸‡"],
        answer: 0
      },
      {
        question: "Rhythm à¸•à¹ˆà¸²à¸‡à¸ˆà¸²à¸ Pulse à¸­à¸¢à¹ˆà¸²à¸‡à¹„à¸£?",
        options: ["Rhythm à¸„à¸·à¸­à¸ªà¸´à¹ˆà¸‡à¸—à¸µà¹ˆà¹€à¸£à¸²à¹€à¸¥à¹ˆà¸™à¸„à¸£à¹ˆà¸­à¸¡à¸­à¸¢à¸¹à¹ˆà¸šà¸™ Pulse", "Rhythm à¸•à¹‰à¸­à¸‡à¸”à¸±à¸‡à¹€à¸ªà¸¡à¸­", "Rhythm à¹à¸›à¸¥à¸§à¹ˆà¸²à¸•à¸µà¸¥à¸‡à¸­à¸¢à¹ˆà¸²à¸‡à¹€à¸”à¸µà¸¢à¸§"],
        answer: 0
      },
      {
        question: "à¹€à¸§à¸¥à¸²à¸™à¸±à¸š 16th note à¸«à¸¥à¸±à¸‡à¹€à¸¥à¸‚ 1 à¸„à¸·à¸­à¸­à¸°à¹„à¸£?",
        options: ["e", "&", "a"],
        answer: 0
      },
      {
        question: "à¹ƒà¸™à¹à¸šà¸šà¸à¸¶à¸à¸«à¸±à¸”à¸™à¸µà¹‰ à¹€à¸—à¹‰à¸²à¸„à¸§à¸£à¹€à¸„à¸²à¸°à¸•à¸£à¸‡à¹„à¸«à¸™?",
        options: ["à¹€à¸‰à¸žà¸²à¸° 1 2 3 4", "à¸—à¸¸à¸ 16th note", "à¹€à¸‰à¸žà¸²à¸°à¸•à¸­à¸™à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸„à¸­à¸£à¹Œà¸”"],
        answer: 0
      },
      {
        question: "à¸—à¸³à¹„à¸¡à¹€à¸£à¸´à¹ˆà¸¡à¸ˆà¸²à¸à¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§à¸à¹ˆà¸­à¸™?",
        options: ["à¹€à¸žà¸·à¹ˆà¸­à¹‚à¸Ÿà¸à¸±à¸ªà¹€à¸£à¸·à¹ˆà¸­à¸‡à¹€à¸§à¸¥à¸² à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸žà¸°à¸§à¸‡à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸„à¸­à¸£à¹Œà¸”", "à¹€à¸žà¸·à¹ˆà¸­à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¹ƒà¸Šà¹‰ Metronome", "à¹€à¸žà¸·à¹ˆà¸­à¹ƒà¸«à¹‰à¸•à¸µà¹€à¸£à¹‡à¸§à¸‚à¸¶à¹‰à¸™à¸—à¸±à¸™à¸—à¸µ"],
        answer: 0
      }
    ],
    homework: [
      "à¸­à¸±à¸”à¹€à¸ªà¸µà¸¢à¸‡ 1 à¸™à¸²à¸—à¸µà¸•à¸­à¸™à¹€à¸¥à¹ˆà¸™ beat 1 2 3 4 à¸à¸±à¸š Metronome à¹à¸¥à¹‰à¸§à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¹€à¸ªà¸µà¸¢à¸‡à¸à¸µà¸•à¸²à¸£à¹Œà¸Šà¸™ click à¸«à¸£à¸·à¸­à¸¢à¸±à¸‡",
      "à¸ˆà¸” BPM à¸—à¸µà¹ˆà¸™à¸´à¹ˆà¸‡à¸—à¸µà¹ˆà¸ªà¸¸à¸”à¹„à¸§à¹‰ 1 à¸„à¹ˆà¸² à¹à¸¥à¹‰à¸§à¹ƒà¸Šà¹‰à¸„à¹ˆà¸²à¸™à¸±à¹‰à¸™à¹€à¸›à¹‡à¸™à¸ˆà¸¸à¸”à¹€à¸£à¸´à¹ˆà¸¡à¸‹à¹‰à¸­à¸¡à¸§à¸±à¸™à¸–à¸±à¸”à¹„à¸›"
    ]
  },
  {
    number: 2,
    title: "Syncopation",
    summary: "à¸à¸¶à¸à¸§à¸²à¸‡ Accent à¸šà¸™ off-beat à¹€à¸žà¸·à¹ˆà¸­à¹ƒà¸«à¹‰à¸ˆà¸±à¸‡à¸«à¸§à¸°à¹€à¸£à¸´à¹ˆà¸¡à¸¡à¸µ Groove",
    youtube: {
      title: "à¸Ÿà¸±à¸‡à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡ Syncopation à¹à¸¥à¸° Accent à¸šà¸™ off-beat",
      embedUrl: "https://www.youtube.com/embed?listType=search&list=guitar%20rhythm%20syncopation%20strumming"
    },
    learn: {
      targetBpm: "50-80 BPM",
      diagram: {
        title: "Off-beat Grid: à¹ƒà¸«à¹‰à¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¹ˆà¸™à¸šà¸™ &",
        caption: "à¹€à¸—à¹‰à¸²à¸­à¸¢à¸¹à¹ˆà¸šà¸™à¹€à¸¥à¸‚ 1 2 3 4 à¸ªà¹ˆà¸§à¸™à¸„à¸­à¸£à¹Œà¸”à¸—à¸µà¹ˆà¸—à¸³à¹ƒà¸«à¹‰ Groove à¹€à¸”à¹‰à¸‡à¹ƒà¸«à¹‰à¸¥à¸­à¸‡à¸§à¸²à¸‡à¸šà¸™ & à¸«à¸¥à¸±à¸‡ 2 à¹à¸¥à¸° 4",
        cells: [
          { label: "1", note: "ghost", kind: "ghost" },
          { label: "&", note: "à¸žà¸±à¸", kind: "rest" },
          { label: "2", note: "ghost", kind: "ghost" },
          { label: "&", note: "Accent", kind: "accent" },
          { label: "3", note: "ghost", kind: "ghost" },
          { label: "&", note: "à¸žà¸±à¸", kind: "rest" },
          { label: "4", note: "ghost", kind: "ghost" },
          { label: "&", note: "Accent", kind: "accent" }
        ]
      },
      paragraphs: [
        "à¸«à¸¥à¸±à¸‡à¸”à¸¹à¸§à¸´à¸”à¸µà¹‚à¸­ à¹ƒà¸«à¹‰à¸ªà¸±à¸‡à¹€à¸à¸•à¸§à¹ˆà¸²à¸šà¸²à¸‡à¸„à¸£à¸±à¹‰à¸‡à¸à¸µà¸•à¸²à¸£à¹Œà¹„à¸¡à¹ˆà¹„à¸”à¹‰à¸”à¸±à¸‡à¸•à¸£à¸‡à¹€à¸¥à¸‚ 1 2 3 4 à¹à¸•à¹ˆà¹€à¸žà¸¥à¸‡à¸à¸¥à¸±à¸šà¸£à¸¹à¹‰à¸ªà¸¶à¸à¹€à¸”à¹‰à¸‡à¸‚à¸¶à¹‰à¸™ à¸™à¸±à¹ˆà¸™à¸„à¸·à¸­à¸ˆà¸¸à¸”à¹€à¸£à¸´à¹ˆà¸¡à¸‚à¸­à¸‡ Syncopation",
        "Off-beat à¸„à¸·à¸­à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¸£à¸°à¸«à¸§à¹ˆà¸²à¸‡ beat à¸«à¸¥à¸±à¸ à¹€à¸Šà¹ˆà¸™ & à¸—à¸µà¹ˆà¸­à¸¢à¸¹à¹ˆà¸£à¸°à¸«à¸§à¹ˆà¸²à¸‡ 1 à¸à¸±à¸š 2 à¸«à¸£à¸·à¸­à¸£à¸°à¸«à¸§à¹ˆà¸²à¸‡ 2 à¸à¸±à¸š 3 à¸–à¹‰à¸² beat à¸«à¸¥à¸±à¸à¸„à¸·à¸­à¸à¹‰à¸²à¸§à¹€à¸”à¸´à¸™ off-beat à¸à¹‡à¹€à¸«à¸¡à¸·à¸­à¸™à¹à¸£à¸‡à¹€à¸”à¹‰à¸‡à¸£à¸°à¸«à¸§à¹ˆà¸²à¸‡à¸à¹‰à¸²à¸§",
        "à¸à¸²à¸£à¸•à¸µà¹„à¸¡à¹ˆà¸•à¸£à¸‡ beat à¹à¸¥à¹‰à¸§à¹€à¸à¸´à¸” Groove à¹„à¸¡à¹ˆà¹„à¸”à¹‰à¹à¸›à¸¥à¸§à¹ˆà¸²à¹€à¸¥à¹ˆà¸™à¸¡à¸±à¹ˆà¸§ à¹à¸•à¹ˆà¹à¸›à¸¥à¸§à¹ˆà¸²à¹€à¸£à¸²à¸£à¸¹à¹‰à¸§à¹ˆà¸² beat à¸«à¸¥à¸±à¸à¸­à¸¢à¸¹à¹ˆà¸•à¸£à¸‡à¹„à¸«à¸™ à¹à¸¥à¹‰à¸§à¸•à¸±à¹‰à¸‡à¹ƒà¸ˆà¹ƒà¸«à¹‰à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”à¹„à¸›à¹€à¸”à¹ˆà¸™à¹ƒà¸™à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸„à¸™à¸Ÿà¸±à¸‡à¸„à¸²à¸”à¹„à¸¡à¹ˆà¸–à¸¶à¸‡",
        "à¸„à¸§à¸²à¸¡à¸•à¹ˆà¸²à¸‡à¸£à¸°à¸«à¸§à¹ˆà¸²à¸‡à¸«à¸¥à¸¸à¸”à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸à¸±à¸š Syncopation à¸­à¸¢à¸¹à¹ˆà¸—à¸µà¹ˆ Pulse à¸–à¹‰à¸²à¹€à¸—à¹‰à¸²à¸¢à¸±à¸‡à¹€à¸„à¸²à¸° 1 2 3 4 à¹„à¸”à¹‰à¸¡à¸±à¹ˆà¸™ à¹à¸¥à¸°à¸„à¸­à¸£à¹Œà¸”à¸”à¸±à¸‡à¸šà¸™ & à¹à¸šà¸šà¸•à¸±à¹‰à¸‡à¹ƒà¸ˆ à¸™à¸±à¹ˆà¸™à¸„à¸·à¸­ Syncopation à¹à¸•à¹ˆà¸–à¹‰à¸²à¹€à¸—à¹‰à¸²à¸«à¸²à¸¢à¹à¸¥à¸°à¹€à¸£à¸²à¸«à¸²à¸—à¸²à¸‡à¸à¸¥à¸±à¸š beat à¹„à¸¡à¹ˆà¹€à¸ˆà¸­ à¸™à¸±à¹ˆà¸™à¸„à¸·à¸­à¸«à¸¥à¸¸à¸”",
        "à¸à¹ˆà¸­à¸™à¹€à¸¥à¹ˆà¸™à¹ƒà¸«à¹‰à¸žà¸¹à¸”à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸­à¸­à¸à¸¡à¸²à¸à¹ˆà¸­à¸™ à¹€à¸Šà¹ˆà¸™ 1 & 2 & 3 & 4 & à¹à¸¥à¹‰à¸§à¸§à¸‡à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸­à¸¢à¸²à¸à¹ƒà¸«à¹‰à¸„à¸­à¸£à¹Œà¸”à¸”à¸±à¸‡ à¹€à¸Šà¹ˆà¸™ & à¸«à¸¥à¸±à¸‡ 2 à¸žà¸­à¸›à¸²à¸à¸™à¸±à¸šà¹„à¸”à¹‰à¸Šà¸±à¸” à¸¡à¸·à¸­à¸ˆà¸°à¸¡à¸µà¹‚à¸­à¸à¸²à¸ªà¹€à¸¥à¹ˆà¸™à¸•à¸£à¸‡à¸¡à¸²à¸à¸‚à¸¶à¹‰à¸™",
        "à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡à¸‡à¹ˆà¸²à¸¢ à¹† à¸„à¸·à¸­à¹€à¸§à¹‰à¸™ beat 2 à¹„à¸§à¹‰à¹€à¸šà¸²à¸«à¸£à¸·à¸­à¹€à¸›à¹‡à¸™ ghost à¹à¸¥à¹‰à¸§à¹ƒà¸«à¹‰à¸„à¸­à¸£à¹Œà¸”à¸”à¸±à¸‡à¸—à¸µà¹ˆ & à¸«à¸¥à¸±à¸‡ 2 à¹€à¸ªà¸µà¸¢à¸‡à¸ˆà¸°à¹€à¸«à¸¡à¸·à¸­à¸™à¸–à¸¹à¸à¸œà¸¥à¸±à¸à¹„à¸›à¸‚à¹‰à¸²à¸‡à¸«à¸™à¹‰à¸² à¸—à¸³à¹ƒà¸«à¹‰ Groove à¸¡à¸µà¸Šà¸µà¸§à¸´à¸•à¸‚à¸¶à¹‰à¸™",
        "à¸­à¸¢à¹ˆà¸²à¸£à¸µà¸šà¸—à¸³à¹ƒà¸«à¹‰à¸¡à¸±à¸™à¸‹à¸±à¸šà¸‹à¹‰à¸­à¸™ à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸™à¸µà¹‰à¸‚à¸­à¹ƒà¸«à¹‰à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸§à¹ˆà¸²à¹€à¸—à¹‰à¸²à¹€à¸›à¹‡à¸™à¸žà¸·à¹‰à¸™ à¸ªà¹ˆà¸§à¸™à¸¡à¸·à¸­à¸‚à¸§à¸²à¹€à¸›à¹‡à¸™à¸„à¸™à¹€à¸¥à¹ˆà¸™à¸à¸±à¸šà¸žà¸·à¹‰à¸™à¸™à¸±à¹‰à¸™ à¸–à¹‰à¸²à¸žà¸·à¹‰à¸™à¸¢à¸±à¸‡à¸™à¸´à¹ˆà¸‡ Syncopation à¸ˆà¸°à¸Ÿà¸±à¸‡à¸ªà¸™à¸¸à¸à¹à¸—à¸™à¸—à¸µà¹ˆà¸ˆà¸°à¸Ÿà¸±à¸‡à¸«à¸¥à¸¸à¸”"
      ],
      listenFor: [
        "Accent à¸šà¸™ off-beat à¸—à¸³à¹ƒà¸«à¹‰ Groove à¹€à¸”à¹‰à¸‡à¸‚à¸¶à¹‰à¸™à¹„à¸«à¸¡ à¸«à¸£à¸·à¸­à¸—à¸³à¹ƒà¸«à¹‰ Pulse à¸«à¸²à¸¢à¹„à¸›",
        "à¸«à¸¥à¸±à¸‡à¸•à¸µà¸—à¸µà¹ˆ & à¹à¸¥à¹‰à¸§à¹€à¸£à¸²à¸à¸¥à¸±à¸šà¸¡à¸²à¹€à¸ˆà¸­ beat à¸–à¸±à¸”à¹„à¸›à¹„à¸”à¹‰à¸•à¸£à¸‡à¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆ",
        "à¹€à¸ªà¸µà¸¢à¸‡ ghost à¸«à¸£à¸·à¸­ muted strum à¹€à¸šà¸²à¸žà¸­à¸—à¸µà¹ˆà¸ˆà¸°à¹„à¸¡à¹ˆà¹à¸¢à¹ˆà¸‡à¸„à¸§à¸²à¸¡à¹€à¸”à¹ˆà¸™à¸ˆà¸²à¸ Accent à¸«à¸£à¸·à¸­à¹€à¸›à¸¥à¹ˆà¸²"
      ],
      physicalFeel: [
        "à¹€à¸—à¹‰à¸²à¸¢à¸±à¸‡à¹€à¸„à¸²à¸° 1 2 3 4 à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸”à¸´à¸¡",
        "à¸‚à¹‰à¸­à¸¡à¸·à¸­à¸‚à¸§à¸²à¹à¸à¸§à¹ˆà¸‡à¸œà¹ˆà¸²à¸™à¸Šà¹ˆà¸­à¸‡à¸—à¸µà¹ˆà¹„à¸¡à¹ˆà¹„à¸”à¹‰à¸•à¸µà¸ˆà¸£à¸´à¸‡ à¹„à¸¡à¹ˆà¸«à¸¢à¸¸à¸”à¸„à¹‰à¸²à¸‡",
        "à¸•à¸­à¸™à¸•à¸µ Accent à¸šà¸™ & à¹ƒà¸«à¹‰à¸£à¸¹à¹‰à¸ªà¸¶à¸à¹€à¸«à¸¡à¸·à¸­à¸™à¸ªà¸°à¸à¸´à¸”à¸ˆà¸±à¸‡à¸«à¸§à¸° à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸à¸£à¸°à¸Šà¸²à¸à¸—à¸±à¹‰à¸‡à¹à¸‚à¸™"
      ],
      guitarApplication: [
        "à¹€à¸£à¸´à¹ˆà¸¡à¸ˆà¸²à¸à¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§ à¸•à¸µà¹€à¸šà¸²à¸šà¸™ 1 2 3 4 à¹à¸¥à¹‰à¸§à¹€à¸žà¸´à¹ˆà¸¡ Accent à¸—à¸µà¹ˆ & à¸«à¸¥à¸±à¸‡ 2",
        "à¸¥à¸­à¸‡ mute à¸ªà¸²à¸¢à¸”à¹‰à¸§à¸¢à¸¡à¸·à¸­à¸‹à¹‰à¸²à¸¢à¹€à¸žà¸·à¹ˆà¸­à¸à¸¶à¸à¸¡à¸·à¸­à¸‚à¸§à¸²à¸à¹ˆà¸­à¸™ à¸ˆà¸²à¸à¸™à¸±à¹‰à¸™à¸„à¹ˆà¸­à¸¢à¸›à¸¥à¹ˆà¸­à¸¢à¸„à¸­à¸£à¹Œà¸”à¸ˆà¸£à¸´à¸‡à¹ƒà¸«à¹‰à¸”à¸±à¸‡à¹€à¸‰à¸žà¸²à¸°à¸ˆà¸¸à¸” Accent",
        "à¹ƒà¸Šà¹‰ Pattern à¸ªà¸±à¹‰à¸™ 1 à¸«à¹‰à¸­à¸‡à¸§à¸™à¸‹à¹‰à¸³à¸ˆà¸™à¸à¸¥à¸±à¸šà¹€à¸‚à¹‰à¸² beat 1 à¹„à¸”à¹‰à¸¡à¸±à¹ˆà¸™à¸à¹ˆà¸­à¸™à¸„à¹ˆà¸­à¸¢à¹€à¸žà¸´à¹ˆà¸¡à¸­à¸µà¸à¸«à¹‰à¸­à¸‡"
      ],
      guidedSteps: [
        "à¸£à¸­à¸šà¹à¸£à¸ à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸ˆà¸±à¸šà¸„à¸­à¸£à¹Œà¸” à¹ƒà¸«à¹‰à¸žà¸¹à¸” 1 & 2 & 3 & 4 & à¸žà¸£à¹‰à¸­à¸¡à¹€à¸„à¸²à¸°à¹€à¸—à¹‰à¸²à¹€à¸‰à¸žà¸²à¸°à¹€à¸¥à¸‚ à¸–à¹‰à¸²à¹€à¸—à¹‰à¸²à¹€à¸œà¸¥à¸­à¹€à¸„à¸²à¸° & à¹ƒà¸«à¹‰à¹€à¸£à¸´à¹ˆà¸¡à¹ƒà¸«à¸¡à¹ˆ",
        "à¸£à¸­à¸šà¸ªà¸­à¸‡ à¹ƒà¸«à¹‰à¸•à¸šà¸¡à¸·à¸­à¹€à¸šà¸² à¹† à¸•à¸£à¸‡ & à¸«à¸¥à¸±à¸‡ 2 à¹à¸„à¹ˆà¸ˆà¸¸à¸”à¹€à¸”à¸µà¸¢à¸§ à¹à¸¥à¹‰à¸§à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¸«à¸¥à¸±à¸‡à¸•à¸šà¸¡à¸·à¸­à¹€à¸£à¸²à¸à¸¥à¸±à¸šà¸¡à¸²à¹€à¸ˆà¸­ 3 à¹„à¸”à¹‰à¹„à¸«à¸¡",
        "à¸£à¸­à¸šà¸ªà¸²à¸¡ à¸ˆà¸±à¸šà¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§à¹à¸¥à¹‰à¸§ mute à¸ªà¸²à¸¢à¹„à¸§à¹‰ à¸¡à¸·à¸­à¸‚à¸§à¸²à¹à¸à¸§à¹ˆà¸‡à¸¥à¸‡-à¸‚à¸¶à¹‰à¸™à¸•à¸¥à¸­à¸” à¹ƒà¸«à¹‰à¹€à¸ªà¸µà¸¢à¸‡ muted à¹€à¸šà¸² à¹† à¸œà¹ˆà¸²à¸™à¹„à¸›à¸à¹ˆà¸­à¸™",
        "à¸£à¸­à¸šà¸ªà¸µà¹ˆ à¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”à¹€à¸‰à¸žà¸²à¸°à¸—à¸µà¹ˆ & à¸«à¸¥à¸±à¸‡ 2 à¸ªà¹ˆà¸§à¸™à¸ˆà¸¸à¸”à¸­à¸·à¹ˆà¸™à¹ƒà¸«à¹‰ ghost à¹€à¸šà¸² à¹† à¸­à¸¢à¹ˆà¸²à¹€à¸£à¹ˆà¸‡à¹€à¸‚à¹‰à¸²à¸«à¸² & à¹€à¸žà¸£à¸²à¸°à¸à¸¥à¸±à¸§à¹„à¸¡à¹ˆà¸—à¸±à¸™",
        "à¸£à¸­à¸šà¸ªà¸¸à¸”à¸—à¹‰à¸²à¸¢ à¹€à¸¥à¹ˆà¸™ 4 à¸«à¹‰à¸­à¸‡à¸•à¸´à¸”à¸à¸±à¸™ à¸–à¹‰à¸²à¸žà¸¥à¸²à¸”à¹ƒà¸«à¹‰à¸à¸¥à¸±à¸šà¹€à¸‚à¹‰à¸²à¸—à¸µà¹ˆ beat à¸–à¸±à¸”à¹„à¸› à¸«à¹‰à¸²à¸¡à¸«à¸¢à¸¸à¸”à¸à¸¥à¸²à¸‡à¸«à¹‰à¸­à¸‡ à¹€à¸žà¸£à¸²à¸°à¹ƒà¸™à¹€à¸žà¸¥à¸‡à¸ˆà¸£à¸´à¸‡à¹€à¸£à¸²à¸•à¹‰à¸­à¸‡à¸à¸¥à¸±à¸šà¹€à¸‚à¹‰à¸²à¸§à¸‡à¹ƒà¸«à¹‰à¹„à¸”à¹‰"
      ],
      correctionSteps: [
        "à¸–à¹‰à¸² Accent à¸¡à¸²à¸à¹ˆà¸­à¸™à¹€à¸§à¸¥à¸² à¹ƒà¸«à¹‰à¸žà¸¹à¸” & à¹€à¸šà¸²à¸¥à¸‡à¹à¸¥à¸°à¸£à¸­à¹ƒà¸«à¹‰à¹€à¸—à¹‰à¸²à¹€à¸«à¸¢à¸µà¸¢à¸šà¹€à¸¥à¸‚ 2 à¸à¹ˆà¸­à¸™à¸„à¹ˆà¸­à¸¢à¸ªà¹ˆà¸‡à¸¡à¸·à¸­à¸‚à¸¶à¹‰à¸™",
        "à¸–à¹‰à¸²à¹€à¸¥à¹ˆà¸™à¹à¸¥à¹‰à¸§à¹€à¸«à¸¡à¸·à¸­à¸™à¸«à¸¥à¸¸à¸” à¹ƒà¸«à¹‰à¸¥à¸šà¸„à¸­à¸£à¹Œà¸”à¸­à¸­à¸ à¹€à¸«à¸¥à¸·à¸­à¹à¸„à¹ˆ mute à¸ªà¸²à¸¢à¸à¸±à¸šà¸™à¸±à¸šà¹€à¸ªà¸µà¸¢à¸‡à¸”à¸±à¸‡à¸ˆà¸™ Pulse à¸à¸¥à¸±à¸šà¸¡à¸²à¸™à¸´à¹ˆà¸‡",
        "à¸–à¹‰à¸² Accent à¹à¸£à¸‡à¹€à¸à¸´à¸™ à¹ƒà¸«à¹‰à¸¥à¸”à¹à¸£à¸‡ pick à¹à¸¥à¹‰à¸§à¹ƒà¸Šà¹‰à¸„à¸§à¸²à¸¡à¸Šà¸±à¸”à¸‚à¸­à¸‡à¹€à¸§à¸¥à¸²à¹à¸—à¸™à¸„à¸§à¸²à¸¡à¸”à¸±à¸‡"
      ],
      dailySelfCheck: [
        "à¹€à¸¥à¹ˆà¸™à¸„à¸­à¸£à¹Œà¸”à¸šà¸™ \"&\" à¹„à¸”à¹‰à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸£à¸µà¸šà¹€à¸‚à¹‰à¸²à¸«à¸² beat à¸–à¸±à¸”à¹„à¸›",
        "à¸™à¸±à¸š 1 & 2 & 3 & 4 & à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡à¸£à¸°à¸«à¸§à¹ˆà¸²à¸‡ strumming à¹„à¸”à¹‰",
        "à¸¢à¸±à¸‡ locked à¸à¸±à¸š Metronome à¹„à¸”à¹‰à¸•à¸±à¹‰à¸‡à¹à¸•à¹ˆ 50 BPM à¹à¸¥à¸°à¸„à¹ˆà¸­à¸¢ à¹† à¸‚à¸¢à¸±à¸šà¹„à¸› 80 BPM"
      ],
      troubleshooting: [
        {
          problem: "Syncopation feels rushed",
          advice: "à¸§à¸²à¸‡à¸à¸µà¸•à¸²à¸£à¹Œà¸à¹ˆà¸­à¸™ à¹à¸¥à¹‰à¸§à¸™à¸±à¸š 1 & 2 & 3 & 4 & à¹ƒà¸«à¹‰à¸•à¸£à¸‡à¸à¸±à¸šà¹€à¸—à¹‰à¸² à¸ˆà¸²à¸à¸™à¸±à¹‰à¸™à¸„à¹ˆà¸­à¸¢ strum à¹€à¸‰à¸žà¸²à¸° \"&\" à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¸à¸²à¸£"
        },
        {
          problem: "à¹€à¸¥à¹ˆà¸™à¸šà¸™ & à¹à¸¥à¹‰à¸§à¸à¸¥à¸±à¸šà¹€à¸‚à¹‰à¸² beat à¸–à¸±à¸”à¹„à¸›à¹„à¸¡à¹ˆà¸—à¸±à¸™",
          advice: "à¸¥à¸” BPM à¸¥à¸‡ 10 à¹à¸¥à¸°à¸à¸¶à¸à¹à¸„à¹ˆ 1 à¸«à¹‰à¸­à¸‡à¸§à¸™à¸‹à¹‰à¸³ à¸­à¸¢à¹ˆà¸²à¹€à¸žà¸´à¹ˆà¸¡ Accent à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸ªà¸­à¸‡à¸ˆà¸™à¸à¸§à¹ˆà¸²à¸ˆà¸°à¸à¸¥à¸±à¸šà¸¡à¸²à¹€à¸ˆà¸­ beat 1 à¹„à¸”à¹‰à¸—à¸¸à¸à¸„à¸£à¸±à¹‰à¸‡"
        },
        {
          problem: "Accent à¹à¸£à¸‡à¸ˆà¸™ Groove à¹€à¸«à¸¡à¸·à¸­à¸™à¸«à¸¥à¸¸à¸”",
          advice: "à¸¥à¸”à¹à¸£à¸‡ pick à¸¥à¸‡ à¹ƒà¸«à¹‰à¸ˆà¸¸à¸”à¹€à¸”à¹ˆà¸™à¸¡à¸²à¸ˆà¸²à¸à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡à¹€à¸§à¸¥à¸² à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸„à¸§à¸²à¸¡à¸”à¸±à¸‡ à¹à¸¥à¹‰à¸§à¹€à¸Šà¹‡à¸à¸§à¹ˆà¸²à¹€à¸—à¹‰à¸²à¸¢à¸±à¸‡à¸­à¸¢à¸¹à¹ˆà¸šà¸™ 1 2 3 4"
        }
      ],
      miniExample: "à¸™à¸±à¸š 1 & 2 & 3 & 4 & à¹à¸¥à¹‰à¸§à¹€à¸¥à¹ˆà¸™ ghost à¹€à¸šà¸² à¹† à¸šà¸™ 1 à¸à¸±à¸š 2 à¸ˆà¸²à¸à¸™à¸±à¹‰à¸™à¹ƒà¸«à¹‰à¸„à¸­à¸£à¹Œà¸”à¸”à¸±à¸‡à¸Šà¸±à¸”à¸—à¸µà¹ˆ & à¸«à¸¥à¸±à¸‡ 2 à¹à¸¥à¹‰à¸§à¸à¸¥à¸±à¸šà¸¡à¸²à¹€à¸ˆà¸­ 3 à¹à¸šà¸šà¹„à¸¡à¹ˆà¸£à¸µà¸š",
      commonMistakes: [
        "à¸£à¸µà¸šà¹€à¸‚à¹‰à¸² Accent à¹€à¸£à¹‡à¸§à¹€à¸à¸´à¸™à¹€à¸žà¸£à¸²à¸°à¸à¸¥à¸±à¸§à¹„à¸¡à¹ˆà¸—à¸±à¸™ & à¸—à¸³à¹ƒà¸«à¹‰à¸—à¸±à¹‰à¸‡ Pattern à¹€à¸«à¸¡à¸·à¸­à¸™à¸§à¸´à¹ˆà¸‡à¸™à¸³ Metronome",
        "à¸•à¸µ Accent à¹à¸£à¸‡à¹€à¸à¸´à¸™à¸ˆà¸™ Pulse à¸«à¸¥à¸±à¸à¸«à¸²à¸¢ à¹à¸¥à¸°à¸•à¸±à¸§à¹€à¸£à¸´à¹ˆà¸¡à¹‚à¸¢à¸à¸•à¸²à¸¡à¸¡à¸·à¸­à¹à¸—à¸™à¹€à¸—à¹‰à¸²",
        "à¸«à¸¢à¸¸à¸”à¸¡à¸·à¸­à¸‚à¸§à¸²à¸•à¸£à¸‡à¸Šà¹ˆà¸­à¸‡à¸—à¸µà¹ˆà¹€à¸§à¹‰à¸™ à¸—à¸³à¹ƒà¸«à¹‰à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸–à¸±à¸”à¹„à¸›à¸•à¹‰à¸­à¸‡à¹€à¸”à¸²à¹ƒà¸«à¸¡à¹ˆ"
      ],
      selfCheck: [
        "à¹€à¸›à¸´à¸” Metronome à¹à¸¥à¹‰à¸§à¹€à¸—à¹‰à¸²à¸¢à¸±à¸‡à¹€à¸„à¸²à¸° 1 2 3 4 à¹„à¸”à¹‰à¹à¸¡à¹‰à¸„à¸­à¸£à¹Œà¸”à¸ˆà¸°à¸”à¸±à¸‡à¸šà¸™ &",
        "à¸«à¸¥à¸±à¸‡ Accent à¸šà¸™ off-beat à¸¢à¸±à¸‡à¸à¸¥à¸±à¸šà¸¡à¸²à¹€à¸ˆà¸­ beat à¸–à¸±à¸”à¹„à¸›à¹„à¸”à¹‰à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸ªà¸°à¸”à¸¸à¸”",
        "à¸–à¹‰à¸²à¸­à¸±à¸”à¹€à¸ªà¸µà¸¢à¸‡à¸Ÿà¸±à¸‡à¸¢à¹‰à¸­à¸™ à¸ˆà¸°à¹„à¸”à¹‰à¸¢à¸´à¸™à¸§à¹ˆà¸²à¸ˆà¸¸à¸”à¸—à¸µà¹ˆ Syncopation à¹€à¸”à¹ˆà¸™à¸‚à¸¶à¹‰à¸™ à¹à¸•à¹ˆà¸ˆà¸±à¸‡à¸«à¸§à¸°à¸«à¸¥à¸±à¸à¸¢à¸±à¸‡à¹€à¸”à¸´à¸™à¸­à¸¢à¸¹à¹ˆ"
      ],
      teacherNote: "à¸„à¸£à¸¹à¹à¸™à¸°à¸™à¸³à¹ƒà¸«à¹‰à¸žà¸¹à¸”à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸à¹ˆà¸­à¸™à¹€à¸¥à¹ˆà¸™à¸—à¸¸à¸à¸„à¸£à¸±à¹‰à¸‡ à¸–à¹‰à¸²à¸›à¸²à¸à¸¢à¸±à¸‡à¸žà¸¹à¸”à¹„à¸¡à¹ˆà¸•à¸£à¸‡ à¸¡à¸·à¸­à¸¡à¸±à¸à¸ˆà¸°à¹€à¸¥à¹ˆà¸™à¹„à¸¡à¹ˆà¸•à¸£à¸‡à¹€à¸«à¸¡à¸·à¸­à¸™à¸à¸±à¸™ à¹ƒà¸«à¹‰à¹à¸à¹‰à¸—à¸µà¹ˆà¸à¸²à¸£à¸™à¸±à¸šà¸à¹ˆà¸­à¸™ à¹à¸¥à¹‰à¸§à¸à¸µà¸•à¸²à¸£à¹Œà¸ˆà¸°à¸•à¸²à¸¡à¸¡à¸²à¸‡à¹ˆà¸²à¸¢à¸‚à¸¶à¹‰à¸™",
      referenceTriggers: [
        {
          label: "à¸—à¸šà¸—à¸§à¸™ Downbeat / Upbeat",
          target: "#noteValueGuidebook",
          hint: "à¸–à¹‰à¸² & à¸¢à¸±à¸‡à¸¥à¸­à¸¢à¸«à¸£à¸·à¸­à¸£à¸µà¸š à¹ƒà¸«à¹‰à¹€à¸›à¸´à¸”à¸„à¹ˆà¸²à¸ˆà¸±à¸‡à¸«à¸§à¸°à¹‚à¸™à¹‰à¸•à¹à¸¥à¹‰à¸§à¸”à¸¹à¹à¸œà¸™à¸—à¸µà¹ˆà¸ˆà¸±à¸‡à¸«à¸§à¸°à¸•à¸ / à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸¢à¸à¸ªà¸±à¹‰à¸™ à¹† à¸à¹ˆà¸­à¸™à¸à¸¥à¸±à¸šà¸¡à¸²à¸‹à¹‰à¸­à¸¡"
        }
      ]
    },
    earTraining: {
      title: "à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¸­à¸±à¸™à¹„à¸«à¸™à¸£à¸µà¸šà¸à¸§à¹ˆà¸² beat",
      instruction: "à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸Ÿà¸±à¸‡ pitch à¸«à¸£à¸·à¸­à¸„à¸­à¸£à¹Œà¸” à¹ƒà¸«à¹‰à¸Ÿà¸±à¸‡à¹à¸„à¹ˆà¸§à¹ˆà¸² strum à¸­à¸¢à¸¹à¹ˆà¸à¸±à¸š Metronome à¸«à¸£à¸·à¸­à¸§à¸´à¹ˆà¸‡à¸™à¸³ click à¹„à¸›à¸à¹ˆà¸­à¸™",
      examples: [
        {
          label: "à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡ A",
          description: "à¸„à¸­à¸£à¹Œà¸”à¸šà¸™ \"&\" à¹€à¸‚à¹‰à¸²à¸à¹ˆà¸­à¸™ click à¸–à¸±à¸”à¹„à¸›à¸™à¸´à¸”à¸«à¸™à¸¶à¹ˆà¸‡ à¸Ÿà¸±à¸‡à¹à¸¥à¹‰à¸§à¹€à¸«à¸¡à¸·à¸­à¸™à¸„à¸™à¹€à¸¥à¹ˆà¸™à¸à¸³à¸¥à¸±à¸‡à¸£à¸µà¸šà¹„à¸›à¸‚à¹‰à¸²à¸‡à¸«à¸™à¹‰à¸²"
        },
        {
          label: "à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡ B",
          description: "à¸„à¸­à¸£à¹Œà¸”à¸šà¸™ \"&\" à¸£à¸­à¸­à¸¢à¸¹à¹ˆà¹ƒà¸™à¸Šà¹ˆà¸­à¸‡à¸‚à¸­à¸‡à¸¡à¸±à¸™ à¹à¸¥à¸°à¸à¸¥à¸±à¸šà¸¡à¸²à¹€à¸ˆà¸­ beat à¸–à¸±à¸”à¹„à¸›à¸žà¸­à¸”à¸µ"
        }
      ],
      question: "à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡à¹„à¸«à¸™ rushes ahead of the beat?",
      hint: "à¸–à¹‰à¸²à¸Ÿà¸±à¸‡à¹à¸¥à¹‰à¸§à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸§à¹ˆà¸²à¹€à¸—à¹‰à¸²à¸•à¹‰à¸­à¸‡à¸£à¸µà¸šà¸•à¸²à¸¡à¸¡à¸·à¸­ à¸™à¸±à¹ˆà¸™à¸„à¸·à¸­à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡à¸—à¸µà¹ˆ rush"
    },
    hear: [
      "à¸Ÿà¸±à¸‡à¹ƒà¸«à¹‰à¹„à¸”à¹‰à¸§à¹ˆà¸²à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸«à¸¥à¸±à¸ 1 2 3 4 à¸¢à¸±à¸‡à¹€à¸”à¸´à¸™à¸­à¸¢à¸¹à¹ˆ à¹à¸¡à¹‰à¹€à¸ªà¸µà¸¢à¸‡à¸à¸µà¸•à¸²à¸£à¹Œà¸ˆà¸°à¹„à¸›à¹€à¸”à¹ˆà¸™à¸šà¸™ &",
      "Accent à¸šà¸™ off-beat à¸„à¸§à¸£à¸—à¸³à¹ƒà¸«à¹‰ Groove à¹€à¸”à¹‰à¸‡ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸—à¸³à¹ƒà¸«à¹‰à¸—à¸±à¹‰à¸‡à¸§à¸‡à¹€à¸«à¸¡à¸·à¸­à¸™à¸«à¸¥à¸¸à¸” beat",
      "à¸–à¹‰à¸²à¹„à¸”à¹‰à¸¢à¸´à¸™à¸§à¹ˆà¸² Accent à¸à¸£à¸°à¹à¸—à¸à¹à¸£à¸‡à¸ˆà¸™à¸à¸¥à¸š Pulse à¹ƒà¸«à¹‰à¸¥à¸”à¹à¸£à¸‡à¸¡à¸·à¸­à¸‚à¸§à¸²à¸¥à¸‡ à¹à¸¥à¹‰à¸§à¸›à¸¥à¹ˆà¸­à¸¢à¹ƒà¸«à¹‰ Metronome à¹€à¸›à¹‡à¸™à¸•à¸±à¸§à¸™à¸³"
    ],
    feel: [
      "à¹€à¸—à¹‰à¸²à¸¢à¸±à¸‡à¹€à¸„à¸²à¸° 1 2 3 4 à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸”à¸´à¸¡ à¹à¸•à¹ˆà¸‚à¹‰à¸­à¸¡à¸·à¸­à¸‚à¸§à¸²à¸ˆà¸°à¸£à¸¹à¹‰à¸ªà¸¶à¸à¹€à¸«à¸¡à¸·à¸­à¸™à¸ªà¹ˆà¸‡à¹à¸£à¸‡à¹„à¸›à¸—à¸µà¹ˆ &",
      "off-beat à¹„à¸¡à¹ˆà¸„à¸§à¸£à¸—à¸³à¹ƒà¸«à¹‰à¸•à¸±à¸§à¹€à¸£à¸²à¹‚à¸¢à¸à¸«à¸¥à¸¸à¸” à¹ƒà¸«à¹‰à¸£à¸¹à¹‰à¸ªà¸¶à¸à¹€à¸«à¸¡à¸·à¸­à¸™ Pulse à¸­à¸¢à¸¹à¹ˆà¹ƒà¸•à¹‰à¹€à¸—à¹‰à¸² à¸ªà¹ˆà¸§à¸™ Accent à¸­à¸¢à¸¹à¹ˆà¹ƒà¸™à¸¡à¸·à¸­",
      "à¸–à¹‰à¸²à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸§à¹ˆà¸²à¸•à¸±à¸§à¸à¸³à¸¥à¸±à¸‡à¸§à¸´à¹ˆà¸‡à¸•à¸²à¸¡à¸¡à¸·à¸­ à¹ƒà¸«à¹‰à¸à¸¥à¸±à¸šà¹„à¸› mute à¸ªà¸²à¸¢à¹à¸¥à¹‰à¸§à¸•à¸šà¹€à¸‰à¸žà¸²à¸° off-beat à¸à¹ˆà¸­à¸™"
    ],
    visual: {
      title: "à¹€à¸«à¹‡à¸™ Accent à¸šà¸™ off-beat",
      instruction: "à¸Šà¹ˆà¸­à¸‡à¸ªà¸µà¸ªà¹‰à¸¡à¸„à¸·à¸­ Accent à¸šà¸™ & à¸«à¸¥à¸±à¸‡ 2 à¹à¸¥à¸° & à¸«à¸¥à¸±à¸‡ 4 à¸ªà¹ˆà¸§à¸™à¸Šà¹ˆà¸­à¸‡à¹€à¸—à¸²à¸„à¸·à¸­ ghost/muted strum à¹€à¸šà¸² à¹†",
      duration: 4,
      steps: [
        { count: "1", action: "ghost", kind: "ghost" },
        { count: "&", action: "à¸žà¸±à¸", kind: "rest" },
        { count: "2", action: "ghost", kind: "ghost" },
        { count: "&", action: "Accent", kind: "accent" },
        { count: "3", action: "ghost", kind: "ghost" },
        { count: "&", action: "à¸žà¸±à¸", kind: "rest" },
        { count: "4", action: "ghost", kind: "ghost" },
        { count: "&", action: "Accent", kind: "accent" }
      ]
    },
    practice: [
      "à¹ƒà¸Šà¹‰à¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§à¸à¹ˆà¸­à¸™ à¹à¸¥à¹‰à¸§à¸•à¸µà¸¥à¸‡à¸šà¸™ 1 2 3 4",
      "à¹€à¸žà¸´à¹ˆà¸¡ Upstroke à¸—à¸µà¹ˆ & à¸«à¸¥à¸±à¸‡ 2 à¹à¸¥à¸° & à¸«à¸¥à¸±à¸‡ 4",
      "à¸¡à¸·à¸­à¸‚à¸§à¸²à¸•à¹‰à¸­à¸‡à¸‚à¸¢à¸±à¸šà¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡ à¹à¸¡à¹‰à¸šà¸²à¸‡à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸ˆà¸°à¹€à¸›à¹‡à¸™ ghost à¸«à¸£à¸·à¸­ muted strum",
      "à¸‹à¹‰à¸­à¸¡ 4 à¸«à¹‰à¸­à¸‡à¸—à¸µà¹ˆ 70 BPM à¹à¸¥à¹‰à¸§à¸„à¹ˆà¸­à¸¢à¸‚à¸¢à¸±à¸šà¹„à¸› 80 BPM à¸–à¹‰à¸²à¸¢à¸±à¸‡à¸™à¸´à¹ˆà¸‡à¸­à¸¢à¸¹à¹ˆ"
    ],
    quiz: [
      {
        question: "off-beat à¸„à¸·à¸­à¸­à¸°à¹„à¸£?",
        options: ["à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸„à¸±à¹ˆà¸™à¸£à¸°à¸«à¸§à¹ˆà¸²à¸‡ beat à¸«à¸¥à¸±à¸", "à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸—à¸µà¹ˆà¸”à¸±à¸‡à¸—à¸µà¹ˆà¸ªà¸¸à¸”à¹ƒà¸™à¸«à¹‰à¸­à¸‡", "à¸„à¸­à¸£à¹Œà¸”à¸ªà¸¸à¸”à¸—à¹‰à¸²à¸¢à¸‚à¸­à¸‡à¹€à¸žà¸¥à¸‡"],
        answer: 0
      },
      {
        question: "à¸—à¸³à¹„à¸¡ Syncopation à¸–à¸¶à¸‡à¸—à¸³à¹ƒà¸«à¹‰ Groove à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸”à¸µà¸‚à¸¶à¹‰à¸™?",
        options: ["à¹€à¸žà¸£à¸²à¸°à¹€à¸™à¹‰à¸™à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸„à¸²à¸”à¹„à¸¡à¹ˆà¸–à¸¶à¸‡ à¹à¸•à¹ˆ Pulse à¸¢à¸±à¸‡à¸™à¸´à¹ˆà¸‡à¸­à¸¢à¸¹à¹ˆ", "à¹€à¸žà¸£à¸²à¸°à¸—à¸³à¹ƒà¸«à¹‰ beat à¸«à¸¥à¸±à¸à¸«à¸²à¸¢à¹„à¸›", "à¹€à¸žà¸£à¸²à¸°à¸—à¸³à¹ƒà¸«à¹‰à¸—à¸¸à¸à¹‚à¸™à¹‰à¸•à¸”à¸±à¸‡à¹€à¸—à¹ˆà¸²à¸à¸±à¸™"],
        answer: 0
      },
      {
        question: "à¹ƒà¸™à¸à¸²à¸£à¸™à¸±à¸š 1 & 2 & à¸ˆà¸¸à¸”à¹„à¸«à¸™à¸„à¸·à¸­ off-beat?",
        options: ["&", "1", "2"],
        answer: 0
      },
      {
        question: "à¸•à¸­à¸™à¸¡à¸µ muted strum à¸¡à¸·à¸­à¸‚à¸§à¸²à¸„à¸§à¸£à¸—à¸³à¸­à¸°à¹„à¸£?",
        options: ["à¸‚à¸¢à¸±à¸šà¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡", "à¸«à¸¢à¸¸à¸”à¸™à¸´à¹ˆà¸‡à¹„à¸›à¹€à¸¥à¸¢", "à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸„à¸­à¸£à¹Œà¸”à¹à¸šà¸šà¸ªà¸¸à¹ˆà¸¡"],
        answer: 0
      },
      {
        question: "à¸ªà¸´à¹ˆà¸‡à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¸£à¸°à¸§à¸±à¸‡à¸—à¸µà¹ˆà¸ªà¸¸à¸”à¹€à¸§à¸¥à¸²à¹€à¸¥à¹ˆà¸™ Syncopation à¸„à¸·à¸­à¸­à¸°à¹„à¸£?",
        options: ["à¸«à¸¥à¸¸à¸”à¸ˆà¸²à¸ Pulse à¸«à¸¥à¸±à¸", "à¹€à¸¥à¹ˆà¸™à¹€à¸šà¸²à¹€à¸à¸´à¸™à¹„à¸›", "à¹ƒà¸Šà¹‰à¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§"],
        answer: 0
      }
    ],
    homework: [
      "à¸­à¸±à¸” 4 à¸«à¹‰à¸­à¸‡à¸—à¸µà¹ˆà¸¡à¸µ Accent à¸šà¸™ & à¸«à¸¥à¸±à¸‡ 2 à¹à¸¥à¸° & à¸«à¸¥à¸±à¸‡ 4 à¹‚à¸”à¸¢à¹ƒà¸«à¹‰à¹€à¸—à¹‰à¸²à¸¢à¸±à¸‡à¹€à¸„à¸²à¸° 1 2 3 4 à¸•à¸¥à¸­à¸”",
      "à¸Ÿà¸±à¸‡à¸¢à¹‰à¸­à¸™à¹à¸¥à¹‰à¸§à¸ˆà¸” 1 à¸ˆà¸¸à¸”à¸—à¸µà¹ˆ Pulse à¹€à¸£à¸´à¹ˆà¸¡à¸ªà¸±à¹ˆà¸™ à¹€à¸žà¸·à¹ˆà¸­à¹€à¸­à¸²à¸¡à¸²à¸‹à¹‰à¸­à¸¡à¸Šà¹‰à¸² à¹† à¸§à¸±à¸™à¸–à¸±à¸”à¹„à¸›"
    ]
  },
  {
    number: 3,
    title: "Dynamics & Palm Muting",
    summary: "à¸„à¸¸à¸¡à¸„à¸§à¸²à¸¡à¸”à¸±à¸‡ à¸„à¸§à¸²à¸¡à¸ªà¸±à¹‰à¸™à¸¢à¸²à¸§à¸‚à¸­à¸‡à¹€à¸ªà¸µà¸¢à¸‡ à¹à¸¥à¸°à¸­à¸²à¸£à¸¡à¸“à¹Œà¸‚à¸­à¸‡ Pattern à¸”à¹‰à¸§à¸¢à¸¡à¸·à¸­à¸‚à¸­à¸‡à¹€à¸£à¸²",
    youtube: {
      title: "à¸Ÿà¸±à¸‡à¸„à¸§à¸²à¸¡à¸•à¹ˆà¸²à¸‡à¸‚à¸­à¸‡ Dynamics à¹à¸¥à¸° Palm Mute",
      embedUrl: "https://www.youtube.com/embed?listType=search&list=guitar%20palm%20muting%20dynamics%20lesson"
    },
    learn: {
      targetBpm: "60-70 BPM",
      diagram: {
        title: "Palm Mute / Dynamic Levels",
        caption: "à¸à¸¶à¸à¹ƒà¸«à¹‰à¸¡à¸·à¸­à¸‚à¸§à¸²à¸—à¸³à¹„à¸”à¹‰à¸«à¸¥à¸²à¸¢à¸£à¸°à¸”à¸±à¸š: à¹€à¸šà¸², mute, à¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡, à¹à¸¥à¸° Accent à¹‚à¸”à¸¢ tempo à¹„à¸¡à¹ˆà¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™",
        cells: [
          { label: "à¹€à¸šà¸²", note: "soft", kind: "soft" },
          { label: "Mute", note: "à¸ªà¸±à¹‰à¸™", kind: "mute" },
          { label: "à¹€à¸›à¸´à¸”", note: "à¸¢à¸²à¸§", kind: "open" },
          { label: "Accent", note: "à¹€à¸”à¹ˆà¸™", kind: "accent" }
        ]
      },
      paragraphs: [
        "à¸«à¸¥à¸±à¸‡à¸”à¸¹à¸§à¸´à¸”à¸µà¹‚à¸­ à¹ƒà¸«à¹‰à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¸à¸µà¸•à¸²à¸£à¹Œà¹„à¸¡à¹ˆà¹„à¸”à¹‰à¸¡à¸µà¹à¸„à¹ˆà¸–à¸¹à¸à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸«à¸£à¸·à¸­à¸œà¸´à¸”à¸ˆà¸±à¸‡à¸«à¸§à¸° à¹à¸•à¹ˆà¸¢à¸±à¸‡à¸¡à¸µà¸™à¹‰à¸³à¸«à¸™à¸±à¸ à¸¡à¸µà¸„à¸§à¸²à¸¡à¸ªà¸±à¹‰à¸™à¸¢à¸²à¸§ à¹à¸¥à¸°à¸¡à¸µà¸­à¸²à¸£à¸¡à¸“à¹Œà¸‚à¸­à¸‡à¹€à¸ªà¸µà¸¢à¸‡à¸”à¹‰à¸§à¸¢ à¸™à¸µà¹ˆà¸„à¸·à¸­à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¸‚à¸­à¸‡ Dynamics à¹à¸¥à¸° Palm Mute",
        "Dynamics à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹à¸„à¹ˆ volume à¸”à¸±à¸‡à¸«à¸£à¸·à¸­à¹€à¸šà¸² à¹à¸•à¹ˆà¸¡à¸±à¸™à¸„à¸·à¸­ expression à¸§à¹ˆà¸²à¹€à¸£à¸²à¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¹ƒà¸«à¹‰à¸—à¹ˆà¸­à¸™à¸™à¸µà¹‰à¸žà¸¹à¸”à¹€à¸šà¸² à¹† à¸«à¸£à¸·à¸­à¸œà¸¥à¸±à¸à¹€à¸žà¸¥à¸‡à¹ƒà¸«à¹‰à¸«à¸™à¸±à¸à¸‚à¸¶à¹‰à¸™ à¸¡à¸·à¸­à¸‚à¸§à¸²à¸ˆà¸¶à¸‡à¸•à¹‰à¸­à¸‡à¸„à¸¸à¸¡à¹à¸£à¸‡à¹„à¸”à¹‰à¸«à¸¥à¸²à¸¢à¸£à¸°à¸”à¸±à¸š",
        "Palm Mute à¸„à¸·à¸­à¸à¸²à¸£à¹ƒà¸Šà¹‰à¸ªà¸±à¸™à¸¡à¸·à¸­à¸‚à¸§à¸²à¹à¸•à¸°à¸ªà¸²à¸¢à¹ƒà¸à¸¥à¹‰ bridge à¹€à¸žà¸·à¹ˆà¸­à¸—à¸³à¹ƒà¸«à¹‰à¹€à¸ªà¸µà¸¢à¸‡à¸ªà¸±à¹‰à¸™à¹à¸¥à¸°à¹à¸™à¹ˆà¸™à¸‚à¸¶à¹‰à¸™ à¹€à¸ªà¸µà¸¢à¸‡à¸—à¸µà¹ˆà¸ªà¸±à¹‰à¸™à¸¥à¸‡à¸Šà¹ˆà¸§à¸¢à¹ƒà¸«à¹‰ Groove à¸à¸£à¸°à¸Šà¸±à¸š à¹‚à¸”à¸¢à¹€à¸‰à¸žà¸²à¸°à¸•à¸­à¸™à¹€à¸¥à¹ˆà¸™à¸—à¹ˆà¸­à¸™ verse à¸«à¸£à¸·à¸­ rhythm à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¹„à¸¡à¹ˆà¸£à¸",
        "à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡à¸¡à¸·à¸­à¸ªà¸³à¸„à¸±à¸à¸¡à¸²à¸ à¸–à¹‰à¸²à¸§à¸²à¸‡à¹ƒà¸à¸¥à¹‰ bridge à¹€à¸à¸´à¸™à¹„à¸›à¹€à¸ªà¸µà¸¢à¸‡à¸ˆà¸°à¸¢à¸±à¸‡à¹€à¸›à¸´à¸”à¸¡à¸²à¸ à¸–à¹‰à¸²à¸§à¸²à¸‡à¸¥à¸¶à¸à¹€à¸‚à¹‰à¸²à¸¡à¸²à¸šà¸™à¸ªà¸²à¸¢à¸¡à¸²à¸à¹€à¸à¸´à¸™à¹„à¸›à¹€à¸ªà¸µà¸¢à¸‡à¸ˆà¸°à¸•à¸²à¸¢à¸ˆà¸™à¹„à¸¡à¹ˆà¸£à¸¹à¹‰à¸§à¹ˆà¸²à¹€à¸›à¹‡à¸™à¸„à¸­à¸£à¹Œà¸”à¸­à¸°à¹„à¸£ à¹ƒà¸«à¹‰à¸‚à¸¢à¸±à¸šà¸—à¸µà¸¥à¸°à¸™à¸´à¸”à¹à¸¥à¹‰à¸§à¸Ÿà¸±à¸‡à¸«à¸²à¸ˆà¸¸à¸”à¸à¸¥à¸²à¸‡",
        "Palm Mute à¸—à¸µà¹ˆà¸”à¸µà¸„à¸§à¸£à¸¢à¸±à¸‡à¸¡à¸µ pitch à¸Šà¸±à¸” à¸„à¸·à¸­à¸Ÿà¸±à¸‡à¸­à¸­à¸à¸§à¹ˆà¸²à¹€à¸›à¹‡à¸™à¸„à¸­à¸£à¹Œà¸”à¸«à¸£à¸·à¸­à¹‚à¸™à¹‰à¸•à¸­à¸°à¹„à¸£ à¹à¸•à¹ˆà¹€à¸ªà¸µà¸¢à¸‡à¸ªà¸±à¹‰à¸™à¸¥à¸‡à¹à¸¥à¸°à¹à¸™à¹ˆà¸™à¸‚à¸¶à¹‰à¸™ à¸–à¹‰à¸² mute à¸ˆà¸™à¹€à¸ªà¸µà¸¢à¸‡à¹€à¸«à¸¥à¸·à¸­à¹à¸„à¹ˆà¸•à¸¸à¸š à¹† à¸­à¸¢à¹ˆà¸²à¸‡à¹€à¸”à¸µà¸¢à¸§ à¹ƒà¸«à¹‰à¸œà¹ˆà¸­à¸™à¹à¸£à¸‡à¸¡à¸·à¸­à¸«à¸£à¸·à¸­à¸–à¸­à¸¢à¸à¸¥à¸±à¸šà¹„à¸›à¹ƒà¸à¸¥à¹‰ bridge",
        "à¹ƒà¸™à¸à¸²à¸£à¹€à¸¥à¹ˆà¸™à¹€à¸žà¸¥à¸‡à¸ˆà¸£à¸´à¸‡ à¹€à¸£à¸²à¸¡à¸±à¸à¹ƒà¸Šà¹‰ verse à¹ƒà¸«à¹‰à¹€à¸šà¸²à¸¥à¸‡à¸«à¸£à¸·à¸­ Palm Mute à¸¡à¸²à¸à¸‚à¸¶à¹‰à¸™ à¹€à¸žà¸·à¹ˆà¸­à¹€à¸§à¹‰à¸™à¸—à¸µà¹ˆà¹ƒà¸«à¹‰à¹€à¸ªà¸µà¸¢à¸‡à¸£à¹‰à¸­à¸‡ à¹à¸¥à¹‰à¸§à¸„à¹ˆà¸­à¸¢à¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¸«à¸™à¸±à¸à¸‚à¸¶à¹‰à¸™à¹ƒà¸™ chorus à¹€à¸žà¸·à¹ˆà¸­à¸ªà¸£à¹‰à¸²à¸‡ contrast à¹‚à¸”à¸¢ tempo à¸•à¹‰à¸­à¸‡à¹„à¸¡à¹ˆà¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™",
        "à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸™à¸µà¹‰à¹ƒà¸«à¹‰à¸„à¸´à¸”à¸§à¹ˆà¸²à¸¡à¸·à¸­à¸‚à¸§à¸²à¹€à¸›à¹‡à¸™à¸„à¸™à¹€à¸¥à¹ˆà¸²à¸­à¸²à¸£à¸¡à¸“à¹Œà¸‚à¸­à¸‡à¹€à¸žà¸¥à¸‡ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹à¸„à¹ˆà¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸•à¸µà¸„à¸­à¸£à¹Œà¸” à¸–à¹‰à¸²à¸„à¸¸à¸¡à¹€à¸šà¸² à¸”à¸±à¸‡ à¹€à¸›à¸´à¸” à¹à¸¥à¸° mute à¹„à¸”à¹‰ Groove à¸ˆà¸°à¸”à¸¹à¹€à¸›à¹‡à¸™à¹€à¸žà¸¥à¸‡à¸‚à¸¶à¹‰à¸™à¸—à¸±à¸™à¸—à¸µ"
      ],
      listenFor: [
        "à¹€à¸ªà¸µà¸¢à¸‡à¹€à¸šà¸²à¹à¸¥à¸°à¹€à¸ªà¸µà¸¢à¸‡à¸”à¸±à¸‡à¸¢à¸±à¸‡à¸­à¸¢à¸¹à¹ˆ tempo à¹€à¸”à¸µà¸¢à¸§à¸à¸±à¸™à¹„à¸«à¸¡ à¸«à¸£à¸·à¸­à¸žà¸­à¹€à¸¥à¹ˆà¸™à¸”à¸±à¸‡à¹à¸¥à¹‰à¸§à¹€à¸œà¸¥à¸­à¹€à¸£à¹ˆà¸‡",
        "Palm Mute à¸ªà¸±à¹‰à¸™à¹à¸¥à¸°à¹à¸™à¹ˆà¸™à¸‚à¸¶à¹‰à¸™ à¹à¸•à¹ˆà¸¢à¸±à¸‡à¹„à¸”à¹‰à¸¢à¸´à¸™ pitch à¸‚à¸­à¸‡à¸„à¸­à¸£à¹Œà¸”à¸Šà¸±à¸”à¸«à¸£à¸·à¸­à¹€à¸›à¸¥à¹ˆà¸²",
        "à¸•à¸­à¸™à¸ªà¸¥à¸±à¸š verse à¹€à¸šà¸²à¸à¸±à¸š chorus à¸«à¸™à¸±à¸ à¹€à¸žà¸¥à¸‡à¸¡à¸µ contrast à¸¡à¸²à¸à¸‚à¸¶à¹‰à¸™à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸à¸£à¸°à¹à¸—à¸à¹€à¸à¸´à¸™à¹„à¸›à¹„à¸«à¸¡"
      ],
      physicalFeel: [
        "à¸¡à¸·à¸­à¸‚à¸§à¸²à¸¡à¸µà¸™à¹‰à¸³à¸«à¸™à¸±à¸à¸«à¸¥à¸²à¸¢à¸£à¸°à¸”à¸±à¸š à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸¡à¸µà¹à¸„à¹ˆà¹€à¸šà¸²à¸ªà¸¸à¸”à¸à¸±à¸šà¹à¸£à¸‡à¸ªà¸¸à¸”",
        "à¸ªà¸±à¸™à¸¡à¸·à¸­à¹à¸•à¸°à¸ªà¸²à¸¢à¹ƒà¸à¸¥à¹‰ bridge à¹à¸šà¸šà¸§à¸²à¸‡à¹€à¸šà¸² à¹† à¹„à¸¡à¹ˆà¸à¸”à¸ˆà¸™à¸ªà¸²à¸¢à¸•à¸²à¸¢",
        "à¹à¸‚à¸™à¸¢à¸±à¸‡à¹à¸à¸§à¹ˆà¸‡à¸•à¸²à¸¡ Pulse à¹€à¸”à¸´à¸¡ à¸–à¸¶à¸‡à¹à¸¡à¹‰à¹€à¸ªà¸µà¸¢à¸‡à¸ˆà¸°à¸ªà¸±à¹‰à¸™à¸¥à¸‡à¸«à¸£à¸·à¸­à¸”à¸±à¸‡à¸‚à¸¶à¹‰à¸™"
      ],
      guitarApplication: [
        "à¹€à¸¥à¹ˆà¸™à¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§ 4 à¸«à¹‰à¸­à¸‡à¹à¸šà¸šà¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¹€à¸•à¹‡à¸¡ à¹à¸¥à¹‰à¸§à¹€à¸¥à¹ˆà¸™à¸­à¸µà¸ 4 à¸«à¹‰à¸­à¸‡à¸”à¹‰à¸§à¸¢ Palm Mute à¹€à¸žà¸·à¹ˆà¸­à¹€à¸—à¸µà¸¢à¸š texture",
        "à¸¥à¸­à¸‡à¸§à¸²à¸‡ Palm Mute à¹ƒà¸à¸¥à¹‰ bridge à¹à¸¥à¹‰à¸§à¸„à¹ˆà¸­à¸¢ à¹† à¸‚à¸¢à¸±à¸šà¹€à¸‚à¹‰à¸²à¸«à¸²à¸ªà¸²à¸¢ à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¸ˆà¸¸à¸”à¹„à¸«à¸™à¸¢à¸±à¸‡à¸Šà¸±à¸”à¹à¸¥à¸°à¹à¸™à¹ˆà¸™à¸—à¸µà¹ˆà¸ªà¸¸à¸”",
        "à¸‹à¹‰à¸­à¸¡ verse à¹€à¸šà¸² 4 à¸«à¹‰à¸­à¸‡ à¹à¸¥à¹‰à¸§ chorus à¸«à¸™à¸±à¸ 4 à¸«à¹‰à¸­à¸‡ à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™ BPM"
      ],
      guidedSteps: [
        "à¸£à¸­à¸šà¹à¸£à¸ à¹€à¸¥à¹ˆà¸™à¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§à¹à¸šà¸šà¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¹€à¸•à¹‡à¸¡ 4 à¸«à¹‰à¸­à¸‡ à¸Ÿà¸±à¸‡à¹ƒà¸«à¹‰à¸£à¸¹à¹‰à¸§à¹ˆà¸²à¹€à¸ªà¸µà¸¢à¸‡à¸¢à¸²à¸§à¹à¸¥à¸°à¸à¹‰à¸­à¸‡à¹à¸„à¹ˆà¹„à¸«à¸™à¸à¹ˆà¸­à¸™",
        "à¸£à¸­à¸šà¸ªà¸­à¸‡ à¸§à¸²à¸‡à¸ªà¸±à¸™à¸¡à¸·à¸­à¹ƒà¸à¸¥à¹‰ bridge à¹à¸šà¸šà¹à¸•à¸°à¹€à¸šà¸² à¹† à¹à¸¥à¹‰à¸§à¹€à¸¥à¹ˆà¸™à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸”à¸´à¸¡ à¸–à¹‰à¸²à¹€à¸ªà¸µà¸¢à¸‡à¸¢à¸±à¸‡à¸¢à¸²à¸§à¸¡à¸²à¸à¹ƒà¸«à¹‰à¸‚à¸¢à¸±à¸šà¹€à¸‚à¹‰à¸²à¸¡à¸²à¸™à¸´à¸”à¹€à¸”à¸µà¸¢à¸§",
        "à¸£à¸­à¸šà¸ªà¸²à¸¡ à¸–à¹‰à¸²à¹€à¸ªà¸µà¸¢à¸‡à¸•à¸²à¸¢à¸ˆà¸™à¹„à¸¡à¹ˆà¸£à¸¹à¹‰à¸„à¸­à¸£à¹Œà¸” à¹ƒà¸«à¹‰à¸–à¸­à¸¢à¸¡à¸·à¸­à¸à¸¥à¸±à¸šà¹„à¸›à¸—à¸²à¸‡ bridge à¹à¸¥à¸°à¸¥à¸”à¸™à¹‰à¸³à¸«à¸™à¸±à¸à¸¡à¸·à¸­ à¸­à¸¢à¹ˆà¸²à¸à¸”à¸ªà¸²à¸¢à¸¥à¸‡à¹„à¸›",
        "à¸£à¸­à¸šà¸ªà¸µà¹ˆ à¹€à¸¥à¹ˆà¸™à¹€à¸šà¸² 2 à¸«à¹‰à¸­à¸‡ à¹à¸¥à¹‰à¸§à¹€à¸›à¸´à¸”à¹ƒà¸«à¹‰à¸«à¸™à¸±à¸à¸‚à¸¶à¹‰à¸™ 2 à¸«à¹‰à¸­à¸‡ à¹‚à¸”à¸¢ Metronome à¸•à¹‰à¸­à¸‡à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸­à¸¢à¸¹à¹ˆà¸—à¸µà¹ˆà¹€à¸”à¸´à¸¡ à¹„à¸¡à¹ˆà¸–à¸¹à¸à¸¡à¸·à¸­à¸‚à¸§à¸²à¸”à¸±à¸™à¹€à¸£à¹‡à¸§à¸‚à¸¶à¹‰à¸™",
        "à¸£à¸­à¸šà¸ªà¸¸à¸”à¸—à¹‰à¸²à¸¢ à¸¥à¸­à¸‡à¸„à¸´à¸”à¹€à¸›à¹‡à¸™à¹€à¸žà¸¥à¸‡à¸ˆà¸£à¸´à¸‡: verse à¹ƒà¸Šà¹‰ Palm Mute à¹€à¸šà¸² à¹† à¹à¸¥à¹‰à¸§ chorus à¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¸¡à¸²à¸à¸‚à¸¶à¹‰à¸™ à¹ƒà¸«à¹‰à¸„à¸§à¸²à¸¡à¸•à¹ˆà¸²à¸‡à¹€à¸à¸´à¸”à¸ˆà¸²à¸à¸¡à¸·à¸­ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸ˆà¸²à¸à¸à¸²à¸£à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™ tempo"
      ],
      correctionSteps: [
        "à¸–à¹‰à¸²à¹€à¸¥à¹ˆà¸™à¸”à¸±à¸‡à¹à¸¥à¹‰à¸§à¹€à¸£à¹‡à¸§à¸‚à¸¶à¹‰à¸™ à¹ƒà¸«à¹‰à¸¥à¸”à¹à¸£à¸‡ pick à¸¥à¸‡à¸„à¸£à¸¶à¹ˆà¸‡à¸«à¸™à¸¶à¹ˆà¸‡à¹à¸¥à¹‰à¸§à¹€à¸›à¸´à¸” Metronome à¸”à¸±à¸‡à¸‚à¸¶à¹‰à¸™à¹ƒà¸™à¸«à¸¹",
        "à¸–à¹‰à¸² Palm Mute à¸—à¸¶à¸šà¹€à¸à¸´à¸™ à¹ƒà¸«à¹‰à¸‚à¸¢à¸±à¸šà¸¡à¸·à¸­à¸à¸¥à¸±à¸šà¹„à¸›à¹ƒà¸à¸¥à¹‰ bridge à¹à¸¥à¸°à¹€à¸Šà¹‡à¸à¸§à¹ˆà¸²à¸¢à¸±à¸‡à¸Ÿà¸±à¸‡à¸­à¸­à¸à¸§à¹ˆà¸²à¹€à¸›à¹‡à¸™à¸„à¸­à¸£à¹Œà¸”à¸­à¸°à¹„à¸£",
        "à¸–à¹‰à¸²à¸ªà¸¥à¸±à¸š open à¸à¸±à¸š muted à¹à¸¥à¹‰à¸§à¸ªà¸°à¸”à¸¸à¸” à¹ƒà¸«à¹‰à¸‹à¹‰à¸­à¸¡à¹€à¸‰à¸žà¸²à¸°à¸¡à¸·à¸­à¸‚à¸§à¸²à¸šà¸™à¸ªà¸²à¸¢ mute à¸à¹ˆà¸­à¸™ à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸„à¸­à¸£à¹Œà¸”"
      ],
      dailySelfCheck: [
        "à¸—à¸³ Palm Mute à¹ƒà¸«à¹‰à¹€à¸ªà¸µà¸¢à¸‡à¸ªà¸±à¹‰à¸™à¹à¸•à¹ˆà¸¢à¸±à¸‡à¸Šà¸±à¸” à¹„à¸¡à¹ˆà¸•à¸²à¸¢à¹€à¸›à¹‡à¸™à¹€à¸ªà¸µà¸¢à¸‡à¸—à¸¶à¸š",
        "à¸„à¸¸à¸¡ soft à¹à¸¥à¸° loud dynamics à¹ƒà¸«à¹‰à¸•à¹ˆà¸²à¸‡à¸à¸±à¸™à¸ˆà¸£à¸´à¸‡à¹‚à¸”à¸¢ tempo à¹„à¸¡à¹ˆà¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™",
        "à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸ˆà¸²à¸à¹€à¸šà¸²à¹„à¸›à¸”à¸±à¸‡ à¸«à¸£à¸·à¸­ mute à¹„à¸› open à¹à¸¥à¹‰à¸§à¸¢à¸±à¸‡à¸£à¸±à¸à¸©à¸² Groove à¹„à¸”à¹‰"
      ],
      troubleshooting: [
        {
          problem: "Palm Mute sounds dead",
          advice: "à¸‚à¸¢à¸±à¸šà¸ªà¸±à¸™à¸¡à¸·à¸­à¸‚à¸§à¸²à¹„à¸›à¸—à¸²à¸‡ bridge à¸—à¸µà¸¥à¸°à¸™à¸´à¸” à¹à¸¥à¸°à¸¥à¸”à¹à¸£à¸‡à¸à¸” à¹ƒà¸«à¹‰à¹€à¸ªà¸µà¸¢à¸‡à¸ªà¸±à¹‰à¸™à¸¥à¸‡à¹à¸•à¹ˆà¸¢à¸±à¸‡à¸Ÿà¸±à¸‡à¸­à¸­à¸à¸§à¹ˆà¸²à¹€à¸›à¹‡à¸™à¸„à¸­à¸£à¹Œà¸”"
        },
        {
          problem: "à¸¡à¸µ fret buzz à¸«à¸£à¸·à¸­à¹€à¸ªà¸µà¸¢à¸‡à¹à¸›à¹Šà¸à¸•à¸­à¸™à¹€à¸¥à¹ˆà¸™à¹€à¸šà¸²",
          advice: "à¹€à¸Šà¹‡à¸à¸¡à¸·à¸­à¸‹à¹‰à¸²à¸¢à¸à¹ˆà¸­à¸™ à¸à¸”à¹ƒà¸«à¹‰à¸Šà¸±à¸”à¸žà¸­à¸”à¸µ à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¹à¸à¹‰à¸”à¹‰à¸§à¸¢à¸à¸²à¸£à¸•à¸µà¹à¸£à¸‡à¸‚à¸¶à¹‰à¸™ à¹€à¸žà¸£à¸²à¸°à¹€à¸£à¸²à¸à¸³à¸¥à¸±à¸‡à¸à¸¶à¸ Dynamics à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸à¸·à¸™ volume"
        },
        {
          problem: "à¹€à¸ªà¸µà¸¢à¸‡à¹€à¸šà¸²/à¸”à¸±à¸‡à¹„à¸¡à¹ˆà¹€à¸—à¹ˆà¸²à¸à¸±à¸™à¸ˆà¸™ Groove à¹à¸à¸§à¹ˆà¸‡",
          advice: "à¸‹à¹‰à¸­à¸¡à¸—à¸µà¸¥à¸° 4 à¸«à¹‰à¸­à¸‡à¸”à¹‰à¸§à¸¢à¸£à¸°à¸”à¸±à¸šà¹€à¸”à¸µà¸¢à¸§à¸à¹ˆà¸­à¸™ à¹à¸¥à¹‰à¸§à¸„à¹ˆà¸­à¸¢à¹€à¸žà¸´à¹ˆà¸¡ Accent à¹à¸„à¹ˆà¸ˆà¸¸à¸”à¹€à¸”à¸µà¸¢à¸§ à¸­à¸¢à¹ˆà¸²à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸—à¸¸à¸à¸­à¸¢à¹ˆà¸²à¸‡à¸žà¸£à¹‰à¸­à¸¡à¸à¸±à¸™"
        }
      ],
      miniExample: "à¹ƒà¸Šà¹‰à¸„à¸­à¸£à¹Œà¸” Em à¹€à¸¥à¹ˆà¸™ 1 & 2 & 3 & 4 & à¹à¸šà¸š Palm Mute à¹€à¸šà¸² à¹† 2 à¸«à¹‰à¸­à¸‡ à¹à¸¥à¹‰à¸§à¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¹€à¸•à¹‡à¸¡à¸žà¸£à¹‰à¸­à¸¡ Accent à¸šà¸™ 4 à¹ƒà¸™à¸«à¹‰à¸­à¸‡à¸–à¸±à¸”à¹„à¸›",
      commonMistakes: [
        "à¹€à¸¥à¹ˆà¸™à¸”à¸±à¸‡à¹à¸¥à¹‰à¸§ tempo à¹€à¸£à¹‡à¸§à¸‚à¸¶à¹‰à¸™ à¹€à¸žà¸£à¸²à¸°à¸¡à¸·à¸­à¸‚à¸§à¸²à¹ƒà¸Šà¹‰à¹à¸£à¸‡à¸¡à¸²à¸à¹€à¸à¸´à¸™",
        "à¸§à¸²à¸‡ Palm Mute à¸¥à¸¶à¸à¹€à¸à¸´à¸™à¸ˆà¸™à¹€à¸ªà¸µà¸¢à¸‡à¸•à¸²à¸¢à¹à¸¥à¸°à¸Ÿà¸±à¸‡à¹„à¸¡à¹ˆà¸­à¸­à¸à¸§à¹ˆà¸²à¹€à¸›à¹‡à¸™à¸„à¸­à¸£à¹Œà¸”à¸­à¸°à¹„à¸£",
        "à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸ˆà¸²à¸ muted à¹€à¸›à¹‡à¸™ open à¹à¸¥à¹‰à¸§à¸¡à¸·à¸­à¸‚à¸§à¸²à¸«à¸¢à¸¸à¸”à¸«à¸£à¸·à¸­à¸ªà¸°à¸”à¸¸à¸” à¸—à¸³à¹ƒà¸«à¹‰ Groove à¸‚à¸²à¸”"
      ],
      selfCheck: [
        "à¸­à¸±à¸”à¹€à¸ªà¸µà¸¢à¸‡à¹à¸¥à¹‰à¸§à¸Ÿà¸±à¸‡à¸§à¹ˆà¸² open à¸à¸±à¸š Palm Mute à¸•à¹ˆà¸²à¸‡à¸à¸±à¸™à¸Šà¸±à¸” à¹à¸•à¹ˆ tempo à¹„à¸¡à¹ˆà¹à¸à¸§à¹ˆà¸‡",
        "à¸Ÿà¸±à¸‡à¸­à¸­à¸à¸§à¹ˆà¸²à¸¢à¸±à¸‡à¹€à¸›à¹‡à¸™à¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸´à¸¡à¹à¸¡à¹‰à¸ˆà¸° Palm Mute à¸­à¸¢à¸¹à¹ˆ",
        "à¹€à¸¥à¹ˆà¸™ verse à¹€à¸šà¸²à¹à¸¥à¸° chorus à¸«à¸™à¸±à¸à¹„à¸”à¹‰à¹‚à¸”à¸¢ Metronome à¸¢à¸±à¸‡à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸­à¸¢à¸¹à¹ˆà¸à¸¥à¸²à¸‡à¹€à¸ªà¸µà¸¢à¸‡ à¹„à¸¡à¹ˆà¸–à¸¹à¸à¸¡à¸·à¸­à¸‚à¸§à¸²à¸”à¸±à¸™à¸«à¸™à¸µ"
      ],
      teacherNote: "à¸„à¸£à¸¹à¹à¸™à¸°à¸™à¸³à¹ƒà¸«à¹‰à¸«à¸²à¸ˆà¸¸à¸” Palm Mute à¸‚à¸­à¸‡à¸à¸µà¸•à¸²à¸£à¹Œà¸•à¸±à¸§à¹€à¸­à¸‡à¸ˆà¸£à¸´à¸‡ à¹† à¹€à¸žà¸£à¸²à¸°à¸à¸µà¸•à¸²à¸£à¹Œà¹à¸•à¹ˆà¸¥à¸°à¸•à¸±à¸§à¸•à¸­à¸šà¸ªà¸™à¸­à¸‡à¹„à¸¡à¹ˆà¹€à¸«à¸¡à¸·à¸­à¸™à¸à¸±à¸™ à¹ƒà¸Šà¹‰à¸«à¸¹à¸Ÿà¸±à¸‡à¸¡à¸²à¸à¸à¸§à¹ˆà¸²à¸ˆà¸³à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡à¸ˆà¸²à¸à¸£à¸¹à¸›"
    },
    earTraining: {
      title: "à¸Ÿà¸±à¸‡ contrast à¸‚à¸­à¸‡ Dynamics",
      instruction: "à¸Ÿà¸±à¸‡à¹à¸„à¹ˆ rhythm, à¸„à¸§à¸²à¸¡à¸ªà¸±à¹‰à¸™à¸¢à¸²à¸§ à¹à¸¥à¸°à¸„à¸§à¸²à¸¡à¸•à¹ˆà¸²à¸‡à¸‚à¸­à¸‡à¹€à¸šà¸²/à¸”à¸±à¸‡ à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸ªà¸™à¹ƒà¸ˆà¸Šà¸·à¹ˆà¸­à¸„à¸­à¸£à¹Œà¸”",
      examples: [
        {
          label: "à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡ A",
          description: "à¸—à¸¸à¸ strum à¸”à¸±à¸‡à¹ƒà¸à¸¥à¹‰ à¹† à¸à¸±à¸™à¸«à¸¡à¸” à¸—à¹ˆà¸­à¸™ verse à¸à¸±à¸š chorus à¹€à¸¥à¸¢à¸£à¸¹à¹‰à¸ªà¸¶à¸à¹à¸šà¸™à¹à¸¥à¸°à¹„à¸¡à¹ˆà¸¡à¸µà¹à¸£à¸‡à¸¢à¸"
        },
        {
          label: "à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡ B",
          description: "à¸—à¹ˆà¸­à¸™à¹à¸£à¸ Palm Mute à¹€à¸šà¸²à¹à¸¥à¸°à¸ªà¸±à¹‰à¸™ à¸žà¸­à¹€à¸‚à¹‰à¸²à¸Šà¹ˆà¸§à¸‡à¸–à¸±à¸”à¹„à¸›à¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¹à¸¥à¸° Accent à¸Šà¸±à¸”à¸‚à¸¶à¹‰à¸™"
        }
      ],
      question: "à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡à¹„à¸«à¸™à¸¡à¸µ dynamic contrast à¸Šà¸±à¸”à¸à¸§à¹ˆà¸²?",
      hint: "à¸–à¹‰à¸²à¸Ÿà¸±à¸‡à¹à¸¥à¹‰à¸§à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸§à¹ˆà¸²à¹€à¸žà¸¥à¸‡à¸¡à¸µà¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¹€à¸šà¸²à¹à¸¥à¸°à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸¢à¸à¸‚à¸¶à¹‰à¸™ à¸™à¸±à¹ˆà¸™à¸„à¸·à¸­à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡à¸—à¸µà¹ˆ contrast à¸”à¸µà¸à¸§à¹ˆà¸²"
    },
    hear: [
      "à¸Ÿà¸±à¸‡à¸„à¸§à¸²à¸¡à¸•à¹ˆà¸²à¸‡à¸£à¸°à¸«à¸§à¹ˆà¸²à¸‡à¹€à¸ªà¸µà¸¢à¸‡à¹€à¸›à¸´à¸”à¹€à¸•à¹‡à¸¡à¸à¸±à¸šà¹€à¸ªà¸µà¸¢à¸‡ Palm Mute à¹€à¸ªà¸µà¸¢à¸‡à¹€à¸›à¸´à¸”à¸ˆà¸°à¸¢à¸²à¸§à¸à¸§à¹ˆà¸² à¸ªà¹ˆà¸§à¸™ Palm Mute à¸ˆà¸°à¸ªà¸±à¹‰à¸™à¹à¸¥à¸°à¹à¸™à¹ˆà¸™à¸à¸§à¹ˆà¸²",
      "à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¹€à¸ªà¸µà¸¢à¸‡à¹€à¸šà¸²à¹à¸¥à¸°à¹€à¸ªà¸µà¸¢à¸‡à¸”à¸±à¸‡à¸¢à¸±à¸‡à¸­à¸¢à¸¹à¹ˆ tempo à¹€à¸”à¸µà¸¢à¸§à¸à¸±à¸™à¹„à¸«à¸¡ à¸«à¸¥à¸²à¸¢à¸„à¸™à¸žà¸­à¹€à¸¥à¹ˆà¸™à¸”à¸±à¸‡à¹à¸¥à¹‰à¸§à¸ˆà¸°à¹€à¸œà¸¥à¸­à¹€à¸£à¹ˆà¸‡",
      "à¹€à¸ªà¸µà¸¢à¸‡ Palm Mute à¸—à¸µà¹ˆà¸”à¸µà¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹€à¸ªà¸µà¸¢à¸‡à¸—à¸¶à¸šà¸ˆà¸™à¹„à¸¡à¹ˆà¸£à¸¹à¹‰à¸„à¸­à¸£à¹Œà¸” à¹à¸•à¹ˆà¹€à¸›à¹‡à¸™à¹€à¸ªà¸µà¸¢à¸‡à¸ªà¸±à¹‰à¸™à¸—à¸µà¹ˆà¸¢à¸±à¸‡à¸¡à¸µ pitch à¸Šà¸±à¸”"
    ],
    feel: [
      "à¸¡à¸·à¸­à¸‚à¸§à¸²à¸„à¸§à¸£à¸£à¸¹à¹‰à¸ªà¸¶à¸à¹€à¸«à¸¡à¸·à¸­à¸™à¸¡à¸µà¸™à¹‰à¸³à¸«à¸™à¸±à¸ 3 à¸£à¸°à¸”à¸±à¸š: à¹€à¸šà¸², à¸›à¸à¸•à¸´, à¸”à¸±à¸‡ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸•à¸µà¹à¸£à¸‡à¸­à¸¢à¹ˆà¸²à¸‡à¹€à¸”à¸µà¸¢à¸§",
      "Palm Mute à¹ƒà¸«à¹‰à¸ªà¸±à¸™à¸¡à¸·à¸­à¹à¸•à¸°à¸ªà¸²à¸¢à¹€à¸šà¸² à¹† à¹ƒà¸à¸¥à¹‰ bridge à¸–à¹‰à¸²à¸à¸”à¸«à¸™à¸±à¸à¹€à¸à¸´à¸™à¹„à¸›à¹€à¸ªà¸µà¸¢à¸‡à¸ˆà¸°à¸•à¸²à¸¢",
      "à¹€à¸§à¸¥à¸²à¸ªà¸¥à¸±à¸š open à¸à¸±à¸š muted à¹ƒà¸«à¹‰à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸§à¹ˆà¸²à¹€à¸›à¹‡à¸™à¸à¸²à¸£à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¹€à¸ªà¸µà¸¢à¸‡ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™ tempo"
    ],
    visual: {
      title: "à¹€à¸«à¹‡à¸™à¸„à¸§à¸²à¸¡à¸•à¹ˆà¸²à¸‡à¸‚à¸­à¸‡ Open, Palm Mute à¹à¸¥à¸° Accent",
      instruction: "à¸Šà¹ˆà¸­à¸‡à¸™à¹‰à¸³à¹€à¸‡à¸´à¸™à¸„à¸·à¸­à¹€à¸¥à¹ˆà¸™à¹€à¸šà¸² à¸Šà¹ˆà¸­à¸‡à¹€à¸—à¸²à¸„à¸·à¸­ Palm Mute à¸Šà¹ˆà¸­à¸‡à¸ªà¹‰à¸¡à¸„à¸·à¸­ Accent à¸—à¸µà¹ˆà¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¸Šà¸±à¸”à¸‚à¸¶à¹‰à¸™",
      duration: 4,
      steps: [
        { count: "1", action: "à¹€à¸šà¸²", kind: "soft" },
        { count: "&", action: "à¹€à¸šà¸²", kind: "soft" },
        { count: "2", action: "Mute", kind: "mute" },
        { count: "&", action: "Mute", kind: "mute" },
        { count: "3", action: "à¹€à¸›à¸´à¸”", kind: "open" },
        { count: "&", action: "à¸žà¸±à¸", kind: "rest" },
        { count: "4", action: "Accent", kind: "accent" },
        { count: "&", action: "Mute", kind: "mute" }
      ]
    },
    practice: [
      "à¹€à¸¥à¹ˆà¸™ 4 à¸«à¹‰à¸­à¸‡à¹à¸šà¸šà¹€à¸šà¸²à¹à¸¥à¸°à¸›à¸¥à¹ˆà¸­à¸¢à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”à¹ƒà¸«à¹‰à¹€à¸›à¸´à¸”",
      "à¹€à¸¥à¹ˆà¸™ 4 à¸«à¹‰à¸­à¸‡à¹à¸šà¸š Palm Mute à¹ƒà¸«à¹‰à¹€à¸ªà¸µà¸¢à¸‡à¸ªà¸±à¹‰à¸™à¸¥à¸‡",
      "à¹€à¸¥à¹ˆà¸™ 4 à¸«à¹‰à¸­à¸‡à¹à¸šà¸šà¸”à¸±à¸‡à¸‚à¸¶à¹‰à¸™à¹‚à¸”à¸¢à¹„à¸¡à¹ˆ Palm Mute",
      "à¸—à¸±à¹‰à¸‡à¸ªà¸²à¸¡à¹à¸šà¸šà¸•à¹‰à¸­à¸‡à¸­à¸¢à¸¹à¹ˆ tempo à¹€à¸”à¸´à¸¡ à¹€à¸›à¹‰à¸²à¸«à¸¡à¸²à¸¢à¸„à¸·à¸­à¸„à¸¸à¸¡à¸¡à¸·à¸­ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸„à¸§à¸²à¸¡à¹€à¸£à¹‡à¸§"
    ],
    quiz: [
      {
        question: "Dynamics à¸„à¸·à¸­à¸­à¸°à¹„à¸£?",
        options: ["à¸à¸²à¸£à¸„à¸§à¸šà¸„à¸¸à¸¡à¹€à¸šà¸²-à¸”à¸±à¸‡", "à¸à¸²à¸£à¸•à¸±à¹‰à¸‡à¸„à¹ˆà¸² distortion à¹€à¸—à¹ˆà¸²à¸™à¸±à¹‰à¸™", "à¸£à¸¹à¸›à¹à¸šà¸šà¸ªà¹€à¸à¸¥"],
        answer: 0
      },
      {
        question: "Palm Mute à¸›à¸à¸•à¸´à¸§à¸²à¸‡à¸ªà¸±à¸™à¸¡à¸·à¸­à¸‚à¸§à¸²à¹à¸–à¸§à¹„à¸«à¸™?",
        options: ["à¹ƒà¸à¸¥à¹‰ bridge", "à¸šà¸™ headstock", "à¸—à¸±à¸šà¸¡à¸·à¸­à¸‹à¹‰à¸²à¸¢"],
        answer: 0
      },
      {
        question: "Palm Mute à¸—à¸µà¹ˆà¸”à¸µà¸„à¸§à¸£à¹ƒà¸«à¹‰à¸œà¸¥à¹à¸šà¸šà¹„à¸«à¸™?",
        options: ["à¹€à¸ªà¸µà¸¢à¸‡à¸ªà¸±à¹‰à¸™à¸¥à¸‡ à¹à¸•à¹ˆ pitch à¸¢à¸±à¸‡à¸Šà¸±à¸”", "à¸—à¸³à¹ƒà¸«à¹‰à¸—à¸¸à¸à¹‚à¸™à¹‰à¸•à¹€à¸‡à¸µà¸¢à¸šà¸ªà¸™à¸´à¸—", "à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸Šà¸·à¹ˆà¸­à¸„à¸­à¸£à¹Œà¸”"],
        answer: 0
      },
      {
        question: "à¹€à¸§à¸¥à¸²à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™ Dynamics à¸ªà¸´à¹ˆà¸‡à¸—à¸µà¹ˆà¸„à¸§à¸£à¸™à¸´à¹ˆà¸‡à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸”à¸´à¸¡à¸„à¸·à¸­à¸­à¸°à¹„à¸£?",
        options: ["Tempo", "à¸„à¸µà¸¢à¹Œà¹€à¸žà¸¥à¸‡à¹€à¸—à¹ˆà¸²à¸™à¸±à¹‰à¸™", "à¸ªà¸µà¸‚à¸­à¸‡ pick"],
        answer: 0
      },
      {
        question: "à¸—à¸³à¹„à¸¡à¸—à¹ˆà¸­à¸™ verse à¸¡à¸±à¸à¹€à¸¥à¹ˆà¸™à¹€à¸šà¸²à¸¥à¸‡?",
        options: ["à¹€à¸žà¸·à¹ˆà¸­à¹€à¸§à¹‰à¸™à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¹à¸¥à¸°à¸ªà¸£à¹‰à¸²à¸‡ contrast", "à¹€à¸žà¸·à¹ˆà¸­à¸‹à¹ˆà¸­à¸™ Pulse", "à¹€à¸žà¸·à¹ˆà¸­à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸™à¸±à¸š"],
        answer: 0
      }
    ],
    homework: [
      "à¸­à¸±à¸”à¹€à¸›à¸£à¸µà¸¢à¸šà¹€à¸—à¸µà¸¢à¸š open, Palm Mute, à¹à¸¥à¸° Accent à¸­à¸¢à¹ˆà¸²à¸‡à¸¥à¸° 4 à¸«à¹‰à¸­à¸‡ à¹‚à¸”à¸¢à¹ƒà¸Šà¹‰ tempo à¹€à¸”à¸µà¸¢à¸§à¸à¸±à¸™",
      "à¸ˆà¸”à¸§à¹ˆà¸²à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡à¸ªà¸±à¸™à¸¡à¸·à¸­à¸‚à¸§à¸²à¸•à¸£à¸‡à¹„à¸«à¸™à¹ƒà¸«à¹‰à¹€à¸ªà¸µà¸¢à¸‡ Palm Mute à¸Šà¸±à¸”à¸—à¸µà¹ˆà¸ªà¸¸à¸”à¸ªà¸³à¸«à¸£à¸±à¸šà¸à¸µà¸•à¸²à¸£à¹Œà¸‚à¸­à¸‡à¹€à¸£à¸²"
    ]
  },
  {
    number: 4,
    title: "Groove Integration",
    summary: "à¸£à¸§à¸¡ Pulse, Syncopation, Dynamics à¹à¸¥à¸° Palm Mute à¹ƒà¸«à¹‰à¸à¸¥à¸²à¸¢à¹€à¸›à¹‡à¸™ Groove à¸—à¸µà¹ˆà¹€à¸¥à¹ˆà¸™à¹„à¸”à¹‰à¸ˆà¸£à¸´à¸‡",
    youtube: {
      title: "à¸Ÿà¸±à¸‡à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡ Groove à¸à¹ˆà¸­à¸™à¸£à¸§à¸¡à¸—à¸¸à¸à¸­à¸¢à¹ˆà¸²à¸‡à¹€à¸‚à¹‰à¸²à¸”à¹‰à¸§à¸¢à¸à¸±à¸™",
      embedUrl: "https://www.youtube.com/embed?listType=search&list=guitar%20rhythm%20groove%20integration%20backing%20track"
    },
    learn: {
      targetBpm: "70-75 BPM",
      diagram: {
        title: "Groove Pattern: à¸£à¸§à¸¡ mute, open à¹à¸¥à¸° Accent",
        caption: "à¹ƒà¸«à¹‰ Pulse à¹€à¸”à¸´à¸™à¸à¹ˆà¸­à¸™ à¹à¸¥à¹‰à¸§à¸„à¹ˆà¸­à¸¢à¹€à¸•à¸´à¸¡ texture à¸—à¸µà¸¥à¸°à¸ˆà¸¸à¸” à¸­à¸¢à¹ˆà¸²à¹ƒà¸ªà¹ˆà¸—à¸¸à¸à¸­à¸¢à¹ˆà¸²à¸‡à¸ˆà¸™ Groove à¸«à¸™à¸±à¸à¹€à¸à¸´à¸™",
        cells: [
          { label: "1", note: "Mute", kind: "mute" },
          { label: "e", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "&", note: "Mute", kind: "mute" },
          { label: "a", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "2", note: "Mute", kind: "mute" },
          { label: "e", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "&", note: "Accent", kind: "accent" },
          { label: "a", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "3", note: "à¹€à¸›à¸´à¸”", kind: "open" },
          { label: "e", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "&", note: "à¹€à¸›à¸´à¸”", kind: "open" },
          { label: "a", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "4", note: "à¹€à¸›à¸´à¸”", kind: "open" },
          { label: "e", note: "à¸™à¸±à¸š", kind: "rest" },
          { label: "&", note: "Accent", kind: "accent" },
          { label: "a", note: "à¸ˆà¸š", kind: "hit" }
        ]
      },
      paragraphs: [
        "à¸«à¸¥à¸±à¸‡à¸”à¸¹à¸§à¸´à¸”à¸µà¹‚à¸­ à¹ƒà¸«à¹‰à¸Ÿà¸±à¸‡à¸ à¸²à¸žà¸£à¸§à¸¡à¸à¹ˆà¸­à¸™à¸§à¹ˆà¸² Groove à¹€à¸”à¸´à¸™à¹„à¸«à¸¡ à¸­à¸¢à¹ˆà¸²à¹€à¸žà¸´à¹ˆà¸‡à¸ˆà¸±à¸šà¸œà¸´à¸”à¸—à¸¸à¸à¹‚à¸™à¹‰à¸• à¹€à¸žà¸£à¸²à¸°à¹€à¸›à¹‰à¸²à¸«à¸¡à¸²à¸¢à¸‚à¸­à¸‡à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸™à¸µà¹‰à¸„à¸·à¸­à¸£à¸§à¸¡à¸—à¸¸à¸à¸­à¸¢à¹ˆà¸²à¸‡à¹ƒà¸«à¹‰à¹€à¸¥à¹ˆà¸™à¹€à¸›à¹‡à¸™à¹€à¸žà¸¥à¸‡ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹‚à¸Šà¸§à¹Œà¹€à¸—à¸„à¸™à¸´à¸„à¹à¸¢à¸à¸Šà¸´à¹‰à¸™",
        "Groove Integration à¸„à¸·à¸­à¸à¸²à¸£à¹€à¸­à¸² Pulse, Syncopation, Dynamics à¹à¸¥à¸° Palm Mute à¸¡à¸²à¸­à¸¢à¸¹à¹ˆà¹ƒà¸™ Pattern à¹€à¸”à¸µà¸¢à¸§à¸à¸±à¸™ Pulse à¹€à¸›à¹‡à¸™à¸žà¸·à¹‰à¸™ Syncopation à¹€à¸›à¹‡à¸™à¹à¸£à¸‡à¹€à¸”à¹‰à¸‡ Dynamics à¹€à¸›à¹‡à¸™à¸­à¸²à¸£à¸¡à¸“à¹Œ à¹à¸¥à¸° Palm Mute à¹€à¸›à¹‡à¸™à¸•à¸±à¸§à¸„à¸¸à¸¡à¸„à¸§à¸²à¸¡à¹à¸™à¹ˆà¸™",
        "à¹€à¸§à¸¥à¸²à¸Ÿà¸±à¸‡ drum à¹ƒà¸«à¹‰à¹€à¸£à¸´à¹ˆà¸¡à¸ˆà¸²à¸ kick à¹à¸¥à¸° snare à¸à¹ˆà¸­à¸™ à¹‚à¸”à¸¢à¸¡à¸²à¸ snare à¸ˆà¸°à¸Šà¹ˆà¸§à¸¢à¸šà¸­à¸ backbeat à¸šà¸™ 2 à¹à¸¥à¸° 4 à¸–à¹‰à¸²à¸à¸µà¸•à¸²à¸£à¹Œà¸‚à¸­à¸‡à¹€à¸£à¸²à¸§à¸²à¸‡à¸•à¸±à¸§à¸à¸±à¸š snare à¹„à¸”à¹‰à¸”à¸µ à¹€à¸žà¸¥à¸‡à¸ˆà¸°à¸£à¸¹à¹‰à¸ªà¸¶à¸à¹à¸™à¹ˆà¸™à¸‚à¸¶à¹‰à¸™à¸—à¸±à¸™à¸—à¸µ",
        "à¸–à¹‰à¸²à¸¡à¸µ Backing Track à¹ƒà¸«à¹‰à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¸à¸µà¸•à¸²à¸£à¹Œà¹€à¸£à¸²à¸­à¸¢à¸¹à¹ˆà¸à¸±à¸šà¸§à¸‡à¸«à¸£à¸·à¸­à¹à¸¢à¸à¸­à¸­à¸à¸¡à¸²à¹€à¸­à¸‡ à¸–à¹‰à¸²à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”à¹€à¸«à¸¡à¸·à¸­à¸™à¸¥à¸­à¸¢à¸™à¸³à¸«à¸£à¸·à¸­à¸Šà¹‰à¸²à¸à¸§à¹ˆà¸²à¸à¸¥à¸­à¸‡à¸šà¹ˆà¸­à¸¢ à¹† à¹ƒà¸«à¹‰à¸¥à¸” Pattern à¸¥à¸‡à¸à¹ˆà¸­à¸™à¹à¸¥à¹‰à¸§à¸à¸¥à¸±à¸šà¹„à¸›à¸ˆà¸±à¸š Pulse",
        "à¸à¸²à¸£à¹€à¸¥à¹ˆà¸™à¹à¸™à¹ˆà¸™à¹„à¸¡à¹ˆà¹„à¸”à¹‰à¹à¸›à¸¥à¸§à¹ˆà¸²à¹€à¸¥à¹ˆà¸™à¹€à¸¢à¸­à¸° à¹à¸•à¹ˆà¹à¸›à¸¥à¸§à¹ˆà¸²à¹€à¸¥à¹ˆà¸™à¹ƒà¸™à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸•à¸±à¹‰à¸‡à¹ƒà¸ˆà¹à¸¥à¸°à¸à¸¥à¸±à¸šà¹€à¸‚à¹‰à¸² beat à¹„à¸”à¹‰à¸—à¸¸à¸à¸„à¸£à¸±à¹‰à¸‡ à¸šà¸²à¸‡à¸—à¸µà¸•à¸µà¸„à¸­à¸£à¹Œà¸”à¸™à¹‰à¸­à¸¢à¸à¸§à¹ˆà¸²à¹€à¸”à¸´à¸¡à¹à¸•à¹ˆà¸•à¸£à¸‡à¸à¸§à¹ˆà¸²à¹€à¸”à¸´à¸¡ à¹€à¸žà¸¥à¸‡à¸ˆà¸°à¸Ÿà¸±à¸‡à¸¡à¸·à¸­à¸­à¸²à¸Šà¸µà¸žà¸‚à¸¶à¹‰à¸™à¸¡à¸²à¸",
        "à¹€à¸§à¸¥à¸²à¸£à¸§à¸¡à¸—à¸¸à¸à¸­à¸¢à¹ˆà¸²à¸‡ à¹ƒà¸«à¹‰à¹€à¸£à¸´à¹ˆà¸¡à¸ˆà¸²à¸ 1 à¸«à¹‰à¸­à¸‡à¸—à¸µà¹ˆà¸‡à¹ˆà¸²à¸¢à¸à¹ˆà¸­à¸™ à¹€à¸Šà¹ˆà¸™ Palm Mute à¸šà¸™ beat à¸«à¸¥à¸±à¸ à¹à¸¥à¹‰à¸§à¹€à¸•à¸´à¸¡ Accent à¸šà¸™ off-beat à¹à¸„à¹ˆà¸ˆà¸¸à¸”à¹€à¸”à¸µà¸¢à¸§ à¸–à¹‰à¸²à¸¢à¸±à¸‡à¸™à¸´à¹ˆà¸‡à¸„à¹ˆà¸­à¸¢à¹€à¸žà¸´à¹ˆà¸¡ Dynamics à¸«à¸£à¸·à¸­à¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¹€à¸•à¹‡à¸¡à¹ƒà¸™à¸«à¹‰à¸­à¸‡à¸–à¸±à¸”à¹„à¸›",
        "Final assessment à¸‚à¸­à¸‡à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸™à¸µà¹‰à¹ƒà¸«à¹‰à¸‹à¹‰à¸­à¸¡à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸¥à¹ˆà¸™à¸ˆà¸£à¸´à¸‡ 3 à¸™à¸²à¸—à¸µ à¹€à¸›à¸´à¸” Metronome à¸«à¸£à¸·à¸­ Backing Track à¹à¸¥à¹‰à¸§à¹€à¸¥à¹ˆà¸™ Groove à¹€à¸”à¸´à¸¡à¹ƒà¸«à¹‰à¹€à¸”à¸´à¸™à¸•à¹ˆà¸­ à¹„à¸¡à¹ˆà¸«à¸¢à¸¸à¸”à¸à¸¥à¸²à¸‡à¸—à¸²à¸‡ à¹à¸¡à¹‰à¸žà¸¥à¸²à¸”à¹€à¸¥à¹‡à¸à¸™à¹‰à¸­à¸¢à¸à¹‡à¸à¸¥à¸±à¸šà¹€à¸‚à¹‰à¸² Pulse à¹ƒà¸«à¹‰à¹„à¸”à¹‰"
      ],
      listenFor: [
        "à¸à¸µà¸•à¸²à¸£à¹Œà¸‚à¸­à¸‡à¹€à¸£à¸²à¸™à¸±à¹ˆà¸‡à¸­à¸¢à¸¹à¹ˆà¸à¸±à¸š kick/snare à¸«à¸£à¸·à¸­à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸¥à¹ˆà¸™à¸„à¸™à¸¥à¸°à¸—à¸²à¸‡à¸à¸±à¸šà¸à¸¥à¸­à¸‡",
        "Palm Mute à¸—à¸³à¹ƒà¸«à¹‰à¸—à¹ˆà¸­à¸™à¹à¸™à¹ˆà¸™à¸‚à¸¶à¹‰à¸™ à¹à¸¥à¸° Accent à¸—à¸³à¹ƒà¸«à¹‰à¸—à¹ˆà¸­à¸™à¹€à¸”à¹‰à¸‡à¸‚à¸¶à¹‰à¸™à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸—à¸³à¹ƒà¸«à¹‰ Pulse à¸«à¸²à¸¢",
        "à¸•à¸¥à¸­à¸” 3 à¸™à¸²à¸—à¸µ Groove à¸¢à¸±à¸‡à¹€à¸”à¸´à¸™à¸•à¹ˆà¸­à¹„à¸”à¹‰à¹„à¸«à¸¡ à¸«à¸£à¸·à¸­à¹€à¸£à¸´à¹ˆà¸¡à¸£à¸µà¸šà¹à¸¥à¸°à¸«à¸¥à¸¸à¸”à¹€à¸¡à¸·à¹ˆà¸­à¹€à¸«à¸™à¸·à¹ˆà¸­à¸¢"
      ],
      physicalFeel: [
        "à¹€à¸—à¹‰à¸²à¸¢à¸±à¸‡à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸–à¸¶à¸‡ Pulse à¸•à¸¥à¸­à¸” à¹à¸¡à¹‰à¸¡à¸·à¸­à¸ˆà¸°à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™ texture à¸«à¸¥à¸²à¸¢à¹à¸šà¸š",
        "à¸•à¸±à¸§à¹‚à¸¢à¸à¹„à¸›à¸à¸±à¸š Groove à¹à¸šà¸šà¸ªà¸šà¸²à¸¢ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹€à¸à¸£à¹‡à¸‡à¹„à¸¥à¹ˆà¸•à¸²à¸¡ Pattern",
        "à¸¡à¸·à¸­à¸‚à¸§à¸²à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸ˆà¸²à¸ mute à¹€à¸›à¹‡à¸™ open à¹à¸¥à¸° Accent à¹„à¸”à¹‰à¹‚à¸”à¸¢à¸à¸²à¸£à¹à¸à¸§à¹ˆà¸‡à¸¢à¸±à¸‡à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡"
      ],
      guitarApplication: [
        "à¸ªà¸£à¹‰à¸²à¸‡ Pattern 8 à¸«à¹‰à¸­à¸‡à¸—à¸µà¹ˆà¸¡à¸µà¸Šà¹ˆà¸§à¸‡ Palm Mute, à¸Šà¹ˆà¸§à¸‡à¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡ à¹à¸¥à¸° Accent à¸šà¸™ off-beat à¸­à¸¢à¹ˆà¸²à¸‡à¸™à¹‰à¸­à¸¢à¸«à¸™à¸¶à¹ˆà¸‡à¸ˆà¸¸à¸”",
        "à¹€à¸›à¸´à¸” Backing Track à¹à¸¥à¹‰à¸§à¸¥à¸­à¸‡à¸¥à¸”à¸ˆà¸³à¸™à¸§à¸™ strum à¸¥à¸‡à¸„à¸£à¸¶à¹ˆà¸‡à¸«à¸™à¸¶à¹ˆà¸‡ à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¸à¸µà¸•à¸²à¸£à¹Œà¸¢à¸±à¸‡à¸žà¸²à¸§à¸‡à¹€à¸”à¸´à¸™à¹„à¸”à¹‰à¹„à¸«à¸¡",
        "à¸‹à¹‰à¸­à¸¡ final assessment 3 à¸™à¸²à¸—à¸µà¹à¸šà¸š take à¹€à¸”à¸µà¸¢à¸§ à¸«à¹‰à¸²à¸¡à¸«à¸¢à¸¸à¸”à¹à¸à¹‰à¸à¸¥à¸²à¸‡à¸—à¸²à¸‡ à¹ƒà¸«à¹‰à¸à¸¶à¸à¸à¸¥à¸±à¸šà¹€à¸‚à¹‰à¸² Pulse à¹à¸—à¸™"
      ],
      guidedSteps: [
        "à¸£à¸­à¸šà¹à¸£à¸ à¹€à¸¥à¹ˆà¸™à¹à¸„à¹ˆ Pulse à¸à¸±à¸šà¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§ 1 à¸™à¸²à¸—à¸µ à¹ƒà¸«à¹‰à¸¡à¸±à¹ˆà¸™à¸à¹ˆà¸­à¸™à¸§à¹ˆà¸²à¸§à¸‡à¹ƒà¸™à¸«à¸±à¸§à¹„à¸¡à¹ˆà¸ªà¸±à¹ˆà¸™",
        "à¸£à¸­à¸šà¸ªà¸­à¸‡ à¹€à¸•à¸´à¸¡ Palm Mute à¸šà¸™ beat à¸«à¸¥à¸±à¸ à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¸à¸µà¸•à¸²à¸£à¹Œà¹€à¸£à¸´à¹ˆà¸¡à¹à¸™à¹ˆà¸™à¸‚à¸¶à¹‰à¸™à¹à¸•à¹ˆà¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸£à¸",
        "à¸£à¸­à¸šà¸ªà¸²à¸¡ à¹€à¸•à¸´à¸¡ Accent à¸šà¸™ off-beat à¹à¸„à¹ˆà¸ˆà¸¸à¸”à¹€à¸”à¸µà¸¢à¸§ à¸–à¹‰à¸²à¸ˆà¸¸à¸”à¸™à¸µà¹‰à¸—à¸³à¹ƒà¸«à¹‰à¸«à¸¥à¸¸à¸” à¹ƒà¸«à¹‰à¹€à¸­à¸² Accent à¸­à¸­à¸à¹à¸¥à¹‰à¸§à¸à¸¥à¸±à¸šà¹„à¸› Palm Mute à¸à¹ˆà¸­à¸™",
        "à¸£à¸­à¸šà¸ªà¸µà¹ˆ à¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”à¹€à¸•à¹‡à¸¡à¹ƒà¸™à¸Šà¹ˆà¸§à¸‡à¸—à¹‰à¸²à¸¢ Pattern à¹€à¸«à¸¡à¸·à¸­à¸™à¸à¸³à¸¥à¸±à¸‡à¸”à¸±à¸™à¸ˆà¸²à¸ verse à¹„à¸› chorus à¹à¸•à¹ˆà¸«à¹‰à¸²à¸¡à¸”à¸±à¸™ tempo",
        "à¸£à¸­à¸šà¸ªà¸¸à¸”à¸—à¹‰à¸²à¸¢ à¹€à¸›à¸´à¸” Metronome à¸«à¸£à¸·à¸­ Backing Track à¹à¸¥à¹‰à¸§à¹€à¸¥à¹ˆà¸™ 3 à¸™à¸²à¸—à¸µà¹à¸šà¸š take à¹€à¸”à¸µà¸¢à¸§ à¹€à¸›à¹‰à¸²à¸«à¸¡à¸²à¸¢à¸„à¸·à¸­à¸à¸¥à¸±à¸šà¹€à¸‚à¹‰à¸² Pulse à¹ƒà¸«à¹‰à¹„à¸”à¹‰à¸—à¸¸à¸à¸„à¸£à¸±à¹‰à¸‡ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹€à¸¥à¹ˆà¸™à¹„à¸£à¹‰à¸žà¸¥à¸²à¸”"
      ],
      correctionSteps: [
        "à¸–à¹‰à¸² Pattern à¸£à¸à¸ˆà¸™à¸Ÿà¸±à¸‡ Pulse à¹„à¸¡à¹ˆà¸­à¸­à¸ à¹ƒà¸«à¹‰à¸•à¸±à¸”à¹‚à¸™à¹‰à¸•à¸­à¸­à¸à¸„à¸£à¸¶à¹ˆà¸‡à¸«à¸™à¸¶à¹ˆà¸‡à¹à¸¥à¹‰à¸§à¹€à¸«à¸¥à¸·à¸­à¹€à¸‰à¸žà¸²à¸°à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸ªà¸³à¸„à¸±à¸",
        "à¸–à¹‰à¸²à¹€à¸¥à¹ˆà¸™à¸à¸±à¸š Backing Track à¹à¸¥à¹‰à¸§à¸à¸µà¸•à¸²à¸£à¹Œà¸¥à¸­à¸¢ à¹ƒà¸«à¹‰à¸Ÿà¸±à¸‡ snare à¸šà¸™ 2 à¹à¸¥à¸° 4 à¸à¹ˆà¸­à¸™ à¹à¸¥à¹‰à¸§à¸§à¸²à¸‡à¸„à¸­à¸£à¹Œà¸”à¹ƒà¸«à¹‰à¹„à¸¡à¹ˆà¸Šà¸™à¸¡à¸±à¹ˆà¸§",
        "à¸–à¹‰à¸²à¸žà¸¥à¸²à¸”à¹à¸¥à¹‰à¸§à¸«à¸¢à¸¸à¸” à¹ƒà¸«à¹‰à¸‹à¹‰à¸­à¸¡à¸žà¸¥à¸²à¸”à¹à¸šà¸šà¸•à¸±à¹‰à¸‡à¹ƒà¸ˆà¸«à¸™à¸¶à¹ˆà¸‡à¸ˆà¸¸à¸” à¹à¸¥à¹‰à¸§à¸à¸¶à¸à¸à¸¥à¸±à¸šà¹€à¸‚à¹‰à¸² beat à¸–à¸±à¸”à¹„à¸› à¹€à¸žà¸·à¹ˆà¸­à¸ªà¸£à¹‰à¸²à¸‡à¸™à¸´à¸ªà¸±à¸¢à¹€à¸¥à¹ˆà¸™à¸•à¹ˆà¸­à¹ƒà¸™à¹€à¸žà¸¥à¸‡à¸ˆà¸£à¸´à¸‡"
      ],
      dailySelfCheck: [
        "à¸£à¸±à¸à¸©à¸² Groove à¹„à¸”à¹‰ 3 à¸™à¸²à¸—à¸µà¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸«à¸¢à¸¸à¸”à¸à¸¥à¸²à¸‡à¸—à¸²à¸‡",
        "à¸•à¸²à¸¡ Metronome à¸—à¸µà¹ˆ 70-75 BPM à¹„à¸”à¹‰ à¹à¸¡à¹‰à¸¡à¸µà¸žà¸¥à¸²à¸”à¹€à¸¥à¹‡à¸à¸™à¹‰à¸­à¸¢à¸à¹‡à¹€à¸¥à¹ˆà¸™à¸•à¹ˆà¸­",
        "à¹€à¸¥à¹ˆà¸™ mini-song à¸—à¸±à¹‰à¸‡ 8 à¸«à¹‰à¸­à¸‡à¹„à¸”à¹‰à¸ªà¸¡à¹ˆà¸³à¹€à¸ªà¸¡à¸­à¸ˆà¸™à¸£à¸¹à¹‰à¸ªà¸¶à¸à¹€à¸«à¸¡à¸·à¸­à¸™à¹€à¸›à¹‡à¸™à¹€à¸žà¸¥à¸‡"
      ],
      troubleshooting: [
        {
          problem: "Groove à¸«à¸¥à¸¸à¸”à¸«à¸¥à¸±à¸‡à¹€à¸¥à¹ˆà¸™à¹„à¸›à¸›à¸£à¸°à¸¡à¸²à¸“ 1 à¸™à¸²à¸—à¸µ",
          advice: "à¸¥à¸”à¸ˆà¸³à¸™à¸§à¸™ strum à¸¥à¸‡à¸à¹ˆà¸­à¸™ à¹€à¸«à¸¥à¸·à¸­à¹à¸„à¹ˆ Pulse, Palm Mute à¸šà¸™ beat à¸«à¸¥à¸±à¸ à¹à¸¥à¸° Accent à¸«à¸™à¸¶à¹ˆà¸‡à¸ˆà¸¸à¸” à¸­à¸¢à¹ˆà¸²à¸žà¸¢à¸²à¸¢à¸²à¸¡à¹€à¸¥à¹ˆà¸™à¹€à¸¢à¸­à¸°à¹€à¸žà¸·à¹ˆà¸­à¸à¸¥à¸šà¸„à¸§à¸²à¸¡à¹„à¸¡à¹ˆà¸™à¸´à¹ˆà¸‡"
        },
        {
          problem: "à¹€à¸¥à¹ˆà¸™à¸à¸±à¸š Metronome à¹à¸¥à¹‰à¸§à¸à¸µà¸•à¸²à¸£à¹Œà¸¥à¸­à¸¢à¸­à¸­à¸à¸ˆà¸²à¸ click",
          advice: "à¸Ÿà¸±à¸‡ click à¹€à¸«à¸¡à¸·à¸­à¸™ snare à¸‚à¸­à¸‡à¸§à¸‡ à¹à¸¥à¹‰à¸§à¸§à¸²à¸‡à¸„à¸­à¸£à¹Œà¸”à¹ƒà¸«à¹‰à¸à¸¥à¸±à¸šà¸¡à¸²à¹€à¸ˆà¸­ beat 2 à¹à¸¥à¸° 4 à¸à¹ˆà¸­à¸™à¸„à¹ˆà¸­à¸¢à¹€à¸•à¸´à¸¡à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”"
        },
        {
          problem: "à¸žà¸¥à¸²à¸”à¹à¸¥à¹‰à¸§à¸«à¸¢à¸¸à¸”à¸—à¸±à¹‰à¸‡à¹€à¸žà¸¥à¸‡",
          advice: "à¸à¸¶à¸à¹€à¸¥à¹ˆà¸™à¸•à¹ˆà¸­à¸ˆà¸²à¸ beat à¸–à¸±à¸”à¹„à¸›à¸—à¸±à¸™à¸—à¸µ à¸•à¸±à¹‰à¸‡à¹€à¸›à¹‰à¸²à¸§à¹ˆà¸² take à¸™à¸µà¹‰à¸•à¹‰à¸­à¸‡à¸ˆà¸š 3 à¸™à¸²à¸—à¸µ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸•à¹‰à¸­à¸‡à¹„à¸£à¹‰à¸žà¸¥à¸²à¸”"
        }
      ],
      miniExample: "à¹€à¸£à¸´à¹ˆà¸¡ 2 à¸«à¹‰à¸­à¸‡à¹à¸£à¸à¸”à¹‰à¸§à¸¢ Palm Mute à¸šà¸™ 1 à¹à¸¥à¸° 3 à¹€à¸•à¸´à¸¡ Accent à¸—à¸µà¹ˆ & à¸«à¸¥à¸±à¸‡ 2 à¹ƒà¸™à¸«à¹‰à¸­à¸‡à¸—à¸µà¹ˆ 3 à¹à¸¥à¹‰à¸§à¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”à¹€à¸•à¹‡à¸¡à¹ƒà¸™à¸«à¹‰à¸­à¸‡à¸—à¸µà¹ˆ 4 à¹€à¸žà¸·à¹ˆà¸­à¹ƒà¸«à¹‰ Groove à¸¡à¸µà¸—à¸´à¸¨à¸—à¸²à¸‡",
      commonMistakes: [
        "à¹ƒà¸ªà¹ˆà¸—à¸¸à¸à¸­à¸¢à¹ˆà¸²à¸‡à¸žà¸£à¹‰à¸­à¸¡à¸à¸±à¸™à¸•à¸±à¹‰à¸‡à¹à¸•à¹ˆà¸•à¹‰à¸™à¸ˆà¸™ Pattern à¹à¸™à¹ˆà¸™à¹€à¸à¸´à¸™à¹à¸¥à¸°à¸Ÿà¸±à¸‡à¹„à¸¡à¹ˆà¸­à¸­à¸à¸§à¹ˆà¸² Pulse à¸­à¸¢à¸¹à¹ˆà¸•à¸£à¸‡à¹„à¸«à¸™",
        "à¸ªà¸™à¹ƒà¸ˆà¸¡à¸·à¸­à¸‚à¸§à¸²à¸¡à¸²à¸à¸ˆà¸™à¸¥à¸·à¸¡à¸Ÿà¸±à¸‡ drum à¸«à¸£à¸·à¸­ snare à¸—à¸³à¹ƒà¸«à¹‰à¸à¸µà¸•à¸²à¸£à¹Œà¸¥à¸­à¸¢à¸­à¸­à¸à¸ˆà¸²à¸à¸§à¸‡",
        "à¸žà¸­à¸žà¸¥à¸²à¸”à¸«à¸™à¸¶à¹ˆà¸‡à¸ˆà¸¸à¸”à¹à¸¥à¹‰à¸§à¸«à¸¢à¸¸à¸”à¸—à¸±à¹‰à¸‡ take à¹à¸—à¸™à¸—à¸µà¹ˆà¸ˆà¸°à¸à¸¥à¸±à¸šà¹€à¸‚à¹‰à¸² beat à¸–à¸±à¸”à¹„à¸›"
      ],
      selfCheck: [
        "à¹€à¸¥à¹ˆà¸™ 3 à¸™à¸²à¸—à¸µà¹à¸¥à¹‰à¸§ Metronome à¸«à¸£à¸·à¸­ Backing Track à¸¢à¸±à¸‡à¸£à¸¹à¹‰à¸ªà¸¶à¸à¹€à¸«à¸¡à¸·à¸­à¸™à¸­à¸¢à¸¹à¹ˆà¸à¸¥à¸²à¸‡ Groove à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹„à¸¥à¹ˆà¸•à¸²à¸¡à¹€à¸£à¸²",
        "à¸Ÿà¸±à¸‡à¸¢à¹‰à¸­à¸™à¹à¸¥à¹‰à¸§à¹à¸¢à¸à¹„à¸”à¹‰à¸§à¹ˆà¸²à¸ˆà¸¸à¸”à¹„à¸«à¸™à¹€à¸›à¹‡à¸™ Pulse, à¸ˆà¸¸à¸”à¹„à¸«à¸™à¹€à¸›à¹‡à¸™ Syncopation, à¸ˆà¸¸à¸”à¹„à¸«à¸™à¹ƒà¸Šà¹‰ Dynamics à¸«à¸£à¸·à¸­ Palm Mute",
        "à¸–à¹‰à¸²à¸¥à¸”à¸ˆà¸³à¸™à¸§à¸™ strum à¸¥à¸‡ à¹€à¸žà¸¥à¸‡à¸¢à¸±à¸‡à¸£à¸¹à¹‰à¸ªà¸¶à¸à¹€à¸”à¸´à¸™à¸­à¸¢à¸¹à¹ˆ à¹à¸›à¸¥à¸§à¹ˆà¸² time à¹à¸¥à¸°à¸à¸²à¸£à¸§à¸²à¸‡à¸ˆà¸±à¸‡à¸«à¸§à¸°à¹€à¸£à¸´à¹ˆà¸¡à¹à¸™à¹ˆà¸™"
      ],
      teacherNote: "à¸„à¸£à¸¹à¹à¸™à¸°à¸™à¸³à¹ƒà¸«à¹‰à¸„à¸´à¸”à¹à¸šà¸šà¸™à¸±à¸à¸”à¸™à¸•à¸£à¸µà¹ƒà¸™à¸§à¸‡ à¹€à¸¥à¹ˆà¸™à¹ƒà¸«à¹‰à¸™à¸±à¸à¸£à¹‰à¸­à¸‡à¹à¸¥à¸°à¸à¸¥à¸­à¸‡à¸ªà¸šà¸²à¸¢à¸à¹ˆà¸­à¸™ à¸­à¸¢à¹ˆà¸²à¹€à¸žà¸´à¹ˆà¸‡à¹€à¸¥à¹ˆà¸™à¹ƒà¸«à¹‰à¸¡à¸·à¸­à¸‚à¸§à¸²à¸”à¸¹à¸¢à¸¸à¹ˆà¸‡ à¹€à¸žà¸£à¸²à¸° Groove à¸—à¸µà¹ˆà¸”à¸µà¸¡à¸±à¸à¹€à¸£à¸´à¹ˆà¸¡à¸ˆà¸²à¸à¸à¸²à¸£à¹€à¸§à¹‰à¸™à¸—à¸µà¹ˆà¹€à¸›à¹‡à¸™"
    },
    earTraining: {
      title: "à¸Ÿà¸±à¸‡à¸§à¹ˆà¸² Groove à¹„à¸«à¸™ steady à¸à¸§à¹ˆà¸²",
      instruction: "à¸Ÿà¸±à¸‡à¸„à¸§à¸²à¸¡à¸™à¸´à¹ˆà¸‡à¸‚à¸­à¸‡à¸ˆà¸±à¸‡à¸«à¸§à¸°à¹à¸¥à¸°à¸à¸²à¸£à¹€à¸¥à¹ˆà¸™à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡ à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸Ÿà¸±à¸‡à¸Šà¸·à¹ˆà¸­à¸„à¸­à¸£à¹Œà¸”à¸«à¸£à¸·à¸­à¸—à¸¤à¸©à¸Žà¸µ",
      examples: [
        {
          label: "à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡ A",
          description: "à¹€à¸£à¸´à¹ˆà¸¡à¸”à¸µ à¹à¸•à¹ˆà¸žà¸­à¸¡à¸µ Accent à¸¡à¸²à¸à¸‚à¸¶à¹‰à¸™ tempo à¹€à¸£à¸´à¹ˆà¸¡à¹€à¸£à¹ˆà¸‡à¹à¸¥à¸°à¸¡à¸µà¸«à¸¢à¸¸à¸”à¹à¸à¹‰à¸à¸¥à¸²à¸‡à¸—à¸²à¸‡"
        },
        {
          label: "à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡ B",
          description: "Pattern à¹€à¸£à¸µà¸¢à¸šà¸à¸§à¹ˆà¸² à¹à¸•à¹ˆ Pulse à¸­à¸¢à¸¹à¹ˆà¸à¸±à¸š Metronome à¸•à¹ˆà¸­à¹€à¸™à¸·à¹ˆà¸­à¸‡ à¹à¸¥à¸°à¸žà¸¥à¸²à¸”à¹€à¸¥à¹‡à¸à¸™à¹‰à¸­à¸¢à¸à¹‡à¸¢à¸±à¸‡à¹€à¸¥à¹ˆà¸™à¸•à¹ˆà¸­"
        }
      ],
      question: "à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡à¹„à¸«à¸™ feels steadier?",
      hint: "Groove à¸—à¸µà¹ˆ steady à¸­à¸²à¸ˆà¹€à¸¥à¹ˆà¸™à¸™à¹‰à¸­à¸¢à¸à¸§à¹ˆà¸² à¹à¸•à¹ˆà¸—à¸³à¹ƒà¸«à¹‰à¹€à¸—à¹‰à¸²à¹€à¸£à¸²à¹€à¸„à¸²à¸°à¸•à¸²à¸¡à¹„à¸”à¹‰à¸ªà¸šà¸²à¸¢à¸à¸§à¹ˆà¸²"
    },
    miniSong: {
      title: "8-Bar Groove: à¹ƒà¸«à¹‰à¹à¸šà¸šà¸à¸¶à¸à¸à¸¥à¸²à¸¢à¹€à¸›à¹‡à¸™à¹€à¸žà¸¥à¸‡",
      purpose: "à¹ƒà¸Šà¹‰ open chords à¸‡à¹ˆà¸²à¸¢ à¹† à¹€à¸žà¸·à¹ˆà¸­à¸£à¸§à¸¡ Pulse, Syncopation, Dynamics à¹à¸¥à¸° Palm Mute à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¸„à¸´à¸”à¸—à¸¤à¸©à¸Žà¸µà¹€à¸žà¸´à¹ˆà¸¡",
      bars: [
        { bar: 1, chord: "Em", direction: "Palm Mute à¹€à¸šà¸² à¹† à¸šà¸™ beat 1 à¹à¸¥à¸° 3 à¹ƒà¸«à¹‰ Pulse à¸•à¸±à¹‰à¸‡à¸«à¸¥à¸±à¸" },
        { bar: 2, chord: "Em", direction: "à¸„à¸‡ Palm Mute à¹à¸¥à¹‰à¸§à¹€à¸•à¸´à¸¡ ghost strum à¹€à¸šà¸² à¹† à¹ƒà¸«à¹‰à¸¡à¸·à¸­à¸‚à¸§à¸²à¹€à¸”à¸´à¸™à¸•à¹ˆà¸­" },
        { bar: 3, chord: "G", direction: "à¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¸¡à¸²à¸à¸‚à¸¶à¹‰à¸™à¹€à¸¥à¹‡à¸à¸™à¹‰à¸­à¸¢ à¹à¸¥à¸°à¸§à¸²à¸‡ Accent à¸—à¸µà¹ˆ & à¸«à¸¥à¸±à¸‡ 2" },
        { bar: 4, chord: "G", direction: "à¸¥à¸”à¸ˆà¸³à¸™à¸§à¸™ strum à¹ƒà¸«à¹‰ Groove à¹‚à¸¥à¹ˆà¸‡ à¹à¸•à¹ˆà¹€à¸—à¹‰à¸²à¸¢à¸±à¸‡à¸­à¸¢à¸¹à¹ˆà¸à¸±à¸š Metronome" },
        { bar: 5, chord: "D", direction: "à¸à¸¥à¸±à¸šà¸¡à¸² Palm Mute à¹€à¸žà¸·à¹ˆà¸­à¹ƒà¸«à¹‰à¸—à¹ˆà¸­à¸™à¸£à¸¹à¹‰à¸ªà¸¶à¸à¹à¸™à¹ˆà¸™à¸‚à¸¶à¹‰à¸™" },
        { bar: 6, chord: "D", direction: "à¹€à¸›à¸´à¸” Accent à¸—à¸µà¹ˆ & à¸«à¸¥à¸±à¸‡ 4 à¹€à¸žà¸·à¹ˆà¸­à¸ªà¹ˆà¸‡à¹€à¸‚à¹‰à¸²à¸Šà¹ˆà¸§à¸‡à¸—à¹‰à¸²à¸¢" },
        { bar: 7, chord: "C", direction: "à¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”à¹€à¸•à¹‡à¸¡à¸‚à¸¶à¹‰à¸™ à¹€à¸«à¸¡à¸·à¸­à¸™à¸—à¹ˆà¸­à¸™à¹€à¸žà¸¥à¸‡à¹€à¸£à¸´à¹ˆà¸¡à¸¢à¸" },
        { bar: 8, chord: "C", direction: "à¹€à¸¥à¹ˆà¸™à¹ƒà¸«à¹‰à¸ˆà¸š take à¹€à¸”à¸µà¸¢à¸§ à¹à¸¥à¹‰à¸§à¸›à¸¥à¹ˆà¸­à¸¢à¸„à¸­à¸£à¹Œà¸”à¸ªà¸¸à¸”à¸—à¹‰à¸²à¸¢à¹ƒà¸«à¹‰à¸«à¸²à¸¢à¹ƒà¸ˆ" }
      ],
      feel: "à¸™à¸µà¹ˆà¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹à¸„à¹ˆ exercise à¹à¸¥à¹‰à¸§ à¹ƒà¸«à¹‰à¹€à¸¥à¹ˆà¸™à¹€à¸«à¸¡à¸·à¸­à¸™à¸à¸³à¸¥à¸±à¸‡à¸žà¸²à¸§à¸‡à¹€à¸¥à¹‡à¸ à¹† à¹€à¸”à¸´à¸™à¹„à¸›à¸‚à¹‰à¸²à¸‡à¸«à¸™à¹‰à¸²"
    },
    hear: [
      "à¸Ÿà¸±à¸‡à¸ à¸²à¸žà¸£à¸§à¸¡à¸à¹ˆà¸­à¸™ à¸­à¸¢à¹ˆà¸²à¹€à¸žà¸´à¹ˆà¸‡à¸ˆà¸±à¸šà¸œà¸´à¸”à¸—à¸µà¸¥à¸°à¹‚à¸™à¹‰à¸•: Groove à¸•à¹‰à¸­à¸‡à¹€à¸”à¸´à¸™à¸•à¹ˆà¸­à¹„à¸”à¹‰à¹à¸¥à¸°à¹„à¸¡à¹ˆà¸ªà¸°à¸”à¸¸à¸”",
      "à¸Ÿà¸±à¸‡à¸§à¹ˆà¸² Palm Mute à¸Šà¹ˆà¸§à¸¢à¸—à¸³à¹ƒà¸«à¹‰à¸«à¹‰à¸­à¸‡à¹à¸£à¸ à¹† à¹à¸™à¹ˆà¸™à¸‚à¸¶à¹‰à¸™ à¹à¸¥à¹‰à¸§ Accent à¸Šà¹ˆà¸§à¸¢à¸”à¸±à¸™à¸Šà¹ˆà¸§à¸‡à¸—à¹‰à¸²à¸¢à¹ƒà¸«à¹‰à¸¡à¸µà¸žà¸¥à¸±à¸‡à¸‚à¸¶à¹‰à¸™à¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆ",
      "à¸–à¹‰à¸²à¹€à¸›à¸´à¸” Backing Track à¹ƒà¸«à¹‰à¸Ÿà¸±à¸‡à¸§à¹ˆà¸²à¸à¸µà¸•à¸²à¸£à¹Œà¸§à¸²à¸‡à¸•à¸±à¸§à¸­à¸¢à¸¹à¹ˆà¸à¸±à¸š kick/snare à¸«à¸£à¸·à¸­à¹€à¸¥à¹ˆà¸™à¸¥à¸­à¸¢à¹à¸¢à¸à¸­à¸­à¸à¸¡à¸²"
    ],
    feel: [
      "à¹ƒà¸«à¹‰à¹€à¸—à¹‰à¸²à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸–à¸¶à¸‡ Pulse à¸•à¸¥à¸­à¸” à¸ªà¹ˆà¸§à¸™à¸¡à¸·à¸­à¸‚à¸§à¸²à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™ texture à¸£à¸°à¸«à¸§à¹ˆà¸²à¸‡ mute, open à¹à¸¥à¸° Accent",
      "Groove à¸—à¸µà¹ˆà¸”à¸µà¸„à¸§à¸£à¸£à¸¹à¹‰à¸ªà¸¶à¸à¹€à¸«à¸¡à¸·à¸­à¸™à¸•à¸±à¸§à¹€à¸£à¸²à¹‚à¸¢à¸à¹„à¸›à¸‚à¹‰à¸²à¸‡à¸«à¸™à¹‰à¸²à¹à¸šà¸šà¹„à¸¡à¹ˆà¸£à¸µà¸š",
      "à¸–à¹‰à¸²à¸£à¹ˆà¸²à¸‡à¸à¸²à¸¢à¸•à¸¶à¸‡à¸«à¸£à¸·à¸­à¸£à¸µà¸š à¹ƒà¸«à¹‰à¸¥à¸”à¸ˆà¸³à¸™à¸§à¸™ Accent à¸¥à¸‡à¸à¹ˆà¸­à¸™ à¹à¸¥à¹‰à¸§à¸„à¹ˆà¸­à¸¢à¹€à¸žà¸´à¹ˆà¸¡à¸—à¸µà¸¥à¸°à¸ˆà¸¸à¸”"
    ],
    visual: {
      title: "à¹€à¸«à¹‡à¸™ Groove à¸—à¸±à¹‰à¸‡ 8 à¸«à¹‰à¸­à¸‡à¹à¸šà¸šà¸¢à¹ˆà¸­",
      instruction: "à¸”à¸¹ playhead à¸§à¸´à¹ˆà¸‡à¸œà¹ˆà¸²à¸™ Pattern: à¹€à¸£à¸´à¹ˆà¸¡à¸ˆà¸²à¸ Pulse, à¹€à¸•à¸´à¸¡ Syncopation, à¹ƒà¸Šà¹‰ Palm Mute à¹à¸¥à¹‰à¸§à¹€à¸›à¸´à¸” Accent à¸Šà¹ˆà¸§à¸‡à¸—à¹‰à¸²à¸¢",
      duration: 6,
      steps: [
        { count: "1", action: "Mute", kind: "mute" },
        { count: "e", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "&", action: "Mute", kind: "mute" },
        { count: "a", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "2", action: "Mute", kind: "mute" },
        { count: "e", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "&", action: "Accent", kind: "accent" },
        { count: "a", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "3", action: "à¹€à¸›à¸´à¸”", kind: "open" },
        { count: "e", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "&", action: "à¹€à¸›à¸´à¸”", kind: "open" },
        { count: "a", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "4", action: "à¹€à¸›à¸´à¸”", kind: "open" },
        { count: "e", action: "à¸™à¸±à¸š", kind: "rest" },
        { count: "&", action: "Accent", kind: "accent" },
        { count: "a", action: "à¸ˆà¸š", kind: "hit" }
      ]
    },
    practice: [
      "à¸ªà¸£à¹‰à¸²à¸‡ Groove 8 à¸«à¹‰à¸­à¸‡à¸”à¹‰à¸§à¸¢à¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§à¸«à¸£à¸·à¸­à¸ªà¸­à¸‡à¸„à¸­à¸£à¹Œà¸”à¸à¹‡à¹„à¸”à¹‰",
      "à¸•à¹‰à¸­à¸‡à¸¡à¸µ Accent à¸šà¸™ off-beat à¸­à¸¢à¹ˆà¸²à¸‡à¸™à¹‰à¸­à¸¢ 1 à¸ˆà¸¸à¸”",
      "à¸•à¹‰à¸­à¸‡à¸¡à¸µà¸Šà¹ˆà¸§à¸‡à¸—à¸µà¹ˆà¹ƒà¸Šà¹‰ Palm Mute à¹à¸¥à¸°à¸Šà¹ˆà¸§à¸‡à¸—à¸µà¹ˆà¹€à¸›à¸´à¸”à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”à¹€à¸•à¹‡à¸¡",
      "à¸­à¸±à¸”à¹€à¸›à¹‡à¸™ take à¹€à¸”à¸µà¸¢à¸§à¹ƒà¸«à¹‰à¸ˆà¸š à¹à¸¡à¹‰à¸ˆà¸°à¸¡à¸µà¸žà¸¥à¸²à¸”à¹€à¸¥à¹‡à¸à¸™à¹‰à¸­à¸¢à¸à¹‡à¸­à¸¢à¹ˆà¸²à¸«à¸¢à¸¸à¸”à¸à¸¥à¸²à¸‡à¸—à¸²à¸‡"
    ],
    quiz: [
      {
        question: "à¸•à¸­à¸™à¸£à¸§à¸¡ Groove à¸ªà¸´à¹ˆà¸‡à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¸™à¸´à¹ˆà¸‡à¸—à¸µà¹ˆà¸ªà¸¸à¸”à¸„à¸·à¸­à¸­à¸°à¹„à¸£?",
        options: ["Pulse", "Every accent", "Only the volume"],
        answer: 0
      },
      {
        question: "Syncopation à¸Šà¹ˆà¸§à¸¢à¹€à¸žà¸´à¹ˆà¸¡à¸­à¸°à¹„à¸£à¹ƒà¸«à¹‰ Pattern?",
        options: ["à¸„à¸§à¸²à¸¡à¹€à¸„à¸¥à¸·à¹ˆà¸­à¸™à¹„à¸«à¸§à¹à¸¥à¸°à¹à¸£à¸‡à¸œà¸¥à¸±à¸", "Tuning à¹ƒà¸«à¸¡à¹ˆ", "à¸à¸µà¸•à¸²à¸£à¹Œà¸•à¸±à¸§à¹ƒà¸«à¸¡à¹ˆ"],
        answer: 0
      },
      {
        question: "Dynamics à¸Šà¹ˆà¸§à¸¢à¸ˆà¸±à¸”à¸à¸²à¸£à¸­à¸°à¹„à¸£à¹ƒà¸™à¹€à¸žà¸¥à¸‡?",
        options: ["à¸žà¸¥à¸±à¸‡à¹à¸¥à¸° contrast", "à¸«à¸¡à¸²à¸¢à¹€à¸¥à¸‚ fret", "à¸‚à¸™à¸²à¸”à¸ªà¸²à¸¢"],
        answer: 0
      },
      {
        question: "à¹à¸šà¸šà¸›à¸£à¸°à¹€à¸¡à¸´à¸™à¸—à¹‰à¸²à¸¢à¹€à¸”à¸·à¸­à¸™à¸—à¸µà¹ˆà¸”à¸µà¸„à¸§à¸£à¹€à¸›à¹‡à¸™à¹à¸šà¸šà¹„à¸«à¸™?",
        options: ["à¹€à¸¥à¹ˆà¸™ Groove 8 à¸«à¹‰à¸­à¸‡à¹ƒà¸«à¹‰à¸ˆà¸šà¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸«à¸¢à¸¸à¸”", "à¸•à¸µà¹ƒà¸«à¹‰à¹€à¸£à¹‡à¸§à¸—à¸µà¹ˆà¸ªà¸¸à¸”à¹€à¸—à¹ˆà¸²à¸—à¸µà¹ˆà¸—à¸³à¹„à¸”à¹‰", "à¹€à¸¥à¹ˆà¸™ scale position à¹ƒà¸«à¸¡à¹ˆ"],
        answer: 0
      },
      {
        question: "à¹€à¸›à¹‰à¸²à¸«à¸¡à¸²à¸¢à¸‚à¸­à¸‡à¹€à¸”à¸·à¸­à¸™à¸—à¸µà¹ˆ 1 à¸„à¸·à¸­à¸­à¸°à¹„à¸£?",
        options: ["à¸¡à¸µà¸žà¸·à¹‰à¸™à¸à¸²à¸™ Rhythm à¸—à¸µà¹ˆà¸™à¸´à¹ˆà¸‡à¹à¸¥à¸°à¸Ÿà¸±à¸‡à¹€à¸›à¹‡à¸™à¹€à¸žà¸¥à¸‡", "à¹€à¸£à¸µà¸¢à¸™à¸—à¸¤à¸©à¸Žà¸µà¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”", "à¹€à¸¥à¹ˆà¸™à¸—à¸¸à¸ module à¸žà¸£à¹‰à¸­à¸¡à¸à¸±à¸™"],
        answer: 0
      }
    ],
    homework: [
      "à¸­à¸±à¸” Final Groove 8 à¸«à¹‰à¸­à¸‡à¹à¸šà¸š take à¹€à¸”à¸µà¸¢à¸§à¹ƒà¸«à¹‰à¸ˆà¸š à¹à¸¡à¹‰à¸ˆà¸°à¸žà¸¥à¸²à¸”à¹€à¸¥à¹‡à¸à¸™à¹‰à¸­à¸¢à¸à¹‡à¹„à¸¡à¹ˆà¸«à¸¢à¸¸à¸”à¸à¸¥à¸²à¸‡à¸—à¸²à¸‡",
      "à¸Ÿà¸±à¸‡à¸¢à¹‰à¸­à¸™à¹à¸¥à¹‰à¸§à¹€à¸¥à¸·à¸­à¸ 1 à¸ˆà¸¸à¸”à¸—à¸µà¹ˆ Groove à¸”à¸µ à¹à¸¥à¸° 1 à¸ˆà¸¸à¸”à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¹€à¸­à¸²à¸à¸¥à¸±à¸šà¹„à¸›à¸‹à¹‰à¸­à¸¡à¸•à¹ˆà¸­"
    ]
  }
];

const dailyPracticePlan = {
  1: [
    ["Metronome 5 à¸™à¸²à¸—à¸µ", "à¸™à¸±à¸š 1 2 3 4 5 à¸™à¸²à¸—à¸µ", "à¸•à¸µà¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§ 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Metronome 6 à¸™à¸²à¸—à¸µ", "à¸™à¸±à¸š 16th Grid 4 à¸™à¸²à¸—à¸µ", "à¸•à¸µà¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§à¹ƒà¸«à¹‰à¸•à¸£à¸‡ beat 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Metronome 5 à¸™à¸²à¸—à¸µ", "à¹€à¸„à¸²à¸°à¹€à¸—à¹‰à¸²à¹à¸¥à¸°à¸™à¸±à¸šà¸­à¸­à¸à¹€à¸ªà¸µà¸¢à¸‡ 5 à¸™à¸²à¸—à¸µ", "à¸•à¸µà¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§ 6 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Metronome 6 à¸™à¸²à¸—à¸µ", "à¸™à¸±à¸šà¸­à¸­à¸à¹€à¸ªà¸µà¸¢à¸‡à¹ƒà¸«à¹‰à¸Šà¸±à¸” 5 à¸™à¸²à¸—à¸µ", "à¹€à¸¥à¹ˆà¸™à¹à¸šà¸šà¸à¸¶à¸à¸«à¸±à¸” 4 à¸«à¹‰à¸­à¸‡ 6 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Metronome 5 à¸™à¸²à¸—à¸µ", "à¸à¸¶à¸ 16th Grid 7 à¸™à¸²à¸—à¸µ", "à¸•à¸µà¸„à¸­à¸£à¹Œà¸”à¹€à¸”à¸µà¸¢à¸§ 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Metronome 8 à¸™à¸²à¸—à¸µ", "à¸™à¸±à¸š 1 e & a 5 à¸™à¸²à¸—à¸µ", "à¸­à¸±à¸”à¹€à¸ªà¸µà¸¢à¸‡ 30 à¸§à¸´à¸™à¸²à¸—à¸µ 7 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["à¸—à¸šà¸—à¸§à¸™ 5 à¸™à¸²à¸—à¸µ", "à¸™à¸±à¸šà¸à¸±à¸š Metronome 5 à¸™à¸²à¸—à¸µ", "à¸­à¸±à¸”à¹€à¸ªà¸µà¸¢à¸‡ 1 à¸™à¸²à¸—à¸µ 10 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"]
  ],
  2: [
    ["Metronome 5 à¸™à¸²à¸—à¸µ", "à¸™à¸±à¸š off-beat 5 à¸™à¸²à¸—à¸µ", "à¸à¸¶à¸ Syncopation 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Metronome 6 à¸™à¸²à¸—à¸µ", "à¸§à¸²à¸‡ Accent à¸—à¸µà¹ˆ & 5 à¸™à¸²à¸—à¸µ", "Muted strum 6 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["à¸—à¸šà¸—à¸§à¸™ Pulse 5 à¸™à¸²à¸—à¸µ", "à¸•à¸šà¸¡à¸·à¸­à¸šà¸™ off-beat 6 à¸™à¸²à¸—à¸µ", "à¹€à¸¥à¹ˆà¸™ Chord Pattern 6 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Metronome 6 à¸™à¸²à¸—à¸µ", "à¹€à¸¥à¹ˆà¸™ Syncopated Pattern 6 à¸™à¸²à¸—à¸µ", "à¸­à¸±à¸” 4 à¸«à¹‰à¸­à¸‡ 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["à¸™à¸±à¸šà¸ˆà¸±à¸‡à¸«à¸§à¸° 5 à¸™à¸²à¸—à¸µ", "Upstroke à¸šà¸™ off-beat 7 à¸™à¸²à¸—à¸µ", "à¸•à¸µà¸„à¸­à¸£à¹Œà¸” 6 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Metronome 8 à¸™à¸²à¸—à¸µ", "à¹€à¸¥à¹ˆà¸™ Groove loop 6 à¸™à¸²à¸—à¸µ", "à¸Ÿà¸±à¸‡à¸¢à¹‰à¸­à¸™à¸à¸¥à¸±à¸š 6 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["à¸—à¸šà¸—à¸§à¸™ 5 à¸™à¸²à¸—à¸µ", "à¸­à¸±à¸” Syncopation 10 à¸™à¸²à¸—à¸µ", "à¸ˆà¸”à¸šà¸±à¸™à¸—à¸¶à¸ 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"]
  ],
  3: [
    ["Metronome 5 à¸™à¸²à¸—à¸µ", "à¹€à¸¥à¹ˆà¸™à¹€à¸šà¸²/à¸”à¸±à¸‡ 5 à¸™à¸²à¸—à¸µ", "à¸à¸¶à¸ Palm Mute 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Pulse 5 à¸™à¸²à¸—à¸µ", "à¸«à¸²à¸•à¸³à¹à¸«à¸™à¹ˆà¸‡ Palm Mute 6 à¸™à¸²à¸—à¸µ", "Muted Chord 6 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["à¸™à¸±à¸šà¸ˆà¸±à¸‡à¸«à¸§à¸° 5 à¸™à¸²à¸—à¸µ", "à¸„à¸¸à¸¡ Dynamics 7 à¸™à¸²à¸—à¸µ", "à¹€à¸—à¸µà¸¢à¸š Open à¸à¸±à¸š Muted 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Metronome 6 à¸™à¸²à¸—à¸µ", "à¸—à¸³ contrast à¹à¸šà¸š verse/chorus 6 à¸™à¸²à¸—à¸µ", "à¸­à¸±à¸” 4 à¸«à¹‰à¸­à¸‡ 6 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["à¹€à¸¥à¹ˆà¸™à¹€à¸šà¸² 5 à¸™à¸²à¸—à¸µ", "à¹€à¸¥à¹ˆà¸™à¸”à¸±à¸‡ 5 à¸™à¸²à¸—à¸µ", "Palm Mute Groove 8 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Metronome 8 à¸™à¸²à¸—à¸µ", "à¹„à¸¥à¹ˆ Dynamics à¹€à¸šà¸²à¹„à¸›à¸”à¸±à¸‡ 8 à¸™à¸²à¸—à¸µ", "à¸ˆà¸”à¸šà¸±à¸™à¸—à¸¶à¸ 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["à¸—à¸šà¸—à¸§à¸™ 5 à¸™à¸²à¸—à¸µ", "à¸­à¸±à¸” 3 à¹à¸šà¸š 10 à¸™à¸²à¸—à¸µ", "à¸Ÿà¸±à¸‡à¸¢à¹‰à¸­à¸™à¸à¸¥à¸±à¸š 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"]
  ],
  4: [
    ["Metronome 5 à¸™à¸²à¸—à¸µ", "à¸—à¸šà¸—à¸§à¸™ Pulse 5 à¸™à¸²à¸—à¸µ", "Groove 8 à¸«à¹‰à¸­à¸‡ 8 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Metronome 6 à¸™à¸²à¸—à¸µ", "à¸—à¸šà¸—à¸§à¸™ Syncopation 6 à¸™à¸²à¸—à¸µ", "à¸£à¹ˆà¸²à¸‡ Groove 8 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["à¸™à¸±à¸šà¸ˆà¸±à¸‡à¸«à¸§à¸° 5 à¸™à¸²à¸—à¸µ", "à¸—à¸šà¸—à¸§à¸™ Dynamics 6 à¸™à¸²à¸—à¸µ", "Groove à¹à¸šà¸š Muted/Open 8 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Metronome 6 à¸™à¸²à¸—à¸µ", "Groove 8 à¸«à¹‰à¸­à¸‡ 10 à¸™à¸²à¸—à¸µ", "à¸ˆà¸”à¸šà¸±à¸™à¸—à¸¶à¸ 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["à¸—à¸šà¸—à¸§à¸™ 5 à¸™à¸²à¸—à¸µ", "à¸‹à¹‰à¸­à¸¡ Final Groove 10 à¸™à¸²à¸—à¸µ", "à¸­à¸±à¸” 1 take 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Metronome 8 à¸™à¸²à¸—à¸µ", "à¸­à¸±à¸”à¹à¸šà¸šà¸›à¸£à¸°à¹€à¸¡à¸´à¸™à¸—à¹‰à¸²à¸¢à¹€à¸”à¸·à¸­à¸™ 10 à¸™à¸²à¸—à¸µ", "à¸Ÿà¸±à¸‡à¸¢à¹‰à¸­à¸™à¸à¸¥à¸±à¸š 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"],
    ["Warmup 5 à¸™à¸²à¸—à¸µ", "à¸­à¸±à¸” Final Recording 15 à¸™à¸²à¸—à¸µ", "à¸ªà¸£à¸¸à¸›à¸ªà¸´à¹ˆà¸‡à¸—à¸µà¹ˆà¹„à¸”à¹‰à¹€à¸£à¸µà¸¢à¸™ 5 à¸™à¸²à¸—à¸µ", "à¸—à¸³à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š"]
  ]
};

const foundationStorage = {
  completedWeeks: "foundationCompletedWeeks",
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
  renderDevPreviewBanner();
  renderQaPreviewBadge();
  updateDebugState({ currentMonth: selectedFocusedMonth, lastAction: "app boot" });
  setDataStatus("Loading companion data...", "info");
  const savedMonth = getSavedSelectedFocusedMonth();
  focusedSelectedWeek = getCurrentFoundationWeek();
  bindFocusedEvents();
  renderFocusedApp();
  renderPreludeEntry();
  renderMiniCourseShelf();
  setBpm(bpm);
  loadFutureData().then(() => {
    renderPreludeEntry();
    if (isPreludePreviewActive()) {
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
}

function getSavedSelectedFocusedMonth() {
  const saved = Number(localStorage.getItem(selectedFocusedMonthStorageKey) || 1);
  return saved >= 2 && saved <= 6 ? saved : 1;
}

function bindFocusedEvents() {
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
  if (icon) icon.innerText = isOpen ? "â–²" : "â–¼";
}

function setNoteValueShelfOpen(isOpen) {
  const content = document.getElementById("noteValueShelfContent");
  const button = document.getElementById("toggleNoteValueButton");
  const icon = document.getElementById("toggleNoteValueIcon");
  if (!content) return;
  content.style.display = isOpen ? "block" : "none";
  button?.classList.toggle("active", isOpen);
  button?.setAttribute("aria-expanded", String(isOpen));
  if (icon) icon.innerText = isOpen ? "â–²" : "â–¼";
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
      title: "Rhythm Survival: à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸„à¸·à¸­à¸«à¸±à¸§à¹ƒà¸ˆ",
      body: "à¸à¹ˆà¸­à¸™à¹€à¸¥à¹ˆà¸™à¹€à¸£à¹‡à¸§ à¸•à¹‰à¸­à¸‡à¸£à¸¹à¹‰à¸à¹ˆà¸­à¸™à¸§à¹ˆà¸² â€œà¹€à¸§à¸¥à¸²â€ à¸‚à¸­à¸‡à¹€à¸žà¸¥à¸‡à¸­à¸¢à¸¹à¹ˆà¸•à¸£à¸‡à¹„à¸«à¸™",
      teacherNote:
        "à¸ˆà¸±à¸‡à¸«à¸§à¸°à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸‚à¸­à¸‡à¸•à¸à¹à¸•à¹ˆà¸‡à¹€à¸žà¸¥à¸‡ à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸„à¸·à¸­à¸£à¸²à¸‡à¸£à¸–à¹„à¸Ÿ à¸–à¹‰à¸²à¸¡à¸·à¸­à¹€à¸£à¸²à¸­à¸­à¸à¸™à¸­à¸à¸£à¸²à¸‡ à¸•à¹ˆà¸­à¹ƒà¸«à¹‰à¸ˆà¸±à¸šà¸„à¸­à¸£à¹Œà¸”à¸–à¸¹à¸ à¹€à¸žà¸¥à¸‡à¸à¹‡à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹€à¸‚à¹‰à¸²à¸—à¸µà¹ˆ",
      list: [
        "Beat à¸„à¸·à¸­ pulse à¸—à¸µà¹ˆà¹€à¸£à¸²à¸™à¸±à¸šà¸•à¸²à¸¡",
        "à¹ƒà¸™ 4/4 à¸«à¸™à¸¶à¹ˆà¸‡à¸«à¹‰à¸­à¸‡à¸¡à¸µ 4 beat",
        "à¸•à¸±à¸§à¸”à¸³ = à¹€à¸¥à¹ˆà¸™ 1 à¸„à¸£à¸±à¹‰à¸‡à¸•à¹ˆà¸­ 1 beat",
        "à¸•à¸±à¸§à¸«à¸¢à¸¸à¸” = à¹„à¸¡à¹ˆà¹€à¸¥à¹ˆà¸™à¹€à¸ªà¸µà¸¢à¸‡ à¹à¸•à¹ˆà¸¢à¸±à¸‡à¸•à¹‰à¸­à¸‡à¸™à¸±à¸šà¸•à¹ˆà¸­",
        "Metronome à¸„à¸·à¸­à¸„à¸£à¸¹à¸ˆà¸±à¸šà¹€à¸§à¸¥à¸² à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸¨à¸±à¸•à¸£à¸¹"
      ],
      instruction: [
        "Mini visual - Count: 1   2   3   4",
        "Play: à¸”à¸µà¸”   à¸”à¸µà¸”   à¸”à¸µà¸”   à¸”à¸µà¸”",
        "Rest example: 1   2   3   4 / à¸”à¸µà¸”   à¹€à¸‡à¸µà¸¢à¸š   à¸”à¸µà¸”   à¹€à¸‡à¸µà¸¢à¸š",
        "Practice: à¸•à¸±à¹‰à¸‡ Metronome à¸—à¸µà¹ˆ 60 BPM à¹à¸¥à¹‰à¸§à¸™à¸±à¸š 1 2 3 4 à¸­à¸­à¸à¹€à¸ªà¸µà¸¢à¸‡",
        "à¸•à¸šà¸¡à¸·à¸­à¸—à¸¸à¸à¸•à¸±à¸§à¹€à¸¥à¸‚ 1 à¸™à¸²à¸—à¸µ à¸ˆà¸²à¸à¸™à¸±à¹‰à¸™à¸•à¸šà¹€à¸‰à¸žà¸²à¸° 1 à¹à¸¥à¸° 3",
        "à¸¥à¸­à¸‡à¸•à¸šà¸—à¸µà¹ˆ 1 à¹à¸¥à¹‰à¸§à¹€à¸‡à¸µà¸¢à¸šà¸—à¸µà¹ˆ 2 à¹à¸•à¹ˆà¸¢à¸±à¸‡à¸™à¸±à¸šà¸•à¹ˆà¸­à¹ƒà¸™à¹ƒà¸ˆ à¸–à¹‰à¸²à¸«à¸¥à¸¸à¸” count à¹ƒà¸«à¹‰à¸«à¸¢à¸¸à¸”à¹à¸¥à¹‰à¸§à¹€à¸£à¸´à¹ˆà¸¡à¹ƒà¸«à¸¡à¹ˆà¸Šà¹‰à¸²à¸¥à¸‡"
      ]
    },
    {
      id: "w0-rhythm-survival-exit-check",
      type: "mechanics-check",
      title: "Exit Check: Rhythm Survival",
      description: "à¸œà¸¹à¹‰à¹€à¸£à¸µà¸¢à¸™à¸œà¹ˆà¸²à¸™ section à¸™à¸µà¹‰à¹„à¸”à¹‰à¹€à¸¡à¸·à¹ˆà¸­:",
      checks: [
        "à¸™à¸±à¸š 1 2 3 4 à¸žà¸£à¹‰à¸­à¸¡ Metronome à¹„à¸”à¹‰",
        "à¹€à¸‡à¸µà¸¢à¸šà¸•à¸£à¸‡ rest à¹„à¸”à¹‰à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸«à¸¥à¸¸à¸” count",
        "à¹€à¸‚à¹‰à¸²à¹ƒà¸ˆà¸§à¹ˆà¸²à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸ªà¸³à¸„à¸±à¸à¸à¸§à¹ˆà¸²à¸à¸²à¸£à¹€à¸¥à¹ˆà¸™à¹€à¸£à¹‡à¸§"
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
  section.style.display = !isViewingPrelude ? "block" : "none";
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
      lessonsCopy.textContent = "à¸—à¸šà¸—à¸§à¸™à¸—à¹ˆà¸²à¸—à¸²à¸‡ à¸„à¸³à¸¨à¸±à¸žà¸—à¹Œà¸žà¸·à¹‰à¸™à¸à¸²à¸™ à¹à¸¥à¸°à¹à¸šà¸šà¸à¸¶à¸à¹€à¸£à¸´à¹ˆà¸¡à¸•à¹‰à¸™à¸à¹ˆà¸­à¸™à¹€à¸‚à¹‰à¸²à¸ªà¸¹à¹ˆ Month 1 à¸­à¸¢à¹ˆà¸²à¸‡à¸¡à¸±à¹ˆà¸™à¹ƒà¸ˆ";
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
    month2CreateElement("p", "", meta.subtitle || "à¸›à¸£à¸±à¸šà¹€à¸‚à¹‡à¸¡à¸—à¸´à¸¨à¸à¹ˆà¸­à¸™à¹€à¸‚à¹‰à¸² Month 1")
  );

  const backButton = month2CreateElement("button", "secondary-action prelude-back-button", "à¸à¸¥à¸±à¸šà¹„à¸›à¸«à¸™à¹‰à¸² Dashboard");
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
  saveJson(foundationStorage.completedWeeks, Array.from(new Set(value)).sort((a, b) => a - b));
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
    nextDayButton.textContent = "à¸§à¸±à¸™à¸–à¸±à¸”à¹„à¸›";
  }
  const currentWeekNumber = getCurrentFoundationWeek();
  const weekItem = foundationWeeks.find((week) => week.number === currentWeekNumber);
  const dayNumber = getPracticeDay(currentWeekNumber);
  const checkedItems = loadJson(getChecklistKey(currentWeekNumber, dayNumber), []);
  const tasks = dailyPracticePlan[currentWeekNumber][dayNumber - 1];
  const missionMinutes = tasks.reduce((total, task) => total + (Number(task.match(/(\d+)\s*à¸™à¸²à¸—à¸µ/)?.[1]) || 0), 0);
  const monthPosition = getMonthPosition(weekItem.number, 1);
  const moduleLabel = "Rhythm Foundation";

  document.getElementById("currentWeekTitle").textContent = `à¹€à¸”à¸·à¸­à¸™ 1: ${weekItem.title}`;
  document.getElementById("currentWeekSummary").textContent = weekItem.summary;
  document.getElementById("monthProgressText").textContent = `à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸—à¸µà¹ˆ ${monthPosition} / 4 à¸‚à¸­à¸‡à¸«à¸¡à¸§à¸” ${moduleLabel}`;
  document.getElementById("monthProgressBar").style.width = `${(monthPosition / 4) * 100}%`;
  document.getElementById("todayPracticeTitle").textContent = `à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸—à¸µà¹ˆ ${monthPosition} Â· à¸§à¸±à¸™à¸—à¸µà¹ˆ ${dayNumber}`;
  document.getElementById("todayMissionMeta").innerHTML = `<span>${missionMinutes} à¸™à¸²à¸—à¸µ</span><span>${moduleLabel}</span>`;
  document.querySelector(".journey-panel h2").textContent = "à¹€à¸ªà¹‰à¸™à¸—à¸²à¸‡ Rhythm à¹€à¸”à¸·à¸­à¸™à¸—à¸µà¹ˆ 1";
  renderJourney();
  const previewDisabled = isDevPreviewActive() ? " disabled" : "";
  document.getElementById("todayChecklist").innerHTML = tasks.map((task, index) => `
    <label class="check-item">
      <input type="checkbox" data-today-task="${index}" ${checkedItems.includes(index) ? "checked" : ""}${previewDisabled} />
      <span>${task}</span>
    </label>
  `).join("");

  if (isDevPreviewActive()) return;
  document.querySelectorAll("[data-today-task]").forEach((input) => {
    input.addEventListener("change", () => {
      const nextChecked = Array.from(document.querySelectorAll("[data-today-task]:checked")).map((item) => Number(item.dataset.todayTask));
      saveJson(getChecklistKey(currentWeekNumber, dayNumber), nextChecked);
    });
  });
}

function renderMonth2Dashboard() {
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
    nextDayButton.textContent = isLastWeek ? "à¸à¸¥à¸±à¸šà¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¹à¸£à¸" : "à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸–à¸±à¸”à¹„à¸›";
  }

  if (!weekItem) {
    document.getElementById("currentWeekTitle").textContent = `à¹€à¸”à¸·à¸­à¸™ ${month}: ${moduleLabel}`;
    document.getElementById("currentWeekSummary").textContent = `à¸à¸³à¸¥à¸±à¸‡à¹€à¸•à¸£à¸µà¸¢à¸¡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸šà¸—à¹€à¸£à¸µà¸¢à¸™ ${moduleLabel}`;
    document.getElementById("monthProgressText").textContent = `à¸£à¸­à¹‚à¸«à¸¥à¸”à¸‚à¹‰à¸­à¸¡à¸¹à¸¥ Month ${month}`;
    document.getElementById("monthProgressBar").style.width = "0%";
    document.getElementById("todayPracticeTitle").textContent = "à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸šà¸—à¹€à¸£à¸µà¸¢à¸™";
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
    ? exercises.map((task) => `${task.duration ? `${task.duration} Â· ` : ""}${task.title || task.name || task.instruction}`)
    : ["à¸­à¹ˆà¸²à¸™à¸ à¸²à¸žà¸£à¸§à¸¡à¸šà¸—à¹€à¸£à¸µà¸¢à¸™", "à¸¥à¸­à¸‡à¹à¸šà¸šà¸à¸¶à¸à¸«à¸¥à¸±à¸à¸Šà¹‰à¸² à¹† à¸à¸±à¸š Metronome", "à¹€à¸Šà¹‡à¸à¹€à¸à¸“à¸‘à¹Œà¸œà¹ˆà¸²à¸™à¹à¸šà¸šà¹ƒà¸ˆà¹€à¸¢à¹‡à¸™"];

  document.getElementById("currentWeekTitle").textContent = `à¹€à¸”à¸·à¸­à¸™ ${month}: ${weekItem.title}`;
  document.getElementById("currentWeekSummary").textContent = weekItem.summary || weekItem.goal || moduleLabel;
  document.getElementById("monthProgressText").textContent = `à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸—à¸µà¹ˆ ${monthPosition} / 4 à¸‚à¸­à¸‡à¸«à¸¡à¸§à¸” ${moduleLabel}`;
  document.getElementById("monthProgressBar").style.width = `${(monthPosition / 4) * 100}%`;
  document.getElementById("todayPracticeTitle").textContent = `à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸—à¸µà¹ˆ ${monthPosition} Â· ${dayGroupLabel}`;
  document.getElementById("todayMissionMeta").innerHTML = `<span>${weekItem.estimatedMinutesPerDay || 20} à¸™à¸²à¸—à¸µ</span><span>${moduleLabel}</span>`;
  document.querySelector(".journey-panel h2").textContent = `à¹€à¸ªà¹‰à¸™à¸—à¸²à¸‡ ${monthMeta.shortLabel} à¹€à¸”à¸·à¸­à¸™à¸—à¸µà¹ˆ ${month}`;
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
    journeyList.setAttribute("aria-label", `à¸„à¸§à¸²à¸¡à¸„à¸·à¸šà¸«à¸™à¹‰à¸² Month ${month}`);
    journeyList.innerHTML = monthWeeks.map((weekItem) => {
      const state = weekItem.number === focusedSelectedWeek ? ["à¸à¸³à¸¥à¸±à¸‡à¸à¸¶à¸", "current"] : weekItem.number < focusedSelectedWeek ? ["à¸œà¹ˆà¸²à¸™à¹à¸¥à¹‰à¸§", "done"] : ["à¸žà¸£à¹‰à¸­à¸¡", "pending"];
      const ariaCurrent = weekItem.number === focusedSelectedWeek ? ' aria-current="step"' : "";
      return `<li class="journey-step ${state[1]}"${ariaCurrent} aria-label="Week ${weekItem.number}: ${state[0]}"><span class="journey-dot" aria-hidden="true"></span><span class="journey-week">Week ${weekItem.number}</span><span class="status ${state[1]}">${state[0]}</span></li>`;
    }).join("");
    return;
  }
  document.querySelector(".journey-panel h2").textContent = "à¹€à¸ªà¹‰à¸™à¸—à¸²à¸‡ Rhythm à¹€à¸”à¸·à¸­à¸™à¸—à¸µà¹ˆ 1";
  journeyList.setAttribute("aria-label", "à¸„à¸§à¸²à¸¡à¸„à¸·à¸šà¸«à¸™à¹‰à¸² Month 1");
  const completed = getCompletedFoundationWeeks();
  const selectedWeek = focusedSelectedWeek;
  const currentWeek = getCurrentFoundationWeek();
  journeyList.innerHTML = foundationWeeks.map((weekItem) => {
    const state = completed.includes(weekItem.number) ? ["à¸œà¹ˆà¸²à¸™à¹à¸¥à¹‰à¸§", "done"] : weekItem.number === selectedWeek ? ["à¸à¸³à¸¥à¸±à¸‡à¸à¸¶à¸", "current"] : weekItem.number === currentWeek ? ["à¹€à¸£à¸´à¹ˆà¸¡à¸™à¸´à¹ˆà¸‡", "steady"] : ["à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹€à¸£à¸´à¹ˆà¸¡", "pending"];
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

function openFocusedWeek(weekNumber, options = {}) {
  const source = options.source || "manual";
  const shouldScroll = Boolean(options.scroll);
  const monthWeeks = getFocusedMonthWeeks(selectedFocusedMonth);

  if (!monthWeeks.length) return;

  const numericWeek = Number(weekNumber);
  const targetWeek = monthWeeks.some((week) => Number(week.number) === numericWeek)
    ? numericWeek
    : monthWeeks[0].number;

  focusedSelectedWeek = targetWeek;

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
}

async function openFocusedMonth(month) {
  if (isViewingPrelude) {
    isViewingPrelude = false;
    setPreludeViewChrome(false);
  }
  if (month > 1 && !window.__GC_DEBUG__?.dataJsonLoaded) {
    setDataStatus(`Opening Month ${month}...`, "info");
    showToast(`Opening Month ${month}...`, "info", 1800);
    await loadFutureData();
  }
  if (!canOpenMonth(month)) {
    updateDebugState({ currentMonth: selectedFocusedMonth, lastAction: `Month ${month} blocked` });
    setDataStatus("Month à¸™à¸µà¹‰à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹€à¸›à¸´à¸”à¹ƒà¸«à¹‰à¹ƒà¸Šà¹‰à¸‡à¸²à¸™à¸„à¸£à¸±à¸š", "error");
    return;
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
  const completed = getCompletedFoundationWeeks();
  const currentWeekNumber = getCurrentFoundationWeek();
  const tabs = document.getElementById("weekTabs");
  const lessonsTitle = document.getElementById("lessonsTitle");
  const monthWeeks = getFocusedMonthWeeks();
  const monthMeta = getMonthMeta(selectedFocusedMonth);
  lessonsTitle.textContent = `à¹€à¸”à¸·à¸­à¸™ ${selectedFocusedMonth}: ${monthMeta.moduleLabel}`;
  tabs.setAttribute("aria-label", selectedFocusedMonth === 1 ? "à¸šà¸—à¹€à¸£à¸µà¸¢à¸™à¸žà¸·à¹‰à¸™à¸à¸²à¸™ 4 à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œ" : `à¸šà¸—à¹€à¸£à¸µà¸¢à¸™ Month ${selectedFocusedMonth}`);
  if (selectedFocusedMonth !== 1) {
    tabs.innerHTML = monthWeeks.map((weekItem) => `
      <button type="button" role="tab" class="card-tab future ${weekItem.number === focusedSelectedWeek ? "active current" : "pending"}" aria-selected="${weekItem.number === focusedSelectedWeek}" data-course-week="${weekItem.number}">
        <span class="tab-kicker"><span aria-hidden="true">ðŸŽ¯</span> ${monthMeta.shortLabel}</span>
        <strong>à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸—à¸µà¹ˆ ${weekItem.number}: ${weekItem.title}</strong>
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
    const status = completed.includes(weekItem.number) ? "done" : weekItem.number === currentWeekNumber ? "current" : "pending";
    return `
    <button type="button" role="tab" class="card-tab ${status} ${weekItem.number === focusedSelectedWeek ? "active" : ""}" aria-selected="${weekItem.number === focusedSelectedWeek}" data-foundation-week="${weekItem.number}">
      <span class="tab-kicker"><span aria-hidden="true">ðŸŽ¯</span> Foundation</span>
      <strong>${weekItem.title}</strong>
      <span class="status ${status}">${status}</span>
    </button>
  `;
  }).join("");

  document.querySelectorAll("[data-foundation-week]").forEach((button) => {
    button.addEventListener("click", () => {
      focusedSelectedWeek = Number(button.dataset.foundationWeek);
      renderJourney();
      renderFocusedWeekTabs();
      renderFocusedLesson();
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
      <p class="eyebrow">à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸—à¸µà¹ˆ ${weekItem.number}</p>
      <h2>${weekItem.title}</h2>
      <p>${weekItem.summary}</p>
    </div>
    ${renderLessonFlowOverview()}
    ${renderLessonMedia(weekItem)}
    ${renderLearnSection(weekItem)}
    ${renderLessonSection("3. à¹€à¸¥à¹ˆà¸™: à¹à¸šà¸šà¸à¸¶à¸à¸«à¸±à¸”", weekItem.practice, "play-block")}
    ${renderLessonPracticeSupport(weekItem)}
    <section class="lesson-block quiz-block">
      <h3>4. à¹€à¸Šà¹‡à¸: à¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š</h3>
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
      <button class="secondary-action" id="checkLessonQuiz" type="button">à¸•à¸£à¸§à¸ˆà¹à¸šà¸šà¸—à¸”à¸ªà¸­à¸š</button>
      <p class="quiz-result" id="lessonQuizResult" aria-live="polite"></p>
    </section>
    ${renderLessonSection("à¸à¸²à¸£à¸šà¹‰à¸²à¸™", weekItem.homework, "homework-block")}
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
        <h2>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸žà¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹€à¸”à¸·à¸­à¸™à¸™à¸µà¹‰</h2>
        <p>à¸–à¹‰à¸²à¹€à¸›à¸´à¸”à¸ˆà¸²à¸à¸¡à¸·à¸­à¸–à¸·à¸­ à¹ƒà¸«à¹‰à¸¥à¸­à¸‡à¸£à¸µà¹€à¸Ÿà¸£à¸Šà¸œà¹ˆà¸²à¸™ local server à¹à¸¥à¹‰à¸§à¸”à¸¹à¸ªà¸–à¸²à¸™à¸° data.json à¸”à¹‰à¸²à¸™à¸šà¸™à¸„à¸£à¸±à¸š</p>
      </div>
    `;
    return;
  }

  if (!canOpenMonth(selectedFocusedMonth)) {
    panel.innerHTML = `
      <div class="lesson-header">
        <p class="eyebrow">Future lessons</p>
        <h2>à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹€à¸›à¸´à¸”à¸šà¸—à¹€à¸£à¸µà¸¢à¸™à¹€à¸”à¸·à¸­à¸™à¸™à¸µà¹‰</h2>
        <p>à¸•à¸­à¸™à¸™à¸µà¹‰à¹€à¸›à¸´à¸”à¹ƒà¸«à¹‰à¹ƒà¸Šà¹‰à¸‡à¸²à¸™à¹€à¸‰à¸žà¸²à¸° Month 1 à¸–à¸¶à¸‡ Month 4 à¹€à¸—à¹ˆà¸²à¸™à¸±à¹‰à¸™à¸„à¸£à¸±à¸š</p>
      </div>
    `;
    return;
  }

  panel.innerHTML = `
    <div class="lesson-header">
      <p class="eyebrow">à¹€à¸”à¸·à¸­à¸™ ${selectedFocusedMonth} Â· à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸—à¸µà¹ˆ ${weekItem.number}</p>
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
      title: "à¸ à¸²à¸žà¸£à¸§à¸¡à¸šà¸—à¹€à¸£à¸µà¸¢à¸™",
      body: weekItem.goal
    });
  }
  if (month2AsArray(weekItem.practice).length) {
    blocks.push({
      type: "technique-drill",
      drill: {
        title: "à¹à¸šà¸šà¸à¸¶à¸à¸«à¸±à¸”à¸«à¸¥à¸±à¸",
        steps: weekItem.practice
      }
    });
  }
  if (month2AsArray(weekItem.checks).length) {
    blocks.push({
      type: "mechanics-check",
      title: "à¹€à¸à¸“à¸‘à¹Œà¸œà¹ˆà¸²à¸™",
      checks: weekItem.checks
    });
  }
  return blocks;
}

function renderMonth2DailyPracticeSection(weekItem = {}) {
  const section = month2CreateElement("section", "month2-component month2-practice-section");
  section.append(
    month2CreateElement("p", "eyebrow", "à¸•à¸²à¸£à¸²à¸‡à¸‹à¹‰à¸­à¸¡à¸›à¸£à¸°à¸ˆà¸³à¸§à¸±à¸™"),
    month2CreateElement("h3", "", "à¸‹à¹‰à¸­à¸¡ 7 à¸§à¸±à¸™à¹à¸šà¸šà¹„à¸¡à¹ˆà¸¥à¹‰à¸™à¸«à¸±à¸§")
  );

  const items = weekItem.dailyPractice;
  if (!items || (!month2AsArray(items).length && !month2AsArray(items.days).length && !month2AsArray(items.tasks).length)) {
    section.appendChild(renderMonth2MissingCard("à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸•à¸²à¸£à¸²à¸‡à¸‹à¹‰à¸­à¸¡à¸›à¸£à¸°à¸ˆà¸³à¸§à¸±à¸™à¸ªà¸³à¸«à¸£à¸±à¸šà¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸™à¸µà¹‰"));
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
    month2CreateElement("span", "practice-panel-focus", group.focus || "à¸‹à¹‰à¸­à¸¡à¸›à¸£à¸°à¸ˆà¸³à¸§à¸±à¸™")
  );
  const toggle = month2CreateElement("span", "practice-panel-toggle", panel.open ? "âˆ’" : "+");
  header.append(title, toggle);
  panel.addEventListener("toggle", () => {
    toggle.textContent = panel.open ? "âˆ’" : "+";
  });

  const body = month2CreateElement("div", "practice-panel-body");
  const exercises = month2AsArray(group.exercises || group.tasks);
  if (exercises.length) {
    exercises.forEach((exercise, taskIndex) => body.appendChild(renderMonth2PracticeTaskCard(exercise, weekNumber, `${index}-${taskIndex}`)));
  } else {
    body.appendChild(renderMonth2MissingCard("à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¹à¸šà¸šà¸à¸¶à¸à¸«à¸±à¸”à¹ƒà¸™à¸Šà¹ˆà¸§à¸‡à¸™à¸µà¹‰"));
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
    month2CreateElement("h4", "", month2FirstText(task.title, task.name, "à¹à¸šà¸šà¸à¸¶à¸à¸«à¸±à¸”")),
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
      month2CreateElement("p", "eyebrow", "à¸›à¸£à¸°à¹€à¸¡à¸´à¸™à¸•à¸±à¸§à¹€à¸­à¸‡"),
      month2CreateElement("h3", "", "à¹€à¸Šà¹‡à¸à¸„à¸§à¸²à¸¡à¹€à¸‚à¹‰à¸²à¹ƒà¸ˆ")
    );
    const criteriaList = month2CreateElement("div", "criteria-list");
    selfCheck.forEach((item, index) => criteriaList.appendChild(renderMonth2PassItem(item, index)));
    section.appendChild(criteriaList);
    return section;
  }

  section.append(
    month2CreateElement("p", "eyebrow", "à¸›à¸£à¸°à¹€à¸¡à¸´à¸™à¸•à¸±à¸§à¹€à¸­à¸‡"),
    month2CreateElement("h3", "", selfCheck.title || "à¹€à¸Šà¹‡à¸à¸„à¸§à¸²à¸¡à¹€à¸‚à¹‰à¸²à¹ƒà¸ˆ")
  );

  const questions = month2AsArray(selfCheck.questions);
  if (questions.length) {
    const questionList = month2CreateElement("div", "question-list");
    questions.forEach((item, index) => questionList.appendChild(renderMonth2SelfQuestion(item, index)));
    section.appendChild(questionList);
  }

  const passItems = month2AsArray(selfCheck.passCriteria || selfCheck.criteria);
  if (passItems.length) {
    section.appendChild(month2CreateElement("h3", "", "à¸œà¹ˆà¸²à¸™à¹€à¸¡à¸·à¹ˆà¸­"));
    const criteriaList = month2CreateElement("div", "criteria-list");
    passItems.forEach((item, index) => criteriaList.appendChild(renderMonth2PassItem(item, index)));
    section.appendChild(criteriaList);
  }

  if (selfCheck.passSummary) section.appendChild(month2CreateElement("p", "pass-summary", selfCheck.passSummary));

  const troubleItems = month2AsArray(selfCheck.troubleshooting);
  if (troubleItems.length) {
    section.appendChild(month2CreateElement("h3", "", "à¸–à¹‰à¸²à¸¢à¸±à¸‡à¸•à¸´à¸” à¹ƒà¸«à¹‰à¸¥à¸­à¸‡à¹à¸à¹‰à¹à¸šà¸šà¸™à¸µà¹‰"));
    const troubleList = month2CreateElement("div", "trouble-list");
    troubleItems.forEach((item = {}) => {
      const details = document.createElement("details");
      details.append(
        month2CreateElement("summary", "", month2FirstText(item.problem, item.issue, item.title, "à¸•à¸´à¸”à¸•à¸£à¸‡à¸™à¸µà¹‰")),
        month2CreateElement("p", "", month2FirstText(item.advice, item.fix, item.solution, item.body))
      );
      troubleList.appendChild(details);
    });
    section.appendChild(troubleList);
  }

  if (section.children.length <= 2) section.appendChild(renderMonth2MissingCard("à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¹à¸šà¸šà¸›à¸£à¸°à¹€à¸¡à¸´à¸™à¸•à¸±à¸§à¹€à¸­à¸‡à¸ªà¸³à¸«à¸£à¸±à¸šà¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸™à¸µà¹‰"));
  return section;
}

function renderMonth2SelfQuestion(item = {}, index = 0) {
  const type = item.type || (item.options || item.choices ? "multiple-choice" : "practical");
  if (type === "multiple-choice" || type === "quiz") return renderMonth2ChoiceQuestion(item, index);
  return renderMonth2InstructionCheck(item);
}

function renderMonth2ChoiceQuestion(item = {}, index = 0) {
  const card = month2CreateElement("article", "question-card");
  card.appendChild(month2CreateElement("h4", "", month2FirstText(item.question, item.prompt, item.title, `à¸„à¸³à¸–à¸²à¸¡à¸—à¸µà¹ˆ ${index + 1}`)));
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
        correct ? "à¸–à¸¹à¸à¸„à¸£à¸±à¸š à¸Ÿà¸±à¸‡à¹à¸¥à¸°à¸ˆà¸³à¸„à¸§à¸²à¸¡à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸™à¸µà¹‰à¹„à¸§à¹‰" : "à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸„à¸£à¸±à¸š à¸¥à¸­à¸‡à¸à¸¥à¸±à¸šà¹„à¸›à¸Ÿà¸±à¸‡à¸«à¸£à¸·à¸­à¸”à¸¹à¹à¸œà¸™à¸—à¸µà¹ˆà¸­à¸µà¸à¸„à¸£à¸±à¹‰à¸‡"
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
  card.append(month2CreateElement("h4", "", month2FirstText(item.title, item.question, item.prompt, item.name, "à¹€à¸Šà¹‡à¸à¸”à¹‰à¸§à¸¢à¸à¸²à¸£à¹€à¸¥à¹ˆà¸™à¸ˆà¸£à¸´à¸‡")));
  month2AppendText(card, item.instruction || item.body || item.description || item.goal);
  month2AsArray(item.steps).forEach((step) => month2AppendText(card, typeof step === "string" ? step : step.instruction || step.text || step.title, "task-step"));
  return card;
}

function renderLessonFlowOverview() {
  const steps = [
    ["1", "à¸Ÿà¸±à¸‡", "à¸ˆà¸±à¸š Pulse, Accent à¹à¸¥à¸° Groove à¸”à¹‰à¸§à¸¢à¸«à¸¹à¸à¹ˆà¸­à¸™"],
    ["2", "à¹€à¸«à¹‡à¸™", "à¸”à¸¹ grid à¹à¸¥à¸° animation à¹ƒà¸«à¹‰à¸£à¸¹à¹‰à¸§à¹ˆà¸²à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸­à¸¢à¸¹à¹ˆà¸•à¸£à¸‡à¹„à¸«à¸™"],
    ["3", "à¹€à¸¥à¹ˆà¸™", "à¸—à¸³à¸•à¸²à¸¡à¸„à¸£à¸¹à¸—à¸µà¸¥à¸°à¸£à¸­à¸šà¸à¸±à¸š Metronome"],
    ["4", "à¹€à¸Šà¹‡à¸", "à¸Ÿà¸±à¸‡à¸•à¸±à¸§à¹€à¸­à¸‡ à¹à¸à¹‰à¸ˆà¸¸à¸”à¸žà¸¥à¸²à¸” à¹à¸¥à¹‰à¸§à¸—à¸³ Quiz"]
  ];

  return `
    <section class="lesson-flow" aria-label="à¸¥à¸³à¸”à¸±à¸šà¸à¸²à¸£à¹€à¸£à¸µà¸¢à¸™ Listen See Play Self-check">
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

function renderLessonMedia(weekItem) {
  const youtube = weekItem.youtube;
  const listenFor = weekItem.learn?.listenFor || weekItem.hear || [];
  if (!youtube?.title) return "";

  return `
    <section class="lesson-block lesson-media-block listen-step-block">
      <div class="lesson-media-copy">
        <p class="eyebrow">1. à¸Ÿà¸±à¸‡</p>
        <h3>${youtube.title}</h3>
        <p>à¸£à¸­à¸šà¸™à¸µà¹‰à¹„à¸¡à¹ˆà¸¡à¸µà¸§à¸´à¸”à¸µà¹‚à¸­à¸à¸±à¸‡à¹ƒà¸™à¹à¸­à¸› à¹ƒà¸«à¹‰à¹ƒà¸Šà¹‰ Metronome à¹ƒà¸™à¹à¸–à¸šà¸šà¸™à¹€à¸›à¹‡à¸™à¸„à¸£à¸¹à¸«à¸¥à¸±à¸ à¹à¸¥à¹‰à¸§à¸Ÿà¸±à¸‡à¸§à¹ˆà¸² click à¹€à¸›à¹‡à¸™ Pulse à¸—à¸µà¹ˆà¹€à¸”à¸´à¸™à¸™à¸´à¹ˆà¸‡à¸­à¸¢à¸¹à¹ˆà¸•à¸£à¸‡à¹„à¸«à¸™à¸à¹ˆà¸­à¸™à¸ˆà¸±à¸šà¸à¸µà¸•à¸²à¸£à¹Œà¸„à¸£à¸±à¸š</p>
      </div>
      <div class="listen-prompt">
        <strong>à¹‚à¸ˆà¸—à¸¢à¹Œà¸Ÿà¸±à¸‡</strong>
        <p>à¸•à¸±à¹‰à¸‡ tempo à¸•à¸²à¸¡ Target BPM à¸‚à¸­à¸‡à¸šà¸—à¸™à¸µà¹‰ à¹€à¸„à¸²à¸°à¹€à¸—à¹‰à¸²à¸à¸±à¸š click 30 à¸§à¸´à¸™à¸²à¸—à¸µ à¹à¸¥à¹‰à¸§à¸–à¸²à¸¡à¸•à¸±à¸§à¹€à¸­à¸‡à¸§à¹ˆà¸²à¹€à¸ªà¸µà¸¢à¸‡à¸à¸µà¸•à¸²à¸£à¹Œà¸‚à¸­à¸‡à¹€à¸£à¸²à¸ˆà¸°à¸¥à¸‡à¸à¹ˆà¸­à¸™ click, à¸«à¸¥à¸±à¸‡ click à¸«à¸£à¸·à¸­à¸žà¸­à¸”à¸µà¸à¸±à¸š click</p>
        <ul>
          ${listenFor.map((line) => `<li>${line}</li>`).join("")}
        </ul>
      </div>
    </section>
  `;
}
function renderLearnSection(weekItem) {
  if (weekItem.learn) {
    return `
      <section class="lesson-block learn-block">
        <h3>2. à¹€à¸«à¹‡à¸™ + à¹€à¸‚à¹‰à¸²à¹ƒà¸ˆ</h3>
        <div class="lesson-target">
          <span>Target BPM</span>
          <strong>${weekItem.learn.targetBpm}</strong>
        </div>
        ${renderLessonDiagram(weekItem.learn.diagram)}
        ${weekItem.learn.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        <div class="lesson-learn-grid">
          <div>
            <h4>à¸Ÿà¸±à¸‡à¸­à¸°à¹„à¸£</h4>
            <ul>
              ${weekItem.learn.listenFor.map((line) => `<li>${line}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h4>à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸­à¸°à¹„à¸£</h4>
            <ul>
              ${weekItem.learn.physicalFeel.map((line) => `<li>${line}</li>`).join("")}
            </ul>
          </div>
        </div>
        <h4>à¹€à¸­à¸²à¹„à¸›à¹ƒà¸Šà¹‰à¸à¸±à¸šà¸à¸µà¸•à¸²à¸£à¹Œ</h4>
        <ul>
          ${weekItem.learn.guitarApplication.map((line) => `<li>${line}</li>`).join("")}
        </ul>
        <h4>à¸—à¸³à¸•à¸²à¸¡à¸„à¸£à¸¹à¸—à¸µà¸¥à¸°à¸£à¸­à¸š</h4>
        <ol>
          ${weekItem.learn.guidedSteps.map((line) => `<li>${line}</li>`).join("")}
        </ol>
        <h4>à¸–à¹‰à¸²à¸Ÿà¸±à¸‡à¹à¸¥à¹‰à¸§à¹„à¸¡à¹ˆà¸•à¸£à¸‡ à¹ƒà¸«à¹‰à¹à¸à¹‰à¹à¸šà¸šà¸™à¸µà¹‰</h4>
        <ul>
          ${weekItem.learn.correctionSteps.map((line) => `<li>${line}</li>`).join("")}
        </ul>
        <p><strong>à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡à¸ªà¸±à¹‰à¸™ à¹†:</strong> ${weekItem.learn.miniExample}</p>
        <aside class="teacher-note"><strong>à¸„à¸£à¸¹à¹à¸™à¸°à¸™à¸³</strong><p>${weekItem.learn.teacherNote}</p></aside>
        ${renderLessonReferenceTriggers(weekItem.learn.referenceTriggers)}
        ${renderTabReadingMicroSkill(weekItem.learn.tabMicroSkill)}
        ${renderRhythmVisual(weekItem.visual, true)}
      </section>
    `;
  }

  return `
    <section class="lesson-block learn-block">
      <h3>2. à¹€à¸«à¹‡à¸™ + à¹€à¸‚à¹‰à¸²à¹ƒà¸ˆ</h3>
      <div class="lesson-learn-grid">
        <div>
          <h4>à¸Ÿà¸±à¸‡à¸­à¸°à¹„à¸£</h4>
          <ul>
            ${weekItem.hear.map((line) => `<li>${line}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h4>à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸­à¸°à¹„à¸£</h4>
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
        <span class="duration-tag">5 à¸™à¸²à¸—à¸µ</span>
      </div>
      <h3>${skill.title}</h3>
      <p class="instruction">${skill.coreIdea}</p>
      <div class="month2-mini-tab-card">
        <div class="mini-tab-scroll-area">
          <pre class="tab-block">${skill.miniExample.join("\n")}</pre>
        </div>
      </div>
      <h4>à¸§à¸´à¸˜à¸µà¸‹à¹‰à¸­à¸¡</h4>
      <ul class="drill-steps">
        ${skill.practice.map((line) => `<li>${line}</li>`).join("")}
      </ul>
      <h4>à¸žà¸¥à¸²à¸”à¸šà¹ˆà¸­à¸¢</h4>
      <ul class="drill-steps">
        ${skill.commonMistakes.map((line) => `<li>${line}</li>`).join("")}
      </ul>
      <aside class="teacher-note-box">
        <strong>à¸„à¸£à¸¹à¸‚à¸­à¹à¸™à¸°à¸™à¸³:</strong>
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
          <p class="eyebrow">à¹€à¸Šà¹‡à¸à¸•à¸±à¸§à¹€à¸­à¸‡à¸›à¸£à¸°à¸ˆà¸³à¸§à¸±à¸™</p>
          <h3>à¹€à¸Šà¹‡à¸à¸à¹ˆà¸­à¸™à¸ˆà¸šà¸§à¸±à¸™à¸™à¸µà¹‰</h3>
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
      <h3>à¸žà¸¥à¸²à¸”à¸šà¹ˆà¸­à¸¢à¸•à¸£à¸‡à¸™à¸µà¹‰</h3>
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
      <h3>à¸•à¸´à¸”à¸•à¸£à¸‡à¹„à¸«à¸™ à¹ƒà¸«à¹‰à¹à¸à¹‰à¹à¸šà¸šà¸„à¸£à¸¹</h3>
      <div class="troubleshooting-list">
        ${weekItem.learn.troubleshooting.map((item) => `
          <article>
            <h4>à¸›à¸±à¸à¸«à¸²: ${item.problem}</h4>
            <p><strong>à¸„à¸£à¸¹à¹à¸™à¸°à¸™à¸³:</strong> ${item.advice}</p>
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
      <p><strong>à¸„à¸³à¸–à¸²à¸¡:</strong> ${earTraining.question}</p>
      <p><strong>à¸„à¸£à¸¹à¹ƒà¸šà¹‰à¹ƒà¸«à¹‰:</strong> ${earTraining.hint}</p>
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
            <span>à¸«à¹‰à¸­à¸‡ ${bar.bar}</span>
            <strong>${bar.chord}</strong>
            <p>${bar.direction}</p>
          </article>
        `).join("")}
      </div>
      <p><strong>à¹ƒà¸«à¹‰à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸§à¹ˆà¸²:</strong> ${miniSong.feel}</p>
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
    flow.appendChild(renderMonth2MissingCard("à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸šà¸—à¹€à¸£à¸µà¸¢à¸™à¸ªà¸³à¸«à¸£à¸±à¸šà¸šà¸¥à¹‡à¸­à¸à¸™à¸µà¹‰"));
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

    flow.appendChild(renderMonth2MissingCard(`à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸£à¸­à¸‡à¸£à¸±à¸š lesson block type: ${block.type || "unknown"}`));
  });

  return flow;
}

function renderMonth2TextBlock(block = {}) {
  const card = month2CreateElement("article", "month2-component month2-text-block lesson-text-block");
  card.append(
    month2CreateElement("p", "eyebrow", "à¸šà¸—à¹€à¸£à¸µà¸¢à¸™"),
    month2CreateElement("h3", "", month2FirstText(block.heading, block.title, "à¸šà¸—à¹€à¸£à¸µà¸¢à¸™"))
  );
  month2AppendText(card, block.content || block.body || block.description);
  appendMonth2List(card, "à¸ªà¸£à¸¸à¸›à¸ªà¸±à¹‰à¸™ à¹†", block.list || block.items);

  if (block.teacherNote) {
    const note = month2CreateElement("aside", "teacher-note");
    note.append(month2CreateElement("strong", "", "à¸„à¸£à¸¹à¹à¸™à¸°à¸™à¸³"));
    month2AppendText(note, block.teacherNote);
    card.appendChild(note);
  }

  if (block.instruction || block.practiceInstruction) {
    const instruction = month2CreateElement("div", "instruction-card");
    instruction.append(month2CreateElement("strong", "", "à¸¥à¸­à¸‡à¸—à¸³"));
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
    note.append(month2CreateElement("strong", "", "ðŸ’¡ à¸„à¸£à¸¹à¸‚à¸­à¹à¸™à¸°à¸™à¸³:"));
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
    .replace(/[^a-z0-9à¸-à¹™]+/gi, "-")
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
  if (!visual) return month2AppendResult(renderMonth2MissingCard(`à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸ à¸²à¸žà¸„à¸­à¸à¸µà¸•à¸²à¸£à¹Œà¸ªà¸³à¸«à¸£à¸±à¸šà¸šà¸¥à¹‡à¸­à¸à¸™à¸µà¹‰${visualRef ? ` (${visualRef})` : ""}`), container);

  const card = month2CreateElement("article", `month2-component month2-fretboard-card fretboard-card${visual.responsiveFallback ? " responsive-fretboard" : ""}`);
  card.dataset.visualId = visual.id || visualRef || "";

  const head = month2CreateElement("header", "component-head");
  head.append(
    month2CreateElement("p", "eyebrow", "à¸ à¸²à¸žà¸„à¸­à¸à¸µà¸•à¸²à¸£à¹Œ"),
    month2CreateElement("h3", "", blockData.title || visual.title || "Fretboard Visual"),
    month2CreateElement("p", "caption", visual.caption || "")
  );

  const orientationNote = month2CreateElement(
    "p",
    "orientation-note fretboard-orientation",
    visual.orientationNote || "ðŸ’¡ à¹à¸œà¸™à¸—à¸µà¹ˆà¸„à¸­à¸à¸µà¸•à¸²à¸£à¹Œà¸™à¸µà¹‰à¹ƒà¸Šà¹‰à¸¡à¸¸à¸¡à¸¡à¸­à¸‡à¹€à¸”à¸µà¸¢à¸§à¸à¸±à¸šà¸•à¸²à¸£à¸²à¸‡ TAB: à¹à¸–à¸§à¸šà¸™à¸ªà¸¸à¸”à¸„à¸·à¸­ à¸ªà¸²à¸¢ 1 (à¹€à¸ªà¸µà¸¢à¸‡à¸ªà¸¹à¸‡) à¹à¸¥à¸°à¹à¸–à¸§à¸¥à¹ˆà¸²à¸‡à¸ªà¸¸à¸”à¸„à¸·à¸­ à¸ªà¸²à¸¢ 6 (à¹€à¸ªà¸µà¸¢à¸‡à¹€à¸šà¸ª)"
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
    marker.setAttribute("aria-label", dot.ariaLabel || dot.label || `${displayStr} à¸ªà¸²à¸¢ ${dot.string} à¹€à¸Ÿà¸£à¸• ${dot.fret}`);
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
  if (!tab) return month2AppendResult(renderMonth2MissingCard(`à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µ TAB à¸ªà¸³à¸«à¸£à¸±à¸šà¹à¸šà¸šà¸à¸¶à¸à¸™à¸µà¹‰${tabRef ? ` (${tabRef})` : ""}`), container);

  const card = month2CreateElement("article", "month2-component month2-mini-tab-card mini-tab-card");
  card.dataset.tabId = tab.id || tabRef || "";

  const head = month2CreateElement("header", "component-head");
  head.append(
    month2CreateElement("p", "eyebrow", "à¸•à¸²à¸£à¸²à¸‡ TAB à¸šà¸±à¸™à¸—à¸¶à¸à¹€à¸ªà¸µà¸¢à¸‡"),
    month2CreateElement("h3", "", blockData.title || tab.title || "Mini-TAB"),
    month2CreateElement("span", "bpm-pill", tab.bpm ? `${tab.bpm} BPM` : "")
  );

  const orientationNote = month2CreateElement(
    "p",
    "orientation-note tab-orientation",
    tab.orientationNote || "TAB à¸¡à¸²à¸•à¸£à¸à¸²à¸™: à¸ªà¸²à¸¢ 1 à¸­à¸¢à¸¹à¹ˆà¸šà¸£à¸£à¸—à¸±à¸”à¸šà¸™ à¹à¸¥à¸°à¸ªà¸²à¸¢ 6 à¸­à¸¢à¸¹à¹ˆà¸šà¸£à¸£à¸—à¸±à¸”à¸¥à¹ˆà¸²à¸‡"
  );
  const readNote = month2CreateElement("p", "tab-read-note", "TAB à¸­à¹ˆà¸²à¸™à¸ˆà¸²à¸à¸šà¸™à¸¥à¸‡à¸¥à¹ˆà¸²à¸‡ = à¸ªà¸²à¸¢ 1 à¸–à¸¶à¸‡à¸ªà¸²à¸¢ 6");
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

function renderChordSoundLab(lab, block = {}, labRef = "") {
  const container = block && typeof block.appendChild === "function" ? block : null;
  const blockData = container ? {} : block;
  if (!lab) return month2AppendResult(renderMonth2MissingCard(`à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸«à¹‰à¸­à¸‡à¸—à¸”à¸¥à¸­à¸‡à¸Ÿà¸±à¸‡à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”à¸ªà¸³à¸«à¸£à¸±à¸šà¸šà¸¥à¹‡à¸­à¸à¸™à¸µà¹‰${labRef ? ` (${labRef})` : ""}`), container);

  const isV2Preview = new URLSearchParams(window.location.search).get('soundLabV2Preview') === '1';
  if (lab?.audioEngine?.model === "sound-lab-v2" && !isV2Preview) {
    return month2AppendResult(document.createDocumentFragment(), container);
  }

  const card = month2CreateElement("article", "month2-component month2-chord-lab-card chord-lab-card");
  card.dataset.labId = lab.id || labRef || "";

  const head = month2CreateElement("header", "component-head");

  const eyebrowRow = month2CreateElement("div", "sound-lab-eyebrow-row");
  eyebrowRow.appendChild(month2CreateElement("p", "eyebrow", "à¸«à¹‰à¸­à¸‡à¸—à¸”à¸¥à¸­à¸‡à¸Ÿà¸±à¸‡à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”"));
  if (isV2Preview && lab?.audioEngine?.model === "sound-lab-v2") {
    eyebrowRow.appendChild(month2CreateElement("span", "sound-lab-v2-badge", "V2 PREVIEW"));
  }

  head.append(
    eyebrowRow,
    month2CreateElement("h3", "", blockData.title || lab.title || "à¸«à¹‰à¸­à¸‡à¸—à¸”à¸¥à¸­à¸‡à¸Ÿà¸±à¸‡à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸”"),
    month2CreateElement("p", "caption", lab.description || "")
  );

  if (blockData.instruction) {
    const instruction = month2CreateElement("div", "instruction-card");
    instruction.append(month2CreateElement("strong", "", "à¸§à¸´à¸˜à¸µà¹ƒà¸Šà¹‰"));
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
    playSeqText = seqLabel.length < 30 ? `à¸Ÿà¸±à¸‡ ${seqLabel}` : "à¸Ÿà¸±à¸‡à¸Šà¸¸à¸”à¸™à¸µà¹‰à¸—à¸µà¸¥à¸°à¹€à¸ªà¸µà¸¢à¸‡";
  }
  const progressionButton = month2CreateElement("button", "progression-button", playSeqText);
  progressionButton.type = "button";
  progressionButton.addEventListener("click", () => playSequence(lab, card, blockData));

  const stopButton = month2CreateElement("button", "stop-button", lab.uiCopy?.stop || "à¸«à¸¢à¸¸à¸”à¹€à¸ªà¸µà¸¢à¸‡");
  stopButton.type = "button";
  stopButton.addEventListener("click", () => {
    stopActiveAudio();
    clearActiveChord(card);
    setLabStatus(card, "", {
      state: "STOPPED",
      primary: "à¸«à¸¢à¸¸à¸”à¹€à¸ªà¸µà¸¢à¸‡à¹à¸¥à¹‰à¸§",
      hint: "à¹€à¸¥à¸·à¸­à¸à¸„à¸­à¸£à¹Œà¸”à¸«à¸£à¸·à¸­à¸à¸” Play à¹€à¸žà¸·à¹ˆà¸­à¸Ÿà¸±à¸‡à¹ƒà¸«à¸¡à¹ˆ",
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
    primary: "à¹€à¸¥à¸·à¸­à¸à¸„à¸­à¸£à¹Œà¸”à¸«à¸£à¸·à¸­à¸à¸” Play",
    hint: "Guide Tone Ready",
    sequence: formatSoundLabSequenceLabel(lab)
  });

  const listenList = month2CreateElement("ul", "listen-for-list");
  month2AsArray(lab.listenFor).forEach((item) => listenList.appendChild(month2CreateElement("li", "", item)));
  const fallback = month2CreateElement("p", "audio-fallback-note", lab.uiCopy?.fallback || "à¸–à¹‰à¸²à¹€à¸ªà¸µà¸¢à¸‡à¹„à¸¡à¹ˆà¸—à¸³à¸‡à¸²à¸™ à¹ƒà¸«à¹‰à¹ƒà¸Šà¹‰à¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡à¸šà¸™à¸à¸²à¸£à¹Œà¸”à¹€à¸›à¹‡à¸™à¸•à¸±à¸§à¸™à¸³à¸à¸²à¸£à¸Ÿà¸±à¸‡à¹à¸—à¸™");

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
    else if (lowerText.includes("major to minor")) label = "Major â†’ Minor";
    else if (lowerText.includes("minor to major")) label = "Minor â†’ Major";
    else if (lowerText.includes("pentatonic color switch")) label = "Color Switch";
    else if (lowerText.includes("root") && lowerText.includes("anchor")) label = "Root A";
    else if (lowerText.includes("minor color") && lowerText.includes("c")) label = "Minor b3";
    else if (lowerText.includes("major color") && lowerText.includes("c#")) label = "Major 3";
    else if (lowerText.includes("compare") || lowerText.includes("c vs c#")) label = "Compare";
    else {
      label = rawText.split(/[-â€”â€¢\n]/)[0].trim();
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
  return details.join(" â€¢ ");
}

function formatSoundLabLabel(chord = {}) {
  return `à¸Ÿà¸±à¸‡ ${getSoundLabShortLabel(chord)}`;
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
  if (sequenceItems.length > 3) return "à¸Ÿà¸±à¸‡à¸Šà¸¸à¸”à¸™à¸µà¹‰à¸—à¸µà¸¥à¸°à¹€à¸ªà¸µà¸¢à¸‡";

  const names = sequenceItems
    .map(item => getSoundLabShortLabel(item, 18))
    .filter(Boolean);

  if (!names.length) return "Progression";

  const joined = names.join(" â†’ ");
  if (joined.length > 32) return "à¸Ÿà¸±à¸‡à¸Šà¸¸à¸”à¸™à¸µà¹‰à¸—à¸µà¸¥à¸°à¹€à¸ªà¸µà¸¢à¸‡";
  return joined;
}

function getSoundLabGuideToneText(lab = {}, chord = {}, block = {}) {
  const notes = getLabPlaybackNotes(lab, chord, block);
  if (!notes.length) return "";
  const baseText = notes.join(" â†’ ");
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

async function playLabItem(lab = {}, chord = {}, card, block = {}, options = {}) {
  if (options.clearTimers !== false) clearSequenceTimers();
  stopAllSounds();
  stopOscillators();

  try {
    const context = await ensureAudioContext();
    if (!context) return false;

    const notes = getLabPlaybackNotes(lab, chord, block, options);
    if (!notes.length) return false;

    const timing = getLabItemPlaybackTiming(lab, chord, block);
    setLabStatus(card, "", {
      state: "NOW PLAYING",
      primary: getSoundLabPrimaryName(chord),
      guideTone: notes.join(" â†’ "),
      role: getSoundLabCompactRole(chord),
      sequence: formatSoundLabSequenceLabel(lab)
    });

    await Promise.all(notes.map((note, index) => {
      const timeOffset = timing.sequential ? (index * timing.stepMs) / 1000 : (index * timing.strumMs) / 1000;
      const duration = timing.durationMs / 1000;

      const voice = lab.audioEngine?.voice;
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

      const synthFn = singleAudition
        ? playSoundLabGuideTone
        : (voice === 'soft-piano' || voice === 'piano')
          ? playSoftPiano
          : playPluckedString;

      const finalPeakGain = singleAudition
        ? Number(lab.audioEngine?.guideTonePeakGain || 0.92)
        : peakGain;

      return synthFn(
        note,
        timeOffset,
        duration,
        finalPeakGain,
        { isChord: stackedPlayback }
      );
    }));

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
    const voice = audioEngine.voice;
    const gainMultiplier = audioEngine.gain ?? 1.0;
    const synthFn = (voice === 'soft-piano' || voice === 'piano') ? playSoftPiano : playPluckedString;
    if (!notes.length) return false;
    await Promise.all(notes.map((note, index) => synthFn(
      note,
      (index * strumMs) / 1000,
      duration,
      getStackedChordPeakGain(note, notes.length) * gainMultiplier,
      { isChord: true }
    )));
    return true;
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

function playSequence(lab = {}, card, block = {}) {
  clearSequenceTimers();
  stopAllSounds();
  stopOscillators();

  const labItems = getLabPlaybackItems(lab);
  const chords = month2AsArray(lab.sequence).length
    ? month2AsArray(lab.sequence).map((id) => labItems.find((chord) => chord.id === id)).filter(Boolean)
    : labItems;

  if (!chords.length) {
    setLabStatus(card, "à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸¥à¸³à¸”à¸±à¸šà¸„à¸­à¸£à¹Œà¸”à¹ƒà¸«à¹‰à¸Ÿà¸±à¸‡");
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
      primary: "à¸Ÿà¸±à¸‡à¸„à¸£à¸š Progression à¹à¸¥à¹‰à¸§",
      hint: "à¸¥à¸­à¸‡à¸à¸”à¹à¸•à¹ˆà¸¥à¸°à¸„à¸­à¸£à¹Œà¸”à¸‹à¹‰à¸³ à¹à¸¥à¹‰à¸§à¸Ÿà¸±à¸‡à¸ªà¸µà¸‚à¸­à¸‡ Guide Tone",
      sequence: formatSoundLabSequenceLabel(lab)
    });
  }, nextStartMs);
  sequenceTimers.push(clearTimer);
}

function stopActiveAudio() {
  clearSequenceTimers();
  stopAllSounds();
  stopOscillators();
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
    meta.helperLine = `à¹‚à¸™à¹‰à¸•à¸—à¸µà¹ˆà¹€à¸£à¸µà¸¢à¸™: ${chord.theoryNote} Â· à¹€à¸ªà¸µà¸¢à¸‡à¸—à¸µà¹ˆà¹€à¸›à¸´à¸”à¹ƒà¸«à¹‰à¸Ÿà¸±à¸‡: ${chord.playbackNote}`;
  }

  setLabStatus(card, "", meta);
}

function setLabStatus(card, text = "", meta = {}) {
  const status = card?.querySelector(".chord-lab-status");
  if (!status) return;

  const state = meta.state || "SOUND LAB";
  const primary = meta.primary || text || "à¹€à¸¥à¸·à¸­à¸à¸„à¸­à¸£à¹Œà¸”à¸«à¸£à¸·à¸­à¸à¸” Play";
  const guide = meta.guideTone || "";
  const role = meta.role || "";
  const sequence = meta.sequence || "";
  const hint = meta.hint || "";

  status.replaceChildren();
  status.classList.add("sound-lab-digital-sign");

  const header = month2CreateElement("div", "sound-lab-display-header");
  header.append(
    month2CreateElement("span", "sound-lab-display-state", state),
    month2CreateElement("span", "sound-lab-display-led", "â—")
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
    role || hint || "à¸Ÿà¸±à¸‡à¸ªà¸µà¸‚à¸­à¸‡à¸„à¸­à¸£à¹Œà¸” à¹à¸¥à¹‰à¸§à¹€à¸—à¸µà¸¢à¸šà¸à¸±à¸šà¸Ÿà¸­à¸£à¹Œà¸¡à¸”à¹‰à¸²à¸™à¸¥à¹ˆà¸²à¸‡"
  );

  const sequenceLine = month2CreateElement(
    "div",
    "sound-lab-display-sequence",
    sequence || "à¸žà¸£à¹‰à¸­à¸¡à¸Ÿà¸±à¸‡à¸—à¸µà¸¥à¸°à¸„à¸­à¸£à¹Œà¸”"
  );

  const helperLine = month2CreateElement(
    "div",
    `sound-lab-display-helper${meta.helperLine ? "" : " is-placeholder"}`,
    meta.helperLine || "à¹‚à¸™à¹‰à¸•à¸—à¸µà¹ˆà¹€à¸£à¸µà¸¢à¸™ / à¹€à¸ªà¸µà¸¢à¸‡à¸—à¸µà¹ˆà¹€à¸›à¸´à¸”à¹ƒà¸«à¹‰à¸Ÿà¸±à¸‡"
  );
  if (!meta.helperLine) helperLine.setAttribute("aria-hidden", "true");

  readout.append(primaryLine, roleLine, sequenceLine, helperLine);

  status.append(header, readout);
}

function renderMonth2MissingCard(message) {
  const card = month2CreateElement("article", "month2-component month2-missing-card");
  card.append(month2CreateElement("strong", "", "à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸žà¸£à¹‰à¸­à¸¡"), month2CreateElement("p", "", message));
  return card;
}

function renderRhythmVisual(visual, isNested = false) {
  const blockClass = isNested ? "rhythm-demo-block rhythm-demo-inline" : "lesson-block rhythm-demo-block";

  return `
    <section class="${blockClass}">
      <div class="rhythm-demo-head">
        <div>
          <h3>à¸”à¸¹à¸ˆà¸±à¸‡à¸«à¸§à¸°</h3>
          <p>${visual.title}</p>
        </div>
        <span>${visual.steps.length} à¸Šà¹ˆà¸­à¸‡</span>
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
      <div class="rhythm-legend" aria-label="à¸„à¸³à¸­à¸˜à¸´à¸šà¸²à¸¢à¸ªà¸µà¸‚à¸­à¸‡ rhythm grid">
        <span><i class="legend-hit"></i>à¹€à¸¥à¹ˆà¸™/à¸¥à¸‡à¸„à¸­à¸£à¹Œà¸”</span>
        <span><i class="legend-accent"></i>Accent</span>
        <span><i class="legend-mute"></i>Palm Mute à¸«à¸£à¸·à¸­ ghost</span>
        <span><i class="legend-rest"></i>à¹€à¸§à¹‰à¸™à¹„à¸§à¹‰ à¹à¸•à¹ˆà¸™à¸±à¸šà¹ƒà¸™à¹ƒà¸ˆ</span>
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
  document.getElementById("lessonQuizResult").textContent = `à¸•à¸­à¸šà¸–à¸¹à¸ ${score} / ${weekItem.quiz.length} à¸‚à¹‰à¸­`;
}

function renderFocusedProgressTracking() {
  const completed = getCompletedFoundationWeeks();
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
  list.innerHTML = foundationWeeks.map((weekItem) => `
    <label class="progress-item">
      <input type="checkbox" data-complete-week="${weekItem.number}" ${completed.includes(weekItem.number) ? "checked" : ""} />
      <span>
        <strong>à¸ªà¸±à¸›à¸”à¸²à¸«à¹Œà¸—à¸µà¹ˆ ${weekItem.number}</strong>
        ${weekItem.title}
      </span>
    </label>
  `).join("");

  document.querySelectorAll("[data-complete-week]").forEach((input) => {
    input.addEventListener("change", () => {
      const nextCompleted = Array.from(document.querySelectorAll("[data-complete-week]:checked")).map((item) => Number(item.dataset.completeWeek));
      setCompletedFoundationWeeks(nextCompleted);
      focusedSelectedWeek = getCurrentFoundationWeek();
      renderFocusedApp();
    });
  });
}

function savePracticeNotes() {
  const noteInput = document.getElementById("practiceNotes");
  const savedLabel = document.getElementById("notesSaved");
  if (!noteInput) return;
  safeSetItem(foundationStorage.notes, noteInput.value);
  if (savedLabel) savedLabel.textContent = "à¸šà¸±à¸™à¸—à¸¶à¸à¹„à¸§à¹‰à¹ƒà¸™à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¹à¸¥à¹‰à¸§";
}

function renderPracticeNotes() {
  const noteInput = document.getElementById("practiceNotes");
  if (!noteInput) return;
  noteInput.value = localStorage.getItem(foundationStorage.notes) || "";
}

function renderPracticeStudioPreviewShell() {
  const existing = document.getElementById("practiceStudioPreviewShell");
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
      "à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸¡à¸·à¸­à¸‹à¹‰à¸­à¸¡à¹à¸šà¸šà¹‚à¸•à¹‰à¸•à¸­à¸š à¸ªà¸³à¸«à¸£à¸±à¸šà¸à¸¶à¸à¸„à¸­à¸à¸µà¸•à¸²à¸£à¹Œ à¹€à¸ªà¸µà¸¢à¸‡à¸„à¸­à¸£à¹Œà¸” à¹à¸¥à¸° groove"
    )
  );
  header.querySelector("h3")?.setAttribute("id", "practiceStudioPreviewTitle");

  const contentDiv = month2CreateElement("div", "practice-studio-preview-content");

  const card = month2CreateElement("div", "practice-studio-preview-card");

  const badge = month2CreateElement("span", "fsl-badge", "PREVIEW");
  const title = month2CreateElement("h4", "fsl-card-title", "Fretboard Studio Lite");
  const desc = month2CreateElement("p", "fsl-card-desc", "à¸à¸¶à¸à¸ˆà¸³à¸„à¸­ / interval / chord tones à¹à¸šà¸šà¹‚à¸•à¹‰à¸•à¸­à¸š");

  const openBtn = month2CreateElement("button", "fsl-btn fsl-open-btn", "à¹€à¸›à¸´à¸” Studio");
  openBtn.addEventListener("click", () => {
    openFretboardStudioModal();
  });

  card.append(badge, title, desc, openBtn);
  contentDiv.appendChild(card);

  shell.append(header, contentDiv);
  return shell;
}

let fslSoundEnabled = false;

function getFslAudioEngine() {
  const engine = window.AudioEngine;
  return engine &&
    typeof engine.unlock === "function" &&
    typeof engine.playNote === "function" &&
    typeof engine.stopChannel === "function"
      ? engine
      : null;
}

function stopFslAudio() {
  fslSoundEnabled = false;
  const engine = getFslAudioEngine();
  if (engine) engine.stopChannel("fsl");
}

const FSL_PLAYBACK_PITCH = {
  C: "C4", "C#": "C#4", Db: "Db4",
  D: "D4", "D#": "D#4", Eb: "Eb4",
  E: "E4", F: "F4", "F#": "F#4", Gb: "Gb4",
  G: "G4", "G#": "G#4", Ab: "Ab4",
  A: "A4", "A#": "A#4", Bb: "Bb4", B: "B4"
};

function openFretboardStudioModal() {
  if (document.getElementById("fsl-studio-modal")) return;

  fslSoundEnabled = false; // Reset on every mount

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
  closeBtn.textContent = "à¸›à¸´à¸” Studio";

  headerDiv.append(titleDiv, closeBtn);

  const closeModal = () => {
    stopFslAudio();
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

  const toolRoot = document.createElement("div");
  toolRoot.className = "fsl-studio-tool-root fsl-app-container";

  modalContent.append(headerDiv, toolRoot);
  modalOverlay.append(modalContent);
  document.body.appendChild(modalOverlay);

  mountFretboardStudioLite(toolRoot);
}

function mountFretboardStudioLite(containerElement) {
  if (!containerElement || containerElement.dataset.fslMounted === "true") return;
  containerElement.dataset.fslMounted = "true";

  const fslSharpNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const fslFlatNotes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const fslStringBases = [4, 11, 7, 2, 9, 4];
  const fslFlatKeys = ["F", "Bb", "Eb"];
  const fslOverlayIntervals = {
    notes: [0, 2, 4, 5, 7, 9, 11],
    intervals: [0, 2, 4, 5, 7, 9, 11],
    triad: [0, 4, 7],
    "guide-tones": [4, 10],
    "minor-pentatonic": [0, 3, 5, 7, 10],
    "major-pentatonic": [0, 2, 4, 7, 9]
  };
  const fslIntervalRoles = {
    0: "à¸šà¹‰à¸²à¸™à¸‚à¸­à¸‡à¸„à¸µà¸¢à¹Œ à¸ˆà¸¸à¸”à¸žà¸±à¸ à¸ˆà¸¸à¸”à¹€à¸£à¸´à¹ˆà¸¡ à¹à¸¥à¸°à¸ˆà¸¸à¸”à¸ˆà¸š phrase",
    2: "Passing tone / Color tone à¸—à¸µà¹ˆà¸Šà¹ˆà¸§à¸¢à¹ƒà¸«à¹‰ phrase à¹€à¸”à¸´à¸™à¸•à¹ˆà¸­",
    3: "à¸ªà¸µ minor / blues sadness",
    4: "à¸ªà¸µ major / bright resolution",
    5: "à¹€à¸ªà¸µà¸¢à¸‡ 4 à¸—à¸µà¹ˆà¸Šà¹ˆà¸§à¸¢à¸žà¸²à¹„à¸›à¸«à¸² 3 à¸«à¸£à¸·à¸­ 5",
    7: "à¹€à¸ªà¸µà¸¢à¸‡ 5 à¹‚à¸„à¸£à¸‡à¸„à¸­à¸£à¹Œà¸”à¸—à¸µà¹ˆà¸¡à¸±à¹ˆà¸™à¸„à¸‡",
    9: "Passing tone / Color tone",
    10: "blues / dominant tension",
    11: "Major 7th tension"
  };
  const fslIntervalNames = {
    0: "1 (Root)",
    1: "b2",
    2: "2",
    3: "b3",
    4: "3",
    5: "4",
    6: "b5",
    7: "5",
    8: "#5",
    9: "6",
    10: "b7",
    11: "7"
  };
  const fslState = {
    key: "A",
    overlay: "minor-pentatonic",
    position: "0-12",
    selectedNoteName: null,
    focusInterval: "all",
    challenge: "",
    challengeFound: []
  };

  containerElement.innerHTML = `
    <div class="fsl-app">
      <div class="fsl-card fsl-hero-card">
        <div class="fsl-hero-copy">
          <span class="fsl-preview-badge">PREVIEW</span>
          <h4 class="fsl-app-title">Fretboard Studio Lite</h4>
          <p class="fsl-app-copy">à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸¡à¸·à¸­à¸à¸¶à¸à¸ˆà¸³à¸„à¸­à¸à¸µà¸•à¸²à¸£à¹Œà¹à¸šà¸šà¹‚à¸•à¹‰à¸•à¸­à¸š: à¹€à¸£à¸´à¹ˆà¸¡à¸ˆà¸²à¸ root à¹à¸¥à¹‰à¸§à¸„à¹ˆà¸­à¸¢à¹€à¸«à¹‡à¸™à¸ªà¸µà¸‚à¸­à¸‡ b3, 3, 5 à¹à¸¥à¸° b7 à¹ƒà¸™à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¹€à¸”à¸µà¸¢à¸§à¸à¸±à¸™</p>
        </div>
        <p class="fsl-status-line">Preview-only Â· à¹„à¸¡à¹ˆà¸¡à¸µà¸à¸²à¸£à¸šà¸±à¸™à¸—à¸¶à¸ progress</p>
      </div>

      <div class="fsl-teaching-panel">
        <p><strong>à¸„à¸³à¹à¸™à¸°à¸™à¸³:</strong> à¸§à¸±à¸™à¸™à¸µà¹‰à¹ƒà¸«à¹‰à¸«à¸²à¹€à¸ªà¸µà¸¢à¸‡à¸šà¹‰à¸²à¸™ (Root) à¸à¹ˆà¸­à¸™ à¸ˆà¸²à¸à¸™à¸±à¹‰à¸™à¸«à¸² b3/3 à¹€à¸žà¸·à¹ˆà¸­à¸Ÿà¸±à¸‡à¸ªà¸µ minor/major à¸ªà¹ˆà¸§à¸™ b7 à¸„à¸·à¸­à¸à¸¥à¸´à¹ˆà¸™ blues/dominant tension.</p>
      </div>

      <div class="fsl-dashboard-grid">
        <div class="fsl-panel-card">
          <h5 class="fsl-panel-title">à¸•à¸±à¹‰à¸‡à¸„à¹ˆà¸² Fretboard</h5>
          <label class="fsl-control-group">
            <span class="fsl-control-label">Key</span>
            <select class="fsl-select" data-fsl-key-select>
              <option value="C">C</option>
              <option value="G">G</option>
              <option value="D">D</option>
              <option value="A" selected>A</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="Bb">Bb</option>
              <option value="Eb">Eb</option>
            </select>
          </label>
          <label class="fsl-control-group">
            <span class="fsl-control-label">Overlay</span>
            <select class="fsl-select" data-fsl-overlay-select>
              <option value="notes">Diatonic Notes</option>
              <option value="intervals">Intervals</option>
              <option value="triad">Triad (1-3-5)</option>
              <option value="guide-tones">7th Guide Tones (3, b7)</option>
              <option value="minor-pentatonic" selected>Minor Pentatonic</option>
              <option value="major-pentatonic">Major Pentatonic</option>
            </select>
          </label>
          <label class="fsl-control-group">
            <span class="fsl-control-label">Position</span>
            <select class="fsl-select" data-fsl-position-select>
              <option value="0-12" selected>Full (0-12)</option>
              <option value="0-4">Open (0-4)</option>
              <option value="5-9">Mid (5-9)</option>
            </select>
          </label>
          <label class="fsl-control-group">
            <span class="fsl-control-label">Sound</span>
            <label class="fsl-sound-toggle-label" style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" id="fsl-sound-toggle">
              <span id="fsl-sound-status-text">Off</span>
            </label>
          </label>
        </div>

        <div class="fsl-panel-card">
          <h5 class="fsl-panel-title">à¹‚à¸™à¹‰à¸•à¸—à¸µà¹ˆà¹€à¸¥à¸·à¸­à¸ (Inspector)</h5>
          <div class="fsl-inspector-empty" data-fsl-inspector-content>à¸ˆà¸´à¹‰à¸¡à¸—à¸µà¹ˆà¹‚à¸™à¹‰à¸•à¸šà¸™à¸„à¸­à¸à¸µà¸•à¸²à¸£à¹Œà¹€à¸žà¸·à¹ˆà¸­à¸”à¸¹à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”</div>
        </div>

        <div class="fsl-panel-card">
          <h5 class="fsl-panel-title">à¸ªà¸µ Major vs Minor</h5>
          <div class="fsl-compare-content" data-fsl-compare-content></div>
        </div>

        <div class="fsl-panel-card">
          <h5 class="fsl-panel-title">à¹‚à¸«à¸¡à¸”à¸—à¹‰à¸²à¸—à¸²à¸¢ (Challenge)</h5>
          <div class="fsl-challenge-controls">
            <select class="fsl-select" data-fsl-challenge-select>
              <option value="">à¹€à¸¥à¸·à¸­à¸à¸šà¸—à¸—à¸”à¸ªà¸­à¸š...</option>
              <option value="0">à¸«à¸² Root à¹ƒà¸«à¹‰à¸„à¸£à¸š</option>
              <option value="3">à¸«à¸² b3 à¹ƒà¸«à¹‰à¸„à¸£à¸š</option>
              <option value="4">à¸«à¸² 3 à¹ƒà¸«à¹‰à¸„à¸£à¸š</option>
              <option value="10">à¸«à¸² b7 à¹ƒà¸«à¹‰à¸„à¸£à¸š</option>
            </select>
            <button type="button" class="fsl-btn" data-fsl-challenge-reset>Reset</button>
          </div>
          <div class="fsl-challenge-feedback" data-fsl-challenge-feedback>à¹€à¸¥à¸·à¸­à¸à¸šà¸—à¸—à¸”à¸ªà¸­à¸šà¹€à¸žà¸·à¹ˆà¸­à¹€à¸£à¸´à¹ˆà¸¡</div>
        </div>
      </div>

      <div class="fsl-focus-bar">
        <strong>Interval Focus:</strong>
        <button type="button" class="fsl-focus-chip" data-fsl-interval="0">Root</button>
        <button type="button" class="fsl-focus-chip" data-fsl-interval="3">b3</button>
        <button type="button" class="fsl-focus-chip" data-fsl-interval="4">3</button>
        <button type="button" class="fsl-focus-chip" data-fsl-interval="7">5</button>
        <button type="button" class="fsl-focus-chip" data-fsl-interval="10">b7</button>
        <button type="button" class="fsl-focus-chip fsl-active" data-fsl-interval="all">Show All</button>
      </div>

      <div class="fsl-fretboard-wrapper">
        <div class="fsl-fretboard" data-fsl-fretboard></div>
        <div class="fsl-fret-markers" data-fsl-fret-markers></div>
      </div>

      <div class="fsl-panel-card">
        <h5 class="fsl-panel-title">à¸ªà¸±à¸à¸¥à¸±à¸à¸©à¸“à¹Œ (Legend)</h5>
        <ul class="fsl-legend-list">
          <li><span class="fsl-legend-dot fsl-root"></span> <strong>Root (1)</strong> = à¸šà¹‰à¸²à¸™ (Home)</li>
          <li><span class="fsl-legend-dot fsl-major-3"></span> <strong>3</strong> = à¸ªà¸µ Major</li>
          <li><span class="fsl-legend-dot fsl-minor-3"></span> <strong>b3</strong> = à¸ªà¸µ Minor</li>
          <li><span class="fsl-legend-dot fsl-fifth"></span> <strong>5</strong> = à¹‚à¸„à¸£à¸‡à¸„à¸­à¸£à¹Œà¸” (Power)</li>
          <li><span class="fsl-legend-dot fsl-flat-7"></span> <strong>b7</strong> = Blues / Dominant Tension</li>
          <li><span class="fsl-legend-dot fsl-pentatonic"></span> <strong>Pentatonic</strong> = Safe note</li>
        </ul>
      </div>
    </div>
  `;

  const fslRefs = {
    keySelect: containerElement.querySelector("[data-fsl-key-select]"),
    overlaySelect: containerElement.querySelector("[data-fsl-overlay-select]"),
    positionSelect: containerElement.querySelector("[data-fsl-position-select]"),
    challengeSelect: containerElement.querySelector("[data-fsl-challenge-select]"),
    challengeReset: containerElement.querySelector("[data-fsl-challenge-reset]"),
    challengeFeedback: containerElement.querySelector("[data-fsl-challenge-feedback]"),
    compareContent: containerElement.querySelector("[data-fsl-compare-content]"),
    inspectorContent: containerElement.querySelector("[data-fsl-inspector-content]"),
    fretboard: containerElement.querySelector("[data-fsl-fretboard]"),
    fretMarkers: containerElement.querySelector("[data-fsl-fret-markers]"),
    soundToggle: containerElement.querySelector("#fsl-sound-toggle"),
    soundStatus: containerElement.querySelector("#fsl-sound-status-text")
  };

  if (fslRefs.soundToggle) {
    fslRefs.soundToggle.checked = false;
    fslRefs.soundToggle.addEventListener("change", async (e) => {
      if (e.target.checked) {
        const engine = getFslAudioEngine();
        if (engine) {
          fslRefs.soundStatus.textContent = "Unlocking...";
          try {
            const unlocked = await engine.unlock();
            
            // Fix stale promise race: user might have unchecked while unlocking
            if (!e.target.checked) return;

            if (unlocked) {
              fslSoundEnabled = true;
              fslRefs.soundStatus.textContent = "On";
            } else {
              fslSoundEnabled = false;
              e.target.checked = false;
              fslRefs.soundStatus.textContent = "Unavailable";
            }
          } catch (err) {
            if (!e.target.checked) return;
            console.warn("[FSL] Engine unlock error", err);
            fslSoundEnabled = false;
            e.target.checked = false;
            fslRefs.soundStatus.textContent = "Unavailable";
          }
        } else {
          fslSoundEnabled = false;
          e.target.checked = false;
          fslRefs.soundStatus.textContent = "Unavailable";
        }
      } else {
        stopFslAudio();
        fslRefs.soundStatus.textContent = "Off";
      }
    });
  }

  fslRefs.keySelect?.addEventListener("change", (event) => {
    fslState.key = event.target.value;
    fslState.challengeFound = [];
    fslResetSelection();
    fslRender();
  });

  fslRefs.overlaySelect?.addEventListener("change", (event) => {
    fslState.overlay = event.target.value;
    fslResetSelection();
    fslRender();
  });

  fslRefs.positionSelect?.addEventListener("change", (event) => {
    fslState.position = event.target.value;
    fslState.challengeFound = [];
    fslRender();
  });

  containerElement.querySelectorAll(".fsl-focus-chip").forEach((chip) => {
    chip.addEventListener("click", (event) => {
      containerElement.querySelectorAll(".fsl-focus-chip").forEach((item) => item.classList.remove("fsl-active"));
      event.currentTarget.classList.add("fsl-active");
      fslState.focusInterval = event.currentTarget.dataset.fslInterval || "all";
      fslRender();
    });
  });

  fslRefs.challengeSelect?.addEventListener("change", (event) => {
    fslState.challenge = event.target.value;
    fslState.challengeFound = [];
    fslResetSelection();
    fslUpdateChallengeFeedback();
    fslRender();
  });

  fslRefs.challengeReset?.addEventListener("click", () => {
    fslState.challengeFound = [];
    fslResetSelection();
    fslUpdateChallengeFeedback();
    fslRender();
  });

  function fslResetSelection() {
    fslState.selectedNoteName = null;
    fslRenderInspectorEmpty();
  }

  function fslGetNoteName(index) {
    const notes = fslFlatKeys.includes(fslState.key) ? fslFlatNotes : fslSharpNotes;
    return notes[index % 12];
  }

  function fslGetRootIndex() {
    const notes = fslFlatKeys.includes(fslState.key) ? fslFlatNotes : fslSharpNotes;
    return notes.indexOf(fslState.key);
  }

  function fslGetIntervalClass(interval) {
    switch (interval) {
      case 0: return "fsl-root";
      case 4: return "fsl-major-3";
      case 3: return "fsl-minor-3";
      case 7: return "fsl-fifth";
      case 10: return "fsl-flat-7";
      case 2:
      case 5:
      case 9:
        return "fsl-pentatonic";
      default:
        return "";
    }
  }

  function fslGetIntervalName(interval) {
    return fslIntervalNames[interval] || String(interval);
  }

  function fslUpdateComparePanel() {
    if (!fslRefs.compareContent) return;
    const rootIndex = fslGetRootIndex();
    const minorThirdName = fslGetNoteName((rootIndex + 3) % 12);
    const majorThirdName = fslGetNoteName((rootIndex + 4) % 12);

    fslRefs.compareContent.innerHTML = `
      <div class="fsl-compare-item">
        <div class="fsl-compare-note fsl-minor">${minorThirdName}</div>
        <div class="fsl-compare-label">b3 (Minor)</div>
      </div>
      <div class="fsl-compare-item">
        <div class="fsl-compare-note fsl-major">${majorThirdName}</div>
        <div class="fsl-compare-label">3 (Major)</div>
      </div>
    `;
  }

  function fslUpdateChallengeFeedback() {
    if (!fslRefs.challengeFeedback) return;
    if (!fslState.challenge) {
      fslRefs.challengeFeedback.className = "fsl-challenge-feedback";
      fslRefs.challengeFeedback.textContent = "à¹€à¸¥à¸·à¸­à¸à¸šà¸—à¸—à¸”à¸ªà¸­à¸šà¹€à¸žà¸·à¹ˆà¸­à¹€à¸£à¸´à¹ˆà¸¡";
      return;
    }

    const rootIndex = fslGetRootIndex();
    let totalTargets = 0;
    const startFret = fslState.position === "5-9" ? 5 : 0;
    let endFret = 12;
    if (fslState.position === "0-4") endFret = 4;
    if (fslState.position === "5-9") endFret = 9;

    for (let stringIndex = 0; stringIndex < 6; stringIndex += 1) {
      for (let fret = startFret; fret <= endFret; fret += 1) {
        const noteIndex = (fslStringBases[stringIndex] + fret) % 12;
        const interval = (noteIndex - rootIndex + 12) % 12;
        if (String(interval) === fslState.challenge) totalTargets += 1;
      }
    }

    const found = fslState.challengeFound.length;
    if (found >= totalTargets && totalTargets > 0) {
      fslRefs.challengeFeedback.className = "fsl-challenge-feedback fsl-feedback-correct";
      fslRefs.challengeFeedback.textContent = `à¸¢à¸­à¸”à¹€à¸¢à¸µà¹ˆà¸¢à¸¡! à¸«à¸²à¸„à¸£à¸šà¸—à¸±à¹‰à¸‡à¸«à¸¡à¸” ${totalTargets} à¸•à¸±à¸§à¹à¸¥à¹‰à¸§`;
    } else {
      fslRefs.challengeFeedback.className = "fsl-challenge-feedback";
      fslRefs.challengeFeedback.textContent = `à¸žà¸šà¹à¸¥à¹‰à¸§ ${found} / ${totalTargets}`;
    }
  }

  function fslPlayNotePreview(noteName) {
    if (!fslSoundEnabled) return;
    const engine = getFslAudioEngine();
    if (!engine) return;
    const mappedPitch = FSL_PLAYBACK_PITCH[noteName];
    if (!mappedPitch) return;

    try {
      const playPromise = engine.playNote({
        channel: "fsl",
        profile: "fsl-note-preview",
        note: mappedPitch,
        velocity: 0.7
      });
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((error) => {
          console.warn("[FSL] Note preview failed.", error);
        });
      }
    } catch (error) {
      console.warn("[FSL] Note preview sync error.", error);
    }
  }

  function fslHandleNoteClick(noteData, noteNode) {
    fslPlayNotePreview(noteData.noteName);

    if (fslState.challenge) {
      fslHandleChallengeClick(noteData, noteNode);
      return;
    }

    fslState.selectedNoteName = noteData.noteName;
    fslUpdateInspector(noteData);
    fslRender();
  }

  function fslHandleChallengeClick(noteData, noteNode) {
    const isCorrect = String(noteData.interval) === fslState.challenge;
    const noteId = `${noteData.stringIndex}-${noteData.fret}`;

    if (isCorrect) {
      if (!fslState.challengeFound.includes(noteId)) {
        fslState.challengeFound.push(noteId);
        noteNode.classList.add("fsl-anim-correct");
        setTimeout(() => noteNode.classList.remove("fsl-anim-correct"), 300);
        fslUpdateChallengeFeedback();
        fslRender();
      }
      return;
    }

    noteNode.classList.add("fsl-anim-wrong");
    setTimeout(() => noteNode.classList.remove("fsl-anim-wrong"), 300);
  }

  function fslRenderInspectorEmpty() {
    if (!fslRefs.inspectorContent) return;
    fslRefs.inspectorContent.innerHTML = "à¸ˆà¸´à¹‰à¸¡à¸—à¸µà¹ˆà¹‚à¸™à¹‰à¸•à¸šà¸™à¸„à¸­à¸à¸µà¸•à¸²à¸£à¹Œà¹€à¸žà¸·à¹ˆà¸­à¸”à¸¹à¸£à¸²à¸¢à¸¥à¸°à¹€à¸­à¸µà¸¢à¸”";
    fslRefs.inspectorContent.className = "fsl-inspector-empty";
  }

  function fslUpdateInspector(noteData) {
    if (!fslRefs.inspectorContent) return;
    const roleText = fslIntervalRoles[noteData.interval] || "Passing tone";
    fslRefs.inspectorContent.className = "fsl-inspector-data";
    fslRefs.inspectorContent.innerHTML = `
      <div class="fsl-ins-row">
        <span class="fsl-ins-label">Note:</span>
        <span class="fsl-ins-val">${noteData.noteName}</span>
      </div>
      <div class="fsl-ins-row">
        <span class="fsl-ins-label">Position:</span>
        <span class="fsl-ins-val">à¸ªà¸²à¸¢ ${noteData.stringNumber} à¹€à¸Ÿà¸£à¸• ${noteData.fret}</span>
      </div>
      <div class="fsl-ins-row">
        <span class="fsl-ins-label">Interval:</span>
        <span class="fsl-ins-val">${fslGetIntervalName(noteData.interval)}</span>
      </div>
      <div class="fsl-ins-desc">${roleText}</div>
    `;
  }

  function fslRender() {
    if (!fslRefs.fretboard || !fslRefs.fretMarkers) return;
    const rootIndex = fslGetRootIndex();
    const activeIntervals = fslOverlayIntervals[fslState.overlay] || [];
    const startFret = fslState.position === "5-9" ? 5 : 0;
    let endFret = 12;
    if (fslState.position === "0-4") endFret = 4;
    if (fslState.position === "5-9") endFret = 9;

    fslRefs.fretboard.innerHTML = "";
    fslRefs.fretMarkers.innerHTML = "";
    fslRefs.fretboard.className = fslState.focusInterval !== "all" ? "fsl-fretboard fsl-focus-mode" : "fsl-fretboard";

    fslStringBases.forEach((base, stringIndex) => {
      const stringRow = document.createElement("div");
      stringRow.className = "fsl-string-row";
      const stringNumber = stringIndex + 1;

      for (let fret = startFret; fret <= endFret; fret += 1) {
        const fretCell = document.createElement("div");
        fretCell.className = `fsl-fret-cell fsl-fret-${fret}`;

        const noteIndex = (base + fret) % 12;
        const interval = (noteIndex - rootIndex + 12) % 12;
        const isActive = activeIntervals.includes(interval);
        const noteName = fslGetNoteName(noteIndex);
        const intervalClass = fslGetIntervalClass(interval);
        const noteNode = document.createElement("button");
        noteNode.type = "button";
        noteNode.className = intervalClass ? `fsl-note-node ${intervalClass}` : "fsl-note-node";
        noteNode.dataset.active = String(isActive);
        noteNode.setAttribute("aria-label", `String ${stringNumber} fret ${fret} note ${noteName} interval ${fslGetIntervalName(interval)}`);

        if (fslState.focusInterval !== "all") {
          noteNode.dataset.focus = String(String(interval) === fslState.focusInterval);
        }

        if (fslState.challenge) {
          const noteId = `${stringIndex}-${fret}`;
          if (fslState.challengeFound.includes(noteId)) {
            noteNode.dataset.active = "true";
            noteNode.classList.add("fsl-is-selected");
          } else {
            noteNode.dataset.active = "false";
          }
        }

        if (!fslState.challenge && fslState.selectedNoteName && noteName === fslState.selectedNoteName) {
          noteNode.classList.add("fsl-is-family");
        }

        noteNode.textContent = fslState.overlay === "intervals" ? fslGetIntervalName(interval) : noteName;
        const noteData = { noteName, stringIndex, stringNumber, fret, interval };
        noteNode.addEventListener("click", () => {
          containerElement.querySelectorAll(".fsl-note-node").forEach((node) => node.classList.remove("fsl-is-selected"));
          if (!fslState.challenge) noteNode.classList.add("fsl-is-selected");
          fslHandleNoteClick(noteData, noteNode);
        });

        fretCell.appendChild(noteNode);

        if (stringIndex === 2 && [3, 5, 7, 9, 12].includes(fret)) {
          const inlay = document.createElement("div");
          inlay.className = "fsl-inlay-dot";
          fretCell.appendChild(inlay);
        }

        stringRow.appendChild(fretCell);
      }

      fslRefs.fretboard.appendChild(stringRow);
    });

    for (let fret = startFret; fret <= endFret; fret += 1) {
      const marker = document.createElement("div");
      marker.className = `fsl-fret-marker-cell fsl-fret-${fret}`;
      marker.textContent = fret === 0 ? "Nut" : String(fret);
      fslRefs.fretMarkers.appendChild(marker);
    }

    fslUpdateComparePanel();
    fslUpdateChallengeFeedback();
  }

  fslRender();
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
    month2CreateElement("p", "eyebrow", "à¸„à¸­à¸£à¹Œà¸ªà¹€à¸ªà¸£à¸´à¸¡à¸ªà¸±à¹‰à¸™ à¹†"),
    month2CreateElement("h2", "", "à¸„à¸­à¸£à¹Œà¸ªà¹€à¸ªà¸£à¸´à¸¡à¸ªà¸±à¹‰à¸™ à¹†"),
    isDevMode
      ? month2CreateElement("p", "mini-course-dev-notice", "[Dev Preview] à¹à¸ªà¸”à¸‡à¸—à¸¸à¸ Mini Course à¸£à¸§à¸¡à¸—à¸µà¹ˆà¸¢à¸±à¸‡à¸‹à¹ˆà¸­à¸™à¸­à¸¢à¸¹à¹ˆ")
      : month2CreateElement("p", "", "")
  );
  shelf.appendChild(header);

  const courses = getMiniCourses();
  if (!courses.length) {
    shelf.appendChild(renderMiniCourseFallback("à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µ Mini Course à¹ƒà¸«à¹‰à¹€à¸›à¸´à¸”à¹ƒà¸™à¸•à¸­à¸™à¸™à¸µà¹‰", "MC_NO_COURSES"));
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

  const chipLabel = meta.visibility === "public" ? "à¹€à¸ªà¸£à¸´à¸¡à¸žà¸·à¹‰à¸™à¸à¸²à¸™" : "Preview / Hidden";
  card.append(
    month2CreateElement("p", "panel-label", chipLabel),
    month2CreateElement("h3", "", meta.title || "Rhythm Notation Starter"),
    month2CreateElement("p", "mini-course-thai-title", meta.thaiTitle || "à¸­à¹ˆà¸²à¸™à¸„à¹ˆà¸²à¸ˆà¸±à¸‡à¸«à¸§à¸°: à¸•à¸±à¸§à¸”à¸³ à¸•à¸±à¸§à¸«à¸¢à¸¸à¸” à¹à¸¥à¸°à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸•à¸-à¸¢à¸"),
    month2CreateElement("p", "", `${totalDays} à¸§à¸±à¸™ Â· à¸§à¸±à¸™à¸¥à¸°à¸›à¸£à¸°à¸¡à¸²à¸“ ${meta.estimatedMinutesPerDay || 10} à¸™à¸²à¸—à¸µ Â· à¸—à¸³à¹à¸¥à¹‰à¸§ ${completedCount}/${totalDays} à¸§à¸±à¸™`)
  );

  const ctaLabel = meta.visibility === "public" ? "à¹€à¸›à¸´à¸”à¸„à¸­à¸£à¹Œà¸ªà¹€à¸ªà¸£à¸´à¸¡" : "à¹€à¸›à¸´à¸” Mini Course";
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
    month2CreateElement("p", "", meta.thaiTitle || "à¸­à¹ˆà¸²à¸™à¸„à¹ˆà¸²à¸ˆà¸±à¸‡à¸«à¸§à¸°: à¸•à¸±à¸§à¸”à¸³ à¸•à¸±à¸§à¸«à¸¢à¸¸à¸” à¹à¸¥à¸°à¸ˆà¸±à¸‡à¸«à¸§à¸°à¸•à¸-à¸¢à¸"),
    month2CreateElement("p", "mini-course-progress-copy", progress.completedDays.length ? `à¸—à¸³à¹à¸¥à¹‰à¸§ ${progress.completedDays.length}/${totalDays} à¸§à¸±à¸™` : "à¹€à¸£à¸´à¹ˆà¸¡à¸ˆà¸²à¸ Day 1 à¹à¸šà¸šà¸Šà¹‰à¸² à¹† à¸à¹ˆà¸­à¸™à¸„à¸£à¸±à¸š")
  );

  const resetButton = month2CreateElement("button", "small-button mini-course-reset-button", "à¸¥à¹‰à¸²à¸‡ Mini Course");
  resetButton.type = "button";
  resetButton.addEventListener("click", () => handleMiniCourseReset(meta.id));
  head.append(copy, resetButton);
  detail.appendChild(head);
  detail.appendChild(month2CreateElement("p", "mini-course-reset-context", "Mini Course progress is separate. Main reset will not clear this progress; use the Mini Course reset inside this panel if you want to clear it."));

  detail.appendChild(renderMiniCourseDaySelector(course, progress));

  if (!month2AsArray(course?.modules).length) {
    detail.appendChild(renderMiniCourseFallback("Mini Course à¸™à¸µà¹‰à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸šà¸—à¸à¸¶à¸à¸„à¸£à¸±à¸š", "MC_EMPTY_MODULES"));
    return detail;
  }

  if (!module) {
    detail.appendChild(renderMiniCourseFallback("à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ªà¸³à¸«à¸£à¸±à¸šà¸§à¸±à¸™à¸™à¸µà¹‰", "MC_DAY_NOT_FOUND"));
    return detail;
  }

  detail.appendChild(renderMiniCourseModule(module, progress));

  if (month2AsArray(course?.audioAssets).some((asset) => asset?.type === "internal-metronome")) {
    const audioNote = month2CreateElement("aside", "mini-course-audio-note");
    audioNote.append(
      month2CreateElement("strong", "", "Metronome"),
      month2CreateElement("p", "", "à¹ƒà¸Šà¹‰ Metronome à¸”à¹‰à¸²à¸™à¸šà¸™à¹à¸—à¸™à¹€à¸ªà¸µà¸¢à¸‡à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡à¹„à¸”à¹‰à¹€à¸¥à¸¢à¸„à¸£à¸±à¸š à¹„à¸¡à¹ˆà¸¡à¸µ audio file à¸«à¸£à¸·à¸­à¹€à¸ªà¸µà¸¢à¸‡à¸ˆà¸²à¸ network à¹ƒà¸™ Mini Course à¸™à¸µà¹‰")
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
  selector.appendChild(month2CreateElement("h4", "", "à¹€à¸¥à¸·à¸­à¸à¸§à¸±à¸™à¸—à¸µà¹ˆà¸à¸¶à¸"));

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
      month2CreateElement("span", "", isComplete ? "à¸—à¸³à¹à¸¥à¹‰à¸§" : isCurrent ? "à¸à¸³à¸¥à¸±à¸‡à¸à¸¶à¸" : "à¹€à¸›à¸´à¸”à¹„à¸”à¹‰")
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
    card.appendChild(month2CreateElement("p", "", "à¸šà¸—à¸™à¸µà¹‰à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¹ƒà¸Šà¹‰ count map à¹€à¸žà¸´à¹ˆà¸¡à¸„à¸£à¸±à¸š"));
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
    card.appendChild(month2CreateElement("p", "", "à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µà¸‚à¸±à¹‰à¸™à¸•à¸­à¸™à¸ªà¸³à¸«à¸£à¸±à¸šà¸ªà¹ˆà¸§à¸™à¸™à¸µà¹‰à¸„à¸£à¸±à¸š"));
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
    month2CreateElement("h5", "", "à¹€à¸Šà¹‡à¸à¸•à¸±à¸§à¹€à¸­à¸‡à¸à¹ˆà¸­à¸™à¸‚à¹‰à¸²à¸¡à¸§à¸±à¸™")
  );

  if (!checks.length) {
    card.appendChild(month2CreateElement("p", "", "à¹€à¸Šà¹‡à¸à¸•à¸±à¸§à¹€à¸­à¸‡à¸”à¹‰à¸§à¸¢à¸„à¸³à¸–à¸²à¸¡à¸ªà¸±à¹‰à¸™ à¹†: à¸§à¸±à¸™à¸™à¸µà¹‰à¸™à¸±à¸šà¹„à¸”à¹‰à¸•à¸£à¸‡à¸‚à¸¶à¹‰à¸™à¹„à¸«à¸¡?"));
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
  wrap.appendChild(month2CreateElement("h5", "", "à¹€à¸›à¸´à¸”à¸„à¸¹à¹ˆà¸¡à¸·à¸­à¸­à¹‰à¸²à¸‡à¸­à¸´à¸‡"));
  if (!refs.length) {
    wrap.appendChild(month2CreateElement("p", "", "à¸§à¸±à¸™à¸™à¸µà¹‰à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¹€à¸›à¸´à¸”à¸„à¸¥à¸±à¸‡à¸­à¹‰à¸²à¸‡à¸­à¸´à¸‡à¹€à¸žà¸´à¹ˆà¸¡à¸„à¸£à¸±à¸š"));
    return wrap;
  }
  const buttonRow = month2CreateElement("div", "mini-course-reference-row");
  refs.forEach((ref) => {
    const target = String(ref.target || "").trim();
    const isAllowed = ["#tabGuidebook", "#noteValueGuidebook"].includes(target);
    const exists = isAllowed && document.querySelector(target);
    const button = month2CreateElement("button", "small-button mini-course-reference-button", exists ? ref.label || "à¹€à¸›à¸´à¸”à¸„à¸¹à¹ˆà¸¡à¸·à¸­" : "à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸žà¸šà¸„à¸¥à¸±à¸‡à¸­à¹‰à¸²à¸‡à¸­à¸´à¸‡à¸™à¸µà¹‰");
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
    confirmed = window.confirm("à¸¥à¹‰à¸²à¸‡à¸„à¸§à¸²à¸¡à¸„à¸·à¸šà¸«à¸™à¹‰à¸² Mini Course à¸™à¸µà¹‰à¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆ?\n\nà¸à¸²à¸£à¸¥à¹‰à¸²à¸‡à¸™à¸µà¹‰à¸¡à¸µà¸œà¸¥à¹€à¸‰à¸žà¸²à¸° Mini Course à¸™à¸µà¹‰à¹€à¸—à¹ˆà¸²à¸™à¸±à¹‰à¸™ à¹„à¸¡à¹ˆà¸à¸£à¸°à¸—à¸š Month 1-4, Week 0 à¸«à¸£à¸·à¸­à¸šà¸±à¸™à¸—à¸¶à¸à¸à¸²à¸£à¸‹à¹‰à¸­à¸¡");
  }

  if (!confirmed) return;
  if (resetMiniCourseProgress(courseId, { confirmed: true, source: "mini-course-reset-control" })) {
    showToast("à¸¥à¹‰à¸²à¸‡ Mini Course à¹à¸¥à¹‰à¸§", "success");
    renderMiniCourseShelf({ focusDetail: true });
  }
}

function renderMiniCourseTypeConfirm(courseId, phrase = "RESET MINI COURSE") {
  const detail = document.querySelector("#miniCourseShelf .mini-course-detail");
  if (!detail) return;
  detail.querySelector(".mini-course-type-confirm")?.remove();

  const card = month2CreateElement("aside", "mini-course-type-confirm");
  card.setAttribute("role", "group");
  card.setAttribute("aria-label", "à¸¢à¸·à¸™à¸¢à¸±à¸™à¸à¸²à¸£à¸¥à¹‰à¸²à¸‡ Mini Course");

  const inputId = `mini-course-reset-confirm-${courseId}`;
  const input = document.createElement("input");
  input.id = inputId;
  input.type = "text";
  input.autocomplete = "off";
  input.placeholder = phrase;
  input.setAttribute("aria-label", "Mini Course reset confirmation phrase");

  const confirmButton = month2CreateElement("button", "small-button mini-course-danger-button", "à¸¥à¹‰à¸²à¸‡ Mini Course");
  confirmButton.type = "button";
  confirmButton.disabled = true;

  const cancelButton = month2CreateElement("button", "small-button", "à¸¢à¸à¹€à¸¥à¸´à¸");
  cancelButton.type = "button";

  const hint = month2CreateElement("p", "mini-course-confirm-hint", "à¸žà¸´à¸¡à¸žà¹Œà¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡à¹ƒà¸«à¹‰à¸•à¸£à¸‡à¸à¹ˆà¸­à¸™à¸„à¸£à¸±à¸š");

  input.addEventListener("input", () => {
    const matches = input.value === phrase;
    confirmButton.disabled = !matches;
    hint.textContent = matches ? "à¸žà¸£à¹‰à¸­à¸¡à¸¥à¹‰à¸²à¸‡à¹€à¸‰à¸žà¸²à¸° Mini Course à¸™à¸µà¹‰" : "à¸žà¸´à¸¡à¸žà¹Œà¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡à¹ƒà¸«à¹‰à¸•à¸£à¸‡à¸à¹ˆà¸­à¸™à¸„à¸£à¸±à¸š";
  });

  confirmButton.addEventListener("click", () => {
    if (input.value !== phrase) {
      emitMiniCourseEvent("error", { code: "MC_RESET_CONFIRM_MISMATCH", courseId });
      return;
    }
    if (resetMiniCourseProgress(courseId, { confirmed: true, source: "mini-course-reset-control" })) {
      showToast("à¸¥à¹‰à¸²à¸‡ Mini Course à¹à¸¥à¹‰à¸§", "success");
      renderMiniCourseShelf({ focusDetail: true });
    }
  });

  cancelButton.addEventListener("click", () => {
    card.remove();
  });

  const actions = month2CreateElement("div", "mini-course-type-confirm-actions");
  actions.append(confirmButton, cancelButton);

  card.append(
    month2CreateElement("strong", "", "à¸¢à¸·à¸™à¸¢à¸±à¸™à¸à¸²à¸£à¸¥à¹‰à¸²à¸‡ Mini Course"),
    month2CreateElement("p", "", `à¸„à¸¸à¸“à¸—à¸³ Mini Course à¸™à¸µà¹‰à¹„à¸›à¹€à¸à¸´à¸™à¸„à¸£à¸¶à¹ˆà¸‡à¹à¸¥à¹‰à¸§ à¸–à¹‰à¸²à¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¸¥à¹‰à¸²à¸‡à¸ˆà¸£à¸´à¸‡ à¹ƒà¸«à¹‰à¸žà¸´à¸¡à¸žà¹Œ ${phrase}`),
    month2CreateElement("label", "", "à¸žà¸´à¸¡à¸žà¹Œà¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡à¸¢à¸·à¸™à¸¢à¸±à¸™"),
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
  const currentWeekNumber = getCurrentFoundationWeek();
  const nextDay = getPracticeDay(currentWeekNumber) >= 7 ? 1 : getPracticeDay(currentWeekNumber) + 1;
  setPracticeDay(currentWeekNumber, nextDay);
  renderFocusedDashboard();
}

function resetFoundationProgress() {
  if (!window.confirm("à¸¥à¹‰à¸²à¸‡à¸„à¸§à¸²à¸¡à¸„à¸·à¸šà¸«à¸™à¹‰à¸²à¹à¸¥à¸°à¸šà¸±à¸™à¸—à¸¶à¸à¸à¸²à¸£à¸‹à¹‰à¸­à¸¡à¸‚à¸­à¸‡à¹€à¸”à¸·à¸­à¸™à¸—à¸µà¹ˆ 1 à¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆ?")) return;
  localStorage.removeItem(foundationStorage.completedWeeks);
  localStorage.removeItem(foundationStorage.dayByWeek);
  localStorage.removeItem(foundationStorage.notes);
  Object.keys(localStorage)
    .filter((key) => key.startsWith(foundationStorage.checklistPrefix))
    .forEach((key) => localStorage.removeItem(key));
  Object.keys(localStorage)
    .filter((key) => key.startsWith("gc_prelude_chk_"))
    .forEach((key) => localStorage.removeItem(key));
  focusedSelectedWeek = 1;
  renderFocusedApp();
}

window.__GC_MONTH2_ENGINES__ = Object.freeze({
  renderLessonBlocks,
  renderFretboardVisual,
  renderMiniTab,
  renderChordSoundLab,
  renderTechniqueDrillBlock,
  renderMechanicsCheckBlock,
  playChord,
  playPluckedString,
  stopAllSounds
});

window.addEventListener("pagehide", stopActiveAudio);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopActiveAudio();
});

initFocusedApp();
