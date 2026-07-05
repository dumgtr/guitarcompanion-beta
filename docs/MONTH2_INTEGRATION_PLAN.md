# Blueprint: Month 2 Engine Integration Plan (Hidden Architecture)

## 1. Objectives & Guardrails

- **Core Goal:** Core rendering engines developed during Month 2 prototypes (Fretboard Visualizer, Mini-TAB Standard Layout, Web Audio API Chord Sound Lab) will be merged into `outputs/app.js` and `outputs/styles.css`.
- **UI Visibility Guardrail:** The actual lesson data for Weeks 5-8 and the Month 2 button/navigation elements MUST remain completely hidden from the user-facing UI. The app will continue to load Month 1 (Weeks 1-4) by default.
- **No Breakdown Rule:** The merge must not cause regression issues or break any functional code of Month 1 (Rhythm Foundation).
- **Prototype Freeze Rule:** `prototypes/month2-week5/`, `prototypes/month2-week6/`, `prototypes/month2-week7/`, and `prototypes/month2-week8/` are frozen reference implementations. Do not edit them during integration unless the user explicitly asks.
- **Documented but Hidden Rule:** Month 2 may exist as renderer architecture and hidden data capability, but it must not become navigable or visible in the production UI until a future scope-change task explicitly allows it.

## 2. Code Architecture Strategy (`outputs/app.js`)

- **Engine Porting:**
  - Migrate `renderFretboardVisual(config, container)` ensuring it strictly respects **Month 2 Orientation Rule v2**: String 1 / High e on TOP, String 6 / Low E on BOTTOM, using semantic `dot.string` data parsing.
  - Migrate `renderMiniTab(tab, container)` with String 1 on top and explicit tuning text indicators.
  - Migrate `renderChordSoundLab(lab, container)` alongside its Vanilla JS Web Audio API `playChord()` engine, dynamic compressor node, and state tracker variables.
- **Conditional Extension:** Inside the main `renderLessonBlocks` loop of the production app, safely introduce alternative switch cases for `fretboard`, `tab`, `chord-sound-lab`, and `chord-lab` block types so that the engine is ready to parse them whenever Month 2 data drops.
- **No UI Hook Exposure:** Do not add Month 2 navigation tabs, route links, dashboard cards, or visible lesson selectors during the engine merge.
- **Safe Data Boundaries:** If future Month 2 JSON exists in `outputs/data.json`, the app must still ignore it for visible lesson rendering until the user explicitly asks to expose Month 2.
- **Audio Context Isolation:** Keep Chord Sound Lab audio state separate from the existing Metronome state so one feature does not stop, hijack, or mute the other.

## 3. Styles Integrity Strategy (`outputs/styles.css`)

- **Isolated Component CSS:** Append the proven style sheets from frozen prototypes cleanly to the end of the production CSS file.
- **Scoped Naming:** Prefer component-specific selectors such as `.fretboard-card`, `.mini-tab-card`, `.chord-lab-card`, `.fret-dot`, `.legend-swatch`, and `.chord-button`. Avoid changing global button/card rules unless required.
- **Dot Type Coloring:** Explicitly ensure classes like `.dot-root`, `.dot-chord-tone`, `.dot-scale`, `.dot-home`, `.dot-away`, `.dot-pull`, and `.dot-return` are integrated cleanly without overriding any existing global or Month 1 specific utilities.
- **Lab Clean Layout:** Ensure the Chord Sound Lab components use flexible flexbox/grid alignment that enforces zero portrait overflow at 320px.
- **Mini-TAB Containment:** Mini-TAB must scroll inside its own card and never create body-level horizontal overflow.
- **Theme Compatibility:** CSS must work with the current warm dark guitar-studio palette and must not degrade light-mode readability if the main app theme toggle is active.

## 4. Data & Visibility Strategy

- **Month 1 Remains Default:** Existing Month 1 Rhythm Foundation data remains the only visible learning path.
- **Month 2 Data May Be Present But Dormant:** Data can exist as future JSON or hidden stubs, but renderer calls must not expose it in dashboard, lessons, navigation, or practice panels.
- **No New Module Expansion:** Do not add user-facing Month 2 modules, tabs, month switchers, or cards during the engine integration phase.
- **Fallback Behavior:** If a Month 2 block type is accidentally encountered without complete data, render a small graceful missing-state card rather than throwing an error.

## 5. Integration Verification Steps (Post-Merge Check)

Once the actual merge is triggered in subsequent tasks, the following verification points must be completed:

1. Production app loads Month 1 with zero console errors.
2. Dashboard still shows only Month 1 / Weeks 1-4 information.
3. Lesson navigation still exposes only Week 1-4.
4. Practice Lab still works, including Metronome, Practice Notes, and Progress Tracking.
5. In-browser mock injection testing: manually calling the Fretboard renderer with a small test visual safely renders a grid into a temporary DOM container.
6. In-browser mock injection testing: manually calling the Mini-TAB renderer safely renders a scroll-contained TAB block.
7. In-browser mock injection testing: manually calling the Chord Sound Lab renderer creates buttons, status text, and text fallback without exposing Month 2 in normal UI.
8. No duplicate Metronome or audio context conflicts.
9. Existing Month 1 rhythm animations, quiz logic, checklist logic, and localStorage progress behavior remain unchanged.
10. Mobile 320px viewport has no body horizontal overflow.

## 6. Suggested Merge Order

1. Port pure helper utilities first: array normalization, ID lookup, missing-card fallback, safe element creation.
2. Port Fretboard Visualizer renderer and CSS.
3. Port Mini-TAB renderer and CSS.
4. Port Chord Sound Lab renderer, Web Audio helpers, and CSS.
5. Add hidden block-type routing in `renderLessonBlocks`.
6. Run Month 1 regression checks before testing any hidden Month 2 mock injection.

## 7. Non-Goals For The Merge

- Do not expose Week 5-8 in the main UI.
- Do not add Month 2 navigation.
- Do not merge prototype pages into production routes.
- Do not add frameworks, build tools, external audio files, packages, or network calls.
- Do not modify frozen prototype folders as part of production integration.
- Do not expand curriculum scope beyond the hidden renderer architecture.
