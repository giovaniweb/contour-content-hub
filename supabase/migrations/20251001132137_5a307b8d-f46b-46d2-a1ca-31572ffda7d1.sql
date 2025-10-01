-- Fase 1: Migration do sistema de status de features

-- 1. Criar ENUM para feature_status
CREATE TYPE feature_status AS ENUM ('blocked', 'coming_soon', 'beta', 'released');

-- 2. Adicionar coluna status na tabela user_feature_permissions
ALTER TABLE public.user_feature_permissions 
ADD COLUMN status feature_status DEFAULT 'blocked';

-- 3. Migrar dados existentes (enabled → status)
UPDATE public.user_feature_permissions 
SET status = CASE 
  WHEN enabled = true THEN 'released'::feature_status
  ELSE 'blocked'::feature_status
END;

-- 4. Tornar a coluna status NOT NULL após migração
ALTER TABLE public.user_feature_permissions 
ALTER COLUMN status SET NOT NULL;

-- 5. Criar tabela de logs de alterações de status
CREATE TABLE public.feature_status_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature app_feature NOT NULL,
  old_status feature_status,
  new_status feature_status NOT NULL,
  changed_by UUID REFERENCES auth.users(id) NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  notes TEXT,
  affected_users_count INTEGER DEFAULT 0
);

-- 6. Habilitar RLS na tabela de logs
ALTER TABLE public.feature_status_changes ENABLE ROW LEVEL SECURITY;

-- 7. Políticas RLS para feature_status_changes
CREATE POLICY "Admins can view all feature status changes"
ON public.feature_status_changes
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.perfis WHERE role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "System can insert feature status changes"
ON public.feature_status_changes
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.perfis WHERE role IN ('admin', 'superadmin')
  )
);

-- 8. Criar índices para performance
CREATE INDEX idx_feature_status_changes_feature ON public.feature_status_changes(feature);
CREATE INDEX idx_feature_status_changes_changed_at ON public.feature_status_changes(changed_at DESC);
CREATE INDEX idx_user_feature_permissions_status ON public.user_feature_permissions(status);

-- 9. Comentários para documentação
COMMENT ON TYPE feature_status IS 'Status global de uma feature: blocked (bloqueado), coming_soon (em breve), beta (em teste), released (liberado)';
COMMENT ON COLUMN user_feature_permissions.status IS 'Status atual da feature para o usuário';
COMMENT ON TABLE feature_status_changes IS 'Log de auditoria de mudanças de status de features';