. ([IO.Path]::Combine($PSScriptRoot, 'gc-scope-router-v2-test-support.ps1'))

function Invoke-GcRouterSanitizationCaseV2 {
    param([Parameter(Mandatory)][string]$InputPath, [Parameter(Mandatory)][string]$EvidencePath)
    $process = [Diagnostics.Process]::new()
    try {
        $start = [Diagnostics.ProcessStartInfo]::new()
        $start.FileName = Resolve-GcPowerShellApplicationV2
        $start.WorkingDirectory = $script:GcV2RepositoryRoot
        $start.UseShellExecute = $false
        $start.CreateNoWindow = $true
        $start.RedirectStandardOutput = $true
        $start.RedirectStandardError = $true
        foreach ($argument in @('-NoLogo','-NoProfile','-NonInteractive','-File',([IO.Path]::Combine($script:GcV2ScriptRoot,'gc-scope-router-v2.ps1')),'-Mode','Route','-InputPath',$InputPath,'-EvidencePath',$EvidencePath)) {
            [void]$start.ArgumentList.Add($argument)
        }
        $process.StartInfo = $start
        if (-not $process.Start()) { throw 'TEST_ROUTER_START_FAILED' }
        $stdoutTask = $process.StandardOutput.ReadToEndAsync()
        $stderrTask = $process.StandardError.ReadToEndAsync()
        if (-not $process.WaitForExit(30000)) { try { $process.Kill($true) } catch { }; throw 'TEST_ROUTER_TIMEOUT' }
        $stdout = $stdoutTask.GetAwaiter().GetResult()
        $stderr = $stderrTask.GetAwaiter().GetResult()
        return [ordered]@{ exitCode=$process.ExitCode; stdout=$stdout; stderr=$stderr }
    }
    finally { $process.Dispose() }
}

$bundle = Get-GcPolicyV2 -RepositoryRoot $script:GcV2RepositoryRoot
$identity = Get-GcRepositoryIdentityV2 -RepositoryRoot $script:GcV2RepositoryRoot
$base = New-GcBaseInputV2 -Identity $identity
$cases = [Collections.Generic.List[object]]::new()

$sentinelPath = 'PATH_SENTINEL_' + [Guid]::NewGuid().ToString('N')
$invalidPath = Copy-GcTestObjectV2 -Value $base
$invalidPath['requestedWritePaths'] = [Collections.Generic.List[object]]::new(@("../$sentinelPath"))
$cases.Add([ordered]@{ name='invalid-path'; sentinel=$sentinelPath; text=(ConvertTo-GcCanonicalJsonV2 $invalidPath) })

$sentinelOperation = 'OPERATION_SENTINEL_' + [Guid]::NewGuid().ToString('N')
$invalidOperation = Copy-GcTestObjectV2 -Value $base
$invalidOperation['requestedOperations'] = [Collections.Generic.List[object]]::new(@($sentinelOperation))
$cases.Add([ordered]@{ name='invalid-operation'; sentinel=$sentinelOperation; text=(ConvertTo-GcCanonicalJsonV2 $invalidOperation) })

$sentinelCredential = 'sk-CREDENTIAL_SENTINEL_' + [Guid]::NewGuid().ToString('N')
$credentialUnknown = Copy-GcTestObjectV2 -Value $base
$credentialUnknown.Add('apiToken', $sentinelCredential)
$cases.Add([ordered]@{ name='credential-like-unknown'; sentinel=$sentinelCredential; text=(ConvertTo-GcCanonicalJsonV2 $credentialUnknown) })

$sentinelIdentity = 'IDENTITY_SENTINEL_' + [Guid]::NewGuid().ToString('N')
$invalidIdentity = Copy-GcTestObjectV2 -Value $base
$invalidIdentity['taskId'] = $sentinelIdentity + ' '
$cases.Add([ordered]@{ name='invalid-identity'; sentinel=$sentinelIdentity; text=(ConvertTo-GcCanonicalJsonV2 $invalidIdentity) })

$sentinelMalformed = 'MALFORMED_SENTINEL_' + [Guid]::NewGuid().ToString('N')
$cases.Add([ordered]@{ name='malformed-json'; sentinel=$sentinelMalformed; text=('{' + '"value":"' + $sentinelMalformed + '"') })

