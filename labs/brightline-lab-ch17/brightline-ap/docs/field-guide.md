# Field guide: connectors, product by product

Chapter 17 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Field guide: connectors, product by product](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/field-guide-connectors/), so you can do the lab without the book.

The exact commands and settings that Concept [17.11](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/both-ai-vendors/) summarizes and [Lab 17](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/lab/) uses, and, in [F8](#f8-the-protocol-in-detail), the protocol's exact names and rules. Checked on each owner's own pages on November 1, 2026, and run by the authors where marked **ran**. If a step does not match what you see, check the linked page and note the difference in `ports/ch17.md`. **Who runs these commands:** a coding agent, in a Local session in Manual mode, as [Chapter 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/overview/) taught, and you approve each one after reading it. The few steps only you can do are marked **by you**: making accounts, approving a sign-in in your browser, creating the deploy token, setting the key your AI apps read in a terminal ([F0](#f0-keys-on-your-computer)), and deciding when to merge and when to deploy production.

**What is in it.**

| Section | Use it when |
| --- | --- |
| [F0](#f0-keys-on-your-computer). Keys on your computer | Before Task 1, to make and hold the keys safely |
| [F1](#f1-cloudflare-from-zero-and-running-the-servers-on-your-computer). Cloudflare from zero | Before Task 1. The words, what a Worker looks like, and how to run each server on your computer |
| [F2](#f2-the-mcp-inspector). The MCP Inspector | To call a server by hand |
| [F3](#f3-claude-code) to [F5](#f5-opencode-version-2). Claude Code, Codex, OpenCode | To connect each AI app to the connector |
| [F6](#f6-deploying-to-cloudflare-workers). Deploying to Cloudflare Workers | Sitting 4. Start with "Your first deploy, in order" |
| [F7](#f7-seeing-the-servers-spans). Seeing the server's spans | Tasks 16a to 16c |
| [F8](#f8-the-protocol-in-detail). The protocol in detail | When a task or an error names an exact protocol term |

### F0. Keys on your computer

Two values, never in the repository: `AP_MCP_TOKEN`, the shared key every request carries, and `AP_HANDLE_KEY`, the 32-byte key that seals page handles. Nobody types them, and no coding agent sees them. The agent runs:

```bash
npm run keys                 # servers/ap-ts/.dev.vars and servers/ap-py/.dev.vars
npm run keys -- --deploy     # also .secrets/ (staging, production, github) and both servers' .dev.vars.staging
```

`scripts/make-keys.ts` makes 32 random bytes per key, writes them only into files git ignores, refuses to write anywhere git would track, never overwrites a file, and prints file names, never values. Later commands read the keys straight from these files, so the keys never pass through the chat. `AGENTS.md` forbids an agent to read, print or copy them, and `.claude/settings.json` denies Claude Code's file reads of them. Those two guards stop an agent that follows its rules. They are not a lock, so watch for a key in any agent's output, and make new keys if one appears. **Ran.**

**Two roles for one AI app.** Claude Code plays two roles in this lab. As your coding agent, it runs commands you approve. Start it from its desktop icon, or from a terminal where you have not set a key. As an AI app that calls the connector, it needs the key. Only for that role, in Tasks 11, 13 to 16c and 18d, start it from a terminal where you set the key, as shown below. Codex and OpenCode work the same way.

**Where you handle a key yourself.** Two places, and only these, both **by you**. One is the Cloudflare deploy token ([F6](#f6-deploying-to-cloudflare-workers), "Deploy from CI"). The other is the key your AI apps use. Claude Code, Codex and OpenCode read `AP_MCP_TOKEN` from their own environment when they connect to a server, so you set it in a terminal window and start the AI app from that same window. The agent cannot do this, because it must never see the key.

Ask the agent for the full path of the repository folder. Open the Terminal app (on Windows, PowerShell). Type `cd`, a space and the path in double quotes, such as `cd "/Users/ana/brightline-ap"`, and press Enter. Then type one line. It reads the key straight from the file, so the key never appears on screen, in the chat or in your shell's history.

For the servers on your computer:

```bash
# macOS and Linux
export AP_MCP_TOKEN="$(grep '^AP_MCP_TOKEN=' servers/ap-ts/.dev.vars | cut -d= -f2-)"
```

```powershell
# Windows PowerShell
$env:AP_MCP_TOKEN = ((Select-String '^AP_MCP_TOKEN=' servers/ap-ts/.dev.vars).Line -split '=', 2)[1]
```

For the deployed production server, type this instead:

```bash
# macOS and Linux
export AP_MCP_TOKEN="$(grep '^AP_MCP_TOKEN=' .secrets/production.env | cut -d= -f2-)"
```

```powershell
# Windows PowerShell
$env:AP_MCP_TOKEN = ((Select-String '^AP_MCP_TOKEN=' .secrets/production.env).Line -split '=', 2)[1]
```

Nothing is printed. That is normal. To check it worked without showing the key, type `[ -n "$AP_MCP_TOKEN" ] && echo set || echo missing` (in PowerShell, `if ($env:AP_MCP_TOKEN) { 'set' } else { 'missing' }`). You should see `set`. Claude Code's plugin also reads **`AP_MCP_URL`**, the connector's full address ending in `/mcp`. Leave it unset for the server on your computer. For production, also type `export AP_MCP_URL='https://brightline-ap-ts.<your-subdomain>.workers.dev/mcp'` (in PowerShell, `$env:AP_MCP_URL = '...'`). Replace `<your-subdomain>`, including the `<` and `>`, with the name you chose in [F6](#f6-deploying-to-cloudflare-workers) step 1.

Then start the AI app from that same window, with `claude`, `codex` or `opencode`, for every task where an AI app connects to a server (Tasks 11, 13 to 16c and 18d). A desktop app opened from its icon may not see a variable set in a terminal. A terminal variable lasts only as long as that window. In a new window, set it again.

The key is now in that AI app's environment too, so the app could print it. `AGENTS.md` forbids that. Watch for a key in its output, and make new keys if one appears. **A key set in a terminal also wins over the key files.** A command such as `node --env-file=.secrets/staging.env` does not replace a variable that is already set. So for Sitting 4, close every terminal where you set `AP_MCP_TOKEN`, and start each agent from a new one where you have not set it. An agent started from its icon in the desktop app is not affected. The practice server (`npm run hello`) needs no key.

**Files whose names start with a dot are hidden.** `.dev.vars`, `.secrets/` and `.gitignore` do not show in Finder or File Explorer by default. You open one yourself in [F6](#f6-deploying-to-cloudflare-workers) "Deploy from CI" step 2, and again only if you make new keys (troubleshooting). To see them, ask the agent where the repository folder is on your computer, open it, and show hidden files: on a Mac, press Cmd+Shift+. (period) in Finder. On Windows, choose *View*, *Show*, *Hidden items* in File Explorer. Open the file with a plain text editor such as TextEdit or Notepad, never a word processor.

### F1. Cloudflare from zero, and running the servers on your computer

This section assumes you have never used Cloudflare, or even heard of it. Three words first: **CPU time** is the time a computer spends calculating, as opposed to waiting. **Telemetry traces** are timed records of each step a request took ([17.10](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/watching-a-connector/)). An **isolate** is explained under "The words you will meet" below. You need no account until Sitting 4. Everything before Sitting 4 runs on your computer. Checked November 2, 2026.

#### Meet Cloudflare

When you open a website, your request crosses the internet to a computer that holds the site and comes back with the page. Cloudflare is a company that sits in the middle of a large part of that traffic. It runs one of the world's largest networks of computers, in more than 300 cities in over 100 countries, and about one website in five puts Cloudflare in front of itself.[^cloudflare-network] Cloudflare then answers each visitor from a nearby city, keeps copies of pages so they load faster, and blocks attacks before they reach the site. Because so much of the web passes through its network, Cloudflare sees early how the web is changing.

Cloudflare also rents out that network to run your own code. That service is Workers, and it is where the Brightline connector goes online in Sitting 4.

#### Why Cloudflare matters in the AI era

Cloudflare has positioned itself as a major infrastructure and security company for AI. Its announcement of October 20, 2026 gives three figures.[^cloudflare-announcement] They are Cloudflare's own figures.

- **Massive developer adoption.** More than 10 million developers now build on Cloudflare's platform, up from 7.4 million the quarter before. Cloudflare links the surge to AI-native and agentic applications.
- **An explosion of AI agent traffic.** Daily requests from AI agents across Cloudflare's network grew by more than 1,700% in a year.
- **Machines now outnumber people online.** In 2026, for the first time, more than half of internet traffic was not human.

What this means for you: much of that agent traffic is AI apps calling tools, which is exactly what a connector answers. A connector on Workers runs on the same network that already carries and protects that traffic, close to whichever AI app calls it.

#### Why this book uses it

Four reasons, all about the lab:

1. **It costs nothing to learn on.** The free plan below is enough for this book, so nobody pays to finish the lab.
2. **It matches a stateless server.** A Worker keeps nothing between requests (below), which is the rule of [17.4](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/stateless-servers/), so the platform enforces what the chapter teaches.
3. **There is no server to look after.** No machine to rent, update or restart. You upload the code, and Cloudflare runs it in every city of its network.
4. **A coding agent can do all of it.** One command puts the server online, one sends its keys, and one checks it. So the agent runs each step and you approve it ([F6](#f6-deploying-to-cloudflare-workers)).

The principle in [17.8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/securing-a-remote-server/) names no platform. Any service that runs a stateless web program would do, and [F6](#f6-deploying-to-cloudflare-workers) says when a server should move to a container platform instead.

#### The free plan, in plain words

From Cloudflare's limits[^cloudflare-limits] and pricing pages,[^cloudflare-pricing] checked November 2, 2026.

| What | The free plan | What Brightline uses |
| --- | --- | --- |
| Price | Nothing | Nothing |
| Requests | 100,000 a day for the whole account, reset at midnight UTC | A few hundred during the lab |
| CPU time | 10 ms per request. That is time spent computing, not time waiting for files or the network | Each tool call needs far less |
| Memory | 128 MB for each running copy | A few MB |
| Workers | 100 per account | 2: production and staging (3 with the Python extension) |
| Secrets and variables | 64 per Worker, each up to 5 KB | 2 per Worker (3 for the Python extension) |
| Uploaded files | 20,000 per Worker, each up to 25 MiB | 8 |
| An address | A free subdomain of `workers.dev`, such as `ana-ap-lab.workers.dev` | One |
| Logs | 200,000 log lines a day, kept 3 days, until new log pricing starts on December 1, 2026 | A few lines per request |

- **When you go over.** Past 100,000 requests in a day, calls get Cloudflare's **error 1027** until midnight UTC. A Worker that keeps computing for more than 10 ms per request gets **error 1102**. Nothing is charged, and nothing breaks for good.
- **Static files.** Cloudflare serves uploaded files free and without limit when they are served directly. Brightline sends every request through its code first, so no file is ever served on its own ([F6](#f6-deploying-to-cloudflare-workers), "Static assets"), and every request counts toward the 100,000.
- **Not on the free plan.** Cloudflare's Containers.
- **The paid plan.** It starts at $5 a month per account. It includes 10 million requests a month, allows up to 5 minutes of CPU time per request (30 seconds unless you raise it), and keeps logs 7 days. You do not need it for this book.
- **A payment card.** Cloudflare's pricing page does not say whether the free plan asks for one. When you sign up in Sitting 4, note in `ports/ch17.md` whether it did.

#### The words you will meet

- Cloudflare is the company above. Its Workers service runs small programs for you at web addresses.
- The **dashboard** is Cloudflare's website for your account, at `dash.cloudflare.com`. You use it for the few steps only a person can do: making the account, choosing your subdomain, and making a deploy token. Everything else, a coding agent does from the command line.
- A Worker is one such program. You upload it, Cloudflare gives it an address, and whenever a request arrives, it runs your code on the machine nearest the caller, in a light sandbox called an **isolate** that starts very quickly and may be thrown away at any time.[^cloudflare-how-workers-works] So a Worker must never rely on anything kept in memory, which is exactly the stateless rule of [17.4](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/stateless-servers/).
- **Wrangler** is Cloudflare's command-line tool. In this repository it is a development package of `servers/ap-ts`, installed by `npm ci`, so you run it as `npx wrangler ...` from `servers/ap-ts`, or through the npm scripts. `wrangler dev` runs the Worker on your computer in a local copy of Cloudflare's runtime, with no account. `wrangler deploy` uploads it to Cloudflare, which needs an account ([F6](#f6-deploying-to-cloudflare-workers)).
- **`wrangler.jsonc`** is the Worker's configuration file, in JSON with comments. The fields Brightline uses:

| Field | What it means |
| --- | --- |
| `name` | The Worker's name, which becomes part of its address |
| `main` | The file whose `fetch` function answers requests (`src/worker.ts`) |
| `compatibility_date` | Which version of the runtime's behavior the Worker expects. Cloudflare keeps old behavior for old dates, so an update never breaks a Worker silently |
| `workers_dev` | `true` gives the Worker an address on `workers.dev` (below) |
| `preview_urls` | Whether a version not yet live gets its own public address, called a Version URL ([F6](#f6-deploying-to-cloudflare-workers)) |
| `assets` | A folder of files uploaded with the Worker (`directory`), the name the code uses for them (`binding`), and `run_worker_first`, which sends every request to the code, so no file is ever served directly |
| `observability` | Whether Cloudflare keeps the Worker's log lines ([F6](#f6-deploying-to-cloudflare-workers)) |
| `env` | Other environments, such as `staging`, each a separate Worker ([F6](#f6-deploying-to-cloudflare-workers)) |

- A **binding** is how a Worker reaches anything outside its code. The `fetch` function receives an `env` object, and each binding is a property of it: `env.ASSETS` for the uploaded files, and `env.AP_MCP_TOKEN` for a secret. Brightline reads a file with `env.ASSETS.fetch("https://assets.local/data/vendors.csv")`. The host name in that address is ignored, so any name works. Only the path matters.
- **`.dev.vars`** holds the secrets `wrangler dev` gives the Worker on your computer, one `NAME=value` per line, in the same folder as `wrangler.jsonc`. Once deployed, the same names come from secrets you set at Cloudflare ([F6](#f6-deploying-to-cloudflare-workers)).
- **`workers.dev`.** Every account gets one subdomain of its own, such as `ana-brightline.workers.dev`, and each Worker is reached at `<worker name>.<your subdomain>.workers.dev`. You choose the subdomain at your first deploy ([F6](#f6-deploying-to-cloudflare-workers)).[^cloudflare-workers-dev]
- **`.wrangler/`** is Wrangler's working folder in each server folder. It holds build output and a small local database that the local runtime keeps for platform features. Git ignores it.
- **Python Workers** run Python through **Pyodide**, Python compiled to **WebAssembly**, a compact program format that browsers and Workers can run. **`pywrangler`** is Wrangler's companion for Python, run with `uv run pywrangler`.

#### What a Worker looks like

The coding agent writes `servers/ap-ts/src/worker.ts`. This is it as it stands after the lab (Task 18d adds the log line in part 4), trimmed, with a note on each part.

```ts
export default {
  // 1. Cloudflare calls fetch once for every request that reaches the address.
  //    env holds the bindings: the uploaded files and the two secrets.
  async fetch(request: Request, env: Env): Promise<Response> {
    // 2. Fail closed: with a key missing, refuse everything. No tool runs.
    if (!env.AP_MCP_TOKEN || !env.AP_HANDLE_KEY) {
      return new Response("Server not configured", { status: 503 });
    }
    // 3. Build the connector for this one request. Nothing survives to the next,
    //    which is the stateless rule of 17.4.
    const connector = createConnector({
      token: env.AP_MCP_TOKEN,       // the access key callers must send
      handleKey: env.AP_HANDLE_KEY,  // seals page handles
      data: {                        // the data files, read through the binding
        read: async (path) => (await env.ASSETS.fetch(`https://assets.local/${path}`)).text(),
      },
    });
    // 4. The connector checks Origin and the key, then answers the MCP message.
    //    One log line records the method, the tool, the status and the time, never a key or data.
    return connector.fetch(request);
  },
};
```

`createConnector` is the same code the Node version uses, in `src/http.ts`. Only this small entry file is specific to Workers, which is why the connector could move to another platform without being rewritten. **Ran** locally: `npm run dev` prints `Ready on http://127.0.0.1:8717`, lists the bindings (`env.ASSETS`, and the two keys shown as `(hidden)`), then one line per request, such as `POST /mcp 401 Unauthorized` for a request with no key. A warning that the `Request.cf` object could not be fetched is harmless on your computer.

#### Running the servers

| Server | Command | Address |
| --- | --- | --- |
| Practice server | `npm run hello` | `http://127.0.0.1:8716/mcp` |
| TypeScript, Node | `cd servers/ap-ts && node --env-file=.dev.vars src/node.ts 8717` | `http://127.0.0.1:8717/mcp` |
| TypeScript, Workers runtime | `cd servers/ap-ts && npm run dev` | `http://127.0.0.1:8717/mcp` |
| Python | `cd py && uv run --env-file ../servers/ap-py/.dev.vars python -m brightline_ap.mcp_server 8718` | `http://127.0.0.1:8718/mcp` |
| Python, Workers runtime | `cd servers/ap-py && uv run pywrangler dev` | `http://localhost:8787/mcp` by default |

All bind to `127.0.0.1` only. `npm run dev` copies the eight data and policy files into `assets/` first, then runs `wrangler dev`. To stop a server, ask the agent to stop it. A second copy, used to prove the server remembers nothing between requests, runs on a port ten higher (8727 or 8728). A second Workers copy also needs its own `--inspector-port` and its own `--persist-to` folder, or the two copies fight over one local database: `npx wrangler dev --ip 127.0.0.1 --port 8727 --inspector-port 9339 --persist-to .wrangler/state-2`. The inspector port is for a debugger, and has nothing to do with the MCP Inspector ([F2](#f2-the-mcp-inspector)). **Ran**, except the Python Workers row, which the authors could not build ([F6](#f6-deploying-to-cloudflare-workers)).

### F2. The MCP Inspector

Version 2.13.0, `@modelcontextprotocol/inspector`. It needs **Node 22.19.0 or later**.[^mcp-inspector] Modes: web (default), `--cli` and `--tui`.

```bash
# List the tools, at revision 2026-07-28, with the key
npx mcp-inspector --cli http://127.0.0.1:8717/mcp --protocol-era modern \
  --header "Authorization: Bearer $AP_MCP_TOKEN" --method tools/list

# Call one tool
npx mcp-inspector --cli http://127.0.0.1:8717/mcp --protocol-era modern \
  --header "Authorization: Bearer $AP_MCP_TOKEN" \
  --method tools/call --tool-name get_purchase_order --tool-arg invoice_number=INV-8303
```

- **The key, without showing it.** An agent's shell does not have `AP_MCP_TOKEN` unless it loads it. It loads the key from the ignored file in the same command, so the value never appears: `set -a && . servers/ap-ts/.dev.vars && set +a && npx mcp-inspector ...`.
- Always pass `--protocol-era modern`. Without it, a one-off command does not use revision 2026-07-28.
- `--strict` with `--method tools/list` reports tool-schema portability problems in full.
- The CLI has no `server/discover` method. Send that request with `curl` (Lab 17, Task 1).
- Exit codes include 3 (authorization required), 4 (unreachable) and 5 (the tool returned an error).
- **A known stall.** If a server announces that its tool list can change, the Inspector's CLI in this version opens a change stream and waits. A server whose tools never change should say `tools: { listChanged: false }`, as both Brightline servers do.
- A 401 makes the Inspector try OAuth. Without a terminal, it stops with exit code 3.

**Ran**, against the TypeScript server in the Workers runtime.

### F3. Claude Code

```bash
claude mcp add --transport http apts http://127.0.0.1:8717/mcp \
  --header "Authorization: Bearer $AP_MCP_TOKEN"
```

That writes the key into your own Claude Code settings. To keep it out of every file, use a project `.mcp.json` instead, which reads the environment:

```json
{ "mcpServers": { "appy": { "type": "http",
  "url": "${AP_MCP_PY_URL:-http://127.0.0.1:8718/mcp}",
  "headers": { "Authorization": "Bearer ${AP_MCP_TOKEN}" } } } }
```

**Ran** with Claude Code 2.1.316 on November 2, 2026: a project `.mcp.json` of this shape, naming the TypeScript server, answered acceptance checks A5, A6 and A8.

- Scopes, highest first: local (the default), project (`.mcp.json`), user, then servers from plugins, then claude.ai connectors. A server's settings are not merged across scopes.[^anthropic-mcp]
- Permission rules name tools `mcp__<server>__<tool>`, or `mcp__plugin_<plugin>_<server>__<tool>` for a plugin's connector, such as `mcp__plugin_brightline-ap_ap__find_vendor`. Characters outside letters, digits, `_` and `-` become `_`.[^anthropic-permissions]
- Output: a warning above 10,000 tokens, a cap of 25,000 by default, `MAX_MCP_OUTPUT_TOKENS` to change it.
- OAuth: `/mcp` in a session, or `claude mcp login`.
- Telemetry for one session, in the shell, never in the repository: `CLAUDE_CODE_ENABLE_TELEMETRY=1`, `OTEL_METRICS_EXPORTER=console`, `OTEL_LOGS_EXPORTER=console`. Records carry `mcp_server.name` and `mcp_tool.name`, shown as `"custom"` until `OTEL_LOG_TOOL_DETAILS=1`. Traces are a beta, `CLAUDE_CODE_ENHANCED_TELEMETRY_BETA=1`.[^anthropic-monitoring]

### F4. Codex

In `.codex/config.toml` (a trusted project) or `~/.codex/config.toml` (you):

```toml
[mcp_servers.apts]
url = "http://127.0.0.1:8717/mcp"
bearer_token_env_var = "AP_MCP_TOKEN"
enabled_tools = ["find_vendor", "list_open_invoices", "get_purchase_order", "search_policy"]
default_tools_approval_mode = "writes"
```

- `default_tools_approval_mode`: `auto`, `prompt`, `writes` (asks only for tools the server does not mark read-only) or `approve`. Per tool: `tools.<tool>.approval_mode`.[^openai-codex-mcp]
- `startup_timeout_sec` (default 10), `tool_timeout_sec` (default 60), `enabled`, `required`, `disabled_tools`, `http_headers`, `env_http_headers`.
- `codex mcp add` and `codex mcp login` (OAuth, with `--oauth-client-registration auto`, `cimd` or `dcr`).
- Telemetry goes under `[otel]` in your user config. Codex ignores it in a project's config.[^openai-codex-config]
- A deployed address goes in your user config, never in the repository's.

### F5. OpenCode version 2

In `opencode.jsonc` at the repository root:

```jsonc
{ "mcp": { "servers": { "apts": {
    "type": "remote", "url": "http://127.0.0.1:8717/mcp",
    "headers": { "Authorization": "Bearer {env:AP_MCP_TOKEN}" },
    "oauth": false, "protocol": "2026-07-28" } } },
  "permissions": [ { "action": "apts_*", "resource": "*", "effect": "allow" } ] }
```

- `protocol`: the default is not 2026-07-28. Set `"2026-07-28"`, or `"auto"` to ask the server with `server/discover`.[^opencode-mcp]
- `oauth`: on by default for remote servers. `false` when the key is in a header.
- `disabled: true` stops a server. There is no `enabled` field.
- `timeout`: `startup`, `catalog` and `execution`. `codemode` is on by default.
- Tools are named `<server>_<tool>` in permission rules. `opencode mcp add` adds a server.

### F6. Deploying to Cloudflare Workers

The book's platform for stateless MCP servers. New to Cloudflare? Read [F1](#f1-cloudflare-from-zero-and-running-the-servers-on-your-computer) first: it says what Cloudflare is, why it matters for AI, what the free plan gives you, and the words used here. Checked November 1, 2026. Commands run from the server's folder, `servers/ap-ts` or `servers/ap-py`. **Ran** marks what the authors ran. Everything else is from Cloudflare's documentation. A coding agent runs every command and you approve each one, except the steps marked **by you**.

This section has three parts. **How a coding agent deploys** sets up the agent the way Chapter 12 taught. **Your first deploy, in order** walks you through putting the TypeScript server online once, with what you should see at each step. Everything after it is reference, to come back to when a step needs more detail.

#### How a coding agent deploys

You do not type deploy commands. A coding agent does, in the desktop app, with the habits from Chapter 12. Deploying is the riskiest work in this chapter, because a deploy is public at once and some of its mistakes are hard to undo, so each habit matters more here than anywhere else.

| Chapter 12 habit | What it means for a deploy |
| --- | --- |
| One task, one session (12.2, 12.5) | Start a fresh session for each lab task in Sitting 4. Begin it with "Read `NOTES.md` and `ports/ch17.md`" (leave out `NOTES.md` until it exists), so it knows where the last session stopped. End it by asking the agent to add one line to `ports/ch17.md`: what is online now, and its version ID |
| Plan first (12.3) | Open each task in *Plan* mode with a Four-Part Brief: the outcome, the context, the format of the report and the constraints. Read the plan for the order (staging before production), the environment flag on every command (`--env staging`, or `--env=""` for production), and that no key file is opened. Correct it, then switch modes |
| Permissions by blast radius (12.3) | Switch to *Manual*, so the agent asks before every command. Not *Auto*, and never *Bypass permissions*. A wrong deploy or rollback reaches every caller at once |
| Read every command before you approve it (12.3) | Look for three things: which environment it targets, which file it reads, and that no key value appears in it. If you are unsure what a command does, ask before you approve |
| Two guards for every "never" (12.4) | Task 18a adds a "Deploying" section to `AGENTS.md`, which all three agents read. It also adds *ask* rules to `.claude/settings.json` and `opencode.jsonc` for the commands that deploy, send keys, roll back, delete, merge, push or start a workflow, and a *deny* rule for `wrangler secret put`. An ask rule prompts you even if a session was left in Auto. The lab adds no rules file for Codex, so in Codex only the `AGENTS.md` words and your own approval guard each command. Like every rule, it covers the commands the agent usually writes. It is not a lock, so you still read each command |
| Done means evidence (12.1) | A deploy is done when the conformance suite reports `0 failed` against the deployed address and the key check gives `400`, then `401`. Not when the agent says it is done. A second agent runs the checks, so the one that deployed does not grade its own work |
| Fewer people watching, tighter permissions (12.7) | Once Task 18c is done, CI is the seat that deploys, with nobody watching. So its token is limited to Workers and what they use, it never sets a secret, and production waits for a person to run the workflow |

#### What only you can do

A coding agent cannot click in a browser, and must never see a key. So these steps are yours, each marked **by you**:

- **Core path (Tasks 18a and 18b):** closing any terminal where you set a key, making the Cloudflare account, choosing your `workers.dev` subdomain, and approving Wrangler's sign-in in your browser.
- **Extensions (18c and 18d):** making the CI deploy token and typing it into `.secrets/github.env`, setting the key in a terminal for each AI app, and looking at the dashboard's logs and request graph.

A coding agent does everything else, and you approve each command.

#### In Codex and OpenCode

The same habits apply. In Codex, use `/plan` for the plan and keep *Ask for approval*. A deploy needs the network, which Codex's workspace sandbox does not give, so Codex asks before it runs one. In OpenCode, use the *plan* agent first, then *build*, with the ask rules Task 18a adds to `opencode.jsonc`. Both read the same `AGENTS.md`.

#### Your first deploy, in order

About 50 minutes. Step 3 is lab Task 18a, which also tests two copies on your computer before anything goes online, and steps 4 to 8 are Task 18b. If you start your agent from its icon in the desktop app, you need to do nothing here. If you started one by typing `claude`, `codex` or `opencode` in a terminal where you set `AP_MCP_TOKEN`, close that terminal and start the agent from a new one ([F0](#f0-keys-on-your-computer)). When a step says to note something in `ports/ch17.md`, tell the agent what you saw and ask it to add one line there. Most commands run in `servers/ap-ts`. The checks in steps 6 to 8 run from the repository's top folder, because the conformance suite lives there.

1. **Make an account, by you.** Sign up for a free Cloudflare account at `dash.cloudflare.com/sign-up/workers-and-pages`. If Cloudflare asks you to verify your email, open the email it sent and do that first. *You should see:* the Cloudflare dashboard, with *Workers & Pages* in the menu on the left. It may sit under a heading such as *Compute*. Open it (or type its name into the dashboard's search box) and look for *Your subdomain*. A new account has none, so select the button next to it to set one: something short with no personal or company details, such as `ana-ap-lab`, because anyone can see it. The button may say *Set up* or *Change*. Type the name and confirm. *You should see* your name followed by `.workers.dev` next to *Your subdomain*. Do this before step 4, because a coding agent cannot answer Wrangler's question about it.
2. **Sign Wrangler in.** Ask the agent to run `npx wrangler login` in `servers/ap-ts`. Your browser opens at Cloudflare. If it does not, open the link the agent shows. Check the address is Cloudflare's own and sign in, within about two minutes, or the agent's command may time out. If it does, ask the agent to run `npx wrangler login` again. Cloudflare then lists many things Wrangler may do. That is normal. Select *Allow*. From now on, commands the agent runs can change your Cloudflare account, which is why you read each one before you approve it. Then ask the agent to run `npx wrangler whoami`.[^cloudflare-wrangler-login] *You should see:* "You are logged in with an OAuth Token, associated with the email" and your email address, and your account's name and ID. If it shows someone else's email, stop and sign in again.
3. **Prepare the project (Task 18a).** The agent first adds the deploying rules to `AGENTS.md`, `.claude/settings.json` and `opencode.jsonc` ("How a coding agent deploys" above). Then it adds staging to the configuration, adds the deploy scripts, and makes the deploy keys with `npm run keys -- --deploy`. It keeps the `.dev.vars` files you made in Task 1, saying `kept ... (it exists)`, which is fine, and writes the new files under `.secrets/` and both `.dev.vars.staging` files, which hold the same staging key. Then it runs `npm run check:deploy` in `servers/ap-ts`, which builds both environments without uploading anything. *You should see* `copied 8 files to assets/`, then, once for each environment (**ran**):

   ```text
   ⛅️ wrangler 4.156.0
   ✨ Read 11 files from the assets directory .../servers/ap-ts/assets
   Total Upload: 767.00 KiB / gzip: 152.20 KiB
   Your Worker has access to the following bindings:
   Binding            Resource
   env.ASSETS         Assets
   --dry-run: exiting now.
   ```

   `env.ASSETS` is the uploaded data files ([F1](#f1-cloudflare-from-zero-and-running-the-servers-on-your-computer)). Wrangler's count includes the folders: the eight files are the ones that matter. The keys are not listed, because they are sent separately in step 5.
4. **Put staging online.** Ask the agent to run `npm run deploy:staging`. *You should see:* the same lines as step 3, without the last one, then lines saying the Worker was uploaded and deployed, its address, `https://brightline-ap-ts-staging.<your-subdomain>.workers.dev`, and a version ID. The exact wording can differ from one Wrangler release to the next. If the deploy stops and asks you to register a `workers.dev` subdomain, do the end of step 1, then deploy again. Until step 5, every request to the new address gets **503, "Server not configured"**. That is on purpose: the server refuses to run without its keys.
5. **Send staging its keys.** Ask the agent to run `npm run secrets:staging`. It sends the two keys from `.secrets/staging.env`, made in step 3, and never shows them. *You should see:* two lines such as `Successfully created secret for key: AP_MCP_TOKEN`, one for each key, then `2 secrets successfully created`. No key value appears. If one does, see the troubleshooting row "An agent shows a key in the chat". Then ask the agent to run `npx wrangler versions list --env staging`. The newest version, at the bottom, has the Source `Secret Change`. Its ID is the version ID of the keys. Each change to a Worker, including its secrets, makes a new version of it, and this one goes live at once, so the 503 ends.
6. **Check staging.** Ask the agent to save the address with one shell command, from the top folder: `printf 'CONFORMANCE_URLS=ts=%s/mcp\n' <address> > .secrets/staging.urls.env`, with `<address>` replaced by the staging address from step 4, exactly as printed. Ask it to show you the command it ran, with the address in it. It should not open the file afterwards. The command adds `/mcp` itself, so the saved address must end in `.workers.dev/mcp`. On Windows, ask the agent to write the same line with `Set-Content -Encoding ascii`, or to run the command in Git Bash. This file holds only an address, not a key, so the agent may write it. Approve the command only if it writes to a file ending in `.urls.env`. Then ask it to run `npm run conformance:staging` from the top folder. The conformance suite runs the acceptance checks from [17.6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/specify-generate-verify/) against the address, plus the refusals from [17.8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/securing-a-remote-server/). *You should see* a last line that ends in `0 failed`, such as `conformance: 24 checks passed, 0 failed`. The number depends on the suite your agent wrote. It should be smaller than your local run's, because a deployed run checks one server at one address. If it matches your local run's number, the suite tested the servers on your computer, not the deployed one, because the address file was not read. Save it again. If the suite stops with "cannot reach", see the troubleshooting table.
7. **Only then, production.** Ask the agent to run `npm run deploy` in `servers/ap-ts` (the `--env=""` inside it means production). *You should see* the same lines as step 4, with the production address: the staging one without `-staging`, such as `https://brightline-ap-ts.<your-subdomain>.workers.dev`. Then ask it to run `npm run secrets:production`, which prints the same lines as step 5, and `npx wrangler versions list --env=""` for the keys' version ID, the newest `Secret Change`. Ask the agent to save the production address, as printed, into `.secrets/production.urls.env` with the step 6 command, which adds `/mcp` itself. Then run `npm run conformance:production` from the top folder. *You should see:* `0 failed`.
8. **Prove the keys are separate.** Ask the agent to run this from the top folder, twice. It sends one request with the staging key and prints only the status code, never the key:

   ```bash
   node --env-file=.secrets/staging.env -e "fetch(process.argv[1],{method:'POST',headers:{authorization:'Bearer '+process.env.AP_MCP_TOKEN,'content-type':'application/json'},body:'{}'}).then(r=>console.log(r.status))" <address>
   ```

   First with the staging address, ending in `/mcp`. *You should see:* `400`. The key was accepted, and the server then refused the empty test message, which is expected (**ran** locally). If you see `503`, the keys were not sent (step 5). If you see `404`, check the address ends in `/mcp`. Then with the production address. *You should see:* `401`. A staging key never opens production. In the command, `process.env.AP_MCP_TOKEN` is the key's name, not its value. A key value is a long run of random letters and numbers. If you see one, refuse.

If you do Task 18c, changes reach staging through CI from then on, not from your laptop ("Deploy from CI", below).

#### The free plan

[F1](#f1-cloudflare-from-zero-and-running-the-servers-on-your-computer) has the full table. In short: 100,000 requests a day for the whole account, reset at midnight UTC, and **10 ms of CPU time per request**. Workers Logs move to new pricing on December 1, 2026.

#### Get an account and sign in

[^cloudflare-get-started]

1. **By you.** Go to `dash.cloudflare.com/sign-up/workers-and-pages` and sign up with an email address and a password. Follow the steps the page shows. The pricing page did not say whether the free plan asks for a payment card, so note in `ports/ch17.md` whether it did.
2. Ask your coding agent to run `npx wrangler login` in `servers/ap-ts`. Wrangler opens your browser at Cloudflare's sign-in page. Check the address is Cloudflare's, sign in, and allow Wrangler access to your account. Wrangler then keeps its own login on your computer, so you do this once. This is not the sign-in token of [17.8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/securing-a-remote-server/).
3. Ask the agent to run `npx wrangler whoami`, which shows which email address Wrangler is signed in with.
4. **Your account ID**, needed for CI: `npx wrangler whoami` shows it, or in the dashboard (`dash.cloudflare.com`), open *Workers & Pages*, find *Account Details*, and copy *Account ID*.[^cloudflare-account-ids]
5. **Your `workers.dev` subdomain.** Choose it in the dashboard before your first deploy, as "Your first deploy, in order" step 1 shows. Wrangler would ask during the deploy, but a coding agent cannot answer. You can see or change it in *Workers & Pages*, next to *Your subdomain*.

#### The dashboard pages you will use

Everything is under *Workers & Pages*.[^cloudflare-metrics] Its *Overview* lists your Workers. Select one to see its *Metrics* (the *Requests* graph shows total requests, successes and errors), its *Deployments* (versions, and *Rollback*), its *Settings* (under *Variables and Secrets*, the names of its secrets, never their values) and its logs.

#### One configuration, two environments

`wrangler.jsonc` holds production at the top level and staging under `env`:

```jsonc
{
  "name": "brightline-ap-ts",
  "main": "src/worker.ts",
  "compatibility_date": "2026-10-01",
  "workers_dev": true,
  "preview_urls": false,
  "assets": { "directory": "./assets", "binding": "ASSETS", "run_worker_first": true },
  "observability": { "enabled": true, "head_sampling_rate": 1 },  // keep the log of every request (1 = 100 percent)
  "env": {
    "staging": {
      "workers_dev": true,
      "preview_urls": true,
      "assets": { "directory": "./assets", "binding": "ASSETS", "run_worker_first": true },
      "observability": { "enabled": true, "head_sampling_rate": 1 }
    }
  }
}
```

- Each environment is a separate Worker, named `<name>-<environment>`: `brightline-ap-ts-staging`, at `https://brightline-ap-ts-staging.<your-subdomain>.workers.dev/mcp`.
- Bindings, variables and secrets are **not inherited**. Repeat the `assets` binding in each environment, and set each secret per environment.[^cloudflare-environments]
- With environments defined, a deploy with no `--env` warns you. Target production on purpose with `--env=""`. **Ran** (dry run).
- `npm run check:deploy` builds both environments with `--dry-run`, with no account. CI runs it on every pull request. **Ran.**

#### Run it on your computer

`npm run dev` (production settings) or `npm run dev:staging`, on `127.0.0.1:8717`. Local secrets come from `.dev.vars`, or from `.dev.vars.staging` with `--env staging`, which then replaces `.dev.vars` entirely. Git ignores both. A second copy needs another port, another debugger port (`--inspector-port`) and its own folder for the local runtime's small database (`--persist-to`), as [F1](#f1-cloudflare-from-zero-and-running-the-servers-on-your-computer) explains: `npx wrangler dev --env staging --ip 127.0.0.1 --port 8727 --inspector-port 9339 --persist-to .wrangler/state-2`. **Ran:** two staging copies, `npm run conformance:staging`, 24 of 24. A run against deployed addresses checks the TypeScript server only, so it has fewer checks than the full local run, which covers both versions.

#### Secrets

From `servers/ap-ts`, `npm run secrets:staging` and `npm run secrets:production` send each environment's key file with `wrangler secret bulk`, so no key is typed or shown. Setting secrets makes a new version of the Worker live at once.[^cloudflare-secrets] Python Workers use the same command: `npx wrangler secret bulk ../../.secrets/staging.env --env staging` from `servers/ap-py`. Deploy first, then send the keys: until both keys arrive, the TypeScript server answers every request with 503, "Server not configured", and runs no tool, which is safe. In the code a secret is just `env.AP_MCP_TOKEN`. The lab does not use `wrangler secret put`, which asks for each value in a terminal.

#### What a deployed check covers

The steps are in "Your first deploy, in order" above. Write each address with `/mcp` added (`CONFORMANCE_URLS=ts=<address>/mcp`), because the suite calls it exactly as written. In remote mode the suite also checks that `/data/vendor-banking.csv` answers 404. A deployed run uses one address, so it cannot test two copies. It checks behavior and refusals. Statelessness across copies is proved on your computer (Task 10), and by the platform running copies it may throw away.

#### Deploy from CI

**GitHub Actions** runs workflow files from `.github/workflows/` on GitHub's computers.[^cloudflare-github-actions] Brightline's `deploy.yml` deploys staging on every push to `main`, which is what a merged pull request does, and runs the conformance suite against it. Production is deployed only when a person runs the workflow by hand. This works on every GitHub plan, private repositories included.

1. **Make the deploy token, by you.** In the Cloudflare dashboard, open *My Profile*, then *API Tokens*, and select *Create Token*. Choose the *Edit Cloudflare Workers* template.[^cloudflare-api-token] This token can change any Worker in your account, so treat it like a password. Under *Account Resources*, choose your one account. Under *Zone Resources*, a new account has no domains, so keep the template's setting. If your account has domains, choose none, because the lab uses none. A zone is a domain that Cloudflare manages. Select *Continue to summary*, then *Create Token*. Copy it now: Cloudflare shows it only once. If a screen differs, follow the dashboard's own words and note the difference in `ports/ch17.md`.
2. **Put it in the one file you edit, by you.** Open `.secrets/github.env` in a plain text editor, not through an agent ([F0](#f0-keys-on-your-computer) shows how to find hidden files). Right-click it and choose *Open With*, then TextEdit, or Notepad on Windows. You will see the lines `# CLOUDFLARE_API_TOKEN=` and `# CLOUDFLARE_ACCOUNT_ID=`. Leave any other comment line alone. Delete the `#` and the space after it, and paste the value right after the `=`, so each looks like `CLOUDFLARE_API_TOKEN=abc123`, with no spaces and no quotes. The account ID is in `npx wrangler whoami`'s output, or in the dashboard, as "Get an account and sign in" step 4 above shows. You will also see two long keys in this file, both environments' `AP_MCP_TOKEN` values. Leave them exactly as they are, copy them nowhere, change no other line, then save and close.
3. **The agent stores them in GitHub.** It runs `gh secret set -f .secrets/github.env`, which sends four repository secrets without showing them, and `gh variable set STAGING_URLS --body "ts=https://brightline-ap-ts-staging.<subdomain>.workers.dev/mcp"`, and `gh variable set PRODUCTION_URLS --body "ts=https://brightline-ap-ts.<subdomain>.workers.dev/mcp"`, with no `-staging`. `gh secret list` shows the names, never the values. They appear in your repository under *Settings*, *Secrets and variables*, *Actions*.
4. **Staging deploys on merge.** After a merge, the agent runs `gh run watch` and shows you the `deploy` run: staging deployed with `npm run deploy:staging`, then the suite against staging. Wrangler reads `CLOUDFLARE_API_TOKEN` from the environment,[^cloudflare-system-env] so no sign-in step is needed.
5. **Production, when you say so.** When staging is green and you decide, the agent runs `gh workflow run deploy -f target=production` and watches it. It deploys production and runs the suite against it. On GitHub this is *Actions*, *deploy*, *Run workflow*.

The workflow never sets a Worker secret. **GitHub environments** with required reviewers are a stronger gate, where production waits for a named person to approve. They need a public repository, or GitHub's Enterprise plan for a private one, so Brightline does not depend on them.[^github-deployments] Cloudflare's official action, `cloudflare/wrangler-action@v4`, is an alternative to the npm scripts, with `apiToken`, `accountId`, `workingDirectory` and `command` inputs.[^cloudflare-wrangler-action] **Not run:** the authors had no Cloudflare account in their workspace. The workflow file parses.

#### Versions, Version URLs and rollback

- Every deploy makes a version. `npx wrangler versions list` shows the 10 most recent. `npx wrangler deployments list` shows what was deployed when.
- `npx wrangler versions upload` uploads a version without making it live. On a Worker with Version URLs on, it prints an address such as `<version-prefix>-brightline-ap-ts-staging.<subdomain>.workers.dev`. Add `--preview-alias pr-12` for a readable one. Version URLs are public, so the key still guards them, and their requests do not appear in Workers Logs or `wrangler tail`.[^cloudflare-previews]
- `npx wrangler versions list` runs from oldest to newest: the newest is at the bottom. Each version shows its *Created* date and its *Source*: `Upload` for a deploy, `Secret Change` for new keys, or `Rollback`.
- `npx wrangler rollback <version-id>` makes that version live, on every address. Always pass the version ID. Add `--message "why"`. When an agent runs Wrangler, Wrangler cannot ask you anything, so it answers yes to every question for you, including a warning that secrets have changed. Only the 100 most recent versions can be chosen. Each version keeps the secrets it had. So rolling back to a version older than the newest `Secret Change` brings the old keys back, and with an agent the warning will not stop it. Before you approve a rollback, check that the version is the newest `Secret Change` or newer. Connected resources, such as a database, are not rolled back.[^cloudflare-rollbacks]

#### Logs

- *Live:* `npx wrangler tail --format pretty`, or `--env staging`. Filter with `--status error`, `--method POST` or `--search "<text>"`. At most 10 people can watch one Worker at a time, and busy Workers are sampled.[^cloudflare-real-time-logs]
- *Kept:* Workers Logs, in the Cloudflare dashboard (*Workers & Pages*, then the Worker), with `"observability": { "enabled": true }`. New Workers have it on by default.[^cloudflare-workers-logs] After Task 18d, Brightline's TypeScript Worker writes one line per request (method, tool, status, milliseconds) and never the key, the request body or a result. **Ran** locally.

#### Static assets

`run_worker_first` sends every request to the Worker, so no file is served directly.[^cloudflare-static-assets] The Worker reads a file with `env.ASSETS.fetch("https://assets.local/data/vendors.csv")`. **Ran:** `/data/vendor-banking.csv` returns 404.

#### For developers: two functions named `createMcpHandler`

The official TypeScript SDK exports one from `@modelcontextprotocol/server`, which Brightline uses, so the server is not tied to one platform. Cloudflare's `agents/mcp/server` exports another, with options such as `allowedOriginHostnames`.[^cloudflare-mcp-handler] They differ.

#### An address under your own name (optional)

Skip this unless your company owns a domain name. A `workers.dev` address belongs to Cloudflare's name. If the connector might ever move to another service, give it an address under your company's own name from the start, such as `ap.brightline.example`, so no AI app's settings need to change later ([17.8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/securing-a-remote-server/)). This needs a domain name your company owns, set up in Cloudflare as an active zone (Cloudflare's word for a domain it manages). The lab does not need one.

- In the dashboard: *Workers & Pages*, select the Worker, then *Settings*, *Domains & Routes*, *Add*, *Custom Domain*. Enter the name and select *Add Custom Domain*.
- Or in `wrangler.jsonc`, then deploy again: `"routes": [{ "pattern": "ap.brightline.example", "custom_domain": true }]`.
- Cloudflare creates the DNS record and the certificate for `https` itself. It refuses a name that already has a CNAME record, or a domain you do not own in Cloudflare.

#### Python Workers (extension only)

Generally available,[^cloudflare-python] built on Pyodide, Python compiled to WebAssembly.

- Dependencies are listed in `pyproject.toml` and bundled on deploy. Pure Python packages, packages Pyodide includes, and packages that ship WebAssembly (PyEmscripten) wheels run. A package with native code and no such wheel does not.[^cloudflare-python-packages]
- The module and its top-level imports run once at deploy time, and the result is saved as a snapshot, so heavy imports cost less per request. So read secrets and anything else that belongs to a request inside the request handler, not at import. Brightline's entry builds its app inside `fetch`.[^cloudflare-python-how]
- `uv run pywrangler dev` and `uv run pywrangler deploy`. `pywrangler` needs uv 0.13.4 or later and builds against Python 3.14 for Pyodide. Secrets use `npx wrangler secret bulk ../../.secrets/staging.env --env staging`, as in Task 18b. The `env.staging` block is in `servers/ap-py/wrangler.jsonc`.
- **Not run:** the authors' workspace could not reach Pyodide's package index. Whether `mcp`, `cryptography` and the local `py/` package build for Workers, and whether `pywrangler deploy --env staging` passes the flag on, is for your Task 18b to record. The CI workflow deploys only the TypeScript server for that reason.

#### When a server outgrows Workers

Native libraries with no WebAssembly build, more CPU time than the plan allows, or files to write. Move that server to a container platform, at the same address with the same keys or tokens, and clients see no change. Cloudflare's own Containers[^cloudflare-containers] need the paid plan and run behind a Durable Object (a Cloudflare feature that gives one named object its own storage), so this book does not use them on the free plan. The server code does not change. Only its entry point and deploy commands do.

#### Telemetry on Workers

Cloudflare's custom spans use its own `tracing` API from `cloudflare:workers`, not `@opentelemetry/api`.[^cloudflare-custom-spans] So Brightline's spans run as no-ops in the deployed Worker, and you watch them on your computer ([F7](#f7-seeing-the-servers-spans)). Workers Logs are the deployed view. Before you rely on sending traces out, check Cloudflare's OpenTelemetry page for what your plan includes.[^cloudflare-otel]

### F7. Seeing the server's spans

These commands print each span as text on your screen, so you need no viewer and no paid plan.

- *TypeScript:* `cd servers/ap-ts && node scripts/spans.ts` runs the eight acceptance checks in-process with an in-memory exporter and prints the spans as JSON. The server uses only `@opentelemetry/api` 1.9.0, so with no SDK registered it records nothing and costs nothing.
- *Python:* `cd py && uv run python -m brightline_ap.spans`. The Python SDK, `mcp` 2.3.0, **creates the conventions' `tools/call` span itself**, with its parent from `params._meta` and `error.type` on a failed call. So the Python server adds only the invoice count, the child span and the duration metric.[^mcp-python-sdk] The TypeScript SDK, 2.4.0, made no such span in the authors' run, so the TypeScript server makes its own.[^mcp-typescript-sdk]
- *Both:* `npm run conformance` compares the two reports and fails on any difference in span names or attributes. **Ran.**

### F8. The protocol in detail

Concepts [17.1](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/mcp-in-one-picture/) to [17.10](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/watching-a-connector/) teach the ideas. This section holds the exact names and rules behind them, from the MCP specification, revision 2026-07-28,[^mcp-spec] and from OpenTelemetry. Use it when a lab task or an error message names one of them.

#### HTTP in one minute

MCP messages travel over HTTP, the protocol of the web.

- A request has a method (`POST` sends data, `GET` asks for something), an address, headers (lines of extra information, each a name and a value, such as `Content-Type: application/json`) and a body (the data).
- A response has a status code, headers and a body. The lab uses these codes: 200 OK, 400 the request is malformed, 401 no credential or a wrong one ("who are you?"), 403 refused even though the request may be genuine, such as a disallowed website or a missing permission ("not from there", or "I know you, and no"), 404 not found, 405 this method is not allowed here. The Python server also answers 421, wrong host, to a request for an address it does not serve (below).
- `Authorization: Bearer <key>` is the usual header for a credential. "Bearer" means whoever carries the key is let in, so the key must stay secret.
- A **proxy** passes requests on between client and server, such as a company gateway that logs or blocks traffic.

#### JSON-RPC

Every MCP message is **JSON-RPC 2.0** (RPC: remote procedure call). A request is a JSON object with a `method`, `params` and an `id`. The answer carries the same `id` and holds a `result` or an `error`. An error has a negative number and a message, such as `-32602` (invalid parameters, also used for an unknown tool) and `-32022` (unsupported protocol version, with the list of revisions the server supports).

#### Rule words

The specification says MUST for a rule every server must follow, and SHOULD where there may be a good reason not to. A **non-normative** part is advice, not a rule.

#### The transport

Brightline's servers use **Streamable HTTP**: one **endpoint** (an address ending in `/mcp`), where each message arrives as an HTTP `POST`. The answer is one JSON object or, for an answer in parts, a stream of server-sent events (`Content-Type: text/event-stream`). `GET` gets 405.[^mcp-transport] Such a server is remote, even at `127.0.0.1`. MCP also has local servers, started by the AI app as a program and reached through its input and output (**stdio**). This chapter builds none.

#### The messages behind steps 1 and 3

These are the messages behind steps 1 and 3 of [17.1](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/mcp-in-one-picture/).

| Step | Method | What comes back |
| --- | --- | --- |
| What can you do? | `server/discover` (every server MUST implement it) | The revisions it supports, its **capabilities** (the features it offers, such as tools), and its name and version |
| The tool list | `tools/list` | Each tool's name, title, description, input schema, output schema and annotations |
| Call a tool | `tools/call` | The tool's result, or a tool error |

#### One tool call, as it travels

```text
POST /mcp
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: find_vendor

{"jsonrpc":"2.0","id":1,"method":"tools/call",
 "params":{"name":"find_vendor","arguments":{"vendor_id":"V005"},
  "_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28",
           "io.modelcontextprotocol/clientCapabilities":{}}}}
```

- **`_meta`**, inside `params`, carries the revision (`io.modelcontextprotocol/protocolVersion`, required), what the client can do (`io.modelcontextprotocol/clientCapabilities`, required) and who the client is (`io.modelcontextprotocol/clientInfo`, should). A missing required field gets `-32602` and HTTP 400.
- **Headers repeat the essentials,** so a proxy can route or block a call without reading its body: `MCP-Protocol-Version` on every request, `Mcp-Method`, and `Mcp-Name` for a tool call. Headers that do not match the body get `-32020` and HTTP 400.
- **Every result** has `resultType`: `"complete"`, or `"input_required"` (below). List results and `server/discover` also carry `ttlMs`, how many milliseconds a client may reuse the answer, and `cacheScope`, whether that saved copy belongs to this caller only. Brightline's servers answer `"private"`.

#### Other server features

Besides tools, a server may offer resources, data with a fixed name (a URI such as `file:///policies/po-matching.md`) that the host app decides to use, and prompts, templated messages a person picks, often as a slash command. A client may offer **elicitation**: the server asks the person for more information during a call. Extensions, such as long-running tasks, interactive interfaces (MCP Apps) and skills served over MCP, are used only when both sides announce them. Brightline uses none of these.

#### Tool fields

`name` (1 to 128 characters: letters, digits, `_`, `-` and `.`, case-sensitive, unique in the server), `title` (for people), `description` (for the model), `inputSchema` (required, JSON Schema 2020-12), `outputSchema` (optional) and `annotations` (hints such as `readOnlyHint`). A result has `content`, such as a text block, and may have `structuredContent`, JSON for programs. With an `outputSchema`, `structuredContent` MUST match it, and the tool SHOULD return the same JSON as text too. A tool error is a normal result with `isError: true`. Annotations are hints: a host should not trust them from a server it does not trust. A host that combines servers should prefix each tool's name with its server's name. A server whose tool list never changes says `tools: { listChanged: false }` in its capabilities.[^mcp-tools]

#### State across calls

The protocol has no sessions: list results must not depend on which connection asked. The specification's guidance for a handle (non-normative): check the caller's authorization against it on every call, keep it hidden, so nobody parses it, state its lifetime in the tool's description, and answer an expired or unknown handle with a tool error that says to start again. Brightline's handle carries a version number, the filter, the next offset, the page size, the caller and an expiry 15 minutes later. It is **sealed** with AES-256-GCM, a standard cipher that hides the contents and detects any change, under `AP_HANDLE_KEY`.

#### More input during a call

A tool that needs more input, such as a person's confirmation, returns `resultType: "input_required"` with `inputRequests` and a `requestState` the client must not read. The client gathers the answers, often through elicitation, then sends the whole request again with `inputResponses` and the same `requestState`, under a new request id. If `requestState` affects authorization or business logic, the server MUST protect it from change. Brightline's tools never need this.[^mcp-mrtr]

#### Change notifications

A **notification** is a message that needs no answer, such as "my tool list changed". A client that wants them sends `subscriptions/listen`, and the response stays open as a stream. A server that announces `listChanged: true` may send them.

#### Comparing two servers

As [17.6](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/specify-generate-verify/) says, the conformance suite normalizes schema spellings that change nothing for a client, each rule with a comment. Brightline's first run found four kinds:

1. The Python schemas use `$defs` and `$ref`. The TypeScript schemas write the same object inline.
2. A field that may be empty is written `anyOf [X, null]` in Python and `"type": [X, "null"]` in TypeScript.
3. An optional input is written `anyOf [X, null]` in Python and plain `X` in TypeScript. No AI app sends `null` for an optional input. It leaves the input out.
4. The TypeScript schemas give every integer field a minimum and maximum of plus and minus 9,007,199,254,740,991, the largest whole number JavaScript holds exactly.

Smaller rules (titles, `$schema`, `"default": null`, `additionalProperties`) are listed in the comment in `scripts/conformance.ts`.

#### What the specification asks about safety

This adds to [17.7](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/untrusted-output/). Servers must validate every input, control access, rate-limit calls and sanitize what they return. Clients should confirm sensitive operations, show a call's inputs before running it, validate results before passing them to the model, set timeouts and log tool use. A person should be able to deny any call. Tools represent running arbitrary code, and annotations such as `readOnlyHint` should be treated as untrusted unless they come from a trusted server.

#### The transport's security rules

These are the rules behind [17.8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/securing-a-remote-server/).

- **Check `Origin` on every request.** Reject a present `Origin` that is not allowed with HTTP 403. Judge a request with no `Origin` by its key alone. This stops **DNS rebinding**. DNS is the internet's address book: it turns a name such as `example.com` into an address. In DNS rebinding, a malicious site points its own name at the visitor's network, so a page they opened can reach a server on their computer. The `Origin` header still names the malicious site.
- **Bind to `127.0.0.1` on your own computer.** A server listens on an address. `127.0.0.1`, the **loopback** address, is reachable only from that computer. Listening on every **network interface** (Wi-Fi and cable too) lets anyone on the network call it.
- **Authenticate every request.** With no sessions, every request carries its credential and is checked.
- **Keep secrets out of headers a proxy may log,** such as `Mcp-Name`, and out of the address. `Authorization` is the exception: proxies are built to protect it.
- A deployed server can also check the **`Host`** header against the addresses it serves. Brightline's Python server does, through `AP_PUBLIC_HOSTS`, and answers 421 (wrong host) to any other.

#### Real sign-in with OAuth

This looks ahead from [17.8](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/securing-a-remote-server/). Chapter 18 builds it. MCP uses **OAuth 2.1**. The person signs in at a trusted service and gives **consent**. The AI app gets an **access token** that names the person, the server it is for, what it allows (its scopes, such as `ap:read`) and when it expires. The service that issued it is the **issuer**. In revision 2026-07-28:

- The MCP server is a **resource server**. It must publish **protected resource metadata** (RFC 9728) naming its **authorization server**. A refused request's 401 points to that document.
- A client preferably identifies itself with a **Client ID Metadata Document**: a web address serving a document about the client, so nobody registers clients by hand.
- The client sends a `resource` parameter (RFC 8707) naming the server, so the token is **bound** to it. The server must check that every token was issued for itself, and must not accept or pass on tokens meant for others.
- When the authorization server's response names its issuer, the client must check it against the one it expected.
- An expired or invalid token gets 401. A valid token without the needed scope gets 403.[^mcp-authorization]

#### Telemetry names

These are the agreed names [17.10](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/watching-a-connector/) mentions. OpenTelemetry's **semantic conventions** for MCP are at Development status on November 1, 2026, so names may change.[^otel-mcp]

- A tool call's span is named `{mcp.method.name} {target}`, such as `tools/call find_vendor`. Its **kind** is SERVER on the server and CLIENT in the AI app.
- Attributes: `mcp.method.name` (required), `gen_ai.tool.name`, `gen_ai.operation.name` set to `execute_tool`, `mcp.protocol.version`, and `error.type` when the call fails. Arguments and results are opt-in, because they can hold private data.
- Duration goes in a **histogram**, a metric counting how many calls fell into each range: `mcp.server.operation.duration`, in seconds.
- The caller puts W3C **trace context** (`traceparent`, and optionally `tracestate`) in the request's `params._meta`. A server that reads it makes its span a child of the caller's. If an HTTP `traceparent` header is also present, the `_meta` context is the parent, and the header's context is recorded only as a link.
- An exporter sends telemetry to the console or to a **collector**, usually over **OTLP**, OpenTelemetry's protocol.
- Brightline adds `brightline.invoice.count` and a child span for reading data files, and nothing else: no arguments, results, names or keys.

[^anthropic-mcp]: Connect Claude Code to tools via MCP, Anthropic.
[^anthropic-permissions]: Configure permissions, Anthropic.
[^anthropic-monitoring]: Monitoring, Anthropic.
[^openai-codex-mcp]: Codex: MCP, OpenAI.
[^openai-codex-config]: Advanced configuration, Codex, OpenAI.
[^opencode-mcp]: MCP servers, OpenCode.
[^mcp-spec]: Specification 2026-07-28, Model Context Protocol.
[^otel-mcp]: Semantic conventions for MCP, OpenTelemetry.
[^cloudflare-limits]: Workers limits, Cloudflare.
[^cloudflare-pricing]: Workers pricing, Cloudflare.
[^cloudflare-environments]: Environments, Cloudflare.
[^cloudflare-rollbacks]: Rollbacks, Cloudflare.
[^cloudflare-previews]: Version URLs, Cloudflare.
[^cloudflare-workers-logs]: Workers Logs, Cloudflare.
[^cloudflare-real-time-logs]: Real-time logs, Cloudflare.
[^cloudflare-otel]: OpenTelemetry export, Cloudflare.
[^cloudflare-python-packages]: Python packages, Cloudflare.
[^cloudflare-python-how]: How Python Workers work, Cloudflare.
[^cloudflare-github-actions]: GitHub Actions, Cloudflare.
[^cloudflare-announcement]: More than 10 million developers are building on Cloudflare, Cloudflare announcement.
[^cloudflare-network]: The Cloudflare network, Cloudflare.
[^cloudflare-static-assets]: Static assets binding, Cloudflare.
[^cloudflare-secrets]: Secrets, Cloudflare.
[^cloudflare-get-started]: Get started, Cloudflare.
[^cloudflare-how-workers-works]: How Workers works, Cloudflare.
[^cloudflare-workers-dev]: workers.dev, Cloudflare.
[^cloudflare-wrangler-login]: Commands: login, Cloudflare.
[^cloudflare-api-token]: Create an API token, Cloudflare.
[^cloudflare-account-ids]: Find account IDs, Cloudflare.
[^cloudflare-metrics]: Metrics and analytics, Cloudflare.
[^cloudflare-system-env]: System environment variables, Cloudflare.
[^cloudflare-wrangler-action]: wrangler-action, Cloudflare.
[^cloudflare-containers]: Containers, Cloudflare.
[^cloudflare-mcp-handler]: MCP handler API, Cloudflare.
[^cloudflare-python]: Python Workers are generally available, Cloudflare.
[^cloudflare-custom-spans]: Custom spans, Cloudflare.
[^github-deployments]: Deployments and environments, GitHub.
[^mcp-inspector]: Inspector, Model Context Protocol.
[^mcp-typescript-sdk]: TypeScript SDK, Model Context Protocol.
[^mcp-python-sdk]: Python SDK, Model Context Protocol.
[^mcp-tools]: Tools, specification 2026-07-28, Model Context Protocol.
[^mcp-transport]: Streamable HTTP, specification 2026-07-28, Model Context Protocol.
[^mcp-authorization]: Authorization, specification 2026-07-28, Model Context Protocol.
[^mcp-mrtr]: Multi Round-Trip Requests, specification 2026-07-28, Model Context Protocol.
