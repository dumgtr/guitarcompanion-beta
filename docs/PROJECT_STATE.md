# Project State

## Reference Shelf / Rhythm Notation Status
FINAL for current phase.

- Release tag: `reference-rhythm-v1.0`
- Release date: 2026-07-03
- Checkpoint: recorded directly in `PROJECT_STATE.md` and `AI_HANDOFF.md`.

## Current Visible Scope
- Week 0 Prelude / Foundation Reset is public.
- Month 1-4 are visible in normal production.
- Month 5-8 remain hidden.
- Preview parameters such as `?preview=m3`, `?preview=m4`, `?devPreview=m3`, and `?devPreview=m4` are legacy QA shortcuts / auto-open helpers only; they are not the current production visibility gate.
- **Month 5 and Month 6 content drafts are COMPLETE** but exist purely as **Hidden Draft Shards** (`outputs/data-shards/month5-preview.json`, `outputs/data-shards/month6-preview.json`).
- Month 5 and Month 6 MUST REMAIN HIDDEN from normal production. They can only be viewed via the QA parameter hooks implemented in `app.js` (e.g., `?preview=m5`, `?preview=m6`, `?devPreview=all`).
- Reference Shelf content lives in Practice Room, not in the main lesson flow.
- **Practice Room Additions:** The Reference Shelf (containing both the TAB Handbook and Note Value Cheatsheet) is LIVE and finalized (v1.0) inside the Practice Lab.
- **Mini Course Additions:** Rhythm Notation Starter and Blues Turnaround Starter are PUBLIC / LIVE in the Practice Room as optional support courses.

## Mini Course Shelf Status
- Mini Course Shelf is now **PUBLIC / LIVE** in normal production.
- Live courses: `Rhythm Notation Starter`, `Blues Turnaround Starter`.
- Sprint 8D: Blues Turnaround Starter publicly revealed on 2026-07-04. Both courses are `visibility: "public"` and `status: "live"`.
- Sprint 8D Complete. Blues Turnaround Starter is PUBLIC and LIVE.
- Root-level `miniCourses[]` data exists in `outputs/data.json` with `visibility: "public"` and `status: "live"` for both courses.
- Normal production load renders the Mini Course Shelf in the Practice Room below the Reference Shelf.
- Dev preview flags (`?miniCoursePreview=1`, `?devPreview=miniCourse`, or `?preview=miniCourse`) remain available as legacy QA shortcuts / future hidden-course helpers only; they are not required for the live Mini Courses.
- Mini Course reset/progress decision is locked.
- Mini Course progress is isolated and reset separately from main Month progress.
- Main reset must not clear Mini Course progress by default.
- Historical Sprint 6 hidden QA confirmed the dev-gated renderer before public reveal.
- Sprint 6 bugfix: reset flow for progress over 50% no longer uses browser `prompt()`; it uses an in-page type-to-confirm box requiring `RESET MINI COURSE`.
- Sprint 6.5 Pre-Reveal QA: **PASS WITH BUGFIX** before public launch.
- Sprint 6.5 bugfix: the reset type-to-confirm input has `aria-label="Mini Course reset confirmation phrase"`.
- Sprint 7C Public Reveal QA / logic check: **PASS**. Rhythm Notation Starter is public in Practice Room, Month 1 remains the default fresh-load month, Month 1-4 only remain visible in Month Switcher, no Month 0 is created, no keyboard trap is expected from the existing button/focus contract, and mobile overflow protections remain in place for 390px/430px layouts.
- Reference links inside Mini Course continue to open the existing TAB Handbook and Note Value Cheatsheet.
- Month 5-8 remain hidden.

