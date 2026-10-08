# Key: Part C (example)

## The spec

- **Route:** Brightline's company workspace only, in the AP project. No personal accounts. Training off, which is the default on business plans. Memory follows the policy.
- **Actions:** read the exports on its own. Draft into the drafts folder on its own. **Never possible:** sending to the auditors or a tax authority, changing bank details.
- **Routine vendor replies, two ways.**
  - *Baseline:* the worker cannot send at all. It drafts every reply, and Maria sends. This is what Brightline uses now.
  - *Advanced:* the worker sends routine replies only through a send step that itself checks the recipient against approved vendor addresses, and is tested to refuse anything else. Neither AI vendor's documented controls provide this per recipient, so it waits for Part IV and DSoR.
- **Needs approval by** stays empty under the baseline: each action is on its own or never possible. The column is for the advanced way.

## What the port should show, as verified 8 October 2026

| Spec line | Claude | ChatGPT | Port result |
| --- | --- | --- | --- |
| No training on work data | Not used for training by default on Team and Enterprise | Not used for training by default on Business, Enterprise and Edu | Same |
| No temporary chats for project work | Incognito is not available in projects | A chat cannot be added to a project while it is temporary | Same limit on both |
| Memory off for everyone, if policy says so | Owners on Team and Enterprise control whether memory is available | Business workspace owners. Enterprise through workspace and role settings | Same on a business plan. Needs another plan on an individual plan, where each person decides |
| Block one write action | Owners on Team and Enterprise set the tool to blocked, for everyone | On Business, Enterprise and Edu, admins enable only the actions they allow, for the workspace or for one app where supported. Roles control app access on Enterprise and Edu, not action settings. Some apps have no action controls | Renamed, and cannot be enforced for some apps |
| Never send to the auditors | Block the email connector's send tool, or remove the connector | Disable the send action, or remove the app | Same outcome, different setting. Blocking send also blocks routine replies, because controls are per tool or action, not per recipient |
| Send routine replies, never to auditors | Not available per recipient | Not available per recipient | Cannot be enforced. Fallback: baseline |

**On an individual plan,** you will not see the admin controls. On Claude you can still set a connector's send tool to Blocked yourself, under Tool permissions in the connector's settings (Chapter 7, and Anthropic's "Get started with connectors" page in `sources.md`). The fallback is the same on both: do not connect an email tool to the worker at all. It drafts into a folder, and a person sends.

**The line every answer needs:** no setting on either AI vendor decides whether this data may go through this route for this purpose, or who must sign. The spec and the policy decide. The settings carry it out.

**Marking.** The spec must name no vendor and must not change during the port. A log that treats "needs approval" as enough for the auditor line fails: approval in Maria's session is not Dave's signature. A log that claims routine sending is allowed while auditor sending is blocked, with no recipient-checking step named and tested, also fails.

If your screens differ from this table, trust your screens and record the date. Products change.
