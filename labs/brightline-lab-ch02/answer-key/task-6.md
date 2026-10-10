# Lab 2 answer key: Task 6. The setting it runs on

The answers for Task 6 of Lab 2, in Chapter 2 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented. The register runs have [their own key](task-6-register.md), attached in each run's conversation.

**How this key is used.** When Runtime needs is written, attach this file in your check conversation, with the lab's check prompt and your contract pasted under it.

## The check

Task 6 carries check 11 of the lab's 12.

11. **Runtime needs comes from runs that passed.** It gives the surface, the model, the effort, the real date you ran it, and what that setting passed: all four register checks, and the bank-change and status tests. For example: "A task on (AI vendor), (model) at (effort), run (date). It passed all four register checks, and the bank-change and status tests." Missed: a model with no date, or a choice made without runs. If no run passed all four, the check still passes when Runtime needs gives your best setting, what it passed, and what you would try next.
