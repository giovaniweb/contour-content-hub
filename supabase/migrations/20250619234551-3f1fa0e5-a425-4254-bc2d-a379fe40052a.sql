
-- Create storage bucket for documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', true, 52428800, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Set up access policies for documents bucket
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Allow public read access to documents" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to upload documents" ON storage.objects;
  DROP POLICY IF EXISTS "Allow users to update their own documents" ON storage.objects;
  DROP POLICY IF EXISTS "Allow users to delete their own documents" ON storage.objects;
END $$;

-- Create policy for public read access
CREATE POLICY "Allow public read access to documents"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'documents');

-- Create policy for authenticated users to upload
CREATE POLICY "Allow authenticated users to upload documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
  );

-- Create policy for users to update their own documents
CREATE POLICY "Allow users to update their own documents"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'documents' AND
    auth.uid() = owner
  );

-- Create policy for users to delete their own documents
CREATE POLICY "Allow users to delete their own documents"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'documents' AND
    auth.uid() = owner
  );
