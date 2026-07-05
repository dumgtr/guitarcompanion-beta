# Month 2 Week 8: Mock Data Plan (Play by Form Seed & Chord Sound Lab)

เอกสารนี้กำหนดโครงสร้างข้อมูลสำหรับ Prototype ของ Month 2 Week 8 ก่อนลงมือสร้าง UI จริง เป้าหมายคือทดสอบว่า renderer ของ Month 2 รองรับการเชื่อม Root, Octave, Scale Degrees และฟอร์ม I-IV-V-I ได้โดยไม่ทำให้ผู้เรียนรู้สึกว่ากำลังเรียนทฤษฎีหนักเกินไป

## 1. Data Goal

Week 8 คือสัปดาห์สุดท้ายของ Month 2 ผู้เรียนควรเริ่มฟังออกว่าในคีย์ C:

- C (I) = บ้าน
- F (IV) = เปิดออก
- G (V) = ดึงกลับ
- C (I) = กลับบ้าน

ข้อมูลต้องรองรับ 3 อย่างหลัก:

- Fretboard Visual สำหรับปักหมุดตำแหน่ง C, F, G บนคอ
- Chord Sound Lab สำหรับฟังพรีวิวอารมณ์คอร์ดแบบ minimal ear preview
- Mini-TAB สำหรับเล่น Root Pulse C-F-G-C ด้วยกีตาร์จริง

## 2. Month 2 Orientation Rule v2

- **Fretboard Visualizer:** ใช้ TAB-style orientation: String 1 / High e อยู่แถวบนสุด (Row 1) และ String 6 / Low E อยู่แถวล่างสุด (Row 6)
- **Mini-TAB:** คงรูปแบบ TAB มาตรฐาน: String 1 อยู่บรรทัดบน และ String 6 อยู่บรรทัดล่าง
- **IMPORTANT:** The `dot.string` field in data remains strictly semantic (where `string: 1` always means High e, and `string: 6` always means Low E). DO NOT alter the data values of the dots. The renderer engine handles the visual mapping directly (e.g., mapping string 1 to row 1, string 6 to row 6).

ข้อความแนะนำใกล้ Fretboard:

```text
💡 แผนที่คอกีตาร์นี้ใช้มุมมองเดียวกับตาราง TAB: แถวบนสุดคือ สาย 1 (เสียงสูง) และแถวล่างสุดคือ สาย 6 (เสียงเบส)
```

ข้อความแนะนำใกล้ Mini-TAB:

```text
TAB มาตรฐาน: สาย 1 อยู่บรรทัดบน และสาย 6 อยู่บรรทัดล่าง
```

ตัวอย่าง `stringLabels` ที่ renderer ควรวางจากบนลงล่าง:

```json
[
  { "row": 1, "label": "e (สาย 1 แหลม)" },
  { "row": 2, "label": "B" },
  { "row": 3, "label": "G" },
  { "row": 4, "label": "D" },
  { "row": 5, "label": "A" },
  { "row": 6, "label": "E (สาย 6 เบส)" }
]
```

## 3. Dot Configuration Verification

Renderer ต้องใช้ mapping แบบตรงตัว:

```javascript
const gridRow = dot.string;
```

ตัวอย่างการวางตำแหน่งที่ต้องถูกต้อง:

- ใน `w8-c-form-anchors`, C บน String 5 / fret 3 ต้องถูกวาดบน Row 5
- ใน `w8-c-form-anchors`, G บน String 6 / fret 3 ต้องถูกวาดบน Row 6
- ใน `w8-form-maj-min`, F บน String 6 / fret 1 ต้องถูกวาดบน Row 6
- ห้ามแก้ค่า `dot.string` เพื่อให้ภาพถูก ต้องให้ renderer วางตำแหน่งด้วย `gridRow = dot.string`

## 4. Top-level Mock Data Shape

```javascript
const WEEK8_MOCK_DATA = {
  weekMeta: {},
  lessonBlocks: [],
  fretboardVisuals: [],
  chordSoundLabs: [],
  miniTabs: [],
  dailyPractice: [],
  selfCheck: {}
};
```

## 5. `weekMeta`

