# Lab 18: signing in to the Brightline connector

Chapter 18 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 18: signing in to the Brightline connector](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/lab/), so you can do the lab without the book.

*Time: about 9 hours, in five sittings. Core path, every task not marked "extension" (Task 20 included, Task 19 not), about 7 hours 45 minutes. Lab files: `brightline-lab-ch18.zip`. The same steps are in `LAB.md` inside the zip, and the field guide's sections are in `brightline-ap/docs/chapter-18/`.*

## Before you start

**You need no earlier lab.** You do not need Lab 17, its repository, its deployed Workers, its Cloudflare account, its GitHub secrets or its keys. The zip holds everything. Every idea from an earlier chapter that a task uses is explained where it is used, or in field guide [F0](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f0-keys-passwords-and-the-connector-you-start-with), "Ideas from earlier chapters this lab uses". If you did Lab 17, still start from this zip, so your expected answers match.

**Core and extension.** Tasks marked extension are optional. The core path, every other task, takes about 7 hours 45 minutes.

**What you need.**

- A computer with macOS, Windows or Linux, and a terminal.
- **Node.js 22.19 or later** (24 recommended), **uv 0.11.32 or later**, git, a GitHub account and `gh`.
- **Claude Code, Codex and OpenCode version 2,** in their desktop apps, with their command-line tools (`claude`, `codex` and `opencode`) for the sign-in steps in Tasks 14, 15 and 18. You can do the whole lab with one of them: send every prompt to the agent you have. Task 13 uses Claude Code. With another agent, use its own sign-in steps from [F6](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f6-codex) or [F7](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f7-opencode-version-2).
- A web browser. You sign in through it many times.
- **A Cloudflare account on the free plan, for Sitting 5 only.** [F8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f8-deploying-the-sign-in-server) shows how to make one.

**The lab files.** Download [brightline-lab-ch18.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18.zip) and unzip it. It contains:

- `brightline-ap/`, a plain folder with no git history (Task 0 starts it). It holds the Chapter 17 connector in TypeScript and Python, still using the shared key. The TypeScript connector has moved to wrangler 4.156.1, the same version the sign-in server uses. The connector comes with its tests, conformance suite, deploy workflow, `docs/connector-spec.md`, `docs/acceptance-prompts.md`, `docs/deploy.md`, and Brightline's data and policies. Its `README.md` explains the repository from zero.
- `servers/hello-auth/`, inside it: a finished practice sign-in, with a small sign-in server and a one-tool practice connector behind it, for Task 1.
- `servers/auth/`, inside it, holding only a `.dev.vars.example`, which `npm run keys` uses. Task 2 fills in the rest.
- `scripts/make-keys.ts`, already updated for this chapter ([F0](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f0-keys-passwords-and-the-connector-you-start-with)).
- `LAB.md`, these steps.
- `answer-key/`, the authors' finished files. Never give it to an agent.

`LAB.md` and `answer-key/` sit beside `brightline-ap/`, not inside it. So no agent working in the repository can read the answer key, and Task 0 does not upload it.

Each task links its own answer key as a separate download. Open a key in a text editor, never in the agent. An agent that can read the answers is not tested by them.

**You direct, the agents build.** The coding agents write every file and run every command: code, tests, settings, database changes, scripts, every query, keys and secrets, deploys, merges and tags. You play Ana Morales, Brightline's AP analyst, when an agent asks about the rules. You make predictions, read plans, commands, changes and results, and approve or send work back.

**You do by hand only what proves who you are:**

- Making accounts.
- Signing in to `gh` and Cloudflare.
- Signing in and approving consent in your browser as a test user.
- Typing a test user's password into a sign-in page ([F0](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f0-keys-passwords-and-the-connector-you-start-with)).
- Creating the Cloudflare deploy token.
- Deciding when to merge and when to deploy.

**No key, password or token ever passes through a chat.** Agents make every secret with `npm run keys`, into files git ignores, and print none. You type a test user's password only into the sign-in page in your browser. When an agent shows you a token, it shows the decoded claims only. Stop any agent that prints a secret, and make new keys.

**Your agents can read this chapter.** The zip's `docs/chapter-18/` folder holds the concepts and the field guide as text files. So when a prompt says "Read [18.11](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/one-order-slip-per-request/)", the agent opens `docs/chapter-18/18.11.md`. There is one file per concept (`18.1.md` to `18.17.md`), one per field guide section (`F0.md` to `F10.md`), `overview.md`, and an index, `README.md`. Each figure appears as one line describing it.

**One browser window per test person.** A browser stays signed in to the sign-in server after you sign in. Before you sign in as a different test person, sign out on the sign-in server's page, or use a new private browser window. Otherwise you are silently signed in as the previous person.

**Every task follows the same five steps.**

1. A **fresh session**, starting with "Read `NOTES.md` and `ports/ch18.md`." (Leave out either one that does not exist yet.)
2. *Plan* mode, with the task's prompt as the brief. Read the plan and correct it.
3. *Manual* mode, so the agent asks before every command and change. For each one, check three things: which file or folder, which environment (your computer, staging or production), and that no secret appears in it.
4. Accept only on **evidence**: each task's "**What good looks like**".
5. End with a commit of the task's work, and **one line in `ports/ch18.md`**: what the task proved, and with which agent.

Each task starts with a **Predict** line. Write your answer in `NOTES.md` before you send the prompt, and compare after.

**You will not understand every line of every change, and that is expected.** For each task, "What good looks like" names the few things you should check. If those are right and the checks pass, approve. If something looks wrong, say what in your own words, and let the agent fix it.

**The people in this lab.** All invented, like the companies.

| Person | Company | Role |
| --- | --- | --- |
| Ana Morales | Brightline | `owner` |
| Grace Kim | Brightline | `auditor` (an outside auditor) |
| Jordan Lee | Brightline | `member` (a contractor, removed in Task 11) |
| Luis Moreno | Cedar Ridge Supply | `owner` |
| Marco Diaz | Cedar Ridge Supply | `member` (becomes an `auditor` in Task 11) |
| Priya Shah | Both | `member` of each (an outside bookkeeper) |
| Sam Keller | Juniper Trail Outfitters | `owner` (a trial company, offboarded in Task 11) |

A third company, Juniper Trail Outfitters, is a trial that is offboarded in Task 11. A fourth, **Conformance Test Co.**, exists only for automated checks ([F8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f8-deploying-the-sign-in-server)). Only Brightline, and the test-only Conformance Test Co., have data in this chapter, so every other company gets `No AP data is connected for <company> yet.`

**The date in this lab.** Monday, March 22, 2027, a week after Lab 17, whatever day you do it.

![The shape of the lab: five sittings. Sitting 1, sign-in from zero and the sign-in server: set up from the zip, read a sign-in, meet a database, the sign-in contract, tests first, build the sign-in server. Sitting 2, the connector behind tokens: protect the TypeScript connector, the Python connector. Sitting 3, many companies: add the companies, one order slip per request, what else carries the company, the seven rules in Python, the sign-in matrix, change and leave, review. Sitting 4, real sign-ins: Claude Code, Codex and OpenCode each sign in, step-up, into the plugin and the hosts. Sitting 5, deploy: staging, production by the workflow, ship it. Below, the agents at each sitting: Claude Code for the first, Claude Code and Codex for the second, all three for the third and fourth, Claude Code and OpenCode for the fifth.](images/chapter-18-lab.png)

*Figure 18.20. Five sittings, three coding agents, two customer companies.*

---

## Sitting 1: sign-in from zero, and the sign-in server (about 2 hours 35 minutes)

Read Concepts [18.1](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/who-is-calling/) to [18.8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/tables-rows-and-relationships/) and field guides [F0](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f0-keys-passwords-and-the-connector-you-start-with) to [F3](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f3-better-auth-from-zero) first. Read [18.9](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/what-a-tenant-is/) to [18.12](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/what-else-carries-the-company/) before Task 3.

### Task 0. Set up from the zip (20 minutes, Claude Code)

**Goal:** the repository working on your computer and on your GitHub, from the zip alone.

**Predict:** how many of the checks will pass before you change anything?

**By you:** first, in your own terminal, `gh auth login`, then `gh auth status`. Never sign `gh` in through a chat.

Open `brightline-ap/` in Claude Code and send:

> Set up this repository from scratch. Put this folder under git, with a main branch. Make a first commit of everything here with the message "Start from the end of Chapter 17", and tag that commit `lab18-start`. If git has no name and email yet, set them for this project only. Then install with `npm ci`, and `uv sync` in `py/`. Then run every check: `npm test`, `npm run test:servers`, `npm run typecheck`, `uv run pyright` and `uv run pytest` in `py/`, `npm run check:plugin` and `npm run conformance`. Give me a table with one row per check, its result, and how many tests it ran. Then run `npm run keys`, which makes every local secret into files git ignores and prints only file names. Never read or print those files. Then create a private GitHub repository with `gh repo create brightline-ap --private --source . --push`, and push the tags. Finally run `git ls-files | grep -E '\.dev\.vars$|\.secrets/'` and show me what it prints.

While it runs, read [F0](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f0-keys-passwords-and-the-connector-you-start-with)'s "The connector you start with".

**What good looks like:** `git log --oneline` shows one commit, tagged `lab18-start`. Every row in the table says passed (the conformance row ends `0 failed`). `npm run keys` lists file names and no values. The last command prints nothing at all, which means no secret file is tracked by git. Your repository appears on GitHub.

