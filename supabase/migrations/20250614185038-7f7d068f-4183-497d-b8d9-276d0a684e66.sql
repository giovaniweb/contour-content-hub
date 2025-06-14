
-- Criação da tabela de status dos serviços do sistema
CREATE TABLE public.system_services_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  endpoint TEXT,
  status TEXT NOT NULL, -- Ex: 'operational', 'degraded', 'down'
  last_checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  message TEXT,
  latency_ms INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS para admin somente visualização e alteração
ALTER TABLE public.system_services_status ENABLE ROW LEVEL SECURITY;

-- Política: admins podem ver e alterar
CREATE POLICY "Admins podem gerenciar status serviço" ON public.system_services_status
  USING (
    EXISTS (
      SELECT 1
      FROM perfis
      WHERE perfis.id = auth.uid()
      AND perfis.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM perfis
      WHERE perfis.id = auth.uid()
      AND perfis.role = 'admin'
    )
  );

-- Índice para facilitar buscas por slug
CREATE INDEX idx_system_service_status_slug ON public.system_services_status (slug);
