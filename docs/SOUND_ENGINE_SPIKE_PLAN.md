# Sound Engine Spike Plan (Sound Lab V2)

## Purpose
The purpose of this spike is to evaluate Tone.js Sampler as the future audio engine for Sound Lab V2. The current custom audio implementation relies on simple oscillator and buffer techniques. To support high-quality instrument sounds and reliable playback timing without rewriting the entire Web Audio API pipeline from scratch, we need to test a robust library in an isolated environment.

## Why Tone.js Sampler is the primary candidate
- **Web Audio API Abstraction**: Tone.js manages the complexities of audio context lifecycle and timing across browsers.
- **Sampler Capabilities**: Tone.js Sampler allows loading multi-sampled instruments (e.g., real guitar or piano sounds) easily, mapped across the keyboard.
- **Timing and Scheduling**: It provides precise transport scheduling which will be critical if we ever move beyond basic playback.
- **Active Maintenance**: It is a widely used and supported open-source library.

## Alternatives considered
- **Howler.js**: Excellent for basic audio playback and sprites, but lacks the musical scheduling and pitch-shifting features of a sampler.
- **Raw Web Audio API**: Complete control, but requires writing complex boilerplate for scheduling, polyphony, and sample management that Tone.js already provides.
- **MIDI.js**: Outdated and often heavy/unreliable across modern mobile browsers.

## Baseline constraints that must not break
- **Black LED display**: The visual status LED must remain unchanged.
- **Single guide tone**: Tone.js must only play the single requested guide tone per chord.
- **GUIDE label behavior**: The current status display logic must not be broken by the new engine.
- **No arpeggios**: Playback must not sequence notes individually.
- **No stacked chords**: Playback must not stack multiple notes simultaneously.
- **Month 4/5/6 behavior**: The core user experience and existing lessons must not be affected.

## Sample asset requirements
- Samples must be high-quality (e.g., acoustic guitar or piano).
- Samples must be optimized for web (compressed formats like mp3 or ogg).
- **CRITICAL**: Sample licenses must be strictly verified for commercial/public web use before any production deployment.

## Prototype scope
- Build an isolated HTML/JS sandbox (outside of `outputs/app.js`).
- Load Tone.js via CDN in the sandbox.
- Load 3-4 sample files into a Tone.js Sampler.
- Trigger single guide tones corresponding to a simulated Sound Lab sequence.
- Measure load times, memory usage, and latency.

## Mobile/audio unlock considerations
- Browsers require user interaction to unlock the Web Audio API Context.
- Tone.js handles some of this internally (e.g., `Tone.start()`), but the prototype must explicitly test the audio unlock flow on iOS Safari and Chrome Android.

## QA matrix
Before considering a merge into any production branch, the spike must prove:
- Audio unlocks reliably on iOS and Android.
- No memory leaks after repeated playbacks.
- Latency is imperceptible when triggering a note.
- Sample loading does not block the main thread excessively.
- Month 4 behavior remains completely isolated and unchanged during the spike.

## Decision criteria
The spike will be considered a success if we can reliably play a single, high-quality guide tone on mobile and desktop without layout shifts, UI freezing, or audio dropouts, using a clean API surface.

## Rollback / abandon plan
If the spike fails (e.g., Tone.js is too heavy, or mobile playback is unreliable):
- Stop immediately.
- Document the regression or failure reason in this plan.
- Abandon the spike branch without merging.
- Revert or abandon the branch only after confirming the clean baseline commit.
- Do not force-push without explicit approval.

## Non-goals
- **Tone.js must not be added to production until a spike passes QA.**
- **Do not recreate the failed Teaching Surface patch directly.**
- **Do not inject CHORD FUNCTION into the existing LED display.**
- **Do not change Month 4 behavior in the first implementation.**
- **Do not expose Sound Lab V2 during monitoring.**
- **Do not replace the current black LED / single guide tone baseline.**
- **Do not add arpeggios or stacked chord playback.**

## Risks
- **Bundle Size**: Tone.js is a large library. If used, it must not bloat the initial load time.
- **Mobile Safari Restrictions**: Audio context suspend/resume behaviors can be flaky.
- **Asset Hosting**: Hosting high-quality samples might increase bandwidth costs.

## Open questions
- Should we use a CDN for Tone.js or bundle it?
- Which specific instrument samples (piano vs guitar) provide the clearest guide tone for learning?
- How do we handle offline fallback if sample assets fail to load?
