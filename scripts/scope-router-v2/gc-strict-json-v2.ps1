Set-StrictMode -Version Latest

if ($null -eq ('GcScopeRouterV2.StrictJson' -as [type])) {
    Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Text.Json;

namespace GcScopeRouterV2
{
    public static class StrictJson
    {
        public static string Quote(string value)
        {
            return JsonSerializer.Serialize(value);
        }

        public static object Parse(byte[] utf8)
        {
            if (utf8 == null) throw new FormatException("GC_JSON_NULL");
            if (utf8.Length >= 3 && utf8[0] == 0xEF && utf8[1] == 0xBB && utf8[2] == 0xBF)
                throw new FormatException("GC_JSON_BOM");

            var options = new JsonDocumentOptions
            {
                AllowTrailingCommas = false,
                CommentHandling = JsonCommentHandling.Disallow,
                MaxDepth = 64
            };

            using (var document = JsonDocument.Parse(new ReadOnlyMemory<byte>(utf8), options))
            {
                return ConvertElement(document.RootElement);
            }
        }

        private static object ConvertElement(JsonElement element)
        {
            switch (element.ValueKind)
            {
                case JsonValueKind.Object:
                    var map = new Dictionary<string, object>(StringComparer.Ordinal);
                    foreach (var property in element.EnumerateObject())
                    {
                        ValidateUtf16(property.Name);
                        if (map.ContainsKey(property.Name))
                            throw new FormatException("GC_JSON_DUPLICATE_KEY");
                        map.Add(property.Name, ConvertElement(property.Value));
                    }
                    return map;

                case JsonValueKind.Array:
                    var list = new List<object>();
                    foreach (var item in element.EnumerateArray())
                        list.Add(ConvertElement(item));
                    return list;

                case JsonValueKind.String:
                    var value = element.GetString();
                    ValidateUtf16(value);
                    return value;

                case JsonValueKind.Number:
                    long integer;
                    if (element.TryGetInt64(out integer)) return integer;
                    decimal exact;
                    if (element.TryGetDecimal(out exact)) return exact;
                    double floating = element.GetDouble();
                    if (Double.IsNaN(floating) || Double.IsInfinity(floating))
                        throw new FormatException("GC_JSON_NONFINITE");
                    return floating;

                case JsonValueKind.True: return true;
                case JsonValueKind.False: return false;
                case JsonValueKind.Null: return null;
                default: throw new FormatException("GC_JSON_VALUE_KIND");
            }
        }

        private static void ValidateUtf16(string value)
        {
            if (value == null) return;
            for (int i = 0; i < value.Length; i++)
            {
                char c = value[i];
                if (Char.IsHighSurrogate(c))
                {
                    if (i + 1 >= value.Length || !Char.IsLowSurrogate(value[i + 1]))
                        throw new FormatException("GC_JSON_UNPAIRED_SURROGATE");
                    i++;
                }
                else if (Char.IsLowSurrogate(c))
                {
                    throw new FormatException("GC_JSON_UNPAIRED_SURROGATE");
                }
            }
        }
    }
}
'@
}

function Throw-GcFailureV2 {
    param(
        [Parameter(Mandatory)][string]$ReasonCode,
        [Parameter(Mandatory)][string]$FieldId,
        [AllowNull()][Nullable[int]]$ArrayIndex,
        [Parameter(Mandatory)][string]$PolicyRuleId,
        [Parameter(Mandatory)][string]$FailureCategory
    )

    $indexText = if ($null -eq $ArrayIndex) { '-' } else { ([int]$ArrayIndex).ToString([Globalization.CultureInfo]::InvariantCulture) }
    throw [InvalidOperationException]::new("$ReasonCode|$FieldId|$indexText|$PolicyRuleId|$FailureCategory")
}

