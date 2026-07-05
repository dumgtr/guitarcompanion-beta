# Month 4 Week 14 Draft: The Blues Note & Phrasing

สถานะ: documentation-only / mock-data planning
ห้ามแก้ไฟล์ `outputs/app.js`, `outputs/styles.css`, `outputs/index.html`, `outputs/data.json` หรือเปิด Month 4 ใน production UI จากเอกสารนี้

## 1. Week Metadata

| Field | Value |
| --- | --- |
| stable week id | `m4-w14-blues-note-phrasing` |
| absolute week number | `14` |
| month number | `4` |
| month week index | `2` |
| module label | `Scale Atlas Foundation` |
| lesson title | `The Blues Note & Phrasing` |
| Thai title | `Blues Note และการเว้นลมหายใจใน Phrase` |
| estimated minutes per day | `20` |
| daily structure | `15 นาที phrasing/breathing drill + 5 นาที b5 tension listening` |
| play by ear thread position | `เติม scale ได้ → phrasing ได้ → improvise ตามเพลงได้` |
| core required shape | `A Minor Pentatonic E-Shape + b5` |
| shared root | `A บนสาย 6 เฟรต 5` |
| production status | `mock-data planning only; production UI remains untouched` |

## 2. Play By Ear Thread Position

**ตำแหน่งบนเส้นด้าย Play By Ear:** `เติม scale ได้ → phrasing ได้ → improvise ตามเพลงได้`

Week 13 สอนให้ผู้เรียนเห็นว่า Pentatonic ไม่ใช่กล่องนิ้วเปล่าๆ แต่เป็น chord tones ที่เติมโน้ตเพิ่มจนเกิดสีของ melody แล้ว

Week 14 จะพาไปอีกขั้นเล็กๆ: เพิ่มโน้ต b5 หรือ Blues Note เข้าไปใน A Minor Pentatonic E-Shape เดิม และเริ่มฝึกพูดเป็นประโยคสั้นๆ แทนการไล่สเกลยาวๆ

หลักคิด:

- Blues Note ไม่ใช่โน้ตที่เล่นค้างนานๆ แล้วจบ
- Blues Note คือ tension note ที่ควรผ่านไปหาโน้ตที่มั่นคงกว่า เช่น 4, b3 หรือ 5
- Phrasing คือการเล่นเหมือนพูด: พูดสั้นๆ หายใจ แล้วค่อยตอบ
- Rest หรือความเงียบ เป็นส่วนหนึ่งของประโยคดนตรี ไม่ใช่ความว่างเปล่า

## 3. Scope Lock

### 3.1 Core Allowed Scope

- ใช้พื้นที่เดียวกับ Week 13: `A Minor Pentatonic E-Shape`
- Root หลักคือ A บนสาย 6 เฟรต 5
- เพิ่มเฉพาะ b5 / Blues Note เข้าไปใน shape เดิม
- Blues Scale ในสัปดาห์นี้ = A Minor Pentatonic + b5 เท่านั้น
- บังคับให้ผู้เรียนฟัง b5 เป็น passing tension
- ฝึก resolve b5 ไปหา 4, b3 หรือ 5
- ฝึก phrase สั้นๆ 3-4 โน้ต แล้วหยุดพัก 1 beat เต็ม
- ใช้ Metronome หรือ Backing Track ช้าๆ เพื่อฟังช่องว่างระหว่าง phrase
- ใช้ Orientation Rule v2: String 1 / High e อยู่ด้านบน และ String 6 / Low E อยู่ด้านล่าง

### 3.2 Same Geography Rule

สัปดาห์นี้ห้ามย้ายพื้นที่มือซ้ายไป box ใหม่ครับ เราจะอยู่ในโซนเฟรต 5-8 รอบ Root A เท่านั้น เหตุผลคือผู้เรียนต้องได้ยินว่า "โน้ตเดียวที่เพิ่มเข้ามา" เปลี่ยนสีของ phrase อย่างไร ถ้าเราเปิด Box 2, 3, 4, 5 พร้อมกัน สมองจะกลับไปจำตำแหน่งนิ้วแทนการฟัง tension-resolution

### 3.3 Strict Curriculum Guardrails

