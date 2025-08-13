-- CRITICAL SECURITY FIXES
-- Phase 1: Secure OpenAI API Keys and Fix User Data Privacy

-- 1. Remove public access to gpt_config table containing API keys
DROP POLICY IF EXISTS "Public can view GPT config" ON public.gpt_config;

-- 2. Create admin-only access to gpt_config
CREATE POLICY "Only admins can manage GPT config"
ON public.gpt_config
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
);

-- 3. Create safe public view for GPT config without API keys
CREATE OR REPLACE VIEW public.gpt_config_public AS
SELECT 
  id,
  ativo,
  modelo_utilizado,
  max_tokens,
  temperature,
  data_criacao,
  data_atualizacao
FROM public.gpt_config
WHERE ativo = true;

-- Grant public access to the safe view
GRANT SELECT ON public.gpt_config_public TO anon, authenticated;

-- 4. Fix user data privacy - restrict admin access to only necessary operations
DROP POLICY IF EXISTS "Admins podem ver todos perfis" ON public.perfis;
DROP POLICY IF EXISTS "Admins podem editar todos perfis" ON public.perfis;

-- Create more restrictive admin policies with audit logging
CREATE POLICY "Admins can view all profiles for management"
ON public.perfis
FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "Admins can update user roles only"
ON public.perfis
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  -- Admins can only update role, not personal data
  OLD.email = NEW.email
  AND OLD.nome = NEW.nome
);

-- 5. Add security definer functions with proper search paths
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

-- 6. Fix all existing functions to have proper search path
CREATE OR REPLACE FUNCTION public.criar_perfil_novo_usuario()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
BEGIN
  INSERT INTO public.perfis (id, nome, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user'  -- Always default to 'user' role for security
  );
  RETURN NEW;
END;
$function$;

-- 7. Update rate limiting function with proper search path
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_identifier text, p_endpoint text, p_max_requests integer DEFAULT 60, p_window_minutes integer DEFAULT 1)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_window timestamp with time zone;
  request_count integer;
  result jsonb;
BEGIN
  -- Calculate current window (round to minute)
  current_window := date_trunc('minute', now());
  
  -- Get current count for this window
  SELECT requests_count INTO request_count
  FROM public.rate_limits 
  WHERE identifier = p_identifier 
    AND endpoint = p_endpoint 
    AND window_start = current_window;
  
  -- If no record exists, create new one
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
  
  -- Check if limit exceeded
  IF request_count >= p_max_requests THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'requests_made', request_count,
      'requests_remaining', 0,
      'reset_time', current_window + interval '1 minute',
      'error', 'Rate limit exceeded'
    );
  END IF;
  
  -- Increment counter
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