# Lab 1 answer key: Task 12. A checklist every Monday

The answers for Task 12 of Lab 1, in Chapter 1 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When Task 12's runs are done, attach this file in a new conversation, with the lab's check prompt. Every check is about what you saw in the runs, so your AI asks you. You have the final say.

**If you could not do this task,** read on: the checks say what you would have seen.

## The checks

Task 12 carries checks 22 to 24 of the lab's 28.

22. **The task's history shows its runs, each with its checklist.** On Claude, open Scheduled in the sidebar: two runs, one after the other. On ChatGPT, today's run. The checklist's content is not graded.

23. **The second run's working folder started empty.** Its first line says the folder is empty, or names only files the app put there itself. It does not name `payment-checklist.md`, the file the first run made.
    - Passed: the second run did not find the first run's file.
    - Missed: it named `payment-checklist.md`, so the two runs shared one computer.
    - On ChatGPT, this check is not scored: no OpenAI page says where a scheduled run works. Note what its first line said.

24. **The scheduled task is deleted.** It no longer appears in Scheduled on Claude, or in your scheduled tasks on ChatGPT, so the Monday runs never happen. A forgotten schedule keeps running, and on a paid plan it keeps using your plan's limits.

## Worth noting, not scored

- **What the schedule kept.** Between runs, Claude keeps the task's brief and its run history. It keeps no computer. Each run starts on a fresh one, so nothing a run leaves in its working folder reaches the next run.
- **What survived.** Each run's checklist survived because it was delivered as part of that run, in your account. The computer it ran on did not. So, what survives: the machine, or the record?
- **The date.** The brief says "as of Monday, October 5, 2026". Without it, each run would use its own date, and a real Monday run would need it anyway.
