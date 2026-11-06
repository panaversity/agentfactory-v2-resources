"""Package Lab 22 around brightline-ap/: the built folder, docs/chapter-22/, the README and the lab's figure.

    python3 -I package_lab22.py <built brightline-ap> <labs/brightline-lab-ch22> <knowledge/.../hosted-agents>

- brightline-ap/: the folder build_lab22.py made (base, then overlay, then `npm install` for package-lock.json),
  without what an install or a run leaves behind (node_modules, .venv, __pycache__, .wrangler, out, .secrets).
- brightline-ap/docs/chapter-22/: the chapter's overview, concepts and reference page as text, and the field guide
  whole and by section, for the coding agents (as Lab 21's docs/chapter-21/).
- README.md, and img/ with the figure LAB.md shows.
The answer key (answer-key/) is written beside this, and LAB.md is copied by the make-lab skill's copy-lab-page.py.
"""
import pathlib
import re
import shutil
import sys

BUILT, LAB, PAGES = (pathlib.Path(a) for a in sys.argv[1:4])
AP = LAB / "brightline-ap"
SKIP = {"node_modules", ".venv", "__pycache__", ".wrangler", "out", ".secrets", ".pytest_cache", ".ruff_cache"}

# ---- brightline-ap/ ---------------------------------------------------------------------------
if AP.exists():
    shutil.rmtree(AP)
shutil.copytree(BUILT, AP, ignore=lambda d, names: [n for n in names if n in SKIP or n.endswith(".pyc")])

# ---- brightline-ap/docs/chapter-22/ -----------------------------------------------------------
OUT = AP / "docs/chapter-22"
DOCHEAD = "From *The AI Agent Factory*, Chapter 22, for the coding agents working in this repository. The chapter itself is the source.\n\n"


def body(p):
    t = p.read_text(encoding="utf-8"); fm, b = t[4:].split("\n---\n", 1)
    title = re.search(r'^title: "?(.*?)"?$', fm, re.M).group(1)
    b = re.sub(r"^!\[.*\]\(.*\)\s*$\n?", "", b, flags=re.M)            # figures go; their captions stay
    b = re.sub(r"^\[\^[\w-]+\]:.*$\n?", "", b, flags=re.M)             # footnote definitions go
    b = re.sub(r"\[\^[\w-]+\]", "", b)                                  # and their markers
    b = re.sub(r"(?<!!)\[([^\]]+)\]\([^)]+\)", r"\1", b)               # links become their words
    return title, re.sub(r"\n{3,}", "\n\n", b).strip() + "\n"


shutil.rmtree(OUT, ignore_errors=True); OUT.mkdir(parents=True)
docs = []
title, b = body(PAGES / "overview.md"); (OUT / "overview.md").write_text(DOCHEAD + b, encoding="utf-8")
docs.append(("overview.md", "Chapter 22's overview: Start here, the point, the who's who and what you build"))
lessons = []
for p in PAGES.glob("*.md"):
    m = re.search(r'^concepts: \["(22\.\d+)"\]', p.read_text(encoding="utf-8"), re.M)
    if m:
        lessons.append((int(m.group(1).split(".")[1]), m.group(1), p))
assert len(lessons) == 19, len(lessons)
for _, num, p in sorted(lessons):
    title, b = body(p)
    (OUT / f"{num}.md").write_text(DOCHEAD + f"# {title}\n\n" + b, encoding="utf-8"); docs.append((f"{num}.md", title))
title, b = body(PAGES / "reference.md")
(OUT / "reference.md").write_text(DOCHEAD + f"# {title}\n\n" + b, encoding="utf-8")
docs.append(("reference.md", "The companion reference page, whole: beyond this chapter, more detail for 22.17 to 22.19, the words and the field guide"))
fg = b[b.index("### F0."):]
(OUT / "field-guide.md").write_text(DOCHEAD + "# The field guide, F0 to F7\n\n" + re.sub(r"^###", "##", fg, flags=re.M), encoding="utf-8")
parts = re.split(r"^(### F\d\. .*)$", fg, flags=re.M)
for h, sec in zip(parts[1::2], parts[2::2]):
    n = re.match(r"### (F\d)\.", h).group(1)
    (OUT / f"{n}.md").write_text(DOCHEAD + "# " + h[4:] + "\n\n" + sec.strip() + "\n", encoding="utf-8")
    docs.append((f"{n}.md", "Field guide " + h[4:]))
