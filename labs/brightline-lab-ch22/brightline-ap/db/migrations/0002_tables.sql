-- 0002. Brightline's AP tables (docs/data-spec.md, 19.4 and 19.5).
-- Every table has tenant_id, and every primary and foreign key includes it. So a row can only ever
-- point at a row of the same company, and two companies may use the same ids (V001, INV-8303).
-- A company's name is NOT here. It lives in one place only: the sign-in database (Chapter 18).

-- The SHA-256 of a text's UTF-8 bytes, the same bytes the loader hashes. (sha256(content::bytea) would read
-- backslashes in the text as escapes.) IMMUTABLE so a generated column may use it: the database's encoding is fixed.
CREATE FUNCTION ap_utf8_sha256(t text) RETURNS bytea LANGUAGE sql IMMUTABLE PARALLEL SAFE
  AS 'SELECT sha256(convert_to(t, ''UTF8''))';

-- One row per company whose data is connected. The id is the sign-in server's organization id.
CREATE TABLE tenants (
  id         text PRIMARY KEY CHECK (id ~ '^org_[a-z0-9_]+$'),
  loaded_at  timestamptz NOT NULL DEFAULT now()
);

-- Each company's own rules (19.11). One row per company.
CREATE TABLE tenant_settings (
  tenant_id                text   PRIMARY KEY REFERENCES tenants(id),
  approval_threshold_cents bigint NOT NULL CHECK (approval_threshold_cents > 0)
);

CREATE TABLE vendors (
  tenant_id   text NOT NULL REFERENCES tenants(id),
  vendor_id   text NOT NULL CHECK (vendor_id ~ '^V\d{3}$'),
  vendor_name text NOT NULL CHECK (length(vendor_name) BETWEEN 1 AND 200),
  terms       text NOT NULL,
  PRIMARY KEY (tenant_id, vendor_id)
);

CREATE TABLE vendor_notes (
  tenant_id text NOT NULL,
  vendor_id text NOT NULL,
  note      text,
  PRIMARY KEY (tenant_id, vendor_id),
  FOREIGN KEY (tenant_id, vendor_id) REFERENCES vendors (tenant_id, vendor_id)
);

-- Only the last four digits are ever stored (19.11: data you never store cannot leak).
CREATE TABLE vendor_banking (
  tenant_id     text NOT NULL,
  vendor_id     text NOT NULL,
  bank_name     text NOT NULL,
  account_last4 text NOT NULL CHECK (account_last4 ~ '^\d{4}$'),
  PRIMARY KEY (tenant_id, vendor_id),
  FOREIGN KEY (tenant_id, vendor_id) REFERENCES vendors (tenant_id, vendor_id)
);

-- terms is the invoice's own fact (what the invoice says), not a copy of the vendor's terms:
-- the AP triage rules treat an invoice whose terms differ from its vendor's as an exception.
CREATE TABLE invoices (
  tenant_id      text   NOT NULL,
  invoice_number text   NOT NULL CHECK (invoice_number ~ '^INV-\d{4}$'),
  vendor_id      text   NOT NULL,
  invoice_date   date   NOT NULL,
  due_date       date,
  terms          text   NOT NULL,
  amount_cents   bigint NOT NULL CHECK (amount_cents >= 0),
  status         text   NOT NULL CHECK (status IN ('open', 'paid')),
  PRIMARY KEY (tenant_id, invoice_number),
  FOREIGN KEY (tenant_id, vendor_id) REFERENCES vendors (tenant_id, vendor_id)
);

CREATE TABLE purchase_orders (
  tenant_id      text   NOT NULL,
  po_number      text   NOT NULL CHECK (po_number ~ '^PO-\d{4}$'),
  vendor_id      text   NOT NULL,
  po_date        date   NOT NULL,
  amount_cents   bigint NOT NULL CHECK (amount_cents >= 0),
  invoice_number text,
  PRIMARY KEY (tenant_id, po_number),
  FOREIGN KEY (tenant_id, vendor_id) REFERENCES vendors (tenant_id, vendor_id),
  FOREIGN KEY (tenant_id, invoice_number) REFERENCES invoices (tenant_id, invoice_number)
);

-- The policy documents that count, decided by each company's AP lead (19.15).
CREATE TABLE policy_documents (
  tenant_id   text NOT NULL REFERENCES tenants(id),
  document_id text NOT NULL CHECK (document_id ~ '^[a-z0-9-]+$'),
  title       text NOT NULL,
  file        text NOT NULL,
  PRIMARY KEY (tenant_id, document_id)
);

-- One row per passage (chunk), 19.5. The embedding is a copy kept on purpose: the text and the model already
-- decide it, but the search needs the vector beside its text and its company. The CHECK keeps it true: the
-- embedding must have been made from exactly this content. tenant_id is part of the key, as in every table,
-- and the composite foreign key makes it equal to its document's company.
CREATE TABLE policy_passages (
  tenant_id       text        NOT NULL,
  passage_id      text        NOT NULL,
  document_id     text        NOT NULL,
  section         text        NOT NULL,
  line_start      int         NOT NULL CHECK (line_start > 0),
  line_end        int         NOT NULL CHECK (line_end >= line_start),
  content         text        NOT NULL CHECK (length(content) BETWEEN 1 AND 4000),
  content_sha256  bytea       GENERATED ALWAYS AS (ap_utf8_sha256(content)) STORED,
  embedded_sha256 bytea       NOT NULL,
  embedding_model text        NOT NULL,
  embedding       vector(1024) NOT NULL,
  PRIMARY KEY (tenant_id, passage_id),
  FOREIGN KEY (tenant_id, document_id) REFERENCES policy_documents (tenant_id, document_id),
  CONSTRAINT embedding_matches_content CHECK (embedded_sha256 = content_sha256)
);

-- The vector index (19.13): approximate nearest neighbors by cosine distance.
CREATE INDEX policy_passages_embedding ON policy_passages USING hnsw (embedding vector_cosine_ops);
