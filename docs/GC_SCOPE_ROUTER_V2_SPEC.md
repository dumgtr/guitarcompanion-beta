# Guitar Companion Scope Router V2 Specification

Status: authorized clean rebuild, Shadow Mode only
Task: `GC-SCOPE-ROUTER-V2-CLEAN-TRUST-BOUNDARY-REBUILD-IN-CONFIRMED-WRITABLE-WORKTREE`
Trusted base: `92a633518f593fc837324508e14acd800c67fc06`

## 1. Purpose and boundary

Scope Router V2 converts one strict JSON task document plus facts obtained from System Git into deterministic, sanitized decision evidence. It recommends process only. It never authorizes or dispatches work.

The following invariants are unconditional:

- `executionPermitted` is `false`.
- `autoRepairAllowed` is `false`.
- no provider, Broker, IPC dispatch, command execution request, repair loop, stage, commit, push, merge, tag, reset, restore, clean, stash, switch, or rebase capability exists;
- every non-blocked decision recommends exactly one writer, `Codex Implementer`;
- every reviewer is read-only;
- hashes prove deterministic integrity and drift detection only. They are not authentication, authorization, approval, or execution permission.

V2 is isolated from production, Legacy, and Scope Router V1. It is not production-ready and must remain on Product Owner human review hold.

## 2. Ordered flow

1. Read one UTF-8 input document and parse it with the token-aware strict parser.
2. Enforce the closed input schema.
3. verify the machine-readable input-consumption contract.
4. obtain and compare exact ordinal repository identity from System Git.
5. validate an optional, separate Product Owner protected-write authorization bound to the exact input SHA-256 and repository identity.
6. apply the canonical protected-path lattice.
7. query and structurally parse `git status --porcelain=v1 -z --untracked-files=all`.
8. classify deterministic risk.
9. optionally merge a strictly validated data-only assessor result.
10. choose the most restrictive result.
11. validate output schema and independent semantic invariants.
12. write evidence atomically.
13. invoke a separate checked child process to validate the promoted artifact.
14. exit without dispatch or repair.

Any failure is fail-closed. Rejected raw input and exception text are never printed or persisted.

## 3. Closed input contract

Accepted top-level properties are exactly:

- `schemaVersion`
- `policyVersion`
- `taskId`
- `repositoryRoot`
- `expectedBranch`
- `expectedHead`
- `requestedOperations`
- `requestedReadPaths`
- `requestedWritePaths`
- optional `assessorResult`

The assessor is data only and accepts exactly `schemaVersion`, `classification`, `uncertainty`, and `flags`. Unknown properties are rejected at every object level. V1 prose and metadata properties, including priority, requested agents/tests, declared dirty state, risks, and incident IDs, are not accepted.

The schema, `config/gc-scope-router-v2.input-consumption.json`, implementation consumers, and behavioral tests must enumerate the same accepted properties. Every accepted property has exactly one disposition. V2 has no evidence-only input property.

Protected-write authorization is never embedded in this input. It is a separate strict JSON artifact accepted only through `-ProtectedWriteAuthorizationPath`. It is bound ordinally to task ID, input SHA-256, canonical repository root, branch, HEAD, exact requested protected file paths, Product Owner identity, UTC issue/expiry, and `reviewRequired: true`. It cannot authorize subtrees, ancestors, unrequested paths, forbidden paths, or periods longer than 24 hours.

## 4. Exact ordinal identity

Trust identities use `StringComparer.Ordinal` or `StringComparison.Ordinal`, never PowerShell default equality. This applies to task ID, branch, HEAD, schema version, policy version, and canonical repository root.

The repository root, branch, and HEAD come from an application-resolved System Git child process with a bounded timeout and checked exit code. The input root must already equal its canonical full-path representation. Aliases, different case, trailing separators, dot segments, normalization changes, and whitespace are not silently repaired. HEAD is exactly 40 lowercase hexadecimal characters.

Task IDs are printable ASCII identifiers. Case is meaningful. Evidence bound to one task ID cannot be validated using a case variant.

## 5. Canonical path lattice

Input scopes use repository-relative forward-slash paths. The only wildcard form is a terminal `/**`, meaning the named path and every descendant. General globs are rejected. Root scopes, dot scopes, absolute paths, UNC/device paths, drive-relative paths, traversal, alternate data streams, empty segments, and backslashes are rejected or blocked.

