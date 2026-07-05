# Play by Form Notes

สถานะเอกสาร: บันทึกแนวคิดสำหรับ Month 2 และเดือนต่อไป ไม่ใช่งาน implement UI ในรอบนี้

## Idea

Playing by song form คือการเข้าใจโครงสร้างของเพลง ไม่ใช่จำชื่อคอร์ดทีละตัวแบบแยกกัน ผู้เรียนควรเริ่มรู้สึกว่าเพลงมีบ้าน มีจุดที่ออกจากบ้าน และมีแรงดึงกลับบ้าน

ใน Guitar Companion คำว่า Form ควรอธิบายแบบง่าย:

- เพลงไม่ได้เป็นคอร์ดลอย ๆ เรียงต่อกัน
- คอร์ดแต่ละตัวมีหน้าที่
- Root ช่วยบอกว่าบ้านอยู่ตรงไหน
- I-IV-V เป็นแผนที่แรกที่ใช้กับ blues และเพลงจำนวนมาก

## Why It Matters

ผู้เรียนจำนวนมากเล่นเพลงได้เฉพาะตอนเห็นชื่อคอร์ดตรงหน้า พอเปลี่ยนคีย์ หรือไม่มี chord chart ก็เริ่มหลง เพราะยังไม่เห็นโครงสร้างข้างในเพลง

Play by Form ช่วยให้ผู้เรียนเริ่มเข้าใจ:

- home chord หรือคอร์ดบ้าน
- chord movement หรือทิศทางของเพลง
- Root position บนสาย 6 และสาย 5
- I-IV-V เป็น map ที่ย้ายคีย์ได้
- transposition ในอนาคต

สำหรับสาย blues นี่คือสะพานสำคัญ เพราะ 12-bar blues ไม่ได้เริ่มจาก lick ยาก ๆ แต่เริ่มจากการได้ยินว่า I อยู่ไหน IV เปิดออกอย่างไร และ V ดึงกลับบ้านอย่างไร

## Fit in Guitar Companion

- Week 0 แค่ seed คำว่า Root และ Form ให้ผู้เรียนเริ่มคุ้น ไม่ต้องสอนระบบ
- Month 1 สร้าง timing, Pulse, Groove และการเล่นให้ตรง Metronome
- Month 2 เริ่มให้ Root กับ form awareness ผ่าน fretboard mapping
- Month 3 สามารถสอน Nashville numbers ตรงขึ้นได้ เพราะผู้เรียนมีประสบการณ์กับ I-IV-V แล้ว
- Blues path ใช้ I-IV-V เป็นสะพานจากคอกีตาร์ไปสู่ rhythm, chord tone และ phrasing

## Month 2 Boundaries

### Do

- ใช้ I-IV-V เป็นแผนที่ง่าย ๆ
- ใช้ Root บนสาย 6 และสาย 5 เป็นจุดเริ่ม
- ใช้ 12-bar blues เป็น preview เบา ๆ
- ให้ผู้เรียนฟังคำว่า "กลับบ้าน" จาก V ไป I
- ให้เล่นช้า ๆ ด้วย Pulse จาก Month 1
- ใช้ key เดียวก่อน เช่น A หรือ G

### Do Not

- ยังไม่สอน Nashville Number System เต็มระบบ
- ยังไม่สอน advanced harmony
- ยังไม่บังคับ ii-V-I เร็วเกินไป
- ยังไม่ให้จำหลายคีย์พร้อมกัน
- ยังไม่ให้ solo หรือ improvise เต็มรูปแบบ
- ยังไม่ใช้คำศัพท์ทฤษฎีมากจนผู้เรียนลืมเล่นจริง

## Example Practice

Key A:

- I = A
- IV = D
- V = E

Practice:

1. หา A Root บนสาย 6 และสาย 5
2. หา D และ E จาก Root ที่รู้แล้ว
3. เล่น A, D, E ช้า ๆ ที่ 60 BPM
4. พูดว่า "บ้าน" เมื่อกลับมาที่ A
5. ฟังว่า E อยากดึงกลับ A หรือไม่
6. ยังไม่ต้องกังวลเรื่อง strumming สวย ๆ ให้ Pulse ตรงก่อน

ครูอธิบายให้ผู้เรียนฟังได้แบบนี้:

> ตอนนี้ยังไม่ต้องจำระบบ Nashville ทั้งหมด แค่เริ่มรู้ว่าเพลงไม่ได้เป็นคอร์ดแยก ๆ แต่มีบ้าน มีทางออก และมีทางกลับบ้าน

## Future Expansion

- Month 3: Chord Tone & Arpeggio Foundation สามารถสอน Nashville Basics แบบเป็นระบบมากขึ้น
- Month 4: Progression Ear และ Transcription Lab
- Later: 12-bar blues, turnaround, chord-tone soloing, triads across string sets

## Future Data Notes

เมื่อพร้อม implement จริง อาจเก็บข้อมูลแบบสั้นและอ่านง่าย:

```js
{
  key: "A",
  progression: ["I", "IV", "V", "I"],
  chords: { I: "A", IV: "D", V: "E" },
  functionLabels: {
    I: "บ้าน",
    IV: "เปิดออก",
    V: "ดึงกลับ"
  },
  bpm: 60,
  practicePrompt: "เล่นหนึ่งคอร์ดต่อหนึ่งห้อง แล้วพูดหน้าที่ของคอร์ดก่อนเล่น"
}
```

นี่เป็น note สำหรับอนาคตเท่านั้น ยังไม่ใช่ข้อกำหนดให้แก้ loader หรือ `outputs/data.json`

## Next-step TODOs

- สร้างตัวอย่าง I-IV-V ใน key A และ G แบบสั้นสำหรับ Week 8
- เขียนคำถาม self-check ที่วัดการฟัง "กลับบ้าน" โดยไม่กลายเป็นข้อสอบทฤษฎี
- เตรียม visual เล็ก ๆ ที่แสดง I, IV, V Root บนสาย 6/5
- เชื่อม Play by Form กับ Month 1 rhythm pattern เพื่อให้ผู้เรียนเล่นเป็นเพลง ไม่ใช่แค่ชี้ตำแหน่ง
- รอคำสั่งเปิด Month 2 ก่อนแก้ UI หรือ data จริง
