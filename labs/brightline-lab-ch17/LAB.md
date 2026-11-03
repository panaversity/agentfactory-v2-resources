# Lab 17: the Brightline AP connector

Chapter 17 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 17: the Brightline AP connector](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/lab/), so you can do the lab without the book.

*Time: about 7 hours 50 minutes, in four sittings. Lab files: `brightline-lab-ch17.zip`. The same steps are in `LAB.md` inside the zip.*

### Before you start

**You need no earlier lab.** The zip holds a working repository whose `README.md` explains it, and every setup step is here or in the field guide. Where a task uses an idea from an earlier chapter, it explains it in place.

**What you need.**

- A computer with macOS, Windows or Linux, and a terminal.
- **Node.js 22.19 or later** (24 recommended). The MCP Inspector needs 22.19.0, so this lab raises the repository's floor from 22.18.
- **uv 0.13.4 or later**, for the Python half and for Python Workers.
- Git, a GitHub account and `gh`, as in Chapter 15.
- **Claude Code, Codex and OpenCode version 2**, in their desktop apps, as in [Lab 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/lab/). That means the Claude desktop app with a Pro, Max, Ultra, Team or Enterprise plan, the ChatGPT desktop app with any plan, and OpenCode Desktop with a model connected. You can do the whole lab with one of them: send its prompts to the agent you have.
- **A Cloudflare account on the free plan**, for Sitting 4 only. Sitting 4 shows how to make one.

**The core path and the extensions.** The core path is about 6 hours: Tasks 1 to 13, one port (Task 14 or 15), Task 17, and Tasks 18a and 18b with the TypeScript server. It gives you a specified, tested connector in two languages, proved the same, in the plugin, and online in staging and production. The extensions, about 1 hour 50 minutes, are the second port, telemetry (Tasks 16a to 16c), deploy on merge (18c), and logs, rollback and the runbook (18d). Do them now or come back later. Tag `ch17` after the last task you do.

**You direct, the agents build and deploy.** Work as [Chapter 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/overview/) taught. Use each agent in its desktop app (Claude Code in the Claude desktop app's *Code* tab), in a *Local* session on your computer. Use *Manual* mode, so it asks before every command and every change. Ask for a plan before any change that matters.

- **The agents do all the development and deployment.** They write every file, install every package, run every check, start and stop every server, make the keys, run every `git`, `gh` and `wrangler` command, deploy, roll back and tag. Claude Code builds the specification and the TypeScript server, Codex builds the Python server, and OpenCode builds the conformance suite.
- **You decide.** You play Ana, the AP analyst, when an agent asks about the rules. You read each plan, each command before you approve it, each diff and each check's output, and you approve or send the work back. When a check fails, tell the agent what failed, in your words, and let it fix it.
- **You do by hand only what proves who you are.** That means signing up for an account, signing in (`gh auth login` in your own terminal, and approving Wrangler's sign-in in your browser), and creating the Cloudflare deploy token in the dashboard and putting it in one file git ignores. It also means setting the key your hosts read in your own terminal ([F0](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f0-keys-on-your-computer)), deciding when a pull request may be merged, and deciding when production may be deployed. The agents change every file in the repository, except your own notes, `NOTES.md` and `ports/ch17.md`.
- **No key ever passes through a chat.** The agent makes keys with `npm run keys`, which writes them into files git ignores and prints none. Commands read those files directly, and the repository's rules (`AGENTS.md` and `.claude/settings.json`) forbid an agent to read, print or copy them. Never paste a key or token into a chat, and stop an agent that tries to show one.

**How each task works.** Predict in `NOTES.md` what should happen. Send the prompt. Read the plan and every command and change before you approve it. Read the checks' output, which the agent runs, and compare it with your prediction. Then check the task against its answer key. When a step says the field guide shows something, the agent can read it too: a copy is in `docs/field-guide.md`.

**The lab files.** Download [brightline-lab-ch17.zip](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17.zip) and unzip it into a new folder. It contains `LAB.md`, these steps, and `brightline-ap/`, a plain copy of the repository with no git history. In Task 1, the agent puts it under git. This is the only folder you give an agent. It holds:

- `data/purchase-orders.csv` (12 POs), `data/vendor-notes.csv` (one note per vendor) and `data/vendor-banking.csv` (made-up bank details, which must never leave the server in full)
- `docs/policies/`, three short AP policies with numbered lines
- `servers/hello/`, a finished practice server with one tool
- `scripts/make-keys.ts` (`npm run keys`), which makes every key into a file git ignores, and `.dev.vars.example`, the shape of those files
- `docs/field-guide.md`, a copy of this chapter's field guide

Each task links its answer key as a separate download. Open a key in a text editor, never in the agent. An agent that can read the answers is not tested by them.

**New to MCP or Cloudflare?** You need neither, and you need not have heard of Cloudflare. Read [17.1](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/mcp-in-one-picture/) and field guide [F0](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f0-keys-on-your-computer) and [F1](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f1-cloudflare-from-zero-and-running-the-servers-on-your-computer) before Task 1. [F1](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f1-cloudflare-from-zero-and-running-the-servers-on-your-computer) starts with "Meet Cloudflare", what the company is and what its free plan gives you. The lab runs everything on your computer until Sitting 4, so you need no Cloudflare account until then. Sitting 4 and field guide [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) walk you through making one.

**Your own copy on GitHub.** Task 17 opens a pull request, and Sitting 4 deploys from GitHub, so the repository goes on GitHub once, in Task 1. Sign `gh` in yourself first, in a terminal, never through an agent's chat: `gh auth login`, then `gh auth status` to check, as in Chapter 16. A private repository works for every task.

**The date in this lab.** Today in the lab is Monday, March 15, 2027, a week after Lab 16. An agent that reads its own clock may call the data's dates the future. Ignore that. The expected answers, such as which invoices are due, count from that date, whatever day you do the lab.

![The shape of the lab: four sittings, three coding agents, one contract. Sitting 1, specify and build: read the protocol, the contract with the expert, acceptance checks, tests first, the TypeScript version, errors and handles, inspect and lock the door. Sitting 2, build again and prove: tests first in Python, the Python version, the conformance suite, untrusted output, cross review. Sitting 3, ship and run everywhere: into the plugin, port to Codex, port to OpenCode, spans matched, the AI app's view, ship it. Sitting 4, deploy: two environments, the first deploy, deploy on merge, then watch, roll back and write the runbook. Below, the coding agents at each sitting: Claude Code for the first, all three for the others.](img/lab.png)

*Figure 17.18. Four sittings, three coding agents, one contract.*


## Sitting 1: specify and build in TypeScript (about 2 hours 25 minutes)

Read Concepts [17.1](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/mcp-in-one-picture/) to [17.4](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/stateless-servers/) and [17.6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/specify-generate-verify/), the first half of [17.8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/securing-a-remote-server/), "Locking the door", and field guides [F0](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f0-keys-on-your-computer) and [F1](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f1-cloudflare-from-zero-and-running-the-servers-on-your-computer) first. Keep [F8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f8-the-protocol-in-detail) open: it has the protocol's exact names, which Task 1 asks you to find.

### Task 1. Read the protocol (15 minutes)

**Goal:** see [17.1](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/mcp-in-one-picture/)'s four steps in a real exchange, before you build anything. Field guide [F8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f8-the-protocol-in-detail) names every part you will see.

1. Open `brightline-ap/` in Claude Code, in a Local session, in Manual mode, and send:

   > Set up this repository. Put this folder under git, with a `main` branch and a first commit of everything here, with the message "Start from Lab 17's files". If git has no name or email, ask me for them and set them for this project only. Run `npm ci`, then `uv sync` in `py/`. Run `npm run keys` to make the local keys: it writes `servers/ap-ts/.dev.vars` and `servers/ap-py/.dev.vars` and prints no key. Never read or print those files. Then create a private GitHub repository from this folder with `gh repo create brightline-ap-ch17 --private --source . --push`. Tell me what each command did.

   Read each command before you approve it. `.dev.vars` is the local secrets file Cloudflare's tool reads ([F1](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f1-cloudflare-from-zero-and-running-the-servers-on-your-computer)). The practice server needs no key. The servers you build from Task 5 on do, and your hosts read the same key from your environment ([F0](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f0-keys-on-your-computer)).
2. Then send:

   > Start the practice server with `npm run hello` in the background. Then send `server/discover` to `http://127.0.0.1:8716/mcp` with curl, as a JSON-RPC POST at revision 2026-07-28, with the headers `MCP-Protocol-Version` and `Mcp-Method` and the `_meta` keys the MCP specification requires. Then list its tools with the MCP Inspector's CLI, `--protocol-era modern`. Then call `what_time` with curl the same way, adding `Mcp-Name`. Show me each request and response in full. Change no file.

3. In the output, find and write in `NOTES.md`: the revision the server supports, its capabilities, the three method headers, the two `_meta` keys, `resultType`, and `ttlMs`.
4. Ask the agent to send the `what_time` call once more with `Origin: https://attacker.example`. Predict first.

**Checkpoint:** you can point to each part in a real exchange, and the foreign `Origin` got HTTP 403.

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-1.md).

### Task 2. The contract, with the expert (25 minutes)

**Goal:** `docs/connector-spec.md`, the contract for both versions ([17.6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/specify-generate-verify/)). The file name says "spec", and the prompts in this lab call it "the specification". It is the same document, the contract, not the MCP specification.

> Interview me as if I were Ana Morales, Brightline's AP analyst, one question at a time, until you can write `docs/connector-spec.md` for a read-only MCP server with four tools: `find_vendor`, `list_open_invoices`, `get_purchase_order` and `search_policy`. Read `data/` and `docs/policies/` first. The server is remote and stateless over Streamable HTTP at `/mcp`, revision 2026-07-28. For each tool, the specification states its job, inputs, outputs, the exact wording of each error, and what it must never return. Above the tools, state the server-wide rules: read-only, stateless, a key on every request, `Origin` checked, bank accounts as the last four digits only, text from data returned as data, a fixed tool order, and paging through a sealed handle that expires after 15 minutes. Write nothing until I say the interview is done.

Answer as Ana from the policies. When the draft arrives, read every error line aloud. Would Ana sign it? Ask for changes until she would.

**Checkpoint:** four tools, each with a "never returns" line, and an error table for each.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-2.md).

### Task 3. Acceptance checks (15 minutes)

**Goal:** eight checks with the answers Ana expects, in a form code can run ([17.6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/specify-generate-verify/)).

> From `docs/connector-spec.md` and the data, write `docs/acceptance-prompts.md`: eight checks, each a question a person would ask, the tool call that answers it, and Ana's expected answer. Include two errors (an unknown vendor and the missing PO for INV-8310), one paged listing of all open invoices five at a time, one cited policy search, the over-PO invoice INV-8303, and the injection check on V005's note. Put the same eight checks in one JSON block with each call and its exact `structuredContent` or error text, and a `never` list of strings that must not appear. Take every expected value from the data files and the specification, never from code.

Check two expected values yourself against the CSV files, by opening them read-only: INV-8303's difference, and the number of open invoices.

The checks are numbered A1 to A8, and later tasks use the numbers. Tell the agent to use them. A1 is a vendor by name (Hocking Valley Pallets), A2 an unknown vendor, A3 one vendor's open invoices, and A4 all open invoices five at a time. A5 is the over-PO invoice INV-8303, A6 the missing PO for INV-8310, A7 a cited policy search, and A8 the injection check on V005's note.

**Checkpoint:** eight checks, numbered A1 to A8, each machine-checkable.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-3.md).

