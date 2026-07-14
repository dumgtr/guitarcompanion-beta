Set-StrictMode -Version Latest

function New-GcDecisionEvidenceV2 {
    param(
        [Parameter(Mandatory)]$InputObject,
        [Parameter(Mandatory)][AllowEmptyCollection()][byte[]]$InputBytes,
        [Parameter(Mandatory)]$Identity,
        [Parameter(Mandatory)]$PathPolicy,
        [Parameter(Mandatory)]$GitState,
        [Parameter(Mandatory)]$Risk,
        [Parameter(Mandatory)]$PolicyBundle
    )

    $policy = $PolicyBundle['policy']
    $reviewers = [Collections.Generic.List[object]]::new()
    foreach ($role in $policy['reviewers']) { $reviewers.Add([ordered]@{ role = [string]$role; readOnly = $true }) }
    $writer = if (Test-GcOrdinalEqualsV2 ([string]$Risk['classification']) 'blocked') { $null } else { [string]$policy['recommendedWriter'] }
    $dirtyEvidence = [ordered]@{}
    foreach ($name in @('modified','staged','untracked','deleted','conflicted','renameSource','renameDestination')) { $dirtyEvidence[$name] = @($GitState[$name]) }

    $evidence = [ordered]@{
        artifactType = 'decision'
        schemaVersion = [string]$policy['outputSchemaVersion']
        policyVersion = [string]$policy['policyVersion']
        taskId = [string]$InputObject['taskId']
        repositoryIdentity = [ordered]@{
            repositoryRoot = [string]$Identity['repositoryRoot']
            branch = [string]$Identity['branch']
            head = [string]$Identity['head']
        }
        classification = [string]$Risk['classification']
        route = [string]$Risk['route']
        rank = [int64]$Risk['rank']
        reasonCodes = @($Risk['reasonCodes'])
        recommendedWriter = $writer
        reviewers = @($reviewers)
        allowedReadPaths = @($PathPolicy['allowedReadPaths'])
        allowedWritePaths = @($PathPolicy['allowedWritePaths'])
        forbiddenPaths = @($PathPolicy['forbiddenPaths'])
        protectedNamespaces = @($PathPolicy['protectedNamespaces'])
        dirtyState = $dirtyEvidence
        executionPermitted = $false
        autoRepairAllowed = $false
        inputByteLength = [int64]$InputBytes.Length
        inputSha256 = Get-GcSha256HexV2 -Bytes $InputBytes
        policySha256 = [string]$PolicyBundle['policySha256']
        contractsSha256 = [string]$PolicyBundle['contractsSha256']
        decisionContentSha256 = ('0' * 64)
    }
    Set-GcEvidenceContentHashV2 -Evidence $evidence | Out-Null
    return $evidence
}

function New-GcSanitizedFailureV2 {
    param(
        [Parameter(Mandatory)][AllowEmptyCollection()][byte[]]$InputBytes,
        [Parameter(Mandatory)]$FailureRecord,
        [Parameter(Mandatory)]$Policy
    )

    $evidence = [ordered]@{
        artifactType = 'rejection'
        schemaVersion = [string]$Policy['outputSchemaVersion']
        policyVersion = [string]$Policy['policyVersion']
        reasonCode = [string]$FailureRecord['reasonCode']
        fieldId = [string]$FailureRecord['fieldId']
        arrayIndex = $FailureRecord['arrayIndex']
        inputByteLength = [int64]$InputBytes.Length
        inputSha256 = Get-GcSha256HexV2 -Bytes $InputBytes
        policyRuleId = [string]$FailureRecord['policyRuleId']
        failureCategory = [string]$FailureRecord['failureCategory']
        executionPermitted = $false
        autoRepairAllowed = $false
        decisionContentSha256 = ('0' * 64)
    }
    Set-GcEvidenceContentHashV2 -Evidence $evidence | Out-Null
    return $evidence
}

function Read-GcEvidenceFileV2 {
    param([Parameter(Mandatory)][string]$LiteralPath, [Parameter(Mandatory)]$Policy, [AllowNull()][AllowEmptyString()][string]$ExpectedTaskId)
    $bytes = Read-GcStrictUtf8V2 -LiteralPath $LiteralPath
    $evidence = ConvertFrom-GcStrictJsonV2 -Bytes $bytes
    Assert-GcEvidenceV2 -Evidence $evidence -Policy $Policy -ExpectedTaskId $ExpectedTaskId | Out-Null
    return $evidence
}

