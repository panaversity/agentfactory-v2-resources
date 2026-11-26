# Lab 20, Task 13: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at the end of Lab 20. The authors ran every local step on November 26, 2026, on macOS: Node 24.18, Python 3.12 with uv, Postgres 17 with pgvector and the test embedder, `@modelcontextprotocol/ext-apps` 2.0.4, and the MCP code libraries 2.4.0 for TypeScript and 2.3.0 for Python.

**Not built or run by the authors.** Check your run against the task's "What good looks like".

Two facts help. A person's access token works until it runs out, which is 10 minutes at most on the lab's sign-in server (`scripts/tenant-member.ts` says so), so the time you record should be close to that. And a new pass is refused at once, because disabling Luis at the identity provider stops it from vouching for him.

Your prediction: until the token he already holds runs out.
