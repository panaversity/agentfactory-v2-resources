# Lab 19, Task 1: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw.** `invoices.terms` is the invoice's own fact, not a copy of the vendor's terms: triage rule 3 compares the two, so removing it would remove what the rule checks. "Never stored": full account numbers, routing numbers, and the company's name, which lives in the sign-in database.

Compare with `answer-key/data-spec.md`, down to its "Roles" section. Its "Documents and retrieval" section is Task 12's, so leave it until then. Your wording will differ. Check that every column has a meaning, says whether it may be empty, and that every table has `tenant_id` in its key.
