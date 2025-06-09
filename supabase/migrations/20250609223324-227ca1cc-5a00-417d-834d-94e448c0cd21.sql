
-- Adicionar constraint única para session_id para prevenir duplicações
ALTER TABLE public.marketing_diagnostics 
ADD CONSTRAINT marketing_diagnostics_session_id_unique UNIQUE (session_id);
