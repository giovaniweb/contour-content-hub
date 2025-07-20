-- Criar bucket downloads se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('downloads', 'downloads', true)
ON CONFLICT (id) DO NOTHING;

-- Criar políticas para o bucket downloads
CREATE POLICY "Users can upload their own files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'downloads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'downloads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public can view downloads files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'downloads');

CREATE POLICY "Users can update their own files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'downloads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'downloads' AND auth.uid() IS NOT NULL);