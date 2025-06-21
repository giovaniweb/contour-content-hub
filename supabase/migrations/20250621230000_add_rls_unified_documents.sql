
-- Enable RLS on unified_documents table
ALTER TABLE public.unified_documents ENABLE ROW LEVEL SECURITY;

-- Allow users to see all documents (for now, can be restricted later)
CREATE POLICY "Allow users to view all unified documents" ON public.unified_documents
    FOR SELECT USING (true);

-- Allow users to insert their own documents
CREATE POLICY "Allow users to insert their own documents" ON public.unified_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own documents
CREATE POLICY "Allow users to update their own documents" ON public.unified_documents
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own documents
CREATE POLICY "Allow users to delete their own documents" ON public.unified_documents
    FOR DELETE USING (auth.uid() = user_id);
