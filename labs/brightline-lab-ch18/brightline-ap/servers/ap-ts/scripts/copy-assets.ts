// Copy only the files the connector may read into assets/, which ships with the Worker.
// Nothing else from the repository is ever deployed.
import { cpSync, mkdirSync, rmSync } from "node:fs";
const files = [
  "data/vendors.csv", "data/vendor-notes.csv", "data/vendor-banking.csv", "data/invoices.csv", "data/purchase-orders.csv",
  "docs/policies/ap-triage-rules.md", "docs/policies/po-matching.md", "docs/policies/vendor-onboarding.md",
];
rmSync("assets", { recursive: true, force: true });
for (const f of files) { mkdirSync(`assets/${f.split("/").slice(0, -1).join("/")}`, { recursive: true }); cpSync(`../../${f}`, `assets/${f}`); }
console.log(`copied ${files.length} files to assets/`);
