# Month 2: Data Shape Spec

เอกสารนี้กำหนดโครงสร้างข้อมูล (JSON Schema) สำหรับ Month 2 เพื่อให้ทีมเตรียม `data.json` ได้ถูกต้องก่อนเริ่มเขียน UI

สถานะเอกสาร: documentation only ยังไม่ใช่งานแก้ UI, loader, CSS, JS หรือ `outputs/data.json`

## Guiding Rules

- Month 2 ยังเป็น Fretboard Foundation + Play by Form Seed
- ทุกข้อมูลต้องช่วยตอบว่า "วันนี้ซ้อมอะไร เล่นตรงไหน ฟังอะไร และรู้ได้อย่างไรว่าพร้อมไปต่อ"
- ภาษา learner-facing เป็นภาษาไทย แต่เก็บ music terms ภาษาอังกฤษเมื่อเป็นคำที่นักดนตรีใช้จริง เช่น Root, Octave, Major Scale, CAGED, Form, Metronome
- โครงสร้างควรเป็น JSON ธรรมดา อ่านง่าย และไม่ผูกกับ framework
- รูปภาพคอกีตาร์ควรวาดจากข้อมูลด้วย HTML/CSS ไม่พึ่งรูปภาพหรือ network

## 1. Fretboard Visualizer (`fretboardVisual`)

โครงสร้างสำหรับวาดแผนภาพคอกีตาร์จำลองด้วย CSS Grid โดยไม่ต้องพึ่งพารูปภาพ

```json
{
  "id": "w5-root-landmarks-s6",
  "type": "fretboard",
  "title": "Landmarks บนสาย 6",
  "caption": "สังเกตจุดไข่ปลา (Dots) บนเฟรต 3, 5, 7 เพื่อใช้เป็นหลักหมุดในการหา Root",
  "config": {
    "startFret": 1,
    "endFret": 8,
    "showNut": true
  },
  "legend": [
    { "type": "root", "color": "orange", "label": "Root (โน้ตบ้าน)" },
    { "type": "landmark", "color": "gray", "label": "Landmark (หมุดอ้างอิง)" }
  ],
  "dots": [
    { "string": 6, "fret": 3, "label": "G", "type": "root" },
    { "string": 6, "fret": 5, "label": "A", "type": "landmark" },
    { "string": 6, "fret": 7, "label": "B", "type": "landmark" }
  ]
}
```

### Field Rules

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | unique id สำหรับอ้างอิงจาก lesson หรือ week object เช่น `w5-root-landmarks-s6` |
| `type` | string | yes | ใช้ `"fretboard"` เสมอ |
| `title` | string | yes | ชื่อภาพที่ผู้เรียนเห็น เช่น `Landmarks บนสาย 6` |
| `caption` | string | yes | คำอธิบายสั้น ๆ ว่าภาพนี้ให้สังเกตอะไรและเอาไปซ้อมอย่างไร |
| `config.startFret` | number | yes | fret แรกที่แสดง |
| `config.endFret` | number | yes | fret สุดท้ายที่แสดง |
| `config.showNut` | boolean | yes | ใช้ `true` เมื่อเริ่มจาก open string หรือ fret 0 |
| `legend` | object[] | yes | รายการคำอธิบายชนิดของ dot ที่แสดงในภาพ |
| `legend[].type` | string | yes | ต้องตรงกับ `dots[].type` เพื่อให้ renderer map สีและความหมายได้ |
| `legend[].color` | string | yes | ชื่อสีเชิง semantic สำหรับ renderer เช่น `orange`, `gray`, `gold` |
| `legend[].label` | string | yes | ข้อความที่ผู้เรียนเห็น เช่น `Root (โน้ตบ้าน)` |
| `dots[].string` | number | yes | 1 = สายล่างสุดเสียงสูง, 6 = สายบนสุดเสียงต่ำ |
| `dots[].fret` | number | yes | ตำแหน่ง fret จริง |
| `dots[].label` | string | yes | ข้อความสั้นบน dot เช่น `R`, `3`, `5`, `C` |
| `dots[].type` | string | yes | ใช้ style แยกสีและต้องสัมพันธ์กับ legend เช่น `root`, `landmark`, `octave`, `scale-tone`, `chord-tone`, `target` |

### Teaching Use

