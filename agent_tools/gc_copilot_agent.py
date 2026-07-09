#!/usr/bin/env python3
"""
gc_copilot_agent.py

CLI wrapper for plugging an LLM (e.g., Copilot endpoint) into the V3 runner as an external agent.

Usage example:
  python3 agent_tools/gc_copilot_agent.py --role ux --prompt /tmp/in.json --output /tmp/out.json --timeout 30

Environment variables:
  COPILOT_API_URL  - required, e.g. https://api.copilot.example/v1/chat
  COPILOT_API_KEY  - required
  AGENT_TIMEOUT    - optional default fallback (seconds)
  AGENT_RETRIES    - optional default retries

Exit codes:
  0  => Success, valid structured output written
  1  => Output validation failed (invalid schema)
  2  => API request error (non-2xx) or network error
  3  => Timeout / exceeded retry policy
  4  => Unexpected exception (catch-all)
"""

import os
import sys
import json
import time
import argparse
import logging
import re
from typing import Any, Dict, Optional

try:
    import requests
except Exception as e:
    print("ERROR: 'requests' library is required. Install via: pip install requests", file=sys.stderr)
    raise

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s: %(message)s")

# Basic schema expected for agent output
REQUIRED_KEYS = {"status", "report_md"}

def read_prompt_file(path: str) -> Dict[str, Any]:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Prompt file not found: {path}")
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    # Try parse JSON first, else return raw text in {"instructions": ...}
    try:
        j = json.loads(text)
        return j if isinstance(j, dict) else {"instructions": text}
    except Exception:
        return {"instructions": text}

def redact_sensitive(text: str) -> str:
    # Minimal redaction: redact long tokens that look like API keys
    redacted = re.sub(r"(?:api[_-]?key|token)[\"']?\s*[:=]\s*['\"]?[A-Za-z0-9_\-\.=]{8,}['\"]?", r"\1: [REDACTED]", text, flags=re.IGNORECASE)
    # redact common-looking bearer tokens
    redacted = re.sub(r"Bearer\s+[A-Za-z0-9\-_\.]{20,}", "Bearer [REDACTED]", redacted)
    return redacted

def call_llm(api_url: str, api_key: str, prompt_payload: Dict[str, Any], timeout: int, max_tokens: Optional[int]=None) -> Dict[str, Any]:
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    body = {
        # Keep structure generic; adapt to your Copilot API shape
        "input": prompt_payload.get("instructions") or prompt_payload,
        "metadata": {
            "role": prompt_payload.get("role"),
            "task_id": prompt_payload.get("task_id"),
        }
    }
    if max_tokens:
        body["max_tokens"] = max_tokens
    resp = requests.post(api_url, json=body, headers=headers, timeout=timeout)
    resp.raise_for_status()
    # Try parse JSON
    try:
        return resp.json()
    except ValueError:
        return {"text": resp.text}

