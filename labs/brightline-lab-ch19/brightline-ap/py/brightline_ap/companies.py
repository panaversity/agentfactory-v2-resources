"""Which company is which, and whose data lives where (docs/auth-spec.md). Fixed settings, the same for
every request: nothing here is about the request being served. Mirrors servers/ap-ts/src/companies.ts."""

from __future__ import annotations

import re
from collections.abc import Mapping
from types import MappingProxyType
from typing import Protocol

COMPANY_NAMES: Mapping[str, str] = MappingProxyType({
    "org_brightline": "Brightline", "org_cedar": "Cedar Ridge Supply",
    "org_juniper": "Juniper Trail Outfitters", "org_conformance": "Conformance Test Co.",
})
DEFAULT_DATA_TENANTS = "org_brightline=data,org_conformance=data-conformance"


def company_name(tenant: str) -> str:
    return COMPANY_NAMES.get(tenant, tenant)


def no_data(tenant: str) -> str:
    """Rule 7's message, word for word from docs/auth-spec.md."""
    return f"No AP data is connected for {company_name(tenant)} yet."


def parse_data_tenants(setting: str) -> Mapping[str, str]:
    """AP_DATA_TENANTS, "org_a=folder,org_b=folder", as a read-only map. Anything odd is refused."""
    folders: dict[str, str] = {}
    for pair in (p.strip() for p in setting.split(",")):
        if not pair:
            continue
        m = re.fullmatch(r"(org_[a-z0-9_]+)=(data(?:-[a-z0-9-]+)?)", pair)
        if not m:
            raise ValueError(f'AP_DATA_TENANTS: "{pair}" is not org_<id>=data or org_<id>=data-<name>')
        folders[m.group(1)] = m.group(2)
    return MappingProxyType(folders)


class DataSource(Protocol):
    async def read(self, path: str) -> str: ...


class CompanyData:
    """One company's data: the loaders ask for data/<file>, and get <folder>/<file>. Policies are shared."""

    def __init__(self, source: DataSource, folder: str) -> None:
        self.source, self.folder = source, folder

    async def read(self, path: str) -> str:
        return await self.source.read(f"{self.folder}/{path[len('data/'):]}" if path.startswith("data/") else path)
