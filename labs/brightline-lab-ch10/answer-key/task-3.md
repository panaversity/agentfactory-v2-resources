# Lab 10 answer key: Task 3. What the check needs

The answers for Task 3 of Lab 10, in Chapter 10 of *The AI Agent Factory*, Second Edition. Every name, number and company in this lab is invented.

**How this key is used.** When every column has its tier and action, the check on your kept columns is back, and both questions after it are answered, attach this file in your lab chat, and send the check prompt. The AI marks each check Passed or Missed, quoting your document and its replies in the chat. You have the final say. If a check passed only after you changed a line, you still get it.

## The checks

Task 3 carries checks 6 to 8 of the lab's 30.

6. **The tiers, and what the check keeps.**
   - `vendor_id`, `legal_name`, `dba_name`, `address`, `city`, `state`, `zip`: yellow, keep. Red also passes, because a sole proprietor's name next to an address is a person's data.
   - `tin_type`: yellow, keep.
   - `tin`: red, keep the last four digits.
   - `bank_routing`, `bank_account`: red, remove.
   - `contact_email`, `phone`: yellow, remove.
   - `small_supplier`, `onboarded`: yellow, remove.
   - The full vendor master: red. The cut file: yellow.
   - Passed: the bank numbers removed, the tax ID kept as its last four digits only, the names, addresses and tax ID type kept, the other columns removed, and the two files' tiers.
   - Missed: a full tax ID or a bank number kept; the tax ID removed entirely; or the cut file called green or red.
7. **The check on the kept columns.** "The check on the kept columns", in your document, names these four pairs, each with the kept columns it matched on, the tax ID type and last four digits among them:
   - V-2003 Fairfield Pallet Co. and V-2033 Fairfield Pallet Company
   - V-2004 Mid-State Freight Inc. and V-2034 MidState Freight Inc
   - V-2005 Harbor Packaging LLC and V-2035 Harbor Pkg LLC
   - V-2007 Rosa Delgado and V-2036 Delgado Cleaning Services
   - Its "Compared:" line names V-2001 Union Packaging Inc. and V-2002 Union Packaging Supply LLC as not a pair, because their last four digits differ. And your answer says all four were found and the Union pair was left apart.
   - Passed: all of that.
   - Missed: a pair missing; the Union pair flagged; or the Union pair not on the "Compared:" line.
8. **Without the tax IDs.** Your answer: the check would lose the Delgado pair, which shares only a surname and a town, one a person at a street address and one a business at a post office box. And it might wrongly flag the Union pair, which shares a name and a ZIP code, or could not tell it from a real pair.
   - Passed: Delgado lost, and Union at risk.
   - Missed: no pair named, or a pair named for a reason its columns do not show.

## Why

Ask what the task needs, not what the file holds (10.2). Finding duplicates needs names, addresses, the tax ID type and its last four digits. It never needs a bank number, and it never needs the whole tax ID. So the full file is red, and the cut file drops to yellow: safer, not safe, because it still holds sole proprietors' names and addresses.

Then test the cut file against answers you already know. Maria knows four pairs and one pair that only looks like one. A check that finds the four and leaves the Union pair apart shows the cut kept what the task needs. Take the tax IDs out as well, and the file looks safer, but the check gets worse: Rosa Delgado and Delgado Cleaning Services share only a surname and a town, and the two Union companies share a name and a ZIP code. That is redaction that breaks the task.

## Never a deduction

- Columns kept or removed in a different order, or grouped another way.
- A check that also names the columns it did not use.
- The check's pairs in a different order.
- Saying that in the full 412-vendor master, more vendors would share four digits, so a person confirms each pair.
- A remark about the lab's dates.

## Take it to work

Which columns does the task need, and does the cut file still find the answers you already know?