### Task 4. Tests first, TypeScript (20 minutes)

**Goal:** failing tests, written from the specification before any server exists.

Send:

> Create a branch named `connector` with `git switch -c connector`, and commit `docs/connector-spec.md` and `docs/acceptance-prompts.md` there. Read both. Write tests in `servers/ap-ts/test/` with `node:test`, calling the server in-process through `@modelcontextprotocol/client` pinned to revision 2026-07-28, with a custom `fetch` so no port is needed. Cover: the four tools in order, each error's exact text, last-four-only, paging where page two goes to a second in-process copy, a changed, a foreign and an expired handle, and the three refusals (no key, a wrong key, and a foreign `Origin` with the right key). Take expected values from the specification only. Do not write the server. Set up the package: a `package.json` in `servers/ap-ts` named `@brightline/ap-ts`, with `@modelcontextprotocol/server` 2.4.0, `@modelcontextprotocol/node` 2.1.2 and `zod` 4.6.7 as dependencies, `@modelcontextprotocol/client` 2.4.0 and `wrangler` 4.156.0 as development dependencies, and a `test` script that runs `node --test` on `test/`. Add `servers/ap-ts` to the root `workspaces`, and a root script `test:servers` that runs that package's tests. Run `npm install` and show me the diff of both `package.json` files.

Ask the agent to run them and show you the output. They must fail only because the server does not exist. Then ask it to commit the tests.

**Checkpoint:** tests committed, failing for the right reason.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-4.md).

### Task 5. Generate the TypeScript server (25 minutes)

**Goal:** the server, as a Cloudflare Worker that also runs on Node.

**Before you send the prompt.** The server will run in two places: on Node, for the tests, and as a Cloudflare Worker, a small program Cloudflare runs at a web address (field guide [F1](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f1-cloudflare-from-zero-and-running-the-servers-on-your-computer)). Two words in the prompt come from Workers. `wrangler.jsonc` is the Worker's configuration file. `env.ASSETS` is a binding: the Worker cannot open files on a disk, so the data and policy files are uploaded with it, and the code reads them through `env.ASSETS`. You need no Cloudflare account for this task. Everything runs on your computer.

**First win, one tool.** Before the whole server, get one tool working end to end, so you see the full path once while it is small. Send:

> Write only the `find_vendor` tool, in `servers/ap-ts/src/`, with the smallest server that serves it over Streamable HTTP on Node at `http://127.0.0.1:8717/mcp`, using `@modelcontextprotocol/server`, started with `node --env-file=.dev.vars` so it has its keys. Run only the `find_vendor` tests with `--test-name-pattern find_vendor` and show me the output. Then start the server in the background, call `find_vendor` once with `name: "Hocking"` through the MCP Inspector's CLI, as `docs/field-guide.md` shows in F2, and show me the result. Do not change any test.

