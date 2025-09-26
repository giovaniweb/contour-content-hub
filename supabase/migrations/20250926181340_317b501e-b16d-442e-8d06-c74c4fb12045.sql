-- Dropar e recriar função delete_auth_user para corrigir ambiguidade e adicionar limpeza de intent_history
DROP FUNCTION IF EXISTS public.delete_auth_user(uuid);

CREATE OR REPLACE FUNCTION public.delete_auth_user(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_role text;
  deleted_files text[] := '{}';
BEGIN
  -- Verificar se o usuário atual é admin
  SELECT role INTO current_user_role 
  FROM public.perfis 
  WHERE id = auth.uid();
  
  IF current_user_role NOT IN ('admin', 'superadmin') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Acesso negado. Apenas administradores podem excluir usuários.'
    );
  END IF;
  
  -- Não permitir auto-exclusão
  IF user_id_param = auth.uid() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Você não pode excluir seu próprio usuário.'
    );
  END IF;

  -- Log da operação ANTES da exclusão
  INSERT INTO public.admin_audit_log (
    admin_user_id, action_type, target_user_id, old_values
  ) VALUES (
    auth.uid(), 'DELETE_USER_COMPLETE', user_id_param,
    jsonb_build_object(
      'timestamp', now(),
      'deletion_type', 'complete_cascade'
    )
  );

  -- Remover todas as referências do usuário (CASCADE MANUAL completo)
  
  -- 1. Remover histórico de intenções (para corrigir constraint)
  DELETE FROM public.intent_history WHERE user_id = user_id_param;
  
  -- 2. Remover ações do usuário
  DELETE FROM public.user_actions WHERE user_id = user_id_param;
  
  -- 3. Remover favoritos
  DELETE FROM public.favoritos WHERE usuario_id = user_id_param;
  
  -- 4. Remover downloads de vídeos
  DELETE FROM public.video_downloads WHERE user_id = user_id_param;
  
  -- 5. Remover avaliações
  DELETE FROM public.avaliacoes WHERE usuario_id = user_id_param;
  
  -- 6. Remover agenda
  DELETE FROM public.agenda WHERE usuario_id = user_id_param;
  
  -- 7. Remover alertas de email
  DELETE FROM public.alertas_email WHERE usuario_id = user_id_param;
  
  -- 8. Remover permissões de features
  DELETE FROM public.user_feature_permissions WHERE user_id = user_id_param;
  
  -- 9. Remover gamificação
  DELETE FROM public.user_gamification WHERE user_id = user_id_param;
  
  -- 10. Remover scores de compra
  DELETE FROM public.user_purchase_scores WHERE user_id = user_id_param;
  
  -- 11. Remover acesso a cursos da academia
  DELETE FROM public.academy_user_course_access WHERE user_id = user_id_param;
  
  -- 12. Remover progresso de lições
  DELETE FROM public.academy_user_lesson_progress WHERE user_id = user_id_param;
  
  -- 13. Remover tentativas de exames
  DELETE FROM public.academy_user_exam_attempts WHERE user_id = user_id_param;
  
  -- 14. Remover respostas de pesquisas
  DELETE FROM public.academy_user_survey_responses WHERE user_id = user_id_param;
  
  -- 15. Remover feedback de lições
  DELETE FROM public.academy_lesson_feedback WHERE user_id = user_id_param;
  
  -- 16. Remover solicitações de acesso
  DELETE FROM public.academy_access_requests WHERE user_id = user_id_param;
  
  -- 17. Remover métricas de IA
  DELETE FROM public.ai_usage_metrics WHERE user_id = user_id_param;
  
  -- 18. Remover feedback de IA
  DELETE FROM public.ai_feedback WHERE user_id = user_id_param;
  
  -- 19. Remover memória do usuário
  DELETE FROM public.user_memory WHERE user_id = user_id_param;
  
  -- 20. Remover uso do usuário
  DELETE FROM public.user_usage WHERE user_id = user_id_param;
  
  -- 21. Remover performance de criativos
  DELETE FROM public.ad_creative_performance WHERE user_id = user_id_param;
  
  -- Finalmente, excluir o perfil do usuário
  DELETE FROM public.perfis WHERE id = user_id_param;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Usuário excluído completamente',
    'deleted_files', to_jsonb(deleted_files)
  );
END;
$function$;