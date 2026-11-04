"""docs/chapter-19/ for the lab repository: the final pages as text for coding agents, as Lab 18's docs/chapter-18/.
Usage: make_docs_19.py <chapter folder in knowledge/> <out: brightline-ap/docs/chapter-19>"""
import re, sys, shutil, pathlib
K, OUT = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
HEAD = "From *The AI Agent Factory*, Chapter 19, for the coding agents working in this repository. The chapter itself is the source.\n\n"

def body(p):
    t = p.read_text(); fm, b = t[4:].split("\n---\n", 1)
    title = re.search(r'^title: "?(.*?)"?$', fm, re.M).group(1)
    b = re.sub(r"^!\[.*\]\(.*\)\s*$\n?", "", b, flags=re.M)            # figures go; their captions stay
    b = re.sub(r"^\[\^[\w-]+\]:.*$\n?", "", b, flags=re.M)             # footnote definitions go
    b = re.sub(r"\[\^[\w-]+\]", "", b)                                  # and their markers
    b = re.sub(r"(?<!!)\[([^\]]+)\]\([^)]+\)", r"\1", b)               # links become their words
    return title, re.sub(r"\n{3,}", "\n\n", b).strip() + "\n"

shutil.rmtree(OUT, ignore_errors=True); OUT.mkdir(parents=True)
rows = []
title, b = body(K / "overview.md"); (OUT / "overview.md").write_text(HEAD + b); rows.append(("overview.md", "Chapter 19, the point, its words and what you build"))
lessons = []
for p in K.glob("*.md"):
    m = re.search(r'^concepts: \[ "(19\.\d+)" \]', p.read_text(), re.M)
    if m: lessons.append((int(m.group(1).split(".")[1]), m.group(1), p))
for _, num, p in sorted(lessons):
    title, b = body(p)
    (OUT / f"{num}.md").write_text(HEAD + f"# {title}\n\n" + b); rows.append((f"{num}.md", title))
title, b = body(K / "field-guide-business-data-and-retrieval.md")
(OUT / "field-guide.md").write_text(HEAD + f"# {title}\n\n" + b)
parts = re.split(r"^(## F\d\. .*)$", b, flags=re.M)
for h, sec in zip(parts[1::2], parts[2::2]):
    n = re.match(r"## (F\d)\.", h).group(1)
    sec = re.sub(r"^###", "##", sec, flags=re.M)
    (OUT / f"{n}.md").write_text(HEAD + "# " + h[3:] + "\n\n" + sec.strip() + "\n"); rows.append((f"{n}.md", "Field guide " + h[3:]))
rows.append(("field-guide.md", "The whole field guide, in one file"))
readme = ["# Chapter 19, as text for coding agents", "",
  'When a prompt says "Read 19.8", open `19.8.md`. When it says "field guide F3", open `F3.md`. These files are the chapter\'s concepts and field guide, copied as text. The lab\'s steps are in `LAB.md`, beside this repository, and the answer key is not in the repository at all.', "",
  "| File | What it is |", "| --- | --- |"] + [f"| `{f}` | {t} |" for f, t in rows]
(OUT / "README.md").write_text("\n".join(readme) + "\n")
print(len(rows), "files")
