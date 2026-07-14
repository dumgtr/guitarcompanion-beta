Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$runnerRoot = [IO.Path]::GetFullPath([IO.Path]::Combine($PSScriptRoot, '..'))
$repositoryRoot = [IO.Path]::GetFullPath([IO.Path]::Combine($runnerRoot, '..', '..'))
. ([IO.Path]::Combine($runnerRoot, 'gc-provider-process-runner-core-v1.ps1'))
. ([IO.Path]::Combine($runnerRoot, 'gc-provider-process-runner-artifacts-v1.ps1'))

$script:Assertions = 0

function Assert-GcTestTrueV1 {
    param([bool]$Condition, [string]$Message)
    $script:Assertions++
    if (-not $Condition) { throw ('ASSERT_TRUE_FAILED: ' + $Message) }
}

function Assert-GcTestEqualV1 {
    param([AllowNull()][object]$Actual, [AllowNull()][object]$Expected, [string]$Message)
    $script:Assertions++
    if (-not [string]::Equals([string]$Actual, [string]$Expected, [StringComparison]::Ordinal)) {
        throw ('ASSERT_EQUAL_FAILED: {0}; expected=[{1}] actual=[{2}]' -f $Message, $Expected, $Actual)
    }
}

function Assert-GcTestThrowsCategoryV1 {
    param([scriptblock]$Action, [string]$ExpectedCategory, [string]$Message)
    $script:Assertions++
    try { & $Action; throw ('ASSERT_THROW_FAILED: ' + $Message) }
    catch {
        $actual = $_.Exception.Data['GcRunnerCategory']
        if (-not [string]::Equals([string]$actual, $ExpectedCategory, [StringComparison]::Ordinal)) {
            throw ('ASSERT_THROW_CATEGORY_FAILED: {0}; expected={1} actual={2}' -f $Message, $ExpectedCategory, $actual)
        }
    }
}

function New-GcTestContextV1 {
    param([Parameter(Mandatory)][string]$Directory)

    $promptPath = [IO.Path]::Combine($Directory, 'prompt-' + [Guid]::NewGuid().ToString('N') + '.txt')
    $prompt = 'GC_TEST_PRIVATE_' + [Guid]::NewGuid().ToString('N')
    [IO.File]::WriteAllText($promptPath, $prompt, [Text.UTF8Encoding]::new($false))
    $promptFile = Read-GcRunnerUtf8FileV1 -LiteralPath $promptPath
    $policy = (Read-GcRunnerJsonFileV1 -LiteralPath ([IO.Path]::Combine($repositoryRoot, 'config', 'gc-provider-process-runner-v1.policy.json'))).Value
    $snapshot = Get-GcRunnerRepositorySnapshotV1 -RepositoryRoot $repositoryRoot
    $requestSha = 'b' * 64
    $request = [ordered]@{
        schemaVersion = 'gc-provider-process-runner-v1.request/1'
        requestId = 'GC_RUN_' + [Guid]::NewGuid().ToString('N')
        taskId = 'GC-PROVIDER-RUNNER-V1-TEST'
        providerProfileId = 'codex-readonly'
        repositoryRoot = $repositoryRoot
        expectedBranch = [string]$snapshot['branch']
        expectedHead = [string]$snapshot['head']
        promptPath = $promptPath
        promptSha256 = $promptFile.Sha256
        routerDecisionSha256 = 'a' * 64
        timeoutMilliseconds = [long]5000
        retryIntent = $false
        resumeCheckpointPath = $null
        resumeCheckpointSha256 = $null
    }
    $authorization = [ordered]@{
        schemaVersion = 'gc-provider-process-runner-v1.authorization/1'
        authorizationId = 'GC_AUTH_' + [Guid]::NewGuid().ToString('N')
        authorizedBy = 'Product Owner Test'
        authorizedAtUtc = ([DateTimeOffset]::UtcNow.AddMinutes(-1)).ToString('o')
        expiresAtUtc = ([DateTimeOffset]::UtcNow.AddHours(1)).ToString('o')
        requestSha256 = $requestSha
        providerProfileId = 'codex-readonly'
        providerInvocation = $true
        maxAttempts = [long]1
        allowRetryOn = [object[]]@()
    }
    return [pscustomobject]@{
        Prompt = $prompt
        PromptFile = $promptFile
        PromptPath = $promptPath
        Policy = $policy
        Request = $request
        RequestSha256 = $requestSha
        Authorization = $authorization
        Profile = Get-GcProviderProfileV1 -Policy $policy -ProfileId 'codex-readonly'
        Snapshot = $snapshot
    }
}

