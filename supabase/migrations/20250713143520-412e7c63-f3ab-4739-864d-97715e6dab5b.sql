-- Criar uma função para processar e salvar documento na tabela unified_documents
CREATE OR REPLACE FUNCTION public.create_unified_document(
  p_title TEXT,
  p_content TEXT,
  p_conclusion TEXT,
  p_keywords TEXT[],
  p_authors TEXT[],
  p_raw_text TEXT,
  p_file_path TEXT,
  p_user_id UUID,
  p_equipamento_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  document_id UUID;
BEGIN
  -- Inserir novo documento na tabela unified_documents
  INSERT INTO public.unified_documents (
    tipo_documento,
    titulo_extraido,
    palavras_chave,
    autores,
    texto_completo,
    raw_text,
    file_path,
    user_id,
    equipamento_id,
    status_processamento,
    data_upload
  ) VALUES (
    'artigo_cientifico',
    p_title,
    p_keywords,
    p_authors,
    p_content,
    p_raw_text,
    p_file_path,
    p_user_id,
    p_equipamento_id,
    'concluido',
    NOW()
  )
  RETURNING id INTO document_id;
  
  RETURN document_id;
END;
$$;