"""Build Lab 19's folder from Zia's history (ch18, lab19-start, ch19) and our released Lab 18.
  start/     brightline-ap at lab19-start: our ch18 + Zia's new starting files, the week moved
  keyfiles/  answer-key/files: every file ch19 adds or changes, the week moved, merged with our Chapter 18 fixes
  ch19/      the whole finished repository, for the tests
"""
import os, re, sys, shutil, subprocess, pathlib, datetime as dt
B = pathlib.Path(sys.argv[1]); LAB18 = pathlib.Path(sys.argv[2]); OUT = B / "out"
Z18, Z19S, Z19 = B / "Z-ch18", B / "Z-lab19-start", B / "Z-ch19"
SHIFT = dt.timedelta(days=119)
MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
NO_DATES = {"py/uv.lock", "package-lock.json", "answer-key/expected.md"}   # tool timestamps, and the authors' own record
NO_DATES_PREFIX = ("ports/",)                             # the authors' own run records keep their real dates

def iso(m):
    d = dt.date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    if d.year != 2026 or d < dt.date(2026, 8, 1): return m.group(0)   # 2026-07-28 is MCP's revision, not the story
    return (d + SHIFT).isoformat()
def us(m):
    d = dt.date(2026, int(m.group(1)), int(m.group(2)))
    if d < dt.date(2026, 8, 1): return m.group(0)
    d += SHIFT; return f"{d.month:02d}/{d.day:02d}/{d.year}"
def long(m):
    wd, mon, day = m.group(1), m.group(2), int(m.group(3))
    d = dt.date(2026, MONTHS.index(mon) + 1, day)
    if d < dt.date(2026, 8, 1): return m.group(0)
    d += SHIFT; s = f"{MONTHS[d.month-1]} {d.day}, {d.year}"
    return (f"{DAYS[d.weekday()]}, " if wd else "") + s

def T(rel, text):
    text = re.sub(r"INV-51(\d\d)", r"INV-83\1", text)
    text = text.replace("LAB-19.md", "LAB.md").replace("LAB-18.md", "LAB.md")
    text = text.replace("Ana Torres, AP lead", "Ana Morales, AP analyst").replace("Ana Torres", "Ana Morales")
    if rel in NO_DATES or rel.startswith(NO_DATES_PREFIX): return text
    out = []
    for line in text.split("\n"):
        if "compatibility_date" in line: out.append(line); continue      # a real Cloudflare date
        line = re.sub(r"(?<!\d)(2026)-(\d\d)-(\d\d)(?![\dT])", iso, line)  # dates, not test clocks (as Lab 18)
        line = re.sub(r"(?<!\d)(\d\d)/(\d\d)/2026(?!\d)", us, line)
        line = re.sub(r"(?:(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), )?(" + "|".join(MONTHS) + r") (\d{1,2}), 2026", long, line)
        out.append(line)
    return "\n".join(out)

def special(rel, text):
    if rel == "data-cedar/purchase-orders.csv":      # the utilities' blanket PO is "each January": the moved year's January, same weekday
        assert "2026-01-05" in text; text = text.replace("2026-01-05", "2027-01-04")
    if rel == "exercises/3nf/docs_flat.sql":
        text = text.replace("-- the company's AP lead's email", "-- the company's AP contact's email")
    if rel in ("docs/data-spec.md", "answer-key/data-spec.md"):   # Brightline's expert is Ana, the AP analyst
        text = text.replace("builder answering as each company's AP lead.", "builder answering as each company's AP expert.")
        text = text.replace("(Ana, AP lead)", "(Ana, AP analyst)")
    if rel == "answer-key/3nf-refactor.sql":
        text = text.replace("the AP lead's email", "the AP contact's email")
    if rel == "py/tests/test_connector.py":   # Lab 18 moved the number, not its comment
        text = text.replace("START_MS = 1_804_514_400_000  # 2026-11-09T14:00:00Z", "START_MS = 1_804_514_400_000  # 2027-03-08T14:00:00Z")
    if rel == "README.md":
        text = text.replace("(Lab 19, Task 2b)", "(Lab 19, Task 3b)")
    if rel == "servers/ap-ts/test/helpers.ts":
        text = text.replace("with all four companies loaded (Lab 19 Task 4)", "with the three companies loaded (Lab 19 Task 4)")
    if rel == "ports/ch19.md":
        text = text.replace(" Full record: `authors/planted-bugs-2026-11-02.md`.", "")
    if rel == "concept-blocks/sql/README.md":
        text = text.replace("the ones printed in Concepts 19.3 (blocks 1 to 6) and 19.14 (blocks 7 to 14)",
                            "the ones printed in Concept 19.3 (blocks 1 to 5), field guide F1 (block 6), Concept 19.14 (blocks 7 to 10 and 14) and field guide F4 (blocks 11 to 13)")
    if rel == "answer-key/expected.md":
        text = text.replace("`check:queries`: 22 statements. `conformance`: `81 checks passed, 0 failed`",
                            "`check:queries`: 22 statements, once Task 7 adds `db.py` (fewer at Task 6). `conformance`: `81 checks passed, 0 failed`, after Task 7")
    if rel == "answer-key/README.md":
        text = text.replace("both AP leads' answers", "both AP experts' answers")
    return text

