-- ==============================================================================
-- Migration 014: Them cot translations cho event_memories de admin co the
-- tu dan noi dung da dich (badge/title/summary/source_label/caption anh)
-- cho tung ngon ngu, thay vi chi co 1 ban tieng Nhat duy nhat.
-- Cau truc JSONB: { [ma_ngon_ngu]: { badge, title, summary, source_label,
--                                     photoCaptions: { [photo_url]: caption } } }
-- Cac cot tieng Nhat hien co (badge/title/summary/source_label/photos.caption)
-- van la ban "goc"/mac dinh, khong doi.
-- File: supabase/migrations/014_event_memories_translations.sql
-- ==============================================================================

ALTER TABLE public.event_memories
  ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;
