// Load one company's data into the business database, as the loader role (19.11, Lab 19 Task 4).
//   npm run tenant:load -- --company org_cedar --folder data-cedar [--policies data-cedar/policies]
//                          [--env dev] [--replace] [--chunk line|document]
// Everything runs in ONE transaction with the company set for it, so row-level security refuses any
// row for another company, and a failure leaves nothing half-loaded. Prints counts, never rows.
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { parseArgs } from "./lib/admin.ts";
import { connectAs, dbEnvironment, inTenant } from "./lib/db.ts";
import { readCompany } from "./lib/company-files.ts";
import { embedderFromEnv, toVector } from "../servers/ap-ts/src/embeddings.ts";

const argv = process.argv.slice(2);
const env = dbEnvironment(argv);
const args = parseArgs(argv);
const company = args.one("company"), folder = args.one("folder");
if (!company || !folder) { console.error("usage: npm run tenant:load -- --company org_x --folder data-x [--policies dir] [--env dev] [--replace]"); process.exit(1); }
const policies = args.one("policies") ?? (existsSync(`${folder}/policies`) ? `${folder}/policies` : "docs/policies");
const mode = (args.one("chunk") ?? "line") as "line" | "document";
const data = readCompany(folder, policies, mode);
const embedder = embedderFromEnv(process.env);
// Embed before the transaction opens, so no connection waits on the model.
const vectors = data.passages.length ? await embedder.embed(data.passages.map((p) => p.content)) : [];

const db = await connectAs("LOADER");
const counts = await inTenant(db, company, async () => {
  const exists = (await db.query("SELECT 1 FROM tenants WHERE id = $1", [company])).rowCount;
  if (exists && !args.flag("replace")) throw new Error(`${company} already has data. Add --replace to load it again from the files.`);
  if (exists) for (const t of ["policy_passages", "policy_documents", "purchase_orders", "invoices", "vendor_banking", "vendor_notes", "vendors", "tenant_settings", "tenants"])
    await db.query(`DELETE FROM ${t} WHERE ${t === "tenants" ? "id" : "tenant_id"} = $1`, [company]);
  await db.query("INSERT INTO tenants (id) VALUES ($1)", [company]);
  await db.query("INSERT INTO tenant_settings (tenant_id, approval_threshold_cents) VALUES ($1, $2)", [company, data.approvalThresholdCents]);
  for (const v of data.vendors) await db.query("INSERT INTO vendors VALUES ($1, $2, $3, $4)", [company, v.vendor_id, v.vendor_name, v.terms]);
  for (const n of data.notes) await db.query("INSERT INTO vendor_notes VALUES ($1, $2, $3)", [company, n.vendor_id, n.note]);
  for (const b of data.banking) await db.query("INSERT INTO vendor_banking VALUES ($1, $2, $3, $4)", [company, b.vendor_id, b.bank_name, b.account_last4]);
  for (const i of data.invoices)
    await db.query("INSERT INTO invoices VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [company, i.invoice_number, i.vendor_id, i.invoice_date, i.due_date, i.terms, i.amount_cents, i.status]);
  for (const p of data.purchaseOrders)
    await db.query("INSERT INTO purchase_orders VALUES ($1, $2, $3, $4, $5, $6)", [company, p.po_number, p.vendor_id, p.po_date, p.amount_cents, p.invoice_number]);
  for (const d of data.documents) await db.query("INSERT INTO policy_documents VALUES ($1, $2, $3, $4)", [company, d.document_id, d.title, d.file]);
  for (const [k, p] of data.passages.entries())
    await db.query(
      `INSERT INTO policy_passages (tenant_id, passage_id, document_id, section, line_start, line_end, content, embedded_sha256, embedding_model, embedding)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::vector)`,
      [company, p.passage_id, p.document_id, p.section, p.line_start, p.line_end, p.content,
        createHash("sha256").update(p.content, "utf8").digest(), embedder.model, toVector(vectors[k])]);
  return { vendors: data.vendors.length, invoices: data.invoices.length, purchase_orders: data.purchaseOrders.length,
    policy_documents: data.documents.length, policy_passages: data.passages.length };
}).catch((err) => { console.error(`stopped, nothing loaded: ${(err as Error).message}`); process.exit(1); });
await db.end();
console.log(`${env}: loaded ${company} from ${folder}: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")}. Model ${embedder.model}.`);
if (data.excluded.length) console.log(`  not loaded (the AP lead said they do not count): ${data.excluded.join(", ")}`);
