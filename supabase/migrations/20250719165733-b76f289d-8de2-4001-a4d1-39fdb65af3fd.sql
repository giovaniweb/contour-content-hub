-- Criar tabela para fila de uploads de vídeos
CREATE TABLE public.video_upload_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'uploading', 'processing', 'completed', 'error')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  video_id UUID, -- ID do vídeo criado após upload bem-sucedido
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.video_upload_queue ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own upload queue" 
ON public.video_upload_queue 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own upload queue items" 
ON public.video_upload_queue 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own upload queue items" 
ON public.video_upload_queue 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own upload queue items" 
ON public.video_upload_queue 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_video_upload_queue_updated_at
BEFORE UPDATE ON public.video_upload_queue
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_video_upload_queue_user_status ON public.video_upload_queue(user_id, status);
CREATE INDEX idx_video_upload_queue_status ON public.video_upload_queue(status);

-- Function to auto-remove completed uploads after 24 hours
CREATE OR REPLACE FUNCTION public.cleanup_completed_uploads()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.video_upload_queue
  WHERE status = 'completed'
  AND completed_at < now() - interval '24 hours';
END;
$$;