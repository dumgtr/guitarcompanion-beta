# Agent Team Workflow

Status: Documentation Only / Workflow Guardrail

This document defines the preferred cross-platform agent workflow for Guitar Companion. It is a coordination guide only. It does not authorize production code changes, new features, public reveals, or dependency changes.

## 1. Roles

### Codex: Chief Engineer / Architect / Integrator
- Owns repository context, implementation planning, file edits, validation, commits, and integration.
- Acts as the default committer unless the user explicitly assigns another tool or agent.
- Converts product/curriculum intent into scoped engineering tasks.
- Protects production guardrails and verifies that changes do not expose hidden months or alter frozen behavior.

### Claude: Deep Code Reviewer / Risk Reviewer
- Reviews code, architecture, regressions, edge cases, naming, and hidden coupling.
- Prioritizes risks, missing tests, production regressions, and unclear ownership.
- Should normally operate read-only unless explicitly assigned a separate review branch.

### Gemini: Research / Alternative Design / Audio-Web Reviewer
- Researches browser APIs, Web Audio behavior, mobile compatibility, and alternative design approaches.
- Useful for audio-engine tradeoffs, cross-browser constraints, and external technical comparison.
- Should return findings and recommendations rather than directly editing production files.

### Copilot: Small Patch Worker / PR Assistant
- Helps with small, well-scoped patches, repetitive edits, and PR text.
- Should only work from explicit instructions and on an assigned branch.
- Should not independently broaden scope or touch production-sensitive files.

### ChatGPT/User: Product Owner / Curriculum Director
- Defines product intent, curriculum direction, learner experience, and launch decisions.
- Approves public reveals, roadmap changes, new modules, and production guardrail exceptions.
- Resolves tradeoffs between pedagogy, UX, and implementation risk.

## 2. Core Collaboration Rules

- One writer, many reviewers.
- Codex is the default committer and integrator.
- Other agents should be read-only unless explicitly assigned a separate branch.
- No direct edits to `main`.
- No production file edits without explicit approval.
- No hidden-month reveal without an explicit reveal task.
- No release tags unless explicitly requested.
- Use Git branches and final reports as handoff artifacts.
- Every handoff should state files changed, validation run, known risks, and rollback notes.
- If multiple agents participate, each agent should produce a concise final report rather than making silent changes.

## 3. Branching And Handoff Rules

### Branching
- Use a dedicated feature, spike, or docs branch for each scoped task.
- Keep experimental work in spike branches.
- Keep docs-only changes separate from production code changes when possible.
- Never merge into `main` from an agent session unless the user explicitly asks for that operation.

### Commit Ownership
- Codex is the default committer.
- Reviewer agents should not commit directly unless they are assigned a branch and a precise patch task.
- Commits should be small and named by scope, for example:
  - `docs: add agent team workflow`
  - `fix: stabilize reference shelf toggles`
  - `spike: test sound lab sampler voice`

### Handoff Artifacts
Each handoff should include:
- Branch name.
- Commit SHA, if committed.
- Files changed.
- Validation commands and results.
- Production guardrails checked.
- Known risks.
- Next recommended action.

## 4. Production Guardrails

- Do not edit `outputs/app.js`, `outputs/index.html`, `outputs/styles.css`, or `outputs/data.json` without explicit production-scope approval.
- Do not expose Month 7-8 in normal production.
- Do not add Month 0.
- Do not add new Mini Courses, Practice Tools, or renderer types during a monitoring phase.
- Do not install dependencies or introduce frameworks.
- Do not add network audio, external media dependencies, or third-party runtime libraries without a scoped spike and approval.
- Do not modify frozen Reference Shelf content unless fixing a reported bug.

## 5. Sound Lab V2 Guardrails

Sound Lab V2 work must remain isolated until a spike passes QA and receives approval.

- Keep the current Sound Lab baseline untouched until a spike passes QA.
- No stacked chords.
- No arpeggios.
- Preserve black LED / GUIDE label behavior.
- Month 4 behavior must not change in early phases.
- Tone.js Sampler remains spike-only until approved.
- Do not add Tone.js or any sampler dependency to production during review.
- No autoplay. All audio must remain user-gesture gated.
- Any sampler or tone experiment must have a clear fallback and rollback path.

## 6. Sample Sound Lab V2 Review Workflow

### Step 1: Audio Engine Review
Owner: Gemini or Claude as reviewer, Codex as integrator.

Review:
- Browser audio unlock behavior.
- User-gesture gating.
- Gain staging and clipping risk.
- Mobile speaker audibility.
- Fallback behavior when audio fails.

Output:
- Risk list.
- Recommended implementation constraints.
- QA checklist.

### Step 2: Learning UX Review
Owner: ChatGPT/User with Codex support.

Review:
- Whether the interaction teaches the intended listening skill.
- Whether the UI remains calm and private-teacher-like.
- Whether labels are beginner-safe.
- Whether the learner understands what to listen for.

Output:
- Approved copy.
- UX guardrails.
- Any lesson-flow constraints.

### Step 3: Guardrail Review
Owner: Claude as risk reviewer, Codex as integrator.

Review:
- Month 4 baseline behavior remains unchanged.
- No Month 7-8 exposure in normal production.
- No new renderer assumptions leak into production.
- No dependency enters production without explicit approval.
- No stacked chords or arpeggios are introduced.

Output:
- Pass/fail notes.
- Required fixes before integration.

### Step 4: Mobile QA Review
Owner: Codex as tester, optional reviewer support.

Review:
- 390px and 430px layouts.
- Button tap targets.
- No body-level horizontal overflow.
- Audio buttons remain reachable.
- Topbar and metronome remain usable.

Output:
- Device/viewport checklist.
- Console status.
- Known limitations.

### Step 5: Codex Integration
Owner: Codex.

Only after review approval:
- Apply the smallest scoped patch.
- Run validation.
- Record files changed.
- Commit on the assigned branch.
- Push and provide a final report.

## 7. Final Report Template

```md
## Final Report

- Branch:
- Commit:
- Files changed:
- Validation:
- Production guardrails:
- Hidden months status:
- Audio guardrails:
- Remaining risks:
- Next action:
```

## 8. Current Pause Rule

If the project is in Post-Release Monitoring, agents must not initiate new features, Practice Tools, Mini Courses, public reveals, or redesigns. Agents may perform documentation cleanup, read-only audits, bug verification, and explicitly requested small fixes only.
