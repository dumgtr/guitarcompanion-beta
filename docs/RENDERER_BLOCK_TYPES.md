# Renderer Block Types

เอกสารนี้กำหนด block types สำหรับ micro-skill integration ในอนาคต ทุก block เป็น documentation-only และยังไม่ใช่คำสั่งให้แก้ production renderer

หลักสำคัญ:

* block type ใหม่ต้องเป็นส่วนหนึ่งของ `lessonBlocks[]`
* ไม่เพิ่มสัปดาห์ ไม่เพิ่ม module ใหม่
* ไม่เปิด Month 3+ ใน UI จากเอกสารนี้
* renderer ต้อง degrade ได้ ถ้าข้อมูลไม่ครบให้แสดง fallback card สุภาพ
* ใช้ Vanilla HTML/CSS/JavaScript เท่านั้นเมื่อถึงเวลา implement

## Shared Block Fields

ทุก block ควรรองรับ field ร่วมเหล่านี้:

| Field | Required | Notes |
| --- | --- | --- |
| `type` | yes | หนึ่งใน block types ที่ระบุในเอกสารนี้ |
| `id` | yes | unique id เช่น `m4-w13-alt-picking-crossing` |
| `title` | yes | ชื่อ block ที่ผู้เรียนเห็น |
| `skill` | optional | ชื่อ micro-skill เช่น `alternate picking` |
| `duration` | optional | เช่น `4 นาที` |
| `bpm` | optional | tempo แนะนำ |
| `teacherNote` | optional | คำแนะนำสั้น ๆ แบบครู |
| `selfCheck` | optional | เกณฑ์เช็กตัวเอง 1-3 ข้อ |

## 1. `technique-drill`

Purpose: ฝึกทักษะกายภาพเฉพาะจุดแบบสั้น เช่น muting, alternate picking, legato, bending หรือ hybrid picking

Required fields:

* `type`
* `id`
* `title`
* `skill`
* `instruction`
* `steps`

Optional fields:

* `duration`
* `bpm`
* `targetSound`
* `commonMistakes`
* `teacherNote`
* `selfCheck`

Example JSON:

```json
{
  "type": "technique-drill",
  "id": "m4-w13-alternate-picking-clean-crossing",
  "title": "Alternate Picking ข้ามสายแบบไม่เกร็ง",
  "skill": "alternate picking",
  "duration": "4 นาที",
  "bpm": 60,
  "instruction": "ดีดลง-ขึ้นช้า ๆ บนสาย 3 และ 2 ให้เสียงดังเท่ากันทุกโน้ต",
  "steps": [
    "ตั้ง Metronome 60 BPM",
    "ดีดลงบนสาย 3 แล้วดีดขึ้นบนสาย 2",
    "หยุดฟังว่าเสียงสองสายเท่ากันไหม"
  ],
  "targetSound": "เสียงต้องนิ่ง ไม่กระแทกบางโน้ตดังเกิน",
  "commonMistakes": ["ข้อมือเกร็ง", "ดีดขึ้นเบากว่าดีดลง"],
  "selfCheck": ["เล่น 8 ครั้งติดโดยเสียงไม่หลุด Pulse"]
}
```

Renderer notes:

* render เป็น compact practice card
* แสดง `duration` และ `bpm` เป็น pill สั้น ๆ
* steps เป็น checklist อ่านง่าย
* ถ้าไม่มี `bpm` ให้ซ่อน pill ไม่ต้อง fallback เป็น 0

Accessibility notes:

* checklist ต้องเป็น label ที่คลิกได้
* ถ้ามี feedback ให้ใช้ aria-live เฉพาะข้อความสรุป ไม่ใช่ทุก checkbox

Mobile considerations:

* card หนึ่งคอลัมน์
* steps ต้อง wrap ได้
* ไม่มี diagram กว้างเกิน card

## 2. `ear-training-lab`

Purpose: ฝึกฟังเสียงเล็ก ๆ ในบท เช่น chord quality, interval, target note โดยไม่กลายเป็น quiz module ยาว

Required fields:

* `type`
* `id`
* `title`
* `prompts`
* `answers`

Optional fields:

* `audioMode`
* `bpm`
* `listenFor`
* `fallbackText`
* `teacherNote`

Example JSON:

```json
{
  "type": "ear-training-lab",
  "id": "m3-w10-chord-quality-major-minor",
  "title": "ฟัง Major กับ Minor ให้แยกอารมณ์ออก",
  "skill": "chord quality hearing",
  "audioMode": "web-audio",
  "listenFor": ["Major จะสว่างกว่า", "Minor จะหม่นกว่า"],
  "prompts": [
    { "id": "q1", "label": "เสียงที่ 1", "chord": "C", "quality": "major" },
    { "id": "q2", "label": "เสียงที่ 2", "chord": "Am", "quality": "minor" }
  ],
  "answers": [
    { "promptId": "q1", "correct": "major" },
    { "promptId": "q2", "correct": "minor" }
  ],
  "fallbackText": "ถ้าเสียงไม่ทำงาน ให้ครูหรือผู้เรียนเล่น C และ Am บนกีตาร์จริงแล้วตอบจากความรู้สึก"
}
```

Renderer notes:

* ใช้ปุ่ม “ฟัง” และตัวเลือกคำตอบ 2-4 ตัว
* audio ต้อง optional และหยุดเสียงได้
* ห้าม autoplay

Accessibility notes:

* ปุ่มฟังต้องมี accessible name ชัดเจน
* feedback ถูก/ผิดใช้ aria-live polite
* มี text fallback เสมอ

Mobile considerations:

* choice buttons เป็น grid 1-2 คอลัมน์ตามพื้นที่
* ปุ่มหยุดเสียงอยู่ใกล้ปุ่มเล่น

## 3. `interval-map`

Purpose: แสดงระยะห่างเสียงรอบ Root บนคอกีตาร์ เช่น b3, 3, 5, b7 เพื่อช่วยให้เห็นภาพก่อนเล่น

Required fields:

* `type`
* `id`
* `title`
* `root`
* `intervals`

Optional fields:

* `fretboardRef`
* `caption`
* `legend`
* `orientationNote`

Example JSON:

```json
{
  "type": "interval-map",
  "id": "m2-w8-c-intervals-around-root",
  "title": "เห็น 3rd และ 5th รอบ Root C",
  "root": { "note": "C", "string": 5, "fret": 3 },
  "intervals": [
    { "degree": "1", "label": "Root", "string": 5, "fret": 3 },
    { "degree": "3", "label": "Major 3rd", "string": 4, "fret": 2 },
    { "degree": "5", "label": "5th", "string": 4, "fret": 5 }
  ],
  "caption": "ยังไม่ต้องจำทั้งคอ แค่มองว่า 3rd และ 5th อยู่ใกล้ Root ตรงไหน"
}
```

Renderer notes:

* สามารถ reuse fretboard renderer ได้
* dot label ต้องสั้น เช่น `1`, `3`, `5`, `b7`
* legend อธิบายความหมายด้านล่างแทนการยัดข้อความยาวใน dot

Accessibility notes:

* ต้องมี text list ของ intervals ที่ screen reader อ่านได้
* ห้ามใช้สีเพียงอย่างเดียวในการแยก degree

Mobile considerations:

* fretboard scroll ได้ภายใน card เท่านั้น
* legend wrap เป็นหลายบรรทัดได้

## 4. `chord-tone-overlay`

Purpose: ซ้อน chord tones บน scale หรือ fretboard map เพื่อให้ผู้เรียนเห็น target notes ระหว่างเล่น

Required fields:

* `type`
* `id`
* `title`
* `chord`
* `tones`

Optional fields:

* `scaleContext`
* `fretboardRef`
* `targetNotes`
* `practicePrompt`

Example JSON:

```json
{
  "type": "chord-tone-overlay",
  "id": "m3-w11-c-chord-tones-over-c-major",
  "title": "โน้ตปลอดภัยของคอร์ด C",
  "chord": "C",
  "scaleContext": "C Major",
  "tones": [
    { "degree": "1", "note": "C", "role": "home" },
    { "degree": "3", "note": "E", "role": "color" },
    { "degree": "5", "note": "G", "role": "stable" }
  ],
  "practicePrompt": "เล่น C Major ช้า ๆ แล้วหยุดที่ C, E, G ให้เสียงจบเคลียร์"
}
```

