# Lab 19, Task 2: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw.** `npm run db:migrate` on `dev`, the first time: `dev: 2 applied, 0 already applied, 2 in all`. The second time: `dev: 0 applied, 2 already applied, 2 in all` (four files after Task 3). An edited migration is refused: `has changed since it ran on dev`.

The Cedar Ridge invoice for vendor V006 is refused with `23503`, by the constraint `invoices_tenant_id_vendor_id_fkey`: the composite foreign key `(tenant_id, vendor_id)` in `0002_tables.sql`.

**Compare with** `answer-key/files/db/migrations/0001_vector.sql`, `answer-key/files/db/migrations/0002_tables.sql`, `answer-key/files/scripts/db-migrate.ts`, `answer-key/files/scripts/lib/db.ts`.
