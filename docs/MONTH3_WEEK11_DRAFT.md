# Month 3 Week 11 Draft: 7th Chords & Blues Flavor

สถานะ: documentation/mock-data planning only
ห้ามแก้ `outputs/app.js`, `outputs/styles.css`, `outputs/index.html`, `outputs/data.json` จากเอกสารนี้
ห้ามเพิ่ม Month 3 เข้า production UI จนกว่าจะมี launch task แยกต่างหาก

## 1. Week Metadata

| Field | Value |
| --- | --- |
| stable week id | `m3-w11-seventh-chords-blues-flavor` |
| absolute week number | `11` |
| month number | `3` |
| month week index | `3` |
| module label | `Chord Tone & Arpeggio Foundation` |
| title | `7th Chords & Blues Flavor` |
| Thai title | `เติมโน้ตที่ 7 ให้คอร์ดมีรสชาติ` |
| estimated minutes per day | `20` |
| core daily practice | `15 นาที` |
| listening reflection | `+5 นาที` |
| main anchor | `G7` |
| chord qualities | `Major 7`, `Minor 7`, `Dominant 7` |
| technical guardrail | ไม่สอน 9, 11, 13, altered dominants, chord-scale theory, หรือ jazz harmony ขั้นสูง |

## 2. Week Promise

สัปดาห์นี้เราจะเติมโน้ตตัวที่ 7 เข้าไปในโครง 1-3-5 ที่เรียนมาแล้ว เพื่อให้คอร์ดมีสีมากขึ้น ผู้เรียนจะเริ่มฟังออกว่า:

- `Cmaj7` และ `Fmaj7` มีความนุ่ม ละมุน และลอยกว่า major triad
- `Am7` หม่นนุ่มกว่า minor triad ธรรมดา
- `G7` มีแรงดึงกลับบ้าน C ชัดมาก และเป็นประตูสำคัญไปสู่ Blues/Rock/Funk
- `C7` ใช้เป็น preview สั้น ๆ เพื่อให้คุ้นกลิ่น blues แต่ยังไม่ใช่ main practice

ให้จำแบบง่ายก่อน:

> Triad = 1-3-5
> 7th Chord = 1-3-5-7 หรือ 1-3-5-b7

## 3. Scope Lock

### 3.1 Allowed Technical Scope

Week 11 จำกัดอยู่แค่สูตรและเสียงเหล่านี้:

- **Major 7:** `1-3-5-7`
  - Main examples: `Cmaj7`, `Fmaj7`
- **Minor 7:** `1-b3-5-b7`
  - Main example: `Am7`
- **Dominant 7:** `1-3-5-b7`
  - Main anchor: `G7`
  - Brief contrast preview: `C7`

### 3.2 Explicitly Not Taught Yet

- ไม่สอน 9, 11, 13
- ไม่สอน altered dominants
- ไม่สอน secondary dominants
- ไม่สอน chord-scale theory
- ไม่สอน jazz substitutions
- ไม่สอนทุก inversion ของ 7th chords
- ไม่เปลี่ยนบทนี้เป็น speed arpeggio lesson
- ไม่ทำ C7 เป็นบท blues เต็มรูปแบบ แค่ preview กลิ่น blues เท่านั้น

## 4. Root-to-Seventh Connection

นี่คือกุญแจที่ทำให้ 7th chord ไม่ต้องท่องจำแบบสุ่ม:

ถ้าคุณรู้ตำแหน่ง Root แล้ว ให้มองย้อนกลับบนสายเดียวกัน:

- ถอยจาก Root ลงมา **1 fret** = `Major 7`
- ถอยจาก Root ลงมา **2 frets** = `b7` หรือเสียงที่ใช้ใน `Dominant 7` และ `Minor 7`

ตัวอย่างที่เชื่อมกับ Month 2 Landmarks:

- Root `C` บนสาย 5 เฟรต 3
  - เฟรต 2 = `B` = Major 7 ของ C
  - เฟรต 1 = `Bb` = b7 ของ C ใช้ใน C7
- Root `G` บนสาย 6 เฟรต 3
  - เฟรต 2 = `F#` = Major 7 ของ G
  - เฟรต 1 = `F` = b7 ของ G ใช้ใน G7
- Root `A` บนสาย 5 เฟรต 0 หรือเฟรต 12
  - ถอย 2 frets จาก A จะได้ `G` = b7 ของ Am7

ไม่ต้องจำคอทั้งคอในวันนี้ครับ ใช้ Landmark ที่เรารู้แล้วจาก Month 2 เป็นหลักหมุด แล้วถามว่า "ถอย 1 หรือถอย 2 fret จากบ้าน จะได้สีแบบไหน?"

## 5. Universal Renderer Block Structure

