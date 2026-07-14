param([switch]$SuiteHOnly)

. ([IO.Path]::Combine($PSScriptRoot, 'gc-scope-router-v2-test-support.ps1'))

if (-not $SuiteHOnly) {
foreach ($suite in @(
    'test-a-input-consumption-v2.ps1',
    'test-b-ordinal-identity-v2.ps1',
    'test-c-protected-path-lattice-v2.ps1',
    'test-d-actual-git-dirty-state-v2.ps1',
    'test-e-evidence-sanitization-v2.ps1'
)) {
    & ([IO.Path]::Combine($PSScriptRoot, $suite))
}

foreach ($scriptFile in [IO.Directory]::EnumerateFiles($script:GcV2ScriptRoot, '*.ps1', [IO.SearchOption]::AllDirectories)) {
    $tokens = $null
    $parseErrors = $null
    [void][Management.Automation.Language.Parser]::ParseFile($scriptFile, [ref]$tokens, [ref]$parseErrors)
    Assert-GcTestTrueV2 ($parseErrors.Count -eq 0) 'every V2 PowerShell file parses without errors'
}

$validNested = ConvertFrom-GcStrictJsonV2 -Bytes ([Text.Encoding]::UTF8.GetBytes('{"a":1,"nested":{"a":2}}'))
Assert-GcTestTrueV2 ([int64]$validNested['nested']['a'] -eq 2) 'same key is allowed in a different object scope'
foreach ($invalidJson in @(
    '{"a":1,"a":2}',
    '{"a":1,"\u0061":2}',
    '{"x":"\uD800"}',
    '{"a":1,}',
    "{`"a`":1}//comment",
    "{`"a`":1}`n{`"b`":2}",
    '{"a":1}{"b":2}',
    'prose {"a":1}',
    '```json {"a":1} ```',
    '{"n":NaN}',
    '{"n":Infinity}'
)) {
    Assert-GcTestThrowsReasonV2 { ConvertFrom-GcStrictJsonV2 -Bytes ([Text.Encoding]::UTF8.GetBytes($invalidJson)) } 'JSON_DOCUMENT_INVALID' 'strict JSON rejects duplicate/salvage/non-standard documents'
}
$bomDocument = [byte[]](0xEF,0xBB,0xBF,0x7B,0x7D)
Assert-GcTestThrowsReasonV2 { ConvertFrom-GcStrictJsonV2 -Bytes $bomDocument } 'JSON_DOCUMENT_INVALID' 'strict JSON rejects BOM'
[Console]::Out.WriteLine('PASS F STRICT JSON')