**Check it now.** Download [Task 0's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-0.md).

### Task 1. Read a sign-in (25 minutes, Claude Code)

**Goal:** see [18.2](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/sign-in-in-one-picture/)'s eight steps for real, on the practice sign-in, before you build anything.

**Predict:** what status code will a request with no token get, and what will the reply point to?

> From the repository's top folder, start the practice sign-in in `servers/hello-auth/` with `npm run hello-auth` in the background. It runs a small sign-in server on `127.0.0.1:8739` and a one-tool practice connector on `127.0.0.1:8736`. Then: 1. Call the practice connector's `/mcp` with `curl`, with no token, and show me the status and the response headers. 2. Fetch the document named in `resource_metadata`, and show it. 3. Fetch the sign-in server's document from the issuer it names, and show it. Change no file.

**What good looks like:** compare with the values below ([F4](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f4-the-sign-in-in-detail) has the full messages, if you want them). The practice server uses its own ports, 8736 and 8739, and its own scope, `hello:read`, where [F4](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f4-the-sign-in-in-detail) shows the real lab's 8717, 8719 and `ap:read`. Everything else should match:

- Status `401`, and a `WWW-Authenticate` header that holds `resource_metadata="http://127.0.0.1:8736/.well-known/oauth-protected-resource/mcp"`.
- The connector's document has `"authorization_servers": ["http://127.0.0.1:8739/api/auth"]`.
- The sign-in server's document has `"issuer": "http://127.0.0.1:8739/api/auth"`, a `jwks_uri`, `"code_challenge_methods_supported": ["S256"]` and `"client_id_metadata_document_supported": true`.

(`WWW-Authenticate` is the header that carries [18.3](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/finding-the-door/)'s link.)

Copy those values into `NOTES.md`, and next to each write which step of [18.2](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/sign-in-in-one-picture/) or which part of [18.3](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/finding-the-door/) it belongs to.

Then sign in once, through the MCP Inspector, a small web page for calling an MCP server by hand.

**By you:** leave the practice sign-in running. Open a second terminal in the repository's top folder and start the Inspector yourself:

```bash
npx @modelcontextprotocol/inspector --config servers/hello-auth/inspector.json
```

The Inspector opens its page in your browser by itself. If it does not, copy the address it prints in your own terminal and open it. Never paste that address into the chat: it ends with the Inspector's own session token. Turn on the switch beside `hello-auth`. The Inspector changes between versions, and an older one has a *Connect* button instead. If it asks for a client ID, type `hello-inspector`. The tab goes to the practice sign-in page. Sign in as `hello@example.test` with the practice password `practice-only-password`. It works only in this practice server, which runs only on your computer and forgets everything when it stops. So it is the one password the repository holds on purpose. Pick the company *Practice Co.* and choose *Allow*. The tab returns to the Inspector, which now says *Connected*. Open *Tools*, choose *What time is it* (`what_time`), and choose *Execute Tool*. The result shows the time and `org_practice`. Then send:

> The practice sign-in server keeps the decoded claims of the last token it issued, and only the claims, at `http://127.0.0.1:8739/practice/last-claims`. This route exists only in the practice server. Fetch it and show me the JSON. Never ask the Inspector for the token itself.

**What good looks like:** the JSON has `iss` (the practice sign-in server), `aud` (`http://127.0.0.1:8736/mcp`) and `sub`. It also has `exp` (a number about 600 more than `iat`, so 10 minutes), `scope` and `tenant`. In `NOTES.md`, write one sentence for each saying what it is for ([18.6](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/a-token-made-for-one-door/)).

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-1.md).

### Task 2. Meet a database (30 minutes, Claude Code)

**Goal:** read the sign-in server's tables before anything is built on them.

**Predict:** in the `member` table, how many columns will be foreign keys, and which tables will they point to?

> Fill in `servers/auth/` (the zip holds only its `.dev.vars.example`) with only enough to hold a database, and add `servers/auth` to the root `workspaces`. Give it a `package.json` named `@brightline/auth` with `better-auth` pinned to exactly 1.7.15 and `wrangler` 4.156.1. Give it a `wrangler.jsonc` with `main`, `compatibility_flags: ["nodejs_compat"]`, and one D1 database binding `DB`, database name `brightline-auth`, `migrations_dir` `migrations`, and a placeholder `database_id` for now. Write a minimal `src/auth.ts` with email and password, and the `jwt`, `organization`, `mcp` and `cimd` plugins at their defaults, with `mcp`'s `resource` set to `http://127.0.0.1:8717/mcp`. Better Auth's command-line tool cannot read a D1 binding. So also write `src/auth.cli.ts`, used only by that tool, which builds the same auth instance on an empty in-memory `node:sqlite` database. Run `npx auth@1.7.15 generate --config src/auth.cli.ts --yes --output <file>` to write the SQL that creates the tables. Then run `wrangler d1 migrations create brightline-auth better_auth` and paste the SQL into the new file, `0001_better_auth.sql`. Apply it to the local database only, with `--local`. Then list every table and its columns, read-only, as a short table. In the column list, mark which columns are primary keys and which are foreign keys. Show me the migration file's first 40 lines and the list.

**What good looks like:** the list includes `user`, `account`, `session`, `organization` and `member`. It also has a few tables for apps, consent records, refresh tokens and signing keys. `member` has `userId`, `organizationId` and `role`. There will be more columns than [18.8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/tables-rows-and-relationships/) shows, such as dates. That is normal. The migration file is a list of CREATE TABLE commands. Each names a table and its columns, says which column is the primary key, and marks the columns that point at another table. Every command said `--local`.

Then ask, one at a time, and read each query before you approve it:

> Write a file `scratch/reading-rows.sql` that inserts test rows into the local database only. Add the companies Brightline (id `org_brightline`) and Cedar Ridge Supply (id `org_cedar`). Add the people Ana (id `u_ana`) in Brightline as owner, Luis (id `u_luis`) in Cedar Ridge as owner, and Priya (id `u_priya`) in both as member. Run it with `wrangler d1 execute brightline-auth --local --file scratch/reading-rows.sql`. Then, read-only, one at a time: show Cedar Ridge's name by its id. Show which companies Priya belongs to, with names and roles. Show how many members each company has. For each, show me the query, its rows, and explain the query line by line in simple words.

Adding rows is a fourth shape of query, `INSERT`. You only need to see that each line adds one row with the values you asked for.

**What good looks like:** the three answers are the ones in [18.8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/tables-rows-and-relationships/). The first is Cedar Ridge Supply. The second is two rows for Priya, one per company, each `member`. The third is Brightline 2, Cedar Ridge Supply 2. The queries have the three shapes in [18.8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/tables-rows-and-relationships/). The real tables need more columns than [18.8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/tables-rows-and-relationships/) shows. So the inserts also fill `user.emailVerified`, `createdAt` and `updatedAt`, `organization.slug` (which must be unique) and `createdAt`, and `member.createdAt`. If the first try fails on one of these, the agent adds it. That is normal.

Then:

> Delete `scratch/`, reset the local database (this deletes the copy in the `.wrangler/` folder on my computer), and apply `0001` again. Commit `servers/auth/`.

**What good looks like:** you can point to the primary key and the two foreign keys in `member`. You can also say in simple words what each query did. Your prediction is right or corrected in `NOTES.md`.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-2.md).

### Task 3. The sign-in contract (25 minutes, Claude Code)

**Goal:** `docs/auth-spec.md`, the contract for sign-in, as Chapter 17's `connector-spec.md` was the contract for tools.

**Predict:** which of the four tools will the `auditor` role not be able to use?

> Interview me as Ana Morales, Brightline's AP analyst, one question at a time, until you can write `docs/auth-spec.md`. Read `docs/connector-spec.md` and Concepts 18.6, 18.7 and 18.9 to 18.12 first. Cover the tenancy model, the companies, the roles and the scopes each role gets, the scopes each tool needs, and the claims every token carries. Also cover token lifetimes, the company picker and what happens to a removed person. Cover the message for a company with no data too, and the exact wording of every refusal. Write nothing until I say the interview is done.

**Ana's answers.** Answer from this sheet. If the agent asks something it does not cover, answer as Ana would from [18.6](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/a-token-made-for-one-door/) to [18.12](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/what-else-carries-the-company/).

| Question | Ana's answer |
| --- | --- |
| Tenancy model | One shared connector. The company comes only from the token |
| Roles and scopes | `owner`, `admin` and `member`: `ap:read` and `ap:vendors.read`. `auditor`: `ap:read` only |
| Tool scopes | Every call needs `ap:read`, and `find_vendor` also needs `ap:vendors.read` |
| Token claims | `iss`, `aud`, `sub`, `exp`, `scope`, `tenant` |
| Sign-in token lifetime | 10 minutes |
| Refresh token lifetime | 7 days, replaced on every use, no grace period for reuse |
| Company picker | Shows only companies where the person has a membership. One company per sign-in |
| A removed person | Their next fresh token is refused |
| No data | `No AP data is connected for <company name> yet.` |
| No token, or a bad one | 401: "Sign in to use the Brightline AP connector." |
| Missing scope | 403: `<tool> needs <every scope it needs>. Your role in <company> does not include it.` |
| Refused handle | "This page handle belongs to another person or company. Call again without page." |
| A company named in a tool input | Refused or ignored, never used |
| Too many calls | 429: "Too many calls from you to the Brightline AP connector. Wait a minute and try again." For the company's limit, the company's name in place of "you" |
| The log line | One per tool call: company, person, app, tool, outcome and time taken. Never a token, an input or a result |

