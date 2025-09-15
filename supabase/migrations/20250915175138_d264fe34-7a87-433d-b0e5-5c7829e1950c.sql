-- SECURITY FIX: Address Security Definer View Issue
-- The videomakers_public view bypasses RLS by running with postgres superuser privileges
-- We need to secure this view properly

-- First, let's drop the existing problematic view
DROP VIEW IF EXISTS public.videomakers_public;

-- Instead of a view owned by postgres, we'll create a more secure approach
-- Create a function that respects RLS and user permissions with correct column types
CREATE OR REPLACE FUNCTION public.get_public_videomakers()
RETURNS TABLE (
  id uuid,
  nome_completo text,
  cidade text,
  tipo_profissional professional_type,
  foto_url text,
  valor_diaria investment_range,
  media_avaliacao numeric,
  total_avaliacoes integer,
  created_at timestamp with time zone,
  camera_celular text,
  possui_iluminacao boolean,
  emite_nota_fiscal boolean
)
LANGUAGE sql
SECURITY INVOKER  -- This ensures it runs with the caller's permissions, not the creator's
STABLE
SET search_path = public
AS $$
  SELECT 
    v.id,
    v.nome_completo,
    v.cidade,
    v.tipo_profissional,
    v.foto_url,
    v.valor_diaria,
    v.media_avaliacao,
    v.total_avaliacoes,
    v.created_at,
    v.camera_celular,
    v.possui_iluminacao,
    v.emite_nota_fiscal
  FROM public.videomakers v
  WHERE v.ativo = true
  ORDER BY v.created_at DESC;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.get_public_videomakers() TO authenticated;

-- Revoke from anon to ensure only authenticated users can access
REVOKE EXECUTE ON FUNCTION public.get_public_videomakers() FROM anon;

-- Comment explaining the security approach
COMMENT ON FUNCTION public.get_public_videomakers() IS 
'Secure function to get public videomaker data. Uses SECURITY INVOKER to respect RLS policies and user permissions.';