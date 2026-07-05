# Month 3 Content Pack Plan

สถานะ: documentation only / content construction plan  
ห้ามแก้ `outputs/app.js`, `outputs/styles.css`, `outputs/index.html`, `outputs/data.json` และห้ามเปิด Month 3 ใน production UI จากเอกสารนี้

## 1. Month 3 Overview

**Title:** Month 3: Chord Tone & Arpeggio Foundation

**Core Promise:** ผู้เรียนเข้าใจว่าโน้ตอะไรอยู่ในคอร์ด ฟัง basic chord qualities ออก เล่น chord tones เป็น arpeggios ได้ และเริ่ม target chord tones เหนือ simple progressions ได้

**Pedagogy:** Month 3 ต้องรู้สึกเหมือนครูค่อย ๆ เปิดไฟให้เห็นโครงในคอร์ด ไม่ใช่โยนทฤษฎี harmony ทั้งก้อนใส่ผู้เรียน เป้าหมายคือให้ผู้เรียนได้ยินและเล่น 1-3-5, 7th chord colors, arpeggio motion และ voice leading แบบใช้งานจริง

## 2. Product Guardrails

* Documentation only
* Do not implement code
* Do not write full Thai lesson copy yet, except short sample snippets where helpful
* Do not add Month 3 data to `outputs/data.json`
* Do not expose Month 3 in the UI
* Do not edit Month 1 or Month 2 production behavior
* Do not touch frozen prototypes
* Do not create a technique encyclopedia
* Do not turn arpeggio into a speed technique course
* Do not teach full CAGED in Month 3
* Do not teach advanced jazz harmony, altered dominants, secondary dominants, or full chord-scale theory
* Keep the Thai teaching voice calm, practical, and teacher-like

## 3. Month 3 Week List

| Week | Title | Purpose |
| --- | --- | --- |
| Week 9 | Triad Foundations & The 1-3-5 | Teach that chords are built from 1-3-5, not just memorized finger shapes |
| Week 10 | Chord Quality + Arpeggio as Chord Tones in Motion | Hear major/minor/diminished quality, then introduce arpeggio as chord tones played one by one |
| Week 11 | 7th Chords & Blues Flavor | Show how adding the 7th creates deeper chord color and stronger pull |
| Week 12 | Voice Leading & Chord Tone Targeting | Follow chord changes with small movements and target notes |

---

## Week 9: Triad Foundations & The 1-3-5

### 1. Week Metadata

| Field | Value |
| --- | --- |
| stable week id | `m3-w9-triad-foundations-135` |
| absolute week number | `9` |
| month number | `3` |
| month week index | `1` |
| module label | `Chord Tone & Arpeggio Foundation` |
| dashboard title | `เดือน 3: Triad Foundations & The 1-3-5` |
| short summary | รู้ว่า chord tones คือ 1-3-5 และใช้ C, F, G เป็นจุดเริ่มต้น |
| estimated minutes per day | `20` |

### 2. Recommended LessonBlocks Order

```json
[
  { "type": "text", "id": "m3-w9-intro-chords-are-sounds" },
  { "type": "teacher-note", "id": "m3-w9-teacher-note-shapes-vs-sounds" },
  { "type": "interval-map", "mapRef": "m3-w9-major-minor-third-shift" },
  { "type": "chord-tone-overlay", "overlayRef": "m3-w9-cfg-triad-tones-overlay" },
  { "type": "fretboard", "visualRef": "m3-w9-c-triad-135-map" },
  { "type": "tab", "tabRef": "m3-w9-cfg-triad-tones-tab" },
  { "type": "mechanics-check", "checkRef": "m3-w9-clean-fretting-check" },
  { "type": "self-check", "id": "m3-w9-self-check" }
]
```

Short sample teacher snippet:

> วันนี้เราไม่ได้จำคอร์ดเพิ่มครับ เรากำลังเปิดดูว่าในคอร์ดที่จับอยู่มีเสียงอะไรซ่อนอยู่บ้าง

### 3. Required Root-Level Assets

