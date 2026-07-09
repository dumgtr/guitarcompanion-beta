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

# 3. Check for approval file
$ApprovalFile = "reports/phase2-approval.md"
if (!(Test-Path $ApprovalFile)) {
    Write-Error "Approval file $ApprovalFile not found! Aborting integration."
}

# 4. Check prompt
$PromptFile = "prompts/phase2-integrator-approved.md"
if (!(Test-Path $PromptFile)) {
    Write-Error "Prompt file $PromptFile not found."
}

# 5. Define timestamped files
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ReportFile = "reports/integrator-report-$timestamp.md"
$DiffAfterFile = "reports/diff-after-integrate-$timestamp.txt"
$HeadBeforeFile = "reports/head-before-integrate-$timestamp.txt"
$HeadAfterFile = "reports/head-after-integrate-$timestamp.txt"

# 6. Save before status
$HeadBefore = (git rev-parse HEAD).Trim()
$HeadBefore | Out-File -FilePath $HeadBeforeFile -Encoding utf8
Write-Host "Pre-run HEAD saved to $HeadBeforeFile"

# 7. Run Codex CLI
Write-Host "Running Codex Integrator..."
Get-Content $PromptFile -Raw | codex exec `
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
git diff --check > $DiffAfterFile
git diff --name-only >> $DiffAfterFile
git diff --cached --name-only >> $DiffAfterFile
git diff --name-only "$HeadBefore..HEAD" >> $DiffAfterFile

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
Write-Host "Integration complete. Report saved to $ReportFile."