```json
{
  "week": 11,
  "number": 11,
  "month": 3,
  "module": "Chord Tone & Arpeggio Foundation",
  "title": "7th Chords & Blues Flavor",
  "summary": "เติมโน้ตที่ 7 เข้าไปใน 1-3-5 เพื่อฟังสี Maj7, m7 และ Dom7 โดยใช้ G7 เป็น anchor หลัก",
  "estimatedMinutesPerDay": 20,
  "lessonBlocks": [
    { "type": "text", "id": "m3-w11-intro-7th-flavors" },
    { "type": "teacher-note", "id": "m3-w11-teacher-note-coffee-flavor" },
    { "type": "ear-training-lab", "labRef": "m3-w11-ear-7th-comparison" },
    { "type": "teacher-note", "id": "m3-w11-root-to-seventh-concept" },
    { "type": "chord-tone-overlay", "overlayRef": "m3-w11-seventh-chord-formulas-overlay" },
    { "type": "fretboard", "visualRef": "m3-w11-cmaj7-open-map" },
    { "type": "fretboard", "visualRef": "m3-w11-am7-open-map" },
    { "type": "fretboard", "visualRef": "m3-w11-fmaj7-comfort-map" },
    { "type": "fretboard", "visualRef": "m3-w11-g7-anchor-map" },
    { "type": "tab", "tabRef": "m3-w11-smooth-progression-tab" },
    { "type": "mechanics-check", "checkRef": "m3-w11-clean-fretting-check" },
    { "type": "self-check", "id": "m3-w11-self-check" }
  ]
}
```

## 6. Lesson Blocks Draft

### Block 1: `text`

```json
{
  "type": "text",
  "id": "m3-w11-intro-7th-flavors",
  "title": "เติมรสชาติให้ Triad ด้วยโน้ตตัวที่ 7",
  "body": [
    "สัปดาห์ที่แล้วเราเล่น 1-3-5 เป็น Arpeggio ช้า ๆ กันไปแล้ว วันนี้เราจะเติมโน้ตอีกหนึ่งตัวเข้าไป คือโน้ตตัวที่ 7",
    "ถ้า Triad เป็นกาแฟดำพื้นฐาน โน้ตตัวที่ 7 คือ flavor ที่ทำให้กาแฟแก้วนั้นมีบุคลิกเฉพาะขึ้น Cmaj7 จะนุ่มและลอยกว่า C, Am7 จะหม่นนุ่มกว่า Am, ส่วน G7 จะมีแรงดึงเหมือนยังอยากกลับบ้าน",
    "บทนี้เราไม่ได้เข้าสู่ jazz theory หนัก ๆ ครับ แค่ให้หูเริ่มแยกรสชาติของ Maj7, m7 และ Dom7 ได้ และให้มือเห็นว่าโน้ตตัวที่ 7 อยู่ใกล้ Root กว่าที่คิด"
  ],
  "listenFor": [
    "Maj7 ให้ความรู้สึกนุ่ม ลอย และละมุน",
    "m7 ให้ความรู้สึกหม่นแต่นุ่มกว่า minor triad",
    "Dom7 โดยเฉพาะ G7 มีแรงดึงกลับไปหา C",
    "C7 ให้กลิ่น blues preview แต่ยังไม่ใช่บทฝึกหลัก"
  ],
  "feel": [
    "เล่นช้าพอให้ได้ยินโน้ตตัวที่ 7 ชัด",
    "นิ้วไม่ควรบีบจนเสียง open หรือ fretted strings ข้าง ๆ บอด",
    "คิดว่าเติมโน้ตหนึ่งตัวเข้าไปในคอร์ดเดิม ไม่ใช่เรียนระบบใหม่ทั้งก้อน"
  ]
}
```

### Block 2: `teacher-note`

```json
{
  "type": "teacher-note",
  "id": "m3-w11-teacher-note-coffee-flavor",
  "title": "ครูแนะนำ: Triad คือกาแฟดำ 7th คือ flavor",
  "body": "ให้คิดว่า Triad เป็นกาแฟดำแก้วพื้นฐานครับ พอเติมโน้ตตัวที่ 7 เข้าไป เราไม่ได้เปลี่ยนมันเป็นเครื่องดื่มทั้งร้าน แค่เพิ่ม flavor เฉพาะให้คอร์ดเดิม: Cmaj7 นุ่มและลอยขึ้น, Am7 หม่นแต่นุ่มขึ้น, G7 เข้มและค้างรสจนอยากกลับบ้าน C ส่วน C7 แค่ preview กลิ่น blues แบบดิบขึ้นนิดหนึ่ง"
}
```

### Block 3: `ear-training-lab`

