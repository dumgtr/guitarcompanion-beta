# Month 2 Week 7: Mock Data Plan (Major Scale Formula / Scale Degrees)

เอกสารนี้เป็นแผนเตรียม mock data สำหรับ Week 7 เท่านั้น ยังไม่ใช่ implementation และยังไม่ต้องแก้ `outputs/` หรือ `prototypes/`

## 1. Goal

สร้างชุดข้อมูล Week 7 ที่เชื่อม Root จาก Week 5 และ Octave Shape จาก Week 6 เข้ากับ C Major Scale 1 octave โดยสอน scale degrees เป็น "เลขของเสียง" ไม่ใช่ทฤษฎีหนัก ผู้เรียนควรร้องหรือพูด 1-2-3-4-5-6-7-1 ไปพร้อมกับการเล่นช้า ๆ ได้

## 2. Target File for Future Prototype

เมื่อเริ่มทำ prototype จริง ควรสร้างข้อมูลในลักษณะเดียวกับ:

```text
prototypes/month2-week7/mock-data.js
```

และใช้ global object:

```javascript
const WEEK7_MOCK_DATA = {
  weekMeta: {},
  lessonBlocks: [],
  fretboardVisuals: [],
  miniTabs: [],
  dailyPractice: [],
  selfCheck: {}
};
```

## 3. Critical Orientation Rule

Week 7 ต้องคงกฎภาพให้ชัดเจน เพราะผู้เรียนจะอ่าน Fretboard Visualizer คู่กับ Mini-TAB บ่อยขึ้น

### Fretboard Visualizer

- String 6 (Low E) อยู่ด้านบนสุดของภาพ = Row 1
- String 1 (High e) อยู่ด้านล่างสุดของภาพ = Row 6
- ต้องมี label ใกล้ภาพ:
  - `สาย 6 / Low E` ด้านบน
  - `สาย 1 / High e` ด้านล่าง
- ใช้ orientation note:
  - `แผนที่คอกีตาร์: สาย 6 อยู่ด้านบน เหมือนมองคอกีตาร์ตอนถือเล่น`

### Mini-TAB

- Standard TAB ต้องคงแบบมาตรฐาน:
  - String 1 (High e) อยู่บรรทัดบน
  - String 6 (Low E) อยู่บรรทัดล่าง
- ต้องมี label หรือ note:
  - `TAB มาตรฐาน: สาย 1 อยู่บรรทัดบน และสาย 6 อยู่บรรทัดล่าง`
  - `TAB อ่านจากบนลงล่าง = สาย 1 ถึงสาย 6`

## 4. `weekMeta`

```json
{
  "week": 7,
  "month": 2,
  "title": "Major Scale Formula / Scale Degrees",
  "module": "fretboard",
  "theme": "Fretboard Foundation",
  "estimatedMinutesPerDay": 20,
  "subtitle": "เลขของเสียง 1-2-3-4-5-6-7-1",
  "promise": "เชื่อม Root และ Octave ให้เป็นเส้นทาง C Major 1 octave ที่ร้องเลขของเสียงไปพร้อมกับการเล่นได้"
}
```

## 5. Lesson Blocks Plan

ควรมี 6 blocks เพื่อให้ flow เป็นฟัง -> เห็น -> เล่น -> เช็ก โดยไม่หนักเกินไป:

1. Text block: เปิดบทเรียน Root, Octave และ scale degrees
2. Fretboard block: C Major 1 octave map
3. Text block: Major Scale formula แบบเบา ๆ Whole / Half
4. Mini-TAB block: C Major ascending & descending
5. Mini-TAB block: Mini phrase 1-2-3-5
6. Text block: วิธีฟังโน้ต 1 ให้จบเคลียร์ และวิธีใช้ปากนำมือ

ตัวอย่าง skeleton:

```json
[
  {
    "id": "w7-block-1-opening",
    "type": "text",
    "title": "จากบ้านสองหลัง กลายเป็นถนนหนึ่งเส้น",
    "body": "Week 5 เราหา Root ได้ Week 6 เราหา Octave ได้ วันนี้เราจะเติมโน้ตระหว่าง 1 ถึง 1 ให้กลายเป็น C Major Scale 1 octave...",
    "teacherNote": "อย่าเพิ่งคิดว่า scale คือการเล่นเร็ว ให้คิดว่า scale คือทางเดินของเสียงที่เราร้องตามได้"
  },
  {
    "id": "w7-block-2-c-major-map",
    "type": "fretboard",
    "title": "C Major 1 Octave Map",
    "visualRef": "w7-c-major-1-octave",
    "instruction": "มอง C เป็นเลข 1 และ C ตัวบนเป็นเลข 1 อีกชั้นเสียงหนึ่ง จากนั้นดูเลข 2-7 เป็นทางเดินระหว่างบ้านสองหลัง"
  },
  {
    "id": "w7-block-4-c-major-tab",
    "type": "tab",
    "title": "C Major 1 Octave: Ascending & Descending",
    "tabRef": "w7-tab-c-major-up-down",
    "instruction": "เล่นช้า ๆ และพูดเลข degree ให้ตรงกับทุกโน้ต"
  }
]
```

## 6. Fretboard Visuals Plan

ควรมี visual อย่างน้อย 3 ชุด:

- `w7-c-major-1-octave`: แผนที่ C Major จากสาย 5 fret 3 ถึงสาย 3 fret 5
- `w7-degree-anchors-1-3-5`: แสดงโน้ต 1, 3, 5 เพื่อเริ่มฟังเสียงที่นิ่งและเป็นดนตรี
- `w7-root-octave-scale-bridge`: แสดง Root C, Octave C และทางเดิน 2-7 ระหว่างกลาง

ตัวอย่าง C Major 1 octave:

```json
{
  "id": "w7-c-major-1-octave",
  "type": "fretboard",
  "title": "C Major 1 Octave",
  "caption": "เริ่มจาก C(1) บนสาย 5 fret 3 แล้วเดินไปจนถึง C(1) บนสาย 3 fret 5",
  "config": {
    "startFret": 1,
    "endFret": 5,
    "showNut": false
  },
  "legend": [
    { "type": "root", "color": "orange", "label": "1 / Root" },
    { "type": "degree", "color": "gray", "label": "Scale Degree" },
    { "type": "octave", "color": "gold", "label": "1 / Octave" }
  ],
  "dots": [
    { "string": 5, "fret": 3, "label": "1", "type": "root" },
    { "string": 5, "fret": 5, "label": "2", "type": "degree" },
    { "string": 4, "fret": 2, "label": "3", "type": "degree" },
    { "string": 4, "fret": 3, "label": "4", "type": "degree" },
    { "string": 4, "fret": 5, "label": "5", "type": "degree" },
    { "string": 3, "fret": 2, "label": "6", "type": "degree" },
    { "string": 3, "fret": 4, "label": "7", "type": "degree" },
    { "string": 3, "fret": 5, "label": "1", "type": "octave" }
  ]
}
```

ตัวอย่าง degree anchors:

```json
{
  "id": "w7-degree-anchors-1-3-5",
  "type": "fretboard",
  "title": "เสียงหลัก 1-3-5",
  "caption": "เริ่มฟังเสียงที่นิ่งและเป็นดนตรีก่อน: 1 คือบ้าน, 3 ให้สีเมเจอร์, 5 ทำให้เสียงมั่นคง",
  "config": {
    "startFret": 1,
    "endFret": 5,
    "showNut": false
  },
  "legend": [
    { "type": "root", "color": "orange", "label": "1 / Root" },
    { "type": "target", "color": "gold", "label": "Target Degree" }
  ],
  "dots": [
    { "string": 5, "fret": 3, "label": "1", "type": "root" },
    { "string": 4, "fret": 2, "label": "3", "type": "target" },
    { "string": 4, "fret": 5, "label": "5", "type": "target" },
    { "string": 3, "fret": 5, "label": "1", "type": "root" }
  ]
}
```

## 7. Mini-TAB Plan

Mini-TAB ต้องสั้น อ่านง่าย และ scroll อยู่ใน card เท่านั้น ห้ามทำให้ body กว้างล้นจอ

### `w7-tab-c-major-up-down`

```json
{
  "id": "w7-tab-c-major-up-down",
  "type": "tab",
  "title": "C Major 1 Octave: Up & Down",
  "bpm": 60,
  "ascii": [
    "e|-----------------|-----------------|",
    "B|-----------------|-----------------|",
    "G|---------2-4-5---|-5-4-2-----------|",
    "D|---2-3-5---------|-------5-3-2-----|",
    "A|-3-5-------------|-------------5-3-|",
    "E|-----------------|-----------------|"
  ],
  "lyrics": "  1 2 3 4 5 6 7 1   1 7 6 5 4 3 2 1",
  "note": "เล่นช้า ๆ แล้วพูดเลข degree ให้ตรงกับเสียงที่ออกจากกีตาร์"
}
```

