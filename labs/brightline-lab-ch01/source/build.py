"""Build Lab 1's data: 15 invoice PDFs from the text invoices in source/invoices.

Run from anywhere:  python3 labs/brightline-lab-ch01/source/build.py
Needs Google Chrome (to print each invoice to PDF) and pdftotext (to check the result).

Each invoice keeps every field and every number of its text file. Only the look
changes: four layouts, as different vendors would send them, and file names in
the vendor's own style. The PDFs hold real text, never pictures of text, because
ChatGPT outside Enterprise reads only a PDF's text.
"""

import html
import pathlib
import re
import subprocess
import sys
import tempfile

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "invoices"
OUT = HERE.parent / "data" / "invoices"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Source file -> (published file name, layout)
FILES = {
    "invoice-01.txt": ("Invoice_4471.pdf", "clean"),
    "invoice-02.txt": ("LJS-0826.pdf", "letterhead"),
    "invoice-03.txt": ("BFL-77102.pdf", "system"),
    "invoice-04.txt": ("INV_10-55821.pdf", "clean"),
    "invoice-05.txt": ("GLP-3390.pdf", "system"),
    "invoice-06.txt": ("SFS-1188.pdf", "letterhead"),
    "invoice-07.txt": ("FCPL_bill_Sep2026.pdf", "utility"),
    "invoice-08.txt": ("RIT-2026-091.pdf", "letterhead"),
    "invoice-09.txt": ("Invoice_4471-R.pdf", "clean"),
    "invoice-10.txt": ("PCS-60214.pdf", "system"),
    "invoice-11.txt": ("ASP-5507.pdf", "clean"),
    "invoice-12.txt": ("TSL-8841.pdf", "letterhead"),
    "invoice-13.txt": ("BFL-77356.pdf", "system"),
    "invoice-14.txt": ("KSS-2290.pdf", "clean"),
    "invoice-15.txt": ("LJS-0926.pdf", "letterhead"),
}

LINE = re.compile(r"^(?P<desc>.+?)\s{2,}(?P<qty>[\d,.]+)\s+\$(?P<unit>[\d,.]+)\s+\$(?P<amount>[\d,.]+)$")
EXTRA = re.compile(r"^(?P<label>Subtotal|Freight|Delivery|Fuel surcharge|Monthly service charge|TOTAL DUE)\s+\$(?P<amount>[\d,.]+)$")
MONTHS = {m: m[:3] for m in ["January", "February", "March", "April", "May", "June", "July",
                             "August", "September", "October", "November", "December"]}


def parse(path):
    inv = {"lines": [], "extras": []}
    for raw in path.read_text().splitlines():
        line = raw.rstrip()
        if not line or line == "INVOICE" or line.startswith("Description"):
            continue
        if ":" in line and line.split(":", 1)[0] in ("Vendor", "Invoice number", "Invoice date", "Terms", "Bill to", "Reference"):
            key, value = line.split(":", 1)
            inv[key] = value.strip()
            continue
        m = EXTRA.match(line)
        if m:
            inv["extras"].append((m["label"], m["amount"]))
            continue
        m = LINE.match(line)
        if m:
            inv["lines"].append((m["desc"].strip(), m["qty"], m["unit"], m["amount"]))
            continue
        sys.exit(f"{path.name}: cannot read the line {line!r}")
    missing = [k for k in ("Vendor", "Invoice number", "Invoice date", "Terms", "Bill to", "Reference") if k not in inv]
    if missing or not inv["lines"] or inv["extras"][-1][0] != "TOTAL DUE":
        sys.exit(f"{path.name}: missing {missing or 'lines or TOTAL DUE'}")
    return inv


def e(text):
    return html.escape(text, quote=False)


def short_date(date):
    month, rest = date.split(" ", 1)
    return f"{MONTHS[month]} {rest}"


def bill_to_lines(bill_to):
    name, street, city, state_zip = [p.strip() for p in bill_to.split(",")]
    return [name, street, f"{city}, {state_zip}"]


def reference_parts(ref):
    # "PO 2026-0412. Note: resubmitted copy" keeps its note as its own line.
    if ". Note:" in ref:
        first, note = ref.split(". Note:", 1)
        return first, f"Note:{note}"
    return ref, None


