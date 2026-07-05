# Release Checkpoint: Reference Shelf / Rhythm Notation
Status: FINAL for current phase

## Release Metadata
- Release tag: `reference-rhythm-v1.0`
- Date: 2026-07-03
- Owner: Thanit Jit, Guitar Companion project owner
- Contact: project owner contact TBD in PR metadata
- Repository state: current repository branch has no commits yet, so no stable commit SHA is available.
- Commit SHA / PR number containing main changes: TBD when the first commit or PR is created for this workspace.
- Release notes line: Finalized Practice Room Reference Shelf with TAB Handbook and Rhythm Notation / Note Value Cheatsheet.

## Feature Summary
The Practice Room Reference Shelf is finalized for this phase. It gives the learner a single reference entry point with two resources:
- TAB Handbook for TAB symbols, real-world TAB markings, and an original rock TAB breakdown.
- Note Value Cheatsheet for visual note values, Count & Clap practice, Downbeat / Upbeat, 6/8 Starter, and Rhythm Under TAB.

This feature is FINAL unless a real user-facing bug is reported.

## Files Involved
- `outputs/index.html`
- `outputs/styles.css`
- `outputs/app.js`
- `docs/RELEASE_CHECKPOINT_REFERENCE_SHELF_RHYTHM.md`
- `docs/PROJECT_STATE.md`
- `docs/AI_HANDOFF.md`

## Final Behavior To Preserve
- Practice Room shows one unified Reference panel.
- The Reference panel has two buttons:
  - `คู่มือ TAB`
  - `ค่าจังหวะโน้ต`
- TAB Handbook opens from the Reference panel and contains:
  - TAB Symbol Cheatsheet
  - Real-World TAB Markings
  - Real Rock TAB Example Breakdown
- Note Value Cheatsheet opens from the Reference panel and contains:
  - Visual note value cards
  - Count & Clap Practice
  - Downbeat / Upbeat
  - 6/8 Starter
  - Rhythm Under TAB bridge
- Clicking the Guitar Companion logo closes both Reference sections.
- Reference content stays in Practice Room and must not be moved into the main lesson flow.

## Acceptance Criteria
- Both Reference buttons open their content within 1 second on a local dev server.
- TAB Handbook shows all listed sections.
- Note Value Cheatsheet shows all note value cards and the Rhythm Under TAB bridge.
- No console errors related to Reference panel on load or open.
- Responsive checks pass at `320px`, `768px`, `1024px`, and `1440px`.
- Accessibility: Reference buttons are keyboard-focusable and expose usable button text for assistive technology.
- Performance: initial page load must not regress by more than 100 ms from the local baseline. Baseline and measured value are TBD because this checkpoint is documentation-only and no browser timing run was performed.

## QA Checklist
- Functional:
  - Open `outputs/index.html`.
  - Open Practice Room.
  - Click `คู่มือ TAB`.
  - Confirm TAB Handbook expands.
  - Click `ค่าจังหวะโน้ต`.
  - Confirm Note Value Cheatsheet expands.
  - Click logo and confirm both Reference sections close.
- Visual:
  - Reference panel spans the Practice Room grid cleanly.
  - TAB Handbook and Note Value sections are visually distinct but consistent.
  - Note value SVG cards remain readable in light and dark themes.
  - Long rhythm / TAB examples scroll inside their own boxes.
- Performance:
  - No noticeable interaction delay opening either Reference section.
  - No new network assets, fonts, frameworks, or media files.
- Regression:
  - Week 0 Prelude still opens.
  - Week 1 TAB micro-skill still displays.
  - Month 1-4 remain visible.
  - Month 5-8 remain hidden.
  - No Month 0 appears.
- Accessibility:
  - Buttons can be reached by keyboard.
  - Focus outline remains visible.
  - Toggle state updates `aria-expanded`.
  - Basic screen reader readout identifies the two Reference buttons.

## Testing Matrix
- Browsers:
  - Chrome latest
  - Safari latest
  - Firefox latest
