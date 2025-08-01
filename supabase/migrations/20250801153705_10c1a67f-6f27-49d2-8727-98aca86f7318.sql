-- P2-001: Tabela para monitoramento de custos de IA
CREATE TABLE IF NOT EXISTS public.ai_usage_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name text NOT NULL,
  endpoint text NOT NULL,
  prompt_tokens integer NOT NULL DEFAULT 0,
  completion_tokens integer NOT NULL DEFAULT 0,
  total_tokens integer NOT NULL DEFAULT 0,
  estimated_cost decimal(10,6) NOT NULL DEFAULT 0,
  model text NOT NULL,
  user_id uuid,
  response_time_ms integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Índices para consultas de custos
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_date 
ON public.ai_usage_metrics(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_usage_service_date 
ON public.ai_usage_metrics(service_name, created_at DESC);

-- RLS para métricas de IA (apenas admins podem ver tudo)
ALTER TABLE public.ai_usage_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all AI metrics" 
ON public.ai_usage_metrics FOR SELECT 
USING (auth.uid() IN (
  SELECT id FROM public.perfis WHERE role = 'admin'
));

CREATE POLICY "Users can view their own AI metrics" 
ON public.ai_usage_metrics FOR SELECT 
USING (auth.uid() = user_id);

-- Sistema pode inserir métricas
CREATE POLICY "System can insert AI metrics" 
ON public.ai_usage_metrics FOR INSERT 
WITH CHECK (true);