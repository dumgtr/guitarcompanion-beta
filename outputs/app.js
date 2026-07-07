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
      "อัดเสียง 2 นาทีแล้วฟังว่ามีเร่งหรือหน่วง"
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
      "บันทึกวิดีโอมือขวา"
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
  if (!isDevPreviewActive()) return loadedMonths.filter((month) => month <= 4);

  const mode = getDevPreviewMode();
  if (mode === "m3") return loadedMonths.filter((month) => month <= 4);
  if (mode === "m4") return loadedMonths.filter((month) => month <= 4);
  if (mode === "m5" || mode === "5") return loadedMonths.filter((month) => month <= 5);
  if (mode === "m6" || mode === "6") return loadedMonths.filter((month) => month <= 6);
  if (mode === "all") return loadedMonths.filter((month) => month <= 6);
  
  return loadedMonths.filter((month) => month <= 4);
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
  document.getElementById("progressBar").style.width = `${percent}%`;
  document.getElementById("progressText").textContent = `${done}/${total} สัปดาห์`;
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
        <h4>บันทึกซ้อม</h4>
        <ul>
          <li>อัดเสียงหรือวิดีโออย่างน้อย 1 take</li>
          <li>จด BPM สูงสุดที่ยังนิ่ง</li>
          <li>เขียน 1 จุดที่ต้องแก้ในสัปดาห์ถัดไป</li>
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
  const announcer = document.getElementById("metronomeAnnouncer");
  if (announcer) announcer.textContent = `เริ่ม Metronome ที่ ${bpm} BPM`;
  scheduleMetronome();
}

