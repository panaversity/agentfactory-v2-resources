# Concept blocks

Every runnable code block from Chapter 13, as a file you can run. Predict the output first, then run it, then compare with the chapter.

Run them from `ch13/`, with the `brightline-ap` folder beside this folder, as it is in the lab download.

- TypeScript: `node 13-1.ts`
- Python: `uv run python 13_1.py`

| File | Concept | Note |
| --- | --- | --- |
| `13-1.ts`, `13_1.py` | 13.1 | |
| `13-1-sort.ts` | 13.1 | The one changed line from Ana's story, on Friday's list. It reads `brightline-ap`'s script and data. Add a cutoff to try another week: `node 13-1-sort.ts 2027-03-12` |
| `13-2.ts`, `13_2.py` | 13.2 | Both run and go wrong. To see the type checkers catch them, after Lab 13's Task 1: `../../brightline-ap/node_modules/.bin/tsc --noEmit 13-2.ts`, and, from `brightline-ap/py/`, `uv run pyright ../../concept-blocks/ch13/13_2.py` |
| `13-2-strict.ts`, `13_2_strict.py` | 13.2 | Both run. Only strict mode refuses them: `../../brightline-ap/node_modules/.bin/tsc --noEmit --strict 13-2-strict.ts`, and, from `brightline-ap/py/`, `uv run pyright ../../concept-blocks/ch13/13_2_strict.py`. Each prints the chapter's error first, and then more |
| `13-3.ts`, `13_3.py` | 13.3 | The Python file ends with a deliberate `TypeError` |
| `13-4.ts`, `13_4.py`, `13-4-while.ts`, `13_4_while.py` | 13.4 | |
| `13-5.ts`, `13_5.py` | 13.5 | They need `dueDate` from Lab 13's Task 6 and `due_date` from Task 7. The second assertion fails on purpose. Run the Python one as `uv run --project ../../brightline-ap/py python 13_5.py` |
| `13-6.ts`, `13_6.py`, `13-6-sets.ts`, `13_6_sets.py` | 13.6 | `13_6.py` ends with a deliberate `KeyError`, and `13_6_sets.py` with a deliberate `TypeError` |
| `13-7.ts`, `13_7.py`, `13_7_with.py` | 13.7 | The second line of `13-7.ts` depends on your computer's time zone. The chapter shows it for New York: `TZ=America/New_York node 13-7.ts`. `13_7_with.py` reads `data/vendors.csv`, so run it from `brightline-ap`: `uv run python ../concept-blocks/ch13/13_7_with.py` |
| `13-9.test.ts`, `test_13_9.py` | 13.9 | Two tests from the chapter. They fail until Lab 13's Tasks 6 and 7 add the code. Run them as `node --test 13-9.test.ts` and `uv run --project ../../brightline-ap/py python -m pytest test_13_9.py` |

Four blocks are changed so they run from this folder: `13-5.ts` and `13-9.test.ts` import `../../brightline-ap/src/due-date.ts`, and `13_5.py` and `test_13_9.py` start with two lines that let Python find `brightline-ap/py`. Concept 13.8 has no code blocks of its own: its two error reports come from Lab 13's Task 9.
