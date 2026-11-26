# Lab 20b files

These files go with Lab 20b of The AI Agent Factory: Cedar Ridge's review workspace, a full interactive app. The lab is optional.

- `brightline-ap/` is the repository at the end of Lab 20, with no git history: both connectors with their open-invoices screen, the page-only tool `next_invoice_page`, the screen matrix (`npm run matrix:screen`), Chapter 16's triage skill served over MCP, and Task 6's planted note on vendor V102. Lab 20b adds a second connector to it, on a branch of its own.
- `LAB.md` is a copy of the lab steps.
- `answer-key/` holds what each task should show, and `files/`, the authors' finished files, at the same paths as in the repository on branch `review-app`. Never give it to an agent.
- Each task's answer key is a separate download, linked from the task in `LAB.md`. Open a key in a text editor only, never in the agent.

Today in the lab is Tuesday, March 30, 2027. The people and companies are invented. Every password and key is made on your own computer by `npm run keys` and `npm run db:passwords`, or by you, in the Neon and Cloudflare dashboards.

You need Node.js 22.19 or later, uv 0.11.32 or later, git, `psql` 16 or later, a GitHub account with `gh`, Chrome (the screen matrix draws a page in it), and the coding agents Claude Code, Codex and OpenCode. You also need the free Neon and Cloudflare accounts from Lab 19, and Claude on the web or the desktop app.

## Set up

Do this only if you start from this zip. If you did Lab 20 in your own repository, start at step 2 there.

1. **The repository.** In `brightline-ap/`: `git init -b main`, then commit everything with the message "End of Lab 20". Create your own private repository on GitHub with `gh repo create`, and push.
2. **The branches.** `git switch -c review-app` and push it. Then `git switch -c review-app-work`: every task of this lab is done here, and Task 10 merges it into `review-app`. Nothing of this lab goes into `main`.
3. **The packages.** `npm ci`, then `cd py && uv sync --locked && cd ..`.
4. **The keys.** `npm run keys`. It writes every key this computer needs into files git ignores, and prints none of them.
5. **The database.** Your Neon project's `dev` branch from Lab 19. Put its owner's connection string in `.secrets/db.dev.env` as `DATABASE_URL_OWNER=...`, typed into the file yourself, never into a chat. Then:

   ```text
   npm run db:migrate -- --env dev
   npm run db:passwords -- --env dev
   npm run tenant:load -- --env dev --replace --company org_brightline --folder data
   npm run tenant:load -- --env dev --replace --company org_cedar --folder data-cedar --policies data-cedar/policies
   npm run tenant:load -- --env dev --replace --company org_conformance --folder data-conformance
   ```

   On your own computer without Neon, Postgres 17 with pgvector works the same way. For the embeddings, put `AP_EMBEDDINGS=test` in `.secrets/embeddings.env` to work offline, or use Workers AI, as in Lab 19.
6. **The checks.** `npm test`, `npm run test:servers`, `npm run test:py`, then `npm run matrix:data` and `npm run matrix:screen`. Both matrices must end `0 failed` before Task 0.
7. **Staging.** For Tasks 5 to 7 and 9, the sign-in server and the connectors run online, as at the end of Lab 20: `docs/deploy.md` has the steps, and Lab 20's Task 3 registered Claude's own client, `brightline-claude`.
