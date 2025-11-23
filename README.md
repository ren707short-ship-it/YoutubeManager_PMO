# YouTube Shorts 管理システム v2

YouTubeショートの量産運用を管理するための、オーナー（人）＋複数クリエイター（外注）向けの軽量なフルスタックWebアプリです。

## 🎉 v2 新機能ハイライト

- ✅ **制作ポータル**: テンプレート＆マニュアルの一元管理
- ✅ **YouTube API連携**: 自動データ取得と参考チャンネル分析
- ✅ **実運用フロー最適化**: マニュアル完全統合、ワークフロー導線
- ✅ **完全マニュアル**: 14KB、オーナー/クリエイター/GitHub/デプロイまで網羅

## クイックスタート

### 📱 アプリケーションURL
- **開発版**: https://3000-irnchy1kkvsexgxna5tqf-583b4d74.sandbox.novita.ai
- **本番版**: Cloudflare Pages にデプロイ後に取得

### 🔧 最新の修正状況（2025-11-23）
- ✅ **v2機能の認証問題を修正**: settings, templates, manuals, youtubeルートに認証ミドルウェアを追加
- ✅ **参照チャンネル削除機能を追加**: DELETE /api/references/videos/:id エンドポイント実装
- ✅ **D1バインドエラーを修正**: undefined値をnullに変換する処理を追加
- ✅ **設定画面へのアクセス**: curlテストで正常動作確認済み

### 🔑 ログイン情報
- **オーナー**: `owner@example.com` / `password`
- **クリエイター1**: `creator1@example.com` / `password`
- **クリエイター2**: `creator2@example.com` / `password`

### 📖 完全マニュアル
**MANUAL.md** をご覧ください（14KB、すべての情報を網羅）

### 📦 プロジェクトバックアップ
- **最新バックアップ**: https://www.genspark.ai/api/files/s/4OWrrgjw
- ダウンロードして `tar -xzf` で展開

## プロジェクト概要

このシステムは、複数のYouTubeチャンネル、動画タスク、ネタ（アイデア）、外注メンバー、アフィリエイトリンクを一元管理し、オーナーが「何を・誰が・いつまでに・どこに投稿するか」をひと目で把握できるように設計されています。

「Teamsの操作性」と「スプレッドシートの一覧性」を持った、YouTubeショート運用専用のマネジメントSaaSです。

**v2では、制作物・マニュアル・分析ツールまでこのツール1つに統合されました。**

## 技術スタック

- **フロントエンド**: Vanilla JavaScript + TailwindCSS
- **バックエンド**: Hono (TypeScript)
- **デプロイ**: Cloudflare Pages + Workers
- **データベース**: Cloudflare D1 (SQLite)
- **認証**: セッションベース認証（Cookie）
- **開発環境**: PM2 + Wrangler Dev Server

## 機能一覧

### ✅ 実装済み機能

#### 認証システム
- ログイン/ログアウト
- ロールベースアクセス制御（Owner / Creator）
- セッション管理

#### ダッシュボード
- ステータス別動画タスク件数の表示
- 管理中のアカウント一覧
- 期限超過の動画タスク一覧
- 期限が近い動画タスク一覧（3日以内）
- **🆕 フィードバック待ち動画の一覧表示**
- **🆕 クリエイター別統計表示（総タスク数・公開数・FB待ち数）**

#### アカウント管理
- YouTubeチャンネル（アカウント）の作成・編集・削除
- 担当クリエイターの割り当て
- アカウント詳細ページでのステータス別動画一覧（カンバン形式）
- **🆕 タブ形式でのコンテンツ整理（動画タスク・マテリアル・参照チャンネル）**
- **🆕 マテリアルライブラリ管理（動画・画像・テンプレート・GPT・その他）**
- **🆕 参照チャンネル管理（成功チャンネルの分析）**
- **🆕 参考動画登録とパターン分析メモ機能**

#### 動画管理
- 動画タスクの作成・編集・削除
- ステータス管理（アイデア/台本中/編集中/確認待ち/予約済み/投稿済み）
- 期限管理とアラート
- 台本・英訳台本・アセットリンクの管理
- YouTube URL・再生回数・いいね数の記録
- 動画ごとのコメント機能
- **🆕 フィードバックワークフロー機能**
  - **フィードバック必須フラグ設定**
  - **フィードバック期限管理**
  - **フィードバック完了マーク機能**
  - **FB待ち動画の視覚的インジケーター**