- ห้ามสอน Pentatonic ครบ 5 boxes
- ห้ามเปิด Box 2, 3, 4 หรือ 5
- ห้ามสอน speed scale sequences
- ห้ามสอน shred mechanics
- ห้ามสอน sweep picking
- ห้ามทำให้ Blues Scale เป็นกล่องใหญ่แยกต่างหากที่ต้องท่องจำ
- ห้ามเพิ่ม modes หรือ scale อื่นในสัปดาห์นี้
- ห้ามใช้ staff notation
- ห้ามให้ผู้เรียนไล่สเกลขึ้นลงโดยไม่หยุดพัก

## 4. Universal Renderer Block Structure

```json
{
  "week": 14,
  "number": 14,
  "month": 4,
  "module": "Scale Atlas Foundation",
  "title": "The Blues Note & Phrasing",
  "summary": "เพิ่ม b5 เป็น tension note ใน A Minor Pentatonic E-Shape เดิม แล้วฝึกพูดเป็น phrase สั้นๆ พร้อมเว้นช่องว่าง",
  "estimatedMinutesPerDay": 20,
  "playByEarThreadPosition": "เติม scale ได้ → phrasing ได้ → improvise ตามเพลงได้",
  "lessonBlocks": [
    { "type": "text", "id": "m4-w14-intro-blues-phrasing" },
    { "type": "ear-training-lab", "labRef": "m4-w14-ear-blues-tension" },
    { "type": "fretboard", "visualRef": "m4-w14-overlay-blues-scale" },
    { "type": "technique-drill", "drillRef": "m4-w14-phrasing-drill" },
    { "type": "daily-practice", "id": "m4-w14-daily-practice" },
    { "type": "self-check", "id": "m4-w14-self-check" }
  ]
}
```

## 5. Lesson Blocks Draft

### Block 1: `m4-w14-intro-blues-phrasing`

```json
{
  "type": "text",
  "id": "m4-w14-intro-blues-phrasing",
  "title": "Blues Note ไม่ใช่โน้ตวิเศษ แต่มันคือเครื่องเทศ",
  "body": [
    "สัปดาห์ที่แล้วเราเติม Pentatonic รอบ chord tones กันแล้ว วันนี้เราจะเติมโน้ตอีกแค่ 1 ตัวครับ โน้ตตัวนี้คือ b5 หรือที่นักกีตาร์ชอบเรียกว่า Blues Note",
    "ขอให้จำภาพนี้ไว้ก่อน: b5 เหมือนเครื่องเทศเผ็ดๆ ใส่นิดเดียวเพลงมีรสทันที แต่ถ้าใส่ค้างไว้ทั้งช้อน เพลงจะเริ่มขมและไม่รู้จะไปทางไหน",
    "หน้าที่ของ b5 คือสร้างความตึง แล้วพาเรา resolve ไปหาโน้ตที่มั่นคงกว่า เช่น 4, b3 หรือ 5",
    "อีกเรื่องที่สำคัญพอๆ กันคือการหายใจ ถ้าเราเล่นสเกลไม่หยุดเลย มันเหมือนพูดประโยคยาวๆ แบบไม่เว้นวรรค คนฟังจะเหนื่อย สัปดาห์นี้เราจะฝึกเล่น 3-4 โน้ต แล้วหยุดพักให้เพลงหายใจ"
  ],
  "listenFor": [
    "เสียง b5 จะมีความแหลม ขัด และตึงกว่าปกติ",
    "เมื่อ b5 คลี่ไปหา 4 หรือ 5 หูจะรู้สึกโล่งขึ้น",
    "ความเงียบหลัง phrase ทำให้โน้ตก่อนหน้ามีน้ำหนักขึ้น"
  ],
  "feel": [
    "มือซ้ายยังอยู่พื้นที่เดิมรอบเฟรต 5-8",
    "มือขวาต้องกล้าหยุด ไม่ดีดต่อเพราะความเคยชิน",
    "ร่างกายควรรู้สึกเหมือนร้องประโยคสั้นๆ แล้วหายใจ"
  ]
}
```

### Block 2: `m4-w14-ear-blues-tension`

```json
{
  "type": "ear-training-lab",
  "labRef": "m4-w14-ear-blues-tension"
}
```

Teacher copy:

