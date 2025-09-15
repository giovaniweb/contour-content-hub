-- Fix function search path security warnings
-- Update functions to have proper search_path settings

-- Fix function search path for functions that don't have it set properly
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT role FROM perfis WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  );
$$;

CREATE OR REPLACE FUNCTION public.log_data_access(
  p_table_name TEXT,
  p_access_type TEXT DEFAULT 'SELECT'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO data_access_audit (
    user_id, table_name, access_type, accessed_at
  ) VALUES (
    auth.uid(), p_table_name, p_access_type, now()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log admin role changes
  IF OLD.role != NEW.role AND NEW.role IN ('admin', 'superadmin') THEN
    INSERT INTO audit_log (table_name, operation, old_data, new_data, user_id)
    VALUES ('perfis', 'ROLE_ELEVATION', 
            jsonb_build_object('old_role', OLD.role),
            jsonb_build_object('new_role', NEW.role),
            auth.uid());
  END IF;
  
  RETURN NEW;
END;
$$;