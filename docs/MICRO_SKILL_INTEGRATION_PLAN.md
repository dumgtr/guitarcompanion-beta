# Micro-Skill Integration Plan

เอกสารนี้กำหนดแนวทางเพิ่ม micro-skill ลงในบทเรียนระยะยาวของ Guitar Companion โดยไม่เพิ่มสัปดาห์ใหม่ ไม่เปิด Month 3+ ใน UI และไม่ทำให้ roadmap กลายเป็นรายการ module ย่อยที่รกเกินไป

สถานะ: documentation only  
ห้ามแก้ `outputs/`, `prototypes/`, `outputs/data.json` หรือเปิด future months จากเอกสารนี้โดยตรง

## 1. Product Principle

Micro-skill คือทักษะเล็กที่แทรกอยู่ในบทเรียนหลัก ไม่ใช่ module ใหม่ ไม่ใช่ course ย่อย และไม่ใช่เหตุผลให้เพิ่มจำนวนสัปดาห์

ตัวอย่างที่ถูกต้อง:

* Month 4 สอน picking mechanics เป็น block สั้น ๆ ในบท Scale Navigation
* Month 5 สอน vibrato เป็น phrase-lab ข้างในบท Blues Phrasing
* Month 10 สอน Travis picking เป็น arrangement-layer ในบท Fingerstyle Foundation

ตัวอย่างที่ต้องหลีกเลี่ยง:

* เพิ่ม “Technique Month” แยกใหม่โดยไม่จำเป็น
* เพิ่มสัปดาห์พิเศษสำหรับทุกเทคนิค
* ทำ UI เป็นคลังสารานุกรมทักษะ
* เปิด Month 3, Arpeggio หรือ Modes ก่อนถึง scope ที่ผู้ใช้สั่งชัดเจน

## 2. Micro-Skill Families

### Technique Micro-Skills

ทักษะกายภาพที่ช่วยให้เสียงสะอาดขึ้น เล่นง่ายขึ้น และลดแรงเกร็ง

* fret-hand muting
* chucking / scratching
* alternate picking
* economy / directional picking
* legato
* bending
* vibrato
* microtonal blues bending
* hybrid picking
* thumb independence / Travis picking

### Ear Micro-Skills

ทักษะการฟังที่ฝังอยู่ในบทเรียน ไม่ใช่แบบทดสอบแยกยาว ๆ

* chord quality hearing
* interval hearing
* target note hearing
* mode color hearing
* active transcribing

### Visual / Theory Micro-Skills

ทักษะการมองคอกีตาร์และความสัมพันธ์ของเสียงแบบเห็นภาพ

* visual intervals
* chord-tone overlays
* voice-leading maps
* scale-degree maps
* pitch-axis mode comparison

### Musical Application Micro-Skills

ทักษะที่ทำให้สิ่งที่เรียนกลายเป็นเพลงจริง

* dynamic phrasing
* phrase variation
* call-response
* blues curl
* arrangement layers

## 3. Month Mapping

| Month | Main Theme | Integrated Micro-Skills | Guardrail |
| --- | --- | --- | --- |
| Month 1 | Rhythm Foundation | fret-hand muting, chucking, basic rhythm reading | ยังไม่เพิ่ม technique encyclopedia |
| Month 2 | Fretboard Foundation | visual intervals around Root, 3rd, 5th, 7th | เป็น visual aid รอบ Root ไม่สอน harmony ลึก |
| Month 3: Chord Tone & Arpeggio Foundation | Chord Tone & Arpeggio Foundation | chord quality ear training, voice leading | ยังเป็น hidden scope จนกว่าจะ scoped |
| Month 4 | Scale Foundation | picking mechanics, legato | ไม่ทำ speed-drill month |
| Month 5 | Blues / Phrasing Foundation | bending, vibrato, dynamic phrasing | เน้นเสียงและ time feel ไม่ใช่ lick dump |
| Month 6 | Modal Color Foundation | pitch axis, drone practice, modal color hearing | Modes ยังไม่ visible จนกว่าจะถึง Month 6 scope |
| Month 7-8 | Blues Thread / Style Application | blues curl, microtonal bending, hybrid picking | ไม่เปลี่ยนทั้ง app เป็น blues-only course |
| Month 9 | Active Listening / Transcribing | active transcribing | ไม่ทำ ear-training LMS |
| Month 10 | Fingerstyle Foundation | thumb independence, Travis picking | เป็น arrangement layer ไม่ใช่ full songbook |

## 4. Integration Pattern

ทุก micro-skill ควรถูกวางเป็น `lessonBlocks[]` ภายใน week เดิม

