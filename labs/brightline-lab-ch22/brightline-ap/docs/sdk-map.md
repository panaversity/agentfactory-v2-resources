# The mapping table (Lab 21)

Fill in "What it did" in Task 2, from your Chapter 20 code. Fill in one or two SDK cells at the end of each task that says **Fill in the table**. In each SDK cell write one of: **it does it** (with the option), **it does it differently** (with the difference), or **still yours**.

| The line of your Chapter 20 loop | What it did | The first SDK | The second SDK |
| --- | --- | --- | --- |
| Step 1. Call | Instructions, the whole conversation, the tools, sent every time | The harness, with its own extra settings and notes | The runner, with your `modelSettings` |
| Step 2. Keep | Add the model's reply, unchanged | The harness, one `assistant` message per block | The runner, into the history |
| Step 3. Check | Loop only while the model wants a tool | The harness. The `result` subtype is the run's stop | The runner: text and no tool calls means done |
| Step 4. Run | Call each tool through the connector, catch every failure | The harness, through MCP servers it connects | The runner in your process (or the provider, for hosted tools) |
| Step 5. Return | One result per call, matched by id | The harness. Reported as a `user` message | The runner. In the history as a function call result |
| Which tools may run | Only tools on your allow-list, `allowOnly()` (20.8). Each of those ran when asked | `tools: []`, `allowedTools`, `permissionMode`, `canUseTool`, hooks | Your list, and `needsApproval` with your rule |
| Turn limit | Checked before every call (8) | `maxTurns`, counted in round trips (a model call and the tool calls it asked for) | `maxTurns`, default 10 |
| Cost cap | Worked out from usage and prices (10 cents) | `maxBudgetUsd`, checked after each response | **Still yours** |
| Time limit | Checked before every call (2 minutes) | **Still yours**: your timer stops the run through an `abortController` | **Still yours**: your timer stops the run through a `signal` |
| Request deadline | 60 seconds per attempt, set on the client (20.8) | Not set by the lab. Your time limit covers a call that hangs | Not set by the lab. Your time limit covers a call that hangs |
| Retries | Two, by the client library, with backoff | The harness's own | The client's two, plus the runner's opt-in setting (its own retries turn the client's off) |
| Where the conversation lives | An array in your program | A session file by default, memory with the option | The history you pass, with `store: false` |
| The trace | A span per model call and per tool call, on your computer | OpenTelemetry through settings you set, and your own hook | The provider's dashboard by default, or your processor |
| What counts as done (add in Task 10) | Nothing: in Chapter 20, done was the model's own stop | The model's stop, plus limits, plus the lab's own rule-2 check after the run | The runner's rule, plus your guardrail |

## What this still leaves to me (Task 15)

One line per row of 21.9's table, in your own words, with the line of code that does it today.

- A process, and for some SDKs a disk: the first SDK starts its harness as a subprocess, so the worker needs a process that stays alive and a disk (`query()` in `src/sdk/claude-agent.ts`).
- A container and a sandbox: every built-in tool is off (`tools: []` in `claudeOptions()`), and in production the worker runs in a container (Chapter 22).
- What the process inherits: no settings files, only the named servers, and a short list of variables (`settingSources: []`, `strictMcpConfig: true`, `workerEnv()`).
- Credentials: the builder's key and a short-lived test token in `.secrets/`, read by `scripts/sdk-ask.ts`; Chapter 22 gives each person their own token.
- Where transcripts and traces live: session files off (`persistSession: false`) and tracing off (`setTracingDisabled`), and I know which folders to check.
- Cost and time: the first SDK's budget cap (`maxBudgetUsd`), and my own time limit in both (`abortController`, `signal`).
- Upgrades: every package pinned to one exact version, in `package.json` and `py/pyproject.toml`.
- What counts as done: my guardrail on the second SDK (`mustCite`), and my own rule-2 check after the first SDK's run.
