-- Criar tabela para fotos dos equipamentos
CREATE TABLE public.equipment_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size BIGINT,
  likes_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para likes das fotos
CREATE TABLE public.equipment_photo_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(photo_id, user_id)
);

-- Criar tabela para downloads das fotos
CREATE TABLE public.equipment_photo_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID NOT NULL,
  user_id UUID NOT NULL,
  download_type TEXT DEFAULT 'single', -- 'single' ou 'zip'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.equipment_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_photo_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_photo_downloads ENABLE ROW LEVEL SECURITY;

-- Políticas para equipment_photos
CREATE POLICY "Usuários podem ver fotos públicas e suas próprias" 
ON public.equipment_photos 
FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias fotos" 
ON public.equipment_photos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem editar suas próprias fotos" 
ON public.equipment_photos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir suas próprias fotos" 
ON public.equipment_photos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas para equipment_photo_likes
CREATE POLICY "Usuários podem ver likes" 
ON public.equipment_photo_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários podem criar seus próprios likes" 
ON public.equipment_photo_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios likes" 
ON public.equipment_photo_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas para equipment_photo_downloads
CREATE POLICY "Usuários podem ver seus próprios downloads" 
ON public.equipment_photo_downloads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar downloads" 
ON public.equipment_photo_downloads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_equipment_photos_updated_at
    BEFORE UPDATE ON public.equipment_photos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para incrementar likes_count
CREATE OR REPLACE FUNCTION public.increment_photo_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.equipment_photos
  SET likes_count = COALESCE(likes_count, 0) + 1
  WHERE id = NEW.photo_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_photo_likes_trigger
    AFTER INSERT ON public.equipment_photo_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_photo_likes_count();

-- Trigger para decrementar likes_count
CREATE OR REPLACE FUNCTION public.decrement_photo_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.equipment_photos
  SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
  WHERE id = OLD.photo_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_photo_likes_trigger
    AFTER DELETE ON public.equipment_photo_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.decrement_photo_likes_count();

-- Trigger para incrementar downloads_count
CREATE OR REPLACE FUNCTION public.increment_photo_downloads_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.equipment_photos
  SET downloads_count = COALESCE(downloads_count, 0) + 1
  WHERE id = NEW.photo_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_photo_downloads_trigger
    AFTER INSERT ON public.equipment_photo_downloads
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_photo_downloads_count();

-- Inserir fotos de exemplo para o equipamento atual
INSERT INTO public.equipment_photos (equipment_id, user_id, title, description, image_url, thumbnail_url, tags) VALUES
('6f3da6e1-4745-4106-9425-b9e2d6d231c5', '1d0af739-6f08-4f35-83a5-8ce85b99d32a', 'Resultado Antes e Depois - Tratamento Facial', 'Excelente resultado após 3 sessões de tratamento', 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800', 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300', ARRAY['antes-depois', 'facial', 'resultado']),
('6f3da6e1-4745-4106-9425-b9e2d6d231c5', '1d0af739-6f08-4f35-83a5-8ce85b99d32a', 'Equipamento em Uso - Procedimento', 'Demonstração do equipamento durante o procedimento', 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800', 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300', ARRAY['procedimento', 'equipamento', 'uso']),
('6f3da6e1-4745-4106-9425-b9e2d6d231c5', '1d0af739-6f08-4f35-83a5-8ce85b99d32a', 'Detalhes Técnicos', 'Vista detalhada dos componentes técnicos', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300', ARRAY['técnico', 'detalhes', 'componentes']),
('6f3da6e1-4745-4106-9425-b9e2d6d231c5', '1d0af739-6f08-4f35-83a5-8ce85b99d32a', 'Aplicação Prática', 'Exemplo de aplicação em paciente', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300', ARRAY['aplicação', 'paciente', 'prática']),
('6f3da6e1-4745-4106-9425-b9e2d6d231c5', '1d0af739-6f08-4f35-83a5-8ce85b99d32a', 'Setup Completo', 'Configuração completa do equipamento', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300', ARRAY['setup', 'configuração', 'completo']),
('6f3da6e1-4745-4106-9425-b9e2d6d231c5', '1d0af739-6f08-4f35-83a5-8ce85b99d32a', 'Ambiente Clínico', 'Equipamento no ambiente clínico ideal', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300', ARRAY['clínica', 'ambiente', 'profissional']);