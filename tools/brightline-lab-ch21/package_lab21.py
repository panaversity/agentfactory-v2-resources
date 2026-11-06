"""Package Lab 21 around brightline-ap/: the answer key, its finished files, the READMEs and docs/chapter-21/.

    python3 -I package_lab21.py <labs/brightline-lab-ch21> <his answer-key/expected.md> <knowledge/.../agent-sdks>

- answer-key/expected.md: his, with one Brightline's numbers, our Lab 20's command names, and the page's count.
- answer-key/files/: what the reader's repository holds at tag ch21 that it did not at lab21-start, as Lab 22
  reads it: docs/sdk-map.md (every task, finished: 21.2's first column, the reference page's finished table,
  and 21.9's list) and ports/ch21.md (every task, filled in as an example).
- answer-key/task-<n>.md: one key per task: the page's expected answer (expected_answers.json, moved off the
  page by the book's Gate 2 change), and his expected result for the task.
- README.md, answer-key/README.md, and brightline-ap/docs/chapter-21/ (the pages as text, as Lab 20's).
LAB.md is copied by the make-lab skill's copy-lab-page.py.
"""
import json
import pathlib
import re
import shutil
import sys

HERE = pathlib.Path(__file__).resolve().parent
LAB, HIS_KEY, PAGES = (pathlib.Path(a) for a in sys.argv[1:4])
AP, KEY = LAB / "brightline-ap", LAB / "answer-key"
FILES = KEY / "files"


