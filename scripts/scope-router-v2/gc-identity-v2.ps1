Set-StrictMode -Version Latest

function Resolve-GcSystemGitV2 {
    $commands = @()
    try {
        $commands = @(Get-Command -Name 'git.exe','git' -CommandType Application -All -ErrorAction Stop)
    }
    catch {
        Throw-GcFailureV2 -ReasonCode 'GIT_INVOCATION_FAILED' -FieldId 'git.application' -PolicyRuleId 'V2-GIT-APPLICATION' -FailureCategory 'git'
    }

    foreach ($command in $commands) {
        $path = [string]$command.Source
        if ([IO.File]::Exists($path)) { return [IO.Path]::GetFullPath($path) }
    }
    Throw-GcFailureV2 -ReasonCode 'GIT_INVOCATION_FAILED' -FieldId 'git.application' -PolicyRuleId 'V2-GIT-APPLICATION' -FailureCategory 'git'
}

function Invoke-GcChildProcessV2 {
    param(
        [Parameter(Mandatory)][string]$FilePath,
        [Parameter(Mandatory)][string[]]$Arguments,
        [Parameter(Mandatory)][string]$WorkingDirectory,
        [ValidateRange(100, 120000)][int]$TimeoutMilliseconds = 15000
    )

    $process = [Diagnostics.Process]::new()
    $stdout = [IO.MemoryStream]::new()
    $stderr = [IO.MemoryStream]::new()
    try {
        $start = [Diagnostics.ProcessStartInfo]::new()
        $start.FileName = $FilePath
        $start.WorkingDirectory = $WorkingDirectory
        $start.UseShellExecute = $false
        $start.CreateNoWindow = $true
        $start.RedirectStandardOutput = $true
        $start.RedirectStandardError = $true
        foreach ($argument in $Arguments) { [void]$start.ArgumentList.Add($argument) }
        $process.StartInfo = $start

        if (-not $process.Start()) {
            Throw-GcFailureV2 -ReasonCode 'GIT_INVOCATION_FAILED' -FieldId 'child.start' -PolicyRuleId 'V2-CHILD-START' -FailureCategory 'child-process'
        }
        $stdoutTask = $process.StandardOutput.BaseStream.CopyToAsync($stdout)
        $stderrTask = $process.StandardError.BaseStream.CopyToAsync($stderr)

        if (-not $process.WaitForExit($TimeoutMilliseconds)) {
            try { $process.Kill($true) } catch { }
            [void]$process.WaitForExit(2000)
            Throw-GcFailureV2 -ReasonCode 'GIT_INVOCATION_FAILED' -FieldId 'child.timeout' -PolicyRuleId 'V2-CHILD-TIMEOUT' -FailureCategory 'child-process'
        }
        try {
            [void][Threading.Tasks.Task]::WaitAll([Threading.Tasks.Task[]]@($stdoutTask, $stderrTask), 2000)
        }
        catch {
            Throw-GcFailureV2 -ReasonCode 'GIT_INVOCATION_FAILED' -FieldId 'child.stream' -PolicyRuleId 'V2-CHILD-STREAM' -FailureCategory 'child-process'
        }

        $stderrBytes = $stderr.ToArray()
        return [ordered]@{
            exitCode = $process.ExitCode
            stdoutBytes = [byte[]]$stdout.ToArray()
            stderrByteLength = $stderrBytes.Length
            stderrSha256 = Get-GcSha256HexV2 -Bytes $stderrBytes
        }
    }
    catch [InvalidOperationException] {
        throw
    }
    catch {
        Throw-GcFailureV2 -ReasonCode 'GIT_INVOCATION_FAILED' -FieldId 'child.failure' -PolicyRuleId 'V2-CHILD-FAIL-CLOSED' -FailureCategory 'child-process'
    }
    finally {
        $stdout.Dispose()
        $stderr.Dispose()
        $process.Dispose()
    }
}

function Invoke-GcGitProcessV2 {
    param(
        [Parameter(Mandatory)][string]$RepositoryRoot,
        [Parameter(Mandatory)][string[]]$Arguments,
        [ValidateRange(100, 120000)][int]$TimeoutMilliseconds = 15000
    )

    $gitPath = Resolve-GcSystemGitV2
    $result = Invoke-GcChildProcessV2 -FilePath $gitPath -Arguments $Arguments -WorkingDirectory $RepositoryRoot -TimeoutMilliseconds $TimeoutMilliseconds
    if ($result['exitCode'] -ne 0) {
        Throw-GcFailureV2 -ReasonCode 'GIT_INVOCATION_FAILED' -FieldId 'git.exitCode' -PolicyRuleId 'V2-GIT-EXIT' -FailureCategory 'git'
    }
    return $result
}

function ConvertFrom-GcGitSingleLineV2 {
    param([Parameter(Mandatory)][byte[]]$Bytes, [Parameter(Mandatory)][string]$FieldId)

    try {
        $encoding = [Text.UTF8Encoding]::new($false, $true)
        $text = $encoding.GetString($Bytes)
    }
    catch {
        Throw-GcFailureV2 -ReasonCode 'IDENTITY_INVALID' -FieldId $FieldId -PolicyRuleId 'V2-GIT-UTF8' -FailureCategory 'identity'
    }

    if ($text.EndsWith("`r`n", [StringComparison]::Ordinal)) {
        $text = $text.Substring(0, $text.Length - 2)
    }
    elseif ($text.EndsWith("`n", [StringComparison]::Ordinal)) {
        $text = $text.Substring(0, $text.Length - 1)
    }
    else {
        Throw-GcFailureV2 -ReasonCode 'IDENTITY_INVALID' -FieldId $FieldId -PolicyRuleId 'V2-GIT-SINGLE-LINE' -FailureCategory 'identity'
    }
    if ($text.Length -eq 0 -or $text.Contains("`0") -or $text.Contains("`r") -or $text.Contains("`n") -or $text -match '^\s|\s$') {
        Throw-GcFailureV2 -ReasonCode 'IDENTITY_INVALID' -FieldId $FieldId -PolicyRuleId 'V2-GIT-SINGLE-LINE' -FailureCategory 'identity'
    }
    return $text
}

