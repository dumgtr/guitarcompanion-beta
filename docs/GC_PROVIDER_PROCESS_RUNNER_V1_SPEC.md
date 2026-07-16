# GC Provider Process Runner V1

Status: isolated Agent Workflow Infrastructure

## 1. Boundary

GC Provider Process Runner V1 performs one explicitly authorized provider CLI invocation and writes a closed lifecycle artifact. It is not Sound Lab A3.2, production audio, a persistent Broker, a daemon, or an extension of Scope Router V2.

The following boundaries are unconditional:

- Sound Lab A3.2 remains on hold.
- The runner does not import or invoke Scope Router V2. Router V2 remains Shadow Mode only.
- A Router decision is advisory input. It is never dispatch authorization.
- Every provider invocation requires a separate Human Dispatch Authorization bound to the exact request SHA-256.
- The runner never accepts an executable, shell command, or arbitrary argument from request or authorization data.
- Provider commands come only from checked-in fixed profiles.
- No stage, commit, push, merge, tag, reset, restore, clean, stash, auto-repair, production integration, background job, scheduled task, persistent process, IPC listener, or daemon capability exists.
- Legacy, V1, Broker/provider adapters, Sound Lab, and `outputs/**` are outside this track.

Human Dispatch Authorization is an explicit local audit gate, not cryptographic identity or remote authorization. Its safety depends on custody of the authorization file and the checked-in runner policy. The runner verifies its closed shape, expiry, request hash, provider profile, retry scope, and one-run authorization identifier.

## 2. Flow

```text
Router V2 Decision
        |
Human Dispatch Authorization
        |
One-shot Process Runner
        |
Codex / approved provider profile
        |
Retained per-attempt evidence and structured lifecycle artifact
        |
AGY consolidation
```

The request records the Router decision SHA-256 so that the human authorization is bound indirectly to that decision through the request hash. The runner does not treat `executionPermitted`, a route, or a recommended writer as permission to invoke a provider.

## 3. Request and authorization

Requests are strict UTF-8 JSON with a closed schema. They bind task ID, repository root, expected branch and HEAD, prompt path and SHA-256, Router decision SHA-256, fixed provider profile, timeout, retry intent, and an optional checkpoint for resume. Raw prompt content is never copied into lifecycle or checkpoint artifacts.

Authorizations are separate strict UTF-8 JSON documents. They contain a unique authorization ID, human authorizer label, issue and expiry times, exact request SHA-256, provider profile, maximum attempts, allowed retry categories, and `providerInvocation: true`.

Resume requires a new request bound to the exact checkpoint SHA-256 and a new Human Dispatch Authorization. Reusing the authorization identifier of the checkpoint is rejected.

The runner claims the authorization ID atomically before spawning the provider process. The claim is permanently consumed at that moment. If the provider process fails to spawn or crashes immediately, the authorization ID remains consumed and cannot be reused.

## 4. Fixed provider profiles

V1 enables only profiles whose installed CLI contract was verified:

- `codex-readonly`: `codex exec --ephemeral --json --sandbox read-only -`; completion requires one `turn.completed` event and exit code 0. `turn.failed`, malformed JSONL, missing terminal event, truncation, or nonzero exit fails closed.
- `gemini-plan-review`: Gemini headless plan mode with `stream-json`; completion requires valid JSON lines, one terminal success result, exit code 0, and exactly one mechanically extracted reviewer payload matching `gc-provider-process-runner-v1.reviewer-payload/1`. Exit code 0 without a valid payload is a protocol failure, never reviewer PASS.
- `claude-readonly`: Claude one-shot JSON mode with only `Read`, `Glob`, and `Grep`; edit, write, shell, web, notebook, and MCP tools are denied, session persistence and slash commands are disabled, and completion requires one JSON object with `type=result`, `subtype=success`, a non-empty string `result`, `is_error` absent or false, and exit code 0.

Claude and Gemini reviewer invocations are permitted only through these immutable Provider Runner profiles with a separate Human Dispatch Authorization. Ad-hoc direct provider commands, request-supplied executables or arguments, and `GC_*_AGENT_CMD` command templates are prohibited. A Host Broker is not required and is not invoked; the runner itself is the controlled one-shot boundary.

`github-copilot-readonly` remains disabled in the V1 runner policy because Dispatcher integration has not started. This is a fail-closed integration state, not a permanent provider disable. Its availability in the external `gh` CLI does not override this hard-coded policy. The current live status is `TEMPORARILY_UNAVAILABLE` with `reasonCode: PROVIDER_QUOTA_EXCEEDED`, `retryAllowedNow: false`, `reviewAccepted: false`, `permanentlyDisabled: false`, and `recheckRequired: true`. Gemini is the fallback reviewer with a warning while the external quota is unavailable. When the external quota is restored, a code and policy change is still required to fully enable the Copilot profile with proper arguments, protocols, and tests before it can be invoked by the Runner.

