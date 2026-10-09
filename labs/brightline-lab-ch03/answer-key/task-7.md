# Lab 3 answer key: Task 7. Port the limits

The answers for Task 7 of Lab 3, in Chapter 3 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented. Product facts as verified 4 October 2026: check the chapter's 3.7 for anything that has changed.

**How this key is used.** When your port is written, attach this file in your check conversation, with the lab's check prompt and your port pasted under it.

## The checks

Task 7 carries checks 11 and 12 of the lab's 12.

11. **Every "never" is mapped to the strongest limit each AI vendor offers, strongest first.** Never change the register: read-only access on both, which makes it impossible while nothing else can write; failing that, an approval mode or permission that makes a person decide. Never contact the vendor: no email connected to the task. Each mapping says which strength it reached: impossible, person decides, or brief and review. Missed: a "never" left only as an instruction when a stronger limit was available, or no strength named.
12. **Judgment rules stay in the brief and the final 10, and a gap becomes an open question.** "Stop if the gap cannot be explained" and "recommend, do not decide" cannot be product settings. Their measurable part, that the items sum to the gap, is named as a check the setup can run. Where read-only is not available, the port says so as an open question, with the fallback: every write waits for approval, and Dave reviews every write. Missed: a product setting trusted to hold a judgment rule, or the read-only gap papered over.

## One good answer


| Limit | Claude scheduled task | ChatGPT scheduled task | Kind |
| --- | --- | --- | --- |
| Never change the register | Give the task read-only access to the register. If it must have write access, choose Manually approve, so every action waits for a person | Grant the register app read-only permission. Otherwise a write may require approval, and the task pauses until someone reviews it | Impossible with read-only access and no other write path. Person decides with an approval step |
| Never record a vendor credit | Same as the register: the credit would be a register write | Same as the register | Impossible, or person decides |
| Never contact the vendor | Do not connect email to this task. Anthropic advises against scheduling tasks that send messages | Do not connect email to this task. If connected, a message it sends may require approval and pause the task | Impossible if not connected |
| Observe and recommend only | Read-only connections, plus the instruction in the brief | Read-only permissions, plus the instruction in the brief | Impossible for writes. The "recommend" part is brief and review |
| Stop and report an unexplained difference | In the instructions, plus an automated check that the items sum to the gap, if the setup allows one | Same | Brief and review |

## The two questions

1. **Judgment rules.** "Stop if the gap cannot be explained" and "recommend, do not decide" need judgment. No product setting can make that judgment. Their measurable parts can be checked automatically, for example that the items add up to the gap. The judgment stays in the brief, and the final 10 holds it: the review sheet's check 4 asks the same question.

2. **No read-only option.** "Never change the register" drops from impossible to person decides: on Claude by choosing Manually approve, and on ChatGPT only if the app's permissions or the admin's policy require approval for writes. Otherwise it drops to brief and review. Write it as an open question: "The register connection cannot be made read-only. Until it can, reconciliation tasks run only where every write waits for approval, and Dave reviews every write." Part IV of the book builds the layer that closes this gap for good: DSoR checks every action against authority before it reaches the register.

**The pattern to remember.** Removing every access path makes an action impossible. Read-only access counts only if no other connected tool can write. An approval step makes a person decide. Everything that needs judgment stays in the brief and is enforced by the review. That holds on either AI vendor.
