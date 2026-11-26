"""Rewrite brightline-ap/docs/chapter-22/ from the book's chapter pages, as text for the coding agents.

    python3 -I sync_docs.py <book>/knowledge/building-ai-workers/hosted-agents [<labs>/labs/brightline-lab-ch22]

The docs-writing part of package_lab22.py, on its own, so the zip's copy of the chapter can follow the book
without rebuilding brightline-ap/ (package_lab22.py's README text is stale: never run it whole). The same
files: overview.md, one 22.N.md per lesson, reference.md, field-guide.md, F0.md to F7.md and README.md. The
folder and the files keep the chapter's old number, 22, and their text gives the book's own, read from the
lessons' `concepts:` tags. Each page loses its front matter, figures, footnotes and link targets, as before.

Run it again after any change to the chapter's pages. It is idempotent: it writes a file only when its text
changes, removes a generated file only when the book no longer makes it, and leaves any other file alone.
The labs folder defaults to the one beside this tools folder.
"""
import pathlib
import re
import sys

if not 2 <= len(sys.argv) <= 3:
    sys.exit(__doc__)
PAGES = pathlib.Path(sys.argv[1])
LAB = pathlib.Path(sys.argv[2]) if len(sys.argv) == 3 else pathlib.Path(__file__).resolve().parents[2] / "labs/brightline-lab-ch22"
OUT = LAB / "brightline-ap/docs/chapter-22"
OLD = "22"  # the number the folder and its file names keep
if not (PAGES / "overview.md").is_file() or not (PAGES / "reference.md").is_file():
    sys.exit(f"sync_docs: {PAGES} is not the chapter's folder (no overview.md and reference.md)")
if not OUT.is_dir():
    sys.exit(f"sync_docs: {OUT} does not exist")


def body(p):
    t = p.read_text(encoding="utf-8"); fm, b = t[4:].split("\n---\n", 1)
    title = re.search(r'^title: "?(.*?)"?$', fm, re.M).group(1)
    b = re.sub(r"^!\[.*\]\(.*\)\s*$\n?", "", b, flags=re.M)            # figures go; their captions stay
    b = re.sub(r"^\[\^[\w-]+\]:.*$\n?", "", b, flags=re.M)             # footnote definitions go
    b = re.sub(r"\[\^[\w-]+\]", "", b)                                  # and their markers
    b = re.sub(r"(?<!!)\[([^\]]+)\]\([^)]+\)", r"\1", b)               # links become their words
    return title, re.sub(r"\n{3,}", "\n\n", b).strip() + "\n"


lessons = []
for p in PAGES.glob("*.md"):
    m = re.search(r'^concepts: \[\s*"(\d+)\.(\d+)"\s*\]', p.read_text(encoding="utf-8"), re.M)  # one concept: a lesson
    if m:
        lessons.append((int(m.group(2)), m.group(1), p))
assert len(lessons) == 19, f"expected 19 lessons, found {len(lessons)}"
chapters = {ch for _, ch, _ in lessons}
assert len(chapters) == 1, f"the lessons name more than one chapter: {sorted(chapters)}"
NEW = chapters.pop()
DOCHEAD = f"From *The AI Agent Factory*, Chapter {NEW}, for the coding agents working in this repository. The chapter itself is the source.\n\n"

out, docs = {}, []
title, b = body(PAGES / "overview.md")
out["overview.md"] = DOCHEAD + b
docs.append(("overview.md", f"Chapter {NEW}'s overview: Start here, the point, the who's who and what you build"))
for n, _, p in sorted(lessons):
    title, b = body(p)
    out[f"{OLD}.{n}.md"] = DOCHEAD + f"# {title}\n\n" + b
    docs.append((f"{OLD}.{n}.md", title))
title, b = body(PAGES / "reference.md")
out["reference.md"] = DOCHEAD + f"# {title}\n\n" + b
docs.append(("reference.md", f"The companion reference page, whole: beyond this chapter, more detail for {NEW}.17 to {NEW}.19, the words and the field guide"))
fg = b[b.index("### F0."):]
out["field-guide.md"] = DOCHEAD + "# The field guide, F0 to F7\n\n" + re.sub(r"^###", "##", fg, flags=re.M)
parts = re.split(r"^(### F\d\. .*)$", fg, flags=re.M)
for h, sec in zip(parts[1::2], parts[2::2]):
    f = re.match(r"### (F\d)\.", h).group(1)
    out[f"{f}.md"] = DOCHEAD + "# " + h[4:] + "\n\n" + sec.strip() + "\n"
    docs.append((f"{f}.md", "Field guide " + h[4:]))
assert sum(1 for f, _ in docs if re.fullmatch(r"F\d\.md", f)) == 8, "expected F0 to F7"
docs.append(("field-guide.md", "The whole field guide, F0 to F7, in one file"))
readme = [f"# Chapter {NEW}, as text for coding agents", "",
          f'When a prompt says "Read {NEW}.7", open `{OLD}.7.md`. The files and this folder keep the chapter\'s earlier number, from before the book added a new Chapter 20. When it says "F2", open `F2.md`. These files are the chapter\'s overview, concepts and reference page, copied as text. The lab\'s steps are in `LAB.md`, beside this repository, and the answer key is not in the repository at all.', "",
          "| File | What it is |", "| --- | --- |"] + [f"| `{f}` | {t} |" for f, t in docs]
out["README.md"] = "\n".join(readme) + "\n"

GENERATED = re.compile(rf"(?:{OLD}\.\d+|F\d|overview|reference|field-guide|README)\.md")
changed = []
for name in sorted(p.name for p in OUT.iterdir() if p.is_file()):
    if GENERATED.fullmatch(name) and name not in out:
        (OUT / name).unlink(); changed.append(f"removed {name}")
    elif name not in out:
        print(f"sync_docs: left alone, not a generated file: {name}")
for name, text in out.items():
    target = OUT / name
    if not target.exists() or target.read_text(encoding="utf-8") != text:
        target.write_text(text, encoding="utf-8"); changed.append(name)
print(f"sync_docs: {OUT}: {len(out)} files from Chapter {NEW}'s pages, {len(changed)} changed" + (": " + ", ".join(changed) if changed else ""))
