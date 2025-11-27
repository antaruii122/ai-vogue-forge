-- Remove conflicting public policies on product-images bucket
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;