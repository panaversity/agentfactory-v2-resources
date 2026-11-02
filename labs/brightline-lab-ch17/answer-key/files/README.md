# brightline-ap

A small accounts payable (AP) toolkit for Brightline Wholesale Supply, a made-up U.S. wholesaler. You do not need any earlier chapter to use it.

| Folder | What it holds |
| --- | --- |
| `data/` | The AP export: vendors and invoices. Read only. |
| `src/`, `tests/` | The TypeScript data models and CSV loader, with tests (`npm test`). |
| `py/` | The same models in Python, with tests (`npm run test:py`). |
| `plugin/` | The Brightline AP plugin: skills and connectors, to the Agent Skills and Agent Plugins standards. |
| `servers/` | MCP servers: `hello/` (practice), `ap-ts/` (the connector in TypeScript, a Cloudflare Worker), `ap-py/` (the Python connector's Worker entry). |
| `docs/` | The connector specification, acceptance prompts, the deploy runbook (`deploy.md`) and AP policies. |
| `scripts/` | The checks CI runs. |

The four checks: `npm test`, `npm run typecheck`, `npm run test:py`, `npm run check:py`. For the connector: `npm run test:servers` and `npm run conformance`. Every change is a pull request (`REVIEW.md`).

Setup: Node 22.19 or later (24 recommended), uv, then `npm ci` and `cd py && uv sync`.
