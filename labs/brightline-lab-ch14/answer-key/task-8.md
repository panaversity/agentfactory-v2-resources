# Lab 14 answer key: Task 8. The async client, tests first

The answers for Task 8 of Lab 14, in Chapter 14 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** Open this file in a text editor, never in the coding agent. An agent that can read the answers is not tested by them.

Your agent's code may differ from this key in wording and layout. Compare the results and what each test checks.

## The live run

With the API running, `npm run fetch-ap` and, from `py/`, `uv run --env-file ../.env python -m brightline_ap.api_client` each print a line such as:

```text
8 vendors, 13 open invoices in 1004 ms
```

The time is about one second, from about 950 to 1,050 milliseconds on our computer. The sample API waits 300 milliseconds per answer. The three invoice pages come one after the other, about 900 milliseconds, and the vendors call runs beside them, so it adds nothing. One after the other, the client would take about 1.5 seconds on a freshly started API: two vendor calls, the `503` and its retry, then three pages. We measured 1,646 milliseconds. If the API has run since Task 7, it has already sent its one `503`, so a client that waits for the vendors first takes about 1.2 to 1.3 seconds instead. Either way, a time near one second shows the two calls running together.

## Will both clients pass against the real API?

A good prediction says no, or not for certain, and says why: the tests ran against a fake API, so they share your picture of the data, and only the real API shows what it sends.

The TypeScript client passes, because its tests start the real sample API with `createApApi` and its schema already uses camelCase. The Python client, tested against a fake that sends the snake_case names the Python code expects, fails on the first invoice:

```text
pydantic_core._pydantic_core.ValidationError: 4 validation errors for InvoiceModel
vendor_id
  Field required [type=missing, ...]
invoice_date
  Field required [type=missing, ...]
due_date
  Field required [type=missing, ...]
amount_cents
  Field required [type=missing, ...]
```

The JSON from Task 7 names those fields `vendorId`, `invoiceDate`, `dueDate` and `amountCents`. The fix is one line in each Pydantic model, so it reads camelCase from the API and snake_case from the CSV loader:

```python
model_config = ConfigDict(alias_generator=to_camel, validate_by_name=True, validate_by_alias=True)
```

`ConfigDict` comes from `pydantic`, and `to_camel` from `pydantic.alias_generators`. The tests do not change, and they still pass, because the model still accepts snake_case. If your Python fake already sent camelCase, your tests made the agent add the aliases in step 3, and the live run passed the first time. Either way is right.

## The tests

Each test fails if the behavior it names is removed. We checked this by breaking the client on purpose, in both languages: retrying a `401`, retrying a `503` more than once, running the two calls one after the other, taking the deadline out, and reading only the first page. Each break failed its own test. Before the client exists, the tests fail because `src/ap-client.ts` and `httpx` are missing: `ERR_MODULE_NOT_FOUND` in TypeScript and `No module named 'httpx'` in Python.

| What the test checks | How it fails if the behavior goes |
| --- | --- |
| Each page once, no invoice twice | It counts the page numbers the server received: exactly 1, 2 and 3 |
| One `503` retried once, a busy server given up after two | It counts the `/vendors` requests: 2 each time |
| A `401` sent only once | It counts the `/vendors` requests: 1 |
| Vendors and invoices together | It compares the arrival times of the first request of each: less than 100 milliseconds apart, against a 200-millisecond answer |
| The client's own deadline | A slow server, 500 milliseconds, and a short deadline, 100: the call must fail with a timeout |

At the end of Task 8, the reference run passes 37 TypeScript tests and 35 Python tests. Yours depend on how many you wrote.

One way to write them in TypeScript, `tests/ap-client.test.ts`:

```ts
import { test, after } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { createServer, type Server } from "node:http";
import { createApApi } from "../scripts/ap-api.ts";
import { ApiError, fetchOpenInvoices, fetchVendors, fetchVendorsAndOpenInvoices } from "../src/ap-client.ts";

const servers: Server[] = [];
// Starts a server on a free port and logs every request it receives, with the time it arrived.
async function listen(server: Server) {
  const log: { path: string; at: number }[] = [];
  server.on("request", (req) => log.push({ path: req.url ?? "", at: performance.now() }));
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  return { baseUrl: `http://localhost:${(server.address() as AddressInfo).port}`, log };
}
const start = (options: { delayMs: number; failFirstVendors: boolean }) =>
  listen(createApApi({ apiKey: "test-key", ...options }));
