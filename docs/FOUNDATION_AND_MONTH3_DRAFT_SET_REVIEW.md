# Foundation and Month 3 Draft Set Review
Status: Historical Documentation / Superseded By Month 3 Production Reveal

## 1. Stable Drafts & Approved Planning Docs (ดราฟต์ที่นิ่งแล้วและเอกสารแผนที่อนุมัติแล้ว)

- `MONTH3_TO_MONTH6_BLUEPRINT.md`: The overarching curriculum path up to Month 6.
  - Defines the learning arc from Chord Tone & Arpeggio Foundation through Modes as Chord Colors.
  - Keeps Month 3 focused on chord tones, arpeggio motion, 7th color, and practical targeting.
- `MONTH3_CONTENT_PACK_PLAN.md`: The strategic plan for Month 3.
  - Establishes Month 3 as `Chord Tone & Arpeggio Foundation`.
  - Historical note: this plan originally kept Month 3 hidden until launch. Current production now exposes Month 3 normally.
- `WEEK0_RHYTHM_BASICS_DRAFT.md`: Foundation reset for rhythm vocabulary.
  - Defines Week 0 as a Foundation / Prelude onboarding module, not a visible Month 0 navigation tab.
  - Covers Beat, Tempo, Bar, 4/4, Downbeat, Upbeat, Downstroke, and Upstroke using physical practice.
- `MONTH3_WEEK9_DRAFT.md`: Triad Foundations & The 1-3-5.
  - Anchors the learner in C, F, and G triad tones.
  - Uses C minor only as a quick contrast for how the 3rd changes color.
- `MONTH3_WEEK10_DRAFT.md`: Chord Quality + Arpeggio as Chord Tones in Motion.
  - Keeps arpeggio teaching calm and non-shred: chord tones in motion, not speed technique.
  - Limits shape scope to A-Shape and E-Shape only.
- `MONTH3_WEEK11_DRAFT.md`: 7th Chords & Blues Flavor.
  - Introduces 1-3-5-7 using Major 7, Minor 7, and Dominant 7 colors.
  - Routes ear comparison through the existing `chordSoundLabs` architecture.
- `MONTH3_WEEK12_DRAFT.md`: Voice Leading & Chord Tone Targeting (Capstone).
  - Synthesizes Week 9-11 into practical targeting over C-F-G-C.
  - Confirms target 3rds A, B, and E landing on Beat 1 of the next bar.

## 2. Mock-Data Planning Status (สถานะ Mock-Data ปัจจุบัน)

- Historical note: this section describes the pre-implementation planning state.
- Strict canonical IDs (`w0-rhythm-...`, `m3-w9-...`, `m3-w12-...`) have been applied.
- Month 3 has since been translated into production data and is visible in normal production.
- Current production scope exposes Week 0 and Month 1-4; Month 5-8 remain hidden.
- Week 0 is intentionally treated as Foundation / Prelude onboarding, not as a normal month in the curriculum switcher.
- Month 3 guardrails are consistent across the draft set:
  - no full CAGED system,
  - no sweep picking or speed/shred arpeggio framing,
  - no advanced jazz extensions,
  - no chord-scale theory,
  - Month 3 is now exposed only as the controlled production Month 3 path, not as Month 0 or a side module.

## 3. Renderer & Technical Gaps (ช่องโหว่ทางเทคนิคที่ต้องสร้างเพิ่ม)

List the specific UI and engine requirements discovered during the drafting phase that need to be built before launch:

- **Fretboard Engine:** Must support `fret: 0` (open strings), stacked vertical rendering (no complex tabs), `chord-tone-overlay`, and `interval-map`.
  - Month 3 needs open-string chord tone maps for open C, Am7, G7, and related comfortable shapes.
  - The renderer must clearly distinguish Root, 3rd, 5th, 7th, target notes, and from-chord vs next-chord tones.
  - The visual system should stay mobile-safe: one stacked card per map, no multi-panel layout that creates horizontal page overflow.
