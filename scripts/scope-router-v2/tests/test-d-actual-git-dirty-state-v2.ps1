. ([IO.Path]::Combine($PSScriptRoot, 'gc-scope-router-v2-test-support.ps1'))

$syntheticText = " M modified.txt`0A  staged.txt`0?? untracked.txt`0 D deleted.txt`0UU conflicted.txt`0R  rename-destination.txt`0rename-source.txt`0"
$synthetic = ConvertFrom-GcGitPorcelainV1ZV2 -Bytes ([Text.Encoding]::UTF8.GetBytes($syntheticText))
Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $synthetic['modified'] 'modified.txt') 'structural parser detects modified paths'
Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $synthetic['staged'] 'staged.txt') 'structural parser detects staged paths'
Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $synthetic['untracked'] 'untracked.txt') 'structural parser detects untracked paths'
Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $synthetic['deleted'] 'deleted.txt') 'structural parser detects deleted paths'
Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $synthetic['conflicted'] 'conflicted.txt') 'structural parser detects conflicted paths'
Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $synthetic['renameSource'] 'rename-source.txt') 'structural parser detects rename source'
Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $synthetic['renameDestination'] 'rename-destination.txt') 'structural parser detects rename destination'

Assert-GcTestThrowsReasonV2 { ConvertFrom-GcGitPorcelainV1ZV2 -Bytes ([byte[]](0xFF,0x00)) } 'GIT_STATUS_INVALID' 'invalid UTF-8 blocks Git status parsing'
Assert-GcTestThrowsReasonV2 { ConvertFrom-GcGitPorcelainV1ZV2 -Bytes ([Text.Encoding]::UTF8.GetBytes(' M missing-nul')) } 'GIT_STATUS_INVALID' 'missing NUL terminator blocks Git status parsing'
Assert-GcTestThrowsReasonV2 { ConvertFrom-GcGitPorcelainV1ZV2 -Bytes ([Text.Encoding]::UTF8.GetBytes("ZZ unknown.txt`0")) } 'GIT_STATUS_INVALID' 'unknown status code blocks parsing'
Assert-GcTestThrowsReasonV2 { ConvertFrom-GcGitPorcelainV1ZV2 -Bytes ([Text.Encoding]::UTF8.GetBytes("R  destination.txt`0")) } 'GIT_STATUS_INVALID' 'missing rename source blocks parsing'

$repo = New-GcTestDirectoryV2
try {
    Initialize-GcTestRepositoryV2 -RepositoryRoot $repo
    [IO.Directory]::CreateDirectory([IO.Path]::Combine($repo, 'src')) | Out-Null
    foreach ($relative in @('tracked.txt','rename-source.txt','delete-unstaged.txt','delete-staged.txt','src/a.txt')) {
        Write-GcTestUtf8V2 -LiteralPath ([IO.Path]::Combine($repo, $relative.Replace('/', [IO.Path]::DirectorySeparatorChar))) -Text "baseline $relative`n"
    }
    Invoke-GcTestGitV2 -RepositoryRoot $repo -Arguments @('add','--all') | Out-Null
    Invoke-GcTestGitV2 -RepositoryRoot $repo -Arguments @('commit','-m','temporary fixture baseline') | Out-Null

    Write-GcTestUtf8V2 -LiteralPath ([IO.Path]::Combine($repo, 'tracked.txt')) -Text "modified`n"
    Write-GcTestUtf8V2 -LiteralPath ([IO.Path]::Combine($repo, 'src', 'a.txt')) -Text "modified nested`n"
    Write-GcTestUtf8V2 -LiteralPath ([IO.Path]::Combine($repo, 'untracked with spaces.txt')) -Text "untracked`n"
    Write-GcTestUtf8V2 -LiteralPath ([IO.Path]::Combine($repo, 'staged.txt')) -Text "staged`n"
    Invoke-GcTestGitV2 -RepositoryRoot $repo -Arguments @('add','--','staged.txt') | Out-Null
    [IO.File]::Delete([IO.Path]::Combine($repo, 'delete-unstaged.txt'))
    [IO.File]::Delete([IO.Path]::Combine($repo, 'delete-staged.txt'))
    Invoke-GcTestGitV2 -RepositoryRoot $repo -Arguments @('add','--','delete-staged.txt') | Out-Null
    Invoke-GcTestGitV2 -RepositoryRoot $repo -Arguments @('mv','--','rename-source.txt','rename-destination.txt') | Out-Null

    $state = Get-GcGitStateV2 -RepositoryRoot $repo
    Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $state['modified'] 'tracked.txt') 'actual Git query detects unstaged modification'
    Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $state['staged'] 'staged.txt') 'actual Git query detects staged path'
    Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $state['untracked'] 'untracked with spaces.txt') 'actual Git query preserves spaces in untracked path'
    Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $state['deleted'] 'delete-unstaged.txt') 'actual Git query detects unstaged delete'
    Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $state['deleted'] 'delete-staged.txt') 'actual Git query detects staged delete'
    Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $state['renameSource'] 'rename-source.txt') 'actual Git query detects rename source'
    Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $state['renameDestination'] 'rename-destination.txt') 'actual Git query detects rename destination'

    $ancestorConflict = @(Get-GcDirtyScopeConflictsV2 -WriteScopes @((ConvertTo-GcPathScopeV2 'src')) -GitState $state)
    Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $ancestorConflict 'src/a.txt') 'dirty descendant overlaps candidate ancestor'
    $descendantConflict = @(Get-GcDirtyScopeConflictsV2 -WriteScopes @((ConvertTo-GcPathScopeV2 'src/a.txt/child')) -GitState $state)
    Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $descendantConflict 'src/a.txt') 'dirty ancestor overlaps candidate descendant'
    $renameSourceConflict = @(Get-GcDirtyScopeConflictsV2 -WriteScopes @((ConvertTo-GcPathScopeV2 'rename-source.txt')) -GitState $state)
    $renameDestinationConflict = @(Get-GcDirtyScopeConflictsV2 -WriteScopes @((ConvertTo-GcPathScopeV2 'rename-destination.txt')) -GitState $state)
    Assert-GcTestTrueV2 ($renameSourceConflict.Count -eq 1 -and $renameDestinationConflict.Count -eq 1) 'both rename sides participate in dirty overlap'

    $bundle = Get-GcPolicyV2 -RepositoryRoot $script:GcV2RepositoryRoot
    $repoIdentity = Get-GcRepositoryIdentityV2 -RepositoryRoot $repo
    $lyingInput = New-GcBaseInputV2 -Identity $repoIdentity
    $lyingInput.Add('workingTreeClean', $true)
    Assert-GcTestThrowsReasonV2 { Assert-GcInputSchemaV2 -InputObject $lyingInput -Policy $bundle['policy'] } 'INPUT_UNKNOWN_PROPERTY' 'task input cannot override actual Git cleanliness'
    Assert-GcTestTrueV2 ($state['dirtyPaths'].Count -gt 0) 'actual Git facts remain dirty independently of task prose'
}
finally { Remove-GcTestDirectoryV2 -LiteralPath $repo }

