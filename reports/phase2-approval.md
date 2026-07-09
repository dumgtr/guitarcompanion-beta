# Phase 2 Integration Approval

## Audio Baseline Approval
- **Approved Baseline:** Use `A2 -> A3` normalization.
- **DENIED:** Do NOT use `A2 -> A4`.
- **DENIED:** Do NOT use arpeggios.
- **DENIED:** Do NOT use stacked chords.
- **Approved Feature:** Keep sequential compare as currently implemented. Do NOT remove sequential comparison.

## UX & Labeling Approval
- Approved to change diagnostic terminology in UI to beginner-friendly Thai language, based on the UX Review recommendations:
  - `Audio Diagnostics` -> `ทดสอบเสียง Sound Lab`
  - `Theory Note` -> `โน้ตที่กำลังเรียน`
  - `Playback Note` / `Audition Note` -> `เสียงที่เปิดให้ฟัง`
  - `Normalization` -> `ปรับ octave ให้ฟังชัด`
  - `Loudness Obs.` -> `ความชัดของเสียง`
  - `Unlock Audio Context` -> `เริ่มระบบเสียง`
  - `Test Beep (Synth)` -> `ลองเสียงสั้นๆ`
  - `Group A: Raw Low-Register Test` -> `ฟังโน้ตต่ำแบบเดิม`
  - `Group B: Normalized Sound Lab Test` -> `ฟังโน้ตที่ปรับให้ชัดขึ้น`
  - `RAW - Bypassed` -> `เสียงเดิม ไม่ปรับ octave`
  - `Min compare` / `Maj compare` -> `เทียบเสียงทีละโน้ต`

## Future Capability Guardrails
- **DENIED:** Remove or rewrite any hints at future Sound Lab V2 capabilities (e.g., "Future Sound Lab V2 may compare...") from student-facing text or `README.md`.
- **DENIED:** Do not expose Month 5 or Month 7-8 language.

**Authorized By:** Product Owner (ผ่านระบบ Orchestrator)
**Date:** 2026-07-09