| Asset Group | Proposed IDs |
| --- | --- |
| `fretboardVisuals` | `m3-w9-c-triad-135-map`, `m3-w9-f-triad-135-map`, `m3-w9-g-triad-135-map` |
| `miniTabs` | `m3-w9-cfg-triad-tones-tab`, `m3-w9-root-third-fifth-pulse-tab` |
| `chordSoundLabs` | `m3-w9-cfg-triad-preview-lab` |
| `microSkillAssets.intervalMaps` | `m3-w9-major-minor-third-shift`, `m3-w9-root-third-fifth-distance-map` |
| `microSkillAssets.chordToneOverlays` | `m3-w9-cfg-triad-tones-overlay` |
| `microSkillAssets.voiceLeadingMaps` | none |
| `microSkillAssets.mechanicsChecks` | `m3-w9-clean-fretting-check` |
| optional Web Audio profile | `m3-w9-triad-preview-audio-profile` |

### 4. Daily Practice Structure

#### Day 1-2

Focus: C triad tones 1-3-5

* `3 นาที` - หา Root C  
  Instruction: หา C บนสาย 5 แล้วพูดว่า "1" ก่อนเล่น  
  microSkillRef: `m3-w9-root-third-fifth-distance-map`
* `5 นาที` - เล่น C-E-G ช้า ๆ  
  Instruction: เล่นทีละเสียงพร้อมพูด 1-3-5
* `3 นาที` - ฟัง 3rd  
  Instruction: เล่น C แล้วตามด้วย E เพื่อฟังความสว่าง

#### Day 3-5

Focus: ย้าย 1-3-5 ไป F และ G

* `4 นาที` - F triad tones  
  Instruction: เล่น F-A-C ช้า ๆ โดยดู fretboard map
* `4 นาที` - G triad tones  
  Instruction: เล่น G-B-D ช้า ๆ แล้วพูดชื่อ degree
* `3 นาที` - C/F/G compare  
  Instruction: เล่น 1-3-5 ของแต่ละคอร์ดแบบไม่เร่ง

#### Day 6-7

Focus: ใช้ 1-3-5 เป็นเสียงเป้าหมาย

* `5 นาที` - Root to 3rd  
  Instruction: เล่น Root แล้วขยับหา 3rd ของ C, F, G
* `5 นาที` - Root to 5th  
  Instruction: เล่น Root แล้วหา 5th ให้เสียงนิ่ง
* `3 นาที` - self-check take  
  Instruction: อัดเสียงสั้น ๆ เล่น C/F/G chord tones

### 5. Self-Check Structure

Practical checks:

* เล่น C-E-G, F-A-C, G-B-D ได้ช้า ๆ โดยไม่ต้องจับคอร์ดเต็ม
* ชี้หรืออธิบายได้ว่าโน้ตไหนคือ Root, 3rd, 5th

Ear/listening check:

* ฟังออกว่า 3rd ทำให้คอร์ดมีสี major/minor มากกว่า Root หรือ 5th

Reflection prompt:

* วันนี้มีคอร์ดไหนที่คุณเริ่ม "เห็นเสียงข้างใน" ชัดขึ้นที่สุด?

Pass criteria:

* เล่น triad tones ของ C, F, G ได้ที่ 60 BPM โดยไม่หลุด Pulse
* พูด 1-3-5 ตรงกับโน้ตที่เล่น

Troubleshooting notes:

* ถ้าจำโน้ตไม่ได้ ให้กลับไปหา Root ก่อน ไม่ต้องเดา 3rd จากความจำล้วน
* ถ้าเสียงบอด ให้ลดแรงกดและเช็กนิ้วใกล้ fret

### 6. Renderer Dependency Analysis

* Existing Month 2 renderers reusable: `fretboard`, `tab`, `chord-lab`
* Future renderers needed: `interval-map`, `chord-tone-overlay`, `mechanics-check`, `teacher-note` if not treated as text block
* Text fallback first: `interval-map`, `chord-tone-overlay`, `mechanics-check`
* Web Audio later: `m3-w9-cfg-triad-preview-lab`

### 7. Minimum Viable Launch Content

Must-have blocks:

* text intro
* one chord-tone-overlay for C
* one fretboard visual for C triad
* one mini TAB for C/F/G triad tones
* self-check

Must-have assets:

* `m3-w9-c-triad-135-map`
* `m3-w9-cfg-triad-tones-tab`
* `m3-w9-cfg-triad-tones-overlay`

Safe fallback blocks:

* teacher-note as text
* interval-map as bullet list
* mechanics-check as simple checklist

Optional enhancements to defer:

* Web Audio triad preview
* F and G separate detailed maps
* animated interval movement

### 8. Guardrails

