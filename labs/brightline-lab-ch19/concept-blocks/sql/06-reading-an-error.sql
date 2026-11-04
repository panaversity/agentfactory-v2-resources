-- 19.3, block 6. The three refusals this chapter meets, and how to read each one.
-- role: loader
-- company: org_cedar
INSERT INTO invoices (tenant_id, invoice_number, vendor_id, invoice_date, terms, amount_cents, status)
VALUES ('org_cedar', 'INV-9001', 'V006', '2027-03-02', 'Net 30', 50000, 'open');

INSERT INTO vendors (tenant_id, vendor_id, vendor_name, terms)
VALUES ('org_brightline', 'V099', 'Test Vendor', 'Net 30');

DROP TABLE vendors;
