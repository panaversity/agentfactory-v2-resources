-- 19.14, block 14. Hybrid search: search by meaning and search by words, merged by reciprocal rank fusion.
-- role: reader
-- company: org_cedar
-- question: do we need a PO for a $400 repair?
SELECT document_id, line_start
  FROM policy_passages
 WHERE tenant_id = 'org_cedar' AND embedding_model = 'test-lexicon-v1'
 ORDER BY embedding <=> $1::vector
 LIMIT 3;

SELECT document_id, line_start
  FROM policy_passages
 WHERE tenant_id = 'org_cedar'
   AND to_tsvector('english', content) @@ to_tsquery('english', 'po | repair');

WITH meaning AS (
  SELECT document_id, line_start,
         row_number() OVER (ORDER BY embedding <=> $1::vector) AS place
    FROM policy_passages
   WHERE tenant_id = 'org_cedar' AND embedding_model = 'test-lexicon-v1'
   ORDER BY embedding <=> $1::vector
   LIMIT 5
), words AS (
  SELECT document_id, line_start,
         row_number() OVER (ORDER BY ts_rank(to_tsvector('english', content), to_tsquery('english', 'po | repair')) DESC) AS place
    FROM policy_passages
   WHERE tenant_id = 'org_cedar'
     AND to_tsvector('english', content) @@ to_tsquery('english', 'po | repair')
   LIMIT 5
)
SELECT document_id, line_start, round(sum(1.0 / (60 + place)), 4) AS fused_score
  FROM (SELECT * FROM meaning UNION ALL SELECT * FROM words) both_lists
 GROUP BY document_id, line_start
 ORDER BY fused_score DESC
 LIMIT 3;
