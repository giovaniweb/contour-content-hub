-- Clean up the public view for better security
-- Application code now handles security properly with admin checks

DROP VIEW IF EXISTS public.gpt_config_safe;

-- Ensure the main table remains properly secured
ALTER TABLE public.gpt_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gpt_config FORCE ROW LEVEL SECURITY;

-- Verify that only admin users can access gpt_config
-- The existing policy "Admin only access to gpt_config" should be the only one needed