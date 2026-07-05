# Content Schema v3

เอกสารนี้เสนอ schema รุ่นถัดไปสำหรับ Guitar Companion เพื่อรองรับ micro-skill blocks ใน future months โดยไม่เพิ่มสัปดาห์ ไม่เปิด future months ใน UI และไม่ทำให้ roadmap บวม

สถานะ: documentation only

## 1. Design Goals

Schema v3 ต้องรองรับ:

* Month 1 และ Month 2 ที่มีอยู่แล้ว
* future Month 3-10 แบบ hidden จนกว่าจะเปิด scope
* micro-skill blocks ที่ฝังใน `lessonBlocks[]`
* root-level reusable assets สำหรับ visual, TAB, audio profile และ lab data
* fallback ที่ไม่ทำให้ app พังถ้า renderer ยังไม่รองรับ block บางชนิด

Schema v3 ไม่ได้หมายความว่า:

* ต้องแก้ `outputs/data.json` ทันที
* ต้องเปิด Month 3+
* ต้องเพิ่ม Arpeggio หรือ Modes ใน visible UI
* ต้องเพิ่มจำนวน weeks

## 2. Root Object

```json
{
  "schemaVersion": "3.0",
  "meta": {
    "title": "Guitar Companion Curriculum",
    "language": "th",
    "visibilityPolicy": "controlled-month-switcher"
  },
  "months": [],
  "weeks": [],
  "fretboardVisuals": [],
  "miniTabs": [],
  "chordSoundLabs": [],
  "microSkillAssets": {
    "intervalMaps": [],
    "chordToneOverlays": [],
    "voiceLeadingMaps": [],
    "droneProfiles": [],
    "phrasePatterns": [],
    "transcriptionPrompts": [],
    "arrangementLayers": [],
    "mechanicsChecks": []
  }
}
```

## 3. Month Object

```json
{
  "month": 4,
  "title": "Scale Foundation",
  "module": "Scale Foundation",
  "status": "hidden",
  "defaultWeek": 13,
  "microSkillFocus": ["alternate picking", "legato"],
  "guardrails": [
    "ไม่ทำ speed-drill month",
    "ไม่เปิดใน UI จนกว่าจะได้รับ scope ชัดเจน"
  ]
}
```

Field rules:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `month` | number | yes | เลขเดือนใน roadmap |
| `title` | string | yes | ชื่อที่ใช้ใน docs หรือ future UI |
| `module` | string | yes | label สั้น เช่น `Fretboard Foundation` |
| `status` | string | yes | `visible`, `hidden`, `prototype`, `frozen` |
| `defaultWeek` | number | optional | week แรกของเดือนนั้น |
| `microSkillFocus` | string[] | optional | micro-skills หลักของเดือน |
| `guardrails` | string[] | optional | ข้อห้ามของเดือนนั้น |

## 4. Week Object

```json
{
  "week": 13,
  "number": 13,
  "month": 4,
  "module": "Scale Foundation",
  "title": "Scale Navigation",
  "summary": "เดินสเกลให้เป็นประโยคและคุมมือขวาให้เสียงเท่ากัน",
  "estimatedMinutesPerDay": 20,
  "lessonBlocks": [],
  "dailyPractice": [],
  "selfCheck": {}
}
```

Field rules:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `week` or `number` | number | yes | ใช้ให้เข้ากับ production code เดิม ควรคง `number` ไว้ |
| `month` | number | yes | ใช้ filter scope |
| `module` | string | yes | label ของหมวด |
| `title` | string | yes | ชื่อบทเรียน |
| `summary` | string | yes | dashboard summary |
| `estimatedMinutesPerDay` | number | optional | ใช้ใน mission meta |
| `lessonBlocks` | object[] | yes | รวม text, visual, TAB, lab และ micro-skill blocks |
| `dailyPractice` | object[] | yes | grouped schedule หรือ flat fallback |
| `selfCheck` | object | yes | criteria, questions, troubleshooting |

## 5. Lesson Block Union

`lessonBlocks[]` รองรับ block หลักเดิมและ micro-skill blocks

```json
{
  "lessonBlocks": [
    { "type": "text", "title": "บทเรียน", "body": "..." },
    { "type": "fretboard", "visualRef": "w5-root-landmarks-s6" },
    { "type": "tab", "tabRef": "w7-c-major-scale" },
    { "type": "chord-lab", "labRef": "w8-i-iv-v-lab" },
    { "type": "technique-drill", "id": "m4-w13-alt-picking", "title": "..." }
  ]
}
```

Renderer policy:

