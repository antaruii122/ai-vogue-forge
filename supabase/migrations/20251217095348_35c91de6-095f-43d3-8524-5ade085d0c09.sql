-- Make the product-images bucket public so external services (n8n) can access files
UPDATE storage.buckets 
SET public = true 
WHERE id = 'product-images';

-- Also ensure there's a public read policy for the bucket
DROP POLICY IF EXISTS "Public read access for product-images" ON storage.objects;
CREATE POLICY "Public read access for product-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');