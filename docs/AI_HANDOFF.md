# AI Handoff

## Current State
- Phase 1 (Shard Infrastructure) and Phase 2 (Content Drafting for M5/M6) are officially CLOSED.
- Main is stable at merge commit `7a5456c` following the v2.9.5 fretboard restore and hidden audio QA hotfix.
- Current mode: Post-hotfix monitoring / bugfix-only.
- M5/M6 shards are structurally complete, loaded in memory, and LIVE in production.
- Month 1-6 are visible in normal production.
- Do not describe Month 5/6 as hidden preview anymore.
- Production remains locked up to Month 6.
- Known UX debt: month switcher horizontal scroll feels step-like.
- Do not start Month 7/8 publicly yet.
- Week 0 Prelude / Foundation Reset is public.
- Rhythm Notation Starter and Blues Turnaround Starter are PUBLIC / LIVE as optional Mini Courses in the Practice Room.
- Mini Courses are not Months, not Weeks, and do not appear in topbar navigation, Month Switcher, or week tabs.
- Dev preview flags (`?miniCoursePreview=1`, `?devPreview=miniCourse`, or `?preview=miniCourse`) remain available only as legacy QA shortcuts / future hidden-course helpers.

## Reference Shelf / Rhythm Notation Freeze
The Reference Shelf / Rhythm Notation work is FINAL for the current phase.

- Release tag: `reference-rhythm-v1.0`
- Release date: 2026-07-03
- Checkpoint: recorded directly in `PROJECT_STATE.md` and this handoff file.

## PROTOTYPE FREEZE NOTICE
- **REFERENCE SHELF FREEZE:** The `.reference-panel` and its hidden contents (`#tabGuidebook`, `#noteValueGuidebook`) in `outputs/index.html` are FINALIZED. Do NOT polish, edit, or move the TAB Handbook or Note Value Cheatsheet unless explicitly fixing a reported bug. Do not move these references into the main lesson flow.

## Future Agent Guidance
- Do not keep polishing TAB Handbook or Note Value Cheatsheet unless a user reports a real bug.
- Completed: Week 1-2 micro-skill reference triggers are implemented and QA-passed.
- Completed: Sprint 7B Controlled Public Reveal launched Rhythm Notation Starter publicly in Practice Room.
- Completed: Sprint 7C Public Reveal QA / handoff cleanup recorded the live production state.
- Completed: Sprint 8D Blues Turnaround Starter public reveal passed 6/6 smoke tests and is live in Practice Room.
- Mini Course reset behavior is decided: separate reset, isolated storage, type-to-confirm if progress is over 50%.
- Main reset must include contextual copy and must not clear Mini Course progress by default.
- Sprint 6 bugfix: progress over 50% no longer uses browser `prompt()`; it uses an in-page type-to-confirm box requiring `RESET MINI COURSE`.
- Sprint 6.5 bugfix: the Mini Course reset type-to-confirm input has `aria-label="Mini Course reset confirmation phrase"`.
- Month 1-6 are visible in normal production; Month 3-6 are no longer preview-only.
- Preview parameters such as `?preview=m7`, `?preview=m8` are legacy QA shortcuts / auto-open helpers only, not production gating for live months.
- Do not create Month 0.
- Do not reveal or open Month 7-8.
- Do not move Reference content into the main lesson flow.
- Do not touch `docs/FRETBOARD_STUDIO_LITE_SPEC.md` unless the user explicitly starts a Fretboard Studio Lite task.

## v2.9.4 UI Polish Lock
- The Dashboard UI typography, Lesson Month Switcher, and Top Read-Only Progression Tracker are **stable and locked** as of v2.9.4 (2026-07-04, 6/6 Browser Smoke Test passed).
- Dashboard typography hierarchy: Current Week title > Today's Mission title > Journey Timeline title, all below the Hero title. Do not inflate these sizes.
- Month Switcher: mobile-safe capsule scroll, `position: relative`, no sticky/fixed behavior, no z-index conflicts with Metronome/topbar.
- Top Progression Tracker: purely decorative `<div>`, `aria-hidden="true"`, `pointer-events: none`. Do not convert back to interactive `<nav>` or add click handlers.
- Do NOT expose Month 7-8.
- Do NOT introduce arbitrary gamification.
- Do NOT re-add a bottom sticky/fixed Month Switcher bar.

## Do-Not-Touch List
- `outputs/index.html`
  - `#practice`
  - `.reference-panel`
  - `#tabGuidebook`
  - `#noteValueGuidebook`
  - `#referenceShelfContent`
  - `#noteValueShelfContent`
- `outputs/styles.css`
  - `.reference-panel`
  - `.reference-button-group`
  - `.note-value-visual`
  - `.rhythm-practice-layer`
  - `.count-map-card`
  - `.rhythm-tab-bridge`
