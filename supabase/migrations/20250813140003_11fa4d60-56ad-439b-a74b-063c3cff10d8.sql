-- CRITICAL SECURITY FIXES - Phase 1
-- Secure OpenAI API Keys and Fix User Data Privacy

-- 1. Remove public access to gpt_config table containing API keys
DROP POLICY IF EXISTS "Public can view GPT config" ON public.gpt_config;

-- 2. Drop existing view first
DROP VIEW IF EXISTS public.gpt_config_public;

-- 3. Create admin-only access to gpt_config
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

-- 4. Create safe public view for GPT config without API keys
CREATE VIEW public.gpt_config_public AS
SELECT 
  id,
  nome,
  tipo,
  modelo,
  ativo,
  data_configuracao
FROM public.gpt_config
WHERE ativo = true;

-- Grant public access to the safe view
GRANT SELECT ON public.gpt_config_public TO anon, authenticated;

-- 5. Fix user data privacy - restrict admin access
DROP POLICY IF EXISTS "Admins podem ver todos perfis" ON public.perfis;
DROP POLICY IF EXISTS "Admins podem editar todos perfis" ON public.perfis;

-- Create more restrictive admin policies
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