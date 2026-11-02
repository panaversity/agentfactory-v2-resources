"""The Python server's spans match the TypeScript server's, and join the caller's trace."""

from __future__ import annotations

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter

from tests.test_connector import call, copy, rpc

EXPORTER = InMemorySpanExporter()
_provider = TracerProvider()
_provider.add_span_processor(SimpleSpanProcessor(EXPORTER))
trace.set_tracer_provider(_provider)

TRACE_ID = "4bf92f3577b34da6a3ce929d0e0e4736"
TRACEPARENT = f"00-{TRACE_ID}-00f067aa0ba902b7-01"


def test_one_span_per_call_joined_to_the_callers_trace() -> None:
    EXPORTER.clear()
    with copy() as a, copy() as b:
        r = rpc(a, "tools/call", {"name": "list_open_invoices", "arguments": {"page_size": 5}, "_meta": {"traceparent": TRACEPARENT}})
        handle = r.json()["result"]["structuredContent"]["next_page"]
        rpc(b, "tools/call", {"name": "list_open_invoices", "arguments": {"page": handle}, "_meta": {"traceparent": TRACEPARENT}})
    spans = EXPORTER.get_finished_spans()
    calls = [s for s in spans if s.name == "tools/call list_open_invoices"]
    assert len(calls) == 2
    for s in calls:
        assert s.context is not None and format(s.context.trace_id, "032x") == TRACE_ID
        attrs = dict(s.attributes or {})
        assert attrs["mcp.method.name"] == "tools/call"
        assert attrs["gen_ai.tool.name"] == "list_open_invoices"
        assert attrs["gen_ai.operation.name"] == "execute_tool"
        assert attrs["brightline.invoice.count"] == 5
        assert "error.type" not in attrs
    reads = [s for s in spans if s.name == "read data"]
    call_ids = {c.context.span_id for c in calls if c.context is not None}
    assert len(reads) == 2 and all(r.parent is not None and r.parent.span_id in call_ids for r in reads)


def test_failed_call_records_error_type_and_nothing_private() -> None:
    EXPORTER.clear()
    with copy() as c:
        call(c, "get_purchase_order", {"invoice_number": "INV-8310"})
    span = next(s for s in EXPORTER.get_finished_spans() if s.name == "tools/call get_purchase_order")
    assert dict(span.attributes or {})["error.type"] == "tool_error"
    recorded = str([dict(s.attributes or {}) for s in EXPORTER.get_finished_spans()])
    for secret in ("INV-8310", "test-token", "8816403392217"):
        assert secret not in recorded
