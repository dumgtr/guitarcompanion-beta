# Month 3 Week 12 Draft: Voice Leading & Chord Tone Targeting

สถานะ: documentation/mock-data planning only
ห้ามแก้ `outputs/app.js`, `outputs/styles.css`, `outputs/index.html`, `outputs/data.json` จากเอกสารนี้
ห้ามเพิ่ม Month 3 เข้า production UI จนกว่าจะมี launch task แยกต่างหาก

## 1. Week Metadata

| Field | Value |
| --- | --- |
| stable week id | `m3-w12-voice-leading-chord-tone-targeting` |
| absolute week number | `12` |
| month number | `3` |
| month week index | `4` |
| module label | `Chord Tone & Arpeggio Foundation` |
| title | `Voice Leading & Chord Tone Targeting` |
| Thai title | `เล็งโน้ตในคอร์ดถัดไปให้ลง Beat 1` |
| estimated minutes per day | `20` |
| core daily practice | `15 นาที` |
| timing/cleanliness review | `+5 นาที` |
| core progression | `C - F - G - C` |
| flavor progression | `Cmaj7 - Fmaj7 - G7 - Cmaj7` |
| core practical target | ลงโน้ตตัวที่ 3 ของคอร์ดถัดไปให้ตรง Beat 1 |
| tempo target | `70 BPM` |

## 2. Week Promise

Week 12 เป็น Capstone Bridge ของ Month 3 ครับ เราจะเอาสิ่งที่เรียนมาแล้วมารวมเป็นเครื่องมือเล่นเพลงจริง:

- Week 9: รู้ว่า chord tones คือ 1-3-5
- Week 10: เล่น chord tones เป็น arpeggio motion
- Week 11: ได้ยินสีของ 7th chords
- Week 12: ใช้ chord tones เพื่อตามคอร์ด และเล็งโน้ตสำคัญให้ลง Beat 1

เป้าหมายหลักคือไม่เล่น scale แบบไหลตาบอดอีกต่อไป แต่รู้ล่วงหน้าว่าคอร์ดถัดไปกำลังจะมา และนิ้วจะไปลงที่โน้ตตัวไหนให้เพลงฟังชัดขึ้น

## 3. Scope Lock

### 3.1 Allowed Scope

- Progression หลัก: `C - F - G - C`
- Flavor integration: `Cmaj7 - Fmaj7 - G7 - Cmaj7`
- Target หลัก: โน้ตตัวที่ `3rd` ของคอร์ดถัดไปบน `Beat 1`
- C -> F: target 3rd ของ F คือ `A`
- F -> G: target 3rd ของ G คือ `B`
- G -> C: target 3rd ของ C คือ `E`
- ใช้ทางนิ้วที่สั้นที่สุดและสะอาดที่สุดเท่าที่มือทำได้

### 3.2 Explicitly Not Taught Yet

- ไม่สอน full jazz voice leading guides
- ไม่สอน guide-tone lines แบบ 3-7 lines
- ไม่สอน complex chord substitutions
- ไม่สอน slash chords เช่น `C/E`, `F/A`
- ไม่สอน full inversions
- ไม่สอน chromatic approach lines หนัก ๆ
- ไม่ขยายเกิน C-F-G-C เป็น progression หลัก
- ไม่เปลี่ยนบทนี้เป็น solo theory course

## 4. Compact Teacher Analogy

```json
{
  "type": "teacher-note",
  "id": "m3-w12-teacher-note-landing-pad",
  "title": "ครูแนะนำ: Beat 1 คือจุดลงจอด",
  "body": "ให้คิดว่า Beat 1 ของคอร์ดใหม่เป็นพื้นสนามบินครับ ก่อนถึงห้องถัดไป เราไม่ได้บินวนแบบ scale ไปเรื่อย ๆ แต่เลือกจุดลงจอดไว้ก่อน วันนี้จุดลงจอดหลักคือ 3rd ของคอร์ดถัดไป เพราะมันบอกสีของคอร์ดได้ชัดมาก"
}
```

## 5. Universal Renderer Block Structure

