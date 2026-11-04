# Concept blocks for 19.3 and 19.14: predict, then run

Fourteen short SQL blocks, the ones printed in Concept 19.3 (blocks 1 to 5), field guide F1 (block 6), Concept 19.14 (blocks 7 to 10 and 14) and field guide F4 (blocks 11 to 13), ready to run against your own `dev` database once Lab 19, Task 4, has loaded the companies.

| File | What it shows |
| --- | --- |
| `01-filter-and-sort.sql` | Filter, sort, take the first few, and why text sorts differently from numbers |
| `02-join-gives-a-row-per-match.sql` | A join gives one row for every match |
| `03-count-rows-or-values.sql` | `count(*)` counts rows, `count(a_column)` counts values |
| `04-null-is-not-a-value.sql` | Nothing equals `NULL`. Use `IS NULL` |
| `05-update-with-no-where.sql` | The most dangerous line an agent can write |
| `06-reading-an-error.sql` | Three refusals, and how to read each one |

**How to run one.** From the folder that holds `brightline-ap/` and `concept-blocks/`:

```
node concept-blocks/sql/run.mjs concept-blocks/sql/01-filter-and-sort.sql
```

Or ask your coding agent to run it for you, as Task 4b does. Each block names the role that runs it and the company that is set. `run.mjs` runs every statement inside one transaction and always ends it with `ROLLBACK`, so nothing in your database changes, even in blocks 5 and 6. It reads the connection strings from `brightline-ap/.secrets/db.dev.env` and never prints them.

**Predict first.** Before you run a block, write down what each statement will return. The gap between your guess and the output is the lesson.

## Blocks 7 to 14, for 19.14, Embeddings and pgvector in depth

| File | What it shows |
| --- | --- |
| `07-cosine-by-hand.sql` | Cosine distance on two-number arrows you can check by hand |
| `08-search-by-meaning.sql` | 19.13's search, run for real: the nearest passages are candidates |
| `09-words-or-meaning.sql` | Postgres full-text search: misses "PO", finds "blanket" exactly |
| `10-numbers-are-not-meaning.sql` | A $400 and a $4,000 question look the same to the search |
| `11-explain-the-search.sql` | `EXPLAIN`: an exact search through the company's key |
| `12-explain-with-the-index.sql` | The same search across every company, as the owner, read-only: a plan that uses the vector index |
| `13-what-a-vector-costs.sql` | Bytes of text against bytes of embedding |
| `14-hybrid-search.sql` | Hybrid search: both searches merged by reciprocal rank fusion, which puts the rule that answers first |

Blocks 8, 10, 11, 12 and 14 turn their `-- question:` lines into embeddings with the lab's stand-in model, `test-lexicon-v1`, which needs no account. A real model gives different scores. Lab 19, Task 13, records them.
