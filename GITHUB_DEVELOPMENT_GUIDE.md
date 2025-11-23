# 🚀 GitHub経由での開発継続ガイド

このガイドでは、GitHub経由でYouTube Shorts管理システムの開発を継続する方法を説明します。

---

## 🎯 このガイドの目的

1. **複数セッションでの開発継続** - トークン制限を回避
2. **他のオーナーや外注先への共有** - リポジトリURLを渡すだけ
3. **ローカル開発環境の構築** - 自分のPCで編集可能
4. **次回チャットセッションでの再開** - コードを引き継ぎ

---

## 📦 1. 初回セットアップ（このチャットで実施）

### A. GitHub認証

1. サンドボックスの「Deploy」タブを開く
2. 「GitHub」セクションで認証
3. リポジトリを選択または新規作成

### B. コードをGitHubにプッシュ

```bash
# ブランチ確認
git branch  # main であることを確認

# リモートリポジトリ設定（自動設定される）
git remote -v

# プッシュ
git push -u origin main
```

### C. リポジトリURLを保存

```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
```

このURLを保存してください。他の人に渡すときもこのURLを使います。

---

## 💻 2. ローカル開発環境の構築

### A. 前提条件

以下がインストールされている必要があります：

- **Node.js v18以上** - https://nodejs.org/
- **Git** - https://git-scm.com/
- **テキストエディタ** - VSCode推奨 https://code.visualstudio.com/

### B. リポジトリのクローン

```bash
# ターミナル/コマンドプロンプトを開く

# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
cd YOUR_REPO_NAME

# 依存パッケージをインストール
npm install
```

### C. ローカルデータベースのセットアップ

```bash
# D1データベースのマイグレーション適用
npm run db:migrate:local

# サンプルデータ投入
npm run db:seed

# v2のサンプルデータも投入
npx wrangler d1 execute webapp-production --local --file=./seed_v2.sql
```

### D. 開発サーバーの起動

```bash
# ビルド
npm run build

# PM2で起動
pm2 start ecosystem.config.cjs

# または直接起動
npm run dev:sandbox
```

### E. ブラウザで確認

http://localhost:3000 にアクセス

**ログイン情報:**
- Email: `owner@example.com`
- Password: `password`

---

## 🔄 3. 開発ワークフロー

### A. ブランチ戦略

```bash
# 新機能開発用のブランチを作成
git checkout -b feature/modern-ui

# 作業する
# コードを編集...

# 変更をコミット
git add .
git commit -m "Add modern UI components"

# GitHubにプッシュ
git push origin feature/modern-ui
```

### B. 変更を本番環境に反映

```bash
# mainブランチに戻る
git checkout main

# 機能ブランチをマージ
git merge feature/modern-ui

# GitHubにプッシュ
git push origin main
```

### C. 他の人の変更を取得

```bash
# 最新のコードを取得
git pull origin main

# 依存パッケージを更新（package.jsonが変更された場合）
npm install

# データベーススキーマを更新（マイグレーションが追加された場合）
npm run db:migrate:local
```

---

## 🤖 4. 次回のチャットセッションでの再開方法

### パターンA: GitHub経由で再開

新しいチャットセッションで以下のように依頼：

```
以下のGitHubリポジトリからコードを取得して、
v2.5の実装を続けてください：

https://github.com/YOUR_USERNAME/YOUR_REPO_NAME

前回はモダンUIを実装しました。
次はセキュリティの可視化を実装してください。
```

### パターンB: 特定ファイルの編集を依頼

```
GitHubリポジトリ: https://github.com/YOUR_USERNAME/YOUR_REPO_NAME

public/static/app.js の renderDashboardPage 関数を
カード型レイアウトに変更してください。

QUICK_WINS_V2.5.md の「施策1」を参考に実装してください。
```

---

## 👥 5. 他の人に共有する方法

### A. オーナー（管理者）への共有

```
【YouTube Shorts管理システム】

GitHubリポジトリ: https://github.com/YOUR_USERNAME/YOUR_REPO_NAME

セットアップ手順:
1. Node.js (v18以上) をインストール
   https://nodejs.org/

2. リポジトリをクローン
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
   cd YOUR_REPO_NAME

3. セットアップ
   npm install
   npm run db:migrate:local
   npm run db:seed
   npm run build
   pm2 start ecosystem.config.cjs

4. ブラウザで開く
   http://localhost:3000

ログイン情報:
- Email: owner@example.com
- Password: password

マニュアル: MANUAL_OWNER.md を参照
```

### B. 外注先（クリエイター）への共有

外注先には**デプロイ済みのURL**を共有します：

```
【YouTube Shorts管理システム】

アクセスURL: https://YOUR_PROJECT_NAME.pages.dev

ログイン情報:
- Email: (個別に設定したメールアドレス)
- Password: (初回パスワード)

使い方: MANUAL_CREATOR.md を参照
または PDFファイルを共有
```

### C. 開発者への共有

開発を手伝ってもらう場合：

