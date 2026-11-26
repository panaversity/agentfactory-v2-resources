# Decision: does the review workspace ship?

For: Ana Morales, AP analyst. Written: Tuesday, March 30, 2027. Branch: `review-app`, not merged into main.

## What the workspace gives Cedar Ridge that Lab 20's screen does not

Lab 20's screen shows the open invoices, five at a time, and reads. The workspace keeps the month-end
review itself: a note and a status on every open invoice, saved on Brightline's server, in one place the
whole AP team sees. Luis, Priya and Claude work in the same screen. Claude can find the overdue
invoices, open one and draft a note, and a person decides what is saved. Two people can no longer
overwrite each other's work: a second save of the same version is refused, and the person's text stays.

## What Brightline now stores and protects that it did not before

- **New data:** every company's review notes, with who saved each version and when. Brightline is now
  the place this data lives, so it must back it up, export it with the company's data (`tenant:export`
  includes `review_notes`), and delete it when a company leaves (`tenant:delete` does).
- **A new permission:** `review:write`, the first scope that changes anything. An `auditor` never gets it.
- **A new door:** a second connector address with its own tokens, and a database role, `review_writer`,
  that can write `review_notes` and nothing else.

## Where Claude can drive the screen

Where the AI app supports a page's own tools (app tools): in Claude, in public preview as of November
2026, and only with the connector online. Elsewhere the person still uses the screen, and in an AI app
without screens, `export_review` gives the review as Markdown. Task 9's table in `docs/review-spec.md`
says what each AI app did.

## What would make us merge it into the product

One condition: Cedar Ridge's AP lead uses it for one real month end, on staging, and the workspace
matrix, the screen matrix, the data matrix and the sign-in matrix all end `0 failed` on that month's
data. Until then it stays on `review-app`, and Chapters 21 to 23 keep building on main.

## What waits for Chapter 28

Anything that moves money or changes an invoice: marking an invoice paid, scheduling a payment, and the
approval step before it. A review note is not an approval, and *Save* never pays anything.
