// Copy only the files the connector may read into assets/, which ships with the Worker.
// Nothing else from the repository is ever deployed.
import { cpSync, mkdirSync, rmSync } from "node:fs";
const csv = ["vendors.csv", "vendor-notes.csv", "vendor-banking.csv", "invoices.csv", "purchase-orders.csv"];
const files = [
  // Each company's data folder (AP_DATA_TENANTS in wrangler.jsonc): Brightline's, and Conformance Test Co.'s test copy.
  ...csv.map((f) => `data/${f}`), ...csv.map((f) => `data-conformance/${f}`),
  "docs/policies/ap-triage-rules.md", "docs/policies/po-matching.md", "docs/policies/vendor-onboarding.md",
];
rmSync("assets", { recursive: true, force: true });
for (const f of files) { mkdirSync(`assets/${f.split("/").slice(0, -1).join("/")}`, { recursive: true }); cpSync(`../../${f}`, `assets/${f}`); }
console.log(`copied ${files.length} files to assets/`);
