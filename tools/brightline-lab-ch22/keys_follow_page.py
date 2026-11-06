"""Lab 22: when the lab page's wording changes, carry each changed sentence of a task's "What good looks like"
and "Check before you approve" into that task's key, wherever the key quotes the old sentence word for word.
The key writer's own adaptations (a "below" for the page's "above", a prediction split from its paragraph) stay.

    python3 -I keys_follow_page.py <old lab.md> <new lab.md> <answer-key folder>
Prints, per key, each sentence carried, and each changed sentence the key does not quote (to read by hand)."""
import difflib, pathlib, re, sys
OLD, NEW, KEYS = (pathlib.Path(a) for a in sys.argv[1:4])
def paras(path):
    out = {}
    for sec in re.split(r"(?m)^(?=#{2,3} )", path.read_text(encoding="utf-8")):
        m = re.match(r"### Task (\w+)\. ", sec)
        if m:
            ps = re.findall(r"(?m)^\*\*(?:What good looks like:|Check before you approve\.)\*\* (.+)$", sec)
            out[m.group(1)] = " ".join(ps)
    return out
split = lambda s: [x for x in re.split(r"(?<=[.!?])\s+(?=[A-Z\"`(])", s) if x]
old, new = paras(OLD), paras(NEW)
for n in new:
    if new[n] == old.get(n):
        continue
    key = KEYS / f"task-{n.lower()}.md"; k = key.read_text(encoding="utf-8"); orig = k
    a, b = split(old[n]), split(new[n])
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(a=a, b=b, autojunk=False).get_opcodes():
        if tag == "equal":
            continue
        o, w = " ".join(a[i1:i2]), " ".join(b[j1:j2])
        if o and o in k:
            k = k.replace(o, w); print(f"task-{n}: carried: {o[:70]!r} -> {w[:70]!r}")
        elif o:
            # try sentence by sentence, then report what the key does not quote
            for s in a[i1:i2]:
                if s in k and tag == "replace" and len(a[i1:i2]) == len(b[j1:j2]):
                    k = k.replace(s, b[j1 + a[i1:i2].index(s)]); print(f"task-{n}: carried one: {s[:60]!r}")
                elif s not in k:
                    print(f"task-{n}: NOT QUOTED, read by hand: {s[:90]!r} -> {w[:90]!r}")
    if k != orig:
        key.write_text(k, encoding="utf-8")