ให้ฟัง b5 แบบไม่ต้องรีบตอบชื่อโน้ตก่อนครับ ฟังแค่ว่าเสียงมัน "ตึง" กว่าโน้ตอื่นอย่างไร แล้วฟังตอนมันคลี่กลับไปหา 4 หรือ 5 ว่าร่างกายรู้สึกโล่งขึ้นไหม นี่คือหัวใจของ Blues Note: มันเกิดมาเพื่อผ่าน ไม่ใช่เกิดมาเพื่อจอดนาน

### Block 3: `m4-w14-overlay-blues-scale`

```json
{
  "type": "fretboard",
  "visualRef": "m4-w14-overlay-blues-scale"
}
```

Teacher copy:

ภาพนี้ยังเป็นพื้นที่เดิมจาก Week 13: A Minor Pentatonic E-Shape รอบ Root A สาย 6 เฟรต 5 แต่เราเพิ่ม b5 เข้าไปเป็นสี tension แยกชัดๆ ให้สังเกตว่า Skeleton ยังเป็น A, C, E เหมือนเดิม Meat ยังเป็น D และ G เหมือนเดิม ส่วน b5 คือ Eb ที่เข้ามาทำให้ phrase มีรส blues มากขึ้น

### Block 4: `m4-w14-phrasing-drill`

```json
{
  "type": "technique-drill",
  "drillRef": "m4-w14-phrasing-drill"
}
```

Teacher copy:

แบบฝึกนี้ไม่ใช่การเล่นให้เร็วครับ เป้าหมายคือ "กล้าหยุด" ให้เล่น 3-4 โน้ต แล้วหยุดพัก 1 beat เต็มเหมือนนักร้องหายใจ ถ้ารู้สึกว่านิ้วอยากวิ่งต่อ ให้ถือว่านั่นคือจุดที่ต้องฝึกพอดี

### Block 5: `m4-w14-daily-practice`

```json
{
  "type": "daily-practice",
  "id": "m4-w14-daily-practice"
}
```

### Block 6: `m4-w14-self-check`

```json
{
  "type": "self-check",
  "id": "m4-w14-self-check"
}
```

## 6. Root-Level Asset Drafts

### 6.1 `chordSoundLabs`

Storage note: `m4-w14-ear-blues-tension` ต้อง route ไปที่ root-level `chordSoundLabs` array collection พร้อม `type: "ear-training-lab"` เพื่อ reuse Web Audio engine path เดิม

Implementation note: real data notes array ต้องใช้ explicit octave profiles เช่น `Eb3`, `D3`, `C3` เพื่อให้ synthesizer เล่น register ถูกต้อง ไม่ใช้ flat note names แบบ `Eb`, `D`, `C` เฉยๆ

```json
[
  {
    "id": "m4-w14-ear-blues-tension",
    "type": "ear-training-lab",
    "title": "Blues Note Tension & Release",
    "prompt": "ฟังว่า b5 ตึงอย่างไร และเมื่อ resolve ไปหา 4, b3 หรือ 5 แล้วหูรู้สึกคลี่คลายอย่างไร",
    "tonalCenter": "A",
    "examples": [
      {
        "id": "m4-w14-ear-b5-to-4-to-b3",
        "label": "b5 → 4 → b3",
        "notes": ["Eb3", "D3", "C3"],
        "degreePath": ["b5", "4", "b3"],
        "answer": "tension-resolves-down",
        "teacherNote": "Eb ตึงมาก พอถอยลง D แล้วกลับ C จะรู้สึกเหมือนประโยคเริ่มลงจอด"
      },
      {
        "id": "m4-w14-ear-b5-to-5",
        "label": "b5 → 5",
        "notes": ["Eb3", "E3", "A2"],
        "degreePath": ["b5", "5", "1"],
        "answer": "tension-resolves-up",
        "teacherNote": "Eb ดันขึ้นไป E แล้วกลับ A จะให้ความรู้สึกคลี่แบบชัดและมั่นคงกว่า"
      },
      {
        "id": "m4-w14-ear-clean-pent-vs-blues",
        "label": "Minor Pentatonic vs Blues Note",
        "notesA": ["A2", "C3", "D3", "E3", "G3"],
        "notesB": ["A2", "C3", "D3", "Eb3", "E3", "G3"],
        "answer": "blues-note-added",
        "teacherNote": "ชุด B มี Eb เพิ่มเข้ามา ให้ฟังว่ามันทำให้ scale มีรอยขัดแบบ blues ขึ้นทันที"
      }
    ],
    "fallbackText": "ถ้า audio เล่นไม่ได้ ให้ผู้เรียนดีด D-Eb-E หรือ Eb-D-C บนกีตาร์จริงช้าๆ แล้วฟังแรงตึงกับแรงคลี่ด้วยหู"
  }
]
```

