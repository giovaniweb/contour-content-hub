
-- Criar tabela para itens do planejador de conteúdo
CREATE TABLE public.content_planner_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'idea',
  tags TEXT[] DEFAULT '{}',
  format TEXT NOT NULL DEFAULT 'vídeo',
  objective TEXT NOT NULL DEFAULT '🟡 Atrair Atenção',
  distribution TEXT NOT NULL DEFAULT 'Instagram',
  equipment_id UUID,
  equipment_name TEXT,
  scheduled_date DATE,
  scheduled_time TIME,
  calendar_event_id TEXT,
  author_id UUID,
  author_name TEXT,
  responsible_id UUID,
  responsible_name TEXT,
  ai_generated BOOLEAN DEFAULT false,
  script_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS para segurança
ALTER TABLE public.content_planner_items ENABLE ROW LEVEL SECURITY;

-- Política para visualizar apenas seus próprios itens
CREATE POLICY "Users can view their own content planner items" 
  ON public.content_planner_items 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para inserir apenas seus próprios itens
CREATE POLICY "Users can create their own content planner items" 
  ON public.content_planner_items 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para atualizar apenas seus próprios itens
CREATE POLICY "Users can update their own content planner items" 
  ON public.content_planner_items 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para deletar apenas seus próprios itens
CREATE POLICY "Users can delete their own content planner items" 
  ON public.content_planner_items 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_content_planner_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_planner_items_updated_at_trigger
  BEFORE UPDATE ON public.content_planner_items
  FOR EACH ROW
  EXECUTE FUNCTION update_content_planner_items_updated_at();
