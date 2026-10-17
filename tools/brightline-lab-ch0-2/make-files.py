"""Make the practice files for Labs 0.2 and 0.3 of The AI Agent Factory, Second Edition.

python3 tools/brightline-lab-ch0-2/make-files.py        (from the repository's root)

Writes labs/brightline-lab-ch0-2/files/ and labs/brightline-lab-ch0-3/files/, and checks its own
totals. The policy text is Brightline's AP policy, version 3, as the book quotes it (sections 2, 4,
5 and 7). The PDF is drawn with reportlab (pip install reportlab) in the PDF's standard Helvetica,
which a PDF reader supplies, so the file stays a few kilobytes and every AI can read its text.
Every name, address and number in these files is invented."""
import csv, datetime as dt, shutil, sys
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LAB2, LAB3 = ROOT / "labs/brightline-lab-ch0-2/files", ROOT / "labs/brightline-lab-ch0-3/files"

POLICY = [
    ("2. Payment terms", [
        ("2.1", "Pay each vendor on the terms in its vendor record in the accounting system. The vendor record is the authority on terms."),
        ("2.2", "Do not pay before the due date unless the vendor offers an early-payment discount and the controller approves it.")]),
    ("4. Approval before payment", [
        ("4.1", "Invoices over $5,000.00 need the controller's approval before payment."),
        ("4.2", "Approval is recorded by the controller in the accounting system, from the controller's own login. An approval sent by email or chat is not an approval."),
        ("4.3", "The controller approves every weekly payment run as a whole, in addition to 4.1.")]),
    ("5. Vendor details", [
        ("5.1", "Never change a vendor's bank details because of an email. Call the vendor back on the phone number already in the vendor record.")]),
    ("7. Vendor statement reconciliation", [
        ("7.1", "Reconcile the statement of every vendor with more than $5,000 of monthly purchases each month, by the third business day after month end."),
        ("7.2", "The reconciliation must explain the whole difference between the vendor's statement balance and Brightline's register balance. The unexplained difference must be $0.00. Never close a gap with a balancing entry."),
        ("7.3", "Timing differences need no action, but must be listed. A timing difference is a payment Brightline sent after the statement date, or an invoice dated after the statement date."),
        ("7.4", "Never change the register to match a vendor statement. A register correction needs the source document and the Controller's approval."),
        ("7.5", "Record a vendor credit only after the credit memo is received and the Controller approves it."),
        ("7.6", "An invoice that appears on a statement but not in the register is requested from the vendor. It is matched to the receiving record before it is entered."),
        ("7.7", "Do not contact a vendor about a reconciliation without the Controller's approval.")]),
]

# Brightline's register: the unpaid invoices on Monday, September 14, 2026. Net 30 from the invoice date.
INVOICES = [  # vendor, invoice, due date, amount
    ("Midwest Packaging", "4519", "2026-09-11", "2184.60"),
    ("Buckeye Office Supply", "BO-23561", "2026-09-15", "312.45"),
    ("County Freight", "5208", "2026-09-16", "6420.00"),
    ("Maple Paper", "MPL-1187", "2026-09-17", "1058.75"),
    ("Midwest Packaging", "4526", "2026-09-18", "3977.10"),
    ("Buckeye Office Supply", "BO-23577", "2026-09-18", "486.20"),
    ("County Freight", "5214", "2026-09-21", "8400.00"),
    ("Maple Paper", "MPL-1192", "2026-09-23", "2915.30"),
    ("Midwest Packaging", "4533", "2026-09-25", "1640.00"),
    ("Buckeye Office Supply", "BO-23590", "2026-09-28", "725.85"),
    ("County Freight", "5221", "2026-10-02", "3310.40"),
    ("Maple Paper", "MPL-1201", "2026-10-09", "5612.90"),
]
FRIDAY = "2026-09-18"
DUE_BY_FRIDAY = {"count": 6, "total": Decimal("14439.10")}

EMAIL = """Invented for Lab 0.2 of The AI Agent Factory. Every name, address and number in it is made up.

From: Karen Holt <accounts@maple-paper-billing.example>
To: AP team <ap@brightline.example>
Date: Monday, September 14, 2026, 8:12 a.m.
Subject: Updated bank details for Maple Paper

Hello Brightline AP team,

Our bank has changed. Please send this week's payment for invoice MPL-1187 ($1,058.75), and every payment after it, to our new account:

Bank: First Lakes Bank
Account name: Maple Paper Co.
Routing number: 000000000
Account number: 0000001234

Please update your records today, so that this week's payment run goes to the right account.

Thank you,
Karen Holt
Accounts Receivable, Maple Paper
"""

NOTES = """Brightline AP notes, written by several people over time.

We pay vendors once a week, on Friday. Anything over $5,000 needs Dave's approval before we pay it. Dave is thinking of raising the limit to $10,000 next year. If a vendor emails new bank details, confirm by replying to their email, then update the record. Nobody knows yet what to do with an invoice in Canadian dollars.
"""


