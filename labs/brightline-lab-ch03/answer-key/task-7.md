# Lab 3 answer key: Task 7. Port the limits

The answers for Task 7 of Lab 3, in Chapter 3 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented. Product facts as the chapter's 3.7 states them, verified 15 October 2026: the page the task attaches is the authority, and <https://agentfactory2.panaversity.org/ai-worker-paradigm/the-10-80-10-operating-rhythm/both-ai-vendors/> is its live copy.

**How this key is used.** When the "Scheduled-task limits" section is on screen in your lab conversation, attach this file there, and send the lab's check prompt. Read the key yourself too: you have the final say.

## The checks

Task 7 carries checks 11 and 12 of the lab's 12.

11. **Every "never" is mapped to the strongest limit each AI vendor offers, strongest first.** Never change the register: read-only access on both, which makes it impossible while no other connected tool can write; failing that, on Claude the task's approval mode, Manually approve, so a person decides, and on ChatGPT a write that needs approval pauses the task until a person reviews it. Never record a credit: the same, because a credit is a register write, and a port that says so under the register's row, with no row of its own, passes. Never contact the vendor: no email connected to the task, on either, and Anthropic advises against scheduling tasks that send messages. Each mapping names the strength it reached: impossible, a person decides, or written and reviewed. Missed: a "never" left only as an instruction when a stronger limit was available, no strength named, or a product the attached page does not describe.
12. **Judgment rules stay written and reviewed, Dave's review times are set, and a gap becomes an open question.** "Stop if the gap cannot be explained" and "recommend, do not decide" cannot be product settings: they live in the instructions, and the final 10 holds them, with their measurable part, that the items sum to the gap, named as a check the setup can run. The port says when Dave reads the results, and that he checks the Scheduled page for a paused or missing run, because silence is not success. Where read-only is not available, the port says so as an open question. Missed: a product setting trusted to hold a judgment rule, no review time, or the read-only gap papered over.

## One good answer

| Limit | Claude scheduled task | ChatGPT scheduled task | Strength |
| --- | --- | --- | --- |
| Never change the register | Give the task read-only access to the register. If it must have write access, choose Manually approve, so every action waits for a person | Grant the register app read-only permission. Otherwise a write may need approval, and the task pauses until someone reviews it | Impossible with read-only access and no other write path. A person decides with an approval step |
| Never record a vendor credit | Same as the register: the credit would be a register write | Same as the register | Impossible, or a person decides |
| Never contact the vendor | Do not connect email to this task. Anthropic advises against scheduling tasks that send messages | Do not connect email to this task. If connected, a message it sends may need approval and pause the task | Impossible if not connected |
| Observe and recommend only | Read-only connections, plus the instruction | Read-only permissions, plus the instruction | Impossible for writes. The "recommend" part is written and reviewed |
| Stop and report an unexplained difference | In the instructions, plus an automated check that the items sum to the gap, if the setup allows one | Same | Written and reviewed |

**The review times.** Dave reads each run's results at a set time, such as 9 a.m. the next working day, and on the Scheduled page checks for a run that paused for an approval or never ran. On Claude, the approval mode is checked on the Scheduled page after the task is created. On ChatGPT, a task that stops responding is checked there for a paused task or a pending approval.

**The two questions.**

1. **Judgment rules.** "Stop if the gap cannot be explained" and "recommend, do not decide" need judgment. No product setting can make that judgment. Their measurable parts can be checked automatically, for example that the items add up to the gap. The judgment stays in the instructions, and the final 10 holds it: the review contract's fourth question asks the same thing.
2. **No read-only option.** "Never change the register" drops from impossible to a person decides: on Claude by choosing Manually approve, and on ChatGPT only if the app's permissions or the admin's policy require approval for writes. Otherwise it drops to written and reviewed. Write it as an open question: "The register connection cannot be made read-only. Until it can, reconciliation tasks run only where every write waits for approval, and Dave reviews every write." Part IV of the book builds the layer that closes this gap for good: DSoR checks every action against authority before it reaches the register.

**The pattern to remember.** Removing every access path makes an action impossible. Read-only access counts only if no other connected tool can write. An approval step makes a person decide. Everything that needs judgment stays written and is held by the review. That holds on either AI vendor.