function stopMetronome() {
  clearTimeout(metronomeTimer);
  isMetronomeRunning = false;
  document.getElementById("metronomeToggle").textContent = "เริ่ม";
  document.getElementById("beatLight").classList.remove("active", "accent");
  renderBeatCounter(0);
  const announcer = document.getElementById("metronomeAnnouncer");
  if (announcer) announcer.textContent = "หยุด Metronome";
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
    summary: "ฝึกให้หู มือ และเท้าอยู่กับจังหวะหลักเดียวกันก่อนเริ่มเล่น Pattern ที่ซับซ้อนขึ้น",
    youtube: {
      title: "ฟังตัวอย่าง Pulse และ 16th Grid ก่อนเริ่มอ่าน",
      embedUrl: "https://www.youtube.com/embed?listType=search&list=guitar%20rhythm%2016th%20note%20pulse"
    },
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
        "หลังดูวิดีโอ ให้เริ่มจากการจับเสียงที่เดินอยู่ตลอดก่อน อย่าเพิ่งสนใจว่ามือขวาต้องตีลายสวยแค่ไหน ให้ถามตัวเองก่อนว่าเราได้ยิน Pulse ของเพลงหรือยัง",
        "Pulse คือจังหวะหลักที่เหมือนชีพจรของเพลง มันคือความรู้สึกว่าเพลงกำลังเดินไปข้างหน้าแบบ 1 2 3 4 ถึงแม้กีตาร์จะไม่ได้ตีทุกจังหวะ Pulse ก็ยังอยู่ตรงนั้นตลอด",
        "Rhythm คือสิ่งที่เราเล่นคร่อมอยู่บน Pulse อีกทีหนึ่ง เช่น เราอาจตีเฉพาะ 1 กับ 3 หรือเติม 1 e & a ก็ได้ แต่ไม่ว่า Rhythm จะเยอะหรือน้อย Pulse ต้องยังนิ่งเหมือนเดิม",
        "เหตุผลที่ครูให้เคาะเท้า เพราะเท้าช่วยยืนยันว่าในหัวเรายังรู้ว่า beat หลักอยู่ตรงไหน ถ้าเท้าหายหรือเริ่มเคาะตามมือมั่ว ๆ แปลว่าเรากำลังปล่อยให้มือพาเวลาไป",
        "เริ่มนับง่ายที่สุดคือ 1 2 3 4 ให้เลขแต่ละตัวห่างเท่ากันเหมือนเดินทีละก้าว จากนั้นค่อยซอยพื้นที่ระหว่างเลขด้วย 1 e & a เพื่อเห็น 16th Grid แต่เท้ายังเคาะเฉพาะเลขเหมือนเดิม",
        "ตอนเล่นกีตาร์ มือขวาควรเคลื่อนต่อเนื่องเหมือน pendulum แม้บางช่องใน 16th Grid จะยังไม่ตีจริง การเคลื่อนต่อเนื่องช่วยให้มือไม่เดาเวลาใหม่ทุกครั้งที่ต้องลงคอร์ด",
        "สัปดาห์นี้ไม่ต้องใช้คอร์ดเยอะ เลือกคอร์ดเดียวแล้วทำให้ time นิ่งก่อน ถ้าคอร์ดน้อยแต่ลงตรง Metronome ได้ นั่นคือพื้นฐานที่ดีมากสำหรับ Groove ต่อไป"
      ],
      listenFor: [
        "เสียงคอร์ดของเราชนกับ click ของ Metronome พอดีหรือมาช้าไปนิดหนึ่ง",
        "เวลานับ 1 2 3 4 เสียงในหัวสม่ำเสมอไหม หรือบางเลขถูกรีบพูดเร็วกว่าเลขอื่น",
        "ตอนนับ 1 e & a ช่อง e, &, a เป็นแค่พื้นที่ในจังหวะ ไม่ใช่จุดที่ต้องตีแรงทุกครั้ง"
      ],
      physicalFeel: [
        "เท้าเคาะเฉพาะ 1 2 3 4 แบบสบาย ๆ ไม่ต้องกระแทกแรง",
        "ข้อมือขวาแกว่งต่อเนื่อง ไม่เกร็ง และไม่หยุดรอจนถึงจังหวะตี",
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
        "รอบสุดท้าย อัดเสียง 30 วินาที แล้วฟังเหมือนเป็นครูของตัวเอง ถ้าคอร์ดมาก่อน click ให้ผ่อนใจ ถ้าคอร์ดมาหลัง click ให้เตรียมมือเร็วขึ้นนิดเดียว"
      ],
      correctionSteps: [
        "ถ้าคอร์ดไม่ชน click ให้ตัดเหลือแค่ตบมือกับ Metronome ก่อน อย่าแก้ด้วยการเพิ่มแรงตี",
        "ถ้านับ 1 e & a แล้วหลง ให้กลับไปนับ 1 2 3 4 สองรอบ แล้วค่อยซอยใหม่",
        "ถ้ามือขวาหยุดค้าง ให้ซ้อมแกว่งมือลง-ขึ้นบนสายที่ mute ไว้ก่อน แล้วค่อยปล่อยเสียงคอร์ดจริง"
      ],
      dailySelfCheck: [
        "เคาะเท้ากับ Metronome 60 BPM ได้ 2 นาทีโดยไม่หลุด Pulse",
        "นับ 1 2 3 4 ออกเสียงได้ต่อเนื่องโดยไม่รีบหรือช้าลง",
        "มือขวาเคลื่อนต่อเนื่อง แม้บางจังหวะยังไม่ตีคอร์ดจริง"
      ],
      troubleshooting: [
        {
          problem: "Timing เริ่ม drift หลังประมาณ 20 วินาที",
          advice: "ลด BPM ลง 10 ก่อน แล้วกลับไปเคาะเท้ากับ Metronome อย่างเดียว พอเท้านิ่งค่อยนับ 1 2 3 4 ออกเสียง"
        },
        {
          problem: "นับ 1 e & a แล้วรีบจนช่องย่อยไม่เท่ากัน",
          advice: "ยังไม่ต้องตีคอร์ด ให้พูดเบาลงและเว้นช่องแต่ละพยางค์ให้เท่ากันก่อน ถ้าปากนิ่ง มือจะนิ่งตาม"
        },
        {
          problem: "มือขวาหยุดรอจังหวะตี",
          advice: "mute สายไว้ แล้วแกว่งมือลง-ขึ้นต่อเนื่อง 30 วินาที จากนั้นค่อยปล่อยเสียงคอร์ดเฉพาะเลข 1 2 3 4"
        }
      ],
      miniExample: "ตั้ง Metronome ที่ 60 BPM นับ 1 e & a ออกเสียง 4 ห้อง แล้วตีคอร์ดเฉพาะตรง 1 2 3 4 ถ้าหลุด ให้กลับมานับแค่ 1 2 3 4 ก่อน",
      commonMistakes: [
        "นับ 1 e & a แล้วเท้าเผลอเคาะทุกพยางค์ ทำให้ Pulse หลักไม่ชัด",
        "มือขวาหยุดรอจังหวะตี พอจะตีจริงเลยลงช้าหรือรีบเกิน",
        "รีบเพิ่มคอร์ดหรือเพิ่ม Pattern ทั้งที่เสียงยังไม่ตรง Metronome"
      ],
      selfCheck: [
        "อัดเสียงแล้วฟังว่า click กับคอร์ดเหมือนอยู่จุดเดียวกันหรือยัง",
        "ลองหยุดตีคอร์ด 1 ห้องแต่เท้ายังเคาะต่อได้ แปลว่า Pulse ในตัวเริ่มนิ่ง",
        "นับ 1 e & a ได้โดยไม่ทำให้ Downstroke บนเลข 1 2 3 4 สั่น"
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
        options: ["จังหวะหลักที่เดินอยู่ตลอดเพลง", "Pattern ตีคอร์ดเร็ว ๆ", "ชื่อรูปคอร์ดแบบหนึ่ง"],
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
      "อัดเสียง 1 นาทีตอนเล่น beat 1 2 3 4 กับ Metronome แล้วฟังว่าเสียงกีตาร์ชน click หรือยัง",
      "จด BPM ที่นิ่งที่สุดไว้ 1 ค่า แล้วใช้ค่านั้นเป็นจุดเริ่มซ้อมวันถัดไป"
    ]
  },
  {
    number: 2,
    title: "Syncopation",
    summary: "ฝึกวาง Accent บน off-beat เพื่อให้จังหวะเริ่มมี Groove",
    youtube: {
      title: "ฟังตัวอย่าง Syncopation และ Accent บน off-beat",
      embedUrl: "https://www.youtube.com/embed?listType=search&list=guitar%20rhythm%20syncopation%20strumming"
    },
    learn: {
      targetBpm: "50-80 BPM",
      diagram: {
        title: "Off-beat Grid: ให้คอร์ดเด่นบน &",
        caption: "เท้าอยู่บนเลข 1 2 3 4 ส่วนคอร์ดที่ทำให้ Groove เด้งให้ลองวางบน & หลัง 2 และ 4",
        cells: [
          { label: "1", note: "ghost", kind: "ghost" },
          { label: "&", note: "พัก", kind: "rest" },
          { label: "2", note: "ghost", kind: "ghost" },
          { label: "&", note: "Accent", kind: "accent" },
          { label: "3", note: "ghost", kind: "ghost" },
          { label: "&", note: "พัก", kind: "rest" },
          { label: "4", note: "ghost", kind: "ghost" },
          { label: "&", note: "Accent", kind: "accent" }
        ]
      },
      paragraphs: [
        "หลังดูวิดีโอ ให้สังเกตว่าบางครั้งกีตาร์ไม่ได้ดังตรงเลข 1 2 3 4 แต่เพลงกลับรู้สึกเด้งขึ้น นั่นคือจุดเริ่มของ Syncopation",
        "Off-beat คือพื้นที่ระหว่าง beat หลัก เช่น & ที่อยู่ระหว่าง 1 กับ 2 หรือระหว่าง 2 กับ 3 ถ้า beat หลักคือก้าวเดิน off-beat ก็เหมือนแรงเด้งระหว่างก้าว",
        "การตีไม่ตรง beat แล้วเกิด Groove ไม่ได้แปลว่าเล่นมั่ว แต่แปลว่าเรารู้ว่า beat หลักอยู่ตรงไหน แล้วตั้งใจให้เสียงคอร์ดไปเด่นในจุดที่คนฟังคาดไม่ถึง",
        "ความต่างระหว่างหลุดจังหวะกับ Syncopation อยู่ที่ Pulse ถ้าเท้ายังเคาะ 1 2 3 4 ได้มั่น และคอร์ดดังบน & แบบตั้งใจ นั่นคือ Syncopation แต่ถ้าเท้าหายและเราหาทางกลับ beat ไม่เจอ นั่นคือหลุด",
        "ก่อนเล่นให้พูดจังหวะออกมาก่อน เช่น 1 & 2 & 3 & 4 & แล้ววงจุดที่อยากให้คอร์ดดัง เช่น & หลัง 2 พอปากนับได้ชัด มือจะมีโอกาสเล่นตรงมากขึ้น",
        "ตัวอย่างง่าย ๆ คือเว้น beat 2 ไว้เบาหรือเป็น ghost แล้วให้คอร์ดดังที่ & หลัง 2 เสียงจะเหมือนถูกผลักไปข้างหน้า ทำให้ Groove มีชีวิตขึ้น",
        "อย่ารีบทำให้มันซับซ้อน สัปดาห์นี้ขอให้รู้สึกว่าเท้าเป็นพื้น ส่วนมือขวาเป็นคนเล่นกับพื้นนั้น ถ้าพื้นยังนิ่ง Syncopation จะฟังสนุกแทนที่จะฟังหลุด"
      ],
      listenFor: [
        "Accent บน off-beat ทำให้ Groove เด้งขึ้นไหม หรือทำให้ Pulse หายไป",
        "หลังตีที่ & แล้วเรากลับมาเจอ beat ถัดไปได้ตรงหรือไม่",
        "เสียง ghost หรือ muted strum เบาพอที่จะไม่แย่งความเด่นจาก Accent หรือเปล่า"
      ],
      physicalFeel: [
        "เท้ายังเคาะ 1 2 3 4 ต่อเนื่องเหมือนเดิม",
        "ข้อมือขวาแกว่งผ่านช่องที่ไม่ได้ตีจริง ไม่หยุดค้าง",
        "ตอนตี Accent บน & ให้รู้สึกเหมือนสะกิดจังหวะ ไม่ใช่กระชากทั้งแขน"
      ],
      guitarApplication: [
        "เริ่มจากคอร์ดเดียว ตีเบาบน 1 2 3 4 แล้วเพิ่ม Accent ที่ & หลัง 2",
        "ลอง mute สายด้วยมือซ้ายเพื่อฝึกมือขวาก่อน จากนั้นค่อยปล่อยคอร์ดจริงให้ดังเฉพาะจุด Accent",
        "ใช้ Pattern สั้น 1 ห้องวนซ้ำจนกลับเข้า beat 1 ได้มั่นก่อนค่อยเพิ่มอีกห้อง"
      ],
      guidedSteps: [
        "รอบแรก ยังไม่ต้องจับคอร์ด ให้พูด 1 & 2 & 3 & 4 & พร้อมเคาะเท้าเฉพาะเลข ถ้าเท้าเผลอเคาะ & ให้เริ่มใหม่",
        "รอบสอง ให้ตบมือเบา ๆ ตรง & หลัง 2 แค่จุดเดียว แล้วฟังว่าหลังตบมือเรากลับมาเจอ 3 ได้ไหม",
        "รอบสาม จับคอร์ดเดียวแล้ว mute สายไว้ มือขวาแกว่งลง-ขึ้นตลอด ให้เสียง muted เบา ๆ ผ่านไปก่อน",
        "รอบสี่ เปิดเสียงคอร์ดเฉพาะที่ & หลัง 2 ส่วนจุดอื่นให้ ghost เบา ๆ อย่าเร่งเข้าหา & เพราะกลัวไม่ทัน",
        "รอบสุดท้าย เล่น 4 ห้องติดกัน ถ้าพลาดให้กลับเข้าที่ beat ถัดไป ห้ามหยุดกลางห้อง เพราะในเพลงจริงเราต้องกลับเข้าวงให้ได้"
      ],
      correctionSteps: [
        "ถ้า Accent มาก่อนเวลา ให้พูด & เบาลงและรอให้เท้าเหยียบเลข 2 ก่อนค่อยส่งมือขึ้น",
        "ถ้าเล่นแล้วเหมือนหลุด ให้ลบคอร์ดออก เหลือแค่ mute สายกับนับเสียงดังจน Pulse กลับมานิ่ง",
        "ถ้า Accent แรงเกิน ให้ลดแรง pick แล้วใช้ความชัดของเวลาแทนความดัง"
      ],
      dailySelfCheck: [
        "เล่นคอร์ดบน \"&\" ได้โดยไม่รีบเข้าหา beat ถัดไป",
        "นับ 1 & 2 & 3 & 4 & ต่อเนื่องระหว่าง strumming ได้",
        "ยัง locked กับ Metronome ได้ตั้งแต่ 50 BPM และค่อย ๆ ขยับไป 80 BPM"
      ],
      troubleshooting: [
        {
          problem: "Syncopation feels rushed",
          advice: "วางกีตาร์ก่อน แล้วนับ 1 & 2 & 3 & 4 & ให้ตรงกับเท้า จากนั้นค่อย strum เฉพาะ \"&\" ที่ต้องการ"
        },
        {
          problem: "เล่นบน & แล้วกลับเข้า beat ถัดไปไม่ทัน",
          advice: "ลด BPM ลง 10 และฝึกแค่ 1 ห้องวนซ้ำ อย่าเพิ่ม Accent จุดที่สองจนกว่าจะกลับมาเจอ beat 1 ได้ทุกครั้ง"
        },
        {
          problem: "Accent แรงจน Groove เหมือนหลุด",
          advice: "ลดแรง pick ลง ให้จุดเด่นมาจากตำแหน่งเวลา ไม่ใช่ความดัง แล้วเช็กว่าเท้ายังอยู่บน 1 2 3 4"
        }
      ],
      miniExample: "นับ 1 & 2 & 3 & 4 & แล้วเล่น ghost เบา ๆ บน 1 กับ 2 จากนั้นให้คอร์ดดังชัดที่ & หลัง 2 แล้วกลับมาเจอ 3 แบบไม่รีบ",
      commonMistakes: [
        "รีบเข้า Accent เร็วเกินเพราะกลัวไม่ทัน & ทำให้ทั้ง Pattern เหมือนวิ่งนำ Metronome",
        "ตี Accent แรงเกินจน Pulse หลักหาย และตัวเริ่มโยกตามมือแทนเท้า",
        "หยุดมือขวาตรงช่องที่เว้น ทำให้จังหวะถัดไปต้องเดาใหม่"
      ],
      selfCheck: [
        "เปิด Metronome แล้วเท้ายังเคาะ 1 2 3 4 ได้แม้คอร์ดจะดังบน &",
        "หลัง Accent บน off-beat ยังกลับมาเจอ beat ถัดไปได้โดยไม่สะดุด",
        "ถ้าอัดเสียงฟังย้อน จะได้ยินว่าจุดที่ Syncopation เด่นขึ้น แต่จังหวะหลักยังเดินอยู่"
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
      title: "ฟังว่าอันไหนรีบกว่า beat",
      instruction: "ยังไม่ต้องฟัง pitch หรือคอร์ด ให้ฟังแค่ว่า strum อยู่กับ Metronome หรือวิ่งนำ click ไปก่อน",
      examples: [
        {
          label: "ตัวอย่าง A",
          description: "คอร์ดบน \"&\" เข้าก่อน click ถัดไปนิดหนึ่ง ฟังแล้วเหมือนคนเล่นกำลังรีบไปข้างหน้า"
        },
        {
          label: "ตัวอย่าง B",
          description: "คอร์ดบน \"&\" รออยู่ในช่องของมัน และกลับมาเจอ beat ถัดไปพอดี"
        }
      ],
      question: "ตัวอย่างไหน rushes ahead of the beat?",
      hint: "ถ้าฟังแล้วรู้สึกว่าเท้าต้องรีบตามมือ นั่นคือตัวอย่างที่ rush"
    },
    hear: [
      "ฟังให้ได้ว่าจังหวะหลัก 1 2 3 4 ยังเดินอยู่ แม้เสียงกีตาร์จะไปเด่นบน &",
      "Accent บน off-beat ควรทำให้ Groove เด้ง ไม่ใช่ทำให้ทั้งวงเหมือนหลุด beat",
      "ถ้าได้ยินว่า Accent กระแทกแรงจนกลบ Pulse ให้ลดแรงมือขวาลง แล้วปล่อยให้ Metronome เป็นตัวนำ"
    ],
    feel: [
      "เท้ายังเคาะ 1 2 3 4 เหมือนเดิม แต่ข้อมือขวาจะรู้สึกเหมือนส่งแรงไปที่ &",
      "off-beat ไม่ควรทำให้ตัวเราโยกหลุด ให้รู้สึกเหมือน Pulse อยู่ใต้เท้า ส่วน Accent อยู่ในมือ",
      "ถ้ารู้สึกว่าตัวกำลังวิ่งตามมือ ให้กลับไป mute สายแล้วตบเฉพาะ off-beat ก่อน"
    ],
    visual: {
      title: "เห็น Accent บน off-beat",
      instruction: "ช่องสีส้มคือ Accent บน & หลัง 2 และ & หลัง 4 ส่วนช่องเทาคือ ghost/muted strum เบา ๆ",
      duration: 4,
      steps: [
        { count: "1", action: "ghost", kind: "ghost" },
        { count: "&", action: "พัก", kind: "rest" },
        { count: "2", action: "ghost", kind: "ghost" },
        { count: "&", action: "Accent", kind: "accent" },
        { count: "3", action: "ghost", kind: "ghost" },
        { count: "&", action: "พัก", kind: "rest" },
        { count: "4", action: "ghost", kind: "ghost" },
        { count: "&", action: "Accent", kind: "accent" }
      ]
    },
    practice: [
      "ใช้คอร์ดเดียวก่อน แล้วตีลงบน 1 2 3 4",
      "เพิ่ม Upstroke ที่ & หลัง 2 และ & หลัง 4",
      "มือขวาต้องขยับต่อเนื่อง แม้บางจังหวะจะเป็น ghost หรือ muted strum",
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
        question: "ตอนมี muted strum มือขวาควรทำอะไร?",
        options: ["ขยับต่อเนื่อง", "หยุดนิ่งไปเลย", "เปลี่ยนคอร์ดแบบสุ่ม"],
        answer: 0
      },
      {
        question: "สิ่งที่ต้องระวังที่สุดเวลาเล่น Syncopation คืออะไร?",
        options: ["หลุดจาก Pulse หลัก", "เล่นเบาเกินไป", "ใช้คอร์ดเดียว"],
        answer: 0
      }
    ],
    homework: [
      "อัด 4 ห้องที่มี Accent บน & หลัง 2 และ & หลัง 4 โดยให้เท้ายังเคาะ 1 2 3 4 ตลอด",
      "ฟังย้อนแล้วจด 1 จุดที่ Pulse เริ่มสั่น เพื่อเอามาซ้อมช้า ๆ วันถัดไป"
    ]
  },
  {
    number: 3,
    title: "Dynamics & Palm Muting",
    summary: "คุมความดัง ความสั้นยาวของเสียง และอารมณ์ของ Pattern ด้วยมือของเรา",
    youtube: {
      title: "ฟังความต่างของ Dynamics และ Palm Mute",
      embedUrl: "https://www.youtube.com/embed?listType=search&list=guitar%20palm%20muting%20dynamics%20lesson"
    },
    learn: {
      targetBpm: "60-70 BPM",
      diagram: {
        title: "Palm Mute / Dynamic Levels",
        caption: "ฝึกให้มือขวาทำได้หลายระดับ: เบา, mute, เปิดเสียง, และ Accent โดย tempo ไม่เปลี่ยน",
        cells: [
          { label: "เบา", note: "soft", kind: "soft" },
          { label: "Mute", note: "สั้น", kind: "mute" },
          { label: "เปิด", note: "ยาว", kind: "open" },
          { label: "Accent", note: "เด่น", kind: "accent" }
        ]
      },
      paragraphs: [
        "หลังดูวิดีโอ ให้ฟังว่ากีตาร์ไม่ได้มีแค่ถูกจังหวะหรือผิดจังหวะ แต่ยังมีน้ำหนัก มีความสั้นยาว และมีอารมณ์ของเสียงด้วย นี่คือพื้นที่ของ Dynamics และ Palm Mute",
        "Dynamics ไม่ใช่แค่ volume ดังหรือเบา แต่มันคือ expression ว่าเราต้องการให้ท่อนนี้พูดเบา ๆ หรือผลักเพลงให้หนักขึ้น มือขวาจึงต้องคุมแรงได้หลายระดับ",
        "Palm Mute คือการใช้สันมือขวาแตะสายใกล้ bridge เพื่อทำให้เสียงสั้นและแน่นขึ้น เสียงที่สั้นลงช่วยให้ Groove กระชับ โดยเฉพาะตอนเล่นท่อน verse หรือ rhythm ที่ต้องไม่รก",
        "ตำแหน่งมือสำคัญมาก ถ้าวางใกล้ bridge เกินไปเสียงจะยังเปิดมาก ถ้าวางลึกเข้ามาบนสายมากเกินไปเสียงจะตายจนไม่รู้ว่าเป็นคอร์ดอะไร ให้ขยับทีละนิดแล้วฟังหาจุดกลาง",
        "Palm Mute ที่ดีควรยังมี pitch ชัด คือฟังออกว่าเป็นคอร์ดหรือโน้ตอะไร แต่เสียงสั้นลงและแน่นขึ้น ถ้า mute จนเสียงเหลือแค่ตุบ ๆ อย่างเดียว ให้ผ่อนแรงมือหรือถอยกลับไปใกล้ bridge",
        "ในการเล่นเพลงจริง เรามักใช้ verse ให้เบาลงหรือ Palm Mute มากขึ้น เพื่อเว้นที่ให้เสียงร้อง แล้วค่อยเปิดเสียงหนักขึ้นใน chorus เพื่อสร้าง contrast โดย tempo ต้องไม่เปลี่ยน",
        "สัปดาห์นี้ให้คิดว่ามือขวาเป็นคนเล่าอารมณ์ของเพลง ไม่ใช่แค่เครื่องตีคอร์ด ถ้าคุมเบา ดัง เปิด และ mute ได้ Groove จะดูเป็นเพลงขึ้นทันที"
      ],
      listenFor: [
        "เสียงเบาและเสียงดังยังอยู่ tempo เดียวกันไหม หรือพอเล่นดังแล้วเผลอเร่ง",
        "Palm Mute สั้นและแน่นขึ้น แต่ยังได้ยิน pitch ของคอร์ดชัดหรือเปล่า",
        "ตอนสลับ verse เบากับ chorus หนัก เพลงมี contrast มากขึ้นโดยไม่กระแทกเกินไปไหม"
      ],
      physicalFeel: [
        "มือขวามีน้ำหนักหลายระดับ ไม่ใช่มีแค่เบาสุดกับแรงสุด",
        "สันมือแตะสายใกล้ bridge แบบวางเบา ๆ ไม่กดจนสายตาย",
        "แขนยังแกว่งตาม Pulse เดิม ถึงแม้เสียงจะสั้นลงหรือดังขึ้น"
      ],
      guitarApplication: [
        "เล่นคอร์ดเดียว 4 ห้องแบบเปิดเสียงเต็ม แล้วเล่นอีก 4 ห้องด้วย Palm Mute เพื่อเทียบ texture",
        "ลองวาง Palm Mute ใกล้ bridge แล้วค่อย ๆ ขยับเข้าหาสาย ฟังว่าจุดไหนยังชัดและแน่นที่สุด",
        "ซ้อม verse เบา 4 ห้อง แล้ว chorus หนัก 4 ห้อง โดยไม่เปลี่ยน BPM"
      ],
      guidedSteps: [
        "รอบแรก เล่นคอร์ดเดียวแบบเปิดเสียงเต็ม 4 ห้อง ฟังให้รู้ว่าเสียงยาวและก้องแค่ไหนก่อน",
        "รอบสอง วางสันมือใกล้ bridge แบบแตะเบา ๆ แล้วเล่นเหมือนเดิม ถ้าเสียงยังยาวมากให้ขยับเข้ามานิดเดียว",
        "รอบสาม ถ้าเสียงตายจนไม่รู้คอร์ด ให้ถอยมือกลับไปทาง bridge และลดน้ำหนักมือ อย่ากดสายลงไป",
        "รอบสี่ เล่นเบา 2 ห้อง แล้วเปิดให้หนักขึ้น 2 ห้อง โดย Metronome ต้องรู้สึกอยู่ที่เดิม ไม่ถูกมือขวาดันเร็วขึ้น",
        "รอบสุดท้าย ลองคิดเป็นเพลงจริง: verse ใช้ Palm Mute เบา ๆ แล้ว chorus เปิดเสียงมากขึ้น ให้ความต่างเกิดจากมือ ไม่ใช่จากการเปลี่ยน tempo"
      ],
      correctionSteps: [
        "ถ้าเล่นดังแล้วเร็วขึ้น ให้ลดแรง pick ลงครึ่งหนึ่งแล้วเปิด Metronome ดังขึ้นในหู",
        "ถ้า Palm Mute ทึบเกิน ให้ขยับมือกลับไปใกล้ bridge และเช็กว่ายังฟังออกว่าเป็นคอร์ดอะไร",
        "ถ้าสลับ open กับ muted แล้วสะดุด ให้ซ้อมเฉพาะมือขวาบนสาย mute ก่อน ยังไม่ต้องเปลี่ยนคอร์ด"
      ],
      dailySelfCheck: [
        "ทำ Palm Mute ให้เสียงสั้นแต่ยังชัด ไม่ตายเป็นเสียงทึบ",
        "คุม soft และ loud dynamics ให้ต่างกันจริงโดย tempo ไม่เปลี่ยน",
        "เปลี่ยนจากเบาไปดัง หรือ mute ไป open แล้วยังรักษา Groove ได้"
      ],
      troubleshooting: [
        {
          problem: "Palm Mute sounds dead",
          advice: "ขยับสันมือขวาไปทาง bridge ทีละนิด และลดแรงกด ให้เสียงสั้นลงแต่ยังฟังออกว่าเป็นคอร์ด"
        },
        {
          problem: "มี fret buzz หรือเสียงแป๊กตอนเล่นเบา",
          advice: "เช็กมือซ้ายก่อน กดให้ชัดพอดี ไม่ต้องแก้ด้วยการตีแรงขึ้น เพราะเรากำลังฝึก Dynamics ไม่ใช่ฝืน volume"
        },
        {
          problem: "เสียงเบา/ดังไม่เท่ากันจน Groove แกว่ง",
          advice: "ซ้อมทีละ 4 ห้องด้วยระดับเดียวก่อน แล้วค่อยเพิ่ม Accent แค่จุดเดียว อย่าเปลี่ยนทุกอย่างพร้อมกัน"
        }
      ],
      miniExample: "ใช้คอร์ด Em เล่น 1 & 2 & 3 & 4 & แบบ Palm Mute เบา ๆ 2 ห้อง แล้วเปิดเสียงเต็มพร้อม Accent บน 4 ในห้องถัดไป",
      commonMistakes: [
        "เล่นดังแล้ว tempo เร็วขึ้น เพราะมือขวาใช้แรงมากเกิน",
        "วาง Palm Mute ลึกเกินจนเสียงตายและฟังไม่ออกว่าเป็นคอร์ดอะไร",
        "เปลี่ยนจาก muted เป็น open แล้วมือขวาหยุดหรือสะดุด ทำให้ Groove ขาด"
      ],
      selfCheck: [
        "อัดเสียงแล้วฟังว่า open กับ Palm Mute ต่างกันชัด แต่ tempo ไม่แกว่ง",
        "ฟังออกว่ายังเป็นคอร์ดเดิมแม้จะ Palm Mute อยู่",
        "เล่น verse เบาและ chorus หนักได้โดย Metronome ยังรู้สึกอยู่กลางเสียง ไม่ถูกมือขวาดันหนี"
      ],
      teacherNote: "ครูแนะนำให้หาจุด Palm Mute ของกีตาร์ตัวเองจริง ๆ เพราะกีตาร์แต่ละตัวตอบสนองไม่เหมือนกัน ใช้หูฟังมากกว่าจำตำแหน่งจากรูป"
    },
    earTraining: {
      title: "ฟัง contrast ของ Dynamics",
      instruction: "ฟังแค่ rhythm, ความสั้นยาว และความต่างของเบา/ดัง ไม่ต้องสนใจชื่อคอร์ด",
      examples: [
        {
          label: "ตัวอย่าง A",
          description: "ทุก strum ดังใกล้ ๆ กันหมด ท่อน verse กับ chorus เลยรู้สึกแบนและไม่มีแรงยก"
        },
        {
          label: "ตัวอย่าง B",
          description: "ท่อนแรก Palm Mute เบาและสั้น พอเข้าช่วงถัดไปเปิดเสียงและ Accent ชัดขึ้น"
        }
      ],
      question: "ตัวอย่างไหนมี dynamic contrast ชัดกว่า?",
      hint: "ถ้าฟังแล้วรู้สึกว่าเพลงมีพื้นที่เบาและจุดที่ยกขึ้น นั่นคือตัวอย่างที่ contrast ดีกว่า"
    },
    hear: [
      "ฟังความต่างระหว่างเสียงเปิดเต็มกับเสียง Palm Mute เสียงเปิดจะยาวกว่า ส่วน Palm Mute จะสั้นและแน่นกว่า",
      "ฟังว่าเสียงเบาและเสียงดังยังอยู่ tempo เดียวกันไหม หลายคนพอเล่นดังแล้วจะเผลอเร่ง",
      "เสียง Palm Mute ที่ดีไม่ใช่เสียงทึบจนไม่รู้คอร์ด แต่เป็นเสียงสั้นที่ยังมี pitch ชัด"
    ],
    feel: [
      "มือขวาควรรู้สึกเหมือนมีน้ำหนัก 3 ระดับ: เบา, ปกติ, ดัง ไม่ใช่ตีแรงอย่างเดียว",
      "Palm Mute ให้สันมือแตะสายเบา ๆ ใกล้ bridge ถ้ากดหนักเกินไปเสียงจะตาย",
      "เวลาสลับ open กับ muted ให้รู้สึกว่าเป็นการเปลี่ยนพื้นที่เสียง ไม่ใช่เปลี่ยน tempo"
    ],
    visual: {
      title: "เห็นความต่างของ Open, Palm Mute และ Accent",
      instruction: "ช่องน้ำเงินคือเล่นเบา ช่องเทาคือ Palm Mute ช่องส้มคือ Accent ที่เปิดเสียงชัดขึ้น",
      duration: 4,
      steps: [
        { count: "1", action: "เบา", kind: "soft" },
        { count: "&", action: "เบา", kind: "soft" },
        { count: "2", action: "Mute", kind: "mute" },
        { count: "&", action: "Mute", kind: "mute" },
        { count: "3", action: "เปิด", kind: "open" },
        { count: "&", action: "พัก", kind: "rest" },
        { count: "4", action: "Accent", kind: "accent" },
        { count: "&", action: "Mute", kind: "mute" }
      ]
    },
    practice: [
      "เล่น 4 ห้องแบบเบาและปล่อยเสียงคอร์ดให้เปิด",
      "เล่น 4 ห้องแบบ Palm Mute ให้เสียงสั้นลง",
      "เล่น 4 ห้องแบบดังขึ้นโดยไม่ Palm Mute",
      "ทั้งสามแบบต้องอยู่ tempo เดิม เป้าหมายคือคุมมือ ไม่ใช่เปลี่ยนความเร็ว"
    ],
    quiz: [
      {
        question: "Dynamics คืออะไร?",
        options: ["การควบคุมเบา-ดัง", "การตั้งค่า distortion เท่านั้น", "รูปแบบสเกล"],
        answer: 0
      },
      {
        question: "Palm Mute ปกติวางสันมือขวาแถวไหน?",
        options: ["ใกล้ bridge", "บน headstock", "ทับมือซ้าย"],
        answer: 0
      },
      {
        question: "Palm Mute ที่ดีควรให้ผลแบบไหน?",
        options: ["เสียงสั้นลง แต่ pitch ยังชัด", "ทำให้ทุกโน้ตเงียบสนิท", "เปลี่ยนชื่อคอร์ด"],
        answer: 0
      },
      {
        question: "เวลาเปลี่ยน Dynamics สิ่งที่ควรนิ่งเหมือนเดิมคืออะไร?",
        options: ["Tempo", "คีย์เพลงเท่านั้น", "สีของ pick"],
        answer: 0
      },
      {
        question: "ทำไมท่อน verse มักเล่นเบาลง?",
        options: ["เพื่อเว้นพื้นที่และสร้าง contrast", "เพื่อซ่อน Pulse", "เพื่อไม่ต้องนับ"],
        answer: 0
      }
    ],
    homework: [
      "อัดเปรียบเทียบ open, Palm Mute, และ Accent อย่างละ 4 ห้อง โดยใช้ tempo เดียวกัน",
      "จดว่าตำแหน่งสันมือขวาตรงไหนให้เสียง Palm Mute ชัดที่สุดสำหรับกีตาร์ของเรา"
    ]
  },
  {
    number: 4,
    title: "Groove Integration",
    summary: "รวม Pulse, Syncopation, Dynamics และ Palm Mute ให้กลายเป็น Groove ที่เล่นได้จริง",
    youtube: {
      title: "ฟังตัวอย่าง Groove ก่อนรวมทุกอย่างเข้าด้วยกัน",
      embedUrl: "https://www.youtube.com/embed?listType=search&list=guitar%20rhythm%20groove%20integration%20backing%20track"
    },
    learn: {
      targetBpm: "70-75 BPM",
      diagram: {
        title: "Groove Pattern: รวม mute, open และ Accent",
        caption: "ให้ Pulse เดินก่อน แล้วค่อยเติม texture ทีละจุด อย่าใส่ทุกอย่างจน Groove หนักเกิน",
        cells: [
          { label: "1", note: "Mute", kind: "mute" },
          { label: "e", note: "นับ", kind: "rest" },
          { label: "&", note: "Mute", kind: "mute" },
          { label: "a", note: "นับ", kind: "rest" },
          { label: "2", note: "Mute", kind: "mute" },
          { label: "e", note: "นับ", kind: "rest" },
          { label: "&", note: "Accent", kind: "accent" },
          { label: "a", note: "นับ", kind: "rest" },
          { label: "3", note: "เปิด", kind: "open" },
          { label: "e", note: "นับ", kind: "rest" },
          { label: "&", note: "เปิด", kind: "open" },
          { label: "a", note: "นับ", kind: "rest" },
          { label: "4", note: "เปิด", kind: "open" },
          { label: "e", note: "นับ", kind: "rest" },
          { label: "&", note: "Accent", kind: "accent" },
          { label: "a", note: "จบ", kind: "hit" }
        ]
      },
      paragraphs: [
        "หลังดูวิดีโอ ให้ฟังภาพรวมก่อนว่า Groove เดินไหม อย่าเพิ่งจับผิดทุกโน้ต เพราะเป้าหมายของสัปดาห์นี้คือรวมทุกอย่างให้เล่นเป็นเพลง ไม่ใช่โชว์เทคนิคแยกชิ้น",
        "Groove Integration คือการเอา Pulse, Syncopation, Dynamics และ Palm Mute มาอยู่ใน Pattern เดียวกัน Pulse เป็นพื้น Syncopation เป็นแรงเด้ง Dynamics เป็นอารมณ์ และ Palm Mute เป็นตัวคุมความแน่น",
        "เวลาฟัง drum ให้เริ่มจาก kick และ snare ก่อน โดยมาก snare จะช่วยบอก backbeat บน 2 และ 4 ถ้ากีตาร์ของเราวางตัวกับ snare ได้ดี เพลงจะรู้สึกแน่นขึ้นทันที",
        "ถ้ามี Backing Track ให้ฟังว่ากีตาร์เราอยู่กับวงหรือแยกออกมาเอง ถ้าเสียงคอร์ดเหมือนลอยนำหรือช้ากว่ากลองบ่อย ๆ ให้ลด Pattern ลงก่อนแล้วกลับไปจับ Pulse",
        "การเล่นแน่นไม่ได้แปลว่าเล่นเยอะ แต่แปลว่าเล่นในจุดที่ตั้งใจและกลับเข้า beat ได้ทุกครั้ง บางทีตีคอร์ดน้อยกว่าเดิมแต่ตรงกว่าเดิม เพลงจะฟังมืออาชีพขึ้นมาก",
        "เวลารวมทุกอย่าง ให้เริ่มจาก 1 ห้องที่ง่ายก่อน เช่น Palm Mute บน beat หลัก แล้วเติม Accent บน off-beat แค่จุดเดียว ถ้ายังนิ่งค่อยเพิ่ม Dynamics หรือเปิดเสียงเต็มในห้องถัดไป",
        "Final assessment ของสัปดาห์นี้ให้ซ้อมเหมือนเล่นจริง 3 นาที เปิด Metronome หรือ Backing Track แล้วเล่น Groove เดิมให้เดินต่อ ไม่หยุดกลางทาง แม้พลาดเล็กน้อยก็กลับเข้า Pulse ให้ได้"
      ],
      listenFor: [
        "กีตาร์ของเรานั่งอยู่กับ kick/snare หรือเหมือนเล่นคนละทางกับกลอง",
        "Palm Mute ทำให้ท่อนแน่นขึ้น และ Accent ทำให้ท่อนเด้งขึ้นโดยไม่ทำให้ Pulse หาย",
        "ตลอด 3 นาที Groove ยังเดินต่อได้ไหม หรือเริ่มรีบและหลุดเมื่อเหนื่อย"
      ],
      physicalFeel: [
        "เท้ายังรู้สึกถึง Pulse ตลอด แม้มือจะเปลี่ยน texture หลายแบบ",
        "ตัวโยกไปกับ Groove แบบสบาย ไม่ใช่เกร็งไล่ตาม Pattern",
        "มือขวาเปลี่ยนจาก mute เป็น open และ Accent ได้โดยการแกว่งยังต่อเนื่อง"
      ],
      guitarApplication: [
        "สร้าง Pattern 8 ห้องที่มีช่วง Palm Mute, ช่วงเปิดเสียง และ Accent บน off-beat อย่างน้อยหนึ่งจุด",
        "เปิด Backing Track แล้วลองลดจำนวน strum ลงครึ่งหนึ่ง ฟังว่ากีตาร์ยังพาวงเดินได้ไหม",
        "ซ้อม final assessment 3 นาทีแบบ take เดียว ห้ามหยุดแก้กลางทาง ให้ฝึกกลับเข้า Pulse แทน"
      ],
      guidedSteps: [
        "รอบแรก เล่นแค่ Pulse กับคอร์ดเดียว 1 นาที ให้มั่นก่อนว่าวงในหัวไม่สั่น",
        "รอบสอง เติม Palm Mute บน beat หลัก ฟังว่ากีตาร์เริ่มแน่นขึ้นแต่ยังไม่รก",
        "รอบสาม เติม Accent บน off-beat แค่จุดเดียว ถ้าจุดนี้ทำให้หลุด ให้เอา Accent ออกแล้วกลับไป Palm Mute ก่อน",
        "รอบสี่ เปิดเสียงคอร์ดเต็มในช่วงท้าย Pattern เหมือนกำลังดันจาก verse ไป chorus แต่ห้ามดัน tempo",
        "รอบสุดท้าย เปิด Metronome หรือ Backing Track แล้วเล่น 3 นาทีแบบ take เดียว เป้าหมายคือกลับเข้า Pulse ให้ได้ทุกครั้ง ไม่ใช่เล่นไร้พลาด"
      ],
      correctionSteps: [
        "ถ้า Pattern รกจนฟัง Pulse ไม่ออก ให้ตัดโน้ตออกครึ่งหนึ่งแล้วเหลือเฉพาะจุดที่สำคัญ",
        "ถ้าเล่นกับ Backing Track แล้วกีตาร์ลอย ให้ฟัง snare บน 2 และ 4 ก่อน แล้ววางคอร์ดให้ไม่ชนมั่ว",
        "ถ้าพลาดแล้วหยุด ให้ซ้อมพลาดแบบตั้งใจหนึ่งจุด แล้วฝึกกลับเข้า beat ถัดไป เพื่อสร้างนิสัยเล่นต่อในเพลงจริง"
      ],
      dailySelfCheck: [
        "รักษา Groove ได้ 3 นาทีโดยไม่หยุดกลางทาง",
        "ตาม Metronome ที่ 70-75 BPM ได้ แม้มีพลาดเล็กน้อยก็เล่นต่อ",
        "เล่น mini-song ทั้ง 8 ห้องได้สม่ำเสมอจนรู้สึกเหมือนเป็นเพลง"
      ],
      troubleshooting: [
        {
          problem: "Groove หลุดหลังเล่นไปประมาณ 1 นาที",
          advice: "ลดจำนวน strum ลงก่อน เหลือแค่ Pulse, Palm Mute บน beat หลัก และ Accent หนึ่งจุด อย่าพยายามเล่นเยอะเพื่อกลบความไม่นิ่ง"
        },
        {
          problem: "เล่นกับ Metronome แล้วกีตาร์ลอยออกจาก click",
          advice: "ฟัง click เหมือน snare ของวง แล้ววางคอร์ดให้กลับมาเจอ beat 2 และ 4 ก่อนค่อยเติมรายละเอียด"
        },
        {
          problem: "พลาดแล้วหยุดทั้งเพลง",
          advice: "ฝึกเล่นต่อจาก beat ถัดไปทันที ตั้งเป้าว่า take นี้ต้องจบ 3 นาที ไม่ใช่ต้องไร้พลาด"
        }
      ],
      miniExample: "เริ่ม 2 ห้องแรกด้วย Palm Mute บน 1 และ 3 เติม Accent ที่ & หลัง 2 ในห้องที่ 3 แล้วเปิดเสียงคอร์ดเต็มในห้องที่ 4 เพื่อให้ Groove มีทิศทาง",
      commonMistakes: [
        "ใส่ทุกอย่างพร้อมกันตั้งแต่ต้นจน Pattern แน่นเกินและฟังไม่ออกว่า Pulse อยู่ตรงไหน",
        "สนใจมือขวามากจนลืมฟัง drum หรือ snare ทำให้กีตาร์ลอยออกจากวง",
        "พอพลาดหนึ่งจุดแล้วหยุดทั้ง take แทนที่จะกลับเข้า beat ถัดไป"
      ],
      selfCheck: [
        "เล่น 3 นาทีแล้ว Metronome หรือ Backing Track ยังรู้สึกเหมือนอยู่กลาง Groove ไม่ใช่ไล่ตามเรา",
        "ฟังย้อนแล้วแยกได้ว่าจุดไหนเป็น Pulse, จุดไหนเป็น Syncopation, จุดไหนใช้ Dynamics หรือ Palm Mute",
        "ถ้าลดจำนวน strum ลง เพลงยังรู้สึกเดินอยู่ แปลว่า time และการวางจังหวะเริ่มแน่น"
      ],
      teacherNote: "ครูแนะนำให้คิดแบบนักดนตรีในวง เล่นให้นักร้องและกลองสบายก่อน อย่าเพิ่งเล่นให้มือขวาดูยุ่ง เพราะ Groove ที่ดีมักเริ่มจากการเว้นที่เป็น"
    },
    earTraining: {
      title: "ฟังว่า Groove ไหน steady กว่า",
      instruction: "ฟังความนิ่งของจังหวะและการเล่นต่อเนื่อง ไม่ต้องฟังชื่อคอร์ดหรือทฤษฎี",
      examples: [
        {
          label: "ตัวอย่าง A",
          description: "เริ่มดี แต่พอมี Accent มากขึ้น tempo เริ่มเร่งและมีหยุดแก้กลางทาง"
        },
        {
          label: "ตัวอย่าง B",
          description: "Pattern เรียบกว่า แต่ Pulse อยู่กับ Metronome ต่อเนื่อง และพลาดเล็กน้อยก็ยังเล่นต่อ"
        }
      ],
      question: "ตัวอย่างไหน feels steadier?",
      hint: "Groove ที่ steady อาจเล่นน้อยกว่า แต่ทำให้เท้าเราเคาะตามได้สบายกว่า"
    },
    miniSong: {
      title: "8-Bar Groove: ให้แบบฝึกกลายเป็นเพลง",
      purpose: "ใช้ open chords ง่าย ๆ เพื่อรวม Pulse, Syncopation, Dynamics และ Palm Mute โดยไม่ต้องคิดทฤษฎีเพิ่ม",
      bars: [
        { bar: 1, chord: "Em", direction: "Palm Mute เบา ๆ บน beat 1 และ 3 ให้ Pulse ตั้งหลัก" },
        { bar: 2, chord: "Em", direction: "คง Palm Mute แล้วเติม ghost strum เบา ๆ ให้มือขวาเดินต่อ" },
        { bar: 3, chord: "G", direction: "เปิดเสียงมากขึ้นเล็กน้อย และวาง Accent ที่ & หลัง 2" },
        { bar: 4, chord: "G", direction: "ลดจำนวน strum ให้ Groove โล่ง แต่เท้ายังอยู่กับ Metronome" },
        { bar: 5, chord: "D", direction: "กลับมา Palm Mute เพื่อให้ท่อนรู้สึกแน่นขึ้น" },
        { bar: 6, chord: "D", direction: "เปิด Accent ที่ & หลัง 4 เพื่อส่งเข้าช่วงท้าย" },
        { bar: 7, chord: "C", direction: "เปิดเสียงคอร์ดเต็มขึ้น เหมือนท่อนเพลงเริ่มยก" },
        { bar: 8, chord: "C", direction: "เล่นให้จบ take เดียว แล้วปล่อยคอร์ดสุดท้ายให้หายใจ" }
      ],
      feel: "นี่ไม่ใช่แค่ exercise แล้ว ให้เล่นเหมือนกำลังพาวงเล็ก ๆ เดินไปข้างหน้า"
    },
    hear: [
      "ฟังภาพรวมก่อน อย่าเพิ่งจับผิดทีละโน้ต: Groove ต้องเดินต่อได้และไม่สะดุด",
      "ฟังว่า Palm Mute ช่วยทำให้ห้องแรก ๆ แน่นขึ้น แล้ว Accent ช่วยดันช่วงท้ายให้มีพลังขึ้นหรือไม่",
      "ถ้าเปิด Backing Track ให้ฟังว่ากีตาร์วางตัวอยู่กับ kick/snare หรือเล่นลอยแยกออกมา"
    ],
    feel: [
      "ให้เท้ารู้สึกถึง Pulse ตลอด ส่วนมือขวาเปลี่ยน texture ระหว่าง mute, open และ Accent",
      "Groove ที่ดีควรรู้สึกเหมือนตัวเราโยกไปข้างหน้าแบบไม่รีบ",
      "ถ้าร่างกายตึงหรือรีบ ให้ลดจำนวน Accent ลงก่อน แล้วค่อยเพิ่มทีละจุด"
    ],
    visual: {
      title: "เห็น Groove ทั้ง 8 ห้องแบบย่อ",
      instruction: "ดู playhead วิ่งผ่าน Pattern: เริ่มจาก Pulse, เติม Syncopation, ใช้ Palm Mute แล้วเปิด Accent ช่วงท้าย",
      duration: 6,
      steps: [
        { count: "1", action: "Mute", kind: "mute" },
        { count: "e", action: "นับ", kind: "rest" },
        { count: "&", action: "Mute", kind: "mute" },
        { count: "a", action: "นับ", kind: "rest" },
        { count: "2", action: "Mute", kind: "mute" },
        { count: "e", action: "นับ", kind: "rest" },
        { count: "&", action: "Accent", kind: "accent" },
        { count: "a", action: "นับ", kind: "rest" },
        { count: "3", action: "เปิด", kind: "open" },
        { count: "e", action: "นับ", kind: "rest" },
        { count: "&", action: "เปิด", kind: "open" },
        { count: "a", action: "นับ", kind: "rest" },
        { count: "4", action: "เปิด", kind: "open" },
        { count: "e", action: "นับ", kind: "rest" },
        { count: "&", action: "Accent", kind: "accent" },
        { count: "a", action: "จบ", kind: "hit" }
      ]
    },
    practice: [
      "สร้าง Groove 8 ห้องด้วยคอร์ดเดียวหรือสองคอร์ดก็ได้",
      "ต้องมี Accent บน off-beat อย่างน้อย 1 จุด",
      "ต้องมีช่วงที่ใช้ Palm Mute และช่วงที่เปิดเสียงคอร์ดเต็ม",
      "อัดเป็น take เดียวให้จบ แม้จะมีพลาดเล็กน้อยก็อย่าหยุดกลางทาง"
    ],
    quiz: [
      {
        question: "ตอนรวม Groove สิ่งที่ต้องนิ่งที่สุดคืออะไร?",
        options: ["Pulse", "Every accent", "Only the volume"],
        answer: 0
      },
      {
        question: "Syncopation ช่วยเพิ่มอะไรให้ Pattern?",
        options: ["ความเคลื่อนไหวและแรงผลัก", "Tuning ใหม่", "กีตาร์ตัวใหม่"],
        answer: 0
      },
      {
        question: "Dynamics ช่วยจัดการอะไรในเพลง?",
        options: ["พลังและ contrast", "หมายเลข fret", "ขนาดสาย"],
        answer: 0
      },
      {
        question: "แบบประเมินท้ายเดือนที่ดีควรเป็นแบบไหน?",
        options: ["เล่น Groove 8 ห้องให้จบโดยไม่หยุด", "ตีให้เร็วที่สุดเท่าที่ทำได้", "เล่น scale position ใหม่"],
        answer: 0
      },
      {
        question: "เป้าหมายของเดือนที่ 1 คืออะไร?",
        options: ["มีพื้นฐาน Rhythm ที่นิ่งและฟังเป็นเพลง", "เรียนทฤษฎีทั้งหมด", "เล่นทุก module พร้อมกัน"],
        answer: 0
      }
    ],
    homework: [
      "อัด Final Groove 8 ห้องแบบ take เดียวให้จบ แม้จะพลาดเล็กน้อยก็ไม่หยุดกลางทาง",
      "ฟังย้อนแล้วเลือก 1 จุดที่ Groove ดี และ 1 จุดที่ต้องเอากลับไปซ้อมต่อ"
    ]
  }
];

