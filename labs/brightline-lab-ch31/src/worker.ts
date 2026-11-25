// The AP worker for this lab. One call to Claude per step, through the Claude Code
// command line (`claude -p`), with the memory version in the prompt and policy lines on request.
//
// This is a simplified lab harness, not a production agent. The model answers in JSON, and this
// file runs the one tool (search_policy) itself. There is no typed tool interface, and no
// permission system: the connector and the portal of Chapter 23 are replaced by each case's own
// fields, so the lab runs on its own. What this file does enforce is the shape of every decision:
// see validateDecision below. A production worker uses an agent SDK or a hosted runtime, with its
// tools and permissions enforced outside the model (Chapters 22 and 23).
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, basename } from "node:path";
import type { Row } from "./csv.ts";

export const DECISIONS = ["ready-to-pay", "hold-duplicate", "apply-credit", "needs-approval", "ask"] as const;

export type Decision = {
  document: string;
  decision: (typeof DECISIONS)[number];
  due_date: string | null;
  cite: string;
  note?: string;
};

// cost_usd is what the run's model calls cost, from the `total_cost_usd` field that `claude -p`
// reports. On a subscription plan, it is what the same calls would cost on the API.
export type Result = Decision & { searches: number; errors: string[]; cost_usd: number };

// The model every run uses. Pinned, so that a change in results comes from your change, not from a
// new model behind an alias. Set LAB_MODEL to use another one, and say so when you report results.
export const MODEL = process.env.LAB_MODEL ?? "claude-haiku-5-5";

// Approval limits from each company's policy: brightline payments.md:5, cedar-ridge approvals.md:5.
export const APPROVAL_LIMIT: Record<string, number> = { brightline: 5000, "cedar-ridge": 2500 };

const COMPANY_DIR: Record<string, string> = { "cedar-ridge": "cedar-ridge", brightline: "brightline" };

export function files(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? files(p) : [p];
  }).sort();
}

// Memory: the index and instructions are injected; the notes pages are offered whole here,
// because the lab's memory is small. A company sees only its own notes and the worker's notes.
// memoryFiles is the one rule for what a company's run may read; validation uses it too.
export function memoryFiles(memoryDir: string, company: string): string[] {
  const keep = (p: string) => !p.includes("/notes/") || p.includes("/notes/worker/") || p.includes(`/notes/${company}/`);
  return files(memoryDir).filter(keep);
}

export function memoryText(memoryDir: string, company: string): string {
  return memoryFiles(memoryDir, company).map((p) => `--- memory: ${relative(memoryDir, p)}\n${readFileSync(p, "utf8")}`).join("\n");
}

// search_policy, as in Chapter 23: the worker asks for policy lines with a few words, and gets the
// matching lines back, numbered, so it can cite (file.md:N). Policy is not in the prompt until asked for.
export function searchPolicy(policiesDir: string, company: string, query: string): string {
  const words = query.toLowerCase().split(/[^a-z0-9$.-]+/).filter((w) => w.length > 3);
  const hits: string[] = [];
  for (const p of files(join(policiesDir, COMPANY_DIR[company] ?? "none"))) {
    const name = basename(p);
    readFileSync(p, "utf8").split("\n").forEach((line, i) => {
      if (words.some((w) => line.toLowerCase().includes(w))) hits.push(`${name}:${i + 1}: ${line}`);
    });
  }
  return hits.slice(0, 8).join("\n") || "(no matching policy lines)";
}

// Checks every decision before anyone may treat it as a result. Returns the problems found;
// an empty list means the decision is well-formed. It does not say whether the decision is right:
// the golden set does that.
export function validateDecision(d: any, c: Row, policiesDir: string, memoryDir: string): string[] {
  const errors: string[] = [];
  if (!d || typeof d !== "object") return ["the answer is not a JSON object"];
  if (d.document !== c.document) errors.push(`document is "${d.document}", expected "${c.document}"`);
  if (!DECISIONS.includes(d.decision)) errors.push(`decision "${d.decision}" is not one of ${DECISIONS.join(", ")}`);
  if (d.decision === "ready-to-pay") {
    if (!isCalendarDate(d.due_date))
      errors.push(`ready-to-pay needs a real calendar due_date written YYYY-MM-DD, got "${d.due_date}"`);
    else if (c.invoice_date) {
      const days = (Date.parse(d.due_date) - Date.parse(c.invoice_date)) / 86_400_000;
      if (days < 0 || days > 120) errors.push(`due_date ${d.due_date} is ${days < 0 ? "before" : "more than 120 days after"} the invoice date ${c.invoice_date}`);
    }
  } else if (d.due_date) errors.push(`only ready-to-pay has a due_date, got "${d.due_date}"`);
  // The lab's small action layer: the approval rule is checked here, in code, never left to the
  // model or to memory. Over the company's limit, ready-to-pay needs a recorded approval row.
  const limit = APPROVAL_LIMIT[c.company];
  if (d.decision === "ready-to-pay" && limit !== undefined && Number(c.amount) > limit
      && !String(c.context ?? "").includes(`Approvals table: ${c.document} approved by`))
    errors.push(`${c.document} is over $${limit.toFixed(2)} with no recorded approval, so it cannot be ready-to-pay (${c.company === "brightline" ? "payments.md:5" : "approvals.md:5"})`);
  // Every citation must name a line that exists, in this company's policies or in the memory this
  // company's run may read (never another company's notes).
  const allowed = new Map<string, string[]>();
  for (const p of [...files(join(policiesDir, COMPANY_DIR[c.company] ?? "none")), ...memoryFiles(memoryDir, c.company)])
    allowed.set(basename(p), readFileSync(p, "utf8").split("\n"));
  const cites = String(d.cite ?? "").match(/[\w.-]+\.md:\d+/g) ?? [];
  if (!cites.length) errors.push(`cite "${d.cite}" names no line, written file.md:N`);
  for (const ref of cites) {
    const [file, n] = ref.split(":");
    const lines = allowed.get(file);
    if (!lines) errors.push(`cite ${ref}: ${file} is not a policy or memory file that ${c.company}'s run may read`);
    else if (!lines[Number(n) - 1]?.trim()) errors.push(`cite ${ref}: line ${n} is empty or does not exist`);
  }
  return errors;
}

