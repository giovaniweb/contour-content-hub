-- Criar apenas a tabela de sessões (intent_history já existe)
CREATE TABLE IF NOT EXISTS public.mestre_da_beleza_sessions (
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