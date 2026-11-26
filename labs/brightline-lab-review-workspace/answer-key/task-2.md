# Lab 20b, Task 2: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository on branch `review-app`. The authors ran every local step on November 26, 2026, with the sign-in server in Cloudflare's local runtime, as its own tests run it.

**What the authors changed.** The sign-in server makes tokens for four addresses now: the AP connector's two, and the workspace's two, `http://127.0.0.1:8757/mcp` (TypeScript) and `http://127.0.0.1:8758/mcp` (Python, Task 4), each its own audience. Two scopes, `review:read` and `review:write`. `owner`, `admin` and `member` may hold both. `auditor` may hold `review:read` only. The AP scopes did not change. A workspace token also carries the person's name, for "saved by" (Task 3). A token for the AP connector does not.

**The claims, without the tokens.** Luis's workspace token: `aud` `http://127.0.0.1:8757/mcp`, `tenant` `org_cedar`, `name` `Luis Moreno`, `scope` `review:read review:write`. Marco's: the same audience, `scope` `review:read` only, even when the app asks for `review:write`. Luis's AP token: `aud` `http://127.0.0.1:8717/mcp`, `scope` `ap:read ap:vendors.read`, and no `name`.

**The app Claude uses.** `brightline-claude`, which Lab 20's Task 3 registered, was linked only to the two AP addresses. The prompt's last step runs Lab 20's Task 3 `client:add` command again. It keeps the app, with its own settings, and links it to the new addresses too:

```text
npm run client:add -- --env staging --client-id brightline-claude --name "Claude (lab)" --redirect https://claude.ai/api/mcp/auth_callback
```

On this computer, the same command with `--env local`. It prints `client ID: brightline-claude (registered already: kept, and linked to every connector)` and the four addresses. Before this change, the sign-in server answered a second `client:add` for the same app with `409 client brightline-claude exists`, and linked nothing. Before it, a sign-in for the workspace's address with that app gets no token. After it, Luis's token comes back with the workspace's audience and his name. Task 5 needs this.

**The tests.** `servers/auth/test/review.test.ts`, five tests, all passing, run by `npm run test:auth` with the rest: `33 tests, 33 passed`. They start the sign-in server with the workspace's addresses through `test/review-harness.ts`, so Lab 18's test files stay unchanged. The pull request check `tests-unchanged` fails if any existing test file changes.

**Compare with** `answer-key/files/servers/auth/src/tenancy.ts`, `answer-key/files/servers/auth/src/auth.ts`, `answer-key/files/servers/auth/src/admin.ts`, `answer-key/files/servers/auth/src/pages.ts`, `answer-key/files/servers/auth/wrangler.jsonc`, `answer-key/files/scripts/client-add.ts`, `answer-key/files/servers/auth/test/review.test.ts`, `answer-key/files/servers/auth/test/review-harness.ts`.
