// Lab 20. Task 2: the text answer, tested with no page at all. Task 3: the pointer, the page-only tool
// and the page itself. The clicks themselves are rows of the screen matrix (scripts/screen-matrix.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { connect, HANDLE_KEY, makeCopy, textOf, type Structured } from "./helpers.ts";
import { RESOURCE, sign } from "./tokens.ts";
import { claudeDomain, PAGE_URI } from "../src/screen.ts";
import { PAGE_HTML, SKILL_FILES } from "../src/bundled.ts";
import { readFileSync } from "node:fs";
import { pageFromDisk } from "../src/node.ts";

const page = pageFromDisk(); // ui/open-invoices.html, the file both connectors serve

const luis = () => sign({ tenant: "org_cedar", sub: "u_test_luis" });

test("Task 2, text first: five invoices, the handle for the next page and the count of all 16, as text", async () => {
  const c = await connect(makeCopy(), await luis());
  const r = await c.callTool({ name: "list_open_invoices", arguments: {} });
  await c.close();
  const said = JSON.parse(textOf(r)) as Structured;
  assert.equal(said.invoices.length, 5);
  assert.deepEqual(said.invoices.map((i: Structured) => i.invoice_number), ["INV-6201", "INV-6202", "INV-6203", "INV-6204", "INV-6205"]);
  assert.equal(typeof said.next_page, "string");
  assert.equal(said.total_count, 16);
  assert.ok(!/21,?329/.test(textOf(r)), "the text answer has no dollar total: the tool never had one");
});

test("Task 3: the pointer, the page-only tool, and one page with the standard's type and no outside address", async () => {
  const c = await connect(makeCopy(), await luis());
  const { tools } = await c.listTools();
  const byName = Object.fromEntries(tools.map((t) => [t.name, t]));
  assert.equal((byName.list_open_invoices._meta as Structured).ui.resourceUri, PAGE_URI);
  assert.deepEqual((byName.next_invoice_page._meta as Structured).ui.visibility, ["app"]);
  // 20.2: a screen only where the person will look or act. One tool has a page, and one tool belongs to it.
  assert.deepEqual(tools.filter((t) => (t._meta as Structured | undefined)?.ui?.resourceUri).map((t) => t.name), ["list_open_invoices", "next_invoice_page"]);
  const read = await c.readResource({ uri: PAGE_URI });
  await c.close();
  const item = read.contents[0] as Structured;
  assert.equal(item.mimeType, "text/html;profile=mcp-app");
  assert.equal(item.text, page, "the page served is the built file, ui/open-invoices.html");
  assert.equal(item._meta?.ui?.csp, undefined, "the page declares no outside address");
  assert.equal(item._meta?.ui?.domain, await claudeDomain(RESOURCE), "Claude's sandbox address, from the connector's own address");
  assert.ok(!/<script[^>]+src=|<link[^>]+href=/i.test(page), "nothing is loaded from outside the page");
  assert.ok(!page.includes(HANDLE_KEY) && !/Bearer\s+ey/.test(page), "the page holds no key and no token");
  // 20.9: the standard only. The page uses no one AI app's extras.
  assert.ok(!readFileSync(new URL("../../../ui/open-invoices.src.html", import.meta.url), "utf8").includes("window.openai"));
});

test("the Worker's copies are current: src/bundled.ts matches the page and the skill's files on disk", () => {
  assert.equal(PAGE_HTML, page, "run npm run build:ui");
  for (const [path, text] of Object.entries(SKILL_FILES))
    assert.equal(text, readFileSync(new URL(`../../../plugin/skills/${path}`, import.meta.url), "utf8"), `${path}: run npm run build:ui`);
  assert.deepEqual(Object.keys(SKILL_FILES), ["invoice-triage/SKILL.md", "invoice-triage/references/rules.md"]);
});
