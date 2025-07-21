-- Fix security issues identified by Supabase linter

-- 1. Enable RLS on tables that don't have it
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roteiro_validacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.database_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_tecnicos ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS policies for tags table
CREATE POLICY "Public can view tags" ON public.tags
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage tags" ON public.tags
FOR ALL USING (auth.role() = 'authenticated');

-- 3. Create RLS policies for roteiro_validacoes table
CREATE POLICY "Users can view their own validations" ON public.roteiro_validacoes
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own validations" ON public.roteiro_validacoes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own validations" ON public.roteiro_validacoes
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own validations" ON public.roteiro_validacoes
FOR DELETE USING (auth.uid() = user_id);

-- 4. Create RLS policies for audit_log table (admin only)
CREATE POLICY "Admins can view audit logs" ON public.audit_log
FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM public.perfis WHERE role = 'admin'
  )
);

-- 5. Create RLS policies for database_documentation (admin only)
CREATE POLICY "Admins can manage database documentation" ON public.database_documentation
FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM public.perfis WHERE role = 'admin'
  )
);

-- 6. Create RLS policies for documentos_tecnicos
CREATE POLICY "Users can view active technical documents" ON public.documentos_tecnicos
FOR SELECT USING (status = 'ativo');

CREATE POLICY "Admins can manage technical documents" ON public.documentos_tecnicos
FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM public.perfis WHERE role = 'admin'
  )
);

-- 7. Update functions to have proper search_path (security fix)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT role FROM public.perfis WHERE id = user_id;
$function$;