# Month 3 Week 9 Draft: Triad Foundations & The 1-3-5

สถานะ: documentation draft only
ห้ามแก้ `outputs/app.js`, `outputs/styles.css`, `outputs/index.html`, `outputs/data.json` จากเอกสารนี้
ห้ามเปิด Month 3 ใน production UI จนกว่าจะมี launch task แยกต่างหาก

## 1. Week Metadata

| Field | Value |
| --- | --- |
| stable week id | `m3-w9-triad-foundations-135` |
| absolute week number | `9` |
| month number | `3` |
| month week index | `1` |
| module label | `Chord Tone & Arpeggio Foundation` |
| title | `Triad Foundations & The 1-3-5` |
| Thai title | `โครงในคอร์ด: Triad และเลข 1-3-5` |
| estimated minutes per day | `20` |
| primary chords | `C`, `F`, `G` |
| core skill | มองและได้ยิน chord tones 1-3-5 ในคอร์ดหลัก I-IV-V |

## 2. Week Promise

สัปดาห์นี้เราจะไม่จำคอร์ดแบบ "รูปนิ้วล้วน ๆ" อีกต่อไป แต่จะเปิดดูว่าในคอร์ด C, F และ G มีโน้ตอะไรซ่อนอยู่ข้างในบ้าง ผู้เรียนจะเริ่มเข้าใจว่า Triad คือเสียง 3 ตัวหลักของคอร์ด: 1, 3 และ 5

เมื่อจบสัปดาห์นี้ ผู้เรียนควรพูดได้ว่า:

- คอร์ด C มี C-E-G คือ 1-3-5
- คอร์ด F มี F-A-C คือ 1-3-5
- คอร์ด G มี G-B-D คือ 1-3-5
- เสียงตัวที่ 3 คือจุดที่ทำให้คอร์ดรู้สึก major หรือ minor
- open strings ที่อยู่ใน Open Form chords ไม่ได้ดังมั่ว ๆ แต่เป็น chord tones เหมือนกัน

## 3. Strict Adjustments Applied

### 3.1 Stable Asset IDs

เอกสารนี้ใช้ canonical asset IDs ตาม `MONTH3_CONTENT_PACK_PLAN.md` เท่านั้น เพื่อไม่ให้ข้อมูลจริงในอนาคตมี ID หลายมาตรฐานปนกัน

| Asset Purpose | Stable ID |
| --- | --- |
| C triad fretboard map | `m3-w9-c-triad-135-map` |
| F triad fretboard map | `m3-w9-f-triad-135-map` |
| G triad fretboard map | `m3-w9-g-triad-135-map` |
| C/F/G triad TAB | `m3-w9-cfg-triad-tones-tab` |
| Root-3rd-5th pulse TAB | `m3-w9-root-third-fifth-pulse-tab` |
| C/F/G triad preview lab | `m3-w9-cfg-triad-preview-lab` |
| Major/minor 3rd contrast map | `m3-w9-major-minor-third-shift` |
| Root-3rd-5th distance map | `m3-w9-root-third-fifth-distance-map` |
| C/F/G chord-tone overlay | `m3-w9-cfg-triad-tones-overlay` |
| Clean fretting mechanics check | `m3-w9-clean-fretting-check` |

### 3.2 Core Focus: C/F/G

ตัวอย่างหลัก แบบฝึก และ self-check ทั้งหมดผูกกับ C, F และ G เพื่อปู I-IV-V ให้แข็งแรงก่อนเข้าสู่ Week 10-12

### 3.3 Contrast-Only Minor

ใช้ `C Major vs C Minor` เป็นตัวอย่างฟังเร็ว ๆ เท่านั้น เพื่อให้เห็นว่า 3rd เปลี่ยนอารมณ์คอร์ดได้อย่างไร ห้ามขยายเป็น full minor chord drills หรือ minor shapes เต็มรูปแบบใน Week 9

### 3.4 Open Strings Explanation

เวลาอธิบาย Open Form chords ต้องพูดชัด ๆ ว่าเสียงทั้งหมดในคอร์ด Open C ยังเป็น C, E และ G หรือ 1, 3, 5 ทั้งจากโน้ตที่นิ้วกดและจาก open strings ถ้า open string นั้นไม่ใช่ 1, 3 หรือ 5 ของคอร์ด เราจะไม่ปล่อยให้มันดังในคอร์ดนั้น

ตัวอย่าง:

- C Open Form: `x32010` = C-E-G-C-E ดังนั้นสายเปิด G คือ 5 และสายเปิด e คือ 3
- G Open Form: `320003` = G-B-D-G-B-G ดังนั้นสายเปิด D คือ 5, สายเปิด G คือ 1, สายเปิด B คือ 3
- F ในบทนี้ใช้ mini F หรือ closed grip เพื่อเลี่ยง open string ที่ไม่ใช่ chord tone ของ F triad