- Week 5 ใช้แสดง Root บนสาย 6 และสาย 5
- Week 6 ใช้แสดง octave shape
- Week 7 ใช้แสดง Major Scale 1 octave และ degree 1, 3, 5
- Week 8 ใช้แสดง CAGED 3 positions และ I-IV-V root movement

## 2. Clean Mini-TAB (`miniTab`)

โครงสร้างสำหรับแบบฝึก TAB สั้น ๆ ที่อ่านง่ายบนมือถือ ไม่ใช่ tab library ขนาดใหญ่

```json
{
  "id": "w6-c-major-scale",
  "type": "tab",
  "title": "C Major Scale (1 Octave)",
  "bpm": 60,
  "ascii": [
    "e|-------------------------|",
    "B|-------------------------|",
    "G|----------2--4--5--------|",
    "D|----2--3--5--------------|",
    "A|--3--5-------------------|",
    "E|-------------------------|"
  ],
  "lyrics": ["โด(C)", "เร(D)", "มี(E)", "ฟา(F)", "ซอล(G)", "ลา(A)", "ที(B)", "โด(C)"],
  "note": "ร้องทางเดิน: ฮัมเสียงตามทุกครั้งที่ดึงสาย"
}
```

### Field Rules

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | unique id สำหรับอ้างอิงจาก lesson |
| `type` | string | yes | ใช้ `"tab"` สำหรับ Mini-TAB แบบ compact |
| `title` | string | yes | ชื่อแบบฝึก |
| `bpm` | number | yes | tempo แนะนำ |
| `ascii` | string[] | yes | TAB 6 บรรทัด เก็บเป็น array เรียง e, B, G, D, A, E เพื่อให้ renderer จัด layout ได้ง่าย |
| `lyrics` | string[] | yes | ชื่อโน้ตหรือคำร้องกำกับตามลำดับโน้ตที่เล่นจริง |
| `note` | string | yes | คำแนะนำสั้น ๆ ว่าต้องร้อง ฟัง หรือรู้สึกอะไรระหว่างเล่น |

### Teaching Use

Mini-TAB ควรสั้นพอที่ผู้เรียนเปิดมือถือแล้วเล่นตามได้ทันที ถ้า TAB ยาวเกินไป ให้แตกเป็นหลาย exercise แทน

## 3. Lesson Flow (`lessonFlow`)

โครงสร้างบทเรียนหลักของแต่ละสัปดาห์ ใช้เก็บเนื้อหาครูอธิบายและอ้างอิง visual / TAB / quiz

```json
{
  "type": "lesson-flow",
  "id": "week-5-note-landmarks",
  "week": 5,
  "title": "Note Landmarks",
  "teacherOpening": "สัปดาห์นี้เราจะยังไม่จำทั้งคอกีตาร์ เป้าหมายคือหาจุดยึดให้เจอก่อน",
  "whyThisMatters": "ถ้ารู้ว่า Root อยู่ตรงไหน เวลาเริ่มเพลงหรือเปลี่ยนคีย์เราจะไม่ต้องเดา",
  "coreIdea": "เริ่มจากสาย 6 และสาย 5 ใช้ fret 0, 3, 5, 7, 9, 12 เป็น landmark ก่อน",
  "stepByStepPractice": [
    "เปิด Metronome ที่ 50-60 BPM",
    "พูดชื่อโน้ตก่อนเล่น",
    "เล่นสาย 6 ช้า ๆ",
    "เล่นสาย 5 ช้า ๆ",
    "หา C, G, D, A, E"
  ],
  "listenFor": [
    "Root ควรรู้สึกเหมือนบ้าน",
    "เสียงต้องลงพร้อม click"
  ],
  "physicalFeel": [
    "ไหล่ไม่ยก",
    "นิ้วซ้ายกดใกล้ fret แต่ไม่บีบแรง",
    "มือขวาดีดเบาและสม่ำเสมอ"
  ],
  "visualRefs": ["w5-root-landmarks-s6"],
  "miniTabRefs": ["w5-root-hunt-cgd"],
  "dailyPracticeRef": "w5-daily-practice",
  "selfCheckRef": "w5-self-check",
  "commonMistakes": [
    "พยายามจำทุกสายพร้อมกัน",
    "ดีดก่อนพูดชื่อโน้ต",
    "รีบเล่นเร็วเพื่อให้ดูเหมือนคล่อง"
  ],
  "teacherNote": "วันนี้ไม่ต้องรู้เยอะ ขอให้รู้จริง ถ้าหา Root ได้ช้าแต่มั่นใจ ดีกว่าดูเหมือนเร็วแต่เดาไปเรื่อย ๆ",
  "miniMusicalApplication": {
    "title": "Root ก่อนคอร์ด",
    "instruction": "เล่น Root ของ A หนึ่งห้อง แล้วตีคอร์ด A อีกหนึ่งห้อง",
    "bpm": 60
  }
}
```

