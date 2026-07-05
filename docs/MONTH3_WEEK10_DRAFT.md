# Month 3 Week 10 Draft: Chord Quality + Arpeggio as Chord Tones in Motion

สถานะ: documentation/mock-data planning only
ห้ามแก้ `outputs/app.js`, `outputs/styles.css`, `outputs/index.html`, `outputs/data.json` จากเอกสารนี้
ห้ามเพิ่ม Month 3 เข้า production UI จนกว่าจะมี launch task แยกต่างหาก

## 1. Week Metadata

| Field | Value |
| --- | --- |
| stable week id | `m3-w10-chord-quality-arpeggio-motion` |
| absolute week number | `10` |
| month number | `3` |
| month week index | `2` |
| module label | `Chord Tone & Arpeggio Foundation` |
| title | `Chord Quality + Arpeggio as Chord Tones in Motion` |
| Thai title | `คุณภาพคอร์ด และ Arpeggio แบบเสียงในคอร์ดที่เคลื่อนที่` |
| estimated minutes per day | `20` |
| core daily practice | `15 นาที` |
| optional listening/reflection | `+5 นาที` |
| core required shapes | `A-Shape C major`, `E-Shape G major`, `E-Shape F major` |
| optional compare shape | `A-Shape F major` |
| technical guardrail | ไม่สอน full CAGED, ไม่สอน speed/shred arpeggio, ไม่สอน sweep picking |

## 2. Week Promise

สัปดาห์นี้เราจะเริ่มเห็นว่า chord tones ไม่ได้อยู่นิ่ง ๆ แค่ในรูปคอร์ดเท่านั้น แต่สามารถถูกเล่นออกมาเป็นเส้น melody สั้น ๆ ได้ด้วย สิ่งนี้เรียกว่า Arpeggio แต่ในบทนี้ให้คิดง่าย ๆ ว่า:

> Arpeggio = chord tones in motion

ไม่ใช่เทคนิคโชว์เร็ว ไม่ใช่ shred และไม่ใช่การกวาดสายให้เร็วที่สุด เป้าหมายคือให้ตาเห็นตำแหน่ง 1-3-5 ชัดขึ้น หูฟังออกว่ามันยังเป็นเสียงคอร์ดเดิม และมือขวาดีดทีละโน้ตอย่างควบคุมได้

Dashboard สามารถแสดงเวลาเป็น `20 นาที` ได้ แต่แกนจริงของการซ้อมคือ `15 นาที` ส่วนอีก `+5 นาที` เป็น optional listening/reflection ถ้าวันไหนเหนื่อย ให้ทำ core 15 นาทีให้ชัดก่อน ถือว่าผ่านเป้าหมายหลักของวันแล้ว

## 3. Scope Lock

### 3.1 Allowed Shape Scope

Week 10 ใช้เฉพาะ 2 shape family นี้:

1. **A-Shape**
   - Required: C major
   - Optional compare: F major
   - จุดคิด: Root อยู่บนสาย 5

2. **E-Shape**
   - Required: G major
   - Required: F major
   - จุดคิด: Root อยู่บนสาย 6

### 3.2 F A-Shape Optional Policy

F major ใน A-Shape รอบเฟรต 8 มีประโยชน์มาก เพราะช่วยให้ผู้เรียนเห็นว่า "คอร์ดเดียวกันสามารถอยู่ได้มากกว่าหนึ่งตำแหน่ง" แต่ตำแหน่งนี้อาจสูงหรือรู้สึกไกลสำหรับผู้เรียนบางคนในช่วงนี้

ดังนั้น Week 10 ให้ถือว่า:

- **Required:** A-Shape C major
- **Required:** E-Shape G major
- **Required:** E-Shape F major
- **Optional compare:** A-Shape F major

ถ้าผู้เรียนรู้สึกตึงมือ หลงตำแหน่ง หรือเริ่มจำแบบท่อง ให้กลับมาอยู่กับ F ใน E-Shape ก่อน เป้าหมายของ F A-Shape คือ concept awareness ไม่ใช่การจำหลายตำแหน่งให้ครบ

### 3.3 Explicitly Not Taught Yet

- ไม่สอน full CAGED
- ไม่สอน C-Shape, G-Shape, D-Shape ในบทนี้
- ไม่สอน sweep picking
- ไม่สอน arpeggio speed drill
- ไม่สอนทุก inversion
- ไม่ขยายเป็นระบบ jazz arpeggio
- ไม่สอน 7th chord arpeggio จนกว่า Week 11
- ไม่ขยาย diminished เป็น harmony theory

### 3.4 Anti-Speed Teaching Tone

ทุกครั้งที่ใช้คำว่า Arpeggio ต้องย้ำว่า:

- เล่นช้าได้ถูกต้องดีกว่าเล่นเร็วแบบหลุดเสียง
- เราเล่นเพื่อได้ยิน chord tones ไม่ใช่เพื่อโชว์ความเร็ว
- Alternate Picking ในบทนี้ใช้เพื่อแยกเสียงให้ชัด ไม่ใช่เพื่อเร่ง BPM
- ถ้าพูด 1-3-5 ไม่ทัน ให้ลด tempo ทันที

