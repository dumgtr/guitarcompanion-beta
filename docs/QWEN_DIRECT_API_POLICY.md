# Qwen Direct API — Lean Model Policy

Status: Workflow Policy
Last reviewed: 2026-07-21

## Principle

The direct API may expose dozens of Qwen model IDs. Guitar Companion uses three stable aliases for automatic routing and keeps preview, snapshot, and older compatibility models manual-only.

Availability in a public catalog is not enough. The exact model ID must also pass a live access probe in the current Alibaba Model Studio workspace and region before first use.

## Automatic Models

| Model | Thinking default | Role |
|---|---:|---|
| `qwen3.6-flash` | Off | Small, low-risk review |
| `qwen3.7-plus` | On | Default architecture, code, lifecycle, regression, and test review |
| `qwen3.7-max` | On | Critical or disputed review only |

## Explicit-only Models

| Model | Status | Purpose |
|---|---|---|
| `qwen3.8-max-preview` | Experimental | Product Owner-authorized A/B evaluation only |
| `qwen3.7-plus-2026-05-26` | Snapshot | Reproduce a prior Plus review exactly |
| `qwen3.7-max-2026-06-08` | Snapshot | Reproduce a prior Max review exactly |
| `qwen3-coder-plus` | Compatibility | Existing validated coder prompts and historical comparison |
| `qwen-turbo` | Compatibility | Existing narrow traces and historical comparison |

Preview and snapshot IDs are never selected automatically. `qwen3-coder-plus` and `qwen-turbo` remain available only for explicit compatibility use; new workflows should normally use `qwen3.7-plus` or `qwen3.6-flash`.

## Lean Selection

```text
Can CLI prove it deterministically?
  YES -> no Qwen
  NO  -> Critical or disputed?
          YES -> qwen3.7-max
          NO  -> Very small, low-risk review?
                  YES -> qwen3.6-flash
                  NO  -> qwen3.7-plus
```

No automatic retry changes the model. An API execution failure is not a review `FAIL`.

## Thinking Mode

- `qwen3.6-flash`: thinking off by default to keep small reviews fast and inexpensive.
- `qwen3.7-plus`: thinking on for architecture and code reasoning.
- `qwen3.7-max`: thinking on for critical analysis.
- `qwen3-coder-plus` and `qwen-turbo`: thinking off; do not send unsupported thinking configuration.

The Coordinator may intentionally override a supported model's thinking setting for a scoped experiment, but the override must be visible in the command/report and must not become silent fallback behavior.

## Manual Authorization Flags

```powershell
python agent_tools/qwen_model_policy.py --validate-model qwen3-coder-plus --allow-compatibility
python agent_tools/qwen_model_policy.py --validate-model qwen3.8-max-preview --allow-experimental
python agent_tools/qwen_model_policy.py --validate-model qwen3.7-max-2026-06-08 --allow-reproducibility
```

## Direct-API Rules

- The Coordinator chooses the model; the model never changes itself.
- No silent fallback or automatic escalation.
- Only supplied files count as reviewed evidence.
- Current baseline and proposed design must be separated.
- Qwen reports are advisory and cannot grant final visual or auditory acceptance.
- Stable aliases are preferred for normal work.
- Fixed snapshots are used only when reproducibility is more important than receiving alias updates.
- Preview models cannot serve as the sole acceptance gate.

## Adding Another Model

Add a model only when all conditions are met:

1. A real workflow need is not covered by the three automatic models.
2. The exact ID succeeds in the active workspace/region.
3. Provider-reported identity, UTF-8 output, context size, cost, and thinking/tool behavior are verified.
4. A neutral smoke review produces grounded file/symbol evidence.
5. Product Owner approves the allowlist change.

## Helper Integration

`qwen_model_policy.py --json` now returns `requestDefaults`, allowing `qwen_agent.py` to apply the correct thinking configuration without maintaining a second model table.

```powershell
python agent_tools/qwen_model_policy.py --task-type architecture --json
```

Expected core fields:

```json
{
  "model": "qwen3.7-plus",
  "requestDefaults": {
    "enable_thinking": true
  },
  "fallback": null
}
```

When an explicit model ID is supplied, validate it first. Never catch a policy error and substitute another model.
