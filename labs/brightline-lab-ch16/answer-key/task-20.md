# Lab 16 answer key: Task 20. OpenCode builds its setup, and the tag

The answers for Task 20 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's files may differ from this key in wording and layout. Compare the results, and what each file does.

`opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  // The shared skills, read in place. Never copy them.
  "skills": ["./plugin/skills"],
  "mcp": {
    "servers": {
      "apdata": {
        "type": "local",
        "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem@2.1.0", "./data"],
        "cwd": "."
      }
    }
  },
  // Last matching rule wins.
  "permissions": [
    { "action": "edit", "resource": "data/**", "effect": "deny" },
    { "action": "shell", "resource": "*", "effect": "ask" },
    { "action": "skill", "resource": "*", "effect": "ask" },
    { "action": "apdata_*", "resource": "*", "effect": "allow" },
    { "action": "apdata_write_file", "resource": "*", "effect": "deny" },
    { "action": "apdata_edit_file", "resource": "*", "effect": "deny" },
    { "action": "apdata_create_directory", "resource": "*", "effect": "deny" },
    { "action": "apdata_move_file", "resource": "*", "effect": "deny" }
  ]
}
```

OpenCode reads the shared skills through the `skills` list, and asks before loading one. The last matching rule wins, so `allow` for `apdata_*` comes before the four denies.

**What we ran.** OpenCode 2.2.5, from `@opencode/cli`, with a local stand-in in place of a model, so no real model answered:

| What we asked for | What came back |
| --- | --- |
| The three skills | Found in `plugin/skills/`, read in place |
| `apdata_list_allowed_directories` | The repository's root, not `data/` |
| Reading `README.md` through the connector | It worked |
| Reading outside the repository | `Access denied - path outside allowed directories` |
| `apdata_write_file`, `apdata_create_directory` | No such tool. The deny rules hide them, and 10 tools are left |
| The built-in `write` to `data/x.txt` | `Permission denied: edit` |
| The triage, with the skill and the command allowed | `13 invoices: 4 exception, 2 needs approval, 2 urgent, 5 ready` |

The server's own log says why the folder differs: `Updated allowed directories from MCP roots: 1 valid directories`. OpenCode sends its project folder as a root, and the server's README says roots replace the folders on the command line. We found no setting that stops this. So on OpenCode, the connector can read every file in the repository, including any `.env`. Write that in your port notes. It is what 16.7's "test on every surface" is for.

The interactive prompt for loading a skill is the one thing we could not see.

A template for your port notes:

`ports/ch16.md`:

```markdown
# Port notes, Chapter 16: one set of skills, three bundles, six places

Fill in one row per place, from your own runs. Record three outcomes for each place, and keep them separate:

- **Loaded:** the product lists the three skills.
- **Ran:** the skill ran its tool or script, and say how it got the data (the connector or attached files). If it could not run the script, write "could not" and why.
- **Verified:** the triage counts for `data/invoices-intake.csv` on 2027-03-08 are 4, 2, 2 and 5.

A place where the skills loaded but did not run, or ran but gave other counts, is a partial port. Write it down as one. If you skipped a place, write "skipped" and why.

| Place | Built with | Bundle it read | Loaded | Ran | Verified: counts (exception, approval, urgent, ready) | How a new version reaches it | What had to change |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Claude Code | Claude Code | `.claude-plugin/plugin.json`, `.mcp.json` | | | | | |
| Claude chat | Claude Code | Same, installed on claude.ai | | | | | |
| Cowork | Claude Code | Same, installed on claude.ai | | | | | |
| Codex | Codex | `plugin.json`, `mcp.json` (Agent Plugins core) | | | | | |
| ChatGPT | Codex | Same, through the marketplace | | | | | |
| OpenCode | OpenCode | `opencode.jsonc` entries | | | | | |
```

At `ch16` from a clean clone, the authors' copy passes 57 TypeScript and 37 Python tests. Your counts will differ, because your agent wrote its own tests. Both type checks and Ruff are clean, and `npm run check:plugin` prints `3 skills, no problems`. `npm run due -- 2027-03-05` prints 8 invoices, $19,229.53, and `npm run due -- 2027-03-12` prints 13 invoices, $43,833.63. The triage's last line is:

```text
13 invoices: 4 exception, 2 needs approval, 2 urgent, 5 ready
```

The first line names `brightline-ap 0.1.0` and `AP policy v3`.

If you keep the plugin installed anywhere, keep its write tools blocked or denied there.
