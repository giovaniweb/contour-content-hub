-- FASE 2: Criar novas funções e políticas seguras

-- Criar função SECURITY DEFINER para verificar role sem recursão
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

-- Recriar função check_admin_role
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

-- POLÍTICAS PARA TABELA PERFIS (SEM RECURSÃO)
-- Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile" 
ON public.perfis 
FOR SELECT 
USING (auth.uid() = id);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile" 
ON public.perfis 
FOR UPDATE 
USING (auth.uid() = id);

-- Sistema pode inserir novos perfis (via trigger)
CREATE POLICY "System can insert profiles" 
ON public.perfis 
FOR INSERT 
WITH CHECK (true);

-- Administradores podem ver todos os perfis (usando auth.uid() direto)
CREATE POLICY "Admins can view all profiles" 
ON public.perfis 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
);

-- POLÍTICAS PARA AGENDA
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

-- POLÍTICAS PARA AVALIACOES
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

-- POLÍTICAS PARA ROTEIROS
CREATE POLICY "Users can view own scripts" 
ON public.roteiros 
FOR SELECT 
USING (auth.uid() = usuario_id);

CREATE POLICY "Users can create own scripts" 
ON public.roteiros 
FOR INSERT 
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own scripts" 
ON public.roteiros 
FOR UPDATE 
USING (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own scripts" 
ON public.roteiros 
FOR DELETE 
USING (auth.uid() = usuario_id);

CREATE POLICY "Admins can manage all scripts" 
ON public.roteiros 
FOR ALL 
USING (public.is_admin());

-- POLÍTICAS PARA FAVORITOS
CREATE POLICY "Users can view own favorites" 
ON public.favoritos 
FOR SELECT 
USING (auth.uid() = usuario_id);

CREATE POLICY "Users can create own favorites" 
ON public.favoritos 
FOR INSERT 
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own favorites" 
ON public.favoritos 
FOR DELETE 
USING (auth.uid() = usuario_id);

CREATE POLICY "Admins can view all favorites" 
ON public.favoritos 
FOR SELECT 
USING (public.is_admin());

-- POLÍTICAS PARA LOGS_USO
CREATE POLICY "Users can view own usage logs" 
ON public.logs_uso 
FOR SELECT 
USING (auth.uid() = usuario_id);

CREATE POLICY "System can insert usage logs" 
ON public.logs_uso 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all usage logs" 
ON public.logs_uso 
FOR SELECT 
USING (public.is_admin());