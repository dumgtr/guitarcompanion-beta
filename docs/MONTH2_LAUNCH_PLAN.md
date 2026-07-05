# Blueprint: Month 2 Controlled Launch Plan

## 1. Month Switcher UI/UX Placement (เล็ก สงบ ไม่เด่นเกิน Metronome)

- **การจัดวาง (Placement):** จะไม่นำ Month Switcher ไปยัดไว้ใน Global Header ด้านบนสุด เพื่อป้องกันไม่ให้รก และเพื่อรักษาความเด่นของ Metronome เอาไว้
- **แนวทาง UX:** วางเป็น **Segmented Pill Controls เล็กๆ (ขนาดกะทัดรัด)** ไว้ที่ส่วนบนสุดของเนื้อหาในหน้าหลัก (Dashboard) และหน้าบทเรียน (Lessons) โดยใช้สีโทนหม่นทึบ (`var(--surface-soft)`) และจะสว่างขึ้นเมื่อเปิดใช้งานเท่านั้น
- **รูปแบบ UI ตัวอย่าง:**
  `[ เดือน 1: Rhythm ]` (Active คลีนๆ) | `[ เดือน 2: Fretboard ]` (สี Muted สงบๆ)

## 2. Gating Policy (เงื่อนไขการเข้าถึง Month 2)

- **นโยบายการเปิดบทเรียน:** เลือกใช้ระบบ **Unlocked แต่ไม่กวนสายตา (Manual Controlled Switch)** - **เหตุผลทางหลักสูตร:** เนื่องจากผู้เรียนเป้าหมายคือคนที่เคยเล่นกีตาร์มาแล้ว บางคนอาจจะมีทักษะ Rhythm ที่ดีอยู่แล้วและต้องการข้ามมาปูพื้นฐาน Fretboard ทันที การทำระบบล็อกตาย (Hard Gate) จะลดอิสรภาพในการเรียนรู้
- **การควบคุมสิทธิ์:** แอปจะเปิดให้สามารถกดสลับเดือนได้อิสระ แต่เมื่อผู้เรียนเข้าใช้งานแอปครั้งแรก (Initial Load) หากไม่มีการบันทึก Progress ใดๆ ตัวแอปจะบังคับโหลดเข้าหน้า Month 1 (Rhythm Foundation) เป็นค่าเริ่มต้นเสมอ

## 3. Data Migration Strategy (`outputs/data.json`)

- **การผสานข้อมูลสัปดาห์:** ทำการคัดลอกก้อนข้อมูลของ Week 5, 6, 7 และ 8 จาก Mock Data มาร้อยต่อท้าย (Append) ในแผงอาร์เรย์ `"weeks"` ของไฟล์หลัก โดยแต่ละสัปดาห์จะมี Property ระบุตัวตนชัดเจน เช่น `"month": 2, "module": "fretboard"`
- **การรวม Asset ทุกสัปดาห์ให้ครบ:** ห้ามดึงเฉพาะ Asset จาก Week 8 แล้วข้าม Week 5-7 เพราะแต่ละสัปดาห์มี visual และ TAB ที่ใช้สอนคนละหน้าที่กัน ต้องรวมข้อมูลจากทั้ง 4 สัปดาห์ตามลำดับก่อนย้ายเข้า `outputs/data.json`
  - **From Week 5, Week 6, and Week 7:** Extract and migrate all distinct `fretboardVisuals` and `miniTabs` data profiles.
  - **From Week 8:** Extract and migrate all `fretboardVisuals`, `miniTabs`, and the unified `chordSoundLabs` object payload.
- **การรวมศูนย์พิกัดความสามารถ (Asset Mapping):** รวม asset ที่ผ่านการตรวจซ้ำแล้วไว้ที่ Root Object ของ `outputs/data.json` เช่น `fretboardVisuals`, `miniTabs`, และ `chordSoundLabs` เพื่อให้ renderer หลัก lookup ด้วย `id` ได้ตรงกันทุกสัปดาห์
- **คำเตือนก่อนลงมือจริง:** ห้าม omit asset ของ Week 5-7 ระหว่าง execution เด็ดขาด แม้ Week 8 จะมี Chord Sound Lab และดูเหมือนครบกว่า เพราะ renderer ของ Week 5-7 ยังต้องอ้างอิง `visualRef` และ `tabRef` เฉพาะของตัวเอง

## 4. Renderer Activation (การเรียกใช้เครื่องยนต์เรนเดอร์)

- **State Management Updates:** ใช้และ hook เข้ากับ state convention เดิมของ production app คือ `selectedFocusedMonth` เท่านั้น หากต้องเพิ่ม persistence ให้ augment รอบ state นี้ด้วย localStorage โดยไม่สร้าง state คู่ขนาน
- **CRITICAL:** Do NOT spawn or declare duplicate month state variables. Always use the application's native state context (e.g., matching or augmenting any pre-existing variables like `selectedFocusedMonth`) to prevent cross-activation conflicts when the Month Switcher components are mounted.
- **UI Filtering:** เมื่อผู้เรียนกดสับสวิตช์เดือน:
  - ระบบ Dashboard และ Lesson Tabs จะทำการ Filter ข้อมูลด้วยเงื่อนไข `data.weeks.filter(w => w.month === selectedFocusedMonth)`
  - ตัวแปร `focusedSelectedWeek` จะถูก Reset ให้ชี้ไปที่สัปดาห์แรกของเดือนนั้นๆ โดยอัตโนมัติ (Month 1 -> Week 1 / Month 2 -> Week 5)
- **Renderer Execution:** บล็อกประเภทใหม่ ได้แก่ `fretboard`, `tab` และ `chord-lab` จะถูกส่งเข้าไปให้เครื่องยนต์เรนเดอร์ที่ฝังแบบ Stealth Merge ไว้ก่อนหน้านี้ทำหน้าที่วาด Layout โดยอัตโนมัติ

## 5. Pre-Launch Regression Checklist (เกณฑ์การตรวจรับงาน)

ก่อนประกาศความสำเร็จของการ Launch ต้องผ่านระบบทดสอบความเสถียรดังนี้:

1. **Month 1 Integrity:** บทเรียนสัปดาห์ที่ 1 ถึง 4 ต้องเรนเดอร์แอนิเมชันจังหวะ กราฟิกตาราง 16th Note และทำ Quizzes ได้สมบูรณ์ 100% เหมือนเดิม
2. **State Isolation:** ความคืบหน้า (Checkbox Progress, Notes) ของ Month 1 ใน localStorage ต้องไม่ถูกลบหรือเขียนทับเมื่อผู้เรียนสลับไปทำกิจกรรมใน Month 2
3. **No Console Errors:** ต้องไม่มีรอยรั่วหรือไฟสีแดงแจ้งเตือน Error บน Developer Console ตลอดการกดสลับเดือนไปมา
4. **Mobile 320px Check:** ตัวปุ่ม Month Switcher ขนาดเล็กตัวใหม่ต้องจัด Layout แบบ Responsive ไม่ดันขอบหน้าจอจนเกิดอาการ Horizontal Scroll Overflow (ล้นขวา)
