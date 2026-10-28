"""Build Lab 9's three Thursday record files, for The AI Agent Factory, Second Edition.

python3 tools/brightline-lab-ch09/build.py   (from the repository's root)

Each file is one Thursday's records as they stood at 7:00 a.m., as the Thursday run is handed
them: the register export, Maria's AP matters record, and the five approved AP concepts. It is
written to labs/brightline-lab-ch09/thursday-<date>.md. The script then works out each Thursday's
answer from the register and the record, and stops if it differs from the answer the keys give."""
import csv, datetime, io, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "source"
OUT = HERE.parents[1] / "labs" / "brightline-lab-ch09"
DATES = ["2026-11-12", "2026-11-19", "2026-11-26"]
CONCEPTS = ["invoice-approval-threshold", "weekly-payment-run", "duplicate-invoices",
            "vendor-bank-detail-changes", "capitalization"]


def day(iso):
    d = datetime.date.fromisoformat(iso[:10])
    return f"{d:%A, %B} {d.day}, {d.year}"


def when(iso):
    t = datetime.datetime.fromisoformat(iso)
    hour = t.hour % 12 or 12
    return f"{day(iso)}, {hour}:{t.minute:02d} {'a.m.' if t.hour < 12 else 'p.m.'}"


def concept(name):
    text = (SRC / "ksor" / f"{name}.md").read_text()
    _, front, body = text.split("---\n", 2)
    title = re.search(r"^title: (.+)$", front, re.M).group(1)
    approved = re.search(r"approval: \{ by: \"human:dave-kowalski\", at: (\S+) \}", front).group(1)
    effective = re.search(r"effective_from: (\S+)", front).group(1)
    review = re.search(r"stale_after: (\S+)", front).group(1)
    sources = re.findall(r"resource: \"([^\"]+)\"", front)
    body = "\n".join(l for l in body.strip().splitlines() if not l.startswith("[^")).strip()
    body = re.sub(r" ?\[\^[^\]]+\]", "", body)
    meta = (f"Status: approved. Owner: Dave Kowalski, Controller. Maintained by Maria Lopez. "
            f"Approved by Dave Kowalski, {when(approved)} Effective from {day(effective)}. "
            f"Review by {day(review)}. Sources: {'; '.join(sources)}.")
    return f"### {title}\n\n{meta}\n\n{body}\n"


def build(date):
    register = (SRC / "register" / f"register-{date}.csv").read_text()
    matters = (SRC / f"matters-{date}.md").read_text()
    header = (SRC / "record-header.md").read_text()
    parts = [
        f"# Brightline's AP records, {day(date)}, 7:00 a.m.",
        f"The records as they stood at 7:00 a.m. on {day(date)}, in three parts: the register export, "
        "the AP matters record, and the five approved AP concepts.",
        f"## 1. The register export: register-{date}.csv",
        f"Exported from the accounting system at 6:00 a.m. on {day(date)}. One row for each time an "
        "invoice was entered. Status is the accounting system's: open, paid or held. approval_recorded "
        "is Dave's approval as the accounting system records it, from his own login.",
        f"```csv\n{register.strip()}\n```",
        f"## 2. The AP matters record, as it stood at 7:00 a.m. on {day(date)}",
        header.strip(),
        matters.replace("\n## ", "\n### ").replace("## M-", "### M-", 1).strip(),
        "## 3. The five approved AP concepts",
        "Maria's records hold the approved concepts. Dave Kowalski approved them on Wednesday, November 4, "
        "2026, with his change of Monday, November 9, 2026 to the invoice approval threshold.",
        *[concept(c).strip() for c in CONCEPTS],
    ]
    (OUT / f"thursday-{date}.md").write_text("\n\n".join(parts) + "\n")
    return list(csv.DictReader(io.StringIO(register))), matters


def answer(date, rows, matters):
    """The run list, holds, copies, approvals and totals for the Friday run after this Thursday."""
    run = datetime.date.fromisoformat(date) + datetime.timedelta(days=1)
    due_by = run + datetime.timedelta(days=7)
    seen, copies, listed = set(), [], []
    for r in sorted(rows, key=lambda r: r["received_on"]):
        key = (r["vendor"], r["invoice_no"])
        if key in seen:
            if r["status"] == "open":
                copies.append(f"{r['invoice_no']} received {r['received_on']}")
            continue
        seen.add(key)
        if r["status"] == "open" and datetime.date.fromisoformat(r["due_date"]) <= due_by:
            listed.append(r)
    # A vendor with an open bank-detail matter in the record is held (concept: bank-detail changes).
    open_bank = re.findall(r"### M-\d+\. ([^,]+), request to change bank details\n\n\*\*Status:\*\* open", "\n" + matters.replace("## M-", "### M-"))
    held = [r["invoice_no"] for r in listed if r["vendor"] in open_bank]
    pay = [r for r in listed if r["invoice_no"] not in held]
    totals = {}
    for r in pay:
        totals[r["currency"]] = round(totals.get(r["currency"], 0) + float(r["amount"]), 2)
    approvals = [r["invoice_no"] for r in pay if (float(r["amount"]) > 5000 or r["currency"] != "USD")
                 and not r["approval_recorded"]]
    recorded = [r["invoice_no"] for r in pay if r["approval_recorded"]]
    return {"due_by": due_by.isoformat(), "pay": [r["invoice_no"] for r in pay], "held": held,
            "copies": copies, "totals": totals, "approvals": approvals, "recorded": recorded}


EXPECTED = {
    "2026-11-12": {"due_by": "2026-11-20", "pay": ["BO-23188", "OVJ-311", "BO-23190", "NMP-3480", "5188", "5155"],
                   "held": [], "copies": [], "totals": {"USD": 11930.5, "CAD": 8400.0},
                   "approvals": ["NMP-3480", "5188"], "recorded": []},
    "2026-11-19": {"due_by": "2026-11-27", "pay": ["NMP-3486", "GLE-88", "BO-23215"], "held": ["5207"],
                   "copies": ["5155 received 2026-11-18"], "totals": {"USD": 12450.0, "CAD": 2150.0},
                   "approvals": ["NMP-3486"], "recorded": ["GLE-88"]},
    "2026-11-26": {"due_by": "2026-12-04", "pay": ["5207", "NMP-3492", "BO-23240"], "held": [],
                   "copies": ["BO-23240 received 2026-11-25"], "totals": {"USD": 3750.0, "CAD": 1300.0},
                   "approvals": ["NMP-3492"], "recorded": []},
}

failed = False
for date in DATES:
    rows, matters = build(date)
    got = answer(date, rows, matters)
    got["pay"].sort(); EXPECTED[date]["pay"].sort()
    if got != EXPECTED[date]:
        failed = True
        print(f"{date}: the answer differs from the keys'.\n  got      {got}\n  expected {EXPECTED[date]}")
    else:
        print(f"{date}: wrote thursday-{date}.md; pay {got['pay']}, held {got['held']}, "
              f"copies {got['copies']}, totals {got['totals']}.")
sys.exit(1 if failed else 0)
