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

# 3. Create reports/ if missing
if (!(Test-Path "reports")) {
    New-Item -ItemType Directory -Path "reports" | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$HeadBefore = (git rev-parse HEAD).Trim()

$AudioReport = "reports/phase2-audio-review-$timestamp.md"
$RiskReport = "reports/phase2-risk-review-$timestamp.md"
$UXReport = "reports/phase2-ux-review-$timestamp.md"
$IndexReport = "reports/phase2-review-index-$timestamp.md"

Write-Host "`n============================================="
Write-Host "[1/3] Audio-Web Reviewer"
Write-Host "============================================="
Get-Content prompts/phase2-audio-review.md -Raw | codex exec `
  --sandbox read-only `
  -c approval_policy=never `
  --output-last-message $AudioReport `
  -

Write-Host "`n-> Report saved to $AudioReport"
Write-Host "-> Summary (last 40 lines):"
Get-Content $AudioReport | Select-Object -Last 40 | ForEach-Object { Write-Host $_ }


Write-Host "`n============================================="
Write-Host "[2/3] Risk / Guardrail Reviewer"
Write-Host "============================================="
Get-Content prompts/phase2-risk-review.md -Raw | codex exec `
  --sandbox read-only `
  -c approval_policy=never `
  --output-last-message $RiskReport `
  -

Write-Host "`n-> Report saved to $RiskReport"
Write-Host "-> Summary (last 40 lines):"
Get-Content $RiskReport | Select-Object -Last 40 | ForEach-Object { Write-Host $_ }


Write-Host "`n============================================="
Write-Host "[3/3] Learning UX Reviewer"
Write-Host "============================================="
Get-Content prompts/phase2-ux-review.md -Raw | codex exec `
  --sandbox read-only `
  -c approval_policy=never `
  --output-last-message $UXReport `
  -

Write-Host "`n-> Report saved to $UXReport"
Write-Host "-> Summary (last 40 lines):"
Get-Content $UXReport | Select-Object -Last 40 | ForEach-Object { Write-Host $_ }

# Fail if files changed
$workingFiles = @(git diff --name-only)
$stagedFiles = @(git diff --cached --name-only)
$committedFiles = @(git diff --name-only "$HeadBefore..HEAD")
$allChanged = @($workingFiles + $stagedFiles + $committedFiles) | Sort-Object -Unique

if ($allChanged.Count -gt 0) {
    Write-Error "FAIL: Review-only mode modified files! Changed files:`n$($allChanged -join "`n")"
}

$outputsChanged = $allChanged | Where-Object { $_ -match "^outputs/" }
if ($outputsChanged.Count -gt 0) {
    Write-Error "CRITICAL FAIL: outputs/* files were modified during review!"
}

# Index Report
$Status = git status --short | Out-String
$IndexContent = @"
# Multi-Agent Phase 2 Review Index
**Timestamp:** $timestamp
**Branch:** $branch
**HEAD:** $HeadBefore

## Reports Generated
- [Audio-Web Review](file://$PWD/$AudioReport)
- [Risk / Guardrail Review](file://$PWD/$RiskReport)
- [Learning UX Review](file://$PWD/$UXReport)

## Validation
- Files changed: 0
- outputs/* changed: No

## Git Status
```
$Status
```

## Next Step
Create `reports/phase2-approval.md` with explicit instructions before running the integrator script.
"@

$IndexContent | Out-File -FilePath $IndexReport -Encoding utf8
Write-Host "`n============================================="
Write-Host "All reviews complete!"
Write-Host "Index report saved to $IndexReport"
Write-Host "Next step: create reports/phase2-approval.md before running integrator."
