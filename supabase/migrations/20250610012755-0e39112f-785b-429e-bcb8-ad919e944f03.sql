
-- Create table for Instagram integration configuration
CREATE TABLE IF NOT EXISTS public.instagram_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  access_token TEXT NOT NULL,
  instagram_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  account_type TEXT DEFAULT 'business',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for Instagram analytics data
CREATE TABLE IF NOT EXISTS public.instagram_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  instagram_user_id TEXT NOT NULL,
  followers_count INTEGER,
  following_count INTEGER,
  media_count INTEGER,
  reach INTEGER,
  impressions INTEGER,
  engagement_rate DECIMAL(5,2),
  post_frequency INTEGER, -- posts per week
  data_snapshot JSONB, -- store raw API data
  analysis_result TEXT, -- AI analysis result
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for Instagram configs
ALTER TABLE public.instagram_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own Instagram configs" 
  ON public.instagram_configs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own Instagram configs" 
  ON public.instagram_configs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Instagram configs" 
  ON public.instagram_configs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Instagram configs" 
  ON public.instagram_configs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for Instagram analytics
ALTER TABLE public.instagram_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own Instagram analytics" 
  ON public.instagram_analytics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own Instagram analytics" 
  ON public.instagram_analytics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add Instagram type to integration configs if not exists
INSERT INTO public.integracao_configs (tipo, config, criado_em, atualizado_em)
SELECT 'instagram', '{}'::jsonb, now(), now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.integracao_configs WHERE tipo = 'instagram'
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_instagram_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER instagram_configs_updated_at
  BEFORE UPDATE ON public.instagram_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_instagram_configs_updated_at();
