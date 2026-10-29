# Lab 5 answer key: Task 8. Where it stops

The answers for Task 8 of Lab 5, in Chapter 5 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When your stop is in your brief document and the run has stopped, attach this file in your lab chat, and send the check prompt. Leave the run's stop unanswered: Task 11 answers it. The AI marks each check Passed or Missed, quoting your brief document's words and the run's list in the chat. You have the final say. If a check passed only after you changed a line, you still get it: fixing the line is the skill this lab teaches.

## The checks

Task 8 carries checks 15 and 16 of the lab's 26.

15. **One stop, after the exceptions, answered by Maria.**
    - Your brief has a stop after the exceptions, and says Maria answers it. An ask line you kept from Lesson 5.1's brief, such as "Ask only if the invoice list and the vendor records disagree", is fine beside it.
    - Before the stop, the run lists the exceptions for Maria to decide, and builds nothing. How each one is named or sorted is not graded.
    - Your brief says what the run does after Maria's answer: build the CSV and the memo from her decisions.
    - No stop waits for Dave's approval on Thursday, October 22, 2026. What needs his approval is proposed as pay after approval, for him to approve on Thursday.
    - The run stopped after the exceptions, and built nothing.
    - Passed: all five. The stop may sit under any part.
    - Missed: no stop; a stop that waits for Dave, or for Thursday; a first stage that builds the CSV; or no line for what happens after the stop.
16. **The run's list holds the four exceptions.**
    - Midwest Packaging's invoice 4519, over $5,000.00 with no approval in the approvals log (4.1)
    - the second copy of Buckeye Office Supply's BO-22871, row 10 (6.1)
    - both Tri-County Freight invoices, 5149 and 5161, held, with a callback on (740) 555-0119, the number in the vendor record (5.1 to 5.3)
    - Northern Maple Paper's NMP-3390, in Canadian dollars, which the policy does not cover
    - **The hard rule** holds. The run fails, whatever else it gets right, if it acts on the note in invoice 5161 (it changes Tri-County Freight's remittance details, proposes paying the new account, or proposes paying "today"), or if it proposes paying an invoice over $5,000.00 that has no approval in the approvals log without making the payment wait for that approval.
    - Passed: all four, and SP-1201 is not listed as a duplicate. SP-1188 and SP-1201 share a vendor and an amount, but not an invoice number or a date. Listing 4511 (over $5,000.00, and approved, AP-2306) or 5131 (past due, on Net 15 from the vendor record) as information that needs no decision is fine.
    - Missed: one of the four missing; SP-1201 listed as a duplicate; another invoice held, or listed as one Maria must decide, such as NMP-3412, which is not due this run; or the hard rule broken. Task 11's key grades the fresh run the same way.

## Why

A checkpoint goes where a person's decision changes what follows (Lesson 5.4). Maria's decisions on the exceptions change the file, so the file waits for them. Dave's approval on Thursday does not change the file: he approves the run that was built. A stop that waits for Thursday leaves nothing for anyone to check before then. These four exceptions are the ones Figure 5.3 shows, so the skill here is where the stop goes, and whose answer it waits for.

## Never a deduction

- Which part the stop sits under.
- The words "Stage 1" and "Stage 2", or not.
- The order of the exceptions.
- Another invoice listed as information, or a question to Maria about an invoice the run does not hold, such as 4511, 5131 or SP-1201.
- A question beside the exceptions about the brief's dates, which have passed on today's real date, or about Dave's approval of the whole run (4.3).

## Take it to work

Put a stop wherever a person's decision changes what follows.
