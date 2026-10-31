# Lab 14 answer key: Task 9. Read SDK-shaped code

The answers for Task 9 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

## The shapes

`exercises/sdk-shaped/ap-sdk.ts`:

| Line | Shape |
| --- | --- |
| 5 | A wrapper function, `withRetry`, used in place of a decorator |
| 15 | The client class, `ApClient` |
| 24 | An async method, private (`#get`) |
| 30 | A field holding a wrapped async method (`vendors = withRetry(...)`) |
| 32 | An async generator (`async *openInvoices`) |
| 35 | `yield*` hands out each invoice of a page |
| 40 | The method that makes `await using` work (`[Symbol.asyncDispose]`) |
| 46 | The context manager in use (`await using`) |
| 49 | The async loop (`for await`) |

`exercises/sdk-shaped/ap_sdk.py`:

| Line | Shape |
| --- | --- |
| 15 | A decorator, defined (`retry_once`) |
| 26 | The client class, `ApClient` |
| 30, 33 | The two methods that make `async with` work (`__aenter__`, `__aexit__`) |
| 37 | The decorator in use (`@retry_once`) |
| 38 | An async method (`vendors`) |
| 42, 47 | An async generator (`open_invoices`), and its `yield` |
| 54 | The context manager in use (`async with`) |
| 56 | The async loop (`async for`) |

## The run, and the first 503

Run against a freshly started API, the Python sample prints `8 vendors`, then the 13 open invoices from `INV-8301 482500` to `INV-8315 132500`, then `client closed`.

The first `/vendors` call gets `503`. Line 40 raises an error for it with `raise_for_status()`, and the decorator applied on line 37, defined on line 15, catches that error on line 20 and calls the method once more, on line 21. The second call gets `200`.

**Which line runs when each client's block ends.** In Python, line 33, `__aexit__`, runs when the `async with` block that starts on line 54 ends. It really closes the httpx client, with `aclose()`, then prints `client closed`. In TypeScript, line 40, `[Symbol.asyncDispose]`, runs when the block holding `await using` on line 46 ends, which is the end of `main`. It only prints `client closed`, and closes nothing.

## The weaknesses

**The retry on a 401.** Both samples retry more than Concept 14.7 allows. The TypeScript `withRetry` catches every error with an empty `catch`, and the Python `retry_once` catches every `HTTPStatusError`. So a `401`, a wrong key, is sent twice, and so is a `400`. We checked: with a wrong key, each sample sends two requests before it gives up. A good note says: retry only on `503` (and perhaps a timeout), once, and let every other error through at once. An empty `catch` that retries is the shape Concept 14.5 says to question first.

A good list for step 4 has at least four of these:

| File and line | Weakness | What to ask the authors for |
| --- | --- | --- |
| `ap-sdk.ts` 5 to 13, `ap_sdk.py` 15 to 23 | Retries on every error, including `401` and `400` | Retry only on `503`, once |
| `ap-sdk.ts` 25, `ap_sdk.py` 28 | No deadline: `fetch` has no signal, and the httpx client has only its default five-second wait timeouts, no limit on the whole call | A deadline on every call, such as `AbortSignal.timeout(2000)` or `asyncio.timeout(2)` |
| `ap-sdk.ts` 24 and 27, `ap_sdk.py` 38 and 42 | Answers come back as `any` or `dict[str, Any]`, with no schema | Check each answer with a schema, as in Concept 14.4, and return typed records |
| `ap_sdk.py` 45 | Reads each page's body with no `raise_for_status()`, so an error page is read as data | Check the status before reading the body |
| `ap-sdk.ts` 40 | `Symbol.asyncDispose` only prints. It closes nothing | Fine for a sample, because `fetch` holds nothing open. A real client must close its connections there |

The Python `__aexit__` on line 33 does close the httpx client, so it is not a weakness.
