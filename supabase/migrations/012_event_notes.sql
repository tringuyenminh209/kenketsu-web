-- ==============================================================================
-- Migration 012: Them cot reservation_note va gift_note vao bang events
-- de giao vien co the tu sua noi dung "ご予約について" va "プレゼント"
-- tren trang chu tu Admin (truoc day 2 muc nay bi "dong cung" trong code).
-- File: supabase/migrations/012_event_notes.sql
-- ==============================================================================

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS reservation_note TEXT NOT NULL
    DEFAULT 'ご予約をいただくと献血にかかる手続きの時間が短くなります',
  ADD COLUMN IF NOT EXISTS gift_note TEXT NOT NULL
    DEFAULT '献血にご協力いただいた方に、ライオンズクラブ様よりささやかなプレゼントをご用意しています';
