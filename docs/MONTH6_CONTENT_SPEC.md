# Month 6 Content Specification: Modes as Chord Colors

**Status:** Drafting  
**Production Scope:** STRICTLY HIDDEN (Do not expose in UI, do not mutate `outputs/data.json`)  
**Architecture Rule:** Use existing Schema v3 renderers only. Do not create new root JSON collections.

## 🎯 Core Philosophy

Month 6 teaches modes as usable chord colors, not as a seven-mode theory encyclopedia. The learner should hear how one or two color notes change the emotional character of a chord or vamp.

Month 6 continues from Month 5:
- Month 5 connected Pentatonic, Diatonic Harmony, I-IV-V-vi, common tones, and melodic phrasing.
- Month 6 asks: “What color does this chord want, and which note makes that color clear?”

Important framing:
- Month 6 is Mode Awareness, not Mode Mastery.
- Do not teach modes as “start the major scale from a different note.”
- Teach modes through chord/vamp color, ear, and short phrases.
- Dorian and Mixolydian are priority modes for the Bluesman path.
- Lydian is introduced as a bright/floating color study.
- Locrian is reference-only and not a practice focus.

## 📅 Week-by-Week Blueprint (Weeks 21–24)

### Week 21: What Modes Really Mean

- **Theme:** Mode = chord color, not a new scale box.
- **Core Focus:** Compare major scale color against modal color using the same tonic/drone.
- **Main Ear Idea:** Hear how one color note changes the emotional feel.
- **Priority Concepts:** tonic, drone, pitch axis, color note, resolution.
- **Renderer Mapping:** Future implementation may use `drone-practice`, `mode-color-lab`, `ear-training-lab`, and text-first fallbacks.

### Week 22: Dorian & Mixolydian for Blues/Rock/Funk

- **Theme:** The two most useful modal colors for the Bluesman path.
- **Dorian Focus:** Minor sound with a brighter natural 6.
- **Mixolydian Focus:** Dominant/blues-rock sound with b7.
- **Main Ear Idea:** Dorian feels like minor with lift; Mixolydian feels bluesy/dominant and wants to resolve.
- **Renderer Mapping:** Future implementation may use `mode-color-lab`, `chordSoundLabs`, `phrase-lab`, and `miniTabs`.

### Week 23: Lydian as Floating Major Color

- **Theme:** Bright major color with lift and air.
- **Lydian Focus:** Major sound with #4.
- **Main Ear Idea:** Lydian feels open, floating, cinematic, or dreamy.
- **Guardrail:** Keep Lydian as a color study. Do not turn Week 23 into a full modal encyclopedia.
- **Renderer Mapping:** Future implementation may use `drone-practice`, `mode-color-lab`, `interval-map`, and text-first fallbacks.

### Week 24: Mode Application Lab

- **Theme:** Color note -> chord tone resolution.
- **Core Focus:** Use modal color notes in short phrases, then resolve to stable chord tones.
- **Main Ear Idea:** Color notes create atmosphere; chord tones make the phrase land.
- **Capstone Task:** Create a short 8-bar modal-color phrase using at least one Dorian or Mixolydian color note and resolving to a chord tone.
- **Renderer Mapping:** Future implementation may use `phrase-lab`, `chord-tone-overlay`, `mode-color-lab`, `miniTabs`, and `selfCheck`.

## 🔒 Architecture & Data Guidelines

Future Month 6 data must fit existing root collections only:
- `weeks[]`
- `techniqueDrills[]`
- `miniTabs[]`
- `fretboardVisuals[]`
- `chordSoundLabs[]`

Renderer/block types such as `drone-practice`, `mode-color-lab`, `phrase-lab`, and `ear-training-lab` must be used inside existing week content structures, not as new root collections.

No external audio files. Use Web Audio only in future implementation.

## 🚫 Non-Goals

- Not a full modes encyclopedia.
- Not every mode equally.
- Not Locrian practice.
- Not jazz chord-scale theory.
- Not modal interchange.
- Not shred/speed training.
- Not production launch.
- Not mock data implementation.
- Not app code work.
- Not Month Switcher work.

## ✅ Success Criteria

By the end of Month 6, the learner should be able to:
1. Explain modes as chord colors in simple words.
2. Hear the difference between plain major/minor and a modal color.
3. Use Dorian or Mixolydian color notes in a short phrase.
4. Resolve a color note into a stable chord tone.
5. Understand that Lydian is a bright/floating color without needing to master every modal pattern.