```json
{
  "type": "ear-training-lab",
  "id": "m3-w11-ear-7th-comparison",
  "title": "ฟัง Triad เทียบกับ 7th Chords",
  "skill": "chord quality hearing",
  "audioMode": "web-audio-optional",
  "listenFor": [
    "C เทียบ Cmaj7: Cmaj7 จะนุ่มและลอยกว่า",
    "Am เทียบ Am7: Am7 จะเปิดและนุ่มกว่า Am",
    "G เทียบ G7: G7 จะมีแรงดึงกลับ C ชัดขึ้น",
    "C7 เป็น blues preview: ฟังความดิบและ tension เท่านั้น ยังไม่ต้องฝึกเต็มระบบ"
  ],
  "prompts": [
    {
      "id": "m3-w11-ear-c-vs-cmaj7",
      "label": "C vs Cmaj7",
      "triad": { "notes": ["C", "E", "G"], "quality": "major" },
      "seventh": { "notes": ["C", "E", "G", "B"], "quality": "major7" },
      "answer": "Cmaj7 นุ่มและลอยกว่า C"
    },
    {
      "id": "m3-w11-ear-am-vs-am7",
      "label": "Am vs Am7",
      "triad": { "notes": ["A", "C", "E"], "quality": "minor" },
      "seventh": { "notes": ["A", "C", "E", "G"], "quality": "minor7" },
      "answer": "Am7 หม่นแต่นุ่มกว่า Am"
    },
    {
      "id": "m3-w11-ear-g-vs-g7",
      "label": "G vs G7",
      "triad": { "notes": ["G", "B", "D"], "quality": "major" },
      "seventh": { "notes": ["G", "B", "D", "F"], "quality": "dominant7" },
      "answer": "G7 มีแรงดึงกลับ C"
    },
    {
      "id": "m3-w11-ear-c7-preview",
      "label": "C7 blues preview",
      "notes": ["C", "E", "G", "Bb"],
      "quality": "dominant7",
      "answer": "C7 มีความดิบและ blues มากกว่า C",
      "note": "ใช้เป็น preview เท่านั้น ไม่ขยายเป็น blues harmony lesson"
    }
  ],
  "fallbackText": "ถ้า audio ไม่ทำงาน ให้เล่นคอร์ดจริงบนกีตาร์หรือเปียโน แล้วจดคำที่หูรู้สึก เช่น นุ่ม ลอย หม่น ดึงกลับ หรือ blues"
}
```

Teacher copy:

ให้ฟังแบบไม่รีบตอบครับ เราไม่ได้ต้องการคะแนน quiz เราต้องการให้หูเริ่มจำรสชาติของคอร์ด ถ้า G7 ฟังแล้วเหมือนยังค้างและอยากกลับไป C แปลว่าหูเริ่มจับ Dom7 ได้แล้ว

### Block 4: `teacher-note`

```json
{
  "type": "teacher-note",
  "id": "m3-w11-root-to-seventh-concept",
  "title": "ครูแนะนำ: ถอยจาก Root เพื่อหา 7th",
  "body": "จำกฎนี้ไว้ก่อนครับ ถ้าเรารู้ Root แล้ว ถอยกลับ 1 fret จะได้ Major 7 และถอยกลับ 2 frets จะได้ b7 หรือเสียง Dom7/m7 ที่ดึงมากขึ้น เช่น C อยู่สาย 5 เฟรต 3 ถอยไปเฟรต 2 คือ B เป็น 7 ของ Cmaj7 ถอยไปเฟรต 1 คือ Bb เป็น b7 ของ C7 ส่วน G อยู่สาย 6 เฟรต 3 ถอยไปเฟรต 1 คือ F เป็น b7 ของ G7 นี่คือเหตุผลที่ Month 2 เรื่อง Root Landmarks สำคัญมาก"
}
```

### Block 5: `chord-tone-overlay`

```json
{
  "type": "chord-tone-overlay",
  "id": "m3-w11-seventh-chord-formulas-overlay",
  "title": "สูตร 1-3-5-7 ที่ใช้ใน Week 11",
  "chords": [
    {
      "chord": "Cmaj7",
      "quality": "Major 7",
      "formula": "1-3-5-7",
      "notes": ["C", "E", "G", "B"],
      "feel": "นุ่ม ลอย ละมุน"
    },
    {
      "chord": "Fmaj7",
      "quality": "Major 7",
      "formula": "1-3-5-7",
      "notes": ["F", "A", "C", "E"],
      "feel": "เปิด กว้าง นุ่ม"
    },
    {
      "chord": "Am7",
      "quality": "Minor 7",
      "formula": "1-b3-5-b7",
      "notes": ["A", "C", "E", "G"],
      "feel": "หม่น แต่นุ่ม"
    },
    {
      "chord": "G7",
      "quality": "Dominant 7",
      "formula": "1-3-5-b7",
      "notes": ["G", "B", "D", "F"],
      "feel": "ดึงกลับบ้าน C"
    },
    {
      "chord": "C7",
      "quality": "Dominant 7 preview",
      "formula": "1-3-5-b7",
      "notes": ["C", "E", "G", "Bb"],
      "feel": "blues preview / ดิบขึ้น",
      "optional": true
    }
  ],
  "guardrail": "Do not add 9, 11, 13, altered dominants, or chord-scale theory."
}
```

### Block 6: `fretboard` stacked visual group

```json
[
  { "type": "fretboard", "visualRef": "m3-w11-cmaj7-open-map" },
  { "type": "fretboard", "visualRef": "m3-w11-am7-open-map" },
  { "type": "fretboard", "visualRef": "m3-w11-fmaj7-comfort-map" },
  { "type": "fretboard", "visualRef": "m3-w11-g7-anchor-map" }
]
```

Teacher copy:

ดูแผนที่ทั้ง 4 ใบเป็น stacked vertical cards ครับ ทีละใบ ทีละคอร์ด ไม่ต้องจำทุกตำแหน่งพร้อมกัน ให้โฟกัสว่า 7th เพิ่มเข้ามาตรงไหน และมันสัมพันธ์กับ Root อย่างไร โดยเฉพาะ G7 ให้จำว่า F คือ b7 ของ G และเป็นตัวที่ทำให้คอร์ดอยากกลับไป C

