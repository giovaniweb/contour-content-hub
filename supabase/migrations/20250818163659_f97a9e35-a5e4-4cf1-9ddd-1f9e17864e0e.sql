-- Criar tabela para sessões do Mestre da Beleza
CREATE TABLE public.mestre_da_beleza_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL UNIQUE,
  profile_data JSONB NOT NULL DEFAULT '{}',
  current_step TEXT NOT NULL DEFAULT 'profile',
  current_question_index INTEGER NOT NULL DEFAULT 0,
  responses JSONB NOT NULL DEFAULT '{}',
  diagnostic_result JSONB,
  recommendations JSONB DEFAULT '[]',
  score_data JSONB DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.mestre_da_beleza_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can manage their own sessions" 
ON public.mestre_da_beleza_sessions 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all sessions
CREATE POLICY "Admins can view all sessions" 
ON public.mestre_da_beleza_sessions 
FOR SELECT 
USING (auth.uid() IN (
  SELECT id FROM public.perfis 
  WHERE role = 'admin'
));

-- Criar índices para performance
CREATE INDEX idx_mestre_sessions_user_id ON public.mestre_da_beleza_sessions(user_id);
CREATE INDEX idx_mestre_sessions_session_id ON public.mestre_da_beleza_sessions(session_id);
CREATE INDEX idx_mestre_sessions_step ON public.mestre_da_beleza_sessions(current_step);

-- Trigger para updated_at
CREATE TRIGGER update_mestre_sessions_updated_at
BEFORE UPDATE ON public.mestre_da_beleza_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar tabela para histórico de interações inteligentes
CREATE TABLE public.intent_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  intent_type TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL DEFAULT 0.0,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  equipment_used JSONB DEFAULT '[]',
  articles_consulted JSONB DEFAULT '[]',
  context_data JSONB DEFAULT '{}',
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para intent_history
ALTER TABLE public.intent_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para intent_history
CREATE POLICY "Users can manage their own intent history" 
ON public.intent_history 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all intent history
CREATE POLICY "Admins can view all intent history" 
ON public.intent_history 
FOR SELECT 
USING (auth.uid() IN (
  SELECT id FROM public.perfis 
  WHERE role = 'admin'
));

-- Índices para intent_history
CREATE INDEX idx_intent_history_user_id ON public.intent_history(user_id);
CREATE INDEX idx_intent_history_session_id ON public.intent_history(session_id);
CREATE INDEX idx_intent_history_intent_type ON public.intent_history(intent_type);
CREATE INDEX idx_intent_history_created_at ON public.intent_history(created_at);