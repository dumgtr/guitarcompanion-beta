# Month 4 Week 16 Draft: Scale Atlas Consolidation - The Melodic Gateway

สถานะ: documentation-only / mock-data planning
ห้ามแก้ไฟล์ `outputs/app.js`, `outputs/styles.css`, `outputs/index.html`, `outputs/data.json` หรือเปิด Month 4 ใน production UI จากเอกสารนี้

## 1. Week Metadata

| Field | Value |
| --- | --- |
| stable week id | `m4-w16-scale-atlas-capstone` |
| absolute week number | `16` |
| month number | `4` |
| month week index | `4` |
| module label | `Scale Atlas Foundation` |
| lesson title | `Scale Atlas Consolidation: The Melodic Gateway` |
| Thai title | `สรุปแผนที่สเกล: ประตูสู่ Melody` |
| estimated minutes per day | `20` |
| daily structure | `15 นาที core capstone drill + 5 นาที root & color listening reflection` |
| play by ear thread position | `เติม scale ได้ → phrasing ได้ → improvise ตามเพลงได้` |
| core required area | `Root A บนสาย 6 เฟรต 5 / E-Shape region` |
| production status | `mock-data planning only; production UI remains untouched` |

## 2. Play By Ear Thread Position

**ตำแหน่งบนเส้นด้าย Play By Ear:** `เติม scale ได้ → phrasing ได้ → improvise ตามเพลงได้`

Week 16 คือบทสรุปของ Month 4 ครับ ไม่ใช่บทเปิดกล่องใหม่ เราจะเอาทุกอย่างที่เรียนใน Week 13-15 มาวางบนพื้นที่เดียวกัน:

- Week 13: Pentatonic เป็น Skeleton + Meat
- Week 14: b5 เป็น tension note ที่ต้อง resolve
- Week 15: สลับสี Major / Minor ด้วย Call & Response
- Week 16: รวมทั้งหมดให้กลายเป็น phrase ที่ตั้งใจเลือกสี ฟัง Root เป็นบ้าน และมีลมหายใจ

เป้าหมายของ Scale Atlas ไม่ใช่ให้ผู้เรียนจำตำแหน่งได้เยอะที่สุด แต่คือให้มือมีอิสระพอจะพูดความรู้สึกในพื้นที่เล็กๆ ได้ชัดเจน

## 3. Scope Lock

### 3.1 Core Allowed Scope

- อยู่ 100% ในพื้นที่ Root A บนสาย 6 เฟรต 5
- ใช้ E-Shape region เดิมจาก Week 13-15
- รวมเฉพาะองค์ประกอบที่เรียนแล้ว: chord tones, Major/Minor Pentatonic color, b5 tension, phrasing/rest
- ใช้ phrase สั้น 3-6 โน้ต ไม่ใช่ scale run ยาวๆ
- ใช้ clean alternate picking เพื่อให้เสียงชัด ไม่ใช่เพื่อเพิ่ม speed
- ฝึก emotional control: หวาน / ดิบ / ตึง / คลี่ / หยุด
- ใช้ internal Web Audio groove/drone หรือ Metronome เป็นกรอบจังหวะ
- ใช้ Orientation Rule v2: String 1 / High e อยู่ด้านบน และ String 6 / Low E อยู่ด้านล่าง

### 3.2 Capstone Integration Rule

บทนี้เป็น consolidation ไม่ใช่ expansion ครับ เราจะไม่เปิด Box 2, 3, 4 หรือ 5 และจะไม่สอน pattern ใหม่ให้จำเพิ่ม แต่จะฝึกให้ผู้เรียนมองพื้นที่เดิมเป็น "สนามดนตรี" ที่มีหลายสี:

- Skeleton: โน้ตที่มั่นคงและใช้ลงจอดได้
- Meat: โน้ตที่ทำให้ phrase มีเนื้อและทิศทาง
- b5: โน้ตเผ็ดที่สร้างแรงตึงแล้วต้องคลี่
- Rest: ความเงียบที่ทำให้ประโยคมีความหมาย

### 3.3 Strict Roadmap Guardrails

- ห้ามขยายไป Box 2, 3, 4 หรือ 5
- ห้ามสอน speed picking หรือ shredding
- ห้ามสอน scale sequence ที่ทำให้ผู้เรียนวิ่งนิ้วแทนการฟัง
- ห้ามเพิ่ม modes
- ห้ามเพิ่ม arpeggio system ใหม่
- ห้ามเพิ่ม chord-scale theory
- ห้ามใช้ staff notation
- ห้ามทำให้ capstone กลายเป็น performance test ที่กดดัน ผู้เรียนควรรู้สึกว่าเป็นการรวมของที่มีอยู่แล้ว

