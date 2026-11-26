// The workspace connector's database layer (Lab 20b, Task 3). The AP connector's rule, unchanged (19.9):
//   one tool call = one transaction, with the company set for that transaction only,
//   and every query also names the company as a parameter.
// It logs in as review_writer (DATABASE_URL_REVIEW_WRITER): the AP tables are read through their
// policies, and the only table it can write is review_notes. Trusted code writes every SQL statement.
import {
  DatabaseTimeout, DatabaseUnavailable, NO_DATA, STATEMENT_TIMEOUT_MS, hyperdriveConnect, poolConnect,
  type Connect, type Queryable,
} from "../../ap-ts/src/db.ts";

export { DatabaseTimeout, DatabaseUnavailable, NO_DATA, hyperdriveConnect, poolConnect };

export const STATUSES = ["open", "reviewed", "follow up"] as const;
export type Status = (typeof STATUSES)[number];

export interface ReviewRow {
  invoice_number: string; vendor_id: string; vendor_name: string; invoice_date: string; due_date: string | null;
  amount_cents: number; status: Status | null; version: number; saved_by_name: string | null; saved_at: string | null;
}
export interface NoteRow { note: string; status: Status; version: number; saved_by_name: string; saved_at: string }
export interface InvoiceDetail {
  invoice_number: string; vendor_id: string; vendor_name: string; invoice_date: string; due_date: string | null;
  amount_cents: number; terms: string;
  purchase_order: { po_number: string; amount_cents: number; po_date: string } | null;
}
export type SaveOutcome =
  | { kind: "saved"; version: number; saved_at: string }
  | { kind: "not_found" }
  | { kind: "changed"; current: NoteRow };

/** The queries one workspace call may run, already bound to its company. */
export class ReviewQueries {
  readonly tenant: string;
  private readonly c: Queryable;
  constructor(c: Queryable, tenant: string) {
    this.c = c;
    this.tenant = tenant;
  }

  /** Every open invoice, with its note's status and version (0 when there is no note yet). */
  async openInvoices(): Promise<ReviewRow[]> {
    const r = await this.c.query<ReviewRow>(
      `SELECT i.invoice_number, i.vendor_id, v.vendor_name, to_char(i.invoice_date, 'YYYY-MM-DD') AS invoice_date,
              to_char(i.due_date, 'YYYY-MM-DD') AS due_date, i.amount_cents::int AS amount_cents,
              n.status, coalesce(n.version, 0) AS version, n.saved_by_name,
              to_char(n.saved_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI"Z"') AS saved_at
         FROM invoices i
         JOIN vendors v ON v.tenant_id = i.tenant_id AND v.vendor_id = i.vendor_id
         LEFT JOIN review_notes n ON n.tenant_id = i.tenant_id AND n.invoice_number = i.invoice_number
        WHERE i.tenant_id = $1 AND i.status = 'open'
        ORDER BY i.invoice_number`,
      [this.tenant],
    );
    return r.rows;
  }

  /** One open invoice, with its vendor and purchase order, or null when the company has no such invoice. */
  async invoice(invoiceNumber: string): Promise<InvoiceDetail | null> {
    const r = await this.c.query<Omit<InvoiceDetail, "purchase_order">>(
      `SELECT i.invoice_number, i.vendor_id, v.vendor_name, to_char(i.invoice_date, 'YYYY-MM-DD') AS invoice_date,
              to_char(i.due_date, 'YYYY-MM-DD') AS due_date, i.amount_cents::int AS amount_cents, i.terms
         FROM invoices i JOIN vendors v ON v.tenant_id = i.tenant_id AND v.vendor_id = i.vendor_id
        WHERE i.tenant_id = $1 AND i.invoice_number = $2 AND i.status = 'open'`,
      [this.tenant, invoiceNumber],
    );
    if (!r.rows[0]) return null;
    const po = await this.c.query<{ po_number: string; amount_cents: number; po_date: string }>(
      `SELECT po_number, amount_cents::int AS amount_cents, to_char(po_date, 'YYYY-MM-DD') AS po_date
         FROM purchase_orders WHERE tenant_id = $1 AND invoice_number = $2 ORDER BY po_number LIMIT 1`,
      [this.tenant, invoiceNumber],
    );
    return { ...r.rows[0], purchase_order: po.rows[0] ?? null };
  }