* Do not teach full CAGED
* Do not teach all inversions
* Do not introduce 7th chords yet
* Do not turn this into a theory worksheet
* Keep C, F, G as the main practice set

---

## Week 10: Chord Quality + Arpeggio as Chord Tones in Motion

### 1. Week Metadata

| Field | Value |
| --- | --- |
| stable week id | `m3-w10-chord-quality-arpeggio-motion` |
| absolute week number | `10` |
| month number | `3` |
| month week index | `2` |
| module label | `Chord Tone & Arpeggio Foundation` |
| dashboard title | `เดือน 3: Chord Quality + Arpeggio as Chord Tones in Motion` |
| short summary | ฟัง major/minor/diminished และเริ่มเล่น chord tones ทีละตัวแบบ arpeggio |
| estimated minutes per day | `20` |

### 2. Recommended LessonBlocks Order

```json
[
  { "type": "text", "id": "m3-w10-intro-quality-by-ear" },
  { "type": "ear-training-lab", "labRef": "m3-w10-chord-quality-ear-lab" },
  { "type": "teacher-note", "id": "m3-w10-teacher-note-arpeggio-not-speed" },
  { "type": "chord-tone-overlay", "overlayRef": "m3-w10-major-minor-dim-overlay" },
  { "type": "fretboard", "visualRef": "m3-w10-c-arpeggio-chord-tones-motion" },
  { "type": "technique-drill", "id": "m3-w10-slow-alternate-picking-separation" },
  { "type": "tab", "tabRef": "m3-w10-c-am-bdim-arpeggio-tab" },
  { "type": "self-check", "id": "m3-w10-self-check" }
]
```

Short sample teacher snippet:

> Arpeggio ในเดือนนี้ยังไม่ใช่เทคนิคโชว์เร็วครับ ให้คิดว่าเราแค่ดีดเสียงในคอร์ดออกมาทีละตัวให้หูได้ยินชัด ๆ

### 3. Required Root-Level Assets

| Asset Group | Proposed IDs |
| --- | --- |
| `fretboardVisuals` | `m3-w10-c-arpeggio-chord-tones-motion`, `m3-w10-am-arpeggio-chord-tones-motion`, `m3-w10-bdim-ear-preview-map` |
| `miniTabs` | `m3-w10-c-am-bdim-arpeggio-tab`, `m3-w10-clean-note-separation-tab` |
| `chordSoundLabs` | `m3-w10-chord-quality-ear-lab`, `m3-w10-arpeggio-vs-block-chord-lab` |
| `microSkillAssets.intervalMaps` | `m3-w10-major-minor-third-map`, `m3-w10-dim-flat-five-map` |
| `microSkillAssets.chordToneOverlays` | `m3-w10-major-minor-dim-overlay` |
| `microSkillAssets.voiceLeadingMaps` | none |
| `microSkillAssets.mechanicsChecks` | `m3-w10-clean-note-separation-check` |
| optional Web Audio profile | `m3-w10-quality-triad-audio-profile` |

### 4. Daily Practice Structure

#### Day 1-2

Focus: major/minor quality hearing

* `4 นาที` - ฟัง major/minor  
  Instruction: กดฟังหรือเล่น C และ Am สลับกัน แล้วพูดว่าสว่างหรือหม่น  
  microSkillRef: `m3-w10-chord-quality-ear-lab`
* `4 นาที` - major formula  
  Instruction: เล่น 1-3-5 ของ C ช้า ๆ
* `4 นาที` - minor formula  
  Instruction: เล่น 1-b3-5 ของ Am แล้วฟังสีที่เปลี่ยน

#### Day 3-5

Focus: diminished preview + arpeggio motion

* `4 นาที` - diminished ear preview  
  Instruction: ฟัง 1-b3-b5 แบบสั้น ๆ เพื่อรับความตึง ไม่ต้องจำทุก shape
* `5 นาที` - arpeggio motion  
  Instruction: เล่น C chord tones ทีละตัวด้วย alternate picking ช้า ๆ  
  microSkillRef: `m3-w10-slow-alternate-picking-separation`
* `3 นาที` - note separation  
  Instruction: ให้แต่ละโน้ตชัด ไม่ไหลรวมกัน

#### Day 6-7

Focus: apply quality + arpeggio

* `5 นาที` - C / Am / Bdim compare  
  Instruction: เล่นทีละคอร์ดแล้วพูด quality
