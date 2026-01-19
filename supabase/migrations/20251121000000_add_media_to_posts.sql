-- Migration to add columns for storing media URLs in the posts table.

ALTER TABLE public.posts
ADD COLUMN images TEXT[],
ADD COLUMN videos TEXT[];

COMMENT ON COLUMN public.posts.images IS 'Array of URLs for images associated with the post.';
COMMENT ON COLUMN public.posts.videos IS 'Array of URLs for videos associated with the post.';
