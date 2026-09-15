-- ==============================================================================
-- Migration 013: Cho phep admin chu dong ep hien banner "dang chuan bi"
-- ngay ca khi van con 1 su kien active (vd: su kien cu da qua nhung
-- chua kich hoat nam moi, hoac thong tin chua chinh thuc xac nhan).
-- File: supabase/migrations/013_event_pending_notice.sql
-- ==============================================================================

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS show_pending_notice BOOLEAN NOT NULL DEFAULT false;
