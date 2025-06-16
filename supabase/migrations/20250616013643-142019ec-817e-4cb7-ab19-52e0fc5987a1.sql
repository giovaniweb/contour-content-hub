
-- Add downloads_count column to the videos table
ALTER TABLE public.videos 
ADD COLUMN downloads_count integer DEFAULT 0;