```json
{
  "week": 12,
  "number": 12,
  "month": 3,
  "module": "Chord Tone & Arpeggio Foundation",
  "title": "Voice Leading & Chord Tone Targeting",
  "summary": "ใช้ C-F-G-C เพื่อฝึกเล็ง 3rd ของคอร์ดถัดไปให้ลง Beat 1 แบบช้า ชัด และไม่ไหล scale ตาบอด",
  "estimatedMinutesPerDay": 20,
  "lessonBlocks": [
    { "type": "text", "id": "m3-w12-intro-targeting" },
    { "type": "teacher-note", "id": "m3-w12-voice-leading-concept" },
    { "type": "teacher-note", "id": "m3-w12-teacher-note-landing-pad" },
    { "type": "text", "id": "m3-w12-visualize-transitions" },
    { "type": "fretboard", "visualRef": "m3-w12-c-to-f-target-map" },
    { "type": "fretboard", "visualRef": "m3-w12-f-to-g-target-map" },
    { "type": "fretboard", "visualRef": "m3-w12-g-to-c-target-map" },
    { "type": "chord-lab", "labRef": "m3-w12-progression-lab" },
    { "type": "tab", "tabRef": "m3-w12-target-3rd-tab" },
    { "type": "mechanics-check", "checkRef": "m3-w12-clean-timing-check" },
    { "type": "self-check", "id": "m3-w12-self-check" }
  ]
}
```

## 6. Lesson Blocks Draft

### Block 1: `text`

```json
{
  "type": "text",
  "id": "m3-w12-intro-targeting",
  "title": "หยุดไหล scale ตาบอด แล้วเล็งโน้ตให้เพลงชัด",
  "body": [
    "เวลาผู้เล่นเริ่ม improvise ใหม่ ๆ มักจะไล่ scale ไปเรื่อย ๆ แล้วหวังว่าจะเจอโน้ตที่เข้าคอร์ด แต่วันนี้เราจะเปลี่ยนวิธีคิดครับ",
    "ก่อนคอร์ดใหม่จะมาถึง เราจะมองล่วงหน้าว่า 3rd ของคอร์ดถัดไปอยู่ตรงไหน แล้วตั้งใจลงโน้ตนั้นให้ตรง Beat 1",
    "ทำไมต้อง 3rd? เพราะ 3rd เป็นโน้ตที่บอกสีของคอร์ดชัดมาก ถ้าคอร์ดใหม่คือ F แล้วเราลง A บน Beat 1 หูจะรู้ทันทีว่าเราเข้าคอร์ด F จริง"
  ],
  "listenFor": [
    "เมื่อ target ถูก เพลงจะฟังเหมือนตามคอร์ดทัน",
    "เมื่อ target พลาด โน้ตจะฟังลอยหรือไม่ชัดว่ากำลังอยู่คอร์ดไหน",
    "Beat 1 ต้องรู้สึกมั่นคงและชัดกว่าโน้ตผ่านทาง"
  ],
  "feel": [
    "นิ้วเตรียมตำแหน่ง target ก่อนห้องใหม่มาถึง",
    "มือไม่กระโดดไกลเกินจำเป็น",
    "ดีด target note พร้อม Accent เล็ก ๆ บน Beat 1"
  ]
}
```

### Block 2: `teacher-note`

```json
{
  "type": "teacher-note",
  "id": "m3-w12-voice-leading-concept",
  "title": "Voice Leading แบบไม่ทำให้ทฤษฎีหนัก",
  "body": "Voice Leading ในบทนี้แปลแบบใช้งานจริงว่า ขยับนิ้วให้น้อยที่สุดเพื่อพาเสียงจากคอร์ดหนึ่งไปอีกคอร์ดหนึ่งให้ลื่นครับ เรายังไม่เรียน guide-tone lines, inversion หรือ jazz voice leading เต็มระบบ วันนี้แค่หาทางสั้นและสะอาดเพื่อให้ 3rd ของคอร์ดถัดไปลง Beat 1 ได้ตรงเวลา"
}
```

### Block 3: `teacher-note`

```json
{
  "type": "teacher-note",
  "id": "m3-w12-teacher-note-landing-pad",
  "title": "ครูแนะนำ: Beat 1 คือจุดลงจอด",
  "body": "ให้คิดว่า Beat 1 ของคอร์ดใหม่เป็นพื้นสนามบินครับ ก่อนถึงห้องถัดไป เราไม่ได้บินวนแบบ scale ไปเรื่อย ๆ แต่เลือกจุดลงจอดไว้ก่อน วันนี้จุดลงจอดหลักคือ 3rd ของคอร์ดถัดไป เพราะมันบอกสีของคอร์ดได้ชัดมาก"
}
```

### Block 4: `text`