function ConvertFrom-GcFailureRecordV2 {
    param([AllowNull()][Exception]$Exception)

    $knownReasons = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    @(
        'JSON_DOCUMENT_INVALID', 'INPUT_SCHEMA_INVALID', 'INPUT_UNKNOWN_PROPERTY',
        'INPUT_REQUIRED_PROPERTY_MISSING', 'INPUT_VALUE_INVALID', 'INPUT_DUPLICATE_ITEM',
        'CONSUMPTION_CONTRACT_INVALID', 'IDENTITY_INVALID', 'IDENTITY_MISMATCH',
        'PATH_SCOPE_INVALID', 'PATH_ROOT_SCOPE_BLOCKED', 'PATH_POLICY_OVERLAP',
        'PATH_REPARSE_ESCAPE', 'GIT_INVOCATION_FAILED', 'GIT_STATUS_INVALID',
        'GIT_DIRTY_OVERLAP', 'OUTPUT_SCHEMA_INVALID', 'OUTPUT_SEMANTIC_INVALID',
        'EVIDENCE_HASH_INVALID', 'EVIDENCE_WRITE_FAILED', 'EVIDENCE_CHILD_INVALID',
        'PROTECTED_WRITE_AUTHORIZATION_INVALID'
    ) | ForEach-Object { [void]$knownReasons.Add($_) }

    if ($null -ne $Exception) {
        $parts = $Exception.Message -split '\|', 5
        if ($parts.Count -eq 5 -and $knownReasons.Contains($parts[0])) {
            $parsedIndex = $null
            if (-not [StringComparer]::Ordinal.Equals($parts[2], '-')) {
                $candidate = 0
                if ([int]::TryParse($parts[2], [Globalization.NumberStyles]::None, [Globalization.CultureInfo]::InvariantCulture, [ref]$candidate)) {
                    $parsedIndex = [Nullable[int]]$candidate
                }
            }
            return [ordered]@{
                reasonCode = $parts[0]
                fieldId = $parts[1]
                arrayIndex = $parsedIndex
                policyRuleId = $parts[3]
                failureCategory = $parts[4]
            }
        }
    }

    return [ordered]@{
        reasonCode = 'EVIDENCE_WRITE_FAILED'
        fieldId = 'internal.failure'
        arrayIndex = $null
        policyRuleId = 'V2-FAIL-CLOSED'
        failureCategory = 'internal'
    }
}

function Read-GcStrictUtf8V2 {
    param([Parameter(Mandatory)][string]$LiteralPath)

    try {
        $bytes = [IO.File]::ReadAllBytes($LiteralPath)
    }
    catch {
        Throw-GcFailureV2 -ReasonCode 'JSON_DOCUMENT_INVALID' -FieldId 'input.document' -PolicyRuleId 'V2-JSON-READ' -FailureCategory 'json'
    }

    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        Throw-GcFailureV2 -ReasonCode 'JSON_DOCUMENT_INVALID' -FieldId 'input.document' -PolicyRuleId 'V2-JSON-NO-BOM' -FailureCategory 'json'
    }

    return [byte[]]$bytes
}

function ConvertFrom-GcStrictJsonV2 {
    param([Parameter(Mandatory)][AllowEmptyCollection()][byte[]]$Bytes)

    try {
        return [GcScopeRouterV2.StrictJson]::Parse($Bytes)
    }
    catch {
        Throw-GcFailureV2 -ReasonCode 'JSON_DOCUMENT_INVALID' -FieldId 'input.document' -PolicyRuleId 'V2-JSON-STRICT' -FailureCategory 'json'
    }
}

function Test-GcOrdinalEqualsV2 {
    param([AllowNull()][string]$Left, [AllowNull()][string]$Right)
    return [StringComparer]::Ordinal.Equals($Left, $Right)
}

function Get-GcSha256HexV2 {
    param([Parameter(Mandatory)][AllowEmptyCollection()][byte[]]$Bytes)

    $sha = [Security.Cryptography.SHA256]::Create()
    try {
        $hash = $sha.ComputeHash($Bytes)
        return ([Convert]::ToHexString($hash)).ToLowerInvariant()
    }
    finally {
        $sha.Dispose()
    }
}

