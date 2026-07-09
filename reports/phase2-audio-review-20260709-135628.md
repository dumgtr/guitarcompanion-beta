## Audio-Web Review

**Status: Conditional PASS for isolated experiment only. Not production-approved.**  
Read-only review completed; no files changed.

**Findings**

- **WARN:** Sampler fallback is mostly correct, but `isSamplerReady` can become `true` before the sampler output chain is connected. The sampler marks ready in `onload`, while `sampler.chain(...)` happens later inside `reverb.generate().then(...)`. If that promise is delayed or fails, playback routes to a silent sampler instead of Synth fallback. See [index.html](</Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:364>) and [index.html](</Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:381>).

- **WARN:** Clipping is managed on the Sampler path with compressor and limiter, but the fallback Synth goes directly to destination and bypasses that safety chain. See [index.html](</Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:223>) and [index.html](</Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:374>).

- **PASS:** Web audio unlock is handled through a user gesture via `Tone.start()`, which fits mobile browser AudioContext requirements. See [index.html](</Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:216>).

- **PASS:** Synth fallback selection is structurally present. When `isSamplerReady` is false, `triggerNote()` and sequence playback use `synth`. Timeout failure also logs fallback behavior. See [index.html](</Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:339>) and [index.html](</Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:385>).

- **PASS:** Phase 1B register normalization is correct for the approved baseline: octave 2 teaching notes become octave 3 playback notes, while other octaves remain unchanged. Raw/bypassed tests remain available. See [index.html](</Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:255>).

- **NOTE:** The experiment depends on CDN/network for Tone.js and Salamander samples. That is documented as a limitation, but it conflicts with the project’s no-network rule if considered for production.

**QA Recommendations**

- Test on physical mobile speakers: raw `A2`, raw `A3`, raw `A4`, then normalized `A2 -> A3`.
- Test sampler failure by blocking the sample host or using offline mode, then confirm Synth fallback still plays.
- Confirm no clipping or harsh limiting with repeated normalized notes and sequential comparison.
- Before production use, route both Sampler and Synth through one shared output chain with a limiter/master gain.