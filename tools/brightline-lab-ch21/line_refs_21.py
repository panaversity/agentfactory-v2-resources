"""Which lab file each numbered excerpt in Chapter 21's pages quotes. Lab 20's line_refs_20.py, for Lab 21.

    python3 -I line_refs_21.py <knowledge/.../agent-sdks> <labs/brightline-lab-ch21/brightline-ap>

Each ```ts or ```python block whose lines start with a line number must equal, line for line, the same
lines of one lab file. A change to a quoted file is then fixed on both sides together.
"""
import re
import sys
from pathlib import Path

pages, lab = Path(sys.argv[1]), Path(sys.argv[2])
files = [p for g in ("src/**/*.ts", "scripts/*.ts", "tests/*.ts", "py/brightline_ap/**/*.py", "py/tests/*.py") for p in lab.glob(g)]
texts = {p: p.read_text().splitlines() for p in files}
bad = 0
for page in sorted(pages.glob("*.md")):
    for block in re.findall(r"```(?:ts|python)\n(.*?)```", page.read_text(), re.S):
        numbered = [(int(m.group(1)), m.group(2).strip()) for m in (re.match(r"^(\d{1,3}) {1,16}(.*)$", l) for l in block.splitlines()) if m]
        if not numbered:
            continue
        hits = [p for p, t in texts.items() if all(n <= len(t) and t[n - 1].strip() == c for n, c in numbered if c)]
        bad += not hits
        print(f"{page.name}: lines {numbered[0][0]}-{numbered[-1][0]} -> {', '.join(str(h.relative_to(lab)) for h in hits) or 'NO MATCH'}")
print("excerpts with no match:", bad)
sys.exit(1 if bad else 0)
