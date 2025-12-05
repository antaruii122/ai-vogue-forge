-- Drop all public storage policies that allow unauthenticated access

-- product-images bucket - remove public policies
DROP POLICY IF EXISTS "Allow deletes from product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow reading from product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to product-images" ON storage.objects;

-- videos bucket - remove public policies
DROP POLICY IF EXISTS "Anyone can delete videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Public can read videos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Public video access" ON storage.objects;

-- Also remove any other permissive public policies that might exist
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;