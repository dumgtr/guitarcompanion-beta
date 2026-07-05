# Blues Turnaround Starter Spec
Status: Sprint 8A.1 - Documentation Only / Aligned Spec

## 1. Meta Data
- **ID:** `blues-turnaround-starter`
- **Title:** Blues Turnaround Starter
- **Thai Title:** พื้นฐานบลูส์เทิร์นอะราวด์
- **Duration:** 7 Days
- **Placement:** Practice Room (Mini Course Shelf)
- **Status:** Draft / Spec-planned only

## 2. Curriculum Outline (7 Days)

การฝึก 7 วันนี้ออกแบบมาเพื่อให้ผู้เรียนเข้าใจและเล่น Blues Turnaround จบ 12-bar blues ได้อย่างมั่นใจ ค่อยเป็นค่อยไป วันละนิดครับ

**Day 1: What is a 12-bar blues ending?**
- **Module Type:** `text` / `teacher-note`
- **Content:** อธิบายโครงสร้างของ 12-bar blues แบบเข้าใจง่ายๆ เน้นไปที่ 2 ห้องสุดท้าย (bar 11-12) ว่าทำไมเราถึงต้องมี Turnaround เพื่อพากลับไปเริ่มใหม่ที่จุดเริ่มต้น (I chord).

**Day 2: The I-IV-V progression in Key of A or E**
- **Module Type:** `text` / `teacher-note` (with optional `reference-link` or text-based markers)
- **Content:** ทบทวนคอร์ดพื้นฐาน I, IV, V ในคีย์ E (E, A, B) หรือคีย์ A (A, D, E) ที่จะถูกใช้ใน Turnaround เพื่อให้หูเริ่มคุ้นเคยกับความตึงเครียด (tension) ที่พากลับไปหาคอร์ดหลัก โดยใช้วิธีอธิบายผ่านข้อความง่ายๆ หรือมีปุ่ม reference-link ไปเปิดดูตารางคอร์ดอ้างอิงครับ.

**Day 3: The simplest Turnaround pattern**
- **Module Type:** `mini-tab` / `guitar-task`
- **Content:** ฝึกเล่น Turnaround pattern แบบเบสิคที่สุด เริ่มจากคอร์ด I ไล่เสียงเบสหรือโน้ตสายเปล่าง่ายๆ ไปหาคอร์ด V เพื่อจบประโยค.

**Day 4: Walking chromatic line**
- **Module Type:** `guitar-task` / `mini-tab`
- **Content:** แนะนำการใช้โน้ต Chromatic (เดินทีละ fret) ที่มักพบใน Turnaround สุดคลาสสิก ฝึกนิ้วให้คุ้นเคยกับการไล่สเกลบนสายเดียว ผ่านแบบฝึกหัดที่กดเล่นได้จริง (`guitar-task`) ควบคู่กับ `mini-tab` ที่พอดีกับหน้าจอมือถือ.

**Day 5: Dominant 7 sound integration**
- **Module Type:** `text` / `teacher-note` (with optional `reference-link` or static `mini-tab`)
- **Content:** เปลี่ยนคอร์ด V ธรรมดาให้เป็น V7 (Dominant 7) เพื่อสร้างแรงดึงดูด (resolution) ให้ชัดเจนขึ้น อธิบายให้ผู้เรียนฟังความแตกต่างระหว่างคอร์ด V ธรรมดากับ V7 อย่างช้าๆ ผ่านข้อความ หรือใช้ปุ่มลิงก์ไปหน้าอ้างอิง แทนการใช้ระบบ visualizer ที่ซับซ้อน.

**Day 6: Rhythm + timing focus**
- **Module Type:** `count-map` / `clap-task`
- **Content:** เจาะลึกเรื่องจังหวะ (Rhythm) ในการเล่น Turnaround ส่วนใหญ่มักจะมี feel แบบ Shuffle หรือ Swing ลองตบมือและนับจังหวะให้เข้ากับ feel นี้.

**Day 7: Playing with a metronome / backing feel**
- **Module Type:** `guitar-task` (with internal audio asset link if applicable)
- **Content:** รวมทุกอย่างเข้าด้วยกัน เล่น Turnaround เต็มรูปแบบพร้อมกับ Metronome เน้นความต่อเนื่องและจบประโยคให้ลงจังหวะตกพอดี.

## 3. Data Schema Target

ในการพัฒนาขั้นต่อไป (Sprint 8B) ข้อมูลของคอร์สนี้จะถูกเพิ่มเข้าไปในไฟล์ `outputs/data.json` ภายใต้ array `miniCourses[]`

**Initial Integration Rule:**
- เมื่อเริ่มใส่ข้อมูลลงไปครั้งแรก (Mock Data) ต้องกำหนดให้ `"visibility": "hidden"` เสมอ
- และตั้ง `"status": "draft"`
- ข้อมูลจำเพาะเหล่านี้ออกแบบมาเพื่อไม่ให้ส่งผลกระทบต่อ production ปัจจุบัน จนกว่าจะได้รับการอนุมัติให้เป็น public ใน Sprint 8D