### Field Rules

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `type` | string | yes | ใช้ `"lesson-flow"` |
| `id` | string | yes | unique lesson id |
| `week` | number | yes | 5-8 สำหรับ Month 2 |
| `title` | string | yes | ชื่อสัปดาห์ |
| `teacherOpening` | string | yes | เปิดบทแบบครูกีตาร์ |
| `whyThisMatters` | string | yes | เหตุผลเชิงดนตรีและการซ้อม |
| `coreIdea` | string | yes | แก่นเดียวของวันนี้ |
| `stepByStepPractice` | string[] | yes | ลำดับซ้อม |
| `listenFor` | string[] | yes | สิ่งที่ต้องฟัง |
| `physicalFeel` | string[] | yes | สิ่งที่ร่างกายควรรู้สึก |
| `visualRefs` | string[] | optional | อ้างอิง `fretboardVisual.id` |
| `miniTabRefs` | string[] | optional | อ้างอิง `miniTab.id` |
| `dailyPracticeRef` | string | yes | อ้างอิง daily practice |
| `selfCheckRef` | string | yes | อ้างอิง self-check |
| `teacherNote` | string | yes | note สั้น ๆ แบบครูแนะนำ |
| `miniMusicalApplication` | object | yes | งานดนตรีเล็ก ๆ ที่ใช้บทเรียนจริง |

### Teaching Use

หนึ่ง lesson ไม่ควรพยายามสอนทุกอย่าง ให้มีแก่นเดียว และพาเล่นจนผู้เรียนรู้สึกว่า "อ๋อ วันนี้ฉันทำสิ่งนี้ได้แล้ว"

## 4. Daily Practice (`dailyPractice`)

โครงสร้างงานซ้อมรายวันสำหรับ Month 2 แต่ละสัปดาห์ ควรสั้น ชัด และใช้เวลาจริงได้

```json
{
  "type": "daily-practice",
  "id": "w5-daily-practice",
  "week": 5,
  "title": "Week 5 Daily Practice: Note Landmarks",
  "defaultBpm": 60,
  "days": [
    {
      "day": 1,
      "title": "สาย 6 เป็นแผนที่แรก",
      "totalMinutes": 20,
      "tasks": [
        {
          "label": "ฟัง Metronome",
          "minutes": 3,
          "instruction": "เปิด 60 BPM แล้วเคาะเท้าโดยยังไม่เล่น"
        },
        {
          "label": "พูดชื่อโน้ตสาย 6",
          "minutes": 5,
          "instruction": "พูดชื่อโน้ตก่อนดีดทุกครั้ง"
        },
        {
          "label": "Root Hunt",
          "minutes": 8,
          "instruction": "หา C, G, D, A, E บนสาย 6"
        },
        {
          "label": "Self-check",
          "minutes": 4,
          "instruction": "จับเวลา 60 วินาทีแล้วดูว่าหา Root ได้กี่ตัวโดยไม่เดา"
        }
      ]
    }
  ]
}
```

### Field Rules

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `type` | string | yes | ใช้ `"daily-practice"` |
| `id` | string | yes | unique id |
| `week` | number | yes | สัปดาห์ที่เกี่ยวข้อง |
| `title` | string | yes | ชื่อชุดซ้อม |
| `defaultBpm` | number | yes | BPM เริ่มต้น |
| `days` | object[] | yes | อย่างน้อย 5-7 วันต่อสัปดาห์เมื่อทำจริง |
| `days[].day` | number | yes | ลำดับวัน |
| `days[].totalMinutes` | number | yes | เวลารวมโดยประมาณ |
| `tasks[].label` | string | yes | ชื่อ task สั้น |
| `tasks[].minutes` | number | yes | เวลาซ้อม |
| `tasks[].instruction` | string | yes | คำสั่งซ้อมแบบชัดเจน |

### Teaching Use

