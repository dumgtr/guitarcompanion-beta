# Month 4 Week 13 Draft: Pentatonic - The Skeleton and The Meat

สถานะ: documentation-only / mock-data planning
ห้ามแก้ไฟล์ `outputs/app.js`, `outputs/styles.css`, `outputs/index.html`, `outputs/data.json` หรือเปิด Month 4 ใน production UI จากเอกสารนี้

## 1. Week Metadata

| Field | Value |
| --- | --- |
| stable week id | `m4-w13-pentatonic-skeleton-meat` |
| absolute week number | `13` |
| month number | `4` |
| month week index | `1` |
| module label | `Scale Atlas Foundation` |
| lesson title | `Pentatonic: The Skeleton and The Meat` |
| Thai title | `Pentatonic: โครงกระดูกและเนื้อเสียง` |
| estimated minutes per day | `20` |
| daily structure | `15 นาที core alternate picking + 5 นาที color listening reflection` |
| play by ear thread position | `เล่น chord tones ได้ → เติม scale ได้` |
| core required shapes | `A Minor Pentatonic E-Shape`, `A Major Pentatonic E-Shape` |
| shared root | `A บนสาย 6 เฟรต 5` |
| optional preview / future concept | `A-Shape Major Pentatonic` |
| production status | `mock-data planning only; production UI remains untouched` |

## 2. Play By Ear Thread Position

**ตำแหน่งบนเส้นด้าย Play By Ear:** `เล่น chord tones ได้ → เติม scale ได้`

Month 3 สอนให้ผู้เรียนได้ยินและมองเห็น chord tones แล้ว: 1-3-5, arpeggio motion, 7th color และ target chord tones

Week 13 คือจุดเริ่มของ Month 4: Scale Atlas Foundation แต่เราจะไม่เริ่มด้วยการโยน scale box ให้จำทั้งก้อนครับ เราจะเริ่มจากสิ่งที่ผู้เรียนรู้อยู่แล้ว คือ chord tones แล้วค่อยเติมโน้ตอีก 2 ตัวให้เกิดสีของ melody

หลักคิด:

- Arpeggio / chord tones คือ **Skeleton**
- Pentatonic คือ Skeleton ที่เริ่มมี **Meat**
- Minor Pentatonic และ Major Pentatonic ต้องถูกฟังเป็นสีคนละแบบ ไม่ใช่กล่องนิ้วคนละกล่อง
- มือซ้ายอยู่พื้นที่เดียวกันก่อน: Root A บนสาย 6 เฟรต 5 เพื่อให้หูเปรียบเทียบสีได้โดยไม่ต้องย้ายภูมิศาสตร์บนคอ

## 3. Scope Lock

### 3.1 Core Allowed Scope

- สอน Pentatonic เป็น melodic flavor ที่ built around chord structures จาก Month 3
- เทียบเฉพาะ `A Minor Pentatonic E-Shape` กับ `A Major Pentatonic E-Shape`
- ใช้ Root เดียวกัน: A บนสาย 6 เฟรต 5
- ใช้พื้นที่มือเดียวกันบนคอกีตาร์ให้มากที่สุด เพื่อให้ผู้เรียนฟังความต่างของสี ไม่ใช่จำตำแหน่งใหม่
- Minor Pentatonic = `1 - b3 - 4 - 5 - b7`
- Major Pentatonic = `1 - 2 - 3 - 5 - 6`
- Skeleton ของ Minor = `1 - b3 - 5`
- Meat ของ Minor = `4 - b7`
- Skeleton ของ Major = `1 - 3 - 5`
- Meat ของ Major = `2 - 6`
- ใช้ slow alternate picking แบบ Down-Up ที่ 60 BPM เพื่อฟัง interval relationship กับ Root
- ใช้ Orientation Rule v2: String 1 / High e อยู่ด้านบน และ String 6 / Low E อยู่ด้านล่าง

### 3.2 Cognitive Load Reduction Rule

- `A-Shape Major Pentatonic` เป็น future optional concept เท่านั้น
- ห้ามใช้ A-Shape เป็น primary practice ใน Week 13
- ผู้เรียนต้องเทียบสี Major/Minor ใน E-Shape hand area ให้ชินหูก่อน
- เป้าหมายของสัปดาห์นี้คือ "สีเสียง" ไม่ใช่ "จำนวน shape ที่จำได้"

### 3.3 Strict Curriculum Guardrails