## 4. Universal Renderer Block Structure

```json
{
  "week": 9,
  "number": 9,
  "month": 3,
  "module": "Chord Tone & Arpeggio Foundation",
  "title": "Triad Foundations & The 1-3-5",
  "summary": "มองคอร์ด C, F, G เป็นเสียง 1-3-5 แทนการจำรูปนิ้วอย่างเดียว",
  "estimatedMinutesPerDay": 20,
  "lessonBlocks": [
    { "type": "text", "id": "m3-w9-intro-chords-are-sounds" },
    { "type": "teacher-note", "id": "m3-w9-teacher-note-shapes-vs-sounds" },
    { "type": "text", "id": "m3-w9-explain-triad-135" },
    { "type": "interval-map", "mapRef": "m3-w9-major-minor-third-shift" },
    { "type": "ear-training-lab", "labRef": "m3-w9-cfg-triad-preview-lab" },
    { "type": "chord-tone-overlay", "overlayRef": "m3-w9-cfg-triad-tones-overlay" },
    { "type": "tab", "tabRef": "m3-w9-cfg-triad-tones-tab" },
    { "type": "mechanics-check", "checkRef": "m3-w9-clean-fretting-check" },
    { "type": "self-check", "id": "m3-w9-self-check" }
  ]
}
```

## 5. Lesson Blocks Draft

### Block 1: `text`

```json
{
  "type": "text",
  "id": "m3-w9-intro-chords-are-sounds",
  "title": "คอร์ดไม่ใช่แค่รูปนิ้ว คอร์ดคือกลุ่มเสียง",
  "body": [
    "สวัสดีครับ เดือนนี้เราจะค่อย ๆ เปิดดูข้างในคอร์ดกันครับ เวลาคุณจับคอร์ด C, F หรือ G มือซ้ายอาจจะจำเป็นรูปนิ้ว แต่หูของเรากำลังได้ยินกลุ่มเสียงที่มีโครงสร้างชัดเจนอยู่ข้างใน",
    "โครงสร้างพื้นฐานที่สุดของคอร์ดเรียกว่า Triad แปลตรงตัวว่าเสียงหลัก 3 ตัว ในบทนี้เราจะเรียกง่าย ๆ ว่า 1-3-5",
    "Root หรือเลข 1 คือชื่อบ้านของคอร์ด ตัว 3 คือสีของคอร์ด และตัว 5 คือเสียงที่ช่วยให้คอร์ดนิ่งขึ้น วันนี้เราจะเริ่มจาก C, F และ G เพราะสามคอร์ดนี้คือฐาน I-IV-V ที่เราจะใช้ต่อยอดไปอีกหลายเดือน"
  ],
  "listenFor": [
    "ฟังว่า C-E-G ให้ความรู้สึกนิ่งและจบชัด",
    "ฟังว่า F-A-C เหมือนเปิดออกจากบ้าน C",
    "ฟังว่า G-B-D มีแรงดึงให้กลับไป C"
  ],
  "feel": [
    "เล่นช้า ๆ เหมือนกำลังชี้โน้ตทีละตัว ไม่ใช่รีบโชว์ speed",
    "ทุกโน้ตต้องดังชัดและหยุดฟังได้"
  ]
}
```

### Block 2: `teacher-note`

```json
{
  "type": "teacher-note",
  "id": "m3-w9-teacher-note-shapes-vs-sounds",
  "title": "ครูแนะนำ",
  "body": "อย่าเพิ่งทิ้งรูปนิ้วเดิมนะครับ รูปนิ้วยังมีประโยชน์มาก แต่วันนี้เราเพิ่มอีกชั้นหนึ่ง คือรู้ว่าเสียงที่นิ้วกดอยู่คือ 1, 3 หรือ 5 ของคอร์ดอะไร พอรู้แบบนี้ การเล่น solo หรือเติม melody ในอนาคตจะไม่ใช่การเดาสุ่มแล้ว"
}
```

### Block 3: `text`

