-- Allow read access to profiles for all authenticated users
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON public.profiles;

-- Add new policies
CREATE POLICY "Allow authenticated users to read profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own profile."
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Create the function to get profile by slug
DROP FUNCTION IF EXISTS get_profile_by_slug(text);
CREATE OR REPLACE FUNCTION get_profile_by_slug(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  updated_at TIMESTAMPTZ,
  username TEXT,
  avatar_url TEXT,
  website TEXT,
  clan_id UUID,
  bio TEXT,
  slug TEXT,
  github TEXT,
  twitter TEXT,
  banner_url TEXT,
  rank_jp TEXT,
  rank TEXT,
  level INT,
  experience INT,
  level_name TEXT,
  level_name_jp TEXT,
  joined_date TIMESTAMPTZ,
  username_jp TEXT,
  clans JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.updated_at,
    p.username,
    p.avatar_url,
    p.website,
    p.clan_id,
    p.bio,
    p.slug,
    p.github,
    p.twitter,
    p.banner_url,
    p.rank_jp,
    p.rank,
    p.level,
    p.experience,
    p.level_name,
    p.level_name_jp,
    p.joined_date,
    p.username_jp,
    (
      SELECT json_build_object(
        'id', c.id,
        'name', c.name,
        'description', c.description,
        'owner_id', c.owner_id,
        'created_at', c.created_at,
        'banner_url', c.banner_url,
        'avatar_url', c.avatar_url,
        'tag', c.tag,
        'emblem', c.emblem,
        'power', c.power,
        'reputation', c.reputation
      )
      FROM clans c
      WHERE c.id = p.clan_id
    ) as clans
  FROM
    profiles p
  WHERE
    p.slug = p_slug;
END;
$$ LANGUAGE plpgsql;
