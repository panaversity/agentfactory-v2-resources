# Lab 20b, Task 1: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository on branch `review-app`. The authors ran every local step on November 26, 2026, on Postgres 17.7 with pgvector 0.8.2, Node 24.18 and the MCP Python code library 2.3.0, with test tokens.

**What the authors saw.** `npm run db:migrate -- --env dev`: `applied 0005_review_notes.sql`, then `dev: 1 applied, 4 already applied, 5 in all`. `npm run db:passwords -- --env dev`: `dev: loader, reader, review_writer can log in.` The connection strings went to `.secrets/db.dev.env`, never printed.

As `review_writer`:

| Tried | Answer |
| --- | --- |
| Who am I, and can I skip row-level security? | `review_writer`, no bypass right |
| With no company set: rows in `review_notes`, rows in `invoices` | 0 and 0 |
| With Cedar Ridge set: Cedar Ridge's invoices | 20 (16 open, 4 paid), read through `ap_reader`'s policies |
| With Cedar Ridge set: insert a note for Brightline's company | Refused, `42501` new row violates row-level security policy for table "review_notes" |
| With Cedar Ridge set: insert a note on INV-8301 for Cedar Ridge | Refused, `23503`: the composite foreign key `(tenant_id, invoice_number)` finds no such Cedar Ridge invoice |
| With Cedar Ridge set: change an invoice | Refused, `42501` permission denied for table invoices |

`npm run check:roles -- --env dev`: `check:roles on dev: passed. 3 roles, 10 tables, none can skip row-level security.`

**What the migration holds.** The company is in the key, `(tenant_id, invoice_number)`. Row-level security is forced. Three policies: `ap_reader` may read, `review_writer` may read, insert and update its company's notes, and `ap_loader` may delete them when a company is deleted or reloaded. `review_writer` is a member of `ap_reader`, so it reads the AP tables through the same policies as the AP connector, and it was given no write right on any AP table. Each note also keeps who saved it (`saved_by`, the token's person) and their name (`saved_by_name`).

**Four scripts learn the new table**, so nothing else breaks: `scripts/lib/db.ts` (the company tables, and the new connection string), `scripts/db-passwords.ts` (the new role's password), `scripts/check-roles.ts` (the new role is checked like the other two), and `scripts/tenant-load.ts` (`--replace` deletes a company's notes before its invoices). The data matrix's row D1 now counts 10 tables, and it still ends `25 rows passed, 0 failed`.

**Compare with** `answer-key/files/db/migrations/0005_review_notes.sql`, `answer-key/files/scripts/lib/db.ts`, `answer-key/files/scripts/db-passwords.ts`, `answer-key/files/scripts/check-roles.ts`, `answer-key/files/scripts/tenant-load.ts`.
