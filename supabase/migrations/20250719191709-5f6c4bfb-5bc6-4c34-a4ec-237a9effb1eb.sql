-- Criar tabela de fotos
CREATE TABLE public.fotos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  descricao_curta TEXT,
  categoria TEXT,
  tags TEXT[] DEFAULT '{}',
  url_imagem TEXT NOT NULL,
  thumbnail_url TEXT,
  downloads_count INTEGER DEFAULT 0,
  favoritos_count INTEGER DEFAULT 0,
  data_upload TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.fotos ENABLE ROW LEVEL SECURITY;

-- Create policies for fotos
CREATE POLICY "Users can view their own photos" 
ON public.fotos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own photos" 
ON public.fotos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos" 
ON public.fotos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" 
ON public.fotos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_fotos_updated_at
BEFORE UPDATE ON public.fotos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Extend favoritos table to work with photos too
ALTER TABLE public.favoritos ADD COLUMN foto_id UUID;
ALTER TABLE public.favoritos ADD COLUMN tipo TEXT DEFAULT 'video';

-- Update favoritos to use correct type
UPDATE public.favoritos SET tipo = 'video' WHERE video_id IS NOT NULL;

-- Create indexes for better performance
CREATE INDEX idx_fotos_user_id ON public.fotos(user_id);
CREATE INDEX idx_fotos_categoria ON public.fotos(categoria);
CREATE INDEX idx_fotos_tags ON public.fotos USING GIN(tags);
CREATE INDEX idx_favoritos_foto_id ON public.favoritos(foto_id);
CREATE INDEX idx_favoritos_tipo ON public.favoritos(tipo);