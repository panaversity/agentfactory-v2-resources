# Lab 19, Task 10: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw.** The export: tenants 1, tenant_settings 1, vendors 2, vendor_notes 1, vendor_banking 2, invoices 2, purchase_orders 1, policy_documents 1, policy_passages 1, and every row `org_juniper`'s. The delete ends: `Every table now holds 0 rows for org_juniper (counted as the owner).`

If your owner cannot skip row-level security, the script counts as the loader with the company set, and ends `(counted as the loader, with the company set)`. That proof is as good.

**Compare with** `answer-key/files/scripts/tenant-export.ts`, `answer-key/files/scripts/tenant-delete.ts`.
