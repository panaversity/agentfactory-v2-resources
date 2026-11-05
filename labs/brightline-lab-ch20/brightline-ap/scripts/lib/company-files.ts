// Read one company's data folder and policy documents, checked row by row (Chapter 14's loader).
// Full bank account numbers are cut to the last four digits HERE, before anything reaches the database.
import { readFileSync, existsSync } from "node:fs";
import * as z from "zod/v4";
import { loadCsv } from "../../src/load.ts";
import { InvoiceSchema, VendorSchema } from "../../src/schemas.ts";

const NoteSchema = z.object({ vendor_id: z.string(), note: z.string().nullable() });
const FullBanking = z.object({ vendor_id: z.string(), bank_name: z.string(), routing_number: z.string(), account_number: z.string().regex(/^\d{4,}$/) });
const Last4Banking = z.object({ vendor_id: z.string(), bank_name: z.string(), account_last4: z.string().regex(/^\d{4}$/) });
const PoSchema = z.object({
  po_number: z.string().regex(/^PO-\d{4}$/), vendor_id: z.string().regex(/^V\d{3}$/),
  po_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), amount_cents: z.number().int().nonnegative(), invoice_number: z.string().nullable(),
});
const SettingSchema = z.object({ setting: z.literal("approval_threshold_cents"), value: z.string().regex(/^\d+$/) });
const ManifestSchema = z.object({ file: z.string(), document_id: z.string().regex(/^[a-z0-9-]+$/), title: z.string(), counts: z.enum(["yes", "no"]) });

function load<S extends z.ZodType>(path: string, schema: S): z.infer<S>[] {
  const { rows, problems } = loadCsv(readFileSync(path, "utf8"), schema);
  if (problems.length) throw new Error(`${path}: ${problems.length} bad rows, first at line ${problems[0].line}: ${problems[0].message}`);
  return rows;
}

export interface Passage { passage_id: string; document_id: string; section: string; line_start: number; line_end: number; content: string }

/**
 * Chunking (19.13): one passage per rule. A policy line that is not a heading or an "Owner:" line is
 * one passage, cited by its line number. "document" mode makes one passage per whole document: the
 * worse choice Lab 19 Task 14 measures.
 */
export function chunk(document_id: string, text: string, mode: "line" | "document" = "line"): Passage[] {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  let section = "";
  const out: Passage[] = [];
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (line.startsWith("#")) { section = line.replace(/^#+\s*/, ""); return; }
    if (!line || /^(Owner|From):/.test(line)) return;
    out.push({ passage_id: `${document_id}#L${i + 1}`, document_id, section, line_start: i + 1, line_end: i + 1, content: line });
  });
  if (mode === "document" && out.length) {
    return [{ passage_id: `${document_id}#all`, document_id, section, line_start: out[0].line_start, line_end: out.at(-1)!.line_end,
      content: out.map((p) => p.content).join(" ") }];
  }
  return out;
}

export function readCompany(folder: string, policiesDir: string, mode: "line" | "document" = "line") {
  const banking = load(`${folder}/vendor-banking.csv`, z.union([Last4Banking, FullBanking])).map((b) =>
    "account_last4" in b ? b : { vendor_id: b.vendor_id, bank_name: b.bank_name, account_last4: b.account_number.slice(-4) });
  const settings = existsSync(`${folder}/settings.csv`) ? load(`${folder}/settings.csv`, SettingSchema) : [];
  const threshold = settings.find((s) => s.setting === "approval_threshold_cents");
  if (!threshold) throw new Error(`${folder}/settings.csv must set approval_threshold_cents`);
  const manifest = load(`${policiesDir}/manifest.csv`, ManifestSchema);
  const documents = manifest.filter((m) => m.counts === "yes");
  const passages = documents.flatMap((d) => chunk(d.document_id, readFileSync(`${policiesDir}/${d.file}`, "utf8"), mode));
  return {
    vendors: load(`${folder}/vendors.csv`, VendorSchema),
    notes: load(`${folder}/vendor-notes.csv`, NoteSchema),
    banking,
    invoices: load(`${folder}/invoices.csv`, InvoiceSchema),
    purchaseOrders: load(`${folder}/purchase-orders.csv`, PoSchema),
    approvalThresholdCents: Number(threshold.value),
    documents: documents.map((d) => ({ document_id: d.document_id, title: d.title, file: `${policiesDir}/${d.file}` })),
    excluded: manifest.filter((m) => m.counts === "no").map((m) => m.file),
    passages,
  };
}
