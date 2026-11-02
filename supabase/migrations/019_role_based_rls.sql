-- ==============================================================================
-- Migration 019: RLS role-based thay vi chi check "da dang nhap"
-- Truoc day moi policy admin dung auth.role() = 'authenticated' / TO authenticated,
-- nghia la BAT KY ai tu dang ky tai khoan (neu Supabase Auth cho phep public sign-up)
-- deu co full quyen CRUD tren du lieu sinh vien, su kien, cau hinh form.
-- Migration nay them bang allowlist admin_users + ham is_admin(), roi sua tat ca
-- policy admin de check thanh vien bang nay thay vi chi check "co session".
-- File: supabase/migrations/019_role_based_rls.sql
-- ==============================================================================

-- 1. Bang allowlist admin: chi nhung user_id trong bang nay moi la admin thuc su.
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Khong ai (ke ca admin) duoc doc/sua bang nay qua API cong khai —
-- chi quan ly qua Supabase Dashboard / SQL editor (service role bo qua RLS).
DROP POLICY IF EXISTS "no public access to admin_users" ON public.admin_users;
CREATE POLICY "no public access to admin_users"
  ON public.admin_users FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- Backfill: tat ca user dang co trong auth.users HIEN TAI la admin hop le
-- (truoc migration nay ho da co full quyen roi qua auth.role() = 'authenticated',
-- nen backfill khong mo rong quyen gi them — chi chot lai danh sach dung luc nay).
INSERT INTO public.admin_users (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- 2. Ham kiem tra admin — SECURITY DEFINER de doc duoc admin_users du RLS chan truy cap truc tiep.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 3. registrations / survey_responses
DROP POLICY IF EXISTS "admin_all_registrations" ON public.registrations;
CREATE POLICY "admin_all_registrations"
  ON public.registrations FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_all_survey_responses" ON public.survey_responses;
CREATE POLICY "admin_all_survey_responses"
  ON public.survey_responses FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. official_slot_capacities
DROP POLICY IF EXISTS "admin_all_official_slot_capacities" ON public.official_slot_capacities;
CREATE POLICY "admin_all_official_slot_capacities"
  ON public.official_slot_capacities FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. events
DROP POLICY IF EXISTS "Allow authenticated full access to events" ON public.events;
CREATE POLICY "Allow authenticated full access to events"
  ON public.events FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. event_memories
DROP POLICY IF EXISTS "Allow authenticated full access to event memories" ON public.event_memories;
CREATE POLICY "Allow authenticated full access to event memories"
  ON public.event_memories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. storage.objects (bucket event-photos)
DROP POLICY IF EXISTS "Allow authenticated insert to event photos" ON storage.objects;
CREATE POLICY "Allow authenticated insert to event photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-photos' AND public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated update to event photos" ON storage.objects;
CREATE POLICY "Allow authenticated update to event photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'event-photos' AND public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated delete from event photos" ON storage.objects;
CREATE POLICY "Allow authenticated delete from event photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-photos' AND public.is_admin());

-- 8. form_field_settings
DROP POLICY IF EXISTS "Allow authenticated full access to form field settings" ON public.form_field_settings;
CREATE POLICY "Allow authenticated full access to form field settings"
  ON public.form_field_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- Sau khi deploy migration nay: moi khi tao them giao vien/admin moi,
-- phai them 1 dong vao admin_users (vi du trong SQL editor):
--   INSERT INTO public.admin_users (user_id)
--   SELECT id FROM auth.users WHERE email = 'teacher@example.com';
-- Neu khong them, tai khoan do dang nhap duoc (Supabase Auth) nhung
-- se khong doc/sua duoc du lieu nao trong /admin (RLS tu chan).
-- ==============================================================================