**What good looks like:** the first rule in the file is "The company comes only from the token." Every tool has its scopes, every role has its scopes, and every refusal's wording matches the sheet word for word. Then ask the agent to commit `docs/auth-spec.md`.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-3.md).

### Task 4. Tests first (20 minutes, Claude Code)

**Goal:** failing tests for the sign-in server, before it exists.

**Predict:** why should every test fail right now?

> Create a branch `auth`. From `docs/auth-spec.md`, write tests in `servers/auth/test/` that run against the Worker in Cloudflare's local runtime (Wrangler running the Worker on your computer). Test these:
>
> - The sign-in server's document, including `client_id_metadata_document_supported`, `none` in `token_endpoint_auth_methods_supported`, and `authorization_response_iss_parameter_supported`.
> - The public keys.
> - A full sign-in for a test user with PKCE and `resource`, and the token's claims, including `tenant` for the company picked.
> - The company picker lists only the person's memberships.
> - A crafted consent for a company the person does not belong to is refused.
> - A sign-in that names the Python connector's address, `http://127.0.0.1:8718/mcp`, gets a token for that address, and one that names an unknown address is refused.
> - A removed person's request for a fresh token is refused.
> - A reused refresh token is refused.
> - A return address on any port of 127.0.0.1 is accepted for an app whose document lists `http://127.0.0.1/callback`. The same address with `localhost` is refused.
> - A document from a host not on the allowlist, from a non-https address, or behind a "go elsewhere" reply is refused.
> - Offboarding a company, which means taking it out (18.14), stops any new token for it.
>
> Give every refusal test a control, the same request that should succeed, so it cannot pass for the wrong reason.
>
> Notes for the test setup: Better Auth's document plugin refuses document addresses on this computer, so fake `https://chatgpt.com/...` with Miniflare's `outboundService`. Node's `fetch` always sends `Sec-Fetch-Mode: cors`. So Better Auth answers a go-elsewhere reply to test code as `200 {"redirect":true,"url":...}`, and the test browser must treat that as the 302. Miniflare 5 needs `convertV4MiniflareOptions` and `resourcePersistencePath`.
>
> Do not write the server. Run the tests, show me the summary and the first failure message, then commit and tag the commit `auth-tests`.

You need not understand the test names. Check only what "What good looks like" says. (`authorization_response_iss_parameter_supported` is [18.4](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/two-guards-for-the-code/)'s issuer check.)

**What good looks like:** every test fails. Task 2's minimal server has no sign-in pages and no Brightline rules yet. So failures will say things like "not found", or name a value that is missing. That is expected. The warning sign is a test that passes: ask the agent why it passes before anything is built. One exception: the tests for the sign-in server's document and the public keys may pass, because Task 2 already switched on the plugins that serve them. Accept that if the agent says so.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-4.md).

### Task 5. Build the sign-in server (35 minutes, Claude Code)

**Goal:** the sign-in server, on D1, passing every test from Task 4.

**Predict:** on Cloudflare's free plan, each request may use about 10 milliseconds of processor time (field guide [F8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f8-deploying-the-sign-in-server)). Processor time is the time the computer spends actually working, not waiting. Will sign-in, which hashes a password, use more or less?

**In plain words.** The agent builds the sign-in server so that every test from Task 4 passes, without changing a test. A person signs in with a password, picks a company and approves an app. The server then makes tokens that name that company and only the permissions the person's role allows. It checks the membership again at every token. It also adds admin routes, locked by the admin key, for adding companies, people and apps.