```json
{
  "type": "text",
  "id": "m3-w9-explain-triad-135",
  "title": "1-3-5 คืออะไรในคอร์ด C, F และ G",
  "body": [
    "ให้คิดว่าเลข 1 คือชื่อบ้านของคอร์ด ถ้าเราพูดว่าคอร์ด C เลข 1 ก็คือ C ถ้าพูดว่าคอร์ด F เลข 1 ก็คือ F และถ้าพูดว่าคอร์ด G เลข 1 ก็คือ G",
    "เลข 3 คือโน้ตที่ให้สีหลักของคอร์ด สำหรับ C major คือ E, สำหรับ F major คือ A, และสำหรับ G major คือ B",
    "เลข 5 คือโน้ตที่ช่วยให้คอร์ดนิ่งและเต็มขึ้น สำหรับ C คือ G, สำหรับ F คือ C, และสำหรับ G คือ D",
    "ดังนั้นคอร์ด C, F, G ที่เราเล่นบ่อย ๆ ไม่ได้เป็นแค่รูปนิ้ว แต่เป็นเสียง 1-3-5 ที่เรียงตัวอยู่ในมือเรา"
  ],
  "openFormExplanation": "เวลาเราจับ Open C chord เสียงที่ดังออกมายังเป็น C, E และ G ทั้งหมด ไม่ว่าจะเป็นโน้ตที่นิ้วกดหรือสายเปิด เช่น C Open Form มี C-E-G-C-E: สาย 5 เฟรต 3 เป็น C/1, สาย 4 เฟรต 2 เป็น E/3, สาย 3 เปิดเป็น G/5, สาย 2 เฟรต 1 เป็น C/1 และสาย 1 เปิดเป็น E/3 เราดีดสายเหล่านี้เพราะมันเป็น chord tones ของคอร์ด C ไม่ใช่เพราะสายเปิดต้องดีดเสมอ"
}
```

Teacher copy:

ตรงนี้สำคัญมากครับ Open Form ไม่ได้แปลว่า "ดีดสายเปิดไปก่อน เดี๋ยวมันก็ดังดีเอง" แต่สายเปิดที่เราปล่อยให้ดังต้องอยู่ในครอบครัวเสียงของคอร์ดนั้น เช่นคอร์ด C จะได้ยินแค่ C, E, G ซึ่งก็คือ 1, 3, 5 ทั้งจากนิ้วที่กดและจากสายเปิด

### Block 4: `interval-map`

```json
{
  "type": "interval-map",
  "id": "m3-w9-major-minor-third-shift",
  "title": "ตัวที่ 3 คือสีของคอร์ด",
  "root": { "note": "C", "string": 5, "fret": 3 },
  "intervals": [
    { "degree": "1", "note": "C", "label": "Root", "role": "บ้านของคอร์ด" },
    { "degree": "3", "note": "E", "label": "Major 3rd", "role": "ทำให้ C Major สว่าง" },
    { "degree": "b3", "note": "Eb", "label": "Minor 3rd", "role": "ทำให้ C Minor หม่นลง" },
    { "degree": "5", "note": "G", "label": "5th", "role": "ช่วยให้คอร์ดนิ่ง" }
  ],
  "caption": "ใช้ C Major vs C Minor แค่เพื่อฟังสีของ 3rd เท่านั้น บทนี้ยังไม่ฝึก minor shapes เต็มรูปแบบ",
  "practicePrompt": "เล่น C-E-G หนึ่งรอบ แล้วเล่น C-Eb-G หนึ่งรอบ จากนั้นหยุดพูดว่าเสียงไหนสว่างกว่า เสียงไหนหม่นกว่า"
}
```

Teacher copy:

ตัวที่ 3 คือปุ่มเปลี่ยนอารมณ์ของคอร์ดครับ ถ้า C ไปหา E เราจะได้ C Major ที่สว่าง ถ้า C ไปหา Eb เราจะได้ C Minor ที่หม่นขึ้น แต่วันนี้เราใช้ Cm แค่เป็นกระจกเทียบสีเท่านั้น ยังไม่ต้องฝึก minor chord แบบเต็มชุด

### Block 5: `ear-training-lab`

```json
{
  "type": "ear-training-lab",
  "id": "m3-w9-cfg-triad-preview-lab",
  "title": "ฟัง 1-3-5 ของ C/F/G",
  "skill": "chord quality hearing",
  "audioMode": "web-audio-optional",
  "listenFor": [
    "C-E-G ให้ความรู้สึกกลับบ้านและนิ่ง",
    "F-A-C ให้ความรู้สึกเปิดออกจากบ้าน C",
    "G-B-D มีแรงดึงกลับเข้าหา C",
    "C-E-G กับ C-Eb-G ต่างกันตรงสีของ 3rd"
  ],
  "prompts": [
    { "id": "m3-w9-ear-c", "label": "C / I", "notes": ["C", "E", "G"], "answer": "บ้าน" },
    { "id": "m3-w9-ear-f", "label": "F / IV", "notes": ["F", "A", "C"], "answer": "เปิดออก" },
    { "id": "m3-w9-ear-g", "label": "G / V", "notes": ["G", "B", "D"], "answer": "ดึงกลับ" },
    { "id": "m3-w9-ear-c-minor-contrast", "label": "C minor contrast", "notes": ["C", "Eb", "G"], "answer": "หม่นกว่า เพราะ b3" }
  ],
  "fallbackText": "ถ้าเสียงจาก Web Audio ไม่ทำงาน ให้เล่น C, F, G และ C minor contrast บนกีตาร์จริงหรือให้ครูเล่นให้ฟัง โดยใช้ C minor เป็นแค่ตัวเทียบสีของ 3rd เท่านั้น"
}
```

Teacher copy:

