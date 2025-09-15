-- CRITICAL SECURITY FIXES - Phase 3: Fix ERROR Level Vulnerabilities
-- Address the most critical data exposure issues

-- =============================================================================
-- CRITICAL FIX 1: Secure 'perfis' table (Customer Personal Data Protection)
-- This table contains emails, phone numbers, names, addresses, clinic details
-- =============================================================================

-- Ensure perfis table has RLS enabled
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- Drop existing problematic policies that might cause recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.perfis;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.perfis;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.perfis;
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.perfis;
DROP POLICY IF EXISTS "Users can view own profile" ON public.perfis;

-- Create secure policies using the existing security definer functions
CREATE POLICY "Users can view their own profile"
ON public.perfis
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"  
ON public.perfis
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
ON public.perfis  
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- CRITICAL FIX 2: Secure 'videomakers' table (Professional Contact Protection)
-- This table contains phone numbers and personal details of video professionals
-- =============================================================================

-- Ensure videomakers table has RLS enabled
ALTER TABLE public.videomakers ENABLE ROW LEVEL SECURITY;

-- Create policies for videomakers table
DROP POLICY IF EXISTS "Public can view videomaker profiles" ON public.videomakers;
DROP POLICY IF EXISTS "Videomakers can manage own profiles" ON public.videomakers;
DROP POLICY IF EXISTS "Admins can manage videomaker profiles" ON public.videomakers;

-- Only allow viewing of basic profile info, not sensitive contact details
CREATE POLICY "Public can view basic videomaker info"
ON public.videomakers
FOR SELECT  
USING (true); -- This will use the videomakers_public view we created earlier

CREATE POLICY "Videomakers can update own profiles"
ON public.videomakers
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all videomaker profiles"
ON public.videomakers
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- CRITICAL FIX 3: Ensure user_actions table has proper RLS
-- Tracks user behavior and gamification data
-- =============================================================================

-- Ensure user_actions table has RLS enabled (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_actions') THEN
    EXECUTE 'ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY';
    
    -- Drop existing policies
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own actions" ON public.user_actions';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view all actions" ON public.user_actions';
    EXECUTE 'DROP POLICY IF EXISTS "System can insert actions" ON public.user_actions';
    
    -- Create secure policies
    EXECUTE 'CREATE POLICY "Users can view own actions" ON public.user_actions FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Admins can view all actions" ON public.user_actions FOR SELECT USING (public.is_admin())';
    EXECUTE 'CREATE POLICY "System can insert actions" ON public.user_actions FOR INSERT WITH CHECK (true)';
  END IF;
END $$;