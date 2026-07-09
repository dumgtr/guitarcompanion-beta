# Sound Lab V2 Adapter Prototype

Status: Phase B2 / Adapter Prototype Only

This folder is an isolated prototype for adapting the Phase B0 Sound Lab V2 fixture into the current `chord-sound-lab` style data shape. It lives outside `outputs/*` and is not connected to production rendering, production data, or the current Sound Lab UI.

## Purpose

Phase B2 proves data transformation only. It checks whether each Sound Lab V2 fixture item can become a current-compatible Sound Lab object without changing production code or production data.

Input:

```text
experiments/sound-lab-v2-schema-fixture/sound-lab-v2.fixture.json
```

Generated sample output:

```text
experiments/sound-lab-v2-adapter-prototype/sample-adapted-output.json
```

## Production Guardrails

- No `outputs/*` files are changed by this prototype.
- `outputs/data.json` and `outputs/data-shards/*` still require a separate explicit approval before any patch.
- This adapter is not a production renderer branch.
- Production integration still requires a later approved renderer change that honors `playbackNote` directly.
- No Tone.js dependency is added.
- No stacked chords are created.
- No arpeggio patterns are created.
- No autoplay behavior is represented.
- Each adapted item contains one `chords[]` item and one playback note only.

## Key Risk

The current production renderer may normalize low audition notes upward to octave 4. Sound Lab V2 must not let the old A4 normalization touch V2 `playbackNote` or compatibility `auditionNote`.

Approved baseline:

```text
theoryNote: A2
playbackNote: A3
```

The adapter preserves that pair exactly. A future production renderer branch must play `playbackNote` directly for V2 labs so A2 -> A3 does not accidentally become A2 -> A4.

## Files

- `adapt-sound-lab-v2.js`: dependency-free Node-compatible adapter.
- `sample-adapted-output.json`: pretty-printed adapted fixture output.

## Run Locally

```powershell
node experiments\sound-lab-v2-adapter-prototype\adapt-sound-lab-v2.js
```

The command rewrites only `sample-adapted-output.json` inside this experiment folder.

## Next Phase

Phase B3 should only happen after explicit approval. It should be a targeted production-data patch or preview branch plan, not a broad Sound Lab rewrite.
