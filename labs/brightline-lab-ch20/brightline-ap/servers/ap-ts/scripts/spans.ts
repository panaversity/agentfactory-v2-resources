// Run the eight acceptance checks in-process and print the server's spans as JSON,
// for the conformance suite to compare with the Python server's.
import { readFileSync } from "node:fs";
import { trace } from "@opentelemetry/api";
import { BasicTracerProvider, InMemorySpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { connect, makeCopy } from "../test/helpers.ts";
import { KEPT, acceptanceChecks } from "../../../scripts/acceptance.ts";

const exporter = new InMemorySpanExporter();
trace.setGlobalTracerProvider(new BasicTracerProvider({ spanProcessors: [new SimpleSpanProcessor(exporter)] }));
const report: { id: string; spans: { name: string; attributes: Record<string, unknown> }[] }[] = [];
for (const check of acceptanceChecks(readFileSync(new URL("../../../docs/acceptance-prompts.md", import.meta.url), "utf8"))) {
  exporter.reset();
  const client = await connect(makeCopy(undefined, { log: () => {} })); // stdout carries only the report
  let r = await client.callTool({ name: check.tool, arguments: check.arguments });
  while (check.paging && (r.structuredContent as any)?.next_page)
    r = await client.callTool({ name: check.tool, arguments: { page: (r.structuredContent as any).next_page } });
  await client.close();
  report.push({ id: check.id, spans: exporter.getFinishedSpans().map((s) => ({
    name: s.name, attributes: Object.fromEntries(Object.entries(s.attributes).filter(([k]) => KEPT.includes(k)).sort()) }))
    .sort((a, b) => a.name.localeCompare(b.name) || JSON.stringify(a.attributes).localeCompare(JSON.stringify(b.attributes))) });
}
console.log(JSON.stringify(report));
