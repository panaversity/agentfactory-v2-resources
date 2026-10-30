# brightline-ap

Scripts the accounts payable (AP) team at Brightline Wholesale Supply runs on invoice exports.

All names and numbers in this repository are invented for *The AI Agent Factory*, Chapter 12.

- `data/` holds the exports: `invoices.csv` and `vendors.csv`. Amounts are in cents. The files have no quoted fields and no commas inside values, so a script can split each line on commas. Real exports often do have them, and need a proper CSV parser. Lines may end in Unix or Windows style, so split lines on `\r?\n`.
- `src/` holds the scripts. There is one so far: `list-vendors.ts`.
- `tests/` holds the tests.

Run the tests with `npm test`. Run the vendor list with `npm run vendors`.

This repository needs Node.js 24 or later, which runs TypeScript files directly.