### 6.2 `fretboardVisuals`

```json
[
  {
    "id": "m4-w14-overlay-blues-scale",
    "type": "chord-tone-overlay",
    "title": "A Blues Scale E-Shape: The Tension Note",
    "caption": "A Blues Scale ในสัปดาห์นี้คือ A Minor Pentatonic E-Shape เดิมที่เพิ่ม b5 เข้าไปเป็น passing tension note",
    "orientation": "tab-style-v2",
    "orientationNote": "แผนที่คอกีตาร์นี้ใช้มุมมองเดียวกับ TAB: สาย 1 / High e อยู่ด้านบน และสาย 6 / Low E อยู่ด้านล่าง",
    "config": {
      "startFret": 5,
      "endFret": 8,
      "showNut": false,
      "stringLabels": {
        "top": "สาย 1 / High e",
        "bottom": "สาย 6 / Low E"
      }
    },
    "formula": ["1", "b3", "4", "b5", "5", "b7"],
    "layoutNotes": [
      "อยู่ในพื้นที่เดียวกับ Week 13: A Minor Pentatonic E-Shape",
      "Skeleton = 1-b3-5",
      "Meat = 4-b7",
      "Tension / warning note = b5",
      "b5 ต้อง resolve ไปหา 4, b3 หรือ 5 ห้ามสอนให้ค้างเป็นจุดจบหลัก"
    ],
    "legend": [
      { "type": "skeleton-root", "label": "1 / Root (Skeleton)", "color": "primary" },
      { "type": "skeleton-third", "label": "b3 (Skeleton)", "color": "secondary" },
      { "type": "skeleton-fifth", "label": "5 (Skeleton)", "color": "tertiary" },
      { "type": "meat", "label": "4 / b7 (Meat)", "color": "muted-accent" },
      { "type": "tension", "label": "b5 / Blues Note (Tension)", "color": "warning" }
    ],
    "dots": [
      { "string": 6, "fret": 5, "label": "A", "degree": "1", "toneRole": "skeleton", "type": "skeleton-root" },
      { "string": 6, "fret": 8, "label": "C", "degree": "b3", "toneRole": "skeleton", "type": "skeleton-third" },
      { "string": 5, "fret": 5, "label": "D", "degree": "4", "toneRole": "meat", "type": "meat" },
      { "string": 5, "fret": 6, "label": "Eb", "degree": "b5", "toneRole": "tension", "type": "tension" },
      { "string": 5, "fret": 7, "label": "E", "degree": "5", "toneRole": "skeleton", "type": "skeleton-fifth" },
      { "string": 4, "fret": 5, "label": "G", "degree": "b7", "toneRole": "meat", "type": "meat" },
      { "string": 4, "fret": 7, "label": "A", "degree": "1", "toneRole": "skeleton", "type": "skeleton-root" },
      { "string": 3, "fret": 5, "label": "C", "degree": "b3", "toneRole": "skeleton", "type": "skeleton-third" },
      { "string": 3, "fret": 7, "label": "D", "degree": "4", "toneRole": "meat", "type": "meat" },
      { "string": 3, "fret": 8, "label": "Eb", "degree": "b5", "toneRole": "tension", "type": "tension" },
      { "string": 2, "fret": 5, "label": "E", "degree": "5", "toneRole": "skeleton", "type": "skeleton-fifth" },
      { "string": 2, "fret": 8, "label": "G", "degree": "b7", "toneRole": "meat", "type": "meat" },
      { "string": 1, "fret": 5, "label": "A", "degree": "1", "toneRole": "skeleton", "type": "skeleton-root" },
      { "string": 1, "fret": 8, "label": "C", "degree": "b3", "toneRole": "skeleton", "type": "skeleton-third" }
    ],
    "teacherNote": "b5 คือโน้ตเผ็ด ให้แตะแล้วรีบคลี่ ไม่ใช่โน้ตสำหรับจอดยาว"
  }
]
```

