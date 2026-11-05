"""Write merged/: each file both Lab 19's end state and the editor-in-chief's lab20-start have, made from both.

    python3 -I make_merged.py <labs/brightline-lab-ch20/brightline-ap at the base commit> <his lab20-start checkout>

Rules: Lab 19's lines stay as they are, so every Lab 19 command keeps its meaning; his are added beside them.
Where both name the same command, his gets a name of its own: `npm test` and `npm run test:py` stay Lab 19's
(its Python tests need a database), and the loop's tests are `npm run test:loop` and `npm run test:loop:py`.
`npm run typecheck` checks his TypeScript with Lab 19's, and `npm run typecheck:py` is his loop's Python check.
His Python packages join Lab 19's uv project; its Node floor, 22.19, holds for both.
"""
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
OURS, HIS = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
OUT = HERE / "merged"


def put(rel, text):
    p = OUT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")


# ---- package.json ----------------------------------------------------------------------------
ours = json.loads((OURS / "package.json").read_text())
his = json.loads((HIS / "package.json").read_text())
renamed = {"test": "test:loop", "test:py": "test:loop:py"}
uv = "cd py && uv run --locked"
his_scripts = {
    "test": "vitest run",
    "test:py": f"{uv} pytest -q tests/test_loop.py",
    "typecheck:py": f"{uv} pyright -p pyrightconfig.loop.json",
    "ask": his["scripts"]["ask"],
    "ask:py": f"{uv} python -m brightline_ap.ask",
    "connector:practice": f"{uv} python -m brightline_ap.practice_connector",
    "break": his["scripts"]["break"],
    "break:py": f"{uv} python -m brightline_ap.experiments break",
    "stateful": his["scripts"]["stateful"],
    "stateful:py": f"{uv} python -m brightline_ap.experiments stateful",
    "stream:demo": his["scripts"]["stream:demo"],
}
assert set(his["scripts"]) == set(his_scripts) | {"typecheck"}, set(his["scripts"]) ^ set(his_scripts)
assert his["scripts"]["typecheck"] in ("tsc -p .",) and ours["scripts"]["typecheck"] == "tsc --noEmit"
for name, cmd in his_scripts.items():
    name = renamed.get(name, name)
    assert name not in ours["scripts"], name
    ours["scripts"][name] = cmd
# One typecheck for both: Lab 19's settings for its files, and tsconfig.loop.json for the loop (below).
ours["scripts"]["typecheck"] = "tsc --noEmit && tsc -p tsconfig.loop.json"
# Route A's test token (Lab 20, Task 0), Chapter 22's command name, made with Chapter 18's scripted
# sign-in on staging: scripts/token-test.ts, kept in merged/ because it is ours, not the package's.
assert "token:test" not in ours["scripts"]
ours["scripts"]["token:test"] = "node scripts/token-test.ts --env staging"
ours.setdefault("dependencies", {})
for k, v in his["dependencies"].items():
    assert k not in ours["dependencies"], k
    ours["dependencies"][k] = v
for k, v in his["devDependencies"].items():
    if k in ours["devDependencies"]:
        continue  # typescript 5.9.3 is the same; @types/node stays Lab 19's 22.18.13, for its Node floor
    ours["devDependencies"][k] = v
ours["dependencies"] = dict(sorted(ours["dependencies"].items()))
ours["devDependencies"] = dict(sorted(ours["devDependencies"].items()))
assert ours["engines"] == {"node": ">=22.19"}
put("package.json", json.dumps(ours, indent=2) + "\n")

# ---- vitest.config.ts: the loop's tests only ---------------------------------------------------
put("vitest.config.ts", '''import { defineConfig } from "vitest/config";

// The loop's tests only (Lab 20). Lab 19's tests run under node --test (npm test), and the
// connector's under its own workspace (npm run test:servers).
export default defineConfig({
  test: { include: ["tests/*.spec.ts"] },
});
''')