```json
{
  "week": 13,
  "month": 4,
  "title": "Scale Navigation",
  "lessonBlocks": [
    {
      "type": "text",
      "title": "เดินสเกลให้เป็นประโยค",
      "body": "วันนี้เราจะเล่นช้า ๆ ให้เสียงชัดก่อน ไม่ไล่เร็วเพื่อเอาความรู้สึกว่าคล่อง"
    },
    {
      "type": "technique-drill",
      "id": "m4-w13-alt-picking-clean-crossing",
      "skill": "alternate picking",
      "title": "Alternate Picking ข้ามสายแบบไม่เกร็ง",
      "duration": "4 นาที",
      "bpm": 60,
      "instruction": "ดีดลง-ขึ้นช้า ๆ บนสองสาย ฟังให้เสียงเท่ากันทุกโน้ต"
    }
  ]
}
```

หลักคิด:

* หนึ่งบทควรมี micro-skill 0-2 block เท่านั้น
* micro-skill ต้องตอบเป้าหมายของบทหลัก
* block ต้องสั้นพอให้ผู้เรียนทำทันใน daily practice
* ข้อความต้องพูดเหมือนครูกีตาร์ ไม่ใช่ตำรากายวิภาค

## 5. Proposed Block Types

ดูรายละเอียด field และ renderer notes ใน `docs/RENDERER_BLOCK_TYPES.md`

* `technique-drill`
* `ear-training-lab`
* `interval-map`
* `chord-tone-overlay`
* `voice-leading-map`
* `drone-practice`
* `mode-color-lab`
* `phrase-lab`
* `transcription-challenge`
* `arrangement-layer`
* `mechanics-check`

## 6. Data Placement

Micro-skill blocks ควรอยู่ใน `lessonBlocks[]` ของแต่ละ week object

ถ้ามี asset ซ้ำหลายบท เช่น interval map หรือ backing drone ให้เก็บเป็น root-level asset map ใน schema v3 เช่น:

```json
{
  "microSkillAssets": {
    "intervalMaps": [],
    "droneProfiles": [],
    "phrasePatterns": [],
    "transcriptionPrompts": []
  }
}
```

ห้ามเพิ่มเมนูหลักใหม่หรือ navigation ใหม่เพียงเพราะมี micro-skill asset

## 7. UI and UX Rules

Micro-skill block ต้องรู้สึกเหมือนครูแทรกคำแนะนำระหว่างบทเรียน

ควรใช้:

* card ขนาดกะทัดรัด
* duration pill สั้น ๆ
* checklist หรือ self-check หนึ่งข้อ
* visual ขนาดเล็กที่อ่านบนมือถือได้
* fallback text ถ้า audio หรือ interaction ใช้ไม่ได้

ไม่ควรใช้:

* dashboard ใหม่
* sidebar ใหม่
* catalog ของ technique
* complex scoring
* network audio/video

## 8. Accessibility and Mobile Baseline

ทุก block type ต้องมี:

* heading ที่อ่านได้ด้วย screen reader
* text fallback สำหรับ audio lab
* button เป็น `<button type="button">`
* aria-live เฉพาะจุดที่ feedback เปลี่ยนจริง
* target size อย่างน้อย 44px สำหรับ control ที่กดบ่อย
* ไม่มี horizontal page overflow ที่ 320px
* scroll แนวนอนได้เฉพาะ TAB, fretboard หรือ map ที่ตั้งใจให้ scroll ภายใน card

## 9. Implementation Guardrails

เอกสารนี้ยังไม่ใช่คำสั่งให้ implement

ก่อนลง production ต้องมีงานแยกสำหรับ:

1. เพิ่ม renderer แบบ scoped ใน `outputs/app.js`
2. เพิ่ม CSS แบบ component-scoped ใน `outputs/styles.css`
3. เพิ่ม mock data prototype หรือ fixture
4. QA Month 1 และ Month 2 ไม่ให้ regression
5. ยืนยันว่า Month 3+ ยัง hidden จนกว่าจะเปิด scope

## 10. Open Decisions

ก่อน implement จริง ควรตัดสินใจ:

* จะเก็บ progress ของ micro-skill checkbox แยกจาก week progress หรือไม่
* audio labs จะใช้ Web Audio API อย่างเดียวหรือให้มี silent text-only mode เป็นค่าเริ่มต้น
* block ไหนควรใช้ร่วมกับ existing Month 2 renderer ได้ทันที
* naming convention ของ `id` จะเป็น `m{month}-w{week}-{skill}` หรือใช้ slug ตาม lesson
* จะมี cap จำนวน interactive block ต่อ lesson หรือไม่ เพื่อไม่ให้ mobile หนักเกินไป
