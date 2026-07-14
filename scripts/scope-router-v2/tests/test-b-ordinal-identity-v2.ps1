. ([IO.Path]::Combine($PSScriptRoot, 'gc-scope-router-v2-test-support.ps1'))

$bundle = Get-GcPolicyV2 -RepositoryRoot $script:GcV2RepositoryRoot
$policy = $bundle['policy']
$identity = Get-GcRepositoryIdentityV2 -RepositoryRoot $script:GcV2RepositoryRoot
$base = New-GcBaseInputV2 -Identity $identity

$branchCase = Copy-GcTestObjectV2 -Value $base
$branchCase['expectedBranch'] = ([string]$base['expectedBranch']).ToUpperInvariant()
Assert-GcTestTrueV2 (-not (Test-GcOrdinalEqualsV2 ([string]$branchCase['expectedBranch']) ([string]$identity['branch']))) 'branch case variant is ordinally distinct'
Assert-GcTestThrowsReasonV2 { Assert-GcOrdinalIdentityV2 -InputObject $branchCase -ActualIdentity $identity } 'IDENTITY_MISMATCH' 'branch case variant is rejected'

$staleHead = Copy-GcTestObjectV2 -Value $base
$staleHead['expectedHead'] = ('0' * 40)
if (Test-GcOrdinalEqualsV2 -Left ([string]$identity['head']) -Right ('0' * 40)) { $staleHead['expectedHead'] = ('1' * 40) }
Assert-GcInputSchemaV2 -InputObject $staleHead -Policy $policy | Out-Null
Assert-GcTestThrowsReasonV2 { Assert-GcOrdinalIdentityV2 -InputObject $staleHead -ActualIdentity $identity } 'IDENTITY_MISMATCH' 'stale canonical HEAD is rejected'

foreach ($invalidHead in @(([string]$identity['head']).ToUpperInvariant(), (([string]$identity['head']) + ' '), 'abc', ('g' * 40))) {
    $candidate = Copy-GcTestObjectV2 -Value $base
    $candidate['expectedHead'] = $invalidHead
    Assert-GcTestThrowsReasonV2 { Assert-GcInputSchemaV2 -InputObject $candidate -Policy $policy } 'INPUT_VALUE_INVALID' 'non-canonical HEAD is rejected before identity comparison'
}

$rootCase = Copy-GcTestObjectV2 -Value $base
$rootCase['repositoryRoot'] = ([string]$identity['repositoryRoot']).ToLowerInvariant()
if (-not (Test-GcOrdinalEqualsV2 ([string]$rootCase['repositoryRoot']) ([string]$identity['repositoryRoot']))) {
    Assert-GcTestThrowsReasonV2 { Assert-GcOrdinalIdentityV2 -InputObject $rootCase -ActualIdentity $identity } 'IDENTITY_MISMATCH' 'repository root case variant is rejected ordinally'
}
$rootTrailing = Copy-GcTestObjectV2 -Value $base
$rootTrailing['repositoryRoot'] = ([string]$identity['repositoryRoot']) + [IO.Path]::DirectorySeparatorChar
Assert-GcTestThrowsReasonV2 { Assert-GcOrdinalIdentityV2 -InputObject $rootTrailing -ActualIdentity $identity } 'IDENTITY_INVALID' 'trailing-separator root is not silently canonicalized'
$rootWhitespace = Copy-GcTestObjectV2 -Value $base
$rootWhitespace['repositoryRoot'] = ' ' + [string]$identity['repositoryRoot']
Assert-GcTestThrowsReasonV2 { Assert-GcInputSchemaV2 -InputObject $rootWhitespace -Policy $policy } 'INPUT_VALUE_INVALID' 'root whitespace is rejected'

foreach ($versionMutation in @(
    @{ field='schemaVersion'; value='GC-SCOPE-ROUTER-V2.INPUT/1' },
    @{ field='schemaVersion'; value='gc-scope-router-v2.input/1 ' },
    @{ field='policyVersion'; value='GC-SCOPE-ROUTER-V2.POLICY/1' },
    @{ field='policyVersion'; value='gc-scope-router-v2.policy/1 ' }
)) {
    $candidate = Copy-GcTestObjectV2 -Value $base
    $candidate[$versionMutation.field] = $versionMutation.value
    Assert-GcTestThrowsReasonV2 { Assert-GcInputSchemaV2 -InputObject $candidate -Policy $policy } 'INPUT_VALUE_INVALID' 'schema and policy versions are exact ordinal constants'
}

foreach ($invalidTaskId in @(("GC-V2-" + [char]0x0E01), ("GC-V2-e" + [char]0x0301), ' GC-V2-TEST', 'GC-V2-TEST ')) {
    $candidate = Copy-GcTestObjectV2 -Value $base
    $candidate['taskId'] = $invalidTaskId
    Assert-GcTestThrowsReasonV2 { Assert-GcInputSchemaV2 -InputObject $candidate -Policy $policy } 'INPUT_VALUE_INVALID' 'Unicode lookalikes, normalization variants, and whitespace are rejected in task identity'
}

$pathPolicy = Resolve-GcPathPolicyV2 -InputObject $base -Policy $policy -RepositoryRoot ([string]$identity['repositoryRoot'])
$risk = Get-GcDeterministicRiskV2 -InputObject $base -Policy $policy -DirtyConflicts @()
$inputBytes = [Text.Encoding]::UTF8.GetBytes((ConvertTo-GcCanonicalJsonV2 -Value $base))
$evidence = New-GcDecisionEvidenceV2 -InputObject $base -InputBytes $inputBytes -Identity $identity -PathPolicy $pathPolicy -GitState (New-GcEmptyGitStateV2) -Risk $risk -PolicyBundle $bundle
Assert-GcEvidenceV2 -Evidence $evidence -Policy $policy -ExpectedTaskId 'GC-V2-TEST' | Out-Null
Assert-GcTestThrowsReasonV2 { Assert-GcEvidenceV2 -Evidence $evidence -Policy $policy -ExpectedTaskId 'gc-v2-test' } 'OUTPUT_SEMANTIC_INVALID' 'task IDs differing only by case remain distinct during evidence validation'

function global:git { throw 'ALIAS_INTERCEPTION_SENTINEL' }
try {
    $gitApplication = Resolve-GcSystemGitV2
    Assert-GcTestTrueV2 ([IO.File]::Exists($gitApplication)) 'System Git resolution returns an application despite a same-name function'
    $identityWithAlias = Get-GcRepositoryIdentityV2 -RepositoryRoot $script:GcV2RepositoryRoot
    Assert-GcTestOrdinalEqualV2 ([string]$identityWithAlias['head']) ([string]$identity['head']) 'same-name function cannot intercept Git identity'
}
finally { Remove-Item -LiteralPath Function:\global:git -ErrorAction SilentlyContinue }

[Console]::Out.WriteLine('PASS B ORDINAL IDENTITY')
