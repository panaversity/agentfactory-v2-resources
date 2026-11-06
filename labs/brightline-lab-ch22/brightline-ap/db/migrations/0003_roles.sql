-- 0003. The two roles that touch company data (19.8). Made here, with SQL, never in a dashboard:
-- a role made in the hosting service's dashboard may carry the right to bypass row-level security.
-- Neither can log in yet: `npm run db:passwords` gives each a password from .secrets (never in git).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ap_loader') THEN
    CREATE ROLE ap_loader NOLOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ap_reader') THEN
    CREATE ROLE ap_reader NOLOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO ap_loader, ap_reader;

-- The reader, used by the connector: read only.
GRANT SELECT ON tenants, tenant_settings, vendors, vendor_notes, vendor_banking, invoices,
  purchase_orders, policy_documents, policy_passages TO ap_reader;

-- The loader, used by the onboarding, deletion and embedding scripts: one company's rows at a time. (The export runs as the reader, 19.11.)
GRANT SELECT, INSERT, UPDATE, DELETE ON tenants, tenant_settings, vendors, vendor_notes,
  vendor_banking, invoices, purchase_orders, policy_documents, policy_passages TO ap_loader;
