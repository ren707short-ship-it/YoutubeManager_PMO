-- Update existing users with contract information
UPDATE users SET 
  contract_platform = 'Lancers',
  contract_date = '2024-01-15',
  contract_document_url = 'https://drive.google.com/contract/creator1.pdf',
  status = 'active',
  notes = '動画編集経験3年。FANZA系とAI恋愛系が得意。'
WHERE id = 2;

UPDATE users SET 
  contract_platform = 'CrowdWorks',
  contract_date = '2024-02-01',
  contract_document_url = 'https://drive.google.com/contract/creator2.pdf',
  status = 'active',
  notes = '芸能人ネタが得意。リサーチ力が高い。'
WHERE id = 3;

-- Add creator assets (materials provided to creators)
INSERT INTO creator_assets (user_id, asset_type, name, url, description) VALUES
  (2, 'video', 'オープニング素材集', 'https://drive.google.com/assets/opening_templates.zip', 'FANZA系動画用のオープニング素材'),
  (2, 'image', 'サムネイルテンプレート', 'https://drive.google.com/assets/thumbnail_templates.psd', 'Photoshopテンプレート集'),
  (2, 'template', '台本テンプレート', 'https://docs.google.com/document/fanza_script_template', 'FANZA紹介動画用の台本フォーマット'),
  (3, 'video', 'BGM素材集', 'https://drive.google.com/assets/bgm_collection.zip', '著作権フリーBGM集'),
  (3, 'image', '芸能人画像素材', 'https://drive.google.com/assets/celeb_images/', '使用可能な芸能人画像フォルダ');

-- Add reference channels
INSERT INTO reference_channels (account_id, channel_name, channel_url, youtube_channel_id, description, priority) VALUES
  (1, '人気FANZA紹介チャンネルA', 'https://youtube.com/@fanza-reference-a', 'UCxxxxxxxxxxxxx1', '月間100万再生を誇るFANZA紹介チャンネル。サムネとタイトルの付け方が参考になる。', 3),
  (1, 'FANZA紹介チャンネルB', 'https://youtube.com/@fanza-reference-b', 'UCxxxxxxxxxxxxx2', '短尺でテンポの良い編集が特徴', 2),
  (2, 'AI恋愛系トップチャンネル', 'https://youtube.com/@ai-love-reference', 'UCxxxxxxxxxxxxx3', 'AI彼女系で登録者50万人。ストーリー展開が秀逸', 3),
  (3, '芸能人ゴシップチャンネル', 'https://youtube.com/@celeb-gossip-reference', 'UCxxxxxxxxxxxxx4', '投稿頻度とネタ選びが参考になる', 2);

-- Add reference videos (successful examples)
INSERT INTO reference_videos (reference_channel_id, video_title, video_url, youtube_video_id, view_count, like_count, published_at, notes) VALUES
  (1, 'FANZAの新作が激アツ！絶対見るべき5選', 'https://youtube.com/watch?v=abc123', 'abc123', 1500000, 25000, '2024-10-15', 'サムネイルのインパクトが強い。数字を使ったタイトル。'),
  (1, '【衝撃】FANZAランキング1位の作品がヤバい', 'https://youtube.com/watch?v=def456', 'def456', 2000000, 30000, '2024-10-20', '「衝撃」「ヤバい」などの感情ワードが効果的'),
  (2, 'AI彼女と付き合って1ヶ月経った結果...', 'https://youtube.com/watch?v=ghi789', 'ghi789', 800000, 15000, '2024-10-10', 'ストーリー形式。視聴者の感情移入を促す'),
  (3, '【速報】あの芸能人が引退発表', 'https://youtube.com/watch?v=jkl012', 'jkl012', 500000, 8000, '2024-10-25', '速報性が重要。投稿タイミングが良い');

-- Add account assets (channel-specific materials)
INSERT INTO account_assets (account_id, asset_type, name, url, description) VALUES
  (1, 'gpts', 'FANZA紹介台本生成GPT', 'https://chat.openai.com/g/g-xxxxxxxx1', 'FANZA作品紹介用の台本を自動生成'),
  (1, 'template', 'FANZA動画編集テンプレート', 'https://drive.google.com/fanza_premiere_template.prproj', 'Premiere Pro用テンプレート'),
  (1, 'image', 'FANZAロゴ素材', 'https://drive.google.com/fanza_logos/', '使用可能なロゴ画像集'),
  (2, 'gpts', 'AI恋愛ストーリー生成GPT', 'https://chat.openai.com/g/g-xxxxxxxx2', 'AI彼女との会話ストーリーを生成'),
  (2, 'video', 'AI音声サンプル', 'https://drive.google.com/ai_voice_samples/', 'AIボイス用の音声サンプル'),
  (3, 'gpts', '芸能人ネタリサーチGPT', 'https://chat.openai.com/g/g-xxxxxxxx3', '最新の芸能ニュースを要約'),
  (3, 'template', '芸能ネタ編集テンプレート', 'https://drive.google.com/celeb_template.aep', 'After Effects用テンプレート');

-- Add feedback requirements to some videos
UPDATE videos SET 
  feedback_required = 1,
  feedback_deadline = datetime('now', '+2 days')
WHERE id = 4;

-- Update accounts with YouTube API info
UPDATE accounts SET 
  youtube_api_enabled = 1,
  youtube_channel_id = 'UCxxxxxxxxxxxxx_fanza'
WHERE id = 1;

UPDATE accounts SET 
  youtube_api_enabled = 1,
  youtube_channel_id = 'UCxxxxxxxxxxxxx_ai'
WHERE id = 2;
