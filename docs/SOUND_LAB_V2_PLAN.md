# Sound Lab V2 Planning Draft

## Purpose
ทำไมต้องมี V2: จุดประสงค์หลักของการวางแผนครั้งนี้คือการยกระดับ Sound Lab ในอนาคต จากแค่เครื่องมือ "กดเพื่อฟังเสียง (Press to hear)" ให้กลายเป็นเครื่องมือสอนดนตรีเชิงลึก เพื่อให้ผู้เรียนสามารถ "เข้าใจสีของคอร์ด (Chord Color)", "สัมผัสถึง Guide Tone", และ "เข้าใจหน้าที่ของคอร์ดในเพลง (Harmonic Function)" ได้อย่างเป็นรูปธรรม

## Current Stable Baseline
กฎเหล็กในการพัฒนาที่ห้ามทำลายเด็ดขาด:
- Black LED display: หน้าจอแสดงผลสถานะหลักต้องคงดีไซน์ไฟ LED บนพื้นดำไว้เช่นเดิม
- Single guide tone: เสียงสังเคราะห์ต้องเล่นแค่ Guide Tone ตัวเดียวต่อคอร์ด ห้ามเปลี่ยนเป็นเสียงคอร์ดเต็ม
- GUIDE label behavior: ป้ายกำกับ GUIDE ต้องยังคงแสดงอย่างถูกต้องบน LED
- No arpeggios: ห้ามเล่นเสียงไล่โน้ตทีละตัว
- No stacked chords: ห้ามเล่นเสียงโน้ตหลายตัวซ้อนกันพร้อมกัน
- Month 4/5/6 behavior: ปุ่มและเลย์เอาต์พื้นฐานของทุกเดือนต้องทำงานได้เหมือนเวอร์ชัน Stable ปัจจุบัน 100%

## Problems V2 should solve
- ผู้เรียนต้องการเข้าใจความหมายของสิ่งที่ได้ยินมากขึ้น
- ปัจจุบัน UI ของหน้าทดลองฟังเสียงยังขาดพื้นที่อธิบายแนวคิดทางดนตรีที่แยกส่วนออกมาอย่างชัดเจน
- ความพยายามก่อนหน้านี้ทำให้เกิดปัญหา UI กระโดด (layout shift) และข้อความอัดแน่นเกินไป

## Teaching Concepts
เป้าหมายทางการสอนที่ Sound Lab V2 ต้องสื่อสารให้ผู้เรียนเข้าใจในอนาคต:
- ความรู้สึกของ Home / Away / Pull / Return
- หน้าที่ของคอร์ด I / IV / V / vi function
- การลงจอดของโน้ตเป้าหมาย Guide tone landing
- สีสันของโหมดเมื่อเปลี่ยนคอร์ดรองรับ Mode color over chord
- การสร้างมวลเสียงด้วยโน้ตค้าง Common tone / Pedal chord color

## Proposed UX Modes
แนวคิดสำหรับ UI (ยังไม่ลงโค้ด เป็นแค่การวางแผน):
- Listen mode: โหมดการฟังสบาย ๆ แบบดั้งเดิม
- Explain mode: โหมดแสดงคำอธิบายเชิงลึกถึงหน้าที่และอารมณ์ของสิ่งที่กำลังฟัง
- Compare mode: โหมดสำหรับกดฟังเทียบความแตกต่าง เช่น C vs C# บนคอร์ด A
- What to listen for panel: แผงคำแนะนำเป้าหมายการฟังอย่างชัดเจน แยกส่วนออกมาเพื่อให้อ่านง่ายก่อนกดฟัง
- Optional function badge: ป้ายกำกับสำหรับบอก Function ของคอร์ด โดยแยกชิ้นส่วนออกมาต่างหาก ห้ามยัดเข้าไปในจอ Black LED โดยตรงเด็ดขาด

## Proposed Data Model
ร่างโครงสร้างข้อมูลที่อาจจำเป็นต้องเพิ่มในอนาคต:
- functionLabel
- functionRole
- guideTone
- listenFor
- teachingNote
- compareWith

## Implementation Phases
- Phase 0: docs only (กำลังอยู่ในขั้นตอนนี้)
- Phase 1: isolated prototype
- Phase 2: Month 5 only
- Phase 3: Month 6 only
- Phase 4: optional Month 4 integration
- Phase 5: production candidate

## QA Matrix
ต้องผ่าน 100% ก่อน merge ใดๆ ในอนาคต:
- Month 4 regression
- Month 5 progression
- Month 6 modes
- Mobile 390/430
- No flicker
- Old guide label still visible
- No console error

## Rollback Plan
หากพบ regression ระหว่างการพัฒนาในอนาคต:
- Stop immediately (หยุดการทำงานทันที)
- Document the regression (บันทึกปัญหาที่พบ)
- Revert or abandon the branch only after confirming the clean baseline commit (ย้อนกลับหรือทิ้งสาขาหลังจากตรวจสอบ commit ที่เสถียรแล้วเท่านั้น)
- Do not force-push without explicit approval (ห้าม force-push โดยไม่ได้รับอนุมัติอย่างชัดเจน)

## Non-goals
ข้อห้ามและสิ่งที่ไม่ใช่เป้าหมายของการพัฒนานี้:
- Do not recreate the failed Teaching Surface patch directly.
- Do not inject CHORD FUNCTION into the existing LED display.
- Do not change Month 4 behavior in the first implementation.
- Do not expose Sound Lab V2 during monitoring.
- Do not replace the current black LED / single guide tone baseline.
- Do not add arpeggios or stacked chord playback.

## Open Questions
- วิธีการจัดการ UI ใน Compare mode ที่จะไม่กระทบกับเลย์เอาต์ปัจจุบันของปุ่มคอร์ด
- พื้นที่จัดวาง What to listen for panel ควรอยู่ด้านบนหรือล่างของ LED