### `w7-tab-degree-phrase-1235`

```json
{
  "id": "w7-tab-degree-phrase-1235",
  "type": "tab",
  "title": "Mini Phrase: 1-2-3-5",
  "bpm": 60,
  "ascii": [
    "e|-----------------|-----------------|",
    "B|-----------------|-----------------|",
    "G|-----------------|-----------------|",
    "D|-----2-------5---|-----2-----------|",
    "A|-3-5---3-5-------|-3-5---5-3-------|",
    "E|-----------------|-----------------|"
  ],
  "lyrics": "  1 2 3 1 2 5     1 2 3 2 1",
  "note": "ใช้โน้ตน้อย ๆ ให้เป็นวลีดนตรี ฟังว่า 1 ให้ความรู้สึกจบและนิ่งที่สุด"
}
```

## 8. Daily Practice Plan

ใช้ accordion แบบ grouped 7-day schedule เหมือน Week 5-6:

```javascript
dailyPractice: [
  {
    dayLabel: "Day 1-2",
    focus: "Root to Octave: 1 ถึง 1",
    isOpen: true,
    exercises: [
      {
        id: "m2-w7-d1-p1",
        duration: "4 นาที",
        title: "ชี้เลข 1 สองตำแหน่ง",
        instruction: "หา C(1) สาย 5 fret 3 และ C(1) สาย 3 fret 5 แล้วเล่นสลับกันช้า ๆ"
      },
      {
        id: "m2-w7-d1-p2",
        duration: "6 นาที",
        title: "เดิน C Major ช้า ๆ",
        instruction: "เล่น 1-2-3-4-5-6-7-1 ที่ 60 BPM โดยพูดเลขก่อนดีดทุกครั้ง"
      }
    ]
  },
  {
    dayLabel: "Day 3-4",
    focus: "Ascending & Descending",
    isOpen: false,
    exercises: [
      {
        id: "m2-w7-d3-p1",
        duration: "6 นาที",
        title: "ขึ้นและลงช้า ๆ",
        instruction: "เล่น w7-tab-c-major-up-down ช้า ๆ ให้เสียงทุกตัวชัดและไม่บอด"
      },
      {
        id: "m2-w7-d4-p1",
        duration: "4 นาที",
        title: "ปากนำมือ",
        instruction: "พูดเลข degree ก่อนดีด ถ้าปากไม่ทัน ให้หยุดและเริ่มใหม่"
      }
    ]
  },
  {
    dayLabel: "Day 5",
    focus: "Degree naming",
    isOpen: false,
    exercises: [
      {
        id: "m2-w7-d5-p1",
        duration: "5 นาที",
        title: "สุ่มเลขของเสียง",
        instruction: "สุ่มพูดเลข 1, 3, 5 แล้วหาตำแหน่งใน C Major 1 octave ให้เจอ"
      },
      {
        id: "m2-w7-d5-p2",
        duration: "5 นาที",
        title: "ร้องแล้วเล่น",
        instruction: "ฮัม 1-2-3-4-5-6-7-1 เบา ๆ แล้วเล่นตามแบบไม่รีบ"
      }
    ]
  },
  {
    dayLabel: "Day 6-7",
    focus: "Mini musical phrase & Self-check",
    isOpen: false,
    exercises: [
      {
        id: "m2-w7-d6-p1",
        duration: "6 นาที",
        title: "Mini Phrase 1-2-3-5",
        instruction: "เล่น w7-tab-degree-phrase-1235 ให้เป็นวลี ไม่ใช่ดีดไล่โน้ต"
      },
      {
        id: "m2-w7-d7-p1",
        duration: "5 นาที",
        title: "ทำ Self-Check",
        instruction: "เช็กว่าปากพูดเลขตรงกับนิ้ว และเสียงโน้ต 1 ฟังแล้วจบเคลียร์"
      }
    ]
  }
]
```

## 9. Self-check Plan

