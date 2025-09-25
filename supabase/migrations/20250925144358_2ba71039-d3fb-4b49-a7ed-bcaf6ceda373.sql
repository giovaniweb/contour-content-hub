-- Corrigir a função de limpeza para não exigir auth.uid() válido
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_users()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  orphaned_count INTEGER := 0;
  current_user_id UUID;
BEGIN
  -- Obter o ID do usuário atual se disponível
  current_user_id := auth.uid();
  
  -- Se não tiver usuário logado, não pode executar (segurança)
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Usuário não autenticado. Faça login como administrador.'
    );
  END IF;
  
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = current_user_id 
    AND role IN ('admin', 'superadmin')
  ) THEN
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
    current_user_id, 'CLEANUP_ORPHANED_USERS', 
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