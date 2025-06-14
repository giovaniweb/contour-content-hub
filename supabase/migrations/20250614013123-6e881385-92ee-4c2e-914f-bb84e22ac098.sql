
-- Create user_gamification table for tracking user progress
CREATE TABLE public.user_gamification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  xp_total INTEGER NOT NULL DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_gamification table
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_gamification
CREATE POLICY "Users can view their own gamification data" 
  ON public.user_gamification 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own gamification data" 
  ON public.user_gamification 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gamification data" 
  ON public.user_gamification 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add updated_at trigger for user_gamification
CREATE TRIGGER update_user_gamification_updated_at
  BEFORE UPDATE ON public.user_gamification
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