## 4. Universal Renderer Block Structure

```json
{
  "week": 10,
  "number": 10,
  "month": 3,
  "module": "Chord Tone & Arpeggio Foundation",
  "title": "Chord Quality + Arpeggio as Chord Tones in Motion",
  "summary": "Core 15 นาที: ฟังคุณภาพคอร์ด และเล่น 1-3-5 เป็น Arpeggio ช้า ๆ ผ่าน A-Shape/E-Shape พร้อม optional listening/reflection +5 นาที",
  "estimatedMinutesPerDay": 20,
  "lessonBlocks": [
    { "type": "text", "id": "m3-w10-intro-arpeggio-not-speed" },
    { "type": "teacher-note", "id": "m3-w10-teacher-note-slow-alternate-picking" },
    { "type": "text", "id": "m3-w10-shape-scope-a-e-only" },
    { "type": "ear-training-lab", "labRef": "m3-w10-chord-quality-ear-lab" },
    { "type": "fretboard", "visualRef": "m3-w10-a-shape-c-major-135-map" },
    { "type": "fretboard", "visualRef": "m3-w10-e-shape-g-major-135-map" },
    { "type": "fretboard", "visualRef": "m3-w10-e-shape-f-major-135-map" },
    { "type": "fretboard", "visualRef": "m3-w10-a-shape-f-major-135-map", "optional": true },
    { "type": "tab", "tabRef": "m3-w10-chord-arpeggio-chord-tab" },
    { "type": "technique-drill", "id": "m3-w10-slow-alternate-picking-135" },
    { "type": "self-check", "id": "m3-w10-self-check" }
  ]
}
```

## 5. Lesson Blocks Draft

### Block 1: `text`

```json
{
  "type": "text",
  "id": "m3-w10-intro-arpeggio-not-speed",
  "title": "Arpeggio ไม่ใช่การโชว์เร็วในบทนี้",
  "body": [
    "สวัสดีครับ สัปดาห์ที่แล้วเราเห็นแล้วว่าคอร์ด C, F และ G มีโครง 1-3-5 อยู่ข้างใน วันนี้เราจะเอาเสียง 1-3-5 เหล่านั้นมาขยับทีละตัว",
    "เวลาที่เราเล่นเสียงในคอร์ดออกมาทีละโน้ต เราเรียกว่า Arpeggio แต่ในบทนี้อย่าเพิ่งคิดถึงการเล่นเร็วหรือโชว์เทคนิค ให้คิดว่าเรากำลังเปิดคอร์ดออกมาให้หูได้ยินทีละชั้น",
    "เป้าหมายคือมองเห็น 1-3-5 ใน A-Shape และ E-Shape แล้วเล่น Chord -> Arpeggio -> Chord ให้เสียงยังเป็นครอบครัวเดียวกัน"
  ],
  "listenFor": [
    "ตอนตีคอร์ด เสียง 1-3-5 ดังพร้อมกัน",
    "ตอนเล่น Arpeggio เสียง 1-3-5 ดังทีละตัว แต่ยังรู้สึกว่าเป็นคอร์ดเดิม",
    "ถ้าเล่นเร็วเกินไป หูจะจับความสัมพันธ์ของ 1-3-5 ไม่ทัน"
  ],
  "feel": [
    "มือขวาควบคุม Down-Up อย่างนิ่ง",
    "มือซ้ายจับ shape พอเป็นกรอบ ไม่บีบแรงเกิน",
    "ปากยังพูด 1-3-5 ได้ทันระหว่างเล่น"
  ]
}
```

### Block 2: `teacher-note`

```json
{
  "type": "teacher-note",
  "id": "m3-w10-teacher-note-slow-alternate-picking",
  "title": "ครูแนะนำ: Alternate Picking แบบช้าและคุมเสียง",
  "body": "วันนี้ใช้ Alternate Picking เพื่อให้เสียงแต่ละโน้ตแยกกันชัดครับ ไม่ใช่เพื่อเร่งความเร็ว ให้ดีดลง-ขึ้นแบบเล็ก นิ่ง และสม่ำเสมอ ถ้าโน้ตเริ่มเบลอ ให้หยุดทันที ลด BPM แล้วกลับมาพูด 1-3-5 ให้ตรงกับนิ้วก่อน"
}
```

### Block 3: `text`

