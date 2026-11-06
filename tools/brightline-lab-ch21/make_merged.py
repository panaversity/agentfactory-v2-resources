"""Write merged/: each file both Lab 20's end state and the editor-in-chief's Lab 21 change, made from both.

    python3 -I make_merged.py <Lab 20's end state brightline-ap (build_lab21.py base)>

His seven changed files are Lab 20's files with Lab 21's lines added (his LAB21-START-REQUIRES.md). Here
Lab 20's lines stay as they are, so every Lab 20 command keeps its meaning, and his Lab 21 lines are added
beside them in Lab 20's conventions:
  - package.json: his six scripts. Python runs through Lab 20's uv project (py/, Python 3.12 or later). His
    Python code reads prompts/, src/sdk/ and .secrets/ from the repository root, so `sdk:py` runs from there
    with `uv run --project py`; his tests move there themselves, so `test:sdk:py` runs from py/ as Lab 20's
    do. vitest picks up every tests/*.spec.ts, so `test:loop` names Lab 20's two files and stays Lab 20's 32
    tests, and `test:sdk` runs Lab 21's. His two SDK pins join Lab 20's dependencies (zod is Lab 20's).
  - py/pyproject.toml: his two Python pins, and his files kept out of the strict check, as Lab 20's loop is.
  - tsconfig.json: his TypeScript kept out of Lab 19's check; tsconfig.sdk.json checks it (typecheck:sdk).
  - .gitignore: out/, where flag_invoice writes. AGENTS.md and README.md: a Lab 21 section each.
His package-lock.json is made again by npm, and py/uv.lock by uv, from these.
"""
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
OURS = pathlib.Path(sys.argv[1])
OUT = HERE / "merged"


def put(rel: str, text: str) -> None:
    p = OUT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")


def once(text: str, old: str, new: str) -> str:
    assert text.count(old) == 1, old[:70]
    return text.replace(old, new)


# ---- package.json ----------------------------------------------------------------------------
pkg = json.loads((OURS / "package.json").read_text())
assert pkg["scripts"]["test:loop"] == "vitest run"
pkg["scripts"]["test:loop"] = "vitest run tests/loop.spec.ts tests/practice-connector.spec.ts"
uv = "cd py && uv run --locked"
pkg["scripts"].update({
    "sdk": "tsx scripts/sdk-ask.ts",
    "sdk:py": "uv run --locked --project py python -m brightline_ap.sdk_ask",
    "test:sdk": "vitest run tests/sdk.spec.ts",
    "test:sdk:py": f"{uv} pytest -q tests/test_sdk.py",
    "typecheck:sdk": "tsc -p tsconfig.sdk.json",
    "typecheck:sdk:py": f"{uv} pyright -p pyrightconfig.sdk.json",
})
deps = dict(pkg["dependencies"], **{"@anthropic-ai/claude-agent-sdk": "0.3.318", "@openai/agents": "0.21.0"})
assert deps["zod"] == "4.6.7"
pkg["dependencies"] = dict(sorted(deps.items()))
put("package.json", json.dumps(pkg, indent=2) + "\n")

# ---- py/pyproject.toml -----------------------------------------------------------------------
py = (OURS / "py" / "pyproject.toml").read_text()
py = once(py, '  "openai==3.46.0",\n]',
          '  "openai==3.46.0",\n  # The agent SDKs (Lab 21), pinned.\n  "claude-agent-sdk==0.2.178",\n  "openai-agents==0.24.0",\n]')
py = once(py, '# The agent loop\'s files (Lab 20) are checked in standard mode: npm run typecheck:py.\n',
          '# The agent loop\'s files (Lab 20) are checked in standard mode: npm run typecheck:py.\n'
          '# The agent SDKs\' files (Lab 21) are checked in standard mode: npm run typecheck:sdk:py.\n')
py = once(py, '"tests/test_loop.py"]', '"tests/test_loop.py", "brightline_ap/sdk", "brightline_ap/sdk_ask.py", "tests/test_sdk.py"]')
put("py/pyproject.toml", py)