> Write the sign-in server in `servers/auth/` so all tests pass, without changing any test. Better Auth 1.7.15 with email and password, `jwt()`, `organization()` with an extra `auditor` role, `mcp()`, and `cimd()` with profile `mcp-2026-07-28`, on the `DB` binding.
>
> In `mcp()`:
>
> - The two connector addresses read from settings, `MCP_RESOURCE` (`http://127.0.0.1:8717/mcp` on your computer) and `MCP_RESOURCE_PY` (`http://127.0.0.1:8718/mcp`). Pass them as `resources` and `clientRegistrationDefaultResources`, so staging and production can each set their own.
> - The scopes and lifetimes from `docs/auth-spec.md` plus `offline_access` (an app gets a refresh token only if it asks for that scope).
> - `refreshTokenReuseInterval: 0`.
> - No dynamic registration.
> - The sign-in page `/sign-in` and the consent page `/consent`.
>
> Make the auth instance on every request, never once for the whole Worker.
>
> If a page sets a `Content-Security-Policy`, its `form-action` must also allow the return addresses: `http://127.0.0.1:*`, `http://localhost:*` and `https:`. A browser applies `form-action` to the go-elsewhere reply that follows a form, so `'self'` alone makes the Allow button do nothing.
>
> Put the picked company into the token: the company picker is the post-login page (`postLogin.page: "/consent"`). It sets the session's active company with the organization plugin's set-active call, which checks membership. `postLogin.consentReferenceId` returns the session's active company after checking membership again. `customAccessTokenClaims` writes `tenant`. At every token, refreshes included, it checks again that the person is still a member and that their role allows every scope asked for. It also checks that the company still takes tokens. If any check fails, it refuses with `invalid_grant`. Better Auth does not re-check membership at refresh by itself, so this check is ours. `customAccessTokenClaims` cannot change `scope`, so apply the role's scopes on the consent page.
>
> If an option does not pass through `mcp()` as expected, stop. Show me what the installed package's own description of its options (its types) says before changing approach.
>
> Write the fetcher for Client ID Metadata Documents for Workers, following field guide F3. Allow https only, with no "go elsewhere" replies (use `redirect: "manual"`, because a Worker's `fetch` rejects `"error"`). Give it 5 seconds, a size limit, and `isMetadataDocumentUrlAllowed` with an allowlist in `src/cimd-allowlist.ts` that starts with `chatgpt.com`.
>
> Add admin routes under `/admin/` that refuse any request without `AUTH_ADMIN_KEY`:
>
> - Create a company with a fixed id.
> - Add a member (answering `person: "created"` or `"existing"`).
> - Change or remove a member (changing or removing also deletes that person's consent records and refresh tokens for the company).
> - Create a pre-registered client with its `oauthClientResource` rows for both connectors.
> - Stop all new tokens for a company by setting a new column, `organization.tokensStoppedAt`, added in a second migration.
>
> Where Better Auth's own server calls need a signed-in session or cannot take a fixed id, write the rows through its database adapter. Serve on 127.0.0.1:8719 with `npm run dev`. Show me the diff of `src/auth.ts`, then the test summary. Then fetch the sign-in server's document at the standard address and tell me which address answered.

When you have checked the first part of "What good looks like" below, send:

> Start a second copy of the sign-in server on a scratch copy of the local database, in its own temporary folder (`--persist-to`). Create one test person there with a short script, only for timing (the real people arrive in Task 8). Sign them in ten times and report the processor time of the sign-in request from Wrangler's output. Then stop that copy, delete the scratch folder, and show me that it is gone.

**What good looks like.**

1. After the first send, in the diff of `src/auth.ts`, find four things: `refreshTokenReuseInterval: 0`. No line that turns on dynamic client registration ([18.5](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/who-is-the-app/)): search for `DynamicClientRegistration` and `UnauthenticatedClientRegistration`, and both must be `false`. An access token lifetime of 10 minutes: search for `accessTokenExpiresIn`, set to `600` or `60 * 10`. And the `auditor` role.
2. Ask the agent to run `git diff auth-tests -- 'servers/auth/test/*.test.ts'`, which must print nothing: the tests were not changed. The test helper file beside them may change while the server is built, but the test files may not.
3. The test summary shows `0 failed`.
4. The address where the sign-in server's document answered is noted in `ports/ch18.md`. The authors' build found it at `/.well-known/oauth-authorization-server/api/auth` ([F3](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f3-better-auth-from-zero), "Its routes").
5. After the second send, the processor time is in `ports/ch18.md`, next to the free plan's 10 ms. Expect "not shown": Wrangler on your computer prints only each request's total time, such as `POST /sign-in 302 Found (172ms)`. Write "not shown", and beside it the authors' own measure: about 80 ms of processor time per sign-in, roughly 8 times the 10 ms ([F8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f8-deploying-the-sign-in-server)). Sitting 5 sees it online.

If the agent stops because an option does not pass through `mcp()`, that is the stop you asked for. Ask it to propose the smallest change that keeps every test unchanged. Then judge only by evidence: accept it if `git diff auth-tests -- 'servers/auth/test/*.test.ts'` prints nothing and the test summary shows `0 failed`. Otherwise send it back with those two outputs.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-5.md).

**You can now:** read a sign-in step by step, read a small database, and run your own sign-in server on your computer, built from tests you wrote first.

---

## Sitting 2: the connector behind tokens (about 1 hour)

Read [18.6](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/a-token-made-for-one-door/), [18.7](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/permission-per-tool/) and [F4](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f4-the-sign-in-in-detail)'s "How the connector does it".

### Task 6. Protect the TypeScript connector (30 minutes, Claude Code)

**Goal:** the shared key gone, the token checked, the company passed to every tool.

**Predict:** what will a request with a token made for another connector get?

**In plain words.** The agent first writes tests that send the TypeScript connector missing and bad tokens, and commits them. Then it replaces Chapter 17's shared key with a check of every token. The check covers its seal, who made it, which connector it is for, when it expires and which company it names. Each tool also checks the token's permissions, and the old key is removed everywhere.

> Read `docs/auth-spec.md` and `servers/ap-ts/src/http.ts`. First, write failing tests in `servers/ap-ts/test/auth.test.ts`, with tokens signed by a test key. Cover no token, an expired token, a wrong audience, a wrong issuer and no tenant claim. Also cover a missing tool scope (403 naming every scope the call needs), and the connector's own document. Commit them.
>
> Then change `src/http.ts`: keep the `Origin` check first. Serve the connector's document with `oauthMetadataResponse` from the official MCP code library (the SDK). Pass the sign-in server's issuer as `oauthMetadata` (only the issuer is used for the connector's document) and `scopesSupported: ["ap:read", "ap:vendors.read"]`. Before that route, answer `/.well-known/oauth-authorization-server` with 404.
>
> Replace the key comparison with the SDK's `requireBearerAuth` with `requiredScopes: ["ap:read"]`. Rebuild every 401 with `bearerAuthChallengeResponse` so it uses the auth-spec wording. Add a token checker in `src/verify-token.ts` written with `jose` 6.2.15, checking the signature, `iss`, `aud` equal to `AP_RESOURCE`, `exp`, and the `tenant` claim. Keep the public keys at module level, and nothing else.
>
> Check each tool's scope with the SDK's `requireScopes`, through `registerTool`'s `scopeChallenge`: every call needs `ap:read`, and `find_vendor` also needs `ap:vendors.read`. Wrap it so the 403 uses the auth-spec wording. Pass the person, app, scopes and company to the tools, locked. Trust `AP_TEST_SIGNING_KEY` only when `AP_TRUST_TEST_ISSUER=1`, and tell a test token by its `kid`, the test key's thumbprint.
>
> Code may not read key files. So have `npm start` and `npm test` in `servers/ap-ts` (from the top folder, `npm run test:servers`) and the root `npm run conformance` pass `.secrets/test-signing.local.env` to the program when it starts, with `--env-file-if-exists`.
>
> On my computer, set `AP_ISSUER=http://127.0.0.1:8719/api/auth` and `AP_RESOURCE=http://127.0.0.1:8717/mcp` in `servers/ap-ts/.dev.vars`. On my computer the connector fetches the public keys straight from `http://127.0.0.1:8719/api/auth/jwks` (the service binding is only for staging and production). With `AP_TRUST_TEST_ISSUER=1` it trusts both the test key and the real local sign-in server.
>
> Remove `AP_MCP_TOKEN` from the code, `worker.ts`, `node.ts`, the root `.dev.vars.example` and the tests. Update every existing connector test to use test tokens without changing what it checks. Show me the test count before and after: it must be the same, plus the new tests.
>
> The 503 rule now covers `AP_ISSUER`, `AP_RESOURCE` and where the public keys come from. A non-loopback `AP_ISSUER` with no `AUTH` binding is not ready, and so is `AP_TRUST_TEST_ISSUER=1` with a non-loopback issuer. Use the `AUTH` binding only for a non-loopback `AP_ISSUER`, because `wrangler dev` creates the binding on my computer too, where no sign-in Worker answers it. Show me the diff of `src/http.ts` and the test summary.

**What good looks like.** Ask the agent two questions and check its answers: "Which check runs first in `src/http.ts`?" (expect: the `Origin` check). "List every value defined outside a function in `src/http.ts` and `src/verify-token.ts`." (expect the public key set and fixed settings only, and nothing about a company or a person). The words `AP_MCP_TOKEN` are gone. The test summary shows the same number of old tests as in Task 0's table, plus the new ones, `0 failed`. The authors' build had 11 old and 15 new: `# tests 26 # pass 26 # fail 0`. Two old tests change what they send but not what they check. One sends another person's token instead of another shared key. The other sends the token instead of the string `test-token` in the telemetry check. That is expected. Ask the agent to run `grep -r AP_MCP_TOKEN servers/ap-ts`, which must print nothing.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-6.md).

### Task 7. The Python connector (30 minutes, Codex)

**Goal:** the same front door in Python, against the same public keys.

**Predict:** if your token checker skipped the audience check, which setting would still stop a token made for another connector? ([F4](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f4-the-sign-in-in-detail) says.)

> Read `docs/auth-spec.md`, `servers/ap-ts/test/auth.test.ts` and `py/brightline_ap/mcp_server.py`. Write the same tests in `py/tests/test_auth.py` first and commit them.
>
> Then replace the key check with a `TokenVerifier` in `py/brightline_ap/verify_token.py`, using PyJWT 2.15.1 with `cryptography`. It checks the signature, `iss`, `aud` exactly (`audience=` with `strict_aud`), `exp` (required, because the SDK accepts a token without it) and `tenant`. It calls `PyJWKClient` with `asyncio.to_thread`. Wire it through the SDK's (`mcp` 2.3.0) `AuthSettings` with `required_scopes=["ap:read"]` and `validate_token_resource=True`, filling `AccessToken.resource` from `aud`. Serve the connector's document with both scopes.
>
> The Python SDK has no per-tool scope check. So write a small gate after the SDK's bearer check that answers 403 `insufficient_scope` exactly as the TypeScript one does. Put an `Origin` check in front of everything, as in TypeScript, because the SDK checks `Origin` only after the token. Pass the company, person and scopes to the tools, which read the checked token from `ctx.request_context.request.scope["user"].access_token`. Have `npm run test:py` pass `.secrets/test-signing.local.env` with `uv run --env-file`, only when the file exists.
>
> On my computer, set `AP_ISSUER=http://127.0.0.1:8719/api/auth` and `AP_RESOURCE=http://127.0.0.1:8718/mcp`, the Python connector's own address, in `servers/ap-py/.dev.vars`. On my computer the connector fetches the public keys straight from `http://127.0.0.1:8719/api/auth/jwks` (the service binding is only for staging and production). With `AP_TRUST_TEST_ISSUER=1` it trusts both the test key and the real local sign-in server.
>
> Remove `AP_MCP_TOKEN` everywhere in `py/` and `servers/ap-py/`. Run pytest and Pyright strict, and show me both summaries.

**What good looks like:** pytest and Pyright both report no failures or errors (the authors' build had `30 passed`, 15 old and 15 new). `validate_token_resource=True` appears in the diff. Ask Codex why it matters, and check its answer against [F4](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f4-the-sign-in-in-detail). A foreign `Origin` with no token gets 403, as in TypeScript.

Each version of the connector has its own address in the sign-in server, 8717 for TypeScript and 8718 for Python. So an AI app can sign in to either. A token made for one is refused by the other.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-7.md).

**You can now:** put both versions of the connector behind sign-in tokens, with the shared key gone and every token checked.

---

## Sitting 3: many companies (about 2 hours 50 minutes)

The heart of the lab. Read [18.9](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/what-a-tenant-is/) to [18.14](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/a-companys-life/) and [F9](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f9-the-multi-tenant-sign-in-checklist) first.

### Task 8. Add the companies (20 minutes, Claude Code)

**Goal:** all four companies, and their people, in the sign-in server, through a script.

**Predict:** how many rows will `member` have when this task is done?

> Start the sign-in server in the background (`npm run dev` in `servers/auth`). Write `scripts/tenant-add.ts` (`npm run tenant:add`). Give each company a fixed short id, the same in every environment: `org_brightline`, `org_cedar`, `org_juniper` and `org_conformance`. Task 5's admin route accepts a fixed id. The script calls the sign-in server's admin routes with `AUTH_ADMIN_KEY`. It gets the key by starting itself again with `node --env-file=.secrets/admin.<env>.env` (`admin.local.env`, `admin.staging.env` or `admin.production.env`), so the key file is only an input to the command. It never prints the key. It creates a company, its first owner and other people with roles, from command-line options, with `--env local|staging|production`. It makes a password only for a new person (the admin route answers `person: "created"` or `"existing"`), appends it to `.secrets/test-users.<env>.env` as a line named after the person's email, such as `TEST_USER_PASSWORD_ANA_BRIGHTLINE_EXAMPLE=`, and prints only names. It refuses to run against production unless I add `--yes-production`.
>
> Then run it to create Brightline (Ana Morales `owner`, Grace Kim `auditor`, Jordan Lee `member`, Priya Shah `member`) and Cedar Ridge Supply (Luis Moreno `owner`, Marco Diaz `member`, Priya Shah `member`). Also create Juniper Trail Outfitters (one `owner`, Sam Keller), and Conformance Test Co. (no people). The emails are `ana@brightline.example`, `grace@audit.example`, `jordan@brightline.example`, `priya@books.example`, `luis@cedarridge.example`, `marco@cedarridge.example` and `sam@junipertrail.example`. Load no business data. Then show me, read-only, the companies with their people's names and roles, and run `git status`.

Then ask: "In the same way, write `scripts/client-add.ts` (`npm run client:add`), which calls the admin route that creates a pre-registered client. Give it `--env` (default `local`), `--name`, `--redirect` (one or more) and `--client-id`, a fixed ID you choose. Use the same ID in every environment, so the repository's host files can name it. It gives the client no secret and prints only its client ID. Write `scripts/tenant-member.ts` and `scripts/tenant-remove.ts` later, in Task 11."

**What good looks like:** four companies. `member` has 8 rows: four for Brightline, three for Cedar Ridge Supply, one for Juniper Trail. Priya appears twice. `git status` lists no file from `.secrets/`.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-8.md).

### Task 9a. One order slip per request, TypeScript (25 minutes, Claude Code)

**Goal:** rules 1 to 3 from [18.11](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/one-order-slip-per-request/), each with a failing test first.

**Predict:** which rule's test must run many times to be trusted, and why?

> Read 18.11 and F9. For each of rules 1 to 3, write a failing test in `servers/ap-ts/test/tenant.test.ts`, commit it, then make it pass.
>
> - Rule 1: one locked request context, written only by the token check.
> - Rule 2: no company or person in module-level variables. Test it with two companies calling one copy 200 times, all at once and also spread over a few milliseconds. That way, one request is still waiting for its data when the next arrives. Choose each request's data by its company now, with `AP_DATA_TENANTS`, a setting that says which company's data lives in which folder. It points Brightline's company id to `data/`, and Conformance Test Co.'s to `data-conformance/`. Create that folder by copying the sample rows from `data/`, and mark it as test data. Cedar Ridge gets the no-data message, so rule 2's test can tell the answers apart.
> - Rule 3: a company in an `X-Tenant` header is ignored, and a `company` input is refused.
>
> When done, give me a table: rule, test name, result, and the commit that added the test.

**What good looks like:** three rows, each `passed`, and each test's commit comes before its fix (ask for `git log --oneline -8`). Then ask: "List every value defined outside a function in `servers/ap-ts/src/`." Expect only the public key set and fixed settings, never a company or a person. Rule 1's "locked" test may pass at once, because Task 6 already locked the slip. Accept it if the agent shows which line from Task 6 makes it pass. Expect the "every tool refuses without a slip" test to fail until each tool starts by reading the slip.

**Check it now.** Download [Task 9a's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-9a.md).

### Task 9b. What else carries the company, TypeScript (25 minutes, Claude Code)

**Goal:** rules 4 to 7 from [18.12](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/what-else-carries-the-company/), each with a failing test first.

**Predict:** what should Cedar Ridge's token get from `list_open_invoices`?

`AP_DATA_TENANTS`, from Task 9a, says which company's data lives in which folder. In this chapter only Brightline and Conformance Test Co. have data.

> Read 18.12 and F9. For each of rules 4 to 7, write a failing test in `servers/ap-ts/test/tenant.test.ts`, commit it, then make it pass.
>
> - Rule 4: the page handle, now version 2, holds company and person, and is refused if either differs, with auth-spec's wording. Chapter 17's handle test expects other words for another person's handle. Changing it is the one exception in this chapter to `AGENTS.md`'s rule "never change an existing test". So stop and ask me first, then change only that assertion's expected wording. Also accept a second handle key, `AP_HANDLE_KEY_PREVIOUS`, for opening only, so the handle key can be replaced safely (F8).
> - Rule 5: a rate limit counted per company, with a smaller one per person inside it. Put it behind a `RateLimiter` interface (one agreed shape for any limiter, so another one can be swapped in). Use Cloudflare's Rate Limiting binding (`ratelimits` in `wrangler.jsonc`, F8) in the Worker and a simple in-memory limiter only in tests. Give in-process test copies no limiter unless a test asks for one. Let `node.ts` take `AP_RATE_LIMIT_COMPANY` and `AP_RATE_LIMIT_PERSON` (600 and 120 a minute unless set), so rule 2's 200 calls are not refused. Refusals use auth-spec's wording, with 429 and `Retry-After: 60`.
> - Rule 6: one log line per tool call, refusals included, with company, person, app, tool, outcome and time taken. Never log the token, an input or a result.
> - Rule 7: a company with no data gets the exact message from `docs/auth-spec.md` from every tool. Set `AP_DATA_TENANTS` in `wrangler.jsonc` too, in both environments. In a Worker where `AP_DATA_TENANTS` is not set, no company has data. There, every tool gives the no-data message, never a 503 and never another company's data.
>
> When done, give me the same table for rules 4 to 7, and show me one log line from a test run.

**What good looks like:** four rows, each `passed`. Rule 7's test may pass at once: accept it if the agent shows the line from Task 9a that makes it pass. The agent stops once to ask about Chapter 17's handle test. Read the old and new wording of that one assertion. It still checks the same thing, that another person's handle is refused, now with the wording the spec requires. Approve that one change now, and no other change to an existing test. The log line you see names a company, a person and an app, and holds no long random string that could be a token. Cedar Ridge's answer is "No AP data is connected for Cedar Ridge Supply yet." If the deploy refuses Cloudflare's Rate Limiting binding (Sitting 5), ask the agent to use the in-memory limiter online for this lab. Record in `ports/ch18.md` that rule 5 is then counted per copy, not across all copies.

**Check it now.** Download [Task 9b's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-9b.md).

### Task 9c. The seven rules in Python (30 minutes, Codex)

**Goal:** the same seven rules in the Python connector.

**Predict:** will the Python version need anything the TypeScript one did not?

> Read 18.11, 18.12, F9 and `servers/ap-ts/test/tenant.test.ts`. Do the same seven rules for the Python connector: tests in `py/tests/test_tenant.py` first, committed, then the code in `py/brightline_ap/`. For rule 5, use the same `RateLimiter` idea, with an in-memory limiter in tests. For rule 4, Chapter 17's Python handle test needs the same one change of wording as in TypeScript. Stop and ask me before you make it, and change nothing else in an existing test. When done, give me the same table: rule, test name, result.

**What good looks like:** seven rows, all `passed`, and the same Cedar Ridge message word for word. For rule 3, TypeScript refuses a `company` input through its strict input schemas, while the Python SDK silently ignores an input no tool has. Either passes, because the company is never taken from the input.

**Check it now.** Download [Task 9c's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-9c.md).

### Task 10. The sign-in matrix (30 minutes, OpenCode)

**Goal:** [18.13](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/proving-the-sign-in-keeps-companies-apart/)'s matrix against both versions, and proof that it catches planted bugs.

**Predict:** the copy with the shared-note bug will fail which check?

**In plain words.** Send 1 asks the agent to add [18.13](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/proving-the-sign-in-keeps-companies-apart/)'s matrix to the conformance suite. Test people sign in with a script, and two extra local sign-in servers play a staging server and a forger. Then every route by which one company might act as another is tried against both versions of the connector. Both must refuse each one in the same way.

Send 1:

> Read 18.13 and `scripts/conformance.ts`. Add the sign-in matrix. Start the local sign-in server on 8719, and a second one on 8729 (its own issuer and keys) to play a staging token. Start a third on 8749 that claims 8719's issuer with its own keys, to play a forged seal from another sign-in server. Give each its own database folder.
>
> Sign test people in with a script that fills in the sign-in and consent pages directly. It gets the passwords by starting itself again with `node --env-file=.secrets/test-users.local.env`, so it never opens the file, and it never prints them. It asks for `offline_access` wherever a row needs a refresh token. For the "removed person" row, have the script create its own throwaway test person. It removes them by calling the sign-in server's admin route for removing a member directly. Never use Jordan, who is removed in Task 11.
>
> Play the "token for another connector" row with the other language's token. Send a token made for the TypeScript connector to the Python copies, and the reverse. Play "a staging token at production" with a token from 8729. The real staging-at-production check runs in Task 19. For the expired row, use the test key to sign a token that expired 10 minutes ago. So start the copies with `AP_TRUST_TEST_ISSUER=1` and the test key, from their `.dev.vars` and `--env-file`. Start the copies with rate limits high enough for the "two companies at once" row.
>
> Check every row of 18.13's table against both TypeScript copies (ports 8717 and 8727) and both Python copies (ports 8718 and 8728, as in Chapter 17). Both versions must give the same status and the same text. The one exception is the company-input row, where TypeScript refuses the input and Python may ignore it. Either passes if the answer is only for the token's own company. Run it and show me the summary.

When send 1 ends `0 failed`, send 2:

> From the `auth` branch, create a branch `planted-header` where the TypeScript connector reads the company from `X-Tenant` when present. Also create a branch `planted-global` where it keeps the company in a module-level variable. It writes the variable when each request arrives, and reads it when the tool reads its data, after a wait. Run the suite on each branch and show me which checks fail. Then switch back to `auth`, record which check failed on each branch in `ports/ch18.md`, commit, then delete both branches without merging.

**What good looks like:** after send 1, on the `auth` branch, `0 failed`, for both versions. On `planted-header`, at least the planted-header row fails. On `planted-global`, the "two companies at once" row fails. If a planted bug fails nothing, the suite has a hole: tell OpenCode which bug it missed and ask it to add a check. This is also the sign-in check [18.14](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/a-companys-life/) asks for before any real sign-in.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-10.md).

### Task 11. Change and leave (20 minutes, Claude Code)

**Goal:** [18.14](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/a-companys-life/)'s week, through scripts, with evidence.

**Predict:** after Marco becomes an `auditor`, which scope will his next token lack?

> Start the sign-in server in the background if it is not running. Write `npm run tenant:member` (change a role, or remove a person) and `npm run tenant:remove` (offboard a company: stop new tokens, delete its consent records and refresh tokens). Both call the admin routes like `tenant:add`, and get the keys and passwords the same way, with `--env-file`. Never change a row by typing SQL.
>
> First, with the matrix's sign-in script, sign Jordan in for Brightline, asking for `offline_access` so she gets a refresh token. Save it in `.secrets/jordan-refresh.local` as one line, `REFRESH_TOKEN=…`, which git ignores. Never print it, and delete the file at the end of this task.
>
> Then, on the local sign-in server, make three changes, and for each show me the `member` rows before and after, read-only. Change Marco's role at Cedar Ridge to `auditor`, remove Jordan from Brightline, and offboard Juniper Trail Outfitters.
>
> Then prove each effect: sign Marco in again and show his new token's scopes. Ask for a fresh token with Jordan's refresh token, passing the file back to the script with `--env-file` (for example `npm run sign-in -- --client <id> --refresh-from .secrets/jordan-refresh.local`), never reading it. Show the reply. Try a new sign-in for Sam Keller at Juniper Trail, and show the reply.

**What good looks like:**

- Marco's `member` row says `auditor`, and his new token's `scope` is `ap:read` only. (Changing Cedar Ridge's only `owner` would leave nobody to manage it, which is why the lab changes Marco.)
- Jordan's `member` row is gone, and the fresh-token request is refused: `invalid_grant`, with `session not found`, because removing her also deleted her refresh token.
- Sam's sign-in is refused: his password is accepted, the company picker offers no company, and a consent sent for Juniper Trail is refused (403). The sign-in server makes no token for Juniper Trail. Offboarding leaves Sam's `member` row in place, and the "after" rows show the company as taking no new tokens.

Write each result in `ports/ch18.md`.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-11.md).

### Task 12. Review (20 minutes, Codex reviews TypeScript, Claude Code reviews Python)

**Predict:** which of the seven rules is the easiest to break by accident in a later change?

To Codex, in a fresh session:

> Review the changes in `servers/ap-ts/` and `servers/auth/` since tag `lab18-start` against `REVIEW.md`, Concepts 18.3 to 18.7, and field guide F9, line by line. List each finding with the file, line and the F9 item it breaks. Change nothing.

Send the same to Claude Code, for `py/`. Fix each finding through the agent that wrote the code, with a failing test first if it is a bug.

**What good looks like:** every finding is fixed, or answered in `NOTES.md` with a reason. A review that finds nothing at all is worth a second look: ask the reviewer to check [F9](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f9-the-multi-tenant-sign-in-checklist)'s "The tenant's source" items again. A good reason names the [F9](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f9-the-multi-tenant-sign-in-checklist) item and says why it does not apply here. The answer key lists the main [F9](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f9-the-multi-tenant-sign-in-checklist) items, with the file where a review should confirm each.

**Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-12.md).

**You can now:** serve many companies from one connector, take the company only from the token, and prove with tests and planted bugs that one company cannot act as another.

---

## Sitting 4: real sign-ins (about 1 hour 30 minutes)

Read the table at the start of [18.17](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/how-todays-tools-realize-it/), and [F5](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f5-claude-code) to [F7](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f7-opencode-version-2). Ask Claude Code to start the sign-in server (`npm run dev` in `servers/auth`) and the TypeScript connector (`npm start` in `servers/ap-ts`, on 8717) in the background. Leave them running for this sitting.

**For each AI app, record whether it asked for `offline_access`,** the scope that gets a refresh token ([F4](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f4-the-sign-in-in-detail), step 7). After each sign-in, ask the agent to show, read-only, the scopes in that app's newest consent record (the `oauthConsent` table). Write "asked" or "did not ask" next to the app's line in `ports/ch18.md`. An app that did not ask gets no refresh token, so its person signs in again every 10 minutes.

### Task 13. Claude Code signs in (20 minutes, Claude Code)

**Predict:** what will Priya's Cedar Ridge chat answer to "Which invoices are open?"

**Why we pre-register.** Brightline's sign-in server accepts app documents only from makers on its approved list, which starts with Codex's maker alone (field guide [F3](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f3-better-auth-from-zero)). So Claude Code's own document would be refused. The recommended way through needs no trust decision: pre-register a client for Claude Code.

> Run `npm run client:add -- --env local --client-id brightline-claude-code --name "Claude Code (lab)" --redirect http://localhost:8790/callback`, which creates a pre-registered client with no secret and prints only its client ID. Then add the connector to this project's `.mcp.json` as `apts`, at `http://127.0.0.1:8717/mcp`. Give it that client ID, callback port 8790, the scopes `ap:read ap:vendors.read` asked for up front, and no headers. Remove any `headersHelper`. Show me the diff.

**By you:** in a new Claude Code session, approve `apts` if Claude Code asks about the project's servers. Then type `/mcp`, choose `apts`, and choose to authenticate. In the browser, sign in as Ana (password from [F0](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f0-keys-passwords-and-the-connector-you-start-with)), pick Brightline, approve. Then ask Claude Code three of the acceptance checks: A1, A5 and A6 ([F0](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f0-keys-passwords-and-the-connector-you-start-with) says what each is).

Then sign in as Priya, once per company, in this order:

1. **By you:** type `/mcp`, choose `apts`, sign out. Sign out on the sign-in server's page too, or use a new private window.
2. **By you:** type `/mcp`, choose `apts`, authenticate, sign in as Priya, pick Brightline. Ask: "Which invoices are open?" Note the answer.
3. Ask Claude Code:

   > Create a second pre-registered client with `npm run client:add -- --env local --client-id brightline-claude-code-cedar --name "Claude Code Cedar (lab)" --redirect http://localhost:8791/callback`, and add `apts-cedar` to `.mcp.json` at the same address with that client ID and callback port 8791. Show me the diff.

   A second client means the sign-in server treats it as a new app, so it always shows the company picker. The first client already holds Priya's Brightline approval, so it may skip the picker.
4. **By you:** in a new session, type `/mcp` and disable `apts` for that session. Then choose `apts-cedar` and authenticate. Sign in as Priya (sign out on the sign-in server's page first, or use a new private window), and pick Cedar Ridge. Ask the same question.

(Optional, later: to try Claude Code's own document instead, remove the client ID, sign in, and note the host the refusal names. Check on [Anthropic's documentation page for Claude Code](https://code.claude.com/docs/en/mcp) that the host is Anthropic's. Then ask Claude Code to add it to `src/cimd-allowlist.ts` in a reviewed change.)

**What good looks like:** A1 finds Hocking Valley Pallets, Net 30, bank ending 2217. A5 says INV-8303 is $900.00 over PO-7003. A6 says INV-8310 has no purchase order and should be held. Priya's Brightline session, through `apts`, lists Brightline invoices. The consent screen for `apts-cedar` shows the company picker, and her Cedar Ridge session gets "No AP data is connected for Cedar Ridge Supply yet." The diff shows `apts-cedar` with its own client ID and callback port 8791. `ports/ch18.md` records that Claude Code used two pre-registered clients.

**Check it now.** Download [Task 13's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-13.md).

### Task 14. Codex signs in (20 minutes, Codex, extension)

**Predict:** will Codex use a Client ID Metadata Document or need pre-registration?

> Change `.codex/config.toml` so `apts` has only its `url`, and remove `bearer_token_env_var`. Show me the diff.

**By you:** sign out on the sign-in server's page first, or use a new private browser window. Then run `codex mcp login apts`, sign in as Luis, pick Cedar Ridge. Ask "Which invoices are open?"

**What good looks like:** "No AP data is connected for Cedar Ridge Supply yet.", because Cedar Ridge has no data in this chapter. The route Codex used is in `ports/ch18.md`. If you created no client for Codex and sign-in worked, the route was its own document. Record that. If the sign-in server refuses Codex's own document, pre-register it as [F6](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f6-codex) shows and record that.

**Check it now.** Download [Task 14's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-14.md).

### Task 15. OpenCode signs in (20 minutes, OpenCode, extension)

**Predict:** OpenCode prefers a configured client ID. Will you need one?

> In `opencode.jsonc`, remove `"oauth": false` and the `headers` from `apts` and from `appy` (the Python connector's entry, not used in this task). OpenCode's own document is not on the approved list, so pre-register it. First read OpenCode's MCP servers page (https://opencode.ai/v2/docs/mcp-servers/) and tell me the return address OpenCode uses. Then run `npm run client:add -- --client-id brightline-opencode --name "OpenCode (lab)" --redirect <that address>` and set `apts`'s `"oauth": { "client_id": "brightline-opencode", "scope": "ap:read ap:vendors.read", "redirect_uri": "http://127.0.0.1:8792/callback" }`, which fixes the port OpenCode listens on. Show me the diff.

If OpenCode's page names no return address, pre-register with `http://127.0.0.1/callback` and record in `ports/ch18.md` what OpenCode actually sends. If sign-in fails with a return-address error, copy the address from the error, run `client:add` again with it, and record what happened.

**By you:** sign out on the sign-in server's page first, or use a new private browser window. Then run `opencode mcp auth apts`, sign in as Ana, pick Brightline. Ask A1.

**What good looks like:** A1's answer, as in Task 13. The route OpenCode used, in `ports/ch18.md`.

**Check it now.** Download [Task 15's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-15.md).

### Task 16. Step-up (15 minutes, Claude Code, extension)

**Predict:** what status will Grace's vendor question get, and will a second consent screen fix it?

First ask Claude Code: "Remove the up-front scopes from `apts` in `.mcp.json`, so it asks only for what the connector's 401 names, as in [18.7](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/permission-per-tool/)." Then **by you:** in Claude Code, sign out of `apts`. Sign out on the sign-in server's page (or use a new private window). Sign in as Grace, pick Brightline. Ask: "What are Hocking Valley's payment terms?"

**What good looks like:** Claude Code reports that the server needs more permissions. If it opens a second consent screen, approve it: the sign-in server still does not grant `ap:vendors.read`, and the call still fails. Copy Claude Code's own message into `ports/ch18.md` word for word. Afterwards, ask Claude Code to put the up-front scopes back in `apts`, or Ana's A1 then needs this step-up too.

**Check it now.** Download [Task 16's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-16.md).

### Task 17. Into the plugin and the hosts (15 minutes, Claude Code)

**Predict:** with no key to carry, can the plugin's connector entry be the same for every AI app?

> Bump the plugin to 0.3.0. `plugin/.mcp.json` lists the connector's address and the pre-registered client, and no `headers`. Check whether the Agent Plugins core's `mcp.json` can now carry it, since there is no secret. (The core is the shared part of Chapter 16's plugin format, which every AI app reads, and its `mcp.json` lists the plugin's MCP servers.) If so, add `plugin/mcp.json` too, with the connector's address only. Make sure no file in the repository names `AP_MCP_TOKEN`, including `.github/workflows/`, `scripts/conformance.ts`, which now gets tokens as in Task 10, and older changelog entries. Only this chapter's own text in `docs/chapter-18/` may name it. Add a `CHANGELOG.md` entry. Run `npm run check:plugin` and `git grep AP_MCP_TOKEN -- ':!docs/chapter-18'`, and show me both.

**What good looks like:** `check:plugin` passes, `git grep` prints nothing, and the changelog says the shared key was replaced by sign-in. `plugin/mcp.json` holds the address and no client ID: its format has no place for one, so the client ID stays in `.mcp.json`.

**Check it now.** Download [Task 17's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-17.md).

**You can now:** sign in to the connector from Claude Code, Codex and OpenCode through your browser, and ship a plugin that carries no key.

---

## Sitting 5: deploy (about 1 hour 10 minutes)

Read [18.15](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/the-sign-in-server-you-run/) and [F8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f8-deploying-the-sign-in-server). Then three things by you:

1. Make a Cloudflare account and choose your `workers.dev` subdomain if you have none.
2. Ask a fresh Claude Code session to run `npx wrangler login`, and approve it in your browser.
3. Create the deploy token. In the Cloudflare dashboard, open your profile's *API Tokens* page and choose *Create Token*. Start from the *Edit Cloudflare Workers* template, add permission to edit *D1*, and create it.

Ask the agent to create an empty file `.secrets/cloudflare-token` (git ignores it). Open that file in a plain text editor, paste the token, and save. Never paste it into a chat.

### Task 18. Staging (30 minutes, Claude Code)

**Predict:** what will the production connector answer to a staging token?

**First, a Four-Part Brief ([Chapter 5](https://agentfactory2.panaversity.org/managing-ai-workers/the-four-part-brief/overview/)),** in Plan mode:

> *Outcome.* The repository's rules guard the sign-in server and its database. In `AGENTS.md`'s Deploying section, add:
>
> - Deploy the sign-in server before the connector.
> - Apply migrations only with the npm scripts.
> - Never run SQL against a remote database except a read-only `SELECT` I ask for.
> - Never read or print a password, token, client secret or key.
>
> In `.claude/settings.json` and `opencode.jsonc`, add ask rules for `npx wrangler d1 migrations apply`, `npx wrangler d1 execute` and `npm run migrate*` (an npm script hides the Wrangler command inside it). Also add a deny rule for `npx wrangler d1 execute brightline-auth *--remote*`, which matches production and not staging.
>
> *Context.* `AGENTS.md`, `.claude/settings.json`, `opencode.jsonc`.
>
> *Format.* Show me each diff.
>
> *Constraints.* Keep every existing rule. Plan only, and wait.

**What good looks like:** four new lines in `AGENTS.md`, three new ask rules and one new deny rule in each settings file, and every old rule still there.

Read the plan, switch to Manual mode, and say "Apply it."

Then, in a fresh session:

**In plain words.** The agent adds the npm scripts for putting the sign-in server online. Then it follows [F8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f8-deploying-the-sign-in-server)'s steps 3 to 10 for staging only: the databases, the migrations, the secrets, both deploys and the four companies. These steps also make a staging client for Claude Code and a CI client for the automated checks. It finishes with `check:deploy` and the conformance suite against staging, and stops at the first error.

> First add npm scripts for the sign-in server, matching the connector's from Chapter 17: `secrets:auth:staging`, `secrets:auth:production`, `deploy:auth:staging` and `deploy:auth`, and `migrate:auth:staging` and `migrate:auth:production`. Add a root `check:deploy` that checks both `wrangler.jsonc` files against F8's rules, then dry-runs (rehearses without uploading) both Workers in both environments.
>
> Then follow field guide F8, "Your first deploy, in order", steps 3 to 10, for staging only. For the sign-in matrix against staging, sign the staging test people in with the same script as Task 10, using `.secrets/test-users.staging.env`. Use the third local sign-in server from Task 10, on 8749, for the "another sign-in server" row. Run `npm run keys -- --deploy` first. Create both databases (F8 step 3), apply migrations remotely, send the secrets, and deploy `brightline-auth-staging`. Set the sign-in server's staging `AUTH_BASE_URL`, `MCP_RESOURCE` and `MCP_RESOURCE_PY`, and the connector's staging `AP_ISSUER`, `AP_RESOURCE` and `AUTH` service binding, all to the staging addresses. Deploy the connector to staging, and add the four companies in staging with `tenant:add --env staging`.
>
> Then create a staging client for Claude Code with `npm run client:add -- --env staging --client-id brightline-claude-code --name "Claude Code (lab)" --redirect http://localhost:8790/callback`. Add `apts-staging` to `.mcp.json` with that client ID and callback port 8790, its address read from a variable, `${AP_TS_STAGING_URL:-https://brightline-ap-ts-staging.your-subdomain.workers.dev/mcp}`. So no deployed address sits in a tracked host file.
>
> Next, write `npm run client:ci` to create a CI client, owned by Conformance Test Co., with the client credentials grant and admin-assigned scopes. Write `{"tenant": "org_conformance"}` into the client's metadata, because for a token with no person the claims function sees only that metadata (F8). Its token requests must always send `resource`. It writes the client's ID and secret into `.secrets/github.env` as `CONFORMANCE_CLIENT_ID_STAGING` and `CONFORMANCE_CLIENT_SECRET_STAGING`, or the same two ending `_PRODUCTION`, keeping other environments' lines. It also writes them into `.secrets/ci.<env>.env`, which `npm run conformance:<env>` reads. Make one CI client per environment, and create the staging one now with `npm run client:ci -- --env staging`.
>
> Put the staging addresses, which are not secrets, in `.secrets/staging.urls.env`. They are `CONFORMANCE_URLS=ts=<the connector's staging address>`, `AP_ISSUER` (the staging sign-in server's address plus `/api/auth`) and `AUTH_URL` (its address, for the tenant scripts). Skip the matrix's "staging token at production" row for now: production does not exist yet, and Task 19 runs it. If this Cloudflare account still has Chapter 17's Workers, delete their old `AP_MCP_TOKEN` secret with `wrangler secret delete`, showing me the command first.
>
> Then run `npm run check:deploy` and `npm run conformance:staging`. Stop at the first error and show me.

**By you:** in your own terminal, set `AP_TS_STAGING_URL` to the staging connector's address (an address, not a secret). On a Mac (zsh): `export AP_TS_STAGING_URL=https://brightline-ap-ts-staging.<your-subdomain>.workers.dev/mcp`. On Windows (PowerShell): `$env:AP_TS_STAGING_URL = "https://brightline-ap-ts-staging.<your-subdomain>.workers.dev/mcp"`. Then start Claude Code from that terminal with `claude`. In that session, type `/mcp`, choose `apts-staging`, sign in as Ana with her staging password from `.secrets/test-users.staging.env`, and ask A1.

**What good looks like:** every command named staging, except creating the production database ([F8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f8-deploying-the-sign-in-server) step 3), making keys and the dry run. `check:deploy` passes, which means the test-only key is not switched on anywhere. `conformance:staging` ends `0 failed`. The authors' build keeps the sign-in matrix in `scripts/matrix.ts`, which runs on your computer. If your agent's build also runs it against staging, it must end `0 failed` too. A1's answer matches Task 13.

- If sign-in fails online with Error 1102 every time, record it and treat the online sign-in as blocked by the free plan. It counts as done for this lab ([F8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f8-deploying-the-sign-in-server)). `conformance:staging` then runs without the browser sign-in rows: record that.
- If the deploy refuses the Rate Limiting binding, follow Task 9b's fallback.
- The "staging token at production" row runs in Task 19, an extension. If you skip Task 19, the local "token made for another connector" row covers the same idea.

**Check it now.** Download [Task 18's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-18.md).

### Task 19. Production, by the workflow (25 minutes, Claude Code, OpenCode checks, extension)

**Predict:** why can't the automated checks sign in the way you do?

**By you:** the deploy workflow also needs your Cloudflare account ID, as the secret `CLOUDFLARE_ACCOUNT_ID`. In the Cloudflare dashboard, open *Workers & Pages* and find *Account ID* under *Account Details*, with a copy button next to it. In your own terminal, in the repository's folder, run `gh secret set CLOUDFLARE_ACCOUNT_ID` and paste it when asked. Never paste it into the chat.

> First, set up production by hand, from my computer, showing me each command first. Send its secrets with `npm run secrets:auth:production` and `npm run secrets:production`. Set production's `AUTH_BASE_URL`, `MCP_RESOURCE`, `MCP_RESOURCE_PY`, `AP_ISSUER`, `AP_RESOURCE` and `AUTH` service binding in both `wrangler.jsonc` files to the production addresses. Put those addresses in `.secrets/production.urls.env`, as Task 18 did for staging.
>
> Then change `.github/workflows/deploy.yml` so each environment applies the sign-in server's migrations, deploys the sign-in server and deploys the connector. Each environment then runs the conformance suite with a token from the CI client. Migrations come before the code that needs them (F8). The workflow reads four variables, `STAGING_ISSUER`, `STAGING_URLS`, `PRODUCTION_ISSUER` and `PRODUCTION_URLS`, and four secrets, `CONFORMANCE_CLIENT_ID_STAGING`, `CONFORMANCE_CLIENT_SECRET_STAGING` and the same two ending `_PRODUCTION`. Send the GitHub secrets with `gh secret set -f .secrets/github.env`, the variables with `gh variable set`, and the Cloudflare deploy token as `CLOUDFLARE_API_TOKEN` with `gh secret set CLOUDFLARE_API_TOKEN < .secrets/cloudflare-token`. Give the workflow an input, `skip_conformance`, that skips the conformance run, for the very first production deploy only.
>
> Prove that the CI client cannot get a Brightline or Cedar Ridge token, with conformance checks that run whenever a CI client is used. Its token always says `org_conformance`, even when the request names another company, and it cannot start a browser sign-in. A check that looks for a `Location` header passes for the wrong reason, because Node's `fetch` gets Better Auth's JSON reply `{"redirect":true,"url":...}` instead (Task 4). Show me the workflow's diff.

Then ask the agent to push the branch `auth` and open a pull request from it with `gh pr create`, using the template.

**By you:** read the pull request's checks. One check, `tests-unchanged`, fails and names the test files Tasks 6, 7, 9b and 9c changed on purpose. It exists so that a person reads them, so compare its list with those tasks. If nothing else is on it, and every other check passes, merge. Then start production once with the conformance run skipped: `gh workflow run deploy -f target=production -f skip_conformance=true`, or ask the agent to, and approve it. Then ask the agent: "Add the four companies in production with `tenant:add --env production --yes-production`. Create the production CI client with `client:ci --env production --yes-production`, then send its secret with `gh secret set -f .secrets/github.env`. Show me each command before you run it." Then run the workflow again, normally.

Then, to OpenCode: "Run `npm run conformance:production` and show me the summary. Then send a staging token to production and show me the status."

**What good looks like:** the workflow run is green. Production's suite ends `0 failed`. The staging token gets `401`. The CI client's attempt to get a Brightline or Cedar Ridge token is refused. The CI client's decoded token shows `tenant: org_conformance` and the production connector's address as `aud`. If it is not a JWT at all, the request left out `resource` ([F8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f8-deploying-the-sign-in-server)).

**Check it now.** Download [Task 19's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-19.md).

### Task 20. Ship it (15 minutes, Claude Code)

If you skipped Task 19, first ask the agent to push the branch `auth` and open a pull request from it with `gh pr create`, using the template. When you approve, ask it to merge. The deploy workflow that runs after the merge will then fail for lack of the deploy secret. That is expected. Judge the pull request by its tests, which sign their own test tokens with the test-only key. One check, `tests-unchanged`, fails and names the test files Tasks 6, 7, 9b and 9c changed on purpose, so compare its list with those tasks.

> Create a branch `ch18-docs`. Better Auth 1.7.15 has no command to replace a signing key: it replaces an expired key only at the next token. So, tests first, add an admin route `POST /admin/signing-keys/rotate` that makes the new key at once. Give it two modes: `scheduled` (the old key stops sealing now and stays published for one more day) and `leaked` (the old keys are deleted). Add `npm run signing-key:rotate` to call it. Check that `npm run keys` has `--rotate-handle <env>` and `--drop-previous <env>`, for replacing the handle key (F8). Update `docs/deploy.md`: the sign-in server, its migrations, signing-key rotation and what to do if a signing key leaks, handle-key rotation, adding and removing a company. Open the pull request with the template and AI review. (A fresh agent session that has not seen this work reads the change against `REVIEW.md`, as in Task 12.) When I approve, merge it and tag `ch18`. Then clone the repository fresh into a temporary folder at `ch18`. In the fresh clone, run `npm run keys`, since secrets are never in the repository. Then run every check that needs no sign-in server: the tests, the type checks and the plugin check. The sign-in matrix needs the local sign-in server and its test people, so it already ran in Task 10.

**What good looks like:** the fresh clone's checks all pass, the rotation route has its tests, and `docs/deploy.md` has a new section for each item in the prompt.

**Check it now.** Download [Task 20's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch18-key-task-20.md).

**You can now:** put a sign-in server and its connector online in staging and production, keep the two apart, and run them safely.

## Apply it to your vertical (optional)

Take your own connector from Chapter 17's optional task. Write its `auth-spec.md` with the person who owns its data: its companies, roles, scopes and refusals. Then ask a coding agent to put this chapter's sign-in in front of it, and run [18.13](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/proving-the-sign-in-keeps-companies-apart/)'s matrix against it, with one planted bug.

## If something goes wrong

| What you see | Likely cause | What to do |
| --- | --- | --- |
| Every request gets 401, even right after sign-in | The token's `aud` is not the connector's exact address: a trailing slash, `localhost` against `127.0.0.1`, or `http` against `https` | Ask the agent to show the token's claims and compare `aud` with `AP_RESOURCE` character by character |
| 401 with "unknown key" | The connector kept old public keys, or reads them from the wrong sign-in server, or a token sealed with a brand-new key arrived within 30 seconds of its last fetch | Wait 30 seconds and try again. Then restart the connector. Check `AP_ISSUER` and the service binding |
| The AI app cannot find where to sign in | No link in the 401, or the connector's document names the wrong sign-in server | Fetch both documents as in Task 1 and compare with [F4](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f4-the-sign-in-in-detail) |
| The sign-in page says the app is not allowed | The app's document host is not on the allowlist | Decide: add the host in a reviewed change, or pre-register ([F5](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f5-claude-code) to [F7](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f7-opencode-version-2)) |
| The consent screen lists no company | The person has no membership | Check the `member` rows read-only, and use `tenant:add` |
| A Cedar Ridge person sees Brightline data | Stop. A rule in [18.11](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/one-order-slip-per-request/) or [18.12](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/what-else-carries-the-company/) is broken | Run the sign-in matrix and do not deploy until it passes |
| The sign-in page shows `invalid_redirect` | The return address the app sent differs from the one listed: `localhost` against `127.0.0.1`, a trailing slash, or an extra `?` part. Only the port may differ | Ask the agent to show the client's listed return address, and run `client:add` again with the exact address the app sends |
| Choosing *Allow* on the consent page does nothing | The page's `Content-Security-Policy` has `form-action 'self'`. A browser applies it to the go-elsewhere reply that follows the form, so the trip back to the app is blocked. Scripted tests never see this | Ask the agent to add `http://127.0.0.1:*`, `http://localhost:*` and `https:` to `form-action` |
| Error 1102 during sign-in online | Password hashing took more processor time than the free plan allows | Record it in `ports/ch18.md`, next to the authors' local measure of about 80 ms ([F8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f8-deploying-the-sign-in-server)). It is a known open question for this lab |
| A script that prints a JSON report gives output that will not parse | The connector's audit lines also go to standard output | Ask the agent to silence the audit lines in that script only |
| A secret appears in an agent's output | The agent read a secrets file | Stop the session. Ask an agent to delete that file without reading it, and run `npm run keys` to make a new one. It never overwrites a file that exists. Then send the new one again to each environment |

## Exam notes

These notes are not part of the lab. CCDV-F asks about Claude's behavior. This chapter supports identity, secrets and keys, MCP server development at the level of authorization, untrusted input and the systems life cycle. Where Claude Code differs from the MCP specification, the exam follows Claude Code. The CCAR-F guide puts OAuth and MCP hosting out of scope, so this chapter does not serve CCAR-F.

## Artifact checklist

- [ ] `docs/auth-spec.md`, written with the AP analyst
- [ ] `servers/auth/`: the sign-in server on D1, with migrations, sign-in and consent pages, the fetcher and its allowlist, and its tests
- [ ] `servers/ap-ts/` and `py/brightline_ap/` checking tokens, with no shared key anywhere
- [ ] The seven rules in [18.11](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/one-order-slip-per-request/) and [18.12](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/what-else-carries-the-company/), each with a test, in both versions
- [ ] The sign-in matrix, in `scripts/conformance.ts` or a script beside it, and the planted-bug results in `ports/ch18.md`
- [ ] `scripts/tenant-add.ts`, `tenant-member.ts`, `tenant-remove.ts`, `client-add.ts` and `client-ci.ts`
- [ ] Plugin v0.3.0, `.mcp.json`, `.codex/config.toml` and `opencode.jsonc`, with no key
- [ ] `ports/ch18.md`: for each AI app, signed in, the registration route, whether it asked for `offline_access`, and the step-up message
- [ ] `AGENTS.md`, `.claude/settings.json` and `opencode.jsonc` with the database rules
- [ ] The sign-in server and the TypeScript connector in staging, and (extension) production through the workflow
- [ ] `docs/deploy.md` with key rotation, and adding and removing a company
- [ ] Tag `ch18`, passing from a clean clone