## 4. Universal Renderer Block Structure

```json
{
  "week": 16,
  "number": 16,
  "month": 4,
  "module": "Scale Atlas Foundation",
  "title": "Scale Atlas Consolidation: The Melodic Gateway",
  "summary": "รวม chord tones, Major/Minor color, b5 tension และ phrasing/rest ในพื้นที่ Root A เดิม เพื่อเริ่มสร้าง melodic expression",
  "estimatedMinutesPerDay": 20,
  "playByEarThreadPosition": "เติม scale ได้ → phrasing ได้ → improvise ตามเพลงได้",
  "lessonBlocks": [
    { "type": "text", "id": "m4-w16-intro-synthesis" },
    { "type": "ear-training-lab", "labRef": "m4-w16-ear-capstone-synthesis" },
    { "type": "fretboard", "visualRef": "m4-w16-overlay-synthesis-map" },
    { "type": "tab", "tabRef": "m4-w16-capstone-challenge-tab" },
    { "type": "technique-drill", "drillRef": "m4-w16-capstone-drill" },
    { "type": "daily-practice", "id": "m4-w16-daily-practice" },
    { "type": "self-check", "id": "m4-w16-self-check" }
  ]
}
```

## 5. Lesson Blocks Draft

### Block 1: `m4-w16-intro-synthesis`

```json
{
  "type": "text",
  "id": "m4-w16-intro-synthesis",
  "title": "Scale Atlas คือแผนที่เล็กที่ทำให้พูดได้อิสระขึ้น",
  "body": [
    "เดือนนี้เราไม่ได้เรียน scale เพื่อไล่นิ้วเร็วๆ ครับ เราเรียนเพื่อให้รู้ว่าโน้ตแต่ละตัวมีหน้าที่ทางอารมณ์อย่างไร",
    "ถ้าคุณเห็น Root A เป็นบ้าน เห็น 1-3-5 เป็นจุดลงจอด เห็น 2, 4, 6, b7 เป็นเนื้อของ melody และเห็น b5 เป็นเครื่องเทศตึงๆ คุณจะเริ่มเลือกโน้ตได้เหมือนเลือกคำพูด",
    "วันนี้เราจะรวมทุกสีไว้ใน workout เดียว: เริ่มด้วย Major call ที่สว่าง ตอบด้วย Minor response ที่เข้ม แตะ b5 ให้เกิดรส blues แล้ว resolve กลับมาลงจอดบน chord tone ที่นิ่ง",
    "ขอให้จำไว้ว่า capstone นี้ไม่ใช่การสอบความเร็ว แต่เป็นการเช็กว่าหู มือ และลมหายใจเริ่มทำงานด้วยกันหรือยัง"
  ],
  "listenFor": [
    "Major phrase ควรฟัง bright / sweet",
    "Minor response ควรฟัง tough / bluesy",
    "b5 ควรฟังตึง แล้ว resolve ให้หูโล่งขึ้น",
    "Rest ควรทำให้ phrase ชัดขึ้น ไม่ใช่ทำให้จังหวะหลุด"
  ],
  "feel": [
    "มือซ้ายยังอยู่พื้นที่เดิมรอบ Root A",
    "มือขวา alternate picking สะอาด ไม่รีบ",
    "ร่างกายรู้สึกเหมือนพูดประโยคสั้นๆ แล้วหายใจ",
    "หูยังได้ยิน A เป็นบ้านตลอด แม้สี phrase จะเปลี่ยน"
  ]
}
```

### Block 2: `m4-w16-ear-capstone-synthesis`

```json
{
  "type": "ear-training-lab",
  "labRef": "m4-w16-ear-capstone-synthesis"
}
```

Teacher copy:

ฟังตัวอย่างแบบ teacher demo ก่อนครับ Phrase แรกจะเปิดด้วยสี Major ที่สว่าง จากนั้นตอบด้วย Minor ที่เข้มขึ้น แตะ b5 ให้เกิดแรงตึง แล้วคลี่กลับมาลง chord tone ที่มั่นคง เป้าหมายคือฟังเส้นทางอารมณ์ ไม่ใช่จำ lick เป็นชุด

### Block 3: `m4-w16-overlay-synthesis-map`

```json
{
  "type": "fretboard",
  "visualRef": "m4-w16-overlay-synthesis-map"
}
```

Teacher copy:

