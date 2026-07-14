Set-StrictMode -Version Latest

function ConvertFrom-GcStrictUtf8BytesV2 {
    param([Parameter(Mandatory)][AllowEmptyCollection()][byte[]]$Bytes, [Parameter(Mandatory)][string]$FieldId)
    try {
        return ([Text.UTF8Encoding]::new($false, $true)).GetString($Bytes)
    }
    catch {
        Throw-GcFailureV2 -ReasonCode 'GIT_STATUS_INVALID' -FieldId $FieldId -PolicyRuleId 'V2-GIT-STATUS-UTF8' -FailureCategory 'git-status'
    }
}

function Split-GcNulRecordsV2 {
    param([Parameter(Mandatory)][AllowEmptyCollection()][byte[]]$Bytes)

    if ($Bytes.Length -eq 0) { return @() }
    if ($Bytes[$Bytes.Length - 1] -ne 0) {
        Throw-GcFailureV2 -ReasonCode 'GIT_STATUS_INVALID' -FieldId 'git.status' -PolicyRuleId 'V2-GIT-STATUS-NUL' -FailureCategory 'git-status'
    }
    $records = [Collections.Generic.List[byte[]]]::new()
    $start = 0
    for ($i = 0; $i -lt $Bytes.Length; $i++) {
        if ($Bytes[$i] -eq 0) {
            $length = $i - $start
            $record = [byte[]]::new($length)
            if ($length -gt 0) { [Array]::Copy($Bytes, $start, $record, 0, $length) }
            $records.Add($record)
            $start = $i + 1
        }
    }
    return @($records)
}

