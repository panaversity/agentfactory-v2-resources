# Lab 19, Task 5: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw.** The new tests are committed before any code changes, and fail. The test that needs two companies' calls on one connection is the 200-pairs test: only interleaved calls can reuse a connection between companies.

Every changed Chapter 18 test was shown to you before it was committed: Cedar Ridge's no-data message becomes its own answers, and Juniper Trail, which has no data, takes the no-data test.

**Compare with** `answer-key/files/servers/ap-ts/test/connector.test.ts`, `answer-key/files/servers/ap-ts/test/tenant.test.ts`, `answer-key/files/servers/ap-ts/test/helpers.ts`.
