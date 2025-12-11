-- Drop foreign key constraint if exists
ALTER TABLE public.user_generations DROP CONSTRAINT IF EXISTS user_generations_user_id_fkey;

-- Change user_id column from UUID to TEXT to support Clerk user IDs
ALTER TABLE public.user_generations 
ALTER COLUMN user_id TYPE text USING user_id::text;

-- Recreate RLS policies for Clerk authentication
CREATE POLICY "Users can view their own generations" 
ON public.user_generations 
FOR SELECT 
USING ((auth.jwt() ->> 'sub'::text) = user_id);

CREATE POLICY "Users can insert their own generations" 
ON public.user_generations 
FOR INSERT 
WITH CHECK ((auth.jwt() ->> 'sub'::text) = user_id);

CREATE POLICY "Users can update their own generations" 
ON public.user_generations 
FOR UPDATE 
USING ((auth.jwt() ->> 'sub'::text) = user_id);

CREATE POLICY "Users can delete their own generations" 
ON public.user_generations 
FOR DELETE 
USING ((auth.jwt() ->> 'sub'::text) = user_id);