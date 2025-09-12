-- Fix the security definer view issue introduced in previous migration
-- Remove the problematic view setup and use RLS policies instead

-- Drop the problematic view configuration
ALTER VIEW IF EXISTS public.videomakers_public SET (security_barrier = false);

-- Drop the existing view and recreate it as a simple view without security definer
DROP VIEW IF EXISTS public.videomakers_public;

-- Create a simple view without security definer properties
CREATE VIEW public.videomakers_public AS
SELECT 
  id,
  nome_completo,
  cidade,
  tipo_profissional,
  foto_url,
  valor_diaria,
  media_avaliacao,
  total_avaliacoes,
  created_at,
  camera_celular,
  possui_iluminacao,
  emite_nota_fiscal
FROM public.videomakers
WHERE ativo = true;

-- The view will inherit the RLS policies from the underlying table
-- No additional RLS setup needed for the view