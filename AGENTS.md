# AGENTS.md

## Project
This is Guitar Companion, a personal guitar practice app for one Thai-speaking student.

## Product Philosophy
This is not an LMS, not a marketplace, and not a full music theory encyclopedia.
It should feel like a private guitar teacher and daily practice companion.

## Current Scope
Only Month 1 is visible:
- Week 1: Pulse & 16th Grid
- Week 2: Syncopation
- Week 3: Dynamics & Palm Muting
- Week 4: Groove Integration

Do not show Weeks 5-32.
Do not add new modules.

## Language
Primary language: Thai.
Keep common musician terms in English when natural:
- Pulse
- Groove
- Syncopation
- Palm Mute
- Metronome
- Backing Track
- Accent

Write Thai like a real guitar teacher speaking to a student.
Do not literal-translate English.

## Tech Rules
Use only:
- HTML
- CSS
- Vanilla JavaScript

Do not add frameworks.
Do not use network.
Do not install packages.
Do not create build tools.

## Local Preview
This project uses a dependency-free Node.js static server.

Do not use Python for preview.
Do not use PowerShell Start-Process for preview.
Use:

```bash
npm run serve
```

Preview URL:

```text
http://127.0.0.1:5173
```

## Editing Rules
Prefer small, targeted edits.
Do not rewrite the whole app unless explicitly requested.
Do not modify unrelated files.
After changes, summarize:
- files changed
- what changed
- what was intentionally not changed

## Agent Role & Workflow Guidelines

- The Product Owner chooses AGY IDE, AGY CLI, or Codex as Orchestrator for each task.
- Codex is the sole file-writing Implementer.
- Claude and Gemini are read-only reviewers. Invoke them only through the fixed `claude-readonly` or `gemini-plan-review` profile in Provider Process Runner V1 with a separate Human Dispatch Authorization.
- Do not invoke provider CLIs ad hoc, use mock reviewers as acceptance evidence, accept `GC_*_AGENT_CMD` command templates, or require a Host Broker that is not present and verifiable in this repository.
- Provider Runner request data cannot override executables, arguments, tools, protocols, or permissions.
- Scope Router V2 is advisory and Shadow Mode only. It never dispatches a provider and never enables execution or auto-repair.
- System CLI output and repository state are the validation source of truth. A provider report is advisory and never self-approves a change.
- Commit, push, merge, and production activation remain Product Owner gates.
- When interpreting user instructions in natural language for running Qwen reviews, the Coordinator/Orchestrator must translate cost intents to the appropriate `--cost-priority` CLI flag:
  - "ถูกที่สุด" / "ประหยัดสุด" -> Map to `--cost-priority cheapest`
  - "ราคาถูก" / "economy" -> Map to `--cost-priority economy`
  - "เอาเร็ว" -> Map to `--cost-priority fast`
  - Explicit model name mentioned -> Map to `--model <model-name>`

