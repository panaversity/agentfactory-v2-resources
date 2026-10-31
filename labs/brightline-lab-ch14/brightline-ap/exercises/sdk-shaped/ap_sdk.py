"""A made-up "AP SDK", shaped like the client libraries vendors publish.

Read it. Name each shape. You do not need to write code like this.
"""

import asyncio
import functools
import os
from collections.abc import AsyncIterator, Awaitable, Callable
from typing import Any, Self

import httpx


def retry_once(call: Callable[..., Awaitable[Any]]) -> Callable[..., Awaitable[Any]]:
    @functools.wraps(call)
    async def wrapper(*args: Any, **kwargs: Any) -> Any:
        try:
            return await call(*args, **kwargs)
        except httpx.HTTPStatusError:
            return await call(*args, **kwargs)  # one more try

    return wrapper


class ApClient:
    def __init__(self, base_url: str, api_key: str) -> None:
        self._http = httpx.AsyncClient(base_url=base_url, headers={"X-API-Key": api_key})

    async def __aenter__(self) -> Self:
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self._http.aclose()
        print("client closed")

    @retry_once
    async def vendors(self) -> list[dict[str, Any]]:
        response = await self._http.get("/vendors")
        return response.raise_for_status().json()["vendors"]

    async def open_invoices(self) -> AsyncIterator[dict[str, Any]]:
        page = 1
        while True:
            body = (await self._http.get(f"/invoices?status=open&page={page}")).json()
            for invoice in body["invoices"]:
                yield invoice
            if body["page"] >= body["pages"]:
                return
            page += 1


async def main() -> None:
    async with ApClient("http://localhost:4010", os.environ["AP_API_KEY"]) as client:
        print(f"{len(await client.vendors())} vendors")
        async for invoice in client.open_invoices():
            print(invoice["number"], invoice["amountCents"])


if __name__ == "__main__":
    asyncio.run(main())
