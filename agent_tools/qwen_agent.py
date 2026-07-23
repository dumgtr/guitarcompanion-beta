#!/usr/bin/env python3
"""Run one read-only Qwen review via direct HTTP API.

This CLI client integrates Alibaba Model Studio direct API model selection,
handles Unicode console safety, enforces strict model policy validation,
and outputs execution metadata sidecars next to reports.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import sys
import time
import urllib.request
import urllib.error
from typing import Any, Dict, List, Optional

# Configure sys.path so we can import from same directory
sys.path.append(str(Path(__file__).parent))
from qwen_model_policy import validate_model, PolicyError, choose_model, TASK_ROUTES

DEFAULT_MODEL = "qwen3.7-plus"


class ExitCode:
    SUCCESS = 0
    CLI_OR_CONFIG_ERROR = 2
    AUTH_OR_TRANSPORT_ERROR = 3
    API_RESPONSE_ERROR = 4
    MODEL_MISMATCH = 5
    MODEL_IDENTITY_UNVERIFIED = 6
    INPUT_LIMIT_EXCEEDED = 7
    OUTPUT_WRITE_ERROR = 8
    UNEXPECTED_EXCEPTION = 4  # Backwards compatibility


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


def compute_sha256(path: Path) -> str:
    """Compute SHA-256 hash of a file on disk."""
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def compute_string_sha256(text: str) -> str:
    """Compute SHA-256 hash of a string."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def atomic_write_utf8(path: Path, text: str) -> None:
    """Perform an atomic text file write using a temp file with UTF-8 encoding."""
    temp_path = path.with_name(f"{path.name}.tmp")
    temp_path.write_text(text, encoding="utf-8")
    temp_path.replace(path)


def positive_integer(value: str) -> int:
    parsed = int(value)
    if parsed <= 0:
        raise argparse.ArgumentTypeError("value must be greater than zero")
    return parsed


def assemble_prompt(prompt: str, file_labels: list[str], max_chars: int) -> str:
    """Assemble final prompt by appending read-only files within character budget."""
    sections = [prompt]
    total_chars = 0
    for label in file_labels:
        file_path = Path(label)
        if not file_path.exists():
            raise FileNotFoundError(f"input file does not exist: {label}")
        if not file_path.is_file():
            raise IsADirectoryError(f"input path is not a file: {label}")
        text = file_path.read_text(encoding="utf-8")
        total_chars += len(text)
        if total_chars > max_chars:
            raise ValueError(f"combined file text exceeds --max-chars ({max_chars})")
        sections.append(f"\n\n--- BEGIN FILE: {label} ---\n{text}\n--- END FILE: {label} ---")
    return "".join(sections)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run one read-only Qwen review via direct HTTP API.")
    parser.add_argument("--prompt", required=True, help="Prompt text sent to Qwen")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Explicit model selected by the AI Coordinator")
    parser.add_argument("--file", action="append", default=[], help="Text file to append read-only; repeatable")
    parser.add_argument("--out", help="Optional exact path for the final Qwen response")
    parser.add_argument("--timeout", type=positive_integer, default=120, help="Timeout in seconds (default: 120)")
    parser.add_argument("--max-chars", type=positive_integer, default=120000, help="Maximum combined file characters")
    parser.add_argument("--allow-truncation", action="store_true", help="Allow explicit truncation of input files instead of failing closed")
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
        "--task-type",
        choices=sorted(TASK_ROUTES),
        help="Task type for auto-routing selection"
    )
    parser.add_argument(
        "--cost-priority",
        choices=["cheapest", "economy", "fast"],
        help="Explicit cost priority constraint overriding task route"
    )
    return parser


