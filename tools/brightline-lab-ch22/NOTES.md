# Lab 22 build notes (Chapter 22 session, Gate 2, started 6 Nov 2026 ~12:30 PKT)

Base: labs/brightline-lab-ch21/brightline-ap + answer-key/files (docs/sdk-map.md, ports/ch21.md) at 3232a2b
(branch lab/brightline-lab-ch21, PR resources#186, stacked on #184). Ours: branch lab/brightline-lab-ch22.
His overlay: specs/drafts/chapter22/brightline-lab-ch22.zip (unzipped in the scratchpad lab22pkg/unz).

## Lab 21 end state already has (his LAB22-START-REQUIRES items)
- token:test (Lab 20, route A): `-- --person ana --company org_brightline [--connector ts|py] [--out file]`,
  10-minute tokens, signs in through the staging pages with .secrets/test-users.staging.env. No --minutes,
  no --refresh, no test key in staging's JWKS (Chapter 18's rule; manager's call). check:deploy unchanged.
- tenant:member `--company X --email Y --remove --env staging`: removes and deletes consent + refresh tokens
  (= his member:remove). tenant:remove (Ch18), tenant:delete (Ch19), tenant:add, keys, db:passwords, sign-in,
  matrix, matrix:data, conformance:staging, check:deploy.
- data-juniper/, docs/acceptance-prompts.md, docs/deploy.md (no numbered stages), plugin/ (.claude-plugin only).
- Labs 20/21 tests: test:loop 32 + test:sdk 15 = 47 TS; test:loop:py 22 + test:sdk:py 13 = 35 Py
  (npm test = Lab 19's node --test; test:py = Lab 19's Python tests).

## Page scripts that are NEW (reader-made in a task unless noted)
agent:apply (T2), check:agent-config (T2), session (T3), matrix:sessions (T12), vault:check (T15),
portal:rotate-client-secret (T15): written by the reader's agent. To decide: setup:staging (T0),
member:remove (T12 -> tenant:member --remove), tenant:offboard (T12), data/test-people.csv (T8),
data/companies.csv (T2), apps/portal skeleton (T9/10a/10c), sitting tags (stop rule).

## Decisions (fill in as made)
- D1 token:test: Lab 20's as built (`--person p --company c --out .secrets/x.env`, CONNECTOR_URL + CONNECTOR_TOKEN,
  10 min, real staging sign-in). No --minutes/--refresh, no test key in staging JWKS, check:deploy unchanged.
  lab22-start adds dana and sam to token-test.ts PEOPLE (S5, S6). Tasks 8, 12, 19, 20 reworded.
- D2 member:remove = `npm run tenant:member -- --company org_cedar --email dana@cedarridge.example --remove --env staging`
  (Ch18; deletes consent + refresh tokens). Task 12 adds the vault-archive step to its --remove path.
- D3 tenant:offboard: a Task 12 make step (scripts/tenant-offboard.ts runs Ch18 tenant:remove, Ch19 tenant:delete,
  then archives vaults and pauses schedules), not a lab22-start script.
