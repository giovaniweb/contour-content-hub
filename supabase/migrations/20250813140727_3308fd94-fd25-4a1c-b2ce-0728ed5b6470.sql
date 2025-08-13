-- CRITICAL SECURITY FIXES - Phase 2
-- Fix remaining database security issues

-- 1. Fix the Security Definer View - replace with regular view
-- Drop the problematic view and recreate as regular view
DROP VIEW IF EXISTS public.gpt_config_public;

-- Create regular view (not SECURITY DEFINER)
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

-- Grant access to the view
GRANT SELECT ON public.gpt_config_public TO anon, authenticated;

-- 2. Find and fix all functions missing search_path
-- Let's recreate the user creation trigger properly
CREATE OR REPLACE FUNCTION public.criar_perfil_novo_usuario()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
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
$function$;

-- Fix other functions that might be missing search_path
CREATE OR REPLACE FUNCTION public.update_user_engagement_score()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;