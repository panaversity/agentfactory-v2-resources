# Lab 19: what each task should show

As seen by the authors on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder,
in a local database shaped like a fresh Neon branch. Your numbers for real embeddings (Task 14) and timings
(Task 16) will differ. Everything else should match.

| Task | Expect |
| --- | --- |
| 0 | Every check passes at `lab19-start`. Cedar Ridge still gets "No AP data is connected for Cedar Ridge Supply yet." |
| 1 | `invoices.terms` is the invoice's own fact (triage rule 3). "Never stored": full account numbers, routing numbers, names |
| 2 | `2 applied, 0 already applied, 2 in all`, then `0 applied, 2 already applied, 2 in all` (four files after Task 3). The V006 invoice: `23503`, `invoices_tenant_id_vendor_id_fkey` |
| 3 | `check:roles ... passed`. Counts after Task 4: the owner 25 (8 + 9 + 8), the reader with Cedar Ridge set 9, with nothing set 0 |
| 3b | Six transitive dependencies at least (name, email, title, owner, and inside `metadata` the name and the title again), plus the embedding kept on purpose, and `tenant_id` kept as part of every key. Proofs: 0 copies, `UPDATE 1`, 3 Cedar Ridge rows, then 0 |
| 4 | Vendors 8, 9, 8. Invoices 15, 20, 15. Purchase orders 12, 8, 12. Passages 17, 12, 17, and Cedar Ridge's 2024 email not loaded. 0 banking rows with more than four digits. The loader's Brightline vendor: `new row violates row-level security policy` |
| 4b | Query 1: 1 row, Hocking Valley Pallets, Net 30. Query 2: 2 rows, INV-8301 and INV-8309, Midwest Packaging Co. Query 3: 8 rows, V001 with 1. Without its `tenant_id` condition: 8 rows with Brightline set, 9 with Cedar Ridge set, V001 with 3. The 19.3 blocks, with Cedar Ridge set: block 1, INV-6201 (412075), INV-6210 (325000), INV-6204 (268800), and text true, numbers false. Block 2, 9 vendors, 20 rows after the join, V001's 3 invoices. Block 3, 20 and 18, then open 16 (2132900) and paid 4 (357700). Block 4, 0 rows, then PO-3108. Block 5, 1, UPDATE 1, UPDATE 9, then 9 on Net 45 inside the block. After it, only V004 is on Net 45, as before. Block 6, 23503, 42501 (row-level security), 42501 (must be owner). Modify: IS NOT NULL gives PO-3101 to PO-3107 (7 rows). LIMIT 5 adds INV-6216 (265000) and INV-8303 (184500) |
| 5, 6 | 46 TypeScript connector tests. Cedar Ridge's `total_count` 16. `check:queries`: 22 statements, once Task 7 adds `db.py` (fewer at Task 6). `conformance`: `81 checks passed, 0 failed`, after Task 7 |
| 7 | 48 Python tests. Pyright strict 0 errors |
| 8 | First run: D10 on Python, 108 of 200 "not reachable". After the cap of ten: `25 rows passed, 0 failed` |
| 9 | See below |
| 10 | Export: tenants 1, tenant_settings 1, vendors 2, vendor_notes 1, vendor_banking 2, invoices 2, purchase_orders 1, policy_documents 1, policy_passages 1. Delete: "Every table now holds 0 rows for org_juniper (counted as the owner)." |
| 12b | Block 7: 0.00, 0.04, 1.00, 2.00. Block 8: purchasing 5 (0.72), purchasing 6 (0.63), approvals 6 (0.42). Block 9: "PO" 0 rows, "blanket" purchasing 7. Block 10: 1.00, then the same two rules at 0.72 and 0.63 for both amounts. Block 11: Limit, Sort, Result (one-time filter on app.tenant_id), Index Scan using policy_passages_pkey. Block 12: Limit, Index Scan using policy_passages_embedding. Block 13: 12 passages, 78 bytes of text, 4,100 bytes of embedding. Block 14: by meaning purchasing 5, 6, approvals 6, by words purchasing 6, hybrid purchasing 6 (0.0325), purchasing 5 (0.0164), approvals 6 (0.0159). With the stand-in model, test-lexicon-v1 |
| 13 | Luis: `data-cedar/policies/purchasing.md` lines 5 and 6 first. Ana: `docs/policies/po-matching.md` line 5. France: abstained. The "$5,000.00" edit: `embedding_matches_content` |
| 14 | Test embedder: 10 of 10, 2 of 2, passed. Whole documents: 7 of 10, FAILED |
| 17 | Luis's PO-3103: `needs_approval` true at 250000. Ana's PO-3103: "No purchase order PO-3103. Purchase orders run from PO-7001 to PO-7012." |

## Task 9: the six planted bugs

| Bug | Failed | Passed |
| --- | --- | --- |
| 1. `vendors` NO FORCE | `check:roles`, `matrix:data` (D7) | `check:queries`, unit tests |
| 2. Session setting, count on a second connection | `matrix:data` (D10), `check:queries`, unit tests (hung) | `check:roles` |
| 3. `vendorIds` without the company parameter | `check:queries` | `check:roles`, `matrix:data`, unit tests |
| 4. Reader string set to the owner | `check:roles`, `matrix:data` (D1, D2 x3, D3, D6, D7) | `check:queries`, unit tests |
| 5. Composite foreign key dropped | `matrix:data` (D5) | `check:roles`, `check:queries`, unit tests |
| 6. `SECURITY DEFINER` helpful error | `check:roles`, `matrix:data` (D7, D8 x2), unit tests (1) | `check:queries` |
