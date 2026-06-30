# Skill: System Design Master Framework
システム設計完全マスター (Enterprise + Academia Edition)

SDLC全フェーズの設計書・仕様書を自動生成し、エンタープライズ品質のシステム設計を行う統合フレームワーク。
授業課題・実プロジェクト・大規模エンタープライズ、すべてのスケールに対応。

---

## § 0. CORE THINKING — 設計前に必ず答えること

設計を始める前に以下の問いに答えを出すこと。これが全ドキュメントの基盤となる。

```
WHY?        なぜこのシステムが必要か？
WHOM?       ステークホルダーは誰か？誰が意思決定するか？
WHO?        誰が直接使うか？ユーザーロールは？
WHAT?       システムは何をしなければならないか？
WHERE?      データはどこに保存されるか？インフラは？
WHEN?       いつリリースするか？マイルストーンは？
HOW?        システムはどのように動くか？アーキテクチャは？
HOW MUCH?   開発・運用コストはいくらか？
WHAT IF?    障害時は？スケールアップ時は？データ消失時は？
```

---

## § 1. MODE DETECTION — 最初に判定すること

ユーザーが「授業」「課題」「先生」「学校」と言及した場合 → **授業モード**
それ以外（実プロジェクト、企業案件）→ **ビジネスモード**（デフォルト）

### 授業モード
- ヘッダー: `26IDS0-022-P[課題番号]　森彰子 先生 様 + 日付`
- 氏名: `SK3A　NGUYEN MINH TRI`
- 保存先: `C:\Users\2240788\OneDrive - yamaguchigakuen\デスクトップ\３年\システム設計\[第X回]\`

### ビジネスモード
- ヘッダー: `[ドキュメント種別] / [プロジェクト名] + 日付`
- 氏名: `NGUYEN MINH TRI`
- 学校・先生・課題番号の記載は一切しない
- 保存先: ユーザーが指定した場所、またはプロジェクトフォルダ内

---

## § 2. PROJECT CLASSIFICATION — プロジェクト分類

### Project Type
```
Web System / Mobile App / API Service / Microservice
AI System / IoT System / Batch System / Desktop Application
```

### Project Size
```
Small    — 1~3人、1~3ヶ月、シンプルCRUD
Medium   — 3~10人、3~6ヶ月、複数モジュール
Large    — 10~20人、6~12ヶ月、複数システム連携
Enterprise — 20人+、1年+、ミッションクリティカル
```

### Team Size
```
1 Person / 2~5 People / 5~20 People / 20+ People
```

### SDLC Model Selection

| モデル | 進め方 | メリット | デメリット | 適合プロジェクト |
|--------|--------|----------|------------|------------------|
| ウォーターフォール | 上流→下流・各フェーズ承認必須 | 納期明確・管理容易 | 変更困難・手戻りコスト高 | 仕様確定の業務系・官公庁・授業課題 |
| アジャイル（Sprint） | 計画→実装→テスト→リリースを反復 | 変更容易・継続リリース | 全体完成時期が見えにくい | SaaS・B2C・仕様変動が大きいプロダクト |
| プロトタイプ | プロトで承認後に本開発 | 早期フィードバック・手戻り軽減 | 工数二重化 | UI重視・新規事業 |
| スパイラル | ウォーターフォール + プロトタイプ反復 | 大規模リスク軽減 | 管理複雑 | 大規模・リスク高 |

**デフォルト**: B2B SaaS / 実プロジェクト → アジャイル（Sprint 2週単位）／ 授業課題・業務系 → ウォーターフォール

---

## § 3. STAKEHOLDER ANALYSIS

各ステークホルダーに対して定義すること:

| Stakeholder | Responsibility | Expectation | Risk | Communication Method |
|-------------|---------------|-------------|------|---------------------|
| Sponsor | 予算・方針決定 | 経営効果 | スコープ変更 | Weekly Report |
| Project Manager | 進捗管理 | 期限通り納品 | Schedule delay | Daily/Weekly Meeting |
| Business User | 業務要件確認 | 使いやすさ | 要件の抜け | Interview / UAT |
| System User | 実際に操作 | 直感的UI | UX問題 | UX Testing |
| Operation Team | 本番運用 | 少ない障害 | Incident対応力不足 | Runbook / Alert |
| Customer | サービス利用 | 安定・快適 | データ漏洩 | サポート窓口 |

---

## § 4. SYSTEM CHARACTERISTICS

| Characteristic | Meaning |
|---------------|---------|
| Mission Critical | システム停止が事業の根幹に影響 |
| Business Critical | 停止が売上・重要業務に影響 |
| Internal System | 社内利用のみ |
| External Service | 顧客・パートナー向け公開サービス |
| 24/7 System | 常時稼働必須 |
| High Availability | Single point of failure を排除必要 |
| Large Scale | 多ユーザー・大容量データ・高トラフィック |
| Regulation Required | 法的要件・セキュリティ監査あり |

---

## § 5. DOCUMENT SET BY PROJECT SIZE

### Small Project
```
企画書 / 要件定義書 / 画面設計 / ER図 / API設計 / リリース手順書
```

### Medium Project
```
開発計画書 / 企画書 / 要件定義書 / ユースケース / 業務フロー
画面設計 / ER図 / テーブル定義 / API設計 / 基本設計書
アーキテクチャ設計 / 詳細設計書 / 試験仕様書 / リリース手順書 / 運用保守手順書
```

### Large / Enterprise Project
```
Full Documentation Set (下記28文書) + ADR + 移行設計 + 性能試験 + セキュリティ試験 + 復旧試験
```

---

## § 6. STANDARD DOCUMENT STRUCTURE

```
docs/
├── 00_開発計画書
├── 01_企画書
├── 02_要件定義書
├── 03_ユースケース
├── 04_業務フロー
├── 05_画面遷移図
├── 06_画面設計
├── 07_機能一覧
├── 08_ER図
├── 09_テーブル定義
├── 10_API設計
├── 11_基本設計書
├── 12_アーキテクチャ設計
├── 13_詳細設計書
├── 14_データフロー設計
├── 15_インフラ設計
├── 16_セキュリティ設計
├── 17_ログ設計
├── 18_監視設計
├── 19_バッチ設計（必要な場合のみ）
├── 20_移行設計
├── 21_単体試験仕様書
├── 22_結合試験仕様書
├── 23_システム試験仕様書
├── 24_性能試験仕様書
├── 25_UAT
├── 26_リリース手順書
├── 27_運用保守手順書
└── adr/
    ├── ADR-001_Why_[Framework].md
    ├── ADR-002_Why_[DB].md
    └── ADR-003_Why_[Cloud].md
