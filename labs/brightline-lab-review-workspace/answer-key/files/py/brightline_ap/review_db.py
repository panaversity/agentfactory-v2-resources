"""The review workspace's database layer in Python (Lab 20b, Task 4). Mirrors servers/review-ts/src/db.ts.

The AP connector's rule, unchanged (19.9): one tool call is one transaction, with the company set for
that transaction only (set_config(..., true)), and every query also names the company as a parameter.
It logs in as review_writer (DATABASE_URL_REVIEW_WRITER): the AP tables are read through their
policies, and the only table it can write is review_notes.
"""

from __future__ import annotations

import asyncio
import re
import weakref
from collections.abc import Awaitable, Callable
from typing import Any, TypeVar

import psycopg
from psycopg.rows import dict_row

from .db import NO_DATA, STATEMENT_TIMEOUT_MS, DatabaseTimeout, DatabaseUnavailable, NoData

T = TypeVar("T")
Row = dict[str, Any]
STATUSES = ("open", "reviewed", "follow up")
_AT = "to_char({col} AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI\"Z\"')"


class ReviewQueries:
    """The queries one workspace call may run, already bound to its company."""

    def __init__(self, conn: psycopg.AsyncConnection[Row], tenant: str) -> None:
        self._c, self.tenant = conn, tenant

    async def _all(self, sql: str, params: tuple[Any, ...]) -> list[Row]:
        cur = await self._c.execute(sql, params)  # pyright: ignore[reportArgumentType]
        return list(await cur.fetchall())

    async def open_invoices(self) -> list[Row]:
        """Every open invoice, with its note's status and version (0 when there is no note yet)."""
        return await self._all(
            f"""SELECT i.invoice_number, i.vendor_id, v.vendor_name, to_char(i.invoice_date, 'YYYY-MM-DD') AS invoice_date,
                       to_char(i.due_date, 'YYYY-MM-DD') AS due_date, i.amount_cents::int AS amount_cents,
                       n.status, coalesce(n.version, 0) AS version, n.saved_by_name, {_AT.format(col='n.saved_at')} AS saved_at
                  FROM invoices i
                  JOIN vendors v ON v.tenant_id = i.tenant_id AND v.vendor_id = i.vendor_id
                  LEFT JOIN review_notes n ON n.tenant_id = i.tenant_id AND n.invoice_number = i.invoice_number
                 WHERE i.tenant_id = %s AND i.status = 'open'
                 ORDER BY i.invoice_number""",
            (self.tenant,))

    async def invoice(self, invoice_number: str) -> Row | None:
        rows = await self._all(
            """SELECT i.invoice_number, i.vendor_id, v.vendor_name, to_char(i.invoice_date, 'YYYY-MM-DD') AS invoice_date,
                      to_char(i.due_date, 'YYYY-MM-DD') AS due_date, i.amount_cents::int AS amount_cents, i.terms
                 FROM invoices i JOIN vendors v ON v.tenant_id = i.tenant_id AND v.vendor_id = i.vendor_id
                WHERE i.tenant_id = %s AND i.invoice_number = %s AND i.status = 'open'""",
            (self.tenant, invoice_number))
        if not rows:
            return None
        po = await self._all(
            """SELECT po_number, amount_cents::int AS amount_cents, to_char(po_date, 'YYYY-MM-DD') AS po_date
                 FROM purchase_orders WHERE tenant_id = %s AND invoice_number = %s ORDER BY po_number LIMIT 1""",
            (self.tenant, invoice_number))
        return {**rows[0], "purchase_order": po[0] if po else None}

    async def note(self, invoice_number: str) -> Row | None:
        rows = await self._all(
            f"""SELECT note, status, version, saved_by_name, {_AT.format(col='saved_at')} AS saved_at
                  FROM review_notes WHERE tenant_id = %s AND invoice_number = %s""",
            (self.tenant, invoice_number))
        return rows[0] if rows else None

    async def save_note(self, invoice_number: str, note: str, status: str, seen: int, person: str, name: str) -> Row:
        """Save a note only if nobody saved it since the person opened it (`seen`: the version they saw)."""
        if not await self._all("SELECT 1 FROM invoices WHERE tenant_id = %s AND invoice_number = %s AND status = 'open'",
                               (self.tenant, invoice_number)):
            return {"kind": "not_found"}
        current = await self._all("SELECT version FROM review_notes WHERE tenant_id = %s AND invoice_number = %s FOR UPDATE",
                                  (self.tenant, invoice_number))
        version = current[0]["version"] if current else 0
        if version != seen:
            return {"kind": "changed", "current": await self.note(invoice_number)}
        saved = await self._all(
            f"""INSERT INTO review_notes (tenant_id, invoice_number, note, status, version, saved_by, saved_by_name)
                VALUES (%s, %s, %s, %s, 1, %s, %s)
                ON CONFLICT (tenant_id, invoice_number) DO UPDATE
                   SET note = EXCLUDED.note, status = EXCLUDED.status, version = review_notes.version + 1,
                       saved_by = EXCLUDED.saved_by, saved_by_name = EXCLUDED.saved_by_name, saved_at = now()
                 WHERE review_notes.version = %s
                RETURNING version, {_AT.format(col='saved_at')} AS saved_at""",
            (self.tenant, invoice_number, note, status, person, name, seen))
        if not saved:
            return {"kind": "changed", "current": await self.note(invoice_number)}
        return {"kind": "saved", **saved[0]}


class ReviewDatabase:
    """review_writer (DATABASE_URL_REVIEW_WRITER), one connection per tool call. Never prints the connection string."""

    def __init__(self, conninfo: str, timeout_ms: int = STATEMENT_TIMEOUT_MS, max_open: int = 10) -> None:
        self._conninfo, self._timeout_ms, self._max_open = conninfo, timeout_ms, max_open
        self._limits: weakref.WeakKeyDictionary[asyncio.AbstractEventLoop, asyncio.Semaphore] = weakref.WeakKeyDictionary()

    def _limit(self) -> asyncio.Semaphore:
        loop = asyncio.get_running_loop()
        if loop not in self._limits:
            self._limits[loop] = asyncio.Semaphore(self._max_open)
        return self._limits[loop]

    async def for_tenant(self, tenant: str, work: Callable[[ReviewQueries], Awaitable[T]], *, write: bool = False) -> T | NoData:
        if not re.fullmatch(r"org_[a-z0-9_]+", tenant):
            raise ValueError("not a company id")
        async with self._limit():
            try:
                conn: psycopg.AsyncConnection[Row] = await psycopg.AsyncConnection[Row].connect(
                    self._conninfo, row_factory=dict_row, connect_timeout=5)
            except (psycopg.Error, OSError) as err:
                if "timeout" in str(err).lower():
                    raise DatabaseTimeout("connection timeout") from err
                raise DatabaseUnavailable("could not connect") from err
            try:
                async with conn.transaction():
                    if not write:
                        await conn.execute("SET TRANSACTION READ ONLY")
                    await conn.execute("SELECT set_config('app.tenant_id', %s, true), set_config('statement_timeout', %s, true)",
                                       (tenant, str(self._timeout_ms)))
                    cur = await conn.execute("SELECT 1 FROM tenants WHERE id = %s", (tenant,))
                    if await cur.fetchone() is None:
                        return NO_DATA
                    return await work(ReviewQueries(conn, tenant))
            except psycopg.errors.QueryCanceled as err:
                raise DatabaseTimeout("statement timeout") from err
            except psycopg.Error as err:
                raise DatabaseUnavailable(type(err).__name__) from err
            finally:
                await conn.close()
