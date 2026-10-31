import asyncio
import time


async def wait(seconds: float, label: str) -> str:
    await asyncio.sleep(seconds)
    return label


async def main() -> None:
    start = time.perf_counter()
    first = await wait(0.3, "vendors")
    second = await wait(0.3, "invoices")
    print("one after the other", round((time.perf_counter() - start) * 1000), first, second)
    start = time.perf_counter()
    both = await asyncio.gather(wait(0.3, "vendors"), wait(0.3, "invoices"))
    print("at the same time", round((time.perf_counter() - start) * 1000), both)


asyncio.run(main())
