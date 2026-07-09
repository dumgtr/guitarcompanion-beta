## Audio-Web Review

**Passing status:** Conditional PASS for isolated experiment only. Not production-ready.

**Scope inspected:** `experiments/sound-lab-tonejs-sampler/`  
**Verification run:** inline JavaScript syntax parse passed with Node. No files edited.

| Criteria | Status | Findings |
|---|---:|---|
| Fallback Synth if Sampler fails | PASS with caveats | `Tone.Synth()` is initialized after `Tone.start()` and playback falls back to `synth` when `isSamplerReady` is false. Sampler timeout also resets `isSamplerReady = false`. See [index.html](<C:/Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:223>) and [index.html](<C:/Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:339>). |
| Web audio unlock | PASS | Audio starts from explicit user action via `Tone.start()`, and controls are disabled before unlock. See [index.html](<C:/Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:219>). |
| Clipping management | PARTIAL PASS | Sampler path has compressor and limiter, ending with `Tone.Limiter(-1)`. However `sampler.volume.value = 4` boosts into the chain, and there is no meter/analyser QA to prove peak safety on devices. See [index.html](<C:/Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:372>). |
| Phase 1B register normalization | PASS | `getAuditionNote()` maps octave 2 notes to octave 3, preserving theory note display while improving playback audibility. This covers `A2`, `E2`, `G2`, `B2`. See [index.html](<C:/Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:255>). |
| Sequential compare single-note behavior | PASS | `releaseActiveVoices()` runs before each note, preventing stacked notes. See [index.html](<C:/Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:322>). |
| Network/project constraint | FAIL for integration | The experiment loads Tone.js from CDN and samples from `tonejs.github.io`, which conflicts with the project rule “Do not use network” if this moves beyond an isolated spike. See [index.html](<C:/Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:8>) and [index.html](<C:/Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:361>). |

**Main risk**

Sampler readiness is set in `onload`, but the audio chain is connected later inside `reverb.generate().then(...)`. A fast user could see “ready” while the sampler is not yet connected to `Tone.Destination`, causing silent playback. See [index.html](<C:/Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:364>) and [index.html](<C:/Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:380>).

**QA recommendations**

1. Mark sampler ready only after samples are loaded and the chain is connected.
2. Add manual peak/loudness QA: A2 raw, A2→A3, E2→E3, and sequence compare on laptop speaker, iPhone, Android, and headphones.
3. Keep the limiter, but test whether `sampler.volume.value = 4` causes fatigue or limiter pumping.
4. Add a retry path if sampler loading times out.
5. Do not integrate this into production until CDN/sample dependencies are replaced with local assets or an approved no-network strategy.