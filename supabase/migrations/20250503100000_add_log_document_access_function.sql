
-- Create document_access_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.document_access_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documentos_tecnicos(id),
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  details JSONB DEFAULT '{}', -- Nova coluna
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to log document access
CREATE OR REPLACE FUNCTION public.log_document_access(doc_id UUID, action TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.document_access_history (document_id, user_id, action_type)
  VALUES (doc_id, auth.uid(), action);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
