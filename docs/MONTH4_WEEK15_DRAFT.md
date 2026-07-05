# Month 4 Week 15 Draft: Major/Minor Pentatonic Color Switching

สถานะ: documentation-only / mock-data planning
ห้ามแก้ไฟล์ `outputs/app.js`, `outputs/styles.css`, `outputs/index.html`, `outputs/data.json` หรือเปิด Month 4 ใน production UI จากเอกสารนี้

## 1. Week Metadata

| Field | Value |
| --- | --- |
| stable week id | `m4-w15-major-minor-color-switching` |
| absolute week number | `15` |
| month number | `4` |
| month week index | `3` |
| module label | `Scale Atlas Foundation` |
| lesson title | `Major/Minor Pentatonic Color Switching` |
| Thai title | `สลับสี Major / Minor Pentatonic` |
| estimated minutes per day | `20` |
| daily structure | `15 นาที color switching + call-response drill + 5 นาที root & color listening reflection` |
| play by ear thread position | `เติม scale ได้ → phrasing ได้ → improvise ตามเพลงได้` |
| core required shapes | `A Minor Pentatonic E-Shape`, `A Major Pentatonic E-Shape` |
| shared root | `A บนสาย 6 เฟรต 5` |
| production status | `mock-data planning only; production UI remains untouched` |

## 2. Play By Ear Thread Position

**ตำแหน่งบนเส้นด้าย Play By Ear:** `เติม scale ได้ → phrasing ได้ → improvise ตามเพลงได้`

Week 13 ให้ผู้เรียนได้ยินสี Minor / Major Pentatonic แยกกันก่อน  
Week 14 เพิ่ม b5 และฝึก phrase ให้มีลมหายใจ  
Week 15 คือการเอาสองเรื่องนั้นมาควบคุมอย่างมีสติ: เล่นสี Major ให้หวานและเปิด แล้วตอบด้วยสี Minor ให้ tough / bluesy โดยยังอยู่รอบ Root A เดิม

หลักคิด:

- นักดนตรีไม่ได้เปลี่ยนกล่องนิ้วเพื่อให้เสียงต่างเสมอไป
- บางครั้งเราอยู่พื้นที่มือเดิม แต่เปลี่ยน "สีของ interval" ใต้นิ้ว
- Major Pentatonic ให้ความรู้สึก sweet, bright, country, open
- Minor Pentatonic ให้ความรู้สึก tough, bluesy, raw
- Call & Response คือการพูดหนึ่งประโยค แล้วตอบกลับอีกประโยค ไม่ใช่การไล่สเกลยาวๆ

## 3. Scope Lock

### 3.1 Core Allowed Scope

- อยู่ 100% ในพื้นที่เดียวกับ Week 13: Root A บนสาย 6 เฟรต 5
- ใช้เฉพาะ `A Minor Pentatonic E-Shape` และ `A Major Pentatonic E-Shape`
- เป้าหมายคือฟัง color shift ไม่ใช่จำ shape เพิ่ม
- สลับสีทุก 2 bars เพื่อให้หูได้ยินโครงสร้างอารมณ์ชัด
- ใช้ Call phrase จาก Major Pentatonic และ Response phrase จาก Minor Pentatonic
- ใช้ Metronome หรือ Backing Track ช้าๆ เพื่อรักษา Groove
- ทุก phrase ต้องสั้นพอให้จำได้ ร้องตามได้ และตอบกลับได้
- ใช้ Orientation Rule v2: String 1 / High e อยู่ด้านบน และ String 6 / Low E อยู่ด้านล่าง

### 3.2 Same Region Rule

บทนี้ยังไม่ใช่บทขยายคอครับ เราจะยืนอยู่ในโซนเดิมรอบ A ที่เฟรต 5 แล้วเรียนรู้ว่า "สีเสียงเปลี่ยนได้โดยไม่ต้องหนีตำแหน่ง"  

ถ้าผู้เรียนยังรู้สึกว่านิ้วสับสน ให้กลับไปชี้ Root A ก่อนทุกครั้ง จากนั้นค่อยถามตัวเองว่า phrase นี้อยากใช้สีหวานแบบ Major หรือสีดิบแบบ Minor

### 3.3 Strict Curriculum Guardrails

