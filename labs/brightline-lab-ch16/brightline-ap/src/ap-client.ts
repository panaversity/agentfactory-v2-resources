// Fetch vendors and every page of open invoices from the AP API.
// Run: npm run fetch-ap   (with npm run api running in another terminal)
import { pathToFileURL } from "node:url";
import { z } from "zod";
import { InvoiceSchema, type Invoice } from "./schemas.ts";

const VendorRow = z.object({ id: z.string(), name: z.string(), terms: z.string() });
const VendorsBody = z.object({ vendors: z.array(VendorRow) });
const InvoicesBody = z.object({ invoices: z.array(InvoiceSchema), page: z.number(), pages: z.number() });

export type ClientOptions = { baseUrl: string; key: string; timeoutMs?: number };

async function getJson(path: string, o: ClientOptions): Promise<unknown> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${o.baseUrl}${path}`, {
      headers: { "X-API-Key": o.key },
      signal: AbortSignal.timeout(o.timeoutMs ?? 2000),
    });
    if (res.status === 503 && attempt === 1) continue;
    if (!res.ok) throw new Error(`${path} failed with status ${res.status}`);
    return res.json();
  }
}

export async function fetchVendors(o: ClientOptions) {
  return VendorsBody.parse(await getJson("/vendors", o)).vendors;
}

export async function fetchOpenInvoices(o: ClientOptions): Promise<Invoice[]> {
  const first = InvoicesBody.parse(await getJson("/invoices?status=open&page=1", o));
  const all = [...first.invoices];
  for (let page = 2; page <= first.pages; page++) {
    all.push(...InvoicesBody.parse(await getJson(`/invoices?status=open&page=${page}`, o)).invoices);
  }
  return all;
}

export async function fetchVendorsAndOpenInvoices(o: ClientOptions) {
  const [vendors, invoices] = await Promise.all([fetchVendors(o), fetchOpenInvoices(o)]);
  return { vendors, invoices };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const key = process.env["AP_API_KEY"];
  if (!key) throw new Error("Set AP_API_KEY in .env (copy .env.example)");
  const start = performance.now();
  const { vendors, invoices } = await fetchVendorsAndOpenInvoices({ baseUrl: "http://localhost:4010", key });
  console.log(`${vendors.length} vendors, ${invoices.length} open invoices, ${Math.round(performance.now() - start)} ms`);
}