```json
{
  "type": "self-check",
  "id": "w7-self-check",
  "week": 7,
  "title": "เช็กว่าเลขของเสียงเริ่มตรงกับมือหรือยัง",
  "questions": [
    {
      "id": "w7-q1",
      "type": "multiple-choice",
      "prompt": "ใน C Major Scale เลข 1 คืออะไร",
      "choices": [
        { "id": "a", "text": "C หรือ Root", "correct": true },
        { "id": "b", "text": "โน้ตที่ต้องเล่นเร็วที่สุด" },
        { "id": "c", "text": "เสียงที่อยู่บนสาย 1 เท่านั้น" }
      ],
      "answer": "a"
    },
    {
      "id": "w7-q2",
      "type": "multiple-choice",
      "prompt": "Major Scale 1 octave เดินเลขอย่างไร",
      "choices": [
        { "id": "a", "text": "1-2-3-4-5-6-7-1", "correct": true },
        { "id": "b", "text": "1-3-5-7 เท่านั้น" },
        { "id": "c", "text": "1-4-5-1 เท่านั้น" }
      ],
      "answer": "a"
    },
    {
      "id": "w7-q3",
      "type": "practical-check",
      "prompt": "เล่น C Major 1 octave ขึ้นลงได้ช้า ๆ หรือยัง",
      "instruction": "เล่นขึ้นและลงที่ 60 BPM โดยเสียงทุกตัวชัด และพูดเลข 1-7-1 ให้ตรงกับนิ้ว",
      "passCondition": "เล่นขึ้นลงได้ครบโดยไม่หยุดกลางทาง และเสียงไม่บอด"
    },
    {
      "id": "w7-q4",
      "type": "reflection",
      "prompt": "โน้ตเลข 1 ให้ความรู้สึกอย่างไร",
      "instruction": "อธิบายด้วยคำของตัวเองว่าเวลาเล่นกลับมาที่เลข 1 ทำไมเสียงถึงรู้สึกจบหรือพัก",
      "passCondition": "อธิบายได้ว่าเลข 1 คือบ้านหรือจุดพักของเสียง"
    }
  ],
  "passCriteria": [
    "เล่น C Major 1 octave ขึ้นลงได้ช้า ๆ ชัด ๆ",
    "พูดเลข 1-2-3-4-5-6-7-1 ตรงกับโน้ตที่เล่น",
    "ฟังออกว่าเลข 1 ให้ความรู้สึกจบและนิ่ง",
    "เล่น mini phrase 1-2-3-5 ได้โดยยังเป็นเสียงดนตรี ไม่ใช่แค่ดีดไล่"
  ],
  "troubleshooting": [
    {
      "problem": "ดีดเร็วกว่าปาก",
      "advice": "ลด BPM หรือหยุด Metronome ชั่วคราว แล้วพูดเลขก่อนดีดทุกครั้ง ให้ปากเป็นคนพามือ"
    },
    {
      "problem": "นิ้วก้อยบอดที่ fret 5",
      "advice": "คลายข้อมือซ้าย กดใกล้ fret มากขึ้น และลดแรงบีบ นิ้วก้อยไม่ต้องกดแรง แค่กดถูกจุด"
    },
    {
      "problem": "จำเลข degree สลับกับชื่อโน้ต",
      "advice": "วันนี้ให้พูดเลขก่อน ชื่อโน้ตค่อยตามทีหลัง เป้าหมายคือให้หูจำหน้าที่ของเสียง"
    }
  ],
  "passSummary": "พร้อมไป Week 8 เมื่อเล่น C Major 1 octave ได้สะอาด และปากพูดเลขของเสียงตรงกับนิ้วโดยไม่ต้องเดา"
}
```

## 10. Acceptance for Week 7 Mock Data

- Existing Week 5-6 renderer concept should handle the data with minimal changes.
- Fretboard Visualizer must show string 6 on top and string 1 on bottom.
- Mini-TAB must keep standard TAB order: string 1 on top and string 6 on bottom.
- Both Fretboard and Mini-TAB must include clear string text labels.
- Fretboard visual should not cause horizontal overflow at 320px.
- Mini-TAB must scroll inside its card, not expand the body width.
- Daily Practice must stay collapsible and not overwhelm mobile.
- Self-check must include singing/speaking degrees, not only theory questions.
- Learner-facing copy must feel like a calm Thai guitar teacher.

## 11. Guardrails

- Do not merge Week 7 into the main app yet.
- Do not add modes.
- Do not add full CAGED.
- Do not add 3-notes-per-string.
- Do not add speed drills.
- Do not teach full-neck scale mapping.
- Keep Week 7 limited to C Major 1 octave.
- Emphasize slow, clean, musical sound and singing the degrees 1-2-3-4-5-6-7-1.
- Do not add packages, build tools, network calls, audio files, or external media.
