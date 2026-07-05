# Week 0 Rhythm Basics Draft: Basic Rhythm Vocabulary for Guitarists

สถานะ: documentation-only / mock-data and content planning
ห้ามแก้ไฟล์ `outputs/app.js`, `outputs/styles.css`, `outputs/index.html`, `outputs/data.json` หรือเปิด Week 0 ใน production UI จากเอกสารนี้

## 1. Module Purpose

Week 0 คือด่านปรับพื้นฐานก่อนเริ่ม Month 1 ครับ เป้าหมายไม่ใช่สอนทฤษฎีโน้ต แต่คือทำให้ผู้เรียนเข้าใจคำศัพท์จังหวะพื้นฐานแบบที่มือกีตาร์ใช้จริง

ในเชิงสถาปัตยกรรมหลักสูตร Week 0 เป็น **Foundation / Prelude onboarding module** ไม่ใช่ Month 0 ที่ต้องมี tab แยกใน navigation หลักของแอป ผู้เรียนควรเจอบทนี้ในฐานะด่านปูพื้นก่อนเริ่ม Month 1 หรือผ่านลิงก์ onboarding เฉพาะเท่านั้น

- Beat
- Tempo / BPM
- Bar / Measure
- Time Signature / 4/4
- Downbeat / Beat 1
- Upbeat / "&"
- Downstroke / Upstroke ในฐานะทิศทางมือขวา

บทนี้ควรรู้สึกเหมือนครูกำลังนั่งอยู่ข้างๆ แล้วบอกว่า "ก่อนจับคอกีตาร์ เรามาตั้งนาฬิกาในตัวให้ตรงกันก่อนครับ"

## 2. Scope Lock

### 2.1 Allowed Scope

- ใช้ Metronome ที่ 60 BPM และ 80 BPM
- ใช้การเคาะเท้า ตบมือ นับเสียงดัง และตีสายบอด
- อธิบาย 4/4 แบบใช้งานจริง: นับ 1-2-3-4 แล้วขึ้นห้องใหม่
- แยก Beat/Upbeat ออกจาก Downstroke/Upstroke ให้ชัด
- ใช้คำว่า Downbeat อย่างระวัง: Beat 1 คือ downbeat หลักของห้องใหม่

### 2.2 Not Taught Yet

- ไม่ใช้ staff notation
- ไม่บังคับอ่านโน้ตสากล
- ไม่สอน 16th notes ในบทนี้
- ไม่สอน triplets หรือ compound time เป็นแบบฝึกหลัก
- ไม่ทำให้บทนี้กลายเป็นคอร์สอ่าน rhythm notation
- ไม่เพิ่ม module ใหม่ใน production UI

## 3. Week Metadata Draft

```json
{
  "id": "w0-rhythm-basics",
  "week": 0,
  "month": null,
  "module": "Foundation / Prelude",
  "title": "Rhythm Basics: Beat, Tempo, Bar, 4/4, Downbeat & Upbeat",
  "thaiTitle": "พื้นฐานจังหวะที่มือกีตาร์ต้องรู้",
  "summary": "ตั้งภาษากลางเรื่องจังหวะก่อนเริ่ม Month 1 ด้วยการเคาะเท้า ตบมือ นับเสียงดัง และตีสายบอด",
  "estimatedMinutesPerDay": 10,
  "maxMinutesPerDay": 15,
  "primaryPlacement": "ก่อนเริ่ม Month 1",
  "uiPlacement": "Foundation / Prelude onboarding only; must not render as visible Month 0 tab",
  "rendererNote": "บทนี้ไม่ต้องใช้ fretboard visual renderer"
}
```

## 4. Universal Renderer Block Structure

```json
{
  "week": 0,
  "month": null,
  "module": "Foundation / Prelude",
  "title": "Rhythm Basics",
  "lessonBlocks": [
    { "type": "text", "id": "w0-rhythm-intro" },
    { "type": "teacher-note", "id": "w0-rhythm-glossary" },
    { "type": "technique-drill", "id": "w0-rhythm-clap-drill" },
    { "type": "technique-drill", "id": "w0-rhythm-muted-strum-drill" },
    { "type": "daily-practice", "id": "w0-rhythm-daily-practice" },
    { "type": "self-check", "id": "w0-rhythm-self-check" }
  ]
}
```

## 5. Lesson Blocks Draft

### Block 1: `w0-rhythm-intro`