#### アイデア管理（オーナー専用）
- ネタ（アイデア）の登録・編集・削除
- 優先度管理（0-3）
- ステータス管理（未使用/使用中/使用済み）
- アイデアから動画タスクへの変換機能

#### アフィリエイトリンク管理（オーナー専用）
- アフィリエイトリンクの登録・編集・削除
- 概要欄テンプレート管理
- コミュニティ投稿テンプレート管理
- クリエイターからのURL非表示（内部名称のみ表示）

#### ユーザー管理（オーナー専用）
- ユーザーの作成・編集・削除
- ロール管理（Owner / Creator）
- パスワード管理
- **🆕 詳細なクリエイタープロフィール管理**
  - **契約プラットフォーム情報（クラウドワークス、ランサーズ等）**
  - **契約日と契約書類URL管理**
  - **ステータス管理（アクティブ・一時停止・終了）**
  - **提供マテリアル追跡機能**
  - **パフォーマンス統計表示（総タスク・公開済み・FB待ち）**
  - **備考・メモ機能**

#### 🆕 外注マテリアル管理（オーナー専用）
- クリエイター別に提供した素材の管理
- 素材タイプ別整理（動画・画像・テンプレート・その他）
- 素材URLと説明の保存
- クリエイターごとのマテリアル一覧表示

#### 🆕 v2: 制作ポータル（テンプレート＆マニュアル）
- **テンプレート管理**
  - ジャンル別の編集テンプレート登録
  - CapCutプロジェクトファイルのURL管理
  - 日本語/英語の台本テンプレート（プレースホルダ対応）
  - テンプレから動画タスクを自動作成
- **マニュアル管理**
  - ジャンル別の制作マニュアル（Markdown形式）
  - コンプラ回避ルール、NG例の明記
  - 動画詳細から直接マニュアル参照
  - owner/creator 両方アクセス可能
- **統合ポータル画面**
  - ジャンル別タブ切り替え
  - 左側: テンプレート一覧、右側: マニュアル表示
  - ワンストップで制作に必要な情報にアクセス

#### 🆕 v2: YouTube API連携
- **自アカウント分析**
  - YouTube チャンネルIDから自動同期
  - 動画一覧、タイトル、再生数、いいね数を自動取得
  - 既存動画の指標を自動更新
  - 新規動画を自動的にタスクとして追加
- **参照チャンネル分析**
  - 成功している他チャンネルの登録
  - 人気動画50件を自動取得（再生数順）
  - タイトル、説明、再生数、いいね数、長さを分析
  - 参考動画から自分用のネタ作成機能
- **API設定**
  - Google Cloud Console での APIキー取得方法（マニュアル記載）
  - 設定画面からAPIキー管理
  - APIキーを空にすると機能停止（再設定可能）

#### 🆕 v2: 実運用フロー最適化
- **owner 視点の導線**
  - ネタ → 動画作成（テンプレ選択） → アサイン → FB → 分析
  - 各画面に「次にやるべき操作」ボタン配置
- **creator 視点の導線**
  - ダッシュボード → 動画詳細 → マニュアル参照 → テンプレDL → 作業 → 更新
  - 迷わないステップバイステップUI
  - 番号付きガイドでフロー明示

#### 🆕 参照チャンネル分析
- 成功しているYouTubeチャンネルの登録
- チャンネルごとの参考動画リスト管理
- バイラル動画のパターン分析メモ機能
- YouTubeへの直接リンク

## データモデル

### テーブル構造

1. **users** - ユーザー（オーナー・クリエイター）
   - 基本情報（name, email, role）
   - **契約情報（contract_platform, contract_date, contract_document_url）**
   - **ステータス（status: active/paused/terminated）**
   - **備考（notes）**

2. **accounts** - YouTubeチャンネル
   - チャンネル情報（name, genre, url）
   - 担当クリエイター（assigned_creator_id）

3. **videos** - 動画タスク
   - 基本情報（title, status, due_date）
   - コンテンツ（script_text, script_text_en, asset_links）
   - メトリクス（metrics_view_count, metrics_like_count）
   - **フィードバック情報（feedback_required, feedback_deadline, feedback_completed_at）**

4. **affiliate_links** - アフィリエイトリンク
   - リンク情報（internal_name, url）
   - テンプレート（description_template, community_template）

5. **ideas** - ネタ（アイデア）
   - アイデア情報（title, content, priority）
   - ステータス（status: unused/in_use/used）