```json
{
  "week": 8,
  "month": 2,
  "title": "Play by Form Seed + Chord Sound Lab",
  "module": "fretboard",
  "theme": "Fretboard Foundation",
  "estimatedMinutesPerDay": 20,
  "subtitle": "I-IV-V-I: บ้าน / เปิดออก / ดึงกลับ / กลับบ้าน",
  "promise": "ฟังและเล่นฟอร์ม C-F-G-C แบบง่าย เพื่อเข้าใจว่าเพลงมีบ้าน มีทางออก และมีแรงดึงกลับบ้าน"
}
```

## 6. `lessonBlocks`

ใช้ flow แบบค่อย ๆ พาผู้เรียนจากการฟัง ไปสู่การมองแผนที่ แล้วค่อยเล่นจริง

```json
[
  {
    "id": "w8-block-1-form-intro",
    "type": "text",
    "title": "เพลงมีบ้าน ไม่ได้มีแต่คอร์ดสุ่ม",
    "body": "วันนี้เราจะเริ่มฟังเพลงแบบนักดนตรีครับ คอร์ด C ไม่ใช่แค่คอร์ดหนึ่งคอร์ด แต่เป็นบ้านของคีย์นี้ พอเราออกไป F จะรู้สึกเหมือนเปิดประตูออกจากบ้าน และพอไป G จะมีแรงดึงให้กลับมาจบที่ C อีกครั้ง",
    "teacherNote": "ยังไม่ต้องจำศัพท์เยอะ ให้จำความรู้สึกก่อน: บ้าน เปิดออก ดึงกลับ กลับบ้าน"
  },
  {
    "id": "w8-block-2-form-anchors",
    "type": "fretboard",
    "visualRef": "w8-c-form-anchors",
    "instruction": "มอง C, F, G เป็นหมุดหลักของฟอร์มเพลงนี้ก่อน อย่าเพิ่งรีบเล่นเร็ว"
  },
  {
    "id": "w8-block-3-chord-sound-lab",
    "type": "chord-sound-lab",
    "labRef": "w8-chord-sound-lab-c",
    "instruction": "กดฟังทีละคอร์ด แล้วพูดบทบาทออกเสียง: บ้าน / เปิดออก / ดึงกลับ / กลับบ้าน"
  },
  {
    "id": "w8-block-4-root-pulse-tab",
    "type": "tab",
    "tabRef": "w8-tab-cfgc-root-pulse",
    "instruction": "หลังจากฟังคอร์ดแล้ว ให้เล่นแค่ Root ของแต่ละคอร์ดกับ Metronome 60 BPM"
  },
  {
    "id": "w8-block-5-why-v-pulls",
    "type": "text",
    "title": "ทำไม G ถึงอยากกลับไปหา C",
    "body": "คอร์ด G หรือ V มีความรู้สึกเหมือนประโยคที่ยังพูดไม่จบ หูของเราจะอยากได้คำตอบ พอกลับมาที่ C หรือ I สมองจะรู้สึกว่าประโยคจบแล้ว นี่คือแรงดึงกลับบ้านแบบง่ายที่สุด",
    "teacherNote": "ถ้าฟังครั้งแรกยังไม่รู้สึก ไม่เป็นไรครับ ให้เปิด Lab แล้วฟังซ้ำช้า ๆ ความรู้สึกนี้จะชัดขึ้นเมื่อได้ยินหลายรอบ"
  },
  {
    "id": "w8-block-6-mini-application",
    "type": "tab",
    "tabRef": "w8-tab-form-application",
    "instruction": "เล่น Root Pulse แล้วพูดฟอร์มไปด้วย: Home / Away / Pull / Home"
  }
]
```

## 7. `fretboardVisuals`

### 7.1 C Form Anchors

