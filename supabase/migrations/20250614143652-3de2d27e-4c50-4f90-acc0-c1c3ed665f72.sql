
-- ADICIONAR campos para perfil/role, especialidade, cidade, estado e geolocalização à tabela de perfis
ALTER TABLE public.perfis
  ADD COLUMN IF NOT EXISTS perfil_tipo TEXT,                      -- cliente_final, medico, nao_medico, etc.
  ADD COLUMN IF NOT EXISTS especialidade TEXT,                    -- ex: dermatologista, fisioterapeuta, dentista
  ADD COLUMN IF NOT EXISTS cidade TEXT,                           -- cidade do profissional
  ADD COLUMN IF NOT EXISTS estado TEXT,                           -- estado da clínica
  ADD COLUMN IF NOT EXISTS endereco_completo TEXT,                -- endereço textual
  ADD COLUMN IF NOT EXISTS lat NUMERIC(9,6),                      -- latitude para geolocalização precisa
  ADD COLUMN IF NOT EXISTS lng NUMERIC(9,6);                      -- longitude para geolocalização precisa

-- Garantir indices para buscar por cidade, estado, especialidade e geolocalização mais facilmente
CREATE INDEX IF NOT EXISTS perfis_cidade_idx ON public.perfis(cidade);
CREATE INDEX IF NOT EXISTS perfis_estado_idx ON public.perfis(estado);
CREATE INDEX IF NOT EXISTS perfis_especialidade_idx ON public.perfis(especialidade);
CREATE INDEX IF NOT EXISTS perfis_geo_idx ON public.perfis(lat, lng);

-- Observação: se preferir criar uma tabela específica para especialidades, favor pedir!

-- (Opcional: recomenda-se revisar RLS se desejar restringir acesso a perfis sensíveis)
