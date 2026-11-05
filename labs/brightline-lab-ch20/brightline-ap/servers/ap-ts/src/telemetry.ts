// Server-side spans, named to OpenTelemetry's MCP semantic conventions (Development status).
// This file uses only the OpenTelemetry API. With no SDK registered, every call is a no-op,
// so the server runs unchanged on any platform. Tests and local runs register an SDK.
import { context, metrics, ROOT_CONTEXT, SpanKind, SpanStatusCode, trace, type Attributes, type Span } from "@opentelemetry/api";
import { W3CTraceContextPropagator } from "@opentelemetry/core";

const tracer = () => trace.getTracer("brightline-ap-connector", "0.2.0");
const duration = () =>
  metrics.getMeter("brightline-ap-connector", "0.2.0").createHistogram("mcp.server.operation.duration", { unit: "s" });
const propagator = new W3CTraceContextPropagator();

/** Run one tool call inside a `tools/call <tool>` SERVER span. The parent comes from the
 *  request's params._meta (traceparent, tracestate), as the conventions say. */
export async function inToolSpan<T>(
  tool: string,
  meta: Record<string, unknown> | undefined,
  work: (span: Span) => Promise<T & { isError?: boolean }>,
): Promise<T & { isError?: boolean }> {
  const carrier: Record<string, string> = {};
  for (const key of ["traceparent", "tracestate"]) if (typeof meta?.[key] === "string") carrier[key] = meta[key] as string;
  const parent = propagator.extract(ROOT_CONTEXT, carrier, { get: (c, k) => c[k], keys: (c) => Object.keys(c) });
  const attributes: Attributes = {
    "mcp.method.name": "tools/call",
    "gen_ai.tool.name": tool,
    "gen_ai.operation.name": "execute_tool",
    "mcp.protocol.version": "2026-07-28",
  };
  const started = performance.now();
  return tracer().startActiveSpan(`tools/call ${tool}`, { kind: SpanKind.SERVER, attributes }, parent, async (span) => {
    try {
      const result = await work(span);
      if (result.isError) {
        span.setAttribute("error.type", "tool_error");
        span.setStatus({ code: SpanStatusCode.ERROR });
      }
      return result;
    } catch (err) {
      span.setAttribute("error.type", (err as Error).name || "Error");
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw err;
    } finally {
      duration().record((performance.now() - started) / 1000, { "mcp.method.name": "tools/call", "gen_ai.tool.name": tool });
      span.end();
    }
  });
}

/** A child span for reading the shipped data. Records how many files, never their contents. */
export async function inReadSpan<T>(parent: Span, files: number, work: () => Promise<T>): Promise<T> {
  // The parent is passed in, not looked up, so this works on runtimes with no async context manager.
  return tracer().startActiveSpan("read data", { attributes: { "brightline.data.queries": files } }, trace.setSpan(context.active(), parent), async (span) => {
    try {
      return await work();
    } finally {
      span.end();
    }
  });
}
