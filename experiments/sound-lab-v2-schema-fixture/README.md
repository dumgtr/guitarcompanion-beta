# Sound Lab V2 Schema Fixture

Status: Phase B0 / Schema Fixture Only

This folder is a mock-data prototype for Sound Lab V2. It lives outside `outputs/*` and is not connected to production rendering, production data, or the current Sound Lab UI.

## Purpose

Phase B0 exists to review the Sound Lab V2 data shape before any production data patch. The fixture tests whether future Sound Lab items can safely describe:

- the chord/function context being taught;
- the single guide tone the learner should hear;
- the distinction between `theoryNote` and `playbackNote`;
- the approved A2 -> A3 playback normalization baseline;
- QA tags for renderer/audio review.

## Production Guardrails

- Do not edit `outputs/data.json` during Phase B0.
- Do not merge this fixture into production without a separate integration spec and explicit approval.
- Do not add a Tone.js dependency from this fixture.
- Do not add stacked chords.
- Do not add arpeggio patterns.
- Do not add autoplay behavior.
- Keep all examples to one active guide tone per interaction.

## theoryNote vs playbackNote

`theoryNote` is the note the learner studies in the lesson context.

`playbackNote` is the note the audio engine should play so the sound is audible and useful on small speakers.

The approved Phase 2 baseline is:

```text
A2 -> A3
```

That means the learner can still see and understand `A2`, while the listening test may play `A3` to avoid weak low-end playback on mobile phones or laptop speakers.

## Files

- `sound-lab-v2.schema.json`: draft JSON Schema for a Sound Lab V2 fixture payload.
- `sound-lab-v2.fixture.json`: example payload using Month 5 and Month 6 live curriculum context only.

## Next Phase

After this fixture is reviewed, the next phase is:

```text
Phase B1: Renderer compatibility review
```

Production `outputs/data.json` changes require a separate explicit approval after B1.
