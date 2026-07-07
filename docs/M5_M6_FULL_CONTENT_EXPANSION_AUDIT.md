# M5/M6 Full Content Expansion Audit

## 1. Purpose
Month 5 and Month 6 currently exist as hidden preview drafts. While they are structurally complete and the audio QA is stable, they need fuller teacher-style content before any future public reveal. This document serves as the blueprint and audit framework for completing this content expansion.

## 2. Guardrails
- **Content Expansion Only:** Focus solely on expanding the educational content.
- **Use Existing Renderer:** No changes to the application logic.
- **No New Systems/Features:** Do not build new UI components or practice tools.
- **No Public Release:** Month 5/6 must remain hidden.
- **No Month 7/8:** Do not start or mock data for Month 7 or 8.
- **Keep M5/M6 Hidden:** Ensure they remain locked behind preview parameters (`?preview=m5`, `?preview=m6`).
- **Use Existing Block Types Only:** Rely strictly on existing renderer blocks.

## 3. Existing Renderer Mapping / 9 Pillars
The content expansion will map directly to our existing schema and renderer block types:

1. **Teacher-style explanation:** `lessonBlocks` (type: `text`)
2. **Context & Feeling:** `chord-sound-lab` + `listenFor` + `text`
3. **7-day practice:** `dailyPractice` (Day 1-7)
4. **Troubleshooting:** `teacherNote` / `mechanics-check` / `text`
5. **Measurable self-check:** `selfCheck` + `passCriteria`/`checklist`
6. **Mini Application / Phrase Builder:** `tab` + `technique-drill` + `fretboard-visualizer`
7. **Quiz / Ear-check:** `selfCheck` questions / `mechanics-check`
8. **Bridge / Continuity:** `text` recap blocks
9. **Output / Recording task:** `text` task instruction + `selfCheck` reflection

## 4. Month 5 Audit: Diatonic Bridge & Melodic Freedom

### Week 17
**Goal:** Connect Month 4 scale/fretboard knowledge into diatonic triads and chord families.

**Audit:**
- **Teacher-style explanation:** needs expansion
- **Context & Feeling:** add chord-sound-lab for C / F / G / Am family roles
- **7-day practice:** missing; add Day 1-7 practice plan
- **Troubleshooting:** add chord-change and muted-note guidance
- **Measurable self-check:** add C-F-G-Am at 60/70/80 BPM checkpoints
- **Phrase Builder:** add triad/fretboard visual application
- **Quiz / Ear-check:** add simple diatonic-family questions
- **Bridge:** add recap from Month 4 Scale Atlas into Month 5 Diatonic Family
- **Output Task:** record 4 bars of C-F-G-Am and reflect on timing and chord feeling

### Week 18
**Goal:** Core Progression & Call/Response (I-IV-V-vi).

**Audit:**
- **Teacher-style explanation:** Partial (has basic text about 4 magic chords and Call/Response concept)
- **Context & Feeling:** Present (m5-w18-sound-prog-pop)
- **7-day practice:** Partial (has 3 items, needs 7-day expansion)
- **Troubleshooting:** Missing
- **Measurable self-check:** Present (3 items)
- **Phrase Builder:** Present (m5-w18-tab-call-response, m5-w18-drill-call-response)
- **Quiz / Ear-check:** Missing
- **Bridge:** Missing
- **Output Task:** Missing
**Recommended Expansion Direction:** Expand explanation of I-IV-V-vi emotional arc, add full 7-day practice schedule, add ear-check for identifying the V chord tension.

### Week 19
**Goal:** The 90s Secret (Common Tones / Pedal Chords).

**Audit:**
- **Teacher-style explanation:** Partial (explains common tones, Oasis/Goo Goo Dolls context)
- **Context & Feeling:** Missing (needs chord-sound-lab for Pedal Chords)
- **7-day practice:** Partial (has 3 items, needs 7-day expansion)
- **Troubleshooting:** Missing
- **Measurable self-check:** Present (3 items)
- **Phrase Builder:** Present (m5-w19-vis-common-tones, m5-w19-tab-pedal-chords)
- **Quiz / Ear-check:** Missing
- **Bridge:** Missing
- **Output Task:** Missing
**Recommended Expansion Direction:** Add chord-sound-lab for Pedal Chords to demonstrate the floating effect. Add troubleshooting for holding pedal notes cleanly while changing bass notes.

