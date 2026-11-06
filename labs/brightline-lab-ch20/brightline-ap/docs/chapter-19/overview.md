From *The AI Agent Factory*, Chapter 19, for the coding agents working in this repository. The chapter itself is the source.

## The point

**In Chapter 18, the connector learned who is calling, and for which company.** Every request carries a sign-in token that names one person and one company, and the connector refuses everyone else. But Brightline's business data still sits in files shipped with the code. Cedar Ridge Supply, the second customer, still gets "No AP data is connected for Cedar Ridge Supply yet."

**In this chapter the data moves into a database, and the database itself keeps each company's rows apart.** Even a tool that forgets its company filter cannot hand Cedar Ridge one of Brightline's invoices, because the database refuses to show it. Then the policy search changes too: it finds rules by meaning, not by shared words. It cites the rule or says plainly that the policies do not answer the question.

*Figure 19.1. Before, every copy carries the data. After, one database serves every copy, and it decides which company's rows each request may see.*

**Store each fact once, with the company in every key. Let the database refuse another company's rows, with the company set for one transaction only. Search policies by meaning, cite what you found, and say so when you found nothing.**

After this chapter you can:

- **Read a database design** and say what each table, column and rule is for, and why every key includes the company.
- **Explain third normal form in detail:** find the facts stored in the wrong place. Say which copies an AI system keeps on purpose, and what keeps each copy true.
- **Explain row-level security:** how the database refuses other companies' rows, which roles skip it, and why the connector's role must not.
- **Explain why the company is set for one transaction only,** and what goes wrong on a shared connection when it is not.
- **Name the gaps** that row-level security does not close, and the rule that closes each.
- **Bring a company's data in, export it and delete it,** and prove nothing of it is left.
- **Explain retrieval:** passages, embeddings, vectors, similarity search and an index, and why a search that finds nothing close enough should abstain.
- **Measure retrieval** with a question set, so a change that makes it worse fails the build.

**Who does what.** This chapter is a co-build. The builder (you) directs the coding agents and decides how the database works. Each company's AP expert decides what its data means: which columns a purchase order must hold and which policy documents count. The expert also decides what a citation looks like, and when "I found nothing" is the right answer. In the lab you play both roles. Managers can read this overview and Concepts 19.1, 19.2, 19.7, 19.11 and 19.15.

**The principle is portable Postgres and pgvector. The reference implementation is Neon.** Postgres, a free, open-source database, holds the business records. An add-on for it, pgvector, holds the embeddings used to search by meaning, in the same tables and under the same rules. So no separate vector database is needed. Both run on many hosts, so the design never depends on one provider. Neon, a service that runs Postgres for you, is the reference host the lab uses. You meet it only in the lab, the field guide and 19.18. That page says why Neon was chosen and what a move to another host takes. Whatever the host, keeping companies apart correctly is the application's job, and most of this chapter is how to do it.

*Figure 19.2. The rules are portable. The host is a choice, and the rules move with you.*

## Words this chapter uses

Twelve words carry the chapter, after the basic database words that 19.2 teaches from zero (table, row, column, primary key, foreign key, SQL, query). Each keeps one meaning, and the table says where a word has a second one. The words of Chapters 17 and 18 keep their meaning: **tenant**, membership, sign-in token, **request context**, scope, handle, copies and environments. A tenant is one customer company whose people and data must be kept apart, and stories call it "company". The request context is the locked order slip the token check writes (18.11).

| Word | Meaning |
| --- | --- |
| Business database | The database that holds Brightline's AP data: vendors, invoices, purchase orders, policies. It is separate from Chapter 18's sign-in database, on purpose (19.1) |
| Postgres | The database server this chapter uses, also called PostgreSQL. A program that holds tables, answers SQL, and enforces rules on every row |
| Schema | The design of a database: its tables, their columns, and the rules each row must follow (19.4). Postgres also uses the word for a named folder of tables inside one database (19.7). The text says which |
| Normal form | A rule for laying out tables so that each fact is stored in one place. Third normal form, or 3NF, is the one this book uses (19.5) |
| Migration | A numbered file that changes the schema, applied once, in order, and never edited after it runs (19.6) |
| Role | A name the database knows, with its own password and its own rights. Not Chapter 18's role inside a company (`owner`, `member`). Database roles are written like `ap_reader` |
| Row-level security | A database feature that shows and accepts only the rows a rule allows, for every query (19.8) |
| Policy | One such rule on one table, such as "only rows whose `tenant_id` is the current company". Elsewhere, "policy" also means Brightline's written AP policies. The text always says which |
| Transaction | A group of statements (one statement is one SQL command, such as one `SELECT`) that succeed or fail together, ended by a **commit** (keep the changes) or a **rollback** (undo them) (19.9) |
| Passage | One short piece of a policy document, such as one rule, stored as one row with its document and line number (19.13) |
| Embedding | A list of numbers a model makes from a piece of text, so that texts with similar meaning get similar numbers. Stored in a column of type vector (19.13) |
| Abstain | What the policy search does when no passage is close enough: it says so, instead of offering the closest wrong passage (19.15) |

## What you will build

**Where you are.** At the end of Chapter 18, people sign in, and the connector knows which person and which company is asking. A sign-in matrix tries every route one company might use to act as another. Three things were still missing:

- **Cedar Ridge Supply has no data.** It exists in the sign-in server with its people, but every tool answers "No AP data is connected for Cedar Ridge Supply yet."
- **The data ships inside the code.** Changing one invoice means a new deploy, and a second company's files would sit inside every copy beside Brightline's.
- **The policy search matches words, not meaning.** When Luis asks "do we need a PO for a $400 repair?", it cannot tell that his "PO" is the "purchase order" in Cedar Ridge's rule.

**What you build instead.** As in Chapters 17 and 18, you do not type code. Coding agents write every file and run every command, and you specify, read and approve.

1. **A data contract,** written with each company's AP expert: what every table and column means, each company's own rules, and what is never stored.
2. **A business database,** with tables in third normal form, the company in every key, two roles made with SQL, and row-level security forced on every table.
3. **Each company's data loaded,** checked and provable: Brightline's, Cedar Ridge's with its own lower approval threshold, and a trial company's, exported and then deleted.
4. **Both connectors on the database,** each tool call one transaction with the company set for that transaction only.
5. **A data matrix,** 25 checks that try every route from one company's rows to another's, and six planted bugs. At least one check must catch each bug.
6. **Policy search by meaning,** with citations and abstention, and a question set that measures it.

Then the database goes online in staging, and optionally production, with a fresh copy of the database for every pull request.

*Figure 19.3. Two databases now: the sign-in database from the last chapter, and a business database the connector reads, one company per transaction.*

## Why it matters

This story is invented, but each failure in it is common. A payroll software company in Columbus, Ohio, served about sixty small firms from one database. Every query in its code ended with `WHERE firm_id = ?` (a filter: only this firm's rows), and for two years nothing went wrong.

Then a developer added a report of "employees with expiring certifications". The query worked, the tests passed, and it shipped on a Friday. It had no `firm_id` filter. On Monday, an office manager at one firm opened the report and saw 412 employees. Her firm had 19.

Three design choices made it possible. The only guard was a line every developer had to remember in every query. The database itself had no idea which firm was asking. And no test ever asked "can one firm's request see another firm's rows?" for every table. This chapter fixes all three. The database refuses other companies' rows by itself (19.8). The company reaches the database for one transaction, from the token and nowhere else (19.9). And the data matrix asks that question of every table, on every build (19.12).

*Figure 19.4. Three fixes, three places: the database, the connector and the tests.*

## How the plugin grows

| Chapter | What it adds to the plugin |
| --- | --- |
| 16 | Skills, a command and a ready-made connector |
| 17 | Brightline's own connector: four read-only tools, written by coding agents, and put online with a shared key |
| 18 | Real sign-in. Each person signs in and picks a company, and the connector knows who may act for which company |
| 19 | The business data in a database, each company's rows kept apart by the database itself, each company's own rules, and policy search by meaning with citations |
| 20 | An agent that runs on a server inside a web page Brightline's staff already use, holding each person's tokens for them |

The plugin's files do not change in this chapter. The connector's address stays the same, and its four tools keep their names. Two tools answer differently: `get_purchase_order` now says whether an invoice needs approval under the company's own threshold, and `search_policy` searches by meaning and can abstain.

## In this chapter

This chapter teaches three public, open things. The first is SQL, the language for asking a relational database questions (19.2). The second is Postgres, the database server, with its row-level security. The third is pgvector, the Postgres add-on for searching by meaning. Concepts 19.1 to 19.17 teach them and name no other product, except the three coding agents in the At work stories. 19.18 shows how today's products realize them.

**No background needed.** You need no earlier knowledge of databases. Concept 19.2 starts from zero: tables, rows, columns, keys and SQL. Concept 19.3 teaches you to read SQL the way Chapters 13 and 14 taught you to read TypeScript and Python: predict, then run. Concept 19.13 does the same for embeddings and vector search. Postgres, pgvector and Neon are each explained before they are used.

**You read SQL. You never write it.** Every piece of SQL in this chapter is short, has its meaning in plain words beside it, and is the kind a coding agent wrote in the lab. Lines that start with `--` are notes for people, and the database skips them.

**The essential path.** Read this overview, Concepts 19.1 to 19.17 and field guide sections F0 to F4. Read any other section when the lab sends you there, then do the lab's core tasks. 19.18 and F5 are reference.

**Part A. A database for the business.**

- 19.1 Why a database now
- 19.2 Tables, rows and keys, from zero
- 19.3 Reading SQL: predict, then run
- 19.4 Designing the AP tables
- 19.5 Third normal form in detail: keep it, break it on purpose
- 19.6 Changing the tables safely

**Part B. Keeping each company's data apart.** The heart of the chapter. Chapter 18 did this for sign-in: who may act for which company. This part does it for the data: whose rows are whose.

- 19.7 Three ways to keep data apart
- 19.8 Row-level security
- 19.9 One company per transaction
- 19.10 Where the guarantee stops
- 19.11 Each company's own rules and data
- 19.12 Proving the data stays apart

**Part C. Answers from documents, with citations.**

- 19.13 Retrieval from zero
- 19.14 Embeddings and pgvector in depth: predict, then run
- 19.15 Answers that cite, or abstain
- 19.16 Measuring retrieval

**Part D. Running it.**

- 19.17 A database behind a stateless server
- 19.18 How today's tools realize it (reference, skim it)

Then: the field guide (F0 to F8), Lab 19 and Check yourself.

**Five sittings.** The lab takes about 10 hours 25 minutes in five sittings, or 10 hours 50 minutes with the optional Task 11b. The sittings cover a database for the business, the connector on the database, proving the data stays apart, answers from documents, and branches and deploying. The core path, without the extensions, takes about 10 hours 5 minutes. Task 11, the code review, is part of the core path.