ฟังก่อนเล่นครับ กดฟัง C, F, G แล้วลองพูดอารมณ์ออกมาเป็นคำง่าย ๆ: บ้าน, เปิดออก, ดึงกลับ ส่วน C minor ให้ฟังแค่เพื่อรู้ว่าเมื่อ E ขยับเป็น Eb สีคอร์ดจะหม่นลงทันที เรายังไม่ฝึก minor chord system ในสัปดาห์นี้

### Block 6: `chord-tone-overlay`

```json
{
  "type": "chord-tone-overlay",
  "id": "m3-w9-cfg-triad-tones-overlay",
  "title": "C/F/G มี 1-3-5 อะไรอยู่ข้างใน",
  "chords": [
    {
      "chord": "C",
      "role": "I / บ้าน",
      "tones": [
        { "degree": "1", "note": "C", "role": "Root" },
        { "degree": "3", "note": "E", "role": "Major 3rd" },
        { "degree": "5", "note": "G", "role": "5th" }
      ]
    },
    {
      "chord": "F",
      "role": "IV / เปิดออก",
      "tones": [
        { "degree": "1", "note": "F", "role": "Root" },
        { "degree": "3", "note": "A", "role": "Major 3rd" },
        { "degree": "5", "note": "C", "role": "5th" }
      ]
    },
    {
      "chord": "G",
      "role": "V / ดึงกลับ",
      "tones": [
        { "degree": "1", "note": "G", "role": "Root" },
        { "degree": "3", "note": "B", "role": "Major 3rd" },
        { "degree": "5", "note": "D", "role": "5th" }
      ]
    }
  ],
  "openFormNote": "ใน Open Form chords สายเปิดที่เราดีดก็เป็น chord tones เช่นกัน เช่น คอร์ด C มีสายเปิด G เป็น 5 และสายเปิด e เป็น 3 ส่วนคอร์ด G มีสายเปิด D เป็น 5, สายเปิด G เป็น 1 และสายเปิด B เป็น 3 เราไม่ได้ปล่อยสายเปิดให้ดังเพราะมันสะดวกเฉย ๆ แต่เพราะมันอยู่ในโครง 1-3-5 ของคอร์ดนั้น"
}
```

Teacher copy:

เริ่มจาก C ก่อนครับ เพราะ C เป็นบ้านที่เราคุ้นจาก Month 2 แล้ว ให้มอง C บนสาย 5 เฟรต 3 เป็นเลข 1 จากนั้นหา E เป็นเลข 3 และ G เป็นเลข 5 เราไม่ได้กำลังจำทั้งคอในวันเดียว แค่เปิดไฟให้เห็นว่า C chord มีเสียงอะไรอยู่ใกล้มือบ้าง จากนั้นค่อยย้ายหลักคิดเดียวกันไป F และ G

### Block 7: `tab`

```json
{
  "type": "tab",
  "tabRef": "m3-w9-cfg-triad-tones-tab"
}
```

Teacher copy:

เล่น TAB นี้ช้า ๆ ที่ 60 BPM ก่อน ทุกครั้งที่ดีดให้พูดออกเสียงว่า 1, 3 หรือ 5 ถ้าปากพูดไม่ทัน แปลว่านิ้วกำลังพาเราเร็วเกินกว่าหูจะเรียนรู้ ให้ลด tempo ลงทันที

### Block 8: `mechanics-check`

```json
{
  "type": "mechanics-check",
  "id": "m3-w9-clean-fretting-check",
  "title": "เช็กเสียงให้ใสก่อนจำทฤษฎี",
  "when": "ก่อนเริ่มเล่น 1-3-5 ทุกครั้ง",
  "checks": [
    "นิ้วกดใกล้ fret พอให้เสียงชัด แต่ไม่บีบแรงเกิน",
    "ดีดทีละโน้ตแล้วเสียงไม่บอด",
    "มือขวาไม่รีบกวาดหลายสายพร้อมกัน",
    "หลังดีดโน้ตแล้วหยุดฟังเสียงจริงอย่างน้อยครึ่งจังหวะ"
  ],
  "warningSigns": [
    "เสียงบอดเพราะกดกลางช่องไกล fret",
    "นิ้วซ้ายเกร็งจนเปลี่ยนโน้ตไม่ทัน",
    "ดีดเร็วเพื่อหนีเสียงที่ยังไม่ชัด"
  ],
  "fixes": [
    "ลด BPM เหลือ 50-55",
    "เล่นแค่ C-E-G ก่อน อย่าเพิ่งย้ายคอร์ด",
    "ปล่อยไหล่และข้อมือซ้ายให้เบาลง"
  ]
}
```

### Block 9: `self-check`

