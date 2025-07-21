-- Fix critical security issues in user registration and profiles
-- Drop existing trigger first, then function

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS criar_perfil_usuario ON auth.users;
DROP FUNCTION IF EXISTS public.criar_perfil_novo_usuario() CASCADE;

-- Create secure profile creation function
CREATE OR REPLACE FUNCTION public.criar_perfil_novo_usuario()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
BEGIN
  INSERT INTO public.perfis (id, nome, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user'  -- Always default to 'user' role for security
  );
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER criar_perfil_usuario
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.criar_perfil_novo_usuario();

-- Add email validation check (only if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_email_format') THEN
    ALTER TABLE public.perfis 
    ADD CONSTRAINT valid_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');
  END IF;
END $$;

-- Update existing profiles to ensure consistency (only using existing 'nome' field)
UPDATE public.perfis 
SET nome = COALESCE(nome, split_part(email, '@', 1))
WHERE nome IS NULL OR nome = '';

-- Ensure no admin roles were created accidentally during registration
UPDATE public.perfis 
SET role = 'user' 
WHERE role = 'admin' AND email NOT IN ('admin@aestheticalconcept.com', 'giovani@aestheticalconcept.com');