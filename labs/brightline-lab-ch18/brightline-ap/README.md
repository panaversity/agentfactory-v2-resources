# brightline-ap

A small accounts payable (AP) toolkit for Brightline Wholesale Supply, a made-up U.S. wholesaler. You do not need any earlier chapter to use it.

| Folder | What it holds |
| --- | --- |
| `data/` | The AP export: vendors and invoices. Read only. |
| `src/`, `tests/` | The TypeScript data models and CSV loader, with tests (`npm test`). |
| `py/` | The same models in Python, with tests (`npm run test:py`). |
| `plugin/` | The Brightline AP plugin: skills and connectors, to the Agent Skills and Agent Plugins standards. |
| `servers/` | MCP servers: `hello/` (practice), `hello-auth/` (a practice sign-in server and connector, Lab 18 Task 1), `ap-ts/` (the connector in TypeScript, a Cloudflare Worker), `ap-py/` (the Python connector's Worker entry), and `auth/`, which holds only `.dev.vars.example` until Lab 18 builds the sign-in server there. |
| `docs/` | The connector specification, acceptance prompts, the deploy runbook (`deploy.md`), AP policies, and `chapter-18/` (Chapter 18's concepts and field guide as text, for coding agents). |
| `scripts/` | Keys (`npm run keys`, which makes every local secret into files git ignores and prints none) and the checks CI runs. |

The four checks: `npm test`, `npm run typecheck`, `npm run test:py`, `npm run check:py`. For the connector: `npm run test:servers` and `npm run conformance`. Every change is a pull request (`REVIEW.md`).

Setup: Node 22.19 or later (24 recommended), uv, then `npm ci`, `cd py && uv sync`, and `npm run keys`.

The connector still uses Chapter 17's shared access key here. Lab 18 replaces it with sign-in.
