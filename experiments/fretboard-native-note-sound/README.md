# Fretboard Native Note Sound Sandbox

Phase: isolated experiment only.

This sandbox tests native Web Audio note-preview models for future Fretboard Studio Lite work. It is now a small Sound Engine Shootout so the user can compare engines before any production integration. It is intentionally separate from production and must not be merged into the production Fretboard Studio modal without a later integration spec and approval.

## Guardrails

- No Tone.js.
- No samples.
- No dependencies.
- No build tools.
- No localStorage.
- No autoplay.
- No production integration.
- No Month 7/8 exposure.
- Do not edit anything outside `experiments/fretboard-native-note-sound/` for this experiment.

## Sound Model

- Audio unlock happens only after the user presses `เปิดเสียง`.
- Notes use native `AudioContext` / `webkitAudioContext`.
- A short gain envelope avoids harsh clicks:
  - fast attack
  - short decay/release
  - duration around 250-450ms
- Active notes are stopped before a new note plays.
- The original double-attenuation issue is fixed: user volume is applied at the per-note envelope, while master gain stays stable and output trim is separate.

## Engine Options

1. Clean Oscillator
   - Native oscillator only.
   - Uses the selected sine / triangle waveform.
   - Clean gain staging: master gain is stable, per-note envelope peak follows user volume.

2. Boosted Oscillator
   - Native oscillator plus gentle lowpass filter, compressor, and output trim.
   - Intended to be louder than Clean Oscillator without harsh clipping.

3. Sound Lab Plucked
   - Native Web Audio voice modeled after the production Sound Lab guide-tone character.
   - Uses a small blend of triangle / sine oscillators, filter envelope, gain envelope, compressor, and output trim.
   - Still plays one note at a time. No stacked chords and no arpeggios.

4. Diagnostic Low Register
   - Plays actual low-register notes such as A2 for comparison only.
   - Not recommended as the learner-facing default unless mobile speaker QA passes.

## Register Decision

The learner-facing label and playback note are deliberately separate.

Example:

- Label note: `A`
- Playback note: `A4`
- Frequency: `440 Hz`

The sandbox normalizes learner-facing note previews into a clearer register around C4-C5. Low notes such as A2/G2/C3 are not used as the default learner-facing playback because small speakers often reproduce them poorly.

There is one diagnostic-only `A2` test button. It is for low-register checking, not the default teaching sound.

## Included Notes

Key: A

- A = Root
- C = b3
- C# = 3
- D = 4
- E = 5
- G = b7

Scale context:

- A minor pentatonic: A C D E G
- A major pentatonic: A B C# E F#

## How To Run

From the repo root:

```powershell
npm run serve
```

Open:

```text
http://127.0.0.1:5173/experiments/fretboard-native-note-sound/
```

## Manual QA Checklist

Desktop Chrome:

- `เปิดเสียง` unlocks audio.
- A / C / C# / D / E / G all play.
- Sound On/Off works.
- Volume slider changes loudness.
- Output Trim changes final loudness.
- Duration slider changes note length.
- sine / triangle selector changes tone.
- Engine selector changes sound.
- Replay Last Note replays the most recent note with the current selected engine.
- Debug display shows label note, playback note, and frequency.
- Debug display shows the active engine.

Mobile browser:

- First tap unlock works.
- Note buttons are large enough to tap.
- No horizontal overflow at 390px / 430px.
- At least one engine is loud enough on small speakers.
- Diagnostic Low Register is clearly marked as diagnostic only.

## Production Recommendation

For F3C-C, keep the same principle:

- no autoplay
- unlock after user gesture
- one active preview voice at a time
- label note and playback note stay separate
- default learner playback should stay in a clear register
- low-register playback requires explicit QA before becoming learner-facing
- reject any engine that is too quiet on mobile speakers
