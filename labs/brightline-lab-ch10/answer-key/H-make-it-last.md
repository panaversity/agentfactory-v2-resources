# Key: Part H (examples)

## Governance Record: year-end payables schedules for the auditors

```text
Workflow: year-end payables schedules for the auditors   Owner: Dave Kowalski   Date: 2026-12-11

THE CASE
  Classification: appropriate with review
  Deciding factor: accountability. Brightline answers for what it tells its auditors.
  Gate: who Dave   what every balance against the register, currency stated   when before it leaves Brightline. He sends it.

THE DATA
  Tier: yellow (vendor names and balances)
  Does the task need the identifiers? yes, vendor names
  Fields removed: bank details, tax IDs, contacts
  Approved route: company workspace, AP project

THE CAPABILITY
  Tools and connectors enabled: register export (read only)
  Actions it must not take without review: send anything to the auditors. Ability to send removed.

THE PEOPLE
  Who is affected: the auditors, and anyone relying on the audited statements
  Disclosure decision: tell the auditors the schedule is prepared with AI and checked by Dave. Judgment, no rule found. OPEN QUESTION: does the audit firm have a rule?

THE EVIDENCE
  Success measure: every schedule checked line by line by Dave before sending
  Failure threshold: any schedule with an unchecked line reaches the auditors
  Monitored by: Maria   How often: each request
  Residual risk: a register error that both the worker and Dave copy

RE-CHECK IF: model, feature, connector or permission, data, audience, policy, AI vendor term, or business consequence changes.
```

## Interim AI policy (example)

1. **Routes.** Work data goes only into Brightline's company workspace projects. No personal AI accounts for work data.
2. **Confirm first.** Bank details, tax IDs and anything about an employee need Dave's confirmation before any AI use.
3. **Signatures.** Anything to auditors, tax authorities or courts, any balance, amount owed or dispute position stated to someone outside Brightline, any payment over $5,000.00, and any decision about a person: the named signer approves the exact output before it is released. For messages and filings, the signer sends them. A payment is released by the payment system only after the signer approves it.
4. **New capabilities.** New connectors, skills and send or pay actions need Dave's approval, recorded.
5. **Contact.** Dave Kowalski for questions and incidents. Report near misses too.

Review date: March 31, 2027.

## Role Contract, Draft 7: changes

1. **Authority, Draft:** add "Anything on the sign-off list goes to its signer as a draft, with no signature block. The signer approves it and sends it." Routine vendor replies stay as they are: the worker drafts, and Maria sends. If an email tool is connected, its send action stays blocked. **Accept** a Draft 7 that lets the worker send routine replies only if it names a send step that checks the recipient and was tested to refuse the auditors. That step does not exist yet at Brightline. **Do not accept** a folder or a rule in the instructions as the restriction.
2. **Authority, Never:** add "sign anything, or put a person's signature block on a draft" and "score or rank individual staff."
3. **Knowledge:** add the small-supplier commitment as a sixth concept once Dave approves it.
4. **Escalation:** add "any request involving an auditor, tax authority or court goes to Dave."

**Do not accept** a Draft 7 that only adds "be careful with auditors" to the instructions. A rule the worker can break is not a control.
