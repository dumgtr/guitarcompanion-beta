# Practice Room IA Redesign Spec

Status: Production Active / Product Owner Approved

This document defines the production information architecture for the Practice Room. The IA V2 layout and the read-only Right-Hand Control 16 Weeks shell are approved for normal production URLs. This approval does not authorize new progress persistence, recording, audio analysis, Original Study TAB, Sound Lab engine migration, curriculum expansion, or Month 7/8 exposure.

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

## 4. Production and Rollback Behavior

Production rules:

- Normal URLs render Practice Room IA V2.
- `?legacyPracticeRoom=1` restores the Legacy Practice Room as a temporary rollback and wins over every other Practice Room preview parameter.
- `?practiceRoomIaPreview=1` remains a compatibility alias for IA V2.
- Standalone `?fretboardStudioPreview=1` retains the Legacy Practice Room with the earlier Fretboard Studio preview shell.
- When `practiceRoomIaPreview` and `fretboardStudioPreview` are both present without the rollback flag, IA V2 wins.
- Removing all parameters returns to the production IA V2 layout.
- No mode may expose Month 7 or Month 8.

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

## 7. Production Activation Decision

The earlier F3 preview recommendation is complete and historical. Product Owner visual QA passed, and Practice Room IA V2 is approved as the normal production layout with these locked boundaries:

- Keep Fretboard Studio Lite as the existing preview-capability surface; do not expand its feature scope.
- Keep Guided Mini Courses and their existing progress/reset behavior unchanged.
- Keep Reference Library content unchanged.
- Keep Right-Hand Control — 16 Weeks read-only with Week 13 Day 4 locked.
- Keep Month 7/8 hidden.
- Use `?legacyPracticeRoom=1` for temporary operational rollback.

Progress persistence for the new IA, Original Study implementation, recording, audio analysis, and Sound Lab engine migration remain separate Product Owner decisions.

## Acceptance Checklist

- [ ] Fretboard Studio Lite is placed under Practice Studio.
- [ ] Fretboard Studio Lite is not inside Mini Courses.
- [ ] Fretboard Studio Lite is not inside Reference Library.
- [ ] Normal Practice Room renders IA V2.
- [ ] `?legacyPracticeRoom=1` restores the Legacy Practice Room and wins every flag combination.
- [ ] `?practiceRoomIaPreview=1` remains an IA V2 compatibility alias.
- [ ] Standalone `?fretboardStudioPreview=1` shows the Legacy FSL preview shell.
- [ ] Month 7/8 remain hidden.
- [ ] Reference Shelf content remains untouched.
- [ ] Mini Course progress/reset behavior remains untouched.
- [ ] No audio, Tone.js, or new dependencies are added for Fretboard Studio V1.
- [ ] No localStorage challenge-state writes are added for Fretboard Studio V1.
