-- Final cleanup: Remove Giovanni user completely
DO $$
DECLARE
    giovanni_user_id UUID;
    superadmin_id UUID;
    cleanup_report TEXT := 'Database Cleanup Report:' || E'\n';
BEGIN
    -- Get superadmin ID for audit logging
    SELECT id INTO superadmin_id FROM perfis WHERE role = 'superadmin' LIMIT 1;
    
    -- Get Giovanni's user ID
    SELECT id INTO giovanni_user_id 
    FROM perfis 
    WHERE email = 'giovani@contourline.com.br';
    
    IF giovanni_user_id IS NOT NULL THEN
        cleanup_report := cleanup_report || '- Found Giovanni user: ' || giovanni_user_id || E'\n';
        
        -- Clean all related data
        DELETE FROM intent_history WHERE user_id = giovanni_user_id;
        DELETE FROM ai_feedback WHERE user_id = giovanni_user_id;
        DELETE FROM ai_usage_metrics WHERE user_id = giovanni_user_id;
        DELETE FROM user_actions WHERE user_id = giovanni_user_id;
        DELETE FROM favoritos WHERE usuario_id = giovanni_user_id;
        DELETE FROM video_downloads WHERE user_id = giovanni_user_id;
        DELETE FROM avaliacoes WHERE usuario_id = giovanni_user_id;
        DELETE FROM agenda WHERE usuario_id = giovanni_user_id;
        DELETE FROM alertas_email WHERE usuario_id = giovanni_user_id;
        DELETE FROM user_feature_permissions WHERE user_id = giovanni_user_id;
        DELETE FROM user_gamification WHERE user_id = giovanni_user_id;
        DELETE FROM user_purchase_scores WHERE user_id = giovanni_user_id;
        DELETE FROM approved_scripts WHERE user_id = giovanni_user_id;
        DELETE FROM before_after_photos WHERE user_id = giovanni_user_id;
        DELETE FROM content_planner_items WHERE user_id = giovanni_user_id;
        DELETE FROM unified_documents WHERE user_id = giovanni_user_id;
        DELETE FROM ad_creative_performance WHERE user_id = giovanni_user_id;
        DELETE FROM academy_access_requests WHERE user_id = giovanni_user_id;
        DELETE FROM academy_user_course_access WHERE user_id = giovanni_user_id;
        DELETE FROM academy_user_lesson_progress WHERE user_id = giovanni_user_id;
        DELETE FROM academy_user_exam_attempts WHERE user_id = giovanni_user_id;
        DELETE FROM academy_user_survey_responses WHERE user_id = giovanni_user_id;
        DELETE FROM academy_lesson_feedback WHERE user_id = giovanni_user_id;
        
        cleanup_report := cleanup_report || '- Cleaned all related data tables' || E'\n';
        
        -- Remove from perfis table
        DELETE FROM perfis WHERE id = giovanni_user_id;
        cleanup_report := cleanup_report || '- Removed from perfis table' || E'\n';
        
        -- Remove from auth.users
        DELETE FROM auth.users WHERE id = giovanni_user_id;
        cleanup_report := cleanup_report || '- Removed from auth.users table' || E'\n';
    END IF;
    
    -- Clean any orphaned auth.users records by email
    DELETE FROM auth.users 
    WHERE email IN ('giovani@contourline.com.br', 'giovani.g2008@gmail.com');
    
    cleanup_report := cleanup_report || '- Cleaned auth.users by email' || E'\n';
    cleanup_report := cleanup_report || '- Completed cleanup at: ' || now() || E'\n';
    
    RAISE NOTICE '%', cleanup_report;
    
    -- Log the cleanup with proper admin_user_id
    IF superadmin_id IS NOT NULL THEN
        INSERT INTO admin_audit_log (
            admin_user_id, 
            action_type, 
            old_values
        ) VALUES (
            superadmin_id,
            'GIOVANNI_CLEANUP',
            jsonb_build_object('report', cleanup_report, 'user_id', giovanni_user_id)
        );
    END IF;
    
END $$;