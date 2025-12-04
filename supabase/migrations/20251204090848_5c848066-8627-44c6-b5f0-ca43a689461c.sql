-- Fix user_roles: Add explicit DENY policies for non-admin INSERT/UPDATE/DELETE
-- This prevents privilege escalation

-- Drop existing admin policy to recreate with proper restrictions
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Admins can do everything
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role_clerk((auth.jwt() ->> 'sub')::text, 'admin'::app_role))
WITH CHECK (public.has_role_clerk((auth.jwt() ->> 'sub')::text, 'admin'::app_role));

-- Explicitly deny INSERT for non-admins (only admins from above policy can insert)
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role_clerk((auth.jwt() ->> 'sub')::text, 'admin'::app_role));

-- Explicitly deny UPDATE for non-admins
CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role_clerk((auth.jwt() ->> 'sub')::text, 'admin'::app_role));

-- Explicitly deny DELETE for non-admins  
CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role_clerk((auth.jwt() ->> 'sub')::text, 'admin'::app_role));