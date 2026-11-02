// Print Brightline's vendors, fewest days of terms first.
// Run: npm run vendors
import { pathToFileURL } from "node:url";
import { readData, rows } from "./csv.ts";
import { parseTerms, termsDays } from "./due-date.ts";

export function vendorLines(vendorsCsv: string): string[] {
  return rows(vendorsCsv)
    .map(([id = "", name = "", terms = ""]) => ({ id, name, terms: parseTerms(terms) }))
    .sort((a, b) => termsDays(a.terms) - termsDays(b.terms))
    .map((v) => `${v.id}  ${v.name}  (${v.terms})`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  for (const line of vendorLines(readData("vendors.csv"))) console.log(line);
}