```json
{
  "type": "self-check",
  "id": "m3-w9-self-check",
  "title": "ประเมินตัวเอง",
  "criteria": [
    "เล่น C-E-G, F-A-C, G-B-D ได้ช้า ๆ โดยไม่ต้องจับคอร์ดเต็ม",
    "พูด 1-3-5 ตรงกับโน้ตที่กีตาร์ดังออกมาได้",
    "อธิบายได้ว่า 3rd เปลี่ยนสี major/minor อย่างไรจาก C Major vs C Minor",
    "อธิบายได้ว่า open strings ในคอร์ด C และ G เป็น chord tones ไม่ใช่เสียงแถม"
  ],
  "passSummary": "ถ้าคุณเริ่มเห็น C, F, G เป็นกลุ่มเสียง 1-3-5 แล้ว ถือว่าพร้อมไป Week 10 เพื่อฟัง chord quality และเริ่มเล่น arpeggio แบบ chord tones in motion"
}
```

## 6. Required Root-Level Assets Draft

### 6.1 `fretboardVisuals`

```json
[
  {
    "id": "m3-w9-c-triad-135-map",
    "type": "fretboard",
    "title": "C Triad: 1-3-5",
    "caption": "เริ่มจาก Root C แล้วหา 3rd และ 5th ใกล้มือ",
    "config": { "startFret": 1, "endFret": 5, "showNut": true },
    "orientationNote": "แผนที่คอกีตาร์ใช้ TAB-style orientation: สาย 1 / High e อยู่ด้านบน และสาย 6 / Low E อยู่ด้านล่าง",
    "legend": [
      { "type": "root", "label": "1 / Root" },
      { "type": "third", "label": "3 / Major 3rd" },
      { "type": "fifth", "label": "5 / Perfect 5th" }
    ],
    "dots": [
      { "string": 5, "fret": 3, "label": "1", "note": "C", "type": "root" },
      { "string": 4, "fret": 2, "label": "3", "note": "E", "type": "third" },
      { "string": 4, "fret": 5, "label": "5", "note": "G", "type": "fifth" }
    ]
  },
  {
    "id": "m3-w9-f-triad-135-map",
    "type": "fretboard",
    "title": "F Triad: 1-3-5",
    "caption": "ใช้ F, A, C เป็นเสียงหลักของคอร์ด F",
    "config": { "startFret": 1, "endFret": 5, "showNut": true },
    "dots": [
      { "string": 6, "fret": 1, "label": "1", "note": "F", "type": "root" },
      { "string": 3, "fret": 2, "label": "3", "note": "A", "type": "third" },
      { "string": 5, "fret": 3, "label": "5", "note": "C", "type": "fifth" }
    ]
  },
  {
    "id": "m3-w9-g-triad-135-map",
    "type": "fretboard",
    "title": "G Triad: 1-3-5",
    "caption": "G-B-D คือเสียงหลักที่ทำให้คอร์ด G มีแรงดึงกลับบ้าน C",
    "config": { "startFret": 0, "endFret": 4, "showNut": true },
    "dots": [
      { "string": 6, "fret": 3, "label": "1", "note": "G", "type": "root" },
      { "string": 5, "fret": 2, "label": "3", "note": "B", "type": "third" },
      { "string": 4, "fret": 0, "label": "5", "note": "D", "type": "fifth" }
    ]
  }
]
```

### 6.2 `miniTabs`

```json
[
  {
    "id": "m3-w9-cfg-triad-tones-tab",
    "type": "tab",
    "title": "C/F/G Triad Tones",
    "bpm": 60,
    "ascii": [
      "e|---------------------------------|",
      "B|---------------------------------|",
      "G|---------2-----------------------|",
      "D|----2--5-----------0-------------|",
      "A|--3-----------3--2---------------|",
      "E|-------------1-----------3-------|"
    ],
    "lyrics": "   C  E  G     F  A  C     G  B  D",
    "degreeLine": "   1  3  5     1  3  5     1  3  5",
    "note": "เล่นช้า ๆ แล้วพูด 1-3-5 ออกเสียงทุกครั้ง อย่าเร่งให้เร็วกว่าเสียงในหัว"
  },
  {
    "id": "m3-w9-root-third-fifth-pulse-tab",
    "type": "tab",
    "title": "Root -> 3rd -> 5th Pulse",
    "bpm": 55,
    "ascii": [
      "e|-------------------------|",
      "B|-------------------------|",
      "G|-------------------------|",
      "D|----2-----5--------------|",
      "A|--3----------------------|",
      "E|-------------------------|"
    ],
    "lyrics": "   1     3     5",
    "note": "ดีดทีละโน้ตและปล่อยให้เสียงนิ่งก่อนเล่นตัวถัดไป"
  }
]
```

### 6.3 `chordSoundLabs / ear-training-lab profile`

Storage note: ใช้ stable asset ID `m3-w9-cfg-triad-preview-lab` ตาม `MONTH3_CONTENT_PACK_PLAN.md` และสามารถเก็บไว้ใน root-level `chordSoundLabs` ได้ในช่วง data migration แต่ block ที่เรียกใช้ใน Week 9 คือ `ear-training-lab` เพราะหน้าที่หลักคือฟังและแยกอารมณ์ 1-3-5 ของ C/F/G