def write_pdf(out):
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
    ink, grey, rule = colors.HexColor("#1d2433"), colors.HexColor("#5b6475"), colors.HexColor("#c9ced8")
    org = ParagraphStyle("org", fontName="Helvetica", fontSize=9.5, textColor=grey, leading=12)
    title = ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=20, textColor=ink, leading=24, spaceBefore=4, spaceAfter=10)
    note = ParagraphStyle("note", fontName="Helvetica", fontSize=9.5, textColor=grey, leading=12, spaceBefore=6, spaceAfter=4)
    head = ParagraphStyle("head", fontName="Helvetica-Bold", fontSize=13, textColor=ink, leading=16, spaceBefore=12, spaceAfter=2)
    line = ParagraphStyle("line", fontName="Helvetica", fontSize=11, textColor=ink, leading=15)
    num = ParagraphStyle("num", parent=line, fontName="Helvetica-Bold")
    foot = ParagraphStyle("foot", fontName="Helvetica", fontSize=8.5, textColor=grey, leading=11, spaceBefore=16)
    meta = Table([[k, v] for k, v in (("Version", "3"), ("Status", "Approved"), ("Owner", "Dave Kowalski, Controller"),
                  ("Approved", "September 1, 2026, by Dave Kowalski"), ("Supersedes", "Version 2 (June 2, 2026)"))],
                 colWidths=[1.0 * inch, 4.5 * inch], hAlign="LEFT")
    meta.setStyle(TableStyle([("FONT", (0, 0), (0, -1), "Helvetica-Bold", 9.5), ("FONT", (1, 0), (1, -1), "Helvetica", 9.5),
                              ("TEXTCOLOR", (0, 0), (-1, -1), ink), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                              ("BOTTOMPADDING", (0, 0), (-1, -1), 2), ("TOPPADDING", (0, 0), (-1, -1), 1)]))
    story = [Paragraph("BRIGHTLINE WHOLESALE SUPPLY", org), Paragraph("Accounts Payable Policy", title), meta, Spacer(1, 8),
             HRFlowable(width="100%", thickness=0.6, color=rule), Paragraph("Excerpt: sections 2, 4, 5 and 7.", note)]
    for heading, lines in POLICY:
        story += [Paragraph(heading, head), HRFlowable(width="100%", thickness=0.6, color=rule, spaceAfter=6)]
        rows = Table([[Paragraph(n, num), Paragraph(text, line)] for n, text in lines], colWidths=[0.42 * inch, None], hAlign="LEFT")
        rows.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                  ("RIGHTPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 5), ("TOPPADDING", (0, 0), (-1, -1), 0)]))
        story.append(rows)
    story.append(Paragraph("Brightline Wholesale Supply is invented for The AI Agent Factory, Second Edition.", foot))
    SimpleDocTemplate(str(out), pagesize=letter, leftMargin=0.9 * inch, rightMargin=0.9 * inch, topMargin=0.85 * inch,
                      bottomMargin=0.8 * inch, title="Brightline Wholesale Supply: Accounts Payable Policy, version 3",
                      author="Brightline Wholesale Supply", subject="AP policy, version 3 (invented for The AI Agent Factory)").build(story)


def write_csv(out):
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["Vendor", "Invoice", "Invoice date", "Due date", "Amount (USD)"])
        for vendor, inv, due, amount in INVOICES:
            invoice_date = dt.date.fromisoformat(due) - dt.timedelta(days=30)
            w.writerow([vendor, inv, invoice_date.isoformat(), due, f"{Decimal(amount):,.2f}"])


def check():
    due = [(v, i, a) for v, i, d, a in INVOICES if d <= FRIDAY]
    total = sum(Decimal(a) for _, _, a in due)
    assert len(due) == DUE_BY_FRIDAY["count"] and total == DUE_BY_FRIDAY["total"], (len(due), total)
    early = Decimal("8400.00")
    discount, pay = early * Decimal("0.02"), early * Decimal("0.98")
    interest = pay * Decimal("0.12") * 20 / 365
    print(f"due by Friday {FRIDAY}: {len(due)} invoices, ${total:,.2f}")
    print(f"County Freight 5214: discount ${discount:,.2f}, interest ${interest:,.2f}, saving ${discount - interest:,.2f}")
    with open(LAB2 / "invoices-this-week.csv", newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    assert len(rows) == len(INVOICES)
    assert sum(Decimal(r["Amount (USD)"].replace(",", "")) for r in rows if r["Due date"] <= FRIDAY) == total


def main():
    for d in (LAB2, LAB3):
        d.mkdir(parents=True, exist_ok=True)
    write_pdf(LAB2 / "ap-policy-v3.pdf")
    write_csv(LAB2 / "invoices-this-week.csv")
    (LAB2 / "vendor-email.txt").write_text(EMAIL, encoding="utf-8")
    shutil.copy(LAB2 / "ap-policy-v3.pdf", LAB3 / "ap-policy-v3.pdf")
    shutil.copy(LAB2 / "invoices-this-week.csv", LAB3 / "invoices-this-week.csv")
    (LAB3 / "ap-notes.txt").write_text(NOTES, encoding="utf-8")
    check()
    for d in (LAB2, LAB3):
        print(d.relative_to(ROOT), sorted(p.name for p in d.iterdir()))


if __name__ == "__main__":
    sys.exit(main())
