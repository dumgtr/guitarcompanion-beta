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

| Model | Status | Flag Required | Purpose & Constraints |
|---|---|---|---|
| `qwen3.8-max-preview` | Experimental | `--allow-experimental` | Product Owner-authorized A/B evaluation only |
| `qwen3.7-max-preview` | Experimental | `--allow-experimental` | Preview evaluation of qwen3.7-max capabilities; text-only, thinking-required |
| `qwen3.6-max-preview` | Experimental | `--allow-experimental` | Legacy preview; thinking enabled by default. **Scheduled for deprecation on 2026-10-10** (Replacement: `qwen3.7-max`) |
| `qwen3.7-plus-2026-05-26` | Snapshot | `--allow-reproducibility` | Reproduce a prior Plus review exactly |
| `qwen3.7-max-2026-06-08` | Snapshot | `--allow-reproducibility` | Reproduce a prior Max review exactly |
| `qwen3.7-max-2026-05-20` | Snapshot | `--allow-reproducibility` | Reproduce an exact qwen3.7-max-2026-05-20 review |
| `qwen3.7-max-2026-05-17` | Snapshot | `--allow-reproducibility` | Reproduce an early exact qwen3.7-max-2026-05-17 review; thinking-required |
| `qwen3.6-flash-2026-04-16` | Snapshot | `--allow-reproducibility` | Reproduce an exact qwen3.6-flash-2026-04-16 review; thinking off |
| `qwen3.6-plus-2026-04-02` | Snapshot | `--allow-reproducibility` | Reproduce an exact qwen3.6-plus-2026-04-02 review |
| `qwen3.6-27b` | Hosted Open-Source | Explicit `--model` | Explicit evaluation of hosted 27B open-source model; thinking off |
| `qwen3.6-35b-a3b` | Hosted Open-Source | Explicit `--model` | Explicit evaluation of hosted 35B open-source model; thinking off |
| `qwen3.5-plus` | Explicit Stable | Explicit `--model` | Explicit evaluation of stable qwen3.5-plus model |
| `qwen3.5-27b` | Hosted Open-Source | Explicit `--model` | Explicit evaluation of hosted qwen3.5-27b open-source model |
| `qwen3.5-35b-a3b` | Hosted Open-Source | Explicit `--model` | Explicit evaluation of hosted qwen3.5-35b-a3b open-source model |
| `qwen3.5-122b-a10b` | Hosted Open-Source | Explicit `--model` | Explicit evaluation of hosted qwen3.5-122b-a10b open-source model |
| `qwen3.5-397b-a17b` | Hosted Open-Source | Explicit `--model` | Explicit evaluation of hosted qwen3.5-397b-a17b open-source model |
| `qwen3.5-plus-2026-02-15` | Snapshot | `--allow-reproducibility` | Reproduce an exact qwen3.5-plus-2026-02-15 review |
| `qwen3.5-plus-2026-04-20` | Snapshot | `--allow-reproducibility` | Reproduce an exact qwen3.5-plus-2026-04-20 review |
| `qwen3.5-flash-2026-02-23` | Snapshot | `--allow-reproducibility` | Reproduce an exact qwen3.5-flash-2026-02-23 review |
| `qwen3-coder-plus` | Compatibility | `--allow-compatibility` | Existing validated coder prompts and historical comparison |
| `qwen-turbo` | Compatibility | `--allow-compatibility` | Existing narrow traces and historical comparison |

Preview, snapshot, and open-source IDs are never selected automatically. None of these models may appear in Auto Routing V2. `qwen3-coder-plus` and `qwen-turbo` remain available only for explicit compatibility use; new workflows should normally use `qwen3.7-plus` or `qwen3.6-flash`.

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
- `qwen3.7-max-preview` and `qwen3.7-max-2026-05-17`: thinking required / on by default.
- `qwen3.6-27b`, `qwen3.6-35b-a3b`, `qwen3.6-flash-2026-04-16`, `qwen3-coder-plus`, and `qwen-turbo`: thinking off; do not send unsupported thinking configuration.

The Coordinator may intentionally override a supported model's thinking setting for a scoped experiment, but the override must be visible in the command/report and must not become silent fallback behavior.

Note: Setting `enable_thinking: false` in `requestDefaults` for certain models represents a verified runner request default that succeeded in live Direct API probes. It does not imply or claim that the provider lacks thinking capability for those models.

## Manual Authorization Flags

```powershell
# Preview / Experimental
python -B agent_tools/qwen_agent.py --prompt "Reply exactly OK" --model qwen3.7-max-preview --allow-experimental

# Snapshot / Reproducibility
python -B agent_tools/qwen_agent.py --prompt "Reply exactly OK" --model qwen3.6-flash-2026-04-16 --allow-reproducibility

# Hosted Open-Source Exact Model (Explicit --model only)
python -B agent_tools/qwen_agent.py --prompt "Reply exactly OK" --model qwen3.6-27b

# Compatibility Model
python -B agent_tools/qwen_model_policy.py --validate-model qwen3-coder-plus --allow-compatibility
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
