Set-StrictMode -Version Latest

function Get-GcFixedContractPathsV2 {
    param([Parameter(Mandatory)][string]$RepositoryRoot)
    return [ordered]@{
        policy = [IO.Path]::Combine($RepositoryRoot, 'config', 'gc-scope-router-v2.policy.json')
        consumption = [IO.Path]::Combine($RepositoryRoot, 'config', 'gc-scope-router-v2.input-consumption.json')
        inputSchema = [IO.Path]::Combine($RepositoryRoot, 'schemas', 'gc-scope-router-v2.input.schema.json')
        outputSchema = [IO.Path]::Combine($RepositoryRoot, 'schemas', 'gc-scope-router-v2.output.schema.json')
        assessorSchema = [IO.Path]::Combine($RepositoryRoot, 'schemas', 'gc-scope-router-v2.assessor.schema.json')
        protectedWriteAuthorizationSchema = [IO.Path]::Combine($RepositoryRoot, 'schemas', 'gc-scope-router-v2.protected-write-authorization.schema.json')
    }
}

function Get-GcContractHashV2 {
    param([Parameter(Mandatory)]$PathMap)

    $stream = [IO.MemoryStream]::new()
    try {
        $keys = [Collections.Generic.List[string]]::new()
        foreach ($key in $PathMap.Keys) { $keys.Add([string]$key) }
        $keys.Sort([StringComparer]::Ordinal)
        foreach ($key in $keys) {
            $nameBytes = [Text.Encoding]::UTF8.GetBytes($key)
            $fileBytes = [IO.File]::ReadAllBytes([string]$PathMap[$key])
            $stream.Write($nameBytes, 0, $nameBytes.Length)
            $stream.WriteByte(0)
            $stream.Write($fileBytes, 0, $fileBytes.Length)
            $stream.WriteByte(0)
        }
        return Get-GcSha256HexV2 -Bytes $stream.ToArray()
    }
    catch {
        Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'contracts.files' -PolicyRuleId 'V2-CONTRACT-READ' -FailureCategory 'contract'
    }
    finally { $stream.Dispose() }
}

