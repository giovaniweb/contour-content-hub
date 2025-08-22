-- Fix security vulnerability: Restrict contact_leads access to admin users only
-- Drop the current overly permissive policy that allows any authenticated user to access all contact leads
DROP POLICY IF EXISTS "Only authenticated can manage contact leads" ON public.contact_leads;

-- Create admin-only access policy for contact leads
-- Only users with admin or superadmin roles can view and manage contact leads
CREATE POLICY "Admin only access to contact leads" 
ON public.contact_leads 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.perfis 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
);

-- Ensure RLS is enabled on the table
ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_leads FORCE ROW LEVEL SECURITY;