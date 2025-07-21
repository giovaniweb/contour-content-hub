-- Adicionar colunas do protocolo completo na tabela before_after_photos
ALTER TABLE public.before_after_photos 
ADD COLUMN equipment_parameters JSONB DEFAULT '{}',
ADD COLUMN treated_areas TEXT[] DEFAULT '{}',
ADD COLUMN treatment_objective TEXT,
ADD COLUMN associated_therapies TEXT[] DEFAULT '{}',
ADD COLUMN session_interval INTEGER,
ADD COLUMN session_count INTEGER,
ADD COLUMN session_notes TEXT;

-- Adicionar comentários para documentar os novos campos
COMMENT ON COLUMN public.before_after_photos.equipment_parameters IS 'Parâmetros do equipamento: intensidade, frequência, tempo, etc';
COMMENT ON COLUMN public.before_after_photos.treated_areas IS 'Áreas tratadas durante o procedimento';
COMMENT ON COLUMN public.before_after_photos.treatment_objective IS 'Objetivo principal do tratamento';
COMMENT ON COLUMN public.before_after_photos.associated_therapies IS 'Outras terapias e cosmetologia associadas';
COMMENT ON COLUMN public.before_after_photos.session_interval IS 'Intervalo entre sessões em dias';
COMMENT ON COLUMN public.before_after_photos.session_count IS 'Número total de sessões';
COMMENT ON COLUMN public.before_after_photos.session_notes IS 'Observações sobre as sessões e evolução';