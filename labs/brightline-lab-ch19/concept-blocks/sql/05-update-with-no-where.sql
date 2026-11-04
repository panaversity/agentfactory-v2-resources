-- 19.3, block 5. The most dangerous line an agent can write. Run as the loader, and always rolled back.
-- role: loader
-- company: org_cedar
SELECT count(*) AS rows_it_would_touch FROM vendors WHERE tenant_id = 'org_cedar' AND vendor_id = 'V003';

UPDATE vendors SET terms = 'Net 45' WHERE tenant_id = 'org_cedar' AND vendor_id = 'V003';

UPDATE vendors SET terms = 'Net 45';

SELECT count(*) AS vendors_now_on_net_45 FROM vendors WHERE terms = 'Net 45';
