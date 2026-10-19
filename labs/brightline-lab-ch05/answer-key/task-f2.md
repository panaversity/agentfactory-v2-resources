# Lab 5 answer key: Task F2. Three new vendors, as JSON

The answers for Task F2 of Lab 5, in Chapter 5 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When Task F2's run is done, attach this file in the same conversation, with Part F's check prompt. Your AI marks each check Passed or Missed, quoting the words that show it. Then read the checks yourself and compare. You have the final say.

## The checks

Task F2 carries checks 4 to 7 of Part F's 7.

4. **Valid JSON, with one record for each of the three vendors, and in each record exactly these fields: vendor_id, legal_name, terms_days, currency and remit_email.** terms_days is a whole number, with no quotes. currency is three letters, or empty. Nothing else is inside the JSON.
   - Passed: the records match the table below. A list of missing values, or other notes, after the JSON and outside it, is fine. So is a saved file.
   - Missed: any other field, such as an address or a contact. A field under another name, such as remit_to_email. Terms as text, such as "Net 30".
5. **Riverside Tape's terms_days is 45.** Dave approved Net 45 on Friday, October 16, 2026. Only Maria's message says so: the form still says Net 30.
   - Missed: 30. The AI knows only what your brief tells it.
6. **Pinecrest Wrap's currency is empty, and the AI lists it as missing. No other value is guessed.** Empty means null or "". The form leaves that line blank, and a Toronto address and a "$" sign do not say which dollar.
   - Missed: "CAD" or "USD" for Pinecrest, even with a note, or any other value the forms do not give.
7. **Your brief named every field and its type, and said what to do with a missing value,** such as: leave it empty, and list the vendor and the field. A type can be a kind of value, such as text or a whole number, or a form, such as three letters.
   - Missed: a brief that leaves out a field or its type, or says nothing about a missing value.

## The records

| vendor_id | legal_name | terms_days | currency | remit_email |
| --- | --- | --- | --- | --- |
| V-1068 | Riverside Tape Co. | 45 | USD | ar@riversidetape.example |
| V-1069 | Great Lakes Label Inc. | 30 | USD | remit@greatlakeslabel.example |
| V-1070 | Pinecrest Wrap Ltd. | 30 | empty | accounts@pinecrestwrap.example |

Great Lakes Label's form also gives a sales email. remit_email is the remit-to address.

## Never a deduction

- The order of the records, or null instead of "" for the empty currency.
- Notes after the JSON, such as a reason to confirm Pinecrest's currency, as long as the field stays empty.
- A remark about the weekday or the date.
