# Qwen Direct API — Model Policy

Status: Workflow Policy
Last reviewed: 2026-07-24

## Source of Truth

```text
SOURCE_OF_TRUTH:
agent_tools/qwen_models.json

DOCUMENTED_REVISION:
origin/main @ 54eaf1191f92025feec5fefa247566eb837b8782
```

This document explains the checked-in registry; it does not create model
authorization. If this document, a benchmark report, a chat summary, or an
external toolchain disagrees with `agent_tools/qwen_models.json`, the registry
wins.

The active registry contains 30 models:

```text
AUTO ROUTING:                 5
COMPATIBILITY:                2
EXPERIMENTAL/PREVIEW:         3
REPRODUCIBILITY SNAPSHOTS:    9
EXPLICIT STABLE/HOSTED:      11
--------------------------------
TOTAL:                       30
```

The registry includes 26 Qwen models and 4 external Model Studio models (`deepseek-v4-flash`, `deepseek-v4-pro`, `glm-5.1`, `glm-5.2`). Legacy filenames `qwen_models.json` and `qwen_agent.py` remain in place and do not restrict the registry to Qwen models only. `deepseek-v3.2` is explicitly prohibited and denied by policy.

## Selection Order

The Coordinator resolves a request in this order:

```text
1. explicit --model
2. explicit --cost-priority
3. automatic task routing
```

An explicit model is still subject to its registry status and authorization
flag. Automatic routing may select only entries whose status is `allowed`,
whose `selectionMode` is `auto`, and whose `autoSelectable` value is `true`.

## Automatic Models

| Route | Model | Thinking default | Role |
|---|---|---:|---|
| Cheapest | `qwen-flash` | Off | Minimal-cost, low-complexity checks |
| Economy | `qwen3.5-flash` | Off | Economy code analysis and low-risk semantic review |
| Fast / Small | `qwen3.6-flash` | Off | Fast targeted technical review |
| Default | `qwen3.7-plus` | On | Architecture, multi-file code, lifecycle, regression, and test review |
| Critical | `qwen3.7-max` | On | Critical, disputed, or high-impact analysis |

Cost-priority mappings remain:

```text
cheapest -> qwen-flash
economy  -> qwen3.5-flash
fast     -> qwen3.6-flash
```

`qwen3.7-plus` remains the default review route. `qwen3.7-max` is selected
automatically only for tasks explicitly classified as critical or disputed.
The catalog expansion does not change Auto Routing V2.

## Explicit-only Models

| Model | Registry status | Required authorization | Purpose or constraint |
|---|---|---|---|
| `qwen3.8-max-preview` | Experimental | `--allow-experimental` | Product Owner-authorized A/B evaluation only |
| `qwen3.7-max-preview` | Experimental | `--allow-experimental` | Non-gating preview evaluation; thinking required |
| `qwen3.6-max-preview` | Experimental | `--allow-experimental` | Scheduled lifecycle cutoff 2026-10-10; replacement `qwen3.7-max` |
| `qwen3.7-plus-2026-05-26` | Reproducibility | `--allow-reproducibility` | Reproduce an exact Plus review |
| `qwen3.7-max-2026-06-08` | Reproducibility | `--allow-reproducibility` | Reproduce an exact Max review |
| `qwen3.7-max-2026-05-20` | Reproducibility | `--allow-reproducibility` | Reproduce the named Max snapshot |
| `qwen3.7-max-2026-05-17` | Reproducibility | `--allow-reproducibility` | Reproduce the named Max snapshot; thinking required |
| `qwen3.6-flash-2026-04-16` | Reproducibility | `--allow-reproducibility` | Reproduce the named Flash snapshot |
| `qwen3.6-plus-2026-04-02` | Reproducibility | `--allow-reproducibility` | Reproduce the named Plus snapshot |
| `qwen3.5-plus-2026-02-15` | Reproducibility | `--allow-reproducibility` | Reproduce the named Plus snapshot |
| `qwen3.5-plus-2026-04-20` | Reproducibility | `--allow-reproducibility` | Reproduce the named Plus snapshot |
| `qwen3.5-flash-2026-02-23` | Reproducibility | `--allow-reproducibility` | Reproduce the named Flash snapshot |
| `qwen3.6-27b` | Allowed | Explicit `--model` | Hosted open-source evaluation; thinking off by default |
| `qwen3.6-35b-a3b` | Allowed | Explicit `--model` | Hosted open-source evaluation; thinking off by default |
| `qwen3.5-plus` | Allowed | Explicit `--model` | Explicit stable-model evaluation |
| `qwen3.5-27b` | Allowed | Explicit `--model` | Active hosted-model evaluation; never auto-routed |
| `qwen3.5-35b-a3b` | Allowed | Explicit `--model` | Hosted open-source evaluation |
| `qwen3.5-122b-a10b` | Allowed | Explicit `--model` | Hosted open-source evaluation |
| `qwen3.5-397b-a17b` | Allowed | Explicit `--model` | Hosted open-source evaluation |
| `deepseek-v4-flash` | Allowed | Explicit `--model` | Hosted DeepSeek model; explicit-only; thinking off by default |
| `deepseek-v4-pro` | Allowed | Explicit `--model` | Hosted DeepSeek model; explicit-only; thinking off by default |
| `glm-5.1` | Allowed | Explicit `--model` | Hosted GLM model; explicit-only; thinking off by default |
| `glm-5.2` | Allowed | Explicit `--model` | Hosted GLM model; explicit-only; thinking off by default |
| `qwen3-coder-plus` | Compatibility | `--allow-compatibility` | Existing coder prompts and historical comparison |
| `qwen-turbo` | Compatibility | `--allow-compatibility` | Existing narrow traces and historical comparison |

