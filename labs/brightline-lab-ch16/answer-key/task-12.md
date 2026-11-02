# Lab 16 answer key: Task 12. Repeatable checks

The answers for Task 12 of Lab 16, in Chapter 16 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's files may differ from this key in wording and layout. Compare the results, and what each file does.

Keep the cases at the repository root, not in `plugin/`, so they do not ship to every user.

For March 8, 4 exception, 2 needs approval, 2 urgent, 5 ready.

For March 11 (`npm run triage -- data/invoices-intake.csv 2027-03-11`), the window moves to March 14. INV-6007 (due March 13) and INV-6009 (due March 12) become urgent, so the last line is:

```text
13 invoices: 4 exception, 2 needs approval, 4 urgent, 3 ready
```

A missing run date should produce a question. If the agent assumes today's date, the skill's second step is not doing its job.

The fourth case checks the report's first line: `AP triage, run date 2027-03-08, batch invoices-intake.csv, brightline-ap 0.1.0, AP policy v3`. The tool prints the version and the policy, and the report copies them. If either is missing, the skill is not copying what the tool printed.

`evals/README.md`:

```markdown
# Test cases for the brightline-ap plugin

Run before every release, twice each, in a new session with the plugin loaded. Every expected number comes from `npm run triage`, not from the agent.

| Case | Request | A good answer |
| --- | --- | --- |
| 1 | Triage data/invoices-intake.csv for run date 2027-03-08 | Exception 4, needs approval 2, urgent 2, ready 5, with the exceptions' reasons and who acts |
| 2 | Triage data/invoices-intake.csv for run date 2027-03-11 | Exception 4, needs approval 2, urgent 4, ready 3 |
| 3 | Triage data/invoices-intake.csv (no date) | A question asking for the run date. No counts |
| 4 | /brightline-ap:ap-triage data/invoices-intake.csv 2027-03-08 | The first line names the run date and the batch, then brightline-ap 0.1.0 and AP policy v3, copied from what the tool printed |
```

`claude plugin eval` is optional here. It needs Claude Code 2.1.269 or later, and git, and it runs from the plugin's own folder. Its runs count toward your plan or API bill.