- **Audio Engine (chordSoundLabs):** Needs to handle `type: "ear-training-lab"` and `type: "progression-lab"` (specifically looping C-F-G-C at 70 BPM).
  - Week 10 and Week 11 need chord-quality comparison without creating a separate audio subsystem.
  - Week 12 needs a progression preview that can communicate target timing over C-F-G-C.
  - If Web Audio fails, every lab must degrade to text instructions and real-guitar practice prompts.
- **Block Types:** Need fallback strategies or new renderers for `technique-drill`, `mechanics-check`, and ensuring `daily-practice` / `self-check` handle session state properly for new weeks.
  - `technique-drill` should support short setup, step list, warnings, and pass criteria.
  - `mechanics-check` should render as a quick checklist with warning signs and fixes.
  - `daily-practice` should support grouped practice days and nested tasks without breaking progress counts.
  - `self-check` should support reflection questions, practical criteria, and future multiple-choice checks if needed.
- **UI Navigation:** Week 0 must be implemented as a Prelude/Onboarding view, NOT as a "Month 0" tab in the main navigation.
  - Week 0 should not appear beside Month 1 and Month 2 in the main Month Switcher.
  - Current placement: public Foundation Reset entry card, still not a Month 0 tab.
  - Month 3 is now visible in normal production; Month 5-8 remain hidden.

## 4. Implementation Sequence (ลำดับขั้นก่อนสร้าง Real Data และ Launch)

Outline the step-by-step path for when we actually implement Month 3:

1. **Renderer Prototyping:** Build and test the missing visual blocks (`chord-tone-overlay`, `interval-map`) in an isolated environment.
   - Start outside production, similar to the Month 2 prototype process.
   - Verify open strings (`fret: 0`) render cleanly and remain readable on 320px mobile.
   - Confirm Month 2 Orientation Rule v2 remains consistent: String 1 / High e on top, String 6 / Low E on bottom.
2. **Audio Extension:** Upgrade `chordSoundLabs` to support the Week 12 progression loop and ear training previews.
   - Add support for `type: "ear-training-lab"` using existing Web Audio chord preview behavior.
   - Add support for `type: "progression-lab"` with slow C-F-G-C looping at 70 BPM.
   - Keep audio simple and reliable; no external files and no virtual guitar simulator.
3. **Data Translation:** Convert the MD drafts into actual JS/JSON objects with proper asset structures.
   - Convert Week 0 and Month 3 drafts into schema-compatible data.
   - Keep IDs exactly aligned with the docs.
   - Centralize reusable assets such as fretboard visuals, chord sound labs, technique drills, and mini tab patterns.
4. **Historical Silent Merge:** Month 3 data was later injected and tested before reveal.
   - Month 1 still opens by default on clean origin.
   - Week 0 remains Prelude / Foundation Reset, not Month 0.
   - Month 5-8 remain hidden.
5. **Historical QA & Reveal:** Month 3 has since passed controlled reveal and is visible in normal production.
   - Preview parameters are legacy QA shortcuts / auto-open helpers only, not production gating.
   - Current reveal policy: Month 1-4 visible, Month 5-8 hidden.

## 5. Immediate Next Decision (ข้อสรุปก่อนเดินหน้า Month 4)

- Decide whether to prototype Month 3 renderers first or continue drafting Month 4 content before implementation.
- Recommended path: prototype the missing Month 3 renderer blocks before creating Month 4 detailed drafts.
- Reason: Month 4 will depend heavily on scale maps, picking drills, and likely the same visual/audio architecture. Stabilizing Month 3 renderer gaps first will reduce rework.

## 6. Milestone Conclusion

Foundation and Month 3 are now part of the completed path into the current production phase. Current production exposes Week 0 and Month 1-4, while Month 5-8 remain hidden until an explicit future reveal task.
