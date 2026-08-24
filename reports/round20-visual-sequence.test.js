'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { URLSearchParams } = require('url');

const ROOT = path.resolve(__dirname, '..');
const appJsPath = path.join(ROOT, 'outputs', 'app.js');
const appCode = fs.readFileSync(appJsPath, 'utf8');

console.log('='.repeat(80));
console.log('ROUND 20 — TARGETED VISUAL LESSON SEQUENCE TEST SUITE');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

function check(label, condition) {
  if (condition) {
    passed += 1;
    console.log(`  PASS: ${label}`);
  } else {
    failed += 1;
    console.error(`  FAIL: ${label}`);
  }
}

// Create a DOM mock environment to simulate renderFocusedLesson() in vm
const domElements = {};
function createMockElement(id) {
  return {
    id,
    innerHTML: '',
    value: '',
    setAttribute: () => {},
    getAttribute: () => null,
    removeAttribute: () => {},
    remove: () => {},
    appendChild: () => {},
    insertBefore: () => {},
    replaceChildren: () => {},
    addEventListener: () => {},
    querySelector: () => createMockElement('child-query'),
    querySelectorAll: () => [],
    dataset: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
    style: {}
  };
}

const mockDocument = {
  documentElement: { dataset: {} },
  createElement: (tag) => createMockElement(tag),
  getElementById: (id) => {
    if (!domElements[id]) {
      domElements[id] = createMockElement(id);
    }
    return domElements[id];
  },
  querySelector: () => createMockElement('query'),
  querySelectorAll: () => [],
  addEventListener: () => {}
};

const mockLocalStorage = {
  store: {},
  getItem: (key) => mockLocalStorage.store[key] || null,
  setItem: (key, val) => { mockLocalStorage.store[key] = String(val); },
  removeItem: (key) => { delete mockLocalStorage.store[key]; }
};

const mockWindow = {
  document: mockDocument,
  location: { search: '', hash: '', pathname: '/', href: 'http://127.0.0.1:5173/' },
  URLSearchParams,
  localStorage: mockLocalStorage,
  matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
  addEventListener: () => {},
  AudioContext: class {
    createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {} } }; }
    createOscillator() { return { connect: () => {}, start: () => {}, stop: () => {} }; }
  },
  webkitAudioContext: class {}
};

// Sandbox context
const sandbox = {
  window: mockWindow,
  document: mockDocument,
  URLSearchParams,
  location: mockWindow.location,
  localStorage: mockLocalStorage,
  matchMedia: mockWindow.matchMedia,
  console,
  setTimeout: () => {},
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {},
  navigator: { userAgent: 'node-test' },
  Audio: class { play() {} pause() {} }
};

vm.createContext(sandbox);

try {
  vm.runInContext(appCode + '\nglobalThis.__exportedFoundationWeeks = foundationWeeks;\nglobalThis.__setFocusedSelectedWeek = (w) => { focusedSelectedWeek = w; selectedFocusedMonth = 1; };\n', sandbox);
  console.log('-> app.js evaluated in sandbox successfully.');
} catch (e) {
  console.error('-> Error evaluating app.js in sandbox:', e);
}

// Test renderFocusedLesson for all 4 weeks of Month 1
for (let weekNum = 1; weekNum <= 4; weekNum++) {
  console.log(`\n--- Auditing Week ${weekNum} Rendered Visual Sequence ---`);

  if (typeof sandbox.__setFocusedSelectedWeek === 'function') {
    sandbox.__setFocusedSelectedWeek(weekNum);
  }

  try {
    sandbox.renderFocusedLesson();
    const renderedHtml = domElements['lessonPanel'] ? domElements['lessonPanel'].innerHTML : '';

    // 1. Check presence of all key section markers
    const idxSec1 = renderedHtml.indexOf('1. วันนี้เราจะทำอะไร');
    const idxSec2 = renderedHtml.indexOf('2. เห็น + เข้าใจ');
    const idxSec3 = renderedHtml.indexOf('3. เล่น: แบบฝึกหัด');
    const idxSec4 = renderedHtml.indexOf('4. เช็ก: แบบทดสอบ');

    check(`W${weekNum}: Section 1 heading is present in DOM`, idxSec1 >= 0);
    check(`W${weekNum}: Section 2 heading is present in DOM`, idxSec2 >= 0);
    check(`W${weekNum}: Section 3 heading is present in DOM`, idxSec3 >= 0);
    check(`W${weekNum}: Section 4 heading is present in DOM`, idxSec4 >= 0);

    // 2. Strict sequential order: 1 -> 2 -> 3 -> 4
    check(`W${weekNum}: Sequential order: 1 < 2 < 3 < 4`, idxSec1 < idxSec2 && idxSec2 < idxSec3 && idxSec3 < idxSec4);

    // 3. Section 2 appears BEFORE Daily Core practice cards container
    const idxCoreContainer = renderedHtml.indexOf('month1-v2-core');
    const idxChromaticCard = renderedHtml.indexOf('<p class="eyebrow">Chromatic</p>');
    const idxScaleCard = renderedHtml.indexOf('<p class="eyebrow">Scale</p>');
    const idxArpeggioCard = renderedHtml.indexOf('<p class="eyebrow">Arpeggio</p>');
    const idxGrooveCard = renderedHtml.indexOf('<p class="eyebrow">Rhythm + Application</p>');

    check(`W${weekNum}: Section 2 appears BEFORE Daily Core practice container`, idxSec2 < idxCoreContainer);
    check(`W${weekNum}: Section 2 appears BEFORE Chromatic practice card`, idxSec2 < idxChromaticCard);
    check(`W${weekNum}: Section 2 appears BEFORE Scale practice card`, idxSec2 < idxScaleCard);
    check(`W${weekNum}: Section 2 appears BEFORE Arpeggio practice card`, idxSec2 < idxArpeggioCard);
    check(`W${weekNum}: Section 2 appears BEFORE Groove practice card`, idxSec2 < idxGrooveCard);

    // 4. Section 1 contains today's explicit goal statement from foundationWeeks
    const foundationWeeks = sandbox.__exportedFoundationWeeks || [];
    const weekItem = foundationWeeks.find((w) => w.number === weekNum);
    check(`W${weekNum}: Section 1 contains todayGoal (${weekItem?.todayGoal?.slice(0, 30)}...)`, weekItem && weekItem.todayGoal && renderedHtml.includes(weekItem.todayGoal));

    // 5. Section 1 contains Metronome guidance
    check(`W${weekNum}: Section 1 contains Metronome guidance`, renderedHtml.includes('เปิด Metronome ในแถบควบคุมด้านบน'));

    // 6. Section 3 contains 4 pillars
    check(`W${weekNum}: Section 3 contains 4-pillar cards container`, renderedHtml.includes('month1-v2-core-grid'));

  } catch (err) {
    failed += 1;
    console.error(`  FAIL: Week ${weekNum} rendering error:`, err);
  }
}

console.log('='.repeat(80));
console.log(`ROUND 20 TEST SUMMARY: ${passed} passed, ${failed} failed`);
console.log('='.repeat(80));

process.exitCode = failed ? 1 : 0;
