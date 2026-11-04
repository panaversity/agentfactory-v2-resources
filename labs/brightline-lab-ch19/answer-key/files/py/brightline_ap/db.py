"""The Python connector's database layer (19.9, 19.17). Mirrors servers/ap-ts/src/db.ts.

One tool call = one read-only transaction, with the company set for that transaction only
(set_config(..., true), which is SET LOCAL), and every query also names the company as a parameter.
The company comes from the request context (Chapter 18), never from a tool input or the model.
"""

from __future__ import annotations

import asyncio
import weakref
from collections.abc import Awaitable, Callable
from typing import Any, Protocol, TypeVar

import psycopg
from psycopg.rows import dict_row

from .embeddings import to_vector

T = TypeVar("T")
STATEMENT_TIMEOUT_MS = 3000
DB_TIMEOUT_MESSAGE = "The AP database did not answer in time. It may be waking up. Try again in a few seconds."
DB_UNAVAILABLE_MESSAGE = "The AP database is not reachable right now. Try again in a minute, and tell the AP lead if it keeps happening."


class DatabaseTimeout(Exception):
    pass


class DatabaseUnavailable(Exception):
    pass


class NoData:
    """Returned when the company has no row in tenants: no AP data is connected for it."""


NO_DATA = NoData()
Row = dict[str, Any]


class TenantQueries:
    """The queries one tool call may run, already bound to its company."""

    def __init__(self, conn: psycopg.AsyncConnection[Row], tenant: str) -> None:
        self._c, self.tenant = conn, tenant

    async def _all(self, sql: str, params: tuple[Any, ...]) -> list[Row]:
        cur = await self._c.execute(sql, params)  # type: ignore[arg-type]
        return await cur.fetchall()

    async def vendor_ids(self) -> list[str]:
        return [r["vendor_id"] for r in await self._all("SELECT vendor_id FROM vendors WHERE tenant_id = %s ORDER BY vendor_id", (self.tenant,))]

    async def vendors(self, *, vendor_id: str | None = None, name: str | None = None) -> list[Row]:
        where = "v.vendor_id = %s" if vendor_id is not None else "strpos(lower(v.vendor_name), lower(%s)) > 0"
        return await self._all(
            f"""SELECT v.vendor_id, v.vendor_name, v.terms, b.account_last4 AS bank_account_last4, n.note
                  FROM vendors v
                  LEFT JOIN vendor_banking b ON b.tenant_id = v.tenant_id AND b.vendor_id = v.vendor_id
                  LEFT JOIN vendor_notes   n ON n.tenant_id = v.tenant_id AND n.vendor_id = v.vendor_id
                 WHERE v.tenant_id = %s AND {where} ORDER BY v.vendor_id""",
            (self.tenant, vendor_id if vendor_id is not None else name),
        )

    async def open_invoices(self, vendor_id: str | None, due: str | None, offset: int, limit: int) -> tuple[list[Row], int]:
        flt = """status = 'open' AND (%(v)s::text IS NULL OR vendor_id = %(v)s)
                 AND (%(d)s::date IS NULL OR (due_date IS NOT NULL AND due_date <= %(d)s::date))"""
        p: dict[str, Any] = {"t": self.tenant, "v": vendor_id, "d": due, "o": offset, "l": limit}
        cur = await self._c.execute(
            f"""SELECT invoice_number, vendor_id, to_char(invoice_date, 'YYYY-MM-DD') AS invoice_date,
                       to_char(due_date, 'YYYY-MM-DD') AS due_date, amount_cents::int AS amount_cents
                  FROM invoices WHERE tenant_id = %(t)s AND {flt} ORDER BY invoice_number OFFSET %(o)s LIMIT %(l)s""", p)  # type: ignore[arg-type]
        rows = await cur.fetchall()
        cur = await self._c.execute(f"SELECT count(*)::int AS n FROM invoices WHERE tenant_id = %(t)s AND {flt}", p)  # type: ignore[arg-type]
        count = await cur.fetchone()
        return rows, int(count["n"]) if count else 0

    async def invoice(self, invoice_number: str) -> Row | None:
        rows = await self._all(
            """SELECT invoice_number, vendor_id, amount_cents::int AS amount_cents
                 FROM invoices WHERE tenant_id = %s AND invoice_number = %s""", (self.tenant, invoice_number))
        return rows[0] if rows else None

    async def purchase_order(self, *, po_number: str | None = None, invoice_number: str | None = None) -> Row | None:
        where = "po_number = %s" if po_number is not None else "invoice_number = %s"
        rows = await self._all(
            f"""SELECT po_number, vendor_id, to_char(po_date, 'YYYY-MM-DD') AS po_date, amount_cents::int AS amount_cents, invoice_number
                  FROM purchase_orders WHERE tenant_id = %s AND {where} ORDER BY po_number LIMIT 1""",
            (self.tenant, po_number if po_number is not None else invoice_number))
        return rows[0] if rows else None

    async def po_range(self) -> tuple[str | None, str | None]:
        rows = await self._all("SELECT min(po_number) AS f, max(po_number) AS l FROM purchase_orders WHERE tenant_id = %s", (self.tenant,))
        return rows[0]["f"], rows[0]["l"]

    async def approval_threshold_cents(self) -> int:
        rows = await self._all("SELECT approval_threshold_cents::int AS c FROM tenant_settings WHERE tenant_id = %s", (self.tenant,))
        if not rows:
            raise RuntimeError("this company has no settings row")
        return int(rows[0]["c"])

    async def nearest_passages(self, embedding: list[float], model: str, limit: int) -> list[Row]:
        return await self._all(
            """SELECT p.document_id, d.title, d.file, p.section, p.line_start, p.line_end, p.content,
                      1 - (p.embedding <=> %(e)s::vector) AS similarity
                 FROM policy_passages p
                 JOIN policy_documents d ON d.tenant_id = p.tenant_id AND d.document_id = p.document_id
                WHERE p.tenant_id = %(t)s AND p.embedding_model = %(m)s
                ORDER BY p.embedding <=> %(e)s::vector LIMIT %(l)s""",
            {"t": self.tenant, "e": to_vector(embedding), "m": model, "l": limit},  # type: ignore[arg-type]
        )

    async def passage_models(self) -> list[str]:
        return [r["m"] for r in await self._all(
            "SELECT DISTINCT embedding_model AS m FROM policy_passages WHERE tenant_id = %s ORDER BY m", (self.tenant,))]