แผนที่นี้คือภาพรวมทั้งเดือนในสนามเดียวกัน ให้ดูเป็นชั้นๆ: Root และ 5 คือจุดลงจอดที่นิ่ง, 3 / b3 คือปุ่มเปลี่ยนสี Major-Minor, 2 / 4 / 6 / b7 คือ Meat ที่ทำให้ melody เดินได้, และ b5 คือจุด tension ที่ต้องใช้สั้นๆ แล้ว resolve

### Block 4: `m4-w16-capstone-challenge-tab`

```json
{
  "type": "tab",
  "tabRef": "m4-w16-capstone-challenge-tab"
}
```

Teacher copy:

TAB นี้เป็นตัวอย่าง complete melodic phrase แบบสั้น ไม่ใช่เพลงเต็มและไม่ใช่ speed lick ให้เล่นช้าๆ นับ bar ให้ชัด Bar 1 ใช้ Major sweetness, Bar 2 มี rest, Bar 3 ตอบด้วย Minor toughness และ b5, Bar 4 resolve กลับมาลง A / E ให้รู้สึกจบ

### Block 5: `m4-w16-capstone-drill`

```json
{
  "type": "technique-drill",
  "drillRef": "m4-w16-capstone-drill"
}
```

Teacher copy:

แบบฝึกนี้ใช้ internal groove loop หรือ Metronome ช้าๆ เพื่อให้คุณฝึกเลือกสีอย่างตั้งใจ เล่น phrase สั้น หยุดพัก และฟังว่าตัวเอง resolve ได้จริงไหม ถ้าเริ่มเล่นเร็วเพื่อหนีความไม่มั่นใจ ให้ลด tempo ทันที

### Block 6: `m4-w16-daily-practice`

```json
{
  "type": "daily-practice",
  "id": "m4-w16-daily-practice"
}
```

### Block 7: `m4-w16-self-check`

```json
{
  "type": "self-check",
  "id": "m4-w16-self-check"
}
```

## 6. Root-Level Asset Drafts

### 6.1 `chordSoundLabs`

Storage note: `m4-w16-ear-capstone-synthesis` ต้อง route ไปที่ root-level `chordSoundLabs` array collection พร้อม `type: "ear-training-lab"` เพื่อ reuse Web Audio engine path เดิม

Implementation note: real data notes array ต้องใช้ explicit octave profiles เช่น `A2`, `B2`, `C#3`, `C3`, `Eb3`, `E3` เพื่อให้ synthesizer เล่น register ถูกต้อง ไม่ใช้ flat note names เฉยๆ

```json
[
  {
    "id": "m4-w16-ear-capstone-synthesis",
    "type": "ear-training-lab",
    "title": "Month 4 Capstone: Major Call, Minor Response, Blues Tension, Clean Resolve",
    "prompt": "ฟัง phrase ที่รวม Major sweetness, Minor toughness, b5 tension และการ resolve ลง chord tone ที่มั่นคง",
    "tonalCenter": "A",
    "tempo": 72,
    "loopBehavior": "manual-preview",
    "backingContext": {
      "type": "internal-web-audio-groove",
      "root": "A2",
      "feel": "slow-blues-rock-groove",
      "note": "internal Web Audio groove/drone เท่านั้น ไม่ใช่ external audio file"
    },
    "teacherDemo": {
      "id": "m4-w16-demo-integrated-line",
      "label": "Bright call → bluesy response → stable resolve",
      "segments": [
        {
          "label": "Major call",
          "bars": "1",
          "flavor": "sweet-bright",
          "notes": ["A2", "B2", "C#3", "E3", "F#3", "E3"],
          "degreePath": ["1", "2", "3", "5", "6", "5"]
        },
        {
          "label": "Rest / breathe",
          "bars": "2",
          "flavor": "space",
          "notes": [],
          "degreePath": ["rest"]
        },
        {
          "label": "Minor response with b5",
          "bars": "3",
          "flavor": "tough-bluesy-tension",
          "notes": ["A2", "C3", "D3", "Eb3", "E3", "G3"],
          "degreePath": ["1", "b3", "4", "b5", "5", "b7"]
        },
        {
          "label": "Stable resolve",
          "bars": "4",
          "flavor": "landing",
          "notes": ["E3", "C#3", "A2"],
          "degreePath": ["5", "3", "1"]
        }
      ],
      "answer": "integrated-capstone-phrase",
      "teacherNote": "ฟังว่า phrase ไม่ได้วิ่งมั่ว แต่มันมีสี มี tension มี rest และมีจุดลงจอด"
    },
    "listeningQuestions": [
      "ช่วงไหนฟังสว่างที่สุด?",
      "ช่วงไหนฟัง bluesy และตึงที่สุด?",
      "โน้ตสุดท้ายให้ความรู้สึกกลับบ้านไหม?"
    ],
    "fallbackText": "ถ้า audio เล่นไม่ได้ ให้เล่นชุดโน้ตตาม segment บนกีตาร์จริงช้าๆ แล้วร้องคำว่า Major, Rest, Minor, Resolve ไปพร้อมกัน"
  }
]
```