BASE_CSS = "@page { size: Letter; margin: 0.7in; } * { box-sizing: border-box; } body { margin: 0; color: #111; } table { width: 100%; border-collapse: collapse; } .n { text-align: right; white-space: nowrap; }"


def layout_clean(inv):
    ref, note = reference_parts(inv["Reference"])
    rows = "".join(f"<tr><td>{e(d)}</td><td class='n'>{q}</td><td class='n'>${u}</td><td class='n'>${a}</td></tr>" for d, q, u, a in inv["lines"])
    extras = "".join(
        f"<tr class='{'grand' if label == 'TOTAL DUE' else ''}'><td>{'Total due' if label == 'TOTAL DUE' else e(label)}</td><td class='n'>${amt}</td></tr>"
        for label, amt in inv["extras"])
    note_html = f"<p class='note'>{e(note)}</p>" if note else ""
    return f"""<style>{BASE_CSS}
body {{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 10.5pt; }}
.head {{ display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5pt solid #111; padding-bottom: 10pt; }}
.vendor {{ font-size: 17pt; font-weight: 700; margin: 0; }}
.word {{ font-size: 20pt; font-weight: 300; letter-spacing: 6pt; color: #555; margin: 0; }}
.meta {{ display: grid; grid-template-columns: 1fr 1fr; gap: 8pt 24pt; margin: 16pt 0; }}
.lbl {{ font-size: 7.5pt; text-transform: uppercase; letter-spacing: 1pt; color: #666; margin: 0 0 2pt; }}
.val {{ margin: 0; }}
.note {{ margin: 0 0 12pt; font-weight: 700; }}
.lines th {{ text-align: left; border-bottom: 1pt solid #111; padding: 5pt 6pt 5pt 0; font-size: 9pt; }}
.lines th.n {{ text-align: right; }}
.lines td {{ padding: 6pt 6pt 6pt 0; border-bottom: 0.5pt solid #ccc; }}
.tot {{ width: 46%; margin: 12pt 0 0 auto; }}
.tot td {{ padding: 3pt 0; }}
.tot .grand td {{ font-weight: 700; font-size: 12pt; border-top: 2pt solid #111; padding-top: 6pt; }}
</style>
<div class="head"><p class="vendor">{e(inv['Vendor'])}</p><p class="word">INVOICE</p></div>
<div class="meta">
<div><p class="lbl">Invoice number</p><p class="val">{e(inv['Invoice number'])}</p></div>
<div><p class="lbl">Invoice date</p><p class="val">{e(inv['Invoice date'])}</p></div>
<div><p class="lbl">Terms</p><p class="val">{e(inv['Terms'])}</p></div>
<div><p class="lbl">Reference</p><p class="val">{e(ref)}</p></div>
<div><p class="lbl">Bill to</p><p class="val">{'<br>'.join(e(x) for x in bill_to_lines(inv['Bill to']))}</p></div>
</div>
{note_html}
<table class="lines"><thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Unit price</th><th class="n">Amount</th></tr></thead><tbody>{rows}</tbody></table>
<table class="tot">{extras}</table>"""


