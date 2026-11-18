# AGENTS.md: the labs repository

This repository holds the lab files for *The AI Agent Factory*, Second Edition. Learners download each lab as a zip from the latest release. `README.md` is for them. This file is for agents and maintainers.

## Before you change a lab

- **The book repository decides.** Each lab's page lives in the book, `panaversity/agentfactory-v2`, under `knowledge/`. `LAB.md` here is a copy of it, made by the book's make-lab skill. Change the book's page first, then copy it again.
- **Brightline's facts** live in the book repository, in `specs/labs/part-2-facts.md`. Add a new person, file or figure there before you use it here.
- **Work on a new branch, and leave your changes uncommitted** for a person to review.

## The CCAO-F v1.1 update

The update of Labs 1 to 11 to Anthropic's exam guide version 1.1 is planned in the book repository, in `specs/v2plan/ccao-f-v1.1/`. Clone both repositories side by side, then read, in order:

1. `specs/v2plan/ccao-f-v1.1/README.md`
2. `specs/v2plan/ccao-f-v1.1/3-lab-changes.md`: items D1 to D11, with the text for each lab's question file, answer keys and input files, the new check numbers, and the order of work
3. `specs/v2plan/ccao-f-v1.1/items.yaml`: the task list. Lab items have `repo: book and labs`.

## Tools

| Tool | What it does |
| --- | --- |
| `tools/renumber-checks.py` | Moves a lab's later check numbers and totals up, to make room for a new check. Run it with `--dry-run` first. It lists any prose that names a check number, for you to fix by hand |
| `tools/brightline-lab-<NN>/` | Code that makes a lab's input files and checks the keys' figures. Run it again after you change a file it makes |

When `main` changes, a GitHub Action zips each lab folder, without its answer keys, into a new release. Each key is published as its own file:

```text
https://github.com/panaversity/agentfactory-v2-resources/releases/latest/download/brightline-lab-<NN>-key-task-<N>.md
```
