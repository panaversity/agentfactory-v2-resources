"""Copy Lesson 7.8's Anthropic and OpenAI boxes into Lab 7's task-questions.md, for The AI Agent Factory, Second Edition.

python3 tools/brightline-lab-ch07/copy-boxes.py <the book's both-ai-vendors.md>           (writes)
python3 tools/brightline-lab-ch07/copy-boxes.py <the book's both-ai-vendors.md> --check   (fails if stale)

Task 11 asks which setting on the learner's app holds each envelope line, and shows the lines of
7.8's box for that app. The boxes say what each product does as verified on a date, so they are
copied from the book's page, never typed, and the check fails when the page has changed since. The
book's page is knowledge/managing-ai-workers/the-authority-envelope/both-ai-vendors.md. Footnote
markers are dropped, because their sources live on the page."""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
QUESTIONS = ROOT / "labs/brightline-lab-ch07/inputs/task-questions.md"
BEGIN = "<!-- 7.8 boxes: begin. tools/brightline-lab-ch07/copy-boxes.py writes this part from the book's page. -->"
END = "<!-- 7.8 boxes: end -->"

args = [a for a in sys.argv[1:] if a != "--check"]
if len(args) != 1:
    sys.exit(__doc__)
page = Path(args[0]).read_text(encoding="utf-8").splitlines()


def box(title):
    """The box whose first line names the title, as plain lines without the quote marks."""
    start = next(i for i, line in enumerate(page) if line.startswith(f"> **{title}, as verified"))
    lines = []
    for line in page[start:]:
        if not line.startswith(">"):
            break
        lines.append(re.sub(r"\[\^[^\]]+\]", "", line[1:].strip()))
    return lines


body = []
for title in ("Anthropic", "OpenAI"):
    lines = box(title)
    body.append(lines[0].replace("**", "").rstrip(".") + ":")
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
        sys.exit("task-questions.md's copy of 7.8's boxes differs from the book's page. Run without --check.")
    print("task-questions.md's copy of 7.8's boxes matches the book's page.")
else:
    QUESTIONS.write_text(text.replace(current, copy), encoding="utf-8")
    print("Copied 7.8's Anthropic and OpenAI boxes into task-questions.md.")
