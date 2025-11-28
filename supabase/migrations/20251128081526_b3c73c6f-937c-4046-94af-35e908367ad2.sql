-- Create a function to allow users to make themselves admin if no admins exist yet
CREATE OR REPLACE FUNCTION public.create_first_admin(_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if any admins exist
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    -- No admins exist, allow this user to become the first admin
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    -- Admins already exist, raise an error
    RAISE EXCEPTION 'Admin users already exist. Contact an existing admin for permissions.';
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_first_admin TO authenticated;