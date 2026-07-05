const WEEK6_MOCK_DATA = {
  weekMeta: {
    week: 6,
    month: 2,
    title: "ขยายแผนที่ด้วย Octave",
    englishTitle: "All String Mapping / Octave Shapes",
    module: "fretboard",
    theme: "Fretboard Foundation",
    estimatedMinutesPerDay: 20,
    subtitle: "All String Mapping",
    promise: "ขยาย Root จากสาย 6 และ 5 ไปยังสายล่างด้วย Octave Shape เพื่อหาโน้ตชื่อเดียวกันบนคอกีตาร์ได้เร็วขึ้น โดยไม่ต้องท่องจำทั้งคอ"
  },
  lessonBlocks: [
    {
      id: "w6-block-1-opening",
      type: "text",
      title: "ใช้ Shape แทนการท่องจำทั้งคอ",
      body: "สัปดาห์นี้เราจะเริ่มย้าย Root ที่รู้จักแล้วไปยังตำแหน่งเสียงสูงขึ้นด้วย Octave Shape แทนการไล่นับโน้ตทีละช่อง เป้าหมายไม่ใช่จำทั้งคอในวันเดียว แต่ให้มือเริ่มเห็นรูปทรงซ้ำ ๆ และให้หูฟังออกว่าโน้ตสองตัวนี้เป็นชื่อเดียวกัน คนละชั้นเสียงเท่านั้น",
      teacherNote: "ถ้ามือยังไม่จำระยะ ไม่ต้องรีบ ให้เล่นช้าและฟังว่าเป็นชื่อโน้ตเดียวกันจริงไหม ความแม่นสำคัญกว่าความเร็วในสัปดาห์นี้"
    },
    {
      id: "w6-block-2-s6-to-s4",
      type: "fretboard",
      title: "Octave Shape: สาย 6 ไปสาย 4",
      visualRef: "w6-octave-s6-to-s4",
      instruction: "เริ่มจาก Root บนสาย 6 แล้วข้ามไปหา Octave บนสาย 4 ล็อกระยะนิ้วให้เหมือนเป็นก้อนเดียวกัน"
    },
    {
      id: "w6-block-3-left-hand-shape",
      type: "text",
      title: "ล็อกมือซ้ายให้จำระยะ",
      body: "Octave Shape ควรรู้สึกเหมือนนิ้วชี้กับนิ้วนางหรือนิ้วก้อยถูกล็อกระยะไว้แล้วเลื่อนไปทั้งรูปทรง อย่าคิดเป็นโน้ตแยกทีละตัว ให้คิดว่าเรา Copy & Paste Root ไปยังชั้นเสียงที่สูงขึ้น",
      teacherNote: "ถ้านิ้วก้อยยังบอด ใช้นิ้วนางแทนชั่วคราวได้ แต่ให้ค่อย ๆ กลับมาฝึกนิ้วก้อย เพราะต่อไปมันจะช่วยให้มือเปิดกว้างขึ้นมาก"
    },
    {
      id: "w6-block-4-s5-to-s3",
      type: "fretboard",
      title: "Octave Shape: สาย 5 ไปสาย 3",
      visualRef: "w6-octave-s5-to-s3",
      instruction: "ใช้ความห่างมือแบบเดียวกันกับสาย 6 ไป 4 แต่ย้ายฐานมาเริ่มจากสาย 5"
    },
    {
      id: "w6-block-5-call-response-tab",
      type: "tab",
      title: "Root to Octave Call & Response",
      tabRef: "w6-tab-root-octave-call-response",
      instruction: "ดีด Root หนึ่งครั้ง แล้วตอบด้วย Octave หนึ่งครั้งให้ตรง Metronome"
    },
    {
      id: "w6-block-6-listen-check",
      type: "text",
      title: "ฟังอย่างไรว่า Octave ถูก",
      body: "ถ้ากดถูก เสียง Root กับ Octave จะรู้สึกกลมกลืนเหมือนเป็นบ้านหลังเดียวกันแต่คนละชั้น ถ้าฟังแล้วขัด หรือตึงแปลก ๆ ให้หยุดก่อน อย่ารีบดันต่อ ให้กลับไปเช็ก fret และสายที่กด",
      teacherNote: "ให้หูเป็นครูร่วมกับตาเสมอ ภาพช่วยบอกตำแหน่ง แต่เสียงจะเป็นคนยืนยันว่ากดถูกจริง"
    }
  ],
  fretboardVisuals: [
    {
      id: "w6-octave-s6-to-s4",
      type: "fretboard",
      title: "Octave Shape จากสาย 6 ไปสาย 4",
      caption: "เริ่มจาก Root บนสาย 6 แล้วข้าม 1 สาย ขยับไปอีก 2 fret เพื่อหา Octave บนสาย 4",
      config: {
        startFret: 1,
        endFret: 8,
        showNut: true
      },
      legend: [
        { type: "root", color: "orange", label: "Root" },
        { type: "octave", color: "gold", label: "Octave" }
      ],
      dots: [
        { string: 6, fret: 3, label: "G", type: "root" },
        { string: 4, fret: 5, label: "G", type: "octave" },
        { string: 6, fret: 5, label: "A", type: "root" },
        { string: 4, fret: 7, label: "A", type: "octave" }
      ]
    },
    {
      id: "w6-octave-s5-to-s3",
      type: "fretboard",
      title: "Octave Shape จากสาย 5 ไปสาย 3",
      caption: "ใช้ Shape ความห่างแบบเดียวกัน: Root บนสาย 5 กระโดดไปหา Octave บนสาย 3",
      config: {
        startFret: 1,
        endFret: 7,
        showNut: false
      },
      legend: [
        { type: "root", color: "orange", label: "Root" },
        { type: "octave", color: "gold", label: "Octave" }
      ],
      dots: [
        { string: 5, fret: 3, label: "C", type: "root" },
        { string: 3, fret: 5, label: "C", type: "octave" },
        { string: 5, fret: 5, label: "D", type: "root" },
        { string: 3, fret: 7, label: "D", type: "octave" }
      ]
    },
    {
      id: "w6-octave-mixed-map",
      type: "fretboard",
      title: "Mixed Octave Map: A, C, D, G",
      caption: "รวม Root ที่ใช้บ่อยจาก Week 5 แล้วจับคู่กับ Octave เพื่อใช้เช็กตัวเองท้ายสัปดาห์",
      config: {
        startFret: 1,
        endFret: 8,
        showNut: true
      },
      legend: [
        { type: "root", color: "orange", label: "Root" },
        { type: "octave", color: "gold", label: "Octave" }
      ],
      dots: [
        { string: 6, fret: 3, label: "G", type: "root" },
        { string: 4, fret: 5, label: "G", type: "octave" },
        { string: 6, fret: 5, label: "A", type: "root" },
        { string: 4, fret: 7, label: "A", type: "octave" },
        { string: 5, fret: 3, label: "C", type: "root" },
        { string: 3, fret: 5, label: "C", type: "octave" },
        { string: 5, fret: 5, label: "D", type: "root" },
        { string: 3, fret: 7, label: "D", type: "octave" }
      ]
    }
  ],
  miniTabs: [
    {
      id: "w6-tab-root-octave-call-response",
      type: "tab",
      title: "Root -> Octave Call & Response",
      bpm: 60,
      ascii: [
        "e|-----------------|-----------------|",
        "B|-----------------|-----------------|",
        "G|-----------------|-----------------|",
        "D|-----5-------7---|-----5-------7---|",
        "A|-----------------|-----------------|",
        "E|-3-------5-------|-3-------5-------|"
      ],
      lyrics: "  G   G   A   A     G   G   A   A",
      note: "ดีด Root แล้วตอบด้วย Octave ให้เสียงทั้งคู่จมลงกับ click ของ Metronome"
    },
    {
      id: "w6-tab-syncopated-octave-jump",
      type: "tab",
      title: "Syncopated Octave Jump",
      bpm: 60,
      ascii: [
        "e|-----------------|-----------------|",
        "B|-----------------|-----------------|",
        "G|-----5-------7---|-----5-------7---|",
        "D|-----------------|-----------------|",
        "A|-3-------5-------|-3-------5-------|",
        "E|-----------------|-----------------|"
      ],
      lyrics: "  C   C   D   D     C   C   D   D",
      note: "ใช้เป็น mini musical application ตอนท้ายสัปดาห์ เล่นให้รู้สึกเหมือนถาม-ตอบ ไม่ใช่ดีดไล่โน้ตทื่อ ๆ"
    }
  ],
  dailyPractice: [
    {
      dayLabel: "Day 1-2",
      focus: "Octave จากสาย 6 ไปสาย 4",
      isOpen: true,
      exercises: [
        {
          id: "m2-w6-d1-p1",
          duration: "3 นาที",
          title: "ฟัง Root กับ Octave",
          instruction: "เปิด Metronome 60 BPM ดีด G สาย 6 fret 3 แล้วดีด G Octave สาย 4 fret 5 ช้า ๆ ฟังว่าเป็นชื่อโน้ตเดียวกัน"
        },
        {
          id: "m2-w6-d1-p2",
          duration: "5 นาที",
          title: "ล็อก Shape G",
          instruction: "วางนิ้วชี้ที่ G สาย 6 fret 3 แล้ววางนิ้วนางหรือก้อยที่ G สาย 4 fret 5 ค้างไว้ เช็กว่าเสียงไม่บอด"
        },
        {
          id: "m2-w6-d2-p1",
          duration: "5 นาที",
          title: "ย้าย Shape ไป A",
          instruction: "เลื่อนทั้งรูปทรงจาก G ไป A: สาย 6 fret 5 ไปสาย 4 fret 7 อย่าแยกนิ้วคิดทีละตัว"
        }
      ]
    },
    {
      dayLabel: "Day 3-4",
      focus: "Octave จากสาย 5 ไปสาย 3",
      isOpen: false,
      exercises: [
        {
          id: "m2-w6-d3-p1",
          duration: "4 นาที",
          title: "C ไป C Octave",
          instruction: "ดีด C สาย 5 fret 3 แล้วกระโดดไป C สาย 3 fret 5 ให้เสียงลงกับ click ทุกครั้ง"
        },
        {
          id: "m2-w6-d3-p2",
          duration: "4 นาที",
          title: "D ไป D Octave",
          instruction: "ย้ายรูปทรงไป D: สาย 5 fret 5 ไปสาย 3 fret 7 พูดชื่อโน้ตก่อนดีดทุกครั้ง"
        },
        {
          id: "m2-w6-d4-p1",
          duration: "5 นาที",
          title: "เปรียบเทียบสอง Shape",
          instruction: "เล่น G -> G Octave แล้ว C -> C Octave สลับกัน เพื่อให้มือจำว่ารูปทรงเหมือนกันแต่เริ่มคนละสาย"
        }
      ]
    },
    {
      dayLabel: "Day 5",
      focus: "Mix A, C, D, G",
      isOpen: false,
      exercises: [
        {
          id: "m2-w6-d5-p1",
          duration: "5 นาที",
          title: "สุ่ม Root 4 ตัว",
          instruction: "สุ่มพูด A, C, D, G แล้วหา Root ก่อน จากนั้นหา Octave ให้เจอภายใน 5 วินาที"
        },
        {
          id: "m2-w6-d5-p2",
          duration: "5 นาที",
          title: "Root -> Octave Call & Response",
          instruction: "เล่น TAB w6-tab-root-octave-call-response ที่ 60 BPM ให้ Root กับ Octave ตอบกันชัด ๆ"
        }
      ]
    },
    {
      dayLabel: "Day 6-7",
      focus: "Self-test & Mini Musical Application",
      isOpen: false,
      exercises: [
        {
          id: "m2-w6-d6-p1",
          duration: "5 นาที",
          title: "Octave Shape Self-test",
          instruction: "จับเวลา 60 วินาที สุ่มหา G, A, C, D พร้อม Octave ให้ได้มากที่สุดโดยไม่เดา"
        },
        {
          id: "m2-w6-d6-p2",
          duration: "4 นาที",
          title: "Syncopated Octave Jump",
          instruction: "เล่น mini application ด้วย TAB w6-tab-syncopated-octave-jump ให้รู้สึกเป็น Groove เบา ๆ"
        },
        {
          id: "m2-w6-d7-p1",
          duration: "4 นาที",
          title: "ทำ Self-Check",
          instruction: "อ่านเงื่อนไขด้านล่างแล้วเช็กตามจริง ถ้ายังบอดให้กลับไป Day 1-2 ก่อน ไม่ต้องรีบข้าม"
        }
      ]
    }
  ],
  selfCheck: {
    type: "self-check",
    id: "w6-self-check",
    week: 6,
    title: "เช็กว่า Octave Shape เริ่มล็อกมือหรือยัง",
    questions: [
      {
        id: "w6-q1",
        type: "multiple-choice",
        prompt: "Octave หมายถึงอะไร",
        choices: [
          { id: "a", text: "โน้ตชื่อเดียวกัน แต่สูงหรือต่ำคนละชั้นเสียง", correct: true },
          { id: "b", text: "คอร์ดชนิดหนึ่งที่ต้องเล่นเร็ว" },
          { id: "c", text: "รูปแบบการตีคอร์ดแบบ Syncopation" }
        ],
        answer: "a",
        correctFeedback: "ถูกครับ Octave คือชื่อโน้ตเดียวกัน แค่คนละชั้นเสียง",
        incorrectFeedback: "ยังไม่ใช่ครับ ลองฟัง Root กับ Octave อีกครั้ง มันควรรู้สึกเหมือนชื่อเดียวกัน"
      },
      {
        id: "w6-q2",
        type: "practical-check",
        prompt: "เล่น G บนสาย 6 แล้วกระโดดไป G Octave บนสาย 4 ได้หรือไม่",
        instruction: "เล่น G สาย 6 fret 3 ไป G สาย 4 fret 5 จำนวน 8 รอบติดกันที่ 60 BPM โดยนิ้วไม่บอด",
        passCondition: "เล่นได้ 8 รอบติดกันที่ 60 BPM โดยนิ้วไม่บอด"
      },
      {
        id: "w6-q3",
        type: "practical-check",
        prompt: "เล่น C บนสาย 5 แล้วกระโดดไป C Octave บนสาย 3 ได้หรือไม่",
        instruction: "เล่น C สาย 5 fret 3 ไป C สาย 3 fret 5 จำนวน 8 รอบติดกัน โดยเสียงทั้งคู่ชัดและตรง click",
        passCondition: "เล่นได้ 8 รอบติดกันโดยเสียงชัดและตรง Metronome"
      },
      {
        id: "w6-q4",
        type: "reflection",
        prompt: "ฟังออกไหมว่า Root กับ Octave เป็นโน้ตชื่อเดียวกัน",
        instruction: "อธิบายด้วยคำของตัวเองว่าเสียงคู่ Octave ให้ความรู้สึกเหมือนกันตรงไหน และต่างกันตรงไหน",
        passCondition: "อธิบายได้ว่าเป็นชื่อโน้ตเดียวกัน แต่สูงหรือต่ำคนละชั้นเสียง"
      }
    ],
    passCriteria: [
      "จับรูปทรง Octave สาย 6 ไป 4 ได้โดยนิ้วไม่บอด",
      "จับรูปทรง Octave สาย 5 ไป 3 ได้โดยนิ้วไม่บอด",
      "เปลี่ยนตำแหน่งจาก G ไป C ได้โดยยังล็อกความรู้สึกของ Shape เดิมไว้ได้",
      "ฟังออกว่า Root และ Octave เป็นชื่อโน้ตเดียวกัน"
    ],
    troubleshooting: [
      {
        problem: "นิ้วก้อยไม่มีแรงหรือเสียงบอด",
        advice: "ลดความเร็วลง ใช้นิ้วนางแทนนิ้วก้อยชั่วคราวได้ แล้วค่อยกลับมาฝึกนิ้วก้อยทีละนิด"
      },
      {
        problem: "ข้ามสายผิด ไปโดนสาย 3 แทนสาย 4",
        advice: "พูดเส้นทางออกเสียงก่อนเล่น เช่น สาย 6 ไปสาย 4 หรือสาย 5 ไปสาย 3 แล้วค่อยวางนิ้ว"
      },
      {
        problem: "ฟังแล้วไม่รู้ว่า Octave ถูกหรือผิด",
        advice: "เล่น Root ซ้ำ 2 ครั้งก่อน แล้วค่อยเล่น Octave ถ้าเสียงรู้สึกขัดหรือไม่กลืน ให้กลับไปเช็ก fret ทันที"
      }
    ],
    passSummary: "พร้อมไป Week 7 เมื่อมือซ้ายล็อก Octave Shape ได้ และหูเริ่มจำเสียงคู่แปดได้จริง"
  }
};

window.WEEK6_MOCK_DATA = WEEK6_MOCK_DATA;