function Invoke-GcMockProviderV1 {
    param(
        [Parameter(Mandatory)][pscustomobject]$Context,
        [Parameter(Mandatory)][string]$Scenario,
        [AllowNull()][string]$CounterPath,
        [AllowNull()][string]$ObservationPath,
        [AllowNull()][string]$ChildPidPath,
        [AllowNull()][string]$CancellationPath,
        [string]$Protocol = 'codex-jsonl'
    )

    $pwsh = (Get-Command pwsh.exe -CommandType Application | Select-Object -First 1).Source
    $mockPath = [IO.Path]::Combine($PSScriptRoot, 'mock-provider-child.ps1')
    $arguments = [Collections.Generic.List[object]]::new()
    foreach ($value in @('-NoProfile','-File',$mockPath,'-Scenario',$Scenario)) { $arguments.Add($value) }
    foreach ($pair in @(
        @('CounterPath',$CounterPath),
        @('ObservationPath',$ObservationPath),
        @('ChildPidPath',$ChildPidPath),
        @('CancellationPath',$CancellationPath)
    )) {
        if ($pair[1]) { $arguments.Add('-' + $pair[0]); $arguments.Add($pair[1]) }
    }
    return Invoke-GcProviderProcessRunnerV1 -Request $Context.Request -Authorization $Context.Authorization -Policy $Context.Policy -Profile $Context.Profile -Prompt $Context.Prompt -CancellationPath $CancellationPath -ExecutableOverride $pwsh -ArgumentsOverride $arguments.ToArray() -ProtocolOverride $Protocol -PromptTransportOverride 'stdin' -RetryDelayOverrideMilliseconds 0
}

$temporaryRoot = [IO.Path]::Combine([IO.Path]::GetTempPath(), 'gc-provider-runner-v1-tests-' + [Guid]::NewGuid().ToString('N'))
[void][IO.Directory]::CreateDirectory($temporaryRoot)

