// The review workspace connector (Lab 20b, docs/review-spec.md): five tools and one page, built fresh
// for every request. It writes review notes only, never vendors, invoices or payments. Every call is
// one transaction for the token's company (19.9), and saving needs review:write as well as review:read.
import { McpServer, requireScopes, type AuthInfo, type ScopeChallengeHandler } from "@modelcontextprotocol/server";
import { registerAppResource, RESOURCE_MIME_TYPE, RESOURCE_URI_META_KEY } from "@modelcontextprotocol/ext-apps/server";
import * as z from "zod/v4";
import { companyName, noData } from "../../ap-ts/src/companies.ts";
import { DB_TIMEOUT_MESSAGE, DB_UNAVAILABLE_MESSAGE } from "../../ap-ts/src/db.ts";
import { DatabaseTimeout, NO_DATA, STATUSES, type ReviewDatabase, type ReviewQueries, type ReviewRow } from "./db.ts";
import { PAGE_HTML } from "./page-html.ts";

export const PAGE_URI = "ui://brightline/review-workspace.html";
export const SIGN_IN = "Sign in to use the Brightline review workspace.";

/** Rule 6 (18.16): one line per call. Company, person and app from the slip; never the token, inputs or results. */
export interface AuditLine {
  event: "tools/call";
  company: string;
  person: string;
  app: string;
  tool: string;
  outcome: "ok" | "tool_error" | "no_data" | "insufficient_scope" | "company_input" | "rate_limited" | "db_timeout" | "error";
  ms: number;
}
export const consoleLog = (line: AuditLine) => console.log(JSON.stringify(line));

/** The locked request context the token check writes, and the tools only read. */
export interface RequestAuth {
  readonly tenant: string; // the company, from the token's tenant claim
  readonly person: string; // the token's sub
  readonly name: string; // the token's name claim, or the sub when a token has none
  readonly app: string; // the token's client_id
  readonly scopes: readonly string[];
}

export interface RequestDeps {
  db: ReviewDatabase;
  auth: RequestAuth;
  /** The review's date (REVIEW_AS_OF, YYYY-MM-DD): "overdue" means due before it. In the lab, 2027-03-30. */
  asOf: string;
  /** Claude's sandbox address for the page (Task 5, `ui.domain`), when the connector is online. */
  uiDomain?: string;
  log?: (line: AuditLine) => void;
}

type ToolResult = { content: { type: "text"; text: string }[]; structuredContent?: Record<string, unknown>; isError?: boolean };
const fail = (message: string): ToolResult => ({ content: [{ type: "text", text: message }], isError: true });
const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;
const INVOICE = /^INV-\d{4}$/;

export const money = (cents: number) =>
  "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const notFound = (n: string, tenant: string) => `Invoice ${n} was not found among ${companyName(tenant)}'s open invoices.`;
export const changed = (name: string, version: number, at: string) =>
  `This note changed after you opened it: ${name} saved version ${version} at ${at.replace("T", " ").replace("Z", " UTC")}. ` +
  "Your text was not saved. Reload and compare, then save again.";

/** The SDK's requireScopes, with the 403's wording from docs/review-spec.md. */
function needs(onRefusal: (info: AuthInfo | undefined, tool: string) => void, tool: string, ...scopes: [string, ...string[]]): ScopeChallengeHandler {
  const check = requireScopes(...scopes);
  return async (context) => {
    const challenge = await check(context);
    if (!challenge) return undefined;
    onRefusal(context.authInfo, tool);
    const company = companyName(String(context.authInfo?.extra?.tenant ?? ""));
    return { ...challenge, errorDescription: `${tool} needs ${scopes.join(" ")}. Your role in ${company} does not include it.` };
  };
}

function counts(rows: ReviewRow[], asOf: string) {
  const by = (s: string | null) => rows.filter((r) => r.status === s).length;
  return {
    open_invoices: rows.length,
    total_cents: rows.reduce((n, r) => n + r.amount_cents, 0),
    overdue: rows.filter((r) => r.due_date !== null && r.due_date < asOf).length,
    notes: { reviewed: by("reviewed"), "follow up": by("follow up"), open: by("open"), none: by(null) },
  };
}

