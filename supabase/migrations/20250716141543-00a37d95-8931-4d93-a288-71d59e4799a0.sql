-- Adicionar campo thumbnail_url para artigos científicos
ALTER TABLE public.unified_documents 
ADD COLUMN thumbnail_url TEXT;