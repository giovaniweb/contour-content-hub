-- Fix academy_invites RLS policies - remove direct access to auth.users table
-- Drop the problematic policies that reference auth.users directly
DROP POLICY IF EXISTS "Users can view their own invites" ON public.academy_invites;
DROP POLICY IF EXISTS "Users can update their own invites" ON public.academy_invites;

-- Create a security definer function to get user email safely
CREATE OR REPLACE FUNCTION public.get_user_email_safe()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT email FROM public.perfis WHERE id = auth.uid();
$$;

-- Create new policies using the safe function and perfis table
-- 1. Users can view invites sent to their email address
CREATE POLICY "Users can view their own invites"
ON public.academy_invites
FOR SELECT 
TO authenticated
USING (
  email = public.get_user_email_safe()
);

-- 2. Users can update only their own invites (for accepting/rejecting)
CREATE POLICY "Users can update their own invites"
ON public.academy_invites
FOR UPDATE
TO authenticated
USING (
  email = public.get_user_email_safe()
)
WITH CHECK (
  email = public.get_user_email_safe()
);