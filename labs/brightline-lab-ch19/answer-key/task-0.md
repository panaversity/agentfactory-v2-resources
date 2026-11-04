# Lab 19, Task 0: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw.** Every check passes at `lab19-start`: `npm test`, `npm run typecheck`, `npm run test:py`, `npm run check:py`, `npm run test:servers`, `npm run test:auth`, `npm run typecheck:auth`, `npm run conformance` (ending `0 failed`) and `npm run check:deploy`. `git log --oneline` shows one commit, tagged `lab19-start`. `git ls-files .secrets` prints nothing. Your repository on GitHub is `brightline-ap-19`.

At this point the connector still reads Chapter 17's files, so a Cedar Ridge token still gets "No AP data is connected for Cedar Ridge Supply yet." That is right: nothing in this task connects the database.

The Neon project has three branches: the default (`main`, for production), `dev` and `staging`.

**Not yet run online by the authors.** If your run differs, your run is the evidence: write what you saw in `ports/ch19.md`. If `neonctl` needed a flag the prompt did not name, note the command that worked.
