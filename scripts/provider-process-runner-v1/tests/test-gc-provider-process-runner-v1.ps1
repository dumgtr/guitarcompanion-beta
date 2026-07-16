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
        [AllowNull()][string]$EnvironmentObservationPath,
        [AllowNull()][string]$ArgumentObservationPath,
        [AllowNull()][string]$ChildPidPath,
        [AllowNull()][string]$CancellationPath,
        [AllowNull()][object[]]$ObservedArguments,
        [string]$Protocol = 'codex-jsonl'
    )

    $pwsh = (Get-Command pwsh.exe -CommandType Application | Select-Object -First 1).Source
    $mockPath = [IO.Path]::Combine($PSScriptRoot, 'mock-provider-child.ps1')
    $arguments = [Collections.Generic.List[object]]::new()
    foreach ($value in @('-NoProfile','-File',$mockPath,'-Scenario',$Scenario)) { $arguments.Add($value) }
    foreach ($pair in @(
        @('CounterPath',$CounterPath),
        @('ObservationPath',$ObservationPath),
        @('EnvironmentObservationPath',$EnvironmentObservationPath),
        @('ArgumentObservationPath',$ArgumentObservationPath),
        @('ChildPidPath',$ChildPidPath),
        @('CancellationPath',$CancellationPath)
    )) {
        if ($pair[1]) { $arguments.Add('-' + $pair[0]); $arguments.Add($pair[1]) }
    }
    if ($null -ne $ObservedArguments) {
        if ($ObservedArguments.Count -ne 4) { throw 'MOCK_OBSERVED_ARGUMENT_COUNT_INVALID' }
        $names = @('ObservedArgumentOne','ObservedArgumentTwo','ObservedArgumentThree','ObservedArgumentFour')
        for ($index = 0; $index -lt $ObservedArguments.Count; $index++) {
            $arguments.Add('-' + $names[$index])
            $arguments.Add($ObservedArguments[$index])
        }
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
    $context.Request['environment'] = [ordered]@{ GC_PROVIDER_RUNNER_V1_FIXED_ENV_TEST = 'request-injected' }
    Assert-GcTestThrowsCategoryV1 { Assert-GcRunnerRequestV1 -Request $context.Request -Policy $context.Policy } 'PROTOCOL_FAILURE' 'request cannot inject environment variables'
    $context.Request.Remove('environment')
    Assert-GcTestThrowsCategoryV1 { Get-GcProviderProfileV1 -Policy $context.Policy -ProfileId 'github-copilot-readonly' } 'AUTH_FAILED' 'disabled profile fails closed'
    $codexPolicyProfile = @($context.Policy['profiles'] | Where-Object { [string]::Equals([string]$_['id'], 'codex-readonly', [StringComparison]::Ordinal) })[0]
    $originalArguments = $codexPolicyProfile['arguments']
    $codexPolicyProfile['arguments'] = [object[]]@('exec','--ephemeral','--json','--sandbox','danger-full-access','-')
    Assert-GcTestThrowsCategoryV1 { Assert-GcRunnerPolicyV1 -Policy $context.Policy } 'RUNNER_FAILURE' 'policy cannot widen fixed provider arguments'
    $codexPolicyProfile['arguments'] = $originalArguments
    $claudeProfile = Get-GcProviderProfileV1 -Policy $context.Policy -ProfileId 'claude-readonly'
    Assert-GcTestEqualV1 $claudeProfile['protocol'] 'claude-json-exit' 'Claude uses isolated protocol'
    Assert-GcTestTrueV1 ((@($claudeProfile['arguments']) -join "`n") -cmatch '--permission-mode\nplan' -and (@($claudeProfile['arguments']) -join "`n") -cmatch '--tools\nRead,Glob,Grep') 'Claude fixed contract is read-only'
    $geminiProfile = Get-GcProviderProfileV1 -Policy $context.Policy -ProfileId 'gemini-plan-review'
    Assert-GcTestTrueV1 ((@($geminiProfile['arguments']) -join "`n") -cmatch '--approval-mode\nplan') 'Gemini fixed contract uses controlled plan mode'
    $expectedGeminiPrompt = 'Inspect the assigned repository context read-only. Do not modify files or invoke nested providers. Return only the review.'
    $expectedGeminiArguments = [object[]]@('--prompt',$expectedGeminiPrompt,'--approval-mode','plan','--output-format','stream-json','--skip-trust')
    Assert-GcTestEqualV1 $geminiProfile['arguments'][1] $expectedGeminiPrompt 'Gemini policy prompt matches core fixed prompt contract'
    Assert-GcTestTrueV1 ([string]$geminiProfile['arguments'][1] -cnotmatch '[\r\n]') 'Gemini fixed prompt contains no CR or LF'
    Assert-GcTestEqualV1 (@($geminiProfile['arguments']) -join "`0") ($expectedGeminiArguments -join "`0") 'Gemini argument order remains exact'
    Assert-GcTestEqualV1 $geminiProfile['promptTransport'] 'stdin' 'Gemini prompt transport remains stdin'

    $originalGeminiArguments = $geminiProfile['arguments']
    $alteredGeminiArguments = [object[]]@($originalGeminiArguments)
    $alteredGeminiArguments[1] = $expectedGeminiPrompt + ' altered'
    $geminiProfile['arguments'] = $alteredGeminiArguments
    Assert-GcTestThrowsCategoryV1 { Assert-GcRunnerPolicyV1 -Policy $context.Policy } 'RUNNER_FAILURE' 'policy rejects altered Gemini fixed prompt'
    $geminiProfile['arguments'] = $originalGeminiArguments
    Assert-GcRunnerPolicyV1 -Policy $context.Policy
    Assert-GcTestTrueV1 $true 'synchronized Gemini policy and core contract validate'
    Assert-GcTestEqualV1 (@($context.Profile['arguments']) -join "`0") "exec`0--ephemeral`0--json`0--sandbox`0read-only`0-" 'Codex fixed contract remains unchanged'
    Assert-GcTestTrueV1 ((@($claudeProfile['arguments']) -join "`n") -cmatch '--output-format\njson' -and (@($claudeProfile['arguments']) -join "`n") -cmatch '--no-session-persistence') 'Claude fixed contract remains unchanged'

    $argumentVector = [object[]]@('--first-flag','value containing spaces','--second-flag','plain-value')
    $argumentStartInfo = New-GcProcessStartInfoV1 -FilePath 'mock.exe' -Arguments $argumentVector -WorkingDirectory $repositoryRoot
    Assert-GcTestEqualV1 $argumentStartInfo.ArgumentList.Count $argumentVector.Count 'each semantic argument has one ArgumentList entry'
    Assert-GcTestEqualV1 $argumentStartInfo.ArgumentList[1] 'value containing spaces' 'space-containing value remains one entry'
    Assert-GcTestEqualV1 (@($argumentStartInfo.ArgumentList) -join "`0") ($argumentVector -join "`0") 'ArgumentList preserves exact argument order'
    Assert-GcTestTrueV1 (@($argumentStartInfo.ArgumentList | Where-Object { $_.Length -ge 2 -and $_[0] -eq '"' -and $_[$_.Length - 1] -eq '"' }).Count -eq 0) 'ArgumentList entries have no unnecessary wrapping quotes'
    Assert-GcTestEqualV1 $argumentStartInfo.Arguments '' 'combined ProcessStartInfo.Arguments remains unused'

    foreach ($profile in @($context.Profile,$geminiProfile,$claudeProfile)) {
        $profileStartInfo = New-GcProcessStartInfoV1 -FilePath 'mock.exe' -Arguments @($profile['arguments']) -WorkingDirectory $repositoryRoot
        Assert-GcTestEqualV1 (@($profileStartInfo.ArgumentList) -join "`0") (@($profile['arguments']) -join "`0") (([string]$profile['id']) + ' fixed arguments remain separate and ordered')
        Assert-GcTestEqualV1 $profileStartInfo.Arguments '' (([string]$profile['id']) + ' does not use combined Arguments')
    }
    Assert-GcTestEqualV1 $argumentStartInfo.ArgumentList[0] '--first-flag' 'first flag remains first'
    Assert-GcTestEqualV1 $argumentStartInfo.ArgumentList[2] '--second-flag' 'second flag remains in declared position'

    $argumentObservationPath = [IO.Path]::Combine($temporaryRoot, 'argument-observation.json')
    $argumentResult = Invoke-GcMockProviderV1 -Context $context -Scenario 'success' -ArgumentObservationPath $argumentObservationPath -ObservedArguments $argumentVector
    Assert-GcTestEqualV1 $argumentResult.State 'COMPLETED' 'mock child argument observation completes'
    $argumentRecord = Get-Content -LiteralPath $argumentObservationPath -Raw | ConvertFrom-Json
    Assert-GcTestEqualV1 $argumentRecord.count $argumentVector.Count 'mock child receives exact semantic argument count'
    $expectedArgumentHashes = @($argumentVector | ForEach-Object { Get-GcSha256HexV1 -Bytes ([Text.UTF8Encoding]::new($false).GetBytes([string]$_)) })
    Assert-GcTestEqualV1 (@($argumentRecord.hashes) -join "`0") ($expectedArgumentHashes -join "`0") 'mock child receives argument values in exact order'
    $argumentRecordText = [IO.File]::ReadAllText($argumentObservationPath)
    Assert-GcTestTrueV1 (-not $argumentRecordText.Contains('value containing spaces') -and -not $argumentRecordText.Contains('--first-flag')) 'mock argument evidence persists only count and hashes'

    $environmentVariableName = 'GC_PROVIDER_RUNNER_V1_FIXED_ENV_TEST'
    $profileHadEnvironment = @($context.Profile.Keys) -ccontains 'environment'
    $originalProfileEnvironment = $context.Profile['environment']
    $originalParentEnvironment = [Environment]::GetEnvironmentVariable($environmentVariableName, 'Process')
    try {
        [void]$context.Profile.Remove('environment')
        $missingEnvironmentResult = Invoke-GcMockProviderV1 -Context $context -Scenario 'success'
        Assert-GcTestEqualV1 $missingEnvironmentResult.State 'COMPLETED' 'missing profile environment normalizes to empty dictionary'

        $context.Profile['environment'] = $null
        $nullEnvironmentResult = Invoke-GcMockProviderV1 -Context $context -Scenario 'success'
        Assert-GcTestEqualV1 $nullEnvironmentResult.State 'COMPLETED' 'null profile environment normalizes to empty dictionary'

        $context.Profile['environment'] = [ordered]@{}
        $emptyEnvironmentResult = Invoke-GcMockProviderV1 -Context $context -Scenario 'success'
        Assert-GcTestEqualV1 $emptyEnvironmentResult.State 'COMPLETED' 'empty profile environment remains usable'

        [Environment]::SetEnvironmentVariable($environmentVariableName, 'parent-value', 'Process')
        $context.Profile['environment'] = [ordered]@{ GC_PROVIDER_RUNNER_V1_FIXED_ENV_TEST = 'fixed-child-value' }
        $environmentObservationPath = [IO.Path]::Combine($temporaryRoot, 'environment-observation.txt')
        $fixedEnvironmentResult = Invoke-GcMockProviderV1 -Context $context -Scenario 'success' -EnvironmentObservationPath $environmentObservationPath
        Assert-GcTestEqualV1 $fixedEnvironmentResult.State 'COMPLETED' 'fixed profile environment reaches child process'
        Assert-GcTestEqualV1 ([IO.File]::ReadAllText($environmentObservationPath)) 'fixed-child-value' 'child receives exact fixed environment value'
        Assert-GcTestEqualV1 $context.Profile['environment'][$environmentVariableName] 'fixed-child-value' 'fixed profile environment dictionary is preserved'
        Assert-GcTestEqualV1 ([Environment]::GetEnvironmentVariable($environmentVariableName, 'Process')) 'parent-value' 'parent process environment remains unchanged'
    }
    finally {
        if ($profileHadEnvironment) { $context.Profile['environment'] = $originalProfileEnvironment }
        else { [void]$context.Profile.Remove('environment') }
        [Environment]::SetEnvironmentVariable($environmentVariableName, $originalParentEnvironment, 'Process')
    }
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
    Assert-GcTestTrueV1 (@($geminiSuccess.Attempts[0].Keys) -cnotcontains 'stdoutProtocolDiagnostics') 'valid JSON stream attempt shape remains unchanged'

    $diagnosticCases = [ordered]@{
        ANSI_WRAPPED_JSON = ([string][char]27 + '[33m{"type":"init"}' + [string][char]27 + '[0m')
        MARKDOWN_FENCE = ('```json' + "`n" + '{"type":"init"}' + "`n" + '```')
        PLAIN_TEXT = 'provider warning text'
        JSON_FRAGMENT = ('{' + "`n" + '"type": "init"' + "`n" + '}')
        MALFORMED_JSON = '{"type":}'
        MIXED_OUTPUT = ('{"type":"init"}' + "`n" + 'provider warning text')
    }
    foreach ($classification in $diagnosticCases.Keys) {
        $diagnostics = Get-GcStdoutProtocolDiagnosticsV1 -Text $diagnosticCases[$classification]
        Assert-GcTestEqualV1 $diagnostics['firstInvalidLineKind'] $classification ("stdout classification: $classification")
    }
    $ansiDiagnostics = Get-GcStdoutProtocolDiagnosticsV1 -Text $diagnosticCases['ANSI_WRAPPED_JSON']
    Assert-GcTestTrueV1 ([bool]$ansiDiagnostics['ansiDetected']) 'ANSI detection is metadata only'
    $fenceDiagnostics = Get-GcStdoutProtocolDiagnosticsV1 -Text $diagnosticCases['MARKDOWN_FENCE']
    Assert-GcTestTrueV1 ([bool]$fenceDiagnostics['markdownFenceDetected']) 'markdown fence detection is metadata only'
    $fragmentDiagnostics = Get-GcStdoutProtocolDiagnosticsV1 -Text $diagnosticCases['JSON_FRAGMENT']
    Assert-GcTestTrueV1 ([bool]$fragmentDiagnostics['multilineJsonLikely']) 'multiline JSON likelihood detected'

    $rawDiagnosticSentinel = 'GC_RAW_PROVIDER_CONTENT_' + [Guid]::NewGuid().ToString('N')
    $contaminatedResult = Read-GcJsonStreamExitProtocolV1 -Text ("{`"type`":`"init`"}`n" + $rawDiagnosticSentinel) -Truncated $false
    Assert-GcTestEqualV1 $contaminatedResult.Reason 'PROVIDER_STDOUT_NON_JSON_CONTAMINATION' 'contamination remains strict protocol failure'
    $serializedDiagnostics = ConvertTo-GcCanonicalJsonV1 -Value $contaminatedResult.Diagnostics
    Assert-GcTestTrueV1 (-not $serializedDiagnostics.Contains($rawDiagnosticSentinel)) 'sanitized diagnostics exclude raw provider content'
    Assert-GcTestTrueV1 ($serializedDiagnostics.Contains([string]$contaminatedResult.Diagnostics['firstInvalidLineSha256'])) 'sanitized diagnostics retain only invalid-line hash evidence'

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

    foreach ($scenario in @('claude-success','claude-success-is-error-false')) {
        $claudeSuccess = Invoke-GcMockProviderV1 -Context $context -Scenario $scenario -Protocol 'claude-json-exit'
        Assert-GcTestEqualV1 $claudeSuccess.State 'COMPLETED' "Claude $scenario reaches completed"
        Assert-GcTestEqualV1 $claudeSuccess.Attempts[0]['terminalEvent'] 'result' "Claude $scenario terminal result required"
    }
    foreach ($scenario in @('claude-missing-result','claude-result-number','claude-failed','claude-is-error','claude-malformed','claude-concatenated','claude-duplicate-key')) {
        $claudeFailure = Invoke-GcMockProviderV1 -Context $context -Scenario $scenario -Protocol 'claude-json-exit'
        Assert-GcTestEqualV1 $claudeFailure.State 'FAILED' "Claude $scenario fails lifecycle"
        Assert-GcTestEqualV1 $claudeFailure.FailureCategory 'PROTOCOL_FAILURE' "Claude $scenario is protocol failure"
    }
    $claudeNonzero = Invoke-GcProviderAttemptV1 -FilePath (Get-Command pwsh.exe -CommandType Application | Select-Object -First 1).Source -Arguments @('-NoProfile','-Command','[Console]::Out.Write(''{"type":"result","subtype":"success","result":"not accepted"}''); exit 9') -Prompt 'probe' -PromptTransport closed -Protocol 'claude-json-exit' -WorkingDirectory $repositoryRoot -TimeoutMilliseconds 5000 -MaximumCapturedBytes 4096 -AttemptNumber 1
    Assert-GcTestEqualV1 $claudeNonzero.Public['state'] 'FAILED' 'Claude nonzero exit fails despite valid JSON'
    Assert-GcTestEqualV1 $claudeNonzero.Public['exitCode'] 9 'Claude nonzero exit code preserved'
    Write-Output 'PASS CLAUDE JSON EXIT TERMINAL CONTRACT'

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
    $sanitizedAttempt = [ordered]@{}
    foreach ($key in $quota.Attempts[0].Keys) { $sanitizedAttempt[$key] = $quota.Attempts[0][$key] }
    $sanitizedAttempt['stdoutProtocolDiagnostics'] = $contaminatedResult.Diagnostics
    $lifecycle = New-GcLifecycleArtifactV1 -Request $artifactContext.Request -Authorization $artifactContext.Authorization -RequestSha256 $artifactContext.RequestSha256 -CreatedAtUtc ([DateTimeOffset]::UtcNow.AddSeconds(-1)) -State 'FAILED' -FailureCategory 'QUOTA_EXCEEDED' -Attempts @($sanitizedAttempt) -CheckpointWritten $true -WorktreePreserved $true
    $lifecycleResult = Write-GcRunnerArtifactAtomicV1 -Artifact $lifecycle -DestinationPath ([IO.Path]::Combine($runDirectory, 'lifecycle.json'))
    Remove-GcRunnerTemporaryArtifactsV1 -RunDirectory $runDirectory
    Assert-GcTestTrueV1 ([IO.File]::Exists($checkpointResult.Path) -and [IO.File]::Exists($lifecycleResult.Path)) 'checkpoint and lifecycle written atomically'
    Assert-GcTestEqualV1 @([IO.Directory]::EnumerateFiles($runDirectory, '*.tmp')).Count 0 'no temporary artifacts remain'
    $persisted = [IO.File]::ReadAllText($checkpointResult.Path) + [IO.File]::ReadAllText($lifecycleResult.Path)
    Assert-GcTestTrueV1 (-not $persisted.Contains($artifactContext.Prompt)) 'raw prompt not persisted'
    Assert-GcTestTrueV1 (-not $persisted.Contains('You have exceeded your monthly quota.')) 'raw provider error not persisted'
    Assert-GcTestTrueV1 (-not $persisted.Contains($rawDiagnosticSentinel)) 'raw stdout contamination not persisted in lifecycle or checkpoint'
    Assert-GcTestTrueV1 ($persisted.Contains([string]$contaminatedResult.Diagnostics['firstInvalidLineSha256'])) 'sanitized stdout diagnostic metadata persists'

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
