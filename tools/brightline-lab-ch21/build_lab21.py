"""Build Lab 21's starting folder on our Lab 20's end state.

    python3 -I build_lab21.py base <labs/brightline-lab-ch20> <out brightline-ap>
    python3 -I build_lab21.py overlay <his brightline-lab-ch21/brightline-ap> <out brightline-ap>

base:    our released Lab 20 folder's brightline-ap/, with its answer-key/files/ laid over it: Lab 20's end
         state, as a reader who finished it has it (tag ch20).
overlay: the editor-in-chief's Lab 21 files. His zip is an overlay on his own ch20; this folder is ours with
         Lab 21 in it, so Task 0 commits it and tags lab21-start, as Labs 16 to 20 do. On his files:
         - the week moved as C58 (his story date, Thursday, December 3, 2026, is Thursday, April 1, 2027),
           and Ana Torres as Ana Morales, Brightline's AP analyst;
         - one Brightline, from the Chapter 20 session's final map (the editor, Friday, November 6, 2026):
           his INV-5102, the $389 bill with no PO, is INV-8316, and the guardrail's examples cite
           Brightline's own policy lines (po-matching.md:5 and :9), as the book's Task 10 does;
         - Gate 1's review, decided Friday, November 6, 2026: CLAUDE_CODE_DISABLE_AUTO_MEMORY in the worker's
           environment in both languages, the permission-mode comment, and the Python script printing each
           request's store, include and previous_response_id (Task 4);
         - the approval comment says the run pauses, as OpenAI's human-in-the-loop guide does.
         - ports/ch21.md names Task 6 for the permission rule, where the lab writes it (his said Task 5).
         Then the files both repositories have come from merged/ (make_merged.py).

His files that do not come over as they are:
  - package-lock.json: made again by npm from the merged package.json
  - py/requirements.txt: his two pins go into Lab 20's uv project (py/pyproject.toml, py/uv.lock)
  - LAB21-START-REQUIRES.md: his note for laying the zip over tag ch20, which this folder already is
  - .secrets/README.txt: Lab 20 tracks no .secrets/, which git ignores
  - docs/chapter-21/: written from the book's pages by package_lab21.py
  - tests/sdk.test.ts: renamed tests/sdk.spec.ts, as Lab 20 renamed its vitest files
  - pyrightconfig.sdk.json: moved to py/, with its paths from there, as Lab 20's pyrightconfig.loop.json
"""
import pathlib
import shutil
import sys

HERE = pathlib.Path(__file__).resolve().parent
NOT_COPIED = {"package-lock.json", "py/requirements.txt", "LAB21-START-REQUIRES.md", ".secrets/README.txt",
              "pyrightconfig.sdk.json"}
NOT_COPIED_PREFIX = ("docs/chapter-21/",)
MERGED = {".gitignore", "AGENTS.md", "README.md", "package.json", "py/pyproject.toml", "tsconfig.json"}
RENAMED = {"tests/sdk.test.ts": "tests/sdk.spec.ts"}

FLAG_FIX = [("Pay it on the due date (payments.md:2).", "Pay it once it matches its PO (po-matching.md:5)."),
            ("Small repairs may be paid without a PO (purchasing.md:5).",
             "An invoice with no PO is held until the buyer raises one (po-matching.md:9)."),
            ("See purchasing.md line 5.", "See po-matching.md line 9."),
            ("INV-5102", "INV-8316")]