- ห้ามสอน Pentatonic ครบ 5 boxes
- ห้ามสอน speed picking
- ห้ามสอน shred mechanics
- ห้ามสอน sweep picking
- ห้ามสอน complex picking patterns
- ห้ามสอน Blues Scale เต็มรูปแบบในสัปดาห์นี้
- ห้ามสอน modes
- ห้ามใช้ staff notation
- ห้ามให้ผู้เรียนไล่ scale แบบ blind scrolling โดยไม่เห็น Root หรือ chord tones

## 4. Universal Renderer Block Structure

```json
{
  "week": 13,
  "number": 13,
  "month": 4,
  "module": "Scale Atlas Foundation",
  "title": "Pentatonic: The Skeleton and The Meat",
  "summary": "เติม Pentatonic รอบ chord tones ที่รู้จักแล้ว เพื่อให้ scale เป็นสีเสียง ไม่ใช่ speed box",
  "estimatedMinutesPerDay": 20,
  "playByEarThreadPosition": "เล่น chord tones ได้ → เติม scale ได้",
  "lessonBlocks": [
    { "type": "text", "id": "m4-w13-intro-skeleton-meat" },
    { "type": "ear-training-lab", "labRef": "m4-w13-ear-scale-color" },
    { "type": "fretboard", "visualRef": "m4-w13-overlay-minor-pent" },
    { "type": "fretboard", "visualRef": "m4-w13-overlay-major-pent" },
    { "type": "technique-drill", "drillRef": "m4-w13-alternate-picking-drill" },
    { "type": "daily-practice", "id": "m4-w13-daily-practice" },
    { "type": "self-check", "id": "m4-w13-self-check" }
  ]
}
```

## 5. Lesson Blocks Draft

### Block 1: `m4-w13-intro-skeleton-meat`

```json
{
  "type": "text",
  "id": "m4-w13-intro-skeleton-meat",
  "title": "Pentatonic ไม่ใช่กล่องนิ้ว มันคือคอร์ดที่เริ่มมีเนื้อ",
  "body": [
    "จำ Month 3 ได้ไหมครับ เราใช้ 1-3-5 เป็นโครงกระดูกของคอร์ด ถ้าไม่มีโครงนี้ เราจะไม่รู้ว่าเสียงกำลังยืนอยู่บ้านไหน",
    "Pentatonic คือการเอาโครงกระดูกนั้นมาเติมเนื้ออีก 2 โน้ต ทำให้มันเริ่มร้องเป็น melody ได้",
    "A Minor Pentatonic คือ A-C-E ที่เติม D และ G เข้าไป สีจะ tough, bluesy และดิบกว่า",
    "A Major Pentatonic คือ A-C#-E ที่เติม B และ F# เข้าไป สีจะ sweet, country และเปิดกว่า",
    "วันนี้เรายังไม่ย้ายไปหลายตำแหน่ง เราจะอยู่กับ Root A บนสาย 6 เฟรต 5 แล้วฟังว่าสี minor กับ major ต่างกันอย่างไร"
  ],
  "teacherVoice": "ใจเย็น ชัด และย้ำว่าหูต้องนำมือ",
  "listenFor": [
    "Minor Pentatonic ให้สี tough / bluesy",
    "Major Pentatonic ให้สี sweet / country",
    "Root A ต้องยังฟังเป็นบ้านของทั้งสองสี"
  ],
  "feel": [
    "มือซ้ายอยู่พื้นที่เดิมเพื่อไม่ให้สมองหลง shape",
    "มือขวาดีดช้าแบบ Down-Up เพื่อให้ฟังเสียงแต่ละตัวทัน",
    "หยุดพักบน Skeleton notes แล้วฟังว่ามันนิ่งกว่า Meat notes"
  ]
}
```

### Block 2: `m4-w13-ear-scale-color`

```json
{
  "type": "ear-training-lab",
  "labRef": "m4-w13-ear-scale-color"
}
```

Teacher copy:

ฟัง A Minor Pentatonic แล้วจำความรู้สึก tough / bluesy จากนั้นฟัง A Major Pentatonic แล้วจำความรู้สึก sweet / country เป้าหมายไม่ใช่ตอบถูกแบบข้อสอบ แต่คือฟังแล้วรู้ว่ามือควรเลือกสี minor หรือ major รอบ Root A เดียวกัน

### Block 3: `m4-w13-overlay-minor-pent`

