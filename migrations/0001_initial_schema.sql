-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'creator')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- YouTube Accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  platform TEXT DEFAULT 'youtube',
  url TEXT,
  genre TEXT,
  owner_user_id INTEGER NOT NULL,
  assigned_creator_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_user_id) REFERENCES users(id),
  FOREIGN KEY (assigned_creator_id) REFERENCES users(id)
);

-- Affiliate Links table
CREATE TABLE IF NOT EXISTS affiliate_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_name TEXT NOT NULL,
  internal_name TEXT NOT NULL,
  url TEXT NOT NULL,
  description_template TEXT,
  community_template TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  template_type TEXT,
  status TEXT NOT NULL DEFAULT 'idea' CHECK (status IN ('idea', 'script', 'editing', 'review', 'scheduled', 'published')),
  assigned_creator_id INTEGER,
  due_date DATETIME,
  script_text TEXT,
  script_text_en TEXT,
  asset_links TEXT,
  affiliate_link_id INTEGER,
  youtube_url TEXT,
  published_at DATETIME,
  metrics_view_count INTEGER DEFAULT 0,
  metrics_like_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  FOREIGN KEY (assigned_creator_id) REFERENCES users(id),
  FOREIGN KEY (affiliate_link_id) REFERENCES affiliate_links(id)
);

-- Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  genre TEXT,
  summary TEXT NOT NULL,
  reference_url TEXT,
  priority INTEGER DEFAULT 0,
  status TEXT DEFAULT 'unused' CHECK (status IN ('unused', 'in_use', 'used')),
  linked_video_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (linked_video_id) REFERENCES videos(id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_accounts_owner ON accounts(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_creator ON accounts(assigned_creator_id);
CREATE INDEX IF NOT EXISTS idx_videos_account ON videos(account_id);
CREATE INDEX IF NOT EXISTS idx_videos_creator ON videos(assigned_creator_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_comments_video ON comments(video_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
