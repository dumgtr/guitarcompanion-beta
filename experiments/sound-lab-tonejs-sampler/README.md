# Tone.js Sampler Spike

## How to run the experiment
Since this prototype loads external audio files via the Web Audio API, browser CORS policies require it to be served via an HTTP server.
1. Open a terminal in this directory (`experiments/sound-lab-tonejs-sampler/`).
2. Run a local server, for example: `npx serve` or `python -m http.server 8000` or `npm run serve` (from the project root if it serves the whole repo).
3. Open the provided `localhost` URL in your browser and navigate to this folder if necessary.

## What to listen for
- **Clarity**: Are the samples clean without distortion?
- **Soft piano tone**: Does the lowpass filter and reverb successfully mimic the desired "soft piano" feel?
- **Latency**: Is there any noticeable delay between clicking a button and hearing the sound?
- **Chord color difference**: When using the Compare buttons, can you clearly hear the emotional difference between the minor feel (A2 + C4) and major feel (A2 + C#4)?

## Mobile QA checklist
- [ ] **Unlock overlay works**: Tapping "Unlock Audio" successfully starts the `Tone.Context`.
- [ ] **No audio delay on tap**: Mobile browsers often have touch delays; ensure the sound triggers immediately.
- [ ] **No clipping**: Ensure the volume is not clipping or distorting through mobile speakers.

## Known limitations
- **CDN loading time**: The Salamander Grand Piano samples are loaded from the Tone.js GitHub CDN. This may take a few seconds depending on internet speed.
- **Strictly isolated**: This code is a proof of concept only and is strictly isolated from production (`outputs/app.js`). Do not attempt to merge this UI into the main application.
