# Lab 19, Task 4: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw.** Vendors 8, 9 and 8 (Brightline, Cedar Ridge, Conformance Test Co.). Invoices 15, 20 and 15. Purchase orders 12, 8 and 12. Passages 17, 12 and 17, with Cedar Ridge's `old-email-approvals-2024.md` reported as not loaded. Zero banking rows with more than four digits.

The loader, with Cedar Ridge set, trying to insert a Brightline vendor: `new row violates row-level security policy for table "vendors"`.

Your prediction: zero of Cedar Ridge's rows, because the whole load is one transaction.

**Compare with** `answer-key/files/scripts/tenant-load.ts`, `answer-key/files/scripts/lib/company-files.ts`, `answer-key/files/servers/ap-ts/src/embeddings.ts`.