```
【YouTube Shorts管理システム - 開発者向け】

GitHubリポジトリ: https://github.com/YOUR_USERNAME/YOUR_REPO_NAME

技術スタック:
- フロントエンド: Vanilla JS + TailwindCSS
- バックエンド: Hono (TypeScript)
- デプロイ: Cloudflare Pages + Workers
- データベース: Cloudflare D1 (SQLite)

開発ガイド:
1. README.md - プロジェクト概要
2. GITHUB_DEVELOPMENT_GUIDE.md - このファイル
3. QUICK_WINS_V2.5.md - 実装予定の機能
4. PROPOSAL_V3_UPGRADE.md - 将来の拡張計画

イシュー管理: GitHub Issues を使用
プルリクエスト: 機能ごとにブランチを切ってPR作成
```

---

## 🐛 6. トラブルシューティング

### 問題1: `npm install` が失敗する

```bash
# キャッシュをクリア
npm cache clean --force

# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### 問題2: データベースが見つからない

```bash
# D1データベースを初期化
npm run db:reset
```

### 問題3: ポート3000が使用中

```bash
# ポートを解放
npm run clean-port

# またはPM2を再起動
pm2 delete all
pm2 start ecosystem.config.cjs
```

### 問題4: git push が失敗する

```bash
# 認証情報を確認
git config user.name
git config user.email

# 設定されていない場合は設定
git config user.name "Your Name"
git config user.email "your.email@example.com"

# GitHubの認証（トークンが必要）
# Deploy タブで再認証してください
```

---

## 📚 7. 参考ドキュメント

### プロジェクトドキュメント

| ファイル | 内容 |
|---------|------|
| **README.md** | プロジェクト全体の説明 |
| **UPGRADE_SUMMARY.md** | v3アップグレード提案サマリー |
| **QUICK_WINS_V2.5.md** | 即効性のある改善施策 |
| **PROPOSAL_V3_UPGRADE.md** | 完全版アップグレード計画 |
| **MANUAL_OWNER.md** | オーナー向けマニュアル |
| **MANUAL_CREATOR.md** | クリエイター向けマニュアル |
| **GITHUB_DEVELOPMENT_GUIDE.md** | このファイル |

### コードベース

| ディレクトリ/ファイル | 内容 |
|---------------------|------|
| `src/` | バックエンドコード（Hono + TypeScript） |
| `src/routes/` | APIエンドポイント |
| `public/static/app.js` | フロントエンドコード（4000行） |
| `migrations/` | データベーススキーマ |
| `seed.sql`, `seed_v2.sql` | サンプルデータ |
| `wrangler.jsonc` | Cloudflare設定 |
| `ecosystem.config.cjs` | PM2設定 |

### 外部リンク

- **Hono**: https://hono.dev/
- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Cloudflare D1**: https://developers.cloudflare.com/d1/
- **TailwindCSS**: https://tailwindcss.com/

---

## 🎯 8. v2.5実装チェックリスト

このリストを使って、どこまで実装されたか確認してください：

### 施策1: モダンUI刷新 (6時間)
- [ ] カラーパレット刷新
- [ ] サイドバーの改善（グラスモーフィズム）
- [ ] カード型レイアウト（ダッシュボード）
- [ ] カード型レイアウト（動画一覧）
- [ ] トランジション・アニメーション
- [ ] スケルトンローディング

### 施策2: セキュリティ可視化 (3時間)
- [ ] パスワード強度メーター
- [ ] セキュリティダッシュボード
- [ ] 簡易監査ログテーブル
- [ ] ログイン履歴表示
- [ ] アクティビティログ表示

### 施策3: チャット機能改善 (4時間)
- [ ] スレッド型コメントDB追加
- [ ] スレッド表示UI
- [ ] 30秒ごとの自動リロード
- [ ] Markdown対応
- [ ] @メンション（簡易版）

### 施策4: 擬似ファイル管理 (2時間)
- [ ] ファイル種別アイコン表示
- [ ] 画像URLのサムネイル表示
- [ ] YouTube URL埋め込み
- [ ] ファイル一覧UI改善

### 施策5: 簡易通知システム (3時間)
- [ ] 通知テーブル作成
- [ ] ベルアイコン + バッジ
- [ ] 通知センター（ドロップダウン）
- [ ] トースト通知
- [ ] 通知生成ロジック

---

## 📞 サポート

### 質問がある場合

新しいチャットセッションで以下のように質問してください：

```
GitHubリポジトリ: https://github.com/YOUR_USERNAME/YOUR_REPO_NAME

【質問】
(あなたの質問をここに書く)

【現在の状況】
- ローカル開発環境: セットアップ済み / 未セットアップ
- 実装済み機能: 施策1（モダンUI）まで完了
- エラー内容: (エラーがあれば貼り付け)
```

### 次のセッションで実装を依頼する場合

```
GitHubリポジトリ: https://github.com/YOUR_USERNAME/YOUR_REPO_NAME

QUICK_WINS_V2.5.md の施策2（セキュリティ可視化）を実装してください。
前回は施策1（モダンUI）まで完了しています。
```

---

## ✅ 完了チェック

GitHub経由の開発環境が整ったら、以下を確認してください：

- [ ] GitHubにコードがプッシュされている
- [ ] リポジトリURLを保存した
- [ ] ローカル開発環境が動作する（オプション）
- [ ] このガイドを保存した
- [ ] 次回のセッションで何を実装するか決めた

これで、いつでもどこでも開発を継続できます！

---

**次は: モダンUIの実装を開始しましょう！**