```

---

## § 7. DOCUMENT GENERATION RULES

### 共通 HTML デザイン原則（全ドキュメント共通）

```
背景: 白 / 文字: 黒 / カラーなし（印刷対応）
セクションヘッダー: ■ タイトル、左border黒 3px、背景 #f0f0f0
フォント: Yu Gothic / Meiryo / Hiragino
表: border-collapse: collapse、ヘッダー背景 #e8e8e8
印刷対応: -webkit-print-color-adjust: exact; print-color-adjust: exact;
サイズ: A4（210mm × 297mm）、横向き可（297mm × 210mm）
フッター: position:fixed; bottom:6mm → DOC-ID: [種別略語]-[プロジェクト略語]-001 + ページ番号
```

### ドキュメントヘッダー（Excel template 形式）

```
┌──────────┬──────────┬─────────────────┬──────────┬──────────┬────────────┬──────────┬────────┐
│[種別]    │システム名│  システム名      │ 文書番号 │最終更新日│ YYYY/MM/DD │バージョン│  1.0   │
│(rowspan) │(rowspan) │  (rowspan)       ├──────────┼──────────┼────────────┼──────────┼────────┤
│          │          │                  │   XXX01  │  更新者  │   氏名     │所属チーム│ ID     │
└──────────┴──────────┴─────────────────┴──────────┴──────────┴────────────┴──────────┴────────┘
```

---

## § 8. INDIVIDUAL DOCUMENT SPECIFICATIONS

### 00. 開発計画書 — HOW will we proceed?
- Schedule / Member / Technology / Development Method / Risk / Cost / Deliverables

### 01. 企画書 — WHY are we building this?
- Background / Problem / Goal / KPI / Scope / Expected Effect

### 02. 要件定義書 — WHAT must the system do?

**3つのコア問い（必ず答える）:**

| # | 問い | 内容 |
|---|------|------|
| 1 | 現状把握 | 誰が、何に困っているか？ |
| 2 | ゴール設定 | 何を達成したいか？期限は？（定量＋定性） |
| 3 | ギャップ分析 | 現状→ゴールに、何が必要か？ |

**セクション構成:**
システム概要 → 現状と課題 → ゴール → システム化の範囲（IN/OUT） → 基本要件（MoSCoW）→ 機能要件（3階層機能一覧表）→ 非機能要件 → 概略費用 → 期待される効果 → 概略スケジュール → 体制図

**機能一覧表（必須）:**
```
項番   | 機能名（大） | 機能名（中） | 機能名（小） | 機能概要 | 優先度
1.1.1  |              |              | 商品一覧表示 | ...      | 高
```

**非機能要件分類:**
```
Performance  — Response Time / TPS / Concurrent Users
Availability — Uptime / SLA / RTO / RPO
Scalability  — Horizontal / Vertical
Security     — Authentication / Authorization / Encryption / Audit
Maintainability — Logging / Monitoring / CI/CD
Usability    — Accessibility / Multi Language / Mobile Support
```

### 03. ユースケース — WHO does WHAT?
- Actor / Use Case Diagram / Use Case Specification

### 04. 業務フロー（スイムレーン形式）— HOW does the business operate?

**AS-IS（現状）→ TO-BE（改善後）の両方を作成**

**標準記号:**
```
○ = 開始  ● = 終了  □ = 処理  ◇ = 判断  → = 流れ  ▽ = DB保存
```

**HTMLレイアウト:**
- 横軸: アクターごとの列（スイムレーン）
- 縦軸: 時系列（上から下）
- 判断ボックスに Yes / No を必ず明記
- システム処理 vs 人手処理を明確に区別

### 05. 画面遷移図 — How do users navigate?
- Screen List / Screen Transition / Role Based Navigation / 条件付き遷移

### 06. 画面設計（WF）— What does each screen look like?

**UI方式の選択:**
```
OOUI（オブジェクト指向UI）: 対象物を選んでから操作 → EC・SNS・管理画面
TOUI（タスク指向UI）: やりたいことを選んでから実行 → ATM・申請フォーム
```

**生成物（2ファイル）:**
- A. 画面遷移図: 画面ボックス＋遷移矢印＋条件
- B. 画面レイアウト（WF）: グレーボックスで要素配置、デバイス幅明記

**各画面の仕様:** Screen ID / Input / Output / Validation / Action / Error Message

### 07. 機能一覧 — Complete function list
Function ID / Function Name / Actor / Priority / Related Requirement ID

### 08. ER図 — Logical data design

**成果物: `.drawio` ファイル**

**drawio ER図 作成仕様:**
```
形式: swimlane shape でテーブルを表現
テーブルヘッダー色: fillColor=#1a3a5c; fontColor=#ffffff
PK行背景: fillColor=#fff9c4（淡黄）
FK行背景: fillColor=#d1ecf1（淡青）
カラム表記: [PK] column_name : TYPE / [FK] column_name : TYPE
リレーション: startArrow=ERone; endArrow=ERmany; strokeColor=#1a3a5c; strokeWidth=2
カーディナリティ: "1" / "N" ラベルを端点近くに配置
テーブル名横に「マスタ」or「トラン」の凡例を付ける
```

### 09. テーブル定義 — Physical data design

**カラム定義表（必須カラム構成）:**

| 項番 | 列名（論理） | 列名（物理） | 属性 | データ型 | 桁数 | PK | NN | UI | IN | Default | 参照テーブル名 | 参照列名 | 備考 |
|------|------------|------------|------|----------|------|----|----|----|----|---------|--------------|---------|------|

**属性凡例:** 数値 / 文字 / 日時 / 日付 / 真偽

**記号:**
- PK ● 色:#b8860b / NN ● 色:#1a3a5c / UI ● 色:#2e7d32 / IN ● 色:#7b1fa2

**行背景色:**
- PK行: `background: #fff9c4` / FK行: `background: #d1ecf1` / 通常行: 白