### 6.3 `techniqueDrills`

Schema convention: lesson block `{ "type": "technique-drill", "drillRef": "m4-w14-phrasing-drill" }` อ้างอิง root-level JSON asset array ชื่อ `techniqueDrills` เหมือน convention จาก Week 13

```json
[
  {
    "id": "m4-w14-phrasing-drill",
    "type": "technique-drill",
    "title": "3-4 Notes, Then Breathe",
    "skill": "phrasing-rest-control",
    "tempo": 60,
    "setup": [
      "เปิด Metronome 60 BPM หรือ Backing Track ช้าๆ",
      "ใช้เฉพาะ A Minor Pentatonic E-Shape + b5 ในโซนเฟรต 5-8",
      "ตั้งใจเล่น phrase สั้น ไม่ไล่ scale ยาว"
    ],
    "rules": [
      "เล่น 3-4 โน้ตเท่านั้น",
      "ต้องหยุดพัก 1 beat เต็มหลัง phrase",
      "ถ้าใช้ b5 ให้ resolve ไปหา 4, b3 หรือ 5",
      "ห้ามเล่นต่อเพราะกลัวความเงียบ"
    ],
    "steps": [
      {
        "label": "Phrase A",
        "instruction": "เล่น A-C-D-Eb แล้ว resolve ลง D จากนั้นหยุด 1 beat",
        "degreePath": ["1", "b3", "4", "b5", "4", "rest"]
      },
      {
        "label": "Phrase B",
        "instruction": "เล่น C-D-Eb-E แล้วหยุด 1 beat ให้หูฟังความโล่งของ E",
        "degreePath": ["b3", "4", "b5", "5", "rest"]
      },
      {
        "label": "Phrase C",
        "instruction": "เล่น G-Eb-D-C แล้วหยุด 1 beat ให้ phrase เหมือนคนพูดจบประโยค",
        "degreePath": ["b7", "b5", "4", "b3", "rest"]
      }
    ],
    "warningSigns": [
      "เล่นเกิน 4 โน้ตทุกครั้งโดยไม่รู้ตัว",
      "ไม่กล้าหยุด เพราะรู้สึกว่าความเงียบผิด",
      "จอดที่ b5 นานเกินไปจน phrase ฟังไม่คลี่",
      "มือขวาเร่งจนหูฟัง tension-resolution ไม่ทัน"
    ],
    "teacherNote": "เพลงที่ดีไม่ใช่เพลงที่มีโน้ตเยอะที่สุด แต่คือเพลงที่โน้ตกับความเงียบคุยกันรู้เรื่อง"
  }
]
```

## 7. Daily Practice: `m4-w14-daily-practice`

