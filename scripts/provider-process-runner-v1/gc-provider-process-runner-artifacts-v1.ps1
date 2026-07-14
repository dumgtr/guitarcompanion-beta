Set-StrictMode -Version Latest

function Test-GcPathWithinV1 {
    param(
        [Parameter(Mandatory)][string]$Candidate,
        [Parameter(Mandatory)][string]$Parent
    )

    $candidateFull = [IO.Path]::GetFullPath($Candidate).TrimEnd([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar)
    $parentFull = [IO.Path]::GetFullPath($Parent).TrimEnd([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar)
    $comparison = if ([OperatingSystem]::IsWindows()) { [StringComparison]::OrdinalIgnoreCase } else { [StringComparison]::Ordinal }
    if ([string]::Equals($candidateFull, $parentFull, $comparison)) { return $true }
    return $candidateFull.StartsWith($parentFull + [IO.Path]::DirectorySeparatorChar, $comparison)
}

function Assert-GcNoArtifactReparseV1 {
    param([Parameter(Mandatory)][string]$Path)
    $current = [IO.DirectoryInfo]::new([IO.Path]::GetFullPath($Path))
    while ($null -ne $current) {
        if ($current.Exists -and (($current.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0)) {
            Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_ARTIFACT_REPARSE_PATH_FORBIDDEN'
        }
        $current = $current.Parent
    }
}

function Resolve-GcRunnerArtifactRootV1 {
    param(
        [Parameter(Mandatory)][string]$RepositoryRoot,
        [AllowNull()][string]$ArtifactRoot
    )

    if ([string]::IsNullOrEmpty($ArtifactRoot)) {
        if ([string]::IsNullOrEmpty($env:LOCALAPPDATA)) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_LOCALAPPDATA_MISSING' }
        $ArtifactRoot = [IO.Path]::Combine($env:LOCALAPPDATA, 'GuitarCompanion', 'ProviderProcessRunnerV1', 'runs')
    }
    $full = Assert-GcCanonicalAbsolutePathV1 -Path ([IO.Path]::GetFullPath($ArtifactRoot)) -FailureCode 'RUNNER_ARTIFACT_ROOT_INVALID'
    if (Test-GcPathWithinV1 -Candidate $full -Parent $RepositoryRoot) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_ARTIFACT_ROOT_INSIDE_REPOSITORY' }
    Assert-GcNoArtifactReparseV1 -Path $full
    return $full
}

function New-GcRunnerRunDirectoryV1 {
    param(
        [Parameter(Mandatory)][string]$ArtifactRoot,
        [Parameter(Mandatory)][string]$AuthorizationId
    )

    if ($AuthorizationId -cnotmatch '^GC_AUTH_[0-9a-f]{32}$') { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_AUTHORIZATION_ID_INVALID' }
    [void][IO.Directory]::CreateDirectory($ArtifactRoot)
    $runDirectory = [IO.Path]::Combine($ArtifactRoot, $AuthorizationId)
    if ([IO.Directory]::Exists($runDirectory) -or [IO.File]::Exists($runDirectory)) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_AUTHORIZATION_ALREADY_USED' }
    try { [void][IO.Directory]::CreateDirectory($runDirectory) }
    catch { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_ARTIFACT_DIRECTORY_CREATE_FAILED' }
    return $runDirectory
}

function Protect-GcDiagnosticTextV1 {
    param([AllowNull()][string]$FailureCategory)

    switch ($FailureCategory) {
        'AUTH_FAILED' { return 'Provider authentication or dispatch authorization failed.' }
        'RATE_LIMITED' { return 'Provider rate limit reached.' }
        'QUOTA_EXCEEDED' { return 'Provider quota exhausted.' }
        'PROVIDER_FAILURE' { return 'Provider process failed.' }
        'PROTOCOL_FAILURE' { return 'Provider output protocol failed validation.' }
        'RUNNER_FAILURE' { return 'Runner infrastructure failed.' }
        'TIMEOUT' { return 'Provider process exceeded the bounded timeout.' }
        'CANCELLED' { return 'Provider process was cancelled.' }
        default { return $null }
    }
}

function Write-GcRunnerArtifactAtomicV1 {
    param(
        [Parameter(Mandatory)][Collections.IDictionary]$Artifact,
        [Parameter(Mandatory)][string]$DestinationPath
    )

    $directory = [IO.Path]::GetDirectoryName($DestinationPath)
    if (-not [IO.Directory]::Exists($directory)) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_ARTIFACT_DIRECTORY_MISSING' }
    $name = [IO.Path]::GetFileName($DestinationPath)
    $temporaryPath = [IO.Path]::Combine($directory, '.' + $name + '.' + [Guid]::NewGuid().ToString('N') + '.tmp')
    $json = ConvertTo-GcCanonicalJsonV1 -Value $Artifact
    $bytes = [Text.UTF8Encoding]::new($false).GetBytes($json + "`n")
    try {
        $stream = [IO.FileStream]::new($temporaryPath, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
        try { $stream.Write($bytes, 0, $bytes.Length); $stream.Flush($true) }
        finally { $stream.Dispose() }
        [IO.File]::Move($temporaryPath, $DestinationPath, $true)
    }
    catch { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_ARTIFACT_WRITE_FAILED' }
    finally { if ([IO.File]::Exists($temporaryPath)) { try { [IO.File]::Delete($temporaryPath) } catch { } } }
    return [pscustomobject]@{ Path = $DestinationPath; Sha256 = Get-GcSha256HexV1 -Bytes ([IO.File]::ReadAllBytes($DestinationPath)) }
}

function Remove-GcRunnerTemporaryArtifactsV1 {
    param([Parameter(Mandatory)][string]$RunDirectory)
    if (-not [IO.Directory]::Exists($RunDirectory)) { return }
    foreach ($file in [IO.Directory]::EnumerateFiles($RunDirectory, '*.tmp', [IO.SearchOption]::TopDirectoryOnly)) {
        try { [IO.File]::Delete($file) } catch { }
    }
}

function Read-GcResumeCheckpointV1 {
    param(
        [Parameter(Mandatory)][Collections.IDictionary]$Request,
        [Parameter(Mandatory)][string]$NewAuthorizationId
    )

    if ($null -eq $Request['resumeCheckpointPath']) { return $null }
    $path = Assert-GcCanonicalAbsolutePathV1 -Path ([string]$Request['resumeCheckpointPath']) -FailureCode 'RUNNER_RESUME_PATH_NOT_CANONICAL'
    if (-not [IO.File]::Exists($path)) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_RESUME_CHECKPOINT_MISSING' }
    $checkpointFile = Read-GcRunnerJsonFileV1 -LiteralPath $path
    if (-not [string]::Equals($checkpointFile.Sha256, [string]$Request['resumeCheckpointSha256'], [StringComparison]::Ordinal)) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_RESUME_CHECKPOINT_HASH_MISMATCH' }
    $checkpoint = $checkpointFile.Value
    $keys = @('artifactType','schemaVersion','checkpointId','originalAuthorizationId','requestId','requestSha256','taskId','providerProfileId','state','failureCategory','attemptCount','expectedBranch','expectedHead','worktreeStatusSha256','worktreePreserved','createdAtUtc','resumeRequiresNewHumanAuthorization')
    Assert-GcClosedObjectV1 -Object $checkpoint -Keys $keys -ContractName 'RUNNER_CHECKPOINT'
    if (-not [string]::Equals([string]$checkpoint['artifactType'], 'provider-process-checkpoint', [StringComparison]::Ordinal) -or
        -not [string]::Equals([string]$checkpoint['schemaVersion'], 'gc-provider-process-runner-v1.checkpoint/1', [StringComparison]::Ordinal) -or
        $checkpoint['checkpointId'] -isnot [string] -or $checkpoint['checkpointId'] -cnotmatch '^GC_CHECKPOINT_[0-9a-f]{32}$' -or
        $checkpoint['originalAuthorizationId'] -isnot [string] -or $checkpoint['originalAuthorizationId'] -cnotmatch '^GC_AUTH_[0-9a-f]{32}$' -or
        -not [string]::Equals([string]$checkpoint['taskId'], [string]$Request['taskId'], [StringComparison]::Ordinal) -or
        -not [string]::Equals([string]$checkpoint['providerProfileId'], [string]$Request['providerProfileId'], [StringComparison]::Ordinal) -or
        -not [string]::Equals([string]$checkpoint['expectedBranch'], [string]$Request['expectedBranch'], [StringComparison]::Ordinal) -or
        -not [string]::Equals([string]$checkpoint['expectedHead'], [string]$Request['expectedHead'], [StringComparison]::Ordinal) -or
        $checkpoint['failureCategory'] -notin @('QUOTA_EXCEEDED','TIMEOUT') -or
        $checkpoint['state'] -notin @('FAILED','TIMED_OUT') -or
        $checkpoint['attemptCount'] -isnot [long] -or $checkpoint['attemptCount'] -lt 1 -or $checkpoint['attemptCount'] -gt 2 -or
        -not (Test-GcLowerHexV1 -Value $checkpoint['worktreeStatusSha256'] -Length 64) -or
        $checkpoint['worktreePreserved'] -isnot [bool] -or -not $checkpoint['worktreePreserved'] -or
        -not $checkpoint['resumeRequiresNewHumanAuthorization'] -or
        [string]::Equals([string]$checkpoint['originalAuthorizationId'], $NewAuthorizationId, [StringComparison]::Ordinal)) {
        Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_RESUME_CHECKPOINT_INVALID'
    }
    return $checkpoint
}

function New-GcLifecycleArtifactV1 {
    param(
        [Parameter(Mandatory)][Collections.IDictionary]$Request,
        [Parameter(Mandatory)][Collections.IDictionary]$Authorization,
        [Parameter(Mandatory)][string]$RequestSha256,
        [Parameter(Mandatory)][DateTimeOffset]$CreatedAtUtc,
        [Parameter(Mandatory)][string]$State,
        [AllowNull()][string]$FailureCategory,
        [Parameter(Mandatory)][object[]]$Attempts,
        [Parameter(Mandatory)][bool]$CheckpointWritten,
        [Parameter(Mandatory)][bool]$WorktreePreserved
    )

    $transitions = [Collections.Generic.List[object]]::new()
    $transitions.Add([ordered]@{ state = 'NOT_STARTED'; atUtc = $CreatedAtUtc.ToString('o') })
    foreach ($attempt in $Attempts) {
        foreach ($transition in $attempt['stateTransitions']) {
            if ($transition['state'] -ne 'NOT_STARTED') { $transitions.Add($transition) }
        }
    }
    if ($Attempts.Count -eq 0 -and $State -ne 'NOT_STARTED') { $transitions.Add([ordered]@{ state = $State; atUtc = ([DateTimeOffset]::UtcNow).ToString('o') }) }

    return [ordered]@{
        artifactType = 'provider-process-lifecycle'
        schemaVersion = 'gc-provider-process-runner-v1.lifecycle/1'
        authorizationId = [string]$Authorization['authorizationId']
        requestId = [string]$Request['requestId']
        requestSha256 = $RequestSha256
        taskId = [string]$Request['taskId']
        providerProfileId = [string]$Request['providerProfileId']
        state = $State
        failureCategory = $FailureCategory
        diagnosticSummary = Protect-GcDiagnosticTextV1 -FailureCategory $FailureCategory
        stateTransitions = $transitions.ToArray()
        attempts = $Attempts
        checkpointWritten = $CheckpointWritten
        worktreePreserved = $WorktreePreserved
        createdAtUtc = $CreatedAtUtc.ToString('o')
        completedAtUtc = ([DateTimeOffset]::UtcNow).ToString('o')
        executionPermittedByRouter = $false
        autoRepairAllowed = $false
        gitMutationPerformed = $false
    }
}

function New-GcCheckpointArtifactV1 {
    param(
        [Parameter(Mandatory)][Collections.IDictionary]$Request,
        [Parameter(Mandatory)][Collections.IDictionary]$Authorization,
        [Parameter(Mandatory)][string]$RequestSha256,
        [Parameter(Mandatory)][string]$State,
        [Parameter(Mandatory)][string]$FailureCategory,
        [Parameter(Mandatory)][int]$AttemptCount,
        [Parameter(Mandatory)][Collections.IDictionary]$RepositorySnapshot,
        [Parameter(Mandatory)][bool]$WorktreePreserved
    )

    return [ordered]@{
        artifactType = 'provider-process-checkpoint'
        schemaVersion = 'gc-provider-process-runner-v1.checkpoint/1'
        checkpointId = 'GC_CHECKPOINT_' + [Guid]::NewGuid().ToString('N')
        originalAuthorizationId = [string]$Authorization['authorizationId']
        requestId = [string]$Request['requestId']
        requestSha256 = $RequestSha256
        taskId = [string]$Request['taskId']
        providerProfileId = [string]$Request['providerProfileId']
        state = $State
        failureCategory = $FailureCategory
        attemptCount = $AttemptCount
        expectedBranch = [string]$Request['expectedBranch']
        expectedHead = [string]$Request['expectedHead']
        worktreeStatusSha256 = [string]$RepositorySnapshot['statusSha256']
        worktreePreserved = $WorktreePreserved
        createdAtUtc = ([DateTimeOffset]::UtcNow).ToString('o')
        resumeRequiresNewHumanAuthorization = $true
    }
}
