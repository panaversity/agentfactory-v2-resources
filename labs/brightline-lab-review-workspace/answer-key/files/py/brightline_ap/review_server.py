"""The review workspace connector in Python (Lab 20b, Task 4), on port 8758. Mirrors servers/review-ts/.

The same five tools, the same scopes, the same version check and the same words in every refusal as
the TypeScript copy. It reuses the AP connector's token check and company names, and changes none
of the AP connector's files. Run from py/:
  uv run --locked --env-file ../.secrets/db.dev.env python -m brightline_ap.review_server [port]
"""

from __future__ import annotations

import base64
import json
import os
import re
import sys
import time
from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from pathlib import Path
from typing import Annotated, Any, Literal

from pydantic import AnyHttpUrl, Field
from starlette.routing import Route
from starlette.types import ASGIApp, Message, Receive, Scope, Send

from mcp.server import MCPServer
from mcp.server.apps import Apps, ResourceCsp
from mcp.server.auth.middleware.bearer_auth import AuthenticatedUser
from mcp.server.auth.provider import AccessToken
from mcp.server.auth.routes import build_resource_metadata_url, create_protected_resource_routes
from mcp.server.auth.settings import AuthSettings
from mcp.server.mcpserver import Context
from mcp.server.transport_security import TransportSecuritySettings
from mcp.types import CallToolResult, TextContent, ToolAnnotations

from .companies import company_name, no_data
from .db import DB_TIMEOUT_MESSAGE, DB_UNAVAILABLE_MESSAGE, NO_DATA, DatabaseTimeout, DatabaseUnavailable
from .mcp_server import COMPANY_INPUT, FrontDoor, company_input_message
from .rate_limit import DEFAULT_COMPANY, DEFAULT_PERSON, Limits, check_limits, memory_limits
from .review_db import ReviewDatabase, ReviewQueries
from .verify_token import BrightlineTokenVerifier

PAGE_URI = "ui://brightline/review-workspace.html"
PAGE_FILE = Path(__file__).resolve().parents[2] / "ui" / "review-workspace.html"
SIGN_IN = "Sign in to use the Brightline review workspace."
SCOPES = ["review:read", "review:write"]
BASE_SCOPES = ["review:read"]
TOOL_SCOPES = {
    "open_review_workspace": ["review:read"], "review_list": ["review:read"], "get_review_note": ["review:read"],
    "save_review_note": ["review:read", "review:write"], "export_review": ["review:read"],
}
INVOICE = re.compile(r"INV-\d{4}")
READ_ONLY = ToolAnnotations(read_only_hint=True, destructive_hint=False, idempotent_hint=True, open_world_hint=False)
WRITES_A_NOTE = ToolAnnotations(read_only_hint=False, destructive_hint=False, idempotent_hint=False, open_world_hint=False)


def money(cents: int) -> str:
    return f"${cents / 100:,.2f}"


def not_found(invoice_number: str, tenant: str) -> str:
    return f"Invoice {invoice_number} was not found among {company_name(tenant)}'s open invoices."


def changed(name: str, version: int, at: str) -> str:
    return (f"This note changed after you opened it: {name} saved version {version} at {at.replace('T', ' ').replace('Z', ' UTC')}. "
            "Your text was not saved. Reload and compare, then save again.")


def _dumps(value: Any) -> str:
    """The same text as JSON.stringify in the TypeScript copy: no spaces, characters as they are."""
    return json.dumps(value, separators=(",", ":"), ensure_ascii=False)


def _fail(message: str) -> CallToolResult:
    return CallToolResult(content=[TextContent(type="text", text=message)], is_error=True)


def _ok(text: str, value: dict[str, Any]) -> CallToolResult:
    return CallToolResult(content=[TextContent(type="text", text=text)], structured_content=value)


def console_log(line: dict[str, Any]) -> None:
    print(json.dumps(line, separators=(",", ":")), flush=True)


