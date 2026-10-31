// Lists Brightline's vendors with their payment terms.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { termsDays } from "./due-date.ts";

export type Vendor = { id: string; name: string; terms: string };

export function parseVendors(csv: string): Vendor[] {
  const lines = csv.trim().split(/\r?\n/).slice(1);
  return lines.map((line) => {
    const [id, name, terms] = line.split(",");
    return { id, name, terms };
  });
}

// Run the listing only when this file is started directly, not when a test imports it.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const csv = readFileSync(new URL("../data/vendors.csv", import.meta.url), "utf8");
  const byDays = parseVendors(csv).sort((a, b) => termsDays(a.terms) - termsDays(b.terms));
  for (const v of byDays) {
    console.log(`${v.id}  ${v.name}  (${v.terms})`);
  }
}