$conflictRepo = New-GcTestDirectoryV2
try {
    Initialize-GcTestRepositoryV2 -RepositoryRoot $conflictRepo
    Write-GcTestUtf8V2 -LiteralPath ([IO.Path]::Combine($conflictRepo, 'conflict.txt')) -Text "base`n"
    Invoke-GcTestGitV2 -RepositoryRoot $conflictRepo -Arguments @('add','--all') | Out-Null
    Invoke-GcTestGitV2 -RepositoryRoot $conflictRepo -Arguments @('commit','-m','temporary conflict base') | Out-Null
    Invoke-GcTestGitV2 -RepositoryRoot $conflictRepo -Arguments @('checkout','-b','side') | Out-Null
    Write-GcTestUtf8V2 -LiteralPath ([IO.Path]::Combine($conflictRepo, 'conflict.txt')) -Text "side`n"
    Invoke-GcTestGitV2 -RepositoryRoot $conflictRepo -Arguments @('add','--all') | Out-Null
    Invoke-GcTestGitV2 -RepositoryRoot $conflictRepo -Arguments @('commit','-m','temporary side') | Out-Null
    Invoke-GcTestGitV2 -RepositoryRoot $conflictRepo -Arguments @('checkout','main') | Out-Null
    Write-GcTestUtf8V2 -LiteralPath ([IO.Path]::Combine($conflictRepo, 'conflict.txt')) -Text "main`n"
    Invoke-GcTestGitV2 -RepositoryRoot $conflictRepo -Arguments @('add','--all') | Out-Null
    Invoke-GcTestGitV2 -RepositoryRoot $conflictRepo -Arguments @('commit','-m','temporary main') | Out-Null
    $merge = Invoke-GcTestGitV2 -RepositoryRoot $conflictRepo -Arguments @('merge','side') -AllowFailure
    Assert-GcTestTrueV2 ($merge['exitCode'] -ne 0) 'temporary fixture produces a real merge conflict'
    $conflictState = Get-GcGitStateV2 -RepositoryRoot $conflictRepo
    Assert-GcTestTrueV2 (Test-GcTestArrayContainsOrdinalV2 $conflictState['conflicted'] 'conflict.txt') 'actual Git query detects conflict'
}
finally { Remove-GcTestDirectoryV2 -LiteralPath $conflictRepo }

$notARepository = New-GcTestDirectoryV2
try { Assert-GcTestThrowsReasonV2 { Get-GcGitStateV2 -RepositoryRoot $notARepository } 'GIT_INVOCATION_FAILED' 'failure to obtain Git status blocks' }
finally { Remove-GcTestDirectoryV2 -LiteralPath $notARepository }

$pwsh = Resolve-GcPowerShellApplicationV2
Assert-GcTestThrowsReasonV2 { Invoke-GcChildProcessV2 -FilePath $pwsh -Arguments @('-NoProfile','-Command','Start-Sleep -Seconds 2') -WorkingDirectory $script:GcV2RepositoryRoot -TimeoutMilliseconds 100 } 'GIT_INVOCATION_FAILED' 'bounded child-process timeout fails closed'

[Console]::Out.WriteLine('PASS D ACTUAL GIT DIRTY STATE')
