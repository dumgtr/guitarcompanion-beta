# Release Checkpoint: Week 0 Prelude Hidden Smoke QA
Status: Superseded Historical QA / Week 0 Is Now Public
Date: 2026-07-02

## 1. Current Production State
- Month 1-4 are visible in normal production mode.
- Week 0 Prelude / Foundation Reset is now public on normal load.
- Month 5-8 remain hidden even if placeholder data exists.
- Preview parameters are legacy QA shortcuts / auto-open helpers only, not the current production visibility gate.

## 2. Week 0 Prelude Status
- Week 0 is stored in the root-level `preludeWeek` object.
- Week 0 is not inside `weeks[]`.
- Week 0 is not Month 0.
- Prelude checklist/reflection blocks are rendered as `mechanics-check`.
- Prelude checklist state does not persist to Month 1-4 progress.
- The Week 0 copy corruption issue was fixed.
- Smoke QA passed with no app/data file changes during the QA pass.

## 3. Historical URLs Tested
- `outputs/index.html`
- `outputs/index.html?preview=prelude`
- `outputs/index.html?devPreview=w0`
- `outputs/index.html?devPreview=m3`
- `outputs/index.html?devPreview=m4`
- `outputs/index.html?devPreview=all`
- Month 3-4 are now available in normal production, so `devPreview=m3` and `devPreview=m4` should be treated only as legacy QA shortcuts.

## 4. Guardrails
- Week 0 has already been publicly revealed; do not create Month 0 or move Week 0 into the Month Switcher.
- Do not add Week 0 to `weeks[]`.
- Do not create Month 0.
- Do not expose Month 5-8.
- Do not change Month 1-4 content without an explicit task.

## 5. Backlog Preserved
- 12-bar blues / shuffle / turnarounds
- fingerpicking songs
- Harmony & Progressions / Circle of Fifths
- Full Scale Reference Module
- deeper play-by-ear workflow
- recording/self-review workflow
- Hotel California-style solo study
- fretboard note memorization via landmarks and octave shapes

## 6. Next Recommended Options
- **Option A:** Begin Month 5 draft planning only, without exposing Month 5 in production.
- **Option B:** Week 0 visual/copy polish after real-device use.
- **Option C:** Post-release monitoring.

## 7. Remaining Risks
- Device coverage should be repeated if Week 0 receives visual polish.
- Future edits must preserve the separation between root-level `preludeWeek` and the production `weeks[]` curriculum.