### 6.2 `fretboardVisuals`

```json
[
  {
    "id": "m4-w16-overlay-synthesis-map",
    "type": "chord-tone-overlay",
    "title": "Month 4 Capstone Atlas: Combined Scale Geography",
    "caption": "แผนที่รวมของ Month 4 ในพื้นที่ Root A เดิม: Skeleton, Meat, b5 tension และ color switch points",
    "orientation": "tab-style-v2",
    "orientationNote": "แผนที่คอกีตาร์นี้ใช้มุมมองเดียวกับ TAB: สาย 1 / High e อยู่ด้านบน และสาย 6 / Low E อยู่ด้านล่าง",
    "config": {
      "startFret": 4,
      "endFret": 8,
      "showNut": false,
      "stringLabels": {
        "top": "สาย 1 / High e",
        "bottom": "สาย 6 / Low E"
      }
    },
    "layoutMode": "unified-overlay",
    "responsiveFallback": {
      "required": true,
      "reason": "Due to the high density of information (Skeleton 1-3-5, Meat 2-4-6-b7, Tension b5, and Major/Minor colors), rendering this on a single 320px mobile viewport will cause cognitive overload.",
      "strategy": [
        "Renderer MUST support a graceful fallback on narrow viewports.",
        "Automatically split the unified map into vertical stacked cards by layer: Skeleton map, then Meat map, then Tension map.",
        "Alternatively provide a text-explanation toggle if a single map becomes unreadable.",
        "The fallback must preserve Orientation Rule v2 and must not introduce new fretboard boxes."
      ]
    },
    "layoutNotes": [
      "พื้นที่เดียวกับ Week 13-15: Root A บนสาย 6 เฟรต 5",
      "Skeleton / landing tones = 1, 3/b3, 5",
      "Major color point = 3 / C#",
      "Minor color point = b3 / C",
      "Meat = 2, 4, 6, b7",
      "Spicy tension = b5",
      "ห้ามใช้แผนที่นี้เพื่อเปิด Box 2-5"
    ],
    "legend": [
      { "type": "skeleton-root", "label": "1 / Root", "color": "primary" },
      { "type": "skeleton-fifth", "label": "5 / Stable landing", "color": "tertiary" },
      { "type": "color-third-major", "label": "3 / Major color", "color": "bright" },
      { "type": "color-third-minor", "label": "b3 / Minor color", "color": "deep" },
      { "type": "meat", "label": "2 / 4 / 6 / b7", "color": "muted-accent" },
      { "type": "tension", "label": "b5 / Blues tension", "color": "warning" }
    ],
    "dots": [
      { "string": 6, "fret": 5, "label": "A", "degree": "1", "toneRole": "skeleton", "type": "skeleton-root" },
      { "string": 6, "fret": 7, "label": "B", "degree": "2", "toneRole": "meat", "type": "meat" },
      { "string": 6, "fret": 8, "label": "C", "degree": "b3", "toneRole": "minor-color", "type": "color-third-minor" },
      { "string": 5, "fret": 4, "label": "C#", "degree": "3", "toneRole": "major-color", "type": "color-third-major" },
      { "string": 5, "fret": 5, "label": "D", "degree": "4", "toneRole": "meat", "type": "meat" },
      { "string": 5, "fret": 6, "label": "Eb", "degree": "b5", "toneRole": "tension", "type": "tension" },
      { "string": 5, "fret": 7, "label": "E", "degree": "5", "toneRole": "skeleton", "type": "skeleton-fifth" },
      { "string": 4, "fret": 4, "label": "F#", "degree": "6", "toneRole": "meat", "type": "meat" },
      { "string": 4, "fret": 5, "label": "G", "degree": "b7", "toneRole": "meat", "type": "meat" },
      { "string": 4, "fret": 7, "label": "A", "degree": "1", "toneRole": "skeleton", "type": "skeleton-root" },
      { "string": 3, "fret": 4, "label": "B", "degree": "2", "toneRole": "meat", "type": "meat" },
      { "string": 3, "fret": 5, "label": "C", "degree": "b3", "toneRole": "minor-color", "type": "color-third-minor" },
      { "string": 3, "fret": 6, "label": "C#", "degree": "3", "toneRole": "major-color", "type": "color-third-major" },
      { "string": 3, "fret": 7, "label": "D", "degree": "4", "toneRole": "meat", "type": "meat" },
      { "string": 3, "fret": 8, "label": "Eb", "degree": "b5", "toneRole": "tension", "type": "tension" },
      { "string": 2, "fret": 5, "label": "E", "degree": "5", "toneRole": "skeleton", "type": "skeleton-fifth" },
      { "string": 2, "fret": 7, "label": "F#", "degree": "6", "toneRole": "meat", "type": "meat" },
      { "string": 2, "fret": 8, "label": "G", "degree": "b7", "toneRole": "meat", "type": "meat" },
      { "string": 1, "fret": 5, "label": "A", "degree": "1", "toneRole": "skeleton", "type": "skeleton-root" },
      { "string": 1, "fret": 7, "label": "B", "degree": "2", "toneRole": "meat", "type": "meat" },
      { "string": 1, "fret": 8, "label": "C", "degree": "b3", "toneRole": "minor-color", "type": "color-third-minor" }
    ],
    "teacherNote": "อย่ามองแผนที่นี้เป็นโน้ตทั้งหมดที่ต้องเล่น ให้มองเป็นตัวเลือกสี: เลือกน้อย แต่เลือกให้ตั้งใจ"
  }
]
```

