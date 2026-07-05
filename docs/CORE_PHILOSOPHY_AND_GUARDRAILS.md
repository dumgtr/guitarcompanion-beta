# Core Philosophy and Guardrails
Status: Frozen / Project Constitution

## 1. 6 Core Philosophies (ปรัชญาหลัก 6 ข้อ)

1. **Pedagogy Over Rote Theory (การสอนเหนือการท่องจำ):** เปลี่ยนรูปนิ้วที่แห้งแล้งให้เป็นกลไกทางเสียงดนตรีที่เข้าใจง่ายเสมอ ผู้เรียนต้องรู้ว่าเสียงที่กำลังกดมีหน้าที่อะไร ไม่ใช่แค่จำว่าต้องวางนิ้วตรงไหน

2. **Visual Landmark Geography (แผนที่คอกีตาร์ผ่าน Landmark):** ยึดโยงสายตาเข้ากับเบสสาย 5/6 และรูปทรงสากล (E-Shape, A-Shape) ไม่ลอยสเกลขึ้นมาเปล่าๆ ทุกแผนที่บนคอกีตาร์ต้องช่วยให้ผู้เรียนหา Root, Octave, chord tones หรือ target note ได้จริง

3. **Incremental Micro-Skills (ทักษะย่อยแบบขั้นบันได):** ซอยย่อยแบบฝึกหัดให้เล็กพอที่นิ้วมือและสมองจะรับไหวใน 15 นาทีต่อวัน ไม่โยนข้อมูลแบบสารานุกรม แต่ค่อยๆ เพิ่มความสามารถทีละชั้นจนผู้เรียนรู้สึกว่า "ทำได้จริง"

4. **Ear-to-Hand Integration (หูสั่งมือ):** ทุกบทเรียนการฟังต้องตอบคำถามได้ว่า "ได้ยินแบบนี้แล้วมือซ้าย/ขวาต้องทำอย่างไรบนกีตาร์" Ear training ในโปรเจกต์นี้ต้องเชื่อมกับ fretboard, chord tone, rhythm, touch หรือ phrasing เสมอ

5. **Private Teacher Voice (น้ำเสียงครูส่วนตัว):** ใช้ภาษาไทยที่อบอุ่น ใจเย็น เป็นมิตร และเน้นการปฏิบัติที่ถูกต้อง ปลอดภัยต่อสรีระนิ้วมือ ผู้เรียนควรรู้สึกเหมือนมีครูคอยดูจังหวะ คอยเตือนให้ผ่อนมือ และคอยบอกว่าอะไรคือเป้าหมายของวันนี้

6. **Backward-Compatible Architecture (เสถียรภาพของโค้ดเดิม):** แยกห้องทดลอง (Sandbox) ออกจากโฟลเดอร์ Production (`outputs/`) ทุกฟีเจอร์ใหม่ต้องไม่ทำลายระบบเดิมที่ launch ไปแล้ว ก่อน merge เข้า production ต้องผ่าน prototype, QA, และคำสั่ง engineering task ที่ชัดเจน

## 2. Play By Ear Thread (เส้นด้ายการแกะเพลงระยะยาว)

Playing by ear ไม่ใช่ module เดี่ยว และไม่ใช่เนื้อหาขั้นสูงที่รอไปเรียนทีหลัง แต่เป็นเส้นด้ายระยะยาวที่ต้องถักอยู่ในทุกบทเรียนตั้งแต่ Week 0 ถึง Month 10

Milestone progression ที่ต้องใช้ร่วมกัน:

**ฟังได้ → นับได้ → จับคีย์ได้ → หา root ได้ → เดา progression ได้ → เล่น chord tones ได้ → เติม scale ได้ → improvise ตามเพลงได้**

English reference:

**Listen -> Count -> Find Key -> Find Root -> Guess Progression -> Play Chord Tones -> Add Scale -> Improvise to the track**

Thread span ตาม `docs/PLAY_BY_EAR_THREAD_PLAN.md`:

- **Week 0:** establish pulse, Beat 1, 4/4, Downbeat-Upbeat และการนับให้ตรง Metronome
- **Month 1:** rhythm ear, Groove, strumming, Syncopation และ subdivision
- **Month 2:** เชื่อมเสียงเข้ากับ fretboard landmarks, Root, Octave และ Major Scale formula
- **Month 3:** ได้ยิน chord tones, triads, arpeggio, 7th และ target chord tones ก่อนคอร์ดเปลี่ยน
- **Month 4:** เติม scale โดยฟังเป็น melodic flavor ไม่ใช่ไล่กล่องนิ้ว
- **Month 5:** สร้าง phrase, motif, call-response และ phrase endings ด้วยหูนำมือ
- **Month 6:** ฟัง modes เป็น chord colors โดยเฉพาะ Dorian และ Mixolydian
- **Month 7-8:** ใช้หูตาม Blues form, turnarounds, comping, licks และ call-response
- **Month 9:** ฝึก transcription และ play-by-ear workflow จาก recording จริง
- **Month 10:** รวมทุกอย่างเป็น song application, fingerstyle หรือ arrangement layer เพื่อความเป็นอิสระทางดนตรี

ทุก draft ในอนาคตต้องระบุว่าบทเรียนนั้นอยู่ตรงไหนบน thread นี้

## 3. Blues Thread Strategy (ยุทธศาสตร์สู่ทางบลูส์)

- **Prioritized Modes:** โฟกัสหลักที่ Dorian และ Mixolydian ในฐานะสีสันเหนือก้อนคอร์ด ไม่สอน modes เป็นสารานุกรม scale และไม่เร่งเปิดทุก mode พร้อมกัน

