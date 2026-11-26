"""Copy Chapter 21's pages into Lab 21's brightline-ap/docs/chapter-20/, as text for the coding agents.

    python3 -I sync_docs_20.py <knowledge/building-ai-workers/agent-loop-by-hand> <labs/brightline-lab-ch20>
    python3 -I sync_docs_20.py <pages> <lab> --check     exit 1, listing the files that differ

The same text package_lab20.py first wrote, with the book's renumbering (the chapter is 21, its files keep
their old names, 20.N.md): figures go and their captions stay, footnotes go, and links become their words.
Run it after any change to the chapter's concepts, overview or field guide, in the same pull request as LAB.md.
"""
import json
import pathlib
import re
import sys

PAGES, LAB = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
CHECK = "--check" in sys.argv[3:]
OUT = LAB / "brightline-ap/docs/chapter-20"
DOCHEAD = ("From *The AI Agent Factory*, Chapter 21, for the coding agents working in this repository. "
           "The chapter itself is the source.\n\n")


def front(text):
    head, body = text[4:].split("\n---\n", 1)
    return head, body


def title_of(head):
    v = re.search(r"^title: (.*)$", head, re.M).group(1).strip()
    return json.loads(v) if v.startswith('"') else v


def body(p):
    head, b = front(p.read_text())
    b = re.sub(r"^!\[.*\]\(.*\)\s*$\n?", "", b, flags=re.M)            # figures go; their captions stay
    b = re.sub(r"^\[\^[\w-]+\]:.*$\n?", "", b, flags=re.M)             # footnote definitions go
    b = re.sub(r"\[\^[\w-]+\]", "", b)                                  # and their markers
    b = re.sub(r"(?<!!)\[([^\]]+)\]\([^)]+\)", r"\1", b)               # links become their words
    return title_of(head), re.sub(r"\n{3,}", "\n\n", b).strip() + "\n"


files = {}
docs = []
_, b = body(PAGES / "overview.md")
files["overview.md"] = DOCHEAD + b
docs.append(("overview.md", "Chapter 21, the point, its words and what you build"))
lessons = []
for p in PAGES.glob("*.md"):
    m = re.search(r'^concepts: \[ ?"21\.(\d+)" ?\]', p.read_text(), re.M)
    if m:
        lessons.append((int(m.group(1)), p))
assert len(lessons) == 14, len(lessons)
for n, p in sorted(lessons):
    title, b = body(p)
    files[f"20.{n}.md"] = DOCHEAD + f"# {title}\n\n" + b
    docs.append((f"20.{n}.md", title))
title, b = body(PAGES / "field-guide-agent-loop-by-hand.md")
files["field-guide.md"] = DOCHEAD + f"# {title}\n\n" + b
parts = re.split(r"^(## F\d\. .*)$", b, flags=re.M)
for h, sec in zip(parts[1::2], parts[2::2]):
    n = re.match(r"## (F\d)\.", h).group(1)
    sec = re.sub(r"^###", "##", sec, flags=re.M)
    files[f"{n}.md"] = DOCHEAD + "# " + h[3:] + "\n\n" + sec.strip() + "\n"
    docs.append((f"{n}.md", "Field guide " + h[3:]))
docs.append(("field-guide.md", "The whole field guide, in one file"))
readme = ["# Chapter 21, as text for coding agents", "",
          'When a prompt says "Read 21.5", open `20.5.md`. The files and this folder keep the chapter\'s earlier number, '
          'from before the book added a new Chapter 20. When it says "field guide F2", open `F2.md`. These files are the '
          "chapter's concepts and field guide, copied as text. The lab's steps are in `LAB.md`, beside this repository, "
          "and the answer key is not in the repository at all.", "",
          "| File | What it is |", "| --- | --- |"] + [f"| `{f}` | {t} |" for f, t in docs]
files["README.md"] = "\n".join(readme) + "\n"

if CHECK:
    have = {p.name: p.read_text() for p in OUT.glob("*.md")}
    differ = sorted(set(have) ^ set(files) | {f for f in files if have.get(f) != files[f]})
    for f in differ:
        print("differs:", f)
    sys.exit(1 if differ else 0)
for p in OUT.glob("*.md"):
    if p.name not in files:
        p.unlink()
OUT.mkdir(parents=True, exist_ok=True)
for f, text in files.items():
    (OUT / f).write_text(text)
print(f"docs/chapter-20: {len(files)} files")
