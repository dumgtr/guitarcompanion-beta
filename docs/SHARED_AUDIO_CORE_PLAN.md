# Shared Audio Core Architecture Plan

## 1. Architectural Goal

The goal of this architectural change is to extract tonal-audio generation and playback lifecycle logic from UI components into a dedicated module:

`outputs/audio-engine.js`

This shared engine will eventually serve:
- **Fretboard Studio Lite (FSL) note preview**
- **Sound Lab single guide-tone playback**

By extracting this logic, we strictly separate UI responsibilities from audio responsibilities. 

**Important:** This is NOT a big-bang rewrite. The migration will be conducted in small, reversible, and isolated phases to ensure the stability of the production environment.

## 2. Scope Boundary

### In Scope
- Tonal note playback logic
- `AudioContext` creation, management, and mobile-safe unlock
- Master tonal output and gain staging
- Playback profiles (different envelopes/tones for different consumers)
- Active voice lifecycle (tracking and cleaning up playing notes)
- Engine selection and registry
- Native fallback behavior
- Per-consumer channels (e.g., FSL channel, Sound Lab channel)

### Out of Scope (Initially)
- Metronome migration (remains entirely separate)
- Full chord playback or stacked notes
- Arpeggios and backing tracks
- Recording features
- Lesson-data changes
- Month 7/8 visibility changes
- Production `Tone.js` dependency in Phase A1
- Removal of old Sound Lab audio before the new migration QA fully passes

## 3. Core Architectural Principles

### Separate File
The engine must live exclusively in `outputs/audio-engine.js`. It may expose a controlled global namespace such as `window.AudioEngine`. Internal `AudioNode`s must never be exposed directly to UI code.

### Native First
The native Web Audio API is the required baseline. The engine must be built using:
- `AudioContext` / `webkitAudioContext`
- `GainNode`
- `OscillatorNode`
- `BiquadFilterNode`
- `DynamicsCompressorNode` (where appropriate)

The native engine must work flawlessly without Tone.js.

### Tone.js as an Optional Future Adapter
Tone.js must NOT be a hard dependency. Tone.js itself is not automatically a sample library. In the future, a Tone.js adapter may be introduced using `Tone.PluckSynth`, `Tone.Sampler`, or another explicitly approved Tone.js instrument. Any sample assets must have:
- Documented source and license
- Fallback behavior
- Mobile loading QA passing

Phase A1 must NOT load Tone.js.

### Playback Profiles
The engine must support different playback profiles while sharing the same core logic. Both consumers share the engine infrastructure but do not need identical envelopes, duration, filter, register, or gain.

Required profiles:
- `fsl-note-preview`
  - Fast attack
  - Short decay/release
  - Clear register
  - Optimized for repeated fret tapping
  - One note at a time
- `soundlab-guide-tone`
  - Longer sustain/release
  - More musical tone
  - Optimized for hearing harmonic color
  - One guide tone at a time

## 4. Audio Routing and Channel Separation

**Proposed Routing Model:**
```text
AudioContext
└── Tonal Master Bus
    ├── FSL Channel
    └── Sound Lab Channel
```

**Critical Constraint:** The existing Metronome must remain separate. It must NOT be stopped when a fret is tapped, a Sound Lab guide tone is played, or a tonal voice is replaced. The plan explicitly prevents a global stop operation from stopping Metronome playback.

**Channel-level Stopping:**
- `stopChannel("fsl")`
- `stopChannel("soundlab")`
- `stopAllTonal()`

*Note: `stopAllTonal()` must NEVER include the Metronome.*

## 5. Proposed Public API

Minimal proposed API exposed via `window.AudioEngine`:

```javascript
// Unlocks AudioContext on user gesture
window.AudioEngine.unlock()

// Returns boolean status
window.AudioEngine.isReady()

// Playback API
window.AudioEngine.playNote({
  channel: "fsl",
  profile: "fsl-note-preview",
  note: "A4",
  velocity: 0.7
})

window.AudioEngine.playNote({
  channel: "soundlab",
  profile: "soundlab-guide-tone",
  note: "C#4",
  velocity: 0.65
})

// Stopping API
window.AudioEngine.stopChannel("fsl")
window.AudioEngine.stopChannel("soundlab")
window.AudioEngine.stopAllTonal()

// Diagnostics
window.AudioEngine.getStatus()
```

**Failure Behavior:** The API must fail safely (e.g., returning early or logging a warning) and must not break the UI when audio is unavailable or unsupported.

## 6. Internal Responsibilities

Internal modules/responsibilities inside `audio-engine.js` include:
- `AudioContext` lifecycle and mobile-safe unlock/resume
- Master tonal gain and optional limiter/compressor
- Channel registry and active voice tracking
- Engine registry and playback profile registry
- Note-name-to-frequency conversion
- Normalized playback register support
- Cleanup and disconnect behavior
- Error and status reporting

*Design Note: Avoid prescribing a large class hierarchy unless absolutely needed. Prefer a small module or closure exposing a stable public API.*

## 7. Register Strategy

Theoretical labels and playback pitch may differ.
Example:
- Learner label: `A`
- Playback note: `A4`

FSL should normalize playback into a clear register suitable for phone speakers. Sound Lab may use a different approved register. Low notes (e.g., `A2`, `G2`, `C3`) must remain diagnostic only, until mobile loudness QA explicitly passes.