- **Application:** เชื่อมโยงรากฐานคอร์ด 7th (Dominant 7) จาก Month 3 เข้าสู่โครงสร้าง Blues 12-Bar Form ใน Month 7-8 โดยเน้นสำเนียง Call-and-Response

Bluesman path ต้องค่อยๆ เดินจาก rhythm, Root, 7th color, chord tone targeting, blues scale, phrasing, bending, vibrato และ call-response จนผู้เรียนเล่นตอบโต้กับเพลงได้จริง

## 4. Scope & Prototype Freeze (การล็อกขอบเขตข้อมูลและการจำลองระบบ)

- **Content Freeze:** ห้ามเพิ่มสัปดาห์หรือ module ใหม่ที่อยู่นอก roadmap ที่อนุมัติแล้ว
  - Week 0 เป็น Foundation / Prelude
  - Week 1–8 เป็น Month 1–2 ที่มีอยู่แล้ว
  - Week 9–24 เป็น Month 3–6 blueprint ที่อนุมัติแล้ว
  - การเพิ่มนอกเหนือจากนี้ต้องมี curriculum decision แยกต่างหาก

- **Sandbox Isolation:** การพัฒนา Renderer และ Audio Engine ใหม่ทั้งหมด ต้องทำใน `prototypes/` เท่านั้น ห้ามแตะต้องโฟลเดอร์ `outputs/` จนกว่า Prototype จะผ่าน QA 100%

- **Month 2 Prototype Freeze:** Month 2 Week 5–8 prototypes are frozen. Do not edit or reopen Month 2 prototype files unless a task explicitly says so.

- **Production Protection:** `outputs/` คือพื้นที่ production app ที่ผ่าน launch แล้ว การเปลี่ยนแปลงใดๆ ต้องมี scope ชัดเจน แยกจากงาน curriculum drafting และต้องไม่ทำให้ Month 1 หรือ Month 2 regress

- **Documented but Hidden Rule:** เนื้อหา future months สามารถถูกออกแบบและบันทึกเป็นเอกสารได้ แต่ห้าม expose ใน UI ก่อนถึง controlled launch phase

## 5. Week 0 Prelude & Navigation Rule

- **The Prelude Layer:** `Week 0: Rhythm Basics` คือหน้า Onboarding/Prelude เพื่อปรับภาษาและจังหวะของร่างกายให้ตรงกันก่อนเริ่ม Month 1 บทนี้เป็นการตั้งนาฬิกาภายในของผู้เรียน ไม่ใช่เดือนเรียนปกติ

- **UI Constraint:** ห้ามเรนเดอร์ Week 0 เป็นแท็บ "Month 0" ในแถบนำทาง (Main Navigation UI) เด็ดขาด เพื่อไม่ให้สถาปัตยกรรมหน้าจอรกรุงรัง

- **Access Pattern:** Week 0 ควรเข้าถึงผ่าน onboarding, first-run prompt, Foundation Reset entry point หรือ teacher reminder เท่านั้น ไม่ควรอยู่ใน Month Switcher หลัก

## 6. Orientation Rule v2

- Fretboard visualizer และ TAB-style diagrams ต้องใช้ String 1 / High e อยู่ด้านบน
- String 6 / Low E อยู่ด้านล่าง
- ใช้กฎนี้กับ fretboard maps, chord-tone overlays, interval maps, target maps และ miniTabs ทั้งหมด
- ห้ามกลับด้าน orientation ระหว่างบท เพราะจะทำให้ผู้เรียนสับสน

## 7. Strict Prohibitions (สิ่งที่ห้ามทำเด็ดขาด)

- ห้ามบังคับให้ผู้เรียนอ่านบรรทัด 5 เส้น (Staff Notation)
- ห้ามทำให้แบบฝึกหัด Arpeggio หรือ Scale กลายเป็นการแข่งขันความเร็ว (Speed/Shred Course)
- ห้ามหลุดไปสอนทฤษฎี Jazz ขั้นสูง หรือ Chord-Scale Theory ที่ยากเกินจำเป็นในเฟสนี้
- ห้ามดัดแปลงไฟล์หลักใน `outputs/` โดยไม่มีคำสั่งเปิด Scope งานวิศวกรรม (Engineering Task) อย่างเป็นทางการ
- ห้ามเพิ่ม Month ใหม่ สัปดาห์ใหม่ หรือ module ใหม่เพื่อแก้ปัญหาที่ควรแก้ด้วย micro-skill block ภายในบทเรียนเดิม
- ห้ามแยก Play By Ear เป็น module สแตนด์อโลนโดยไม่มีการตัดสินใจ product direction ใหม่
- ห้ามใช้ network, external audio files, framework หรือ build tool ใหม่ใน prototype/production โดยไม่มีคำสั่งเฉพาะ
- ห้ามทำให้ UI กลายเป็น LMS, marketplace, encyclopedia หรือ dashboard หนักๆ ที่ทำให้ผู้เรียนรู้สึกหลงทาง

## 8. Revision Summary

1. Section 5 renamed to `Week 0 Prelude & Navigation Rule` to separate Prelude UI policy from visual orientation rules.
2. New Section 6 added for `Orientation Rule v2`, locking String 1 / High e on top and String 6 / Low E on bottom across fretboard maps, chord-tone overlays, interval maps, target maps, and miniTabs.
3. Content Freeze wording refined to clarify Week 0, Week 1–8, and Week 9–24 boundaries.
4. Explicit Month 2 Week 5–8 prototype freeze rule added.
5. Existing 6 core philosophies remain unchanged.