```json
[
  {
    "id": "m3-w9-cfg-triad-preview-lab",
    "type": "ear-training-lab",
    "title": "ฟัง C/F/G เป็นกลุ่มเสียง 1-3-5",
    "skill": "chord quality hearing",
    "audioMode": "web-audio-optional",
    "listenFor": [
      "C-E-G = บ้าน / นิ่ง",
      "F-A-C = เปิดออก",
      "G-B-D = ดึงกลับ",
      "C-E-G เทียบกับ C-Eb-G = 3rd เปลี่ยนสีของคอร์ด"
    ],
    "fallbackText": "ถ้าเสียงไม่ทำงาน ให้เล่นคอร์ด C, F, G บนกีตาร์จริง แล้วฟังอารมณ์บ้าน / เปิดออก / ดึงกลับ",
    "prompts": [
      { "id": "m3-w9-ear-c", "label": "C / I", "role": "บ้าน", "notes": ["C", "E", "G"], "degrees": ["1", "3", "5"] },
      { "id": "m3-w9-ear-f", "label": "F / IV", "role": "เปิดออก", "notes": ["F", "A", "C"], "degrees": ["1", "3", "5"] },
      { "id": "m3-w9-ear-g", "label": "G / V", "role": "ดึงกลับ", "notes": ["G", "B", "D"], "degrees": ["1", "3", "5"] }
    ],
    "contrastOnly": {
      "title": "C Major vs C Minor",
      "instruction": "ใช้ฟังสีของ 3rd เท่านั้น ไม่ใช่แบบฝึก minor เต็มรูปแบบ",
      "major": { "label": "C Major", "notes": ["C", "E", "G"] },
      "minor": { "label": "C Minor", "notes": ["C", "Eb", "G"] }
    }
  }
]
```

### 6.4 `microSkillAssets.intervalMaps`

```json
[
  {
    "id": "m3-w9-major-minor-third-shift",
    "type": "interval-map",
    "title": "Major 3rd กับ Minor 3rd เปลี่ยนอารมณ์อย่างไร",
    "root": { "note": "C", "degree": "1" },
    "intervals": [
      { "degree": "3", "note": "E", "sound": "สว่าง / major" },
      { "degree": "b3", "note": "Eb", "sound": "หม่น / minor" }
    ],
    "guardrail": "Contrast only. Do not create minor chord drills in Week 9."
  },
  {
    "id": "m3-w9-root-third-fifth-distance-map",
    "type": "interval-map",
    "title": "ระยะ 1-3-5 รอบ Root",
    "root": { "note": "C", "string": 5, "fret": 3 },
    "intervals": [
      { "degree": "1", "note": "C", "role": "บ้าน" },
      { "degree": "3", "note": "E", "role": "สีของคอร์ด" },
      { "degree": "5", "note": "G", "role": "ความนิ่ง" }
    ]
  }
]
```

### 6.5 `microSkillAssets.chordToneOverlays`

```json
[
  {
    "id": "m3-w9-cfg-triad-tones-overlay",
    "type": "chord-tone-overlay",
    "title": "Chord tones ของ C/F/G",
    "key": "C",
    "chords": [
      { "chord": "C", "formula": "1-3-5", "notes": ["C", "E", "G"] },
      { "chord": "F", "formula": "1-3-5", "notes": ["F", "A", "C"] },
      { "chord": "G", "formula": "1-3-5", "notes": ["G", "B", "D"] }
    ],
    "practicePrompt": "จับคอร์ดเต็ม 1 ครั้ง แล้วเล่น chord tones ทีละตัวเพื่อฟังว่าเป็นเสียงชุดเดียวกัน"
  }
]
```

### 6.6 `microSkillAssets.mechanicsChecks`

```json
[
  {
    "id": "m3-w9-clean-fretting-check",
    "type": "mechanics-check",
    "title": "Clean Fretting Before Theory",
    "checks": [
      "เสียงแต่ละโน้ตชัด",
      "นิ้วไม่บีบแรงเกิน",
      "ไม่รีบเล่นโน้ตถัดไปก่อนฟังโน้ตเดิม",
      "รักษา Pulse ด้วย Metronome ได้"
    ]
  }
]
```

## 7. Daily Practice Structure