def main() -> int:
    configure_utf8()
    args = build_parser().parse_args()
    start_time = time.time()

    # Preflight metadata variables
    requested_model = args.model
    provider_reported_model = "unavailable"
    exit_classification = "CLI_OR_CONFIG_ERROR"
    api_transport_status = "not_started"
    retry_count = 0
    fallback_occurred = False
    routing_mode = "explicit"
    routing_reason = "explicit coordinate request"

    input_files_metadata = []
    assembled_files_text = []
    overflow_status = "none"
    combined_file_char_count = 0
    report_sha256 = "unavailable"

    # Step 1: Policy validation & Model resolution
    is_model_explicit = any(arg.startswith("--model") for arg in sys.argv)
    resolved_model = args.model
    if args.task_type and not is_model_explicit:
        try:
            selected_info = choose_model(args.task_type, args.cost_priority)
            if selected_info:
                resolved_model = selected_info["model"]
                routing_mode = "auto-cost-priority" if args.cost_priority else "auto"
                routing_reason = f"explicit {args.cost_priority} cost priority" if args.cost_priority else "default task route"
            else:
                safe_print_unicode("NO_QWEN\n", sys.stderr)
                return ExitCode.SUCCESS
        except PolicyError as error:
            safe_print_unicode(f"POLICY_ERROR: {error}\n", sys.stderr)
            return ExitCode.CLI_OR_CONFIG_ERROR

    requested_model = resolved_model

    try:
        selected = validate_model(
            resolved_model,
            allow_compatibility=args.allow_compatibility,
            allow_experimental=args.allow_experimental,
            allow_reproducibility=args.allow_reproducibility,
        )
        if selected.get("warning"):
            safe_print_unicode(f"qwen_agent: {selected['warning']}\n", sys.stderr)
    except PolicyError as error:
        safe_print_unicode(f"POLICY_ERROR: {error}\n", sys.stderr)
        return ExitCode.CLI_OR_CONFIG_ERROR

    # Step 2: Validate API Keys & Endpoint
    api_key = os.environ.get("DASHSCOPE_API_KEY")
    if not api_key:
        safe_print_unicode("MISSING_DASHSCOPE_API_KEY\n", sys.stderr)
        return ExitCode.AUTH_OR_TRANSPORT_ERROR

    base_url = os.environ.get("DASHSCOPE_BASE_URL")
    if not base_url:
        safe_print_unicode("MISSING_DASHSCOPE_BASE_URL\n", sys.stderr)
        return ExitCode.AUTH_OR_TRANSPORT_ERROR

    endpoint = f"{base_url.rstrip('/')}/chat/completions"

    # Step 3: Input file checks and truncation assembly
    prompt_len = len(args.prompt)
    available_budget = max(0, args.max_chars - prompt_len)

    try:
        for label in args.file:
            file_path = Path(label)
            if not file_path.exists():
                raise FileNotFoundError(f"input file does not exist: {label}")
            if not file_path.is_file():
                raise IsADirectoryError(f"input path is not a file: {label}")

            raw_text = file_path.read_text(encoding="utf-8")
            original_chars = len(raw_text)
            file_sha256 = compute_sha256(file_path)

            input_meta = {
                "path": str(label),
                "sha256": file_sha256,
                "original_chars": original_chars,
                "submitted_chars": original_chars,
                "truncated": False
            }

            combined_file_char_count += original_chars
            input_files_metadata.append(input_meta)
            assembled_files_text.append((label, raw_text))

        # Check for overflow
        if combined_file_char_count > available_budget:
            if not args.allow_truncation:
                overflow_status = "fail_closed"
                exit_classification = "INPUT_LIMIT_EXCEEDED"
                safe_print_unicode(
                    f"INPUT_LIMIT_EXCEEDED: Combined file characters ({combined_file_char_count}) "
                    f"exceeded available budget ({available_budget}) under --max-chars ({args.max_chars}).\n",
                    sys.stderr
                )
                write_sidecar(
                    args.out,
                    requested_model=requested_model,
                    provider_reported_model=provider_reported_model,
                    input_files=input_files_metadata,
                    prompt=args.prompt,
                    combined_file_char_count=combined_file_char_count,
                    overflow_status=overflow_status,
                    api_transport_status=api_transport_status,
                    exit_classification=exit_classification,
                    elapsed_time=time.time() - start_time,
                    retry_count=retry_count,
                    fallback_occurred=fallback_occurred,
                    report_sha256=report_sha256
                )
                return ExitCode.INPUT_LIMIT_EXCEEDED
            else:
                overflow_status = "truncated"
                # Distribute truncation budget
                # Simple truncation: fit what we can file-by-file
                current_used = 0
                final_assembled = []
                for idx, (label, text) in enumerate(assembled_files_text):
                    space_left = available_budget - current_used
                    if space_left <= 0:
                        # Fully truncated
                        input_files_metadata[idx]["submitted_chars"] = 0
                        input_files_metadata[idx]["truncated"] = True
                    elif len(text) > space_left:
                        truncated_text = text[:space_left]
                        final_assembled.append((label, truncated_text))
                        input_files_metadata[idx]["submitted_chars"] = space_left
                        input_files_metadata[idx]["truncated"] = True
                        current_used += space_left
                    else:
                        final_assembled.append((label, text))
                        current_used += len(text)
                assembled_files_text = final_assembled

    except Exception as error:
        safe_print_unicode(f"qwen_agent: Input processing error: {error}\n", sys.stderr)
        return ExitCode.CLI_OR_CONFIG_ERROR

    # Assemble final prompt
    sections = [args.prompt]
    for label, text in assembled_files_text:
        sections.append(f"\n\n--- BEGIN FILE: {label} ---\n{text}\n--- END FILE: {label} ---")
    assembled_prompt = "".join(sections)

    # Step 4: Construct payload body
    payload = {
        "model": requested_model,
        "messages": [
            {
                "role": "user",
                "content": assembled_prompt
            }
        ],
        "stream": False
    }

    # Apply requestDefaults from policy
    request_defaults = selected.get("requestDefaults") or {}
    for key, val in request_defaults.items():
        payload[key] = val

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    )

    # Step 5: Send API request with retry transport
    api_transport_status = "started"
    response_body = ""
    max_attempts = int(os.environ.get("AGENT_RETRIES", "1")) + 1

    for attempt in range(1, max_attempts + 1):
        if attempt > 1:
            retry_count += 1
            time.sleep(1) # simple backoff
        try:
            with urllib.request.urlopen(req, timeout=args.timeout) as response:
                response_body = response.read().decode("utf-8")
                api_transport_status = "success"
                break
        except urllib.error.HTTPError as error:
            try:
                error_body = error.read().decode("utf-8")
            except Exception:
                error_body = ""
            safe_print_unicode(f"qwen_agent: HTTP {error.code} {error.reason}\n{error_body}\n", sys.stderr)
            api_transport_status = f"http_error_{error.code}"
        except urllib.error.URLError as error:
            safe_print_unicode(f"qwen_agent: Network error: {error.reason}\n", sys.stderr)
            api_transport_status = "network_error"
        except Exception as error:
            safe_print_unicode(f"qwen_agent: Unexpected transport error: {error}\n", sys.stderr)
            api_transport_status = "unexpected_error"

    if api_transport_status != "success":
        exit_classification = "AUTH_OR_TRANSPORT_ERROR"
        write_sidecar(
            args.out,
            requested_model=requested_model,
            provider_reported_model=provider_reported_model,
            input_files=input_files_metadata,
            prompt=args.prompt,
            combined_file_char_count=combined_file_char_count,
            overflow_status=overflow_status,
            api_transport_status=api_transport_status,
            exit_classification=exit_classification,
            elapsed_time=time.time() - start_time,
            retry_count=retry_count,
            fallback_occurred=fallback_occurred,
            report_sha256=report_sha256,
            routing_mode=routing_mode,
            routing_reason=routing_reason
        )
        return ExitCode.AUTH_OR_TRANSPORT_ERROR

    # Step 6: Parse Response
    try:
        response_json = json.loads(response_body)
    except json.JSONDecodeError:
        safe_print_unicode("qwen_agent: Invalid JSON response\n", sys.stderr)
        exit_classification = "API_RESPONSE_ERROR"
        write_sidecar(
            args.out,
            requested_model=requested_model,
            provider_reported_model=provider_reported_model,
            input_files=input_files_metadata,
            prompt=args.prompt,
            combined_file_char_count=combined_file_char_count,
            overflow_status=overflow_status,
            api_transport_status="invalid_json",
            exit_classification=exit_classification,
            elapsed_time=time.time() - start_time,
            retry_count=retry_count,
            fallback_occurred=fallback_occurred,
            report_sha256=report_sha256,
            routing_mode=routing_mode,
            routing_reason=routing_reason
        )
        return ExitCode.API_RESPONSE_ERROR

    # Step 7: Enforce strict model identity checks
    reported_model = response_json.get("model")
    if not reported_model:
        safe_print_unicode("MODEL_IDENTITY_UNVERIFIED\n", sys.stderr)
        exit_classification = "MODEL_IDENTITY_UNVERIFIED"
        write_sidecar(
            args.out,
            requested_model=requested_model,
            provider_reported_model=provider_reported_model,
            input_files=input_files_metadata,
            prompt=args.prompt,
            combined_file_char_count=combined_file_char_count,
            overflow_status=overflow_status,
            api_transport_status="success",
            exit_classification=exit_classification,
            elapsed_time=time.time() - start_time,
            retry_count=retry_count,
            fallback_occurred=fallback_occurred,
            report_sha256=report_sha256,
            routing_mode=routing_mode,
            routing_reason=routing_reason
        )
        return ExitCode.MODEL_IDENTITY_UNVERIFIED

    provider_reported_model = reported_model

    # Check for silent substitution
    is_mismatch = (
        reported_model != requested_model
        and not reported_model.startswith(requested_model + "-")
        and not reported_model.startswith(requested_model)
    )
    if is_mismatch:
        safe_print_unicode("MODEL_MISMATCH\n", sys.stderr)
        safe_print_unicode(f"Requested model: {requested_model}\n", sys.stderr)
        safe_print_unicode(f"Provider model: {reported_model}\n", sys.stderr)
        exit_classification = "MODEL_MISMATCH"
        write_sidecar(
            args.out,
            requested_model=requested_model,
            provider_reported_model=provider_reported_model,
            input_files=input_files_metadata,
            prompt=args.prompt,
            combined_file_char_count=combined_file_char_count,
            overflow_status=overflow_status,
            api_transport_status="success",
            exit_classification=exit_classification,
            elapsed_time=time.time() - start_time,
            retry_count=retry_count,
            fallback_occurred=fallback_occurred,
            report_sha256=report_sha256,
            routing_mode=routing_mode,
            routing_reason=routing_reason
        )
        return ExitCode.MODEL_MISMATCH

    choices = response_json.get("choices", [])
    if not choices:
        safe_print_unicode("qwen_agent: Missing choices in response\n", sys.stderr)
        exit_classification = "API_RESPONSE_ERROR"
        return ExitCode.API_RESPONSE_ERROR

    content = choices[0].get("message", {}).get("content")
    if content is None:
        safe_print_unicode("qwen_agent: Missing response content\n", sys.stderr)
        exit_classification = "API_RESPONSE_ERROR"
        return ExitCode.API_RESPONSE_ERROR

    # Print clean ASCII or safe console output
    safe_print_unicode("\n")
    safe_print_unicode(content)
    safe_print_unicode("\n")

    # Step 8: Write output files
    if args.out:
        try:
            out_path = Path(args.out)
            atomic_write_utf8(out_path, content)

            # Compute final report hash
            h_rep = hashlib.sha256()
            h_rep.update(content.encode("utf-8"))
            report_sha256 = h_rep.hexdigest()
            exit_classification = "SUCCESS"
        except OSError as error:
            safe_print_unicode(f"qwen_agent: could not write --out path: {error}\n", sys.stderr)
            exit_classification = "OUTPUT_WRITE_ERROR"
            return ExitCode.OUTPUT_WRITE_ERROR

    # Write JSON metadata sidecar
    write_sidecar(
        args.out,
        requested_model=requested_model,
        provider_reported_model=provider_reported_model,
        input_files=input_files_metadata,
        prompt=args.prompt,
        combined_file_char_count=combined_file_char_count,
        overflow_status=overflow_status,
        api_transport_status=api_transport_status,
        exit_classification=exit_classification,
        elapsed_time=time.time() - start_time,
        retry_count=retry_count,
        fallback_occurred=fallback_occurred,
        report_sha256=report_sha256,
        routing_mode=routing_mode,
        routing_reason=routing_reason
    )

    return ExitCode.SUCCESS


