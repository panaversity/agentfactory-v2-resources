# docs/sdk-map.example.md: the mapping table, as the authors filled it (November 5, 2026)

*For readers who did not do Lab 21. If you did, read your own `docs/sdk-map.md`. For Lab 22's Task 1, only the last section matters: what an SDK in your own process still leaves to you. The table's names in code font, such as `maxTurns` or `canUseTool`, are the two SDKs' own options from Chapter 21. You do not need them here.*

From the offline run and the pinned SDKs. The same table is on Chapter 21's reference page.


| The line of your Chapter 20 loop | The first SDK | The second SDK |
| --- | --- | --- |
| **Step 1. Call** | The harness, with its own extra settings and notes | The runner, with your `modelSettings` |
| **Step 2. Keep** | The harness, one `assistant` message per block | The runner, into the history |
| **Step 3. Check** | The harness. The `result` subtype is the run's stop | The runner: text and no tool calls means done |
| **Step 4. Run** | The harness, through MCP servers it connects | The runner in your process (or the provider, for hosted tools) |
| **Step 5. Return** | The harness. Reported as a `user` message | The runner. In the history as a function call result |
| **Which tools may run** | `tools: []`, `allowedTools`, `permissionMode`, `canUseTool`, hooks | Your list, and `needsApproval` with your rule |
| **Turn limit** | `maxTurns`, counted in round trips | `maxTurns`, default 10 |
| **Cost cap** | `maxBudgetUsd`, checked after each response | **Still yours** |
| **Time limit** | **Still yours** (`abortController`) | **Still yours** (`signal`) |
| **Request deadline** | Not set by the lab. Your time limit covers a call that hangs | Not set by the lab. Your time limit covers a call that hangs |
| **Retries** | The harness's own | The client's two, or the runner's opt-in setting |
| **Where the conversation lives** | A session file by default, memory with the option | The history you pass, with `store: false` |
| **The trace** | OpenTelemetry through settings you set, and your own hook | The provider's dashboard by default, or your processor |
| **What counts as done** | The model's stop, plus limits. Your own check on the answer | The runner's rule, plus your guardrail |

## What this still leaves to me (Lab 21, Task 15)

The authors' lines, one per row of 21.9's table. Lab 22's Task 1 reads them.

- **A process, and a disk:** the first SDK's harness needs a process that stays alive and a disk, so it runs on my computer, not in an edge function.
- **A container and a sandbox:** built-in tools are off. In production, each worker would need its own container.
- **What the process inherits:** no settings files, only the MCP servers I name, a short list of environment variables.
- **Credentials:** my API keys and a short-lived test token, as me. A product would give each person their own token.
- **Where transcripts and traces live:** session files off, tracing off, and I know which folders to check.
- **Cost and time:** the first SDK's budget cap, the second SDK's cost is mine, and my own two-minute time limit on both.
- **Upgrades:** every package pinned to an exact version, upgraded on a branch with the offline tests.
- **What counts as done:** my answer check, an answer must cite a policy line. No SDK decides this for me.
