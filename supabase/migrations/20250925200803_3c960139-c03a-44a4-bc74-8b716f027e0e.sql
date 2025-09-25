-- Check if trigger exists and create it if missing
-- Create or replace the trigger function that creates user profiles automatically
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert new profile
  INSERT INTO public.perfis (
    id, 
    nome, 
    email, 
    role,
    data_criacao,
    idioma
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user',
    now(),
    'PT'
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

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();