def files(root):
    return {p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file() and ".git" not in p.parts}
def read(p):
    try: return p.read_text(encoding="utf-8")
    except UnicodeDecodeError: return None

shutil.rmtree(OUT, ignore_errors=True)
O18 = OUT / "ours-ch18"; shutil.copytree(LAB18 / "brightline-ap", O18)
for rel in files(LAB18 / "answer-key" / "files"):
    d = O18 / rel; d.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(LAB18 / "answer-key" / "files" / rel, d)

# 1. Validate the transform against what our Chapter 18 run released.
resid = []
for rel in sorted(files(Z18)):
    z, o = read(Z18 / rel), (read(O18 / rel) if (O18 / rel).exists() else "<missing>")
    if z is None: continue
    if T(rel, z) != o: resid.append(rel)
only_ours = sorted(files(O18) - files(Z18))
print(f"ch18 files whose ours != T(zia): {len(resid)}"); print("  " + "\n  ".join(r for r in resid if not r.startswith("docs/chapter-18/")))
print(f"files only in ours: {only_ours}")

# 2. The starting folder: our ch18 plus Zia's new starting files, moved.
START = OUT / "start"; shutil.copytree(O18, START)
f = START / "py/tests/test_connector.py"; f.write_text(special("py/tests/test_connector.py", f.read_text()))
# The test embedder ships at the start: the chapter's numbers come from it, and run.mjs imports it (Task 4).
(START / "servers/ap-ts/src/embeddings.ts").write_text((B.parent / "scripts/lab19-start-embeddings.ts").read_text())
# AGENTS.md: the remote-SQL rule as the finished file words it, so the dev and ci branches are the builder's own.
a = START / "AGENTS.md"; at = a.read_text()
old = "- Never run SQL against a remote database (`wrangler d1 execute ... --remote`), except a read-only `SELECT` the person asks for in this session."
assert old in at; a.write_text(at.replace(old, "- Never run SQL against a remote database (`wrangler d1 execute ... --remote`, or `psql` against staging or production), except a read-only `SELECT` the person asks for in this session."))
added = sorted(files(Z19S) - files(Z18))
for rel in added:
    d = START / rel; d.parent.mkdir(parents=True, exist_ok=True)
    t = read(Z19S / rel)
    if t is None: shutil.copy2(Z19S / rel, d)
    else: d.write_text(special(rel, T(rel, t)))
print(f"added at lab19-start: {len(added)}")

# 3. The finished files: everything ch19 adds or changes, merged three ways with our Chapter 18 fixes.
KEY = OUT / "keyfiles"; conflicts = []; merged = []
s19, s19s = files(Z19), files(Z19S)
changed = sorted(r for r in s19 if r not in s19s or read(Z19 / r) != read(Z19S / r))
deleted = sorted(s19s - s19)
for rel in changed:
    theirs = read(Z19 / rel); d = KEY / rel; d.parent.mkdir(parents=True, exist_ok=True)
    if theirs is None: shutil.copy2(Z19 / rel, d); continue
    theirs = special(rel, T(rel, theirs))
    if rel in s19s:
        base = special(rel, T(rel, read(Z19S / rel))); ours = read(START / rel)
        # AGENTS.md: our only change at the start is the finished file's own line, so the finished file is his.
        if ours != base and rel != "AGENTS.md":
            tmp = OUT / "merge"; tmp.mkdir(exist_ok=True)
            (tmp / "o").write_text(ours); (tmp / "b").write_text(base); (tmp / "t").write_text(theirs)
            r = subprocess.run(["git", "merge-file", "-p", "-L", "ours", "-L", "base", "-L", "zia-ch19", str(tmp / "o"), str(tmp / "b"), str(tmp / "t")], capture_output=True, text=True)
            theirs = r.stdout; merged.append(rel)
            if r.returncode != 0: conflicts.append(rel)
    d.write_text(theirs)
print(f"ch19 changed: {len(changed)}, merged with our fixes: {merged}, conflicts: {conflicts}, deleted: {deleted}")

# 4. The whole finished repository, for the tests.
CH19 = OUT / "ch19"; shutil.copytree(START, CH19)
for rel in files(KEY): d = CH19 / rel; d.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(KEY / rel, d)
for rel in deleted: (CH19 / rel).unlink(missing_ok=True)
(OUT / "deleted.txt").write_text("\n".join(deleted) + "\n")

# 5. The lab folder's own files beside the repository: the concept blocks, the questions file, the authors' key files.
PKG = pathlib.Path(sys.argv[3]); ROOTF = OUT / "labroot"
for sub in ("concept-blocks", "lab-files", "answer-key"):
    for p in (PKG / sub).rglob("*"):
        if not p.is_file(): continue
        rel = p.relative_to(PKG).as_posix(); d = ROOTF / rel; d.parent.mkdir(parents=True, exist_ok=True)
        t = read(p)
        if t is None: shutil.copy2(p, d)
        else: d.write_text(special(rel, T(rel, t)))
print("lab root files:", len(files(ROOTF)))