**命名規則:**
```
テーブル名: snake_case・複数形（例: order_items）
主キー: id（UUID or BIGSERIAL）
外部キー: [参照先単数形]_id（例: user_id）
タイムスタンプ: created_at, updated_at（TIMESTAMPTZ）
フラグ: is_ prefix（例: is_active）
ソフト削除: deleted_at（nullable timestamp）
```

**リレーション一覧表（ページ末尾）:**
```
No | 親テーブル（論理） | 子テーブル（論理） | 多重度 | 結合キー | 説明
```

### 10. API設計 — Interface design
Endpoint / Request / Response / Error / Status Code / Authentication

**レスポンスエンベロープ:**
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "code": "E001", "message": "..." } }
```

### 11. 基本設計書（外部設計 = WHAT）

**セクション構成（p.1〜p.8+）:**
業務フロー / 画面一覧（画面ID・名称・URL・役割）/ 画面遷移図 / 画面レイアウト（主要画面）/ 機能一覧表（詳細化）/ 画面×DB処理マッピング / データ設計（テーブル一覧・テーブル定義書・ER図）/ コード一覧（enum値）/ 外部インターフェース一覧 / ネットワーク構成図（最低5層）/ ファイル一覧 / 帳票レイアウト（必要な場合）

### 12. アーキテクチャ設計 — Structure and major technical decisions

- System Architecture Diagram
- Layer Architecture（Presentation / Application / Domain / Infrastructure）
- パターン選択と理由（DDD / Clean Architecture / Hexagonal / Microservice）
- Module Dependency Map
- Technology Stack Decision（必ずADRと連携）

> **Note:** DDD、Microservice、Hexagonal Architectureが不要な場合は、その理由をADRに明記すること。

### 13. 詳細設計書（内部設計 = HOW）

**セクション構成（7ページ標準）:**
本書の位置づけ・前提 / モノレポ構成（ディレクトリツリー）/ パッケージ責務・主要モジュール一覧 / バックエンド クラス図（Handler/Service/Repository層）/ フロントエンド コンポーネント構成 / インフラ設定（Dockerfile / CI/CD）/ ユースケース図＋アクター定義

**クラスボックス形式:**
```
┌──────────────────┐
│ ClassName        │  ← 背景黒・文字白
├──────────────────┤
│ - field: Type    │
├──────────────────┤
│ + method(): Ret  │
└──────────────────┘
```

### 14. データフロー設計 — How does data move through the system?
Request Flow / Data Flow Diagram / Event Flow / Integration Flow

### 15. インフラ設計
Environment（dev/staging/prod）/ Network / Cloud Architecture / Server / Storage / Backup / Disaster Recovery

### 16. セキュリティ設計
Authentication / Authorization / Encryption / Security Checklist（OWASP Top 10）/ Audit Logging / Vulnerability Management

### 17. ログ設計
Application Log / Access Log / Error Log / Audit Log / Retention Policy

### 18. 監視設計
CPU / Memory / Disk / DB / API / Alert Threshold / Dashboard

### 19. バッチ設計（バッチ処理がある場合のみ）
Schedule / Retry Policy / Error Handling / Dependency

### 20. 移行設計
Master Data Migration / Transaction Migration / Rollback Plan

### 21〜24. 試験仕様書

**3段階構造:**
```
単体テスト → 結合テスト → システムテスト → 性能テスト
```

**単体テスト（21）:** UI要素別・正常系/異常系マトリクス・境界値（最小未満/最小/正常/最大/最大超）

**結合テスト（22）:** UI↔API / API↔DB / 外部サービス連携

**システムテスト（23）:** Login→操作→Logout の完全フロー・ロール別・障害回復テスト

**性能テスト（24）:** Performance / Load / Stress Test・Response Time・同時接続数・ボトルネック分析

**障害一覧表（共通）:**
```
No | 発見者 | 発見日 | 内容 | 重要度 | 対応者 | 対応状況 | 修正日
```

### 25. UAT
Business Scenario / Acceptance Criteria / Sign-Off

### 26. リリース手順書
Pre Release Checklist / Deploy Steps / Smoke Test / Rollback Procedure

### 27. 運用保守手順書
Monitoring / Incident Management / Change Management / Backup / Maintenance Window

---

## § 9. シーケンス図（詳細設計）

**横軸:** ライフライン（Actor / Frontend / Backend / DB / 外部API）
**縦軸:** 時間（上から下）

**必須要件:**
- 正常系 + 異常系の **2シナリオ** を必ず生成
- `alt`（条件分岐）・`par`（並列）・`loop`（反復）を使用
- DB操作・認証・外部API呼び出しは明示

---

## § 10. WBS + ガントチャート

**3階層構造（必須）:**
```
Lv1（ゴール）→ Lv2（大タスク）→ Lv3（具体作業、1〜5人日）
```

**WBSテーブル:**
```
ID | タスク名（大・中・小） | 担当者 | 予定工数 | 開始日 | 終了日 | 依存 | 状態
```

**ガントチャート（HTML）:**
- `background:#333` の divバーで表現
- Critical Path のバーは **太字・二重線** で区別
- 右下に総工数・総期間・担当者別負荷を集計