* `5 นาที` - arpeggio vs block chord  
  Instruction: ตีคอร์ดหนึ่งครั้ง แล้วเล่น chord tones ทีละตัวเพื่อฟังว่าเป็นเสียงชุดเดียวกัน
* `3 นาที` - short reflection  
  Instruction: เขียนว่าคุณจำ major/minor/diminished ด้วยคำว่าอะไร

### 5. Self-Check Structure

Practical checks:

* เล่น C major arpeggio และ Am minor arpeggio ช้า ๆ ได้โดยโน้ตแยกกันชัด
* อธิบายได้ว่า arpeggio คือ chord tones in motion

Ear/listening check:

* แยก major/minor ได้อย่างน้อย 8 จาก 10 ครั้ง และรับรู้ diminished ว่าตึงกว่า

Reflection prompt:

* เสียง major/minor/diminished ให้ความรู้สึกต่างกันอย่างไรในคำของคุณ?

Pass criteria:

* เล่น 1-3-5 และ 1-b3-5 ได้ช้า ๆ โดยไม่เร่ง
* ฟังและตอบ chord quality พื้นฐานได้

Troubleshooting notes:

* ถ้า arpeggio เละ ให้ลด BPM และหยุดเสียงแต่ละโน้ตก่อนเล่นโน้ตถัดไป
* ถ้าฟัง quality ไม่ออก ให้เล่น major/minor แบบ block chord ก่อน แล้วค่อยเล่นทีละโน้ต

### 6. Renderer Dependency Analysis

* Existing Month 2 renderers reusable: `fretboard`, `tab`, `chord-lab`
* Future renderers needed: `ear-training-lab`, `chord-tone-overlay`, `technique-drill`, `mechanics-check`
* Text fallback first: technique-drill, mechanics-check, chord-tone-overlay
* Web Audio later: ear-training-lab quality prompts and arpeggio-vs-block preview

### 7. Minimum Viable Launch Content

Must-have blocks:

* text intro
* chord quality ear lab with text fallback
* one arpeggio fretboard visual
* one arpeggio mini TAB
* self-check

Must-have assets:

* `m3-w10-chord-quality-ear-lab`
* `m3-w10-c-arpeggio-chord-tones-motion`
* `m3-w10-c-am-bdim-arpeggio-tab`

Safe fallback blocks:

* ear lab as text-only “ฟัง/ตอบจากครูหรือกีตาร์จริง”
* technique-drill as checklist

Optional enhancements to defer:

* randomized ear prompts
* animated note-by-note arpeggio playback
* diminished fretboard expansion

### 8. Guardrails

* Do not teach full CAGED
* Do not make sweep/rake technique the main skill
* Do not treat arpeggio as speed technique
* Keep diminished as ear-training preview, not deep harmony
* Use slow alternate picking and clean note separation

---

## Week 11: 7th Chords & Blues Flavor

### 1. Week Metadata

| Field | Value |
| --- | --- |
| stable week id | `m3-w11-seventh-chords-blues-flavor` |
| absolute week number | `11` |
| month number | `3` |
| month week index | `3` |
| module label | `Chord Tone & Arpeggio Foundation` |
| dashboard title | `เดือน 3: 7th Chords & Blues Flavor` |
| short summary | เติม 7th เพื่อฟังสี Maj7, m7 และ Dom7 โดยเน้น Dom7 เป็นสะพานไป Blues/Rock/Funk |
| estimated minutes per day | `20` |

### 2. Recommended LessonBlocks Order

```json
[
  { "type": "text", "id": "m3-w11-intro-seventh-color" },
  { "type": "teacher-note", "id": "m3-w11-teacher-note-dom7-bridge" },
  { "type": "chord-lab", "labRef": "m3-w11-dom7-blues-flavor-lab" },
  { "type": "chord-tone-overlay", "overlayRef": "m3-w11-seventh-chord-formulas-overlay" },
  { "type": "interval-map", "mapRef": "m3-w11-seventh-color-map" },
  { "type": "fretboard", "visualRef": "m3-w11-g7-chord-tone-map" },
  { "type": "tab", "tabRef": "m3-w11-dom7-arpeggio-flavor-tab" },
  { "type": "phrase-lab", "id": "m3-w11-dom7-resolution-phrase-lab" },
  { "type": "self-check", "id": "m3-w11-self-check" }
]
```

Short sample teacher snippet:

> Dom7 เป็นเสียงที่เหมือนยังไม่ยอมจบดีครับ มันมีแรงดึงกลับบ้าน และนี่คือกลิ่นสำคัญของ Blues/Rock/Funk ในอนาคต

