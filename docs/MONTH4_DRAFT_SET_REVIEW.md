# Month 4 Draft Set Review: Scale Atlas Foundation
Status: Historical Documentation / Superseded By Month 4 Production Reveal

## 1. Frozen & Approved Blueprints (สิ่งที่นิ่งและอนุมัติแล้ว)

- `MONTH4_WEEK13_DRAFT.md`: Pentatonic: The Skeleton and The Meat (1-3-5 vs 2-4-6-b7).
- `MONTH4_WEEK14_DRAFT.md`: The Blues Note & Phrasing (b5 Tension & Breathing).
- `MONTH4_WEEK15_DRAFT.md`: Major/Minor Pentatonic Color Switching (Call & Response).
- `MONTH4_WEEK16_DRAFT.md`: Scale Atlas Consolidation: The Melodic Gateway (Unified Capstone).

## 2. Mock-Data Planning Status (สถานะ Mock-Data ปัจจุบัน)

- Strict single-region scope locked (Root A on string 6 fret 5 / E-Shape area).
- No Box 2, 3, 4, 5 expansions allowed to prevent cognitive overload.
- Canonical IDs (`m4-w13-...` to `m4-w16-...`) are fully applied.
- Play By Ear thread integrated: `เล่น chord tones ได้ → เติม scale ได้ → phrasing ได้ → improvise ตามเพลงได้`.
- Historical note: this section describes the pre-implementation planning state. Month 4 has since been injected, QA'd, and revealed in normal production.
- Current production exposes Month 1-4 normally; Month 5-8 remain hidden.
- All Week 13-16 drafts preserve the private-teacher voice: slow, intentional, ear-led, and focused on musical expression rather than speed.

## 3. Renderer & Technical Dependencies (ช่องโหว่ทางเทคนิคที่ต้องสร้างเพิ่ม)

- **Responsive Fallback Engine:** The fretboard renderer must be able to gracefully degrade dense unified overlays (like the Week 16 Synthesis Map) into stacked vertical cards on <320px mobile viewports.
- **Audio Engine (`chordSoundLabs`):** Must fully support "Scientific Pitch Notation" with octave profiles (e.g., `A2`, `C#3`, `Eb3`) to correctly trigger Web Audio oscillator registers for the `ear-training-lab` sections.
- **Technique Drill Schema:** Native support for `{ "type": "technique-drill", "drillRef": "..." }` mapping to a root-level `techniqueDrills[]` array.
- **Chord-Tone Overlay Roles:** The fretboard renderer must support layered visual roles such as `skeleton-root`, `skeleton-fifth`, `color-third-major`, `color-third-minor`, `meat`, and `tension`.
- **Clean Mini-TAB Stability:** Month 4 tabs must remain mobile-safe, scroll inside their own card, and never create body-level horizontal overflow.
- **Backing Track Guardrail:** Any "Backing Track" or groove reference must mean internal Web Audio groove/drone or learner-provided external playback outside the app. No network audio, external `.mp3`, `.wav`, or media dependency should be added to production.
- **Daily Practice / Self-Check Compatibility:** Existing renderers must support Month 4's 20-minute structure: 15-minute core practice plus 5-minute root & color listening reflection.

## 4. Implementation Sequence (ลำดับขั้นก่อนสร้าง Real Data)

1. **Sandbox Prototyping:** Upgrade `prototypes/month3-engine-test/` (or create a new Month 4 sandbox) to test the stacked-card fallback logic and octave-profile audio parsing.
2. **Renderer Gap Check:** Verify that chord-tone overlays can show Skeleton, Meat, Major/Minor color points, and b5 Tension without overwhelming 320px mobile layouts.
3. **Audio Extension:** Extend the Web Audio preview layer to parse octave-profile pitch names such as `A2`, `C#3`, and `Eb3` reliably.
4. **Schema Validation:** Confirm that `techniqueDrills[]`, `miniTabs[]`, `fretboardVisuals[]`, and `chordSoundLabs[]` can hold all Month 4 assets without creating new root collection patterns unnecessarily.
5. **Data Translation:** Convert Week 13-16 MD drafts into valid JSON schema.
6. **Historical Silent Merge:** Month 4 data was later injected and tested before reveal.
7. **Historical QA & Reveal:** Month 4 has since passed controlled reveal and is visible in normal production. Preview parameters are legacy QA shortcuts / auto-open helpers only, not production gating.