```json
{
  "type": "fretboard",
  "visualRef": "m4-w13-overlay-minor-pent"
}
```

Teacher copy:

ภาพนี้คือ A Minor Pentatonic E-Shape รอบ Root A บนสาย 6 เฟรต 5 ให้สังเกตว่า A, C, E คือ Skeleton ส่วน D และ G คือ Meat ที่ทำให้เสียงเริ่มเป็น Pentatonic มากขึ้น

### Block 4: `m4-w13-overlay-major-pent`

```json
{
  "type": "fretboard",
  "visualRef": "m4-w13-overlay-major-pent"
}
```

Teacher copy:

ภาพนี้คือ A Major Pentatonic E-Shape โดยใช้ Root A บนสาย 6 เฟรต 5 เหมือนกับฝั่ง Minor เพื่อให้หูเทียบสีได้จากพื้นที่เดียวกัน A, C#, E คือ Skeleton ส่วน B และ F# คือ Meat ที่ทำให้เสียง Major Pentatonic เปิดและหวานขึ้น

**ครูย้ำ:** A-Shape Major Pentatonic จะเป็น optional compare ที่เราจะเรียนเจาะลึกในสัปดาห์ถัดไป วันนี้ให้เทียบสี Major/Minor บน E-Shape area ให้ชินหูก่อน

### Block 5: `m4-w13-alternate-picking-drill`

```json
{
  "type": "technique-drill",
  "drillRef": "m4-w13-alternate-picking-drill"
}
```

Teacher copy:

Alternate picking ในบทนี้เป็นเครื่องมือทำให้เสียงเท่ากัน ไม่ใช่เครื่องมือแข่งความเร็ว ให้ดีด Down-Up ช้าๆ ที่ 60 BPM แล้วฟังว่าโน้ตแต่ละตัวสัมพันธ์กับ Root A อย่างไร ถ้าเล่นเร็วแล้วฟังไม่ออกว่าโน้ตไหนคือ Skeleton หรือ Meat ให้ลด tempo ทันที

### Block 6: `m4-w13-daily-practice`

```json
{
  "type": "daily-practice",
  "id": "m4-w13-daily-practice"
}
```

### Block 7: `m4-w13-self-check`

```json
{
  "type": "self-check",
  "id": "m4-w13-self-check"
}
```

## 6. Root-Level Asset Drafts

### 6.1 `chordSoundLabs`

Storage note: `m4-w13-ear-scale-color` ต้อง route ไปที่ root-level `chordSoundLabs` array collection พร้อม `type: "ear-training-lab"` เพื่อ reuse Web Audio engine path เดิม

Implementation note: real data notes array must include explicit octave indices (เช่น `A2`, `C3`, `D3`) เพื่อให้ synthesizer เล่น register ถูกต้อง ไม่ใช่ flat note names เช่น `A`, `C`, `D`

```json
[
  {
    "id": "m4-w13-ear-scale-color",
    "type": "ear-training-lab",
    "title": "Minor vs Major Pentatonic Color",
    "prompt": "ฟังว่าสีของ Minor Pentatonic ต่างจาก Major Pentatonic อย่างไร โดย Root ยังเป็น A เหมือนเดิม",
    "tonalCenter": "A",
    "examples": [
      {
        "id": "m4-w13-ear-a-minor-pent",
        "label": "A Minor Pentatonic",
        "notes": ["A2", "C3", "D3", "E3", "G3"],
        "degreeFormula": ["1", "b3", "4", "5", "b7"],
        "colorWords": ["tough", "bluesy", "raw"],
        "skeleton": ["A2", "C3", "E3"],
        "meat": ["D3", "G3"],
        "teacherNote": "ฟังว่า C หรือ b3 ทำให้เสียงหม่นและดิบขึ้น"
      },
      {
        "id": "m4-w13-ear-a-major-pent",
        "label": "A Major Pentatonic",
        "notes": ["A2", "B2", "C#3", "E3", "F#3"],
        "degreeFormula": ["1", "2", "3", "5", "6"],
        "colorWords": ["sweet", "country", "open"],
        "skeleton": ["A2", "C#3", "E3"],
        "meat": ["B2", "F#3"],
        "teacherNote": "ฟังว่า C# หรือ 3 ทำให้เสียงสว่างและเปิดขึ้น"
      }
    ],
    "fallbackText": "ถ้า Web Audio ยังไม่พร้อม ให้เล่นโน้ต A-C-D-E-G แล้วเทียบกับ A-B-C#-E-F# บนกีตาร์จริงแบบช้าๆ โดยเริ่มจาก Root A จุดเดิม"
  }
]
```

