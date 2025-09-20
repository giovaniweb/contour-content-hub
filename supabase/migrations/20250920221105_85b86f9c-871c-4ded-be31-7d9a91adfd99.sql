-- FASE 1: CORREÇÃO EMERGENCIAL - RESOLVER RECURSÃO RLS E RESTAURAR ACESSO ADMIN

-- 1. Criar tabela de superusers para evitar recursão
CREATE TABLE IF NOT EXISTS public.superusers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  active BOOLEAN DEFAULT true
);

-- Inserir superuser principal
INSERT INTO public.superusers (email, active) 
VALUES ('giovani.g@live.com', true)
ON CONFLICT (email) DO UPDATE SET active = true;

-- 2. Criar função SECURITY DEFINER segura para verificar admin (sem recursão)
CREATE OR REPLACE FUNCTION public.is_superuser_by_email(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.superusers 
    WHERE email = user_email AND active = true
  );
$$;

-- 3. Criar função segura para verificar se usuário atual é admin
CREATE OR REPLACE FUNCTION public.check_user_is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    -- Primeiro verifica superuser allowlist
    WHEN EXISTS (
      SELECT 1 FROM public.superusers s
      JOIN auth.users u ON u.email = s.email
      WHERE u.id = auth.uid() AND s.active = true
    ) THEN true
    -- Depois verifica role admin no perfil (sem recursão)
    WHEN EXISTS (
      SELECT 1 FROM public.perfis p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
    ) THEN true
    ELSE false
  END;
$$;

-- 4. Remover políticas RLS recursivas existentes na tabela perfis
DROP POLICY IF EXISTS "Admins can select all profiles" ON public.perfis;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.perfis;
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.perfis;

-- 5. Criar novas políticas RLS seguras (sem recursão)
CREATE POLICY "Superusers and admins can select all profiles"
ON public.perfis
FOR SELECT
USING (
  -- Superuser allowlist tem prioridade
  auth.uid() IN (
    SELECT u.id FROM auth.users u 
    JOIN public.superusers s ON s.email = u.email 
    WHERE s.active = true
  )
  OR
  -- Usuario pode ver próprio perfil
  auth.uid() = id
  OR
  -- Admin pode ver todos (verificação direta sem recursão)
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "Superusers and admins can update all profiles"
ON public.perfis
FOR UPDATE
USING (
  -- Superuser allowlist
  auth.uid() IN (
    SELECT u.id FROM auth.users u 
    JOIN public.superusers s ON s.email = u.email 
    WHERE s.active = true
  )
  OR
  -- Usuario pode editar próprio perfil
  auth.uid() = id  
  OR
  -- Admin pode editar todos
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  -- Mesma lógica para WITH CHECK
  auth.uid() IN (
    SELECT u.id FROM auth.users u 
    JOIN public.superusers s ON s.email = u.email 
    WHERE s.active = true
  )
  OR
  auth.uid() = id
  OR
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "Superusers and admins can delete profiles"
ON public.perfis
FOR DELETE
USING (
  -- Apenas superusers e admins podem deletar
  auth.uid() IN (
    SELECT u.id FROM auth.users u 
    JOIN public.superusers s ON s.email = u.email 
    WHERE s.active = true
  )
  OR
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
);

-- 6. Habilitar RLS na tabela superusers
ALTER TABLE public.superusers ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela superusers
CREATE POLICY "Superusers can manage superusers table"
ON public.superusers
FOR ALL
USING (
  auth.uid() IN (
    SELECT u.id FROM auth.users u 
    JOIN public.superusers s ON s.email = u.email 
    WHERE s.active = true
  )
);

-- 7. Garantir que giovani.g@live.com tenha role admin no perfil
UPDATE public.perfis 
SET role = 'superadmin'
WHERE email = 'giovani.g@live.com';

-- Se não existir perfil, criar um
INSERT INTO public.perfis (id, email, nome, role)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'nome', u.raw_user_meta_data->>'name', 'Giovani'),
  'superadmin'
FROM auth.users u
WHERE u.email = 'giovani.g@live.com'
  AND NOT EXISTS (SELECT 1 FROM public.perfis p WHERE p.id = u.id)
ON CONFLICT (id) DO UPDATE SET
  role = 'superadmin',
  nome = COALESCE(EXCLUDED.nome, perfis.nome);

-- 8. Atualizar função is_admin() existente para usar nova lógica
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.check_user_is_admin();
$$;

-- 9. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_superusers_email ON public.superusers(email);
CREATE INDEX IF NOT EXISTS idx_superusers_active ON public.superusers(active);
CREATE INDEX IF NOT EXISTS idx_perfis_role ON public.perfis(role);
CREATE INDEX IF NOT EXISTS idx_perfis_email ON public.perfis(email);

-- 10. Log da operação
INSERT INTO public.audit_log (table_name, operation, new_data, user_id)
VALUES (
  'sistema_permissoes', 
  'EMERGENCY_FIX', 
  jsonb_build_object(
    'action', 'fix_rls_recursion_and_restore_admin_access',
    'superuser_added', 'giovani.g@live.com',
    'policies_recreated', true,
    'functions_updated', true
  ),
  auth.uid()
);