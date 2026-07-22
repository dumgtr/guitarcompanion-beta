from __future__ import annotations

import json
import os
import sys
import unittest
from unittest.mock import patch, MagicMock
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

import qwen_agent
from qwen_model_policy import validate_model, PolicyError


class TestQwenAgentHardening(unittest.TestCase):
    def test_default_model_is_qwen3_7_plus(self) -> None:
        self.assertEqual(qwen_agent.DEFAULT_MODEL, "qwen3.7-plus")

    def test_exit_codes_mapping(self) -> None:
        self.assertEqual(qwen_agent.ExitCode.SUCCESS, 0)
        self.assertEqual(qwen_agent.ExitCode.CLI_OR_CONFIG_ERROR, 2)
        self.assertEqual(qwen_agent.ExitCode.AUTH_OR_TRANSPORT_ERROR, 3)
        self.assertEqual(qwen_agent.ExitCode.API_RESPONSE_ERROR, 4)
        self.assertEqual(qwen_agent.ExitCode.MODEL_MISMATCH, 5)
        self.assertEqual(qwen_agent.ExitCode.MODEL_IDENTITY_UNVERIFIED, 6)
        self.assertEqual(qwen_agent.ExitCode.INPUT_LIMIT_EXCEEDED, 7)
        self.assertEqual(qwen_agent.ExitCode.OUTPUT_WRITE_ERROR, 8)

    def test_safe_print_unicode_on_cp1252_stream(self) -> None:
        mock_stream = MagicMock()
        mock_stream.encoding = "cp1252"
        # Force write to raise UnicodeEncodeError for non-cp1252 text
        def raising_write(text):
            if "→" in text or "ภาษาไทย" in text:
                raise UnicodeEncodeError("cp1252", text, 0, 1, "invalid character")
            mock_stream.write.calls.append(text)
        mock_stream.write.calls = []
        mock_stream.write.side_effect = raising_write

        qwen_agent.safe_print_unicode("Hello → ภาษาไทย", file=mock_stream)

        # Non-ASCII characters should be replaced with "?" in cp1252 fallback
        output = "".join(mock_stream.write.calls)
        self.assertIn("Hello", output)
        self.assertNotIn("→", output)
        self.assertIn("?", output)

    @patch("urllib.request.urlopen")
    @patch.dict(os.environ, {"DASHSCOPE_API_KEY": "fake-key", "DASHSCOPE_BASE_URL": "http://fake-api"})
    def test_successful_request_applies_defaults_and_writes_metadata(self, mock_urlopen: MagicMock) -> None:
        # Mock API Response
        mock_response = MagicMock()
        mock_response.read.return_value = json.dumps({
            "model": "qwen3.7-plus",
            "choices": [{"message": {"content": "Review passed."}}],
            "usage": {"prompt_tokens": 120, "completion_tokens": 60}
        }).encode("utf-8")
        mock_urlopen.return_value.__enter__.return_value = mock_response

        # Temporary files
        prompt_file = ROOT / "tests" / "temp_prompt_meta.txt"
        prompt_file.write_text("Prompt Text", encoding="utf-8")

        input1 = ROOT / "tests" / "input1.txt"
        input1.write_text("Content of File 1", encoding="utf-8")

        out_report = ROOT / "tests" / "report.md"
        out_sidecar = ROOT / "tests" / "report.json"

        try:
            with patch("sys.argv", ["qwen_agent.py", "--prompt", "Prompt Text", "--file", str(input1), "--out", str(out_report)]):
                exit_code = qwen_agent.main()
                self.assertEqual(exit_code, 0)

                # Assert files were created
                self.assertTrue(out_report.exists())
                self.assertTrue(out_sidecar.exists())

                # Validate sidecar contents
                meta = json.loads(out_sidecar.read_text(encoding="utf-8"))
                self.assertEqual(meta["runner_version"], "1.1.0")
                self.assertEqual(meta["requested_model"], "qwen3.7-plus")
                self.assertEqual(meta["provider_reported_model"], "qwen3.7-plus")
                self.assertEqual(meta["exit_classification"], "SUCCESS")
                self.assertEqual(meta["overflow_status"], "none")
                self.assertEqual(meta["fallback_occurred"], False)
                self.assertEqual(len(meta["input_files"]), 1)
                self.assertEqual(meta["input_files"][0]["path"], str(input1))
                self.assertEqual(meta["input_files"][0]["truncated"], False)
                self.assertEqual(meta["input_files"][0]["original_chars"], len("Content of File 1"))
        finally:
            for f in (prompt_file, input1, out_report, out_sidecar):
                if f.exists():
                    f.unlink()

    @patch("urllib.request.urlopen")
    @patch.dict(os.environ, {"DASHSCOPE_API_KEY": "fake-key", "DASHSCOPE_BASE_URL": "http://fake-api"})
    def test_model_mismatch_fails_closed(self, mock_urlopen: MagicMock) -> None:
        mock_response = MagicMock()
        mock_response.read.return_value = json.dumps({
            "model": "qwen3-coder-plus",  # Provider silently substituted model
            "choices": [{"message": {"content": "Substituted Review."}}],
            "usage": {}
        }).encode("utf-8")
        mock_urlopen.return_value.__enter__.return_value = mock_response

        prompt_file = ROOT / "tests" / "temp_prompt_mismatch.txt"
        prompt_file.write_text("Prompt Text", encoding="utf-8")

        out_report = ROOT / "tests" / "report.md"
        out_sidecar = ROOT / "tests" / "report.json"

        try:
            with patch("sys.argv", ["qwen_agent.py", "--prompt", "Prompt Text", "--model", "qwen3.7-plus", "--out", str(out_report)]):
                exit_code = qwen_agent.main()
                self.assertEqual(exit_code, 5)  # MODEL_MISMATCH exit code

                # Metadata sidecar should still be generated with mismatch exit classification
                self.assertTrue(out_sidecar.exists())
                meta = json.loads(out_sidecar.read_text(encoding="utf-8"))
                self.assertEqual(meta["exit_classification"], "MODEL_MISMATCH")
                self.assertEqual(meta["provider_reported_model"], "qwen3-coder-plus")
        finally:
            for f in (prompt_file, out_report, out_sidecar):
                if f.exists():
                    f.unlink()

    def test_file_boundaries_construction(self) -> None:
        input1 = ROOT / "tests" / "b1.txt"
        input1.write_text("Hello One", encoding="utf-8")
        input2 = ROOT / "tests" / "b2.txt"
        input2.write_text("Hello Two", encoding="utf-8")

        try:
            assembled = qwen_agent.assemble_prompt("My Prompt", [str(input1), str(input2)], 1000)
            self.assertIn("--- BEGIN FILE: " + str(input1) + " ---", assembled)
            self.assertIn("Hello One", assembled)
            self.assertIn("--- END FILE: " + str(input1) + " ---", assembled)
            self.assertIn("--- BEGIN FILE: " + str(input2) + " ---", assembled)
            self.assertIn("Hello Two", assembled)
            self.assertIn("--- END FILE: " + str(input2) + " ---", assembled)
        finally:
            for f in (input1, input2):
                if f.exists():
                    f.unlink()

    def test_input_overflow_fail_closed_by_default(self) -> None:
        input1 = ROOT / "tests" / "overflow.txt"
        input1.write_text("A" * 100, encoding="utf-8")
        out_report = ROOT / "tests" / "report.md"
        out_sidecar = ROOT / "tests" / "report.json"

        try:
            # Set --max-chars to 50, prompt is 10 chars, input is 100 chars -> should fail closed
            with patch("sys.argv", ["qwen_agent.py", "--prompt", "Prompt Text", "--file", str(input1), "--max-chars", "50", "--out", str(out_report)]):
                exit_code = qwen_agent.main()
                self.assertEqual(exit_code, 7)  # INPUT_LIMIT_EXCEEDED code

                # Metadata written with overflow_status=fail_closed
                self.assertTrue(out_sidecar.exists())
                meta = json.loads(out_sidecar.read_text(encoding="utf-8"))
                self.assertEqual(meta["overflow_status"], "fail_closed")
                self.assertEqual(meta["exit_classification"], "INPUT_LIMIT_EXCEEDED")
        finally:
            for f in (input1, out_report, out_sidecar):
                if f.exists():
                    f.unlink()

    @patch("urllib.request.urlopen")
    @patch.dict(os.environ, {"DASHSCOPE_API_KEY": "fake-key", "DASHSCOPE_BASE_URL": "http://fake-api"})
    def test_input_overflow_truncation_allowed(self, mock_urlopen: MagicMock) -> None:
        mock_response = MagicMock()
        mock_response.read.return_value = json.dumps({
            "model": "qwen3.7-plus",
            "choices": [{"message": {"content": "Truncated Review passed."}}],
            "usage": {}
        }).encode("utf-8")
        mock_urlopen.return_value.__enter__.return_value = mock_response

        input1 = ROOT / "tests" / "overflow_trunc.txt"
        input1.write_text("A" * 100, encoding="utf-8")
        out_report = ROOT / "tests" / "report.md"
        out_sidecar = ROOT / "tests" / "report.json"

        try:
            # Set --max-chars to 50, prompt is 11 chars. Remaining budget is 39.
            # Truncation enabled -> should succeed and truncate the file to 39 chars
            with patch("sys.argv", ["qwen_agent.py", "--prompt", "Prompt Text", "--file", str(input1), "--max-chars", "50", "--allow-truncation", "--out", str(out_report)]):
                exit_code = qwen_agent.main()
                self.assertEqual(exit_code, 0)

                self.assertTrue(out_sidecar.exists())
                meta = json.loads(out_sidecar.read_text(encoding="utf-8"))
                self.assertEqual(meta["overflow_status"], "truncated")
                self.assertEqual(meta["exit_classification"], "SUCCESS")
                self.assertEqual(meta["input_files"][0]["original_chars"], 100)
                self.assertEqual(meta["input_files"][0]["submitted_chars"], 39)
                self.assertEqual(meta["input_files"][0]["truncated"], True)
        finally:
            for f in (input1, out_report, out_sidecar):
                if f.exists():
                    f.unlink()


if __name__ == "__main__":
    unittest.main()