### 6.3 `miniTabs`

```json
[
  {
    "id": "m4-w16-capstone-challenge-tab",
    "type": "tab",
    "title": "Capstone Phrase: Major Call, Space, Minor Response, Resolve",
    "bpm": 72,
    "orientationNote": "TAB มาตรฐาน: สาย 1 อยู่บรรทัดบน และสาย 6 อยู่บรรทัดล่าง",
    "ascii": [
      "e|-----------------|-----------------|-----------------|-----------------|",
      "B|-----------5--7--|--5--------------|-----------5--8--|--5--------------|",
      "G|-----4--6--------|-----6-----x-----|-----5--7--8--7--|-----6--4--------|",
      "D|--7--------------|-----------x-----|--7--------------|-----------7-----|",
      "A|-----------------|-----------------|-----------------|-----------------|",
      "E|-----------------|-----------------|-----------------|-----------------|"
    ],
    "lyrics": "  Major call             breathe/rest       Minor + b5 tension       resolve to A",
    "barLabels": [
      { "bar": 1, "label": "Major sweetness" },
      { "bar": 2, "label": "Rest / breathe" },
      { "bar": 3, "label": "Minor toughness + b5" },
      { "bar": 4, "label": "Resolve / landing" }
    ],
    "degreeGuide": [
      { "bar": 1, "degrees": ["1", "2", "3", "5", "6"] },
      { "bar": 2, "degrees": ["5", "3", "rest"] },
      { "bar": 3, "degrees": ["1", "b3", "4", "b5", "4"] },
      { "bar": 4, "degrees": ["5", "3", "1"] }
    ],
    "note": "เล่นให้ช้าพอที่จะฟังสีของแต่ละ bar ไม่ต้องทำให้เป็น lick เร็ว"
  }
]
```

### 6.4 `techniqueDrills`

Schema convention: lesson block `{ "type": "technique-drill", "drillRef": "m4-w16-capstone-drill" }` อ้างอิง root-level JSON asset array ชื่อ `techniqueDrills`

