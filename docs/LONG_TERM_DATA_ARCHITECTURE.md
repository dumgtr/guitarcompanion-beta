# Long-Term Data Architecture

เอกสารนี้วางภาพรวม data architecture ระยะยาวของ Guitar Companion หลัง Month 2 Launch Stable เพื่อให้รองรับ Month 3-10 และ micro-skill integration โดยไม่ทำให้ product scope บวม

สถานะ: documentation only  
ไม่แก้ production app, ไม่เปิด future months, ไม่เพิ่ม Arpeggio หรือ Modes ใน visible UI

## 1. Architecture Goal

เป้าหมายคือให้ curriculum data เติบโตได้แบบมีวินัย:

* Month 1 ยังคงเป็น default fresh-load
* Month 2 เปิดผ่าน main-content Month Switcher แล้ว
* Month 3+ อยู่ใน data architecture ได้ แต่ต้อง hidden จนกว่าจะเปิด scope
* micro-skills เป็น lesson blocks ไม่ใช่ modules ใหม่
* renderer ต้องรองรับ unknown block อย่างสุภาพ

## 2. Layered Data Model

```text
Root Data
  ├─ meta
  ├─ visibility policy
  ├─ months[]
  ├─ weeks[]
  │    └─ lessonBlocks[]
  │         ├─ core teaching blocks
  │         ├─ visual blocks
  │         ├─ audio / ear blocks
  │         └─ micro-skill blocks
  ├─ root-level visual assets
  ├─ root-level audio/lab assets
  └─ microSkillAssets
```

หลักคิด:

* `weeks[]` คือแหล่งเรียงลำดับการเรียน
* `lessonBlocks[]` คือพื้นที่สอนจริง
* root-level assets เก็บเฉพาะข้อมูลที่ reuse หรือใหญ่เกินกว่าจะวาง inline
* UI visibility แยกจากการมีอยู่ของ data

## 3. Visibility Policy

Production UI ต้องอ่านเฉพาะเดือนที่อนุญาต

```json
{
  "visibilityPolicy": {
    "defaultMonth": 1,
    "availableMonths": [1, 2],
    "hiddenMonths": [3, 4, 5, 6, 7, 8, 9, 10],
    "deferredTopics": {
      "Arpeggio": "Month 3: Chord Tone & Arpeggio Foundation",
      "Modes": "Month 6 / Modal Color Foundation"
    }
  }
}
```

Rules:

* ห้ามใช้การมี data เป็นเหตุผลให้เปิด UI
* Month Switcher ต้องอิง `availableMonths`
* hidden months อาจอยู่ใน docs หรือ future data ได้ แต่ต้องไม่ render ใน production

## 4. Micro-Skill as Embedded Blocks

Micro-skill ต้องวางใน lesson ไม่ใช่เพิ่ม module

```json
{
  "type": "phrase-lab",
  "id": "m5-w18-dynamic-phrase-variation",
  "title": "เปลี่ยนวลีเดิมด้วยน้ำหนักมือ",
  "skill": "dynamic phrasing",
  "duration": "5 นาที"
}
```

เหตุผล:

* ผู้เรียนเห็นสิ่งที่ต้องซ้อมวันนี้ทันที
* ไม่ต้องมี navigation ซ้อน
* ครูสามารถแทรกเทคนิคตอนที่มันจำเป็นจริง
* roadmap ไม่แตกเป็น course ย่อย

## 5. Future Month Data Responsibilities

| Month | Data Responsibility | Micro-Skill Role |
| --- | --- | --- |
| Month 1 | rhythm grids, daily practice, pulse checks | muting, chucking, rhythm reading |
| Month 2 | fretboard visuals, mini TAB, chord lab | visual intervals around Root, 3rd, 5th, 7th |
| Month 3: Chord Tone & Arpeggio Foundation | chord tone maps, arpeggio-ready foundations, chord quality labs, voice-leading maps | chord quality hearing, voice leading |
| Month 4 | scale maps, picking drills, legato checks | picking mechanics, legato |
| Month 5 | blues phrasing, target note phrasing | bending, vibrato, dynamic phrasing |
| Month 6 | pitch-axis comparisons, drone profiles | modal color hearing, drone practice |
| Month 7-8 | blues/style application phrases | blues curl, microtonal bending, hybrid picking |
| Month 9 | transcription prompts and listening journals | active transcribing |
| Month 10 | fingerstyle layers and thumb patterns | thumb independence, Travis picking |

