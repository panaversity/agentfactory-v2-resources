# Lab 14 answer key: Task 12. Hand over and tag

The answers for Task 12 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

## `ports/ch14.md`

For each agent you used, there is no single right answer. Say whether it could reach the API on `localhost`, what it asked before installing or running anything, whether it tried to change a test, and what its review found.

**The next change.** The file ends with this change, in your own words:

> Make the Friday list read its invoices through the loader, test first.

**Why it comes first.** `src/due-by-friday.ts` still turns each row into a record with `invoiceFromRow`, which converts the amount with `Number` and checks nothing. So a blank amount in next week's export would reach Friday's payment list as $0.00, with no warning, and the run would still report success. The loader you built in Task 5 refuses that row, but it protects only the code that reads through it. A good first test: a blank amount in the invoice file makes the Friday list stop with the loader's report, never list the invoice at $0.00.

A note that names a different next change misses the point of Task 5, unless it also says why the Friday list can wait.

## The tag

`git tag` lists `ch14`, on `main`, which holds the schemas, the loader, the JSON export, the two clients and their tests, and your notes. The remit email change is on its branches, not on `main`.

In `ch14-check`, every command passes: `npm ci`, `npm test`, `npm run typecheck`, `npm run test:py` and `npm run check:py`. The reference run passes 37 TypeScript tests and 35 Python tests. Yours depend on how many cases you gave the agent.

The clone has no `.env`, because git never had it, and no test needs it: the client tests start their own server, or a fake one. If a test fails only in the clone, it depends on something that is not committed, such as `.env`, a file in `out/`, or a package installed without the lock file.
