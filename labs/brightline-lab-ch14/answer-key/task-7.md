# Lab 14 answer key: Task 7. Call the API by hand

The answers for Task 7 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Each call takes about 300 milliseconds, because the sample API waits on purpose.

| Call | Status | Body |
| --- | --- | --- |
| `curl -i http://localhost:4010/vendors` | `HTTP/1.1 401 Unauthorized` | `{"error":"Missing or wrong X-API-Key header"}` |
| The same, with your key | `HTTP/1.1 503 Service Unavailable` | `{"error":"Busy, try again"}` |
| The same, again | `HTTP/1.1 200 OK` | `{"vendors":[...]}`, the 8 vendors from V001 Midwest Packaging Co. to V008 Cardinal Forklift Service |
| `"...invoices?status=open&page=2"` | `HTTP/1.1 200 OK` | Five invoices, first INV-8306 with `"dueDate":"2027-03-08"`, then INV-8307, INV-8308, INV-8310 and INV-8311, and `"page":2,"pages":3` |
| `"...invoices?status=open&page=9"` | `HTTP/1.1 400 Bad Request` | `{"error":"page must be a whole number from 1 to 3"}` |

Every answer has the header `Content-Type: application/json`.

**Why the 503 comes on the second call.** The API checks the key before it counts a `/vendors` call. The call without a key never gets that far, so the first call with the key is the API's first `/vendors` call, and it answers `503` once. Ask the agent to restart the API to see it again.

**Why page 2 starts at INV-8306.** There are 13 open invoices, five to a page: INV-8301 to INV-8305 on page 1, INV-8306 to INV-8311 on page 2 (INV-8309 is paid), and INV-8312, INV-8314 and INV-8315 on page 3. Page 9 does not exist, so the request itself is wrong: `400`, and a retry would not help.

`git log -p -S "<your key>" --oneline` prints nothing, because `.env` is in `.gitignore` and was never committed. If it prints a commit, the key is in your history: see "If something goes wrong" on the lab page.
