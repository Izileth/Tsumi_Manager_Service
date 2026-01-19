// app/lib/types.ts
export type Clan = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  banner_url?: string | null;
  avatar_url?: string | null;
  tag?: string | null;
  emblem?: string | null;
  power?: number;
  reputation?: number;
  profiles: {
    username: string;
  } | null;
};

export type Profile = {
  id: string;
  updated_at: string;
  username: string;
  avatar_url: string | null;
  website: string | null;
  clan_id?: string | null;
  posts?: Post[]; // User's posts
  // from joins
  clans: Clan | null;
  // other fields from profile screen
  bio?: string | null;
  slug?: string | null;
  github?: string | null;
  twitter?: string | null;
  banner_url?: string | null;
  rank_jp?: string;
  rank?: string;
  level?: number;
  website_url?: string | null;
  github_handle?: string | null;
  twitter_handle?: string | null;
  discord_handle?: string | null;
  experience?: number;
  level_name?: string;
  level_name_jp?: string;
  joined_date?: string;
  username_jp?: string;
};

export type PostReaction = {
  id: number;
  post_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
  profiles: Pick<Profile, 'username' | 'avatar_url' | 'slug'>;
};

export type Hashtag = {
  id: number;
  tag: string;
};

export type PostComment = {
  id: number;
  content: string;
  post_id: string;
  user_id: string;
  parent_comment_id: number | null;
  created_at: string;
  profiles: Pick<Profile, 'id' | 'username' | 'avatar_url' | 'slug'>;
};

export type Post = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string | null;
  content: any; // JSONB
  created_at: string;
  profiles: Pick<Profile, 'id' | 'username' | 'avatar_url' | 'slug'>;
  post_reactions: PostReaction[];
  post_comments: PostComment[];
  images?: string[]; // Array of image URLs
  videos?: string[]; // Array of video URLs
  hashtags: { tag: string }[];
};

export type Territory = {
  id: string;
  clan_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  district_id: string | null;
};

export type Mission = {
  id: string;
  territory_id: string;
  name: string;
  description: string | null;
  reward: any; // JSONB
  created_at: string;
  updated_at: string;
  level: string;
};

export type District = {
  id: string;
  name: string;
  map_coordinates: { x: number; y: number };
  created_at: string;
};

export type GameEvent = {
  id: number;
  event_type: string;
  description: string;
  clan_id: string | null;
  territory_id: string | null;
  metadata: any; // JSONB
  created_at: string;
};

export type ClanEvent = {
  id: number;
  clan_id: string;
  event_type: string;
  description: string;
  metadata: any; // JSONB
  created_at: string;
};
