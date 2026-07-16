Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repositoryRoot = [IO.Path]::GetFullPath([IO.Path]::Combine($PSScriptRoot, '..', '..', '..'))

& ([IO.Path]::Combine($repositoryRoot, 'scripts', 'scope-router-v2', 'tests', 'test-gc-scope-router-v2.ps1'))
& ([IO.Path]::Combine($repositoryRoot, 'scripts', 'provider-process-runner-v1', 'tests', 'test-gc-provider-process-runner-v1.ps1'))

function Assert-GcWorkflowTrue {
    param([bool]$Condition, [Parameter(Mandatory)][string]$Message)
    if (-not $Condition) { throw ('WORKFLOW_ALIGNMENT_ASSERTION_FAILED: ' + $Message) }
}

$routerPolicy = Get-Content -LiteralPath ([IO.Path]::Combine($repositoryRoot, 'config', 'gc-scope-router-v2.policy.json')) -Raw | ConvertFrom-Json -AsHashtable
$runnerPolicy = Get-Content -LiteralPath ([IO.Path]::Combine($repositoryRoot, 'config', 'gc-provider-process-runner-v1.policy.json')) -Raw | ConvertFrom-Json -AsHashtable
$requestSchema = Get-Content -LiteralPath ([IO.Path]::Combine($repositoryRoot, 'schemas', 'gc-provider-process-runner-v1.request.schema.json')) -Raw | ConvertFrom-Json -AsHashtable
$authorizationSchema = Get-Content -LiteralPath ([IO.Path]::Combine($repositoryRoot, 'schemas', 'gc-provider-process-runner-v1.authorization.schema.json')) -Raw | ConvertFrom-Json -AsHashtable

$profiles = [Collections.Generic.Dictionary[string,object]]::new([StringComparer]::Ordinal)
foreach ($profile in $runnerPolicy['profiles']) { $profiles.Add([string]$profile['id'], $profile) }
foreach ($binding in $routerPolicy['reviewerProfileBindings']) {
    $profileId = [string]$binding['providerProfileId']
    Assert-GcWorkflowTrue ($profiles.ContainsKey($profileId)) ('Router binding exists in Runner policy: ' + $profileId)
    Assert-GcWorkflowTrue ([bool]$profiles[$profileId]['enabled']) ('Router binding is enabled: ' + $profileId)
    Assert-GcWorkflowTrue (@($requestSchema['properties']['providerProfileId']['enum']) -ccontains $profileId) ('request schema permits fixed profile: ' + $profileId)
    Assert-GcWorkflowTrue (@($authorizationSchema['properties']['providerProfileId']['enum']) -ccontains $profileId) ('authorization schema permits fixed profile: ' + $profileId)
}

$claudeArguments = @($profiles['claude-readonly']['arguments'])
$claudeText = $claudeArguments -join "`n"
Assert-GcWorkflowTrue ($claudeText -cmatch '--permission-mode\nplan') 'Claude permission mode is plan'
Assert-GcWorkflowTrue ($claudeText -cmatch '--tools\nRead,Glob,Grep') 'Claude tool allowlist is read-only'
Assert-GcWorkflowTrue ($claudeText -cmatch '--disallowedTools\nEdit,Write,Bash,NotebookEdit,WebFetch,WebSearch,mcp__\*') 'Claude write, shell, web, and MCP tools are denied'
Assert-GcWorkflowTrue ($claudeArguments -ccontains '--no-session-persistence') 'Claude session persistence is disabled'

$geminiArguments = @($profiles['gemini-plan-review']['arguments'])
Assert-GcWorkflowTrue (($geminiArguments -join "`n") -cmatch '--approval-mode\nplan') 'Gemini profile is controlled plan mode'
Assert-GcWorkflowTrue ([string]::Equals([string]$profiles['gemini-plan-review']['protocol'], 'json-stream-exit', [StringComparison]::Ordinal)) 'Gemini protocol remains isolated'

$workflowText = [IO.File]::ReadAllText([IO.Path]::Combine($repositoryRoot, 'docs', 'MULTI_AGENT_CLI_WORKFLOW.md'))
$agentsText = [IO.File]::ReadAllText([IO.Path]::Combine($repositoryRoot, 'AGENTS.md'))
Assert-GcWorkflowTrue ($workflowText -notmatch 'GC_(AUDIO|RISK|UX)_AGENT_CMD') 'obsolete arbitrary external command slots are absent'
Assert-GcWorkflowTrue ($agentsText -notmatch 'mock_(claude|gemini)') 'mock reviewers are not acceptance workflow instructions'
Assert-GcWorkflowTrue (($workflowText + $agentsText) -match 'Human Dispatch Authorization') 'human dispatch gate is documented'

$gitApplication = (Get-Command git.exe -CommandType Application | Select-Object -First 1).Source
$productionChanges = @(& $gitApplication -C $repositoryRoot diff --name-only -- 'outputs/**')
Assert-GcWorkflowTrue ($productionChanges.Count -eq 0) 'workflow repair does not modify production outputs'

[Console]::Out.WriteLine('PASS GC WORKFLOW ALIGNMENT CONTRACT')
[Console]::Out.WriteLine('PASS ALL GC WORKFLOW ALIGNMENT TESTS')
