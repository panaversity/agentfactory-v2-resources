import os

import httpx

response = httpx.get(
    "http://localhost:4010/invoices",
    params={"status": "open", "page": 2},
    headers={"X-API-Key": os.environ["AP_API_KEY"]},
)
print(response.status_code)
body = response.json()
print(len(body["invoices"]), body["invoices"][0]["number"])
