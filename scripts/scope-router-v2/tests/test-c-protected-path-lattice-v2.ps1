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

$authorizedInput = Copy-GcTestObjectV2 -Value $base
$authorizedInput['requestedOperations'] = [Collections.Generic.List[object]]::new(@('production_runtime_or_audio','human_authorized_protected_write'))
$authorizedInput['requestedReadPaths'] = [Collections.Generic.List[object]]::new(@('outputs/app.js'))
$authorizedInput['requestedWritePaths'] = [Collections.Generic.List[object]]::new(@('outputs/app.js'))
$authorizedInputBytes = [Text.Encoding]::UTF8.GetBytes((ConvertTo-GcCanonicalJsonV2 -Value $authorizedInput))
$authorization = [ordered]@{
    schemaVersion = 'gc-scope-router-v2.protected-write-authorization/1'
    authorizationId = 'GC_PWA_' + [Guid]::NewGuid().ToString('N')
    authorizedBy = 'Product Owner'
    authorizedAtUtc = ([DateTimeOffset]::UtcNow.AddMinutes(-1)).ToString('o')
    expiresAtUtc = ([DateTimeOffset]::UtcNow.AddHours(1)).ToString('o')
    taskId = [string]$authorizedInput['taskId']
    inputSha256 = Get-GcSha256HexV2 -Bytes $authorizedInputBytes
    repositoryRoot = [string]$identity['repositoryRoot']
    expectedBranch = [string]$identity['branch']
    expectedHead = [string]$identity['head']
    approvedWritePaths = [Collections.Generic.List[object]]::new(@('outputs/app.js'))
    reviewRequired = $true
}
$authorizationBytes = [Text.Encoding]::UTF8.GetBytes((ConvertTo-GcCanonicalJsonV2 -Value $authorization))
$authorizationContext = Assert-GcProtectedWriteAuthorizationV2 -Authorization $authorization -AuthorizationBytes $authorizationBytes -InputObject $authorizedInput -InputSha256 (Get-GcSha256HexV2 -Bytes $authorizedInputBytes) -Identity $identity -Policy $policy
$authorizedResult = Resolve-GcPathPolicyV2 -InputObject $authorizedInput -Policy $policy -RepositoryRoot $script:GcV2RepositoryRoot -ProtectedWriteAuthorization $authorizationContext
Assert-GcTestTrueV2 ($authorizedResult['blockedReasonCodes'].Count -eq 0) 'exact human-authorized protected write is not blocked'
Assert-GcTestOrdinalEqualV2 ([string]$authorizedResult['authorizedProtectedWritePaths'][0]) 'outputs/app.js' 'authorized protected path is reported separately'
Assert-GcTestTrueV2 ($authorizedResult['allowedReadPaths'].Count -eq 0) 'protected read/write path is represented only by the authorized protected write grant'
$authorizedRisk = Get-GcDeterministicRiskV2 -InputObject $authorizedInput -Policy $policy -DirtyConflicts @() -PathPolicyBlockReasons @($authorizedResult['blockedReasonCodes']) -PathPolicyRoutingReasons @($authorizedResult['routingReasonCodes'])
Assert-GcTestOrdinalEqualV2 ([string]$authorizedRisk['classification']) 'critical' 'human-authorized protected write remains critical'
Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $authorizedRisk['reasonCodes'] 'PATH_HUMAN_AUTHORIZED_PROTECTED_WRITE') 'authorized route has stable path reason'
$authorizedEvidence = New-GcDecisionEvidenceV2 -InputObject $authorizedInput -InputBytes $authorizedInputBytes -Identity $identity -PathPolicy $authorizedResult -GitState (New-GcEmptyGitStateV2) -Risk $authorizedRisk -PolicyBundle $bundle
Assert-GcEvidenceV2 -Evidence $authorizedEvidence -Policy $policy -ExpectedTaskId ([string]$authorizedInput['taskId']) | Out-Null
Assert-GcTestTrueV2 (-not $authorizedEvidence['executionPermitted'] -and -not $authorizedEvidence['autoRepairAllowed']) 'authorized route remains Shadow Mode only'
Assert-GcTestTrueV2 ([bool]$authorizedEvidence['protectedWriteAuthorization']['reviewRequired']) 'authorized route requires review'
Assert-GcTestTrueV2 (-not (ConvertTo-GcCanonicalJsonV2 $authorizedEvidence).Contains('Product Owner', [StringComparison]::Ordinal)) 'author label is not persisted in evidence'

