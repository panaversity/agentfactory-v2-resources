# Lab 19, Task 11: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw.** No fixed answer: each reviewer answers every item of F7's checklist, with the file and line it checked. Item 7 (caching off) says "not checked", because it can only be checked online, in Task 16. Item 14 must find one place that sets the company in each connector (`forTenant` in `servers/ap-ts/src/db.ts`, and its twin in `py/brightline_ap/db.py`), called only with the company from the request context.

A finding you fixed or answered is a pass. A finding left open before Sitting 4 is not.