6. **comments** - 動画ごとのコメント
   - コメント内容（body）
   - ユーザー情報（user_id）

7. **🆕 creator_assets** - クリエイター提供マテリアル
   - マテリアル情報（name, url, asset_type）
   - クリエイター紐付け（user_id）

8. **🆕 reference_channels** - 参照チャンネル
   - チャンネル情報（channel_name, youtube_channel_id）
   - アカウント紐付け（account_id）
   - メモ（notes）

9. **🆕 reference_videos** - 参考動画
   - 動画情報（title, youtube_video_id）
   - チャンネル紐付け（channel_id）
   - 分析メモ（notes）

10. **🆕 account_assets** - アカウント別マテリアル
    - マテリアル情報（name, url, asset_type, description）
    - アカウント紐付け（account_id）

詳細なスキーマは `migrations/0001_initial_schema.sql` および `migrations/0002_add_advanced_features.sql` を参照してください。

## 📚 ドキュメント

### マニュアル
- **[オーナー向けマニュアル](./MANUAL_OWNER.md)** - システム管理者・運営責任者向け
- **[クリエイター向けマニュアル](./MANUAL_CREATOR.md)** - 外注・制作担当者向け

### アップグレード提案
- **[📊 アップグレード提案サマリー](./UPGRADE_SUMMARY.md)** - v2の問題点とv3への進化提案（必読）
- **[📋 v3完全アップグレード提案書](./PROPOSAL_V3_UPGRADE.md)** - エンタープライズ級SaaSへの詳細計画
- **[🚀 v2.5クイックウィン施策](./QUICK_WINS_V2.5.md)** - 2-3日で即座に改善できる施策

## セットアップ方法

### 必要な環境
- Node.js v18以上
- npm

### インストール手順

1. リポジトリのクローン
```bash
git clone <repository-url>
cd webapp
```

2. 依存パッケージのインストール
```bash
npm install
```

3. データベースのセットアップ
```bash
# マイグレーション適用
npm run db:migrate:local

# サンプルデータ投入
npm run db:seed
```

4. 開発サーバーの起動
```bash
# ビルド
npm run build

# PM2で起動
pm2 start ecosystem.config.cjs

# または、直接起動
npm run dev:sandbox
```

5. ブラウザで http://localhost:3000 にアクセス

### 初期ログイン情報

#### オーナーアカウント（管理者）
- **Email**: owner@example.com
- **Password**: password
- **Role**: Owner
- **権限**: 全機能へのアクセス、すべてのデータの管理

#### クリエイターアカウント（外注者）
以下のアカウントで外注者視点を体験できます：

**クリエイター1 (山田太郎)**
- **Email**: creator1@example.com
- **Password**: password
- **Role**: Creator
- **契約**: クラウドワークス経由（2024-01-15契約）
- **権限**: 自分に割り当てられたアカウント・動画のみ閲覧・編集可能

**クリエイター2 (鈴木花子)**
- **Email**: creator2@example.com
- **Password**: password
- **Role**: Creator
- **契約**: ランサーズ経由（2024-02-01契約）
- **権限**: 自分に割り当てられたアカウント・動画のみ閲覧・編集可能

> **注意**: クリエイターアカウントでログインすると、アフィリエイトURLは非表示になり、アイデア管理・ユーザー管理などのオーナー専用機能は表示されません。

### サンプルデータ

シードデータには以下が含まれています：

**基本データ（seed.sql）:**
- オーナーユーザー 1名
- クリエイターユーザー 2名
- YouTubeアカウント 3件（クリエイター1に2件、クリエイター2に1件割り当て済み）
- 動画タスク 4件（各クリエイターに割り当て済み）
- アイデア 3件
- アフィリエイトリンク 2件
- コメント 2件

**拡張データ（seed_advanced.sql）:**
- **クリエイター契約情報**（契約プラットフォーム、契約日、契約書URL）
- **提供マテリアル** 6件（各クリエイターに素材・テンプレート等を提供）
- **参照チャンネル** 2件（成功チャンネルの情報）
- **参考動画** 4件（バイラル動画のパターン分析メモ付き）
- **アカウント別マテリアル** 4件（動画素材、テンプレート、GPT情報等）

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev:sandbox

# ビルド
npm run build

# データベースマイグレーション（ローカル）
npm run db:migrate:local

# データベースシード投入
npm run db:seed

