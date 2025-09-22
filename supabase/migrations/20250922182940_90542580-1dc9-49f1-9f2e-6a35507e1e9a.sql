-- Update the trigger function to set default permissions for new users
CREATE OR REPLACE FUNCTION public.criar_perfil_novo_usuario()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
BEGIN
  -- Criar perfil do usuário
  INSERT INTO public.perfis (id, nome, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user'  -- Always default to 'user' role for security
  );
  
  -- Conceder permissões padrão (apenas vídeos, fotos e artes liberadas)
  INSERT INTO public.user_feature_permissions (user_id, feature, has_access, expires_at)
  VALUES 
    (NEW.id, 'videos', true, NULL),
    (NEW.id, 'fotos', true, NULL),
    (NEW.id, 'artes', true, NULL),
    -- Blocked features (need to be created so they show up in the system)
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