# Key: Part E (example)

Your wording will differ. Check the reasoning, not the words.

**Thursday note. Lever: the inputs.**
> Open the AP register at <link to AP Register 2027>. Do not search by name. First line of the note: the file name, its last entry date and the number of open invoices due on or before the date of the next run, with their total. If the file cannot be opened, or its last entry is more than three business days old, or it lists fewer than 10 open invoices due, do not write the note. Save "Pre-run note skipped: register check failed (<reason>)" in the notes folder, tell Maria, and stop.

Success signal: the first line, every week, with file name, date, count and total.

**Duplicate check. Lever: the brief (success signal and matching). The diagnosed cause, capacity, is fixed in the Role Contract's usage budget, not here.** Make these as separate changes and test each one on the January 12 emails before the next.
> For each new invoice email, compare the vendor, the invoice number with any suffix such as -R removed, and the amount with the register, including paid invoices. If it matches, post "Possible duplicate: <vendor> <invoice>". After each check, add one line to the duplicate-check log: time, message ID, vendor, invoice, result.

**Separate daily check (a scheduled task, or a named person).** An event-triggered job cannot report that it never started, so the daily line must come from outside it:
> At 5 p.m. each weekday, list the message IDs of today's invoice emails in the AP inbox and the message IDs in today's duplicate-check log. Post "Duplicate check: <received> received, <checked> checked, <m> possible duplicates." Then list every received ID missing from the log, and every ID logged more than once, and tag Maria.

Match by message ID, not by count. Equal counts can hide a missed email if another was checked twice. If the 5 p.m. line has not appeared by 5:30 p.m., Jordan checks that day's invoice emails by hand and tells Maria.

After any outage, check the missed emails by hand. The usage owner change belongs in the Role Contract, not the brief.

**Short-payment replies. Lever: the brief (inputs and autonomy).**
> Outcome: a reply to each vendor that explains the short payment in plain numbers. Format: invoice amount, terms, discount or credit, amount paid, difference. Inputs: the vendor's terms from its vendor record, and the invoice and payment lines from the register. Autonomy: draft only. If the terms are not in the vendor record, say so and do not state any terms. If Brightline underpaid, say what is owed and flag it for Maria.

**Remittance replies (if you fixed it too).** Lever: permissions. Reconnect the drive with read access to the Remittances folder only. Brief rule: "If an attachment cannot be retrieved, do not say it is attached. Stop and report it."
