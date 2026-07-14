. ([IO.Path]::Combine($PSScriptRoot, 'gc-scope-router-v2-test-support.ps1'))

$bundle = Get-GcPolicyV2 -RepositoryRoot $script:GcV2RepositoryRoot
$policy = $bundle['policy']
$identity = Get-GcRepositoryIdentityV2 -RepositoryRoot $script:GcV2RepositoryRoot
$base = New-GcBaseInputV2 -Identity $identity

Assert-GcInputSchemaV2 -InputObject $base -Policy $policy | Out-Null
Assert-GcInputConsumptionContractV2 -InputSchema $bundle['inputSchema'] -AssessorSchema $bundle['assessorSchema'] -Manifest $bundle['consumption'] | Out-Null

$manifestPointers = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
foreach ($entry in $bundle['consumption']['entries']) { Assert-GcTestTrueV2 ($manifestPointers.Add([string]$entry['pointer'])) 'every accepted pointer has exactly one manifest entry' }
Assert-GcTestTrueV2 ($manifestPointers.Count -eq 14) 'all ten top-level and four nested assessor properties are enumerated'

$classificationCases = [ordered]@{
    documentation_edit = 'simple'
    isolated_experiment = 'moderate'
    cross_subsystem_change = 'complex'
    strict_parser_trust_boundary = 'critical'
    force_push = 'blocked'
}
foreach ($operation in $classificationCases.Keys) {
    $candidate = Copy-GcTestObjectV2 -Value $base
    $candidate['requestedOperations'] = [Collections.Generic.List[object]]::new(@([string]$operation))
    Assert-GcInputSchemaV2 -InputObject $candidate -Policy $policy | Out-Null
    $risk = Get-GcDeterministicRiskV2 -InputObject $candidate -Policy $policy -DirtyConflicts @()
    Assert-GcTestOrdinalEqualV2 ([string]$risk['classification']) ([string]$classificationCases[$operation]) 'requestedOperations is consumed by classification'
}

$pathCandidate = Copy-GcTestObjectV2 -Value $base
$pathCandidate['requestedReadPaths'] = [Collections.Generic.List[object]]::new(@('docs/one.md'))
$pathCandidate['requestedWritePaths'] = [Collections.Generic.List[object]]::new(@('schemas/one.json'))
$pathResult = Resolve-GcPathPolicyV2 -InputObject $pathCandidate -Policy $policy -RepositoryRoot $script:GcV2RepositoryRoot
Assert-GcTestOrdinalEqualV2 ([string]$pathResult['allowedReadPaths'][0]) 'docs/one.md' 'requestedReadPaths is consumed by path policy'
Assert-GcTestOrdinalEqualV2 ([string]$pathResult['allowedWritePaths'][0]) 'schemas/one.json' 'requestedWritePaths is consumed by path policy'

$deterministicCritical = [ordered]@{ classification='critical'; rank=[int64]4; route='critical-controlled-path'; reasonCodes=@('OP_STRICT_PARSER') }
$lowerAssessor = [ordered]@{ schemaVersion='gc-scope-router-v2.assessor/1'; classification='simple'; uncertainty='low'; flags=@() }
$merged = Merge-GcAssessorRiskV2 -DeterministicRisk $deterministicCritical -Assessor $lowerAssessor -Policy $policy
Assert-GcTestOrdinalEqualV2 ([string]$merged['classification']) 'critical' 'assessor cannot lower deterministic risk'
$raisingAssessor = [ordered]@{ schemaVersion='gc-scope-router-v2.assessor/1'; classification='simple'; uncertainty='medium'; flags=@('security_sensitive') }
$simpleRisk = [ordered]@{ classification='simple'; rank=[int64]1; route='fast-path'; reasonCodes=@('OP_DOCUMENTATION') }
$mergedRaised = Merge-GcAssessorRiskV2 -DeterministicRisk $simpleRisk -Assessor $raisingAssessor -Policy $policy
Assert-GcTestOrdinalEqualV2 ([string]$mergedRaised['classification']) 'critical' 'assessor uncertainty and flags are consumed and can raise risk'

foreach ($rejectedName in $bundle['consumption']['knownRejectedProperties']) {
    $candidate = Copy-GcTestObjectV2 -Value $base
    $candidate.Add([string]$rejectedName, 'ignored-value')
    Assert-GcTestThrowsReasonV2 { Assert-GcInputSchemaV2 -InputObject $candidate -Policy $policy } 'INPUT_UNKNOWN_PROPERTY' 'known V1 fields are rejected rather than ignored'
}
$nestedUnknown = Copy-GcTestObjectV2 -Value $base
$nestedUnknown.Add('assessorResult', [ordered]@{ schemaVersion='gc-scope-router-v2.assessor/1'; classification='simple'; uncertainty='low'; flags=@(); prompt='ignored' })
Assert-GcTestThrowsReasonV2 { Assert-GcInputSchemaV2 -InputObject $nestedUnknown -Policy $policy } 'INPUT_UNKNOWN_PROPERTY' 'nested assessor unknown fields are rejected'

$duplicate = Copy-GcTestObjectV2 -Value $base
$duplicate['requestedOperations'] = [Collections.Generic.List[object]]::new(@('documentation_edit','documentation_edit'))
Assert-GcTestThrowsReasonV2 { Assert-GcInputSchemaV2 -InputObject $duplicate -Policy $policy } 'INPUT_DUPLICATE_ITEM' 'duplicate operations are rejected ordinally'

[Console]::Out.WriteLine('PASS A INPUT CONSUMPTION CONTRACT')
