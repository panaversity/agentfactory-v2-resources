#!/usr/bin/env python3
"""Static audit of the week move: apply the move to the AUTHORS' tree, then diff the result with OUR tree.

Usage: python3 -I audit-move.py <authors-tree> <our-tree> [--max-lines N]
The move (as briefed):
  - invoice numbers INV-51NN -> INV-83NN
  - story dates from 2026-08-01 to 2026-12-31 move +119 days
    (not moved: dates with a time part such as 2026-11-09T14:00:00Z, `compatibility_date` lines, ports/ run records)
  - Cedar Ridge's blanket PO 2026-01-05 -> 2027-01-04 (data-cedar/purchase-orders.csv)
  - "Ana Torres" -> "Ana Morales"
What is left in the diff is either an edit the team made on purpose (a Chapter 18 fix, a wording change) or a
place where the move was done differently or not at all. Lists files that exist on one side only, then every
differing file with its changed lines (authors-after-move first, '-', then ours, '+').
"""
import datetime as dt, difflib, os, re, sys

args = [a for a in sys.argv[1:] if not a.startswith("--")]
maxl = int(sys.argv[sys.argv.index("--max-lines") + 1]) if "--max-lines" in sys.argv else 60
if "--max-lines" in sys.argv: args.remove(sys.argv[sys.argv.index("--max-lines") + 1])
authors, ours = args[0], args[1]

LO, HI, MOVE = dt.date(2026, 8, 1), dt.date(2026, 12, 31), dt.timedelta(days=119)
DATE = re.compile(r"(?<![\d-])(\d{4})-(\d{2})-(\d{2})(?!\d)(?!T\d)")

def move_dates(line):
    def r(m):
        try: d = dt.date(int(m[1]), int(m[2]), int(m[3]))
        except ValueError: return m[0]
        return (d + MOVE).isoformat() if LO <= d <= HI else m[0]
    return DATE.sub(r, line)

def M(path, text):
    out = []
    for line in text.split("\n"):
        line = line.replace("Ana Torres", "Ana Morales")
        line = re.sub(r"INV-51(\d\d)", r"INV-83\1", line)
        if path == "data-cedar/purchase-orders.csv":
            line = line.replace("2026-01-05", "2027-01-04")
        if not path.startswith("ports/") and "compatibility_date" not in line:
            line = move_dates(line)
        out.append(line)
    return "\n".join(out)

def files(root):
    for d, _, fs in os.walk(root):
        for f in fs:
            p = os.path.join(d, f)
            yield os.path.relpath(p, root)

A, O = set(files(authors)), set(files(ours))
print(f"only in the authors' tree: {sorted(A - O) or 'none'}")
print(f"only in our tree:          {sorted(O - A) or 'none'}")
nd = nl = 0
for p in sorted(A & O):
    try:
        a = open(os.path.join(authors, p), encoding="utf8").read()
        o = open(os.path.join(ours, p), encoding="utf8").read()
    except UnicodeDecodeError:
        if open(os.path.join(authors, p), "rb").read() != open(os.path.join(ours, p), "rb").read():
            print(f"\n### {p}: binary file differs"); nd += 1
        continue
    am = M(p, a)
    if am == o: continue
    nd += 1
    diff = [l for l in difflib.unified_diff(am.split("\n"), o.split("\n"), "authors+move", "ours", lineterm="", n=0) if not l.startswith(("---", "+++"))]
    nl += sum(1 for l in diff if l[:1] in "+-")
    print(f"\n### {p}")
    for l in diff[:maxl]: print("   " + l[:240])
    if len(diff) > maxl: print(f"   ... {len(diff) - maxl} more diff lines")
print(f"\n== {nd} file(s) differ after the move was applied to the authors' tree; {nl} changed lines in all")
