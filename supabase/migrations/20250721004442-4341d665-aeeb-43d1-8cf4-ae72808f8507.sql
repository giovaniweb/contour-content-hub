-- ===================================
-- SISTEMA DE APRENDIZADO CONTÍNUO
-- FEEDBACK LOOP E AJUSTE DE PROMPTS
-- ===================================

-- 1. TABELA DE FEEDBACK DE IA
-- =============================
CREATE TABLE public.ai_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  ai_service TEXT NOT NULL, -- 'mestre_beleza', 'marketing_consultant', 'script_generator', etc.
  prompt_used TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  user_feedback JSONB NOT NULL, -- { rating: 1-5, helpful: boolean, accuracy: 1-5, relevance: 1-5, comments: string }
  feedback_type TEXT NOT NULL DEFAULT 'explicit', -- 'explicit', 'implicit', 'auto'
  context_data JSONB DEFAULT '{}',
  response_time_ms INTEGER,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  improvement_applied BOOLEAN DEFAULT false
);

-- Índices para performance
CREATE INDEX idx_ai_feedback_service ON public.ai_feedback(ai_service);
CREATE INDEX idx_ai_feedback_user ON public.ai_feedback(user_id);
CREATE INDEX idx_ai_feedback_created ON public.ai_feedback(created_at);
CREATE INDEX idx_ai_feedback_rating ON public.ai_feedback((user_feedback->>'rating'));

-- 2. TABELA DE PROMPT TEMPLATES E VERSÕES
-- ========================================
CREATE TABLE public.ai_prompt_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  system_instructions TEXT,
  parameters JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}', -- { avg_rating: 4.2, usage_count: 150, success_rate: 0.95 }
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  auto_generated BOOLEAN DEFAULT false,
  
  UNIQUE(service_name, prompt_version)
);

-- Índices
CREATE INDEX idx_prompt_templates_service ON public.ai_prompt_templates(service_name);
CREATE INDEX idx_prompt_templates_active ON public.ai_prompt_templates(service_name, is_active);

-- 3. TABELA DE MÉTRICAS DE PERFORMANCE IA
-- =======================================
CREATE TABLE public.ai_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  avg_response_time_ms DOUBLE PRECISION DEFAULT 0,
  avg_rating DOUBLE PRECISION DEFAULT 0,
  total_tokens_used BIGINT DEFAULT 0,
  estimated_cost DOUBLE PRECISION DEFAULT 0,
  user_satisfaction DOUBLE PRECISION DEFAULT 0, -- baseado em feedback
  error_rate DOUBLE PRECISION DEFAULT 0,
  improvement_opportunities JSONB DEFAULT '[]',
  auto_adjustments_made INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(service_name, metric_date)
);

-- Índices
CREATE INDEX idx_performance_metrics_service ON public.ai_performance_metrics(service_name);
CREATE INDEX idx_performance_metrics_date ON public.ai_performance_metrics(metric_date);

-- 4. TABELA DE LOGS DE APRENDIZADO
-- =================================
CREATE TABLE public.ai_learning_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  learning_type TEXT NOT NULL, -- 'prompt_adjustment', 'parameter_tuning', 'template_update'
  trigger_event TEXT NOT NULL, -- 'low_rating', 'high_error_rate', 'user_complaint', 'auto_analysis'
  before_state JSONB NOT NULL,
  after_state JSONB NOT NULL,
  improvement_metrics JSONB DEFAULT '{}',
  confidence_score DOUBLE PRECISION DEFAULT 0, -- 0-1 confidence in the improvement
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  rollback_at TIMESTAMP WITH TIME ZONE,
  success_validated BOOLEAN,
  validation_metrics JSONB DEFAULT '{}'
);

-- Índices
CREATE INDEX idx_learning_log_service ON public.ai_learning_log(service_name);
CREATE INDEX idx_learning_log_type ON public.ai_learning_log(learning_type);
CREATE INDEX idx_learning_log_applied ON public.ai_learning_log(applied_at);

-- 5. HABILITAR RLS EM TODAS AS TABELAS
-- ====================================
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback FORCE ROW LEVEL SECURITY;

ALTER TABLE public.ai_prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prompt_templates FORCE ROW LEVEL SECURITY;

ALTER TABLE public.ai_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_performance_metrics FORCE ROW LEVEL SECURITY;

ALTER TABLE public.ai_learning_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_log FORCE ROW LEVEL SECURITY;

-- 6. POLÍTICAS DE SEGURANÇA
-- =========================

-- Feedback: usuários podem gerenciar seus próprios feedbacks
CREATE POLICY "Users can manage their own AI feedback"
  ON public.ai_feedback
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Administradores podem ver todos os feedbacks
CREATE POLICY "Admins can view all AI feedback"
  ON public.ai_feedback
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.perfis WHERE role = 'admin'
    )
  );

