# Multi-Agent Workflow: Tone.js Sampler Phase 2 Review

You are an orchestrator running an internal multi-agent workflow. If real external agents are not available, simulate the roles internally.

## Roles
1. **Orchestrator / Project Manager**: Manages the workflow and generates the final report.
2. **Audio-Web Reviewer / Gemini-style Reviewer**: Reviews web audio constraints and Tone.js usage.
3. **Risk / Guardrail Reviewer / Claude-style Reviewer**: Reviews production guardrails.
4. **Learning UX Reviewer / Product-Curriculum Reviewer**: Reviews the learning experience and pedagogy.
5. **Codex / Chief Engineer / Integrator**: Integrates findings and makes codebase edits.

## Rules
* Reviewer roles must remain read-only.
* Codex / Integrator is the only role allowed to edit files.
* Prefer no-op if everything is already aligned.
* Only edit:
  * `experiments/sound-lab-tonejs-sampler/**`
  * related experiment README/docs
  * active workflow docs only if guardrail wording is wrong
* Never edit:
  * `outputs/app.js`
  * `outputs/index.html`
  * `outputs/styles.css`
  * `outputs/data.json`

## Required Searches
You MUST perform searches for the following terms to ensure guardrails are intact and terminology is consistent:
* `Month 5-8`
* `Month 5–8`
* `Month 5/6 hidden`
* `Month 5/6 preview`
* `A2 -> A4`
* `A2 → A4`
* `Octave 4`
* `auditionNote`
* `stacked chord`
* `arpeggio`
* `autoplay`
* `Tone.js`

## Required Validation
You MUST run the following commands before completing your task:
* `git status --short`
* `git branch --show-current`
* `git diff --check`
* confirm no `outputs/*` changed
* list exact files inspected
* list exact files changed

## Final Report Format
You MUST output your final report in EXACTLY this format:

```md
## Multi-Agent Final Report

### Orchestrator Summary
- Overall result: 
- Patch needed: 
- Commit: 

### Branch / Commit
- Branch: 
- Current HEAD before work: 
- New commit, if any: 

### Simulated / Actual Agent Findings
#### Audio-Web Reviewer
- Pass/fail: 
- Findings: 
- Risks: 
- QA recommendations: 

#### Risk / Guardrail Reviewer
- Pass/fail: 
- Guardrails confirmed: 
- Risks: 
- Required fixes: 

#### Learning UX Reviewer
- Pass/fail: 
- Findings: 
- Copy/label recommendations: 

#### Codex / Integrator
- Files changed: 
- Why changed: 
- Validation: 

### Production Guardrails
- `outputs/app.js` changed: yes/no
- `outputs/index.html` changed: yes/no
- `outputs/styles.css` changed: yes/no
- `outputs/data.json` changed: yes/no
- Month 7–8 hidden: confirmed/not confirmed
- Tone.js spike-only: confirmed/not confirmed
- No stacked chords: confirmed/not confirmed
- No arpeggios: confirmed/not confirmed
- No autoplay: confirmed/not confirmed

### Validation
- Commands run: 
- Results: 

### Remaining Risks
- Audio: 
- Mobile: 
- Documentation: 
- Integration: 

### Next Recommended Action
- Recommend only the next safest step.
```
