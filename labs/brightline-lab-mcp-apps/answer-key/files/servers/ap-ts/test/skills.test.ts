// Lab 20, Task 10: Chapter 16's triage skill, served over MCP with a manifest. Task 11: one changed
// line of its rules file changes exactly one fingerprint.
import { test } from "node:test";
import assert from "node:assert/strict";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { SkillsClient } from "@modelcontextprotocol/client/ext/skills";
import { connect, makeCopy, textOf, type Structured } from "./helpers.ts";
import { sign } from "./tokens.ts";
import { skillsFromDisk } from "../src/node.ts";

// From plugin/skills/ on disk, as node.ts serves it, so Task 11 can change a file and reload.
const skills = await skillsFromDisk();

const RULES = new URL("../../../plugin/skills/invoice-triage/references/rules.md", import.meta.url);
const listing = async () => {
  const c = await connect(makeCopy(undefined, { skills }), await sign({ tenant: "org_cedar", sub: "u_test_luis" }));
  const s = new SkillsClient(c);
  assert.equal(s.supported, true, "the connector declares io.modelcontextprotocol/skills");
  return { c, s, list: await s.list() };
};

test("Task 10: skills/list gives one skill under its served name, with both files in its manifest; a read checks out", async () => {
  const { c, s, list } = await listing();
  assert.equal(list.skills.length, 1);
  const skill = list.skills[0] as Structured;
  assert.equal(skill.frontmatter.name, "brightline-invoice-triage");
  assert.equal(skill.uri, "skill://brightline-invoice-triage/SKILL.md");
  assert.deepEqual(skill.resources.map((f: Structured) => f.uri), [
    "skill://brightline-invoice-triage/SKILL.md", "skill://brightline-invoice-triage/references/rules.md"]);
  const file = (await s.read(skill as never)) as Structured; // SkillsClient checks the bytes against the manifest
  assert.match(String(file.text), /^name: brightline-invoice-triage$/m);
  await c.close();
});

test("Task 10: the same instructions as a plain tool, which says it has no manifest check", async () => {
  const c = await connect(makeCopy(undefined, { skills }), await sign({ tenant: "org_cedar", sub: "u_test_luis" }));
  const { tools } = await c.listTools();
  assert.match(tools.find((t) => t.name === "brightline_invoice_triage")!.description!, /no manifest check/);
  const r = await c.callTool({ name: "brightline_invoice_triage", arguments: {} });
  await c.close();
  assert.equal(r.isError, undefined);
  assert.match(JSON.parse(textOf(r)).instructions, /The rules are in `references\/rules.md`/);
});

test("Task 11: one changed line of references/rules.md changes exactly that file's fingerprint", async () => {
  const before = (await listing()).list.skills[0].resources as Structured[];
  const kept = readFileSync(RULES);
  try {
    appendFileSync(RULES, "7. A test line, added by Task 11 and taken out again.\n");
    await skills.catalog.reload();
    const after = (await listing()).list.skills[0].resources as Structured[];
    const changed = after.filter((f, i) => f.digest !== before[i].digest).map((f) => f.uri);
    assert.deepEqual(changed, ["skill://brightline-invoice-triage/references/rules.md"]);
  } finally {
    writeFileSync(RULES, kept);
    await skills.catalog.reload();
  }
});
