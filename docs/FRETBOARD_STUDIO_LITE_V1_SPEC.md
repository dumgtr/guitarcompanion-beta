# Fretboard Studio Lite V1 Spec

## 1. Overview
Fretboard Studio Lite is a beginner-safe interactive fretboard visualization tool for Guitar Companion. Its primary goal is to help learners map intervals, triads, and basic scales across the neck without the overwhelming visual noise of traditional fretboard encyclopedias.

This phase strictly defines V1. It will be built as an isolated prototype/experiment first, with no immediate integration into the production `outputs/app.js` or `outputs/data.json`.

## 2. Scope & Features

### Core Capabilities (V1)
- **Root Notes**: Visualize the root note of any selected key across the fretboard.
- **Intervals**: Toggle display of intervallic relationships relative to the root.
- **Triads (1-3-5)**: Highlight Major and Minor triad shapes.
- **7th Guide Tones**: Highlight essential 3rd and 7th guide tones.
- **Pentatonic Overlay**: Toggle Minor and Major pentatonic scale boxes.

### Controls & Navigation
- **Key Selector**: Dropdown or button group to select the musical key (e.g., C, G, A).
- **Position Selector**: Ability to isolate specific CAGED positions or fret ranges (e.g., Frets 1-5, Frets 5-9) to prevent cognitive overload.

### Layout & Orientation
- **Fretboard Orientation**: String 1 (High E) must be visually at the top, and String 6 (Low E) must be at the bottom, matching standard TAB notation.
- **Responsive Design**: Must be completely mobile-safe. Horizontal scrolling or smart zooming must be employed for narrow viewports (320px - 430px) without breaking the layout.

## 3. Constraints & Exclusions
- **No Audio**: V1 will be purely visual. No Tone.js or audio engine integration.
- **No Production Integration**: This will live outside `outputs/` initially (e.g., in `experiments/` or a dedicated test HTML file) until stabilized.
- **No Month 7/8 Exposure**: Fretboard Studio Lite must not leak or assume data structures from future hidden curriculum.
- **No External Dependencies**: Must be built using Vanilla HTML, CSS, and JS only (no React, Vue, D3.js, etc.).

## 4. Implementation Guidelines
- **DOM Structure**: Render the fretboard dynamically using JS, avoiding massive hardcoded HTML tables.
- **Styling**: Adhere strictly to the existing Guitar Companion design tokens (colors, typography). Use CSS Grid or Flexbox for string/fret alignment.
- **State Management**: Keep a simple state object (e.g., `currentKey`, `currentPosition`, `activeLayers`) and re-render or toggle CSS classes on note nodes.

## 5. Next Steps (Post-Spec)
1. Set up a standalone HTML sandbox (`experiments/fretboard-studio-lite/`).
2. Draft the CSS grid for the fretboard.
3. Build the core JS rendering engine to place notes accurately on strings and frets.
4. Implement the UI control panel for toggling layers.