def layout_system(inv):
    rows = "".join(f"<tr><td>{e(d.upper())}</td><td class='n'>{q}</td><td class='n'>{u}</td><td class='n'>{a}</td></tr>" for d, q, u, a in inv["lines"])
    extras = "".join(
        f"<tr class='{'due' if label == 'TOTAL DUE' else 'sum'}'><td colspan='3'>{'TOTAL DUE USD' if label == 'TOTAL DUE' else e(label.upper())}</td><td class='n'>{amt}</td></tr>"
        for label, amt in inv["extras"])
    ref = inv["Reference"]
    ref_label, ref_value = ("YOUR PO", ref[3:]) if ref.startswith("PO ") else ("REFERENCE", ref)
    return f"""<style>{BASE_CSS}
body {{ font-family: Menlo, "Courier New", Courier, monospace; font-size: 9.5pt; }}
.box {{ border: 1.5pt solid #111; padding: 10pt 12pt; display: flex; justify-content: space-between; margin-bottom: 14pt; }}
.box p {{ margin: 0; font-weight: 700; letter-spacing: 0.5pt; }}
dl {{ display: grid; grid-template-columns: max-content 1fr; gap: 3pt 18pt; margin: 0 0 16pt; }}
dt {{ color: #555; }} dd {{ margin: 0; }}
.lines th {{ text-align: left; border-top: 1pt dashed #111; border-bottom: 1pt dashed #111; padding: 5pt 6pt 5pt 0; }}
.lines th.n {{ text-align: right; }}
.lines td {{ padding: 5pt 6pt 5pt 0; vertical-align: top; }}
.lines tr.sum:first-of-type td {{ border-top: 1pt dashed #111; }}
.lines tr.due td {{ font-weight: 700; border-top: 1pt dashed #111; }}
</style>
<div class="box"><p>{e(inv['Vendor'].upper())}</p><p>INVOICE {e(inv['Invoice number'])}</p></div>
<dl>
<dt>DATE</dt><dd>{e(short_date(inv['Invoice date']))}</dd>
<dt>TERMS</dt><dd>{e(inv['Terms'].upper())}</dd>
<dt>{ref_label}</dt><dd>{e(ref_value)}</dd>
<dt>SOLD TO</dt><dd>{'<br>'.join(e(x.upper()) for x in bill_to_lines(inv['Bill to']))}</dd>
</dl>
<table class="lines"><thead><tr><th>ITEM</th><th class="n">QTY</th><th class="n">PRICE</th><th class="n">EXT</th></tr></thead><tbody>{rows}{extras}</tbody></table>"""


def layout_letterhead(inv):
    rows = "".join(f"<tr><td>{e(d)}</td><td class='n'>{q}</td><td class='n'>${u}</td><td class='n'>${a}</td></tr>" for d, q, u, a in inv["lines"])
    extras = "".join(
        f"<tr class='{'grand' if label == 'TOTAL DUE' else ''}'><td colspan='3' class='n'>{'Total due' if label == 'TOTAL DUE' else e(label)}</td><td class='n'>${amt}</td></tr>"
        for label, amt in inv["extras"])
    return f"""<style>{BASE_CSS}
body {{ font-family: Georgia, "Times New Roman", Times, serif; font-size: 11pt; }}
.lh {{ text-align: center; border-bottom: 0.75pt solid #111; padding-bottom: 10pt; margin-bottom: 18pt; }}
.lh h1 {{ font-size: 19pt; font-weight: 400; letter-spacing: 1pt; margin: 0; }}
h2 {{ font-size: 13pt; font-weight: 400; font-style: italic; margin: 0 0 12pt; }}
.two {{ display: flex; justify-content: space-between; gap: 24pt; margin-bottom: 18pt; }}
.two p {{ margin: 0 0 3pt; }}
.k {{ color: #555; }}
.lines th {{ text-align: left; font-weight: 400; font-style: italic; border-bottom: 0.75pt solid #111; padding: 5pt 6pt 5pt 0; }}
.lines th.n {{ text-align: right; }}
.lines td {{ padding: 6pt 6pt 6pt 0; }}
.lines tr.grand td {{ font-weight: 700; border-top: 0.75pt solid #111; }}
</style>
<div class="lh"><h1>{e(inv['Vendor'])}</h1></div>
<h2>Invoice</h2>
<div class="two">
<div><p class="k">Bill to</p>{''.join(f'<p>{e(x)}</p>' for x in bill_to_lines(inv['Bill to']))}</div>
<div><p><span class="k">Invoice number:</span> {e(inv['Invoice number'])}</p><p><span class="k">Invoice date:</span> {e(inv['Invoice date'])}</p><p><span class="k">Terms:</span> {e(inv['Terms'])}</p><p><span class="k">Reference:</span> {e(inv['Reference'])}</p></div>
</div>
<table class="lines"><thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Unit price</th><th class="n">Amount</th></tr></thead><tbody>{rows}{extras}</tbody></table>"""


