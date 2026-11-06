"""The worker's rules, written once and used by both SDKs (21.5, 21.6).

Each rule is a plain function you can test without a model, a network or a key.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

# The connector's four read-only tools. These run without asking.
READ_TOOLS = ["find_vendor", "list_open_invoices", "get_purchase_order", "search_policy"]


@dataclass
class Decision:
    allow: bool
    message: str = ""


def decide_tool(name: str, tool_input: dict) -> Decision:
    """Rule 1, in plain words: flag_invoice may run only for one invoice, named as INV- and four digits,
    with a reason of at least 10 characters. Any other tool not on the allow list is denied, with a message."""
    short = name.split("__")[-1]
    if short == "flag_invoice":
        invoice = str(tool_input.get("invoice_number", ""))
        reason = str(tool_input.get("reason", ""))
        if not re.fullmatch(r"INV-\d{4}", invoice):
            return Decision(False, f'Denied: flag one invoice by its number, such as INV-8316, not "{invoice}".')
        if len(reason.strip()) < 10:
            return Decision(False, "Denied: a flag needs a reason of at least 10 characters.")
        return Decision(True)
    return Decision(False, f"Denied: {short} is not one of this worker's tools.")


def cites_policy_line(answer: str) -> bool:
    """Rule 2, in plain words: an answer must cite at least one policy line, written as (file.md:N)."""
    return re.search(r"\([a-z0-9-]+\.md:\d+\)", answer, re.IGNORECASE) is not None


def write_flag(invoice_number: str, reason: str) -> str:
    """The one tool with an effect: it writes a flag to out/flags.jsonl, which holds the invoice's payment."""
    Path("out").mkdir(exist_ok=True)
    with open("out/flags.jsonl", "a") as f:
        f.write(json.dumps({"invoice_number": invoice_number, "reason": reason,
                            "at": datetime.now(timezone.utc).isoformat()}) + "\n")
    return f"Flagged {invoice_number} for review. Its payment is held until the flag is cleared."


FLAG_DESCRIPTION = "Flag one invoice for review by the AP lead, which holds its payment. Use only when Ana names the invoice."


def parse_args(text: str) -> dict:
    """Tool arguments arrive as text. A small model may send broken text: treat it as no arguments, so the rule denies the call."""
    try:
        value = json.loads(text)
    except ValueError:
        return {}
    return value if isinstance(value, dict) else {}
