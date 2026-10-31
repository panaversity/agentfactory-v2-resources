---
id: E.code-toolchain
title: "Field guide: the code toolchain for Chapters 13 and 14"
chapters: ["13", "14"]
companion_sections: []
verified: 2026-10-30
next_review: 2026-11-30
owner: "<Part III owner>"
---

# The code toolchain: current practice

This field guide holds the exact steps for the tools Labs 13 and 14 need: Git, Node.js, uv and Python, and the packages the labs add. The chapters keep only what changes a decision. Steps change more often than ideas, so this guide is checked every month.

Install Git, Node.js and uv yourself, before Lab 13. The coding agent installs only the project's own packages, and only with your approval.

| | What it is | Version the labs need | Where it comes from |
| --- | --- | --- | --- |
| Git | Version control | Any recent version | git-scm.com |
| Node.js | Runs the TypeScript files directly | 24 or later. The current long-term support (LTS) release is 26 | nodejs.org |
| uv | Installs Python, creates the Python project, runs Python commands | Any 0.11 or later | docs.astral.sh/uv |
| Python | Runs the Python versions | 3.12 or later. uv can install it for you | Installed by uv |
| TypeScript, `@types/node` | The type checker | Added by Lab 13, Task 1, as dev dependencies | npm |
| pytest, Pyright, Ruff | Tests, type checker, linter for Python | Added by Lab 13, Task 1, as dev dependencies | PyPI, through uv |
| Zod, Pydantic, httpx | Schemas and the HTTP client | Added by Lab 14 | npm and PyPI |

## Check what you have

Open a terminal (Terminal on macOS, PowerShell or Git Bash on Windows, any terminal on Linux) and run:

```bash
git --version
node --version
uv --version
```

`node --version` must print `v24` or higher. If a command is not found, install that tool below.

## Node.js

**All systems.** Go to [nodejs.org/en/download](https://nodejs.org/en/download). Choose the LTS version, which was v26.13.0 on October 30, 2026, and your operating system. The page offers an installer and package-manager commands for each system. Version 24 also works, and it is in maintenance until April 30, 2028. Labs 13 and 14 need 24 or later.

**After installing,** close and reopen the terminal, then run `node --version` and `npm --version`.

**Notes.**

- Node runs `.ts` files directly by removing the types. It does not check them. Type stripping has been on by default since Node 23.6 and is marked stable from 24.12.
- Node does not run TypeScript features that generate code: `enum`, `namespace` with code inside, constructor parameter properties and import aliases. The labs' `tsconfig.json` sets `erasableSyntaxOnly`, so the type checker refuses them first.
- `using` and `await using` work from Node 24, which shipped V8 13.6 with explicit resource management. Older versions report a syntax error.

## uv and Python

**macOS and Linux:**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows (PowerShell):**

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**With a package manager:** `brew install uv` on macOS, or `winget install --id=astral-sh.uv -e` on Windows.

**Python.** You do not need to install Python first. uv downloads a suitable Python the first time a project needs one. To install it ahead of time, run `uv python install 3.12`. `uv python list` shows what is installed and available.

**Upgrading uv.** If you used the standalone installer, run `uv self update`. If you used a package manager, upgrade with that package manager.

**Notes.**

- The labs never run `uv init`. Recent versions of uv create a packaged `src/` layout and extra files that the labs do not use. Lab 13, Task 1 writes `py/pyproject.toml` by hand.
- Run uv commands from `py/`, where `pyproject.toml` is. The npm scripts `test:py` and `check:py` do this for you.
- `uv add` adds a package and updates `py/uv.lock`. `uv sync` installs exactly what the lock file says. Commit `uv.lock`.

## The packages the labs add

Lab 13, Task 1, in the repository folder:

```bash
npm install --save-dev typescript @types/node@24
cd py
uv add --dev pytest pyright ruff
```

Lab 14, Task 4 and Task 8:

```bash
npm install zod
cd py
uv add pydantic
uv add httpx
```

The versions installed on October 30, 2026 were TypeScript 7.0.2, `@types/node` 24.19, Zod 4.6.7, pytest 9.2.0, Pyright 1.1.414, Ruff 0.17.3, Pydantic 2.14.2 and httpx 0.28.1. The lock files record what you installed. `npm ci` and `uv sync` reinstall exactly that.

**TypeScript 7.** TypeScript 7.0, released in July 2026, is a faster rewrite of the compiler. The command is still `tsc`. It turns `strict` on by default and removes some old options, such as `baseUrl` and `moduleResolution: node`, which the labs do not use.

**Pyright in strict mode.** The labs set `typeCheckingMode = "strict"` under `[tool.pyright]` in `py/pyproject.toml`, to match TypeScript's `strict`. In its default mode, Pyright passes code that has no type labels at all.

**Pyright through uv.** The `pyright` package on PyPI is a community wrapper that downloads and runs the real Pyright, which needs Node. It runs from `uv run pyright` like any other tool.

## The labs' environment file

Lab 14 needs one secret, a made-up key for the sample API. Copy `.env.example` to `.env` and put any key you like in it. `.env` is in `.gitignore`.

- Node reads it with `node --env-file=.env`, which the npm scripts `api` and `fetch-ap` use.
- uv reads it with `uv run --env-file ../.env`, from `py/`.

## Windows notes

- Run the labs in PowerShell or Git Bash. The `TZ=...` time-zone check in Lab 13, Task 6 needs Git Bash or WSL.
- Python in a virtual environment is at `py\.venv\Scripts\python.exe`, not `py/.venv/bin/python`.
- `curl` comes with Windows 10 and later. In PowerShell, type `curl.exe` if `curl` behaves differently.
- Git may change line endings to Windows style when it checks out files. The labs' scripts and tests handle both.

## Troubleshooting

| Problem | What to try |
| --- | --- |
| `node --version` shows v22 or lower | Install Node 24 or later. Close and reopen the terminal afterwards |
| `tsc: command not found` | Run `npm install` in the repository. TypeScript is a dev dependency, not a global tool |
| `uv: command not found` after installing | Close and reopen the terminal, so it reads the new path |
| uv downloads Python on the first run | Normal when no Python 3.12 or later is installed |
| `pyright` takes a long time on its first run | The wrapper is downloading Pyright. Later runs are fast |
| A proxy or firewall blocks npm or PyPI | Ask your network administrator. The agent cannot fix it |
| `SyntaxError` on `await using` | Node is older than 24 |

## What changed

- 2026-10-30. First version, for Chapters 13 and 14.

## Sources

Accessed October 30, 2026.

- Node.js, [Download Node.js](https://nodejs.org/en/download) and [Previous releases](https://nodejs.org/en/about/previous-releases)
- Node.js, [Modules: TypeScript](https://nodejs.org/api/typescript.html)
- Node.js, [Release v24.0.0](https://nodejs.org/en/blog/release/v24.0.0)
- Astral, [Installing uv](https://docs.astral.sh/uv/getting-started/installation/) and [Installing Python](https://docs.astral.sh/uv/guides/install-python/)
- Astral, [uv projects](https://docs.astral.sh/uv/concepts/projects/init/)
- TypeScript, [TypeScript blog](https://devblogs.microsoft.com/typescript/)
- Microsoft, [Pyright installation](https://github.com/microsoft/pyright/blob/main/docs/installation.md)