## 8. Implementation Phases

### Phase A0: Documentation and Inventory
- Create this plan only.
- Inventory current audio globals and helper functions in `outputs/app.js`.
- Identify which functions belong to Metronome, Sound Lab, Fretboard Studio, or legacy/unused code.
- **Do not modify production code.**

### Phase A1: Core Construction Only
- Create `outputs/audio-engine.js`.
- Add native engine infrastructure, profiles, channels, and unlock/status API.
- Do NOT integrate FSL or Sound Lab yet.
- Load the file only behind an approved preview mechanism if needed.
- Validate that normal production behavior is completely unchanged.

### Phase A2: FSL Integration
*(Begin only after Phase A1 static and browser QA passes)*
- Load `audio-engine.js` before `app.js`.
- Route FSL note taps through `window.AudioEngine.playNote(...)`.
- Keep FSL behind `?fretboardStudioPreview=1`.
- Do NOT touch production Sound Lab. Keep a temporary fallback path if appropriate.
- Validate desktop and mobile behavior.

### Phase A3: Sound Lab Integration
*(Begin only after FSL integration is stable)*
- Route only the single guide-tone playback path through the shared engine using the `soundlab-guide-tone` profile.
- Preserve the black LED display, one chord item = one guide tone rule, no arpeggios, no stacked chords, and Month 1-6 lesson behavior.
- Keep the current Sound Lab engine available as a temporary fallback until QA passes.

### Phase A4: Cleanup and Consolidation
*(Begin only after both consumers pass QA)*
- Remove duplicated tonal audio code from `app.js`.
- Do NOT remove Metronome audio code unless a separate approved plan exists.
- Remove obsolete globals only after confirming no remaining references.
- Update documentation and architecture inventory.

### Phase A5: Optional Engine Adapters (Future)
- Consider Tone.js or sampler adapters.
- Keep the native engine as a fallback.
- Require explicit approval before adding production dependencies or sample assets.

## 9. Migration and Rollback Strategy

Every phase must be **independently reversible**. 

Requirements:
- One small commit per phase.
- No broad regex replacement or whole-file formatting.
- No full rewrite of `app.js`.
- Inspect `git diff` before committing.
- Abort if unrelated production sections change.

Rollback targets and fallback behavior must be strictly documented during each step. The existing Sound Lab audio must not be removed until the new shared path passes QA.

## 10. Validation Matrix

### Static Validation
- `node --check outputs/app.js`
- `node --check outputs/audio-engine.js`
- `git diff --check`
- `git status --short`
- `grep` for unexpected Tone.js production loading
- `grep` for new `localStorage` writes

### Normal URL
- Month 1-6 visible
- Month 7/8 hidden
- Metronome works
- Sound Lab unchanged before its integration phase
- Practice Notes work
- Mini Courses unchanged
- Reference Shelf unchanged

### FSL Preview
- FSL modal opens
- Fret interaction works
- Note sound responds quickly and repeated taps do not overlap uncontrollably
- Closing the modal stops only the FSL channel
- Metronome continues running

### Sound Lab
- One guide tone per chord item
- No stacked notes or arpeggio
- Black LED UI unchanged
- Existing lesson flow unchanged
- Stopping Sound Lab does not stop Metronome

### Mobile
- Audio unlock after user gesture
- 390px and 430px no horizontal overflow
- Audible on phone speaker
- No first-tap silence after successful unlock
- No console errors

## 11. Risks and Mitigations

| Risk | Mitigation |
| :--- | :--- |
| `AudioContext` conflict | Use a single shared `AudioContext` mapped in `window.AudioEngine` for tonal sounds, keeping it isolated from Metronome if needed, or safely sharing it. |
| Accidental Metronome interruption | Never include Metronome references in `stopAllTonal()`. Do not call global `audioCtx.suspend()` for tonal clear events. |
| Duplicated active voices | Implement voice tracking and cleanup logic inside `audio-engine.js` to immediately stop previous notes on the same channel before playing new ones. |
| First-tap mobile silence | Ensure robust user-gesture unlock API that plays a silent buffer immediately on interaction. |
| Low-register inaudibility | Enforce a normalized register strategy (e.g., C4-C5 range) for phone speakers, keeping low notes strictly diagnostic. |
| Excessive output gain or clipping | Use a `DynamicsCompressorNode` or master `GainNode` with a strict limit (e.g., 0.8) for the tonal bus. |
| Tone.js CDN/network failure | Build the native Web Audio fallback first; never make Tone.js a hard dependency. |
| Legacy audio globals remaining | Run thorough static analysis (`grep`) in Phase A4 before deleting old globals to prevent regressions. |
| Production regression from broad edits | Strictly prohibit regex/global replacements and enforce targeted manual edits per phase. |

## 12. Decision Log

- **Shared Audio Core**: Approved direction
- **Big-bang rewrite**: Rejected
- **Native Web Audio baseline**: Approved
- **Separate FSL and Sound Lab playback profiles**: Approved
- **Metronome migration**: Not included
- **Tone.js production dependency**: Not approved yet
- **Sound Lab current behavior**: Remains until phased migration passes
- **Integration approach**: Must use micro-commits and browser QA
