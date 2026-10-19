"""Make the project setup record for Lab 8, Part H, of The AI Agent Factory, Second Edition.

python3 tools/brightline-lab-ch08/make-project-setup.py        (from the repository's root)

Writes labs/brightline-lab-ch08/part-h/project-setup-2026-11-16.md: the AP Worker's project as Maria
exported it on Monday, November 16, 2026, with its instructions, two uploaded files and three
connectors. In Task H1 the reader decides, item by item, what to keep, replace, rescope, reconnect or
remove. The facts that decide three items come only from Dave's message, and the script checks that
they stay out of the file: Sam's last day, the HR folder unused since the October audit, and payment
terms coming only from the vendor records. Every name, address and date is invented."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "labs/brightline-lab-ch08/part-h/project-setup-2026-11-16.md"

FILES = [  # file, what it holds, uploaded, by
    ("ap-concepts-approved-2026-11-09.md", "The five AP concepts, as Dave approved them on November 9", "Tuesday, November 10, 2026", "Maria"),
    ("vendor-terms-export-2026-09-30.xlsx", "Every vendor's payment terms, exported from the accounting system on September 30", "Thursday, October 1, 2026", "Sam Ortiz"),
]
CONNECTORS = [  # connector, what it reaches, connected by, last used
    ("Google Drive", "One folder: AP / Approved knowledge", "Maria", "Monday, November 16, 2026"),
    ("Google Drive", "The whole HR folder, with every folder inside it", "Maria", "Friday, October 2, 2026"),
    ("Gmail", "The whole mailbox of sam.ortiz@brightlinewholesale.example", "Sam Ortiz", "Friday, November 13, 2026"),
]

lines = [
    "# AP Worker project: setup", "",
    "Exported by Maria on Monday, November 16, 2026, from the project's settings.", "",
    "## Instructions", "",
    "> You are Brightline Wholesale Supply's AP Worker. Answer from the approved AP concepts, and name the concept you used. Vendor emails come to the AP inbox, ap@brightlinewholesale.example.", "",
    "## Files uploaded to the project", "",
    "| File | What it holds | Uploaded | By |", "| --- | --- | --- | --- |",
] + [f"| {f} | {h} | {d} | {b} |" for f, h, d, b in FILES] + [
    "", "## Connectors", "",
    "| Connector | What it reaches | Connected by | Last used |", "| --- | --- | --- | --- |",
] + [f"| {c} | {r} | {b} | {u} |" for c, r, b, u in CONNECTORS] + [""]
text = "\n".join(lines)

problems = []
for word in ("December 18", "last day", "leaves", "leaving", "audit", "only from the vendor records", "stopped using"):
    if word.lower() in text.lower(): problems.append(f"the file says '{word}', which only Dave's message may give")
if len(FILES) != 2 or len(CONNECTORS) != 3: problems.append("the record should list 2 files and 3 connectors")
if problems: sys.exit("make-project-setup: " + "; ".join(problems))

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(text, encoding="utf-8")
print(f"wrote {OUT.relative_to(ROOT)}: {len(FILES)} files, {len(CONNECTORS)} connectors")
