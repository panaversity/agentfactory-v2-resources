From *The AI Agent Factory*, Chapter 19, for the coding agents working in this repository. The chapter itself is the source.

# Field guide: business data and retrieval, product by product

*The concepts named no product. This field guide names them, and gives each step exactly. Read F0 to F4 before the lab's first sitting. The lab sends you to the others when you need them. Every fact here was checked on its owner's page on November 4, 2026. Steps the authors could not run without an account are marked **not yet run online**, with what is missing.*

## F0. The repository you start with, and the secrets on your computer

**The zip.** `brightline-lab-ch19.zip` holds `brightline-ap/`, a plain folder with no git history (Task 0 starts it and tags `lab19-start`). The folder holds Chapter 18's connector, sign-in server, tests and checks. The new parts are Cedar Ridge's data (`data-cedar/`), a trial company's (`data-juniper/`), and each company's settings (`settings.csv`). They also include the list of policy documents that count (`manifest.csv` in each policy folder) and the third normal form exercise (`exercises/3nf/`, Task 3b). The last is this chapter as text (`docs/chapter-19/`), so your agents can read it. You need no earlier lab.

**The secrets.** Nothing in this table is ever typed into a chat, printed, or committed. Git ignores `.secrets/`.

| File | Holds | Made by | Read by |
| --- | --- | --- | --- |
| `.secrets/neon.env` | `NEON_API_KEY`, `NEON_PROJECT_ID` | You make the key in the Neon Console (F2). Claude Code adds the id | `npx neonctl`, and `gh secret set` once (F6) |
| `.secrets/db.dev.env` | `DATABASE_URL_OWNER` for the `dev` branch, then the loader's and reader's passwords and connection strings | Claude Code, from `neonctl connection-string` (owner), then `npm run db:passwords` | Every database script, the tests, the Node copies |
| `.secrets/db.staging.env`, `db.production.env` | The same, per branch | The same, in Sitting 5 | The same, with `--env staging` or `--env production` |
| `.secrets/github-db.<env>.env` | The owner and reader strings, named for GitHub | `npm run db:passwords -- --env <env> --github` | `gh secret set -f` (F6) |
| `.secrets/embeddings.env` | `AP_EMBEDDINGS` (`workers-ai` or `test`), `CLOUDFLARE_ACCOUNT_ID`, `AP_EMBEDDINGS_TOKEN` | You make the token in the Cloudflare dashboard, and write the file with your editor (F4) | `npm run tenant:load`, `npm run embed`, the Node copies, the question set |
| Chapter 18's files | The handle key, the sign-in server's two, the test signing key, test passwords | `npm run keys` | As in Chapter 18 |

**What changed in the repository.** The connector no longer ships any data: `servers/ap-ts/wrangler.jsonc` has no `assets`, and gains a `HYPERDRIVE` binding, an `AI` binding and the `nodejs_compat` flag. `servers/ap-ts/src/data.ts` is gone, replaced by `db.ts` and `embeddings.ts`. The Python connector gains `db.py` and `embeddings.py`. The Python Worker answers 503 until it has a database connection (an extension).

## F1. Postgres from zero

**What it is.** A database server is a program that runs all the time and holds the tables. It answers queries sent by other programs over a network connection (19.1, 19.2). Postgres (PostgreSQL) is a free, open-source relational database server, used by companies of every size since the 1990s. The current release is 18 (18.6 on November 4, 2026). Version 19 is a release candidate, not used here. The lab's SQL works on any current version. The authors also ran it on Postgres 16.15.

**The column types the lab uses.**

| Type | Holds | Example |
| --- | --- | --- |
| `text` | Any text | `'Treasure Valley Lumber'` |
| `bigint`, `int` | A whole number | `268800` (cents) |
| `date` | A calendar date | `'2027-03-29'` |
| `timestamptz` | A moment in time, with its time zone | `now()` |
| `bytea` | Raw bytes, such as a SHA-256 fingerprint | |
| `vector(1024)` | 1,024 numbers, pgvector's type (F4) | |
| `jsonb` | A small JSON document. Not used by the AP tables (19.5) | |

**Constraints.** `NOT NULL` (never empty), `PRIMARY KEY` (unique, and how rows are named), `FOREIGN KEY ... REFERENCES` (must point at a real row), `CHECK (...)` (any rule, such as `amount_cents >= 0`), and `GENERATED ALWAYS AS (...) STORED` (a column the database computes itself, such as `content_sha256`).

