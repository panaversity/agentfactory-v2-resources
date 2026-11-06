From *The AI Agent Factory*, Chapter 21, for the coding agents working in this repository. The chapter itself is the source.

# The field guide, F0 to F7

## F0. The repository, the overlay and the pins

**What the zip holds.** `brightline-lab-ch21.zip` holds `brightline-ap/`: the repository at the end of Lab 20, with the Chapter 21 files laid over it, and no git history, which Task 0 starts. `answer-key/`, at the top of the zip and outside `brightline-ap/`, holds the expected results, and each task's own key is a separate download, linked from the task. Never give the answer key to an agent.

| Path | What it is |
| --- | --- |
| `prompts/ap-worker-sdk.v1.md` | The worker's instructions for both SDKs, versioned |
| `src/sdk/` | `policy.ts` (the two rules and `flag_invoice`), `tool-runner.ts`, `claude-agent.ts`, `openai-agent.ts`, `config.json` |
| `py/brightline_ap/sdk/` | The same in Python: `policy.py`, `tool_runner.py`, `claude_agent.py`, `openai_agent.py` |
| `scripts/sdk-ask.ts`, `py/brightline_ap/sdk_ask.py` | `npm run sdk` and `npm run sdk:py` |
| `tests/sdk.spec.ts`, `py/tests/test_sdk.py` | The offline tests: 15 and 13 |
| `docs/worker-spec.md` | The worker's portable specification |
| `docs/sdk-map.md`, `ports/ch21.md` | The table to fill in, and your record |
| `tsconfig.sdk.json`, `py/pyrightconfig.sdk.json` | Type checks for this lab's files only |

**Merging.** Six of Lab 20's files carry Lab 21's lines too: `package.json` (and `package-lock.json`), `py/pyproject.toml` (and `py/uv.lock`), `AGENTS.md`, `README.md`, `tsconfig.json` and `.gitignore`. Each is Lab 20's file with Lab 21's lines added. If you changed one of them in Lab 20, ask your agent to make your change again. Lab 21 has no practice connector of its own: it uses Lab 20's, and Lab 20's data, unchanged.

*Pins.* `@anthropic-ai/claude-agent-sdk` 0.3.318, `@openai/agents` 0.21.0, `@anthropic-ai/sdk` 1.5.0, `openai` 7.51.0, `@modelcontextprotocol/sdk` 1.32.2, `zod` 4.6.7. Python: `claude-agent-sdk` 0.2.178, `openai-agents` 0.24.0, `anthropic` 2.5.0, `openai` 3.46.0, `mcp` 2.3.0.

## F1. Keys and spending limits

Reuse Lab 20's keys and limits (Chapter 20, F1). If you skipped Lab 20, make one key in the Claude Console and one in the OpenAI platform dashboard. Each goes in its own project or workspace with a monthly limit of $5. Then paste each into its file in `.secrets/` with your own editor. The first SDK reads `ANTHROPIC_API_KEY` from the environment and does not read `.env` files, so `sdk-ask` reads `.secrets/` and sets it. This lab gives neither SDK a consumer chat-app sign-in.

## F2. The connector

**Route A.** Your Chapter 19 staging connector, with a test token for Ana at Brightline, as in Chapter 20's F2 (it lasts 10 minutes), in `.secrets/connector.env`.

**Route B.** Lab 20's practice connector, unchanged: `npm run connector:practice` in a second terminal. It reads the token from `.secrets/connector.env` itself, and listens on `http://127.0.0.1:8760/mcp`. For Task 9, start a second one with `PRACTICE_PORT=8761 PRACTICE_BROKEN=search_policy npm run connector:practice`, and point one run at it with `CONNECTOR_URL=http://127.0.0.1:8761/mcp`.

## F3. Seeing what each SDK sent

- **The tool runner and the client SDKs:** `ANTHROPIC_LOG=debug` before the command prints each request.
- **The first SDK:** its harness makes the requests, so your program's own request log does not show them. Run with `--persist` and read the session file's request records (Task 11), then delete the file.
- **The second SDK:** `OPENAI_LOG=debug` before the command shows each request's address and headers, not its body (Checked). In TypeScript, `DEBUG=openai-agents*` with `OPENAI_AGENTS_DONT_LOG_MODEL_DATA=0` prints each request's data (Checked). In Python, `npm run sdk:py` prints each request's `store`, `include` and `previous_response_id` itself.
- **Never** leave debug logging on for real data: it prints questions and tool results.

## F4. The first SDK's permissions and hooks

- *Order:* hooks, deny rules, ask rules, mode, allow rules, `canUseTool`.
- *`canUseTool` returns* `{ behavior: "allow", updatedInput }` or `{ behavior: "deny", message }` (Python `PermissionResultAllow` and `PermissionResultDeny`).
- *A `PreToolUse` hook returns* `{}` for no decision, or a `hookSpecificOutput` with `permissionDecision` of `allow`, `deny`, `ask` or `defer` and a reason. `deny` wins over `defer`, `defer` over `ask`, and `ask` over `allow`.
- *A hook that fails* lets the action go ahead unless its matcher sets failure to `block`.
- **Never** use `bypassPermissions` or `allowDangerouslySkipPermissions` in this book's labs.

## F5. The second SDK's tracing

- *Off:* `setTracingDisabled(true)` or `set_tracing_disabled(True)`, or `OPENAI_AGENTS_DISABLE_TRACING=1`. The lab's workers do this unless `--trace` is given.
- *On, once (Task 12):* the trace appears under *Logs*, *Traces* in the OpenAI platform dashboard for the key's project (Checked). Use test data only.
- *Elsewhere:* add or set a trace processor to send spans to your own store (the SDK's tracing guide).

## F6. Ollama and an open model

As Chapter 20's F6: Ollama on `127.0.0.1:11434` only, the model pinned in `src/sdk/config.json` as `models.open` (`qwen3:8b` until the authors' run). `npm run sdk -- --sdk open` points the second SDK's `OpenAIProvider` at `http://127.0.0.1:11434/v1/` with the placeholder key `ollama`, on the Responses API, with `store: false` and no encrypted reasoning. Tracing stays off: with it on, traces would go to OpenAI. Ollama gives a model a 4k context on a computer with less than 24 GiB of graphics memory, and says agents need at least 64000 tokens (Checked). Too small a context can keep a small model from calling tools, so start Ollama with the pinned model's whole window: `OLLAMA_CONTEXT_LENGTH=40960 ollama serve`, or the context slider in the Ollama app. `ollama ps` shows the context in use. Stop the server when you finish.

## F7. The tool runner's default, on the wire

The tool runner's two second requests, from 21.1 and the optional Task 1. On the left, the default: only the tool result and the id of the earlier reply, so the provider holds the conversation. On the right, with `thread: false`: the whole conversation, as in Chapter 20.

*Figure F7. The tool runner's default, read from the wire. One option keeps the conversation yours.*
