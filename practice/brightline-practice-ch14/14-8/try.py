import asyncio
import time

async def main() -> None:
    start = time.perf_counter()
    first = await asyncio.sleep(0.3, "vendors")
    second = await asyncio.sleep(0.3, "invoices")
    ms = round((time.perf_counter() - start) * 1000)
    print("one after the other", ms, first, second)
    start = time.perf_counter()
    both = await asyncio.gather(asyncio.sleep(0.3, "vendors"), asyncio.sleep(0.3, "invoices"))
    ms = round((time.perf_counter() - start) * 1000)
    print("at the same time", ms, both)

asyncio.run(main())
