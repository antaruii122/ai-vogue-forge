-- Add explicit DENY policies for UPDATE and DELETE on payment_transactions
-- This ensures only service_role operations can modify/delete payment records

-- Deny all user updates to payment records
CREATE POLICY "Deny user updates to payment_transactions"
ON public.payment_transactions
FOR UPDATE
TO authenticated
USING (false);

-- Deny all user deletions from payment_transactions  
CREATE POLICY "Deny user deletes from payment_transactions"
ON public.payment_transactions
FOR DELETE
TO authenticated
USING (false);