$mismatchedAuthorization = Copy-GcTestObjectV2 -Value $authorization
$mismatchedAuthorization['expectedHead'] = 'f' * 40
Assert-GcTestThrowsReasonV2 { Assert-GcProtectedWriteAuthorizationV2 -Authorization $mismatchedAuthorization -AuthorizationBytes $authorizationBytes -InputObject $authorizedInput -InputSha256 (Get-GcSha256HexV2 -Bytes $authorizedInputBytes) -Identity $identity -Policy $policy } 'PROTECTED_WRITE_AUTHORIZATION_INVALID' 'authorization is bound to exact HEAD'
$wildcardAuthorization = Copy-GcTestObjectV2 -Value $authorization
$wildcardAuthorization['approvedWritePaths'] = [Collections.Generic.List[object]]::new(@('outputs/**'))
Assert-GcTestThrowsReasonV2 { Assert-GcProtectedWriteAuthorizationV2 -Authorization $wildcardAuthorization -AuthorizationBytes $authorizationBytes -InputObject $authorizedInput -InputSha256 (Get-GcSha256HexV2 -Bytes $authorizedInputBytes) -Identity $identity -Policy $policy } 'PROTECTED_WRITE_AUTHORIZATION_INVALID' 'authorization cannot grant a protected subtree'
$extraAuthorization = Copy-GcTestObjectV2 -Value $authorization
$extraAuthorization['approvedWritePaths'] = [Collections.Generic.List[object]]::new(@('outputs/app.js','outputs/styles.css'))
$extraBytes = [Text.Encoding]::UTF8.GetBytes((ConvertTo-GcCanonicalJsonV2 -Value $extraAuthorization))
$extraContext = Assert-GcProtectedWriteAuthorizationV2 -Authorization $extraAuthorization -AuthorizationBytes $extraBytes -InputObject $authorizedInput -InputSha256 (Get-GcSha256HexV2 -Bytes $authorizedInputBytes) -Identity $identity -Policy $policy
Assert-GcTestThrowsReasonV2 { Resolve-GcPathPolicyV2 -InputObject $authorizedInput -Policy $policy -RepositoryRoot $script:GcV2RepositoryRoot -ProtectedWriteAuthorization $extraContext } 'PROTECTED_WRITE_AUTHORIZATION_INVALID' 'authorization cannot grant an unrequested protected file'
$ancestorInput = Copy-GcTestObjectV2 -Value $authorizedInput
$ancestorInput['requestedReadPaths'] = [Collections.Generic.List[object]]::new()
$ancestorInput['requestedWritePaths'] = [Collections.Generic.List[object]]::new(@('outputs'))
$ancestorBytes = [Text.Encoding]::UTF8.GetBytes((ConvertTo-GcCanonicalJsonV2 -Value $ancestorInput))
$ancestorAuthorization = Copy-GcTestObjectV2 -Value $authorization
$ancestorAuthorization['inputSha256'] = Get-GcSha256HexV2 -Bytes $ancestorBytes
$ancestorAuthorization['approvedWritePaths'] = [Collections.Generic.List[object]]::new(@('outputs'))
$ancestorAuthorizationBytes = [Text.Encoding]::UTF8.GetBytes((ConvertTo-GcCanonicalJsonV2 -Value $ancestorAuthorization))
$ancestorContext = Assert-GcProtectedWriteAuthorizationV2 -Authorization $ancestorAuthorization -AuthorizationBytes $ancestorAuthorizationBytes -InputObject $ancestorInput -InputSha256 (Get-GcSha256HexV2 -Bytes $ancestorBytes) -Identity $identity -Policy $policy
Assert-GcTestThrowsReasonV2 { Resolve-GcPathPolicyV2 -InputObject $ancestorInput -Policy $policy -RepositoryRoot $script:GcV2RepositoryRoot -ProtectedWriteAuthorization $ancestorContext } 'PROTECTED_WRITE_AUTHORIZATION_INVALID' 'authorization cannot grant the protected namespace ancestor itself'

