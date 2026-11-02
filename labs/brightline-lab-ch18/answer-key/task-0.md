# Lab 18, Task 0: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch18`.

At `lab18-start`: `npm test` 4, `test:servers` 11, `typecheck` passed, `pyright` 0 errors, `pytest` 15 passed, `check:plugin` "1 skills, no problems", `conformance` "78 checks passed, 0 failed". `npm run keys` prints only `wrote …` lines: `servers/ap-ts/.dev.vars`, `servers/ap-py/.dev.vars`, `servers/auth/.dev.vars`, `.secrets/admin.local.env`, `.secrets/test-signing.local.env`. The last command prints nothing. At this point the connector still expects Chapter 17's shared key, and `npm run keys` no longer makes it, so starting the connector by hand answers 503 until Task 6. No task asks you to.