def layout_utility(inv):
    rows = "".join(f"<tr><td>{e(d)}</td><td class='n'>{q}</td><td class='n'>${u}</td><td class='n'>${a}</td></tr>" for d, q, u, a in inv["lines"])
    extras = "".join(f"<tr><td colspan='3'>{e(label)}</td><td class='n'>${amt}</td></tr>" for label, amt in inv["extras"] if label != "TOTAL DUE")
    total = inv["extras"][-1][1]
    account = inv["Reference"].replace("Account ", "")
    return f"""<style>{BASE_CSS}
body {{ font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 10pt; }}
.top {{ display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1pt solid #111; padding-bottom: 8pt; }}
.top h1 {{ font-size: 15pt; margin: 0; }}
.top p {{ margin: 0; color: #555; }}
.grid {{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10pt; margin: 14pt 0; }}
.cell {{ border: 0.75pt solid #999; padding: 7pt 9pt; }}
.cell p {{ margin: 0; }}
.cell .k {{ font-size: 7.5pt; text-transform: uppercase; letter-spacing: 1pt; color: #666; }}
.due {{ border: 2pt solid #111; padding: 10pt 12pt; display: flex; justify-content: space-between; font-size: 13pt; font-weight: 700; margin: 16pt 0; }}
.lines th {{ text-align: left; font-size: 8.5pt; background: #eee; padding: 5pt 6pt; }}
.lines th.n {{ text-align: right; }}
.lines td {{ padding: 6pt; border-bottom: 0.5pt solid #ddd; }}
.bill {{ margin: 0 0 12pt; }}
</style>
<div class="top"><h1>{e(inv['Vendor'])}</h1><p>Electric bill</p></div>
<div class="grid">
<div class="cell"><p class="k">Account number</p><p>{e(account)}</p></div>
<div class="cell"><p class="k">Invoice number</p><p>{e(inv['Invoice number'])}</p></div>
<div class="cell"><p class="k">Invoice date</p><p>{e(inv['Invoice date'])}</p></div>
<div class="cell"><p class="k">Terms</p><p>{e(inv['Terms'])}</p></div>
</div>
<p class="bill">Bill to: {e(inv['Bill to'])}</p>
<table class="lines"><thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Unit price</th><th class="n">Amount</th></tr></thead><tbody>{rows}{extras}</tbody></table>
<div class="due"><span>Total due</span><span>${total}</span></div>"""


LAYOUTS = {"clean": layout_clean, "system": layout_system, "letterhead": layout_letterhead, "utility": layout_utility}


def money(s):
    return round(float(s.replace(",", "")), 2)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.pdf"):
        old.unlink()
    total = 0.0
    with tempfile.TemporaryDirectory() as tmp:
        for src_name, (pdf_name, layout) in FILES.items():
            inv = parse(SRC / src_name)
            title = f"{inv['Vendor']} {inv['Invoice number']}"
            page = f"<!doctype html><html><head><meta charset='utf-8'><title>{e(title)}</title></head><body>{LAYOUTS[layout](inv)}</body></html>"
            html_path = pathlib.Path(tmp) / (pdf_name + ".html")
            html_path.write_text(page)
            pdf_path = OUT / pdf_name
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                            f"--print-to-pdf={pdf_path}", html_path.as_uri()],
                           check=True, capture_output=True)
            # Check the PDF's own text: every field and every number must be readable.
            text = subprocess.run(["pdftotext", "-layout", str(pdf_path), "-"], check=True,
                                  capture_output=True, text=True).stdout
            flat = " ".join(text.split()).upper()
            needed = [inv["Vendor"], inv["Invoice number"], inv["Terms"]] + [a for *_, a in inv["lines"]] + [a for _, a in inv["extras"]]
            for item in needed:
                if " ".join(item.split()).upper() not in flat:
                    sys.exit(f"{pdf_name}: {item!r} is not in the PDF's text")
            total += money(inv["extras"][-1][1])
            print(f"{pdf_name:24} {layout:10} {inv['extras'][-1][1]:>10}")
    print(f"{'15 stated totals':35} {total:>10,.2f}")
    if abs(total - 33796.98) > 0.005:
        sys.exit("The stated totals no longer add up to $33,796.98")


if __name__ == "__main__":
    main()
