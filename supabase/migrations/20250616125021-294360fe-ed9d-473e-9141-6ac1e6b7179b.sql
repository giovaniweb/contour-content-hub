
-- Create videos storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  524288000, -- 500MB limit
  ARRAY['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/mkv']
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for videos bucket
CREATE POLICY "Allow public access to videos" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Allow authenticated uploads to videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own videos" ON storage.objects
FOR UPDATE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own videos" ON storage.objects
FOR DELETE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Clean up mock/test videos from the videos table
DELETE FROM videos WHERE 
  titulo ILIKE '%mock%' OR 
  titulo ILIKE '%test%' OR 
  titulo ILIKE '%exemplo%' OR
  url_video LIKE '%placeholder%' OR
  url_video LIKE '%via.placeholder%';
