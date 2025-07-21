-- Adicionar campo de foto na tabela videomakers
ALTER TABLE public.videomakers 
ADD COLUMN foto_url TEXT,
ADD COLUMN media_avaliacao DECIMAL(2,1) DEFAULT 0.0,
ADD COLUMN total_avaliacoes INTEGER DEFAULT 0;

-- Criar tabela de avaliações de videomakers
CREATE TABLE public.videomaker_avaliacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  videomaker_id UUID NOT NULL REFERENCES public.videomakers(id) ON DELETE CASCADE,
  avaliador_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Evitar múltiplas avaliações do mesmo usuário para o mesmo videomaker
  CONSTRAINT unique_avaliacao_videomaker UNIQUE(videomaker_id, avaliador_id)
);

-- Habilitar RLS na tabela de avaliações
ALTER TABLE public.videomaker_avaliacoes ENABLE ROW LEVEL SECURITY;

-- Políticas para avaliações
CREATE POLICY "Usuários podem criar avaliações"
ON public.videomaker_avaliacoes
FOR INSERT
WITH CHECK (auth.uid() = avaliador_id);

CREATE POLICY "Usuários podem atualizar suas próprias avaliações"
ON public.videomaker_avaliacoes
FOR UPDATE
USING (auth.uid() = avaliador_id);

CREATE POLICY "Videomakers podem ver suas avaliações"
ON public.videomaker_avaliacoes
FOR SELECT
USING (
  videomaker_id IN (
    SELECT id FROM public.videomakers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Usuários autenticados podem ver avaliações de videomakers ativos"
ON public.videomaker_avaliacoes
FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  videomaker_id IN (
    SELECT id FROM public.videomakers WHERE ativo = true
  )
);

-- Função para atualizar média de avaliações
CREATE OR REPLACE FUNCTION public.update_videomaker_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Atualizar estatísticas do videomaker
  UPDATE public.videomakers
  SET 
    media_avaliacao = (
      SELECT ROUND(AVG(nota)::numeric, 1)
      FROM public.videomaker_avaliacoes
      WHERE videomaker_id = COALESCE(NEW.videomaker_id, OLD.videomaker_id)
    ),
    total_avaliacoes = (
      SELECT COUNT(*)
      FROM public.videomaker_avaliacoes
      WHERE videomaker_id = COALESCE(NEW.videomaker_id, OLD.videomaker_id)
    )
  WHERE id = COALESCE(NEW.videomaker_id, OLD.videomaker_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Triggers para atualizar ratings
CREATE TRIGGER update_videomaker_rating_on_insert
AFTER INSERT ON public.videomaker_avaliacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_videomaker_rating();

CREATE TRIGGER update_videomaker_rating_on_update
AFTER UPDATE ON public.videomaker_avaliacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_videomaker_rating();

CREATE TRIGGER update_videomaker_rating_on_delete
AFTER DELETE ON public.videomaker_avaliacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_videomaker_rating();

-- Trigger para atualizar timestamp nas avaliações
CREATE TRIGGER update_videomaker_avaliacoes_updated_at
BEFORE UPDATE ON public.videomaker_avaliacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_videomaker_avaliacoes_videomaker ON public.videomaker_avaliacoes(videomaker_id);
CREATE INDEX idx_videomaker_avaliacoes_avaliador ON public.videomaker_avaliacoes(avaliador_id);
CREATE INDEX idx_videomakers_rating ON public.videomakers(media_avaliacao DESC) WHERE ativo = true;