* ถ้า renderer รู้จัก `type` ให้ render component
* ถ้าไม่รู้จัก ให้ render fallback card พร้อมชื่อ block และคำว่า “บล็อกนี้ยังไม่พร้อมในเวอร์ชันนี้”
* ห้าม throw error จนทำให้ทั้ง lesson ไม่ขึ้น

## 6. Micro-Skill Block Base Shape

```json
{
  "type": "technique-drill",
  "id": "m4-w13-alt-picking",
  "title": "Alternate Picking แบบเสียงเท่ากัน",
  "skill": "alternate picking",
  "family": "technique",
  "duration": "4 นาที",
  "bpm": 60,
  "teacherNote": "วันนี้ไม่ต้องเร็ว ขอให้เสียงลงและขึ้นดังเท่ากันก่อน",
  "selfCheck": ["เล่นได้ 8 รอบโดยไม่เกร็ง"]
}
```

Common field rules:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `type` | string | yes | block type |
| `id` | string | yes | unique id |
| `title` | string | yes | learner-facing title |
| `skill` | string | optional | micro-skill name |
| `family` | string | optional | `technique`, `ear`, `visual-theory`, `application` |
| `duration` | string | optional | short display |
| `bpm` | number | optional | Metronome target |
| `teacherNote` | string | optional | Thai teacher note |
| `selfCheck` | string[] | optional | criteria 1-3 ข้อ |

## 7. Asset Reference Rules

ใช้ `Ref` เมื่อ block ต้องอ้าง asset ที่ reusable

```json
{
  "type": "interval-map",
  "id": "m2-w8-c-interval-preview",
  "mapRef": "asset-c-root-intervals-1-3-5-b7"
}
```

Rules:

* `visualRef` อ้าง `fretboardVisuals[].id`
* `tabRef` อ้าง `miniTabs[].id`
* `labRef` อ้าง `chordSoundLabs[].id`
* `mapRef` อ้าง `microSkillAssets.intervalMaps[].id`
* ถ้า ref missing ให้ renderer แสดง fallback card

## 8. Daily Practice With Micro-Skills

Micro-skill ควรเข้าไปเป็น task ข้างใน grouped daily practice

```json
{
  "dayLabel": "Day 3-4",
  "focus": "Picking Mechanics",
  "isOpen": false,
  "exercises": [
    {
      "id": "m4-w13-d3-p1",
      "duration": "4 นาที",
      "title": "Alternate Picking ข้ามสาย",
      "microSkillRef": "m4-w13-alt-picking",
      "instruction": "เล่นช้า ๆ ให้เสียงขึ้นลงเท่ากัน"
    }
  ]
}
```

Rules:

* `microSkillRef` optional
* task ต้องอ่านได้แม้ไม่มี ref
* อย่าเพิ่ม daily tasks จนเกินเวลาที่ dashboard แสดง

## 9. Visibility Policy

Schema v3 ต้องแยก data readiness ออกจาก UI visibility

```json
{
  "visibility": {
    "defaultMonth": 1,
    "availableMonths": [1, 2],
    "hiddenMonths": [3, 4, 5, 6, 7, 8, 9, 10],
    "deferredTopics": ["Arpeggio", "Modes"]
  }
}
```

Rules:

* data อาจมี future months ได้ แต่ UI ต้อง filter ตาม visibility policy
* Month 3+ ห้ามปรากฏใน switcher จนกว่าจะเปลี่ยน policy โดยงาน explicit
* Arpeggio และ Modes ห้ามโผล่ใน visible UI ก่อน scope

## 10. Validation Checklist

ก่อน migrate เป็น data จริง:

* ทุก block มี `type`, `id`, `title`
* ทุก ref ชี้ไปหา asset ที่มีอยู่จริง หรือมี fallback ที่ตั้งใจ
* ไม่มี block ใดเพิ่ม week ใหม่
* ไม่มี future month ถูกเปิดใน `availableMonths` โดยไม่ตั้งใจ
* Thai copy อ่านเหมือนครูสอนกีตาร์ ไม่ใช่ schema dump
* mobile 320px ไม่เกิด horizontal page overflow
* audio block มี text fallback

## 11. Versioning Notes

Schema v3 ควรอยู่ร่วมกับข้อมูลเดิมได้

แนวทาง transition:

1. production renderer รองรับ block ใหม่แบบ fallback ก่อน
2. เพิ่ม fixture/mock data ใน docs หรือ prototype
3. ทดสอบ block ทีละชนิด
4. ค่อย migrate `outputs/data.json` เมื่อมี task เฉพาะ