def extract_structured(resp: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize the LLM response into our expected schema:
      {
        "status": "PASS"|"FAIL"|"CONDITIONAL"|"UNKNOWN",
        "summary": "one-line summary",
        "report_md": "full markdown",
        "patch": "... optional git patch text ...",
        "artifacts": [ { "path": "...", "url":"..." } ]
      }
    Heuristics:
      - If resp contains keys status/report_md use them.
      - Else, if resp contains text, try to find a JSON block inside it.
      - Else wrap text into report_md and set status UNKNOWN.
    """
    # direct mapping if present
    if isinstance(resp, dict):
        if "status" in resp and "report_md" in resp:
            return resp
        # possible direct fields
        if "text" in resp and isinstance(resp["text"], str):
            text = resp["text"]
        elif "message" in resp and isinstance(resp["message"], str):
            text = resp["message"]
        else:
            # fallback: attempt to stringify
            text = json.dumps(resp, ensure_ascii=False)
    else:
        text = str(resp)

    # try extract JSON block inside text
    json_block = None
    m = re.search(r"```json\s*(\{.*?\})\s*```", text, flags=re.S)
    if not m:
        # fallback: first occurrence of {...}
        m2 = re.search(r"(\{(?:.|\n)*\})", text)
        if m2:
            json_block = m2.group(1)
    else:
        json_block = m.group(1)

    if json_block:
        try:
            parsed = json.loads(json_block)
            if isinstance(parsed, dict) and "report_md" in parsed:
                return parsed
            # else wrap parsed into report_md
            return {"status": parsed.get("status","UNKNOWN"), "report_md": json.dumps(parsed, ensure_ascii=False, indent=2)}
        except Exception:
            pass

    # no structured JSON found — build minimal wrapper
    # first line as summary
    summary = text.strip().splitlines()[0] if text.strip() else ""
    return {"status": "UNKNOWN", "summary": summary, "report_md": text}

def validate_output_schema(out: Dict[str, Any]) -> bool:
    if not isinstance(out, dict):
        return False
    if not REQUIRED_KEYS.issubset(set(out.keys())):
        # allow if report_md exists at least
        return "report_md" in out
    return True

def write_output(path: str, payload: Dict[str, Any]) -> None:
    # Ensure directory exists
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

def main():
    parser = argparse.ArgumentParser(description="gc_copilot_agent.py - wrapper to call Copilot-style endpoint for V3 runner")
    parser.add_argument("--prompt", required=True, help="Path to prompt file (JSON or plain text)")
    parser.add_argument("--output", required=True, help="Path to output report JSON (ReportFile)")
    parser.add_argument("--role", required=True, help="Role name (ux|risk|audio|integrator...)")
    parser.add_argument("--timeout", type=int, default=int(os.environ.get("AGENT_TIMEOUT", "30")), help="Per-request timeout seconds")
    parser.add_argument("--retries", type=int, default=int(os.environ.get("AGENT_RETRIES", "1")), help="Number of retries on transient failure")
    parser.add_argument("--max_tokens", type=int, default=None, help="Optional max tokens for API")
    args = parser.parse_args()

    api_url = os.environ.get("COPILOT_API_URL")
    api_key = os.environ.get("COPILOT_API_KEY")
    if not api_url or not api_key:
        logging.error("COPILOT_API_URL and COPILOT_API_KEY must be set in env")
        sys.exit(2)

    try:
        prompt_payload = read_prompt_file(args.prompt)
        # attach role and metadata
        prompt_payload.setdefault("role", args.role)
    except Exception as e:
        logging.exception("Failed to read prompt file")
        sys.exit(4)

    # redact logs
    safe_preview = redact_sensitive(json.dumps(prompt_payload, ensure_ascii=False)[:2000])
    logging.info("Calling LLM endpoint for role=%s; prompt preview: %s", args.role, safe_preview)

    attempt = 0
    backoff = 1.0
    last_exc = None
    while attempt <= args.retries:
        attempt += 1
        try:
            resp = call_llm(api_url, api_key, prompt_payload, timeout=args.timeout, max_tokens=args.max_tokens)
            structured = extract_structured(resp)
            if not validate_output_schema(structured):
                # write the raw response as fallback report
                wrapped = {"status": structured.get("status","UNKNOWN"), "report_md": structured.get("report_md", str(resp))}
                write_output(args.output, wrapped)
                logging.error("Output failed validation; written fallback output to %s", args.output)
                sys.exit(1)
            # success: write and exit 0
            write_output(args.output, structured)
            logging.info("Wrote agent output to %s", args.output)
            sys.exit(0)
        except requests.exceptions.Timeout as e:
            logging.warning("Request timeout (attempt %d/%d): %s", attempt, args.retries+1, str(e))
            last_exc = e
            if attempt > args.retries:
                logging.error("Exceeded retries due to timeout")
                sys.exit(3)
            time.sleep(backoff)
            backoff *= 2
            continue
        except requests.exceptions.RequestException as e:
            logging.warning("Request error (attempt %d/%d): %s", attempt, args.retries+1, str(e))
            last_exc = e
            if attempt > args.retries:
                logging.error("Exceeded retries due to request error")
                sys.exit(2)
            time.sleep(backoff)
            backoff *= 2
            continue
        except Exception as e:
            logging.exception("Unexpected error calling LLM")
            last_exc = e
            sys.exit(4)

if __name__ == "__main__":
    main()
