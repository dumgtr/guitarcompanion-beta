from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "qwen_model_policy.py"


def run(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(SCRIPT), *args],
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )


def test_inventory_skips_qwen() -> None:
    result = run("--task-type", "inventory")
    assert result.returncode == 0
    assert result.stdout.strip() == "NO_QWEN"


def test_cheapest_model() -> None:
    result = run("--task-type", "cheapest-review")
    assert result.returncode == 0
    assert result.stdout.strip() == "qwen-flash"


def test_economy_model() -> None:
    result = run("--task-type", "economy-review")
    assert result.returncode == 0
    assert result.stdout.strip() == "qwen3.5-flash"


def test_fast_model() -> None:
    result = run("--task-type", "fast-review")
    assert result.returncode == 0
    assert result.stdout.strip() == "qwen3.6-flash"


def test_default_architecture_model() -> None:
    result = run("--task-type", "architecture")
    assert result.returncode == 0
    assert result.stdout.strip() == "qwen3.7-plus"


def test_critical_model() -> None:
    result = run("--task-type", "critical")
    assert result.returncode == 0
    assert result.stdout.strip() == "qwen3.7-max"


def test_unlisted_model_is_denied() -> None:
    result = run("--validate-model", "qwen-random-preview")
    assert result.returncode == 2
    assert "not allowed" in result.stderr


def test_compatibility_model_requires_override() -> None:
    denied = run("--validate-model", "qwen3-coder-plus")
    assert denied.returncode == 2
    allowed = run(
        "--validate-model",
        "qwen3-coder-plus",
        "--allow-compatibility",
    )
    assert allowed.returncode == 0
    assert allowed.stdout.strip() == "qwen3-coder-plus"


def test_preview_model_requires_override() -> None:
    denied = run("--validate-model", "qwen3.8-max-preview")
    assert denied.returncode == 2
    allowed = run(
        "--validate-model",
        "qwen3.8-max-preview",
        "--allow-experimental",
    )
    assert allowed.returncode == 0
    assert allowed.stdout.strip() == "qwen3.8-max-preview"


def test_snapshot_model_requires_override() -> None:
    denied = run("--validate-model", "qwen3.7-max-2026-06-08")
    assert denied.returncode == 2
    allowed = run(
        "--validate-model",
        "qwen3.7-max-2026-06-08",
        "--allow-reproducibility",
    )
    assert allowed.returncode == 0
    assert allowed.stdout.strip() == "qwen3.7-max-2026-06-08"


def test_json_output_includes_request_defaults_and_no_fallback() -> None:
    result = run("--task-type", "architecture", "--json")
    assert result.returncode == 0
    payload = json.loads(result.stdout)
    assert payload == {
        "taskType": "architecture",
        "costPriority": None,
        "dispatchQwen": True,
        "model": "qwen3.7-plus",
        "status": "allowed",
        "requestDefaults": {"enable_thinking": True},
        "routing_mode": "auto",
        "routing_reason": "default task route",
        "fallback": None,
    }


def test_fast_review_disables_thinking() -> None:
    result = run("--task-type", "small-review", "--json")
    assert result.returncode == 0
    payload = json.loads(result.stdout)
    assert payload["model"] == "qwen3.6-flash"
    assert payload["requestDefaults"] == {"enable_thinking": False}


def test_coder_compatibility_disables_thinking() -> None:
    result = run(
        "--validate-model",
        "qwen3-coder-plus",
        "--allow-compatibility",
        "--json",
    )
    assert result.returncode == 0
    payload = json.loads(result.stdout)
    assert payload["requestDefaults"] == {"enable_thinking": False}


def test_explicit_model_overrides_cost_priority() -> None:
    result = run("--validate-model", "qwen3.7-plus")
    assert result.returncode == 0
    assert result.stdout.strip() == "qwen3.7-plus"


def test_cheapest_cost_priority_routes_to_qwen_flash() -> None:
    result = run("--task-type", "code-review", "--cost-priority", "cheapest")
    assert result.returncode == 0
    assert "selected_model: qwen-flash" in result.stdout
    assert "routing_mode: auto-cost-priority" in result.stdout
    assert "routing_reason: explicit cheapest cost priority" in result.stdout


