-- FASE 4: Corrigir todos os problemas de segurança identificados

-- 1. Corrigir RLS na tabela perfis (dados sensíveis)
-- Remover política que pode estar causando exposição pública
DROP POLICY IF EXISTS "Public can view perfis" ON public.perfis;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.perfis; 
DROP POLICY IF EXISTS "Enable read access for all users" ON public.perfis;

-- 2. Corrigir RLS na tabela equipamentos 
-- Remover acesso público amplo
DROP POLICY IF EXISTS "Public can view equipamentos" ON public.equipamentos;
DROP POLICY IF EXISTS "Anyone can view equipment" ON public.equipamentos;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.equipamentos;
DROP POLICY IF EXISTS "Authenticated users can view equipment" ON public.equipamentos;

-- Permitir apenas visualização controlada
CREATE POLICY "Authenticated users can view equipment" 
ON public.equipamentos 
FOR SELECT 
TO authenticated
USING (true);

-- 3. Corrigir RLS na tabela documentos_tecnicos
-- Remover acesso público  
DROP POLICY IF EXISTS "Public can view documentos_tecnicos" ON public.documentos_tecnicos;
DROP POLICY IF EXISTS "Anyone can view documents" ON public.documentos_tecnicos;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.documentos_tecnicos;
DROP POLICY IF EXISTS "Authenticated users can view technical documents" ON public.documentos_tecnicos;

-- Permitir apenas acesso autenticado
CREATE POLICY "Authenticated users can view technical documents" 
ON public.documentos_tecnicos 
FOR SELECT 
TO authenticated
USING (true);

-- 4. Corrigir RLS na tabela gpt_config
-- Remover acesso público à configuração
DROP POLICY IF EXISTS "Public can view gpt_config" ON public.gpt_config;
DROP POLICY IF EXISTS "Anyone can view gpt config" ON public.gpt_config;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.gpt_config;
DROP POLICY IF EXISTS "Only admins can view gpt config" ON public.gpt_config;
DROP POLICY IF EXISTS "Only admins can manage gpt config" ON public.gpt_config;

-- Permitir apenas admins
CREATE POLICY "Only admins can view gpt config" 
ON public.gpt_config 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Também proteger as outras operações
CREATE POLICY "Only admins can manage gpt config" 
ON public.gpt_config 
FOR ALL 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. Dropar view problemática
DROP VIEW IF EXISTS public.gpt_config_public CASCADE;