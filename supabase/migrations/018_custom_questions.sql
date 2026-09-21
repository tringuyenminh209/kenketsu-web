-- ==============================================================================
-- Migration 018: Cau hoi tu them (custom questions) cho form dang ky / khao sat.
-- - form_field_settings: them is_custom / question_type / options
--   (nhan cau hoi: label_override = tieng Nhat, label_translations = cac ngon ngu khac,
--    da co san tu migration 011/017)
--   options: [{ "value": "<tieng Nhat>", "translations": { "en": "...", ... } }]
-- - registrations / survey_responses: custom_answers luu cau tra loi
--   { "<field_key>": { "q": "<nhan tieng Nhat luc tra loi>", "a": "<cau tra loi tieng Nhat>" } }
-- File: supabase/migrations/018_custom_questions.sql
-- ==============================================================================

ALTER TABLE public.form_field_settings
  ADD COLUMN IF NOT EXISTS is_custom BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS question_type TEXT NOT NULL DEFAULT 'text'
    CHECK (question_type IN ('text', 'textarea', 'select', 'checkbox')),
  ADD COLUMN IF NOT EXISTS options JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS custom_answers JSONB;

ALTER TABLE public.survey_responses
  ADD COLUMN IF NOT EXISTS custom_answers JSONB;