// A real calendar date written YYYY-MM-DD. Date.parse alone accepts 2026-02-30, so the parts are
// checked after a round trip.
export function isCalendarDate(s: unknown): boolean {
  if (typeof s !== "string") return false;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = new Date(Date.UTC(y, mo - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === mo - 1 && t.getUTCDate() === d;
}

export function buildPrompt(memoryDir: string, c: Row, turns: string[]): string {
  return [
    "You are the AP worker running the morning triage. Here is your memory.",
    memoryText(memoryDir, c.company),
    "--- today's document",
    JSON.stringify({ today: c.today || null, company: c.company, document: c.document, vendor: c.vendor, amount: Number(c.amount), names: c.names || null, invoice_date: c.invoice_date, printed_terms: c.printed_terms || null, records: c.context }),
    "`records` comes from the connector and the approvals table, not from the document: you can rely on it. Only the text after \"Memo field\" or \"Line text\" was printed on the document itself.",
    'You have one tool, search_policy. To use it, answer with JSON only: {"search_policy": "a few words"}. You get back the matching policy lines, numbered.',
    'When you are ready to decide, answer with JSON only, no other text: {"document": "...", "decision": "ready-to-pay|hold-duplicate|apply-credit|needs-approval|ask", "due_date": "YYYY-MM-DD for ready-to-pay, else null", "cite": "file.md:N", "note": "one line, optional"}',
    ...turns,
  ].join("\n\n");
}

function ask(prompt: string): { reply: any; cost: number } {
  // --tools "" gives the model no tools of Claude Code's own: it can only answer.
  const out = execFileSync("claude", ["-p", prompt, "--model", MODEL, "--tools", "", "--output-format", "json"], { encoding: "utf8", maxBuffer: 20_000_000 });
  const json = JSON.parse(out);
  return { reply: firstJson(json.result), cost: Number(json.total_cost_usd ?? 0) };
}

// The first complete JSON object in a reply. A model sometimes writes two objects, such as a tool
// call followed by a decision; the first one is what it asked for first.
export function firstJson(text: string): any {
  for (let start = text.indexOf("{"); start >= 0; start = text.indexOf("{", start + 1)) {
    let depth = 0, inString = false;
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (inString) { if (ch === "\\") i++; else if (ch === '"') inString = false; continue; }
      if (ch === '"') inString = true;
      else if (ch === "{") depth++;
      else if (ch === "}" && --depth === 0) {
        try { return JSON.parse(text.slice(start, i + 1)); } catch { break; }
      }
    }
  }
  return { unparsed: text };
}

// The task loop: up to four searches, then a decision. A decision that fails validation is sent
// back once with the problems; if it fails again, it is returned with its errors, and every script
// counts it as a failure. Set LAB_TRACE=1 to see each step.
export function runWorker(memoryDir: string, policiesDir: string, c: Row): Result {
  const turns: string[] = [];
  let searches = 0, retried = false, cost = 0;
  for (let step = 0; step < 8; step++) {
    if (searches === 4) turns.push("--- you have used your four searches. Decide now, with the JSON decision.");
    const answer = ask(buildPrompt(memoryDir, c, turns));
    const reply = answer.reply;
    cost += answer.cost;
    if (typeof reply.search_policy === "string" && searches < 4) {
      searches++;
      const result = searchPolicy(policiesDir, c.company, reply.search_policy);
      if (process.env.LAB_TRACE) console.error(`  search_policy("${reply.search_policy}")`);
      turns.push(`--- you called search_policy("${reply.search_policy}"); result:\n${result}`);
      continue;
    }
    const errors = validateDecision(reply, c, policiesDir, memoryDir);
    if (errors.length && !retried) {
      retried = true;
      if (process.env.LAB_TRACE) console.error(`  rejected: ${errors.join("; ")}`);
      turns.push(`--- your answer was rejected: ${errors.join("; ")}. Answer again with one valid JSON decision.`);
      continue;
    }
    return { ...(reply as Decision), searches, errors, cost_usd: cost };
  }
  return { document: c.document, decision: "ask", due_date: null, cite: "", searches, errors: ["no decision after eight steps"], cost_usd: cost } as Result;
}

export function newestVersion(publishedDir: string): string {
  const versions = readdirSync(publishedDir).filter((n) => /^v\d+$/.test(n)).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
  if (!versions.length) throw new Error(`no published version in ${publishedDir}`);
  return join(publishedDir, versions[versions.length - 1]);
}
