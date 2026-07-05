# Month 2 Week 6: Mock Data Plan (All String Mapping / Octave Shapes)

เอกสารนี้เป็นแผนเตรียม mock data สำหรับ Week 6 เท่านั้น ยังไม่ใช่ implementation และยังไม่ต้องแก้ `outputs/` หรือ `prototypes/`

## 1. Goal

สร้างชุดข้อมูล Week 6 ที่ต่อยอดจาก Week 5 โดยทดสอบว่า renderer เดิมสามารถรองรับบทเรียนที่มี Octave Shape หลายตำแหน่ง, Mini-TAB สั้น ๆ, Daily Practice แบบ accordion และ Self-check แบบทั้งความเข้าใจและการเล่นจริงได้หรือไม่

## 2. Target File for Future Prototype

เมื่อเริ่มทำ prototype จริง ควรสร้างข้อมูลในลักษณะเดียวกับ:

```text
prototypes/month2-week6/mock-data.js
```

หรือถ้าจะทำเป็น JSON กลางภายหลัง ให้ใช้ shape เดียวกับ `docs/MONTH2_WEEK5_MOCK_DATA.json`

## 3. Top-level Data Shape

ใช้ object หลักชื่อชั่วคราว:

```javascript
const WEEK6_MOCK_DATA = {
  weekMeta: {},
  lessonBlocks: [],
  fretboardVisuals: [],
  miniTabs: [],
  dailyPractice: [],
  selfCheck: {}
};
```

## 4. `weekMeta`

ควรมีข้อมูลขั้นต่ำ:

```json
{
  "week": 6,
  "month": 2,
  "title": "All String Mapping / Octave Shapes",
  "module": "fretboard",
  "theme": "Fretboard Foundation",
  "estimatedMinutesPerDay": 20,
  "subtitle": "ขยาย Root จากสาย 6 และ 5 ไปยังสายล่างด้วย Octave Shape",
  "promise": "หาโน้ตชื่อเดียวกันบนคอกีตาร์ได้เร็วขึ้น โดยไม่ต้องท่องจำทั้งคอ"
}
```

## 5. Lesson Blocks Plan

ควรมี 5-6 blocks เพื่อให้ flow ยังไม่หนักเกินไป:

1. Text block: เปิดบทเรียน อธิบายว่า Week 6 ไม่ใช่การจำโน้ตทั้งคอ แต่เป็นการใช้ Shape
2. Fretboard block: Octave จากสาย 6 ไปสาย 4 ด้วย G และ A
3. Text block: อธิบายความรู้สึกของ Shape และการล็อกมือซ้าย
4. Fretboard block: Octave จากสาย 5 ไปสาย 3 ด้วย C และ D
5. Mini-TAB block: Root -> Octave call & response
6. Text block หรือ teacher note: วิธีฟังว่า Octave ถูกหรือผิด

ตัวอย่าง skeleton:

```json
[
  {
    "id": "w6-block-1-opening",
    "type": "text",
    "title": "ใช้ Shape แทนการท่องจำทั้งคอ",
    "body": "สัปดาห์นี้เราจะเริ่มย้าย Root ที่รู้จักแล้วไปยังตำแหน่งเสียงสูงขึ้นด้วย Octave Shape...",
    "teacherNote": "ถ้ามือยังไม่จำระยะ ไม่ต้องรีบ ให้เล่นช้าและฟังว่าชื่อโน้ตเดียวกันจริงไหม"
  },
  {
    "id": "w6-block-2-s6-to-s4",
    "type": "fretboard",
    "title": "Octave Shape: สาย 6 ไปสาย 4",
    "visualRef": "w6-octave-s6-to-s4",
    "instruction": "เริ่มจาก Root บนสาย 6 แล้วข้ามไปหา Octave บนสาย 4"
  },
  {
    "id": "w6-block-5-call-response-tab",
    "type": "tab",
    "title": "Root to Octave Call & Response",
    "tabRef": "w6-tab-root-octave-call-response",
    "instruction": "ดีด Root หนึ่งครั้ง แล้วตอบด้วย Octave หนึ่งครั้งให้ตรง Metronome"
  }
]
```

## 6. Fretboard Visuals Plan

ควรมี visual อย่างน้อย 3 ชุด:

- `w6-octave-s6-to-s4`: G และ A จากสาย 6 ไปสาย 4
- `w6-octave-s5-to-s3`: C และ D จากสาย 5 ไปสาย 3
- `w6-octave-mixed-map`: รวม A, C, D, G เพื่อใช้ใน self-test

ตัวอย่าง:

```json
{
  "id": "w6-octave-s6-to-s4",
  "type": "fretboard",
  "title": "Octave Shape จากสาย 6 ไปสาย 4",
  "caption": "เริ่มจาก Root บนสาย 6 แล้วข้าม 1 สาย ขยับไปอีก 2 fret เพื่อหา Octave บนสาย 4",
  "config": {
    "startFret": 1,
    "endFret": 8,
    "showNut": true
  },
  "legend": [
    { "type": "root", "color": "orange", "label": "Root" },
    { "type": "octave", "color": "gold", "label": "Octave" }
  ],
  "dots": [
    { "string": 6, "fret": 3, "label": "G", "type": "root" },
    { "string": 4, "fret": 5, "label": "G", "type": "octave" },
    { "string": 6, "fret": 5, "label": "A", "type": "root" },
    { "string": 4, "fret": 7, "label": "A", "type": "octave" }
  ]
}
```

## 7. Orientation Decision to Validate