def write_sidecar(
    out_path_str: Optional[str],
    *,
    requested_model: str,
    provider_reported_model: str,
    input_files: List[Dict[str, Any]],
    prompt: str,
    combined_file_char_count: int,
    overflow_status: str,
    api_transport_status: str,
    exit_classification: str,
    elapsed_time: float,
    retry_count: int,
    fallback_occurred: bool,
    report_sha256: str,
    routing_mode: str = "explicit",
    routing_reason: str = "explicit coordinate request"
) -> None:
    if not out_path_str:
        return

    meta = {
        "runner_version": "1.1.0",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "requested_model": requested_model,
        "provider_reported_model": provider_reported_model,
        "routing_mode": routing_mode,
        "routing_reason": routing_reason,
        "input_files": input_files,
        "prompt_sha256": compute_string_sha256(prompt),
        "prompt_char_count": len(prompt),
        "combined_file_char_count": combined_file_char_count,
        "overflow_status": overflow_status,
        "api_transport_status": api_transport_status,
        "exit_classification": exit_classification,
        "report_path": str(out_path_str),
        "report_sha256": report_sha256,
        "elapsed_time_seconds": round(elapsed_time, 3),
        "retry_count": retry_count,
        "fallback_occurred": fallback_occurred
    }

    try:
        sidecar_path = Path(out_path_str).with_suffix(".json")
        atomic_write_utf8(sidecar_path, json.dumps(meta, ensure_ascii=False, indent=2))
    except Exception as error:
        safe_print_unicode(f"qwen_agent: could not write JSON sidecar: {error}\n", sys.stderr)


if __name__ == "__main__":
    raise SystemExit(main())
