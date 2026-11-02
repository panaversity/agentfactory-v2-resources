# Lab 17 answer key: Task 16a. Instrument both servers

The answers for Task 16a of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

In Python, the `mcp` SDK already makes the `tools/call <tool>` SERVER span, with its parent from `params._meta`, `jsonrpc.request.id`, and `error.type` `tool_error` on a failed call. A server that adds its own gets two per call. The TypeScript SDK made none in the authors' run, so the TypeScript server makes its own.

Both report the same names and the same six compared attributes. Compare with [`servers/ap-ts/src/telemetry.ts`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/servers/ap-ts/src/telemetry.ts) and [`py/brightline_ap/spans.py`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/py/brightline_ap/spans.py).
