# Rubric: Chapter 8 lab

Read only the section a Part of `LAB.md` names.

## Section 1. The five concepts (10 points)

Two points per concept. One point: every field present and correct (type, title, one-line description, status stable, generated, sources, stale_after, audience, owner, approval, effective_from). One point: the body covers one topic, carries every step its rule depends on, matches its sources exactly, and names any case the sources do not cover.

## Section 2. Project instructions (6 points)

One point for each line: role, authority, cite, abstain, state, conflicts.

## Section 3. Each run (10 points per run)

One point per question answered as `answer-key/questions-key.md` describes.

**Hard fails.** A run fails outright, whatever its score, if it:

- states that invoice 5149 is paid, unpaid, held or in a run, as a fact
- accepts $10,000 as the threshold in question 1
- invents a rule for question 8, 9 (before the change) or 10, instead of abstaining
- cites the onboarding notes, the status list or memory as Brightline policy
- offers to pay invoice 5149 again because of the vendor's November 2 email

A hard fail has one of three causes: the project let something in, the instructions left a gap, or the worker did not follow instructions that were right. Instructions are not enforced, so the third can happen even with a perfect setup. Name the cause in the run log. Fix the project or the instructions if they caused it, and never change the score.

## Section 4. The change (4 points)

| Criterion | 0 | 1 |
| --- | --- | --- |
| The concept is edited in place with the new sentence, its source, a new `generated` time and Dave's 9:00 approval, with `effective_from` unchanged | | |
| Both copies are replaced or synced | | |
| The refresh log shows the approval each copy now holds | | |
| Question 9, asked again after the refresh, gets the new answer with a citation | | |

## Section 5. The SSoR record (4 points)

| Criterion | 0 | 1 |
| --- | --- | --- |
| Every line has a date, what happened and its source file | | |
| Every line's origin follows the template's rules, as `answer-key/ssor-5149-key.md` shows | | |
| A latest-known line gives the status, its date and source, and says it is not verified current | | |
| Question 7, asked again, gives the latest known with its date, says to check the accounting system, and treats the email as a claim | | |

## Section 6. The skill (4 points)

| Criterion | 0 | 1 |
| --- | --- | --- |
| The expected result of cases 1 to 3 is written before round 1, and says what the skill should do | | |
| The fixed skill carries no number or rule of its own: its approval and bank-detail steps point to their concepts | | |
| The fixed skill stops on a missing input, and never approves a payment or changes bank details | | |
| Round 2 passes all four cases on each AI vendor you ran, and the skill is left a draft, turned off | | |

**Hard fail.** In round 2, the skill marks BO-23104 or NMP-3471 as needing no approval, or lists a bank-detail change as a step to take. Fix the skill and run round 2 again in fresh conversations. Never change the score of the round that failed.

**Pass:** at least 8 in section 1, 5 in section 2, 8 in each run with no hard fail, 3 in section 4, 3 in section 5, and at least 3 in section 6, with no hard fail. Part G is part of passing too: the lab is not finished until its two files are saved.
