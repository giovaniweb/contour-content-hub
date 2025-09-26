-- Corrigir o trigger handle_new_user_signup para processar corretamente os equipamentos e role
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert new profile with ALL available data from metadata
  INSERT INTO public.perfis (
    id, 
    nome, 
    email, 
    role,
    telefone,
    cidade,
    clinica,
    especialidade,
    estado,
    endereco_completo,
    equipamentos,
    observacoes_conteudo,
    idioma,
    data_criacao
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
      -- Se equipamentos é um JSON array stringificado, fazer parse
      WHEN NEW.raw_user_meta_data->>'equipamentos' IS NOT NULL AND NEW.raw_user_meta_data->>'equipamentos' LIKE '[%]' 
      THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->>'equipamentos'::jsonb))
      -- Se equipamentos é uma string separada por vírgulas, usar string_to_array
      WHEN NEW.raw_user_meta_data->>'equipamentos' IS NOT NULL AND NEW.raw_user_meta_data->>'equipamentos' NOT LIKE '[%]'
      THEN string_to_array(NEW.raw_user_meta_data->>'equipamentos', ',')
      ELSE NULL
    END,
    NEW.raw_user_meta_data->>'observacoes_conteudo',
    COALESCE(NEW.raw_user_meta_data->>'idioma', 'PT'),
    now()
  );

  -- Grant default permissions
  INSERT INTO public.user_feature_permissions (user_id, feature, enabled, expires_at)
  VALUES 
    (NEW.id, 'videos', true, NULL),
    (NEW.id, 'fotos', true, NULL),
    (NEW.id, 'artes', true, NULL),
    (NEW.id, 'mestre_beleza', false, NULL),
    (NEW.id, 'consultor_mkt', false, NULL), 
    (NEW.id, 'fluida_roteirista', false, NULL),
    (NEW.id, 'artigos_cientificos', false, NULL),
    (NEW.id, 'academia', false, NULL),
    (NEW.id, 'equipamentos', false, NULL)
  ON CONFLICT (user_id, feature) DO NOTHING;

  -- Initialize user gamification
  INSERT INTO public.user_gamification (user_id, xp_total, last_activity_date)
  VALUES (NEW.id, 0, CURRENT_DATE)
  ON CONFLICT (user_id) DO NOTHING;

  -- Initialize user purchase scores
  INSERT INTO public.user_purchase_scores (user_id, engagement_score, interest_score, behavior_score)
  VALUES (NEW.id, 0, 0, 0)
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
$function$;