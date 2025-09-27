-- Create table for custom password recovery tokens
CREATE TABLE public.password_recovery_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.password_recovery_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for password recovery tokens (only functions can access)
CREATE POLICY "Service role can manage recovery tokens" 
ON public.password_recovery_tokens 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create function to cleanup expired tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_recovery_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.password_recovery_tokens
  WHERE expires_at < now()
    OR used_at IS NOT NULL;
END;
$$;

-- Add index for better performance
CREATE INDEX idx_password_recovery_tokens_token ON public.password_recovery_tokens(token);
CREATE INDEX idx_password_recovery_tokens_expires_at ON public.password_recovery_tokens(expires_at);