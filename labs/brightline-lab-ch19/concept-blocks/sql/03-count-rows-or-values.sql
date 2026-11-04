-- 19.3, block 3. count(*) counts rows. count(a_column) counts only the rows where that column has a value.
-- role: reader
-- company: org_cedar
SELECT count(*) AS invoices, count(due_date) AS with_a_due_date
  FROM invoices
 WHERE tenant_id = 'org_cedar';

SELECT status, count(*) AS invoices, sum(amount_cents) AS total_cents
  FROM invoices
 WHERE tenant_id = 'org_cedar'
 GROUP BY status
 ORDER BY status;
