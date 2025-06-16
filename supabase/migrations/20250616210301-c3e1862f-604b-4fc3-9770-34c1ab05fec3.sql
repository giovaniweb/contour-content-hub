
-- Add missing thumbnail_url column to videos table
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS thumbnail_url text;
