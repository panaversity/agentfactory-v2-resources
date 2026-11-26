"""Embeddings for search_policy (19.13, field guide F4). Mirrors servers/ap-ts/src/embeddings.ts.

The same model must embed the passages and the question, so a search reads only rows whose
embedding_model equals this embedder's model. The test embedder gives exactly the numbers the
TypeScript one gives, so both servers find the same passages in the same database.
"""

from __future__ import annotations

import math
import re
from collections.abc import Mapping
from typing import Any, Protocol

import httpx

DIMENSIONS = 1024
BGE_M3 = "@cf/baai/bge-m3"
BGE_M3_MIN_SIMILARITY = 0.5
TEST_MODEL = "test-lexicon-v1"


class Embedder(Protocol):
    model: str
    min_similarity: float

    async def embed(self, texts: list[str]) -> list[list[float]]: ...


def _checked(vectors: list[list[float]], count: int, model: str) -> list[list[float]]:
    if len(vectors) != count:
        raise ValueError(f"{model} returned {len(vectors)} embeddings for {count} texts")
    for v in vectors:
        if len(v) != DIMENSIONS:
            raise ValueError(f"{model} returned {len(v)} numbers, not {DIMENSIONS}")
    return vectors


class WorkersAiRest:
    """bge-m3 on Cloudflare Workers AI, through its REST API with an API token (F4)."""

    model = BGE_M3
    min_similarity = BGE_M3_MIN_SIMILARITY

    def __init__(self, account_id: str, api_token: str) -> None:
        if not account_id or not api_token:
            raise ValueError("CLOUDFLARE_ACCOUNT_ID and AP_EMBEDDINGS_TOKEN must both be set for Workers AI")
        self._url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{BGE_M3}"
        self._headers = {"Authorization": f"Bearer {api_token}"}

    async def embed(self, texts: list[str]) -> list[list[float]]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(self._url, headers=self._headers, json={"text": texts})
        if response.status_code != 200:
            raise RuntimeError(f"Workers AI answered {response.status_code}")  # never the token or the texts
        body: dict[str, Any] = response.json()
        return _checked(body.get("result", {}).get("data", []), len(texts), BGE_M3)


# NOT a real model: a fixed word list, for tests and the authors' runs. See embeddings.ts.
_CONCEPTS: dict[str, str] = {}
for _concept, _words in {
    "po": "po pos purchase purchases order orders", "repair": "repair repairs fix service mechanic",
    "approval": "approve approval approvals approves sign signoff", "bank": "bank account banking routing deposit",
    "utility": "utility utilities power electric blanket", "vendor": "vendor vendors supplier suppliers",
    "invoice": "invoice invoices bill bills", "pay": "pay paid payment payments",
    "need": "required require requires need needs must", "above": "over above more exceeds",
    "below": "under less below", "change": "changes change new update", "digits": "digits four last",
}.items():
    for _w in _words.split():
        _CONCEPTS[_w] = _concept
_STOP = set("a an the of to for is are be by do we it on in or and any our i can what does how such as with may at if".split())


def _fnv(text: str) -> int:
    h = 0x811C9DC5
    for ch in text:
        h = ((h ^ ord(ch)) * 0x01000193) & 0xFFFFFFFF
    return h


class TestEmbedder:
    model = TEST_MODEL

    def __init__(self, min_similarity: float = 0.3) -> None:
        self.min_similarity = min_similarity

    async def embed(self, texts: list[str]) -> list[list[float]]:
        out: list[list[float]] = []
        for text in texts:
            v = [0.0] * DIMENSIONS
            lowered = re.sub(r"\$[\d,.]+", " money ", text.lower())
            for w in (w for w in re.split(r"[^a-z0-9]+", lowered) if w and w not in _STOP):
                h = _fnv(_CONCEPTS.get(w, w))
                v[h % DIMENSIONS] += 1 if h & 1 else -1
            norm = math.hypot(*v) or 1.0
            out.append([x / norm for x in v])
        return out


def embedder_from_env(env: Mapping[str, str]) -> Embedder:
    if env.get("AP_EMBEDDINGS") == "test":
        return TestEmbedder()
    return WorkersAiRest(env.get("CLOUDFLARE_ACCOUNT_ID", ""), env.get("AP_EMBEDDINGS_TOKEN", ""))


def to_vector(v: list[float]) -> str:
    """pgvector's text form, always passed as a query parameter."""
    return "[" + ",".join(repr(x) for x in v) + "]"
