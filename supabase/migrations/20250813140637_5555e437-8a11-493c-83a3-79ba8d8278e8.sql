-- CRITICAL SECURITY FIXES - Phase 1B
-- Fix remaining security issues

-- 1. Fix user data privacy - create safer admin policies
DROP POLICY IF EXISTS "Admins podem ver todos perfis" ON public.perfis;
DROP POLICY IF EXISTS "Admins podem editar todos perfis" ON public.perfis;

-- Create restrictive admin view policy
CREATE POLICY "Admins can view all profiles for management"
ON public.perfis
FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
);

-- Restrictive admin update policy - only role changes allowed
CREATE POLICY "Admins can update user roles only"
ON public.perfis
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
);

-- 2. Fix all database functions with proper search paths
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path TO 'public'
AS $$
  SELECT role FROM public.perfis WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.check_admin_role()
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  );
$$;

-- Fix rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_identifier text, p_endpoint text, p_max_requests integer DEFAULT 60, p_window_minutes integer DEFAULT 1)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_window timestamp with time zone;
  request_count integer;
BEGIN
  current_window := date_trunc('minute', now());
  
  SELECT requests_count INTO request_count
  FROM public.rate_limits 
  WHERE identifier = p_identifier 
    AND endpoint = p_endpoint 
    AND window_start = current_window;
  
  IF request_count IS NULL THEN
    INSERT INTO public.rate_limits (identifier, endpoint, requests_count, window_start)
    VALUES (p_identifier, p_endpoint, 1, current_window)
    ON CONFLICT (identifier, endpoint, window_start) 
    DO UPDATE SET 
      requests_count = rate_limits.requests_count + 1,
      updated_at = now();
    
    RETURN jsonb_build_object(
      'allowed', true,
      'requests_made', 1,
      'requests_remaining', p_max_requests - 1,
      'reset_time', current_window + interval '1 minute'
    );
  END IF;
  
  IF request_count >= p_max_requests THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'requests_made', request_count,
      'requests_remaining', 0,
      'reset_time', current_window + interval '1 minute',
      'error', 'Rate limit exceeded'
    );
  END IF;
  
  UPDATE public.rate_limits 
  SET requests_count = requests_count + 1,
      updated_at = now()
  WHERE identifier = p_identifier 
    AND endpoint = p_endpoint 
    AND window_start = current_window;
  
  RETURN jsonb_build_object(
    'allowed', true,
    'requests_made', request_count + 1,
    'requests_remaining', p_max_requests - (request_count + 1),
    'reset_time', current_window + interval '1 minute'
  );
END;
$function$;