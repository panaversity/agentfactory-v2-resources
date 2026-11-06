"""A stand-in model API for the authors' offline simulation of Lab 21.

It answers the Claude Messages API (POST /v1/messages, streamed or not) and the
OpenAI Responses API (POST /v1/responses) with scripted turns, chosen from the
question and the tool results already in the request. It is NOT a model: it
exists so the real SDKs (the Claude Agent SDK's real CLI subprocess and the
OpenAI Agents SDK's real runner) can be run end to end, in both languages,
against the real practice connector, with no API key and no cost.

Every request it receives is appended to $STAND_IN_LOG (JSON lines), so the
simulation can show exactly what each SDK sent on each turn.

Never give this file to a reader's agent. It is not part of the lab.

Our copy of the authors' authors/stand_in_model.py, for our Lab 21 on our Lab 20: one Brightline, from
the Chapter 20 session's final map (ten invoices due this week, $24,927.63; the $389 bill with no PO is
INV-8316), our connector's input for list_open_invoices, and Brightline's own policy lines in every answer
(po-matching.md:5 and :9), since the lab's first-SDK check stops an answer with no citation.
"""

from __future__ import annotations

import itertools
import json
import os
import re
import time

import uvicorn
from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import JSONResponse, StreamingResponse
from starlette.routing import Route

LOG = os.environ.get("STAND_IN_LOG", "stand-in-requests.jsonl")
_ids = itertools.count(1)


def nid(prefix: str) -> str:
    return f"{prefix}{next(_ids):04d}"


# ---------------------------------------------------------------- the script

def decide(question: str, tools: dict[str, str], called: list[str], results: list[str], last: str = "") -> dict:
    """Return {"tool": (full_name, args)} or {"text": "..."}.

    tools maps a short name (list_open_invoices) to the name the SDK sent
    (mcp__brightline__list_open_invoices on the Claude side).
    """
    q = question.lower()
    if "which of those has no purchase order" in last.lower():
        return {"text": "INV-8316 ($389.00) has no purchase order. An invoice with no PO is held until the buyer raises one (po-matching.md:9)."}

    def call(short: str, args: dict) -> dict:
        if short not in tools:
            return {"text": f"I cannot do that here: I have no {short} tool."}
        return {"tool": (tools[short], args)}

    if "exchange rate" in q:
        if "WebFetch" in tools and "WebFetch" not in called:
            return {"tool": ("WebFetch", {"url": "https://example.com/rates", "prompt": "today's rate"})}
        if "Bash" in tools and "Bash" not in called:
            return {"tool": ("Bash", {"command": "curl -s https://example.com/rates/eur"})}
        return {"text": "I cannot look that up. I can only read Brightline's AP records and policy."}
    if "due this week" in q:
        if "list_open_invoices" not in called:
            return call("list_open_invoices", {"vendor_id": None, "due_on_or_before": "2027-04-04", "page_size": 10, "page": None})
        return {"text": ("Ten invoices are due by Sunday, April 4: INV-8301 ($4,825.00), INV-8302 ($618.75), "
                         "INV-8303 ($12,900.00), INV-8304 ($234.50), INV-8306 ($1,582.00), INV-8307 ($2,411.33), "
                         "INV-8311 ($442.10), INV-8312 ($199.95), INV-8315 ($1,325.00) and INV-8316 ($389.00), "
                         "$24,927.63 in all. Each must match its purchase order before it is paid (po-matching.md:5).")}
    if "early-payment discount" in q:
        if results and results[-1].strip() != "try again" and "try again" not in results[-1]:
            return {"text": "No Brightline policy line mentions an early-payment discount."}
        return call("search_policy", {"query": "early-payment discount"})
    if "flag every" in q:
        if "flag_invoice" not in called:
            return call("flag_invoice", {"invoice_number": "ALL", "reason": "check everything"})
        return {"text": "I could not flag them: the flag was refused, because a flag must name one invoice and give a reason. Nothing was held: each invoice is still paid once it matches its PO (po-matching.md:5)."}
    if "flag" in q:
        m = re.search(r"INV-\d{4}", question)
        if "flag_invoice" not in called:
            return call("flag_invoice", {"invoice_number": m.group(0) if m else "INV-8316",
                                         "reason": "No purchase order on file. Check with the vendor."})
        if results and ("denied" in results[-1].lower() or "rejected" in results[-1].lower() or "not approved" in results[-1].lower()):
            return {"text": "The flag was not approved, so nothing was held, and the invoice is paid once it matches its PO (po-matching.md:5)."}
        return {"text": f"{m.group(0) if m else 'INV-8316'} is flagged for review, which holds its payment, as an invoice with no PO is held (po-matching.md:9)."}
    if "yes or no" in q:
        return {"text": "Yes."}
    if "invoice with no purchase order" in q:
        if "search_policy" not in called:
            return call("search_policy", {"query": "invoice with no purchase order"})
        return {"text": "An invoice with no PO is held until the buyer raises one (po-matching.md:9)."}
    return {"text": "I answer Brightline accounts payable questions (po-matching.md:5)."}


