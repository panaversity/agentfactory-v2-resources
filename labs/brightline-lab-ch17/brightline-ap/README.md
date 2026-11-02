# brightline-ap

A small accounts payable (AP) toolkit for Brightline Wholesale Supply, a made-up U.S. wholesaler. You do not need any earlier chapter to use it.

| Folder | What it holds |
| --- | --- |
| `data/` | The AP export: vendors and invoices. Read only. |
| `src/`, `tests/` | The TypeScript data models and CSV loader, with tests (`npm test`). |
| `py/` | The same models in Python, with tests (`npm run test:py`). |
| `plugin/` | The Brightline AP plugin: skills and connectors, to the Agent Skills and Agent Plugins standards. |
| `scripts/` | The checks CI runs. |

The four checks: `npm test`, `npm run typecheck`, `npm run test:py`, `npm run check:py`. Every change is a pull request (`REVIEW.md`).

Setup: Node 22.19 or later (24 recommended), uv, then `npm ci` and `cd py && uv sync`.
