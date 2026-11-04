-- 19.14, block 9. Search by words: Postgres's full-text search finds exact words, and misses meaning.
-- role: reader
-- company: org_cedar
SELECT document_id, line_start
  FROM policy_passages
 WHERE tenant_id = 'org_cedar'
   AND to_tsvector('english', content) @@ plainto_tsquery('english', 'PO');

SELECT document_id, line_start
  FROM policy_passages
 WHERE tenant_id = 'org_cedar'
   AND to_tsvector('english', content) @@ plainto_tsquery('english', 'blanket');
