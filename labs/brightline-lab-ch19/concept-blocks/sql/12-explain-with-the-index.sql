-- 19.14, block 12. The same search across every company, as the owner, with full-table scans switched off.
-- This is what a plan that uses the vector index looks like. The connector never runs as the owner.
-- role: owner
-- question: do we need a PO for a $400 repair?
SELECT set_config('enable_seqscan', 'off', true);

EXPLAIN (COSTS OFF)
SELECT document_id, line_start
  FROM policy_passages
 ORDER BY embedding <=> $1::vector
 LIMIT 3;
