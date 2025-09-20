-- Fix RLS recursion on public.perfis by replacing recursive policies with safe ones
-- 1) Ensure RLS is enabled
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- 2) Drop ALL existing policies on public.perfis to remove recursive/duplicate rules
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN 
    SELECT polname 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'perfis'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.perfis', pol.polname);
  END LOOP;
END $$;

-- 3) Recreate minimal, safe, non-recursive policies
-- Users: can select/update/insert ONLY their own profile
CREATE POLICY "Users can select own profile"
ON public.perfis
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.perfis
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.perfis
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Admins: can select/update/delete ALL profiles (via SECURITY DEFINER function to avoid recursion)
CREATE POLICY "Admins can select all profiles"
ON public.perfis
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
ON public.perfis
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete any profile"
ON public.perfis
FOR DELETE
USING (public.is_admin());

-- Note: We intentionally avoid querying public.perfis inside policies.
-- We rely on public.is_admin() (SECURITY DEFINER) to prevent recursive RLS evaluation.