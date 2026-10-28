"""Make two of the input files for Lab 7 of The AI Agent Factory, Second Edition.

python3 tools/brightline-lab-ch07/make-inputs.py        (from the repository's root)

Writes labs/brightline-lab-ch07/inputs/inbox-2026-10-28.md (this morning's twelve emails in one
file, so a test names "email 05") and labs/brightline-lab-ch07/inputs/brightline-records.md (AP
policy version 3, the vendor records, the payment status and the fifteen actions in one file). Both
ride in the lab's inputs.zip. They are made from the older copies in tools/brightline-lab-ch07/source/,
which hold the same data one file each, and the script checks that every line of every email, every policy line and every CSV
cell arrives word for word, the planted lines included. Every name, address and number is invented."""
import csv, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "tools/brightline-lab-ch07/source"
OUT = ROOT / "labs/brightline-lab-ch07/inputs"
INBOX_OUT = OUT / "inbox-2026-10-28.md"
RECORDS_OUT = OUT / "brightline-records.md"

EMAILS = sorted((SRC / "inbox").glob("email-*.txt"))
POLICY = SRC / "ap-policy-v3-excerpt.md"
TABLES = [
    ("Vendor records", SRC / "vendor-records.csv"),
    ("Payment status, Wednesday, October 28, 2026", SRC / "payment-status-2026-10-28.csv"),
    ("The fifteen actions", SRC / "action-catalog.csv"),
]

if len(EMAILS) != 12:
    sys.exit(f"Expected twelve emails in {SRC / 'inbox'}, found {len(EMAILS)}.")

# The inbox: one heading per email, its text in a fence, every line as it arrived.
lines = ["# This morning's inbox", "",
         "This morning's twelve emails, Wednesday, October 28, 2026, each as it arrived.", ""]
for path in EMAILS:
    number = path.stem.split("-")[1]
    text = path.read_text(encoding="utf-8").rstrip("\n")
    lines += [f"## Email {number}", "", "```text", text, "```", ""]
INBOX_OUT.write_text("\n".join(lines), encoding="utf-8")


def table(path):
    with path.open(newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))
    cell = lambda value: value.replace("|", "\\|")
    out = ["| " + " | ".join(cell(c) for c in rows[0]) + " |",
           "| " + " | ".join("---" for _ in rows[0]) + " |"]
    out += ["| " + " | ".join(cell(c) for c in row) + " |" for row in rows[1:]]
    return out, rows


# The records: the policy, its headings two levels down, then each CSV as a table.
lines = ["# Brightline's records", "",
         "Brightline Wholesale Supply's records for Wednesday, October 28, 2026: AP policy version 3, "
         "the vendor records, the payment status, and the fifteen actions the AP Worker might take.", "",
         "## AP policy version 3", ""]
for line in POLICY.read_text(encoding="utf-8").rstrip("\n").split("\n"):
    lines.append("##" + line if line.startswith("#") else line)
lines.append("")
csv_rows = {}
for title, path in TABLES:
    rendered, rows = table(path)
    csv_rows[path.name] = rows
    lines += [f"## {title}", ""] + rendered + [""]
RECORDS_OUT.write_text("\n".join(lines), encoding="utf-8")

# The check: nothing lost, nothing reworded.
misses = []
inbox_lines = set(INBOX_OUT.read_text(encoding="utf-8").split("\n"))
for path in EMAILS:
    for line in path.read_text(encoding="utf-8").split("\n"):
        if line.strip() and line not in inbox_lines:
            misses.append(f"{path.name}: {line!r}")
records = RECORDS_OUT.read_text(encoding="utf-8")
records_lines = {l.lstrip("#").strip() for l in records.split("\n")}
for line in POLICY.read_text(encoding="utf-8").split("\n"):
    if line.strip() and line.lstrip("#").strip() not in records_lines:
        misses.append(f"{POLICY.name}: {line!r}")
records_cells = set()
for l in records.split("\n"):
    if l.startswith("| "):
        records_cells.update(c.strip().replace("\\|", "|") for c in l.strip().strip("|").split(" | "))
for name, rows in csv_rows.items():
    for row in rows:
        for c in row:
            if c and c not in records_cells:
                misses.append(f"{name}: {c!r}")
if misses:
    sys.exit("Not carried over word for word:\n" + "\n".join(misses))
print(f"Wrote {INBOX_OUT.relative_to(ROOT)} ({len(EMAILS)} emails) and {RECORDS_OUT.relative_to(ROOT)}; "
      "every email line, policy line and CSV cell is there word for word.")