function Resolve-GcPowerShellApplicationV2 {
    $current = [Environment]::ProcessPath
    if (-not [string]::IsNullOrEmpty($current) -and [IO.File]::Exists($current)) { return [IO.Path]::GetFullPath($current) }
    foreach ($name in @('pwsh.exe','pwsh','powershell.exe','powershell')) {
        try {
            $command = Get-Command -Name $name -CommandType Application -ErrorAction Stop
            if ([IO.File]::Exists([string]$command.Source)) { return [IO.Path]::GetFullPath([string]$command.Source) }
        }
        catch { }
    }
    Throw-GcFailureV2 -ReasonCode 'EVIDENCE_CHILD_INVALID' -FieldId 'child.application' -PolicyRuleId 'V2-EVIDENCE-CHILD-APPLICATION' -FailureCategory 'evidence'
}

function Invoke-GcEvidenceChildValidationV2 {
    param(
        [Parameter(Mandatory)][string]$EvidencePath,
        [Parameter(Mandatory)][string]$RouterScriptPath,
        [AllowNull()][AllowEmptyString()][string]$ExpectedTaskId,
        [ValidateRange(100, 120000)][int]$TimeoutMilliseconds = 20000
    )

    $arguments = [Collections.Generic.List[string]]::new()
    foreach ($argument in @('-NoLogo','-NoProfile','-NonInteractive','-File',$RouterScriptPath,'-Mode','ValidateEvidence','-EvidencePath',$EvidencePath)) { $arguments.Add($argument) }
    if (-not [string]::IsNullOrEmpty($ExpectedTaskId)) { $arguments.Add('-ExpectedTaskId'); $arguments.Add($ExpectedTaskId) }
    try {
        $result = Invoke-GcChildProcessV2 -FilePath (Resolve-GcPowerShellApplicationV2) -Arguments @($arguments) -WorkingDirectory ([IO.Path]::GetDirectoryName($RouterScriptPath)) -TimeoutMilliseconds $TimeoutMilliseconds
    }
    catch {
        Throw-GcFailureV2 -ReasonCode 'EVIDENCE_CHILD_INVALID' -FieldId 'child.validation' -PolicyRuleId 'V2-EVIDENCE-CHILD-PROCESS' -FailureCategory 'evidence'
    }
    if ($result['exitCode'] -ne 0) {
        Throw-GcFailureV2 -ReasonCode 'EVIDENCE_CHILD_INVALID' -FieldId 'child.exitCode' -PolicyRuleId 'V2-EVIDENCE-CHILD-EXIT' -FailureCategory 'evidence'
    }
    return $true
}

function Restore-GcPriorEvidenceV2 {
    param([Parameter(Mandatory)][string]$DestinationPath, [AllowNull()][string]$BackupPath, [bool]$PriorExisted)
    try {
        if ($PriorExisted) {
            if ($null -eq $BackupPath -or -not [IO.File]::Exists($BackupPath)) {
                Throw-GcFailureV2 -ReasonCode 'EVIDENCE_WRITE_FAILED' -FieldId 'evidence.rollback' -PolicyRuleId 'V2-EVIDENCE-ROLLBACK' -FailureCategory 'evidence'
            }
            $restored = $false
            for ($attempt = 0; $attempt -lt 5; $attempt++) {
                try {
                    [IO.File]::Move($BackupPath, $DestinationPath, $true)
                    $restored = $true
                    break
                }
                catch [IO.IOException] { }
                catch [UnauthorizedAccessException] { }
                if ($attempt -lt 4) { [Threading.Thread]::Sleep(25 * ($attempt + 1)) }
            }
            if (-not $restored) {
                Throw-GcFailureV2 -ReasonCode 'EVIDENCE_WRITE_FAILED' -FieldId 'evidence.rollback' -PolicyRuleId 'V2-EVIDENCE-ROLLBACK' -FailureCategory 'evidence'
            }
        }
        elseif ([IO.File]::Exists($DestinationPath)) {
            [IO.File]::Delete($DestinationPath)
        }
    }
    catch [InvalidOperationException] { throw }
    catch {
        Throw-GcFailureV2 -ReasonCode 'EVIDENCE_WRITE_FAILED' -FieldId 'evidence.rollback' -PolicyRuleId 'V2-EVIDENCE-ROLLBACK' -FailureCategory 'evidence'
    }
}

