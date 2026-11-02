// A small sample of Brightline's AP system's API, run on your own computer.
// Run: npm run api   (needs AP_API_KEY in .env)
import { createServer, type Server } from "node:http";
import { pathToFileURL } from "node:url";
import { readData } from "../src/csv.ts";
import { loadInvoices } from "../src/load-invoices.ts";
import { VendorDirectory } from "../src/vendor-directory.ts";

const PAGE_SIZE = 5;

export function createApApi(key: string): Server {
  let firstVendorsCall = true;
  const vendorsCsv = readData("vendors.csv");
  const directory = VendorDirectory.fromCsv(vendorsCsv);
  const vendors = vendorsCsv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((l) => {
      const [id, name, terms] = l.split(",");
      return { id, name, terms };
    });
  const invoices = loadInvoices(readData("invoices.csv"), directory).valid;

  return createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const send = (status: number, body: unknown) => {
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify(body));
    };
    if (req.headers["x-api-key"] !== key) return send(401, { error: "missing or wrong X-API-Key" });
    if (url.pathname === "/vendors") {
      if (firstVendorsCall) {
        firstVendorsCall = false;
        return send(503, { error: "busy, try again" });
      }
      return send(200, { vendors });
    }
    if (url.pathname === "/invoices") {
      const status = url.searchParams.get("status") ?? "open";
      const page = Number(url.searchParams.get("page") ?? "1");
      const matching = invoices.filter((i) => i.status === status);
      const pages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
      if (!Number.isInteger(page) || page < 1 || page > pages) return send(400, { error: `page must be 1 to ${pages}` });
      const items = matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
      return send(200, { invoices: items, page, pages });
    }
    return send(404, { error: "not found" });
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const key = process.env["AP_API_KEY"];
  if (!key) throw new Error("Set AP_API_KEY in .env (copy .env.example)");
  createApApi(key).listen(4010, () => console.log("AP API on http://localhost:4010"));
}