```json
{
  "type": "text",
  "id": "w0-rhythm-intro",
  "title": "ก่อนจับคอกีตาร์ เรามาตั้งชีพจรให้ตรงกันก่อน",
  "body": [
    "ดนตรีเหมือนมีหัวใจเต้นอยู่ข้างในครับ ต่อให้เรายังไม่ได้จับคอร์ด เพลงก็ยังมี Pulse หรือจังหวะหลักที่เดินอยู่ตลอดเวลา",
    "ก่อนเริ่ม Month 1 ผมอยากให้เราตกลงภาษาเดียวกันก่อน เวลาได้ยินคำว่า Beat, Tempo, Bar, Downbeat หรือ Upbeat คุณจะไม่ต้องเดาแล้วว่าครูหมายถึงอะไร",
    "บทนี้เราจะไม่อ่านโน้ตสากล ไม่เปิดทฤษฎีหนักๆ และไม่ต้องจำศัพท์ให้สวยหรู เราจะใช้ร่างกายก่อน: เคาะเท้า ตบมือ นับออกเสียง แล้วค่อยเอามือขวาไปตีสายบอดบนกีตาร์"
  ],
  "teacherTone": "ใจเย็น ชัด และชวนทำตามทันที",
  "studentOutcome": [
    "นับ 1 2 3 4 ได้มั่นคง",
    "รู้ว่า Beat 1 คือจุดเริ่มห้องใหม่",
    "แยก Downbeat/Upbeat ออกจาก Downstroke/Upstroke ได้"
  ]
}
```

### Block 2: `w0-rhythm-glossary`

```json
{
  "type": "teacher-note",
  "id": "w0-rhythm-glossary",
  "title": "คำศัพท์จังหวะที่ต้องใช้ร่วมกัน",
  "items": [
    {
      "term": "Beat",
      "thai": "บีท / จังหวะหลัก",
      "explanation": "Beat คือจังหวะหลักที่เดินอย่างสม่ำเสมอ เหมือนเสียงเข็มนาฬิกาหรือชีพจร ถ้าเปิด Metronome แล้วได้ยินคลิก นั่นคือจุดให้เราจับชีพจรของเพลง"
    },
    {
      "term": "Tempo / BPM",
      "thai": "ความเร็วของจังหวะ",
      "explanation": "Tempo คือความเร็วของ Beat วัดเป็น BPM หรือ Beats Per Minute เช่น 60 BPM คือ 1 นาทีมี 60 beat หรือประมาณ 1 beat ต่อ 1 วินาที"
    },
    {
      "term": "Bar / Measure",
      "thai": "ห้องเพลง",
      "explanation": "Bar คือการเอา Beat หลายๆ ตัวมาจัดเป็นกล่อง เพื่อให้เราไม่หลงทาง เวลานับ 1 2 3 4 ครบแล้วเริ่ม 1 ใหม่ นั่นคือเราเริ่มห้องใหม่"
    },
    {
      "term": "Time Signature / 4/4",
      "thai": "อัตราจังหวะ 4/4",
      "explanation": "ใน 4/4 เลขบน 4 หมายถึง 1 ห้องมี 4 จังหวะ ส่วนเลขล่าง 4 หมายถึงใช้โน้ตตัวดำเป็น 1 beat แต่ในบทนี้ยังไม่ต้องอ่านโน้ตลึกครับ ให้จำก่อนว่า 4/4 คือเรานับ 1-2-3-4 แล้วขึ้นห้องใหม่"
    },
    {
      "term": "Downbeat",
      "thai": "จังหวะตก / Beat 1",
      "explanation": "Downbeat มี 2 ระดับความหมายครับ ในความหมายหลักทางดนตรี Downbeat คือ Beat 1 ของห้องใหม่ เป็นจุดลงน้ำหนักที่ทำให้เรารู้สึกว่าเพลงเริ่มรอบใหม่ ส่วนในการฝึกกีตาร์เบื้องต้น ครูอาจใช้คำว่า 'จังหวะตก' กับเลข 1-2-3-4 เพื่อแยกจากจังหวะยก แต่ Beat 1 คือจุดตกที่สำคัญที่สุด"
    },
    {
      "term": "Upbeat",
      "thai": "จังหวะยก / &",
      "explanation": "Upbeat คือจังหวะที่อยู่ระหว่างเลข เช่น 1 & 2 & 3 & 4 & ตัว '&' คือช่วงที่เท้าหรือมือรู้สึกยกกลับขึ้นมา"
    }
  ],
  "teacherNote": {
    "title": "อย่าสับสน: Beat กับ Stroke คนละเรื่องกัน",
    "body": "Downbeat คือ 'ตำแหน่งเวลา' ในเพลง ส่วน Downstroke คือ 'ทิศทางการดีดลง' ของมือขวา Upbeat คือจังหวะ '&' ที่อยู่ระหว่างเลข ส่วน Upstroke คือการดีดขึ้น ในแบบฝึกพื้นฐานเรามักให้ Downstroke ตรงเลข และ Upstroke ตรง & เพื่อให้เข้าใจง่าย แต่สองคำนี้ไม่ใช่สิ่งเดียวกัน"
  }
}
```

