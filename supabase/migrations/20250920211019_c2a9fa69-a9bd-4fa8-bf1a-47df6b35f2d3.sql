-- Fix RLS policies for perfis table to allow proper user deletion

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.perfis;
DROP POLICY IF EXISTS "Only admins can update profiles" ON public.perfis;

-- Create specific policies for each operation
CREATE POLICY "Admins can view all profiles" ON public.perfis
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "Users can view own profile" ON public.perfis
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can insert profiles" ON public.perfis
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "Admins can update profiles" ON public.perfis
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "Admins can delete profiles" ON public.perfis
FOR DELETE 
USING (
  -- Allow admins to delete profiles, but with restrictions
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
  AND 
  -- Prevent self-deletion
  id != auth.uid()
  AND
  -- Prevent regular admins from deleting superadmins
  (
    role != 'superadmin' 
    OR 
    auth.uid() IN (
      SELECT id FROM public.perfis 
      WHERE role = 'superadmin'
    )
  )
);

-- Create a function to delete user profile with cascade
CREATE OR REPLACE FUNCTION public.delete_user_profile_cascade(profile_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_record RECORD;
  current_user_role TEXT;
  target_user_role TEXT;
  result JSONB;
BEGIN
  -- Get current user role
  SELECT role INTO current_user_role 
  FROM public.perfis 
  WHERE id = auth.uid();
  
  -- Check if current user is admin
  IF current_user_role NOT IN ('admin', 'superadmin') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Acesso negado. Apenas administradores podem excluir usuários.'
    );
  END IF;
  
  -- Get target user info
  SELECT * INTO profile_record 
  FROM public.perfis 
  WHERE id = profile_id_param;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Usuário não encontrado'
    );
  END IF;
  
  target_user_role := profile_record.role;
  
  -- Prevent self-deletion
  IF profile_id_param = auth.uid() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Você não pode excluir seu próprio perfil'
    );
  END IF;
  
  -- Prevent regular admins from deleting superadmins
  IF target_user_role = 'superadmin' AND current_user_role != 'superadmin' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Apenas superadministradores podem excluir outros superadministradores'
    );
  END IF;
  
  -- Delete related data in cascade
  DELETE FROM public.user_actions WHERE user_id = profile_id_param;
  DELETE FROM public.favoritos WHERE usuario_id = profile_id_param;
  DELETE FROM public.video_downloads WHERE user_id = profile_id_param;
  DELETE FROM public.avaliacoes WHERE usuario_id = profile_id_param;
  DELETE FROM public.agenda WHERE usuario_id = profile_id_param;
  DELETE FROM public.alertas_email WHERE usuario_id = profile_id_param;
  DELETE FROM public.user_feature_permissions WHERE user_id = profile_id_param;
  DELETE FROM public.user_gamification WHERE user_id = profile_id_param;
  DELETE FROM public.user_purchase_scores WHERE user_id = profile_id_param;
  DELETE FROM public.academy_user_course_access WHERE user_id = profile_id_param;
  DELETE FROM public.academy_user_lesson_progress WHERE user_id = profile_id_param;
  DELETE FROM public.academy_user_exam_attempts WHERE user_id = profile_id_param;
  DELETE FROM public.academy_user_survey_responses WHERE user_id = profile_id_param;
  
  -- Delete the profile
  DELETE FROM public.perfis WHERE id = profile_id_param;
  
  -- Log the operation
  INSERT INTO public.audit_log (table_name, operation, old_data, user_id)
  VALUES ('perfis', 'CASCADE_DELETE', to_jsonb(profile_record), auth.uid());
  
  -- Also delete from auth.users if needed (this will cascade automatically)
  -- Note: This should be done carefully as it will completely remove the user from auth
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Usuário excluído com sucesso',
    'deleted_user', profile_record.nome || ' (' || profile_record.email || ')'
  );
END;
$$;