- ห้ามสอน Pentatonic Box 2, 3, 4 หรือ 5
- ห้าม frame บทนี้เป็น finger-speed expansion lesson
- ห้ามสอน speed scale sequences
- ห้ามสอน shred mechanics
- ห้ามเพิ่ม Blues Scale หรือ b5 เป็นแกนใหม่ในสัปดาห์นี้
- ห้ามสอน modes
- ห้ามใช้ staff notation
- ห้ามให้ผู้เรียนไล่สเกลยาวๆ โดยไม่ฟัง Root หรือ color shift

## 4. Universal Renderer Block Structure

```json
{
  "week": 15,
  "number": 15,
  "month": 4,
  "module": "Scale Atlas Foundation",
  "title": "Major/Minor Pentatonic Color Switching",
  "summary": "สลับสี Major Pentatonic กับ Minor Pentatonic รอบ Root A เดิม ผ่าน Call & Response phrase สั้นๆ",
  "estimatedMinutesPerDay": 20,
  "playByEarThreadPosition": "เติม scale ได้ → phrasing ได้ → improvise ตามเพลงได้",
  "lessonBlocks": [
    { "type": "text", "id": "m4-w15-intro-switching" },
    { "type": "ear-training-lab", "labRef": "m4-w15-ear-color-switching" },
    { "type": "text", "id": "m4-w15-visual-region-switch" },
    { "type": "fretboard", "visualRef": "m4-w15-overlay-major-ref" },
    { "type": "fretboard", "visualRef": "m4-w15-overlay-minor-ref" },
    { "type": "tab", "tabRef": "m4-w15-call-response-tab" },
    { "type": "technique-drill", "drillRef": "m4-w15-switching-drill" },
    { "type": "daily-practice", "id": "m4-w15-daily-practice" },
    { "type": "self-check", "id": "m4-w15-self-check" }
  ]
}
```

## 5. Lesson Blocks Draft

### Block 1: `m4-w15-intro-switching`

```json
{
  "type": "text",
  "id": "m4-w15-intro-switching",
  "title": "เสียงเปลี่ยนได้ โดยมือยังอยู่ที่เดิม",
  "body": [
    "วันนี้เราจะไม่เปิด box ใหม่ครับ เราจะอยู่ที่ Root A สาย 6 เฟรต 5 เหมือนเดิม แล้วฝึกเปลี่ยนสีเสียงใต้มือ",
    "A Major Pentatonic ให้สีหวาน เปิด และสว่าง เหมือนประโยคที่ยิ้มอยู่",
    "A Minor Pentatonic ให้สีดิบ หนัก และ bluesy เหมือนประโยคที่ตอบกลับด้วยน้ำเสียงเข้มขึ้น",
    "เป้าหมายไม่ใช่เล่นเร็วขึ้น แต่คือเลือกสีให้ตรงกับสิ่งที่หูอยากได้ ถ้าเล่นเร็วแต่ฟังไม่ออกว่าสี Major หรือ Minor กำลังพูดอยู่ แปลว่าเรายังต้องช้าลง",
    "ให้คิดแบบ Call & Response: เล่น Major เป็นคำถาม แล้วใช้ Minor ตอบ หรือกลับกันก็ได้ แต่ในบทนี้เราจะเริ่มจาก Major call แล้วตอบด้วย Minor response เพื่อให้ความต่างของสีชัดที่สุด"
  ],
  "listenFor": [
    "Major phrase ฟัง sweet / bright กว่า",
    "Minor phrase ฟัง tough / bluesy กว่า",
    "Root A ต้องยังรู้สึกเป็นบ้านเดียวกันตลอด แม้สี phrase จะเปลี่ยน"
  ],
  "feel": [
    "มือซ้ายยังอยู่พื้นที่เดิม ไม่กระโดดไป box ใหม่",
    "สมองต้อง tracking Root A ตลอดเวลา",
    "มือขวาเล่น phrase สั้นพอให้หูจำได้และตอบกลับได้"
  ]
}
```

### Block 2: `m4-w15-ear-color-switching`

```json
{
  "type": "ear-training-lab",
  "labRef": "m4-w15-ear-color-switching"
}
```

Teacher copy:

ฟัง loop เดียวกันก่อน แล้วสังเกตว่า phrase แรกใช้สี Major Pentatonic จะหวานและเปิดกว่า ส่วน phrase ตอบใช้สี Minor Pentatonic จะเข้มและ bluesy กว่า จุดสำคัญคือทั้งสอง phrase ยังวนอยู่รอบ Root A เดิม ไม่ได้เปลี่ยนคีย์ ไม่ได้ย้ายบ้าน แค่เปลี่ยนสีของคำพูด

### Block 3: `m4-w15-visual-region-switch`

