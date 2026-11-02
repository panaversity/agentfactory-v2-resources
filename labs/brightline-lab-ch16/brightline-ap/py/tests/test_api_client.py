import asyncio

import httpx
import pytest

from brightline_ap.api_client import fetch_both, fetch_vendors
from brightline_ap.schemas import InvoiceModel, VendorModel

VENDORS = [{"id": f"V00{i}", "name": f"Vendor {i}", "terms": "Net 30"} for i in range(1, 9)]


def invoice(n: int) -> dict[str, object]:
    return {
        "number": f"INV-{8300 + n}", "vendorId": "V001", "invoiceDate": "2027-02-01", "dueDate": None,
        "terms": "Net 30", "amountCents": 100, "status": "open",
    }


def fake_api(seen: list[str]) -> httpx.MockTransport:
    busy = {"first": True}

    def handle(request: httpx.Request) -> httpx.Response:
        seen.append(request.url.raw_path.decode("ascii"))
        if request.headers.get("X-API-Key") != "k":
            return httpx.Response(401)
        if request.url.path == "/vendors":
            if busy["first"]:
                busy["first"] = False
                return httpx.Response(503)
            return httpx.Response(200, json={"vendors": VENDORS})
        page = int(request.url.params["page"])
        items = [invoice(n) for n in range((page - 1) * 5 + 1, min(page * 5, 13) + 1)]
        return httpx.Response(200, json={"invoices": items, "page": page, "pages": 3})

    return httpx.MockTransport(handle)


async def both(key: str, seen: list[str]) -> tuple[list[VendorModel], list[InvoiceModel]]:
    async with httpx.AsyncClient(base_url="http://ap", transport=fake_api(seen), headers={"X-API-Key": key}) as c:
        return await fetch_both(c)


async def vendors_only(key: str, seen: list[str]) -> list[VendorModel]:
    async with httpx.AsyncClient(base_url="http://ap", transport=fake_api(seen), headers={"X-API-Key": key}) as c:
        return await fetch_vendors(c)


def test_pages_and_one_retry() -> None:
    seen: list[str] = []
    vendors, invoices = asyncio.run(both("k", seen))
    assert len(vendors) == 8
    assert len({i.number for i in invoices}) == 13
    assert seen.count("/vendors") == 2
    assert len([u for u in seen if u.startswith("/invoices")]) == 3


def test_401_is_sent_once() -> None:
    seen: list[str] = []
    with pytest.raises(httpx.HTTPStatusError):
        asyncio.run(vendors_only("wrong", seen))
    assert seen == ["/vendors"]
