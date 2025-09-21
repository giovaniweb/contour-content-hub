-- SAFE RLS FIX: remove recursive policies and replace with SECURITY DEFINER based checks
-- 1) Drop existing policies on perfis and superusers to avoid conflicts
DO $$
DECLARE r RECORD;
BEGIN
  -- Drop all policies on public.perfis
  FOR r IN (
    SELECT polname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'perfis'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.perfis;', r.polname);
  END LOOP;
  -- Drop all policies on public.superusers
  FOR r IN (
    SELECT polname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'superusers'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.superusers;', r.polname);
  END LOOP;
END $$;

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.superusers ENABLE ROW LEVEL SECURITY;

-- 2) SUPERUSERS policies (no recursion, minimal exposure)
-- Allow authenticated users to read superusers for auth checks (used inside SECURITY DEFINER functions)
CREATE POLICY "Superusers readable for auth checks"
ON public.superusers
FOR SELECT
USING (auth.role() = 'authenticated');

-- Allow admins to manage superusers via secure check
CREATE POLICY "Admins manage superusers"
ON public.superusers
FOR ALL
USING (public.check_user_is_admin())
WITH CHECK (public.check_user_is_admin());

-- 3) PERFIS policies (avoid recursion by using function + row ownership)
-- a) Users can read their own profile
CREATE POLICY "Users can read own profile"
ON public.perfis
FOR SELECT
USING (id = auth.uid());

-- b) Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.perfis
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- c) Admins can read all profiles (secure, non-recursive)
CREATE POLICY "Admins can read all profiles"
ON public.perfis
FOR SELECT
USING (public.check_user_is_admin());

-- d) Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
ON public.perfis
FOR UPDATE
USING (public.check_user_is_admin())
WITH CHECK (public.check_user_is_admin());

-- e) (Optional) Admins can delete profiles (needed for admin user management UIs)
CREATE POLICY "Admins can delete profiles"
ON public.perfis
FOR DELETE
USING (public.check_user_is_admin());
