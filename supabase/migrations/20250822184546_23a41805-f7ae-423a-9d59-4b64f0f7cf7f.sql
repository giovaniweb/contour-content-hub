-- Fix critical security vulnerability: Restrict perfis table access to protect customer personal data
-- Drop any overly permissive policies that allow public access to sensitive customer data
DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.perfis;
DROP POLICY IF EXISTS "Public can read profiles" ON public.perfis;
DROP POLICY IF EXISTS "Anyone can read profiles" ON public.perfis;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.perfis;

-- Create secure policies: Users can only access their own profile data
CREATE POLICY "Users can view own profile only" 
ON public.perfis 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile only" 
ON public.perfis 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admin users can manage all profiles for legitimate business purposes
CREATE POLICY "Admins can manage all profiles" 
ON public.perfis 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM public.perfis admin_check
    WHERE admin_check.id = auth.uid() 
    AND admin_check.role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.perfis admin_check
    WHERE admin_check.id = auth.uid() 
    AND admin_check.role IN ('admin', 'superadmin')
  )
);

-- Ensure RLS is properly enabled and enforced
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis FORCE ROW LEVEL SECURITY;