```json
{
  "type": "text",
  "id": "m3-w12-visualize-transitions",
  "title": "ดูทางขยับก่อนเล่นจริง",
  "body": [
    "ต่อไปนี้เราจะดูแผนที่ทีละคู่ ไม่รวมเป็นภาพใหญ่จนลายตา",
    "แผนที่แรกคือ C ไป F: เราจะมอง chord tones ของ C แล้วขยับไปหา A ซึ่งเป็น 3rd ของ F",
    "แผนที่ที่สองคือ F ไป G: เราจะมอง chord tones ของ F แล้วขยับไปหา B ซึ่งเป็น 3rd ของ G",
    "แผนที่ที่สามคือ G กลับ C: เราจะมอง chord tones ของ G แล้วขยับไปหา E ซึ่งเป็น 3rd ของ C",
    "สามแผนที่นี้ทำให้ loop C-F-G-C สมบูรณ์ครบทุกจุดเปลี่ยน ผู้เรียนจะเห็นภาพครบ 100% ว่าควรลงโน้ตเป้าหมายตรงไหนในแต่ละ Beat 1",
    "จำไว้ว่าเป้าหมายไม่ใช่จำทุกทางเดิน แต่คือเห็น target ก่อน Beat 1 มาถึง"
  ]
}
```

### Block 5: `fretboard`

```json
{
  "type": "fretboard",
  "visualRef": "m3-w12-c-to-f-target-map"
}
```

Teacher copy:

ใน C -> F ให้คิดว่าเรากำลังออกจากบ้าน C แล้วจะลงที่สีของคอร์ด F ซึ่งคือ A ถ้านิ้วคุณอยู่แถว C-E-G ให้มองหาทางสั้นไปหา A ก่อน Beat 1 ของ F จะมาถึง

### Block 6: `fretboard`

```json
{
  "type": "fretboard",
  "visualRef": "m3-w12-f-to-g-target-map"
}
```

Teacher copy:

ใน F -> G เป้าหมายคือ B เพราะ B คือ 3rd ของ G ถ้าเราเล็ง B แล้วลงตรง Beat 1 คอร์ด G จะชัดทันที โดยไม่ต้องไหล scale ยาว ๆ

### Block 7: `fretboard`

```json
{
  "type": "fretboard",
  "visualRef": "m3-w12-g-to-c-target-map"
}
```

Teacher copy:

ใน G -> C เป้าหมายคือ E เพราะ E คือ 3rd ของ C จุดนี้คือการกลับบ้านให้จบครบ loop ถ้าลง E ตรง Beat 1 ของ C ได้ เสียง C จะฟังนิ่งและชัดทันที

### Block 8: `chord-lab`

```json
{
  "type": "chord-lab",
  "labRef": "m3-w12-progression-lab"
}
```

Teacher copy:

เปิด progression lab ช้า ๆ ที่ 70 BPM แล้วนับห้องให้ชัด เป้าหมายไม่ใช่เล่นเยอะ แต่คือรู้ว่าห้องถัดไปกำลังมา และ Beat 1 ของห้องนั้นจะลงที่ target 3rd ตัวไหน

### Block 9: `tab`

```json
{
  "type": "tab",
  "tabRef": "m3-w12-target-3rd-tab"
}
```

Teacher copy:

Beat 1 คือจังหวะตกแรกของห้องใหม่ ในบทนี้ target note ต้องลงตรง Beat 1 เพราะเป็นจุดที่หูรับรู้คอร์ดใหม่ชัดที่สุด

TAB นี้เขียนให้ target note ลงบน Beat 1 ชัด ๆ อย่าลาก target มาช้า และอย่ารีบเข้าก่อนจังหวะ ให้คิดว่าโน้ต A, B และ E คือหมุดของคอร์ดใหม่

### Block 10: `mechanics-check`

```json
{
  "type": "mechanics-check",
  "id": "m3-w12-clean-timing-check",
  "title": "เช็ก Timing และ Accent ของ Target Note",
  "when": "ก่อนเล่น target line ทุกครั้ง",
  "checks": [
    "นับ 1-2-3-4 ได้ชัดก่อนเล่น",
    "target note ลงตรง Beat 1 ไม่ก่อนและไม่หลัง",
    "ดีด target note ให้มี Accent เล็กน้อยแต่ไม่กระแทก",
    "นิ้วซ้ายแตะ fret ชัดก่อนมือขวาดีด",
    "ไม่ลากโน้ตผ่านทางจน target note เบลอ"
  ],
  "warningSigns": [
    "ลง target note ช้ากว่า Beat 1",
    "รีบเข้า target ก่อนคอร์ดเปลี่ยน",
    "กด target note ไม่ทันจนเสียงบอด",
    "เล่นโน้ตเยอะเกินจนลืมเป้าหมาย"
  ],
  "fixes": [
    "ลดเหลือ 60 BPM ชั่วคราว",
    "เล่นแค่โน้ต target บน Beat 1 ก่อน ไม่ต้องเติมโน้ตผ่านทาง",
    "พูดชื่อ target note ก่อนเล่น เช่น F ไป G เป้าคือ B"
  ]
}
```

### Block 11: `self-check`

