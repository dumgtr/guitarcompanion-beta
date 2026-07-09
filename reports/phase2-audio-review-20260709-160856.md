## Audio-Web Review

**Passing status:** Conditional PASS for the isolated experiment. Static code review passed, and inline JavaScript parse check passed. No files were edited.

**Findings**

- **Fallback Synth logic: PASS with caveats**  
  [index.html](</c/Users/Thanit Jit/Documents/Codex/2026-06-05/webapp-guitar-lesson-6-8-intermediate/experiments/sound-lab-tonejs-sampler/index.html:223>) creates a `Tone.Synth()` after user unlock. Playback selects `sampler` only when `isSamplerReady` is true, otherwise falls back to `synth`. Sampler timeout also sets `isSamplerReady = false`, so failed loading falls back correctly. Caveat: the sampler load button stays disabled after failure, so retry requires reload.

- **Clipping management: PARTIAL PASS**  
  Sampler output uses `Compressor -> Filter -> Reverb -> Limiter -> Destination`, with limiter at `-1` dB. However the Synth fallback goes directly to `Tone.Destination`, so fallback audio does not share the limiter/compressor chain. Also `sampler.volume.value = 4` may cause limiter pumping or fatigue on mobile speakers, even if hard clipping is reduced.

- **Tone.js chain readiness: NEEDS ATTENTION**  
  `isSamplerReady` is set in the sampler `onload`, but the sampler is only connected after `reverb.generate().then(...)`. If samples load before the reverb chain is ready, the UI can report sampler ready while playback may be silent or inconsistent.

- **Phase 1B register normalization: PASS**  
  `getAuditionNote()` maps octave-2 notes to octave 3, so `A2 -> A3`, `E2 -> E3`, `G2 -> G3`, and `B2 -> B3`. Raw comparison remains available, and sequential compare releases active voices before the next note, avoiding stacked notes.

- **Network dependency: experiment-only risk**  
  Tone.js and samples load from external CDNs. This is acceptable for a spike, but not compatible with the project’s no-network production rule.

**QA Recommendations**

1. Route both Synth fallback and Sampler through a shared master limiter or output bus.
2. Mark sampler ready only after both samples load and the effects chain is connected.
3. Add `.catch()` handling for `reverb.generate()` and keep fallback Synth active if the chain fails.
4. Re-enable sampler loading or provide a retry path after timeout/failure.
5. Physical mobile QA still required: test A2 raw vs A3 normalized, E2/G2/B2 normalized, sequential compare, and listen for clipping, pumping, harshness, and speaker fatigue on iOS Safari and Android Chrome.