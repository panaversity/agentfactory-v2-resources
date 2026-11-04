# Lab 19, Task 16: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What a good run shows.** `check:roles` passes on staging. Hyperdrive shows caching disabled. `conformance:staging` and the data matrix both report `0 failed`. The first call after the database sleeps is slower: its time is in `ports/ch19.md`.

Your prediction: the reader's connection string, so the deployed Worker can never connect as a role that skips row-level security.

**Compare with** `answer-key/files/.github/workflows/deploy.yml`, `answer-key/files/docs/deploy.md`, `answer-key/files/servers/ap-ts/wrangler.jsonc`, `answer-key/files/scripts/check-deploy.ts`.

**Not yet run online by the authors.** If your run differs, your run is the evidence: write what you saw in `ports/ch19.md`.
