-- Melhorar a função delete_auth_user para garantir exclusão 100% completa
CREATE OR REPLACE FUNCTION public.delete_auth_user(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_user_role text;
  deleted_files text[] := '{}';
BEGIN
  -- Verificar se o usuário atual é admin
  SELECT role INTO current_user_role 
  FROM public.perfis 
  WHERE id = auth.uid();
  
  IF current_user_role NOT IN ('admin', 'superadmin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem excluir usuários.';
  END IF;
  
  -- Não permitir auto-exclusão
  IF user_id = auth.uid() THEN
    RAISE EXCEPTION 'Você não pode excluir seu próprio usuário.';
  END IF;

  -- Log da operação ANTES da exclusão
  INSERT INTO public.admin_audit_log (
    admin_user_id, action_type, target_user_id, old_values
  ) VALUES (
    auth.uid(), 'DELETE_USER_COMPLETE', user_id,
    jsonb_build_object(
      'timestamp', now(),
      'deletion_type', 'complete_cascade'
    )
  );

  -- Remover todas as referências do usuário (CASCADE MANUAL completo)
  
  -- 1. Remover ações do usuário
  DELETE FROM public.user_actions WHERE user_id = user_id;
  
  -- 2. Remover favoritos
  DELETE FROM public.favoritos WHERE usuario_id = user_id;
  
  -- 3. Remover downloads de vídeos
  DELETE FROM public.video_downloads WHERE user_id = user_id;
  
  -- 4. Remover avaliações
  DELETE FROM public.avaliacoes WHERE usuario_id = user_id;
  
  -- 5. Remover agenda
  DELETE FROM public.agenda WHERE usuario_id = user_id;
  
  -- 6. Remover alertas de email
  DELETE FROM public.alertas_email WHERE usuario_id = user_id;
  
  -- 7. Remover permissões de features
  DELETE FROM public.user_feature_permissions WHERE user_id = user_id;
  
  -- 8. Remover gamificação
  DELETE FROM public.user_gamification WHERE user_id = user_id;
  
  -- 9. Remover scores de compra
  DELETE FROM public.user_purchase_scores WHERE user_id = user_id;
  
  -- 10. Remover acesso a cursos da academia
  DELETE FROM public.academy_user_course_access WHERE user_id = user_id;
  
  -- 11. Remover progresso de lições
  DELETE FROM public.academy_user_lesson_progress WHERE user_id = user_id;
  
  -- 12. Remover tentativas de exames
  DELETE FROM public.academy_user_exam_attempts WHERE user_id = user_id;
  
  -- 13. Remover respostas de pesquisas
  DELETE FROM public.academy_user_survey_responses WHERE user_id = user_id;
  
  -- 14. Remover feedback de IA
  DELETE FROM public.ai_feedback WHERE user_id = user_id;
  
  -- 15. Remover métricas de uso de IA
  DELETE FROM public.ai_usage_metrics WHERE user_id = user_id;
  
  -- 16. Remover memória do usuário
  DELETE FROM public.user_memory WHERE user_id = user_id;
  
  -- 17. Remover perfil de conteúdo
  DELETE FROM public.user_content_profiles WHERE user_id = user_id;
  
  -- 18. Remover uso do sistema
  DELETE FROM public.user_usage WHERE user_id = user_id;
  
  -- 19. Remover performance de anúncios
  DELETE FROM public.ad_creative_performance WHERE user_id = user_id;
  
  -- 20. Remover roteiros aprovados
  DELETE FROM public.approved_scripts WHERE user_id = user_id;
  
  -- 21. Remover documentos unificados
  DELETE FROM public.unified_documents WHERE user_id = user_id;
  
  -- 22. Remover logs de auditoria relacionados (como target)
  DELETE FROM public.admin_audit_log WHERE target_user_id = user_id;
  
  -- 23. Finalmente, remover o perfil (isso deve remover da auth.users via CASCADE)
  DELETE FROM public.perfis WHERE id = user_id;
  
  -- 24. Se ainda existir em auth.users, remover diretamente
  DELETE FROM auth.users WHERE id = user_id;
  
  RETURN true;
END;
$$;