const WEEK8_MOCK_DATA = {
  weekMeta: {
    week: 8,
    month: 2,
    title: "ห้องทดลองฟังเสียงคอร์ด",
    englishTitle: "Play by Form Seed & Chord Sound Lab",
    module: "fretboard",
    theme: "Fretboard Foundation",
    estimatedMinutesPerDay: 20,
    subtitle: "Play by Form Seed",
    promise: "เข้าใจโครงสร้างเพลงว่าไม่ได้เป็นแค่คอร์ดสุ่ม แต่มี 'บ้าน', 'ทางออก', และ 'แรงดึงกลับ' ผ่าน Chord Sound Lab"
  },
  lessonBlocks: [
    {
      id: "w8-block-1-form-intro",
      type: "text",
      title: "เพลงมีบ้าน ไม่ได้มีแต่คอร์ดสุ่ม",
      body: "วันนี้เราจะเริ่มฟังเพลงแบบนักดนตรีครับ คอร์ด C ไม่ใช่แค่คอร์ดหนึ่งคอร์ด แต่เป็นบ้านของคีย์นี้ พอเราออกไป F จะรู้สึกเหมือนเปิดประตูออกจากบ้าน และพอไป G จะมีแรงดึงให้กลับมาจบที่ C อีกครั้ง",
      teacherNote: "ยังไม่ต้องจำศัพท์เยอะ ให้จำความรู้สึกก่อน: บ้าน เปิดออก ดึงกลับ กลับบ้าน"
    },
    {
      id: "w8-block-2-form-anchors",
      type: "fretboard",
      title: "C Major Form Anchors",
      visualRef: "w8-c-form-anchors",
      instruction: "มอง C, F, G เป็นหมุดหลักของฟอร์มเพลงนี้ก่อน อย่าเพิ่งรีบเล่นเร็ว"
    },
    {
      id: "w8-block-3-chord-sound-lab",
      type: "chord-sound-lab",
      labRef: "w8-chord-sound-lab-c",
      instruction: "กดฟังทีละคอร์ด แล้วพูดบทบาทออกเสียง: บ้าน / เปิดออก / ดึงกลับ / กลับบ้าน"
    },
    {
      id: "w8-block-4-root-map",
      type: "fretboard",
      title: "Root Map: C - F - G - C",
      visualRef: "w8-form-maj-min",
      instruction: "ใช้แผนที่นี้เช็กว่า C อยู่สาย 5, F และ G อยู่สาย 6 ได้โดยไม่ต้องกลับหัวภาพ"
    },
    {
      id: "w8-block-5-root-pulse-tab",
      type: "tab",
      title: "C-F-G-C Root Pulse",
      tabRef: "w8-tab-cfgc-root-pulse",
      instruction: "หลังจากฟังคอร์ดแล้ว ให้เล่นแค่ Root ของแต่ละคอร์ดกับ Metronome 60 BPM"
    },
    {
      id: "w8-block-6-why-v-pulls",
      type: "text",
      title: "ทำไม G ถึงอยากกลับไปหา C",
      body: "คอร์ด G หรือ V มีความรู้สึกเหมือนประโยคที่ยังพูดไม่จบ หูของเราจะอยากได้คำตอบ พอกลับมาที่ C หรือ I สมองจะรู้สึกว่าประโยคจบแล้ว นี่คือแรงดึงกลับบ้านแบบง่ายที่สุด",
      teacherNote: "ถ้าฟังครั้งแรกยังไม่รู้สึก ไม่เป็นไรครับ ให้เปิด Lab แล้วฟังซ้ำช้า ๆ ความรู้สึกนี้จะชัดขึ้นเมื่อได้ยินหลายรอบ"
    },
    {
      id: "w8-block-7-mini-application",
      type: "tab",
      title: "Mini Form Application",
      tabRef: "w8-tab-form-application",
      instruction: "เล่น Root Pulse แล้วพูดฟอร์มไปด้วย: Home / Away / Pull / Home"
    }
  ],
  fretboardVisuals: [
    {
      id: "w8-c-form-anchors",
      type: "fretboard",
      title: "C Major Form Anchors",
      caption: "ปักหมุด C, F, G เป็นจุดเริ่มต้นของการฟังฟอร์ม I-IV-V-I ในคีย์ C",
      orientationNote: "💡 แผนที่คอกีตาร์นี้ใช้มุมมองเดียวกับตาราง TAB: แถวบนสุดคือ สาย 1 (เสียงสูง) และแถวล่างสุดคือ สาย 6 (เสียงเบส)",
      stringLabels: [
        { row: 1, label: "e (สาย 1 แหลม)" },
        { row: 2, label: "B" },
        { row: 3, label: "G" },
        { row: 4, label: "D" },
        { row: 5, label: "A" },
        { row: 6, label: "E (สาย 6 เบส)" }
      ],
      config: {
        startFret: 1,
        endFret: 5,
        showNut: false
      },
      legend: [
        { type: "home", color: "orange", label: "I / บ้าน" },
        { type: "away", color: "gold", label: "IV / เปิดออก" },
        { type: "pull", color: "red", label: "V / ดึงกลับ" },
        { type: "return", color: "green", label: "I / กลับบ้าน" }
      ],
      dots: [
        { string: 5, fret: 3, label: "C/I", type: "home" },
        { string: 6, fret: 1, label: "F/IV", type: "away" },
        { string: 4, fret: 3, label: "F/IV", type: "away" },
        { string: 6, fret: 3, label: "G/V", type: "pull" },
        { string: 3, fret: 5, label: "C/I", type: "return" }
      ]
    },
    {
      id: "w8-form-maj-min",
      type: "fretboard",
      title: "Root Map: C - F - G - C",
      caption: "ใช้แผนที่นี้เช็กตำแหน่ง Root ก่อนเล่น Root Pulse บนกีตาร์จริง",
      orientationNote: "💡 แผนที่คอกีตาร์นี้ใช้มุมมองเดียวกับตาราง TAB: แถวบนสุดคือ สาย 1 (เสียงสูง) และแถวล่างสุดคือ สาย 6 (เสียงเบส)",
      stringLabels: [
        { row: 1, label: "e (สาย 1 แหลม)" },
        { row: 2, label: "B" },
        { row: 3, label: "G" },
        { row: 4, label: "D" },
        { row: 5, label: "A" },
        { row: 6, label: "E (สาย 6 เบส)" }
      ],
      config: {
        startFret: 1,
        endFret: 5,
        showNut: true
      },
      legend: [
        { type: "home", color: "orange", label: "C / I" },
        { type: "away", color: "gold", label: "F / IV" },
        { type: "pull", color: "red", label: "G / V" }
      ],
      dots: [
        { string: 5, fret: 3, label: "C", type: "home" },
        { string: 6, fret: 1, label: "F", type: "away" },
        { string: 4, fret: 3, label: "F", type: "away" },
        { string: 6, fret: 3, label: "G", type: "pull" }
      ]
    }
  ],
  chordSoundLabs: [
    {
      id: "w8-chord-sound-lab-c",
      type: "chord-sound-lab",
      title: "Chord Sound Lab: I-IV-V-I",
      key: "C",
      description: "ฟังการเดินทางของคอร์ด C-F-G-C แล้วจำความรู้สึก บ้าน / เปิดออก / ดึงกลับ / กลับบ้าน",
      uiCopy: {
        playSequence: "ฟังทั้งฟอร์ม",
        stop: "หยุดเสียง",
        fallback: "ถ้าเสียงไม่ทำงาน ให้อ่านบทบาทของคอร์ด แล้วเล่น Root Pulse บนกีตาร์จริงแทน"
      },
      audioEngine: {
        type: "web-audio-oscillator-triad",
        waveform: "square",
        durationMs: 850,
        gapMs: 160,
        attackMs: 12,
        releaseMs: 180,
        maxGain: 0.5,
        fallbackToTextOnly: true
      },
      chords: [
        {
          id: "w8-chord-i-c",
          degree: "I",
          chord: "C",
          role: "บ้าน",
          feeling: "นิ่ง / พัก / เริ่มและจบ",
          notes: ["C4", "E4", "G4"],
          frequencies: [261.63, 329.63, 392.0]
        },
        {
          id: "w8-chord-iv-f",
          degree: "IV",
          chord: "F",
          role: "เปิดออก",
          feeling: "เหมือนเปิดประตูออกจากบ้าน",
          notes: ["F4", "A4", "C5"],
          frequencies: [349.23, 440.0, 523.25]
        },
        {
          id: "w8-chord-v-g",
          degree: "V",
          chord: "G",
          role: "ดึงกลับ",
          feeling: "มีแรงอยากกลับบ้าน",
          notes: ["G4", "B4", "D5"],
          frequencies: [392.0, 493.88, 587.33]
        },
        {
          id: "w8-chord-i-c-return",
          degree: "I",
          chord: "C",
          role: "กลับบ้าน",
          feeling: "จบเคลียร์ เหมือนกลับถึงบ้าน",
          notes: ["C4", "E4", "G4"],
          frequencies: [261.63, 329.63, 392.0]
        }
      ],
      sequence: [
        "w8-chord-i-c",
        "w8-chord-iv-f",
        "w8-chord-v-g",
        "w8-chord-i-c-return"
      ],
      listenFor: [
        "I ให้ความรู้สึกเหมือนจุดพัก",
        "IV ทำให้รู้สึกว่าฟอร์มเริ่มเคลื่อนออกไป",
        "V มีแรงดึงเหมือนประโยคยังไม่จบ",
        "I สุดท้ายทำให้รู้สึกกลับถึงบ้าน"
      ]
    }
  ],
  miniTabs: [
    {
      id: "w8-tab-cfgc-root-pulse",
      type: "tab",
      title: "C-F-G-C Root Pulse",
      bpm: 60,
      orientationNote: "TAB มาตรฐาน: สาย 1 อยู่บรรทัดบน และสาย 6 อยู่บรรทัดล่าง",
      ascii: [
        "e|-----------------|-----------------|",
        "B|-----------------|-----------------|",
        "G|-----------------|-----------------|",
        "D|-----3-----------|-----------------|",
        "A|-3-----------3---|-----------------|",
        "E|---------3-------|-----------------|"
      ],
      lyrics: "  C   F   G   C     I   IV  V   I",
      note: "วิธีซ้อม: เปิด Metronome 60 BPM ดีด Root ทีละตัว แล้วพูดบทบาทออกเสียง บ้าน / เปิดออก / ดึงกลับ / กลับบ้าน"
    },
    {
      id: "w8-tab-form-application",
      type: "tab",
      title: "Mini Form Application: Home - Away - Pull - Home",
      bpm: 60,
      orientationNote: "TAB มาตรฐาน: สาย 1 อยู่บรรทัดบน และสาย 6 อยู่บรรทัดล่าง",
      ascii: [
        "e|-----------------|-----------------|",
        "B|-----------------|-----------------|",
        "G|-----------------|-----------------|",
        "D|-----3-----3-----|-----------------|",
        "A|-3-----------3---|-3---------------|",
        "E|---------3-------|-----------------|"
      ],
      lyrics: "  Home Away Pull Home  Home",
      note: "ให้เล่นช้าก่อน อย่ารีบทำให้เท่ เป้าคือฟังบทบาทของฟอร์มให้ชัดและพูดชื่ออารมณ์ได้ทันจังหวะ"
    }
  ],
  dailyPractice: [
    {
      dayLabel: "Day 1-2",
      focus: "ฟังอารมณ์ I-IV-V-I",
      isOpen: true,
      exercises: [
        {
          id: "m2-w8-d1-p1",
          duration: "4 นาที",
          title: "Chord Sound Lab: ฟังทั้งฟอร์ม",
          instruction: "กดฟัง C-F-G-C แล้วพูดตามทันที: บ้าน / เปิดออก / ดึงกลับ / กลับบ้าน"
        },
        {
          id: "m2-w8-d1-p2",
          duration: "3 นาที",
          title: "แยกฟังคอร์ดทีละตัว",
          instruction: "กดฟัง C, F, G แยกกัน แล้วถามตัวเองว่าเสียงไหนนิ่ง เสียงไหนเหมือนเปิดออก เสียงไหนเหมือนอยากกลับ"
        }
      ]
    },
    {
      dayLabel: "Day 3-4",
      focus: "เล่น Root Pulse C-F-G-C",
      isOpen: false,
      exercises: [
        {
          id: "m2-w8-d3-p1",
          duration: "5 นาที",
          title: "Root Pulse ที่ 60 BPM",
          instruction: "เปิด Metronome 60 BPM เล่น C-F-G-C ด้วย Root notes เท่านั้น ให้เสียงจมกับคลิก"
        },
        {
          id: "m2-w8-d3-p2",
          duration: "3 นาที",
          title: "พูดบทบาทพร้อมดีด",
          instruction: "ดีดหนึ่งโน้ต แล้วพูดทันทีว่า Home / Away / Pull / Home"
        }
      ]
    },
    {
      dayLabel: "Day 5",
      focus: "ฟังแล้วเดาบทบาท",
      isOpen: false,
      exercises: [
        {
          id: "m2-w8-d5-p1",
          duration: "5 นาที",
          title: "สุ่มฟังคอร์ดใน Lab",
          instruction: "ให้กดฟังคอร์ดแบบสุ่ม แล้วเดาว่าเป็นบ้าน เปิดออก หรือดึงกลับ ก่อนดูเฉลยบนการ์ด"
        },
        {
          id: "m2-w8-d5-p2",
          duration: "3 นาที",
          title: "ร้อง Root เบา ๆ",
          instruction: "หลังฟังคอร์ด ให้ฮัมเสียง Root ของคอร์ดนั้นเบา ๆ เพื่อผูกหูกับตำแหน่งบนคอ"
        }
      ]
    },
    {
      dayLabel: "Day 6-7",
      focus: "Mini Form Application",
      isOpen: false,
      exercises: [
        {
          id: "m2-w8-d6-p1",
          duration: "6 นาที",
          title: "เล่น Mini Form",
          instruction: "เล่น Mini-TAB Home-Away-Pull-Home ช้า ๆ แล้วรักษา Pulse ให้มั่นคง"
        },
        {
          id: "m2-w8-d6-p2",
          duration: "4 นาที",
          title: "Self-Check ก่อนจบ Month 2",
          instruction: "ลองอธิบายด้วยคำพูดของตัวเองว่า C, F, G มีบทบาทต่างกันอย่างไร ถ้าพูดได้ชัด แปลว่าเริ่มเห็นฟอร์มแล้วครับ"
        }
      ]
    }
  ],
  selfCheck: {
    type: "self-check",
    id: "w8-self-check",
    week: 8,
    title: "ฟังออกและเล่นฟอร์มได้หรือยัง",
    questions: [
      {
        id: "w8-q1",
        type: "multiple-choice",
        prompt: "ในคีย์ C คอร์ด I คือคอร์ดอะไร?",
        choices: ["C", "F", "G"],
        answer: "C",
        feedback: "ถูกต้องครับ C คือบ้านของคีย์นี้"
      },
      {
        id: "w8-q2",
        type: "multiple-choice",
        prompt: "คอร์ด V หรือ G ให้ความรู้สึกหลักแบบไหน?",
        choices: ["พักนิ่ง", "เปิดออก", "ดึงกลับบ้าน"],
        answer: "ดึงกลับบ้าน",
        feedback: "ใช่ครับ V คือแรงดึงที่ทำให้เราอยากกลับไปหา I"
      },
      {
        id: "w8-q3",
        type: "practical",
        prompt: "เล่น Root Pulse C-F-G-C ที่ 60 BPM ได้โดยไม่หลุด Pulse",
        instruction: "ถ้ายังหลุด ให้ลดเป็น 50 BPM แล้วพูด Home / Away / Pull / Home ไปพร้อมกัน"
      },
      {
        id: "w8-q4",
        type: "reflection",
        prompt: "อธิบายด้วยภาษาของตัวเองว่า Home, Away, Pull, Home ต่างกันอย่างไร",
        instruction: "ไม่ต้องใช้ศัพท์ทฤษฎี ขอแค่อธิบายความรู้สึกที่ได้ยินจริง"
      }
    ],
    passCriteria: [
      "ฟัง I-IV-V-I แล้วบอกบทบาท บ้าน / เปิดออก / ดึงกลับ / กลับบ้าน ได้",
      "เล่น Root Pulse C-F-G-C ที่ 60 BPM ได้ชัดและไม่รีบ",
      "พูดบทบาทของคอร์ดไปพร้อมกับการดีดได้",
      "เข้าใจว่า Chord Sound Lab เป็น Ear Preview ไม่ใช่ virtual guitar"
    ],
    troubleshooting: [
      {
        problem: "ฟังไม่ออกว่า G ดึงกลับยังไง",
        advice: "ให้ฟังลำดับ F ไป G แล้วหยุดค้างไว้ 2 วินาที จากนั้นค่อยกด C คุณจะเริ่มรู้สึกว่าประโยคมันจบตอนกลับ C"
      },
      {
        problem: "เล่น Root Pulse แล้วหลุดจังหวะ",
        advice: "อย่าเพิ่งมองว่าเป็นคอร์ด ให้มองเป็นโน้ตเดี่ยว 4 จุด เปิด Metronome แล้วดีดให้เสียงลงพร้อมคลิกก่อน"
      },
      {
        problem: "เสียง Chord Sound Lab ไม่ทำงานบนเครื่อง",
        advice: "ใช้ fallback text ได้เลย อ่านบทบาทของคอร์ด แล้วเล่น Root notes บนกีตาร์จริงแทน ฟังก์ชันเสียงเป็นแค่ตัวช่วย ไม่ใช่บทเรียนหลัก"
      }
    ],
    passSummary: "ถ้าคุณฟังออกว่า I คือบ้าน IV คือเปิดออก และ V คือดึงกลับ พร้อมเล่น C-F-G-C ได้ตรง Pulse คุณพร้อมจบ Month 2 แล้วครับ"
  }
};

window.WEEK8_MOCK_DATA = WEEK8_MOCK_DATA;
