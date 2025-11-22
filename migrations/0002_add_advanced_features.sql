-- Add contract and profile information to users table
ALTER TABLE users ADD COLUMN contract_platform TEXT; -- e.g., 'Lancers', 'CrowdWorks', 'Coconala', 'Direct'
ALTER TABLE users ADD COLUMN contract_date DATE;
ALTER TABLE users ADD COLUMN contract_document_url TEXT;
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'terminated'));
ALTER TABLE users ADD COLUMN notes TEXT; -- General notes about the creator

-- Creator assets table - stores materials provided to creators
CREATE TABLE IF NOT EXISTS creator_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('video', 'image', 'template', 'other')),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reference channels table - channels to analyze and learn from
CREATE TABLE IF NOT EXISTS reference_channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL, -- Which account should learn from this
  channel_name TEXT NOT NULL,
  channel_url TEXT NOT NULL,
  youtube_channel_id TEXT, -- YouTube Channel ID for API access
  description TEXT,
  priority INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Reference videos table - specific videos to analyze
CREATE TABLE IF NOT EXISTS reference_videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference_channel_id INTEGER NOT NULL,
  video_title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  youtube_video_id TEXT,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  published_at DATETIME,
  notes TEXT, -- What makes this video successful
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reference_channel_id) REFERENCES reference_channels(id) ON DELETE CASCADE
);

-- Account assets table - materials specific to each account/channel
CREATE TABLE IF NOT EXISTS account_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('video', 'image', 'template', 'gpts', 'other')),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- YouTube analytics table - stores fetched analytics data
CREATE TABLE IF NOT EXISTS youtube_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  watch_time_minutes INTEGER DEFAULT 0,
  average_view_duration_seconds INTEGER DEFAULT 0,
  click_through_rate REAL DEFAULT 0.0,
  fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- Add feedback status to videos table
ALTER TABLE videos ADD COLUMN feedback_required INTEGER DEFAULT 0; -- 0 = no, 1 = yes
ALTER TABLE videos ADD COLUMN feedback_deadline DATETIME;
ALTER TABLE videos ADD COLUMN feedback_completed_at DATETIME;

-- Add YouTube API credentials to accounts
ALTER TABLE accounts ADD COLUMN youtube_api_enabled INTEGER DEFAULT 0;
ALTER TABLE accounts ADD COLUMN youtube_channel_id TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_creator_assets_user ON creator_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_reference_channels_account ON reference_channels(account_id);
CREATE INDEX IF NOT EXISTS idx_reference_videos_channel ON reference_videos(reference_channel_id);
CREATE INDEX IF NOT EXISTS idx_account_assets_account ON account_assets(account_id);
CREATE INDEX IF NOT EXISTS idx_youtube_analytics_video ON youtube_analytics(video_id);
CREATE INDEX IF NOT EXISTS idx_videos_feedback ON videos(feedback_required, feedback_deadline);
