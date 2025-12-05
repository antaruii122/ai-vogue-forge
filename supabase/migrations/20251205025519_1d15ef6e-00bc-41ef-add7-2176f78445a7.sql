-- Remove all existing public storage policies from product-images bucket
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Public read for product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload to product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete product images" ON storage.objects;

-- Remove all existing policies from videos bucket
DROP POLICY IF EXISTS "Public read for videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload to videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete from videos" ON storage.objects;

-- Storage buckets will now be accessed ONLY through edge functions using service_role key
-- No direct client access allowed - all operations go through authenticated edge functions