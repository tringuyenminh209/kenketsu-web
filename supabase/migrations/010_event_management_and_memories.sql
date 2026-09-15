-- ==============================================================================
-- Migration 010: Hệ thống quản lý đa sự kiện, đợt mới và kỷ niệm các năm
-- File: supabase/migrations/010_event_management_and_memories.sql
-- ==============================================================================

-- 1. Bảng events: Quản lý thông tin từng đợt sự kiện qua các năm
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '献血ボランティア活動',
  date_display TEXT NOT NULL DEFAULT '2026年9月15日（火）',
  time_display TEXT NOT NULL DEFAULT '9:30〜11:30 / 12:30〜16:30',
  location TEXT NOT NULL DEFAULT 'ECCコンピュータ専門学校',
  location_detail TEXT NOT NULL DEFAULT '1号館 1階ラウンジ',
  capacity INTEGER NOT NULL DEFAULT 50,
  slot_capacity INTEGER NOT NULL DEFAULT 8,
  sponsor TEXT NOT NULL DEFAULT '大阪曾根崎ライオンズクラブ / 大阪西ライオンズクラブ',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bật RLS cho bảng events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Mọi người (cả khách vãng lai và sinh viên) đều có thể xem danh sách sự kiện
CREATE POLICY "Allow public read access to events"
  ON public.events FOR SELECT
  USING (true);

-- Chỉ admin đã đăng nhập (authenticated) mới được thêm/sửa/xóa sự kiện
CREATE POLICY "Allow authenticated full access to events"
  ON public.events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- 2. Bảng event_memories: Quản lý hình ảnh và kỷ niệm qua các năm (昨年の記録)
CREATE TABLE IF NOT EXISTS public.event_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_year INTEGER NOT NULL UNIQUE,
  badge TEXT NOT NULL DEFAULT '昨年の記録',
  title TEXT NOT NULL DEFAULT '学内献血の様子',
  summary TEXT NOT NULL DEFAULT '',
  photos JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array [{ url: string, caption: string }]
  source_label TEXT DEFAULT 'ECC社会貢献センター 活動報告',
  source_link TEXT DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bật RLS cho bảng event_memories
ALTER TABLE public.event_memories ENABLE ROW LEVEL SECURITY;

-- Cho phép mọi người đọc các kỷ niệm đã xuất bản
CREATE POLICY "Allow public read published event memories"
  ON public.event_memories FOR SELECT
  USING (is_published = true);

-- Chỉ admin có quyền toàn quyền quản lý kỷ niệm
CREATE POLICY "Allow authenticated full access to event memories"
  ON public.event_memories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- 3. Tạo Storage Bucket: event-photos để lưu ảnh upload
-- (Nếu bucket chưa tồn tại)
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-photos', 'event-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Cho phép mọi người xem ảnh công khai từ bucket event-photos
CREATE POLICY "Allow public read access to event photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-photos');

-- Chỉ admin được upload, sửa, xóa ảnh trong bucket event-photos
CREATE POLICY "Allow authenticated insert to event photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-photos');

CREATE POLICY "Allow authenticated update to event photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'event-photos');

CREATE POLICY "Allow authenticated delete from event photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-photos');


-- 4. Seed dữ liệu ban đầu cho các năm:
-- Sự kiện 2026 (Đang hoạt động - Active)
INSERT INTO public.events (year, title, date_display, time_display, location, location_detail, capacity, slot_capacity, sponsor, is_active)
VALUES (
  2026,
  '献血ボランティア活動',
  '2026年9月15日（火）',
  '9:30〜11:30 / 12:30〜16:30',
  'ECCコンピュータ専門学校',
  '1号館 1階ラウンジ',
  50,
  8,
  '大阪曾根崎ライオンズクラブ / 大阪西ライオンズクラブ',
  true
)
ON CONFLICT (year) DO UPDATE SET is_active = true;

-- Kỷ niệm năm 2025 ban đầu (Kế thừa nội dung hiện tại)
INSERT INTO public.event_memories (event_year, badge, title, summary, photos, source_label, source_link, is_published)
VALUES (
  2025,
  '昨年の記録',
  '2025年の学内献血は、こんな様子でした。',
  '2025年9月24日、ECCコンピュータ専門学校1号館ラウンジを会場に開催。学生・教職員が献血に協力し、学生ボランティアも大活躍しました。',
  '[
    {"url": "/assets/last-year/lastyear-101.webp", "caption": "会場となった1号館1階ラウンジの様子。"},
    {"url": "/assets/last-year/lastyear-102.webp", "caption": "献血バスは1号館のお隣、4号館前に停車。"},
    {"url": "/assets/last-year/lastyear-201.webp", "caption": "献血バスでは同時に3名の採血。車内ではラジオが流れ、ゆったりした雰囲気。"},
    {"url": "/assets/last-year/lastyear-202.webp", "caption": "採血中は注意事項を読んだり、看護師から血の巡りを良くするアドバイスを受けたり。"},
    {"url": "/assets/last-year/lastyear-203.webp", "caption": "事前予約の受付・会場誘導は学生ボランティアが担当。"},
    {"url": "/assets/last-year/lastyear-204.webp", "caption": "ライオンズクラブの方々と学生ボランティアが献血の呼びかけを行いました。"}
  ]'::jsonb,
  'ECC社会貢献センター 活動報告',
  'https://npo.ecc.ac.jp/activities/index.php?c=topics_view&pk=1760425294&cn=7',
  true
)
ON CONFLICT (event_year) DO NOTHING;
