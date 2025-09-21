-- Funções RPC para gerenciamento de usuários órfãos

-- Função para verificar se usuário existe no auth.users por email
CREATE OR REPLACE FUNCTION public.check_user_exists_by_email(user_email text)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'exists', CASE WHEN EXISTS (
      SELECT 1 FROM auth.users WHERE email = user_email
    ) THEN true ELSE false END,
    'id', (SELECT id FROM auth.users WHERE email = user_email LIMIT 1),
    'created_at', (SELECT created_at FROM auth.users WHERE email = user_email LIMIT 1)
  );
$$;

-- Função para listar usuários órfãos (existem no auth mas não têm perfil)
CREATE OR REPLACE FUNCTION public.get_orphan_users()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', auth_users.id,
        'email', auth_users.email,
        'created_at', auth_users.created_at
      )
    ),
    '[]'::jsonb
  )
  FROM auth.users auth_users
  LEFT JOIN public.perfis ON perfis.id = auth_users.id
  WHERE perfis.id IS NULL;
$$;

-- Função para deletar usuário do auth (apenas para admins)
CREATE OR REPLACE FUNCTION public.delete_auth_user(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_role text;
BEGIN
  -- Verificar se o usuário atual é admin
  SELECT role INTO current_user_role 
  FROM public.perfis 
  WHERE id = auth.uid();
  
  IF current_user_role NOT IN ('admin', 'superadmin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem excluir usuários.';
  END IF;
  
  -- Não permitir auto-exclusão
  IF user_id = auth.uid() THEN
    RAISE EXCEPTION 'Você não pode excluir seu próprio usuário.';
  END IF;
  
  -- Deletar do auth.users (isso automaticamente remove da tabela perfis via CASCADE)
  DELETE FROM auth.users WHERE id = user_id;
  
  RETURN true;
END;
$$;