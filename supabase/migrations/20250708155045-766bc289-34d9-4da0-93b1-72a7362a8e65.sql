-- Atualizar função delete_document_cascade para trabalhar com unified_documents
CREATE OR REPLACE FUNCTION public.delete_document_cascade(document_id_param uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  document_record RECORD;
  deleted_files TEXT[] := '{}';
  result JSONB;
BEGIN
  -- Buscar informações do documento antes de excluir na tabela unified_documents
  SELECT * INTO document_record FROM unified_documents WHERE id = document_id_param;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Documento não encontrado'
    );
  END IF;

  -- Coletar URLs de arquivos para cleanup (field correto da tabela unified_documents)
  IF document_record.file_path IS NOT NULL THEN
    deleted_files := array_append(deleted_files, document_record.file_path);
  END IF;

  -- Excluir o documento principal da tabela unified_documents
  DELETE FROM unified_documents WHERE id = document_id_param;

  -- Log da operação
  INSERT INTO audit_log (table_name, operation, old_data, user_id)
  VALUES ('unified_documents', 'CASCADE_DELETE', to_jsonb(document_record), auth.uid());

  RETURN jsonb_build_object(
    'success', true,
    'deleted_files', to_jsonb(deleted_files),
    'message', 'Documento excluído completamente'
  );
END;
$function$;