. ([IO.Path]::Combine($PSScriptRoot, 'gc-scope-router-v2-test-support.ps1'))

$bundle = Get-GcPolicyV2 -RepositoryRoot $script:GcV2RepositoryRoot
$policy = $bundle['policy']
$identity = Get-GcRepositoryIdentityV2 -RepositoryRoot $script:GcV2RepositoryRoot
$base = New-GcBaseInputV2 -Identity $identity

$protectedCandidates = @(
    'outputs',
    'outputs/',
    'outputs/data.json',
    'scripts/gc-orchestrator-host-broker.ps1',
    'scripts/gc-orchestrator-host-broker.ps1/child',
    'scripts'
)
foreach ($candidatePath in $protectedCandidates) {
    $candidate = Copy-GcTestObjectV2 -Value $base
    $candidate['requestedWritePaths'] = [Collections.Generic.List[object]]::new(@($candidatePath))
    $blockedPath = Resolve-GcPathPolicyV2 -InputObject $candidate -Policy $policy -RepositoryRoot $script:GcV2RepositoryRoot
    Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $blockedPath['blockedReasonCodes'] 'PATH_PROTECTED_NAMESPACE_OVERLAP') 'protected exact paths, descendants, and ancestors are blocked without persisting the candidate'
    $blockedRisk = Get-GcDeterministicRiskV2 -InputObject $candidate -Policy $policy -DirtyConflicts @() -PathPolicyBlockReasons @($blockedPath['blockedReasonCodes'])
    Assert-GcTestOrdinalEqualV2 ([string]$blockedRisk['classification']) 'blocked' 'protected namespace overlap maps to blocked route'
}

foreach ($rootScope in @('.', './', '*', '**', '/**')) {
    Assert-GcTestThrowsReasonV2 { ConvertTo-GcPathScopeV2 -Scope $rootScope -FieldId 'requestedWritePaths' } 'PATH_ROOT_SCOPE_BLOCKED' 'root and dot scopes are blocked'
}

foreach ($invalidScope in @(
    '../outside', 'docs/../outputs', 'C:/outside', 'C:outside', '//server/share', '\\?\C:\device',
    'docs/file.txt:secret', '/absolute', 'docs\file.txt', 'docs/*', 'docs/**/nested', 'docs//nested'
)) {
    Assert-GcTestThrowsReasonV2 { ConvertTo-GcPathScopeV2 -Scope $invalidScope -FieldId 'requestedWritePaths' } 'PATH_SCOPE_INVALID' 'traversal, absolute, UNC/device, ADS, backslash, and ambiguous wildcard scopes are rejected'
}

$safe = Copy-GcTestObjectV2 -Value $base
$safe['requestedReadPaths'] = [Collections.Generic.List[object]]::new(@('docs/read-only.md'))
$safe['requestedWritePaths'] = [Collections.Generic.List[object]]::new(@('schemas/safe-sibling.json'))
$safeResult = Resolve-GcPathPolicyV2 -InputObject $safe -Policy $policy -RepositoryRoot $script:GcV2RepositoryRoot
Assert-GcTestOrdinalEqualV2 ([string]$safeResult['allowedWritePaths'][0]) 'schemas/safe-sibling.json' 'verified non-overlapping sibling is accepted'

$partitionOverlap = Copy-GcTestObjectV2 -Value $base
$partitionOverlap['requestedReadPaths'] = [Collections.Generic.List[object]]::new(@('docs'))
$partitionOverlap['requestedWritePaths'] = [Collections.Generic.List[object]]::new(@('docs/child.md'))
$partitionResult = Resolve-GcPathPolicyV2 -InputObject $partitionOverlap -Policy $policy -RepositoryRoot $script:GcV2RepositoryRoot
Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $partitionResult['blockedReasonCodes'] 'PATH_INPUT_PARTITION_OVERLAP') 'read and write partition overlap is blocked'

$left = ConvertTo-GcPathScopeV2 -Scope 'outputs/**'
$rightExact = ConvertTo-GcPathScopeV2 -Scope 'outputs'
$rightDescendant = ConvertTo-GcPathScopeV2 -Scope 'outputs/deep/file.json'
$rightAncestor = ConvertTo-GcPathScopeV2 -Scope 'outputs'
Assert-GcTestTrueV2 (Test-GcPathScopeOverlapV2 -Left $left -Right $rightExact) 'protected exact namespace overlaps'
Assert-GcTestTrueV2 (Test-GcPathScopeOverlapV2 -Left $left -Right $rightDescendant) 'protected descendant overlaps'
Assert-GcTestTrueV2 (Test-GcPathScopeOverlapV2 -Left $rightDescendant -Right $left) 'namespace overlap is symmetric'
Assert-GcTestTrueV2 (Test-GcPathScopeOverlapV2 -Left $rightAncestor -Right $left) 'protected ancestor overlaps'
Assert-GcTestTrueV2 (-not (Test-GcPathScopeOverlapV2 -Left (ConvertTo-GcPathScopeV2 'output-safe') -Right $left)) 'non-overlapping namespace is distinct'

$temp = New-GcTestDirectoryV2
try {
    $target = [IO.Path]::Combine($temp, 'target')
    $junction = [IO.Path]::Combine($temp, 'junction')
    [IO.Directory]::CreateDirectory($target) | Out-Null
    New-Item -ItemType Junction -Path $junction -Target $target -ErrorAction Stop | Out-Null
    $junctionScope = ConvertTo-GcPathScopeV2 -Scope 'junction/non-existing/file.txt' -FieldId 'requestedWritePaths'
    Assert-GcTestThrowsReasonV2 { Assert-GcNoReparseEscapeV2 -RepositoryRoot $temp -Scope $junctionScope -FieldId 'requestedWritePaths' } 'PATH_REPARSE_ESCAPE' 'non-existing descendants beneath a reparse ancestor are blocked'
}
finally { Remove-GcTestDirectoryV2 -LiteralPath $temp }

[Console]::Out.WriteLine('PASS C PROTECTED PATH LATTICE')
