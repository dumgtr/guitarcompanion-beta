# Tone.js Sampler Diagnostics (Spike Phase 1)

## How to run the experiment
Since this prototype loads external audio files via the Web Audio API, browser CORS policies require it to be served via an HTTP server.
1. Open a terminal in this directory (`experiments/sound-lab-tonejs-sampler/`).
2. Run a local server, for example: `npx serve` or `python -m http.server 8000` or `npm run serve` (from the project root if it serves the whole repo).
3. Open the provided `localhost` URL in your browser and navigate to this folder if necessary.

## Diagnostic Statuses
The UI now provides real-time feedback on the state of the audio engine:
- **Tone.js Script**: Confirms whether the Tone.js library loaded correctly from CDN.
- **AudioContext State**: Shows whether the browser has allowed audio to play (Locked vs Running).
- **Synth Ready (Fallback)**: Confirms the basic oscillator is initialized. **This must work before evaluating the Sampler.**
- **Sampler Status**: Shows whether the external audio files are Idle, Loading, Ready, or Failed (e.g., due to network issues).
- **Last Action / Last Error**: Provides immediate visual feedback for user interactions.

## Troubleshooting Steps if No Sound
1. **Did you unlock audio?** Mobile Safari and Chrome require explicit user interaction (Step 1 button).
2. **Does the Synth Beep work?** Click "Test Beep (Synth)". If this makes no sound, your device volume might be muted, or the AudioContext failed to start. Check the "Last Error" field.
3. **Does the Sampler fail to load?** If the Sampler stays on "Loading..." or shows "Failed (Timeout)", open your browser's **DevTools Network tab** to see if the Salamander Grand Piano `.mp3` files are being blocked by CORS, adblockers, or slow connections.
4. **Check the DevTools Console**: Look for red error text that might explain why Tone.js failed.

## What to listen for
- **Clarity**: Are the samples clean without distortion?
- **Latency**: Is there any noticeable delay between clicking a button and hearing the sound?
- **Sequential Playback**: The "Compare" buttons now play notes sequentially (e.g., A2, then C4 0.5s later). This correctly mimics the Sound Lab baseline rule: **No stacked chords**.

## Mobile QA checklist
- [ ] **Unlock works**: Tapping "Unlock Audio Context" successfully changes state to `running`.
- [ ] **Synth Fallback**: Tapping note buttons before loading the sampler correctly plays synth tones.
- [ ] **No audio delay on tap**: Mobile browsers often have touch delays; ensure the sound triggers immediately.

## Known limitations
- **CDN loading time**: The Salamander Grand Piano samples are loaded from the Tone.js GitHub CDN.
- **Strictly isolated**: This code is a proof of concept only and is strictly isolated from production (`outputs/app.js`). Do not attempt to merge this UI into the main application.
