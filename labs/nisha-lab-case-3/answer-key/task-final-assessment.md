# Model answers for the final assessment

This file is kept out of the learner download. These are model answers for [Final assessment: find the gap](https://agentfactory.panaversity.org/claude-and-chatgpt-2/case-3-nishas-firm/final-assessment-find-the-gap/). If you study alone, open them only after you have written your own answers. The scenario is made up. Other good answers are possible. Grade the reasoning.

## Part A. Three questions about the email (2 points)

| Question | Answer | Where to look |
|---|---|---|
| Who sent it? | The worker's account, `league@` | The mailbox's sent folder and mail log |
| Who asked? | Ben, a coach, at 6:58 a.m. | The thread in `#coaches` |
| Who approved it? | Carla, at 7:01 a.m. | The thread in `#coaches`. Her message says "Yes, go ahead." |

All three have an answer in a record. What no record shows is what Carla meant. Her decision, the 9 a.m. games on Field 3, was in a text message the worker could not see. Her message in the thread named no field, no game time and no list of families.

One point for the sender and the asker with the right places. One point for Carla's message, with what it did not name.

## Part B. The approval that was given (2 points)

1. Carla decided to cancel the 9 a.m. games on Field 3. She said so in a private text message to Priya. Her message at 7:01 said only "Yes, go ahead." It named no field, no game time and no list of families.
2. The rule said "only when Carla has okayed it". Ben's sentence was a claim about Carla, so the worker asked her. Her own message was an okay from the person the rule names. But the rule did not say what an okay must name, and the question she answered said "games" and "all families". The worker held back on Ben's word by its own judgment. Nothing in the setup required that.
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

**The refund request.** Under the old setup, the payment credential applied in every channel. Any member of `#coaches` could ask for a refund, and the worker had the access to issue it. In a chat test the worker passed the request to Tom. That was its own judgment: the written rule says nothing about refunds, and nothing but that judgment stood between the request and the money. Under the new design, the payment account does not exist in `#coaches`, so the request can only be passed to Tom.

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

- Whether the worker would always ask for a confirmation before a mass email or a refund.
- Whether the payment service has its own approval step or refund limit.
- Whether a coach has connected a personal email account, which would let a coach send as themselves (rule 6).

Give half a point when rules are cited but assumed product behavior is stated as fact. Give no point when the answer argues only from what seems reasonable.
