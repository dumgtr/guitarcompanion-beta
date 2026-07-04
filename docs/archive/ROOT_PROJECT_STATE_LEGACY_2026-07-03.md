# Archived Root PROJECT_STATE.md

This is an archived copy of the old root-level `PROJECT_STATE.md`.

It is preserved for historical reference only.

Canonical current project state lives at:

- `../PROJECT_STATE.md`

Do not use this archive as the source of truth.

---

# Guitar Companion Project State

## Current Version

Month 1-4 Production Visible / Week 0 Public

## Product Vision

Guitar Companion คือ personal guitar learning companion ภาษาไทยเป็นหลัก สำหรับผู้เรียนที่เคยเล่นกีตาร์มาแล้ว แต่อยากกลับมา rebuild fundamentals อย่างเป็นระบบ

แอปควรรู้สึกเหมือน:

* private guitar teacher
* daily practice companion
* personal practice room
* guided guitar journey

ไม่ใช่ LMS, marketplace หรือ music theory encyclopedia

## Current Visible Scope

Current production scope:

* Week 0 Prelude / Foundation Reset is public on normal load.
* Month 1 is still the default fresh-load experience.
* Month 1-4 are visible in normal production through the main-content Month Switcher.
* Month 5-8 remain hidden.
* Preview parameters such as `?preview=m3`, `?preview=m4`, `?devPreview=m3`, and `?devPreview=m4` are legacy QA shortcuts / auto-open helpers only; they are not the current production visibility gate.

Visible Month 1 weeks:

* Week 1 Pulse & 16th Grid
* Week 2 Syncopation
* Week 3 Dynamics & Palm Muting
* Week 4 Groove Integration

Visible Month 2 weeks through controlled switcher:

* Week 5 Root & Landmarks
* Week 6 Octave Shapes
* Week 7 Major Scale Formula / Scale Degrees
* Week 8 Play by Form Seed & Chord Sound Lab

Weeks 9-16 are visible as Month 3-4 production content. Month 5-8 and future modules remain hidden until an explicit scope change.

## Current UI Direction

Main experience:

* Dashboard
* Lessons
* Practice Lab

Metronome อยู่ใน top navigation แล้ว

Practice Lab ต้องยัง compact และ minimal:

* Practice Notes
* Progress Tracking

Lessons ควรสอนเหมือนครูกีตาร์ไทยที่ใจเย็น ไม่ใช่แค่ list concept

## Current Lesson Direction

Month 1 lesson experience ควรขยับจาก “คู่มืออ่าน” ไปเป็น “ครูสอนจังหวะ”

ทุก lesson ควรเน้น:

* What to hear
* What to feel
* Visual rhythm animation
* Practice exercise
* Quiz

ผู้เรียนไม่ควรต้องจินตนาการ rhythm เอง แอปควรช่วย demonstrate rhythm ให้เห็นและเข้าใจง่าย

## Curriculum Source of Truth

เอกสารหลักสูตรระยะยาวอยู่ที่:

* `CURRICULUM_ROADMAP.md`

Roadmap นี้เป็น documentation เท่านั้น ยังไม่ใช่สิ่งที่ต้องแสดงทั้งหมดในหน้าแอป

Core long-term path:

1. Foundation Reset
2. Rhythm
3. Fretboard
4. Scale
5. Harmony
6. Chord Progressions
7. Blues Thread
8. Fingerstyle
9. Improvisation
10. Style Applications

หลักสูตรสามารถเป็น open-ended path ระยะ 18-24 เดือน หรือประมาณ 2 ปีได้

## Roadmap Summary

### Week 0: Foundation Reset

Foundation gate สำหรับผู้เล่นที่เคยข้ามพื้นฐาน ไม่ใช่ beginner-only module

ครอบคลุม guitar orientation, tuning, clean note production, picking / strumming mechanics, muting basics, chord diagram, TAB, fretboard survival, practice method, gear survival, basic fingerpicking literacy และ first song challenge

### Month 1: Rhythm Foundation

ยังเป็น visible scope ปัจจุบัน

เน้น Pulse, 16th Grid, Syncopation, Dynamics, Palm Muting และ Groove Integration พร้อม daily self-check, troubleshooting, BPM targets, rhythm grids, rhythm ear training และ mini song application

### Month 2: Fretboard Foundation

Month 2 is no longer future hidden scope. Month 2 Controlled Launch is implemented and available through the main-content Month Switcher.

Week 5-8 render in production:

* Week 5 Root & Landmarks
* Week 6 Octave Shapes
* Week 7 Major Scale Formula / Scale Degrees
* Week 8 Play by Form Seed & Chord Sound Lab

Month 2 uses root-level `fretboardVisuals`, `miniTabs`, and `chordSoundLabs` from `outputs/data.json`.

เน้น note names, root awareness, octave shapes, fretboard landmarks, movable patterns และ root tracking สำหรับ key blues พื้นฐาน เช่น A, E, D, G

### Scale Handbook / Scale Atlas

เป็น future book-like module สำหรับสอน scale ตั้งแต่วิธีอ่าน diagram ไปจนถึงการใช้ scale กับ Backing Track, phrase, target notes, space และ motifs

Core scales:

* Major Scale
* Minor Pentatonic
* Major Pentatonic
* Blues Scale
* Natural Minor

### Month 3: Chord Tone & Arpeggio Foundation

Visible in normal production as Month 3.

เน้น Roman Numerals, Nashville Number System, common chord progressions, song analysis และ Circle of Fifths แบบ practical

### Chord Colors Lab

วางหลัง Month 3: Chord Tone & Arpeggio Foundation เพื่อสอน maj7, m7, 6, add9, add11, sus, open voicings และ voice leading basics

### Blues Thread and Blues Core

Blues เป็น recurring application thread ตลอดหลักสูตร ไม่ใช่การเปลี่ยนทั้งคอร์สให้เป็น blues-only course

ใช้ blues กับ rhythm, fretboard, harmony, scales, improvisation และ technique แล้วค่อยมี Dedicated Blues Core module ภายหลัง

### Fingerpicking / Fingerstyle

วางเป็น layers ตั้งแต่ Week 0 จนถึง full Fingerstyle Foundation

เป้าหมายคือให้เข้าใจว่า fingerstyle ทำให้กีตาร์ตัวเดียวเล่น bass, chord, melody และ rhythm ได้

### Other Style Threads

ใช้เป็น application threads ไม่ใช่ full course ตั้งแต่ต้น:

* Rock / Classic Rock
* Funk / R&B
* Folk / Acoustic Pop
* Country
* Soul / Gospel
* Jazz-lite

### Improvisation

วางหลัง fretboard, scale, harmony และ blues basics

สอนว่า improvisation คือ real-time composition ไม่ใช่ random scale running

### Technique Lab

แยกจาก main roadmap เพื่อไม่ให้หลักสูตรหลักกลายเป็นแค่แบบฝึกนิ้ว

เน้น chromatic exercise, spider exercise, finger independence, alternate picking, string crossing, basic speed control และ muting drills

## Things We Intentionally Avoid

* LMS features
* Achievement systems
* Complex gamification
* Feature creep
* Theory encyclopedia style
* Blues-only course structure
* Showing future modules before the visible scope changes

## Recently Completed

* Month 2 Controlled Launch is now Stable Candidate.
* Final manual QA passed on desktop and mobile.
* Month 1-4 are visible in normal production.
* Month 2 Controlled Launch is implemented and stabilized as Month 2 Launch Stable.
* Month 2 opens through main-content Month Switcher.
* Week 5-8 render in production.
* Frozen prototypes remain untouched.
* Month 3: Chord Tone & Arpeggio Foundation is visible in normal production.
* Mobile portrait overflow fix completed for dashboard text, mission pills, Month Switcher, and lesson tabs.
* Compact Journey Timeline completed to reduce duplicate week navigation.
* Fretboard inlays at frets 3, 5, 7, 9, and 12 completed for Month 2 visuals.
* Month 2 Launch QA doc completed (`docs/MONTH2_LAUNCH_QA.md`).
* Stealth-merged the Month 2 Fretboard Foundation rendering engines into the main app (`outputs/app.js` and `styles.css`).
* Activated Month 2 through a controlled main-content switcher while preserving Month 1 as the default Rhythm experience.
* Successfully built, tested, and FROZE Month 2 Prototypes (Weeks 5-8: Fretboard Foundation).
* Finalized Month 2 Orientation Rule v2: Fretboard visualizer and Mini-TAB both strictly render String 1 (High e) at the top and String 6 (Low E) at the bottom to prevent cognitive dissonance.
* Successfully implemented a lightweight Web Audio API Chord Sound Lab for ear previewing (I-IV-V-I) without external MP3s.
* Created `CURRICULUM_ROADMAP.md` as the curriculum source of truth.
* Documented Week 0 Foundation Reset.
* Documented the long-term 18-24 month curriculum path.
* Clarified that Blues is a recurring application thread, not the whole course.
* Kept Month 1 as the default fresh-load app scope.
* Preserved the rule that future modules stay hidden from the app UI.
* Designed Month 2 Data Shape and Renderer Specs (`MONTH2_DATA_SHAPE_SPEC.md` and `MONTH2_RENDERER_SPEC.md`).
* Built standalone Month 2 Week 5 Prototype (`prototypes/month2-week5/`).
* Implemented responsive CSS-grid Fretboard Visualizer and later standardized Month 2 prototypes to Orientation Rule v2 (String 1 on top for both Fretboard and TAB).
* Implemented mobile-safe Clean Mini-TAB component with exact monospace lyric alignment.
* Implemented Collapsible 7-Day Practice Schedule UI.

## Next Recommended Task

Run post-release smoke checks for Week 0 and Month 1-4 before planning the next explicitly scoped task. Do not expose Month 5-8 during planning.

## Future Plan

1. Keep Month 1 as the default fresh-load experience while Month 1-4 remain visible in production.
2. Use `CURRICULUM_ROADMAP.md` before planning new lessons or modules.
3. Treat Week 0 as public Foundation Reset / Prelude, not Month 0.
4. Run post-release smoke checks before any new scoped feature.
5. Plan Month 5 or Mini Course Shelf as spec-first only; do not expose Month 5-8.
6. Continue tightening Thai lesson copy so it feels like a real private guitar teacher.
7. Prefer small iterative updates over broad rewrites.
