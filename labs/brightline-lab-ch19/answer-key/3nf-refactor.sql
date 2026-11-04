-- Answer key, Lab 19 Task 3b. One correct refactor of exercise.docs_flat. Others are possible.
--
-- The transitive dependencies, as the reader should list them:
--   id -> tenant_id -> org_name           the company's name belongs in the sign-in database
--   id -> tenant_id -> tenant_email       the AP contact's email belongs to a person, in the sign-in database
--   id -> doc_file  -> doc_title          a document's title belongs to the document
--   id -> doc_file  -> doc_owner          (and doc_title -> doc_owner): the owner belongs to the document
--   id -> tenant_id -> metadata.company_name   the same name again, hidden inside jsonb
--   id -> doc_file  -> metadata.heading        the document's title again, hidden inside jsonb
--   id -> content   -> embedding          kept on purpose, with its guard
--   tenant_id is part of every key in the refactor, and the composite foreign key makes a passage's
--   company equal its document's company
BEGIN;
CREATE TABLE exercise.tenants (id text PRIMARY KEY);
CREATE TABLE exercise.documents (
  tenant_id text NOT NULL REFERENCES exercise.tenants(id),
  doc_file  text NOT NULL,
  title     text NOT NULL,
  owner     text NOT NULL,
  PRIMARY KEY (tenant_id, doc_file)
);
CREATE TABLE exercise.passages (
  tenant_id       text NOT NULL,
  doc_file        text NOT NULL,
  line            int  NOT NULL,
  content         text NOT NULL,
  content_sha256  bytea GENERATED ALWAYS AS (public.ap_utf8_sha256(content)) STORED,
  embedded_sha256 bytea NOT NULL,
  embedding       vector(1024) NOT NULL,
  PRIMARY KEY (tenant_id, doc_file, line),
  FOREIGN KEY (tenant_id, doc_file) REFERENCES exercise.documents (tenant_id, doc_file),
  CONSTRAINT embedding_matches_content CHECK (embedded_sha256 = content_sha256)
);
INSERT INTO exercise.tenants SELECT DISTINCT tenant_id FROM exercise.docs_flat;
INSERT INTO exercise.documents SELECT DISTINCT tenant_id, doc_file, doc_title, doc_owner FROM exercise.docs_flat;
INSERT INTO exercise.passages (tenant_id, doc_file, line, content, embedded_sha256, embedding)
  SELECT tenant_id, doc_file, line, content, public.ap_utf8_sha256(content), embedding FROM exercise.docs_flat;
CREATE INDEX passages_embedding ON exercise.passages USING hnsw (embedding vector_cosine_ops);
DO $$ DECLARE t text; col text; BEGIN
  FOREACH t IN ARRAY ARRAY['tenants', 'documents', 'passages'] LOOP
    col := CASE WHEN t = 'tenants' THEN 'id' ELSE 'tenant_id' END;
    EXECUTE format('ALTER TABLE exercise.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE exercise.%I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY %I ON exercise.%I FOR SELECT TO ap_reader USING (%I = current_setting(''app.tenant_id'', true))', t || '_reader', t, col);
  END LOOP;
END $$;
GRANT USAGE ON SCHEMA exercise TO ap_reader;
GRANT SELECT ON exercise.tenants, exercise.documents, exercise.passages TO ap_reader;
DROP TABLE exercise.docs_flat;
COMMIT;

-- Proof 1: no copied name or email is left anywhere in the schema (expect 0).
SELECT count(*) AS copies_left FROM information_schema.columns
 WHERE table_schema = 'exercise' AND column_name IN ('org_name', 'tenant_email', 'doc_title', 'doc_owner', 'metadata');
-- Proof 2: renaming a document changes one row (expect UPDATE 1).
UPDATE exercise.documents SET title = 'Purchasing policy' WHERE tenant_id = 'org_cedar' AND doc_file = 'purchasing.md';
-- Proof 3 is in 3nf-proof-reader.sql, run as the reader role:  psql "$DATABASE_URL_READER" -f ...
