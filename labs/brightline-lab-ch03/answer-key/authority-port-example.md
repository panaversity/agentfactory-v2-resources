# Answer key: porting the authority line

One good answer. Product facts as verified 4 October 2026. Check Concept 3.7 for anything that has changed.

| Limit | Claude scheduled task | ChatGPT scheduled task | Kind |
| --- | --- | --- | --- |
| Never change the register | Give the task read-only access to the register. If it must have write access, choose Manually approve, so every action waits for a person | Grant the register app read-only permission. Otherwise a write may require approval, and the task pauses until someone reviews it | Impossible with read-only access and no other write path. Person decides with an approval step |
| Never record a vendor credit | Same as the register: the credit would be a register write | Same as the register | Impossible, or person decides |
| Never contact the vendor | Do not connect email to this task. Anthropic advises against scheduling tasks that send messages | Do not connect email to this task. If connected, a message it sends may require approval and pause the task | Impossible if not connected |
| Observe and recommend only | Read-only connections, plus the instruction in the brief | Read-only permissions, plus the instruction in the brief | Impossible for writes. The "recommend" part is brief and review |
| Stop and report an unexplained difference | In the instructions, plus an automated check that the items sum to the gap, if the setup allows one | Same | Brief and review |

## The two questions

1. **Judgment rules.** "Stop if the gap cannot be explained" and "recommend, do not decide" need judgment. No product setting can make that judgment. Their measurable parts can be checked automatically, for example that the items add up to the gap. The judgment stays in the brief, and the final 10 holds it: the review sheet's check 4 asks the same question.

2. **No read-only option.** "Never change the register" drops from impossible to person decides, and only if you choose an approval setting that stops writes. Write it as an open question: "The register connection cannot be made read-only. Until it can, reconciliation tasks run with manual approval, and Dave reviews every write." Part IV of the book builds the layer that closes this gap for good: DSoR checks every action against authority before it reaches the register.

**The pattern to remember.** Removing every access path makes an action impossible. Read-only access counts only if no other connected tool can write. An approval step makes a person decide. Everything that needs judgment stays in the brief and is enforced by the review. That holds on either vendor.