All 25 models in this table have `selectionMode: explicit-only` and
`autoSelectable: false`. Preview, snapshot, hosted, stable-explicit, and
compatibility IDs never enter Auto Routing V2.

## Thinking and Lifecycle Rules

- Automatic models use the defaults recorded in the registry.
- `qwen3.7-max-preview` and `qwen3.7-max-2026-05-17` require thinking.
- Models with `enable_thinking: false` use a verified runner request default;
  this does not claim that the provider lacks thinking capability.
- `qwen3.6-max-preview` emits a deprecation warning before 2026-10-10 and is
  rejected by policy on or after that date.

The Coordinator may intentionally override a supported thinking setting for a
scoped experiment, but the override must be visible in the command and report.
It must not become fallback behavior.

## Manual Authorization Examples

```powershell
# Compatibility
python -B agent_tools/qwen_model_policy.py `
  --validate-model qwen3-coder-plus `
  --allow-compatibility

# Preview / experimental
python -B agent_tools/qwen_model_policy.py `
  --validate-model qwen3.7-max-preview `
  --allow-experimental

# Fixed snapshot
python -B agent_tools/qwen_model_policy.py `
  --validate-model qwen3.6-flash-2026-04-16 `
  --allow-reproducibility

# Active explicit hosted model
python -B agent_tools/qwen_model_policy.py `
  --validate-model deepseek-v4-flash
```

An unlisted model (such as `deepseek-v3.2`) is denied. The production Qwen agent
does not provide an `--allow-unlisted` bypass.

## Retry, Identity, and Fallback Rules

- Transport retries reuse the same request and the same model ID.
- A retry never changes model tier, alias, or snapshot.
- The provider response must contain a model identity accepted by the runner.
- A model mismatch fails closed; it is not converted into a review result.
- There is no silent fallback and no automatic model escalation.
- An API or transport failure is not a review `FAIL`; it is an execution
  failure.
- `fallback` remains `null`, and execution metadata records
  `fallback_occurred: false`.

A snapshot must be requested with its exact registry ID. The current runner
accepts a provider-reported identity that is either the requested ID or a
provider-qualified value beginning with that ID; it rejects a different model
as `MODEL_MISMATCH`. Tightening this to byte-for-byte equality is a tooling
change and requires tests.

## Current Integration Evidence

The catalog implementation passed the repository policy and agent-hardening
tests before and after entering main. A one-request live smoke across all 4
added models (`deepseek-v4-flash`, `deepseek-v4-pro`, `glm-5.1`, `glm-5.2`)
established API transport success, provider identity equality, zero retries,
and no fallback.

Detailed non-authoritative evidence belongs in
`docs/MODEL_BENCHMARK_NOTES.md`.

## Authority and Human Gates

Qwen is advisory-only. It cannot:

- approve its own recommendation;
- grant final visual or auditory acceptance;
- authorize a commit, push, merge, or production activation; or
- override deterministic CLI output or repository state.

Only supplied files count as reviewed evidence. Current baseline and proposed
design must remain distinguishable in prompts and reports.

## External and Non-Qwen Toolchains

Standalone callers or benchmark scripts supplied outside this repository are
separate toolchains. Their embedded allowlists must not replace or extend
`agent_tools/qwen_models.json`.

The active registry contains 26 Qwen models and 4 external Model Studio models
(`deepseek-v4-flash`, `deepseek-v4-pro`, `glm-5.1`, `glm-5.2`). Legacy filenames
`qwen_models.json` and `qwen_agent.py` are preserved for backward compatibility
and do not restrict authorization to Qwen models only. API-callability reports
for an unregistered model (e.g., `deepseek-v3.2`) do not grant project
authorization.

If other model families are later added to the production registry, a broader
`docs/DIRECT_API_MODEL_POLICY.md` may be introduced in a separate, scoped
change. No rename is needed now.

## Benchmark Separation

Model authorization is not a quality ranking. Live identity smoke can show
that an endpoint accepted a requested identity; it does not prove that the
model passed a quality benchmark.

Non-authoritative benchmark and provenance notes belong in
`docs/MODEL_BENCHMARK_NOTES.md`, not in this policy.

## Adding Another Model

Add a model only when all conditions are met:

1. A real workflow need is not covered by the current registry.
2. The exact ID succeeds in the active workspace and region.
3. Provider-reported identity, UTF-8 output, context size, cost, and supported
   request parameters are verified.
4. A neutral smoke review produces grounded file and symbol evidence.
5. Registry and policy tests pass.
6. The Product Owner approves the allowlist change.

When an explicit model ID is supplied, validate it first. Never catch a policy
error and substitute another model.
