# Lab 19: Brightline's data in a database

Chapter 19 of *The AI Agent Factory*, Second Edition. This file is the book's page for this lab, [Lab 19: Brightline's data in a database](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/lab/), so you can do the lab without the book.

*Time: about 10 hours 25 minutes, in five sittings, 10 hours 50 minutes with the optional Task 11b. Core path about 10 hours 5 minutes. Lab files: `brightline-lab-ch19.zip`. The same steps are in `LAB.md` inside the zip, and the chapter's concepts and field guide are in `brightline-ap/docs/chapter-19/`.*

**You need no earlier lab.** Everything starts from `brightline-lab-ch19.zip`, and every earlier idea a task uses is explained where it is used. Readers who did [Lab 18](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/lab/) also start from the zip.

**The date in this lab** is Monday, March 29, 2027, a week after Lab 18.

## Before you start

**What you need.**

- Everything Lab 18 needed: a computer with Node 22.19 or later (24 recommended) and uv 0.11.32 or later. Also git, the GitHub CLI (`gh`), and the desktop apps of Claude Code, Codex and OpenCode version 2, each signed in ([Chapter 12](https://agentfactory2.panaversity.org/building-ai-workers/agentic-coding/overview/)). A free Cloudflare account and a GitHub account. The Postgres command-line client, `psql`, version 16 or later.
- **A free Neon account,** made by you in Task 0 ([F2](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f2-neon-from-zero)). No card.
- **A Cloudflare API token for Workers AI,** made by you in Task 0 ([F4](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f4-embeddings-and-vectors-from-zero)), for real embeddings. Sittings 1 to 4 work without it, with the test embedder. Task 13's real-model run, the threshold in Task 14 and staging in Task 16 need it, because a deployed connector always uses the real model.

**How every task runs.** Chapter 12's five-step routine, as in Labs 17 and 18: (1) a fresh session with the named agent, in `brightline-ap/`. (2) Plan mode, with the task's prompt as the brief. Read the plan, and correct it before it starts. (3) Manual mode: approve each command. (4) Evidence: the agent shows what proves the task is done, and you check it against **What good looks like**. (5) A line in `ports/ch19.md`: the task, the agent, what it proved, anything that surprised you.

**What you do by hand, and only this.** Make the Neon account and its API key, make the Cloudflare token, and put each into a file in `.secrets/` with your own editor. Sign in, and decide when to merge and deploy. Agents do everything else: every file, every command, every query. **No connection string, password, API key or token passes through a chat.** Agents write them into files git ignores and pass those files to commands.

**You do not need to understand every word of a prompt.** The prompts are written for the agent, so they carry exact commands and flags. Your job is to check the agent's plan against the task's **Goal**, and its result against **What good looks like**. When a word in a prompt is new to you, ask the agent to explain it in one line before it starts. The words that come up most:

| Word in a prompt | What it means |
| --- | --- |
| Direct and pooled connection string | Two addresses for the same database. The direct one opens a connection of your own, needed for migrations. The pooled one goes through the hosting service's shared pool ([19.17](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/a-database-behind-a-stateless-server/), [F2](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f2-neon-from-zero)) |
| `NOLOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE` | Five rights a role is made *without*: it cannot sign in until `db:passwords` gives it a password, is not a superuser, cannot skip row-level security, and cannot make databases or roles ([19.8](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/row-level-security/)) |
| `neon_superuser` | The hosting service's group of powerful roles. Every role made in its dashboard joins it, so assume such a role may skip row-level security ([F2](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f2-neon-from-zero)) |
| Reset the `ci` database | Delete the `ci` database branch's data and make it fresh from `dev`, so the next test starts clean ([19.6](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/changing-the-tables-safely/)) |
| `--env dev`, `--env ci` | Which copy of the database a script runs against |

**Your agents can read this chapter.** `docs/chapter-19/` holds the concepts and the field guide as text. Each prompt names what to read.

**The answer key** is in `answer-key/` at the top of the zip, outside `brightline-ap/`. Never give it to an agent. Each task also links its own answer key as a separate download. Open a key in a text editor, never in the agent. An agent that can read the answers is not tested by them.

## Sitting 1: a database for the business (about 3 hours 25 minutes)

### Task 0. Set up from the zip (25 minutes, Claude Code)

**Goal:** the repository on your computer and on GitHub, and every check passing at `lab19-start`. Also an empty Neon project with a `dev` and a `staging` branch, and `dev`'s owner connection string in a file git ignores.

**By hand first ([F2](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f2-neon-from-zero), [F4](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f4-embeddings-and-vectors-from-zero)).** In your own terminal, `gh auth login`, then `gh auth status`. Never sign `gh` in through a chat. Unzip `brightline-lab-ch19.zip`. Make the Neon account and API key, and put the key in `brightline-ap/.secrets/neon.env` with your editor, as [F2](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f2-neon-from-zero) shows. Make `.secrets/embeddings.env` with one line, `AP_EMBEDDINGS=test`. Every task up to Task 13 uses the test embedder. If you will use real embeddings, also make the Cloudflare token now, and add its two lines to that file as [F4](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f4-embeddings-and-vectors-from-zero) shows. Keep the first line as it is.

**Predict:** at `lab19-start`, does the connector read a database yet?

> Put this folder under git, with a main branch. Make a first commit of everything here with the message "Start from the end of Chapter 18", and tag that commit `lab19-start`. If git has no name and email yet, set them for this project only. Read `README.md`, `AGENTS.md` and `docs/chapter-19/field-guide.md`, sections F0 and F2. Run `npm ci`, `cd py && uv sync --locked`, and `npm run keys`. Run every check in the README that needs no database and no sign-in server: `npm test`, `npm run typecheck`, `npm run test:py`, `npm run check:py`, `npm run test:servers`, `npm run test:auth`, `npm run typecheck:auth`, `npm run conformance`, `npm run check:deploy`. Then use `npx neonctl` with the key from `.secrets/neon.env`. Pass it as an environment variable from the file, and never print it. Create a Neon project called `brightline-ap` on Postgres 18 in the region nearest me, with two branches from its default branch, `dev` and `staging`. Add `NEON_PROJECT_ID=<the id>` to `.secrets/neon.env`. Write the `dev` branch's direct connection string (not the pooled one, which goes through Neon's shared connection pool, 19.9 and F2). Write it for the role `neondb_owner` to `.secrets/db.dev.env` as `DATABASE_URL_OWNER=...`, straight from the command into the file, never shown. Then make a private GitHub repository called `brightline-ap-19` and push `main` and the tag. Finish with `git status` and `git ls-files .secrets` (expect nothing), and a table of every check with its result.

**What good looks like:** `git log --oneline` shows one commit, tagged `lab19-start`. Every check passes. `git ls-files .secrets` prints nothing. The Neon Console shows the project with three branches: the default (`main`, for production), `dev` and `staging`. At `lab19-start` the connector still reads [Chapter 17](https://agentfactory2.panaversity.org/building-ai-workers/connectors-and-mcp/overview/)'s files, and Cedar Ridge's token still gets "No AP data is connected for Cedar Ridge Supply yet." **Not yet run online by the authors:** the `neonctl` steps. If `neonctl` asks for a flag this prompt does not name, the agent should read `npx neonctl projects create --help` and show you the command before running it.

**Check it now.** Download [Task 0's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-0.md).

### Task 1. The data contract (25 minutes, Claude Code)

**Goal:** `docs/data-spec.md`, with every table and column in simple words, each company's own rules, and what is never stored.

**Read first, by yourself:** [19.2](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/tables-rows-and-keys-from-zero/). If you have never seen a database, read it twice, and check its first two query answers against its two tables by hand. Query 3's answer needs the full data.

**Predict:** name one column that looks like a copy of another table's column but is its own fact.

> Make a git branch called `data` for this lab's work, and commit each task's work on it. Read 19.1 to 19.5 in `docs/chapter-19/`, and the data files in `data/`, `data-cedar/` and `data-juniper/`. Interview me, one question at a time, as Ana Morales, Brightline's AP analyst, then as Luis Moreno, Cedar Ridge's AP lead. Ask what each column means, which may be empty, what each company's own rules are (`settings.csv`), and what must never be stored. Then write `docs/data-spec.md` with:
>
> - The data tenancy model.
> - A table of every table and column with its meaning and rule.
> - A "Never stored" list.
> - The three database roles.
>
> Every table has `tenant_id`, and every key includes it. A company's name is not in the business database at all. Do not write any SQL yet.

**What good looks like:** every column has a meaning. "Never stored" lists full account numbers and routing numbers, and names. When the agent asks about `invoices.terms`, answer as Ana: "It's what the invoice says. Triage rule 3 compares it with the vendor's terms." The spec must keep it as the invoice's own fact.

**Check it now.** Download [Task 1's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-1.md).

### Task 2. Tables and keys (30 minutes, Claude Code)

**Goal:** the AP tables in `dev`, with the company in every key, and one wrong row refused by the database.

**Predict:** which rule will refuse a Cedar Ridge invoice for vendor V006, and what is its error code ([F1](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f1-postgres-from-zero))?

> Read 19.2, 19.4, 19.6, 19.13 and F1. Add `pg` 8.23.1 to the project. Write `scripts/db-migrate.ts` (`npm run db:migrate -- --env dev|ci|staging|production`). It applies `db/migrations/*.sql` in order as the owner role, each file in its own transaction. It records each in `schema_migrations` with its SHA-256, applies nothing twice, and refuses a file that changed after it ran. It reads `.secrets/db.<env>.env` itself, and that file's values always win over anything already set. It never prints a connection string. Then write `0001_vector.sql` (pgvector) and `0002_tables.sql`, the nine tables of `docs/data-spec.md`. They have `tenant_id` in every primary key and every foreign key, the rules as `CHECK` constraints, and no company name. Name the passage and document columns as 19.13's query does (`document_id`, `line_start`, `content`, `embedding`, `embedding_model`, `title`, `file`), store `file` as the path from the repository's root, and name the HNSW index `policy_passages_embedding`. The concept blocks use these names. Apply them to `dev` and show me the tables. Then, as the owner, inside a transaction you roll back, try to insert a Cedar Ridge invoice for vendor V006, and show me the error. Run `npm run db:migrate` a second time. Then add a comment line to `0002_tables.sql`, run it again, show me the refusal, and undo the edit.

**What good looks like:** two files so far, so `2 applied`, then `0 applied, 2 already applied`. The edited file is refused: `has changed since it ran`. The wrong invoice gets `23503`, a foreign key violation: (`org_cedar`, `V006`) is not a vendor. You can say which line of `0002_tables.sql` refused it.

**Check it now.** Download [Task 2's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-2.md).

### Task 3. Roles and row-level security (35 minutes, Claude Code)

**Goal:** the loader and reader roles, made with SQL, and row-level security forced on every table. Also proof from the database itself that the connector's role cannot skip it.

**Predict:** the tables are still empty, so every count is 0 for now. Once Task 4 has loaded the data, your quick query as the owner, `SELECT * FROM vendors`, will return how many rows, and why?

> Read 19.8 and F2's "Roles: the trap". Write `0003_roles.sql`: `ap_loader` and `ap_reader`, made with SQL, `NOLOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE`, only if missing. The reader may only `SELECT` the nine tables. The loader may read and write them. Write `0004_row_security.sql`: on every table, enable and force row-level security. Each has a `SELECT` policy for `ap_reader` and an `ALL` policy with `USING` and `WITH CHECK` for `ap_loader`, both on `tenant_id = current_setting('app.tenant_id', true)`. Write `scripts/db-passwords.ts` (`npm run db:passwords -- --env <env>`), which makes each role a password, lets it log in, and writes its connection string into `.secrets/db.<env>.env`, printing nothing. Write `scripts/check-roles.ts` (`npm run check:roles -- --env <env>`), which fails:
>
> - If either role is a superuser, has `BYPASSRLS`, can create roles, or is in `neon_superuser`.
> - If any table lacks forced row security, two policies, or `tenant_id` in its primary key.
> - If any `SECURITY DEFINER` function is callable by either role.
> - If the reader's own connection is not `ap_reader`, can write, or sees any vendor with no company set.
>
> It also lists every role on the database that can skip row-level security. Apply, set the passwords, run the check. Then show me `SELECT count(*) FROM vendors` three ways: as the owner, as the reader with `org_cedar` set in a transaction, and as the reader with nothing set.

**What good looks like:** all three counts are 0 now, because nothing is loaded yet. Claude Code explains what each will show with data. The owner sees every company's rows, the reader with Cedar Ridge set sees only Cedar Ridge's, and the reader with nothing set sees none. After Task 4, run the three counts again: every vendor, 9, and 0. `check:roles` passes, and lists `neondb_owner` among the roles that skip row-level security. You can say why the connector never uses `neondb_owner`: it is a Console role, in `neon_superuser`, which Neon's documentation says has `BYPASSRLS`. `check:roles` shows whether yours does.

**Check it now.** Download [Task 3's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-3.md).

### Task 3b. Third normal form, by reading (20 minutes, Claude Code)

**Goal:** you find every transitive dependency in a flat table, and Claude Code refactors it to 3NF with the vector index and row-level security.

**Predict:** how many facts in `docs_flat` belong in the sign-in database, not here?

**By reading, first.** Open `exercises/3nf/docs_flat.sql` in your editor. Write, in `ports/ch19.md`, every transitive dependency you can find, as `key → column → column`, and where each fact belongs ([19.5](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/third-normal-form-in-detail/)). Look inside `metadata` too ([F5](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f5-the-sql-in-detail) explains it). Only then start the agent.

**In plain words.** The table's columns:

| Column | What it holds |
| --- | --- |
| `id` | The passage's own id, its key |
| `tenant_id` | The company's id |
| `org_name` | The company's name |
| `tenant_email` | The company's AP contact's email |
| `doc_file`, `doc_title`, `doc_owner` | Which policy file the passage came from, that file's title, and who owns the policy |
| `line`, `content` | The passage's line number in the file, and its text |
| `embedding` | The passage's embedding, 1,024 numbers |
| `metadata` | A small JSON document per row, holding `company_name` and `heading` (the document's title) |

For each column, ask [19.5](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/third-normal-form-in-detail/)'s question: is this a fact about the passage, or about something else?

> Read 19.5, 19.8, 19.13 and `exercises/3nf/README.md`. Run `exercises/3nf/docs_flat.sql` on `dev` as the owner. Show me `exercise.docs_flat`, and the count of distinct `org_name` per `tenant_id`. Then compare my list of transitive dependencies in `ports/ch19.md` with your own, and tell me what each of us missed. Then refactor it, in the schema `exercise`, to third normal form. That means no company name, no email, no document title or owner on the passage row, and nothing copied inside a `jsonb`. Keep `tenant_id` and the embedding on the passage row, with the two guards from 19.5. Add the HNSW index, and turn on and force row-level security with a reader policy on each new table. Then prove three things:
>
> - No copied column is left.
> - Renaming a document changes one row.
> - As `ap_reader` with Cedar Ridge set, a search returns only Cedar Ridge's passages, while with nothing set it returns none.
>
> Then drop the schema `exercise`.

**What good looks like:** your list has at least six.

- The company's name and the AP contact's email (both belong in the sign-in database).
- The document's title and owner (both belong to the document).
- Inside `metadata`, the company's name again and the document's title again (`heading`).

The agent adds the one kept on purpose, the embedding, which the text decides, and notes that `tenant_id` stays as part of every key. The proofs: 0 copies left, `UPDATE 1`, 3 Cedar Ridge rows, then 0. Compare with `answer-key/3nf-refactor.sql`.

**Check it now.** Download [Task 3b's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-3b.md).

### Task 4. Load the companies (25 minutes, Claude Code)

**Goal:** Brightline, Cedar Ridge and Conformance Test Co. in `dev`, each through the loader role, with no full account number anywhere.

**Predict:** if one row in Cedar Ridge's files were bad, how many of Cedar Ridge's rows would be in the database afterwards?

> Read 19.11, 19.13's "Passages" and F4's "The test embedder". `servers/ap-ts/src/embeddings.ts` already holds the test embedder (`test-lexicon-v1`, 1,024 numbers, as F4 describes), chosen by `AP_EMBEDDINGS=test`. The chapter's numbers come from it, so use it as it is, and keep its exports `testEmbedder()` and `toVector()`. Write `scripts/tenant-load.ts` (`npm run tenant:load -- --env <env> --company <id> --folder <folder> [--policies <dir>] [--replace] [--chunk line|document]`). It reads and checks every file first (reuse `src/load.ts` and `src/schemas.ts`). It cuts every account number to its last four digits and drops routing numbers before anything reaches the database. Then, as `ap_loader`, in one transaction with the company set by `set_config(..., true)`, it inserts the company, its settings, vendors, notes, banking, invoices and purchase orders. In the same transaction, it then inserts the policy documents its `manifest.csv` says count, one passage per rule. Each has its embedding (made before the transaction opens), its model's name and the fingerprint of its text. It refuses a company that already has data unless `--replace`. It prints counts, never rows. Load `org_brightline` from `data/` and `org_conformance` from `data-conformance/`, each with `--policies docs/policies`. Load `org_cedar` from `data-cedar/`, whose policies are in `data-cedar/policies/`. Then show me the counts per company and table, and count the `vendor_banking` rows whose `account_last4` is anything but four digits. Then, as the loader with Cedar Ridge set, in a transaction you roll back, try to insert a vendor for `org_brightline`. Show me the error.

**What good looks like:** vendors 8, 9 and 8. Invoices 15, 20 and 15. Purchase orders 12, 8 and 12. Passages 17, 12 and 17, and Cedar Ridge's old 2024 email reported as not loaded. Zero banking rows with more than four digits. The loader's Brightline vendor gets `new row violates row-level security policy for table "vendors"`. And your prediction: zero, because the load is one transaction.

**Check it now.** Download [Task 4's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-4.md).

### Task 4b. Read the data: predict, then run (45 minutes, Claude Code)

**Goal:** you can read the SQL an agent writes and say what it will return before it runs. First [19.2](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/tables-rows-and-keys-from-zero/)'s three queries, then the six blocks of [19.3](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/reading-sql/) and [F1](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f1-postgres-from-zero), then two changes of your own.

**Predict:** before each statement runs, write down in `ports/ch19.md` how many rows it returns, or what it changes, and why.

> Read 19.2, 19.3 and F1. First, as `ap_reader`, in a read-only transaction with `org_brightline` set, run 19.2's three queries, with `tenant_id` added to each, as the real tables need. They are (1) vendor V005's name and terms, (2) each of V001's invoices with the vendor's name, (3) how many open invoices each vendor has. Then run query 3 without its `tenant_id` condition, once with `org_brightline` set and once with `org_cedar` set. Next, run the six blocks in `../concept-blocks/sql/` in order, each with `node ../concept-blocks/sql/run.mjs <file>`. Blocks 1 to 4 run as `ap_reader`, read-only. Blocks 5 and 6 run as `ap_loader`, and `run.mjs` undoes everything at the end. For every statement: show it to me, wait for my prediction, run it, then explain each line in plain words. Say where my prediction was wrong, if it was. Then the Modify step: in a copy of block 4, change `IS NULL` to `IS NOT NULL`, and in a copy of block 1, change `LIMIT 3` to `LIMIT 5`. Wait for my predictions, then run both. Change nothing else, and never run SQL outside a block or a read-only transaction.

**What good looks like:**

- **[19.2](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/tables-rows-and-keys-from-zero/)'s queries:** 1 row (Hocking Valley Pallets, Net 30), 2 rows (INV-8301 and INV-8309, both Midwest Packaging Co.), and 8 rows for Brightline, V001 with 1. Without its `tenant_id` condition, query 3 gives the same 8 rows with Brightline set. With Cedar Ridge set, it gives 9 rows (Cedar Ridge's vendors, V001 with 3). So row-level security ([19.8](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/row-level-security/)) chose the rows, not the query.
- **The six blocks:** exactly the outputs printed in [19.3](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/reading-sql/) and, for Block 6, in [F1](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f1-postgres-from-zero). Block 5 shows `UPDATE 9`. Afterwards, Cedar Ridge's vendors have their own terms again, with only V004 on Net 45, as before, because every block is rolled back.
- **The Modify step:** `IS NOT NULL` returns Cedar Ridge's other 7 purchase orders, and `LIMIT 5` returns five invoices, still largest first.
- **Your notes:** at least one prediction that was wrong, with the reason. That is the point of the task.

**Checkpoint 1: the database design.** Before Sitting 2, check that you can do these without looking back. If one is shaky, reread the concept named.

- Read `0002_tables.sql` aloud for one table: what each column holds, which columns make the key, and what each `REFERENCES` line refuses ([19.2](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/tables-rows-and-keys-from-zero/), [19.4](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/designing-the-ap-tables/)).
- Point to the one fact copied onto every row on purpose, and the one copy that breaks 3NF on purpose. Name the rule in the database that keeps each true ([19.5](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/third-normal-form-in-detail/)).
- Say why Task 4b's third query returned a different count for Brightline and Cedar Ridge, though the SQL was the same ([19.2](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/tables-rows-and-keys-from-zero/), [19.8](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/row-level-security/)).
- Read an `UPDATE` an agent wrote and say how many rows it will change, and why `= NULL` finds nothing ([19.3](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/reading-sql/)).

**Check it now.** Download [Task 4b's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-4b.md).

## Sitting 2: the connector on the database (about 1 hour 30 minutes)

### Task 5. Tests first (20 minutes, Claude Code)

**Goal:** failing tests that define how the connector must use the database.

**Predict:** which test can only fail if two different companies' calls share one connection?

> Read 19.9 and 19.17. In `servers/ap-ts/test/`, the tests now run against `dev` as the reader (`.secrets/db.dev.env`), with the test embedder. Write failing tests for: one transaction per tool call, with the company set for that transaction only, from the request context. Cedar Ridge's own answers (16 open invoices, its own V001, its own threshold of $2,500.00 on PO-3103). The same ids meaning different rows for two companies (V001, INV-8303). An id that exists only at Brightline getting the same reply as one that exists nowhere. A query that runs past its time limit turning into "The AP database did not answer in time. It may be waking up. Try again in a few seconds." Change Chapter 18's tests that expected Cedar Ridge's no-data message to expect its own answers. Use Juniper Trail, which has no data, for the no-data message. Stop and show me each changed Chapter 18 test, old wording and new, before you commit it. Commit the tests, and show them failing.

**What good looks like:** the tests are committed before any code changes, and they fail. Each change to a [Chapter 18](https://agentfactory2.panaversity.org/building-ai-workers/securing-connectors/overview/) test was shown to you first. Chapter 18's rule: never change an existing test to make code pass without saying so. The test that needs a shared connection is the 200-pairs test, because only interleaved calls can reuse a connection between companies.

**Check it now.** Download [Task 5's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-5.md).

### Task 6. The TypeScript connector (40 minutes, Claude Code)

**Goal:** the four tools reading the database, one transaction per call, and the data files gone from the Worker.

**Predict:** after this task, what does Cedar Ridge's token get from `list_open_invoices`?

**In plain words.** The connector gets a small database layer. Every tool call borrows a connection, starts a read-only transaction, and sets the company and a time limit for that transaction only. Then it runs a few queries that each name the company as `$1`, and commits. On your computer it keeps a pool of five connections. In a Worker it opens one client per request through Hyperdrive.

> Read 19.9, 19.10, 19.11, 19.17 and F3. Write `servers/ap-ts/src/db.ts` with `pg` 8.23.1: `apDatabase(connect).forTenant(tenant, work)`. It runs `BEGIN READ ONLY` and `SELECT set_config('app.tenant_id', $1, true), set_config('statement_timeout', $2, true)`. It checks the company has a row in `tenants` (if none, the no-data message), runs the work, and commits. It turns error `57014` and a connection timeout into the timeout message, and anything else into "The AP database is not reachable right now. Try again in a minute, and tell the AP lead if it keeps happening." Every query lives in `db.ts`, names the company as `$1`, and takes every value as a parameter. Add `poolConnect` (a pool of five, `allowExitOnIdle`) and `hyperdriveConnect`. Move the four tools onto it. `get_purchase_order` adds `approval_threshold_cents` and `needs_approval`, computed by code from `tenant_settings`. Read 19.13 and 19.15, and rewrite `search_policy`: embed the question before the transaction opens. Then, in the company's transaction, the nearest passages by `<=>` from the same model, joined to their documents for the title. They are returned with document, file, section, line and similarity, or `abstained: true` with the message from 19.15 when none reaches the embedder's threshold. Remove `data.ts`, the asset copying, the `assets` block and `AP_DATA_TENANTS` from `wrangler.jsonc`. Add `nodejs_compat`, a `HYPERDRIVE` binding with a placeholder id, and an `AI` binding. Write `scripts/check-queries.ts` (`npm run check:queries`), which fails if any `SELECT` in `db.ts` or `db.py` does not name the company, or if `app.tenant_id` is set with anything but `true`. Extend `scripts/check-deploy.ts` as F6 says. It fails without the `HYPERDRIVE` or `AI` binding, and it lists a placeholder id. Update `docs/acceptance-prompts.md` for the new output, and `scripts/conformance.ts` and `scripts/acceptance.ts` so a search answer is judged by its citations. If any other Chapter 18 test or check must change, stop and show me each one, old and new, first. Examples are rule 7's tests of `AP_DATA_TENANTS`, the Worker's environment in `auth.test.ts`, and Cedar Ridge's no-data message in `scripts/matrix.ts`. Run every test, `npm run conformance` and `npm run check:deploy`.

**What good looks like:** every test passes, including Task 5's. Cedar Ridge gets `total_count 16`. `check:queries` passes. `conformance` fails only where the two connectors now differ, because the Python one changes in Task 7. Task 7 brings it to `0 failed`. `check:deploy` lists the Hyperdrive id as a placeholder still to fill. Ask: "Show me every place in `servers/ap-ts/src/` where a company id reaches SQL." Expect only `db.ts`, always as a parameter.

**Check it now.** Download [Task 6's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-6.md).

### Task 7. The Python connector (30 minutes, Codex)

**Goal:** the Python connector on the same database, with the same transaction rule and the same answers.

**Predict:** will the Python copy need its own pool, given that it runs on your computer?

> Read 19.9, 19.17, F1 and `servers/ap-ts/src/db.ts`. In `py/`, add `psycopg[binary]==3.3.6` and write `brightline_ap/db.py`: a `ConnectDatabase` whose `for_tenant(tenant, work)` opens one connection per tool call. It runs one read-only transaction with `set_config('app.tenant_id', %s, true)` and the same time limit, and checks `tenants`. It maps errors to the same two messages as TypeScript, word for word. Write `brightline_ap/embeddings.py` with a test embedder that gives exactly the numbers `servers/ap-ts/src/embeddings.ts` gives. Move the four tools onto it, with the same outputs. Update the Python tests as Task 5 did, showing me each changed Chapter 18 test first. Make the Python Worker entry answer 503 until it has a database connection, and say so in a comment. Run `npm run test:py`, `npm run check:py` (Pyright strict) and `npm run conformance`.

**What good looks like:** the Python tests and Pyright pass, and `conformance` reports `0 failed` with both servers giving the same answers. Your prediction gets its answer in Task 8.

**Check it now.** Download [Task 7's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-7.md).

## Sitting 3: proving the data stays apart (about 1 hour 50 minutes)

### Task 8. The data matrix (35 minutes, OpenCode)

**Goal:** 25 rows that try every route from one company's rows to another's, passing on both connectors.

**Predict:** which row is most likely to fail first, and in which language?

> Read 19.12 and F7. Write `scripts/data-matrix.ts` (`npm run matrix:data -- --env dev|ci|staging`). Part 1, the database, every transaction rolled back: D1, the reader with no company set sees 0 rows in every table. D2, for each loaded company, every row the reader sees is that company's. D3, the reader cannot write. D4, Cedar Ridge's loader cannot insert a `tenants` row for another company, or Brightline's rows in `vendors`, `invoices` and `policy_documents`. It changes 0 rows of Brightline's `tenant_settings`. D5, a Cedar Ridge invoice for vendor V006 is refused with `23503`. D6, one pooled connection, Ana's transaction then Luis's, 200 times, and 0 rows seen between transactions. D7, `check:roles` passes. Part 2, starting one TypeScript copy on 8717 and one Python copy on 8718 with test tokens. D8, four "not found" pairs (another company's id against an id that exists nowhere) give the same reply. D9, six Cedar Ridge calls across every tool contain none of a list of Brightline-only words. D10, 100 pairs of Ana's and Luis's calls at once each get their own totals. Print one line per row and `matrix:data: N rows passed, M failed`. Run it.

**What good looks like:** in the authors' run, the first run failed one row. It was D10 on the Python copy, `108 of 200 answers wrong`, every one of them "The AP database is not reachable right now." Not a leak: the Python copy opened a connection for every call, 200 at once, past the database's connection limit. If yours does too, ask Codex to cap the Python copy at ten open connections, then run the matrix again: `25 rows passed, 0 failed`. A failure of the safe kind, an error, never another company's rows, is still a failure to fix.

**Check it now.** Download [Task 8's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-8.md).

### Task 9. Six planted bugs (30 minutes, OpenCode)

**Goal:** proof that every check can fail, with each of six bugs caught by at least one.

**Predict:** which of the six do you expect only one check to catch?

> Read 19.12. On a throwaway branch for each, against a fresh `ci` database (`npm run db:migrate -- --env ci`, `npm run db:passwords -- --env ci`, and the three companies loaded with `--env ci --replace`, on a `ci` branch you make in Neon from `dev`, with its owner connection string in `.secrets/db.ci.env` as in Task 0), plant one bug at a time. Run `check:roles`, `check:queries`, `matrix:data` and the TypeScript tests against `ci`, record which fail, then delete the branch and reset `ci` to `dev`. After bug 4, run `npm run db:passwords -- --env ci` again, which writes the reader's string back. The bugs: 1, `vendors` set to `NO FORCE ROW LEVEL SECURITY`. 2, the company set with `set_config(..., false)`, and the open-invoice count query run on a second pooled connection with its company parameter removed. Then a control, 2b: only `set_config(..., false)`. 3, one query (`vendorIds`) with its company parameter removed. 4, `DATABASE_URL_READER` in `.secrets/db.ci.env` set to the owner's connection string. 5, the composite foreign key from `invoices` to `vendors` dropped. 6, a `SECURITY DEFINER` function, granted to `ap_reader`, that tells `find_vendor` whether an id exists at any company, so it can say "Vendor V008 belongs to another company." Give me a table: bug, checks that failed, checks that passed. Add it to `ports/ch19.md`. Merge nothing.

**What good looks like:** every bug fails at least one check. Compare with the authors' table in [19.12](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/proving-the-data-stays-apart/). Bug 3 is caught only by `check:queries`: row-level security still held, which is exactly why the company is a parameter too. Bug 5 is caught only by the data matrix's D5. The control, 2b, is caught only by `check:queries`, and leaks nothing: every query still names its company.

**Check it now.** Download [Task 9's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-9.md).

### Task 10. Export and delete (25 minutes, Claude Code)

**Goal:** a trial company's data exported, with nothing of anyone else's, then deleted, with proof that nothing is left.

**Predict:** which role should run the export, and why not the owner?

> Read 19.10, gap 4, and 19.11. Write `scripts/tenant-export.ts` (`npm run tenant:export -- --env <env> --company <id>`): as `ap_reader`, in one transaction with the company set, every table into `exports/<company>/<table>.json` (embeddings left out, their model name kept). It stops if any row is another company's. Add `exports/` to `.gitignore`. Write `scripts/tenant-delete.ts` (`npm run tenant:delete -- --env <env> --company <id> --confirm <id>`): as `ap_loader`, with the company set, delete its rows from every table, children first. Then count as the owner, which sees every row, that every table holds zero rows for it. Load `org_juniper` from `data-juniper/`, export it, show me the counts, then delete it and show me the last line.

**What good looks like:** the export holds 2 vendors, 2 invoices, 1 purchase order, and every row is `org_juniper`'s. The delete ends: `Every table now holds 0 rows for org_juniper (counted as the owner).` If your owner role cannot skip row-level security, the script counts as the loader with the company set instead, and ends `(counted as the loader, with the company set)`. That proof is as good: the loader's policy shows it every row that company has. The authors ran both. In a real offboarding, Chapter 18's `npm run tenant:remove` runs first, to stop new tokens. Your prediction: the reader, so the policies, not the script's own `WHERE`, decide what leaves.

**Check it now.** Download [Task 10's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-10.md).

### Task 11. Review (20 minutes, Codex reviews TypeScript, Claude Code reviews Python)

**Goal:** a fresh-context review of the database work against [F7](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f7-the-multi-tenant-data-checklist).

> (To Codex, in a fresh session.) Read `REVIEW.md` and `docs/chapter-19/field-guide.md`, section F7. Review every change since `lab19-start` in `servers/ap-ts/`, `db/` and `scripts/` against the fourteen checklist items. For each item, say passed, failed or not checked, with the file and line. Change nothing.

Then the same to Claude Code, for `py/`.

**What good looks like:** every item has an answer. Item 7 (caching off) says "not checked": it can only be checked online, in Task 16. Fix or answer every finding before Sitting 4.


**Checkpoint 2: keeping companies apart.** Before Sitting 4, check that you can do these without looking back.

- Say which roles skip row-level security, why the connector's role must not, and which check proves it on every build ([19.8](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/row-level-security/)).
- Explain what goes wrong if the company is set for the connection instead of the transaction. Also say why that bug shows as wrong data, not an error ([19.9](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/one-company-per-transaction/)).
- Name two gaps that row-level security does not close, and the rule for each, including the connector itself ([19.10](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/where-the-guarantee-stops/)).
- Say which of the six planted bugs only one check caught, and what that means for removing a check ([19.12](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/proving-the-data-stays-apart/)).

**Check it now.** Download [Task 11's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-11.md).

## Sitting 4: answers from documents (about 2 hours 5 minutes)

**Sign-in on your computer, once, before Task 14's answer check.** The zip's sign-in server starts with an empty database on your computer. If you did not keep Lab 18's, make it again:

> Start the sign-in server in the background (`npm run dev:auth`). With `npm run tenant:add -- --env local`, create Brightline (`org_brightline`, owner Ana Morales <ana@brightline.example>) and Cedar Ridge Supply (`org_cedar`, owner Luis Moreno <luis@cedarridge.example>), as Lab 18's Task 8 did, printing only names. Run `npm run client:add -- --env local --client-id brightline-claude-code --name "Claude Code (lab)" --redirect http://localhost:8790/callback`, and the same for `brightline-claude-code-cedar` on port 8791. Start the TypeScript connector on 8717 against `dev` (`npm --workspace @brightline/ap-ts start`).

**Then, by yourself:** in a new Claude Code session, approve `apts` and `apts-cedar`, type `/mcp`, and authenticate. Sign in as Ana through `apts` and as Luis through `apts-cedar`. Their passwords are in `.secrets/test-users.local.env`: open it in your editor, never in the agent.

### Task 12. Retrieval rules, with the expert (20 minutes, Claude Code)

**Goal:** the four retrieval decisions of [19.15](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/answers-that-cite-or-abstain/), made by Ana and Luis and recorded.

**Predict:** what should happen to `data-cedar/policies/old-email-approvals-2024.md`?

> Read 19.13 and 19.15. Interview me, as Ana, then as Luis, about the four decisions: which documents count, how they are split, what a citation looks like, and when to abstain. Show me each company's policy folder and its `manifest.csv` first. Add a "Documents and retrieval" section to `docs/data-spec.md`, and change `manifest.csv` only if I ask.

**What good looks like:** as Luis, answer with "The old email doesn't count. It was never a policy, and our approvals start at $2,500." Its `counts` stays `no`. One passage per rule. A citation is the document's title and line, with the file. Abstain below the threshold the question set sets.

**Check it now.** Download [Task 12's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-12.md).

### Task 12b. Look inside the search: predict, then run (40 minutes, Claude Code)

**Goal:** you can read a search's results as candidates, and see from its plan whether it used the vector index. You can also say where search by words would do better.

**Predict:** before each statement runs, write down in `ports/ch19.md` what it returns, and why.

> Read 19.13, 19.14 and F4. Run blocks 7 to 14 in `../concept-blocks/sql/` in order, each with `node ../concept-blocks/sql/run.mjs <file>`. Block 12 runs as the owner, read-only, to show a plan that uses the vector index. Run it, and never use the owner for anything else. For every statement: show it to me, wait for my prediction, run it, then explain it in plain words. Say where my prediction was wrong, if it was. Then, with me as Ana and then as Luis, ask me for three questions people will really ask that contain a code, a name or an amount. Run each one three ways as `ap_reader` with the right company set, read-only:
>
> - By meaning, as block 8 does.
> - By words, as block 9 does.
> - Hybrid, as block 14 does.
>
> Choose the words to search for with me. Record in `ports/ch19.md` which search put the right rule first for each, or that none did.

**What good looks like:**

- **The blocks:** exactly the outputs printed in [19.14](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/embeddings-and-pgvector-in-depth/) and, for Blocks 11 to 13, in [F4](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f4-embeddings-and-vectors-from-zero). Distances 0.00, 0.04, 1.00 and 2.00. Purchasing lines 5 and 6 at 0.72 and 0.63. "PO" by words, 0 rows, "blanket", line 7. The $400 and $4,000 questions at similarity 1.00. A plan through `policy_passages_pkey` for Cedar Ridge, and one through `policy_passages_embedding` for the owner. 12 passages, about 78 bytes of text and 4,100 bytes of embedding each. Hybrid search puts purchasing line 6 first (0.0325), ahead of line 5 (0.0164).
- **Your three questions:** at least one where search by words or hybrid search did better than meaning alone, or a written reason why none did. A question with an amount should say that the rule and the code decide it, not the search.
- **Your notes:** at least one wrong prediction, with the reason.


**Check it now.** Download [Task 12b's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-12b.md).

### Task 13. The real model, and the guards (30 minutes, Claude Code for TypeScript, Codex for Python)

**Goal:** the passages embedded by a real model, and `search_policy` answering by meaning, with citations, abstention, and only the company's own passages. Also the copy guard proved.

**By hand first, if you made the Cloudflare token:** change the first line of `.secrets/embeddings.env` to `AP_EMBEDDINGS=workers-ai`, in your editor.

**Predict:** for Luis's question, "Do we need a PO for a $400 repair?", which two lines should come back first?

> (To Claude Code.) Read 19.5, 19.13, 19.15 and F4. Show me `policy_documents` and `policy_passages` as Task 2 made them. Explain, line by line, what is kept on every row on purpose and the rule that keeps each true. These are `tenant_id` and the composite foreign key, and the embedding with `content_sha256`, `embedded_sha256` and the check `embedding_matches_content`. Then show me the HNSW index. If anything in them differs from `docs/data-spec.md`, fix it in a new migration, never by editing one that ran. Add Workers AI's bge-m3 to `servers/ap-ts/src/embeddings.ts`, through the AI binding and the REST API, checking each embedding has 1,024 numbers, chosen by `AP_EMBEDDINGS=workers-ai`. Write `scripts/embed.ts` (`npm run embed -- --company <id>`). I may have set `AP_EMBEDDINGS=workers-ai` myself. If so, embed every company again. Otherwise keep the test embedder and say so. Then ask Luis's question and Ana's ("Do we need a PO for a $400 repair?", asked by each), and "What is the capital of France?", and show me each answer. Then, in a transaction you roll back, change Cedar Ridge's "$500.00" rule to "$5,000.00" without embedding it again. Show me the error.

Then, to Codex: "Add Workers AI's bge-m3 to `brightline_ap/embeddings.py` through the REST API, with the same check, and run `npm run conformance`."

**What good looks like:** with the test embedder, Luis's top two are `data-cedar/policies/purchasing.md` lines 5 and 6. With bge-m3, both should still be in his top three. Note what you see. Ana's cites `docs/policies/po-matching.md`, line 5. France abstains. The edit is refused by `embedding_matches_content`. Every Cedar Ridge passage comes from `data-cedar/policies/`. `conformance` reports `0 failed`.

**Check it now.** Download [Task 13's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-13.md).

### Task 14. Measure it (35 minutes, OpenCode, then you)

**Goal:** a question set in the build, and proof that a worse chunking fails it.

**Predict:** if Cedar Ridge's documents were one passage each, which of its questions would still pass?

> Read 19.16. Copy `../lab-files/questions.csv`, the twelve questions Ana and Luis wrote for the authors' run, to `eval/questions.csv`, and add any of your own from Task 12b. Keep at least ten with an answer and two that should abstain, across Brightline and Cedar Ridge. Each has its expected `file:line` (several allowed, separated by `|`) or `abstain`. Write `scripts/retrieval-eval.ts` (`npm run eval:retrieval -- --env <env>`): each question asked as its company, through `db.ts` and the embedder. Then a table of results, found in the top three and abstained when it should, and a pass mark. Run it. Then load Cedar Ridge with whole-document passages (`--chunk document --replace`), run it again, show me the failure, and load Cedar Ridge back with `--replace`.

**What good looks like:** with the test embedder, found in the top three 10 of 10, abstained 2 of 2, `passed`. With whole documents: 7 of 10, `FAILED`. Of Cedar Ridge's questions, only those whose answer is a document's first rule still pass. **Then, if you made the Cloudflare token:** you set `AP_EMBEDDINGS=workers-ai` before Task 13. Run `npm run embed` for each company, and run the set with bge-m3. Note the real similarity scores in `ports/ch19.md`. Choose bge-m3's threshold so the set passes: high enough that the off-topic questions abstain, low enough that every answer is found. Afterwards, in your editor, set the first line back to `AP_EMBEDDINGS=test`, and run `npm run embed` for each company again. The unit tests and CI use the test embedder. **Not yet run online by the authors.**

**Then the answer check (10 minutes, you as Ana and Luis).** Write [19.16](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/measuring-retrieval/)'s four answer-check lines in `eval/answers.md`. Ask each question in Claude Code through your local connector, signed in as the right company ("Sign-in on your computer", below). For each answer, mark pass or fail on all three parts: the decision, the citation, and the claim it must not make. Record the result in `ports/ch19.md`. **What good looks like:** four passes. If an answer fails while the question set passes, the passages were right and the answer was wrong. Note which part failed, because that is a prompt or model problem, not a retrieval problem.

**Checkpoint 3: answers from documents.** Before Sitting 5, check that you can do these without looking back.

- Explain why Luis's "PO" question finds a rule that says "purchase order", and why the search can only find Cedar Ridge's passages ([19.13](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/retrieval-from-zero/)).
- Say why the $400 and $4,000 questions get the same passages, and who decides which rule applies. Also say how a plan shows whether the vector index was used ([19.14](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/embeddings-and-pgvector-in-depth/)).
- Say when `search_policy` abstains, who chose the threshold, and why abstaining is better than the nearest passage ([19.15](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/answers-that-cite-or-abstain/)).
- Say what the question set checks, what the answer check checks, and one failure each would catch that the other would not ([19.16](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/measuring-retrieval/)).

**Check it now.** Download [Task 14's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-14.md).

## Sitting 5: branches, deploy and real use (about 1 hour 35 minutes)

### Task 15. A branch per pull request (25 minutes, Claude Code)

**Goal:** every pull request tested on its own copy of the database, deleted when it closes.

**Predict:** why is the pull request's branch copied from `staging`, not from `main` or `dev`?

> Read F6. Rewrite `.github/workflows/ci.yml` so a `database` job creates a Neon branch `pr-<number>` from `staging` with `neondatabase/create-branch-action@v6`. It applies the migrations, sets the passwords, and loads the three companies with `--replace` and the test embedder. Then it runs every check: `check:roles`, `check:queries`, the unit tests, `conformance`, `matrix:data`, `eval:retrieval` and `check:deploy`. Add `.github/workflows/ci-cleanup.yml`, which deletes the branch with `neondatabase/delete-branch-action@v3` when the pull request closes. Set the secret `NEON_API_KEY` from `.secrets/neon.env` and the variable `NEON_PROJECT_ID`, without printing either. Open a pull request with one small change, and show me its checks.

**What good looks like:** the pull request's checks run on `pr-<number>`. The Neon Console shows that branch while the pull request is open, and not after it closes. Your prediction: `main` will hold production data, which must never be copied into a test. `dev` already has your new migrations, so a copy of it would apply none of them. `staging` holds sample companies and only migrations that were merged, so the pull request's migrations really run on the copy. The `tests-unchanged` check fails on your pull request, by design. It lists the Chapter 18 tests you approved changing in Tasks 5 to 7, and that red line is their record. **Not yet run online by the authors.**

**Check it now.** Download [Task 15's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-15.md).

### Task 16. Staging and production (35 minutes, Claude Code, OpenCode checks)

**Goal:** the database and connector online in staging, and in production if you choose. Staging, the core path, takes about 15 of the 35 minutes, and production, an extension, about 20.

**Predict:** which role's connection string goes into the Hyperdrive configuration, and why that one?

**Before the agent starts:** in your editor, set the first line of `.secrets/embeddings.env` to `AP_EMBEDDINGS=workers-ai`.

> First, a Four-Part Brief (Chapter 5) for this task, and add the database rules to the Deploying section of `AGENTS.md`. Then read F3, F6 and `docs/deploy.md`. Use the `staging` branch from Task 0. A deployed connector always uses the real model, so I set `AP_EMBEDDINGS=workers-ai` in `.secrets/embeddings.env` before this task. Write the staging branch's owner connection string to `.secrets/db.staging.env`, never shown, and run `npm run db:migrate -- --env staging`, `npm run db:passwords -- --env staging --github` and `npm run check:roles -- --env staging`. Make the Hyperdrive configuration `brightline-ap-staging` with `--caching-disabled` and the staging reader's direct connection string, read from the file. Put its id in `servers/ap-ts/wrangler.jsonc` under `env.staging`. Load the three companies into staging with `--env staging`. Set the GitHub secrets with `gh secret set -f .secrets/github-db.staging.env`. Then follow Chapter 18's first-time staging steps (`docs/chapter-18/F8.md`, steps 1 to 10) to deploy the sign-in server and the connector, and run `npm run conformance:staging` and `npm run matrix:data -- --env staging`. Measure how long the first call takes after the staging database has been idle for ten minutes. Production only if I say so in this session, through `deploy.yml`, with its database steps as F6 describes.

Then, to OpenCode: "Run `npx wrangler hyperdrive get` for the staging configuration and confirm caching is disabled. Change nothing."

**What good looks like:** `check:roles` passes on staging, Hyperdrive shows caching disabled, and `conformance:staging` and the data matrix both report `0 failed`. Record the first call's time in `ports/ch19.md`. Your prediction: the reader's, so the deployed Worker can never connect as a role that skips row-level security. **Not yet run online by the authors.**

**Check it now.** Download [Task 16's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-16.md).

### Task 17. Real use (20 minutes, Claude Code)

**Goal:** real sign-ins as Luis and as Ana, each getting their own company's answers, with citations.

> Sign me in to the local connector from Claude Code as Luis Moreno (Cedar Ridge), as in Chapter 18's Task 13. Then I will ask three questions: "Which of our invoices are open?", "Does PO-3103 need approval?" and "Do we need a PO for a $400 repair?" Then sign me in as Ana Morales (Brightline) and I will ask the same three.

**What good looks like:** Luis's answers come from Cedar Ridge. They show its 16 open invoices, `needs_approval` true at its $2,500.00 threshold, and a citation of its purchasing policy. Ana's come from Brightline: its 13 open invoices, no PO-3103 ("No purchase order PO-3103. Purchase orders run from PO-7001 to PO-7012."), and a citation of Brightline's purchase order matching policy, line 5. Neither answer ever names the other company's vendors.

**Check it now.** Download [Task 17's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-17.md).

### Task 18. Ship it (15 minutes, Claude Code)

> Update `docs/deploy.md` with the business database: branches, roles, Hyperdrive configurations, export, delete and rollback. Update `README.md`. Open the pull request with the template, wait for its checks and the AI review (Chapter 15's reviewer on every pull request), and show me both. I will merge. Then tag the merge `ch19`, push the tag, and from a clean clone of the tag run every check that needs no deployed server.

**For the clean clone:** it has no `.secrets/`. Copy `.secrets/db.dev.env` and `.secrets/embeddings.env` into it yourself, never through the agent, and do not run `db:passwords` there.

**What good looks like:** the tag passes from a clean clone, against your `dev` branch. Staging already has migrations 0001 to 0004 from Task 16, so the merge's deploy applies none, and the runner says so.

**Check it now.** Download [Task 18's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-18.md).

## Core and extensions

**Extensions:** Task 11b (find the bug yourself, in the appendix below), production in Task 16, and the Python Worker, which still answers 503.

**Core, about 10 hours 5 minutes:** every task except the extensions, with Task 16 for staging only. Task 11, the code review, is core: it is the only check on the one place that sets the company ([19.10](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/where-the-guarantee-stops/), [F7](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f7-the-multi-tenant-data-checklist) item 14).

## Apply it to your vertical (optional)

Pick a business you know with at least two customers: a clinic group, a law firm's offices, a school district. Write its `data-spec.md`: its tables, with the customer in every key, its "never stored" list, and one transitive dependency someone would be tempted to add. Then write three questions for its question set, one of which should abstain.

## If something goes wrong

| What you see | Why | What to do |
| --- | --- | --- |
| `stopped: .secrets/db.dev.env does not exist` | Task 0's connection string step did not run | Ask Claude Code to write it from `neonctl`, never shown |
| `28P01` on connect | A password in `.secrets/db.<env>.env` is out of date | `npm run db:passwords -- --env <env>` |
| `permission denied for table vendors` | Connected as a role with no right to it, or the grants did not run | `npm run db:migrate`, then `npm run check:roles` |
| A query as the reader returns 0 rows | No company set for the transaction | Expected with nothing set. Check `set_config(..., true)` runs inside `BEGIN` |
| `WARNING: SET LOCAL can only be used in transaction blocks` | The setting ran outside a transaction, and did nothing | Open the transaction first |
| `check:roles` says a role has `BYPASSRLS` | It was made in the Neon Console | Drop it, and let `0003_roles.sql` make it with SQL |
| `has changed since it ran on dev` | A migration was edited after it ran | Revert the edit, and add a new migration |
| `The policies were embedded with X, not Y` | The connector's model differs from the stored embeddings | `npm run embed -- --company <id>` for each company |
| `The AP database did not answer in time` on the first call of the day | The free database was asleep ([F2](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/field-guide-business-data-and-retrieval/#f2-neon-from-zero)) | Try again. Record the time in `ports/ch19.md` |
| Half the calls fail with "not reachable" under load | Too many connections at once | Cap open connections per copy (Task 8) |
| `wrangler dev` fails to start the AI binding | The AI binding always reaches Cloudflare, even locally | Sign in with `wrangler login`, or run with `AP_EMBEDDINGS=test`, allowed only with a 127.0.0.1 issuer |

## Exam notes

- **CCDV-F, context management (supporting).** Retrieval puts the right passage in front of the model, and abstaining keeps the wrong one out ([19.13](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/retrieval-from-zero/) to [19.16](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/measuring-retrieval/)).
- **CCDV-F, injection, untrusted input and leakage (supporting).** One company's data reaching another is a leak, whether as rows, errors or counts ([19.8](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/row-level-security/) to [19.12](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/proving-the-data-stays-apart/)). Policy passages are untrusted text ([19.15](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/answers-that-cite-or-abstain/)).
- **CCDV-F, systems life cycle (supporting).** Migrations per environment, a branch per pull request, export and deletion ([19.6](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/changing-the-tables-safely/), [19.11](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/each-companys-own-rules-and-data/)).
- **CCDV-F, MCP server development (supporting).** A database behind a stateless MCP server ([19.9](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/one-company-per-transaction/), [19.17](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/a-database-behind-a-stateless-server/)).
- The exam examines Claude only. These products are not examined.

## Artifact checklist

- [ ] `docs/data-spec.md`, with the tenancy model, every column, "Never stored", the roles, and documents and retrieval
- [ ] `db/migrations/0001` to `0004`, and `scripts/db-migrate.ts`, `db-passwords.ts`, `check-roles.ts`, `check-queries.ts`
- [ ] `scripts/tenant-load.ts`, `tenant-export.ts`, `tenant-delete.ts`, `embed.ts`
- [ ] `servers/ap-ts/src/db.ts` and `embeddings.ts`, and `py/brightline_ap/db.py` and `embeddings.py`
- [ ] `scripts/data-matrix.ts`, passing 25 rows, and the six planted bugs in `ports/ch19.md`
- [ ] `eval/questions.csv` and `scripts/retrieval-eval.ts`, passing
- [ ] Your list of transitive dependencies from Task 3b, in `ports/ch19.md`
- [ ] `.github/workflows/ci.yml` with a Neon branch per pull request, and `ci-cleanup.yml`
- [ ] `servers/ap-ts/wrangler.jsonc` with `HYPERDRIVE`, `AI` and `nodejs_compat`, and no assets
- [ ] `ports/ch19.md`, `docs/deploy.md`, tag `ch19`

## Appendix: Task 11b. Find the bug yourself (optional, 25 minutes, Codex plants, you diagnose)

*An extra for readers who want to practice diagnosis. Do it after Task 11, any time before Sitting 5.*

**Goal:** you find a broken part of tenant isolation from the symptoms alone, the way you would on a real team. Nobody tells you which part is wrong.

**Predict:** nothing yet. You do not know what was changed.

> (To Codex, in a fresh session.) Read 19.12 and Task 9 in `../LAB.md`. On a new git branch called `mystery`, plant exactly one bug that breaks tenant isolation: one of Task 9's six, or a small variation of one. Do not tell me which. Commit it with the message "Tidy up database code". Write which bug you planted, and the file and line, to `.secrets/mystery.md`, which git ignores, and do not show me that file. Then reset the `ci` database to `dev`, run `npm run db:migrate -- --env ci` and `npm run db:passwords -- --env ci`, load the three companies with `--env ci --replace`, and stop.

Now you work it out. Run the checks yourself, or ask Claude Code, in a different session, to run them and show you only their output. The checks are `npm run check:roles -- --env ci`, `npm run check:queries`, `npm run matrix:data -- --env ci`, and the TypeScript tests against `ci`, as in Task 9. From which checks fail, and their messages, write in `ports/ch19.md` which rule is broken ([19.8](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/row-level-security/), [19.9](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/one-company-per-transaction/), [19.10](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/where-the-guarantee-stops/) or [19.4](https://agentfactory2.panaversity.org/building-ai-workers/business-data-and-retrieval/designing-the-ap-tables/)). Also write which part of the code or database you expect it in, and why. Only then ask Claude Code to read `git diff main..mystery` and tell you whether you were right. Open `.secrets/mystery.md` last.

**What good looks like:** you named the broken rule from the failing checks before you saw the diff. If a check you expected to fail passed, write down why. That is the most useful thing this task can teach. Then delete the `mystery` branch, reset `ci`, and delete `.secrets/mystery.md`.

**Check it now.** Download [Task 11b's answer key](https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch19-key-task-11b.md).