# データベースリセット
npm run db:reset

# ポートクリーンアップ
npm run clean-port

# 接続テスト
npm run test
```

## ユーザーロールと権限

### Owner（オーナー）- 管理者権限

**閲覧・管理できるデータ:**
- すべてのアカウント（YouTubeチャンネル）
- すべての動画タスク
- すべてのアイデア
- すべてのアフィリエイトリンク（URL含む）
- すべてのユーザー

**利用可能な機能:**
- ✅ ダッシュボード - 全体の状況確認
- ✅ アカウント管理 - 作成・編集・削除・担当者割り当て
- ✅ 動画管理 - 作成・編集・削除・全項目編集可能
- ✅ アイデア管理 - ネタの登録・管理・動画への変換
- ✅ アフィリエイト管理 - リンク登録・URL閲覧
- ✅ ユーザー管理 - クリエイターの追加・編集・削除
- ✅ コメント機能 - 動画ごとの連絡

**サイドバーメニュー:**
- ダッシュボード
- アカウント
- 動画
- アイデア ★
- アフィリエイト ★
- ユーザー管理 ★

### Creator（クリエイター）- 外注者権限

**閲覧・管理できるデータ:**
- 自分に割り当てられたアカウントのみ
- 自分に割り当てられた動画タスクのみ
- アフィリエイトリンクの内部名称のみ（URLは非表示）

**利用可能な機能:**
- ✅ ダッシュボード - 自分の担当タスク確認
- ✅ アカウント閲覧 - 担当アカウントのみ
- ✅ 動画編集 - 担当動画の一部項目のみ編集可能
  - ステータス変更（script/editing/review）
  - 台本・英訳台本の編集
  - アセットリンクの編集
  - YouTube URL・再生回数・いいね数の入力
- ✅ コメント機能 - オーナーとの連絡
- ❌ アイデア管理 - アクセス不可
- ❌ アフィリエイト管理 - アクセス不可
- ❌ ユーザー管理 - アクセス不可
- ❌ 動画の作成・削除 - 権限なし

**サイドバーメニュー:**
- ダッシュボード
- アカウント
- 動画

**制限事項:**
- 動画詳細画面で、アフィリエイトリンクのURLは表示されません
- 動画編集時、アカウント・タイトル・テンプレート・期限・アフィリエイトリンクは編集できません
- 他のクリエイターが担当するアカウント・動画は表示されません

## プロジェクト構造

```
webapp/
├── src/
│   ├── index.tsx              # メインエントリーポイント
│   ├── types/                 # TypeScript型定義
│   ├── lib/                   # ユーティリティ関数
│   │   └── auth.ts            # 認証関連
│   ├── middleware/            # Honoミドルウェア
│   │   └── auth.ts            # 認証ミドルウェア
│   └── routes/                # APIルート
│       ├── auth.ts            # 認証API
│       ├── users.ts           # ユーザー管理API
│       ├── accounts.ts        # アカウント管理API
│       ├── videos.ts          # 動画管理API
│       ├── comments.ts        # コメントAPI
│       ├── ideas.ts           # アイデア管理API
│       ├── affiliates.ts      # アフィリエイトAPI
│       └── dashboard.ts       # ダッシュボードAPI
├── public/
│   └── static/
│       └── app.js             # フロントエンドJavaScript
├── migrations/
│   └── 0001_initial_schema.sql # データベーススキーマ
├── seed.sql                   # サンプルデータ
├── ecosystem.config.cjs       # PM2設定
├── wrangler.jsonc             # Cloudflare設定
├── package.json               # 依存関係とスクリプト
└── README.md                  # このファイル
```

## API エンドポイント

### 認証
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/me` - 現在のユーザー情報取得

### ダッシュボード
- `GET /api/dashboard` - ダッシュボードデータ取得

### ユーザー管理（Owner専用）
- `GET /api/users` - ユーザー一覧
- `GET /api/users/:id` - ユーザー詳細
- `POST /api/users` - ユーザー作成
- `PUT /api/users/:id` - ユーザー更新
- `DELETE /api/users/:id` - ユーザー削除

### アカウント管理
- `GET /api/accounts` - アカウント一覧
- `GET /api/accounts/:id` - アカウント詳細
- `POST /api/accounts` - アカウント作成（Owner専用）
- `PUT /api/accounts/:id` - アカウント更新（Owner専用）
- `DELETE /api/accounts/:id` - アカウント削除（Owner専用）