const count = (log: { path: string }[], prefix: string) => log.filter((r) => r.path.startsWith(prefix)).length;
after(() => {
  for (const s of servers) {
    s.closeAllConnections();
    s.close();
  }
});

test("every page is fetched once, and no invoice twice", async () => {
  const { baseUrl, log } = await start({ delayMs: 10, failFirstVendors: false });
  const invoices = await fetchOpenInvoices({ baseUrl, apiKey: "test-key" });
  const pages = log.map((r) => new URL(r.path, baseUrl).searchParams.get("page"));
  assert.deepEqual(pages, ["1", "2", "3"]);
  assert.equal(invoices.length, 13);
  assert.equal(new Set(invoices.map((i) => i.number)).size, 13);
});

test("one 503 is retried exactly once", async () => {
  const { baseUrl, log } = await start({ delayMs: 10, failFirstVendors: true });
  const vendors = await fetchVendors({ baseUrl, apiKey: "test-key" });
  assert.equal(vendors.length, 8);
  assert.equal(count(log, "/vendors"), 2);
});

test("a server that stays busy fails after two tries", async () => {
  const busy = createServer((_req, res) => res.writeHead(503).end('{"error":"Busy"}'));
  const { baseUrl, log } = await listen(busy);
  await assert.rejects(fetchVendors({ baseUrl, apiKey: "test-key" }), (err: unknown) => err instanceof ApiError && err.status === 503);
  assert.equal(count(log, "/vendors"), 2);
});

test("a wrong key fails with 401 and is not retried", async () => {
  const { baseUrl, log } = await start({ delayMs: 10, failFirstVendors: false });
  await assert.rejects(fetchVendors({ baseUrl, apiKey: "wrong" }), (err: unknown) => err instanceof ApiError && err.status === 401);
  assert.equal(count(log, "/vendors"), 1);
});

test("vendors and invoices are requested at the same time", async () => {
  const { baseUrl, log } = await start({ delayMs: 200, failFirstVendors: false });
  const { vendors, invoices } = await fetchVendorsAndOpenInvoices({ baseUrl, apiKey: "test-key" });
  assert.equal(vendors.length, 8);
  assert.equal(invoices.length, 13);
  // Each answer takes 200 ms. If the calls ran one after the other, the first invoice
  // request would arrive at least 200 ms after the vendors request.
  const first = (prefix: string) => log.find((r) => r.path.startsWith(prefix))!.at;
  assert.ok(Math.abs(first("/invoices") - first("/vendors")) < 100);
});

test("the client's own deadline stops a slow answer", async () => {
  const { baseUrl } = await start({ delayMs: 500, failFirstVendors: false });
  await assert.rejects(fetchVendors({ baseUrl, apiKey: "test-key", timeoutMs: 100 }), { name: "TimeoutError" });
});
```

`AbortSignal.timeout(2000)` on each `fetch` gives the client its deadline. When it fires, `fetch` fails with an error named `TimeoutError`, which the last test checks.

One way to write them in Python, `py/tests/test_api_client.py`. The fake API logs every request itself, and `httpx.MockTransport` puts it in place of the network:

```python
"""Tests use a fake transport in place of the network, so they need no running server."""

import asyncio
import time

import httpx
import pytest

from brightline_ap.api_client import (
    ApiError,
    fetch_open_invoices,
    fetch_vendors,
    fetch_vendors_and_open_invoices,
)

VENDOR = {"id": "V001", "name": "Midwest Packaging Co.", "terms": "Net 30"}


def invoice(number: int) -> dict[str, object]:
    # The field names this fake sends are the ones the Python code expects.
    return {
        "number": f"INV-{number}",
        "vendor_id": "V001",
        "invoice_date": "2027-02-01",
        "due_date": "2027-03-03",
        "terms": "Net 30",
        "amount_cents": 482500,
        "status": "open",
    }