function ConvertTo-GcCanonicalJsonValueV2 {
    param([AllowNull()]$Value)

    if ($null -eq $Value) { return 'null' }
    if ($Value -is [string]) { return [GcScopeRouterV2.StrictJson]::Quote([string]$Value) }
    if ($Value -is [bool]) { return $(if ($Value) { 'true' } else { 'false' }) }

    if ($Value -is [byte] -or $Value -is [sbyte] -or $Value -is [int16] -or $Value -is [uint16] -or
        $Value -is [int32] -or $Value -is [uint32] -or $Value -is [int64] -or $Value -is [uint64] -or
        $Value -is [decimal]) {
        return ([IFormattable]$Value).ToString($null, [Globalization.CultureInfo]::InvariantCulture)
    }

    if ($Value -is [single] -or $Value -is [double]) {
        $number = [double]$Value
        if ([double]::IsNaN($number) -or [double]::IsInfinity($number)) {
            Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId 'output.number' -PolicyRuleId 'V2-JSON-NONFINITE' -FailureCategory 'output-schema'
        }
        return $number.ToString('R', [Globalization.CultureInfo]::InvariantCulture)
    }

    $dictionary = $null
    if ($Value -is [Collections.IDictionary]) {
        $dictionary = $Value
    }
    elseif ($Value -is [pscustomobject]) {
        $dictionary = [ordered]@{}
        foreach ($property in $Value.PSObject.Properties) { $dictionary[$property.Name] = $property.Value }
    }

    if ($null -ne $dictionary) {
        $keys = [Collections.Generic.List[string]]::new()
        foreach ($key in $dictionary.Keys) {
            if ($key -isnot [string]) {
                Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId 'output.property' -PolicyRuleId 'V2-JSON-KEY-TYPE' -FailureCategory 'output-schema'
            }
            $keys.Add([string]$key)
        }
        $keys.Sort([StringComparer]::Ordinal)
        $members = [Collections.Generic.List[string]]::new()
        foreach ($key in $keys) {
            $members.Add(([GcScopeRouterV2.StrictJson]::Quote($key) + ':' + (ConvertTo-GcCanonicalJsonValueV2 -Value $dictionary[$key])))
        }
        return '{' + [string]::Join(',', $members) + '}'
    }

    if ($Value -is [Collections.IEnumerable]) {
        $items = [Collections.Generic.List[string]]::new()
        foreach ($item in $Value) { $items.Add((ConvertTo-GcCanonicalJsonValueV2 -Value $item)) }
        return '[' + [string]::Join(',', $items) + ']'
    }

    Throw-GcFailureV2 -ReasonCode 'OUTPUT_SCHEMA_INVALID' -FieldId 'output.value' -PolicyRuleId 'V2-JSON-VALUE-TYPE' -FailureCategory 'output-schema'
}

function ConvertTo-GcCanonicalJsonV2 {
    param([Parameter(Mandatory)]$Value)
    return (ConvertTo-GcCanonicalJsonValueV2 -Value $Value)
}

function Get-GcObjectKeysV2 {
    param([Parameter(Mandatory)]$Object)

    if ($Object -isnot [Collections.IDictionary]) {
        Throw-GcFailureV2 -ReasonCode 'INPUT_SCHEMA_INVALID' -FieldId 'input.object' -PolicyRuleId 'V2-SCHEMA-OBJECT' -FailureCategory 'input-schema'
    }
    return @($Object.Keys | ForEach-Object { [string]$_ })
}

function Test-GcObjectHasKeyV2 {
    param([Parameter(Mandatory)]$Object, [Parameter(Mandatory)][string]$Key)
    if ($Object -isnot [Collections.IDictionary]) { return $false }
    return ([Collections.IDictionary]$Object).Contains($Key)
}

