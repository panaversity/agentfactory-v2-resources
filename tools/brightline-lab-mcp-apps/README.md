# How Lab 20's folder was made, and how it was tested

`labs/brightline-lab-mcp-apps/` was built on November 26, 2026, from our released Lab 19 (`labs/brightline-lab-ch19/brightline-ap/` with its `answer-key/files/` laid over it, and `servers/ap-ts/scripts/copy-assets.ts` and `servers/ap-ts/src/data.ts` removed, as its answer key says). The folder is named for the chapter, not its number, because `brightline-lab-ch20` holds Lab 21 from before the renumbering (plan task T-93).

| File | What it does |
| --- | --- |
| `make_docs_20.py` | Writes `brightline-ap/docs/chapter-20/` from the book's final pages, as Lab 19's `docs/chapter-19/`: each concept and field guide section as text for coding agents, links as their words, figures and footnotes left out |
| `make_keys_20.py` | Writes the 16 per-task keys, `answer-key/task-*.md` |
| `lab20-README.md`, `lab20-answer-key-README.md` | The lab folder's `README.md` and `answer-key/README.md` |

## The test

On macOS, Postgres 17 with pgvector on 127.0.0.1, the test embedder, Node 24.18, uv with Python 3.12, and Google Chrome:

- **The starting folder, as a reader gets it.** The starting folder in an empty directory, then the README's "Set up" steps 1 to 6, with the packages copied from an install of the same lock files rather than downloaded again: 4 tests, 46 TypeScript tests and 48 Python tests passed, `npm run conformance` 81 checks passed, 0 failed, `npm run matrix` 12 rows passed, 0 failed, and `npm run matrix:data` 25 rows passed, 0 failed. `npm run check:plugin`: 1 skills, no problems.
- **The finished files.** `answer-key/files/` laid over that folder, with Task 6's note loaded: 4 tests, 52 TypeScript tests and 53 Python tests passed, `npm run typecheck` and `npm run check:py` clean, `npm run conformance` 98 checks passed, 0 failed, `npm run matrix:screen` 19 rows passed, 0 failed, `npm run matrix:data` 25 rows passed, 0 failed, and `npm run matrix` 12 rows passed, 0 failed. `scripts/check-tests-unchanged.sh` names only `py/tests/test_connector.py` and `servers/ap-ts/test/connector.test.ts`. One earlier run of the sign-in matrix on a fresh copy failed rows 1 and 12 under its 200-pair load (one TypeScript copy answered 500, then stopped; the Python copy gave 8 of 400 answers without the expected count). It did not happen again in three later runs, at the start and at the end.
- **Row C8 can fail.** With the page changed to draw the note as page code, C8 failed on both connectors (an `img` element appeared). Put back, it passed.
- **The page in a browser.** The finished page in the MCP project's basic host (marked 2.1.0) in headless Chrome, with a helper that added the test person's token: Luis's rows, *Next page*, V102's note as characters, three updates for the model, no request outside the computer; Marco's *Vendor details* showed "Your role does not include vendor details." The app tool `show_overdue`, called from a small host as an AI app would, answered "14 overdue invoices, $17,980.25 in all. 2 have no due date."

Not run by the authors: anything in Claude, ChatGPT or Goose, the staging deploy, a pull request on GitHub, and the optional Tasks 13 and 14.
