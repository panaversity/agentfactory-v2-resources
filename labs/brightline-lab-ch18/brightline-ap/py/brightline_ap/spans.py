"""Run the eight acceptance checks in-process and print the Python server's spans as JSON."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter
from starlette.testclient import TestClient

from .mcp_server import create_app

KEPT = ["mcp.method.name", "gen_ai.tool.name", "gen_ai.operation.name", "error.type", "brightline.invoice.count", "brightline.data.files"]
TOKEN = "spans-token-0123456789abcdef"
KEY = "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8"


def main() -> None:
    exporter = InMemorySpanExporter()
    provider = TracerProvider()
    provider.add_span_processor(SimpleSpanProcessor(exporter))
    trace.set_tracer_provider(provider)
    text = (Path(__file__).resolve().parents[2] / "docs" / "acceptance-prompts.md").read_text()
    block = re.search(r"```json\n(.*?)\n```", text, re.S)
    assert block is not None
    checks: list[dict[str, Any]] = json.loads(block.group(1))
    report: list[dict[str, Any]] = []
    with TestClient(create_app(token=TOKEN, handle_key=KEY), base_url="http://127.0.0.1") as client:
        for check in checks:
            exporter.clear()
            args: dict[str, Any] = check["arguments"]
            while True:
                body: dict[str, Any] = {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": check["tool"], "arguments": args,
                        "_meta": {"io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {}}}}
                headers = {"authorization": f"Bearer {TOKEN}", "accept": "application/json, text/event-stream",
                           "mcp-protocol-version": "2026-07-28", "mcp-method": "tools/call", "mcp-name": check["tool"]}
                result: dict[str, Any] = client.post("/mcp", json=body, headers=headers).json()["result"]
                structured: dict[str, Any] = result.get("structuredContent") or {}
                nxt: str | None = structured.get("next_page")
                if not (check.get("paging") and nxt):
                    break
                args = {"page": nxt}
            spans = [{"name": s.name, "attributes": dict(sorted((k, v) for k, v in (s.attributes or {}).items() if k in KEPT))}
                     for s in exporter.get_finished_spans()]
            spans.sort(key=lambda s: (s["name"], json.dumps(s["attributes"], separators=(",", ":"))))
            report.append({"id": check["id"], "spans": spans})
    print(json.dumps(report))


if __name__ == "__main__":
    main()
