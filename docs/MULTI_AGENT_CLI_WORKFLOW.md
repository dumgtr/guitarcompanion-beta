# Multi-Agent CLI Workflow

This document describes the CLI-based multi-agent orchestration workflow for Guitar Companion.

## Visible Multi-Agent Process (Runner V2)

The workflow is explicitly separated into two distinct phases to ensure the multi-agent review process is fully transparent, visible, and strictly supervised.

Runner V2 makes the stages visible, but the reviewer roles are still Codex-backed role prompts unless another orchestration layer is added. In other words, V2 is useful for structured review discipline, but it is not true cross-agent or cross-model execution by itself.

### Phase 1: Review-Only Mode (3 Stages)

Run this phase to allow specialized agents to evaluate the current branch. This phase is strictly read-only and **must produce no file changes**.

```powershell
powershell -ExecutionPolicy Bypass -File scripts\gc-phase2-review-only.ps1
```

When run, the script executes three visible reviewer stages sequentially:
1. `[1/3] Audio-Web Reviewer`: Checks web audio constraints, mobile loudness, and Tone.js usage.
2. `[2/3] Risk / Guardrail Reviewer`: Checks production guardrail safety.
3. `[3/3] Learning UX Reviewer`: Checks labels, pedagogy, and beginner safety.

**Outputs:**
Each stage generates its own timestamped report in the `reports/` folder. An index report is also generated summarizing the status and verifying that no files were modified.

### Phase 2: Integration Mode (1 Stage)

After reading the review reports, the human must write explicit approval instructions into a file named `reports/phase2-approval.md`.

Once written, execute the Integrator stage:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\gc-phase2-integrate-approved.ps1
```

**Guardrails:**
- **Approval Gated:** The integrator is a fourth stage gated entirely by `reports/phase2-approval.md`. If the file is missing, the script aborts.
- **Strict Execution:** The Integrator may produce changes under a `workspace-write` sandbox but **never auto-commits**.
- **Human Supervision:** The user or Antigravity must inspect reports and diffs before manually committing.
- **Production Isolation:** The script fails immediately if `outputs/*` files are modified in the working tree, staged changes, or commits created during the run.

## Guardrails Enforced
- **Branch Enforcement**: Will not run unless on the specific spike branch.
- **Production Safety**: Fails the script and alerts the user if `outputs/*` files are modified.
- **No Merging**: The script does not automatically merge changes to `main`.
- **No Release Tags**: The script does not create or push release tags.
- **Reporting**: All reports are safely isolated in the `reports/` folder.

## Runner V3: External Agent Slots

Runner V3 adds explicit external-agent slots for the Phase 2 review roles. It can still run safely with Codex fallback, but each role can now be delegated to a real external command if that command is installed and configured locally.

```powershell
# fallback Codex for all roles
powershell -ExecutionPolicy Bypass -File scripts\gc-phase2-review-slots.ps1
```

Optional external command slots:

```powershell
$env:GC_AUDIO_AGENT_CMD = "your-audio-agent-command"
$env:GC_RISK_AGENT_CMD = "your-risk-agent-command"
$env:GC_UX_AGENT_CMD = "your-ux-agent-command"
powershell -ExecutionPolicy Bypass -File scripts\gc-phase2-review-slots.ps1
```

The environment variables are command templates. Replace the placeholder values with real local commands only after verifying those CLIs are installed and can run non-interactively.

Supported template placeholders:

- `{PromptFile}`: role-specific prompt file path.
- `{ReportFile}`: markdown report path the external agent may write.
- `{LogFile}`: raw log path.
- `{Role}`: human-readable role name.
- `{Timestamp}`: run timestamp.

Example template shape:

```powershell
$env:GC_AUDIO_AGENT_CMD = "your-audio-agent-command --input {PromptFile} --output {ReportFile}"
```

Do not invent working Gemini, Claude, Antigravity, or other agent commands in this repo. If those tools are not actually installed and verified in the current environment, leave the env vars unset and use Codex fallback.

### V3 Behavior

- Prints a visible banner for each slot:
  - `=== REAL AGENT SLOT: AUDIO ===`
  - `=== REAL AGENT SLOT: RISK ===`
  - `=== REAL AGENT SLOT: UX ===`
- Prints whether each slot uses an external command or Codex fallback.
- Runs reviewers sequentially by default for safety.
- Writes separate markdown reports and raw logs under `reports/`.
- Creates a timestamped index report: `reports/phase2-review-slots-index-YYYYMMDD-HHMMSS.md`.
- Does not merge to `main`.
- Does not create release tags.
- Blocks production file changes under `outputs/*` from working tree, staged changes, or commits created during the run.
- Fails review-only mode if tracked, staged, or committed files change.

### Codex Fallback

When a slot env var is not set, Runner V3 falls back to Codex CLI:

```powershell
codex exec --sandbox read-only -c approval_policy=never --output-last-message <report-path> -
```

This fallback is still a Codex-backed reviewer role, not a separate model. It is useful as a safe default but should not be described as true multi-model review.

### True External Agents

True cross-agent or cross-model review from PowerShell requires real external commands or installed CLIs. PowerShell alone cannot summon Gemini, Claude, Antigravity, or other agents unless a callable local command, connector, or wrapper already exists.

Use V3 as the slot architecture:

1. Install or configure the external CLI outside this workflow.
2. Verify it can run non-interactively.
3. Set the matching `GC_*_AGENT_CMD` env var.
4. Run `scripts\gc-phase2-review-slots.ps1`.
5. Inspect all generated reports before any integration work.