def test_economy_cost_priority_routes_to_qwen3_5_flash() -> None:
    result = run("--task-type", "code-review", "--cost-priority", "economy")
    assert result.returncode == 0
    assert "selected_model: qwen3.5-flash" in result.stdout
    assert "routing_mode: auto-cost-priority" in result.stdout
    assert "routing_reason: explicit economy cost priority" in result.stdout


def test_fast_cost_priority_routes_to_qwen3_6_flash() -> None:
    result = run("--task-type", "code-review", "--cost-priority", "fast")
    assert result.returncode == 0
    assert "selected_model: qwen3.6-flash" in result.stdout
    assert "routing_mode: auto-cost-priority" in result.stdout
    assert "routing_reason: explicit fast cost priority" in result.stdout


def test_cost_priority_overrides_default_task_route() -> None:
    result = run("--task-type", "code-review", "--cost-priority", "cheapest")
    assert result.returncode == 0
    assert "selected_model: qwen-flash" in result.stdout


def test_critical_task_with_cheapest_does_not_escalate() -> None:
    result = run("--task-type", "critical", "--cost-priority", "cheapest")
    assert result.returncode == 0
    assert "selected_model: qwen-flash" in result.stdout


def test_unavailable_cheapest_fails_closed() -> None:
    result = run("--task-type", "code-review", "--cost-priority", "invalid-cost")
    assert result.returncode == 2


def test_vl_preview_snapshot_never_auto_selected() -> None:
    result = run("--list-models", "--json")
    assert result.returncode == 0
    payload = json.loads(result.stdout)
    for model in payload["models"]:
        if model["status"] in ["experimental", "reproducibility"]:
            assert not model["autoSelectable"]
            assert model["selectionMode"] == "explicit-only"


def test_no_silent_fallback_after_transport_failure() -> None:
    result = run("--task-type", "code-review", "--json")
    assert result.returncode == 0
    payload = json.loads(result.stdout)
    assert payload["fallback"] is None


def test_all_sixteen_new_models_present_and_explicit_only() -> None:
    new_models = [
        ("qwen3.7-max-preview", "experimental", "--allow-experimental"),
        ("qwen3.6-max-preview", "experimental", "--allow-experimental"),
        ("qwen3.7-max-2026-05-20", "reproducibility", "--allow-reproducibility"),
        ("qwen3.7-max-2026-05-17", "reproducibility", "--allow-reproducibility"),
        ("qwen3.6-flash-2026-04-16", "reproducibility", "--allow-reproducibility"),
        ("qwen3.6-plus-2026-04-02", "reproducibility", "--allow-reproducibility"),
        ("qwen3.6-27b", "allowed", None),
        ("qwen3.6-35b-a3b", "allowed", None),
        ("qwen3.5-plus", "allowed", None),
        ("qwen3.5-27b", "allowed", None),
        ("qwen3.5-35b-a3b", "allowed", None),
        ("qwen3.5-122b-a10b", "allowed", None),
        ("qwen3.5-397b-a17b", "allowed", None),
        ("qwen3.5-plus-2026-02-15", "reproducibility", "--allow-reproducibility"),
        ("qwen3.5-plus-2026-04-20", "reproducibility", "--allow-reproducibility"),
        ("qwen3.5-flash-2026-02-23", "reproducibility", "--allow-reproducibility"),
    ]

    result = run("--list-models", "--json")
    assert result.returncode == 0
    models_list = json.loads(result.stdout)["models"]
    model_names = [m["model"] for m in models_list]
    assert len(model_names) == len(set(model_names)), "Duplicate model IDs found in catalog!"

    for model_id, status, flag in new_models:
        assert model_id in model_names, f"Model {model_id} missing from catalog!"
        item = next(m for m in models_list if m["model"] == model_id)
        assert item["autoSelectable"] is False, f"Model {model_id} must not be auto-selectable!"
        assert item["selectionMode"] == "explicit-only", f"Model {model_id} must be explicit-only!"

    policy = json.loads(ROOT.joinpath("qwen_models.json").read_text(encoding="utf-8"))
    auto_routes = list(policy.get("autoRouting", {}).values())
    for model_id, _, _ in new_models:
        assert model_id not in auto_routes, f"Model {model_id} must not appear in autoRouting!"

    for model_id, status, flag in new_models:
        if flag:
            denied = run("--validate-model", model_id)
            assert denied.returncode == 2, f"Model {model_id} without {flag} must fail!"
            allowed = run("--validate-model", model_id, flag)
            assert allowed.returncode == 0, f"Model {model_id} with {flag} must succeed!"
            assert allowed.stdout.strip() == model_id
        else:
            allowed = run("--validate-model", model_id)
            assert allowed.returncode == 0, f"Explicit model {model_id} must succeed!"
            assert allowed.stdout.strip() == model_id


