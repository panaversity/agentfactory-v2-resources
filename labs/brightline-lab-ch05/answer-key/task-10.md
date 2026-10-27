# Lab 5 answer key: Task 10. Three new vendors, as JSON

The answers for Task 10 of Lab 5, in Chapter 5 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When `Run: the vendor brief` is back, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your brief and the run's JSON in the chat. You have the final say. If a check passed only after you changed your brief and ran it again, you still get it: fixing the brief is the skill this lab teaches.

## The checks

Task 10 carries checks 20 to 23 of the lab's 26.

20. **Valid JSON, with one record for each of the three vendors, and in each record exactly these fields: vendor_id, legal_name, terms_days, currency and remit_email.** terms_days is a whole number, with no quotes. currency is three letters, or empty. Nothing else is inside the JSON.
    - Passed: the records match the table below. A list of missing values, or other notes, after the JSON and outside it, is fine. So is a saved file.
    - Missed: any other field, such as an address or a contact. A field under another name, such as remit_to_email. Terms as text, such as "Net 30".
21. **Riverside Tape's terms_days is 45.** Dave approved Net 45 on Friday, October 16, 2026. Only Maria's message says so: the form still says Net 30.
    - Missed: 30. The AI knows only what your brief tells it.
22. **Pinecrest Wrap's currency is empty, and the AI lists it as missing. No other value is guessed.** Empty means null or "". The form leaves that line blank, and a Toronto address and a "$" sign do not say which dollar.
    - Missed: "CAD" or "USD" for Pinecrest, even with a note, or any other value the forms do not give.
23. **Your brief in this chat named every field and its type, and said what to do with a missing value,** such as: leave it empty, and list the vendor and the field. A type can be a kind of value, such as text or a whole number, or a form, such as three letters.
    - Missed: a brief that leaves out a field or its type, or says nothing about a missing value.

## The records

| vendor_id | legal_name | terms_days | currency | remit_email |
| --- | --- | --- | --- | --- |
| V-1068 | Riverside Tape Co. | 45 | USD | ar@riversidetape.example |
| V-1069 | Great Lakes Label Inc. | 30 | USD | remit@greatlakeslabel.example |
| V-1070 | Pinecrest Wrap Ltd. | 30 | empty | accounts@pinecrestwrap.example |

Great Lakes Label's form also gives a sales email. remit_email is the remit-to address.

## Why

JSON that a system checks is extraction at its tightest (Lesson 5.6). Name every field and its type, and say what to return when a value is missing. A guessed value looks exactly like a real one, and this system rejects the whole file for one. The run had only your brief and the forms, so Riverside Tape's new terms reached it only through your brief.

## Never a deduction

- The order of the records, or null instead of "" for the empty currency.
- Notes after the JSON, such as a reason to confirm Pinecrest's currency, as long as the field stays empty.
- A remark about the weekday or the date.

## Take it to work

When a system reads the result, name every field, its type, and what to do when one is missing.