**工数単位:** 人日（8時間）/ 人月（20人日）/ 人時

---

## § 11. ADR（Architecture Decision Record）

技術的決定がなぜ行われたかを記録する。

**保存先:** `docs/adr/`

**例:**
```
ADR-001 Why Laravel（not Django）
ADR-002 Why PostgreSQL（not MySQL）
ADR-003 Why AWS（not GCP）
ADR-004 Why JWT（not Session）
```

**ADR構成:**
- Context（なぜこの決定が必要だったか）
- Decision（何を選んだか）
- Alternatives（検討した選択肢）
- Consequences（トレードオフ・影響）
- Status（Proposed / Accepted / Deprecated）

---

## § 12. NAMING CONVENTION — 全ドキュメント共通

```
Table:    tbl_employee（または複数形 employees）
Column:   employee_id
API:      POST /api/v1/login
Screen:   SCR-001
Function: FUNC-001
UseCase:  UC-001
Req ID:   REQ-001
Test:     TEST-001
DOC-ID:   [種別略語]-[プロジェクト略語]-[連番]
```

---

## § 13. REQUIREMENT ID RULE

```
REQ-001  ログイン
REQ-002  ユーザー管理
REQ-003  勤怠登録
```

**ルール:**
- Requirement IDは一度割り当てたら再利用禁止
- 削除された要件は「retired」として保留（ID再割り当て不可）
- 全ドキュメントで REQ-ID でトレーサブルであること