### 動画管理
- `GET /api/videos` - 動画一覧
- `GET /api/videos/:id` - 動画詳細
- `GET /api/videos/account/:accountId` - アカウント別動画一覧
- `POST /api/videos` - 動画作成（Owner専用）
- `PUT /api/videos/:id` - 動画更新
- `DELETE /api/videos/:id` - 動画削除（Owner専用）

### コメント
- `GET /api/comments/video/:videoId` - 動画のコメント一覧
- `POST /api/comments` - コメント作成
- `DELETE /api/comments/:id` - コメント削除

### アイデア管理（Owner専用）
- `GET /api/ideas` - アイデア一覧
- `GET /api/ideas/:id` - アイデア詳細
- `POST /api/ideas` - アイデア作成
- `PUT /api/ideas/:id` - アイデア更新
- `DELETE /api/ideas/:id` - アイデア削除
- `POST /api/ideas/:id/create-video` - アイデアから動画作成

### アフィリエイトリンク管理（Owner専用）
- `GET /api/affiliates` - アフィリエイトリンク一覧
- `GET /api/affiliates/:id` - アフィリエイトリンク詳細
- `POST /api/affiliates` - アフィリエイトリンク作成
- `PUT /api/affiliates/:id` - アフィリエイトリンク更新
- `DELETE /api/affiliates/:id` - アフィリエイトリンク削除

### 🆕 クリエイターマテリアル管理（Owner専用）
- `GET /api/creator-assets/user/:userId` - クリエイター別マテリアル一覧
- `POST /api/creator-assets` - マテリアル追加
- `DELETE /api/creator-assets/:id` - マテリアル削除

### 🆕 参照チャンネル管理（Owner専用）
- `GET /api/references/channels/account/:accountId` - アカウント別参照チャンネル一覧
- `GET /api/references/videos/channel/:channelId` - チャンネル別参考動画一覧
- `POST /api/references/channels` - 参照チャンネル追加
- `POST /api/references/videos` - 参考動画追加
- `DELETE /api/references/channels/:id` - 参照チャンネル削除
- `DELETE /api/references/videos/:id` - 参考動画削除

### 🆕 アカウントマテリアル管理（Owner専用）
- `GET /api/account-assets/account/:accountId` - アカウント別マテリアル一覧
- `POST /api/account-assets` - マテリアル追加
- `PUT /api/account-assets/:id` - マテリアル更新
- `DELETE /api/account-assets/:id` - マテリアル削除

## デプロイ方法

### Cloudflare Pagesへのデプロイ

1. Cloudflare D1データベースの作成
```bash
npx wrangler d1 create webapp-production
```

2. `wrangler.jsonc`に取得したdatabase_idを設定

3. 本番環境へのマイグレーション適用
```bash
npm run db:migrate:prod
```

4. デプロイ
```bash
npm run deploy:prod
```

## トラブルシューティング

### ポート3000が使用中の場合
```bash
npm run clean-port
```

### データベースをリセットしたい場合
```bash
npm run db:reset
```

### PM2のログを確認したい場合
```bash
pm2 logs webapp --nostream
```

## 実装完了状況

### ✅ v1機能(完全実装済み)
- ✅ **基本的なYouTube Shorts管理機能**（ユーザー、アカウント、動画、アイデア、アフィリエイト）
- ✅ **Teams風の外注管理機能**（5-100人規模のクリエイター管理）
- ✅ **契約者プロフィール管理**（契約プラットフォーム、契約日、契約書類URL、ステータス）
- ✅ **フィードバックワークフロー**（FB必須フラグ、期限管理、完了マーク、視覚的インジケーター）
- ✅ **チャットベースのフィードバック**（コメント機能による納品物へのFB）
- ✅ **参照チャンネル管理**（成功チャンネルの分析、バイラル動画パターン抽出）
- ✅ **マテリアルライブラリ**（チャンネル別素材管理：画像、動画、テンプレート、GPT情報）
- ✅ **クリエイター提供マテリアル追跡**（クリエイター別に提供した素材の管理）
- ✅ **詳細なクリエイター詳細ページ**（契約情報、パフォーマンス統計、提供マテリアル一覧）
- ✅ **拡張されたダッシュボード**（FB待ち一覧、クリエイター別統計）
- ✅ **タブ形式のアカウント詳細**（動画タスク、マテリアル、参照チャンネルの整理）

