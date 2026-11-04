# How Lab 19's folder was made, and how it was tested

`labs/brightline-lab-ch19/` was built on November 4, 2026 from the editor-in-chief's package for Chapter 19 (its zip, `brightline-lab-ch19.zip`, and its reference history, `brightline-ap.bundle`, kept in the book repository at `specs/drafts/chapter19/authors/`) and from our released Lab 18. These scripts did it. They hold the session's paths, so read them as a record of each rule, and change the paths before running them again. Chapter 20's lab starts where this one ends.

| File | What it does |
| --- | --- |
| `build_lab19.py` | Takes the authors' trees at `ch18`, `lab19-start` and `ch19`, and our Lab 18 end state (`labs/brightline-lab-ch18/brightline-ap/` with its `answer-key/files/` laid over it). Writes the starting folder (our `ch18` plus the authors' 56 new files), the finished files (every file `ch19` adds or changes, merged three ways with our Chapter 18 fixes where both changed a file), and the lab's own files beside the repository. On the way it moves the week as Chapters 15 to 18 did (C58): INV-51NN to INV-83NN, story dates +119 days. It leaves real dates alone: MCP's revision, Cloudflare's `compatibility_date`, the authors' run records in `ports/`, tool timestamps in lock files, and test clocks with a time part. It also gives Cedar Ridge's utilities blanket PO, "each January", the moved year's January (2027-01-04), names Ana Morales, Brightline's AP analyst, and makes `LAB-19.md` `LAB.md`. It first checks its own rule against Chapter 18: applied to the authors' `ch18`, it must give our released Lab 18 except for the fixes our Chapter 18 run made by hand |
| `make_docs_19.py` | Writes `brightline-ap/docs/chapter-19/` from the book's final pages: each concept and field guide section as text for coding agents, links as their words, figures and footnotes left out, as Lab 18's `docs/chapter-18/` |
| `make_keys_19.py` | Writes the 23 per-task keys, `answer-key/task-*.md`, from the authors' `expected.md` and each task's "What good looks like" |
| `lab19-start-embeddings.ts` | The starting folder's `servers/ap-ts/src/embeddings.ts`: only the test embedder, so the starting folder's tests and type checks pass before Task 13 brings in Workers AI |
| `assemble_lab19.sh` | Puts it all together in `labs/brightline-lab-ch19/`, and copies the book page into `LAB.md` with the book repository's `copy-lab-page.py` |
| `lab19-README.md`, `lab19-answer-key-README.md` | The lab folder's `README.md` and `answer-key/README.md` |
| `harness/` | The authors' standalone test made to run on macOS: `env-macos.sh` (PATH, Node's TAP reporter), `bin/pgsu` in place of `su postgres -c psql`, `bin/timeout` (macOS has none), `local-neon.sh` (a local Postgres database shaped like a fresh Neon branch), and `simulate-ours.sh` and `verify-ours.sh`, the authors' two scripts with `LAB.md` and the moved values |

## The test

On a local Postgres 17.7 with pgvector 0.8.2 (the authors used 16.15 and 0.6.0), started with `LC_ALL=C.UTF-8 pg_ctl -D <data> start`, listening on 127.0.0.1:5432, with trust for the `postgres` role only:

- `simulate-ours.sh <a copy of the lab folder, after Task 0's first commit> <a bundle with ch18, lab19-start and ch19> harness/local-neon.sh`: 32 checks, 0 failures.
- `verify-ours.sh <the bundle> harness/local-neon.sh`: 22 checks, 0 failures, across the three tags.

The bundle was built from our Lab 18 end state (`ch18`), this lab's starting folder (`lab19-start`) and the starting folder with `answer-key/files/` laid over it and the two deleted files removed (`ch19`). Nothing here runs online: Neon, Hyperdrive, Workers AI and the GitHub workflows are not yet run by anyone.