const dailyPracticePlan = {
  1: [
    ["Metronome 5 นาที", "นับ 1 2 3 4 5 นาที", "ตีคอร์ดเดียว 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 6 นาที", "นับ 16th Grid 4 นาที", "ตีคอร์ดเดียวให้ตรง beat 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 5 นาที", "เคาะเท้าและนับออกเสียง 5 นาที", "ตีคอร์ดเดียว 6 นาที", "ทำแบบทดสอบ"],
    ["Metronome 6 นาที", "นับออกเสียงให้ชัด 5 นาที", "เล่นแบบฝึกหัด 4 ห้อง 6 นาที", "ทำแบบทดสอบ"],
    ["Metronome 5 นาที", "ฝึก 16th Grid 7 นาที", "ตีคอร์ดเดียว 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 8 นาที", "นับ 1 e & a 5 นาที", "อัดเสียง 30 วินาที 7 นาที", "ทำแบบทดสอบ"],
    ["ทบทวน 5 นาที", "นับกับ Metronome 5 นาที", "อัดเสียง 1 นาที 10 นาที", "ทำแบบทดสอบ"]
  ],
  2: [
    ["Metronome 5 นาที", "นับ off-beat 5 นาที", "ฝึก Syncopation 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 6 นาที", "วาง Accent ที่ & 5 นาที", "Muted strum 6 นาที", "ทำแบบทดสอบ"],
    ["ทบทวน Pulse 5 นาที", "ตบมือบน off-beat 6 นาที", "เล่น Chord Pattern 6 นาที", "ทำแบบทดสอบ"],
    ["Metronome 6 นาที", "เล่น Syncopated Pattern 6 นาที", "อัด 4 ห้อง 5 นาที", "ทำแบบทดสอบ"],
    ["นับจังหวะ 5 นาที", "Upstroke บน off-beat 7 นาที", "ตีคอร์ด 6 นาที", "ทำแบบทดสอบ"],
    ["Metronome 8 นาที", "เล่น Groove loop 6 นาที", "ฟังย้อนกลับ 6 นาที", "ทำแบบทดสอบ"],
    ["ทบทวน 5 นาที", "อัด Syncopation 10 นาที", "จดบันทึก 5 นาที", "ทำแบบทดสอบ"]
  ],
  3: [
    ["Metronome 5 นาที", "เล่นเบา/ดัง 5 นาที", "ฝึก Palm Mute 5 นาที", "ทำแบบทดสอบ"],
    ["Pulse 5 นาที", "หาตำแหน่ง Palm Mute 6 นาที", "Muted Chord 6 นาที", "ทำแบบทดสอบ"],
    ["นับจังหวะ 5 นาที", "คุม Dynamics 7 นาที", "เทียบ Open กับ Muted 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 6 นาที", "ทำ contrast แบบ verse/chorus 6 นาที", "อัด 4 ห้อง 6 นาที", "ทำแบบทดสอบ"],
    ["เล่นเบา 5 นาที", "เล่นดัง 5 นาที", "Palm Mute Groove 8 นาที", "ทำแบบทดสอบ"],
    ["Metronome 8 นาที", "ไล่ Dynamics เบาไปดัง 8 นาที", "จดบันทึก 5 นาที", "ทำแบบทดสอบ"],
    ["ทบทวน 5 นาที", "อัด 3 แบบ 10 นาที", "ฟังย้อนกลับ 5 นาที", "ทำแบบทดสอบ"]
  ],
  4: [
    ["Metronome 5 นาที", "ทบทวน Pulse 5 นาที", "Groove 8 ห้อง 8 นาที", "ทำแบบทดสอบ"],
    ["Metronome 6 นาที", "ทบทวน Syncopation 6 นาที", "ร่าง Groove 8 นาที", "ทำแบบทดสอบ"],
    ["นับจังหวะ 5 นาที", "ทบทวน Dynamics 6 นาที", "Groove แบบ Muted/Open 8 นาที", "ทำแบบทดสอบ"],
    ["Metronome 6 นาที", "Groove 8 ห้อง 10 นาที", "จดบันทึก 5 นาที", "ทำแบบทดสอบ"],
    ["ทบทวน 5 นาที", "ซ้อม Final Groove 10 นาที", "อัด 1 take 5 นาที", "ทำแบบทดสอบ"],
    ["Metronome 8 นาที", "อัดแบบประเมินท้ายเดือน 10 นาที", "ฟังย้อนกลับ 5 นาที", "ทำแบบทดสอบ"],
    ["Warmup 5 นาที", "อัด Final Recording 15 นาที", "สรุปสิ่งที่ได้เรียน 5 นาที", "ทำแบบทดสอบ"]
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
  return saved >= 2 && saved <= 4 ? saved : 1;
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
    nextDayButton.textContent = "วันถัดไป";
  }
  const currentWeekNumber = getCurrentFoundationWeek();
  const weekItem = foundationWeeks.find((week) => week.number === currentWeekNumber);
  const dayNumber = getPracticeDay(currentWeekNumber);
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
  if (nextDayButton) {
    nextDayButton.hidden = false;
    nextDayButton.textContent = "สัปดาห์ถัดไป";
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
    setDataStatus("Month นี้ยังไม่เปิดให้ใช้งานครับ", "error");
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
        focusedSelectedWeek = Number(button.dataset.courseWeek);
        updateDebugState({ currentMonth: selectedFocusedMonth, lastAction: `Week ${focusedSelectedWeek} opened` });
        renderFocusedDashboard();
        renderFocusedWeekTabs();
        renderFocusedLesson();
      });
    });
    return;
  }
  tabs.innerHTML = foundationWeeks.map((weekItem) => {
    const status = completed.includes(weekItem.number) ? "done" : weekItem.number === currentWeekNumber ? "current" : "pending";
    return `
    <button type="button" role="tab" class="card-tab ${status} ${weekItem.number === focusedSelectedWeek ? "active" : ""}" aria-selected="${weekItem.number === focusedSelectedWeek}" data-foundation-week="${weekItem.number}">
      <span class="tab-kicker"><span aria-hidden="true">🎯</span> Foundation</span>
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
      <p class="eyebrow">สัปดาห์ที่ ${weekItem.number}</p>
      <h2>${weekItem.title}</h2>
      <p>${weekItem.summary}</p>
    </div>
    ${renderLessonFlowOverview()}
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
  const selfCheck = weekItem.selfCheck || {};
  const section = month2CreateElement("section", "month2-component month2-self-check-section");
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

function renderLessonMedia(weekItem) {
  const youtube = weekItem.youtube;
  const listenFor = weekItem.learn?.listenFor || weekItem.hear || [];
  if (!youtube?.title) return "";

  return `
    <section class="lesson-block lesson-media-block listen-step-block">
      <div class="lesson-media-copy">
        <p class="eyebrow">1. ฟัง</p>
        <h3>${youtube.title}</h3>
        <p>รอบนี้ไม่มีวิดีโอฝังในแอป ให้ใช้ Metronome ในแถบบนเป็นครูหลัก แล้วฟังว่า click เป็น Pulse ที่เดินนิ่งอยู่ตรงไหนก่อนจับกีตาร์ครับ</p>
      </div>
      <div class="listen-prompt">
        <strong>โจทย์ฟัง</strong>
        <p>ตั้ง tempo ตาม Target BPM ของบทนี้ เคาะเท้ากับ click 30 วินาที แล้วถามตัวเองว่าเสียงกีตาร์ของเราจะลงก่อน click, หลัง click หรือพอดีกับ click</p>
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
        <h3>2. เห็น + เข้าใจ</h3>
        <div class="lesson-target">
          <span>Target BPM</span>
          <strong>${weekItem.learn.targetBpm}</strong>
        </div>
        ${renderLessonDiagram(weekItem.learn.diagram)}
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
      <h3>2. เห็น + เข้าใจ</h3>
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

    flow.appendChild(renderMonth2MissingCard(`ยังไม่รองรับ lesson block type: ${block.type || "unknown"}`));
  });

  return flow;
}

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

