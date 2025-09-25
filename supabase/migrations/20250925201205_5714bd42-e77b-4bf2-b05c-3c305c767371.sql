-- Update the trigger function to handle additional user data from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert new profile with all available data from metadata
  INSERT INTO public.perfis (
    id, 
    nome, 
    email, 
    role,
    telefone,
    cidade,
    clinica,
    especialidade,
    data_criacao,
    idioma
  ) VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'nome', 
      NEW.raw_user_meta_data->>'name', 
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    'user',
    NEW.raw_user_meta_data->>'telefone',
    NEW.raw_user_meta_data->>'cidade',
    NEW.raw_user_meta_data->>'clinica',
    NEW.raw_user_meta_data->>'especialidade',
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