# Multi-Agent CLI Workflow

This document describes the CLI-based multi-agent orchestration workflow for Guitar Companion.

## What the CLI Runner Does
The `scripts/gc-multi-agent.ps1` script acts as a safe, reproducible wrapper for executing a multi-agent review via the Antigravity (Codex) CLI.
When run, the script will:
1. Validate that you are on the `spike/sound-lab-tonejs-sampler` branch.
2. Ensure you are running from the root of the Git repository.
3. Save a pre-run Git status to the `reports/` directory.
4. Pass the master prompt (`prompts/gc-multi-agent-tone-phase2.md`) to the Codex CLI via stdin.
5. Execute the multi-agent review under a **workspace-write** sandbox.
6. Automatically save the final agent report to a timestamped markdown file in the `reports/` directory.
7. Run a post-run validation (`git status`, `git diff --check`, `git diff --name-only`).
8. **Enforce hard guardrails**: It will fail the script immediately if ANY production file (under `outputs/`) is modified.

## How to Run It

To execute the multi-agent review:

```powershell
git checkout spike/sound-lab-tonejs-sampler
powershell -ExecutionPolicy Bypass -File scripts\gc-multi-agent.ps1
```

## Review-Only Mode
If you wish to run the orchestrator in a strictly read-only mode (where agents cannot edit any files at all, even in the `experiments/` folder), you can modify the script's `codex exec` line to use the `read-only` sandbox:
```powershell
Get-Content $PromptFile -Raw | codex exec - --sandbox read-only --ask-for-approval never --output-last-message $ReportFile
```

## What Files It Creates
The runner will generate timestamped log files in the `reports/` directory for every run:
- `multi-agent-tone-phase2-YYYYMMDD-HHMMSS.md`: The final multi-agent markdown report.
- `head-before-YYYYMMDD-HHMMSS.txt`: Commit SHA before execution.
- `head-after-YYYYMMDD-HHMMSS.txt`: Commit SHA after execution.
- `status-before-YYYYMMDD-HHMMSS.txt`: Output of `git status` before execution.
- `status-after-YYYYMMDD-HHMMSS.txt`: Output of `git status` after execution.
- `diff-after-YYYYMMDD-HHMMSS.txt`: Output of `git diff --check`, working tree diff names, staged diff names, and committed diff names after execution.

## Guardrails Enforced
- **Branch Enforcement**: Will not run unless on the specific spike branch.
- **Production Safety**: Fails the script and alerts the user if `outputs/*` files are modified in the working tree, staged changes, or commits created during the run.
- **No Merging**: The script does not automatically merge changes to `main`.
- **No Release Tags**: The script does not create or push release tags.
- **Reporting**: All reports are safely isolated in the `reports/` folder (which contains a `.gitkeep` to track it).
