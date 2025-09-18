-- Modificar a função criar_perfil_novo_usuario para incluir permissões padrão limitadas
CREATE OR REPLACE FUNCTION public.criar_perfil_novo_usuario()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $function$
BEGIN
  -- Criar perfil do usuário
  INSERT INTO public.perfis (id, nome, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user'  -- Always default to 'user' role for security
  );
  
  -- Conceder permissões padrão limitadas
  INSERT INTO public.user_feature_permissions (user_id, feature, has_access, expires_at)
  VALUES 
    (NEW.id, 'videos', true, NULL),
    (NEW.id, 'fotos', true, NULL),
    (NEW.id, 'artes', true, NULL),
    (NEW.id, 'artigos_cientificos', true, NULL)
  ON CONFLICT (user_id, feature) DO NOTHING;
  
  RETURN NEW;
END;
$function$;