# ---- py/pyproject.toml and the loop's own pyright settings --------------------------------------
pp = (OURS / "py/pyproject.toml").read_text()
old = '  "httpx==0.28.1",\n]'
assert pp.count(old) == 1
pp = pp.replace(old, '  "httpx==0.28.1",\n  # The agent loop (Lab 20): the two model APIs\' SDKs, pinned.\n  "anthropic==2.5.0",\n  "openai==3.46.0",\n]')
old = 'include = ["brightline_ap", "tests"]\n'
assert pp.count(old) == 1
loop_files = ["brightline_ap/loop", "brightline_ap/ask.py", "brightline_ap/experiments.py",
              "brightline_ap/practice_connector.py", "tests/test_loop.py"]
pp = pp.replace(old, old + "# The agent loop's files (Lab 20) are checked in standard mode: npm run typecheck:py.\n"
                + "exclude = [" + ", ".join(f'"{f}"' for f in loop_files) + "]\n")
put("py/pyproject.toml", pp)
put("py/pyrightconfig.loop.json", json.dumps({
    "include": loop_files,
    "typeCheckingMode": "standard",
    "venvPath": ".",
    "venv": ".venv",
}, indent=2) + "\n")

# ---- .gitignore ---------------------------------------------------------------------------------
gi = (OURS / ".gitignore").read_text()
put(".gitignore", gi.rstrip("\n") + "\n# The agent loop's trace (npm run ask -- --trace). Task 10 keeps a copy in ports/.\ntrace.jsonl\n")

# ---- .claude/settings.json ----------------------------------------------------------------------
cs = json.loads((OURS / ".claude/settings.json").read_text())
hs = json.loads((HIS / ".claude/settings.json").read_text())
for kind in ("deny", "ask"):
    for rule in hs["permissions"][kind]:
        if rule not in cs["permissions"][kind]:
            cs["permissions"][kind].append(rule)
put(".claude/settings.json", json.dumps(cs, indent=2) + "\n")

# ---- .codex/config.toml -------------------------------------------------------------------------
cx = (OURS / ".codex/config.toml").read_text()
put(".codex/config.toml", '''# The agent loop (Lab 20): Codex asks before a command that leaves the folder or needs the network,
# such as npm run ask. Codex's settings cannot deny reading a path in the folder, so for .secrets/ the
# rule in AGENTS.md is the guard.
approval_policy = "on-request"
sandbox_mode = "workspace-write"

''' + cx)

# ---- opencode.jsonc: his rules, in OpenCode 2's format ------------------------------------------
oc = (OURS / "opencode.jsonc").read_text()
anchor = '    { "action": "apts_*", "resource": "*", "effect": "allow" },'
assert oc.count(anchor) == 1
oc = oc.replace(anchor, '''    // The agent loop (Lab 20): OpenCode's read tool may not open .secrets/, and live model calls always ask
    { "action": "read", "resource": ".secrets/*", "effect": "deny" },
    { "action": "shell", "resource": "cat .secrets*", "effect": "deny" },
    { "action": "shell", "resource": "npm run ask*", "effect": "ask" },
    { "action": "shell", "resource": "npm run break*", "effect": "ask" },
    { "action": "shell", "resource": "npm run stateful*", "effect": "ask" },
    { "action": "shell", "resource": "npm run stream:demo*", "effect": "ask" },
''' + anchor)
put("opencode.jsonc", oc)

# ---- tsconfig.json and tsconfig.loop.json ------------------------------------------------------
# Lab 19's files run under Node's own type stripping, so its tsconfig allows only erasable syntax.
# The loop runs under tsx and vitest, which compile it, and its limits.ts uses parameter properties
# (quoted in Lab 20, Task 8), so the loop's files have their own config, Lab 19's with that one rule off.
LOOP_TS = ["src/loop", "scripts/ask.ts", "scripts/break.ts", "scripts/stateful.ts", "scripts/stream-demo.ts", "tests/*.spec.ts"]
tc = json.loads((OURS / "tsconfig.json").read_text())
assert "exclude" not in tc
tc["exclude"] = LOOP_TS
put("tsconfig.json", json.dumps(tc, indent=2) + "\n")
put("tsconfig.loop.json", json.dumps({
    "extends": "./tsconfig.json",
    "compilerOptions": {"erasableSyntaxOnly": False},
    "include": LOOP_TS,
    "exclude": [],
}, indent=2) + "\n")

