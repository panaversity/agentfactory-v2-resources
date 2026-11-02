# Change briefs

One short brief per change that moves money, touches data, or changes a rule. Name it after the change: `changes/weekend-rule.md`.

A typo fix needs only a one-line pull request description. Scale the brief to what could go wrong.

| Part | What it records |
| --- | --- |
| Intent | The outcome, what is out of scope, acceptance criteria, open decisions and who decides them |
| Investigation | How the behavior was reproduced, confirmed findings, guesses still unproven, what else the change touches |
| Evidence | Each claim, where its expected result came from, the command that checked it, the result, and the commit it ran on |
| Review | Findings, how each was resolved, what was not tested, what is still uncertain |
| Delivery | What merging does and does not do, who accepts it, how to undo it |

Never paste a key or private data into a brief. Link to the pull request's checks instead of copying logs.
