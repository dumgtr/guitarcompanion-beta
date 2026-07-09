# Fretboard Studio Lite F2 Renderer Compatibility Review

## 1. Existing Production Renderers
An analysis of `outputs/app.js` reveals two existing fretboard renderers:
- **`renderFretboardVisual(visual, ...)`**: This is the Month 2 Visualizer. It is highly integrated, using a CSS Grid layout system and generating classes like `.month2-fretboard-card`, `.fretboard-grid`, etc. While robust for static diagrams, it is tightly coupled to a declarative schema and should be **avoided** for an interactive tool.
- **`renderFretboard()`**: A legacy prototype function that outputs `.string-row` and `.fret-cell` markup. It is abandoned (no matching CSS exists in production) and should also be **avoided**.

## 2. Data Model Comparison
- **Production Model (Month 2)**: Static and declarative. Dots are defined with hardcoded coordinates (e.g., `{ fret: 5, string: 6, type: 'root' }`). Ideal for displaying specific teaching examples, but rigid.
- **Sandbox Model (Studio Lite)**: Algorithmic and dynamic. It calculates notes across the fretboard using modular arithmetic `(base + fret) % 12` and cross-references active interval arrays (e.g., `[0, 3, 5, 7, 10]`) based on the current state. This model is much better suited for a live, interactive visualization.

## 3. Recommended Safest Mount Location
**Practice Room tool**.
Due to its dynamic nature and algorithmic state model, it should not be mounted directly inside lesson blocks. Mounting it as a standalone tool in the Practice Room allows for an isolated DOM tree and avoids interfering with existing lesson layouts.

## 4. Recommended Preview Gate
The tool should be strictly gated behind the preview parameter:
`?fretboardStudioPreview=1`

## 5. Identified Risks
- **Mobile Overflow**: The sandbox handles narrow viewports using horizontal scroll (`overflow-x: auto`), but mounting this in the main app requires careful container scoping to avoid breaking the global page layout on 390/430px viewports.
- **CSS Conflicts**: The sandbox uses generic class names (e.g., `.root`, `.fret-cell`, `.string-row`, `.legend-list`). Some of these conflict with the legacy `renderFretboard` prototype and the Month 2 `.legend-list`. Global injection without namespacing will cause UI bleeding.
- **State/localStorage Pollution**: The tool's `STATE` object must remain isolated. It should not read/write to the main app's localStorage lesson progress.
- **Month 7/8 Exposure**: Risk is minimal because the sandbox generates notes mathematically. It does not fetch data from future curriculum shards.
- **Renderer Complexity**: Low complexity. The sandbox logic is lightweight (~140 lines of JS) and manages its own DOM regeneration efficiently, keeping integration risks small provided it remains isolated.

## 6. Recommended Integration Strategy
**Option A: Copy sandbox logic into an isolated production helper.**
We should not adapt the Month 2 renderer (Option B) because its static CSS Grid paradigm is incompatible with our dynamic needs. We should copy the sandbox logic but encapsulate it within a unique namespace (e.g., prefixing classes with `fsl-` and putting JS logic in a dedicated module pattern or closure).

## 7. Recommended Exact F3 Scope
If F3 integration is approved, the scope should be:
1. **Namespace CSS & JS**: Prefix all Fretboard Studio Lite CSS classes (e.g., `.fsl-container`, `.fsl-fret-cell`, `.fsl-root`) and wrap JS logic in a dedicated function/object to avoid global scope pollution.
2. **Mount in Practice Room**: Add a placeholder container inside the Practice Room HTML.
3. **Apply Preview Gate**: Inject the JS and CSS only if `?fretboardStudioPreview=1` is present in the URL.
4. **Mobile Polish**: Ensure the container behaves correctly within the main app's responsive shell.
