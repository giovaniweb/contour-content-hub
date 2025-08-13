-- FASE 1: Remover políticas problemáticas da tabela perfis

-- Remover todas as políticas da tabela perfis que causam recursão
DROP POLICY IF EXISTS "Admins can view all profiles" ON perfis;
DROP POLICY IF EXISTS "Admins can insert any profile" ON perfis;
DROP POLICY IF EXISTS "Admins can update any profile" ON perfis;  
DROP POLICY IF EXISTS "Admins can delete profiles" ON perfis;

-- Agora podemos remover as funções problemáticas
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP FUNCTION IF EXISTS public.get_user_role(uuid);