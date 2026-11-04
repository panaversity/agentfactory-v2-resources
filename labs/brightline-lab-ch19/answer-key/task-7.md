# Lab 19, Task 7: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch19`. The authors ran every local step on November 2, 2026, on Postgres 16.15 with pgvector 0.6.0 and the test embedder.

**What the authors saw.** 48 Python tests pass, and Pyright strict reports 0 errors. `npm run conformance` reports `0 failed`, with both servers giving the same answers.

**Compare with** `answer-key/files/py/brightline_ap/db.py`, `answer-key/files/py/brightline_ap/embeddings.py`, `answer-key/files/py/brightline_ap/connector.py`, `answer-key/files/py/tests/test_connector.py`.