```json
{
  "type": "text",
  "id": "m3-w10-shape-scope-a-e-only",
  "title": "วันนี้ใช้แค่ A-Shape และ E-Shape",
  "body": [
    "คำว่า shape ในบทนี้หมายถึงกรอบนิ้วที่ช่วยให้เรามองเห็น chord tones ง่ายขึ้น ยังไม่ใช่การสอน CAGED เต็มระบบ",
    "A-Shape คือกลุ่มเสียงที่อิง Root บนสาย 5 เราจะใช้ C major เป็นแกนหลัก และใช้ F major เป็น optional compare เท่านั้น",
    "E-Shape คือกลุ่มเสียงที่อิง Root บนสาย 6 เราจะใช้กับ G major และ F major เป็นงานหลัก",
    "F major โผล่ทั้งใน E-Shape และ A-Shape เพื่อให้เห็นว่าคอร์ดเดียวกันสามารถมีตำแหน่งมากกว่าหนึ่งที่ได้ แต่ถ้า A-Shape F รอบเฟรต 8 ทำให้เกร็งหรือหลง ให้พักไว้ก่อน แล้วอยู่กับ F E-Shape"
  ],
  "guardrail": "Do not introduce full CAGED. Use only A-Shape and E-Shape in Week 10."
}
```

### Block 4: `ear-training-lab`

```json
{
  "type": "ear-training-lab",
  "id": "m3-w10-chord-quality-ear-lab",
  "title": "ฟังคุณภาพคอร์ด: Major / Minor / Diminished",
  "skill": "chord quality hearing",
  "audioMode": "web-audio-optional",
  "listenFor": [
    "Major = 1-3-5 ให้ความรู้สึกสว่างและเปิด",
    "Minor = 1-b3-5 ให้ความรู้สึกหม่นลงเพราะ 3rd เปลี่ยน",
    "Diminished = 1-b3-b5 ให้ความรู้สึกตึงและไม่มั่นคง",
    "Diminished ในบทนี้เป็น ear-only preview เท่านั้น ยังไม่ต้องฝึก shape"
  ],
  "prompts": [
    { "id": "m3-w10-ear-c-major", "label": "C Major", "notes": ["C", "E", "G"], "answer": "major" },
    { "id": "m3-w10-ear-c-minor", "label": "C Minor", "notes": ["C", "Eb", "G"], "answer": "minor" },
    { "id": "m3-w10-ear-g-major", "label": "G Major", "notes": ["G", "B", "D"], "answer": "major" },
    {
      "id": "m3-w10-ear-bdim-preview",
      "label": "B diminished preview",
      "notes": ["B", "D", "F"],
      "answer": "diminished",
      "note": "ฟังแค่ความตึงและไม่มั่นคง ยังไม่ต้องฝึก shape"
    }
  ],
  "fallbackText": "ถ้า audio ไม่ทำงาน ให้เล่น C major, C minor contrast, G major และ B diminished preview บนกีตาร์จริงหรือเปียโน แล้วตอบจากอารมณ์ที่ได้ยิน"
}
```

Teacher copy:

ฟัง major/minor/diminished เพื่อจำสีของคอร์ด ไม่ใช่เพื่อเปิดบทใหม่เรื่อง harmony ทั้งระบบครับ จุดสำคัญคือหูเริ่มรู้ว่าเมื่อ 3rd หรือ 5th เปลี่ยน อารมณ์คอร์ดเปลี่ยนทันที โดยเฉพาะ diminished ให้ฟังแค่ความตึงและไม่มั่นคง ยังไม่ต้องฝึก shape

### Block 5: `fretboard`

```json
{
  "type": "fretboard",
  "visualRef": "m3-w10-a-shape-c-major-135-map"
}
```

Teacher copy:

A-Shape C major ให้คิดว่า Root อยู่ที่สาย 5 เฟรต 3 ก่อน จากนั้นมองหา 3 และ 5 ที่อยู่ในกรอบเดียวกัน อย่าเพิ่งกังวลว่ามันเป็น CAGED หรือไม่ ให้ถามแค่ว่า: "ตรงนี้ 1 อยู่ไหน, 3 อยู่ไหน, 5 อยู่ไหน"

### Block 6: `fretboard`

```json
{
  "type": "fretboard",
  "visualRef": "m3-w10-e-shape-g-major-135-map"
}
```

Teacher copy:

E-Shape G major ใช้ Root บนสาย 6 เฟรต 3 เป็นจุดตั้งต้น กรอบนี้จะรู้สึกคุ้นมือสำหรับคนที่เคยจับคอร์ด G หรือ barre chord แบบ E-Shape แต่วันนี้เรายังไม่สนใจ barre เต็มรูป ให้มองแค่ 1-3-5 ก่อน

### Block 7: `fretboard`

```json
{
  "type": "fretboard",
  "visualRef": "m3-w10-e-shape-f-major-135-map"
}
```

Teacher copy:

F major ใน E-Shape เป็นงานหลักของสัปดาห์นี้ เพราะอยู่ใกล้มือและเชื่อมกับความรู้สึกของ E-Shape ได้ง่ายกว่า ให้เริ่มจาก Root F บนสาย 6 แล้วไล่หา 1-3-5 อย่างช้า ๆ

### Block 8: `fretboard` optional

```json
{
  "type": "fretboard",
  "visualRef": "m3-w10-a-shape-f-major-135-map",
  "optional": true
}
```

