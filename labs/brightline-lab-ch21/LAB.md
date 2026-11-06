# Lab 21: the AP worker on two agent SDKs

Chapter 21 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 21: the AP worker on two agent SDKs](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/lab/), so you can do the lab without the book.

*This is the lab page for [Chapter 21](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/overview/). The first SDK is the Claude Agent SDK, and the second SDK is the OpenAI Agents SDK. Read each part of the chapter, then do its sitting here. The chapter tells you when. The field guide ([F0](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/reference/#f0-the-repository-the-overlay-and-the-pins) to [F7](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/reference/#f7-the-tool-runners-default-on-the-wire)) is on the companion page, **[Chapter 21 reference](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/reference/)**.*

| Sitting | Do it after | Tasks | Time |
| --- | --- | --- | --- |
| Getting ready, and Sitting 1 | Part A ([21.1](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/from-your-loop-to-a-library/), [21.2](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/the-map/)) | Task 0, Task 2, optional Task 1 | about 35 minutes |
| Sitting 2 | Part B ([21.3](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/one-run-start-to-finish/) to [21.5](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/who-may-run-a-tool/)) | Tasks 3 to 7, optional Task 8 | about 2 hours 5 minutes, 15 more with Task 8 |
| Sitting 3 | Part C ([21.6](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/what-counts-as-done/) to [21.8](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/where-traces-go/)) | Tasks 9 to 11, optional Task 12 | about 1 hour 15 minutes |
| Sitting 4 | Part D ([21.9](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/what-an-sdk-still-leaves-to-you/)) | Tasks 14 and 15, optional Task 13 | about 40 minutes |

## Lab 21: getting ready

The lab runs in four sittings. Each one comes right after its part of the chapter, and the chapter tells you when. Read this setup, then do Task 0. F0 to F7 means a section of the field guide, the step-by-step reference for this lab. It is on the companion page, Chapter 21 reference.

**You** **predict**, **the agents write.** This lab uses PRIMM-AI+, as in Chapters [13](https://agentfactory2.panaversity.org/building-ai-workers/programming-fundamentals/overview/), [14](https://agentfactory2.panaversity.org/building-ai-workers/structuring-programs/overview/) and 20. You *predict* and write it in `ports/ch21.md`. The agent *runs* the code. You *investigate* the gap with the agent ("explain line 53"). Some tasks ask you to *modify*: you say what to change, predict again, and run again. Tasks 6 and 10 ask you to *make* a rule. You write it in plain words, the agent writes the code and its test, and you check the code against your words.

**The lab starts from a portable specification.** `docs/worker-spec.md` says, in eleven rows, what the worker must do on any runtime, and how you check each row. Both SDK builds and the port meet it. Task 15 checks it row by row.

**The lab's files already hold both workers.** `brightline-lab-ch21.zip` ([download it here](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21.zip)) holds the finished code and its tests, in both languages. So most tasks are predicting and running. In Task 15 you review it all and merge it.

**This lab costs a little money, and its core path takes about 4 hours 35 minutes.** Tasks 1, 8, 12 and 13 are optional and marked so. Each deepens one idea the concepts already teach, and skipping them leaves nothing later broken. With them, the lab takes about 5 hours 50 minutes. Every run on the first SDK has a cost cap of 10 cents, and every run on both has a turn limit. Expect under $1 on each API in all. The open-model port is free.

**The date in this lab** is Thursday, April 1, 2027, two days after Lab 20. "This week" still means up to Sunday, April 4.

**Your model may differ a little.** The "**What good looks like**" results come from the authors' runs. Those runs used the real SDKs, harness and connector with a scripted stand-in model, so the model's words and the costs are examples. A real model can choose another tool or other words from run to run. If what you see differs a little from **What good looks like**, trust what you see and record it in `ports/ch21.md`.

**One stop rule.** If Task 0 or Task 3 fails in a way **If something goes wrong** does not cover, stop and record what you saw. Every later task needs the API, the SDK and the connector working.

### Before you start

**What you need.**

- Everything Lab 20 needed: **Node 22.19 or later** and **uv** 0.11 or later for Python 3.12 or later. Also git, the GitHub CLI (`gh`), and the desktop apps of Claude Code, Codex and OpenCode version 2, each signed in ([Chapter 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/overview/)).
- **Your two API keys from Lab 20,** pasted with your own editor into this folder's `.secrets/anthropic.env` and `.secrets/openai.env`, each in a project or workspace with a monthly spending limit (Chapter 20, F1). If you skipped Lab 20, [F1](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/reference/#f1-keys-and-spending-limits) here says what to do.
- **About 1.5 GB of free disk**, most of it for the first SDK, which brings its own harness program to each language (the program that runs the loop, 21.1).
- **For the port:** Ollama and the small model from Lab 20 ([F6](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/reference/#f6-ollama-and-an-open-model)).
- **A connector,** as in Lab 20, by one of two routes. **Route A:** your [Chapter 19](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/overview/) staging connector (the test copy of Brightline's real connector) with a short-lived test token. **Route B:** the local practice connector in the zip, which runs on your own computer.

**How every task runs.** Chapter 12's five steps:

1. A fresh session with the named agent, in `brightline-ap/`.
2. Plan mode, with the task's prompt as the brief.
3. Manual mode: approve each command.
4. Evidence: the agent shows what proves the task is done, and you check it against **What good looks like**.
5. A line in `ports/ch21.md`: the task, your prediction, what happened, and any surprise.

**What you do by hand, and only this.** Check that both key files exist (never open them in a chat), and fill in cells of the mapping table. Write two rules in plain words (Tasks 6 and 10), and decide when to merge. Agents do everything else. **No API key or token passes through a chat.**

**Rules the agents follow.** `AGENTS.md` says: never print, read aloud or copy anything in `.secrets/`. Run live calls only through `npm run sdk` and `npm run sdk:py`, which set a turn limit, and on the first SDK a cost cap. Never set a permission mode that skips permissions. Ask before any call to a model API. Claude Code's and OpenCode's own settings still deny reading `.secrets/`, as in Lab 20, and ask before `npm run sdk`. Codex's settings cannot deny reading a file, so for Codex the rule in `AGENTS.md` is the guard.

**Two harnesses at once.** Your coding agent is a harness. In this lab it runs a program that starts another harness, the first SDK. They are separate: the worker does not get your coding agent's tools, settings or sign-in. 21.9 shows the options that make sure of it.

![What runs where in the lab. You direct your coding agent, a harness. It runs npm run sdk, or sdk:py, the lab's script. The script reads the key and token from .secrets. The script starts the worker, one SDK or the other: the first SDK, a second harness running as its own program, or the second SDK, a runner inside the script. The worker calls out to the model API with the key, or to a local model in Task 14, and to the connector over MCP with the test token. Your coding agent is never given the key or the token.](img/chapter-21-what-runs-where.png)

*Figure L21.1. What runs where in the lab. Your coding agent starts the worker, but is never given the key or the token.*

**Words in the prompts.**

| Word in a prompt | What it means |
| --- | --- |
| `npm run sdk -- --sdk claude "…"` | Runs one question on the first SDK and prints one line per message. `--sdk openai` uses the second SDK, `--sdk open` the second SDK on an open model, and `--sdk runner` the tool runner (rung 2). `npm run sdk:py` is the Python twin |
| `--max-turns N`, `--budget USD` | Lower the turn limit, or the first SDK's cost cap, for one run |
| `--persist`, `--resume ID` | Let the first SDK write a **session file** (a file on disk holding the whole conversation, [21.7](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/where-the-conversation-lives/)), or continue an earlier one by its id |
| `--built-ins` | Task 5 only, TypeScript only: leave the first SDK's own tools on, to compare |
| `--trace` | Task 12 only: turn the second SDK's tracing on |
| `npm run test:sdk`, `npm run test:sdk:py` | The offline tests for this lab, in TypeScript and Python. No model, no network, no key |
| `npm run connector:practice` | Start the practice connector on `127.0.0.1:8760` (route B). `PRACTICE_BROKEN=search_policy` makes its policy tool answer "try again" |

**Your agents can read this chapter.** `docs/chapter-21/` holds the chapter, the companion reference page and the field guide as text. Each prompt names what to read.

### Task 0. Set up (20 minutes, Claude Code)

**Worker spec rows:** all (setup).

**Goal:** your coding agent starts this folder's git history, and installs and pins both SDKs in both languages. It runs every test that needs no network, and gets a connector the worker can reach. To **pin** a package is to name one exact version, such as 0.21.0, so an install never picks up a newer one by surprise.

**Predict:** the first SDK's Python package and its TypeScript package are both about the same harness. Will each one bring its own copy of the harness program?

> Read `README.md`, `AGENTS.md`, and `docs/chapter-21/field-guide.md`, sections F0 to F2.
>
> 1. Put this folder under git, with a main branch. Make a first commit of everything here with the message "Start from the end of Chapter 20", and tag that commit `lab21-start`. If git has no name and email yet, set them for this project only. Show me `git log --oneline -1` and `git tag`.
> 2. Install with `npm ci`, then `cd py && uv sync --locked`. Show me the versions of the two agent SDKs in each language (`npm ls --depth=0`, and `uv pip list` in `py/`), and check each is pinned to an exact version.
> 3. Run `npm run typecheck:sdk`, `npm run typecheck:sdk:py`, `npm run test:sdk` and `npm run test:sdk:py`. Show me the four results as a table. Then run Lab 20's `npm run test:loop` and `npm run test:loop:py`, to show nothing broke.
> 4. Connector, as in Lab 20's Task 0. On route A, make a new test token as Chapter 20's F2 says (it lasts 10 minutes). On route B, write `CONNECTOR_URL=http://127.0.0.1:8760/mcp` and a random `CONNECTOR_TOKEN` into `.secrets/connector.env` with a short script that never prints it, then tell me to start Lab 20's practice connector in a second terminal with `npm run connector:practice`, as in Lab 20. It reads the token from that file itself, so you never see it.
> 5. Show me the size of the first SDK on disk in each language, and where its harness program is.

**What good looks like:** one commit at tag `lab21-start`. `@anthropic-ai/claude-agent-sdk` 0.3.318 and `@openai/agents` 0.21.0, and Python `claude-agent-sdk` 0.2.178 and `openai-agents` 0.24.0, each pinned exactly. Both type checks clean, and 15 TypeScript tests and 13 Python tests passing. Lab 20's `npm run test:loop` and `npm run test:loop:py` still green: 32 and 22.

**Check it now.** Download [Task 0's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-0.md).

**If Task 0 fails.**

| What you see | What to do |
| --- | --- |
| `npm ci` complains about the Node version | Install Node 22.19 or later, open a new terminal, and ask the agent to run step 2 again |
| A Python import of `agents` fails | Check no file named `agents.py` exists anywhere in `py/`: it would hide the SDK, which is imported as `agents` |
| The harness program is missing | Ask the agent to reinstall the first SDK's package (F0). Some installers skip optional files for your platform |
| A warning about a deprecated package, or that a newer pyright is available | Not an error. Go on, and change no pin (`AGENTS.md`) |
| A test about `env` fails | Your shell has a variable the worker must not inherit, and the test caught it. Read 21.9 |

## Lab 21, Sitting 1: the map (about 15 minutes, 45 with the optional Task 1)

**Before you start, answer in a line each:** What is the difference between a tool runner and a harness (21.1)? What three kinds of answer go in the mapping table (21.2)? **After this sitting, you can:** fill in the first column of the mapping table from your own code. With the optional Task 1, you can also say where the tool runner put the conversation.

### Task 1 (optional). Your loop, replaced by a tool runner (30 minutes, Claude Code)

*Optional.* This task shows the smallest rung, and the default from 21.1, in a real request. Skip it on the core path: no later task needs it.

**Worker spec rows:** 3.

**Goal:** the agent shows you the tool runner beside your Chapter 20 loop and runs one question on it. You can then say which steps it took over, and you have seen one default it chose for you in a real request.

**Predict:** of your Chapter 20 loop's five steps, which will still appear in `tool-runner.ts`? And how many entries will the second request's conversation hold?

> Read 21.1.
>
> 1. Open `src/loop/claude.ts` and `src/sdk/tool-runner.ts` side by side (in Python: `py/brightline_ap/loop/claude_loop.py` and `py/brightline_ap/sdk/tool_runner.py`). Do not run anything.
> 2. Wait while I write my predictions.
> 3. Show me which lines of the loop have no match in the tool runner.
> 4. When I say "run it", run `npm run sdk -- --sdk runner "Which invoices are due this week?"` (in Python: `npm run sdk:py -- --sdk runner "…"`) with request logging on (F3).
> 5. Show me the second request's `messages`.

**The code.** The heart of the tool runner, in TypeScript:

```ts
19      // One call replaces the loop: call, keep, check, run each tool, return its result, call again
20      const runner = client.beta.messages.toolRunner({
21        model: s.model,
22        max_tokens: 4096,
23        system: readFileSync("prompts/ap-worker-sdk.v1.md", "utf8"),
24        // Each MCP tool, wrapped so the runner can call it. The cast only bridges two libraries' types
25        tools: mcpTools(tools, mcp as Parameters<typeof mcpTools>[1]),
26        messages: [{ role: "user", content: question }],
27        max_iterations: s.maxTurns, // your turn limit, now an option
28        thread: false, // by default the runner keeps the conversation on the provider's side (21.1). false sends it all, as in Chapter 20
29      });
```

[//]: # "details"
**The same in Python.**

```python
25              # One call replaces the loop: call, keep, check, run each tool, return its result, call again
26              runner = client.beta.messages.tool_runner(
27                  model=model,
28                  max_tokens=4096,
29                  system=Path("prompts/ap-worker-sdk.v1.md").read_text(),
30                  tools=[async_mcp_tool(t, mcp) for t in tools],  # each MCP tool, wrapped so the runner can call it
31                  messages=[{"role": "user", "content": question}],
32                  max_iterations=max_turns,  # your turn limit, now an option
33                  thread=False,  # by default the runner keeps the conversation on the provider's side (21.1)
34              )
```

[//]: # "/details"

**In plain words, line by line:**

- **Line 20** **(Python 26).** One call to the tool runner replaces your whole loop. It sits under `beta`, because the provider still calls this feature a test version.
- **Lines 21 to 23 (27 to 29).** Step 1's settings: the model, the longest reply allowed, and the worker's instructions, read from a file.
- **Line 25 (30).** The connector's tools, each wrapped so the runner can call it. In TypeScript, `mcp as Parameters<typeof mcpTools>[1]` only tells the type checker that the two libraries agree. It does nothing when the program runs. In Python, `[... for t in tools]` makes one wrapped tool for each tool in the list.
- **Line 26 (31).** The conversation starts with one entry: Ana's question.
- **Line 27 (32).** Your turn limit, now an option.
- **Line 28 (33).** Send the whole conversation every turn, as in Chapter 20.

*Investigate:* Step 1's settings are mostly still here. They are the model, the output limit, the instructions, the tools, and the question. What is gone? (Steps 2 to 5: keeping the reply, reading the stop reason, running each tool, returning each result.) And where did your turn limit go? (It became an option, `max_iterations`.)

**Then modify.** Predict first: if line 28 (Python line 33) is deleted, what will the second request carry?

> 1. On a throwaway branch, delete the `thread: false` line in `tool-runner.ts` (in Python: the `thread=False` line in `tool_runner.py`).
> 2. Run the same question once.
> 3. Show me the second request's body and its beta header.
> 4. Delete the branch.

**What good looks like:** two turns, `stop: end_turn | turns: 2`, and the answer names ten invoices, $24,927.63 in all. With line 28, the second request's `messages` holds three entries: the question, the model's reply with its tool call, and the tool result. Without it, the second request holds only the tool result, a `thread` field with `"type": "continue"` and the earlier reply's id, and a beta header naming message threads. A beta header is a line sent with the request that turns on a feature still in testing. There are no instructions, no tools and no history.

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-1.md).

### Task 2. Read the spec, and start the mapping table (15 minutes, you)

**Worker spec rows:** all.

**Goal:** you fill in the "What it did" column of the table from what you know, and the agent checks each cell against your Chapter 20 code.

**Predict:** which row of the table do you expect the SDKs to leave to you?

> Read 21.2 and `docs/worker-spec.md`.
>
> 1. Open `docs/sdk-map.md`. It holds the empty table from 21.2, and one more row that Task 10 fills in.
> 2. Wait while I fill in the "What it did" column.
> 3. Check each of my cells against `src/loop/claude.ts`, `src/loop/tools.ts`, `limits.ts`, `trace.ts` and `scripts/ask.ts`. Quote the line that proves it, or say where I am wrong.
> 4. Do not fill in the SDK columns.

**What good looks like:** thirteen filled rows, each with a line number from your Chapter 20 code, and the fourteenth row left for Task 10. The agent corrects at most a cell or two.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-2.md).

## Lab 21, Sitting 2: what it can do without asking (about 2 hours 5 minutes, 2 hours 20 with the optional Task 8)

**Before you start, answer in a line each:** What four things do you collect about every run, and which might an SDK not give you (21.3)? Why does a worker that reads vendor notes not need a shell, and who runs a hosted tool's call ([21.4](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/tools-and-where-each-call-runs/))? Name the two shapes in which your rule decides a tool call (21.5). **After this sitting, you can:** read one question's run on both SDKs, say which tools each worker can see, and show one rule deciding the same call in both shapes.

### Task 3. One question, one stream (25 minutes, Claude Code)

**Worker spec rows:** 1, 2, 3.

**Goal:** you work through the worker's main function, the agent runs Ana's question, and you match each message in the stream to a line of your Chapter 20 loop.

**Predict:** write the stream you expect for "Which invoices are due this week?", one line per message, before anything runs. How many tools will the init message list?

> Read 21.3.
>
> 1. Open `src/sdk/claude-agent.ts` and show me `askClaude()` only (in Python: `ask_claude()` in `py/brightline_ap/sdk/claude_agent.py`). Do not run anything.
> 2. Wait while I write my predicted stream in `ports/ch21.md`.
> 3. Run `npm run sdk -- --sdk claude "Which invoices are due this week?"` (in Python: `npm run sdk:py -- --sdk claude "…"`).
> 4. Show me the stream. For each message, name the line of my Chapter 20 loop it reports.

**The code.** The whole loop is now one call, in TypeScript:

```ts
75    try {
76      // Chapter 20, Steps 1 to 5: one call runs the whole loop, and streams every message it makes (21.3)
77      for await (const message of query({ prompt: question, options: claudeOptions(s, log, abort) })) {
78        show(message);
79        if (message.type === "result") {
80          // The last message: why it stopped, the answer, the turns and the cost (21.3)
81          const answer = message.subtype === "success" ? message.result : "";
82          summary = { stop: message.subtype, answer, turns: message.num_turns, costUsd: message.total_cost_usd, sessionId: message.session_id };
83        }
84      }
85    } catch (error) {
86      // After a limit, the result message comes first, then this error (21.6)
87      if (summary.stop === "unknown") summary.stop = abort.signal.aborted ? "time_limit" : `error: ${String(error)}`;
```

[//]: # "details"
**The same in Python.**

```python
111         # Chapter 20, Steps 1 to 5: one call runs the whole loop, and streams every message it makes (21.3)
112         async for message in query(prompt=question, options=claude_options(s, log)):
113             show(message)
114             if isinstance(message, ResultMessage):
115                 # The last message: why it stopped, the answer, the turns and the cost (21.3)
116                 summary = RunSummary(message.subtype, message.result or "", message.num_turns,
117                                      message.total_cost_usd or 0.0, message.session_id)
```

[//]: # "/details"

**In plain words, line by line:**

- **Line 77 (Python 112).** Start the run, and read its messages one at a time as they arrive. `for await` and `async for` are Chapter 14's async loops.
- **Line 78 (113).** Print one line for each message.
- **Line 79 (114).** Is this the last message, the result? TypeScript asks the message's `type`. Python asks whether it is a `ResultMessage`. Same question.
- **Line 81.** `a ? b : c` means "if a, then b, else c". If the run succeeded, the answer is the result's text. Otherwise it is empty text, `""`. Python has no such line: it keeps the result's text whatever the **subtype**, and the stop reason tells you whether to trust it.
- **Line 82 (116 to 117).** Keep five facts from the result: why it stopped, the answer, the turns, the cost and the session id. In Python, `x or ""` means "x, or empty text if x is empty", and `or 0.0` gives a cost of zero if none came.
- **Lines 85 to 87.** If an error arrives, and no result came before it (`stop` is still `"unknown"`), record why. The reason is the time limit if the run was stopped by your timer, otherwise the error's text.

The subtype is a word on the result message that says how the run ended, such as `success` or `error_max_turns`.

*Investigate:* where is Step 4, running the tool? (Nowhere in your file. The SDK runs it, and the `user` message reports it.) Why does line 87 check `stop` first? (So a result that came before the error is kept.)

**A note on dates.** The prompt tells the model that today is Thursday, April 1, 2027. The first SDK's harness also tells the model the real date. On a live run, a model may count "this week" from the real date on the first SDK only. If its invoices differ from the second SDK's, check which date it used, and record it in `ports/ch21.md`.

**What good looks like:** six messages. They are `system init`, two `assistant` messages (a short text, then the tool call), one `user` message with a tool result, one `assistant` message with the answer, and `result: success, turns 2`. The init lists five tools. A warning at the start says the permission callback will not be called for the four allowed tools: that is expected (21.5). The cost is under a cent.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-3.md).

**Fill in the table:** Steps 1 to 5 for the first SDK.

### Task 4. The same question, on an agent and a runner (30 minutes, Codex)

**Worker spec rows:** 1, 3, 8.

**Goal:** you see how the second SDK's worker is described and run, the agent runs Ana's question, and you can point to the agent, the runner, the connector and the history it returned.

**Predict:** how many items will the run's history hold for "Which invoices are due this week?", and in what order? And will any request carry a previous-response id?

> Read 21.3 and 21.4.
>
> 1. Open `src/sdk/openai-agent.ts`. Show me `buildWorker()` and lines 65 to 72 (in Python: `build_worker()` and lines 74 to 85 of `py/brightline_ap/sdk/openai_agent.py`).
> 2. Wait while I write my predictions.
> 3. Run `npm run sdk -- --sdk openai "Which invoices are due this week?"` (in Python: `npm run sdk:py -- --sdk openai "…"`) with request logging on (F3).
> 4. Show me the `history:` lines, and for each request the `store`, `include` and `previous_response_id` fields.

**The code.** The agent, as configuration, in TypeScript:

```ts
45    const connector = new MCPServerStreamableHttp({
46      name: "brightline",
47      url: s.connectorUrl,
48      requestInit: { headers: { Authorization: `Bearer ${s.connectorToken}` } },
49    });
50    const agent = new Agent({
51      name: "AP worker",
52      instructions: readFileSync("prompts/ap-worker-sdk.v1.md", "utf8"), // Chapter 20: the instructions
53      model: s.model,
54      // Chapter 20, 20.6: stateless, nothing kept on the provider's side, and the reasoning sent back to you
55      modelSettings: s.baseURL ? { store: false } : { store: false, providerData: { include: ["reasoning.encrypted_content"] } },
56      mcpServers: [connector],
57      tools: [flagInvoice],
58      outputGuardrails: [mustCite],
59    });
```

The runner, as the loop:

```ts
71      // Chapter 20, Steps 1 to 5: the runner runs the loop. You hand it the whole history, as in Chapter 20 (21.7)
72      let result: RunResult<any, any> = await runner.run(agent, [...history, { role: "user", content: question }], { maxTurns: s.maxTurns, signal: abort.signal });
```

[//]: # "details"
**The same in Python.**

```python
61      agent = Agent(
62          name="AP worker",
63          instructions=Path("prompts/ap-worker-sdk.v1.md").read_text(),  # Chapter 20: the instructions
64          model=s.model,
65          model_settings=settings,
66          mcp_servers=[connector],
67          tools=[flag_invoice],
68          output_guardrails=[must_cite],
69      )
```

```python
84              result = await Runner.run(agent, [*history, {"role": "user", "content": question}],
85                                        max_turns=s.max_turns, run_config=config)
```

[//]: # "/details"

**In plain words, line by line:**

- **Lines 45 to 49.** The connector, reached over MCP from your own process. Line 48 is objects inside objects: the request settings hold headers, and the headers hold `Authorization` with the test token. `Bearer` is the standard word that says "a token follows". The Python file, not shown here, passes the same `url` and `headers`.
- **Lines 50 to 59 (Python 61 to 69).** The agent, as configuration: a name, the instructions read from a file, the model, its settings, the connector, your one tool `flag_invoice`, and the guardrail of Task 10.
- **Line 55 (Python 65, built a few lines above), the condition.** `a ? b : c` reads "if a base URL is set, use the first settings, else the second". A base URL is set only for the open model in Task 14.
- **Line 55, `store: false`.** Both choices say it: the provider does not store the response.
- **Line 55, the encrypted reasoning.** The hosted model's choice also asks for the encrypted reasoning: the model's reasoning, sent back locked so you can pass it on but not read it (Chapter 20.6). It asks through `providerData`, extra settings passed straight to the provider.
- **Line 72 (Python 84 to 85).** Run the loop. `[...history, { … }]` (Python `[*history, { … }]`) means "every item of the history, then the new question": your Chapter 20 array. `maxTurns` is 8, from `config.json`, and `signal` lets your timer stop the run. `RunResult<any, any>` only names the type of the result, without checking its details.

**Where the languages differ.** TypeScript makes a runner and calls `runner.run()`. Python calls `Runner.run()` with a run configuration. TypeScript gives the history as `result.history`, Python with `result.to_input_list()`. The Python file is never named `agents.py`, because the SDK is imported as `agents` and a file of that name would hide it.

*Investigate:* which line keeps the provider from storing anything? (Line 55, `store: false`.)

**What good looks like:** `stop: done | model calls: 2` in your language, with the same answer as the first SDK. Six history items: the question, a reasoning item, the `list_open_invoices` call, its result, a reasoning item, and the answer. Every request has `store` false and `include` asking for encrypted reasoning, and none has a previous-response id.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-4.md).

**Fill in the table:** Steps 1 to 5 for the second SDK. Note the `maxTurns` and `store` lines for Sitting 3.

### Task 5. Turn the built-in tools off (20 minutes, Claude Code)

**Worker spec rows:** 2, 10.

**Goal:** the same question twice, once with the harness's own tools on and once with them off. You compare the two tool lists, and see that one option takes the built-in tools away.

**Predict:** with the built-in tools on, how many tools will the init message list? And what will the model try, when Ana asks for today's exchange rate?

> Read 21.4.
>
> 1. Show me lines 42 to 54 of `src/sdk/claude-agent.ts`, and lines 80 to 93 of `claude_agent.py`. **Both languages here, on purpose:** the two behave differently. The `env` option on line 48 replaces the environment in TypeScript but only adds to it in Python (21.9).
> 2. Run `npm run sdk -- --sdk claude --built-ins "What is today's exchange rate for the euro?"`.
> 3. Run the same without `--built-ins`.
> 4. Show me both init messages' tool lists, counted, and every line that starts with `permission:`.

**The code.** The options that decide what the worker can see, in TypeScript:

```ts
45      tools: s.builtIns ? { type: "preset", preset: "claude_code" } : [], // [] turns off every built-in tool: no shell, no files, no web (21.4)
46      settingSources: [], // read no settings files from this computer (21.9)
47      strictMcpConfig: true, // use only the servers named below, never this computer's own (21.9)
48      env: workerEnv(), // pass the subprocess only what it needs, not your whole environment (21.9)
49      mcpServers: {
50        // Chapter 20, Step 4: the connector, now connected by the harness, with the test token in a header (21.4)
51        brightline: { type: "http", url: s.connectorUrl, headers: { Authorization: `Bearer ${s.connectorToken}` } },
52        local: localTools,
53      },
54      allowedTools: READ_TOOLS.map((t) => `mcp__brightline__${t}`), // these four run without asking (21.5)
```

[//]: # "details"
**And in Python, without the comparison switch.**

```python
83          tools=[],  # turn off every built-in tool: no shell, no files, no web (21.4)
84          setting_sources=[],  # read no settings files from this computer (21.9)
85          strict_mcp_config=True,  # use only the servers named below, never this computer's own (21.9)
86          env=worker_env(),  # pass the subprocess only what it needs (21.9)
87          mcp_servers={
88              # Chapter 20, Step 4: the connector, now connected by the harness, with the test token in a header
89              "brightline": {"type": "http", "url": s.connector_url,
90                             "headers": {"Authorization": f"Bearer {s.connector_token}"}},
91              "local": local_tools,
92          },
```

[//]: # "/details"

**In plain words, line by line:**

- **Line 45 (Python 83).** "If the `--built-ins` switch is on, use the harness's own full tool set, else an empty list." The empty list turns every built-in tool off. Python has no switch: always off.
- **Lines 46 to 48 (84 to 86).** Read no settings files, use only the servers named here, and pass the harness only a short list of environment variables. 21.9 explains each.
- **Lines 49 to 53 (87 to 92).** Two servers. `brightline` is the connector, with its address and the token in a header. `local` is a small server inside your own program that offers `flag_invoice`.
- **Line 54.** `.map(...)` makes a new list from an old one. For each read-only tool name `t`, it writes `mcp__brightline__` before it, which is how the harness names a server's tools. These four run without asking.

*Investigate:* line 51 is your Chapter 20 connector call, moved into the options. What would lines 46 to 48 each do if left out? Ask the agent.

**What good looks like:** with `--built-ins`, about thirty tools in all. The authors saw 33: 28 built in and the worker's five. They include a shell, file tools, web tools, planning and scheduling tools. The model may ask for the shell or the web fetcher. If it does, you see `permission: Bash -> deny` (or `WebFetch`), and the model says it cannot look that up. Without `--built-ins`, five tools, no permission lines, and a one-turn answer.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-5.md).

**Fill in the table:** "Which tools may run" for the first SDK. You name them, and an empty list turns the rest off.

### Task 6. Specify the permission rule, then check the code (25 minutes, Claude Code)

**Worker spec rows:** 4, 5.

**Goal:** you write a rule for the one tool with an effect in plain words, then check the agent's code and tests against it. You also run one question that should be allowed and one that should be denied.

**Predict:** before the agent shows you any code, which of these should the rule allow? (a) INV-8316, reason "No purchase order on file." (b) ALL, reason "check everything". (c) INV-8316, reason "why". (d) any tool other than `flag_invoice`.

> Read 21.5.
>
> 1. Wait while I write, in `ports/ch21.md`, my rule for `flag_invoice` in one or two plain sentences.
> 2. Show me `decideTool()` in `src/sdk/policy.ts`, lines 56 to 61 of `claude-agent.ts`, and the tests for rule 1 in `tests/sdk.spec.ts` (in Python: `decide_tool()` in `py/brightline_ap/sdk/policy.py`, lines 75 to 78 of `claude_agent.py`, and `py/tests/test_sdk.py`).
> 3. For each sentence of my rule, quote the line of code that enforces it, or say that none does.
> 4. Run `npm run sdk -- --sdk claude "Please flag INV-8316 for review."`, then the same with "Flag every invoice for review." (in Python: `npm run sdk:py -- --sdk claude "…"`).
> 5. Show me the `hook:` and `permission:` lines and the answers.

**The code.** The rule, in TypeScript:

```ts
11  // Rule 1, in plain words: flag_invoice may run only for one invoice, named as INV- and four digits,
12  // with a reason of at least 10 characters. Any other tool not on the allow list is denied, with a message.
13  export function decideTool(name: string, input: Record<string, unknown>): Decision {
14    const short = name.split("__").pop() ?? name;
15    if (short === "flag_invoice") {
16      const invoice = String(input.invoice_number ?? "");
17      const reason = String(input.reason ?? "");
18      if (!/^INV-\d{4}$/.test(invoice)) return { allow: false, message: `Denied: flag one invoice by its number, such as INV-8316, not "${invoice}".` };
19      if (reason.trim().length < 10) return { allow: false, message: "Denied: a flag needs a reason of at least 10 characters." };
20      return { allow: true };
21    }
22    return { allow: false, message: `Denied: ${short} is not one of this worker's tools.` };
23  }
```

The callback that uses it:

```ts
56      canUseTool: async (name, input) => {
57        // Everything not on the allow list comes here, and the rule in policy.ts decides (21.5)
58        const d = decideTool(name, input);
59        log(`permission: ${name} -> ${d.allow ? "allow" : "deny"}`);
60        return d.allow ? { behavior: "allow", updatedInput: input } : { behavior: "deny", message: d.message };
61      },
```

[//]: # "details"
**And the Python callback.**

```python
75      async def can_use_tool(name, tool_input, context):
76          d = decide_tool(name, tool_input)
77          log(f"permission: {name} -> {'allow' if d.allow else 'deny'}")
78          return PermissionResultAllow(updated_input=tool_input) if d.allow else PermissionResultDeny(message=d.message)
```

[//]: # "/details"

**In plain words, line by line:**

- **Line 14.** The harness names the tool `mcp__local__flag_invoice`. `split("__")` cuts the name at each double underscore, and `pop()` keeps the last piece, `flag_invoice`. `?? name` would mean "or the whole name". It is only a safety net here, because `pop()` always finds a piece.
- **Lines 16 and 17.** Read the invoice number and the reason from the call. `?? ""` means "or empty text if it is missing". `String(...)` turns whatever came into text.
- **Line 18.** A **regular expression**, a small pattern for text. `^INV-\d{4}$` means "INV-, then exactly four digits, and nothing else". `!` means "not": if the number does not fit, deny, with a message that names it.
- **Line 19.** `trim()` removes spaces at both ends. A reason shorter than 10 characters is denied.
- **Line 20.** Both checks passed: allow.
- **Line 22.** Any other tool is denied.
- **Lines 58 to 60 (Python 76 to 78).** The callback asks the rule, logs `allow` or `deny`, and answers the harness. Line 60 is "if allowed, the allow answer with the input unchanged, else the deny answer with the rule's message". Python writes the same choice as `b if a else c`.

*Investigate:* why does line 22 deny every other tool, rather than allow it? (A tool that reaches the callback is, by definition, not on the allow list. The safe answer for an unknown tool is no.) Why does each denial carry a message? (The model reads it as an error result, as in Chapter 20.4, and can tell Ana why.)

**Then modify.** Ana says a flag must also never be raised on an invoice that is already paid. Predict: where would that check belong, in this rule or in the connector? Ask the agent for its answer and its reason, and write yours beside it. ([Chapter 19](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/each-companys-own-rules-and-data/)'s answer: the rule can check the shape of the request, but only the connector and the database know whether an invoice is paid.)

**What good looks like:** your rule's sentences each match a line (or you found a gap, and the agent proposes a test for it). The allow run shows `hook:` then `permission: mcp__local__flag_invoice -> allow`, and a line appears in `out/flags.jsonl`. The deny run shows `permission: … -> deny`, a `tool_result (error)`, and an answer that says the flag was refused. A real model may instead refuse with no tool call, or flag the invoices one by one, which rule 1 allows: record which.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-6.md).

**Fill in the table:** "Which tools may run", second half. Your callback decides anything not allowed.

### Task 7. The call handed back for approval, then resume (25 minutes, Codex)

**Worker spec rows:** 5.

**Goal:** the same rule as Task 6, in a different shape. You see the run pause before the tool with an effect and hand you the call. You also see your rule decide, and the run resume from its saved state.

**Predict:** for "Please flag INV-8316 for review.", how many times will the runner be called? And for "Flag every invoice for review.", will the tool run at all?

> Read 21.5.
>
> 1. Show me lines 24 to 31 and 73 to 82 of `openai-agent.ts` (in Python: lines 43 to 46 and 86 to 96 of `openai_agent.py`).
> 2. Show me `out/flags.jsonl`.
> 3. Run the two flag questions from Task 6 with `--sdk openai`, in your language.
> 4. Show me the `approval:` lines, the history, the answers, and `out/flags.jsonl` again.

**The code.** The hand-back and resume, in TypeScript:

```ts
73      // A tool that needs approval pauses the run and hands the call back. Your rule decides, and the run resumes from its saved state (21.5)
74      while (result.interruptions.length > 0) {
75        for (const item of result.interruptions) {
76          const d = decideTool(item.name ?? "", parseArgs(String(item.arguments ?? "{}")));
77          log(`approval: ${item.name} -> ${d.allow ? "approve" : "reject"}`);
78          if (d.allow) result.state.approve(item);
79          else result.state.reject(item, { message: d.message });
80        }
81        result = await runner.run(agent, result.state, { maxTurns: s.maxTurns, signal: abort.signal });
82      }
```

[//]: # "details"
**The same in Python.**

```python
87              while result.interruptions:
88                  state = result.to_state()
89                  for item in result.interruptions:
90                      d = decide_tool(item.name or "", parse_args(item.arguments or "{}"))
91                      log(f"approval: {item.name} -> {'approve' if d.allow else 'reject'}")
92                      if d.allow:
93                          state.approve(item)
94                      else:
95                          state.reject(item, rejection_message=d.message)
96                  result = await Runner.run(agent, state, max_turns=s.max_turns, run_config=config)
```

[//]: # "/details"

**In plain words, line by line:**

- **Line 74 (Python 87).** While the run has paused with calls waiting for a decision, the **interruptions**, keep going.
- **Line 76 (90).** Ask the same rule as Task 6. `item.name ?? ""` (Python `item.name or ""`) means "the tool's name, or empty text". The arguments arrive as text, so `parseArgs()` (Python `parse_args()`), a small function in `policy.ts`, turns them into an object. If the text is broken, as a small model may send, it gives an empty object. So rule 1 denies the call instead of the run crashing. `?? "{}"` means "or the text `{}` if none came".
- **Line 77 (91).** Log `approve` or `reject`, chosen by `d.allow`.
- **Lines 78 and 79 (92 to 95).** Approve the call, or reject it with the rule's message, on the saved run state.
- **Line 81 (96).** Run again, from the saved state, not from the start. Python first gets that state with `result.to_state()` (line 88).

*Investigate:* line 76 calls the same function as Task 6's callback. Why is that worth having? (One rule, one test, two SDKs.)

**What good looks like:** for INV-8316, `approval: flag_invoice -> approve`, two model calls, a new line in `out/flags.jsonl`, and an answer saying it is flagged. For "every invoice", `approval: flag_invoice -> reject`, no new line in the file, and the answer passes on your rule's refusal. To see the rejection text, ask the agent to print that history item's output: the script prints only each item's name.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-7.md).

**Fill in the table:** "Which tools may run" for the second SDK. It is an approval, decided by your rule.

### Task 8 (optional). One hook, before every tool (15 minutes, Claude Code)

*Optional.* 21.5 already teaches what this task shows: a hook runs first, and by default a hook that fails lets the call go ahead. Do it to see the order in the log.

**Worker spec rows:** 5.

**Goal:** you work through the one hook, check its place in 21.5's order against the log, and know what it can and cannot do.

**Predict:** in Task 6's deny run, which came first, the `hook:` line or the `permission:` line? And if the hook threw an error, would the tool still run?

> Read 21.5's hooks part.
>
> 1. Show me lines 37 to 41 and line 62 of `claude-agent.ts` (in Python: lines 68 to 72 and 96 of `claude_agent.py`).
> 2. Run Task 6's two questions again, and show me only the `hook:` and `permission:` lines, in order.
> 3. From the hook reference in F4, explain what a `PreToolUse` hook may return, and what happens by default if it throws an error.

**The code.** In TypeScript:

```ts
38    const logEveryCall: HookCallback = async (input) => {
39      if (input.hook_event_name === "PreToolUse") log(`hook: ${input.tool_name} ${JSON.stringify(input.tool_input)}`);
40      return {};
41    };
```

[//]: # "details"
**The same in Python.**

```python
69      async def log_every_call(hook_input: HookInput, tool_use_id: str | None, context: HookContext) -> HookJSONOutput:
70          if hook_input["hook_event_name"] == "PreToolUse":
71              log(f"hook: {hook_input['tool_name']} {json.dumps(hook_input['tool_input'])}")
72          return {}
```

[//]: # "/details"

**In plain words, line by line:**

- **Line 39 (Python 70 to 71).** If this is the moment before a tool runs (`PreToolUse`), log the tool's name and its input, written out as JSON text.
- **Line 40 (72).** Return an empty answer: no decision.
- **Python line 69.** The words after each `:` and after `->` name the types. `str | None` means "text, or nothing".

*Investigate:* `return {}` means "no decision". The hook only watches. What would it return to deny the call? (A permission decision of deny, with a reason, [F4](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/reference/#f4-the-first-sdks-permissions-and-hooks).)

**What good looks like:** the `hook:` line comes before the `permission:` line every time, matching the order in 21.5. The hook also ran for the read-only tools in Task 3, which the callback never saw. By default, a hook that throws lets the action go ahead.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-8.md).

**Fill in the table:** "The trace", first half. A hook can write your own log line for every tool call.

## Lab 21, Sitting 3: was the run safe and successful (about 1 hour 15 minutes, 1 hour 35 with the optional Task 12)

**Before you start, answer in a line each:** What three limits can end a run, and which does neither SDK keep for you (21.6)? Name the places a conversation can live (21.7). Where do traces go by default on each SDK (21.8)? **After this sitting, you can:** stop a runaway run on both SDKs, refuse an answer with no basis, find every copy of a conversation, and say what leaves your process.

### Task 9. The limits, against a tool that says "try again" (25 minutes, Claude Code)

**Worker spec rows:** 7.

**Goal:** the practice connector's policy tool is broken on purpose, as in Lab 20's Task 8, so the model never stops by itself. You watch the turn limit and the budget cap end the run.

**Predict:** with a turn limit of 4, how many model calls will be made, and what will the result message's subtype and turn count be? With a 1-cent budget, will the run stop exactly at 1 cent?

> Read 21.6.
>
> 1. Start a second practice connector with `PRACTICE_PORT=8761 PRACTICE_BROKEN=search_policy` (F2). Even on route A, start this practice connector for this task.
> 2. Run `CONNECTOR_URL=http://127.0.0.1:8761/mcp npm run sdk -- --sdk claude --max-turns 4 "Is there an early-payment discount?"` (in Python: `npm run sdk:py` in place of `npm run sdk`, in every step).
> 3. Run the same with `--budget 0.01` instead of `--max-turns 4`.
> 4. Run `CONNECTOR_URL=http://127.0.0.1:8761/mcp npm run sdk -- --sdk openai "Is there an early-payment discount?"`.
> 5. Show me each run's tool calls and its last two lines.
> 6. Show me lines 63 to 67 of `claude-agent.ts`.

**What good looks like:** with the turn limit, four tool calls to `search_policy`, then `result: error_max_turns`, reporting 5 turns. The first SDK reported one more turn than the model calls it made. Count model calls, not reported turns, when you compare SDKs. That is why 21.6 says to read each SDK's definition. With the budget, a few tool calls, then `result: error_max_budget_usd` at a cost a little over 1 cent, because the last response crossed the cap. On the second SDK, `stop: max_turns | model calls: 8`: a run stopped at the limit returns no history, so its tool calls do not print.

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-9.md).

**Fill in the table:** "Turn limit" for both SDKs, with the difference in counting. "Cost cap" (the first SDK's budget cap, still yours on the second). "Retries" from 21.6: how many times a failed call is tried again, waiting a little longer each time (the **backoff**). "Time limit": still yours on both. Line 67 hands the SDK your abort controller, the switch that stops a run. Your own timer flips it (ask the agent to show you where). "Request deadline": not set by the lab on either SDK, so your time limit covers a call that hangs.

### Task 10. Specify the guardrail, then check the code (20 minutes, Codex)

**Worker spec rows:** 6.

**Goal:** you write a rule for answers in plain words, check the agent's code and tests against it, then trip it once.

**Predict:** which of these answers should the guardrail stop? (a) "Pay it once it matches its PO (po-matching.md:5)." (b) "Yes." (c) "See po-matching.md line 9." (d) "An invoice with no PO is held until the buyer raises one (po-matching.md:9)."

> Read 21.6.
>
> 1. Wait while I write, in `ports/ch21.md`, my rule for what every answer must contain.
> 2. Show me `citesPolicyLine()` in `src/sdk/policy.ts`, `mustCite` in `openai-agent.ts` lines 33 to 40, and the tests for rule 2 (in Python: `must_cite` at lines 49 to 53 of `openai_agent.py`).
> 3. Quote the line that enforces each sentence of my rule.
> 4. Run `npm run sdk -- --sdk openai "Just tell me yes or no: can we pay INV-8301 today?"`, then the same with `--sdk claude` (in Python: `npm run sdk:py`). Show me the last line of each.
> 5. Show me where `claude-agent.ts` (in Python: `claude_agent.py`) applies rule 2 after its run, since the first SDK has no guardrail feature.

**The code.** The guardrail in TypeScript:

```ts
34  const mustCite: OutputGuardrail = {
35    name: "must_cite_a_policy_line",
36    execute: async ({ agentOutput }) => ({
37      tripwireTriggered: !citesPolicyLine(String(agentOutput)),
38      outputInfo: { cited: citesPolicyLine(String(agentOutput)) },
39    }),
40  };
```

[//]: # "details"
**The same in Python.**

```python
50  @output_guardrail(name="must_cite_a_policy_line")
51  async def must_cite(context, agent, output) -> GuardrailFunctionOutput:
52      cited = cites_policy_line(str(output))
53      return GuardrailFunctionOutput(output_info={"cited": cited}, tripwire_triggered=not cited)
```

[//]: # "/details"

**In plain words, line by line:**

- **Lines 34 and 35 (Python 50).** A guardrail on the answer, with a name that shows in errors and traces. Python marks the function with `@output_guardrail`, a line that registers it as one.
- **Line 36 (51).** The SDK calls this check with the agent's final answer.
- **Line 37 (52 to 53).** The tripwire is triggered when the answer does **not** cite a policy line (`!` and `not` mean "not").
- **Line 38 (53).** A small record of the result, `cited` true or false, kept with the run.

*Investigate:* the rule itself is one regular expression, `\([a-z0-9-]+\.md:\d+\)`, matched without regard to capital letters. It means an opening bracket, a file name ending in `.md`, a colon, a number, and a closing bracket. Ask the agent to explain it. What does `tripwireTriggered: true` do to the run? (The runner raises an error, and no answer is given. Line 87 of `openai-agent.ts` catches that error and reports `stop: "guardrail"` with an empty answer.)

**Then modify.** Predict: would answer (c) pass if the rule were "the answer mentions a policy file"? Ask the agent to say which test would change, without changing the code.

**What good looks like:** your sentences each match a line. The second SDK ends `stop: guardrail | model calls: 1` in your language, with no answer. The first SDK ends `stop: no_citation`: the same rule, applied by your own code after the run.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-10.md).

**Fill in the table:** "What counts as done", the fourteenth row, which has no Chapter 20 line. In Chapter 20, "done" was the model's own stop. Here the runner's rule is text with no tool calls, and your guardrail adds what the text must contain.

### Task 11. Find the conversation (30 minutes, Claude Code)

**Worker spec rows:** 8.

**Goal:** one run that writes a session file, one that resumes it, and one that writes none. You know where the first SDK writes a conversation, what is in it, and how to keep it from being written.

**Predict:** with `--persist`, in which folder will the session file appear? Will it hold the test token? Without `--persist`, will any file be written at all?

> Read 21.7.
>
> 1. Run `npm run sdk -- --sdk claude --persist "Which invoices are due this week?"`.
> 2. Find the session file under `~/.claude/projects/` by its session id. Show me its path, its number of lines, and the type of each line, without printing the tool results in full.
> 3. Search it for `Bearer`. Then, with a short script that reads `.secrets/connector.env` itself and prints only a count, search it for the test token's first eight characters. Show me the counts.
> 4. Run `npm run sdk -- --sdk claude --persist --resume <that id> "Which of those has no purchase order?"`, and show me how many entries the conversation held.
> 5. Run once without `--persist`. List every file under `~/.claude/` and your home folder's cache folder (`~/Library/Caches/` on macOS, `~/.cache/` on Linux) changed in the last minute. The worker's session file is named by the session id the run printed: any other `.jsonl` file there is your coding agent's own.
> 6. In `claude_agent.py`, show me the line that turns session files off (line 101). Then run `npm run sdk:py -- --sdk claude "Which invoices are due this week?"` and list the same folders again.
> 7. Run Task 4's question on the second SDK again, and put its `history:` lines beside the session file's lines, and say where each SDK kept the conversation.
> 8. Delete the worker's session files this task made, each named by the session id its run printed, because they hold business data, and show me they are gone.

**Both languages here, on purpose:** the two behave differently. TypeScript has an option that turns session files off. Python has none, so the lab passes the harness its own flag on line 101, `extra_args={"no-session-persistence": None}`. Step 6 checks that the flag works.

On Windows you work in WSL, as in Lab 20, so the same Linux paths apply inside WSL.

**What good looks like:** a file named `<session id>.jsonl` in a folder named after your working folder's path. It has about 25 lines for a two-call run, including the tool's result. No `Bearer` and no token. The resumed run's conversation carries the first run's entries, then the new question. The answer names INV-8316 ($389.00). The invoice list holds no purchase orders, so the model asks `get_purchase_order` to know: record how many calls it made. The runs without `--persist`, in both languages, write no session file, only small connection logs in the cache folder.

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-11.md).

**Fill in the table:** "Where the conversation lives". First SDK: a session file by default, nothing on disk with the option. Second SDK: the history your code passes, with storage off.

### Task 12 (optional). Turn tracing on once, and see what leaves (20 minutes, Codex)

*Optional.* It sends test data to the provider's dashboard, so do it only if your course or company allows that. On the core path, fill in "The trace" in Task 15, from 21.8 and [21.10](https://agentfactory2.panaversity.org/building-ai-workers/agent-sdks/how-todays-tools-realize-it/), and go through 21.8's five checks on paper.

**Worker spec rows:** 9.

**Goal:** one run with tracing on, test data only, then a look at the dashboard, then tracing off again. You see what the second SDK sends out by default, and you choose where traces go.

**Predict:** with tracing on, which of these will the provider's trace hold? The question, the tool call's arguments, the tool's result, the answer, the test token.

> Read 21.8 and F5.
>
> 1. Run `npm run sdk -- --sdk openai --trace "Which invoices are due this week?"` once (in Python: `npm run sdk:py`).
> 2. Tell me where, in the OpenAI dashboard, I can see the trace (F5), and wait while I look.
> 3. Show me line 43 of `openai-agent.ts` (in Python: line 57 of `openai_agent.py`).
> 4. From the SDK's tracing guide, explain how to replace the default trace processor with one that writes to a local file.

**What good looks like:** a trace in the dashboard with spans for the agent, each model call, the tool calls and the guardrail. You find the question, the arguments and the tool's result in it: invoice numbers and amounts. You do not find the token. Your notes in `ports/ch21.md` say what Brightline would need to agree to before tracing a real run.

**Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-12.md).

**Fill in the table:** "The trace" for both SDKs. The first exports OpenTelemetry through settings you set, and the second sends traces to the provider unless you turn it off or replace its processor.

## Lab 21, Sitting 4: what you still own, and ship (about 40 minutes, 50 with the optional Task 13)

**Before you start, answer in a line each:** Name four things an SDK in your own process still leaves to you (21.9). Which part of the worker spec does each one serve (`docs/worker-spec.md`)? **After this sitting, you can:** show a finished mapping table, run the second SDK's worker on an open model, and merge a reviewed change.

### Task 13 (optional). Compare the SDK's record with your Chapter 20 trace (10 minutes, Claude Code)

*Optional.* It shows, item by item, what the second SDK's history keeps that your Chapter 20 trace did not. No later task needs it.

**Worker spec rows:** 9.

**Goal:** the agent puts your Chapter 20 trace beside the second SDK's history. Each span is matched to an item, and the extra items are named.

**Predict:** which items will the SDK's history hold that your trace never did?

> Read 21.3 and 21.8.
>
> 1. Run `npm run sdk -- --sdk openai "What does our policy say about an invoice with no purchase order? Cite the line."`, the question of Lab 20's Task 10, and keep its history.
> 2. Show me, side by side, Lab 20's trace of the same question (`ports/trace-good.jsonl`, made in Lab 20's Task 10) and that history.
> 3. Name each span's matching item.
> 4. List the items that have no span.

**What good looks like:** each Chapter 20 span has a matching item. The SDK's history holds things your trace did not, such as the reasoning items. Your trace holds a timing for each step, which the history does not.

**Check it now.** Download [Task 13's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-13.md).

### Task 14. Port: the second SDK on an open model (20 minutes, OpenCode)

**Worker spec rows:** all, on the open model.

**Goal:** the same worker, with only its provider settings changed, pointed at the local model server from Lab 20. You record what a small model does differently.

**Predict:** which of the worker's settings must change for a local server? And what will happen to traces if tracing were on?

> Read 21.10's open-source box, the open-source box in `docs/chapter-21/reference.md`, and F6.
>
> 1. Start Ollama, listening on `127.0.0.1` only, with the larger context in F6, and the model pinned in `src/sdk/config.json` as `models.open`.
> 2. Show me lines 55 and 60 of `openai-agent.ts` (in Python: lines 59 to 60 and 70 of `openai_agent.py`).
> 3. Run `npm run sdk -- --sdk open "Which invoices are due this week?"` three times (in Python: `npm run sdk:py -- --sdk open "…"`).
> 4. For each run, show me the tool calls, whether the arguments parsed, and the last line.
> 5. Record in `ports/ch21.md` what differed from the hosted model.
> 6. Stop the model server.

**What good looks like:** the worker runs with only the provider's settings changed. They are the base URL (the address the client sends model calls to, here your own computer), a placeholder key, the Responses API (the second provider's model API, which Chapter 20 used), and the model. The encrypted-reasoning setting is left out, because Ollama ignores it: a thinking model's reasoning comes back as plain text, not encrypted. At least one run calls `list_open_invoices` and answers. Some runs may call the wrong tool, skip the citation (so the guardrail stops the run), or answer without a tool. Tracing stays off: with it on, the traces would still go to the provider (21.8).

**Check it now.** Download [Task 14's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-14.md).

### Task 15. Finish the table, and ship (20 minutes, Claude Code)

**Worker spec rows:** all.

**Goal:** you finish the mapping table and write its last part in your own words. Then two reviewers check everything, and you merge a pull request tagged `ch21`.

> 1. Wait while I fill in any cells of `docs/sdk-map.md` I have left, and write "What this still leaves to me" at the end, one line per row of 21.9's table.
> 2. Compare my table with the finished table in `docs/chapter-21/reference.md`. List every cell where mine differs, quoting the line of code or the message that decides who is right.
> 3. Check each row of `docs/worker-spec.md` against both builds and the port, and list any row a runtime could not meet.
> 4. Show me every pin: both agent SDKs and both client SDKs in `package.json` and `py/pyproject.toml`, and the model ids in `src/sdk/config.json`.
> 5. Run `npm run typecheck:sdk`, `npm run typecheck:sdk:py`, `npm run test:sdk`, `npm run test:sdk:py`, `npm run test:loop` and `npm run test:loop:py`, and show me the table.
> 6. Make sure `ports/ch21.md` has every prediction, every result and my two rules. Commit it and `docs/sdk-map.md` on a branch `lab21`.
> 7. Run `/code-review` and `/security-review` on the branch, and fix or answer every finding. Check especially: no permission mode that skips checks, no built-in tools, `settingSources` empty, `strictMcpConfig` on, the environment list short, tracing off by default, `store` false, and no key or token printed or committed.
> 8. If this repository has no GitHub remote yet, make a private one with `gh repo create brightline-ap-ch21 --private --source . --push`. Open the pull request from the branch `lab21`, with the template, and show me both reviews. I will merge.
> 9. After I say it is merged, tag the merge `ch21`, push the tag, and in a clean clone of the tag install (`npm ci`, then `cd py && uv sync --locked`) and run the six checks of step 5.

**What good looks like:** every cell of the table filled, and at most two differ from the finished table, each with a reason. "Time limit" says "still yours" for both SDKs, and "Cost cap" for the second. Both reviews have no open finding. The clean clone passes all six checks with no key, because every Lab 21 test is offline.

**Check it now.** Download [Task 15's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch21-key-task-15.md).

## Lab 21: wrapping up

### If something goes wrong

| What you see | Why | What to do |
| --- | --- | --- |
| The answer is empty, ending `stop: no_citation` (first SDK) or `stop: guardrail` (second SDK) | The answer cited no policy line, so rule 2 held it back (Task 10) | Not a failure, and not a reason to stop: record it and go on |
| The init message lists tools you did not add | The harness read this computer's settings or MCP servers, or the built-in tools are on | Check `tools: []`, `settingSources: []` and `strictMcpConfig: true` (21.4, 21.9) |
| A warning that the permission callback will not be called for some tools | Those tools are on the allow list | Expected for the four read-only tools (21.5). If it names `flag_invoice`, take it off the allow list |
| `permission:` lines never appear, though the model called `flag_invoice` | The permission mode is not `default`, or a settings file allows the tool | Check that line 55 of `claude-agent.ts` reads `permissionMode: "default",`, and that `settingSources` is empty |
| The init message shows the connector as `failed` or `needs-auth` | The connector is not running, or the token is wrong or expired | Route A: a new test token. Route B: restart the practice connector with the token in `.secrets/connector.env` |
| `error_max_turns` on a simple question | The model kept calling tools | Read the stream: a tool that fails or returns too little invites more calls |
| The Python worker's init lists servers the TypeScript one does not | The Python SDK adds `env` to the environment rather than replacing it | Ask the agent to show that `isolate_environment()` runs before the query. It is a function the lab provides, and it trims the Python program's own environment (21.9) |
| `ModuleNotFoundError` or the wrong `Agent` in Python | A file named `agents.py` hides the SDK | Rename it |
| The second SDK's run fails about a reasoning item not found | Storage is off, and the reasoning came back without its encrypted content | Check line 55 of `openai-agent.ts` (Task 4): `include` must ask for encrypted reasoning on the hosted model |
| `stop: guardrail` on every question | The model's answers carry no `(file.md:N)` citation | Read the answers. Check the instructions ask for a citation, and that `search_policy` is reachable |
| The run stops and nothing happens | A tool needing approval paused the run and handed the call back, and the approval loop at line 74 of `openai-agent.ts` (`while (result.interruptions.length > 0)`) did not run | Check the worker reads `result.interruptions` after every run |
| An open model never calls a tool | Small models are weaker at tool calls. Ollama's default context, 4k tokens on less than 24 GiB of graphics memory, can also be too small for the worker's instructions and tools | Start Ollama with the larger context in F6. If it still never calls one, record it, and try again, or another pinned model (Task 14) |

### Apply it to your vertical (optional)

Pick an agent framework or SDK you have heard of, or one in your own work. From its documentation, fill in the mapping table for it: one line per row of 21.2, and every "still yours". Then write its three most surprising defaults.

### Exam notes

CCDV-F is the Claude Certified Developer: Foundations exam, and OAI an OpenAI competency.

- **CCDV-F, agent SDKs (primary):** the run and its stream, tools, permissions and hooks, limits, sessions, and what an SDK leaves to you (21.3 to 21.7, 21.9), with the Anthropic box in 21.10.
- **CCDV-F (supporting):** tools, servers, subagents and sessions (21.4, 21.5, 21.7).
- **OAI, the Agents SDK (primary):** the runner, tools and MCP, handoffs, guardrails, approvals, state and tracing (21.3 to 21.8), with the OpenAI box in 21.10.
- **OAI (supporting, primary in Chapter 22):** running agents yourself, and what a hosted runtime takes over (21.9).
- **For the exam,** CCDV-F expects awareness of third-party agent frameworks, with no tutorial: know that they exist and how to judge one (21.9). This point is for the exam only.

### Artifact checklist

- [ ] `prompts/ap-worker-sdk.v1.md` and `src/sdk/config.json`
- [ ] `src/sdk/policy.ts`, `tool-runner.ts`, `claude-agent.ts`, `openai-agent.ts`, and their Python twins in `py/brightline_ap/sdk/`
- [ ] `scripts/sdk-ask.ts` and `py/brightline_ap/sdk_ask.py`
- [ ] `tests/sdk.spec.ts` and `py/tests/test_sdk.py`
- [ ] `docs/sdk-map.md`, every cell filled, with "What this still leaves to me", and `docs/worker-spec.md` checked row by row
- [ ] `ports/ch21.md`, with every prediction, every result, and your two rules
- [ ] Tag `ch21`

