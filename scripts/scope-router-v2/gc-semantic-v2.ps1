Set-StrictMode -Version Latest

function Assert-GcOutputClosedObjectV2 {
    param([Parameter(Mandatory)]$Object, [Parameter(Mandatory)][string[]]$Allowed, [Parameter(Mandatory)][string[]]$Required, [Parameter(Mandatory)][string]$FieldId)
    if ($Object -isnot [Collections.IDictionary]) {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId $FieldId -PolicyRuleId 'V2-OUTPUT-OBJECT' -FailureCategory 'output-schema'
    }
    $allowedSet = [Collections.Generic.HashSet[string]]::new($Allowed, [StringComparer]::Ordinal)
    foreach ($key in $Object.Keys) {
        if ($key -isnot [string] -or -not $allowedSet.Contains([string]$key)) {
            Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId "$FieldId.unknownProperty" -PolicyRuleId 'V2-OUTPUT-CLOSED' -FailureCategory 'output-schema'
        }
    }
    foreach ($name in $Required) {
        if (-not (Test-GcObjectHasKeyV2 -Object $Object -Key $name)) {
            Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId "$FieldId.requiredProperty" -PolicyRuleId 'V2-OUTPUT-REQUIRED' -FailureCategory 'output-schema'
        }
    }
}

function Assert-GcOutputStringArrayV2 {
    param([Parameter(Mandatory)][AllowEmptyCollection()]$Value, [Parameter(Mandatory)][string]$FieldId)
    if ($Value -is [string] -or $Value -isnot [Collections.IList]) {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId $FieldId -PolicyRuleId 'V2-OUTPUT-ARRAY' -FailureCategory 'output-schema'
    }
    $seen = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($item in $Value) {
        if ($item -isnot [string] -or -not $seen.Add([string]$item)) {
            Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId $FieldId -PolicyRuleId 'V2-OUTPUT-STRING-ARRAY' -FailureCategory 'output-schema'
        }
    }
}

function Assert-GcOutputSchemaV2 {
    param([Parameter(Mandatory)]$Evidence, [Parameter(Mandatory)]$Policy)

    if ($Evidence -isnot [Collections.IDictionary] -or -not (Test-GcObjectHasKeyV2 -Object $Evidence -Key 'artifactType') -or $Evidence['artifactType'] -isnot [string]) {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId 'output.artifactType' -PolicyRuleId 'V2-OUTPUT-ARTIFACT-TYPE' -FailureCategory 'output-schema'
    }
    $common = @('artifactType','schemaVersion','policyVersion','executionPermitted','autoRepairAllowed','inputByteLength','inputSha256','decisionContentSha256')
    if (Test-GcOrdinalEqualsV2 ([string]$Evidence['artifactType']) 'decision') {
        $specific = @('taskId','repositoryIdentity','classification','route','rank','reasonCodes','recommendedWriter','reviewers','allowedReadPaths','allowedWritePaths','forbiddenPaths','protectedNamespaces','dirtyState','policySha256','contractsSha256')
    }
    elseif (Test-GcOrdinalEqualsV2 ([string]$Evidence['artifactType']) 'rejection') {
        $specific = @('reasonCode','fieldId','arrayIndex','policyRuleId','failureCategory')
    }
    else {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId 'output.artifactType' -PolicyRuleId 'V2-OUTPUT-ARTIFACT-TYPE' -FailureCategory 'output-schema'
    }
    $all = @($common + $specific)
    Assert-GcOutputClosedObjectV2 -Object $Evidence -Allowed $all -Required $all -FieldId 'output'

    if ($Evidence['schemaVersion'] -isnot [string] -or -not (Test-GcOrdinalEqualsV2 ([string]$Evidence['schemaVersion']) ([string]$Policy['outputSchemaVersion'])) -or
        $Evidence['policyVersion'] -isnot [string] -or -not (Test-GcOrdinalEqualsV2 ([string]$Evidence['policyVersion']) ([string]$Policy['policyVersion']))) {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId 'output.version' -PolicyRuleId 'V2-OUTPUT-VERSION' -FailureCategory 'output-schema'
    }
    if ($Evidence['executionPermitted'] -isnot [bool] -or $Evidence['executionPermitted'] -or
        $Evidence['autoRepairAllowed'] -isnot [bool] -or $Evidence['autoRepairAllowed']) {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId 'output.shadowFlags' -PolicyRuleId 'V2-OUTPUT-SHADOW' -FailureCategory 'output-schema'
    }
    if ($Evidence['inputByteLength'] -isnot [int64] -and $Evidence['inputByteLength'] -isnot [int32]) {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId 'output.inputByteLength' -PolicyRuleId 'V2-OUTPUT-INTEGER' -FailureCategory 'output-schema'
    }
    if ([int64]$Evidence['inputByteLength'] -lt 0) {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId 'output.inputByteLength' -PolicyRuleId 'V2-OUTPUT-INTEGER' -FailureCategory 'output-schema'
    }
    foreach ($hashName in @('inputSha256','decisionContentSha256')) {
        if ($Evidence[$hashName] -isnot [string] -or ([string]$Evidence[$hashName]) -cnotmatch '^[0-9a-f]{64}$') {
            Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId "output.$hashName" -PolicyRuleId 'V2-OUTPUT-HASH' -FailureCategory 'output-schema'
        }
    }
    return $true
}

