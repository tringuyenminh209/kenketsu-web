-- Public, read-only aggregate of registrations per time slot.
-- SECURITY DEFINER so it can read the registrations table despite RLS,
-- but it only ever returns a slot name + count — never names/emails/etc.
CREATE OR REPLACE FUNCTION get_slot_counts(p_event_year integer)
RETURNS TABLE (time_slot varchar, cnt bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT time_slot, COUNT(*) AS cnt
  FROM registrations
  WHERE event_year = p_event_year
    AND time_slot IS NOT NULL
  GROUP BY time_slot;
$$;

GRANT EXECUTE ON FUNCTION get_slot_counts(integer) TO anon;
GRANT EXECUTE ON FUNCTION get_slot_counts(integer) TO authenticated;
