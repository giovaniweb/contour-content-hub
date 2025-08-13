-- Drop ALL existing RLS policies on perfis table to avoid conflicts
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'perfis'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol.policyname || '" ON public.perfis';
    END LOOP;
END $$;

-- Create clean RLS policies for perfis table using security functions
CREATE POLICY "Users can view their own profile" ON public.perfis
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.perfis  
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.perfis
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.perfis
FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage all profiles" ON public.perfis
FOR ALL USING (public.is_admin());