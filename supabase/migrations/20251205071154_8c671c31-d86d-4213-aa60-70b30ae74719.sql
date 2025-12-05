-- Fix inconsistent storage policy that uses auth.uid() instead of has_role_clerk()
DROP POLICY IF EXISTS "Admins can update videos" ON storage.objects;

CREATE POLICY "Admins can update videos" ON storage.objects
FOR UPDATE TO public USING (
  bucket_id = 'videos' AND 
  has_role_clerk((auth.jwt() ->> 'sub')::text, 'admin'::app_role)
);