# Lab 19, Task 6: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw.** The TypeScript connector tests pass, Task 5's included: 46 by the end of Task 7. Cedar Ridge's `total_count` is 16. `npm run check:queries` passes on `db.ts`, and counts 22 statements once Task 7 adds `db.py`. `npm run conformance` fails only where the two connectors now differ, because the Python one changes in Task 7, which brings it to `81 checks passed, 0 failed`. `check:deploy` lists the Hyperdrive id as a placeholder still to fill.

Asked where a company id reaches SQL, the agent should point only to `db.ts`, always as a parameter.

**Compare with** `answer-key/files/servers/ap-ts/src/db.ts`, `answer-key/files/servers/ap-ts/src/server.ts`, `answer-key/files/servers/ap-ts/src/worker.ts`, `answer-key/files/servers/ap-ts/wrangler.jsonc`, `answer-key/files/scripts/check-queries.ts`.
