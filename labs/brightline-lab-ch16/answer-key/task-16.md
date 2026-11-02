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

The first things to go red are the sheet test's four checks and the plugin check, the moment the sheet changes.

## What went red, on our run

| After you change | Still red | What turned something green |
| --- | --- | --- |
| The sheet | The sheet test's three limit checks and its policy check. `check:plugin`: `skills/invoice-triage/references/ap-triage-rules.md differs from docs/ap-triage-rules.md`, and the Python test that runs it | Nothing yet |
| Its copy | The same four sheet checks. The version check: `plugin/ changed, and its version is still 0.1.0.` | The plugin check passes again |
| The tests | The same four sheet checks, `rule 4: exactly $10,000.00 is not large`, the batch test, the two Python triage tests, `tests-unchanged` and the version check | Nothing. These tests now describe code that does not exist yet |
| The engine | The parity test, because the script still says $5,000.00. The sheet's checks on the script, the Python engine and the policy. The two Python triage tests, `tests-unchanged` and the version check | The sheet's check on `src/triage.ts`, rule 4's test and the batch test |
| The skill's script | The sheet's checks on the Python engine and the policy. The two Python triage tests, `tests-unchanged` and the version check | The parity test, and the sheet's check on the script |
| The Python engine | The sheet's policy check: `the sheet says AP policy v4, and the skill says brightline-ap 0.1.0, AP policy v3`. `tests-unchanged` and the version check | The sheet's check on the Python engine, and the two Python triage tests |
| The skill's labels | `check:plugin`: `invoice-triage: metadata.version '1.0.0' differs from the manifest's '0.1.0'`, with its Python test. `tests-unchanged` and the version check | The sheet's policy check. Every TypeScript test now passes |
| The manifests | `check:plugin`: `CHANGELOG.md: no entry for version 1.0.0`, with its Python test. `tests-unchanged` | The version check: `The version moved from 0.1.0 to 1.0.0.` |
| The changelog | `tests-unchanged` only | The plugin check |

`tests-unchanged` stays red by design. Editing a test that holds a rule should cost something. With `ALLOW_TEST_CHANGES=true`, it prints `Existing test lines changed, allowed by the tests-changed label:` and the lines. On GitHub, the label also needs a reason and the code owner.

A good reason says who decided what: "Rule 4's limit moves to more than $10,000.00, under AP policy v4, approved by Dave Kowalski. These tests hold the old limit, so they change with it."

Your test names and messages may differ, because your agent wrote your sheet test. What matters is that no copy moved with every check still green. If one did, your sheet test does not hold that copy.

The steps touched 11 files, with the changelog entry. In a real release, the test cases in `evals/README.md` would be a twelfth, because they name the old counts and the old version. That is the price of a rule held in several copies. At the end, every test passes, and so does `tests-unchanged` with the label's setting.

## Why you chose 1.0.0

The version check asks only that the version moves, so it would pass 0.1.1 as well. A person chooses the number. The third row of the table says something you rely on changed, and the same invoice now lands in a different pile. A patch number would promise that nothing you rely on changed.

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