Renderer notes:

* render เป็น overlay card พร้อม list ของ tone roles
* ถ้ามี fretboardRef ให้ซ้อน dot type `chord-tone`
* ไม่สอน arpeggio เต็มรูปแบบถ้ายังไม่เปิด scope

Accessibility notes:

* tone role ต้องเป็น text ไม่ใช่สีอย่างเดียว
* keyboard focus ไม่ควรติดอยู่ใน visual

Mobile considerations:

* แยก visual กับ list เป็นแนวตั้งบนจอเล็ก

## 5. `voice-leading-map`

Purpose: แสดงการขยับโน้ตจากคอร์ดหนึ่งไปอีกคอร์ดหนึ่งให้น้อยที่สุด เพื่อปูพื้น Harmony โดยไม่ทำให้ทฤษฎีหนัก

Required fields:

* `type`
* `id`
* `title`
* `fromChord`
* `toChord`
* `movements`

Optional fields:

* `key`
* `caption`
* `miniTabRef`
* `listenFor`

Example JSON:

```json
{
  "type": "voice-leading-map",
  "id": "m3-w12-c-to-f-small-moves",
  "title": "จาก C ไป F แบบนิ้วไม่กระโดดไกล",
  "key": "C",
  "fromChord": "C",
  "toChord": "F",
  "movements": [
    { "from": "E", "to": "F", "motion": "ขึ้นครึ่งเสียง" },
    { "from": "G", "to": "A", "motion": "ขึ้นหนึ่งเสียง" },
    { "from": "C", "to": "C", "motion": "ค้างเสียงร่วม" }
  ],
  "listenFor": ["ฟังเสียง E ขยับขึ้นเป็น F ว่ามันเปิดออกจากบ้าน"]
}
```

Renderer notes:

* render เป็น before/after map หรือ list movement
* ใช้ลูกศรเล็ก ๆ ได้ แต่ต้องมี text
* ไม่ต้องแสดงทุก inversion ในครั้งเดียว

Accessibility notes:

* อ่านลำดับ movement ได้ด้วย screen reader
* ลูกศรต้องมี label หรือ text equivalent

Mobile considerations:

* ใช้ list แนวตั้งบนมือถือ
* หลีกเลี่ยงตารางกว้าง

## 6. `drone-practice`

Purpose: ฝึกฟังโน้ตหรือ mode color เหนือเสียงฐานค้าง เช่น C drone เพื่อให้หูจับ tension/resolution ได้

Required fields:

* `type`
* `id`
* `title`
* `droneNote`
* `practiceSteps`

Optional fields:

* `audioMode`
* `duration`
* `scale`
* `listenFor`
* `fallbackText`

Example JSON:

```json
{
  "type": "drone-practice",
  "id": "m6-w22-c-drone-ionian-color",
  "title": "ฟังสีของ C Ionian บน C Drone",
  "skill": "mode color hearing",
  "audioMode": "web-audio",
  "droneNote": "C3",
  "duration": "3 นาที",
  "scale": "C Ionian",
  "practiceSteps": [
    "เปิด drone C เบา ๆ",
    "เล่นโน้ต 1 2 3 4 5 ช้า ๆ",
    "หยุดที่ 3 แล้วฟังว่าสว่างขึ้นอย่างไร"
  ],
  "fallbackText": "ถ้าเสียงไม่ทำงาน ให้เล่นสาย 5 เฟรต 3 ค้างเป็นจังหวะช้า ๆ แทน drone"
}
```

Renderer notes:

* audio optional
* มี play/stop ชัดเจน
* จำกัด duration ไม่ให้เสียงค้างลืมหยุด

Accessibility notes:

* ห้าม autoplay
* มี status text ว่า drone กำลังเล่นหรือหยุดแล้ว

Mobile considerations:

* ปุ่ม play/stop ใหญ่พอ
* steps อยู่ใต้ control ไม่เบียดกัน

## 7. `mode-color-lab`

