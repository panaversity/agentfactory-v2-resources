// The worker's rules, written once and used by both SDKs (21.5, 21.6).
// Each rule is a plain function you can test without a model, a network or a key.

import { appendFileSync, mkdirSync } from "node:fs";

// The connector's four read-only tools. These run without asking.
export const READ_TOOLS = ["find_vendor", "list_open_invoices", "get_purchase_order", "search_policy"] as const;

export type Decision = { allow: true } | { allow: false; message: string };

// Rule 1, in plain words: flag_invoice may run only for one invoice, named as INV- and four digits,
// with a reason of at least 10 characters. Any other tool not on the allow list is denied, with a message.
export function decideTool(name: string, input: Record<string, unknown>): Decision {
  const short = name.split("__").pop() ?? name;
  if (short === "flag_invoice") {
    const invoice = String(input.invoice_number ?? "");
    const reason = String(input.reason ?? "");
    if (!/^INV-\d{4}$/.test(invoice)) return { allow: false, message: `Denied: flag one invoice by its number, such as INV-8316, not "${invoice}".` };
    if (reason.trim().length < 10) return { allow: false, message: "Denied: a flag needs a reason of at least 10 characters." };
    return { allow: true };
  }
  return { allow: false, message: `Denied: ${short} is not one of this worker's tools.` };
}

// Rule 2, in plain words: an answer must cite at least one policy line, written as (file.md:N).
export function citesPolicyLine(answer: string): boolean {
  return /\([a-z0-9-]+\.md:\d+\)/i.test(answer);
}

// The one tool with an effect: it writes a flag to out/flags.jsonl, which holds the invoice's payment.
export function writeFlag(invoice_number: string, reason: string): string {
  mkdirSync("out", { recursive: true });
  appendFileSync("out/flags.jsonl", JSON.stringify({ invoice_number, reason, at: new Date().toISOString() }) + "\n");
  return `Flagged ${invoice_number} for review. Its payment is held until the flag is cleared.`;
}

export const FLAG_DESCRIPTION =
  "Flag one invoice for review by the AP lead, which holds its payment. Use only when Ana names the invoice.";

// Tool arguments arrive as text. A small model may send broken text: treat it as no arguments, so the rule denies the call
export function parseArgs(text: string): Record<string, unknown> {
  try {
    const value = JSON.parse(text);
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}
