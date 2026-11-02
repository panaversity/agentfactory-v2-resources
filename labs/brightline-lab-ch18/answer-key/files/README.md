# brightline-ap

A small accounts payable (AP) toolkit for Brightline Wholesale Supply, a made-up U.S. wholesaler, with an MCP connector that people reach by signing in. You do not need any earlier chapter to use it.

| Folder | What it holds |
| --- | --- |
| `data/`, `data-conformance/` | The AP export: vendors, invoices, purchase orders. Read only. `data-conformance/` is a test copy for Conformance Test Co. |
| `src/`, `tests/` | The TypeScript data models and CSV loader, with tests (`npm test`). |
| `py/` | The same models in Python, and the Python connector, with tests (`npm run test:py`). |
| `plugin/` | The Brightline AP plugin: skills and connectors, to the Agent Skills and Agent Plugins standards. No key anywhere. |
| `servers/` | `auth/` (the sign-in server: Better Auth on a Cloudflare Worker with D1), `ap-ts/` (the connector in TypeScript, a Worker), `ap-py/` (the Python connector's Worker entry), `hello/` and `hello-auth/` (practice servers). |
| `docs/` | The connector specification, the sign-in contract (`auth-spec.md`), acceptance prompts, the deploy runbook (`deploy.md`), AP policies, and `chapter-18/` (the chapter's concepts and field guide as text). |
| `scripts/` | Keys (`npm run keys`), the tenant scripts, the conformance suite, the sign-in matrix, and the checks CI runs. |
| `ports/` | What each chapter's lab proved, with which agent. |

The checks: `npm test`, `npm run typecheck`, `npm run test:py`, `npm run check:py`. The connector: `npm run test:servers` and `npm run conformance`. The sign-in server: `npm run typecheck:auth` and `npm run test:auth`. With the local sign-in server running (`npm run dev:auth`) and its test people added (`npm run tenant:add`): `npm run matrix`. Deploy settings: `npm run check:deploy`. Every change is a pull request (`REVIEW.md`).

Setup: Node 22.19 or later (24 recommended), uv, then `npm ci`, `cd py && uv sync`, and `npm run keys`, which makes every local secret into files git ignores and prints none.