function Assert-GcClosedObjectV2 {
    param(
        [Parameter(Mandatory)]$Object,
        [Parameter(Mandatory)][string[]]$Allowed,
        [Parameter(Mandatory)][string[]]$Required,
        [Parameter(Mandatory)][string]$FieldId
    )

    if ($Object -isnot [Collections.IDictionary]) {
        Throw-GcFailureV2 -ReasonCode 'INPUT_SCHEMA_INVALID' -FieldId $FieldId -PolicyRuleId 'V2-SCHEMA-OBJECT' -FailureCategory 'input-schema'
    }
    $allowedSet = [Collections.Generic.HashSet[string]]::new($Allowed, [StringComparer]::Ordinal)
    foreach ($key in $Object.Keys) {
        if ($key -isnot [string] -or -not $allowedSet.Contains([string]$key)) {
            Throw-GcFailureV2 -ReasonCode 'INPUT_UNKNOWN_PROPERTY' -FieldId "$FieldId.unknownProperty" -PolicyRuleId 'V2-SCHEMA-CLOSED' -FailureCategory 'input-schema'
        }
    }
    foreach ($name in $Required) {
        if (-not (Test-GcObjectHasKeyV2 -Object $Object -Key $name)) {
            Throw-GcFailureV2 -ReasonCode 'INPUT_REQUIRED_PROPERTY_MISSING' -FieldId "$FieldId.requiredProperty" -PolicyRuleId 'V2-SCHEMA-REQUIRED' -FailureCategory 'input-schema'
        }
    }
}

function Assert-GcStringArrayV2 {
    param(
        [Parameter(Mandatory)][AllowEmptyCollection()]$Value,
        [Parameter(Mandatory)][string]$FieldId,
        [int]$MinimumCount = 0,
        [AllowNull()][Collections.Generic.HashSet[string]]$AllowedValues
    )

    if ($Value -is [string] -or $Value -isnot [Collections.IList]) {
        Throw-GcFailureV2 -ReasonCode 'INPUT_SCHEMA_INVALID' -FieldId $FieldId -PolicyRuleId 'V2-SCHEMA-ARRAY' -FailureCategory 'input-schema'
    }
    if ($Value.Count -lt $MinimumCount) {
        Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId $FieldId -PolicyRuleId 'V2-SCHEMA-MIN-ITEMS' -FailureCategory 'input-schema'
    }
    $seen = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    for ($i = 0; $i -lt $Value.Count; $i++) {
        if ($Value[$i] -isnot [string] -or ([string]$Value[$i]).Length -lt 1 -or ([Text.Encoding]::UTF8.GetByteCount([string]$Value[$i])) -gt 4096) {
            Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId $FieldId -ArrayIndex $i -PolicyRuleId 'V2-SCHEMA-STRING-ITEM' -FailureCategory 'input-schema'
        }
        $item = [string]$Value[$i]
        if (-not $seen.Add($item)) {
            Throw-GcFailureV2 -ReasonCode 'INPUT_DUPLICATE_ITEM' -FieldId $FieldId -ArrayIndex $i -PolicyRuleId 'V2-SCHEMA-UNIQUE-ORDINAL' -FailureCategory 'input-schema'
        }
        if ($null -ne $AllowedValues -and -not $AllowedValues.Contains($item)) {
            Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId $FieldId -ArrayIndex $i -PolicyRuleId 'V2-SCHEMA-ENUM' -FailureCategory 'input-schema'
        }
    }
}

function Assert-GcAssessorSchemaV2 {
    param([Parameter(Mandatory)]$Assessor, [Parameter(Mandatory)]$Policy)

    Assert-GcClosedObjectV2 -Object $Assessor -Allowed @('schemaVersion','classification','uncertainty','flags') -Required @('schemaVersion','classification','uncertainty','flags') -FieldId 'assessorResult'
    if ($Assessor['schemaVersion'] -isnot [string] -or -not (Test-GcOrdinalEqualsV2 $Assessor['schemaVersion'] $Policy['assessorSchemaVersion'])) {
        Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId 'assessorResult.schemaVersion' -PolicyRuleId 'V2-ASSESSOR-VERSION' -FailureCategory 'input-schema'
    }

    $classifications = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($entry in $Policy['classifications']) { [void]$classifications.Add([string]$entry['id']) }
    if ($Assessor['classification'] -isnot [string] -or -not $classifications.Contains([string]$Assessor['classification'])) {
        Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId 'assessorResult.classification' -PolicyRuleId 'V2-ASSESSOR-CLASSIFICATION' -FailureCategory 'input-schema'
    }

    $uncertainties = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($entry in $Policy['assessorUncertaintyMinimums']) { [void]$uncertainties.Add([string]$entry['id']) }
    if ($Assessor['uncertainty'] -isnot [string] -or -not $uncertainties.Contains([string]$Assessor['uncertainty'])) {
        Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId 'assessorResult.uncertainty' -PolicyRuleId 'V2-ASSESSOR-UNCERTAINTY' -FailureCategory 'input-schema'
    }

    $flags = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($entry in $Policy['assessorFlags']) { [void]$flags.Add([string]$entry['id']) }
    Assert-GcStringArrayV2 -Value $Assessor['flags'] -FieldId 'assessorResult.flags' -AllowedValues $flags
}

