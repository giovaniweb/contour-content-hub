-- COMPREHENSIVE SECURITY FIXES
-- This migration addresses critical security vulnerabilities identified in the security review

-- =============================================================================
-- PHASE 1: Fix Function Security (SQL Injection Prevention)
-- Add search_path to all security definer functions missing it
-- =============================================================================

-- Fix get_user_email_safe function
CREATE OR REPLACE FUNCTION public.get_user_email_safe()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT email FROM public.perfis WHERE id = auth.uid();
$function$;

-- Fix audit_trigger_function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (table_name, operation, old_data, user_id)
    VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (table_name, operation, old_data, new_data, user_id)
    VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (table_name, operation, new_data, user_id)
    VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;

-- Fix check_admin_role function
CREATE OR REPLACE FUNCTION public.check_admin_role()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  );
$function$;

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(required_role text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role = required_role
  );
$function$;

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  );
$function$;

-- =============================================================================
-- PHASE 2: Fix Critical RLS Policies for Data Protection
-- =============================================================================

-- Ensure instagram_accounts table has proper RLS (Instagram token protection)
ALTER TABLE public.instagram_accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create secure ones
DROP POLICY IF EXISTS "Users can manage own instagram accounts" ON public.instagram_accounts;
DROP POLICY IF EXISTS "Admins can manage all instagram accounts" ON public.instagram_accounts;

CREATE POLICY "Users can manage own instagram accounts"
ON public.instagram_accounts
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all instagram accounts"
ON public.instagram_accounts
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
);

-- Secure instagram_configs table
ALTER TABLE public.instagram_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own instagram configs" ON public.instagram_configs;
DROP POLICY IF EXISTS "Admins can manage all instagram configs" ON public.instagram_configs;

CREATE POLICY "Users can manage own instagram configs"
ON public.instagram_configs
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all instagram configs"
ON public.instagram_configs
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
);

-- =============================================================================
-- PHASE 3: Secure Business Intelligence Data
-- =============================================================================

-- Secure ai_usage_metrics table (admin only)
ALTER TABLE public.ai_usage_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all AI metrics" ON public.ai_usage_metrics;
DROP POLICY IF EXISTS "System can insert AI metrics" ON public.ai_usage_metrics;
DROP POLICY IF EXISTS "Users can view their own AI metrics" ON public.ai_usage_metrics;

CREATE POLICY "Admins can manage all AI metrics"
ON public.ai_usage_metrics
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "System can insert AI metrics"
ON public.ai_usage_metrics
FOR INSERT
WITH CHECK (true);

-- Secure user_purchase_scores table
ALTER TABLE public.user_purchase_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own purchase scores" ON public.user_purchase_scores;
DROP POLICY IF EXISTS "Admins can manage all purchase scores" ON public.user_purchase_scores;

CREATE POLICY "Users can view own purchase scores"
ON public.user_purchase_scores
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all purchase scores"
ON public.user_purchase_scores
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "System can update purchase scores"
ON public.user_purchase_scores
FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can modify purchase scores"
ON public.user_purchase_scores
FOR UPDATE
USING (true);

-- =============================================================================
-- PHASE 4: Secure Private Communications
-- =============================================================================

-- Secure copilot_messages table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'copilot_messages') THEN
    EXECUTE 'ALTER TABLE public.copilot_messages ENABLE ROW LEVEL SECURITY';
    
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage own messages" ON public.copilot_messages';
    EXECUTE 'CREATE POLICY "Users can manage own messages" ON public.copilot_messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
    
    EXECUTE 'DROP POLICY IF EXISTS "Admins can manage all messages" ON public.copilot_messages';
    EXECUTE 'CREATE POLICY "Admins can manage all messages" ON public.copilot_messages FOR ALL USING (EXISTS (SELECT 1 FROM public.perfis WHERE id = auth.uid() AND role IN (''admin'', ''superadmin'')))';
  END IF;
END $$;

-- Secure copilot_sessions table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'copilot_sessions') THEN
    EXECUTE 'ALTER TABLE public.copilot_sessions ENABLE ROW LEVEL SECURITY';
    
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage own sessions" ON public.copilot_sessions';
    EXECUTE 'CREATE POLICY "Users can manage own sessions" ON public.copilot_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
    
    EXECUTE 'DROP POLICY IF EXISTS "Admins can manage all sessions" ON public.copilot_sessions';
    EXECUTE 'CREATE POLICY "Admins can manage all sessions" ON public.copilot_sessions FOR ALL USING (EXISTS (SELECT 1 FROM public.perfis WHERE id = auth.uid() AND role IN (''admin'', ''superadmin'')))';
  END IF;
END $$;

-- =============================================================================
-- PHASE 5: Secure System Configuration Tables
-- =============================================================================

-- Secure gpt_config table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gpt_config') THEN
    EXECUTE 'ALTER TABLE public.gpt_config ENABLE ROW LEVEL SECURITY';
    
    EXECUTE 'DROP POLICY IF EXISTS "Only admins can manage gpt config" ON public.gpt_config';
    EXECUTE 'CREATE POLICY "Only admins can manage gpt config" ON public.gpt_config FOR ALL USING (EXISTS (SELECT 1 FROM public.perfis WHERE id = auth.uid() AND role IN (''admin'', ''superadmin'')))';
  END IF;
END $$;

-- Secure system_services_status table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'system_services_status') THEN
    EXECUTE 'ALTER TABLE public.system_services_status ENABLE ROW LEVEL SECURITY';
    
    EXECUTE 'DROP POLICY IF EXISTS "Only admins can manage system status" ON public.system_services_status';
    EXECUTE 'CREATE POLICY "Only admins can manage system status" ON public.system_services_status FOR ALL USING (EXISTS (SELECT 1 FROM public.perfis WHERE id = auth.uid() AND role IN (''admin'', ''superadmin'')))';
  END IF;
END $$;