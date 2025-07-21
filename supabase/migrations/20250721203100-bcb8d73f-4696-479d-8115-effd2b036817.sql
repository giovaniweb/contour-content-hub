-- Criar enum para tipo de profissional
CREATE TYPE professional_type AS ENUM ('videomaker', 'storymaker');

-- Criar enum para faixas de investimento
CREATE TYPE investment_range AS ENUM ('300-500', '500-800', '800-1000', '1000-1200', 'acima-1200');

-- Criar tabela de videomakers
CREATE TABLE public.videomakers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT NOT NULL,
  telefone TEXT NOT NULL,
  video_referencia_url TEXT,
  instagram TEXT,
  cidade TEXT NOT NULL,
  tipo_profissional professional_type NOT NULL DEFAULT 'videomaker',
  
  -- Equipamentos
  camera_celular TEXT NOT NULL,
  modelo_microfone TEXT,
  possui_iluminacao BOOLEAN NOT NULL DEFAULT false,
  emite_nota_fiscal BOOLEAN NOT NULL DEFAULT false,
  
  -- Investimento
  valor_diaria investment_range NOT NULL,
  
  -- Metadados
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Índices para busca
  CONSTRAINT unique_user_videomaker UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.videomakers ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Videomakers podem criar seu próprio perfil"
ON public.videomakers
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Videomakers podem atualizar seu próprio perfil"
ON public.videomakers
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Videomakers podem ver seu próprio perfil"
ON public.videomakers
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários autenticados podem buscar videomakers ativos"
ON public.videomakers
FOR SELECT
USING (ativo = true AND auth.role() = 'authenticated');

-- Trigger para atualizar timestamp
CREATE TRIGGER update_videomakers_updated_at
BEFORE UPDATE ON public.videomakers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_videomakers_cidade ON public.videomakers(cidade) WHERE ativo = true;
CREATE INDEX idx_videomakers_tipo ON public.videomakers(tipo_profissional) WHERE ativo = true;
CREATE INDEX idx_videomakers_valor ON public.videomakers(valor_diaria) WHERE ativo = true;