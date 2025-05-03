
-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true);

-- Set up access policies for documents bucket
CREATE POLICY "Allow public read access to documents"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "Allow authenticated users to upload documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow users to update their own documents"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'documents' AND
    auth.uid() = owner
  );

CREATE POLICY "Allow users to delete their own documents"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'documents' AND
    auth.uid() = owner
  );