function Assert-GcPolicyContractV2 {
    param([Parameter(Mandatory)]$Policy)

    $allowed = @('policyVersion','inputSchemaVersion','outputSchemaVersion','assessorSchemaVersion','protectedWriteAuthorizationSchemaVersion','shadowMode','executionPermitted','autoRepairAllowed','recommendedWriter','reviewers','reviewerProfileBindings','classifications','operations','assessorUncertaintyMinimums','assessorFlags','forbiddenPaths','protectedNamespaces')
    Assert-GcClosedObjectV2 -Object $Policy -Allowed $allowed -Required $allowed -FieldId 'policy'
    $constants = [ordered]@{
        policyVersion = 'gc-scope-router-v2.policy/1'
        inputSchemaVersion = 'gc-scope-router-v2.input/1'
        outputSchemaVersion = 'gc-scope-router-v2.output/1'
        assessorSchemaVersion = 'gc-scope-router-v2.assessor/1'
        protectedWriteAuthorizationSchemaVersion = 'gc-scope-router-v2.protected-write-authorization/1'
        recommendedWriter = 'Codex Implementer'
    }
    foreach ($name in $constants.Keys) {
        if ($Policy[$name] -isnot [string] -or -not (Test-GcOrdinalEqualsV2 ([string]$Policy[$name]) ([string]$constants[$name]))) {
            Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId "policy.$name" -PolicyRuleId 'V2-POLICY-CONSTANT' -FailureCategory 'contract'
        }
    }
    if ($Policy['shadowMode'] -isnot [bool] -or -not $Policy['shadowMode'] -or
        $Policy['executionPermitted'] -isnot [bool] -or $Policy['executionPermitted'] -or
        $Policy['autoRepairAllowed'] -isnot [bool] -or $Policy['autoRepairAllowed']) {
        Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'policy.shadowFlags' -PolicyRuleId 'V2-POLICY-SHADOW' -FailureCategory 'contract'
    }

    $expectedClasses = [ordered]@{
        simple = @{ rank = 1; route = 'fast-path' }
        moderate = @{ rank = 2; route = 'planned-path' }
        complex = @{ rank = 3; route = 'architecture-path' }
        critical = @{ rank = 4; route = 'critical-controlled-path' }
        blocked = @{ rank = 5; route = 'blocked-path' }
    }
    $seen = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($entry in $Policy['classifications']) {
        Assert-GcClosedObjectV2 -Object $entry -Allowed @('id','rank','route') -Required @('id','rank','route') -FieldId 'policy.classification'
        $id = [string]$entry['id']
        if (-not (Test-GcObjectHasKeyV2 -Object $expectedClasses -Key $id) -or -not $seen.Add($id)) {
            Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'policy.classifications' -PolicyRuleId 'V2-POLICY-CLASSIFICATIONS' -FailureCategory 'contract'
        }
        $expected = $expectedClasses[$id]
        if ([int64]$entry['rank'] -ne [int]$expected.rank -or -not (Test-GcOrdinalEqualsV2 ([string]$entry['route']) ([string]$expected.route))) {
            Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'policy.classifications' -PolicyRuleId 'V2-POLICY-CLASSIFICATIONS' -FailureCategory 'contract'
        }
    }
    if ($seen.Count -ne $expectedClasses.Count) {
        Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'policy.classifications' -PolicyRuleId 'V2-POLICY-CLASSIFICATIONS' -FailureCategory 'contract'
    }

    $operationIds = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($entry in $Policy['operations']) {
        Assert-GcClosedObjectV2 -Object $entry -Allowed @('id','classification','reasonCode') -Required @('id','classification','reasonCode') -FieldId 'policy.operation'
        if (-not $operationIds.Add([string]$entry['id']) -or -not (Test-GcObjectHasKeyV2 -Object $expectedClasses -Key ([string]$entry['classification'])) -or ([string]$entry['reasonCode']) -cnotmatch '^[A-Z0-9_]+$') {
            Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'policy.operations' -PolicyRuleId 'V2-POLICY-OPERATIONS' -FailureCategory 'contract'
        }
    }
    Assert-GcStringArrayV2 -Value $Policy['reviewers'] -FieldId 'policy.reviewers' -MinimumCount 1
    if ($Policy['reviewerProfileBindings'] -isnot [Collections.IList] -or $Policy['reviewerProfileBindings'].Count -ne $Policy['reviewers'].Count) {
        Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'policy.reviewerProfileBindings' -PolicyRuleId 'V2-POLICY-REVIEWER-BINDINGS' -FailureCategory 'contract'
    }
    $expectedBindings = [ordered]@{
        'Security Reviewer' = 'claude-readonly'
        'Test-Integrity Reviewer' = 'claude-readonly'
        'Final External Reviewer' = 'gemini-plan-review'
    }
    $bindingRoles = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($binding in $Policy['reviewerProfileBindings']) {
        Assert-GcClosedObjectV2 -Object $binding -Allowed @('role','providerProfileId') -Required @('role','providerProfileId') -FieldId 'policy.reviewerProfileBinding'
        $role = [string]$binding['role']
        if (-not (Test-GcObjectHasKeyV2 -Object $expectedBindings -Key $role) -or -not $bindingRoles.Add($role) -or -not (Test-GcOrdinalEqualsV2 ([string]$binding['providerProfileId']) ([string]$expectedBindings[$role]))) {
            Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'policy.reviewerProfileBindings' -PolicyRuleId 'V2-POLICY-REVIEWER-BINDINGS' -FailureCategory 'contract'
        }
    }
    Assert-GcStringArrayV2 -Value $Policy['forbiddenPaths'] -FieldId 'policy.forbiddenPaths' -MinimumCount 1
    Assert-GcStringArrayV2 -Value $Policy['protectedNamespaces'] -FieldId 'policy.protectedNamespaces' -MinimumCount 1
    return $true
}

