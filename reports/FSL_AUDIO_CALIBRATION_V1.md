# FSL Audio Calibration V1

## Scope

- Instruments: Synth, Nylon, Electric
- MIDI range: 40–76 (37 notes)
- Analysis window: 240 ms from each rendered note attack
- Pitch-shift emulation: asetrate + aresample
- Meter: ffmpeg astats Overall peak and RMS

## Nylon provenance and coverage

- Source family: tonejs-instruments `guitar-nylon`
- Original author: quartertone
- License: CC BY 3.0
- Upstream revision: `622c2f1c32c8cfce4158ddc3eb26e518ddef37e5`
- Approved anchors: F#2 (42), A2 (45), C#3 (49), E3 (52), A3 (57), C#4 (61), E4 (64), G#4 (68), A4 (69), C#5 (73), E5 (76)
- Maximum anchor distance: 2 semitones (policy: ≤ 3)

## Calibration method

The script renders the exact local sample selected for each MIDI target using
the production playback rate, then measures Overall peak and RMS with ffmpeg
`astats`. Routed Synth (gain 1), base Nylon
(velocity 0.8), and routed Electric (gain
0.25) form a per-MIDI three-bank set. The median
RMS is the robust cross-bank reference. Nylon correction is derived only from
that measured reference, limited to ±3 dB,
quantized to 0.25 dB, and constrained below
-1 dBFS before the shared master gain.

The existing +0.5 dB Nylon makeup is retained;
each production per-MIDI gain is the measured total correction minus that fixed
makeup, so the combined runtime correction equals the measured value.

## Before / after summary

| Metric | Before | After |
|---|---:|---:|
| Nylon RMS range (dBFS) | -22.239 to -11.623 | -22.239 to -13.311 |
| Nylon median RMS (dBFS) | -15.873 | -16.523 |
| Median absolute error to cross-bank reference | 0.934 dB | 0.012 dB |
| Applied total correction range | — | -3 to 0 dB |

The correction is deliberately capped and quantized; it reduces measured
cross-bank mismatch without flattening the natural instrument dynamics.

## Reproduce

```powershell
node reports/fsl-audio-calibration-measure.mjs --write
```

Full per-MIDI peak/RMS measurements and derived gains are stored in
`reports/fsl-audio-calibration-v1.json`.