```json
[
  {
    "id": "m4-w16-capstone-drill",
    "type": "technique-drill",
    "title": "15-Minute Capstone Phrasing Workout",
    "skill": "scale-atlas-synthesis",
    "tempo": 72,
    "grooveSource": "internal-web-audio-groove-or-metronome",
    "setup": [
      "เปิด internal groove loop หรือ Metronome ที่ 72 BPM",
      "ตั้ง Root A สาย 6 เฟรต 5 เป็นบ้าน",
      "อยู่ใน E-Shape region เดิมเท่านั้น",
      "เลือก phrase สั้น 3-6 โน้ต แล้วหยุดพัก"
    ],
    "rules": [
      "Bar 1: ใช้ Major color อย่างตั้งใจ",
      "Bar 2: เว้น space หรือเล่นน้อยมาก",
      "Bar 3: ใช้ Minor color และแตะ b5 ได้ 1 ครั้ง",
      "Bar 4: resolve ลง chord tone เช่น A, C#, E หรือ A, C, E ตามสีที่ตั้งใจ",
      "ถ้าเล่นเร็วขึ้นจนฟังไม่ออก ให้ลด tempo ทันที",
      "ห้ามเปิด Box 2-5"
    ],
    "steps": [
      {
        "label": "Minute 1-5: Map before playing",
        "instruction": "ชี้ Root A, C#, C, E, Eb บนแผนที่ก่อนเล่น เพื่อให้ตารู้ทางก่อนนิ้ววิ่ง"
      },
      {
        "label": "Minute 6-10: Guided phrase",
        "instruction": "เล่นตาม `m4-w16-capstone-challenge-tab` ช้าๆ แล้วหยุดฟังหลังแต่ละ bar"
      },
      {
        "label": "Minute 11-15: Own phrase",
        "instruction": "สร้าง phrase ของตัวเองโดยใช้โครง Major call → Rest → Minor response + b5 → Resolve"
      }
    ],
    "warningSigns": [
      "เริ่มไล่ทุกโน้ตในแผนที่โดยไม่เลือกสี",
      "ไม่เว้น rest เลย",
      "แตะ b5 แล้วไม่ resolve",
      "ลืม Root A และรู้สึกเหมือนกำลังเล่น random notes",
      "เร่ง tempo เพื่อให้ดูเหมือนเก่งขึ้น"
    ],
    "teacherNote": "Capstone ที่ดีไม่ใช่การเล่นเยอะ แต่คือเล่นน้อยแล้วคนฟังรู้สึกว่าเราตั้งใจพูด"
  }
]
```

## 7. Daily Practice: `m4-w16-daily-practice`

```json
{
  "id": "m4-w16-daily-practice",
  "type": "daily-practice",
  "title": "20 นาที: Scale Atlas Capstone",
  "totalDuration": "20 นาที",
  "coreDuration": "15 นาที",
  "reflectionDuration": "5 นาที",
  "structure": [
    {
      "dayLabel": "Day 1-2",
      "focus": "เห็นแผนที่รวมโดยไม่หลง",
      "core": [
        {
          "duration": "5 นาที",
          "title": "Point before play",
          "instruction": "ดู `m4-w16-overlay-synthesis-map` แล้วชี้ Root A, C#, C, Eb, E ก่อนเล่น"
        },
        {
          "duration": "5 นาที",
          "title": "Major vs Minor color landing",
          "instruction": "เล่น phrase Major สั้นๆ แล้วลง C# / E จากนั้นเล่น phrase Minor สั้นๆ แล้วลง C / E"
        },
        {
          "duration": "5 นาที",
          "title": "Rest control",
          "instruction": "หลังทุก phrase ต้องพัก 1 beat เต็มโดยไม่ดีดต่อ"
        }
      ],
      "reflection": {
        "duration": "5 นาที",
        "instruction": "ฟัง `m4-w16-ear-capstone-synthesis` แล้วจดว่าช่วงไหนเป็น Major, Minor, b5 tension และ resolve"
      }
    },
    {
      "dayLabel": "Day 3-4",
      "focus": "เล่น capstone phrase ให้สะอาด",
      "core": [
        {
          "duration": "5 นาที",
          "title": "TAB slow pass",
          "instruction": "เล่น `m4-w16-capstone-challenge-tab` ที่ tempo ช้ามากจนทุกโน้ตชัด"
        },
        {
          "duration": "5 นาที",
          "title": "b5 resolve",
          "instruction": "แตะ Eb แล้ว resolve ไป D หรือ E อย่างตั้งใจ ห้ามจอดค้าง"
        },
        {
          "duration": "5 นาที",
          "title": "Clean alternate picking",
          "instruction": "ใช้ Down-Up สะอาดเท่ากัน ไม่เร่ง ไม่กระแทกมือ"
        }
      ],
      "reflection": {
        "duration": "5 นาที",
        "instruction": "อัดเสียงตัวเอง 30 วินาที แล้วฟังว่ามี rest จริงไหม หรือมือเล่นต่อเพราะกลัวความเงียบ"
      }
    },
    {
      "dayLabel": "Day 5-7",
      "focus": "สร้าง phrase ของตัวเอง",
      "core": [
        {
          "duration": "5 นาที",
          "title": "Major call",
          "instruction": "สร้าง phrase Major 3-5 โน้ต แล้วหยุดพัก"
        },
        {
          "duration": "5 นาที",
          "title": "Minor response + b5",
          "instruction": "ตอบด้วย phrase Minor ที่แตะ b5 ได้ 1 ครั้ง แล้ว resolve"
        },
        {
          "duration": "5 นาที",
          "title": "Final loop",
          "instruction": "วน Major call → Rest → Minor response → Resolve กับ internal groove/drone หรือ Metronome"
        }
      ],
      "reflection": {
        "duration": "5 นาที",
        "instruction": "ตอบตัวเองว่า phrase ที่เล่นมีอารมณ์เปลี่ยนจริงไหม หรือเป็นแค่โน้ตเยอะขึ้น"
      }
    }
  ]
}
```