```json
{
  "id": "w8-c-form-anchors",
  "type": "fretboard",
  "title": "C Major Form Anchors",
  "caption": "ปักหมุด C, F, G เป็นจุดเริ่มต้นของการฟังฟอร์ม I-IV-V-I ในคีย์ C",
  "orientationNote": "💡 แผนที่คอกีตาร์นี้ใช้มุมมองเดียวกับตาราง TAB: แถวบนสุดคือ สาย 1 (เสียงสูง) และแถวล่างสุดคือ สาย 6 (เสียงเบส)",
  "stringLabels": [
    { "row": 1, "label": "e (สาย 1 แหลม)" },
    { "row": 2, "label": "B" },
    { "row": 3, "label": "G" },
    { "row": 4, "label": "D" },
    { "row": 5, "label": "A" },
    { "row": 6, "label": "E (สาย 6 เบส)" }
  ],
  "config": {
    "startFret": 1,
    "endFret": 5,
    "showNut": false
  },
  "legend": [
    { "type": "home", "color": "orange", "label": "I / บ้าน" },
    { "type": "away", "color": "gold", "label": "IV / เปิดออก" },
    { "type": "pull", "color": "red", "label": "V / ดึงกลับ" },
    { "type": "return", "color": "green", "label": "I / กลับบ้าน" }
  ],
  "dots": [
    { "string": 5, "fret": 3, "label": "C / I", "type": "home" },
    { "string": 4, "fret": 3, "label": "F / IV", "type": "away" },
    { "string": 6, "fret": 3, "label": "G / V", "type": "pull" },
    { "string": 3, "fret": 5, "label": "C / I", "type": "return" }
  ]
}
```

### 7.2 Form Role Map

```json
{
  "id": "w8-form-maj-min",
  "type": "fretboard",
  "title": "Root Map: C - F - G - C",
  "caption": "ใช้แผนที่นี้เช็กตำแหน่ง Root ก่อนเล่น Root Pulse บนกีตาร์จริง",
  "orientationNote": "💡 แผนที่คอกีตาร์นี้ใช้มุมมองเดียวกับตาราง TAB: แถวบนสุดคือ สาย 1 (เสียงสูง) และแถวล่างสุดคือ สาย 6 (เสียงเบส)",
  "stringLabels": [
    { "row": 1, "label": "e (สาย 1 แหลม)" },
    { "row": 2, "label": "B" },
    { "row": 3, "label": "G" },
    { "row": 4, "label": "D" },
    { "row": 5, "label": "A" },
    { "row": 6, "label": "E (สาย 6 เบส)" }
  ],
  "config": {
    "startFret": 1,
    "endFret": 5,
    "showNut": true
  },
  "legend": [
    { "type": "home", "color": "orange", "label": "C / I" },
    { "type": "away", "color": "gold", "label": "F / IV" },
    { "type": "pull", "color": "red", "label": "G / V" }
  ],
  "dots": [
    { "string": 5, "fret": 3, "label": "C", "type": "home" },
    { "string": 6, "fret": 1, "label": "F", "type": "away" },
    { "string": 4, "fret": 3, "label": "F", "type": "away" },
    { "string": 6, "fret": 3, "label": "G", "type": "pull" }
  ]
}
```

## 8. `chordSoundLabs`

Chord Sound Lab ต้องเป็นเพียง **Ear Preview** แบบเล็ก ๆ ใช้ Web Audio API สร้างเสียง triad ด้วย oscillator พื้นฐาน ห้ามโหลดไฟล์เสียง ห้ามทำ virtual guitar และห้ามสอน triad construction ลึกในสัปดาห์นี้

```json
[
  {
    "id": "w8-chord-sound-lab-c",
    "type": "chord-sound-lab",
    "title": "Chord Sound Lab: I-IV-V-I",
    "key": "C",
    "description": "ฟังการเดินทางของคอร์ด C-F-G-C แล้วจำความรู้สึก บ้าน / เปิดออก / ดึงกลับ / กลับบ้าน",
    "uiCopy": {
      "playSequence": "ฟังทั้งฟอร์ม",
      "stop": "หยุดเสียง",
      "fallback": "ถ้าเสียงไม่ทำงาน ให้อ่านบทบาทของคอร์ด แล้วเล่น Root Pulse บนกีตาร์จริงแทน"
    },
    "audioEngine": {
      "type": "web-audio-oscillator-triad",
      "waveform": "sine",
      "durationMs": 850,
      "gapMs": 160,
      "attackMs": 12,
      "releaseMs": 180,
      "maxGain": 0.12,
      "fallbackToTextOnly": true
    },
    "chords": [
      {
        "id": "w8-chord-i-c",
        "degree": "I",
        "chord": "C",
        "role": "บ้าน",
        "feeling": "นิ่ง / พัก / เริ่มและจบ",
        "notes": ["C4", "E4", "G4"],
        "frequencies": [261.63, 329.63, 392.0]
      },
      {
        "id": "w8-chord-iv-f",
        "degree": "IV",
        "chord": "F",
        "role": "เปิดออก",
        "feeling": "เหมือนเปิดประตูออกจากบ้าน",
        "notes": ["F4", "A4", "C5"],
        "frequencies": [349.23, 440.0, 523.25]
      },
      {
        "id": "w8-chord-v-g",
        "degree": "V",
        "chord": "G",
        "role": "ดึงกลับ",
        "feeling": "มีแรงอยากกลับบ้าน",
        "notes": ["G4", "B4", "D5"],
        "frequencies": [392.0, 493.88, 587.33]
      },
      {
        "id": "w8-chord-i-c-return",
        "degree": "I",
        "chord": "C",
        "role": "กลับบ้าน",
        "feeling": "จบเคลียร์ เหมือนกลับถึงบ้าน",
        "notes": ["C4", "E4", "G4"],
        "frequencies": [261.63, 329.63, 392.0]
      }
    ],
    "sequence": [
      "w8-chord-i-c",
      "w8-chord-iv-f",
      "w8-chord-v-g",
      "w8-chord-i-c-return"
    ],
    "listenFor": [
      "I ให้ความรู้สึกเหมือนจุดพัก",
      "IV ทำให้รู้สึกว่าฟอร์มเริ่มเคลื่อนออกไป",
      "V มีแรงดึงเหมือนประโยคยังไม่จบ",
      "I สุดท้ายทำให้รู้สึกกลับถึงบ้าน"
    ]
  }
]
```

