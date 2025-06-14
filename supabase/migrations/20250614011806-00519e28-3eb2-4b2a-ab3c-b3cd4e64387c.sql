
-- Create storage bucket for before/after photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('before-after-photos', 'before-after-photos', true);

-- Create table for before/after photo records
CREATE TABLE public.before_after_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  equipment_used TEXT[] DEFAULT '{}',
  procedure_date DATE,
  is_public BOOLEAN DEFAULT false,
  approved_script_id UUID REFERENCES public.approved_scripts(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on before_after_photos table
ALTER TABLE public.before_after_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for before_after_photos
CREATE POLICY "Users can view their own photos" 
  ON public.before_after_photos 
  FOR SELECT 
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own photos" 
  ON public.before_after_photos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos" 
  ON public.before_after_photos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" 
  ON public.before_after_photos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage policies for before-after-photos bucket
CREATE POLICY "Users can upload their own photos" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'before-after-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view photos" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'before-after-photos');

CREATE POLICY "Users can update their own photos" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'before-after-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own photos" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'before-after-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add updated_at trigger for before_after_photos
CREATE OR REPLACE FUNCTION public.update_before_after_photos_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_before_after_photos_updated_at
  BEFORE UPDATE ON public.before_after_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_before_after_photos_updated_at();
