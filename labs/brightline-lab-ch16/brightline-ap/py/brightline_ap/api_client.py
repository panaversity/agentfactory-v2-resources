"""Fetch vendors and every page of open invoices from the AP API.

Run from py/: uv run --env-file ../.env python -m brightline_ap.api_client
"""

import asyncio
import os
import time
from typing import Any

import httpx

from brightline_ap.schemas import InvoiceModel, VendorModel

BASE_URL = "http://localhost:4010"


async def _get(client: httpx.AsyncClient, path: str) -> Any:
    for attempt in (1, 2):
        async with asyncio.timeout(2):
            res = await client.get(path)
        if res.status_code == 503 and attempt == 1:
            continue
        res.raise_for_status()
        return res.json()


async def fetch_vendors(client: httpx.AsyncClient) -> list[VendorModel]:
    body = await _get(client, "/vendors")
    return [VendorModel.model_validate(v) for v in body["vendors"]]


async def fetch_open_invoices(client: httpx.AsyncClient) -> list[InvoiceModel]:
    first = await _get(client, "/invoices?status=open&page=1")
    items: list[Any] = list(first["invoices"])
    for page in range(2, int(first["pages"]) + 1):
        items.extend((await _get(client, f"/invoices?status=open&page={page}"))["invoices"])
    return [InvoiceModel.model_validate(i) for i in items]


async def fetch_both(client: httpx.AsyncClient) -> tuple[list[VendorModel], list[InvoiceModel]]:
    return await asyncio.gather(fetch_vendors(client), fetch_open_invoices(client))


async def main() -> None:
    key = os.environ["AP_API_KEY"]
    start = time.perf_counter()
    async with httpx.AsyncClient(base_url=BASE_URL, headers={"X-API-Key": key}) as client:
        vendors, invoices = await fetch_both(client)
    print(f"{len(vendors)} vendors, {len(invoices)} open invoices, {round((time.perf_counter() - start) * 1000)} ms")


if __name__ == "__main__":
    asyncio.run(main())
