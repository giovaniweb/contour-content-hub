-- Fix signup errors: robust trigger and RLS for perfis

-- 1) Ensure robust trigger for profile creation with safe equipamentos parsing
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

  -- Initialize user gamification
  INSERT INTO public.user_gamification (user_id, xp_total, last_activity_date)
  VALUES (NEW.id, 0, CURRENT_DATE)
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

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- 2) Ensure RLS policies on perfis allow user self-insert/select/update
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own profile" ON public.perfis;
CREATE POLICY "Users can insert own profile"
ON public.perfis
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can view own profile" ON public.perfis;
CREATE POLICY "Users can view own profile"
ON public.perfis
FOR SELECT
TO authenticated
USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile" ON public.perfis;
CREATE POLICY "Users can update own profile"
ON public.perfis
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());