### Block 3: `w0-rhythm-clap-drill`

```json
{
  "type": "technique-drill",
  "id": "w0-rhythm-clap-drill",
  "title": "เปิด Metronome แล้วนับให้ร่างกายรู้เวลา",
  "tempo": 60,
  "instructions": [
    "เปิด Metronome ที่ 60 BPM",
    "เคาะเท้าตามทุกคลิก",
    "นับออกเสียง 1 2 3 4 แล้ววนกลับไป 1 ใหม่",
    "รอบถัดไปให้นับ 1 & 2 & 3 & 4 & โดยให้เลขตรงกับคลิก และ '&' อยู่ระหว่างคลิก",
    "ตบมือตรงเลข 1 2 3 4 ก่อน ถ้านิ่งแล้วค่อยพูด '&' แทรกระหว่างเลข"
  ],
  "countingText": "1 & 2 & 3 & 4 &",
  "listenFor": [
    "เลข 1 2 3 4 ต้องไม่เร่งหนี Metronome",
    "คำว่า '&' ต้องอยู่กลางทางระหว่างเลข ไม่ติดเลขก่อนหรือหลังเกินไป"
  ],
  "feel": [
    "เท้าลงพื้นตรงเลข",
    "ร่างกายรู้สึกเหมือนมีลูกตุ้มแกว่งสม่ำเสมอ",
    "พอครบ 4 แล้วรู้สึกได้ว่าห้องใหม่กำลังเริ่ม"
  ]
}
```

### Block 4: `w0-rhythm-muted-strum-drill`

```json
{
  "type": "technique-drill",
  "id": "w0-rhythm-muted-strum-drill",
  "title": "ตีสายบอด: Downstroke บนเลข, Upstroke บน &",
  "setup": [
    "ใช้มือซ้ายแตะสายเบาๆ ให้เสียงบอด ไม่ต้องกดคอร์ด",
    "มือขวาถือปิ๊กหรือใช้นิ้วตามที่ถนัด",
    "เปิด Metronome ที่ 60 BPM"
  ],
  "pattern": {
    "count": "1 & 2 & 3 & 4 &",
    "rightHand": "D U D U D U D U",
    "legend": [
      { "symbol": "D", "meaning": "Downstroke / ดีดลง" },
      { "symbol": "U", "meaning": "Upstroke / ดีดขึ้น" }
    ]
  },
  "steps": [
    "ดีดลง (Downstroke) เฉพาะเลข 1 2 3 4",
    "ดีดขึ้น (Upstroke) เฉพาะ '&' ระหว่างเลข",
    "อย่าพยายามดังหรือเร็ว ให้เสียงบอดสั้นๆ และตรงเวลา",
    "ถ้าหลุด ให้หยุด แล้วกลับไปนับเสียงดังก่อน"
  ],
  "teacherWarning": "นี่เป็นแบบฝึกพื้นฐานเพื่อให้มือกับเวลาเข้าที่ ไม่ใช่กฎสากลว่าทุก rhythm ต้อง Downstroke บนเลขและ Upstroke บน '&' เสมอ",
  "noFretboardRequired": true
}
```

### Block 5: `w0-rhythm-daily-practice`

```json
{
  "type": "daily-practice",
  "id": "w0-rhythm-daily-practice",
  "title": "ซ้อม 10-15 นาที: ตั้งเวลาในตัวให้ตรง",
  "totalDuration": "10-15 นาที",
  "tasks": [
    {
      "id": "w0-rhythm-daily-1",
      "duration": "2 นาที",
      "title": "Clap quarter notes",
      "instruction": "เปิด Metronome 60 BPM แล้วตบมือให้ตรงทุกคลิก"
    },
    {
      "id": "w0-rhythm-daily-2",
      "duration": "2 นาที",
      "title": "Count 1-2-3-4",
      "instruction": "ตบมือพร้อมนับ 1 2 3 4 ดังๆ วนไปเรื่อยๆ"
    },
    {
      "id": "w0-rhythm-daily-3",
      "duration": "3 นาที",
      "title": "Count 1 & 2 & 3 & 4 &",
      "instruction": "เลข 1 2 3 4 อยู่ตรงคลิก ส่วน '&' อยู่ระหว่างคลิก"
    },
    {
      "id": "w0-rhythm-daily-4",
      "duration": "2 นาที",
      "title": "Accent Beat 1",
      "instruction": "ตบมือให้ดังขึ้นเฉพาะเลข 1 เพื่อให้รู้สึกว่าห้องใหม่เริ่มตรงไหน"
    },
    {
      "id": "w0-rhythm-daily-5",
      "duration": "3 นาที",
      "title": "Muted strumming",
      "instruction": "จับสายบอด ดีดลงบนเลข 1 2 3 4 และดีดขึ้นบน '&'"
    },
    {
      "id": "w0-rhythm-daily-6",
      "duration": "3 นาที",
      "title": "Tempo check 80 BPM",
      "instruction": "ถ้า 60 BPM เริ่มนิ่ง ให้ลอง 80 BPM แล้วทำข้อ 2-5 ซ้ำแบบไม่รีบ"
    }
  ]
}
```

