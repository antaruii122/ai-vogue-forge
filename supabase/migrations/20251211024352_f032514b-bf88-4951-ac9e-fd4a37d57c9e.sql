-- Drop all existing RLS policies on user_generations first
DROP POLICY IF EXISTS "Users can view their own generations" ON public.user_generations;
DROP POLICY IF EXISTS "Users can insert their own generations" ON public.user_generations;
DROP POLICY IF EXISTS "Users can update their own generations" ON public.user_generations;
DROP POLICY IF EXISTS "Users can delete their own generations" ON public.user_generations;