### Current Phase: Phase 2 Hidden Drafts Complete
- Phase 1 (Shard Infrastructure) and Phase 2 (Content Drafting for M5/M6) are CLOSED.
- M5/M6 hidden preview shards are loaded in memory and are structurally complete.
- Runtime preview URLs available: `?preview=m5`, `?preview=m6`, `?devPreview=all`.
- Production remains strictly locked to Month 1–4.
- Known UX debt: month switcher horizontal scroll feels step-like.
- Do not start Month 7/8 or expose Month 5/6 publicly yet.
- Two Mini Courses are currently live in the Practice Room: `Rhythm Notation Starter` and `Blues Turnaround Starter`.
- The system is under observation after the Sprint 8D public reveal and 6/6 smoke-test pass.
- Do not initiate new features, new Practice Tools, or new Mini Courses during this monitoring period.

### v2.9.4 UI Polish (2026-07-04)
- **Status:** Implemented and QA-passed (6/6 Browser Smoke Test).
- Dashboard typography hierarchical rules are stable: Current Week title > Today's Mission title > Journey Timeline title, all clearly below the Hero title.
- Month Switcher uses a mobile-safe capsule scroll with `position: relative` (non-sticky, non-interfering).
- Top Progression Tracker is strictly read-only (`<div>` with `aria-hidden="true"`, `pointer-events: none`, stepper/timeline DOM).
- No horizontal overflow on 390px / 430px viewports.
- Topbar / Metronome is completely free from z-index / sticky interference.
### v2.9.5 Hotfix & Audio Polish (2026-07-06)
- **Status:** Main is stable at merge commit `7a5456c`. Current mode: Post-hotfix monitoring / bugfix-only.
- **Fretboard Restore:** Fretboard visuals successfully restored across all devices.
- **Hidden Audio QA:** Hidden Month 5/6 soft-piano audio QA passed. M5/M6 `chordSoundLabs` now utilize an opt-in soft-piano voice and strictly explicit octave voicings.
- Normal production remains Month 1-4 only. Month 5/6 remain strictly hidden (Preview URLs: `?preview=m5`, `?preview=m6`, `?devPreview=all`).
- `outputs/data.json` and `.gitignore` remained completely untouched. No release tag was created.
- The hotfix branch (`fix/fretboard-visual-restore`) was kept for now.

## Sprint 7A - Controlled Public Reveal Plan
- Sprint 7A Controlled Public Reveal Plan created: `docs/MINI_COURSE_PUBLIC_REVEAL_PLAN.md`.
- This was documentation only. No production code was changed during Sprint 7A.
- Sprint 7A is now historical planning and was superseded by the successful Sprint 7B public reveal.
- The reveal strategy was completed as a data-driven launch: `visibility` changed from `"hidden"` to `"public"` in data and the renderer filter now shows public courses on normal load.
- Month 5-8 remain hidden.
- Week 0 remains Week 0, not Month 0.
- Fretboard Studio Lite was not implemented.

## Sprint 7B - Controlled Public Reveal Implementation
- Sprint 7B approved, implemented, and publicly launched on 2026-07-04.
- `outputs/data.json`: Rhythm Notation Starter `visibility` changed from `"hidden"` to `"public"`, `status` changed from `"draft"` to `"live"`, and `implementationNote` was removed.
- `outputs/app.js`: targeted renderer updates were applied for data-driven public visibility, public shelf copy, public card label, and public CTA copy.
- `FEATURE_MINI_COURSE_SHELF` remains `false`; the reveal is data-driven, not flag-driven.
- Dev preview flags still work for future hidden Mini Courses.
- Month 5-8 remain hidden.
- Week 0 remains Week 0 with `month: null`; no Month 0 was created.
- Reference Shelf was not touched.
- Fretboard Studio Lite was not implemented.
- Existing Mini Course progress in localStorage is preserved.
- Sprint 7C handoff cleanup confirms the reveal is now the current production truth: Rhythm Notation Starter is live in Practice Room and no preview URL is required.

## Notes
- Do not continue polishing the Reference Shelf, TAB Handbook, or Note Value Cheatsheet unless the user reports a real bug.
- Future additions should be spec-first and should not expose new months or modules.
- Rollback: revert `visibility` to `"hidden"` in data.json and restore the previous `getMiniCourses()` filter. See `docs/MINI_COURSE_PUBLIC_REVEAL_PLAN.md` Section 8.
