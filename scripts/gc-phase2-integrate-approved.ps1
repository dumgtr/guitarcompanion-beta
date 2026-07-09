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

Write-Host "`n============================================="
Write-Host "[4/4] Codex Integrator / Approved Patch Only"
Write-Host "============================================="

# 3. Check for approval file
$ApprovalFile = "reports/phase2-approval.md"
if (!(Test-Path $ApprovalFile)) {
    Write-Error "Approval file $ApprovalFile not found! Aborting integration.`nReview reports must be read first. You must write explicit approval to this file.`nThe integrator cannot decide A2 -> A4 or remove sequential compare by itself."
}

Write-Host "`nContents of ${ApprovalFile}:"
Write-Host "---------------------------------------------"
Get-Content $ApprovalFile | ForEach-Object { Write-Host $_ }
Write-Host "---------------------------------------------`n"

# 4. Check prompt
$PromptFile = "prompts/phase2-integrator-approved.md"
if (!(Test-Path $PromptFile)) {
    Write-Error "Prompt file $PromptFile not found."
}

# 5. Define timestamped files
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ReportFile = "reports/phase2-integrator-$timestamp.md"
$HeadBefore = (git rev-parse HEAD).Trim()

# 6. Run Codex CLI
Write-Host "Running Codex Integrator..."
Get-Content $PromptFile -Raw | codex exec `
  --sandbox workspace-write `
  -c approval_policy=never `
  --output-last-message $ReportFile `
  -

if ($LASTEXITCODE -ne 0) {
    Write-Error "Codex CLI failed with exit code $LASTEXITCODE."
}

# 7. Post-run validation
$workingFiles = @(git diff --name-only)
$stagedFiles = @(git diff --cached --name-only)
$committedFiles = @(git diff --name-only "$HeadBefore..HEAD")
$allChanged = @($workingFiles + $stagedFiles + $committedFiles) | Sort-Object -Unique

$outputsChanged = $allChanged | Where-Object { $_ -match "^outputs/" }
if ($outputsChanged.Count -gt 0) {
    Write-Error "FAIL: Production file modified! ($($outputsChanged -join ", "))"
}

Write-Host "`n============================================="
Write-Host "Integration complete!"
Write-Host "-> Report saved to $ReportFile"
Write-Host "`nGit Status:"
git status --short
Write-Host "`nGit Diff Names:"
git diff --name-only

Write-Host "`nPASS: No outputs/* files were changed."
Write-Host "REMINDER: Do not commit until human reviews diff."
