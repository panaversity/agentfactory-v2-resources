# Lab 16 answer key: Task 16. The day the limit changes

The answers for Task 16 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

## What moves

One invoice moves. INV-6004, for $5,000.01, is no longer over the limit, so it leaves the controller's pile and is ready to pay. INV-6011, for $12,500.00, stays.

| Pile | Count | Total |
| --- | --- | --- |
| Exception | 4 | $4,136.95 |
| Needs approval | 1 | $12,500.00 |
| Urgent | 2 | $2,321.42 |
| Ready | 6 | $17,698.01 |

The first thing to go red is the sheet test, with the plugin check, the moment the sheet changes.

## What went red, on our run

| After you change | Still red | What turned something green |
| --- | --- | --- |
| The sheet | The sheet test. `check:plugin`: `skills/invoice-triage/references/ap-triage-rules.md differs from docs/ap-triage-rules.md`, and the Python test that runs it | Nothing yet |
| Its copy | The sheet test. The version check: `plugin/ changed, and its version is still 0.1.0.` | The plugin check passes again |
| The tests | The sheet test, `rule 4: exactly $10,000.00 is not large`, the batch test, the two Python triage tests, `tests-unchanged` and the version check | Nothing. These tests now describe code that does not exist yet |
| The engine | The parity test, because the script still says $5,000.00. The Python tests, `tests-unchanged` and the version check | The sheet test, rule 4's test and the batch test |
| The skill's script | The Python tests, `tests-unchanged` and the version check | The parity test |
| The Python engine | `tests-unchanged` and the version check | The Python tests |
| The skill's labels | `check:plugin`: `invoice-triage: metadata.version '1.0.0' differs from the manifest's '0.1.0'`, with its Python test. `tests-unchanged` and the version check | Nothing yet |
| The manifests | `check:plugin`: `CHANGELOG.md: no entry for version 1.0.0`, with its Python test. `tests-unchanged` | The version check: `The version moved from 0.1.0 to 1.0.0.` |
| The changelog | `tests-unchanged` only | The plugin check |

`tests-unchanged` stays red by design. Editing a test that holds a rule should cost something. With `ALLOW_TEST_CHANGES=true`, it prints `Existing test lines changed, allowed by the tests-changed label:` and the lines. On GitHub, the label also needs a reason and the code owner.

A good reason says who decided what: "Rule 4's limit moves to more than $10,000.00, under AP policy v4, approved by Dave Kowalski. These tests hold the old limit, so they change with it."

Your order of failures may differ if your files differ. What matters is that no check passed while the copies disagreed.

The whole change touched 12 files, with the changelog entry and the test cases in `evals/README.md`. That is the price of a rule held in several copies. Every test passes at the end.

## Why it is a major version

The third row of the table says something you rely on changed. The same invoice now lands in a different pile. A patch number would promise that nothing changed.

## The two copies

```text
Triage for run date 2027-03-08, brightline-ap 0.1.0, AP policy v3
13 invoices: 4 exception, 2 needs approval, 2 urgent, 5 ready
```

```text
Triage for run date 2027-03-08, brightline-ap 1.0.0, AP policy v4
13 invoices: 4 exception, 1 needs approval, 2 urgent, 6 ready
```

The clerk's copy still runs, with no error, because it cannot know. INV-6004 is on Dave's pile in the old report and ready to pay in the new one, and the first line says why. Had the limit gone down, the old copy would have called an invoice ready that needs him. Only a control where the money moves stops that, and Chapter 23 builds it.

## Why the version has to move

We tried this on Claude Code 2.1.316, from a catalog in a Git repository. We pushed the changed rule with no new version:

```text
brightline-ap is already at the latest version (0.1.0).
```

The installed script kept the old limit. With the new version:

```text
Plugin "brightline-ap" updated from 0.1.0 to 1.0.0 for scope user. Restart to apply changes.
```

If you try this yourself, wait a minute and run the update again if it still reports the old version. An update seconds after an earlier refresh still reported 0.1.0 on our run, and the new version arrived 40 seconds later.

A local catalog or `--plugin-dir` works differently. It loads your current files at every session start, whatever the version says, so `git pull` is the update there.
