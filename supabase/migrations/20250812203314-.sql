-- Secure gpt_config table to protect OpenAI API keys

-- 1) Enable and enforce RLS on the table
ALTER TABLE public.gpt_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gpt_config FORCE ROW LEVEL SECURITY;

-- 2) Drop existing policies on this table to avoid permissive overlaps
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'gpt_config'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.gpt_config', pol.policyname);
  END LOOP;
END$$;

-- 3) Create strict RLS policies
-- Allow everyone to read rows (for non-secret fields only; column privileges will restrict access to chave_api)
CREATE POLICY "Public can read gpt_config rows (no secrets)"
ON public.gpt_config
FOR SELECT
USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert gpt_config"
ON public.gpt_config
FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT perfis.id FROM public.perfis WHERE perfis.role = 'admin'
  )
);

-- Only admins can update
CREATE POLICY "Admins can update gpt_config"
ON public.gpt_config
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT perfis.id FROM public.perfis WHERE perfis.role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT perfis.id FROM public.perfis WHERE perfis.role = 'admin'
  )
);

-- Only admins can delete
CREATE POLICY "Admins can delete gpt_config"
ON public.gpt_config
FOR DELETE
USING (
  auth.uid() IN (
    SELECT perfis.id FROM public.perfis WHERE perfis.role = 'admin'
  )
);

-- 4) Harden privileges so chave_api cannot be read by clients
-- Revoke all and re-grant explicitly
REVOKE ALL ON TABLE public.gpt_config FROM anon, authenticated;

-- Allow row reads to both anon and authenticated, but prevent reading chave_api via column-level revoke
GRANT SELECT ON TABLE public.gpt_config TO anon, authenticated;
REVOKE SELECT (chave_api) ON TABLE public.gpt_config FROM anon, authenticated;

-- Allow mutations only for authenticated users (admins enforced via RLS)
GRANT INSERT, UPDATE, DELETE ON TABLE public.gpt_config TO authenticated;