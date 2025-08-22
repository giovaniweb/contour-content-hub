-- Fix critical security vulnerability: Remove public access to professional profiles
-- This policy exposes sensitive customer data to any authenticated user
DROP POLICY IF EXISTS "Public can view professional basic info only" ON public.perfis;

-- The existing secure policies already ensure:
-- 1. Users can only view their own profiles
-- 2. Users can only update their own profiles  
-- 3. Admins can manage all profiles
-- No additional public access policies are needed for security