```json
{
  "id": "m4-w14-daily-practice",
  "type": "daily-practice",
  "title": "20 นาที: b5 tension + phrase breathing",
  "totalDuration": "20 นาที",
  "coreDuration": "15 นาที",
  "reflectionDuration": "5 นาที",
  "structure": [
    {
      "dayLabel": "Day 1-2",
      "focus": "ได้ยิน b5 เป็น tension",
      "core": [
        {
          "duration": "5 นาที",
          "title": "หา b5 บนคอ",
          "instruction": "ดู `m4-w14-overlay-blues-scale` แล้วชี้ Eb บนสาย 5 เฟรต 6 และสาย 3 เฟรต 8 ก่อนเล่น"
        },
        {
          "duration": "5 นาที",
          "title": "b5 → 4",
          "instruction": "เล่น Eb-D ช้าๆ แล้วฟังความตึงที่คลี่ลง"
        },
        {
          "duration": "5 นาที",
          "title": "b5 → 5",
          "instruction": "เล่น Eb-E ช้าๆ แล้วฟังความตึงที่คลี่ขึ้น"
        }
      ],
      "reflection": {
        "duration": "5 นาที",
        "instruction": "เปิด `m4-w14-ear-blues-tension` แล้วจดว่าแบบ Eb-D หรือ Eb-E ทำให้รู้สึก resolve ชัดกว่ากัน"
      }
    },
    {
      "dayLabel": "Day 3-4",
      "focus": "Phrase สั้นและหยุดพัก",
      "core": [
        {
          "duration": "5 นาที",
          "title": "3-note phrase",
          "instruction": "เล่น 3 โน้ตจาก shape แล้วหยุด 1 beat เต็ม ห้ามเติมโน้ตต่อ"
        },
        {
          "duration": "5 นาที",
          "title": "4-note phrase with b5",
          "instruction": "เล่น phrase 4 โน้ตที่มี b5 แล้ว resolve ก่อนหยุด"
        },
        {
          "duration": "5 นาที",
          "title": "Rest control",
          "instruction": "นับออกเสียงตอนหยุด เช่น เล่นบน 1-&-2-& แล้วพักบน 3"
        }
      ],
      "reflection": {
        "duration": "5 นาที",
        "instruction": "ฟัง recording สั้นๆ ของตัวเอง แล้วเช็กว่าความเงียบฟังเหมือนหายใจหรือเหมือนหลุดจังหวะ"
      }
    },
    {
      "dayLabel": "Day 5-7",
      "focus": "Mini improvisation แบบมีลมหายใจ",
      "core": [
        {
          "duration": "5 นาที",
          "title": "Call phrase",
          "instruction": "เล่น phrase สั้น 1 ประโยค แล้วหยุด 1 beat เหมือนตั้งคำถาม"
        },
        {
          "duration": "5 นาที",
          "title": "Response phrase",
          "instruction": "ตอบด้วย phrase ใหม่ที่ resolve b5 ไปหา 4 หรือ 5"
        },
        {
          "duration": "5 นาที",
          "title": "Backing Track / Metronome loop",
          "instruction": "เล่นสลับ phrase และ rest ตลอด 2 นาที โดยห้ามเล่นยาวเกิน 4 โน้ตต่อ phrase"
        }
      ],
      "reflection": {
        "duration": "5 นาที",
        "instruction": "ถามตัวเองว่า phrase ไหนฟังเหมือนคนพูดจริง และ phrase ไหนฟังเหมือนนิ้ววิ่งหนีความเงียบ"
      }
    }
  ]
}
```

## 8. Self-Check: `m4-w14-self-check`

```json
{
  "id": "m4-w14-self-check",
  "type": "self-check",
  "title": "เช็กว่าคุณเริ่ม phrase เป็นแล้วหรือยัง",
  "questions": [
    {
      "id": "m4-w14-q1-rest-control",
      "type": "reflection",
      "question": "Can you comfortably stop playing and leave empty space, or do your fingers feel the urge to keep moving?",
      "thaiPrompt": "คุณหยุดเล่นและปล่อยช่องว่างได้สบายไหม หรือรู้สึกว่านิ้วอยากวิ่งต่อทันที?",
      "passSignal": "หยุด 1 beat ได้โดยไม่เสียจังหวะ และไม่รู้สึกว่าต้องเติมโน้ตตลอดเวลา"
    },
    {
      "id": "m4-w14-q2-b5-resolution",
      "type": "reflection",
      "question": "When you play the b5, can you hear where it wants to resolve?",
      "thaiPrompt": "พอเล่น b5 แล้ว คุณได้ยินไหมว่ามันอยากคลี่ไปหา 4, b3 หรือ 5?",
      "passSignal": "เล่น Eb แล้วตั้งใจพาไป D, C หรือ E ได้ ไม่ปล่อยให้ b5 ลอยค้างแบบไม่มีจุดหมาย"
    }
  ],
  "passCriteria": [
    "หา b5 ใน A Blues Scale E-Shape ได้โดยไม่เปิด box ใหม่",
    "เล่น phrase 3-4 โน้ตแล้วหยุดพัก 1 beat ได้",
    "ใช้ b5 เป็น passing tension และ resolve ได้อย่างน้อย 2 ทาง",
    "ฟังออกว่าความเงียบทำให้ phrase ชัดขึ้น"
  ],
  "troubleshooting": [
    {
      "problem": "นิ้วเล่นต่อเองตลอด หยุดไม่ได้",
      "advice": "ลดจำนวนโน้ตเหลือ 2 โน้ตก่อน แล้วบังคับพัก 1 beat ให้ได้ ความเงียบคือแบบฝึก ไม่ใช่ความผิดพลาด"
    },
    {
      "problem": "b5 ฟังเพี้ยนหรือขัดจนไม่มั่นใจ",
      "advice": "อย่าจอดที่ b5 นาน ให้เล่น Eb-D หรือ Eb-E ช้าๆ เพื่อฝึกหูว่ามันต้องคลี่ไปทางไหน"
    },
    {
      "problem": "phrase ฟังเหมือนไล่สเกลขึ้นลง",
      "advice": "เลิกเริ่มจากโน้ตต่ำสุดทุกครั้ง ลองเริ่มจาก C, D หรือ G แล้วค่อยกลับหา A"
    }
  ]
}
```

