const WEEK5_MOCK_DATA = {
  weekMeta: {
    week: 5,
    month: 2,
    title: "รู้บ้าน (Root & Landmarks)",
    subtitle: "Fretboard Foundation",
    promise: "วันนี้เราจะเริ่มปักหมุดบนคอกีตาร์อย่างใจเย็น รู้ว่า Root อยู่ตรงไหน แล้วใช้ Landmark กับ Octave เป็นแผนที่นำทาง"
  },
  lessonBlocks: [
    {
      type: "text",
      heading: "1. หาบ้านให้เจอ (Root)",
      content: "ก่อนที่เราจะจำทั้งคอกีตาร์แบบเดาสุ่ม หลักคิดที่ฉลาดที่สุดคือการหา 'บ้าน (Root)' ให้เจอเป็นอันดับแรก สัปดาห์นี้เราจะปักหมุดที่สาย 6 และสาย 5 ซึ่งเป็นเสาเข็มของทุกคอร์ดในอนาคตครับ"
    },
    { type: "fretboard", visualRef: "w5-root-landmarks-s6" },
    {
      type: "text",
      heading: "2. มหัศจรรย์ของรูปทรง Octave",
      content: "ความลับคือคุณไม่จำเป็นต้องจำทุกช่อง! แค่ใช้รูปทรง Octave (ข้าม 2 สาย และข้าม 2 เฟรต) คุณจะกระโดดหาโน้ตชื่อเดียวกันบนสายอื่นเจอทันทีโดยอัตโนมัติ"
    },
    { type: "fretboard", visualRef: "w5-octave-jumps" },
    { type: "tab", tabRef: "w5-tab-root-pulse" }
  ],
  fretboardVisuals: [
    {
      id: "w5-root-landmarks-s6",
      type: "fretboard",
      title: "Landmarks บนสาย 6",
      caption: "สังเกตจุดไข่ปลา (Dots) บนเฟรต 3, 5, 7 เพื่อใช้เป็นหลักหมุดอ้างอิงในการหา Root",
      config: { startFret: 1, endFret: 8, showNut: true },
      legend: [
        { type: "root", color: "orange", label: "Root (โน้ตบ้าน)" },
        { type: "landmark", color: "gray", label: "Landmark (หมุดอ้างอิง)" }
      ],
      dots: [
        { string: 6, fret: 3, label: "G", type: "root" },
        { string: 6, fret: 5, label: "A", type: "landmark" },
        { string: 6, fret: 7, label: "B", type: "landmark" }
      ]
    },
    {
      id: "w5-octave-jumps",
      type: "fretboard",
      title: "การกระโดดหารูปทรง Octave",
      caption: "ดีด Root C บนสาย 5/เฟรต 3 แล้วข้ามไปหาคู่ Octaves ของมันที่สาย 3/เฟรต 5 สังเกตระยะห่างที่คงเดิมเสมอ",
      config: { startFret: 2, endFret: 7, showNut: false },
      legend: [
        { type: "root", color: "orange", label: "Root หลัก" },
        { type: "octave", color: "gold", label: "Octave (คู่แปด)" }
      ],
      dots: [
        { string: 5, fret: 3, label: "C", type: "root" },
        { string: 3, fret: 5, label: "C", type: "octave" }
      ]
    }
  ],
  miniTabs: [
    {
      id: "w5-tab-root-pulse",
      type: "tab",
      title: "แบบฝึกหัดดีดฝัง Pulse บนโน้ต Root C",
      bpm: 60,
      ascii: [
        "e|-------------------------|",
        "B|-------------------------|",
        "G|-------------------------|",
        "D|-------------------------|",
        "A|---3--3--3--3---3--3--3--|",
        "E|-------------------------|"
      ],
      lyrics: "    1  2  3  4   1  2  3  หยุด",
      note: "วิธีซ้อม: เปิด Metronome 60 BPM ตีลง (Downstroke) ให้เสียงโน้ตจมหายไปกับเสียงคลิกพอดี พร้อมนับเลขออกเสียงขนานกันไป"
    }
  ],
  dailyPractice: [
    {
      dayLabel: "Day 1-2",
      focus: "ปักหมุดสาย 6",
      isOpen: true,
      exercises: [
        {
          id: "m2-w5-d1-p1",
          duration: "3 นาที",
          title: "สแกน Root สาย 6",
          instruction: "เปิด Metronome 60 BPM สุ่มหาและกดโน้ต G (เฟรต 3) และ A (เฟรต 5) สลับกัน"
        },
        {
          id: "m2-w5-d1-p2",
          duration: "2 นาที",
          title: "Octave Jump (สาย 6 ไป 4)",
          instruction: "เล่น Root สาย 6 แล้วกระโดดหารูปทรง Octave บนสาย 4 ให้คุ้นมือก่อน"
        }
      ]
    },
    {
      dayLabel: "Day 3-5",
      focus: "ย้ายฐานทัพมาสาย 5",
      isOpen: false,
      exercises: [
        {
          id: "m2-w5-d3-p1",
          duration: "3 นาที",
          title: "สแกน Root สาย 5",
          instruction: "หาโน้ต C (เฟรต 3) และ D (เฟรต 5) สลับกันไปมาโดยไม่ต้องเริ่มนับจากเฟรต 0"
        },
        {
          id: "m2-w5-d3-p2",
          duration: "3 นาที",
          title: "Octave Jump (สาย 5 ไป 3)",
          instruction: "ซ้อมกระโดดหาคู่ Octave สาย 5 ไปสาย 3 ฟังความสมมูลของเสียง"
        }
      ]
    },
    {
      dayLabel: "Day 6-7",
      focus: "รวมร่าง & ทดสอบตัวเอง",
      isOpen: false,
      exercises: [
        {
          id: "m2-w5-d6-p1",
          duration: "5 นาที",
          title: "สุ่มหา 3 คอร์ดหลัก (C, G, D)",
          instruction: "สุ่มนึกชื่อคอร์ด C, G หรือ D แล้วเอานิ้วไปกดที่ Root บนสาย 5 หรือ 6 ให้เร็วที่สุด"
        },
        {
          id: "m2-w5-d6-p2",
          duration: "2 นาที",
          title: "ทำ Self-Check",
          instruction: "อ่านเงื่อนไขด้านล่าง ถ้าทำได้คล่องแล้ว เตรียมตัวขึ้นสัปดาห์ถัดไปได้เลย!"
        }
      ]
    }
  ],
  selfCheck: {
    criteria: [
      "หาจุด Root C, G, D บนสาย 5 และ 6 ได้ใน 5 วินาทีโดยไม่ต้องนับไล่จากเฟรต 0",
      "เล่นรูปทรง Octave ร่อนข้ามสายได้คล่องมือโดยนิ้วไม่เกร็ง"
    ],
    troubleshooting: [
      {
        problem: "ยังหลงทิศ ต้องก้มลงนับช่องทีละช่อง?",
        advice: "ให้สายตามองที่จุดฝังมาร์กเกอร์ (Fret dots) สีขาวบนขอบคอกีตาร์จริงของคุณ ตัวนั้นคือเข็มทิศชั้นดี"
      }
    ]
  }
};

window.WEEK5_MOCK_DATA = WEEK5_MOCK_DATA;
