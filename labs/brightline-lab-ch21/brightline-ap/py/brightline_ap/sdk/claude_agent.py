"""The AP worker on the first SDK: a harness used as a library (21.3 to 21.9).

Every option below replaces a line of the Chapter 20 loop, or decides something the loop decided.
"""

from __future__ import annotations

import asyncio
import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable

from claude_agent_sdk import (ClaudeAgentOptions, HookContext, HookInput, HookJSONOutput, HookMatcher, PermissionResultAllow, PermissionResultDeny,
                              ResultMessage, create_sdk_mcp_server, query, tool)

from .policy import FLAG_DESCRIPTION, READ_TOOLS, cites_policy_line, decide_tool, write_flag


@dataclass
class WorkerSettings:
    connector_url: str
    connector_token: str
    model: str
    max_turns: int
    max_budget_usd: float
    time_limit_seconds: int
    persist_session: bool
    resume: str | None = None


@dataclass
class RunSummary:
    stop: str
    answer: str
    turns: int
    cost_usd: float
    session_id: str


# A custom tool, served in-process: the SDK runs this handler inside your own program (21.4).
@tool("flag_invoice", FLAG_DESCRIPTION, {"invoice_number": str, "reason": str})
async def flag_invoice(args: dict[str, Any]) -> dict[str, Any]:
    return {"content": [{"type": "text", "text": write_flag(args["invoice_number"], args["reason"])}]}


local_tools = create_sdk_mcp_server(name="local", version="1.0.0", tools=[flag_invoice])


KEEP = ["PATH", "HOME", "ANTHROPIC_API_KEY", "ANTHROPIC_BASE_URL", "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC", "HTTPS_PROXY", "HTTP_PROXY", "NO_PROXY", "NODE_EXTRA_CA_CERTS", "SSL_CERT_FILE", "REQUESTS_CA_BUNDLE", "SYSTEMROOT", "USERPROFILE", "APPDATA", "LOCALAPPDATA", "TEMP", "TMP"]


def worker_env() -> dict[str, str]:
    """The subprocess gets these variables, and a request to send no nonessential traffic (21.8)."""
    return {**{k: os.environ[k] for k in KEEP if k in os.environ}, "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1", "CLAUDE_CODE_DISABLE_AUTO_MEMORY": "1"}


def isolate_environment() -> None:
    """In Python, env= is added to your whole environment, not put in its place (TypeScript replaces it).
    So this process drops every other variable before it starts the subprocess (21.9)."""
    for k in list(os.environ):
        if k not in KEEP and k not in ("LANG", "TMPDIR", "VIRTUAL_ENV"):
            del os.environ[k]


def claude_options(s: WorkerSettings, log: Callable[[str], None]) -> ClaudeAgentOptions:
    # A hook: your code, run before every tool call (21.5). This one only writes a log line.
    async def log_every_call(hook_input: HookInput, tool_use_id: str | None, context: HookContext) -> HookJSONOutput:
        if hook_input["hook_event_name"] == "PreToolUse":
            log(f"hook: {hook_input['tool_name']} {json.dumps(hook_input['tool_input'])}")
        return {}

    # Everything not on the allow list comes here, and the rule in policy.py decides (21.5)
    async def can_use_tool(name, tool_input, context):
        d = decide_tool(name, tool_input)
        log(f"permission: {name} -> {'allow' if d.allow else 'deny'}")
        return PermissionResultAllow(updated_input=tool_input) if d.allow else PermissionResultDeny(message=d.message)

    return ClaudeAgentOptions(
        model=s.model,
        system_prompt=Path("prompts/ap-worker-sdk.v1.md").read_text(),  # Chapter 20: the instructions
        tools=[],  # turn off every built-in tool: no shell, no files, no web (21.4)
        setting_sources=[],  # read no settings files from this computer (21.9)
        strict_mcp_config=True,  # use only the servers named below, never this computer's own (21.9)
        env=worker_env(),  # pass the subprocess only what it needs (21.9)
        mcp_servers={
            # Chapter 20, Step 4: the connector, now connected by the harness, with the test token in a header
            "brightline": {"type": "http", "url": s.connector_url,
                           "headers": {"Authorization": f"Bearer {s.connector_token}"}},
            "local": local_tools,
        },
        allowed_tools=[f"mcp__brightline__{t}" for t in READ_TOOLS],  # these four run without asking (21.5)
        permission_mode="default",  # say it: left out, the mode comes from settings files or the harness's own default (21.5)
        can_use_tool=can_use_tool,
        hooks={"PreToolUse": [HookMatcher(hooks=[log_every_call])]},
        max_turns=s.max_turns,  # Chapter 20's turn limit (21.6)
        max_budget_usd=s.max_budget_usd,  # Chapter 20's cost cap, now kept by the SDK (21.6)
        resume=s.resume,  # read an earlier conversation back from its session file (21.7)
        # Python has no persist_session option: pass the subprocess's own flag instead (21.7)
        extra_args={} if s.persist_session else {"no-session-persistence": None},
    )


async def ask_claude(question: str, s: WorkerSettings, show: Callable[[Any], None], log: Callable[[str], None]) -> RunSummary:
    summary = RunSummary("unknown", "", 0, 0.0, "")
    isolate_environment()

    async def run() -> None:
        nonlocal summary
        # Chapter 20, Steps 1 to 5: one call runs the whole loop, and streams every message it makes (21.3)
        async for message in query(prompt=question, options=claude_options(s, log)):
            show(message)
            if isinstance(message, ResultMessage):
                # The last message: why it stopped, the answer, the turns and the cost (21.3)
                summary = RunSummary(message.subtype, message.result or "", message.num_turns,
                                     message.total_cost_usd or 0.0, message.session_id)

    try:
        await asyncio.wait_for(run(), timeout=s.time_limit_seconds)  # Chapter 20's time limit stays yours
    except asyncio.TimeoutError:
        summary.stop = "time_limit"
    except Exception as error:  # after a limit, the result message comes first, then this error (21.6)
        if summary.stop == "unknown":
            summary.stop = f"error: {error}"
    # This SDK has no guardrail feature, so your own code checks the answer after the run: rule 2 (21.6)
    if summary.stop == "success" and not cites_policy_line(summary.answer):
        summary = RunSummary("no_citation", "", summary.turns, summary.cost_usd, summary.session_id)
    return summary