```json
{
  "type": "self-check",
  "id": "m3-w12-self-check",
  "title": "เช็กว่าเห็น target ก่อนคอร์ดเปลี่ยนไหม",
  "questions": [
    {
      "id": "m3-w12-q1-visualize-next-third",
      "type": "reflection",
      "prompt": "ก่อนเปลี่ยนจาก C ไป F คุณเห็น A ซึ่งเป็น 3rd ของ F อยู่ในหัวหรือบนคอกีตาร์ก่อน Beat 1 มาถึงไหม?",
      "expectedReflection": "ผู้เรียนควรตอบได้ว่า A คือ 3rd ของ F และสามารถชี้ตำแหน่งที่ตั้งใจลงได้"
    },
    {
      "id": "m3-w12-q2-timing-downbeat",
      "type": "reflection",
      "prompt": "ตอนเปลี่ยนจาก F ไป G คุณลง B บน Beat 1 ได้ตรงจริงไหม หรือรู้สึกว่าลาก/รีบ?",
      "expectedReflection": "ผู้เรียนควรฟังออกว่า target note B ลงตรง Beat 1 หรือไม่ และรู้วิธีลด tempo เพื่อแก้"
    }
  ],
  "passCriteria": [
    "บอก 3rd ของ C, F และ G ได้",
    "ลง A บน Beat 1 ของ F ได้",
    "ลง B บน Beat 1 ของ G ได้",
    "ลง E บน Beat 1 ของ C ได้เมื่อกลับบ้าน",
    "เล่นช้าและชัดโดยไม่ไหล scale ตาบอด"
  ]
}
```

## 7. Required Root-Level Assets Draft

### 7.1 `chordSoundLabs`

Implementation note: `m3-w12-progression-lab` ต้องอยู่ใน root-level `chordSoundLabs` collection เพื่อ reuse Month 2 Web Audio engine เดิม แต่ประกาศ `type: "progression-lab"` เพื่อให้ renderer รู้ว่าเป็น progression preview ไม่ใช่ chord button ธรรมดา

```json
[
  {
    "id": "m3-w12-progression-lab",
    "type": "progression-lab",
    "title": "C - F - G - C Progression Lab",
    "bpm": 70,
    "timeSignature": "4/4",
    "audioMode": "web-audio-optional",
    "progressions": [
      {
        "id": "m3-w12-basic-cfgc",
        "label": "Core: C - F - G - C",
        "bars": [
          { "bar": 1, "chord": "C", "targetNext": { "nextChord": "F", "degree": "3", "note": "A" } },
          { "bar": 2, "chord": "F", "targetNext": { "nextChord": "G", "degree": "3", "note": "B" } },
          { "bar": 3, "chord": "G", "targetNext": { "nextChord": "C", "degree": "3", "note": "E" } },
          { "bar": 4, "chord": "C", "targetNext": null }
        ]
      },
      {
        "id": "m3-w12-flavor-cmaj7-fmaj7-g7-cmaj7",
        "label": "Flavor: Cmaj7 - Fmaj7 - G7 - Cmaj7",
        "optional": true,
        "bars": [
          { "bar": 1, "chord": "Cmaj7", "targetNext": { "nextChord": "Fmaj7", "degree": "3", "note": "A" } },
          { "bar": 2, "chord": "Fmaj7", "targetNext": { "nextChord": "G7", "degree": "3", "note": "B" } },
          { "bar": 3, "chord": "G7", "targetNext": { "nextChord": "Cmaj7", "degree": "3", "note": "E" } },
          { "bar": 4, "chord": "Cmaj7", "targetNext": null }
        ]
      }
    ],
    "listenFor": [
      "Beat 1 ของ F ต้องได้ยิน A ชัด",
      "Beat 1 ของ G ต้องได้ยิน B ชัด",
      "Beat 1 ของ C ต้องได้ยิน E ชัด",
      "ถ้า target note ไม่ชัด ให้ลดโน้ตผ่านทางลง"
    ],
    "fallbackText": "ถ้า Web Audio ไม่ทำงาน ให้ใช้ Metronome 70 BPM แล้วตีคอร์ด C-F-G-C ด้วยกีตาร์จริง พร้อมพูด target note ก่อนเข้าห้องใหม่"
  }
]
```

### 7.2 `fretboardVisuals`

