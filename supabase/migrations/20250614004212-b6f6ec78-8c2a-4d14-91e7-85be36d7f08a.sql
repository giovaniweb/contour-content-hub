
-- Criar tabela para roteiros aprovados
CREATE TABLE public.approved_scripts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  script_content text NOT NULL,
  title text NOT NULL,
  format text NOT NULL DEFAULT 'carrossel',
  equipment_used text[],
  approval_status text NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approval_notes text,
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para tracking de performance
CREATE TABLE public.script_performance (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  approved_script_id uuid NOT NULL REFERENCES public.approved_scripts(id) ON DELETE CASCADE,
  performance_rating text NOT NULL CHECK (performance_rating IN ('bombou', 'flopou', 'neutro', 'pending')),
  metrics jsonb DEFAULT '{}',
  feedback_notes text,
  evaluated_by uuid REFERENCES auth.users(id),
  evaluated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar colunas na tabela content_planner_items para linking com approved_scripts
ALTER TABLE public.content_planner_items 
ADD COLUMN approved_script_id uuid REFERENCES public.approved_scripts(id),
ADD COLUMN performance_rating text CHECK (performance_rating IN ('bombou', 'flopou', 'neutro', 'pending')),
ADD COLUMN performance_metrics jsonb DEFAULT '{}';

-- Criar índices para performance
CREATE INDEX idx_approved_scripts_user_id ON public.approved_scripts(user_id);
CREATE INDEX idx_approved_scripts_status ON public.approved_scripts(approval_status);
CREATE INDEX idx_script_performance_rating ON public.script_performance(performance_rating);
CREATE INDEX idx_content_planner_performance ON public.content_planner_items(performance_rating);

-- RLS Policies para approved_scripts
ALTER TABLE public.approved_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own approved scripts"
  ON public.approved_scripts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own approved scripts"
  ON public.approved_scripts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own approved scripts"
  ON public.approved_scripts FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies para script_performance
ALTER TABLE public.script_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view performance of their scripts"
  ON public.script_performance FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.approved_scripts 
    WHERE approved_scripts.id = script_performance.approved_script_id 
    AND approved_scripts.user_id = auth.uid()
  ));

CREATE POLICY "Users can create performance data for their scripts"
  ON public.script_performance FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.approved_scripts 
    WHERE approved_scripts.id = script_performance.approved_script_id 
    AND approved_scripts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update performance data for their scripts"
  ON public.script_performance FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.approved_scripts 
    WHERE approved_scripts.id = script_performance.approved_script_id 
    AND approved_scripts.user_id = auth.uid()
  ));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_approved_scripts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_approved_scripts_updated_at
  BEFORE UPDATE ON public.approved_scripts
  FOR EACH ROW EXECUTE FUNCTION update_approved_scripts_updated_at();
