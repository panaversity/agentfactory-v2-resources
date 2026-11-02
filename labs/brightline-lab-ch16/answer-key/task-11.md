# Lab 16 answer key: Task 11. Version and catalog

The answers for Task 11 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's files may differ from this key in wording and layout. Compare the results, and what each file does.

`plugin/CHANGELOG.md`:

```markdown
# Changelog

All notable changes to the brightline-ap plugin. Versions follow Semantic Versioning: a new major number breaks something users rely on, a new minor number adds something, a new patch number fixes something.

## 0.1.0 - 2027-03-08

### Added
- `invoice-triage` skill, with Ana's rules in `references/` and a standard-library script in `scripts/`, checked against the tested engine in CI.
- `ap-triage` skill: the Monday triage report, started by name with a file and a run date.
- `due-by-friday` skill, moved from `.claude/skills/` into the plugin.
- `apdata` connector: `@modelcontextprotocol/server-filesystem` pinned at 2.1.0, limited to the data folder. Its write tools are denied in each host's settings, not in the plugin.
- Agent Plugins 1.0.0 core (`plugin.json`, `mcp.json`) and Claude's own manifest and connector file beside it.
```

`.claude-plugin/marketplace.json`:

```json
{
  "name": "brightline",
  "owner": {
    "name": "Brightline builders"
  },
  "plugins": [
    {
      "name": "brightline-ap",
      "source": "./plugin",
      "description": "Brightline AP skills and a read-only data connector"
    }
  ]
}
```

The entry has no `version`, because `plugin.json` holds it. Anthropic says not to set it in both, and a second copy of the number is one more thing to move.

On Claude Code 2.1.316, from the clone's root:

```text
$ claude plugin marketplace add ./
✔ Successfully added marketplace: brightline (declared in user settings)
$ claude plugin install brightline-ap@brightline --scope local
✔ Successfully installed plugin: brightline-ap@brightline (scope: local)
1 userConfig option not yet set (1 required) — run /plugin configure brightline-ap@brightline in Claude Code, or pass --config KEY=VALUE.
```

The second line is not a failure. The option's default, `./data`, applies, and the connector still starts. `claude plugin details brightline-ap` prints a projected cost of about 320 tokens added to every session.

A new session in the clone has the plugin, with the same counts: 4, 2, 2 and 5. If `npm run triage` cannot find a package, the clone has no packages yet, so run `npm ci` there.

The lab uses local scope, so the plugin exists only in that clone, where `.claude/settings.json` denies the connector's write tools. A user-scope install would follow you to every project on the computer, including ones with no deny rules, which is why the lab avoids it. `claude plugin uninstall` looks at user scope unless you say otherwise, so it needs `--scope local` here.
