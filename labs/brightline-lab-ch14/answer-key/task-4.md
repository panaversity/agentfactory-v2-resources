# Lab 14 answer key: Task 4. Talk to the AP system

The answers for Task 4 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Download it only when Task 4 is done. Attach it to your message in the coding agent, and send the lab's check message with it. The agent grades each check below, with its evidence. Read the key yourself too: you have the final say.

Today in the lab is Wednesday, March 3, 2027. The payment run is Friday, March 5, 2027.

"My language" below means the language on the line "My language is:" in `AGENTS.md`.

## Checks

| # | Check | Passed when | Missed when |
| --- | --- | --- | --- |
| 25 | The key file | The key is in a file that git ignores, and `git log` shows the key in no commit | The key file is tracked, or the key is in a commit |
| 26 | My five codes came first | I wrote down a status code for each of the five calls before the agent made them. Ask me what I wrote | The calls came first |
| 27 | The five calls | In this session, the five calls gave the codes in the table below, in that order | Another code, or a call was not made |
| 28 | My four answers | The answers I gave match the table "What the client does". Read them from the tests, or ask me | Any answer differs |
| 29 | Failing first | There is one test for each of my four answers, and the two more the lab names. Each counts the requests the server gets. They failed because the client did not exist yet, and one commit, "Failing tests for the AP client", holds only tests | A case has no test, a test does not count requests, or the commit holds other files |
| 30 | The client passes | Every test passes, the type checker is clean, and no test file has changed since my commit of the failing tests | A test fails, or a test file changed |
| 31 | Answers are checked | The client checks every invoice in an answer with my schema from Task 2 | It uses an answer without checking it |
| 32 | The live run | Against the sample AP system, the client printed 8 vendors and 13 open invoices, in less than two seconds. The command for it is in the table in `AGENTS.md` | Other counts, or the run was not made |
| 33 | Stopped, and committed | The sample AP system is stopped, and a commit, "The AP client, from my tests", holds the client | It is still running, or the client is not committed |

## The five calls

| Call | What is asked | Code | Why |
| --- | --- | --- | --- |
| 1 | The vendors, with no key | 401 | The server does not know who is asking |
| 2 | The vendors, with your key | 503 | The server is busy. This sample server says so once, to the first vendors call with the key after each start |
| 3 | The vendors, with your key, again | 200 | The same request, a moment later, works |
| 4 | Page 2 of the open invoices | 200 | Its first invoice is INV-8306. There are 13 open invoices, 5 to a page |
| 5 | Page 9 of the open invoices | 400 | There are only 3 pages. The request itself is wrong |

If call 2 gave 200, the sample AP system had already answered a vendors call since it started. Restart it, and make the five calls again.

## What the client does

| Answer from the AP system | Try again, or stop? | Requests in all | Dave's words |
| --- | --- | --- | --- |
| 401, the key is refused | Stop | 1 | "When it refuses our key, never try again" |
| 503, the server is busy | Try once more | 2 | "When the server says it is busy, try once more" |
| 400, the request is wrong | Stop | 1 | He said nothing. The same request would get the same answer |
| No answer in two seconds | Stop | 1 | "Give each call two seconds." He did not ask for another try |

A server that stays busy gets two requests, and then the client stops with an error. "Once more" is one more, not until it works.

## The live run

8 vendors and 13 open invoices. Each answer takes about a third of a second. The three pages of invoices take about one second when they are asked for one after another, and the vendors call runs during that time. One after the other, the four calls would take longer.

**If the tests passed and the live run was refused.** The sample AP system names its fields `vendorId`, `invoiceDate`, `dueDate` and `amountCents`. A schema that expects `vendor_id` refuses every invoice, and a fake server written inside a test can hide that, because the test's author chose its field names. The fix is the client's: read the names the AP system really sends. A test changes only if you decide its fake server was wrong.

## Never a deduction

- A wrong code among my five, when I wrote it before the calls.
- The time of the live run, when it is under two seconds.
- In Python, the one package `httpx`, when its name was checked first.
- Pages 2 and 3 asked for together or one after another.