```json
{
  "type": "text",
  "id": "m4-w15-visual-region-switch",
  "title": "ดูสองแผนที่ซ้อนกันในพื้นที่เดียว",
  "body": [
    "ก่อนเล่น ให้ดูแผนที่ Major และ Minor เป็นคู่กันครับ อย่ามองเป็น shape คนละโลก ให้มองว่าเป็นสีสองชุดที่วางอยู่รอบ Root A เดียวกัน",
    "จุดที่ต้องจำคือ Major มี 3 ธรรมชาติ ส่วน Minor มี b3 ตรงนี้เองที่ทำให้สีเปลี่ยนทันที",
    "เวลาเล่นจริง ให้ถามตัวเองก่อน phrase ว่าอยากพูดด้วยสีหวานหรือสีดิบ แล้วเลือกโน้ตจากแผนที่นั้นอย่างตั้งใจ"
  ],
  "stackedVisualRefs": [
    "m4-w15-overlay-major-ref",
    "m4-w15-overlay-minor-ref"
  ]
}
```

### Block 4: `m4-w15-overlay-major-ref`

```json
{
  "type": "fretboard",
  "visualRef": "m4-w15-overlay-major-ref"
}
```

Teacher copy:

เริ่มจากแผนที่ Major ก่อน เพราะมันให้สีหวานและเปิด ให้หา A, C#, E เป็น Skeleton แล้วฟัง B กับ F# เป็น Meat ที่ทำให้ phrase มีความสว่างขึ้น

### Block 5: `m4-w15-overlay-minor-ref`

```json
{
  "type": "fretboard",
  "visualRef": "m4-w15-overlay-minor-ref"
}
```

Teacher copy:

จากนั้นดู Minor map ในพื้นที่มือเดิม ให้หา A, C, E เป็น Skeleton แล้วฟัง D กับ G เป็น Meat ที่ทำให้ phrase tough / bluesy ขึ้น ความต่างสำคัญที่สุดคือ C# ใน Major เปลี่ยนเป็น C ใน Minor

### Block 6: `m4-w15-call-response-tab`

```json
{
  "type": "tab",
  "tabRef": "m4-w15-call-response-tab"
}
```

Teacher copy:

TAB นี้ไม่ใช่ lick สำหรับท่องจำ แต่เป็นตัวอย่างการพูดสองประโยค: Bar 1-2 เป็น Call สี Major และ Bar 3-4 เป็น Response สี Minor ให้เล่นช้าๆ แล้วพูดในหัวว่า "หวานก่อน ตอบเข้มทีหลัง"

### Block 7: `m4-w15-switching-drill`

```json
{
  "type": "technique-drill",
  "drillRef": "m4-w15-switching-drill"
}
```

Teacher copy:

แบบฝึกนี้คือการสลับสีทุก 2 bars เปิด Metronome หรือ Backing Track ช้าๆ แล้วตั้งใจเลือกสี อย่าปล่อยให้นิ้วเลือกแทนหู ถ้าหลง ให้หยุด กลับมาหา Root A แล้วเริ่ม phrase ใหม่

### Block 8: `m4-w15-daily-practice`

```json
{
  "type": "daily-practice",
  "id": "m4-w15-daily-practice"
}
```

### Block 9: `m4-w15-self-check`

```json
{
  "type": "self-check",
  "id": "m4-w15-self-check"
}
```

## 6. Root-Level Asset Drafts

### 6.1 `chordSoundLabs`

Storage note: `m4-w15-ear-color-switching` ต้อง route ไปที่ root-level `chordSoundLabs` array collection พร้อม `type: "ear-training-lab"` เพื่อ reuse Web Audio engine path เดิม

Implementation note: real data notes array ต้องใช้ explicit octave profiles เช่น `A2`, `B2`, `C#3`, `C3`, `E3` เพื่อให้ synthesizer เล่น register ถูกต้อง ไม่ใช้ flat note names เฉยๆ

