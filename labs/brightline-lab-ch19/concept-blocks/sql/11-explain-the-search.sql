-- 19.14, block 11. EXPLAIN shows how the database plans to run a query, without running it.
-- role: reader
-- company: org_cedar
-- question: do we need a PO for a $400 repair?
EXPLAIN (COSTS OFF)
SELECT document_id, line_start
  FROM policy_passages
 WHERE tenant_id = 'org_cedar' AND embedding_model = 'test-lexicon-v1'
 ORDER BY embedding <=> $1::vector
 LIMIT 3;
