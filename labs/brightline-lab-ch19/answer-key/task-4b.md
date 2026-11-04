# Lab 19, Task 4b: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw, as `ap_reader`:**
- 19.2's queries, with Brightline set: 1 row (Hocking Valley Pallets, Net 30). 2 rows (INV-8301 and INV-8309, Midwest Packaging Co.). 8 rows, V001 with 1. Query 3 without its `tenant_id` condition: 8 rows with Brightline set, 9 rows with Cedar Ridge set, V001 with 3.
- Block 1: INV-6201 (412075), INV-6210 (325000), INV-6204 (268800). Then `true` as text and `false` as numbers.
- Block 2: 9 vendors, 20 rows after the join.
- Block 3: 20 and 18. Then open 16 (2132900) and paid 4 (357700).
- Block 4: 0 rows, then PO-3108.
- Block 5, as the loader: 1, `UPDATE 1`, `UPDATE 9`. Afterwards only V004 is on Net 45, as before, because the block is rolled back.
- Block 6, in F1: `23503`, then `42501` (row-level security), then `42501` (must be owner).
- The Modify step: `IS NOT NULL` gives PO-3101 to PO-3107 (7 rows). `LIMIT 5` adds INV-6216 (265000) and INV-8303 (184500).

Your notes should hold at least one wrong prediction, with the reason. A wrong prediction is never a deduction: it is what the task is for.