class FakeApi:
    """A fake AP API that logs every request with the time it arrived."""

    def __init__(self, delay: float = 0.0, vendor_errors: tuple[int, ...] = ()) -> None:
        self.delay = delay
        self.vendor_errors = list(vendor_errors)
        self.log: list[tuple[str, str | None, float]] = []

    async def handle(self, request: httpx.Request) -> httpx.Response:
        self.log.append((request.url.path, request.url.params.get("page"), time.perf_counter()))
        await asyncio.sleep(self.delay)
        if request.url.path == "/vendors":
            if self.vendor_errors:
                return httpx.Response(self.vendor_errors.pop(0), json={"error": "Busy"})
            return httpx.Response(200, json={"vendors": [VENDOR] * 8})
        page = int(request.url.params["page"])
        numbers = range(8300 + page * 10, 8305 + page * 10)
        return httpx.Response(
            200, json={"invoices": [invoice(n) for n in numbers], "page": page, "pages": 3}
        )

    def calls(self, path: str) -> int:
        return sum(1 for p, _, _ in self.log if p == path)


def client(api: FakeApi) -> httpx.AsyncClient:
    return httpx.AsyncClient(base_url="http://ap.test", transport=httpx.MockTransport(api.handle))


def test_every_page_is_fetched_once_and_no_invoice_twice():
    api = FakeApi()

    async def run():
        async with client(api) as c:
            return await fetch_open_invoices(c)

    invoices = asyncio.run(run())
    assert [page for _, page, _ in api.log] == ["1", "2", "3"]
    assert len(invoices) == 15
    assert len({i.number for i in invoices}) == 15


def test_one_503_is_retried_exactly_once():
    api = FakeApi(vendor_errors=(503,))

    async def run():
        async with client(api) as c:
            return await fetch_vendors(c)

    assert len(asyncio.run(run())) == 8
    assert api.calls("/vendors") == 2


def test_a_server_that_stays_busy_fails_after_two_tries():
    api = FakeApi(vendor_errors=(503, 503, 503))

    async def run():
        async with client(api) as c:
            await fetch_vendors(c)

    with pytest.raises(ApiError) as err:
        asyncio.run(run())
    assert err.value.status == 503
    assert api.calls("/vendors") == 2


def test_a_401_is_not_retried():
    api = FakeApi(vendor_errors=(401, 401))

    async def run():
        async with client(api) as c:
            await fetch_vendors(c)

    with pytest.raises(ApiError) as err:
        asyncio.run(run())
    assert err.value.status == 401
    assert api.calls("/vendors") == 1


def test_vendors_and_invoices_are_requested_at_the_same_time():
    api = FakeApi(delay=0.2)

    async def run():
        async with client(api) as c:
            return await fetch_vendors_and_open_invoices(c)

    vendors, invoices = asyncio.run(run())
    assert (len(vendors), len(invoices)) == (8, 15)
    # Each answer takes 0.2 s. One after the other, the first invoice request
    # would arrive at least 0.2 s after the vendors request.
    first = {path: at for path, _, at in reversed(api.log)}
    assert abs(first["/invoices"] - first["/vendors"]) < 0.1


def test_the_clients_own_deadline_stops_a_slow_answer():
    # The deadline belongs to the client, not to this test.
    api = FakeApi(delay=0.5)

    async def run():
        async with client(api) as c:
            await fetch_vendors(c, timeout=0.1)

    with pytest.raises(TimeoutError):
        asyncio.run(run())
```

The deadline belongs to the client: `get_json` wraps each request in `asyncio.timeout(timeout)`, two seconds by default, so the test does not supply one. httpx's own `timeout` limits each wait inside a call, but it never fires with a fake transport, so a test of it would pass whatever the client did.

## The client

A client that passes these tests, in both languages:

- One function gets a path with the key in the `X-API-Key` header and a two-second deadline. On a `503`, the first time, it asks once more. On any other error status, or a second `503`, it raises an error that carries the status.
- `fetchVendors` checks the body with the vendor schema. `fetchOpenInvoices` asks for page 1, reads `pages` from the answer, asks for each later page once, and checks every invoice with the invoice schema.
- `fetchVendorsAndOpenInvoices` starts both with `Promise.all`, or `asyncio.gather` in Python, and waits for both.
- `npm run fetch-ap` is `node --env-file=.env src/ap-client.ts`.

If the concurrency test fails only on a slow computer, run it again with nothing else running. If it still fails, check that the two calls go to `Promise.all` or `asyncio.gather`, not awaited one by one.
