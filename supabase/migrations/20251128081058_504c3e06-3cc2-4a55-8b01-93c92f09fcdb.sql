-- Step 1: Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 2: Make videos bucket private and add RLS policies
UPDATE storage.buckets
SET public = false
WHERE id = 'videos';

-- Allow public read access for landing page display
CREATE POLICY "Public can view videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'videos');

-- Only admins can upload videos
CREATE POLICY "Admins can upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Only admins can update videos
CREATE POLICY "Admins can update videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'videos' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Only admins can delete videos
CREATE POLICY "Admins can delete videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'videos' 
  AND public.has_role(auth.uid(), 'admin')
);