async def _json(send: Send, status: int, body_value: Any, extra_headers: list[tuple[bytes, bytes]] | None = None) -> None:
    """The same JSON answer as the AP connector's front door (mcp_server.py), which this file does not change."""
    body = json.dumps(body_value, separators=(",", ":")).encode()
    await send({"type": "http.response.start", "status": status, "headers": [
        (b"content-type", b"application/json"), (b"content-length", str(len(body)).encode()), *(extra_headers or [])]})
    await send({"type": "http.response.body", "body": body})


async def _challenge(send: Send, status: int, error: str, description: str, scopes: list[str], metadata_url: str) -> None:
    """The same WWW-Authenticate challenge, in the same order, as the TypeScript SDK writes."""
    quoted = re.sub(r'[\\"]', lambda m: "\\" + m.group(0), description)
    header = f'Bearer error="{error}", error_description="{quoted}", scope="{" ".join(scopes)}", resource_metadata="{metadata_url}"'
    body = json.dumps({"error": error, "error_description": description}).encode()
    await send({"type": "http.response.start", "status": status, "headers": [
        (b"content-type", b"application/json"), (b"content-length", str(len(body)).encode()), (b"www-authenticate", header.encode())]})
    await send({"type": "http.response.body", "body": body})


class ReviewTokenVerifier(BrightlineTokenVerifier):
    """The AP connector's token check, for this connector's own address, plus the token's name claim."""

    async def verify_token(self, token: str) -> AccessToken | None:
        checked = await super().verify_token(token)
        if checked is None:
            return None
        # The token is already checked, so its payload can be read as it is.
        payload = json.loads(base64.urlsafe_b64decode(token.split(".")[1] + "=" * (-len(token.split(".")[1]) % 4)))
        name = payload.get("name") if isinstance(payload.get("name"), str) and payload.get("name") else None
        return checked.model_copy(update={"claims": {**(checked.claims or {}), "name": name or checked.subject}})


@dataclass(frozen=True)
class RequestAuth:
    tenant: str
    person: str
    name: str
    app: str
    scopes: tuple[str, ...]


@dataclass
class Deps:
    db: ReviewDatabase
    as_of: str
    ui_domain: str | None = None
    log: Callable[[dict[str, Any]], None] | None = None


def _request_auth(ctx: Context) -> RequestAuth | None:
    request: Any = ctx.request_context.request
    user: Any = request.scope.get("user") if request is not None else None
    token: AccessToken | None = getattr(user, "access_token", None)
    claims = (token.claims or {}) if token is not None else {}
    tenant, person = claims.get("tenant"), token.subject if token is not None else None
    if token is None or not isinstance(tenant, str) or not tenant or not person:
        return None
    return RequestAuth(tenant=tenant, person=person, name=str(claims.get("name") or person), app=token.client_id, scopes=tuple(token.scopes))


async def _run(ctx: Context, deps: Deps, tool: str, work: Callable[[RequestAuth, ReviewQueries], Awaitable[CallToolResult]],
               *, write: bool = False) -> CallToolResult:
    """Rule 1: no slip, no answer. One transaction for the slip's company. Rule 6: one audit line per call."""
    auth = _request_auth(ctx)
    if auth is None:
        return _fail(SIGN_IN)
    log, started = deps.log or console_log, time.perf_counter()

    def line(outcome: str) -> None:
        log({"event": "tools/call", "company": auth.tenant, "person": auth.person, "app": auth.app, "tool": tool,
             "outcome": outcome, "ms": round((time.perf_counter() - started) * 1000)})

    try:
        result = await deps.db.for_tenant(auth.tenant, lambda q: work(auth, q), write=write)
    except DatabaseTimeout:
        line("db_timeout")
        return _fail(DB_TIMEOUT_MESSAGE)
    except DatabaseUnavailable:
        line("error")
        return _fail(DB_UNAVAILABLE_MESSAGE)
    if result is NO_DATA:
        line("no_data")
        return _fail(no_data(auth.tenant))
    assert isinstance(result, CallToolResult)
    line("tool_error" if result.is_error else "ok")
    return result


