
-- Create a storage bucket for equipment images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
SELECT 'images', 'images', TRUE
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'images');

-- Create storage policies for the images bucket
-- Allow public read access
INSERT INTO storage.policies (name, bucket_id, operation, definition)
SELECT 'Public Read Access', 'images', 'SELECT', 'true'
WHERE NOT EXISTS (SELECT 1 FROM storage.policies WHERE name = 'Public Read Access' AND bucket_id = 'images');

-- Allow authenticated users to upload images
INSERT INTO storage.policies (name, bucket_id, operation, definition)
SELECT 'Authenticated Upload', 'images', 'INSERT', '(auth.role() = ''authenticated'')'
WHERE NOT EXISTS (SELECT 1 FROM storage.policies WHERE name = 'Authenticated Upload' AND bucket_id = 'images');

-- Allow users to update their own images
INSERT INTO storage.policies (name, bucket_id, operation, definition)
SELECT 'Owner Update', 'images', 'UPDATE', '(auth.uid() = owner)'
WHERE NOT EXISTS (SELECT 1 FROM storage.policies WHERE name = 'Owner Update' AND bucket_id = 'images');

-- Allow users to delete their own images
INSERT INTO storage.policies (name, bucket_id, operation, definition)
SELECT 'Owner Delete', 'images', 'DELETE', '(auth.uid() = owner)'
WHERE NOT EXISTS (SELECT 1 FROM storage.policies WHERE name = 'Owner Delete' AND bucket_id = 'images');