Teacher copy:

A-Shape F major เป็นแค่ optional compare ครับ ตำแหน่งนี้อยู่สูงกว่าและอาจรู้สึกไม่สบายมือสำหรับบางคน ใช้ดูเพื่อเข้าใจว่า F major อยู่ได้มากกว่าหนึ่งตำแหน่งก็พอ ถ้าเริ่มเกร็งหรือสับสน ให้กลับไป F E-Shape ทันที

### Block 9: `tab`

```json
{
  "type": "tab",
  "tabRef": "m3-w10-chord-arpeggio-chord-tab"
}
```

Teacher copy:

แบบฝึกนี้ชื่อ Chord -> Arpeggio -> Chord ให้ตีคอร์ดหนึ่งครั้งเพื่อให้หูรู้จักภาพรวม แล้วเล่น 1-3-5 ทีละตัว จากนั้นกลับมาตีคอร์ดอีกครั้ง ถ้า arpeggio ถูก หูจะรู้สึกว่าเรายังอยู่ในบ้านหลังเดิม

### Block 10: `technique-drill`

```json
{
  "type": "technique-drill",
  "id": "m3-w10-slow-alternate-picking-135",
  "title": "Slow Alternate Picking บน 1-3-5",
  "skill": "alternate picking",
  "duration": "4 นาที",
  "bpm": 55,
  "instruction": "ดีด 1-3-5 ด้วย Down-Up-Down หรือ Up-Down-Up ช้า ๆ ให้เสียงเท่ากันทุกโน้ต",
  "steps": [
    "ตั้ง Metronome 55 BPM",
    "เล่นแค่ 3 โน้ตของ shape เดียวก่อน",
    "พูด 1-3-5 ไปพร้อมกับมือขวา",
    "ถ้าเสียงไม่เท่ากัน ให้ลด BPM ไม่ต้องฝืน"
  ],
  "targetSound": "โน้ตแต่ละตัวต้องชัด แยกกัน และไม่ดังเบากว่ากันมาก",
  "commonMistakes": [
    "ดีดขึ้นเบากว่าดีดลง",
    "รีบเล่นให้เร็วทั้งที่ยังพูด 1-3-5 ไม่ทัน",
    "ปล่อยให้โน้ตไหลรวมกันจนฟังไม่ออกว่าเป็น 1, 3 หรือ 5"
  ],
  "selfCheck": [
    "เล่น 1-3-5 ได้ 4 รอบโดยเสียง Down และ Up ใกล้เคียงกัน",
    "พูดเลข degree ได้ตรงกับโน้ตที่เล่น"
  ]
}
```

### Block 11: `self-check`

```json
{
  "type": "self-check",
  "id": "m3-w10-self-check",
  "title": "เช็กว่าตาม 1-3-5 ทันไหม",
  "questions": [
    {
      "id": "m3-w10-reflect-track-interval",
      "type": "reflection",
      "prompt": "ตอนย้ายจาก A-Shape C major ไป E-Shape G major หรือ E-Shape F major คุณยังรู้ไหมว่าโน้ตไหนคือ 1, 3, 5 หรือรู้สึกว่าแค่วางนิ้วตามรูป?",
      "passSignal": "ตอบได้ว่า Root อยู่ตรงไหน และ 3/5 อยู่สัมพันธ์กับ Root อย่างไร"
    },
    {
      "id": "m3-w10-reflect-hear-motion",
      "type": "reflection",
      "prompt": "ตอนเล่น Chord -> Arpeggio -> Chord หูยังรู้สึกว่า arpeggio เป็นเสียงในคอร์ดเดิมอยู่ไหม หรือรู้สึกเหมือนโน้ตกระจัดกระจาย?",
      "passSignal": "ตอบได้ว่าเสียง 1-3-5 ยังเชื่อมกับคอร์ดเดิม และรู้ว่าถ้าเบลอต้องลด tempo"
    }
  ],
  "passCriteria": [
    "เล่น A-Shape C, E-Shape G และ E-Shape F แบบ 1-3-5 ได้ช้า ๆ",
    "พูด 1-3-5 ตรงกับโน้ตขณะเล่นได้",
    "ไม่เร่ง arpeggio เป็น speed drill",
    "เข้าใจว่า A-Shape F เป็น optional compare ไม่ใช่ required shape"
  ]
}
```

## 6. Required Root-Level Assets Draft

### 6.1 `fretboardVisuals`

