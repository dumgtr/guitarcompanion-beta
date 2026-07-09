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
$HeadBeforeFile = "reports/head-before-$timestamp.txt"
$HeadAfterFile = "reports/head-after-$timestamp.txt"

# 6. Save before status and HEAD metadata
$HeadBefore = (git rev-parse HEAD).Trim()
$HeadBefore | Out-File -FilePath $HeadBeforeFile -Encoding utf8
git status --short > $StatusBeforeFile
Write-Host "Pre-run status saved to $StatusBeforeFile"
Write-Host "Pre-run HEAD saved to $HeadBeforeFile"

# 7. Run Codex CLI
Write-Host "Running Codex Multi-Agent Orchestrator..."
# Piping the prompt to codex exec.
# We include --sandbox workspace-write to enforce the workspace write sandbox,
# --ask-for-approval never to avoid interactive approval interruptions,
# and --output-last-message with an explicit path to capture the final report.
$PromptContent = Get-Content -Path $PromptFile -Raw
$PromptContent | codex exec `
  --sandbox workspace-write `
  -c approval_policy=never `
  --output-last-message $ReportFile `
  -
if ($LASTEXITCODE -ne 0) {
    Write-Error "Codex CLI failed with exit code $LASTEXITCODE."
}

# 8. Post-run validation
$HeadAfter = (git rev-parse HEAD).Trim()
$HeadAfter | Out-File -FilePath $HeadAfterFile -Encoding utf8
git status --short > $StatusAfterFile
git diff --check > $DiffAfterFile
git diff --name-only >> $DiffAfterFile
git diff --cached --name-only >> $DiffAfterFile
git diff --name-only "$HeadBefore..HEAD" >> $DiffAfterFile
Write-Host "Post-run HEAD saved to $HeadAfterFile"

# 9. Fail the script if any working, staged, or committed file matches `^outputs/`
$workingFiles = @(git diff --name-only)
$stagedFiles = @(git diff --cached --name-only)
$committedFiles = @(git diff --name-only "$HeadBefore..HEAD")
$protectedFiles = @($workingFiles + $stagedFiles + $committedFiles) | Where-Object { $_ -match "^outputs/" } | Sort-Object -Unique
foreach ($file in $protectedFiles) {
    if ($file -match "^outputs/") {
        Write-Error "FAIL: Production file modified! ($file)"
    }
}

Write-Host "PASS: No production files were changed in working tree, staged changes, or commits created during this run."
Write-Host "Multi-agent review complete. Report saved to $ReportFile."
