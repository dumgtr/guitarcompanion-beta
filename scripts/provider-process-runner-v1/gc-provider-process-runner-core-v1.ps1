Set-StrictMode -Version Latest

function Throw-GcRunnerFailureV1 {
    param(
        [Parameter(Mandatory)][string]$Category,
        [Parameter(Mandatory)][string]$Message
    )

    $exception = [InvalidOperationException]::new($Message)
    $exception.Data['GcRunnerCategory'] = $Category
    throw $exception
}

function Get-GcRunnerFailureCategoryV1 {
    param([Parameter(Mandatory)][Management.Automation.ErrorRecord]$ErrorRecord)

    $category = $ErrorRecord.Exception.Data['GcRunnerCategory']
    if ($category -is [string] -and $category) { return $category }
    return 'RUNNER_FAILURE'
}

function Get-GcSha256HexV1 {
    param([Parameter(Mandatory)][AllowEmptyCollection()][byte[]]$Bytes)

    $hash = [Security.Cryptography.SHA256]::HashData($Bytes)
    return ([Convert]::ToHexString($hash)).ToLowerInvariant()
}

function Read-GcRunnerUtf8FileV1 {
    param([Parameter(Mandatory)][string]$LiteralPath)

    try { $bytes = [IO.File]::ReadAllBytes($LiteralPath) }
    catch { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_FILE_READ_FAILED' }

    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_UTF8_BOM_FORBIDDEN'
    }

    try { $text = [Text.UTF8Encoding]::new($false, $true).GetString($bytes) }
    catch { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_UTF8_INVALID' }

    return [pscustomobject]@{
        Bytes = $bytes
        Text = $text
        Sha256 = Get-GcSha256HexV1 -Bytes $bytes
    }
}

function ConvertFrom-GcRunnerJsonElementV1 {
    param([Parameter(Mandatory)][Text.Json.JsonElement]$Element)

    switch ($Element.ValueKind) {
        ([Text.Json.JsonValueKind]::Object) {
            $result = [Collections.Generic.Dictionary[string,object]]::new([StringComparer]::Ordinal)
            foreach ($property in $Element.EnumerateObject()) {
                if ($result.ContainsKey($property.Name)) {
                    Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_JSON_DUPLICATE_PROPERTY'
                }
                $result.Add($property.Name, (ConvertFrom-GcRunnerJsonElementV1 -Element $property.Value))
            }
            return $result
        }
        ([Text.Json.JsonValueKind]::Array) {
            $items = [Collections.Generic.List[object]]::new()
            foreach ($item in $Element.EnumerateArray()) {
                $items.Add((ConvertFrom-GcRunnerJsonElementV1 -Element $item))
            }
            return ,$items.ToArray()
        }
        ([Text.Json.JsonValueKind]::String) { return $Element.GetString() }
        ([Text.Json.JsonValueKind]::Number) {
            $integer = 0L
            if ($Element.TryGetInt64([ref]$integer)) { return $integer }
            Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_JSON_INTEGER_REQUIRED'
        }
        ([Text.Json.JsonValueKind]::True) { return $true }
        ([Text.Json.JsonValueKind]::False) { return $false }
        ([Text.Json.JsonValueKind]::Null) { return $null }
        default { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_JSON_VALUE_UNSUPPORTED' }
    }
}

function ConvertFrom-GcRunnerStrictJsonV1 {
    param([Parameter(Mandatory)][string]$Text)

    $options = [Text.Json.JsonDocumentOptions]::new()
    $options.AllowTrailingCommas = $false
    $options.CommentHandling = [Text.Json.JsonCommentHandling]::Disallow
    $options.MaxDepth = 32
    try {
        $document = [Text.Json.JsonDocument]::Parse($Text, $options)
        try { return ConvertFrom-GcRunnerJsonElementV1 -Element $document.RootElement }
        finally { $document.Dispose() }
    }
    catch {
        if ($_.Exception.Data['GcRunnerCategory']) { throw }
        Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_JSON_INVALID'
    }
}

function Read-GcRunnerJsonFileV1 {
    param([Parameter(Mandatory)][string]$LiteralPath)

    $file = Read-GcRunnerUtf8FileV1 -LiteralPath $LiteralPath
    $value = ConvertFrom-GcRunnerStrictJsonV1 -Text $file.Text
    if ($value -isnot [Collections.IDictionary]) {
        Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_JSON_OBJECT_REQUIRED'
    }
    return [pscustomobject]@{ Value = $value; Bytes = $file.Bytes; Sha256 = $file.Sha256 }
}

function ConvertTo-GcCanonicalJsonValueV1 {
    param([AllowNull()][object]$Value)

    if ($null -eq $Value) { return 'null' }
    if ($Value -is [string]) { return [Text.Json.JsonSerializer]::Serialize([object][string]$Value, [type][string], [Text.Json.JsonSerializerOptions]$null) }
    if ($Value -is [bool]) { if ($Value) { return 'true' }; return 'false' }
    if ($Value -is [byte] -or $Value -is [sbyte] -or $Value -is [int16] -or $Value -is [uint16] -or
        $Value -is [int32] -or $Value -is [uint32] -or $Value -is [int64]) {
        return ([Convert]::ToString($Value, [Globalization.CultureInfo]::InvariantCulture))
    }
    if ($Value -is [Collections.IDictionary]) {
        $keys = [string[]]@($Value.Keys | ForEach-Object { [string]$_ })
        [Array]::Sort($keys, [StringComparer]::Ordinal)
        $members = foreach ($key in $keys) {
            ([Text.Json.JsonSerializer]::Serialize([object]$key, [type][string], [Text.Json.JsonSerializerOptions]$null)) + ':' + (ConvertTo-GcCanonicalJsonValueV1 -Value $Value[$key])
        }
        return '{' + ($members -join ',') + '}'
    }
    if ($Value -is [Collections.IEnumerable]) {
        $items = foreach ($item in $Value) { ConvertTo-GcCanonicalJsonValueV1 -Value $item }
        return '[' + ($items -join ',') + ']'
    }
    foreach ($property in $Value.PSObject.Properties) {
        if ($property.MemberType -notin @('NoteProperty','Property')) { continue }
        $dictionary = [Collections.Generic.Dictionary[string,object]]::new([StringComparer]::Ordinal)
        foreach ($candidate in $Value.PSObject.Properties) {
            if ($candidate.MemberType -in @('NoteProperty','Property')) { $dictionary[[string]$candidate.Name] = $candidate.Value }
        }
        return ConvertTo-GcCanonicalJsonValueV1 -Value $dictionary
    }
    Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_CANONICAL_JSON_TYPE_UNSUPPORTED'
}

function ConvertTo-GcCanonicalJsonV1 {
    param([Parameter(Mandatory)][object]$Value)
    return ConvertTo-GcCanonicalJsonValueV1 -Value $Value
}

function Assert-GcClosedObjectV1 {
    param(
        [Parameter(Mandatory)][Collections.IDictionary]$Object,
        [Parameter(Mandatory)][string[]]$Keys,
        [Parameter(Mandatory)][string]$ContractName
    )

    $allowed = [Collections.Generic.HashSet[string]]::new($Keys, [StringComparer]::Ordinal)
    foreach ($key in $Object.Keys) {
        if (-not $allowed.Contains([string]$key)) {
            Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message ($ContractName + '_UNKNOWN_PROPERTY')
        }
    }
    foreach ($key in $Keys) {
        $present = $false
        foreach ($candidate in $Object.Keys) {
            if ([string]::Equals([string]$candidate, $key, [StringComparison]::Ordinal)) { $present = $true; break }
        }
        if (-not $present) {
            Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message ($ContractName + '_PROPERTY_REQUIRED')
        }
    }
}

function Test-GcOrdinalStringV1 {
    param([AllowNull()][object]$Value, [int]$Minimum = 1, [int]$Maximum = 4096)
    return $Value -is [string] -and $Value.Length -ge $Minimum -and $Value.Length -le $Maximum -and $Value -notmatch '[\x00-\x08\x0B\x0C\x0E-\x1F]'
}

function Test-GcLowerHexV1 {
    param([AllowNull()][object]$Value, [int]$Length)
    return $Value -is [string] -and $Value -cmatch ('^[0-9a-f]{' + $Length + '}$')
}

function Assert-GcCanonicalAbsolutePathV1 {
    param([Parameter(Mandatory)][string]$Path, [Parameter(Mandatory)][string]$FailureCode)
    try { $full = [IO.Path]::GetFullPath($Path) }
    catch { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message $FailureCode }
    if (-not [string]::Equals($Path, $full, [StringComparison]::Ordinal)) {
        Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message $FailureCode
    }
    return $full
}

function Assert-GcRunnerRequestV1 {
    param(
        [Parameter(Mandatory)][Collections.IDictionary]$Request,
        [Parameter(Mandatory)][Collections.IDictionary]$Policy
    )

    $keys = @('schemaVersion','requestId','taskId','providerProfileId','repositoryRoot','expectedBranch','expectedHead','promptPath','promptSha256','routerDecisionSha256','timeoutMilliseconds','retryIntent','resumeCheckpointPath','resumeCheckpointSha256')
    Assert-GcClosedObjectV1 -Object $Request -Keys $keys -ContractName 'RUNNER_REQUEST'
    if (-not [string]::Equals([string]$Request['schemaVersion'], 'gc-provider-process-runner-v1.request/1', [StringComparison]::Ordinal)) { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_REQUEST_SCHEMA_INVALID' }
    if ($Request['requestId'] -isnot [string] -or $Request['requestId'] -cnotmatch '^GC_RUN_[0-9a-f]{32}$') { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_REQUEST_ID_INVALID' }
    foreach ($name in @('taskId','providerProfileId','repositoryRoot','expectedBranch','promptPath')) {
        if (-not (Test-GcOrdinalStringV1 -Value $Request[$name] -Maximum 4096)) { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message ('RUNNER_REQUEST_' + $name.ToUpperInvariant() + '_INVALID') }
    }
    if (-not (Test-GcLowerHexV1 -Value $Request['expectedHead'] -Length 40)) { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_REQUEST_HEAD_INVALID' }
    foreach ($name in @('promptSha256','routerDecisionSha256')) {
        if (-not (Test-GcLowerHexV1 -Value $Request[$name] -Length 64)) { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message ('RUNNER_REQUEST_' + $name.ToUpperInvariant() + '_INVALID') }
    }
    if ($Request['timeoutMilliseconds'] -isnot [long] -or $Request['timeoutMilliseconds'] -lt [long]$Policy['minimumTimeoutMilliseconds'] -or $Request['timeoutMilliseconds'] -gt [long]$Policy['maximumTimeoutMilliseconds']) { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_REQUEST_TIMEOUT_INVALID' }
    if ($Request['retryIntent'] -isnot [bool]) { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_REQUEST_RETRY_INTENT_INVALID' }

    $repositoryRoot = Assert-GcCanonicalAbsolutePathV1 -Path ([string]$Request['repositoryRoot']) -FailureCode 'RUNNER_REPOSITORY_ROOT_NOT_CANONICAL'
    if (-not [IO.Directory]::Exists($repositoryRoot)) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_REPOSITORY_ROOT_MISSING' }
    $promptPath = Assert-GcCanonicalAbsolutePathV1 -Path ([string]$Request['promptPath']) -FailureCode 'RUNNER_PROMPT_PATH_NOT_CANONICAL'
    if (-not [IO.File]::Exists($promptPath)) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_PROMPT_MISSING' }
    $prompt = Read-GcRunnerUtf8FileV1 -LiteralPath $promptPath
    if (-not [string]::Equals($prompt.Sha256, [string]$Request['promptSha256'], [StringComparison]::Ordinal)) { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_PROMPT_HASH_MISMATCH' }
    if ($prompt.Bytes.Length -gt [long]$Policy['maximumPromptBytes']) { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_PROMPT_TOO_LARGE' }

    $checkpointPath = $Request['resumeCheckpointPath']
    $checkpointHash = $Request['resumeCheckpointSha256']
    if (($null -eq $checkpointPath) -xor ($null -eq $checkpointHash)) { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_RESUME_PAIR_INVALID' }
    if ($null -ne $checkpointPath) {
        if (-not (Test-GcOrdinalStringV1 -Value $checkpointPath -Maximum 4096) -or -not (Test-GcLowerHexV1 -Value $checkpointHash -Length 64)) { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_RESUME_INVALID' }
    }
    return [pscustomobject]@{ Prompt = $prompt; RepositoryRoot = $repositoryRoot; PromptPath = $promptPath }
}

function Assert-GcRunnerPolicyV1 {
    param([Parameter(Mandatory)][Collections.IDictionary]$Policy)

    $keys = @('schemaVersion','defaultTimeoutMilliseconds','minimumTimeoutMilliseconds','maximumTimeoutMilliseconds','maximumAttempts','retryDelayMilliseconds','maximumCapturedBytesPerStream','maximumPromptBytes','retryableCategories','checkpointCategories','profiles')
    Assert-GcClosedObjectV1 -Object $Policy -Keys $keys -ContractName 'RUNNER_POLICY'
    if (-not [string]::Equals([string]$Policy['schemaVersion'], 'gc-provider-process-runner-v1.policy/1', [StringComparison]::Ordinal)) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_POLICY_SCHEMA_INVALID' }
    foreach ($name in @('defaultTimeoutMilliseconds','minimumTimeoutMilliseconds','maximumTimeoutMilliseconds','maximumAttempts','retryDelayMilliseconds','maximumCapturedBytesPerStream','maximumPromptBytes')) {
        if ($Policy[$name] -isnot [long] -or $Policy[$name] -lt 0) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_POLICY_NUMBER_INVALID' }
    }
    if ($Policy['maximumAttempts'] -ne 2 -or
        $Policy['minimumTimeoutMilliseconds'] -lt 100 -or
        $Policy['maximumTimeoutMilliseconds'] -gt 600000 -or
        $Policy['minimumTimeoutMilliseconds'] -gt $Policy['defaultTimeoutMilliseconds'] -or
        $Policy['defaultTimeoutMilliseconds'] -gt $Policy['maximumTimeoutMilliseconds'] -or
        $Policy['retryDelayMilliseconds'] -gt 60000 -or
        $Policy['maximumCapturedBytesPerStream'] -lt 1024 -or $Policy['maximumCapturedBytesPerStream'] -gt 16777216 -or
        $Policy['maximumPromptBytes'] -lt 1 -or $Policy['maximumPromptBytes'] -gt 1048576) {
        Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_POLICY_BOUND_INVALID'
    }
    if ($Policy['retryableCategories'] -isnot [object[]] -or $Policy['checkpointCategories'] -isnot [object[]] -or
        (@($Policy['retryableCategories']) -join '|') -cne 'RATE_LIMITED|TIMEOUT' -or
        (@($Policy['checkpointCategories']) -join '|') -cne 'QUOTA_EXCEEDED|TIMEOUT') {
        Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_POLICY_CATEGORY_INVALID'
    }
    if ($Policy['profiles'] -isnot [object[]] -or $Policy['profiles'].Count -ne 4) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_POLICY_PROFILES_INVALID' }

    $expectedProfiles = [ordered]@{
        'codex-readonly' = [ordered]@{ enabled = $true; executableNames = @('codex.exe'); arguments = @('exec','--ephemeral','--json','--sandbox','read-only','-'); promptTransport = 'stdin'; protocol = 'codex-jsonl' }
        'gemini-plan-review' = [ordered]@{ enabled = $true; executableNames = @('gemini.cmd'); arguments = @('--prompt',"Inspect the assigned repository context read-only.`nDo not modify files or invoke nested providers.`nReturn only the review.",'--approval-mode','plan','--output-format','stream-json','--skip-trust'); promptTransport = 'stdin'; protocol = 'json-stream-exit' }
        'claude-readonly' = [ordered]@{ enabled = $true; executableNames = @('claude.cmd'); arguments = @('--system-prompt','Inspect the assigned repository context read-only. Do not modify files or invoke nested providers. Return only the review.','-p','--output-format','json','--permission-mode','plan','--safe-mode','--tools','Read,Glob,Grep','--disallowedTools','Edit,Write,Bash,NotebookEdit,WebFetch,WebSearch,mcp__*','--strict-mcp-config','--disable-slash-commands','--no-session-persistence'); promptTransport = 'stdin'; protocol = 'claude-json-exit' }
        'github-copilot-readonly' = [ordered]@{ enabled = $false; executableNames = @('gh.exe'); arguments = @(); promptTransport = 'closed'; protocol = 'disabled' }
    }
    $seen = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($profile in $Policy['profiles']) {
        if ($profile -isnot [Collections.IDictionary]) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_POLICY_PROFILE_INVALID' }
        Assert-GcClosedObjectV1 -Object $profile -Keys @('id','enabled','executableNames','arguments','promptTransport','protocol') -ContractName 'RUNNER_POLICY_PROFILE'
        $id = [string]$profile['id']
        if (-not $expectedProfiles.Contains($id) -or -not $seen.Add($id)) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_POLICY_PROFILE_ID_INVALID' }
        $expected = $expectedProfiles[$id]
        if ($profile['enabled'] -isnot [bool] -or $profile['enabled'] -ne $expected['enabled'] -or
            (@($profile['executableNames']) -join "`0") -cne (@($expected['executableNames']) -join "`0") -or
            (@($profile['arguments']) -join "`0") -cne (@($expected['arguments']) -join "`0") -or
            -not [string]::Equals([string]$profile['promptTransport'], [string]$expected['promptTransport'], [StringComparison]::Ordinal) -or
            -not [string]::Equals([string]$profile['protocol'], [string]$expected['protocol'], [StringComparison]::Ordinal)) {
            Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_POLICY_PROFILE_CONTRACT_CHANGED'
        }
    }
}

function Get-GcProviderProfileV1 {
    param(
        [Parameter(Mandatory)][Collections.IDictionary]$Policy,
        [Parameter(Mandatory)][string]$ProfileId
    )

    foreach ($profile in $Policy['profiles']) {
        if ($profile -isnot [Collections.IDictionary]) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_PROFILE_INVALID' }
        Assert-GcClosedObjectV1 -Object $profile -Keys @('id','enabled','executableNames','arguments','promptTransport','protocol') -ContractName 'RUNNER_PROFILE'
        if ([string]::Equals([string]$profile['id'], $ProfileId, [StringComparison]::Ordinal)) {
            if ($profile['enabled'] -isnot [bool] -or -not $profile['enabled']) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_PROFILE_DISABLED' }
            if ($profile['executableNames'] -isnot [object[]] -or $profile['arguments'] -isnot [object[]]) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_PROFILE_CONTRACT_INVALID' }
            return $profile
        }
    }
    Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_PROFILE_UNKNOWN'
}

function Assert-GcHumanDispatchAuthorizationV1 {
    param(
        [Parameter(Mandatory)][Collections.IDictionary]$Authorization,
        [Parameter(Mandatory)][Collections.IDictionary]$Request,
        [Parameter(Mandatory)][string]$RequestSha256,
        [Parameter(Mandatory)][Collections.IDictionary]$Policy,
        [DateTimeOffset]$NowUtc = [DateTimeOffset]::UtcNow
    )

    $keys = @('schemaVersion','authorizationId','authorizedBy','authorizedAtUtc','expiresAtUtc','requestSha256','providerProfileId','providerInvocation','maxAttempts','allowRetryOn')
    Assert-GcClosedObjectV1 -Object $Authorization -Keys $keys -ContractName 'RUNNER_AUTHORIZATION'
    if (-not [string]::Equals([string]$Authorization['schemaVersion'], 'gc-provider-process-runner-v1.authorization/1', [StringComparison]::Ordinal)) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_AUTHORIZATION_SCHEMA_INVALID' }
    if ($Authorization['authorizationId'] -isnot [string] -or $Authorization['authorizationId'] -cnotmatch '^GC_AUTH_[0-9a-f]{32}$') { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_AUTHORIZATION_ID_INVALID' }
    if (-not (Test-GcOrdinalStringV1 -Value $Authorization['authorizedBy'] -Maximum 128)) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_AUTHORIZER_INVALID' }
    if ($Authorization['providerInvocation'] -isnot [bool] -or -not $Authorization['providerInvocation']) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_PROVIDER_INVOCATION_NOT_AUTHORIZED' }
    if (-not [string]::Equals([string]$Authorization['requestSha256'], $RequestSha256, [StringComparison]::Ordinal)) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_AUTHORIZATION_REQUEST_HASH_MISMATCH' }
    if (-not [string]::Equals([string]$Authorization['providerProfileId'], [string]$Request['providerProfileId'], [StringComparison]::Ordinal)) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_AUTHORIZATION_PROFILE_MISMATCH' }
    if ($Authorization['maxAttempts'] -isnot [long] -or $Authorization['maxAttempts'] -lt 1 -or $Authorization['maxAttempts'] -gt [long]$Policy['maximumAttempts']) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_AUTHORIZATION_ATTEMPTS_INVALID' }
    if ($Authorization['allowRetryOn'] -isnot [object[]]) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_AUTHORIZATION_RETRY_INVALID' }
    $retrySet = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($category in $Authorization['allowRetryOn']) {
        if ($category -isnot [string] -or $category -notin @('RATE_LIMITED','TIMEOUT') -or -not $retrySet.Add($category)) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_AUTHORIZATION_RETRY_INVALID' }
    }
    $issued = [DateTimeOffset]::MinValue
    $expires = [DateTimeOffset]::MinValue
    if (-not [DateTimeOffset]::TryParse([string]$Authorization['authorizedAtUtc'], [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::RoundtripKind, [ref]$issued) -or
        -not [DateTimeOffset]::TryParse([string]$Authorization['expiresAtUtc'], [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::RoundtripKind, [ref]$expires)) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_AUTHORIZATION_TIME_INVALID' }
    if ($issued.Offset -ne [TimeSpan]::Zero -or $expires.Offset -ne [TimeSpan]::Zero -or $issued -gt $NowUtc.AddMinutes(5) -or $expires -le $NowUtc -or $expires -le $issued -or $expires -gt $issued.AddHours(24)) { Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_AUTHORIZATION_EXPIRED_OR_INVALID' }
}

function Initialize-GcBoundedStreamDrainV1 {
    if ('GcProviderRunnerV1.StreamDrain' -as [type]) { return }
    $source = @'
using System;
using System.IO;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace GcProviderRunnerV1 {
    public sealed class CaptureResult {
        public byte[] CapturedBytes { get; set; }
        public long TotalBytes { get; set; }
        public string Sha256 { get; set; }
        public bool Truncated { get; set; }
    }

    public static class StreamDrain {
        public static Task<CaptureResult> DrainAsync(Stream stream, int maximumCapturedBytes) {
            return Task.Run(async () => {
                var buffer = new byte[8192];
                long total = 0;
                using (var captured = new MemoryStream())
                using (var hash = IncrementalHash.CreateHash(HashAlgorithmName.SHA256)) {
                    while (true) {
                        int read = await stream.ReadAsync(buffer, 0, buffer.Length).ConfigureAwait(false);
                        if (read == 0) break;
                        hash.AppendData(buffer, 0, read);
                        total += read;
                        int remaining = maximumCapturedBytes - (int)captured.Length;
                        if (remaining > 0) captured.Write(buffer, 0, Math.Min(remaining, read));
                    }
                    var hashText = BitConverter.ToString(hash.GetHashAndReset()).Replace("-", "").ToLowerInvariant();
                    return new CaptureResult {
                        CapturedBytes = captured.ToArray(),
                        TotalBytes = total,
                        Sha256 = hashText,
                        Truncated = total > maximumCapturedBytes
                    };
                }
            });
        }
    }
}
'@
    Add-Type -TypeDefinition $source | Out-Null
}

function Resolve-GcRunnerExecutableV1 {
    param([Parameter(Mandatory)][object[]]$ExecutableNames)

    foreach ($name in $ExecutableNames) {
        if ($name -isnot [string] -or $name -notmatch '^[A-Za-z0-9._-]+$') { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_EXECUTABLE_NAME_INVALID' }
        $command = Get-Command $name -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($command) { return [IO.Path]::GetFullPath($command.Source) }
    }
    Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_EXECUTABLE_NOT_FOUND'
}

function New-GcProcessStartInfoV1 {
    param(
        [Parameter(Mandatory)][string]$FilePath,
        [Parameter(Mandatory)][object[]]$Arguments,
        [Parameter(Mandatory)][string]$WorkingDirectory
    )

    $start = [Diagnostics.ProcessStartInfo]::new()
    $start.FileName = $FilePath
    $start.WorkingDirectory = $WorkingDirectory
    $start.UseShellExecute = $false
    $start.CreateNoWindow = $true
    $start.RedirectStandardInput = $true
    $start.RedirectStandardOutput = $true
    $start.RedirectStandardError = $true
    $start.StandardInputEncoding = [Text.UTF8Encoding]::new($false)
    foreach ($argument in $Arguments) {
        if ($argument -isnot [string]) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_ARGUMENT_INVALID' }
        [void]$start.ArgumentList.Add($argument)
    }
    return $start
}

function Stop-GcProcessTreeV1 {
    param([Parameter(Mandatory)][Diagnostics.Process]$Process)
    if ($Process.HasExited) { return }
    try { $Process.Kill($true) }
    catch { try { $Process.Kill() } catch { } }
    [void]$Process.WaitForExit(5000)
}

function ConvertFrom-GcCapturedUtf8V1 {
    param([Parameter(Mandatory)][GcProviderRunnerV1.CaptureResult]$Capture)
    try { return [Text.UTF8Encoding]::new($false, $true).GetString($Capture.CapturedBytes) }
    catch { Throw-GcRunnerFailureV1 -Category 'PROTOCOL_FAILURE' -Message 'RUNNER_PROVIDER_OUTPUT_UTF8_INVALID' }
}

function Read-GcCodexJsonlEventV1 {
    param(
        [Parameter(Mandatory)][string]$Text,
        [Parameter(Mandatory)][bool]$Truncated
    )

    if ($Truncated) { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'OUTPUT_TRUNCATED' } }
    $terminal = [Collections.Generic.List[string]]::new()
    $eventCount = 0
    $lastType = $null
    foreach ($line in ($Text -split "`r?`n")) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        $eventCount++
        try {
            $document = [Text.Json.JsonDocument]::Parse($line)
            try {
                $typeProperty = [Text.Json.JsonElement]::new()
                if (-not $document.RootElement.TryGetProperty('type', [ref]$typeProperty) -or $typeProperty.ValueKind -ne [Text.Json.JsonValueKind]::String) { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'EVENT_TYPE_MISSING' } }
                $type = $typeProperty.GetString()
                $lastType = $type
                if ($type -in @('turn.completed','turn.failed')) { $terminal.Add($type) }
            }
            finally { $document.Dispose() }
        }
        catch { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'JSONL_INVALID' } }
    }
    if ($eventCount -eq 0 -or $terminal.Count -ne 1 -or -not [string]::Equals($lastType, $terminal[0], [StringComparison]::Ordinal)) { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'TERMINAL_EVENT_INVALID' } }
    return [pscustomobject]@{ Valid = $true; TerminalEvent = $terminal[0]; Reason = $null }
}

function Read-GcJsonStreamExitProtocolV1 {
    param([Parameter(Mandatory)][string]$Text, [Parameter(Mandatory)][bool]$Truncated)
    if ($Truncated) { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'TRUNCATED' } }

    $events = [Collections.Generic.List[object]]::new()
    foreach ($line in ($Text -split "`r?`n")) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        try {
            $doc = [Text.Json.JsonDocument]::Parse($line)
            $hasType = $false
            $typeProp = $null
            try { $typeProp = $doc.RootElement.GetProperty("type"); $hasType = $true } catch { }
            if ($hasType -and $typeProp.ValueKind -eq [Text.Json.JsonValueKind]::String) {
                $typeStr = $typeProp.GetString()
                if ($typeStr -eq 'result') {
                    $hasStatus = $false
                    $statusProp = $null
                    try { $statusProp = $doc.RootElement.GetProperty("status"); $hasStatus = $true } catch { }
                    if ($hasStatus -and $statusProp.ValueKind -eq [Text.Json.JsonValueKind]::String) {
                        $events.Add([pscustomobject]@{ Type = $typeStr; Status = $statusProp.GetString() })
                    } else {
                        $events.Add([pscustomobject]@{ Type = $typeStr; Status = $null })
                    }
                } else {
                    $events.Add([pscustomobject]@{ Type = $typeStr })
                }
            } else {
                $events.Add([pscustomobject]@{ Type = $null })
            }
            $doc.Dispose()
        }
        catch { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'JSON_INVALID' } }
    }

    if ($events.Count -eq 0) { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'EMPTY_STREAM' } }

    $resultIndex = -1
    for ($i = 0; $i -lt $events.Count; $i++) {
        if ($events[$i].Type -eq 'result') {
            if ($resultIndex -ne -1) { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'MULTIPLE_RESULT_EVENTS' } }
            $resultIndex = $i
        }
    }

    if ($resultIndex -eq -1) { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'MISSING_RESULT_EVENT' } }
    if ($resultIndex -ne ($events.Count - 1)) { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'EVENT_AFTER_RESULT' } }
    if ($events[$resultIndex].Status -ne 'success') { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'STATUS_FAILED' } }

    return [pscustomobject]@{ Valid = $true; TerminalEvent = 'result'; Reason = $null }
}

function Read-GcClaudeJsonExitProtocolV1 {
    param([Parameter(Mandatory)][string]$Text, [Parameter(Mandatory)][bool]$Truncated)
    if ($Truncated -or [string]::IsNullOrWhiteSpace($Text)) { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'TRUNCATED_OR_EMPTY' } }

    try {
        $document = [Text.Json.JsonDocument]::Parse($Text)
        try {
            if ($document.RootElement.ValueKind -ne [Text.Json.JsonValueKind]::Object) { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'RESULT_NOT_OBJECT' } }
            $propertyNames = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
            foreach ($property in $document.RootElement.EnumerateObject()) {
                if (-not $propertyNames.Add($property.Name)) { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'DUPLICATE_PROPERTY' } }
            }
            $type = [Text.Json.JsonElement]::new()
            $subtype = [Text.Json.JsonElement]::new()
            $result = [Text.Json.JsonElement]::new()
            if (-not $document.RootElement.TryGetProperty('type', [ref]$type) -or $type.ValueKind -ne [Text.Json.JsonValueKind]::String -or $type.GetString() -cne 'result') { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'TYPE_INVALID' } }
            if (-not $document.RootElement.TryGetProperty('subtype', [ref]$subtype) -or $subtype.ValueKind -ne [Text.Json.JsonValueKind]::String -or $subtype.GetString() -cne 'success') { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'SUBTYPE_INVALID' } }
            if (-not $document.RootElement.TryGetProperty('result', [ref]$result) -or $result.ValueKind -ne [Text.Json.JsonValueKind]::String -or [string]::IsNullOrWhiteSpace($result.GetString())) { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'RESULT_INVALID' } }
            $isError = [Text.Json.JsonElement]::new()
            if ($document.RootElement.TryGetProperty('is_error', [ref]$isError) -and ($isError.ValueKind -ne [Text.Json.JsonValueKind]::False)) { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'IS_ERROR_INVALID' } }
        }
        finally { $document.Dispose() }
    }
    catch { return [pscustomobject]@{ Valid = $false; TerminalEvent = $null; Reason = 'JSON_INVALID' } }
    return [pscustomobject]@{ Valid = $true; TerminalEvent = 'result'; Reason = $null }
}

