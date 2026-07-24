# Agent Team Workflow

Status: Documentation Only / Workflow Guardrail

This document defines the preferred cross-platform agent workflow for Guitar Companion. It is a coordination guide only. It does not authorize production code changes, new features, public reveals, or dependency changes.

## 1. Roles

### Codex: Chief Engineer / Architect / Integrator
- Owns repository context, implementation planning, file edits, validation, commits, and integration.
- Acts as the default committer unless the user explicitly assigns another tool or agent.
- Converts product/curriculum intent into scoped engineering tasks.
- Protects production guardrails and verifies that changes do not expose hidden months or alter frozen behavior.

### Claude: Deep Code Reviewer / Risk Reviewer
- Reviews code, architecture, regressions, edge cases, naming, and hidden coupling.
- Prioritizes risks, missing tests, production regressions, and unclear ownership.
- Operates read-only through the fixed `claude-readonly` Provider Runner profile only.

### Gemini: Research / Alternative Design / Audio-Web Reviewer
- Researches browser APIs, Web Audio behavior, mobile compatibility, and alternative design approaches.
- Useful for audio-engine tradeoffs, cross-browser constraints, and external technical comparison.
- Operates read-only through the fixed `gemini-plan-review` Provider Runner profile only.

### Copilot: Optional Read-Only Reviewer
- Remains disabled in Provider Runner policy until its profile passes a separate approval and live recheck.
- Must never replace the sole Implementer or edit repository files.

### ChatGPT/User: Product Owner / Curriculum Director
- Defines product intent, curriculum direction, learner experience, and launch decisions.
- Approves public reveals, roadmap changes, new modules, and production guardrail exceptions.
- Resolves tradeoffs between pedagogy, UX, and implementation risk.

## 2. Core Collaboration Rules

- One writer, many reviewers.
- Codex is the default committer and integrator.
- Reviewer agents are always read-only and must not be assigned implementation work.
- Claude and Gemini are invoked only through fixed Provider Runner profiles with separate Human Dispatch Authorization; ad-hoc CLI calls and environment command templates are prohibited.
- Scope Router V2 is advisory and never dispatches a provider. A Host Broker is not required when none is present and verifiable.
- No direct edits to `main`.
- No production file edits without explicit approval.
- No hidden-month reveal without an explicit reveal task.
- No release tags unless explicitly requested.
- Use Git branches and final reports as handoff artifacts.
- Every handoff should state files changed, validation run, known risks, and rollback notes.
- If multiple agents participate, each agent should produce a concise final report rather than making silent changes.

## 3. Branching And Handoff Rules

### Branching
- Use a dedicated feature, spike, or docs branch for each scoped task.
- Keep experimental work in spike branches.
- Keep docs-only changes separate from production code changes when possible.
- Never merge into `main` from an agent session unless the user explicitly asks for that operation.

### Commit Ownership
- Codex is the default committer.
- Reviewer agents should not commit directly unless they are assigned a branch and a precise patch task.
- Commits should be small and named by scope, for example:
  - `docs: add agent team workflow`
  - `fix: stabilize reference shelf toggles`
  - `spike: test sound lab sampler voice`

### Handoff Artifacts
Each handoff should include:
- Branch name.
- Commit SHA, if committed.
- Files changed.
- Validation commands and results.
- Production guardrails checked.
- Known risks.
- Next recommended action.

## 4. Production Guardrails

- Do not edit `outputs/app.js`, `outputs/index.html`, `outputs/styles.css`, or `outputs/data.json` without explicit production-scope approval.
- Do not expose Month 7-8 in normal production.
- Do not add Month 0.
- Do not add new Mini Courses, Practice Tools, or renderer types during a monitoring phase.
- Do not install dependencies or introduce frameworks.
- Do not add network audio, external media dependencies, or third-party runtime libraries without a scoped spike and approval.
- Do not modify frozen Reference Shelf content unless fixing a reported bug.

## 5. Sound Lab V2 Guardrails

