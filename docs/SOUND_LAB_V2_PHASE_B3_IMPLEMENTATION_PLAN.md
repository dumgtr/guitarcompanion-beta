# Sound Lab V2 Phase B3 Implementation Plan

Status: Documentation / Future Implementation Plan Only

This document defines the narrowest safe path for a later approved Sound Lab V2 production integration. It does not patch production code, production data, audio behavior, or public visibility.

## 1. Purpose

Phase B3 should prepare the smallest possible approved production change after the Phase B0 fixture, Phase B1 renderer compatibility review, and Phase B2 adapter prototype.

Goals:

- Integrate Sound Lab V2 data later without changing normal-user Sound Lab behavior by default.
- Preserve the current production Sound Lab baseline for all existing labs.
- Avoid a renderer rewrite.
- Preserve the approved A2 -> A3 playback baseline.
- Keep Tone.js spike-only.
- Keep Month 7-8 hidden.

This plan assumes Sound Lab V2 starts as a preview-only path before any normal production exposure.

## 2. Current Blockers From B1/B2

Known blockers:

- Current production Sound Lab may normalize low audition notes to octave 4.
- Sound Lab V2 requires honoring `playbackNote` directly.
- Current renderer expects `chords[]` or `notes[]`, while the B0 fixture starts from flat V2 items.
- The semantic guide tone label, such as `E (3rd)`, needs a display mapping.
- The current black LED `GUIDE` line displays played notes, not yet both semantic label and theory/playback note context.

Validated B2 result:

- The adapter can transform all five B0 fixture items into current `chord-sound-lab` style objects.
- The adapter preserves `theoryNote: "A2"` and `playbackNote: "A3"`.
- The adapter creates one `chords[]` item per fixture item.
- The adapter creates one playback note only.
- The adapter does not create stacked chords, arpeggios, autoplay behavior, or Tone.js dependency.

## 3. Proposed Minimal Production Changes For Future Approved Patch

The future patch should be narrow and targeted.

### 3.1 Add A V2 Data Path

Use either pre-adapted data or a small adapter path to produce current-compatible lab objects:

```js
{
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
      guideToneLabel: item.guideToneLabel,
      notes: [item.theoryNote],
      auditionNote: item.playbackNote
    }
  ]
}
```

### 3.2 Add A Narrow Renderer Branch

Add a branch only for Sound Lab V2 labs:

- If `lab.audioEngine.model === "sound-lab-v2"` and `chord.playbackNote` exists, play `chord.playbackNote` directly.
- Do not pass V2 `playbackNote` or V2 compatibility `auditionNote` through the old low-note-to-A4 normalization path.
- Preserve old normalization for non-V2 labs.
- Preserve all existing Sound Lab behavior for Month 1-6 labs that are not marked as V2.

### 3.3 Preserve The Current Sound Lab Display

Do not redesign the Sound Lab UI in this phase.

Required display behavior:

- Preserve the black LED display.
- Preserve the literal `GUIDE` label.
- Show semantic guide tone label safely, for example:

```text
GUIDE E (3rd) - E3
```

If `theoryNote !== playbackNote`, show the adjustment as teacher-support copy or a subtle secondary line, not as a replacement for the theory note.

### 3.4 Preserve Single Guide Tone Only

The V2 path must not create:

- stacked chords;
- arpeggio patterns;
- autoplay;
- multiple active playback notes per click.

## 4. Data Strategy Options

### Option A: Keep Adapter Outside Production And Manually Copy Pre-Adapted Output Later

Summary:

- Continue using the B2 adapter outside production.
- Generate pre-adapted `chordSoundLabs[]` data.
- Copy only approved adapted objects into the relevant production shard during an explicit production data patch.

Pros:

- Smallest renderer/data risk.
- Easy to inspect data before patch.
- No runtime adapter complexity.
- Keeps V2 source fixture as a review artifact.

Cons:

- Manual copy process can drift from fixture if not documented.
- Later V2 item updates require rerunning the adapter outside production.

### Option B: Add Adapter Function Into Production Renderer Later

Summary:

- Store V2-native items or mixed V2 items.
- Add a production adapter function that converts V2 items at runtime.

Pros:

- Keeps source data closer to V2 schema.
- Reduces manual pre-adapt step over time.

Cons:

- Adds runtime branching.
- Higher risk of affecting existing render flow if not isolated carefully.
- Needs more QA surface.

### Option C: Store V2-Native Items And Adapt At Runtime Behind Preview Flag

Summary:

- Add V2-native data to a preview-only namespace.
- Adapt at runtime only when preview is active.

Pros:

- Best long-term shape if Sound Lab V2 becomes a larger system.
- Clean separation between current labs and V2 labs.

Cons:

- More infrastructure than needed for the first five items.
- Requires careful preview gating and migration rules.

### Recommendation

Use **Option A** for the next approved implementation phase.

Rationale:

- It is the smallest safe step.
- It avoids a broad renderer rewrite.
- It lets reviewers inspect exact production-ready `chord-sound-lab` objects before any production patch.
- It keeps runtime behavior stable except for one narrow V2 playback branch needed to honor `playbackNote` directly.

## 5. Preview Strategy

The first production integration must be preview-only.

Rules:

- Do not expose Sound Lab V2 to normal production users immediately.
- Use existing Month 5/6 context only.
- Do not expose Month 7-8.
- Do not change Month Switcher visibility rules.
- Do not change existing Sound Labs unless explicitly testing the V2 preview item.
- Keep preview labels internal/QA-safe.

Recommended preview gate:

- Use an explicit query parameter or existing dev preview pattern.
- Load only the approved adapted Sound Lab V2 objects.
- Ensure preview removal returns the app to the current baseline.

## 6. QA Plan

Required devices/browsers:

- Desktop Chrome.
- Mobile Chrome.
- Safari/iOS if available.
- Speaker and headphone checks.

Required tests:

- A2 -> A3 verification.
- Confirm no A2 -> A4 playback for V2 `playbackNote`.
- One active voice at a time.
- Stop button stops the current guide tone.
- No autoplay.
- No stacked chords.
- No arpeggios.
- Existing non-V2 Sound Labs still work.
- Existing Month 5 and Month 6 Sound Labs still work.
- Black LED display remains readable.
- `GUIDE` label remains visible.
- Preview gate hides V2 items when the preview URL is removed.
- Month 7-8 remain hidden.
- No console errors from V2 preview.
- No Tone.js production dependency.

Audio spot checks:

- Compare raw theory note display with playback note behavior.
- Verify A2 appears as the studied note while A3 is the heard note.
- Test on laptop speakers where low A2 may be weak.
- Test on headphones for clipping, harshness, or overly quiet playback.

## 7. Rollback Plan

Rollback should be simple and targeted.

Steps:

1. Revert the future targeted production commit.
2. Remove the V2 preview gate and adapted V2 lab data.
3. Confirm existing Sound Labs still render.
4. Confirm Month 1-6 remain live.
5. Confirm Month 7-8 remain hidden.

No localStorage migration should be required unless a later implementation adds user state. The recommended V2 preview should not create persistent progress state.

## 8. Acceptance Criteria For Future Production Patch

The future production patch must satisfy all of these:

- No normal-user behavior change without explicit approval.
- A2 -> A3 is preserved.
- V2 `playbackNote` is not passed through old A4 normalization.
- Existing labs are unaffected.
- Existing Stop button behavior still works.
- One active voice only.
- Month 1-6 remain live.
- Month 7-8 remain hidden.
- No Tone.js dependency.
- No production sampler.
- No stacked chords.
- No arpeggios.
- No autoplay.
- Black LED display remains intact.
- Literal `GUIDE` label remains intact.
- Preview removal restores baseline behavior.

## 9. Explicit Non-Goals

Phase B3 does not include:

- Tone.js production integration.
- Production sampler integration.
- Full Sound Lab redesign.
- New lesson content.
- Month 7/8 exposure.
- UI redesign outside Sound Lab V2 preview.
- Broad renderer rewrite.
- Production data patch without explicit approval.
- LocalStorage/state migration.

## Recommended Next Implementation Phase

Next step after approval:

```text
Phase C0: Preview-only targeted production plan and patch scope approval.
```

That phase should define exact files, exact data objects, preview gate behavior, and rollback commands before any `outputs/*` edit happens.