### 6.2 `fretboardVisuals`

```json
[
  {
    "id": "m4-w13-overlay-minor-pent",
    "type": "chord-tone-overlay",
    "title": "A Minor Pentatonic E-Shape: Skeleton + Meat",
    "caption": "Root A อยู่สาย 6 เฟรต 5 ใช้ดูว่า 1-b3-5 คือ Skeleton และ 4-b7 คือ Meat",
    "config": { "startFret": 5, "endFret": 8, "showNut": false },
    "orientationNote": "Orientation Rule v2: สาย 1 / High e อยู่ด้านบน และสาย 6 / Low E อยู่ด้านล่าง",
    "formula": ["1", "b3", "4", "5", "b7"],
    "layoutNotes": [
      "Skeleton notes ต้องเด่นกว่า Meat notes",
      "Root ใช้สีหลัก",
      "b3 และ 5 ใช้สีรองหรือ shape คนละแบบ",
      "4 และ b7 ใช้ label Meat เพื่อให้ผู้เรียนเห็นว่าเป็นโน้ตที่เติมเข้าไป"
    ],
    "legend": [
      { "type": "skeleton-root", "label": "Skeleton: Root / 1" },
      { "type": "skeleton-third", "label": "Skeleton: b3" },
      { "type": "skeleton-fifth", "label": "Skeleton: 5" },
      { "type": "meat", "label": "Meat: 4 และ b7" }
    ],
    "dots": [
      { "string": 6, "fret": 5, "label": "A", "degree": "1", "role": "skeleton-root" },
      { "string": 6, "fret": 8, "label": "C", "degree": "b3", "role": "skeleton-third" },
      { "string": 5, "fret": 5, "label": "D", "degree": "4", "role": "meat" },
      { "string": 5, "fret": 7, "label": "E", "degree": "5", "role": "skeleton-fifth" },
      { "string": 4, "fret": 5, "label": "G", "degree": "b7", "role": "meat" },
      { "string": 4, "fret": 7, "label": "A", "degree": "1", "role": "skeleton-root" },
      { "string": 3, "fret": 5, "label": "C", "degree": "b3", "role": "skeleton-third" },
      { "string": 3, "fret": 7, "label": "D", "degree": "4", "role": "meat" },
      { "string": 2, "fret": 5, "label": "E", "degree": "5", "role": "skeleton-fifth" },
      { "string": 2, "fret": 8, "label": "G", "degree": "b7", "role": "meat" },
      { "string": 1, "fret": 5, "label": "A", "degree": "1", "role": "skeleton-root" },
      { "string": 1, "fret": 8, "label": "C", "degree": "b3", "role": "skeleton-third" }
    ]
  },
  {
    "id": "m4-w13-overlay-major-pent",
    "type": "chord-tone-overlay",
    "title": "A Major Pentatonic E-Shape: Skeleton + Meat",
    "caption": "ใช้ดูว่า 1-3-5 คือ Skeleton และ 2-6 คือ Meat บนพื้นที่ E-Shape เดียวกับ A Minor Pentatonic",
    "config": { "startFret": 4, "endFret": 7, "showNut": false },
    "orientationNote": "Orientation Rule v2: สาย 1 / High e อยู่ด้านบน และสาย 6 / Low E อยู่ด้านล่าง",
    "formula": ["1", "2", "3", "5", "6"],
    "layoutNotes": [
      "Root A ยังอยู่สาย 6 เฟรต 5 เพื่อเทียบสีจากพื้นที่เดียวกัน",
      "Skeleton notes คือ A, C#, E",
      "Meat notes คือ B และ F#",
      "A-Shape Major Pentatonic ไม่ใช่ primary focus ใน Week 13"
    ],
    "teacherNote": "A-Shape Major Pentatonic จะเป็น optional compare ที่เราจะเรียนเจาะลึกในสัปดาห์ถัดไป วันนี้ให้เทียบสี Major/Minor บน E-Shape area ให้ชินหูก่อน",
    "legend": [
      { "type": "skeleton-root", "label": "Skeleton: Root / 1" },
      { "type": "skeleton-third", "label": "Skeleton: 3" },
      { "type": "skeleton-fifth", "label": "Skeleton: 5" },
      { "type": "meat", "label": "Meat: 2 และ 6" }
    ],
    "dots": [
      { "string": 6, "fret": 5, "label": "A", "degree": "1", "role": "skeleton-root", "shapeHint": "E-Shape root / same root as minor map" },
      { "string": 6, "fret": 7, "label": "B", "degree": "2", "role": "meat" },
      { "string": 5, "fret": 4, "label": "C#", "degree": "3", "role": "skeleton-third" },
      { "string": 5, "fret": 7, "label": "E", "degree": "5", "role": "skeleton-fifth" },
      { "string": 4, "fret": 4, "label": "F#", "degree": "6", "role": "meat" },
      { "string": 4, "fret": 7, "label": "A", "degree": "1", "role": "skeleton-root" },
      { "string": 3, "fret": 4, "label": "B", "degree": "2", "role": "meat" },
      { "string": 3, "fret": 6, "label": "C#", "degree": "3", "role": "skeleton-third" },
      { "string": 2, "fret": 5, "label": "E", "degree": "5", "role": "skeleton-fifth" },
      { "string": 2, "fret": 7, "label": "F#", "degree": "6", "role": "meat" },
      { "string": 1, "fret": 5, "label": "A", "degree": "1", "role": "skeleton-root" },
      { "string": 1, "fret": 7, "label": "B", "degree": "2", "role": "meat" }
    ]
  }
]
```

