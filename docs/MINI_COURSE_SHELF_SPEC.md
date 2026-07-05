# Mini Course Shelf Spec
Status: Documentation / Spec-First Planning

## 1. Purpose

Mini Course Shelf คือพื้นที่ optional support material ใน Practice Room สำหรับบทเรียนสั้น ๆ ที่ช่วยปิดช่องว่างเฉพาะเรื่อง โดยไม่เพิ่ม Month ใหม่ ไม่เพิ่ม Week ใหม่ และไม่ทำให้ Main Course บวมเกินจำเป็น

เป้าหมายหลัก:

- ให้ผู้เรียนมีทางเลือกฝึกพื้นฐานย่อยที่ติดขัด เช่น rhythm notation, TAB reading, fretboard survival หรือ muting basics
- แยกเนื้อหาเสริมออกจาก Main Course เพื่อให้เส้นทาง Month 1-4 ยังสะอาดและฝึกได้ต่อเนื่อง
- ทำให้ mini course เป็น guided practice 5-10 นาทีต่อวัน ไม่ใช่ reference encyclopedia
- รองรับ progress แบบแยกจาก Month progress เพื่อไม่ให้กระทบ completion state ของ Week 0 และ Month 1-4

## 2. Learning Surfaces

### Main Course

Main Course คือเส้นทางหลักของ Guitar Companion เช่น Week 0 Prelude และ Month 1-4 ที่ visible ใน production ตอนนี้

หน้าที่:

- พาผู้เรียนเดินตาม roadmap หลัก
- มี daily practice และ self-check
- มี Month Switcher / week tabs ตาม scope ปัจจุบัน

Mini Course Shelf ต้องไม่แทรกตัวเองเป็น Month หรือ Week ใน Main Course

### Reference Shelf

Reference Shelf คือคลังอ้างอิงใน Practice Room ที่ finalized แล้ว ได้แก่ TAB Handbook และ Note Value Cheatsheet

หน้าที่:

- เปิดดูเวลาติดสัญลักษณ์หรือค่าจังหวะ
- เป็น quick reference
- ไม่ track progress เป็นคอร์ส

Mini Course Shelf ห้ามย้ายหรือ duplicate Reference Shelf content เข้า main lesson flow และห้ามแก้ `.reference-panel`, `#tabGuidebook`, `#noteValueGuidebook` โดยไม่มี bug report

### Micro-Skill Cards

Micro-Skill Cards คือการ์ดเล็ก ๆ ที่ฝังในบทเรียน เช่น Week 0 TAB Survival หรือ Week 1 rhythm-reading micro-skill

หน้าที่:

- สอนจุดเล็กใน context ของบทเรียนนั้น
- ใช้เวลา 3-5 นาที
- ไม่ใช่คอร์สแยก

Mini Course Shelf สามารถอ้างถึง micro-skill cards ได้ แต่ไม่ควร copy เนื้อหายาวเข้าไปซ้ำ

### Mini Course Shelf

Mini Course Shelf คือคอร์สย่อย optional แบบ 5-7 วัน ที่อยู่ใน Practice Room / future support area

หน้าที่:

- ฝึกหัวข้อเดียวให้เป็นขั้นตอนสั้น ๆ
- มี daily mini lesson, count/clap/play task, self-check
- แยก progress storage จาก Main Course
- เปิดได้เมื่อผู้เรียนต้องการ support เพิ่ม ไม่ใช่ required progression

## 3. Placement

ตำแหน่งที่เสนอ:

- อยู่ใน Practice Room ใต้ Reference Shelf หรือใน support area ใกล้กัน
- ใช้ชื่อ section เช่น `Mini Course Shelf`
- ไม่เพิ่ม topbar navigation item
- ไม่เพิ่ม Month Switcher item
- ไม่เพิ่ม Week tab

แนวทาง UI ในอนาคต:

- Card list แบบ compact
- แต่ละ card แสดง title, short purpose, estimated duration, status
- CTA เช่น `เริ่ม Mini Course` หรือ `เปิดบทฝึก`
- เมื่อเปิดแล้วใช้ panel / route ภายใน Practice Room ไม่ใช่ Month page

## 4. Data Model Proposal

Root-level proposal สำหรับ future `outputs/data.json` หรือ data pack:

```json
{
  "miniCourses": [
    {
      "miniCourse": {
        "id": "rhythm-notation-starter",
        "title": "Rhythm Notation Starter",
        "thaiTitle": "อ่านค่าจังหวะ: ตัวดำ ตัวหยุด และจังหวะตก-ยก",
        "status": "draft",
        "visibility": "hidden",
        "placement": "practice-room-mini-course-shelf",
        "optional": true,
        "totalDays": 7,
        "estimatedMinutesPerDay": 10,
        "relatedWeeks": [0, 1, 2]
      },
      "modules": [],
      "uiHints": {},
      "audioAssets": [],
      "progressModel": {},
      "guardrails": []
    }
  ]
}
```

