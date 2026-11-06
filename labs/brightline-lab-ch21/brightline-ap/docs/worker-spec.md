# The AP worker: a portable specification (Lab 21)

This is what the worker must do, on any runtime. It names no SDK and no provider. Each build in this lab (the first SDK, the second SDK, and the port to an open model) implements it, and each row says how the reader checks it.

| # | The worker must | How you check it |
| --- | --- | --- |
| 1 | Answer Brightline accounts payable questions for Ana Morales, following `prompts/ap-worker-sdk.v1.md` | Read the instructions the run was given |
| 2 | See only five tools: the connector's four read-only tools and `flag_invoice`. No shell, no files, no web | The tool list the run reports, or the agent's tool list |
| 3 | Reach the connector over MCP, with a short-lived test token in a header, from the builder's own process | The connector's address and header in the options |
| 4 | Run the four read-only tools without asking | They never reach the rule |
| 5 | Run `flag_invoice` only if rule 1 in `policy.ts` and `policy.py` allows it: one invoice, as INV- and four digits, with a reason of at least 10 characters. Deny or reject anything else, with a message the model can read | Tasks 6 and 7, and the rule-1 tests |
| 6 | Give no answer that does not cite a policy line as `(file.md:N)` (rule 2): with the runtime's guardrail where it has one, and with your own check after the run where it does not | Task 10, and the rule-2 tests |
| 7 | Stop at a turn limit of 8 (set explicitly, and counted the way each runtime counts it), at 10 cents where the runtime can cap cost, and at 2 minutes | Task 9 |
| 8 | Keep nothing on the provider's side, and write no conversation to disk | Task 11 |
| 9 | Send no traces off the builder's computer unless the builder turns tracing on | Task 15's review, which checks tracing is off by default, and the optional Task 12 |
| 10 | Inherit nothing from the computer it runs on: no settings files, no other MCP servers, no environment variables beyond the short list, and a request to send no nonessential traffic | Tasks 5 and 15 |
| 11 | Run as the builder, for testing only. A product gives each person their own token (Chapter 22) | `.secrets/connector.env` |

When a runtime cannot meet a row, write in `docs/sdk-map.md` which row, why, and what your own code does instead.
