'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(ROOT, 'outputs', 'app.js'), 'utf8');
const r6 = fs.readFileSync(path.join(ROOT, 'docs', 'MONTH1_V4_FINAL_LESSON_DRAFT_R6.md'), 'utf8');

let passed = 0;
let failed = 0;

function check(label, condition) {
  if (condition) {
    passed += 1;
    console.log(`PASS: ${label}`);
  } else {
    failed += 1;
    console.error(`FAIL: ${label}`);
  }
}

const r6Start = app.indexOf('const month1V4R6Overrides = {');
const r6End = app.indexOf('\n};\n\nObject.values(month1V4R6Overrides)', r6Start);
const r6Source = r6Start >= 0 && r6End > r6Start ? app.slice(r6Start, r6End) : '';

check('Week 1 R6 override exists', /\n  1: \{/.test(r6Source));
check('Week 2 R6 override exists', /\n  2: \{/.test(r6Source));
check('Week 3 R6 override exists', /\n  3: \{/.test(r6Source));
check('Week 4 R6 override exists', /\n  4: \{/.test(r6Source));
check('E–G–A–B partial is present', r6Source.includes('E–G–A–B') && r6Source.includes('0(E)') && r6Source.includes('0(A)'));
check('Em E–B–E–G and 1–5–1–♭3 are present', r6Source.includes('E–B–E–G') && r6Source.includes('1 → 5 → 1 → ♭3'));
check('C–E–G is present', r6Source.includes('C–E–G') && r6Source.includes('สาย 5–4–3'));
check('F#–G–G#–A is present', r6Source.includes('F# → G → G# → A'));
check('Em → C is present', r6Source.includes('Em → C'));
check('8-bar graduation is present', r6Source.includes('4 bars × 2 rounds = 8 continuous bars'));
check('60–70 BPM graduation is present', r6Source.includes('60–70 BPM'));
check('Full-chord bridge is present', /full-chord bridge/i.test(r6Source) && r6Source.includes('สาย 6 → 5 → 4 → 3 → 2 → 1'));
check('Eighth-note motor bridge is present', r6Source.includes('Motor bridge') && r6Source.includes('air-stroke'));
check('W4 walk-up timing map is present', r6Source.includes('3 = F#') && r6Source.includes('3& = G') && r6Source.includes('4 = G#') && r6Source.includes('4& = air/rest') && r6Source.includes('next 1 = A'));
check('Phrase resolution timing map is present', r6Source.includes('3 = B') && r6Source.includes('3& = A') && r6Source.includes('4 = G') && r6Source.includes('next 1 = E'));
check('Recovery renderer is wired', app.includes('renderMonth1V4R6RecoveryGuide(weekItem)') && app.includes('const month1V4R6RecoveryGuide'));
check('R6 override has selection priority for Month 1', app.includes('month1V4R6Overrides[weekItem.number] || month1V2Overrides[weekItem.number]'));
check('R6 disables legacy Week 2 rhythm-geometry fallback', app.includes('isWeek2 && !weekItem?.r6Content') && app.includes('override.r6Content = true'));
check('R6 replaces the legacy graduation mini-song', app.includes('const month1V4R6Graduation') && app.includes('month1V4R6Overrides[4].miniSong = month1V4R6Graduation'));
check('Canonical learning loop is preserved', r6Source.includes('DO → HEAR → FIX → REPEAT → UNDERSTAND → NAME'));
check('R6 source document contains all four weekly headings', ['# WEEK 1', '# WEEK 2', '# WEEK 3', '# WEEK 4'].every((heading) => r6.includes(heading)));
check('R6 source document contains Daily Core and recovery', r6.includes('# DAILY PRACTICE FLOW — 15–20 นาที') && r6.includes('# BEGINNER RECOVERY GUIDE'));

console.log(`\nMonth 1 V4 R6 implementation tests: ${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