### Week 20
**Goal:** 8-Bar Solo Builder (Capstone).

**Audit:**
- **Teacher-style explanation:** Partial (explains 8-bar story arc)
- **Context & Feeling:** Missing (needs chord-sound-lab or backing track reference block)
- **7-day practice:** Partial (has 3 items, needs 7-day expansion)
- **Troubleshooting:** Missing
- **Measurable self-check:** Present (3 items)
- **Phrase Builder:** Present (m5-w20-vis-solo-map, m5-w20-tab-8bar-solo, m5-w20-drill-solo-builder)
- **Quiz / Ear-check:** Missing
- **Bridge:** Missing (needs bridge linking motif development to modal colors in Month 6)
**Output Task:** Missing
**Recommended Expansion Direction:** Add Capstone Output Task where the user records their own 8-bar solo. Add a bridge section introducing the concept of "colors" for Month 6.

## 5. Month 6 Audit: Modes as Chord Colors

### Week 21
**Goal:** What Modes Really Mean (Pitch Axis Drone).

**Audit:**
- **Teacher-style explanation:** Partial (pitch axis concept)
- **Context & Feeling:** Present (m6-w21-drone-color-lab)
- **7-day practice:** Partial (has 3 items, needs 7-day expansion)
- **Troubleshooting:** Missing
- **Measurable self-check:** Present
- **Phrase Builder:** Present (m6-w21-tab-pitch-axis)
- **Quiz / Ear-check:** Missing
- **Bridge:** Missing
- **Output Task:** Missing
**Recommended Expansion Direction:** Expand pitch axis explanation, add ear-training quiz to identify Major vs Mixolydian vs Dorian over the drone.

### Week 22
**Goal:** Dorian vs Mixolydian (The Bluesy Cousins).

**Audit:**
- **Teacher-style explanation:** Partial (explains b7 similarity, 3rd difference)
- **Context & Feeling:** Missing (needs chord-sound-lab comparing Dorian vs Mixo vamps)
- **7-day practice:** Partial (has 3 items, needs 7-day expansion)
- **Troubleshooting:** Missing
- **Measurable self-check:** Present
- **Phrase Builder:** Present (m6-w22-vis-dorian-mixo, tabs, drill)
- **Quiz / Ear-check:** Missing
- **Bridge:** Missing
- **Output Task:** Missing
**Recommended Expansion Direction:** Add chord-sound-lab comparing Am7-D9 (Dorian) vs A7-D7 (Mixolydian). Expand troubleshooting for accidentally hitting the wrong 3rd.

### Week 23
**Goal:** Lydian (The Floating Dream).

**Audit:**
- **Teacher-style explanation:** Partial (#4 concept)
- **Context & Feeling:** Present (m6-w23-sound-lydian-vamp)
- **7-day practice:** Partial (has 3 items, needs 7-day expansion)
- **Troubleshooting:** Missing
- **Measurable self-check:** Present
- **Phrase Builder:** Present (m6-w23-vis-lydian, m6-w23-tab-lydian)
- **Quiz / Ear-check:** Missing
- **Bridge:** Missing
- **Output Task:** Missing
**Recommended Expansion Direction:** Expand practice to 7 days, add a quiz identifying the #4 tension, and add an output task for composing a Lydian floating phrase.

### Week 24
**Goal:** Modal Vamp Integration (Capstone).

**Audit:**
- **Teacher-style explanation:** Partial
- **Context & Feeling:** Present (m6-w24-sound-vamp)
- **7-day practice:** Partial (has 3 items, needs 7-day expansion)
- **Troubleshooting:** Missing
- **Measurable self-check:** Present
- **Phrase Builder:** Present (m6-w24-tab-resolution-example)
- **Quiz / Ear-check:** Missing
- **Bridge:** Missing
- **Output Task:** Missing (needs Capstone task)
**Recommended Expansion Direction:** Add Month 6 Capstone output task (Record a Modal Vamp jam). Provide troubleshooting for overplaying color notes instead of resolving them.

## 6. Recommended Execution Plan
- **Phase A:** Complete audit for all W17-W24
- **Phase B:** Expand Month 5 hidden content first
- **Phase C:** Expand Month 6 hidden content second
- **Phase D:** Hidden browser QA
- **Phase E:** Decide future reveal separately

## 7. Non-goals
- No Month 7/8
- No UI redesign
- No audio engine migration for Month 1-4
- No new block types
- No public reveal