```json
[
  {
    "id": "m3-w12-c-to-f-target-map",
    "type": "fretboard",
    "title": "C -> F: Target 3rd ของ F คือ A",
    "caption": "ใช้ดูทางสั้นจาก chord tones ของ C ไปหา A บน Beat 1 ของคอร์ด F",
    "config": { "startFret": 0, "endFret": 5, "showNut": true },
    "orientationNote": "แผนที่คอกีตาร์ใช้ TAB-style orientation: สาย 1 / High e อยู่ด้านบน และสาย 6 / Low E อยู่ด้านล่าง",
    "layout": {
      "group": "m3-w12-target-map-stack",
      "arrangement": "stacked-vertical",
      "order": 1,
      "mobile": "full-width-card"
    },
    "dots": [
      { "string": 5, "fret": 3, "label": "C", "degree": "C:1", "type": "from-chord" },
      { "string": 4, "fret": 2, "label": "E", "degree": "C:3", "type": "from-chord" },
      { "string": 3, "fret": 0, "label": "G", "degree": "C:5", "type": "from-chord" },
      { "string": 3, "fret": 2, "label": "A", "degree": "F:3", "type": "target" }
    ],
    "movement": [
      { "from": "G", "to": "A", "motion": "ขึ้น 1 whole step", "goal": "ลง A บน Beat 1 ของ F" }
    ],
    "legend": [
      { "type": "from-chord", "label": "Chord C tones" },
      { "type": "target", "label": "Target 3rd ของคอร์ดถัดไป" }
    ]
  },
  {
    "id": "m3-w12-f-to-g-target-map",
    "type": "fretboard",
    "title": "F -> G: Target 3rd ของ G คือ B",
    "caption": "ใช้ดูทางสั้นจาก chord tones ของ F ไปหา B บน Beat 1 ของคอร์ด G",
    "config": { "startFret": 0, "endFret": 5, "showNut": true },
    "layout": {
      "group": "m3-w12-target-map-stack",
      "arrangement": "stacked-vertical",
      "order": 2,
      "mobile": "full-width-card"
    },
    "dots": [
      { "string": 4, "fret": 3, "label": "F", "degree": "F:1", "type": "from-chord" },
      { "string": 3, "fret": 2, "label": "A", "degree": "F:3", "type": "from-chord" },
      { "string": 2, "fret": 1, "label": "C", "degree": "F:5", "type": "from-chord" },
      { "string": 2, "fret": 0, "label": "B", "degree": "G:3", "type": "target" }
    ],
    "movement": [
      { "from": "C", "to": "B", "motion": "ลงครึ่งเสียง", "goal": "ลง B บน Beat 1 ของ G" }
    ],
    "legend": [
      { "type": "from-chord", "label": "Chord F tones" },
      { "type": "target", "label": "Target 3rd ของคอร์ดถัดไป" }
    ]
  },
  {
    "id": "m3-w12-g-to-c-target-map",
    "type": "fretboard",
    "title": "G -> C: Target 3rd ของ C คือ E",
    "caption": "ใช้ดูทางสั้นจาก chord tones ของ G กลับมาหา E บน Beat 1 ของคอร์ด C เพื่อปิด loop C-F-G-C ให้ครบ",
    "config": { "startFret": 0, "endFret": 5, "showNut": true },
    "layout": {
      "group": "m3-w12-target-map-stack",
      "arrangement": "stacked-vertical",
      "order": 3,
      "mobile": "full-width-card"
    },
    "dots": [
      { "string": 6, "fret": 3, "label": "G", "degree": "G:1", "type": "from-chord" },
      { "string": 5, "fret": 2, "label": "B", "degree": "G:3", "type": "from-chord" },
      { "string": 4, "fret": 0, "label": "D", "degree": "G:5", "type": "from-chord" },
      { "string": 4, "fret": 2, "label": "E", "degree": "C:3", "type": "target" }
    ],
    "movement": [
      { "from": "D", "to": "E", "motion": "ขึ้น 1 whole step", "goal": "ลง E บน Beat 1 ของ C" }
    ],
    "legend": [
      { "type": "from-chord", "label": "Chord G tones" },
      { "type": "target", "label": "Target 3rd ของคอร์ดถัดไป" }
    ]
  }
]
```

### 7.3 `miniTabs`

