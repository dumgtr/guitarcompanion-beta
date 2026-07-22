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
        "dispatchQwen": True,
        "model": "qwen3.7-plus",
        "status": "allowed",
        "requestDefaults": {"enable_thinking": True},
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
