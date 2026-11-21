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

## The CCDV-F v1.1 update (Part III, Labs 12 to 30)

The update of Part III's labs to Anthropic's Developer Foundations exam guide, version 1.1, is planned in the book repository, in `specs/v2plan/ccdv-f-v1.1/`. Read, in order:

1. `specs/v2plan/ccdv-f-v1.1/README.md`
2. `specs/v2plan/ccdv-f-v1.1/3-lab-changes.md`: items D1 to D9, the outlines of the new Labs 24 to 30, and each new lab's port task to OpenAI and open source
3. `specs/v2plan/ccdv-f-v1.1/items.yaml`: the task list. Lab items have `repo: book and labs`.

Two things to know before you start:

- **Folder numbers.** Labs 21 to 23 live in `labs/brightline-lab-ch20/` to `labs/brightline-lab-ch22/`, one lower than the book, and their files still say the old number. Do not rename them: the published key links use these names. The new Labs 24 to 30 use the book's number, `labs/brightline-lab-ch24/` to `labs/brightline-lab-ch30/`.
- **Part III's labs have no numbered checks.** Each task has a goal, a prediction, a prompt and "What good looks like", with one answer key per task. A task added between two tasks takes a letter, such as Task 11a, so nothing is renumbered and `tools/renumber-checks.py` is not needed.

## The CCDV-P v1.0 update (Part IV, Labs 31 to 38)

The Developer Professional exam, guide version 1.0, gets a rebuilt Part IV with eight new labs, planned in the book repository in `specs/v2plan/ccdv-p-v1.0/` (its items D1 to D8). It starts only after the CCDV-F work is merged. Each lab ports one task to OpenAI. Only Labs 31 and 38 also port to open source.

## Tools

| Tool | What it does |
| --- | --- |
| `tools/renumber-checks.py` | Moves a lab's later check numbers and totals up, to make room for a new check. Pass `--total`, the lab's total today, and `--book-page`, the book's lab page. Run it with `--dry-run` first. It lists any prose that names a check number, for you to fix by hand |
| `tools/brightline-lab-ch<NN>/` | Code that makes a lab's input files and checks the keys' figures. Run it again after you change a file it makes |
