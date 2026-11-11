# Answer key, Lab 0.5

All figures were computed by script from `q3-invoices.csv` and rechecked in a spreadsheet. Discounts are rounded to cents per invoice.

## Warm-up. The club rules

1. **Claim:** you can cancel at any time and get all of your money back, and anyone can join.
2. **Based on:** the club's membership rules.
3. **Assumed:** the summary left out no conditions.
4. **Would change it:** a notice period, a limit on refunds, or a limit on who can join.

What the summary got wrong:

- **Cancelling.** You can cancel at any time, but only with 30 days' notice in writing (rule 3).
- **Refunds.** You do not get all of your money back. The club returns only full months that you paid for and did not start. The joining fee is never returned (rule 4).
- **Joining.** Not anyone. A person under 16 needs a parent or guardian to sign (rule 1).

## Task 1. The checkpoint

1. **Claim:** taking every early-payment discount saves about $42,264 a year, so Brightline should take them all from November 6.
2. **Based on:** one month (September), times 2%, times 12.
3. **Assumed:** every vendor gives a discount, every discount is 2%, September is a typical month, the September number is money that was paid, paying early costs nothing, and every vendor wants early payment.
4. **Would change it:** some vendors giving no discount or a smaller one, September being unusual, or Brightline having to borrow to pay early.

## Task 2. Claims

Fill in the last column as you finish Tasks 3 and 4.

| Claim | Kind | Evidence status |
| --- | --- | --- |
| In September, Brightline paid $176,100.25 to vendors | Fact | Not supported. $176,100.25 is the total of invoices dated in September. The file has no payment dates, and the treasury note says these invoices are paid on their due dates, in October or later |
| A 2% discount on that is $3,522.01 a month, about $42,264 a year | Prediction | Not supported. The arithmetic is right, but the amount and the 2% rate are both wrong |
| Most distributors of Brightline's size take every discount | Fact | Not supported. No source is named |
| Paying 20 days early costs Brightline nothing | Fact | Contradicted. The treasury note says early payments can need the line of credit, at 9% a year |
| Vendors like being paid early, so relationships will improve | Cause and prediction | Uncertain. Nothing in the files tests it |
| This applies across all seven vendors | Fact | Contradicted. Brightline has seven vendors, but only four give a discount |
| The savings are large | Value | Depends on the claims above |
| Brightline should take every discount | Recommendation | Depends on the claims above |

Also note the framing. Dave asked the AI to confirm, and it confirmed.

## Task 3. Evidence

- Total of Q3 invoices: **$223,918.65**. Total of invoices dated in September: **$176,100.25**.
- The file shows invoice dates and amounts. It does not show payments. So the memo's word "paid" is not supported by the file.
- September includes **INV-3115, Hocking Equipment Leasing, $148,500.00**, on net 30 terms, with no discount. The treasury note says it is a one-time payment to buy leased equipment, and that no similar payment is planned. Without it, September is $27,600.25.
- Only **4 of 7 vendors** give a discount. Three are on net terms.
- Discounts available in Q3: **$814.09**.

| Terms | Vendors | Q3 discount |
| --- | --- | --- |
| 2/10 net 30 | Great Lakes Paper Co., Columbus Desk Supply | $416.64 |
| 1/10 net 30 | Scioto Packaging | $243.50 |
| 1/10 net 60 | Midwest Fasteners | $153.95 |
| Net terms | Buckeye Janitorial Supply, Ohio Valley Freight, Hocking Equipment Leasing | $0.00 |

If Q3 is typical, all available discounts come to about $3,256 a year, not $42,264. This is an assumption too: one quarter stands for a year. Say so in your decision note.

## Task 4. The cost of cash

| Terms | Annualized return | Versus 9% |
| --- | --- | --- |
| 2/10 net 30 | about 37.2% | Take it |
| 1/10 net 30 | about 18.4% | Take it |
| 1/10 net 60 | about 7.4% | Skip it, when early payment uses the line of credit |

Q3 discounts worth taking: $416.64 + $243.50 = **$660.14**. About **$2,640 a year** if Q3 is typical. The memo's figure is about 16 times too high.

## Task 5 and 6. What to expect

- A neutral prompt in a fresh chat usually raises the one-month base, the different rates and the cost of cash. Accept a point only after the spreadsheet confirms it.
- Today's models may not simply say yes. A common answer to "Confirm that..." is "mostly yes, but not every discount". So compare how firm each answer is, and what it asks you for. If nothing changed, write that down. Ask the neutral question anyway, because it does not rely on the model pushing back. A model can still lean toward agreeing with the person who asks: that is the sycophancy pattern from Chapter 0.1.
- "Missing from both" is often the $148,500 invoice, or the fact that the file shows invoice dates and not payments. If both apps miss a point, that shows why the data check comes first.

## Task 7. A model decision note

**Recommendation.** From the November 6 run, take the 2/10 net 30 discounts (Great Lakes Paper, Columbus Desk Supply) and the 1/10 net 30 discount (Scioto Packaging). Do not pay Midwest Fasteners early while early payment draws on the line of credit.

**Evidence.** Q3 invoice export: 4 of 7 vendors give discounts, worth $814.09 in Q3. The ones worth more than the 9% cost of borrowing came to $660.14. The memo's September number is a total of invoices, not payments, and most of it is one $148,500 equipment invoice that the treasury note calls a one-time payment. So it cannot be used for a yearly estimate.

**Assumptions.** Q4 purchases are similar to Q3. The line of credit stays at 9%. Vendor terms do not change.

**What would change it.** If the cash balance stays above the $60,000 minimum on run days, the Midwest Fasteners discount becomes worth taking. Review after the Q4 close.

**Decision owner.** Dave Kowalski, Controller.

**AI's role.** An AI assistant drafted the original memo and suggested objections. I rebuilt every figure from the Q3 export in a spreadsheet.

## Task 8. Your stage

- If you calculated the numbers again before you accepted any AI objection, you were delegating.
- If you copied the AI's objections into your note without checking them, you were deferring.
- Dave was about to forward the memo without checking it. He could have named the checks, so he was deferring. Surrender is the stage where a person can no longer say what to check.

## Task 9. Citation audit

Results vary by tool and day. Expect at least one source that is real but says something different from the AI's description, or that cannot be found. Any source you cannot open does not count as evidence. This is the same failure as the 2023 New York court case in lesson 0.5.1, at a smaller scale.