class ApDatabase(Protocol):
    async def for_tenant(self, tenant: str, work: Callable[[TenantQueries], Awaitable[T]]) -> T | NoData: ...


class ConnectDatabase:
    """The reader role (DATABASE_URL_READER), one connection per tool call. Never prints the connection string.

    The Python copy runs on your computer, where a new connection costs a few milliseconds. Online, the
    database's own pooled address or a pooling service keeps the real connections open (field guide F2).
    """

    def __init__(self, conninfo: str, timeout_ms: int = STATEMENT_TIMEOUT_MS, max_open: int = 10) -> None:
        self._conninfo, self._timeout_ms, self._max_open = conninfo, timeout_ms, max_open
        # 19.17: at most max_open connections at once from this copy, as a pool would allow. Found by the
        # data matrix (row D10): 200 calls at once opened 200 connections, past the database's limit,
        # and half the calls failed. One limit per event loop, because each test client runs its own.
        self._limits: weakref.WeakKeyDictionary[asyncio.AbstractEventLoop, asyncio.Semaphore] = weakref.WeakKeyDictionary()

    def _limit(self) -> asyncio.Semaphore:
        loop = asyncio.get_running_loop()
        if loop not in self._limits:
            self._limits[loop] = asyncio.Semaphore(self._max_open)
        return self._limits[loop]

    async def for_tenant(self, tenant: str, work: Callable[[TenantQueries], Awaitable[T]]) -> T | NoData:
        import re
        if not re.fullmatch(r"org_[a-z0-9_]+", tenant):
            raise ValueError("not a company id")
        async with self._limit():
            return await self._run(tenant, work)

    async def _run(self, tenant: str, work: Callable[[TenantQueries], Awaitable[T]]) -> T | NoData:
        try:
            conn: psycopg.AsyncConnection[Row] = await psycopg.AsyncConnection[Row].connect(
                self._conninfo, row_factory=dict_row, connect_timeout=5)
        except (psycopg.Error, OSError) as err:
            # A database that is waking up answers slowly: a connection that times out is a timeout (19.17).
            if "timeout" in str(err).lower():
                raise DatabaseTimeout("connection timeout") from err
            raise DatabaseUnavailable("could not connect") from err
        try:
            async with conn.transaction():
                await conn.execute("SET TRANSACTION READ ONLY")
                await conn.execute("SELECT set_config('app.tenant_id', %s, true), set_config('statement_timeout', %s, true)",
                                   (tenant, str(self._timeout_ms)))
                cur = await conn.execute("SELECT 1 FROM tenants WHERE id = %s", (tenant,))
                if await cur.fetchone() is None:
                    return NO_DATA
                return await work(TenantQueries(conn, tenant))
        except psycopg.errors.QueryCanceled as err:
            raise DatabaseTimeout("statement timeout") from err
        except psycopg.Error as err:
            raise DatabaseUnavailable(type(err).__name__) from err
        finally:
            await conn.close()
