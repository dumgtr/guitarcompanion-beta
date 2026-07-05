const WEEK7_MOCK_DATA = {
  weekMeta: {
    week: 7,
    month: 2,
    title: "แผนที่สเกลเมเจอร์",
    englishTitle: "Major Scale Formula / Scale Degrees",
    module: "fretboard",
    theme: "Fretboard Foundation",
    estimatedMinutesPerDay: 20,
    subtitle: "Major Scale 1 Octave",
    promise: "เชื่อม Root และ Octave ให้เป็นเส้นทาง C Major 1 octave ที่ร้องเลขของเสียงไปพร้อมกับการเล่นได้"
  },
  lessonBlocks: [
    {
      id: "w7-block-1-opening",
      type: "text",
      title: "จากบ้านสองหลัง กลายเป็นถนนหนึ่งเส้น",
      body: "Week 5 เราหา Root ได้ Week 6 เราหา Octave ได้ วันนี้เราจะเติมโน้ตระหว่าง 1 ถึง 1 ให้กลายเป็น C Major Scale 1 octave คิดง่าย ๆ ว่าเลข 1 คือบ้านล่าง และเลข 1 ตัวสุดท้ายคือบ้านชั้นบน ส่วนเลข 2-7 คือทางเดินที่เชื่อมบ้านสองหลังนี้เข้าด้วยกัน",
      teacherNote: "อย่าเพิ่งคิดว่า scale คือการเล่นเร็ว ให้คิดว่า scale คือทางเดินของเสียงที่เราร้องตามได้"
    },
    {
      id: "w7-block-2-c-major-map",
      type: "fretboard",
      title: "C Major 1 Octave Map",
      visualRef: "w7-c-major-1-octave",
      instruction: "มอง C เป็นเลข 1 และ C ตัวบนเป็นเลข 1 อีกชั้นเสียงหนึ่ง จากนั้นดูเลข 2-7 เป็นทางเดินระหว่างบ้านสองหลัง"
    },
    {
      id: "w7-block-3-formula",
      type: "text",
      title: "สูตรคือระยะทาง แต่วันนี้ให้จำเป็นรูปทรง",
      body: "Major Scale มีระยะห่างแบบ Whole, Whole, Half, Whole, Whole, Whole, Half แต่วันนี้ไม่ต้องนั่งคำนวณทุกครั้ง ให้ใช้รูปทรง C Major 1 octave ก่อน แล้วพูดเลขของเสียงให้ตรงกับนิ้ว",
      teacherNote: "สูตรมีไว้ให้เข้าใจแผนที่ แต่ตอนเล่นจริงให้หู ปาก และมือเดินไปพร้อมกัน"
    },
    {
      id: "w7-block-4-c-major-tab",
      type: "tab",
      title: "C Major 1 Octave: Ascending & Descending",
      tabRef: "w7-tab-c-major-up-down",
      instruction: "เล่นช้า ๆ และพูดเลข degree ให้ตรงกับทุกโน้ต"
    },
    {
      id: "w7-block-5-degree-anchors",
      type: "fretboard",
      title: "เสียงหลัก 1-3-5",
      visualRef: "w7-degree-anchors-1-3-5",
      instruction: "ฟังเลข 1, 3, 5 เป็น chord-tone preview เบา ๆ ยังไม่ต้องเรียน triad เต็มระบบ"
    },
    {
      id: "w7-block-6-mini-phrase",
      type: "tab",
      title: "Mini Phrase: 1-2-3-5",
      tabRef: "w7-tab-degree-phrase-1235",
      instruction: "ใช้โน้ตน้อย ๆ ให้กลายเป็นวลีดนตรี ฟังว่า 1 ให้ความรู้สึกจบและนิ่ง"
    },
    {
      id: "w7-block-7-listen-home",
      type: "text",
      title: "ให้ปากนำมือ แล้วให้หูยืนยัน",
      body: "ถ้าปากพูดเลขไม่ทัน แปลว่านิ้วกำลังพาเราเร็วเกินไป ให้ลดความเร็วลง เล่นทีละโน้ต และฟังว่าเวลาเดินกลับมาที่เลข 1 เสียงจะรู้สึกเหมือนถึงบ้านหรือจุดพัก",
      teacherNote: "สัปดาห์นี้ชนะด้วยความชัด ไม่ใช่ความเร็ว เล่นช้าแต่เสียงดีคือถูกทางครับ"
    },
    {
      id: "w7-block-8-root-octave-bridge",
      type: "fretboard",
      title: "จาก Root ถึง Octave",
      visualRef: "w7-root-octave-scale-bridge",
      instruction: "ดูภาพรวมอีกครั้งว่า Root, scale notes และ Octave ทำงานร่วมกันเป็นเส้นทางเดียว"
    }
  ],
  fretboardVisuals: [
    {
      id: "w7-c-major-1-octave",
      type: "fretboard",
      title: "C Major 1 Octave",
      caption: "เริ่มจาก C(1) บนสาย 5 fret 3 แล้วเดินไปจนถึง C(1) บนสาย 3 fret 5",
      config: {
        startFret: 1,
        endFret: 5,
        showNut: false
      },
      legend: [
        { type: "root", color: "orange", label: "1 / Root" },
        { type: "octave", color: "gold", label: "1 / Octave" },
        { type: "scale", color: "gray", label: "Scale Degree" },
        { type: "chord-tone", color: "gold", label: "Chord-tone Preview" }
      ],
      dots: [
        { string: 5, fret: 3, label: "1", type: "root" },
        { string: 5, fret: 5, label: "2", type: "scale" },
        { string: 4, fret: 2, label: "3", type: "chord-tone" },
        { string: 4, fret: 3, label: "4", type: "scale" },
        { string: 4, fret: 5, label: "5", type: "chord-tone" },
        { string: 3, fret: 2, label: "6", type: "scale" },
        { string: 3, fret: 4, label: "7", type: "scale" },
        { string: 3, fret: 5, label: "1", type: "octave" }
      ]
    },
    {
      id: "w7-degree-anchors-1-3-5",
      type: "fretboard",
      title: "เสียงหลัก 1-3-5",
      caption: "เริ่มฟังเสียงที่นิ่งและเป็นดนตรีก่อน: 1 คือบ้าน, 3 ให้สีเมเจอร์, 5 ทำให้เสียงมั่นคง",
      config: {
        startFret: 1,
        endFret: 5,
        showNut: false
      },
      legend: [
        { type: "root", color: "orange", label: "1 / Root" },
        { type: "octave", color: "gold", label: "1 / Octave" },
        { type: "chord-tone", color: "gold", label: "Chord-tone Preview" }
      ],
      dots: [
        { string: 5, fret: 3, label: "1", type: "root" },
        { string: 4, fret: 2, label: "3", type: "chord-tone" },
        { string: 4, fret: 5, label: "5", type: "chord-tone" },
        { string: 3, fret: 5, label: "1", type: "octave" }
      ]
    },
    {
      id: "w7-root-octave-scale-bridge",
      type: "fretboard",
      title: "จาก Root ถึง Octave",
      caption: "Root C, Octave C และโน้ต scale ระหว่างกลางคือสะพานที่เชื่อม Week 5 และ Week 6 เข้ากับ Week 7",
      config: {
        startFret: 1,
        endFret: 5,
        showNut: false
      },
      legend: [
        { type: "root", color: "orange", label: "1 / Root" },
        { type: "octave", color: "gold", label: "1 / Octave" },
        { type: "scale", color: "gray", label: "Scale Degree" },
        { type: "chord-tone", color: "gold", label: "Chord-tone Preview" }
      ],
      dots: [
        { string: 5, fret: 3, label: "1", type: "root" },
        { string: 5, fret: 5, label: "2", type: "scale" },
        { string: 4, fret: 2, label: "3", type: "chord-tone" },
        { string: 4, fret: 3, label: "4", type: "scale" },
        { string: 4, fret: 5, label: "5", type: "chord-tone" },
        { string: 3, fret: 2, label: "6", type: "scale" },
        { string: 3, fret: 4, label: "7", type: "scale" },
        { string: 3, fret: 5, label: "1", type: "octave" }
      ]
    }
  ],
  miniTabs: [
    {
      id: "w7-tab-c-major-up-down",
      type: "tab",
      title: "C Major 1 Octave: Up & Down",
      bpm: 60,
      ascii: [
        "e|-----------------|-----------------|",
        "B|-----------------|-----------------|",
        "G|---------2-4-5---|-5-4-2-----------|",
        "D|---2-3-5---------|-------5-3-2-----|",
        "A|-3-5-------------|-------------5-3-|",
        "E|-----------------|-----------------|"
      ],
      lyrics: "  1 2 3 4 5 6 7 1   1 7 6 5 4 3 2 1",
      note: "เล่นช้า ๆ แล้วพูดเลข degree ให้ตรงกับเสียงที่ออกจากกีตาร์"
    },
    {
      id: "w7-tab-degree-phrase-1235",
      type: "tab",
      title: "Mini Phrase: 1-2-3-5",
      bpm: 60,
      ascii: [
        "e|-----------------|-----------------|",
        "B|-----------------|-----------------|",
        "G|-----------------|-----------------|",
        "D|-----2-------5---|-----2-----------|",
        "A|-3-5---3-5-------|-3-5---5-3-------|",
        "E|-----------------|-----------------|"
      ],
      lyrics: "  1 2 3 1 2 5     1 2 3 2 1",
      note: "ใช้โน้ตน้อย ๆ ให้เป็นวลีดนตรี ฟังว่า 1 ให้ความรู้สึกจบและนิ่งที่สุด"
    }
  ],
  dailyPractice: [
    {
      dayLabel: "Day 1-2",
      focus: "Root to Octave: 1 ถึง 1",
      isOpen: true,
      exercises: [
        {
          id: "m2-w7-d1-p1",
          duration: "4 นาที",
          title: "ชี้เลข 1 สองตำแหน่ง",
          instruction: "หา C(1) สาย 5 fret 3 และ C(1) สาย 3 fret 5 แล้วเล่นสลับกันช้า ๆ"
        },
        {
          id: "m2-w7-d1-p2",
          duration: "6 นาที",
          title: "เดิน C Major ช้า ๆ",
          instruction: "เล่น 1-2-3-4-5-6-7-1 ที่ 60 BPM โดยพูดเลขก่อนดีดทุกครั้ง"
        },
        {
          id: "m2-w7-d2-p1",
          duration: "5 นาที",
          title: "ฟังเลข 1 เป็นบ้าน",
          instruction: "เล่น 1 ถึง 1 แล้วหยุดที่เลข 1 ตัวบน ฟังว่ามันรู้สึกจบและนิ่งกว่าตัวอื่น"
        }
      ]
    },
    {
      dayLabel: "Day 3-4",
      focus: "Ascending & Descending",
      isOpen: false,
      exercises: [
        {
          id: "m2-w7-d3-p1",
          duration: "6 นาที",
          title: "ขึ้นและลงช้า ๆ",
          instruction: "เล่น w7-tab-c-major-up-down ช้า ๆ ให้เสียงทุกตัวชัดและไม่บอด"
        },
        {
          id: "m2-w7-d4-p1",
          duration: "4 นาที",
          title: "ปากนำมือ",
          instruction: "พูดเลข degree ก่อนดีด ถ้าปากไม่ทัน ให้หยุดและเริ่มใหม่"
        },
        {
          id: "m2-w7-d4-p2",
          duration: "4 นาที",
          title: "ลงสเกลให้สะอาด",
          instruction: "เล่น 1-7-6-5-4-3-2-1 ช้า ๆ ตรวจว่าโน้ตขาลงไม่เบลอหรือหลุด Metronome"
        }
      ]
    },
    {
      dayLabel: "Day 5",
      focus: "Degree naming",
      isOpen: false,
      exercises: [
        {
          id: "m2-w7-d5-p1",
          duration: "5 นาที",
          title: "สุ่มเลขของเสียง",
          instruction: "สุ่มพูดเลข 1, 3, 5 แล้วหาตำแหน่งใน C Major 1 octave ให้เจอ"
        },
        {
          id: "m2-w7-d5-p2",
          duration: "5 นาที",
          title: "ร้องแล้วเล่น",
          instruction: "ฮัม 1-2-3-4-5-6-7-1 เบา ๆ แล้วเล่นตามแบบไม่รีบ"
        }
      ]
    },
    {
      dayLabel: "Day 6-7",
      focus: "Mini musical phrase & Self-check",
      isOpen: false,
      exercises: [
        {
          id: "m2-w7-d6-p1",
          duration: "6 นาที",
          title: "Mini Phrase 1-2-3-5",
          instruction: "เล่น w7-tab-degree-phrase-1235 ให้เป็นวลี ไม่ใช่ดีดไล่โน้ต"
        },
        {
          id: "m2-w7-d6-p2",
          duration: "4 นาที",
          title: "ฟัง 1 เป็นจุดพัก",
          instruction: "เล่นวลีสั้น ๆ แล้วจบที่เลข 1 ทุกครั้ง สังเกตว่าเสียงกลับบ้านอย่างไร"
        },
        {
          id: "m2-w7-d7-p1",
          duration: "5 นาที",
          title: "ทำ Self-Check",
          instruction: "เช็กว่าปากพูดเลขตรงกับนิ้ว และเสียงโน้ต 1 ฟังแล้วจบเคลียร์"
        }
      ]
    }
  ],
  selfCheck: {
    type: "self-check",
    id: "w7-self-check",
    week: 7,
    title: "เช็กว่าเลขของเสียงเริ่มตรงกับมือหรือยัง",
    questions: [
      {
        id: "w7-q1",
        type: "multiple-choice",
        prompt: "ใน C Major Scale เลข 1 คืออะไร",
        choices: [
          { id: "a", text: "C หรือ Root", correct: true },
          { id: "b", text: "โน้ตที่ต้องเล่นเร็วที่สุด" },
          { id: "c", text: "เสียงที่อยู่บนสาย 1 เท่านั้น" }
        ],
        answer: "a",
        correctFeedback: "ถูกครับ C คือเลข 1 หรือ Root ของ C Major",
        incorrectFeedback: "ยังไม่ใช่ครับ เลข 1 คือบ้านของสเกล ใน C Major ก็คือ C"
      },
      {
        id: "w7-q2",
        type: "multiple-choice",
        prompt: "Major Scale 1 octave เดินเลขอย่างไร",
        choices: [
          { id: "a", text: "1-2-3-4-5-6-7-1", correct: true },
          { id: "b", text: "1-3-5-7 เท่านั้น" },
          { id: "c", text: "1-4-5-1 เท่านั้น" }
        ],
        answer: "a",
        correctFeedback: "ใช่ครับ วันนี้เราสร้างทางเดินจาก 1 ไปหา 1 อีกชั้นเสียง",
        incorrectFeedback: "ลองกลับไปดูแผนที่ C Major 1 octave อีกครั้ง เส้นทางเต็มคือ 1-2-3-4-5-6-7-1"
      },
      {
        id: "w7-q3",
        type: "practical-check",
        prompt: "เล่น C Major 1 octave ขึ้นลงได้ช้า ๆ หรือยัง",
        instruction: "เล่นขึ้นและลงที่ 60 BPM โดยเสียงทุกตัวชัด และพูดเลข 1-7-1 ให้ตรงกับนิ้ว",
        passCondition: "เล่นขึ้นลงได้ครบโดยไม่หยุดกลางทาง และเสียงไม่บอด"
      },
      {
        id: "w7-q4",
        type: "reflection",
        prompt: "โน้ตเลข 1 ให้ความรู้สึกอย่างไร",
        instruction: "อธิบายด้วยคำของตัวเองว่าเวลาเล่นกลับมาที่เลข 1 ทำไมเสียงถึงรู้สึกจบหรือพัก",
        passCondition: "อธิบายได้ว่าเลข 1 คือบ้านหรือจุดพักของเสียง"
      }
    ],
    passCriteria: [
      "เล่น C Major 1 octave ขึ้นลงได้ช้า ๆ ชัด ๆ",
      "พูดเลข 1-2-3-4-5-6-7-1 ตรงกับโน้ตที่เล่น",
      "ฟังออกว่าเลข 1 ให้ความรู้สึกจบและนิ่ง",
      "เล่น mini phrase 1-2-3-5 ได้โดยยังเป็นเสียงดนตรี ไม่ใช่แค่ดีดไล่"
    ],
    troubleshooting: [
      {
        problem: "ดีดเร็วกว่าปาก",
        advice: "ลด BPM หรือหยุด Metronome ชั่วคราว แล้วพูดเลขก่อนดีดทุกครั้ง ให้ปากเป็นคนพามือ"
      },
      {
        problem: "นิ้วก้อยบอดที่ fret 5",
        advice: "คลายข้อมือซ้าย กดใกล้ fret มากขึ้น และลดแรงบีบ นิ้วก้อยไม่ต้องกดแรง แค่กดถูกจุด"
      },
      {
        problem: "จำเลข degree สลับกับชื่อโน้ต",
        advice: "วันนี้ให้พูดเลขก่อน ชื่อโน้ตค่อยตามทีหลัง เป้าหมายคือให้หูจำหน้าที่ของเสียง"
      }
    ],
    passSummary: "พร้อมไป Week 8 เมื่อเล่น C Major 1 octave ได้สะอาด และปากพูดเลขของเสียงตรงกับนิ้วโดยไม่ต้องเดา"
  }
};

window.WEEK7_MOCK_DATA = WEEK7_MOCK_DATA;
