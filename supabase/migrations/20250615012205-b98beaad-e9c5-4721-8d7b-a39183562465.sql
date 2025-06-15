
-- 1. Remover colunas e vínculos do Vimeo que não são mais necessários
ALTER TABLE IF EXISTS public.videos DROP COLUMN IF EXISTS vimeo_id;
ALTER TABLE IF EXISTS public.integracao_configs DROP COLUMN IF EXISTS tipo_vimeo;

-- 2. (Já foi) - Dropar tabela user_vimeo_tokens (verificado qu já removida pela última migração)
-- 3. Clean-up: apagar as policies relacionadas ao Vimeo se existirem
-- (Essas não aparecem declaradas, mas revisar manualmente)

-- 4. Ajustar índices se algum coluna removida era indexada.
DROP INDEX IF EXISTS videos_vimeo_id_idx;

-- 5. Revisar logs de integrações antigas e tabelas de histórico desnecessárias
-- (Por segurança, só comentar pois nomes exatos podem mudar)
-- DROP TABLE IF EXISTS public.vimeo_logs;
-- DROP TABLE IF EXISTS public.video_import_history;

-- 6. Garantir que marketing_diagnostics tenha integridade com perfis de usuário
ALTER TABLE IF EXISTS public.marketing_diagnostics
  ALTER COLUMN user_id SET NOT NULL;

-- 7. Limpar variáveis/segredos do Vimeo caso não sejam mais usados (instrutivo)
-- As variáveis VIMEO_CLIENT_ID e VIMEO_CLIENT_SECRET devem ser removidas do painel Supabase > Settings > Functions > Secrets se não houver uso futuro planejado.

-- 8. Revisar links de navegação no frontend depois.