## 6. Root-Level Asset Groups

Recommended future root fields:

```json
{
  "fretboardVisuals": [],
  "miniTabs": [],
  "chordSoundLabs": [],
  "microSkillAssets": {
    "intervalMaps": [],
    "chordToneOverlays": [],
    "voiceLeadingMaps": [],
    "droneProfiles": [],
    "modeColorProfiles": [],
    "phrasePatterns": [],
    "transcriptionPrompts": [],
    "arrangementLayers": [],
    "mechanicsChecks": []
  }
}
```

Rules:

* ถ้า asset ใช้ครั้งเดียวและสั้น วาง inline ใน block ได้
* ถ้า asset reuse หรือมีข้อมูลหลายจุด ให้ใช้ root-level และอ้างด้วย `Ref`
* asset ต้องไม่บังคับให้ UI เปิดเดือนใหม่

## 7. Renderer Strategy

Renderer ควรมี switch ตาม `block.type`

```js
switch (block.type) {
  case "text":
  case "fretboard":
  case "tab":
  case "chord-lab":
    // existing supported renderers
    break;
  case "technique-drill":
  case "ear-training-lab":
  case "interval-map":
    // future micro-skill renderers
    break;
  default:
    renderUnsupportedBlock(block);
}
```

Rules:

* unknown block ต้องไม่ทำให้ทั้ง lesson พัง
* component CSS ต้อง scoped
* audio ต้อง optional
* no network, no iframe, no package

## 8. Storage Strategy

Progress ของ micro-skill ยังไม่ควรออกแบบใหญ่เกินไป

ตัวเลือกในอนาคต:

* `weekProgress`: ยังใช้ completion รายสัปดาห์
* `dailyPractice`: checkbox รายวัน
* `microSkillProgress`: optional สำหรับ block ที่ต้อง track เฉพาะ

Recommendation:

เริ่มจากไม่ persist micro-skill แยก เว้นแต่ผู้ใช้ต้องการดูประวัติทักษะย่อยจริง ๆ

## 9. Performance Strategy

Future data อาจใหญ่ขึ้น จึงควรรักษาหลัก:

* Month 1 และ Month 2 ที่ visible ต้องโหลดเร็ว
* future heavy assets ควร lazy-load เมื่อเปิด scope
* audio profile ใช้ Web Audio API parameters ไม่ใช้ MP3/WAV
* TAB และ fretboard เป็น text/data ไม่ใช่รูปภาพ

## 10. Documentation Relationship

เอกสารที่เกี่ยวข้อง:

* `docs/MICRO_SKILL_INTEGRATION_PLAN.md`
* `docs/RENDERER_BLOCK_TYPES.md`
* `docs/CONTENT_SCHEMA_V3.md`
* `docs/MONTH2_DATA_SHAPE_SPEC.md`
* `docs/MONTH2_RENDERER_SPEC.md`
* `CURRICULUM_ROADMAP.md`

การตัดสินใจ schema ใหม่ควรอัปเดตเอกสารเหล่านี้ก่อนแตะ production code

## 11. Open Decisions Before Implementation

ก่อนเริ่ม implement micro-skill renderer จริง ต้องตอบ:

* จะเปิด block type ไหนก่อนเป็นชุดแรก
* จะเริ่มจาก prototype หรือ production hidden engine
* จะเก็บ micro-skill progress หรือยังไม่เก็บ
* จะให้ audio labs ใช้ Web Audio API ทุกตัวหรือเฉพาะบางประเภท
* จะมี max interactive blocks ต่อ lesson หรือไม่
* จะเขียน migration จาก schema v2 ไป v3 อย่างไร