```json
[
  {
    "id": "m3-w12-target-3rd-tab",
    "type": "tab",
    "title": "Target 3rd on Beat 1",
    "bpm": 70,
    "ascii": [
      "e|----------------|----------------|----------------|----------------|",
      "B|------1---------|----------------|0---------------|--1-------------|",
      "G|--0-------0-----|2-----0---------|--0-------------|----0-----------|",
      "D|----2-----------|----3-----------|----0-----------|2-----0---------|",
      "A|3---------------|------3---------|------2---------|--3-------------|",
      "E|----------------|----------------|------3---------|----------------|"
    ],
    "lyrics": "  |C approach      |A(F:3)          |B(G:3)          |E(C:3)          |",
    "beatLine": "  |1---2---3---4---|1---2---3---4---|1---2---3---4---|1---2---3---4---|",
    "targetLine": "  |                |^ Beat 1        |^ Beat 1        |^ Beat 1        |",
    "targetNotes": [
      { "bar": 2, "beat": 1, "note": "A", "targetOf": "F", "degree": "3", "tabString": 3, "fret": 2 },
      { "bar": 3, "beat": 1, "note": "B", "targetOf": "G", "degree": "3", "tabString": 2, "fret": 0 },
      { "bar": 4, "beat": 1, "note": "E", "targetOf": "C", "degree": "3", "tabString": 4, "fret": 2 }
    ],
    "note": "โน้ต target ต้องลงตรง Beat 1 ของห้องใหม่ ถ้าไม่ตรง ให้ลด tempo และเล่นเฉพาะ target note ก่อน"
  }
]
```

Mobile note: TAB ต้อง scroll ภายใน card เท่านั้น ห้ามทำให้ body เกิด horizontal overflow

### 7.4 `mechanicsChecks`

```json
[
  {
    "id": "m3-w12-clean-timing-check",
    "type": "mechanics-check",
    "title": "Clean Timing Target Check",
    "checks": [
      "นับ Beat 1 ชัด",
      "target note มี Accent เล็กน้อย",
      "นิ้วซ้ายแตะ fret ก่อนดีด",
      "ไม่ลากหรือรีบ target note",
      "เล่นน้อยแต่ชัด"
    ]
  }
]
```

## 8. Structured Daily Practice: 15-Minute Core + 5-Minute Timing Review

