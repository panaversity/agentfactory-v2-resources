"""The stops you add yourself (Concept 20.8).

The model's own stop is not enough: a loop also ends at a turn limit, a cost cap
computed from usage, or a time limit, whichever comes first.
"""
from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Callable, Literal


@dataclass(frozen=True)
class Limits:
    max_turns: int  # model calls in one run
    max_cost_usd: float  # the cost cap, in dollars
    max_seconds: float  # the time limit for the whole run


@dataclass(frozen=True)
class Prices:
    """Dollars per million tokens, from the provider's own pricing page (F5)."""

    input: float
    output: float
    cache_write: float
    cache_read: float


@dataclass(frozen=True)
class TokenCount:
    input: int  # uncached input
    output: int
    cache_write: int = 0
    cache_read: int = 0


def cost_usd(tokens: TokenCount, prices: Prices) -> float:
    per_token = 1 / 1_000_000
    return (
        tokens.input * prices.input * per_token
        + tokens.output * prices.output * per_token
        + tokens.cache_write * prices.cache_write * per_token
        + tokens.cache_read * prices.cache_read * per_token
    )


LimitStop = Literal["turn_limit", "cost_cap", "time_limit"]


@dataclass
class RunMeter:
    limits: Limits
    prices: Prices
    now: Callable[[], float] = time.monotonic
    spent: float = 0.0
    started_at: float = field(init=False)

    def __post_init__(self) -> None:
        self.started_at = self.now()

    def before_turn(self, turn: int) -> LimitStop | None:
        """Called before every model call. Returns a reason to stop, or None to go on."""
        if turn > self.limits.max_turns:
            return "turn_limit"
        if self.spent >= self.limits.max_cost_usd:
            return "cost_cap"
        if self.now() - self.started_at >= self.limits.max_seconds:
            return "time_limit"
        return None

    def add_usage(self, tokens: TokenCount) -> None:
        """Called after every model call, with that call's usage."""
        self.spent += cost_usd(tokens, self.prices)
