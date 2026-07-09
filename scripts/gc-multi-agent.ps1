$ErrorActionPreference = "Stop"

# 1. Confirm git repo
if (!(Test-Path ".git")) {
    Write-Error "Must be run from the root of the git repository."
}

# 2. Confirm current branch
$branch = git branch --show-current
if ($branch -ne "spike/sound-lab-tonejs-sampler") {
    Write-Error "Must be on branch spike/sound-lab-tonejs-sampler. Current branch is $branch."
}

# 3. Confirm prompt file exists
$PromptFile = "prompts/gc-multi-agent-tone-phase2.md"
if (!(Test-Path $PromptFile)) {
    Write-Error "Prompt file $PromptFile not found."
}

# 4. Create reports/ if missing
if (!(Test-Path "reports")) {
    New-Item -ItemType Directory -Path "reports" | Out-Null
}

# 5. Define timestamped files
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ReportFile = "reports/multi-agent-tone-phase2-$timestamp.md"
$StatusBeforeFile = "reports/status-before-$timestamp.txt"
$StatusAfterFile = "reports/status-after-$timestamp.txt"
$DiffAfterFile = "reports/diff-after-$timestamp.txt"

# 6. Save before status
git status --short > $StatusBeforeFile
Write-Host "Pre-run status saved to $StatusBeforeFile"

# 7. Run Codex CLI
Write-Host "Running Codex Multi-Agent Orchestrator..."
# Piping the prompt to codex exec.
# We include --sandbox workspace-write to enforce the workspace write sandbox,
# and --output-last-message to capture the final report.
# Note: If your local Codex CLI uses different flags for this behavior, adjust them here.
Get-Content $PromptFile -Raw | codex exec - --sandbox workspace-write --output-last-message > $ReportFile

# 8. Post-run validation
git status --short > $StatusAfterFile
git diff --check > $DiffAfterFile
git diff --name-only >> $DiffAfterFile

# 9. Fail the script if any changed file matches `^outputs/`
$changedFiles = git diff --name-only
foreach ($file in $changedFiles) {
    if ($file -match "^outputs/") {
        Write-Error "FAIL: Production file modified! ($file)"
    }
}
$stagedFiles = git diff --cached --name-only
foreach ($file in $stagedFiles) {
    if ($file -match "^outputs/") {
        Write-Error "FAIL: Production file modified! ($file)"
    }
}

Write-Host "PASS: No production files were changed."
Write-Host "Multi-agent review complete. Report saved to $ReportFile."
