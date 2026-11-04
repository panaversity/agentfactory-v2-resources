-- 19.14, block 7. Cosine distance on arrows with two numbers, small enough to check by hand.
-- role: reader
-- company: org_cedar
SELECT round(('[3,4]'::vector <=> '[6,8]'::vector)::numeric, 2)   AS same_direction,
       round(('[3,4]'::vector <=> '[4,3]'::vector)::numeric, 2)   AS close,
       round(('[3,4]'::vector <=> '[4,-3]'::vector)::numeric, 2)  AS at_right_angles,
       round(('[3,4]'::vector <=> '[-3,-4]'::vector)::numeric, 2) AS opposite;