```json
[
  {
    "id": "m4-w15-ear-color-switching",
    "type": "ear-training-lab",
    "title": "Major to Minor Pentatonic Color Switch",
    "prompt": "ฟัง phrase ที่เริ่มด้วย A Major Pentatonic แล้วตอบด้วย A Minor Pentatonic เหนือ groove เดียวกัน",
    "tonalCenter": "A",
    "tempo": 72,
    "loopBehavior": "manual-preview",
    "backingContext": {
      "type": "tonal-center-drone",
      "root": "A2",
      "feel": "slow-groove",
      "note": "ใช้เป็น ear preview เท่านั้น ไม่ใช่ backing track production asset"
    },
    "examples": [
      {
        "id": "m4-w15-ear-major-call",
        "label": "Call: A Major Pentatonic",
        "flavor": "sweet-bright",
        "notes": ["A2", "B2", "C#3", "E3", "F#3", "E3"],
        "degreePath": ["1", "2", "3", "5", "6", "5"],
        "teacherNote": "C# คือจุดที่ทำให้สี Major เปิดและหวานขึ้น"
      },
      {
        "id": "m4-w15-ear-minor-response",
        "label": "Response: A Minor Pentatonic",
        "flavor": "tough-bluesy",
        "notes": ["A2", "C3", "D3", "E3", "G3", "E3"],
        "degreePath": ["1", "b3", "4", "5", "b7", "5"],
        "teacherNote": "C ธรรมชาติทำให้สีเข้มและ bluesy กว่า C# ชัดเจน"
      },
      {
        "id": "m4-w15-ear-switch-mid-groove",
        "label": "Major Call → Minor Response",
        "segments": [
          {
            "label": "Major call",
            "bars": "1-2",
            "notes": ["A2", "B2", "C#3", "E3", "F#3", "E3"]
          },
          {
            "label": "Minor response",
            "bars": "3-4",
            "notes": ["A2", "C3", "D3", "E3", "G3", "E3"]
          }
        ],
        "answer": "color-switch-major-to-minor",
        "teacherNote": "ไม่ได้เปลี่ยนบ้าน ยังอยู่ A เหมือนเดิม แต่สีของประโยคเปลี่ยนจากหวานเป็นเข้ม"
      }
    ],
    "fallbackText": "ถ้า audio เล่นไม่ได้ ให้ดีด A-B-C#-E-F#-E แล้วตามด้วย A-C-D-E-G-E ช้าๆ บนกีตาร์จริง แล้วฟังความต่างของ C# กับ C"
  }
]
```

### 6.2 `fretboardVisuals`