-- Prompt Templates: apenas admins e sistema podem gerenciar
CREATE POLICY "Admins can manage prompt templates"
  ON public.ai_prompt_templates
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

-- Performance Metrics: apenas admins podem ver
CREATE POLICY "Admins can view performance metrics"
  ON public.ai_performance_metrics
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.perfis WHERE role = 'admin'
    )
  );

-- Learning Log: apenas admins podem ver
CREATE POLICY "Admins can view learning logs"
  ON public.ai_learning_log
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.perfis WHERE role = 'admin'
    )
  );

-- 7. FUNÇÕES AUXILIARES
-- =====================

-- Função para registrar feedback automaticamente
CREATE OR REPLACE FUNCTION public.register_ai_feedback(
  p_user_id UUID,
  p_session_id TEXT,
  p_ai_service TEXT,
  p_prompt_used TEXT,
  p_ai_response TEXT,
  p_user_feedback JSONB,
  p_feedback_type TEXT DEFAULT 'explicit',
  p_context_data JSONB DEFAULT '{}',
  p_response_time_ms INTEGER DEFAULT NULL,
  p_tokens_used INTEGER DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  feedback_id UUID;
BEGIN
  INSERT INTO public.ai_feedback (
    user_id, session_id, ai_service, prompt_used, ai_response,
    user_feedback, feedback_type, context_data, response_time_ms, tokens_used
  ) VALUES (
    p_user_id, p_session_id, p_ai_service, p_prompt_used, p_ai_response,
    p_user_feedback, p_feedback_type, p_context_data, p_response_time_ms, p_tokens_used
  ) RETURNING id INTO feedback_id;
  
  RETURN feedback_id;
END;
$$;

-- Função para atualizar métricas de performance
CREATE OR REPLACE FUNCTION public.update_ai_performance_metrics(
  p_service_name TEXT,
  p_success BOOLEAN DEFAULT true,
  p_response_time_ms INTEGER DEFAULT NULL,
  p_rating DOUBLE PRECISION DEFAULT NULL,
  p_tokens_used INTEGER DEFAULT NULL,
  p_estimated_cost DOUBLE PRECISION DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.ai_performance_metrics (
    service_name, metric_date, total_requests, successful_requests,
    avg_response_time_ms, avg_rating, total_tokens_used, estimated_cost
  ) VALUES (
    p_service_name, CURRENT_DATE, 1, 
    CASE WHEN p_success THEN 1 ELSE 0 END,
    COALESCE(p_response_time_ms, 0),
    COALESCE(p_rating, 0),
    COALESCE(p_tokens_used, 0),
    COALESCE(p_estimated_cost, 0)
  )
  ON CONFLICT (service_name, metric_date) DO UPDATE SET
    total_requests = ai_performance_metrics.total_requests + 1,
    successful_requests = ai_performance_metrics.successful_requests + CASE WHEN p_success THEN 1 ELSE 0 END,
    avg_response_time_ms = (
      (ai_performance_metrics.avg_response_time_ms * ai_performance_metrics.total_requests + COALESCE(p_response_time_ms, 0)) 
      / (ai_performance_metrics.total_requests + 1)
    ),
    avg_rating = CASE 
      WHEN p_rating IS NOT NULL THEN
        (ai_performance_metrics.avg_rating * ai_performance_metrics.total_requests + p_rating) 
        / (ai_performance_metrics.total_requests + 1)
      ELSE ai_performance_metrics.avg_rating
    END,
    total_tokens_used = ai_performance_metrics.total_tokens_used + COALESCE(p_tokens_used, 0),
    estimated_cost = ai_performance_metrics.estimated_cost + COALESCE(p_estimated_cost, 0),
    updated_at = now();
END;
$$;

-- 8. INSERIR TEMPLATES INICIAIS
-- ==============================
INSERT INTO public.ai_prompt_templates (
  service_name, prompt_version, prompt_template, system_instructions, is_active
) VALUES 
(
  'mestre_beleza',
  'v1.0',
  'Como especialista em estética, analise a seguinte pergunta e forneça uma resposta detalhada e precisa: {user_question}',
  'Você é o Mestre da Beleza, um especialista em estética e beleza com vasto conhecimento em procedimentos, equipamentos e cuidados.',
  true
),
(
  'marketing_consultant',
  'v1.0', 
  'Como consultor de marketing especializado em estética, analise: {context} e forneça recomendações estratégicas.',
  'Você é um consultor de marketing especializado no setor de estética e beleza.',
  true
),
(
  'script_generator',
  'v1.0',
  'Crie um roteiro para {format} sobre {topic} usando {equipment}. Foque em {objective}.',
  'Você é um especialista em criação de conteúdo para redes sociais no setor de estética.',
  true
);

-- 9. TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =======================================
CREATE OR REPLACE FUNCTION public.update_ai_metrics_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_ai_performance_metrics_updated_at
  BEFORE UPDATE ON public.ai_performance_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_metrics_timestamp();