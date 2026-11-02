# Lab 18, Task 16: answer key

For you, after the task. Open it in a text editor, never in the agent. `answer-key/files/` in the zip holds the authors' finished files, at the same paths as in the repository at tag `ch18`.

Grace's token carries `ap:read` only. `find_vendor` gets `403` with `error="insufficient_scope", error_description="find_vendor needs ap:read ap:vendors.read. Your role in Brightline does not include it.", scope="ap:read ap:vendors.read"`. A second consent cannot fix it: the consent page grants only what her role allows. Copy Claude Code's own words into `ports/ch18.md`. Afterwards put the up-front scopes back, as in `answer-key/files/.mcp.json`, or Ana's `find_vendor` needs a step-up too.