try {
    $context = New-GcTestContextV1 -Directory $temporaryRoot
    Assert-GcRunnerPolicyV1 -Policy $context.Policy
    $requestContext = Assert-GcRunnerRequestV1 -Request $context.Request -Policy $context.Policy
    Assert-GcTestEqualV1 $requestContext.Prompt.Sha256 $context.Request['promptSha256'] 'request binds exact prompt hash'
    Assert-GcHumanDispatchAuthorizationV1 -Authorization $context.Authorization -Request $context.Request -RequestSha256 $context.RequestSha256 -Policy $context.Policy

    $spawnSentinel = [IO.Path]::Combine($temporaryRoot, 'auth-reject-spawn.txt')
    $badAuthorization = [ordered]@{}
    foreach ($key in $context.Authorization.Keys) { $badAuthorization[$key] = $context.Authorization[$key] }
    $badAuthorization['requestSha256'] = 'c' * 64
    Assert-GcTestThrowsCategoryV1 { Assert-GcHumanDispatchAuthorizationV1 -Authorization $badAuthorization -Request $context.Request -RequestSha256 $context.RequestSha256 -Policy $context.Policy } 'AUTH_FAILED' 'bad authorization rejects before process start'
    Assert-GcTestTrueV1 (-not [IO.File]::Exists($spawnSentinel)) 'authorization rejection did not spawn provider'

    $context.Request['executable'] = 'cmd.exe'
    Assert-GcTestThrowsCategoryV1 { Assert-GcRunnerRequestV1 -Request $context.Request -Policy $context.Policy } 'PROTOCOL_FAILURE' 'request cannot add executable'
    $context.Request.Remove('executable')
    Assert-GcTestThrowsCategoryV1 { Get-GcProviderProfileV1 -Policy $context.Policy -ProfileId 'github-copilot-readonly' } 'AUTH_FAILED' 'disabled profile fails closed'
    $codexPolicyProfile = @($context.Policy['profiles'] | Where-Object { [string]::Equals([string]$_['id'], 'codex-readonly', [StringComparison]::Ordinal) })[0]
    $originalArguments = $codexPolicyProfile['arguments']
    $codexPolicyProfile['arguments'] = [object[]]@('exec','--ephemeral','--json','--sandbox','danger-full-access','-')
    Assert-GcTestThrowsCategoryV1 { Assert-GcRunnerPolicyV1 -Policy $context.Policy } 'RUNNER_FAILURE' 'policy cannot widen fixed provider arguments'
    $codexPolicyProfile['arguments'] = $originalArguments
    Write-Output 'PASS CONTRACT AND HUMAN AUTHORIZATION'

    $observation = [IO.Path]::Combine($temporaryRoot, 'stdin-observation.txt')
    $success = Invoke-GcMockProviderV1 -Context $context -Scenario 'success' -ObservationPath $observation
    Assert-GcTestEqualV1 $success.State 'COMPLETED' 'success reaches completed'
    Assert-GcTestEqualV1 $success.Attempts.Count 1 'success uses one attempt'
    Assert-GcTestEqualV1 $success.Attempts[0]['terminalEvent'] 'turn.completed' 'Codex terminal completion required'
    Assert-GcTestEqualV1 $success.Attempts[0]['exitCode'] 0 'real zero exit recorded'
    Assert-GcTestTrueV1 ([IO.File]::Exists($observation)) 'mock observed stdin EOF'
    Assert-GcTestEqualV1 ([IO.File]::ReadAllText($observation)) ('{0}|{1}' -f $context.PromptFile.Bytes.Length, $context.PromptFile.Sha256) 'stdin prompt bytes complete before EOF'

    $turnFailed = Invoke-GcMockProviderV1 -Context $context -Scenario 'turn-failed'
    Assert-GcTestEqualV1 $turnFailed.State 'FAILED' 'turn.failed fails lifecycle'
    Assert-GcTestEqualV1 $turnFailed.FailureCategory 'PROVIDER_FAILURE' 'turn.failed has provider category'
    foreach ($scenario in @('missing-terminal','event-after-terminal','malformed')) {
        $protocolFailure = Invoke-GcMockProviderV1 -Context $context -Scenario $scenario
        Assert-GcTestEqualV1 $protocolFailure.State 'FAILED' "$scenario fails lifecycle"
        Assert-GcTestEqualV1 $protocolFailure.FailureCategory 'PROTOCOL_FAILURE' "$scenario is protocol failure"
    }
    $nonzero = Invoke-GcMockProviderV1 -Context $context -Scenario 'exit-nonzero'
    Assert-GcTestEqualV1 $nonzero.Attempts[0]['exitCode'] 7 'real nonzero exit code preserved'
    Assert-GcTestEqualV1 $nonzero.FailureCategory 'PROVIDER_FAILURE' 'nonzero exit fails provider'
    $missingExecutable = Invoke-GcProviderAttemptV1 -FilePath ([IO.Path]::Combine($temporaryRoot, 'does-not-exist.exe')) -Arguments @('--probe') -Prompt 'probe' -PromptTransport closed -Protocol codex-jsonl -WorkingDirectory $repositoryRoot -TimeoutMilliseconds 1000 -MaximumCapturedBytes 1024 -AttemptNumber 1
    Assert-GcTestEqualV1 $missingExecutable.Public['state'] 'FAILED' 'process start failure is represented'
    Assert-GcTestEqualV1 $missingExecutable.Public['failureCategory'] 'RUNNER_FAILURE' 'process start failure category stable'
    Write-Output 'PASS STDIN JSONL TERMINAL EVENTS AND EXIT CODES'

    $geminiSuccess = Invoke-GcMockProviderV1 -Context $context -Scenario 'gemini-success-result' -Protocol 'json-stream-exit'
    Assert-GcTestEqualV1 $geminiSuccess.State 'COMPLETED' 'gemini success reaches completed'
    Assert-GcTestEqualV1 $geminiSuccess.Attempts[0]['terminalEvent'] 'result' 'Gemini terminal result event extracted'

    $geminiFailedResult = Invoke-GcMockProviderV1 -Context $context -Scenario 'gemini-result-failed' -Protocol 'json-stream-exit'
    Assert-GcTestEqualV1 $geminiFailedResult.State 'FAILED' 'gemini result=failure fails lifecycle'
    Assert-GcTestEqualV1 $geminiFailedResult.FailureCategory 'PROTOCOL_FAILURE' 'gemini result=failure is protocol failure'

    foreach ($scenario in @('gemini-missing-result','gemini-event-after-result','gemini-malformed','gemini-duplicate-result','gemini-missing-status')) {
        $geminiFailure = Invoke-GcMockProviderV1 -Context $context -Scenario $scenario -Protocol 'json-stream-exit'
        Assert-GcTestEqualV1 $geminiFailure.State 'FAILED' "gemini $scenario fails lifecycle"
        Assert-GcTestEqualV1 $geminiFailure.FailureCategory 'PROTOCOL_FAILURE' "gemini $scenario is protocol failure"
    }

    $geminiTruncatedContext = New-GcTestContextV1 -Directory $temporaryRoot
    $geminiTruncatedResult = Invoke-GcProviderAttemptV1 -FilePath (Get-Command pwsh.exe -CommandType Application | Select-Object -First 1).Source -Arguments @('-NoProfile', '-Command', '[Console]::Out.WriteLine(''{"type":"init"}''); [Console]::Out.WriteLine(''{"type":"result","status":"success"}''); exit 0') -Prompt 'probe' -PromptTransport closed -Protocol 'json-stream-exit' -WorkingDirectory $repositoryRoot -TimeoutMilliseconds 5000 -MaximumCapturedBytes 10 -AttemptNumber 1
    Assert-GcTestEqualV1 $geminiTruncatedResult.Public['state'] 'FAILED' 'gemini truncated buffer fails lifecycle'
    Assert-GcTestEqualV1 $geminiTruncatedResult.Public['failureCategory'] 'PROTOCOL_FAILURE' 'gemini truncated buffer is protocol failure'

    Write-Output 'PASS GEMINI JSON STREAM EXIT TERMINAL EVENTS'

    $quotaContext = New-GcTestContextV1 -Directory $temporaryRoot
    $quotaContext.Request['retryIntent'] = $true
    $quotaContext.Authorization['maxAttempts'] = [long]2
    $quotaContext.Authorization['allowRetryOn'] = [object[]]@('RATE_LIMITED','TIMEOUT')
    $quotaCounter = [IO.Path]::Combine($temporaryRoot, 'quota-counter.txt')
    $quota = Invoke-GcMockProviderV1 -Context $quotaContext -Scenario 'quota' -CounterPath $quotaCounter
    Assert-GcTestEqualV1 $quota.FailureCategory 'QUOTA_EXCEEDED' 'quota classified'
    Assert-GcTestEqualV1 $quota.Attempts.Count 1 'quota is never retried'
    Assert-GcTestEqualV1 ([IO.File]::ReadAllText($quotaCounter)) '1' 'quota child ran once'

    $rateContext = New-GcTestContextV1 -Directory $temporaryRoot
    $rateContext.Request['retryIntent'] = $true
    $rateContext.Authorization['maxAttempts'] = [long]2
    $rateContext.Authorization['allowRetryOn'] = [object[]]@('RATE_LIMITED')
    $rateCounter = [IO.Path]::Combine($temporaryRoot, 'rate-counter.txt')
    $rate = Invoke-GcMockProviderV1 -Context $rateContext -Scenario 'rate-then-success' -CounterPath $rateCounter
    Assert-GcTestEqualV1 $rate.State 'COMPLETED' 'one rate retry can recover'
    Assert-GcTestEqualV1 $rate.Attempts.Count 2 'rate retry capped at two attempts'
    Assert-GcTestEqualV1 ([IO.File]::ReadAllText($rateCounter)) '2' 'rate provider ran exactly twice'

    $timeoutContext = New-GcTestContextV1 -Directory $temporaryRoot
    $timeoutContext.Request['retryIntent'] = $true
    $timeoutContext.Request['timeoutMilliseconds'] = [long]1500
    $timeoutContext.Authorization['maxAttempts'] = [long]2
    $timeoutContext.Authorization['allowRetryOn'] = [object[]]@('TIMEOUT')
    $timeoutCounter = [IO.Path]::Combine($temporaryRoot, 'timeout-counter.txt')
    $timeoutRetry = Invoke-GcMockProviderV1 -Context $timeoutContext -Scenario 'timeout-then-success' -CounterPath $timeoutCounter
    Assert-GcTestEqualV1 $timeoutRetry.State 'COMPLETED' 'one timeout retry can recover'
    Assert-GcTestEqualV1 $timeoutRetry.Attempts.Count 2 'timeout retry capped at two attempts'
    Assert-GcTestEqualV1 $timeoutRetry.Attempts[0]['state'] 'TIMED_OUT' 'first timeout state preserved'
    Write-Output 'PASS FAILURE CLASSIFICATION AND RETRY POLICY'

    $cancelContext = New-GcTestContextV1 -Directory $temporaryRoot
    $cancelPath = [IO.Path]::Combine($temporaryRoot, 'cancel.signal')
    $cancel = Invoke-GcMockProviderV1 -Context $cancelContext -Scenario 'cancel' -CancellationPath $cancelPath
    Assert-GcTestEqualV1 $cancel.State 'CANCELLED' 'running process cancellation recorded'
    Assert-GcTestEqualV1 $cancel.FailureCategory 'CANCELLED' 'cancellation category stable'
    Assert-GcTestEqualV1 $cancel.Attempts.Count 1 'cancellation not retried'

    $treeContext = New-GcTestContextV1 -Directory $temporaryRoot
    $treeContext.Request['timeoutMilliseconds'] = [long]1000
    $childPidPath = [IO.Path]::Combine($temporaryRoot, 'grandchild.pid')
    $treeTimeout = Invoke-GcMockProviderV1 -Context $treeContext -Scenario 'child-timeout' -ChildPidPath $childPidPath
    Assert-GcTestEqualV1 $treeTimeout.State 'TIMED_OUT' 'process-tree scenario times out'
    Assert-GcTestTrueV1 ([IO.File]::Exists($childPidPath)) 'grandchild pid captured'
    [Threading.Thread]::Sleep(250)
    $childPid = [int][IO.File]::ReadAllText($childPidPath)
    $childAlive = $null -ne (Get-Process -Id $childPid -ErrorAction SilentlyContinue)
    if ($childAlive) { try { [Diagnostics.Process]::GetProcessById($childPid).Kill($true) } catch { } }
    Assert-GcTestTrueV1 (-not $childAlive) 'timeout killed descendant process tree'

    $floodContext = New-GcTestContextV1 -Directory $temporaryRoot
    $floodContext.Policy['maximumCapturedBytesPerStream'] = [long]8192
    $floodContext.Request['timeoutMilliseconds'] = [long]10000
    $flood = Invoke-GcMockProviderV1 -Context $floodContext -Scenario 'flood'
    Assert-GcTestEqualV1 $flood.FailureCategory 'PROTOCOL_FAILURE' 'truncated protocol fails closed'
    Assert-GcTestTrueV1 ([bool]$flood.Attempts[0]['stdoutTruncated']) 'stdout capture bounded while drained'
    Assert-GcTestTrueV1 ([bool]$flood.Attempts[0]['stderrTruncated']) 'stderr capture bounded while drained'
    Assert-GcTestTrueV1 ([long]$flood.Attempts[0]['stdoutByteLength'] -gt 8192 -and [long]$flood.Attempts[0]['stderrByteLength'] -gt 8192) 'both flooded streams fully drained without deadlock'
    Write-Output 'PASS TIMEOUT CANCELLATION PROCESS TREE AND CONCURRENT DRAIN'

    $artifactContext = New-GcTestContextV1 -Directory $temporaryRoot
    $artifactContext.Authorization['authorizationId'] = 'GC_AUTH_' + [Guid]::NewGuid().ToString('N')
    $artifactRoot = [IO.Path]::Combine($temporaryRoot, 'artifacts')
    Claim-GcRunnerAuthorizationV1 -AuthorizationId $artifactContext.Authorization['authorizationId']
    $runDirectory = New-GcRunnerRunDirectoryV1 -ArtifactRoot $artifactRoot -AuthorizationId $artifactContext.Authorization['authorizationId']
    Assert-GcTestThrowsCategoryV1 { Claim-GcRunnerAuthorizationV1 -AuthorizationId $artifactContext.Authorization['authorizationId'] } 'AUTH_FAILED' 'authorization id is globally one use'

    $artifactRootB = [IO.Path]::Combine($temporaryRoot, 'artifacts-b')
    Assert-GcTestThrowsCategoryV1 { Claim-GcRunnerAuthorizationV1 -AuthorizationId $artifactContext.Authorization['authorizationId'] } 'AUTH_FAILED' 'authorization id is one use even with different artifact root'
    $checkpoint = New-GcCheckpointArtifactV1 -Request $artifactContext.Request -Authorization $artifactContext.Authorization -RequestSha256 $artifactContext.RequestSha256 -State 'FAILED' -FailureCategory 'QUOTA_EXCEEDED' -AttemptCount 1 -RepositorySnapshot $artifactContext.Snapshot -WorktreePreserved $true
    $checkpointResult = Write-GcRunnerArtifactAtomicV1 -Artifact $checkpoint -DestinationPath ([IO.Path]::Combine($runDirectory, 'checkpoint.json'))
    $lifecycle = New-GcLifecycleArtifactV1 -Request $artifactContext.Request -Authorization $artifactContext.Authorization -RequestSha256 $artifactContext.RequestSha256 -CreatedAtUtc ([DateTimeOffset]::UtcNow.AddSeconds(-1)) -State 'FAILED' -FailureCategory 'QUOTA_EXCEEDED' -Attempts @($quota.Attempts) -CheckpointWritten $true -WorktreePreserved $true
    $lifecycleResult = Write-GcRunnerArtifactAtomicV1 -Artifact $lifecycle -DestinationPath ([IO.Path]::Combine($runDirectory, 'lifecycle.json'))
    Remove-GcRunnerTemporaryArtifactsV1 -RunDirectory $runDirectory
    Assert-GcTestTrueV1 ([IO.File]::Exists($checkpointResult.Path) -and [IO.File]::Exists($lifecycleResult.Path)) 'checkpoint and lifecycle written atomically'
    Assert-GcTestEqualV1 @([IO.Directory]::EnumerateFiles($runDirectory, '*.tmp')).Count 0 'no temporary artifacts remain'
    $persisted = [IO.File]::ReadAllText($checkpointResult.Path) + [IO.File]::ReadAllText($lifecycleResult.Path)
    Assert-GcTestTrueV1 (-not $persisted.Contains($artifactContext.Prompt)) 'raw prompt not persisted'
    Assert-GcTestTrueV1 (-not $persisted.Contains('You have exceeded your monthly quota.')) 'raw provider error not persisted'

    $resumeRequest = $artifactContext.Request
    $resumeRequest['resumeCheckpointPath'] = $checkpointResult.Path
    $resumeRequest['resumeCheckpointSha256'] = $checkpointResult.Sha256
    $newAuthorizationId = 'GC_AUTH_' + [Guid]::NewGuid().ToString('N')
    $resume = Read-GcResumeCheckpointV1 -Request $resumeRequest -NewAuthorizationId $newAuthorizationId
    Assert-GcTestEqualV1 $resume['originalAuthorizationId'] $artifactContext.Authorization['authorizationId'] 'new authorization can bind exact checkpoint'
    Assert-GcTestThrowsCategoryV1 { Read-GcResumeCheckpointV1 -Request $resumeRequest -NewAuthorizationId $artifactContext.Authorization['authorizationId'] } 'AUTH_FAILED' 'resume rejects reused authorization'
    Assert-GcTestThrowsCategoryV1 { Resolve-GcRunnerArtifactRootV1 -RepositoryRoot $repositoryRoot -ArtifactRoot $repositoryRoot } 'AUTH_FAILED' 'artifacts cannot be written inside repository'
    Write-Output 'PASS ATOMIC ARTIFACT CHECKPOINT RESUME AND REDACTION'

    $snapshotAfter = Get-GcRunnerRepositorySnapshotV1 -RepositoryRoot $repositoryRoot
    Assert-GcTestEqualV1 $snapshotAfter['branch'] $context.Snapshot['branch'] 'branch preserved'
    Assert-GcTestEqualV1 $snapshotAfter['head'] $context.Snapshot['head'] 'HEAD preserved'
    Assert-GcTestEqualV1 $snapshotAfter['statusSha256'] $context.Snapshot['statusSha256'] 'worktree status preserved'

    $parseFiles = @(Get-ChildItem -LiteralPath $runnerRoot -Recurse -File -Filter '*.ps1')
    foreach ($file in $parseFiles) {
        $tokens = $null; $parseErrors = $null
        [Management.Automation.Language.Parser]::ParseFile($file.FullName, [ref]$tokens, [ref]$parseErrors) | Out-Null
        Assert-GcTestEqualV1 $parseErrors.Count 0 ('PowerShell parses: ' + $file.Name)
    }
    $jsonFiles = @(
        [IO.Path]::Combine($repositoryRoot, 'config', 'gc-provider-process-runner-v1.policy.json')
        Get-ChildItem -LiteralPath ([IO.Path]::Combine($repositoryRoot, 'schemas')) -File -Filter 'gc-provider-process-runner-v1*.json' | ForEach-Object { $_.FullName }
    )
    foreach ($file in $jsonFiles) { $null = Read-GcRunnerJsonFileV1 -LiteralPath $file }
    $implementationText = (@(Get-ChildItem -LiteralPath $runnerRoot -File -Filter '*.ps1' | ForEach-Object { [IO.File]::ReadAllText($_.FullName) }) -join "`n")
    Assert-GcTestTrueV1 ($implementationText -notmatch '(?i)\b(Start-Process|Start-Job|Register-ScheduledTask|schtasks|git\s+(add|commit|push|merge|tag|reset|restore|clean|stash))\b') 'no background scheduler or Git mutation command'
    Assert-GcTestTrueV1 ($implementationText -notmatch '(?i)(scope-router-v2|gc-orchestrator-host-broker|gc-gemini-provider-helper|outputs[/\\])') 'implementation isolated from Router Broker provider adapters and production'
    Write-Output 'PASS PARSE STATIC ISOLATION AND WORKTREE PRESERVATION'

    Write-Output ('PASS ALL GC PROVIDER PROCESS RUNNER V1 TESTS ({0} assertions)' -f $script:Assertions)
}
finally {
    $tempFull = [IO.Path]::GetFullPath($temporaryRoot)
    $tempBase = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
    if ($tempFull.StartsWith($tempBase, [StringComparison]::OrdinalIgnoreCase) -and [IO.Directory]::Exists($tempFull)) {
        [IO.Directory]::Delete($tempFull, $true)
    }
}
