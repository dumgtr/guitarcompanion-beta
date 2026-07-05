# FRETBOARD STUDIO LITE SPEC

This document is the spec-first planning artifact for Fretboard Studio Lite. It is a standalone Practice Tool / Tool Shelf specification stored at `docs/FRETBOARD_STUDIO_LITE_SPEC.md` and must remain separate from `MINI_COURSE_RENDERER_PLAN.md` to avoid scope overlap between Mini Course renderer work and Tool Shelf features.

Phase: Planning (Spec-first). This is a docs-only deliverable. No production code, no changes to `outputs/`, and no unlocking of Month 5-8.

## Scope Identity

Fretboard Studio Lite is a Practice Tool / Tool Shelf feature.

It is not:

- a Mini Course
- a Month
- a Week
- a roadmap progression requirement
- a full chord/scale encyclopedia

The feature exists to help the learner inspect chord shapes, scale fragments, and fretboard landmarks as a practical reference tool inside the Practice Room.

## Goals

- Define how Fretboard Studio Lite reads canonical data from `data.json`.
- Specify UI placement options and activation flows.
- Lock a bounded Lite feature set suitable for a Practice Tool MVP implementation.
- Provide schema snippets, sample payloads, fallback rules, telemetry, and a gating checklist for implementation readiness.

## Data Integration

### Source and Namespace

- Canonical source: `data.json` in the project assets bundle.
- Lite reads the namespaced object: `data.json.practiceTools.fretboardStudioLite`.
- This namespace intentionally avoids `miniCourses[]` and `miniCourse.*` so Tool Shelf features do not inherit Mini Course progress, reset, or lesson-flow rules.

### Load Modes

Two distinct loading stages optimize startup performance:

1. **Manifest Load (Fast)**:
   - Trigger: App initialization or Practice Room load.
   - Behavior: Retrieves only metadata headers (e.g., `version`, `shapeIndex[]`, `tuningIndex[]`, `uiHints`).
   - Target: Immediate rendering of shape lists and layout shells.
2. **Payload Load (Lazy)**:
   - Trigger: User selects a shape or scale, or requests details.
   - Behavior: Retrieves the full fretboard mapping, string arrays, fingerings, and interval data on-demand.
   - Target: Responsive detail display upon selection.

### Read Contract

- Renderer reads `GET /assets/data.json` or the app-equivalent bundled data path.
- Renderer extracts `practiceTools.fretboardStudioLite`.
- Expected top keys: `version`, `uiHints`, `tunings[]`, `shapes[]`, `scales[]`, `chords[]`.
- No external audio URLs allowed. Any audio references must be internal asset IDs or omitted.

### Caching and Versioning

- Cache manifest in memory and localStorage key `gc:fs-lite:manifest:{version}`.
- On manifest version mismatch, invalidate cached payloads and re-load manifest.
- Do not delete unknown localStorage keys outside the `gc:fs-lite:` namespace.

### Validation Rules

- Validate manifest and payloads against the canonical JSON Schema before rendering.
- Data values must fall within reasonable limits (e.g., frets between `0` and `24`, string numbers matching tuning).
- Reject payloads with external audio references with error `FS_403_EXTERNAL_AUDIO_REF`.
- Invalid manifests should fail softly and keep the Practice Room usable.

## Schema Core Snippets

### Canonical ID Conventions

- Prefixes: `shape:`, `scale:`, `chord:`, `tuning:`.
- IDs must be unique within the `practiceTools.fretboardStudioLite` namespace.
- IDs must not imply a Month, Week, Mini Course, or required progression step.

### String Order Rules

- String numbers are 1-based.
- String 1 = high e.
- String 6 = low E.
- `openStrings` uses 1-based string numbers.
- `frets[]` and `fingering[]` must declare their order explicitly.
- Recommended data array order: string 6 -> string 1 for chord-shape compatibility.
- Renderer display order must still show string 1 / high e on top and string 6 / low E on bottom to match Guitar Companion Orientation Rule v2.
- If a payload uses a non-recommended order, it must declare `stringOrder`.

### Scale Position Control

- Use `uiHints.maxScalePositions` to cap the visible scale positions.
- Default cap: `3` positions maximum.
- This supports the "Personal Guitar Teacher" philosophy by preventing cognitive overload and directing focus on mastering small, digestible portions of the fretboard.