### Block 7: `tab`

```json
{
  "type": "tab",
  "tabRef": "m3-w11-smooth-progression-tab"
}
```

Teacher copy:

TAB นี้ให้เล่นช้า ๆ เพื่อฟังการไหลของ harmony: Cmaj7 -> Am7 -> Fmaj7 -> G7 เราไม่ได้เล่นเพื่อเร็ว แต่เล่นเพื่อรู้สึกว่าโน้ตตัวเล็ก ๆ ในคอร์ดขยับเข้าหากันอย่างนุ่มขึ้น นี่คือรสแรกของ voice leading ที่จะชัดขึ้นใน Week 12

### Block 8: `mechanics-check`

```json
{
  "type": "mechanics-check",
  "id": "m3-w11-clean-fretting-check",
  "title": "เช็กเสียงก่อนเติมโน้ตที่ 7",
  "when": "ก่อนเล่น 7th chord หรือ 7th arpeggio ทุกครั้ง",
  "checks": [
    "นิ้วที่เพิ่ม 7th ไม่ไปแตะสายข้าง ๆ จนเสียงบอด",
    "open strings ที่ควรดังยังดังชัด",
    "เสียง fretted notes ไม่บอดเพราะกดไกล fret",
    "มือซ้ายไม่บีบแรงขึ้นเพียงเพราะคอร์ดมีโน้ตเพิ่ม",
    "เล่นช้าพอให้ได้ยินโน้ตตัวที่ 7 จริง ๆ"
  ],
  "warningSigns": [
    "เพิ่ม 7th แล้วสายเปิดหาย",
    "G7 ฟังไม่ต่างจาก G เพราะไม่ได้ยิน F",
    "รีบไล่ arpeggio จนหูไม่ทันฟังสีของคอร์ด"
  ],
  "fixes": [
    "ลด BPM เหลือ 50-55",
    "เล่น triad เดิมก่อน แล้วค่อยเติม 7th เป็นโน้ตที่ 4",
    "แยกดีดเฉพาะโน้ต 7th เพื่อฟังว่าสายดังชัดไหม"
  ]
}
```

### Block 9: `self-check`

```json
{
  "type": "self-check",
  "id": "m3-w11-self-check",
  "title": "เช็กว่าฟังและหา 7th ได้จริงไหม",
  "questions": [
    {
      "id": "m3-w11-reflect-root-to-seventh",
      "type": "reflection",
      "prompt": "ถ้าคุณรู้ว่า Root G อยู่สาย 6 เฟรต 3 คุณหา b7 ของ G7 ได้อย่างไร?",
      "expectedReflection": "ถอยลง 2 frets จาก G จะได้ F ซึ่งเป็น b7 ของ G7"
    },
    {
      "id": "m3-w11-reflect-hear-g7-pull",
      "type": "reflection",
      "prompt": "ตอนฟัง G7 -> C คุณรู้สึกถึงแรงดึงกลับบ้านไหม และเสียงไหนทำให้ความรู้สึกนั้นชัดขึ้น?",
      "expectedReflection": "ควรอธิบายได้ว่า F หรือ b7 ใน G7 ทำให้เกิดแรงดึงกลับไป C"
    }
  ],
  "passCriteria": [
    "บอกสูตร Maj7, m7 และ Dom7 ได้",
    "หา Major 7 หรือ b7 จาก Root ด้วยการถอย 1 หรือ 2 frets ได้ในตัวอย่าง C หรือ G",
    "เล่น progression Cmaj7 - Am7 - Fmaj7 - G7 ช้า ๆ ได้โดยเสียงไม่บอด",
    "ฟัง G7 แล้วรับรู้แรงดึงกลับ C ได้"
  ]
}
```

## 7. Required Root-Level Assets Draft

### 7.1 `chordSoundLabs`

Implementation note: `m3-w11-ear-7th-comparison` ต้องถูกเก็บใน root-level `chordSoundLabs` collection เพื่อ reuse เส้นทาง Web Audio API เดิมจาก Month 2 แต่ตัว asset ยังประกาศ `type: "ear-training-lab"` เพื่อให้ renderer แยก UI เป็น ear comparison ได้ชัดเจน

```json
[
  {
    "id": "m3-w11-ear-7th-comparison",
    "type": "ear-training-lab",
    "title": "Triads vs 7th Qualities",
    "audioMode": "web-audio-optional",
    "prompts": [
      {
        "id": "m3-w11-ear-c-vs-cmaj7",
        "label": "C vs Cmaj7",
        "triad": ["C", "E", "G"],
        "seventh": ["C", "E", "G", "B"],
        "listenFor": "Cmaj7 นุ่มและลอยกว่า C"
      },
      {
        "id": "m3-w11-ear-am-vs-am7",
        "label": "Am vs Am7",
        "triad": ["A", "C", "E"],
        "seventh": ["A", "C", "E", "G"],
        "listenFor": "Am7 หม่นแต่นุ่มกว่า Am"
      },
      {
        "id": "m3-w11-ear-g-vs-g7",
        "label": "G vs G7",
        "triad": ["G", "B", "D"],
        "seventh": ["G", "B", "D", "F"],
        "listenFor": "G7 ดึงกลับ C ชัดกว่า G"
      },
      {
        "id": "m3-w11-ear-c7-preview",
        "label": "C7 blues preview",
        "seventh": ["C", "E", "G", "Bb"],
        "listenFor": "C7 ดิบและมี blues flavor",
        "optional": true
      }
    ],
    "fallbackText": "ถ้า Web Audio ไม่ทำงาน ให้เล่นคอร์ดจริงและจดคำที่หูรู้สึกแทน"
  }
]
```

