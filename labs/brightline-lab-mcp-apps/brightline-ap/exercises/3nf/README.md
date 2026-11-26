# Exercise: third normal form (Lab 19, Task 3b)

`docs_flat.sql` makes a table someone built in a hurry, in its own schema, `exercise`, so it never touches
the AP tables. Every passage row carries copies of facts that belong somewhere else.

1. **You, by reading, before any change:** list every transitive dependency in `exercise.docs_flat` as
   `key -> column -> column`, and say where each fact belongs (19.5). Look inside `metadata` too.
2. **Then Claude Code:** refactors it to third normal form in the same schema, keeps `tenant_id` and the
   embedding on the passage row with the two guards from 19.5, adds the HNSW index, and turns on and forces
   row-level security with a reader policy on every new table. Then it proves three things with queries.

The answer key is in `answer-key/` at the top of the lab zip. Never give it to an agent.
