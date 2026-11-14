# brightline-ap

Scripts the accounts payable (AP) team at Brightline Wholesale Supply runs on invoice exports, in TypeScript (`src/`) and in Python (`py/`).

All names and numbers in this repository are invented for *The AI Agent Factory*.

- `data/` holds the exports. Amounts are in cents. The files have no quoted fields and no commas inside values.
- `scripts/ap-api.ts` is a small server that stands in for the AP system. It runs only on your own computer.
- `AGENTS.md` holds the rules and the commands a coding agent follows here.

This repository needs Node.js 24 or later, which runs TypeScript files directly, and uv for the Python side.
