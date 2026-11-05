# brightline-ap

A small accounts payable (AP) toolkit for Brightline Wholesale Supply, a made-up U.S. wholesaler, with an MCP connector that people reach by signing in, serving several companies from one Postgres database. You do not need any earlier chapter to use it.

| Folder | What it holds |
| --- | --- |
| `data/`, `data-cedar/`, `data-juniper/`, `data-conformance/` | Each company's AP files, loaded into the business database by `npm run tenant:load`: Brightline's, Cedar Ridge Supply's (with its own policies), a trial company's, and a test copy for Conformance Test Co. Read only. |
| `db/migrations/` | The business database: tables in third normal form with the company in every key, two roles, forced row-level security, the vector index (`npm run db:migrate`). |
| `eval/`, `exercises/` | The retrieval question set (`npm run eval:retrieval`), and the third normal form exercise (Lab 19, Task 3b). |
| `src/`, `tests/` | The TypeScript data models and CSV loader, with tests (`npm test`). |
| `py/` | The same models in Python, and the Python connector, with tests (`npm run test:py`). |
| `plugin/` | The Brightline AP plugin: skills and connectors, to the Agent Skills and Agent Plugins standards. No key anywhere. |
| `servers/` | `auth/` (the sign-in server: Better Auth on a Cloudflare Worker with D1), `ap-ts/` (the connector in TypeScript, a Worker), `ap-py/` (the Python connector's Worker entry), `hello/` and `hello-auth/` (practice servers). |
| `docs/` | The connector specification, the sign-in contract (`auth-spec.md`), acceptance prompts, the deploy runbook (`deploy.md`), the data contract (`data-spec.md`), Brightline's AP policies, and `chapter-18/` and `chapter-19/` (each chapter's concepts and field guide as text). |
| `scripts/` | Keys (`npm run keys`), the tenant scripts (sign-in and data), the database scripts, the conformance suite, the sign-in matrix, the data matrix, and the checks CI runs. |
| `ports/` | What each chapter's lab proved, with which agent. |

The checks: `npm test`, `npm run typecheck`, `npm run test:py`, `npm run check:py`. The connector: `npm run test:servers` and `npm run conformance`. The sign-in server: `npm run typecheck:auth` and `npm run test:auth`. With the local sign-in server running (`npm run dev:auth`) and its test people added (`npm run tenant:add`): `npm run matrix`. The database (with `.secrets/db.dev.env`, field guide F2): `npm run check:roles`, `npm run check:queries`, `npm run matrix:data` and `npm run eval:retrieval`. Deploy settings: `npm run check:deploy`. Every change is a pull request (`REVIEW.md`).

Setup: Node 22.19 or later (24 recommended), uv, then `npm ci`, `cd py && uv sync`, and `npm run keys`, which makes every local secret into files git ignores and prints none.

## The agent loop (Chapter 20)

The AP worker's loop with nothing hidden, on two model APIs, in TypeScript and Python. Coding agents wrote it. Read `AGENTS.md`, then do Lab 20's Task 0: install, run the offline tests, put your keys in `.secrets/`, fill in the prices in `src/loop/config.json`, and choose a connector.

| Command | What it does |
| --- | --- |
| `npm ci`, then `cd py && uv sync --locked` | Install the pinned packages for both languages |
| `npm run typecheck`, `npm run typecheck:py` | Type-check the TypeScript, and the loop's Python |
| `npm run test:loop`, `npm run test:loop:py` | Run the loop's tests. They replay recorded responses: no network, no key, no cost |
| `npm run connector:practice` | Start the local practice connector on 127.0.0.1:8760. It reads its token from `.secrets/connector.env`. `PRACTICE_BROKEN=search_policy` makes that tool answer "try again" |
| `npm run token:test -- --person ana --company org_brightline` | Route A: sign Ana in on staging through the sign-in server's real pages, as Lab 18's sign-in matrix does, and write the connector's address and her token into `.secrets/connector.env`. It prints only the token's claims. A token lasts 10 minutes |
| `npm run ask -- --api claude\|openai\|open [--trace] [--quiet] [--cache] [--max-turns N] "question"` | One question through the loop, printing every request and response. `npm run ask:py` is the Python twin |
| `npm run break -- temperature\|forced-tool\|cut-signature\|bad-key` | Break one rule on purpose against the live API, and print the error. `npm run break:py` is the Python twin |
| `npm run stateful -- "question"` | The second API's loop, stateful, for comparison. `npm run stateful:py` is the Python twin |
| `npm run stream:demo -- "question"` | One streamed turn, event by event |

| Path | What |
| --- | --- |
| `tools/ap-tools.json` | The connector's four tools, once, in JSON Schema |
| `prompts/ap-worker.v1.md` | The worker's instructions |
| `src/loop/config.json` | Pinned models, prices (you fill these in), limits |
| `src/loop/claude.ts`, `openai.ts` | The loop on each API (TypeScript) |
| `py/brightline_ap/loop/claude_loop.py`, `openai_loop.py` | The loop on each API (Python) |
| `tests/fixtures/loop/` | Recorded responses, illustrative, not from a live run |
