-- Add missing RLS INSERT policy for public.perfis to fix user registration
-- This allows users to create their own profiles during signup

CREATE POLICY "Users can create own profile" 
ON public.perfis 
FOR INSERT 
WITH CHECK (auth.uid() = id);