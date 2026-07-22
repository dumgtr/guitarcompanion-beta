from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AGENT_SCRIPT = ROOT / "agent_tools" / "qwen_agent.py"


def run_live_smoke_test() -> int:
    print("=== Qwen Agent Live Smoke Test ===")

    api_key = os.environ.get("DASHSCOPE_API_KEY")
    base_url = os.environ.get("DASHSCOPE_BASE_URL")

    if not api_key or not base_url:
        print("SKIP: Live smoke test is skipped. To opt-in, set DASHSCOPE_API_KEY and DASHSCOPE_BASE_URL environment variables.")
        return 0

    print("Live smoke test enabled. Using lightweight model qwen3.6-flash...")

    out_report = ROOT / "agent_tools" / "tests" / "live_smoke_report.md"
    out_metadata = ROOT / "agent_tools" / "tests" / "live_smoke_report.json"

    # Clean up old files
    for f in (out_report, out_metadata):
        if f.exists():
            f.unlink()

    # Call agent with lightweight flash model
    cmd = [
        sys.executable,
        str(AGENT_SCRIPT),
        "--prompt", "Say Hello in exactly one word.",
        "--model", "qwen3.6-flash",
        "--out", str(out_report)
    ]

    print(f"Running command: {' '.join(cmd)}")

    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")

    print(f"Exit code: {result.returncode}")
    print(f"Stdout:\n{result.stdout}")
    print(f"Stderr:\n{result.stderr}")

    if result.returncode != 0:
        print("FAIL: Qwen agent failed live execution.")
        return 1

    if not out_report.exists():
        print("FAIL: Report file was not written.")
        return 1

    if not out_metadata.exists():
        print("FAIL: Metadata JSON sidecar was not written.")
        return 1

    # Verify metadata fields
    try:
        meta = json.loads(out_metadata.read_text(encoding="utf-8"))
        print("\nMetadata Verification:")
        print(f"  Requested Model: {meta['requested_model']}")
        print(f"  Provider Reported Model: {meta['provider_reported_model']}")
        print(f"  Exit Classification: {meta['exit_classification']}")
        print(f"  API Transport Status: {meta['api_transport_status']}")

        # Verify no secrets in metadata
        meta_str = json.dumps(meta)
        if api_key in meta_str:
            print("FAIL: Secret API Key found in metadata sidecar!")
            return 1

        print("\nPASS: Live smoke test completed successfully.")
        return 0
    except Exception as e:
        print(f"FAIL: Failed to parse metadata file: {e}")
        return 1
    finally:
        # Clean up files after validation
        for f in (out_report, out_metadata):
            if f.exists():
                f.unlink()


if __name__ == "__main__":
    sys.exit(run_live_smoke_test())
