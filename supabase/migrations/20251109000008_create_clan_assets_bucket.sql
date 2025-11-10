-- Insert the new 'clan-assets' bucket into the storage.
-- This bucket will be used to store clan avatars and banners.
-- Set it to public so that image URLs can be accessed without a token.
INSERT INTO storage.buckets (id, name, public)
VALUES ('clan-assets', 'clan-assets', true);

-- Create a policy that allows authenticated users to view all files in the 'clan-assets' bucket.
-- This is necessary for the app to display the images.
CREATE POLICY "Authenticated users can view clan assets"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'clan-assets');

-- Create a policy that allows authenticated users to upload files to the 'clan-assets' bucket.
-- The logic in the useClanManagement hook will handle who can upload to which folder (based on clan ownership).
CREATE POLICY "Authenticated users can upload clan assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'clan-assets');

-- Create a policy that allows authenticated users to update their own clan's assets.
-- The path is checked to ensure users can only update files within a folder corresponding to their clan ID,
-- and only if they are the owner of that clan.
CREATE POLICY "Clan owners can update their own assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'clan-assets' AND
  auth.uid() = (
    SELECT owner_id FROM public.clans WHERE id = (storage.foldername(name))[1]::uuid
  )
);

-- Create a policy that allows authenticated users to delete their own clan's assets.
-- Similar to the update policy, this ensures only clan owners can delete files.
CREATE POLICY "Clan owners can delete their own assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'clan-assets' AND
  auth.uid() = (
    SELECT owner_id FROM public.clans WHERE id = (storage.foldername(name))[1]::uuid
  )
);
