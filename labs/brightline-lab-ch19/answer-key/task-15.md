# Lab 19, Task 15: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What a good run shows.** The pull request's checks run on its own database branch, `pr-<number>`, copied from `staging`. The Neon Console shows that branch while the pull request is open, and not after it closes.

Your prediction: `main` holds production data, which must never be copied into a test. `dev` already has your new migrations, so a copy of it would apply none of them. `staging` holds sample companies and only merged migrations, so the pull request's migrations really run on the copy.

**Compare with** `answer-key/files/.github/workflows/ci.yml`, `answer-key/files/.github/workflows/ci-cleanup.yml`.

**Not yet run online by the authors.** If your run differs, your run is the evidence: write what you saw in `ports/ch19.md`.
