-- ===================================
-- MIGRAÇÃO DE HIGIENIZAÇÃO DE SEGURANÇA
-- CORREÇÃO DE VULNERABILIDADES CRÍTICAS
-- ===================================

-- 1. ATIVAR RLS NAS TABELAS SEM PROTEÇÃO
-- =====================================

-- Tabela documentos_tecnicos - já tem RLS mas só ENABLE, vamos ativar FORCE também
ALTER TABLE public.documentos_tecnicos FORCE ROW LEVEL SECURITY;

-- Tabela database_documentation - ativar RLS
ALTER TABLE public.database_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.database_documentation FORCE ROW LEVEL SECURITY;

-- Tabela logs_uso - ativar RLS  
ALTER TABLE public.logs_uso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_uso FORCE ROW LEVEL SECURITY;

-- 2. CRIAR POLÍTICAS RLS PARA TABELAS SEM POLÍTICAS
-- =================================================

-- Políticas para database_documentation (apenas admins podem gerenciar)
CREATE POLICY "Only admins can view database documentation"
  ON public.database_documentation
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.perfis WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can manage database documentation"
  ON public.database_documentation
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.perfis WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.perfis WHERE role = 'admin'
    )
  );

-- 3. CONFIGURAR SEARCH_PATH EM TODAS AS FUNÇÕES
-- =============================================

