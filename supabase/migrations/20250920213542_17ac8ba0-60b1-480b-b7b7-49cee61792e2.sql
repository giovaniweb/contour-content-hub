-- Ensure RLS is enabled on perfis table and users can read their own profile
-- This is critical for the admin menu to work properly

-- First, check if RLS is enabled (this should already be the case)
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- Ensure there's a policy allowing users to read their own profile
-- Drop existing conflicting policies if any and recreate a clear one
DROP POLICY IF EXISTS "Users can view their own profile" ON public.perfis;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.perfis;

-- Create a clear policy for users to select their own profile data
CREATE POLICY "Users can read their own profile"
ON public.perfis
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Ensure admins can read all profiles (for admin functions)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.perfis;
CREATE POLICY "Admins can view all profiles"
ON public.perfis
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
);