Sound Lab V2 work must remain isolated until a spike passes QA and receives approval.

- Keep the current Sound Lab baseline untouched until a spike passes QA.
- No stacked chords.
- No arpeggios.
- Preserve black LED / GUIDE label behavior.
- Month 4 behavior must not change in early phases.
- Tone.js Sampler remains spike-only until approved.
- Do not add Tone.js or any sampler dependency to production during review.
- No autoplay. All audio must remain user-gesture gated.
- Any sampler or tone experiment must have a clear fallback and rollback path.

## 6. Sample Sound Lab V2 Review Workflow

The default sequence is:

```text
PO Contract
-> System CLI Truth
-> Codex Baseline Audit
-> ONE Specialist
-> Evidence Integrity Gate
-> Codex Adjudication
-> Optional Second Opinion
-> PO Approval
-> Codex Implementation
-> Tests/QA
-> Optional Diff Review
-> Commit/Push/Merge Gates
```

### Step 1: Product Owner Contract
Owner: ChatGPT/User as Product Owner, with Codex recording the contract.

Define before review:
- The actual task and acceptance requirements.
- Production behavior that must remain unchanged.
- Allowed files and prohibited scope.
- Required QA and approval gates.
- The intended listening skill, beginner-safe language, and calm private-teacher UX.

Reviewer prompts must not turn an unverified checklist, implementation preference, or reviewer assumption into project ground truth.

### Step 2: System CLI Truth
Owner: Codex.

Before calling a reviewer, use deterministic repository evidence to confirm:
- Repository identity, branch, HEAD SHA, and expected base.
- Worktree status and exact diff scope.
- Relevant tests, counts, hashes, and symbol existence.
- The full source and control flow needed for the review.

Git state, hashes, counts, test results, and symbol existence do not require a model reviewer. System CLI output and repository state remain the source of truth.

### Step 3: Codex Baseline Evidence Packet
Owner: Codex.

Codex must read the relevant source in full before dispatching a reviewer. The review packet must separate confirmed facts from open questions:

```text
CURRENT_BASELINE:
ACTUAL_ACCEPTANCE_REQUIREMENTS:
KNOWN_INTENTIONAL_BEHAVIOR:
CODE_WINDOWS:
MISSING_CONTEXT:
QUESTION_FOR_REVIEWER:
```

For Audio Engine work, the baseline must explicitly determine whether cleanup such as `dispose()` is required, whether one-active/one-release-tail covers the intended lifecycle, and whether `onended` is an acceptance requirement or only an implementation option.

#### Baseline Completeness Gate

Before dispatching a specialist:
- Read every function and code window named in the review scope, including the relevant control flow between them.
- Record enough file and line-window evidence in the execution log to show that each scoped area was reviewed.
- Put any unread, unavailable, or unresolved area under `MISSING_CONTEXT`.
- Do not declare the baseline complete while any required source window remains unread.

### Step 4: One Specialist Review
Owner: One read-only reviewer, with separate Human Dispatch Authorization.

Use no more than one specialist per review stage. Select by task type:

| Task | First reviewer |
| --- | --- |
| Repository code, async behavior, lifecycle, races, and tests | One Qwen or DeepSeek reviewer |
| A browser API, Web Audio semantics, compatibility, or licensing question isolated by the baseline | Gemini |
| Architecture still disputed after Codex adjudication | Claude or AGY as an optional second opinion |
| Git state, hashes, counts, tests, and symbol existence | No model; use System CLI |
| Visual or listening quality | Product Owner QA |

Do not run a hard-coded multi-model chain by default. The reviewer receives the baseline packet and answers the scoped question without defining its own ground truth.

For Audio Engine work, start with one code reviewer when the question concerns control flow, lifecycle, races, or tests. Codex adjudicates that result first. Gemini may be dispatched afterward only when the remaining dispute depends on Web Audio or browser semantics; this is a conditional second opinion, not a default second stage.

### Step 5: Evidence Integrity Gate
Owner: Codex.