```json
[
  {
    "id": "m3-w10-a-shape-c-major-135-map",
    "type": "fretboard",
    "title": "A-Shape C Major: 1-3-5",
    "caption": "Root อยู่บนสาย 5 เฟรต 3 ใช้ดู 1-3-5 ของ C major ในกรอบ A-Shape",
    "config": { "startFret": 3, "endFret": 7, "showNut": false },
    "orientationNote": "แผนที่คอกีตาร์ใช้ TAB-style orientation: สาย 1 / High e อยู่ด้านบน และสาย 6 / Low E อยู่ด้านล่าง",
    "legend": [
      { "type": "root", "label": "1 / Root" },
      { "type": "third", "label": "3 / Major 3rd" },
      { "type": "fifth", "label": "5 / Perfect 5th" }
    ],
    "dots": [
      { "string": 5, "fret": 3, "label": "1", "note": "C", "type": "root" },
      { "string": 4, "fret": 5, "label": "5", "note": "G", "type": "fifth" },
      { "string": 3, "fret": 5, "label": "1", "note": "C", "type": "root" },
      { "string": 2, "fret": 5, "label": "3", "note": "E", "type": "third" }
    ]
  },
  {
    "id": "m3-w10-e-shape-g-major-135-map",
    "type": "fretboard",
    "title": "E-Shape G Major: 1-3-5",
    "caption": "Root อยู่บนสาย 6 เฟรต 3 ใช้ดู 1-3-5 ของ G major ในกรอบ E-Shape",
    "config": { "startFret": 3, "endFret": 7, "showNut": false },
    "dots": [
      { "string": 6, "fret": 3, "label": "1", "note": "G", "type": "root" },
      { "string": 5, "fret": 5, "label": "5", "note": "D", "type": "fifth" },
      { "string": 4, "fret": 5, "label": "1", "note": "G", "type": "root" },
      { "string": 3, "fret": 4, "label": "3", "note": "B", "type": "third" }
    ]
  },
  {
    "id": "m3-w10-e-shape-f-major-135-map",
    "type": "fretboard",
    "title": "E-Shape F Major: 1-3-5",
    "caption": "F major ในกรอบ E-Shape เป็น required shape ของสัปดาห์นี้",
    "config": { "startFret": 1, "endFret": 5, "showNut": true },
    "dots": [
      { "string": 6, "fret": 1, "label": "1", "note": "F", "type": "root" },
      { "string": 5, "fret": 3, "label": "5", "note": "C", "type": "fifth" },
      { "string": 4, "fret": 3, "label": "1", "note": "F", "type": "root" },
      { "string": 3, "fret": 2, "label": "3", "note": "A", "type": "third" }
    ]
  },
  {
    "id": "m3-w10-a-shape-f-major-135-map",
    "type": "fretboard",
    "title": "A-Shape F Major: 1-3-5 (Optional Compare)",
    "caption": "ใช้เป็น optional compare เพื่อเห็นว่า F major มีได้มากกว่าหนึ่งตำแหน่ง ถ้ารู้สึกสูงหรือสับสนให้กลับไป F E-Shape",
    "config": { "startFret": 8, "endFret": 12, "showNut": false },
    "optional": true,
    "dots": [
      { "string": 5, "fret": 8, "label": "1", "note": "F", "type": "root" },
      { "string": 4, "fret": 10, "label": "5", "note": "C", "type": "fifth" },
      { "string": 3, "fret": 10, "label": "1", "note": "F", "type": "root" },
      { "string": 2, "fret": 10, "label": "3", "note": "A", "type": "third" }
    ]
  }
]
```

### 6.2 `miniTabs`

```json
[
  {
    "id": "m3-w10-chord-arpeggio-chord-tab",
    "type": "tab",
    "title": "Chord -> Arpeggio -> Chord",
    "bpm": 55,
    "ascii": [
      "e|--3-----3-----------3-----|--1-----1-----------1-----|",
      "B|--5-------5---------5-----|--1-------1---------1-----|",
      "G|--5---------5-------5-----|--2---------2-------2-----|",
      "D|--5-----------5-----5-----|--3-----------3-----3-----|",
      "A|--3-------------3---3-----|--3-------------3---3-----|",
      "E|--------------------------|--1-----------------1-----|"
    ],
    "lyrics": "   C chord  1 3 5 1 3 1   |  F chord  1 3 5 1 3 1",
    "note": "ตีคอร์ดหนึ่งครั้ง เล่น arpeggio ช้า ๆ แล้วกลับมาตีคอร์ดอีกครั้ง ให้หูรู้ว่ายังเป็นเสียงชุดเดียวกัน"
  }
]
```

Mobile note: TAB ต้องอยู่ใน scroll area ภายในการ์ดเท่านั้น ห้ามทำให้ทั้งหน้าเกิด horizontal overflow

### 6.3 `earTrainingLabs`

```json
[
  {
    "id": "m3-w10-chord-quality-ear-lab",
    "type": "ear-training-lab",
    "title": "Major / Minor / Diminished Quality Preview",
    "audioMode": "web-audio-optional",
    "prompts": [
      { "id": "m3-w10-ear-c-major", "notes": ["C", "E", "G"], "answer": "major" },
      { "id": "m3-w10-ear-c-minor", "notes": ["C", "Eb", "G"], "answer": "minor" },
      { "id": "m3-w10-ear-g-major", "notes": ["G", "B", "D"], "answer": "major" },
      {
        "id": "m3-w10-ear-bdim-preview",
        "label": "B diminished preview",
        "notes": ["B", "D", "F"],
        "answer": "diminished",
        "note": "ฟังแค่ความตึงและไม่มั่นคง ยังไม่ต้องฝึก shape"
      }
    ],
    "fallbackText": "ถ้าเสียงไม่ทำงาน ให้ใช้กีตาร์จริงหรือครูเล่นให้ฟังแทน"
  }
]
```