---

## § 14. TRACEABILITY RULE

```
REQ-001
  ↓
UC-001（ユースケース）
  ↓
FUNC-001（機能一覧）
  ↓
SCR-001（画面）
  ↓
API-001（エンドポイント）
  ↓
TBL-001（テーブル）
  ↓
TEST-001（試験ケース）
```

**全ドキュメントで横断トレーサビリティを保つこと。**

---

## § 15. RISK MANAGEMENT

| Risk Type | Risk | Impact | Probability | Countermeasure | Owner |
|-----------|------|--------|-------------|----------------|-------|
| Technical Risk | Framework未習熟 | Medium | Medium | PoC先行実施 | Tech Lead |
| Schedule Risk | 設計遅延 | High | Medium | Weekly review | PM |
| Security Risk | 権限設定ミス | High | Low | Authorization Test | Backend |
| Business Risk | 要件変更 | High | High | Change Control Board | PM |

---

## § 16. CROSS-DOCUMENT CONSISTENCY RULE

以下は**全ドキュメントで必ず統一**すること：

| カテゴリ | 統一すべき値 |
|---------|------------|
| 料金プラン | プラン名・価格・通貨 |
| KPI | MRR / ARR / 時期 |
| ロール名 | engineer / manager / admin 等 |
| enum値 | sessions.status 等の列挙値 |
| DOC-ID | 種別略語-プロジェクト略語-連番 |
| Rev/日付 | 後工程の文書が前工程より低いRevにならないこと |
| テーブル名 | 全ドキュメントで物理名統一 |
| API Endpoint | 画面設計とAPI設計で一致 |
| Status値 | 要件定義・DB・テスト仕様で一致 |

**生成後の自動整合性チェック（必ず実施）:**
価格・ロール名・enum値・日付・DOC-ID重複・TOCページ番号・Rev番号

---

## § 17. DIAGRAM SELECTION GUIDE — 設計図選択早見表

