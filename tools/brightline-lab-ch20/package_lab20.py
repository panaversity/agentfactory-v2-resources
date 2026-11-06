"""Package Lab 20 around brightline-ap/: the answer key, its finished files, the READMEs and docs/chapter-20/.

    python3 -I package_lab20.py <labs/brightline-lab-ch20> <his answer-key/expected.md> <knowledge/.../agent-loop-by-hand> <trace-good.jsonl>

- answer-key/expected.md: his, with the week moved (C58), our connector's inputs (C20.3) and the cut
  signature (C4).
- answer-key/files/: what the reader's repository holds at tag ch20 that it did not at lab20-start, as
  Labs 21 and 22 read it: docs/loop.md (Task 13), ports/ch20.md (every task) and ports/trace-good.jsonl
  (Task 10, from make_trace_good.sh: the real loop and connector with a stand-in model).
- answer-key/task-<n>.md: one key per task, from his expected.md and the task's "What good looks like".
- README.md, answer-key/README.md, and brightline-ap/docs/chapter-20/ (the pages as text, as Lab 19's).
LAB.md is copied by the make-lab skill's copy-lab-page.py.
"""
import importlib.util
import json
import pathlib
import re
import shutil
import sys

HERE = pathlib.Path(__file__).resolve().parent
LAB, HIS_KEY, PAGES, TRACE = (pathlib.Path(a) for a in sys.argv[1:5])
AP = LAB / "brightline-ap"
KEY = LAB / "answer-key"
spec = importlib.util.spec_from_file_location("build_lab20", HERE / "build_lab20.py")
build = importlib.util.module_from_spec(spec); spec.loader.exec_module(build)  # for week()


