-- FASE 3: Corrigir funções sem SET search_path

-- Corrigir todas as funções existentes para ter SET search_path
CREATE OR REPLACE FUNCTION public.criar_perfil_novo_usuario()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $$
BEGIN
  INSERT INTO public.perfis (id, nome, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user'  -- Always default to 'user' role for security
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_videomaker_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Atualizar estatísticas do videomaker
  UPDATE public.videomakers
  SET 
    media_avaliacao = (
      SELECT ROUND(AVG(nota)::numeric, 1)
      FROM public.videomaker_avaliacoes
      WHERE videomaker_id = COALESCE(NEW.videomaker_id, OLD.videomaker_id)
    ),
    total_avaliacoes = (
      SELECT COUNT(*)
      FROM public.videomaker_avaliacoes
      WHERE videomaker_id = COALESCE(NEW.videomaker_id, OLD.videomaker_id)
    )
  WHERE id = COALESCE(NEW.videomaker_id, OLD.videomaker_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.track_ai_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update user usage metrics
  UPDATE public.user_usage
  SET ai_generations_used = ai_generations_used + 1, 
      last_activity = now()
  WHERE user_id = NEW.usuario_id;
  
  -- If no row exists for this user, create one with default plan (Free)
  IF NOT FOUND THEN
    INSERT INTO public.user_usage (
      user_id, 
      plan_id,
      ai_generations_used
    ) VALUES (
      NEW.usuario_id,
      (SELECT id FROM public.subscription_plans WHERE name = 'Free' LIMIT 1),
      1
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_content_preferences()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if we have a user content profile already
  IF EXISTS (SELECT 1 FROM public.user_content_profiles WHERE user_id = NEW.user_id) THEN
    -- Update existing profile with new preferences
    UPDATE public.user_content_profiles
    SET updated_at = now()
    WHERE user_id = NEW.user_id;
  ELSE
    -- Create new profile
    INSERT INTO public.user_content_profiles (user_id)
    VALUES (NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$;

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

    -- Update gamification
    INSERT INTO public.user_gamification (user_id, xp_total, last_activity_date)
    VALUES (NEW.user_id, xp_bonus, CURRENT_DATE)
    ON CONFLICT (user_id) DO UPDATE SET
        xp_total = user_gamification.xp_total + xp_bonus,
        last_activity_date = CURRENT_DATE,
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

CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (table_name, operation, old_data, user_id)
    VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (table_name, operation, old_data, new_data, user_id)
    VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (table_name, operation, new_data, user_id)
    VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;