| 表現したい内容 | 使う図 | どの文書 |
|--------------|--------|---------|
| 業務の時系列・部門間の受け渡し | 業務フロー図（スイムレーン） | 要件定義書 / 基本設計書 |
| ユーザーと機能の関係 | ユースケース図 | 要件定義書 / 基本設計書 |
| 画面の遷移・ナビゲーション | 画面遷移図 | 基本設計書 |
| 1画面のレイアウト | 画面レイアウト図（WF） | 基本設計書 |
| オブジェクト間のメッセージ（時系列） | シーケンス図 | 詳細設計書 |
| 処理の分岐・並行・ループ | アクティビティ図 | 詳細設計書 |
| クラスの構造・継承関係 | クラス図 | 詳細設計書 |
| テーブル構造・FK関係 | ER図 | 基本設計書 |
| サーバー・NW・クラウド構成 | ネットワーク構成図 | 基本設計書 / インフラ設計 |
| タスクの階層分解 | WBS | プロジェクト計画書 |
| スケジュール・依存関係 | ガントチャート / クリティカルパス | プロジェクト計画書 |
| データの流れ | データフロー図（DFD） | 詳細設計書 / データフロー設計 |
| システム全体構成 | システム構成図（C4 Context / Container） | アーキテクチャ設計 |

---

## § 18. DESIGN REVIEW CHECKLIST

```
□ Core Thinking（WHY/WHOM/WHO/WHAT/WHERE/WHEN/HOW/HOW MUCH/WHAT IF）に回答済み
□ Stakeholder が定義され、Responsibility・Risk が明確
□ System Characteristics が定義済み
□ 要件定義が完了し、REQ-IDが割り当て済み
□ 非機能要件が分類・定量化済み（Response Time、SLA、RTO/RPO etc.）
□ 全ドキュメントで命名が統一されている
□ アーキテクチャ決定がADRに記録済み
□ セキュリティが設計済み（認証・認可・暗号化・監査ログ）
□ エラーハンドリングが定義済み
□ ログ設計が完了
□ 監視・アラートが設計済み
□ 性能要件が定義・試験計画あり
□ バックアップ・復旧計画あり
□ 試験ケースが要件にトレーサブル
□ デプロイ手順が文書化済み
□ 運用保守手順が文書化済み
□ クロスドキュメント整合性チェック済み
```

---

## § 19. DOCUMENT DEPENDENCY FLOW

```
企画書（WHY・WHAT大）
  ↓
要件定義書（WHAT詳細）
  ↓
ユースケース / 業務フロー
  ↓
機能一覧
  ↓
画面設計 ── ER図 ── API設計
  ↓
基本設計書（WHAT統合）
  ↓
アーキテクチャ設計
  ↓
詳細設計書 ── データフロー設計（HOW）
  ↓
インフラ設計 ── セキュリティ設計 ── ログ設計 ── 監視設計
  ↓
試験仕様書（単体→結合→システム→性能）
  ↓
リリース手順書
  ↓
運用保守手順書
```

---

## § 20. EXECUTION STEPS — 実行手順

1. ユーザーが **[ドキュメント種別]** + **[システム/機能情報]** を提示
2. 不足情報があれば **5個以内の質問** で補完
3. **授業モード / ビジネスモード** を判定
4. **§2〜§5** でプロジェクトを分類、生成すべき文書セットを確認
5. Core Thinking（§0）への回答を確認・補完
6. 対応セクションの構成に従い **HTMLを生成**（A4印刷対応）
7. クロスドキュメント整合性チェックを実施
8. 保存先を確認し、ファイル名 `[種別]_[システム名].html` で保存
9. 保存後 「**ChromeでCtrl+P → PDFとして保存**」をリマインド

---

## § 21. GOLDEN RULE

コードを書く前に、以下が完成していること：

```
企画書
  ↓ WHY
要件定義
  ↓ WHAT
業務フロー / 画面設計 / ER図 / API設計
  ↓ HOW（構造）
アーキテクチャ設計 / 詳細設計
  ↓ HOW（実装指示）
試験仕様書
  ↓ VERIFY
リリース → 運用
```

**優れたシステムエンジニアはコードから始めない。**

```
WHY → WHOM → WHO → WHAT → WHERE → WHEN → HOW → HOW MUCH → WHAT IF
→ DESIGN → BUILD → TEST → RELEASE → OPERATE
```
