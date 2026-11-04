-- 19.3, block 1. Filter, sort, take the first few. And why text sorts differently from numbers.
-- role: reader
-- company: org_cedar
SELECT invoice_number, vendor_id, amount_cents
  FROM invoices
 WHERE tenant_id = 'org_cedar' AND status = 'open'
 ORDER BY amount_cents DESC
 LIMIT 3;

SELECT '1290000' < '61875' AS compared_as_text,
        1290000  <  61875  AS compared_as_numbers;
