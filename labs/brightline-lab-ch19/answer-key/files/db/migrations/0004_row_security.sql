-- 0004. Row-level security on every table (19.8), forced, so even the tables' owner is held to it.
-- The company comes from app.tenant_id, set for one transaction only (19.9). With nothing set,
-- current_setting('app.tenant_id', true) gives NULL (or '' on a connection that set it before),
-- which matches no tenant_id: no rows. The reader may only read. The loader reads and writes,
-- and USING plus WITH CHECK keep both what it sees and what it writes to the one company set.

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants FORCE ROW LEVEL SECURITY;
CREATE POLICY tenants_reader ON tenants FOR SELECT TO ap_reader
  USING (id = current_setting('app.tenant_id', true));
CREATE POLICY tenants_loader ON tenants FOR ALL TO ap_loader
  USING (id = current_setting('app.tenant_id', true))
  WITH CHECK (id = current_setting('app.tenant_id', true));

ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_settings FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_settings_reader ON tenant_settings FOR SELECT TO ap_reader
  USING (tenant_id = current_setting('app.tenant_id', true));
CREATE POLICY tenant_settings_loader ON tenant_settings FOR ALL TO ap_loader
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors FORCE ROW LEVEL SECURITY;
CREATE POLICY vendors_reader ON vendors FOR SELECT TO ap_reader
  USING (tenant_id = current_setting('app.tenant_id', true));
CREATE POLICY vendors_loader ON vendors FOR ALL TO ap_loader
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

ALTER TABLE vendor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_notes FORCE ROW LEVEL SECURITY;
CREATE POLICY vendor_notes_reader ON vendor_notes FOR SELECT TO ap_reader
  USING (tenant_id = current_setting('app.tenant_id', true));
CREATE POLICY vendor_notes_loader ON vendor_notes FOR ALL TO ap_loader
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

ALTER TABLE vendor_banking ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_banking FORCE ROW LEVEL SECURITY;
CREATE POLICY vendor_banking_reader ON vendor_banking FOR SELECT TO ap_reader
  USING (tenant_id = current_setting('app.tenant_id', true));
CREATE POLICY vendor_banking_loader ON vendor_banking FOR ALL TO ap_loader
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;
CREATE POLICY invoices_reader ON invoices FOR SELECT TO ap_reader
  USING (tenant_id = current_setting('app.tenant_id', true));
CREATE POLICY invoices_loader ON invoices FOR ALL TO ap_loader
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders FORCE ROW LEVEL SECURITY;
CREATE POLICY purchase_orders_reader ON purchase_orders FOR SELECT TO ap_reader
  USING (tenant_id = current_setting('app.tenant_id', true));
CREATE POLICY purchase_orders_loader ON purchase_orders FOR ALL TO ap_loader
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

ALTER TABLE policy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_documents FORCE ROW LEVEL SECURITY;
CREATE POLICY policy_documents_reader ON policy_documents FOR SELECT TO ap_reader
  USING (tenant_id = current_setting('app.tenant_id', true));
CREATE POLICY policy_documents_loader ON policy_documents FOR ALL TO ap_loader
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

ALTER TABLE policy_passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_passages FORCE ROW LEVEL SECURITY;
CREATE POLICY policy_passages_reader ON policy_passages FOR SELECT TO ap_reader
  USING (tenant_id = current_setting('app.tenant_id', true));
CREATE POLICY policy_passages_loader ON policy_passages FOR ALL TO ap_loader
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));
