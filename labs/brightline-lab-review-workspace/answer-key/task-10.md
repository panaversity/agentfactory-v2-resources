# Lab 20b, Task 10: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository on branch `review-app`. The authors did not open the pull request or ask the two reviewers: this key lists what the checks run and what the reviews should find.

**The pull request** goes from `review-app-work` into `review-app`, which you made from the end of Lab 20 and pushed before Task 0. Claude Code opens it with the template. Then two fresh sessions review it: Codex the TypeScript changes, and Claude Code the Python ones, each against 20.4, 20.5, 19.8 and 18.7.

**The pull request's checks** (`.github/workflows/ci.yml`) run, on both copies where a copy exists: the tests of every server and of the sign-in server, the workspace connector's tests (`npm run test:review`) and the Python ones, a check that `ui/review-workspace.html` is the one built from its source, the conformance suite, the data matrix, Lab 20's screen matrix and the workspace matrix (`npm run matrix:workspace -- --env ci`). Each must end `0 failed`. The sign-in matrix (`npm run matrix`) needs Lab 18's people on a sign-in server on your computer, so you run it there, as in Lab 18, and paste its last line into the pull request. The check `tests-unchanged` must pass too: no existing test file changed. That is why the sign-in server's new tests start it through their own `test/review-harness.ts`.

**What the reviewers should find.**

- **One tool writes, `save_review_note`,** and it needs `review:write`, which an `auditor` never holds. The other four read, in read-only transactions.
- **Every call is one transaction for the token's company,** set for that transaction only, and every query also names the company.
- **The page holds no key, declares no outside address, and shows values as text.**
- **Lab 20's connector shows no change in the diff:** nothing under `servers/ap-ts/`, and none of the AP connector's Python files (`py/brightline_ap/connector.py`, `mcp_server.py`, `db.py`, `verify_token.py`). The workspace imports what it reuses. The sign-in server, the database scripts, `package.json`, `tsconfig.json` and the checks change, and the review says why for each.

**Merge into `review-app` only,** never into the main branch. Chapters 21 to 23 build on main. If the pull request's base is `main` by mistake, change its base to `review-app` before anyone merges.

**Compare with** `answer-key/files/.github/workflows/ci.yml`, `answer-key/files/package.json`, `answer-key/files/tsconfig.json`.