## 9. `miniTabs`

Mini-TAB ต้องคงรูปแบบ TAB มาตรฐาน: สาย 1 / High e อยู่ด้านบน และสาย 6 / Low E อยู่ด้านล่าง

### 9.1 C-F-G-C Root Pulse

```json
{
  "id": "w8-tab-cfgc-root-pulse",
  "type": "tab",
  "title": "C-F-G-C Root Pulse",
  "bpm": 60,
  "orientationNote": "TAB มาตรฐาน: สาย 1 อยู่บรรทัดบน และสาย 6 อยู่บรรทัดล่าง",
  "ascii": [
    "e|-----------------|-----------------|",
    "B|-----------------|-----------------|",
    "G|-----------------|-----------------|",
    "D|-----3-----------|-----------------|",
    "A|-3-----------3---|-----------------|",
    "E|---------3-------|-----------------|"
  ],
  "lyrics": "  C   F   G   C     I   IV  V   I",
  "note": "วิธีซ้อม: เปิด Metronome 60 BPM ดีด Root ทีละตัว แล้วพูดบทบาทออกเสียง บ้าน / เปิดออก / ดึงกลับ / กลับบ้าน"
}
```

### 9.2 Mini Form Application

```json
{
  "id": "w8-tab-form-application",
  "type": "tab",
  "title": "Mini Form Application: Home - Away - Pull - Home",
  "bpm": 60,
  "orientationNote": "TAB มาตรฐาน: สาย 1 อยู่บรรทัดบน และสาย 6 อยู่บรรทัดล่าง",
  "ascii": [
    "e|-----------------|-----------------|",
    "B|-----------------|-----------------|",
    "G|-----------------|-----------------|",
    "D|-----3-----3-----|-----------------|",
    "A|-3-----------3---|-3---------------|",
    "E|---------3-------|-----------------|"
  ],
  "lyrics": "  Home Away Pull Home  Home",
  "note": "ให้เล่นช้าก่อน อย่ารีบทำให้เท่ เป้าคือฟังบทบาทของฟอร์มให้ชัดและพูดชื่ออารมณ์ได้ทันจังหวะ"
}
```

## 10. `dailyPractice`

ใช้ accordion แบบ 7 วันเหมือน prototype Month 2 ก่อนหน้า เพื่อไม่ให้หน้าจอมือถือแน่นเกินไป

