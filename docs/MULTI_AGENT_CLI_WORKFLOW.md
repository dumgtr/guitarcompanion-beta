# Multi-Agent CLI Workflow

This document describes the CLI-based multi-agent orchestration workflow for Guitar Companion.

## Visible Multi-Agent Process (Runner V2)

The workflow is explicitly separated into two distinct phases to ensure the multi-agent review process is fully transparent, visible, and strictly supervised.

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
