# Lab 16 answer key: Task 18. Codex builds the OpenAI plugin

The answers for Task 18 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's files may differ from this key in wording and layout. Compare the results, and what each file does.

`.agents/plugins/marketplace.json`:

```json
{
  "name": "brightline-openai",
  "plugins": [
    {
      "name": "brightline-ap",
      "source": { "source": "local", "path": "./plugin" },
      "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
      "category": "Productivity"
    }
  ]
}
```

`.codex/config.toml`:

```toml
# Codex reads this file only when you trust the project.
[plugins."brightline-ap@brightline-openai"]
enabled = true

# The plugin cannot make its own connector read-only. This setting does.
[plugins."brightline-ap@brightline-openai".mcp_servers.apdata]
disabled_tools = ["write_file", "edit_file", "create_directory", "move_file"]

# Codex starts a plugin's connector inside its own cached copy of the plugin, where ./data
# names no folder. A project server with the same name starts here, at the repository's root.
[mcp_servers.apdata]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem@2.1.0", "./data"]
disabled_tools = ["write_file", "edit_file", "create_directory", "move_file"]
```

`git diff --stat main` lists only those two files, plus `extensions` in `plugin.json` if Codex added any. If it did, `plugin/` changed, so the version check from Task 15 asks for a new version. Ask it to take that out. The distinct catalog name keeps it apart from Claude's `brightline`. If both catalog files are in the folder, Codex uses `.agents/plugins/marketplace.json`.

**What we ran.** Codex 0.166.0 from the command line, on a throwaway home folder, with no model and no sign-in. So we saw the catalog, the config and the connector start, and no answer from a model:

- `codex plugin marketplace add ./` added `brightline-openai`. With both catalog files in the folder, it used `.agents/plugins/marketplace.json`.
- `codex plugin list` still said `not installed`, and no skill loaded, until `codex plugin add brightline-ap@brightline-openai`.
- The skills then showed as `brightline-ap:invoice-triage`, `brightline-ap:ap-triage` and `brightline-ap:due-by-friday`. `$brightline-ap:invoice-triage` brought the skill into the request, and a bare `$invoice-triage` did not.
- Codex copied the installed plugin to its own cache and started the plugin's connector there. With `./data`, `../data` or `${PLUGIN_ROOT}/../data`, the server stopped, because that folder does not exist in the cache. A `cwd` of its own did not help. Only a full path worked, and a full path cannot be committed.
- With `[mcp_servers.apdata]` in `.codex/config.toml`, the server started at the repository's root. It reported one allowed folder, `data/`, and offered 10 tools, with the four write tools gone.

The counts should be 4, 2, 2 and 5, from the tool's output. If Codex gives other numbers, it did not run the tool.

The app needs a restart to see a new catalog. We did not open the Codex view in the ChatGPT desktop app, so a menu may differ from these commands.
