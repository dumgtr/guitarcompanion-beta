#!/usr/bin/env python3
"""Lean Qwen direct-API model selection for Guitar Companion.

This module does not call the network and never falls back to another model.
It reads qwen_models.json, validates explicit model requests, and selects one
approved stable alias for a small set of task types.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


POLICY_PATH = Path(__file__).with_name("qwen_models.json")

TASK_ROUTES = {
    "factual": None,
    "inventory": None,
    "cheapest-review": "cheapest_review",
    "economy-review": "economy_review",
    "fast-review": "fast_review",
    "small-review": "small_review",
    "prompt-review": "small_review",
    "architecture": "default_review",
    "code-review": "default_review",
    "lifecycle": "default_review",
    "regression": "default_review",
    "test-gap": "default_review",
    "critical": "critical_review",
    "critical-review": "critical_review",
    "disputed": "critical_review",
    "chat": "small_review",
    "semantic-review": "small_review",
}


class PolicyError(ValueError):
    """Raised when a model or task violates the policy."""


def configure_utf8() -> None:
    """Make Windows console output deterministic without dropping characters."""
    for stream in (sys.stdout, sys.stderr):
        reconfigure = getattr(stream, "reconfigure", None)
        if callable(reconfigure):
            reconfigure(encoding="utf-8", errors="backslashreplace")


def load_policy(path: Path = POLICY_PATH) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise PolicyError(f"Policy file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise PolicyError(f"Invalid policy JSON: {exc}") from exc

    if data.get("schemaVersion") != 2:
        raise PolicyError("Unsupported qwen model policy schemaVersion")
    if not isinstance(data.get("models"), dict):
        raise PolicyError("Policy is missing models")
    return data


def validate_model(
    model: str,
    *,
    allow_compatibility: bool = False,
    allow_experimental: bool = False,
    allow_reproducibility: bool = False,
    today: str | None = None,
) -> dict[str, Any]:
    policy = load_policy()
    item = policy["models"].get(model)
    if not item:
        raise PolicyError(f"Model is not allowed: {model}")

    status = item.get("status")
    permitted = (
        status == "allowed"
        or (status == "compatibility" and allow_compatibility)
        or (status == "experimental" and allow_experimental)
        or (status == "reproducibility" and allow_reproducibility)
    )
    if not permitted:
        flag = {
            "compatibility": "--allow-compatibility",
            "experimental": "--allow-experimental",
            "reproducibility": "--allow-reproducibility",
        }.get(status)
        if flag:
            raise PolicyError(f"{status.title()} model requires explicit {flag}: {model}")
        raise PolicyError(f"Model is not active: {model}")

    # Deprecation lifecycle check
    deprecation_date = item.get("deprecationDate")
    warning = None
    if deprecation_date:
        import datetime
        current_date = today or datetime.date.today().isoformat()
        if current_date >= deprecation_date:
            replacement = item.get("replacement", "qwen3.7-max")
            raise PolicyError(
                f"Model {model} was deprecated on {deprecation_date} and is no longer available. "
                f"Recommended replacement: {replacement}"
            )
        else:
            replacement = item.get("replacement", "qwen3.7-max")
            warning = (
                f"DEPRECATION_WARNING: Model {model} is scheduled for deprecation on {deprecation_date}. "
                f"Recommended replacement: {replacement}"
            )

    result = {
        "model": model,
        "status": status,
        "requestDefaults": dict(item.get("requestDefaults") or {}),
        "fallback": None,
    }
    if item.get("thinkingRequired"):
        result["thinkingRequired"] = True
    if warning:
        result["warning"] = warning
    return result


def choose_model(task_type: str, cost_priority: str | None = None) -> dict[str, Any] | None:
    policy = load_policy()
    if task_type not in TASK_ROUTES:
        allowed = ", ".join(sorted(TASK_ROUTES))
        raise PolicyError(f"Unknown task type: {task_type}. Expected one of: {allowed}")

    if cost_priority:
        route = {
            "cheapest": "cheapest_review",
            "economy": "economy_review",
            "fast": "fast_review",
        }.get(cost_priority)
    else:
        route = TASK_ROUTES.get(task_type)

    if route is None:
        return None

    model = policy.get("autoRouting", {}).get(route)
    if not model:
        raise PolicyError(f"No auto route configured for: {route}")

    item = policy["models"].get(model, {})
    if (
        item.get("status") != "allowed"
        or item.get("selectionMode") != "auto"
        or not item.get("autoSelectable")
    ):
        raise PolicyError(f"Auto route points to a non-auto-selectable model: {model}")

    return {
        "model": model,
        "status": item.get("status"),
        "requestDefaults": dict(item.get("requestDefaults") or {}),
        "fallback": None,
    }


def list_models() -> list[dict[str, Any]]:
    policy = load_policy()
    return [
        {
            "model": name,
            "status": item.get("status"),
            "selectionMode": item.get("selectionMode"),
            "autoSelectable": bool(item.get("autoSelectable")),
            "tier": item.get("tier"),
            "requestDefaults": dict(item.get("requestDefaults") or {}),
        }
        for name, item in policy["models"].items()
    ]


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    action = parser.add_mutually_exclusive_group(required=True)
    action.add_argument("--task-type", choices=sorted(TASK_ROUTES))
    action.add_argument("--validate-model")
    action.add_argument("--list-models", action="store_true")
    parser.add_argument(
        "--allow-compatibility",
        action="store_true",
        help="Permit an explicitly requested compatibility model.",
    )
    parser.add_argument(
        "--allow-experimental",
        action="store_true",
        help="Permit an explicitly requested preview/experimental model.",
    )
    parser.add_argument(
        "--allow-reproducibility",
        action="store_true",
        help="Permit an explicitly requested fixed snapshot model.",
    )
    parser.add_argument(
        "--cost-priority",
        choices=["cheapest", "economy", "fast"],
        help="Explicit cost priority constraint overriding task route",
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON output")
    return parser


def main(argv: list[str] | None = None) -> int:
    configure_utf8()
    args = build_parser().parse_args(argv)
    try:
        if args.task_type:
            selected = choose_model(args.task_type, args.cost_priority)
            result = {
                "taskType": args.task_type,
                "costPriority": args.cost_priority,
                "dispatchQwen": selected is not None,
                "model": selected["model"] if selected else None,
                "status": selected["status"] if selected else None,
                "requestDefaults": selected["requestDefaults"] if selected else {},
                "routing_mode": "auto-cost-priority" if args.cost_priority else "auto",
                "routing_reason": f"explicit {args.cost_priority} cost priority" if args.cost_priority else "default task route",
                "fallback": None,
            }
        elif args.validate_model:
            selected = validate_model(
                args.validate_model,
                allow_compatibility=args.allow_compatibility,
                allow_experimental=args.allow_experimental,
                allow_reproducibility=args.allow_reproducibility,
            )
            result = {"valid": True, **selected}
        else:
            result = {"models": list_models(), "fallback": None}
    except PolicyError as exc:
        result = {"valid": False, "error": str(exc), "fallback": None}
        if args.json:
            print(json.dumps(result, ensure_ascii=False, indent=2))
        else:
            print(f"POLICY_ERROR: {exc}", file=sys.stderr)
        return 2

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    elif args.task_type:
        if args.cost_priority:
            model_name = result["model"] or "NO_QWEN"
            print(f"selected_model: {model_name}")
            print(f"routing_mode: {result['routing_mode']}")
            print(f"routing_reason: {result['routing_reason']}")
            print("fallback_occurred: false")
        else:
            print(result["model"] or "NO_QWEN")
    elif args.validate_model:
        print(result["model"])
    else:
        for item in result["models"]:
            thinking = item["requestDefaults"].get("enable_thinking")
            print(
                f"{item['model']}\t{item['status']}\t{item['selectionMode']}\t"
                f"auto={str(item['autoSelectable']).lower()}\t"
                f"thinking={thinking}\t{item['tier']}"
            )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