### 6.3 `techniqueDrills`

Schema convention: lesson block `{ "type": "technique-drill", "drillRef": "m4-w13-alternate-picking-drill" }` อ้างอิง root-level JSON asset array ชื่อ `techniqueDrills` เหมือนที่ `visualRef`, `tabRef`, และ `labRef` อ้าง asset collection ของตัวเอง

```json
[
  {
    "id": "m4-w13-alternate-picking-drill",
    "type": "technique-drill",
    "title": "Slow Alternate Picking: Hear Every Degree",
    "skill": "alternate picking",
    "tempo": 60,
    "setup": [
      "เลือก A Minor Pentatonic E-Shape ก่อน",
      "ตั้ง Metronome 60 BPM",
      "พูด degree ในใจทุกครั้งที่ดีด เช่น 1, b3, 4, 5, b7"
    ],
    "pattern": {
      "rightHand": "D U D U",
      "rule": "สลับดีดลง-ขึ้นเสมอ แต่ห้ามเร่ง tempo เพื่อเอาชนะ pattern"
    },
    "steps": [
      "เล่นขึ้นช้าๆ จาก Root A",
      "หยุดบน Skeleton notes แล้วฟังว่ามันพักได้",
      "เล่น Meat notes แล้วฟังว่ามันพา melody เดินต่อ",
      "เล่นลงกลับมาหา Root A",
      "ทำซ้ำกับ A Major Pentatonic E-Shape โดยยังฟัง Root A เป็นบ้านเดิม",
      "ถ้าเสียงไม่ชัด ให้ลดเหลือ 50 BPM"
    ],
    "warningSigns": [
      "มือขวาเร่งจนเสียงไม่เท่ากัน",
      "เล่นจบ shape แต่จำไม่ได้ว่า Root อยู่ตรงไหน",
      "ฟังไม่ออกว่าโน้ตไหนคือ Skeleton และโน้ตไหนคือ Meat",
      "เล่นเหมือนท่อง pattern โดยไม่ฟังสี minor/major"
    ],
    "teacherNote": "Alternate picking คือเครื่องมือคุมเสียง ไม่ใช่สนามแข่งความเร็ว"
  }
]
```

## 7. Daily Practice: `m4-w13-daily-practice`

