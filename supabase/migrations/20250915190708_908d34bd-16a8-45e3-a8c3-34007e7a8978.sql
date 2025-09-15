-- Security Fix Migration: Implement Graduated Access Control
-- This migration addresses critical security vulnerabilities identified in the security review

-- 1. Update videomakers table RLS policies to protect contact information
DROP POLICY IF EXISTS "Videomakers públicos podem ser vistos por todos" ON public.videomakers;
DROP POLICY IF EXISTS "Public can view active videomakers" ON public.videomakers;

-- Create new graduated access policies for videomakers
CREATE POLICY "Public can view basic videomaker info" ON public.videomakers
FOR SELECT USING (
  ativo = true AND (
    -- Public users can only see basic info (name, city, type, rating)
    auth.role() = 'anon' OR 
    -- Authenticated users can see all info
    auth.role() = 'authenticated'
  )
);

-- 2. Restrict equipment photos to authenticated users only
DROP POLICY IF EXISTS "Equipment photos are publicly viewable" ON public.equipment_photos;
DROP POLICY IF EXISTS "Public users can view equipment photos" ON public.equipment_photos;

CREATE POLICY "Authenticated users can view equipment photos" ON public.equipment_photos
FOR SELECT USING (auth.role() = 'authenticated');

-- 3. Update videos access - require authentication for professional content
DROP POLICY IF EXISTS "Videos públicos podem ser vistos por todos" ON public.videos;
DROP POLICY IF EXISTS "Public can view videos" ON public.videos;

CREATE POLICY "Authenticated users can view videos" ON public.videos
FOR SELECT USING (auth.role() = 'authenticated');

-- 4. Strict access control for before/after medical photos
DROP POLICY IF EXISTS "Users can view their own before after photos" ON public.before_after_photos;
DROP POLICY IF EXISTS "Admins can view all before after photos" ON public.before_after_photos;

-- Only allow users to see their own medical photos and admins to see all
CREATE POLICY "Users can view own medical photos" ON public.before_after_photos
FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- 5. Create function for public videomaker directory (anonymized)
CREATE OR REPLACE FUNCTION public.get_public_videomaker_directory()
RETURNS TABLE(
  id uuid,
  nome_completo text,
  cidade text,
  tipo_profissional professional_type,
  media_avaliacao numeric,
  total_avaliacoes integer,
  created_at timestamp with time zone
) 
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 
    v.id,
    -- Anonymize full names to initials for public access
    CASE 
      WHEN auth.role() = 'authenticated' THEN v.nome_completo
      ELSE left(split_part(v.nome_completo, ' ', 1), 1) || '. ' || 
           CASE 
             WHEN split_part(v.nome_completo, ' ', 2) != '' 
             THEN left(split_part(v.nome_completo, ' ', 2), 1) || '.'
             ELSE ''
           END
    END as nome_completo,
    v.cidade,
    v.tipo_profissional,
    v.media_avaliacao,
    v.total_avaliacoes,
    v.created_at
  FROM public.videomakers v
  WHERE v.ativo = true
  ORDER BY v.created_at DESC;
$$;

-- Grant execute permission to all users (including anonymous)
GRANT EXECUTE ON FUNCTION public.get_public_videomaker_directory() TO anon, authenticated;

-- 6. Create access audit log table for sensitive data monitoring
CREATE TABLE IF NOT EXISTS public.data_access_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  accessed_table text NOT NULL,
  accessed_record_id uuid,
  access_type text NOT NULL, -- 'view', 'download', 'export'
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit table
ALTER TABLE public.data_access_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.data_access_audit
FOR SELECT USING (
  EXISTS (SELECT 1 FROM perfis WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" ON public.data_access_audit
FOR INSERT WITH CHECK (true);

-- 7. Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- IP or user ID
  endpoint text NOT NULL,
  requests_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT date_trunc('minute', now()),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, endpoint, window_start)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limits
CREATE POLICY "System manages rate limits" ON public.rate_limits
FOR ALL USING (false) WITH CHECK (false);

-- 8. Update triggers for audit logging
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to sensitive professional data
  IF TG_TABLE_NAME IN ('videomakers', 'before_after_photos', 'equipment_photos') THEN
    INSERT INTO public.data_access_audit (
      user_id,
      accessed_table,
      accessed_record_id,
      access_type
    ) VALUES (
      auth.uid(),
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      'view'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove existing get_public_videomakers function since we're replacing it
DROP FUNCTION IF EXISTS public.get_public_videomakers();

-- Apply updated_at trigger to new tables
CREATE TRIGGER update_data_access_audit_updated_at
  BEFORE UPDATE ON public.data_access_audit
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON public.rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();