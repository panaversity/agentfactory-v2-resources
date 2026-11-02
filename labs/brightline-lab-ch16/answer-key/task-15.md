# Lab 16 answer key: Task 15. Open the pull request

The answers for Task 15 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's files may differ from this key in wording and layout. Compare the results, and what each file does.

Your check's wording may differ. The authors' prints `3 skills, no problems`. Its eight tests pass, and `npm run test:py` reports 37 tests in the authors' copy. `npm run check:py` is clean. If Pyright cannot find `check_plugin`, add `extraPaths = ["../scripts"]` under `[tool.pyright]` in `py/pyproject.toml`.

The script does not compare the limit or the policy, because Task 5's sheet test does, and the `checks` job runs `npm test`.

Adding `disable-model-invocation: true` to `ap-triage` fails like this:

```text
FAIL ap-triage: fields outside the specification: ['disable-model-invocation']
3 skills, 1 problems
```

The schemas say more than a product does. A product reports an unknown top-level field in `plugin.json` and ignores it, but the schema is closed, so your check fails on it. That is what you want from a check that runs before anyone installs.

We ran `skills-ref validate` on all three skills, from the agentskills repository at commit `69ef37e`, and each printed `Valid skill`. We could not run the job on GitHub, so its step stays advisory until you see it pass there.

A real finding from the fresh reviewer has a file, a line and an input. If it found nothing, say so in the pull request. Its review does not replace yours, and an agent's approval never counts.

The job:

```yaml
  plugin-valid:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - uses: astral-sh/setup-uv@v6
      - run: npm ci
      - run: cd py && uv sync --locked
      # Agent Plugins 1.0.0 schemas (copied into schemas/), Agent Skills rules, manifests in step, changelog.
      - run: npm run check:plugin
      # A plugin change with no new version reaches nobody on a product that compares version strings.
      - name: The version moved
        run: bash scripts/check-version-moved.sh "origin/${{ github.base_ref }}"
      # The Agent Skills reference validator, from the standard's own repository, pinned to one commit.
      # SKILLS_REF_COMMIT is the commit you reviewed. Update it in its own pull request.
      # Advisory until the step has been seen to pass on GitHub: it reports, and check:plugin above blocks.
      - name: skills-ref validate
        continue-on-error: true
        env:
          SKILLS_REF_COMMIT: 69ef37e9424c0a7ea9dd2293b559e43ec8176379  # 2026-08-09
        run: |
          git clone --quiet https://github.com/agentskills/agentskills.git "$RUNNER_TEMP/agentskills"
          git -C "$RUNNER_TEMP/agentskills" checkout --quiet "$SKILLS_REF_COMMIT"
          uv tool install "$RUNNER_TEMP/agentskills/skills-ref"
          for d in plugin/skills/*/; do skills-ref validate "$d" || exit 1; done
```

On this first pull request, `scripts/check-version-moved.sh` passes, because the plugin is new on the branch. From the next change to `plugin/`, it fails until the version moves. It needs the base branch, which is why the job checks out with `fetch-depth: 0`.

`scripts/check-version-moved.sh`:

```bash
#!/usr/bin/env bash
# A plugin change with no new version reaches nobody on a product that compares version strings.
# Fails when plugin/ changed since the base branch and plugin.json's version did not.
# It fails closed: a base it cannot find is a failure, not a pass.
# Usage: check-version-moved.sh <base branch>
set -uo pipefail
base="${1:-}"
if [ -z "$base" ] || ! git rev-parse --verify --quiet "$base^{commit}" >/dev/null; then
  echo "Cannot find the base branch '${base}'. Failing, because a check that cannot see must not pass."
  exit 2
fi
if git diff --quiet "$base"...HEAD -- plugin; then
  echo "Nothing in plugin/ changed."
  exit 0
fi
if ! git cat-file -e "$base:plugin/plugin.json" 2>/dev/null; then
  echo "The plugin is new on this branch, so this is its first version."
  exit 0
fi
ver() { python3 -c 'import json,sys; print(json.load(sys.stdin).get("version",""))'; }
old=$(git show "$base:plugin/plugin.json" | ver)
new=$(ver < plugin/plugin.json)
if [ "$old" = "$new" ]; then
  echo "plugin/ changed, and its version is still $new."
  exit 1
fi
echo "The version moved from $old to $new."
```

The tiers the authors added to `REVIEW.md`: skills and the changelog are medium. The triage engines, the rules sheets, a skill's scripts, the manifests, connector files, catalogs, product settings and `schemas/` are high. `.github/CODEOWNERS` adds the same high-tier paths, including `/docs/ap-triage-rules.md` and `/plugin/skills/*/references/`. A path it does not list has no owner, so no owner review.

`scripts/check_plugin.py`:

```python
"""Check the plugin against the open standards before it can merge (the plugin-valid CI job).

1. plugin.json and mcp.json against the Agent Plugins 1.0.0 JSON Schemas in schemas/agent-plugins/1.0.0/,
   plus the rules the schemas cannot express (matching $schema versions).
2. Every skills/<name>/SKILL.md against the Agent Skills specification: only the six specification
   fields, name rules, name equals folder, description and compatibility lengths, metadata as strings.
   This is a local copy of those rules. CI also runs the reference validator, skills-ref.
3. Claude's own manifest (.claude-plugin/plugin.json) agrees with the core on name and version,
   and the changelog has an entry for that version.
4. A skill's metadata.version equals the manifest's, and a rules sheet in a skill's references/
   is the same as its copy in docs/, so no copy can move alone.

Usage: python check_plugin.py <plugin folder> <schemas folder>
Exit code 1 when anything fails, 2 when it cannot look.
"""

import json
import re
import sys
from pathlib import Path

import yaml
from jsonschema import Draft202012Validator

SPEC_FIELDS = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}
SKILL_NAME = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


def frontmatter(path: Path) -> dict[str, object]:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n", text.replace("\r\n", "\n"), re.S)
    if not match:
        raise ValueError("no YAML frontmatter")
    data = yaml.safe_load(match.group(1))
    if not isinstance(data, dict):
        raise ValueError("frontmatter is not a map")
    return data


def check_skill(folder: Path) -> list[str]:
    errors: list[str] = []
    try:
        fm = frontmatter(folder / "SKILL.md")
    except (OSError, ValueError, yaml.YAMLError) as e:
        return [f"{folder.name}: {e}"]
    extra = set(fm) - SPEC_FIELDS
    if extra:
        errors.append(f"{folder.name}: fields outside the specification: {sorted(extra)}")
    name = fm.get("name")
    if not isinstance(name, str) or not (1 <= len(name) <= 64) or not SKILL_NAME.match(name):
        errors.append(f"{folder.name}: name must be 1 to 64 lowercase letters, digits and single hyphens")
    elif name != folder.name:
        errors.append(f"{folder.name}: name '{name}' does not match the folder")
    desc = fm.get("description")
    if not isinstance(desc, str) or not (1 <= len(desc) <= 1024):
        errors.append(f"{folder.name}: description must be 1 to 1,024 characters")
    comp = fm.get("compatibility")
    if comp is not None and (not isinstance(comp, str) or not (1 <= len(comp) <= 500)):
        errors.append(f"{folder.name}: compatibility must be 1 to 500 characters")
    meta = fm.get("metadata")
    if meta is not None and (not isinstance(meta, dict) or not all(isinstance(k, str) and isinstance(v, str) for k, v in meta.items())):
        errors.append(f"{folder.name}: metadata must map strings to strings")
    lines = (folder / "SKILL.md").read_text(encoding="utf-8").count("\n")
    if lines >= 500:
        errors.append(f"{folder.name}: SKILL.md has {lines} lines, keep it under 500")
    return errors


def check_json(path: Path, schema: dict[str, object]) -> list[str]:
    try:
        doc = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        return [f"{path.name}: {e}"]
    return [f"{path.name}: {'/'.join(map(str, err.path)) or '(top)'}: {err.message}" for err in Draft202012Validator(schema).iter_errors(doc)]


def main(plugin: Path, schemas: Path) -> int:
    if not (plugin / "skills").is_dir() or not (schemas / "plugin.schema.json").is_file():
        print(f"Cannot find {plugin}/skills or {schemas}/plugin.schema.json")
        return 2
    plugin_schema = json.loads((schemas / "plugin.schema.json").read_text())
    mcp_schema = json.loads((schemas / "mcp.schema.json").read_text())
    errors = check_json(plugin / "plugin.json", plugin_schema)
    core = json.loads((plugin / "plugin.json").read_text())
    if (plugin / "mcp.json").exists():
        errors += check_json(plugin / "mcp.json", mcp_schema)
        mcp = json.loads((plugin / "mcp.json").read_text())
        if mcp.get("$schema", "").split("/")[-2:-1] != core.get("$schema", "").split("/")[-2:-1]:
            errors.append("mcp.json: $schema version must match plugin.json")
    skills = sorted(p for p in (plugin / "skills").iterdir() if p.is_dir())
    for folder in skills:
        errors += check_skill(folder)
    claude = plugin / ".claude-plugin" / "plugin.json"
    if claude.exists():
        own = json.loads(claude.read_text())
        for key in ("name", "version"):
            if own.get(key) != core.get(key):
                errors.append(f".claude-plugin/plugin.json: {key} '{own.get(key)}' differs from the core's '{core.get(key)}'")
    for folder in skills:
        try:
            meta = frontmatter(folder / "SKILL.md").get("metadata") or {}
        except (OSError, ValueError, yaml.YAMLError):
            continue  # check_skill has already reported it
        if isinstance(meta, dict) and "version" in meta and meta["version"] != core.get("version"):
            errors.append(f"{folder.name}: metadata.version '{meta['version']}' differs from the manifest's '{core.get('version')}'")
    for copy in sorted(plugin.glob("skills/*/references/*.md")):
        original = plugin.parent / "docs" / copy.name
        if original.exists() and original.read_bytes() != copy.read_bytes():
            errors.append(f"{copy.relative_to(plugin)} differs from docs/{copy.name}")
    changelog = plugin / "CHANGELOG.md"
    if not changelog.exists() or f"## {core.get('version')}" not in changelog.read_text():
        errors.append(f"CHANGELOG.md: no entry for version {core.get('version')}")
    for e in errors:
        print(f"FAIL {e}")
    print(f"{len(skills)} skills, {'no' if not errors else len(errors)} problems")
    return 1 if errors else 0


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(Path(sys.argv[1]), Path(sys.argv[2])))
```
