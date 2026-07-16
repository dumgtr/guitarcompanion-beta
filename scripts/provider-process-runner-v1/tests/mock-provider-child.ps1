param(
    [Parameter(Mandatory)]
    [ValidateSet('success','turn-failed','missing-terminal','event-after-terminal','malformed','exit-nonzero','quota','rate-limit','rate-then-success','timeout','timeout-evidence','timeout-then-success','cancel','flood','child-timeout','sensitive-output','sensitive-stdout','sensitive-split-output','sensitive-multiple-output','gemini-sensitive-reviewer','gemini-success-result','gemini-missing-reviewer-payload','gemini-malformed-reviewer-payload','gemini-missing-result','gemini-result-failed','gemini-event-after-result','gemini-malformed','gemini-duplicate-result','gemini-missing-status','claude-success','claude-success-is-error-false','claude-missing-result','claude-result-number','claude-failed','claude-is-error','claude-malformed','claude-concatenated','claude-duplicate-key','quota-hang','rate-limit-hang','ansi-contamination','ansi-contamination-claude','ansi-contamination-codex','non-json-contamination')]
    [string]$Scenario,
    [AllowNull()][string]$CounterPath,
    [AllowNull()][string]$ObservationPath,
    [AllowNull()][string]$EnvironmentObservationPath,
    [AllowNull()][string]$ArgumentObservationPath,
    [AllowNull()][string]$ObservedArgumentOne,
    [AllowNull()][string]$ObservedArgumentTwo,
    [AllowNull()][string]$ObservedArgumentThree,
    [AllowNull()][string]$ObservedArgumentFour,
    [AllowNull()][string]$ChildPidPath,
    [AllowNull()][string]$CancellationPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$prompt = [Console]::In.ReadToEnd()
if ($ObservationPath) {
    $bytes = [Text.UTF8Encoding]::new($false).GetBytes($prompt)
    $hash = ([Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($bytes))).ToLowerInvariant()
    [IO.File]::WriteAllText($ObservationPath, ('{0}|{1}' -f $bytes.Length, $hash), [Text.UTF8Encoding]::new($false))
}
if ($EnvironmentObservationPath) {
    $value = [Environment]::GetEnvironmentVariable('GC_PROVIDER_RUNNER_V1_FIXED_ENV_TEST', 'Process')
    [IO.File]::WriteAllText($EnvironmentObservationPath, [string]$value, [Text.UTF8Encoding]::new($false))
}
if ($ArgumentObservationPath) {
    $hashes = [Collections.Generic.List[string]]::new()
    $observedArguments = @($ObservedArgumentOne,$ObservedArgumentTwo,$ObservedArgumentThree,$ObservedArgumentFour)
    foreach ($argument in $observedArguments) {
        $bytes = [Text.UTF8Encoding]::new($false).GetBytes([string]$argument)
        $hashes.Add((([Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($bytes))).ToLowerInvariant()))
    }
    $record = [ordered]@{ count = [long]$observedArguments.Count; hashes = $hashes.ToArray() }
    [IO.File]::WriteAllText($ArgumentObservationPath, ($record | ConvertTo-Json -Compress), [Text.UTF8Encoding]::new($false))
}

$count = 1
if ($CounterPath) {
    if ([IO.File]::Exists($CounterPath)) { $count = [int]([IO.File]::ReadAllText($CounterPath)) + 1 }
    [IO.File]::WriteAllText($CounterPath, [string]$count, [Text.UTF8Encoding]::new($false))
}

function Write-MockSuccess {
    [Console]::Out.WriteLine('{"type":"thread.started","thread_id":"mock"}')
    [Console]::Out.WriteLine('{"type":"turn.started"}')
    [Console]::Out.WriteLine('{"type":"item.completed","item":{"type":"agent_message","text":"mock complete"}}')
    [Console]::Out.WriteLine('{"type":"turn.completed","usage":{"input_tokens":1,"output_tokens":1}}')
}

function Write-MockGeminiReviewerPayload {
    param([Parameter(Mandatory)][string]$Payload)
    $event = [ordered]@{ type = 'message'; role = 'assistant'; content = $Payload; delta = $false }
    [Console]::Out.WriteLine(($event | ConvertTo-Json -Compress))
}

$validReviewerPayload = '{"verdict":"PASS","summary":"bounded review complete","requiredConstraints":[],"risks":[],"recommendedSeams":[],"acceptanceTests":["A"],"filesReviewed":["outputs/app.js"]}'

switch ($Scenario) {
    'success' { Write-MockSuccess; exit 0 }
    'turn-failed' {
        [Console]::Out.WriteLine('{"type":"turn.started"}')
        [Console]::Out.WriteLine('{"type":"turn.failed","error":{"message":"mock provider failure"}}')
        exit 0
    }
    'missing-terminal' { [Console]::Out.WriteLine('{"type":"turn.started"}'); exit 0 }
    'event-after-terminal' {
        Write-MockSuccess
        [Console]::Out.WriteLine('{"type":"item.completed","item":{"type":"agent_message","text":"late event"}}')
        exit 0
    }
    'gemini-success-result' {
        [Console]::Out.WriteLine('{"type":"init"}')
        Write-MockGeminiReviewerPayload -Payload $validReviewerPayload
        [Console]::Error.WriteLine('mock reviewer stderr')
        [Console]::Out.WriteLine('{"type":"result","status":"success"}')
        exit 0
    }
    'gemini-missing-reviewer-payload' {
        [Console]::Out.WriteLine('{"type":"init"}')
        [Console]::Out.WriteLine('{"type":"result","status":"success"}')
        exit 0
    }
    'gemini-malformed-reviewer-payload' {
        [Console]::Out.WriteLine('{"type":"init"}')
        Write-MockGeminiReviewerPayload -Payload '{"verdict":'
        [Console]::Out.WriteLine('{"type":"result","status":"success"}')
        exit 0
    }
    'gemini-missing-result' {
        [Console]::Out.WriteLine('{"type":"init"}')
        exit 0
    }
    'gemini-result-failed' {
        [Console]::Out.WriteLine('{"type":"init"}')
        [Console]::Out.WriteLine('{"type":"result","status":"failure"}')
        exit 0
    }
    'gemini-duplicate-result' {
        [Console]::Out.WriteLine('{"type":"init"}')
        [Console]::Out.WriteLine('{"type":"result","status":"success"}')
        [Console]::Out.WriteLine('{"type":"result","status":"success"}')
        exit 0
    }
    'gemini-missing-status' {
        [Console]::Out.WriteLine('{"type":"init"}')
        [Console]::Out.WriteLine('{"type":"result"}')
        exit 0
    }
    'gemini-event-after-result' {
        [Console]::Out.WriteLine('{"type":"init"}')
        [Console]::Out.WriteLine('{"type":"result","status":"success"}')
        [Console]::Out.WriteLine('{"type":"init"}')
        exit 0
    }
    'gemini-malformed' {
        [Console]::Out.WriteLine('{"type":"init"}')
        [Console]::Out.WriteLine('{not-json')
        exit 0
    }
    'claude-success' { [Console]::Out.Write('{"type":"result","subtype":"success","result":"read-only review complete"}'); exit 0 }
    'claude-success-is-error-false' { [Console]::Out.Write('{"type":"result","subtype":"success","result":"read-only review complete","is_error":false}'); exit 0 }
    'claude-missing-result' { [Console]::Out.Write('{"type":"result","subtype":"success"}'); exit 0 }
    'claude-result-number' { [Console]::Out.Write('{"type":"result","subtype":"success","result":7}'); exit 0 }
    'claude-failed' { [Console]::Out.Write('{"type":"result","subtype":"error","result":"failed"}'); exit 0 }
    'claude-is-error' { [Console]::Out.Write('{"type":"result","subtype":"success","result":"failed","is_error":true}'); exit 0 }
    'claude-malformed' { [Console]::Out.Write('{"type":"result"'); exit 0 }
    'claude-concatenated' { [Console]::Out.Write('{"type":"result","subtype":"success","result":"one"}{"type":"result","subtype":"success","result":"two"}'); exit 0 }
    'claude-duplicate-key' { [Console]::Out.Write('{"type":"result","subtype":"success","result":"one","result":"two"}'); exit 0 }
    'malformed' { [Console]::Out.WriteLine('{not-json'); exit 0 }
    'exit-nonzero' { [Console]::Error.WriteLine('mock provider failed'); exit 7 }
    'quota' { [Console]::Error.WriteLine('You have exceeded your monthly quota.'); exit 2 }
    'rate-limit' { [Console]::Error.WriteLine('429 too many requests: rate limit reached'); exit 2 }
    'rate-then-success' {
        if ($count -eq 1) { [Console]::Error.WriteLine('429 too many requests: rate limit reached'); exit 2 }
        Write-MockSuccess
        exit 0
    }
    'timeout' { Start-Sleep -Seconds 30; Write-MockSuccess; exit 0 }
    'timeout-evidence' {
        [Console]::Out.WriteLine('{"type":"turn.started"}')
        [Console]::Error.WriteLine('mock timeout stderr')
        Start-Sleep -Seconds 30
        exit 0
    }
    'timeout-then-success' {
        if ($count -eq 1) { Start-Sleep -Seconds 30 }
        Write-MockSuccess
        exit 0
    }
    'cancel' {
        if ($CancellationPath) { [IO.File]::WriteAllText($CancellationPath, 'cancel', [Text.UTF8Encoding]::new($false)) }
        Start-Sleep -Seconds 30
        Write-MockSuccess
        exit 0
    }
    'flood' {
        $payload = 'x' * 4000
        for ($i = 0; $i -lt 256; $i++) {
            [Console]::Out.WriteLine('{"type":"item.completed","item":{"type":"agent_message","text":"' + $payload + '"}}')
            [Console]::Error.WriteLine(('mock stderr {0} {1}' -f $i, $payload))
        }
        [Console]::Out.WriteLine('{"type":"turn.completed"}')
        exit 0
    }
    'sensitive-output' {
        [Console]::Out.WriteLine('{"type":"thread.started","thread_id":"mock"}')
        [Console]::Error.WriteLine('Authorization: Bearer GC_TEST_SECRET_TOKEN_123456789')
        [Console]::Out.WriteLine('{"type":"turn.completed"}')
        exit 0
    }
    'sensitive-stdout' {
        [Console]::Out.WriteLine('ghp_1234567890abcdefghijklmnopqrstuvwxyz')
        [Console]::Out.WriteLine('{"type":"turn.completed"}')
        exit 0
    }
    'sensitive-split-output' {
        [Console]::Out.Write('github_')
        [Console]::Out.Flush()
        Start-Sleep -Milliseconds 40
        [Console]::Out.WriteLine('pat_11AAAAAAA0000000000000_BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB')
        [Console]::Out.WriteLine('{"type":"turn.completed"}')
        exit 0
    }
    'sensitive-multiple-output' {
        [Console]::Out.WriteLine('AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE')
        [Console]::Error.WriteLine('SESSION_COOKIE=gc_test_session_cookie_123456')
        [Console]::Out.WriteLine('{"type":"turn.completed"}')
        exit 0
    }
    'gemini-sensitive-reviewer' {
        [Console]::Out.WriteLine('{"type":"init"}')
        Write-MockGeminiReviewerPayload -Payload '{"verdict":"PASS","summary":"client_secret=gc_test_client_secret_123456","requiredConstraints":[],"risks":[],"recommendedSeams":[],"acceptanceTests":[],"filesReviewed":[]}'
        [Console]::Out.WriteLine('{"type":"result","status":"success"}')
        exit 0
    }
    'child-timeout' {
        $pwsh = (Get-Command pwsh.exe -CommandType Application | Select-Object -First 1).Source
        $start = [Diagnostics.ProcessStartInfo]::new()
        $start.FileName = $pwsh
        $start.UseShellExecute = $false
        $start.CreateNoWindow = $true
        [void]$start.ArgumentList.Add('-NoProfile')
        [void]$start.ArgumentList.Add('-Command')
        [void]$start.ArgumentList.Add('Start-Sleep -Seconds 30')
        $child = [Diagnostics.Process]::Start($start)
        if ($ChildPidPath) { [IO.File]::WriteAllText($ChildPidPath, [string]$child.Id, [Text.UTF8Encoding]::new($false)) }
        Start-Sleep -Seconds 30
        exit 0
    }
}
