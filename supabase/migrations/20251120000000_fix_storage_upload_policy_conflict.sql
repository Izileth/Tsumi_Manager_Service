-- Migration: Resolve RLS policy conflict for storage uploads (Corrected Syntax).
-- This migration adjusts user-folder asset policies to prevent conflicts with post image uploads.
-- It corrects a syntax error from the previous version by creating separate policies for SELECT, UPDATE, and DELETE.

-- 1. Drop previous policies to ensure a clean slate.
DROP POLICY IF EXISTS "Users can manage their own user-folder assets" ON storage.objects; -- Old faulty policy
DROP POLICY IF EXISTS "Users can select their own user-folder assets" ON storage.objects; -- New policy name
DROP POLICY IF EXISTS "Users can update their own user-folder assets" ON storage.objects; -- New policy name
DROP POLICY IF EXISTS "Users can delete their own user-folder assets" ON storage.objects; -- New policy name


-- 2. Recreate policies for user-specific folder management with correct syntax.

-- 2.1. Policy for SELECT
CREATE POLICY "Users can select their own user-folder assets"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    auth.uid()::text = (storage.foldername(name))[2] AND
    (storage.foldername(name))[1] = 'users'
  );

-- 2.2. Policy for UPDATE
CREATE POLICY "Users can update their own user-folder assets"
  ON storage.objects FOR UPDATE
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

-- 2.3. Policy for DELETE
CREATE POLICY "Users can delete their own user-folder assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    auth.uid()::text = (storage.foldername(name))[2] AND
    (storage.foldername(name))[1] = 'users'
  );

-- Note: The existing "Users can upload post images" policy will now correctly handle
-- inserts into the 'posts/{user_id}' folder without conflict.

