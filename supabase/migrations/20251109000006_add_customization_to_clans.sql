-- supabase/migrations/20251109000006_add_customization_to_clans.sql

ALTER TABLE public.clans
ADD COLUMN banner_url text,
ADD COLUMN avatar_url text,
ADD COLUMN tag text,
ADD COLUMN emblem text;

-- Add check constraints for the new fields
-- Tag should be short, e.g., 2-5 alphanumeric characters
ALTER TABLE public.clans
ADD CONSTRAINT tag_length CHECK (tag IS NULL OR (char_length(tag) >= 2 AND char_length(tag) <= 5)),
ADD CONSTRAINT tag_format CHECK (tag IS NULL OR tag ~* '^[A-Z0-9]+$'); -- Allow uppercase letters and numbers

-- Emblem could be a single emoji/character or a short string
ALTER TABLE public.clans
ADD CONSTRAINT emblem_length CHECK (emblem IS NULL OR char_length(emblem) <= 5);

-- Add comments for documentation
COMMENT ON COLUMN public.clans.banner_url IS 'URL for the clan''s banner image.';
COMMENT ON COLUMN public.clans.avatar_url IS 'URL for the clan''s avatar image.';
COMMENT ON COLUMN public.clans.tag IS 'A short tag or abbreviation for the clan (e.g., [TAG]).';
COMMENT ON COLUMN public.clans.emblem IS 'A single emoji or short text used as the clan''s emblem.';
