# Month 2: Renderer Spec

เอกสารนี้กำหนดโครงสร้าง HTML DOM และแนวทางการเขียน CSS/JS สำหรับ Render ข้อมูลของ Month 2 เพื่อเป็นคู่มือในการสร้าง Prototype ในขั้นตอนถัดไป

สถานะเอกสาร: documentation only ยังไม่แก้ไฟล์ใน `outputs/`, ยังไม่เปิด Month 2 ใน UI จริง, ยังไม่แก้ loader และยังไม่เพิ่ม framework/package ใด ๆ

## เป้าหมายของ Renderer

Renderer ของ Month 2 ต้องทำให้ข้อมูลจาก `MONTH2_DATA_SHAPE_SPEC.md` กลายเป็นประสบการณ์เรียนแบบ "ครูฝึกส่วนตัวที่ใจเย็น" ไม่ใช่แค่ dump JSON ลงหน้าเว็บ

หลักที่ต้องรักษา:

- อ่านง่ายบนมือถือก่อน
- ใช้ Vanilla HTML/CSS/JavaScript เท่านั้น
- ไม่ใช้ network, iframe, package, build tool
- ทุก component ต้อง degrade ได้ ถ้าข้อมูลบางส่วนหาย ให้แสดงข้อความ fallback ที่สุภาพ
- ข้อความยังเป็น Thai-first และเก็บคำดนตรี English เท่าที่จำเป็น เช่น Root, Landmark, Octave, Metronome
- Renderer ต้องไม่ทำให้ Month 1 พัง และไม่เปิด Week 5-8 ใน UI จริงจนกว่าจะได้รับคำสั่งเปิด scope

## Data Sources

Renderer prototype ในอนาคตควรอ่านข้อมูลจาก object ที่มี shape ใกล้เคียง:

```js
{
  weekMeta,
  lessonBlocks,
  fretboardVisuals,
  miniTabs,
  dailyPractice,
  selfCheck
}
```

เพื่อใช้ง่าย ควรแปลง array ที่อ้างอิงด้วย id ให้เป็น lookup map ก่อน render:

```js
const visualsData = Object.fromEntries(data.fretboardVisuals.map((item) => [item.id, item]));
const tabsData = Object.fromEntries(data.miniTabs.map((item) => [item.id, item]));
```

## Shared DOM Rules

- ใช้ `<section>` สำหรับกลุ่มใหญ่ เช่น lesson flow, daily practice, self-check
- ใช้ `<article>` สำหรับ component ที่เป็น card เดี่ยว เช่น fretboard visual, mini tab
- ใช้ `<button type="button">` สำหรับ interactive control
- ใช้ `data-*` สำหรับเก็บ id หรือ type ที่ renderer ต้องอ้างอิง
- Escape text ทุกครั้งก่อนใส่ลง `innerHTML`
- ถ้าใช้ `document.createElement()` จะปลอดภัยกว่าและอ่านง่ายสำหรับ renderer จริง

ฟังก์ชันช่วยที่ควรมี:

```js
function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function byId(items = []) {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}
```

## 1. `renderLessonBlocks(blocks, visualsData, tabsData)`

**หน้าที่:** วนลูปอ่าน array ของ `lessonBlocks` และเรียกใช้ renderer ย่อยตาม `type` ของบล็อก

### แนวทาง DOM

```html
<div class="lesson-flow">
  <div class="lesson-text-block" data-block-id="w5-block-1-home-intro">
    <p class="eyebrow">บทเรียน</p>
    <h3>เริ่มจากคำว่า บ้าน</h3>
    <p>ก่อนจะจำสเกล เราจะเริ่มจากการรู้จัก Root...</p>
    <aside class="teacher-note">ครูแนะนำ: ถ้าหา Root ได้ช้าแต่มั่นใจ นั่นคือมาถูกทางแล้ว</aside>
  </div>

  <article class="fretboard-card" data-visual-id="w5-root-landmarks-s6">
    <!-- renderFretboardVisual() output -->
  </article>

  <article class="mini-tab-card" data-tab-id="w5-tab-root-pulse">
    <!-- renderMiniTab() output -->
  </article>
</div>
```

### CSS Strategy

```css
.lesson-flow {
  display: grid;
  gap: 16px;
}

.lesson-text-block,
.fretboard-card,
.mini-tab-card {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  padding: 16px;
}

.lesson-text-block p {
  line-height: 1.75;
}

.teacher-note {
  margin-top: 12px;
  border-left: 4px solid var(--warm);
  padding: 10px 12px;
  background: color-mix(in srgb, var(--warm), transparent 88%);
}
```

