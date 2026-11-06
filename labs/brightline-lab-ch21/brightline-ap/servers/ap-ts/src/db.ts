// The connector's database layer (19.9, 19.10, 19.17). One rule, everywhere:
//   one tool call = one read-only transaction, with the company set for that transaction only,
//   and every query also names the company as a parameter.
// The company comes from the request context (Chapter 18), never from a tool's input or the model.
// Trusted code writes every SQL statement here. Every value is a parameter ($1, $2, ...).
import pg from "pg";
import { toVector } from "./embeddings.ts";

/** Anything that can run one parameterized query: a pooled connection, or a client for one request. */
export interface Queryable {
  query<R extends pg.QueryResultRow = pg.QueryResultRow>(text: string, values?: unknown[]): Promise<pg.QueryResult<R>>;
}
interface Connection extends Queryable {
  release(): void | Promise<void>;
}
/** Where connections come from: a pool on your computer, Hyperdrive in a Worker. */
export type Connect = () => Promise<Connection>;

/** The database did not answer in time (statement_timeout, Postgres error 57014). */
export class DatabaseTimeout extends Error {}
/** The database could not be reached or failed: never shows the connection string or the SQL. */
export class DatabaseUnavailable extends Error {}

export const NO_DATA = Symbol("no data connected for this company");

export const STATEMENT_TIMEOUT_MS = 3000;

export interface VendorRow { vendor_id: string; vendor_name: string; terms: string; bank_account_last4: string | null; note: string | null }
export interface InvoiceRow { invoice_number: string; vendor_id: string; invoice_date: string; due_date: string | null; amount_cents: number }
export interface PoRow { po_number: string; vendor_id: string; po_date: string; amount_cents: number; invoice_number: string | null }
export interface PassageRow { document_id: string; title: string; file: string; section: string; line_start: number; line_end: number; content: string; similarity: number }

/** The queries one tool call may run, already bound to its company. */
export class TenantQueries {
  readonly tenant: string;
  private readonly c: Queryable;
  constructor(c: Queryable, tenant: string) {
    this.c = c;
    this.tenant = tenant;
  }

  async vendorIds(): Promise<string[]> {
    const r = await this.c.query<{ vendor_id: string }>("SELECT vendor_id FROM vendors WHERE tenant_id = $1 ORDER BY vendor_id", [this.tenant]);
    return r.rows.map((x) => x.vendor_id);
  }

  /** One vendor by id, or every vendor whose name contains the text (any case). */
  async vendors(by: { vendor_id: string } | { name: string }): Promise<VendorRow[]> {
    const where = "vendor_id" in by ? "v.vendor_id = $2" : "strpos(lower(v.vendor_name), lower($2)) > 0";
    const r = await this.c.query<VendorRow>(
      `SELECT v.vendor_id, v.vendor_name, v.terms, b.account_last4 AS bank_account_last4, n.note
         FROM vendors v
         LEFT JOIN vendor_banking b ON b.tenant_id = v.tenant_id AND b.vendor_id = v.vendor_id
         LEFT JOIN vendor_notes   n ON n.tenant_id = v.tenant_id AND n.vendor_id = v.vendor_id
        WHERE v.tenant_id = $1 AND ${where}
        ORDER BY v.vendor_id`,
      [this.tenant, "vendor_id" in by ? by.vendor_id : by.name],
    );
    return r.rows;
  }

  async openInvoices(f: { vendor_id: string | null; due_on_or_before: string | null }, offset: number, limit: number) {
    const params = [this.tenant, f.vendor_id, f.due_on_or_before];
    const filter = `status = 'open' AND ($2::text IS NULL OR vendor_id = $2)
                    AND ($3::date IS NULL OR (due_date IS NOT NULL AND due_date <= $3::date))`;
    const [page, count] = await Promise.all([
      this.c.query<InvoiceRow>(
        `SELECT invoice_number, vendor_id, to_char(invoice_date, 'YYYY-MM-DD') AS invoice_date,
                to_char(due_date, 'YYYY-MM-DD') AS due_date, amount_cents::int AS amount_cents
           FROM invoices WHERE tenant_id = $1 AND ${filter} ORDER BY invoice_number OFFSET $4 LIMIT $5`,
        [...params, offset, limit],
      ),
      this.c.query<{ n: number }>(`SELECT count(*)::int AS n FROM invoices WHERE tenant_id = $1 AND ${filter}`, params),
    ]);
    return { invoices: page.rows, total: count.rows[0].n };
  }

  async invoice(invoice_number: string): Promise<InvoiceRow | undefined> {
    const r = await this.c.query<InvoiceRow>(
      `SELECT invoice_number, vendor_id, to_char(invoice_date, 'YYYY-MM-DD') AS invoice_date,
              to_char(due_date, 'YYYY-MM-DD') AS due_date, amount_cents::int AS amount_cents
         FROM invoices WHERE tenant_id = $1 AND invoice_number = $2`,
      [this.tenant, invoice_number],
    );
    return r.rows[0];
  }

