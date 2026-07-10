# Practice Room IA Redesign Spec

Status: Documentation Only / Pre-Implementation IA Spec

This document defines the information architecture direction for the Practice Room before integrating Fretboard Studio Lite. It does not authorize production UI changes, data changes, Fretboard Studio implementation, or any public reveal.

## 1. Problem Statement

The current Practice Room has grown from a small support area into a mixed space containing reference materials, optional Mini Courses, and future interactive tools. As a result, it risks feeling like a storage room: useful items are present, but the hierarchy does not yet communicate what the learner should do first, what is interactive, and what is only for lookup.

The main IA problem:

- Reference materials, Mini Courses, and interactive tools are grouped too loosely.
- Future tools such as Fretboard Studio Lite need to feel like real product surfaces, not another card appended at the bottom.
- The learner should immediately understand the difference between "practice with this", "take this optional course", and "look this up".

The redesign should make the Practice Room feel like a real practice space:

- tools are in the studio area;
- optional guided learning is grouped separately;
- references stay available without dominating the practice flow.

## 2. New Structure

The Practice Room should be organized into three clear zones.

### Practice Studio

Purpose: interactive training tools and active practice surfaces.

This is where tools live when the learner is expected to do something: explore notes, drill timing, test sound, or interact with a practice surface.

Examples:

- Fretboard Studio Lite
- Sound Lab
- Metronome / Groove helper

### Guided Mini Courses

Purpose: optional short courses that help the learner fill a specific gap without becoming part of the main month roadmap.

This zone should keep Mini Courses clearly separate from both the main curriculum and lookup references.

Current examples:

- Rhythm Notation Starter
- Blues Turnaround Starter

### Reference Library

Purpose: lookup materials, cheatsheets, and stable references.

This zone should remain useful and easy to reach, but it should not be confused with interactive tools or guided courses.

Current examples:

- TAB Handbook
- Note Value Cheatsheet

## 3. Fretboard Studio Placement

Fretboard Studio Lite belongs in **Practice Studio**.

Placement rules:

- It should be the first featured tool inside Practice Studio.
- It should not be placed inside Guided Mini Courses.
- It should not be placed inside Reference Library.
- It should not be appended at the bottom of the Practice Room.
- It should not appear in the Month Switcher, week tabs, or topbar navigation.

Reasoning:

Fretboard Studio Lite is an interactive practice tool. Its purpose is active exploration of fretboard shapes and note geography, not passive lookup and not a day-by-day Mini Course. Placing it first inside Practice Studio gives it the product weight it needs while preserving the existing Mini Course and Reference Library mental models.

## 4. Preview Behavior

Fretboard Studio Lite remains hidden on normal production URLs.

Preview rules for F3:

- Normal Practice Room remains unchanged until a separate public decision.
- Fretboard Studio Lite appears only behind:

```text
?fretboardStudioPreview=1
```

- Preview mode must be session-only and must not persist as a real unlock.
- Removing the preview parameter must return the Practice Room to the normal public state.
- Preview mode must not expose Month 7 or Month 8.

## 5. Guardrails

General guardrails:

- Do not expose Month 7/8.
- Do not edit Reference Shelf content.
- Do not move TAB Handbook or Note Value Cheatsheet into the main lesson flow.
- Do not alter Mini Course progress/reset behavior.
- Do not alter existing Mini Course data.
- Do not add Fretboard Studio to the Month Switcher.
- Do not create Month 0 or any new Month-like structure.

Fretboard Studio Lite V1 guardrails:

- No audio.
- No Tone.js.
- No external dependencies.
- No network assets.
- No localStorage writes for Fretboard Studio challenge state.
- No gamification layer.
- No public reveal without explicit approval.

## 6. Proposed UI Hierarchy

Recommended future Practice Room IA:

```text
Practice Room
  - Practice Studio
    - Fretboard Studio Lite
    - Sound Lab
    - Metronome / Groove helper
  - Guided Mini Courses
    - Rhythm Notation Starter
    - Blues Turnaround Starter
  - Reference Library
    - TAB Handbook
    - Note Value Cheatsheet
```

### Zone Intent

Practice Studio:

- active tools;
- direct interaction;
- immediate practice feedback;
- first destination for future Tool Shelf work.

Guided Mini Courses:

- optional short courses;
- day-based learning;
- isolated progress/reset behavior;
- not part of the main Month roadmap.

Reference Library:

- lookup-first;
- no progress pressure;
- stable content;
- should remain visually calmer than Practice Studio.

## 7. F3 Recommendation

After this IA spec is accepted, the next step should be:

```text
F3: Integrate Fretboard Studio Lite into the new Practice Studio area as preview-only.
```

Recommended F3 scope:

- Add the Practice Studio section structure.
- Add Fretboard Studio Lite as the first featured Practice Studio tool.
- Gate Fretboard Studio Lite behind `?fretboardStudioPreview=1`.
- Keep Guided Mini Courses and Reference Library visible in their current production-safe states.
- Do not alter Reference Shelf content.
- Do not alter Mini Course progress/reset behavior.
- Do not expose Month 7/8.

F3 should be treated as a targeted preview integration, not a full Practice Room redesign rollout. Public reveal should remain a separate decision after preview QA.

## Acceptance Checklist

- [ ] Fretboard Studio Lite is placed under Practice Studio.
- [ ] Fretboard Studio Lite is not inside Mini Courses.
- [ ] Fretboard Studio Lite is not inside Reference Library.
- [ ] Normal Practice Room remains unchanged without preview.
- [ ] Preview appears only with `?fretboardStudioPreview=1`.
- [ ] Month 7/8 remain hidden.
- [ ] Reference Shelf content remains untouched.
- [ ] Mini Course progress/reset behavior remains untouched.
- [ ] No audio, Tone.js, or new dependencies are added for Fretboard Studio V1.
- [ ] No localStorage challenge-state writes are added for Fretboard Studio V1.
