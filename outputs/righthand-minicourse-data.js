window.rightHandMiniCourseData = {
  "id": "righthand-minicourse-v1",
  "title": "Right-Hand Control — 8 Weeks",
  "description": "มินิคอร์สเจาะลึกการควบคุมมือขวาสำหรับมือใหม่ พร้อมระบบฝึก interactive และบันทึกผลซ้อม",
  "totalWeeks": 8,
  "phases": [
    { "id": "phase-1", "title": "Phase 1 — Foundation", "weekIds": ["w1", "w2"] },
    { "id": "phase-2", "title": "Phase 2 — Alternate Picking", "weekIds": ["w3", "w4"] },
    { "id": "phase-3", "title": "Phase 3 — String Control", "weekIds": ["w5", "w6"] },
    { "id": "phase-4", "title": "Phase 4 — Integration", "weekIds": ["w7", "w8"] }
  ],
  "safety": [
    "**Tension = slow down:** เมื่อเริ่มรู้สึกเกร็ง ให้ลดความเร็ว Metronome ลงทันที",
    "**Pain = stop:** หากมีอาการเจ็บ ปวดแปลบ หรือชา ให้หยุดฝึกทันที ห้ามฝืนเล่นผ่านความเจ็บปวด",
    "**Neutral Posture:** รักษาตำแหน่งของหัวไหล่ คอ แขน และข้อมือให้อยู่ในระนาบปกติ ไม่ยกไหล่หรือบิดข้อมือ"
  ],
  "comfortTempo": [
    "**Comfort Tempo:** ความเร็วที่เล่นสะอาด ผ่อนคลาย และต่อเนื่อง 45-60 วินาทีโดยไม่ฝืน",
    "**Challenge Tempo:** ความเร็วที่เร็วกว่า Comfort Tempo เล็กน้อย (+5 BPM) เล่นได้ 20-30 วินาที"
  ],
  "rubric": [
    "**Accuracy (0-3):** 0=หลุด 1=มีหลุดบ้าง 2=ต่อเนื่องแม่นยำ 3=สะอาดสม่ำเสมอ",
    "**Relaxation (0-3):** 0=เจ็บ/ชา 1=เกร็งมาก 2=ผ่อนคลายดี 3=ไร้ความตึงเครียด",
    "**Musicality (0-3):** 0=ขาดจังหวะ 1=น้ำหนักไม่สม่ำเสมอ 2=จังหวะชัดเจน 3=มี Groove สวยงาม"
  ],
  "chapters": [
    {
      "id": "ch-1",
      "title": "Chapter 1 — Foundation & Groove (Week 1–4)",
      "weeks": [
        {
          "id": "w1",
          "title": "Week 1",
          "weeklyGoal": "Pick Grip, Pick Depth & Relaxed Motion",
          "rhythmGeometryBlock": {
            "id": "rg-rh-w1-alternate-8ths",
            "title": "8th Note Alternate Picking Grid",
            "subtitle": "ฝึก Downstroke/Upstroke สลับสม่ำเสมอผ่านตาราง 8th Grid 4 Beat",
            "subdivision": "8th Grid",
            "defaultMnemonicMode": "food_en",
            "pattern": [
              {
                "beat": 1,
                "subbeats": [
                  { "picking": "down", "accent": true, "mnemonics": { "food_en": "1", "takadimi": "ta", "counting": "1", "food_th": "1" } },
                  { "picking": "up", "accent": false, "mnemonics": { "food_en": "&", "takadimi": "di", "counting": "&", "food_th": "และ" } },
                  { "picking": "rest", "accent": false, "mnemonics": { "food_en": "·", "takadimi": "·", "counting": "·", "food_th": "·" } },
                  { "picking": "rest", "accent": false, "mnemonics": { "food_en": "·", "takadimi": "·", "counting": "·", "food_th": "·" } }
                ]
              },
              {
                "beat": 2,
                "subbeats": [
                  { "picking": "down", "accent": false, "mnemonics": { "food_en": "2", "takadimi": "ta", "counting": "2", "food_th": "2" } },
                  { "picking": "up", "accent": false, "mnemonics": { "food_en": "&", "takadimi": "di", "counting": "&", "food_th": "และ" } },
                  { "picking": "rest", "accent": false, "mnemonics": { "food_en": "·", "takadimi": "·", "counting": "·", "food_th": "·" } },
                  { "picking": "rest", "accent": false, "mnemonics": { "food_en": "·", "takadimi": "·", "counting": "·", "food_th": "·" } }
                ]
              },
              {
                "beat": 3,
                "subbeats": [
                  { "picking": "down", "accent": true, "mnemonics": { "food_en": "3", "takadimi": "ta", "counting": "3", "food_th": "3" } },
                  { "picking": "up", "accent": false, "mnemonics": { "food_en": "&", "takadimi": "di", "counting": "&", "food_th": "และ" } },
                  { "picking": "rest", "accent": false, "mnemonics": { "food_en": "·", "takadimi": "·", "counting": "·", "food_th": "·" } },
                  { "picking": "rest", "accent": false, "mnemonics": { "food_en": "·", "takadimi": "·", "counting": "·", "food_th": "·" } }
                ]
              },
              {
                "beat": 4,
                "subbeats": [
                  { "picking": "down", "accent": false, "mnemonics": { "food_en": "4", "takadimi": "ta", "counting": "4", "food_th": "4" } },
                  { "picking": "up", "accent": false, "mnemonics": { "food_en": "&", "takadimi": "di", "counting": "&", "food_th": "และ" } },
                  { "picking": "rest", "accent": false, "mnemonics": { "food_en": "·", "takadimi": "·", "counting": "·", "food_th": "·" } },
                  { "picking": "rest", "accent": false, "mnemonics": { "food_en": "·", "takadimi": "·", "counting": "·", "food_th": "·" } }
                ]
              }
            ]
          },
          "drills": [
            {
              "id": "w1-d1",
              "dayStr": "Day 1",
              "title": "จุดสัมผัสของปิ๊ก",
              "desc": "จับปิ๊กด้วยนิ้วโป้งและด้านข้างนิ้วชี้ ปลายโผล่ 3-5 มม. เล่น Downstroke บนสาย 3 แบบ muted 4 ครั้งต่อห้อง",
              "suggestedBpm": 50,
              "completionRequired": true
            },
            {
              "id": "w1-d2",
              "dayStr": "Day 2",
              "title": "Downstroke เคลื่อนไหวน้อย",
              "desc": "สาย 3 muted เล่น Downstroke เป็น 8th notes จำกัดระยะเคลื่อนที่ปิ๊กให้อยู่ใกล้สาย ไม่เกินระยะสายข้างเคียง 4 รอบ รอบละ 30 วินาที",
              "suggestedBpm": 50,
              "completionRequired": true
            },
            {
              "id": "w1-d3",
              "dayStr": "Day 3",
              "title": "Upstroke เบื้องต้น",
              "desc": "สาย 3 muted เล่น Upstroke ช้าๆ แยกจาก Downstroke (U - พัก - U - พัก) หลีกเลี่ยงการเกี่ยวสายแรงเกินไป",
              "suggestedBpm": 45,
              "completionRequired": true
            },
            {
              "id": "w1-d4",
              "dayStr": "Day 4",
              "title": "Down/Up แยกจังหวะ",
              "desc": "ฝึกสลับ D - U - D - U บนสาย 3 muted เริ่มจาก quarter notes สู่ 8th notes คุมขนาดทิศทางเคลื่อนที่ให้เท่ากัน",
              "suggestedBpm": 45,
              "completionRequired": true
            },
            {
              "id": "w1-d5",
              "dayStr": "Day 5",
              "title": "Weekly Musical Mission",
              "desc": "เล่น muted-string groove ขนาดยาว: D U D U D U D U (8th notes) ต่อเนื่อง 4 ห้อง พัก 1 ห้อง ทำซ้ำ 4 รอบ",
              "suggestedBpm": 50,
              "completionRequired": true
            },
            {
              "id": "w1-d6",
              "dayStr": "Day 6",
              "title": "Active Review & Ear Task",
              "desc": "รีวิว Day 1, 3 และ 5 ที่ระดับความเร็วต่ำกว่า Comfort 5-10 BPM *Ear Task:* ฟังนิ่งๆ หาจุดที่ความสม่ำเสมอของน้ำหนัก Down และ Up เริ่มแตกต่างกัน",
              "suggestedBpm": 45,
              "completionRequired": true
            },
            {
              "id": "w1-d7",
              "dayStr": "Day 7",
              "title": "Full Rest",
              "desc": "พักร่างกาย สังเกตอาการล้าตกค้าง",
              "suggestedBpm": 0,
              "completionRequired": false
            }
          ]
        },
        {
          "id": "w2",
          "title": "Week 2",
          "weeklyGoal": "Downstroke / Upstroke Balance & Rhythm Geometry",
          "rhythmGeometryBlock": {
            "id": "rg-rh-w2-alternate-16ths",
            "title": "16th Syncopation Grid (RHC Edition)",
            "subtitle": "ฝึกควบคุมน้ำหนักปิ๊กผ่านตาราง 16th Grid 4 Beat",
            "subdivision": "16th Grid",
            "defaultMnemonicMode": "food_en",
            "pattern": [
              {
                "beat": 1,
                "subbeats": [
                  { "picking": "down", "accent": true, "mnemonics": { "food_en": "1", "takadimi": "ta", "counting": "1", "food_th": "1" } },
                  { "picking": "up", "accent": false, "mnemonics": { "food_en": "e", "takadimi": "ka", "counting": "e", "food_th": "อี" } },
                  { "picking": "down", "accent": false, "mnemonics": { "food_en": "&", "takadimi": "di", "counting": "&", "food_th": "และ" } },
                  { "picking": "up", "accent": false, "mnemonics": { "food_en": "a", "takadimi": "mi", "counting": "a", "food_th": "อา" } }
                ]
              },
              {
                "beat": 2,
                "subbeats": [
                  { "picking": "down", "accent": false, "mnemonics": { "food_en": "2", "takadimi": "ta", "counting": "2", "food_th": "2" } },
                  { "picking": "up", "accent": true, "mnemonics": { "food_en": "e", "takadimi": "ka", "counting": "e", "food_th": "อี" } },
                  { "picking": "down", "accent": false, "mnemonics": { "food_en": "&", "takadimi": "di", "counting": "&", "food_th": "และ" } },
                  { "picking": "up", "accent": false, "mnemonics": { "food_en": "a", "takadimi": "mi", "counting": "a", "food_th": "อา" } }
                ]
              },
              {
                "beat": 3,
                "subbeats": [
                  { "picking": "down", "accent": true, "mnemonics": { "food_en": "3", "takadimi": "ta", "counting": "3", "food_th": "3" } },
                  { "picking": "up", "accent": false, "mnemonics": { "food_en": "e", "takadimi": "ka", "counting": "e", "food_th": "อี" } },
                  { "picking": "down", "accent": false, "mnemonics": { "food_en": "&", "takadimi": "di", "counting": "&", "food_th": "และ" } },
                  { "picking": "up", "accent": false, "mnemonics": { "food_en": "a", "takadimi": "mi", "counting": "a", "food_th": "อา" } }
                ]
              },
              {
                "beat": 4,
                "subbeats": [
                  { "picking": "down", "accent": false, "mnemonics": { "food_en": "4", "takadimi": "ta", "counting": "4", "food_th": "4" } },
                  { "picking": "up", "accent": false, "mnemonics": { "food_en": "e", "takadimi": "ka", "counting": "e", "food_th": "อี" } },
                  { "picking": "down", "accent": true, "mnemonics": { "food_en": "&", "takadimi": "di", "counting": "&", "food_th": "และ" } },
                  { "picking": "up", "accent": false, "mnemonics": { "food_en": "a", "takadimi": "mi", "counting": "a", "food_th": "อา" } }
                ]
              }
            ]
          },
          "drills": [
            {
              "id": "w2-d1",
              "dayStr": "Day 1",
              "title": "เปรียบเทียบเสียง Down และ Up",
              "desc": "เล่นเป็นคู่ D U - พัก, D U - พัก บนสาย 3 muted ฟังและคุมให้ระดับเสียงสมดุลกัน",
              "suggestedBpm": 55,
              "completionRequired": true
            },
            {
              "id": "w2-d2",
              "dayStr": "Day 2",
              "title": "Accent Downstroke",
              "desc": "เล่น 8th notes เน้นน้ำหนักเสียงเฉพาะ Downstroke: D(>) U d U d(>) U d U",
              "suggestedBpm": 55,
              "completionRequired": true
            },
            {
              "id": "w2-d3",
              "dayStr": "Day 3",
              "title": "Accent Upstroke",
              "desc": "เล่น 8th notes เน้นเฉพาะ Upstroke: d U(>) d U d U(>) d U คุมข้อมือไม่ให้เกี่ยวสายรุนแรง",
              "suggestedBpm": 50,
              "completionRequired": true
            },
            {
              "id": "w2-d4",
              "dayStr": "Day 4",
              "title": "Equal Stroke Challenge",
              "desc": "เล่น 8th notes ยาวคุมน้ำหนัก Down และ Up ให้สม่ำเสมอเท่ากัน ไร้รูปแบบดังเบาโดยไม่ได้ตั้งใจ",
              "suggestedBpm": 55,
              "completionRequired": true
            },
            {
              "id": "w2-d5",
              "dayStr": "Day 5",
              "title": "Four-Bar Balance Mission",
              "desc": "ห้อง 1: ทุกโน้ตเท่ากัน / ห้อง 2: Accent Down / ห้อง 3: Accent Up / ห้อง 4: ทุกโน้ตเท่ากัน",
              "suggestedBpm": 55,
              "completionRequired": true
            },
            {
              "id": "w2-d6",
              "dayStr": "Day 6",
              "title": "Active Review & Ear Task",
              "desc": "บันทึกค่า Baseline เทคนิคเฉพาะตัว *Ear Task:* ฟังแยกแยะความแตกต่างของหางเสียง",
              "suggestedBpm": 50,
              "completionRequired": true
            },
            {
              "id": "w2-d7",
              "dayStr": "Day 7",
              "title": "Full Rest",
              "desc": "พักร่างกาย สังเกตอาการล้าตกค้าง",
              "suggestedBpm": 0,
              "completionRequired": false
            }
          ]
        },
        {
          "id": "w3",
          "title": "Week 3",
          "weeklyGoal": "Alternate Picking on One String (Phase 2 Preview)",
          "drills": [
            { "id": "w3-d1", "dayStr": "Day 1", "title": "Single String Alternate", "desc": "Phase 2 Preview Drill", "suggestedBpm": 60, "completionRequired": true }
          ]
        },
        {
          "id": "w4",
          "title": "Week 4",
          "weeklyGoal": "Rhythm, Accent & Backbeat Checkpoint (Phase 2 Preview)",
          "drills": [
            { "id": "w4-d1", "dayStr": "Day 1", "title": "Backbeat Checkpoint", "desc": "Phase 2 Preview Drill", "suggestedBpm": 60, "completionRequired": true }
          ]
        }
      ]
    },
    {
      "id": "ch-2",
      "title": "Chapter 2 — String Control (Week 5–8)",
      "weeks": [
        {
          "id": "w5",
          "title": "Week 5",
          "weeklyGoal": "Adjacent String Crossing (Inside & Outside)",
          "drills": [
            { "id": "w5-d1", "dayStr": "Day 1", "title": "String Crossing Intro", "desc": "Phase 2 Preview Drill", "suggestedBpm": 50, "completionRequired": true }
          ]
        },
        {
          "id": "w6",
          "title": "Week 6",
          "weeklyGoal": "String Skipping & String Tracking",
          "drills": [
            { "id": "w6-d1", "dayStr": "Day 1", "title": "String Skipping Intro", "desc": "Phase 2 Preview Drill", "suggestedBpm": 50, "completionRequired": true }
          ]
        },
        {
          "id": "w7",
          "title": "Week 7",
          "weeklyGoal": "Two-Hand Synchronization",
          "drills": [
            { "id": "w7-d1", "dayStr": "Day 1", "title": "Synchronization Intro", "desc": "Phase 2 Preview Drill", "suggestedBpm": 50, "completionRequired": true }
          ]
        },
        {
          "id": "w8",
          "title": "Week 8",
          "weeklyGoal": "Muting Control & Chapter Checkpoint",
          "drills": [
            { "id": "w8-d1", "dayStr": "Day 1", "title": "Muting Control Checkpoint", "desc": "Phase 2 Preview Drill", "suggestedBpm": 50, "completionRequired": true }
          ]
        }
      ]
    }
  ]
};