def _counts(rows: list[dict[str, Any]], as_of: str) -> dict[str, Any]:
    def by(s: str | None) -> int:
        return sum(1 for r in rows if r["status"] == s)
    return {
        "open_invoices": len(rows), "total_cents": sum(r["amount_cents"] for r in rows),
        "overdue": sum(1 for r in rows if r["due_date"] is not None and r["due_date"] < as_of),
        "notes": {"reviewed": by("reviewed"), "follow up": by("follow up"), "open": by("open"), "none": by(None)},
    }


def build_review_server(deps: Deps, *, auth: AuthSettings | None = None, token_verifier: Any = None) -> MCPServer:
    apps = Apps()
    apps.add_html_resource(PAGE_URI, PAGE_FILE.read_text(encoding="utf-8"), name="Review workspace",
                           csp=ResourceCsp(connect_domains=[], resource_domains=[]), domain=deps.ui_domain, prefers_border=True)

    @apps.tool(resource_uri=PAGE_URI, title="Open the month-end review workspace", annotations=READ_ONLY, description=(
        "Open your company's month-end review of its open invoices: each invoice with its review note's status. "
        "In an AI app that shows screens, this opens the review workspace. Read-only."))
    async def open_review_workspace(ctx: Context) -> CallToolResult:
        async def work(who: RequestAuth, q: ReviewQueries) -> CallToolResult:
            rows = await q.open_invoices()
            c = _counts(rows, deps.as_of)
            company = company_name(q.tenant)
            text = (f"{company}'s month-end review, as of {deps.as_of}: {c['open_invoices']} open invoices, {money(c['total_cents'])} in all, "
                    f"{c['overdue']} of them overdue. Notes: {c['notes']['reviewed']} reviewed, {c['notes']['follow up']} to follow up, "
                    f"{c['notes']['open']} open, {c['notes']['none']} with no note yet. Call get_review_note for one invoice's note, "
                    "or export_review for the whole review as Markdown.")
            return _ok(text, {"company": company, "as_of": deps.as_of, **c, "invoices": rows})
        return await _run(ctx, deps, "open_review_workspace", work)

    # Saving is the one write, offered to the page only. Hidden is not protected (20.5): the scope gate,
    # the company and the version check are what protect it.
    @apps.tool(resource_uri=PAGE_URI, visibility=["app"], title="Save a review note", annotations=WRITES_A_NOTE, description=(
        "For the review workspace: save the note on one open invoice of your company. Pass the version you last saw "
        "(0 for no note yet). If someone saved since, nothing is saved and the answer says who saved and when. "
        "Needs review:write. Changes only the review note, never the invoice."))
    async def save_review_note(
        ctx: Context,
        invoice_number: Annotated[str, Field(description="An invoice number such as INV-6201.")],
        note: Annotated[str, Field(max_length=2000, description="The note's text, at most 2,000 characters.")],
        status: Annotated[Literal["open", "reviewed", "follow up"], Field(description="open, reviewed or follow up.")],
        version: Annotated[int, Field(ge=0, description="The version you last saw: 0 for no note yet.")],
    ) -> CallToolResult:
        async def work(who: RequestAuth, q: ReviewQueries) -> CallToolResult:
            if not INVOICE.fullmatch(invoice_number):
                return _fail("invoice_number looks like INV-6201.")
            outcome = await q.save_note(invoice_number, note, status, version, who.person, who.name)
            if outcome["kind"] == "not_found":
                return _fail(not_found(invoice_number, q.tenant))
            if outcome["kind"] == "changed":
                cur = outcome["current"]
                return _fail(changed(cur["saved_by_name"], cur["version"], cur["saved_at"]))
            value = {"invoice_number": invoice_number, "version": outcome["version"], "saved_by_name": who.name, "saved_at": outcome["saved_at"]}
            return _ok(f"Saved the note on {invoice_number} as version {outcome['version']}, by {who.name}.", value)
        return await _run(ctx, deps, "save_review_note", work, write=True)

    # The extension is read when the server is made, so the page's tools are defined first.
    mcp = MCPServer(name="brightline-review", version="0.1.0", auth=auth, token_verifier=token_verifier, extensions=[apps])

    @mcp.tool(title="List the review", annotations=READ_ONLY, description=(
        "Your company's open invoices with their review notes' status, filtered: overdue (due before the review date), "
        "one vendor (vendor_id such as V102), or one status (open, reviewed, follow up, or none for no note yet). Read-only."))
    async def review_list(
        ctx: Context,
        overdue: Annotated[bool | None, Field(description="Only invoices due before the review date.")] = None,
        vendor_id: Annotated[str | None, Field(pattern=r"^V\d{3}$", description="Only this vendor's invoices, such as V102.")] = None,
        status: Annotated[Literal["open", "reviewed", "follow up", "none"] | None,
                          Field(description="Only notes with this status, or none for no note yet.")] = None,
    ) -> CallToolResult:
        async def work(who: RequestAuth, q: ReviewQueries) -> CallToolResult:
            rows = [r for r in await q.open_invoices()
                    if (not overdue or (r["due_date"] is not None and r["due_date"] < deps.as_of))
                    and (not vendor_id or r["vendor_id"] == vendor_id)
                    and (not status or (r["status"] is None if status == "none" else r["status"] == status))]
            value = {"as_of": deps.as_of, "invoices": rows, "count": len(rows)}
            return _ok(_dumps(value), value)
        return await _run(ctx, deps, "review_list", work)

    @mcp.tool(title="Get one invoice's review note", annotations=READ_ONLY, description=(
        "One open invoice of your company, with its vendor, its purchase order if it has one, and its review note: the text, "
        "the status, the version, and who saved it and when. Version 0 means no note yet. Read-only."))
    async def get_review_note(
        ctx: Context, invoice_number: Annotated[str, Field(description="An invoice number such as INV-6201.")],
    ) -> CallToolResult:
        async def work(who: RequestAuth, q: ReviewQueries) -> CallToolResult:
            if not INVOICE.fullmatch(invoice_number):
                return _fail("invoice_number looks like INV-6201.")
            invoice = await q.invoice(invoice_number)
            if invoice is None:
                return _fail(not_found(invoice_number, q.tenant))
            note = await q.note(invoice_number) or {"note": "", "status": None, "version": 0, "saved_by_name": None, "saved_at": None}
            value = {"invoice": invoice, "note": note}
            return _ok(_dumps(value), value)
        return await _run(ctx, deps, "get_review_note", work)

    @mcp.tool(title="Export the review as Markdown", annotations=READ_ONLY, description=(
        "Your company's month-end review as Markdown text: every open invoice, its note's status and text, and who saved it. Read-only."))
    async def export_review(ctx: Context) -> CallToolResult:
        async def work(who: RequestAuth, q: ReviewQueries) -> CallToolResult:
            rows = await q.open_invoices()
            c = _counts(rows, deps.as_of)
            lines = [
                f"# {company_name(q.tenant)}: month-end review, as of {deps.as_of}", "",
                f"{c['open_invoices']} open invoices, {money(c['total_cents'])} in all. {c['notes']['reviewed']} reviewed, "
                f"{c['notes']['follow up']} to follow up, {c['notes']['open']} open, {c['notes']['none']} with no note yet.", "",
                "| Invoice | Vendor | Amount | Due | Status | Note | Saved by |", "| --- | --- | --- | --- | --- | --- | --- |",
            ]

            def cell(s: str) -> str:
                return re.sub(r"\r?\n", " ", s.replace("|", "\\|"))
            for r in rows:
                note = (await q.note(r["invoice_number"]) or {"note": ""})["note"] if r["version"] else ""
                saved = f"{cell(r['saved_by_name'])}, {r['saved_at']}" if r["saved_by_name"] else ""
                lines.append(f"| {r['invoice_number']} | {r['vendor_id']} {cell(r['vendor_name'])} | {money(r['amount_cents'])} | "
                             f"{r['due_date'] or 'none'} | {r['status'] or 'no note'} | {cell(note)} | {saved} |")
            markdown = "\n".join(lines)
            return _ok(markdown, {"markdown": markdown})
        return await _run(ctx, deps, "export_review", work)

    return mcp


