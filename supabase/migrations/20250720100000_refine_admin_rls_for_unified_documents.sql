-- Drop the existing placeholder admin policy if it was created by the DO block
-- The name was "Admins can manage all documents"
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policy
    WHERE polname = 'Admins can manage all documents'
    AND polrelid = 'public.unified_documents'::regclass
  ) THEN
    DROP POLICY "Admins can manage all documents" ON public.unified_documents;
    RAISE NOTICE 'Dropped existing policy "Admins can manage all documents" on public.unified_documents';
  END IF;
END $$;

-- Create a new, more specific admin policy for unified_documents
-- This policy grants admin users full access (SELECT, INSERT, UPDATE, DELETE)
-- Assumes admin role is determined by a custom JWT claim, e.g., app_metadata.role = 'admin'
CREATE POLICY "Admin full access on unified documents"
ON public.unified_documents
FOR ALL
TO authenticated -- Admins are authenticated users
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

COMMENT ON POLICY "Admin full access on unified documents" ON public.unified_documents IS
'Grants users with the admin role (checked via JWT app_metadata.role claim) full CRUD access to all unified documents.';

RAISE NOTICE 'Created new policy "Admin full access on unified documents" on public.unified_documents';
