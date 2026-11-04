-- 19.14, block 13. What one embedding costs to store, against the text it stands for.
-- role: reader
-- company: org_cedar
SELECT count(*) AS passages,
       round(avg(pg_column_size(content))) AS bytes_of_text,
       round(avg(pg_column_size(embedding))) AS bytes_of_embedding
  FROM policy_passages
 WHERE tenant_id = 'org_cedar';
