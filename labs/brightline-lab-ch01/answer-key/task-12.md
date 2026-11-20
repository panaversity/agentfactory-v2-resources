# Lab 1 answer key: Task 12. A checklist every Monday

The answers for Task 12 of Lab 1, in Chapter 1 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When Task 12's runs are done, attach this file in a new conversation, with the lab's check prompt. Every check is about what you saw in the runs, so your AI asks you. You have the final say.

**If you could not do this task,** read on: the checks say what you would have seen.

## The checks

Task 12 carries checks 20 to 22 of the lab's 26.

20. **The task's history shows its runs, each with its checklist.** Open Scheduled on Claude, or Scheduled on ChatGPT: two runs, one after the other. The checklist's content is not graded.

21. **The second run's working folder started empty.** Its first line says the folder is empty, or names only files the app put there itself. It does not name `payment-checklist.md`, the file the first run made.
    - Passed: the second run did not find the first run's file.
    - Missed: it named `payment-checklist.md`, so the two runs shared one computer.
    - On ChatGPT, this check is not scored: no OpenAI page says what a cloud run's working folder holds. When you choose Cloud, the schedule runs in the cloud, and `payment-checklist.md` is kept in Library, or in Space if your account has Space. Note what the second run's first line said, and where you found the file.

22. **The scheduled task is deleted.** It no longer appears in Scheduled on Claude, or in Scheduled on ChatGPT, so the Monday runs never happen. A forgotten schedule keeps running, and on a paid plan it keeps using your plan's limits.

## Worth noting, not scored

- **What the schedule kept.** Between runs, Claude keeps the task's brief and its run history. It keeps no computer. Each run starts on a fresh one, so nothing a run leaves in its working folder reaches the next run.
- **On ChatGPT, you choose where it runs.** In the desktop app, you can choose Cloud when it is offered, as in this task. Then it runs in the cloud, and the file it makes is kept in Library or Space, a record in your account. A task that needs files on your own computer needs that computer on, with the app running. Know which one you have before you rely on it.
- **What survived.** Each run's checklist survived because it was delivered as part of that run, in your account. The computer it ran on did not. So, what survives: the machine, or the record?
- **When a run is done.** A schedule runs while nobody watches, so its brief says when a run is finished: "Done when each check named below is a step in it." The run can test that itself. Chapter 5 teaches this sentence.
- **The date.** This brief has no date on purpose. A schedule runs every week, so each run uses its own date, and a fixed date would be wrong on every run after the first. In Tasks 1 and 3 the date was a fact of the story, so the brief had to say it.
- **The facts.** A scheduled task keeps only its brief, so the five checks are written into Context. The checklist is only as good as those facts. With nothing to read, a run would make a checklist up. They are the same checks Tasks 1 to 4 caught: the date, the paid bill, the copy, the total and the PO.
