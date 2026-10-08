# Task record A: duplicate check on invoice emails

**Job type:** event-triggered. Runs once for each new email in the AP inbox with an invoice attached.
**Owner account:** Maria's own. She set it up on Monday, November 9, 2026.

## Brief (as it stood in January 2027)

> For each new invoice email, compare the invoice number, vendor and amount with the register. If it matches an invoice already in the register, post "Possible duplicate: <vendor> <invoice>" in the AP channel. Otherwise do nothing.

## Run history

| Trigger time | Message ID | Email | Result |
| --- | --- | --- | --- |
| Mon Jan 11, 10:14 a.m. | MSG-0111-01 | Hillcrest Pallet Co. 4135 | Completed. No message posted. |
| Mon Jan 11, 2:40 p.m. | MSG-0111-02 | Cedar Label Works 4186 | Completed. No message posted. |
| Mon Jan 11, 8:52 p.m. | MSG-0111-03 | Greenway Office Supply 4203 | Completed. No message posted. |
| Tue Jan 12, 8:05 a.m. | MSG-0112-01 | Kenton Box & Crate 7781-R | Not started. Usage limit reached. |
| Tue Jan 12, 8:31 a.m. | MSG-0112-02 | Ironwood Fasteners 4220 | Not started. Usage limit reached. |
| Tue Jan 12, 9:10 a.m. to 4:48 p.m. | MSG-0112-03 to MSG-0112-09 | 7 more emails | Not started. Usage limit reached. |

The invoices in these emails are not in the register file in this lab, except 7781-R. Treat them as entered later.

No notification was sent to anyone when runs did not start.