class ReviewScopeGate:
    """The AP connector's ScopeGate, with this connector's scopes and words (mcp_server.py)."""

    def __init__(self, app: ASGIApp, metadata_url: str, limits: Limits | None = None,
                 log: Callable[[dict[str, Any]], None] | None = None) -> None:
        self.app, self.metadata_url, self.limits, self.log = app, metadata_url, limits, log or console_log

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        user = scope.get("user")
        if not isinstance(user, AuthenticatedUser):
            await _challenge(send, 401, "invalid_token", SIGN_IN, BASE_SCOPES, self.metadata_url)
            return
        granted = set(user.scopes)
        if not set(BASE_SCOPES) <= granted:
            await _challenge(send, 403, "insufficient_scope", "Insufficient scope", BASE_SCOPES, self.metadata_url)
            return
        claims = user.access_token.claims or {}
        tenant, person = str(claims.get("tenant", "")), str(user.access_token.subject or "")
        tool_header = next((v.decode() for k, v in scope["headers"] if k.lower() == b"mcp-name"), "")

        def audit(outcome: str, tool_name: str) -> None:
            self.log({"event": "tools/call", "company": tenant, "person": person, "app": user.access_token.client_id,
                      "tool": tool_name, "outcome": outcome, "ms": 0})

        over = await check_limits(self.limits, tenant, person) if self.limits is not None else None
        if over is not None:
            audit("rate_limited", tool_header)
            who = "you" if over == "person" else company_name(tenant)
            await _json(send, 429, {"jsonrpc": "2.0", "id": None, "error": {"code": -32000,
                        "message": f"Too many calls from {who} to the Brightline review workspace. Wait a minute and try again."}},
                        [(b"retry-after", b"60")])
            return
        if scope.get("method") != "POST":
            await self.app(scope, receive, send)
            return
        chunks: list[bytes] = []
        while True:
            message = await receive()
            if message["type"] != "http.request":
                break
            chunks.append(message.get("body", b""))
            if not message.get("more_body", False):
                break
        body = b"".join(chunks)
        try:
            parsed: Any = json.loads(body)
        except ValueError:
            parsed = None
        for request in parsed if isinstance(parsed, list) else [parsed]:  # pyright: ignore[reportUnknownVariableType]
            rpc: dict[str, Any] = request if isinstance(request, dict) else {}  # pyright: ignore[reportUnknownVariableType]
            if rpc.get("method") != "tools/call":
                continue
            params: dict[str, Any] = rpc.get("params") if isinstance(rpc.get("params"), dict) else {}  # pyright: ignore[reportAssignmentType]
            tool, arguments = params.get("name"), params.get("arguments")
            names = [str(k) for k in arguments] if isinstance(arguments, dict) else []  # pyright: ignore[reportUnknownVariableType, reportUnknownArgumentType]
            named = next((k for k in names if COMPANY_INPUT.fullmatch(k)), None)
            if named is not None:
                audit("company_input", str(tool))
                await _json(send, 200, {"jsonrpc": "2.0", "id": rpc.get("id"), "result": {"resultType": "complete",
                            "content": [{"type": "text", "text": company_input_message(named)}], "isError": True}})
                return
            needed = TOOL_SCOPES.get(str(tool), BASE_SCOPES)
            if not set(needed) <= granted:
                audit("insufficient_scope", str(tool))
                await _challenge(send, 403, "insufficient_scope",
                                 f"{tool} needs {' '.join(needed)}. Your role in {company_name(tenant)} does not include it.", needed, self.metadata_url)
                return
        replayed = False

        async def replay() -> Message:
            nonlocal replayed
            if not replayed:
                replayed = True
                return {"type": "http.request", "body": body, "more_body": False}
            return await receive()

        await self.app(scope, replay, send)


