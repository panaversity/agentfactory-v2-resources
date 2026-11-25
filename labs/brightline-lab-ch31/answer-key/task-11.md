# Task 11. Wake on events, and never act twice

`scripts/inbox.ts` exports a function such as `handleInbox(paths, ask)`, so the test can pass a stub in place of the model. For each event, in order, it:

1. reads `records/case-log.csv` again, and skips the event if its id is already there (a duplicate);
2. for a timer whose document already has a valid apply-credit or ready-to-pay row, writes "closed" with no model call;
3. otherwise calls `runWorker` with the newest published version, read-only, and the event's fields as the case;
4. writes one line to `outbox/outbox.csv` and one row to the case log.

A run ends in one of three ways:

- **ask:** hold-duplicate, needs-approval, ask, or a decision that failed validation;
- **send:** the event was a person's reply, so the person is waiting;
- **quiet:** everything else, which can wait for the next morning report.

The outbox after `npm run inbox`, verified on claude-haiku-5-5:

    event_id,document,ending,reason
    portal-8841,NA-2245,send,apply-credit; a person is waiting for this answer
    email-3307,INV-7861,quiet,ready-to-pay; nothing to send now
    email-3309,INV-7862,ask,needs-approval
    timer-0042,NA-2245,quiet,already apply-credit (event portal-8841)

The second `portal-8841` is skipped. INV-7861 is due 2026-11-12. INV-7862 ($3,100.00) is over Cedar Ridge's $2,500.00 limit: even if the model said ready-to-pay, `validateDecision` would reject it, and the run would end in "ask". A second `npm run inbox` prints that every event is a duplicate, and adds nothing.

**The test.** Copy the events and the published memory to a temporary folder. Call the function twice with a stub that answers by document (apply-credit for NA-2245, ready-to-pay 2026-11-12 for INV-7861, needs-approval for INV-7862). The first call handles four events, skips one and closes the timer. The second handles none, the stub is never called, and the outbox has the same four lines.

**Check before you approve.** If the script asked the model about the timer instead of reading the case log, the model would see NA-2245 with no record of Luis's answer. It might ask Luis again, a second time, about a credit already applied. The line that prevents it is the case-log lookup before `runWorker`.

**One step further.** Look at the order of the two writes. If the script writes the outbox line first and crashes before the case-log row, the next run repeats the event and sends a second message. If it writes the case log first and crashes, the message is never sent. No order gives "exactly once". This is why 31.9 asks for an id on every outside action, and for a check of the provider's state before a retry.