```json
{
  "id": "m4-w13-daily-practice",
  "type": "daily-practice",
  "title": "20 นาที: 15 นาทีช้าและชัด + 5 นาทีฟังสี",
  "totalDuration": "20 นาที",
  "coreDuration": "15 นาที",
  "reflectionDuration": "5 นาที",
  "groups": [
    {
      "dayLabel": "Day 1-2",
      "focus": "Minor Pentatonic: เห็น Skeleton ก่อนเติม Meat",
      "isOpen": true,
      "core": [
        {
          "id": "m4-w13-d1-core-1",
          "duration": "5 นาที",
          "title": "ชี้ Skeleton ใน A Minor Pentatonic",
          "instruction": "ดู `m4-w13-overlay-minor-pent` แล้วชี้ A, C, E ก่อนเล่น"
        },
        {
          "id": "m4-w13-d1-core-2",
          "duration": "5 นาที",
          "title": "Slow alternate picking",
          "instruction": "เล่น A Minor Pentatonic E-Shape ที่ 60 BPM ด้วย Down-Up ช้าๆ"
        },
        {
          "id": "m4-w13-d1-core-3",
          "duration": "5 นาที",
          "title": "Pause on Skeleton",
          "instruction": "เล่นผ่าน D/G ได้ แต่หยุดพักบน A/C/E แล้วฟังว่ามันนิ่งกว่า"
        }
      ],
      "reflection": {
        "duration": "5 นาที",
        "title": "Color listening",
        "instruction": "ฮัม Root A แล้วเล่น C หรือ b3 เพื่อจำความรู้สึก tough/bluesy"
      }
    },
    {
      "dayLabel": "Day 3-4",
      "focus": "Major Pentatonic: เทียบสีในพื้นที่เดิม",
      "isOpen": false,
      "core": [
        {
          "id": "m4-w13-d3-core-1",
          "duration": "5 นาที",
          "title": "ชี้ Skeleton ใน A Major Pentatonic",
          "instruction": "ดู `m4-w13-overlay-major-pent` แล้วชี้ A, C#, E ก่อนเล่น"
        },
        {
          "id": "m4-w13-d3-core-2",
          "duration": "5 นาที",
          "title": "Slow alternate picking",
          "instruction": "เล่น A Major Pentatonic E-Shape ที่ 60 BPM ด้วย Down-Up ช้าๆ"
        },
        {
          "id": "m4-w13-d3-core-3",
          "duration": "5 นาที",
          "title": "Pause on Skeleton",
          "instruction": "เล่นผ่าน B/F# ได้ แต่หยุดพักบน A/C#/E แล้วฟังว่าสี major เปิดขึ้น"
        }
      ],
      "reflection": {
        "duration": "5 นาที",
        "title": "Color listening",
        "instruction": "เทียบ C กับ C# รอบ Root A แล้วฟังว่าอะไรทำให้สีเปลี่ยนจาก bluesy เป็น sweet/country"
      }
    },
    {
      "dayLabel": "Day 5-7",
      "focus": "Minor vs Major: เลือกสีด้วยหู ไม่ใช่ท่อง shape",
      "isOpen": false,
      "core": [
        {
          "id": "m4-w13-d5-core-1",
          "duration": "5 นาที",
          "title": "Minor color pass",
          "instruction": "เล่น A Minor Pentatonic E-Shape ช้าๆ แล้วหยุดที่ A"
        },
        {
          "id": "m4-w13-d5-core-2",
          "duration": "5 นาที",
          "title": "Major color pass",
          "instruction": "เล่น A Major Pentatonic E-Shape ช้าๆ แล้วหยุดที่ A"
        },
        {
          "id": "m4-w13-d5-core-3",
          "duration": "5 นาที",
          "title": "Skeleton + Meat phrase",
          "instruction": "สร้าง phrase สั้นๆ จาก Skeleton 2 ตัว และ Meat 1 ตัว ห้ามเล่นไหลทั้งกล่อง"
        }
      ],
      "reflection": {
        "duration": "5 นาที",
        "title": "Record and compare",
        "instruction": "อัดเสียง minor 1 รอบ major 1 รอบ แล้วฟังว่าสีเปลี่ยนเพราะ b3/3 และ Meat notes อย่างไร"
      }
    }
  ]
}
```

## 8. Self-Check: `m4-w13-self-check`