Daily Practice ต้องให้ผู้เรียนเปิดแล้วรู้ทันทีว่าวันนี้ทำอะไร ไม่ควรเป็นบทความยาว และไม่ควรมี task มากจนรู้สึกแพ้ตั้งแต่ยังไม่เริ่ม

## 5. Self-check / Quiz (`selfCheck`)

โครงสร้างแบบทดสอบและการเช็กตัวเอง ใช้ยืนยันว่าผู้เรียนพร้อมไปต่อ โดยไม่ทำให้รู้สึกเหมือนสอบทฤษฎีหนัก

```json
{
  "type": "self-check",
  "id": "w5-self-check",
  "week": 5,
  "title": "เช็กว่า Root เริ่มนิ่งหรือยัง",
  "questions": [
    {
      "id": "w5-q1",
      "type": "multiple-choice",
      "prompt": "Root ในบทนี้หมายถึงอะไร",
      "choices": [
        { "id": "a", "text": "เสียงบ้านของคอร์ดหรือสเกล" },
        { "id": "b", "text": "โน้ตที่ต้องเล่นเร็วที่สุด" },
        { "id": "c", "text": "ตำแหน่งที่ต้องใช้เฉพาะ solo" }
      ],
      "answer": "a",
      "feedback": {
        "correct": "ใช่ Root คือเสียงบ้าน ถ้ารู้บ้าน มือจะไม่เดาง่าย",
        "incorrect": "ลองคิดว่า Root คือจุดที่เพลงอยากพัก ไม่ใช่โน้ตที่ต้องเล่นเร็ว"
      }
    },
    {
      "id": "w5-q2",
      "type": "practical-check",
      "prompt": "จับเวลา 60 วินาที หา C, G, D, A, E บนสาย 6 และสาย 5 ได้กี่ตัว",
      "passCondition": "หาได้อย่างน้อย 8 ตำแหน่ง โดยพูดชื่อโน้ตก่อนเล่น"
    }
  ],
  "passSummary": "พร้อมไปต่อเมื่อหา Root สำคัญได้โดยไม่เดา และยังเล่นตรง Metronome"
}
```

### Field Rules

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `type` | string | yes | ใช้ `"self-check"` |
| `id` | string | yes | unique id |
| `week` | number | yes | สัปดาห์ที่เกี่ยวข้อง |
| `title` | string | yes | ชื่อ self-check |
| `questions` | object[] | yes | มีทั้งคำถามความเข้าใจและ practical check ได้ |
| `questions[].type` | string | yes | เช่น `multiple-choice`, `true-false`, `practical-check`, `reflection` |
| `questions[].prompt` | string | yes | คำถามภาษาไทย |
| `questions[].choices` | object[] | optional | ใช้กับ multiple choice |
| `questions[].answer` | string | optional | id ของคำตอบถูก |
| `questions[].feedback` | object | optional | feedback ถูก/ผิด แบบครูแนะนำ |
| `questions[].passCondition` | string | optional | ใช้กับ practical check |
| `passSummary` | string | yes | สรุปว่าเมื่อไรพร้อมไปต่อ |

### Teaching Use

Self-check ต้องวัดพฤติกรรมจริง เช่น "หา Root ได้ไหม", "ยังตรง click ไหม", "ฟังว่ากลับบ้านได้ไหม" มากกว่าวัดการท่องศัพท์

## 6. Play by Form Seed (`playByForm`)

โครงสร้างสำหรับ seed แนวคิด Play by Form ใน Month 2 แบบเบา ๆ โดยยังไม่สอน Nashville Number System เต็มระบบ

```json
{
  "type": "play-by-form",
  "id": "w8-key-a-i-iv-v",
  "week": 8,
  "key": "A",
  "tempo": 60,
  "teacherFraming": "ตอนนี้ยังไม่ต้องจำระบบ Nashville ทั้งหมด แค่เริ่มรู้ว่าเพลงไม่ได้เป็นคอร์ดแยก ๆ แต่มีบ้าน มีทางออก และมีทางกลับบ้าน",
  "progression": [
    {
      "degree": "I",
      "chord": "A",
      "thaiFunction": "บ้าน",
      "roots": [
        { "string": 6, "fret": 5 },
        { "string": 5, "fret": 12 }
      ]
    },
    {
      "degree": "IV",
      "chord": "D",
      "thaiFunction": "เปิดออก",
      "roots": [
        { "string": 5, "fret": 5 }
      ]
    },
    {
      "degree": "V",
      "chord": "E",
      "thaiFunction": "ดึงกลับ",
      "roots": [
        { "string": 6, "fret": 0 },
        { "string": 5, "fret": 7 }
      ]
    }
  ],
  "practiceSteps": [
    "หา A Root ก่อน",
    "เล่น A, D, E ช้า ๆ หนึ่งคอร์ดต่อหนึ่งห้อง",
    "พูดหน้าที่ของคอร์ดก่อนเล่น",
    "กลับมาที่ A แล้วพูดว่า บ้าน"
  ],
  "listenFor": [
    "I รู้สึกเหมือนพัก",
    "IV รู้สึกเหมือนเพลงเปิดออก",
    "V รู้สึกเหมือนอยากกลับ I"
  ],
  "futureExpansion": "ใช้เป็นสะพานไปสู่ 12-bar blues, Nashville Basics และ chord-tone soloing ในเดือนต่อไป"
}
```

