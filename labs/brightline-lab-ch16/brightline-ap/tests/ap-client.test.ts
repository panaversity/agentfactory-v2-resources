import { test } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { createApApi } from "../scripts/ap-api.ts";
import { fetchOpenInvoices, fetchVendors, fetchVendorsAndOpenInvoices } from "../src/ap-client.ts";

async function start(key = "test-key") {
  const server = createApApi(key);
  const seen: string[] = [];
  server.on("request", (req) => seen.push(req.url ?? ""));
  await new Promise<void>((done) => server.listen(0, done));
  const { port } = server.address() as AddressInfo;
  return { server, seen, baseUrl: `http://127.0.0.1:${port}` };
}

test("each page of open invoices is requested once, with no duplicates", async () => {
  const { server, seen, baseUrl } = await start();
  try {
    const invoices = await fetchOpenInvoices({ baseUrl, key: "test-key" });
    assert.equal(invoices.length, 13);
    assert.equal(new Set(invoices.map((i) => i.number)).size, 13);
    assert.deepEqual(seen.filter((u) => u.startsWith("/invoices")).length, 3);
  } finally {
    server.close();
  }
});

test("a first 503 is retried exactly once", async () => {
  const { server, seen, baseUrl } = await start();
  try {
    assert.equal((await fetchVendors({ baseUrl, key: "test-key" })).length, 8);
    assert.equal(seen.filter((u) => u === "/vendors").length, 2);
  } finally {
    server.close();
  }
});

test("a 401 is sent once and fails", async () => {
  const { server, seen, baseUrl } = await start();
  try {
    await assert.rejects(fetchVendors({ baseUrl, key: "wrong" }), /401/);
    assert.equal(seen.length, 1);
  } finally {
    server.close();
  }
});

test("vendors and invoices are requested together", async () => {
  const { server, seen, baseUrl } = await start();
  try {
    const both = await fetchVendorsAndOpenInvoices({ baseUrl, key: "test-key" });
    assert.equal(both.vendors.length, 8);
    assert.equal(both.invoices.length, 13);
    assert.ok(seen.indexOf("/invoices?status=open&page=1") < seen.lastIndexOf("/vendors"));
  } finally {
    server.close();
  }
});