### 6.4 `techniqueDrills`

```json
[
  {
    "id": "m3-w10-slow-alternate-picking-135",
    "type": "technique-drill",
    "title": "Slow Alternate Picking บน 1-3-5",
    "skill": "alternate picking",
    "duration": "4 นาที",
    "bpm": 55
  }
]
```

## 7. Structured Daily Practice: 15-Minute Core + Optional 5-Minute

```json
[
  {
    "dayLabel": "Day 1-2",
    "focus": "A-Shape C major",
    "isOpen": true,
    "totalDuration": "20 นาที",
    "coreDuration": "15 นาที",
    "optionalDuration": "+5 นาที",
    "exercises": [
      {
        "id": "m3-w10-d1-p1",
        "duration": "3 นาที",
        "title": "ดูแผนที่ A-Shape C",
        "instruction": "ชี้ 1, 3, 5 บน `m3-w10-a-shape-c-major-135-map` ก่อนเล่นจริง"
      },
      {
        "id": "m3-w10-d1-p2",
        "duration": "4 นาที",
        "title": "Chord -> Arpeggio -> Chord",
        "instruction": "เล่น C chord แล้วเล่น 1-3-5 ช้า ๆ จากนั้นกลับมาตี C chord อีกครั้ง",
        "tabRef": "m3-w10-chord-arpeggio-chord-tab"
      },
      {
        "id": "m3-w10-d1-p3",
        "duration": "4 นาที",
        "title": "Slow Alternate Picking",
        "instruction": "ดีด 1-3-5 ด้วย Down-Up-Down ช้า ๆ ที่ 55 BPM",
        "microSkillRef": "m3-w10-slow-alternate-picking-135"
      },
      {
        "id": "m3-w10-d1-p4",
        "duration": "4 นาที",
        "title": "พูดเลขระหว่างเล่น",
        "instruction": "เล่น arpeggio แล้วพูด 1-3-5 ให้ตรงกับโน้ต ถ้าพูดไม่ทันให้ลด BPM"
      }
    ],
    "optional": {
      "duration": "5 นาที",
      "title": "ฟัง major/minor ช้า ๆ",
      "instruction": "เปิด `m3-w10-chord-quality-ear-lab` แล้วฟัง C major เทียบ C minor แบบเบา ๆ ถ้าเหนื่อยให้ข้ามได้"
    }
  },
  {
    "dayLabel": "Day 3-4",
    "focus": "E-Shape G major",
    "isOpen": false,
    "totalDuration": "20 นาที",
    "coreDuration": "15 นาที",
    "optionalDuration": "+5 นาที",
    "exercises": [
      {
        "id": "m3-w10-d3-p1",
        "duration": "3 นาที",
        "title": "ดูแผนที่ E-Shape G",
        "instruction": "หา Root G บนสาย 6 แล้วชี้ 1, 3, 5 ในกรอบ E-Shape",
        "visualRef": "m3-w10-e-shape-g-major-135-map"
      },
      {
        "id": "m3-w10-d3-p2",
        "duration": "5 นาที",
        "title": "G Chord -> Arpeggio -> G Chord",
        "instruction": "เล่นช้า ๆ ให้เสียง arpeggio ยังฟังเป็น G major"
      },
      {
        "id": "m3-w10-d3-p3",
        "duration": "4 นาที",
        "title": "ฟัง major quality",
        "instruction": "ฟัง G-B-D แล้วพูดว่า major เพราะ 3rd เป็น B",
        "labRef": "m3-w10-chord-quality-ear-lab"
      },
      {
        "id": "m3-w10-d3-p4",
        "duration": "3 นาที",
        "title": "เขียน 1-3-5",
        "instruction": "จด G-B-D และวงว่าโน้ตไหนคือ 1, 3, 5"
      }
    ],
    "optional": {
      "duration": "5 นาที",
      "title": "Diminished ear-only preview",
      "instruction": "ฟัง `m3-w10-ear-bdim-preview` แค่รับรู้ความตึงและไม่มั่นคง ห้ามเพิ่มเป็นแบบฝึก shape"
    }
  },
  {
    "dayLabel": "Day 5",
    "focus": "F major: required E-Shape, optional A-Shape compare",
    "isOpen": false,
    "totalDuration": "20 นาที",
    "coreDuration": "15 นาที",
    "optionalDuration": "+5 นาที",
    "exercises": [
      {
        "id": "m3-w10-d5-p1",
        "duration": "4 นาที",
        "title": "F ใน E-Shape (Required)",
        "instruction": "ดู `m3-w10-e-shape-f-major-135-map` แล้วเล่น 1-3-5 ช้า ๆ"
      },
      {
        "id": "m3-w10-d5-p2",
        "duration": "4 นาที",
        "title": "F Chord -> Arpeggio -> F Chord",
        "instruction": "เล่น F E-Shape ให้หูรู้สึกว่า arpeggio ยังเป็นเสียงของ F major"
      },
      {
        "id": "m3-w10-d5-p3",
        "duration": "4 นาที",
        "title": "พูด F-A-C",
        "instruction": "เล่น F-A-C ช้า ๆ และพูด 1-3-5 ให้ตรงกับโน้ต"
      },
      {
        "id": "m3-w10-d5-p4",
        "duration": "3 นาที",
        "title": "พักฟังเสียง",
        "instruction": "ตี F chord หนึ่งครั้ง แล้วเล่น arpeggio หนึ่งครั้ง ฟังว่ายังเป็นเสียงชุดเดียวกันไหม"
      }
    ],
    "optional": {
      "duration": "5 นาที",
      "title": "Optional Compare: F ใน A-Shape",
      "instruction": "ดู `m3-w10-a-shape-f-major-135-map` เพื่อเห็นว่า F major อยู่ได้อีกตำแหน่ง ถ้ารู้สึกสูง เกร็ง หรือสับสน ให้หยุดและกลับไป F E-Shape"
    }
  },
  {
    "dayLabel": "Day 6-7",
    "focus": "รวม A-Shape / E-Shape โดยไม่เร่ง",
    "isOpen": false,
    "totalDuration": "20 นาที",
    "coreDuration": "15 นาที",
    "optionalDuration": "+5 นาที",
    "exercises": [
      {
        "id": "m3-w10-d6-p1",
        "duration": "4 นาที",
        "title": "C A-Shape Review",
        "instruction": "เล่น C A-Shape ช้า ๆ โดยพูด 1-3-5 ทุกครั้ง"
      },
      {
        "id": "m3-w10-d6-p2",
        "duration": "4 นาที",
        "title": "G -> F แบบ E-Shape",
        "instruction": "เล่น G E-Shape แล้ว F E-Shape ช้า ๆ โดยไม่เร่งมือขวา"
      },
      {
        "id": "m3-w10-d6-p3",
        "duration": "4 นาที",
        "title": "Chord -> Arpeggio -> Chord Review",
        "instruction": "ใช้ `m3-w10-chord-arpeggio-chord-tab` เป็นแบบฝึกหลัก"
      },
      {
        "id": "m3-w10-d6-p4",
        "duration": "3 นาที",
        "title": "Self-Check",
        "instruction": "ตอบคำถามสะท้อนตัวเอง 2 ข้อด้านล่าง"
      }
    ],
    "optional": {
      "duration": "5 นาที",
      "title": "Reflection note",
      "instruction": "เขียนหนึ่งประโยคว่า shape ไหนทำให้คุณเห็น 1-3-5 ชัดที่สุด และ shape ไหนยังทำให้หลง"
    }
  }
]
```

