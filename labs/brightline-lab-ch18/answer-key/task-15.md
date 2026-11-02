# Lab 18, Task 15: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch18`.

OpenCode's page names loopback return addresses with the path `/callback`. The authors pre-registered `brightline-opencode` with `http://127.0.0.1/callback` and `http://localhost/callback` (any port), and set `"oauth": { "client_id", "scope", "redirect_uri": "http://127.0.0.1:8792/callback" }`: a `redirect_uri` turns the document route off and pins the port. Checked with the scripted sign-in, not with OpenCode.
