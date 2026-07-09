# Sound Lab V2 Phase B1 Renderer Compatibility Review

Status: Documentation / Compatibility Review Only

This report reviews the Phase B0 schema fixture against the current production Sound Lab renderer. It does not approve a production data patch, renderer rewrite, Tone.js integration, or any public exposure change.

Reviewed sources:

- `docs/SOUND_LAB_V2_INTEGRATION_SPEC.md`
- `experiments/sound-lab-v2-schema-fixture/README.md`
- `experiments/sound-lab-v2-schema-fixture/sound-lab-v2.schema.json`
- `experiments/sound-lab-v2-schema-fixture/sound-lab-v2.fixture.json`
- `outputs/app.js` read-only
- `outputs/data-shards/core-m1-m4.json` read-only
- `outputs/data-shards/month5-preview.json` read-only
- `outputs/data-shards/month6-preview.json` read-only

## 1. Current Production Sound Lab Data Shape

The current app loads lesson data from JSON shards, not from a single active `outputs/data.json` file in this working tree. `outputs/app.js` merges:

- `outputs/data-shards/core-m1-m4.json`
- `outputs/data-shards/month5-preview.json`
- `outputs/data-shards/month6-preview.json`

Sound Lab content is currently represented as root-level `chordSoundLabs[]` assets, referenced by lesson blocks with `type: "chord-sound-lab"`, `type: "ear-training-lab"`, `type: "progression-lab"`, or `type: "chord-lab"` plus `labRef`.

Current lab asset shape, based on Month 5 and Month 6 shards:

```json
{
  "id": "m5-w17-sound-diatonic-family",
  "type": "chord-sound-lab",
  "title": "C Major Diatonic Family: I-IV-V-vi",
  "chords": [
    {
      "id": "C",
      "name": "C Major",
      "degree": "I",
      "role": "Home",
      "notes": ["C3", "G3", "E4"]
    }
  ],
  "audioEngine": {
    "voice": "soft-piano",
    "durationMs": 1200,
    "strumMs": 28
  }
}
```

Current renderer entry points in `outputs/app.js`:

- `renderLessonBlocks(...)` routes `chord-lab`, `chord-sound-lab`, `ear-training-lab`, and `progression-lab` to `renderChordSoundLab(...)`.
- `renderChordSoundLab(...)` builds the Sound Lab card, control buttons, stop button, listen-for notes, and the black LED-style status display.
- `getLabPlaybackItems(...)` expects either `lab.chords[]` or a flat `lab.notes[]` fallback.
- `getLabPlaybackNotes(...)` selects what to play. It currently favors `auditionNotes`, `playNotes`, `auditionNote`, `playNote`, or `rootNote`; otherwise it plays one representative note from `notes[]`.
- `playLabItem(...)` stops old audio, ensures user-gesture audio context, updates the black LED display, then plays either one guide tone, sequential notes, or staggered notes depending on timing.
- `playSoundLabGuideTone(...)` is the current single-guide-tone voice.
- `setLabStatus(...)` renders the black LED display and preserves the `GUIDE` label.

Important current behavior:

- The production renderer already supports one active guide tone for single-note audition.
- The production renderer already stops existing active sound before new playback.
- The production renderer does not use Tone.js.
- Current single-note audition normalizes low notes to octave 4 through `normalizeAuditionPitch(...)`. This is not compatible with the approved Sound Lab V2 A2 -> A3 baseline without a targeted adapter or renderer branch.

## 2. B0 Fixture Compatibility

The Phase B0 fixture contains five Sound Lab V2 items, limited to Month 5 and Month 6 contexts. It does not include Month 7 or Month 8 content.

Field compatibility against the current renderer:

| Field | B0 Fixture Meaning | Current Renderer Compatibility | Status |
|---|---|---:|---|
| `id` | Canonical Sound Lab V2 item ID | Can become a lab ID or chord item ID. Current renderer accepts arbitrary IDs. | Directly usable |
| `month` | Curriculum month | Current Sound Lab renderer does not consume this field directly. Useful for migration filtering and QA. | Docs-only / adapter metadata |
| `week` | Curriculum week | Current renderer does not consume this field directly. Useful for attaching the item to a future lesson block. | Docs-only / adapter metadata |
| `lessonContext` | Human-readable lesson/source context | Current renderer can display similar text via `description`, `listenFor`, or card copy, but not this exact field. | Needs adapter |
| `chordLabel` | Chord label shown to learner | Current renderer expects `chord.chord`, `chord.label`, or falls back to `chord.id`; existing data often uses `name`, which is not used by `getSoundLabPrimaryName(...)`. | Needs adapter |
| `functionLabel` | Harmonic function label | Can map to `degree` or `role`. | Needs adapter |
| `guideToneLabel` | Learner-facing guide tone role, e.g. `E (3rd)` | Current black LED `GUIDE` line displays played notes from `getSoundLabGuideToneText(...)`, not semantic labels. | Needs adapter |
| `theoryNote` | Note learner studies | Current renderer has no separate theory/display note field. If mapped to `notes[]`, it may be octave-normalized for playback. | Needs adapter |
| `playbackNote` | Note the engine should play | Current renderer has no trusted playback-note bypass; `auditionNote`/`playNote` still pass through octave-4 normalization. | Risky / requires renderer change |
| `playbackRule` | Declares normalization rule, e.g. `octave-2-to-octave-3` | Current renderer has no rule-aware branch. | Needs adapter / renderer support |
| `functionText` | Teacher-facing explanation of function/color | Current renderer can show similar content in `listenFor`, `description`, `role`, or fallback copy. | Needs adapter |
| `learnerHint` | Student-facing listening prompt | Current renderer can show this through `listenFor` or a future hint line. | Needs adapter |
| `qaTags` | QA/search tags | Current renderer does not consume tags. Useful for tests and data validation. | Docs-only |

Additional naming note:

- The earlier planning language mentioned `learnerPrompt` and `teacherHint`, while the committed fixture uses `functionText` and `learnerHint`, matching the current integration spec sample more closely.
- Before Phase B2, the team should lock one final naming convention. Recommendation: keep `functionText` and `learnerHint` unless a product-copy reason requires renaming.

## 3. Required Renderer Changes For Future Phase B2/C

Minimal changes are enough. A full renderer rewrite is not recommended.

Recommended thin adapter path:

1. Add a Sound Lab V2 adapter function outside the general render flow, for example:

```js
function adaptSoundLabV2ItemToChordSoundLab(item) {
  return {
    id: item.id,
    type: "chord-sound-lab",
    title: item.chordLabel,
    description: item.lessonContext,
    listenFor: [item.functionText, item.learnerHint],
    audioEngine: {
      model: "sound-lab-v2",
      voice: "guide-tone",
      durationMs: 1200
    },
    chords: [
      {
        id: item.id,
        chord: item.chordLabel,
        degree: item.functionLabel,
        role: item.guideToneLabel,
        theoryNote: item.theoryNote,
        playbackNote: item.playbackNote,
        playbackRule: item.playbackRule,
        notes: [item.theoryNote]
      }
    ]
  };
}
```

2. Add a narrow branch in `getLabPlaybackNotes(...)`:

- If `lab.audioEngine.model === "sound-lab-v2"` and `chord.playbackNote` exists, play `chord.playbackNote` directly after basic scientific-pitch validation.
- Do not pass Sound Lab V2 `playbackNote` through `normalizeAuditionPitch(...)`, because that function currently pushes A2/A3 to A4.
- Preserve the existing behavior for all current Month 1-6 Sound Labs.

3. Add a narrow branch in `getSoundLabGuideToneText(...)` or status metadata:

- Preserve the black LED display.
- Preserve the literal `GUIDE` label.
- Display the learner-facing theory/guide information clearly, for example `GUIDE E (3rd) · E3`.
- If `theoryNote !== playbackNote`, expose the adjustment in a secondary hint, not as a replacement for the theory note.

4. Keep one guide tone only:

- The adapter should produce one `chords[]` item per Sound Lab V2 fixture item.
- Each item should resolve to one `playbackNote`.
- Do not map one fixture item into stacked notes or an arpeggio sequence.

## 4. Audio Behavior Compatibility

B1 should not add Tone.js to production. The current Web Audio baseline can support the next compatibility step if the renderer receives a single `playbackNote`.

Current production audio behaviors to preserve:

- User gesture unlock before audio starts.
- `stopAllSounds()` and `stopOscillators()` before new playback.
- One active guide tone for Sound Lab V2.
- No autoplay.
- No stacked chords.
- No arpeggios.
- No production Tone.js dependency.

Future Sound Lab V2 audio requirements:

- Release active voice before triggering a new guide tone.
- Use `playSoundLabGuideTone(...)` or an approved equivalent single-tone voice.
- Keep the approved A2 -> A3 baseline.
- Do not change A2 -> A4 unless explicitly approved later.
- Keep raw diagnostic tests in the experiment only, not in learner-facing production UI.

## 5. Data Migration Strategy

Recommended phased path:

### Phase B1: Compatibility Report Only

Complete this document. No `outputs/*` edits.

### Phase B2: Mock Adapter Prototype Outside `outputs/*`

Create a small adapter prototype under an experiment or docs fixture area. It should prove that each B0 item can transform into the current `chordSoundLabs[]` shape without changing production data.

Acceptance for B2:

- Adapter output uses existing `chord-sound-lab` compatible structure.
- A2 -> A3 survives transformation.
- No item becomes a stacked chord.
- No item becomes an arpeggio.
- No Month 7-8 references appear.

### Phase B3: Approved Targeted Production Data Patch Only If Needed

Only after explicit approval, patch production data shards or `outputs/data.json` equivalent. The patch should be targeted, small, and reversible.

### Phase C: Preview Flag / Isolated Production Preview Only After Approval

Expose adapted Sound Lab V2 items behind a preview-only path first. Keep current Sound Lab baseline stable for normal users until QA passes.

## 6. Risks

- **Naming mismatch:** B0 fixture names do not match current renderer field names. Direct insertion would not render intended labels.
- **Playback octave mismatch:** Current `normalizeAuditionPitch(...)` shifts A2/A3 to A4. This conflicts with approved A2 -> A3 baseline.
- **Guide tone label mismatch:** Current black LED `GUIDE` line displays note strings, not semantic guide-tone labels like `E (3rd)`.
- **Old renderer assumptions:** Existing renderer expects `chords[]` or `notes[]`; B0 fixture uses one flat object per Sound Lab V2 item.
- **Mobile audibility:** A2 -> A3 is intentionally safer than raw A2, but still needs real-device QA before production reveal.
- **Accidental Month 7-8 exposure:** Future migration must keep visible month logic capped and must not add Month 7-8 content.
- **Accidental Tone.js dependency leak:** Tone.js remains spike-only. B2/B3 must not import it into production.
- **Copy encoding visibility:** Codepoint validation shows Thai codepoints are present in the fixture and shards, but Windows shell output may display Thai as mojibake. Any future editor/export process should preserve UTF-8.

## 7. Acceptance Checklist

- [x] No `outputs/*` edits were made during B1.
- [x] Month 1-6 remain live.
- [x] Month 7-8 remain hidden.
- [x] No production audio engine swap is recommended.
- [x] No Tone.js production dependency is recommended.
- [x] Current Sound Lab baseline remains stable.
- [x] Black LED display and `GUIDE` label are preserved in the recommendation.
- [x] Single guide tone only remains the Sound Lab V2 rule.

## Conclusion

The Phase B0 fixture is conceptually compatible with the production Sound Lab direction, but it is not directly compatible with the current renderer shape. The safe next step is a Phase B2 adapter prototype outside `outputs/*`.

The most important technical requirement for future implementation is a narrow Sound Lab V2 playback branch that honors `playbackNote` directly, so the approved A2 -> A3 baseline does not get unintentionally normalized to A4.
