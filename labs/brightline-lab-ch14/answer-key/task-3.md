# Lab 14 answer key: Task 3. One report for a bad export

The answers for Task 3 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Download it only when Task 3 is done. Attach it to your message in the coding agent, and send the lab's check message with it. The agent grades each check below, with its evidence. Read the key yourself too: you have the final say.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

"My language" below means the language on the line "My language is:" in `AGENTS.md`.

## Checks

| # | Check | Passed when | Missed when |
| --- | --- | --- | --- |
| 16 | My lines came first | I wrote down the bad lines and their count before any code ran on the messy export. Ask me what I wrote | I ran it first |
| 17 | Today's code stopped at one row | Before the loader existed, Friday's list on `invoices-messy.csv` stopped with one error, about one row, and printed no list | It printed a list |
| 18 | Failing first | The tests for the loader hold my count and my lines, they failed because the loader did not exist yet, and one commit, "Failing tests for the export report", holds only tests | The commit holds other files, or the tests came after the loader |
| 19 | The report | For `invoices-messy.csv`, the loader gives the four problems in the table below, each with its line number, its invoice number and a message. For `invoices.csv`, it gives 15 good invoices and no problems | A problem is missing, an extra line is reported, or the run stops at the first problem |
| 20 | No list from a bad export | Friday's list for 2027-03-05 on `invoices-messy.csv` prints the report, with no list and no total, and the run ends as a failure: its exit code is not 0 | A list or a total is printed, or the exit code is 0 |
| 21 | The good export still works | Friday's list for 2027-03-05 on `invoices.csv` prints 8 invoices, total $19,229.53 | Another count or total |
| 22 | A blank amount | A test says that a row with a blank amount is a problem, never a zero, and it passes | There is no such test, or a blank becomes 0 |
| 23 | My tests are still mine | No test file has changed since my commit of the failing tests, unless I decided that one of my own lines was wrong and said so | A test changed without my decision |
| 24 | The commit | A commit, "One report for a bad export", holds the loader and the changed script | It is not committed |

## The four problems

| Line | Invoice | What is wrong | Who catches it |
| --- | --- | --- | --- |
| 5 | INV-8304 | The amount is -23450 | The schema |
| 7 | INV-8306 | The terms are Net 10 | The schema |
| 11 | INV-8310 | The invoice date is 2026-13-02 | The schema |
| 14 | INV-8313 | The vendor is V099, and no such vendor is on the vendor list | The check after the schema |

Line 1 is the header, so INV-8301 is on line 2. The export has 15 invoices: 11 good ones and these 4.

## What today's code did

Before the loader, the run stopped at INV-8310 alone, because a date with month 13 broke the due-date sum. It said nothing about the other three. Without that one row, it would have printed a list with INV-8304 on it at -$234.50, and a total $234.50 too low.

Line 14 is the one a schema cannot catch. A schema looks at one record at a time, and V099 has the right shape. Only a check against the vendor list can know that nobody at Brightline has that vendor.

Line 7 has a stated due date, so today's code never worked one out from its terms and never noticed them. Line 14 is paid, so it would not be on Friday's list either way. Dave asked for every problem in the file, not only the ones that reach a list.

## Never a deduction

- The words of a message, when it names what is wrong.
- The order of the four lines in the report.
- More than one problem reported for one line.
- A wrong count in my first answer, when I gave it before the run and then decided what was wrong.
