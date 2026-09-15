-- ==============================================================================
-- Migration 011: Cau hinh tu do cho form dang ky / khao sat
-- (an/hien, doi nhan hien thi, bat buoc, thu tu) — khong doi cot cua
-- bang registrations/survey_responses, khong anh huong du lieu da co.
-- File: supabase/migrations/011_form_field_settings.sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.form_field_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL CHECK (form_type IN ('registration', 'survey')),
  field_key TEXT NOT NULL,
  label_override TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_required BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (form_type, field_key)
);

ALTER TABLE public.form_field_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to form field settings"
  ON public.form_field_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated full access to form field settings"
  ON public.form_field_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed gia tri mac dinh khop voi thu tu/trang thai bat buoc dang co san
-- trong code hien tai, de bat nhac chuc nang khong lam thay doi giao dien
-- hien tai cho den khi giao vien chu dong chinh sua.
INSERT INTO public.form_field_settings (form_type, field_key, is_visible, is_required, sort_order) VALUES
  ('registration', 'name', true, true, 0),
  ('registration', 'furigana', true, true, 1),
  ('registration', 'email', true, true, 2),
  ('registration', 'studentId', true, true, 3),
  ('registration', 'phone', true, true, 4),
  ('registration', 'school', true, true, 5),
  ('registration', 'department', true, true, 6),
  ('registration', 'birthDate', true, true, 7),
  ('registration', 'timeSlot', true, true, 8),
  ('registration', 'donationExperience', true, true, 9),
  ('registration', 'gender', true, false, 10),
  ('survey', 'donationCount', true, true, 0),
  ('survey', 'impressions', true, false, 1),
  ('survey', 'reasons', true, false, 2),
  ('survey', 'knewCampus', true, false, 3),
  ('survey', 'wantParticipate', true, false, 4),
  ('survey', 'conditions', true, false, 5),
  ('survey', 'reservation', true, false, 6)
ON CONFLICT (form_type, field_key) DO NOTHING;