- Platforms:
  - Desktop macOS
  - Desktop Windows
  - iOS Safari
  - Android Chrome
- Devices / viewports:
  - iPhone 12 / 13 / 14
  - Common Android phone
  - Desktop `1366x768`
  - Desktop `1920x1080`
  - Widths `320px`, `768px`, `1024px`, `1440px`
- Accessibility quick checks:
  - Keyboard navigation
  - Focus visibility
  - Basic screen reader readout for buttons

## Rollback / Hotfix Plan
- Preferred rollback after a PR exists:
  - Revert the PR containing `reference-rhythm-v1.0`.
  - Exact commit SHA / PR number: TBD after the first commit or PR is created.
- If the Reference panel causes a critical regression before a PR exists:
  - In `outputs/index.html`, remove or temporarily hide the `article.panel.reference-panel` block.
  - In `outputs/app.js`, leave `setReferenceShelfOpen()` and `setNoteValueShelfOpen()` intact unless they are the direct source of the bug.
  - In `outputs/styles.css`, a temporary emergency CSS disable may be used:
    ```css
    .reference-panel,
    #tabGuidebook,
    #noteValueGuidebook {
      display: none !important;
    }
    ```
  - File a follow-up PR that restores the feature with targeted fixes.

## Known Non-Blocking Notes
- The repository currently has no commits, so exact PR and revert metadata cannot be recorded yet.
- Browser QA and performance timing values should be captured in the first PR that formalizes this release.
- Older `.reference-shelf-card` CSS may remain for compatibility, but the active Practice Room entry uses `.reference-panel`.
- Future contextual links from Week 1 micro-skill cards to the Reference Shelf are intentionally deferred.

## Future Direction
- Add contextual links from Week 1 TAB / rhythm micro-skill cards to the Reference Shelf.
- Specify a future Mini Course Shelf before implementation.
- Keep any future reference resources as Practice Room references, not new months or weeks.
- If expanding rhythm notation, draft a spec and mock data first.

## Guardrails
- Do not polish or add content to TAB Handbook or Note Value Cheatsheet unless a user reports a real bug.
- Do not move Reference content into the main lesson flow.
- Do not create Month 0.
- Do not reveal Month 5-8.
- Do not add external images, fonts, network assets, libraries, or frameworks.
- Any extension must be spec-first with mock data and a separate PR.

## Do-Not-Touch List
- `outputs/index.html`
  - `#practice`
  - `.reference-panel`
  - `#tabGuidebook`
  - `#noteValueGuidebook`
  - `#referenceShelfContent`
  - `#noteValueShelfContent`
- `outputs/styles.css`
  - `.reference-panel`
  - `.reference-button-group`
  - `.note-value-visual`
  - `.rhythm-practice-layer`
  - `.count-map-card`
  - `.rhythm-tab-bridge`
- `outputs/app.js`
  - `bindFocusedEvents()`
  - `bindReferenceShelfToggle()`
  - `setReferenceShelfOpen()`
  - `setNoteValueShelfOpen()`

## PR Template Snippet For Future Changes
```markdown
## Summary
- 

## Release Tag
- 

## QA Checklist
- [ ] TAB Handbook opens
- [ ] Note Value Cheatsheet opens
- [ ] No console errors
- [ ] 320px / 768px / 1024px / 1440px responsive checks
- [ ] Keyboard focus works
- [ ] Screen reader basic readout checked

## Rollback Steps
- 

## Owner And Reviewers
- Owner:
- QA:
- PM:

## Screenshots
- Desktop:
- Mobile:
```

## Communication
- Notify in PR description:
  - Owner: Thanit Jit
  - QA lead: TBD
  - PM: TBD
  - Slack handles or emails: TBD in PR metadata

## Acceptance Criteria Status
- Documentation checkpoint created: PASS
- Production files changed in this checkpoint: PASS, none changed
- Browser QA: NOT RUN in this docs-only checkpoint
- Performance baseline: NOT MEASURED in this docs-only checkpoint
- Blocking issue: stable commit SHA / PR number is unavailable because the repository has no commits yet.
