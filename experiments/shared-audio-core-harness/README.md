# Shared Audio Core Browser Harness

This is the Phase A1-2 validation harness for the completed Shared Audio Core.
It is an isolated browser experiment and does not integrate Fretboard Studio Lite
or Sound Lab into production.

## What It Loads

`index.html` loads the real core file directly:

```html
<script src="../../outputs/audio-engine.js"></script>
<script src="app.js"></script>
```

The AudioEngine implementation is not copied into this experiment. If a core
defect appears during QA, report the defect instead of changing the core during
this harness task.

## Guardrails

- No Tone.js.
- No external dependencies.
- No samples.
- No localStorage.
- No autoplay.
- No production integration.
- No Metronome migration.
- No Month 7 or Month 8 changes.
- No changes to `outputs/audio-engine.js`.

## Test Coverage

The harness provides:

- Audio unlock and live `AudioEngine.getStatus()` JSON.
- FSL profile checks for `fsl-note-preview` on channel `fsl`.
- Sound Lab profile checks for `soundlab-guide-tone` on channel `soundlab`.
- Invalid range checks: FSL `A3` and Sound Lab `G2` should return `false`.
- Channel isolation checks where FSL and Sound Lab can both be active.
- Channel-specific stop checks.
- `stopAllTonal()` check.
- Rapid FSL replacement test to listen for clicks, pops, or uncontrolled overlap.
- Result log with operation, boolean result, active channels, active voice count,
  last error, and timestamp.

## Manual QA Checklist

### Desktop Chrome

- Unlock returns `true`.
- First note plays after unlock.
- FSL valid notes play: `C4`, `E4`, `A4`, `C5`.
- FSL `A3` returns `false`.
- Sound Lab valid notes play: `A3`, `C4`, `C#4`, `B4`, `C5`.
- Sound Lab `G2` returns `false`.
- Repeated FSL taps do not overlap uncontrollably.
- FSL and Sound Lab can be active independently.
- Stopping FSL does not stop Sound Lab.
- `stopAllTonal()` stops both channels.
- No console errors.

### Mobile

- First user tap unlocks audio.
- No first-tap silence after ready status.
- Notes are audible on phone speaker.
- Listen for click/pop when replacing a note.
- FSL response feels fast enough.
- Sound Lab sustain is long enough for guide-tone listening.
- No horizontal overflow at 390px and 430px.
- No console errors.

## Static Validation

Run from the repo root:

```powershell
node --check experiments/shared-audio-core-harness/app.js
node --check outputs/audio-engine.js
node --check outputs/app.js
git diff --check
git status --short
git diff --name-only
```

Only these four harness files should be changed:

- `experiments/shared-audio-core-harness/index.html`
- `experiments/shared-audio-core-harness/app.js`
- `experiments/shared-audio-core-harness/styles.css`
- `experiments/shared-audio-core-harness/README.md`
