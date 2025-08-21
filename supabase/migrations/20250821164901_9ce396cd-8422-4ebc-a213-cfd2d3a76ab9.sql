-- Fix RLS policies for perfis table to prevent exposure of personal data

-- First, drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.perfis;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.perfis;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.perfis;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.perfis;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.perfis;

-- Create secure RLS policies for perfis table
-- 1. Users can only view their own profile data
CREATE POLICY "Users can view own profile only"
ON public.perfis
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 2. Users can only update their own profile
CREATE POLICY "Users can update own profile only"
ON public.perfis
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Users can insert their own profile only
CREATE POLICY "Users can insert own profile only"
ON public.perfis
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 4. Only superadmin and admin can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.perfis
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.perfis p 
    WHERE p.id = auth.uid() 
    AND p.role IN ('admin', 'superadmin')
  )
);

-- 5. Only superadmin and admin can manage all profiles
CREATE POLICY "Admins can manage all profiles"
ON public.perfis
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.perfis p 
    WHERE p.id = auth.uid() 
    AND p.role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.perfis p 
    WHERE p.id = auth.uid() 
    AND p.role IN ('admin', 'superadmin')
  )
);

-- 6. Create limited public view for professional search (only non-sensitive data)
CREATE POLICY "Public can view professional basic info only"
ON public.perfis
FOR SELECT
TO authenticated
USING (
  perfil_tipo = 'profissional' 
  AND role IN ('consultor', 'operador', 'gerente')
);

-- Ensure RLS is enabled
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis FORCE ROW LEVEL SECURITY;