## 8. Self-Check: `m4-w16-self-check`

```json
{
  "id": "m4-w16-self-check",
  "type": "self-check",
  "title": "เช็กว่าคุณเริ่มใช้ Scale Atlas เป็นภาษาได้หรือยัง",
  "questions": [
    {
      "id": "m4-w16-q1-emotional-contrast",
      "type": "reflection",
      "question": "Can you intentionally make one phrase sound bright/major and the next phrase sound tough/minor without changing fretboard boxes?",
      "thaiPrompt": "คุณตั้งใจทำให้ phrase แรกสว่างแบบ Major และ phrase ถัดไปเข้มแบบ Minor ได้ไหม โดยไม่ต้องย้าย box?",
      "passSignal": "เลือก C# หรือ C ได้อย่างตั้งใจ และยังรู้สึก Root A เป็นบ้าน"
    },
    {
      "id": "m4-w16-q2-rest-and-resolution",
      "type": "reflection",
      "question": "Can you include rests and resolve the b5 tension cleanly instead of running the scale nonstop?",
      "thaiPrompt": "คุณเว้น rest และ resolve b5 ได้ชัดไหม หรือยังเผลอไล่สเกลยาวๆ แบบไม่หยุด?",
      "passSignal": "มี rest ที่นับได้จริง และ b5 คลี่ไปหา D, E หรือ chord tone ที่มั่นคง"
    }
  ],
  "passCriteria": [
    "อยู่ในพื้นที่ Root A เฟรต 5 ได้ตลอดโดยไม่เปิด Box 2-5",
    "เล่น Major call และ Minor response ได้ด้วยสีที่ต่างกัน",
    "ใช้ b5 เป็น tension สั้นๆ แล้ว resolve ได้",
    "เว้น rest ได้โดยไม่เสียจังหวะ",
    "ฟัง Root A เป็นบ้านได้ตลอด phrase"
  ],
  "troubleshooting": [
    {
      "problem": "แผนที่รวมดูแน่นจนไม่รู้จะเล่นอะไร",
      "advice": "ลดตัวเลือกเหลือ 3 โน้ตก่อน: A, C# หรือ C, E แล้วค่อยเพิ่ม Meat หรือ b5 ทีละตัว"
    },
    {
      "problem": "Major กับ Minor ยังฟังไม่ต่างกัน",
      "advice": "แยกฝึก C# กับ C เหมือน Week 15 ก่อน อย่าเพิ่งใส่ b5"
    },
    {
      "problem": "b5 ทำให้ phrase ฟังเพี้ยน",
      "advice": "ใช้ b5 แค่ผ่าน เช่น Eb-E หรือ Eb-D อย่าจอดนาน"
    },
    {
      "problem": "เล่นเร็วขึ้นเอง",
      "advice": "ลด tempo และบังคับ rest หลัง phrase ทุกครั้ง ความชัดสำคัญกว่าความเร็ว"
    }
  ]
}
```

## 9. Renderer Dependency Analysis