assert sum(1 for f, _ in docs if re.fullmatch(r"F\d\.md", f)) == 8
docs.append(("field-guide.md", "The whole field guide, F0 to F7, in one file"))
readme = ["# Chapter 22, as text for coding agents", "",
          'When a prompt says "Read 22.7", open `22.7.md`. When it says "F2", open `F2.md`. These files are the chapter\'s overview, concepts and reference page, copied as text. The lab\'s steps are in `LAB.md`, beside this repository, and the answer key is not in the repository at all.', "",
          "| File | What it is |", "| --- | --- |"] + [f"| `{f}` | {t} |" for f, t in docs]
(OUT / "README.md").write_text("\n".join(readme) + "\n", encoding="utf-8")

# ---- README.md and img/ -----------------------------------------------------------------------
(LAB / "README.md").write_text("""# Lab 22 files

These files go with Lab 22 of The AI Agent Factory: the AP worker as a hosted agent, inside Brightline's own AP portal.

- `brightline-ap/` is the repository at the end of Lab 21, with no git history, plus Lab 22's starting files: the portal's skeleton (`apps/portal/`, a Cloudflare Worker whose routes answer 501 until the lab fills them in, with its offline tests), Lab 21's rule 2 in a file of its own (`src/rules/cites.ts`), every company's id and the test people (`data/companies.csv`, `data/test-people.csv`), Chapter 16's skill under `skills/`, a planted note on Cedar Ridge's vendor V102 for the injection check, empty `agents/`, `environments/` and `deployments/` folders the lab fills, the worker contract's template (`docs/worker-spec.template.md`), a filled mapping table for readers who skipped Lab 21 (`docs/sdk-map.example.md`), the agents' rules for hosted agents in `AGENTS.md` and their settings files, and `docs/chapter-22/`, the chapter as text files for coding agents. Task 0 starts its git history and tags `lab22-start`.
- `LAB.md` is a copy of the lab steps.
- `answer-key/` holds what each task should show. Never give it to an agent.
- Each task's answer key is a separate download, linked from the task in `LAB.md`. Open a key in a text editor only, never in the agent.

Labs 20 and 21's offline tests still pass here: 47 in TypeScript (`npm run test:loop`, `npm run test:sdk`) and 35 in Python (`npm run test:loop:py`, `npm run test:sdk:py`), with the portal skeleton's 20 (`npm run test:portal`).

Today in the lab is Monday, April 5, 2027. The people and companies are invented. Your keys are made by you, in each platform's own console, and go only into `.secrets/`, which git ignores, or into a Worker's secrets, which you set yourself.

You need Node.js 22.19 or later, Python 3.12 or later with uv 0.11 or later, git, a GitHub account with `gh`, the coding agents of Chapter 12, and free Cloudflare and Neon accounts. The hosted steps need a Claude Console account with API credits, with spending limits; the optional OpenAI port needs an OpenAI API account, and the open-source port needs Docker with Compose. No hosted step has been run yet: every live result in `LAB.md` and the keys is what the platforms' documentation leads us to expect.
""", encoding="utf-8")
img = LAB / "img"
shutil.rmtree(img, ignore_errors=True); img.mkdir()
for name in sorted(set(re.findall(r"\]\(img/([^)]+)\)", (PAGES / "lab.md").read_text(encoding="utf-8")))):
    shutil.copyfile(PAGES / "img" / name, img / name)
print(f"brightline-ap/, docs/chapter-22 ({len(docs)} entries), README.md, img/ ({len(list(img.iterdir()))})")
