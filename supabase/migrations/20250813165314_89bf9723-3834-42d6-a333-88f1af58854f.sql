-- FASE 1: Remover todas as políticas dependentes primeiro

-- Remover políticas da tabela roteiros
DROP POLICY IF EXISTS "Admins podem ver todos roteiros" ON roteiros;
DROP POLICY IF EXISTS "Admins podem editar todos roteiros" ON roteiros;

-- Remover políticas da tabela favoritos
DROP POLICY IF EXISTS "Admins podem ver todos favoritos" ON favoritos;

-- Remover políticas da tabela logs_uso
DROP POLICY IF EXISTS "Admins podem ver todos logs" ON logs_uso;

-- Remover políticas da tabela agenda
DROP POLICY IF EXISTS "Admins podem editar todas agendas" ON agenda;
DROP POLICY IF EXISTS "Admins podem ver todas agendas" ON agenda;

-- Remover políticas da tabela avaliacoes
DROP POLICY IF EXISTS "Admins podem editar todas avaliações" ON avaliacoes;

-- Agora podemos remover as funções problemáticas
DROP FUNCTION IF EXISTS public.get_user_role(uuid);
DROP FUNCTION IF EXISTS public.get_current_user_role();