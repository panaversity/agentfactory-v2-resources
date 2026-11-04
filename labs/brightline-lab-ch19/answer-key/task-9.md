# Lab 19, Task 9: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw, bug by bug:**

| Bug | Failed | Passed |
| --- | --- | --- |
| 1. `vendors` without forced row security | `check:roles`, `matrix:data` (D7) | `check:queries`, unit tests |
| 2. The company set for the whole connection, and a count on a second connection without its company | `matrix:data` (D10), `check:queries`, unit tests (they hung, which counts as a failure) | `check:roles` |
| 2b. The control: only `set_config(..., false)` | `check:queries`, which refuses a company set for the whole connection | everything else, and nothing leaked |
| 3. `vendorIds` without the company parameter | `check:queries` only | `check:roles`, `matrix:data`, unit tests |
| 4. The reader's connection string set to the owner | `check:roles`, `matrix:data` (D1, D2 three times, D3, D6, D7) | `check:queries`, unit tests |
| 5. The composite foreign key dropped | `matrix:data` (D5) only | `check:roles`, `check:queries`, unit tests |
| 6. A `SECURITY DEFINER` function for a "helpful" error | `check:roles`, `matrix:data` (D7, D8 twice), unit tests (one) | `check:queries` |

Your row codes may differ if your agent numbered the matrix differently. What must hold: every bug fails at least one check, and the branches are deleted, never merged. Between bugs, `ci` is reset to `dev` and `db:passwords --env ci` runs again, so bug 4's string does not stay in `.secrets/db.ci.env`.

Compare with `answer-key/expected.md` and `answer-key/files/ports/ch19.md`.