```json
[
  {
    "id": "m4-w15-overlay-major-ref",
    "type": "chord-tone-overlay",
    "title": "A Major Pentatonic E-Shape: Color Reference",
    "caption": "แผนที่สี Major รอบ Root A เดิม ใช้สำหรับ Call phrase ที่หวานและเปิดกว่า",
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
    "formula": ["1", "2", "3", "5", "6"],
    "layoutNotes": [
      "Root A อยู่สาย 6 เฟรต 5",
      "Major color marker สำคัญคือ 3 = C#",
      "ใช้เป็น Call phrase สี sweet / bright",
      "ยังอยู่ในพื้นที่เดียวกับ Minor reference map"
    ],
    "legend": [
      { "type": "skeleton-root", "label": "1 / Root", "color": "primary" },
      { "type": "skeleton-third-major", "label": "3 / Major color", "color": "bright" },
      { "type": "skeleton-fifth", "label": "5", "color": "tertiary" },
      { "type": "meat-major", "label": "2 / 6", "color": "warm" }
    ],
    "dots": [
      { "string": 6, "fret": 5, "label": "A", "degree": "1", "toneRole": "skeleton", "type": "skeleton-root" },
      { "string": 6, "fret": 7, "label": "B", "degree": "2", "toneRole": "meat", "type": "meat-major" },
      { "string": 5, "fret": 4, "label": "C#", "degree": "3", "toneRole": "skeleton", "type": "skeleton-third-major" },
      { "string": 5, "fret": 7, "label": "E", "degree": "5", "toneRole": "skeleton", "type": "skeleton-fifth" },
      { "string": 4, "fret": 4, "label": "F#", "degree": "6", "toneRole": "meat", "type": "meat-major" },
      { "string": 4, "fret": 7, "label": "A", "degree": "1", "toneRole": "skeleton", "type": "skeleton-root" },
      { "string": 3, "fret": 4, "label": "B", "degree": "2", "toneRole": "meat", "type": "meat-major" },
      { "string": 3, "fret": 6, "label": "C#", "degree": "3", "toneRole": "skeleton", "type": "skeleton-third-major" },
      { "string": 2, "fret": 5, "label": "E", "degree": "5", "toneRole": "skeleton", "type": "skeleton-fifth" },
      { "string": 2, "fret": 7, "label": "F#", "degree": "6", "toneRole": "meat", "type": "meat-major" },
      { "string": 1, "fret": 5, "label": "A", "degree": "1", "toneRole": "skeleton", "type": "skeleton-root" },
      { "string": 1, "fret": 7, "label": "B", "degree": "2", "toneRole": "meat", "type": "meat-major" }
    ],
    "teacherNote": "ถ้าหูอยากได้สีหวาน ให้เล็ง C# และ F# อย่างตั้งใจ แต่อย่าลืมกลับมารู้สึก Root A เป็นบ้าน"
  },
  {
    "id": "m4-w15-overlay-minor-ref",
    "type": "chord-tone-overlay",
    "title": "A Minor Pentatonic E-Shape: Color Reference",
    "caption": "แผนที่สี Minor รอบ Root A เดิม ใช้สำหรับ Response phrase ที่ tough / bluesy กว่า",
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
    "formula": ["1", "b3", "4", "5", "b7"],
    "layoutNotes": [
      "Root A อยู่สาย 6 เฟรต 5",
      "Minor color marker สำคัญคือ b3 = C",
      "ใช้เป็น Response phrase สี tough / bluesy",
      "เปรียบเทียบกับ Major map โดยฟัง C# เปลี่ยนเป็น C"
    ],
    "legend": [
      { "type": "skeleton-root", "label": "1 / Root", "color": "primary" },
      { "type": "skeleton-third-minor", "label": "b3 / Minor color", "color": "deep" },
      { "type": "skeleton-fifth", "label": "5", "color": "tertiary" },
      { "type": "meat-minor", "label": "4 / b7", "color": "muted-accent" }
    ],
    "dots": [
      { "string": 6, "fret": 5, "label": "A", "degree": "1", "toneRole": "skeleton", "type": "skeleton-root" },
      { "string": 6, "fret": 8, "label": "C", "degree": "b3", "toneRole": "skeleton", "type": "skeleton-third-minor" },
      { "string": 5, "fret": 5, "label": "D", "degree": "4", "toneRole": "meat", "type": "meat-minor" },
      { "string": 5, "fret": 7, "label": "E", "degree": "5", "toneRole": "skeleton", "type": "skeleton-fifth" },
      { "string": 4, "fret": 5, "label": "G", "degree": "b7", "toneRole": "meat", "type": "meat-minor" },
      { "string": 4, "fret": 7, "label": "A", "degree": "1", "toneRole": "skeleton", "type": "skeleton-root" },
      { "string": 3, "fret": 5, "label": "C", "degree": "b3", "toneRole": "skeleton", "type": "skeleton-third-minor" },
      { "string": 3, "fret": 7, "label": "D", "degree": "4", "toneRole": "meat", "type": "meat-minor" },
      { "string": 2, "fret": 5, "label": "E", "degree": "5", "toneRole": "skeleton", "type": "skeleton-fifth" },
      { "string": 2, "fret": 8, "label": "G", "degree": "b7", "toneRole": "meat", "type": "meat-minor" },
      { "string": 1, "fret": 5, "label": "A", "degree": "1", "toneRole": "skeleton", "type": "skeleton-root" },
      { "string": 1, "fret": 8, "label": "C", "degree": "b3", "toneRole": "skeleton", "type": "skeleton-third-minor" }
    ],
    "teacherNote": "ถ้าหูอยากได้สีดิบ ให้เล็ง C และ G แต่ยังต้องรู้สึกว่า A คือบ้าน ไม่ใช่แค่ไล่ shape"
  }
]
```

### 6.3 `miniTabs`

```json
[
  {
    "id": "m4-w15-call-response-tab",
    "type": "tab",
    "title": "Major Call → Minor Response",
    "bpm": 72,
    "orientationNote": "TAB มาตรฐาน: สาย 1 อยู่บรรทัดบน และสาย 6 อยู่บรรทัดล่าง",
    "ascii": [
      "e|-----------------|-----------------|-----------------|-----------------|",
      "B|-----------5--7--|--5--------------|-----------5--8--|--5--------------|",
      "G|-----4--6--------|-----6--4--------|-----5--7--------|-----7--5--------|",
      "D|--7--------------|-----------7-----|--7--------------|-----------7-----|",
      "A|-----------------|-----------------|-----------------|-----------------|",
      "E|-----------------|-----------------|-----------------|-----------------|"
    ],
    "lyrics": "  Major call: 1-2-3-5-6      rest       Minor response: 1-b3-4-5-b7      rest",
    "barLabels": [
      { "bar": 1, "label": "Call / Major color" },
      { "bar": 2, "label": "พักและฟัง Root A" },
      { "bar": 3, "label": "Response / Minor color" },
      { "bar": 4, "label": "พักและฟัง Root A" }
    ],
    "note": "นี่เป็นตัวอย่าง phrase ไม่ใช่ lick บังคับ ให้เล่นช้าๆ และฟังว่า Bar 1 สว่างกว่า Bar 3 อย่างไร"
  }
]
```

