-- Fix user registration by adding missing unique constraints (safe version)
-- This resolves the "ON CONFLICT" errors in handle_new_user_signup trigger

-- 1. Add unique constraint for user_feature_permissions (user_id, feature) if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_feature_permissions_user_id_feature_key'
    ) THEN
        ALTER TABLE public.user_feature_permissions 
        ADD CONSTRAINT user_feature_permissions_user_id_feature_key UNIQUE (user_id, feature);
    END IF;
END $$;

-- 2. Add unique constraint for user_gamification (user_id) if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_gamification_user_id_key'
    ) THEN
        ALTER TABLE public.user_gamification 
        ADD CONSTRAINT user_gamification_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- 3. Add unique constraint for user_usage (user_id) if it doesn't exist  
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_usage_user_id_key'
    ) THEN
        ALTER TABLE public.user_usage 
        ADD CONSTRAINT user_usage_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- 4. Ensure only one trigger exists for user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 5. Recreate the trigger pointing to the correct function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- 6. Drop existing policies and recreate them for perfis table
DROP POLICY IF EXISTS "Users can view own profile" ON public.perfis;
DROP POLICY IF EXISTS "Users can update own profile" ON public.perfis;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.perfis;

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" 
ON public.perfis 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.perfis 
FOR UPDATE 
USING (auth.uid() = id);

-- Admins can manage all profiles  
CREATE POLICY "Admins can manage all profiles"
ON public.perfis
FOR ALL
USING (public.check_admin_role());