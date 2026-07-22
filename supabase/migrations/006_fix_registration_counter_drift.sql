-- Fixes: registration_counts drifted upward because the counter only had
-- an AFTER INSERT trigger — deleting a row (test data, duplicates, etc.)
-- never decremented it. This adds a DELETE trigger and recomputes the
-- current value from the real row count.

-- 1) Decrement on delete, mirroring the existing increment-on-insert trigger.
CREATE OR REPLACE FUNCTION sync_registration_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE registration_counts
    SET count      = GREATEST(count - 1, 0),
        updated_at = now()
    WHERE event_year = OLD.event_year;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_registration_delete_count ON registrations;
CREATE TRIGGER on_registration_delete_count
  AFTER DELETE ON registrations
  FOR EACH ROW EXECUTE FUNCTION sync_registration_count_on_delete();

-- 2) One-time correction: recompute from the actual current rows.
INSERT INTO registration_counts (event_year, count, updated_at)
SELECT event_year, COUNT(*)::INTEGER, now()
FROM registrations
GROUP BY event_year
ON CONFLICT (event_year) DO UPDATE
  SET count      = EXCLUDED.count,
      updated_at = now();

-- 3) Cover years that had rows before but now have zero (COUNT(*) above
--    would simply omit them, leaving a stale positive count behind).
UPDATE registration_counts rc
SET count = 0, updated_at = now()
WHERE NOT EXISTS (
  SELECT 1 FROM registrations r WHERE r.event_year = rc.event_year
) AND rc.count <> 0;
