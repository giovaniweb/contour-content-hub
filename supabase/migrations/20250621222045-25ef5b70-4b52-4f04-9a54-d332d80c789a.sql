
-- Create the unified_documents table
CREATE TABLE IF NOT EXISTS public.unified_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('artigo_cientifico', 'ficha_tecnica', 'protocolo', 'folder_publicitario', 'outro')),
  titulo_extraido TEXT,
  palavras_chave TEXT[] DEFAULT '{}',
  autores TEXT[] DEFAULT '{}',
  texto_completo TEXT,
  raw_text TEXT,
  data_upload TIMESTAMPTZ NOT NULL DEFAULT now(),
  equipamento_id UUID REFERENCES public.equipamentos(id),
  user_id UUID REFERENCES auth.users(id),
  file_path TEXT,
  status_processamento TEXT NOT NULL DEFAULT 'pendente' CHECK (status_processamento IN ('pendente', 'processando', 'concluido', 'falhou')),
  detalhes_erro TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.unified_documents ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own documents
CREATE POLICY "Users can view their own documents" 
  ON public.unified_documents 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to insert their own documents
CREATE POLICY "Users can insert their own documents" 
  ON public.unified_documents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own documents
CREATE POLICY "Users can update their own documents" 
  ON public.unified_documents 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for users to delete their own documents
CREATE POLICY "Users can delete their own documents" 
  ON public.unified_documents 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload documents" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view documents" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'documents');

CREATE POLICY "Users can update their documents" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their documents" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_unified_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_unified_documents_updated_at
  BEFORE UPDATE ON public.unified_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_unified_documents_updated_at();
