-- Recriar a view gpt_config_public sem permissões amplas
DROP VIEW IF EXISTS public.gpt_config_public;

-- Recriar view sem SECURITY DEFINER
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

-- Garantir permissões adequadas (não amplas)
REVOKE ALL ON public.gpt_config_public FROM anon, authenticated, service_role;
GRANT SELECT ON public.gpt_config_public TO authenticated;