def create_review_app(*, issuer: str, resource: str, db: ReviewDatabase, as_of: str, jwks_url: str | None = None,
                      test_signing_key: str | None = None, ui_domain: str | None = None, limits: Limits | None = None,
                      log: Callable[[dict[str, Any]], None] | None = None, allowed_origins: list[str] | None = None) -> Any:
    for name, value in (("REVIEW_ISSUER", issuer), ("REVIEW_RESOURCE", resource)):
        if not value:
            raise ValueError(f"{name} must be set")
    settings = AuthSettings(issuer_url=AnyHttpUrl(issuer), resource_server_url=AnyHttpUrl(resource),
                            required_scopes=BASE_SCOPES, validate_token_resource=True)
    verifier = ReviewTokenVerifier(issuer=issuer, resource=resource, jwks_url=jwks_url or f"{issuer}/jwks", test_signing_key=test_signing_key)
    server = build_review_server(Deps(db=db, as_of=as_of, ui_domain=ui_domain, log=log), auth=settings, token_verifier=verifier)
    security = TransportSecuritySettings(
        allowed_hosts=["127.0.0.1", "127.0.0.1:*", "localhost", "localhost:*", *[o.split("://")[-1] for o in (allowed_origins or [])]],
        allowed_origins=["http://127.0.0.1:*", "http://localhost:*", *(allowed_origins or [])],
    )
    app = server.streamable_http_app(json_response=True, transport_security=security)
    metadata_url = str(build_resource_metadata_url(AnyHttpUrl(resource)))
    prm_path = metadata_url.split("://", 1)[1].split("/", 1)[1]
    for i, route in enumerate(app.router.routes):
        if isinstance(route, Route) and route.path == "/" + prm_path:
            app.router.routes[i] = create_protected_resource_routes(resource_url=AnyHttpUrl(resource), authorization_servers=[AnyHttpUrl(issuer)],
                                                                    scopes_supported=SCOPES, resource_name="Brightline review workspace")[0]
        elif isinstance(route, Route) and route.path == "/mcp":
            route.app = ReviewScopeGate(route.app, metadata_url, limits=limits, log=log)
    return FrontDoor(app, allowed_origins or [])