function Assert-GcInputSchemaV2 {
    param([Parameter(Mandatory)]$InputObject, [Parameter(Mandatory)]$Policy)

    $allowed = @('schemaVersion','policyVersion','taskId','repositoryRoot','expectedBranch','expectedHead','requestedOperations','requestedReadPaths','requestedWritePaths','assessorResult')
    $required = @('schemaVersion','policyVersion','taskId','repositoryRoot','expectedBranch','expectedHead','requestedOperations','requestedReadPaths','requestedWritePaths')
    Assert-GcClosedObjectV2 -Object $InputObject -Allowed $allowed -Required $required -FieldId 'input'

    foreach ($name in @('schemaVersion','policyVersion','taskId','repositoryRoot','expectedBranch','expectedHead')) {
        if ($InputObject[$name] -isnot [string]) {
            Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId $name -PolicyRuleId 'V2-SCHEMA-STRING' -FailureCategory 'input-schema'
        }
    }
    if (-not (Test-GcOrdinalEqualsV2 $InputObject['schemaVersion'] $Policy['inputSchemaVersion'])) {
        Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId 'schemaVersion' -PolicyRuleId 'V2-INPUT-VERSION' -FailureCategory 'input-schema'
    }
    if (-not (Test-GcOrdinalEqualsV2 $InputObject['policyVersion'] $Policy['policyVersion'])) {
        Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId 'policyVersion' -PolicyRuleId 'V2-POLICY-VERSION' -FailureCategory 'input-schema'
    }
    if ($InputObject['taskId'] -cnotmatch '^[A-Za-z0-9][A-Za-z0-9._:/-]{0,127}$') {
        Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId 'taskId' -PolicyRuleId 'V2-TASK-ID-ASCII' -FailureCategory 'input-schema'
    }
    if ($InputObject['expectedBranch'] -cnotmatch '^[A-Za-z0-9][A-Za-z0-9._/-]{0,254}$') {
        Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId 'expectedBranch' -PolicyRuleId 'V2-BRANCH-FORM' -FailureCategory 'input-schema'
    }
    if ($InputObject['expectedHead'] -cnotmatch '^[0-9a-f]{40}$') {
        Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId 'expectedHead' -PolicyRuleId 'V2-HEAD-CANONICAL' -FailureCategory 'input-schema'
    }
    if ([string]$InputObject['repositoryRoot'] -match '^\s|\s$' -or ([string]$InputObject['repositoryRoot']).Length -gt 1024) {
        Throw-GcFailureV2 -ReasonCode 'INPUT_VALUE_INVALID' -FieldId 'repositoryRoot' -PolicyRuleId 'V2-ROOT-FORM' -FailureCategory 'input-schema'
    }

    $operations = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($entry in $Policy['operations']) { [void]$operations.Add([string]$entry['id']) }
    Assert-GcStringArrayV2 -Value $InputObject['requestedOperations'] -FieldId 'requestedOperations' -MinimumCount 1 -AllowedValues $operations
    Assert-GcStringArrayV2 -Value $InputObject['requestedReadPaths'] -FieldId 'requestedReadPaths'
    Assert-GcStringArrayV2 -Value $InputObject['requestedWritePaths'] -FieldId 'requestedWritePaths' -MinimumCount 1

    if (Test-GcObjectHasKeyV2 -Object $InputObject -Key 'assessorResult') {
        Assert-GcAssessorSchemaV2 -Assessor $InputObject['assessorResult'] -Policy $Policy
    }
    return $true
}