function Get-GcEvidenceContentHashV2 {
    param([Parameter(Mandatory)]$Evidence)
    $content = [ordered]@{}
    foreach ($key in $Evidence.Keys) {
        if (-not (Test-GcOrdinalEqualsV2 ([string]$key) 'decisionContentSha256')) { $content[$key] = $Evidence[$key] }
    }
    $bytes = [Text.Encoding]::UTF8.GetBytes((ConvertTo-GcCanonicalJsonV2 -Value $content))
    return Get-GcSha256HexV2 -Bytes $bytes
}

function Set-GcEvidenceContentHashV2 {
    param([Parameter(Mandatory)]$Evidence)
    $Evidence['decisionContentSha256'] = Get-GcEvidenceContentHashV2 -Evidence $Evidence
    return $Evidence
}

function Assert-GcEvidenceHashV2 {
    param([Parameter(Mandatory)]$Evidence)
    $actual = Get-GcEvidenceContentHashV2 -Evidence $Evidence
    if (-not (Test-GcOrdinalEqualsV2 $actual ([string]$Evidence['decisionContentSha256']))) {
        Throw-GcFailureV2 -ReasonCode 'EVIDENCE_HASH_INVALID' -FieldId 'output.decisionContentSha256' -PolicyRuleId 'V2-EVIDENCE-HASH' -FailureCategory 'evidence'
    }
    return $true
}

