# Lab 20 files

These files go with Lab 20 of The AI Agent Factory: Cedar Ridge's open-invoices screen.

- `brightline-ap/` is the repository at the end of Lab 19 (tag `ch19`), with no git history, plus two things this lab adds: the rules file Chapter 16's triage skill reads, `plugin/skills/invoice-triage/references/rules.md` (the same text as `docs/policies/ap-triage-rules.md`, with one line in the skill's `SKILL.md` that points to it), and `docs/chapter-20/`, the chapter's concepts and field guide as text for your coding agents.
- `lab-files/v102-test-note.txt` holds Task 6's test note for vendor V102. It is the same note Lab 23 plants.
- `LAB.md` is a copy of the lab steps.
- `answer-key/` holds the authors' finished files, at the same paths as in the repository at the end of the lab. Each task's answer key is a separate download, linked from the task in `LAB.md`. Open a key in a text editor only, never in the agent.

Today in the lab is Tuesday, March 30, 2027. The people and companies are invented. Every password and key is made on your own computer by the steps below, never shipped in the zip.

You need what Lab 19 needed: Node.js 22.19 or later, uv, git, the GitHub CLI (`gh`), and the desktop apps of Claude Code, Codex and OpenCode. You also need a Postgres database with pgvector (a Neon project as in Lab 19, or Postgres on your computer) and Google Chrome, which the screen matrix's row C8 uses to draw the page.

## Set up

If you did Lab 19 in your own repository, you can skip this: copy `plugin/skills/invoice-triage/references/rules.md` and the line in that skill's `SKILL.md` into your repository, keep `lab-files/` beside it, and start at Task 0. Otherwise, in `brightline-ap/`:

1. **Put it under git.** `git init -b main`, `git add -A`, `git commit -m "Start from the end of Chapter 19"`, and `git tag ch19`. `npm run keys` refuses to run outside a git repository, and every matrix needs its keys.
2. **Install and make the keys.** `npm ci`, then `cd py && uv sync --locked && cd ..`, then `npm run keys`.
3. **A database.** Make `.secrets/embeddings.env` with one line, `AP_EMBEDDINGS=test`. Then give the owner's connection string as `DATABASE_URL_OWNER=…` in `.secrets/db.dev.env`: a Neon `dev` branch, as in Lab 19's Task 0 (`docs/chapter-19/F2.md`), or a local Postgres with pgvector, such as `postgresql://owner@127.0.0.1:5432/brightline`.
4. **The tables, the roles and the three companies.** `npm run db:migrate -- --env dev`, then `npm run db:passwords -- --env dev`, then:
   ```text
   npm run tenant:load -- --env dev --replace --company org_brightline --folder data
   npm run tenant:load -- --env dev --replace --company org_cedar --folder data-cedar
   npm run tenant:load -- --env dev --replace --company org_conformance --folder data-conformance
   ```
5. **The sign-in server, and Lab 18's test people.** `npm --workspace @brightline/auth run migrate:local`, then `npm run dev:auth`, and leave it running. In another terminal:
   ```text
   npm run tenant:add -- --env local --company org_brightline --name "Brightline Wholesale Supply" --owner "Ana Morales <ana@brightline.example>" --member "Grace Kim <grace@audit.example>=auditor" --member "Jordan Lee <jordan@brightline.example>=member" --member "Priya Shah <priya@books.example>=member"
   npm run tenant:add -- --env local --company org_cedar --name "Cedar Ridge Supply" --owner "Luis Moreno <luis@cedarridge.example>" --member "Marco Diaz <marco@cedarridge.example>=member" --member "Priya Shah <priya@books.example>=member"
   npm run tenant:add -- --env local --company org_juniper --name "Juniper Trail Outfitters" --owner "Sam Keller <sam@junipertrail.example>"
   npm run tenant:add -- --env local --company org_conformance --name "Conformance Test Co."
   npm run tenant:member -- --env local --company org_cedar --email marco@cedarridge.example --role auditor
   ```
   The passwords go into `.secrets/test-users.local.env`, never printed.
6. **The checks.** `npm test`, `npm run test:servers`, `npm run test:py` and `npm run conformance` all pass. The sign-in matrix, `npm run matrix`, and the data matrix, `npm run matrix:data`, both end `0 failed`.
7. **Staging, for Claude.** Deploy the TypeScript connector to staging as in Lab 19's Task 16, with its sign-in server and database (`docs/chapter-18/F8.md` has the order). The Python connector stays on your computer: Chapter 19 leaves its staging copy answering 503.

**What the authors ran.** Steps 1 to 6, on November 26, 2026 (with the packages copied from an install of the same lock files rather than downloaded again by `npm ci`), on macOS with Postgres 17 and pgvector on the same computer: 4 tests, 46 TypeScript tests and 48 Python tests passed, the conformance suite ended 81 checks passed, 0 failed, the sign-in matrix 12 rows passed, 0 failed, and the data matrix 25 rows passed, 0 failed. Step 7 was not run by the authors. In Task 3 they also checked, on the local sign-in server, that `npm run client:add` accepts Claude's return address, `https://claude.ai/api/mcp/auth_callback`, for the client ID `brightline-claude`, and that a token for the connector is issued to that client.