Purpose: เทียบสีของ mode แบบ pitch axis ใน Month 6 โดยเน้นการฟัง ไม่ใช่ท่องสูตร mode

Required fields:

* `type`
* `id`
* `title`
* `tonic`
* `modes`

Optional fields:

* `droneRef`
* `comparisonPrompt`
* `teacherNote`
* `fallbackText`

Example JSON:

```json
{
  "type": "mode-color-lab",
  "id": "m6-w23-c-ionian-vs-mixolydian",
  "title": "เทียบสี C Ionian กับ C Mixolydian",
  "tonic": "C",
  "modes": [
    { "name": "Ionian", "colorNote": "7", "feel": "สว่างและจบเคลียร์" },
    { "name": "Mixolydian", "colorNote": "b7", "feel": "เปิดแบบ blues / rock มากขึ้น" }
  ],
  "comparisonPrompt": "เล่นทั้งสองแบบบน C drone แล้วฟังว่า 7 กับ b7 ทำให้อารมณ์ต่างกันอย่างไร"
}
```

Renderer notes:

* ใช้ตอน Month 6 เท่านั้นตาม roadmap
* ห้ามเปิด Modes ใน UI ก่อน scope
* render เป็น comparison cards ไม่ใช่ encyclopedia

Accessibility notes:

* แต่ละ mode ต้องมี text feel
* ถ้ามี audio ต้องมี stop และ fallback

Mobile considerations:

* comparison cards stack แนวตั้ง
* หลีกเลี่ยงตาราง mode 7 แบบในหน้าเดียว

## 8. `phrase-lab`

Purpose: ทำให้ผู้เรียนเปลี่ยนโน้ตหรือ pattern ให้เป็นประโยคดนตรี เช่น dynamic phrasing, phrase variation, call-response, blues curl

Required fields:

* `type`
* `id`
* `title`
* `phrase`
* `variations`

Optional fields:

* `bpm`
* `miniTabRef`
* `listenFor`
* `callResponse`
* `teacherNote`

Example JSON:

```json
{
  "type": "phrase-lab",
  "id": "m5-w18-blues-curl-response",
  "title": "Blues Curl ให้เสียงเหมือนพูดตอบ",
  "skill": "blues curl",
  "bpm": 65,
  "phrase": "เล่นโน้ต b3 แล้วดันเข้าหา 3 แบบไม่สุดเกินไป",
  "variations": [
    { "label": "เบา", "instruction": "เล่นเหมือนถาม" },
    { "label": "หนักขึ้น", "instruction": "เพิ่ม Accent ที่ปลายเสียง" }
  ],
  "listenFor": ["เสียงต้องมีทิศทางเข้าหาโน้ตเป้าหมาย ไม่ใช่ bend ลอย ๆ"]
}
```

Renderer notes:

* render phrase หลักและ variation เป็น cards
* miniTabRef optional
* ไม่ต้องมี scoring

Accessibility notes:

* variation buttons ต้องมี text ชัด
* ถ้าใช้ audio example ต้องมี transcript หรือ instruction text

Mobile considerations:

* variation list เป็น accordion ได้ถ้ายาว
* TAB scroll ภายใน card เท่านั้น

## 9. `transcription-challenge`

Purpose: ฝึก active transcribing ใน Month 9 โดยให้ผู้เรียนฟัง สังเกต และเขียนสิ่งที่ได้ยินแบบเล็กมาก

Required fields:

* `type`
* `id`
* `title`
* `prompt`
* `task`

Optional fields:

* `difficulty`
* `answerFormat`
* `hints`
* `referenceNotes`
* `teacherNote`

Example JSON:

```json
{
  "type": "transcription-challenge",
  "id": "m9-w34-two-bar-rhythm-catch",
  "title": "จับ rhythm 2 ห้องจากหู",
  "skill": "active transcribing",
  "difficulty": "small",
  "prompt": "ฟังวลีสั้น 2 ห้อง แล้วจดว่ามีเสียงตกที่ beat ไหนบ้าง",
  "task": "เขียนเป็นเลข 1 & 2 & 3 & 4 & หรืออัดเสียงตัวเองเล่นตาม",
  "answerFormat": "text-or-recording-note",
  "hints": ["เริ่มจากจับจังหวะก่อน ยังไม่ต้องหาชื่อโน้ต"]
}
```

