-- 19.14, block 10. Two questions that differ only in the amount. Does the search tell them apart?
-- role: reader
-- company: org_cedar
-- question: do we need a PO for a $400 repair?
-- question2: do we need a PO for a $4,000 repair?
SELECT round((1 - ($1::vector <=> $2::vector))::numeric, 2) AS similarity_of_the_two_questions;

SELECT document_id, line_start,
       round((1 - (embedding <=> $1::vector))::numeric, 2) AS for_400,
       round((1 - (embedding <=> $2::vector))::numeric, 2) AS for_4000
  FROM policy_passages
 WHERE tenant_id = 'org_cedar' AND embedding_model = 'test-lexicon-v1'
 ORDER BY embedding <=> $1::vector
 LIMIT 2;
