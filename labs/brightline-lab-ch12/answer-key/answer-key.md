# Lab 12 answer key

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

## Task 4: the blocked edit

With `"deny": ["Edit(/data/**)"]` in `.claude/settings.json`, Claude Code refuses to edit `data/vendors.csv`, and `git status` stays clean. The rule also blocks shell file commands Claude Code recognizes, such as `sed`. If the agent offers a script that opens the file itself, the right answer is no. The deny rule does not cover a script like that.

## Task 6: invoices due by Friday

An invoice is due by Friday when it is open (not paid) and its due date is on or before Friday, March 5, 2027. That includes invoices that are already late. When `due_date` is empty, the due date is `invoice_date` plus the days in `terms` ("Net 30" is 30 days, "Due on receipt" is 0 days).

| Due date | Invoice | Vendor | Amount |
| --- | --- | --- | --- |
| 2027-02-26 | INV-8304 | Scioto Office Products | $234.50 |
| 2027-03-01 | INV-8307 | Ohio Valley Electric | $2,411.33 |
| 2027-03-03 | INV-8301 | Midwest Packaging Co. | $4,825.00 |
| 2027-03-03 | INV-8302 | Buckeye Janitorial Supply | $618.75 |
| 2027-03-03 | INV-8314 | Lakefront Labels Inc. | $2,265.00 |
| 2027-03-04 | INV-8315 | Cardinal Forklift Service | $1,325.00 |
| 2027-03-05 | INV-8305 | Hocking Valley Pallets | $7,350.00 |
| 2027-03-05 | INV-8312 | Scioto Office Products | $199.95 |

**8 invoices, total $19,229.53.**

Your script may format amounts differently, for example `$7350.00` instead of `$7,350.00`, or order the columns another way. That is fine. Compare the invoice numbers, the count and the total.

## Common wrong answers

| If the agent's answer is | What went wrong |
| --- | --- |
| 6 invoices, $9,614.53 | It skipped the rows with an empty `due_date`. INV-8305 and INV-8314 are due, by their terms. This is the plan you should have caught in Task 5. |
| 10 invoices, $27,449.53 | It counted the two paid invoices, INV-8309 and INV-8313. |
| 6 invoices, $16,583.70 | It left out late invoices and kept only those due from today to Friday. "Due by Friday" includes late ones. |
| INV-8308 or INV-8310 included | It got the terms arithmetic wrong. INV-8308 is due March 6, and INV-8310 March 10. |
| INV-8303 included | It used the wrong cutoff. INV-8303 is due Saturday, March 6. |
| 1 invoice, $1,325.00, on Windows | The files have Windows line endings, and the script split lines on `\n` only. Every row but the last then ends in `open\r`, which is not `open`. Split on `\r?\n` and add a test with Windows line endings. |

## Task 7: the handover

After the undo, `git status` shows no changed files. If the agent created a new file during step 3, `git restore` leaves it, and you remove it yourself.

`NOTES.md` should say what the script does, how to run it, and the rule for an empty `due_date`. A new session that reads it should explain the script correctly without reading the code first.

## Task 8: the command and the headless run

`/due-by-friday 2027-03-05` reports 8 invoices and $19,229.53, and that the tests passed. The first headless run's JSON has a `structured_output` field like `{"passed": true, "tests": 5}`, with 5 or more tests: the 2 in the starter and at least one for each of the three rules. The number of tests depends on how many the agent wrote, at least one per rule. The second run, without `--allowedTools`, usually cannot run `npm test`, because a headless run has nobody to approve it. Its answer says so, and `structured_output` may be missing or say the tests could not run. If it did run the tests, something else allowed them, such as an allow rule for `npm test` in a settings file or a hook. Your notes should name what decided it.

## Task 9: split the work

The per-vendor totals for the cutoff 2027-03-05:

| Vendor | Total |
| --- | --- |
| Hocking Valley Pallets | $7,350.00 |
| Midwest Packaging Co. | $4,825.00 |
| Ohio Valley Electric | $2,411.33 |
| Lakefront Labels Inc. | $2,265.00 |
| Cardinal Forklift Service | $1,325.00 |
| Buckeye Janitorial Supply | $618.75 |
| Scioto Office Products | $434.45 |

They add up to $19,229.53. Scioto Office Products has two invoices, INV-8304 and INV-8312. If its total shows $234.50 or $199.95, the script kept only one invoice per vendor. The order of the rows can differ, as long as the totals match.

The side chat should say that nothing touched `data/`. The subagent's summary should list no rule breaks, or name a real one. The audit has no single right finding. What counts is that you read it and decided.

### Task 9, step 7: the optional mod

The band above the prompt shows the cutoff line. The mod's folder holds `.claude-plugin/plugin.json`, `hooks/hooks.json` and a hooks module such as `hooks/register.js`. The module should hook `ui.render` for the `AbovePrompt` site, and perhaps `session.start`. Its only calls should draw, such as `$.ui.resolve` or `$.ui.invalidate`. If you see `$.fs`, `$.process`, `$.http` or a `tool.check` hook, the mod does more than you asked. Say no, and ask Claude to remove it.

A mod like this could reach your files, your secrets and every prompt, and it could approve a tool call before you are asked, because mods are not sandboxed. That is why you read it first. We found nothing like mods in OpenAI's documentation. OpenCode's Desktop plugins can add panels.

## Tasks 10 and 11: the ports

There is no single right answer. Each port should reach 8 invoices and $19,229.53 from the same brief. Your `ports/ch12.md` should say, for each agent:

- whether it read `AGENTS.md`, and how you know
- how it enforced the `data/` rule. Claude Code: the deny rule in `.claude/settings.json`. Codex: only the words in `AGENTS.md` plus its sandbox, which allows writes anywhere inside the project, so in this lab `data/` is protected by the words alone. OpenCode: the `data/*` deny line in your `opencode.jsonc`, which refuses the edit tool there, plus the ask lines, which ask before every other edit
- how it split work: a subagent, a second session or a side chat, and what each cost you in time or clarity
- what it asked before acting, and what it did without asking
- whether its plan caught the empty `due_date` rule, or you had to add it
- whether its result matched this key
- anything you had to change in your brief or your settings, and why