```json
[
  {
    "dayLabel": "Day 1-2",
    "focus": "C Triad: เห็น 1-3-5 ในคอร์ด C",
    "isOpen": true,
    "exercises": [
      {
        "id": "m3-w9-d1-c-root",
        "duration": "3 นาที",
        "title": "หา Root C",
        "instruction": "กด C บนสาย 5 เฟรต 3 แล้วพูดว่า 1 ก่อนเล่นโน้ตอื่น",
        "microSkillRef": "m3-w9-root-third-fifth-distance-map"
      },
      {
        "id": "m3-w9-d1-c-135",
        "duration": "5 นาที",
        "title": "เล่น C-E-G ช้า ๆ",
        "instruction": "เล่น C-E-G พร้อมพูด 1-3-5 ให้ตรงกับเสียงกีตาร์",
        "tabRef": "m3-w9-root-third-fifth-pulse-tab"
      },
      {
        "id": "m3-w9-d1-open-c",
        "duration": "3 นาที",
        "title": "เช็ก Open Form C",
        "instruction": "จับคอร์ด C แล้วไล่ฟังว่า open G เป็น 5 และ open e เป็น 3 ของคอร์ด C"
      }
    ]
  },
  {
    "dayLabel": "Day 3-5",
    "focus": "ย้าย 1-3-5 ไป F และ G",
    "isOpen": false,
    "exercises": [
      {
        "id": "m3-w9-d3-f-135",
        "duration": "4 นาที",
        "title": "F-A-C",
        "instruction": "เล่น F-A-C ช้า ๆ แล้วพูด 1-3-5 อย่าเพิ่งเพิ่ม open string ที่ไม่ใช่ chord tone"
      },
      {
        "id": "m3-w9-d3-g-135",
        "duration": "4 นาที",
        "title": "G-B-D",
        "instruction": "เล่น G-B-D แล้วจับคอร์ด G เพื่อฟังว่า open D, G, B เป็น chord tones ของคอร์ดนี้"
      },
      {
        "id": "m3-w9-d3-cfg-compare",
        "duration": "4 นาที",
        "title": "C/F/G Compare",
        "instruction": "เล่น 1-3-5 ของ C, F, G ทีละชุด แล้วพูดชื่อคอร์ดก่อนเล่น"
      }
    ]
  },
  {
    "dayLabel": "Day 6-7",
    "focus": "ฟัง 3rd และสรุปโครงในคอร์ด",
    "isOpen": false,
    "exercises": [
      {
        "id": "m3-w9-d6-third-color",
        "duration": "3 นาที",
        "title": "C Major vs C Minor แบบ contrast-only",
        "instruction": "เล่น C-E-G แล้วเล่น C-Eb-G เพื่อฟังสีของ 3rd เท่านั้น ไม่ต้องฝึก minor shape เพิ่ม",
        "microSkillRef": "m3-w9-major-minor-third-shift"
      },
      {
        "id": "m3-w9-d6-cfg-record",
        "duration": "5 นาที",
        "title": "อัดเสียง C/F/G 1-3-5",
        "instruction": "อัดเสียงตัวเองเล่น C-E-G, F-A-C, G-B-D ที่ 60 BPM แล้วฟังว่าโน้ตชัดไหม"
      },
      {
        "id": "m3-w9-d6-self-check",
        "duration": "4 นาที",
        "title": "ทำ Self-Check",
        "instruction": "ตอบเกณฑ์ด้านล่างด้วยความซื่อสัตย์ ถ้ายังสับสนเรื่อง 3rd ให้กลับไป Day 1-2"
      }
    ]
  }
]
```

## 8. Self-Check Structure

```json
{
  "id": "m3-w9-self-check",
  "title": "เช็กก่อนขึ้น Week 10",
  "questions": [
    {
      "id": "m3-w9-q1",
      "type": "multiple-choice",
      "prompt": "คอร์ด C major มีโน้ตอะไรเป็น 1-3-5?",
      "choices": ["C-E-G", "C-Eb-G", "C-F-G", "C-G-B"],
      "answer": "C-E-G",
      "feedback": "ถูกครับ C คือ 1, E คือ 3, G คือ 5"
    },
    {
      "id": "m3-w9-q2",
      "type": "multiple-choice",
      "prompt": "โน้ตตัวไหนทำให้ C Major เปลี่ยนเป็น C Minor?",
      "choices": ["Root", "3rd", "5th", "Open string"],
      "answer": "3rd",
      "feedback": "ใช่ครับ 3rd คือสีหลักของ major/minor"
    },
    {
      "id": "m3-w9-q3",
      "type": "multiple-choice",
      "prompt": "ทำไมเราดีด open G ในคอร์ด C ได้?",
      "choices": [
        "เพราะ G เป็น 5 ของคอร์ด C",
        "เพราะสายเปิดต้องดีดทุกครั้ง",
        "เพราะ G เป็น minor 3rd",
        "เพราะ G ไม่เกี่ยวกับคอร์ด"
      ],
      "answer": "เพราะ G เป็น 5 ของคอร์ด C",
      "feedback": "ถูกครับ open string ที่ดีดได้ต้องเป็น chord tone ของคอร์ดนั้น"
    }
  ],
  "practical": [
    "เล่น C-E-G, F-A-C, G-B-D ที่ 60 BPM ได้โดยไม่หลุด Pulse",
    "พูด 1-3-5 ตรงกับโน้ตที่เล่นได้",
    "อธิบาย open strings ในคอร์ด C หรือ G ได้อย่างน้อย 2 สาย"
  ],
  "troubleshooting": [
    {
      "problem": "จำ 1-3-5 ไม่ได้",
      "advice": "กลับไปหา Root ก่อน แล้วพูดเลข 1 ให้ชัด อย่ารีบกระโดดไป 3 หรือ 5"
    },
    {
      "problem": "เสียงบอดเวลาเล่นทีละโน้ต",
      "advice": "ลดแรงกดและขยับนิ้วให้ใกล้ fret ขึ้น เล่นช้ากว่าที่คิดอีกนิด"
    },
    {
      "problem": "ยังงงว่า open string เกี่ยวอะไรกับคอร์ด",
      "advice": "เขียนโน้ตของคอร์ดออกมาก่อน เช่น C-E-G แล้วเช็กว่าสายเปิดที่ดีดมีชื่ออยู่ในชุดนี้ไหม"
    }
  ],
  "passCriteria": [
    "ตอบคำถาม 2 จาก 3 ข้อได้ถูก",
    "เล่น C/F/G triad tones ได้ชัด",
    "อธิบายได้ว่า 3rd เปลี่ยน major/minor mood"
  ]
}
```

