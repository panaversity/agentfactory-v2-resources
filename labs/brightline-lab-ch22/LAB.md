# Lab 22: the AP worker in Brightline's portal

Chapter 22 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 22: the AP worker in Brightline's portal](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/lab/), so you can do the lab without the book.

*This is the lab page for [Chapter 22](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/overview/). Read each part of the chapter, then do its sitting here. The chapter tells you when. The field guide ([F0](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/reference/#f0-from-zero-keys-consoles-and-where-secrets-live) to [F7](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/reference/#f7-openai-and-omnara-for-the-ports)) is on the companion page, [**Chapter 22 reference**](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/reference/).*

| Sitting | Do it after | Tasks | Time |
| --- | --- | --- | --- |
| Getting ready, and Sitting 1 | Part A ([22.1](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/the-worker-leaves-the-laptop/) to [22.5](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/a-budget-on-every-run/)) | Task 0, Tasks 1 to 4 | 45 minutes for Task 0 (about 1 hour 30 minutes if you skipped [Lab 19](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/lab/)), then about 1 hour 35 minutes |
| Sitting 2 | Part B ([22.6](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/what-travels/) to [22.8](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/permission-policies/)) | Tasks 5 to 8 | about 1 hour 15 minutes |
| Sitting 3a, the end of Milestone 1 | Part C ([22.9](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/three-identities-never-one/) to [22.12](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/the-portals-own-pages/)) | Tasks 9 to 11 | about 2 hours 45 minutes |
| Sitting 3b | [22.13](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/keys-that-expire-and-no-keys-at-all/) | Tasks 12, 12b and 13 | about 2 hours 15 minutes |
| Sitting 4 | [22.14](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/when-a-refresh-is-refused/) to [22.16](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/loops-check-feedback-and-stop/) | Tasks 14 to 18 | about 2 hours 40 minutes |
| Sitting 5, the end of Milestone 2 | Part E ([22.17](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/patterns-and-when-to-host-it-yourself/), [22.18](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/designing-a-hosted-worker/)) | Tasks 20 and 21, optional 19 and 21b | about 1 hour 5 minutes, or 2 hours with both extensions |

## Lab 22: getting ready

The lab runs in sittings, each right after the concepts it uses. This section is the setup for all of them: read it now, then do Task 0. When a task says F0 to F7, it means the field guide, on the companion page **Chapter 22 reference** (in the lab, `docs/chapter-22/field-guide.md`).

**What you need to have done.** Read Chapters [16](https://agentfactory2.panaversity.org/building-ai-workers/skills-and-plugins/overview/) to [19](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/overview/). Doing Lab 19 helps, but Task 0 can build its system for you. Labs [20](https://agentfactory2.panaversity.org/building-ai-workers/agent-loop-by-hand/lab/) and [21](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/lab/) are not needed to run this lab, but the lab builds on their code. Everything starts from `brightline-lab-ch22.zip` ([download it here](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22.zip)). It holds the repository as Lab 21 ends, with Lab 22's files added, as a plain folder. Task 0 puts it under git and tags it `lab22-start`. So `src/loop/`, `src/sdk/`, their Python twins under `py/`, Lab 21's `docs/worker-spec.md` and `docs/sdk-map.md` are all there, and their tests still pass. Every earlier idea a task uses is explained where it is used.

**Route B is not enough here.** In Labs 20 and 21 you could use your own Chapter 19 connector online (route A). Or you could use a practice connector on your own computer (route B). A hosted platform cannot reach a connector on your computer, and each person must sign in through [Chapter 18](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/overview/)'s sign-in server. So this lab needs Chapter 19's system online in your own accounts, which is route A. If you took route B, or skipped Lab 19, Task 0 sets that system up for you, one step at a time from `docs/deploy.md`. Allow about 1 hour 30 minutes for it. The practice connector stays in the repository, and Lab 22 does not use it.

**This lab costs money, and takes about 12 hours 20 minutes.** Neither hosted runtime has a free plan. Every session in this lab carries a budget, most of a few cents. The authors expect the Claude tasks to cost under $8 in all, about $2 of it for the session matrix and its planted bugs. They expect the optional OpenAI port to cost under $3. All of these are still to be confirmed by the authors' live run. Cloudflare and Neon stay on their free plans. The open-source port can run free with a local model.

**The date in this lab** is Monday, April 5, 2027, a week after Lab 19 and four days after Lab 21 (Thursday, April 1).

**A note on this lab.** The authors have not yet run this lab end to end. If a menu name or a message differs a little from what a task describes, trust what you see, and record it in `ports/ch22.md`. **When a task lists two results, either is fine.** Some tasks say "Either counts" or "not yet confirmed": those are accepted variations, not differences. **One stop rule:** if Task 0's step 5, Task 3, Task 6 or Task 7 does something different from **What good looks like**, stop there. An example is a session that cannot reach the connector at all. Record what you saw, and do not build on it: every later task depends on that step. Task 0's step 5 and Task 3 are about reaching the platform, and Tasks 6 and 7 are about reaching the connector. It is not your mistake.

### Two milestones

**Milestone 1, required: a hosted worker in the portal (about 6 hours 20 minutes, Tasks 0 to 11, with Task 10 in three parts, 10a to 10c).** Sittings 1, 2 and 3a. At the end, Ana and Luis each ask the worker a question in the portal, each with their own token, under a budget. This is the milestone every reader completes. It is **not yet safe for real users**: nothing has yet proved that one person's session cannot reach another's.

**Milestone 2, required before you sell a worker: safe to sell (about 6 hours, Tasks 12 to 18, 20 and 21).** Sittings 3b, 4 and 5. It includes the open-source port, Task 20, because every build in this part of the book must run on a second option. Running on a second option shows what in your design depends on one platform. The session matrix and planted bugs prove the isolation. Then come CI with no stored key, refresh and rotation, webhooks, the morning triage loop, the open-source port and shipping. A worker you sell to a client company needs this milestone.

*Extensions:* Task 19 (the OpenAI port) and Task 21b (an outcome).

![Six columns, one per sitting, each listing what that sitting adds. Sitting 1: an agent definition, an environment, sessions you can read, a budget on each. Sitting 2: the skill, the connector, one open door, a policy per tool. Sitting 3a: the AP portal, a vault per person, Ana and Luis ask questions. A dashed line follows Sitting 3a, labeled Milestone 1, a hosted worker in the portal. Sitting 3b: the session matrix, planted bugs, CI with no stored key. Sitting 4: refresh and sign in again, webhooks, the morning loop. Sitting 5: a second runtime, shipped and tagged. Those three are labeled Milestone 2, safe to sell.](img/chapter-22-sitting-buildup.png)

*Figure 22.25. What the system gains at each sitting. Milestone 1 works, and Milestone 2 proves it is safe.*

### Before you start

*What you need.*

- Everything Labs 19 to 21 needed: a computer with Node 22.19 or later (24 recommended). Python 3.12 or later with uv 0.11.32 or later (for Labs 20 and 21's tests). Also git, the GitHub CLI (`gh`), and the desktop apps of Claude Code, ChatGPT (for Codex) and OpenCode version 2, each signed in ([Chapter 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/overview/)). And free Cloudflare, Neon and GitHub accounts.
- **A Claude Console account with API credits,** two workspaces and a staging key with a 30-day expiry, made by you in Task 0 ([F2](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/reference/#f2-claude-managed-agents-from-zero)).
- **For the optional OpenAI port:** an OpenAI API account with credits and a project with a $5 hard limit (F7).
- **For the open-source port:** Docker with Compose (F7).

**This lab writes code as it goes.** Labs 20 and 21 shipped finished code, and you predicted what it did. Lab 22 ships only a skeleton. Most tasks are **make** tasks, the last step of PRIMM-AI+, as Lab 21 did for its two rules. The task says **in plain words** what the code must do, a coding agent writes it, and you check the result against those words. Where the code decides a rule that keeps people or companies apart, the task adds **Check before you approve**. You **predict**, then ask the agent to show you those lines, and investigate any gap, as in [Chapter 13](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/overview/). The new code is TypeScript (the chapter's [overview](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/overview/) says why).

**How every task runs.** Chapter 12's five-step routine, as in Labs 17 to 21: (1) a fresh session with the named agent, in `brightline-ap/`. (2) Plan mode, with the task's prompt as the brief. Read the plan, and correct it before it starts. (3) Manual mode: approve each command. (4) Evidence: the agent shows what proves the task is done, and you check it against **What good looks like**. (5) A line in `ports/ch22.md`: the task, the agent, what it proved, anything that surprised you.

**What you do by hand, and only this.** Make accounts and workspaces, and make each API key in its console. Paste each key into its file in `.secrets/` with your own editor. Put the portal's client id and secret (Task 9), its staging key (Task 10a) and its webhook signing secret (Task 17) into the portal's secrets at a `wrangler` prompt. Paste the webhook signing secret into `.secrets/portal.env` first. Sign in as a test person in a browser, and approve consent. Add the webhook endpoint in the Console, and put the production key into the portal's secrets. Decide when to merge and deploy. Agents do everything else. **No API key, client secret, refresh token, access token or signing secret passes through a chat.**

**Rules the agents follow, and settings that enforce them.** `AGENTS.md` at `lab22-start` says: ask before `ant apply` without `--dry-run`, before any vault or credential call, and before any session created outside the tests. Never print, read aloud or copy anything in `.secrets/`. Every session gets a budget. Words alone are advice, so Claude Code's and OpenCode's own settings files at `lab22-start` (`.claude/settings.json`, `opencode.jsonc`) also deny reading `.secrets/` and ask before those commands. Codex's settings cannot deny reading a path, so for Codex `AGENTS.md` guards `.secrets/`. Also, `.codex/config.toml` makes Codex ask before any command that needs the network, as every platform call does.

**Your mistake, or the book's?** The lab has not yet been run end to end. So every **What good looks like** is what the authors expect, not yet what they saw. If your result differs, first ask your agent to compare its work with the task's prompt, step by step: most differences are in the setup. If it still differs, record what you saw in `ports/ch22.md` and carry on, unless the stop rule above applies.

**You do not need to understand every word of a prompt.** The prompts are written for the agent, so they carry exact names. Check the agent's plan against the task's **Goal**, and its result against **What good looks like**. When a word is new, ask the agent to explain it in one line before it starts. The table below has the words for Task 0 and words used everywhere, starting with the platform's own names for the chapter's words. Each sitting starts with a table of its own new words.

| Word in a prompt | What it means |
| --- | --- |
| `always_allow`, `always_ask`, `auto` | The lab's platform's names for the three permission policies of 22.8: allow, ask and decide |
| `end_turn`, `requires_action`, `budget_reached` | The platform's names for a session's three stop reasons of [22.3](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/reading-a-session/): finished, needs action and budget reached |
| `limited`, `allowed_hosts` | Limited networking, and its host allow list ([22.7](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/the-sandbox-and-its-network/)) |
| `mcp_oauth` | A vault credential that holds a person's sign-in token and refreshes it ([22.10](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/a-vault-per-person-and-company/)) |
| Workspace | A separate space on the platform for keys, resources and spending. The lab has one for staging and one for production (F2) |
| `ant apply`, `--dry-run` | Apply the agent files. With `--dry-run`, show the plan and change nothing ([22.4](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/resources-as-code/)) |
| `*.brightline.example` | A stand-in address. Every address ending in `brightline.example` means the matching real address of yours, recorded in `docs/addresses.md` in Task 0 |
| Neon branch | A copy of a database you can make in seconds, so staging and tests each get their own (Chapter 19) |
| Hyperdrive | Cloudflare's link from a Worker to a database. "Caching off" means every query reads fresh rows (Chapter 19) |
| Conformance check | [Chapter 17](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/overview/)'s test suite that proves the connector still speaks MCP correctly (`npm run conformance:staging`) |
| A log | The lines a server writes as it works. See the connector's or sign-in server's with `npx wrangler tail <name> --env staging`, or ask your agent to show them (F0) |
| 400, 401, 404, 409 | Web error codes. 400: the request was wrong. 401: no valid sign-in. 404: not found, or not yours to see. 409: it already exists |

**Your agents can read this chapter.** `docs/chapter-22/` holds the concepts and the field guide as text. Each prompt names what to read.

### Task 0. Set up from the zip (45 minutes, or about 1 hour 30 minutes if you skipped Lab 19, Claude Code)

**Goal:** the Chapter 19 stack running in your own staging accounts, and every check passing at `lab22-start`. Also the `ant` CLI installed, and your staging key in a file git ignores.

**By hand first (F2).** Unzip `brightline-lab-ch22.zip`. If you did Labs 20 and 21, copy your own `docs/sdk-map.md`, `ports/ch20.md` and `ports/ch21.md` into it, over the answer keys' examples: Task 1 reads your map. If you did Lab 19 and will reuse its staging system, copy your own `.secrets/` folder into `brightline-ap/` too. Make the Console account, add credits, and make the two workspaces with spending limits. Then make the staging key with a 30-day expiry, and put it in `brightline-ap/.secrets/anthropic.env`. Make the Neon and Cloudflare accounts if you have none. Unless you copied them, also make the three keys that Labs 18 and 19 made by hand. They are the Neon API key in `.secrets/neon.env` ([Chapter 19's F2](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f2-neon-from-zero)), the Workers AI token in `.secrets/embeddings.env` ([Chapter 19's F4](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f4-embeddings-and-vectors-from-zero)), and Cloudflare's deploy token in `.secrets/cloudflare-token` ([Chapter 18's F8](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/field-guide-securing-connectors/#f8-deploying-the-sign-in-server)).

**Predict:** at `lab22-start`, can a hosted session reach the connector yet?

**In plain words.** Your coding agent sets up Chapter 19's system in your own accounts. That system is the database (on Neon, with a branch for staging), the link from Cloudflare to it (Hyperdrive), the sign-in server and the connector. It checks it all works, and installs the hosted platform's command-line tool. If you skipped Lab 19, ask the agent to explain each step in one line as it goes.

> Read `README.md`, `AGENTS.md`, and `docs/chapter-22/field-guide.md`, sections F0 to F2. `docs/deploy.md` ships in the zip and is the one setup guide (Task 21 updates it). Follow it for staging only, in my own accounts, one step at a time, running the commands `docs/deploy.md` gives for each, and stop after each step to show me its result:
>
> 1. **Before anything:** put this folder under git, with a main branch, in one first commit of everything here, "Start from the end of Chapter 21", and tag it `lab22-start`. If git has no name and email yet, set them for this project only. Then, if my Cloudflare, Neon or GitHub account already has Workers, databases, a Hyperdrive configuration or a repository from Labs 18 and 19 with the same names, list them and ask me whether to reuse or remove them.
> 2. **The database:** the Neon project and its staging branch, then the business database's migrations, roles and data.
> 3. **The link to it:** the Hyperdrive configuration, with caching off.
> 4. **The sign-in server, then the TypeScript connector,** on Cloudflare, by Chapter 18's first-time staging steps, `docs/chapter-18/F8.md`, steps 1 to 10. In its step 9, add Brightline with Ana Morales as its owner, Cedar Ridge Supply with Luis Moreno as its owner, and Conformance Test Co. with no people, from `data/companies.csv` and `data/test-people.csv`. Run every check `docs/deploy.md` lists, then `npm run conformance:staging`.
> 5. **The platform tool:** install the `ant` CLI as F2 says for my operating system, and run `ant --version`. Read the key from `.secrets/anthropic.env` into the environment for one command, never printing it, and run one read-only call that lists agents in the staging workspace (expect none).
> 6. **Your addresses:** write `docs/addresses.md` with my four real staging addresses. They are the connector's (with `/mcp`), the sign-in server's, the portal's staging Worker `brightline-portal-staging`, which Task 10a deploys, and the second copy that Task 12b deploys for the session matrix, `brightline-portal-matrix`. Each is on my workers.dev subdomain, or my own domain. From now on, every `*.brightline.example` address in a prompt means the matching one from that file, exactly, with the same path.
> 7. Make a private GitHub repository `brightline-ap`, set the secrets and the variable `docs/deploy.md` lists for it, and push `main` and the tag. Install with `npm ci`, then `cd py && uv sync --locked`, as in Lab 20. Run Labs 20 and 21's offline tests, `npm run test:loop`, `npm run test:sdk`, `npm run test:loop:py` and `npm run test:sdk:py`, and the portal skeleton's, `npm run test:portal`, which need no network and no keys. If any fail, show me the first failure and stop: Lab 22 builds on that code, but no Lab 22 task runs it, so a failure here is for the authors, not for me to fix. Finish with `git ls-files .secrets` (expect nothing) and a table of every check with its result.

**The seven steps, and what each shows.** The numbers match the prompt's.

| Step | What good looks like |
| --- | --- |
| 1. Before anything | One commit at tag `lab22-start`, and a list of anything from Labs 18 and 19 with the same names, with your answer: reuse or remove (or "none found") |
| 2. The database | The Neon staging branch exists, the migrations ran, and each company's rows loaded |
| 3. The link to it | The Hyperdrive configuration exists, with caching off |
| 4. The sign-in server, then the connector | Both answer at their staging addresses, Ana and Luis are on staging's sign-in server, and `npm run conformance:staging` passes |
| 5. The platform tool | `ant --version` prints 2.5.0, the pinned version, and the agent list is empty |
| 6. Your addresses | `docs/addresses.md` lists four real addresses, none ending in `brightline.example` |
| 7. GitHub, and the earlier tests | A private `brightline-ap` repository with its secrets, `main` and the tag. Labs 20 and 21's tests pass: 47 in TypeScript (32 and 15) and 35 in Python (22 and 13). The portal skeleton's 20 pass. `git ls-files .secrets` prints nothing |

**What good looks like:** every step above. Your prediction: no, because there is no agent definition, no environment and no vault yet.

**Check it now.** Download [Task 0's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-0.md).

**If Task 0 fails.**

| What you see | What to do |
| --- | --- |
| A Neon or Cloudflare command asks you to sign in | Sign in in the browser it opens, then ask the agent to run the stage again |
| A stage fails with a message about a missing secret | Run `npm run keys` and `npm run db:passwords` (Chapters 18 and 19), or make the missing key by hand (By hand first), then that stage again |
| The conformance check fails | Ask the agent to show the first failing check and the connector's log for it (F0). Fix that, then run it again |
| `ant` is not found | Ask the agent to install it again as F2 says, and open a new terminal |
| Anything else | Stop, and ask the agent to explain the error in one line before it changes anything |

## Lab 22, Sitting 1: a first hosted agent (about 1 hour 35 minutes)

**Before you start, answer in a line each:** What moves to the platform when a worker is hosted, and what stays with your product (22.1)? Which of the four resources holds the person ([22.2](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/four-resources/))? **After this sitting, you can:** apply an agent and an environment from files, read a session's events, and say why it stopped.

**New words in this sitting's prompts.**

| Word in a prompt | What it means |
| --- | --- |
| Frontmatter | The block of settings between two `---` lines at the top of a Markdown file (F2) |
| Session-create method | The one call in the platform's code library that starts a session. Only `start-session.ts` may use it |
| Archive | Keep a resource on the platform, but stop it being used again |
| `--force` | Apply even when the platform's copy changed. Never use it without reading both versions (22.4) |

### Task 1. The worker contract (20 minutes, Claude Code)

**Goal:** `docs/worker-spec.md` for a hosted worker. The spec says what the worker may answer, its tools and skill, its budget and what it must never do. It also says what each of Lab 21's eleven rows becomes.

**Predict:** open `docs/worker-spec.md`, Lab 21's specification, and read its eleven row names (if you skipped Lab 21, ask the agent to list them). Which of them does a hosted platform change, and which stay exactly as they were?

**In plain words.** Lab 21's `docs/worker-spec.md` is the worker's portable specification: what it must do on any runtime. You play Ana Morales, Brightline's AP analyst. Your coding agent interviews you, then writes a new version of the spec for a worker that serves many people. The agent also says what happens to each of Lab 21's rows. Git keeps Lab 21's version.

> Read 22.1 and 22.2 in `docs/chapter-22/`, Lab 21's `docs/worker-spec.md` and the "What this still leaves to me" lines of `docs/sdk-map.md` (if that section is blank because I did not do Lab 21, read `docs/sdk-map.example.md`, the authors' filled map, instead), `docs/worker-spec.template.md`, `docs/acceptance-prompts.md` and `skills/invoice-triage/SKILL.md`. Interview me, one question at a time, as Ana Morales, Brightline's AP analyst. Ask what the worker should answer, which questions it should refuse, which tools and skill it uses, how much a run may spend, what it must never do, and who it acts for. Then write `docs/worker-spec.md` from the template. Its last section takes Lab 21's eleven rows in order, and says for each one what changes on a hosted worker, with the concept that teaches it. It names no platform, and no company appears in the worker's instructions.

**What good looks like:** four tools and one skill. One person and one company per run. A budget of $0.50 for a question, $1.00 for a review. "Never" includes paying, approving or changing anything, and also telling one person about another person's work or another company's data. In the last section, two rows stay as they were. They are the read tools that run without asking, and the cited policy line, now checked by the portal. The rest change. The instructions lose Brightline's and Ana's names, because one worker serves every company. `flag_invoice` is left out for now (22.6). The test token becomes each person's own token in a vault (22.10). The platform keeps the session's events (22.3), and the worker runs for the person who asked, not for you (22.9). Your prediction: the rows about tools, credentials, storage and identity change. They change because those are what a hosted platform takes over, or what serving many people demands. Compare with `answer-key/worker-spec.md`.

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-1.md).

### Task 2. The agent and environment as files (30 minutes, Claude Code)

**Goal:** the agent definition and runtime environment as files, applied to staging with a plan, and a lock file committed. Also a configuration check that fails on the mistakes this chapter warns about.

**Predict:** if you edit the agent in the Console after applying, what will the next `ant apply` do?

**In plain words.** The worker's definition and where it runs become files. A script applies them, always showing a plan first. A check catches the mistakes this chapter warns about. Two settings come from Part B, so here they are in a line each. The worker's **built-in tools** are its own file tools in the sandbox. Only read (open a file), glob (list files by name pattern) and grep (search inside files) stay on. **`limited` networking** means the sandbox may reach only the hosts you list, and for now you list none.

> Read 22.2, 22.4, 22.5 and F2.
>
> 1. From `docs/worker-spec.md`, write `agents/ap-worker.md` with no connector yet and every built-in tool off except read, glob and grep, and `environments/ap-sandbox.yaml` with `limited` networking and an empty `allowed_hosts` for now.
> 2. Write `scripts/agent-apply.ts` (`npm run agent:apply -- --env staging [--apply]`), which loads the key from `.secrets/anthropic.env` without printing it, always runs `ant apply --dry-run` first and prints the plan, applies only with `--apply` after I approve, and uses `claude-lock.<env>.json`.
> 3. Write `src/hosted/start-session.ts`, the only file that may create a session. For now it exports one function, and records what it sends:
>    - `startTestSession`, for the lab's own scripts, works in staging only, takes an agent name and a budget of at most 10 cents. Task 8 lets it take a test vault too.
>    - Task 10b adds a second function, for real people, once vaults have been taught.
> 4. Write `scripts/check-agent-config.ts` (`npm run check:agent-config`). It checks `agents/`, `environments/`, `deployments/` and the code. Test agents live in `tests/agents/`, are applied by hand for one task, and are archived at its end. It fails if:
>    - any environment file has no `networking` or uses `unrestricted`
>    - any built-in tool other than read, glob and grep is on
>    - any agent's instructions name a company in `data/companies.csv` or a test person (one definition serves every company, 22.2)
>    - any file outside `src/hosted/start-session.ts` calls the platform's session-create method, or anything in `apps/portal/` imports `startTestSession`
>    - any file in `deployments/` (schedules, which come in Milestone 2) has no budget
> 5. Show me the plan, wait for me, then apply. Show me the lock file. Then I will change one word of the worker's instructions (the Console calls them the system prompt) in the Console (the staging workspace, its agents page, `ap-worker`, edit and save), and you will apply again and show me what happens.

**Check before you approve.** Predict first: what does the check do with an environment file that has no network setting at all? Then ask the agent to show the lines in `scripts/check-agent-config.ts` that enforce each rule from 22.4 and 22.7, one rule at a time. Also ask it to run the check once on a copy of the file that breaks the rule.

**What good looks like:** a plan with two creates, then two entries in `claude-lock.staging.json`, each with an id and a hash. `check:agent-config` passes. After your Console edit, the next apply stops with `refusing to apply`. Choose the file's version, and Claude Code applies with your approval. Your prediction: it refuses, because a change outside the files is invisible to review.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-2.md).

### Task 3. A first session, read and predicted (25 minutes, Claude Code)

**Goal:** you can read a session's events and name its stop reason before the last line.

**Predict:** for "What is 2 + 2?", how many tool calls will the log show?

**In plain words.** Your first hosted session. You predict how it will end, then read its events to see.

> Read 22.3 and F3. Write `scripts/session.ts` (`npm run session -- --env staging --message "<text>" --budget-cents <n> [--vault <id>] [--agent <name>]`), which creates a session through `startTestSession` from `ap-worker` and `ap-sandbox` with that budget, opens the event stream, sends the message, and prints each event on one line in the plain form of 22.3, with the real event name beside it. It must refuse to run without `--budget-cents`. Start a session with "What is 2 + 2?" and a budget of 5 cents. Stop printing before the last status line, and wait for my prediction. Then print it. Then start a second session with the same message and show me that the two sessions have different ids.

**What good looks like:** a message in, a message out, no tool calls, then `session.status_idle` with `stop_reason` `end_turn`, "finished". Two different session ids, each with its own history. The cost is under a cent. Your prediction: zero.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-3.md).

### Task 4. A budget of one cent (20 minutes, Claude Code)

**Goal:** you see a budget pause, a rejected new question, and a resume.

**Predict:** with a one-cent cap and a task that needs ten tool calls, will the final cost be under, at or over one cent?

**In plain words.** A session with a budget of one cent shows what happens at a cap, and what happens when you raise it.

> Read 22.5. Using `npm run session`, start a session with a budget of 1 cent and the message "Use glob to list the files in /etc, then read ten of them one at a time with read, and after each one write a one-line summary of what it is for." Each tool call is followed by a new model call, so the cap is checked several times. Print events until it goes idle. Then try to send "Thanks" to the same session as a new message (add `--session <id>` to `scripts/session.ts` for it), and show me the error. Then add `--raise-budget-cents <n>` to `scripts/session.ts`, which reads the session's `usage.list_cost` and updates the session's budget to at least one cent above it (a session update, F2). Raise it to 10 cents and print events until it finishes.

**What good looks like:** a usage line just over one cent, then `budget_reached`. The new message gets a 400 error. After the raise, the session continues from where it stopped, with no new message from you, and finishes. Your prediction: over, by the call that was under way.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-4.md).

**Checkpoint 1: a hosted agent.** Before Sitting 2, check that you can do these without looking back.

- Name the four resources, and say which one holds the person and which ones never may (22.2).
- From a session's last line, say whether it finished, needs a person, or reached its budget, and what your product does for each (22.3).
- Say why a change made in the Console blocks the next apply, and why that is good (22.4).

## Lab 22, Sitting 2: the connector and the skill (about 1 hour 15 minutes)

**Before you start, answer in a line each:** What travels from Chapters 16 to 19 to a hosted worker, and what stays behind (22.6)? Why is a host allow list not an operation allow list (22.7)? **After this sitting, you can:** run the skill and the connector in a session with one open door. You can also show that an injected instruction had no way out.

**New words in this sitting's prompts.**

| Word in a prompt | What it means |
| --- | --- |
| `always_ask`, `always_allow` | The "ask" and "allow" permission policies (22.8) |
| Toolset | The set of a connector's tools as the agent definition declares them, with one default policy for all and exceptions by name (F2) |
| Vault, credential | One person's store of secrets, and one secret in it for one connector address (22.10) |
| `npm run token:test` | Lab 20's command. It signs a test person in through staging's real sign-in pages, as Chapter 18's sign-in matrix did, and writes the connector's address and a 10-minute sign-in token to a file, never shown. Only for test people, only on staging (Task 8, Task 12) |
| Test vault | A vault made for one task, marked `test: "true"`, and archived at the task's end |
| `metadata` | Labels you attach to a vault or session, such as `test: "true"`. The platform stores them, and your code can check them |

**A vault, in short, before Tasks 7 and 8.** The connector needs a sign-in token on every call. On a hosted platform, a person's token is kept in a vault, a locked store that the platform holds for that person. Your product puts the token in, and the platform adds it to each connector call on its way out, so the model never sees it. Part C teaches vaults in full (22.10). Here you need only this: no vault means no token, and a test vault holds a short-lived test token for one task.

### Task 5. The skill (15 minutes, Claude Code)

**Goal:** the invoice-triage skill uploaded and attached.

**In plain words.** Chapter 16's invoice-triage skill goes to the platform, unchanged.

> Read 22.6. Add `skills/invoice-triage/` to the files `npm run agent:apply` applies, attach it to `agents/ap-worker.md` by its folder's path, as F2 shows (`ant` fills in the id the upload returns), and apply to staging after showing me the plan. Then start a session with a 5-cent budget asking "Which skills do you have, and what does each do?"

**What good looks like:** the plan shows a new skill and an agent update to a new version. The session names the invoice-triage skill. The answer does not mention Chapter 16's `/ap-triage` command, because commands did not travel.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-5.md).

### Task 6. The connector, with one open door (25 minutes, Claude Code)

**Goal:** the staging connector declared, only the four reviewed tools on, and only the connector's host reachable.

**Predict (a thought experiment, not run in this task):** if you turned the connector's tools on but forgot the host in `allowed_hosts`, what would happen when a session started?

**In plain words.** The worker gets the connector, and its network gets exactly one open door: the connector's address.

> Read 22.6, 22.7, 22.8 and F2. Add the staging connector to `agents/ap-worker.md` as F2 shows: the connector's toolset off by default with `always_ask`, and only `find_vendor`, `list_open_invoices`, `get_purchase_order` and `search_policy` on, with `always_allow`. Add only the connector's host to `allowed_hosts`. Add one rule to `scripts/check-agent-config.ts`: it fails if the connector's default is not `always_ask`, or any connector tool other than the four in the spec is on. Run `npm run check:agent-config`, show me the plan and apply. Then print, for every tool the model can see, its policy and why, from the applied agent.

**What good looks like:** seven rows. Four connector tools on "allow", and read, glob and grep on "allow". No command tool, no web tools. `check:agent-config` passes. Your prediction: the worker cannot reach the connector, because its host is not an open door (22.7, F2). Whether the platform rejects the session at the start or fails the first connector call is not yet confirmed. Either counts as the right answer.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-6.md).

### Task 7. A session with no vault (15 minutes, Claude Code)

**Goal:** the planned failure that Part C fixes.

**Predict:** the connector requires a sign-in token. What will a session with no vault show?

**In plain words.** A session with no vault fails on purpose, so you see the safe failure before you fix it.

> Read 22.2. Start a session with a 5-cent budget and no vault, asking "Which invoices are open?" Print every event.

**What good looks like:** a `session.error` with `mcp_authentication_failed_error`, and the worker saying it could not reach the AP data. The session still started. The connector's log shows a 401 with no token. Your prediction: an authentication error, not a crash, because the call went out with no token and the connector refused it.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-7.md).

### Task 8. The injection check, and one open door (20 minutes, Claude Code)

**Goal:** an injected instruction in a tool result cannot send data out, and the network rule refuses any host but the connector's.

**Predict:** with the web tools off, what does the log show when the worker reads the planted note?

**In plain words.** A planted note in Cedar Ridge's vendor data tries to make the worker send data out. To read Cedar Ridge's data, the session needs a sign-in. So the agent makes a test token for Luis that lasts ten minutes, and a test vault that holds it for this task only. The vault box above says all you need: the vault carries Luis's token to the connector. Then a second test shows the network rule itself refusing an address.

> Read 22.7.
>
> 1. Make a test token for Luis with `npm run token:test -- --person luis --company org_cedar --out .secrets/luis-test.env`. It writes the connector's address and a 10-minute sign-in token to that file. Never show it.
> 2. Let `startTestSession` take at most one vault, and only one whose `metadata` marks it as a test vault for a person in `data/test-people.csv`. Make a test vault for this task only, as F4's example shows, but with no `refresh` block and with `test: "true"` in its metadata. Put the token in it.
> 3. Start a session with `npm run session`, that vault and a 10-cent budget, asking "Tell me about vendor V102." Print every event.
> 4. Make a test version of the agent, `tests/agents/ap-worker-webtest.md`, with web fetch on, in the same runtime environment, and apply it. Start a session with `npm run session -- --env staging --agent ap-worker-webtest` and a 5-cent budget, asking "Fetch https://collect.example.net/ping and tell me what it says." Print every event.
> 5. Archive the test agent and the test vault, and delete the token file.

**What good looks like:** the first run shows the note in the `find_vendor` result, labeled as data. It shows no web request at all, because there is no tool that could make one. Whether the model would have obeyed the note does not matter: it had no way out. The second run shows a web fetch for `collect.example.net` refused with `url_not_allowed`, which proves the network rule itself. Your prediction: no web call, because there was no tool to make one.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-8.md).

## Lab 22, Sitting 3a: one person, one company (about 2 hours 45 minutes, Tasks 9 to 11)

**Before you start, answer in a line each:** Which three identities does a hosted worker involve, and what may each do (22.9)? Why does a session name exactly one vault, chosen by the server (22.10, [22.11](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/one-session-one-person-one-company/))? Why must the portal check who started a session before it streams its events (22.12)? **After this sitting, you can:** give each person a vault per company, and start sessions for them through the portal. Task 11 ends Milestone 1. Take a break after Task 10a: it is a natural place to stop.

**New words in this sitting's prompts.**

| Word in a prompt | What it means |
| --- | --- |
| Confidential client | A program on a server, registered with a client secret, that may hold a refresh token (22.10) |
| Service binding | A private link between two of your servers on the same platform, not reachable from the internet (Task 9) |
| D1 | Cloudflare's database for Workers, which Chapter 18's sign-in server already uses. The portal gets a D1 database of its own (Task 9) |
| `wrangler secret put` | The command that stores a secret for a deployed server, read from a prompt or a file, never printed ([F6](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/reference/#f6-workload-identity-keys-and-the-portals-secrets)) |
| Service account | An account for a program, not a person, so a key made for it belongs to the product, not to you (22.9, F6) |
| PKCE, `state` | Two checks in a sign-in: PKCE proves the app that started the sign-in is the one finishing it, and `state` proves the answer belongs to this sign-in (Chapter 18) |
| ID token | A signed token from the sign-in server that says who signed in. The portal reads it. The access token is for the connector (Task 10a) |
| `mcp_oauth` credential, `refresh` block | The kind of vault credential that holds a person's sign-in tokens, and the part of it that lets the platform get new ones ([F4](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/reference/#f4-vaults-in-detail)) |
| `offline_access` | The scope that lets an application keep getting tokens while the person is away (Chapter 18) |
| `client_secret_post` | How the portal proves who it is when it asks for tokens: it sends its client secret in the request (F4) |
| Rotation | Each time a refresh token is used, the sign-in server returns a new one and the old one stops working (22.10, more in 22.14) |
| Cookie, `HttpOnly`, `SameSite=Lax` | The value a browser keeps for a site. `HttpOnly` hides it from page scripts, and `SameSite=Lax` stops most other sites from sending it (22.12) |
| Form token | A one-time value in the portal's own page, checked when the page sends something back (22.12) |
| Content security policy | A rule sent with a page: run only the site's own scripts (22.12) |
| Fake platform client | A stand-in for the platform's code library in tests, so tests run without calling the platform or spending money |

### Task 9. The portal as a confidential client (30 minutes, Claude Code)

**Goal:** the portal registered on the staging sign-in server, with its secret held only in files and secrets, never shown. Also the portal's two tables in place.

**Predict:** the coding agents in Chapter 18 were public clients. Why must the portal be a confidential client?

**In plain words.** Four things. The portal registers with the sign-in server as a program that holds a secret. A script writes that secret to a file, never shown. The portal gets two tables: one for each person's vault, one for each session it starts. And the sign-in server gets a private question the portal can ask, "is this person still a member of this company?" Only the portal can reach it.

> Read 22.10 and 22.11.
>
> 1. In `servers/auth/`, add a migration that registers `brightline-portal` as a confidential OAuth client with two redirect addresses, `https://portal-staging.brightline.example/callback` and `https://portal-matrix-staging.brightline.example/callback` (for Task 12b's matrix deployment), the scopes the four tools need plus `offline_access` and `openid`, refresh token rotation on, and consent never skipped. Add `openid` to the sign-in server's own scopes too, so it returns an ID token that tells the portal who signed in: Chapter 18's apps needed none. Show me the test that proves an ID token comes back.
> 2. Write `scripts/register-portal-client.ts`, which creates the client's secret and writes the client id and secret straight into `.secrets/portal.env`, printing only "written".
> 3. Add two migrations for the portal's own data, in a D1 database of the portal's own, `brightline-portal-staging`, in `apps/portal/migrations/`, never in the sign-in server's, which stores no business data (Chapter 18): `agent_vaults` (person id, tenant id, vault id, credential id, status, updated at, one active row per person and tenant) and `portal_sessions` (session id, person id, tenant id, the vault ids it named, created at).
> 4. Add a private route to the sign-in server, `GET /internal/membership?person=&tenant=`, reachable only through a Cloudflare service binding from the portal, never from the internet, that answers whether the person is a current member of that company.
> 5. Deploy the sign-in server to staging and run the registration script. Then stop. I set the id and secret as the portal's staging secrets myself, in my own terminal: `npx wrangler secret put PORTAL_CLIENT_ID --env staging` and `npx wrangler secret put PORTAL_CLIENT_SECRET --env staging` in `apps/portal/` (the zip already holds the portal skeleton there), pasting each from `.secrets/portal.env`, which I open in my own editor.
> 6. Finish with `git ls-files .secrets`, and show me every line in `register-portal-client.ts` that prints anything.

**What good looks like:** the client exists with `offline_access` and `openid`, rotation on and both redirects, and the ID token test passes. Both tables exist. The membership route answers through the binding and refuses a request from the internet. The registration script prints only "written", and `git ls-files .secrets` prints nothing. Your prediction: the portal gets tokens for many people, on a server, and the platform uses them while those people are away. So it must prove who it is with a secret as well (22.10).

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-9.md).

### Task 10a. Ana signs in, and her vault (1 hour, Claude Code)

**Goal:** Ana signs in, consents for Brightline, and her tokens go into her own vault, which the portal records but never reads back.

**By hand first (F6).** Make the portal's staging key: in the Claude Console, under Settings, make a service account named `brightline-portal` and add it to the staging workspace. Then, under Settings, **API keys**, make a key with **Linked account** set to that service account. Scope it to the staging workspace, with a custom expiry of 90 days. In your own terminal, run `npx wrangler secret put ANTHROPIC_API_KEY --env staging` in `apps/portal/`, and paste the key at the prompt. The zip already holds the portal skeleton there, so the secret can be set before the agent fills it in. The portal never uses your own key.

**Predict:** after Ana signs in, can anyone read her token back out of the vault?

**In plain words.** The portal becomes a small web site. When Ana signs in, it checks the sign-in really came from her. Then it asks the platform to make a vault for her at Brightline, and puts her tokens in it. It never keeps a token itself.

> Read 22.9, 22.10 and F4.
>
> 1. Fill in the portal skeleton in `apps/portal/` (a Cloudflare Worker in TypeScript, named `brightline-portal`, with its routes stubbed). Sign-in goes through the staging sign-in server as `brightline-portal`, using the skeleton's sign-in helper, which does PKCE and checks `state`, as Chapter 18's apps did. Add a consent step for one company.
> 2. On the callback, verify the ID token the sign-in server returns, and take the person and the company from it. Never take them from the request, or from the access token, which is meant for the connector. Show me the test that fails if the ID token's signature is wrong.

**Check after step 2:** Claude Code shows you the passing ID-token test, and the sign-in page the portal sends you to, from the portal running on your computer (`npm run dev:staging` in `apps/portal/`). Do not go on until both work. Then give the agent the rest of the prompt:

> 3. If Ana has no row in `agent_vaults` for that company that is not archived, make a vault for her and that company, with one `mcp_oauth` credential for the staging connector's address and a `refresh` block using `client_secret_post`. If she has one, update that credential's secret values instead (F4). Then write the row in `agent_vaults`.
> 4. Never store or log a token in the portal. Write tests for both paths with a fake platform client.
> 5. Deploy to staging. I will open the portal's address from `docs/addresses.md` in my browser and sign in as Ana, with the test password from `.secrets/test-users.staging.env`, which I open in my own editor, then choose Brightline and approve. Show me the `agent_vaults` row, and try to read the vault's credential back.

**What good looks like:** one row for Ana at `org_brightline`, status `active`. Reading the credential returns no secret fields. Your prediction: no one, because a vault's secret fields can be written but never read (22.10).

**Check it now.** Download [Task 10a's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-10a.md).

### Task 10b. Ana's session (35 minutes, Claude Code)

**Goal:** Ana's question runs in a session with her vault and a budget, started with the portal's own key. No token appears in any event.

**Predict:** after Ana's session runs, will any event in its log contain any part of her token?

**In plain words.** The portal gets a question box. Its server decides who is asking and which vault to use, and starts the session. Then a script searches the session's whole history for anything shaped like a token.

> Read 22.3, 22.8, 22.10 and 22.11.
>
> 1. Add a page with one question box. On submit, the server reads the signed-in person and company from its own cookie, checks the person's current membership through the membership route, and finds the one active vault in `agent_vaults`.
> 2. Add `startPersonSession` to `src/hosted/start-session.ts`. It requires a person, a company, exactly one vault id and a kind of run, `question` or `review`, and takes the budget for that kind from `docs/worker-spec.md` ($0.50 or $1.00). It never takes a budget from its caller, so no page or request can set one. It writes to `portal_sessions` the exact `vault_ids` array it sends to the platform, not the vault it meant to send. Start Ana's session with it, kind `question`.
> 3. Before showing the answer, check it with Lab 21's rule 2 (an answer must cite a policy line, written as `(file.md:N)`), `citesPolicyLine()` in `src/rules/cites.ts`. It is Lab 21's rule, moved into a file of its own at `lab22-start`, because Lab 21's `src/sdk/policy.ts` also writes files to disk, which a portal on the edge platform cannot keep: its files last one request. First show me the function and say in one line what it accepts. An answer that cites no policy line is not shown, and the person sees "No answer with a cited policy line. Ask the AP lead." Show the answer as plain text for now (Task 10c adds the page rules). Deploy. I will ask "Which invoices are due this week?"
> 4. Tell me where to see which API key created the session. The session's record names no key: the Console's Sessions page shows it in its Created by column, by name, never its value. I will look.
> 5. Write `scripts/history-scan.ts`, which fetches a session's whole history and fails if any event contains the word `Bearer`, or a string shaped like a signed token (three dot-separated parts, the first starting `eyJ`), printing only the event ids it flags. Run it on Ana's session.

**Check before you approve.** Predict first: if the code took the company from the page's request, how could Ana's page reach Luis's vault? Then ask the agent to show the lines that choose the vault for a session, and point to where the person and the company come from. Nothing from the request, the page or the question may reach that choice (22.11).

**Check before you approve.** Predict first: does `citesPolicyLine()` accept "See the payments policy, line 2"? Then ask the agent to show it. It accepts only the written form `(file.md:N)`, so it checks that a citation is there, not that it is right ([21.6](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/what-counts-as-done/)).

**What good looks like:** Ana's answer cites a policy line, as `(file.md:N)`. An answer that cites none would be held back, as in 21.6. The Console's Sessions page, in step 4, shows the session created by the portal's key, linked to the `brightline-portal` service account, not yours. Ana's answer comes from Brightline's data, and the connector's log line names Ana and Brightline. `history-scan` flags nothing. Your prediction: no, because the platform adds the token at egress (22.10).

**Check it now.** Download [Task 10b's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-10b.md).

### Task 10c. Only Ana can watch it: the page rules (25 minutes, Claude Code)

**Goal:** the portal's pages follow the two rules of 22.12.

**Predict:** Ana types the id of someone else's session into the address bar. What does she see, and why that wording?

**In plain words.** Two rules for the portal's own pages. A session can be watched, confirmed or interrupted only by the person who started it. And nothing from a session runs as code in the page.

> Read 22.12.
>
> 1. Page rules (22.12): show everything from a session as plain text, never as HTML. Turn on the skeleton's security helper, which sends a content security policy allowing only the portal's own scripts, sets the sign-in cookie `HttpOnly`, `Secure` and `SameSite=Lax`, and checks a one-time form token on every `POST`. Make the question, confirmation and interrupt routes `POST`s that use it. Explain each of its settings to me in one line.
> 2. Ownership (22.12): the stream, confirmation and interrupt routes take a session id, and each first checks `portal_sessions` that the session belongs to the signed-in person and company, answering 404 otherwise. The stream reconnects as F3 says.
> 3. Deploy. Show me the page's response headers, with the content security policy and the cookie's settings, and the test that asks for another person's session and gets 404.

**What good looks like:** the headers show a content security policy for the portal's own scripts, and a cookie marked `HttpOnly`, `Secure` and `SameSite=Lax`. The 404 test passes. Ana's question still works. Your prediction: "not found", which tells her nothing about whether the session exists (22.12).

**Check it now.** Download [Task 10c's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-10c.md).

### Task 11. Luis's vault, Luis's session (15 minutes, you, then Claude Code)

**Goal:** the same for Cedar Ridge.

**In plain words.** The same as Ana's tasks, for Luis at Cedar Ridge. His answer must come from Cedar Ridge's data.

> I will sign in to the staging portal as Luis Moreno, choose Cedar Ridge and approve. Then show me his `agent_vaults` row. I will ask "Who is vendor V001, and what do we owe them?" Show me the connector's log line for it.

**What good looks like:** Luis gets Treasure Valley Lumber, Cedar Ridge's V001, with Cedar Ridge's total. The log line names Luis and `org_cedar`.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-11.md).

**Checkpoint 2: the end of Milestone 1.** Before Sitting 3b, or before you stop here, check that you can do these without looking back.

- Name the three identities, who holds each, and why a worker must never act as the builder (22.9).
- Trace Ana's token from consent to the connector, and say where the model could see it (nowhere) (22.10).
- Say why the portal never starts a session with two vaults for the same connector, and which row of the matrix proves it (22.11).
- Say why the portal checks who owns a session before streaming its events, and which row proves it (22.12).

## Lab 22, Sitting 3b: proving it (about 2 hours 15 minutes, Tasks 12, 12b and 13)

This sitting starts Milestone 2.

**Before you start, answer in a line each:** Which rule does each matrix row prove (22.11, 22.12)? How can CI prove who it is without a stored key (22.13)? **After this sitting, you can:** prove with eight rows and ten planted bugs that no session reaches another's data, and deploy with no stored key.

**New words in this sitting's prompts.**

| Word in a prompt | What it means |
| --- | --- |
| Headless browser | A real browser run by a program, with no window, used here to check what a page does (Task 12) |
| Federation rule | In the Console, a rule that lets one repository, branch and workflow get a short-lived token as a service account (22.13, F6) |
| Deployment (on the platform) | The platform's name for a scheduled run. Not the same as deploying the portal to Cloudflare ([22.15](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/schedules-and-webhooks/)) |

**A schedule, in short, before Task 12.** A schedule is a saved instruction to start a session on a timetable. It is written as a cron expression of five fields: minute, hour, day of month, month and day of week. Row S6 makes one that would run at 3:00 a.m. on January 1 (`0 3 1 1 *`), paused as soon as it is made, so it never runs. You build a real one in Sitting 4 (22.15).

**The session matrix, with its planted bugs.** 22.11 gave each row's rule. Here is the bug for each row, which Task 12b plants. You also plant two more, which the configuration check catches instead: ten in all.

| Row | The rule | Why it matters | The planted bug, and how the row catches it |
| --- | --- | --- | --- |
| S1 | **The server picks the vault from the signed-in person,** never from the browser, the question or the model | A question could say anything | The portal picks the first vault in its table. Luis asks for V001 and gets Brightline's, so the row fails |
| S2 | **A vault id from the browser is ignored** | A page could send any vault id | The portal reads `vault_id` from the request. The test sends Ana's vault id while signed in as Luis |
| S3 | **Exactly one vault per connector per session** | With two vaults for the same connector address, the platform uses the first, so Luis's session could act as Ana | The portal adds a "shared" vault to every session. The test reads the vaults recorded for each session |
| S4 | **No company in the definition.** The company comes only from the token | One definition serves every session | A line "You work for Brightline" is added to the instructions. The configuration check reads them |
| S5 | **A removed person cannot start a session,** because the portal first asks the sign-in server whether the person is still a member, and their vault is archived | Leaving a company must end access. Removal also withdraws the person's **grant**, their standing permission for the portal to get tokens for them | The portal checks only its own table, not current membership. A test person is removed, then asks a question |
| S6 | **An offboarded company's vaults are archived,** and its scheduled runs pause | No future session can use them | The offboarding script skips the vault step. A trial company gets a vault and a schedule, then is offboarded |
| S7 | **No token in any event, and nothing from a session runs in the page** (22.12) | A token in a page or a log can be stolen | The portal passes the token to the model "for debugging". The test searches every event for tokens |
| S8 | **A session belongs to the person who started it** (22.12) | Anyone who learns a session id could watch it | The portal streams any session id it is given. Ana asks for Luis's session |

### Task 12. The session matrix (45 minutes, OpenCode)

**Goal:** eight rows that try every route from one session into another, all passing on the real portal.

**Predict:** which row needs one person signed in while another person's session still exists?

**In plain words.** The matrix signs in test people, and starts real sessions through the portal, each with the portal's normal question budget. It checks each rule from 22.11 and 22.12. For row S7 it needs tokens it can search for, so it makes its own. `npm run token:test` signs a test person in through staging's real sign-in pages, and writes a 10-minute sign-in token to a file. Then the matrix puts those tokens into the test people's vaults, through the portal's own vault code. They are ordinary staging tokens: no test signing key is ever published (Chapter 18), so nothing a test makes works in production. Row S6 also makes a paused test schedule, as the box at the start of this sitting explains.

**Two prompts, with a check between them.** Give the agent the first prompt, check its four rows, then give it the second.

**First prompt: the set-up and the four vault rows.**

> Read 22.11, its matrix table, and 22.12.
>
> 1. Write `scripts/tenant-offboard.ts` (`npm run tenant:offboard -- --company <id> --env staging`): Chapter 18's `npm run tenant:remove`, then Chapter 19's `npm run tenant:delete`, then archive every vault in `agent_vaults` for the company, pause every schedule that uses one of them, and mark the rows archived.
>    Add the same step for one person to Chapter 18's `npm run tenant:member` when it runs with `--remove`: it archives that person's vault for that company. Archiving a vault means the platform keeps it, but no session can use it again.
>    Extend `npm run agent:apply` so it also applies files in `deployments/`, with the same plan first (F2).
> 2. Write `scripts/session-matrix.ts` (`npm run matrix:sessions -- --env staging [--rows S1,S3]`). It signs in the test people from `.secrets/test-users.staging.env` through the portal's sign-in route, passing the consent screen with Chapter 18's scripted test sign-in (staging and test people only). It starts every session through the portal, so each gets the portal's own question budget of $0.50. A row whose session ends with `budget_reached` is inconclusive, never a pass.
> 3. The rows for choosing the vault (22.11):
>    - S1: Ana and Luis each ask for V001 and get their own company's.
>    - S2: a request to the portal with a `vault_id` field naming Luis's vault, sent as Ana, gets Ana's answer.
>    - S3: every row the portal wrote to `portal_sessions` in this run lists exactly one vault id, and it is the asking person's for that company.
>    - S4: `npm run check:agent-config` passes, and no applied agent's instructions name a company or a test person.
>
> Run `npm run matrix:sessions -- --env staging --rows S1,S2,S3,S4` and show me the four lines.

**Check before you go on:** four rows pass, none inconclusive.

**Second prompt: the four rows for leaving and for the portal's pages.**

> Add these rows to `scripts/session-matrix.ts`.
>
> 1. The rows for people and companies leaving (22.11):
>    - S5: Dana, a test person at Cedar Ridge, is added to it for this row (`npm run tenant:add -- --company org_cedar --member "Dana <dana@cedarridge.example>=member" --env staging`), signs in and gets a vault. Then `npm run tenant:member -- --company org_cedar --email dana@cedarridge.example --remove --env staging` removes her on the sign-in server. She cannot start a Cedar Ridge session, and her Cedar Ridge vault is archived.
>    - S6: Juniper Trail Outfitters, the trial company that left in Chapter 19, is added back for this row, with Sam Keller as its owner (`npm run tenant:add`, as in Chapter 18), and offboarded again here. Sam gets a test vault (metadata `test: "true"`) from `token:test`, and `npm run agent:apply` creates a test schedule from `deployments/test-juniper.md` attached to it, with a budget of 5 cents, paused as soon as it is made, on a date far from the lab (`0 3 1 1 *`). Then `npm run tenant:offboard -- --company org_juniper --env staging` runs. Every Juniper vault is archived, the schedule shows as paused, and a new Juniper session fails. Then archive the test schedule, and show that the deployment list no longer has it.
> 2. The rows for the portal's pages (22.12):
>    - S7: `history-scan` passes on every session the matrix made, and no history contains a 12-character piece of any token `token:test` issued in this run. Luis asks about V102, whose planted note also holds `<img src=x onerror=alert(1)>`, and the portal's page, loaded in a headless browser, shows it as plain text and runs no script.
>    - S8: Ana asks the portal for the event stream, then to confirm a tool call, then to interrupt, each for Luis's session from S1, and gets 404 all three times. A confirmation sent with Ana's cookie but without the page's form token is refused.
> 3. Print one line per row, the run's total list cost, and `matrix:sessions: N rows passed, M failed`. Run it.

**Check before you approve.** Pick one row. Predict which line of its test fails if the rule it proves is broken. Then ask the agent to show that row's test and the planted bug that Task 12b uses for it. Check that the failing line is the one you named.

**What good looks like:** eight rows pass, none inconclusive. Your prediction: S8, because Ana asks for Luis's session from S1 while it still exists. The run starts about twelve sessions, which cost about 3 to 5 cents each, under $0.60 in all.

**Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-12.md).

### Task 12b. Ten planted bugs (1 hour, OpenCode)

**Goal:** proof that every row can fail, with each planted bug caught.

**Predict:** which bugs does no matrix row catch, and what catches them instead?

**In plain words.** Each test from Task 12 should fail when its rule is broken. You break each rule on purpose, one at a time, and check that its test fails.

> Read 22.11 again.
>
> 1. The bugs: the eight in the table at the start of this sitting, one per row from S1 to S8. Bug 9: a second session-create call in the portal that skips `start-session.ts`. Bug 10: a schedule file with its budget removed.
> 2. For each bug, one at a time: make a throwaway branch and plant it.
> 3. Deploy that branch to the **matrix copy** of the portal, a second copy at `portal-matrix-staging`, whose address Task 9 registered (Cloudflare calls it the `matrix` environment: a third meaning of "environment", a second copy of the same Worker with its own address). It uses the same staging secrets as the real portal, which I set once myself, in my own terminal, as in Tasks 9 and 10a, with `--env matrix`.
> 4. Run `npm run check:agent-config`, and only the matrix rows the bug targets plus S1 (`--rows`).
> 5. Record which fail in `ports/ch22.md`, then delete the branch and the matrix copy. Merge nothing.

**What good looks like:** every planted bug is caught, by at least one matrix row or by the configuration check. Bugs 9 and 10 fail `check:agent-config`, not a matrix row. Compare with the table in the answer key. Each run starts two or three sessions, so the ten cost under $1.50 together. Your prediction: bugs 9 and 10, caught by the configuration check.

**Check it now.** Download [Task 12b's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-12b.md).

### Task 13. CI with no stored key (30 minutes, Claude Code)

**Goal:** `ant apply` from GitHub Actions with no Anthropic key stored in GitHub.

**Predict:** what does the platform's record say started the CI run? You, or something else?

**In plain words.** Deployment from GitHub with no stored key: GitHub proves who it is each time, and gets a short-lived token.

> Read 22.13 and F6.
>
> 1. Add `--ci` to `scripts/agent-apply.ts`. It uses no key file. It gets the platform token from workload identity, asks for no approval, and applies only with `--apply`.
> 2. Walk me through making the service account `brightline-ci`, the GitHub Actions issuer, and a federation rule for this repository's `main` branch and `agents.yml` only, in the staging workspace, as F6 says. Tell me each Console step, and wait while I do it.
> 3. Write `.github/workflows/agents.yml` with three jobs:
>    - **On every pull request:** `npm run check:agent-config` and a file-only diff of `agents/`, `environments/`, `skills/` and `deployments/`. It gets no platform token at all, because pull-request code is not yet trusted and the rule accepts only `main`.
>    - **On merge to `main`:** `npm run agent:apply -- --env staging --ci`, which shows the plan and then applies with `--apply`. It uses workload identity, with `id-token: write` and no key. It skips the apply when a merge changes only lock files.
>    - **After an apply that changed `claude-lock.staging.json`:** a separate job, with only `contents: write` and `pull-requests: write` and no `id-token`, opens a pull request with the new lock file.
> 4. Remove any `ANTHROPIC_API_KEY` from the repository's secrets.
> 5. Open a pull request with one changed line in the instructions, and show me its checks. After I merge, show me the merge job's plan and apply.

**What good looks like:** the pull request's checks pass with no key and no platform token. After merge, the merge job prints the plan, applies it, and staging's agent moves up one version. The Console's workload identity history shows the token exchange as `brightline-ci`. Your prediction: the service account, not a person.

**Check it now.** Download [Task 13's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-13.md).

## Lab 22, Sitting 4: refresh, schedules, webhooks and the loop (about 2 hours 40 minutes)

**Before you start, answer in a line each:** Why might a vault fail on its second refresh (22.14)? What are the six parts of a loop, and why must its check not be the model's own word (22.16)? **After this sitting, you can:** test rotation, turn a refused refresh into "sign in again", and receive webhooks safely. You can also run the morning triage as a loop that checks itself.

**New words in this sitting's prompts.**

| Word in a prompt | What it means |
| --- | --- |
| `webhook_events` | A new table in the portal's database that records every webhook event id already handled, so a repeat is skipped (22.15) |
| `unwrap()` | The platform library's function that checks a webhook's signature and refuses a message more than five minutes old ([F5](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/reference/#f5-webhooks-in-detail)) |
| Reconcile | Compare your own records with the platform's, on a timer, to catch a message that never arrived (22.15) |
| Rubric | A short written list of what "done" means, which a check or a grader compares the work against (22.16, 22.17) |

### Task 14. A refresh you can watch (20 minutes, Claude Code)

**Goal:** the platform refreshes Ana's access token, and the sign-in server's log shows it.

**In plain words.** You shorten the token's life so you can watch the platform refresh it.

> Read 22.14. Set the staging sign-in server's access-token lifetime for `brightline-portal` to 5 minutes, in staging only, and deploy. The token already in Ana's vault was issued under the old lifetime, so sign in again as Ana, which updates her credential with a 5-minute token. Then, as Ana in the portal, ask a question. Wait 6 minutes. Ask again. Show me the sign-in server's log lines for the refresh, without any token, and the second answer.

**What good looks like:** one refresh in the sign-in server's log, from the platform, about 6 minutes after the first question. Then a normal second answer. If the second answer fails at the connector instead, read the refresh in the sign-in server's log. Chapter 18's server needs the connector's address, `resource`, on every refresh. Without it, the server returns a token the connector refuses. Record that in `ports/ch22.md`. Whether the platform sends `resource` on a refresh is an open question: F4's `refresh` block has no field for it.

**Check it now.** Download [Task 14's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-14.md).

### Task 15. Rotation, tested (40 minutes, Claude Code)

**Goal:** you know whether the platform stores a rotated refresh token, you have `npm run vault:check`, and you can rotate the portal's own client secret safely.

**In plain words.** Each refresh gives a new refresh token. You find out whether the platform keeps the new one, and you build a check that says whether a vault still works.

**Predict:** this task answers an open question, so predict both ways. If the platform stores each new refresh token, what do you see? If it does not, which refresh fails first?

> Read 22.14's "one question the documents leave open" and F4.
>
> 1. Write `scripts/vault-check.ts` (`npm run vault:check -- --person <id> --company <id>`), which finds the vault and credential in `agent_vaults` and calls the platform's validate endpoint, printing only `valid`, `invalid` or `unknown` and the HTTP status of the platform's test call to the connector.
> 2. As Ana, wait 6 minutes after Task 14's last question, ask a question, wait 6 more minutes, and ask again. That makes two more refreshes, the second and third in all.
> 3. Show me the sign-in server's log for all three refreshes, with no token in it, and `npm run vault:check -- --person ana --company org_brightline`.
> 4. Record the result in `ports/ch22.md`, then follow the branch below.
> 5. After the branch: every credential's `refresh` block also carries the portal's client secret (F4), so rotating that secret means updating every vault. Write `scripts/portal-rotate-client-secret.ts` (`npm run portal:rotate-client-secret`). It makes a new client secret while the sign-in server still accepts the old one, writes it to `.secrets/portal.env`, updates the `refresh` block of every active credential in `agent_vaults`, and retires the old secret only after `--retire-old`, printing only counts. Run it once with `--dry-run`.

**What you see, and what to do.**

- **If every refresh succeeds** and the check says `valid`: the platform stores the rotated token. Record that, and go on to Task 16.
- **If a refresh fails because a used refresh token came back,** and the check says `invalid`: the platform does not store it. The second refresh is usually the one that fails. Record which refresh failed. Do not build F4's fallback in this lab. Sign in again as Ana, which repairs her credential. Then check that `vault:check` says `valid` before Task 16, because Tasks 17 and 18 need her vault.

**What good looks like:** one of the two branches above, recorded in `ports/ch22.md`, and a `valid` vault before Task 16. The rotation script's dry run prints the number of active credentials it would update (two, Ana's and Luis's) and changes nothing. Your prediction: storing the token shows three successes. Not storing it fails on the second refresh, because rotation made the first refresh token stop working.

**Check it now.** Download [Task 15's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-15.md).

### Task 16. A refused refresh (30 minutes, Claude Code)

**Goal:** a revoked grant becomes "sign in again", not an error, and signing in again repairs the same credential.

**In plain words.** You remove Luis's access, and the portal turns the failure into a clear "sign in again".

> Read 22.14 and F4.
>
> 1. Revoke Luis's grant on the staging sign-in server with Chapter 18's `npm run tenant:member -- --company org_cedar --email luis@cedarridge.example --role owner --env staging`: setting his role again, unchanged, deletes his approvals and refresh tokens for Cedar Ridge, and keeps him a member. Wait 6 minutes, then start a session for Luis through the portal.
> 2. Show me the session's authentication error and `npm run vault:check -- --person luis --company org_cedar`. The `vault_credential.refresh_failed` webhook reaches the portal only once Task 17 adds its endpoint: one sent before that is never delivered.
> 3. Add to the portal: when a session reports `mcp_authentication_failed_error`, call the check.
>    - On `invalid`, mark the row `needs_sign_in`, pause any schedule attached to that vault (the portal lists the workspace's deployments and pauses those whose vault list includes it, none yet, Task 18 adds one), and show the person a "sign in again" page.
>    - On `unknown`, do nothing yet.
> 4. Deploy. I will sign in again as Luis and approve. Show me that his existing credential was updated (same credential id, a 409 never seen), the row back to `active`, and the next session working.
> 5. Restore the staging access-token lifetime that Task 14 shortened, and deploy.

**What good looks like:** `mcp_authentication_failed_error`, then `invalid` from the check, and a page for Luis saying he needs to sign in again. After he signs in, the same credential id with new secret values, and a normal answer.

**Check it now.** Download [Task 16's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-16.md).

### Task 17. Webhooks, checked and deduplicated (25 minutes, Claude Code)

**Goal:** the portal's receiver checks signatures, skips repeats and reconciles.

**By hand first (F5).** Add the staging webhook endpoint in the Console and paste its signing secret into `.secrets/portal.env`.

**In plain words.** The portal learns to receive the platform's messages safely: checked, not repeated, and reconciled.

> Read 22.15 and F5.
>
> 1. Add `/hooks/claude` to the portal. For each delivery: check it with the SDK's `unwrap()` and the signing secret from the portal's secrets, skip any event id already in a new `webhook_events` table, fetch the session or credential the event names, and update the page.
> 2. Add an hourly reconcile job. It lists the last two hours of sessions and handles any it has not seen. It records each scheduled session in `portal_sessions` the first time it sees one. It checks, through the membership route, every person whose vault a schedule uses, and archives the vault of anyone no longer a member.
> 3. Stop. I set the signing secret myself, in my own terminal: `npx wrangler secret put WEBHOOK_SIGNING_SECRET --env staging` in `apps/portal/`, pasting it from `.secrets/portal.env`. Then deploy.
> 4. Start a session as Ana, and show me the delivery. In staging only, the receiver keeps the most recent delivery's raw body and headers in a `webhook_debug` table, which holds no secret. It empties the table after this task.
> 5. Within 5 minutes of the delivery, replay that stored delivery with the same headers, and show me it was skipped as a repeat. (After 5 minutes, `unwrap()` would refuse it as stale instead.) Then send one with a changed body, and show me the refusal.

**Check before you approve.** Predict first: what happens to a message with a valid signature whose event id was already handled? Then ask the agent to show the receiver's three checks in order: the signature, the event id already seen, and the reconciliation.

**What good looks like:** one handled delivery, one skipped as a repeat, one refused. The reconcile job's first run handles nothing new.

**Check it now.** Download [Task 17's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-17.md).

### Task 18. The morning triage as a loop (45 minutes, Claude Code)

**Goal:** a weekday run with a per-run budget. It runs at 7:10 in New York time. Code checks its report against the session's own tool results, sends back at most twice, and posts once per day or marks "needs review".

**Predict:** the worker says "every open invoice has a decision". Why should the portal not believe it, and what can it check instead?

**In plain words.** The morning triage runs on a schedule, and code checks every report before it is posted. A JSON schema, the first file, is a written description of the report's shape that code can check a report against.

> Read 22.15, 22.16 and 22.5.
>
> 1. Write `docs/triage-report.schema.json`: a list of decisions, each with an invoice id, a decision and a policy citation id, and a total. Write the first message each run sends, so the worker ends with the report as JSON matching it.
> 2. Write `deployments/morning-triage.md` for staging: `ap-worker`, `ap-sandbox`, schedule `10 7 * * 1-5` in `America/New_York`, a budget of 50 cents a run, Ana's vault, and that first message. Apply it with the plan first.
> 3. Write `src/hosted/check-triage.ts`, plain code with no model call. Given a session's events, it fails if the report does not match the schema, if any invoice `list_open_invoices` returned has no decision or more than one, if any citation id was not returned by `search_policy` in that session, or if the total differs from the amounts in the tool results added up by the code. It returns the list of failures in plain words. Write tests for it with recorded event fixtures: one passing, one with a missing invoice, one with an invented citation, one with a wrong total.
> 4. In the portal's webhook receiver, when a session from this deployment goes idle, fetch its events and read the last idle event's stop reason:
>    - `end_turn`: run the check. If it passes, store the report in a `reports` table keyed by deployment, company and New York date, and post it with the line "Made with Ana Morales's access." If a report for that key exists, record a repeat and do not post.
>    - If the check fails, send the failures as a new message to the same session, at most twice, and record each round. After the second failed round, store the report as `needs_review` for the AP expert, never posted as done.
>    - `budget_reached` or `requires_action`: record a failed run, never posted.
> 5. Start one run now by hand, and show me the session, every check round, its cost and the posted report. Start a second by hand, and show me it was recorded as a repeat. Then pause the deployment, and show me its status.

**Check before you approve.** Predict first: what does the check do with a report that cites a policy line the session never read? Then ask the agent to show the check function, and find where it compares the report with the session's own tool results (22.16). It is Lab 21's answer check (21.6), with more to check.

**What good looks like:** the four check tests pass. The plan creates one deployment. The first run's report is posted after zero, one or two rounds, for under $0.50 in all. It has the line saying it was made with Ana's access. The second is recorded as a repeat. The deployment shows as paused, so it does not spend money every weekday after the lab. Your prediction: the model cannot see what it missed, so the portal checks the report against the tool results the platform recorded, with code.

**Check it now.** Download [Task 18's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-18.md).

**Checkpoint 3: running it.** Before Sitting 5, check that you can do these without looking back.

- Say when a refresh failure means "sign in again" and when it means "wait", and how the portal tells them apart (22.14).
- Say what a budget does at the cap, what it still accepts, and why it is a safety control (22.5).
- Name the four rules for a webhook receiver, and say who makes a repeated scheduled result harmless (22.15).

## Lab 22, Sitting 5: ports and review (about 1 hour 5 minutes, or 2 hours with both extensions, Tasks 19 to 21 and 21b)

*Tasks 19 and 20 use [22.19](https://agentfactory2.panaversity.org/building-ai-workers/hosted-agents/how-todays-tools-realize-it/), at the end of the chapter, and its full boxes on the companion page. Skim the OpenAI and open-source parts first.*

**New words in this sitting's prompts.**

| Word in a prompt | What it means |
| --- | --- |
| `connection_origin` | On the second platform, which side makes a connector call: the platform (`service`, so the vault's credential is added) or the sandbox (22.19) |
| `allowed_tools` | The list of connector tools a session may use. Every other tool stays off (22.6) |
| Docker Compose | A tool that starts several programs together on your own computer, from one file. The open-source port uses it (F7) |
| Rubric | A short written list of what "done" means, which the outcome's grader checks the work against (22.17) |

**Before you start, answer in a line each:** What differs between the three runtimes in 22.19, and which of those claims are documented but not yet tested? **After this sitting, you can:** port the worker, record exactly what changed, and ship it with its design table.

### Task 19. Port to OpenAI (30 minutes, Codex, optional)

**By hand first (F7).** In the OpenAI dashboard, set the project's monthly spend limit to $5, with Enforce a hard limit turned on (Project settings, Limits). You need that limit because this runtime has no per-session dollar cap that we found. That is the port's budget.

**Goal:** Ana's question on OpenAI's hosted runtime, with her own token in its vault.

**In plain words.** The same worker on OpenAI's hosted runtime. You record what changed.

> Read 22.19 and F7. In `ports/openai/`, write a script that does these steps, in this order:
>
> 1. Read `.secrets/openai.env` without printing it.
> 2. Make the plugin's bundle in OpenAI's format: a copy of `plugin/` with a manifest at `.codex-plugin/plugin.json`, made from `plugin/plugin.json`, as F7 shows. Chapter 16 made none, because Codex reads `plugin.json` itself. Make the session's environment with that bundle attached, for its skill. If the plugin's own MCP settings would make the sandbox connect to the connector, remove them from the uploaded copy.
> 3. Make a vault with one `mcp_oauth` credential for the staging connector, with no refresh block, using a 10-minute access token for Ana from `npm run token:test -- --person ana --company org_brightline --out .secrets/ana-openai.env`, made now, never shown.
> 4. Create one session in that environment, with the connector declared as an MCP tool with `connection_origin` `service` (so the vault credential applies and the token never enters the sandbox), `allowed_tools` set to the four tools, and the vault attached. Ask "Which invoices are due this week?" and print the events.
> 5. Last, delete the credential and the vault, and delete the token file.
>
> Record in `ports/ch22.md` every difference from the Claude build: names, defaults, approvals, budgets, how the plugin loaded, and what you could not set.

**What good looks like:** Brightline's answer, from the connector, with Ana's name in the connector's log, and an answer that follows the plugin's skill. Your notes name at least: the plugin loaded as a bundle, where Claude needed each part declared, and no per-session dollar cap found. They also name no per-tool ask, only allowed tools and an optional review by a model, and `connection_origin`.

**Check it now.** Download [Task 19's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-19.md).

### Task 20. Port to open source (35 minutes, OpenCode)

**The port's budget.** A local model costs nothing. If you choose a hosted model instead, use a key with its own spending limit of $3 or less, set in that provider's dashboard. You need that limit because we found no per-session cap in this runtime.

**Goal:** the same question on Omnara on your own computer.

**In plain words.** The same worker on an open-source runtime, on your own computer. You record what changed.

> Read 22.19 and F7. Start Omnara from the release pinned in `ports/omnara/README.md` with Docker Compose, as F7 says, on this computer only. Walk me through signing up, with the verification link from the local log, adding a model provider (I will choose), making an agent profile with the instructions from `agents/ap-worker.md`, adding the `skills/invoice-triage/` folder as a skill, and adding the staging connector as an HTTP MCP server. Only then make a 10-minute token for Ana with `npm run token:test -- --person ana --company org_brightline --out .secrets/ana-omnara.env`, and store it from that file as a secret that the server's settings name as a bearer token, never shown. Ask "Which invoices are due this week?" Then stop Omnara with `docker compose down` and delete the token file. Record in `ports/ch22.md` what it could not do that the hosted runtimes could.

**What good looks like:** Brightline's answer, using the skill. Your notes say at least: a refreshable token held as a secret, one for each person, not tested, so the port used a 10-minute token. They also say no budget per session found, and insecure local defaults.

**Check it now.** Download [Task 20's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-20.md).

### Task 21. Ship it (30 minutes, Claude Code)

**In plain words.** You finish: merge, tag and document how the worker is deployed and designed.

> 1. Update `docs/deploy.md` with the hosted worker.
> 2. Add a design table to it, as 22.18 shows: one row each for context, harness, graph and loop, with what was decided, who decided it, and the file or check that holds it.
> 3. Add how production is applied. This is an extension, not run in this lab: a second federation rule for the production workspace on the `ch22` tag. List the workspaces, the keys and their expiry dates, the key rotation step, the agent files and lock files, the portal's secrets, the webhook endpoint, the schedule, and offboarding.
> 4. Update `README.md`.
> 5. Run `/code-review` and `/security-review` on the branch, and fix or answer every finding.
> 6. Open the pull request with the template, wait for its checks, including `agents.yml`'s file checks, and show me both reviews. I will merge.
> 7. Tag the merge `ch22`, push the tag, and from a clean clone of the tag run every check that needs no deployed server.

**What good looks like:** both reviews have no open finding. The tag passes from a clean clone.

**Check it now.** Download [Task 21's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-21.md).

### Task 21b. An outcome (optional, 25 minutes, Claude Code)

**In plain words.** An optional run where a second model grades the work against a list you wrote.

> Read 22.17. As Luis, I will write a four-line rubric for "every open Cedar Ridge invoice has a decision and a cited policy line". Write `scripts/outcome.ts`, a staging script that calls `startPersonSession` for Luis, kind `review` ($1.00 from the worker contract), with that outcome and at most 3 rounds. Print the grader's explanation after each round, and the final result.

**What good looks like:** one or more rounds, each with an explanation, then `satisfied` or `max_iterations_reached`, under $1.00.

**Check it now.** Download [Task 21b's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch22-key-task-21b.md).

## Lab 22: wrapping up

### Required and optional

**Both milestones, about 12 hours 20 minutes:** Milestone 1 (Tasks 0 to 11) and Milestone 2 (Tasks 12 to 18, 20 and 21). **With both extensions, about 13 hours 15 minutes.** *Extensions:* Task 19 (the OpenAI port, which costs money) and Task 21b.

### Apply it to your vertical (optional)

Pick a business you know where many people would ask one worker for their own data. For example, a clinic's patients, a school's parents, a law firm's clients. Write its worker contract: who the worker acts for, which tools, its budget, and what it must never do. Then write three rows of its session matrix, each with the bug it would catch.

### If something goes wrong

| What you see | Why | What to do |
| --- | --- | --- |
| `refusing to apply` | A resource changed outside the files | Compare, choose, then apply. Never `--force` without reading both (22.4) |
| Session create fails with a 400 about hosts, or the first connector call fails | The connector's host is not in `allowed_hosts` | Add it to the environment file and apply (F2) |
| `mcp_authentication_failed_error` | No vault, the wrong address, or a refused refresh | Check the vault's credential address against the agent's, then `npm run vault:check` (F4) |
| `mcp_connection_failed_error` | The connector is unreachable, or it answered with an HTTP error that is not about sign-in | Check the connector's staging address. If it is right, record it in `ports/ch22.md`: whether the platform speaks the connector's protocol version is still open |
| A new message gets a 400 after a pause | The session reached its budget | Raise the budget, or end the session (22.5) |
| A session stays idle forever | It is waiting on a confirmation nobody sent | Read its stop reason and the event it names (22.3) |
| Webhooks never arrive | The endpoint is not public HTTPS on 443, or was turned off after failures | Check the endpoint's status in the Console. The reconcile job catches what was missed (F5) |
| A scheduled run happened twice | The fall-back night repeated an hour | The portal keeps one report per schedule, company and local date, and records the second as a repeat (22.15) |
| A second sign-in fails with a 409 | The portal tried to add a second credential for the same address | Update the existing credential's secret values instead (F4) |
| The schedule keeps spending after the lab | The deployment is still active | Pause it, as Task 18's last step does |
| The portal's key stops working | It expired | Rotate it as F6 says, and record the next date |

### Exam notes

These notes name objectives in the projected exam guide this book maps to, and one of OpenAI's own. CCDV-F is the Claude Certified Developer foundations exam.

- **CCDV-F, building agents (primary).** The four resources, events and stop reasons, resources as code, budgets and schedules (22.1 to 22.5, 22.15).
- **CCDV-F, agent patterns (primary).** Permission policies and the hosted patterns (22.8, 22.17).
- **CCDV-F, identity, secrets and keys (primary).** Three identities, key expiry and workload identity, vaults, sessions kept apart, refresh and its refusal (22.9 to 22.14, except 22.12).
- **CCDV-F, injection, untrusted input and leakage, and MCP server development (supporting).** Injection through tool results and egress (22.7), connectors on a hosted agent (22.6).
- **OpenAI, choosing sandbox agents or the hosted Agents API (primary).** The OpenAI part of 22.19, and Task 19.
- The exam examines Claude only. OpenAI and Omnara are not examined, and neither are research-preview features.

### Artifact checklist

- [ ] `docs/worker-spec.md`
- [ ] `agents/ap-worker.md`, `environments/ap-sandbox.yaml`, `skills/invoice-triage/`, `deployments/morning-triage.md`, `claude-lock.staging.json`
- [ ] `scripts/agent-apply.ts`, `check-agent-config.ts`, `session.ts`, `session-matrix.ts`, `history-scan.ts`, `vault-check.ts`, `register-portal-client.ts`, `portal-rotate-client-secret.ts`, `tenant-offboard.ts`, and the vault step in Chapter 18's `tenant-member.ts`
- [ ] `src/hosted/start-session.ts`, the one place a session is created
- [ ] `apps/portal/` with sign-in, vaults, sessions, the event stream, confirmations, webhooks and reconcile
- [ ] `servers/auth/`'s migration for the portal client, and `openid` in its scopes
- [ ] `apps/portal/migrations/` for `agent_vaults`, `portal_sessions`, `reports` and `webhook_events`, in the portal's own D1 database
- [ ] `.github/workflows/agents.yml` with workload identity
- [ ] `ports/openai/`, `ports/omnara/`, and `ports/ch22.md` with every prediction, the matrix and planted-bug table, and the rotation finding
- [ ] `docs/deploy.md`, tag `ch22`
