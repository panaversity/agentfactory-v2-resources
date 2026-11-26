-- Lab 20b, Task 1: review notes for the month-end review workspace (docs/review-spec.md).
-- One note per invoice per company, kept apart by company exactly like Chapter 19's tables (19.4, 19.8):
-- the company is in the key, row-level security is forced, and every policy reads the company the
-- transaction set (19.9). The AP tables do not change.

CREATE TABLE review_notes (
  tenant_id      text        NOT NULL REFERENCES tenants (id),
  invoice_number text        NOT NULL,
  note           text        NOT NULL DEFAULT '',
  status         text        NOT NULL CHECK (status IN ('open', 'reviewed', 'follow up')),
  version        integer     NOT NULL CHECK (version >= 1),
  saved_by       text        NOT NULL,            -- the person's sign-in id (the token's sub)
  saved_by_name  text        NOT NULL,            -- their name, from the same token, for "saved by"
  saved_at       timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, invoice_number),
  -- A note belongs to one of the same company's invoices, never another company's (19.4).
  FOREIGN KEY (tenant_id, invoice_number) REFERENCES invoices (tenant_id, invoice_number)
);

ALTER TABLE review_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_notes FORCE ROW LEVEL SECURITY;

-- The workspace connector's own role. It logs in with its own password (npm run db:passwords), never
-- skips row-level security, reads the AP tables only through ap_reader's policies, and writes
-- review_notes only, for the one company its transaction set.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'review_writer') THEN
    CREATE ROLE review_writer NOLOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;
  END IF;
END
$$;
GRANT ap_reader TO review_writer;
GRANT SELECT, INSERT, UPDATE ON review_notes TO review_writer;
GRANT SELECT ON review_notes TO ap_reader;
GRANT SELECT, INSERT, UPDATE, DELETE ON review_notes TO ap_loader;

CREATE POLICY review_notes_reader ON review_notes FOR SELECT TO ap_reader
  USING (tenant_id = current_setting('app.tenant_id', true));
CREATE POLICY review_notes_writer ON review_notes FOR ALL TO review_writer
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));
-- The loader deletes a company's notes when the company is deleted or reloaded (tenant:delete, tenant:load --replace).
CREATE POLICY review_notes_loader ON review_notes FOR ALL TO ap_loader
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));
