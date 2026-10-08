# Key: Part B

## Columns

| Column | Tier | Needed? | Action |
| --- | --- | --- | --- |
| vendor_id | yellow | yes, to name the pair | keep |
| legal_name | yellow | yes | keep |
| dba_name | yellow | yes | keep |
| address, city, state, zip | yellow | yes | keep |
| tin_type | yellow | yes | keep |
| tin | red | only the last four digits | replace with tin_last4 |
| bank_routing, bank_account | red | no | remove |
| contact_email, phone | yellow | no | remove |
| small_supplier, onboarded | yellow (internal) | no | remove |

The full file is **red**. It holds bank account numbers and 6 Social Security numbers. That is why it must never go to an unapproved route, and why redaction comes first.

**Accept** sole proprietors' names as red, if the learner says a person's name next to an address is personal data. The keep list does not change.

## Route

The redacted file may go only through Brightline's company workspace, once Dave confirms that route for vendor data. The tax IDs were collected to file tax forms. Finding duplicates before filing is part of that purpose. Training a model is not.

## Known-answer test

Rows in: 36. Rows out: 36. Columns out: vendor_id, legal_name, dba_name, address, city, state, zip, tin_type, tin_last4.

In this file, a check that groups by tax ID type and last four digits finds exactly these four pairs. Each is a candidate for Maria to confirm, not proof. In the full 412-vendor master, more vendors would share last four digits, so the check would need names and addresses too:

| Record | Duplicate | Why |
| --- | --- | --- |
| V-2003 Fairfield Pallet Co. | V-2033 Fairfield Pallet Company | same tax ID, name and address written differently |
| V-2004 Mid-State Freight Inc. | V-2034 MidState Freight Inc | same tax ID, name written differently, different bank account |
| V-2005 Harbor Packaging LLC | V-2035 Harbor Pkg LLC | same tax ID, short name |
| V-2007 Rosa Delgado | V-2036 Delgado Cleaning Services | sole proprietor entered once under her own name, at her street address, and once under her business name, at a post office box. Only the tax ID type and last four digits link them |

The decoy, Union Packaging Inc. and Union Packaging Supply LLC, has similar names and the same ZIP code, but different last four digits, and is not flagged.

**With all tax ID columns removed,** the check must rely on names and addresses. It may still guess some pairs, but nothing confirms them. The two Delgado records share only her surname and her town: one is a person at a street address, the other a business at a post office box. The decoy shares a name and a ZIP code with Union Packaging Inc. So without tax IDs, the check cannot tell the real duplicate from the decoy. When this lab was tested, chats either missed the Delgado pair or listed it beside the decoy, both as weak matches. Record what your run did. This is redaction that breaks the task: the file looks safer and the check gets worse.

Every figure in this key was computed from the CSV and checked.
