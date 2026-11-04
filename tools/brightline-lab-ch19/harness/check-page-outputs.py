#!/usr/bin/env python3
"""Compare what the chapter pages print for the concept blocks with what the blocks really output.

Usage: python3 -I check-page-outputs.py <blocks-dir> <page.md> [<page.md> ...]
  <blocks-dir> holds NN-name.sql (the lab's concept-blocks/sql files) and NN-name.out (the real output of
  `node concept-blocks/sql/run.mjs NN-name.sql`, captured by the caller).
Each ```sql fence on a page that looks like a concept block is paired with the ```text fence that follows it.
Prints, per pair: whether the page's SQL equals the lab file's SQL, and whether the printed output equals the
real output (row-count footers such as "(3 rows)" are ignored when the page leaves them out).
Exit status 1 if any pair differs.
"""
import difflib, glob, os, re, sys

blocks_dir, pages = sys.argv[1], sys.argv[2:]

def norm_sql(text):
    text = "\n".join(l for l in text.splitlines() if not l.strip().startswith("--"))
    stmts = [re.sub(r"\s+", " ", s).strip() for s in re.split(r";\s*(?:\n|$)", text)]
    return [s.rstrip(";").strip() for s in stmts if s.strip()]

files = {}
for sql_path in sorted(glob.glob(os.path.join(blocks_dir, "[0-9][0-9]-*.sql"))):
    n = int(os.path.basename(sql_path)[:2])
    out_path = sql_path[:-4] + ".out"
    raw = open(sql_path, encoding="utf8").read()
    real = open(out_path, encoding="utf8").read() if os.path.exists(out_path) else ""
    # split the real output into one chunk per statement ("> sql" line, then its result lines)
    chunks, cur = [], None
    for line in real.splitlines():
        if line.startswith("> "):
            cur = {"sql": line[2:], "lines": []}
            chunks.append(cur)
        elif cur is not None:
            cur["lines"].append(line.rstrip())
    for c in chunks:
        while c["lines"] and c["lines"][-1] == "":
            c["lines"].pop()
    files[n] = {"name": os.path.basename(sql_path), "stmts": norm_sql(raw), "chunks": chunks}

FOOTER = re.compile(r"^\(\d+ rows?\)$")
def strip_footer(lines):
    lines = [l for l in lines if not FOOTER.match(l)]
    if len(lines) >= 2 and lines[0] == "QUERY PLAN" and set(lines[1]) <= set("-+"):   # EXPLAIN's header, which the page drops
        lines = lines[2:]
    return lines

def fences(md):
    """yield (kind, start_line, text) for each fenced block"""
    out, lines, i = [], md.splitlines(), 0
    while i < len(lines):
        m = re.match(r"^```(\w*)", lines[i])
        if m:
            kind, start, body = m.group(1), i + 1, []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                body.append(lines[i]); i += 1
            out.append((kind, start, "\n".join(body)))
        i += 1
    return out

bad = 0
for page in pages:
    fs = fences(open(page, encoding="utf8").read())
    for idx, (kind, line, body) in enumerate(fs):
        if kind != "sql":
            continue
        page_stmts = norm_sql(body)
        # best matching concept file by text similarity of the whole normalised SQL
        best, ratio = None, 0.0
        for n, f in files.items():   # score = mean, over the page's statements, of the best match among the file's statements
            r = sum(max(difflib.SequenceMatcher(None, ps, fs).ratio() for fs in f["stmts"]) for ps in page_stmts) / max(1, len(page_stmts))
            if r > ratio: best, ratio = n, r
        if best is None or ratio < 0.6:
            print(f"-- {os.path.basename(page)}:{line}: a sql fence that is not a concept block (best match {ratio:.2f}), skipped")
            continue
        f = files[best]
        tag = f"Block {best} ({f['name']}) <- {os.path.basename(page)}:{line}"
        print(f"== {tag}")
        # 1. the SQL the page prints against the SQL in the lab's file
        missing = [s for s in page_stmts if s not in f["stmts"]]
        if missing:
            bad += 1
            print("   SQL DIFFERS from the lab file. Page statement(s) not found in the file:")
            for s in missing:
                close = difflib.get_close_matches(s, f["stmts"], n=1, cutoff=0.5)
                print("     page: " + s)
                if close: print("     file: " + close[0])
        else:
            print("   SQL: every statement on the page is in the lab file" + ("" if len(page_stmts) == len(f["stmts"]) else f" (page shows {len(page_stmts)} of the file's {len(f['stmts'])})"))
        # 2. the output printed after it
        nxt = fs[idx + 1] if idx + 1 < len(fs) else None
        if not nxt or nxt[0] != "text":
            print("   (no ```text output block follows on the page)")
            continue
        printed = [c.rstrip() for c in nxt[2].splitlines()]
        pchunks, cur = [], []
        for l in printed:
            if l == "":
                if cur: pchunks.append(cur); cur = []
            else:
                cur.append(l)
        if cur: pchunks.append(cur)
        real_chunks = [strip_footer(c["lines"]) for c in f["chunks"]]
        # Block 14 prints its first two result sets as two summary lines
        summary = []
        if pchunks and pchunks[0][0].startswith("by meaning:"):
            def rows(chunk):
                body = [l for l in chunk[2:]]
                return ", ".join(" ".join(re.split(r"\s*\|\s*", l)[:2]) for l in body)
            summary = [f"by meaning:  {rows(real_chunks[0])}", f"by words:    {rows(real_chunks[1])}"]
            ok_sum = [re.sub(r"\s+", " ", a) for a in pchunks[0]] == [re.sub(r"\s+", " ", b) for b in summary]
            print("   summary lines " + ("match the first two result sets" if ok_sum else f"DIFFER: page {pchunks[0]} vs real {summary}"))
            if not ok_sum: bad += 1
            pchunks, real_chunks = pchunks[1:], real_chunks[2:]
        # each printed chunk must equal some real chunk, in order
        pos, omitted_ok, all_ok = 0, [], True
        for pc in pchunks:
            pc_n = strip_footer(pc)
            found = None
            for j in range(pos, len(real_chunks)):
                for k in range(1, 5):
                    joined = [l for c in real_chunks[j:j + k] for l in c]
                    if j + k <= len(real_chunks) and joined == pc_n:
                        found = j + k - 1; break
                if found is not None: break
            if found is None:
                all_ok = False
                cand = real_chunks[pos] if pos < len(real_chunks) else []
                print("   OUTPUT DIFFERS. The page prints:")
                for l in pc: print("     page | " + l)
                print("   and the real output is:")
                for l in cand: print("     real | " + l)
                print("   unified diff (page -> real):")
                for l in difflib.unified_diff(pc_n, cand, "page", "real", lineterm="", n=0):
                    if not l.startswith(("---", "+++")): print("     " + l)
                break
            if found > pos: omitted_ok.append(found - pos)
            pos = found + 1
        if all_ok:
            extra = len(real_chunks) - pos + sum(omitted_ok)
            print("   OUTPUT: matches the real output" + (f" (the page leaves out {extra} result set(s) the block also prints)" if extra else ""))
        else:
            bad += 1
sys.exit(1 if bad else 0)
