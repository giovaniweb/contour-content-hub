
-- Create function to log document access
CREATE OR REPLACE FUNCTION public.log_document_access(doc_id UUID, action TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.document_access_history (document_id, user_id, action_type)
  VALUES (doc_id, auth.uid(), action);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
