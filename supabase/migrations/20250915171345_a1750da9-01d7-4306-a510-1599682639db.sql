-- FINAL CRITICAL FIX: Secure Videomakers Table
-- Ensure videomakers table is properly secured from public access

-- Update the videomakers table policy to restrict public access to sensitive fields
DROP POLICY IF EXISTS "Public can view basic videomaker info" ON public.videomakers;

-- Create a more restrictive policy - only authenticated users can search videomakers
-- Public access should use the videomakers_public view instead
CREATE POLICY "Authenticated users can search videomakers"
ON public.videomakers
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Videomakers can manage own profiles"
ON public.videomakers
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all videomakers"
ON public.videomakers
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());