-- Drop existing restrictive policies for product-images bucket
DROP POLICY IF EXISTS "Users can upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- Create permissive policies for product-images bucket
-- Since we use Clerk for auth (not Supabase Auth), we allow uploads for anon role
-- App-level auth is handled by Clerk before users reach upload functionality

CREATE POLICY "Allow uploads to product-images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow reading from product-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Allow updates to product-images"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Allow deletes from product-images"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'product-images');