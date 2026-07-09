$ErrorActionPreference = "Stop"

if (!(Test-Path ".git")) {
    Write-Error "Must be run from the root of the git repository."
}

$branch = (git branch --show-current).Trim()
if ($branch -ne "spike/sound-lab-tonejs-sampler") {
    Write-Error "Must be on branch spike/sound-lab-tonejs-sampler. Current branch is $branch."
}

if (!(Test-Path "reports")) {
    New-Item -ItemType Directory -Path "reports" | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$HeadBefore = (git rev-parse HEAD).Trim()

function Join-ReportPath {
    param([string]$FileName)
    return "reports/$FileName"
}

function ConvertTo-AgentCommandLiteral {
    param([string]$Value)
    return "'" + ($Value -replace "'", "''") + "'"
}

function Expand-AgentCommand {
    param(
        [string]$Template,
        [hashtable]$Role
    )

    $promptPath = (Resolve-Path $Role.PromptFile).Path
    $reportPath = Join-Path (Get-Location) $Role.ReportFile
    $logPath = Join-Path (Get-Location) $Role.LogFile

    $expanded = $Template
    $expanded = $expanded.Replace("{PromptFile}", (ConvertTo-AgentCommandLiteral $promptPath))
    $expanded = $expanded.Replace("{ReportFile}", (ConvertTo-AgentCommandLiteral $reportPath))
    $expanded = $expanded.Replace("{LogFile}", (ConvertTo-AgentCommandLiteral $logPath))
    $expanded = $expanded.Replace("{Role}", (ConvertTo-AgentCommandLiteral $Role.Title))
    $expanded = $expanded.Replace("{Timestamp}", (ConvertTo-AgentCommandLiteral $timestamp))
    return $expanded
}

function Invoke-CodexFallback {
    param([hashtable]$Role)

    @(
        "Role: $($Role.Title)"
        "Backend: Codex fallback"
        "Command: codex exec --sandbox read-only -c approval_policy=never --output-last-message $($Role.ReportFile) -"
        ""
        "----- raw output -----"
    ) | Out-File -FilePath $Role.LogFile -Encoding utf8

    $promptContent = Get-Content -Path $Role.PromptFile -Raw
    $oldEap = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $promptContent | codex exec `
        --sandbox read-only `
        -c approval_policy=never `
        --output-last-message $Role.ReportFile `
        - 2>&1 | Tee-Object -FilePath $Role.LogFile -Append
    $ErrorActionPreference = $oldEap

    if ($LASTEXITCODE -ne 0) {
        Write-Error "$($Role.Title) Codex fallback failed with exit code $LASTEXITCODE."
    }

    if (!(Test-Path $Role.ReportFile)) {
        Write-Error "$($Role.Title) did not create expected report file $($Role.ReportFile)."
    }
}

function Invoke-ExternalAgent {
    param(
        [hashtable]$Role,
        [string]$Template
    )

    $expandedCommand = Expand-AgentCommand -Template $Template -Role $Role
    $promptContent = Get-Content -Path $Role.PromptFile -Raw

    @(
        "Role: $($Role.Title)"
        "Backend: External command"
        "Command template: $Template"
        "Expanded command: $expandedCommand"
        ""
        "----- raw output -----"
    ) | Out-File -FilePath $Role.LogFile -Encoding utf8

    $output = $promptContent | powershell -NoProfile -ExecutionPolicy Bypass -Command $expandedCommand 2>&1
    $exitCode = $LASTEXITCODE
    $output | ForEach-Object { "$_" } | Tee-Object -FilePath $Role.LogFile -Append

    if (!(Test-Path $Role.ReportFile) -or ((Get-Item $Role.ReportFile).Length -eq 0)) {
        $capturedOutput = ($output | ForEach-Object { "$_" }) -join "`n"
        @"
# $($Role.Title)

External agent command did not write a dedicated report file, so the runner captured stdout/stderr here.

## Command
````powershell
$expandedCommand
````

## Captured Output
````
$capturedOutput
````
"@ | Out-File -FilePath $Role.ReportFile -Encoding utf8
    }

    if ($exitCode -ne 0) {
        Write-Error "$($Role.Title) external command failed with exit code $exitCode."
    }
}

function Get-ReviewChangeState {
    param([string]$StartHead)

    $workingFiles = @(git diff --name-only)
    $stagedFiles = @(git diff --cached --name-only)
    $committedFiles = @(git diff --name-only "$StartHead..HEAD")
    $allChanged = @($workingFiles + $stagedFiles + $committedFiles) |
        Where-Object { $_ } |
        Sort-Object -Unique
    $outputsChanged = $allChanged | Where-Object { $_ -match "^outputs/" }

    return [pscustomobject]@{
        Working = $workingFiles
        Staged = $stagedFiles
        Committed = $committedFiles
        All = $allChanged
        Outputs = $outputsChanged
    }
}

function Invoke-AgentSlot {
    param([hashtable]$Role)

    Write-Host ""
    Write-Host "============================================="
    Write-Host "=== REAL AGENT SLOT: $($Role.Banner) ==="
    Write-Host "============================================="

    $externalCommand = [Environment]::GetEnvironmentVariable($Role.EnvVar)
    if ($externalCommand) {
        $Role.Backend = "External command from env var $($Role.EnvVar)"
        $Role.CommandUsed = "$($Role.EnvVar): $externalCommand"
        Write-Host "Backend: $($Role.Backend)"
        Invoke-ExternalAgent -Role $Role -Template $externalCommand
    } else {
        $Role.Backend = "Codex fallback"
        $Role.CommandUsed = "codex exec --sandbox read-only -c approval_policy=never --output-last-message <report-path> -"
        Write-Host "Backend: Codex fallback"
        Invoke-CodexFallback -Role $Role
    }

    Write-Host "Report: $($Role.ReportFile)"
    Write-Host "Log: $($Role.LogFile)"
}

$roles = @(
    @{
        Key = "audio"
        Banner = "AUDIO"
        Title = "Audio-Web Reviewer"
        EnvVar = "GC_AUDIO_AGENT_CMD"
        PromptFile = "prompts/phase2-audio-review.md"
        ReportFile = (Join-ReportPath "phase2-audio-review-$timestamp.md")
        LogFile = (Join-ReportPath "phase2-audio-review-$timestamp.log")
        Backend = ""
        CommandUsed = ""
    },
    @{
        Key = "risk"
        Banner = "RISK"
        Title = "Risk / Guardrail Reviewer"
        EnvVar = "GC_RISK_AGENT_CMD"
        PromptFile = "prompts/phase2-risk-review.md"
        ReportFile = (Join-ReportPath "phase2-risk-review-$timestamp.md")
        LogFile = (Join-ReportPath "phase2-risk-review-$timestamp.log")
        Backend = ""
        CommandUsed = ""
    },
    @{
        Key = "ux"
        Banner = "UX"
        Title = "Learning UX Reviewer"
        EnvVar = "GC_UX_AGENT_CMD"
        PromptFile = "prompts/phase2-ux-review.md"
        ReportFile = (Join-ReportPath "phase2-ux-review-$timestamp.md")
        LogFile = (Join-ReportPath "phase2-ux-review-$timestamp.log")
        Backend = ""
        CommandUsed = ""
    }
)

foreach ($role in $roles) {
    if (!(Test-Path $role.PromptFile)) {
        Write-Error "Prompt file $($role.PromptFile) not found."
    }
}

foreach ($role in $roles) {
    Invoke-AgentSlot -Role $role
}

$HeadAfter = (git rev-parse HEAD).Trim()
$changeState = Get-ReviewChangeState -StartHead $HeadBefore
$statusAfter = git status --short | Out-String
$indexReport = Join-ReportPath "phase2-review-slots-index-$timestamp.md"
$changedCount = @($changeState.All).Count
$outputsCount = @($changeState.Outputs).Count
$noFilesChanged = $changedCount -eq 0
$noOutputsChanged = $outputsCount -eq 0

$slotRows = $roles | ForEach-Object {
    "| $($_.Title) | $($_.Backend) | `$($_.CommandUsed)` | `$($_.ReportFile)` | `$($_.LogFile)` |"
}
$slotTable = ($slotRows -join "`n")

@"
# Phase 2 Review Slots Index

**Timestamp:** $timestamp
**Branch:** $branch
**HEAD before:** $HeadBefore
**HEAD after:** $HeadAfter

## Agent Slots

| Role | Backend | Command | Report | Log |
| --- | --- | --- | --- | --- |
$slotTable

## Git Status After Review

````text
$statusAfter
````

## Review-Only Confirmation

- Working/staged/committed files changed: $changedCount
- outputs/* changed: $outputsCount
- No tracked files changed: $noFilesChanged
- No outputs/* files changed: $noOutputsChanged

## Notes

- Runner does not merge to main.
- Runner does not create release tags.
- Reports and raw logs stay under reports/.
- Production files under outputs/* are blocked even if a reviewer commits during the run.
"@ | Out-File -FilePath $indexReport -Encoding utf8

Write-Host ""
Write-Host "Index report: $indexReport"

if ($changeState.Outputs.Count -gt 0) {
    Write-Error "CRITICAL FAIL: outputs/* files changed during review: $($changeState.Outputs -join ', ')"
}

if ($changeState.All.Count -gt 0) {
    Write-Error "FAIL: Review-only mode detected tracked/staged/committed file changes: $($changeState.All -join ', ')"
}

Write-Host "PASS: Review-only mode completed with no tracked file changes and no outputs/* changes."