Renderer notes:

* ไม่ต้องบันทึกไฟล์เสียงใน phase แรก
* ให้มีช่อง note หรือ checklist เท่านั้น
* answer เฉลยอาจซ่อนใน details

Accessibility notes:

* prompt ต้องอ่านเป็น text ได้
* ถ้ามี audio ต้องมี fallback ด้วยการให้ครูเล่นหรือผู้เรียนใช้เพลงอ้างอิงเอง

Mobile considerations:

* textarea ไม่ควรกว้างเกิน card
* hints ใช้ `<details>` เพื่อลดความรก

## 10. `arrangement-layer`

Purpose: สอนการซ้อนชั้นของเพลง เช่น bass, chord, melody, rhythm ใน Fingerstyle หรือ acoustic arrangement

Required fields:

* `type`
* `id`
* `title`
* `layers`

Optional fields:

* `miniTabRefs`
* `practiceOrder`
* `tempo`
* `teacherNote`

Example JSON:

```json
{
  "type": "arrangement-layer",
  "id": "m10-w38-travis-basic-layers",
  "title": "แยก Bass กับ Chord ก่อนรวมเป็น Travis Picking",
  "skill": "thumb independence / Travis picking",
  "tempo": 55,
  "layers": [
    { "name": "Thumb Bass", "instruction": "นิ้วโป้งเล่นสาย 5 และ 4 สลับกันให้ตรง Pulse" },
    { "name": "Chord Pinch", "instruction": "เพิ่มนิ้วชี้และกลางหนีบคอร์ดเบา ๆ" },
    { "name": "Melody Top", "instruction": "ใส่โน้ตบนสาย 1 เฉพาะจุดที่ไม่ทำให้ bass หลุด" }
  ],
  "practiceOrder": ["Thumb Bass", "Chord Pinch", "Melody Top"]
}
```

Renderer notes:

* render layers เป็น step cards
* มีปุ่มเลือก layer เพื่อเน้นเฉพาะส่วนได้ในอนาคต
* ไม่ต้องทำ mixer หรือ virtual guitar

Accessibility notes:

* layer ต้องมีชื่อและ instruction text
* ถ้ามี toggle visual ต้องประกาศ state ชัดเจน

Mobile considerations:

* layer cards stack ได้
* หลีกเลี่ยง UI แบบ mixer หลาย slider

## 11. `mechanics-check`

Purpose: เช็ก mechanics สั้น ๆ ก่อนหรือหลังแบบฝึก เช่น posture, pick angle, muting, wrist tension

Required fields:

* `type`
* `id`
* `title`
* `checks`

Optional fields:

* `when`
* `warningSigns`
* `fixes`
* `teacherNote`

Example JSON:

```json
{
  "type": "mechanics-check",
  "id": "m1-w3-palm-mute-tension-check",
  "title": "เช็กมือก่อนซ้อม Palm Mute",
  "skill": "fret-hand muting",
  "when": "ก่อนเริ่มแบบฝึก",
  "checks": [
    "ไหล่ไม่ยก",
    "ข้อมือขวาไม่กด bridge แรงเกิน",
    "เสียง Palm Mute ยังมี pitch ไม่ตันทึบ"
  ],
  "warningSigns": ["เจ็บข้อมือ", "เสียงบอดทุกสาย", "tempo เร่งเพราะเกร็ง"],
  "fixes": ["ลดแรงกด", "ขยับมือออกจาก bridge ทีละนิด", "ลด BPM ลง 10"]
}
```

Renderer notes:

* render เป็น checklist สั้น ๆ
* ใช้ก่อน technique-drill หรือท้ายบทได้
* ไม่ต้อง persist ใน phase แรก เว้นแต่ task ระบุ

Accessibility notes:

* checkbox label ชัดเจน
* warning signs ควรอยู่ใน `<details>` ถ้ายาว

Mobile considerations:

* หนึ่งบรรทัดต่อ check
* ใช้ spacing มากพอสำหรับนิ้วแตะ