def main() -> None:
    import uvicorn

    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8758
    env = os.environ
    if not env.get("DATABASE_URL_REVIEW_WRITER"):
        sys.exit("DATABASE_URL_REVIEW_WRITER is not set. Run npm run db:migrate, then npm run db:passwords.")
    issuer = env.get("REVIEW_ISSUER") or env.get("AP_ISSUER", "")
    app = create_review_app(
        issuer=issuer, resource=env.get("REVIEW_RESOURCE") or f"http://127.0.0.1:{port}/mcp",
        db=ReviewDatabase(env["DATABASE_URL_REVIEW_WRITER"]), as_of=env.get("REVIEW_AS_OF") or time.strftime("%Y-%m-%d", time.gmtime()),
        jwks_url=f"{issuer}/jwks",
        test_signing_key=env.get("AP_TEST_SIGNING_KEY") if env.get("AP_TRUST_TEST_ISSUER") == "1" else None,
        limits=memory_limits(int(env.get("AP_RATE_LIMIT_COMPANY", DEFAULT_COMPANY)), int(env.get("AP_RATE_LIMIT_PERSON", DEFAULT_PERSON))),
    )
    print(f"brightline-review (Python) at http://127.0.0.1:{port}/mcp")
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="warning")


if __name__ == "__main__":
    main()
