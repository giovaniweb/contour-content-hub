-- FASE 1: Correção Imediata da Recursão Infinita
-- Remover políticas RLS problemáticas da tabela perfis

-- Primeiro, remover todas as políticas atuais que causam recursão
DROP POLICY IF EXISTS "Admins podem editar todas agendas" ON agenda;
DROP POLICY IF EXISTS "Admins podem ver todas agendas" ON agenda;
DROP POLICY IF EXISTS "Admins podem editar todas avaliações" ON avaliacoes;

-- Remover função problemática que causa recursão
DROP FUNCTION IF EXISTS public.get_user_role(uuid);
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- Criar nova função SECURITY DEFINER para verificar role sem recursão
CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_uuid uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role FROM public.perfis WHERE id = user_uuid;
$$;

-- Criar função para verificar se usuário atual é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  );
$$;

-- Criar função para verificar se usuário atual tem role específico
CREATE OR REPLACE FUNCTION public.has_role(required_role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role = required_role
  );
$$;

-- Recriar políticas da tabela agenda sem recursão
CREATE POLICY "Users can view own agenda items" 
ON public.agenda 
FOR SELECT 
USING (auth.uid() = usuario_id);

CREATE POLICY "Users can create own agenda items" 
ON public.agenda 
FOR INSERT 
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own agenda items" 
ON public.agenda 
FOR UPDATE 
USING (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own agenda items" 
ON public.agenda 
FOR DELETE 
USING (auth.uid() = usuario_id);

CREATE POLICY "Admins can manage all agenda items" 
ON public.agenda 
FOR ALL 
USING (public.is_admin());

-- Recriar políticas da tabela avaliacoes sem recursão
CREATE POLICY "Users can view all reviews" 
ON public.avaliacoes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create own reviews" 
ON public.avaliacoes 
FOR INSERT 
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own reviews" 
ON public.avaliacoes 
FOR UPDATE 
USING (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own reviews" 
ON public.avaliacoes 
FOR DELETE 
USING (auth.uid() = usuario_id);

CREATE POLICY "Admins can manage all reviews" 
ON public.avaliacoes 
FOR ALL 
USING (public.is_admin());

-- Corrigir função check_admin_role para evitar recursão
DROP FUNCTION IF EXISTS public.check_admin_role();
CREATE OR REPLACE FUNCTION public.check_admin_role()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  );
$$;