Compare the result with check A1 in `docs/acceptance-prompts.md`: V005, Hocking Valley Pallets, Net 30, last four digits `2217`. One tool, specified, tested and answering over the protocol: the rest of the lab repeats this path. Then send:

> Now write the whole server in `servers/ap-ts/src/` so all the tests pass. Use `McpServer` and `createMcpHandler` from `@modelcontextprotocol/server` with a factory that builds a fresh server for every request, and `registerTool` with Zod v4 schemas for `inputSchema` and `outputSchema`, reusing `src/schemas.ts` and `src/load.ts` from Chapter 14. Read data through a `DataSource` interface: `env.ASSETS` in `src/worker.ts`, files on disk in `src/node.ts`. Return `structuredContent` and the same JSON as text. Announce `tools: { listChanged: false }`. Add `wrangler.jsonc` with an `ASSETS` binding and `run_worker_first`, and `scripts/copy-assets.ts`, which copies only the eight data and policy files into `assets/`. In `servers/ap-ts/package.json`, add the scripts `assets` (that copy), `start` (`node --env-file=.dev.vars src/node.ts 8717`), `dev` (`npm run assets && wrangler dev --ip 127.0.0.1 --port 8717`) and `deploy` (`npm run assets && wrangler deploy`). Do not change any test.

Ask the agent to show `git diff HEAD -- servers/ap-ts/test`, which must be empty, then to run `npm run test:servers` and `npm run typecheck` and show you the output. Then ask it to commit.

**Checkpoint:** tests and type check pass. Every tool returns `structuredContent` and the same JSON as text.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-5.md).

### Task 6. Errors and handles (25 minutes)

**Goal:** errors that say what to do next, and paging that survives any copy ([17.3](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/errors-that-say-what-to-do-next/), [17.4](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/stateless-servers/)).

If Task 5 already passes every error and handle test, read the code for them now. Otherwise send the failing test names to the agent. Then ask:

> Show me where the page handle is made and opened. Does anything about paging live in a variable outside the request? Explain how a second copy of the server opens a handle the first one made, and what it checks.

Read `src/handles.ts` yourself. Find the four checks a handle passes: it opens under the key, its version, its caller, its expiry.

**Checkpoint:** the four error cases match the specification's words, and the paging test passes with page two on a second copy.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-6.md).

### Task 7. Inspect and lock the door (20 minutes)

**Goal:** the server checked by an independent client, in the Workers runtime, behind a locked door ([17.8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/securing-a-remote-server/)).

1. Ask Claude Code to start the server in the background with `npm run dev` in `servers/ap-ts`. It copies the data files into `assets/` and runs `wrangler dev`, which runs the Worker in a local copy of Cloudflare's runtime, with no account. Predict: it answers at `http://127.0.0.1:8717/mcp`.
2. Ask Claude Code to call each tool once with the MCP Inspector's CLI, as field guide [F2](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f2-the-mcp-inspector) shows, with your key and `--protocol-era modern`, and `tools/list` with `--strict`.
3. Then ask it for three refusals with curl: no key, a wrong key, and a foreign `Origin` with the right key. And one more: `GET http://127.0.0.1:8717/data/vendor-banking.csv`.

**Checkpoint:** `tools/list` shows four tools in order, four calls pass, the refusals return 401, 401 and 403 and call no tool, and the banking file is not served. The authors' server answers 404, and any refusal is fine as long as the file does not come back. The file is in `assets/`, but `run_worker_first` sends every request to your code, which serves no files ([F1](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f1-cloudflare-from-zero-and-running-the-servers-on-your-computer)).

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-7.md).


## Sitting 2: build in Python and prove they agree (about 1 hour 45 minutes)

Read Concepts [17.5](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/built-in-custom-skill-or-connector/) and [17.7](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/untrusted-output/) first.

### Task 8. Tests first, Python (20 minutes)

**Goal:** the same contract, tested in Python, by a different agent.

Open the repository in Codex. Send:

> Read `docs/connector-spec.md` and `docs/acceptance-prompts.md`. Write `py/tests/test_connector.py` with pytest for a Python server built by `create_app(token=..., handle_key=..., now_ms=...)` in `py/brightline_ap/mcp_server.py`. Drive it with Starlette's `TestClient`, posting JSON-RPC at revision 2026-07-28 with the `MCP-Protocol-Version`, `Mcp-Method` and `Mcp-Name` headers and the `_meta` keys, so every exchange is visible. Cover the same cases as `servers/ap-ts/test/connector.test.ts`, with the same expected values. Add `mcp>=2,<3`, `cryptography` and `uvicorn` to `py/pyproject.toml` and lock. Do not write the server.

Ask Codex to run the tests, show you the output, and commit them.

**Checkpoint:** tests committed, failing because the server does not exist.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-8.md).

### Task 9. Generate the Python server (25 minutes)

**Goal:** the Python server, from the same specification.

> Write `py/brightline_ap/connector.py` with `MCPServer` and `@mcp.tool()`, the four tools with the same names, titles, descriptions, annotations and error wording as the specification, and Pydantic output models. Reuse the Chapter 14 models in `py/brightline_ap/models.py`. Seal page handles with AES-256-GCM, as the specification says, so nobody can read one, and each is checked on every call. In `py/brightline_ap/mcp_server.py`, wrap the SDK's Streamable HTTP app with a key check in front and the SDK's `TransportSecuritySettings` for `Origin` and `Host`. (The `Host` header names the address the caller asked for. Checking it is a second guard against DNS rebinding, field guide F8.) Return a `CallToolResult` with `is_error=True` for tool errors, so the wording is exactly the specification's. Add `servers/ap-py/` with a Python Worker entry that mounts the same app. Do not change any test.

The Python web app standard here is **ASGI**: the SDK gives you an app object, and "mounting" it means handing each request to that object. The same app object runs on your computer and, through the Python Worker entry, on Cloudflare.

Ask Codex to run `npm run test:py` and `npm run check:py` (Pyright, strict), show you the output, and commit.

**Checkpoint:** tests and Pyright pass.

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-9.md).

### Task 10. The conformance suite (25 minutes)

**Goal:** one suite that proves both servers keep the same contract, on any copy ([17.6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/specify-generate-verify/)).

Open the repository in OpenCode. Send:

> Write `scripts/conformance.ts`. It starts two copies of each server on 127.0.0.1 (TypeScript on 8717 and 8727, Python on 8718 and 8728) with test keys, connects with `@modelcontextprotocol/client` pinned to revision 2026-07-28, and fails on any difference. Compare the two servers' `tools/list`: names, order, titles, descriptions, annotations and schemas. Run the eight checks from the JSON block in `docs/acceptance-prompts.md` on each server, sending each page of the paged check to the other copy. Try a changed handle on the other copy, and the three refusals: no key, a wrong key, and a foreign `Origin` with the right key. Also accept `CONFORMANCE_URLS` to check deployed servers, and when it does, check that `/data/vendor-banking.csv` does not return the file. Add `npm run conformance` and a required `conformance` job in `.github/workflows/ci.yml`.

