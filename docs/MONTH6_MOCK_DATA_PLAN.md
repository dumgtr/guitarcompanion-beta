# Month 6 Mock Data Plan: Modes as Chord Colors

**Status:** Planning / Docs-Only  
**Future Candidate Target:** `outputs/data.json` after explicit implementation approval only  
**Production Scope:** STRICTLY HIDDEN. `isVisible: false` may be used only as planning metadata if supported by future schema; do not rely on it alone for production gating.

## 1. Status & Guardrails

- **Docs-Only:** This document is purely for planning purposes.
- **Hidden Scope:** Month 6 must remain completely hidden from the production UI.
- **No Mutation:** Do not modify `outputs/data.json` during this planning phase.
- **No Code Changes:** Do not modify `app.js`, `index.html`, `styles.css`, or any prototype files.
- **No Launch Permission:** This plan does not authorize Month 6 visibility, Month Switcher changes, or production release.

## 2. Data Collections to Reuse

Future Month 6 data MUST fit strictly into the existing Schema v3 root collections:

- `weeks[]`
- `techniqueDrills[]`
- `miniTabs[]`
- `fretboardVisuals[]`
- `chordSoundLabs[]`

Note: Block types such as `drone-practice`, `mode-color-lab`, `ear-training-lab`, and `phrase-lab` are standard components that live inside the `lessonBlocks` array of a week or drill. Do not create new root keys for them.

## 3. ID Naming Convention

To prevent collisions, all Month 6 assets must use the following standard prefixes:

- `m6-w21-[type]-[name]`
- `m6-w22-[type]-[name]`
- `m6-w23-[type]-[name]`
- `m6-w24-[type]-[name]`
- `m6-bonus-[type]-[name]`

## 4. Week-by-Week Mock Data Asset Plan

### Week 21: What Modes Really Mean

- **Week Object:** `id: "m6-w21-modes-meaning"`, `title: "Week 21: What Modes Really Mean"`, planning metadata only: `isVisible: false`
- **`chordSoundLabs` / `drone-practice`:** A simple static drone, such as an A pedal, to let the user hear scales against a fixed root.
- **`fretboardVisuals`:** Visual overlays comparing the Major Scale skeleton vs. the modal color note.
- **Fallback Rule:** If `drone-practice` renderer is incomplete, use a standard `chordSoundLabs` block playing a single sustained chord.

### Week 22: Dorian & Mixolydian for Blues/Rock/Funk

- **Week Object:** `id: "m6-w22-dorian-mixo"`, `title: "Week 22: Dorian & Mixolydian"`, planning metadata only: `isVisible: false`
- **`chordSoundLabs`:** Web Audio vamps for a minor 7th chord for Dorian and a Dominant 7th chord for Mixolydian.
- **`fretboardVisuals`:** Highlight the natural 6th for Dorian and the flat 7th for Mixolydian over standard pentatonic boxes.
- **`phrase-lab` / `miniTabs`:** Short, practical phrases resolving these specific color notes to chord tones.

### Week 23: Lydian as Floating Major Color

- **Week Object:** `id: "m6-w23-lydian-teaser"`, `title: "Week 23: The Lydian Color"`, planning metadata only: `isVisible: false`
- **`chordSoundLabs`:** A dreamy `maj7` or `add9` Web Audio vamp, such as Fmaj7.
- **`fretboardVisuals`:** Highlight the sharp 4th (#4) against a major pentatonic skeleton.
- **`text` / Theory Block:** Explain the floating, unresolved nature of Lydian briefly. Do not turn this into a mode encyclopedia.

### Week 24: Mode Application Lab

- **Week Object:** `id: "m6-w24-mode-application"`, `title: "Week 24: Mode Application Lab"`, planning metadata only: `isVisible: false`
- **`techniqueDrills`:** A structured 20-minute daily practice routine focusing on color-note-to-chord-tone resolution.
- **`phrase-lab`:** An 8-bar capstone phrase requiring the player to mix Dorian/Mixolydian flavors over changing chords.
- **`selfCheck`:** End-of-month reflection on hearing colors vs. memorizing shapes.

### Bonus Reference: The Tension Lab

- **Status:** Optional reference-only ear preview. Not Month 6 core content.
- **Target:** Candidate `chordSoundLabs[]` assets only, such as `id: "m6-bonus-sound-tension"`.
- **Focus:** A/B comparison of standard chords vs. tension chords such as Augmented, 7b9, and 7#9 to train the ear on extreme tension and release.
- **Guardrail:** Do not expand into altered dominant theory, jazz harmony, or a full tension encyclopedia. Keep this as a future optional ear-training preview.

## 5. Renderer Compatibility Notes

- **Use Existing Blocks Only:** Rely entirely on supported types as defined in `RENDERER_BLOCK_TYPES.md`.
- **Graceful Degradation:** If a highly specific renderer such as `mode-color-lab` is not fully built, provide a text-first and `miniTabs` fallback.
- **Audio Constraints:** Web Audio API synth ONLY. Zero external audio file dependencies.
- **No New Code:** This plan does not authorize renderer implementation or app code changes.

## 6. QA Notes for Future Implementation

- Verify strict JSON syntax validity before eventually saving `outputs/data.json`.
- Ensure zero new root keys are added to `outputs/data.json`.
- Ensure Month 6 remains hidden through the current production gating logic.
- If future schema supports `isVisible: false`, apply it only as supplemental planning metadata.
- Verify mobile safety for complex visualizations with no horizontal overflow.
- Avoid performance-heavy interactive overload.

## 7. Explicit Non-Goals

- NOT an implementation task.
- NOT production mock data creation.
- NOT a production launch.
- NOT app code work.
- NOT Month Switcher work.
- NOT new renderer work.
- NOT new root schema work.
- NOT a full mode encyclopedia.
- NOT an altered dominant / jazz tension course.