# ---------------------------------------------------------- Messages (Claude)

def _text_of(content) -> str:
    if isinstance(content, str):
        return content
    out = []
    for b in content:
        if b.get("type") == "text":
            out.append(b.get("text", ""))
        elif b.get("type") == "tool_result":
            c = b.get("content")
            out.append(_text_of(c) if c is not None else "")
    return "".join(out)


def claude_turn(body: dict) -> tuple[list[dict], str]:
    msgs = body.get("messages", [])
    tools = {}
    for t in body.get("tools", []) or []:
        name = t.get("name", "")
        tools[name.split("__")[-1] if name.startswith("mcp__") else name] = name
    # the person's question is the first user text that is not a system reminder
    question = ""
    for m in msgs:
        if m["role"] == "user":
            t = _text_of(m["content"])
            t = re.sub(r"<system-reminder>.*?</system-reminder>", "", t, flags=re.S).strip()
            if t:
                question = t
                break
    last = ""
    for m in msgs:
        if m["role"] == "user" and _text_of(m["content"]).strip() and not any(
                isinstance(b, dict) and b.get("type") == "tool_result" for b in (m["content"] if isinstance(m["content"], list) else [])):
            last = re.sub(r"<system-reminder>.*?</system-reminder>", "", _text_of(m["content"]), flags=re.S).strip() or last
    called, results = [], []
    for m in msgs:
        if m["role"] == "assistant" and isinstance(m["content"], list):
            for b in m["content"]:
                if b.get("type") == "tool_use":
                    n = b["name"]
                    called.append(n.split("__")[-1] if n.startswith("mcp__") else n)
        if m["role"] == "user" and isinstance(m["content"], list):
            for b in m["content"]:
                if b.get("type") == "tool_result":
                    results.append(_text_of(b.get("content") or ""))
    if not tools:  # a side request the harness makes for itself (a title, a summary)
        return [{"type": "text", "text": "AP question"}], "end_turn"
    d = decide(question, tools, called, results, last)
    if "tool" in d:
        name, args = d["tool"]
        return [{"type": "text", "text": "Let me check."},
                {"type": "tool_use", "id": nid("toolu_01Lab21"), "name": name, "input": args}], "tool_use"
    return [{"type": "text", "text": d["text"]}], "end_turn"


def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


async def messages(request: Request):
    body = await request.json()
    _log("messages", request, body)
    blocks, stop = claude_turn(body)
    usage_in = 900 + 40 * len(json.dumps(body.get("messages", []))) // 160
    msg = {"id": nid("msg_01Lab21"), "type": "message", "role": "assistant", "model": body.get("model", "stand-in"),
           "content": [], "stop_reason": None, "stop_sequence": None,
           "usage": {"input_tokens": usage_in, "output_tokens": 1, "cache_creation_input_tokens": 0, "cache_read_input_tokens": 0}}
    if not body.get("stream"):
        msg.update(content=blocks, stop_reason=stop, usage={**msg["usage"], "output_tokens": 60})
        return JSONResponse(msg, headers={"request-id": nid("req_01Lab21")})

    def gen():
        yield _sse("message_start", {"type": "message_start", "message": msg})
        for i, b in enumerate(blocks):
            if b["type"] == "text":
                yield _sse("content_block_start", {"type": "content_block_start", "index": i, "content_block": {"type": "text", "text": ""}})
                yield _sse("content_block_delta", {"type": "content_block_delta", "index": i, "delta": {"type": "text_delta", "text": b["text"]}})
            else:
                yield _sse("content_block_start", {"type": "content_block_start", "index": i,
                                                   "content_block": {"type": "tool_use", "id": b["id"], "name": b["name"], "input": {}}})
                yield _sse("content_block_delta", {"type": "content_block_delta", "index": i,
                                                   "delta": {"type": "input_json_delta", "partial_json": json.dumps(b["input"])}})
            yield _sse("content_block_stop", {"type": "content_block_stop", "index": i})
        yield _sse("message_delta", {"type": "message_delta", "delta": {"stop_reason": stop, "stop_sequence": None},
                                     "usage": {"output_tokens": 60}})
        yield _sse("message_stop", {"type": "message_stop"})

    return StreamingResponse(gen(), media_type="text/event-stream", headers={"request-id": nid("req_01Lab21")})