Prompt content is written to redirected stdin and stdin is closed immediately afterward. When a profile does not use stdin, the stream is closed immediately after process start.

## 5. Lifecycle

The lifecycle is:

```text
NOT_STARTED -> STARTED -> RUNNING -> COMPLETED
                                  -> FAILED
                                  -> TIMED_OUT
                                  -> CANCELLED
```

Both stdout and stderr are drained concurrently in-process with the existing hard byte capture limit while the full streams continue to drain. Each bounded capture is retained per attempt as `provider-stdout.raw` and `provider-stderr.raw`; full-stream byte lengths and SHA-256 hashes remain separate metadata when a stream exceeds the retained cap. Security redaction runs before persistence, and each attempt result records whether redaction changed a retained stream. Raw commands, prompts, credentials, authorization headers, access tokens, environment secrets, and uncapped provider output are not persisted.

For `gemini-plan-review`, extraction reads only decoded assistant content or an exact contiguous JSON object from the already validated JSON stream. It does not add braces, remove fences from inside the object, rewrite keys, repair syntax, or infer missing fields. The accepted object has exactly `verdict`, `summary`, `requiredConstraints`, `risks`, `recommendedSeams`, `acceptanceTests`, and `filesReviewed`; verdict is `PASS`, `CONDITIONAL_PASS`, or `FAIL`. A sensitive, missing, malformed, ambiguous, truncated, or schema-invalid payload is not written as parsed evidence and fails the reviewer gate.

Timeout and cancellation kill the complete process tree. The real process exit code is recorded when available. A process that starts but does not complete is never reported as `NOT_STARTED`.

## 6. Failures, retries, and checkpoints

Closed failure categories are:

- `AUTH_FAILED`
- `RATE_LIMITED`
- `QUOTA_EXCEEDED`
- `PROVIDER_FAILURE`
- `PROTOCOL_FAILURE`
- `RUNNER_FAILURE`
- `TIMEOUT`
- `CANCELLED`

Quota, authentication, cancellation, protocol, provider, and runner failures are never retried. Rate limits and timeouts may be retried once only when the checked-in policy, request retry intent, and Human Dispatch Authorization all allow that category. Total attempts can never exceed two.

A final quota or timeout result writes an atomic checkpoint. Optional reviewers may be marked unavailable by AGY and consolidation may continue with a warning. A mandatory reviewer blocks acceptance. A Codex quota result pauses implementation, preserves the worktree, writes a checkpoint, and requires a later resume with a new authorization.

## 7. Artifacts

Artifacts default to:

```text
%LOCALAPPDATA%\GuitarCompanion\ProviderProcessRunnerV1\runs\<authorizationId>
```

An explicit artifact root is allowed only outside the repository, primarily for controlled tests. Lifecycle, checkpoint, attempt-result, retained-stream, and parsed-payload artifacts are written atomically through unique same-directory temporary files. Retained destinations cannot be overwritten. Temporary transport files are removed only after retained files are written and verified.

Every attempt has its own `attempt-<n>` directory containing:

```text
provider-stdout.raw
provider-stderr.raw
attempt-result.json
reviewer-payload.json  # only when payloadParseStatus is VALID
```

`attempt-result.json` binds the authorization, request, profile, attempt number, timestamps, terminal state, exit code, retained paths/hashes/lengths, full-stream hashes/lengths, truncation and redaction flags, parsed-payload evidence, parse status, and `cleanupStatus: RETAINED`. Lifecycle attempt entries reference the retained stdout, stderr, attempt result, and optional reviewer payload with their SHA-256 values. Timeout and failure attempts retain the same bounded evidence wherever capture completed. Diagnostic text outside retained streams remains reduced to stable closed summaries.

## 8. Acceptance tests

Tests use mock child processes only. They cover authorization rejection before spawn, stdin EOF, concurrent stdout/stderr flooding, Codex JSONL, Gemini stream JSON and strict reviewer-payload extraction, malformed and missing reviewer payloads, strict Claude JSON completion and failures, real exit codes, timeout and descendant-process termination, retained timeout evidence, cancellation, failure classification, quota zero-retry, unchanged rate-limit and timeout retry policy, checkpoint/resume binding, immutable atomic artifacts, retained-file hash verification, credential/header redaction, output caps, worktree preservation, parse checks, and forbidden-path/static command checks.