### Example Snippet

```json
{
  "version": "1.0.0",
  "uiHints": {
    "maxScalePositions": 3,
    "preferredLayout": "compact"
  },
  "tunings": [
    {
      "id": "tuning:standard",
      "strings": 6,
      "pitches": ["E2", "A2", "D3", "G3", "B3", "E4"],
      "stringOrder": "string-6-to-string-1"
    }
  ],
  "shapes": [
    {
      "id": "shape:c_open",
      "type": "chord",
      "name": "C major (open)",
      "thaiName": "C เมเจอร์ (Open Position)",
      "strings": 6,
      "stringOrder": "string-6-to-string-1",
      "frets": [0, 3, 2, 0, 1, 0],
      "openStrings": [1, 6],
      "fingering": [0, 3, 2, 0, 1, 0],
      "uiHints": {
        "preferredLayout": "compact"
      }
    }
  ],
  "scales": [
    {
      "id": "scale:pent_minor_box1",
      "name": "Pentatonic minor box 1",
      "thaiName": "ไมเนอร์ เพนทาโทนิก (Box 1)",
      "positions": 3
    }
  ]
}
```

## UI Placement

### Primary Mode (Practice Room / Tool Shelf)

- Located inside the Practice Room as a Tool Shelf feature.
- Desktop: docked card on the right-hand panel, positioned below or near the Reference Shelf, visually separate from finalized Reference Shelf content. Maximum 30% width.
- Mobile: full-screen modal or stacked card.

### Alternative Mode (Inline Launcher)

- Inline launcher inside lessons as a small optional reference trigger.
- The inline launcher may open the Tool Shelf, but must not embed the full tool inside the main lesson flow.
- Text CTA: `เปิด Fretboard Studio Lite`

### Hard Placement Rules

- Must not appear in Month Switcher.
- Must not appear in Week tabs.
- Must not add a topbar navigation item.
- Must not create Month 0.
- Must not expose Month 5-8.
- Must not move Reference Shelf content.

## Practice Tool MVP Scope

Included:

- Shape Browser
- Fretboard Visualizer
- Internal Web Audio preview only (sine/triangle oscillators, no external audio resources)
- Transpose / Octave / Playback style controls
- Quick Insert as read-only reference
- Progressless Preview
- Scale position limit controlled by `uiHints.maxScalePositions`, default `3`

MVP behavior:

- The tool is reference-first, not progress-tracked.
- Opening a shape should not mutate Month progress.
- Playback must require user gesture.
- Audio must use internal Web Audio helpers or internal asset IDs only.

## Excluded

- Full editor
- External audio hosting
- Export / sharing
- Social features
- Full chord/scale encyclopedia mode
- Required course progression
- Month / Week / Mini Course completion logic
- Network-loaded media

## Progressless Design Rules

Fretboard Studio Lite is strictly progressless. It must not:

- Track or persist user progress of any kind.
- Write to `gc:mini:*` localStorage keys. Those belong to the Mini Course namespace.
- Use Mini Course progress, reset, or lesson-flow behavior.
- Mutate Month progress bars or `selectedFocusedMonth`.
- Mark any Week or Month as complete.
- Unlock or expose Month 5-8.
- Create Month 0.

The only localStorage namespace allowed is `gc:fs-lite:*` for manifest caching only.

## Mobile Rules

- Target widths: 390px and 430px.
- No body-level horizontal overflow.
- Use stacked card fallback. On screens narrower than 768px, the layout collapses from side-by-side to a single vertical stack.
- Target AA accessibility.
- Buttons must have mobile-safe tap targets (minimum 44px × 44px).
- Fretboard rows may scroll inside their own box only.
- Do not require pinch zoom.
- Keep focus order predictable when opening and closing the tool.
- Respect `prefers-reduced-motion`.
- Tuning/Scale selectors must wrap into vertical stacks or use swipeable horizontal container chips instead of clipping.

### Accessibility (AA Compliance)

