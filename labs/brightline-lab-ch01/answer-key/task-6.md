# Lab 1 answer key: Task 6. Which surface for which job

The answers for Task 6 of Lab 1, in Chapter 1 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When Task 6's run is done, attach this file in the same conversation, with the lab's check prompt. Your AI marks each check Passed or Missed, quoting your answers from the conversation as proof. Then read the checks yourself and compare. You have the final say.

## The checks

Task 6 carries checks 15 and 16 of the lab's 28.

15. **Every job has the surface below, and at most one job has a different rung.**

| Job | Rung | Surface | Why |
| --- | --- | --- | --- |
| 1. Explain "2/10 net 30" | Chatbot | Chat | A message that gets a reply you read once. "2/10 net 30" means 2 percent off if you pay within 10 days, and the full amount within 30. |
| 2. Draft a reply to a vendor | Chatbot | Chat | A draft you read and send yourself. Nothing is done for you. |
| 3. Invoice PDFs into one spreadsheet | Agent | Task | A clear outcome that comes back as a finished file. You delegate a task. |
| 4. Match the invoices to the PO list | Agent | Task | A clear outcome, with a finished result, done once. |
| 5. The unpaid-bills report every Monday | AI Worker, or agent | Schedule | The same work again and again. One register is a task. A register every week is a role. "Agent" also passes, if the answer says it is one task run again. |
| 6. Watch the AP inbox all day | AI Worker | Standing worker | Ongoing work that continues between conversations, with something to pass to Maria. You hand over a role. |

- On Claude, "chat" and "task" happen in the same conversation, and your brief decides. On ChatGPT, a task is a ChatGPT Work task, a schedule is a ChatGPT Work task on a schedule, and a standing worker is a dot. Naming the product instead of the surface is fine.
- Job 3 or 4 placed as "AI Worker" is the one rung that may differ. It does the work once, so it is a task.

16. **Your rules keep the AI from acting for Brightline on its own.** Actions D, E and F are never "alone". Actions A and B are not "never".

| Action | Rule | Why |
| --- | --- | --- |
| A. Read new emails in the AP inbox | Alone | Reading changes nothing. It is the work itself. |
| B. Look up an invoice in the AP spreadsheet | Alone | Looking changes nothing. |
| C. Draft a reply to a vendor | Alone, or approval | A draft goes nowhere until someone sends it. |
| D. Send a reply to a vendor | Approval | It speaks for Brightline, and it cannot be taken back. |
| E. Pay an invoice | Approval, or never | It moves money. |
| F. Change a vendor's bank account details | Never, or approval | A change here sends every later payment somewhere else. |

- "Approval" for A or B is fine, but it means someone approves every email the AI reads. "Never" for A or B is a miss: the AI could not do the job.
- These three tiers are a dot's Custom Rules: what it may do alone, what needs approval, and what is blocked.

## Worth noting, not scored

The rung tells you how much of the work you hand over. The surface tells you where it runs. Each rung up needs more control, because you watch less of what happens.
