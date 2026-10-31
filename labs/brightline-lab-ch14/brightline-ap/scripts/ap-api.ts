// A small local REST API that serves Brightline's sample AP data, for Lab 14.
// It is made up. It runs on your own computer and calls no outside service.
//
// Start it:  npm run api   (it reads AP_API_KEY from .env)
// Endpoints: GET /vendors
//            GET /invoices?status=open&page=1   (5 invoices per page)
// Every request needs the header X-API-Key, matching AP_API_KEY.
// The first call to /vendors answers 503 once, so a client's retry can be tested.
// Each answer waits a moment, so you can see whether calls overlap.
import { createServer, type Server } from "node:http";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { readRows } from "../src/csv.ts";

export type ApiOptions = { apiKey: string; delayMs?: number; failFirstVendors?: boolean };

const PAGE_SIZE = 5;

export function createApApi({ apiKey, delayMs = 300, failFirstVendors = true }: ApiOptions): Server {
  const read = (name: string) => readFileSync(new URL(`../data/${name}`, import.meta.url), "utf8");
  const vendors = readRows(read("vendors.csv")).map((r) => ({ id: r.vendor_id, name: r.vendor_name, terms: r.terms }));
  const invoices = readRows(read("invoices.csv")).map((r) => ({
    number: r.invoice_number,
    vendorId: r.vendor_id,
    invoiceDate: r.invoice_date,
    dueDate: r.due_date === "" ? null : r.due_date,
    terms: r.terms,
    amountCents: Number(r.amount_cents),
    status: r.status,
  }));
  let vendorCalls = 0;

  return createServer((req, res) => {
    const send = (status: number, body: unknown) => {
      setTimeout(() => {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(body));
      }, delayMs);
    };
    const url = new URL(req.url ?? "/", "http://localhost");

    if (req.method !== "GET") return send(405, { error: "Only GET is allowed" });
    if (req.headers["x-api-key"] !== apiKey) return send(401, { error: "Missing or wrong X-API-Key header" });

    if (url.pathname === "/vendors") {
      vendorCalls += 1;
      if (failFirstVendors && vendorCalls === 1) return send(503, { error: "Busy, try again" });
      return send(200, { vendors });
    }

    if (url.pathname === "/invoices") {
      const status = url.searchParams.get("status");
      const page = Number(url.searchParams.get("page") ?? "1");
      const matching = status ? invoices.filter((i) => i.status === status) : invoices;
      const pages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
      if (!Number.isInteger(page) || page < 1 || page > pages) {
        return send(400, { error: `page must be a whole number from 1 to ${pages}` });
      }
      return send(200, { invoices: matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), page, pages });
    }

    return send(404, { error: `No endpoint at ${url.pathname}` });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const apiKey = process.env.AP_API_KEY;
  if (!apiKey) {
    console.error("Set AP_API_KEY first: copy .env.example to .env, put a key in it, then run npm run api");
    process.exit(1);
  }
  const port = Number(process.env.PORT ?? "4010");
  createApApi({ apiKey }).listen(port, () => console.log(`Sample AP API on http://localhost:${port}`));
}
