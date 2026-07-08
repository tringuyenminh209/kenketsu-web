-- registrations: add columns to match the school's official application form
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS furigana            TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS school              VARCHAR(100);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS time_slot           VARCHAR(20);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS donation_experience VARCHAR(10);