  async purchaseOrder(by: { po_number: string } | { invoice_number: string }): Promise<PoRow | undefined> {
    const where = "po_number" in by ? "po_number = $2" : "invoice_number = $2";
    const r = await this.c.query<PoRow>(
      `SELECT po_number, vendor_id, to_char(po_date, 'YYYY-MM-DD') AS po_date, amount_cents::int AS amount_cents, invoice_number
         FROM purchase_orders WHERE tenant_id = $1 AND ${where} ORDER BY po_number LIMIT 1`,
      [this.tenant, "po_number" in by ? by.po_number : by.invoice_number],
    );
    return r.rows[0];
  }

  async poRange(): Promise<{ first: string | null; last: string | null }> {
    const r = await this.c.query<{ first: string | null; last: string | null }>(
      "SELECT min(po_number) AS first, max(po_number) AS last FROM purchase_orders WHERE tenant_id = $1",
      [this.tenant],
    );
    return r.rows[0];
  }

  async approvalThresholdCents(): Promise<number> {
    const r = await this.c.query<{ cents: number }>(
      "SELECT approval_threshold_cents::int AS cents FROM tenant_settings WHERE tenant_id = $1",
      [this.tenant],
    );
    if (!r.rows[0]) throw new Error("this company has no settings row"); // the loader always writes one
    return r.rows[0].cents;
  }

  /** The passages nearest the question, this company's only, from the same model (19.13). */
  async nearestPassages(embedding: number[], model: string, limit: number): Promise<PassageRow[]> {
    const r = await this.c.query<PassageRow>(
      `SELECT p.document_id, d.title, d.file, p.section, p.line_start, p.line_end, p.content,
              1 - (p.embedding <=> $2::vector) AS similarity
         FROM policy_passages p
         JOIN policy_documents d ON d.tenant_id = p.tenant_id AND d.document_id = p.document_id
        WHERE p.tenant_id = $1 AND p.embedding_model = $3
        ORDER BY p.embedding <=> $2::vector
        LIMIT $4`,
      [this.tenant, toVector(embedding), model, limit],
    );
    return r.rows.map((row) => ({ ...row, similarity: Number(row.similarity) }));
  }

  async passageModels(): Promise<string[]> {
    const r = await this.c.query<{ m: string }>(
      "SELECT DISTINCT embedding_model AS m FROM policy_passages WHERE tenant_id = $1 ORDER BY m", [this.tenant]);
    return r.rows.map((x) => x.m);
  }
}

export interface ApDatabase {
  /** Run one tool call's queries for one company, in one transaction. NO_DATA if none is connected. */
  forTenant<T>(tenant: string, work: (q: TenantQueries) => Promise<T>): Promise<T | typeof NO_DATA>;
}

/**
 * The one way the connector reaches company data. BEGIN READ ONLY, then the company and a timeout
 * for this transaction only (set_config(..., true), which is SET LOCAL), then the work, then COMMIT.
 * A pooled connection goes back to the pool with neither setting on it.
 */
export function apDatabase(connect: Connect, timeoutMs = STATEMENT_TIMEOUT_MS): ApDatabase {
  return {
    async forTenant(tenant, work) {
      if (!/^org_[a-z0-9_]+$/.test(tenant)) throw new Error("not a company id");
      let c: Connection;
      try {
        c = await connect();
      } catch (err) {
        // A database that is waking up answers slowly: a connection that times out is a timeout (19.17).
        if (/timeout/i.test((err as Error).message ?? "")) throw new DatabaseTimeout("connection timeout");
        throw new DatabaseUnavailable("could not connect");
      }
      try {
        await c.query("BEGIN READ ONLY");
        await c.query("SELECT set_config('app.tenant_id', $1, true), set_config('statement_timeout', $2, true)", [tenant, String(timeoutMs)]);
        const connected = await c.query("SELECT 1 FROM tenants WHERE id = $1", [tenant]);
        if (connected.rowCount === 0) {
          await c.query("ROLLBACK");
          return NO_DATA;
        }
        const result = await work(new TenantQueries(c, tenant));
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

/** On your computer and in tests: a small pool, as the reader role (DATABASE_URL_READER). */
export function poolConnect(connectionString: string, max = 5): { connect: Connect; end: () => Promise<void> } {
  // allowExitOnIdle: a script or test can end while the pool holds idle connections.
  const pool = new pg.Pool({ connectionString, max, connectionTimeoutMillis: 5000, idleTimeoutMillis: 10_000, allowExitOnIdle: true });
  pool.on("error", () => undefined); // an idle connection dropped by the server: the pool makes a new one
  return { connect: async () => pool.connect(), end: () => pool.end() };
}

/** In a Worker: one client per request through the Hyperdrive binding, which does the pooling. */
export function hyperdriveConnect(connectionString: string): Connect {
  return async () => {
    // Connecting can take a while when a sleeping database wakes. Five seconds, then the timeout message (19.17).
    const client = new pg.Client({ connectionString, connectionTimeoutMillis: 5000 });
    await client.connect();
    return { query: client.query.bind(client) as Queryable["query"], release: () => client.end() };
  };
}

/** The message a tool returns when the database is slow or down (17.3: say what to do next). */
export const DB_TIMEOUT_MESSAGE = "The AP database did not answer in time. It may be waking up. Try again in a few seconds.";
export const DB_UNAVAILABLE_MESSAGE = "The AP database is not reachable right now. Try again in a minute, and tell the AP lead if it keeps happening.";