# ---- AGENTS.md: Lab 19's, then his rules for the loop -------------------------------------------
ag = (OURS / "AGENTS.md").read_text().rstrip("\n")
put("AGENTS.md", ag + '''

## The agent loop (Chapter 20)

- Never print, read aloud, copy or open anything in `.secrets/`. Scripts read those files themselves. If a step needs a key or token, the person puts it there with their own editor.
- Ask before any call to a model API. Live calls go only through `npm run ask`, `npm run ask:py`, `npm run break`, `npm run break:py`, `npm run stateful`, `npm run stateful:py` and `npm run stream:demo`. Each has a cost cap or is a single small call. Never write a new script that calls a model API without asking.
- The person predicts first. When a task says to stop before a result, stop, and wait until the person says they have written their prediction in `ports/ch20.md`.
- Explain on request, quoting the line. When asked about a line, quote it and explain it in one or two sentences, for a reader who knows Chapters 13 and 14.
- Changes for experiments go on a throwaway branch, and the branch is deleted at the end of the task. Merge nothing until Task 13.
- Never add `temperature`, `top_p` or `top_k` to any request outside `scripts/break.ts` and `py/brightline_ap/experiments.py`, and never force a tool choice outside them.
- Run the loop's four checks before you say a change to it is done: `npm run typecheck`, `npm run typecheck:py`, `npm run test:loop`, `npm run test:loop:py`.
- Never read `../answer-key/`.
''')

# ---- README.md: Lab 19's, then the loop's commands ----------------------------------------------
rd = (OURS / "README.md").read_text().rstrip("\n")
put("README.md", rd + '''

## The agent loop (Chapter 20)

The AP worker's loop with nothing hidden, on two model APIs, in TypeScript and Python. Coding agents wrote it. Read `AGENTS.md`, then do Lab 20's Task 0: install, run the offline tests, put your keys in `.secrets/`, fill in the prices in `src/loop/config.json`, and choose a connector.

| Command | What it does |
| --- | --- |
| `npm ci`, then `cd py && uv sync --locked` | Install the pinned packages for both languages |
| `npm run typecheck`, `npm run typecheck:py` | Type-check the TypeScript, and the loop's Python |
| `npm run test:loop`, `npm run test:loop:py` | Run the loop's tests. They replay recorded responses: no network, no key, no cost |
| `npm run connector:practice` | Start the local practice connector on 127.0.0.1:8760. It reads its token from `.secrets/connector.env`. `PRACTICE_BROKEN=search_policy` makes that tool answer "try again" |
| `npm run ask -- --api claude\\|openai\\|open [--trace] [--quiet] [--cache] [--max-turns N] "question"` | One question through the loop, printing every request and response. `npm run ask:py` is the Python twin |
| `npm run break -- temperature\\|forced-tool\\|cut-signature\\|bad-key` | Break one rule on purpose against the live API, and print the error. `npm run break:py` is the Python twin |
| `npm run stateful -- "question"` | The second API's loop, stateful, for comparison. `npm run stateful:py` is the Python twin |
| `npm run stream:demo -- "question"` | One streamed turn, event by event |

| Path | What |
| --- | --- |
| `tools/ap-tools.json` | The connector's four tools, once, in JSON Schema |
| `prompts/ap-worker.v1.md` | The worker's instructions |
| `src/loop/config.json` | Pinned models, prices (you fill these in), limits |
| `src/loop/claude.ts`, `openai.ts` | The loop on each API (TypeScript) |
| `py/brightline_ap/loop/claude_loop.py`, `openai_loop.py` | The loop on each API (Python) |
| `tests/fixtures/loop/` | Recorded responses, illustrative, not from a live run |
''')
print("merged/ written:", sorted(p.relative_to(OUT).as_posix() for p in OUT.rglob("*") if p.is_file()))