Required fields:

- `miniCourse.id`
- `miniCourse.title`
- `miniCourse.thaiTitle`
- `miniCourse.status`
- `miniCourse.visibility`
- `miniCourse.placement`
- `miniCourse.optional`
- `miniCourse.totalDays`
- `modules[]`
- `uiHints`
- `audioAssets`

Module object proposal:

```json
{
  "id": "rns-day-1-beat-bar-44",
  "day": 1,
  "title": "Beat, Bar, and 4/4",
  "summary": "",
  "visualCountMap": {},
  "clapTask": {},
  "guitarTask": {},
  "selfCheck": [],
  "relatedReferences": [],
  "relatedWeeks": []
}
```

## 5. Rendering Requirements

Future renderer should support:

- Mini course shelf card list
- Mini course detail view
- Day selector 1-7
- Compact lesson card
- Count map visual
- Clap task card
- Guitar task card
- Self-check checklist
- Related reference buttons using existing `data-scroll` behavior where possible

Renderer should not require:

- New framework
- Network audio
- External images
- Staff notation engine
- Full LMS dashboard

If a renderer is missing, fallback should show a polite card with the title and short explanation rather than breaking the page

## 6. Progress Storage Rules

Mini course progress must be isolated from:

- Week 0 Prelude checklist keys
- Month 1-4 completion keys
- Practice notes
- Reference Shelf state

Canonical storage key:

```text
gc:mini:rhythm-notation-starter:progress:v1
```

Optional namespace prefix for future multi-key expansion:

```text
gc:mini:rhythm-notation-starter:
```

Progress may include:

- current day
- per-day self-check completion
- completed days

Progress must not:

- mark Month weeks complete
- affect Month progress bars
- change selected Month
- unlock Month 5-8

Mini Course Reset Decision:

- Mini Course progress uses separate storage from Week 0 and Month 1-4.
- Main reset does not clear Mini Course progress by default.
- Main reset UI should include contextual copy explaining that Mini Course progress has its own reset.
- Each Mini Course should have its own reset control.
- If Mini Course progress is more than 50% complete, reset requires type-to-confirm.
- Suggested confirmation phrase: `RESET MINI COURSE`
- Reset must never affect `selectedFocusedMonth`, Month progress bars, Week 0 checklist state, Practice Notes, or Reference Shelf state.

## 7. Accessibility Rules

- Buttons must be real `<button>` elements
- Day selector must expose selected state with `aria-current` or `aria-pressed`
- Count maps must include text labels, not color only
- Visual rhythm examples must be readable by screen readers through plain text rows
- Do not rely on animation to communicate timing
- Respect `prefers-reduced-motion`
- Keep focus order predictable when opening or closing a mini course

## 8. Mobile Rules

- Must work at 390px and 430px with no body-level horizontal overflow
- Long count maps may scroll inside their own box
- Cards should stack vertically
- CTA buttons should remain tappable
- Do not create side-by-side dense notation layouts on mobile
- Keep lesson copy short enough for one small screen section at a time

## 9. Guardrails

- Do not create Month 0
- Do not expose Month 5-8
- Do not add Mini Course Shelf as a topbar nav item
- Do not move Reference Shelf content into the main lesson flow
- Do not duplicate the full TAB Handbook or Note Value Cheatsheet inside Month 1 lessons
- Do not turn mini courses into required roadmap progression
- Do not add external libraries, fonts, images, audio files, or network dependencies
- Keep Main Course clean and practice-focused

## 10. Implementation Phases

### Phase 0: Spec and Mock Data

Current phase.

- Define Mini Course Shelf architecture
- Define Rhythm Notation Starter scope
- Draft mock data
- No production UI

### Phase 1: Renderer Planning

- Decide data placement
- Define mini course renderer contract
- Decide progress storage and reset behavior
- Create isolated prototype if needed

### Phase 2: Hidden Data Merge

- Add mini course data as hidden root-level data
- Do not expose in UI yet
- Validate schema and refs

### Phase 3: Controlled UI Prototype

- Build Mini Course Shelf behind a dev flag or isolated prototype
- QA mobile and accessibility
- Verify no Month 5-8 exposure

### Phase 4: Public Reveal

- Add Mini Course Shelf to Practice Room only after explicit approval
- Keep Reference Shelf unchanged
- Keep Month 1 default and Month 1-4 visibility unchanged