### 3. Required Root-Level Assets

| Asset Group | Proposed IDs |
| --- | --- |
| `fretboardVisuals` | `m3-w11-cmaj7-chord-tone-map`, `m3-w11-am7-chord-tone-map`, `m3-w11-g7-chord-tone-map` |
| `miniTabs` | `m3-w11-maj7-m7-dom7-arpeggio-tab`, `m3-w11-dom7-resolution-lick-tab` |
| `chordSoundLabs` | `m3-w11-dom7-blues-flavor-lab`, `m3-w11-7th-quality-compare-lab` |
| `microSkillAssets.intervalMaps` | `m3-w11-major7-vs-flat7-map`, `m3-w11-dom7-pull-map` |
| `microSkillAssets.chordToneOverlays` | `m3-w11-seventh-chord-formulas-overlay` |
| `microSkillAssets.voiceLeadingMaps` | `m3-w11-g7-to-c-resolution-preview` |
| `microSkillAssets.mechanicsChecks` | `m3-w11-four-note-arpeggio-clean-check` |
| optional Web Audio profile | `m3-w11-seventh-chord-audio-profile` |

### 4. Daily Practice Structure

#### Day 1-2

Focus: Maj7 and m7 colors

* `4 นาที` - Maj7 formula  
  Instruction: เล่น 1-3-5-7 ของ C และฟังสีที่นุ่มขึ้น
* `4 นาที` - m7 formula  
  Instruction: เล่น 1-b3-5-b7 ของ Am และฟังความหม่นที่เปิดกว่า minor triad
* `3 นาที` - compare 7 vs b7  
  Instruction: ฟังว่า 7 กับ b7 ให้แรงดึงต่างกันอย่างไร  
  microSkillRef: `m3-w11-major7-vs-flat7-map`

#### Day 3-5

Focus: Dom7 as blues flavor

* `5 นาที` - G7 chord tones  
  Instruction: เล่น G-B-D-F ช้า ๆ แล้วพูด 1-3-5-b7
* `4 นาที` - Dom7 pull  
  Instruction: ฟัง G7 แล้วกลับ C เพื่อรับแรงดึงกลับบ้าน  
  microSkillRef: `m3-w11-dom7-blues-flavor-lab`
* `3 นาที` - mini phrase  
  Instruction: เล่น b7 แล้ว resolve เข้าหา 3rd หรือ Root

#### Day 6-7

Focus: 7th chord recognition and application

* `4 นาที` - ฟัง Maj7 / m7 / Dom7  
  Instruction: ฟังสลับและตอบ quality
* `5 นาที` - Dom7 arpeggio phrase  
  Instruction: เล่น G7 arpeggio เป็นวลีสั้น ไม่ไล่ยาว
* `3 นาที` - reflection  
  Instruction: เขียนว่า Dom7 ให้ความรู้สึกอยากไปไหน

### 5. Self-Check Structure

Practical checks:

* เล่น 1-3-5-7, 1-b3-5-b7 และ 1-3-5-b7 ได้ช้า ๆ
* เล่น G7 chord tones แล้ว resolve กลับ C ได้

Ear/listening check:

* ฟัง Dom7 แล้วรับรู้แรงดึงกลับบ้านได้

Reflection prompt:

* Dom7 ให้ความรู้สึกต่างจาก major triad อย่างไร?

Pass criteria:

* บอก formula ของ Maj7, m7, Dom7 ได้
* เล่น Dom7 arpeggio ช้า ๆ โดยไม่เปลี่ยนเป็น speed exercise

Troubleshooting notes:

* ถ้า 7th chord จำยาก ให้เริ่มจาก triad เดิมแล้วเติมโน้ตที่ 4 เท่านั้น
* ถ้าฟัง Dom7 ไม่ออก ให้ฟัง G7 -> C ซ้ำช้า ๆ ก่อน

### 6. Renderer Dependency Analysis

* Existing Month 2 renderers reusable: `fretboard`, `tab`, `chord-lab`
* Future renderers needed: `interval-map`, `chord-tone-overlay`, `phrase-lab`, optional `voice-leading-map`
* Text fallback first: formula overlay, phrase-lab, interval-map
* Web Audio later: 7th quality compare lab and Dom7 pull lab

### 7. Minimum Viable Launch Content

Must-have blocks:

* text intro
* chord-lab or text fallback comparing Maj7/m7/Dom7
* one G7 fretboard visual
* one Dom7 mini TAB
* self-check

Must-have assets:

* `m3-w11-dom7-blues-flavor-lab`
* `m3-w11-g7-chord-tone-map`
* `m3-w11-dom7-arpeggio-flavor-tab`

Safe fallback blocks:

* chord-lab as text-only comparison
* interval map as bullet formula
* phrase-lab as written prompt

Optional enhancements to defer:

* randomized 7th chord ear quiz
* animated Dom7 to C resolution
* Maj7/m7 expanded positions

### 8. Guardrails

* Do not teach advanced jazz harmony
* Do not teach altered dominants
* Do not teach secondary dominants
* Do not teach chord-scale theory
* Keep Dom7 as a practical bridge into Blues/Rock/Funk

---

## Week 12: Voice Leading & Chord Tone Targeting

### 1. Week Metadata

| Field | Value |
| --- | --- |
| stable week id | `m3-w12-voice-leading-chord-tone-targeting` |
| absolute week number | `12` |
| month number | `3` |
| month week index | `4` |
| module label | `Chord Tone & Arpeggio Foundation` |
| dashboard title | `เดือน 3: Voice Leading & Chord Tone Targeting` |
| short summary | ใช้ nearest chord tones, common tones และ target 3rd บน beat 1 เหนือ C-F-G-C |
| estimated minutes per day | `20` |

### 2. Recommended LessonBlocks Order

```json
[
  { "type": "text", "id": "m3-w12-intro-small-movements" },
  { "type": "voice-leading-map", "mapRef": "m3-w12-cfgc-voice-leading-map" },
  { "type": "teacher-note", "id": "m3-w12-teacher-note-follow-the-changes" },
  { "type": "chord-tone-overlay", "overlayRef": "m3-w12-cfgc-target-tones-overlay" },
  { "type": "fretboard", "visualRef": "m3-w12-target-3rd-on-beat-1" },
  { "type": "tab", "tabRef": "m3-w12-cfgc-target-3rd-line-tab" },
  { "type": "phrase-lab", "id": "m3-w12-four-bar-targeting-phrase-lab" },
  { "type": "ear-training-lab", "labRef": "m3-w12-resolution-hearing-lab" },
  { "type": "self-check", "id": "m3-w12-self-check" }
]
```

Short sample teacher snippet:

> ตอนเปลี่ยนคอร์ด เราไม่จำเป็นต้องกระโดดไกลครับ บางครั้งโน้ตที่ใกล้ที่สุดนี่แหละพาเพลงไปข้างหน้าได้ดีที่สุด

### 3. Required Root-Level Assets

| Asset Group | Proposed IDs |
| --- | --- |
| `fretboardVisuals` | `m3-w12-cfgc-target-3rd-map`, `m3-w12-common-tone-map`, `m3-w12-nearest-chord-tone-map` |
| `miniTabs` | `m3-w12-cfgc-target-3rd-line-tab`, `m3-w12-small-movement-voice-leading-tab` |
| `chordSoundLabs` | `m3-w12-cfgc-progression-preview-lab`, `m3-w12-resolution-hearing-lab` |
| `microSkillAssets.intervalMaps` | `m3-w12-nearest-tone-distance-map` |
| `microSkillAssets.chordToneOverlays` | `m3-w12-cfgc-target-tones-overlay` |
| `microSkillAssets.voiceLeadingMaps` | `m3-w12-cfgc-voice-leading-map`, `m3-w12-target-3rd-on-beat-1` |
| `microSkillAssets.mechanicsChecks` | `m3-w12-slow-position-shift-check` |
| optional Web Audio profile | `m3-w12-cfgc-progression-audio-profile` |

### 4. Daily Practice Structure

#### Day 1-2

Focus: nearest chord tones

* `4 นาที` - C to F nearest move  
  Instruction: หาโน้ตจาก C chord ที่ขยับใกล้ที่สุดไป F chord  
  microSkillRef: `m3-w12-cfgc-voice-leading-map`
* `4 นาที` - common tone check  
  Instruction: หาโน้ตที่ค้างร่วมได้ระหว่างคอร์ด
* `3 นาที` - slow shift  
  Instruction: เปลี่ยนตำแหน่งช้า ๆ โดยไม่กระชากมือ

#### Day 3-5

Focus: target 3rd on beat 1