function Resolve-GcProviderFailureCategoryV1 {
    param([AllowEmptyString()][string]$Stdout, [AllowEmptyString()][string]$Stderr)
    $combined = $Stdout + "`n" + $Stderr
    if ($combined -match '(?i)(monthly quota|quota exceeded|exceeded your .*quota|insufficient[_ -]?quota|credits? exceeded)') { return 'QUOTA_EXCEEDED' }
    if ($combined -match '(?i)(rate[ -]?limit|too many requests|\b429\b)') { return 'RATE_LIMITED' }
    if ($combined -match '(?i)(authentication failed|not logged in|login required|unauthorized|\b401\b|forbidden|\b403\b)') { return 'AUTH_FAILED' }
    return 'PROVIDER_FAILURE'
}

function Invoke-GcProviderAttemptV1 {
    param(
        [Parameter(Mandatory)][string]$FilePath,
        [Parameter(Mandatory)][object[]]$Arguments,
        [Parameter(Mandatory)][string]$Prompt,
        [Parameter(Mandatory)][ValidateSet('stdin','closed')][string]$PromptTransport,
        [Parameter(Mandatory)][ValidateSet('codex-jsonl','json-stream-exit','claude-json-exit')][string]$Protocol,
        [Parameter(Mandatory)][string]$WorkingDirectory,
        [Parameter(Mandatory)][int]$TimeoutMilliseconds,
        [Parameter(Mandatory)][int]$MaximumCapturedBytes,
        [AllowNull()][string]$CancellationPath,
        [Parameter(Mandatory)][int]$AttemptNumber
    )

    $startedAt = [DateTimeOffset]::UtcNow
    $transitions = [Collections.Generic.List[object]]::new()
    $transitions.Add([ordered]@{ state = 'NOT_STARTED'; atUtc = $startedAt.ToString('o') })
    if ($CancellationPath -and [IO.File]::Exists($CancellationPath)) {
        $ended = [DateTimeOffset]::UtcNow
        $transitions.Add([ordered]@{ state = 'CANCELLED'; atUtc = $ended.ToString('o') })
        return [pscustomobject]@{
            Public = [ordered]@{ attempt = $AttemptNumber; state = 'CANCELLED'; failureCategory = 'CANCELLED'; startedAtUtc = $startedAt.ToString('o'); completedAtUtc = $ended.ToString('o'); durationMilliseconds = 0; exitCode = $null; terminalEvent = $null; stdoutByteLength = 0; stdoutSha256 = Get-GcSha256HexV1 -Bytes ([byte[]]::new(0)); stdoutTruncated = $false; stderrByteLength = 0; stderrSha256 = Get-GcSha256HexV1 -Bytes ([byte[]]::new(0)); stderrTruncated = $false; stateTransitions = $transitions.ToArray() }
            Stdout = ''; Stderr = ''
        }
    }

    Initialize-GcBoundedStreamDrainV1
    $process = [Diagnostics.Process]::new()
    $process.StartInfo = New-GcProcessStartInfoV1 -FilePath $FilePath -Arguments $Arguments -WorkingDirectory $WorkingDirectory
    $processStarted = $false
    $stopwatch = [Diagnostics.Stopwatch]::StartNew()
    try {
        try {
            if (-not $process.Start()) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_PROCESS_START_FAILED' }
            $processStarted = $true
        }
        catch {
            $ended = [DateTimeOffset]::UtcNow
            $transitions.Add([ordered]@{ state = 'FAILED'; atUtc = $ended.ToString('o') })
            return [pscustomobject]@{
                Public = [ordered]@{ attempt = $AttemptNumber; state = 'FAILED'; failureCategory = 'RUNNER_FAILURE'; startedAtUtc = $startedAt.ToString('o'); completedAtUtc = $ended.ToString('o'); durationMilliseconds = [long]$stopwatch.ElapsedMilliseconds; exitCode = $null; terminalEvent = $null; stdoutByteLength = 0; stdoutSha256 = Get-GcSha256HexV1 -Bytes ([byte[]]::new(0)); stdoutTruncated = $false; stderrByteLength = 0; stderrSha256 = Get-GcSha256HexV1 -Bytes ([byte[]]::new(0)); stderrTruncated = $false; stateTransitions = $transitions.ToArray() }
                Stdout = ''; Stderr = ''
            }
        }

        $transitions.Add([ordered]@{ state = 'STARTED'; atUtc = ([DateTimeOffset]::UtcNow).ToString('o') })
        $stdoutTask = [GcProviderRunnerV1.StreamDrain]::DrainAsync($process.StandardOutput.BaseStream, $MaximumCapturedBytes)
        $stderrTask = [GcProviderRunnerV1.StreamDrain]::DrainAsync($process.StandardError.BaseStream, $MaximumCapturedBytes)
        $stdinClosed = $false
        $stdinTask = $null
        if ($PromptTransport -eq 'stdin') { $stdinTask = $process.StandardInput.WriteAsync($Prompt) }
        else { $process.StandardInput.Close(); $stdinClosed = $true }
        $transitions.Add([ordered]@{ state = 'RUNNING'; atUtc = ([DateTimeOffset]::UtcNow).ToString('o') })

        $timedOut = $false
        $cancelled = $false
        while (-not $process.WaitForExit(50)) {
            if (-not $stdinClosed -and $stdinTask.IsCompleted) {
                try { [void]$stdinTask.GetAwaiter().GetResult() }
                catch { Stop-GcProcessTreeV1 -Process $process; Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_STDIN_WRITE_FAILED' }
                $process.StandardInput.Close()
                $stdinClosed = $true
            }
            if ($CancellationPath -and [IO.File]::Exists($CancellationPath)) { $cancelled = $true; Stop-GcProcessTreeV1 -Process $process; break }
            if ($stopwatch.ElapsedMilliseconds -ge $TimeoutMilliseconds) { $timedOut = $true; Stop-GcProcessTreeV1 -Process $process; break }
        }
        if (-not $stdinClosed) { try { $process.StandardInput.Close() } catch { }; $stdinClosed = $true }
        if (-not $process.HasExited) { [void]$process.WaitForExit(5000) }
        $stdoutCapture = $stdoutTask.GetAwaiter().GetResult()
        $stderrCapture = $stderrTask.GetAwaiter().GetResult()
        $stdoutText = ConvertFrom-GcCapturedUtf8V1 -Capture $stdoutCapture
        $stderrText = ConvertFrom-GcCapturedUtf8V1 -Capture $stderrCapture
        $exitCode = if ($process.HasExited) { [int]$process.ExitCode } else { $null }
        $terminalEvent = $null
        $state = 'FAILED'
        $failureCategory = 'PROVIDER_FAILURE'

        if ($cancelled) { $state = 'CANCELLED'; $failureCategory = 'CANCELLED' }
        elseif ($timedOut) { $state = 'TIMED_OUT'; $failureCategory = 'TIMEOUT' }
        elseif ($exitCode -ne 0) { $failureCategory = Resolve-GcProviderFailureCategoryV1 -Stdout $stdoutText -Stderr $stderrText }
        elseif ($Protocol -eq 'codex-jsonl') {
            $protocolResult = Read-GcCodexJsonlEventV1 -Text $stdoutText -Truncated $stdoutCapture.Truncated
            $terminalEvent = $protocolResult.TerminalEvent
            if (-not $protocolResult.Valid) { $failureCategory = 'PROTOCOL_FAILURE' }
            elseif ($terminalEvent -eq 'turn.failed') { $failureCategory = Resolve-GcProviderFailureCategoryV1 -Stdout $stdoutText -Stderr $stderrText }
            else { $state = 'COMPLETED'; $failureCategory = $null }
        }
        elseif ($Protocol -eq 'json-stream-exit') {
            $protocolResult = Read-GcJsonStreamExitProtocolV1 -Text $stdoutText -Truncated $stdoutCapture.Truncated
            $terminalEvent = $protocolResult.TerminalEvent
            if (-not $protocolResult.Valid) { $failureCategory = 'PROTOCOL_FAILURE' }
            else { $state = 'COMPLETED'; $failureCategory = $null }
        }
        elseif ($Protocol -eq 'claude-json-exit') {
            $protocolResult = Read-GcClaudeJsonExitProtocolV1 -Text $stdoutText -Truncated $stdoutCapture.Truncated
            $terminalEvent = $protocolResult.TerminalEvent
            if (-not $protocolResult.Valid) { $failureCategory = 'PROTOCOL_FAILURE' }
            else { $state = 'COMPLETED'; $failureCategory = $null }
        }
        else { $failureCategory = 'PROTOCOL_FAILURE' }

        $endedAt = [DateTimeOffset]::UtcNow
        $transitions.Add([ordered]@{ state = $state; atUtc = $endedAt.ToString('o') })
        return [pscustomobject]@{
            Public = [ordered]@{
                attempt = $AttemptNumber; state = $state; failureCategory = $failureCategory
                startedAtUtc = $startedAt.ToString('o'); completedAtUtc = $endedAt.ToString('o')
                durationMilliseconds = [long]$stopwatch.ElapsedMilliseconds; exitCode = $exitCode; terminalEvent = $terminalEvent
                stdoutByteLength = [long]$stdoutCapture.TotalBytes; stdoutSha256 = [string]$stdoutCapture.Sha256; stdoutTruncated = [bool]$stdoutCapture.Truncated
                stderrByteLength = [long]$stderrCapture.TotalBytes; stderrSha256 = [string]$stderrCapture.Sha256; stderrTruncated = [bool]$stderrCapture.Truncated
                stateTransitions = $transitions.ToArray()
            }
            Stdout = $stdoutText
            Stderr = $stderrText
        }
    }
    finally {
        $stopwatch.Stop()
        if ($processStarted -and -not $process.HasExited) { Stop-GcProcessTreeV1 -Process $process }
        $process.Dispose()
    }
}

function Get-GcRetryDecisionV1 {
    param(
        [Parameter(Mandatory)][string]$FailureCategory,
        [Parameter(Mandatory)][int]$AttemptNumber,
        [Parameter(Mandatory)][Collections.IDictionary]$Request,
        [Parameter(Mandatory)][Collections.IDictionary]$Authorization,
        [Parameter(Mandatory)][Collections.IDictionary]$Policy
    )

    if ($AttemptNumber -ge [int]$Authorization['maxAttempts'] -or $AttemptNumber -ge [int]$Policy['maximumAttempts']) { return $false }
    if (-not [bool]$Request['retryIntent']) { return $false }
    if ($FailureCategory -notin @($Policy['retryableCategories'])) { return $false }
    if ($FailureCategory -notin @($Authorization['allowRetryOn'])) { return $false }
    return $true
}

function Invoke-GcProviderProcessRunnerV1 {
    param(
        [Parameter(Mandatory)][Collections.IDictionary]$Request,
        [Parameter(Mandatory)][Collections.IDictionary]$Authorization,
        [Parameter(Mandatory)][Collections.IDictionary]$Policy,
        [Parameter(Mandatory)][Collections.IDictionary]$Profile,
        [Parameter(Mandatory)][string]$Prompt,
        [AllowNull()][string]$CancellationPath,
        [AllowNull()][string]$ExecutableOverride,
        [AllowNull()][object[]]$ArgumentsOverride,
        [AllowNull()][string]$ProtocolOverride,
        [AllowNull()][string]$PromptTransportOverride,
        [int]$RetryDelayOverrideMilliseconds = -1
    )

    $filePath = if ($ExecutableOverride) { $ExecutableOverride } else { Resolve-GcRunnerExecutableV1 -ExecutableNames @($Profile['executableNames']) }
    $arguments = if ($null -ne $ArgumentsOverride) { $ArgumentsOverride } else { @($Profile['arguments']) }
    $protocol = if ($ProtocolOverride) { $ProtocolOverride } else { [string]$Profile['protocol'] }
    $transport = if ($PromptTransportOverride) { $PromptTransportOverride } else { [string]$Profile['promptTransport'] }
    $attempts = [Collections.Generic.List[object]]::new()
    $attemptNumber = 0
    $last = $null
    do {
        $attemptNumber++
        $last = Invoke-GcProviderAttemptV1 -FilePath $filePath -Arguments $arguments -Prompt $Prompt -PromptTransport $transport -Protocol $protocol -WorkingDirectory ([string]$Request['repositoryRoot']) -TimeoutMilliseconds ([int]$Request['timeoutMilliseconds']) -MaximumCapturedBytes ([int]$Policy['maximumCapturedBytesPerStream']) -CancellationPath $CancellationPath -AttemptNumber $attemptNumber
        $attempts.Add($last.Public)
        if ($last.Public['state'] -eq 'COMPLETED') { break }
        $retry = Get-GcRetryDecisionV1 -FailureCategory ([string]$last.Public['failureCategory']) -AttemptNumber $attemptNumber -Request $Request -Authorization $Authorization -Policy $Policy
        if ($retry) {
            $delay = if ($RetryDelayOverrideMilliseconds -ge 0) { $RetryDelayOverrideMilliseconds } else { [int]$Policy['retryDelayMilliseconds'] }
            if ($delay -gt 0) { Start-Sleep -Milliseconds $delay }
        }
    } while ($retry)

    return [pscustomobject]@{
        State = [string]$last.Public['state']
        FailureCategory = $last.Public['failureCategory']
        Attempts = $attempts.ToArray()
    }
}

function Invoke-GcRunnerUtilityProcessV1 {
    param(
        [Parameter(Mandatory)][string]$FilePath,
        [Parameter(Mandatory)][string[]]$Arguments,
        [Parameter(Mandatory)][string]$WorkingDirectory,
        [int]$TimeoutMilliseconds = 10000,
        [int]$MaximumBytes = 4194304
    )

    Initialize-GcBoundedStreamDrainV1
    $process = [Diagnostics.Process]::new()
    $process.StartInfo = New-GcProcessStartInfoV1 -FilePath $FilePath -Arguments $Arguments -WorkingDirectory $WorkingDirectory
    $processStarted = $false
    try {
        if (-not $process.Start()) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_UTILITY_START_FAILED' }
        $processStarted = $true
        $process.StandardInput.Close()
        $stdoutTask = [GcProviderRunnerV1.StreamDrain]::DrainAsync($process.StandardOutput.BaseStream, $MaximumBytes)
        $stderrTask = [GcProviderRunnerV1.StreamDrain]::DrainAsync($process.StandardError.BaseStream, $MaximumBytes)
        if (-not $process.WaitForExit($TimeoutMilliseconds)) { Stop-GcProcessTreeV1 -Process $process; Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_UTILITY_TIMEOUT' }
        $stdout = $stdoutTask.GetAwaiter().GetResult()
        $stderr = $stderrTask.GetAwaiter().GetResult()
        if ($stdout.Truncated -or $stderr.Truncated -or $process.ExitCode -ne 0) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_UTILITY_FAILED' }
        return [pscustomobject]@{ Stdout = $stdout; Stderr = $stderr; ExitCode = [int]$process.ExitCode }
    }
    finally {
        if ($processStarted -and -not $process.HasExited) { Stop-GcProcessTreeV1 -Process $process }
        $process.Dispose()
    }
}

function Get-GcRunnerRepositorySnapshotV1 {
    param([Parameter(Mandatory)][string]$RepositoryRoot)

    $git = Get-Command git.exe -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $git) { Throw-GcRunnerFailureV1 -Category 'RUNNER_FAILURE' -Message 'RUNNER_SYSTEM_GIT_NOT_FOUND' }
    $rootResult = Invoke-GcRunnerUtilityProcessV1 -FilePath $git.Source -Arguments @('-C',$RepositoryRoot,'rev-parse','--show-toplevel') -WorkingDirectory $RepositoryRoot
    $branchResult = Invoke-GcRunnerUtilityProcessV1 -FilePath $git.Source -Arguments @('-C',$RepositoryRoot,'branch','--show-current') -WorkingDirectory $RepositoryRoot
    $headResult = Invoke-GcRunnerUtilityProcessV1 -FilePath $git.Source -Arguments @('-C',$RepositoryRoot,'rev-parse','HEAD') -WorkingDirectory $RepositoryRoot
    $statusResult = Invoke-GcRunnerUtilityProcessV1 -FilePath $git.Source -Arguments @('-C',$RepositoryRoot,'status','--porcelain=v1','-z','--untracked-files=all') -WorkingDirectory $RepositoryRoot
    $utf8 = [Text.UTF8Encoding]::new($false, $true)
    $root = $utf8.GetString($rootResult.Stdout.CapturedBytes).TrimEnd("`r","`n")
    $branch = $utf8.GetString($branchResult.Stdout.CapturedBytes).TrimEnd("`r","`n")
    $head = $utf8.GetString($headResult.Stdout.CapturedBytes).TrimEnd("`r","`n")
    return [ordered]@{
        repositoryRoot = [IO.Path]::GetFullPath($root)
        branch = $branch
        head = $head
        statusSha256 = [string]$statusResult.Stdout.Sha256
        statusByteLength = [long]$statusResult.Stdout.TotalBytes
    }
}

function Assert-GcRunnerRepositoryIdentityV1 {
    param(
        [Parameter(Mandatory)][Collections.IDictionary]$Request,
        [Parameter(Mandatory)][Collections.IDictionary]$Snapshot
    )
    foreach ($pair in @(
        @('repositoryRoot','repositoryRoot'),
        @('expectedBranch','branch'),
        @('expectedHead','head')
    )) {
        if (-not [string]::Equals([string]$Request[$pair[0]], [string]$Snapshot[$pair[1]], [StringComparison]::Ordinal)) {
            Throw-GcRunnerFailureV1 -Category 'AUTH_FAILED' -Message 'RUNNER_REPOSITORY_IDENTITY_MISMATCH'
        }
    }
}
