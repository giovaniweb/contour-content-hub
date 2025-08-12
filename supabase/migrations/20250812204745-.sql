-- Secure personal data in public.perfis

-- 0) Helper function to safely check current user's role without RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.perfis WHERE id = auth.uid();
$$;

-- 1) Enable and enforce RLS on perfis
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis FORCE ROW LEVEL SECURITY;

-- 2) Drop existing policies to avoid conflicts
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'perfis'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.perfis', pol.policyname);
  END LOOP;
END$$;

-- 3) Strict, least-privilege policies
-- Users can read only their own profile
CREATE POLICY "Users can view their own profile"
ON public.perfis
FOR SELECT
USING (id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.perfis
FOR SELECT
USING (public.get_current_user_role() IN ('admin','superadmin'));

-- Users can insert their own profile (used during signup flows)
CREATE POLICY "Users can insert their own profile"
ON public.perfis
FOR INSERT
WITH CHECK (id = auth.uid());

-- Admins can insert any profile
CREATE POLICY "Admins can insert any profile"
ON public.perfis
FOR INSERT
WITH CHECK (public.get_current_user_role() IN ('admin','superadmin'));

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.perfis
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON public.perfis
FOR UPDATE
USING (public.get_current_user_role() IN ('admin','superadmin'))
WITH CHECK (public.get_current_user_role() IN ('admin','superadmin'));

-- Only admins can delete profiles
CREATE POLICY "Admins can delete profiles"
ON public.perfis
FOR DELETE
USING (public.get_current_user_role() IN ('admin','superadmin'));

-- 4) Harden table privileges (RLS still enforced)
REVOKE ALL ON TABLE public.perfis FROM anon, authenticated;
-- Allow CRUD for authenticated; RLS decides which rows
GRANT SELECT, INSERT, UPDATE ON TABLE public.perfis TO authenticated;
-- Delete only via admin policy + explicit privilege (optional). Keep disabled for safety.
-- If needed later: GRANT DELETE ON TABLE public.perfis TO authenticated;