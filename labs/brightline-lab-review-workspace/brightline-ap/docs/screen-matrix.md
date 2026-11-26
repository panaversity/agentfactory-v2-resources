# The screen matrix

Lab 20, Task 5 (and row C8 from Task 6). Every row is one click by one person, sent as the AI app would send it, with that person's test token, against both connectors, both running on your computer. Run it with `npm run matrix:screen`. It ends `matrix:screen: N rows passed, 0 failed`, and a last row that checks both connectors gave the same answer on every row.

The script checks what each connector answers. Row C8 also draws the real page in a headless browser with each connector's own answers, and checks that the planted note shows as characters, with no new element on the page and no request. What Claude shows, such as C2's words, you check by eye.

| Row | Who | Does | Expects |
| --- | --- | --- | --- |
| C1 | Luis | *Next page* | Rows 6 to 10, Cedar Ridge's: INV-6206 to INV-6210 |
| C2 | Marco (`auditor`) | *Vendor details* on V102 | 403 `insufficient_scope`, and "Your role does not include vendor details." on the screen |
| C3 | Luis | The page asks `get_purchase_order` for Brightline's INV-8301 | "No invoice INV-8301 in the AP data.", word for word the reply for an invoice that exists nowhere |
| C4 | Priya, signed in for Cedar Ridge | Opens the screen | Cedar Ridge's 16 only |
| C5 | Luis | *Next page* with Ana's handle | Refused: "This page handle belongs to another person or company. Call again without page." |
| C6 | Marco | `next_invoice_page` from a script, no AI app | Checked like any call: answered, rows 6 to 10 of Cedar Ridge's. With no token: 401 |
| C7 | Luis, with the screen open | *Next page* after his token expired | 401, and no rows reach the page. Signed in again, *Next page* works |
| C8 | Luis | *Vendor details* on V102, with Task 6's planted note | The note comes back unchanged, as data, and the page shows every value as text |
| C9 | Priya, now signed in for Cedar Ridge | *Next page* on a screen she opened while signed in for Brightline | Refused, because the handle was made for Brightline. Page one again is Cedar Ridge's 16 |

C7 is an expired token only. A removed person's token keeps working until it expires (18.14), so an expired token is the case a screen left open must handle.