Preserve provider evidence before evaluating findings. Reports must keep these sections separate:

```text
A. PROVIDER RAW RESULT
- execution status
- requested model
- provider-reported model
- raw response
- timeout, retry, and fallback metadata

B. CODEX ADJUDICATION
- CONFIRMED
- ALREADY_HANDLED
- FALSE_POSITIVE
- NEEDS_MORE_CONTEXT
```

Do not label non-Qwen output as `QWEN_VERDICT`. If a request times out, fails, or returns an empty raw response, record that execution state and do not manufacture or import findings from another run.

### Step 6: Codex Adjudication
Owner: Codex.

Codex checks every reviewer finding against:
- The full source and control flow.
- The Product Owner contract.
- Deterministic tests and repository evidence.
- Known intentional behavior and guardrails.

Reviewer output is advisory and never self-approves a defect, patch, or scope expansion. Codex presents the adjudicated findings to the Product Owner before implementation.

#### Contract Consistency Gate

Before issuing the final adjudication, Codex must:
- Re-read the Product Owner question and each behavioral acceptance requirement.
- Distinguish intentional behavior from behavior that complies with the stated requirement.
- Distinguish bounded lifetime from bounded concurrent count.
- Distinguish the absence of a permanent resource leak from compliance with a voice or overlap policy.
- Classify an observed behavior that contradicts the requirement as `CONFIRMED`, even when the behavior is intentional and cleanup occurs later.

A finding may be intentional and non-leaking, yet still violate the Product Owner's behavioral acceptance requirement.

### Step 7: Optional Second Opinion
Owner: One additional read-only reviewer.

A second opinion is allowed only when:
- A finding has high production impact.
- Codex cannot resolve it from the full source.
- Reviewer output conflicts with deterministic evidence.
- The Product Owner requests an independent review.

The second opinion must be recorded as a separate raw result and adjudicated independently. It must not become a default continuation of the first review.

### Step 8: Product Owner Approval
Owner: ChatGPT/User as Product Owner.

The Product Owner approves which adjudicated defects, if any, Codex may implement. Review findings alone do not authorize file changes, production activation, or scope expansion.

### Step 9: Codex Implementation
Owner: Codex as sole writer and integrator.

Only after approval:
- Apply the smallest scoped patch on the assigned branch.
- Preserve production, curriculum, and Sound Lab guardrails.
- Record the exact files changed.
- Do not allow a reviewer or evaluator to auto-repair files.

### Step 10: Deterministic Tests And QA
Owner: Codex for automated checks; Product Owner for visual and listening QA.

Run the checks required by the approved contract, including as applicable:
- Automated lifecycle and regression tests.
- Browser console and interaction checks.
- 390px and 430px layout checks.
- Button reachability and body-overflow checks.
- User-gesture audio unlock and fallback checks.
- Product Owner browser/audio listening QA.

### Step 11: Optional Post-Change Diff Review
Owner: One read-only reviewer, with Codex adjudicating.

Use one post-change diff review only for a high-risk patch or when the Product Owner requests it. Review the scoped diff and test evidence, not an unbounded repository snapshot.

### Step 12: Commit, Push, And Merge Gates
Owner: Product Owner for authorization; Codex for execution.

After validation:
- Report the branch, exact diff scope, tests, QA, risks, and rollback notes.
- Commit, push, merge, tag, or activate production only with the corresponding Product Owner authorization.
- Keep direct edits to `main`, reviewer self-approval, and model-driven auto-repair prohibited.

## 7. Final Report Template

```md
## Final Report

- Branch:
- Commit:
- Files changed:
- Validation:
- Production guardrails:
- Hidden months status:
- Audio guardrails:
- Remaining risks:
- Next action:
```

## 8. Current Pause Rule

If the project is in Post-Release Monitoring, agents must not initiate new features, Practice Tools, Mini Courses, public reveals, or redesigns. Agents may perform documentation cleanup, read-only audits, bug verification, and explicitly requested small fixes only.