def put(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


# ---- answer-key/expected.md -------------------------------------------------------------------
exp = build.week(HIS_KEY.read_text())
for a, b in [
    ("| 2 | `list_open_invoices`, `vendor_id` null, `due_by` 2027-04-04 |",
     "| 2 | `list_open_invoices`, `due_on_or_before` 2027-04-04, `vendor_id` and `page` null, `page_size` 10 or null |"),
    # One Brightline (C20.1, C20.2): the ten invoices due this week may come in one call or two, and Task 10
    # asks about an invoice with no PO, po-matching.md:9 (the editor, Friday, November 6, 2026).
    ("`stop: end_turn \\| turns: 2`. Request 2: question, model entry, one result with the call's id",
     "`stop: end_turn \\| turns: 2` (`turns: 3` if the model pages). Request 2: question, model entry, one result with the call's id"),
    ("Good run cites `purchasing.md:5`.", "Good run cites `po-matching.md:9`."),
    ("| 5 | A 400 | 400 `invalid_request_error` about the thinking block, with a request id |",
     "| 5 | A 400 | 400 `invalid_request_error`, saying the `signature` in the `thinking` block is invalid, with a request id |"),
]:
    assert exp.count(a) == 1, a
    exp = exp.replace(a, b)
assert "due_by" not in exp and "2026-12" not in exp and "purchasing.md" not in exp
put(KEY / "expected.md", exp)
rows = {}
for line in exp.splitlines():
    m = re.match(r"^\| (\d+(?:, modify)?) \| ?(.*?) ?\| (.*?) \| \(run\) \|$", line)
    if m:
        rows[m.group(1)] = (m.group(2).replace("\\|", "|"), m.group(3).replace("\\|", "|"))
assert len(rows) == 16, sorted(rows)

# ---- answer-key/files/ ------------------------------------------------------------------------
FILES = KEY / "files"
shutil.rmtree(FILES, ignore_errors=True)
put(FILES / "docs/loop.md", """# The loop

The AP worker's loop, as `src/loop/claude.ts` and `py/brightline_ap/loop/claude_loop.py` run it on the first API.
`src/loop/openai.ts` and `openai_loop.py` run the same five steps on the second API.

| Step | TypeScript (`claude.ts`) | Python (`claude_loop.py`) |
| --- | --- | --- |
| The stops, checked first, before every call | lines 41 to 44 | lines 44 to 48 |
| 1. Call the model, with the whole conversation and the tools | lines 46 to 70, the call on line 58 | lines 50 to 77, the call on line 65 |
| 2. Keep everything the model said, unchanged | lines 72 to 74, line 73 pushes it | lines 78 to 80, line 79 appends it |
| 3. Check why it stopped: only "wants a tool" goes round again | lines 76 to 79, line 77 decides, line 78 returns | lines 82 to 84, line 83 decides, line 84 returns |
| 4. Run each tool it asked for, one result per call, failures included | lines 81 to 94, the tool runs on line 87 | lines 86 to 99, the tool runs on line 93 |
| 5. Return the results, before anything else in the next entry | lines 96 to 97 | lines 101 to 102 |

## The three limits

From `src/loop/config.json`, which both languages read. `beforeTurn()` in `src/loop/limits.ts` checks them in this order before every call:

| Limit | Value | Stop reason |
| --- | --- | --- |
| Turns: model calls in one run | 8 | `turn_limit` |
| Cost cap, in dollars, from the prices in `config.json` | 0.10 | `cost_cap` |
| Time for the whole run, in seconds | 120 | `time_limit` |

The cost cap is checked before a call, so the last call can cross it.

## The invariant

The model only asks. Your code decides whether to run each tool, owns the whole conversation, and decides when the loop stops.
""")
put(FILES / "ports/ch20.md", """# Lab 20 notes

One line per task: the task, the agent, your prediction, what happened, anything that surprised you.
Write each prediction BEFORE you see the result.

An example, filled in from the answer key: every "What happened" is what the documentation and the recorded
tests lead us to expect. Your own notes hold what your runs showed.

| Task | Agent | My prediction | What happened | Surprises |
| --- | --- | --- | --- | --- |
""" + "".join(
    f"| {n} | {agent} | {rows[n][0] or '(none asked)'} | {rows[n][1]} | |\n"
    for n, agent in [("0", "Claude Code"), ("1", "Claude Code"), ("2", "Claude Code"), ("3", "Claude Code"),
                     ("4", "Codex"), ("5", "Claude Code"), ("6", "Codex"), ("7", "Codex"), ("8", "Claude Code"),
                     ("9", "Claude Code"), ("10", "OpenCode"), ("11", "Claude Code"), ("12", "OpenCode")]) + """
## Request ids from Task 9

- temperature: (your run's request id)
- forced-tool: (your run's request id)
- bad-key: (your run's request id)

## Three things the stateless run showed that the stateful run did not (Task 7)

1. The question.
2. The reasoning item.
3. The function call, with its arguments.
""")
shutil.copy2(TRACE, FILES / "ports/trace-good.jsonl")

# ---- answer-key/task-<n>.md -------------------------------------------------------------------
HEAD = ("For you, after the task. Open it in a text editor, never in the agent. Every live result here is what "
        "each API's documentation leads us to expect: nobody has run it live yet, so if your run differs, your run "
        "is the evidence, and you write what you saw in `ports/ch20.md`. The offline results, the type checks, the "
        "recorded tests and the runs against the practice connector with a stand-in model, were checked on macOS "
        "on November 6, 2026.")


def pred(n):
    return f"**Your prediction, if it matched:** {rows[n][0]}." if rows[n][0] else ""


def shows(n):
    return f"**What a good run shows:** {rows[n][1]}."


KEYS = {
    "0": [pred("0"), shows("0"),
          "On macOS: `npm run typecheck` and `npm run typecheck:py` report no errors, `npm run test:loop` 32 passed, "
          "`npm run test:loop:py` 22 passed. `npm ls --depth=0` lists `@anthropic-ai/sdk@1.5.0` and `openai@7.51.0`. "
          "The connector lists four tools: `find_vendor`, `list_open_invoices`, `get_purchase_order` and `search_policy`. "
          "On route A, the load prints `staging: loaded org_brightline from data: vendors 8, invoices 18, "
          "purchase_orders 14, policy_documents 3, policy_passages 17` and its embeddings model, and "
          "`npm run token:test` prints the token's claims, never the token: `tenant` `org_brightline`, "
          "`scope` `ap:read ap:vendors.read`, and `aud` your connector's address."],
    "1": [pred("1"), shows("1"),
          "The request has `model`, `max_tokens`, `system`, `messages`, `tools`, `tool_choice` and `thinking`, and no "
          "`temperature`. The response may hold a thinking block, then a text block saying 4."],
    "2": [pred("2"), shows("2"),
          "The four descriptions in `tools/ap-tools.json` are the connector's own, word for word, on either route. "
          "All four of `list_open_invoices`' inputs are required, so the model must write null for the ones it leaves "
          "empty: that is how it says \"no vendor filter\" out loud."],
    "3": [pred("3"), shows("3"),
          "**The change, results before the model's entry:** " + rows["3, modify"][1] + ". Your prediction, if it "
          "matched: " + rows["3, modify"][0] + ".",
          "Offline, the recorded run with the practice connector ends `stop: end_turn | turns: 2`, and request 2's "
          "last entry holds one `tool_result` for `toolu_01Lab20A1`, with the ten open invoices due by Sunday, "
          "April 4 (`total_count` 10): nine past due, and INV-8316, due Friday. A live model that leaves `page_size` "
          "null gets five and a `next_page`, and asks once more: three requests, also correct."],
    "4": [pred("4"), shows("4"),
          "The answer says INV-8316 has no purchase order: the connector's error says such an invoice is held until "
          "the buyer raises one. Whether the model asked for both calls at once or one at a "
          "time, record which: both are correct."],
    "5": [pred("5"), shows("5"),
          "Line 40 stops the script when the model did not think on turn 1: run it again. Line 43 is the break: it "
          "keeps the thinking block and cuts its signature to its first 20 characters. Dropping every thinking block "
          "would not fail: the call goes through, and the model loses that reasoning. The real loop never has this "
          "problem, because line 73 of `claude.ts` (line 79 of `claude_loop.py`) pushes `response.content` exactly as "
          "it arrived."],
    "6": [pred("6"), shows("6"),
          "**The change, without the reasoning items:** " + rows["6, modify"][1] + ". Either outcome is a pass once "
          "it is recorded."],
    "7": [pred("7"), shows("7"),
          "Your three notes name at least the question, the reasoning item, and the function call with its arguments."],
    "8": [pred("8"), shows("8"),
          "On the practice connector with `PRACTICE_BROKEN=search_policy` and `--max-turns 4`, the run gets \"try "
          "again\" and stops with `stop: turn_limit | turns: 4`. A model that gives up first and says the policy tool "
          "is not working is also a pass."],
    "9": [pred("9"), shows("9"),
          "Retrying helps none of them: each is the request's own fault. If `temperature` or `forced-tool` does not "
          "fail, record it: the API may have changed since this chapter was checked."],
    "10": [pred("10"), shows("10"),
           "Compare with `answer-key/files/ports/trace-good.jsonl`: three spans, `chat claude-sonnet-5-5`, "
           "`execute_tool search_policy` with its `gen_ai.tool.call.id`, then `chat claude-sonnet-5-5`. It comes from "
           "the real loop, tracer and practice connector with a stand-in model, so its ids and timings are that "
           "run's. The broken trace has no `execute_tool` span at all."],
    "11": [pred("11"), shows("11"),
           "The tool input arrives in pieces that are not valid JSON on their own, and is parsed once, at its "
           "`content_block_stop`. If no tokens are cached, the repeated start may be shorter than the model's minimum "
           "for caching (F5): record it."],
    "12": [pred("12"), shows("12"),
           "Only the setting `openModel: true` changes. Some runs may call the wrong tool, write wrong arguments "
           "(an `ERROR:` output from the connector) or answer without a tool: record which."],
    "13": [shows("13"),
           "Compare with `answer-key/files/docs/loop.md` and `answer-key/files/ports/ch20.md`. Your wording will "
           "differ. Check that `docs/loop.md` names each of the five steps with its lines in both languages, the "
           "three limits with their values, and the invariant, and that `ports/ch20.md` has no empty prediction. "
           "`ports/trace-good.jsonl` is there for Lab 21."],
}
for old in KEY.glob("task-*.md"):
    old.unlink()
for n, body in KEYS.items():
    text = "\n\n".join(p for p in body if p)
    put(KEY / f"task-{n}.md", f"# Lab 20, Task {n}: answer key\n\n{HEAD}\n\n{text}\n")

# ---- READMEs ----------------------------------------------------------------------------------
put(KEY / "README.md", """# Lab 20 answer key

For the reader and the course team only. **Never give these files to a coding agent**: an agent that reads the answer stops reasoning and starts copying.

| File | For |
| --- | --- |
| `expected.md` | Each task's prediction and expected result. Every live result is what the documentation leads us to expect, not yet seen in a live run |
| `files/` | What the repository holds at tag `ch20` that it did not at `lab20-start`, at the same paths: `docs/loop.md` (Task 13), `ports/ch20.md` (every task, filled in as an example) and `ports/trace-good.jsonl` (Task 10), which Lab 21 compares with. The trace comes from the real loop, tracer and practice connector with a stand-in model, so its ids and timings are illustrative |
| `task-*.md` | One key per task, also a separate download, linked from the task in `LAB.md` |
""")
put(LAB / "README.md", """# Lab 20 files

These files go with Lab 20 of The AI Agent Factory: the agent loop by hand.

- `brightline-ap/` is the repository at the end of Lab 19, with no git history, plus the lab's starting files: the loop in TypeScript (`src/loop/`) and Python (`py/brightline_ap/loop/`), the four tools defined once (`tools/ap-tools.json`, from the connector's own tool list), the worker's instructions (`prompts/ap-worker.v1.md`), the scripts that ask, break, compare and stream, the practice connector (it reads `data/` and `docs/policies/`, the files route A loads in Task 0), the tests with their recorded responses, and `docs/chapter-20/`, the chapter's concepts and field guide as text files for coding agents. Task 0 starts its git history.
- `LAB.md` is a copy of the lab steps.
- `answer-key/` holds what each task should show, and `files/`, what the repository holds at tag `ch20` that it did not at the start. Never give it to an agent.
- Each task's answer key is a separate download, linked from the task in `LAB.md`. Open a key in a text editor only, never in the agent.

`data/` holds Lab 19's rows and three invoices entered since, INV-8316 to INV-8318: one Brightline for both routes.

Today in the lab is Tuesday, March 30, 2027. The people and companies are invented. Your API keys are made by you, in each provider's own dashboard, and go only into `.secrets/`, which git ignores.

You need Node.js 22.19 or later, Python 3.12 or later with uv 0.11 or later, git, a GitHub account with `gh`, and a coding agent (the lab uses Claude Code, Codex and OpenCode). Every test runs offline, with no key. The live steps need a Claude Console account and an OpenAI API account, each with a few dollars of credit and a spending limit. Route A uses your Chapter 19 staging connector, and Task 0 loads `data/` into it; route B, the practice connector, needs nothing else.
""")

# ---- brightline-ap/docs/chapter-20/ -----------------------------------------------------------
OUT = AP / "docs/chapter-20"
DOCHEAD = "From *The AI Agent Factory*, Chapter 20, for the coding agents working in this repository. The chapter itself is the source.\n\n"


def body(p):
    t = p.read_text(); fm, b = t[4:].split("\n---\n", 1)
    title = re.search(r'^title: "?(.*?)"?$', fm, re.M).group(1)
    b = re.sub(r"^!\[.*\]\(.*\)\s*$\n?", "", b, flags=re.M)            # figures go; their captions stay
    b = re.sub(r"^\[\^[\w-]+\]:.*$\n?", "", b, flags=re.M)             # footnote definitions go
    b = re.sub(r"\[\^[\w-]+\]", "", b)                                  # and their markers
    b = re.sub(r"(?<!!)\[([^\]]+)\]\([^)]+\)", r"\1", b)               # links become their words
    return title, re.sub(r"\n{3,}", "\n\n", b).strip() + "\n"


shutil.rmtree(OUT, ignore_errors=True); OUT.mkdir(parents=True)
docs = []
title, b = body(PAGES / "overview.md"); (OUT / "overview.md").write_text(DOCHEAD + b)
docs.append(("overview.md", "Chapter 20, the point, its words and what you build"))
lessons = []
for p in PAGES.glob("*.md"):
    m = re.search(r'^concepts: \["(20\.\d+)"\]', p.read_text(), re.M)
    if m:
        lessons.append((int(m.group(1).split(".")[1]), m.group(1), p))
assert len(lessons) == 14, len(lessons)
for _, num, p in sorted(lessons):
    title, b = body(p)
    (OUT / f"{num}.md").write_text(DOCHEAD + f"# {title}\n\n" + b); docs.append((f"{num}.md", title))
title, b = body(PAGES / "field-guide-agent-loop-by-hand.md")
(OUT / "field-guide.md").write_text(DOCHEAD + f"# {title}\n\n" + b)
parts = re.split(r"^(## F\d\. .*)$", b, flags=re.M)
for h, sec in zip(parts[1::2], parts[2::2]):
    n = re.match(r"## (F\d)\.", h).group(1)
    sec = re.sub(r"^###", "##", sec, flags=re.M)
    (OUT / f"{n}.md").write_text(DOCHEAD + "# " + h[3:] + "\n\n" + sec.strip() + "\n"); docs.append((f"{n}.md", "Field guide " + h[3:]))
docs.append(("field-guide.md", "The whole field guide, in one file"))
readme = ["# Chapter 20, as text for coding agents", "",
          'When a prompt says "Read 20.5", open `20.5.md`. When it says "field guide F2", open `F2.md`. These files are the chapter\'s concepts and field guide, copied as text. The lab\'s steps are in `LAB.md`, beside this repository, and the answer key is not in the repository at all.', "",
          "| File | What it is |", "| --- | --- |"] + [f"| `{f}` | {t} |" for f, t in docs]
(OUT / "README.md").write_text("\n".join(readme) + "\n")
print(f"expected.md, {len(KEYS)} keys, files/ ({sum(1 for _ in FILES.rglob('*') if _.is_file())} files), READMEs, docs/chapter-20 ({len(docs)} entries)")
