# Phase 2 Approval

Approved integration scope:

## Audio behavior lock

- Keep A2 → A3 as the approved teaching playback baseline.
- Do not change A2 → A4.
- Keep raw A2 / A3 / A4 diagnostics.
- Keep sequential comparison only as one-note-at-a-time.
- Do not remove sequential comparison.
- Do not add stacked chords.
- Do not add arpeggios.
- Do not add autoplay.
- Keep Tone.js spike-only.
- Do not touch production files under `outputs/`.

## Required Risk / Guardrail cleanup

- Remove or reword any explicit reference to specific production files such as `outputs/app.js` from the experiment README.
- Keep the isolation warning, but phrase it generically, for example:
  - “This experiment is isolated from production.”
  - “Do not merge this prototype into the production Sound Lab without a separate integration spec and approval.”
- Do not name production file paths in student-facing or experiment README copy.

## Required UX / label cleanup

- Make the experiment page feel less like an engineering diagnostic panel and more like a beginner-safe Sound Lab listening test.
- Prefer Thai, private-teacher-style labels where reasonable.
- Approved label direction:
  - “ทดสอบเสียง Sound Lab”
  - “โน้ตที่กำลังเรียน”
  - “เสียงที่เปิดให้ฟัง”
  - “การปรับช่วงเสียง”
  - “สังเกตความชัด”
  - “เสียงต้นฉบับ”
  - “เสียงที่ปรับให้ฟังชัดขึ้น”
  - “เปรียบเทียบทีละเสียง”
- Avoid student-facing labels such as:
  - `AudioContext`
  - `Synth (Fallback)`
  - `Sampler Status`
  - `Normalization`
  - `RAW - Bypassed`
  - `Loudness Obs.`
  - `Min compare`
  - `Maj compare`
- Technical diagnostics may remain in comments or internal README sections if useful for QA, but should not dominate the visible UI.

## README cleanup

- Remove or rewrite future-facing wording that implies future Sound Lab V2 capabilities, especially wording like “Future Sound Lab V2 may compare...”
- Keep the approved concept:
  - “โน้ตที่เรียนยังเป็นตัวเดิม แต่เสียงที่เปิดให้ฟังอาจขยับ octave เพื่อให้ได้ยินชัดขึ้นบนมือถือ/ลำโพงเล็ก.”
- Keep the README clear that this is a spike / isolated experiment / not production-approved.

## Integrator task

- Patch only:
  - `experiments/sound-lab-tonejs-sampler/README.md`
  - `experiments/sound-lab-tonejs-sampler/index.html`
- Prefer copy/label/documentation changes over behavior changes.
- Do not change audio logic unless required to preserve one-active-tone behavior.
- Do not commit automatically.
