# Lab 19, Task 12b: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw, with the test embedder `test-lexicon-v1`:**
- Block 7: 0.00, 0.04, 1.00, 2.00.
- Block 8: purchasing line 5 (0.72), purchasing line 6 (0.63), approvals line 6 (0.42).
- Block 9: "PO" 0 rows, "blanket" purchasing line 7.
- Block 10: 1.00, then the same two rules at 0.72 and 0.63 for both amounts.
- Block 11: Limit, Sort, Result (a one-time filter on `app.tenant_id`), Index Scan using `policy_passages_pkey`. Once Postgres has gathered statistics on this small table, which it soon does by itself, the bottom line is `Seq Scan on policy_passages`, with both conditions in its `Filter`. It means the same: no vector index, an exact search. Either is right.
- Block 12: Limit, Index Scan using `policy_passages_embedding`.
- Block 13: 12 passages, 78 bytes of text, 4,100 bytes of embedding.
- Block 14: by meaning purchasing 5, 6, approvals 6. By words purchasing 6. Hybrid: purchasing 6 (0.0325), purchasing 5 (0.0164), approvals 6 (0.0159).

Your three questions have no fixed answer. What should show: a code or a name found by words where meaning missed it, and an amount the search cannot compare.