# ---- tsconfig.json ---------------------------------------------------------------------------
ts = json.loads((OURS / "tsconfig.json").read_text())
ts["exclude"] += ["src/sdk", "scripts/sdk-ask.ts"]
put("tsconfig.json", json.dumps(ts, indent=2) + "\n")

# ---- .gitignore ------------------------------------------------------------------------------
gi = (OURS / ".gitignore").read_text()
put(".gitignore", gi.rstrip("\n") + "\n# Lab 21's flag_invoice writes out/flags.jsonl.\nout/\n")

# ---- AGENTS.md -------------------------------------------------------------------------------
ag = (OURS / "AGENTS.md").read_text().rstrip("\n")
put("AGENTS.md", ag + """

## The agent SDKs (Chapter 21)

- Ask before any call to a model API. In Lab 21, live calls go only through `npm run sdk` and `npm run sdk:py`, with a turn limit, and a cost cap on the first SDK. Never write a new script that calls a model API without asking.
- The person predicts first, in `ports/ch21.md`, as in Lab 20.
- Changes for experiments go on a throwaway branch, and the branch is deleted at the end of the task. Merge nothing until Task 15.
- Never set a permission mode that skips checks: no `bypassPermissions` and no `allowDangerouslySkipPermissions`.
- Never turn the first SDK's built-in tools on, except with `--built-ins` in Lab 21, Task 5.
- Keep the worker isolated: `settingSources: []`, `strictMcpConfig: true` and the short environment list in `src/sdk/claude-agent.ts` and its Python twin.
- Keep `store: false` on the second SDK, and tracing off unless the person passes `--trace` (Lab 21, Task 12).
- Never name a Python file `agents.py`: the second SDK is imported as `agents`.
- Pinned versions change only when the person asks, on a branch, with the offline tests run before and after.
- Run the checks before you say a change to the worker is done: `npm run typecheck:sdk`, `npm run typecheck:sdk:py`, `npm run test:sdk`, `npm run test:sdk:py`.
""")

# ---- README.md -------------------------------------------------------------------------------
rd = (OURS / "README.md").read_text().rstrip("\n")
put("README.md", rd + """

## The agent SDKs (Chapter 21)

The same AP worker on a tool runner and on two agent SDKs, in TypeScript and Python. Coding agents wrote it. Read the chapter's "Lab 21: getting ready" first, then `AGENTS.md`, then do Lab 21's Task 0. Lab 21 uses Lab 20's practice connector and data unchanged.

| Command | What it does |
| --- | --- |
| `npm ci`, then `cd py && uv sync --locked` | Install the pinned packages for both languages, the two agent SDKs included |
| `npm run typecheck:sdk`, `npm run typecheck:sdk:py` | Type-check the worker on the SDKs, in each language |
| `npm run test:sdk`, `npm run test:sdk:py` | Run the worker's offline tests: no model, no network, no key |
| `npm run sdk -- --sdk claude\\|openai\\|open\\|runner [--max-turns N] [--budget USD] [--persist] [--resume ID] [--built-ins] [--trace] "question"` | One question to the worker, printing one line per message, then a summary line. `npm run sdk:py` is the Python twin |

| Path | What |
| --- | --- |
| `src/sdk/`, `py/brightline_ap/sdk/` | The worker on a tool runner and on both agent SDKs, and its rules (`policy.ts`, `policy.py`) |
| `scripts/sdk-ask.ts`, `py/brightline_ap/sdk_ask.py` | `npm run sdk` and `npm run sdk:py` |
| `tests/sdk.spec.ts`, `py/tests/test_sdk.py` | The worker's offline tests |
| `prompts/ap-worker-sdk.v1.md` | The worker's instructions |
| `docs/worker-spec.md`, `docs/sdk-map.md`, `ports/ch21.md` | The worker's portable specification, the mapping table you fill in, and your record |
| `docs/chapter-21/` | The chapter, its lab page and its reference page, for your coding agents to read |
""")
print("merged:", sorted(str(p.relative_to(OUT)) for p in OUT.rglob("*") if p.is_file()))