### Vanilla JS Logic

```js
function renderLessonBlocks(blocks = [], visualsData = {}, tabsData = {}) {
  const flow = document.createElement("div");
  flow.className = "lesson-flow";

  blocks.forEach((block) => {
    if (block.type === "text") {
      flow.appendChild(renderTextBlock(block));
      return;
    }

    if (block.type === "fretboard") {
      const visual = visualsData[block.visualRef];
      flow.appendChild(visual ? renderFretboardVisual(visual, block) : renderMissingBlock(block));
      return;
    }

    if (block.type === "tab") {
      const tab = tabsData[block.tabRef];
      flow.appendChild(tab ? renderMiniTab(tab, block) : renderMissingBlock(block));
      return;
    }

    flow.appendChild(renderUnsupportedBlock(block));
  });

  return flow;
}
```

### Fallback Behavior

- ถ้า `visualRef` ไม่เจอ ให้แสดง card สั้น ๆ ว่า "ยังไม่มีภาพประกอบสำหรับบล็อกนี้"
- ถ้า `tabRef` ไม่เจอ ให้แสดง "ยังไม่มี TAB สำหรับแบบฝึกนี้"
- ถ้าเจอ `type` ที่ยังไม่รองรับ ให้แสดงเป็น text fallback ไม่ throw error

## 2. `renderFretboardVisual(visual, blockContext)`

**หน้าที่:** Render ข้อมูล `fretboardVisual` เป็นแผนภาพคอกีตาร์จำลองด้วย CSS Grid

### แนวทาง DOM & CSS

- **ข้อควรระวังเรื่อง String Mapping:** สายกีตาร์ปกติ สาย 6 (เสียงต่ำ) จะอยู่ขอบบนสุดของภาพ และสาย 1 (เสียงสูง) จะอยู่ขอบล่างสุด หากใช้ CSS Grid Row ห้ามโยนค่า `dot.string` ใส่ตรงๆ เพราะภาพจะกลับหัว ต้องทำ Inversion ด้วยสมการ `gridRow = 7 - dot.string` (เช่น สาย 6 จะถูกวางที่ Row 1)

```html
<article class="fretboard-card" data-visual-id="w5-root-landmarks-s6">
  <header class="component-head">
    <p class="eyebrow">ภาพช่วยจำ</p>
    <h3>Landmarks บนสาย 6</h3>
    <p class="caption">สังเกตจุดบน fret 3, 5, 7...</p>
  </header>

  <div class="fretboard-scroll" aria-label="แผนภาพคอกีตาร์">
    <div class="fretboard-grid" style="--start-fret: 1; --end-fret: 8; --fret-count: 8;">
      <!-- String 6 ต้องแสดงบนสุด จึงใช้ grid-row: 1 จากสมการ 7 - 6 -->
      <div class="string-line" style="grid-row: 1;"></div>
      <div class="fret-line" style="grid-column: 1;"></div>
      <span class="fret-dot dot-root" style="grid-row: 1; grid-column: 3;">G</span>
      <span class="fret-dot dot-landmark" style="grid-row: 1; grid-column: 5;">A</span>
    </div>
  </div>

  <ul class="legend-list">
    <li><span class="legend-swatch swatch-root"></span>Root (โน้ตบ้าน)</li>
    <li><span class="legend-swatch swatch-landmark"></span>Landmark (หมุดอ้างอิง)</li>
  </ul>
</article>
```

### CSS Strategy

```css
.fretboard-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8px;
}

.fretboard-grid {
  position: relative;
  display: grid;
  grid-template-rows: repeat(6, 36px);
  grid-template-columns: repeat(var(--fret-count), minmax(48px, 1fr));
  min-width: 420px;
}

.string-line,
.fret-line {
  pointer-events: none;
}

.fret-dot {
  align-self: center;
  justify-self: center;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-weight: 800;
}

.dot-root {
  background: var(--warm);
  color: #111;
}

.dot-landmark {
  background: color-mix(in srgb, var(--ink), transparent 76%);
  color: var(--ink);
}

.dot-octave {
  background: var(--accent);
  color: #111;
}

.legend-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  padding: 0;
  list-style: none;
}
```

### Vanilla JS Logic

