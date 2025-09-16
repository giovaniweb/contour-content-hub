-- Fix infinite recursion in perfis table RLS policies
-- Drop all existing problematic policies and create simple, non-recursive ones

-- Drop all existing policies on perfis table to avoid recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.perfis;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.perfis;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.perfis;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.perfis;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.perfis;
DROP POLICY IF EXISTS "Usuários podem editar seus próprios perfis" ON public.perfis;
DROP POLICY IF EXISTS "Apenas administradores podem ver todos os perfis" ON public.perfis;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.perfis;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.perfis;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.perfis;

-- Create simple, non-recursive policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.perfis
FOR SELECT
USING (auth.uid() = id::uuid);

-- Users can update their own profile  
CREATE POLICY "Users can update own profile"
ON public.perfis
FOR UPDATE
USING (auth.uid() = id::uuid);

-- Users can insert their own profile (for new registrations)
CREATE POLICY "Users can insert own profile"
ON public.perfis
FOR INSERT
WITH CHECK (auth.uid() = id::uuid);

-- System can create profiles (for the trigger)
CREATE POLICY "System can create profiles"
ON public.perfis
FOR INSERT
WITH CHECK (true);

-- Note: We'll handle admin access through the security definer functions
-- instead of RLS policies to avoid recursion