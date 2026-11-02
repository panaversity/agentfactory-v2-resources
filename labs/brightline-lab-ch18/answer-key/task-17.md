# Lab 18, Task 17: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch18`.

Plugin 0.3.0. `answer-key/files/plugin/.mcp.json` names the address and the pre-registered client, with no `headers`. `answer-key/files/plugin/mcp.json` (the Agent Plugins core) carries `"type": "streamable-http"` and the `url` only: its schema allows no `oauth` field, and needs none, since an app finds sign-in from the 401. `check:plugin`: "1 skills, no problems". `git grep AP_MCP_TOKEN` prints only two lines from `docs/chapter-18/F0.md`, the chapter's own text (`git grep AP_MCP_TOKEN -- ':!docs/chapter-18'` prints nothing).