## 9. Renderer Dependency Analysis

- `m4-w14-ear-blues-tension` ต้อง route ไปที่ `chordSoundLabs` ด้วย `type: "ear-training-lab"`
- Real data notes array สำหรับ Web Audio ต้องใช้ scientific pitch notation พร้อม octave profile เช่น `["Eb3", "D3", "C3"]`
- `m4-w14-overlay-blues-scale` ใช้ renderer แนว `chord-tone-overlay` ที่ต้องรองรับสี/role อย่างน้อย 3 กลุ่ม: Skeleton, Meat, Tension
- b5 / Blues Note ควรมี visual style แบบ warning/tension ที่ต่างจาก Skeleton และ Meat ชัดเจน
- Fretboard visualizer ต้องใช้ Orientation Rule v2: String 1 / High e อยู่ด้านบน และ String 6 / Low E อยู่ด้านล่าง
- `technique-drill` ใช้ convention แบบ root-level asset reference: `{ "type": "technique-drill", "drillRef": "m4-w14-phrasing-drill" }` อ้าง `techniqueDrills[]`
- `daily-practice` ต้องรองรับ structure แบบ 15-minute core + 5-minute reflection
- `self-check` ต้องรองรับ reflection questions และ troubleshooting
- ไม่ต้องใช้ staff notation
- ไม่ต้องสร้าง renderer ใหม่สำหรับ standard notation
- Production UI remains untouched

## 10. Guardrails for Implementation

- ห้ามเปิด Month 4 ใน production UI จากเอกสารนี้
- ห้ามแก้ `outputs/data.json` จากเอกสารนี้
- ห้ามแก้ `outputs/app.js`, `outputs/styles.css`, หรือ `outputs/index.html`
- ห้ามใช้ Week 14 เป็นเหตุผลเปิด Pentatonic boxes ทั้งหมด
- ห้ามทำให้ Blues Scale กลายเป็น speed exercise
- ห้ามเพิ่ม Backing Track ที่ต้องโหลดจาก network
- ห้ามใช้ external audio files
- ถ้าทำ audio lab จริง ต้องใช้ Web Audio API หรือ fallback text เท่านั้น
- ถ้า renderer ยังไม่รองรับ tension color ให้ใช้ text fallback ที่อธิบายว่า b5 คือ warning/tension note

## 11. Revision Summary

1. Created canonical Month 4 Week 14 draft with `m4-w14-...` IDs.
2. Lesson title locked to `The Blues Note & Phrasing`.
3. Strict single-box scope lock enforced: only `A Minor Pentatonic E-Shape + b5` around Root A on string 6 fret 5.
4. Box 2, 3, 4, and 5 are explicitly prohibited.
5. Blues Scale framed as Minor Pentatonic plus one spicy/tension note, not a separate giant box.
6. Play By Ear thread position integrated: `เติม scale ได้ → phrasing ได้ → improvise ตามเพลงได้`.
7. `m4-w14-ear-blues-tension` routed to `chordSoundLabs` with `type: "ear-training-lab"`.
8. Web Audio octave-profile requirement documented through explicit note arrays such as `Eb3`, `D3`, `C3`.
9. `m4-w14-overlay-blues-scale` specifies Skeleton, Meat, and b5 Tension visual roles.
10. Orientation Rule v2 enforced: String 1 / High e on top, String 6 / Low E on bottom.
11. `m4-w14-phrasing-drill` establishes a technique drill focused on 3-4 notes plus a full-beat rest.
12. Daily practice set to 20 minutes: 15-minute phrasing/breathing drill + 5-minute b5 tension listening.
13. Self-check includes the required reflection question about leaving empty space.
14. Guardrails enforced against all 5 boxes, speed scale sequences, shred mechanics, and staff notation.
15. Production app files remain unchanged; this is documentation and mock-data planning only.