### 7.2 `fretboardVisuals`

```json
[
  {
    "id": "m3-w11-cmaj7-open-map",
    "type": "fretboard",
    "title": "Cmaj7 Open Form",
    "caption": "Cmaj7 ใช้ C-E-G-B โดย B คือ Major 7 ที่ทำให้คอร์ดนุ่มและลอยขึ้น",
    "formula": "1-3-5-7",
    "notes": ["C", "E", "G", "B"],
    "config": { "startFret": 0, "endFret": 4, "showNut": true },
    "orientationNote": "แผนที่คอกีตาร์ใช้ TAB-style orientation: สาย 1 / High e อยู่ด้านบน และสาย 6 / Low E อยู่ด้านล่าง",
    "layout": {
      "group": "m3-w11-7th-map-stack",
      "arrangement": "stacked-vertical",
      "order": 1,
      "mobile": "full-width-card"
    },
    "dots": [
      { "string": 5, "fret": 3, "label": "1", "note": "C", "type": "root" },
      { "string": 4, "fret": 2, "label": "3", "note": "E", "type": "third" },
      { "string": 3, "fret": 0, "label": "5", "note": "G", "type": "fifth" },
      { "string": 2, "fret": 0, "label": "7", "note": "B", "type": "seventh" }
    ],
    "legend": [
      { "type": "root", "label": "1 / Root" },
      { "type": "third", "label": "3 หรือ b3" },
      { "type": "fifth", "label": "5" },
      { "type": "seventh", "label": "7 หรือ b7" }
    ]
  },
  {
    "id": "m3-w11-am7-open-map",
    "type": "fretboard",
    "title": "Am7 Open Form",
    "caption": "Am7 ใช้ A-C-E-G โดย G คือ b7 ที่ทำให้ Am เปิดและนุ่มขึ้น",
    "formula": "1-b3-5-b7",
    "notes": ["A", "C", "E", "G"],
    "config": { "startFret": 0, "endFret": 4, "showNut": true },
    "layout": {
      "group": "m3-w11-7th-map-stack",
      "arrangement": "stacked-vertical",
      "order": 2,
      "mobile": "full-width-card"
    },
    "dots": [
      { "string": 5, "fret": 0, "label": "1", "note": "A", "type": "root" },
      { "string": 4, "fret": 2, "label": "5", "note": "E", "type": "fifth" },
      { "string": 3, "fret": 0, "label": "b7", "note": "G", "type": "seventh" },
      { "string": 2, "fret": 1, "label": "b3", "note": "C", "type": "third" }
    ],
    "legend": [
      { "type": "root", "label": "1 / Root" },
      { "type": "third", "label": "b3" },
      { "type": "fifth", "label": "5" },
      { "type": "seventh", "label": "b7" }
    ]
  },
  {
    "id": "m3-w11-fmaj7-comfort-map",
    "type": "fretboard",
    "title": "Fmaj7 Comfortable Shape",
    "caption": "Fmaj7 ใช้ F-A-C-E โดย open E เป็น Major 7 ของ F",
    "formula": "1-3-5-7",
    "notes": ["F", "A", "C", "E"],
    "config": { "startFret": 0, "endFret": 4, "showNut": true },
    "layout": {
      "group": "m3-w11-7th-map-stack",
      "arrangement": "stacked-vertical",
      "order": 3,
      "mobile": "full-width-card"
    },
    "dots": [
      { "string": 4, "fret": 3, "label": "1", "note": "F", "type": "root" },
      { "string": 3, "fret": 2, "label": "3", "note": "A", "type": "third" },
      { "string": 2, "fret": 1, "label": "5", "note": "C", "type": "fifth" },
      { "string": 1, "fret": 0, "label": "7", "note": "E", "type": "seventh" }
    ],
    "legend": [
      { "type": "root", "label": "1 / Root" },
      { "type": "third", "label": "3" },
      { "type": "fifth", "label": "5" },
      { "type": "seventh", "label": "7" }
    ]
  },
  {
    "id": "m3-w11-g7-anchor-map",
    "type": "fretboard",
    "title": "G7 Anchor Shape",
    "caption": "G7 ใช้ G-B-D-F โดย F คือ b7 ที่สร้างแรงดึงกลับ C",
    "formula": "1-3-5-b7",
    "notes": ["G", "B", "D", "F"],
    "config": { "startFret": 0, "endFret": 4, "showNut": true },
    "layout": {
      "group": "m3-w11-7th-map-stack",
      "arrangement": "stacked-vertical",
      "order": 4,
      "mobile": "full-width-card"
    },
    "dots": [
      { "string": 6, "fret": 3, "label": "1", "note": "G", "type": "root" },
      { "string": 5, "fret": 2, "label": "3", "note": "B", "type": "third" },
      { "string": 4, "fret": 0, "label": "5", "note": "D", "type": "fifth" },
      { "string": 1, "fret": 1, "label": "b7", "note": "F", "type": "seventh" }
    ],
    "landmarkTip": "Root G สาย 6 เฟรต 3 ถอยไปเฟรต 1 คือ F หรือ b7 ของ G7",
    "legend": [
      { "type": "root", "label": "1 / Root" },
      { "type": "third", "label": "3" },
      { "type": "fifth", "label": "5" },
      { "type": "seventh", "label": "b7" }
    ]
  }
]
```

