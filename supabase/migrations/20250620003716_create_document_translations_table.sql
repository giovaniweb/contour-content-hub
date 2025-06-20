-- Criar tabela para traduções de documentos
CREATE TABLE IF NOT EXISTS public.document_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documentos_tecnicos(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL, -- Ex: 'en', 'es'
  translated_text TEXT, -- Usar TEXT para armazenar conteúdo traduzido diretamente
  -- translated_content_url TEXT, -- Alternativa se for armazenar como arquivo
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- Ex: 'pending', 'processing', 'completed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (document_id, language_code) -- Garantir uma tradução por idioma para cada documento
);

-- Habilitar RLS
ALTER TABLE public.document_translations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (ajustar conforme necessidade de negócio)
-- Permitir que usuários autenticados visualizem traduções de documentos ativos
CREATE POLICY "Users can view translations of active documents"
  ON public.document_translations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.documentos_tecnicos dt
      WHERE dt.id = document_id AND dt.status = 'ativo'
    )
  );

-- Permitir que usuários autenticados (ou um role específico) criem traduções
CREATE POLICY "Authenticated users can create translations"
  ON public.document_translations
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated'); -- Pode ser mais restritivo

-- Permitir que usuários autenticados (ou um role específico) atualizem traduções
CREATE POLICY "Authenticated users can update translations"
  ON public.document_translations
  FOR UPDATE
  USING (auth.role() = 'authenticated'); -- Pode ser mais restritivo

-- Trigger para atualizar 'updated_at'
CREATE OR REPLACE FUNCTION public.update_document_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_document_translations_updated_at
  BEFORE UPDATE ON public.document_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_document_translations_updated_at();

-- Índices
CREATE INDEX IF NOT EXISTS idx_document_translations_document_id ON public.document_translations(document_id);
CREATE INDEX IF NOT EXISTS idx_document_translations_language_code ON public.document_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_document_translations_status ON public.document_translations(status);
