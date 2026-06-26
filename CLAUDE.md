# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

献血イベントWebサイト (kenketsu-web) — ECC社会貢献センター主催の献血ボランティアイベントの告知・参加申込・アンケート収集サイト。毎年継続使用する想定で、先生が年次更新できるように設計されている。

## Commands

```bash
npm run dev       # 開発サーバー起動 (http://localhost:5173)
npm run build     # TypeScriptチェック + Viteビルド → dist/
npm run preview   # ビルド済みdist/をローカルでプレビュー
npm run lint      # oxlintでコードチェック
```

## Architecture

**Tech stack:** Vite 8 + React 19 + TypeScript 6 + Tailwind CSS 4 + shadcn/ui + React Router v7 + @supabase/supabase-js v2 + i18next + react-i18next

**Deploy:** Vercel (GitHub push → 自動デプロイ) + Cloudflare DNS + Supabase PostgreSQL

### Planned directory structure (src/ はまだscaffold前)

```
src/
├── config/
│   └── event.ts          ← ★毎年ここだけ変更（日時・場所・定員）
├── components/
│   ├── ui/               # shadcn/ui primitives
│   ├── Navbar.tsx
│   ├── HeroSection.tsx   # event.tsの値を表示
│   ├── AboutSection.tsx
│   ├── InfoSection.tsx
│   ├── PrecautionsSection.tsx
│   ├── RegistrationForm.tsx
│   └── SurveyForm.tsx
├── pages/
│   ├── Home.tsx          # / (SPA, アンカーナビ)
│   ├── Flyer.tsx         # /flyer (A4印刷用)
│   └── Admin.tsx         # /admin (先生専用管理画面)
├── lib/
│   ├── supabase.ts       # Supabaseクライアント初期化
│   └── utils.ts          # cn()ユーティリティ
└── App.tsx               # React Router設定
```

### Event config pattern

`src/config/event.ts` が唯一の年次変更ファイル。全コンポーネントはここからimportして使う。ハードコードしない。

### Supabase data flow

- **一般ユーザー:** フロントから直接Supabase APIを呼び出す（バックエンドサーバーなし）
- **RLS:** `registrations` と `survey_responses` はINSERTのみ公開。SELECTは `auth.role() = 'authenticated'` のみ
- **管理者:** Supabase Auth (email/password)。`/admin` は認証済みのみアクセス可、未認証は `/admin/login` にリダイレクト

### DB tables

- `registrations`: `event_year`, `student_id`, `name`, `class` — 学生の参加申込
- `survey_responses`: `event_year`, `rating`, `found_info_useful`, `would_participate`, `comment`

`event_year INTEGER` カラムで年度別にフィルタリングする。

### Routing

| Path | Component | 説明 |
|------|-----------|------|
| `/` | Home.tsx | SPA、`#hero` `#about` `#info` `#precautions` `#register` `#survey` セクション |
| `/flyer` | Flyer.tsx | 印刷専用、`@media print` CSS |
| `/admin/login` | AdminLogin | Supabase Auth |
| `/admin` | Admin.tsx | 参加者一覧・CSVエクスポート・アンケート集計 |

Vercelに `vercel.json` の `rewrites` 設定が必要 (SPA fallback)。

## i18n (多言語対応)

**ライブラリ:** `i18next` + `react-i18next`

**対応言語:** `ja`（日本語・デフォルト）/ `my`（ミャンマー語）/ `ne`（ネパール語）/ `zh`（中国語簡体）

**翻訳ファイル:** `src/locales/{ja,my,ne,zh}.json` — `ja.json` がマスター、他言語はキー構造を合わせる

**フォント:** 言語ごとにGoogle Fontsを切替（`<html lang>` 属性を `i18next.language` に同期）
- `ja` → Noto Sans JP / `my` → Noto Sans Myanmar / `ne` → Noto Sans Devanagari / `zh` → Noto Sans SC

**使用パターン:**
```tsx
const { t } = useTranslation()
// <p>{t('hero.title')}</p>
```

**言語セレクター:** Navbarに配置、選択は `localStorage` に保存

**Admin画面は日本語固定** — 管理者は先生のみのため翻訳不要

## Key constraints

- **axios禁止** — HTTP通信はfetchまたはSupabase JSクライアントのみ
- **`any`型禁止** — strict TypeScript、unknown + type guardsを使う
- **UIテキストはi18nキー経由** — ハードコード禁止、必ず `t('key')` を使う
- **コメントなし原則** — WHYが非自明な場合のみ1行コメント
- **Tailwind CSS 4** — `@tailwindcss/vite` プラグイン経由（設定ファイル不要）

## Environment variables (.env.local)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

本番環境はVercel Dashboard → Settings → Environment Variablesに設定。