function renderChordSoundLab(lab, block = {}, labRef = "") {
  const container = block && typeof block.appendChild === "function" ? block : null;
  const blockData = container ? {} : block;
  if (!lab) return month2AppendResult(renderMonth2MissingCard(`ยังไม่มีห้องทดลองฟังเสียงคอร์ดสำหรับบล็อกนี้${labRef ? ` (${labRef})` : ""}`), container);

  const card = month2CreateElement("article", "month2-component month2-chord-lab-card chord-lab-card");
  card.dataset.labId = lab.id || labRef || "";

  const head = month2CreateElement("header", "component-head");
  head.append(
    month2CreateElement("p", "eyebrow", "ห้องทดลองฟังเสียงคอร์ด"),
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
      clearSequenceTimers();
      activateChordButton(card, button.dataset.chordId);
      const played = await playLabItem(lab, chord, card, blockData);
      if (!played) updateLabStatus(card, chord, false, lab, blockData);
    });
    controls.appendChild(button);
  });

  const actionRow = month2CreateElement("div", "chord-lab-actions");
  const progressionButton = month2CreateElement("button", "progression-button", lab.uiCopy?.playSequence || `Play: ${formatSoundLabSequenceLabel(lab)}`);
  progressionButton.type = "button";
  progressionButton.addEventListener("click", () => playSequence(lab, card, blockData));

  const stopButton = month2CreateElement("button", "stop-button", lab.uiCopy?.stop || "หยุดเสียง");
  stopButton.type = "button";
  stopButton.addEventListener("click", () => {
    stopActiveAudio();
    clearActiveChord(card);
    setLabStatus(card, "หยุดแล้ว ลองฟังใหม่ทีละคอร์ดได้เลยครับ");
  });
  actionRow.append(progressionButton, stopButton);

  const status = month2CreateElement("div", "chord-lab-status sound-lab-coach");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.textContent = "เลือกคอร์ดหรือกดฟังทั้งฟอร์ม";
  const listenList = month2CreateElement("ul", "listen-for-list");
  month2AsArray(lab.listenFor).forEach((item) => listenList.appendChild(month2CreateElement("li", "", item)));
  const fallback = month2CreateElement("p", "audio-fallback-note", lab.uiCopy?.fallback || "ถ้าเสียงไม่ทำงาน ให้ใช้ข้อความบนการ์ดเป็นตัวนำการฟังแทน");

  card.append(head, controls, actionRow, status);
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

