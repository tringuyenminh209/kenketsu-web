# DESIGN.md — 献血イベントWebサイト (kenketsu-web)

## Overview

ECC社会貢献センター主催の献血ボランティアイベントの告知・参加申込・アンケート収集Webサイト。
卒業後もセンターの先生方が毎年継続して使用できるよう設計する。

ECC専門学校には日本語・ミャンマー語・ネパール語・中国語話者の留学生が多いため、**4言語対応**とする。

## 年次運用フロー（先生向け）

```
毎年の作業:
1. GitHubで src/config/event.ts を編集（日時・場所・定員を変更）
2. Commitする → Vercelが自動デプロイ（約3分）
3. イベント終了後 → /admin にログインして参加者リストをCSVエクスポート
```

サーバー管理・AWS・コマンド操作は一切不要。

## Architecture

```
User Browser
    │ HTTPS
    ▼
Cloudflare (DNS + SSL + CDN, Free)
    │
    ▼
Vercel (Static Hosting + Edge Network, Free)
  └── React SPA (Vite build, auto-deploy from GitHub main branch)
    │ Supabase JS Client (HTTPS)
    ▼
Supabase PostgreSQL (Free tier)
  ├── registrations    ← 参加申込（event_yearで年度別管理）
  └── survey_responses ← アンケート（event_yearで年度別管理）
```

**EC2をやめてVercelにした理由:**
- サーバー保守不要（OS更新・セキュリティパッチ・障害対応が不要）
- GitHubにpushするだけで自動デプロイ
- 無料枠で十分（月100GB帯域、無制限デプロイ）
- 担当学生が卒業しても先生だけで運用継続できる

## Tech Stack

| Layer | Tech | Version |
|-------|------|---------|
| Frontend | Vite + React + TypeScript | React 18 / Vite 5 |
| Styling | Tailwind CSS + shadcn/ui | Tailwind 3 |
| i18n | i18next + react-i18next | i18next 23 |
| Font | Noto Sans JP + Noto Sans Myanmar + Noto Sans Devanagari + Noto Sans SC | Google Fonts |
| Router | React Router v6 | v6 |
| DB Client | @supabase/supabase-js | v2 |
| Hosting | Vercel (Free) | — |
| DNS / CDN | Cloudflare (Free) | — |
| Database | Supabase PostgreSQL (Free) | — |

## Pages & Sections

```
/ (SPA — アンカーナビ)
├── #hero          イベント日時・場所・カウントダウン  ← event.tsから動的表示
├── #about         献血の意義
├── #info          基本情報（種類・条件・所要時間）
├── #precautions   注意事項
├── #register      参加申込フォーム ← Supabase INSERT
└── #survey        アンケート ← Supabase INSERT

/flyer             印刷用チラシ (A4, @media print)  ← event.tsから動的表示
/admin             管理画面 (Supabase Auth, 先生専用)
  ├── 参加者一覧（年度フィルター付き）
  ├── CSVエクスポート
  └── アンケート集計
```

## Event Config (毎年ここだけ変更)

```typescript
// src/config/event.ts
export const EVENT_CONFIG = {
  year: 2026,
  title: "献血ボランティア活動",
  date: "2026年9月15日（火）",
  time: "10:00 〜 16:00",
  location: "○○キャンパス ○○号館 1F ロビー",
  capacity: 50,
  organizer: "ECC社会貢献センター",
  contact: "ecc-shakai@example.ac.jp",
} as const
```

## Database

