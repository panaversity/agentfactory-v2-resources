"""Copy the Anthropic and OpenAI boxes behind Lesson 7.4 into Lab 7's task-questions.md, for The AI Agent Factory, Second Edition.

python3 tools/brightline-lab-ch07/copy-boxes.py <the book's 7.4 both-ai-vendors.md>           (writes)
python3 tools/brightline-lab-ch07/copy-boxes.py <the book's 7.4 both-ai-vendors.md> --check   (fails if stale)

Task 11 asks which setting on the learner's app holds each envelope line, and shows the lines of
the Chapter 7 box for that app. The boxes say what each product does as verified on a date, so they are
copied from the book's page, never typed, and the check fails when the page has changed since. The
book's page is knowledge/managing-ai-workers/the-authority-envelope/both-ai-vendors.md, Lesson 7.4,
where each box is a tab of its Product reference: "### Claude" for Anthropic and "### ChatGPT" for
OpenAI, each opening with its "*As verified <date>.*" line (since 21 November 2026). Footnote
markers are dropped, because their sources live on the page, and a link keeps only its words."""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
QUESTIONS = ROOT / "labs/brightline-lab-ch07/inputs/task-questions.md"
BEGIN = "<!-- 7.4 boxes: begin. tools/brightline-lab-ch07/copy-boxes.py writes this part from the book's page. -->"
END = "<!-- 7.4 boxes: end -->"

args = [a for a in sys.argv[1:] if a != "--check"]
if len(args) != 1:
    sys.exit(__doc__)
page = Path(args[0]).read_text(encoding="utf-8").splitlines()


def plain(line):
    """A line without footnote markers, and with each link reduced to its words."""
    line = re.sub(r"\[\^[^\]]+\]", "", line)
    return re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", line)


def box(tab, vendor):
    """The tab's box: its date as a title line, then its lines up to the next heading."""
    start = page.index(f"### {tab}")
    rest = page[start + 1:]
    stop = next((i for i, line in enumerate(rest) if line.startswith("#")), len(rest))
    lines = [line for line in rest[:stop]]
    date_at = next(i for i, line in enumerate(lines) if line.startswith("*As verified "))
    date = lines[date_at].strip("*").removeprefix("As verified ").rstrip(".")
    items = lines[date_at + 1:]
    while items and not items[0].strip():
        items.pop(0)
    while items and not items[-1].strip():
        items.pop()
    return [f"{vendor}, as verified {date}:"] + [plain(line) for line in items]


body = []
for tab, vendor in (("Claude", "Anthropic"), ("ChatGPT", "OpenAI")):
    lines = box(tab, vendor)
    body.append(lines[0])
    body.append("")
    body.extend(lines[1:])
    body.append("")
copy = "\n".join([BEGIN, ""] + body + [END])

text = QUESTIONS.read_text(encoding="utf-8")
if text.count(BEGIN) != 1 or text.count(END) != 1:
    sys.exit(f"{QUESTIONS} must hold the two markers once each.")
current = text[text.index(BEGIN):text.index(END) + len(END)]
if "--check" in sys.argv:
    if current != copy:
        sys.exit("task-questions.md's copy of 7.4's boxes differs from the book's page. Run without --check.")
    print("task-questions.md's copy of 7.4's boxes matches the book's page.")
else:
    QUESTIONS.write_text(text.replace(current, copy), encoding="utf-8")
    print("Copied 7.4's Anthropic and OpenAI boxes into task-questions.md.")