function Assert-GcDecisionSemanticV2 {
    param([Parameter(Mandatory)]$Evidence, [Parameter(Mandatory)]$Policy)

    $entry = Get-GcClassificationEntryV2 -Policy $Policy -Classification ([string]$Evidence['classification'])
    if ([int64]$Evidence['rank'] -ne [int64]$entry['rank'] -or -not (Test-GcOrdinalEqualsV2 ([string]$Evidence['route']) ([string]$entry['route']))) {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SEMANTIC_INVALID' -FieldId 'output.route' -PolicyRuleId 'V2-SEMANTIC-ROUTE' -FailureCategory 'output-semantic'
    }
    $isBlocked = Test-GcOrdinalEqualsV2 ([string]$Evidence['classification']) 'blocked'
    if ($isBlocked) {
        if ($null -ne $Evidence['recommendedWriter']) {
            Throw-GcFailureV2 -ReasonCode 'OUTPUT_SEMANTIC_INVALID' -FieldId 'output.recommendedWriter' -PolicyRuleId 'V2-SEMANTIC-WRITER' -FailureCategory 'output-semantic'
        }
    }
    elseif ($Evidence['recommendedWriter'] -isnot [string] -or -not (Test-GcOrdinalEqualsV2 ([string]$Evidence['recommendedWriter']) ([string]$Policy['recommendedWriter']))) {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SEMANTIC_INVALID' -FieldId 'output.recommendedWriter' -PolicyRuleId 'V2-SEMANTIC-WRITER' -FailureCategory 'output-semantic'
    }

    if ($Evidence['reviewers'] -is [string] -or $Evidence['reviewers'] -isnot [Collections.IList] -or $Evidence['reviewers'].Count -ne $Policy['reviewers'].Count) {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SEMANTIC_INVALID' -FieldId 'output.reviewers' -PolicyRuleId 'V2-SEMANTIC-REVIEWERS' -FailureCategory 'output-semantic'
    }
    $actualReviewers = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($reviewer in $Evidence['reviewers']) {
        Assert-GcOutputClosedObjectV2 -Object $reviewer -Allowed @('role','readOnly') -Required @('role','readOnly') -FieldId 'output.reviewer'
        if ($reviewer['role'] -isnot [string] -or $reviewer['readOnly'] -isnot [bool] -or -not $reviewer['readOnly'] -or -not $actualReviewers.Add([string]$reviewer['role'])) {
            Throw-GcFailureV2 -ReasonCode 'OUTPUT_SEMANTIC_INVALID' -FieldId 'output.reviewers' -PolicyRuleId 'V2-SEMANTIC-REVIEWERS' -FailureCategory 'output-semantic'
        }
    }
    $expectedReviewers = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($role in $Policy['reviewers']) { [void]$expectedReviewers.Add([string]$role) }
    if (-not $actualReviewers.SetEquals($expectedReviewers)) {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SEMANTIC_INVALID' -FieldId 'output.reviewers' -PolicyRuleId 'V2-SEMANTIC-REVIEWERS' -FailureCategory 'output-semantic'
    }

    foreach ($field in @('reasonCodes','allowedReadPaths','allowedWritePaths','forbiddenPaths','protectedNamespaces')) {
        Assert-GcOutputStringArrayV2 -Value $Evidence[$field] -FieldId "output.$field"
    }
    $readScopes = @(ConvertTo-GcPathScopeListV2 -Values $Evidence['allowedReadPaths'] -FieldId 'output.allowedReadPaths' -RepositoryRoot $null)
    $writeScopes = @(ConvertTo-GcPathScopeListV2 -Values $Evidence['allowedWritePaths'] -FieldId 'output.allowedWritePaths' -RepositoryRoot $null)
    $forbiddenScopes = @(ConvertTo-GcPathScopeListV2 -Values $Evidence['forbiddenPaths'] -FieldId 'output.forbiddenPaths' -RepositoryRoot $null)
    $protectedScopes = @(ConvertTo-GcPathScopeListV2 -Values $Evidence['protectedNamespaces'] -FieldId 'output.protectedNamespaces' -RepositoryRoot $null)
    Assert-GcPathPartitionsV2 -AllowedReadScopes $readScopes -AllowedWriteScopes $writeScopes -ForbiddenScopes $forbiddenScopes -ProtectedScopes $protectedScopes | Out-Null

    Assert-GcOutputClosedObjectV2 -Object $Evidence['repositoryIdentity'] -Allowed @('repositoryRoot','branch','head') -Required @('repositoryRoot','branch','head') -FieldId 'output.repositoryIdentity'
    if ($Evidence['taskId'] -isnot [string] -or ([string]$Evidence['taskId']) -cnotmatch '^[A-Za-z0-9][A-Za-z0-9._:/-]{0,127}$' -or
        $Evidence['repositoryIdentity']['head'] -isnot [string] -or ([string]$Evidence['repositoryIdentity']['head']) -cnotmatch '^[0-9a-f]{40}$') {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SEMANTIC_INVALID' -FieldId 'output.identity' -PolicyRuleId 'V2-SEMANTIC-IDENTITY' -FailureCategory 'output-semantic'
    }
    foreach ($name in @('policySha256','contractsSha256')) {
        if ($Evidence[$name] -isnot [string] -or ([string]$Evidence[$name]) -cnotmatch '^[0-9a-f]{64}$') {
            Throw-GcFailureV2 -ReasonCode 'OUTPUT_SEMANTIC_INVALID' -FieldId "output.$name" -PolicyRuleId 'V2-SEMANTIC-HASH' -FailureCategory 'output-semantic'
        }
    }
    Assert-GcOutputClosedObjectV2 -Object $Evidence['dirtyState'] -Allowed @('modified','staged','untracked','deleted','conflicted','renameSource','renameDestination') -Required @('modified','staged','untracked','deleted','conflicted','renameSource','renameDestination') -FieldId 'output.dirtyState'
    foreach ($name in $Evidence['dirtyState'].Keys) { Assert-GcOutputStringArrayV2 -Value $Evidence['dirtyState'][$name] -FieldId "output.dirtyState.$name" }
    return $true
}