$root = New-GcTestDirectoryV2
try {
    $caseIndex = 0
    foreach ($case in $cases) {
        $caseDirectory = [IO.Path]::Combine($root, [string]$case['name'])
        [IO.Directory]::CreateDirectory($caseDirectory) | Out-Null
        $inputPath = [IO.Path]::Combine($caseDirectory, 'input.json')
        $evidencePath = [IO.Path]::Combine($caseDirectory, 'evidence.json')
        Write-GcTestUtf8V2 -LiteralPath $inputPath -Text ([string]$case['text'])
        if ($caseIndex -eq 0) {
            $result = Invoke-GcRouterSanitizationCaseV2 -InputPath $inputPath -EvidencePath $evidencePath
        }
        else {
            $inputBytes = [IO.File]::ReadAllBytes($inputPath)
            try {
                $inputObject = ConvertFrom-GcStrictJsonV2 -Bytes $inputBytes
                Assert-GcInputSchemaV2 -InputObject $inputObject -Policy $bundle['policy'] | Out-Null
                $actualIdentity = Get-GcRepositoryIdentityV2 -RepositoryRoot ([string]$inputObject['repositoryRoot'])
                Assert-GcOrdinalIdentityV2 -InputObject $inputObject -ActualIdentity $actualIdentity | Out-Null
                Resolve-GcPathPolicyV2 -InputObject $inputObject -Policy $bundle['policy'] -RepositoryRoot ([string]$actualIdentity['repositoryRoot']) | Out-Null
                throw 'TEST_EXPECTED_REJECTION_NOT_RAISED'
            }
            catch {
                $failureRecord = ConvertFrom-GcFailureRecordV2 -Exception $_.Exception
                $rejection = New-GcSanitizedFailureV2 -InputBytes $inputBytes -FailureRecord $failureRecord -Policy $bundle['policy']
                Assert-GcEvidenceV2 -Evidence $rejection -Policy $bundle['policy'] -ExpectedTaskId $null | Out-Null
                Write-GcTestUtf8V2 -LiteralPath $evidencePath -Text ((ConvertTo-GcCanonicalJsonV2 $rejection) + "`n")
                $result = [ordered]@{ exitCode=2; stdout=''; stderr=[string]$failureRecord['reasonCode'] }
            }
        }
        Assert-GcTestTrueV2 ($result['exitCode'] -eq 2) 'invalid input produces a stable rejection exit code'
        Assert-GcTestTrueV2 ([IO.File]::Exists($evidencePath)) 'sanitized rejection evidence is atomically produced'
        $evidenceText = [IO.File]::ReadAllText($evidencePath, [Text.UTF8Encoding]::new($false, $true))
        foreach ($surface in @($evidenceText, [string]$result['stdout'], [string]$result['stderr'])) {
            Assert-GcTestTrueV2 (-not $surface.Contains([string]$case['sentinel'], [StringComparison]::Ordinal)) 'random rejected sentinel is absent from evidence and process output'
        }
        $evidence = Read-GcEvidenceFileV2 -LiteralPath $evidencePath -Policy $bundle['policy'] -ExpectedTaskId $null
        Assert-GcTestOrdinalEqualV2 ([string]$evidence['artifactType']) 'rejection' 'invalid input yields rejection artifact only'
        Assert-GcTestTrueV2 (-not $evidence['executionPermitted'] -and -not $evidence['autoRepairAllowed']) 'rejection preserves unconditional Shadow flags'
        Assert-GcTestTrueV2 (([string]$evidence['inputSha256']) -cmatch '^[0-9a-f]{64}$' -and [int64]$evidence['inputByteLength'] -gt 0) 'rejection persists only byte length and SHA-256 for raw input'

        foreach ($file in [IO.Directory]::EnumerateFiles($caseDirectory, '*', [IO.SearchOption]::AllDirectories)) {
            if (-not [StringComparer]::OrdinalIgnoreCase.Equals([IO.Path]::GetFullPath($file), [IO.Path]::GetFullPath($inputPath))) {
                $bytes = [IO.File]::ReadAllBytes($file)
                $text = ([Text.UTF8Encoding]::new($false, $false)).GetString($bytes)
                Assert-GcTestTrueV2 (-not $text.Contains([string]$case['sentinel'], [StringComparison]::Ordinal)) 'sentinel is absent from all non-input temporary files'
            }
            Assert-GcTestTrueV2 (-not $file.EndsWith('.tmp', [StringComparison]::OrdinalIgnoreCase) -and -not $file.EndsWith('.bak', [StringComparison]::OrdinalIgnoreCase)) 'atomic temp and backup files are cleaned'
        }
        $caseIndex++
    }

    $exceptionSentinel = 'EXCEPTION_SENTINEL_' + [Guid]::NewGuid().ToString('N')
    $closedFailure = ConvertFrom-GcFailureRecordV2 -Exception ([Exception]::new($exceptionSentinel))
    $exceptionEvidence = New-GcSanitizedFailureV2 -InputBytes ([Text.Encoding]::UTF8.GetBytes('{}')) -FailureRecord $closedFailure -Policy $bundle['policy']
    $exceptionJson = ConvertTo-GcCanonicalJsonV2 $exceptionEvidence
    Assert-GcTestTrueV2 (-not $exceptionJson.Contains($exceptionSentinel, [StringComparison]::Ordinal)) 'arbitrary exception text is replaced by a closed internal failure record'
    Assert-GcEvidenceV2 -Evidence $exceptionEvidence -Policy $bundle['policy'] -ExpectedTaskId $null | Out-Null
}
finally { Remove-GcTestDirectoryV2 -LiteralPath $root }

[Console]::Out.WriteLine('PASS E EVIDENCE SANITIZATION')
