-- 19.3, block 4. NULL means "no value". Nothing equals it, not even NULL.
-- role: reader
-- company: org_cedar
SELECT po_number FROM purchase_orders
 WHERE tenant_id = 'org_cedar' AND invoice_number = NULL;

SELECT po_number FROM purchase_orders
 WHERE tenant_id = 'org_cedar' AND invoice_number IS NULL;