```js
function renderFretboardVisual(visual, blockContext = {}) {
  const card = document.createElement("article");
  card.className = "fretboard-card";
  card.dataset.visualId = visual.id;

  const start = visual.config.startFret;
  const end = visual.config.endFret;
  const fretCount = end - start + 1;

  card.innerHTML = `
    <header class="component-head">
      <p class="eyebrow">ภาพช่วยจำ</p>
      <h3>${escapeHTML(blockContext.title || visual.title)}</h3>
      <p class="caption">${escapeHTML(visual.caption || blockContext.instruction || "")}</p>
    </header>
    <div class="fretboard-scroll">
      <div class="fretboard-grid" style="--fret-count:${fretCount}"></div>
    </div>
    <ul class="legend-list"></ul>
  `;

  const grid = card.querySelector(".fretboard-grid");
  visual.dots.forEach((dot) => {
    const visualRow = 7 - dot.string;
    const marker = document.createElement("span");
    marker.className = `fret-dot dot-${dot.type}`;
    marker.textContent = dot.label;
    marker.style.gridRow = String(visualRow);
    marker.style.gridColumn = String(dot.fret - start + 1);
    marker.setAttribute("aria-label", `${dot.label} string ${dot.string} fret ${dot.fret}`);
    grid.appendChild(marker);
  });

  const legend = card.querySelector(".legend-list");
  visual.legend.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="legend-swatch swatch-${escapeHTML(item.type)}"></span>${escapeHTML(item.label)}`;
    legend.appendChild(li);
  });

  return card;
}
```

### Notes

- `gridColumn` ต้องชดเชยด้วย `startFret` เพราะ dot เก็บ fret จริง แต่ grid เริ่มที่ column 1
- `gridRow` ต้อง invert ด้วย `7 - dot.string` เสมอ เพราะข้อมูลใช้เลขสายจริงของกีตาร์ แต่ CSS Grid วาง row 1 ไว้บนสุด
- ถ้า `showNut` เป็น `true` อาจเพิ่ม class `.has-nut` เพื่อวาดเส้น nut หนากว่า fret อื่น
- สีจริงควรมาจาก class ตาม `type` มากกว่าจาก `legend.color` ตรง ๆ เพื่อควบคุม contrast

## 3. `renderMiniTab(tab, blockContext)`

**หน้าที่:** Render Mini-TAB ที่เก็บ `ascii` เป็น array ของ strings พร้อม `lyrics` และคำแนะนำสั้น ๆ

### แนวทาง DOM

```html
<article class="mini-tab-card" data-tab-id="w5-tab-root-pulse">
  <header class="component-head">
    <p class="eyebrow">แบบฝึก TAB</p>
    <h3>Root Pulse Drill: C</h3>
    <span class="bpm-pill">60 BPM</span>
  </header>

  <pre class="tab-block" aria-label="TAB กีตาร์"><code>e|-----------------|
B|-----------------|
G|-----------------|
D|-----------------|
A|-3---3---3---3---|
E|-----------------|</code></pre>

  <ol class="lyrics-row">
    <li>หนึ่ง(C)</li>
    <li>สอง(C)</li>
    <li>สาม(C)</li>
    <li>สี่(C)</li>
  </ol>

  <p class="practice-note">พูดเลขจังหวะในใจ แล้วดีด Root C ให้จมลงไปพร้อม click</p>
</article>
```

### CSS Strategy

```css
.tab-block {
  overflow-x: auto;
  margin: 12px 0;
  border-radius: 12px;
  background: var(--paper);
  padding: 14px;
  font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
  font-size: 0.9rem;
  line-height: 1.65;
  white-space: pre;
}

.lyrics-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 0 4px;
  list-style: none;
}

.lyrics-row li {
  flex: 0 0 auto;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 4px 10px;
  color: var(--muted);
}

