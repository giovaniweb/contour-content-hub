-- Função para limpar usuários órfãos (que existem em auth.users mas não em perfis)
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_users()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  orphaned_count INTEGER := 0;
  current_user_role TEXT;
BEGIN
  -- Verificar se o usuário atual é admin
  SELECT role INTO current_user_role 
  FROM public.perfis 
  WHERE id = auth.uid();
  
  IF current_user_role NOT IN ('admin', 'superadmin') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Acesso negado. Apenas administradores podem executar esta operação.'
    );
  END IF;
  
  -- Contar usuários órfãos antes da limpeza
  SELECT COUNT(*) INTO orphaned_count
  FROM auth.users auth_users
  LEFT JOIN public.perfis ON perfis.id = auth_users.id
  WHERE perfis.id IS NULL;
  
  -- Log da operação
  INSERT INTO public.admin_audit_log (
    admin_user_id, action_type, old_values
  ) VALUES (
    auth.uid(), 'CLEANUP_ORPHANED_USERS', 
    jsonb_build_object('orphaned_users_found', orphaned_count)
  );
  
  -- Excluir usuários órfãos da tabela auth.users
  DELETE FROM auth.users 
  WHERE id IN (
    SELECT auth_users.id
    FROM auth.users auth_users
    LEFT JOIN public.perfis ON perfis.id = auth_users.id
    WHERE perfis.id IS NULL
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Usuários órfãos limpos com sucesso',
    'orphaned_users_cleaned', orphaned_count
  );
END;
$$;