**The SQL shapes this chapter shows you.** Each is read, never written by you. 19.2 explains reading rows from zero, 19.4 reads a `CREATE TABLE` line by line, and 19.13 explains the vector index.

| Shape | Meaning |
| --- | --- |
| `CREATE TABLE t (...)` | Make a table with these columns and rules |
| `CREATE INDEX ... ON t (col)` | Keep a sorted shortcut for `col`. `USING hnsw` makes a vector index |
| `SELECT ... FROM t WHERE ... ORDER BY ... LIMIT n` | Read rows that match, in an order, at most n (19.2) |
| `INSERT`, `UPDATE`, `DELETE` | Add, change, remove rows. Only the loader's scripts do |
| `BEGIN ... COMMIT` / `ROLLBACK` | One transaction: all or nothing (19.9) |
| `SELECT set_config('app.tenant_id', $1, true)` | Set the company for this transaction only. `$1` is a parameter, filled in by the driver |
| `CREATE ROLE`, `GRANT`, `ALTER ROLE ... PASSWORD` | Make a database role, give it rights, give it a password |
| `ALTER TABLE ... ENABLE / FORCE ROW LEVEL SECURITY`, `CREATE POLICY` | Turn on row-level security, hold the owner to it, add a rule (19.8) |

**Error codes you will see.** Postgres names every error with a five-character code:

| Code | Meaning | Where you meet it |
| --- | --- | --- |
| `23503` | Foreign key violation: points at a row that does not exist | Task 2, a Cedar Ridge invoice for V006 |
| `23514` | Check violation | Task 13, the embedding fingerprint |
| `42501` | Not allowed: a missing right, or a row-level security policy refused a new row | Task 4, Block 6 and the data matrix |
| `57014` | Query canceled, for example by `statement_timeout` | Task 5, the timeout test |
| `28P01` | Wrong password | If `.secrets/db.<env>.env` is out of date |

**Drivers.** A driver is the library a program uses to talk to Postgres. The TypeScript connector uses `pg` (node-postgres) 8.23.1, which Cloudflare's Hyperdrive documentation names for Workers (8.16.3 or later, with `nodejs_compat`). The Python connector uses `psycopg` 3.3.6. Both send every value as a parameter, never pasted into the SQL text.

**Reading an error (19.3, Block 6).** An error is the database telling you exactly what it refused. Read three things in order: the *code*, the *message*, and the *detail* line, if there is one. The code is a five-character SQLSTATE that names the kind of error.

```sql
INSERT INTO invoices (tenant_id, invoice_number, vendor_id, invoice_date, terms, amount_cents, status)
VALUES ('org_cedar', 'INV-9001', 'V006', '2027-03-02', 'Net 30', 50000, 'open');

INSERT INTO vendors (tenant_id, vendor_id, vendor_name, terms)
VALUES ('org_brightline', 'V099', 'Test Vendor', 'Net 30');

DROP TABLE vendors;
```

*Predict:* the loader, with Cedar Ridge set, tries three things. Which does the database refuse, and for what reason?

```text
ERROR 23503: insert or update on table "invoices" violates foreign key constraint "invoices_tenant_id_vendor_id_fkey"
DETAIL: Key is not present in table "vendors".

ERROR 42501: new row violates row-level security policy for table "vendors"

ERROR 42501: must be owner of table vendors
```

| Code | What it means | What to do |
| --- | --- | --- |
| `23503` | A foreign key points at nothing: Cedar Ridge has no vendor V006 (19.4) | Check the id, or load the vendor first. Never drop the key to make the error go away |
| `42501` with "row-level security" | The row is another company's, so the policy refused it (19.8) | Check which company is set, and why this code tried to write another's row |
| `42501` with "must be owner" | This role has no right to do that at all (19.8) | Nothing: the refusal is the design working |

Two notes. The detail line leaves the key's values out on purpose. On a table with row-level security, Postgres does not print values the role might not be allowed to see. And `23505`, a duplicate key, is the other code you will meet, when a row with the same key already exists.

*Figure 19.30. Read an error by its code first, then its message, then its detail.*

## F2. Neon from zero

