-- Fix academy_invites RLS policy to prevent email exposure
-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Admins can manage all invites" ON public.academy_invites;

-- Create new secure policies
-- 1. Admins can manage all invites
CREATE POLICY "Admins can manage all invites" 
ON public.academy_invites 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role = 'admin'
  )
);

-- 2. Users can only view invites sent to their email address
CREATE POLICY "Users can view their own invites"
ON public.academy_invites
FOR SELECT 
TO authenticated
USING (
  email = (
    SELECT email FROM auth.users 
    WHERE id = auth.uid()
  )
);

-- 3. Users can update only their own invites (for accepting/rejecting)
CREATE POLICY "Users can update their own invites"
ON public.academy_invites
FOR UPDATE
TO authenticated
USING (
  email = (
    SELECT email FROM auth.users 
    WHERE id = auth.uid()
  )
)
WITH CHECK (
  email = (
    SELECT email FROM auth.users 
    WHERE id = auth.uid()
  )
);