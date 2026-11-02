# Lab 16 answer key: Task 4. The engine

The answers for Task 4 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's files may differ from this key in wording and layout. Compare the results, and what each file does.

With the engine, every TypeScript test passes, 55 with the authors' 13, and `git diff HEAD -- tests` prints nothing. Your count will differ, because your agent wrote its own tests. What matters is that they pass, and that none changed. `npm run triage -- data/invoices-intake.csv 2027-03-08` prints:

```text
Triage for run date 2027-03-08

EXCEPTION: 4 invoices, $4,136.95
  INV-6002  V009  due 2027-03-26  $875.00  (unknown vendor)
  INV-6003  V002  due 2027-03-24  $612.00  (terms mismatch)
  INV-6001  V001  due 2027-03-18  $2,450.00  (possible duplicate)
  INV-8312  V004  due 2027-03-05  $199.95  (possible duplicate)

NEEDS APPROVAL: 2 invoices, $17,500.01
  INV-6004  V003  due 2027-03-23  $5,000.01
  INV-6011  V002  due 2027-03-09  $12,500.00

URGENT: 2 invoices, $2,321.42
  INV-6005  V004  due 2027-03-11  $334.00
  INV-6008  V007  due 2027-03-07  $1,987.42

READY: 5 invoices, $12,698.00
  INV-6001  V001  due 2027-03-18  $2,450.00
  INV-6006  V005  due 2027-03-28  $3,125.00
  INV-6007  V006  due 2027-03-13  $1,580.00
  INV-6009  V008  due 2027-03-12  $543.00
  INV-6012  V003  due 2027-03-29  $5,000.00

13 invoices: 4 exception, 2 needs approval, 2 urgent, 5 ready
```

The exceptions also show due dates. Rule order decides the pile, but the due date is still worth showing the AP lead.

The limit is `CONTROLLER_LIMIT_CENTS = 500_000`, compared with `>`, not `>=`, because exactly $5,000.00 does not count. The three days are `URGENT_DAYS = 3`. `npm run triage` runs `node src/triage.ts`.

`src/triage.ts`:

```ts
// Invoice triage: the six rules in docs/ap-triage-rules.md, first match wins.
// Triage sorts invoices for people. It never decides a payment.
// Run: npm run triage -- data/invoices-intake.csv 2027-03-08 [--json]
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { readData, records } from "./csv.ts";
import { dueDate, parseTerms } from "./due-date.ts";
import { usd } from "./money.ts";
import { InvoiceSchema, VendorSchema, type Invoice, type Vendor } from "./schemas.ts";

export const PILES = ["exception", "needs approval", "urgent", "ready"] as const;
export type Pile = (typeof PILES)[number];
export type Reason = "unknown vendor" | "possible duplicate" | "terms mismatch";
export type Result = { pile: Pile; reason?: Reason; due: string };
export type Seen = { ledger: readonly Invoice[]; earlier: readonly Invoice[] };

/** $5,000.00, in cents. More than this needs the controller. Exactly this does not (rule 4). */
export const CONTROLLER_LIMIT_CENTS = 500_000;
/** Due on the run date, up to this many days after it, or past due, is urgent (rule 5). */
export const URGENT_DAYS = 3;

const DAY_MS = 86_400_000;

export function loadBatch(csv: string): Invoice[] {
  return records(csv).map((r) =>
    InvoiceSchema.parse({
      number: r["invoice_number"],
      vendorId: r["vendor_id"],
      invoiceDate: r["invoice_date"],
      dueDate: r["due_date"] === "" ? null : r["due_date"],
      terms: r["terms"],
      amountCents: Number(r["amount_cents"]),
      status: r["status"],
    }),
  );
}

export function loadVendors(csv: string): Vendor[] {
  return records(csv).map((r) => VendorSchema.parse({ id: r["vendor_id"], name: r["vendor_name"], terms: r["terms"] }));
}

export function triage(invoice: Invoice, vendors: readonly Vendor[], runDate: string, seen: Seen): Result {
  const due = invoice.dueDate ?? dueDate(invoice.invoiceDate, parseTerms(invoice.terms));
  const vendor = vendors.find((v) => v.id === invoice.vendorId);
  if (!vendor) return { pile: "exception", reason: "unknown vendor", due };
  const sameNumber = (other: Invoice) => other.number === invoice.number;
  if (seen.ledger.some(sameNumber) || seen.earlier.some(sameNumber)) {
    return { pile: "exception", reason: "possible duplicate", due };
  }
  if (invoice.terms !== vendor.terms) return { pile: "exception", reason: "terms mismatch", due };
  if (invoice.amountCents > CONTROLLER_LIMIT_CENTS) return { pile: "needs approval", due };
  if ((Date.parse(due) - Date.parse(runDate)) / DAY_MS <= URGENT_DAYS) return { pile: "urgent", due };
  return { pile: "ready", due };
}

export type Line = { invoice: Invoice; result: Result };
export type Report = { runDate: string; lines: Line[]; counts: Record<Pile, number>; totals: Record<Pile, number> };

export function triageBatch(
  batch: readonly Invoice[],
  vendors: readonly Vendor[],
  ledger: readonly Invoice[],
  runDate: string,
): Report {
  const lines: Line[] = batch.map((invoice, i) => ({
    invoice,
    result: triage(invoice, vendors, runDate, { ledger, earlier: batch.slice(0, i) }),
  }));
  const inPile = (pile: Pile) => lines.filter((line) => line.result.pile === pile);
  const counts = Object.fromEntries(PILES.map((p) => [p, inPile(p).length])) as Record<Pile, number>;
  const totals = Object.fromEntries(
    PILES.map((p) => [p, inPile(p).reduce((sum, line) => sum + line.invoice.amountCents, 0)]),
  ) as Record<Pile, number>;
  return { runDate, lines, counts, totals };
}

function main(argv: string[]): void {
  const json = argv.includes("--json");
  const [file, runDate] = argv.filter((arg) => arg !== "--json");
  if (!file || !runDate || !/^\d{4}-\d{2}-\d{2}$/.test(runDate)) {
    console.error("Usage: npm run triage -- <batch.csv> <run date YYYY-MM-DD> [--json]");
    process.exit(2);
  }
  const report = triageBatch(
    loadBatch(readFileSync(file, "utf8")),
    loadVendors(readData("vendors.csv")),
    loadBatch(readData("invoices.csv")),
    runDate,
  );
  if (json) {
    const lines = report.lines.map(({ invoice, result }) => ({
      invoice: invoice.number,
      vendor: invoice.vendorId,
      amount_cents: invoice.amountCents,
      ...result,
    }));
    console.log(JSON.stringify({ runDate, counts: report.counts, totals: report.totals, lines }, null, 2));
    return;
  }
  console.log(`Triage for run date ${runDate}`);
  for (const pile of PILES) {
    console.log(`\n${pile.toUpperCase()}: ${report.counts[pile]} invoices, ${usd(report.totals[pile])}`);
    for (const { invoice, result } of report.lines.filter((line) => line.result.pile === pile)) {
      const why = result.reason ? `  (${result.reason})` : "";
      console.log(`  ${invoice.number}  ${invoice.vendorId}  due ${result.due}  ${usd(invoice.amountCents)}${why}`);
    }
  }
  console.log(`\n${report.lines.length} invoices: ${PILES.map((p) => `${report.counts[p]} ${p}`).join(", ")}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main(process.argv.slice(2));
```
