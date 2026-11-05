-- Exercise (Lab 19, Task 3b): a table built in a hurry. Run as the owner role on dev only:
--   psql "$DATABASE_URL_OWNER" -f exercises/3nf/docs_flat.sql     (Claude Code runs it, never you)
-- Everything lives in the schema "exercise", which Task 3b drops at the end.
DROP SCHEMA IF EXISTS exercise CASCADE;
CREATE SCHEMA exercise;

CREATE TABLE exercise.docs_flat (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    text NOT NULL,
  org_name     text NOT NULL,      -- the company's name
  tenant_email text NOT NULL,      -- the company's AP contact's email
  doc_file     text NOT NULL,      -- which policy file the passage came from
  doc_title    text NOT NULL,      -- that file's title
  doc_owner    text NOT NULL,      -- who owns that policy
  line         int  NOT NULL,
  content      text NOT NULL,
  embedding    vector(1024) NOT NULL,
  metadata     jsonb NOT NULL DEFAULT '{}'
);

-- A stand-in embedding: the same 1,024 numbers for the same text (the exercise is about the layout, not the model).
CREATE FUNCTION exercise.fake_embedding(t text) RETURNS vector LANGUAGE sql IMMUTABLE AS $$
  SELECT array_agg(sin(g * (length(t) + ascii(substr(t, (g % length(t)) + 1, 1)))))::vector(1024)
    FROM generate_series(1, 1024) AS g
$$;

INSERT INTO exercise.docs_flat (tenant_id, org_name, tenant_email, doc_file, doc_title, doc_owner, line, content, embedding, metadata)
SELECT tenant_id, org_name, tenant_email, doc_file, doc_title, doc_owner, line, content, exercise.fake_embedding(content),
       jsonb_build_object('company_name', org_name, 'heading', doc_title)
  FROM (VALUES
    ('org_cedar', 'Cedar Ridge Supply', 'luis@cedarridge.example', 'purchasing.md', 'Purchasing', 'Luis Moreno', 5,
     'A purchase order is required for any purchase above $500.00.'),
    ('org_cedar', 'Cedar Ridge Supply', 'luis@cedarridge.example', 'purchasing.md', 'Purchasing', 'Luis Moreno', 6,
     'Purchases of $500.00 or less, such as a small truck repair, may be paid without a purchase order.'),
    ('org_cedar', 'Cedar Ridge Supply', 'luis@cedarridge.example', 'approvals.md', 'Invoice approvals', 'Luis Moreno', 5,
     'An invoice of $2,500.00 or more needs the general manager''s approval before payment.'),
    ('org_brightline', 'Brightline', 'ana@brightline.example', 'po-matching.md', 'Purchase order matching', 'Ana Morales', 5,
     'Every invoice must match a purchase order (PO) before it is paid.'),
    ('org_brightline', 'Brightline', 'ana@brightline.example', 'ap-triage-rules.md', 'AP triage rules', 'Ana Morales', 8,
     '4. An invoice of $10,000.00 or more needs the controller''s approval before payment.')
  ) AS rows (tenant_id, org_name, tenant_email, doc_file, doc_title, doc_owner, line, content);
