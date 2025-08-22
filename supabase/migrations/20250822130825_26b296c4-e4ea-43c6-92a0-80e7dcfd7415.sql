-- CRITICAL SECURITY FIX: Remove public access to gpt_config table with API keys

-- Drop the problematic public read policy that exposes API keys
DROP POLICY IF EXISTS "Public can read gpt_config rows (no secrets)" ON public.gpt_config;
DROP POLICY IF EXISTS "Public can read gpt_config rows" ON public.gpt_config;
DROP POLICY IF EXISTS "Anyone can read gpt_config" ON public.gpt_config;

-- Ensure only admins can access gpt_config table
-- Clean up duplicate policies first
DROP POLICY IF EXISTS "Only admins can read gpt_config" ON public.gpt_config;
DROP POLICY IF EXISTS "Only admins can view gpt config" ON public.gpt_config;
DROP POLICY IF EXISTS "Only admins can manage gpt config" ON public.gpt_config;
DROP POLICY IF EXISTS "Only admins can manage GPT config" ON public.gpt_config;
DROP POLICY IF EXISTS "Only admins can manage gpt_config" ON public.gpt_config;

-- Create single comprehensive admin-only policy
CREATE POLICY "Admin only access to gpt_config"
ON public.gpt_config
FOR ALL
TO authenticated
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

-- Create a safe public view without API keys for non-admin users
DROP VIEW IF EXISTS public.gpt_config_safe;
CREATE VIEW public.gpt_config_safe AS
SELECT 
  id,
  nome,
  tipo,
  modelo,
  prompt,
  ativo,
  data_configuracao,
  'hidden' as chave_api_status -- Show that API key exists but hide the value
FROM public.gpt_config;

-- Grant access to the safe view
GRANT SELECT ON public.gpt_config_safe TO authenticated;
REVOKE ALL ON public.gpt_config_safe FROM anon;

-- Ensure RLS is properly enforced
ALTER TABLE public.gpt_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gpt_config FORCE ROW LEVEL SECURITY;

-- Revoke direct access to the table from non-admin roles
REVOKE ALL ON TABLE public.gpt_config FROM anon, authenticated;
-- Only allow admin access through RLS policies