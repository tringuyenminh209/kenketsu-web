# kenketsu-web — 献血ボランティアイベントサイト

ECC社会貢献センター主催の献血ボランティアイベント告知・参加申込・アンケート収集サイト。

## 概要

- 毎年9月に開催される献血ボランティアイベントの告知ページ
- 学生が学生番号・名前・クラスで参加申込できる
- 参加後アンケートの収集
- 先生用の管理画面（参加者一覧・CSVエクスポート）
- 日本語・ミャンマー語・ネパール語・中国語（簡体）対応

## Tech Stack

| 項目 | 技術 |
|------|------|
| Frontend | Vite 8 + React 19 + TypeScript 6 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| DB / Auth | Supabase (PostgreSQL + RLS) |
| i18n | i18next + react-i18next |
| Hosting | Vercel (GitHub push → 自動デプロイ) |
| DNS / CDN | Cloudflare |

バックエンドサーバーなし — フロントから Supabase JS SDK で直接 DB に接続。

## セットアップ

### 1. 依存関係インストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` をプロジェクトルートに作成:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
```

Supabase Dashboard → Settings → API から取得。

### 3. データベースのセットアップ

Supabase Dashboard → SQL Editor で `supabase/migrations/001_initial.sql` を実行。

### 4. 開発サーバー起動

```bash
npm run dev
```

→ http://localhost:5173

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # TypeScriptチェック + ビルド → dist/
npm run preview  # ビルド済みをローカルプレビュー
npm run lint     # oxlintでコードチェック
```

## ディレクトリ構成

```
src/
├── config/
│   └── event.ts          ← ★毎年ここだけ変更（日時・場所・定員）
├── components/
│   ├── ui/               # shadcn/ui primitives
│   └── ...               # 各セクションコンポーネント
├── pages/
│   ├── Home.tsx          # / (SPA)
│   ├── Flyer.tsx         # /flyer (A4印刷用)
│   └── Admin.tsx         # /admin (管理画面)
├── lib/
│   ├── supabase.ts       # Supabaseクライアント + DB操作ヘルパー
│   ├── i18n.ts           # i18next設定
│   └── utils.ts          # cn() / downloadCSV()
├── locales/
│   ├── ja.json           # 日本語（マスター）
│   ├── my.json           # ミャンマー語
│   ├── ne.json           # ネパール語
│   └── zh.json           # 中国語（簡体）
└── types/
    └── index.ts          # TypeScript型定義
```

## 毎年の更新手順（先生向け）

`src/config/event.ts` の以下の値を変更するだけ:

```typescript
export const EVENT_CONFIG = {
  year: 2027,                    // ← 年度
  date: "2027年9月15日（火）",    // ← 開催日
  time: "10:00 〜 16:00",
  location: "山口学園 ECC専門学校",
  locationDetail: "1号館 1Fロビー",
  capacity: 50,                  // ← 定員
  ...
}
```

変更後、GitHub にプッシュすれば Vercel が自動デプロイ。

## ルーティング

| パス | 説明 |
|------|------|
| `/` | メインページ（イベント情報・申込・アンケート） |
| `/flyer` | A4印刷用チラシ |
| `/admin/login` | 管理者ログイン |
| `/admin` | 参加者一覧・CSV出力・アンケート集計 |

## データベース

| テーブル | 内容 |
|---------|------|
| `registrations` | 参加申込（event_year, student_id, name, class） |
| `survey_responses` | アンケート回答（rating, found_info_useful, would_participate, comment） |

RLS設定: 一般ユーザーはINSERTのみ / 管理者（認証済み）は全操作可。
