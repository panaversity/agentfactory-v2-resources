# Lab 10 answer key: Task 3. What the check needs

The answers for Task 3 of Lab 10, in Chapter 10 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When every column has its tier and action, the notes column included, you have attached your cut file and answered what still looks personal, the check on your cut file is back, and both questions after it are answered, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your document and its replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it.

## The checks

Task 3 carries checks 6 to 11 of the lab's 36.

For check 7, you answer before the AI shows the lesson's lines, and your first answer stays in the document. A changed answer after the lines passes too, when you said why.

6. **The tiers, and what the check keeps.**
   - `vendor_id`, `legal_name`, `dba_name`, `address`, `city`, `state`, `zip`: yellow, keep. Red also passes, because a sole proprietor's name next to an address is a person's data.
   - `tin_type`: yellow, keep.
   - `tin`: red, keep the last four digits.
   - `bank_routing`, `bank_account`: red, remove.
   - `contact_email`, `phone`: yellow, remove. Keep also passes: a shared phone or email can mark a match, and the cut file is yellow either way.
   - `small_supplier`, `onboarded`: yellow, remove. Keeping either also passes, as keeping `phone` does: the check does not need them, but the cut file stays yellow.
   - The full vendor master: red. The cut file: yellow. If you kept the notes, yellow or red passes here for the cut file. Check 9 grades the notes, and this check does not.
   - Passed: the bank numbers removed, the tax ID kept as its last four digits only, the names, addresses and tax ID type kept, `small_supplier` removed, and the two files' tiers.
   - Missed: a full tax ID or a bank number kept; the tax ID removed entirely; the cut file called green; or the cut file called red with the notes removed.
7. **The check on the cut file.** "The check on the cut file", in your document, names these four pairs, each with the columns it matched on, the tax ID's last four digits among them:
   - V-2003 Fairfield Pallet Co. and V-2033 Fairfield Pallet Company
   - V-2004 Mid-State Freight Inc. and V-2034 MidState Freight Inc
   - V-2005 Harbor Packaging LLC and V-2035 Harbor Pkg LLC
   - V-2007 Rosa Delgado and V-2036 Delgado Cleaning Services
   - Its "Compared:" line names V-2001 Union Packaging Inc. and V-2002 Union Packaging Supply LLC as not a pair, because their last four digits differ. And your answer says all four were found and the Union pair was left apart.
   - **The upload.** Under "The upload", your answer: at work, only a file of the kept columns, cut before it is uploaded, as you just did. Never the full vendor master, with the AI asked to leave columns out after the upload.
   - Passed: all of that.
   - Missed: a pair missing; the Union pair flagged; the Union pair not on the "Compared:" line; or an upload of the full vendor master.
8. **Without the tax IDs, and with codes for names.** Your answer: the check would lose the Delgado pair, which shares only a surname and a town, one a person at a street address and one a business at a post office box. And it might wrongly flag the Union pair, which shares a name and a ZIP code, or could not tell it from a real pair.
   - **Codes for names.** Your answer: no. The file is pseudonymized, not anonymous, and keeps its tier. The address, the ZIP code and the tax ID's last four digits can still point to one vendor, and a sole proprietor, such as Rosa Delgado, is a person.
   - Passed: Delgado lost, Union at risk, and codes do not make the file anonymous, with a reason, such as a column that still points to one vendor, or a sole proprietor being a person.
   - Missed: no pair named; a pair named for a reason its columns do not show; or the coded file called anonymous, or "no" with no reason.
9. **The free-text column.** `notes`: red, remove. Yellow and remove passes too.
   - What the notes hold, in your words: something about a person that no other column holds, such as a vendor's medical leave or a family member, or a dispute. One of these is enough.
   - Passed: the column removed, with what the notes hold.
   - Missed: the column kept, in whole or in part; kept "with the names taken out", because each note still sits in its vendor's row; or called green.

10. **Cut before the upload.** The file you attached in this task is your cut file, never the export, and it holds none of the fields the check never needs. These must be gone from it:
    - `tin`, the whole tax ID number, a Social Security number for each sole proprietor
    - `bank_routing` and `bank_account`, the whole bank numbers
    - `small_supplier`
    - `notes`, which check 11 grades
    - and every other column you chose to remove, such as `contact_email`, `phone` or `onboarded`
    - What the check needs, and may stay: `vendor_id`, `legal_name`, `dba_name`, `address`, `city`, `state`, `zip`, `tin_type` and `tin_masked`. Check 6 grades which of them you kept.
    - Passed: none of these in the file you attached.
    - Missed: the export attached; a whole tax ID or a bank number in the file; or a column you removed still in it. If the AI found a whole number and you cut it and attached the file again, check the file you attached last: it passes when that file holds none of these. Then read the Why: at work, the number in the first file has already gone out, and that is an incident for the first hour.
11. **The notes, screened, and what is still personal.**
    - You read every note on your computer, and said what they hold, before the cut file came to the chat. The notes column is gone from that file, and no note's words are in another column.
    - Under "The cut file", your answer to the AI's list: the names, addresses and last four digits stay, because the check needs them. The cut file is still personal, not anonymous: a sole proprietor, such as Rosa Delgado, is a person, and her name sits beside her address.
    - Passed: both.
    - Missed: a note in the file you attached; the notes pasted into the chat; or the cut file called anonymous or safe.

## Why

Ask what the task needs, not what the file holds (10.2). Finding duplicates needs names, addresses, the tax ID type and its last four digits. It never needs a bank number, and it never needs the whole tax ID. So the full file is red, and the cut file drops to yellow: safer, not safe, because it still holds sole proprietors' names and addresses.

A free-text column can name a person, a health detail or a dispute after the name column is gone (10.2). Read it, or leave it out. Two of these notes look harmless. The others hold a vendor's medical leave, a family member and a dispute, and finding duplicates needs none of them. So the whole column goes.

Then test the cut file against answers you already know. Maria knows four pairs and one pair that only looks like one. A check that finds the four and leaves the Union pair apart shows the cut kept what the task needs. Take the tax IDs out as well, and the file looks safer, but the check gets worse: Rosa Delgado and Delgado Cleaning Services share only a surname and a town, and the two Union companies share a name and a ZIP code. That is redaction that breaks the task.

At work, a file for analysis is still an upload (10.2). Code execution needs the file, so the whole file goes in, with every column the question never uses. So you cut the file before you upload it, never after.

Order decides, so you made the change on your own side, before the upload (10.2). The AI never saw the export, the notes or a whole number. If you had uploaded the export and then asked the AI to cut it, every tax ID, bank number and note would already have gone to it. So a whole number in your first upload is a miss, even if you cut it after: in real work there is no taking it back. Then the AI's list shows what a redacted file still holds. Rosa Delgado's name, her street address and the last four digits of her Social Security number are still there, because the check needs them. That is why the cut file stays yellow, personal data that needs an approved route (Task 4), and not anonymous.

## Never a deduction

- Columns kept or removed in a different order, or grouped another way.
- A check that also names the columns it did not use.
- The check's pairs in a different order.
- Naming only one or two of the notes, or calling the dispute confidential rather than personal.
- Saying that in the full 412-vendor master, more vendors would share four digits, so a person confirms each pair.
- The fictional first row of the export still in your cut file, or taken out.
- A cut file named differently, or saved from any spreadsheet app.
- A ZIP code or date that your spreadsheet app changed, such as 03060 shown as 3060.
- A remark about the lab's dates.

## Take it to work

Which columns does the task need, and does the cut file still find the answers you already know?
