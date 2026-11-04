-- 19.3, block 2. A join gives one row for every match, not one row per vendor.
-- role: reader
-- company: org_cedar
SELECT count(*) AS vendors FROM vendors WHERE tenant_id = 'org_cedar';

SELECT count(*) AS rows_after_join
  FROM vendors v
  JOIN invoices i ON i.tenant_id = v.tenant_id AND i.vendor_id = v.vendor_id
 WHERE v.tenant_id = 'org_cedar';

SELECT v.vendor_name, i.invoice_number
  FROM vendors v
  JOIN invoices i ON i.tenant_id = v.tenant_id AND i.vendor_id = v.vendor_id
 WHERE v.tenant_id = 'org_cedar' AND v.vendor_id = 'V001'
 ORDER BY i.invoice_number;
