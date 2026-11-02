# Lab 16 answer key: Task 9. A ready-made connector

The answers for Task 9 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's files may differ from this key in wording and layout. Compare the results, and what each file does.

`plugin/mcp.json`:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "apdata": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem@2.1.0", "./data"]
    }
  }
}
```

`plugin/.mcp.json`:

```json
{
  "mcpServers": {
    "apdata": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem@2.1.0", "${user_config.data_folder}"]
    }
  }
}
```

Claude's manifest gains the option:

`plugin/.claude-plugin/plugin.json`:

```json
{
  "name": "brightline-ap",
  "version": "0.1.0",
  "description": "Brightline Wholesale Supply's accounts payable skills: invoice triage, the Monday triage report and the Friday due list, with a read-only connector to the AP data folder.",
  "author": {
    "name": "Brightline builders and Ana Morales, AP analyst"
  },
  "license": "UNLICENSED",
  "keywords": [
    "accounts-payable",
    "invoices",
    "triage",
    "training"
  ],
  "userConfig": {
    "data_folder": {
      "type": "directory",
      "title": "AP data folder",
      "description": "The folder with vendors.csv and invoices.csv. The connector can read only this folder.",
      "required": true,
      "default": "./data"
    }
  }
}
```

`.claude/settings.json`:

```json
{
  "permissions": {
    "deny": [
      "Edit(/data/**)",
      "mcp__plugin_brightline-ap_apdata__write_file",
      "mcp__plugin_brightline-ap_apdata__edit_file",
      "mcp__plugin_brightline-ap_apdata__create_directory",
      "mcp__plugin_brightline-ap_apdata__move_file"
    ],
    "ask": [
      "Bash(git push *)"
    ]
  }
}
```

We ran the pinned server, version 2.1.0, on Node 24. It offers 14 tools. Four of them write: `write_file`, `edit_file`, `create_directory` and `move_file`.

On Claude Code 2.1.316, with the session started at the repository's root:

- `./data` counts from the session's folder, so the connector reports one allowed folder, your repository's `data/`.
- It lists six files there: `invoices-check.csv`, `invoices-intake.csv`, `invoices-messy.csv`, `invoices-no-terms.csv`, `invoices.csv` and `vendors.csv`.
- The agent could not write. It said the connector has only read tools, and it would not write to `data/` another way, because `AGENTS.md` forbids it. A deny rule that names a tool removes it from what the agent sees, so you get "no such tool", not a refusal.
- Asked to list the connector's tools, the agent gives ten, none of them a write tool. `/mcp` still shows all fourteen, because it lists what the server offers.
- With the deny rules taken out, the agent still refused, on `AGENTS.md` alone. So the refusal proves nothing. The list of ten does.

Started from a subfolder, the connector fails, because `src/data` does not exist. Nothing asks for the folder in a `--plugin-dir` session, so the default applies.

The core's `plugin/mcp.json` also says `./data`, but under the standard a local server with no `cwd` starts in the plugin's root, where no `data` folder exists, and a `cwd` may not leave that root. Claude Code does not read this file. Task 18 meets this on the one host in this lab that does.