### 6.4 `techniqueDrills`

Schema convention: lesson block `{ "type": "technique-drill", "drillRef": "m4-w15-switching-drill" }` อ้างอิง root-level JSON asset array ชื่อ `techniqueDrills`

```json
[
  {
    "id": "m4-w15-switching-drill",
    "type": "technique-drill",
    "title": "Switch Colors Every 2 Bars",
    "skill": "major-minor-pentatonic-color-control",
    "tempo": 72,
    "setup": [
      "เปิด Metronome หรือ Backing Track ช้าๆ ที่ประมาณ 72 BPM",
      "กำหนด Root A ในใจตลอดเวลา",
      "Bar 1-2 ใช้ A Major Pentatonic E-Shape",
      "Bar 3-4 ใช้ A Minor Pentatonic E-Shape"
    ],
    "rules": [
      "ห้ามออกนอกพื้นที่ Root A เฟรต 5",
      "ห้ามเปิด Box 2-5",
      "เล่น phrase สั้น 3-5 โน้ต",
      "ต้องพักหลัง phrase เพื่อให้หูรับรู้สี",
      "ทุกครั้งที่เปลี่ยนสี ให้รู้ว่ากำลังเปลี่ยน 3 เป็น b3 หรือ b3 เป็น 3"
    ],
    "steps": [
      {
        "label": "Step 1: Major call",
        "bars": "1-2",
        "instruction": "เล่น phrase จาก A Major Pentatonic แล้วหยุดพัก ให้ฟังสี sweet / bright",
        "targetDegrees": ["1", "2", "3", "5", "6"]
      },
      {
        "label": "Step 2: Minor response",
        "bars": "3-4",
        "instruction": "ตอบด้วย phrase จาก A Minor Pentatonic แล้วหยุดพัก ให้ฟังสี tough / bluesy",
        "targetDegrees": ["1", "b3", "4", "5", "b7"]
      },
      {
        "label": "Step 3: Name the color",
        "instruction": "ก่อนเล่นแต่ละ phrase ให้พูดออกเสียงเบาๆ ว่า Major หรือ Minor",
        "goal": "ให้หูเป็นคนสั่งมือ ไม่ใช่นิ้ววิ่งเอง"
      }
    ],
    "warningSigns": [
      "เล่น Major กับ Minor แล้วฟังไม่ต่างกัน",
      "ลืม Root A ตอนสลับสี",
      "มือเริ่มไล่ scale ยาวๆ แทน phrase สั้น",
      "เริ่มเร่ง tempo เพื่อหลบการฟัง"
    ],
    "teacherNote": "ถ้าคุณสลับสีได้ช้าๆ และฟังออก นั่นคือ improvisation เริ่มเกิดแล้ว ไม่ต้องรีบเพิ่ม box"
  }
]
```

## 7. Daily Practice: `m4-w15-daily-practice`

