-- Função para sincronizar email entre auth.users e perfis (apenas admins)
CREATE OR REPLACE FUNCTION sync_user_email(
  user_id_param UUID,
  new_email TEXT
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_user_role TEXT;
  old_auth_email TEXT;
  old_profile_email TEXT;
  result JSONB;
BEGIN
  -- Verificar se o usuário atual é admin
  SELECT role INTO current_user_role 
  FROM public.perfis 
  WHERE id = auth.uid();
  
  IF current_user_role NOT IN ('admin', 'superadmin') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Acesso negado. Apenas administradores podem sincronizar emails.'
    );
  END IF;
  
  -- Buscar emails atuais
  SELECT email INTO old_auth_email FROM auth.users WHERE id = user_id_param;
  SELECT email INTO old_profile_email FROM public.perfis WHERE id = user_id_param;
  
  IF old_auth_email IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Usuário não encontrado'
    );
  END IF;
  
  -- Verificar se o novo email já existe
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = new_email AND id != user_id_param) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Este email já está em uso por outro usuário'
    );
  END IF;
  
  -- Atualizar na tabela perfis
  UPDATE public.perfis 
  SET email = new_email, updated_at = now()
  WHERE id = user_id_param;
  
  -- Log da operação
  INSERT INTO public.admin_audit_log (
    admin_user_id, action_type, target_user_id, 
    old_values, new_values
  ) VALUES (
    auth.uid(), 'EMAIL_SYNC', user_id_param,
    jsonb_build_object(
      'old_auth_email', old_auth_email,
      'old_profile_email', old_profile_email
    ),
    jsonb_build_object(
      'new_email', new_email
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Email sincronizado com sucesso no perfil. Email em auth.users deve ser atualizado via Admin API.',
    'old_auth_email', old_auth_email,
    'old_profile_email', old_profile_email,
    'new_email', new_email
  );
END;
$$;

-- Função para corrigir email específico do Giovanni
CREATE OR REPLACE FUNCTION fix_giovanni_email()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_record RECORD;
  result JSONB;
BEGIN
  -- Buscar o usuário com email errado
  SELECT * INTO user_record 
  FROM public.perfis 
  WHERE email = 'giovani@contourline.com.br'
  LIMIT 1;
  
  IF user_record IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Usuário Giovanni não encontrado com email correto'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Giovanni encontrado',
    'user_id', user_record.id,
    'current_email', user_record.email,
    'name', user_record.nome
  );
END;
$$;