function ConvertFrom-GcGitPorcelainV1ZV2 {
    param([Parameter(Mandatory)][AllowEmptyCollection()][byte[]]$Bytes)

    $records = @(Split-GcNulRecordsV2 -Bytes $Bytes)
    $modified = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    $staged = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    $untracked = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    $deleted = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    $conflicted = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    $renameSource = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    $renameDestination = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    $dirty = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    $validStatusChars = [Collections.Generic.HashSet[char]]::new([char[]]' MADRCU?!T')
    $conflictCodes = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($conflictCode in @('DD','AU','UD','UA','DU','AA','UU')) { [void]$conflictCodes.Add($conflictCode) }

    for ($recordIndex = 0; $recordIndex -lt $records.Count; $recordIndex++) {
        $recordText = ConvertFrom-GcStrictUtf8BytesV2 -Bytes $records[$recordIndex] -FieldId 'git.statusRecord'
        if ($recordText.Length -lt 4 -or $recordText[2] -ne ' ') {
            Throw-GcFailureV2 -ReasonCode 'GIT_STATUS_INVALID' -FieldId 'git.statusRecord' -ArrayIndex $recordIndex -PolicyRuleId 'V2-GIT-STATUS-RECORD' -FailureCategory 'git-status'
        }
        $x = $recordText[0]
        $y = $recordText[1]
        if (-not $validStatusChars.Contains($x) -or -not $validStatusChars.Contains($y)) {
            Throw-GcFailureV2 -ReasonCode 'GIT_STATUS_INVALID' -FieldId 'git.statusCode' -ArrayIndex $recordIndex -PolicyRuleId 'V2-GIT-STATUS-CODE' -FailureCategory 'git-status'
        }
        $code = $recordText.Substring(0, 2)
        if ([StringComparer]::Ordinal.Equals($code, '!!')) { continue }
        if (($x -eq '?' -or $y -eq '?') -and -not [StringComparer]::Ordinal.Equals($code, '??')) {
            Throw-GcFailureV2 -ReasonCode 'GIT_STATUS_INVALID' -FieldId 'git.statusCode' -ArrayIndex $recordIndex -PolicyRuleId 'V2-GIT-STATUS-CODE' -FailureCategory 'git-status'
        }
        if (($x -eq '!' -or $y -eq '!') -and -not [StringComparer]::Ordinal.Equals($code, '!!')) {
            Throw-GcFailureV2 -ReasonCode 'GIT_STATUS_INVALID' -FieldId 'git.statusCode' -ArrayIndex $recordIndex -PolicyRuleId 'V2-GIT-STATUS-CODE' -FailureCategory 'git-status'
        }

        $path = $recordText.Substring(3)
        if ($path.Length -eq 0) {
            Throw-GcFailureV2 -ReasonCode 'GIT_STATUS_INVALID' -FieldId 'git.statusPath' -ArrayIndex $recordIndex -PolicyRuleId 'V2-GIT-STATUS-PATH' -FailureCategory 'git-status'
        }
        try { $pathScope = ConvertTo-GcPathScopeV2 -Scope $path -FieldId 'git.statusPath' -ArrayIndex $recordIndex }
        catch {
            Throw-GcFailureV2 -ReasonCode 'GIT_STATUS_INVALID' -FieldId 'git.statusPath' -ArrayIndex $recordIndex -PolicyRuleId 'V2-GIT-STATUS-PATH' -FailureCategory 'git-status'
        }
        $canonicalPath = [string]$pathScope['basePath']
        [void]$dirty.Add($canonicalPath)

        if ([StringComparer]::Ordinal.Equals($code, '??')) { [void]$untracked.Add($canonicalPath) }
        if ($x -notin @(' ','?','!')) { [void]$staged.Add($canonicalPath) }
        if ($x -in @('M','T') -or $y -in @('M','T')) { [void]$modified.Add($canonicalPath) }
        if ($x -eq 'D' -or $y -eq 'D') { [void]$deleted.Add($canonicalPath) }
        if ($conflictCodes.Contains($code) -or $x -eq 'U' -or $y -eq 'U') { [void]$conflicted.Add($canonicalPath) }

        if ($x -in @('R','C') -or $y -in @('R','C')) {
            [void]$renameDestination.Add($canonicalPath)
            $recordIndex++
            if ($recordIndex -ge $records.Count) {
                Throw-GcFailureV2 -ReasonCode 'GIT_STATUS_INVALID' -FieldId 'git.renameSource' -PolicyRuleId 'V2-GIT-RENAME-SOURCE' -FailureCategory 'git-status'
            }
            $source = ConvertFrom-GcStrictUtf8BytesV2 -Bytes $records[$recordIndex] -FieldId 'git.renameSource'
            if ($source.Length -eq 0) {
                Throw-GcFailureV2 -ReasonCode 'GIT_STATUS_INVALID' -FieldId 'git.renameSource' -PolicyRuleId 'V2-GIT-RENAME-SOURCE' -FailureCategory 'git-status'
            }
            try { $sourceScope = ConvertTo-GcPathScopeV2 -Scope $source -FieldId 'git.renameSource' -ArrayIndex $recordIndex }
            catch {
                Throw-GcFailureV2 -ReasonCode 'GIT_STATUS_INVALID' -FieldId 'git.renameSource' -ArrayIndex $recordIndex -PolicyRuleId 'V2-GIT-RENAME-SOURCE' -FailureCategory 'git-status'
            }
            $canonicalSource = [string]$sourceScope['basePath']
            [void]$renameSource.Add($canonicalSource)
            [void]$dirty.Add($canonicalSource)
        }
    }

    $sortSet = { param($set) $list = [Collections.Generic.List[string]]::new(); foreach ($item in $set) { $list.Add($item) }; $list.Sort([StringComparer]::Ordinal); return @($list) }
    return [ordered]@{
        modified = @(& $sortSet $modified)
        staged = @(& $sortSet $staged)
        untracked = @(& $sortSet $untracked)
        deleted = @(& $sortSet $deleted)
        conflicted = @(& $sortSet $conflicted)
        renameSource = @(& $sortSet $renameSource)
        renameDestination = @(& $sortSet $renameDestination)
        dirtyPaths = @(& $sortSet $dirty)
    }
}

function Get-GcGitStateV2 {
    param([Parameter(Mandatory)][string]$RepositoryRoot, [ValidateRange(100, 120000)][int]$TimeoutMilliseconds = 15000)

    $result = Invoke-GcGitProcessV2 -RepositoryRoot $RepositoryRoot -Arguments @('status','--porcelain=v1','-z','--untracked-files=all') -TimeoutMilliseconds $TimeoutMilliseconds
    return ConvertFrom-GcGitPorcelainV1ZV2 -Bytes $result['stdoutBytes']
}

function Get-GcDirtyScopeConflictsV2 {
    param([Parameter(Mandatory)]$WriteScopes, [Parameter(Mandatory)]$GitState)

    $conflicts = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($path in $GitState['dirtyPaths']) {
        $dirtyScope = ConvertTo-GcPathScopeV2 -Scope ([string]$path) -FieldId 'git.dirtyPath'
        foreach ($writeScope in $WriteScopes) {
            if (Test-GcPathScopeOverlapV2 -Left $writeScope -Right $dirtyScope) {
                [void]$conflicts.Add([string]$path)
            }
        }
    }
    $sorted = [Collections.Generic.List[string]]::new()
    foreach ($path in $conflicts) { $sorted.Add($path) }
    $sorted.Sort([StringComparer]::Ordinal)
    return @($sorted)
}
