"""Rule 5 (18.12): calls counted per company, with a smaller limit per person inside it.

RateLimiter is the one shape every limiter has (the same idea as the TypeScript connector's, which is
Cloudflare's Rate Limiting binding). MemoryRateLimiter counts in this copy only: for tests and your computer.
"""

from __future__ import annotations

import threading
import time
from collections.abc import Callable
from dataclasses import dataclass
from typing import Literal, Protocol


class RateLimiter(Protocol):
    async def limit(self, key: str) -> bool:
        """Count one call for key. True if it is within the limit."""
        ...


class MemoryRateLimiter:
    """A fixed window per key: at most `max_calls` in each `period_seconds`. Holds counts, never data."""

    def __init__(self, max_calls: int, period_seconds: int, now: Callable[[], float] = time.monotonic) -> None:
        self.max_calls, self.period, self.now = max_calls, period_seconds, now
        self._windows: dict[str, tuple[float, int]] = {}
        self._lock = threading.Lock()

    async def limit(self, key: str) -> bool:
        with self._lock:
            t = self.now()
            start, count = self._windows.get(key, (t, 0))
            if t - start >= self.period:
                start, count = t, 0
            self._windows[key] = (start, count + 1)
            return count + 1 <= self.max_calls


@dataclass(frozen=True)
class Limits:
    company: RateLimiter
    person: RateLimiter


DEFAULT_COMPANY, DEFAULT_PERSON, PERIOD = 600, 120, 60


def memory_limits(company: int = DEFAULT_COMPANY, person: int = DEFAULT_PERSON) -> Limits:
    return Limits(company=MemoryRateLimiter(company, PERIOD), person=MemoryRateLimiter(person, PERIOD))


async def check_limits(limits: Limits, tenant: str, person: str) -> Literal["person", "company"] | None:
    """Person first, so a person over their own limit does not use up the company's."""
    if not await limits.person.limit(f"person:{tenant}/{person}"):
        return "person"
    if not await limits.company.limit(f"company:{tenant}"):
        return "company"
    return None
