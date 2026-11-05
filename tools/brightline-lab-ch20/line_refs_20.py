"""Which lab file each numbered excerpt in Chapter 20's pages quotes, and every "line N" in the prose.

    python3 -I line_refs_20.py <knowledge/.../agent-loop-by-hand> <labs/brightline-lab-ch20/brightline-ap>

The editor-in-chief's check_line_refs_20.py checks the excerpts against the lab code; this one says
where each excerpt lives, so a change to a quoted file is fixed on both sides together.
"""
import re
import sys
from pathlib import Path

pages, lab = Path(sys.argv[1]), Path(sys.argv[2])
files = list(lab.glob("src/**/*.ts")) + list(lab.glob("scripts/*.ts")) + list(lab.glob("py/brightline_ap/**/*.py"))
texts = {p: p.read_text().splitlines() for p in files}
bad = 0
for page in sorted(pages.glob("*.md")):
    text = page.read_text()
    for block in re.findall(r"```(?:ts|python)\n(.*?)```", text, re.S):
        numbered = [(int(m.group(1)), m.group(2).strip()) for m in (re.match(r"^(\d{1,3}) {1,8}(.*)$", l) for l in block.splitlines()) if m]
        if not numbered:
            continue
        hits = [p for p, t in texts.items() if all(n <= len(t) and t[n - 1].strip() == c for n, c in numbered if c)]
        bad += not hits
        print(f"{page.name}: lines {numbered[0][0]}-{numbered[-1][0]} -> {', '.join(str(h.relative_to(lab)) for h in hits) or 'NO MATCH'}")
    for m in re.finditer(r"\blines? \d+(?:(?:, | to | and |-)\d+)*", text):
        line = text.count("\n", 0, m.start()) + 1
        ctx = text[max(0, m.start() - 70): m.end() + 30].replace("\n", " ")
        print(f"  prose {page.name}:{line}: ...{ctx}...")
print("excerpts with no match:", bad)
sys.exit(1 if bad else 0)