function formatSoundLabLabel(chord = {}) {
  const primary = chord.chord || chord.label || chord.id || "Chord";
  const details = [
    chord.degree,
    chord.role,
    chord.feeling
  ].filter((value) => typeof value === "string" && value.trim());

  return [primary, ...details].join(" • ");
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
  const names = sequenceItems
    .map((item) => item?.chord || item?.label || item?.id)
    .filter(Boolean);

  return names.length ? names.join(" → ") : "Progression";
}

function getSoundLabGuideToneText(lab = {}, chord = {}, block = {}) {
  const notes = getLabPlaybackNotes(lab, chord, block);
  if (!notes.length) return "";
  return notes.join(" → ");
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
    setLabStatus(card, "กำลังเล่น Guide Tone", {
      chord: formatSoundLabLabel(chord),
      guideTone: notes.join(" → "),
      role: chord.role || chord.degree || "",
      listenFor: chord.feeling || month2AsArray(lab.listenFor)[0] || "",
      sequence: formatSoundLabSequenceLabel(lab)
    });

    await Promise.all(notes.map((note, index) => {
      const timeOffset = timing.sequential ? (index * timing.stepMs) / 1000 : (index * timing.strumMs) / 1000;
      const duration = timing.durationMs / 1000;

      if (timing.sequential) {
        const noteTimer = window.setTimeout(() => {
          setLabStatus(card, `Playing: ${note}`);
        }, index * timing.stepMs);
        sequenceTimers.push(noteTimer);
      }

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
    setLabStatus(card, "ยังไม่มีลำดับคอร์ดให้ฟัง");
    return;
  }

  const gapMs = Number(lab.audioEngine?.gapMs || 160);
  let nextStartMs = 0;

  setLabStatus(card, "กำลังเล่น Progression", {
    sequence: formatSoundLabSequenceLabel(lab),
    listenFor: month2AsArray(lab.listenFor)[0] || ""
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
    setLabStatus(card, "ฟังครบ Progression แล้ว", {
      sequence: formatSoundLabSequenceLabel(lab),
      listenFor: month2AsArray(lab.listenFor)[0] || "ลองฟังความต่างของสีเสียงแต่ละจุดอีกครั้ง"
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
  const prefix = audioPlayed ? "ฟังแล้ว" : "Text-only preview";
  const guideTone = getSoundLabGuideToneText(lab, chord, block);
  setLabStatus(card, `${prefix}: ${chord.chord || "Chord"}`, {
    chord: formatSoundLabLabel(chord),
    guideTone,
    role: chord.role || chord.degree || "",
    listenFor: chord.feeling || lab.listenFor?.[0] || "",
    sequence: formatSoundLabSequenceLabel(lab)
  });
}

function setLabStatus(card, text, meta = {}) {
  const status = card?.querySelector(".chord-lab-status");
  if (!status) return;

  status.replaceChildren();

  const main = month2CreateElement("strong", "sound-lab-status-main", text || "เลือกคอร์ดหรือกดฟังทั้งฟอร์ม");
  status.appendChild(main);

  const rows = [
    meta.chord ? ["กำลังฟัง", meta.chord] : null,
    meta.guideTone ? ["Guide tone", meta.guideTone] : null,
    meta.role ? ["หน้าที่", meta.role] : null,
    meta.sequence ? ["Progression", meta.sequence] : null,
    meta.listenFor ? ["ฟังหาอะไร", meta.listenFor] : null
  ].filter(Boolean);

  if (!rows.length) return;

  const list = month2CreateElement("div", "sound-lab-status-grid");
  rows.forEach(([label, value]) => {
    const row = month2CreateElement("div", "sound-lab-status-row");
    row.append(
      month2CreateElement("span", "sound-lab-status-label", label),
      month2CreateElement("span", "sound-lab-status-value", value)
    );
    list.appendChild(row);
  });

  status.appendChild(list);
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
        <span><i class="legend-mute"></i>Palm Mute หรือ ghost</span>
        <span><i class="legend-rest"></i>เว้นไว้ แต่นับในใจ</span>
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
        <strong>สัปดาห์ที่ ${weekItem.number}</strong>
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
  if (savedLabel) savedLabel.textContent = "บันทึกไว้ในเครื่องแล้ว";
}

function renderPracticeNotes() {
  const noteInput = document.getElementById("practiceNotes");
  if (!noteInput) return;
  noteInput.value = localStorage.getItem(foundationStorage.notes) || "";
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
    const currentIndex = monthWeeks.findIndex((week) => week.number === focusedSelectedWeek);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % monthWeeks.length : 0;
    focusedSelectedWeek = monthWeeks[nextIndex]?.number || focusedSelectedWeek;
    renderFocusedApp();
    return;
  }
  const currentWeekNumber = getCurrentFoundationWeek();
  const nextDay = getPracticeDay(currentWeekNumber) >= 7 ? 1 : getPracticeDay(currentWeekNumber) + 1;
  setPracticeDay(currentWeekNumber, nextDay);
  renderFocusedDashboard();
}

function resetFoundationProgress() {
  if (!window.confirm("ล้างความคืบหน้าและบันทึกการซ้อมของเดือนที่ 1 หรือไม่?")) return;
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
