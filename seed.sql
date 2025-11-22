-- Insert initial owner user
-- Email: owner@example.com
-- Password: password (bcrypt hash for 'password' with cost 10)
INSERT OR IGNORE INTO users (id, name, email, password_hash, role) VALUES 
  (1, 'Owner User', 'owner@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye5JFKm2hB3H6F/YaJWLh3qQvF4hN5o2i', 'owner');

-- Insert sample creator users
INSERT OR IGNORE INTO users (id, name, email, password_hash, role) VALUES 
  (2, 'Creator One', 'creator1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye5JFKm2hB3H6F/YaJWLh3qQvF4hN5o2i', 'creator'),
  (3, 'Creator Two', 'creator2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye5JFKm2hB3H6F/YaJWLh3qQvF4hN5o2i', 'creator');

-- Insert sample YouTube accounts
INSERT OR IGNORE INTO accounts (id, name, platform, url, genre, owner_user_id, assigned_creator_id) VALUES 
  (1, 'FANZA紹介チャンネル', 'youtube', 'https://youtube.com/@fanza-intro', 'FANZA紹介', 1, 2),
  (2, 'AI恋愛チャンネル', 'youtube', 'https://youtube.com/@ai-love', 'AI恋愛', 1, 2),
  (3, '芸能人ネタチャンネル', 'youtube', 'https://youtube.com/@celeb-gossip', '芸能人ネタ', 1, 3);

-- Insert sample affiliate links
INSERT OR IGNORE INTO affiliate_links (id, service_name, internal_name, url, description_template, community_template) VALUES 
  (1, 'FANZA', 'FANZA公式', 'https://affiliate.dmm.com/xxxxx', '▼FANZA公式サイトはこちら\n{url}\n\n※18歳未満の方は利用できません', 'FANZAで話題の作品はこちら！\n{url}'),
  (2, 'DMM', 'DMM FX', 'https://affiliate.dmm.com/yyyyy', '▼DMM FXの口座開設はこちら\n{url}', 'DMM FXで今すぐ取引開始！\n{url}');

-- Insert sample videos
INSERT OR IGNORE INTO videos (id, account_id, title, template_type, status, assigned_creator_id, due_date, script_text) VALUES 
  (1, 1, 'FANZA新作紹介 #1', 'fanza_intro', 'idea', 2, datetime('now', '+3 days'), 'FANZAの新作を紹介する動画の台本案'),
  (2, 2, 'AI彼女と過ごす日常', 'ai_love', 'script', 2, datetime('now', '+5 days'), 'AI彼女との日常会話シーンの台本'),
  (3, 1, 'FANZA人気ランキング', 'fanza_intro', 'editing', 2, datetime('now', '+2 days'), '人気ランキングTOP5を紹介'),
  (4, 3, '芸能人の意外な一面', 'celeb_gossip', 'review', 3, datetime('now', '+1 day'), '芸能人の意外なエピソード集');

-- Insert sample ideas
INSERT OR IGNORE INTO ideas (id, genre, summary, reference_url, priority, status) VALUES 
  (1, 'FANZA', 'FANZAの月間売上TOP10を紹介する動画', 'https://twitter.com/xxxxx', 3, 'unused'),
  (2, 'AI恋愛', 'AI彼女とのデート企画', NULL, 2, 'unused'),
  (3, '芸能人', '最近話題の若手俳優特集', 'https://twitter.com/yyyyy', 2, 'unused');

-- Insert sample comments
INSERT OR IGNORE INTO comments (id, video_id, user_id, body) VALUES 
  (1, 4, 1, '台本の内容を確認しました。問題ないので編集に進めてください。'),
  (2, 4, 3, 'わかりました！編集を開始します。');
