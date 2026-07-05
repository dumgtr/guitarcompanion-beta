# Month 5 Content Specification: Diatonic Bridge & Melodic Freedom

**Status:** Drafting  
**Production Scope:** STRICTLY HIDDEN (Do not expose in UI, do not mutate `outputs/data.json`)  
**Architecture Rule:** Use existing Schema v3 renderers (`technique-drill`, `phrase-lab`, `ear-training-lab`). Do not create new root JSON collections.

## 🎯 Core Philosophy

Month 5 bridges the gap between the Pentatonic box (Month 4) and Modes as Chord Colors (Month 6). It combines **Diatonic Harmony** (knowing the chords) with **Improvisation Mechanics** (phrasing, space, bending).

## 📅 Week-by-Week Blueprint (Weeks 17–20)

### Week 17: Meet the Family & Space

- **Harmony Focus:** The Diatonic Triads (I, ii, iii, IV, V, vi, vii°). Why some are major and some are minor.
- **Improv Focus:** Motif repetition and deliberate silence (Space).
- **Renderer:** `fretboardVisuals` showing the 1-3-5 chord tones inside the scale shape.

### Week 18: Core Progression & Call/Response

- **Harmony Focus:** The pop/rock engine: I–IV–V–vi.
- **Improv Focus:** Conversational soloing (Call & Response) over a Web Audio chord loop.
- **Renderer:** `chordSoundLabs` with a looping I-IV-V-vi progression and target note visuals.

### Week 19: The 90s Secret (Pedal Tones & Pitch)

- **Harmony Focus:** Common Tone Magic. Holding the top strings (e.g., G and D notes) while moving the bass to create `Cadd9`, `Em7`, and `Dsus4` (Silly Fools / Oasis style).
- **Improv Focus:** Target pitch bending and vibrato over these color chords.
- **Renderer:** `miniTabs` showing the locked-finger chord shapes + `phrase-lab` for bending accuracy.

### Week 20: 8-Bar Solo Builder (Capstone)

- **Focus:** Combine rhythm (playing the changes) with lead (target notes). Build a structured 8-bar solo over the Diatonic Bridge.
- **Renderer:** `technique-drill` mapping out a structured 20-minute daily practice routine.

## 🔒 Open Decisions Resolved for Month 5

- **Data Architecture:** Future mock data will use per-content-pack assets (standard `m5-w17-xxx` ID prefixes) inside existing root collections (`weeks`, `fretboardVisuals`, `miniTabs`, `techniqueDrills`, `chordSoundLabs`). No new root collections.
- **Prototyping vs Mock Data:** We will write full JSON mock data drafts next, reusing Month 4's engine. No new prototype sandbox is needed yet.

## 🚫 Not for Implementation Yet

This file is a planning specification only. It does not authorize changes to `outputs/data.json`, app code, production visibility, Month Switcher behavior, or renderer architecture.
