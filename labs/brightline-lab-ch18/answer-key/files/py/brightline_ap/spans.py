"""Run the eight acceptance checks in-process and print the Python server's spans as JSON."""

from __future__ import annotations

import base64
import json
import re
import time
from pathlib import Path
from typing import Any

import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter
from starlette.testclient import TestClient

from .mcp_server import create_app
from .verify_token import test_public_key

KEPT = ["mcp.method.name", "gen_ai.tool.name", "gen_ai.operation.name", "error.type", "brightline.invoice.count", "brightline.data.files"]
KEY = "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8"
ISSUER, RESOURCE = "http://127.0.0.1:8719/api/auth", "http://127.0.0.1:8717/mcp"


def _token_and_key() -> tuple[str, str]:
    """A signing key made for this run, trusted as the test key, and one token signed with it."""
    private = Ed25519PrivateKey.generate()
    der = private.private_bytes(serialization.Encoding.DER, serialization.PrivateFormat.PKCS8, serialization.NoEncryption())
    key_b64 = base64.urlsafe_b64encode(der).rstrip(b"=").decode()
    kid, _ = test_public_key(key_b64)
    now = int(time.time())
    claims = {"iss": ISSUER, "aud": RESOURCE, "sub": "u_spans", "client_id": "app_spans", "scope": "ap:read ap:vendors.read",
              "tenant": "org_conformance", "iat": now, "exp": now + 600}
    return jwt.encode(claims, private, algorithm="EdDSA", headers={"typ": "at+jwt", "kid": kid}), key_b64


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
    token, signing_key = _token_and_key()
    app = create_app(handle_key=KEY, issuer=ISSUER, resource=RESOURCE, test_signing_key=signing_key,
                     log=lambda _line: None)  # stdout carries only the report
    with TestClient(app, base_url="http://127.0.0.1") as client:
        for check in checks:
            exporter.clear()
            args: dict[str, Any] = check["arguments"]
            while True:
                body: dict[str, Any] = {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": check["tool"], "arguments": args,
                        "_meta": {"io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {}}}}
                headers = {"authorization": f"Bearer {token}", "accept": "application/json, text/event-stream",
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