```json
{
  "id": "m4-w15-daily-practice",
  "type": "daily-practice",
  "title": "20 นาที: Major/Minor color switching",
  "totalDuration": "20 นาที",
  "coreDuration": "15 นาที",
  "reflectionDuration": "5 นาที",
  "structure": [
    {
      "dayLabel": "Day 1-2",
      "focus": "จำสี Major และ Minor แยกกัน",
      "core": [
        {
          "duration": "5 นาที",
          "title": "Major color only",
          "instruction": "เล่น phrase สั้นจาก A Major Pentatonic E-Shape แล้วหยุดพัก"
        },
        {
          "duration": "5 นาที",
          "title": "Minor color only",
          "instruction": "เล่น phrase สั้นจาก A Minor Pentatonic E-Shape แล้วหยุดพัก"
        },
        {
          "duration": "5 นาที",
          "title": "C# vs C listening",
          "instruction": "เล่น C# แล้วเล่น C สลับกันช้าๆ เพื่อฟังสี Major / Minor ที่ต่างกัน"
        }
      ],
      "reflection": {
        "duration": "5 นาที",
        "instruction": "เปิด `m4-w15-ear-color-switching` แล้วจดว่า phrase ไหนฟัง sweet และ phrase ไหนฟัง tough"
      }
    },
    {
      "dayLabel": "Day 3-4",
      "focus": "Call & Response",
      "core": [
        {
          "duration": "5 นาที",
          "title": "Major call",
          "instruction": "เล่น Major phrase 1 ประโยคใน Bar 1-2 แล้วหยุดพัก"
        },
        {
          "duration": "5 นาที",
          "title": "Minor response",
          "instruction": "ตอบด้วย Minor phrase ใน Bar 3-4 แล้วหยุดพัก"
        },
        {
          "duration": "5 นาที",
          "title": "TAB reference",
          "instruction": "เล่น `m4-w15-call-response-tab` ช้าๆ แล้วดัดแปลงโน้ต 1-2 ตัวโดยยังรักษาสีเดิม"
        }
      ],
      "reflection": {
        "duration": "5 นาที",
        "instruction": "ฟังตัวเองแล้วเช็กว่า response ตอบ call จริงไหม หรือเป็นแค่การไล่สเกลอีกชุด"
      }
    },
    {
      "dayLabel": "Day 5-7",
      "focus": "Switch colors every 2 bars",
      "core": [
        {
          "duration": "5 นาที",
          "title": "2-bar Major / 2-bar Minor",
          "instruction": "เล่น Major 2 bars แล้ว Minor 2 bars วนช้าๆ กับ Metronome หรือ Backing Track"
        },
        {
          "duration": "5 นาที",
          "title": "Name before playing",
          "instruction": "ก่อนเริ่ม phrase ให้พูดว่า Major หรือ Minor เพื่อให้หูสั่งมือ"
        },
        {
          "duration": "5 นาที",
          "title": "Root reset",
          "instruction": "ถ้าหลง ให้กลับมาแตะ A สาย 6 เฟรต 5 แล้วเริ่ม phrase ใหม่"
        }
      ],
      "reflection": {
        "duration": "5 นาที",
        "instruction": "จดว่าเวลาเปลี่ยนสี คุณยังรู้สึก Root A อยู่ไหม หรือรู้สึกเหมือนย้ายคีย์"
      }
    }
  ]
}
```

## 8. Self-Check: `m4-w15-self-check`

```json
{
  "id": "m4-w15-self-check",
  "type": "self-check",
  "title": "เช็กว่าคุณสลับสีโดยไม่หลง Root ได้ไหม",
  "questions": [
    {
      "id": "m4-w15-q1-root-tracking",
      "type": "reflection",
      "question": "Can you keep hearing A as the Root while switching between Major and Minor Pentatonic?",
      "thaiPrompt": "ตอนสลับ Major / Minor คุณยังได้ยิน A เป็นบ้านอยู่ไหม หรือรู้สึกเหมือนหลุดไปคีย์อื่น?",
      "passSignal": "สลับสีได้โดยยังกลับมาแตะหรือได้ยิน Root A ในใจตลอด"
    },
    {
      "id": "m4-w15-q2-color-intention",
      "type": "reflection",
      "question": "Before playing a phrase, do you know whether you want the sweet Major color or the tough Minor color?",
      "thaiPrompt": "ก่อนเล่น phrase คุณรู้ไหมว่าต้องการสีหวานแบบ Major หรือสีดิบแบบ Minor?",
      "passSignal": "เลือกสี phrase ได้ก่อนเล่น ไม่ใช่เล่นไปแล้วค่อยมารู้ทีหลัง"
    }
  ],
  "passCriteria": [
    "เล่น Major call และ Minor response ได้ในพื้นที่ Root A เดิม",
    "บอกความต่างของ C# กับ C ด้วยหูได้",
    "สลับสีทุก 2 bars ได้โดยไม่เปิด Box 2-5",
    "ยังรู้สึก Root A เป็นบ้านตลอดการสลับสี",
    "phrase สั้น มีช่องว่าง และไม่กลายเป็นการไล่สเกลยาว"
  ],
  "troubleshooting": [
    {
      "problem": "Major กับ Minor ฟังเหมือนกันหมด",
      "advice": "แยกฟัง C# กับ C ก่อน อย่าเพิ่งเล่นทั้ง scale ให้ดีดสองโน้ตนี้สลับกันแล้วร้องตาม"
    },
    {
      "problem": "พอสลับสีแล้วหลง Root",
      "advice": "ให้แตะ A สาย 6 เฟรต 5 ก่อนเริ่มทุก phrase จนร่างกายจำว่าบ้านอยู่ตรงนี้"
    },
    {
      "problem": "phrase ยาวเกินและควบคุมสีไม่ได้",
      "advice": "จำกัด phrase เหลือ 3 โน้ต แล้วพัก 1 beat เหมือน Week 14 ก่อนค่อยเพิ่มเป็น 4-5 โน้ต"
    }
  ]
}
```