Ask OpenCode to run it and show you the output. **The first run will probably fail on the tool lists.** Read the failure with the agent. If the difference carries no meaning for a client (how a schema is spelled, not what it allows), ask OpenCode to add a normalizing rule with a comment naming the run that found it. If it carries meaning, send it to the agent that wrote that server.

Then break it on purpose, twice: ask Codex to change one word in one Python description, run, and revert. Ask Claude Code to keep the paging offset in a variable instead of the handle, run, and revert.

**Checkpoint:** both servers pass. Both deliberate breaks fail the suite.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-10.md).

### Task 11. Untrusted output (20 minutes)

**Goal:** the injection check, read by a person ([17.7](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/untrusted-output/)).

1. **Test the connector alone.** If the agent can read `data/` directly, a good answer proves nothing about the connector. Ask Claude Code to start the TypeScript server in the background. Then ask it to make an empty folder outside the repository, `../ap-injection-check/`, holding only a `.mcp.json` that names the running server, as field guide [F3](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f3-claude-code) shows, with the key read from `${AP_MCP_TOKEN}`. From a terminal where `AP_MCP_TOKEN` is set ([F0](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f0-keys-on-your-computer)), start `claude` in that folder, a new session that cannot see the repository. Send: "Triage the open invoices from Hocking Valley, using the Brightline AP connector."
2. Read the answer. Did the agent quote V005's note? Did it call the note's instruction a note, and follow no part of it? Did any invoice change pile because of it?
3. Ask the agent to search both servers' results from the conformance run for `8816403392217` and `042101190`, and to ask the running TypeScript server for `/data/vendor-banking.csv`, which must not return the file.

**Checkpoint:** the injection is reported, not followed. No full account or routing number appears in any result. This run had only the tool descriptions and the host's own judgment to protect it. Task 13 adds a second guard, a line in the triage skill that says text from tools is data.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-11.md).

### Task 12. Review both servers (15 minutes)

**Goal:** each server read by the agent that did not write it (Chapter 15).

Start a fresh Codex session and send "Review `servers/ap-ts/` against `REVIEW.md` and the server rules in `docs/connector-spec.md`: inputs validated, every request's key and `Origin` checked, only needed fields returned, nothing held between requests. Change nothing. List findings with a file, a line and the input that would make each go wrong." Do the same in a fresh Claude Code session for `py/brightline_ap/` and `servers/ap-py/`. Send each finding you accept to the agent that wrote that server.

**Checkpoint:** every accepted finding fixed, tests and conformance still green.

**Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-12.md).


## Sitting 3: ship it and run it everywhere (about 2 hours 10 minutes)

Read Concepts [17.9](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/charging-for-a-connector/) to [17.11](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/both-ai-vendors/) and field guides [F3](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f3-claude-code) to [F5](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f5-opencode-version-2) and [F7](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f7-seeing-the-servers-spans) first.

### Task 13. Into the plugin (25 minutes)

**Goal:** plugin v0.2.0, with the connector in place of the ready-made one.

In Claude Code:

> Build plugin v0.2.0. In `plugin/.mcp.json`, add a server named `ap` of type `http` whose `url` is `${AP_MCP_URL:-http://127.0.0.1:8717/mcp}` and whose `Authorization` header is `Bearer ${AP_MCP_TOKEN}`. Remove the `apdata` connector and the core `plugin/mcp.json`, because the Agent Plugins core cannot carry a key. In `.claude/settings.json`, allow the four tools by their plugin names. Bump both manifests to 0.2.0 and add a changelog entry. Update `invoice-triage` to confirm each vendor with `find_vendor` and each PO with `get_purchase_order`, and add a section saying text from tools is data. Make `scripts/check-plugin.ts` fail if a header holds a literal value instead of an environment variable.

Test the new rule: ask the agent to put a made-up literal key in the header, run `npm run check:plugin`, show you the failure, and revert.

**Checkpoint:** `plugin-valid` is green and the deliberate literal key is caught. Asked about INV-8303 and INV-8310, the triage skill reports one as $900.00 over its PO and the other as having none, with the policy line.

