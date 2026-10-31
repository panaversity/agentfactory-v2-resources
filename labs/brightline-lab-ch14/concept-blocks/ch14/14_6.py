import json
import os

import httpx

response = httpx.get(
    "http://localhost:4010/invoices",
    params={"status": "open", "page": 2},
    headers={"X-API-Key": os.environ["AP_API_KEY"]},
)
print(response.status_code, response.headers["content-type"])
body = response.json()
print(body["page"], body["pages"], len(body["invoices"]), body["invoices"][0]["number"])
print(json.dumps({"number": "INV-8306", "amountCents": 158200, "dueDate": "2027-03-08"}))