**What it is.** Neon runs Postgres for you, as a serverless service. Its storage and compute are separate, and compute grows and shrinks with the load and scales to zero. A new branch is made by sharing stored data, not copying it. Databricks announced in May 2025 that it was buying Neon. Neon is this book's reference host, not a requirement: everything the lab builds is plain Postgres with pgvector (19.18, "Staying portable"). You get a **project** (one Postgres, with its own address). A project holds **branches**: full copies of the database, made in seconds, that share stored data with their parent until something changes. Each branch has its own roles, its own data and its own connection address. The lab uses one project, `brightline-ap`, and four kinds of branch: `main` (production), `staging`, `dev` (yours), and one `pr-<number>` per pull request.

**Making the account (by you).**

1. Go to `neon.com` and sign up. The free plan is permanent and needs no card.
2. In the Neon Console, open your account settings, then *API keys*, and create a personal API key named `brightline-lab`. Copy it once.
3. In your own terminal, in `brightline-ap/`, run `mkdir -p .secrets && umask 077 && printf 'NEON_API_KEY=' > .secrets/neon.env`, then open `.secrets/neon.env` in your editor and paste the key after the `=`. Save. Never paste it into a chat.

From here, Claude Code does everything with `npx neonctl`, Neon's command-line tool, reading the key from that file (Task 0). Neon's documentation now calls the tool `neon`, and keeps `neonctl` as its other name, so both work.

**Roles: the trap.** Neon's documentation says every role made in the Neon Console, the API or the CLI is "granted membership in the `neon_superuser` role". It also says that in projects created after August 15, 2023, `BYPASSRLS` is among the privileges of `neon_superuser` roles. In plain Postgres, a membership does not pass on an attribute like `BYPASSRLS`. So check on your own branch rather than trust either reading: **assume a role made in Neon's dashboard may skip row-level security.** Roles made with SQL (`CREATE ROLE`) are not members of `neon_superuser`, and get only basic rights. That is why `db/migrations/0003_roles.sql` makes `ap_loader` and `ap_reader` with SQL. It is also why `npm run check:roles` reads `rolbypassrls` and `neon_superuser` membership for both, on every branch, on every build. The project's own first role, `neondb_owner`, is a Console role: it runs migrations and never serves a request. **Not yet run online:** `check:roles` against a real Neon branch.

*Connection strings.* Each branch gives two addresses. The first is the **direct** one, such as `ep-cool-darkness-123456.us-east-2.aws.neon.tech`. The second is the **pooled** one, with `-pooler` after the endpoint id, which goes through Neon's own connection pooler in **transaction mode**. Neon's pooler works in transaction mode (a connection is lent for one transaction, then returned, F3). It does not support session-level `SET`: a setting made outside a transaction may stay on a connection that another client gets next. That is one more reason the lab sets the company with `set_config(..., true)`, inside the transaction. The lab uses the direct address for migrations (Neon recommends it), for the scripts, and for Hyperdrive, which pools by itself (F3).

**The Postgres version and pgvector.** Neon supports Postgres 14 to 18. The lab asks for 18, the current release. Neon's pgvector is 0.8.6 on Postgres 18 and 0.8.0 on 14 to 17. Migration `0001` runs `CREATE EXTENSION IF NOT EXISTS vector`.

**The free plan, and what Brightline uses.**

| Limit | Free plan | Brightline's lab |
| --- | --- | --- |
| Projects | 100 | 1 |
| Branches per project | 10 | `main`, `staging`, `dev`, and one per open pull request |
| Storage per project | 1 GB | Well under 1 MB of AP data |
| Compute | 100 CU-hours per project per month. A CU (compute unit) is a size of database computer, so this is about 400 hours of the smallest size, 0.25 CU | A few hours |
| Scale to zero | After 5 minutes idle, cannot be turned off | The first call after a pause is slower (19.17) |
| History for restores | 6 hours | Enough for a lab. Not a backup plan |

## F3. Hyperdrive from zero

**What it does.** A Worker starts fresh for each request (17.4), so it cannot keep a pool of database connections itself. Cloudflare Hyperdrive sits between your Workers and your database, keeps the real connections open and close to the database, and lends one to each request. Its pooler works in **transaction mode**: a request holds one connection for one transaction, then the connection goes back to the pool. Hyperdrive's documentation says it "supports SET statements for the duration of a transaction or a query". It also says that a returned connection is "RESET such that the SET commands will not take effect on subsequent queries." The lab's `set_config(..., true)` lives inside one transaction, which fits exactly. **Not yet run online:** `set_config(..., true)` through Hyperdrive.

