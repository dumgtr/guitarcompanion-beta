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
        [AllowNull()][string]$RunDirectory,
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
    $invokeParameters = @{
        Request = $Context.Request
        Authorization = $Context.Authorization
        Policy = $Context.Policy
        Profile = $Context.Profile
        Prompt = $Context.Prompt
        CancellationPath = $CancellationPath
        ExecutableOverride = $pwsh
        ArgumentsOverride = $arguments.ToArray()
        ProtocolOverride = $Protocol
        PromptTransportOverride = 'stdin'
        RetryDelayOverrideMilliseconds = 0
    }
    if ($RunDirectory) {
        $invokeParameters['RunDirectory'] = $RunDirectory
        $invokeParameters['RequestSha256'] = $Context.RequestSha256
    }
    return Invoke-GcProviderProcessRunnerV1 @invokeParameters
}

$temporaryRoot = [IO.Path]::Combine([IO.Path]::GetTempPath(), 'gc-provider-runner-v1-tests-' + [Guid]::NewGuid().ToString('N'))
[void][IO.Directory]::CreateDirectory($temporaryRoot)

try {
    $context = New-GcTestContextV1 -Directory $temporaryRoot
    Assert-GcRunnerPolicyV1 -Policy $context.Policy
    $requestContext = Assert-GcRunnerRequestV1 -Request $context.Request -Policy $context.Policy
    Assert-GcTestEqualV1 $requestContext.Prompt.Sha256 $context.Request['promptSha256'] 'request binds exact prompt hash'
    Assert-GcHumanDispatchAuthorizationV1 -Authorization $context.Authorization -Request $context.Request -RequestSha256 $context.RequestSha256 -Policy $context.Policy

    # DLP Unit Tests
    $dlpTests = @(
        @{ Name = 'ghp_'; Text = 'Bearer ghp_1234567890abcdefghijklmnopqrstuvwxyz'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'github_pat_'; Text = 'Token github_pat_11AAAAAAA0000000000000_BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'gho_'; Text = 'gho_1234567890abcdefghijklmnopqrstuvwxyz'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'ghu_'; Text = 'ghu_1234567890abcdefghijklmnopqrstuvwxyz'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'ghs_'; Text = 'ghs_1234567890abcdefghijklmnopqrstuvwxyz'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'ghr_'; Text = 'ghr_1234567890abcdefghijklmnopqrstuvwxyz'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'AKIA'; Text = 'AKIAIOSFODNN7EXAMPLE'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'ASIA'; Text = 'ASIAIOSFODNN7EXAMPLE'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'AWS_ACCESS_KEY_ID'; Text = 'AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'AWS_SECRET_ACCESS_KEY'; Text = 'AWS_SECRET_ACCESS_KEY=gcTestAwsSecretAccessKey123456789'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'AWS_SESSION_TOKEN'; Text = 'AWS_SESSION_TOKEN=gcTestAwsSessionToken123456789'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'SESSION_COOKIE'; Text = 'SESSION_COOKIE=abcdefg'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'Cookie'; Text = 'Cookie: sessionId=123'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'Set-Cookie'; Text = 'Set-Cookie: sessionId=123'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'Bearer'; Text = 'Authorization: Bearer token123'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'Basic'; Text = 'Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'X-API-Key'; Text = 'X-API-Key: my-api-key-here'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'client_secret'; Text = '{"client_secret": "my-secret-value"}'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'access_token'; Text = '{"access_token": "my-secret-value"}'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'refresh_token'; Text = '{"refresh_token": "my-secret-value"}'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'PEM header'; Text = "-----BEGIN RSA PRIVATE KEY-----`nxyz`n-----END RSA PRIVATE KEY-----"; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'label-associated JWT'; Text = 'AUTH_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'generic TOKEN assignment'; Text = 'BUILD_TOKEN=gcTestToken123'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'generic SECRET assignment'; Text = 'APP_SECRET: gcTestSecret123'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'generic PASSWORD assignment'; Text = '"PASSWORD": "gcTestPassword123"'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'generic PASSWD assignment'; Text = "'DB_PASSWD': 'gcTestPasswd123'"; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'generic APIKEY assignment'; Text = 'SERVICE_APIKEY=gcTestApiKey123'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'generic ACCESS_KEY assignment'; Text = 'STORAGE_ACCESS_KEY=gcTestAccessKey123'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'generic PRIVATE_KEY assignment'; Text = 'SIGNING_PRIVATE_KEY=gcTestPrivateKey123'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'generic CLIENT_SECRET assignment'; Text = 'OAUTH_CLIENT_SECRET=gcTestClientSecret123'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'generic SESSION assignment'; Text = 'USER_SESSION=gcTestSession123'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'generic COOKIE assignment'; Text = 'LOGIN_COOKIE=gcTestCookie123'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'generic AUTH assignment'; Text = 'SERVICE_AUTH=gcTestAuth123'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'generic CREDENTIAL assignment'; Text = 'DEPLOY_CREDENTIAL=gcTestCredential123'; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'multiple secrets'; Text = "BUILD_TOKEN=gcTestToken123`nSESSION_COOKIE=gcTestCookie123"; Expected = 'SENSITIVE_OUTPUT_BLOCKED' },
        @{ Name = 'safe text'; Text = 'Just some safe output text.'; Expected = 'SAFE_RAW_RETAINED' }
    )
    foreach ($test in $dlpTests) {
        $bytes = [Text.UTF8Encoding]::new($false, $true).GetBytes($test.Text)
        $actualState = Get-GcSecurityStateV1 -Bytes $bytes
        Assert-GcTestEqualV1 $actualState $test.Expected ("DLP coverage for " + $test.Name)
    }
    Write-Output "PASS DLP REDACTION COVERAGE"

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
    Assert-GcTestEqualV1 $geminiSuccess.Attempts[0]['payloadParseStatus'] 'VALID' 'Gemini success requires valid reviewer payload'
    Assert-GcTestTrueV1 (@($geminiSuccess.Attempts[0].Keys) -cnotcontains 'stdoutProtocolDiagnostics') 'valid JSON stream attempt shape remains unchanged'

    $contiguousPayload = '{"type":"message","role":"assistant","content":"review follows: ```json\n{\"verdict\":\"PASS\",\"summary\":\"exact object\",\"requiredConstraints\":[],\"risks\":[],\"recommendedSeams\":[],\"acceptanceTests\":[],\"filesReviewed\":[]}\n```","delta":false}' + "`n" + '{"type":"result","status":"success"}'
    $contiguousResult = Get-GcGeminiReviewerPayloadV1 -Text $contiguousPayload -Truncated $false
    Assert-GcTestEqualV1 $contiguousResult.Status 'VALID' 'exact contiguous reviewer object is extracted without fence repair'
    Assert-GcTestTrueV1 ([Text.UTF8Encoding]::new($false, $true).GetString($contiguousResult.Bytes).StartsWith('{"verdict":"PASS"', [StringComparison]::Ordinal)) 'persisted payload bytes are the exact JSON object only'

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

    $geminiMissingPayload = Invoke-GcMockProviderV1 -Context $context -Scenario 'gemini-missing-reviewer-payload' -Protocol 'json-stream-exit'
    Assert-GcTestEqualV1 $geminiMissingPayload.State 'FAILED' 'Gemini missing reviewer payload fails gate'
    Assert-GcTestEqualV1 $geminiMissingPayload.Attempts[0]['payloadParseStatus'] 'NOT_PRESENT' 'missing reviewer payload is not invented'
    $geminiMalformedPayload = Invoke-GcMockProviderV1 -Context $context -Scenario 'gemini-malformed-reviewer-payload' -Protocol 'json-stream-exit'
    Assert-GcTestEqualV1 $geminiMalformedPayload.State 'FAILED' 'Gemini malformed reviewer payload fails gate'
    Assert-GcTestEqualV1 $geminiMalformedPayload.Attempts[0]['payloadParseStatus'] 'INVALID' 'malformed reviewer payload is retained as invalid without repair'

    $geminiTruncatedContext = New-GcTestContextV1 -Directory $temporaryRoot
    $geminiTruncatedResult = Invoke-GcProviderAttemptV1 -FilePath (Get-Command pwsh.exe -CommandType Application | Select-Object -First 1).Source -Arguments @('-NoProfile', '-Command', '[Console]::Out.WriteLine(''{"type":"init"}''); [Console]::Out.WriteLine(''{"type":"result","status":"success"}''); exit 0') -Prompt 'probe' -PromptTransport closed -Protocol 'json-stream-exit' -WorkingDirectory $repositoryRoot -TimeoutMilliseconds 5000 -MaximumCapturedBytes 10 -AttemptNumber 1
    Assert-GcTestEqualV1 $geminiTruncatedResult.Public['state'] 'FAILED' 'gemini truncated buffer fails lifecycle'
    Assert-GcTestEqualV1 $geminiTruncatedResult.Public['failureCategory'] 'PROTOCOL_FAILURE' 'gemini truncated buffer is protocol failure'

    Write-Output 'PASS GEMINI JSON STREAM EXIT TERMINAL EVENTS'

    $retentionContext = New-GcTestContextV1 -Directory $temporaryRoot
    $retentionContext.Request['providerProfileId'] = 'gemini-plan-review'
    $retentionContext.Authorization['providerProfileId'] = 'gemini-plan-review'
    $retentionContext.Profile = Get-GcProviderProfileV1 -Policy $retentionContext.Policy -ProfileId 'gemini-plan-review'
    $retentionRoot = [IO.Path]::Combine($temporaryRoot, 'retained-success')
    $retentionRun = New-GcRunnerRunDirectoryV1 -ArtifactRoot $retentionRoot -AuthorizationId $retentionContext.Authorization['authorizationId']
    $retainedSuccess = Invoke-GcMockProviderV1 -Context $retentionContext -Scenario 'gemini-success-result' -Protocol 'json-stream-exit' -RunDirectory $retentionRun
    Assert-GcTestEqualV1 $retainedSuccess.State 'COMPLETED' 'retained Gemini reviewer completes'
    Assert-GcTestEqualV1 $retainedSuccess.Attempts.Count 1 'retained success uses exactly one attempt'
    $retainedAttempt = $retainedSuccess.Attempts[0]
    foreach ($pathKey in @('stdoutArtifactPath','stderrArtifactPath','attemptResultPath','parsedPayloadPath')) {
        Assert-GcTestTrueV1 ([IO.File]::Exists([string]$retainedAttempt[$pathKey])) ($pathKey + ' survives cleanup')
    }
    Remove-GcRunnerTemporaryArtifactsV1 -RunDirectory $retentionRun
    Assert-GcTestTrueV1 ([IO.File]::Exists([string]$retainedAttempt['stdoutArtifactPath'])) 'successful stdout survives temporary cleanup'
    Assert-GcTestEqualV1 (Get-GcSha256HexV1 -Bytes ([IO.File]::ReadAllBytes([string]$retainedAttempt['stdoutArtifactPath']))) $retainedAttempt['stdoutArtifactSha256'] 'stdout lifecycle hash matches retained file'
    Assert-GcTestEqualV1 (Get-GcSha256HexV1 -Bytes ([IO.File]::ReadAllBytes([string]$retainedAttempt['stderrArtifactPath']))) $retainedAttempt['stderrArtifactSha256'] 'stderr lifecycle hash matches retained file'
    Assert-GcTestEqualV1 (Get-GcSha256HexV1 -Bytes ([IO.File]::ReadAllBytes([string]$retainedAttempt['parsedPayloadPath']))) $retainedAttempt['parsedPayloadSha256'] 'parsed payload lifecycle hash matches retained file'
    $attemptResultFile = Read-GcRunnerJsonFileV1 -LiteralPath ([string]$retainedAttempt['attemptResultPath'])
    Assert-GcTestEqualV1 $attemptResultFile.Value['cleanupStatus'] 'RETAINED' 'attempt result records retained cleanup state'
    Assert-GcTestEqualV1 $attemptResultFile.Value['stderrLength'] ([IO.FileInfo]::new([string]$retainedAttempt['stderrArtifactPath']).Length) 'stderr metadata records retained byte length'
    Assert-GcTestEqualV1 $attemptResultFile.Value['payloadParseStatus'] 'VALID' 'attempt result records valid reviewer payload'
    Assert-GcTestThrowsCategoryV1 { Write-GcRunnerBytesAtomicV1 -Bytes ([byte[]](1,2,3)) -DestinationPath ([string]$retainedAttempt['stdoutArtifactPath']) } 'RUNNER_FAILURE' 'retained stdout artifact cannot be overwritten'
    $retainedLifecycle = New-GcLifecycleArtifactV1 -Request $retentionContext.Request -Authorization $retentionContext.Authorization -RequestSha256 $retentionContext.RequestSha256 -CreatedAtUtc ([DateTimeOffset]::UtcNow.AddSeconds(-1)) -State $retainedSuccess.State -FailureCategory $retainedSuccess.FailureCategory -Attempts $retainedSuccess.Attempts -CheckpointWritten $false -WorktreePreserved $true
    $retainedLifecycleResult = Write-GcRunnerArtifactAtomicV1 -Artifact $retainedLifecycle -DestinationPath ([IO.Path]::Combine($retentionRun, 'lifecycle.json'))
    $persistedLifecycle = Read-GcRunnerJsonFileV1 -LiteralPath $retainedLifecycleResult.Path
    Assert-GcTestEqualV1 $persistedLifecycle.Value['attempts'][0]['attemptResultSha256'] $retainedAttempt['attemptResultSha256'] 'lifecycle references attempt-result hash'
    Assert-GcTestEqualV1 $persistedLifecycle.Value['attempts'][0]['parsedPayloadSha256'] $retainedAttempt['parsedPayloadSha256'] 'lifecycle references parsed payload hash'

    foreach ($case in @(
        [pscustomobject]@{ Scenario = 'gemini-malformed-reviewer-payload'; Expected = 'INVALID'; Name = 'retained-malformed' },
        [pscustomobject]@{ Scenario = 'gemini-missing-reviewer-payload'; Expected = 'NOT_PRESENT'; Name = 'retained-missing' }
    )) {
        $caseContext = New-GcTestContextV1 -Directory $temporaryRoot
        $caseContext.Request['providerProfileId'] = 'gemini-plan-review'
        $caseContext.Authorization['providerProfileId'] = 'gemini-plan-review'
        $caseContext.Profile = Get-GcProviderProfileV1 -Policy $caseContext.Policy -ProfileId 'gemini-plan-review'
        $caseRun = New-GcRunnerRunDirectoryV1 -ArtifactRoot ([IO.Path]::Combine($temporaryRoot, $case.Name)) -AuthorizationId $caseContext.Authorization['authorizationId']
        $caseResult = Invoke-GcMockProviderV1 -Context $caseContext -Scenario $case.Scenario -Protocol 'json-stream-exit' -RunDirectory $caseRun
        Assert-GcTestEqualV1 $caseResult.State 'FAILED' ($case.Name + ' is reviewer-gate failure')
        Assert-GcTestEqualV1 $caseResult.Attempts.Count 1 ($case.Name + ' remains one attempt')
        Assert-GcTestEqualV1 $caseResult.Attempts[0]['payloadParseStatus'] $case.Expected ($case.Name + ' parse status retained')
        Assert-GcTestTrueV1 ([IO.File]::Exists([string]$caseResult.Attempts[0]['stdoutArtifactPath'])) ($case.Name + ' raw stdout retained')
        Assert-GcTestTrueV1 ($null -eq $caseResult.Attempts[0]['parsedPayloadPath']) ($case.Name + ' writes no invented parsed payload')
    }

    $timeoutArtifactContext = New-GcTestContextV1 -Directory $temporaryRoot
    $timeoutArtifactContext.Request['timeoutMilliseconds'] = [long]1000
    $timeoutArtifactRun = New-GcRunnerRunDirectoryV1 -ArtifactRoot ([IO.Path]::Combine($temporaryRoot, 'retained-timeout')) -AuthorizationId $timeoutArtifactContext.Authorization['authorizationId']
    $retainedTimeout = Invoke-GcMockProviderV1 -Context $timeoutArtifactContext -Scenario 'timeout-evidence' -RunDirectory $timeoutArtifactRun
    Assert-GcTestEqualV1 $retainedTimeout.State 'TIMED_OUT' 'timeout remains bounded failure'
    Assert-GcTestEqualV1 $retainedTimeout.Attempts.Count 1 'timeout artifacts do not change attempt count'
    Assert-GcTestTrueV1 ([IO.File]::Exists([string]$retainedTimeout.Attempts[0]['stdoutArtifactPath']) -and [IO.File]::Exists([string]$retainedTimeout.Attempts[0]['stderrArtifactPath'])) 'timeout stdout and stderr remain auditable'

    $sensitiveContext = New-GcTestContextV1 -Directory $temporaryRoot
    $sensitiveRun = New-GcRunnerRunDirectoryV1 -ArtifactRoot ([IO.Path]::Combine($temporaryRoot, 'retained-sensitive')) -AuthorizationId $sensitiveContext.Authorization['authorizationId']
    $sensitiveResult = Invoke-GcMockProviderV1 -Context $sensitiveContext -Scenario 'sensitive-output' -RunDirectory $sensitiveRun
    Assert-GcTestEqualV1 $sensitiveResult.State 'FAILED' 'sensitive output fails attempt'
    Assert-GcTestEqualV1 $sensitiveResult.FailureCategory 'PROTOCOL_FAILURE' 'sensitive output is protocol failure'
    Assert-GcTestEqualV1 $sensitiveResult.DiagnosticCode 'SENSITIVE_OUTPUT_BLOCKED' 'sensitive output yields explicit diagnostic code'
    Assert-GcTestEqualV1 $sensitiveResult.Attempts.Count 1 'sensitive output is never retried'
    Assert-GcTestEqualV1 $sensitiveResult.Attempts[0]['exitCode'] 0 'exit code zero does not bypass sensitive-output failure'
    Assert-GcTestTrueV1 ($null -eq $sensitiveResult.Attempts[0]['stdoutArtifactPath']) 'sensitive attempt suppresses safe peer stdout raw artifact'
    Assert-GcTestTrueV1 ($null -eq $sensitiveResult.Attempts[0]['stderrArtifactPath']) 'sensitive stderr artifact path is null'
    Assert-GcTestTrueV1 ($null -eq $sensitiveResult.Attempts[0]['parsedPayloadPath']) 'sensitive attempt writes no reviewer payload'
    $sensitiveAttemptResult = (Read-GcRunnerJsonFileV1 -LiteralPath ([string]$sensitiveResult.Attempts[0]['attemptResultPath'])).Value
    Assert-GcTestEqualV1 $sensitiveAttemptResult['stderrSecurityState'] 'SENSITIVE_OUTPUT_BLOCKED' 'attempt result records explicit security state'

    foreach ($sensitiveCase in @(
        [pscustomobject]@{ Scenario = 'sensitive-stdout'; Protocol = 'codex-jsonl'; Stream = 'stdout'; Name = 'blocked-ghp-stdout' },
        [pscustomobject]@{ Scenario = 'sensitive-split-output'; Protocol = 'codex-jsonl'; Stream = 'stdout'; Name = 'blocked-split-token' },
        [pscustomobject]@{ Scenario = 'sensitive-multiple-output'; Protocol = 'codex-jsonl'; Stream = 'both'; Name = 'blocked-multiple-secrets' },
        [pscustomobject]@{ Scenario = 'gemini-sensitive-reviewer'; Protocol = 'json-stream-exit'; Stream = 'stdout'; Name = 'blocked-sensitive-reviewer' }
    )) {
        $blockedContext = New-GcTestContextV1 -Directory $temporaryRoot
        if ($sensitiveCase.Protocol -eq 'json-stream-exit') {
            $blockedContext.Request['providerProfileId'] = 'gemini-plan-review'
            $blockedContext.Authorization['providerProfileId'] = 'gemini-plan-review'
            $blockedContext.Profile = Get-GcProviderProfileV1 -Policy $blockedContext.Policy -ProfileId 'gemini-plan-review'
        }
        $blockedRun = New-GcRunnerRunDirectoryV1 -ArtifactRoot ([IO.Path]::Combine($temporaryRoot, $sensitiveCase.Name)) -AuthorizationId $blockedContext.Authorization['authorizationId']
        $blockedResult = Invoke-GcMockProviderV1 -Context $blockedContext -Scenario $sensitiveCase.Scenario -Protocol $sensitiveCase.Protocol -RunDirectory $blockedRun
        Assert-GcTestEqualV1 $blockedResult.State 'FAILED' ($sensitiveCase.Name + ' fails closed')
        Assert-GcTestEqualV1 $blockedResult.FailureCategory 'PROTOCOL_FAILURE' ($sensitiveCase.Name + ' is protocol failure')
        Assert-GcTestEqualV1 $blockedResult.Attempts.Count 1 ($sensitiveCase.Name + ' remains one attempt')
        Assert-GcTestEqualV1 $blockedResult.Attempts[0]['exitCode'] 0 ($sensitiveCase.Name + ' preserves provider exit zero without bypass')
        Assert-GcTestTrueV1 ($null -eq $blockedResult.Attempts[0]['stdoutArtifactPath'] -and $null -eq $blockedResult.Attempts[0]['stderrArtifactPath']) ($sensitiveCase.Name + ' writes no raw stream artifact')
        Assert-GcTestTrueV1 ($null -eq $blockedResult.Attempts[0]['parsedPayloadPath']) ($sensitiveCase.Name + ' writes no parsed reviewer payload')
        Assert-GcTestEqualV1 @(Get-ChildItem -LiteralPath ([IO.Path]::Combine($blockedRun, 'attempt-1')) -File -Filter 'provider-*.raw').Count 0 ($sensitiveCase.Name + ' leaves no provider raw file')
        $blockedAttemptResult = (Read-GcRunnerJsonFileV1 -LiteralPath ([string]$blockedResult.Attempts[0]['attemptResultPath'])).Value
        Assert-GcTestEqualV1 $blockedAttemptResult['payloadParseReason'] 'SENSITIVE_OUTPUT_BLOCKED' ($sensitiveCase.Name + ' records security block in attempt result')
    }
    Write-Output 'PASS RETAINED STREAMS REVIEWER PAYLOAD ATTEMPT RESULT TIMEOUT AND REDACTION'

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
