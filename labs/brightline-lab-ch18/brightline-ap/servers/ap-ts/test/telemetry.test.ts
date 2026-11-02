// The server's own spans, checked against OpenTelemetry's MCP conventions.
import { test } from "node:test";
import assert from "node:assert/strict";
import { trace } from "@opentelemetry/api";
import { BasicTracerProvider, InMemorySpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { connect, makeCopy } from "./helpers.ts";

const exporter = new InMemorySpanExporter();
trace.setGlobalTracerProvider(new BasicTracerProvider({ spanProcessors: [new SimpleSpanProcessor(exporter)] }));

const TRACE_ID = "4bf92f3577b34da6a3ce929d0e0e4736";
const traceparent = `00-${TRACE_ID}-00f067aa0ba902b7-01`;

test("one tools/call span per call, named to the conventions, joined to the caller's trace", async () => {
  exporter.reset();
  const a = await connect(makeCopy()), b = await connect(makeCopy());
  const r = await a.callTool({ name: "list_open_invoices", arguments: { page_size: 5 }, _meta: { traceparent } });
  await b.callTool({ name: "list_open_invoices", arguments: { page: (r.structuredContent as any).next_page }, _meta: { traceparent } });
  const spans = exporter.getFinishedSpans();
  const calls = spans.filter((s) => s.name === "tools/call list_open_invoices");
  assert.equal(calls.length, 2);
  for (const s of calls) {
    assert.equal(s.spanContext().traceId, TRACE_ID, "both copies join the caller's trace");
    assert.equal(s.attributes["mcp.method.name"], "tools/call");
    assert.equal(s.attributes["gen_ai.tool.name"], "list_open_invoices");
    assert.equal(s.attributes["gen_ai.operation.name"], "execute_tool");
    assert.equal(s.attributes["brightline.invoice.count"], 5);
    assert.equal(s.attributes["error.type"], undefined);
  }
  const reads = spans.filter((s) => s.name === "read data");
  assert.equal(reads.length, 2);
  assert.ok(reads.every((s) => calls.some((c) => c.spanContext().spanId === s.parentSpanContext?.spanId)), "the data read is a child span");
  await a.close(); await b.close();
});

test("a failed call records error.type, and no span holds arguments, results or keys", async () => {
  exporter.reset();
  const c = await connect(makeCopy());
  await c.callTool({ name: "get_purchase_order", arguments: { invoice_number: "INV-8310" } });
  const span = exporter.getFinishedSpans().find((s) => s.name === "tools/call get_purchase_order")!;
  assert.equal(span.attributes["error.type"], "tool_error");
  const recorded = JSON.stringify(exporter.getFinishedSpans().map((s) => s.attributes));
  for (const secret of ["INV-8310", "test-token", "8816403392217"]) assert.ok(!recorded.includes(secret), `${secret} must not be recorded`);
  await c.close();
});
