-- FASE 1: Remover sistema legado - Deprecar tabela documentos_tecnicos
-- Esta migração move o sistema completamente para unified_documents

-- 1. Adicionar comentário de depreciação à tabela
COMMENT ON TABLE public.documentos_tecnicos IS 'DEPRECATED: Esta tabela foi substituída por unified_documents. Será removida em uma versão futura.';

-- 2. Desabilitar triggers da tabela depreciada para evitar efeitos colaterais
DROP TRIGGER IF EXISTS handle_document_content_change ON public.documentos_tecnicos;

-- 3. Remover políticas RLS da tabela depreciada (mantemos apenas estrutura para compatibilidade temporária)
DROP POLICY IF EXISTS "Admins can manage all documents" ON public.documentos_tecnicos;
DROP POLICY IF EXISTS "Allow all users to view documents" ON public.documentos_tecnicos;
DROP POLICY IF EXISTS "Allow authenticated users to create documents" ON public.documentos_tecnicos;
DROP POLICY IF EXISTS "Allow users to delete their own documents" ON public.documentos_tecnicos;
DROP POLICY IF EXISTS "Allow users to update their own documents" ON public.documentos_tecnicos;

-- 4. Melhorar as políticas RLS para unified_documents (garantir que admin tem acesso total)
-- Remover política genérica existente se houver
DROP POLICY IF EXISTS "Admin full access on unified documents" ON public.unified_documents;

-- Criar política mais específica para admins
CREATE POLICY "Admin users full access to unified documents"
ON public.unified_documents
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE perfis.id = auth.uid() 
    AND perfis.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE perfis.id = auth.uid() 
    AND perfis.role = 'admin'
  )
);

-- Política para usuários normais (apenas visualização de seus próprios documentos)
CREATE POLICY "Users can view their own unified documents"
ON public.unified_documents
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política para usuários criarem seus próprios documentos
CREATE POLICY "Users can create their own unified documents"
ON public.unified_documents
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política para usuários editarem seus próprios documentos
CREATE POLICY "Users can update their own unified documents"
ON public.unified_documents
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para usuários deletarem seus próprios documentos
CREATE POLICY "Users can delete their own unified documents"
ON public.unified_documents
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 5. Adicionar índices para performance no sistema novo
CREATE INDEX IF NOT EXISTS idx_unified_documents_tipo_documento ON public.unified_documents(tipo_documento);
CREATE INDEX IF NOT EXISTS idx_unified_documents_equipamento_id ON public.unified_documents(equipamento_id);
CREATE INDEX IF NOT EXISTS idx_unified_documents_user_id ON public.unified_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_unified_documents_status ON public.unified_documents(status_processamento);
CREATE INDEX IF NOT EXISTS idx_unified_documents_created_at ON public.unified_documents(created_at DESC);

-- 6. Garantir que triggers estão funcionando corretamente para unified_documents
-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_unified_documents_updated_at ON public.unified_documents;
CREATE TRIGGER update_unified_documents_updated_at
  BEFORE UPDATE ON public.unified_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_unified_documents_updated_at();