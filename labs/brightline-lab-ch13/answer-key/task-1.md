# Lab 13 answer key: Task 1. Set up the workbench

The answers for Task 1 of Lab 13, in Chapter 13 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

`git log --oneline` shows two commits, "Start from the end of Lab 12" and "Set up the workbench". The second holds `tsconfig.json`, `package.json`, `package-lock.json`, `py/pyproject.toml`, `py/uv.lock` and `.gitignore`.

## tsconfig.json

`tsconfig.json` should look like this. The options may come in another order. Task 4 adds `"exercises"` to `include`.

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "strict": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "types": ["node"],
    "skipLibCheck": true
  },
  "include": ["src", "tests", "scripts"]
}
```

## package.json

The three scripts from Lab 12 stay, and three new ones join them:

```json
"typecheck": "tsc --noEmit",
"test:py": "cd py && uv run pytest",
"check:py": "cd py && uv run pyright && uv run ruff check"
```

`devDependencies` lists `typescript` and `@types/node`, and nothing else. The version numbers are whatever npm found that day, such as TypeScript 7.0.2 and `@types/node` 24.19.2 on October 31, 2026. `@types/node` must be a version 24.

## py/pyproject.toml

`py/pyproject.toml` should hold these parts, in any order. The version numbers after `>=` are whatever uv found that day. Task 4 adds `"../exercises"` to Pyright's `include`.

```toml
[project]
name = "brightline-ap"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = []

[dependency-groups]
dev = [
    "pyright>=1.1.414",
    "pytest>=9.2.0",
    "ruff>=0.17.3",
]

[tool.pytest.ini_options]
testpaths = ["tests"]
pythonpath = ["."]

[tool.pyright]
typeCheckingMode = "strict"
include = ["brightline_ap", "tests"]
```

A `description` line or a `[tool.ruff]` section does no harm.

## .gitignore

The two lines it had already, `node_modules/` and `.DS_Store`, and the seven from the prompt: `node_modules/`, `py/.venv/`, `__pycache__/`, `.pytest_cache/`, `.ruff_cache/`, `.env` and `out/`. `node_modules/` needs to be there only once.

## The four commands

- `npm test`: 7 tests pass, 2 for the vendor list and 5 for due by Friday.
- `npm run typecheck` prints nothing after its own command line.
- `npm run test:py`: `2 passed`.
- `npm run check:py` prints `0 errors, 0 warnings, 0 informations`, then `All checks passed!`.

## If something else happened

| If you see | What went wrong |
| --- | --- |
| A sixth package in `devDependencies` or in the `dev` list | The agent added a package you did not ask for. Remove it. `py/uv.lock` and `package-lock.json` also list the packages those five need, such as `pluggy` and `undici-types`. That is normal |
| `py/main.py`, `py/README.md`, `py/.python-version`, or a `py/src/` folder | The agent ran `uv init`. Delete those from `py/` only, never the repository's own `src/`. Check that the project's name is `brightline-ap`, and keep the package in `py/brightline_ap/` |
| `package-lock.json` or `py/uv.lock` missing from the commit | Add it and commit again. Task 12's clean copy needs both |
