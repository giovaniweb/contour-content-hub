-- CRITICAL SECURITY FIX: Secure gpt_config table
-- Remove public read access and ensure only admins can access API keys

-- First, ensure RLS is enabled on gpt_config table
ALTER TABLE public.gpt_config ENABLE ROW LEVEL SECURITY;

-- Drop any existing public read policies on gpt_config
DROP POLICY IF EXISTS "Public can read gpt_config rows" ON public.gpt_config;
DROP POLICY IF EXISTS "Anyone can read gpt_config" ON public.gpt_config;
DROP POLICY IF EXISTS "Public read access to gpt_config" ON public.gpt_config;

-- Create secure admin-only policies for gpt_config
CREATE POLICY "Only admins can read gpt_config"
ON public.gpt_config
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE perfis.id = auth.uid() 
    AND perfis.role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "Only admins can manage gpt_config"
ON public.gpt_config
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE perfis.id = auth.uid() 
    AND perfis.role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE perfis.id = auth.uid() 
    AND perfis.role IN ('admin', 'superadmin')
  )
);

-- Create a secure view for non-admin users that excludes API keys
CREATE OR REPLACE VIEW public.gpt_config_public AS
SELECT 
  id,
  nome,
  tipo,
  modelo,
  prompt,
  ativo,
  data_configuracao
FROM public.gpt_config;

-- Allow public read access to the safe view (without API keys)
ALTER VIEW public.gpt_config_public OWNER TO postgres;
GRANT SELECT ON public.gpt_config_public TO anon, authenticated;