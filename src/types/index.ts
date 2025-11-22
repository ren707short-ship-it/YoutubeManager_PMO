export type Bindings = {
  DB: D1Database;
}

export type Variables = {
  user?: User;
}

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'creator';
  contract_platform: string | null;
  contract_date: string | null;
  contract_document_url: string | null;
  status: 'active' | 'paused' | 'terminated';
  notes: string | null;
}

export type Account = {
  id: number;
  name: string;
  platform: string;
  url: string | null;
  genre: string | null;
  owner_user_id: number;
  assigned_creator_id: number | null;
  created_at: string;
}

export type Video = {
  id: number;
  account_id: number;
  title: string;
  template_type: string | null;
  status: 'idea' | 'script' | 'editing' | 'review' | 'scheduled' | 'published';
  assigned_creator_id: number | null;
  due_date: string | null;
  script_text: string | null;
  script_text_en: string | null;
  asset_links: string | null;
  affiliate_link_id: number | null;
  youtube_url: string | null;
  published_at: string | null;
  metrics_view_count: number;
  metrics_like_count: number;
  created_at: string;
  updated_at: string;
}

export type AffiliateLink = {
  id: number;
  service_name: string;
  internal_name: string;
  url: string;
  description_template: string | null;
  community_template: string | null;
  created_at: string;
}

export type Idea = {
  id: number;
  genre: string | null;
  summary: string;
  reference_url: string | null;
  priority: number;
  status: 'unused' | 'in_use' | 'used';
  linked_video_id: number | null;
  created_at: string;
}

export type Comment = {
  id: number;
  video_id: number;
  user_id: number;
  body: string;
  created_at: string;
}

export type CreatorAsset = {
  id: number;
  user_id: number;
  asset_type: 'video' | 'image' | 'template' | 'other';
  name: string;
  url: string;
  description: string | null;
  created_at: string;
}

export type ReferenceChannel = {
  id: number;
  account_id: number;
  channel_name: string;
  channel_url: string;
  youtube_channel_id: string | null;
  description: string | null;
  priority: number;
  created_at: string;
}

export type ReferenceVideo = {
  id: number;
  reference_channel_id: number;
  video_title: string;
  video_url: string;
  youtube_video_id: string | null;
  view_count: number;
  like_count: number;
  published_at: string | null;
  notes: string | null;
  created_at: string;
}

export type AccountAsset = {
  id: number;
  account_id: number;
  asset_type: 'video' | 'image' | 'template' | 'gpts' | 'other';
  name: string;
  url: string;
  description: string | null;
  created_at: string;
}
