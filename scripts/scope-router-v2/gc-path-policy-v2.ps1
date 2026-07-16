Set-StrictMode -Version Latest

function ConvertTo-GcPathScopeV2 {
    param([Parameter(Mandatory)][string]$Scope, [string]$FieldId = 'path.scope', [AllowNull()][Nullable[int]]$ArrayIndex)

    if ($Scope.Length -eq 0 -or [StringComparer]::Ordinal.Equals($Scope, '.') -or [StringComparer]::Ordinal.Equals($Scope, './') -or
        [StringComparer]::Ordinal.Equals($Scope, '*') -or [StringComparer]::Ordinal.Equals($Scope, '**') -or [StringComparer]::Ordinal.Equals($Scope, '/**')) {
        Throw-GcFailureV2 -ReasonCode 'PATH_ROOT_SCOPE_BLOCKED' -FieldId $FieldId -ArrayIndex $ArrayIndex -PolicyRuleId 'V2-PATH-NO-ROOT' -FailureCategory 'path-policy'
    }
    if ($Scope -match '[\x00-\x1f\x7f]' -or $Scope.Contains('\') -or $Scope.StartsWith('/', [StringComparison]::Ordinal) -or
        $Scope.StartsWith('//', [StringComparison]::Ordinal) -or $Scope -cmatch '^[A-Za-z]:' -or $Scope.Contains(':')) {
        Throw-GcFailureV2 -ReasonCode 'PATH_SCOPE_INVALID' -FieldId $FieldId -ArrayIndex $ArrayIndex -PolicyRuleId 'V2-PATH-RELATIVE' -FailureCategory 'path-policy'
    }

    $isSubtree = $false
    $basePath = $Scope
    if ($Scope.EndsWith('/**', [StringComparison]::Ordinal)) {
        $isSubtree = $true
        $basePath = $Scope.Substring(0, $Scope.Length - 3)
    }
    elseif ($Scope.Contains('*')) {
        Throw-GcFailureV2 -ReasonCode 'PATH_SCOPE_INVALID' -FieldId $FieldId -ArrayIndex $ArrayIndex -PolicyRuleId 'V2-PATH-WILDCARD' -FailureCategory 'path-policy'
    }

    if ($basePath.EndsWith('/', [StringComparison]::Ordinal)) {
        $basePath = $basePath.Substring(0, $basePath.Length - 1)
    }
    if ($basePath.Length -eq 0) {
        Throw-GcFailureV2 -ReasonCode 'PATH_ROOT_SCOPE_BLOCKED' -FieldId $FieldId -ArrayIndex $ArrayIndex -PolicyRuleId 'V2-PATH-NO-ROOT' -FailureCategory 'path-policy'
    }

    $segments = $basePath.Split('/')
    foreach ($segment in $segments) {
        if ($segment.Length -eq 0 -or [StringComparer]::Ordinal.Equals($segment, '.') -or [StringComparer]::Ordinal.Equals($segment, '..')) {
            Throw-GcFailureV2 -ReasonCode 'PATH_SCOPE_INVALID' -FieldId $FieldId -ArrayIndex $ArrayIndex -PolicyRuleId 'V2-PATH-TRAVERSAL' -FailureCategory 'path-policy'
        }
        if ($segment.EndsWith(' ', [StringComparison]::Ordinal) -or $segment.EndsWith('.', [StringComparison]::Ordinal)) {
            Throw-GcFailureV2 -ReasonCode 'PATH_SCOPE_INVALID' -FieldId $FieldId -ArrayIndex $ArrayIndex -PolicyRuleId 'V2-PATH-WINDOWS-ALIAS' -FailureCategory 'path-policy'
        }
    }

    $canonical = if ($isSubtree) { "$basePath/**" } else { $basePath }
    return [ordered]@{ canonical = $canonical; basePath = $basePath; isSubtree = $isSubtree }
}

function Test-GcPathScopeOverlapV2 {
    param([Parameter(Mandatory)]$Left, [Parameter(Mandatory)]$Right)

    $leftPath = [string]$Left['basePath']
    $rightPath = [string]$Right['basePath']
    if ([StringComparer]::Ordinal.Equals($leftPath, $rightPath)) { return $true }
    if ($leftPath.StartsWith($rightPath + '/', [StringComparison]::Ordinal)) { return $true }
    if ($rightPath.StartsWith($leftPath + '/', [StringComparison]::Ordinal)) { return $true }
    return $false
}

function Assert-GcNoReparseEscapeV2 {
    param(
        [Parameter(Mandatory)][string]$RepositoryRoot,
        [Parameter(Mandatory)]$Scope,
        [Parameter(Mandatory)][string]$FieldId,
        [AllowNull()][Nullable[int]]$ArrayIndex
    )

    $current = $RepositoryRoot
    foreach ($segment in ([string]$Scope['basePath']).Split('/')) {
        $current = [IO.Path]::Combine($current, $segment)
        if (-not [IO.File]::Exists($current) -and -not [IO.Directory]::Exists($current)) { break }
        try { $attributes = [IO.File]::GetAttributes($current) }
        catch {
            Throw-GcFailureV2 -ReasonCode 'PATH_REPARSE_ESCAPE' -FieldId $FieldId -ArrayIndex $ArrayIndex -PolicyRuleId 'V2-PATH-ATTRIBUTES' -FailureCategory 'path-policy'
        }
        if (($attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) {
            Throw-GcFailureV2 -ReasonCode 'PATH_REPARSE_ESCAPE' -FieldId $FieldId -ArrayIndex $ArrayIndex -PolicyRuleId 'V2-PATH-REPARSE' -FailureCategory 'path-policy'
        }
    }
}

function Assert-GcPathScopeSetV2 {
    param([Parameter(Mandatory)][AllowEmptyCollection()]$Scopes, [Parameter(Mandatory)][string]$FieldId)

    for ($i = 0; $i -lt $Scopes.Count; $i++) {
        for ($j = $i + 1; $j -lt $Scopes.Count; $j++) {
            if (Test-GcPathScopeOverlapV2 -Left $Scopes[$i] -Right $Scopes[$j]) {
                Throw-GcFailureV2 -ReasonCode 'PATH_POLICY_OVERLAP' -FieldId $FieldId -ArrayIndex $j -PolicyRuleId 'V2-PATH-SET-DISJOINT' -FailureCategory 'path-policy'
            }
        }
    }
}

function Assert-GcPathPartitionsV2 {
    param(
        [Parameter(Mandatory)][AllowEmptyCollection()]$AllowedReadScopes,
        [Parameter(Mandatory)][AllowEmptyCollection()]$AllowedWriteScopes,
        [Parameter(Mandatory)][AllowEmptyCollection()]$ForbiddenScopes,
        [Parameter(Mandatory)][AllowEmptyCollection()]$ProtectedScopes
    )

    $partitions = @(
        @{ name = 'allowedReadPaths'; scopes = $AllowedReadScopes },
        @{ name = 'allowedWritePaths'; scopes = $AllowedWriteScopes },
        @{ name = 'forbiddenPaths'; scopes = $ForbiddenScopes },
        @{ name = 'protectedNamespaces'; scopes = $ProtectedScopes }
    )
    foreach ($partition in $partitions) { Assert-GcPathScopeSetV2 -Scopes $partition.scopes -FieldId $partition.name }
    for ($p = 0; $p -lt $partitions.Count; $p++) {
        for ($q = $p + 1; $q -lt $partitions.Count; $q++) {
            foreach ($left in $partitions[$p].scopes) {
                foreach ($right in $partitions[$q].scopes) {
                    if (Test-GcPathScopeOverlapV2 -Left $left -Right $right) {
                        Throw-GcFailureV2 -ReasonCode 'PATH_POLICY_OVERLAP' -FieldId 'pathPartitions' -PolicyRuleId 'V2-PATH-PARTITIONS-DISJOINT' -FailureCategory 'path-policy'
                    }
                }
            }
        }
    }
    return $true
}

function ConvertTo-GcPathScopeListV2 {
    param(
        [Parameter(Mandatory)][AllowEmptyCollection()]$Values,
        [Parameter(Mandatory)][string]$FieldId,
        [AllowNull()][AllowEmptyString()][string]$RepositoryRoot
    )

    $result = [Collections.Generic.List[object]]::new()
    $canonical = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    for ($i = 0; $i -lt $Values.Count; $i++) {
        $scope = ConvertTo-GcPathScopeV2 -Scope ([string]$Values[$i]) -FieldId $FieldId -ArrayIndex $i
        if (-not $canonical.Add([string]$scope['canonical'])) {
            Throw-GcFailureV2 -ReasonCode 'PATH_POLICY_OVERLAP' -FieldId $FieldId -ArrayIndex $i -PolicyRuleId 'V2-PATH-CANONICAL-DUPLICATE' -FailureCategory 'path-policy'
        }
        if (-not [string]::IsNullOrEmpty($RepositoryRoot)) {
            Assert-GcNoReparseEscapeV2 -RepositoryRoot $RepositoryRoot -Scope $scope -FieldId $FieldId -ArrayIndex $i
        }
        $result.Add($scope)
    }
    return $result
}

function Test-GcAuthorizableProtectedFileV2 {
    param([Parameter(Mandatory)]$Candidate, [Parameter(Mandatory)][AllowEmptyCollection()]$ProtectedScopes)
    if ([bool]$Candidate['isSubtree']) { return $false }
    foreach ($boundary in $ProtectedScopes) {
        if ([bool]$boundary['isSubtree']) {
            if (([string]$Candidate['basePath']).StartsWith(([string]$boundary['basePath'] + '/'), [StringComparison]::Ordinal)) { return $true }
        }
        elseif ([StringComparer]::Ordinal.Equals([string]$Candidate['basePath'], [string]$boundary['basePath'])) { return $true }
    }
    return $false
}

function Resolve-GcPathPolicyV2 {
    param(
        [Parameter(Mandatory)]$InputObject,
        [Parameter(Mandatory)]$Policy,
        [Parameter(Mandatory)][string]$RepositoryRoot,
        [AllowNull()]$ProtectedWriteAuthorization
    )

    $readScopes = @(ConvertTo-GcPathScopeListV2 -Values $InputObject['requestedReadPaths'] -FieldId 'requestedReadPaths' -RepositoryRoot $RepositoryRoot)
    $writeScopes = @(ConvertTo-GcPathScopeListV2 -Values $InputObject['requestedWritePaths'] -FieldId 'requestedWritePaths' -RepositoryRoot $RepositoryRoot)
    $forbiddenScopes = @(ConvertTo-GcPathScopeListV2 -Values $Policy['forbiddenPaths'] -FieldId 'policy.forbiddenPaths' -RepositoryRoot $null)
    $protectedScopes = @(ConvertTo-GcPathScopeListV2 -Values $Policy['protectedNamespaces'] -FieldId 'policy.protectedNamespaces' -RepositoryRoot $null)

    $approvedScopes = if ($null -eq $ProtectedWriteAuthorization) { @() } else { @($ProtectedWriteAuthorization['approvedScopes']) }
    $approvedSet = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($scope in $approvedScopes) { [void]$approvedSet.Add([string]$scope['canonical']) }
    $matchedApproved = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    $ordinaryReadScopes = [Collections.Generic.List[object]]::new()
    $ordinaryWriteScopes = [Collections.Generic.List[object]]::new()
    $authorizedWriteScopes = [Collections.Generic.List[object]]::new()
    $blockedReasons = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)

    foreach ($candidate in $readScopes) {
        $forbidden = $false
        $protected = $false
        foreach ($boundary in $forbiddenScopes) { if (Test-GcPathScopeOverlapV2 -Left $candidate -Right $boundary) { $forbidden = $true; break } }
        foreach ($boundary in $protectedScopes) { if (Test-GcPathScopeOverlapV2 -Left $candidate -Right $boundary) { $protected = $true; break } }
        if ($forbidden) { [void]$blockedReasons.Add('PATH_PROTECTED_NAMESPACE_OVERLAP') }
        elseif ($protected) {
            if ((Test-GcAuthorizableProtectedFileV2 -Candidate $candidate -ProtectedScopes $protectedScopes) -and $approvedSet.Contains([string]$candidate['canonical'])) { continue }
            [void]$blockedReasons.Add('PATH_PROTECTED_NAMESPACE_OVERLAP')
        }
        else { $ordinaryReadScopes.Add($candidate) }
    }
    foreach ($candidate in $writeScopes) {
        $forbidden = $false
        $protected = $false
        foreach ($boundary in $forbiddenScopes) { if (Test-GcPathScopeOverlapV2 -Left $candidate -Right $boundary) { $forbidden = $true; break } }
        foreach ($boundary in $protectedScopes) { if (Test-GcPathScopeOverlapV2 -Left $candidate -Right $boundary) { $protected = $true; break } }
        if ($forbidden) { [void]$blockedReasons.Add('PATH_PROTECTED_NAMESPACE_OVERLAP') }
        elseif ($protected) {
            if ((Test-GcAuthorizableProtectedFileV2 -Candidate $candidate -ProtectedScopes $protectedScopes) -and $approvedSet.Contains([string]$candidate['canonical'])) {
                $authorizedWriteScopes.Add($candidate)
                [void]$matchedApproved.Add([string]$candidate['canonical'])
            }
            else { [void]$blockedReasons.Add('PATH_PROTECTED_NAMESPACE_OVERLAP') }
        }
        else { $ordinaryWriteScopes.Add($candidate) }
    }
    if ($null -ne $ProtectedWriteAuthorization -and -not $matchedApproved.SetEquals($approvedSet)) {
        Throw-GcFailureV2 -ReasonCode 'PROTECTED_WRITE_AUTHORIZATION_INVALID' -FieldId 'protectedWriteAuthorization.approvedWritePaths' -PolicyRuleId 'V2-PROTECTED-WRITE-AUTH-PATH-BINDING' -FailureCategory 'authorization'
    }
    foreach ($readScope in $ordinaryReadScopes) {
        foreach ($writeScope in @($ordinaryWriteScopes) + @($authorizedWriteScopes)) {
            if (Test-GcPathScopeOverlapV2 -Left $readScope -Right $writeScope) { [void]$blockedReasons.Add('PATH_INPUT_PARTITION_OVERLAP') }
        }
    }
    for ($i = 0; $i -lt $readScopes.Count; $i++) {
        for ($j = $i + 1; $j -lt $readScopes.Count; $j++) {
            if (Test-GcPathScopeOverlapV2 -Left $readScopes[$i] -Right $readScopes[$j]) {
                [void]$blockedReasons.Add('PATH_INPUT_PARTITION_OVERLAP')
            }
        }
    }
    for ($i = 0; $i -lt $writeScopes.Count; $i++) {
        for ($j = $i + 1; $j -lt $writeScopes.Count; $j++) {
            if (Test-GcPathScopeOverlapV2 -Left $writeScopes[$i] -Right $writeScopes[$j]) {
                [void]$blockedReasons.Add('PATH_INPUT_PARTITION_OVERLAP')
            }
        }
    }

    $effectiveReadScopes = @()
    $effectiveWriteScopes = @()
    $effectiveAuthorizedWriteScopes = @()
    if ($blockedReasons.Count -eq 0) {
        $effectiveReadScopes = @($ordinaryReadScopes)
        $effectiveWriteScopes = @($ordinaryWriteScopes)
        $effectiveAuthorizedWriteScopes = @($authorizedWriteScopes)
    }
    Assert-GcPathPartitionsV2 -AllowedReadScopes $effectiveReadScopes -AllowedWriteScopes $effectiveWriteScopes -ForbiddenScopes $forbiddenScopes -ProtectedScopes $protectedScopes | Out-Null

    $ordinalSort = { param($values) $list = [Collections.Generic.List[string]]::new(); foreach ($v in $values) { $list.Add([string]$v['canonical']) }; $list.Sort([StringComparer]::Ordinal); return @($list) }
    $blockedReasonList = [Collections.Generic.List[string]]::new()
    foreach ($reason in $blockedReasons) { $blockedReasonList.Add($reason) }
    $blockedReasonList.Sort([StringComparer]::Ordinal)
    return [ordered]@{
        allowedReadPaths = @(& $ordinalSort $effectiveReadScopes)
        allowedWritePaths = @(& $ordinalSort $effectiveWriteScopes)
        authorizedProtectedWritePaths = @(& $ordinalSort $effectiveAuthorizedWriteScopes)
        forbiddenPaths = @(& $ordinalSort $forbiddenScopes)
        protectedNamespaces = @(& $ordinalSort $protectedScopes)
        readScopes = $effectiveReadScopes
        writeScopes = @($effectiveWriteScopes) + @($effectiveAuthorizedWriteScopes)
        blockedReasonCodes = @($blockedReasonList)
        routingReasonCodes = $(if ($effectiveAuthorizedWriteScopes.Count -gt 0) { @('PATH_HUMAN_AUTHORIZED_PROTECTED_WRITE') } else { @() })
        protectedWriteAuthorization = $ProtectedWriteAuthorization
    }
}
