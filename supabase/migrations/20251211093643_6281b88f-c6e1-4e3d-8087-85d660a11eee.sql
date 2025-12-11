-- Fix 1: Remove user UPDATE policy on profiles table to prevent credit manipulation
-- Only backend service_role should update credits
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a restrictive UPDATE policy that denies all user updates
-- Backend uses service_role which bypasses RLS, so legitimate credit updates still work
CREATE POLICY "Deny user updates to profiles"
ON public.profiles
FOR UPDATE
USING (false);

-- Fix 2: The payment_transactions UPDATE policy is already correctly set to false
-- Service role bypasses RLS for legitimate backend updates
-- No changes needed for payment_transactions - it's already secure