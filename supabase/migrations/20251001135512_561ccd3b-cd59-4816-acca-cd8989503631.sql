-- Adicionar coluna user_override_status na tabela user_feature_permissions
ALTER TABLE public.user_feature_permissions 
ADD COLUMN IF NOT EXISTS user_override_status text 
CHECK (user_override_status IN ('blocked', 'coming_soon', 'beta', 'released'));

-- Adicionar comentário explicativo
COMMENT ON COLUMN public.user_feature_permissions.user_override_status IS 
'Status específico para este usuário, sobrescreve o status global da feature se definido';

-- Criar função para obter o status efetivo (override do usuário ou global)
CREATE OR REPLACE FUNCTION public.get_effective_feature_status(
  p_user_id uuid,
  p_feature text
)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_override text;
  global_status text;
BEGIN
  -- Primeiro verificar se há override do usuário
  SELECT user_override_status INTO user_override
  FROM public.user_feature_permissions
  WHERE user_id = p_user_id AND feature = p_feature;
  
  -- Se há override, retornar ele
  IF user_override IS NOT NULL THEN
    RETURN user_override;
  END IF;
  
  -- Caso contrário, retornar status global
  SELECT status INTO global_status
  FROM public.user_feature_permissions
  WHERE user_id = p_user_id AND feature = p_feature;
  
  RETURN COALESCE(global_status, 'blocked');
END;
$$;

-- Criar tabela para histórico de mudanças de status por usuário
CREATE TABLE IF NOT EXISTS public.user_feature_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  feature text NOT NULL,
  old_status text,
  new_status text NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  change_reason text,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_feature_status_history ENABLE ROW LEVEL SECURITY;

-- Admins podem ver todo o histórico
CREATE POLICY "Admins can view all status history"
ON public.user_feature_status_history
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
);

-- System pode inserir no histórico
CREATE POLICY "System can insert status history"
ON public.user_feature_status_history
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_feature_status_history_user 
ON public.user_feature_status_history(user_id);

CREATE INDEX IF NOT EXISTS idx_user_feature_status_history_feature 
ON public.user_feature_status_history(feature);

CREATE INDEX IF NOT EXISTS idx_user_feature_permissions_override 
ON public.user_feature_permissions(user_id, feature, user_override_status);