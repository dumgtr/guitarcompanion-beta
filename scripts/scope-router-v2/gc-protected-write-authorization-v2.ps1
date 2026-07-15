Set-StrictMode -Version Latest

function Assert-GcProtectedWriteAuthorizationV2 {
    param(
        [Parameter(Mandatory)]$Authorization,
        [Parameter(Mandatory)][AllowEmptyCollection()][byte[]]$AuthorizationBytes,
        [Parameter(Mandatory)]$InputObject,
        [Parameter(Mandatory)][string]$InputSha256,
        [Parameter(Mandatory)]$Identity,
        [Parameter(Mandatory)]$Policy,
        [DateTimeOffset]$NowUtc = [DateTimeOffset]::UtcNow
    )

    $fields = @('schemaVersion','authorizationId','authorizedBy','authorizedAtUtc','expiresAtUtc','taskId','inputSha256','repositoryRoot','expectedBranch','expectedHead','approvedWritePaths','reviewRequired')
    Assert-GcClosedObjectV2 -Object $Authorization -Allowed $fields -Required $fields -FieldId 'protectedWriteAuthorization'
    if ($Authorization['schemaVersion'] -isnot [string] -or -not (Test-GcOrdinalEqualsV2 ([string]$Authorization['schemaVersion']) ([string]$Policy['protectedWriteAuthorizationSchemaVersion'])) -or
        $Authorization['authorizationId'] -isnot [string] -or ([string]$Authorization['authorizationId']) -cnotmatch '^GC_PWA_[0-9a-f]{32}$' -or
        $Authorization['authorizedBy'] -isnot [string] -or -not (Test-GcOrdinalEqualsV2 ([string]$Authorization['authorizedBy']) 'Product Owner') -or
        $Authorization['reviewRequired'] -isnot [bool] -or -not $Authorization['reviewRequired']) {
        Throw-GcFailureV2 -ReasonCode 'PROTECTED_WRITE_AUTHORIZATION_INVALID' -FieldId 'protectedWriteAuthorization' -PolicyRuleId 'V2-PROTECTED-WRITE-AUTH-CONTRACT' -FailureCategory 'authorization'
    }

    $bindings = [ordered]@{
        taskId = [string]$InputObject['taskId']
        inputSha256 = $InputSha256
        repositoryRoot = [string]$Identity['repositoryRoot']
        expectedBranch = [string]$Identity['branch']
        expectedHead = [string]$Identity['head']
    }
    foreach ($name in $bindings.Keys) {
        if ($Authorization[$name] -isnot [string] -or -not (Test-GcOrdinalEqualsV2 ([string]$Authorization[$name]) ([string]$bindings[$name]))) {
            Throw-GcFailureV2 -ReasonCode 'PROTECTED_WRITE_AUTHORIZATION_INVALID' -FieldId "protectedWriteAuthorization.$name" -PolicyRuleId 'V2-PROTECTED-WRITE-AUTH-BINDING' -FailureCategory 'authorization'
        }
    }

    $issued = [DateTimeOffset]::MinValue
    $expires = [DateTimeOffset]::MinValue
    if ($Authorization['authorizedAtUtc'] -isnot [string] -or $Authorization['expiresAtUtc'] -isnot [string] -or
        -not [DateTimeOffset]::TryParseExact([string]$Authorization['authorizedAtUtc'], 'o', [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::RoundtripKind, [ref]$issued) -or
        -not [DateTimeOffset]::TryParseExact([string]$Authorization['expiresAtUtc'], 'o', [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::RoundtripKind, [ref]$expires) -or
        $issued.Offset -ne [TimeSpan]::Zero -or $expires.Offset -ne [TimeSpan]::Zero -or
        $issued -gt $NowUtc.AddMinutes(5) -or $expires -le $NowUtc -or $expires -le $issued -or $expires -gt $issued.AddHours(24)) {
        Throw-GcFailureV2 -ReasonCode 'PROTECTED_WRITE_AUTHORIZATION_INVALID' -FieldId 'protectedWriteAuthorization.time' -PolicyRuleId 'V2-PROTECTED-WRITE-AUTH-TIME' -FailureCategory 'authorization'
    }

    Assert-GcStringArrayV2 -Value $Authorization['approvedWritePaths'] -FieldId 'protectedWriteAuthorization.approvedWritePaths' -MinimumCount 1
    $approvedScopes = @(ConvertTo-GcPathScopeListV2 -Values $Authorization['approvedWritePaths'] -FieldId 'protectedWriteAuthorization.approvedWritePaths' -RepositoryRoot ([string]$Identity['repositoryRoot']))
    foreach ($scope in $approvedScopes) {
        if ([bool]$scope['isSubtree']) {
            Throw-GcFailureV2 -ReasonCode 'PROTECTED_WRITE_AUTHORIZATION_INVALID' -FieldId 'protectedWriteAuthorization.approvedWritePaths' -PolicyRuleId 'V2-PROTECTED-WRITE-AUTH-EXACT' -FailureCategory 'authorization'
        }
    }
    $operationPresent = $false
    foreach ($operation in $InputObject['requestedOperations']) {
        if (Test-GcOrdinalEqualsV2 ([string]$operation) 'human_authorized_protected_write') { $operationPresent = $true; break }
    }
    if (-not $operationPresent) {
        Throw-GcFailureV2 -ReasonCode 'PROTECTED_WRITE_AUTHORIZATION_INVALID' -FieldId 'requestedOperations' -PolicyRuleId 'V2-PROTECTED-WRITE-AUTH-OPERATION' -FailureCategory 'authorization'
    }
    return [ordered]@{
        authorizationId = [string]$Authorization['authorizationId']
        authorizationSha256 = Get-GcSha256HexV2 -Bytes $AuthorizationBytes
        reviewRequired = $true
        approvedScopes = $approvedScopes
    }
}