```json
[
  {
    "dayLabel": "Day 1-2",
    "focus": "ฟังอารมณ์ I-IV-V-I",
    "isOpen": true,
    "exercises": [
      {
        "id": "m2-w8-d1-p1",
        "duration": "4 นาที",
        "title": "Chord Sound Lab: ฟังทั้งฟอร์ม",
        "instruction": "กดฟัง C-F-G-C แล้วพูดตามทันที: บ้าน / เปิดออก / ดึงกลับ / กลับบ้าน"
      },
      {
        "id": "m2-w8-d1-p2",
        "duration": "3 นาที",
        "title": "แยกฟังคอร์ดทีละตัว",
        "instruction": "กดฟัง C, F, G แยกกัน แล้วถามตัวเองว่าเสียงไหนนิ่ง เสียงไหนเหมือนเปิดออก เสียงไหนเหมือนอยากกลับ"
      }
    ]
  },
  {
    "dayLabel": "Day 3-4",
    "focus": "เล่น Root Pulse C-F-G-C",
    "isOpen": false,
    "exercises": [
      {
        "id": "m2-w8-d3-p1",
        "duration": "5 นาที",
        "title": "Root Pulse ที่ 60 BPM",
        "instruction": "เปิด Metronome 60 BPM เล่น C-F-G-C ด้วย Root notes เท่านั้น ให้เสียงจมกับคลิก"
      },
      {
        "id": "m2-w8-d3-p2",
        "duration": "3 นาที",
        "title": "พูดบทบาทพร้อมดีด",
        "instruction": "ดีดหนึ่งโน้ต แล้วพูดทันทีว่า Home / Away / Pull / Home"
      }
    ]
  },
  {
    "dayLabel": "Day 5",
    "focus": "ฟังแล้วเดาบทบาท",
    "isOpen": false,
    "exercises": [
      {
        "id": "m2-w8-d5-p1",
        "duration": "5 นาที",
        "title": "สุ่มฟังคอร์ดใน Lab",
        "instruction": "ให้กดฟังคอร์ดแบบสุ่ม แล้วเดาว่าเป็นบ้าน เปิดออก หรือดึงกลับ ก่อนดูเฉลยบนการ์ด"
      },
      {
        "id": "m2-w8-d5-p2",
        "duration": "3 นาที",
        "title": "ร้อง Root เบา ๆ",
        "instruction": "หลังฟังคอร์ด ให้ฮัมเสียง Root ของคอร์ดนั้นเบา ๆ เพื่อผูกหูกับตำแหน่งบนคอ"
      }
    ]
  },
  {
    "dayLabel": "Day 6-7",
    "focus": "Mini Form Application",
    "isOpen": false,
    "exercises": [
      {
        "id": "m2-w8-d6-p1",
        "duration": "6 นาที",
        "title": "เล่น Mini Form",
        "instruction": "เล่น Mini-TAB Home-Away-Pull-Home ช้า ๆ แล้วรักษา Pulse ให้มั่นคง"
      },
      {
        "id": "m2-w8-d6-p2",
        "duration": "4 นาที",
        "title": "Self-Check ก่อนจบ Month 2",
        "instruction": "ลองอธิบายด้วยคำพูดของตัวเองว่า C, F, G มีบทบาทต่างกันอย่างไร ถ้าพูดได้ชัด แปลว่าเริ่มเห็นฟอร์มแล้วครับ"
      }
    ]
  }
]
```

## 11. `selfCheck`

