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

Write-Host "Running Audio-Web Review..."
Get-Content prompts/phase2-audio-review.md -Raw | codex exec `
  --sandbox read-only `
  -c approval_policy=never `
  --output-last-message "reports/audio-review-$timestamp.md" `
  -

Write-Host "Running Risk/Guardrail Review..."
Get-Content prompts/phase2-risk-review.md -Raw | codex exec `
  --sandbox read-only `
  -c approval_policy=never `
  --output-last-message "reports/risk-review-$timestamp.md" `
  -

Write-Host "Running Learning UX Review..."
Get-Content prompts/phase2-ux-review.md -Raw | codex exec `
  --sandbox read-only `
  -c approval_policy=never `
  --output-last-message "reports/ux-review-$timestamp.md" `
  -

Write-Host "Reviews complete. See reports folder."
