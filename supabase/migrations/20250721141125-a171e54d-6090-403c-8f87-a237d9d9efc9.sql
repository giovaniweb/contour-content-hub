-- Fix Security Definer View and Function Search Path issues

-- 1. Drop the existing security definer view if it exists
DROP VIEW IF EXISTS public.database_documentation;

-- 2. Recreate database_documentation as a regular table (as it already exists)
-- The table already exists, so no need to recreate it

-- 3. Fix function search paths for security
-- Update all functions to have proper search_path set

-- Update vector functions that don't have search_path set
ALTER FUNCTION public.vector_in(cstring, oid, integer) SET search_path = '';
ALTER FUNCTION public.vector_out(vector) SET search_path = '';
ALTER FUNCTION public.vector_typmod_in(cstring[]) SET search_path = '';
ALTER FUNCTION public.vector_recv(internal, oid, integer) SET search_path = '';
ALTER FUNCTION public.vector_send(vector) SET search_path = '';

-- Update other custom functions
CREATE OR REPLACE FUNCTION public.update_content_strategy_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_blog_posts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.track_ai_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_marketing_diagnostics_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_content_preferences()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;