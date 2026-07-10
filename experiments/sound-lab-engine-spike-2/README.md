# Sound Lab Engine Spike 2

This isolated experiment compares different audio synthesis engines for the upcoming Sound Lab V2. The goal is to determine the best approach for playing a single **guide tone** (e.g., the 3rd or 7th of a chord) clearly and pleasantly without using pre-recorded samples.

## Candidates

1. **Native Simple**: A baseline sine wave using vanilla Web Audio `OscillatorNode`.
2. **Native Plucked**: A more complex vanilla Web Audio approach using a triangle wave, lowpass filter with an exponential sweep, and dynamics compressor to simulate a plucked string.
3. **Tone.js PluckSynth**: A candidate using the `Tone.js` library for a more refined plucked sound (loaded only in this sandbox).
4. **Diagnostic Low Register**: A variant of the native plucked engine shifted down an octave for evaluating bass register clarity.

## Guardrails

- This experiment must **never** be imported into production `app.js`.
- It does not use `localStorage`.
- It avoids autoplay; all audio requires a user gesture (clicking "Play Guide Tone").
- No external dependencies are added to the main project (Tone.js is loaded via CDN specifically in this sandbox HTML).
- It strictly plays one guide tone at a time, avoiding arpeggios or full stacked chords to maintain the Sound Lab teaching focus.
