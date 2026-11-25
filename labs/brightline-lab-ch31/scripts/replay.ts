// Replay one recorded session's documents through your worker, with memory v3.
// Set LAB_TRACE=1 to see each search_policy call.
// Usage: npm run replay -- --session s08
import { readFileSync } from "node:fs";
import { runWorker } from "../src/worker.ts";

const i = process.argv.indexOf("--session");
const id = i > 0 ? process.argv[i + 1] : "s08";
const text = readFileSync(`sessions/${id}.md`, "utf8");
const company = /Cedar Ridge/.test(text.split("\n")[0]) ? "cedar-ridge" : "brightline";
const date = new Date(text.match(/, (\w+ \d+, 2026)/)?.[1] + " 12:00").toISOString().slice(0, 10);
const result = text.split("\n").find((l) => l.includes("**tool_result** `[")) ?? "";
const docs = JSON.parse(result.slice(result.indexOf("`[") + 1, result.lastIndexOf("]`") + 1));

for (const doc of docs) {
  const context = docs.filter((o: any) => o !== doc).map((o: any) => `${o.doc} (${o.vendor}, ${o.amount}) is ${o.status}, received ${o.received ?? o.invoice_date}.`).join(" ");
  const extra = [doc.line_text ? `Line text on ${doc.doc}: ${doc.line_text}.` : "", doc.source ? `Received by ${doc.source}.` : "", doc.memo ? `Memo field: ${doc.memo}` : ""].join(" ");
  const c = { company, document: doc.doc, vendor: doc.vendor, amount: String(doc.amount), names: doc.names ?? "", invoice_date: doc.invoice_date ?? doc.received, printed_terms: doc.printed_terms ?? "", context: `${context} ${extra}`.trim(), today: date };
  const d = runWorker("memory/published/v3", "docs/policies", c);
  console.log(JSON.stringify(d));
  if (d.errors.length) console.error(`  ${doc.doc}: invalid decision: ${d.errors.join("; ")}`);
}
