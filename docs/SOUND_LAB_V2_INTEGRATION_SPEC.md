# Sound Lab V2 Integration Spec

This document serves as the integration specification for upgrading the Guitar Companion Sound Lab to V2, based on the findings from the Tone.js Sampler Phase 2 spike.

## 1. Purpose
- Sound Lab V2 should teach **chord color**, **guide tone awareness**, and **harmonic function**.
- It must remain **beginner-safe** and feel like a **private guitar teacher**.

## 2. Non-negotiable Production Guardrails
- **Preserve black LED display** aesthetic.
- **Preserve `GUIDE` label** unless a later approved UI spec explicitly changes it.
- **Single guide tone only** per interaction.
- **No stacked chords.**
- **No arpeggios.**
- **No autoplay.** Audio must be triggered by explicit user gesture.
- **No hidden exposure** of Month 7–8 content.
- **No direct Tone.js production merge** from the spike. Integration must follow the phased approach outlined below.

## 3. Audio Model
- **Explicit Separation**:
  - `theoryNote`: what the learner sees and studies in the UI (e.g., A2).
  - `playbackNote`: what the audio engine actually plays (e.g., A3).
- **Approved Baseline**:
  - Octave 2 theory notes play back at Octave 3 to ensure audibility on mobile devices and small speakers.
  - Example: `theoryNote: "A2"` → `playbackNote: "A3"`.
- **Constraint**: Do not use A2 → A4 unless a future approval explicitly asks for it.

## 4. Data Schema Proposal
Draft schema example for a Sound Lab V2 item:

```json
{
  "id": "sl-m5-diatonic-guide-1",
  "chordLabel": "C Major",
  "guideToneLabel": "E (3rd)",
  "theoryNote": "E2",
  "playbackNote": "E3",
  "functionText": "โน้ต E คือคู่ 3 ของคอร์ด C ช่วยสร้างสีสันความสว่าง",
  "learnerHint": "ลองฟังเสียง E3 เพื่อให้ได้ยินชัดเจนขึ้น",
  "qaTags": ["diatonic", "major-3rd", "octave-adjusted"]
}
```

## 5. Audio Engine Integration Options
- **Keep current simple Web Audio / oscillator baseline**: Safest approach, lowest risk, 0 dependencies.
- **Introduce Tone.js later behind a preview flag**: Allows safe in-production testing without impacting the main learner experience.
- **Use sampler only after resolution**: Samplers should only be integrated once licensing, network constraints (no external CDNs), and offline strategies are fully resolved.

## 6. Fallback and Safety
- **User gesture unlock required** before any audio context starts.
- **One active voice at a time**.
- **Release active voice** (`releaseActiveVoices()`) before triggering a new tone.
- **Shared limiter / master gain** is recommended before production approval to prevent clipping.
- **Synth fallback** or local fallback is required if the sampler fails to load or connect.

## 7. UX Language Rules
Learner-facing Thai labels should be simple, encouraging, and non-technical:
- `โน้ตที่กำลังเรียน` (Theory Note)
- `เสียงที่เปิดให้ฟัง` (Playback Note)
- `ฟังทีละเสียง` (Sequential Compare)
- `เสียงที่ปรับให้ฟังชัดขึ้น` (Normalized/Octave-Adjusted Tone)

**Avoid engineering labels** in the production UI:
- AudioContext
- Sampler Status
- RAW - Bypassed
- Normalization

## 8. Implementation Phases
- **Phase A**: Docs/spec only (This document).
- **Phase B0**: Schema fixture / mock data outside `outputs/*`. No production data edit yet.
- **Phase B1**: Renderer compatibility review against the fixture/mock data.
- **Phase B2**: Approved targeted production data patch only. Any `outputs/data.json` change requires separate explicit approval.
- **Phase C**: Isolated production preview flag for engine testing.
- **Phase D**: Manual mobile QA (speaker, headphone, clipping tests).
- **Phase E**: Production integration only after explicit approval.

## 9. Acceptance Checklist
- [x] No `outputs/*` edits in this spec task.
- [x] Month 1–6 remain live.
- [x] Month 7–8 remain hidden.
- [x] Current Sound Lab baseline remains stable.
- [x] No Tone.js dependency enters production yet.
