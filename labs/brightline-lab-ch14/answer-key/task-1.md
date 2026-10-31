# Lab 14 answer key: Task 1. Read the shape

The answers for Task 1 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

## The import graph

At the start of the lab, these are the local imports in `src/` and `scripts/`. An arrow means "imports".

```text
due-by-friday    -> csv, invoice, invoice-book, money, vendor
invoice-book     -> due-date, invoice, vendor
invoice          -> csv
vendor           -> csv
reconcile        -> csv, due-date
list-vendors     -> due-date
scripts/ap-api   -> csv
csv, due-date, money -> nothing local
```

An `import type` line is an arrow too. Node erases it when it runs the file, but the type checker reads it.

**The two files most others import** are `csv.ts`, imported by five files, and `due-date.ts`, imported by three. `money.ts` is imported by one. Nothing in `src/` or `scripts/` imports `due-by-friday.ts`, `reconcile.ts`, `list-vendors.ts` or `scripts/ap-api.ts`: they are entry points, which you run. The tests import the first three.

The Python package has the same arrows for the modules it has: `invoice`, `vendor` and `reconcile` import `csv_rows`; `invoice_book`, `list_vendors` and `reconcile` import `due_date`; `invoice_book` imports `invoice` and `vendor`. It has no Friday list and no API, and nothing imports `money.py` yet.

## The edges

Each file that reads `data/`, and each function that turns a row into a record, with what it does with a blank amount:

| Edge | What it reads | A blank amount |
| --- | --- | --- |
| `src/due-by-friday.ts` | `data/invoices.csv` and `data/vendors.csv` | Passes each row to `invoiceFromRow` |
| `invoiceFromRow` in `src/invoice.ts` | One invoice row | Converts the amount with `Number`, and `Number("")` is 0. It checks nothing, so a blank becomes $0.00 with no warning. If INV-8301's amount were blank, the Friday list would still show 8 invoices, INV-8301 at $0.00, and a total of $14,404.53 |
| `scripts/ap-api.ts` | `data/invoices.csv` and `data/vendors.csv` | Also converts with `Number`, so it would serve `amountCents: 0` |
| `src/list-vendors.ts` (`parseVendors`) and `vendorFromRow` in `src/vendor.ts` | `data/vendors.csv`, one vendor row | No amount. They copy the text as it is |
| `src/reconcile.ts` | The file named on the command line | Reads no amount |
| `readRows` in `src/csv.ts` | Any export | Splits on commas and checks nothing. A missing cell becomes `""` |
| `invoice_from_row` in `py/brightline_ap/invoice.py` | One invoice row | `int("")` raises `ValueError`, so the Python side stops with an error. The two languages differ here |

Any one of these, with what it does to a blank amount, passes. The one that matters most is `invoiceFromRow`, because Friday's payment list reads through it.

## The dependencies and the lock files

- `package.json` has two dev dependencies, `typescript` and `@types/node`, and no other dependency. `package-lock.json` pins TypeScript 7.0.2 and `@types/node` 24.19.2.
- `py/pyproject.toml` has no dependencies yet, `dependencies = []`, and a dev group with `pyright`, `pytest` and `ruff`. `py/uv.lock` pins Pyright 1.1.414, pytest 9.2.0 and Ruff 0.17.3.
- A lock file records the exact version of every package installed, including the packages those packages need. `npm ci` and `uv sync` install exactly what the lock files say, so every computer runs what you tested.
