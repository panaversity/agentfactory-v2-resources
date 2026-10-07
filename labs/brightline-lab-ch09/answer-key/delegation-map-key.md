# Key: delegation map

| # | Step | Who next | Supported by |
| --- | --- | --- | --- |
| 1 | Export open invoices | A scheduled system export the worker reads. The run must not depend on Maria remembering | The register file, named in the spec |
| 2 | Pick invoices for the run | Worker | Concept: Weekly payment run and due dates |
| 3 | Mark approvals | Worker | Concept: Invoice approval threshold |
| 4 | Check duplicates | Worker drafts, Maria checks | Concept: Duplicate invoices, applied across the whole register, not one email |
| 5 | Check open vendor requests, recommend holds | Worker drafts, Maria checks | The SSoR record and concept: Changes to vendor bank details |
| 6 | Write the note | Worker | The standing spec |
| 7 | Review and correct | Maria, by noon Thursday | A named review. If Maria is out, a named stand-in |
| 8 | Send to Dave | Maria, after review | |
| 9 | Approve the run | Dave, from his own login | Never moves. Accountability |
| 10 | Callback on a bank-detail or vendor-record change | Maria | Never moves. Concept: Changes to vendor bank details (5.1) |

**Errors to avoid.** Letting the worker set holds in the accounting system (over-delegation). Letting the worker call or email vendors because it drafts well (halo delegation). Leaving step 7 without a named person or a stand-in (unstaffed gate). Dave's lapsed Thursday check was an unstaffed gate.

**Baseline.** 150 minutes, and the seven problems Dave found in one October package. Measure minutes per Thursday, corrections Maria makes, and errors reaching Dave, over three parallel weeks. Keep the new way only if minutes fall and errors do not rise.
