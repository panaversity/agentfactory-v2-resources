"""Lab 20, Task 10: Chapter 16's triage skill, served over MCP by the Python connector, with the same
name, files, sizes and fingerprints as the TypeScript connector, and its plain-tool fallback."""

from __future__ import annotations

import hashlib
import json

from brightline_ap.screen_and_skills import REPO
from tests.test_connector import call, copy, rpc
from tests.tokens import sign

LUIS = sign({"tenant": "org_cedar", "sub": "u_test_luis"})


def test_skills_list_one_skill_with_both_files_and_their_fingerprints() -> None:
    with copy() as c:
        listed = rpc(c, "skills/list", {}, token=LUIS).json()["result"]["skills"]
        got = rpc(c, "skills/get", {"uri": "skill://brightline-invoice-triage/SKILL.md"}, token=LUIS).json()["result"]["skill"]
        rules = rpc(c, "resources/read", {"uri": "skill://brightline-invoice-triage/references/rules.md"}, token=LUIS,
                    extra={"mcp-name": "skill://brightline-invoice-triage/references/rules.md"}).json()["result"]["contents"][0]
    assert len(listed) == 1 and listed[0] == got
    assert got["frontmatter"]["name"] == "brightline-invoice-triage"
    files = {f["uri"]: f for f in got["resources"]}
    assert list(files) == ["skill://brightline-invoice-triage/SKILL.md", "skill://brightline-invoice-triage/references/rules.md"]
    on_disk = (REPO / "plugin" / "skills" / "invoice-triage" / "references" / "rules.md").read_bytes()
    assert rules["text"].encode() == on_disk
    assert files["skill://brightline-invoice-triage/references/rules.md"]["digest"] == "sha256:" + hashlib.sha256(on_disk).hexdigest()


def test_the_plain_tool_returns_the_instructions_and_says_it_has_no_manifest_check() -> None:
    with copy() as c:
        tools = {t["name"]: t for t in rpc(c, "tools/list", {}, token=LUIS).json()["result"]["tools"]}
        result = call(c, "brightline_invoice_triage", {}, token=LUIS)
    assert "no manifest check" in tools["brightline_invoice_triage"]["description"]
    assert "The rules are in `references/rules.md`." in json.loads(result["content"][0]["text"])["instructions"]
