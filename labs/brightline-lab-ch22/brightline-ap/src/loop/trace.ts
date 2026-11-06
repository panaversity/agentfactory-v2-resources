// Reading a trace (Concept 20.10).
// One span per model call and one per tool call, named and labeled as the
// OpenTelemetry GenAI semantic conventions describe them. Those conventions
// are still at Development status, so the names may change.
// This small recorder keeps spans in memory and can write them as JSON lines.
// A real OpenTelemetry exporter can replace it without changing the loop.

export interface Span {
  name: string; // "chat claude-sonnet-5-5" or "execute_tool list_open_invoices"
  kind: "CLIENT" | "INTERNAL";
  traceId: string;
  spanId: string;
  startMs: number;
  endMs: number;
  status: "OK" | "ERROR";
  attributes: Record<string, string | number | boolean | string[]>;
}

const hex = (bytes: number) =>
  Array.from({ length: bytes }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join("");

export class Tracer {
  readonly spans: Span[] = [];
  readonly traceId = hex(16);

  async span<T>(
    name: string,
    kind: Span["kind"],
    attributes: Span["attributes"],
    work: () => Promise<T>,
    after?: (result: T, attrs: Span["attributes"]) => void,
  ): Promise<T> {
    const span: Span = {
      name, kind, traceId: this.traceId, spanId: hex(8),
      startMs: Date.now(), endMs: 0, status: "OK", attributes: { ...attributes },
    };
    try {
      const result = await work();
      after?.(result, span.attributes);
      if (span.attributes["error.type"]) span.status = "ERROR"; // marked by after(), such as a failed tool
      return result;
    } catch (error) {
      span.status = "ERROR";
      span.attributes["error.type"] = error instanceof Error ? error.name : "unknown";
      throw error;
    } finally {
      span.endMs = Date.now();
      this.spans.push(span);
    }
  }

  // A model call: a CLIENT span named "{operation} {model}".
  modelCall<T>(provider: string, model: string, work: () => Promise<T>, after?: (r: T, a: Span["attributes"]) => void) {
    return this.span(`chat ${model}`, "CLIENT", {
      "gen_ai.operation.name": "chat",
      "gen_ai.provider.name": provider,
      "gen_ai.request.model": model,
    }, work, after);
  }

  // A tool call: an INTERNAL span named "execute_tool {tool}". No inputs or
  // outputs are recorded, because message content is off by default.
  // The loop turns a failure into a result with ok false, so the tool span is
  // marked ERROR from that result: a trace then shows which tool failed.
  toolCall<T extends { ok: boolean }>(tool: string, callId: string, work: () => Promise<T>) {
    return this.span(`execute_tool ${tool}`, "INTERNAL", {
      "gen_ai.operation.name": "execute_tool",
      "gen_ai.tool.name": tool,
      "gen_ai.tool.call.id": callId,
    }, work, (outcome, attrs) => {
      if (!outcome.ok) attrs["error.type"] = "tool_error";
    });
  }

  toJsonLines(): string {
    return this.spans.map((s) => JSON.stringify(s)).join("\n");
  }
}