### 7.3 `miniTabs`

```json
[
  {
    "id": "m3-w11-smooth-progression-tab",
    "type": "tab",
    "title": "Cmaj7 - Am7 - Fmaj7 - G7 Smooth Cycle",
    "bpm": 55,
    "ascii": [
      "e|--0-----------0-----------0-----------1-----------|",
      "B|--0-----------1-----------1-----------0-----------|",
      "G|--0-----------0-----------2-----------0-----------|",
      "D|--2-----------2-----------3-----------0-----------|",
      "A|--3-----------0-----------3-----------2-----------|",
      "E|--------------------------------------3-----------|"
    ],
    "lyrics": "   Cmaj7       Am7         Fmaj7       G7",
    "degreeLine": "   1-3-5-7     1-b3-5-b7   1-3-5-7     1-3-5-b7",
    "note": "เล่นเป็น block chord ช้า ๆ ก่อน แล้วค่อยแยกดีดทีละสายเพื่อฟัง voice leading"
  }
]
```

Mobile note: TAB ต้อง scroll ภายใน card เท่านั้น ห้ามทำให้ body เกิด horizontal overflow

### 7.4 `mechanicsChecks`

```json
[
  {
    "id": "m3-w11-clean-fretting-check",
    "type": "mechanics-check",
    "title": "Clean Fretting เมื่อเพิ่ม 7th",
    "checks": [
      "โน้ต 7th ดังชัด",
      "สายเปิดที่ต้องดังไม่ถูกนิ้วบัง",
      "ไม่มีการบีบมือซ้ายเกินจำเป็น",
      "เล่นช้าพอให้ได้ยินสีของคอร์ด"
    ]
  }
]
```

## 8. Structured Daily Practice: 15-Minute Core + 5-Minute Listening Reflection

