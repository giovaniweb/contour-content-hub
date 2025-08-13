-- CRITICAL SECURITY FIXES - Final Phase
-- Fix remaining function search path issues

-- Fix the testimonials update function
CREATE OR REPLACE FUNCTION public.update_testimonials_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Move extensions from public schema to extensions schema for security
-- First check what extensions are in public
DO $$
DECLARE
    ext_record RECORD;
BEGIN
    -- Move vector extension to extensions schema if it exists
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        -- Create extensions schema if it doesn't exist
        CREATE SCHEMA IF NOT EXISTS extensions;
        -- Move the extension
        ALTER EXTENSION vector SET SCHEMA extensions;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- If moving extension fails, continue with other fixes
        NULL;
END $$;

-- Add audit logging for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id uuid NOT NULL,
    action_type text NOT NULL,
    target_user_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
ON public.admin_audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
);

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
    p_action_type text,
    p_target_user_id uuid DEFAULT NULL,
    p_old_values jsonb DEFAULT NULL,
    p_new_values jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    INSERT INTO public.admin_audit_log (
        admin_user_id,
        action_type,
        target_user_id,
        old_values,
        new_values
    ) VALUES (
        auth.uid(),
        p_action_type,
        p_target_user_id,
        p_old_values,
        p_new_values
    );
END;
$$;