```json
[
  {
    "dayLabel": "Day 1-2",
    "focus": "C -> F: ลง A บน Beat 1",
    "isOpen": true,
    "totalDuration": "20 นาที",
    "coreDuration": "15 นาที",
    "reviewDuration": "5 นาที",
    "exercises": [
      {
        "id": "m3-w12-d1-p1",
        "duration": "4 นาที",
        "title": "ดู C -> F target map",
        "instruction": "ดู `m3-w12-c-to-f-target-map` แล้วชี้ A ซึ่งเป็น 3rd ของ F ก่อนเล่น"
      },
      {
        "id": "m3-w12-d1-p2",
        "duration": "4 นาที",
        "title": "Progression lab 70 BPM",
        "instruction": "เปิด `m3-w12-progression-lab` แล้วเล่นแค่ target A บน Beat 1 ของ F",
        "labRef": "m3-w12-progression-lab"
      },
      {
        "id": "m3-w12-d1-p3",
        "duration": "4 นาที",
        "title": "Chord tone approach",
        "instruction": "เล่น C หรือ G เป็นโน้ตผ่านทาง แล้วลง A ให้ตรง Beat 1"
      },
      {
        "id": "m3-w12-d1-p4",
        "duration": "3 นาที",
        "title": "Timing check",
        "instruction": "ใช้ `m3-w12-clean-timing-check` เช็กว่า A ไม่มาก่อนหรือหลัง Beat 1"
      }
    ],
    "review": {
      "duration": "5 นาที",
      "title": "ฟังความชัดของ A",
      "instruction": "อัดเสียงสั้น ๆ แล้วฟังว่า A ทำให้คอร์ด F ชัดขึ้นไหม"
    }
  },
  {
    "dayLabel": "Day 3-4",
    "focus": "F -> G: ลง B บน Beat 1",
    "isOpen": false,
    "totalDuration": "20 นาที",
    "coreDuration": "15 นาที",
    "reviewDuration": "5 นาที",
    "exercises": [
      {
        "id": "m3-w12-d3-p1",
        "duration": "4 นาที",
        "title": "ดู F -> G target map",
        "instruction": "ดู `m3-w12-f-to-g-target-map` แล้วชี้ B ซึ่งเป็น 3rd ของ G ก่อนเล่น"
      },
      {
        "id": "m3-w12-d3-p2",
        "duration": "4 นาที",
        "title": "Progression lab 70 BPM",
        "instruction": "เล่นแค่ target B บน Beat 1 ของ G ก่อนเติมโน้ตอื่น"
      },
      {
        "id": "m3-w12-d3-p3",
        "duration": "4 นาที",
        "title": "Shortest movement",
        "instruction": "ลองขยับจาก C ไป B หรือ A ไป B แบบใกล้ที่สุด ไม่ต้องกระโดดไกล"
      },
      {
        "id": "m3-w12-d3-p4",
        "duration": "3 นาที",
        "title": "Accent control",
        "instruction": "ดีด B ให้มี Accent เล็กน้อยบน Beat 1 ไม่กระแทกเกิน"
      }
    ],
    "review": {
      "duration": "5 นาที",
      "title": "ฟังว่า G ชัดไหม",
      "instruction": "อัดเสียง F -> G แล้วฟังว่า B ทำให้คอร์ด G ชัดขึ้นไหม"
    }
  },
  {
    "dayLabel": "Day 5",
    "focus": "G -> C: ลง E บน Beat 1",
    "isOpen": false,
    "totalDuration": "20 นาที",
    "coreDuration": "15 นาที",
    "reviewDuration": "5 นาที",
    "exercises": [
      {
        "id": "m3-w12-d5-p1",
        "duration": "4 นาที",
        "title": "ดู G -> C target map",
        "instruction": "ดู `m3-w12-g-to-c-target-map` แล้วชี้ E ซึ่งเป็น 3rd ของ C ก่อนเล่น"
      },
      {
        "id": "m3-w12-d5-p2",
        "duration": "4 นาที",
        "title": "G -> C resolve",
        "instruction": "เล่น G แล้วลง E บน Beat 1 ของ C ให้ชัด"
      },
      {
        "id": "m3-w12-d5-p3",
        "duration": "4 นาที",
        "title": "Flavor progression optional",
        "instruction": "ลอง Cmaj7 - Fmaj7 - G7 - Cmaj7 ถ้ายังนิ่งพอ แต่ยัง target 3rd เหมือนเดิม"
      },
      {
        "id": "m3-w12-d5-p4",
        "duration": "3 นาที",
        "title": "Reduce notes",
        "instruction": "ถ้าหลุด timing ให้เล่นเฉพาะ E บน Beat 1 ไม่ต้องเติมโน้ตอื่น"
      }
    ],
    "review": {
      "duration": "5 นาที",
      "title": "ฟังการกลับบ้าน",
      "instruction": "ฟังว่า E บน Beat 1 ทำให้ C ฟังชัดขึ้นหรือไม่"
    }
  },
  {
    "dayLabel": "Day 6-7",
    "focus": "C-F-G-C full targeting line",
    "isOpen": false,
    "totalDuration": "20 นาที",
    "coreDuration": "15 นาที",
    "reviewDuration": "5 นาที",
    "exercises": [
      {
        "id": "m3-w12-d6-p1",
        "duration": "5 นาที",
        "title": "เล่น `m3-w12-target-3rd-tab`",
        "instruction": "เล่น TAB ช้า ๆ ที่ 70 BPM และให้ A, B, E ลง Beat 1"
      },
      {
        "id": "m3-w12-d6-p2",
        "duration": "4 นาที",
        "title": "พูด target ก่อนห้องใหม่",
        "instruction": "ก่อนเข้าห้อง F พูด A, ก่อนเข้าห้อง G พูด B, ก่อนกลับ C พูด E"
      },
      {
        "id": "m3-w12-d6-p3",
        "duration": "3 นาที",
        "title": "Progression lab",
        "instruction": "เปิด `m3-w12-progression-lab` แล้วเล่นน้อยที่สุดแต่ target ให้ชัด"
      },
      {
        "id": "m3-w12-d6-p4",
        "duration": "3 นาที",
        "title": "Self-check",
        "instruction": "ตอบคำถามสะท้อนตัวเอง 2 ข้อด้านล่าง"
      }
    ],
    "review": {
      "duration": "5 นาที",
      "title": "ฟัง timing/cleanliness",
      "instruction": "อัดเสียงหนึ่งรอบ แล้วฟังว่า target note ตรง Beat 1 และเสียงชัดไหม"
    }
  }
]
```

## 9. Reflective Self-Check

```json
{
  "id": "m3-w12-self-check",
  "type": "self-check",
  "title": "2 คำถามปิด Month 3",
  "questions": [
    {
      "id": "m3-w12-q1-visualize-target",
      "type": "reflection",
      "prompt": "ก่อนคอร์ดจะเปลี่ยน คุณเห็น 3rd ของคอร์ดถัดไปในหัวหรือบนคอกีตาร์ก่อน Beat 1 มาถึงไหม?",
      "expectedReflection": "ผู้เรียนควรตอบชื่อ target ได้ เช่น C -> F เป้าคือ A, F -> G เป้าคือ B, G -> C เป้าคือ E"
    },
    {
      "id": "m3-w12-q2-clean-downbeat",
      "type": "reflection",
      "prompt": "เมื่อฟังอัดเสียงตัวเอง target note ลง Beat 1 ชัดไหม หรือมีอาการลาก/รีบ?",
      "expectedReflection": "ผู้เรียนควรฟัง timing ของตัวเองออก และรู้ว่าจะลด tempo หรือเล่นเฉพาะ target note เพื่อแก้"
    }
  ],
  "passCriteria": [
    "บอก 3rd ของ C, F, G ได้ทันที",
    "ลง A บน Beat 1 ของ F ได้",
    "ลง B บน Beat 1 ของ G ได้",
    "ลง E บน Beat 1 ของ C ได้",
    "เล่น C-F-G-C target line ได้โดยไม่ต้องไหล scale ตาบอด"
  ]
}
```

