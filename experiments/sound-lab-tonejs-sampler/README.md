# Tone.js Sampler Diagnostics (Spike Phase 1 & 1B)

## How to run the experiment
Since this prototype loads external audio files via the Web Audio API, browser CORS policies require it to be served via an HTTP server.
1. Open a terminal in this directory (`experiments/sound-lab-tonejs-sampler/`).
2. Run a local server, for example: `npx serve` or `python -m http.server 8000` or `npm run serve` (from the project root if it serves the whole repo).
3. Open the provided `localhost` URL in your browser and navigate to this folder if necessary.

## Diagnostic Statuses
The UI now provides real-time feedback on the state of the audio engine:
- **Tone.js Script**: Confirms whether the Tone.js library loaded correctly from CDN.
- **AudioContext**: Shows whether the browser has allowed audio to play (Locked vs Running).
- **Synth (Fallback)**: Confirms the basic oscillator is initialized. **This must work before evaluating the Sampler.**
- **Sampler Status**: Shows whether the external audio files are Idle, Loading, Ready, or Failed (e.g., due to network issues).
- **Theory Note / Playback Note**: Differentiates between the theoretical note being taught vs. the actual note frequency being played (Phase 1B).
- **Normalization**: Indicates whether the audition register has been shifted up.
- **Loudness Obs.**: Highlights the risk of mobile speaker volume for the chosen playback note.

## Troubleshooting Steps if No Sound
1. **Did you unlock audio?** Mobile Safari and Chrome require explicit user interaction (Step 1 button).
2. **Does the Synth Beep work?** Click "Test Beep (Synth)". If this makes no sound, your device volume might be muted, or the AudioContext failed to start. Check the "Last Error" field.
3. **Does the Sampler fail to load?** If the Sampler stays on "Loading..." or shows "Failed (Timeout)", open your browser's **DevTools Network tab** to see if the Salamander Grand Piano `.mp3` files are being blocked by CORS, adblockers, or slow connections.
4. **Check the DevTools Console**: Look for red error text that might explain why Tone.js failed.

## Phase 1B: Audition Register Normalization
**Observed Issue:** The Phase 1 test revealed that low-register notes (e.g., `A2`) produce very little audible output on standard laptop and mobile phone speakers. Since Sound Lab is an educational tool, if a student cannot hear the root note clearly, the learning value is lost. 

**Solution:** The spike now tests separating the `theoryNote` (what the student sees) from the `auditionNote` (what the student hears). The normalization helper ensures any note below Octave 4 is bumped to Octave 4.

### Phase 1B QA Checklist
- [ ] **A2 raw is quieter than A4**: Playing A2 raw is perceptibly quieter/muddier than A4 on laptop/phone speakers.
- [ ] **Normalized A2 -> A4 is clearer**: Bumping the playback register solves the volume/clarity issue immediately.
- [ ] **Sequential compare remains single-note only**: Triggering sequential playback ensures no stacked chords are played simultaneously.
- [ ] **Mobile speaker loudness is acceptable**: The Phase 1B normalized notes are loud and clear on physical devices.

**Production Implication:** Production Sound Lab V2 should explicitly separate `theoryNote` from `auditionNote` (or `playbackNote`) in the curriculum data schema to ensure both educational accuracy and audible clarity.

## Phase 1 Manual QA PASS
**Observed Results:**
- **Local URL**: http://127.0.0.1:5173/experiments/sound-lab-tonejs-sampler/
- **Tone.js Script**: Loaded v14.8.49
- **AudioContext State**: running
- **Synth Ready**: Yes
- **Sampler Status**: Ready (Salamander)
- **Last Error**: None
- Audible output confirmed

**Conclusion:**
Phase 1 proves that Tone.js, combined with a Synth fallback and Tone.Sampler, can successfully produce sound in this isolated prototype. Note that this is **not production approval yet**. Phase 2 should evaluate instrument tone, sample strategy, licensing, mobile loudness, and adherence to Sound Lab V2 guardrails before any integration is considered.

## Known limitations
- **CDN loading time**: The Salamander Grand Piano samples are loaded from the Tone.js GitHub CDN.
- **Strictly isolated**: This code is a proof of concept only and is strictly isolated from production (`outputs/app.js`). Do not attempt to merge this UI into the main application.