- `m4-w16-ear-capstone-synthesis` ต้อง route ไปที่ `chordSoundLabs` ด้วย `type: "ear-training-lab"`
- Real data notes array สำหรับ Web Audio ต้องใช้ scientific pitch notation พร้อม octave profile เช่น `["A2", "B2", "C#3", "E3"]` และ `["A2", "C3", "D3", "Eb3", "E3"]`
- `m4-w16-overlay-synthesis-map` ใช้ renderer แนว `chord-tone-overlay` ที่ต้องรองรับหลาย role: Skeleton, Major color, Minor color, Meat, Tension
- Unified overlay อาจดูแน่นบน mobile ดังนั้น renderer ควรรองรับ legend ที่ชัด และ dot labels ที่ไม่ล้น
- Due to the high density of information (Skeleton 1-3-5, Meat 2-4-6-b7, Tension b5, and Major/Minor colors), rendering `m4-w16-overlay-synthesis-map` on a single 320px mobile viewport will cause cognitive overload. The renderer MUST support a graceful fallback: automatically splitting the unified map into vertical stacked cards by layer (Skeleton map, then Meat map, then Tension map) or providing a text-explanation toggle if a single map becomes unreadable.
- Fretboard visualizer ต้องใช้ Orientation Rule v2: String 1 / High e อยู่ด้านบน และ String 6 / Low E อยู่ด้านล่าง
- `m4-w16-capstone-challenge-tab` ต้อง render เป็น Clean Mini-TAB ที่ scroll ภายใน card ได้ ไม่ทำให้ body overflow
- `technique-drill` ใช้ convention แบบ root-level asset reference: `{ "type": "technique-drill", "drillRef": "m4-w16-capstone-drill" }` อ้าง `techniqueDrills[]`
- `daily-practice` ต้องรองรับ structure แบบ 15-minute core + 5-minute reflection
- `self-check` ต้องรองรับ reflection questions และ troubleshooting
- ไม่ต้องใช้ staff notation
- ไม่ต้องสร้าง renderer สำหรับ full backing track production asset
- Production UI remains untouched

## 10. Backing Track / Groove Guardrail

Backing Track ในเอกสารนี้หมายถึง internal Web Audio groove/drone หรือผู้เรียนเปิดเองภายนอกแอปเท่านั้น ห้ามเพิ่ม network audio หรือ external audio file เข้า production

ถ้าทำ audio lab จริงในอนาคต:

- ใช้ Web Audio API ภายในแอป หรือ fallback text เท่านั้น
- ห้าม fetch audio file จาก network
- ห้ามเพิ่ม `.mp3`, `.wav`, หรือ external media dependency
- ถ้า browser audio ใช้ไม่ได้ ต้องให้ผู้เรียนใช้ Metronome หรือกีตาร์จริงแทนได้

## 11. Guardrails for Implementation

- ห้ามเปิด Month 4 ใน production UI จากเอกสารนี้
- ห้ามแก้ `outputs/data.json` จากเอกสารนี้
- ห้ามแก้ `outputs/app.js`, `outputs/styles.css`, หรือ `outputs/index.html`
- ห้ามเพิ่ม Box 2, 3, 4 หรือ 5
- ห้ามทำให้บทนี้กลายเป็น speed picking หรือ shred capstone
- ห้ามเพิ่ม modes, arpeggio system ใหม่ หรือ chord-scale theory
- ห้ามใช้ external backing track, network audio หรือ audio file ภายนอก
- ห้ามใช้ staff notation
- ถ้า renderer ยังไม่รองรับ unified overlay ที่อ่านง่าย ให้ใช้ fallback เป็น stacked cards หรือ text explanation ก่อน

## 12. Revision Summary

1. Created canonical Month 4 Week 16 draft with `m4-w16-...` IDs.
2. Lesson title locked to `Scale Atlas Consolidation: The Melodic Gateway`.
3. Strict single-region consolidation lock enforced: Root A on string 6 fret 5 remains the only geographic center.
4. Capstone integrates Week 13-15 concepts: chord tones, Major/Minor color switching, b5 tension, phrasing/rest.
5. Play By Ear milestone status documented: `เติม scale ได้ → phrasing ได้ → improvise ตามเพลงได้`.
6. `m4-w16-ear-capstone-synthesis` routed to `chordSoundLabs` with `type: "ear-training-lab"`.
7. Web Audio octave-profile requirement documented through explicit note arrays such as `A2`, `C#3`, `C3`, `Eb3`, and `E3`.
8. `m4-w16-overlay-synthesis-map` specified as a unified capstone overlay for Skeleton, Meat, b5 tension, and Major/Minor color points.
9. Orientation Rule v2 enforced: String 1 / High e on top, String 6 / Low E on bottom.
10. `m4-w16-capstone-challenge-tab` added as mobile-safe mini-TAB for a complete melodic phrase with rests.
11. `m4-w16-capstone-drill` establishes a 15-minute phrasing workout using internal groove loop or Metronome.
12. Daily practice set to 20 minutes: 15-minute core capstone drill + 5-minute root & color listening reflection.
13. Backing Track guardrail enforced: internal Web Audio groove/drone or learner-provided external playback only; no network audio or external audio files may be added to production.
14. Guardrails enforced against new boxes, speed picking, shredding, staff notation, and production UI changes.
15. Added explicit Mobile UX and Responsive Fallback requirements for `m4-w16-overlay-synthesis-map` to prevent cognitive overload on narrow viewports, strictly adhering to the Incremental Micro-Skills philosophy.