```sql
-- 参加申込（event_yearで年度別管理）
CREATE TABLE registrations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_year INTEGER     NOT NULL,   -- 年度（例: 2026）
  student_id VARCHAR(20) NOT NULL,   -- 学生番号
  name       TEXT        NOT NULL,   -- 名前
  class      VARCHAR(20) NOT NULL,   -- クラス
  created_at TIMESTAMPTZ DEFAULT now()
);

-- アンケート（event_yearで年度別管理）
CREATE TABLE survey_responses (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_year          INTEGER  NOT NULL,
  rating              INTEGER  CHECK (rating BETWEEN 1 AND 5),
  found_info_useful   BOOLEAN,
  would_participate   BOOLEAN,
  comment             TEXT,
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- 管理者ユーザー（Supabase Auth管理）
-- Supabase Dashboard → Authentication → Users → 先生のメールを招待

-- RLS
ALTER TABLE registrations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- 一般ユーザー: INSERT のみ
CREATE POLICY "public_insert" ON registrations    FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert" ON survey_responses FOR INSERT WITH CHECK (true);

-- 管理者: SELECT（認証済みユーザーのみ）
CREATE POLICY "admin_select" ON registrations
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "admin_select" ON survey_responses
  FOR SELECT USING (auth.role() = 'authenticated');
```

## Multilingual Support (i18n)

対応言語4言語:

| コード | 言語 | 対象 |
|--------|------|------|
| `ja` | 日本語 | デフォルト、日本人学生・先生 |
| `my` | မြန်မာဘာသာ (ミャンマー語) | ミャンマー人留学生 |
| `ne` | नेपाली (ネパール語) | ネパール人留学生 |
| `zh` | 中文简体 (中国語簡体) | 中国人留学生 |

**言語切替:** Navbarの言語セレクター → `localStorage` に保存 → 次回アクセス時も維持

**フォント戦略:** `lang` 属性に応じてGoogle Fontsを切替
- `ja` → Noto Sans JP
- `my` → Noto Sans Myanmar
- `ne` → Noto Sans Devanagari
- `zh` → Noto Sans SC

## Directory Structure

```
kenketsu-web/
├── src/
│   ├── config/
│   │   └── event.ts          ← ★毎年ここだけ変更
│   ├── locales/              ← ★翻訳ファイル
│   │   ├── ja.json           # 日本語（マスター）
│   │   ├── my.json           # ミャンマー語
│   │   ├── ne.json           # ネパール語
│   │   └── zh.json           # 中国語簡体
│   ├── components/
│   │   ├── ui/               # shadcn/ui
│   │   ├── Navbar.tsx        # 言語セレクター内包
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── InfoSection.tsx
│   │   ├── PrecautionsSection.tsx
│   │   ├── RegistrationForm.tsx
│   │   └── SurveyForm.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Flyer.tsx         # 印刷用チラシ
│   │   └── Admin.tsx         # 管理画面（日本語固定）
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── i18n.ts           # i18next初期化
│   │   └── utils.ts
│   └── App.tsx
├── docs/
│   └── system_design_kenketsu.html
├── public/
├── .env.local
├── DESIGN.md
├── vercel.json               # SPAルーティング設定
└── vite.config.ts
```

## Infrastructure

| Component | Service | Spec | Cost |
|-----------|---------|------|------|
| Hosting | Vercel | Free plan (100GB/月) | $0 |
| DNS / CDN | Cloudflare | Free plan | $0 |
| Database | Supabase | Free plan (500MB) | $0 |
| **合計** | | | **$0/月** |

## Deploy

```
# 初回セットアップ（一度だけ）
1. GitHubにkenketsu-webリポジトリ作成
2. Vercelにログイン → "Import Git Repository" → kenketsu-webを選択
3. Vercelが自動でビルド・デプロイ
4. CloudflareでDNS設定（Vercelの provided URLにCNAMEレコード追加）

# 毎年の更新（先生またはサポート学生が実施）
1. GitHubでsrc/config/event.tsを編集
2. Commit & Push → Vercelが自動デプロイ（3分）
```

## Environment Variables

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Vercel Dashboard → Settings → Environment Variables に設定（`.env.local`はローカル開発用）。

## Admin Access

```
URL: https://[your-domain]/admin
認証: Supabase Auth（メール＋パスワード）
管理者追加方法: Supabase Dashboard → Authentication → Users → Invite user
```

先生のメールアドレスをSupabase Dashboardに登録するだけで管理者追加可能。

## Full Design Doc

詳細設計書（A4 HTML）: `docs/system_design_kenketsu.html`
