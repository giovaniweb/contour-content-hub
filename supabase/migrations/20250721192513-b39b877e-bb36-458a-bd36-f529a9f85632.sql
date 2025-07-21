-- Fix critical security issues in user registration and profiles

-- First, update the profile creation trigger to be more secure
DROP TRIGGER IF EXISTS criar_perfil_usuario ON auth.users;
DROP FUNCTION IF EXISTS public.criar_perfil_novo_usuario();

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

-- Add email validation check
ALTER TABLE public.perfis 
ADD CONSTRAINT valid_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Add consistency constraints
ALTER TABLE public.perfis 
ADD CONSTRAINT consistent_name_field 
CHECK (
  (nome IS NOT NULL AND nome != '') OR 
  (name IS NOT NULL AND name != '')
);

-- Update existing profiles to ensure consistency
UPDATE public.perfis 
SET nome = COALESCE(nome, name, split_part(email, '@', 1))
WHERE nome IS NULL OR nome = '';

UPDATE public.perfis 
SET name = COALESCE(name, nome, split_part(email, '@', 1))
WHERE name IS NULL OR name = '';

-- Ensure no admin roles were created accidentally
UPDATE public.perfis 
SET role = 'user' 
WHERE role = 'admin' AND id NOT IN (
  SELECT id FROM public.perfis 
  WHERE email IN ('admin@example.com', 'giovani@example.com') -- Add known admin emails here
);