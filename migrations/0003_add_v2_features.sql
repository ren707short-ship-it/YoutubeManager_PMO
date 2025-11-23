-- Migration 0003: v2 Features - Templates, Manuals, YouTube API Integration

-- 1. Video Templates (編集テンプレート・台本プリセット)
CREATE TABLE IF NOT EXISTS video_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  capcut_project_url TEXT,
  script_jp_template TEXT,
  script_en_template TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_video_templates_category ON video_templates(category);

-- 2. Manuals (制作マニュアル)
CREATE TABLE IF NOT EXISTS manuals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_manuals_category ON manuals(category);

-- 3. Reference Channels (参考チャンネル - 既存のreference_channelsを拡張)
-- genreカラムを追加
ALTER TABLE reference_channels ADD COLUMN genre TEXT;

-- 4. Reference Videos (参考チャンネルの動画データ)
-- reference_videosは既存のテーブルと競合しないように、新しいカラムを追加
-- 既存のreference_videosテーブルがあるかチェックして、なければ作成
CREATE TABLE IF NOT EXISTS youtube_video_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference_channel_id INTEGER,
  account_id INTEGER,
  youtube_video_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  published_at DATETIME,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reference_channel_id) REFERENCES reference_channels(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_youtube_video_data_ref_channel ON youtube_video_data(reference_channel_id);
CREATE INDEX IF NOT EXISTS idx_youtube_video_data_account ON youtube_video_data(account_id);
CREATE INDEX IF NOT EXISTS idx_youtube_video_data_youtube_id ON youtube_video_data(youtube_video_id);
CREATE INDEX IF NOT EXISTS idx_youtube_video_data_view_count ON youtube_video_data(view_count DESC);

-- 5. Videos table enhancement
-- video_template_id を追加してテンプレートと紐づけ
ALTER TABLE videos ADD COLUMN video_template_id INTEGER REFERENCES video_templates(id);
-- published_atは既に存在する可能性があるのでスキップ
-- ALTER TABLE videos ADD COLUMN published_at DATETIME;

-- 6. Accounts table enhancement
-- YouTube API連携用のチャンネルID追加（既存のurlとは別管理）
-- 既存のaccountsにはurlがあるが、youtube_channel_idを明示的に管理
-- ALTER TABLE accounts ADD COLUMN youtube_channel_id TEXT; -- 既にurlがあるので不要かもしれないが明示的に

-- 7. Settings table (YouTube API認証情報)
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初期設定値
INSERT OR IGNORE INTO settings (key, value) VALUES ('youtube_api_key', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('youtube_api_enabled', '0');

-- 8. Sync logs (YouTube API同期履歴)
CREATE TABLE IF NOT EXISTS sync_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sync_type TEXT NOT NULL,
  account_id INTEGER,
  reference_channel_id INTEGER,
  status TEXT NOT NULL,
  message TEXT,
  synced_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (reference_channel_id) REFERENCES reference_channels(id) ON DELETE CASCADE
);

CREATE INDEX idx_sync_logs_created ON sync_logs(created_at DESC);
