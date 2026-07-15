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

## Controlled external reviewers

External reviewer commands are not accepted from environment variables, task input, or report files. Claude and Gemini may be invoked only through Provider Process Runner V1 using a fixed checked-in profile and a separate Human Dispatch Authorization:

- `claude-readonly`: read-only repository inspection with a strict one-document JSON terminal contract;
- `gemini-plan-review`: read-only plan mode with a strict stream-JSON terminal contract.

The runner fixes the executable, arguments, permission mode, tool policy, prompt transport, and protocol. A request cannot override them. Ad-hoc direct provider invocation and nested provider calls are prohibited. A Host Broker is not required and is not invoked when no verified Broker exists in the repository.

Provider preflight is performed once per task. Quota, authentication, and protocol failures mark that reviewer unavailable for the task without retry. A mandatory missing review blocks acceptance; an optional missing review continues only with a warning and the applicable Product Owner gate.

Scope Router V2 only recommends fixed read-only reviewer roles and profiles. It never invokes Provider Process Runner V1. Every actual invocation requires Human Dispatch Authorization after the Router decision.

### Current acceptance limitations

- Protected-write and provider dispatch authorizations are local audit artifacts, not cryptographic signatures; their safety depends on file custody and exact hash/identity binding.
- Workflow repair extends the existing closed `/1` schema contracts. Consumers pinned to earlier `/1` shapes must be updated together or will reject the new evidence/profile values.
- Mock and contract validation does not prove live provider availability. Each enabled reviewer profile requires one controlled live smoke before merge; auth, quota, timeout, or protocol failure records that reviewer as unavailable without weakening the fixed profile.
