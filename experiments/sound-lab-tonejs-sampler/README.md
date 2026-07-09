# ทดสอบเสียง Sound Lab (Tone.js Sampler Spike)

## How to run the experiment
Since this prototype loads external audio files via the Web Audio API, browser CORS policies require it to be served via an HTTP server.
1. Open a terminal at the project root.
2. Run `npm run serve`.
3. Open `http://127.0.0.1:5173/experiments/sound-lab-tonejs-sampler/` in your browser.

## Listening Test Statuses
The UI presents this spike as a beginner-safe Sound Lab listening test while still exposing enough status for QA:
- **ระบบเสียง**: Confirms whether the Tone.js library loaded correctly from CDN.
- **สถานะการเปิดเสียง**: Shows whether the browser has allowed audio to play after a user gesture.
- **เสียงทดสอบพื้นฐาน**: Confirms the basic oscillator is initialized before evaluating sampled sound.
- **เสียงตัวอย่าง**: Shows whether the external sample files are idle, loading, ready, or failed.
- **โน้ตที่กำลังเรียน / เสียงที่เปิดให้ฟัง**: Differentiates between the note being taught and the actual playback note.
- **การปรับช่วงเสียง**: Indicates whether the playback register has been shifted up.
- **สังเกตความชัด**: Highlights the risk of mobile speaker volume for the chosen playback note.

## Troubleshooting Steps if No Sound
1. **Did you start the sound system?** Mobile Safari and Chrome require explicit user interaction before audio can play.
2. **Does the short test sound work?** If this makes no sound, the device volume may be muted or the browser may not have allowed audio yet. Check the problem status field.
3. **Does the sample sound fail to load?** If the sample sound stays on "Loading..." or shows "Failed (Timeout)", open the browser's **DevTools Network tab** to see if the Salamander Grand Piano `.mp3` files are blocked by CORS, adblockers, or slow connections.
4. **Check the DevTools Console**: Look for red error text that might explain why Tone.js failed.

## Phase 1B / Phase 2 Approval: การปรับช่วงเสียงให้ฟังชัด
**Observed Issue:** The Phase 1 test revealed that low-register notes (e.g., `A2`) produce very little audible output on standard laptop and mobile phone speakers. Since Sound Lab is an educational tool, if a student cannot hear the root note clearly, the learning value is lost. 

**Approved Baseline:** The spike keeps separating the `theoryNote` (what the student sees) from the `playbackNote` (what the student hears). The approved Phase 2 test rule is that octave 2 teaching notes play back at octave 3. Example: A2 -> A3. Do not change A2 -> A4 unless a separate approval explicitly asks for it.

**Teaching Concept:** โน้ตที่เรียนยังเป็นตัวเดิม แต่เสียงที่เปิดให้ฟังอาจขยับ octave เพื่อให้ได้ยินชัดขึ้นบนมือถือ/ลำโพงเล็ก.

**Phase 2 Approval Lock:** Original A2 / A3 / A4 QA tests remain available. Sequential comparison is allowed only as an explicit one-note-at-a-time QA check. It must not become a stacked chord, a musical arpeggio pattern, or autoplay.

### Phase 1B QA Checklist
- [ ] **A2 เดิม is quieter than A4**: Playing A2 without octave adjustment is perceptibly quieter/muddier than A4 on laptop/phone speakers.
- [ ] **A2 -> A3 playback is clearer**: Bumping the playback register solves the volume/clarity issue immediately.
- [ ] **Sequential compare remains single-note only**: Triggering sequential playback releases the active voice before the next note and never stacks notes.
- [ ] **Mobile speaker loudness is acceptable**: The Phase 1B adjusted playback notes are loud and clear on physical devices.

**Integration Implication:** Any future integration spec should explicitly separate `theoryNote` from `playbackNote` in the curriculum data schema to preserve both educational accuracy and audible clarity.

**Experimental Audio Chain:** A Tone.Compressor and Tone.Limiter have been added to tame dynamics and boost presence. This is experimental and must be checked for clipping, fatigue, and mobile loudness.

## Phase 1 Manual QA PASS
**Observed Results:**
- **Local URL**: http://127.0.0.1:5173/experiments/sound-lab-tonejs-sampler/
- **Tone.js Script**: Loaded v14.8.49
- **สถานะการเปิดเสียง**: เปิดแล้ว
- **เสียงทดสอบพื้นฐาน**: พร้อม
- **เสียงตัวอย่าง**: พร้อม
- **ปัญหาล่าสุด**: ไม่มี
- Audible output confirmed

**Conclusion:**
Phase 1 proves that Tone.js, combined with a Synth fallback and Tone.Sampler, can successfully produce sound in this isolated prototype. Note that this is **not production approval yet**. Phase 2 should evaluate instrument tone, sample strategy, licensing, mobile loudness, and the approved Sound Lab guardrails before any integration is considered.

## Known limitations
- **CDN loading time**: The Salamander Grand Piano samples are loaded from the Tone.js GitHub CDN.
- **Strictly isolated**: This experiment is isolated from production. Do not merge this prototype into the production Sound Lab without a separate integration spec and approval.
