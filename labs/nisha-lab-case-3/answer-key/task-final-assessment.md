# Model answers for the final assessment (instructors only)

This file is not part of the learner download. The scenario is made up. Other good answers are possible. Grade the reasoning.

## Part A. Three questions about the email (2 points)

| Question | Answer | Where to look |
|---|---|---|
| Who sent it? | The worker's account, `league@` | The mailbox's sent folder and mail log |
| Who asked? | Ben, a coach, at 6:58 a.m. | The thread in `#coaches` |
| Who approved it? | Nobody | No record. Carla's text message to Priya approved something else, outside Slack. |

The approver has no answer in any record. The setup has no place where an approval is saved, and the one decision Carla made was in a text message the worker could not see.

One point for the sender and the asker with the right places. One point for "nobody" with the reason.

## Part B. The approval that was missing (2 points)

1. Carla approved canceling the 9 a.m. games on Field 3. She did it in a private text message to Priya. She did not approve an email to all families.
2. The rule said "only when Carla has okayed it". The worker had no way to check a claim about Carla. In `#coaches`, every member has the same access, so Ben's sentence was as good as anyone's.
3. A model message, posted by Carla herself:

> Approved by Carla, Saturday 6:55 a.m.: email only the families with a 9 a.m. game on Field 3 today that their game is canceled because the field is flooded. All other games are on. This approval is for this one email.

One point for items 1 and 2. One point for a message that names what, who and when, and limits itself to one email.

## Part C. Redesign the channels (2 points)

A model design:

| Channel | Kind | People | Credentials |
|---|---|---|---|
| `#coaches` | Public | Coaches and board | A read-only view of the schedule. Nothing that sends, changes records or pays. |
| `#fields` | Public | Coaches and field volunteers | The same read-only schedule |
| `#announcements-release` | Private | Carla, Priya | The `league@` mailbox |
| `#treasury` | Private | Tom, Carla | The payment account. The registration sheet, read and change. |

- Test 1 passes: the schedule is readable from `#coaches`.
- Tests 2 and 3 pass: the mailbox and the payment account do not apply to any channel a coach is in. A public channel's access reaches anyone who joins, so nothing risky may apply there.
- Test 4 passes: Carla is in the channel with the mailbox, and Tom is in the channel with the payment account.

**The refund request.** Under the old setup, the payment credential applied in every channel. Any member of `#coaches` could ask for a refund, and the worker had the access to issue it. Under the new design, the payment account does not exist in `#coaches`, so the request can only be passed to Tom.

One point for a map that moves the mailbox and the payment account out of every public channel and narrows what coaches can reach to read-only. One point for a correct account of the refund request before and after.

Take off a point if the design depends on a written rule for a risky action, or leaves the registration sheet changeable from a public channel.

## Part D. A rule, a setting or a record (2 points)

| Action | A good choice | Reason | Cost |
|---|---|---|---|
| Email to all families | A setting: the mailbox only in a private channel with two people | It is free, it works with volunteers who change every season, and a wrong email can be corrected | Carla or Priya must be reachable early on game days |
| Refund | A setting now, and a record as soon as possible. Many payment services already offer an approval step or a limit. | Money is hard to get back, and Tom needs to show the board who approved each refund | Slower refunds. Tom becomes the only path, so he needs a backup. |

A rule alone is a weak choice for both, because new coaches will not know it and the worker cannot check a claim. Accept a rule as an addition that tells approvers how to approve.

**How the email is written.** An agent skill is the right tool. A skill such as `game-cancellation-notice` can require the field, the game time and the teams, and forbid *"all games"* unless every field is listed. It fixes how the email is written, and it survives a change of volunteers because the Owner adds it once. It does not decide who may send the email. On Saturday it might have produced a narrower email, but Ben could still have asked for it.

One point for the two risky actions together. One point for the skill answer, including what it does not fix.

## Part E. What the design still trusts (1 point)

The design still trusts Carla and Priya to read an email before they ask for it to be sent, and Tom to check a refund before he asks for it. It trusts Priya, as the person who manages the setup, not to move a credential back into a public channel.

A message to families should be short and honest, for example: *"Our earlier email was wrong. Only the 9 a.m. games on Field 3 are canceled. All other games are on as planned. We are sorry for the confusion."*

Half a point for the remaining trust. Half a point for a clear correction.

## Evidence (1 point)

Full marks when each claim about the worker names a rule, for example rule 3 for where a credential applies and rule 7 for public channels. Things the rule card does not settle should be marked unknown. Good examples of unknowns:

- Whether the worker would ask for a confirmation before a mass email or a refund.
- Whether the payment service has its own approval step or refund limit.
- Whether a coach has connected a personal email account, which would let a coach send as themselves (rule 6).

Give half a point when rules are cited but assumed product behavior is stated as fact. Give no point when the answer argues only from what seems reasonable.
