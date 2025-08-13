-- CRITICAL SECURITY FIXES - Phase 1A
-- Secure OpenAI API Keys

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