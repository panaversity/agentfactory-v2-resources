-- Proof 3, as the reader role with Cedar Ridge set: only Cedar Ridge's passages, nearest first (expect 3 rows, all org_cedar).
BEGIN READ ONLY;
SELECT set_config('app.tenant_id', 'org_cedar', true);
SELECT p.tenant_id, d.title, p.line FROM exercise.passages p
  JOIN exercise.documents d USING (tenant_id, doc_file)
 ORDER BY p.embedding <=> exercise.fake_embedding('do we need a PO for a repair?') LIMIT 5;
COMMIT;
-- And with nothing set: 0 rows.
SELECT count(*) AS seen_with_nothing_set FROM exercise.passages;