Week 5 freeze ใช้ orientation note เพื่ออธิบายความต่างระหว่าง Fretboard map กับ TAB มาตรฐานแล้ว

สำหรับ Week 6 ต้องตัดสินใจก่อนทำ prototype จริงว่า:

- จะคง visual direction แบบ Week 5 เพื่อไม่ให้ renderer เปลี่ยนพฤติกรรมกะทันหัน
- หรือจะทดลองให้ Fretboard Visualizer อิงตาม TAB เป็นหลักตาม guardrail ใน content plan

ถ้าจะเปลี่ยน orientation ต้องทำเป็น prototype decision ชัดเจน และต้องทดสอบ mobile/desktop ใหม่ทั้งหมด

## 8. Mini-TAB Plan

ควรมี Mini-TAB 1-2 ชุดเท่านั้น:

- `w6-tab-root-octave-call-response`: Root -> Octave แบบ quarter notes
- optional `w6-tab-syncopated-octave-jump`: กลิ่น Blues เบา ๆ ด้วย Syncopated jump

ใช้ `ascii` เป็น `string[]` และใช้ `lyrics` เป็น pre-spaced monospace string เพื่อรักษาการจัดตำแหน่ง:

```json
{
  "id": "w6-tab-root-octave-call-response",
  "type": "tab",
  "title": "Root -> Octave Call & Response",
  "bpm": 60,
  "ascii": [
    "e|-----------------|-----------------|",
    "B|-----------------|-----------------|",
    "G|-----------------|-----------------|",
    "D|-----5-------7---|-----5-------7---|",
    "A|-----------------|-----------------|",
    "E|-3-------5-------|-3-------5-------|"
  ],
  "lyrics": "  G   G   A   A     G   G   A   A",
  "note": "ดีด Root แล้วตอบด้วย Octave ให้เสียงทั้งคู่จมลงกับ click ของ Metronome"
}
```

## 9. Daily Practice Plan

ใช้ accordion แบบ grouped 7-day schedule เหมือน Week 5:

```javascript
dailyPractice: [
  {
    dayLabel: "Day 1-2",
    focus: "Octave จากสาย 6 ไปสาย 4",
    isOpen: true,
    exercises: []
  },
  {
    dayLabel: "Day 3-4",
    focus: "Octave จากสาย 5 ไปสาย 3",
    isOpen: false,
    exercises: []
  },
  {
    dayLabel: "Day 5",
    focus: "Mix A, C, D, G",
    isOpen: false,
    exercises: []
  },
  {
    dayLabel: "Day 6-7",
    focus: "Self-test & Mini Musical Application",
    isOpen: false,
    exercises: []
  }
]
```

แต่ละ exercise ต้องมี:

- `id`
- `duration`
- `title`
- `instruction`

## 10. Self-check Plan

ควรมีทั้ง multiple choice, practical check และ reflection:

```json
{
  "type": "self-check",
  "id": "w6-self-check",
  "week": 6,
  "title": "เช็กว่า Octave Shape เริ่มล็อกมือหรือยัง",
  "questions": [
    {
      "id": "w6-q1",
      "type": "multiple-choice",
      "prompt": "Octave หมายถึงอะไร",
      "choices": [
        { "id": "a", "text": "โน้ตชื่อเดียวกัน แต่สูงหรือต่ำคนละชั้นเสียง" },
        { "id": "b", "text": "คอร์ดชนิดหนึ่งที่ต้องเล่นเร็ว" },
        { "id": "c", "text": "รูปแบบการตีคอร์ดแบบ Syncopation" }
      ],
      "answer": "a"
    },
    {
      "id": "w6-q2",
      "type": "practical-check",
      "prompt": "เล่น G บนสาย 6 แล้วกระโดดไป G Octave บนสาย 4 ได้หรือไม่",
      "passCondition": "เล่นได้ 8 รอบติดกันที่ 60 BPM โดยนิ้วไม่บอด"
    }
  ],
  "passCriteria": [
    "จับรูปทรง Octave สาย 6 ไป 4 ได้โดยนิ้วไม่บอด",
    "จับรูปทรง Octave สาย 5 ไป 3 ได้โดยนิ้วไม่บอด",
    "ฟังออกว่า Root และ Octave เป็นชื่อโน้ตเดียวกัน"
  ],
  "troubleshooting": [
    {
      "problem": "นิ้วก้อยไม่มีแรงหรือเสียงบอด",
      "advice": "ลดความเร็วลง ใช้นิ้วนางแทนนิ้วก้อยชั่วคราวได้ แล้วค่อยกลับมาฝึกนิ้วก้อยทีละนิด"
    }
  ],
  "passSummary": "พร้อมไป Week 7 เมื่อมือซ้ายล็อก Octave Shape ได้ และหูเริ่มจำเสียงคู่แปดได้จริง"
}
```

## 11. Acceptance for Week 6 Mock Data

- Existing Week 5 renderer concept should still handle the data with minimal changes.
- Fretboard visual should not cause horizontal overflow at 320px.
- Mini-TAB must scroll inside its card, not expand the body width.
- Daily Practice must stay collapsible and not overwhelm mobile.
- Self-check must include practical playing criteria, not only theory questions.
- Keep learner-facing copy in natural Thai, like a patient private guitar teacher.

## 12. Guardrails

- Do not merge Week 6 into the main app yet.
- Do not add CAGED full system.
- Do not add Nashville Number System.
- Do not teach full Major Scale yet.
- Do not add packages, build tools, network calls, audio files, or external media.
- Keep Month 2 Week 6 as planning/prototype work until explicitly approved for integration.
