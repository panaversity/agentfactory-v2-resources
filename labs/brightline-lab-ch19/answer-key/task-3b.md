# Lab 19, Task 3b: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw.** At least six transitive dependencies: the company's name and the AP contact's email (both about the company, so they belong in the sign-in database), the document's title and owner (both about the document), and inside `metadata` the company's name again and the document's title again (`heading`).

Kept on purpose: the embedding (`passage → content → embedding`), guarded by its fingerprint check. `tenant_id` stays as part of every key, which third normal form allows.

The proofs: 0 copies left, `UPDATE 1` for the rename, 3 Cedar Ridge rows as `ap_reader` with Cedar Ridge set, then 0 with nothing set.

Compare with `answer-key/3nf-refactor.sql` and `answer-key/3nf-proof-reader.sql`. Another correct refactor is fine: the test is that no copied column is left, and the three proofs hold.
