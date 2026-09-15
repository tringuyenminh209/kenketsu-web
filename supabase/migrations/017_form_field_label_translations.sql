-- ==============================================================================
-- Migration 017: Cho phep dan nhan tuy chinh theo tung ngon ngu cho
-- form_field_settings (Tab "申込・アンケート項目設定"), giong co che da
-- lam cho event_memories.translations — tranh viec doi nhan chi co 1 ban
-- tieng Nhat roi hien nham cho ca 12 ngon ngu tren trang cong khai.
-- Cau truc JSONB: { [ma_ngon_ngu]: "nhan da dich" }
-- File: supabase/migrations/017_form_field_label_translations.sql
-- ==============================================================================

ALTER TABLE public.form_field_settings
  ADD COLUMN IF NOT EXISTS label_translations JSONB NOT NULL DEFAULT '{}'::jsonb;
