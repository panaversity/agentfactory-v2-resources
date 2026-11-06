# Lab 21 answer key (authors and tutors only, never give to an agent)

"Seen" means seen in the offline run (real SDKs, real harness, real practice connector, stand-in model): the authors', then ours on November 6, 2026, on our Lab 20 with one Brightline's data (`tools/brightline-lab-ch21/simulate_lab21.sh` in the labs repository, whose stream files use the task numbers below). "(run)" cells are to be filled at the live run.

| Task | Expected | Seen offline | Live |
| --- | --- | --- | --- |
| 0 | Pins 0.3.318 / 0.21.0 / 0.2.178 / 0.24.0. 15 TS and 13 Python SDK tests pass. Lab 20's `npm run test:loop` 32 and `npm run test:loop:py` 22 still pass | Yes | (run) |
| 1 (optional) | Two turns. With `thread: false`, second request has 3 entries. Without it, one tool result and `thread: {type: continue}`, beta `message-threads-2026-08-12` | Yes, both | (run) |
| 2 | Thirteen filled rows, each with a Chapter 20 line number. Worker spec read | n/a | (run) |
| 3 | First SDK: init (5 tools), assistant text, assistant tool_use, user tool_result, assistant answer, result success, 2 turns. Shadowing warning for 4 tools | Yes, both languages | (run) |
| 4 | Second SDK: 6 history items, store false, include encrypted reasoning, no previous_response_id, 2 model calls | Yes, both languages | (run) |
| 5 | Built-ins on: 33 tools (28 built in). Model may try Bash or WebFetch, denied. Off: 5 tools, one turn | Yes (Bash tried and denied) | (run) |
| 6 | Allow INV-8316 with reason, deny ALL. Hook line before permission line. Flag written | Yes, both languages | (run) |
| 7 | Second SDK: approve INV-8316 (flag written), reject ALL (no write) | Yes, both languages | (run) |
| 8 (optional) | Hook first. Hook failure lets the action proceed by default | Yes (order). Failure behavior from types | (run) |
| 9 | First SDK `--max-turns 4`: 4 tool calls, error_max_turns, num_turns 5. `--budget 0.01`: error_max_budget_usd at about $0.014. Second SDK: 8 model calls, stop max_turns | Yes, both SDKs | (run) |
| 10 | Stop (b) and (c). "Yes." trips the guardrail | Yes, both languages | (run) |
| 11 | Session file `~/.claude/projects/<encoded cwd>/<id>.jsonl`, about 25 lines, no token. Resume carries history. No persist: no session file, mcp-logs only. Second SDK: history in the program only | Yes | (run) |
| 12 (optional) | Trace in dashboard with question, arguments, results, not the token | Not testable offline | (run) |
| 13 (optional) | On the question about an invoice with no purchase order: each Chapter 20 span matched to a history item. Reasoning items have no span. The trace's timings have no item | n/a | (run) |
| 14 | Runs with base URL, key, API and model changed. Small model may misbehave | Yes against a stand-in on 11434, not Ollama | (run) |
| 15 | Table finished, at most two cells differ from the finished table on the reference page. Six checks pass from a clean clone. Every worker-spec row met, or the gap recorded | Offline checks yes | (run) |
