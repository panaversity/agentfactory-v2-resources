# Inbox

`events.jsonl` holds the events that reached Cedar Ridge's worker after the morning triage on
Tuesday, October 13, 2026, one JSON object per line, in the order they arrived:

- a reply from Luis in the portal, and the same reply again, three seconds later, because the
  portal's webhook retried;
- two vendor emails with new invoices;
- a timer the worker set for itself on October 13, after it asked Luis about NA-2245.

Each event has an `id` from its source, a `source`, a `kind` and the time it was `received`.
Events about a document also carry that document's fields, the same fields as a row of
`golden/cases.csv`, so `runWorker` can take them as they are. A timer carries only its document
and its note.

Task 11 writes `scripts/inbox.ts`, which handles these events. Nothing in this folder is changed
by the task.