$bundle = Get-GcPolicyV2 -RepositoryRoot $script:GcV2RepositoryRoot
$policy = $bundle['policy']
$identity = Get-GcRepositoryIdentityV2 -RepositoryRoot $script:GcV2RepositoryRoot
$routeCases = [ordered]@{
    documentation_edit = @('simple','fast-path')
    isolated_experiment = @('moderate','planned-path')
    cross_subsystem_change = @('complex','architecture-path')
    strict_parser_trust_boundary = @('critical','critical-controlled-path')
    force_push = @('blocked','blocked-path')
}
foreach ($operation in $routeCases.Keys) {
    $input = New-GcBaseInputV2 -Identity $identity
    $input['requestedOperations'] = @([string]$operation)
    Assert-GcInputSchemaV2 -InputObject $input -Policy $policy | Out-Null
    $pathPolicy = Resolve-GcPathPolicyV2 -InputObject $input -Policy $policy -RepositoryRoot ([string]$identity['repositoryRoot'])
    $risk = Get-GcDeterministicRiskV2 -InputObject $input -Policy $policy -DirtyConflicts @() -PathPolicyBlockReasons @($pathPolicy['blockedReasonCodes'])
    Assert-GcTestOrdinalEqualV2 ([string]$risk['classification']) ([string]$routeCases[$operation][0]) 'representative deterministic classification matches policy'
    Assert-GcTestOrdinalEqualV2 ([string]$risk['route']) ([string]$routeCases[$operation][1]) 'representative route matches policy'
    $inputBytes = [Text.Encoding]::UTF8.GetBytes((ConvertTo-GcCanonicalJsonV2 $input))
    $evidence = New-GcDecisionEvidenceV2 -InputObject $input -InputBytes $inputBytes -Identity $identity -PathPolicy $pathPolicy -GitState (New-GcEmptyGitStateV2) -Risk $risk -PolicyBundle $bundle
    Assert-GcEvidenceV2 -Evidence $evidence -Policy $policy -ExpectedTaskId ([string]$input['taskId']) | Out-Null
    Assert-GcTestTrueV2 (-not $evidence['executionPermitted'] -and -not $evidence['autoRepairAllowed']) 'all representative routes remain Shadow Mode only'
    if (Test-GcOrdinalEqualsV2 ([string]$risk['classification']) 'blocked') {
        Assert-GcTestTrueV2 ($null -eq $evidence['recommendedWriter']) 'blocked route has no writer'
    }
    else {
        Assert-GcTestOrdinalEqualV2 ([string]$evidence['recommendedWriter']) 'Codex Implementer' 'non-blocked route has exactly one fixed writer'
    }
    foreach ($reviewer in $evidence['reviewers']) { Assert-GcTestTrueV2 ([bool]$reviewer['readOnly']) 'every reviewer is read-only' }
}
[Console]::Out.WriteLine('PASS G SCHEMA SEMANTICS AND ROUTING')
}

if ($SuiteHOnly) {
    $bundle = Get-GcPolicyV2 -RepositoryRoot $script:GcV2RepositoryRoot
    $policy = $bundle['policy']
    $identity = Get-GcRepositoryIdentityV2 -RepositoryRoot $script:GcV2RepositoryRoot
}

$sentinelCollision = $true
while ($sentinelCollision) {
    $rejectedValueSentinel = 'GC_V2_SENTINEL_' + [Guid]::NewGuid().ToString('N')
    $sentinelCollision = $false
    foreach ($repositoryFile in [IO.Directory]::EnumerateFiles($script:GcV2RepositoryRoot, '*', [IO.SearchOption]::AllDirectories)) {
        if ([IO.Path]::GetExtension($repositoryFile) -notin @('.ps1','.json','.md','.txt','.js','.css','.html','.cmd')) { continue }
        try {
            if ([IO.File]::ReadAllText($repositoryFile).Contains($rejectedValueSentinel, [StringComparison]::Ordinal)) {
                $sentinelCollision = $true
                break
            }
        }
        catch { }
    }
}