```json
{
  "id": "m4-w13-self-check",
  "type": "self-check",
  "title": "เช็กว่าเติม Scale โดยยังเห็น Chord Tones อยู่ไหม",
  "questions": [
    {
      "id": "m4-w13-q1-skeleton-inside-scale",
      "type": "reflection",
      "prompt": "ก่อนเล่น A Minor หรือ A Major Pentatonic คุณชี้ Skeleton notes ของ shape นั้นได้ไหม โดยเฉพาะ Root A บนสาย 6 เฟรต 5?",
      "expectedReflection": "ผู้เรียนควรชี้ A-C-E สำหรับ minor และ A-C#-E สำหรับ major ได้ก่อนเล่นทั้ง shape"
    },
    {
      "id": "m4-w13-q2-color-shift",
      "type": "reflection",
      "prompt": "เมื่อเทียบ A Minor Pentatonic กับ A Major Pentatonic ในพื้นที่ E-Shape เดียวกัน คุณฟังออกไหมว่า b3 กับ 3 ทำให้สีอารมณ์เปลี่ยนอย่างไร?",
      "expectedReflection": "ผู้เรียนควรอธิบายได้ว่า C หรือ b3 ทำให้สี tough/bluesy ส่วน C# หรือ 3 ทำให้สี sweet/country/open"
    }
  ],
  "passCriteria": [
    "เห็น Root A บนสาย 6 เฟรต 5 ก่อนเล่นทุกครั้ง",
    "แยก Skeleton notes กับ Meat notes ใน minor และ major ได้",
    "ฟังสี minor pentatonic กับ major pentatonic ต่างกันได้",
    "เล่น alternate picking ช้าๆ ที่ 60 BPM ได้โดยไม่รีบ",
    "ไม่ไล่ scale โดยไม่รู้ว่า chord tones อยู่ตรงไหน"
  ]
}
```

## 9. Renderer Dependency Analysis

- ต้องใช้ `chord-tone-overlay` renderer ที่รองรับ role แยก Skeleton / Meat
- ต้องใช้ Orientation Rule v2: String 1 / High e ด้านบน และ String 6 / Low E ด้านล่าง
- `m4-w13-ear-scale-color` ต้อง route ไปที่ `chordSoundLabs` ด้วย `type: "ear-training-lab"`
- Real data notes array สำหรับ Web Audio ต้องใช้ scientific pitch notation พร้อม octave profile เช่น `["A2", "C3", "D3"]` ไม่ใช่ flat note names เช่น `["A", "C", "D"]`
- `technique-drill` ใช้ convention แบบ root-level asset reference: `{ "type": "technique-drill", "drillRef": "m4-w13-alternate-picking-drill" }` อ้าง `techniqueDrills[]`
- ต้องรองรับ `daily-practice` แบบ 15-minute core + 5-minute reflection
- ต้องรองรับ `self-check` แบบ reflection questions
- ไม่ต้องใช้ miniTabs ใน Week 13 รอบแรก
- ไม่ต้องใช้ staff notation
- ห้ามเพิ่ม Month 4 เข้า production UI จากเอกสารนี้

## 10. Guardrails

- ห้ามสอนครบ 5 Pentatonic boxes
- ห้ามสอน speed picking, shred mechanics, sweep picking หรือ complex patterns
- ห้ามเปลี่ยน alternate picking เป็น speed course
- ห้ามสอน Blues Scale เต็มรูปแบบใน Week 13
- ห้ามสอน modes
- ห้ามเล่น scale โดยไม่อ้าง Root หรือ chord tones
- ห้ามใช้ A-Shape Major Pentatonic เป็น primary practice
- ต้องเน้นเสียงสะอาด ช้า และฟังความสัมพันธ์กับ Root
- ต้องระบุ Play By Ear thread position: `เล่น chord tones ได้ → เติม scale ได้`
- Production UI remains untouched

## 11. Revision Summary

1. Canonical `m4-w13-...` IDs applied across all lesson blocks and root-level assets.
2. Week 13 finalized as `Pentatonic: The Skeleton and The Meat`.
3. Strict scope lock enforced: only `A Minor Pentatonic E-Shape` and `A Major Pentatonic E-Shape` are core required shapes.
4. `A-Shape Major Pentatonic` moved to future optional concept only.
5. Play By Ear thread integrated: `เล่น chord tones ได้ → เติม scale ได้`.
6. Minor Pentatonic framed as `1-b3-5` Skeleton plus `4-b7` Meat.
7. Major Pentatonic framed as `1-3-5` Skeleton plus `2-6` Meat.
8. `m4-w13-ear-scale-color` routed to `chordSoundLabs` with `type: "ear-training-lab"`.
9. Web Audio octave-profile requirement documented: notes must use scientific pitch notation such as `A2`, `C3`, `D3`.
10. `technique-drill` root array convention established through `drillRef` -> `techniqueDrills[]`.
11. Block types standardized to kebab-case.
12. Daily practice standardized as 20 minutes: 15-minute slow alternate picking chord tone integration + 5-minute color listening reflection.
13. Self-check reduced to 2 reflective validation questions.
14. Guardrails enforced against all 5 boxes, speed picking, shred mechanics, complex patterns, blind scrolling, modes, and staff notation.
15. Production UI remains untouched and this is mock-data planning only.