function Assert-GcRejectionSemanticV2 {
    param([Parameter(Mandatory)]$Evidence)

    $reasonCodes = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($reason in @('JSON_DOCUMENT_INVALID','INPUT_SCHEMA_INVALID','INPUT_UNKNOWN_PROPERTY','INPUT_REQUIRED_PROPERTY_MISSING','INPUT_VALUE_INVALID','INPUT_DUPLICATE_ITEM','CONSUMPTION_CONTRACT_INVALID','IDENTITY_INVALID','IDENTITY_MISMATCH','PATH_SCOPE_INVALID','PATH_ROOT_SCOPE_BLOCKED','PATH_POLICY_OVERLAP','PATH_REPARSE_ESCAPE','GIT_INVOCATION_FAILED','GIT_STATUS_INVALID','GIT_DIRTY_OVERLAP','OUTPUT_SCHEMA_INVALID','OUTPUT_SEMANTIC_INVALID','EVIDENCE_HASH_INVALID','EVIDENCE_WRITE_FAILED','EVIDENCE_CHILD_INVALID')) { [void]$reasonCodes.Add($reason) }
    $fieldIds = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($field in @('input.document','input.object','input.unknownProperty','input.requiredProperty','schemaVersion','policyVersion','taskId','repositoryRoot','expectedBranch','expectedHead','requestedOperations','requestedReadPaths','requestedWritePaths','assessorResult','assessorResult.unknownProperty','assessorResult.requiredProperty','assessorResult.schemaVersion','assessorResult.classification','assessorResult.uncertainty','assessorResult.flags','git.application','git.exitCode','git.status','git.statusRecord','git.statusCode','git.statusPath','git.renameSource','actual.repositoryRoot','actual.branch','actual.head','requestedPath','path.scope','pathPartitions','child.start','child.timeout','child.stream','child.failure','contracts.files','consumptionManifest','consumptionManifest.version','consumptionManifest.entry','consumptionManifest.pointer','consumptionManifest.entries','consumptionManifest.disposition','inputSchema.properties','assessorSchema.properties','policy','policy.shadowFlags','policy.classifications','policy.operations','policy.reviewers','policy.forbiddenPaths','policy.protectedNamespaces','policy.classification','internal.failure','output.artifactType','output.decisionContentSha256')) { [void]$fieldIds.Add($field) }
    if ($Evidence['reasonCode'] -isnot [string] -or -not $reasonCodes.Contains([string]$Evidence['reasonCode']) -or
        $Evidence['fieldId'] -isnot [string] -or -not $fieldIds.Contains([string]$Evidence['fieldId']) -or
        $Evidence['policyRuleId'] -isnot [string] -or ([string]$Evidence['policyRuleId']) -cnotmatch '^[A-Z0-9-]+$' -or
        $Evidence['failureCategory'] -isnot [string] -or ([string]$Evidence['failureCategory']) -cnotmatch '^[a-z][a-z-]*$') {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SEMANTIC_INVALID' -FieldId 'output.rejectionMetadata' -PolicyRuleId 'V2-SEMANTIC-REJECTION-CLOSED' -FailureCategory 'output-semantic'
    }
    if ($null -ne $Evidence['arrayIndex'] -and ($Evidence['arrayIndex'] -isnot [int64] -and $Evidence['arrayIndex'] -isnot [int32])) {
        Throw-GcFailureV2 -ReasonCode 'OUTPUT_SEMANTIC_INVALID' -FieldId 'output.arrayIndex' -PolicyRuleId 'V2-SEMANTIC-REJECTION-INDEX' -FailureCategory 'output-semantic'
    }
    return $true
}

function Assert-GcEvidenceV2 {
    param([Parameter(Mandatory)]$Evidence, [Parameter(Mandatory)]$Policy, [AllowNull()][AllowEmptyString()][string]$ExpectedTaskId)

    Assert-GcOutputSchemaV2 -Evidence $Evidence -Policy $Policy | Out-Null
    Assert-GcEvidenceHashV2 -Evidence $Evidence | Out-Null
    if (Test-GcOrdinalEqualsV2 ([string]$Evidence['artifactType']) 'decision') {
        Assert-GcDecisionSemanticV2 -Evidence $Evidence -Policy $Policy | Out-Null
        if (-not [string]::IsNullOrEmpty($ExpectedTaskId) -and -not (Test-GcOrdinalEqualsV2 ([string]$Evidence['taskId']) $ExpectedTaskId)) {
            Throw-GcFailureV2 -ReasonCode 'OUTPUT_SEMANTIC_INVALID' -FieldId 'taskId' -PolicyRuleId 'V2-EVIDENCE-TASK-ORDINAL' -FailureCategory 'output-semantic'
        }
    }
    else { Assert-GcRejectionSemanticV2 -Evidence $Evidence | Out-Null }
    return $true
}
