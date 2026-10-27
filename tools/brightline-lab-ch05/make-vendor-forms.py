"""Make the vendor setup forms for Lab 5, Task 10, of The AI Agent Factory, Second Edition.

python3 tools/brightline-lab-ch05/make-vendor-forms.py        (from the repository's root)

Writes labs/brightline-lab-ch05/inputs/new-vendor-forms.md: three new vendors' setup forms in one
file, which rides in the lab's inputs.zip. In Task 10 the learner's vendor brief turns them into
JSON records for Brightline's accounting system. Two facts the lab teaches are kept out of the file on purpose, and the script
checks that they stay out: Dave approved Net 45 for Riverside Tape (only Maria's message says so),
and Pinecrest Wrap's form leaves its currency blank. Every name, address and number is invented."""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "labs/brightline-lab-ch05/inputs/new-vendor-forms.md"

FORMS = [
    {
        "Brightline vendor ID (Brightline use only)": "V-1068",
        "Legal business name": "Riverside Tape Co.",
        "Business address": "1180 Leonard Avenue, Columbus, OH 43219",
        "Accounts receivable contact": "Tom Becker, (614) 555-0193",
        "Remit-to email, for invoices and payment notices": "ar@riversidetape.example",
        "Expected monthly purchases": "$2,600.00",
        "Payment terms requested": "Net 30",
        "Currency for invoices and payments": "USD",
        "W-9": "Received by Brightline on October 14, 2026",
        "Signed": "Tom Becker, Office Manager, October 13, 2026",
    },
    {
        "Brightline vendor ID (Brightline use only)": "V-1069",
        "Legal business name": "Great Lakes Label Inc.",
        "Business address": "2210 Superior Avenue, Cleveland, OH 44114",
        "Accounts receivable contact": "Nora Patel, (216) 555-0127",
        "Remit-to email, for invoices and payment notices": "remit@greatlakeslabel.example",
        "Sales contact": "Dana Whitfield, sales@greatlakeslabel.example",
        "Expected monthly purchases": "$1,850.00",
        "Payment terms requested": "Net 30",
        "Currency for invoices and payments": "USD",
        "W-9": "Received by Brightline on October 12, 2026",
        "Signed": "Nora Patel, Controller, October 9, 2026",
    },
    {
        "Brightline vendor ID (Brightline use only)": "V-1070",
        "Legal business name": "Pinecrest Wrap Ltd.",
        "Business address": "88 Bathurst Street, Toronto, ON M5V 2P2, Canada",
        "Accounts receivable contact": "Claire Dubois, (416) 555-0162",
        "Remit-to email, for invoices and payment notices": "accounts@pinecrestwrap.example",
        "Expected monthly purchases": "$1,200.00",
        "Payment terms requested": "Net 30",
        "Currency for invoices and payments": "",
        "Tax registration": "Canadian business number on file with Brightline",
        "Signed": "Claire Dubois, Accounts Manager, October 14, 2026",
    },
]

lines = ["# New vendor setup forms", "",
         "Three vendors returned Brightline Wholesale Supply's vendor setup form before their first orders.", ""]
for form in FORMS:
    lines += [f"## Vendor setup form: {form['Legal business name']}", ""]
    lines += [f"- **{label}:** {value if value else '(left blank)'}" for label, value in form.items()]
    lines.append("")
text = "\n".join(lines)

# The file must not carry the lab's answers.
problems = []
if re.search(r"\b45\b", text): problems.append("the file mentions 45, which only Maria's message may say")
if re.search(r"Dave|approv|import|JSON|terms_days|currency\b.*CAD|\bCAD\b|Canadian dollar|lab note", text, re.I):
    problems.append("the file carries a word that hints at an answer")
if [f["Legal business name"] for f in FORMS if not f["Currency for invoices and payments"]] != ["Pinecrest Wrap Ltd."]:
    problems.append("exactly one form, Pinecrest Wrap's, should leave its currency blank")
if FORMS[0]["Payment terms requested"] != "Net 30": problems.append("Riverside Tape's form should say Net 30")
ids = [f["Brightline vendor ID (Brightline use only)"] for f in FORMS]
if len(set(ids)) != 3: problems.append("the vendor IDs repeat")
if problems: sys.exit("make-vendor-forms: " + "; ".join(problems))

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(text, encoding="utf-8")
print(f"wrote {OUT.relative_to(ROOT)}: {len(FORMS)} forms, {len(text.split())} words")
print("expected records:")
for f in FORMS:
    terms = 45 if f["Legal business name"] == "Riverside Tape Co." else int(f["Payment terms requested"].split()[1])
    print(f"  {f['Brightline vendor ID (Brightline use only)']} | {f['Legal business name']} | {terms} | "
          f"{f['Currency for invoices and payments'] or '(empty, listed as missing)'} | "
          f"{f['Remit-to email, for invoices and payment notices']}")