.bpm-pill {
  display: inline-flex;
  border-radius: 999px;
  padding: 4px 8px;
  background: color-mix(in srgb, var(--accent), transparent 84%);
}
```

### Vanilla JS Logic

```js
function renderMiniTab(tab, blockContext = {}) {
  const card = document.createElement("article");
  card.className = "mini-tab-card";
  card.dataset.tabId = tab.id;

  const lines = Array.isArray(tab.ascii) ? tab.ascii : String(tab.ascii || "").split("\\n");

  card.innerHTML = `
    <header class="component-head">
      <p class="eyebrow">แบบฝึก TAB</p>
      <h3>${escapeHTML(blockContext.title || tab.title)}</h3>
      <span class="bpm-pill">${escapeHTML(tab.bpm)} BPM</span>
    </header>
    <pre class="tab-block" aria-label="TAB กีตาร์"><code>${escapeHTML(lines.join("\n"))}</code></pre>
    <ol class="lyrics-row"></ol>
    <p class="practice-note">${escapeHTML(tab.note || blockContext.instruction || "")}</p>
  `;

  const lyrics = card.querySelector(".lyrics-row");
  (tab.lyrics || []).forEach((label) => {
    const li = document.createElement("li");
    li.textContent = label;
    lyrics.appendChild(li);
  });

  return card;
}
```

### Notes

- `ascii` ใหม่ควรเป็น `string[]` เสมอ แต่ renderer อาจรองรับ string เก่าไว้เพื่อ migration ได้
- TAB ต้อง scroll ภายใน card เท่านั้น ห้ามดันทั้งหน้าให้ overflow
- `lyrics` ต้องเรียงตามโน้ตจริง ไม่ใช่ตามจำนวนบรรทัด TAB

## 4. `renderDailyPractice(practice)`

**หน้าที่:** Render checklist ซ้อมรายวัน Day 1-7 ให้ผู้เรียนเปิดแล้วรู้ทันทีว่าวันนี้ทำอะไร

### แนวทาง DOM

```html
<section class="daily-practice" data-practice-id="w5-daily-practice">
  <header class="section-head">
    <p class="eyebrow">แผนซ้อมรายวัน</p>
    <h2>Week 5 Daily Practice: รู้บ้าน</h2>
    <p>เริ่มที่ 60 BPM แล้วซ้อมช้า ๆ ให้ตรงก่อน</p>
  </header>

  <div class="practice-days">
    <article class="practice-day-card" data-day="1">
      <header>
        <span class="day-pill">Day 1</span>
        <h3>สาย 6 เป็นแผนที่แรก</h3>
        <p>20 นาที</p>
      </header>
      <p class="day-goal">เริ่มจำ G, A, B บนสาย 6 ด้วย Landmark</p>
      <ol class="task-list">
        <li>
          <label>
            <input type="checkbox">
            <span>ฟัง Metronome - 3 นาที</span>
          </label>
          <p>เปิด 60 BPM แล้วเคาะเท้าตาม 4 ห้อง</p>
        </li>
      </ol>
    </article>
  </div>
</section>
```

### CSS Strategy

```css
.daily-practice {
  display: grid;
  gap: 16px;
}

.practice-days {
  display: grid;
  gap: 12px;
}

.practice-day-card {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  padding: 16px;
}

.task-list {
  display: grid;
  gap: 10px;
  padding-left: 0;
  list-style: none;
}

.task-list label {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-weight: 700;
}