```json
[
  {
    "dayLabel": "Day 1-2",
    "focus": "Maj7 color: Cmaj7 และ Fmaj7",
    "isOpen": true,
    "totalDuration": "20 นาที",
    "coreDuration": "15 นาที",
    "reflectionDuration": "5 นาที",
    "exercises": [
      {
        "id": "m3-w11-d1-p1",
        "duration": "4 นาที",
        "title": "C -> Cmaj7",
        "instruction": "เล่น C triad แล้วเติม B เป็น 7 ฟังว่าสีคอร์ดนุ่มและลอยขึ้นอย่างไร"
      },
      {
        "id": "m3-w11-d1-p2",
        "duration": "4 นาที",
        "title": "F -> Fmaj7",
        "instruction": "เล่น Fmaj7 แบบ comfortable shape แล้วฟัง open E เป็น Major 7 ของ F"
      },
      {
        "id": "m3-w11-d1-p3",
        "duration": "4 นาที",
        "title": "Slow arpeggio 1-3-5-7",
        "instruction": "แยกดีด Cmaj7 ทีละโน้ตและพูด 1-3-5-7 ให้ตรงกับเสียง"
      },
      {
        "id": "m3-w11-d1-p4",
        "duration": "3 นาที",
        "title": "Clean fretting check",
        "instruction": "ใช้ `m3-w11-clean-fretting-check` เช็กว่าสายเปิดและโน้ต 7th ไม่บอด"
      }
    ],
    "reflection": {
      "duration": "5 นาที",
      "title": "ฟัง C เทียบ Cmaj7",
      "instruction": "ฟัง `m3-w11-ear-c-vs-cmaj7` แล้วเขียน 1 คำที่อธิบาย Cmaj7 เช่น นุ่ม ลอย หรือหวาน"
    }
  },
  {
    "dayLabel": "Day 3-4",
    "focus": "Minor 7 color: Am7",
    "isOpen": false,
    "totalDuration": "20 นาที",
    "coreDuration": "15 นาที",
    "reflectionDuration": "5 นาที",
    "exercises": [
      {
        "id": "m3-w11-d3-p1",
        "duration": "4 นาที",
        "title": "Am -> Am7",
        "instruction": "เล่น Am แล้วปล่อย G เป็น b7 เพื่อฟังว่า Am7 นุ่มและเปิดขึ้นอย่างไร"
      },
      {
        "id": "m3-w11-d3-p2",
        "duration": "4 นาที",
        "title": "Am7 arpeggio",
        "instruction": "เล่น A-C-E-G ช้า ๆ แล้วพูด 1-b3-5-b7"
      },
      {
        "id": "m3-w11-d3-p3",
        "duration": "4 นาที",
        "title": "Root-to-b7",
        "instruction": "หา A เป็น Root แล้วอธิบายว่า G คือ b7 ของ Am7"
      },
      {
        "id": "m3-w11-d3-p4",
        "duration": "3 นาที",
        "title": "Compare feel",
        "instruction": "เล่น Am และ Am7 สลับกัน ไม่ต้องเร็ว แค่ฟังสีที่เปลี่ยน"
      }
    ],
    "reflection": {
      "duration": "5 นาที",
      "title": "ฟัง Am เทียบ Am7",
      "instruction": "ฟัง `m3-w11-ear-am-vs-am7` แล้วจดว่า Am7 หม่นแบบแข็งหรือหม่นแบบนุ่ม"
    }
  },
  {
    "dayLabel": "Day 5",
    "focus": "Dominant 7 anchor: G7",
    "isOpen": false,
    "totalDuration": "20 นาที",
    "coreDuration": "15 นาที",
    "reflectionDuration": "5 นาที",
    "exercises": [
      {
        "id": "m3-w11-d5-p1",
        "duration": "4 นาที",
        "title": "G -> G7",
        "instruction": "เล่น G แล้ว G7 ฟังว่า F หรือ b7 ทำให้คอร์ดอยากกลับ C มากขึ้นอย่างไร"
      },
      {
        "id": "m3-w11-d5-p2",
        "duration": "4 นาที",
        "title": "Root-to-b7 on G",
        "instruction": "ชี้ G สาย 6 เฟรต 3 แล้วถอยไป F สาย 6 เฟรต 1 เพื่อเห็น b7 ของ G7"
      },
      {
        "id": "m3-w11-d5-p3",
        "duration": "4 นาที",
        "title": "G7 arpeggio slow",
        "instruction": "เล่น G-B-D-F ช้า ๆ แล้วพูด 1-3-5-b7"
      },
      {
        "id": "m3-w11-d5-p4",
        "duration": "3 นาที",
        "title": "Resolve G7 -> C",
        "instruction": "เล่น G7 แล้วกลับ C เพื่อฟังแรงดึงกลับบ้าน"
      }
    ],
    "reflection": {
      "duration": "5 นาที",
      "title": "ฟัง G7 pull",
      "instruction": "ฟัง `m3-w11-ear-g-vs-g7` แล้วเขียนว่า G7 ทำให้คุณอยากกลับไปคอร์ดไหน"
    }
  },
  {
    "dayLabel": "Day 6-7",
    "focus": "Smooth progression + C7 blues preview",
    "isOpen": false,
    "totalDuration": "20 นาที",
    "coreDuration": "15 นาที",
    "reflectionDuration": "5 นาที",
    "exercises": [
      {
        "id": "m3-w11-d6-p1",
        "duration": "5 นาที",
        "title": "Smooth cycle",
        "instruction": "เล่น `m3-w11-smooth-progression-tab` ช้า ๆ: Cmaj7 - Am7 - Fmaj7 - G7"
      },
      {
        "id": "m3-w11-d6-p2",
        "duration": "4 นาที",
        "title": "Arpeggio one chord at a time",
        "instruction": "เลือกทีละคอร์ดแล้วดีด 1-3-5-7 หรือ 1-3-5-b7 ช้า ๆ"
      },
      {
        "id": "m3-w11-d6-p3",
        "duration": "3 นาที",
        "title": "C7 preview",
        "instruction": "ฟัง C7 แค่เป็น blues preview ห้ามขยายเป็นบท blues เต็ม"
      },
      {
        "id": "m3-w11-d6-p4",
        "duration": "3 นาที",
        "title": "Self-check",
        "instruction": "ตอบคำถามสะท้อนตัวเอง 2 ข้อด้านล่าง"
      }
    ],
    "reflection": {
      "duration": "5 นาที",
      "title": "C7 vs Cmaj7 feel",
      "instruction": "ฟัง Cmaj7 และ C7 แล้วจดคำต่างกัน 1 คู่ เช่น ลอย/ดิบ หรือ นุ่ม/ตึง"
    }
  }
]
```

## 9. Reflective Self-Check

```json
{
  "id": "m3-w11-self-check",
  "type": "self-check",
  "title": "2 คำถามก่อนขึ้น Week 12",
  "questions": [
    {
      "id": "m3-w11-q1-root-to-seventh",
      "type": "reflection",
      "prompt": "ถ้า Root C อยู่สาย 5 เฟรต 3 คุณหา Major 7 และ b7 ของ C ได้อย่างไร?",
      "expectedReflection": "ถอย 1 fret ได้ B ซึ่งเป็น Major 7; ถอย 2 frets ได้ Bb ซึ่งเป็น b7"
    },
    {
      "id": "m3-w11-q2-g7-resolution",
      "type": "reflection",
      "prompt": "G7 ต่างจาก G อย่างไรในหูของคุณ และมันอยากพาไปหา C เพราะอะไร?",
      "expectedReflection": "G7 มี F หรือ b7 ที่สร้างแรงดึงกลับไป C"
    }
  ],
  "passCriteria": [
    "บอกสูตร Cmaj7, Fmaj7, Am7 และ G7 ได้",
    "อธิบายการถอย 1 fret / 2 frets จาก Root ได้",
    "เล่น Cmaj7 - Am7 - Fmaj7 - G7 ช้า ๆ ได้โดยไม่ mute สายสำคัญ",
    "ฟัง G7 -> C แล้วรับรู้ resolution ได้"
  ]
}
```

