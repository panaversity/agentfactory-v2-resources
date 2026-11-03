# brightline-ap

Scripts the accounts payable (AP) team at Brightline Wholesale Supply runs on invoice exports.

All names and numbers in this folder are invented for *The AI Agent Factory*, Chapter 12.

- `data/` holds the exports: `invoices.csv` and `vendors.csv`. Amounts are in cents.
- `src/` holds the scripts. There is one so far: `list-vendors.ts`.
- `tests/` holds the tests.
- `opencode.jsonc` holds safety settings for OpenCode. Other tools ignore it.

Run the tests with `npm test`. Run the vendor list with `npm run vendors`.

This folder needs Node.js 24 or later, which runs TypeScript files directly.
