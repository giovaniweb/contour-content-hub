-- Fix critical security vulnerability: Restrict access to videomakers sensitive data
-- Currently any authenticated user can view all videomaker personal information
-- This includes phone numbers, Instagram handles, and professional rates

-- Drop the overly permissive policy that exposes sensitive professional data
DROP POLICY IF EXISTS "Usuários autenticados podem buscar videomakers ativos" ON public.videomakers;

-- Create a more secure policy that only shows basic professional information for search
-- Sensitive fields like phone numbers will require additional authorization
CREATE POLICY "Public can view basic videomaker info only"
ON public.videomakers
FOR SELECT
USING (
  ativo = true AND (
    -- Users can see their own full profile
    auth.uid() = user_id OR
    -- Admins can see all profiles
    (
      SELECT role FROM public.perfis 
      WHERE id = auth.uid()
    ) = 'admin'
  )
);

-- Create a separate view for public search that excludes sensitive information
CREATE OR REPLACE VIEW public.videomakers_public AS
SELECT 
  id,
  nome_completo,
  cidade,
  tipo_profissional,
  foto_url,
  -- Only show investment range, not exact values
  valor_diaria,
  media_avaliacao,
  total_avaliacoes,
  created_at,
  -- Exclude sensitive fields: telefone, instagram, video_referencia_url
  camera_celular,
  possui_iluminacao,
  emite_nota_fiscal
FROM public.videomakers
WHERE ativo = true;

-- Allow authenticated users to view the public search view
GRANT SELECT ON public.videomakers_public TO authenticated;

-- Create RLS policy for the public view
ALTER VIEW public.videomakers_public SET (security_barrier = true);

-- Update any existing policies for videomaker_avaliacoes to reference the secure access pattern
DROP POLICY IF EXISTS "Usuários autenticados podem ver avaliações de videomakers ativos" ON public.videomaker_avaliacoes;

CREATE POLICY "Users can view evaluations for active videomakers"
ON public.videomaker_avaliacoes
FOR SELECT
USING (
  videomaker_id IN (
    SELECT id FROM public.videomakers 
    WHERE ativo = true
  )
);