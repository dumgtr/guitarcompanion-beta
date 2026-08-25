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

## Multi-Agent Team Roster & Roles

| Agent / Model | Interface & Provider | Endpoint / Protocol | Primary Role & Responsibility |
|---|---|---|---|
| **AGY CLI (`agy`)** | Antigravity CLI Orchestration | Native IDE / Subagent Runner | Master Orchestrator, multi-viewport verification probe, release gating & test automation |
| **Codex CLI (`codex exec`)** | OpenAI Codex CLI Engine | CLI Engine (`codex exec`) | Core implementation, precision refactoring, and code synthesis |
| **GitHub Copilot CLI (`gh copilot`)** | GitHub Copilot CLI | CLI Engine (`gh copilot`) | Code inspection, diff verification, commit & PR review |
| **Hermes (`stealth/ox-alpha`)** | OpenRouter API | `https://openrouter.ai/api/v1/chat/completions` | Frontend CSS layout forensics, visual geometry & element overflow diagnostic specialist |
| **DeepSeek (`deepseek-v4-flash` / `deepseek-chat`)** | DeepSeek Direct API | `https://api.deepseek.com/chat/completions` (`DEEPSEEK_API_KEY`) | Music pedagogy fidelity, fretboard mechanics, and guitar technique auditor |
| **Qwen (`qwen-max` / `qwen3.7-plus` / `qwen3.7-flash`)** | Alibaba Cloud DashScope Direct API | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions` (`DASHSCOPE_API_KEY`) | Fast architectural review, invariant validation, and natural Thai tone checking |

## Multi-Agent Governance Rules

1. **Dual Workstreams:** Divide audit tasks into independent Workstream A (Musical Vocabulary & Pedagogy) and Workstream B (Independent UX/UI & Accessibility).
2. **Clear Agent Roles:** Every agent operates strictly within its designated role and responsibility.
3. **Designated Channels:** Agents must be dispatched via their official live channels (Direct APIs, CLI engines, or native subagents).
4. **Read-Only Audit Phase:** No source code modifications are permitted during the audit phase.
5. **No Autonomous Releases:** Agents are strictly prohibited from performing autonomous Git commits, pushes, or deployments.
6. **Synthesis Before Implementation:** All findings must be consolidated into structured synthesis reports before any code edit is proposed.
7. **Preserve Locked Files & Invariants:** Hard constraints (e.g., `outputs/app.js` SHA-256 hash, `outputs/audio-engine.js`, `outputs/index.html`, Month 2–32) must be preserved unless explicitly authorized.
8. **Evidence-Based Surgical Edits:** Implement only approved, high-value findings with targeted changes.
9. **Mandatory Multi-Gate Verification:** Every change must pass all 10 regression test suites (100% assertions green) and Chromium multi-viewport measurements (0px horizontal overflow, heading typography invariants).
10. **Product Owner Release Gate:** All commits, pushes, and production deployments require explicit Product Owner approval.

