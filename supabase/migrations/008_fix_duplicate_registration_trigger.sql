-- Diagnostic: list every trigger currently attached to `registrations`.
-- If the count jumps by 2 per real signup, there are likely two triggers
-- both calling a count-sync function (e.g. one from a migration re-run
-- under a different name, one added manually via the Dashboard).
SELECT tgname, pg_get_triggerdef(oid) AS definition
FROM pg_trigger
WHERE tgrelid = 'registrations'::regclass
  AND NOT tgisinternal;

-- Fix: drop every trigger on `registrations` that calls a
-- registration-count-sync function, regardless of its name (covers
-- duplicates created under any name), then recreate exactly one
-- insert-trigger and one delete-trigger.
DO $$
DECLARE
  trig RECORD;
BEGIN
  FOR trig IN
    SELECT t.tgname
    FROM pg_trigger t
    JOIN pg_proc p ON p.oid = t.tgfoid
    WHERE t.tgrelid = 'registrations'::regclass
      AND NOT t.tgisinternal
      AND p.proname LIKE 'sync_registration_count%'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON registrations', trig.tgname);
  END LOOP;
END $$;

CREATE TRIGGER on_registration_insert_count
  AFTER INSERT ON registrations
  FOR EACH ROW EXECUTE FUNCTION sync_registration_count();

CREATE TRIGGER on_registration_delete_count
  AFTER DELETE ON registrations
  FOR EACH ROW EXECUTE FUNCTION sync_registration_count_on_delete();

-- Recompute the current count from real rows to correct whatever drift
-- the duplicate trigger already caused.
INSERT INTO registration_counts (event_year, count, updated_at)
SELECT event_year, COUNT(*)::INTEGER, now()
FROM registrations
GROUP BY event_year
ON CONFLICT (event_year) DO UPDATE
  SET count      = EXCLUDED.count,
      updated_at = now();
