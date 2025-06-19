
-- Criar função para exclusão completa de vídeos
CREATE OR REPLACE FUNCTION public.delete_video_cascade(video_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  video_record RECORD;
  deleted_files TEXT[] := '{}';
  result JSONB;
BEGIN
  -- Buscar informações do vídeo antes de excluir
  SELECT * INTO video_record FROM videos WHERE id = video_id_param;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Vídeo não encontrado'
    );
  END IF;

  -- Coletar URLs de arquivos para cleanup
  IF video_record.url_video IS NOT NULL THEN
    deleted_files := array_append(deleted_files, video_record.url_video);
  END IF;
  
  IF video_record.thumbnail_url IS NOT NULL THEN
    deleted_files := array_append(deleted_files, video_record.thumbnail_url);
  END IF;
  
  IF video_record.preview_url IS NOT NULL THEN
    deleted_files := array_append(deleted_files, video_record.preview_url);
  END IF;

  -- Excluir todas as referências em cascata
  DELETE FROM favoritos WHERE video_id = video_id_param;
  DELETE FROM video_downloads WHERE video_id = video_id_param;
  DELETE FROM avaliacoes WHERE video_id = video_id_param;
  
  -- Atualizar referências em outras tabelas (setar como NULL)
  UPDATE roteiros SET evento_agenda_id = NULL WHERE evento_agenda_id = video_id_param;
  UPDATE content_planner_items SET script_id = NULL WHERE script_id::uuid = video_id_param;
  UPDATE approved_scripts SET id = NULL WHERE id = video_id_param;
  UPDATE before_after_photos SET approved_script_id = NULL WHERE approved_script_id = video_id_param;
  
  -- Excluir o vídeo principal
  DELETE FROM videos WHERE id = video_id_param;

  -- Log da operação
  INSERT INTO audit_log (table_name, operation, old_data, user_id)
  VALUES ('videos', 'CASCADE_DELETE', to_jsonb(video_record), auth.uid());

  RETURN jsonb_build_object(
    'success', true,
    'deleted_files', to_jsonb(deleted_files),
    'message', 'Vídeo excluído completamente'
  );
END;
$$;

-- Criar função para exclusão completa de documentos técnicos (artigos científicos)
CREATE OR REPLACE FUNCTION public.delete_document_cascade(document_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  document_record RECORD;
  deleted_files TEXT[] := '{}';
  result JSONB;
BEGIN
  -- Buscar informações do documento antes de excluir
  SELECT * INTO document_record FROM documentos_tecnicos WHERE id = document_id_param;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Documento não encontrado'
    );
  END IF;

  -- Coletar URLs de arquivos para cleanup
  IF document_record.link_dropbox IS NOT NULL THEN
    deleted_files := array_append(deleted_files, document_record.link_dropbox);
  END IF;

  -- Excluir o documento principal
  DELETE FROM documentos_tecnicos WHERE id = document_id_param;

  -- Log da operação
  INSERT INTO audit_log (table_name, operation, old_data, user_id)
  VALUES ('documentos_tecnicos', 'CASCADE_DELETE', to_jsonb(document_record), auth.uid());

  RETURN jsonb_build_object(
    'success', true,
    'deleted_files', to_jsonb(deleted_files),
    'message', 'Documento excluído completamente'
  );
END;
$$;

-- Criar função para exclusão completa de fotos antes/depois
CREATE OR REPLACE FUNCTION public.delete_before_after_cascade(photo_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  photo_record RECORD;
  deleted_files TEXT[] := '{}';
  result JSONB;
BEGIN
  -- Buscar informações da foto antes de excluir
  SELECT * INTO photo_record FROM before_after_photos WHERE id = photo_id_param;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Foto não encontrada'
    );
  END IF;

  -- Coletar URLs de arquivos para cleanup
  IF photo_record.before_image_url IS NOT NULL THEN
    deleted_files := array_append(deleted_files, photo_record.before_image_url);
  END IF;
  
  IF photo_record.after_image_url IS NOT NULL THEN
    deleted_files := array_append(deleted_files, photo_record.after_image_url);
  END IF;

  -- Excluir a foto principal
  DELETE FROM before_after_photos WHERE id = photo_id_param;

  -- Log da operação
  INSERT INTO audit_log (table_name, operation, old_data, user_id)
  VALUES ('before_after_photos', 'CASCADE_DELETE', to_jsonb(photo_record), auth.uid());

  RETURN jsonb_build_object(
    'success', true,
    'deleted_files', to_jsonb(deleted_files),
    'message', 'Foto excluída completamente'
  );
END;
$$;

-- Criar função para exclusão completa de materiais
CREATE OR REPLACE FUNCTION public.delete_material_cascade(material_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  material_record RECORD;
  deleted_files TEXT[] := '{}';
  result JSONB;
BEGIN
  -- Buscar informações do material antes de excluir
  SELECT * INTO material_record FROM materiais WHERE id = material_id_param;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Material não encontrado'
    );
  END IF;

  -- Coletar URLs de arquivos para cleanup
  IF material_record.arquivo_url IS NOT NULL THEN
    deleted_files := array_append(deleted_files, material_record.arquivo_url);
  END IF;
  
  IF material_record.preview_url IS NOT NULL THEN
    deleted_files := array_append(deleted_files, material_record.preview_url);
  END IF;

  -- Excluir o material principal
  DELETE FROM materiais WHERE id = material_id_param;

  -- Log da operação
  INSERT INTO audit_log (table_name, operation, old_data, user_id)
  VALUES ('materiais', 'CASCADE_DELETE', to_jsonb(material_record), auth.uid());

  RETURN jsonb_build_object(
    'success', true,
    'deleted_files', to_jsonb(deleted_files),
    'message', 'Material excluído completamente'
  );
END;
$$;

-- Criar função para exclusão completa de downloads storage
CREATE OR REPLACE FUNCTION public.delete_download_storage_cascade(download_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  download_record RECORD;
  deleted_files TEXT[] := '{}';
  result JSONB;
BEGIN
  -- Buscar informações do download antes de excluir
  SELECT * INTO download_record FROM downloads_storage WHERE id = download_id_param;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Download não encontrado'
    );
  END IF;

  -- Coletar URLs de arquivos para cleanup
  IF download_record.file_url IS NOT NULL THEN
    deleted_files := array_append(deleted_files, download_record.file_url);
  END IF;
  
  IF download_record.thumbnail_url IS NOT NULL THEN
    deleted_files := array_append(deleted_files, download_record.thumbnail_url);
  END IF;

  -- Excluir o download principal
  DELETE FROM downloads_storage WHERE id = download_id_param;

  -- Log da operação
  INSERT INTO audit_log (table_name, operation, old_data, user_id)
  VALUES ('downloads_storage', 'CASCADE_DELETE', to_jsonb(download_record), auth.uid());

  RETURN jsonb_build_object(
    'success', true,
    'deleted_files', to_jsonb(deleted_files),
    'message', 'Download excluído completamente'
  );
END;
$$;
