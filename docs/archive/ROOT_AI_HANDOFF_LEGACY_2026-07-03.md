# Archived Root AI_HANDOFF.md

This is an archived copy of the old root-level `AI_HANDOFF.md`.

It is preserved for historical reference only.

Canonical current AI handoff lives at:

- `../AI_HANDOFF.md`

Do not use this archive as the source of truth.

---

# AI Handoff

## Current State

Week 0 Prelude / Foundation Reset is public, and Month 1-4 are visible in normal production. Month 5-8 remain hidden. Month 3-4 are no longer preview-only; preview parameters such as `?preview=m3`, `?preview=m4`, `?devPreview=m3`, and `?devPreview=m4` are legacy QA shortcuts / auto-open helpers only, not production gating.

### 🛑 PROTOTYPE FREEZE NOTICE (MONTH 2)

* The directories `prototypes/month2-week5/`, `prototypes/month2-week6/`, `prototypes/month2-week7/`, and `prototypes/month2-week8/` are OFFICIALLY FROZEN.
* Do NOT modify any HTML, CSS, JS, or mock-data files inside these folders unless explicitly and specifically commanded by the user.
* These folders serve as the finalized reference implementations for the Fretboard Renderer (Orientation Rule v2: String 1 Top for both Fretboard and TAB) and the Web Audio API Chord Sound Lab.

Guitar Companion เป็น Thai-first personal guitar learning companion สำหรับผู้เรียนที่เคยเล่นกีตาร์มาแล้ว แต่อยากกลับมา rebuild fundamentals อย่างเป็นระบบ

Visible sections:

* Week 0 Prelude / Foundation Reset
* Dashboard
* Lessons
* Practice Lab

Visible weeks:

* Week 0 Foundation Reset (Prelude, not Month 0)
* Week 1 Pulse & 16th Grid
* Week 2 Syncopation
* Week 3 Dynamics & Palm Muting
* Week 4 Groove Integration
* Week 5-8 Fretboard Foundation
* Week 9-12 Chord Tone & Arpeggio Foundation
* Week 13-16 Scale Atlas Foundation

Do not expose Month 5-8 or future modules in the UI without an explicit task.

## Curriculum Source of Truth

มีเอกสาร roadmap หลักอยู่ที่:

* `CURRICULUM_ROADMAP.md`

เอกสารนี้บันทึกหลักสูตรระยะยาว 18-24 เดือน แต่เป็น documentation only ในตอนนี้

Core path:

Foundation Reset -> Rhythm -> Fretboard -> Scale -> Harmony -> Chord Progressions -> Blues Thread -> Fingerstyle -> Improvisation -> Style Applications

## Roadmap Notes

Week 0 Foundation Reset ถูกวางเป็น foundation gate สำหรับผู้เล่นที่เคยข้ามพื้นฐาน ไม่ใช่ beginner-only module

Week 0 ครอบคลุม:

* guitar orientation
* tuning
* clean note production
* picking / strumming mechanics
* muting basics
* chord diagram survival
* TAB survival
* fretboard survival
* practice method
* gear survival
* basic fingerpicking literacy
* first song challenge

Month 1 remains the default fresh-load Rhythm Foundation experience, while Month 1-4 are visible in normal production.

Future hidden roadmap includes:

* Month 5 Improvisation Foundation
* Month 6 Modes as Chord Colors
* Month 7-8 Blues path and later roadmap content
* Chord Colors Lab
* Blues Thread and Blues Core
* Fingerpicking / Fingerstyle
* Other Style Threads
* Improvisation
* Technique Lab

Blues ต้องเป็น recurring application thread ไม่ใช่การเปลี่ยนทั้งแอปให้เป็น blues-only course

## Current Lesson Direction

Month 1 lessons ควรพัฒนาไปทาง listen-see-play teaching

ทุก lesson ควรมี:

* What to hear
* What to feel
* Visual rhythm animation
* Practice exercise
* Quiz

เป้าหมายคือให้เว็บทำหน้าที่เหมือนครูสอนจังหวะ ไม่ใช่คู่มือให้อ่านอย่างเดียว

## Recent Work

* Created `CURRICULUM_ROADMAP.md`.
* Added documentation for Week 0 Foundation Reset.
* Added documentation for the long-term curriculum path.
* Clarified future hidden modules and roadmap guardrails.
* Updated current docs to reflect Week 0 public and Month 1-4 visible in normal production.
* Updated project handoff/state docs to align with the roadmap.
* Kept Month 1 as the default fresh-load experience.
* Designed Month 2 Data Shape and Renderer Specs (`MONTH2_DATA_SHAPE_SPEC.md` and `MONTH2_RENDERER_SPEC.md`).
* Completed the standalone Month 2 Fretboard Foundation prototype in `prototypes/month2-week5/`.
* Added responsive Fretboard Visualizer with physical guitar orientation notes, Clean Mini-TAB, and Collapsible 7-Day Practice Schedule components for Week 5.
* Kept the Month 2 prototypes frozen; Month 1-4 are now visible in normal production.

## Guardrails

### 🛑 PROTOTYPE FREEZE NOTICE (MONTH 2)

* The directories `prototypes/month2-week5/`, `prototypes/month2-week6/`, `prototypes/month2-week7/`, and `prototypes/month2-week8/` are OFFICIALLY FROZEN.
* Do NOT modify any HTML, CSS, JS, or mock-data files inside these folders unless explicitly and specifically commanded by the user.
* These folders serve as the finalized reference implementations for the Fretboard Renderer (Orientation Rule v2: String 1 Top for both Fretboard and TAB) and the Web Audio API Chord Sound Lab.

* Do not modify `outputs/index.html`, `outputs/app.js`, or `outputs/styles.css` unless the task explicitly asks for app changes.
* Do not show Month 5-8 or future roadmap modules.
* Do not expose future roadmap modules in the current UI.
* Do not add frameworks, packages, network dependencies, or build tools.
* Keep Thai copy natural, like a patient guitar teacher.
* Keep common musician terms in English when natural, such as Pulse, Groove, Syncopation, Palm Mute, Metronome, Backing Track, Accent และ Nashville Number System.
* Keep the product focused: private teacher, daily practice companion, personal practice room.
* Avoid LMS features, achievement systems, complex gamification, feature creep, dry theory encyclopedia style, and blues-only course structure.

## Next Suggested Check

Run post-release smoke checks for Week 0 and Month 1-4, then continue with spec-first future planning. Do not expose Month 5-8 during planning.
