"""Give the loop's recorded responses our connector's tool inputs (C20.3).

    <brightline-ap>/py/.venv/bin/python -I move_fixture_inputs.py <brightline-ap>

The model writes a tool's inputs from tools/ap-tools.json, which now comes from our connector's own
tool list in the strict form: every input present, null for one left empty. So each recorded tool call
says, for example, list_open_invoices with due_on_or_before, page_size and page, where the editor-in-chief's
practice tools had due_by alone. Run with the lab's Python, each response is then checked against the
SDKs' own types (anthropic.types.Message, openai.types.responses.Response), as his make_fixtures.py did.
"""
import json
import pathlib
import sys

LAB = pathlib.Path(sys.argv[1])
FIX = LAB / "tests/fixtures/loop"


def ours(name, args):
    if name == "list_open_invoices":
        assert set(args) <= {"vendor_id", "due_by"}, args
        return {"vendor_id": args.get("vendor_id"), "due_on_or_before": args.get("due_by"), "page_size": None, "page": None}
    if name == "get_purchase_order":
        assert set(args) == {"invoice_number"}, args
        return {"po_number": None, "invoice_number": args["invoice_number"]}
    if name == "search_policy":
        assert set(args) == {"query"}, args
        return {"query": args["query"], "limit": None}
    if name == "find_vendor":
        assert set(args) == {"query"}, args
        q = args["query"]
        return {"vendor_id": q, "name": None} if q[:1] == "V" and q[1:].isdigit() else {"vendor_id": None, "name": q}
    raise AssertionError(name)


def walk(node, changed):
    if isinstance(node, dict):
        if node.get("type") == "tool_use" and isinstance(node.get("input"), dict) and node["input"]:
            if "due_on_or_before" not in node["input"] and "po_number" not in node["input"] and "limit" not in node["input"] and "name" not in node["input"]:
                node["input"] = ours(node["name"], node["input"])
                changed.append(node["name"])
        if node.get("type") == "function_call" and isinstance(node.get("arguments"), str):
            try:
                args = json.loads(node["arguments"])
            except json.JSONDecodeError:
                args = None  # a broken call on purpose: moved by hand below
            if isinstance(args, dict) and not ({"due_on_or_before", "po_number", "limit", "name"} & set(args)):
                node["arguments"] = json.dumps(ours(node["name"], args))
                changed.append(node["name"])
        for v in node.values():
            walk(v, changed)
    elif isinstance(node, list):
        for v in node:
            walk(v, changed)


for path in sorted(FIX.glob("*.json")):
    text = path.read_text()
    data = json.loads(text)
    changed = []
    if path.name == "claude-stream-events.json":
        pieces = [e for e in data if e.get("type") == "content_block_delta" and e["delta"].get("type") == "input_json_delta"]
        old = [p["delta"]["partial_json"] for p in pieces]
        if old == ['{"vendor_id": nu', 'll, "due_by": "2026-', '12-06"}']:
            for p, new in zip(pieces, ['{"vendor_id": nu', 'll, "due_on_or_before": "2027-', '04-04", "page_size": null, "page": null}']):
                p["delta"]["partial_json"] = new
            changed.append("stream pieces")
        whole = json.loads("".join(p["delta"]["partial_json"] for p in pieces))
        assert whole == {"vendor_id": None, "due_on_or_before": "2027-04-04", "page_size": None, "page": None}, whole
    elif path.name == "open-malformed-args.json":
        walk(data, changed)
        for item in data.get("output", []) if isinstance(data, dict) else []:
            pass
        s = json.dumps(data)
        if '{\\"query\\": \\"V001\\"' in s:
            s = s.replace('"{\\"query\\": \\"V001\\""', '"{\\"vendor_id\\": \\"V001\\", \\"name\\": null"')
            data = json.loads(s)
            changed.append("broken find_vendor arguments")
    else:
        walk(data, changed)
    if changed:
        indent = 2 if text.lstrip().startswith("{") or "\n  {" not in text else None
        if path.name == "claude-stream-events.json":
            out = "[\n" + ",\n".join("  " + json.dumps(e, ensure_ascii=False) for e in data) + "\n]\n"
        else:
            out = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
        path.write_text(out)
    print(f"{path.name}: {', '.join(changed) or 'no tool inputs'}")

try:
    from anthropic.types import Message
    from openai.types.responses import Response
except ImportError:
    print("(SDKs not importable: run with the lab's Python to check the types)")
    sys.exit(0)
for path in sorted(FIX.glob("*.json")):
    data = json.loads(path.read_text())
    if path.name.startswith("claude-") and path.name != "claude-stream-events.json":
        items = data if isinstance(data, list) else [data]
        for d in items:
            Message.model_validate(d)
    elif path.name.startswith("openai-"):
        items = data if isinstance(data, list) else [data]
        for d in items:
            Response.model_validate(d)
print("types: every Claude and OpenAI response validates")