Overlap is symmetric and includes exact, ancestor, descendant, and subtree intersection. Therefore a protected `outputs/**` namespace blocks `outputs`, `outputs/`, every descendant, a repository-root scope, and every accepted broader scope. Existing ancestors of a candidate are checked for symbolic links or reparse points; a non-existing child under such an ancestor is blocked.

The output partitions `allowedReadPaths`, `allowedWritePaths`, `forbiddenPaths`, and `protectedNamespaces` are pairwise disjoint under this lattice. Exact Product Owner-authorized protected files are reported separately as `authorizedProtectedWritePaths`; their sanitized authorization evidence includes only authorization ID, authorization SHA-256, and `reviewRequired: true`. Input read/write overlap is rejected except when an exact authorized protected write also names its implied read path. A write scope implies the ability to read that scope and is not duplicated in `allowedReadPaths`.

Without the separate authorization, protected reads and writes retain the existing blocked result. A valid authorization never permits `.git/**`, never changes the protected namespace policy, and always routes as at least `critical-controlled-path` with fixed read-only reviewer profiles. Router V2 remains advisory and never dispatches a reviewer or implementer.

## 6. Actual Git state

V2 runs exactly:

```text
git status --porcelain=v1 -z --untracked-files=all
```

The NUL-delimited byte stream is decoded as strict UTF-8 and parsed structurally. V2 tracks modified, staged, untracked, deleted, conflicted, rename source, and rename destination paths. Both rename sides are dirty. Candidate write scopes are compared with actual dirty paths using the same overlap lattice. Any overlap blocks the route. A destructive Git request with any intersecting dirty path is also a hard block. Input cannot declare or override Git cleanliness.

Git failure, timeout, invalid UTF-8, missing NUL termination, malformed status, unknown status code, or incomplete rename blocks.

## 7. Classification and routing

Classifications, from least to most restrictive, are `simple`, `moderate`, `complex`, `critical`, and `blocked`. Routes are respectively `fast-path`, `planned-path`, `architecture-path`, `critical-controlled-path`, and `blocked-path`.

Closed operation IDs map deterministically through the policy. Credentials/authorization, provider adapters, process/IPC, strict parsers, production runtime/audio, human-authorized protected writes, deployment/release, destructive Git recovery, and dependency supply chain are at least critical. Force push, trust/test bypass, credential logging, multiple writers, reviewer editing, outside-root writes, unauthorized protected namespace overlap, and dirty-scope overlap are blocked.

The optional assessor may raise but can never lower deterministic severity. Its classification, uncertainty, and every flag participate in the merge.

## 8. Sanitized evidence

A rejected document produces only closed metadata: artifact/schema/policy versions, a stable reason code, a closed field ID, an optional array index, UTF-8 byte length, SHA-256, policy rule ID, normalized category, unconditional Shadow flags, and a deterministic content hash. It contains no raw rejected value, input, path, operation, credential-like value, prose, or exception message.

Decision evidence contains validated identity, deterministic decision, fixed roles, policy-owned protected partitions, actual dirty-state categories, contract hashes, Shadow flags, and a deterministic content hash.

## 9. Atomic evidence

Evidence is built and validated in memory, assigned a deterministic content hash, written through a unique same-directory file using UTF-8 without BOM, durably flushed and closed, strictly re-read, and promoted atomically. Replacement uses a same-directory unique backup. A separate PowerShell child validates the final artifact; its real exit code and timeout are checked. Failure removes a first write or restores the prior valid artifact. Temporary and backup files are cleaned on every path.

The CLI does not accept an arbitrary validator executable or script. Child validation always invokes this V2 entry point in its fixed validation mode.

## 10. Test and release gates

Behavioral suites run in this order: input consumption, ordinal identity, protected paths, actual Git state, and evidence sanitization. Strict JSON, schemas/semantics, routing, atomic evidence, child exit code, determinism, and representative Shadow tasks run only afterward. Aggregate counts never substitute for behavioral assertions.

Browser QA is not applicable to this CLI-only shadow tool. Human review is required before any production discussion. No commit permission is granted.
