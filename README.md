# YouTube Shorts 管理システム

YouTubeショートの量産運用を管理するための、オーナー（人）＋複数クリエイター（外注）向けの軽量なフルスタックWebアプリです。

## プロジェクト概要

このシステムは、複数のYouTubeチャンネル、動画タスク、ネタ（アイデア）、外注メンバー、アフィリエイトリンクを一元管理し、オーナーが「何を・誰が・いつまでに・どこに投稿するか」をひと目で把握できるように設計されています。

「Teamsの操作性」と「スプレッドシートの一覧性」を持った、YouTubeショート運用専用のマネジメントSaaSです。

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

#### アカウント管理
- YouTubeチャンネル（アカウント）の作成・編集・削除
- 担当クリエイターの割り当て
- アカウント詳細ページでのステータス別動画一覧（カンバン形式）

#### 動画管理
- 動画タスクの作成・編集・削除
- ステータス管理（アイデア/台本中/編集中/確認待ち/予約済み/投稿済み）
- 期限管理とアラート
- 台本・英訳台本・アセットリンクの管理
- YouTube URL・再生回数・いいね数の記録
- 動画ごとのコメント機能

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

## データモデル

### テーブル構造

1. **users** - ユーザー（オーナー・クリエイター）
2. **accounts** - YouTubeチャンネル
3. **videos** - 動画タスク
4. **affiliate_links** - アフィリエイトリンク
5. **ideas** - ネタ（アイデア）
6. **comments** - 動画ごとのコメント

詳細なスキーマは `migrations/0001_initial_schema.sql` を参照してください。

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

**クリエイター1**
- **Email**: creator1@example.com
- **Password**: password
- **Role**: Creator
- **権限**: 自分に割り当てられたアカウント・動画のみ閲覧・編集可能

**クリエイター2**
- **Email**: creator2@example.com
- **Password**: password
- **Role**: Creator
- **権限**: 自分に割り当てられたアカウント・動画のみ閲覧・編集可能

> **注意**: クリエイターアカウントでログインすると、アフィリエイトURLは非表示になり、アイデア管理・ユーザー管理などのオーナー専用機能は表示されません。

### サンプルデータ

シードデータには以下が含まれています：
- オーナーユーザー 1名
- クリエイターユーザー 2名
- YouTubeアカウント 3件（クリエイター1に2件、クリエイター2に1件割り当て済み）
- 動画タスク 4件（各クリエイターに割り当て済み）
- アイデア 3件
- アフィリエイトリンク 2件
- コメント 2件

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

## 今後の拡張予定

- [ ] 動画の一括インポート機能
- [ ] アナリティクス・レポート機能
- [ ] 通知機能（期限アラート）
- [ ] ファイルアップロード機能（サムネイル等）
- [ ] タグ・カテゴリ機能
- [ ] 検索・フィルター機能の強化

## ライセンス

MIT

## 作成者

YouTube Shorts Management System Development Team