## 10. Renderer Dependency Analysis

### Reusable from Month 2 engine

- `text`
- `fretboard`
- `tab`
- Web Audio support from chord/ear labs if available

### Needs text fallback first

- `ear-training-lab`
- `teacher-note`
- `chord-tone-overlay`
- `mechanics-check`
- `self-check` reflection format
- stacked vertical fretboard group rendering from individual `fretboard` assets

### Fallback behavior

- ถ้า `ear-training-lab` ยังไม่มี renderer ให้แสดงเป็น listen-for card พร้อม prompts
- ถ้า audio เล่นไม่ได้ ให้ใช้ `fallbackText` และให้ผู้เรียนเล่นด้วยกีตาร์จริง
- แสดง `m3-w11-cmaj7-open-map`, `m3-w11-am7-open-map`, `m3-w11-fmaj7-comfort-map`, และ `m3-w11-g7-anchor-map` เป็น stacked cards ตาม `layout.order`
- ถ้า `chord-tone-overlay` ยังไม่มี renderer ให้แสดงสูตรเป็น list/table
- ถ้า `mechanics-check` ยังไม่มี renderer ให้แสดงเป็น checklist card

## 11. Minimum Viable Launch Content

ถ้าจะสร้าง mock data จริงรอบแรก ต้องมีอย่างน้อย:

1. `m3-w11-intro-7th-flavors`
2. `m3-w11-ear-7th-comparison`
3. `m3-w11-root-to-seventh-concept`
4. `m3-w11-seventh-chord-formulas-overlay`
5. `m3-w11-cmaj7-open-map`
6. `m3-w11-am7-open-map`
7. `m3-w11-fmaj7-comfort-map`
8. `m3-w11-g7-anchor-map`
9. `m3-w11-smooth-progression-tab`
10. `m3-w11-clean-fretting-check`
11. `m3-w11-self-check`

Optional but useful:

- `m3-w11-ear-c7-preview` inside `m3-w11-ear-7th-comparison`
- Web Audio playback for G7 -> C resolution

## 12. Week 11 Guardrails

- จำกัดสูตรไว้ที่ 1-3-5-7, 1-b3-5-b7 และ 1-3-5-b7
- Focus หลัก: Cmaj7, Fmaj7, Am7, G7
- G7 เป็น Dominant 7 anchor หลัก
- C7 เป็น brief contrast preview เพื่อกลิ่น blues เท่านั้น
- ห้ามสอน 9, 11, 13
- ห้ามสอน altered dominants
- ห้ามสอน chord-scale theory
- ห้ามสอน jazz substitutions
- ห้ามสอนทุก inversion ของ 7th chords
- ห้ามทำบทนี้เป็น speed arpeggio lesson
- ต้องเชื่อม Root-to-Seventh กับ Month 2 Fretboard Landmarks

## 13. Open Decisions Before Creating Real Data

- Production renderer ควรจัดกลุ่ม individual fretboard assets ด้วย `layout.group` / `layout.order` หรือปล่อย renderer เรียงตาม `lessonBlocks` โดยตรง
- `m3-w11-ear-7th-comparison` ยืนยันให้เก็บใน `chordSoundLabs` แล้ว แต่ renderer ต้องอ่าน `type: "ear-training-lab"` เพื่อแสดง UI เป็น ear comparison
- C7 preview ควรเล่นด้วย Web Audio ตั้งแต่ mock data รอบแรก หรือใช้ text fallback ก่อน
- Smooth progression TAB ควรเป็น block chord ก่อน หรือเพิ่ม arpeggio variation แยกใน future iteration

## 14. Revision Summary

1. Canonical `m3-w11-...` IDs applied across lesson blocks, assets, daily practice, self-check, and minimum viable content.
2. Week 11 scope locked to 1-3-5-7 formulas: Cmaj7, Fmaj7, Am7, G7 main anchor, and C7 as brief blues contrast preview.
3. Root-to-Seventh concept added: back 1 fret from Root = Major 7, back 2 frets = b7 / Dominant 7 color, connected to Month 2 Fretboard Landmarks.
4. Daily practice defined as 20 minutes: 15-minute core muscle memory / slow arpeggio movement plus 5-minute listening reflection.
5. Guardrails added against 9/11/13, altered dominants, chord-scale theory, advanced jazz harmony, and speed arpeggio framing.
6. Fretboard data shape changed from one `fretboard-set` asset into four standalone stacked assets: `m3-w11-cmaj7-open-map`, `m3-w11-am7-open-map`, `m3-w11-fmaj7-comfort-map`, and `m3-w11-g7-anchor-map`.
7. `m3-w11-ear-7th-comparison` is routed to the existing `chordSoundLabs` collection while keeping `type: "ear-training-lab"` for renderer compatibility.
8. Coffee flavor analogy condensed into `m3-w11-teacher-note-coffee-flavor` instead of a broad standalone section.
9. Production UI remains unchanged.