**Caching: turn it off.** Hyperdrive caches read-only query results by default, for 60 seconds. Its documentation recommends a cache-disabled configuration for reads that must be fresh, such as sign-in and permissions. For company data, caching is a sharing risk (19.9). So the lab makes each configuration with caching off:

```bash
npx wrangler hyperdrive create brightline-ap-staging --caching-disabled \
  --connection-string="$DATABASE_URL_READER"     # run by Claude Code, reading the file, never printing it
```

In plain words: make a Hyperdrive configuration called `brightline-ap-staging`, with its cache disabled, that connects as **the reader role**, to the staging branch's **direct** address. The command prints an `id`, which goes in `servers/ap-ts/wrangler.jsonc`:

```jsonc
"compatibility_flags": ["nodejs_compat"],
"hyperdrive": [{ "binding": "HYPERDRIVE", "id": "<the id>" }]
```

Inside the Worker, `env.HYPERDRIVE.connectionString` is an address the `pg` driver connects to (`servers/ap-ts/src/db.ts`, `hyperdriveConnect`). Making the configuration with the reader's connection string means the deployed Worker can never connect as a role that skips row-level security.

**On your computer.** `wrangler dev` reads the connection string for the binding from an environment variable, `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` (the binding's name at the end). That variable takes precedence over `localConnectionString` in the config file. The Node copy (`npm start`) does not use Hyperdrive at all: it keeps its own small pool. The authors ran the Worker in `wrangler dev` with that variable set to the `dev` branch's reader string, and four tool calls answered correctly.

**The free plan.** Hyperdrive is included in the free Workers plan. That plan gives you 100,000 queries a day (reset at 00:00 UTC) and 10 configurations per account. Each configuration gets about 20 connections to your database. A query may run for at most 60 seconds.

## F4. Embeddings and vectors from zero

**What an embedding is.** A list of numbers that a model makes from a piece of text, placed so that texts with similar meaning get similar numbers (19.13). The number of entries is the model's **dimensions**. You never read the numbers. You compare them.

**The lab's model: bge-m3 on Workers AI.** bge-m3 is an open-weight embeddings model from BAAI. Its model card gives 1,024 dimensions and inputs of up to 8,192 tokens. The lab runs it on Cloudflare Workers AI, as `@cf/baai/bge-m3`. Cloudflare's pages give its price and a 60,000-token context window, but not its dimensions. So the code checks every embedding it gets back has exactly 1,024 numbers, and fails loudly otherwise.

- *Inside the Worker:* the `AI` binding, `"ai": { "binding": "AI" }`, called as `env.AI.run("@cf/baai/bge-m3", { text: [...] })`.
- *From your computer* (the loader, `npm run embed`, the Node and Python copies, the question set): the REST API, `POST https://api.cloudflare.com/client/v4/accounts/<account id>/ai/run/@cf/baai/bge-m3` with `{ "text": [...] }`. You also need an API token with *Workers AI - Read* and *Workers AI - Edit*.

**Making the token (by you).** In the Cloudflare dashboard, open *My Profile*, then *API Tokens*, then *Create Token*. Use *Create Custom Token* with the two Workers AI permissions above, for your account only. Copy it once. Then, in your own terminal, make `.secrets/embeddings.env` with three lines, `AP_EMBEDDINGS=test`, `CLOUDFLARE_ACCOUNT_ID=` (from *Workers & Pages*, *Account Details*) and `AP_EMBEDDINGS_TOKEN=`. Paste the two values in your editor. The first line stays `test` until Lab 19's Task 13, where you change it to `workers-ai`. **Not yet run online:** any call to Workers AI.

**The free allowance.** Workers AI gives 10,000 neurons a day free. bge-m3 costs 1,075 neurons per million input tokens, so the free allowance covers about nine million tokens a day. Brightline's and Cedar Ridge's policies together are under a thousand tokens.

**The test embedder.** `AP_EMBEDDINGS=test` selects `test-lexicon-v1`, which is **not a model**. It turns words into numbers with a short fixed word list (so "PO" and "purchase order" match). It gives the same numbers in TypeScript and Python, and needs no network. The unit tests, the data matrix, CI and the authors' runs use it. It shows that retrieval is wired correctly: the right company, the citations, the threshold. It cannot show how good a real model is. Task 14 measures that with bge-m3. Its threshold is 0.3. bge-m3's starts at 0.5, to be set from the question set.

**Distance in pgvector.** `<=>` is cosine distance, `<->` Euclidean (L2) distance, `<#>` negative inner product, and `<+>` L1 distance. The lab uses `<=>` and an index built with `vector_cosine_ops`, which must match. HNSW indexes take vectors of up to 2,000 dimensions (4,000 with the half-size `halfvec` type), so 1,024 fits.

**Two index types, and when each fits (19.14).** pgvector's README says HNSW "has better query performance than IVFFlat (in terms of speed-recall tradeoff)" but "has slower build times and uses more memory". IVFFlat "has faster build times and uses less memory than HNSW, but has lower query performance". IVFFlat splits the vectors into `lists` (the README suggests `rows / 1000` up to a million rows) and searches `ivfflat.probes` of them, 1 by default. The lab uses HNSW, and at its size uses neither: `EXPLAIN` shows the exact search (19.14, Block 11).

| | HNSW | IVFFlat | No index (exact) |
| --- | --- | --- | --- |
| Build | Slower, more memory | Faster, less memory, needs rows first | Nothing to build |
| Search | Fast, approximate | Fast, approximate, lower recall for the same speed | Measures every row, never misses |
| Fits | Most retrieval tables | Very large tables built in bulk | A few thousand rows per company, like Brightline's |

*Size.* The README: "Each vector takes `4 * dimensions + 8` bytes of storage", and "Each half vector takes `2 * dimensions + 8` bytes". At 1,024 dimensions that is 4,104 and 2,056 bytes. `halfvec` and its operators arrived in pgvector 0.7.0. Cast a column with `embedding::halfvec(1024)` in an expression index, or store `halfvec(1024)`, and run the question set before and after. Not run by the authors: the local Postgres used for the lab's checks has pgvector 0.6.

**Hybrid search.** The README: "Use together with Postgres full-text search for hybrid search", and "You can use Reciprocal Rank Fusion or a cross-encoder to combine results." A full-text index is `CREATE INDEX ... ON policy_passages USING gin (to_tsvector('english', content))`. Reciprocal rank fusion gives each passage `1 / (60 + its place)` in each list and adds them, where 60 is a commonly used constant. 19.14, Block 14, runs it on Cedar Ridge's policies and shows it putting the right rule first. The lab's `search_policy` does not add it (19.14).

**Why the split layout came back short (19.13).** HNSW is approximate: it is fast because it looks at a limited number of candidates, 40 by default, and filters only after. Keeping the company on the same row is necessary, but not enough on its own. The five came back because the database chose to narrow to the company first, through the key, and order those rows exactly. For a company large enough that the database uses the index, turn on an iterative scan (below).

**HNSW, in numbers.** pgvector's defaults: `m = 16` (links per node), `ef_construction = 64` (how hard it works when building), and `hnsw.ef_search = 40` (how many candidates a search keeps). Its README warns: "With approximate indexes, filtering is applied *after* the index is scanned. If a condition matches 10% of rows, with HNSW and the default `hnsw.ef_search` of 40, only 4 rows will match on average." From pgvector 0.8.0, `SET hnsw.iterative_scan = strict_order` (or `relaxed_order`) keeps scanning until enough rows pass, up to `hnsw.max_scan_tuples` (20,000 by default). At Brightline's size the database does an exact search per company and never needs it (19.13). If a company grows to many thousands of passages, add `SELECT set_config('hnsw.iterative_scan', 'relaxed_order', true)` beside the company setting. pgvector warns that `relaxed_order` can return results slightly out of order, so sort the few results again by distance, or use `strict_order`.

**Embedding again.** `npm run embed -- --company <id>` embeds a company's passages again with the current model, and writes each one's model name and fingerprint. Do it for every company whenever the model changes. Until you do, `search_policy` says the models differ instead of answering.

**Reading a search's plan (19.14, Block 11).** `EXPLAIN` shows how the database plans to run a query, without running it. Read a plan from the most indented line up: that is where the work starts.

```sql
EXPLAIN (COSTS OFF)
SELECT document_id, line_start FROM policy_passages
 WHERE tenant_id = 'org_cedar' AND embedding_model = 'test-lexicon-v1'
 ORDER BY embedding <=> $1::vector
 LIMIT 3;
```

*Predict:* does the database use the vector index here?

```text
Limit
  ->  Sort
        Sort Key: ((embedding <=> '[... 1,024 numbers ...]'::vector))
        ->  Result
              One-Time Filter: (current_setting('app.tenant_id'::text, true) = 'org_cedar'::text)
              ->  Index Scan using policy_passages_pkey on policy_passages
                    Index Cond: (tenant_id = 'org_cedar'::text)
                    Filter: (embedding_model = 'test-lexicon-v1'::text)
```

In plain words, from the bottom: read Cedar Ridge's rows through the table's key (`policy_passages_pkey`), and keep the ones made by this model. Then check the policy's company (the `One-Time Filter` is row-level security at work). Then sort all of them by distance, and keep the first three. `Index Cond` is the condition the index itself answers, here the company, and `Filter` is a test applied to each row the index returned. No vector index: an exact search, which measures every one of the company's passages. With twelve passages, that is the right choice.

On your copy, the most indented line may instead say `Seq Scan on policy_passages`, with both conditions in its `Filter`. That means Postgres has gathered statistics on this small table, and chose to read all of it. The search is the same: no vector index, an exact search.

**A plan that does use the vector index (Block 12).** To see the other kind of plan, this block runs as the table's owner, read-only. The owner skips row-level security (19.8), so the search covers every company's passages at once, which the connector never does. It also switches off the database's option to read a whole table row by row, so that the planner must choose between the two indexes:

```sql
SELECT set_config('enable_seqscan', 'off', true);

EXPLAIN (COSTS OFF)
SELECT document_id, line_start FROM policy_passages
 ORDER BY embedding <=> $1::vector
 LIMIT 3;
```

*Predict:* with no company to narrow by, which index does the plan use?

```text
Limit
  ->  Index Scan using policy_passages_embedding on policy_passages
        Order By: (embedding <=> '[... 1,024 numbers ...]'::vector)
```

That plan uses the HNSW index, `policy_passages_embedding`: fast, approximate, and filtered only after the index has picked its candidates (19.13). When a company grows to many thousands of passages, ask the agent for the plan, and look for which of the two shapes it has. If it is the index, check recall with the question set and turn on the iterative scan (F4).

**What a vector costs (Block 13).**

```sql
SELECT count(*) AS passages,
       round(avg(pg_column_size(content))) AS bytes_of_text,
       round(avg(pg_column_size(embedding))) AS bytes_of_embedding
  FROM policy_passages WHERE tenant_id = 'org_cedar';
```

*Predict:* a rule is about 80 characters. Is its embedding bigger or smaller than its text?

```text
passages | bytes_of_text | bytes_of_embedding
---------+---------------+-------------------
12       | 78            | 4100
```

In plain words: each embedding takes about 4,100 bytes against 78 bytes for the rule it stands for, more than fifty times as much. The 1,024 numbers take 4 bytes each, 4,096 bytes, and a few more bytes record the vector's length. pgvector's documentation counts 4 × 1,024 + 8 = 4,104 bytes, and Postgres reported 4,100 for the stored value on the authors' run. The few bytes between them are bookkeeping. Either way, about 4 KB. A model with 1,536 numbers needs about 6,100 bytes. A million passages at 1,024 numbers is about 4 GB before the index, and the HNSW index adds more. pgvector's half-precision type, `halfvec`, stores 2 bytes per number, halving that, at a small cost in precision (F4). Measure with the question set before you switch.

*Figure 19.31. Read a plan from the bottom up. At this size the database measures every passage exactly. An embedding costs far more to store than its text.*

## F5. The SQL in detail

*Reference. The four migrations, as the agents wrote them, are in `db/migrations/`. Read them with this page beside you.*

- **`0001_vector.sql`.** `CREATE EXTENSION IF NOT EXISTS vector`.
- **`0002_tables.sql`.** The helper `ap_utf8_sha256`, the SHA-256 of a text's UTF-8 bytes (`sha256(content::bytea)` would read a backslash in the text as an escape). Then the nine tables of 19.4, with `tenant_id` in every key and the `CHECK` rules on ids and amounts. They also have `vendor_banking.account_last4` limited to four digits, the two guarded copies on `policy_passages` (19.5), and the HNSW index.
- **`0003_roles.sql`.** `ap_loader` and `ap_reader`, made `NOLOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE`, only if they do not exist yet. `ap_reader` gets `SELECT` on the nine tables. `ap_loader` gets `SELECT, INSERT, UPDATE, DELETE`. Neither gets anything else. `npm run db:passwords` then runs `ALTER ROLE ... WITH LOGIN PASSWORD ...` with a password it makes, so no password is ever in a migration or in git.
- **`0004_row_security.sql`.** For each of the nine tables, the same four statements:

```sql
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors FORCE ROW LEVEL SECURITY;
CREATE POLICY vendors_reader ON vendors FOR SELECT TO ap_reader
  USING (tenant_id = current_setting('app.tenant_id', true));
CREATE POLICY vendors_loader ON vendors FOR ALL TO ap_loader
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));
```

`tenants` uses `id` in place of `tenant_id`. On a table with row-level security enabled, a role with no policy sees nothing (default deny). So a new table that someone forgets to give a policy is safe until they notice. A new table with row-level security not enabled at all is not safe, and `check:roles` notices both.

**What happens to `app.tenant_id` after a commit.** Checked by the authors: before any transaction sets it, `current_setting('app.tenant_id', true)` is null. After a transaction set it with `true` and committed, it is an empty string on that connection. Neither matches a company, so both see no rows. `SET LOCAL` outside a transaction prints `WARNING: SET LOCAL can only be used in transaction blocks` and does nothing, which is why every script and the connector open a transaction first.

**The three normal forms (19.5).** Third normal form is the third of three rules, and each builds on the one before. You can skip this box and still follow the chapter.

- **First normal form: one value per cell.** Every column holds a single value. A vendor with two bank accounts gets two rows somewhere, never one cell saying "4471, 0932".
- **Second normal form: every fact depends on the whole key.** This matters when a key has two columns (19.4). In `invoices`, the key is the company *and* the invoice number. The amount belongs to that pair, because two companies may each have an INV-8303, with different amounts. Now suppose someone added the company's approval threshold to `invoices`. It depends on the company alone, half the key, and it would repeat on every invoice the company has. So it breaks the second rule. It belongs in a table whose key is the company alone: the lab's `tenant_settings`, one row per company (19.11).
- **Third normal form: no fact depends on another non-key column.** A key column is one of the columns that make up the primary key (19.4). Every column that is not part of the key states a fact about the key, the whole key, and nothing but the key. A table that follows all three rules is "in third normal form", or **3NF**.

**The fingerprint guard in SQL (19.5).** Here is how the migration writes it:

```sql
  content_sha256  bytea GENERATED ALWAYS AS (ap_utf8_sha256(content)) STORED,
  embedded_sha256 bytea NOT NULL,          -- written by the loader: the text it embedded
  embedding_model text  NOT NULL,          -- which model made the numbers
  embedding       vector(1024) NOT NULL,
  CONSTRAINT embedding_matches_content CHECK (embedded_sha256 = content_sha256)
```

Three new words in it. `bytea` is a column type for raw bytes, used here for a fingerprint. `GENERATED ALWAYS AS (...) STORED` means the database computes the column itself, from another column, and saves the result: nobody writes it, and nobody can. A **function** is a small named piece of code kept in the database, which a column or a query can use.

**What about a `metadata` column? (19.5)** Many retrieval tables carry a catch-all column of type `jsonb`, which holds a small JSON document per row. It is fine for facts about the passage itself, such as the heading path above it. It is also the easiest place for a transitive dependency to hide, because nobody reads its keys in a schema review. A `"company_name"` inside `metadata` is `passages_bad` again, out of sight. The lab's passages use plain columns for everything a query reads.

## F6. Deploying with a database

**Order, in every environment:** the business database's migrations and `check:roles`, then the sign-in server's migrations, then the sign-in server, then the connector, then the conformance suite (`docs/deploy.md`).

**A Neon branch per pull request.** `ci.yml`'s `database` job:

1. `neondatabase/create-branch-action@v6`, with `project_id` (the variable `NEON_PROJECT_ID`) and `api_key` (the secret `NEON_API_KEY`). It also takes `parent_branch: staging` (so the pull request's new migrations really run, on a copy that holds sample companies, never production's), `branch_name: pr-<number>` and `role: neondb_owner`. Its output `db_url` is the branch's owner connection string. (Its other outputs include `db_url_pooled`, `db_host` and `branch_id`.)
2. `npm run db:migrate -- --env ci`, `npm run db:passwords -- --env ci`, and `npm run tenant:load -- --env ci --replace` for the three companies, with the test embedder.
3. Every check: `check:roles`, `check:queries`, the unit tests, `conformance`, `matrix:data`, `eval:retrieval` and `check:deploy`.

`ci-cleanup.yml` runs when the pull request closes: `neondatabase/delete-branch-action@v3`, with `branch: pr-<number>`. A coding agent sets the key and the id once: `gh secret set NEON_API_KEY` reading from `.secrets/neon.env`, and `gh variable set NEON_PROJECT_ID`. **Not yet run online:** both workflows.

**Staging and production.** Each has its own Neon branch (`staging`, `main`) and its own `.secrets/db.<env>.env`. Each also has its own Hyperdrive configuration made with caching off and the reader's direct string (F3). `npm run check:deploy` fails if the Worker has no `HYPERDRIVE` or `AI` binding, ships data assets, lacks `nodejs_compat`, or if staging and production share one Hyperdrive id. `deploy.yml` runs `db:migrate` and `check:roles` for the environment before any Worker deploys, with `DATABASE_URL_OWNER_STAGING` and `DATABASE_URL_READER_STAGING` (or the same names ending `_PRODUCTION`) from GitHub secrets (`npm run db:passwords -- --env <env> --github`, then `gh secret set -f .secrets/github-db.<env>.env`).

**Rollback.** `wrangler rollback` rolls back a Worker, never the database. Because every migration adds (19.6), the previous connector still works against the newer tables. Neon keeps 6 hours of history on the free plan. A restore is a person's decision.

## F7. The multi-tenant data checklist

*One page a reviewer works through, for any change that touches the business database. It extends Chapter 18's F9.*

1. Every table that holds company data has `tenant_id`, in its primary key and in every foreign key. It is listed in `COMPANY_TABLES`.
2. Row-level security is enabled and forced on every such table, with a policy for `ap_reader` and one for `ap_loader`. (`check:roles`)
3. The connector connects only as `ap_reader`, which has no `BYPASSRLS`, is not a superuser, is not in `neon_superuser`, and cannot write. (`check:roles`)
4. No `SECURITY DEFINER` function is callable by `ap_reader` or `ap_loader`. (`check:roles`)
5. Each tool call is one transaction, with the company set by `set_config('app.tenant_id', $1, true)` from the request context, never from an input. (Unit tests, data matrix D6 and D10)
6. Every query names the company as a parameter, and every value is a parameter. The model never sends SQL. (`check:queries`, code review)
7. Caching is off in every Hyperdrive configuration the connector uses. (`wrangler hyperdrive get`, **not yet run online**)
8. "Not found" is the same whether the row exists for another company or nowhere, in both connectors. (Data matrix D8)
9. No answer, error or log line holds another company's data, or any rows at all in logs. (Data matrix D9, Chapter 18's log tests)
10. A company's export holds only its rows, and its deletion leaves zero rows in every table. (`tenant:export`, `tenant:delete`)
11. Nothing is stored that no tool needs: no full account numbers, no routing numbers, no names from the sign-in database. (Task 4's check)
12. A schema change is a new migration that adds, tried on a pull request's own branch. (`db:migrate` refuses edited migrations)
13. Every copy kept on purpose has a rule in the database that keeps it in step with its source (19.5). For the embedding, that rule catches stale text, not a wrong model. Every other non-key column depends on the key alone.
14. The company is set in one place in each connector, from the request context only. No tool's input, header or model output can reach `set_config('app.tenant_id', ...)` (19.10). Row-level security cannot check this, so the review must.

## F8. How today's tools realize it, in detail

*The vendor facts behind 19.18, with where each was checked. Prices and limits change: check them again before you rely on them.*

- **Anthropic.** "Anthropic does not offer its own embedding model." Its embeddings page points to Voyage AI and says "you should assess a variety of embeddings vendors". Voyage's current text models are `voyage-4-large`, `voyage-4`, `voyage-4-lite` and `voyage-code-4`, 1,024 dimensions by default (256, 512 or 2,048 also). `voyage-4-lite` is $0.02 per million tokens, and the first 200 million tokens of the voyage-4 models are free per account (not for batch use).
- **OpenAI.** `text-embedding-3-small`, 1,536 dimensions by default, $0.02 per million tokens. `text-embedding-3-large`, 3,072. Both take a `dimensions` setting to shorten the vector. File search is "a tool available in the Responses API" that searches vector stores of files you upload. It is billed for storage and calls, on OpenAI's pricing page.
- **Open source.** Postgres (PostgreSQL License) and pgvector (PostgreSQL License) are open source. pgvector's current release is 0.8.7. bge-m3 is open weight, and so are Voyage's `voyage-4-nano` and Qwen's embedding models.
- **Neon, Hyperdrive and Workers AI:** F2, F3 and F4.
