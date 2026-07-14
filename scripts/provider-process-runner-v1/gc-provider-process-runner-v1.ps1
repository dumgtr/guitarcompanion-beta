param(
    [Parameter(Mandatory)][string]$RequestPath,
    [Parameter(Mandatory)][string]$AuthorizationPath,
    [AllowNull()][string]$ArtifactRoot,
    [AllowNull()][string]$CancellationPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

. ([IO.Path]::Combine($PSScriptRoot, 'gc-provider-process-runner-core-v1.ps1'))
. ([IO.Path]::Combine($PSScriptRoot, 'gc-provider-process-runner-artifacts-v1.ps1'))

$createdAt = [DateTimeOffset]::UtcNow
$runDirectory = $null
$request = $null
$authorization = $null
$requestSha256 = $null
$attempts = [object[]]@()
$initialSnapshot = $null

try {
    $repositoryRoot = [IO.Path]::GetFullPath([IO.Path]::Combine($PSScriptRoot, '..', '..'))
    $policyPath = [IO.Path]::Combine($repositoryRoot, 'config', 'gc-provider-process-runner-v1.policy.json')
    $policyFile = Read-GcRunnerJsonFileV1 -LiteralPath $policyPath
    $policy = $policyFile.Value
    Assert-GcRunnerPolicyV1 -Policy $policy

    $requestPathFull = Assert-GcCanonicalAbsolutePathV1 -Path $RequestPath -FailureCode 'RUNNER_REQUEST_PATH_NOT_CANONICAL'
    $authorizationPathFull = Assert-GcCanonicalAbsolutePathV1 -Path $AuthorizationPath -FailureCode 'RUNNER_AUTHORIZATION_PATH_NOT_CANONICAL'
    $requestFile = Read-GcRunnerJsonFileV1 -LiteralPath $requestPathFull
    $authorizationFile = Read-GcRunnerJsonFileV1 -LiteralPath $authorizationPathFull
    $request = $requestFile.Value
    $authorization = $authorizationFile.Value
    $requestSha256 = $requestFile.Sha256

    $requestContext = Assert-GcRunnerRequestV1 -Request $request -Policy $policy
    $profile = Get-GcProviderProfileV1 -Policy $policy -ProfileId ([string]$request['providerProfileId'])
    Assert-GcHumanDispatchAuthorizationV1 -Authorization $authorization -Request $request -RequestSha256 $requestSha256 -Policy $policy
    $resumeCheckpoint = Read-GcResumeCheckpointV1 -Request $request -NewAuthorizationId ([string]$authorization['authorizationId'])

    Claim-GcRunnerAuthorizationV1 -AuthorizationId ([string]$authorization['authorizationId'])
    $resolvedArtifactRoot = Resolve-GcRunnerArtifactRootV1 -RepositoryRoot $requestContext.RepositoryRoot -ArtifactRoot $ArtifactRoot
    $runDirectory = New-GcRunnerRunDirectoryV1 -ArtifactRoot $resolvedArtifactRoot -AuthorizationId ([string]$authorization['authorizationId'])

    $initialSnapshot = Get-GcRunnerRepositorySnapshotV1 -RepositoryRoot $requestContext.RepositoryRoot
    Assert-GcRunnerRepositoryIdentityV1 -Request $request -Snapshot $initialSnapshot
    if ($resumeCheckpoint -and -not [string]::Equals([string]$resumeCheckpoint['worktreeStatusSha256'], [string]$initialSnapshot['statusSha256'], [StringComparison]::Ordinal)) {
        Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_RESUME_WORKTREE_CHANGED'
    }

    $result = Invoke-GcProviderProcessRunnerV1 -Request $request -Authorization $authorization -Policy $policy -Profile $profile -Prompt $requestContext.Prompt.Text -CancellationPath $CancellationPath -ExecutableOverride $null -ArgumentsOverride $null -ProtocolOverride $null -PromptTransportOverride $null
    $attempts = @($result.Attempts)

    $finalSnapshot = Get-GcRunnerRepositorySnapshotV1 -RepositoryRoot $requestContext.RepositoryRoot
    $worktreePreserved = [string]::Equals([string]$initialSnapshot['repositoryRoot'], [string]$finalSnapshot['repositoryRoot'], [StringComparison]::Ordinal) -and
        [string]::Equals([string]$initialSnapshot['branch'], [string]$finalSnapshot['branch'], [StringComparison]::Ordinal) -and
        [string]::Equals([string]$initialSnapshot['head'], [string]$finalSnapshot['head'], [StringComparison]::Ordinal) -and
        [string]::Equals([string]$initialSnapshot['statusSha256'], [string]$finalSnapshot['statusSha256'], [StringComparison]::Ordinal) -and
        [long]$initialSnapshot['statusByteLength'] -eq [long]$finalSnapshot['statusByteLength']

    $state = [string]$result.State
    $failureCategory = $result.FailureCategory
    if (-not $worktreePreserved) { $state = 'FAILED'; $failureCategory = 'RUNNER_FAILURE' }

    $checkpointWritten = $false
    if ($failureCategory -in @($policy['checkpointCategories'])) {
        $checkpoint = New-GcCheckpointArtifactV1 -Request $request -Authorization $authorization -RequestSha256 $requestSha256 -State $state -FailureCategory $failureCategory -AttemptCount $attempts.Count -RepositorySnapshot $finalSnapshot -WorktreePreserved $worktreePreserved
        [void](Write-GcRunnerArtifactAtomicV1 -Artifact $checkpoint -DestinationPath ([IO.Path]::Combine($runDirectory, 'checkpoint.json')))
        $checkpointWritten = $true
    }

    $lifecycle = New-GcLifecycleArtifactV1 -Request $request -Authorization $authorization -RequestSha256 $requestSha256 -CreatedAtUtc $createdAt -State $state -FailureCategory $failureCategory -Attempts $attempts -CheckpointWritten $checkpointWritten -WorktreePreserved $worktreePreserved
    $lifecycleResult = Write-GcRunnerArtifactAtomicV1 -Artifact $lifecycle -DestinationPath ([IO.Path]::Combine($runDirectory, 'lifecycle.json'))
    Remove-GcRunnerTemporaryArtifactsV1 -RunDirectory $runDirectory

    [Console]::Out.WriteLine((ConvertTo-GcCanonicalJsonV1 -Value ([ordered]@{ state = $state; failureCategory = $failureCategory; lifecyclePath = $lifecycleResult.Path; lifecycleSha256 = $lifecycleResult.Sha256; checkpointWritten = $checkpointWritten })))
    switch ($state) {
        'COMPLETED' { exit 0 }
        'TIMED_OUT' { exit 4 }
        'CANCELLED' { exit 5 }
        default { exit 3 }
    }
}
catch {
    $category = Get-GcRunnerFailureCategoryV1 -ErrorRecord $_
    if ($runDirectory -and $request -and $authorization -and $requestSha256) {
        try {
            $worktreePreserved = $true
            if ($initialSnapshot) {
                $currentSnapshot = Get-GcRunnerRepositorySnapshotV1 -RepositoryRoot ([string]$request['repositoryRoot'])
                $worktreePreserved = [string]::Equals([string]$initialSnapshot['branch'], [string]$currentSnapshot['branch'], [StringComparison]::Ordinal) -and
                    [string]::Equals([string]$initialSnapshot['head'], [string]$currentSnapshot['head'], [StringComparison]::Ordinal) -and
                    [string]::Equals([string]$initialSnapshot['statusSha256'], [string]$currentSnapshot['statusSha256'], [StringComparison]::Ordinal)
            }
            $lifecycle = New-GcLifecycleArtifactV1 -Request $request -Authorization $authorization -RequestSha256 $requestSha256 -CreatedAtUtc $createdAt -State 'FAILED' -FailureCategory $category -Attempts $attempts -CheckpointWritten $false -WorktreePreserved $worktreePreserved
            [void](Write-GcRunnerArtifactAtomicV1 -Artifact $lifecycle -DestinationPath ([IO.Path]::Combine($runDirectory, 'lifecycle.json')))
            Remove-GcRunnerTemporaryArtifactsV1 -RunDirectory $runDirectory
        }
        catch { }
    }
    [Console]::Error.WriteLine($category)
    if ($category -eq 'AUTH_FAILED') { exit 2 }
    exit 3
}
