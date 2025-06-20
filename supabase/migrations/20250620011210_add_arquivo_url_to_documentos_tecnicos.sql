-- Adicionar a coluna arquivo_url à tabela documentos_tecnicos
ALTER TABLE public.documentos_tecnicos
ADD COLUMN IF NOT EXISTS arquivo_url TEXT;

-- Comentário opcional sobre a coluna (se o seu SGBD suportar e for prática comum)
-- COMMENT ON COLUMN public.documentos_tecnicos.arquivo_url IS 'URL direta para o arquivo armazenado, geralmente no Supabase Storage.';

-- Popular a coluna arquivo_url com o valor de link_dropbox se arquivo_url estiver NULL e link_dropbox não.
-- Isso é uma tentativa de backfill para dados existentes, se aplicável.
UPDATE public.documentos_tecnicos
SET arquivo_url = link_dropbox
WHERE arquivo_url IS NULL AND link_dropbox IS NOT NULL;