### Block 6: `w0-rhythm-self-check`

```json
{
  "type": "self-check",
  "id": "w0-rhythm-self-check",
  "title": "เช็กว่าภาษาเรื่องจังหวะเริ่มตรงกันหรือยัง",
  "questions": [
    {
      "id": "w0-rhythm-q1-foot-down",
      "type": "reflection",
      "prompt": "เวลาเคาะเท้าตาม Metronome เท้าเหยียบพื้นตรงเลข 1 2 3 4 หรืออยู่ตรง '&'?",
      "expectedAnswer": "เท้าเหยียบพื้นตรงเลข 1 2 3 4 ส่วน '&' คือจังหวะยกที่อยู่ระหว่างเลข"
    },
    {
      "id": "w0-rhythm-q2-beat-one",
      "type": "reflection",
      "prompt": "Beat 1 สำคัญอย่างไรเมื่อเทียบกับเลข 2 3 4?",
      "expectedAnswer": "Beat 1 คือจังหวะตกแรกของห้องใหม่ เป็นจุดเริ่มรอบใหม่และเป็นจุดลงน้ำหนักที่สำคัญที่สุด"
    }
  ],
  "passCriteria": [
    "นับ 1 2 3 4 ได้โดยไม่หลุดจาก Metronome",
    "พูด 1 & 2 & 3 & 4 & ได้สม่ำเสมอ",
    "แยก Downbeat/Upbeat ออกจาก Downstroke/Upstroke ได้",
    "ตีสายบอด Downstroke บนเลขและ Upstroke บน '&' ได้ช้าๆ โดยไม่เกร็ง"
  ]
}
```

## 6. Renderer and Data Notes

- บทนี้ไม่ต้องใช้ `fretboardVisuals`
- บทนี้ไม่ต้องใช้ `miniTabs` แบบอ่านโน้ตหรือ TAB จริง
- `w0-rhythm-muted-strum-drill` ควร render เป็น card แบบ technique drill หรือ text-pattern card ก็พอ
- `w0-rhythm-clap-drill` ใช้ `technique-drill` เพื่อเลี่ยงการสร้าง renderer ใหม่
- ถ้า renderer ยังไม่มี `daily-practice` เฉพาะ Week 0 ให้ใช้ checklist card ธรรมดาได้
- ห้ามทำให้ block นี้เรียก network, audio file, หรือ external media

## 7. Teacher Notes for Future Integration

เมื่อผู้เรียนเข้าสู่ Month 1:
- Week 1 สามารถอ้างกลับมาที่ `w0-rhythm-glossary` เมื่อพูดถึง Pulse และ Beat
- Week 2 สามารถอ้างกลับมาที่ `w0-rhythm-clap-drill` เมื่อเริ่ม Syncopation
- Month 3 Week 12 ควรใช้ reminder นี้ก่อน target-note exercise:

> "Beat 1 คือจังหวะตกแรกของห้องใหม่ ในบทนี้ target note ต้องลงตรง Beat 1 เพราะเป็นจุดที่หูรับรู้คอร์ดใหม่ชัดที่สุด"

## 8. Guardrails

- Keep Week 0 as Foundation / Prelude onboarding before Month 1
- Week 0 must not render as a visible "Month 0" tab in the main UI navigation
- Do not expose Week 0 in production UI until a separate launch task exists
- Do not turn this into notation theory
- Do not teach 16th notes, triplets, compound time drills, or advanced subdivisions here
- Do not require fretboard knowledge
- Do not require chord changes
- Keep language practical, physical, and calm
- Keep the student moving: clap, count, tap, mute-strum

## 9. Revision Summary

1. Canonical `w0-rhythm-...` IDs applied.
2. Core rhythm vocabulary drafted from `RHYTHM_FOUNDATION_GAP_PLAN.md`.
3. 4/4 explained with top/bottom number meaning while keeping the lesson beginner-friendly.
4. Downbeat vs counted beats clarified.
5. Downbeat/downstroke and upbeat/upstroke distinction included.
6. Daily 10-15 minute practice structure drafted.
7. No fretboard visual renderer required.
8. Block types standardized to kebab-case: `daily-practice` and `self-check`.
9. `w0-rhythm-clap-drill` downgraded to `technique-drill` to avoid introducing an `interactive-text` renderer.
10. Week 0 clarified as Foundation / Prelude onboarding and must not render as a visible Month 0 tab.
11. Production app files remain unchanged.