## 9. Renderer Dependency Analysis

### Reusable from Month 2 engine

- `text`
- `fretboard`
- `tab`
- `chord-lab` audio engine can support the optional triad preview sound, but Week 9 should expose it as `ear-training-lab`

### Needs text fallback first

- `teacher-note`
- `interval-map`
- `ear-training-lab`
- `chord-tone-overlay`
- `mechanics-check`
- `self-check` as formal Month 3 block contract

### Recommended fallback behavior

- ถ้า `interval-map` ยังไม่มี renderer ให้แสดงเป็น explanation card + list ของ intervals
- ถ้า `ear-training-lab` ยังไม่มี renderer ให้แสดงเป็น listen-for card พร้อม C/F/G prompts และ contrast-only C major/minor note
- ถ้า `chord-tone-overlay` ยังไม่มี renderer ให้แสดงเป็น table/list C, F, G พร้อม 1-3-5
- ถ้า `mechanics-check` ยังไม่มี renderer ให้แสดงเป็น checklist card
- ถ้า audio ใช้งานไม่ได้ ให้ใช้ `fallbackText` และให้ผู้เรียนเล่นด้วยกีตาร์จริง

## 10. Minimum Viable Launch Content

ถ้าจะทำ Week 9 data จริงแบบเล็กที่สุด ต้องมี:

1. `m3-w9-intro-chords-are-sounds`
2. `m3-w9-explain-triad-135`
3. `m3-w9-cfg-triad-preview-lab`
4. `m3-w9-cfg-triad-tones-overlay`
5. `m3-w9-c-triad-135-map`
6. `m3-w9-cfg-triad-tones-tab`
7. `m3-w9-clean-fretting-check`
8. `m3-w9-self-check`

สิ่งที่เลื่อนได้:

- Web Audio triad preview
- F/G visual maps แยกละเอียด
- animated interval map
- randomized ear quiz

## 11. Week 9 Guardrails

- ห้ามสอน full CAGED
- ห้ามสอน inversions เต็มระบบ
- ห้ามสอน 7th chords ใน Week 9
- ห้ามสอน minor chord drills เต็มรูปแบบ
- ห้ามขยายไป minor chord family เป็นชุดฝึกหลัก
- ใช้ C/F/G เป็นแกนหลักเท่านั้น
- ให้ arpeggio ยังเป็นคำอธิบายเบา ๆ ว่า "เล่น chord tones ทีละตัว" ไม่ใช่ speed technique
- ทุกตัวอย่างต้องฟังเป็นเพลงได้ ไม่ใช่ worksheet ทฤษฎีล้วน

## 12. Implementation Notes Before Real Data

- ก่อนสร้าง real data ควรยืนยันว่า production renderer จะ handle `fret: 0` ได้หรือไม่ ถ้ายังไม่ได้ ให้ปรับ G visual map ให้ไม่พึ่ง open-string dot หรือเพิ่ม fallback text
- ควรใช้ short dot labels เช่น `1`, `3`, `5` เท่านั้น แล้วอธิบายโน้ตเต็มใน legend เพื่อไม่ให้ fretboard dot ล้น
- `C Major vs C Minor` ต้องอยู่ใน lab/interval contrast เท่านั้น ไม่ควรถูกนับเป็น daily drill หลัก
- Open string explanation ควรอยู่ทั้งใน lesson text และ daily practice เพราะเป็นจุดที่ผู้เรียนเข้าใจผิดง่าย
- Month 3 ยังไม่ควรถูกเพิ่มเข้า `availableMonths` จนกว่าจะมี launch task ชัดเจน
