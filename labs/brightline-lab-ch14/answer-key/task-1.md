# Lab 14 answer key: Task 1. Where does data come in?

The answers for Task 1 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Download it only when Task 1 is done. Attach it to your message in the coding agent, and send the lab's check message with it. The agent grades each check below, with its evidence. Read the key yourself too: you have the final say.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

"My language" below means the language on the line "My language is:" in `AGENTS.md`.

## Checks

| # | Check | Passed when | Missed when |
| --- | --- | --- | --- |
| 1 | The first commit | The first commit, "The project as I received it", holds the project as it was unzipped | There is no such commit, or it holds later changes |
| 2 | Installed, and passing | The packages came from the lock files. The tests and the type checker for my language pass | Either fails, or a package was added that the lock files do not name |
| 3 | Friday's list | Friday's list for 2027-03-05 prints 8 invoices, total $19,229.53 | Another count or total |
| 4 | My three answers came first | I said yes or no for the three files before I asked for the map. Ask me what I said | I asked for the map first |
| 5 | The map | `NOTES.md` has the heading "Where data comes in". Under it, every file of my language has its line, and the places in the table below are marked as places where data comes in | A place in the table is not marked, or the map is not in `NOTES.md` |
| 6 | Blank and negative | In this session, the function that turns a row into an invoice was run on a blank amount and on a negative amount, and I saw both results | Either was not run |
| 7 | The commit | A commit, "Where data comes in", holds the change to `NOTES.md` | It is not committed |

## The three files

| The file that | Takes data in from outside? | Why |
| --- | --- | --- |
| Makes Friday's list | Yes | It reads the invoice export and the vendor list from `data/` |
| Holds the invoices and answers questions about them | No | It is given invoices that another file already read |
| Lists the vendors | Yes | It reads the vendor list from `data/`, with its own small reader |

## Where data comes in

| Place | TypeScript | Python |
| --- | --- | --- |
| Reads the invoice export and the vendor list | `src/due-by-friday.ts` | `py/brightline_ap/due_by_friday.py` |
| Reads the vendor list | `src/list-vendors.ts` | `py/brightline_ap/list_vendors.py` |
| Reads an export to compare due dates | `src/reconcile.ts` | `py/brightline_ap/reconcile.py` |
| Turns a row into an invoice | `invoiceFromRow` in `src/invoice.ts` | `invoice_from_row` in `py/brightline_ap/invoice.py` |
| Turns a row into a vendor | `vendorFromRow` in `src/vendor.ts`, and `parseVendors` in `src/list-vendors.ts` | `vendor_from_row` in `py/brightline_ap/vendor.py`, and `parse_vendors` in `py/brightline_ap/list_vendors.py` |

The two files the most other files use are the one that reads rows from text (`src/csv.ts`, or `py/brightline_ap/csv_rows.py`) and the one that holds the due-date rule (`src/due-date.ts`, or `py/brightline_ap/due_date.py`).

## Blank and negative

| Amount | TypeScript | Python |
| --- | --- | --- |
| Blank | It becomes 0, with no error. An invoice for $0.00 goes on | The function stops with an error, on that one row, and says nothing about any other row |
| Negative, such as -23450 | It goes through as it is | It goes through as it is |

Neither language checks an amount today. That is the gap Tasks 2 and 3 close.

## Never a deduction

- The shape of the map: a list, a table or arrows.
- A wrong answer among my three, when I gave it before the map. A prediction is there to be compared.
- A file of the other language that is missing from the map.