function Write-GcEvidenceAtomicV2 {
    param(
        [Parameter(Mandatory)]$Evidence,
        [Parameter(Mandatory)][string]$DestinationPath,
        [Parameter(Mandatory)]$Policy,
        [Parameter(Mandatory)][string]$RouterScriptPath,
        [AllowNull()][AllowEmptyString()][string]$ExpectedTaskId,
        [AllowNull()][AllowEmptyString()][string]$ChildExpectedTaskId,
        [ValidateRange(100, 120000)][int]$ChildTimeoutMilliseconds = 20000
    )

    Assert-GcEvidenceV2 -Evidence $Evidence -Policy $Policy -ExpectedTaskId $ExpectedTaskId | Out-Null
    try {
        $fullDestination = [IO.Path]::GetFullPath($DestinationPath)
        $directory = [IO.Path]::GetDirectoryName($fullDestination)
        if (-not [IO.Directory]::Exists($directory)) {
            Throw-GcFailureV2 -ReasonCode 'EVIDENCE_WRITE_FAILED' -FieldId 'evidence.directory' -PolicyRuleId 'V2-EVIDENCE-DIRECTORY' -FailureCategory 'evidence'
        }
    }
    catch [InvalidOperationException] { throw }
    catch {
        Throw-GcFailureV2 -ReasonCode 'EVIDENCE_WRITE_FAILED' -FieldId 'evidence.path' -PolicyRuleId 'V2-EVIDENCE-PATH' -FailureCategory 'evidence'
    }

    $fileName = [IO.Path]::GetFileName($fullDestination)
    $temporaryPath = [IO.Path]::Combine($directory, ".$fileName.$([Guid]::NewGuid().ToString('N')).tmp")
    $backupPath = [IO.Path]::Combine($directory, ".$fileName.$([Guid]::NewGuid().ToString('N')).bak")
    $priorExisted = [IO.File]::Exists($fullDestination)
    $promoted = $false
    try {
        if ($priorExisted) { Read-GcEvidenceFileV2 -LiteralPath $fullDestination -Policy $Policy -ExpectedTaskId $ExpectedTaskId | Out-Null }
        $jsonBytes = [Text.Encoding]::UTF8.GetBytes((ConvertTo-GcCanonicalJsonV2 -Value $Evidence) + "`n")
        $stream = [IO.FileStream]::new($temporaryPath, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None, 4096, [IO.FileOptions]::WriteThrough)
        try { $stream.Write($jsonBytes, 0, $jsonBytes.Length); $stream.Flush($true) }
        finally { $stream.Dispose() }

        Read-GcEvidenceFileV2 -LiteralPath $temporaryPath -Policy $Policy -ExpectedTaskId $ExpectedTaskId | Out-Null
        if ($priorExisted) { [IO.File]::Replace($temporaryPath, $fullDestination, $backupPath, $true) }
        else { [IO.File]::Move($temporaryPath, $fullDestination) }
        $promoted = $true

        $childTaskId = if ($PSBoundParameters.ContainsKey('ChildExpectedTaskId')) { $ChildExpectedTaskId } else { $ExpectedTaskId }
        Invoke-GcEvidenceChildValidationV2 -EvidencePath $fullDestination -RouterScriptPath $RouterScriptPath -ExpectedTaskId $childTaskId -TimeoutMilliseconds $ChildTimeoutMilliseconds | Out-Null
        if ([IO.File]::Exists($backupPath)) { [IO.File]::Delete($backupPath) }
        return $fullDestination
    }
    catch {
        $failure = $_.Exception
        if ($promoted) { Restore-GcPriorEvidenceV2 -DestinationPath $fullDestination -BackupPath $(if ($priorExisted) { $backupPath } else { $null }) -PriorExisted $priorExisted }
        throw $failure
    }
    finally {
        if ([IO.File]::Exists($temporaryPath)) { try { [IO.File]::Delete($temporaryPath) } catch { } }
        if ([IO.File]::Exists($backupPath)) { try { [IO.File]::Delete($backupPath) } catch { } }
    }
}
