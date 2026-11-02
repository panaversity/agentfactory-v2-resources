# Lab 17 answer key: Task 13. Into the plugin

The answers for Task 13 of Lab 17, in Chapter 17 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

`plugin/mcp.json` is gone, and [`plugin/.mcp.json`](https://github.com/panaversity/agentfactory-v2-resources/tree/main/labs/brightline-lab-ch17/answer-key/files/plugin/.mcp.json) has the `ap` server with `${AP_MCP_URL:-http://127.0.0.1:8717/mcp}` and `Bearer ${AP_MCP_TOKEN}`.

A literal key in the header fails `check:plugin` with ".mcp.json ap: a header holds a literal value, not an environment variable".

Asked about the two invoices, the triage skill reports INV-8303 as $900.00 over PO-7003, and INV-8310 as having no PO, with the policy line.