@media (min-width: 780px) {
  .practice-days {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

### Vanilla JS Logic

```js
function renderDailyPractice(practice) {
  const section = document.createElement("section");
  section.className = "daily-practice";
  section.dataset.practiceId = practice.id;

  section.innerHTML = `
    <header class="section-head">
      <p class="eyebrow">แผนซ้อมรายวัน</p>
      <h2>${escapeHTML(practice.title)}</h2>
      <p>เริ่มที่ ${escapeHTML(practice.defaultBpm)} BPM แล้วซ้อมให้ชัดก่อนเพิ่มความเร็ว</p>
    </header>
    <div class="practice-days"></div>
  `;

  const daysWrap = section.querySelector(".practice-days");
  practice.days.forEach((day) => {
    const card = document.createElement("article");
    card.className = "practice-day-card";
    card.dataset.day = day.day;
    card.innerHTML = `
      <header>
        <span class="day-pill">Day ${escapeHTML(day.day)}</span>
        <h3>${escapeHTML(day.title)}</h3>
        <p>${escapeHTML(day.totalMinutes)} นาที</p>
      </header>
      ${day.goal ? `<p class="day-goal">${escapeHTML(day.goal)}</p>` : ""}
      <ol class="task-list"></ol>
    `;

    const list = card.querySelector(".task-list");
    day.tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <label>
          <input type="checkbox" data-day="${day.day}" data-task="${index}">
          <span>${escapeHTML(task.label)} - ${escapeHTML(task.minutes)} นาที</span>
        </label>
        <p>${escapeHTML(task.instruction)}</p>
      `;
      list.appendChild(li);
    });

    daysWrap.appendChild(card);
  });

  return section;
}
```

### Notes

- Prototype แรกอาจไม่ต้อง save checklist ลง Local Storage ถ้ายังเป็น static preview
- ถ้าจะ save ภายหลัง ให้ใช้ key แยก เช่น `month2:w5:dailyPractice`
- อย่าทำ progress logic ผูกกับ Month 1 จนกว่าจะมี requirement เปิด Month 2 จริง

## 5. `renderSelfCheck(selfCheck)`

**หน้าที่:** Render แบบเช็กตัวเอง, criteria และ troubleshooting โดยให้ผู้เรียนรู้ว่าพร้อมไปต่อหรือควรซ้อมตรงไหนซ้ำ

### แนวทาง DOM

```html
<section class="self-check" data-check-id="w5-self-check">
  <header class="section-head">
    <p class="eyebrow">เช็กความพร้อม</p>
    <h2>เช็กว่าเริ่มรู้บ้านหรือยัง</h2>
  </header>

  <article class="question-card" data-question-id="w5-q1">
    <h3>Root ในสัปดาห์นี้หมายถึงอะไร</h3>
    <div class="choice-list">
      <button type="button" data-answer="a">เสียงบ้านของคอร์ดหรือสเกล</button>
      <button type="button" data-answer="b">โน้ตที่ต้องเล่นเร็วที่สุด</button>
    </div>
    <p class="feedback" hidden></p>
  </article>

  <section class="pass-criteria">
    <h3>ผ่านเมื่อ</h3>
    <ul>
      <li>หา C, G, D, A, E ได้โดยไม่เดา</li>
    </ul>
  </section>

  <section class="troubleshooting">
    <h3>ถ้ายังติด ให้แก้ตรงนี้</h3>
    <details>
      <summary>หา Root ถูกบ้างผิดบ้าง</summary>
      <p>ลดจำนวนโน้ตลง...</p>
    </details>
  </section>
</section>
```

### CSS Strategy

```css
.self-check {
  display: grid;
  gap: 16px;
}

.question-card,
.pass-criteria,
.troubleshooting {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  padding: 16px;
}

.choice-list {
  display: grid;
  gap: 8px;
}

.choice-list button {
  text-align: left;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface-soft);
  color: var(--ink);
  padding: 10px 12px;
}

.choice-list button.is-correct {
  border-color: var(--accent);
}

.choice-list button.is-wrong {
  border-color: var(--warm);
}

