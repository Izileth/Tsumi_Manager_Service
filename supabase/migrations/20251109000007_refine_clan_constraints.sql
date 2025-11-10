-- Drop the existing case-sensitive unique constraint on the clan name.
ALTER TABLE public.clans
DROP CONSTRAINT clans_name_key;

-- Create a new case-insensitive unique index on the clan name.
-- This prevents creating clans with names that only differ in case (e.g., 'MyClan' and 'myclan').
CREATE UNIQUE INDEX clans_name_case_insensitive_unique_idx
ON public.clans (LOWER(name));

-- Note: The 'tag_format' error is best fixed in the application code
-- by ensuring that an empty string for the tag is sent as NULL to the database,
-- as the database correctly enforces that tags must have a length of 2-5 characters if they are not NULL.
