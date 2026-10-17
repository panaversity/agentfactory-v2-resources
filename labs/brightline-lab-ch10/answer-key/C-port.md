# Key: Part C (example)

## The spec

- **Route:** Brightline's company workspace only, in the AP project. No personal accounts. Training off, which is the default on business plans. Memory follows the policy.
- **Actions:** read the exports on its own. Draft into the drafts folder on its own. **Never possible:** sending to the auditors or a tax authority, changing bank details.
- **Routine vendor replies, two ways.**
  - *Baseline:* the worker cannot send at all. It drafts every reply, and Maria sends. This is what Brightline uses now.
  - *Advanced:* the worker sends routine replies only through a send step that itself checks the recipient against approved vendor addresses, and is tested to refuse anything else. Neither AI vendor's documented controls provide this per recipient, so it waits for Part IV and DSoR.
- **Where results are kept and shared.**
  - Yellow and red results are saved only in a folder that only Maria and Dave can open, never in the AP project's files, which every member can open, Jordan included. A result for someone else, such as a schedule for the auditors, leaves only as a fixed copy of the version the signer approved, such as a PDF, which the signer sends.
  - No "anyone with the link" for a yellow or red result. Share it by inviting named people to a place only they can open.
  - The person who shares owns the end. The end date goes in the Governance Record. On that date they remove the link, the extra copies and the extra access, then try to open the result from an account that should no longer reach it.
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

## Results kept and shared, as verified 17 October 2026

| Spec line | Claude | ChatGPT | Port result |
| --- | --- | --- | --- |
| Results only in a place whose audience is named | In a shared project, members see its knowledge and instructions. Each member's chats stay private unless that member shares them | In a shared project, members with chat access see its chats, files and instructions | Renamed, and wider on ChatGPT: a result written in a chat in a shared project reaches every member. Fallback: keep yellow and red results out of shared projects, in a place only their audience can open |
| No "anyone with the link" for yellow or red results | On Team and Enterprise, artifacts stay inside the organization by default, and "anyone with the link" is offered only when an Owner turns on external sharing. A shared chat opens only for signed-in members | In a Business, Enterprise or Edu workspace, a shared chat link opens only for members. It cannot be limited to chosen people. Enterprise and Edu admins can turn sharing off. Business has no such control | Same on Claude Team and ChatGPT Enterprise. Cannot be enforced on ChatGPT Business, or on a personal plan. Fallback: the rule, and no chat links for yellow or red results. Invite named people instead |
| Access taken back on a date, and checked | Accepted invitations do not expire | A link has no end date. Delete it when it is no longer needed | Cannot be enforced: neither sets an end. Fallback: the owner and the date in the Governance Record, then a test open from an account that should fail |

**The test share.** The two free plans behave differently at the first click, and the same afterward. On Claude, the share control starts at "Only people invited". The reader must choose "Anyone with the link", and Claude then warns that no sign-in is needed, that you will not see who opened it, and that turning the link off cannot take back copies. On ChatGPT, one click on Share makes a public link at once and copies it: "Anyone with the link can view this conversation." Both links show the chat as it was when it was shared, so a line added afterward stays private. Both lists of shared links are in settings, and after the link is deleted, a private window no longer opens it. Deleting a link does not reach a copy someone already saved, which is why the audience is decided before the share. A business plan may open a link only for signed-in members, so there the private window fails before anything is deleted: record that as a result.

- Claude Free, run on 17 October 2026: (1) the control started at "Only people invited", and the test chose "Anyone with the link". (2) The private window opened it. (3) "A line added after sharing." did not show. (4) The link is taken back in Settings, Privacy, Shared chats, Manage, or by setting the chat's Share control back to "Only people invited". A notice offers Undo for a short time. (5) Within about a minute, the private window no longer opened it.
- ChatGPT Free, run on 17 October 2026: (1) one click on Share made a public link: "Anyone with the link can view this conversation." (2) The private window opened it. (3) "A line added after sharing." did not show. (4) The link is deleted in Settings, Data controls, Shared links, Manage. Deleting it "stops others from viewing that shared content" and does not delete the chat. (5) The private window no longer opened it, at once.

**The line every answer needs:** no setting on either AI vendor decides whether this data may go through this route for this purpose, or who must sign. The spec and the policy decide. The settings carry it out. And no setting decides who a result is for. Dave names the audience, and the settings carry it out.

**Marking.** The spec must name no vendor and must not change during the port. A log that treats "needs approval" as enough for the auditor line fails: approval in Maria's session is not Dave's signature. A log that claims routine sending is allowed while auditor sending is blocked, with no recipient-checking step named and tested, also fails. A spec that allows "anyone with the link" for a yellow or red result, or a share with no owner and no end, does not meet row C.

If your screens differ from this table, trust your screens and record the date. Products change.