.feedback {
  margin-top: 10px;
  color: var(--muted);
}
```

### Vanilla JS Logic

```js
function renderSelfCheck(selfCheck) {
  const section = document.createElement("section");
  section.className = "self-check";
  section.dataset.checkId = selfCheck.id;

  section.innerHTML = `
    <header class="section-head">
      <p class="eyebrow">เช็กความพร้อม</p>
      <h2>${escapeHTML(selfCheck.title)}</h2>
    </header>
    <div class="question-list"></div>
    <section class="pass-criteria"><h3>ผ่านเมื่อ</h3><ul></ul></section>
    <section class="troubleshooting"><h3>ถ้ายังติด ให้แก้ตรงนี้</h3></section>
    <p class="pass-summary">${escapeHTML(selfCheck.passSummary || "")}</p>
  `;

  const questionList = section.querySelector(".question-list");
  selfCheck.questions.forEach((question) => {
    questionList.appendChild(renderQuestion(question));
  });

  const criteriaList = section.querySelector(".pass-criteria ul");
  (selfCheck.passCriteria || []).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    criteriaList.appendChild(li);
  });

  const trouble = section.querySelector(".troubleshooting");
  (selfCheck.troubleshooting || []).forEach((item) => {
    const details = document.createElement("details");
    details.innerHTML = `<summary>${escapeHTML(item.problem)}</summary><p>${escapeHTML(item.advice)}</p>`;
    trouble.appendChild(details);
  });

  return section;
}
```

ตัวอย่าง renderer ย่อยสำหรับคำถาม:

```js
function renderQuestion(question) {
  const card = document.createElement("article");
  card.className = "question-card";
  card.dataset.questionId = question.id;

  card.innerHTML = `<h3>${escapeHTML(question.prompt)}</h3>`;

  if (question.type === "multiple-choice") {
    const choices = document.createElement("div");
    choices.className = "choice-list";

    question.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = choice.text;
      button.dataset.answer = choice.id;
      button.addEventListener("click", () => showQuestionFeedback(card, question, choice.id));
      choices.appendChild(button);
    });

    card.appendChild(choices);
    const feedback = document.createElement("p");
    feedback.className = "feedback";
    feedback.hidden = true;
    card.appendChild(feedback);
    return card;
  }

  const condition = document.createElement("p");
  condition.className = "practice-note";
  condition.textContent = question.passCondition || "เช็กด้วยตัวเองอย่างใจเย็น แล้วจดสิ่งที่ยังติด";
  card.appendChild(condition);
  return card;
}
```

### Notes

- Self-check ไม่จำเป็นต้องมีคะแนนรวมใน prototype แรก
- Practical check และ reflection ควรแสดงเป็นคำแนะนำให้ลองทำจริง ไม่ใช่ปุ่มตอบถูกผิด
- Troubleshooting ควรใช้ `<details>` เพื่อให้หน้าไม่ยาวและไม่กดดันผู้เรียน

## Integration Example

ตัวอย่างการ render Week 5 mock data ใน prototype:

```js
function renderMonth2Week(root, data) {
  const visualsData = byId(data.fretboardVisuals || []);
  const tabsData = byId(data.miniTabs || []);

  root.replaceChildren();
  root.appendChild(renderWeekHeader(data.weekMeta));
  root.appendChild(renderLessonBlocks(data.lessonBlocks || [], visualsData, tabsData));
  root.appendChild(renderDailyPractice(data.dailyPractice));
  root.appendChild(renderSelfCheck(data.selfCheck));
}
```

`renderWeekHeader()` อาจเป็น header ธรรมดา:

```html
<header class="month2-week-header">
  <p class="eyebrow">Month 2 / Week 5</p>
  <h1>รู้บ้าน (Root & Landmarks)</h1>
  <p>จบสัปดาห์นี้ผู้เรียนจะเริ่มรู้ว่า Root อยู่ตรงไหน...</p>
</header>
```

## Accessibility Notes

- ใช้ heading hierarchy ตามลำดับ: `h1` สำหรับชื่อสัปดาห์, `h2` สำหรับ section, `h3` สำหรับ card
- ปุ่มทุกปุ่มต้องเป็น `<button type="button">`
- Fretboard dots ควรมี `aria-label` ที่บอก string/fret/label
- TAB ควรอยู่ใน `<pre><code>` และมี `aria-label`
- สี dot ต้องมี contrast พอทั้ง dark/light theme
- อย่าให้ horizontal scroll ของ TAB หรือ fretboard ทำให้ทั้งหน้า overflow

## Performance Notes

- สร้าง lookup map ด้วย `byId()` ครั้งเดียวต่อ render
- ใช้ `DocumentFragment` ได้ถ้าข้อมูลยาวขึ้น
- อย่า bind event ซ้ำทุกครั้งโดยไม่ clear root ก่อน
- Prototype แรกไม่ควรมี animation หนักใน fretboard
- Renderer ต้องทำงานได้จาก local static file/server โดยไม่ใช้ network ภายนอก

## Implementation Guardrails

- เอกสารนี้ไม่ใช่คำสั่งให้เปิด Week 5-8 ใน main UI
- ห้ามแก้ `outputs/index.html`, `outputs/styles.css`, `outputs/app.js`, `outputs/data.json` จากงานเอกสารนี้
- ห้ามเพิ่ม framework, package, build tool หรือ fetch ไปหา network ภายนอก
- ถ้าใช้ mock data ให้ใช้ใน prototype แยกหรือ docs-only จนกว่าจะมีคำสั่งเปิด Month 2
- ถ้าข้อมูลไม่ครบ renderer ต้องแสดง fallback แบบสุภาพ ไม่ทำให้หน้าขาว

## Next-step TODOs

- สร้าง prototype แยกสำหรับ Month 2 Week 5 โดยใช้ `MONTH2_WEEK5_MOCK_DATA.json`
- ทดลอง render `fretboardVisual` ด้วย CSS Grid บนมือถือก่อน
- ตรวจ alignment ของ `miniTab.ascii` array กับ `lyrics`
- สร้าง CSS tokens เฉพาะ component โดยอิง palette เดิมของ Guitar Companion
- เมื่อ prototype ผ่านแล้ว ค่อยพิจารณา map shape นี้เข้ากับ `outputs/data.json`
