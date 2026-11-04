# Lab 19 files

These files go with Lab 19 of The AI Agent Factory: Brightline's data in a database.

- `brightline-ap/` is the repository at the end of Lab 18, with no git history, plus the lab's starting files: Cedar Ridge's data (`data-cedar/`), a trial company's (`data-juniper/`), each company's settings (`settings.csv`), the list of policy documents that count (`manifest.csv` in each policy folder), the third normal form exercise (`exercises/3nf/`), and `docs/chapter-19/`, the chapter's concepts and field guide as text files for coding agents. Task 0 starts its git history.
- `concept-blocks/sql/` holds the fourteen SQL blocks of 19.3, 19.14 and field guide F1 and F4, with `run.mjs`, which runs each block as the role it names, with one company set, inside a transaction it always rolls back. Tasks 4b and 12b run them.
- `lab-files/questions.csv` holds the twelve questions Ana and Luis wrote for the question set, which Task 14 copies.
- `LAB.md` is a copy of the lab steps.
- `answer-key/` holds the authors' data contract, the third normal form refactor and its proofs, what each task should show, and `files/`, the authors' finished files, at the same paths as in the repository at tag `ch19`. Never give it to an agent.
- Each task's answer key is a separate download, linked from the task in `LAB.md`. Open a key in a text editor only, never in the agent.

Today in the lab is Monday, March 29, 2027. The people and companies are invented. Every password and key is made on your own computer by `npm run keys` and `npm run db:passwords`, or by you, in the Neon and Cloudflare dashboards.

You need Node.js 22.19 or later, uv 0.11.32 or later, git, `psql` 16 or later, a GitHub account with `gh`, and a coding agent (the lab uses Claude Code, Codex and OpenCode). You also need a free Neon account, and, for real embeddings and staging, a free Cloudflare account.