## 8. Reflective Self-Check

```json
{
  "id": "m3-w10-self-check",
  "type": "self-check",
  "title": "2 คำถามก่อนขึ้นบทต่อไป",
  "questions": [
    {
      "id": "m3-w10-reflect-track-interval",
      "type": "reflection",
      "prompt": "ตอนเล่น A-Shape C แล้วขยับไป E-Shape G หรือ E-Shape F คุณยังตามทันไหมว่า 1, 3, 5 อยู่ตรงไหน หรือเล่นตามรูปนิ้วอย่างเดียว?",
      "expectedReflection": "ผู้เรียนควรอธิบายได้ว่า Root อยู่ตรงไหน และ 3/5 อยู่สัมพันธ์กับ Root อย่างไร"
    },
    {
      "id": "m3-w10-reflect-hear-motion",
      "type": "reflection",
      "prompt": "ตอนเล่น Chord -> Arpeggio -> Chord หูยังรู้สึกว่า arpeggio เป็นเสียงในคอร์ดเดิมไหม?",
      "expectedReflection": "ผู้เรียนควรได้ยินว่า arpeggio คือ chord tones ที่ถูกเล่นทีละตัว ไม่ใช่โน้ตสุ่ม"
    }
  ],
  "passCriteria": [
    "ตอบได้ด้วยภาษาตัวเองว่า arpeggio คือ chord tones in motion",
    "เล่น A-Shape C, E-Shape G และ E-Shape F ได้ช้า ๆ โดยพูด 1-3-5 ได้ทัน",
    "เข้าใจว่า F A-Shape เป็น optional compare ไม่ใช่ required practice",
    "ไม่เร่ง tempo เพื่อกลบความไม่ชัด"
  ],
  "troubleshooting": [
    {
      "problem": "เล่นแล้วรู้สึกเป็นแค่ pattern นิ้ว",
      "advice": "หยุดเล่น แล้วชี้ 1, 3, 5 บน fretboard map ก่อนดีดใหม่"
    },
    {
      "problem": "เสียง arpeggio ไม่เหมือนคอร์ดเดิม",
      "advice": "ตีคอร์ดก่อนหนึ่งครั้ง ฟังเสียงรวม แล้วเล่น arpeggio ช้าลงทีละโน้ต"
    },
    {
      "problem": "F A-Shape สูงหรือเกร็งเกินไป",
      "advice": "ข้าม optional compare ได้เลย กลับไปทำ F E-Shape ให้มั่นใจก่อน"
    }
  ]
}
```

