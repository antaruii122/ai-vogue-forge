-- =====================================================
-- SECURITY FIX: Update RLS policies to use Clerk JWT
-- =====================================================
-- Clerk JWT stores the user ID in the 'sub' claim, accessed via:
-- (auth.jwt() ->> 'sub')::text
-- This replaces auth.uid() which only works with Supabase Auth

-- =====================================================
-- FIX user_generations TABLE RLS POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own generations" ON public.user_generations;
DROP POLICY IF EXISTS "Users can insert their own generations" ON public.user_generations;
DROP POLICY IF EXISTS "Users can update their own generations" ON public.user_generations;
DROP POLICY IF EXISTS "Users can delete their own generations" ON public.user_generations;

-- Recreate policies using Clerk JWT sub claim
CREATE POLICY "Users can view their own generations"
ON public.user_generations
FOR SELECT
USING ((auth.jwt() ->> 'sub')::text = user_id::text);

CREATE POLICY "Users can insert their own generations"
ON public.user_generations
FOR INSERT
WITH CHECK ((auth.jwt() ->> 'sub')::text = user_id::text);

CREATE POLICY "Users can update their own generations"
ON public.user_generations
FOR UPDATE
USING ((auth.jwt() ->> 'sub')::text = user_id::text);

CREATE POLICY "Users can delete their own generations"
ON public.user_generations
FOR DELETE
USING ((auth.jwt() ->> 'sub')::text = user_id::text);

-- =====================================================
-- FIX user_roles TABLE RLS POLICIES  
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Create helper function to check admin role using Clerk JWT
CREATE OR REPLACE FUNCTION public.has_role_clerk(_user_id text, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id::text = _user_id
      AND role = _role
  )
$$;

-- Recreate policies using Clerk JWT
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING ((auth.jwt() ->> 'sub')::text = user_id::text);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role_clerk((auth.jwt() ->> 'sub')::text, 'admin'::app_role));

-- =====================================================
-- FIX STORAGE BUCKET POLICIES (storage.objects table)
-- =====================================================

-- Remove all existing policies from product-images bucket
DROP POLICY IF EXISTS "allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "allow public read" ON storage.objects;
DROP POLICY IF EXISTS "allow public delete" ON storage.objects;
DROP POLICY IF EXISTS "allow public update" ON storage.objects;
DROP POLICY IF EXISTS "Public can read product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read own product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload own product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete own product images" ON storage.objects;

-- Create secure policies for product-images bucket using Clerk JWT
-- Users can only access files in their own folder (userId/uploads or userId/generated)

CREATE POLICY "Authenticated users can read own product images"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'product-images' 
  AND (auth.jwt() ->> 'sub')::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can upload own product images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND (auth.jwt() ->> 'sub')::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can update own product images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND (auth.jwt() ->> 'sub')::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can delete own product images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND (auth.jwt() ->> 'sub')::text = (storage.foldername(name))[1]
);

-- =====================================================
-- FIX VIDEOS BUCKET POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Public can read videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete videos" ON storage.objects;

-- Allow anyone to read videos (public content)
CREATE POLICY "Public can read videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'videos');

-- Only admins can upload videos
CREATE POLICY "Admins can upload videos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'videos' 
  AND public.has_role_clerk((auth.jwt() ->> 'sub')::text, 'admin'::app_role)
);

-- Only admins can delete videos
CREATE POLICY "Admins can delete videos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'videos' 
  AND public.has_role_clerk((auth.jwt() ->> 'sub')::text, 'admin'::app_role)
);