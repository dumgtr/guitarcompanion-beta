# Release Checkpoint: Week 0 Public Reveal
Status: Passed Final QA / Public Prelude Enabled
Date: 2026-07-02

## 1. Current Production State
- Week 0 Prelude / Foundation Reset is now publicly visible on normal load.
- Month 1-4 are visible in normal production.
- Month 5-8 remain hidden even if placeholder data exists.
- Week 0 is not Month 0.
- Week 0 does not appear in the Month Switcher or week tabs.

## 2. Week 0 Implementation
- Week 0 data is stored in root-level `preludeWeek`.
- Week 0 is not inside `weeks[]`.
- Prelude lesson opens from the public Prelude card.
- While viewing Prelude, dashboard, Month Switcher, week tabs, practice section, and data status row are hidden.
- Back button returns to the normal dashboard.
- Prelude lesson blocks render through existing lesson block renderers.
- Checklist/reflection blocks use `mechanics-check`.

## 3. Final QA Result
- PASS after one small real-bug fix.
- Normal load shows Prelude card.
- Opening Week 0 works.
- Back button restores dashboard.
- Month Switcher shows Month 1-4 only.
- Month 5-8 remain hidden.
- No Month 0 created.
- No corrupted `????` text.
- No console errors.
- No horizontal overflow at 390px or 430px.
- Preview URLs still work and remain capped to Month 1-4.

## 4. Bug Fixed
- CSS display rules overrode the `hidden` attribute for some Prelude-view chrome elements.
- The hide helper was updated to also control display state.
- This fixed Month Switcher/data status row remaining visually present while viewing Prelude.

## 5. State Behavior
- Prelude mechanics-check persistence works after reload.
- Prelude uses isolated `gc_prelude_chk_` keys.
- Month 1-4 progress keys are not touched by Prelude mechanics checks.
- The main reset button now clears `gc_prelude_chk_` keys as part of reset behavior.

## 6. Known Polish, Not Blocker
- Reset-behavior polish completed.
- `resetFoundationProgress()` now clears Prelude checklist keys while preserving existing Month 1 reset behavior.

## 7. Backlog Preserved
- 12-bar blues / shuffle / turnarounds
- fingerpicking songs
- Harmony & Progressions / Circle of Fifths
- Full Scale Reference Module
- deeper play-by-ear workflow
- recording/self-review workflow
- Hotel California-style solo study
- fretboard note memorization via landmarks and octave shapes

## 8. Next Recommended Options
- Option A: start Month 5 draft planning.
- Option B: Week 0 visual/copy polish after real-device use.
- Option C: post-release monitoring.