- D4 setup:staging: no script. Task 0 follows docs/deploy.md step by step (the page's seven steps).
- D5 sitting tags: none (a plain folder carries no tags; no live run). Stop rule: compare with the task's key.
- D6 ID token: Task 9 registers the portal with `openid` and adds "openid" to the sign-in server's scopes, with a
  test that an ID token comes back (a make step, not lab22-start; live-run checklist). One line in 22.10.
- D7 resource on refresh: 22.14 + F4 one line; Task 14 checks the refreshed token's aud = connector address.
- D8 portal tables: only the client registration in servers/auth/. Portal tables (agent_vaults, portal_sessions,
  reports, webhook_events) in a D1 database of the portal's own (brightline-portal-staging, apps/portal/migrations/),
  never the sign-in server's (Ch18: it stores no business data). One line in 22.10. (Not Ch19's DB: no new roles,
  no Hyperdrive, Ch19's row-level security untouched.)
- D9 wrangler secret put: denied to agents (Ch18/19 settings); the reader runs it (Task 9, as Task 10a).
- D10 data/test-people.csv (ana, luis, dana, sam) + data/companies.csv (org_brightline, org_cedar, org_juniper,
  org_conformance). Dana added on staging by Task 12 (tenant:add, member). Sam = Lab 18's Juniper owner.
- D11 planted note: second V102 row in data-cedar/vendor-notes.csv; Task 8 reloads Cedar Ridge on staging.
  WRONG, fixed in D22: vendor_notes' key is (tenant_id, vendor_id), so a second row stops tenant:load.
- D12 AGENTS.md: + "## Hosted agents (Chapter 22)". Settings: ask `ant apply*` (no prefix for "without --dry-run"),
  vault calls, `npm run session*`; .secrets already denied.
- D13 Task 0: git init + tag lab22-start (plain folder); npm ci; cd py && uv sync --locked;
  test:loop + test:sdk (47 TS), test:loop:py + test:sdk:py (35 Py).
- D14 src/rules/cites.ts; src/sdk/policy.ts re-exports citesPolicyLine from it.
- D15 docs/chapter-22/{concepts,field-guide}.md from the book's pages.
- D16 apps/portal/ skeleton workspace (wrangler.toml staging+matrix, routes 501, sign-in helper PKCE+state,
  security helper off until 10c, README) with offline tests.
- D17 plugin Codex build: no lab made .codex-plugin/plugin.json (Lab 16 said not to). Task 19 makes the bundle's
  manifest from plugin/plugin.json (F7). Reference's three lines follow.
- D18 skills/invoice-triage/: shipped at lab22-start as an unchanged copy of plugin/skills/invoice-triage/ (F0 says
  the zip holds it; six page mentions). The offline check proves the copies are identical.
- D19 Task 16's revoked grant: `tenant:member -- --company org_cedar --email luis@... --role owner --env staging`
  (PATCH with the same role runs forget(): consents + refresh tokens deleted, membership kept), so Luis can sign in again.
- D20 S5/S6 setup: Dana added with tenant:add (member); Juniper Trail added back with Sam Keller as owner, then offboarded.
- D21 the portal reaches the sign-in server through a service binding (AUTH), as the connector does; client_secret_post
  for the code exchange, as the vault's refresh block (F4).
- Tests on the built folder (6 Nov): typecheck, typecheck:sdk, typecheck:py, typecheck:sdk:py, typecheck:portal clean;
  test:loop 32, test:sdk 15, test:loop:py 22, test:sdk:py 13, test:portal 20, npm test 4, test:auth 28,
  test:hello-auth 7, check:plugin ok. Not run: Lab 19's database tests (no Postgres running; one Cedar note row added).

## After the fresh lab reader (6 Nov 2026, Gate 3's lab side)
- D22 the planted note is ONE V102 row: V102's own note, then his text, then S7's payload
  `<img src=x onerror=alert(1)>` (one note per vendor). Proven on a local Postgres 17 + pgvector: migrations,
  db:passwords, tenant:load for org_brightline (data), org_cedar (data-cedar), org_conformance; check:roles,
  check:queries, npm test 4, test:py 83, test:servers 46, test:auth 28, test:hello-auth 7, matrix:data 25,
  eval:retrieval, check:deploy 25 pass. A second V102 row: "Key (org_cedar, V102) already exists".
  conformance: 80 of 81; A4 lists 16 open invoices in one copy and 13 in the other, the same with Lab 21's own
  notes, so it is Lab 20's (data-conformance/ keeps 13 while data/ has 16): reported, not fixed here.
- D23 Task 0: step 4 follows docs/chapter-18/F8.md steps 1 to 10 (tenant:add for Brightline, Cedar Ridge and
  Conformance Test Co.; client:ci), as Lab 19's Task 16. By hand first names neon.env, embeddings.env and
  cloudflare-token (Chapter 19's F2 and F4, Chapter 18's F8); a Lab 19 reader who reuses copies their .secrets/.
  Step 7 sets the repository's secrets and variable from docs/deploy.md (ci.yml needs NEON_*). Step 6 writes four
  addresses (brightline-portal-staging and brightline-portal-matrix).
- D24 the reader runs every wrangler secret put, including --env matrix (Task 12b) and the webhook signing secret
  (Task 17): AGENTS.md, the portal README and wrangler.jsonc say "pasting its value at the prompt".
- D25 portal skeleton: POST /hooks/claude (Task 17, F5); stream, confirmation and interrupt name Task 10c;
  wrangler.jsonc: the matrix copy is Task 12b's, production is an extension (Task 21, not run), and env.matrix
  gets the same D1 database as staging (comment for Task 9).
- D26 data/companies.csv gains short_name (Brightline, Cedar Ridge, Juniper Trail): Task 2's check must catch
  bug 4's "You work for Brightline". data/test-people.csv's first column is `person` (token:test's --person),
  not F4's person_id; its notes say who is added when.
- D27 the stop rule (D5): "compare with the key, carry on once they match" could never be met (a key repeats What
  good looks like). Now: record it and do not build on it. A way forward past a platform failure is the
  editor-in-chief's question (his end-of-sitting tags cannot ship in a plain folder).
- D28 Task 12's tenant:offboard also pauses every schedule that uses an archived vault (S6's rule, as D3 said).
- D29 keys: the four stop-rule paragraphs, Task 0's table, 10a's check, 5 and 14 (carried), 12b's bug 7
  ("in the session's first message", as expected.md); answer-key/README: the task keys are not in the zip.
- D30 the zip README says uv 0.11.32, as LAB.md.