## 9. Renderer Dependency Analysis

### Reusable from Month 2 engine

- `text`
- `fretboard`
- `tab`
- Web Audio support from chord/ear labs if available

### Needs text fallback first

- `teacher-note`
- `ear-training-lab`
- `technique-drill`
- `self-check` reflection format
- optional asset marker

### Fallback behavior

- ถ้า `ear-training-lab` ยังไม่มี renderer ให้แสดงเป็น listen-for card พร้อม prompts
- ถ้า audio เล่นไม่ได้ ให้แสดง fallback text และให้ผู้เรียนใช้กีตาร์จริง
- ถ้า `technique-drill` ยังไม่มี renderer ให้แสดงเป็น checklist card
- ถ้า optional flag ยังไม่มี renderer ให้ใส่คำว่า "Optional" ใน title/caption แทน
- ถ้า fretboard visual ยังไม่รองรับ shape labels ให้ใช้ caption และ legend เป็นตัวอธิบาย

## 10. Minimum Viable Launch Content

ถ้าจะสร้าง mock data จริงรอบแรก ต้องมีอย่างน้อย:

1. `m3-w10-intro-arpeggio-not-speed`
2. `m3-w10-teacher-note-slow-alternate-picking`
3. `m3-w10-shape-scope-a-e-only`
4. `m3-w10-chord-quality-ear-lab`
5. `m3-w10-a-shape-c-major-135-map`
6. `m3-w10-e-shape-g-major-135-map`
7. `m3-w10-e-shape-f-major-135-map`
8. `m3-w10-chord-arpeggio-chord-tab`
9. `m3-w10-slow-alternate-picking-135`
10. `m3-w10-self-check`

Optional but useful:

- `m3-w10-a-shape-f-major-135-map`
- `m3-w10-ear-bdim-preview` inside `m3-w10-chord-quality-ear-lab`

## 11. Week 10 Guardrails

- จำกัด shape scope แค่ A-Shape และ E-Shape
- Required: A-Shape C major
- Required: E-Shape G major
- Required: E-Shape F major
- Optional compare only: A-Shape F major
- ห้ามเปิด full CAGED system
- ห้ามใช้ C-Shape, G-Shape, D-Shape
- ห้ามใช้ภาษาแนว speed, shred, sweep หรือโชว์เทคนิค
- ห้ามเพิ่ม 7th chord arpeggios ก่อน Week 11
- ห้ามสอนทุก inversion
- ห้ามทำ diminished เป็น daily drill, required shape หรือ harmony theory
- ห้ามทำให้ผู้เรียนรู้สึกว่าต้องเล่นเร็วถึงจะผ่าน
- ต้องย้ำว่า Arpeggio คือ chord tones in motion เพื่อฟังและมองเห็นคอร์ดชัดขึ้น

## 12. Open Decisions Before Creating Real Data

- จะเก็บ `m3-w10-chord-quality-ear-lab` ไว้ใน root field ชื่อ `earTrainingLabs` ใหม่ หรือรวมใน `chordSoundLabs` แบบ Month 2 engine compatibility
- F A-Shape optional compare ควรแสดงเป็น collapsed optional card หรือแสดงต่อท้ายแบบ muted card
- TAB `m3-w10-chord-arpeggio-chord-tab` ควรแยก C และ F เป็นสองบรรทัดหรือเก็บใน card เดียวเพื่อความกระชับ
- ควรให้ daily progress ของ Month 3 เป็น session-only ก่อน หรือเตรียม key localStorage แยกจาก Month 1/2
- Diminished ear-only preview ควรมีเสียง Web Audio จริงตั้งแต่ mock data รอบแรก หรือใช้ text fallback ก่อน

## 13. Revision Summary

1. Canonical `m3-w10-...` IDs applied across lesson blocks, root-level asset drafts, daily practice refs, minimum viable content, and open decisions.
2. Diminished restored as ear-only preview through `m3-w10-ear-bdim-preview`; no diminished daily drill, required shape, or harmony expansion.
3. Metadata set to 20 minutes with 15-minute core practice plus optional 5-minute listening/reflection.
4. F A-Shape changed to optional comparison/fallback; required shapes are A-Shape C, E-Shape G, and E-Shape F.
5. Production UI remains unchanged.