  /** The note on one invoice, or null. */
  async note(invoiceNumber: string): Promise<NoteRow | null> {
    const r = await this.c.query<NoteRow>(
      `SELECT note, status, version, saved_by_name,
              to_char(saved_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI"Z"') AS saved_at
         FROM review_notes WHERE tenant_id = $1 AND invoice_number = $2`,
      [this.tenant, invoiceNumber],
    );
    return r.rows[0] ?? null;
  }

  /**
   * Save a note, only if nobody saved it since the person opened it: `seen` is the version they last
   * saw (0 for no note yet). The row is locked while it is compared, so two saves of the same version
   * cannot both win.
   */
  async saveNote(invoiceNumber: string, note: string, status: Status, seen: number, person: string, name: string): Promise<SaveOutcome> {
    const exists = await this.c.query("SELECT 1 FROM invoices WHERE tenant_id = $1 AND invoice_number = $2 AND status = 'open'", [this.tenant, invoiceNumber]);
    if (!exists.rowCount) return { kind: "not_found" };
    const current = await this.c.query<{ version: number }>(
      "SELECT version FROM review_notes WHERE tenant_id = $1 AND invoice_number = $2 FOR UPDATE", [this.tenant, invoiceNumber]);
    const version = current.rows[0]?.version ?? 0;
    if (version !== seen) return { kind: "changed", current: (await this.note(invoiceNumber))! };
    const saved = await this.c.query<{ version: number; saved_at: string }>(
      `INSERT INTO review_notes (tenant_id, invoice_number, note, status, version, saved_by, saved_by_name)
       VALUES ($1, $2, $3, $4, 1, $5, $6)
       ON CONFLICT (tenant_id, invoice_number) DO UPDATE
          SET note = EXCLUDED.note, status = EXCLUDED.status, version = review_notes.version + 1,
              saved_by = EXCLUDED.saved_by, saved_by_name = EXCLUDED.saved_by_name, saved_at = now()
        WHERE review_notes.version = $7
       RETURNING version, to_char(saved_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI"Z"') AS saved_at`,
      [this.tenant, invoiceNumber, note, status, person, name, seen],
    );
    if (!saved.rows[0]) return { kind: "changed", current: (await this.note(invoiceNumber))! };
    return { kind: "saved", ...saved.rows[0] };
  }
}

/** The workspace's database: one transaction per call, read-write for saves only. */
export interface ReviewDatabase {
  forTenant<T>(tenant: string, work: (q: ReviewQueries) => Promise<T>, opts?: { write?: boolean }): Promise<T | typeof NO_DATA>;
}

export function reviewDatabase(connect: Connect, timeoutMs = STATEMENT_TIMEOUT_MS): ReviewDatabase {
  return {
    async forTenant(tenant, work, opts = {}) {
      if (!/^org_[a-z0-9_]+$/.test(tenant)) throw new Error("not a company id");
      let c;
      try {
        c = await connect();
      } catch (err) {
        throw new DatabaseUnavailable((err as { code?: string }).code ?? "could not connect");
      }
      try {
        await c.query(opts.write ? "BEGIN" : "BEGIN READ ONLY");
        await c.query("SELECT set_config('app.tenant_id', $1, true), set_config('statement_timeout', $2, true)", [tenant, String(timeoutMs)]);
        const connected = await c.query("SELECT 1 FROM tenants WHERE id = $1", [tenant]);
        if (connected.rowCount === 0) {
          await c.query("ROLLBACK");
          return NO_DATA;
        }
        const result = await work(new ReviewQueries(c, tenant));
        await c.query("COMMIT");
        return result;
      } catch (err) {
        await c.query("ROLLBACK").catch(() => undefined);
        if ((err as { code?: string }).code === "57014") throw new DatabaseTimeout("statement timeout");
        if (err instanceof DatabaseTimeout || err instanceof DatabaseUnavailable) throw err;
        throw new DatabaseUnavailable((err as { code?: string }).code ?? "query failed");
      } finally {
        await c.release();
      }
    },
  };
}
