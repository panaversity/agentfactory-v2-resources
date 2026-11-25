# AGENTS.md: the labs repository

This repository holds the lab files for *The AI Agent Factory*, Second Edition. Learners download each lab as a zip from the latest release. `README.md` is for them. This file is for agents and maintainers.

## Before you change a lab

- **The book decides.** Each lab's page lives in the book's repository. `LAB.md` here is a copy of it, made by the book's make-lab skill. Change the book's page first, then copy it again.
- **Brightline's facts** are decided in the book's repository. Add a new person, file or figure there before you use it here.
- **Work on a new branch, and open a pull request.** A person merges it.
- **Merging publishes.** When `main` changes, a GitHub Action zips each lab folder, without its answer keys, into a new release. Each key is published as its own file. So run each changed task once on Claude before the pull request is marked ready.

A key's link is always:

```text
https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-ch<NN>-key-task-<N>.md
```

Renaming a key changes what that link serves. Merge the book's pull request right after this repository's, so the page and the keys agree.

## Tools

| Tool | What it does |
| --- | --- |
| `tools/renumber-checks.py` | Moves a lab's later check numbers and totals up, to make room for a new check. Pass `--total`, the lab's total today, and `--book-page`, the book's lab page. Run it with `--dry-run` first. It lists any prose that names a check number, for you to fix by hand |
| `tools/brightline-lab-ch<NN>/` | Code that makes a lab's input files and checks the keys' figures. Run it again after you change a file it makes |
