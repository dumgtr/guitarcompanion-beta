Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$script:GcV2ScriptRoot = [IO.Path]::GetFullPath([IO.Path]::Combine($PSScriptRoot, '..'))
$script:GcV2RepositoryRoot = [IO.Path]::GetFullPath([IO.Path]::Combine($script:GcV2ScriptRoot, '..', '..'))
foreach ($moduleFile in @('gc-strict-json-v2.ps1','gc-identity-v2.ps1','gc-path-policy-v2.ps1','gc-git-state-v2.ps1','gc-policy-v2.ps1','gc-semantic-v2.ps1','gc-evidence-v2.ps1')) {
    . ([IO.Path]::Combine($script:GcV2ScriptRoot, $moduleFile))
}

function Assert-GcTestTrueV2 {
    param([bool]$Condition, [Parameter(Mandatory)][string]$Message)
    if (-not $Condition) { throw "TEST_ASSERTION_FAILED: $Message" }
}

function Assert-GcTestOrdinalEqualV2 {
    param([AllowNull()][string]$Actual, [AllowNull()][string]$Expected, [Parameter(Mandatory)][string]$Message)
    if (-not [StringComparer]::Ordinal.Equals($Actual, $Expected)) { throw "TEST_ASSERTION_FAILED: $Message" }
}

function Assert-GcTestThrowsReasonV2 {
    param([Parameter(Mandatory)][scriptblock]$Action, [Parameter(Mandatory)][string]$ReasonCode, [Parameter(Mandatory)][string]$Message)
    $thrown = $false
    try { & $Action | Out-Null }
    catch {
        $thrown = $true
        if (-not $_.Exception.Message.StartsWith($ReasonCode + '|', [StringComparison]::Ordinal)) {
            throw "TEST_ASSERTION_FAILED: $Message (wrong closed reason)"
        }
    }
    if (-not $thrown) { throw "TEST_ASSERTION_FAILED: $Message (did not throw)" }
}

function New-GcTestDirectoryV2 {
    $path = [IO.Path]::Combine([IO.Path]::GetTempPath(), 'gc-scope-router-v2-' + [Guid]::NewGuid().ToString('N'))
    [IO.Directory]::CreateDirectory($path) | Out-Null
    return $path
}

function Remove-GcTestDirectoryV2 {
    param([Parameter(Mandatory)][string]$LiteralPath)
    $full = [IO.Path]::GetFullPath($LiteralPath)
    $temp = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
    if (-not $full.StartsWith($temp, [StringComparison]::OrdinalIgnoreCase) -or -not ([IO.Path]::GetFileName($full)).StartsWith('gc-scope-router-v2-', [StringComparison]::Ordinal)) {
        throw 'TEST_CLEANUP_SCOPE_REJECTED'
    }
    if ([IO.Directory]::Exists($full)) {
        foreach ($file in [IO.Directory]::EnumerateFiles($full, '*', [IO.SearchOption]::AllDirectories)) {
            try { [IO.File]::SetAttributes($file, [IO.FileAttributes]::Normal) } catch { }
        }
        [IO.Directory]::Delete($full, $true)
    }
}

function Write-GcTestUtf8V2 {
    param([Parameter(Mandatory)][string]$LiteralPath, [Parameter(Mandatory)][string]$Text)
    [IO.File]::WriteAllText($LiteralPath, $Text, [Text.UTF8Encoding]::new($false))
}

function Invoke-GcTestGitV2 {
    param([Parameter(Mandatory)][string]$RepositoryRoot, [Parameter(Mandatory)][string[]]$Arguments, [switch]$AllowFailure)
    $result = Invoke-GcChildProcessV2 -FilePath (Resolve-GcSystemGitV2) -Arguments $Arguments -WorkingDirectory $RepositoryRoot -TimeoutMilliseconds 20000
    if (-not $AllowFailure -and $result['exitCode'] -ne 0) { throw 'TEST_GIT_SETUP_FAILED' }
    return $result
}

function Initialize-GcTestRepositoryV2 {
    param([Parameter(Mandatory)][string]$RepositoryRoot)
    Invoke-GcTestGitV2 -RepositoryRoot $RepositoryRoot -Arguments @('init','--initial-branch=main') | Out-Null
    Invoke-GcTestGitV2 -RepositoryRoot $RepositoryRoot -Arguments @('config','user.name','GC V2 Test') | Out-Null
    Invoke-GcTestGitV2 -RepositoryRoot $RepositoryRoot -Arguments @('config','user.email','gc-v2-test@example.invalid') | Out-Null
}

function New-GcBaseInputV2 {
    param([Parameter(Mandatory)]$Identity)
    return [ordered]@{
        schemaVersion = 'gc-scope-router-v2.input/1'
        policyVersion = 'gc-scope-router-v2.policy/1'
        taskId = 'GC-V2-TEST'
        repositoryRoot = [string]$Identity['repositoryRoot']
        expectedBranch = [string]$Identity['branch']
        expectedHead = [string]$Identity['head']
        requestedOperations = @('documentation_edit')
        requestedReadPaths = @('README.md')
        requestedWritePaths = @('docs/gc-v2-test.md')
    }
}

function Copy-GcTestObjectV2 {
    param([Parameter(Mandatory)]$Value)
    $bytes = [Text.Encoding]::UTF8.GetBytes((ConvertTo-GcCanonicalJsonV2 -Value $Value))
    return ConvertFrom-GcStrictJsonV2 -Bytes $bytes
}

function New-GcEmptyGitStateV2 {
    return [ordered]@{ modified=@(); staged=@(); untracked=@(); deleted=@(); conflicted=@(); renameSource=@(); renameDestination=@(); dirtyPaths=@() }
}

function Test-GcTestArrayContainsOrdinalV2 {
    param([Parameter(Mandatory)][AllowEmptyCollection()]$Values, [Parameter(Mandatory)][string]$Expected)
    foreach ($value in $Values) { if ([StringComparer]::Ordinal.Equals([string]$value, $Expected)) { return $true } }
    return $false
}
