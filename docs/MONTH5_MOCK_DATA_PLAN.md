# Month 5 Mock Data Plan: Diatonic Bridge & Melodic Freedom

**Status:** Planning / Docs-Only  
**Future Candidate Target:** `outputs/data.json` after explicit implementation approval only  
**Production Scope:** STRICTLY HIDDEN. `isVisible: false` may be used only as planning metadata if supported by future schema; do not rely on it alone for production gating.  

## 1. Status & Guardrails
- **Docs-Only:** This document is purely for planning purposes.
- **Hidden Scope:** Month 5 must remain completely hidden from the production UI.
- **No Mutation:** Do not modify `outputs/data.json` during this planning phase.
- **No Code Changes:** Do not modify `app.js`, `index.html`, `styles.css`, or any prototype files.

## 2. Data Collections to Reuse
Future Month 5 data MUST fit strictly into the existing Schema v3 root collections:
- `weeks[]`
- `techniqueDrills[]`
- `miniTabs[]`
- `fretboardVisuals[]`
- `chordSoundLabs[]`

Note: `phrase-lab` is a renderer/block type inside `weeks[]`, not a new root collection. Do not create `phraseLabs[]` or any new root key.

## 3. ID Naming Convention
To prevent collisions and maintain schema hygiene, all Month 5 assets must use the following standard prefixes:
- `m5-w17-[type]-[name]`
- `m5-w18-[type]-[name]`
- `m5-w19-[type]-[name]`
- `m5-w20-[type]-[name]`

## 4. Week-by-Week Mock Data Asset Plan

### Week 17: Meet the Family & Space
- **Week Object:** `id: "m5-w17-meet-family"`, `title: "Week 17: Meet the Family & Space"`, `isVisible: false`
- **`fretboardVisuals`:** Diatonic triads and 1-3-5 chord tones overlaying the major scale skeleton.
- **`techniqueDrills` / `phrase-lab`:** Drills emphasizing motif repetition and deliberate silence (space) between phrases.
- **Fallback Rule:** Provide a text-first fallback using standard `text` blocks if interactive renderer support is incomplete.

### Week 18: Core Progression & Call/Response
- **Week Object:** `id: "m5-w18-core-progression"`, `title: "Week 18: Core Progression & Call/Response"`, `isVisible: false`
- **`chordSoundLabs`:** I-IV-V-vi Web Audio chord loop (strict rule: no external backing track or `.mp3`/`.wav` files).
- **Visuals:** Target note visuals guiding the player where to land when the chord changes.
- **`phrase-lab`:** Conversational soloing drills (Call & Response) mapped to the chord loop.

### Week 19: The 90s Secret
- **Week Object:** `id: "m5-w19-90s-secret"`, `title: "Week 19: The 90s Secret"`, `isVisible: false`
- **`miniTabs`:** Chord shapes for G, Cadd9, Em7, Dsus4 demonstrating locked pinky/ring fingers.
- **Theory Block:** Text blocks explaining common-tone / pedal-tone theory. (Guardrail: Keep practical, avoid a full theoretical chord encyclopedia).
- **`techniqueDrills` / `phrase-lab`:** Target pitch bending and vibrato drills focusing on matching the underlying chord color.

### Week 20: 8-Bar Solo Builder
- **Week Object:** `id: "m5-w20-solo-builder"`, `title: "Week 20: 8-Bar Solo Builder"`, `isVisible: false`
- **`techniqueDrills`:** A structured 20-minute daily practice routine combining rhythm and lead elements.
- **Map:** An 8-bar solo map with target-note and chord-change guidance.
- **Focus:** Acts as the Month 5 capstone bridging Pentatonic and Diatonic harmony, NOT full improvisation mastery. Deeper solo building can be deferred to a future Solo Builder / later improvisation module, while Month 6 focuses on Modes as Chord Colors.

## 5. Renderer Compatibility Notes
- **Use Existing Blocks Only:** Rely entirely on supported types (e.g., `text`, `dailyPractice`, `selfCheck`, `tab`, `phrase-lab`, `technique-drill`, `fretboardVisuals`, `chordSoundLabs`).
- **Graceful Degradation:** If a renderer component is missing or incomplete, the JSON must provide a text-first fallback.
- **Audio Constraints:** Web Audio API synth ONLY. Zero external audio file dependencies.
- **No New Code:** Do not add or modify renderer logic in app code.

## 6. QA Notes for Future Implementation
- Verify strict JSON syntax validity before saving `data.json`.
- Ensure **zero** new root keys are added to `data.json`.
- Ensure Month 5 remains hidden through the current production gating logic. If future schema supports `isVisible: false`, apply it only as supplemental metadata.
- Verify mobile safety (tabs and fretboards must not overflow 320px viewports).
- Avoid performance-heavy interactive overload (limit concurrent UI blocks).

## 7. Explicit Non-Goals
- NOT an implementation task (no JSON data is created here).
- NOT a production launch.
- NOT an update to the Month Switcher.
- NOT app code work.
- NOT new renderer work.
- NOT `outputs/data.json` work.
