# Direct API Model Benchmark Notes

Status: Non-authoritative evidence notes
Last reviewed: 2026-07-24

## Purpose

This file keeps model-quality and benchmark provenance separate from the
production allowlist policy.

```text
MODEL AUTHORIZATION SOURCE:
agent_tools/qwen_models.json

POLICY EXPLANATION:
docs/QWEN_DIRECT_API_POLICY.md

BENCHMARK AUTHORITY:
NON-AUTHORITATIVE
```

A benchmark result cannot add a model to the registry, change automatic
routing, authorize fallback, or approve production use.

## Evidence Boundaries

These claims must remain separate:

| Claim | What it can establish | What it cannot establish |
|---|---|---|
| API-callable signal | The endpoint responded to a request | Current project allowlist status |
| Provider identity smoke | The response reported an accepted model identity | Review quality or ranking |
| Registry entry | The project permits the model under its recorded status and flags | Live availability in every workspace or region |
| Quality benchmark | Performance for the exact recorded runner, evaluator, prompt, inputs, and ground truth | Policy authorization or general superiority |

“The API answered,” “the provider identity was accepted,” and “the model
passed the benchmark” are different statements.

## Current Repository Evidence

At reviewed `origin/main`
`54eaf1191f92025feec5fefa247566eb837b8782`:

- no authoritative cross-model ranking is committed;
- no benchmark evidence bundle establishes that any model is “best”;
- no committed benchmark evidence was found for the reported runner/evaluator
  mismatch rounds;
- no committed benchmark evidence was found for the reported A5 double-stop
  ground-truth withdrawal; and
- commit `54eaf11` is in main and expands the active registry from 10 to 26
  models, but registry inclusion does not by itself prove benchmark quality.

Chat summaries and externally supplied benchmark scripts are not repository
evidence. Their model lists, scores, withdrawals, and allowlists must not be
copied into production policy without traceable artifacts.

## Active Catalog Integration

Commit `54eaf11` added 16 entries to a 10-model baseline, producing the active
26-model registry on `origin/main`. The current change expands the catalog to
30 models by adding 4 explicit-only external models: `deepseek-v4-flash`,
`deepseek-v4-pro`, `glm-5.1`, and `glm-5.2`. All additions retain `explicit-only`
selection and have zero effect on Auto Routing V2. `deepseek-v3.2` is denied.

## DeepSeek and GLM Integration Smoke Evidence

A 1-request per model integration smoke was run on 2026-07-24T04:26:22Z for all
4 authorized models. This was a transport and identity check, not a benchmark
pass or quality ranking.

```text
timestamp: 2026-07-24T04:26:22Z
runner_version: 1.1.0
tested_models:
  - deepseek-v4-flash: exit=0, exact_identity_match=PASS, elapsed=2.53s
  - deepseek-v4-pro: exit=0, exact_identity_match=PASS, elapsed=3.40s
  - glm-5.1: exit=0, exact_identity_match=PASS, elapsed=5.87s
  - glm-5.2: exit=0, exact_identity_match=PASS, elapsed=3.81s
api_transport_status: success
exit_classification: SUCCESS
retry_count: 0
fallback_occurred: false
exact_identity_match_all: true
raw_evidence_path: %TEMP%\guitar-companion-direct-api-smoke\20260724T042622Z\
catalog_integration_blocker: NO
```

All 4 models established API transport success, non-empty response, provider
identity equality, zero retries, and no fallback. Raw reports and sidecars were
written to the operator's temporary directory outside the repository and are
retained. Exact identity smoke serves as authorization evidence for callability
and identity match only, not as quality ranking.

## qwen3.5-27b Light Smoke

A one-request integration smoke was run on 2026-07-24 after local main reached
`54eaf11`. It was a transport and identity check, not a quality benchmark.

```text
timestamp: 2026-07-24T03:42:43Z
runner_version: 1.1.0
requested_model: qwen3.5-27b
provider_reported_model: qwen3.5-27b
api_transport_status: success
exit_classification: SUCCESS
retry_count: 0
fallback_occurred: false
prompt_sha256: c1c6d76d497453125f9eada56c8a087d49de630cc2cc3f86bd348533b935f6c3
report_sha256: 9c937c33ca05791960c1054e72e4d94bb6c0450b19471fa663d891b927af545d
exact_echo_compliance: FAIL
catalog_integration_blocker: NO
```

The response was non-empty but did not equal
`QWEN_35_27B_SMOKE_PASS`. Because the exact-echo prompt was not a code-review
task, this is a behavior observation rather than a transport, identity, or
registry failure. No additional live request was required.

The raw report and sidecar were written to the operator's temporary directory
and were not committed. The hashes above preserve their identity without
making temporary artifacts part of the repository.

## Recording Withdrawn or Contested Results

If a benchmark round is withdrawn because the runner, evaluator, prompt,
inputs, or ground truth did not match the approved specification:

1. retain the raw evidence;
2. mark the round `WITHDRAWN` rather than deleting it;
3. record the exact reason and affected cases;
4. exclude the round from aggregate ranking;
5. link replacement evidence instead of overwriting the original; and
6. do not move the conclusion into model policy.

Ground-truth corrections, including any A5 double-stop case, must identify the
fixture, old expectation, corrected expectation, reviewer, and supporting
artifact. Until that record exists, the claim remains unverified and must not
be used for scoring.

## Minimum Evidence Record

Future benchmark entries should include:

```text
run_id:
status: VALID | WITHDRAWN | SUPERSEDED
requested_model:
provider_reported_model:
runner_path:
runner_sha256:
evaluator_path:
evaluator_sha256:
prompt_sha256:
input_paths_and_sha256:
ground_truth_version:
workspace_or_region:
started_at:
completed_at:
raw_evidence_path:
withdrawal_or_supersession_reason:
```

Raw evidence must be retained and must not be deleted automatically.

## Interpretation Rule

Do not state that a model is “best” in the production model policy. Benchmark
conclusions are scoped to their recorded evidence and remain advisory. System
CLI output, repository state, deterministic tests, and Product Owner gates
remain authoritative.
