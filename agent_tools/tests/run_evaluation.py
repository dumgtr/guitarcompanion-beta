from __future__ import annotations

import os
import sys
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FIXTURE = ROOT / "experiments" / "qwen-api-hardening" / "fixtures" / "known_bad_audio_engine.js"
TEMPLATE = ROOT / "prompts" / "qwen_concurrency_evaluation_prompt.txt"
AGENT_SCRIPT = ROOT / "agent_tools" / "qwen_agent.py"


def configure_utf8() -> None:
    """Safely configure stdout and stderr for UTF-8 when reconfigure is available."""
    for stream in (sys.stdout, sys.stderr):
        reconfigure = getattr(stream, "reconfigure", None)
        if callable(reconfigure):
            try:
                reconfigure(encoding="utf-8", errors="replace")
            except Exception:
                pass


def safe_print_unicode(text: str, file=sys.stdout) -> None:
    """Print Unicode safely even when stdout is redirected or lacks UTF-8 support."""
    try:
        file.write(text)
    except UnicodeEncodeError:
        encoding = file.encoding or "utf-8"
        file.write(text.encode(encoding, errors="replace").decode(encoding))


def run_evaluation() -> int:
    configure_utf8()
    safe_print_unicode("=== Running Qwen Model Evaluation on Known-Bad Fixture ===\n")

    api_key = os.environ.get("DASHSCOPE_API_KEY")
    base_url = os.environ.get("DASHSCOPE_BASE_URL")

    if not api_key or not base_url:
        safe_print_unicode("SKIP: Live evaluation skipped. Set DASHSCOPE_API_KEY and DASHSCOPE_BASE_URL.\n")
        return 0

    if not FIXTURE.exists():
        safe_print_unicode(f"FAIL: Fixture not found at {FIXTURE}\n")
        return 1

    if not TEMPLATE.exists():
        safe_print_unicode(f"FAIL: Prompt template not found at {TEMPLATE}\n")
        return 1

    # Load templates and fixture
    fixture_code = FIXTURE.read_text(encoding="utf-8")
    template_text = TEMPLATE.read_text(encoding="utf-8")

    # Replace placeholder
    full_prompt = template_text.replace(
        "// ซอร์สโค้ดของ known_bad_audio_engine.js ที่จัดเตรียมไว้",
        fixture_code
    )

    temp_prompt_file = ROOT / "agent_tools" / "tests" / "temp_eval_prompt.txt"
    temp_prompt_file.write_text(full_prompt, encoding="utf-8")

    out_dir = ROOT / "experiments" / "qwen-api-hardening"
    out_dir.mkdir(parents=True, exist_ok=True)

    out_report = out_dir / "qwen_evaluation_report.md"

    cmd = [
        sys.executable,
        str(AGENT_SCRIPT),
        "--prompt", full_prompt,
        "--model", "qwen3.7-plus",
        "--out", str(out_report)
    ]

    safe_print_unicode("Sending evaluation request to qwen3.7-plus (thinking mode on)...\n")
    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")

    # Clean up temp file
    if temp_prompt_file.exists():
        temp_prompt_file.unlink()

    safe_print_unicode(f"Exit code: {result.returncode}\n")
    if result.returncode != 0:
        safe_print_unicode(f"FAIL: Qwen agent exited with code {result.returncode}\n")
        safe_print_unicode(f"Stderr:\n{result.stderr}\n")
        return 1

    safe_print_unicode(f"Evaluation report generated successfully at {out_report}\n")
    safe_print_unicode("\n--- REPORT PREVIEW ---\n")
    report_text = out_report.read_text(encoding="utf-8")

    # print first 40 lines safely
    lines = report_text.splitlines()
    for line in lines[:40]:
        safe_print_unicode(line + "\n")
    safe_print_unicode("... (truncated)\n")

    return 0


if __name__ == "__main__":
    sys.exit(run_evaluation())