function Assert-GcInputConsumptionContractV2 {
    param([Parameter(Mandatory)]$InputSchema, [Parameter(Mandatory)]$AssessorSchema, [Parameter(Mandatory)]$Manifest)

    $expected = [ordered]@{
        '/schemaVersion' = @('CONSUMED_IN_IDENTITY','Assert-GcInputSchemaV2')
        '/policyVersion' = @('CONSUMED_IN_IDENTITY','Assert-GcInputSchemaV2')
        '/taskId' = @('CONSUMED_IN_IDENTITY','Assert-GcOrdinalIdentityV2')
        '/repositoryRoot' = @('CONSUMED_IN_IDENTITY','Assert-GcOrdinalIdentityV2')
        '/expectedBranch' = @('CONSUMED_IN_IDENTITY','Assert-GcOrdinalIdentityV2')
        '/expectedHead' = @('CONSUMED_IN_IDENTITY','Assert-GcOrdinalIdentityV2')
        '/requestedOperations' = @('CONSUMED_IN_CLASSIFICATION','Get-GcDeterministicRiskV2')
        '/requestedReadPaths' = @('CONSUMED_IN_PATH_POLICY','Resolve-GcPathPolicyV2')
        '/requestedWritePaths' = @('CONSUMED_IN_PATH_POLICY','Resolve-GcPathPolicyV2')
        '/assessorResult' = @('CONSUMED_IN_CLASSIFICATION','Merge-GcAssessorRiskV2')
        '/assessorResult/schemaVersion' = @('CONSUMED_IN_CLASSIFICATION','Merge-GcAssessorRiskV2')
        '/assessorResult/classification' = @('CONSUMED_IN_CLASSIFICATION','Merge-GcAssessorRiskV2')
        '/assessorResult/uncertainty' = @('CONSUMED_IN_CLASSIFICATION','Merge-GcAssessorRiskV2')
        '/assessorResult/flags' = @('CONSUMED_IN_CLASSIFICATION','Merge-GcAssessorRiskV2')
    }
    Assert-GcClosedObjectV2 -Object $Manifest -Allowed @('contractVersion','schemaVersion','entries','knownRejectedProperties') -Required @('contractVersion','schemaVersion','entries','knownRejectedProperties') -FieldId 'consumptionManifest'
    if (-not (Test-GcOrdinalEqualsV2 ([string]$Manifest['contractVersion']) 'gc-scope-router-v2.consumption/1') -or
        -not (Test-GcOrdinalEqualsV2 ([string]$Manifest['schemaVersion']) 'gc-scope-router-v2.input/1')) {
        Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'consumptionManifest.version' -PolicyRuleId 'V2-CONSUMPTION-VERSION' -FailureCategory 'contract'
    }

    $actual = [Collections.Generic.Dictionary[string,object]]::new([StringComparer]::Ordinal)
    foreach ($entry in $Manifest['entries']) {
        Assert-GcClosedObjectV2 -Object $entry -Allowed @('pointer','disposition','consumer') -Required @('pointer','disposition','consumer') -FieldId 'consumptionManifest.entry'
        $pointer = [string]$entry['pointer']
        if ($actual.ContainsKey($pointer)) {
            Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'consumptionManifest.pointer' -PolicyRuleId 'V2-CONSUMPTION-UNIQUE' -FailureCategory 'contract'
        }
        $actual.Add($pointer, $entry)
    }
    if ($actual.Count -ne $expected.Count) {
        Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'consumptionManifest.entries' -PolicyRuleId 'V2-CONSUMPTION-COMPLETE' -FailureCategory 'contract'
    }
    foreach ($pointer in $expected.Keys) {
        if (-not $actual.ContainsKey($pointer)) {
            Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'consumptionManifest.entries' -PolicyRuleId 'V2-CONSUMPTION-COMPLETE' -FailureCategory 'contract'
        }
        $entry = $actual[$pointer]
        if (-not (Test-GcOrdinalEqualsV2 ([string]$entry['disposition']) ([string]$expected[$pointer][0])) -or
            -not (Test-GcOrdinalEqualsV2 ([string]$entry['consumer']) ([string]$expected[$pointer][1]))) {
            Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'consumptionManifest.disposition' -PolicyRuleId 'V2-CONSUMPTION-DISPOSITION' -FailureCategory 'contract'
        }
    }

    $schemaTop = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($name in $InputSchema['properties'].Keys) { [void]$schemaTop.Add('/' + [string]$name) }
    $expectedTop = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($pointer in $expected.Keys) { if (($pointer.Substring(1)).IndexOf([char]'/') -lt 0) { [void]$expectedTop.Add($pointer) } }
    if (-not $schemaTop.SetEquals($expectedTop)) {
        Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'inputSchema.properties' -PolicyRuleId 'V2-CONSUMPTION-SCHEMA-PARITY' -FailureCategory 'contract'
    }
    $schemaAssessor = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($name in $AssessorSchema['properties'].Keys) { [void]$schemaAssessor.Add('/assessorResult/' + [string]$name) }
    $expectedAssessor = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($pointer in $expected.Keys) { if ($pointer.StartsWith('/assessorResult/', [StringComparison]::Ordinal)) { [void]$expectedAssessor.Add($pointer) } }
    if (-not $schemaAssessor.SetEquals($expectedAssessor)) {
        Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'assessorSchema.properties' -PolicyRuleId 'V2-CONSUMPTION-SCHEMA-PARITY' -FailureCategory 'contract'
    }
    return $true
}

