-- Fix SECURITY DEFINER view issue by removing security definer from the view
DROP VIEW IF EXISTS public.gpt_config_public;

-- Create a regular view without SECURITY DEFINER
CREATE VIEW public.gpt_config_public AS
SELECT 
  id,
  nome,
  tipo,
  modelo,
  prompt,
  ativo,
  data_configuracao
FROM public.gpt_config;

-- Grant access to the view
GRANT SELECT ON public.gpt_config_public TO anon, authenticated;

-- Fix function search path issues by setting search_path on existing functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.perfis WHERE id = auth.uid();
$function$;