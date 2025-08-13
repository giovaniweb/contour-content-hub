-- FASE 1: Usar CASCADE para remover todas as dependências

-- Remover função com CASCADE para eliminar todas as políticas dependentes
DROP FUNCTION IF EXISTS public.get_user_role(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_current_user_role() CASCADE;