* `5 นาที` - target 3rd of F  
  Instruction: เล่น C phrase แล้วลง A บน beat 1 ของ F  
  microSkillRef: `m3-w12-target-3rd-on-beat-1`
* `5 นาที` - target 3rd of G  
  Instruction: เล่น F phrase แล้วลง B บน beat 1 ของ G
* `3 นาที` - listen to arrival  
  Instruction: ฟังว่า beat 1 ชัดขึ้นเมื่อ target ถูก

#### Day 6-7

Focus: C-F-G-C mini phrase

* `5 นาที` - 4-bar target phrase  
  Instruction: เล่นวลี 4 ห้อง เหนือ C-F-G-C โดยตั้งใจเลือก target note
* `4 นาที` - record and listen  
  Instruction: อัดเสียงแล้วฟังว่าตามคอร์ดจริงไหม
* `3 นาที` - reflection  
  Instruction: เขียนว่าคอร์ดไหน target ยากที่สุด

### 5. Self-Check Structure

Practical checks:

* เล่น line สั้น ๆ เหนือ C-F-G-C โดย target 3rd บน beat 1 ได้
* หา common tone หรือ nearest chord tone ระหว่างคอร์ดได้อย่างน้อย 2 คู่

Ear/listening check:

* ฟังออกว่า note ที่ target ถูกทำให้คอร์ดใหม่ชัดขึ้น

Reflection prompt:

* เวลาเปลี่ยนคอร์ด คุณรู้สึกว่าการขยับน้อยลงช่วยให้ phrase ฟังเป็นเพลงขึ้นไหม?

Pass criteria:

* เล่น C-F-G-C target line ได้ช้า ๆ โดยไม่หลุด Pulse
* อธิบายได้ว่า target 3rd คืออะไรและทำไมใช้บน beat 1

Troubleshooting notes:

* ถ้าเปลี่ยนคอร์ดแล้วหลง ให้ลดเหลือสองคอร์ดก่อน เช่น C-F
* ถ้า target note ไม่ชัด ให้เล่น chord ก่อน แล้วเล่น target note ตามทันที

### 6. Renderer Dependency Analysis

* Existing Month 2 renderers reusable: `fretboard`, `tab`, `chord-lab`
* Future renderers needed: `voice-leading-map`, `chord-tone-overlay`, `phrase-lab`, `ear-training-lab`
* Text fallback first: voice-leading-map as movement list, phrase-lab as written prompt
* Web Audio later: C-F-G-C progression preview and resolution hearing lab

### 7. Minimum Viable Launch Content

Must-have blocks:

* text intro
* one voice-leading-map or text fallback
* one fretboard target 3rd map
* one mini TAB line over C-F-G-C
* self-check

Must-have assets:

* `m3-w12-cfgc-voice-leading-map`
* `m3-w12-target-3rd-on-beat-1`
* `m3-w12-cfgc-target-3rd-line-tab`

Safe fallback blocks:

* progression preview as text prompt
* voice-leading-map as list
* phrase-lab as written instruction

Optional enhancements to defer:

* interactive voice-leading arrows
* Web Audio progression playback
* multiple keys beyond C

### 8. Guardrails

* Do not teach advanced jazz voice leading
* Do not teach all inversions
* Do not add substitutions
* Do not expand beyond C-F-G-C / I-IV-V-I as the main progression
* Do not turn this into a full harmony course

---

## Month 3 Content-Pack Summary

Month 3 content pack turns Month 2 fretboard awareness into practical chord-tone musicianship:

1. Week 9 establishes 1-3-5 as chord DNA.
2. Week 10 trains the ear for chord quality and introduces arpeggio as chord tones in motion.
3. Week 11 adds 7th chord colors, especially Dom7 as a Blues/Rock/Funk bridge.
4. Week 12 uses chord tones to follow C-F-G-C with small movements and target notes.

## Week-by-Week Construction Order

1. Build Week 9 first because all later weeks depend on 1-3-5.
2. Build Week 10 after Week 9 so arpeggio is framed as chord tones, not speed technique.
3. Build Week 11 after Week 10 because 7th chords extend the triad/arpeggio idea.
4. Build Week 12 last because voice leading needs chord tones, arpeggio motion, and 7th color awareness.

## Required Asset Registry

### Fretboard Visuals

