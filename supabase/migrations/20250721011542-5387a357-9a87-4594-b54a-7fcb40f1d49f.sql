-- Tabela para agentes especializados
CREATE TABLE public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization TEXT NOT NULL, -- 'equipment', 'content', 'marketing', 'diagnostics'
  system_prompt TEXT NOT NULL,
  capabilities JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para memória persistente de usuários
CREATE TABLE public.user_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  memory_type TEXT NOT NULL, -- 'preference', 'learning', 'context', 'interaction'
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  importance_score FLOAT DEFAULT 0.5, -- 0-1 scale
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NULL,
  UNIQUE(user_id, memory_type, key)
);

-- Tabela para coordenação entre agentes
CREATE TABLE public.agent_coordination (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  primary_agent_id UUID REFERENCES ai_agents(id),
  secondary_agents UUID[] DEFAULT '{}',
  task_type TEXT NOT NULL,
  coordination_strategy JSONB DEFAULT '{}',
  execution_order INTEGER[] DEFAULT '{}',
  status TEXT DEFAULT 'pending', -- 'pending', 'executing', 'completed', 'failed'
  result JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE NULL
);

-- Tabela para A/B testing de prompts
CREATE TABLE public.prompt_ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES ai_agents(id),
  test_name TEXT NOT NULL,
  prompt_a TEXT NOT NULL,
  prompt_b TEXT NOT NULL,
  success_metric TEXT NOT NULL, -- 'user_satisfaction', 'task_completion', 'response_time'
  traffic_split FLOAT DEFAULT 0.5, -- 0-1, percentage to A
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'completed'
  results JSONB DEFAULT '{}',
  confidence_level FLOAT DEFAULT 0,
  winner TEXT NULL, -- 'A', 'B', or NULL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE NULL
);

-- Tabela para histórico de auto-melhoramento
CREATE TABLE public.self_improvement_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES ai_agents(id),
  improvement_type TEXT NOT NULL, -- 'prompt_optimization', 'capability_enhancement', 'performance_tuning'
  before_state JSONB NOT NULL,
  after_state JSONB NOT NULL,
  improvement_reason TEXT,
  success_metrics JSONB DEFAULT '{}',
  rollback_possible BOOLEAN DEFAULT true,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  validated_at TIMESTAMP WITH TIME ZONE NULL,
  validation_result JSONB DEFAULT '{}'
);

-- Tabela para sessões de coordenação multi-agente
CREATE TABLE public.multi_agent_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_name TEXT,
  agents_involved UUID[] NOT NULL,
  primary_objective TEXT NOT NULL,
  coordination_pattern TEXT DEFAULT 'sequential', -- 'sequential', 'parallel', 'hierarchical'
  current_phase TEXT DEFAULT 'planning',
  session_context JSONB DEFAULT '{}',
  results JSONB DEFAULT '{}',
  performance_score FLOAT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE NULL
);

-- Habilitar RLS
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_coordination ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.self_improvement_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multi_agent_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Admins can manage all agents" ON public.ai_agents 
FOR ALL USING (auth.uid() IN (SELECT id FROM perfis WHERE role = 'admin'));

CREATE POLICY "Users can manage their own memory" ON public.user_memory 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view agent coordination" ON public.agent_coordination 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage AB tests" ON public.prompt_ab_tests 
FOR ALL USING (auth.uid() IN (SELECT id FROM perfis WHERE role = 'admin'));

CREATE POLICY "Admins can view improvement logs" ON public.self_improvement_log 
FOR SELECT USING (auth.uid() IN (SELECT id FROM perfis WHERE role = 'admin'));

