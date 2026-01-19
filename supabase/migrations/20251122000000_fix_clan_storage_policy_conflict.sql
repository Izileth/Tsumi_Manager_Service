-- Migration: Resolve RLS policy conflict for storage uploads caused by a broad clan policy.
-- The "Clan members can manage their clan's assets" was a 'FOR ALL' policy, causing its
-- 'WITH CHECK' clause to incorrectly block inserts into other paths like 'posts/'.
-- This migration replaces the single 'FOR ALL' policy with separate, non-conflicting
-- policies for INSERT, UPDATE, and DELETE operations on clan assets.

-- 1. Drop the conflicting 'FOR ALL' policy for clan assets.
DROP POLICY IF EXISTS "Clan members can manage their clan's assets" ON storage.objects;

-- 2. Create a specific policy for INSERTING clan assets.
-- This allows clan members to upload to their clan's folder.
CREATE POLICY "Clan members can insert clan assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'clans' AND
    (SELECT clan_id FROM public.profiles WHERE id = auth.uid()) = ((storage.foldername(name))[2])::uuid
  );

-- 3. Create a specific policy for UPDATING clan assets.
-- This allows clan members to update assets in their clan's folder.
CREATE POLICY "Clan members can update clan assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'clans' AND
    (SELECT clan_id FROM public.profiles WHERE id = auth.uid()) = ((storage.foldername(name))[2])::uuid
  );

-- 4. Create a specific policy for DELETING clan assets.
-- This allows clan members to delete assets from their clan's folder.
CREATE POLICY "Clan members can delete clan assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'clans' AND
    (SELECT clan_id FROM public.profiles WHERE id = auth.uid()) = ((storage.foldername(name))[2])::uuid
  );

-- Note: A public SELECT policy for the 'assets' bucket should already exist.
-- After this change, uploads to 'posts/{user_id}/' will only be checked against the
-- 'Users can upload post images' policy and will no longer conflict with the clan policy.