def put(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def once(t, old, new):
    assert t.count(old) == 1, old[:70]
    return t.replace(old, new)


# ---- answer-key/expected.md -------------------------------------------------------------------
exp = HIS_KEY.read_text()
for a, b in [
    ('"Seen" means the authors saw it in their offline run (real SDKs, real harness, real practice connector, stand-in model). "(run)" cells are to be filled at the authors\' live run. Stream file names in `authors/streams/` use the task numbers below.',
     '"Seen" means seen in the offline run (real SDKs, real harness, real practice connector, stand-in model): the authors\', then ours on November 6, 2026, on our Lab 20 with one Brightline\'s data (`tools/brightline-lab-ch21/simulate_lab21.sh` in the labs repository, whose stream files use the task numbers below). "(run)" cells are to be filled at the live run.'),
    ("`npm test` 47 and `npm run test:py` 35 with both labs", "Lab 20's `npm run test:loop` 32 and `npm run test:loop:py` 22 still pass"),
    ("| 2 | Twelve filled rows,", "| 2 | Thirteen filled rows,"),
    ("Allow INV-5102 with reason", "Allow INV-8316 with reason"),
    ("approve INV-5102 (flag written)", "approve INV-8316 (flag written)"),
    ("On the small-repairs question:", "On the question about an invoice with no purchase order:"),
]:
    exp = once(exp, a, b)
assert "INV-51" not in exp and "small-repairs" not in exp
put(KEY / "expected.md", exp)
rows = {}
for line in exp.splitlines():
    m = re.match(r"^\| (\d+)(?: \(optional\))? \| (.*?) \| (.*?) \| (.*?) \|$", line)
    if m:
        rows[m.group(1)] = (m.group(2), m.group(3))
assert len(rows) == 16, len(rows)

# ---- answer-key/files/docs/sdk-map.md -------------------------------------------------------
def table(text, header):
    lines = text.splitlines()
    i = lines.index(header)
    out = []
    for l in lines[i + 2:]:
        if not l.startswith("|"):
            break
        out.append([c.strip() for c in l.strip("|").split(" | ")])
    return out

plain = lambda s: s.replace("**", "")
first = {r[0]: r[1] for r in table((PAGES / "the-map.md").read_text(),
                                     "| The line of your Chapter 20 loop | What it did | The first SDK | The second SDK |")}
done = {r[0]: (r[1], r[2]) for r in table((PAGES / "reference.md").read_text(),
                                           "| The line of your Chapter 20 loop | The first SDK | The second SDK |")}
template = (AP / "docs/sdk-map.md").read_text()
filled = template
for row, (c1, c2) in done.items():
    did = first.get(row, "Nothing: in Chapter 20, done was the model's own stop" if row == "What counts as done" else None)
    assert did is not None, row
    name = row if row != "What counts as done" else "What counts as done (add in Task 10)"
    filled = once(filled, f"| {name} | | | |", f"| {name} | {plain(did)} | {c1} | {c2} |")
leaves = {
    "A process, and for some SDKs a disk": "the first SDK starts its harness as a subprocess, so the worker needs a process that stays alive and a disk (`query()` in `src/sdk/claude-agent.ts`).",
    "A container and a sandbox": "every built-in tool is off (`tools: []` in `claudeOptions()`), and in production the worker runs in a container (Chapter 22).",
    "What the process inherits": "no settings files, only the named servers, and a short list of variables (`settingSources: []`, `strictMcpConfig: true`, `workerEnv()`).",
    "Credentials": "the builder's key and a short-lived test token in `.secrets/`, read by `scripts/sdk-ask.ts`; Chapter 22 gives each person their own token.",
    "Where transcripts and traces live": "session files off (`persistSession: false`) and tracing off (`setTracingDisabled`), and I know which folders to check.",
    "Cost and time": "the first SDK's budget cap (`maxBudgetUsd`), and my own time limit in both (`abortController`, `signal`).",
    "Upgrades": "every package pinned to one exact version, in `package.json` and `py/pyproject.toml`.",
    "What counts as done": "my guardrail on the second SDK (`mustCite`), and my own rule-2 check after the first SDK's run.",
}
for k, v in leaves.items():
    filled = once(filled, f"- {k}:\n", f"- {k}: {v}\n")
put(FILES / "docs/sdk-map.md", filled)

# ---- answer-key/files/ports/ch21.md ----------------------------------------------------------
answers = json.loads((HERE / "expected_answers.json").read_text())
cap = lambda s: s[:1].upper() + s[1:]
rec = ["# Lab 21 record", "",
       "One entry per task: the task, your prediction (written before the run), what happened, and anything that surprised you. "
       "This one is an example, filled in from the answer key: yours will be in your own words, with what your model did.", ""]
for n in map(str, range(16)):
    rec += [f"## Task {n}", f"Prediction: {cap(answers[n]) if n in answers else 'none asked.'}",
            f"What happened: {rows[n][0]}.", ""]
rec += ["## Task 6, my rule for flag_invoice, in plain words (before reading the code)",
        "flag_invoice may run only for one invoice, named as INV- and four digits, with a reason of at least ten characters. Every other tool the worker may not run is denied, with a message the model can read.", "",
        "## Task 10, my rule for every answer, in plain words (before reading the code)",
        "Every answer cites the policy line it rests on, as (file.md:N). An answer with no citation is not handed to Ana.", "",
        "## Task 12, what Brightline would have to agree to before tracing a real run",
        "That questions, tool arguments and tool results, with invoice numbers and amounts, may be sent to the provider's dashboard and kept there.", "",
        "## Task 14, what the open model did differently",
        "Record what yours did: the tool calls, whether the arguments parsed, and the last line of each of the three runs.", ""]
put(FILES / "ports/ch21.md", "\n".join(rec))

# ---- answer-key/task-<n>.md -------------------------------------------------------------------
HEAD = ("For you, after the task. Open it in a text editor, never in the agent. Every live result here is what each "
        "SDK's documentation and the offline run lead us to expect: nobody has run it live yet, so if your run "
        "differs, your run is the evidence, and you write what you saw in `ports/ch21.md`. The offline results, the "
        "type checks, the tests, and both SDKs' runs against the practice connector with a stand-in model, were "
        "checked on macOS on November 6, 2026.")
NOTES = {
    "2": "Compare your first column with `answer-key/files/docs/sdk-map.md`. Your words will differ.",
    "15": ("Compare your table with `answer-key/files/docs/sdk-map.md`, which is the reference page's finished table, "
           "and your record with `answer-key/files/ports/ch21.md`. Your wording will differ."),
}
for old in KEY.glob("task-*.md"):
    old.unlink()
for n in map(str, range(16)):
    body = []
    if n in answers:
        body.append(f"**Your prediction, if it matched:** {cap(answers[n])}")
    body.append(f"**What a good run shows:** {rows[n][0]}.")
    body.append(f"**Seen in the offline run:** {rows[n][1]}.")
    if n in NOTES:
        body.append(NOTES[n])
    put(KEY / f"task-{n}.md", f"# Lab 21, Task {n}: answer key\n\n{HEAD}\n\n" + "\n\n".join(body) + "\n")

# ---- READMEs ----------------------------------------------------------------------------------
put(KEY / "README.md", """# Lab 21 answer key

For the reader and the course team only. **Never give these files to a coding agent**: an agent that reads the answer stops reasoning and starts copying.

| File | For |
| --- | --- |
| `expected.md` | Each task's expected result, and what the offline run showed. Every live result is what the documentation leads us to expect, not yet seen in a live run |
| `files/` | What the repository holds at tag `ch21` that it did not at `lab21-start`, at the same paths: `docs/sdk-map.md` (the mapping table, finished) and `ports/ch21.md` (every task, filled in as an example) |
| `task-*.md` | One key per task, also a separate download, linked from the task in `LAB.md` |
""")
put(LAB / "README.md", """# Lab 21 files

These files go with Lab 21 of The AI Agent Factory: the same AP worker on two agent SDKs.

- `brightline-ap/` is the repository at the end of Lab 20, with no git history, plus the lab's starting files: the worker on a tool runner and on both agent SDKs, in TypeScript (`src/sdk/`) and Python (`py/brightline_ap/sdk/`), its rules (`policy.ts`, `policy.py`), the scripts that ask (`npm run sdk`, `npm run sdk:py`), the offline tests, the worker's instructions (`prompts/ap-worker-sdk.v1.md`), its portable specification (`docs/worker-spec.md`), the mapping table you fill in (`docs/sdk-map.md`), and `docs/chapter-21/`, the chapter's concepts and reference page as text files for coding agents. Task 0 starts its git history.
- `LAB.md` is a copy of the lab steps.
- `answer-key/` holds what each task should show, and `files/`, what the repository holds at tag `ch21` that it did not at the start. Never give it to an agent.
- Each task's answer key is a separate download, linked from the task in `LAB.md`. Open a key in a text editor only, never in the agent.

Lab 21 uses Lab 20's practice connector and data unchanged: one Brightline, Lab 19's rows and three invoices entered since, INV-8316 to INV-8318.

Today in the lab is Thursday, April 1, 2027. The people and companies are invented. Your API keys are made by you, in each provider's own dashboard, and go only into `.secrets/`, which git ignores.

You need Node.js 22.19 or later, Python 3.12 or later with uv 0.11 or later, git, a GitHub account with `gh`, and a coding agent (the lab uses Claude Code, Codex and OpenCode). Every test runs offline, with no key. The live steps need your Claude Console and OpenAI API accounts from Lab 20, each with a spending limit. The port to an open model needs Ollama and its small model, as in Lab 20.
""")

# ---- brightline-ap/docs/chapter-21/ -----------------------------------------------------------
OUT = AP / "docs/chapter-21"
DOCHEAD = "From *The AI Agent Factory*, Chapter 21, for the coding agents working in this repository. The chapter itself is the source.\n\n"


def body(p):
    t = p.read_text(); fm, b = t[4:].split("\n---\n", 1)
    title = re.search(r'^title: "?(.*?)"?$', fm, re.M).group(1)
    b = re.sub(r"^!\[.*\]\(.*\)\s*$\n?", "", b, flags=re.M)            # figures go; their captions stay
    b = re.sub(r"^\[\^[\w-]+\]:.*$\n?", "", b, flags=re.M)             # footnote definitions go
    b = re.sub(r"\[\^[\w-]+\]", "", b)                                  # and their markers
    b = re.sub(r"^\[//\]: # \"/?details\"\s*$\n?", "", b, flags=re.M)  # the folded-block markers
    b = re.sub(r"(?<!!)\[([^\]]+)\]\([^)]+\)", r"\1", b)               # links become their words
    return title, re.sub(r"\n{3,}", "\n\n", b).strip() + "\n"


shutil.rmtree(OUT, ignore_errors=True); OUT.mkdir(parents=True)
docs = []
title, b = body(PAGES / "overview.md"); (OUT / "overview.md").write_text(DOCHEAD + b)
docs.append(("overview.md", "Chapter 21, the point, its words and what you build"))
lessons = []
for p in PAGES.glob("*.md"):
    m = re.search(r'^concepts: \["(21\.\d+)"\]', p.read_text(), re.M)
    if m:
        lessons.append((int(m.group(1).split(".")[1]), m.group(1), p))
assert len(lessons) == 10, len(lessons)
for _, num, p in sorted(lessons):
    title, b = body(p)
    (OUT / f"{num}.md").write_text(DOCHEAD + f"# {title}\n\n" + b); docs.append((f"{num}.md", title))
title, b = body(PAGES / "reference.md")
(OUT / "reference.md").write_text(DOCHEAD + f"# {title}\n\n" + b)
docs.append(("reference.md", "The companion reference page, whole: the dated boxes, the words, the finished table, what the runs showed and the field guide"))
fg = b[b.index("### F0."):]
(OUT / "field-guide.md").write_text(DOCHEAD + "# The field guide, F0 to F7\n\n" + re.sub(r"^###", "##", fg, flags=re.M))
parts = re.split(r"^(### F\d\. .*)$", fg, flags=re.M)
for h, sec in zip(parts[1::2], parts[2::2]):
    n = re.match(r"### (F\d)\.", h).group(1)
    (OUT / f"{n}.md").write_text(DOCHEAD + "# " + h[4:] + "\n\n" + sec.strip() + "\n"); docs.append((f"{n}.md", "Field guide " + h[4:]))
docs.append(("field-guide.md", "The whole field guide, F0 to F7, in one file"))
readme = ["# Chapter 21, as text for coding agents", "",
          'When a prompt says "Read 21.5", open `21.5.md`. When it says "F2", open `F2.md`. These files are the chapter\'s concepts and its reference page, copied as text. The lab\'s steps are in `LAB.md`, beside this repository, and the answer key is not in the repository at all.', "",
          "| File | What it is |", "| --- | --- |"] + [f"| `{f}` | {t} |" for f, t in docs]
(OUT / "README.md").write_text("\n".join(readme) + "\n")
print(f"expected.md, 16 keys, files/ ({sum(1 for _ in FILES.rglob('*') if _.is_file())} files), READMEs, docs/chapter-21 ({len(docs)} entries)")
