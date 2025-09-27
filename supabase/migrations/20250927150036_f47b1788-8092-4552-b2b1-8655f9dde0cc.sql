-- Fix signup trigger error: remove non-existent last_activity_date column references

-- 1) Fix handle_new_user_signup trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert new profile with ALL available data from metadata, using robust parsing
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

  -- Grant default feature permissions
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

  -- Initialize user gamification (FIXED: removed last_activity_date)
  INSERT INTO public.user_gamification (user_id, xp_total)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Initialize user usage tracking (plan Free if exists)
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

-- 2) Fix update_user_engagement_score function (remove last_activity_date references)
CREATE OR REPLACE FUNCTION public.update_user_engagement_score()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    current_score INTEGER;
    xp_bonus INTEGER := 0;
BEGIN
    -- Define XP based on action
    CASE NEW.action_type
        WHEN 'video_watch' THEN xp_bonus := 10;
        WHEN 'video_download' THEN xp_bonus := 5;
        WHEN 'diagnostic_complete' THEN xp_bonus := 50;
        WHEN 'article_view' THEN xp_bonus := 15;
        WHEN 'photo_upload' THEN xp_bonus := 25;
        WHEN 'equipment_view' THEN xp_bonus := 3;
        ELSE xp_bonus := 1;
    END CASE;

    -- Update XP in user_actions table
    NEW.xp_awarded = xp_bonus;

    -- Update gamification (FIXED: removed last_activity_date)
    INSERT INTO public.user_gamification (user_id, xp_total)
    VALUES (NEW.user_id, xp_bonus)
    ON CONFLICT (user_id) DO UPDATE SET
        xp_total = user_gamification.xp_total + xp_bonus,
        updated_at = now(),
        videos_watched = CASE WHEN NEW.action_type = 'video_watch' THEN user_gamification.videos_watched + 1 ELSE user_gamification.videos_watched END,
        videos_downloaded = CASE WHEN NEW.action_type = 'video_download' THEN user_gamification.videos_downloaded + 1 ELSE user_gamification.videos_downloaded END,
        diagnostics_completed = CASE WHEN NEW.action_type = 'diagnostic_complete' THEN user_gamification.diagnostics_completed + 1 ELSE user_gamification.diagnostics_completed END,
        articles_viewed = CASE WHEN NEW.action_type = 'article_view' THEN user_gamification.articles_viewed + 1 ELSE user_gamification.articles_viewed END,
        photos_uploaded = CASE WHEN NEW.action_type = 'photo_upload' THEN user_gamification.photos_uploaded + 1 ELSE user_gamification.photos_uploaded END;

    -- Update purchase score
    INSERT INTO public.user_purchase_scores (user_id)
    VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO UPDATE SET
        engagement_score = LEAST(100, user_purchase_scores.engagement_score + CASE 
            WHEN NEW.action_type IN ('video_watch', 'video_download') THEN 2
            WHEN NEW.action_type = 'diagnostic_complete' THEN 15
            WHEN NEW.action_type = 'photo_upload' THEN 10
            ELSE 1
        END),
        last_equipment_interest = CASE WHEN NEW.target_type = 'equipment' THEN NEW.target_id ELSE user_purchase_scores.last_equipment_interest END,
        updated_at = now();

    RETURN NEW;
END;
$$;

-- 3) Recreate the trigger to ensure it's properly linked
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();