function Get-GcPolicyV2 {
    param([Parameter(Mandatory)][string]$RepositoryRoot)

    $paths = Get-GcFixedContractPathsV2 -RepositoryRoot $RepositoryRoot
    $objects = [ordered]@{}
    foreach ($key in $paths.Keys) {
        $bytes = Read-GcStrictUtf8V2 -LiteralPath ([string]$paths[$key])
        $objects[$key] = ConvertFrom-GcStrictJsonV2 -Bytes $bytes
    }
    Assert-GcPolicyContractV2 -Policy $objects['policy'] | Out-Null
    Assert-GcInputConsumptionContractV2 -InputSchema $objects['inputSchema'] -AssessorSchema $objects['assessorSchema'] -Manifest $objects['consumption'] | Out-Null
    $policyBytes = [IO.File]::ReadAllBytes([string]$paths['policy'])
    return [ordered]@{
        policy = $objects['policy']
        inputSchema = $objects['inputSchema']
        outputSchema = $objects['outputSchema']
        assessorSchema = $objects['assessorSchema']
        protectedWriteAuthorizationSchema = $objects['protectedWriteAuthorizationSchema']
        consumption = $objects['consumption']
        policySha256 = Get-GcSha256HexV2 -Bytes $policyBytes
        contractsSha256 = Get-GcContractHashV2 -PathMap $paths
    }
}

function Get-GcClassificationEntryV2 {
    param([Parameter(Mandatory)]$Policy, [Parameter(Mandatory)][string]$Classification)
    foreach ($entry in $Policy['classifications']) {
        if (Test-GcOrdinalEqualsV2 ([string]$entry['id']) $Classification) { return $entry }
    }
    Throw-GcFailureV2 -ReasonCode 'CONSUMPTION_CONTRACT_INVALID' -FieldId 'policy.classification' -PolicyRuleId 'V2-POLICY-CLASSIFICATION-LOOKUP' -FailureCategory 'contract'
}

