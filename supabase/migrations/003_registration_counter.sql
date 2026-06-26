-- Run this in Supabase Dashboard → SQL Editor
-- Creates a public counter table that powers the realtime tree on the homepage

CREATE TABLE IF NOT EXISTS registration_counts (
  event_year INTEGER PRIMARY KEY,
  count      INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE registration_counts ENABLE ROW LEVEL SECURITY;

-- Public read (no personal data — only event_year + count)
CREATE POLICY "public_select_count" ON registration_counts
  FOR SELECT TO anon, authenticated
  USING (true);

-- Trigger function: increment count on each new registration
CREATE OR REPLACE FUNCTION sync_registration_count()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO registration_counts (event_year, count, updated_at)
  VALUES (NEW.event_year, 1, now())
  ON CONFLICT (event_year) DO UPDATE
    SET count      = registration_counts.count + 1,
        updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_registration_insert_count ON registrations;
CREATE TRIGGER on_registration_insert_count
  AFTER INSERT ON registrations
  FOR EACH ROW EXECUTE FUNCTION sync_registration_count();

-- Seed from existing registrations
INSERT INTO registration_counts (event_year, count, updated_at)
SELECT event_year, COUNT(*)::INTEGER, now()
FROM registrations
GROUP BY event_year
ON CONFLICT (event_year) DO UPDATE
  SET count      = EXCLUDED.count,
      updated_at = now();
