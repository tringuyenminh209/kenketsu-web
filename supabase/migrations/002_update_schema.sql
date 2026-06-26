-- registrations: add columns to match Codex form
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS email      TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS phone      VARCHAR(20);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS gender     VARCHAR(20);

-- survey_responses: replace original columns with Codex survey questions
ALTER TABLE survey_responses DROP COLUMN IF EXISTS rating;
ALTER TABLE survey_responses DROP COLUMN IF EXISTS found_info_useful;
ALTER TABLE survey_responses DROP COLUMN IF EXISTS would_participate;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS donation_count VARCHAR(10);
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS how_found      VARCHAR(20);
