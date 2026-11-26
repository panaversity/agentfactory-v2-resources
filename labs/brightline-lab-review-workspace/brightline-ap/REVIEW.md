# Review rules

Every change reaches `main` through a pull request with the template filled in and every required check green.

## Risk tiers

- **Low:** documentation, notes, comments.
- **Medium:** skills, the changelog, test data that tests do not read.
- **High:** code that runs (`src/`, `py/brightline_ap/`, `servers/`, `scripts/`), manifests, connector files, host configuration (`.mcp.json`, `.codex/`, `opencode.jsonc`), catalogs, settings, CI.

## Connectors (Chapter 17)

For any server under `servers/` or `py/brightline_ap/`, check the specification's server rules: every input validated, every request authenticated, `Origin` checked, only the fields the caller needs returned (bank accounts as the last four digits), and nothing held between requests (no module-level variable that changes after start-up).

High-tier changes need the code owner's approval and a reviewer who has not seen the build.

## Always check

- No test changed to make code pass.
- No key, token or full account number in any file.
- Every number a person acts on comes from tested code.
