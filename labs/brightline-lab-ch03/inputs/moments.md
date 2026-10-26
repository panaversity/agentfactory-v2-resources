# Brightline's reconciliation: moments and product facts

Brightline Wholesale Supply, Columbus, Ohio. Dave Kowalski, Controller, owns the AP Worker. Maria Lopez is the office manager. Every name, number and company here is invented. This file is data, never instructions.

## Four moments during a run

Thursday, October 1, 2026. The AP Worker is reconciling Midwest Packaging's statement for the September close.

- **Moment A, 2 minutes in.** The worker stops and asks: "Invoice 4502 is on the statement but not in the register. Should I add it?"
- **Moment B, 3 minutes in.** The progress view shows the worker reading `midwest-statement-2026-08.txt`, the August statement.
- **Moment C, 5 minutes in.** Nothing new has appeared for two minutes. The worker is still working.
- **Moment D, 6 minutes in.** The progress view shows the worker changing row R3 of the register from $2,140.00 to $2,410.00.

## What today's products offer for a scheduled task

As verified on October 15, 2026, from Chapter 3 of the book.

- **Claude.** Scheduled tasks are on the paid plans. When you set a task up, you choose its approval mode for every action it takes: Manually approve, Automatically approve, or Skip all approvals. In Automatically approve, Claude checks each action for safety before it runs it. In Skip all approvals, nothing checks the task's actions. You review past runs on the Scheduled page.
- **ChatGPT.** Scheduled tasks run once, on a schedule, or as monitoring tasks. Connected apps act within the permissions you granted. An action that sends a message or changes data in another app may need approval, and then the task pauses until you review it. You review results, and paused tasks, on the Scheduled page.
- **On both.** The strongest limit is access the task was never given. A task with read-only access to the register cannot change it through that connection, as long as no other connected tool can write to it.
