-- Diagnostic: see what INSERT policy currently exists on survey_responses
-- (run this first, just to see the current state — not required to proceed)
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'survey_responses';

-- Fix: re-assert the public-insert policy, in case it was altered or
-- dropped outside of the migration files (drifted from 001_initial.sql).
DROP POLICY IF EXISTS "public_insert_survey_responses" ON survey_responses;

CREATE POLICY "public_insert_survey_responses"
  ON survey_responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Make sure RLS is actually enabled (insert policies do nothing if it's off,
-- but also can't cause 42501 if it's off — this is just a safety check)
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
