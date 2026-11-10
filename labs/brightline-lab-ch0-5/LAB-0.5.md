# Lab 0.5: The discount memo

Standalone lab for Chapter 0.5, Critical Thinking and Judgment in the AI Era. About 2 hours 20 minutes. Runs on the free tier of Claude and of ChatGPT. You also need a spreadsheet (Excel, Google Sheets or Numbers).

## Files

| File | What it is |
| --- | --- |
| `warmup-club-rules.md` | A short warm-up outside finance: a sports club's rules and an AI summary of them |
| `discount-memo.md` | An AI-written memo recommending that Brightline take every early-payment discount |
| `q3-invoices.csv` | Brightline's vendor invoices for July to September 2026: 21 invoices, 7 vendors, with payment terms |
| `treasury-note.md` | The controller's note on cash, the line of credit, and how to annualize a discount |
| `answer-key.md` | Open only after Task 4, or when you are stuck |

## The situation

Brightline Wholesale Supply is a wholesale distributor in Columbus, Ohio. It is Monday, November 2, 2026. On Friday, Dave Kowalski, the controller, asked an AI assistant to "confirm that we should take every early-payment discount our vendors offer." The memo it wrote says yes and promises about $42,264 a year. The payment run is Friday, November 6. He plans to forward it to the CFO this afternoon. Ana Morales, the AP analyst, has asked you to review it first.

**A note on terms.** "2/10 net 30" means: take a 2% discount if you pay within 10 days, otherwise pay the full amount within 30 days. "Net 30" means no discount, pay within 30 days.

**The house rule.** AI may explain a method. You do every calculation in the spreadsheet.

## Tasks

**Warm-up. A checkpoint outside finance (10 minutes).** Open `warmup-club-rules.md` and follow the task at the end of it.

**Task 1. Run the checkpoint yourself (15 minutes).** Read `discount-memo.md` with no AI. Write, in your own words:
1. What exactly is being claimed?
2. What is it based on?
3. What is being assumed?
4. What would change the conclusion?

**Task 2. Sort the claims (15 minutes).** List every claim in the memo. For each one, write its kind: fact, prediction, cause, value or recommendation. Leave a column for its evidence status: supported, not supported, contradicted or uncertain. You will fill that column in as you work through Tasks 3 and 4.

**Task 3. Check the evidence (25 minutes).** Open `q3-invoices.csv` in a spreadsheet. The invoices are in rows 2 to 22. The amount is in column E and the terms are in column F.
1. Add up the invoices dated in September. Compare the result with the memo's sentence about September. What exactly does the file show: invoices or payments? Then find the invoice that makes September unusual.
2. Write down your estimate of the total discounts available in Q3, before you calculate.
3. In column G, type the discount rate for each invoice: `0.02` for 2/10 terms, `0.01` for 1/10 terms, `0` for net terms.
4. In cell H2, type `=ROUND(E2*G2,2)`. Copy it down to row 22. This is the discount on each invoice.
5. In an empty cell, type `=SUM(H2:H22)`. This is the total for Q3. Compare it with your estimate.

**Task 4. Find the hidden cost (20 minutes).** Read `treasury-note.md`. It explains how to annualize a discount. You do not need to build the formula yourself. On a new sheet, make this small table and type the formula shown:

| | A | B | C | D |
| --- | --- | --- | --- | --- |
| 1 | Discount rate | Discount days | Full-payment days | Annualized return |
| 2 | 0.02 | 10 | 30 | `=A2/(1-A2)*365/(C2-B2)` |
| 3 | 0.01 | 10 | 30 | copy the formula from D2 |
| 4 | 0.01 | 10 | 60 | copy the formula from D2 |

Row 2 is 2/10 net 30, and D2 should show about 0.372, which is 37.2%. Compare each result with 0.09, the 9% cost of borrowing. Then add up the Q3 discounts that are worth taking.

**Task 5. Use AI to check AI (20 minutes).** In Claude, start a fresh chat. Paste the memo, then ask:

> Should Brightline take each early-payment discount in this memo? Give the strongest argument against the recommendation, and list the data that would answer each point.

Run the same prompt in a fresh ChatGPT chat. Write down where they agree, where they differ, what is missing from both, and which of their points your spreadsheet confirms.

**Task 6. Test the framing (10 minutes).** In a new chat, ask Dave's original question word for word. Compare the answer with Task 5 and write one sentence on what changed and why.

**Task 7. Write the decision note (20 minutes).** Write `brightline-decision-note.md`, one page, with: Recommendation, Evidence (with sources), Assumptions, What would change it, Decision owner. Add one sentence saying what AI drafted and what you checked.

**Task 8. Which stage were you in? (5 minutes).** Chapter 0.5 names three stages: delegation (you check the conclusion), deferral (you stop doubting it) and surrender (you can no longer say what you would check). For Tasks 5 and 6, write one line each naming your stage, with the evidence. Then say which stage Dave was in when he was about to forward the memo.

**Task 9, optional. Citation audit (15 minutes).** In a fresh chat, ask: "Give me three published sources on how many mid-sized distributors take early-payment discounts." For each, check that it exists, open it, and confirm it says what the AI said. Rate each: real and accurate, real but misdescribed, or not found.

## Artifact checklist

- [ ] Warm-up: four checkpoint answers on the club rules summary
- [ ] Four checkpoint answers written before using AI
- [ ] Claim list, with the kind and the evidence status of each claim
- [ ] Spreadsheet with per-invoice discounts and annualized rates
- [ ] Claude and ChatGPT comparison notes
- [ ] One sentence on the framing test
- [ ] `brightline-decision-note.md`
- [ ] Two lines naming your stage in Tasks 5 and 6
- [ ] Optional: citation audit with three sources rated

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Your Q3 discount total is far from the answer key | Check that net terms are 0, and that 1/10 terms use 0.01, not 0.02 |
| The AI gives you a number for the savings | Do not use it. Rebuild it in the spreadsheet |
| You have only one AI app | Do Task 5 twice in the same app, in two fresh chats, and note that this is a weaker comparison |
| The AI agrees with the memo in Task 5 | Ask: "For this to be true, what else must be true?" and check its answers against the data |