## 10. Renderer Dependency Analysis

### Reusable from Month 2 engine

- `text`
- `teacher-note` as text fallback
- `fretboard`
- `tab`
- `chordSoundLabs` Web Audio path for progression playback
- `mechanics-check` as checklist fallback

### Needs text fallback first

- `progression-lab` behavior inside `chordSoundLabs`
- target-note highlighting in TAB
- movement arrows or labels on fretboard visuals
- self-check reflection format

### Fallback behavior

- ถ้า `progression-lab` ยังไม่มี renderer ให้แสดงเป็น chord list + Metronome instruction ที่ 70 BPM
- ถ้า Web Audio ไม่ทำงาน ให้ใช้ `fallbackText` และให้ผู้เรียนตีคอร์ดจริง
- ถ้า fretboard movement arrows ยังไม่พร้อม ให้ใช้ `movement[]` เป็น text list ใต้แผนที่
- ถ้า TAB highlight ยังไม่พร้อม ให้ใช้ `targetNotes[]` เป็นรายการใต้ TAB

## 11. Minimum Viable Launch Content

ถ้าจะสร้าง mock data จริงรอบแรก ต้องมีอย่างน้อย:

1. `m3-w12-intro-targeting`
2. `m3-w12-voice-leading-concept`
3. `m3-w12-visualize-transitions`
4. `m3-w12-c-to-f-target-map`
5. `m3-w12-f-to-g-target-map`
6. `m3-w12-g-to-c-target-map`
7. `m3-w12-progression-lab`
8. `m3-w12-target-3rd-tab`
9. `m3-w12-clean-timing-check`
10. `m3-w12-self-check`

Optional but useful:

- `m3-w12-teacher-note-landing-pad`
- flavor progression inside `m3-w12-progression-lab`
- target note highlight styling inside TAB renderer

## 12. Week 12 Guardrails

- Topic must stay Voice Leading & Chord Tone Targeting
- Core progression stays C-F-G-C
- Optional flavor progression can use Cmaj7-Fmaj7-G7-Cmaj7
- Core target is 3rd of the upcoming chord on Beat 1
- ห้ามสอน full jazz voice leading guides
- ห้ามสอน guide-tone lines แบบ 3-7 lines
- ห้ามสอน complex chord substitutions
- ห้ามสอน full inversions หรือ slash chords เช่น C/E, F/A
- ห้ามขยายเป็น chromatic approach system
- ห้ามเปลี่ยนเป็น solo theory course
- ต้องเน้น shortest physical finger transition ที่สะอาดและตรงจังหวะ

## 13. Open Decisions Before Creating Real Data

- `progression-lab` จะ reuse UI ของ `chord-lab` เดิม หรือสร้าง presentation เฉพาะแบบ progression timeline
- ควร highlight target notes ใน TAB ด้วยสีหรือใช้ text labels ใต้ TAB ก่อน
- ควรเก็บ flavor progression เป็น optional collapsed card หรือแสดงใต้ core progression ทันที

## 14. Revision Summary

1. Canonical `m3-w12-...` IDs applied across lesson blocks, assets, daily practice, self-check, and minimum viable content.
2. Week 12 finalized as Month 3 Capstone Bridge: 1-3-5 formulas, arpeggio motion, and 7th colors are synthesized into chord tone targeting.
3. `m3-w12-progression-lab` routed to root-level `chordSoundLabs` with `type: "progression-lab"` and 70 BPM slow playback behavior.
4. Fretboard visuals split into three standalone stacked assets: `m3-w12-c-to-f-target-map`, `m3-w12-f-to-g-target-map`, and `m3-w12-g-to-c-target-map`, completing the full C-F-G-C harmonic loop.
5. Core target rule enforced: land the 3rd degree of the upcoming chord exactly on Beat 1.
6. `m3-w12-target-3rd-tab` QA aligned so A, B, and E visually land at the first position of Bar 2, Bar 3, and Bar 4.
7. Rhythm reminder from `RHYTHM_FOUNDATION_GAP_PLAN.md` added before the TAB block to clarify Beat 1 as the first downbeat of the new bar.
8. Guardrails enforced against full jazz voice leading, guide-tone 3-7 lines, substitutions, slash chords, full inversions, and scale scrolling.
9. Production UI remains unchanged.
