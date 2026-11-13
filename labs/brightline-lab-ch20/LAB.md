# Lab 20: the agent loop by hand

Chapter 20 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 20: the agent loop by hand](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/lab/), so you can do the lab without the book.

## Getting ready

The lab has four sittings. Each comes right after the concepts it uses. Each is also short enough for one session: about 2 hours, 1 hour 10 minutes, 1 hour 10 minutes and 1 hour 25 minutes. This section is the setup for all of them. Read it, then do Task 0. When a task says [F0](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/field-guide-agent-loop-by-hand/#f0-the-repository-and-its-secrets) to [F6](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/field-guide-agent-loop-by-hand/#f6-ollama-and-an-open-model), it means the field guide, in the reference at the end of the chapter.

**The agents write, and you explain.** This lab follows [Chapter 13](https://agentfactory.panaversity.org/building-ai-workers/programming-fundamentals/you-read-the-agent-writes/#how-do-i-learn-to-read-code-with-an-agent-beside-me)'s PRIMM-AI+ method. In each task, you **predict** first: you write your prediction in `ports/ch20.md`. Then the agent **runs** the code, and you **investigate** the gap with the agent's help ("explain line 73"). Some tasks also ask you to **modify**: you tell the agent what to change, predict again, and run again. You must be able to say what every line of it does.

**The lab's files already hold the loop.** `brightline-lab-ch20.zip` comes with the finished code and the tests that check it. So Sittings 1 and 2 are about understanding and running the loop, not building it. Your coding agent's job is to set up, run, explain and change. Sitting 4's Task 13 is where the work becomes yours: you review it all, and merge it.

**This lab costs a little money, and takes about 6 hours 10 minutes** (up to an hour more on route A). Neither API offers a free plan for API calls. Every `npm run ask` run has a cost cap of 10 cents. The whole lab should cost under $1 on each API (not yet confirmed by a live run). The open-model port is free.

**The date in this lab** is Tuesday, March 30, 2027, the day after [Lab 19](https://agentfactory.panaversity.org/building-ai-workers/business-data-and-retrieval/lab/). "This week" means up to Sunday, April 4. The worker's instructions, `prompts/ap-worker.v1.md`, give the model that date.

**Not yet run live.** No one has run this lab against the real APIs yet. The recorded responses in the tests and the logs in the concepts follow each API's documented shapes. They were checked against the official SDK types, but none of them comes from a live run yet. If a live response differs a little, trust what you see, and record it in `ports/ch20.md`. **One stop rule:** Task 0's last step or Task 1 may fail in a way that **If something goes wrong** does not cover. If that happens, stop, and record what you saw. Every later task depends on reaching the API and the connector.

**What counts as a pass.** Each task's **What good looks like** says what to expect. When it lists more than one possible outcome, any of them is a pass. When what you see matches none of them, it is still a pass if two things are true. You can say which step of the loop produced it, and you wrote it in `ports/ch20.md`. What matters is that you can explain the loop. You do not need to match someone else's run.

### Before you start

**What you need.**

- A computer running macOS, Linux, or Windows with WSL. WSL is the Windows Subsystem for Linux, and you need it because the scripts use Unix paths. The computer needs **Node 22.19 or later** (the minimum Lab 19 set), **Python 3.12 or later** and **uv** 0.11 or later. It also needs git and the GitHub CLI (`gh`). F0 says where to install each.
- The desktop apps of Claude Code and OpenCode version 2, and Codex in the ChatGPT desktop app, each signed in ([Chapter 12](https://agentfactory.panaversity.org/building-ai-workers/agentic-coding/overview/)).
- **A Claude Console account with API credits** and **an OpenAI API account with credits** ([F1](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/field-guide-agent-loop-by-hand/#f1-accounts-keys-and-spending-limits-by-you)). Each gets a project or workspace with a small monthly spending limit, which you set by hand in Task 0.
- **For the open-model port:** Ollama, and several gigabytes of free disk for one small model (F6).
- **A connector to call.** Either your own [Chapter 19](https://agentfactory.panaversity.org/building-ai-workers/business-data-and-retrieval/overview/) staging connector and a test token (route A), or the local practice connector in the zip (route B). Task 0 helps you choose.

**A quick reminder from Chapter 12.** **Plan mode** means the agent writes a plan and waits before it changes anything. **Manual mode** means it asks you before each command it runs. A **second terminal** is a new terminal window or tab, opened beside the agent. It is for a program that must keep running, such as the practice connector. Start the program there, leave the window open, and stop it later with Ctrl+C. A **branch** is a separate line of work in git, and deleting it does not touch the main code ([Chapter 15](https://agentfactory.panaversity.org/building-ai-workers/code-review/git-through-the-agent/)).

**How every task runs.** Chapter 12's five-step routine: (1) a fresh session with the named agent, in `brightline-ap/`. (2) Plan mode, with the task's prompt as the brief. Read the plan, and correct it before it starts. (3) Manual mode: approve each command it asks about. In Codex, choose **Ask for approval**: in that mode, Codex runs commands inside the folder without asking. It asks before any command that needs the network, such as `npm run ask`. (4) Evidence: the agent shows what proves the task is done, and you check it against **What good looks like**. (5) A line in `ports/ch20.md`: the task, your prediction, what happened, anything that surprised you.

**What you do by hand, and only this.** Make the two API accounts. Make each API key in its own console, and paste it into its file in `.secrets/` with your own editor. Set the spending limits, and copy the prices for the pinned models into `src/loop/config.json` ([F5](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/field-guide-agent-loop-by-hand/#f5-prices-usage-and-caching)). You also decide when to merge. Agents do everything else. **No API key or token passes through a chat.**

**Rules the agents follow.** `AGENTS.md` says: never print, read aloud or copy anything in `.secrets/`. Run live calls only through four commands and their Python twins. `npm run ask` has a cost cap. `npm run break` and `npm run stream:demo` make one or two small calls each. `npm run stateful` runs at most 8 turns. The only other live call is the one embeddings call inside Task 0's load on route A. Ask before any call to a model API. `.claude/settings.json` also denies reading `.secrets/`, and `opencode.jsonc` denies OpenCode's file-reading tool access to it. Codex's settings file cannot deny it, so in Codex, the rule in `AGENTS.md` is the guard.

**Words in the prompts.**

| Word in a prompt | What it means |
| --- | --- |
| `npm run ask -- --api claude "…"` | Runs one question through the loop on the first API and prints every request and response. `--api openai` uses the second API, and `--api open` uses the open model. `npm run ask:py` is the Python twin |
| `--trace`, `--quiet`, `--cache`, `--max-turns N` | Write a trace file, print only the answer, turn caching on, or lower the turn limit for one run |
| Recorded responses, fixtures | Saved responses in `tests/fixtures/loop/`. The tests replay them, so they cost nothing and need no network |
| `npm run test:loop`, `npm run test:loop:py` | Run the loop's TypeScript tests (vitest) and Python tests (pytest) |
| `npm run connector:practice` | Start the local practice connector on `127.0.0.1:8760` (route B). It reads its token from `.secrets/connector.env`. `PRACTICE_BROKEN=search_policy` makes that tool always answer "try again" |
| 400, 401, 429, 529 | Web error codes. 400: the request was wrong. 401: the key was not accepted. 429: too many requests. 529: the model service is overloaded ([20.9](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/when-the-loop-goes-wrong/)) |

**Your agents can read this chapter.** `docs/chapter-20/` holds the concepts and the field guide as text. Each prompt names what to read.

### Task 0. Set up from the zip (30 minutes on route B, up to 1 hour 30 minutes on route A, Claude Code)

**Goal:** both languages installed, and every offline test passing. Also the API keys you made today, in files git ignores, with their prices filled in, and a connector the loop can reach.

**By hand first (F1).** Unzip `brightline-lab-ch20.zip`. Then set up the accounts. F1 says where each step is on each provider's site.

- **The first API, now.** Make the Claude Console account, and add a few dollars of credit. Then make a workspace for this lab with a monthly spending limit of $5. (The Default Workspace cannot have one.) Make one API key in that workspace, and paste it into `.secrets/anthropic.env` as `ANTHROPIC_API_KEY=` followed by the key.
- **The second API, now or at the start of Sitting 2.** Make the OpenAI API account the same way, and paste its key into `.secrets/openai.env` as `OPENAI_API_KEY=` followed by the key. If two accounts at once is too much, leave this for Sitting 2, which sets aside 10 minutes for it. Until then, the `openai` prices stay at zero.

Then open the pricing page for each account you made. Find the pinned model from `src/loop/config.json` (the `models` block, also listed in [F3](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/field-guide-agent-loop-by-hand/#f3-the-two-shapes-exactly)). Copy its four prices into that file, with today's date in `checked_on` (F5). The part you edit looks like this before you start. Change only the zeros for `claude`, and for `openai` if you made that account today. The prices are in dollars per million tokens. Keep every quote, comma and brace:

```json
"prices": {
  "checked_on": "",
  "claude": { "input": 0, "output": 0, "cacheWrite": 0, "cacheRead": 0 },
  "openai": { "input": 0, "output": 0, "cacheWrite": 0, "cacheRead": 0 },
  "open": { "input": 0, "output": 0, "cacheWrite": 0, "cacheRead": 0 }
},
```

`checked_on` takes the date in quotes, such as `"2027-03-30"`. If a pricing page shows no separate cache-write price, use the input price for `cacheWrite`. Here is a filled-in row, with made-up numbers: `"claude": { "input": 3, "output": 15, "cacheWrite": 3.75, "cacheRead": 0.3 }`. It means $3 for each million input tokens, and so on. Copy the real numbers from the page. The `open` prices stay zero, because the open model is free. The tests do not read this file, so check your edit yourself. Ask your agent to confirm that `src/loop/config.json` is still valid JSON, without changing it.

**Choose a connector.**

- **Route A, your own connector.** If your Chapter 19 staging connector is still deployed, use it. By hand first, copy the files in your Lab 19 folder's `.secrets/` into this folder's `.secrets/`, in Finder or your own terminal: the load and the token need them. Step 4 of the prompt below first loads this lab's Brightline data into it: Lab 19's rows, and three invoices entered since. The loop then calls your real connector, with a test token for Ana at Brightline. You need a way to make that token ([F2](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/field-guide-agent-loop-by-hand/#f2-the-connector-route-a-or-route-b)). If you are not sure you have one, take route B: everything in this chapter works on it.
- **Route B, the practice connector.** If your Chapter 19 connector is not deployed, or you skipped Labs [17](https://agentfactory.panaversity.org/building-ai-workers/connectors-and-mcp/lab/) to [19](https://agentfactory.panaversity.org/building-ai-workers/business-data-and-retrieval/lab/), use the practice connector in the zip. It offers the same four tools over MCP, on your own computer. It reads this folder's Brightline files, the same rows route A loads. It also checks a bearer token: a sign-in token sent in a request header, as in [Chapter 18](https://agentfactory.panaversity.org/building-ai-workers/securing-connectors/overview/). It has no sign-in server and no database, so it proves the loop, not the connector.

**Predict:** before any key is used, which tests can already pass?

**In plain words.** Your coding agent installs both languages' packages, runs every test that needs no network, and connects the loop to a connector.

> Read `README.md`, `AGENTS.md`, and `docs/chapter-20/field-guide.md`, sections F0 to F2.
>
> 0. Put this folder under git, with a main branch. Make a first commit of everything here with the message "Start from the end of Chapter 19", and tag that commit `lab20-start`. If git has no name and email yet, set them for this project only. Show me `git log --oneline -1` and `git tag`.
> 1. Install with `npm ci`, then `cd py && uv sync --locked` for Python. Show me `node --version` and the two SDK versions from `npm ls --depth=0`.
> 2. Run `npm run typecheck`, `npm run typecheck:py`, `npm run test:loop` and `npm run test:loop:py`. Show me the four results as a table.
> 3. Check that git ignores `.secrets/` (`git check-ignore .secrets/anthropic.env` should print the path) and that `src/loop/config.json` has prices and a `checked_on` date for `claude` (and for `openai`, if I made that account today). Do not open the key files.
> 4. The connector. Do only the route I chose.
>    - Route A: ask me first, then run `npm run tenant:load -- --company org_brightline --folder data --env staging --replace`. It loads this folder's Brightline into staging, Lab 19's rows and three invoices entered since (INV-8316 to INV-8318), and embeds the policies again, one small metered call to the embeddings model from Chapter 19. Then run `npm run token:test -- --person ana --company org_brightline`, as F2 says. It signs Ana in on staging and writes the connector's staging address and her token into `.secrets/connector.env` as `CONNECTOR_URL=` and `CONNECTOR_TOKEN=`, never printing the token. If it stops, show me why, and I will switch to route B.
>    - Route B: write `CONNECTOR_URL=http://127.0.0.1:8760/mcp` and a random `CONNECTOR_TOKEN` into `.secrets/connector.env`, with a short script that never prints it. Then tell me to run `npm run connector:practice` in a second terminal, in `brightline-ap/`, and wait until I say it is running. It reads the token from that file itself, so you never need to see it (F2).
> 5. List the connector's tools with the `listTools()` function in `src/loop/tools.ts` (an MCP `tools/list` call), and show me their four names.

**What good looks like:** one commit at tag `lab20-start`. Node 22.19 or later. `@anthropic-ai/sdk` 1.5.0 and `openai` 7.51.0. Both type checks clean, 32 TypeScript tests and 22 Python tests passing. `.secrets/` ignored, and prices filled in for each account you made (the `openai` row may stay zero if you left it for Sitting 2). On route A, the load reports `invoices 18, purchase_orders 14`. Four tool names from the connector. Your prediction: all of them. Every test replays recorded responses and needs no key.

**Check it now.** Download [Task 0's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-0.md).

**If Task 0 fails.**

| What you see | What to do |
| --- | --- |
| `npm ci` complains about the Node version | Install Node 22.19 or later, open a new terminal, and ask the agent to run step 1 again |
| A Python test fails to import a package | Ask the agent to run `cd py && uv sync --locked` again (F0) |
| The load stops with `stopped, nothing loaded` | Nothing changed on staging. The load needs Lab 19's `.secrets/db.staging.env` and `.secrets/embeddings.env`. If they are gone, take route B |
| `tools/list` gets a 401 | The token is wrong or expired. Route A: ask the agent to run `npm run token:test` again (a token lasts 10 minutes). Route B: stop the practice connector and start it again, so it reads the current `.secrets/connector.env` |
| `tools/list` cannot connect | Route A: check the address in Lab 19's `docs/deploy.md`. Route B: start the practice connector, and leave its terminal open |

## Sitting 1: the loop on the first API (about 2 hours)

**Before you start, answer in a line each:** What does the model send back when it wants a tool ([20.1](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/what-an-agent-is-in-code/))? What does a strict schema guarantee, and what does it not ([20.2](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/a-tool-is-a-name-a-description-and-a-schema/))? **After this sitting, you can:** explain the loop line by line in either language, predict each request it sends, and say what breaks the next call.

**Where you are.** The first API (`claude.ts`, or `claude_loop.py` in Python), with the connector you set up in Task 0, by route A or route B.

### Task 1. One request, one stop reason (15 minutes, Claude Code)

**Goal:** you read one real request and one real response, and name the stop reason before you see it.

**Predict:** you ask "What is 2 + 2?", with the four AP tools attached. How many turns will the loop take, and what will the stop reason be?

**In plain words.** The agent sends one simple question through the loop and shows you exactly what went out and what came back.

> Read 20.1 and 20.3 in `docs/chapter-20/`. Run `npm run ask -- --api claude "What is 2 + 2?"`. It prints the request and the response together, so show me only the request section first, and wait while I write my prediction in `ports/ch20.md`. Then show me the response section and the last line. Explain each top-level field of the response in one line each.

**What good looks like:** one request with `model`, `max_tokens`, `system`, `messages`, `tools`, `tool_choice` and `thinking`, and no `temperature` (a setting older code used, which 20.9 explains). One response, which may hold a thinking block. (The model decides whether to think. The API may leave the thinking text out and send only a signature, a sealed code that proves the block was not changed.) Then a text block saying 4, `stop_reason` `end_turn`, and a `usage` object. The summary line reads `--- stop: end_turn | turns: 1 | cost: … ---`. The cost is under a cent. Your prediction: one turn, "finished", because no tool helps with arithmetic.

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-1.md).

### Task 2. The four tools, read three ways (20 minutes, Claude Code)

**Goal:** you can read a tool definition, and say which part the model reads, which part the schema check reads, and which part only the handler can check.

**Predict:** for "Which invoices are due this week?", which tool will the model ask for, and with which inputs?

**In plain words.** The agent shows you the one file that defines the four tools, and the two small functions that turn it into each API's shape.

> Read 20.2. Show me `tools/ap-tools.json`, and compare each tool's description with the connector's own, in `servers/ap-ts/src/server.ts`. Then show me `claudeTools()` and `openaiTools()` in `src/loop/tools.ts` and `claude_tools()` and `openai_tools()` in `py/brightline_ap/loop/tools.py`, side by side. Explain the two differences between the two tool-definition shapes. Do not run anything yet.

**The code.** Here is the TypeScript conversion, and the Python one, slightly simplified. (The file adds type hints and comments.)

**New in this code.** `specs.map((s) => ({ … }))` in TypeScript and `[ … for s in specs]` in Python both mean "make a new list, with one entry for each tool in `specs`". Inside, `s` stands for one tool at a time. The extra `( )` around `{ }` in TypeScript only says that the braces hold an object, not a block of code. `specs = TOOL_SPECS` means "use the tools from `ap-tools.json` unless told otherwise". `export` lets other files use the function. `: Anthropic.Tool[]` is a type for the type check, and you can skip it.

```ts
export function claudeTools(specs = TOOL_SPECS): Anthropic.Tool[] {
  return specs.map((s) => ({ name: s.name, description: s.description, input_schema: s.input_schema, strict: true }));
}

export function openaiTools(specs = TOOL_SPECS): OpenAI.Responses.FunctionTool[] {
  return specs.map((s) => ({ type: "function", name: s.name, description: s.description, parameters: s.input_schema, strict: true }));
}
```

```python
def claude_tools(specs=TOOL_SPECS):
    return [{"name": s["name"], "description": s["description"], "input_schema": s["input_schema"], "strict": True}
            for s in specs]

def openai_tools(specs=TOOL_SPECS):
    return [{"type": "function", "name": s["name"], "description": s["description"],
             "parameters": s["input_schema"], "strict": True} for s in specs]
```

*Investigate:* the schema is the same object in both. What two things change? (The key name, `input_schema` against `parameters`, and the extra `"type": "function"`.)

**What good looks like:** four tools whose descriptions match the connector's own, word for word (on route B, the practice connector serves the same four). The agent names the two differences in the tool definitions above. (Part B's four differences are about tool calls, a different thing.) Your prediction: `list_open_invoices`, with `due_on_or_before` `2027-04-04`, `vendor_id` and `page` null, and `page_size` 10 or null (null means five a page, and a second call for the rest). All four inputs are required, so the model must clearly say "no vendor filter".

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-2.md).

### Task 3. Follow the loop, then run it (45 minutes, in two parts, Claude Code)

**Goal:** you can point to each of the loop's five steps in either language, and match every request and response of a live run to a step.

**Predict:** when the model answers in words, which line decides to end the loop, and which line actually ends it? And how many entries will the conversation array hold in the second request?

**In plain words.** Part 1: you go through the whole loop, and the agent explains any line you ask about. Take a break. Part 2: the agent runs Ana's question, and you follow the log step by step.

#### Part 1. Follow the loop (30 minutes)

> Read 20.1 to 20.5. Open `src/loop/claude.ts` and `py/brightline_ap/loop/claude_loop.py` side by side. Do not run anything. Wait while I read and write my predictions. Then answer my questions about any line, in one or two sentences each, quoting the line.

![Two columns of six shaded bands, TypeScript on the left and Python on the right. Each band is one part of the loop, in the same order. Top band, dashed: your stops first, TypeScript lines 41 to 44, Python lines 44 to 48. Step 1, call: lines 46 to 70 with the model call on line 58, and lines 50 to 77 with the call on line 65. Step 2, keep: lines 72 to 74, line 73 pushes unchanged, and lines 78 to 80, line 79 appends unchanged. Step 3, check: lines 76 to 79, line 77 decides and 78 returns, and lines 82 to 84, line 83 decides and 84 returns. Step 4, run: lines 81 to 94, the tool runs on line 87, and lines 86 to 99, on line 93. Step 5, return: lines 96 to 97 and 101 to 102, results first. An arrow on the left, labeled repeat, runs from the last band back to the first.](img/chapter-20-code-map.png)

*Figure 20.9. A map of the loop in both languages. Find a step in your language, then find its twin.*

**Where the loop starts.** Before step 1, both files open the loop and check your own stops first ([20.8](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/the-stops-you-add-yourself/)). In TypeScript, lines 41 to 44:

```ts
41  for (let turn = 1; ; turn++) {
42    // Your stops come first: turn limit, cost cap, time limit (20.8).
43    const limitStop = meter.beforeTurn(turn);
44    if (limitStop) return { stop: limitStop, answer, turns: turn - 1, costUsd: meter.spent, messages };
```

And in Python, lines 44 to 48:

```python
44    while True:
45        turn += 1
46        # Your stops come first: turn limit, cost cap, time limit (20.8).
47        if limit_stop := meter.before_turn(turn):
48            return LoopResult(limit_stop, answer, turn - 1, meter.spent, messages)
```

Both mean "count the turns, and repeat with no end of its own". (In Python, line 42 sets `turn = 0` first, so the first turn is 1.) The loop ends only at a `return`: one of your stops here, or the stop reason in step 3 below.

**Step 1, the model call.** Next comes the request, built from the instructions, the whole conversation and the tools. Then comes the call itself. In TypeScript, lines 46 to 58:

```ts
46    // Step 1. Call the model with the instructions, the whole conversation and the tools.
47    const request: Anthropic.MessageCreateParamsNonStreaming = {
48      model: o.model,
49      max_tokens: 4096,
50      system: o.instructions,
51      messages,
52      tools: claudeTools(),
53      tool_choice: { type: "auto" }, // the model decides. Forcing a tool is a 400 on current models
54      thinking: { type: "adaptive" }, // the same setting on every turn of the loop
55      ...(o.cache ? { cache_control: { type: "ephemeral" as const } } : {}),
56    };
57    o.log?.("request", request);
58    const response = await tracer.modelCall("anthropic", o.model, () => o.client.messages.create(request),
```

Lines 59 to 63 (not shown) finish the call and its trace details ([20.10](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/reading-a-trace/)). Line 64 logs the response, and lines 65 to 70 add its token counts to the cost meter (20.8). Python's lines 50 to 77 do the same. Its key lines:

```python
50        # Step 1. Call the model with the instructions, the whole conversation and the tools.
51        request: dict[str, Any] = {
52            "model": model,
...
60        if cache:  # ask the API to cache the repeated start of every request (20.12)
61            request["cache_control"] = {"type": "ephemeral"}
...
64        with tracer.model_call("anthropic", model) as attrs:
65            response: Message = await client.messages.create(**request)
```

**In TypeScript.** Line 54's `adaptive` lets the model decide on each turn whether to think. Line 55's `...( … )` adds the caching setting only when caching is on ([20.12](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/tokens-caching-and-what-a-call-costs/)). Its `ephemeral` means short-lived: the cache keeps the start of the request for a few minutes. `o.log?.( … )` on line 57 means "log it, if a log was set up". The real call to the model is `o.client.messages.create(request)` on line 58. Its `() => …` gives that call to the tracer, which runs it and records it. The call continues on lines 59 to 63. Names after `:` or `as`, such as `Anthropic.MessageCreateParamsNonStreaming` on line 47 and `as const` on line 55, are types for the type check (Chapters [13](https://agentfactory.panaversity.org/building-ai-workers/programming-fundamentals/overview/) and [14](https://agentfactory.panaversity.org/building-ai-workers/structuring-programs/async-and-await/)). You can skip them.

**In Python.** Line 65 is the real call. `**request` passes every field of the request dictionary to it.

**The main names in the code.** Three names appear everywhere in the loop. `o` holds the options the loop was given: the model, the instructions, the API client and the tool runner. `meter` counts turns and cost, and stops the loop at your limits (20.8). `tracer` records each step for the trace (20.10). If you learn only three pieces of syntax, learn `??`, `a ? b : c` and `await`, all explained below. Look up the rest when you see them.

**The code.** The main part of the loop, in TypeScript, with the line numbers from the file. Go through it twice. The first time, look only at the comment lines, Step 2 to Step 5. The second time, look at the code under each comment.

**New in this code.** A few pieces of syntax you may not have seen before.

- `response.stop_reason ?? "unknown"`: use the stop reason, or the word "unknown" if there is none. `??` means "or, if that is empty".
- `response.content.flatMap((b) => (b.type === "text" ? [b.text] : []))`: go through every block `b`, keep the text of the text blocks, and skip the rest. `.join("")` then joins the pieces into one string. Python's line 80 does the same in one line.
- `o.model` and `o.runTool` are the model and the tool runner that `o` holds, as described above. `meter.spent` is the run's cost so far. `LoopResult( … )` in Python, like the `{ stop, answer, … }` object in TypeScript, is what the loop gives back when it ends.
- In Python, `:=` (line 47 above) stores a value and tests it in one step. So Python's line 47 means "if `before_turn` gives a reason to stop, keep it in `limit_stop`".

The rest of the new syntax, in lines 81 to 97, is explained just after the excerpt.

```ts
72    // Step 2. Keep everything the model said, exactly as it came back, thinking included (20.5).
73    messages.push({ role: "assistant", content: response.content });
74    answer = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
75
76    // Step 3. Stop on any reason except "wants a tool" (20.3).
77    if (response.stop_reason !== "tool_use") {
78      return { stop: response.stop_reason ?? "unknown", answer, turns: turn, costUsd: meter.spent, messages };
79    }
80
81    // Step 4. Run every tool it asked for, and keep one result per call, matched by id (20.4).
82    const results: Anthropic.ToolResultBlockParam[] = [];
83    for (const block of response.content) {
84      if (block.type !== "tool_use") continue;
85      const outcome = await tracer.toolCall(block.name, block.id, async () => {
86        try {
87          return await o.runTool(block.name, block.input);
88        } catch (error) {
89          // A failure is still a result. The model must hear about it.
90          return { ok: false, text: `The tool failed: ${error instanceof Error ? error.message : String(error)}` };
91        }
92      });
93      results.push({ type: "tool_result", tool_use_id: block.id, content: outcome.text, is_error: !outcome.ok });
94    }
95
96    // Step 5. Send the results back in one user message, results first, then call again.
97    messages.push({ role: "user", content: results });
```

**New in lines 81 to 97.**

- `tracer.toolCall(block.name, block.id, async () => { … })`: run the code inside the braces, and record it as one step in the trace (20.10). In short, it means "run this tool, and note that you did". Python writes the same thing as `with tracer.tool_call(…) as span:`. Its lines 96 and 97 mark the span as an error when the tool failed, so the trace shows which tool failed. (In TypeScript, the tracer does that marking itself, from `outcome.ok`.)
- `await` (Chapter 14): wait for something slow, here the connector, before going on.
- Line 90's `error instanceof Error ? error.message : String(error)`: "if it is a real error, its message, and if not, whatever it is, as text". `a ? b : c` means "if a, then b, otherwise c".

The same steps in Python. If TypeScript is your language, this block is only for comparison. If Python is, this is the block to study, and the TypeScript above is for comparison.

```python
78        # Step 2. Keep everything the model said, exactly as it came back, thinking included (20.5).
79        messages.append({"role": "assistant", "content": response.content})
80        answer = "".join(b.text for b in response.content if b.type == "text")
81
82        # Step 3. Stop on any reason except "wants a tool" (20.3).
83        if response.stop_reason != "tool_use":
84            return LoopResult(str(response.stop_reason), answer, turn, meter.spent, messages)
85
86        # Step 4. Run every tool it asked for, and keep one result per call, matched by id (20.4).
87        results: list[dict[str, Any]] = []
88        for block in response.content:
89            if block.type != "tool_use":
90                continue
91            with tracer.tool_call(block.name, block.id) as span:
92                try:
93                    outcome = await run_tool(block.name, block.input)
94                except Exception as error:  # a failure is still a result: the model must hear about it
95                    outcome = ToolOutcome(ok=False, text=f"The tool failed: {error}")
96                if not outcome.ok:
97                    span["error.type"] = "tool_error"  # the trace shows which tool failed (20.10)
98            results.append({"type": "tool_result", "tool_use_id": block.id,
99                            "content": outcome.text, "is_error": not outcome.ok})
100
101       # Step 5. Send the results back in one user message, results first, then call again.
102       messages.append({"role": "user", "content": results})
```

**Questions worth asking the agent.** Each answer is checked against the code:

- "Line 77 compares with `tool_use`. What happens to a stop reason this code has never heard of?" (It ends the loop, which is safe.)
- "Where is the tool actually run, and could the model run it without this line?" (Line 87, `o.runTool`. No.)
- "Line 93 builds a result. Where does its id come from?" (From the tool call's own id, `block.id`.)
- "Why does TypeScript use `for` and Python `while True`?" (Both count turns and repeat until a `return`. It is the same loop, written differently.)

**Where the languages differ.** `messages.push` and `messages.append` do the same thing. TypeScript's `try { … } catch (error) { … }` is Python's `try: … except Exception as error: …`. TypeScript writes `!==` for "not equal", and Python writes `!=`. TypeScript also gives the result a type from the SDK, `Anthropic.ToolResultBlockParam`. Python uses a plain dictionary instead, which the SDK accepts and checks.

**End of part 1.** Take a short break before part 2.

#### Part 2. Run it, and match the log (15 minutes)

**Before you run it,** re-read your two predictions from the top of the task: which line ends the loop, and how many entries the second request will hold.

> Run `npm run ask -- --api claude "Which invoices are due this week?"`, and show me each request and response in turn, saying which of the five steps produced it.

![Two requests from one run, side by side. Request 1 holds one entry: the person's question, Which invoices are due this week. Below it, in a box, response 1: thinking and a tool call with id A1, stop reason wants a tool. Request 2 holds three entries. Entry 1 is the same question. Entry 2 is the model's whole entry, unchanged, thinking plus the tool call list_open_invoices with id A1. Entry 3, in the person's role, is the tool result for id A1, first in the entry. A curved arrow labeled same id links entry 2's call to entry 3's result. Below, response 2: the answer in words, stop reason finished. A side box lists what to check in your log: three entries, entry 2 exactly as it came back, entry 3's id matching, the loop ending after response 2. A note says A1 stands for the long id in your log.](img/chapter-20-two-requests.png)

*Figure 20.10. The two requests of Ana's run. After you run it, compare your own log with it, entry by entry. A1 stands for the long id you will see, such as `toolu_…`.*

**What good looks like:** two requests and two responses. Request 2's `messages` has three entries: the question, the model's entry (thinking and the tool call), and one result whose `tool_use_id` matches the call's `id`. The summary line reads `stop: end_turn | turns: 2`. If the model left `page_size` null, it got five invoices and a `next_page`, and asked once more. That gives three requests and `turns: 3`, which is also correct. Either way, the answer names ten invoices. Your prediction: line 77 decides (the `if`), and line 78 ends the loop (the `return`), or lines 83 and 84 in Python, and three entries.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-3.md).

**Modify (optional, 10 minutes).** Ask the agent to change line 97 on a throwaway branch, a git branch the agent deletes afterwards (Chapter 15). The change puts a text block before the results: `content: [{ type: "text", text: "Here you go." }, ...results]`. That breaks [20.4](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/running-the-tools-and-sending-back-the-results/)'s third rule, results first. Predict what the API says. Have the agent run it. Read the 400 and its message, then have the agent delete the branch. Expect a 400 saying that tool results must come first, right after the tool calls.

### Task 4. Two calls in one turn, one failing (20 minutes, Codex)

**Goal:** you see one result per call, matched by id, with the failure returned as a result.

**Predict:** the model asks for two purchase orders, and one does not exist. How many results will the next request carry, and what will the failed one's error flag be?

**In plain words.** A question that needs two lookups at once, where one fails, shows how every call gets its answer.

> Read 20.4. First run the recorded test only: `npx vitest run -t "one result per call"` and `npm run test:loop:py -- -k one_result_per_call`. Show me what each test checks in the second request it captured. Then ask live: `npm run ask -- --api claude "Is INV-8301 ready to pay, and does INV-8316 match its PO?"`. Show me the response with the tool calls, and the next request's last entry.

**What good looks like:** in the test, two `tool_result` blocks with ids `toolu_01Lab20B1` and `toolu_01Lab20B2`, the second with `is_error: true`. Live, the model may ask for both at once or one at a time. Both are correct: record which in `ports/ch20.md`. The answer says INV-8316 has no purchase order. Your prediction: two results, and `true`.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-4.md).

### Task 5. Cut a thinking block's signature (15 minutes, Claude Code)

**Goal:** you see that the conversation must go back unchanged.

**Predict:** turn 1 runs normally. Turn 2 sends the model's entry back with its thinking block's signature cut short. What comes back?

**In plain words.** The agent breaks the one rule the real loop never breaks, so you see the error once.

> Read 20.5. Run `npm run break -- cut-signature`, then `npm run break:py -- cut-signature`. Show me what each printed. Then show me `scripts/break.ts`, lines 37 to 50, and explain what it changed, and what line 40 checks first. Last, show me line 73 of `claude.ts` (or line 79 of `claude_loop.py`), and explain why the real loop never has this problem.

**The code.** The part of `scripts/break.ts` that breaks the rule on purpose:

```ts
37  } else if (which === "cut-signature") {
38    // Turn 1 runs normally. Turn 2 sends the model's entry back with its thinking block's signature cut short.
39    const first = await client.messages.create({ ...base, thinking: { type: "adaptive" } });
40    if (!first.content.some((b) => b.type === "thinking")) throw new Error("No thinking block this time, so there is no signature to cut. Run it again.");
41    const call = first.content.find((b) => b.type === "tool_use");
42    if (!call) throw new Error("The model answered without a tool call. Run it again.");
43    const edited = first.content.map((b) => (b.type === "thinking" ? { ...b, signature: b.signature.slice(0, 20) } : b));
44    console.log(`turn 1: stop_reason ${first.stop_reason}, blocks ${first.content.map((b) => b.type).join(", ")}`);
45    console.log(`sending back: ${edited.map((b) => b.type).join(", ")}, with the thinking signature cut short`);
46    await client.messages.create({
47      ...base, thinking: { type: "adaptive" },
48      messages: [question, { role: "assistant", content: edited },
49        { role: "user", content: [{ type: "tool_result", tool_use_id: call.id, content: "[]" }] }],
50    });
```

Line 40 checks that there is a thinking block whose signature it can cut. `.some( … )` means "is there at least one block that is thinking?", and `!` turns that into "is there none?". Line 41's `.find( … )` picks the first block that is a tool call. Line 43 is the break. `.map( … )` makes a new list with one entry for each block. For the thinking block, `{ ...b, signature: … }` copies the block, with its signature replaced by `.slice(0, 20)`, the signature's first 20 characters. Every other block goes back as it was. Lines 44 and 45 only print a list of each block's type, using `.map((b) => b.type).join(", ")`. Line 48 sends `edited` back where the real loop sends `response.content` unchanged. Two more pieces. `question` and `base` are set near the top of the file. They are the question, and the request settings every call shares. And `...base` copies every field of `base` into the new request, before the code adds to it.

**What good looks like:** turn 1 shows a thinking block and a tool call. (If the script says there was no thinking block this time, the model chose not to think on that turn. Ask the agent to run it again.) The second call comes back with status 400, type `invalid_request_error`, a message that the `signature` in the `thinking` block is invalid, and a request id. Your prediction: a 400 error. If it came back without an error, record that in `ports/ch20.md`. The API's documentation says to expect the error, but no one has seen it live yet. Either outcome is a pass once it is recorded.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-5.md).

**Checkpoint 1: the loop.** Before Sitting 2, check that you can do these without looking back.

- Name the loop's five steps, and point to the line in either language that ends it (20.1, [20.3](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/one-turn-request-response-and-stop-reason/)).
- Say what a strict schema guarantees, and give an input it accepts that is still wrong (20.2).
- Say what happens if a tool call gets no result, and how the loop makes sure it never does (20.4).
- Say why the model's entry must go back unchanged, and which line makes sure it does ([20.5](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/the-conversation-is-an-array-you-own/)).

## Sitting 2: the same loop on the second API (about 1 hour 10 minutes)

**Before you start, answer in a line each:** What four things are different about a tool call on the second API ([20.6](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/the-same-loop-different-shapes/))? What can you no longer see in a stateful run ([20.7](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/what-a-stateful-mode-hides/))? **After this sitting, you can:** explain the loop on both APIs, name every difference, and say what a stateful mode keeps for you.

**Where you are.** The second API now (`openai.ts`, or `openai_loop.py` in Python), with the same connector, route A or route B, and the same five steps.

**If you left the second account for now (10 minutes, by hand, F1).** Make the OpenAI API account, add a few dollars of credit, and set a $5 monthly spending limit. Make one key, and paste it into `.secrets/openai.env` as `OPENAI_API_KEY=` followed by the key. Then copy the pinned model's four prices into the `openai` row of `src/loop/config.json` (F5).

### Task 6. The loop on the second API (45 minutes, Codex)

**Goal:** you can point to the five steps in the second API's loop, name each difference from the first, and run it.

**Predict:** in the second request, how many items will the input list hold, and in what order?

**In plain words.** The same work as Task 3, on the second API. Then one change, made on purpose, shows what reasoning items are for.

> Read 20.6. Open `src/loop/openai.ts` and `py/brightline_ap/loop/openai_loop.py` beside `claude.ts`. Wait while I read. Then answer my questions, quoting the lines. When I say "run it", run `npm run ask -- --api openai "Which invoices are due this week?"` and show me each request and response, saying which step produced it.

**The code.** Steps 2 to 5 on the second API, in TypeScript. These excerpts are shortened, so they carry no line numbers. When you ask about a line, ask the agent to quote it with its number from the file.

**New in this code.**

- `/* … */` in TypeScript and `...` in Python mark lines left out here to keep the excerpt short. The full file has them. One of them sets `answer`, the text of the model's message items joined together. It comes just after step 2 (lines 74 to 77 of the TypeScript file).
- `.filter((item) => item.type === "function_call")`: keep only the items that are function calls.
- `JSON.parse(…)` and `json.loads(…)`: turn a JSON string into an object the code can use.
- `` outcome.ok ? outcome.text : `ERROR: …` `` means "if the tool worked, its text, and if not, `ERROR:` and its text". Python writes it as `a if outcome.ok else b`.
- Step 2 adds every output item to the end of the list, whatever its type. TypeScript writes `input.push(...list)`, where `...` spreads the list into separate items, and `as InputItem[]` is a type for the type check. Python writes `input_items += list(response.output)`.

```ts
    // Step 2. Keep every item the model produced, unchanged, reasoning items included.
    input.push(...(response.output as InputItem[])); // every output item goes back, unchanged

    // Step 3. Stop when the model asked for no tool, or when the response was cut short.
    const calls = response.output.filter((item) => item.type === "function_call");
    if (response.status === "incomplete") { /* … return, with the reason … */ }
    if (response.status !== "completed") return { stop: response.status ?? "unknown", /* … */ };
    if (calls.length === 0) return { stop: "done", answer, turns: turn, costUsd: meter.spent, input };

    // Step 4. Run each call. Arguments arrive as a JSON string, so parse them first.
    for (const call of calls) {
      const outcome = await tracer.toolCall(call.name, call.call_id, async () => {
        try {
          return await o.runTool(call.name, JSON.parse(call.arguments));
        } catch (error) { /* … an error result … */ }
      });
      // Step 5. One output per call_id. This API has no error flag, so the text says so.
      input.push({ type: "function_call_output", call_id: call.call_id, output: outcome.ok ? outcome.text : `ERROR: ${outcome.text}` });
    }
```

And in Python. As in Task 3, study your own language, and use the other for comparison.

```python
        # Step 2. Keep every item the model produced, unchanged, reasoning items included.
        input_items += list(response.output)
        answer = ...  # the text of the message items, joined

        # Step 3. Stop when the model asked for no tool, or when the response was cut short.
        calls = [i for i in response.output if i.type == "function_call"]
        if response.status == "incomplete":
            ...  # return, with the reason
        if response.status != "completed":
            return LoopResult(str(response.status), answer, turn, meter.spent, input_items)
        if not calls:
            return LoopResult("done", answer, turn, meter.spent, input_items)

        # Step 4. Run each call. Arguments arrive as a JSON string, so parse them first.
        for call in calls:
            with tracer.tool_call(call.name, call.call_id):
                try:
                    outcome = await run_tool(call.name, json.loads(call.arguments))
                except Exception as error:
                    outcome = ToolOutcome(ok=False, text=f"The tool failed: {error}")
            # Step 5. One output per call_id. This API has no error flag, so the text says so.
            input_items.append({"type": "function_call_output", "call_id": call.call_id,
                                "output": outcome.text if outcome.ok else f"ERROR: {outcome.text}"})
```

*Investigate:* `JSON.parse(call.arguments)` and `json.loads(call.arguments)` sit inside the `try`. What happens when an open model writes broken JSON? (The error becomes an `ERROR:` output, and the loop goes on. A recorded test on the fixture `open-malformed-args` proves it: run it with `-t malformed` and `-k malformed`. It feeds the loop a function call whose arguments are not valid JSON, and checks that the next request carries an `ERROR:` output.)

**Then modify.** Predict first: if Step 2 kept only messages and function calls, leaving out reasoning items, what would the second request do? Then:

> On a throwaway branch, change Step 2 in `openai.ts` so it keeps only `message` and `function_call` items, leaving out the reasoning items. Run the same question once. Show me what came back, then delete the branch.

![The same second request in two shapes. On the left, the first API's three entries. First, the person's question. Second, the model's entry, with thinking and a tool call with id A1 and inputs as an object. Third, one result for A1, with an error flag, false here. On the right, the second API's one flat list of four items. First, a message with the question. Second, a sealed reasoning item sent back. Third, a function call as its own item, with call id A1 and arguments as a JSON string. Fourth, a function call output as its own item for A1. It has no error flag, so on a failure the text starts ERROR. A star marks the function call and the function call output. A curved arrow links them by the same call id. A note says same loop, same five steps, only the shapes differ.](img/chapter-20-second-request-shapes.png)

*Figure 20.13. The second request on each API. Check it after you run the task. The starred items are where a tool call travels differently, and A1 stands for the real `call_…` id.*

**What good looks like:** the second request's `input` holds four items, in this order. They are the question, a `reasoning` item, a `function_call` with `call_id` `call_…`, and a `function_call_output` with the same `call_id`. Both requests carry `store: false`, the same `instructions`, and no `previous_response_id`. The summary line reads `stop: done | turns: 2`. For the change, record what you saw. The documentation says reasoning items must be passed back with tool outputs, so expect an error or a weaker answer. Which of the two comes has not yet been seen live. Either outcome is a pass once it is recorded. Your prediction: four, in that order.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-6.md).

### Task 7. The stateful contrast (25 minutes, Codex)

**Goal:** you see, in your own program's record, what a stateful run leaves out.

**Predict:** in the stateful run, what will the second call send?

**In plain words.** The same question with the provider keeping the history, so you can compare the two records.

> Read 20.7 and F4. Run `npm run stateful -- "Which invoices are due this week?"`. Show me each turn's line, then the record of what the program sent. Put it beside the second request's `input` from Task 6, running Task 6's command again if its output is gone. Then wait while I write three notes in `ports/ch20.md` on what the stateful request no longer shows. Then show me the line where the script deleted both stored responses (F4).

**What good looks like:** two turns. The second call's `input` holds one `function_call_output`, beside a `previous_response_id`, the instructions and the tools. The input tokens billed on turn 2 are about the same as in Task 6's turn 2, because the whole chain is billed as input. They should be within about a tenth either way, so compare the two `input_tokens` numbers. Your three notes name at least: the question, the reasoning item, and the function call with its arguments. Your prediction: only the tool's output and an id.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-7.md).

**Checkpoint 2: two APIs.** Before Part C, check that you can do these without looking back.

- Name four differences between the two APIs' shapes, and the one thing they share (20.6).
- Say why the arguments are parsed inside the `try` (20.6).
- Say what a stateful mode saves, what it does not save, and what it hides (20.7).

## Sitting 3: safe to run (about 1 hour 10 minutes)

**Before you start, answer in a line each:** Why is the model's own stop not enough (20.8)? Which errors should be retried (20.9)? What can a trace not prove (20.10)? **After this sitting, you can:** stop a loop that keeps going, sort an error and quote its request id, and diagnose a run from its trace.

**Where you are.** Both APIs, in your chosen language, with your connector, route A or route B. Three tasks, all on the core path.

![The last two sittings as two rows of boxes. The top row is Sitting 3, safe to run, about 1 hour 10 minutes. It starts with Task 8, stops, 20 minutes, drawn as a wide box that holds three parts. They are 8a, recorded tests, 8b, broken connector, dashed, route B only, and 8c, one-turn limit. Then come Task 9, errors, 20 minutes, and Task 10, trace, 30 minutes. Between the rows, a gold bar says: a break, then read Part D. The bottom row is Sitting 4, the rest of the API, about 1 hour 25 minutes. It starts with Task 11, stream and cache, 25 minutes, dashed and labeled advanced path. Then come Task 12, open model, 25 minutes, and a gold box, Task 13, review and ship, 35 minutes. A key says dashed means only if it applies to you, by your route or your path.](img/chapter-20-sitting-three-map.png)

*Figure 20.17. The last two sittings. Each is short enough for one session, with a break and Part D between them.*

### Task 8. A loop that will not stop by itself (20 minutes, Claude Code)

**Goal:** you see your own limits stop a loop the model would not stop.

**Predict:** the turn limit is 6, and a tool always answers "try again". How many requests will the loop send, and what will its stop reason be?

**In plain words.** A recorded run where a tool keeps saying "try again" shows the turn limit and the cost cap at work, without spending anything.

The task has three short steps. Give the agent one prompt at a time. Steps 8b and 8c use the TypeScript command `npm run ask`. For Python, ask the agent to use `npm run ask:py` with the same options.

**8a. The recorded tests (free, no live call).**

> Read 20.8. Run `npx vitest run -t "try again"`, `npx vitest run -t "cost cap"` and `npx vitest run -t "boundar"`, then the Python twins with `npm run test:loop:py -- -k "turn_limit_and_cost_cap or boundary or allow_only"`. For each test, show me how many requests it expects and the stop reason. Then show me `beforeTurn()` in `src/loop/limits.ts` and `before_turn()` in `py/brightline_ap/loop/limits.py`, and explain the order of the three checks.

(`-t` and `-k` pick tests by part of their name. `"boundar"` is not a typo: it matches both "boundary" and "boundaries".)

**The code.** `beforeTurn()` in `src/loop/limits.ts`, lines 52 to 57:

```ts
52  beforeTurn(turn: number): LimitStop | null {
53    if (turn > this.limits.maxTurns) return "turn_limit";
54    if (this.spentUsd >= this.limits.maxCostUsd) return "cost_cap";
55    if ((this.now() - this.startedAt) / 1000 >= this.limits.maxSeconds) return "time_limit";
56    return null;
57  }
```

Each line checks one stop and returns its name. `return null` means "no stop, go on". `this` is the meter itself, and `/ 1000` turns milliseconds into seconds. `this.spentUsd` is the same running total that the loop reads as `meter.spent` in Task 3: one name inside the meter, one outside. Python's `before_turn()` has the same three checks in the same order.

**You should see:** the turn-limit test captures 6 requests and stops with `turn_limit`. The cost-cap test stops earlier, with `cost_cap`. The boundary tests show the cap crossed by the last call, and `pay_vendor` refused with "not allowed for this worker".

**8b. A broken connector, live (route B only).** On route A, skip this step: your own connector cannot be broken on purpose without changing it.

> Give me the command to start a second, broken practice connector: `PRACTICE_PORT=8761 PRACTICE_BROKEN=search_policy npm run connector:practice`. I will run it in a third terminal and tell you when it is up. Then run `CONNECTOR_URL=http://127.0.0.1:8761/mcp npm run ask -- --api claude --max-turns 4 "Is there an early-payment discount?"` once. Show me each tool call and the last line. Then I will stop the second connector, with Ctrl+C in its terminal.

**You should see:** the run calls `search_policy`, gets "try again", tries again, and stops with `stop: turn_limit | turns: 4`. A model may instead give up early and answer that the policy tool is not working. That is also a pass: your limit was ready, and the model stopped first.

**8c. A one-turn limit, live.**

> Run `npm run ask -- --api claude --max-turns 1 "Which invoices are due this week, and do they match their POs?"` and show me the last line.

**You should see:** `stop: turn_limit | turns: 1`, because the question needs more than one model call.

**What good looks like:** 8a, 8b and 8c as above (8a and 8c on route A). Your prediction: 6 requests, `turn_limit`.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-8.md).

### Task 9. Three errors, three request ids (20 minutes, Claude Code)

**Goal:** you can sort an error by whose fault it is, and find its request id.

**Predict:** for each of `temperature`, `forced-tool` and `bad-key`, write the status code you expect, and whether retrying would help.

**In plain words.** Three small calls, each wrong on purpose, so you read three real errors.

> Read 20.9. Then do these steps one at a time, and wait for me after each.
> 1. Show me line 33 of `scripts/break.ts`, and explain why it needs a cast (a note that tells the type check "trust me") to send `temperature` at all.
> 2. Run `npm run break -- temperature`. Show me the status, type, message and request id it printed.
> 3. Run `npm run break -- forced-tool`, and show me the same four fields.
> 4. Run `npm run break -- bad-key`, and show me the same four fields.
> 5. Run one of the three again with `npm run break:py`, and show me that Python reports the same four fields.
> 6. Write the three request ids into `ports/ch20.md`.

**The code.** Line 33 of `scripts/break.ts`:

```ts
33    await client.messages.create({ ...base, temperature: 1 } as unknown as Anthropic.MessageCreateParamsNonStreaming);
```

The cast is `as unknown as …`. It tells the type check "trust me, this is a valid request". So the code compiles, and the API, not the type check, gets to reject `temperature`.

**You should see, after each step:** step 1, the cast on line 33. Steps 2 to 4, one error each, with a status, a type, a message and an id. Step 5, the same four fields from Python.

**What good looks like:** for `temperature`, a 400, `invalid_request_error`, and a message naming `temperature`. For `forced-tool`, a 400, `invalid_request_error`, and a message about tool choice on this model, rejected before the model runs. For `bad-key`, a 401, `authentication_error`. Each has a request id. Your prediction: 400, 400 and 401, and retrying helps none of them, because each is the request's own fault. If `temperature` or `forced-tool` does not fail, record it: the API may have changed since this chapter was checked.

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-9.md).

### Task 10. Diagnose a run from its trace (30 minutes, OpenCode)

**Goal:** you find a missing step from the trace alone.

**Predict:** if the worker cannot search the policy, what will its trace be missing?

**In plain words.** Two runs of a policy question, one with the policy tool removed by mistake. You find the mistake by reading the trace before the answer.

> Read 20.10. Run `npm run ask -- --api claude --trace --quiet "What does our policy say about an invoice with no purchase order? Cite the line."` and save `trace.jsonl` (written in the repository's top folder) as `trace-good.jsonl`. Show me each span's name and, for tool spans, its `gen_ai.tool.call.id`. Then make a throwaway branch, remove `search_policy` from `tools/ap-tools.json`, and run the same command. Show me only the new trace, not the answer, and wait for my diagnosis. Then show me the answer, and compare its citation with what `search_policy` returned in the good run. Delete the branch.

**What good looks like:** the good trace has `chat`, `execute_tool search_policy`, then `chat`, and the answer cites `po-matching.md:9`. The broken trace has one or more `chat` spans, and no `execute_tool` at all. Its answer either says it cannot check the policy, or cites a line it never looked up, perhaps the `(po-matching.md:5)` from the instructions' own example. Record which. Your prediction: an `execute_tool search_policy` span.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-10.md).

**Checkpoint 3: safe to run.** Before Part D, check that you can do these without looking back.

- Name the three stops, and say why the cost cap can be crossed by the last call (20.8).
- Sort a 400, a 401 and a 529 by whose fault each is, and say which to retry (20.9).
- Say what a trace shows about a failed tool, and what it can never show (20.10).

Take a break here. Then read Part D, and do Sitting 4.

## Sitting 4: the rest of the API, and ship it (about 1 hour 25 minutes)

**Before you start, answer in a line each:** When can a streamed tool call's input be parsed ([20.11](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/streaming/))? Which part of a request does caching make cheaper (20.12)? What five things does a loop pin ([20.13](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/versions-models-and-keys/))? **After this sitting, you can:** read a stream, see caching in the usage, run the loop on an open model, and ship it.

**Where you are.** Both APIs and an open model, in your chosen language, with your connector, route A or route B. Task 11 is on the advanced path. Tasks 12 and 13 are on the core path.

### Task 11. A stream, and a cached turn (25 minutes, Claude Code, advanced path)

**Goal:** you see a response arrive in pieces, and the cache show up in the usage.

**Predict:** in the stream, when can the tool call's input first be parsed? And with caching on, on which turn will tokens first be read from the cache?

**In plain words.** One answer streamed event by event, then the same question run twice, once with caching, so you can compare the usage.

> Read 20.11 and 20.12. Run the recorded streaming test (`npx vitest run -t streaming`), then `npm run stream:demo -- "Which invoices are due this week?"`. Show me the event types in order. Then show me the lines in `readClaudeStream()` that handle `content_block_stop`, and the Python twin in `read_claude_stream()`, and explain them. Then run `npm run ask -- --api claude --max-turns 5 "For each invoice due this week, check its purchase order."` twice, once plain and once with `--cache`. Make a table, one row per turn, of `input_tokens`, `cache_creation_input_tokens` and `cache_read_input_tokens` for each run, and each run's total cost.

**The code.** In `src/loop/stream.ts`, lines 42 to 44:

```ts
42    } else if (event.type === "content_block_stop" && toolAt.has(event.index)) {
43      const json = partialJson.get(event.index) || "{}";
44      out.toolCalls.push({ ...toolAt.get(event.index)!, input: JSON.parse(json) }); // parse once, at the end
```

And in `py/brightline_ap/loop/stream.py`, lines 44 and 45:

```python
44        elif event.type == "content_block_stop" and event.index in tool_at:
45            out.tool_calls.append({**tool_at[event.index], "input": json.loads(partial_json[event.index] or "{}")})
```

Until the block stops, the pieces only collect in `partialJson`. Line 44 (45 in Python) parses them once, when the whole input has arrived.

**New in this code.** `toolAt` and `partialJson` are lookup tables, and the block's number (`event.index`) is their key. `toolAt` holds each tool call's name and id, and `partialJson` holds the input pieces joined so far. `.has( … )` asks "is this block a tool call?", and `.get( … )` gets its entry. `|| "{}"` means "or an empty object, if nothing arrived". The `!` after `.get( … )` tells TypeScript "this is definitely there". `{ ...x, input: … }` in TypeScript and `{**x, "input": …}` in Python both mean "a copy of `x`, plus the input".

**What good looks like:** the stream shows `message_start`, then a `content_block_start`, deltas and a `content_block_stop` for each block, then `message_delta` with the stop reason and `message_stop`. The tool input is parsed at its `content_block_stop`. With `--cache`, turn 1 shows tokens written to the cache and turn 2 onward shows tokens read from it, and the total is lower. If no tokens are cached, the repeated start may be shorter than the model's minimum for caching (F5). Record it. Your prediction: at the block's stop, and turn 2.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-11.md).

### Task 12. Port to an open model (25 minutes, OpenCode)

**Goal:** the second API's loop runs, unchanged, against an open model on your own computer.

**Predict:** with a small local model, which is more likely to go wrong, the API shapes or the tool calls themselves?

**In plain words.** A local model server uses the second API's shape, stateless only. The same loop points at it and runs. You record what a small model does differently.

> Read the open-model part of 20.14 (the paragraph on open models and Ollama) and F6. Install Ollama, check it listens on `127.0.0.1` only (the check should show the address `127.0.0.1:11434`, not `0.0.0.0:11434`), and pull the model pinned in `src/loop/config.json` as `models.open`. Run `npm run ask -- --api open "Which invoices are due this week?"` three times, and `npm run ask:py -- --api open "Which invoices are due this week?"` once. Show me, for each run, the tool calls it made, whether their arguments parsed, and the last line. Then record in `ports/ch20.md` what differed from the hosted models: tool choice, argument quality, missing fields, speed. Stop the model server at the end.

**What good looks like:** the loop runs with no change to the loop code. The only difference is the setting `openModel: true`, which leaves out the `include` line that asks for encrypted reasoning (F3). At least one run calls `list_open_invoices` and answers from its result. Some runs may call the wrong tool, write wrong arguments (which the connector may refuse, giving an `ERROR:` output) or answer without a tool. The cost is $0.0000, because the open model's prices are zero, and `ask` checks prices only for the two paid APIs. Your prediction: the tool calls. The shapes are the server's job, and it matches them.

**Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-12.md).

### Task 13. Review and ship (35 minutes, Claude Code)

**Goal:** a reviewed pull request, merged by you, tagged `ch20`.

**In plain words.** You review everything the sittings used, with two reviewers, and merge it.

> 1. Show me every pin: the SDK versions in `package.json` and `py/pyproject.toml`, the `anthropic-version` header in a recorded test's request, the model ids and `checked_on` in `src/loop/config.json`, and the prompt's file name (20.13).
> 2. Run `npm run typecheck`, `npm run typecheck:py`, `npm run test:loop` and `npm run test:loop:py`, and show me the table.
> 3. Add `docs/loop.md`: the loop's five steps, each with its line in both languages, the three limits and their values, and the one-line invariant from 20.14 (the one rule that is always true of the loop).
> 4. Make sure `ports/ch20.md` has every prediction, every result and the three request ids from Task 9, and move `trace-good.jsonl` from Task 10 into `ports/`, which Lab 21 compares with.
> 5. Commit the work on a new branch `lab20`. Run `/code-review` and `/security-review` on it, and fix or answer every finding. An answer says, in one line, why the finding does not apply. Check especially: no key or token printed or committed, and no `temperature`, `top_p` or `top_k` outside `scripts/break.ts` and `py/brightline_ap/experiments.py`.
> 6. If this repository has no GitHub remote yet, make a private one with `gh repo create brightline-ap --private --source . --remote origin`, then push `main` and `lab20`. Open the pull request from `lab20`, with a short description of what changed, and show me both reviews. I will merge.
> 7. After I say it is merged, tag the merge `ch20`, push the tag, and in a clean clone of the tag, install as Task 0 did (`npm ci`, then `cd py && uv sync --locked`) and run the four checks of step 2.

**You should see, step by step:** Step 1, a short list of pins, one per line. Step 2, a table with four rows, all passing (32 TypeScript tests and 22 Python tests at the start of this lab). Step 3, a new `docs/loop.md` of about a page. Step 4, `ports/ch20.md` with no empty prediction. Step 5, two review reports, each finding fixed or answered. Step 6, a pull request link, which shows as merged once you merge it. Step 7, the four checks passing again from the clean clone, and `git tag` on that clone listing `ch20`.

**What good looks like:** both reviews have no open finding. The clean clone passes all four checks, with no key, because every test replays recorded responses.

**Check it now.** Download [Task 13's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch20-key-task-13.md).

## If something goes wrong

| What you see | Why | What to do |
| --- | --- | --- |
| 400 about `tool_use` ids or `tool_result` blocks | A result is missing, out of place, or not first in its entry | Compare the request with 20.4's four rules. The real loop never does this, so look for a changed copy |
| 400 about a thinking block | The model's entry was edited or rebuilt before it was sent back | Send `response.content` back exactly as it came (20.5) |
| 400 naming `temperature`, `top_p` or `top_k` | An old sample or helper set a sampling parameter the current API version rejects | Remove it (20.9, 20.13) |
| 400 about tool choice | A forced tool choice, rejected on a current model | Use `auto`, with strict tools (20.2) |
| 401 | The key file is wrong, empty, expired, or for another project | Check `.secrets/anthropic.env` or `.secrets/openai.env` in your editor, never in a chat |
| 429, 503 or 529 after retries | Too many requests, the service is busy, or (second API) the spend limit or credits ran out | Read the error's code. For a spend limit or credits, raise the limit or add credits ([F1](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/field-guide-agent-loop-by-hand/#f1-accounts-keys-and-spending-limits-by-you)). Otherwise wait a minute and run again. The SDK already retried twice |
| The loop stops at `turn_limit` on a simple question | The model kept calling tools | Read the log: a tool that fails or returns too little leads to more calls (20.8) |
| `cost_cap` on the first turn | The prices in `config.json` are far too high, or the cap far too low | Check the prices against the pricing page (F5) |
| The model answers without calling a tool | The question did not need one, or the descriptions did not fit it | Read the tool descriptions as the model would ([Chapter 17](https://agentfactory.panaversity.org/building-ai-workers/connectors-and-mcp/overview/)). Never force a tool |
| An open model writes broken arguments | Small models are weaker at tool calls | The loop returns an `ERROR:` output and goes on. Try another pinned model, and record it (Task 12) |
| Lab 19's database tests (`npm run test:py`, `npm run test:servers`) expect 16 open invoices and find 13, or find no `.secrets/db.dev.env` | Your dev database still holds Lab 19's rows (route A), or this folder has no database (route B): Task 0 loaded this lab's rows only into staging | This lab's checks are the four loop checks. On route A, to run Lab 19's too, load dev with the test embedder first ([F2](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/field-guide-agent-loop-by-hand/#f2-the-connector-route-a-or-route-b)) |
| The connector answers 401 | The test token expired, or the practice connector was started before the token file changed | Make a new token (route A), or stop and restart `npm run connector:practice` (route B) |

## Apply it to your vertical (optional)

Pick a business you know where a worker would need two or three read-only tools. For example, a clinic's appointment book, a school's timetable, or a shop's stock list. Ask your coding agent to write the tools as JSON Schema, with every field required and no extras. Write one question that needs two of them in one turn. Then write, in plain words, the three stops you would set and why.

## Exam notes

CCDV-F is the Claude Certified Developer foundations exam, and CCAR-F the Claude Certified Architect foundations exam. The note on the second API is from the book's OpenAI competency map.

- **CCDV-F, debugging (primary):** errors by kind, request ids, retries, and traces (20.9, 20.10).
- **CCDV-F, API mechanics, configuration and SDKs (primary):** streaming, usage and caching, versions, pinning and keys (20.11 to 20.13).
- **CCDV-F, building agents (supporting):** the loop itself (20.1 to 20.5).
- **CCAR-F, agentic loops and session state (primary):** the loop, stop reasons, tool results and limits (20.1, 20.3, 20.4, 20.8). **CCAR-F (supporting):** tool definitions and results (20.2, 20.4).
- **The OpenAI competency map (primary):** the second API's loop, state and the OpenAI part of [20.14](https://agentfactory.panaversity.org/building-ai-workers/agent-loop-by-hand/how-todays-tools-realize-it/) (20.6, 20.7).
- **For the exam,** know that the first API's newest version rejects `temperature`, `top_p` and `top_k`, and that forcing a tool is rejected on its newest models. If the official guide still teaches either as current, expect the exam to follow the guide.

## Artifact checklist

- [ ] `tools/ap-tools.json`, `prompts/ap-worker.v1.md`, `src/loop/config.json` with prices and `checked_on`
- [ ] `src/loop/claude.ts`, `openai.ts`, `tools.ts`, `limits.ts`, `trace.ts`, `stream.ts`, and their Python twins in `py/brightline_ap/loop/`
- [ ] `scripts/ask.ts`, `break.ts`, `stateful.ts`, `stream-demo.ts`, and `py/brightline_ap/ask.py` and `experiments.py`
- [ ] `tests/loop.spec.ts`, `tests/practice-connector.spec.ts`, `py/tests/test_loop.py`, and `tests/fixtures/loop/`
- [ ] `docs/loop.md`, and `ports/ch20.md` with every prediction, result and request id
- [ ] Tag `ch20`
