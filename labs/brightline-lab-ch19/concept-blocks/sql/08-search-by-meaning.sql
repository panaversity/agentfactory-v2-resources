-- 19.14, block 8. The search from 19.13, run for real: Cedar Ridge's three nearest passages to Luis's question.
-- role: reader
-- company: org_cedar
-- question: do we need a PO for a $400 repair?
SELECT document_id, line_start,
       round((1 - (embedding <=> $1::vector))::numeric, 2) AS similarity
  FROM policy_passages
 WHERE tenant_id = 'org_cedar' AND embedding_model = 'test-lexicon-v1'
 ORDER BY embedding <=> $1::vector
 LIMIT 3;