function Get-GcDeterministicRiskV2 {
    param(
        [Parameter(Mandatory)]$InputObject,
        [Parameter(Mandatory)]$Policy,
        [Parameter(Mandatory)][AllowEmptyCollection()][string[]]$DirtyConflicts,
        [AllowEmptyCollection()][string[]]$PathPolicyBlockReasons = @(),
        [AllowEmptyCollection()][string[]]$PathPolicyRoutingReasons = @()
    )

    $maximum = Get-GcClassificationEntryV2 -Policy $Policy -Classification 'simple'
    $reasons = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($operationId in $InputObject['requestedOperations']) {
        $operation = $null
        foreach ($entry in $Policy['operations']) {
            if (Test-GcOrdinalEqualsV2 ([string]$entry['id']) ([string]$operationId)) { $operation = $entry; break }
        }
        if ($null -eq $operation) {
            Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId 'requestedOperations' -PolicyRuleId 'V2-OPERATION-CLOSED' -FailureCategory 'classification'
        }
        [void]$reasons.Add([string]$operation['reasonCode'])
        $candidate = Get-GcClassificationEntryV2 -Policy $Policy -Classification ([string]$operation['classification'])
        if ([int64]$candidate['rank'] -gt [int64]$maximum['rank']) { $maximum = $candidate }
    }
    if ($DirtyConflicts.Count -gt 0) {
        $maximum = Get-GcClassificationEntryV2 -Policy $Policy -Classification 'blocked'
        [void]$reasons.Add('GIT_DIRTY_SCOPE_OVERLAP')
    }
    if ($PathPolicyBlockReasons.Count -gt 0) {
        $maximum = Get-GcClassificationEntryV2 -Policy $Policy -Classification 'blocked'
        foreach ($reason in $PathPolicyBlockReasons) { [void]$reasons.Add([string]$reason) }
    }
    foreach ($reason in $PathPolicyRoutingReasons) { [void]$reasons.Add([string]$reason) }
    $reasonList = [Collections.Generic.List[string]]::new(); foreach ($reason in $reasons) { $reasonList.Add($reason) }; $reasonList.Sort([StringComparer]::Ordinal)
    return [ordered]@{ classification = [string]$maximum['id']; rank = [int64]$maximum['rank']; route = [string]$maximum['route']; reasonCodes = @($reasonList) }
}

function Merge-GcAssessorRiskV2 {
    param([Parameter(Mandatory)]$DeterministicRisk, [AllowNull()]$Assessor, [Parameter(Mandatory)]$Policy)

    $maximum = Get-GcClassificationEntryV2 -Policy $Policy -Classification ([string]$DeterministicRisk['classification'])
    $reasons = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($reason in $DeterministicRisk['reasonCodes']) { [void]$reasons.Add([string]$reason) }
    if ($null -ne $Assessor) {
        $candidates = [Collections.Generic.List[object]]::new()
        $candidates.Add((Get-GcClassificationEntryV2 -Policy $Policy -Classification ([string]$Assessor['classification'])))
        foreach ($entry in $Policy['assessorUncertaintyMinimums']) {
            if (Test-GcOrdinalEqualsV2 ([string]$entry['id']) ([string]$Assessor['uncertainty'])) {
                $candidates.Add((Get-GcClassificationEntryV2 -Policy $Policy -Classification ([string]$entry['classification'])))
            }
        }
        foreach ($flag in $Assessor['flags']) {
            foreach ($entry in $Policy['assessorFlags']) {
                if (Test-GcOrdinalEqualsV2 ([string]$entry['id']) ([string]$flag)) {
                    $candidates.Add((Get-GcClassificationEntryV2 -Policy $Policy -Classification ([string]$entry['classification'])))
                }
            }
        }
        foreach ($candidate in $candidates) {
            if ([int64]$candidate['rank'] -gt [int64]$maximum['rank']) { $maximum = $candidate }
        }
        [void]$reasons.Add('ASSESSOR_DATA_CONSUMED')
    }
    $reasonList = [Collections.Generic.List[string]]::new(); foreach ($reason in $reasons) { $reasonList.Add($reason) }; $reasonList.Sort([StringComparer]::Ordinal)
    return [ordered]@{ classification = [string]$maximum['id']; rank = [int64]$maximum['rank']; route = [string]$maximum['route']; reasonCodes = @($reasonList) }
}

function Get-GcRouteV2 {
    param([Parameter(Mandatory)][string]$Classification, [Parameter(Mandatory)]$Policy)
    return [string](Get-GcClassificationEntryV2 -Policy $Policy -Classification $Classification)['route']
}
