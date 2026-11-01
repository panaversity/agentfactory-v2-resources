# Concept blocks

The code blocks from Chapter 14 that print something, as files you can run. Predict the output first, then run it, then compare it with the chapter.

Keep this folder beside `brightline-ap`, as it is in the lab download. Each block imports the repository's code from there, so its import lines point at `../../brightline-ap/` where the chapter's page shows `../src/`. Nothing else differs from the page.

Ask your coding agent to run them, and read each command before you approve it. The TypeScript blocks run from `brightline-ap/`, and the Python blocks from `brightline-ap/py/`, after `uv sync`:

```bash
node ../concept-blocks/ch14/14-1.ts
uv run python ../../concept-blocks/ch14/14_1.py
```

| Concept | Files | When it runs |
| --- | --- | --- |
| 14.1 Modules | `14-1.ts`, `14_1.py` | Any time |
| 14.3 Classes | `14-3.ts`, `14_3.py` | After Lab 14, Task 3, which adds `openTotalCents` |
| 14.3 Equality | `14-3-equality.ts`, `14_3_equality.py` | Any time |
| 14.3 Parameter property | `14-3-parameter-property.ts` | Any time. It fails on purpose, with the error Node gives |
| 14.4 Schemas | `14-4.ts`, `14_4.py` | After Lab 14, Task 4, which adds the schemas |
| 14.6 JSON and REST | `14-6.ts`, `14_6.py` | With the sample API running (`npm run api`), after Task 8 for Python, which adds httpx |
| 14.7 Async | `14-7.ts`, `14_7.py` | Any time |

The 14.6 blocks need the key from `.env`. They run as `node --env-file=.env ../concept-blocks/ch14/14-6.ts` from `brightline-ap/`, and `uv run --env-file ../.env python ../../concept-blocks/ch14/14_6.py` from `brightline-ap/py/`.

Three of the chapter's blocks are excerpts of files in the repository, so you run those files instead:

- 14.2: `npm run typecheck` and `npm run check:py` on `exercises/wrong-call.ts` and `exercises/wrong_call.py`, after Task 2 step 2.
- 14.5: the loader you build in Task 5, `npm run check-invoices -- data/invoices-messy.csv`.
- 14.8: `exercises/sdk-shaped/ap_sdk.py`, with the API running, as Task 9 does.

The times that 14.7 prints differ by a few milliseconds on each computer. The ratio does not.
