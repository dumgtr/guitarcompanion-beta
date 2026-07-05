# Release Checkpoint: Guitar Companion Month 1-4 Reveal
Status: Controlled Reveal Checkpoint

## 1. Current Visible Scope
- Month 1-4 are now visible in normal production mode.
- Month 1 remains the default experience on a clean fresh load.
- Month 2, Month 3, and Month 4 are available through the main-content Month Switcher.
- Month 5-8 remain hidden, even if placeholder data exists in `outputs/data.json`.

## 2. Legacy Preview Shortcut Status
- Preview URLs still work as legacy QA shortcuts / auto-open helpers:
  - `/outputs/index.html?preview=m3`
  - `/outputs/index.html?preview=m4`
  - `/outputs/index.html?devPreview=m3`
  - `/outputs/index.html?devPreview=m4`
  - `/outputs/index.html?devPreview=all`
- Preview parameters are no longer required for normal Month 3-4 access.
- Preview parameters are not the current production visibility gate.
- Month 5-8 remain hidden in normal production and must not be exposed by this checkpoint.

## 3. State Behavior
- Fresh load behavior: Month 1 opens by default on a clean origin.
- Existing saved Month 2, Month 3, or Month 4 selection may restore by design.
- Month 5+ must not restore or appear in production UI.
- Progress/completion state is not automatically mutated by revealing Month 3-4.

## 4. Audio Behavior
- Audio remains user-gesture gated.
- No audio should autoplay on page load.
- Month 3 chord labs and Month 4 sequential ear labs should start only after a user taps/clicks playback controls.

## 5. Known Technical Debt
- Renderer, CSS, and debug names still use `month2-*` naming in several places, but these are now shared lesson engines for Month 2-4.
- Human audio loudness/tone spot-check should be repeated on PC and mobile after future audio changes.

## 6. Next Recommended Phase
- Run a post-reveal device smoke test across desktop and mobile browsers.
- Then start Month 5 draft planning only.
- Do not expose Month 5 in production during the planning phase.