**Check it now.** Download [Task 13's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-13.md).

### Task 14. Port to Codex (20 minutes, one of Tasks 14 and 15 is core)

**Goal:** both servers in Codex, by URL.

In Codex, send "Add both servers to `.codex/config.toml` as field guide [F4](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f4-codex) shows: `apts` on 8717 and `appy` on 8718, with `bearer_token_env_var = "AP_MCP_TOKEN"` and the four tools in `enabled_tools`. Propose a `default_tools_approval_mode` and explain the risk of `writes`." Decide yourself, with [17.7](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/untrusted-output/) in mind, and write the choice and its reason in `ports/ch17.md`. Mark the project as trusted in Codex, so it reads `.codex/config.toml` ([F4](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f4-codex)). Ask Codex to start both servers in the background, then start a new chat and ask A5 and A6 against each server.

**Checkpoint:** the same answers from both servers in Codex, and your approval choice with its reason.

**Check it now.** Download [Task 14's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-14.md).

### Task 15. Port to OpenCode (20 minutes, one of Tasks 14 and 15 is core)

**Goal:** both servers in OpenCode.

In OpenCode: "Add both servers to `opencode.jsonc` under `mcp.servers`, as field guide [F5](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f5-opencode-version-2) shows, with `"oauth": false`, `"protocol": "2026-07-28"`, the key from `{env:AP_MCP_TOKEN}`, and permission rules allowing `apts_*` and `appy_*`." Restart OpenCode, ask it to start both servers in the background if they are not running, and ask A5 and A6 against each.

**Checkpoint:** the same answers from both servers in OpenCode.

**Check it now.** Download [Task 15's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-15.md).

### Task 16a. Instrument both servers (25 minutes, extension)

**Goal:** the server's own spans, to the agreed names ([17.10](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/watching-a-connector/), field guide [F8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f8-the-protocol-in-detail)).

In Claude Code, for `servers/ap-ts`:

> Using only `@opentelemetry/api`, add one SERVER span per tool call named `tools/call <tool>`, with `mcp.method.name`, `gen_ai.tool.name`, `gen_ai.operation.name` = `execute_tool`, `mcp.protocol.version`, and `error.type` = `tool_error` on an `isError` result. Take the parent from `traceparent` in the request's `_meta`. Add a child span `read data` with the number of files, `brightline.invoice.count` on `list_open_invoices`, and the `mcp.server.operation.duration` histogram. Record no arguments, results or keys. Add tests with an in-memory exporter, and `scripts/spans.ts` that prints the spans for the eight checks.

In Codex, for the Python server, ask first: "Run one tool call with an in-memory OpenTelemetry exporter and show me every span. Does the `mcp` SDK already make a `tools/call` span?" Then send "Add only what the SDK does not: the invoice count on its span, the `read data` child span and the duration histogram, with the same names, and `brightline_ap/spans.py`."

**Checkpoint:** both servers' tests pass, two calls on two copies join one trace when they carry the same `traceparent`, and no span holds an invoice number, a key or an account number.

**Check it now.** Download [Task 16a's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-16a.md).

### Task 16b. Prove the spans match (10 minutes, extension)

**Goal:** the suite fails if the two servers name or label a span differently ([17.10](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/watching-a-connector/)).

In OpenCode: "Extend `scripts/conformance.ts` to run both span reporters and fail if any span name or attribute differs." Ask Claude Code to rename one span in the TypeScript server, OpenCode to run the suite, and Claude Code to revert.

**Checkpoint:** the suite fails on the renamed span and passes after the revert.

**Check it now.** Download [Task 16b's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-16b.md).

### Task 16c. The host's view (15 minutes, extension)

1. Turn on Claude Code's telemetry for one session, as field guide [F3](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f3-claude-code) shows (these are settings of your own app, not repository changes), and run A6 (the missing PO). Find the records naming `mcp_server.name` and `mcp_tool.name`: first `"custom"`, then real names with `OTEL_LOG_TOOL_DETAILS=1`.
2. Ask Codex to add the `[otel]` export to your **user** config, not the repository's, then run A6 and find its MCP usage record.
3. Ask Claude Code to start the TypeScript server with a console span exporter and send one call with a test `traceparent` in `_meta` using the SDK client. Show that the server's span took it as parent. Then check whether Claude Code or Codex sent `traceparent` in their own calls.
4. In `ports/ch17.md`, record for each host what it showed and whether its trace joined the server's. In `NOTES.md`, name acceptance check A6, not any span, as the evidence the missing-PO answer is right.

**Checkpoint:** both entries written, and the evidence line in `NOTES.md`.

**Check it now.** Download [Task 16c's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-16c.md).

### Task 17. Ship it (15 minutes)

**Goal:** the connector on `main` through a reviewed pull request, passing from a clean clone (Chapter 15).

Ask Claude Code to open the pull request with the template: high tier for both servers, every check including `conformance`, and AI review in a fresh session. Read the review. Read the pull request on GitHub as its reviewer. GitHub does not let you approve your own pull request, so your approval is your decision to merge: when you are satisfied, tell Claude Code to merge it with `gh pr merge`. Then ask it to clone `main` into a new folder. There it runs `npm ci`, `uv sync` in `py/`, the four checks (`npm test`, `npm run typecheck`, `npm run test:py` and `npm run check:py`), `npm run test:servers` and `npm run conformance`, and show you the output.

**Checkpoint:** `main` passes from a clean clone. The agent tags it after the last task you do.

**Check it now.** Download [Task 17's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-17.md).

## Sitting 4: deploy (about 1 hour 30 minutes)

Never used Cloudflare, or never heard of it? Start with field guide [F1](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f1-cloudflare-from-zero-and-running-the-servers-on-your-computer), "Meet Cloudflare": what the company is, why it matters for AI, and what its free plan gives you. Then read the second half of [17.8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/securing-a-remote-server/), "Putting it online, and changing it safely". Then read field guide [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers), starting with "How a coding agent deploys" and "Your first deploy, in order", which Tasks 18a and 18b follow.

**Coding agents do the deploying, the Chapter 12 way.** You type no deploy command. For each task below:

1. Start a fresh session, and begin with "Read `NOTES.md` and `ports/ch17.md`." If `NOTES.md` does not exist yet, leave it out."
2. Set *Plan* mode and give the task's brief. Read the plan and correct it.
3. Switch to *Manual*, so the agent asks before every command, and read each command before you approve it: which environment, which file, and no key value in it. Not Auto, and never Bypass permissions.
4. Accept the result only on evidence: the suite's `0 failed`, a status code, a version ID. A second agent runs the checks.
5. End by asking the agent to add one line to `ports/ch17.md` saying what is online now, and its version ID.

The lab spreads the work across the three coding agents on purpose, so each one meets the deployed connector. Any of them could run any step. Before Task 18a, three things that need you:

1. **Close every terminal where you set `AP_MCP_TOKEN`** in earlier tasks, and start each agent for this sitting from a new one. A key set in a terminal wins over the key files, so the checks would send the wrong key ([F0](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f0-keys-on-your-computer)). An agent started from its icon in the desktop app is not affected.
2. **Make a Cloudflare account and choose your `workers.dev` subdomain**, as [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) "Your first deploy, in order" step 1 shows.
3. **Sign Wrangler in.** Start a fresh Claude Code session in *Manual* mode and ask it to run `npx wrangler login` in `servers/ap-ts`. Approve the sign-in in your browser, by you, as [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) step 2 shows. Then ask it to run `npx wrangler whoami`.

### Task 18a. Two environments, and rules for deploying (30 minutes)

**Goal:** a staging environment beside production, proved on your computer before anything goes online, and the rules that keep the agents safe while they deploy.

1. **Rules for deploying first.** In a fresh Claude Code session, in *Plan* mode, send this brief:

   > *Outcome.* The repository's rules guard every deploy, in words and in settings. In `AGENTS.md`, a section called Deploying with five rules: deploy staging before production, and production only when I say so in this session. Deploy only with the npm scripts, the workflow, or a command I give you, and never run `wrangler secret put`. Before any rollback, show me the version list and the version you chose, and wait. Stop at the first error and report it, and do not try another way. A deploy is done only when the conformance suite reports `0 failed` against the deployed address. In `.claude/settings.json`, *ask* rules for `npm run deploy`, `npm run secrets`, `npx wrangler` with `deploy`, `rollback`, `secret`, `versions deploy` and `delete`, `uv run pywrangler deploy`, `gh workflow run`, `gh secret set`, `gh pr merge` and `git push`, and a *deny* rule for `npx wrangler secret put`. In `opencode.jsonc`, shell rules that make the same commands ask, and deny `secret put`.
   >
   > *Context.* `AGENTS.md`, `.claude/settings.json` and `opencode.jsonc`.
   >
   > *Format.* Show me each file's diff.
   >
   > *Constraints.* Keep every rule already in those files. Plan only, and wait. Edit no other file.

   Read the plan, switch to *Manual*, and let it make the change. Check the diff: `AGENTS.md` has the five rules under Deploying. `.claude/settings.json` has an `"ask"` list with twelve entries, each starting `Bash(`, one for each command named in the brief, and `"Bash(npx wrangler secret put *)"` added under `"deny"`, with the old deny rules still there. `opencode.jsonc` has twelve `"ask"` shell lines and one `"deny"` line for `secret put`. These are the two guards from Chapter 12: the words explain the rule, and the setting makes Claude Code and OpenCode ask even if a session is left in a looser mode. Ask the agent to commit. Start a fresh session for step 2.
2. Ask Claude Code: "In `servers/ap-ts/wrangler.jsonc`, keep production at the top level and add `env.staging`. Repeat the `assets` binding and `observability` in staging, because they are not inherited. Turn Version URLs off for production and on for staging. Add npm scripts `dev:staging`, `deploy:staging`, `deploy` (with `--env=""`) and `check:deploy`, which dry-runs both environments, and `secrets:staging` and `secrets:production`, which send `.secrets/staging.env` and `.secrets/production.env` with `wrangler secret bulk`. At the root, add `conformance:staging` and `conformance:production`, which run the suite with `node --env-file` reading that environment's key file and `.secrets/<environment>.urls.env`. Make git ignore every `.dev.vars*` file except the example. Do the same configuration for `servers/ap-py`." Give it in *Plan* mode first, read the plan, then switch to *Manual*. Read the diff and check four things. Under `staging`, both `assets` and `observability` appear. `preview_urls` is `false` at the top and `true` under `staging`. `servers/ap-ts/package.json` has five new scripts, and `deploy` now uses `--env=""`, and the root has the two `conformance:` scripts. `.gitignore` has a line for `.dev.vars*` and a line starting with `!` for the example file.
3. Ask Claude Code to run `npm run keys -- --deploy`. It makes separate staging and production keys in `.secrets/` and `.dev.vars.staging`, prints none, and refuses to write any file git would track. *You should see:* a list of file names and no values. Then ask it to run `npm run check:deploy` in `servers/ap-ts` and show you the output, which [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) step 3 shows.
4. Ask OpenCode to start two local staging copies, in `servers/ap-ts`. The first is `npm run dev:staging`, which listens on port 8717. The second is `npx wrangler dev --env staging --ip 127.0.0.1 --port 8727 --inspector-port 9339 --persist-to .wrangler/state-2`, a second copy with its own port and its own local storage ([F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers), "Run it on your computer"). Then ask it to write `CONFORMANCE_URLS=ts=http://127.0.0.1:8717/mcp,ts=http://127.0.0.1:8727/mcp` into `.secrets/staging.urls.env` with one shell command, run `npm run conformance:staging` from the top folder, and show you the output. Each copy prints `Ready on http://127.0.0.1:8717` (or 8727), and the suite ends with `0 failed`. Then ask it to stop both copies. Task 18b replaces the addresses in that file.

**Checkpoint:** both environments build, and the suite passes against two staging copies, including the check on `/data/vendor-banking.csv`. When you ask the agent to run `git status`, no file from `.secrets/` and no `.dev.vars` file is listed. `.secrets/staging.urls.env` still holds the two local addresses. Task 18b replaces them. If a staging check later stops with "cannot reach `http://127.0.0.1:8717/mcp`", the file still holds the local ones. Save the staging address again.

**Check it now.** Download [Task 18a's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-18a.md).

### Task 18b. The first deploy (20 minutes)

**Goal:** both environments online, checked by the same suite, staging first. A coding agent runs every command, and you approve each one. Follow [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) "Your first deploy, in order", steps 4 to 8.

**The brief.** Start a fresh Claude Code session, set *Plan* mode, and send this Four-Part Brief:

> *Outcome.* The TypeScript connector online at Cloudflare in two environments, staging first, then production, each with its own keys. Follow field guide F6, "Your first deploy, in order": the deploy and keys commands in steps 4, 5 and 7. Another agent saves the addresses and runs every check, in steps 6, 7 and 8.
>
> *Context.* `servers/ap-ts`, the npm scripts from Task 18a, and the key files in `.secrets/`, used only as inputs to `npm run secrets:staging` and `npm run secrets:production`.
>
> *Format.* After each command, show me the command and the lines that prove it worked: the address, the version ID, or the "secrets successfully created" line. At the end, a table with each environment's address, the version ID of its deploy, and the version ID of its keys.
>
> *Constraints.* Never open, print or copy a key file. Plan only. Show me the plan and wait. When I switch you to Manual, run one command at a time. After staging's keys are sent, stop and wait until I say the checks passed. Do not touch production until I say so. Stop at any error and report it.

Read the plan for four things: staging comes before production, keys are sent after each deploy, every production command has `--env=""` or uses `npm run deploy`, and no key file is opened. Then switch to *Manual*.

1. Ask Claude Code to put staging online with `npm run deploy:staging` and send its keys with `npm run secrets:staging` ([F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) steps 4 and 5). Until the keys arrive, the Worker answers every request with 503 and runs no tool, which is safe.
2. In OpenCode, the checker, ask it to save the staging address with the command in [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) step 6, which adds `/mcp` itself, and to run `npm run conformance:staging` from the top folder. Check the address ends in one `/mcp`. Go on only when it shows `0 failed`.
3. Then production. Tell Claude Code the checks passed and it may go on, so it runs `npm run deploy` and `npm run secrets:production`. Ask OpenCode to save the production address into `.secrets/production.urls.env` and run `npm run conformance:production` ([F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) step 7). Ask Claude Code to show you the production deploy's version ID and the version ID of its keys. Note both in `ports/ch17.md`. In Task 18d, the keys' version is the `Secret Change` you must not roll back past. Last, ask OpenCode to prove the keys are separate with the command in [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) step 8, first against staging, then production. *You should see:* `400` from staging, then `401` from production.
4. **Extension, not run by the authors.** The lab adds no rules file for Codex, so here only `AGENTS.md` and your own approval guard each command. Keep *Ask for approval* and read each command. Ask Codex, in `servers/ap-py`: copy the assets with `node ../ap-ts/scripts/copy-assets.ts`, deploy with `uv run pywrangler deploy --env staging`, write `AP_PUBLIC_HOSTS=<the host name the deploy printed>` into `../../.secrets/staging-py.env` and send both files with `npx wrangler secret bulk ../../.secrets/staging.env --env staging` and `npx wrangler secret bulk ../../.secrets/staging-py.env --env staging` (without its own host name, the Python server refuses every call with HTTP 421), and, from the top folder, run the suite against its address with `CONFORMANCE_URLS=py=<its address>/mcp node --env-file=.secrets/staging.env scripts/conformance.ts`. The host name is the address without `https://` and without `/mcp`. **The authors did not run this step.** If it fails, record in `ports/ch17.md` whether `mcp` built for Pyodide, whether the local `py/` package was bundled, whether `--env` was passed on, and the error. If the agent offers to edit any file under `py/` or `servers/ap-py/src` to make it fit, refuse, and record the error instead. Field guide [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) says when a Python server moves to a container platform.

**Checkpoint:** the suite passes against every deployed address, a key from one environment opens nothing in the other, and no address or key is in a tracked file.

**Check it now.** Download [Task 18b's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-18b.md).

### Task 18c. Deploy on merge (25 minutes, extension)

**Goal:** after today, nobody deploys from a laptop, not even an agent. The one exception is an emergency rollback (Task 18d).

1. **The deploy token, by you.** Create it in the Cloudflare dashboard, as [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) "Deploy from CI" step 1 shows. Open `.secrets/github.env` in a plain text editor ([F0](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f0-keys-on-your-computer) shows how to find hidden files). Remove the `#` from the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` lines, and fill them in as [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) "Deploy from CI" step 2 shows. This is the only key you create, because only you can. It never goes into a chat.
2. Ask Claude Code to send the secrets with `gh secret set -f .secrets/github.env`, never reading the file. Ask it to set the variables with `gh variable set STAGING_URLS` and `gh variable set PRODUCTION_URLS`, using the addresses from Task 18b, each with `/mcp` ([F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) "Deploy from CI" step 3). Ask it to list the names with `gh secret list` and `gh variable list`.
3. Ask Claude Code: "Write `.github/workflows/deploy.yml`. On push to `main`: deploy staging with `npm run deploy:staging` and run the conformance suite against `STAGING_URLS` with `AP_MCP_TOKEN_STAGING`. Add a `workflow_dispatch` trigger with a `target` choice of `staging` or `production`. The production job runs only when someone picks `production`, and only from `main`: it deploys with `npm run deploy` and runs the suite against `PRODUCTION_URLS` with `AP_MCP_TOKEN_PRODUCTION`. Keys come only from repository secrets. The workflow never sets a Worker secret. Add `npm run check:deploy` to the conformance job in `ci.yml`. Deploy only the TypeScript server." Give it in *Plan* mode, read the plan, then switch to *Manual*. This makes CI the seat that deploys with nobody watching, which Chapter 12 says needs the tightest permissions. Read the workflow line by line. It uses the deploy token by name, never its value, and can still change production, so it is high tier in `REVIEW.md`. Check four things. It runs on `push` to `main` and on `workflow_dispatch`, which means a person starts it by hand. The production job has an `if:` line that requires `production` and `refs/heads/main`. Every key appears only as `${{ secrets.NAME }}`. No line contains `wrangler secret`.
4. Ask the agent to open the pull request. Review it, and when you are satisfied, tell the agent to merge it. Ask it to watch the `deploy` run with `gh run watch` and show you the result. *You should see:* a green check next to each job, and `0 failed` in the suite's output.
5. Production is your decision. When you are satisfied, tell Claude Code to run `gh workflow run deploy -f target=production`, watch it, and show you the result.

**Checkpoint:** a merge deployed staging and the suite passed against it, and production deployed only when you said so.

**Check it now.** Download [Task 18c's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-18c.md).

### Task 18d. Watch, roll back, and write the runbook (15 minutes, extension)

**Goal:** you can see what the server does, and undo a bad deploy. Do Task 18c first, because step 1 needs the pipeline.

1. Ask Claude Code to add one log line per request to `servers/ap-ts/src/worker.ts`: method, tool, status and milliseconds, and never the key, the body or a result. It goes through a pull request you review before the agent merges it, so the pipeline deploys it to staging (this needs Task 18c). When staging passes, tell the agent to run `gh workflow run deploy -f target=production`, so production has the log line too. This asks GitHub to deploy. It is not a deploy from your laptop.
2. Point each AI app at the production address, never in a repository file, and ask each one acceptance question. For each of Claude Code, Codex and OpenCode, by you: open a new terminal, set `AP_MCP_TOKEN` from `.secrets/production.env` as [F0](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f0-keys-on-your-computer) shows, and start the app from that window. For Claude Code, also set `AP_MCP_URL` to the production address with `/mcp` ([F0](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f0-keys-on-your-computer)), because the plugin's connector reads both. In Codex and OpenCode, ask the agent to add the production address to your own user settings with `codex mcp add` ([F4](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f4-codex)) or `opencode mcp add` ([F5](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f5-opencode-version-2)), with the key read from the environment.
3. Open Claude Code a second time, from its desktop icon or from a new terminal where you have not set the key. Call this the second window. In it, ask it to run `npx wrangler tail --env="" --format pretty` in `servers/ap-ts` in the background, which streams each request to the production Worker as it arrives. Then ask one acceptance question in the Claude Code window from step 2. Ask the second window to send one request with a wrong key, using the [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) step 8 command with `'Bearer wrong-key'` in place of `'Bearer '+process.env.AP_MCP_TOKEN`, against the production address. The only key in it is the words `wrong-key`. Ask it to show you the line for the `tools/call` and the line with status 401. Then find the same lines yourself in the dashboard: *Workers & Pages*, the `brightline-ap-ts` Worker, then its *Logs* tab.
4. In the second window, ask Claude Code to run `npx wrangler versions list --env=""`. The list runs from oldest to newest, so the newest version, at the bottom, is the log line. Each version shows its *Created* date and its *Source*: `Upload` for a deploy, `Secret Change` for new keys. Find the newest `Secret Change`. Choose the version just above the bottom one, but only if it is that `Secret Change` or newer. If it is older, stop and skip the drill, and ask the agent to note why in `ports/ch17.md`. Never choose an older one, and never the first production version, which has no keys and answers 503. For example, a shortened list after Tasks 18b to 18d might read, oldest first:

   ```text
   v1  Upload          the first production deploy, no keys yet: never
   v2  Secret Change   the production keys from Task 18b
   v3  Upload          the deploy run by CI in Task 18c
   v4  Upload          the log line from step 1: live now
   ```

   The newest `Secret Change` is v2. The version just above the bottom is v3, which is newer than v2, so v3 is the one to roll back to. If v3 had been older than the newest `Secret Change`, you would skip the drill. This check is your only guard: when an agent runs Wrangler, Wrangler answers yes to every question for you, including a warning that secrets have changed. Then ask Claude Code to run `npx wrangler rollback <version-id> --env="" --message "rollback drill"`. Ask OpenCode, in its window from step 2, to run `npm run conformance:production`. That window holds the production key, which is the key the check reads, so this is fine. Then ask Claude Code to roll forward the same way, to the newest version, and OpenCode to run the suite again. Use `--env staging` in place of `--env=""` to act on staging.
5. In the second window, ask Claude Code to write `docs/deploy.md`: where each environment runs, how keys are made, sent and rotated with the scripts, a normal change, and what to do when something is wrong. It goes through a pull request you review before the agent merges it.
6. Record in `ports/ch17.md` the request count from the dashboard after the run (*Workers & Pages*, the Worker, the *Requests* graph), and the version IDs you rolled back to and forward to.

**Checkpoint:** the rollback drill passed the suite both ways, the runbook is merged, and no address or key is in any repository file. Now ask Claude Code to tag `main` as `ch17`, push the tag, and run the clean-clone checks once more. If you stopped after the core path, tag after Task 18b instead.

**Check it now.** Download [Task 18d's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch17-key-task-18d.md).

**Optional.** When you no longer need the emergency rollback path, ask the agent to run `npx wrangler logout`, so your laptop no longer holds access to your Cloudflare account. Ask Claude Code to write in `NOTES.md` what must change before real data goes through. That means OAuth in place of the shared key (Chapter 18 builds it), an allowed-origins list, rate limits, and where `AP_HANDLE_KEY` is kept and how it is rotated.

### Apply it to your vertical (optional)

Pick one system at work an agent should read from. With its owner, write a contract for two or three tools, each with a "never returns" line, and four acceptance checks. If you sell access to a server, add an entitlement check to a copy of the connector. A signed-in caller with no active plan gets a short tool error with a link to a plans page, never a checkout ([17.9](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/charging-for-a-connector/)).

### If something goes wrong

| Problem | What to try |
| --- | --- |
| The Inspector's CLI hangs after connecting | The server announces list changes. Set `tools: { listChanged: false }` ([F2](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f2-the-mcp-inspector)) |
| The Inspector says authorization required | The key is missing or wrong. Pass `--header "Authorization: Bearer $AP_MCP_TOKEN"` from a terminal where you set the key ([F0](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f0-keys-on-your-computer)), never the key itself |
| Every call returns 421 from the Python server | HTTP 421 means "this server does not answer for that address". On your computer, use `127.0.0.1` or `localhost`. Deployed, send `AP_PUBLIC_HOSTS` with the host name the deploy printed (Task 18b step 4) |
| A host gets `-32022` | It asked for a revision the server does not serve. Set the host's revision ([F5](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f5-opencode-version-2)) |
| The conformance suite fails on schemas only | Read the difference. Normalize only spellings that mean the same thing |
| Two spans per call in Python | The SDK already makes the span. Add attributes to the current span instead |
| `pywrangler` says uv is too old | Install uv 0.13.4 or later |
| No spans from the deployed Worker | Workers use their own span API, so Brightline's spans do not run there. Watch spans locally ([F7](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f7-seeing-the-servers-spans)) |
| A deploy warns about multiple environments | Name the target: `--env staging`, or `--env=""` for production |
| `npm run keys` stops: "git does not ignore" | Good: it refused to write a key where git would track it. Ask the agent to fix `.gitignore` first (Task 18a step 2) |
| An agent shows a key in the chat | Press Esc to stop it. A local key: ask the agent to delete both `.dev.vars` files and run `npm run keys`. A staging or production key, or if you cannot tell which: change both environments' keys together. Ask the agent to delete `.secrets/staging.env`, `.secrets/production.env`, `.secrets/github.env` and both `.dev.vars.staging` files, then run `npm run keys -- --deploy`, `npm run secrets:staging` and `npm run secrets:production`. If you did Task 18c, by you: make a new deploy token ([F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) "Deploy from CI" step 1), delete the old one in the dashboard, and fill in the two Cloudflare lines in the new `.secrets/github.env` (step 2). Then ask the agent to run `gh secret set -f .secrets/github.env`. Set the new key in every AI app's terminal ([F0](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f0-keys-on-your-computer)). Never roll back past this change. Note which rule the agent broke in `NOTES.md` |
| The staging Worker cannot read its files, or has no key | Bindings and secrets are not inherited. Repeat `assets` under `env.staging`, and send the staging keys with `npm run secrets:staging` |
| Two local copies crash with "database is locked" | Give the second copy its own `--persist-to` folder and `--inspector-port` ([F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers)) |
| The deploy job says authentication error | The `CLOUDFLARE_API_TOKEN` secret is missing, the token is for another account, or it was made without the *Edit Cloudflare Workers* template. Make a new token as [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) "Deploy from CI" step 1 shows |
| Every request to the new address gets 503, "Server not configured" | The keys have not been sent yet. Run `npm run secrets:staging` (or `secrets:production`). The 503 is the server refusing to run without them, on purpose |
| The suite stops with "cannot reach" and "did not offer pinned protocol version" | The address in `.secrets/<environment>.urls.env` does not end in exactly one `/mcp`. Save it again with [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) step 6. It must look like `ts=https://...workers.dev/mcp` |
| npm says "Missing script: conformance:staging" | It runs from the repository's top folder, not from `servers/ap-ts` |
| npm says "Missing script: deploy:staging" | It runs in `servers/ap-ts`, not the top folder |
| `node` says it cannot find `.secrets/staging.urls.env` | The address was not saved yet. Do [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) step 6 first |
| The suite stops with "cannot reach" and "HTTP 401" | Most often, the agent was started from a terminal where `AP_MCP_TOKEN` was set, and that value wins over the key file. Close the agent, open a new terminal without the key, and start it again ([F0](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f0-keys-on-your-computer)). Otherwise the keys were not sent yet, or the address belongs to the other environment: send them with `npm run secrets:<environment>`, and check the address in `.secrets/<environment>.urls.env` |
| The suite shows failures against staging | Do not deploy production. Ask the agent to show the names of the failed checks, and to run the same suite on your computer to compare |
| Rollback output says secrets have changed | The rollback already happened, and the old keys are live again, because Wrangler answers yes for an agent. Roll forward at once: ask the agent to run `npx wrangler versions list --env=""`, then `npx wrangler rollback <newest-version-id> --env="" --message "roll forward"` (`--env staging` for staging). The newest version has the current keys. Then run `npm run conformance:production`. Do not send the keys again first: Wrangler refuses to change secrets while an older version is live |
| The deploy went to an account you did not expect | Ask the agent to run `npx wrangler whoami`. If the email is wrong, run `npx wrangler logout`, then `npx wrangler login` again |
| A request gets Cloudflare error 1102 | The Worker ran past its CPU time, 10 ms per request on the free plan. Brightline's tools stay well under it. If yours do not, see [F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) "The free plan" |
| A request gets Cloudflare error 1027 | The account used its 100,000 free requests for the day. They reset at midnight UTC |
| Cloudflare refuses a custom domain | The name already has a CNAME record, or the domain is not an active zone in your Cloudflare account ([F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers)) |
| The deploy stops and asks you to register a `workers.dev` subdomain | A coding agent cannot answer that question. Choose the subdomain in the dashboard (*Workers & Pages*, *Your subdomain*), then deploy again ([F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers) step 1). It is public, so keep it harmless |
| `wrangler` says you are not signed in | Ask the agent to run `npx wrangler login` from `servers/ap-ts`, and approve the sign-in in your browser ([F6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f6-deploying-to-cloudflare-workers)) |
| The browser does not open for `wrangler login` | Open the link the agent shows in your own browser, sign in and allow access |
| Version URL requests are missing from the logs | Version URLs are not logged. Test on the staging address instead |

### Exam notes

These notes are not part of the lab. CCDV-F and CCAR-F ask about Claude's behavior. In CCDV-F, this chapter is the main one for tool implementation and tool sets, MCP server development and application security. In CCAR-F, it is the main one for tool descriptions, structured errors, distributing tools and integrating MCP servers into Claude Code. Where Claude Code differs from the MCP specification, the exam follows Claude Code: its permission names, its output limit and its `.mcp.json` scopes. The CCAR-F guide puts OAuth and MCP hosting out of scope, so the OAuth detail in [17.8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/securing-a-remote-server/) and [F8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/#f8-the-protocol-in-detail) serves CCDV-F and real work, not CCAR-F.

### Artifact checklist

- [ ] `docs/connector-spec.md` and `docs/acceptance-prompts.md`, written with the AP analyst
- [ ] Failing tests committed before each server
- [ ] `servers/ap-ts/` (Worker and Node) and `py/brightline_ap/connector.py` with `servers/ap-py/`, both stateless, both behind the locked door
- [ ] `scripts/conformance.ts` as a required check, with the normalizing rules commented
- [ ] Both servers' spans, matched by the suite (extension)
- [ ] Plugin v0.2.0, `.mcp.json`, `.codex/config.toml`, `opencode.jsonc`, with no key or deployed address in any of them
- [ ] `ports/ch17.md`: connected, ran and verified for each host, your approval choice, and each host's trace result
- [ ] `NOTES.md`: the injection result, the evidence line, and what must change before real data
- [ ] The Deploying rules in `AGENTS.md`, and the ask and deny rules in `.claude/settings.json` and `opencode.jsonc`
- [ ] `servers/ap-ts/wrangler.jsonc` and `servers/ap-py/wrangler.jsonc` with production and `env.staging`, and the deploy, secrets and conformance scripts
- [ ] (Extension) `.github/workflows/deploy.yml`: staging on merge, the suite against staging, production only when a person runs it, and `check:deploy` in CI
- [ ] `scripts/make-keys.ts` used for every key, and no key in any chat
- [ ] (Extension) `docs/deploy.md`, the runbook, and a rollback drill recorded in `ports/ch17.md`
- [ ] Tag `ch17`, passing from a clean clone