export function makeServer(deps: RequestDeps): McpServer {
  const log = deps.log ?? consoleLog;
  const auth = deps.auth;
  /** Rule 1 and rule 6: no slip, no answer; one transaction for the slip's company; one audit line. */
  const run = async (tool: string, work: (q: ReviewQueries) => Promise<ToolResult>, opts: { write?: boolean } = {}): Promise<ToolResult> => {
    const started = performance.now();
    const line = (outcome: AuditLine["outcome"]) => {
      if (auth?.tenant) log({ event: "tools/call", company: auth.tenant, person: auth.person, app: auth.app, tool, outcome, ms: Math.round(performance.now() - started) });
    };
    if (!auth || !Object.isFrozen(auth) || !auth.tenant || !auth.person) return fail(SIGN_IN);
    try {
      const result = await deps.db.forTenant(auth.tenant, work, opts);
      if (result === NO_DATA) {
        line("no_data");
        return fail(noData(auth.tenant));
      }
      line(result.isError ? "tool_error" : "ok");
      return result;
    } catch (err) {
      const timeout = err instanceof DatabaseTimeout;
      line(timeout ? "db_timeout" : "error");
      return fail(timeout ? DB_TIMEOUT_MESSAGE : DB_UNAVAILABLE_MESSAGE);
    }
  };
  const scopeRefused = (info: AuthInfo | undefined, tool: string) => {
    const tenant = info?.extra?.tenant, person = info?.extra?.sub;
    if (typeof tenant === "string" && typeof person === "string")
      log({ event: "tools/call", company: tenant, person, app: info!.clientId, tool, outcome: "insufficient_scope", ms: 0 });
  };
  const server = new McpServer(
    { name: "brightline-review", version: "0.1.0" },
    { capabilities: { tools: { listChanged: false }, resources: {}, extensions: { "io.modelcontextprotocol/ui": {} } } },
  );
  const page = { ui: { resourceUri: PAGE_URI }, [RESOURCE_URI_META_KEY]: PAGE_URI };

  server.registerTool(
    "open_review_workspace",
    {
      title: "Open the month-end review workspace",
      description:
        "Open your company's month-end review of its open invoices: each invoice with its review note's status. " +
        "In an AI app that shows screens, this opens the review workspace. Read-only.",
      inputSchema: z.object({}).strict(),
      annotations: READ_ONLY,
      _meta: page,
      scopeChallenge: needs(scopeRefused, "open_review_workspace", "review:read"),
    },
    async () => run("open_review_workspace", async (q) => {
      const rows = await q.openInvoices();
      const c = counts(rows, deps.asOf);
      const company = companyName(q.tenant);
      const text =
        `${company}'s month-end review, as of ${deps.asOf}: ${c.open_invoices} open invoices, ${money(c.total_cents)} in all, ` +
        `${c.overdue} of them overdue. Notes: ${c.notes.reviewed} reviewed, ${c.notes["follow up"]} to follow up, ${c.notes.open} open, ` +
        `${c.notes.none} with no note yet. Call get_review_note for one invoice's note, or export_review for the whole review as Markdown.`;
      return { content: [{ type: "text", text }], structuredContent: { company, as_of: deps.asOf, ...c, invoices: rows } };
    }),
  );

  server.registerTool(
    "review_list",
    {
      title: "List the review",
      description:
        "Your company's open invoices with their review notes' status, filtered: overdue (due before the review date), " +
        "one vendor (vendor_id such as V102), or one status (open, reviewed, follow up, or none for no note yet). Read-only.",
      inputSchema: z.object({
        overdue: z.boolean().optional().describe("Only invoices due before the review date."),
        vendor_id: z.string().regex(/^V\d{3}$/).optional().describe("Only this vendor's invoices, such as V102."),
        status: z.enum([...STATUSES, "none"]).optional().describe("Only notes with this status, or none for no note yet."),
      }).strict(),
      annotations: READ_ONLY,
      scopeChallenge: needs(scopeRefused, "review_list", "review:read"),
    },
    async (args) => run("review_list", async (q) => {
      const rows = (await q.openInvoices()).filter((r) =>
        (!args.overdue || (r.due_date !== null && r.due_date < deps.asOf)) &&
        (!args.vendor_id || r.vendor_id === args.vendor_id) &&
        (!args.status || (args.status === "none" ? r.status === null : r.status === args.status)));
      const value = { as_of: deps.asOf, invoices: rows, count: rows.length };
      return { content: [{ type: "text", text: JSON.stringify(value) }], structuredContent: value };
    }),
  );

  server.registerTool(
    "get_review_note",
    {
      title: "Get one invoice's review note",
      description:
        "One open invoice of your company, with its vendor, its purchase order if it has one, and its review note: the text, " +
        "the status, the version, and who saved it and when. Version 0 means no note yet. Read-only.",
      inputSchema: z.object({ invoice_number: z.string().describe("An invoice number such as INV-6201.") }).strict(),
      annotations: READ_ONLY,
      scopeChallenge: needs(scopeRefused, "get_review_note", "review:read"),
    },
    async ({ invoice_number }) => run("get_review_note", async (q) => {
      if (!INVOICE.test(invoice_number)) return fail("invoice_number looks like INV-6201.");
      const invoice = await q.invoice(invoice_number);
      if (!invoice) return fail(notFound(invoice_number, q.tenant));
      const note = await q.note(invoice_number);
      const value = { invoice, note: note ?? { note: "", status: null, version: 0, saved_by_name: null, saved_at: null } };
      return { content: [{ type: "text", text: JSON.stringify(value) }], structuredContent: value };
    }),
  );

  // Saving is the one write. The page's Save button calls it, so it is offered to the page only. Hidden
  // is not protected (20.5): the scope, the company and the version check are what protect it.
  server.registerTool(
    "save_review_note",
    {
      title: "Save a review note",
      description:
        "For the review workspace: save the note on one open invoice of your company. Pass the version you last saw " +
        "(0 for no note yet). If someone saved since, nothing is saved and the answer says who saved and when. " +
        "Needs review:write. Changes only the review note, never the invoice.",
      inputSchema: z.object({
        invoice_number: z.string().describe("An invoice number such as INV-6201."),
        note: z.string().max(2000).describe("The note's text, at most 2,000 characters."),
        status: z.enum(STATUSES).describe("open, reviewed or follow up."),
        version: z.number().int().min(0).describe("The version you last saw: 0 for no note yet."),
      }).strict(),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
      _meta: { ui: { resourceUri: PAGE_URI, visibility: ["app"] }, [RESOURCE_URI_META_KEY]: PAGE_URI },
      scopeChallenge: needs(scopeRefused, "save_review_note", "review:read", "review:write"),
    },
    async (args) => run("save_review_note", async (q) => {
      if (!INVOICE.test(args.invoice_number)) return fail("invoice_number looks like INV-6201.");
      const outcome = await q.saveNote(args.invoice_number, args.note, args.status, args.version, auth.person, auth.name);
      if (outcome.kind === "not_found") return fail(notFound(args.invoice_number, q.tenant));
      if (outcome.kind === "changed") return fail(changed(outcome.current.saved_by_name, outcome.current.version, outcome.current.saved_at));
      const value = { invoice_number: args.invoice_number, version: outcome.version, saved_by_name: auth.name, saved_at: outcome.saved_at };
      return {
        content: [{ type: "text", text: `Saved the note on ${args.invoice_number} as version ${outcome.version}, by ${auth.name}.` }],
        structuredContent: value,
      };
    }, { write: true }),
  );

  server.registerTool(
    "export_review",
    {
      title: "Export the review as Markdown",
      description: "Your company's month-end review as Markdown text: every open invoice, its note's status and text, and who saved it. Read-only.",
      inputSchema: z.object({}).strict(),
      annotations: READ_ONLY,
      scopeChallenge: needs(scopeRefused, "export_review", "review:read"),
    },
    async () => run("export_review", async (q) => {
      const rows = await q.openInvoices();
      const c = counts(rows, deps.asOf);
      const lines = [
        `# ${companyName(q.tenant)}: month-end review, as of ${deps.asOf}`,
        "",
        `${c.open_invoices} open invoices, ${money(c.total_cents)} in all. ${c.notes.reviewed} reviewed, ${c.notes["follow up"]} to follow up, ` +
          `${c.notes.open} open, ${c.notes.none} with no note yet.`,
        "",
        "| Invoice | Vendor | Amount | Due | Status | Note | Saved by |",
        "| --- | --- | --- | --- | --- | --- | --- |",
      ];
      for (const r of rows) {
        const note = r.version ? (await q.note(r.invoice_number))!.note : "";
        // Markdown is text: a note's own pipes and line breaks are written so they cannot break the table.
        const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
        lines.push(`| ${r.invoice_number} | ${r.vendor_id} ${cell(r.vendor_name)} | ${money(r.amount_cents)} | ${r.due_date ?? "none"} | ` +
          `${r.status ?? "no note"} | ${cell(note)} | ${r.saved_by_name ? `${cell(r.saved_by_name)}, ${r.saved_at}` : ""} |`);
      }
      const markdown = lines.join("\n");
      return { content: [{ type: "text", text: markdown }], structuredContent: { markdown } };
    }),
  );

  registerAppResource(server, "Review workspace", PAGE_URI, { mimeType: RESOURCE_MIME_TYPE }, async () => ({
    contents: [{
      uri: PAGE_URI, mimeType: RESOURCE_MIME_TYPE, text: PAGE_HTML,
      // No outside address: the page bundles its code (20.6). Online, Claude's sandbox address (Task 5).
      _meta: { ui: { csp: { connectDomains: [], resourceDomains: [] }, ...(deps.uiDomain ? { domain: deps.uiDomain } : {}), prefersBorder: true } },
    }],
  }));
  return server;
}
