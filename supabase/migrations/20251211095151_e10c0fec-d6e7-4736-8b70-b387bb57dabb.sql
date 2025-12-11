-- Atomic credit deduction function to prevent race conditions
CREATE OR REPLACE FUNCTION deduct_credit_atomic(
  p_user_id TEXT,
  p_credits_needed INT
)
RETURNS TABLE (success BOOLEAN, new_balance INT) AS $$
DECLARE
  current_credits INT;
BEGIN
  -- Lock the row to prevent race conditions
  SELECT credits INTO current_credits
  FROM profiles
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  -- If no profile exists, return failure
  IF current_credits IS NULL THEN
    RETURN QUERY SELECT FALSE, 0;
    RETURN;
  END IF;
  
  -- Check if enough credits
  IF current_credits >= p_credits_needed THEN
    UPDATE profiles
    SET credits = credits - p_credits_needed,
        updated_at = now()
    WHERE user_id = p_user_id
    RETURNING credits INTO current_credits;
    
    RETURN QUERY SELECT TRUE, current_credits;
  ELSE
    RETURN QUERY SELECT FALSE, current_credits;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Atomic credit addition function
CREATE OR REPLACE FUNCTION add_credits_atomic(
  p_user_id TEXT,
  p_credits_to_add INT
)
RETURNS TABLE (new_balance INT) AS $$
BEGIN
  UPDATE profiles
  SET 
    credits = credits + p_credits_to_add,
    total_credits_purchased = total_credits_purchased + p_credits_to_add,
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING credits INTO new_balance;
  
  IF new_balance IS NULL THEN
    -- Profile doesn't exist, create it
    INSERT INTO profiles (user_id, credits, total_credits_purchased)
    VALUES (p_user_id, 3 + p_credits_to_add, p_credits_to_add)
    RETURNING credits INTO new_balance;
  END IF;
  
  RETURN QUERY SELECT new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Atomic credit refund function
CREATE OR REPLACE FUNCTION refund_credit_atomic(
  p_user_id TEXT,
  p_credits_to_refund INT
)
RETURNS TABLE (new_balance INT) AS $$
BEGIN
  UPDATE profiles
  SET credits = credits + p_credits_to_refund,
      updated_at = now()
  WHERE user_id = p_user_id
  RETURNING credits INTO new_balance;
  
  RETURN QUERY SELECT new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;