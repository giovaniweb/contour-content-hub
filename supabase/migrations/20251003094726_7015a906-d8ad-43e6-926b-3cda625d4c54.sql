-- ============================================
-- MIGRATION: Corrigir Sistema de Permissões (v3 - todos os casts corretos)
-- ============================================

-- 1. Popular permissões para TODOS os usuários que não têm
INSERT INTO public.user_feature_permissions (user_id, feature, enabled, status, expires_at)
SELECT 
  p.id as user_id,
  f.feature::app_feature,
  f.is_default as enabled,
  CASE WHEN f.is_default THEN 'released'::feature_status ELSE 'blocked'::feature_status END as status,
  NULL as expires_at
FROM public.perfis p
CROSS JOIN (
  VALUES 
    ('videos', true),
    ('fotos', true),
    ('artes', true),
    ('mestre_beleza', false),
    ('consultor_mkt', false),
    ('fluida_roteirista', false),
    ('artigos_cientificos', false),
    ('academia', false),
    ('equipamentos', false),
    ('fotos_antes_depois', false),
    ('reports', false),
    ('planner', false),
    ('ideas', false)
) AS f(feature, is_default)
WHERE NOT EXISTS (
  SELECT 1 
  FROM public.user_feature_permissions ufp 
  WHERE ufp.user_id = p.id AND ufp.feature = f.feature::app_feature
)
ON CONFLICT (user_id, feature) DO NOTHING;

-- 2. Atualizar o trigger para garantir inicialização correta
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public, auth
AS $$
BEGIN
  -- Insert new profile with ALL available data from metadata
  INSERT INTO public.perfis (
    id, nome, email, role, telefone, cidade, clinica, especialidade, estado, 
    endereco_completo, equipamentos, observacoes_conteudo, idioma, data_criacao
  ) VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'nome',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'cliente'),
    NEW.raw_user_meta_data->>'telefone',
    NEW.raw_user_meta_data->>'cidade',
    NEW.raw_user_meta_data->>'clinica',
    NEW.raw_user_meta_data->>'especialidade',
    NEW.raw_user_meta_data->>'estado',
    NEW.raw_user_meta_data->>'endereco_completo',
    CASE
      WHEN (NEW.raw_user_meta_data ? 'equipamentos') AND jsonb_typeof(NEW.raw_user_meta_data->'equipamentos') = 'array'
        THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'equipamentos'))
      WHEN (NEW.raw_user_meta_data ? 'equipamentos') AND jsonb_typeof(NEW.raw_user_meta_data->'equipamentos') = 'string'
        THEN string_to_array(NEW.raw_user_meta_data->>'equipamentos', ',')
      ELSE NULL
    END,
    NEW.raw_user_meta_data->>'observacoes_conteudo',
    COALESCE(NEW.raw_user_meta_data->>'idioma', 'PT'),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Grant ALL feature permissions (default ones as 'released', others as 'blocked')
  INSERT INTO public.user_feature_permissions (user_id, feature, enabled, status, expires_at)
  VALUES 
    (NEW.id, 'videos'::app_feature, true, 'released'::feature_status, NULL),
    (NEW.id, 'fotos'::app_feature, true, 'released'::feature_status, NULL),
    (NEW.id, 'artes'::app_feature, true, 'released'::feature_status, NULL),
    (NEW.id, 'mestre_beleza'::app_feature, false, 'blocked'::feature_status, NULL),
    (NEW.id, 'consultor_mkt'::app_feature, false, 'blocked'::feature_status, NULL), 
    (NEW.id, 'fluida_roteirista'::app_feature, false, 'blocked'::feature_status, NULL),
    (NEW.id, 'artigos_cientificos'::app_feature, false, 'blocked'::feature_status, NULL),
    (NEW.id, 'academia'::app_feature, false, 'blocked'::feature_status, NULL),
    (NEW.id, 'equipamentos'::app_feature, false, 'blocked'::feature_status, NULL),
    (NEW.id, 'fotos_antes_depois'::app_feature, false, 'blocked'::feature_status, NULL),
    (NEW.id, 'reports'::app_feature, false, 'blocked'::feature_status, NULL),
    (NEW.id, 'planner'::app_feature, false, 'blocked'::feature_status, NULL),
    (NEW.id, 'ideas'::app_feature, false, 'blocked'::feature_status, NULL)
  ON CONFLICT (user_id, feature) DO NOTHING;

  -- Initialize user gamification
  INSERT INTO public.user_gamification (user_id, xp_total)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Initialize user usage tracking
  INSERT INTO public.user_usage (user_id, plan_id, ai_generations_used)
  VALUES (
    NEW.id,
    (SELECT id FROM public.subscription_plans WHERE name = 'Free' LIMIT 1),
    0
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 3. Adicionar índice para melhorar performance de queries de permissão
CREATE INDEX IF NOT EXISTS idx_user_feature_permissions_lookup 
ON public.user_feature_permissions(user_id, feature, status);

-- 4. Adicionar comentário para documentação
COMMENT ON FUNCTION public.handle_new_user_signup() IS 
'Trigger function que inicializa perfil, permissões, gamificação e usage tracking para novos usuários. 
Garante que TODOS os usuários têm permissões básicas (videos, fotos, artes) liberadas por padrão.';