async def count_tokens(request: Request):
    body = await request.json()
    _log("count_tokens", request, body)
    return JSONResponse({"input_tokens": 900})


# --------------------------------------------------------- Responses (OpenAI)

def openai_turn(body: dict) -> list[dict]:
    items = body.get("input", [])
    if isinstance(items, str):
        items = [{"role": "user", "content": items}]
    tools = {t["name"]: t["name"] for t in body.get("tools", []) or [] if t.get("type") == "function"}
    question = ""
    for it in items:
        if it.get("role") == "user":
            c = it.get("content")
            question = c if isinstance(c, str) else "".join(p.get("text", "") for p in c)
            break
    users = [it for it in items if it.get("role") == "user"]
    lc = users[-1].get("content") if users else ""
    last = lc if isinstance(lc, str) else "".join(p.get("text", "") for p in (lc or []))
    called = [it["name"] for it in items if it.get("type") == "function_call"]
    results = [str(it.get("output", "")) for it in items if it.get("type") == "function_call_output"]
    d = decide(question, tools, called, results, last)
    reasoning = {"type": "reasoning", "id": nid("rs_lab21_"), "summary": [], "encrypted_content": "gAAAA-stand-in"}
    if "tool" in d:
        name, args = d["tool"]
        return [reasoning, {"type": "function_call", "id": nid("fc_lab21_"), "call_id": nid("call_lab21_"),
                            "name": name, "arguments": json.dumps(args), "status": "completed"}]
    return [reasoning, {"type": "message", "id": nid("msg_lab21_"), "role": "assistant", "status": "completed",
                        "content": [{"type": "output_text", "text": d["text"], "annotations": []}]}]


async def responses(request: Request):
    body = await request.json()
    _log("responses", request, body)
    output = openai_turn(body)
    return JSONResponse({
        "id": nid("resp_lab21_"), "object": "response", "created_at": int(time.time()), "status": "completed",
        "model": body.get("model", "stand-in"), "output": output, "parallel_tool_calls": True,
        "tool_choice": body.get("tool_choice", "auto"), "tools": body.get("tools", []), "store": body.get("store", True),
        "error": None, "incomplete_details": None, "instructions": body.get("instructions"), "metadata": {},
        "temperature": None, "top_p": None, "text": {"format": {"type": "text"}},
        "usage": {"input_tokens": 850, "input_tokens_details": {"cached_tokens": 0},
                  "output_tokens": 55, "output_tokens_details": {"reasoning_tokens": 20}, "total_tokens": 905},
    }, headers={"x-request-id": nid("req_lab21_")})


async def other(request: Request):
    body = await request.body()
    _log("other", request, {"raw": body.decode("utf-8", "replace")[:500]})
    return JSONResponse({"data": []})


def _log(kind: str, request: Request, body: dict) -> None:
    with open(LOG, "a") as f:
        f.write(json.dumps({"kind": kind, "path": request.url.path, "headers": {k: v for k, v in request.headers.items()
                            if k.lower() in ("anthropic-version", "anthropic-beta", "user-agent", "x-stainless-lang")},
                            "body": body}) + "\n")


app = Starlette(routes=[
    Route("/v1/messages", messages, methods=["POST"]),
    Route("/v1/messages/count_tokens", count_tokens, methods=["POST"]),
    Route("/v1/responses", responses, methods=["POST"]),
    Route("/{rest:path}", other, methods=["GET", "POST"]),
])

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=int(os.environ.get("STAND_IN_PORT", "8799")), log_level="warning")
