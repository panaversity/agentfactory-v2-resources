"""Company names for the connector's messages. Mirrors servers/ap-ts/src/companies.ts.

19.5: a COPY of the sign-in server's organization names, kept on purpose for messages only. It never
decides access. A rename in the sign-in server needs a pull request here too."""

from __future__ import annotations

from collections.abc import Mapping
from types import MappingProxyType

COMPANY_NAMES: Mapping[str, str] = MappingProxyType({
    "org_brightline": "Brightline", "org_cedar": "Cedar Ridge Supply",
    "org_juniper": "Juniper Trail Outfitters", "org_conformance": "Conformance Test Co.",
})


def company_name(tenant: str) -> str:
    return COMPANY_NAMES.get(tenant, tenant)


def no_data(tenant: str) -> str:
    """Rule 7's message, word for word from docs/auth-spec.md."""
    return f"No AP data is connected for {company_name(tenant)} yet."