* `m3-w9-c-triad-135-map`
* `m3-w9-f-triad-135-map`
* `m3-w9-g-triad-135-map`
* `m3-w10-c-arpeggio-chord-tones-motion`
* `m3-w10-am-arpeggio-chord-tones-motion`
* `m3-w10-bdim-ear-preview-map`
* `m3-w11-cmaj7-chord-tone-map`
* `m3-w11-am7-chord-tone-map`
* `m3-w11-g7-chord-tone-map`
* `m3-w12-cfgc-target-3rd-map`
* `m3-w12-common-tone-map`
* `m3-w12-nearest-chord-tone-map`

### Mini Tabs

* `m3-w9-cfg-triad-tones-tab`
* `m3-w9-root-third-fifth-pulse-tab`
* `m3-w10-c-am-bdim-arpeggio-tab`
* `m3-w10-clean-note-separation-tab`
* `m3-w11-maj7-m7-dom7-arpeggio-tab`
* `m3-w11-dom7-resolution-lick-tab`
* `m3-w12-cfgc-target-3rd-line-tab`
* `m3-w12-small-movement-voice-leading-tab`

### Chord Sound Labs / Ear Labs

* `m3-w9-cfg-triad-preview-lab`
* `m3-w10-chord-quality-ear-lab`
* `m3-w10-arpeggio-vs-block-chord-lab`
* `m3-w11-dom7-blues-flavor-lab`
* `m3-w11-7th-quality-compare-lab`
* `m3-w12-cfgc-progression-preview-lab`
* `m3-w12-resolution-hearing-lab`

### Micro-Skill Assets

* `m3-w9-major-minor-third-shift`
* `m3-w9-root-third-fifth-distance-map`
* `m3-w9-cfg-triad-tones-overlay`
* `m3-w9-clean-fretting-check`
* `m3-w10-major-minor-third-map`
* `m3-w10-dim-flat-five-map`
* `m3-w10-major-minor-dim-overlay`
* `m3-w10-clean-note-separation-check`
* `m3-w11-major7-vs-flat7-map`
* `m3-w11-dom7-pull-map`
* `m3-w11-seventh-chord-formulas-overlay`
* `m3-w11-g7-to-c-resolution-preview`
* `m3-w11-four-note-arpeggio-clean-check`
* `m3-w12-nearest-tone-distance-map`
* `m3-w12-cfgc-target-tones-overlay`
* `m3-w12-cfgc-voice-leading-map`
* `m3-w12-target-3rd-on-beat-1`
* `m3-w12-slow-position-shift-check`

## Renderer Gap List

Existing Month 2 renderers likely reusable:

* `text`
* `fretboard`
* `tab`
* `chord-lab`

New or formalized renderers needed:

* `teacher-note`
* `interval-map`
* `chord-tone-overlay`
* `ear-training-lab`
* `technique-drill`
* `voice-leading-map`
* `phrase-lab`
* `mechanics-check`
* `self-check` as a formal Month 3 block contract if not already handled by section renderer

Can use text fallback first:

* `teacher-note`
* `interval-map`
* `chord-tone-overlay`
* `technique-drill`
* `voice-leading-map`
* `phrase-lab`
* `mechanics-check`

Need Web Audio later:

* `ear-training-lab`
* `chord-lab` enhancements for major/minor/diminished/7th chord quality
* progression preview for Week 12

## Recommended Implementation Order

1. Create Week 9 mock data plan and asset stubs in docs.
2. Prototype missing block renderers outside production, starting with `chord-tone-overlay` and `interval-map`.
3. Add text fallback renderer strategy for unknown Month 3 blocks.
4. Prototype `ear-training-lab` with Web Audio disabled-by-default fallback.
5. Build Week 10-12 mock data plans after Week 9 data shape is validated.
6. Only after QA, plan a hidden engine merge similar to Month 2, without exposing Month 3 in the UI.

## Open Decisions Before Creating Real Data

* Should Week 9 use only C/F/G or include Am as an optional bridge into Week 10?
* Should diminished in Week 10 be audio-only preview or include a small fretboard map?
* Should Week 11 use G7 as the main Dom7 anchor or include C7 for blues familiarity?
* Should Week 12 target only 3rds first or include Root/5th target options?
* Should Month 3 daily practice checkbox progress be session-only or persisted in localStorage later?
* Should ear labs randomize prompts or keep a fixed sequence for the first launch?
* Should Web Audio chord quality playback share the existing Week 8 Chord Sound Lab engine or be a new thinner lab profile?
