-- 参加申込テーブル
CREATE TABLE IF NOT EXISTS registrations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_year  INTEGER     NOT NULL,
  student_id  VARCHAR(30) NOT NULL,
  name        TEXT        NOT NULL,
  class       VARCHAR(20) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_year, student_id)
);

-- アンケートテーブル
CREATE TABLE IF NOT EXISTS survey_responses (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_year          INTEGER     NOT NULL,
  rating              SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  found_info_useful   BOOLEAN     NOT NULL,
  would_participate   BOOLEAN     NOT NULL,
  comment             TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── RLS ──────────────────────────────────────────────
ALTER TABLE registrations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses  ENABLE ROW LEVEL SECURITY;

-- 一般ユーザー: INSERT のみ許可
CREATE POLICY "public_insert_registrations"
  ON registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "public_insert_survey_responses"
  ON survey_responses FOR INSERT
  WITH CHECK (true);

-- 管理者 (authenticated): 全操作許可
CREATE POLICY "admin_all_registrations"
  ON registrations FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_survey_responses"
  ON survey_responses FOR ALL
  USING (auth.role() = 'authenticated');

-- ── インデックス ──────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_registrations_year
  ON registrations (event_year);

CREATE INDEX IF NOT EXISTS idx_survey_responses_year
  ON survey_responses (event_year);
