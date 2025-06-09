
-- Criar tabela para diagnósticos de marketing
CREATE TABLE public.marketing_diagnostics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL UNIQUE,
  clinic_type TEXT NOT NULL,
  specialty TEXT NOT NULL,
  state_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_diagnostic TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela
ALTER TABLE public.marketing_diagnostics ENABLE ROW LEVEL SECURITY;

-- Política para usuários visualizarem apenas seus próprios diagnósticos
CREATE POLICY "Users can view their own marketing diagnostics" 
  ON public.marketing_diagnostics 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para usuários criarem seus próprios diagnósticos
CREATE POLICY "Users can create their own marketing diagnostics" 
  ON public.marketing_diagnostics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem seus próprios diagnósticos
CREATE POLICY "Users can update their own marketing diagnostics" 
  ON public.marketing_diagnostics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para usuários deletarem seus próprios diagnósticos
CREATE POLICY "Users can delete their own marketing diagnostics" 
  ON public.marketing_diagnostics 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_marketing_diagnostics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_marketing_diagnostics_updated_at
  BEFORE UPDATE ON public.marketing_diagnostics
  FOR EACH ROW
  EXECUTE FUNCTION update_marketing_diagnostics_updated_at();

-- Índices para melhor performance
CREATE INDEX idx_marketing_diagnostics_user_id ON public.marketing_diagnostics(user_id);
CREATE INDEX idx_marketing_diagnostics_session_id ON public.marketing_diagnostics(session_id);
CREATE INDEX idx_marketing_diagnostics_created_at ON public.marketing_diagnostics(created_at DESC);
