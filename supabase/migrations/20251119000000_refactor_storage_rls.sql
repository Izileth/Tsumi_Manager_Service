-- Migration: Fix conflicting storage RLS policies for the 'assets' bucket.
-- The previous 'FOR ALL' policies had 'WITH CHECK' clauses that conflicted
-- with each other, preventing inserts into new folders like 'posts/'.
-- This migration drops the old policies and recreates them with non-conflicting
-- logic, while also adding a more secure policy for post images.

-- 1. Drop all previous conflicting policies on storage.objects for the assets bucket.
DROP POLICY IF EXISTS "Users can manage their own assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can manage their own user-folder assets" ON storage.objects; -- In case old name exists
DROP POLICY IF EXISTS "Clan members can manage their clan's assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload post images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to manage their own post images" ON storage.objects; -- from the faulty migration
DROP POLICY IF EXISTS "Allow users to update their own post images" ON storage.objects; -- from my manual fix
DROP POLICY IF EXISTS "Allow users to delete their own post images" ON storage.objects; -- from my manual fix


-- 2. Recreate the policy for user-specific folders ('users/USER_ID/*')
-- This policy allows users full control over files in their own folder.
CREATE POLICY "Users can manage their own user-folder assets"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    auth.uid()::text = (storage.foldername(name))[2] AND
    (storage.foldername(name))[1] = 'users'
  )
  WITH CHECK (
    bucket_id = 'assets' AND
    auth.uid()::text = (storage.foldername(name))[2] AND
    (storage.foldername(name))[1] = 'users'
  );


-- 3. Recreate the policy for clan-specific folders ('clans/CLAN_ID/*')
-- This policy allows clan members to manage assets in their clan's folder.
CREATE POLICY "Clan members can manage their clan's assets"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    (SELECT clan_id FROM public.profiles WHERE id = auth.uid()) = ((storage.foldername(name))[2])::uuid AND
    (storage.foldername(name))[1] = 'clans'
  )
  WITH CHECK (
    bucket_id = 'assets' AND
    (SELECT clan_id FROM public.profiles WHERE id = auth.uid()) = ((storage.foldername(name))[2])::uuid AND
    (storage.foldername(name))[1] = 'clans'
  );

-- 4. Create a new, correct set of policies for post images ('posts/USER_ID/*')

-- 4.1. Allow any authenticated user to INSERT into their own post folder.
CREATE POLICY "Users can upload post images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'assets' AND
    auth.uid()::text = (storage.foldername(name))[2] AND -- user can only upload to their own folder
    (storage.foldername(name))[1] = 'posts'
  );

-- 4.2. Allow public, unauthenticated read access to all images in the 'posts' folder.
CREATE POLICY "Allow public read access to post images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'posts'
  );

-- 4.3. Allow users to UPDATE images within their own 'posts' subfolder.
CREATE POLICY "Users can update their own post images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    auth.uid()::text = (storage.foldername(name))[2] AND
    (storage.foldername(name))[1] = 'posts'
  );

-- 4.4. Allow users to DELETE images within their own 'posts' subfolder.
CREATE POLICY "Users can delete their own post images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    auth.uid()::text = (storage.foldername(name))[2] AND
    (storage.foldername(name))[1] = 'posts'
  );
