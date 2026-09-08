-- ==============================================================================
-- Migration: 009_official_slot_capacities.sql
-- Purpose: Bảng lưu trữ số lượng chỗ còn lại thực tế từ Hội Chữ Thập Đỏ (kenketsu.jp)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS official_slot_capacities (
  event_year  INTEGER     NOT NULL,
  time_slot   VARCHAR(30) NOT NULL,
  remaining   INTEGER     NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (event_year, time_slot)
);

-- Bật bảo mật hàng (Row Level Security)
ALTER TABLE official_slot_capacities ENABLE ROW LEVEL SECURITY;

-- Cho phép tất cả mọi người (kể cả khách / anon) xem số chỗ còn lại
DROP POLICY IF EXISTS "public_select_official_slot_capacities" ON official_slot_capacities;
CREATE POLICY "public_select_official_slot_capacities"
  ON official_slot_capacities FOR SELECT
  USING (true);

-- Chỉ Admin (authenticated) mới có quyền thêm/sửa/xóa số chỗ
DROP POLICY IF EXISTS "admin_all_official_slot_capacities" ON official_slot_capacities;
CREATE POLICY "admin_all_official_slot_capacities"
  ON official_slot_capacities FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Chèn sẵn dữ liệu ban đầu theo ảnh thực tế mới nhất từ Chữ Thập Đỏ
INSERT INTO official_slot_capacities (event_year, time_slot, remaining, updated_at)
VALUES
  (2026, '09:45-10:00', 1, now()),
  (2026, '10:00-10:30', 0, now()),
  (2026, '10:30-11:00', 3, now()),
  (2026, '11:00-11:30', 0, now()),
  (2026, '13:00-13:30', 1, now()),
  (2026, '13:30-14:00', 3, now()),
  (2026, '14:00-14:30', 4, now()),
  (2026, '14:30-15:00', 3, now()),
  (2026, '15:00-15:30', 3, now()),
  (2026, '15:30-16:00', 4, now()),
  (2026, '16:00-16:30', 4, now())
ON CONFLICT (event_year, time_slot) DO UPDATE
  SET remaining  = EXCLUDED.remaining,
      updated_at = now();
