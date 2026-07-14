param(
    [ValidateSet('Route','ValidateEvidence')][string]$Mode = 'Route',
    [AllowNull()][string]$InputPath,
    [AllowNull()][string]$EvidencePath,
    [AllowNull()][AllowEmptyString()][string]$ExpectedTaskId
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$moduleFiles = @(
    'gc-strict-json-v2.ps1',
    'gc-identity-v2.ps1',
    'gc-path-policy-v2.ps1',
    'gc-git-state-v2.ps1',
    'gc-policy-v2.ps1',
    'gc-semantic-v2.ps1',
    'gc-evidence-v2.ps1'
)
foreach ($moduleFile in $moduleFiles) { . ([IO.Path]::Combine($PSScriptRoot, $moduleFile)) }

$repositoryRoot = [IO.Path]::GetFullPath([IO.Path]::Combine($PSScriptRoot, '..', '..'))
$routerScriptPath = [IO.Path]::GetFullPath($PSCommandPath)

try { $policyBundle = Get-GcPolicyV2 -RepositoryRoot $repositoryRoot }
catch {
    [Console]::Error.WriteLine('GC_SCOPE_ROUTER_V2_CONTRACT_FAILURE')
    exit 3
}
$policy = $policyBundle['policy']

if (Test-GcOrdinalEqualsV2 $Mode 'ValidateEvidence') {
    if ([string]::IsNullOrEmpty($EvidencePath)) {
        [Console]::Error.WriteLine('GC_SCOPE_ROUTER_V2_VALIDATION_ARGUMENT_FAILURE')
        exit 4
    }
    try {
        Read-GcEvidenceFileV2 -LiteralPath $EvidencePath -Policy $policy -ExpectedTaskId $ExpectedTaskId | Out-Null
        [Console]::Out.WriteLine('GC_SCOPE_ROUTER_V2_EVIDENCE_VALID')
        exit 0
    }
    catch {
        [Console]::Error.WriteLine('GC_SCOPE_ROUTER_V2_EVIDENCE_INVALID')
        exit 5
    }
}

if ([string]::IsNullOrEmpty($InputPath) -or [string]::IsNullOrEmpty($EvidencePath)) {
    [Console]::Error.WriteLine('GC_SCOPE_ROUTER_V2_ROUTE_ARGUMENT_FAILURE')
    exit 4
}

$inputBytes = [byte[]]::new(0)
try {
    $inputBytes = Read-GcStrictUtf8V2 -LiteralPath $InputPath
    $inputObject = ConvertFrom-GcStrictJsonV2 -Bytes $inputBytes
    Assert-GcInputSchemaV2 -InputObject $inputObject -Policy $policy | Out-Null

    $identity = Get-GcRepositoryIdentityV2 -RepositoryRoot ([string]$inputObject['repositoryRoot'])
    Assert-GcOrdinalIdentityV2 -InputObject $inputObject -ActualIdentity $identity | Out-Null

    $pathPolicy = Resolve-GcPathPolicyV2 -InputObject $inputObject -Policy $policy -RepositoryRoot ([string]$identity['repositoryRoot'])
    $gitState = Get-GcGitStateV2 -RepositoryRoot ([string]$identity['repositoryRoot'])
    $dirtyConflicts = @(Get-GcDirtyScopeConflictsV2 -WriteScopes $pathPolicy['writeScopes'] -GitState $gitState)
    $deterministicRisk = Get-GcDeterministicRiskV2 -InputObject $inputObject -Policy $policy -DirtyConflicts $dirtyConflicts -PathPolicyBlockReasons @($pathPolicy['blockedReasonCodes'])
    $assessor = if (Test-GcObjectHasKeyV2 -Object $inputObject -Key 'assessorResult') { $inputObject['assessorResult'] } else { $null }
    $risk = Merge-GcAssessorRiskV2 -DeterministicRisk $deterministicRisk -Assessor $assessor -Policy $policy

    $evidence = New-GcDecisionEvidenceV2 -InputObject $inputObject -InputBytes $inputBytes -Identity $identity -PathPolicy $pathPolicy -GitState $gitState -Risk $risk -PolicyBundle $policyBundle
    Assert-GcEvidenceV2 -Evidence $evidence -Policy $policy -ExpectedTaskId ([string]$inputObject['taskId']) | Out-Null
    Write-GcEvidenceAtomicV2 -Evidence $evidence -DestinationPath $EvidencePath -Policy $policy -RouterScriptPath $routerScriptPath -ExpectedTaskId ([string]$inputObject['taskId']) | Out-Null
    [Console]::Out.WriteLine('GC_SCOPE_ROUTER_V2_DECISION_WRITTEN')
    exit 0
}
catch {
    $failureRecord = ConvertFrom-GcFailureRecordV2 -Exception $_.Exception
    try {
        $rejection = New-GcSanitizedFailureV2 -InputBytes $inputBytes -FailureRecord $failureRecord -Policy $policy
        Assert-GcEvidenceV2 -Evidence $rejection -Policy $policy -ExpectedTaskId $null | Out-Null
        Write-GcEvidenceAtomicV2 -Evidence $rejection -DestinationPath $EvidencePath -Policy $policy -RouterScriptPath $routerScriptPath -ExpectedTaskId $null | Out-Null
        [Console]::Error.WriteLine([string]$failureRecord['reasonCode'])
        exit 2
    }
    catch {
        [Console]::Error.WriteLine('GC_SCOPE_ROUTER_V2_EVIDENCE_FAILURE')
        exit 6
    }
}