### Field Rules

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `type` | string | yes | ใช้ `"play-by-form"` |
| `id` | string | yes | unique id |
| `week` | number | yes | โดยมากเริ่มใช้จริงใน Week 8 |
| `key` | string | yes | key ของ exercise |
| `tempo` | number | yes | BPM แนะนำ |
| `teacherFraming` | string | yes | framing สั้น ๆ กันไม่ให้ผู้เรียนคิดว่าเป็นทฤษฎีหนัก |
| `progression` | object[] | yes | รายการ degree / chord / function |
| `progression[].degree` | string | yes | เช่น `I`, `IV`, `V`, `vi` |
| `progression[].chord` | string | yes | chord name ใน key นั้น |
| `progression[].thaiFunction` | string | yes | เช่น `บ้าน`, `เปิดออก`, `ดึงกลับ` |
| `progression[].roots` | object[] | yes | ตำแหน่ง Root ที่ใช้จริง |
| `practiceSteps` | string[] | yes | ขั้นตอนซ้อม |
| `listenFor` | string[] | yes | สิ่งที่ต้องฟัง |
| `futureExpansion` | string | optional | note สำหรับเดือนต่อไป |

### Teaching Use

Play by Form ใน Month 2 ต้องเป็น seed เท่านั้น จุดประสงค์คือให้ผู้เรียนเริ่มรู้สึกว่า I-IV-V เป็นทิศทางของเพลง ไม่ใช่ให้จำระบบตัวเลขทั้งหมด

## Suggested Week-level Assembly

เมื่อต้องรวมข้อมูลใน `data.json` สามารถให้ week object อ้างอิง component เหล่านี้ด้วย id แทนการยัดทุกอย่างไว้ก้อนเดียว

```json
{
  "week": 8,
  "month": 2,
  "title": "CAGED 3 Positions",
  "module": "fretboard",
  "lessonFlow": "week-8-caged-3-positions",
  "fretboardVisuals": ["w8-caged-3-roots", "w8-i-iv-v-root-map"],
  "miniTabs": ["w8-caged-fragment-a", "w8-i-iv-v-key-a"],
  "dailyPractice": "w8-daily-practice",
  "selfCheck": "w8-self-check",
  "playByForm": "w8-key-a-i-iv-v"
}
```

## Implementation Guardrails

- เอกสารนี้ยังไม่เปิด Month 2 ใน UI
- ห้ามแก้ loader จากเอกสารนี้อย่างเดียว
- ห้ามเพิ่ม network call หรือ package
- ถ้า UI ยังไม่พร้อม ให้เก็บข้อมูลเป็น future data stub ได้
- ถ้า component ไหนยังไม่ render ให้ data ยังต้องอ่านแล้วไม่ทำให้ Month 1 พัง
- ทุก component ต้อง degrade ได้ เช่น ถ้าไม่มี `fretboardVisual` บทเรียนยังควรอ่านเนื้อหา text ได้

## Next-step TODOs

- ตรวจ `outputs/data.json` ว่ามี Week 5-8 field ใดที่ควร map เข้ากับ data shape นี้ในอนาคต
- เลือก naming convention ของ id ให้คงที่ เช่น `w5-root-hunt-cgd`
- สร้างตัวอย่างข้อมูลจริงหนึ่งชุดต่อสัปดาห์ก่อนเริ่ม UI
- ออกแบบ renderer ทีละ component โดยไม่เปิด Month 2 ให้ผู้เรียนหลักจนกว่าจะพร้อม
