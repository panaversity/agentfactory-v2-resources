# Lab 19, Task 8: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw.** The first run failed one row: D10 on the Python copy, 108 of 200 answers "The AP database is not reachable right now." Not a leak: the Python copy opened a connection for every call, 200 at once, past the local database's limit of 100. After Codex capped it at ten open connections per copy: `25 rows passed, 0 failed`.

If your first run passes, that is fine too: a hosted database's limit depends on its size.

**Compare with** `answer-key/files/scripts/data-matrix.ts`, `answer-key/files/py/brightline_ap/db.py`.