- `outputs/app.js`
  - `bindFocusedEvents()`
  - `bindReferenceShelfToggle()`
  - `setReferenceShelfOpen()`
  - `setNoteValueShelfOpen()`
- `outputs/data.json`
  - Do not edit for Reference Shelf changes.

## Agent Takeover Checklist
1. Read the "Reference Shelf / Rhythm Notation Status" section in `PROJECT_STATE.md` and the "Reference Shelf / Rhythm Notation Freeze" section in `AI_HANDOFF.md`.
2. Verify release tag `reference-rhythm-v1.0`.
3. Confirm whether a PR or commit SHA exists. This repository currently has no commits, so metadata may still be pending.
4. Run the QA matrix before changing anything:
   - Chrome latest
   - Safari latest
   - Firefox latest
   - Desktop `1366x768` and `1920x1080`
   - Mobile `320px`, `390px`, `430px`
   - Keyboard focus and basic screen reader readout
5. If a change is needed, propose it as:
   - spec
   - mock data if content-shaped
   - small PR
   - screenshots
   - QA results
   - rollback plan

## Recommended Next Work
- Future agents must treat Month 1-6 as production-live content.
- Do not describe Month 5/6 as hidden preview anymore.
- Do not reopen Sound Lab unless user explicitly starts Sound Lab V2.
- Keep Sound Lab baseline unchanged (black LED display, single guide tone, no arpeggios, no stacked chords).
- The project is currently in a Post-Release Monitoring phase. DO NOT initiate new features (like Fretboard Studio) or new Mini Courses.
- Known UX debt: month switcher horizontal scroll feels step-like.
- Next recommended phase: Phase B0: Sound Lab V2 schema fixture / mock data outside `outputs/*`, no production data edit yet.
- Production `outputs/data.json` changes require a separate explicit approval.

## Practice Room IA V2 & Right-Hand Control Program Spec
- Practice Room IA V2 is implemented as preview-only behind ?practiceRoomIaPreview=1.
- Normal Practice Room behavior remains unchanged without the preview parameter.
- Right-Hand Control 8-Week Program is specified in \docs/RIGHT_HAND_CONTROL_8_WEEK_PROGRAM_SPEC.md\ but not implemented publicly.
- FSL remains in its current preview status.
- Sound Lab production engine remains unchanged.
- Month 7-8 remain hidden.
- Reference Shelf content remains frozen.
- Mini Course behavior remains unchanged.

## Month 5 & 6 Realignment (July 2026)
- Month 5 has been pivoted from "Improvisation Foundation" to **"Diatonic Bridge & Melodic Freedom"** (Diatonic Triads, I-IV-V-vi, common-tone chord colors, and melodic phrasing).
- Month 6 focuses on **"Modes as Chord Colors"** (understanding modes not just as shapes, but as sonic colors over specific chords).
- The legacy "Improvisation Foundation" outline is archived inside `docs/MONTH3_TO_MONTH6_BLUEPRINT.md` (collapsed `<details>` block).
- The canonical Month 5 production spec is: `docs/MONTH5_CONTENT_SPEC.md`.
- Month 5 and Month 6 are live in production. Month 7-8 remain hidden.

## Tone.js Sampler Spike (Phase 2 Closeout)
- Tone.js Sampler Phase 2 PASS
- A2 → A3 approved baseline
- UX copy cleaned
- Risk guardrail cleaned
- Tone.js remains spike-only
- Production Sound Lab untouched
- Next: Phase B0: Sound Lab V2 schema fixture / mock data outside `outputs/*`, no production data edit yet.
- Production `outputs/data.json` changes require a separate explicit approval.
- **Spec Created:** `docs/SOUND_LAB_V2_INTEGRATION_SPEC.md`
- **Phase B0 Fixture Created:** `experiments/sound-lab-v2-schema-fixture/` contains schema + mock data outside `outputs/*`; no production data edit yet.
- **Next:** Phase B1 renderer compatibility review against the fixture.

## Sound Lab V2 Phase C1.x Stabilization Complete
- Sound Lab C1.x stabilization is complete.
- Labels cleaned globally for robust rendering in narrow cards.
- LED layout stabilized. Fixed rows and min-width badges ensure no layout shift between idle/playing states, including hard-locked mobile layouts.
- Light mode LED theme complete.
- M5/M6 selfCheck rendering fixed.
- Sound Lab V2 preview badge added.
- V2 remains preview-only behind `?soundLabV2Preview=1`.
- Known issue: E2 -> E3 can still be quiet on small speakers.
- Normal production users remain on existing Sound Lab behavior.
- Next recommended feature: Fretboard Studio Lite V1 spec.