def test_deepseek_and_glm_models_authorized_explicit_only() -> None:
    target_models = [
        "deepseek-v4-flash",
        "deepseek-v4-pro",
        "glm-5.1",
        "glm-5.2",
    ]

    result = run("--list-models", "--json")
    assert result.returncode == 0
    models_list = json.loads(result.stdout)["models"]
    model_names = [m["model"] for m in models_list]

    assert len(model_names) == 30, f"Expected 30 active models, got {len(model_names)}"
    assert len(model_names) == len(set(model_names)), "Duplicate model IDs found in catalog!"

    policy = json.loads(ROOT.joinpath("qwen_models.json").read_text(encoding="utf-8"))
    auto_routes = list(policy.get("autoRouting", {}).values())

    for model_id in target_models:
        assert model_id in model_names, f"Model {model_id} missing from catalog!"
        item = next(m for m in models_list if m["model"] == model_id)
        assert item["autoSelectable"] is False, f"Model {model_id} must not be auto-selectable!"
        assert item["selectionMode"] == "explicit-only", f"Model {model_id} must be explicit-only!"
        assert model_id not in auto_routes, f"Model {model_id} must not appear in autoRouting!"

        allowed = run("--validate-model", model_id)
        assert allowed.returncode == 0, f"Explicit model {model_id} validation failed!"
        assert allowed.stdout.strip() == model_id


def test_deepseek_v3_2_is_denied() -> None:
    result = run("--validate-model", "deepseek-v3.2")
    assert result.returncode == 2, "deepseek-v3.2 must be denied by policy!"
    assert "not allowed" in result.stderr, "Error message must state not allowed"


def test_qwen3_6_max_preview_lifecycle_deprecation() -> None:
    if str(ROOT) not in sys.path:
        sys.path.insert(0, str(ROOT))
    from qwen_model_policy import validate_model, PolicyError

    valid_res = validate_model("qwen3.6-max-preview", allow_experimental=True, today="2026-09-01")
    assert valid_res["model"] == "qwen3.6-max-preview"
    assert "DEPRECATION_WARNING" in valid_res.get("warning", "")
    assert "2026-10-10" in valid_res.get("warning", "")

    try:
        validate_model("qwen3.6-max-preview", allow_experimental=True, today="2026-10-10")
        assert False, "Should have raised PolicyError after deprecation date"
    except PolicyError as err:
        assert "deprecated on 2026-10-10" in str(err)
        assert "qwen3.7-max" in str(err)


if __name__ == "__main__":
    import sys
    tests = [obj for name, obj in globals().items() if name.startswith("test_") and callable(obj)]
    print(f"Running {len(tests)} tests...")
    failed = 0
    for test in tests:
        try:
            test()
            print(f"  [PASS] {test.__name__}")
        except AssertionError as err:
            print(f"  [FAIL] {test.__name__}: Assertion failed")
            failed += 1
        except Exception as err:
            print(f"  [FAIL] {test.__name__}: {err}")
            failed += 1
    if failed:
        print(f"FAILED ({failed} tests failed)")
        sys.exit(1)
    else:
        print("All tests passed successfully!")