## 9. Renderer Dependency Analysis

- `m4-w15-ear-color-switching` ต้อง route ไปที่ `chordSoundLabs` ด้วย `type: "ear-training-lab"`
- Real data notes array สำหรับ Web Audio ต้องใช้ scientific pitch notation พร้อม octave profile เช่น `["A2", "B2", "C#3"]` และ `["A2", "C3", "D3"]`
- `m4-w15-overlay-major-ref` และ `m4-w15-overlay-minor-ref` ควร render เป็น stacked vertical flow บน mobile
- Fretboard visualizer ต้องใช้ Orientation Rule v2: String 1 / High e อยู่ด้านบน และ String 6 / Low E อยู่ด้านล่าง
- `m4-w15-call-response-tab` ต้อง render เป็น Clean Mini-TAB ที่ scroll ภายใน card ได้ ไม่ทำให้ body overflow
- `technique-drill` ใช้ convention แบบ root-level asset reference: `{ "type": "technique-drill", "drillRef": "m4-w15-switching-drill" }` อ้าง `techniqueDrills[]`
- `daily-practice` ต้องรองรับ structure แบบ 15-minute core + 5-minute reflection
- `self-check` ต้องรองรับ reflection questions และ troubleshooting
- ไม่ต้องใช้ staff notation
- ไม่ต้องสร้าง renderer สำหรับ full backing track production asset
- Production UI remains untouched

## 10. Guardrails for Implementation

- ห้ามเปิด Month 4 ใน production UI จากเอกสารนี้
- ห้ามแก้ `outputs/data.json` จากเอกสารนี้
- ห้ามแก้ `outputs/app.js`, `outputs/styles.css`, หรือ `outputs/index.html`
- ห้ามเพิ่ม Box 2, 3, 4 หรือ 5
- ห้ามทำให้บทนี้กลายเป็น speed หรือ finger expansion lesson
- ห้ามเพิ่ม Blues Scale, modes, arpeggio system ใหม่ หรือ chord-scale theory
- ห้ามใช้ external backing track, network audio หรือ audio file ภายนอก
- Backing Track ในเอกสารนี้หมายถึง internal Web Audio groove/drone หรือผู้เรียนเปิดเองภายนอกแอปเท่านั้น ห้ามเพิ่ม network audio หรือ external audio file เข้า production
- ถ้าทำ audio lab จริง ต้องใช้ Web Audio API หรือ fallback text เท่านั้น
- ถ้า renderer ยังไม่รองรับ stacked map comparison ให้ render แผนที่สองใบต่อกันใน vertical flow แทน complex layout

## 11. Revision Summary

1. Created canonical Month 4 Week 15 draft with `m4-w15-...` IDs.
2. Lesson title locked to `Major/Minor Pentatonic Color Switching`.
3. Strict region lock enforced: Root A on string 6 fret 5 remains the only geographic center.
4. Core allowed scale shapes limited to `A Major Pentatonic E-Shape` and `A Minor Pentatonic E-Shape`.
5. Pentatonic Box 2, 3, 4, and 5 are explicitly prohibited.
6. Call & Response focus added through Major call and Minor response phrasing.
7. Play By Ear thread position integrated: `เติม scale ได้ → phrasing ได้ → improvise ตามเพลงได้`.
8. `m4-w15-ear-color-switching` routed to `chordSoundLabs` with `type: "ear-training-lab"`.
9. Web Audio octave-profile requirement documented through explicit note arrays such as `A2`, `C#3`, `C3`, and `E3`.
10. `m4-w15-overlay-major-ref` and `m4-w15-overlay-minor-ref` specified as stacked vertical fretboard assets.
11. Orientation Rule v2 enforced: String 1 / High e on top, String 6 / Low E on bottom.
12. `m4-w15-call-response-tab` added as mobile-safe mini-TAB for Major Call → Minor Response.
13. `m4-w15-switching-drill` establishes a technique drill focused on switching colors every 2 bars with Metronome or Backing Track.
14. Daily practice set to 20 minutes: 15-minute color switching/call-response drill + 5-minute root & color listening reflection.
15. Backing Track language clarified: it means internal Web Audio groove/drone or learner-provided external playback only; no network audio or external audio files may be added to production.
16. Guardrails enforced against speed expansion, new boxes, staff notation, and production UI changes.
