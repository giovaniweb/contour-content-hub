-- Critical Security Fix: Resolve infinite recursion and permission issues
-- This migration fixes the most critical security issues identified

-- 1. Drop all existing problematic policies on perfis table to resolve infinite recursion
DROP POLICY IF EXISTS "Users can read own profile" ON public.perfis;
DROP POLICY IF EXISTS "Users can update own profile" ON public.perfis;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.perfis;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.perfis;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.perfis;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.perfis;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.perfis;

-- 2. Create security definer functions to safely access user data without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.perfis WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  );
$$;

-- 3. Create safe RLS policies using security definer functions
CREATE POLICY "Users can read own profile safely" 
ON public.perfis 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile safely" 
ON public.perfis 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles safely" 
ON public.perfis 
FOR ALL 
USING (public.is_current_user_admin());

-- 4. Fix gpt_config table permissions (also showing permission denied errors)
CREATE POLICY "Admins can manage gpt config" 
ON public.gpt_config 
FOR ALL 
USING (public.is_current_user_admin());

-- 5. Ensure perfis table has RLS enabled
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- 6. Add rate limiting for authentication attempts to prevent brute force
INSERT INTO public.rate_limits (identifier, endpoint, requests_count, window_start)
VALUES ('auth_limit', '/auth/v1/token', 0, now())
ON CONFLICT (identifier, endpoint, window_start) DO NOTHING;

-- 7. Create audit trigger for sensitive profile changes
CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log admin role changes
  IF OLD.role != NEW.role AND NEW.role IN ('admin', 'superadmin') THEN
    INSERT INTO public.audit_log (table_name, operation, old_data, new_data, user_id)
    VALUES ('perfis', 'ROLE_ELEVATION', 
            jsonb_build_object('old_role', OLD.role),
            jsonb_build_object('new_role', NEW.role),
            auth.uid());
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER profile_audit_trigger
  AFTER UPDATE ON public.perfis
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_profile_changes();

-- 8. Strengthen business intelligence data protection
CREATE POLICY "Only admins can view AI usage metrics" 
ON public.ai_usage_metrics 
FOR SELECT 
USING (public.is_current_user_admin());

CREATE POLICY "Only admins can view purchase scores" 
ON public.user_purchase_scores 
FOR SELECT 
USING (public.is_current_user_admin());

-- 9. Add data access logging for sensitive tables
CREATE OR REPLACE FUNCTION public.log_sensitive_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.data_access_audit (
    user_id, table_name, access_type, accessed_at
  ) VALUES (
    auth.uid(), TG_TABLE_NAME, 'SELECT', now()
  );
  RETURN NULL;
END;
$$;

-- Apply access logging to sensitive business data
CREATE TRIGGER ai_usage_access_log
  AFTER SELECT ON public.ai_usage_metrics
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.log_sensitive_access();

CREATE TRIGGER purchase_scores_access_log
  AFTER SELECT ON public.user_purchase_scores
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.log_sensitive_access();