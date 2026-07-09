# Fretboard Studio Lite Sandbox

## Purpose
This directory contains an isolated, pure-frontend prototype for the Fretboard Studio Lite feature (Phase V1). It is a visual fretboard designed to safely introduce beginners to intervals, triads, and pentatonic scale shapes without overwhelming them.

## Interactive Features
- **Note Inspector**: Click or tap on any note to reveal its name, position, and role in Thai (e.g., Root = บ้าน).
- **Interval Focus Mode**: Filter the fretboard to isolate only Root, 3rd, 5th, or 7th intervals.
- **Major vs Minor Comparison**: A dynamic comparison panel shows the exact notes representing the b3 and 3 for the currently selected key.
- **Challenge Mode**: Simple game loop to practice finding specific intervals on the fretboard (e.g., "Find all Roots"), providing instant color-coded feedback.
- **Octave Family Highlighting**: Tapping a note gently highlights all other notes of the same name across the neck.

## How to Open Locally
Since there are no build tools or dependencies, simply open the `index.html` file in any modern web browser.
Alternatively, use any static file server:
```bash
npx serve .
# or
python -m http.server
```
And navigate to the provided local port.

## Guardrails
- **No external dependencies:** This sandbox runs purely on Vanilla HTML, CSS, and JS.
- **No audio:** There is no Tone.js or any audio engine tied to the notes. This is an exploratory visual prototype.
- **No localStorage:** Challenges do not persist progress to avoid polluting the browser state.
- **No production code touch:** This experiment strictly lives outside `outputs/` and does not leak or consume `outputs/data.json` or any hidden Month 7/8 materials.

## What is Intentionally Not Included
- Complex multi-scale or modal visualizations (limited to Pentatonics and core Diatonics).
- Arpeggios and stacked chord diagrams.
- Direct integration into the main Guitar Companion lesson view.
- Persistent user progression or local storage.

## Next Integration Idea
After stabilizing and gathering feedback on this interactive sandbox (F1), the next steps will be:
- **F2**: Renderer compatibility review to structure this logic cleanly for `outputs/app.js` (Completed).
- **F3**: Preview-only integration into the main app gated by a URL parameter (e.g., `?fretboardStudioPreview=1`).