function ConvertTo-GcCanonicalRootV2 {
    param(
        [Parameter(Mandatory)][string]$Root,
        [switch]$RequireAlreadyCanonical
    )

    if ($Root.Length -eq 0 -or $Root -match '^\s|\s$') {
        Throw-GcFailureV2 -ReasonCode 'IDENTITY_INVALID' -FieldId 'repositoryRoot' -PolicyRuleId 'V2-ROOT-CANONICAL' -FailureCategory 'identity'
    }
    try {
        $platformForm = if ([IO.Path]::DirectorySeparatorChar -eq '\') { $Root.Replace('/', '\') } else { $Root }
        $canonical = [IO.Path]::GetFullPath($platformForm)
        if ($canonical.Length -gt [IO.Path]::GetPathRoot($canonical).Length) {
            $canonical = $canonical.TrimEnd([IO.Path]::DirectorySeparatorChar)
        }
    }
    catch {
        Throw-GcFailureV2 -ReasonCode 'IDENTITY_INVALID' -FieldId 'repositoryRoot' -PolicyRuleId 'V2-ROOT-CANONICAL' -FailureCategory 'identity'
    }

    if ($RequireAlreadyCanonical -and -not (Test-GcOrdinalEqualsV2 -Left $Root -Right $canonical)) {
        Throw-GcFailureV2 -ReasonCode 'IDENTITY_INVALID' -FieldId 'repositoryRoot' -PolicyRuleId 'V2-ROOT-EXACT-FORM' -FailureCategory 'identity'
    }
    return $canonical
}

function Get-GcRepositoryIdentityV2 {
    param([Parameter(Mandatory)][string]$RepositoryRoot)

    $canonicalWorkingRoot = ConvertTo-GcCanonicalRootV2 -Root $RepositoryRoot -RequireAlreadyCanonical
    if (-not [IO.Directory]::Exists($canonicalWorkingRoot)) {
        Throw-GcFailureV2 -ReasonCode 'IDENTITY_INVALID' -FieldId 'repositoryRoot' -PolicyRuleId 'V2-ROOT-EXISTS' -FailureCategory 'identity'
    }

    $rootResult = Invoke-GcGitProcessV2 -RepositoryRoot $canonicalWorkingRoot -Arguments @('rev-parse','--show-toplevel')
    $branchResult = Invoke-GcGitProcessV2 -RepositoryRoot $canonicalWorkingRoot -Arguments @('branch','--show-current')
    $headResult = Invoke-GcGitProcessV2 -RepositoryRoot $canonicalWorkingRoot -Arguments @('rev-parse','HEAD')

    $gitRootText = ConvertFrom-GcGitSingleLineV2 -Bytes $rootResult['stdoutBytes'] -FieldId 'actual.repositoryRoot'
    $gitRoot = ConvertTo-GcCanonicalRootV2 -Root $gitRootText
    $branch = ConvertFrom-GcGitSingleLineV2 -Bytes $branchResult['stdoutBytes'] -FieldId 'actual.branch'
    $head = ConvertFrom-GcGitSingleLineV2 -Bytes $headResult['stdoutBytes'] -FieldId 'actual.head'

    if ($head -cnotmatch '^[0-9a-f]{40}$') {
        Throw-GcFailureV2 -ReasonCode 'IDENTITY_INVALID' -FieldId 'actual.head' -PolicyRuleId 'V2-HEAD-CANONICAL' -FailureCategory 'identity'
    }
    return [ordered]@{ repositoryRoot = $gitRoot; branch = $branch; head = $head }
}

function Assert-GcOrdinalIdentityV2 {
    param([Parameter(Mandatory)]$InputObject, [Parameter(Mandatory)]$ActualIdentity)

    $expectedRoot = ConvertTo-GcCanonicalRootV2 -Root ([string]$InputObject['repositoryRoot']) -RequireAlreadyCanonical
    if (-not (Test-GcOrdinalEqualsV2 $expectedRoot ([string]$ActualIdentity['repositoryRoot']))) {
        Throw-GcFailureV2 -ReasonCode 'IDENTITY_MISMATCH' -FieldId 'repositoryRoot' -PolicyRuleId 'V2-ROOT-ORDINAL' -FailureCategory 'identity'
    }
    if (-not (Test-GcOrdinalEqualsV2 ([string]$InputObject['expectedBranch']) ([string]$ActualIdentity['branch']))) {
        Throw-GcFailureV2 -ReasonCode 'IDENTITY_MISMATCH' -FieldId 'expectedBranch' -PolicyRuleId 'V2-BRANCH-ORDINAL' -FailureCategory 'identity'
    }
    if (-not (Test-GcOrdinalEqualsV2 ([string]$InputObject['expectedHead']) ([string]$ActualIdentity['head']))) {
        Throw-GcFailureV2 -ReasonCode 'IDENTITY_MISMATCH' -FieldId 'expectedHead' -PolicyRuleId 'V2-HEAD-ORDINAL' -FailureCategory 'identity'
    }
    return $true
}