CREATE POLICY "Users can manage their own multi-agent sessions" ON public.multi_agent_sessions 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Triggers para updated_at
CREATE TRIGGER update_ai_agents_updated_at 
BEFORE UPDATE ON public.ai_agents 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Funções para gerenciamento de memória
CREATE OR REPLACE FUNCTION public.store_user_memory(
  p_user_id UUID,
  p_memory_type TEXT,
  p_key TEXT,
  p_value JSONB,
  p_importance FLOAT DEFAULT 0.5,
  p_expires_hours INTEGER DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  memory_id UUID;
  expire_time TIMESTAMP WITH TIME ZONE;
BEGIN
  IF p_expires_hours IS NOT NULL THEN
    expire_time := now() + (p_expires_hours || ' hours')::INTERVAL;
  END IF;

  INSERT INTO public.user_memory (
    user_id, memory_type, key, value, importance_score, expires_at
  ) VALUES (
    p_user_id, p_memory_type, p_key, p_value, p_importance, expire_time
  )
  ON CONFLICT (user_id, memory_type, key) 
  DO UPDATE SET 
    value = EXCLUDED.value,
    importance_score = EXCLUDED.importance_score,
    last_accessed = now(),
    expires_at = EXCLUDED.expires_at
  RETURNING id INTO memory_id;
  
  RETURN memory_id;
END;
$$;

-- Função para coordenação multi-agente
CREATE OR REPLACE FUNCTION public.coordinate_agents(
  p_session_id TEXT,
  p_task_type TEXT,
  p_agent_ids UUID[],
  p_strategy JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  coordination_id UUID;
  primary_agent UUID;
  secondary_agents UUID[];
BEGIN
  -- Determinar agente primário (primeiro da lista)
  primary_agent := p_agent_ids[1];
  secondary_agents := p_agent_ids[2:array_length(p_agent_ids, 1)];
  
  INSERT INTO public.agent_coordination (
    session_id, primary_agent_id, secondary_agents, 
    task_type, coordination_strategy
  ) VALUES (
    p_session_id, primary_agent, secondary_agents, 
    p_task_type, p_strategy
  ) RETURNING id INTO coordination_id;
  
  RETURN coordination_id;
END;
$$;

-- Inserir agentes especializados iniciais
INSERT INTO public.ai_agents (name, specialization, system_prompt, capabilities) VALUES 
(
  'Equipment Specialist',
  'equipment',
  'Você é um especialista em equipamentos estéticos com conhecimento profundo sobre tecnologias, indicações, contraindicações e protocolos. Sempre forneça informações precisas e baseadas em evidências científicas.',
  '{"domains": ["equipment_analysis", "protocol_design", "contraindication_assessment"], "languages": ["pt", "en"], "expertise_level": "expert"}'
),
(
  'Content Creator',
  'content',
  'Você é um especialista em criação de conteúdo para redes sociais, especializado em estética e beleza. Crie conteúdos envolventes, educativos e que convertem.',
  '{"domains": ["social_media", "copywriting", "visual_storytelling"], "platforms": ["instagram", "tiktok", "youtube"], "expertise_level": "expert"}'
),
(
  'Marketing Strategist',
  'marketing',
  'Você é um estrategista de marketing digital especializado no setor de estética. Desenvolva campanhas eficazes e analise performance de marketing.',
  '{"domains": ["digital_marketing", "campaign_optimization", "analytics"], "channels": ["social_media", "email", "paid_ads"], "expertise_level": "expert"}'
),
(
  'Diagnostic Analyst',
  'diagnostics',
  'Você é um analista especializado em diagnósticos estéticos e recomendações de tratamento. Sempre considere o perfil do paciente e contraindicações.',
  '{"domains": ["aesthetic_diagnosis", "treatment_planning", "patient_assessment"], "certifications": ["aesthetic_analysis"], "expertise_level": "expert"}'
),
(
  'Coordinator Agent',
  'coordination',
  'Você é um agente coordenador que gerencia e orquestra outros agentes especializados para tarefas complexas que requerem múltiplas expertises.',
  '{"domains": ["task_coordination", "agent_management", "workflow_optimization"], "coordination_patterns": ["sequential", "parallel", "hierarchical"], "expertise_level": "expert"}'
);