### ✅ v2機能(NEW!)
- 🆕 **制作ポータル**（テンプレート・マニュアル統合管理）
- 🆕 **動画テンプレート管理**（CapCutプロジェクト、台本プリセット、注意事項）
- 🆕 **制作マニュアル管理**（ジャンル別運用ガイド、Markdown形式）
- 🆕 **YouTube API連携**（自アカウント動画自動取得、参考チャンネル分析）
- 🆕 **設定画面**（YouTube API設定、同期履歴）
- 🆕 **カテゴリ別整理**（fanza_intro, ai_love, celeb_gossipなど）
- 🆕 **完全なマニュアル**（オーナー向け・クリエイター向け）

## v2の使い方(クイックスタート)

### オーナーの場合

1. **制作ポータルの準備:**
   ```
   1. 制作ポータルを開く
   2. テンプレート追加(CapCutプロジェクトURL、台本テンプレート)
   3. マニュアル追加(コンプライアンス、NG例、OK例)
   ```

2. **YouTube API連携(オプション):**
   ```
   1. 設定画面を開く
   2. YouTube APIキーを入力
   3. アカウント画面で「YouTube同期」ボタンをクリック
   ```

3. **動画タスク作成:**
   ```
   1. 動画新規作成で「テンプレートから作成」を選択
   2. ジャンルに合ったテンプレートを選ぶ
   3. 台本テンプレートが自動入力される
   4. 担当クリエイターをアサイン
   ```

### クリエイターの場合

1. **毎日の流れ:**
   ```
   1. ダッシュボードで今日のタスクを確認
   2. 動画詳細でマニュアル・テンプレートを確認
   3. 制作ポータルでCapCutテンプレートをダウンロード
   4. 編集→アップロード→URL記録→ステータス更新
   ```

2. **初めての制作:**
   ```
   1. 制作ポータルを開く
   2. 担当ジャンルのマニュアルを熟読
   3. テンプレートをダウンロード
   4. サンプル動画で練習
   ```

## GitHubでの管理方法

### リポジトリ作成

```bash
# 初回のみ
cd /home/user/webapp
git init
git add .
git commit -m "Initial commit - YouTube Shorts Management System v2"

# GitHubリポジトリ作成後
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 日常的な更新

```bash
# 変更をコミット
git add .
git commit -m "Add new templates for AI love genre"
git push origin main
```

### 本番環境へのデプロイ

```bash
# Cloudflare Pagesへデプロイ
npm run build
npx wrangler pages deploy dist --project-name YOUR_PROJECT_NAME
```

## URLでの共有方法

### 開発環境(サンドボックス)

**現在のURL:** https://3000-irnchy1kkvsexgxna5tqf-583b4d74.sandbox.novita.ai

- このURLは**一時的**です(サンドボックスの有効期限は1時間)
- テストや開発用途のみ
- 外注には渡さないでください

### 本番環境(Cloudflare Pages)

**デプロイ後のURL:** https://YOUR_PROJECT_NAME.pages.dev

- このURLは**永続的**です
- 外注に渡してログインしてもらえます
- カスタムドメイン設定も可能

### 外注への共有方法

1. **本番環境にデプロイ**
2. **ユーザーアカウントを作成**(ユーザー管理画面)
3. **以下を共有:**
   ```
   URL: https://YOUR_PROJECT_NAME.pages.dev
   Email: creator1@example.com
   Password: (初回ログイン用パスワード)
   ```
4. **マニュアルも共有:**
   - MANUAL_CREATOR.mdをPDFやGoogleドキュメントにして共有

## 今後の拡張予定

### 次期機能候補(v3)
- [ ] **通知機能**（期限アラート、FB期限通知、ブラウザ通知）
- [ ] **ファイルアップロード**（サムネイル、素材の直接アップロード、Cloudflare R2統合）
- [ ] **高度な検索・フィルター**（タグ、カテゴリ、複数条件検索、保存済み検索）
- [ ] **レポート・分析機能**（パフォーマンスレポート、クリエイター評価、グラフ表示）
- [ ] **動画一括インポート**（CSV/スプレッドシートからの一括登録）
- [ ] **カレンダービュー**（期限・予約のカレンダー表示、Googleカレンダー連携）
- [ ] **AI支援機能**（タイトル生成、台本生成、サムネイル生成）
- [ ] **モバイルアプリ**（React Native / PWA）

## ライセンス

MIT

## 作成者

YouTube Shorts Management System Development Team
