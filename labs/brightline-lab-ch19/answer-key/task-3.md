# Lab 19, Task 3: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw.** `npm run check:roles -- --env dev` passes, and lists the owner, `neondb_owner`, among the roles that can skip row-level security. `ap_reader` and `ap_loader` are not on that list.

The three counts are 0 now. After Task 4: 25 as the owner (Brightline 8, Cedar Ridge 9, Conformance Test Co. 8), 9 as `ap_reader` with Cedar Ridge set, and 0 with nothing set.

On the authors' local copy the owner has `BYPASSRLS`. If your hosted owner does not, `check:roles` shows it: write it in `ports/ch19.md`. Task 10's deletion proof then counts as the loader, which is as good.

**Compare with** `answer-key/files/db/migrations/0003_roles.sql`, `answer-key/files/db/migrations/0004_row_security.sql`, `answer-key/files/scripts/db-passwords.ts`, `answer-key/files/scripts/check-roles.ts`.