$blockedAuthorizedRisk = Get-GcDeterministicRiskV2 -InputObject $authorizedInput -Policy $policy -DirtyConflicts @('outputs/app.js') -PathPolicyBlockReasons @($authorizedResult['blockedReasonCodes']) -PathPolicyRoutingReasons @($authorizedResult['routingReasonCodes'])
$blockedAuthorizedEvidence = New-GcDecisionEvidenceV2 -InputObject $authorizedInput -InputBytes $authorizedInputBytes -Identity $identity -PathPolicy $authorizedResult -GitState (New-GcEmptyGitStateV2) -Risk $blockedAuthorizedRisk -PolicyBundle $bundle
Assert-GcEvidenceV2 -Evidence $blockedAuthorizedEvidence -Policy $policy -ExpectedTaskId ([string]$authorizedInput['taskId']) | Out-Null
Assert-GcTestOrdinalEqualV2 ([string]$blockedAuthorizedEvidence['classification']) 'blocked' 'dirty conflict still produces valid blocked evidence after authorization'

$entrypointTemp = New-GcTestDirectoryV2
try {
    $entrypointInputPath = [IO.Path]::Combine($entrypointTemp, 'input.json')
    $entrypointAuthorizationPath = [IO.Path]::Combine($entrypointTemp, 'authorization.json')
    $entrypointEvidencePath = [IO.Path]::Combine($entrypointTemp, 'decision.json')
    $entrypointInputText = (ConvertTo-GcCanonicalJsonV2 -Value $authorizedInput) + "`n"
    $entrypointInputBytes = [Text.UTF8Encoding]::new($false).GetBytes($entrypointInputText)
    [IO.File]::WriteAllBytes($entrypointInputPath, $entrypointInputBytes)
    $entrypointAuthorization = Copy-GcTestObjectV2 -Value $authorization
    $entrypointAuthorization['inputSha256'] = Get-GcSha256HexV2 -Bytes $entrypointInputBytes
    $entrypointAuthorizationText = (ConvertTo-GcCanonicalJsonV2 -Value $entrypointAuthorization) + "`n"
    [IO.File]::WriteAllText($entrypointAuthorizationPath, $entrypointAuthorizationText, [Text.UTF8Encoding]::new($false))
    $routerPath = [IO.Path]::Combine($script:GcV2ScriptRoot, 'gc-scope-router-v2.ps1')
    $entrypointResult = Invoke-GcChildProcessV2 -FilePath (Resolve-GcPowerShellApplicationV2) -Arguments @('-NoLogo','-NoProfile','-NonInteractive','-File',$routerPath,'-Mode','Route','-InputPath',$entrypointInputPath,'-EvidencePath',$entrypointEvidencePath,'-ProtectedWriteAuthorizationPath',$entrypointAuthorizationPath) -WorkingDirectory $script:GcV2RepositoryRoot -TimeoutMilliseconds 30000
    Assert-GcTestTrueV2 ($entrypointResult['exitCode'] -eq 0) 'production entrypoint accepts exact bound protected-write authorization'
    $entrypointEvidence = Read-GcEvidenceFileV2 -LiteralPath $entrypointEvidencePath -Policy $policy -ExpectedTaskId ([string]$authorizedInput['taskId'])
    Assert-GcTestOrdinalEqualV2 ([string]$entrypointEvidence['authorizedProtectedWritePaths'][0]) 'outputs/app.js' 'entrypoint evidence contains exact authorized protected file'
    Assert-GcTestTrueV2 (-not $entrypointEvidence['executionPermitted'] -and -not $entrypointEvidence['autoRepairAllowed']) 'entrypoint authorized decision remains Shadow Mode only'
}
finally { Remove-GcTestDirectoryV2 -LiteralPath $entrypointTemp }

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
