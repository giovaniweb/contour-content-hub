-- FASE 1: CORREÇÃO EMERGENCIAL - RLS RECURSIVO
-- Remover todas as políticas problemáticas da tabela superusers
DROP POLICY IF EXISTS "Superusers can manage superusers table" ON public.superusers;
DROP POLICY IF EXISTS "Admins can manage superusers" ON public.superusers;
DROP POLICY IF EXISTS "Only superusers can manage superuser list" ON public.superusers;
DROP POLICY IF EXISTS "Superusers can view superuser list" ON public.superusers;

-- Criar política simples e segura - permitir leitura para sistema, sem recursão
CREATE POLICY "System can read superusers for auth checks"
ON public.superusers
FOR SELECT
USING (true); -- Permite leitura para funções do sistema

-- Apenas admins podem gerenciar a lista (sem usar função que cause recursão)
CREATE POLICY "Direct admin role can manage superusers"  
ON public.superusers
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Verificar se a tabela perfis tem política adequada para listagem de usuários
-- Criar política robusta para administradores verem todos os perfis
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.perfis;

CREATE POLICY "Admins can view all profiles"
ON public.perfis
FOR SELECT
USING (
  -- Primeiro verifica superuser allowlist diretamente
  EXISTS (
    SELECT 1 FROM public.superusers s
    JOIN auth.users u ON u.email = s.email
    WHERE u.id = auth.uid() AND s.active = true
  )
  OR
  -- Depois verifica role admin diretamente na tabela perfis
  EXISTS (
    SELECT 1 FROM public.perfis p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  )
);

-- Garantir que admins podem gerenciar perfis
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.perfis;

CREATE POLICY "Admins can manage profiles"
ON public.perfis
FOR ALL
USING (
  -- Primeiro verifica superuser allowlist diretamente
  EXISTS (
    SELECT 1 FROM public.superusers s
    JOIN auth.users u ON u.email = s.email
    WHERE u.id = auth.uid() AND s.active = true
  )
  OR
  -- Depois verifica role admin diretamente na tabela perfis
  EXISTS (
    SELECT 1 FROM public.perfis p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  -- Mesmo check para operações de escrita
  EXISTS (
    SELECT 1 FROM public.superusers s
    JOIN auth.users u ON u.email = s.email
    WHERE u.id = auth.uid() AND s.active = true
  )
  OR
  EXISTS (
    SELECT 1 FROM public.perfis p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  )
);