```json
{
  "questions": [
    {
      "id": "w8-q1",
      "type": "multiple-choice",
      "prompt": "ในคีย์ C คอร์ด I คือคอร์ดอะไร?",
      "choices": ["C", "F", "G"],
      "answer": "C",
      "feedback": "ถูกต้องครับ C คือบ้านของคีย์นี้"
    },
    {
      "id": "w8-q2",
      "type": "multiple-choice",
      "prompt": "คอร์ด V หรือ G ให้ความรู้สึกหลักแบบไหน?",
      "choices": ["พักนิ่ง", "เปิดออก", "ดึงกลับบ้าน"],
      "answer": "ดึงกลับบ้าน",
      "feedback": "ใช่ครับ V คือแรงดึงที่ทำให้เราอยากกลับไปหา I"
    },
    {
      "id": "w8-q3",
      "type": "practical",
      "prompt": "เล่น Root Pulse C-F-G-C ที่ 60 BPM ได้โดยไม่หลุด Pulse",
      "instruction": "ถ้ายังหลุด ให้ลดเป็น 50 BPM แล้วพูด Home / Away / Pull / Home ไปพร้อมกัน"
    },
    {
      "id": "w8-q4",
      "type": "reflection",
      "prompt": "อธิบายด้วยภาษาของตัวเองว่า Home, Away, Pull, Home ต่างกันอย่างไร",
      "instruction": "ไม่ต้องใช้ศัพท์ทฤษฎี ขอแค่อธิบายความรู้สึกที่ได้ยินจริง"
    }
  ],
  "passCriteria": [
    "ฟัง I-IV-V-I แล้วบอกบทบาท บ้าน / เปิดออก / ดึงกลับ / กลับบ้าน ได้",
    "เล่น Root Pulse C-F-G-C ที่ 60 BPM ได้ชัดและไม่รีบ",
    "พูดบทบาทของคอร์ดไปพร้อมกับการดีดได้",
    "เข้าใจว่า Chord Sound Lab เป็น Ear Preview ไม่ใช่ virtual guitar"
  ],
  "troubleshooting": [
    {
      "problem": "ฟังไม่ออกว่า G ดึงกลับยังไง",
      "advice": "ให้ฟังลำดับ F ไป G แล้วหยุดค้างไว้ 2 วินาที จากนั้นค่อยกด C คุณจะเริ่มรู้สึกว่าประโยคมันจบตอนกลับ C"
    },
    {
      "problem": "เล่น Root Pulse แล้วหลุดจังหวะ",
      "advice": "อย่าเพิ่งมองว่าเป็นคอร์ด ให้มองเป็นโน้ตเดี่ยว 4 จุด เปิด Metronome แล้วดีดให้เสียงลงพร้อมคลิกก่อน"
    },
    {
      "problem": "เสียง Chord Sound Lab ไม่ทำงานบนเครื่อง",
      "advice": "ใช้ fallback text ได้เลย อ่านบทบาทของคอร์ด แล้วเล่น Root notes บนกีตาร์จริงแทน ฟังก์ชันเสียงเป็นแค่ตัวช่วย ไม่ใช่บทเรียนหลัก"
    }
  ],
  "passSummary": "ถ้าคุณฟังออกว่า I คือบ้าน IV คือเปิดออก และ V คือดึงกลับ พร้อมเล่น C-F-G-C ได้ตรง Pulse คุณพร้อมจบ Month 2 แล้วครับ"
}
```

## 12. Renderer Requirements For Future Prototype

- `renderChordSoundLab(lab)` ต้องใช้ Web Audio API แบบง่ายเท่านั้น
- ถ้า browser ไม่รองรับ audio หรือเกิด error ต้อง fallback เป็น visual/text card โดยไม่ทำให้หน้าเว็บพัง
- ปุ่มเสียงต้องไม่ autoplay ต้องเริ่มเมื่อผู้เรียนกดเอง
- Mini-TAB ต้องอยู่ใน scroll area ของตัวเอง ไม่ทำให้ body เกิด horizontal overflow
- Fretboard Visual ต้องใช้ Month 2 Orientation Rule v2 และ map แถวด้วย `gridRow = dot.string`
- Fretboard Visual ต้องมี label ครบ 6 สายตามลำดับ `e, B, G, D, A, E`
- ไม่ต้องใช้ localStorage ใน prototype รอบแรก

## 13. Guardrails

- ห้ามสอน full CAGED
- ห้ามสอน Nashville Number System เต็มระบบ
- ห้ามสอน Triad construction แบบลึก
- ห้ามสร้าง virtual guitar
- ห้ามโหลดไฟล์ MP3/WAV หรือใช้ external network
- Chord Sound Lab เป็นแค่ ear preview เพื่อฟังบทบาท I, IV, V เท่านั้น
- จำกัดบทเรียนไว้ที่ C-F-G-C ในคีย์ C เพื่อให้ Month 2 จบอย่างโฟกัส

## 14. Acceptance Checklist

- ข้อมูลครบสำหรับสร้าง standalone Month 2 Week 8 prototype
- มี `weekMeta`, `lessonBlocks`, `fretboardVisuals`, `chordSoundLabs`, `miniTabs`, `dailyPractice`, และ `selfCheck`
- Chord Sound Lab มี fallback ชัดเจน
- Fretboard ใช้ TAB-style orientation: สาย 1 / High e อยู่ด้านบน และสาย 6 / Low E อยู่ด้านล่าง
- Mini-TAB ยังคงเป็น TAB มาตรฐาน
- ค่า `dot.string` ไม่ถูกแก้เพื่อหลอกตำแหน่ง visual
- Daily Practice เป็น accordion 7-day flow
- Scope ไม่ขยายไป CAGED, Nashville, triad construction หรือ virtual guitar
