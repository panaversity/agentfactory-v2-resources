"""Reading a trace (Concept 20.10).

One span per model call and one per tool call, named and labeled as the
OpenTelemetry GenAI semantic conventions describe them. Those conventions are
still at Development status, so the names may change. This small recorder keeps
spans in memory and writes them as JSON lines. A real OpenTelemetry exporter can
replace it without changing the loop.
"""
from __future__ import annotations

import json
import secrets
import time
from contextlib import contextmanager
from dataclasses import asdict, dataclass, field
from typing import Iterator, Literal

Attr = str | int | float | bool | list[str]


@dataclass
class Span:
    name: str
    kind: Literal["CLIENT", "INTERNAL"]
    trace_id: str
    span_id: str
    start_ms: float
    end_ms: float = 0.0
    status: Literal["OK", "ERROR"] = "OK"
    attributes: dict[str, Attr] = field(default_factory=lambda: {})


class Tracer:
    def __init__(self) -> None:
        self.spans: list[Span] = []
        self.trace_id = secrets.token_hex(16)

    @contextmanager
    def span(self, name: str, kind: Literal["CLIENT", "INTERNAL"], attributes: dict[str, Attr]) -> Iterator[dict[str, Attr]]:
        s = Span(name, kind, self.trace_id, secrets.token_hex(8), time.time() * 1000, attributes=dict(attributes))
        try:
            yield s.attributes  # the caller may add attributes, such as usage, or error.type for a failed tool
            if "error.type" in s.attributes:
                s.status = "ERROR"
        except Exception as error:
            s.status = "ERROR"
            s.attributes["error.type"] = type(error).__name__
            raise
        finally:
            s.end_ms = time.time() * 1000
            self.spans.append(s)

    def model_call(self, provider: str, model: str):
        """A model call: a CLIENT span named "{operation} {model}"."""
        return self.span(f"chat {model}", "CLIENT", {
            "gen_ai.operation.name": "chat", "gen_ai.provider.name": provider, "gen_ai.request.model": model,
        })

    def tool_call(self, tool: str, call_id: str):
        """A tool call: an INTERNAL span. No inputs or outputs are recorded."""
        return self.span(f"execute_tool {tool}", "INTERNAL", {
            "gen_ai.operation.name": "execute_tool", "gen_ai.tool.name": tool, "gen_ai.tool.call.id": call_id,
        })

    def to_json_lines(self) -> str:
        return "\n".join(json.dumps(asdict(s)) for s in self.spans)