- Interactive targets: all buttons, shape selectors, and note toggles must have a minimum tap area of 44px × 44px.
- Contrast: text labels and note badges on the fretboard must maintain a contrast ratio of at least 4.5:1 against their background.
- Aria attributes: include `aria-label` descriptions for note markers (e.g., `"String 6, Fret 5, Root Note A, First Finger"`).
- Keyboard traps: when operating in full-screen modal mode on mobile, keyboard focus must be trapped within the modal until closed.
- Motion: respect `prefers-reduced-motion` settings by disabling transition animations on fretboard note markers.

## Fallbacks & Errors

### Error Codes

- `FS_400_INVALID_MANIFEST`: manifest is missing required fields or has invalid shape.
- `FS_403_EXTERNAL_AUDIO_REF`: payload references external audio, URL, mp3, wav, CDN, or other network media.
- `FS_404_SHAPE_NOT_FOUND`: requested shape id does not exist in the loaded payload.
- `FS_500_RENDER_FAILED`: renderer failed unexpectedly after validation passed.

More specific `FS_*` codes may be added later if implementation reveals clearer failure categories.

### Priority Flow

1. Attempt schema validation.
2. If validation fails, log telemetry locally and trigger fallback markup.
3. Keep the surrounding Practice Room or Lesson container completely interactive.

### Fallback Messages (Thai)

Missing manifest:

```text
Fretboard Studio Lite ยังไม่มีข้อมูลให้เปิดในตอนนี้
```

Missing shape:

```text
ยังไม่พบ shape นี้ในคลัง Fretboard Studio Lite
```

Unsupported audio:

```text
ตัวอย่างเสียงนี้ยังไม่พร้อม ใช้ Metronome หรือเล่นช้า ๆ ด้วยตัวเองก่อนได้ครับ
```

Render failure:

```text
ยังแสดง Fretboard Studio Lite ไม่ได้ในตอนนี้ แต่หน้า Practice Room ยังใช้งานได้ตามปกติ
```

Load/manifest failure (warm teacher tone):

```text
ระบบ Fretboard Studio ขัดข้องเล็กน้อย แต่คุณยังสามารถใช้หน้า Practice Room เพื่อฝึกจังหวะและเขียนโน้ตได้ตามปกติครับ
```

Audio initialization failure:

```text
ไม่สามารถเปิดระบบเสียงสังเคราะห์ได้ชั่วคราว แนะนำให้ลองซ้อมดีดด้วยตัวเองช้า ๆ หรือเปิด Metronome ด้านบนควบคู่ไปด้วยนะครับ
```

## Telemetry / Local Events

Optional local events:

- `fs_lite_opened`
- `fs_lite_shape_selected`
- `fs_lite_play`
- `fs_lite_insert_reference`
- `fs_lite_error`

### Event Payloads

1. `fs_lite_opened`:
   - Trigger: User expands/launches the Fretboard Studio panel.
   - Payload: `{ source: "dashboard" | "inline_lesson", timestamp: "ISO-String" }`
2. `fs_lite_shape_selected`:
   - Trigger: User clicks a chord or scale in the Shape Browser.
   - Payload: `{ id: "chord:c-major-open", type: "chord" }`
3. `fs_lite_play`:
   - Trigger: User clicks the Audio Preview play button.
   - Payload: `{ id: "chord:c-major-open", style: "strum" | "arpeggio", transpose: 0 }`
4. `fs_lite_insert_reference`:
   - Trigger: User interacts with a quick-insert popover in a lesson.
   - Payload: `{ context: "month-1-week-2", shapeId: "scale:a-minor-pentatonic" }`
5. `fs_lite_error`:
   - Trigger: Renderer catches validation failure or Audio Context crash.
   - Payload: `{ code: "FS_400" | "FS_403" | "FS_404" | "FS_500", message: "..." }`

### Event Rules

- Events must be local only.
- Events must not send network requests.
- Events must not expose Practice Notes.
- Events must not mutate Month visibility.
- Events must not unlock Month 5-8.

## Gating Checklist

- `practiceTools.fretboardStudioLite` namespace approved.
- Manifest schema approved.
- String order approved.
- Feature scope approved.
- Mobile rules approved.
- Fallback messages approved.
- Telemetry names approved.
- Feature flag plan approved.
- No Month 5-8 exposure.
- No Month 0.
- No Mini Course progress/reset behavior inheritance.
- No `gc:mini:*` key writes.
- No production implementation yet.