EDITS = {
    "prompts/ap-worker-sdk.v1.md": [
        ("for Ana Torres, the AP lead.", "for Ana Morales, Brightline's AP analyst."),
        ('Today is Thursday, December 3, 2026. "This week" means up to Sunday, December 6.',
         'Today is Thursday, April 1, 2027. "This week" means up to Sunday, April 4.')],
    "docs/worker-spec.md": [("for Ana Torres,", "for Ana Morales,")],
    "src/sdk/policy.ts": [("such as INV-5102,", "such as INV-8316,")],
    "py/brightline_ap/sdk/policy.py": [("such as INV-5102,", "such as INV-8316,")],
    "tests/sdk.test.ts": FLAG_FIX,
    "py/tests/test_sdk.py": [p for p in FLAG_FIX if not p[0].startswith("Small repairs")],
    "src/sdk/claude-agent.ts": [
        ('return { ...picked, CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1" }; // asks the harness to send no nonessential traffic (21.8)',
         'return { ...picked, CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1", CLAUDE_CODE_DISABLE_AUTO_MEMORY: "1" }; // no nonessential traffic (21.8), no auto memory (21.9)'),
        ('permissionMode: "default", // say it: left out, the mode comes from settings or a classifier (21.5)',
         'permissionMode: "default", // say it: left out, the mode comes from settings files or the harness\'s own default (21.5)')],
    "py/brightline_ap/sdk/claude_agent.py": [
        ('"CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"}', '"CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1", "CLAUDE_CODE_DISABLE_AUTO_MEMORY": "1"}'),
        ('permission_mode="default",  # say it: left out, the mode comes from settings or a classifier (21.5)',
         'permission_mode="default",  # say it: left out, the mode comes from settings files or the harness\'s own default (21.5)')],
    "src/sdk/openai-agent.ts": [("// A tool that needs approval ends the run and hands the call back.",
                                 "// A tool that needs approval pauses the run and hands the call back.")],
    "py/brightline_ap/sdk/openai_agent.py": [("# A tool that needs approval ends the run and hands the call back.",
                                             "# A tool that needs approval pauses the run and hands the call back.")],
    "tsconfig.sdk.json": [('"tests/sdk*.test.ts"', '"tests/sdk*.spec.ts"')],
    "ports/ch21.md": [("## Task 5, my rule for flag_invoice", "## Task 6, my rule for flag_invoice")],
    "py/brightline_ap/sdk_ask.py": [
        ("from .sdk.tool_runner import ask_with_tool_runner\n",
         "from .sdk.tool_runner import ask_with_tool_runner\n\n\n"
         "def show_requests() -> None:\n"
         "    # Task 4: each request's store, include and previous_response_id, as the second SDK sends them.\n"
         "    # Its Python package prints no request body of its own (F3), so the default client prints these three.\n"
         "    from agents import set_default_openai_client\n"
         "    from openai import AsyncOpenAI\n\n"
         "    client = AsyncOpenAI()\n"
         "    create = client.responses.create\n\n"
         "    async def logged(**kw: Any) -> Any:\n"
         "        def plain(v: Any) -> Any:\n"
         "            return None if type(v).__name__ in (\"NotGiven\", \"Omit\") else v\n"
         "        print(f\"request: store={plain(kw.get('store'))} include={plain(kw.get('include'))} \"\n"
         "              f\"previous_response_id={plain(kw.get('previous_response_id'))}\")\n"
         "        return await create(**kw)\n\n"
         "    setattr(client.responses, \"create\", logged)\n"
         "    set_default_openai_client(client, use_for_tracing=False)\n"),
        ("from pathlib import Path\n", "from pathlib import Path\nfrom typing import Any\n"),
        ("        is_open = a.sdk == \"open\"\n",
         "        is_open = a.sdk == \"open\"\n        if not is_open:\n            show_requests()\n")],
}
PYRIGHT_SDK = """{
  "include": ["brightline_ap/sdk", "brightline_ap/sdk_ask.py"],
  "typeCheckingMode": "standard",
  "venvPath": ".",
  "venv": ".venv"
}
"""


def base(lab20: pathlib.Path, out: pathlib.Path) -> None:
    if out.exists():
        shutil.rmtree(out)
    shutil.copytree(lab20 / "brightline-ap", out)
    files = lab20 / "answer-key" / "files"
    for f in sorted(files.rglob("*")):
        if f.is_file():
            dst = out / f.relative_to(files)
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(f, dst)
            print("from Lab 20's answer key:", f.relative_to(files))


def overlay(his: pathlib.Path, out: pathlib.Path) -> None:
    done = set()
    for f in sorted(his.rglob("*")):
        rel = f.relative_to(his).as_posix()
        if not f.is_file() or rel in NOT_COPIED or rel in MERGED or rel.startswith(NOT_COPIED_PREFIX):
            continue
        text = f.read_text(encoding="utf-8")
        for old, new in EDITS.get(rel, []):
            assert old in text, (rel, old[:60])
            text = text.replace(old, new)
        done.add(rel)
        dst = out / RENAMED.get(rel, rel)
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_text(text, encoding="utf-8")
    assert set(EDITS) <= done, set(EDITS) - done
    (out / "py" / "pyrightconfig.sdk.json").write_text(PYRIGHT_SDK, encoding="utf-8")
    merged = HERE / "merged"
    for rel in sorted(MERGED):
        shutil.copyfile(merged / rel, out / rel)
    print(f"overlay: {len(done)} of his files, {len(MERGED)} merged")


if __name__ == "__main__":
    {"base": base, "overlay": overlay}[sys.argv[1]](pathlib.Path(sys.argv[2]), pathlib.Path(sys.argv[3]))
