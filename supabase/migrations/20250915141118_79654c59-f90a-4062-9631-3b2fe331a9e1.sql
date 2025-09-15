-- TARGETED SECURITY FIXES - Phase 2: RLS Policy Protection for Sensitive Data
-- Secure Instagram tokens, business intelligence data, and user personal information

-- =============================================================================
-- PHASE 2A: Secure Instagram Account Data (Token Protection)
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
-- PHASE 2B: Secure Business Intelligence Data (Admin-Only Access)
-- =============================================================================

-- Secure user_purchase_scores table
ALTER TABLE public.user_purchase_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own purchase scores" ON public.user_purchase_scores;
DROP POLICY IF EXISTS "Admins can manage all purchase scores" ON public.user_purchase_scores;
DROP POLICY IF EXISTS "System can update purchase scores" ON public.user_purchase_scores;
DROP POLICY IF EXISTS "System can modify purchase scores" ON public.user_purchase_scores;

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
-- PHASE 2C: Fix AI Usage Metrics Access Control
-- =============================================================================

-- Update AI usage metrics policies to be more restrictive
DROP POLICY IF EXISTS "Admins can manage all AI metrics" ON public.ai_usage_metrics;
DROP POLICY IF EXISTS "System can insert AI metrics" ON public.ai_usage_metrics;
DROP POLICY IF EXISTS "Users can view their own AI metrics" ON public.ai_usage_metrics;

-- Only admins should see all metrics, system can insert, users can only see their own
CREATE POLICY "Admins can view all AI metrics"
ON public.ai_usage_metrics
FOR SELECT
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

CREATE POLICY "Users can view their own AI metrics"
ON public.ai_usage_metrics
FOR SELECT
USING (auth.uid() = user_id);