-- Função update_content_strategy_timestamp
CREATE OR REPLACE FUNCTION public.update_content_strategy_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Função track_ai_usage
CREATE OR REPLACE FUNCTION public.track_ai_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Update user usage metrics
  UPDATE public.user_usage
  SET ai_generations_used = ai_generations_used + 1, 
      last_activity = now()
  WHERE user_id = NEW.usuario_id;
  
  -- If no row exists for this user, create one with default plan (Free)
  IF NOT FOUND THEN
    INSERT INTO public.user_usage (
      user_id, 
      plan_id,
      ai_generations_used
    ) VALUES (
      NEW.usuario_id,
      (SELECT id FROM public.subscription_plans WHERE name = 'Free' LIMIT 1),
      1
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Função update_marketing_diagnostics_updated_at
CREATE OR REPLACE FUNCTION public.update_marketing_diagnostics_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função audit_trigger_function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (table_name, operation, old_data, user_id)
    VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (table_name, operation, old_data, new_data, user_id)
    VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (table_name, operation, new_data, user_id)
    VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;

-- Função update_content_preferences
CREATE OR REPLACE FUNCTION public.update_content_preferences()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Check if we have a user content profile already
  IF EXISTS (SELECT 1 FROM public.user_content_profiles WHERE user_id = NEW.user_id) THEN
    -- Update existing profile with new preferences
    UPDATE public.user_content_profiles
    SET updated_at = now()
    WHERE user_id = NEW.user_id;
  ELSE
    -- Create new profile
    INSERT INTO public.user_content_profiles (user_id)
    VALUES (NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Função update_videos_timestamp
CREATE OR REPLACE FUNCTION public.update_videos_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função update_mentores_updated_at
CREATE OR REPLACE FUNCTION public.update_mentores_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função update_content_planner_items_updated_at
CREATE OR REPLACE FUNCTION public.update_content_planner_items_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função update_equipment_applicators_updated_at
CREATE OR REPLACE FUNCTION public.update_equipment_applicators_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função update_approved_scripts_updated_at
CREATE OR REPLACE FUNCTION public.update_approved_scripts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função update_instagram_accounts_updated_at
CREATE OR REPLACE FUNCTION public.update_instagram_accounts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

-- Função handle_document_content_change
CREATE OR REPLACE FUNCTION public.handle_document_content_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Mark that embeddings need to be regenerated
  -- (actual embedding generation would happen via an edge function)
  NEW.vetor_embeddings = NULL;
  RETURN NEW;
END;
$function$;

-- Função update_brands_updated_at
CREATE OR REPLACE FUNCTION public.update_brands_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função update_instagram_configs_updated_at
CREATE OR REPLACE FUNCTION public.update_instagram_configs_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função update_before_after_photos_updated_at
CREATE OR REPLACE FUNCTION public.update_before_after_photos_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função update_unified_documents_updated_at
CREATE OR REPLACE FUNCTION public.update_unified_documents_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função cleanup_completed_uploads
CREATE OR REPLACE FUNCTION public.cleanup_completed_uploads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  DELETE FROM public.video_upload_queue
  WHERE status = 'completed'
  AND completed_at < now() - interval '24 hours';
END;
$function$;

-- Função update_blog_posts_updated_at
CREATE OR REPLACE FUNCTION public.update_blog_posts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função update_modified_column
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$function$;

-- Função increment_photo_likes_count
CREATE OR REPLACE FUNCTION public.increment_photo_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.equipment_photos
  SET likes_count = COALESCE(likes_count, 0) + 1
  WHERE id = NEW.photo_id;
  RETURN NEW;
END;
$function$;

-- Função decrement_photo_likes_count
CREATE OR REPLACE FUNCTION public.decrement_photo_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.equipment_photos
  SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
  WHERE id = OLD.photo_id;
  RETURN OLD;
END;
$function$;

-- Função increment_photo_downloads_count
CREATE OR REPLACE FUNCTION public.increment_photo_downloads_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.equipment_photos
  SET downloads_count = COALESCE(downloads_count, 0) + 1
  WHERE id = NEW.photo_id;
  RETURN NEW;
END;
$function$;

-- Função update_about_page_updated_at
CREATE OR REPLACE FUNCTION public.update_about_page_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função update_products_updated_at
CREATE OR REPLACE FUNCTION public.update_products_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Função criar_perfil_novo_usuario
CREATE OR REPLACE FUNCTION public.criar_perfil_novo_usuario()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
BEGIN
  INSERT INTO public.perfis (id, nome, email)
  VALUES (new.id, new.raw_user_meta_data->>'nome', new.email);
  RETURN NEW;
END;
$function$;

-- Função get_user_role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT role FROM public.perfis WHERE id = user_id;
$function$;

-- Função increment_tag_usage
CREATE OR REPLACE FUNCTION public.increment_tag_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.tags
  SET usado_count = usado_count + 1
  WHERE nome = ANY(NEW.tags);
  RETURN NEW;
END;
$function$;

-- Função increment_favorites_count
CREATE OR REPLACE FUNCTION public.increment_favorites_count(video_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE videos
  SET favoritos_count = COALESCE(favoritos_count, 0) + 1
  WHERE id = video_id;
END;
$function$;

-- Função decrement_favorites_count
CREATE OR REPLACE FUNCTION public.decrement_favorites_count(video_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE videos
  SET favoritos_count = GREATEST(COALESCE(favoritos_count, 0) - 1, 0)
  WHERE id = video_id;
END;
$function$;

-- Funções delete_*_cascade com SET search_path
CREATE OR REPLACE FUNCTION public.delete_video_cascade(video_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Função create_unified_document
CREATE OR REPLACE FUNCTION public.create_unified_document(p_title text, p_content text, p_conclusion text, p_keywords text[], p_authors text[], p_raw_text text, p_file_path text, p_user_id uuid, p_equipamento_id uuid DEFAULT NULL::uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Demais funções delete_*_cascade com SET search_path
CREATE OR REPLACE FUNCTION public.delete_before_after_cascade(photo_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.delete_material_cascade(material_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.delete_download_storage_cascade(download_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.delete_document_cascade(document_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- 4. COMMENT PARA DOCUMENTAR A MIGRAÇÃO
-- ===================================
COMMENT ON MIGRATION IS 'Higienização de segurança: Ativação de RLS, configuração de search_path e políticas de segurança';