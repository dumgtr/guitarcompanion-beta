# Scope Router V2 Threat Model

Status: Shadow Mode; production integration forbidden.

## Assets and trust decisions

The assets are exact repository identity, the protected namespace lattice, actual Git dirty state, deterministic classification, sanitized evidence, and the invariant that no execution or repair permission can be produced.

Trusted inputs are limited to fixed V2 contract files loaded from the current repository and facts returned by an application-resolved System Git process. The task document and optional assessor are untrusted data. File names and status bytes returned by Git are also validated before use.

## Threats and controls

| Threat | Control | Failure behavior |
| --- | --- | --- |
| JSON smuggling, duplicate keys, comments, fences, concatenation, malformed Unicode | token-aware strict UTF-8 JSON parser; one document; per-object ordinal duplicate detection | sanitized block |
| Silently ignored authority/prose fields | closed schemas plus machine-readable consumption manifest and parity tests | sanitized block |
| Case-insensitive or normalized identity confusion | explicit ordinal comparison; canonical-form precondition; System Git facts | sanitized block |
| Git alias/function interception | resolve `git.exe`/`git` as an Application and start it without a shell | block |
| Root, ancestor, wildcard, traversal, ADS, UNC/device, or symlink/reparse write escape | small relative path grammar; symmetric lattice; existing-ancestor reparse checks | block |
| Task prose lies about cleanliness | no dirty-state input; NUL-delimited porcelain-v1 query and structural parser | block |
| Rename hides one dirty side | destination and following source record both retained | block |
| Assessor lowers risk or injects commands | closed data-only assessor; rank-only most-restrictive merge | ignore lowering; reject unknown data |
| Rejected secret/path appears in logs or evidence | closed failure mapping; byte length/hash only; no raw exception messages | sanitized block |
| Partial or tampered evidence | durable temp write, strict pre-promotion validation, atomic promotion, content hash | rollback/block |
| Validator stub or unchecked failure | fixed child entry point, timeout, real exit-code check | rollback/block |
| Hash treated as authority | explicit integrity-only documentation and unconditional Shadow flags | no permission |
| Multi-writer/reviewer mutation | closed blocked operation IDs; one fixed writer; read-only reviewers | block |
| Provider, Broker, dispatch, or repair seam | no such input, output, function, process path, or module dependency | absent/fail closed |

## Protected boundaries

At minimum, production `outputs/**`, Git metadata, and existing orchestration/provider boundary scripts are protected. V2 policy paths are fixed and policy-owned. A rejected user path is never copied into those arrays.

Legacy and Scope Router V1 worktrees are quarantined read-only. V2 starts from trusted commit `92a633518f593fc837324508e14acd800c67fc06`; V1 code is not a source dependency.

## Residual limitations

- Integrity hashes cannot authenticate a maliciously modified repository or policy.
- System Git is trusted as a local executable and repository fact source.
- Windows filesystem behavior, including reparse and atomic replacement semantics, requires behavioral testing on the target host.
- The router recommends a process but cannot enforce behavior by tools outside this program.
- Human review remains required; Shadow Mode is not production authorization.