$atomicRoot = New-GcTestDirectoryV2
try {
    $input = New-GcBaseInputV2 -Identity $identity
    $pathPolicy = Resolve-GcPathPolicyV2 -InputObject $input -Policy $policy -RepositoryRoot ([string]$identity['repositoryRoot'])
    $risk = Get-GcDeterministicRiskV2 -InputObject $input -Policy $policy -DirtyConflicts @() -PathPolicyBlockReasons @($pathPolicy['blockedReasonCodes'])
    $inputBytes = [Text.Encoding]::UTF8.GetBytes((ConvertTo-GcCanonicalJsonV2 $input))
    $firstEvidence = New-GcDecisionEvidenceV2 -InputObject $input -InputBytes $inputBytes -Identity $identity -PathPolicy $pathPolicy -GitState (New-GcEmptyGitStateV2) -Risk $risk -PolicyBundle $bundle
    $repeatEvidence = New-GcDecisionEvidenceV2 -InputObject $input -InputBytes $inputBytes -Identity $identity -PathPolicy $pathPolicy -GitState (New-GcEmptyGitStateV2) -Risk $risk -PolicyBundle $bundle
    Assert-GcTestOrdinalEqualV2 (ConvertTo-GcCanonicalJsonV2 $firstEvidence) (ConvertTo-GcCanonicalJsonV2 $repeatEvidence) 'unchanged inputs produce byte-identical deterministic evidence'

    $evidencePath = [IO.Path]::Combine($atomicRoot, 'decision.json')
    $routerPath = [IO.Path]::Combine($script:GcV2ScriptRoot, 'gc-scope-router-v2.ps1')
    Write-GcEvidenceAtomicV2 -Evidence $firstEvidence -DestinationPath $evidencePath -Policy $policy -RouterScriptPath $routerPath -ExpectedTaskId ([string]$input['taskId']) | Out-Null
    Read-GcEvidenceFileV2 -LiteralPath $evidencePath -Policy $policy -ExpectedTaskId ([string]$input['taskId']) | Out-Null

    $criticalInput = Copy-GcTestObjectV2 $input
    $criticalInput['requestedOperations'] = @('strict_parser_trust_boundary')
    $criticalRisk = Get-GcDeterministicRiskV2 -InputObject $criticalInput -Policy $policy -DirtyConflicts @()
    $criticalBytes = [Text.Encoding]::UTF8.GetBytes((ConvertTo-GcCanonicalJsonV2 $criticalInput))
    $criticalEvidence = New-GcDecisionEvidenceV2 -InputObject $criticalInput -InputBytes $criticalBytes -Identity $identity -PathPolicy $pathPolicy -GitState (New-GcEmptyGitStateV2) -Risk $criticalRisk -PolicyBundle $bundle
    Write-GcEvidenceAtomicV2 -Evidence $criticalEvidence -DestinationPath $evidencePath -Policy $policy -RouterScriptPath $routerPath -ExpectedTaskId ([string]$input['taskId']) | Out-Null
    $validPriorBytes = [IO.File]::ReadAllBytes($evidencePath)

    $expectedChildFailure = 'EVIDENCE_CHILD_INVALID|child.exitCode|-|V2-EVIDENCE-CHILD-EXIT|evidence'
    $validatorProcess = [Diagnostics.Process]::new()
    try {
        $validatorStart = [Diagnostics.ProcessStartInfo]::new()
        $validatorStart.FileName = Resolve-GcPowerShellApplicationV2
        $validatorStart.WorkingDirectory = $script:GcV2ScriptRoot
        $validatorStart.UseShellExecute = $false
        $validatorStart.CreateNoWindow = $true
        $validatorStart.RedirectStandardOutput = $true
        $validatorStart.RedirectStandardError = $true
        foreach ($argument in @('-NoLogo','-NoProfile','-NonInteractive','-File',$routerPath,'-Mode','ValidateEvidence','-EvidencePath',$evidencePath,'-ExpectedTaskId',$rejectedValueSentinel)) {
            [void]$validatorStart.ArgumentList.Add($argument)
        }
        $validatorProcess.StartInfo = $validatorStart
        Assert-GcTestTrueV2 ($validatorProcess.Start()) 'sentinel validator process starts'
        $validatorStdoutTask = $validatorProcess.StandardOutput.ReadToEndAsync()
        $validatorStderrTask = $validatorProcess.StandardError.ReadToEndAsync()
        Assert-GcTestTrueV2 ($validatorProcess.WaitForExit(20000)) 'sentinel validator process exits within timeout'
        $validatorStdout = $validatorStdoutTask.GetAwaiter().GetResult()
        $validatorStderr = $validatorStderrTask.GetAwaiter().GetResult()
        Assert-GcTestTrueV2 ($validatorProcess.ExitCode -ne 0) 'sentinel validator process returns nonzero'
    }
    finally { $validatorProcess.Dispose() }

    $failedFirstPath = [IO.Path]::Combine($atomicRoot, 'failed-first-write.json')
    $firstWriteFailure = $null
    try { Write-GcEvidenceAtomicV2 -Evidence $firstEvidence -DestinationPath $failedFirstPath -Policy $policy -RouterScriptPath $routerPath -ExpectedTaskId ([string]$input['taskId']) -ChildExpectedTaskId $rejectedValueSentinel | Out-Null }
    catch { $firstWriteFailure = $_.Exception.Message }
    Assert-GcTestOrdinalEqualV2 $firstWriteFailure $expectedChildFailure 'failed first write returns the stable child-validation failure'
    Assert-GcTestTrueV2 (-not [IO.File]::Exists($failedFirstPath)) 'failed first write leaves no final artifact'

    $replacementFailure = $null
    try { Write-GcEvidenceAtomicV2 -Evidence $firstEvidence -DestinationPath $evidencePath -Policy $policy -RouterScriptPath $routerPath -ExpectedTaskId ([string]$input['taskId']) -ChildExpectedTaskId $rejectedValueSentinel | Out-Null }
    catch { $replacementFailure = $_.Exception.Message }
    Assert-GcTestOrdinalEqualV2 $replacementFailure $expectedChildFailure 'checked child nonzero exit remains the original stable failure after rollback'
    Assert-GcTestOrdinalEqualV2 (Get-GcSha256HexV2 -Bytes $validPriorBytes) (Get-GcSha256HexV2 -Bytes ([IO.File]::ReadAllBytes($evidencePath))) 'prior valid artifact is restored byte-for-byte after child failure'
    $restoredEvidence = Read-GcEvidenceFileV2 -LiteralPath $evidencePath -Policy $policy -ExpectedTaskId ([string]$input['taskId'])
    Assert-GcTestTrueV2 (-not $restoredEvidence['executionPermitted'] -and -not $restoredEvidence['autoRepairAllowed']) 'independently validated rollback artifact remains Shadow Mode only'
    foreach ($routerOutput in @($validatorStdout, $validatorStderr)) {
        Assert-GcTestTrueV2 (-not $routerOutput.Contains($rejectedValueSentinel, [StringComparison]::Ordinal)) 'randomized rejected value is absent from Router stdout and stderr'
    }
    foreach ($artifact in [IO.Directory]::EnumerateFiles($atomicRoot)) {
        $artifactText = [IO.File]::ReadAllText($artifact, [Text.UTF8Encoding]::new($false, $true))
        Assert-GcTestTrueV2 (-not $artifactText.Contains($rejectedValueSentinel, [StringComparison]::Ordinal)) 'randomized rejected value is absent from Router-generated artifacts, logs, temp files, and backups'
    }
    Assert-GcTestTrueV2 (@([IO.Directory]::EnumerateFiles($atomicRoot) | Where-Object { $_ -match '\.(tmp|bak)$' }).Count -eq 0) 'temporary and backup files are cleaned after success and rollback'

    $tampered = Copy-GcTestObjectV2 $criticalEvidence
    $originalEvidenceHash = [string]$tampered['decisionContentSha256']
    $mutatedHashCharacter = if ($originalEvidenceHash[0] -ceq '0') { '1' } else { '0' }
    $tampered['decisionContentSha256'] = $mutatedHashCharacter + $originalEvidenceHash.Substring(1)
    $tamperFailure = $null
    try { Assert-GcEvidenceV2 -Evidence $tampered -Policy $policy -ExpectedTaskId ([string]$input['taskId']) | Out-Null }
    catch { $tamperFailure = $_.Exception.Message }
    Assert-GcTestOrdinalEqualV2 $tamperFailure 'EVIDENCE_HASH_INVALID|output.decisionContentSha256|-|V2-EVIDENCE-HASH|evidence' 'hash-only tamper returns the stable evidence-hash failure before semantic validation'
}
finally { Remove-GcTestDirectoryV2 -LiteralPath $atomicRoot }
[Console]::Out.WriteLine('PASS H ATOMIC EVIDENCE CHILD EXIT ROLLBACK AND DETERMINISM')

[Console]::Out.WriteLine('PASS ALL GC SCOPE ROUTER V2 BEHAVIORAL SUITES')
