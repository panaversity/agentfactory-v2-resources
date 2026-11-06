# TEST DATA: Conformance Test Co. (`org_conformance`)

Every file here is a copy of the sample rows in `data/`, made for automated checks only (Lab 18, Task 9b).
It is not any real company's data. The CI client's tokens carry `tenant: org_conformance`, and the
connector serves them these rows (`AP_DATA_TENANTS`), so the conformance suite never reads Brightline's
folder. Keep the rows identical to `data/`: the acceptance checks expect the same answers.
